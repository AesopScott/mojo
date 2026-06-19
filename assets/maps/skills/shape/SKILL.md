---
name: shape
description: Run M1 System Shape for a MAPS project. Use after M0 Project Foundation to scope the workflow and choose Unknown / Scope First, Single-Agent / APS, or Multi-Agent / MAPS before defining an agent roster, contracts, or implementation plan.
---

# Shape

Use `/shape` at M1 to discover enough of the operating model to choose the right track.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /shape --phase M1 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Workflow

1. Read the M0 Project Foundation artifact and source inventory.
2. Start with the S/M/U question:
   - Unknown / Scope First when the workflow, actors, data, handoffs, or risk boundaries are not clear.
   - Single-Agent / APS when one coherent agent can own the outcome.
   - Multi-Agent / MAPS when distinct roles, tools, permissions, memory, review, escalation, or parallel work are justified.
3. Run BPMN Lite:
   - start/end
   - tasks
   - decisions/gateways
   - handoffs/messages
   - human approvals
   - exception paths
4. Apply role-pressure checks:
   - Does role separation reduce cognitive load or add coordination cost?
   - Does each proposed role need different knowledge, tools, permissions, memory, timing, or accountability?
5. Identify the interaction, knowledge, coordination, and risk shape.
6. Produce `templates/system-shape.md`.

## Output

- Completed `system-shape.md`
- Track decision: Unknown / Scope First, Single-Agent / APS, or Multi-Agent / MAPS
- Rationale and evidence
- Next-step recommendation:
  - continue scoping
  - enter APS
  - continue to M2 Roster
