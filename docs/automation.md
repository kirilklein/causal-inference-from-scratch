# Automation and publishing

## What we need now

GitHub hosts the Markdown course and README artwork directly. The simulations linked from the chapters already run on the Causal Sandbox website. A separate deployment service would currently have no course website to deploy.

Our [CI workflow](../.github/workflows/ci.yml) runs on pushes and pull requests with Python 3.10 and 3.13. It verifies numerical behavior, the lesson manifest and prerequisites, local links including HTML image references, execution of each registered lab, and synchronization of the SVG artwork with its HTML sources. The workflow has read-only repository permissions.

CI does not establish learner comprehension, check live external links, or test a tutor's behavior. Those need separate evaluation.

## How AI Engineering from Scratch handles it

Inspected revision: [`8bc378c`](https://github.com/rohitg00/ai-engineering-from-scratch/tree/8bc378c2e07777899322ae77cd0dde94cb12fab3).

| Concern | Reference course | This course |
| --- | --- | --- |
| Curriculum and code | [Curriculum workflow](https://github.com/rohitg00/ai-engineering-from-scratch/blob/8bc378c2e07777899322ae77cd0dde94cb12fab3/.github/workflows/curriculum.yml): audits, lesson tests, site build, route checks, skill consistency, and generated-content synchronization | Keep the existing numerical and course checks; verify README exports as part of CI |
| Website | [Vercel configuration](https://github.com/rohitg00/ai-engineering-from-scratch/blob/8bc378c2e07777899322ae77cd0dde94cb12fab3/vercel.json): runs `node site/build.js`, serves `site/`, and routes lesson and Markdown requests through API handlers | No separate website yet; GitHub renders the course and Causal Sandbox hosts experiments |
| Books | [Book workflow](https://github.com/rohitg00/ai-engineering-from-scratch/blob/8bc378c2e07777899322ae77cd0dde94cb12fab3/.github/workflows/build-book.yml): EPUB on relevant pushes, EPUB/PDF on manual runs and releases, and release attachments | Defer until enough chapters exist to justify a book and its rendering checks |
| Languages | [Translation workflow](https://github.com/rohitg00/ai-engineering-from-scratch/blob/8bc378c2e07777899322ae77cd0dde94cb12fab3/.github/workflows/translate.yml): machine translation of lessons and interface strings, published on a translations branch | English only for now; add translation together with review of technical terminology |

These files show configured automation. We have not verified the reference project's hosting dashboard, secrets, or deployment account settings.

## When to add deployment

Add a reading website when we want navigation, search, or a reading experience beyond GitHub. Generate it from the existing Markdown and `course.json`, validate the build and local routes in pull requests, and deploy only after the checks pass on `main`.

GitHub Pages would be a suitable first option for a static reader. Vercel becomes relevant if we need server-side routes like the reference course's lesson and Markdown handlers. Neither platform is required to embed the current SVG banner in a README.

Book generation and translation are independent additions, not prerequisites for publishing new chapters. Preserve one source for lesson content across the repository, any future website, and future books.
