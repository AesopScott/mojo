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
- Root organization: Mindshare
- Memory file: `G:\My Drive\Mindshare\[role-name].md`

## Current Role Contract

- Local role contract: `C:\Users\scott\Code\mindshare\roles\[role-name]\role-agent.md`
- Local workflow: `C:\Users\scott\Code\mindshare\roles\[role-name]\workflow.md`
- Local personality file: `C:\Users\scott\Code\mindshare\roles\[role-name]\personality.md` (required)
- Local gate-block tracker: `C:\Users\scott\Code\mindshare\roles\[role-name]\gate-blocks.md`
- Obsidian role mirror: `G:\My Drive\Mindshare\maps-runs\role-[role-name].md`
- Obsidian personality mirror: `G:\My Drive\Mindshare\role\[role-name]\personality.md` (required)

## Daily Memory Rollover

- Active memory target size: keep under about 1,500 words when possible; warn above 2,000 words; rollover required above 3,000 words unless the role is blocked from archiving.
- Retain in active memory: durable identity, source pointers, standing rules, unresolved decisions, active work, same-day notes, and archive pointers.
- Archive from active memory: completed run logs, long decision history, old heartbeat evidence, raw transcripts, obsolete status, and detailed proof already recorded elsewhere.
- Rollover cadence: a daily maintenance heartbeat may call the shared role-memory rollover script once per local day. The script must archive before compacting and must skip if `memory-state.json` shows the role already rolled over that day.
- Rollover state: write `[project-repo]\roles\[role-name]\memory-state.json` with `last_rollover_date`, `last_rollover_at`, `last_archive`, old word count, and new word count.

## Handoff Check Goal

Create a goal to read your assigned handoff files every 5 min, if not engaged in active work.

Assigned handoff files:

- `[assigned-handoff-file]`

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

- When blocked by the Codex tool gate, add an open entry to `C:\Users\scott\Code\mindshare\roles\[role-name]\gate-blocks.md` with time, blocked action, target path or command, approval needed, and current owner.
- Also route the gate block to `G:\My Drive\Mindshare\channels\release-management.md` when the block needs Reid or Scott visibility.
- When the gate clears, remove the open gate-block entry and add a short cleared note.
- Reid monitors role `gate-blocks.md` files and notifies Scott when any open gate block exists.

## Heartbeat Automation

- Automation name: `[role-name]-handoff-check`
- Cadence: no live Codex thread heartbeat by default. Thread heartbeat wake prompts can visibly print in chat before the role can suppress empty output, so no-empty checks require non-thread file watcher/runtime support.
- Prompt format: use topic-based paragraphs for Cadence, Active-flow rule, Context to read, Response contract, Work handling, Durable writes, and Authority boundary. Formatting changes must not change scope, checked locations, cadence, authority, thread destination, or role identity.
- Runtime file-watch rule: recurring file checks must use deterministic file-watch gating before any thread resume or model call. If watched files are unchanged, update watch state and exit without `thread/resume`, model call, `token_count`, or session JSONL append. Wake the role thread only after a concrete file change creates a compact change packet.
- Release Management queue rule: enabled heartbeats must include `G:\My Drive\Mindshare\channels\release-management.md` in watch/read scope so the role can detect Reid approvals, conditional approvals, or blocks for its queued changes during heartbeat updates.
- Quiet no-work behavior: do not use thread heartbeat prompts for empty/no-work checks. A non-thread watcher must exit silently on unchanged files and wake a thread only for concrete changed-file work.
- Adaptive quiet behavior: disabled while tiny 1-minute heartbeat checks are active. Do not change prompt scope, checked locations, authority, thread destination, or role identity without explicit approval.
- Authority boundary: this heartbeat does not approve production actions, external communication, spending, authority expansion, automation changes beyond cadence-only adaptive quiet updates, or autonomous runtime beyond the bounded handoff check.

## Professional Maturity And Authorization

- Professional maturity level: [professional-maturity-level]
- Role lifecycle status: [role-lifecycle-status]
- Approval evidence: [approval-evidence]
- Agent build readiness: [agent-build-readiness]

## Operating Preferences Learned

- [operating-preference]
- Personality loading: every new role has required `personality.md` with a populated Primary voice entry. Read `personality.md` after role memory and `name.md` before visible role responses, role voice/personality answers, multi-role meetings, and room-bound Who Am I card generation. `personality.md` is expression and trait context only; it does not replace role contract, workflow, memory, authority, or approval gates. Do not read it for quiet no-work heartbeat/file-watch checks unless changed work requires a visible response or touches role, personality, voice, or status behavior.
- Room binding: when Scott declares this room/office/channel belongs to `[proper-role-name]`, resolve the name through `G:\My Drive\Mindshare\roles.md` and use the room-bound Who Am I card compiled from `roles.md`, `name.md`, `personality.md`, memory, and role-agent contract.
- Gate-block habit: keep `gate-blocks.md` current whenever a gate blocks or clears; do not leave gate status only in chat.

## Current Decisions

- [decision]

## Active Work

- [active-work-item]

## Loading Proposal

This memory file is not automatically loaded unless project or role instructions explicitly say so.

Candidate loading rule:

- When [proper-role-name] is invoked or assigned work, read `G:\My Drive\Mindshare\[role-name].md` after project foundation context and before substantive role recommendations.
- When Scott declares this room/office/channel belongs to `[proper-role-name]`, use the room-bound Who Am I card compiled from `roles.md`, `name.md`, `personality.md`, this memory file, and role-agent.md.
- Read the required `personality.md` after memory and `name.md` before visible role responses, voice/personality answers, multi-role meetings, and room-bound card generation.
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
