---
name: observe-agent
description: Create the MAPS Observe phase artifact for an agent or multi-agent system. Use when designing telemetry, traces, dashboards, quality signals, cost and latency monitoring, drift review, failure logs, and operator review loops.
---

# Observe Agent
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

Use this skill to make production agent behavior inspectable and improvable.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /observe-agent --phase A7 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Required interview

Before writing an observation plan, ask for any missing answers. Do not assume what operators care about after deployment.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Use the questions below as the internal interview sequence: ask the next most important missing question, wait for the answer, then continue.

Ask:

- Which deployed agent, role, workflow, or system should be observed?
- Who is the operator or reviewer?
- What quality, safety, cost, latency, usage, and business signals matter?
- What traces, tool calls, prompts, outputs, approvals, refusals, and escalations should be captured?
- What logs or data are sensitive and should be excluded or redacted?
- What failure categories require immediate alerting versus periodic review?
- What drift, memory, RAG, or policy risks should be monitored?
- What dashboard, report, note, or review cadence should operators use?
- Where should observations be written for later Improve work?
- Who owns follow-up when observations show problems?

If observability tooling is not available yet, ask whether to specify signals only or create a lightweight manual review loop.

## Workflow

1. Identify what operators need to know after deployment.
2. Map traces, tool calls, cost, latency, and quality signals.
3. Define failure and escalation review.
4. Define drift, privacy, and policy monitoring.
5. Set a review cadence and ownership.
6. Convert observations into improvement candidates.
7. Produce an observation report or plan.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/improve-agent` when observations reveal changes, or continue `/observe-agent` on the next review cadence.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output
Return:

- Quality signals
- Cost and latency signals
- Tool-use review
- Failure and escalation notes
- Candidate improvements

Use `templates/observation-report.md` from the MAPS repo when working inside this repository.

## Done Criteria

- Behavior can be inspected.
- Failures are captured.
- Costs and quality are visible.
- Evidence flows to Improve.
