#!/usr/bin/env python3
"""Validate MAPS skill operating contracts."""

from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILLS = ROOT / "skills"

REQUIRED_PATTERNS = {
    "Versioning section": r"(?m)^## Versioning\s*$",
    "Current version": r"(?m)^Current version:\s+\d+\.\d+\.\d+\.\s*$",
    "Changelog section": r"(?m)^## Changelog\s*$",
    "Semver changelog entry": r"(?m)^- \d{4}-\d{2}-\d{2} - v\d+\.\d+\.\d+ - .+",
    "Project foundation lookup": r"project-foundation\.md",
    "MAPS memory helper": r"maps_memory\.py",
    "One-question interview rule": r"Ask exactly one question at a time",
    "Completion report section": r"(?m)^## Completion report\s*$",
    "Output section": r"(?m)^## Output\s*$",
}


def skill_files() -> list[Path]:
    return sorted(SKILLS.glob("*/SKILL.md"))


def validate_skill(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    errors: list[str] = []

    if not text.startswith("---\n") and not text.startswith("---\r\n"):
        errors.append("missing YAML frontmatter fence")

    for label, pattern in REQUIRED_PATTERNS.items():
        if not re.search(pattern, text):
            errors.append(f"missing {label}")

    if path.parent.name == "role":
        for label, pattern in {
            "role authority requirement": r"authority taxonomy",
            "role authority taxonomy": r"role-authority-taxonomy\.md",
            "special authority declarations": r"special declarations",
            "role learning requirement": r"learning loop",
            "implementation recommendation": r"implementation form",
        }.items():
            if not re.search(pattern, text, flags=re.IGNORECASE):
                errors.append(f"missing {label}")

    if path.parent.name == "shape":
        for label, pattern in {
            "shape research and recommend": r"Research and Recommend",
            "shape research sources": r"shape-research-sources\.md",
            "pipeline owner guidance": r"pipeline owner guidance|Pipeline Owner Guidance",
        }.items():
            if not re.search(pattern, text, flags=re.IGNORECASE):
                errors.append(f"missing {label}")

    return errors


def main() -> int:
    files = skill_files()
    if not files:
        print(f"No skills found under {SKILLS}", file=sys.stderr)
        return 1

    failures: dict[Path, list[str]] = {}
    for path in files:
        errors = validate_skill(path)
        if errors:
            failures[path] = errors

    if failures:
        print("MAPS skill contract validation failed:\n")
        for path, errors in failures.items():
            rel = path.relative_to(ROOT)
            print(f"{rel}:")
            for error in errors:
                print(f"  - {error}")
        return 1

    print(f"MAPS skill contract validation passed for {len(files)} skills.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
