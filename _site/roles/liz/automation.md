# Automation Snapshot: liz-handoff-check

Generated from current local Codex automation runtime files.

## Current Status

- Automation id: `liz-handoff-check`
- Display name: `Liz handoff check`
- Legacy heartbeat status: `DELETED`
- Legacy heartbeat LLM wake: `DELETED`; heartbeat prompts visibly print in chat before role code can silence them.
- Replacement config: `file-watch.toml` beside the runtime automation.
- Watch state: `watch_state.json` beside the runtime automation.
- Watched paths: `9`
- Missing watched paths: `0`

## Watched Paths

- `C:\Users\scott\Code\mojo\roles\liz\memory.md`
- `G:\My Drive\Mindshare\channels\heartbeat.md`
- `G:\My Drive\Mojo\channels\pipeline.md`
- `G:\My Drive\Mindshare\channels\communications.md`
- `G:\My Drive\Mindshare\channels\release-management.md`
- `G:\My Drive\Mindshare\mapstraining.md`
- `C:\Users\scott\Code\mojo\maps\org-chart\index.html`
- `G:\My Drive\Mojo\role\liz\obsidian-file-index.json`
- `G:\My Drive\Mindshare\roles.md`- `C:\Users\scott\Code\mojo\roles\liz\memory.md`
- `G:\My Drive\Mindshare\channels\heartbeat.md`
- `G:\My Drive\Mojo\channels\pipeline.md`
- `G:\My Drive\Mindshare\channels\communications.md`
- `G:\My Drive\Mindshare\channels\release-management.md`
- `G:\My Drive\Mindshare\mapstraining.md`
- `C:\Users\scott\Code\mojo\maps\org-chart\index.html`
- `G:\My Drive\Mojo\role\liz\obsidian-file-index.json`
- `G:\My Drive\Mindshare\roles.md`

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
automation_id = "liz-handoff-check"
name = "Liz handoff check"
status = "ACTIVE"
rrule = "FREQ=MINUTELY;INTERVAL=1"
target_thread_id = "019ee0c3-a27c-7800-b2bb-9f0c56b00b5d"
source_heartbeat_status = "ACTIVE"
watch_state_path = "watch_state.json"
baseline_on_first_run = true
resume_on_first_run = false
max_diff_bytes_per_file = 8192
max_change_packet_bytes = 24576
dedupe_by_hash = true

watched_paths = [
  "C:\\Users\\scott\\Code\\mojo\\roles\\liz\\memory.md",
  "G:\\My Drive\\Mindshare\\channels\\heartbeat.md",
  "G:\\My Drive\\Mojo\\channels\\pipeline.md",
  "G:\\My Drive\\Mindshare\\channels\\communications.md",
  "G:\\My Drive\\Mindshare\\channels\\release-management.md",
  "G:\\My Drive\\Mindshare\\mapstraining.md",
  "C:\\Users\\scott\\Code\\mojo\\maps\\org-chart\\index.html",
  "G:\\My Drive\\Mojo\\role\\liz\\obsidian-file-index.json",
  "G:\\My Drive\\Mindshare\\roles.md",
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
id = "liz-handoff-check"
kind = "heartbeat"
name = "Liz handoff check"
prompt = "Liz minute heartbeat. Keep this check silent when there is no user-visible work. Do not print an EMPTY heartbeat to the screen. Always include Release Management queue in the watch/read scope so this role can detect Reid approvals, conditional approvals, or blocks for its queued changes. Before any broad role read, use deterministic file-watch state; act only on concrete changed-file work, explicit assignments, or Release Management decisions relevant to this role. If runtime requires a heartbeat envelope and nothing relevant changed, use DONT_NOTIFY only with one short quiet message."
status = "ACTIVE"
rrule = "FREQ=MINUTELY;INTERVAL=1"
target_thread_id = "019ee0c3-a27c-7800-b2bb-9f0c56b00b5d"
created_at = 1781888791049
updated_at = 1781929155000
```
## Watch State Summary

```json
{
  "version": 1,
  "automation_id": "liz-handoff-check",
  "baseline_on_first_run": true,
  "watched_count": 9,
  "missing_count": 0
}
```
