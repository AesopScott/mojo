#!/usr/bin/env python3
"""Vik Level 5 product-recommendation automation.

Reader's map
============

Purpose:
    Keep Vik's repeatable Level 5 product-recommendation checks in a readable
    role-local script. The Codex heartbeat is only the timer, live role-context
    worker, Claude runner for Level 4 research, and visible report surface.

What this script checks:
    - Whether Vik's canonical Autonomy.md says Level 5 is active.
    - Completed Level 4 research reports.
    - Existing Level 5 recommendation reports.
    - Unreviewed completed research reports that would be eligible if Level 5
      is active.
    - Source drift where Level 5 reports exist while the canonical autonomy
      contract says Level 5 is not active.

What this script writes with --write:
    - roles/maps-agentic-systems-program-architect/level5-product-recommendation-state.json
    - roles/maps-agentic-systems-program-architect/level5-product-recommendation-proof.md

What this script must never do:
    - Activate Vik Level 5.
    - Produce implementation/procurement/release/production authority.
    - Contact vendors or external parties.
    - Commit, push, release, deploy, spend, use secrets, or expand authority.
"""

from __future__ import annotations

import argparse
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path


ROLE_ROOT = Path(os.environ.get("VIK_ROLE_ROOT", r"C:\Users\scott\Code\mojo\roles\maps-agentic-systems-program-architect"))
AUTONOMY_PATH = ROLE_ROOT / "Autonomy.md"
POLICY_PATH = ROLE_ROOT / "level5-product-recommendation-policy.md"
STATE_PATH = ROLE_ROOT / "level5-product-recommendation-state.json"
PROOF_PATH = ROLE_ROOT / "level5-product-recommendation-proof.md"
AUTOMATION_ROOT = Path(os.environ.get("VIK_AUTOMATION_ROOT", r"C:\Users\scott\.codex\automations\vik-handoff-check"))
REPORTS_DIR = AUTOMATION_ROOT / "reports"
LEVEL5_REPORTS_DIR = AUTOMATION_ROOT / "level5-reports"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace") if path.exists() else ""


def iso_now() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def item_id_from_report(path: Path) -> str:
    match = re.match(r"^(VA-\d+)", path.stem, re.IGNORECASE)
    return match.group(1).upper() if match else path.stem


def item_id_from_level5_report(path: Path) -> str:
    match = re.match(r"^(VA-\d+)-level5-product-recommendation$", path.stem, re.IGNORECASE)
    return match.group(1).upper() if match else item_id_from_report(path)


def level5_is_active(autonomy_text: str) -> bool:
    lowered = autonomy_text.lower()
    if "level 5" not in lowered:
        return False
    section_match = re.search(
        r"### level 5:.*?(?=\n### level 6:|\Z)",
        lowered,
        flags=re.DOTALL,
    )
    level5_section = section_match.group(0) if section_match else lowered
    header_match = re.search(
        r"current level:\s*5|current autonomy level:\s*level 5|current stage:\s*principal",
        lowered,
    )
    inactive_markers = [
        "level 5: principal (policy autonomy) - defined, not active",
        "current status: not active",
        "level 5 is defined but not active",
        "level 5, level 6, agent promotion",
        "vik remains level 4 only",
        "current level: 4",
    ]
    active_markers = [
        "current level: 5",
        "current autonomy level: level 5",
        "level 5 principal policy autonomy active",
        "level 5 is active",
    ]
    return (
        bool(header_match)
        or any(marker in level5_section for marker in active_markers)
    ) and not any(marker in level5_section for marker in inactive_markers)


def build_state(mode: str) -> dict:
    autonomy_text = read_text(AUTONOMY_PATH)
    policy_text = read_text(POLICY_PATH)
    completed_reports = sorted(REPORTS_DIR.glob("VA-*.md")) if REPORTS_DIR.exists() else []
    level5_reports = sorted(LEVEL5_REPORTS_DIR.glob("VA-*-level5-product-recommendation.md")) if LEVEL5_REPORTS_DIR.exists() else []
    completed_ids = {item_id_from_report(path): str(path) for path in completed_reports}
    reviewed_ids = {item_id_from_level5_report(path): str(path) for path in level5_reports}
    unreviewed_ids = sorted(set(completed_ids) - set(reviewed_ids))
    active = level5_is_active(autonomy_text)
    source_conflict = bool(level5_reports) and not active
    result = "ready_for_review" if active and unreviewed_ids else "no_unreviewed_completed_reports"
    if not active:
        result = "not_active"
    if source_conflict:
        result = "source_conflict_level5_reports_exist_but_contract_inactive"
    return {
        "schema_version": 1,
        "role": "Vik / ASPA",
        "automation_id": "vik-visible-backlog-research",
        "logic_owner": str(Path(__file__).resolve()),
        "mode": mode,
        "checked_at": iso_now(),
        "current_policy": "Level 5 product-recommendation policy autonomy",
        "level5_active_from_autonomy_contract": active,
        "result": result,
        "counts": {
            "completed_level4_reports": len(completed_reports),
            "level5_reports": len(level5_reports),
            "unreviewed_completed_reports": len(unreviewed_ids),
        },
        "sources": {
            "autonomy": str(AUTONOMY_PATH),
            "policy": str(POLICY_PATH),
            "completed_reports_dir": str(REPORTS_DIR),
            "level5_reports_dir": str(LEVEL5_REPORTS_DIR),
        },
        "unreviewed_completed_reports": [
            {"item_id": item_id, "report_path": completed_ids[item_id]}
            for item_id in unreviewed_ids
        ],
        "source_conflict": {
            "present": source_conflict,
            "reason": "Level 5 reports exist, but canonical Autonomy.md does not currently mark Level 5 active." if source_conflict else "",
            "required_owner_route": "Scott/Tess/Vik review before treating Level 5 reports as operational truth." if source_conflict else "",
        },
        "gate_status": {
            "contract": "pass" if AUTONOMY_PATH.exists() else "fail",
            "policy": "pass" if POLICY_PATH.exists() and bool(policy_text.strip()) else "fail",
            "activation": "pass" if active else "blocked_not_active",
            "state": "pass_after_write" if mode in {"manual", "scheduled"} else "pending",
            "boundary": "pass_denied_actions_held",
        },
        "denied_actions_held": [
            "no implementation",
            "no procurement or vendor contact",
            "no tool installation/configuration",
            "no Git/GitHub/release action",
            "no production",
            "no external communication",
            "no spending",
            "no secrets",
            "no authority expansion",
            "no Level 6 discovery",
        ],
    }


def proof_entry(state: dict) -> str:
    return "\n".join([
        f"## {state['checked_at']} - Vik Level 5 Script Run ({state['mode']})",
        "",
        f"Result: {state['result']}",
        f"Logic owner: `{state['logic_owner']}`",
        f"Counts: `{json.dumps(state['counts'], sort_keys=True)}`",
        f"Level 5 active from contract: `{state['level5_active_from_autonomy_contract']}`",
        f"Source conflict: `{state['source_conflict']['present']}`",
        "",
        "Denied actions held: no implementation, procurement/vendor contact, tool installation/configuration, Git/GitHub/release, production, external communication, spending, secrets, authority expansion, or Level 6 discovery.",
        "",
    ])


def write_outputs(state: dict) -> None:
    STATE_PATH.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")
    existing = read_text(PROOF_PATH)
    PROOF_PATH.write_text(existing.rstrip() + "\n\n" + proof_entry(state), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Run Vik Level 5 product-recommendation checks.")
    parser.add_argument("--write", action="store_true", help="Write state/proof files.")
    parser.add_argument("--mode", choices=["manual", "scheduled"], default="manual")
    args = parser.parse_args()
    state = build_state(args.mode)
    if args.write:
        write_outputs(state)
    print(json.dumps(state, indent=2))
    return 0 if state["result"] in {"ready_for_review", "no_unreviewed_completed_reports", "not_active"} else 2


if __name__ == "__main__":
    raise SystemExit(main())

