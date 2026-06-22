# Automation Snapshot: vik-handoff-check

Generated from current local Codex automation runtime files.

## Current Status

- Automation id: `vik-handoff-check`
- Display name: `Vik backlog queue check`
- Active visible backlog heartbeat: `vik-visible-backlog-research`, named `Vik visible backlog research`.
- Active daily memory automation: `vik-daily-role-memory-maintenance`, named `Vik daily role memory maintenance`.
- Paused headless config: `file-watch.toml` beside the runtime automation.
- Queue config: `queue.toml` beside the runtime automation.
- Queue guard: `C:\Users\scott\Code\mojo\scripts\check-vik-backlog-queue.ps1`
- Schedule separation validator: `C:\Users\scott\Code\mojo\scripts\check-vik-automation-separation.ps1`
- Backlog integrity validator: `C:\Users\scott\Code\mojo\scripts\check-vik-backlog-integrity.ps1`
- Claude CLI wrapper: `C:\Users\scott\Code\mojo\scripts\invoke-claude-low-token.ps1`
- Watch state: `watch_state.json` beside the runtime automation.
- Backlog cadence: `FREQ=MINUTELY;INTERVAL=30` as idle polling only; after completing a research item, Vik immediately checks for the next backlog item and continues until the queue is empty.
- Memory cadence: `FREQ=DAILY;INTERVAL=1`
- Separation invariant: backlog research and memory maintenance must remain separate automations with separate schedules. Backlog research must not run `role_memory_rollover.py`; memory maintenance must not inspect or update the backlog queue.
- Validate this invariant with `C:\Users\scott\Code\mojo\scripts\check-vik-automation-separation.ps1` after any Vik automation schedule or prompt change.
- Validate queue/backlog/report alignment with `C:\Users\scott\Code\mojo\scripts\check-vik-backlog-integrity.ps1` after any Vik backlog status, queue state, or completion report change.
- Loop pattern: Vik drains the backlog while work exists. Only an empty queue waits for the next 30-minute idle poll.
- Current rerun: `VA-008` through `VA-017` were reopened on 2026-06-22 because the productization, durable proof, and visibility contract changed after `VA-018`. Prior first-pass reports are preserved in `C:\Users\scott\.codex\automations\vik-handoff-check\reports\prior-pass-20260622-before-va008-va017-rerun`.
- Watched paths: `0`
- Missing watched paths: `0`

## Watched Paths

Queue check is occupancy-based, not watched-path hash based. `queue.toml` points to the backlog source.

## File-Watch Runtime Contract

The headless file-watch runtime is paused because it can write outputs to hidden automation files without reliably showing Scott the start/result in Vik's visible room. Vik's active backlog automation now runs through the Codex app heartbeat for visible thread delivery.

- Check `watched_paths` and `watch_state.json` before any thread resume or model call.
- If files are unchanged, update `last_checked_at` and exit without `thread/resume`, model call, `token_count`, or session JSONL append.
- If files changed, send only a compact change packet plus `prompt_on_change` to the target thread.
- First run baselines existing files and does not wake LLM by default.

## file-watch.toml

```toml
# Deterministic queue-backed file-watch config for Vik Level 4 scoped autonomy.
# Runtime rule: queue guard may open work even when watched file hashes are unchanged.
kind = "file_watch"
automation_id = "vik-handoff-check"
name = "Vik backlog queue check"
status = "PAUSED"
rrule = "FREQ=MINUTELY;INTERVAL=30"
target_thread_id = "019ee0cf-d067-7e60-92ae-41ea66a75746"
source_heartbeat_status = "DELETED"
watch_state_path = "watch_state.json"
baseline_on_first_run = true
resume_on_first_run = false
max_diff_bytes_per_file = 8192
max_change_packet_bytes = 24576
dedupe_by_hash = true
queue_guard_path = "C:\Users\scott\Code\mojo\scripts\check-vik-backlog-queue.ps1"

watched_paths = []

prompt_on_change = """
Vik Level 4 backlog queue check.

Review only compact change packet and queue guard output below. If BACKLOG_VIK_QUEUE appears, run the scoped research through Claude CLI as the approved research adapter, then paste the final scoped research/architecture/productization result visibly in this same response.

Visible reporting rule: before running Claude CLI, post one visible sentence naming the exact backlog item and research question, for example "I am starting VA-012: <source use case>." If the Claude call is still running, post at most one short waiting update. Do not post a separate commentary completion after Claude returns. The single completion report belongs in the final answer only, must start with "Completed <item id>: <source use case>", and must include the research output, Vik's architecture-owner interpretation, productization recommendation, boundaries held, and next queue state. The ACK must be the last line only after that visible final completion report exists.

Completion proof rule: before marking a backlog item complete, write the exact final completion report to `C:\Users\scott\.codex\automations\vik-handoff-check\reports\<item id>.md`. Then mark the item complete in queue state and backlog status, and emit that same report as the final visible answer. If the report file cannot be written, do not mark the item complete.

Loop semantics: after completing one backlog item, immediately re-check for another eligible backlog item. If another eligible item exists, continue research immediately without waiting for the next scheduled heartbeat. Repeat this item-by-item loop until no eligible backlog item remains, or until Claude errors, stalls, or the turn is interrupted. If no eligible item exists, wait for the next 30-minute idle polling heartbeat. The 30-minute cadence is the idle polling interval only, not a per-item interval.

Claude CLI prompt rule: use `C:\Users\scott\Code\mojo\scripts\invoke-claude-low-token.ps1` as the approved adapter. Call it with `-Prompt "<concise research brief>" -Cwd "C:\Users\scott\Code\mojo" -Effort low`; do not build prompt variables, heredocs, temp files, generated scripts, background workers, or raw `claude` shell pipelines. Use safe mode by default; use `-Bare` only when API-key auth is configured. Disable slash commands unless a named skill is required, and keep Git/GitHub/web tools disallowed unless explicitly approved. Do not send the file-watch envelope, acknowledgement instructions, XML, queue metadata, or control-plane wrapper to Claude. Send only a concise research brief containing the item id, source use case, research question, likely output, priority, Vik's Level 4 boundaries, and the productization question: should Mindshare/Mojo consider this a branded security product, internal capability, enabling component, or not-at-this-time item?

Vik keeps responsibility for interpreting Claude output, enforcing boundaries, producing the final visible answer, and ACKing. Do not answer NO_ACTION_BECAUSE for an eligible backlog item. End with FILE_WATCH_ACK ACTION_TAKEN only after Claude CLI has returned usable output and the visible result is present. If Claude CLI errors, stalls, or the session is interrupted before usable output is visible, do not emit ACTION_TAKEN.

Stop at implementation, Git/release, production, external communication, spending, secrets, authority expansion, runtime activation, or promotion boundaries. If no eligible backlog item exists or work is outside Vik's lane, do not print EMPTY. If runtime requires envelope, use DONT_NOTIFY with one short quiet reason.
"""
```
## App Automation Separation

- `vik-visible-backlog-research` is the only active Vik thread heartbeat and handles backlog research only every 30 minutes.
- `vik-daily-role-memory-maintenance` is a daily local cron automation for role memory maintenance only.

## Watch State Summary

```json
{
  "version": 1,
  "automation_id": "vik-handoff-check",
  "last_checked_at": "2026-06-22T14:50:20.384409Z",
  "baseline_on_first_run": true,
  "files": {}
}
```

## Queue State Summary

```json
{
  "version": 1,
  "checked_at": "2026-06-22T16:38:02.9678631Z",
  "valid_statuses": [
    "backlog",
    "complete",
    "cancelled",
    "errored"
  ],
  "item_statuses": {
    "VA-008": "backlog",
    "VA-010": "backlog",
    "VA-011": "backlog",
    "VA-012": "backlog",
    "VA-013": "backlog",
    "VA-016": "backlog",
    "VA-017": "backlog",
    "VA-018": "complete",
    "VA-019": "complete",
    "VA-020": "complete",
    "VA-001": "complete",
    "VA-002": "complete",
    "VA-004": "complete",
    "VA-005": "complete",
    "VA-006": "complete",
    "VA-014": "backlog",
    "VA-015": "backlog",
    "VA-003": "complete",
    "VA-007": "complete",
    "VA-009": "backlog"
  }
}
```

## Validation Snapshot

```text
VIK_AUTOMATION_SEPARATION_OK
backlog=heartbeat ACTIVE FREQ=MINUTELY;INTERVAL=30
memory=cron ACTIVE FREQ=DAILY;INTERVAL=1
file-watch=PAUSED FREQ=MINUTELY;INTERVAL=30
loop=drain-until-empty idle-poll=30min

VIK_BACKLOG_INTEGRITY_OK
items=20 complete=10 backlog=10
valid_statuses=backlog,complete,cancelled,errored
complete_items_have_reports=true

BACKLOG_VIK_QUEUE
VA-008 C:\Users\scott\Code\mojo\agents\vik-aspa\architecture-backlog.md line 46: P0 backlog - Ransomware early detection and response -> Destructive-action guardrail and emergency escalation pattern.
QUESTION VA-008: How should an agent detect urgent destructive risk while still requiring approval for containment?
```
