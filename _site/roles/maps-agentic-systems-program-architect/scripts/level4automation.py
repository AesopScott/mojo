#!/usr/bin/env python3
"""Vik Level 4 backlog-research automation checks.

Reader's map
============

Purpose:
    Keep Vik's repeatable Level 4 backlog detection, queue-state validation,
    state, and proof writes in a readable role-local script. The Codex
    heartbeat is only the timer, live role-context worker, Claude research
    runner, visible reporting surface, and owner router.

What this script checks:
    - The canonical architecture backlog table.
    - The queue state used by Vik's visible backlog automation.
    - Status alignment between backlog rows and queue state.
    - The next eligible Level 4 research item by priority then backlog row.
    - Source conflicts such as queue-state items that do not exist in the
      backlog table.

What this script writes with --write:
    - roles/maps-agentic-systems-program-architect/level4-research-state.json
    - roles/maps-agentic-systems-program-architect/level4-research-proof.md

What this script must never do:
    - Run Claude research.
    - Mark backlog items complete.
    - Edit the backlog or queue state.
    - Implement, release, deploy, contact external parties, spend, use secrets,
      activate runtime, promote a role, or expand authority.
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
STATE_PATH = ROLE_ROOT / "level4-research-state.json"
PROOF_PATH = ROLE_ROOT / "level4-research-proof.md"
BACKLOG_PATH = Path(os.environ.get("VIK_ARCHITECTURE_BACKLOG", r"C:\Users\scott\Code\mojo\agents\vik-aspa\architecture-backlog.md"))
AUTOMATION_ROOT = Path(os.environ.get("VIK_AUTOMATION_ROOT", r"C:\Users\scott\.codex\automations\vik-handoff-check"))
QUEUE_STATE_PATH = AUTOMATION_ROOT / "channel_queue_guard_state.json"
REPORTS_DIR = AUTOMATION_ROOT / "reports"

VALID_STATUSES = {"backlog", "complete", "cancelled", "errored"}
PRIORITY_RANK = {"P0": 0, "P1": 1, "P2": 2, "P3": 3}


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace") if path.exists() else ""


def iso_now() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def normalize_status(status: str) -> str:
    normalized = status.strip().lower()
    return "backlog" if normalized == "open" else normalized


def parse_backlog() -> list[dict]:
    items: list[dict] = []
    for index, line in enumerate(read_text(BACKLOG_PATH).splitlines(), start=1):
        if not re.match(r"^\|\s*VA-\d+\s*\|", line):
            continue
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if len(cells) < 8:
            items.append({"id": f"malformed-line-{index}", "line": index, "status": "errored", "parse_error": line})
            continue
        priority = cells[6]
        items.append({
            "id": cells[0],
            "source_use_case": cells[1],
            "research_question": cells[2],
            "vik_analysis": cells[3],
            "likely_output": cells[4],
            "required_gate_or_eval": cells[5],
            "priority": priority,
            "rank": PRIORITY_RANK.get(priority, 99),
            "status": normalize_status(cells[7]),
            "line": index,
        })
    return items


def read_queue_state() -> dict:
    if not QUEUE_STATE_PATH.exists():
        return {}
    try:
        raw = json.loads(read_text(QUEUE_STATE_PATH))
    except json.JSONDecodeError:
        return {"__json_error__": "Queue state is not valid JSON."}
    statuses = raw.get("item_statuses", {})
    if not isinstance(statuses, dict):
        return {"__json_error__": "Queue state item_statuses is missing or not an object."}
    return {str(item_id): normalize_status(str(status)) for item_id, status in statuses.items()}


def build_state(mode: str) -> dict:
    backlog_items = parse_backlog()
    queue_statuses = read_queue_state()
    backlog_by_id = {item["id"]: item for item in backlog_items if item["id"].startswith("VA-")}
    errors: list[str] = []

    if "__json_error__" in queue_statuses:
        errors.append(queue_statuses["__json_error__"])
        queue_statuses = {}

    for item in backlog_items:
        status = item.get("status", "")
        if status not in VALID_STATUSES:
            errors.append(f"{item['id']} line {item['line']} has invalid backlog status '{status}'.")

    missing_from_queue = sorted(set(backlog_by_id) - set(queue_statuses))
    extra_queue_items = sorted(set(queue_statuses) - set(backlog_by_id))
    status_mismatches: list[dict] = []

    for item_id, item in backlog_by_id.items():
        if item_id not in queue_statuses:
            continue
        queue_status = queue_statuses[item_id]
        if queue_status not in VALID_STATUSES:
            errors.append(f"{item_id} has invalid queue-state status '{queue_status}'.")
        if queue_status != item["status"]:
            status_mismatches.append({"item_id": item_id, "backlog_status": item["status"], "queue_status": queue_status, "line": item["line"]})

    effective_items: list[dict] = []
    for item_id, item in backlog_by_id.items():
        effective_status = queue_statuses.get(item_id, item["status"])
        enriched = dict(item)
        enriched["effective_status"] = effective_status
        effective_items.append(enriched)

    eligible_items = sorted([item for item in effective_items if item["effective_status"] == "backlog"], key=lambda item: (item["rank"], item["line"]))

    completed_missing_reports = []
    for item in effective_items:
        if item["effective_status"] == "complete":
            report_path = REPORTS_DIR / f"{item['id']}.md"
            if not report_path.exists():
                completed_missing_reports.append({"item_id": item["id"], "report_path": str(report_path)})

    source_conflicts = []
    if missing_from_queue:
        source_conflicts.append({"type": "backlog_items_missing_from_queue_state", "item_ids": missing_from_queue})
    if extra_queue_items:
        source_conflicts.append({"type": "queue_state_items_missing_from_backlog", "item_ids": extra_queue_items})
    if status_mismatches:
        source_conflicts.append({"type": "backlog_queue_status_mismatch", "items": status_mismatches})
    if completed_missing_reports:
        source_conflicts.append({"type": "completed_items_missing_reports", "items": completed_missing_reports})
    if errors:
        source_conflicts.append({"type": "validation_errors", "items": errors})

    if source_conflicts:
        result = "source_conflict"
    elif eligible_items:
        result = "eligible_work"
    else:
        result = "no_eligible_work"

    return {
        "schema_version": 1,
        "role": "Vik / ASPA",
        "automation_id": "vik-visible-backlog-research",
        "logic_owner": str(Path(__file__).resolve()),
        "mode": mode,
        "checked_at": iso_now(),
        "current_policy": "Level 4 scoped backlog research",
        "result": result,
        "counts": {
            "backlog_items": len(backlog_by_id),
            "queue_state_items": len(queue_statuses),
            "eligible_items": len(eligible_items),
            "complete_items": len([item for item in effective_items if item["effective_status"] == "complete"]),
            "cancelled_items": len([item for item in effective_items if item["effective_status"] == "cancelled"]),
            "errored_items": len([item for item in effective_items if item["effective_status"] == "errored"]),
            "source_conflicts": len(source_conflicts),
        },
        "sources": {"autonomy": str(AUTONOMY_PATH), "backlog": str(BACKLOG_PATH), "queue_state": str(QUEUE_STATE_PATH), "reports_dir": str(REPORTS_DIR)},
        "next_eligible_item": eligible_items[0] if eligible_items else None,
        "eligible_items": eligible_items[:10],
        "source_conflict": {
            "present": bool(source_conflicts),
            "items": source_conflicts,
            "required_owner_route": "Scott/Tess/Vik review; do not repair by inventing backlog rows or deleting queue-state items without owner approval." if source_conflicts else "",
        },
        "gate_status": {
            "contract": "pass" if AUTONOMY_PATH.exists() else "fail",
            "backlog": "pass" if BACKLOG_PATH.exists() else "fail",
            "queue_state": "pass" if QUEUE_STATE_PATH.exists() else "fail",
            "state": "pass_after_write" if mode in {"manual", "scheduled"} else "pending",
            "boundary": "pass_denied_actions_held",
        },
        "denied_actions_held": [
            "no Claude research execution by script",
            "no backlog or queue mutation",
            "no implementation",
            "no Git/GitHub/release action",
            "no production",
            "no external communication",
            "no spending",
            "no secrets",
            "no authority expansion",
            "no runtime activation",
            "no promotion",
            "no Level 5 or Level 6 activation",
        ],
    }


def proof_entry(state: dict) -> str:
    next_item = state["next_eligible_item"]["id"] if state["next_eligible_item"] else "none"
    return "\n".join([
        f"## {state['checked_at']} - Vik Level 4 Script Run ({state['mode']})",
        "",
        f"Result: {state['result']}",
        f"Logic owner: `{state['logic_owner']}`",
        f"Counts: `{json.dumps(state['counts'], sort_keys=True)}`",
        f"Next eligible item: `{next_item}`",
        f"Source conflict: `{state['source_conflict']['present']}`",
        "",
        "Denied actions held: no Claude research execution by script, backlog/queue mutation, implementation, Git/GitHub/release, production, external communication, spending, secrets, authority expansion, runtime activation, promotion, or Level 5/6 activation.",
        "",
    ])


def write_outputs(state: dict) -> None:
    STATE_PATH.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")
    existing = read_text(PROOF_PATH)
    PROOF_PATH.write_text(existing.rstrip() + "\n\n" + proof_entry(state), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Run Vik Level 4 backlog-research checks.")
    parser.add_argument("--write", action="store_true", help="Write state/proof files.")
    parser.add_argument("--mode", choices=["manual", "scheduled"], default="manual")
    args = parser.parse_args()
    state = build_state(args.mode)
    if args.write:
        write_outputs(state)
    print(json.dumps(state, indent=2))
    return 0 if state["result"] in {"eligible_work", "no_eligible_work"} else 2


if __name__ == "__main__":
    raise SystemExit(main())

