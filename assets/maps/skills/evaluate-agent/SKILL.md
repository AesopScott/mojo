---
name: evaluate-agent
description: Create the MAPS Evaluate phase artifact for an agent or multi-agent system. Use when designing scenario tests, eval datasets, rubrics, scorecards, regression checks, red-team prompts, safety checks, and release evidence.
---

# Evaluate Agent

## Overview

Use this skill to prove agent behavior before release and create evidence for improvement.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /evaluate-agent --phase A5 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Workflow

1. Restate the agent's success and failure criteria.
2. Create common, edge, adversarial, and unsafe scenarios.
3. Define expected behavior and scoring rubrics.
4. Add regression cases for known failures.
5. Include tool-use and escalation checks.
6. Run or specify the evaluation process.
7. Produce a scorecard and release recommendation.

## Output

Return:

- Eval scenarios
- Rubric or scoring method
- Scorecard
- Failure categories
- Release recommendation

Use `templates/eval-scorecard.md` from the MAPS repo when working inside this repository.

## Done Criteria

- Evals reflect real tasks.
- Risky behavior is tested.
- Results can guide go/no-go decisions.
- Failures feed the Improve phase.
