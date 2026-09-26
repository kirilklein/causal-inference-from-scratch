import { readFile, writeFile, mkdir, cp, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";

export const ROOT = fileURLToPath(new URL("../", import.meta.url));
const REPO = "https://github.com/kirilklein/causal-inference-from-scratch";
export const BASE = "/causal-inference-from-scratch/";
const ORIGIN = "https://kirilklein.github.io";
const escape = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const read = (file) => readFile(path.join(ROOT, file), "utf8");
const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
const sections = {
  lesson: "README.md",
  exercises: "exercises.md",
  solutions: "solutions.md",
  code: "code/simulation.py",
};
const labels = {
  lesson: "Lesson",
  exercises: "Exercises",
  solutions: "Solutions",
  code: "Python lab",
};

export async function build(output = path.join(ROOT, "dist")) {
  const course = JSON.parse(await read("course.json"));
  const routes = new Map([
    ["README.md", ""],
    ["CURRICULUM.md", "curriculum/"],
  ]);
  for (const lesson of course.lessons) {
    for (const [section, filename] of Object.entries(sections)) {
      routes.set(
        `${lesson.path}/${filename}`,
        `lessons/${lesson.id}/${section === "lesson" ? "" : section + "/"}`,
      );
    }
  }
  const url = (route = "") => BASE + route;
  function resolveLink(href, source) {
    if (/^(https?:|mailto:)/i.test(href)) return href;
    if (href.startsWith("#")) return href;
    if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith("//"))
      throw new Error(`Unsupported link in ${source}: ${href}`);
    const link = new URL(href, `https://course.local/${source}`);
    const target = decodeURIComponent(link.pathname.slice(1));
    if (routes.has(target))
      return url(routes.get(target)) + link.search + link.hash;
    return `${REPO}/blob/main/${target}${link.search}${link.hash}`;
  }
  function markdown(content, source) {
    const headings = [];
    const used = new Map();
    const parser = new Marked({
      renderer: {
        heading({ tokens, depth }) {
          const text = this.parser.parseInline(tokens);
          const base = slug(text.replace(/<[^>]+>/g, ""));
          const count = used.get(base) || 0;
          used.set(base, count + 1);
          const id = base + (count ? `-${count}` : "");
          if (depth === 2) headings.push({ id, text });
          return `<h${depth} id="${escape(id)}">${text}</h${depth}>`;
        },
        link({ href, tokens, title }) {
          return `<a href="${escape(resolveLink(href, source))}"${title ? ` title="${escape(title)}"` : ""}>${this.parser.parseInline(tokens)}</a>`;
        },
        image({ href, text }) {
          return `<img src="${escape(resolveLink(href, source))}" alt="${escape(text)}" loading="lazy">`;
        },
        html({ text }) {
          return escape(text);
        },
        table(token) {
          return `<div class="table-scroll" tabindex="0" role="region" aria-label="Scrollable table">${this.constructor.prototype.table.call(this, token)}</div>`;
        },
      },
    });
    return { html: parser.parse(content), headings };
  }
  const descriptions = new Map();
  for (const lesson of course.lessons) {
    const text = await read(`${lesson.path}/README.md`);
    const takeaway = text.match(/\*\*Takeaway:\*\*\s*(.+)/)?.[1];
    if (!takeaway) throw new Error(`Missing takeaway: ${lesson.id}`);
    descriptions.set(lesson.id, takeaway);
  }
  function shell({ title, description, route = "", body }) {
    return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}${title === course.title ? "" : ` · ${escape(course.title)}`}</title>
<meta name="description" content="${escape(description)}"><meta name="color-scheme" content="light dark">
<link rel="canonical" href="${ORIGIN}${url(route)}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${ORIGIN}${url(route)}">
<link rel="icon" href="${url("favicon.svg")}" type="image/svg+xml"><link rel="stylesheet" href="${url("style.css")}">
<script src="${url("theme.js")}"></script><script src="${url("app.js")}" defer></script></head>
<body><a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><a class="brand" href="${url()}" aria-label="Causal Inference from Scratch home"><span class="brand-mark" aria-hidden="true">C.</span><span>CAUSAL INFERENCE<span class="brand-sub">FROM SCRATCH</span></span></a>
<nav aria-label="Main navigation"><a href="${url()}#chapters"${route === "" ? ' aria-current="page"' : ""}>Chapters</a><a href="${url("curriculum/")}"${route === "curriculum/" ? ' aria-current="page"' : ""}>Roadmap</a><a href="${REPO}">GitHub <span aria-hidden="true">↗</span></a><button class="theme-toggle" type="button" aria-label="Use dark theme" hidden>Dark</button></nav></header>
${body}
<footer class="site-footer"><div><strong>${escape(course.title)}</strong><p>By Kiril Klein · Free and open source · <a href="${REPO}/blob/main/LICENSE">MIT license</a></p></div><div><a href="${REPO}/issues">Suggest a correction ↗</a><p>Experiments in <a href="https://kirilklein.github.io/causal-sandbox/">Causal Sandbox</a></p></div></footer></body></html>`;
  }
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  async function page(route, options) {
    const file = path.join(output, route, "index.html");
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, shell({ ...options, route }));
  }
  for (const file of ["style.css", "app.js", "theme.js", "favicon.svg"])
    await cp(path.join(ROOT, "site", file), path.join(output, file));
  const first = course.lessons[0];
  await page("", {
    title: course.title,
    description:
      "Learn causal inference through guided experiments, clear explanations, and Python labs. Read the idea. Run the experiment. Build the intuition.",
    body: `<main id="main" class="home"><section class="hero"><div class="eyebrow">AN INTERACTIVE FIELD GUIDE <span>OPEN SOURCE / MIT</span></div><h1>Causal inference<br><span>from scratch.</span></h1><p class="hero-lede">Understand what would change<br class="desktop-break"> if we intervened.</p><p class="hero-description">Read the idea. Run the experiment. Build the intuition.<br>Guided chapters and Python labs, with Causal Sandbox at the center.</p><div class="hero-actions"><a class="button primary" href="${url(`lessons/${first.id}/`)}">Start the course <span aria-hidden="true">↗</span></a><a class="text-link" href="#chapters">Explore the chapters <span aria-hidden="true">↓</span></a></div><div class="hero-note">${course.lessons.length} chapters available <span>·</span> No signup <span>·</span> Coding optional</div></section>
<section class="course-intro" aria-label="How to learn"><p class="eyebrow">THE APPROACH</p><p class="approach-title">A question before a formula.</p><p>Make a prediction. Change a simulated world. Explain what happens, then reproduce the calculation yourself.</p><a class="text-link" href="${url("curriculum/")}">See where the course is going ↗</a></section>
<section id="chapters" class="chapters"><div class="section-top"><div><p class="eyebrow">THE OPENING CHAPTERS</p><h2>Start with a question.</h2></div><div class="search" hidden><label for="chapter-search">Find a chapter</label><input id="chapter-search" type="search" placeholder="Search topics…" autocomplete="off"></div></div>
<p class="chapter-count" aria-live="polite">${course.lessons.length} chapters available. More are on the <a href="${url("curriculum/")}">roadmap</a>.</p>
<ol class="chapter-list">${course.lessons.map((lesson, i) => `<li class="chapter" data-search="${escape(`${lesson.id} ${lesson.title} ${descriptions.get(lesson.id)}`.toLowerCase())}" data-lesson-id="${escape(lesson.id)}"><span class="chapter-number">${String(i + 1).padStart(2, "0")}</span><div class="chapter-body"><div class="chapter-meta">${escape(lesson.path.split("/")[1].replace(/^\d+-/, "").replaceAll("-", " "))}<span class="completed-label" hidden>Read ✓</span></div><h3><a href="${url(`lessons/${lesson.id}/`)}">${escape(lesson.title)}<span class="chapter-arrow" aria-hidden="true">↗</span></a></h3><p>${escape(descriptions.get(lesson.id))}</p><div class="chapter-links"><a href="${url(`lessons/${lesson.id}/exercises/`)}">Exercises</a><a href="${url(`lessons/${lesson.id}/code/`)}">Python lab</a><a href="${escape(lesson.sandbox_url)}">Interactive experiment ↗</a></div></div></li>`).join("")}</ol><p class="empty-search" hidden>No chapters match. Try “treatment”, “randomization”, or clear your search.</p></section>
<section class="study-note"><div><p class="eyebrow">CHOOSE YOUR DEPTH</p><h2>Read. Experiment.<br>Then make it your own.</h2></div><div><p>No setup is needed for the chapters or browser experiments. The coding path uses Python 3.10 or newer, with no third-party packages.</p><p>Prefer a conversation? The repository includes an optional tutor skill that works with a local course checkout.</p><a class="text-link" href="${REPO}#study-with-a-tutor">Study with a tutor ↗</a></div></section></main>`,
  });
  function sidebar(current, headings) {
    return `<aside class="reader-sidebar"><details class="contents" open><summary>Course contents</summary><ol>${course.lessons.map((lesson, i) => `<li><a href="${url(`lessons/${lesson.id}/`)}"${current?.id === lesson.id ? ' aria-current="page"' : ""}><span>${String(i + 1).padStart(2, "0")}</span>${escape(lesson.title)}</a></li>`).join("")}</ol><a class="roadmap-link" href="${url("curriculum/")}">Full curriculum & roadmap ↗</a></details>${headings.length ? `<nav class="on-this-page" aria-label="On this page"><p class="eyebrow">ON THIS PAGE</p>${headings.map((h) => `<a href="#${escape(h.id)}">${h.text}</a>`).join("")}</nav>` : ""}</aside>`;
  }
  for (let i = 0; i < course.lessons.length; i++) {
    const lesson = course.lessons[i];
    for (const [section, filename] of Object.entries(sections)) {
      const source = `${lesson.path}/${filename}`;
      const content = await read(source);
      const rendered =
        section === "code"
          ? {
              html: `<h1>Python lab: ${escape(lesson.title)}</h1><p>Run this lab locally with Python 3.10 or newer. No third-party packages are required.</p><p>From your <a href="${REPO}#run-it-yourself">course checkout</a>:</p><pre><code>python3 ${escape(source)}</code></pre><p><a href="simulation.py" download>Download simulation.py</a> · <a href="${REPO}/blob/main/${source}">View source on GitHub ↗</a></p><pre class="source-code"><code>${escape(content)}</code></pre>`,
              headings: [],
            }
          : markdown(content, source);
      const route = routes.get(source);
      const next = course.lessons[i + 1];
      const previous = course.lessons[i - 1];
      await page(route, {
        title:
          section === "lesson"
            ? lesson.title
            : `${labels[section]}: ${lesson.title}`,
        description: descriptions.get(lesson.id),
        body: `<main id="main" class="reader-layout">${sidebar(lesson, rendered.headings)}<div class="reader-main"><div class="reader-kicker"><a href="${url()}#chapters">Chapters</a><span>/</span><span>CHAPTER ${String(i + 1).padStart(2, "0")}</span></div><nav class="lesson-tabs" aria-label="Chapter sections">${Object.keys(
          sections,
        )
          .map(
            (key) =>
              `<a href="${url(routes.get(`${lesson.path}/${sections[key]}`))}"${key === section ? ' aria-current="page"' : ""}>${labels[key]}</a>`,
          )
          .join("")}</nav>
${section === "solutions" ? '<p class="solution-note">Worked solutions follow. Try the exercises first, then compare your reasoning.</p>' : ""}<article class="prose">${rendered.html}</article>
<div class="experiment-link"><div><span class="eyebrow">TRY IT IN THE BROWSER</span><p>Explore this chapter’s interactive experiment.</p></div><a class="button" href="${escape(lesson.sandbox_url)}">Open Causal Sandbox ↗</a></div>
${section === "lesson" ? `<div class="reading-progress" hidden><label><input type="checkbox" data-complete="${escape(lesson.id)}"> Mark this chapter as read</label><p class="storage-note" role="status">Saved in this browser only. A reading record, not a mastery score.</p></div>` : ""}
<nav class="chapter-pagination" aria-label="Chapter navigation">${previous ? `<a href="${url(`lessons/${previous.id}/`)}"><span>← PREVIOUS CHAPTER</span>${escape(previous.title)}</a>` : "<span></span>"}${next ? `<a href="${url(`lessons/${next.id}/`)}"><span>NEXT CHAPTER →</span>${escape(next.title)}</a>` : `<a href="${url("curriculum/")}"><span>WHAT COMES NEXT →</span>Explore the roadmap</a>`}</nav><p class="source-link"><a href="${REPO}/blob/main/${source}">Read this source on GitHub ↗</a></p></div></main>`,
      });
      if (section === "code")
        await writeFile(path.join(output, route, "simulation.py"), content);
    }
  }
  const curriculum = markdown(await read("CURRICULUM.md"), "CURRICULUM.md");
  await page("curriculum/", {
    title: "Curriculum & roadmap",
    description:
      "Available chapters, planned adaptations, and the path through causal inference.",
    body: `<main id="main" class="reader-layout">${sidebar(null, curriculum.headings)}<div class="reader-main"><div class="reader-kicker">THE LEARNING PATH</div><article class="prose">${curriculum.html}</article></div></main>`,
  });
  await writeFile(
    path.join(output, "404.html"),
    shell({
      title: "Page not found",
      description: "Find your way back to the course.",
      route: "404.html",
      body: `<main id="main" class="not-found"><p class="eyebrow">404 / PAGE NOT FOUND</p><h1>Let’s find your chapter.</h1><p>This page may have moved. All available chapters are in the course contents.</p><a class="button primary" href="${url()}">Back to the course →</a></main>`,
    }),
  );
  await writeFile(path.join(output, ".nojekyll"), "");
  const allRoutes = [
    "",
    "curriculum/",
    ...course.lessons.flatMap((lesson) =>
      Object.values(sections).map((f) => routes.get(`${lesson.path}/${f}`)),
    ),
  ];
  await writeFile(
    path.join(output, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${allRoutes.map((r) => `<url><loc>${ORIGIN}${url(r)}</loc></url>`).join("")}</urlset>`,
  );
  console.log(
    `Built ${course.lessons.length} chapters and ${allRoutes.length} pages in ${output}`,
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await build();
