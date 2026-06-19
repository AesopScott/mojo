# [proper-role-name] Memory

## Purpose

This is the durable memory file for [proper-role-name].

[proper-role-name] uses this file to preserve durable operating context, preferences, decisions, active work, handoff files, and role-specific learning.

## Role Identity

- Role name: [role-name]
- Proper role name: [proper-role-name]
- Root organization: Mindshare
- Memory file: `G:\My Drive\Mindshare\[role-name].md`

## Current Role Contract

- Local role contract: `C:\Users\scott\Code\mindshare\roles\[role-name]\role-agent.md`
- Local workflow: `C:\Users\scott\Code\mindshare\roles\[role-name]\workflow.md`
- Obsidian role mirror: `G:\My Drive\Mindshare\maps-runs\role-[role-name].md`

## Handoff Check Goal

Create a goal to read your assigned handoff files every 5 min, if not engaged in active work.

Assigned handoff files:

- `[assigned-handoff-file]`

Backlog routing, when the role owns or participates in MAPS backlog work:

- Existing MAPS skill usage does not require a backlog update.
- Building, changing, or publishing a MAPS skill, template, validator, role/agent operating contract, proof build, Obsidian-to-Mojo training change, or `/maps` website update should be listed in the active project backlog.
- The project backlog path, owner, and role-specific participation scope must be recorded in this memory when assigned.

Repo work routing, when the role creates or edits repo files:

- Use a unique role/work-item worktree or clearly named task branch by default, not `main`.
- Treat `main` as the integration/release target.
- Direct `main` work requires scoped Reid / Release Management approval or emergency release authority.
- Keep unrelated dirty files out of staged changes by using selective staging or a separate worktree.
- Route commits, pushes, merges, promotions, production deploys, branch cleanup, and worktree cleanup through Release Management before acting.

## Heartbeat Automation

- Automation name: `[role-name]-handoff-check`
- Cadence: adaptive quiet heartbeat. Start at 5 minutes; after 4 consecutive no-change checks, fall back to 10 minutes; after 4 more consecutive no-change checks, fall back to 15 minutes; after 4 empty 15-minute checks, fall back to 30 minutes; after 4 empty 30-minute checks, fall back to 2 hours; reset to 5 minutes immediately when relevant work appears.
- Prompt format: use topic-based paragraphs for Cadence, Active-flow rule, Context to read, Response contract, Work handling, Durable writes, and Authority boundary. Formatting changes must not change scope, checked locations, cadence, authority, thread destination, or role identity.
- Quiet no-work behavior: use `DONT_NOTIFY` and name checked locations when no user action is needed.
- Adaptive quiet behavior: cadence-only metadata updates are allowed for the 5 -> 10 -> 15 -> 30 minute -> 2 hour fallback/reset pattern, but the heartbeat must not change prompt scope, checked locations, authority, thread destination, or role identity.
- Authority boundary: this heartbeat does not approve production actions, external communication, spending, authority expansion, automation changes beyond cadence-only adaptive quiet updates, or autonomous runtime beyond the bounded handoff check.

## Professional Maturity And Authorization

- Professional maturity level: [professional-maturity-level]
- Role lifecycle status: [role-lifecycle-status]
- Approval evidence: [approval-evidence]
- Agent build readiness: [agent-build-readiness]

## Operating Preferences Learned

- [operating-preference]

## Current Decisions

- [decision]

## Active Work

- [active-work-item]

## Loading Proposal

This memory file is not automatically loaded unless project or role instructions explicitly say so.

Candidate loading rule:

- When [proper-role-name] is invoked or assigned work, read `G:\My Drive\Mindshare\[role-name].md` after project foundation context and before substantive role recommendations.
- If the question is specifically about Obsidianify injected graph memory, follow the Obsidianify packet rule first.
- Keep this memory concise. Move completed run evidence into role artifacts, lab history, handoff files, or MAPS run notes instead of storing large transcripts here.

## Privacy And Retention

- Do not store secrets, credentials, private raw logs, or unsupported personal claims here.
- Store durable operating preferences, decisions, active work, handoff state, and proven patterns.
- Prefer links to source artifacts over duplicating long content.

## Update Log

| Date | Update | Source |
| --- | --- | --- |
| [date] | Created [proper-role-name] memory file from `memory-template.md`. | `/role` |
| 2026-06-19 | Added default unique-worktree expectation: roles should work from their own worktrees or branches, not directly on `main`, and route Git/GitHub writes through Release Management. | Scott request to Reid. |
| 2026-06-19 | Expanded adaptive quiet heartbeat cadence to 5 -> 10 -> 15 -> 30 minutes -> 2 hours, with reset to 5 minutes on relevant work. | Scott request to Mae. |
