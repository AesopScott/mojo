# Team-Member File Structure Standard

Owner: Cole / HR Director
Status: active standard for Cole's approved HR file-structure scope.

## Purpose

Define the expected file structure for Mindshare team members so every role can be found, loaded, audited, backed up, and updated consistently.

## Current Required Files For New Mindshare Roles

For every new role draft:

- `name.md`
- `personality.md`
- `WhoAmI.md`
- `gate-blocks.md`
- `role-agent.md`
- `memory.md`
- `state.json`

When the role owns a workflow:

- `workflow.md`

When the role has a proposed loop, skill, FileWatch, or Automation:

- `loop.md`
- `SKILL.draft.md`
- `automation.md`

Optional proposal files. Do not check these as required for every role:

- `hook-spec.md` only when a hook is explicitly proposed or approved.
- `script-spec.md` only when a script is explicitly proposed or approved.

When the role is activated:

- role-home session record or session id in memory/roster
- FileWatch configuration only when approved
- assigned handoff files in memory and contract
- Communications announcement when activation is approved
- entry in `G:\My Drive\Mindshare\role-artifacts.md`

Primary team-member source files must live in local role roots under the owning repo, not on G Drive. G Drive is for mirrors, rosters, channels, cards, and inventory/index files unless Scott explicitly approves another source-of-truth location.

When the role has an agent build path:

- `agents\<role-slug>\agent-brief.md`
- `agents\<role-slug>\agent-profile.md`
- later MAPS phase artifacts only when approved

## Obsidian Mirrors

When Mindshare is the memory root, each role should have:

- `G:\My Drive\Mindshare\<proper-name-or-role-slug>.md`
- `G:\My Drive\Mindshare\role\<role-slug>\name.md`
- `G:\My Drive\Mindshare\role\<role-slug>\personality.md`
- `G:\My Drive\Mindshare\role\<role-slug>\WhoAmI.md`
- `G:\My Drive\Mindshare\role\<role-slug>\role-agent.md`

## Audit Categories

- Missing file.
- Stale file.
- Wrong role status.
- Missing Obsidian mirror.
- Roster mismatch.
- Role-stage mismatch.
- Missing role-artifacts inventory entry.
- Missing source pointer.
- Unapproved authority implied by file text.
- New structure not rolled into templates or backup expectations.

## Correction Routing

- Cole may create missing stage-required structural files and mirrors when the requirement is clear, file content is template-derived, and the action does not change role authority, lifecycle, autonomy, Git/release, production, external communication, spending, secrets, or another owner's substantive content.
- Role lifecycle, roster, or `/role` output: Ana.
- Organization notice or channel guidance: Mae.
- Autonomy, gate, FileWatch, Automation, hook, loop, runtime, or authority implication: Tess and Vik.
- Git, release, branch, PR, or promotion file: Reid.
- Backup expectation: Bea.
- Public/training website status mirror: Liz when in scope.
- Final approval or authority expansion: Scott.

## Boundary

This standard describes expected structure and Scott-approved HR gap filling for required structural files. It does not approve role activation, authority changes, autonomous runtime, Git/release actions, production actions, spending, external communication, secrets access, or broad access to every role's private context.
