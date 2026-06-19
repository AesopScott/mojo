---
name: build-agent
description: Implement the MAPS Build phase for an agent or multi-agent system. Use when turning a design into a runnable agent loop, prompts, state, routing, orchestration, project files, local run commands, and basic tests.
---

# Build Agent
## Versioning

Current version: 0.1.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-19 - v0.1.0 - Established the initial MAPS skill version baseline and changelog tracking.

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

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/equip-agent` to wire tools, permissions, memory, and data sources, or `/evaluate-agent` if the build is already equipped enough to test.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
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
