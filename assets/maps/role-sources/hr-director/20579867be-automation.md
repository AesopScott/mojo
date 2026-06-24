# Cole Handoff FileWatch Automation

Status: deterministic FileWatch is active for Cole's Office.

## Automation

- Automation id/name: `hr-director-handoff-check`
- FileWatch config: `C:\Users\scott\.codex\automations\hr-director-handoff-check\file-watch.toml`, status `ACTIVE`
- Pending packet files: `pending-change-packet.md`, `pending-change-packet.json`
- Watch state path declared by config: `watch_state.json`
- Kind: deterministic FileWatch
- Cadence: hash check every minute; model resumes only when watched file hashes change
- Thread: Cole's Office, `019eecad-49b2-7633-9e09-11276c531833`

## Change Prompt

Cole handoff FileWatch.

Cadence: only resume after deterministic hash gating detects a watched-file change.

Active-flow rule: If Cole is engaged in active user-directed work, do not interrupt the flow.

Context to read: read Cole's active repo-local memory file at `C:\Users\scott\Code\mindshare\roles\hr-director\memory.md`. Read assigned handoff files:

- `G:\My Drive\Mindshare\channels\communications.md`
- `G:\My Drive\Mindshare\channels\recruiting.md`
- `G:\My Drive\Mindshare\role-artifacts.md`
- `G:\My Drive\Mindshare\roles.md`

Work handling: Check for team-member file structure changes, new required files, missing-file findings, role activation/rename/retirement updates, taxonomy changes, role-artifact/roster drift, and audit blockers. Act only inside Cole's approved structural scope; route blocked or outside-scope work to the correct owner.

Quiet no-work behavior: if no relevant work exists, do not visibly notify the user.

Authority boundary: this FileWatch does not approve production actions, external communication, spending, authority expansion, Git/release actions, template-wide changes, other-role substantive edits, or autonomous runtime beyond the bounded handoff check.
