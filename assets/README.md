# README artwork

The HTML files are the editable sources for the README's SVG images. `banner-mobile.html` is a compact composition, selected by the README's `<picture>` element on narrow screens. `curriculum.html` depicts the learning route, not a causal graph or an exhaustive prerequisite graph. Companion-chapter status is distinct from existing Sandbox coverage.

The visual direction follows the reference supplied for this project: warm paper (`#fafaf6`), cobalt (`#4053f4`), dark ink (`#192226`), muted text (`#59636f`), and fine rules (`#d6dce1`). System Arial, Georgia, and Courier New font stacks keep the images independent of external font services. These are deliberate fallback families, not copies of the reference course's fonts or artwork.

Regenerate the SVGs after editing the HTML:

```bash
python3 scripts/export_diagrams.py
python3 scripts/export_diagrams.py --check
```

CI checks that exports match their source, are valid accessible SVGs, and contain no scripts or external resources. Preview the HTML and the exported SVG on desktop and at phone width. When adding chapters, update the banner's chapter count and the map's status labels alongside the README and curriculum.
