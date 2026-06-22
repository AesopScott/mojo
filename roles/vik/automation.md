# Automation Snapshot: vik-handoff-check

Generated from current local Codex automation runtime files.

## Current Status

- Automation id: `vik-handoff-check`
- Display name: `Vik backlog queue check`
- Legacy heartbeat status: `DELETED`
- Legacy heartbeat LLM wake: `DELETED`; heartbeat prompts visibly print in chat before role code can silence them.
- Replacement config: `file-watch.toml` beside the runtime automation.
- Queue config: `queue.toml` beside the runtime automation.
- Queue guard: `C:\Users\scott\Code\mojo\scripts\check-vik-backlog-queue.ps1`
- Watch state: `watch_state.json` beside the runtime automation.
- Cadence: `FREQ=MINUTELY;INTERVAL=3`
- Watched paths: `0`
- Missing watched paths: `0`

## Watched Paths

Queue check is occupancy-based, not watched-path hash based. `queue.toml` points to the backlog source.

## File-Watch Runtime Contract

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
status = "ACTIVE"
rrule = "FREQ=MINUTELY;INTERVAL=3"
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

Review only compact change packet and queue guard output below. If BACKLOG_VIK_QUEUE appears, run the scoped research through Claude CLI as the approved research adapter, then paste the final scoped research/architecture result visibly in this same response.

Visible reporting rule: before running Claude CLI, post one visible sentence naming the exact backlog item and research question, for example "I am starting VA-012: <source use case>." The final answer must start with "Completed <item id>: <source use case>" and include the research output, Vik's architecture-owner interpretation, boundaries held, and next queue state. The ACK must be the last line only after that visible completion report exists.

Claude CLI prompt rule: do not send the file-watch envelope, acknowledgement instructions, XML, queue metadata, or control-plane wrapper to Claude. Send only a concise research brief containing the item id, source use case, research question, likely output, priority, and Vik's Level 4 boundaries. Use stdin or a prompt file; do not pass large prompts as a single command argument.

Vik keeps responsibility for interpreting Claude output, enforcing boundaries, producing the final visible answer, and ACKing. Do not answer NO_ACTION_BECAUSE for an eligible backlog item. End with FILE_WATCH_ACK ACTION_TAKEN only after Claude CLI has returned usable output and the visible result is present. If Claude CLI errors, stalls, or the session is interrupted before usable output is visible, do not emit ACTION_TAKEN.

Stop at implementation, Git/release, production, external communication, spending, secrets, authority expansion, runtime activation, or promotion boundaries. If no eligible backlog item exists or work is outside Vik's lane, do not print EMPTY. If runtime requires envelope, use DONT_NOTIFY with one short quiet reason.
"""
```
## Legacy automation.toml

Deleted. Vik's old visible minute heartbeat is no longer the active runtime path.

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
  "checked_at": "2026-06-22T14:50:20.392868Z",
  "valid_statuses": [
    "backlog",
    "complete",
    "cancelled",
    "errored"
  ],
  "item_statuses": {
    "VA-008": "complete",
    "VA-010": "complete"
  }
}
```
