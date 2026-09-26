# Automation and publishing

## One source for the course

The reading website is generated from `course.json`, the chapter Markdown, their Python labs, and `CURRICULUM.md`. GitHub and the website present the same lessons. Causal Sandbox hosts the interactive experiments linked by the manifest and chapters.

`node site/build.mjs` writes a static site to ignored `dist/`. It uses Marked to render Markdown during the build, rewrites links between published chapters and exercises to website routes, and links other repository files back to GitHub. Each chapter's opening `**Takeaway:**` supplies its catalog description. Raw HTML in Markdown is escaped. The current lessons use ordinary Markdown and code notation; there is no LaTeX or custom figure-block renderer.

The generated HTML contains the lesson text, navigation, and roadmap. JavaScript enhances it with chapter filtering, a theme preference, and optional reading marks. Reading and following links work without JavaScript. Browser progress is a local reading record, not validated mastery, and is separate from the tutor's `CAUSAL-LEARNING.md` and Sandbox progress. The site does not add analytics, accounts, or external font requests.

## Preview and check

Use Node.js 22 or newer. Python 3.10 or newer remains sufficient for course labs and scientific checks.

```bash
npm ci
npm run build
npm run preview
```

Open <http://127.0.0.1:4173/causal-inference-from-scratch/>. The preview serves only `dist/`, at the same project path used on GitHub Pages. It does not hot reload: rebuild and refresh after edits. Set `PORT` to choose a different preview port.

```bash
npm test
npx playwright install chromium
npm run test:browser
npm run format:check
```

For local Chrome instead of downloaded Chromium, run `PLAYWRIGHT_CHANNEL=chrome npm run test:browser`. Browser tests start their own server on port 4173, which must be free.

Build tests verify every published section, unchanged downloadable labs, internal routes and heading anchors, and separation of solutions. Browser tests exercise search, chapter navigation, reading marks, denied storage, JavaScript-disabled reading, and light/dark layouts at phone and desktop widths. Screenshots are written to ignored `test-results/` for visual inspection.

The [course workflow](../.github/workflows/ci.yml) continues to check numerical behavior, manifest prerequisites, links, registered labs, and README artwork on Python 3.10 and 3.13. The [website workflow](../.github/workflows/website.yml) also runs course checks before building and testing the reader. These checks do not establish learner comprehension or verify live external links.

## GitHub Pages

The site targets <https://kirilklein.github.io/causal-inference-from-scratch/>. In repository **Settings → Pages**, set the source to **GitHub Actions** before the first deployment. No custom domain or paid hosting is required.

Pull requests build and test the site and upload the Pages artifact without deploying. On `main`, the deploy job runs only after the build and its checks succeed. Only the deploy job receives `pages: write` and `id-token: write`. A manual workflow run from `main` can redeploy the course. Keep the base path and canonical origin in `site/build.mjs` aligned if the hosting address changes.

## Relationship to the reference course

The format is inspired by [AI Engineering from Scratch](https://github.com/rohitg00/ai-engineering-from-scratch), whose automation was initially inspected at [`8bc378c`](https://github.com/rohitg00/ai-engineering-from-scratch/tree/8bc378c2e07777899322ae77cd0dde94cb12fab3). This reader uses an original layout following our README artwork and pre-renders lessons rather than loading lesson Markdown from GitHub while someone is reading. It does not require the reference course's server-side routes.

Book generation and translation remain independent future additions. Keep one source for lesson content when adding either.
