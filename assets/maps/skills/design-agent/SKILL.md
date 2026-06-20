---
name: design-agent
description: Create the MAPS Design phase artifact for an agent or multi-agent system. Use when defining roles, workflows, handoffs, memory, context, guardrails, approvals, escalation paths, test-first proof requirements, and system boundaries from an agent brief.
---

# Design Agent
## Versioning

Current version: 0.4.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-19 - v0.4.0 - Restored voice-profile selection from the voice taxonomy as a required design output while preserving profile gates and non-authority boundaries.
- 2026-06-19 - v0.3.0 - Made `agents/{agent-handle}/agent-profile.md` required before design, added profile-limit checks and safe profile sync fields, and required website profile pages to remain mirrors only.
- 2026-06-19 - v0.2.0 - Added role-to-agent design boundaries: `/design-agent` creates the design contract, runtime contract, build backlog, proof plan, and build gate, but must not claim implementation or operational readiness.
- 2026-06-19 - v0.1.0 - Established the initial MAPS skill version baseline and changelog tracking.

## Overview

Use this skill to turn an agent brief into a practical system design.

For role-to-agent work, this skill creates the design contract and build gate only. It does not implement the role as a working agent, does not mark the role as operating, does not grant autonomous runtime, and does not claim production readiness. Full implementation requires `/build-agent`; operational confidence requires the appropriate Equip, Evaluate, Deploy, Observe, and Improve evidence.

Default to Research and Recommend (R&R): research comparable agents or similar implementations first, recommend a design answer for every major design question, then ask the user to accept or override the recommendations. Do not begin by asking the user a long list of blank-slate questions.

## Research And Recommend

R&R means the agent does the first pass of design judgment.

1. Read the source agent brief at `agents/{agent-handle}/agent-brief.md`. If the source is a role contract, read the source role contract first and require a clear `/define-agent` handoff or an explicit Scott-approved direct role-to-design path.
2. Identify the agent type, such as search agent, build agent, calendar integration agent, support agent, research agent, workflow agent, or coding agent.
3. Read `agents/{agent-handle}/agent-profile.md`; if it is missing, stop and route back to `/define-agent` to create the profile before design.
4. Preserve the profile's authority, memory, tools, approvals, stop conditions, auditability, activation status, profile gates, runtime enforcement status, and website mirror status.
5. Read the voice taxonomy at `G:\My Drive\Mindshare\voice-taxonomy.md` when available and recommend a voice profile for the design. If it is unavailable, state the limitation and preserve any voice fields already present in the role contract or agent profile.
6. Treat voice as behavioral expression only. Voice never grants authority, activation, tool access, memory rights, production access, external communication, spending, autonomous runtime, secrets access, or authority expansion.
7. Treat website profile pages as mirrors only. They never grant authority, activation, tool access, memory rights, production access, external communication, spending, or autonomous runtime.
8. Research comparable agents, reference architectures, product patterns, open-source implementations, platform examples, and design guidance. Use current web or repository research when available.
9. Analyze what the comparable examples suggest about workflow, tools, memory, controls, approvals, failures, observability, test strategy, acceptance scenarios, and user experience.
10. Produce a recommendation for every design question in this skill.
11. Present the recommendations with the reasoning and any sources used.
12. Ask the user to override only the recommendations they disagree with or want to sharpen.

If research access is unavailable, state that limitation and use known patterns from the brief and MAPS catalogs as the basis for the recommendations.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

For role-to-agent design, preserve the source role contract as the authority source for mandate, voice, maturity, authority, non-responsibilities, forbidden actions, escalation, learning loop, and memory rules. The agent brief states what part of the role becomes runnable. The agent profile is the runtime control contract for authority, tools, memory, approvals, stop conditions, auditability, activation status, profile gates, and runtime enforcement status. Website profile pages are mirrors only and must not grant authority.

When the proposed design needs more authority than the profile allows, do not expand the profile. Instead, add an approval-required gate to the design and leave the profile authority fields unchanged.

Voice-profile selection may sharpen style, tone, challenge behavior, humor, sentence shape, and example phrasing, but it must not change the profile's authority, tools, memory, approval gates, activation status, runtime enforcement, website mirror boundary, or safe profile sync limits.

`/design-agent` may update only design-derived profile sync fields that do not expand authority, such as:

- Last synchronized design artifact.
- Last synchronized design timestamp.
- Design sync status.
- Runtime enforcement status, only to `not built` or another non-activation status.
- Pending profile questions.
- Next MAPS skill.
- Website mirror sync needed: yes/no.

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
- If the source is a role contract, has `/define-agent` created the agent brief, or has Scott explicitly approved a direct role-to-design path?
- Is `agents/{agent-handle}/agent-profile.md` present, and should the design update it or treat it as read-only input?
- Which voice profile from `G:\My Drive\Mindshare\voice-taxonomy.md` should be used, or should the design recommend one?
- What design decision is already fixed, if any?
- Which recommendations from research should be accepted, rejected, or sharpened?
- What workflow states, handoffs, and stopping conditions must be modeled?
- What memory, context, notes, sources, and RAG boundaries should this design respect?
- What tools, integrations, permissions, and credentials are allowed or forbidden?
- What human approvals, escalation paths, and refusal behavior are required?
- What failure modes worry the user most?
- What must be proven before `/build-agent` starts?
- What runtime target, runtime-neutral profile, adapter requirement, or no-adapter decision must Build use?
- What open decisions should remain explicit instead of guessed?

If the user cannot answer, propose a recommendation and ask them to accept, revise, or mark it unknown.

## Workflow

1. Restate the agent goal and success criteria from the agent brief.
2. If this is role-to-agent design, read the source role contract and record which part of the role becomes a runnable agent.
3. Read `agents/{agent-handle}/agent-profile.md`; if it is missing, stop and route back to `/define-agent`.
4. Check the design intent against the profile's authority, memory, tool, approval, stop-condition, auditability, activation, profile-gate, and runtime-enforcement controls.
5. Read `G:\My Drive\Mindshare\voice-taxonomy.md` when available and recommend a voice profile; preserve existing profile gates if the taxonomy is unavailable.
6. Record voice as non-authority expression only, separate from authority, activation, tools, memory, production, spending, secrets, external communication, and autonomous runtime.
7. Run R&R research for comparable agents or similar implementations.
8. Summarize the patterns, tradeoffs, and risks found during research.
9. Recommend whether the design should be single-agent, tool-using agent, supervised agent, or part of a multi-agent system.
10. Recommend each role, responsibility, input, output, and handoff.
11. Recommend workflow states, decision points, stopping conditions, and failure paths.
12. Recommend memory, context, retrieval boundaries, and data retention.
13. Recommend tools, integrations, permissions, and constraints.
14. Recommend guardrails, human approval gates, escalation paths, and forbidden paths.
15. Recommend observability needs and evaluation implications.
16. Recommend the test-first proof plan: test strategy, acceptance scenarios, eval shape, unit/integration/e2e balance, mock vs real tool policy, failure cases, regression gates, and what must be proven before `/build-agent` starts.
17. State whether Build must create a runtime profile, runtime adapter, or no adapter.
18. Create or update an ordered build backlog when the design identifies implementation slices.
19. Update only safe, non-authority-expanding profile sync fields when the project and source role allow profile updates.
20. If a website profile page exists, report whether it needs sync and state that the website page is a mirror only.
21. Ask the user to accept or override the recommendations.
22. Produce or update `agents/{agent-handle}/agent-design.md`.
23. State explicitly that the design is not implementation, operating authorization, autonomous activation, production readiness, external communication authority, spending authority, or authority expansion.

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
Create or update `agents/{agent-handle}/agent-design.md` using `templates/workflow-spec.md` from the installed skill when available, otherwise `assets/maps/templates/workflow-spec.md` from the Mojo repo when working inside this repository.

For role-to-agent designs, also create or update `agents/{agent-handle}/agent-backlog.md` using `assets/maps/templates/agent-backlog.md` when implementation slices are identified. Read `agents/{agent-handle}/agent-profile.md` as a required control contract. Update it only within the authority and mirror rules stated by the source role contract, project foundation, and the safe profile sync field list above.

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
- Voice profile, including primary voice, secondary blend, ratio, intensity, formality, emotional temperature, challenge style, sentence shape, humor level, forbidden habits, taxonomy source, and example response
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
- Proof required before `/build-agent`
- Build gate, including what must be proven before `/build-agent` starts
- Agent profile source path, profile gates, profile-limit check result, and any approval-required profile conflicts
- Safe profile sync fields updated or explicitly left unchanged
- Website profile mirror sync status, if a website profile page exists
- Runtime target, runtime-neutral profile, runtime adapter, or no-adapter decision
- Explicit statement that voice is not authority, activation, tools, memory, production access, spending authority, secrets access, external communication authority, autonomous runtime, or authority expansion
- Explicit non-implementation statement
- Open questions

Use `assets/maps/templates/workflow-spec.md` from the Mojo repo when the installed skill does not provide its own workflow-spec template.

## Done Criteria

- Every role has a purpose.
- Handoffs and approvals are explicit.
- Risks have controls.
- Recommendations have reasoning.
- User overrides are captured.
- Test-first proof requirements are explicit.
- The design names what must be proven before `/build-agent` starts.
- The design includes a build gate and cannot be mistaken for implementation.
- Role contract, agent brief, and agent profile authority, memory, tool, approval, stop-condition, activation, profile-gate, and runtime-enforcement controls do not conflict.
- The design stops or records an approval-required gate when it needs more authority than the profile grants.
- Profile sync updates are limited to non-authority-expanding design sync fields.
- Website profile pages are labeled and handled as mirrors only.
- Voice-profile selection is present, sourced from the voice taxonomy when available, and explicitly separated from authority, activation, tools, memory, production, spending, secrets, external communication, autonomous runtime, and authority expansion.
- The design does not claim autonomy, operating authorization, production readiness, external communication authority, spending authority, or authority expansion without Scott approval.
- The design can be built and evaluated.
