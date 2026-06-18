---
name: equip-agent
description: Create the MAPS Equip phase artifact for an agent or multi-agent system. Use when mapping tools, APIs, MCP servers, data sources, retrieval, memory, credentials, permissions, audit needs, and integration risks.
---

# Equip Agent

## Overview

Use this skill to connect an agent to the capabilities it needs while keeping scope and permissions intentional.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it to the memory stores defined by the foundation contract instead of inventing new locations. If the run changes memory configuration, notes/RAG locations, source inventory, or durable project context, update `project-foundation.md` and `.maps/foundation-preferences.json` through `/foundation` conventions.

At the end of the run, append a row to `MAPS Skill Run Log` in `project-foundation.md`. Prefer the foundation helper when available:

```bash
python "$CODEX_HOME/skills/foundation/scripts/remember_foundation.py" stamp-run --project . --skill /equip-agent --phase A4 --output "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, append the timestamp, skill, phase, output path, memory updates, and short note manually.

## Workflow

1. List every capability required by the workflow.
2. Map each capability to a tool, API, data source, or human step.
3. Define required permissions and identity boundaries.
4. Identify context sources and memory rules.
5. Specify error handling for failed or unsafe tool calls.
6. Note audit, privacy, and security requirements.
7. Produce a capability map.

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
