---
name: design-agent
description: Create the MAPS Design phase artifact for an agent or multi-agent system. Use when defining roles, workflows, handoffs, memory, context, guardrails, approvals, escalation paths, test-first proof requirements, and system boundaries from an agent brief.
---

# Design Agent

## Overview

Use this skill to turn an agent brief into a practical system design.

Default to Research and Recommend (R&R): research comparable agents or similar implementations first, recommend a design answer for every major design question, then ask the user to accept or override the recommendations. Do not begin by asking the user a long list of blank-slate questions.

## Research And Recommend

R&R means the agent does the first pass of design judgment.

1. Read `agents/{agent-handle}/agent-brief.md`.
2. Identify the agent type, such as search agent, build agent, calendar integration agent, support agent, research agent, workflow agent, or coding agent.
3. Research comparable agents, reference architectures, product patterns, open-source implementations, platform examples, and design guidance. Use current web or repository research when available.
4. Analyze what the comparable examples suggest about workflow, tools, memory, controls, approvals, failures, observability, test strategy, acceptance scenarios, and user experience.
5. Produce a recommendation for every design question in this skill.
6. Present the recommendations with the reasoning and any sources used.
7. Ask the user to override only the recommendations they disagree with or want to sharpen.

If research access is unavailable, state that limitation and use known patterns from the brief and MAPS catalogs as the basis for the recommendations.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /design-agent --phase A2 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Required interview

Before writing `agents/{agent-handle}/agent-design.md`, ask for any missing answers after the Research and Recommend pass. Do not silently choose workflow, memory, tools, approvals, or proof requirements.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Use the questions below as the internal interview sequence: ask the next most important missing question, wait for the answer, then continue.

Ask:

- Which agent brief or role contract is the source of truth?
- What design decision is already fixed, if any?
- Which recommendations from research should be accepted, rejected, or sharpened?
- What workflow states, handoffs, and stopping conditions must be modeled?
- What memory, context, notes, sources, and RAG boundaries should this design respect?
- What tools, integrations, permissions, and credentials are allowed or forbidden?
- What human approvals, escalation paths, and refusal behavior are required?
- What failure modes worry the user most?
- What must be proven before Build starts?
- What open decisions should remain explicit instead of guessed?

If the user cannot answer, propose a recommendation and ask them to accept, revise, or mark it unknown.

## Workflow

1. Restate the agent goal and success criteria from the agent brief.
2. Run R&R research for comparable agents or similar implementations.
3. Summarize the patterns, tradeoffs, and risks found during research.
4. Recommend whether the design should be single-agent, tool-using agent, supervised agent, or part of a multi-agent system.
5. Recommend each role, responsibility, input, output, and handoff.
6. Recommend workflow states, decision points, stopping conditions, and failure paths.
7. Recommend memory, context, retrieval boundaries, and data retention.
8. Recommend tools, integrations, permissions, and constraints.
9. Recommend guardrails, human approval gates, escalation paths, and forbidden paths.
10. Recommend observability needs and evaluation implications.
11. Recommend the test-first proof plan: test strategy, acceptance scenarios, eval shape, unit/integration/e2e balance, mock vs real tool policy, failure cases, regression gates, and what must be proven before Phase 3 Build starts.
12. Ask the user to accept or override the recommendations.
13. Produce or update `agents/{agent-handle}/agent-design.md`.

## Output

Create or update `agents/{agent-handle}/agent-design.md` using `templates/workflow-spec.md` as the starting structure.

The completed file contains:

- System goal
- Research summary
- Comparable agents or patterns reviewed
- Recommendation table
- Agent roles
- Workflow
- Decision points
- State and memory
- Tools and integrations
- Guardrails
- Human approval gates
- Handoffs
- Failure modes
- Observability needs
- Test strategy
- Acceptance scenarios
- Eval shape
- Unit, integration, and e2e balance
- Mock vs real tool policy
- Failure cases
- Regression gates
- Proof required before Phase 3 Build
- Open questions

Use `templates/workflow-spec.md` from the MAPS repo when working inside this repository.

## Done Criteria

- Every role has a purpose.
- Handoffs and approvals are explicit.
- Risks have controls.
- Recommendations have reasoning.
- User overrides are captured.
- Test-first proof requirements are explicit.
- The design names what must be proven before Phase 3 Build starts.
- The design can be built and evaluated.
