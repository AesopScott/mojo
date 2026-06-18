---
name: define-agent
description: Create an agent brief for the MAPS Define phase. Use when turning an agent or multi-agent system idea into goals, users, authorization level, scope, non-goals, success criteria, failure criteria, escalation points, risks, and assumptions.
---

# Define Agent

## Overview

Use this skill to turn a vague agent idea into an agent brief. Prefer clarity over implementation detail.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it to the memory stores defined by the foundation contract instead of inventing new locations. If the run changes memory configuration, notes/RAG locations, source inventory, or durable project context, update `project-foundation.md` and `.maps/foundation-preferences.json` through `/foundation` conventions.

At the end of the run, append a row to `MAPS Skill Run Log` in `project-foundation.md`. Prefer the foundation helper when available:

```bash
python "$CODEX_HOME/skills/foundation/scripts/remember_foundation.py" stamp-run --project . --skill /define-agent --phase A1 --output "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, append the timestamp, skill, phase, output path, memory updates, and short note manually.

## Workflow

1. Identify the user or operator.
2. State the job to be done in one sentence.
3. Assign a stable agent handle and role or mandate.
4. Define persona and tone when the agent will communicate with humans or other agents.
5. Define the authorization level: advise, draft, act with approval, or act autonomously within explicit limits.
6. Name actions allowed without approval, actions that require approval, and actions that are forbidden.
7. List requested tool access separately from granted authorization.
8. Separate in-scope work from out-of-scope work.
9. Define observable success and failure criteria.
10. Name human escalation points.
11. Capture risks, assumptions, and unknowns.
12. Produce or update `agents/{agent-handle}/agent-brief.md`.

## Output

Create or update `agents/{agent-handle}/agent-brief.md` using `templates/agent-definition-template.md` as the starting structure.

The completed file contains:

- Name
- Agent handle
- Role or mandate
- User or operator
- Job to be done
- Desired outcome
- Persona and tone
- Authorization level
- Allowed without approval
- Approval required for
- Forbidden actions
- Tool access requested
- In scope
- Out of scope
- Success criteria
- Failure criteria
- Escalation points
- Risks and assumptions

Do not overwrite `templates/agent-definition-template.md`; it is the reusable input template.

## Done Criteria

- The agent has a clear job.
- The authorization boundary is explicit.
- Success can be judged.
- Boundaries are explicit.
- Open questions are visible.
