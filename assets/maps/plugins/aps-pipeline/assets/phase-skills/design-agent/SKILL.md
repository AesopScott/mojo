---
name: design-agent
description: Run Research and Recommend, then create the Phase 2 agent design and a dependency-aware prioritized build backlog. Use when Codex needs to turn an agent brief into design decisions, runtime/adapter requirements, proof gates, and backlog items before Phase 3 Build begins.
---

# Design Agent

Use this skill after an agent brief exists and before implementation begins.

## Input

- `agents/{agent-handle}/agent-brief.md`

## Workflow

1. Restate the brief and authority boundary.
2. Research comparable agents, frameworks, tools, and implementation patterns.
3. Recommend operating model, workflow, memory, tools, approvals, failures, and observability.
4. Recommend the backlog before asking broad questions:
   - epics or project-sized work items
   - thin build slices
   - dependencies and sequencing constraints
   - priority tier or order
   - proof/eval required for each item
   - runtime adapter/profile work
   - deferred work and explicit non-goals
5. Ask the user to accept or override only the recommendations that need correction.
6. Define the proof plan, backlog, and Build gate.

## Backlog Rules

- Break large projects into backlog items before Phase 3 Build begins.
- Prefer small vertical slices that can be built, tested, and reviewed independently.
- Record dependencies so Build does not start blocked work before prerequisite work is complete.
- Prioritize by user value, risk reduction, dependency order, safety, and proof needed.
- Mark the first build slice clearly.
- Keep improvement ideas that do not belong in the first build as deferred backlog items for Phase 8.

## Output

- `agents/{agent-handle}/agent-design.md`
- `agents/{agent-handle}/agent-backlog.md`
