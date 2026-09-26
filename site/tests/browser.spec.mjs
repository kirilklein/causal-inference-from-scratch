import { test, expect } from "@playwright/test";

test("find a chapter, read, practice, reveal solutions, and navigate without errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Causal inferencefrom scratch.",
  );
  await page.getByLabel("Find a chapter").fill("randomization");
  await expect(page.locator(".chapter:visible")).toHaveCount(1);
  await page.getByLabel("Find a chapter").fill("no-such-topic");
  await expect(
    page.getByText("No chapters match.", { exact: false }),
  ).toBeVisible();
  await page.getByLabel("Find a chapter").fill("");
  await page.getByRole("link", { name: "Start the course" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "1. What if?",
  );
  await page.getByLabel("Mark this chapter as read").check();
  await page.reload();
  await expect(page.getByLabel("Mark this chapter as read")).toBeChecked();
  await page
    .getByRole("navigation", { name: "Chapter sections" })
    .getByRole("link", { name: "Exercises", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Exercises: What if?",
  );
  await expect(
    page.getByText("The observed difference rises to about +38.67", {
      exact: false,
    }),
  ).toHaveCount(0);
  await page
    .getByRole("navigation", { name: "Chapter sections" })
    .getByRole("link", { name: "Solutions", exact: true })
    .click();
  await expect(
    page.getByText("The observed difference rises to about +38.67", {
      exact: false,
    }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Chapter sections" })
    .getByRole("link", { name: "Python lab", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Download simulation.py" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Chapter navigation" })
    .getByRole("link", { name: /NEXT CHAPTER/ })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "randomized",
  );
  expect(errors).toEqual([]);
});

test("reading, exercises, and navigation are available without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(
    "http://127.0.0.1:4173/causal-inference-from-scratch/lessons/confounding/",
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "treatment selection",
  );
  await page
    .getByRole("navigation", { name: "Chapter sections" })
    .getByRole("link", { name: "Exercises", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Exercises",
  );
  await context.close();
});

test("denied storage does not break the reader or claim progress was saved", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    }),
  );
  await page.goto("./lessons/what-if/");
  await page.getByLabel("Mark this chapter as read").check();
  await expect(page.getByRole("status")).toContainText(
    "Browser storage is unavailable",
  );
  await page.getByRole("button", { name: "Use dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

for (const width of [390, 1280]) {
  for (const colorScheme of ["light", "dark"]) {
    test(`readable ${width}px ${colorScheme} layout and saved theme`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme });
      for (const route of ["./", "./lessons/what-if/", "./curriculum/"]) {
        await page.goto(route);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
        if (width === 390 && route.includes("lessons")) {
          await page.locator(".contents summary").click();
          await expect(
            page.locator(".contents").getByRole("link", { name: /randomized/ }),
          ).toBeVisible();
        }
        const name =
          route === "./"
            ? "home"
            : route.includes("lessons")
              ? "lesson"
              : "roadmap";
        await page.screenshot({
          path: testInfo.outputPath(`${name}.png`),
          fullPage: true,
        });
      }
      await page
        .getByRole("button", {
          name: colorScheme === "light" ? "Use dark theme" : "Use light theme",
        })
        .click();
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        colorScheme === "light" ? "dark" : "light",
      );
    });
  }
}
