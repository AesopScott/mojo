---
name: build-agent
description: Implement the MAPS Build phase for an agent or multi-agent system. Use when turning a design into a runnable agent loop, prompts, state, routing, orchestration, project files, local run commands, and basic tests.
---

# Build Agent

## Overview

Use this skill to implement the smallest useful agent that matches the design.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /build-agent --phase A3 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Required interview

Before changing implementation files, ask for any missing answers. Do not build an agent without a confirmed design target and run path.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Use the questions below as the internal interview sequence: ask the next most important missing question, wait for the answer, then continue.

Ask:

- Which agent, role, or capability should be built now?
- Which design artifact is the source of truth?
- What is the smallest useful runnable slice?
- What runtime, framework, language, or repo conventions should be used?
- What tools, APIs, secrets, memory, or RAG access should be stubbed versus wired for real?
- What should be explicitly out of scope for this build pass?
- What command should run the agent locally?
- What test or verification should prove the first slice works?
- What failure behavior or guardrail must exist in the first build?
- What should be deferred to Equip, Evaluate, or Deploy?

If the answers are missing, ask before editing code.

## Workflow

1. Read the project structure and existing conventions first.
2. Identify the minimal runnable agent path.
3. Implement prompts, state, routing, and orchestration.
4. Add tool stubs or interfaces needed by the design.
5. Add basic verification for the happy path.
6. Document the local run command.
7. Record deferred risks for Equip or Evaluate.

## Output

Return:

- Files changed
- How to run locally
- What was verified
- What remains for Equip, Evaluate, or Deploy

## Done Criteria

- The agent runs.
- The implementation matches the design.
- Basic behavior is verified.
- Known gaps are explicit.
