---
name: phase-alignment
description: Create the MAPS Phase 00 Alignment artifact. Use when agreeing on lifecycle phase names, phase order, scope, scaffolding, repo structure, curriculum structure, naming decisions, templates, catalogs, and where future work belongs before defining or building agents.
---

# Phase Alignment
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

Use this skill before the Define phase to agree on the lifecycle structure itself. This is the phase for scaffolding, naming, boundaries, and shared understanding.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /phase-alignment --phase M00 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Required interview

Before writing the phase alignment brief, ask for any missing answers. Do not decide lifecycle names, scope, or repo structure without confirmation.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Use the questions below as the internal interview sequence: ask the next most important missing question, wait for the answer, then continue.

Ask:

- What framework, course, project, or repo are we aligning?
- Who is the audience or operator?
- What lifecycle or curriculum problem are we solving?
- What phase names, order, and boundaries are already decided?
- What phase names, order, and boundaries are still open?
- What outputs should each phase produce?
- What skills, templates, catalogs, docs, and folders are required?
- What belongs outside this framework or should be postponed?
- What naming decisions need to be durable?
- What unresolved questions should be carried forward?

If the user only has a rough idea, draft a candidate phase map and ask them to accept, revise, or reject it.

## Workflow

1. Identify the teaching or project goal.
2. Name the intended audience and use case.
3. Draft or revise the phase sequence.
4. Define what each phase means and what output it produces.
5. Decide repository, curriculum, skill, template, and catalog structure.
6. Record naming decisions and unresolved questions.
7. Produce a phase alignment brief.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/scaffold` when a new MAPS repo should be created, or `/foundation` when starting a project inside the agreed structure.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output
Return:

- Framework name
- Purpose
- Audience
- Phase sequence
- Phase definitions
- Structure decisions
- Naming decisions
- Open questions

Use `templates/phase-alignment-brief.md` from the MAPS repo when working inside this repository.

## Done Criteria

- The lifecycle has agreed phase names and order.
- Each phase has a clear purpose and output.
- The scaffold is explicit.
- Future work has a destination.
- Open questions are visible.
