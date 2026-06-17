---
name: build-agent
description: Base MAPS Build skill. Turn an approved agent design into a working agent implementation with implementation notes and verification evidence.
---

# Build Agent

This is the base Phase 3 Build skill. It is intentionally smaller than `/build-agent++` so teams can adapt it to their own implementation workflow.

## Input

- `agents/{agent-handle}/agent-design.md`
- Approved Build gate from Phase 2

## Workflow

1. Confirm the design is approved for Build.
2. Identify the smallest useful working agent slice.
3. Implement the slice using the selected runtime, framework, or project conventions.
4. Run the relevant checks.
5. Record what changed, what passed, and what remains.
6. Repeat until the first working agent exists.

## Output

- Working agent code or configuration
- `agents/{agent-handle}/agent-build.md`
- Build notes for Equip and Evaluate
