# Codex Automations Restore Notes

Last updated: 2026-06-20 by Bea.

## Purpose

This file records the role handoff automation restore map so the nine role automations can be rebuilt without relying on memory or chat history.

## Current Finding

The Codex app-visible automation mechanism supports `heartbeat` and `cron` records through the app automation tool. I did not find a supported app tool path for native `file_watch` automation creation.

The intended low-cost architecture is:

- A visible app automation may exist only as a tiny heartbeat record.
- A deterministic file-watch runtime must check `file-watch.toml` and `watch_state.json` before any thread resume or model call.
- If watched files are unchanged, the runtime must update `last_checked_at` and exit without waking the role thread.
- If watched files changed, the runtime should send only a compact change packet to the target role thread.

Sidecar files alone are not proof that silent checking works. Without a runtime that reads them before thread wake, an active heartbeat still risks visible wake prompts and token churn.

## Restore Map

Use the Codex app automation tool to recreate these as app-visible heartbeat records only if Scott approves restoring heartbeat records.

Common fields:

- `kind`: `heartbeat`
- `status`: `ACTIVE`
- `rrule`: `FREQ=MINUTELY;INTERVAL=1`
- Prompt pattern:

```text
{Role} minute heartbeat. Keep this check silent when there is no user-visible work. Do not print an EMPTY heartbeat to the screen. Always include Release Management queue in the watch/read scope so this role can detect Reid approvals, conditional approvals, or blocks for its queued changes. Before any broad role read, use deterministic file-watch state; act only on concrete changed-file work, explicit assignments, or Release Management decisions relevant to this role. If runtime requires a heartbeat envelope and nothing relevant changed, use DONT_NOTIFY only with one short quiet message.
```

| Automation ID | Role | Target Thread |
|---|---|---|
| `ana-handoff-check` | Ana | `019ee052-168c-7da3-a3c3-df936e5c1c92` |
| `bea-handoff-check` | Bea | `019ee18f-b082-7e82-89c5-47498b9ec97e` |
| `jay-handoff-check` | Jay | `019ee1ba-4364-7900-99ea-48fe2452ee3c` |
| `liz-handoff-check` | Liz | `019ee0c3-a27c-7800-b2bb-9f0c56b00b5d` |
| `mae-handoff-check` | Mae | `019ee122-4c9b-72b2-b506-bbd25466bf15` |
| `matt-handoff-check` | Matt | `019ee0c0-71d8-7d82-940e-54efdb0711d3` |
| `rae-handoff-check` | Rae | `019ee20c-b88f-7a01-ac12-34d3948d051a` |
| `reid-handoff-check` | Reid | `019ee143-3f32-7093-9a24-acd3558fc52e` |
| `vik-handoff-check` | Vik | `019ee0cf-d067-7e60-92ae-41ea66a75746` |

## File-Watch Sidecar Requirement

Each automation directory should also have:

- `file-watch.toml`
- `watch_state.json`

Minimum `file-watch.toml` shape:

```toml
kind = "file_watch"
automation_id = "<automation-id>"
name = "<display-name>"
status = "ACTIVE"
rrule = "FREQ=MINUTELY;INTERVAL=1"
target_thread_id = "<target-thread-id>"
source_heartbeat_status = "ACTIVE"
watch_state_path = "watch_state.json"
baseline_on_first_run = true
resume_on_first_run = false
max_diff_bytes_per_file = 8192
max_change_packet_bytes = 24576
dedupe_by_hash = true

watched_paths = [
  # role memory, assigned channels, mirrors, and Release Management when relevant
]

prompt_on_change = """
File-watch change detected.

Review only the compact change packet below. Always check whether Release Management contains a Reid approval, conditional approval, or block relevant to this role.
If no action is needed, do not print an EMPTY heartbeat. If the runtime requires an envelope, use DONT_NOTIFY only with one short quiet message.
If action is needed, respond with the action taken, needed action, or one blocker question.
"""
```

## Approval Rule

Do not rebuild or activate these as live runtime automations without Scott approval. If repo, release, GitHub, or production state is affected, route through Reid / Release Management first.

## Installed File-Watch Runner

Scott approved making the file-watch runtime work on 2026-06-20.

Installed files:

- `C:\Users\scott\Code\mojo\scripts\codex-file-watch-runner.ps1`
- `C:\Users\scott\Code\mojo\scripts\install-codex-file-watch-runner.ps1`

Installed Windows Scheduled Task:

- Task name: `CodexFileWatchRunner`
- Cadence: every 1 minute
- Command: `powershell.exe -NoProfile -ExecutionPolicy Bypass -File C:\Users\scott\Code\mojo\scripts\codex-file-watch-runner.ps1`

Runtime behavior:

- Reads each `C:\Users\scott\.codex\automations\*\file-watch.toml`.
- Hashes `watched_paths`.
- Updates each automation's `watch_state.json`.
- Exits with no thread resume when files are unchanged.
- On changed files only, sends the compact change packet to the target thread with:

```powershell
codex exec resume --skip-git-repo-check <target_thread_id> -
```

Verification after install:

- Manual task run completed with `Last Result: 0`.
- Runner log showed `unchanged` for `rae-handoff-check`, `reid-handoff-check`, and `vik-handoff-check`.
- No `codex exec resume` was invoked on the unchanged pass.
- App heartbeat records for Rae, Reid, and Vik were set to `PAUSED` to prevent duplicate LLM wakeups.

Full restore follow-up:

- Recovered and restored all nine `file-watch.toml` files from prior session evidence.
- Created fresh baseline `watch_state.json` files for all nine automations.
- The scheduled runner logged `unchanged` for all nine:
  - `ana-handoff-check`
  - `bea-handoff-check`
  - `jay-handoff-check`
  - `liz-handoff-check`
  - `mae-handoff-check`
  - `matt-handoff-check`
  - `rae-handoff-check`
  - `reid-handoff-check`
  - `vik-handoff-check`

## Current Observed State During Backup

At the time this file was first written, the local automation folder showed only:

| Automation ID | Kind | Status | Sidecar State |
|---|---|---|---|
| `rae-handoff-check` | `heartbeat` | `ACTIVE` | missing `file-watch.toml`, missing `watch_state.json` |
| `reid-handoff-check` | `heartbeat` | `ACTIVE` | missing `file-watch.toml`, missing `watch_state.json` |
| `vik-handoff-check` | `heartbeat` | `ACTIVE` | has `file-watch.toml`, has `watch_state.json` |

This means the restore is incomplete until Scott approves either disabling active heartbeat records or restoring a working non-thread file-watch runtime.

## Rae Repair Record

Scott approved the smallest safe repair for Rae on 2026-06-20.

Action taken:

- Updated `rae-handoff-check` through the Codex app automation tool to `status = "PAUSED"`.
- Restored `C:\Users\scott\.codex\automations\rae-handoff-check\file-watch.toml`.
- Created baseline `C:\Users\scott\.codex\automations\rae-handoff-check\watch_state.json` from current watched-file hashes.

Verified current Rae state:

| Automation ID | Kind | Status | Cadence | Sidecar State |
|---|---|---|---|---|
| `rae-handoff-check` | `heartbeat` | `PAUSED` | `FREQ=MINUTELY;INTERVAL=1` | has `file-watch.toml`, has `watch_state.json` |

Rae watched paths after repair:

- `C:\Users\scott\Code\mindshare\roles\chief-executive-officer\memory.md`
- `G:\My Drive\Mindshare\channels\heartbeat.md`
- `G:\My Drive\Mindshare\channels\communications.md`
- `G:\My Drive\Mindshare\channels\executive.md`
- `G:\My Drive\Mojo\channels\release-management.md`

Rae should remain paused until a real non-thread file-watch runner is available and verified to exit on unchanged files without a thread resume, model call, token count, or visible heartbeat prompt.


## Release Management Channel Move

On 2026-06-20, Scott moved active Release Management from `G:\My Drive\Mindshare\channels\release-management.md` to `G:\My Drive\Mojo\channels\release-management.md`.

The old Mindshare path is now a redirect note only. All nine file-watch configs were updated and baselined to poll the Mojo Release Management path. The move was broadcast to Heartbeat, Communications, Recruiting, Customer Success, Executive, Training, Pipeline, and Release Management.
