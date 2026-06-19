---
name: role
description: Build role agents for a root organization or multi-agent corporation. Use when the user wants to create an organizational role such as CEO, CFO, advisor, operator, manager, support lead, data steward, research lead, or functional department voice, and needs to decide whether the role should be advisory, workflow-owned, skill-backed, loop-backed, autonomous, human-in-the-loop, or only a lightweight prompt/persona.
---

# Role

Use `/role` to design a role agent for an organization. This is not a MAPS phase skill. It is a role-construction skill students can run repeatedly to create two or three organizational roles under a root company, team, service, or agentic corporation.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives `/role` its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends the `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /role --phase Role --output "<role artifact path>" --summary-file "<role artifact path>" --memory-updates "<role, memory, note, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/role.md`.

## Required interview

Before writing files, ask for any missing answers. Do not silently infer the role contract unless the user explicitly asks for a draft.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Use the required questions below as the internal interview sequence: ask the next most important missing question, wait for the answer, then continue.

Required questions:

- Role name: what role should be created?
- Root organization: what company, team, product, or operating system does this role serve?
- Role type: executive, functional leader, operator, specialist, advisor, reviewer, service desk, data steward, customer-facing role, internal platform role, or other.
- Role mode: advisory, workflow owner, skill-backed, loop-backed, tool-using agent, autonomous agent, human-in-the-loop agent, or persona-only.
- Advisory behavior: whether the role gives recommendations only, challenges decisions, writes options, or can approve work.
- Workflow ownership: whether the role owns a recurring process, queue, handoff, incident, metric, customer journey, or project lane.
- Execution pattern: whether this should become a reusable skill, an agent loop, a workflow/runbook, a tool-using agent, or a lightweight role prompt.
- Autonomy level: recommend, draft, act with approval, act within policy, or act autonomously.
- Memory needs: what the role should remember, forget, cite, and update.
- Tool and data access: which systems, repos, docs, inboxes, dashboards, APIs, or RAG stores the role needs.
- Boundaries: what the role must not decide or do.
- Escalation: when the role hands off to a human or another role.
- Success evidence: what proves the role is useful.

If the user is still scoping, offer three role modes:

- Advisory role: gives perspective, critique, options, risks, and recommendations. It does not own execution.
- Workflow role: owns a process, queue, checklist, recurring cadence, or handoff. It may create work products but stays inside a runbook.
- Agentic role: has goals, state, tools, memory, policies, evals, and a loop that can continue work across steps or time.

## Workflow

1. Read M0 foundation and M1 shape artifacts if available.
2. Run the required interview.
3. Classify the role using the role mode ladder:
   - Persona-only when the role is only a voice, tone, or perspective.
   - Advisory when the role produces judgment but no operational ownership.
   - Workflow when the role owns a defined process with inputs, outputs, and handoffs.
   - Skill-backed when the role is best packaged as a reusable `SKILL.md` workflow.
   - Loop-backed when the role must monitor, plan, act, observe, update memory, and repeat.
   - Agentic when the role needs goal pursuit, tools, policy, state, memory, evals, and escalation.
4. Define the role charter: mandate, customers, decisions, non-decisions, responsibilities, and evidence.
5. Define the operating loop if needed:
   - trigger
   - context intake
   - plan
   - tool/data use
   - decision or recommendation
   - output
   - memory update
   - escalation
   - review cadence
6. Define role memory:
   - durable facts
   - working notes
   - source evidence
   - preferences
   - decisions
   - relationship context
   - performance history
   - privacy and retention limits
7. Define interfaces:
   - human asks
   - agent-to-agent handoffs
   - input schemas
   - output formats
   - approval checkpoints
   - status updates
8. Define tools, permissions, and constraints.
9. Define proof:
   - role scenarios
   - acceptance tests
   - eval rubrics
   - failure modes
   - review evidence
10. Create `roles/<role-slug>/role-agent.md` from `templates/role-agent.md`.
11. If the role should become a skill, create a draft `roles/<role-slug>/SKILL.draft.md` or recommend running a skill-creation pass.
12. If the role should become a loop, create a draft `roles/<role-slug>/loop.md` with loop triggers, state, actions, stop conditions, and review rules.
13. If the role owns a workflow, create a draft `roles/<role-slug>/workflow.md` with stages, handoffs, approvals, and artifacts.
14. Run the shared MAPS memory helper for `/role`.

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
- Advisory/workflow/skill/loop decision
- Mandate and job to be done
- Customers/operators served
- Responsibilities and non-responsibilities
- Authority and autonomy level
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
