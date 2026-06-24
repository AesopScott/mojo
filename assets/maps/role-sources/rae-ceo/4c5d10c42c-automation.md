# Automation Snapshot: rae-handoff-check

Generated from current local Codex automation runtime files.

## Current Status

- Automation id: `rae-handoff-check`
- Display name: `rae-handoff-check`
- Legacy heartbeat status: `DELETED`
- Legacy heartbeat LLM wake: `DELETED`; heartbeat prompts visibly print in chat before role code can silence them.
- Replacement config: `file-watch.toml` beside the runtime automation.
- Watch state: `watch_state.json` beside the runtime automation.
- Watched paths: `5`
- Missing watched paths: `0`

## Watched Paths

- `C:\Users\scott\Code\mindshare\roles\chief-executive-officer\memory.md`
- `G:\My Drive\Mindshare\channels\heartbeat.md`
- `G:\My Drive\Mindshare\channels\communications.md`
- `G:\My Drive\Mindshare\channels\executive.md`
- `G:\My Drive\Mindshare\channels\release-management.md`- `C:\Users\scott\Code\mindshare\roles\chief-executive-officer\memory.md`
- `G:\My Drive\Mindshare\channels\heartbeat.md`
- `G:\My Drive\Mindshare\channels\communications.md`
- `G:\My Drive\Mindshare\channels\executive.md`

## File-Watch Runtime Contract

- Check `watched_paths` and `watch_state.json` before any thread resume or model call.
- If files are unchanged, update `last_checked_at` and exit without `thread/resume`, model call, `token_count`, or session JSONL append.
- If files changed, send only a compact change packet plus `prompt_on_change` to the target thread.
- First run baselines existing files and does not wake LLM by default.

## file-watch.toml

```toml
# Generated deterministic file-watch config for this heartbeat automation.
# Runtime rule: check watched_paths and watch_state before any broad role read.
kind = "file_watch"
automation_id = "rae-handoff-check"
name = "rae-handoff-check"
status = "ACTIVE"
rrule = "FREQ=MINUTELY;INTERVAL=1"
target_thread_id = "019ee20c-b88f-7a01-ac12-34d3948d051a"
source_heartbeat_status = "ACTIVE"
watch_state_path = "watch_state.json"
baseline_on_first_run = true
resume_on_first_run = false
max_diff_bytes_per_file = 8192
max_change_packet_bytes = 24576
dedupe_by_hash = true

watched_paths = [
  "C:\\Users\\scott\\Code\\mindshare\\roles\\chief-executive-officer\\memory.md",
  "G:\\My Drive\\Mindshare\\channels\\heartbeat.md",
  "G:\\My Drive\\Mindshare\\channels\\communications.md",
  "G:\\My Drive\\Mindshare\\channels\\executive.md",
  "G:\\My Drive\\Mindshare\\channels\\release-management.md",
]

prompt_on_change = """
File-watch change detected.

Review only the compact change packet below. Always check whether Release Management contains a Reid approval, conditional approval, or block relevant to this role.
If no action is needed, do not print an EMPTY heartbeat. If the runtime requires an envelope, use DONT_NOTIFY only with one short quiet message.
If action is needed, respond with the action taken, needed action, or one blocker question.
"""
```

## Legacy automation.toml

```toml
version = 1
id = "rae-handoff-check"
kind = "heartbeat"
name = "rae-handoff-check"
prompt = "rae minute heartbeat. Keep this check silent when there is no user-visible work. Do not print an EMPTY heartbeat to the screen. Always include Release Management queue in the watch/read scope so this role can detect Reid approvals, conditional approvals, or blocks for its queued changes. Before any broad role read, use deterministic file-watch state; act only on concrete changed-file work, explicit assignments, or Release Management decisions relevant to this role. If runtime requires a heartbeat envelope and nothing relevant changed, use DONT_NOTIFY only with one short quiet message."
status = "ACTIVE"
rrule = "FREQ=MINUTELY;INTERVAL=1"
target_thread_id = "019ee20c-b88f-7a01-ac12-34d3948d051a"
created_at = 1781909151765
updated_at = 1781929155000
```

## Watch State Summary

```json
{
  "version": 1,
  "automation_id": "rae-handoff-check",
  "baseline_on_first_run": true,
  "watched_count": 4,
  "missing_count": 0
}
```
