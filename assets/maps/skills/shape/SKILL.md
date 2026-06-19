---
name: shape
description: Run M1 System Shape for a MAPS project. Use after M0 Project Foundation to scope the workflow and choose Unknown / Scope First, Single-Agent / APS, or Multi-Agent / MAPS before defining an agent roster, contracts, or implementation plan.
---

# Shape
## Versioning

Current version: 0.2.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-19 - v0.2.0 - Added Research and Recommend guidance, ASPM advisory behavior, and source-backed track recommendations.
- 2026-06-19 - v0.1.0 - Established the initial MAPS skill version baseline and changelog tracking.

Use `/shape` at M1 to discover enough of the operating model to choose the right track.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /shape --phase M1 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Research and Recommend

Default to Research and Recommend after the first S/M/U orientation question. The user often will not know whether the system is single-agent, multi-agent, or scope-first until M1 helps them reason through the workflow.

Start with:

> Are we deciding between single-agent, multi-agent, or scope-first, or do you already know the track?

Then ask only the next missing question needed to understand the workflow, actors, outcome, handoffs, tools, memory, approvals, and risk. Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out.

After enough context exists to make a provisional track recommendation, stop interviewing and run Research and Recommend:

1. Read M0 Project Foundation, source inventory, persistent memory contract, and any existing role or workflow artifacts.
2. If an Agentic Systems Program Manager, ASPM, Matt, or pipeline owner role artifact exists, read it and use it as advisory guidance for phase boundaries, scope discipline, memory/RAG implications, and next-skill routing.
3. Read `references/shape-research-sources.md` and select the relevant source mix.
4. Research or cite comparable workflow-shape, role-pressure, team-design, BPMN/service-blueprint, and agent-orchestration references.
5. Recommend the S/M/U track:
   - Unknown / Scope First when the workflow, actors, data, handoffs, approval gates, or risk boundaries are not clear enough.
   - Single-Agent / APS when one coherent agent can own the outcome with one main context, tool boundary, memory contract, and evaluation surface.
   - Multi-Agent / MAPS when distinct roles, tools, permissions, memory, review, escalation, timing, or parallel work justify coordination cost.
6. Include an ASPM guidance note explaining what a pipeline/program manager would advise: whether to slow down for scope, proceed into APS, continue to MAPS, or create role agents before roster/contracts.
7. Present the recommendation with confidence, evidence, tradeoffs, and what would change the decision.
8. Ask the user to accept the recommendation, revise one assumption, or mark the decision as scope-first. Ask this as one question.

## Required interview

Before writing `system-shape.md`, ask for any missing answers. Do not decide the track from vibes or repo structure alone.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Use the questions below as the internal interview sequence, but do not force every answer before recommending. Ask the next most important missing question, wait for the answer, then continue.

Then ask:

- What workflow, service, product, or organization are we shaping?
- Who are the actors, users, operators, or roles involved?
- What outcome should the system own?
- What are the main tasks, decisions, handoffs, and approval points?
- What data, tools, memory, or permissions are involved?
- Which parts could be owned by one coherent agent?
- Which parts might need separate roles because of distinct expertise, tools, permissions, timing, memory, review, or accountability?
- What is still unknown enough that the right answer may be Scope First?
- What failure modes, compliance issues, or escalation needs change the system shape?
- How confident should the track decision be before moving on?

If any of those answers are missing or ambiguous, ask before creating or updating `system-shape.md`.

## Workflow

1. Read the M0 Project Foundation artifact and source inventory.
2. Start with the S/M/U question, then use Research and Recommend instead of making the user self-diagnose the track:
   - Unknown / Scope First when the workflow, actors, data, handoffs, or risk boundaries are not clear.
   - Single-Agent / APS when one coherent agent can own the outcome.
   - Multi-Agent / MAPS when distinct roles, tools, permissions, memory, review, escalation, or parallel work are justified.
3. Apply ASPM guidance when available:
   - protect phase boundaries
   - avoid premature roster/contract work when scope is unclear
   - identify when `/role` should run before deeper MAPS phases
   - identify memory/RAG choices that affect system shape
   - make the next skill recommendation explicit
4. Run BPMN Lite:
   - start/end
   - tasks
   - decisions/gateways
   - handoffs/messages
   - human approvals
   - exception paths
5. Apply role-pressure checks:
   - Does role separation reduce cognitive load or add coordination cost?
   - Does each proposed role need different knowledge, tools, permissions, memory, timing, or accountability?
6. Identify the interaction, knowledge, coordination, and risk shape.
7. Produce `templates/system-shape.md`.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/define-agent` for Single-Agent / APS, `/role` for root organization role agents, or the next MAPS roster/contract skill when the project is Multi-Agent / MAPS.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output
- Completed `system-shape.md`
- Research sources used and recommendation rationale
- ASPM guidance note when an ASPM, Matt, or pipeline owner role is available or implied
- Track decision: Unknown / Scope First, Single-Agent / APS, or Multi-Agent / MAPS
- Rationale and evidence
- Next-step recommendation:
  - continue scoping
  - enter APS
  - continue to M2 Roster

## References

Read `references/shape-research-sources.md` for every `/shape` run before making the S/M/U recommendation. It defines the source mix for workflow shape, role pressure, service design, and agent orchestration decisions.
