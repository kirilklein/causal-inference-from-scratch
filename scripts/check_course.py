"""Check course artifacts and local Markdown links, then execute every registered lab."""

import json
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


def check():
    course = json.loads((ROOT / "course.json").read_text())
    seen = set()
    paths = set()
    labs = []
    for lesson in course["lessons"]:
        lesson_id = lesson["id"]
        if lesson_id in seen or lesson["path"] in paths:
            raise ValueError(f"Duplicate lesson: {lesson_id}")
        if not set(lesson["prerequisites"]) <= seen:
            raise ValueError(f"Missing or out-of-order prerequisite: {lesson_id}")
        directory = (ROOT / lesson["path"]).resolve()
        if not directory.is_relative_to(ROOT):
            raise ValueError(f"Lesson path escapes course: {lesson_id}")
        for filename in (
            "README.md",
            "exercises.md",
            "solutions.md",
            "code/simulation.py",
        ):
            if not (directory / filename).is_file():
                raise ValueError(f"Missing artifact: {lesson_id}/{filename}")
        url = urlsplit(lesson["sandbox_url"])
        if url.scheme != "https" or url.netloc != "kirilklein.github.io":
            raise ValueError(f"Invalid Sandbox link: {lesson_id}")
        seen.add(lesson_id)
        paths.add(lesson["path"])
        labs.append(directory / "code/simulation.py")
    if not labs:
        raise ValueError("The course has no registered lessons.")

    # The authored Markdown uses inline links; external availability is not checked.
    for document in ROOT.rglob("*.md"):
        if any(part.startswith(".") for part in document.relative_to(ROOT).parts):
            continue
        if document.name == "CAUSAL-LEARNING.md":
            continue
        for target in re.findall(r"\[[^\]]*\]\(([^\s)]+)\)", document.read_text()):
            url = urlsplit(target)
            if url.scheme or not url.path:
                continue
            destination = (document.parent / unquote(url.path)).resolve()
            if not destination.is_relative_to(ROOT) or not destination.exists():
                raise ValueError(
                    f"Broken local link in {document.relative_to(ROOT)}: {target}"
                )

    print(
        f"Checked {len(labs)} lessons, prerequisites, artifacts, and local links.",
        flush=True,
    )
    for lab in labs:
        print(f"\nRunning {lab.relative_to(ROOT)}", flush=True)
        subprocess.run([sys.executable, str(lab)], cwd=ROOT, check=True)


if __name__ == "__main__":
    check()
