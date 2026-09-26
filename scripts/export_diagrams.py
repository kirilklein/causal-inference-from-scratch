"""Export self-contained README diagrams from their editable HTML sources."""

import argparse
import re
from pathlib import Path
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
NAMES = ("banner", "banner-mobile", "curriculum")


def export(name, check):
    source = ROOT / "assets" / f"{name}.html"
    diagrams = re.findall(r"<svg\b.*?</svg>", source.read_text(), re.DOTALL)
    if len(diagrams) != 1:
        raise ValueError(f"Expected exactly one SVG in {source.name}")
    svg = diagrams[0]
    root = ElementTree.fromstring(svg)
    namespace = "{http://www.w3.org/2000/svg}"
    if root.tag != namespace + "svg" or not root.get("viewBox"):
        raise ValueError(f"Missing SVG namespace or viewBox: {name}")
    title = root.find(namespace + "title")
    description = root.find(namespace + "desc")
    if title is None or description is None or root[0] is not title:
        raise ValueError(f"Missing accessible title/description: {name}")
    if not title.text or not description.text:
        raise ValueError(f"Empty accessible title/description: {name}")
    if (
        root.get("role") != "img"
        or root.get("aria-labelledby") != f"{name}-title {name}-desc"
    ):
        raise ValueError(f"Invalid accessible labeling: {name}")
    if title.get("id") != f"{name}-title" or description.get("id") != f"{name}-desc":
        raise ValueError(f"Invalid accessible IDs: {name}")
    for element in root.iter():
        if element.tag in {
            namespace + tag for tag in ("script", "foreignObject", "image", "style")
        }:
            raise ValueError(f"Unexpected active or external SVG content: {name}")
        for attribute, value in element.attrib.items():
            if attribute.lower().startswith("on") or attribute.endswith("href"):
                raise ValueError(f"Unexpected SVG event or resource reference: {name}")
            if "url(" in value and not re.fullmatch(r"url\(#[\w-]+\)", value):
                raise ValueError(f"Nonlocal SVG resource: {name}")
    content = '<?xml version="1.0" encoding="UTF-8"?>\n' + svg + "\n"
    destination = source.with_suffix(".svg")
    if check:
        if not destination.exists() or destination.read_text() != content:
            raise ValueError(
                f"Stale export: {destination.name}; run scripts/export_diagrams.py"
            )
    else:
        destination.write_text(content)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check", action="store_true", help="verify committed exports without writing"
    )
    args = parser.parse_args()
    for name in NAMES:
        export(name, args.check)
    print(f"{'Checked' if args.check else 'Exported'} {len(NAMES)} README diagrams.")
