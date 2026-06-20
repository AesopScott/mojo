---
name: design-experience
description: Run MAPS M8 Experience Design for multi-agent products, or optional A2 Experience Design for single-agent products without an M layer. Use when Codex needs to turn product intent, orchestration behavior, agent behavior, and product constraints into user journeys, surfaces, information architecture, interaction states, accessibility requirements, and system-evaluation handoffs.
---

# Design Experience
## Versioning

Current version: 0.1.1.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-20 - v0.1.1 - Clarified that multi-agent M8 hands to M9 System Evaluate while optional single-agent A2 hands to A3 Build or A5 Evaluate as needed.
- 2026-06-19 - v0.1.0 - Established the initial MAPS skill version baseline and changelog tracking.

Use this skill after M7 Orchestration Build exists and before M9 System Evaluate depends on product behavior. For a standalone agent with no multi-agent system, use the same workflow as optional A2 between Phase 2 Design and Phase 3 Build.

## Inputs

- Product intent, audience, promise, success criteria, failure criteria, and taste standard
- System shape: surfaces, workflows, objects, integrations, boundaries, and first useful slice
- Agent roster: agent roles, authority, responsibilities, handoffs, and human ownership
- Contracts, coordination model, shared capabilities, and orchestration behavior
- Existing Phase 1 and Phase 2 APS artifacts when the project already has agent briefs or designs
- Brand, design-system, accessibility, compliance, or platform constraints

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /design-experience --phase M8/A2 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Required interview

Before writing `experience-design.md`, ask for any missing answers. Do not design surfaces or journeys without knowing the user, promise, and trust boundary.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Use the questions below as the internal interview sequence: ask the next most important missing question, wait for the answer, then continue.

Ask:

- Is this M8 for a multi-agent product or optional A2 for a single-agent product?
- What user, customer, or operator journey should be designed first?
- What product promise and outcome must the experience make clear?
- What surfaces exist or are expected: app, chat, dashboard, approvals, notifications, settings, docs, or handoffs?
- What agent activity should users see, approve, interrupt, retry, or inspect?
- What uncertainty, citations, refusals, escalation, and recovery behavior must be visible?
- What brand, tone, accessibility, compliance, platform, or design-system constraints exist?
- What information architecture, object model, or navigation is already known?
- What states must be modeled: loading, streaming, blocked, partial success, error, escalation, success, review?
- What should be handed to Evaluate, Deploy/Observe, Improve, or an earlier APS phase?

If the user is not ready to answer, draft a first useful journey and ask them to accept, revise, or mark unknowns.

## Workflow

1. Restate the product promise, target user, trust boundary, and first useful user journey.
2. Identify every surface the user touches: app screens, chat surfaces, dashboards, notifications, approvals, settings, errors, docs, and handoff points.
3. Map the core journeys from user intent to completion, including human decisions, agent work, waiting, uncertainty, escalation, and recovery.
4. Define the information architecture: navigation, object hierarchy, labels, content grouping, and how users find current state.
5. Define how agent activity appears to users: planning, tool use, memory use, confidence, uncertainty, citations, approvals, refusals, handoffs, and completion.
6. Model interaction states: loading, streaming, empty, draft, pending approval, blocked, partial success, error, retry, escalation, success, and post-completion review.
7. Define visual and tone standards: density, hierarchy, affordances, language, voice, motion, and personality.
8. Define accessibility expectations: keyboard paths, focus behavior, semantics, contrast, motion, readable copy, form errors, and assistive-technology notes.
9. Decide what the experience requires from M9 System Evaluate, M10 Deploy/Observe, M11 Improve, and any APS phase that needs correction.
10. Write `experience-design.md` from the template and record unresolved decisions as explicit follow-up items.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/multi-agent-evaluate` for M8, `/build-agent` for optional single-agent A2 when the experience handoff is ready, or `/evaluate-agent` if optional single-agent A2 needs proof criteria before build.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output
- `m/{project-handle}/experience-design.md` for a multi-agent project, or `agents/{agent-handle}/experience-design.md` for optional single-agent A2
- User journeys and front-end surfaces
- Information architecture and navigation model
- Agent visibility, control, approval, refusal, handoff, and recovery rules
- Interaction-state inventory
- Accessibility and content requirements
- Handoff notes for M9 System Evaluate, M10 Deploy/Observe, M11 Improve, and any APS correction work

## Guardrails

- Do not design generic decoration. M8 is about product behavior, user control, clarity, and trust.
- Do not hide agent uncertainty, tool use, or approval needs if the user must understand them to make a safe decision.
- Do not move orchestration logic into M8. Coordination belongs in M4 and orchestration belongs in M7; M8 describes the user-facing experience of that behavior.
- Do not create new agent responsibilities silently. Send responsibility changes back to M2 Roster or APS Phase 1.
- Do not skip accessibility. Treat keyboard, focus, semantics, contrast, motion, and readable state/error copy as phase requirements.
