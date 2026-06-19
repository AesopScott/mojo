---
name: improve-agent
description: Create the MAPS Improve phase artifact for an agent or multi-agent system. Use when turning eval results, traces, failures, incidents, user feedback, and observations into prioritized prompt, tool, memory, policy, design, and eval improvements.
---

# Improve Agent

## Overview

Use this skill to turn evidence into the next iteration of an agent system.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /improve-agent --phase A8 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Workflow

1. Gather eval failures, traces, incidents, and user feedback.
2. Cluster problems by root cause.
3. Decide whether each fix belongs in prompts, tools, memory, policy, design, or evals.
4. Prioritize by impact, effort, and risk.
5. Add or update regression coverage.
6. Record the next experiment.
7. Feed lessons back into earlier MAPS phases.

## Output

Return:

- Improvement backlog
- Root-cause notes
- Proposed changes
- Eval coverage updates
- Next experiment

Use `templates/improvement-backlog.md` from the MAPS repo when working inside this repository.

## Done Criteria

- Improvements are evidence-backed.
- Regression coverage is considered.
- Priorities are clear.
- Earlier phase docs are updated when needed.
