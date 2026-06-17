---
name: design-agent
description: Run Research and Recommend, then create the Phase 2 agent design.
---

# Design Agent

Use this skill after an agent brief exists and before implementation begins.

## Input

- `agents/{agent-handle}/agent-brief.md`

## Workflow

1. Restate the brief and authority boundary.
2. Research comparable agents, frameworks, tools, and implementation patterns.
3. Recommend operating model, workflow, memory, tools, approvals, failures, and observability.
4. Ask the user to accept or override only the recommendations that need correction.
5. Define the proof plan and Build gate.

## Output

- `agents/{agent-handle}/agent-design.md`
