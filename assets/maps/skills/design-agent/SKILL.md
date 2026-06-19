---
name: design-agent
description: Create the MAPS Design phase artifact for an agent or multi-agent system. Use when defining roles, workflows, handoffs, memory, context, guardrails, approvals, escalation paths, test-first proof requirements, and system boundaries from an agent brief.
---

# Design Agent
## Versioning

Current version: 0.3.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-19 - v0.3.0 - Added voice profile selection from the Mindshare voice taxonomy and required voice profile output in agent designs.
- 2026-06-19 - v0.2.0 - Tightened Research and Recommend flow: ask only for the source brief first when missing, research and recommend before interviewing, and ask one accept/revise question instead of a blank-slate design form.
- 2026-06-19 - v0.1.0 - Established the initial MAPS skill version baseline and changelog tracking.

## Overview

Use this skill to turn an agent brief into a practical system design.

Default to Research and Recommend (R&R): research comparable agents or similar implementations first, recommend a design answer for every major design question, then ask the user to accept or override the recommendations. Do not begin by asking the user a long list of blank-slate questions.

## Research And Recommend

R&R means the agent does the first pass of design judgment.

First ask only the minimum source question if it is not already known:

- Which agent brief or role contract is the source of truth?

After the source is known:

1. Read `agents/{agent-handle}/agent-brief.md` and `agents/{agent-handle}/agent-profile.md` when present.
2. Read `G:\My Drive\Mindshare\voice-taxonomy.md` when available and use it as the voice palette for role or agent communication design.
3. Identify the agent type, such as search agent, build agent, calendar integration agent, support agent, research agent, workflow agent, coding agent, role-agent, or human-in-the-loop operating agent.
4. Research comparable agents, reference architectures, product patterns, open-source implementations, platform examples, and design guidance. Use current web or repository research when available.
5. Analyze what the comparable examples suggest about workflow, tools, memory, controls, approvals, failures, observability, test strategy, acceptance scenarios, user experience, and communication voice.
6. Recommend a voice profile using the palette: primary voice, secondary blend, ratio, intensity, formality, emotional temperature, challenge style, sentence shape, humor level, forbidden voice habits, and example response.
7. Produce a recommendation for every design question in this skill.
8. Present the recommendations with the reasoning and any sources used.
9. Ask one question: whether the user accepts the recommendation, wants to revise one part, or wants one item marked unknown.

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

Before writing `agents/{agent-handle}/agent-design.md`, ask for any blocking missing answers after the Research and Recommend pass. Do not silently choose workflow, memory, tools, approvals, or proof requirements, but do not make the user fill out a design form before seeing recommendations.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Use the questions below as the internal interview sequence: ask the next most important missing question, wait for the answer, then continue.

Use these questions as an internal risk checklist, not as a form to ask upfront:

- Which agent brief or role contract is the source of truth?
- What design decision is already fixed, if any?
- Which recommendations from research should be accepted, rejected, or sharpened?
- Which voice profile should this agent use, if not already fixed by the agent profile?
- What workflow states, handoffs, and stopping conditions must be modeled?
- What memory, context, notes, sources, and RAG boundaries should this design respect?
- What tools, integrations, permissions, and credentials are allowed or forbidden?
- What human approvals, escalation paths, and refusal behavior are required?
- What failure modes worry the user most?
- What must be proven before Build starts?
- What open decisions should remain explicit instead of guessed?

If the user cannot answer, propose a recommendation and ask them to accept, revise, or mark it unknown.

Ask follow-up questions one at a time only when a missing answer affects source of truth, fixed design decisions, selected voice profile, allowed tools, approval gates, memory/RAG boundaries, safety, or proof required before build.

## Workflow

1. Identify the source agent brief or role contract.
2. Restate the agent goal and success criteria from the agent brief.
3. Read the voice taxonomy and existing agent profile voice fields when available.
4. Run R&R research for comparable agents or similar implementations.
5. Summarize the patterns, tradeoffs, and risks found during research.
6. Recommend whether the design should be single-agent, tool-using agent, supervised agent, or part of a multi-agent system.
7. Recommend the voice profile and explain why the selected voice fits the agent's work, users, risk, and authority.
8. Recommend each role, responsibility, input, output, and handoff.
9. Recommend workflow states, decision points, stopping conditions, and failure paths.
10. Recommend memory, context, retrieval boundaries, and data retention.
11. Recommend tools, integrations, permissions, and constraints.
12. Recommend guardrails, human approval gates, escalation paths, and forbidden paths.
13. Recommend observability needs and evaluation implications.
14. Recommend the test-first proof plan: test strategy, acceptance scenarios, eval shape, unit/integration/e2e balance, mock vs real tool policy, failure cases, regression gates, and what must be proven before Phase 3 Build starts.
15. Ask the user to accept the recommendation, revise one part, or mark one item unknown.
16. Ask follow-up questions one at a time only for blocking design, voice, approval, memory, tool, safety, or proof gaps.
17. Produce or update `agents/{agent-handle}/agent-design.md`.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/design-experience` or `/design-experience++` when user-facing surfaces matter, otherwise `/build-agent`.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output
Create or update `agents/{agent-handle}/agent-design.md` using `templates/workflow-spec.md` as the starting structure.

The completed file contains:

- System goal
- Research summary
- Comparable agents or patterns reviewed
- Recommendation table
- Agent roles
- Voice profile
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
- The agent has an explicit voice profile selected from or mapped to the voice taxonomy.
- Handoffs and approvals are explicit.
- Risks have controls.
- Recommendations have reasoning.
- User overrides are captured.
- Test-first proof requirements are explicit.
- The design names what must be proven before Phase 3 Build starts.
- The design can be built and evaluated.
