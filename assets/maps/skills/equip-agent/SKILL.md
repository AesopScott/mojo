---
name: equip-agent
description: Create the MAPS Equip phase artifact for an agent or multi-agent system. Use when mapping tools, APIs, MCP servers, data sources, retrieval, memory, credentials, permissions, audit needs, and integration risks.
---

# Equip Agent

## Overview

Use this skill to connect an agent to the capabilities it needs while keeping scope and permissions intentional.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /equip-agent --phase A4 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Required interview

Before writing the capability map, ask for any missing answers. Do not grant or assume tools, data, credentials, or permissions.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Use the questions below as the internal interview sequence: ask the next most important missing question, wait for the answer, then continue.

Ask:

- Which agent, role, or system is being equipped?
- What workflow steps require tools, data, APIs, MCP servers, memory, RAG, or human help?
- Which capabilities are required now versus later?
- What identity should the agent use for each system?
- What permissions are allowed, read-only, write-capable, approval-gated, or forbidden?
- Where do credentials live, and should this skill avoid seeing secrets directly?
- What context sources are canonical, mirrored, or derived?
- What audit, logging, privacy, retention, or compliance requirements apply?
- What should happen when a tool call fails or looks unsafe?
- What integration risks should be carried into Evaluate or Deploy?

If the user does not know, propose least-privilege defaults and ask for confirmation.

## Workflow

1. List every capability required by the workflow.
2. Map each capability to a tool, API, data source, or human step.
3. Define required permissions and identity boundaries.
4. Identify context sources and memory rules.
5. Specify error handling for failed or unsafe tool calls.
6. Note audit, privacy, and security requirements.
7. Produce a capability map.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/evaluate-agent` to prove the equipped agent works safely with its tools and data.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output
Return:

- Tool map
- Context sources
- Memory policy
- Audit requirements
- Security notes

Use `templates/tool-map.md` from the MAPS repo when working inside this repository.

## Done Criteria

- Every tool has a reason.
- Permissions are least-privilege.
- Context and memory boundaries are clear.
- Failure behavior is specified.
