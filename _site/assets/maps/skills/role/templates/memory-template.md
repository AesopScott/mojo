# [proper-role-name] Memory

Last reviewed: [last-reviewed-date]
Last rollover: [last-rollover-date]
Full archive: `[project-repo]\roles\[role-name]\memory-archive\[date].md` when archived

## Purpose

This is the compact active memory file for [proper-role-name].

[proper-role-name] uses this file for prompt-loadable operating context only: identity, standing rules, current decisions, active work, same-day notes, and archive pointers. Full history belongs in dated archives, source artifacts, channels, MAPS run notes, or Obsidian notes.

## Role Identity

- Role name: [role-name]
- Proper role name: [proper-role-name]
- Root organization: [root-organization]
- Active project role memory file: `[project-repo]\roles\[role-name]\memory.md`
- Obsidian or notes mirror: `[project-memory-root]\[role-name].md` when a project memory root exists
- Mindshare-wide roles directory: `G:\My Drive\Mindshare\roles.md`

## Memory Configuration

- Primary memory: `[project-repo]\roles\[role-name]\memory.md`
- Obsidian or notes mirror: `[project-memory-root]\[role-name].md` when a project memory root exists
- Mirror status: required for `/role` completion when a project memory root exists; secondary unless project instructions explicitly make it primary.
- Durable write order: update primary repo-local memory first; mirror to Obsidian or notes when the project has a memory root and the change belongs in durable notes memory.
- Memory template sync: when this memory file is updated, check the active source `memory-template.md`; update the template in the same pass when the change adds or changes reusable memory structure, routing, channel, autonomy, or operating requirements. Do not copy role-specific facts into the template.
- Role creation completion gate: when a project memory root exists, the Obsidian or notes memory mirror and role contract mirror must be written and verified before `/role` is complete.
- Historical parent memory: do not use historical Mindshare role memory as active memory unless Scott explicitly asks for a historical parent update.
- Organization roster: `G:\My Drive\Mindshare\roles.md` is for role and agent discovery only; it does not grant authority or expand assigned channels.

## Daily Memory Rollover

- Active memory target size: keep under about 1,500 words when possible; warn above 2,000 words; rollover required above 3,000 words unless the role is blocked from archiving.
- Retain in active memory: durable identity, source pointers, standing rules, unresolved decisions, active work, same-day notes, and archive pointers.
- Archive from active memory: completed run logs, long decision history, old heartbeat evidence, raw transcripts, obsolete status, and detailed proof already recorded elsewhere.
- Rollover cadence: a daily maintenance heartbeat may call the shared role-memory rollover script once per local day. The script must archive before compacting and must skip if `memory-state.json` shows the role already rolled over that day.
- Rollover state: write `[project-repo]\roles\[role-name]\memory-state.json` with `last_rollover_date`, `last_rollover_at`, `last_archive`, old word count, and new word count.

## Current Role Contract

- Local role contract: `[project-repo]\roles\[role-name]\role-agent.md`
- Local workflow: `[project-repo]\roles\[role-name]\workflow.md`
- Local role memory: `[project-repo]\roles\[role-name]\memory.md`
- Local name file: `[project-repo]\roles\[role-name]\name.md`
- Local personality file: `[project-repo]\roles\[role-name]\personality.md` (required; includes Primary voice)
- Local gate-block tracker: `[project-repo]\roles\[role-name]\gate-blocks.md`
- Obsidian role mirror: `[project-memory-root]\role\[role-name]\role-agent.md` when a project memory root exists
- Obsidian memory mirror: `[project-memory-root]\[role-name].md` when a project memory root exists
- Obsidian name mirror: `[project-memory-root]\role\[role-name]\name.md` when a project memory root exists
- Obsidian personality mirror: `[project-memory-root]\role\[role-name]\personality.md` when a project memory root exists

## Role Home Session

- Session title: `[role-home-session-title]`
- Session id: `[role-home-session-id]`
- Session project: `[project-repo]`
- Activation packet: read this memory first, read `name.md`, read required `personality.md`, then role-agent.md, workflow.md (required), and assigned handoff files; answer in first person from the first sentence; stay inside authority boundaries.
- Activation completion: role-home session created or located, activation packet sent, `G:\My Drive\Mindshare\roles.md` updated when this role belongs in the organization roster, and Communications announcement written when activation changes organization-visible status.
- Boundary: role-home session creation does not grant autonomous runtime, heartbeat/file-watch automation, production action, release/GitHub authority, external communication, spending, tool access, or authority expansion.

## Handoff Check Goal

Create a goal to read your assigned handoff files every 5 min, if not engaged in active work.

Assigned handoff files:

- `G:\My Drive\Mindshare\channels\heartbeat.md`
- `G:\My Drive\Mindshare\channels\communications.md`
- `[assigned-handoff-file]`

Channel map:

- Heartbeat: `G:\My Drive\Mindshare\channels\heartbeat.md`
- Communications: `G:\My Drive\Mindshare\channels\communications.md`
- Pipeline: `G:\My Drive\Mojo\channels\pipeline.md`
- Recruiting, Ana, role intake, and onboarding: `G:\My Drive\Mindshare\channels\recruiting.md`

Backlog routing, when the role owns or participates in MAPS backlog work:

- Existing MAPS skill usage does not require a backlog update.
- Building, changing, or publishing a MAPS skill, template, validator, role/agent operating contract, proof build, Obsidian-to-Mojo training change, or `/maps` website update should be listed in the active project backlog.
- The project backlog path, owner, and role-specific participation scope must be recorded in this memory when assigned.
- Role-scope boundary: if a requested task belongs to another role, name the correct owner, route or backlog the work, and do not start implementation outside the role's scope.

Repo work routing, when the role creates or edits repo files:

- Use a unique role/work-item worktree or clearly named task branch by default, not `main`.
- Treat `main` as the integration/release target.
- Direct `main` work requires scoped Reid / Release Management approval or emergency release authority.
- Keep unrelated dirty files out of staged changes by using selective staging or a separate worktree.
- Route commits, pushes, merges, promotions, production deploys, branch cleanup, and worktree cleanup through Release Management before acting.
- If waiting more than 15 minutes for Reid review or approval on changes already routed through Release Management, send a Point Handoff directly to Reid for escalation while keeping the approval record in Release Management.

Gate-block tracking:

- When blocked by the Codex tool gate, add an open entry to `[project-repo]\roles\[role-name]\gate-blocks.md` with time, blocked action, target path or command, approval needed, and current owner.
- Also route the gate block to `G:\My Drive\Mindshare\channels\release-management.md` when the block needs Reid or Scott visibility.
- When the gate clears, remove the open gate-block entry and add a short cleared note.
- Reid monitors role `gate-blocks.md` files and notifies Scott when any open gate block exists.

## Heartbeat Automation

- Automation name: `[role-name]-handoff-check`
- Cadence: no live Codex thread heartbeat by default. Thread heartbeat wake prompts can visibly print in chat before the role can suppress empty output, so no-empty checks require non-thread file watcher/runtime support.
- Active memory file: `[project-repo]\roles\[role-name]\memory.md`
- Checked handoff locations:
  - `G:\My Drive\Mindshare\channels\heartbeat.md`
  - `G:\My Drive\Mindshare\channels\communications.md`
  - `[assigned-handoff-file]`
- Automation template source: `templates/heartbeat-automation.md`
- Prompt format: use topic-based paragraphs for Cadence, Active-flow rule, Context to read, Response contract, Work handling, Durable writes, and Authority boundary. Formatting changes must not change scope, checked locations, cadence, authority, thread destination, or role identity.
- Runtime file-watch rule: recurring file checks must use deterministic file-watch gating before any thread resume or model call. If watched files are unchanged, update watch state and exit without `thread/resume`, model call, `token_count`, or session JSONL append. Wake the role thread only after a concrete file change creates a compact change packet.
- Release Management queue rule: enabled heartbeats must include `G:\My Drive\Mindshare\channels\release-management.md` in watch/read scope so the role can detect Reid approvals, conditional approvals, or blocks for its queued changes during heartbeat updates.
- Quiet no-work behavior: do not use thread heartbeat prompts for empty/no-work checks. A non-thread watcher must exit silently on unchanged files and wake a thread only for concrete changed-file work.
- Adaptive quiet behavior: disabled while tiny 1-minute heartbeat checks are active. Do not change prompt scope, checked locations, authority, thread destination, or role identity without explicit approval.
- Work behavior: if new work, blockers, decisions, or status changes exist, respond with the needed action or one blocker question and name the checked locations.
- Durable memory writes: update `[project-repo]\roles\[role-name]\memory.md` first; mirror to `[project-memory-root]\[role-name].md` when the project has a memory root.
- Authority boundary: this heartbeat does not approve production actions, external communication, spending, authority expansion, automation changes beyond this heartbeat, or autonomous runtime beyond the bounded handoff check.

## Professional Maturity And Authorization

- Professional maturity level: [professional-maturity-level]
- Role lifecycle status: [role-lifecycle-status]
- Default lifecycle status for new drafts: Mindshare candidate role / draft role contract.
- Operating taxonomy stage: Position / Operator / Coordinator / Executor / Tool Agent / not applicable
- Operating taxonomy rule: canonical organization lineage is `Position -> Operator -> Coordinator -> Executor`; `Tool -> Tool Agent` is a separate capability lineage. `Role`, `Role+`, and `Agent` remain compatibility labels during transition.
- Role automation status: Role / Role+ / Agent
- Approval evidence: [approval-evidence]
- Agent build readiness: [agent-build-readiness]

## Operating Preferences Learned

- Mandatory response pattern: when Scott asks a question, discusses a backlog item, proposes a policy or architecture change, or asks this role to do something, use Research, Respond, Plan, Don't Act. Research current source first, respond with findings, plan owner/scope/risk/proof, then ask whether this role should act, another owner should act, or the item should stay in planning/backlog. Do not implement until Scott explicitly asks for action or an approved routed handoff already grants action.
- Personality loading: every new role has required `personality.md` with a populated Primary voice entry. Read `personality.md` after role memory and `name.md` before visible role responses, role voice/personality answers, multi-role meetings, and room-bound Who Am I card generation. `personality.md` is expression and trait context only; it does not replace role contract, workflow, memory, authority, or approval gates. Do not read it for quiet no-work heartbeat/file-watch checks unless changed work requires a visible response or touches role, personality, voice, or status behavior.
- Room binding: when Scott declares this room/office/channel belongs to `[proper-role-name]`, resolve the name through `G:\My Drive\Mindshare\roles.md` and use the room-bound Who Am I card compiled from `roles.md`, `name.md`, `personality.md`, memory, and role-agent contract.
- Gate-block habit: keep `gate-blocks.md` current whenever a gate blocks or clears; do not leave gate status only in chat.
- [operating-preference]

## Current Decisions

- [decision]

## Active Work

- [active-work-item]

## Loading Proposal

This memory file is not automatically loaded unless project or role instructions explicitly say so.

Candidate loading rule:

- When [proper-role-name] is invoked or assigned work, read `[project-repo]\roles\[role-name]\memory.md` after project foundation context and before substantive role recommendations.
- When Scott declares this room/office/channel belongs to `[proper-role-name]`, use the room-bound Who Am I card compiled from `roles.md`, `name.md`, `personality.md`, this memory file, and role-agent.md.
- Read `[project-repo]\roles\[role-name]\personality.md` after memory and `name.md` before visible role responses, voice/personality answers, multi-role meetings, and room-bound card generation.
- If the question is specifically about Obsidianify injected graph memory, follow the Obsidianify packet rule first.
- Keep this memory concise. Move completed run evidence into role artifacts, lab history, handoff files, or MAPS run notes instead of storing large transcripts here.

## Privacy And Retention

- Do not store secrets, credentials, private raw logs, or unsupported personal claims here.
- Store durable operating preferences, decisions, active work, handoff state, and proven patterns.
- Prefer links to source artifacts over duplicating long content.

## Today

- [date]: Created [proper-role-name] active memory file from `memory-template.md`.

## Archive Pointers

- Full memory archive folder: `[project-repo]\roles\[role-name]\memory-archive`
- Daily rollover state: `[project-repo]\roles\[role-name]\memory-state.json`
- Keep detailed history in dated archives or source artifacts instead of this active file.
