---
name: define-agent
description: Create an agent brief for the MAPS Define phase. Use when turning an agent or multi-agent system idea into goals, users, authorization level, scope, non-goals, success criteria, failure criteria, escalation points, risks, and assumptions.
---

# Define Agent

## Overview

Use this skill to turn a vague agent idea into an agent brief. Prefer clarity over implementation detail.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /define-agent --phase A1 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Required interview

Before writing `agents/{agent-handle}/agent-brief.md`, ask for any missing answers. Do not invent the agent's job, authority, or boundaries without confirmation.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Use the questions below as the internal interview sequence: ask the next most important missing question, wait for the answer, then continue.

Ask:

- What agent or capability are we defining?
- Who is the user, customer, or operator?
- What job should the agent do in one sentence?
- What outcome proves the agent helped?
- What should the agent never do?
- Should it advise, draft, act with approval, or act autonomously within limits?
- What actions are allowed without approval?
- What actions require approval?
- What tools, data, memory, or systems might it need?
- What is in scope and out of scope?
- What success, failure, and escalation criteria should be visible?

If the user already provided some answers, restate them and ask only for the missing or risky decisions.

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

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/design-agent` for the agent design, unless the brief still has unanswered scope or authority questions.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
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
