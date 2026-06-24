# Automation Snapshot: liz-handoff-check

Generated from current local Codex deterministic file-watch runtime files.

## Current Status

- Automation id: `liz-handoff-check`
- Display name: `Liz handoff check`
- Status: `ACTIVE`
- Cadence: `FREQ=MINUTELY;INTERVAL=1`
- Legacy heartbeat source status: `ACTIVE`
- Replacement config: `C:\Users\scott\.codex\automations\liz-handoff-check\file-watch.toml`
- Watch state: `C:\Users\scott\.codex\automations\liz-handoff-check\watch_state.json`
- Watched paths: `10`
- Missing watched paths: `0`

## Watched Paths

- `C:\Users\scott\Code\mojo\roles\liz\memory.md`
- `G:\My Drive\Mindshare\channels\heartbeat.md`
- `G:\My Drive\Mojo\channels\pipeline.md`
- `G:\My Drive\Mindshare\channels\communications.md`
- `G:\My Drive\Mindshare\channels\release-management.md`
- `G:\My Drive\Mindshare\channels\training.md`
- `C:\Users\scott\Code\mojo\maps\org-chart\index.html`
- `C:\Users\scott\Code\mindshare\roles\autonomy-engineer\Autonomy Evaluation 1.md`
- `G:\My Drive\Mojo\role\liz\obsidian-file-index.json`
- `G:\My Drive\Mindshare\roles.md`

## File-Watch Runtime Contract

- Check `watched_paths` and `watch_state.json` before any thread resume or model call.
- If files are unchanged, update `last_checked_at` and exit without `thread/resume`, model call, `token_count`, or session JSONL append.
- If files changed, send only a compact change packet plus `prompt_on_change` to the target thread.
- First run baselines existing files and does not wake the LLM by default.
- If `C:\Users\scott\Code\mindshare\roles\autonomy-engineer\Autonomy Evaluation 1.md` changes, Liz must read that file in full before responding, treat it as the org-chart autonomy source of truth, compare every displayed org-chart teammate's visible level and CSS class against the current level only, update stale scoped website files, verify rendered layout/colors, commit, push, and close out when the gate permits.

## Current file-watch.toml Summary

```toml
kind = "file_watch"
automation_id = "liz-handoff-check"
name = "Liz handoff check"
status = "ACTIVE"
rrule = "FREQ=MINUTELY;INTERVAL=1"
target_thread_id = "019ef4df-006a-7ee0-93d2-94ee1e143336"
source_heartbeat_status = "ACTIVE"
watch_state_path = "watch_state.json"
baseline_on_first_run = true
resume_on_first_run = false
max_diff_bytes_per_file = 8192
max_change_packet_bytes = 24576
dedupe_by_hash = true
queue_guard_path = "C:\Users\scott\Code\mojo\scripts\check-role-channel-queue.ps1"

watched_paths = [
  "C:\Users\scott\Code\mojo\roles\liz\memory.md",
  "G:\My Drive\Mindshare\channels\heartbeat.md",
  "G:\My Drive\Mojo\channels\pipeline.md",
  "G:\My Drive\Mindshare\channels\communications.md",
  "G:\My Drive\Mindshare\channels\release-management.md",
  "G:\My Drive\Mindshare\channels\training.md",
  "C:\Users\scott\Code\mojo\maps\org-chart\index.html",
  "C:\Users\scott\Code\mindshare\roles\autonomy-engineer\Autonomy Evaluation 1.md",
  "G:\My Drive\Mojo\role\liz\obsidian-file-index.json",
  "G:\My Drive\Mindshare\roles.md",
]
```

## Watch State Summary

```json
{
  "version": 1,
  "automation_id": "liz-handoff-check",
  "baseline_on_first_run": true,
  "watched_count": 10,
  "missing_count": 0
}
```

## Changelog

- 2026-06-24: Updated snapshot to match active deterministic file-watch config: 1-minute cadence, `channels/training.md`, org chart HTML, `Autonomy Evaluation 1.md`, Liz Obsidian index, and `roles.md` are all watched. Clarified full-read and org-chart reconciliation behavior when Autonomy Evaluation changes.
