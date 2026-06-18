---
name: observe-agent
description: Create the MAPS Observe phase artifact for an agent or multi-agent system. Use when designing telemetry, traces, dashboards, quality signals, cost and latency monitoring, drift review, failure logs, and operator review loops.
---

# Observe Agent

## Overview

Use this skill to make production agent behavior inspectable and improvable.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it to the memory stores defined by the foundation contract instead of inventing new locations. If the run changes memory configuration, notes/RAG locations, source inventory, or durable project context, update `project-foundation.md` and `.maps/foundation-preferences.json` through `/foundation` conventions.

At the end of the run, append a row to `MAPS Skill Run Log` in `project-foundation.md`. Prefer the foundation helper when available:

```bash
python "$CODEX_HOME/skills/foundation/scripts/remember_foundation.py" stamp-run --project . --skill /observe-agent --phase A7 --output "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, append the timestamp, skill, phase, output path, memory updates, and short note manually.

## Workflow

1. Identify what operators need to know after deployment.
2. Map traces, tool calls, cost, latency, and quality signals.
3. Define failure and escalation review.
4. Define drift, privacy, and policy monitoring.
5. Set a review cadence and ownership.
6. Convert observations into improvement candidates.
7. Produce an observation report or plan.

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
