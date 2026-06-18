---
name: shape
description: Run M1 System Shape for a MAPS project. Use after M0 Project Foundation to scope the workflow and choose Unknown / Scope First, Single-Agent / APS, or Multi-Agent / MAPS before defining an agent roster, contracts, or implementation plan.
---

# Shape

Use `/shape` at M1 to discover enough of the operating model to choose the right track.

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
