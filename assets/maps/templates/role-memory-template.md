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
- Role-scope boundary: if a requested task belongs to another role, name the correct owner, route or backlog the work, and do not start implementation outside the role's scope.

Repo work routing, when the role creates or edits repo files:

- Use a unique role/work-item worktree or clearly named task branch by default, not `main`.
- Treat `main` as the integration/release target.
- Direct `main` work requires scoped Reid / Release Management approval or emergency release authority.
- Keep unrelated dirty files out of staged changes by using selective staging or a separate worktree.
- Route commits, pushes, merges, promotions, production deploys, branch cleanup, and worktree cleanup through Release Management before acting.
- If waiting more than 15 minutes for Reid review or approval on changes already routed through Release Management, send a Point Handoff directly to Reid for escalation while keeping the approval record in Release Management.

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
| 2026-06-19 | Added Reid review escalation rule: after 15 minutes waiting on routed review or approval, send Reid a Point Handoff while keeping the approval record in Release Management. | Scott request to Mae. |
| 2026-06-19 | Expanded adaptive quiet heartbeat cadence to 5 -> 10 -> 15 -> 30 minutes -> 2 hours, with reset to 5 minutes on relevant work. | Scott request to Mae. |
