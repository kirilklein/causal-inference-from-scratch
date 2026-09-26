import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, access } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { build, ROOT, BASE } from "../build.mjs";

let output;
let course;
before(async () => {
  output = await mkdtemp(path.join(os.tmpdir(), "causal-course-"));
  course = JSON.parse(await readFile(path.join(ROOT, "course.json"), "utf8"));
  await build(output);
});
after(async () => {
  if (output) await rm(output, { recursive: true, force: true });
});
const read = (file) => readFile(path.join(output, file), "utf8");

test("each published chapter has all four readable sections and an unchanged downloadable lab", async () => {
  const home = await read("index.html");
  for (const lesson of course.lessons) {
    assert.ok(home.includes(`data-lesson-id="${lesson.id}"`));
    for (const section of ["", "exercises/", "solutions/", "code/"]) {
      const html = await read(`lessons/${lesson.id}/${section}index.html`);
      assert.ok(html.includes('<article class="prose">'));
      assert.ok(html.includes(lesson.sandbox_url));
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    }
    assert.equal(
      await read(`lessons/${lesson.id}/code/simulation.py`),
      await readFile(
        path.join(ROOT, lesson.path, "code/simulation.py"),
        "utf8",
      ),
    );
  }
  assert.equal(
    (home.match(/data-lesson-id=/g) || []).length,
    course.lessons.length,
  );
});

test("all generated internal links, assets, and heading fragments resolve under the project base", async () => {
  const files = (await readdir(output, { recursive: true })).filter((file) =>
    file.endsWith(".html"),
  );
  for (const file of files) {
    const html = await read(file);
    for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const href = raw.replaceAll("&amp;", "&");
      if (/^(https?:|mailto:)/.test(href)) continue;
      const parsed = new URL(href, `https://course.test${BASE}${file}`);
      assert.ok(
        parsed.pathname.startsWith(BASE),
        `${file}: ${href} escapes the site base`,
      );
      let target = decodeURIComponent(parsed.pathname.slice(BASE.length));
      if (target.endsWith("/") || !target) target += "index.html";
      await assert.doesNotReject(
        access(path.join(output, target)),
        `${file}: missing ${href}`,
      );
      if (parsed.hash && target.endsWith(".html")) {
        assert.ok(
          (await read(target)).includes(
            `id="${decodeURIComponent(parsed.hash.slice(1))}"`,
          ),
          `${file}: missing heading ${href}`,
        );
      }
    }
  }
});

test("relative chapter and exercise links stay in the reader and solutions stay separate", async () => {
  const lesson = await read("lessons/what-if/index.html");
  assert.ok(lesson.includes(`href="${BASE}lessons/randomization/"`));
  assert.ok(lesson.includes(`href="${BASE}lessons/what-if/exercises/"`));
  assert.ok(!lesson.includes("The observed difference rises to about +38.67"));
  assert.ok(
    (await read("lessons/what-if/solutions/index.html")).includes(
      "The observed difference rises to about +38.67",
    ),
  );
});

test("the roadmap preserves the distinction between available and unwritten material", async () => {
  const html = await read("curriculum/index.html");
  assert.ok(html.includes("To adapt"));
  assert.ok(html.includes("Proposed"));
  assert.ok(html.includes(`href="${BASE}lessons/confounding/"`));
  const sitemap = await read("sitemap.xml");
  for (const lesson of course.lessons)
    assert.ok(sitemap.includes(`${BASE}lessons/${lesson.id}/`));
});
