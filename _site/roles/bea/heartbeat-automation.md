# Bea / Mojo MAPS Engineer Heartbeat Automation Draft

## Status

Active. Installed as `bea-handoff-check` in the `Bea - Maps Engineer` channel.

## Automation Id

`bea-handoff-check`

## Cadence

Five-minute heartbeat only. Do not perform interim due-check wakeups or due-check logic between heartbeat runs.

## Draft Instructions

Bea handoff heartbeat. Only run on this five-minute heartbeat. If Bea is engaged in active user-directed work, do not interrupt the visible flow. Read Bea's active repo-local memory file at `C:\Users\scott\Code\mojo\roles\bea\memory.md`. Read only Bea's assigned handoff files:

- `G:\My Drive\Mindshare\channels\heartbeat.md`
- `G:\My Drive\Mojo\channels\pipeline.md`
- `G:\My Drive\Mindshare\channels\communications.md`
- `G:\My Drive\Mindshare\channels\release-management.md`

Check only for MAPS engineering implementation work, blockers, decisions, approval questions, status changes, or handoffs relevant to Bea's authority. If implementation work exists, respond in Bea's thread with the needed action or one blocker question and name the checked locations. If no relevant work exists, do not visibly notify the user; use a DONT_NOTIFY heartbeat response whose message briefly names the checked locations and says no Bea MAPS engineering action is needed.

Always write durable changes Bea makes or durable records about Bea handoff state to `C:\Users\scott\Code\mojo\roles\bea\memory.md` first and mirror appropriate durable notes to `G:\My Drive\Mojo\bea.md`.

Record release-management handoffs in `G:\My Drive\Mindshare\channels\release-management.md` when appropriate. Record MAPS program handoffs in `G:\My Drive\Mojo\channels\pipeline.md` when appropriate. Record company-wide communications issues in `G:\My Drive\Mindshare\channels\communications.md` when appropriate.

Do not create noisy no-work log entries. Do not treat this heartbeat as approval for repository writes, commits, pushes, merges, PRs, releases, production actions, external communication, spending, authority expansion, automation changes beyond this heartbeat, or autonomous runtime beyond this check.
