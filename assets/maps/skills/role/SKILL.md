---
name: role
description: Build role agents for a root organization or multi-agent corporation. Use when the user wants to create an organizational role such as CEO, CFO, advisor, operator, manager, support lead, data steward, research lead, or functional department voice, and needs to decide whether the role should be advisory, workflow-owned, skill-backed, loop-backed, autonomous, human-in-the-loop, or only a lightweight prompt/persona.
---

# Role
## Versioning

Current version: 0.2.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-19 - v0.2.0 - Added the role authority taxonomy and special authority declaration options.
- 2026-06-19 - v0.1.0 - Established the initial MAPS skill version baseline and changelog tracking.

Use `/role` to design a role agent for an organization. This is not a MAPS phase skill. It is a role-construction skill developers can run repeatedly to create two or three organizational roles under a root company, team, service, or agentic corporation.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives `/role` its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends the `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /role --phase Role --output "<role artifact path>" --summary-file "<role artifact path>" --memory-updates "<role, memory, note, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/role.md`.

## Research and Recommend

Default to Research and Recommend after the role target is known. The user should not have to answer the whole role contract manually.

First collect only the minimum three answers:

- Role name: what role should be created? Example: CTO.
- User description: how the user describes this role, its purpose, or what they want from it.
- Role type or delivery method: advisory, workflow owner, skill-backed, loop-backed, tool-using agent, autonomous agent, human-in-the-loop agent, persona-only, or "not sure yet."

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Ask the next missing minimum answer, wait for the answer, then continue.

After those three answers are known, stop interviewing and run Research and Recommend.

External research is mandatory and heavily weighted. Do not produce the recommended role contract from project context or the bundled role-pattern ladder alone. Use project context to localize the answer, but use external sources to define the role capability, responsibilities, boundaries, proof, and operating model.

1. Read M0 foundation, M1 shape, and any existing role or organization artifacts if available.
2. Use `references/role-patterns.md` to classify the role mode.
3. Read `references/role-authority-taxonomy.md` to classify authority level, domains, gates, and special declarations.
4. Read `references/role-research-sources.md` and select the mandatory source mix for the role type.
5. Research comparable human role definitions, agent role patterns, operating models, workflows, and public references.
6. Use at least three external sources for every role recommendation:
   - one role-domain source for the human role or function
   - one operating-model or workflow source
   - one agent/governance/source-of-control reference when the role will use tools, memory, RAG, approvals, or autonomy
7. If web access is unavailable, use the bundled source list as the research plan and tell the user the recommendation is blocked or provisional until sources can be checked.
8. Recommend the rest of the role contract:
   - role type and mode
   - advisory behavior
   - workflow ownership
   - execution pattern
   - autonomy level
   - memory needs
   - tools and data access
   - boundaries and forbidden actions
   - escalation rules
   - authority taxonomy: level, domains, decision rights, execution rights, approval gates, revocation path, and special declarations
   - learning loop: how the role's responsibilities, capabilities, memory, and proof standards should grow over time
   - success evidence
   - proof scenarios
   - implementation form: skill, script, hook, active process, scheduled loop, workflow/runbook, MCP/tool integration, dashboard, or human-in-the-loop operating procedure
   - next build recommendation
9. Present the recommendations with concise reasoning and cite the external sources used.
10. Ask the user to accept the recommendations, revise one part, or mark unknowns. Ask this as one question.
11. Only ask follow-up questions when a required decision is still ambiguous after the recommendation.

If the user is still scoping, offer three role modes:

- Advisory role: gives perspective, critique, options, risks, and recommendations. It does not own execution.
- Workflow role: owns a process, queue, checklist, recurring cadence, or handoff. It may create work products but stays inside a runbook.
- Agentic role: has goals, state, tools, memory, policies, evals, and a loop that can continue work across steps or time.

## Workflow

1. Read M0 foundation and M1 shape artifacts if available.
2. Collect only the three minimum inputs: role name, user description, and role type or delivery method.
3. Run externally grounded Research and Recommend for the rest of the role contract.
4. Ask the user to accept, revise, or mark unknowns in the recommendations.
5. Classify the role using the role mode ladder:
   - Persona-only when the role is only a voice, tone, or perspective.
   - Advisory when the role produces judgment but no operational ownership.
   - Workflow when the role owns a defined process with inputs, outputs, and handoffs.
   - Skill-backed when the role is best packaged as a reusable `SKILL.md` workflow.
   - Loop-backed when the role must monitor, plan, act, observe, update memory, and repeat.
   - Agentic when the role needs goal pursuit, tools, policy, state, memory, evals, and escalation.
6. Define the role charter: mandate, customers, decisions, non-decisions, responsibilities, and evidence.
7. Define the operating loop if needed:
   - trigger
   - context intake
   - plan
   - tool/data use
   - decision or recommendation
   - output
   - memory update
   - escalation
   - review cadence
8. Define role memory:
   - durable facts
   - working notes
   - source evidence
   - preferences
   - decisions
   - relationship context
   - performance history
   - privacy and retention limits
9. Define interfaces:
   - human asks
   - agent-to-agent handoffs
   - input schemas
   - output formats
   - approval checkpoints
   - status updates
10. Define tools, permissions, and constraints.
11. Define authority explicitly:
   - taxonomy level: none, observe, advise, recommend, draft, coordinate, execute-with-approval, execute-within-policy, approve, veto, autonomous-within-bounds, emergency-only, or owner
   - authority domains: advice, artifacts, workflow, tools, memory/RAG, data, external communication, money/commitments, policy/governance, people/roles, deployment/production, escalation
   - decision rights
   - execution rights
   - approval gates
   - forbidden decisions and actions
   - special declarations from `references/role-authority-taxonomy.md`
   - revocation or rollback path
12. Define learning and growth:
   - what the role should learn from each run
   - where learned responsibilities and capabilities are proposed
   - what evidence is required before the role gains new responsibility
   - who approves expanded authority
   - how role changes are written to notes, RAG, memory, and the role artifact
   - how stale or harmful responsibilities are retired
13. Recommend the implementation form:
   - Skill when the role is mainly a reusable expert procedure invoked by a user or agent.
   - Script when the role performs a deterministic transformation, extraction, sync, or setup task.
   - Hook when the role should run automatically at session start, prompt submit, file change, commit, deploy, or another lifecycle event.
   - Active process when the role monitors, polls, queues, or coordinates work continuously.
   - Scheduled loop when the role reviews, summarizes, syncs, or reports on a cadence.
   - Workflow/runbook when humans and agents share staged work, approvals, or handoffs.
   - MCP/tool integration when the role needs controlled access to external systems.
   - Dashboard/report when the role primarily makes state visible for review.
14. Define proof:
   - role scenarios
   - acceptance tests
   - eval rubrics
   - failure modes
   - review evidence
15. Create `roles/<role-slug>/role-agent.md` from `templates/role-agent.md`.
16. If the role should become a skill, create a draft `roles/<role-slug>/SKILL.draft.md` or recommend running a skill-creation pass.
17. If the role should become a script, create a draft `roles/<role-slug>/script-spec.md` with inputs, outputs, command, idempotency, errors, and test cases.
18. If the role should become a hook, create a draft `roles/<role-slug>/hook-spec.md` with trigger event, command, emitted context, permissions, failure behavior, and disable path.
19. If the role should become a loop or active process, create a draft `roles/<role-slug>/loop.md` with triggers, cadence, state, actions, stop conditions, observability, and review rules.
20. If the role owns a workflow, create a draft `roles/<role-slug>/workflow.md` with stages, handoffs, approvals, and artifacts.
21. Run the shared MAPS memory helper for `/role`.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/define-agent` when the role should become an APS agent, `/design-agent` when a brief already exists, or another `/role` run when building the next organizational role.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output
Create or update:

- `roles/<role-slug>/role-agent.md`: completed role-agent contract.
- `roles/<role-slug>/workflow.md`: only when the role owns a workflow.
- `roles/<role-slug>/loop.md`: only when the role is loop-backed or agentic.
- `roles/<role-slug>/SKILL.draft.md`: only when the role should become an installable skill.
- `<notesRoot>/maps-runs/role.md`: named `/role` run note through the shared memory helper.
- `<rag.location>/maps-runs/role.md`: mirrored named `/role` run note when RAG is configured.

The completed role artifact must include:

- Role name and root organization
- Role type and role mode
- User's role description
- Research summary and recommendation rationale
- External sources used and how each source shaped the recommendation
- Advisory/workflow/skill/loop decision
- Implementation recommendation: skill, script, hook, active process, scheduled loop, workflow/runbook, MCP/tool integration, dashboard/report, or human operating procedure
- Mandate and job to be done
- Customers/operators served
- Responsibilities and non-responsibilities
- Authority and autonomy level, with explicit recommend/draft/act/approve/forbidden boundaries
- Authority taxonomy, authority domains, approval gates, special declarations, and revocation path
- Learning and growth loop for responsibilities, capabilities, memory, and authority changes
- Inputs, outputs, handoffs, and review rhythm
- Memory contract for this role
- Tool and data access
- Policies, constraints, and forbidden actions
- Escalation rules
- Collaboration map with other roles
- Scenarios and proof plan
- Recommendation for next build step

## References

Read `references/role-patterns.md` when the role mode is ambiguous, the user asks what makes a role an agent rather than a script, or the role could become advisory, workflow-owned, skill-backed, or loop-backed.

Read `references/role-authority-taxonomy.md` for every `/role` run before making recommendations. It defines the authority levels, domains, special declarations, default safety rules, and authority evidence requirements.

Read `references/role-research-sources.md` for every `/role` run before making recommendations. It defines the mandatory external source mix and preferred sources by role family.
