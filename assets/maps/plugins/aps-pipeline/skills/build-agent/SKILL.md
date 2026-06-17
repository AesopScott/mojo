---
name: build-agent
description: Base MAPS Build skill. Turn an approved agent design into a working agent implementation with implementation notes and verification evidence.
---

# Build Agent

This is the base Phase 3 Build skill. It is intentionally smaller than `/build-agent++` so teams can adapt it to their own implementation workflow.

## Input

- `agents/{agent-handle}/agent-design.md`
- `agents/{agent-handle}/agent-backlog.md` when available
- Approved Build gate from Phase 2

## Workflow

1. Confirm the design is approved for Build.
2. Read the backlog when available and select the highest-priority unblocked item.
3. If the selected item is too large, split it into smaller backlog items before coding.
4. Identify the smallest useful working agent slice.
5. Implement the slice using the selected runtime, framework, or project conventions.
6. Run the relevant checks.
7. Record what changed, what passed, which backlog item moved, and what remains.
8. Repeat until the first working agent exists.

## Output

- Working agent code or configuration
- `agents/{agent-handle}/agent-build.md`
- Build notes for Equip and Evaluate
