---
name: define-agent
description: Create an agent brief for the MAPS Define phase from an existing role. Use when turning an approved role artifact into an agent brief with goals, users, authorization, scope, non-goals, success criteria, failure criteria, escalation points, risks, and assumptions.
---

# Define Agent
## Versioning

Current version: 0.6.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-19 - v0.6.0 - Added voice taxonomy support so Define creates agent profiles with selectable voice settings.
- 2026-06-19 - v0.5.0 - Added Research and Recommend behavior for role-to-agent definition: ask only the minimum source-role question first, then recommend job, authority, boundaries, proof, and profile settings before asking one accept/revise question.
- 2026-06-19 - v0.4.0 - Added required agent profile output so role-to-agent conversion creates or updates `agents/{agent-handle}/agent-profile.md` and reports org chart/profile surface status.
- 2026-06-19 - v0.3.0 - Made `/define-agent` role-first: it now starts from an existing role artifact and routes role creation back to Ana / `/role` when no source role exists.
- 2026-06-19 - v0.2.0 - Added role-sourced agent definition, build-authorization checks, expanded brief output, and installed the missing agent-definition template.
- 2026-06-19 - v0.1.0 - Established the initial MAPS skill version baseline and changelog tracking.

## Overview

Use this skill to turn an existing role into an agent brief. Prefer clarity over implementation detail.

Define is the bridge from role into agent design. It should answer whether this role is ready to become an agent, who the agent serves, what job it owns, what authority it may have, what evidence will prove value, and what boundaries must survive later design/build work.

If there is no role artifact yet, do not define an agent from scratch. Route the user to Ana / Recruiter and `/role` first. The first question should be: "Which role are we turning into an agent?" If the answer is not an existing role or role artifact, the next step is `/role`, not `/define-agent`.

Do not solve A2 design, A3 build, tool wiring, orchestration, deployment, or evaluation implementation here. Capture enough to hand off cleanly to `/design-agent`.

## Role-sourced definition

Always start from a role. Read the role artifact before interviewing:

- `roles/<role-slug>/role-agent.md`
- `roles/<role-slug>/workflow.md` when present
- `roles/<role-slug>/loop.md` when present
- `roles/<role-slug>/state.json` when present

If Ana / Recruiter owns the role intake, use Ana's role contract and recommendations as the source of role scope. If the role is architecture-sensitive, skill-backed, hook-backed, loop-backed, active, autonomous, or authority-heavy, use Vik / Agentic Systems Program Architect as the architecture reviewer. If the next step needs pipeline sequencing, use Matt / Agentic Systems Program Manager for handoff guidance.

Before representing the work as an agent build path, check the role artifact for:

- professional maturity level
- authorization status
- approval evidence
- agent build readiness
- missing criteria before build
- authority and autonomy boundaries
- memory contract
- tool/data constraints
- escalation and stop conditions

If agent build authorization is missing, the output may still be a draft agent brief, but it must clearly say `Agent build authorization: not approved yet` and identify the approval needed before `/design-agent`.

## Research And Recommend

Default to Research and Recommend after the source role is known. The user should not have to answer the whole agent brief manually.

First ask only the minimum source question if it is not already known:

- Which role are we turning into an agent?

After the source role is known, read the role artifacts and run Research and Recommend before asking more questions.

Research and Recommend means:

1. Read the source role contract, workflow, loop, state, project foundation, and existing role-agent context.
2. Read `G:\My Drive\Mindshare\voice-taxonomy.md` when available and use it as the selectable voice palette.
3. Identify the agent category: advisory, workflow owner, tool-using agent, human-in-the-loop agent, autonomous candidate, skill-backed role, hook-backed role, loop-backed role, support agent, research agent, data agent, or another clear category.
4. Research comparable agents, human operating roles, workflow patterns, governance references, and implementation examples when current web or repository research is available.
5. Use the research and role artifact to recommend:
   - agent job to be done
   - user/operator
   - desired outcome
   - persona and selected voice profile
   - lifecycle status and build authorization status
   - autonomy level
   - authority level
   - allowed actions
   - approval-required actions
   - forbidden actions
   - requested tools and data
   - state and memory intent
   - handoffs
   - in-scope and out-of-scope work
   - success, failure, escalation, and stop criteria
   - proof scenarios
   - agent profile controls
6. Present the recommendation with concise reasoning and sources used.
7. Ask one question: whether the user accepts the recommendation, wants to revise one part, or wants one item marked unknown.

Do not ask the full interview list before producing recommendations. Ask follow-up questions one at a time only when a missing answer affects identity, job, operator, authority, approval boundary, forbidden action, or safety.

If research access is unavailable, state that limitation and produce a provisional recommendation from the role artifact, project foundation, and MAPS patterns.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /define-agent --phase A1 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Required Interview

Before writing `agents/{agent-handle}/agent-brief.md`, identify the source role and run Research and Recommend. Do not invent the agent's job, authority, or boundaries without confirmation, but do not force the user to fill a blank form when the role artifact and research can support a recommendation.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Use the questions below as the internal interview sequence: ask the next most important missing question, wait for the answer, then continue.

If a role artifact, foundation artifact, or prior user messages already answer a field, do not ask again. Restate the inferred answer only when it materially affects authority, scope, or risk.

If the missing answer is non-blocking, write the brief with an explicit open question instead of stalling. Ask before writing only when the missing answer affects identity, job, operator, authority, approval boundary, forbidden action, or safety.

Use these questions as an internal risk checklist, not as a form to ask upfront:

- Which role are we turning into an agent?
- Who is the user, customer, or operator?
- What job should the agent do in one sentence?
- What outcome proves the agent helped?
- What should the agent never do?
- Should it advise, draft, act with approval, or act autonomously within limits?
- What actions are allowed without approval?
- What actions require approval?
- What tools, data, memory, or systems might it need?
- Which voice profile should this agent use?
- What is in scope and out of scope?
- What success, failure, and escalation criteria should be visible?

If the user already provided some answers, restate them in the recommendation and ask only for the missing or risky decisions.

## Workflow

1. Identify the source role and source role artifact.
2. If no source role exists, stop and recommend `/role` with Ana / Recruiter.
3. Run Research and Recommend.
4. Ask the user to accept the recommendation, revise one part, or mark one item unknown.
5. Ask follow-up questions one at a time only for blocking identity, job, operator, authority, approval, forbidden-action, or safety gaps.
6. Identify the user or operator from the role artifact, research, recommendation, or confirmed user answer.
7. State the job to be done in one sentence.
8. Assign a stable agent handle from the source role.
9. Record agent build authorization status and approval evidence.
10. Define persona and selected voice profile when the agent will communicate with humans or other agents.
11. Define the authorization level: advise, draft, act with approval, or act autonomously within explicit limits.
12. Name actions allowed without approval, actions that require approval, and actions that are forbidden.
13. List requested tool access separately from granted authorization.
14. Define state and memory intent without designing storage implementation.
15. Define handoffs to humans, roles, or agents.
16. Separate in-scope work from out-of-scope work.
17. Define observable success and failure criteria.
18. Name human escalation points and stop conditions.
19. Capture risks, assumptions, and unknowns.
20. Seed proof scenarios for `/design-agent` and `/evaluate-agent`.
21. Produce or update `agents/{agent-handle}/agent-brief.md`.
22. Produce or update `agents/{agent-handle}/agent-profile.md` with configurable profile settings.
23. If a project org chart or profile surface exists, update the role status from role to agent and link to the agent profile. If that surface is external to the current repo or not safely editable, report the required profile update as a pending handoff.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Agent profile status: whether `agents/{agent-handle}/agent-profile.md` was created or updated, and whether any visible org chart/profile surface was updated or left as a pending handoff.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/design-agent` for the agent design, unless the brief still has unanswered scope or authority questions.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output
Create or update `agents/{agent-handle}/agent-brief.md` using `templates/agent-definition-template.md` as the starting structure.

Also create or update `agents/{agent-handle}/agent-profile.md` using `templates/agent-profile-template.md` when available. The profile is the operator-facing settings artifact that can be mirrored to an org chart, website, dashboard, or admin UI. It should contain:

- identity and source artifacts
- activation status
- autonomy level
- authority level
- selected voice profile
- granted and requested tool access
- known hook implementations
- memory read/write rights
- approval gates
- next MAPS skill

The completed file contains:

- Name
- Agent handle
- Role or mandate
- User or operator
- Job to be done
- Desired outcome
- Persona, tone, and selected voice profile
- Source role or originating request
- Source artifacts
- Agent build authorization status
- Approval evidence
- Authorization level
- Allowed without approval
- Approval required for
- Forbidden actions
- Tool access requested
- State and memory intent
- Handoffs
- In scope
- Out of scope
- Success criteria
- Failure criteria
- Escalation points
- Stop conditions
- Proof scenarios
- Open questions
- Risks and assumptions
- Next skill recommendation

Do not overwrite `templates/agent-definition-template.md`; it is the reusable input template.

## Done Criteria

- The agent has a clear job.
- The authorization boundary is explicit.
- Success can be judged.
- Boundaries are explicit.
- Open questions are visible.
- Requested tools are separated from granted authority.
- State, memory, handoffs, and stop conditions are named at brief level.
- The next skill is explicit.
- The agent profile settings artifact exists or the blocked profile update is explicitly reported.
- The agent profile includes a selected voice profile or an explicit pending voice-selection question.
