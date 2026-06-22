#!/usr/bin/env python3
"""Validate that an agent website profile is only a mirror of agent-profile.md."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def field_value(profile: str, label: str) -> str | None:
    pattern = rf"(?mi)^-\s*{re.escape(label)}:\s*(.+?)\s*$"
    match = re.search(pattern, profile)
    return match.group(1).strip() if match else None


def normalize(value: str | None) -> str:
    return re.sub(r"\s+", " ", value or "").strip().lower()


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check a website agent profile against agents/{handle}/agent-profile.md."
    )
    parser.add_argument("--agent", required=True, help="Agent handle, such as ana-recruiter.")
    parser.add_argument(
        "--profile",
        help="Optional profile path. Defaults to agents/{agent}/agent-profile.md.",
    )
    parser.add_argument(
        "--website",
        help="Optional website page path. Defaults to maps/org-chart/agents/{agent}/index.html.",
    )
    args = parser.parse_args()

    profile_path = Path(args.profile) if args.profile else ROOT / "agents" / args.agent / "agent-profile.md"
    website_path = (
        Path(args.website)
        if args.website
        else ROOT / "maps" / "org-chart" / "agents" / args.agent / "index.html"
    )

    errors: list[str] = []
    warnings: list[str] = []

    if not profile_path.exists():
        errors.append(f"missing profile: {profile_path}")
    if not website_path.exists():
        errors.append(f"missing website profile page: {website_path}")
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    profile = read_text(profile_path)
    website = read_text(website_path)
    website_plain = re.sub(r"<[^>]+>", " ", website)

    mirror_terms = ["mirror", "authority", "agent-profile.md"]
    for term in mirror_terms:
        if term.lower() not in website_plain.lower():
            errors.append(f"website page does not mention required mirror boundary term: {term}")

    fields = {
        "Agent": field_value(profile, "Agent"),
        "Agent handle": field_value(profile, "Agent handle"),
        "Profile status": field_value(profile, "Profile status"),
        "Current category": field_value(profile, "Current category"),
        "Primary voice": field_value(profile, "Primary voice"),
        "Secondary voice blend": field_value(profile, "Secondary voice blend"),
        "Voice blend ratio": field_value(profile, "Voice blend ratio"),
        "Voice intensity": field_value(profile, "Voice intensity"),
        "Runtime enforcement status": field_value(profile, "Runtime enforcement status"),
        "Next MAPS skill": field_value(profile, "Next MAPS skill"),
    }

    for label, value in fields.items():
        if not value or "{{" in value:
            warnings.append(f"profile field is blank or templated: {label}")
            continue
        if normalize(value) not in normalize(website_plain):
            warnings.append(f"website page may be stale for profile field {label}: {value}")

    forbidden_claims = [
        "this page grants authority",
        "website grants authority",
        "approved by this page",
        "activation approved by website",
    ]
    for claim in forbidden_claims:
        if claim in website_plain.lower():
            errors.append(f"website page contains forbidden authority claim: {claim}")

    for warning in warnings:
        print(f"WARNING: {warning}")
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    print(f"Agent profile mirror check passed for {args.agent}.")
    if warnings:
        print("Warnings indicate fields that should be manually reviewed before publish.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
