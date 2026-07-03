---
name: multi-agent-capabilities
description: Create MAPS M6 Capabilities for a multi-agent system. Use after M5 Agent Buildout to map shared tools, MCP servers, APIs, data sources, memory stores, credentials, permissions, limits, fallbacks, audit needs, and capability ownership before orchestration build.
---

# Multi-Agent Capabilities
## Versioning

Current version: 0.1.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-20 - v0.1.0 - Created M6 Capabilities for shared tools, data, memory, permissions, fallbacks, and audit ownership.

Use `/multi-agent-capabilities` at M6 after M5 Buildout. M6 maps what the system can touch and how access is controlled before orchestration.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /multi-agent-capabilities --phase M6 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Research and Recommend

Read `assets/maps/catalogs/multi-agent-research-sources.md` when available. Use MCP for tool/resource/prompt boundaries, OpenAI tools/guardrails guidance for tool controls, and NIST AI RMF for permission, audit, and risk ownership.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out.

Start with:

> Which shared capability is most critical or riskiest for the multi-agent system?

Then ask only the next missing question needed to map tools, resources, permissions, credentials, memory, limits, fallbacks, and audit.

## Workflow

1. Read M0-M5 artifacts and child APS capability maps when they exist.
2. Inventory shared capabilities: tools, APIs, MCP servers, data sources, memory stores, indexes, models, queues, schedulers, notifications, and human approval surfaces.
3. For each capability, define owner, allowed participants, credential source, permission level, data sensitivity, rate/cost limits, logging, audit, fallback, and revocation path.
4. Separate agent-to-tool capabilities from agent-to-agent communication capabilities.
5. Define capability conflicts, shared-state risks, least-privilege changes, and missing adapter work.
6. Define M7 orchestration prerequisites.
7. Produce `m/<project-handle>/capabilities.md` from `templates/multi-agent-capabilities.md`.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete capability artifact or decision produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/multi-agent-orchestration` when capabilities are mapped, or `/equip-agent` for a child agent with missing capability detail.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output

- `m/<project-handle>/capabilities.md`
- Shared capability inventory
- Permission, credential, memory, data, and audit map
- Capability ownership and revocation path
- Fallbacks, limits, and conflict notes
- M7 orchestration-readiness notes

## Guardrails

- Do not store real secrets.
- Do not grant broad shared access when a per-agent scoped permission is possible.
- Do not merge agent-to-tool and agent-to-agent concerns.
- Do not proceed to M7 with unknown credential, audit, or revocation ownership for critical capabilities.
