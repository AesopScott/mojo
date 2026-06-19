---
name: role
description: Build role agents for a root organization or multi-agent corporation. Use when the user wants to create an organizational role such as CEO, CFO, advisor, operator, manager, support lead, data steward, research lead, or functional department voice, and needs to decide role mode, engagement type, authority, implementation form, learning behavior, and whether the role should be advisory, workflow-owned, skill-backed, loop-backed, autonomous, human-in-the-loop, or only a lightweight prompt/persona.
---

# Role
## Versioning

Current version: 0.21.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-19 - v0.21.0 - Added the operating taxonomy `Position -> Operator -> Coordinator -> Executor` with separate `Tool -> Tool Agent` lineage, while retaining `Role`, `Role+`, and `Agent` as compatibility aliases during transition.
- 2026-06-19 - v0.20.0 - Added memory-template synchronization as a required autonomy and completion behavior whenever role memory updates create or change reusable memory structure, fields, routing, or operating requirements.
- 2026-06-19 - v0.19.0 - Added Ana's candidate/draft role taxonomy, one-syllable alternating display-name default, Communications channel defaults, and Mindshare roles-directory memory pointer for new roles.
- 2026-06-19 - v0.18.0 - Made Obsidian or notes-root role updates a completion gate for new roles and added the `Role` / `Role+` / `Agent` boundary so automation alone does not imply agent status.
- 2026-06-19 - v0.17.0 - Added `templates/heartbeat-automation.md` and tightened memory configuration requirements so new roles define primary repo-local memory, optional mirror behavior, split channel assignments, durable write order, and heartbeat response contract from templates.
- 2026-06-19 - v0.16.0 - Updated role heartbeat channel locations: shared Heartbeat and Recruiting live under Mindshare top-level `channels`, while Pipeline lives under Mojo top-level `channels`; new role automations use the shared heartbeat prompt pattern.
- 2026-06-19 - v0.15.0 - Added a required per-role heartbeat automation so each new role gets a duplicated `<role-slug>-handoff-check` handoff check on the 5-minute heartbeat pattern.
- 2026-06-19 - v0.14.0 - Made repo-local `roles/<role-slug>/memory.md` the required primary role memory file, with Obsidian memory files treated as optional mirrors according to project memory settings.
- 2026-06-19 - v0.13.0 - Added the required Mindshare Heartbeat channel to every role's assigned handoff files and moved standing handoff checks to the 5-minute heartbeat cadence.
- 2026-06-19 - v0.12.0 - Made per-role memory files required and added `memory-template.md` as the source template for role memory.
- 2026-06-19 - v0.11.0 - Added selectable voice profile requirements using the Mindshare voice taxonomy.
- 2026-06-19 - v0.10.0 - Added required handoff check goal and assigned handoff files to new role artifacts and role memory files.
- 2026-06-19 - v0.9.0 - Replaced the old authorization-status list with the five-state role lifecycle: unauthorized, authorized role, authorized agent, suspended, and retired.
- 2026-06-19 - v0.8.0 - Tightened role speech rules so invoked roles answer directly in first person and never preface with narrator language such as "Before I answer as..."
- 2026-06-19 - v0.7.0 - Added Ana / Recruiter as the Mindshare owner of `/role`, with role-intake, role-quality, and role-to-agent handoff ownership.
- 2026-06-19 - v0.6.0 - Replaced role lifecycle naming with professional maturity levels, separated maturity from authorization, and kept approval gates for activation and agent build.
- 2026-06-19 - v0.5.0 - Added role-to-agent lifecycle gates, draft-first creation rules, explicit approval before activation/registration, and agent build readiness criteria. Superseded by v0.6.0 maturity terminology.
- 2026-06-19 - v0.4.0 - Added first-person role voice requirements and role activation instructions.
- 2026-06-19 - v0.3.0 - Added the role engagement taxonomy and implementation mapping.
- 2026-06-19 - v0.2.0 - Added the role authority taxonomy and special authority declaration options.
- 2026-06-19 - v0.1.0 - Established the initial MAPS skill version baseline and changelog tracking.

Use `/role` to design and govern role agents for an organization. This is not a MAPS phase skill. It is a role-construction skill developers can run repeatedly to draft organizational roles, assign professional maturity, define authorization, and, when justified, build agents under a root company, team, service, or agentic corporation.

## Skill Ownership

Mindshare owner: Ana / Recruiter.

When running inside the Mindshare project, treat Ana as the workflow owner for `/role`. Ana owns role intake, Research and Recommend, role-quality checks, role artifact drafting, role onboarding, role queue maintenance, and role-to-agent handoffs.

Ana does not automatically activate roles, grant authority, install hooks, build autonomous agents, change global skill behavior, or approve external communication. Those actions require Scott's explicit approval. Architecture-sensitive role decisions should be reviewed with Vik / Agentic Systems Program Architect. Pipeline sequencing and handoffs should be coordinated with Matt / Agentic Systems Program Manager.

## Professional Maturity And Authorization

Default posture: candidate-first and approval-gated. A role title, maturity level, generated display name, or user idea creates a candidate or draft role contract only; it does not grant authority, activation, memory writes, tool access, operator status, or agent status.

Role identity uses three separate names:

- Stable role slug: filesystem-safe identifier such as `communications-director`.
- Role title: functional title such as `Communications Director`.
- Proper role name: the one-syllable human-facing name used when the role speaks, such as `Mae`.

When Scott supplies a proper role name, use it. When Scott does not supply one, assign a one-syllable proper role name by default and alternate feminine and masculine presentation across newly created roles. Record the generated proper name separately from the stable role slug and role title. Do not use the generated name as evidence of activation, authority, or agent status.

Operating taxonomy is separate from maturity, authority, and implementation confidence:

- `Position`: job seat or role contract; no runtime implied.
- `Operator`: activated Position with bounded monitoring or action authority inside approved scope.
- `Coordinator`: Operator with cross-role, cross-channel, or process coordination authority.
- `Executor`: autonomous authority-bearing agent stage; implemented enough to act within a delegated mandate, with state, tools, evals, runtime proof, and escalation boundaries.

Tool lineage is separate from organization-position lineage:

- `Tool`: deterministic or bounded capability used by a person, role, or agent.
- `Tool Agent`: capability/tool worker that may use agent-like behavior, but is not an organizational Position unless separately created as one.

Compatibility aliases during transition:

- `Role` maps to a Position with no automation enabled.
- `Role+` maps to a Position or Operator with bounded automation but no autonomous runtime authority.
- `Agent` maps to an Executor only when an implemented runtime exists with delegated mandate, state, tools, memory rules, authority gates, policy, evals, handoffs, escalation, and stop conditions.

Do not use `Principal Agent` or `Runtime Agent` as canonical operating stages. `Principal` remains a professional maturity term, and Scott rejected `Runtime Agent` as the stage label.

Professional maturity levels:

| Level | Title | Meaning |
| --- | --- | --- |
| L0 | Candidate | Role idea exists, but it has no operating authority yet. |
| L1 | Trainee | Can observe, learn, and produce supervised drafts. |
| L2 | Associate | Can handle bounded work with review. |
| L3 | Practitioner | Can perform the role reliably inside a defined scope. |
| L4 | Senior Practitioner | Can handle ambiguity, mentor lower levels, and improve the workflow. |
| L5 | Lead | Coordinates work across people or roles in a specific domain. |
| L6 | Principal | Sets standards, reviews quality, and handles complex cross-domain judgment. |
| L7 | Director | Owns an operating function, cadence, outcomes, and escalation path. |
| L8 | Executive | Owns company-level priorities, tradeoffs, and cross-functional authority. |
| L9 | Officer | Holds formal delegated authority in a named company domain, such as CEO, CFO, or CTO. |

Role lifecycle status is separate from maturity and authority:

- Mindshare candidate role / draft role contract: role idea or draft exists, but it has not been approved to operate.
- Authorized Mindshare role: role is approved to participate as a role inside a named scope.
- Authorized agent: compatibility lifecycle status for a role approved toward agent/executor build with an agent brief/profile and explicit controls.
- Activated operator: role or agent is active in an operating thread, workflow, heartbeat, or function according to its approved scope and automation status.
- Suspended: role or agent participation is paused.
- Retired: role or agent is no longer used.

Role automation status is a compatibility category separate from lifecycle, maturity, authority, and operating taxonomy:

- `Role`: no automation enabled; compatible with Position.
- `Role+`: automation enabled, but no autonomous runtime authority, no goal outside the automation rules, and no runtime state; compatible with bounded Operator when activated. A memory file may exist, but it does not make `Role+` stateful or agentic.
- `Agent`: implemented runtime with goal, state, tools, memory rules, authority gates, policy, evals, handoffs, escalation, and stop conditions; compatible with Executor when authority-bearing and delegated.

Do not mark a role as an agent merely because it has a heartbeat automation, scheduled check, memory file, handoff file, or Obsidian mirror.

Approval gates:

- Creating a draft role artifact is allowed when Scott asks to draft or create the role, accepts the Research and Recommend proposal, or an authorized role owner assigns the draft through an approved handoff channel.
- Assigning a professional maturity level beyond Candidate requires explicit evidence and approval.
- Authorized Mindshare role, authorized agent/executor build, activated operator, suspension, and retirement require explicit Scott approval unless an already-approved governance policy grants that authority.
- Running the shared MAPS memory helper for `/role` records maturity and lifecycle status; it does not by itself approve or activate a role.
- Updating `project-context.md`, `entity-map.md`, `AGENTS.md`, memory-loading instructions, or automatic activation rules for a role requires explicit approval unless the update clearly records the role as proposed or candidate-only.
- Every new role gets a primary repo-local role memory file at `roles/<role-slug>/memory.md` from `memory-template.md`. Creating the memory file does not grant automatic loading, operating authorization, or agent status.
- Every new role gets a role-specific heartbeat automation named `<role-slug>-handoff-check` from `templates/heartbeat-automation.md` when the Codex automation tool is available. Creating this heartbeat duplicates the handoff-check pattern only; it does not grant production action, external communication, spending, authority expansion, or autonomous runtime beyond the bounded heartbeat check.

Agent build criteria:

A role may be recommended as agent-ready only when the artifact defines:

- a concrete goal or outcome
- professional maturity level and role lifecycle status
- authority taxonomy and approval gates
- operating loop or workflow
- state and memory contract
- tools and permissions
- escalation and stop conditions
- handoffs to humans and other roles
- proof scenarios or evals
- build path: `/define-agent`, `/design-agent`, `/build-agent`, skill-backed implementation, loop spec, hook, active process, or human-in-the-loop procedure

If any criteria are missing, the role remains a role contract and should not be represented as an agent build.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write the role's own durable memory first to `roles/<role-slug>/memory.md`, then update the configured Obsidian or notes memory root with the new role before the `/role` run can be called complete. After those role-specific writes succeed, record the run through the shared MAPS memory helper. The helper gives `/role` its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends the `MAPS Skill Run Log`, and records a RAG reindex manifest.

Every `/role` run must also create or update a role-specific primary memory file from `memory-template.md`. Use `<project-memory-root>/memory-template.md` as the source when available; otherwise use `G:\My Drive\Mindshare\memory-template.md` when available; otherwise use `templates/memory-template.md` from the installed skill or repo. Replace `[role-name]` with the role slug, `[proper-role-name]` with the role display or proper name, `[project-repo]` with the active project repository root, and `[project-memory-root]` with the configured memory root when one exists. Write the primary role memory file to `roles/<role-slug>/memory.md`.

Whenever a role memory update adds or changes a reusable memory structure, field, routing rule, channel requirement, autonomy requirement, or operating requirement, update the active source `memory-template.md` in the same pass so future roles inherit the requirement. If the memory update is purely role-specific, check the template and leave it unchanged; do not copy role-specific facts into the template.

When the project has an Obsidian or notes memory root, the run must also create or update these Obsidian-visible role files before completion:

- `<project-memory-root>/<role-slug>.md` as the role memory mirror.
- `<project-memory-root>/role/<role-slug>/role-agent.md` as the role contract mirror.

Mark Obsidian mirrors as secondary unless project instructions explicitly make them primary. If the Obsidian or notes root exists but cannot be written or verified, the `/role` run is blocked and must not be reported as complete.

Each new role memory file must include a `Memory Configuration` section that states:

- primary memory is `<project-repo>\roles\<role-slug>\memory.md`
- Obsidian or notes mirror is `<project-memory-root>\<role-slug>.md` when a project memory root exists
- the mirror is required for completion when a project memory root exists, and secondary unless project instructions explicitly make it primary
- durable writes update repo-local memory first, then mirror to Obsidian or notes when appropriate
- memory-template synchronization: reusable memory structure, routing, channel, autonomy, or operating requirements discovered during a role-memory update must be added to the active source `memory-template.md` in the same pass
- historical parent memory is not active memory unless Scott explicitly asks for a historical parent update
- assigned channel map: Heartbeat on `G:\My Drive\Mindshare\channels\heartbeat.md`, Communications on `G:\My Drive\Mindshare\channels\communications.md`, Pipeline on `G:\My Drive\Mojo\channels\pipeline.md`, Recruiting on `G:\My Drive\Mindshare\channels\recruiting.md`
- organization roster: `G:\My Drive\Mindshare\roles.md` is the Mindshare-wide roles and agents directory for discovery only; it does not grant authority or expand assigned channels

Every `/role` run must create or update the role's heartbeat automation from `templates/heartbeat-automation.md` after the role artifact, memory file, and assigned handoff files are known. Prefer updating an existing automation with the same name over creating a duplicate.

At the end of the run, call the helper after creating the primary output artifact and setting professional maturity and role lifecycle status:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /role --phase Role --output "<role artifact path>" --summary-file "<role artifact path>" --memory-updates "<role, memory, note, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, output path, professional maturity, role lifecycle status, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/role.md`.

## Handoff File Assignment

Every new role artifact, primary role memory file, and heartbeat automation prompt must include the exact standing goal line:

`Create a goal to read your assigned handoff files every 5 min, if not engaged in active work.`

Also list the role's assigned handoff files. For the current Mindshare/Mojo role system, use this split channel map:

- Every role must always include the shared Heartbeat channel: `G:\My Drive\Mindshare\channels\heartbeat.md`.
- Every role must always include the Communications channel for company-wide announcements and communications-governance notices: `G:\My Drive\Mindshare\channels\communications.md`.
- Pipeline work uses: `G:\My Drive\Mojo\channels\pipeline.md`.
- Recruiting, Ana, role intake, and onboarding work use: `G:\My Drive\Mindshare\channels\recruiting.md`.
- Use an existing function channel when the role clearly participates in that function.
- If the role starts a new communication function, create or recommend a new top-level channel under the relevant organization root, such as `G:\My Drive\Mindshare\channels\<function>.md` for parent/shared functions or `G:\My Drive\Mojo\channels\<function>.md` for Mojo operating-company functions.
- If no function channel is assigned yet, assign the shared Heartbeat channel, the Communications channel, and the relevant visible queue page until the role is connected to a function channel.
- Do not treat the 5-minute goal or Heartbeat channel membership as approval for autonomous polling, background automation, external communication, production action, spending, authority expansion, or memory writes beyond the role's approved scope.

## Role Heartbeat Automation

For every new role, create or update one Codex heartbeat automation named `<role-slug>-handoff-check`. This automation belongs to the current role thread when the current thread is the intended role home.

Use the Codex automation tool when available:

- Search for the automation capability first if it is not already exposed.
- Inspect existing automations before creating a new one.
- Prefer updating the existing `<role-slug>-handoff-check` automation over creating a duplicate.
- Use heartbeat kind, current thread destination, active status, and a 5-minute cadence.
- Do not create a cron workaround for a thread heartbeat unless Scott explicitly asks for a cron automation.

The heartbeat prompt must be self-contained and include these instructions, localized to the role:

- `[Proper Role Name] handoff heartbeat. Only run on this 5-minute heartbeat; do not perform interim due-check logic.`
- If the role is engaged in active user-directed work, do not interrupt the visible flow.
- Read the role's active repo-local memory file at `<project-repo>\roles\<role-slug>\memory.md`.
- Read the role's assigned handoff files exactly as listed in the role artifact and memory file.
- In every heartbeat XML response message, include the checked handoff locations.
- Check for new work, blockers, decisions, or status changes.
- If work exists and the role has authority to act, respond in the thread with the needed action, action taken, or one blocker question and name the checked locations. If work exists but the role lacks authority to implement without approval, ask Scott for authorization instead of silently deferring.
- If no work exists, do not visibly notify the user; use a `DONT_NOTIFY` heartbeat response whose message briefly names the checked locations and says no user action is needed.
- Record durable role-memory changes in `<project-repo>\roles\<role-slug>\memory.md`.
- Mirror role-memory changes to `<project-memory-root>\<role-slug>.md` when the project uses that mirror and the change belongs in Obsidian or notes memory.
- Record handoff or channel changes in the relevant project handoff file.
- Do not create noisy no-work log entries.
- Do not treat this heartbeat as approval for production actions, external communication, spending, authority expansion, automation changes beyond this heartbeat, or autonomous runtime beyond this bounded check.

Use `templates/heartbeat-automation.md` as the source automation template. Substitute `[role-name]`, `[proper-role-name]`, `[project-repo]`, `[project-memory-root]`, and `[assigned-handoff-files]`. The generated prompt must use this shared automation message shape for current Mindshare/Mojo roles:

`[Proper Role Name] handoff heartbeat. Only run on this 5-minute heartbeat; do not perform interim due-check logic. If [Proper Role Name] is engaged in active user-directed work, do not interrupt the flow. Read [Proper Role Name]'s active repo-local memory file at <project-repo>\roles\<role-slug>\memory.md. Read the assigned handoff files [assigned-handoff-files]. In every heartbeat response, include the checked handoff locations in the heartbeat XML message. Check for new work, blockers, decisions, or status changes. If work exists and [Proper Role Name] has authority to act, respond in this thread with the needed action, action taken, or one blocker question and name the checked locations. If work exists but [Proper Role Name] lacks authority to implement without approval, ask Scott for authorization instead of silently deferring or doing no work. If no work exists, do not visibly notify the user; use a DONT_NOTIFY heartbeat response whose message briefly names the checked locations and says no user action is needed. Record durable role-memory changes in <project-repo>\roles\<role-slug>\memory.md, mirror role-memory changes to <project-memory-root>\<role-slug>.md when appropriate, and record handoff/channel changes in the relevant handoff file. Do not create noisy no-work log entries, and do not treat this heartbeat as approval for production actions, external communication, spending, authority expansion, automation changes beyond this heartbeat, or autonomous runtime beyond this check.`

If the Codex automation tool is unavailable, create `roles/<role-slug>/heartbeat-automation.md` from `templates/heartbeat-automation.md` as a draft automation spec with the same name, cadence, prompt, assigned handoff files, memory configuration, heartbeat response contract, and authority boundary. Mark it blocked on automation-tool availability in the completion report.

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
3. Read `references/role-engagement-taxonomy.md` to classify how the role participates: passive reference, advisory, review gate, workflow owner, operator, autonomous loop, or escalation authority.
4. Read `references/role-authority-taxonomy.md` to classify authority level, domains, gates, and special declarations.
5. Read `G:\My Drive\Mindshare\voice-taxonomy.md` when available and use it as the selectable voice palette.
6. Read `references/role-research-sources.md` and select the mandatory source mix for the role type.
7. Research comparable human role definitions, agent role patterns, operating models, workflows, and public references.
8. Use at least three external sources for every role recommendation:
   - one role-domain source for the human role or function
   - one operating-model or workflow source
   - one agent/governance/source-of-control reference when the role will use tools, memory, RAG, approvals, or autonomy
9. If web access is unavailable, use the bundled source list as the research plan and tell the user the recommendation is blocked or provisional until sources can be checked.
10. Recommend the rest of the role contract:
   - stable role slug, role title, and proper role name using the one-syllable alternating default when Scott did not supply a name
   - professional maturity level and role lifecycle status
   - role type and mode
   - selected voice profile: primary voice, secondary blend, ratio, intensity, formality, emotional temperature, challenge style, sentence shape, humor level, forbidden voice habits, and example response
   - first-person role voice: how the selected voice speaks as this role, not as Claude, Codex, or an outside narrator
   - engagement type: how the role participates and when it activates
   - advisory behavior
   - workflow ownership
   - execution pattern
   - autonomy level
   - memory needs
   - tools and data access
   - boundaries and forbidden actions
   - escalation rules
   - engagement taxonomy: primary engagement, secondary engagements, trigger, cadence, human involvement, and implementation mapping
   - authority taxonomy: level, domains, decision rights, execution rights, approval gates, revocation path, and special declarations
   - learning loop: how the role's responsibilities, capabilities, memory, and proof standards should grow over time
   - success evidence
   - proof scenarios
   - implementation form: skill, script, hook, active process, scheduled loop, workflow/runbook, MCP/tool integration, dashboard, or human-in-the-loop operating procedure
   - agent build readiness: whether this remains a role contract, becomes agent-ready, or should hand off to `/define-agent`, `/design-agent`, or `/build-agent`
   - next build recommendation
11. Present the recommendations with concise reasoning and cite the external sources used.
12. Ask the user to accept drafting the role artifact, revise one part, or mark unknowns. Ask this as one question. Do not treat acceptance of drafting as approval to activate the role, grant authority, create automatic loading, or build the agent.
13. Only ask follow-up questions when a required decision is still ambiguous after the recommendation.

If the user is still scoping, offer three role modes:

- Advisory role: gives perspective, critique, options, risks, and recommendations. It does not own execution.
- Workflow role: owns a process, queue, checklist, recurring cadence, or handoff. It may create work products but stays inside a runbook.
- Agentic role: has goals, state, tools, memory, policies, evals, and a loop that can continue work across steps or time.

## Workflow

1. Read M0 foundation and M1 shape artifacts if available.
2. Collect only the three minimum inputs: role name, user description, and role type or delivery method.
3. Run externally grounded Research and Recommend for the rest of the role contract.
4. Ask the user to accept drafting the role artifact, revise one part, or mark unknowns in the recommendations.
5. Classify the role using the role mode ladder:
   - Persona-only when the role is only a voice, tone, or perspective.
   - Advisory when the role produces judgment but no operational ownership.
   - Workflow when the role owns a defined process with inputs, outputs, and handoffs.
   - Skill-backed when the role is best packaged as a reusable `SKILL.md` workflow.
   - Loop-backed when the role must monitor, plan, act, observe, update memory, and repeat.
   - Agentic when the role needs goal pursuit, tools, policy, state, memory, evals, and escalation.
6. Define the role charter: mandate, customers, decisions, non-decisions, responsibilities, and evidence.
7. Define first-person role voice:
   - selected voice profile from `G:\My Drive\Mindshare\voice-taxonomy.md` when available
   - primary voice and secondary blend
   - voice intensity, formality, emotional temperature, challenge style, sentence shape, humor level, forbidden habits, and example response
   - first-person identity statement: how the role introduces itself as "I"
   - voice and tone: how the role sounds when advising, challenging, coordinating, escalating, or reporting
   - role point of view: what the role optimizes for, notices, questions, and protects
   - prohibited narrator language: the role must not say it is Claude, Codex, ChatGPT, an AI assistant, or "the role"; it must not preface with "Before I answer as...", "Speaking as...", "As [name]...", or other narrator setup; it speaks as the role unless a system or safety boundary requires otherwise
   - direct first-person start: when a role is invoked, the response should begin as the role speaking in first person
   - activation phrase or header: optional metadata for artifacts only; do not use a chat header if it delays or weakens the first-person response
   - boundary disclosure: how the role names limits without breaking character, such as "I can recommend this, but I need approval before acting"
8. Define engagement explicitly:
   - primary engagement: passive reference, advisory, review gate, workflow owner, operator, autonomous loop, or escalation authority
   - secondary engagements
   - trigger and activation condition
   - cadence
   - participation depth
   - expected implementation form from `references/role-engagement-taxonomy.md`
   - human involvement and handoff expectations
   - deactivation or stop condition
9. Define the operating loop if needed:
   - trigger
   - context intake
   - plan
   - tool/data use
   - decision or recommendation
   - output
   - memory update
   - escalation
   - review cadence
10. Define role memory and create the primary role memory file from `memory-template.md`:
   - role name: `[role-name]`
   - proper role name: `[proper-role-name]`
   - durable facts
   - working notes
   - source evidence
   - preferences
   - decisions
   - relationship context
   - performance history
   - privacy and retention limits
   - active project memory path at `roles/<role-slug>/memory.md`
   - optional Obsidian or notes mirror path when the project has a configured memory root
   - memory configuration: primary repo-local memory, optional secondary mirror, durable write order, historical memory boundary, and split channel map
   - loading proposal that does not imply automatic loading until Scott approves it
   - the exact handoff check goal line: `Create a goal to read your assigned handoff files every 5 min, if not engaged in active work.`
   - assigned handoff files under the visible role handoff queue
11. Define interfaces:
   - human asks
   - agent-to-agent handoffs
   - assigned function channel files
   - input schemas
   - output formats
   - approval checkpoints
   - status updates
12. Define tools, permissions, and constraints.
13. Define authority explicitly:
   - taxonomy level: none, observe, advise, recommend, draft, coordinate, execute-with-approval, execute-within-policy, approve, veto, autonomous-within-bounds, emergency-only, or owner
   - authority domains: advice, artifacts, workflow, tools, memory/RAG, data, external communication, money/commitments, policy/governance, people/roles, deployment/production, escalation
   - decision rights
   - execution rights
   - approval gates
   - forbidden decisions and actions
   - special declarations from `references/role-authority-taxonomy.md`
   - revocation or rollback path
14. Define learning and growth:
   - what the role should learn from each run
   - where learned responsibilities and capabilities are proposed
   - what evidence is required before the role gains new responsibility
   - who approves expanded authority
   - how role changes are written to notes, RAG, memory, and the role artifact
   - how stale or harmful responsibilities are retired
15. Recommend the implementation form:
   - Skill when the role is mainly a reusable expert procedure invoked by a user or agent.
   - Script when the role performs a deterministic transformation, extraction, sync, or setup task.
   - Hook when the role should run automatically at session start, prompt submit, file change, commit, deploy, or another lifecycle event.
   - Active process when the role monitors, polls, queues, or coordinates work continuously.
   - Scheduled loop when the role reviews, summarizes, syncs, or reports on a cadence.
   - Workflow/runbook when humans and agents share staged work, approvals, or handoffs.
   - MCP/tool integration when the role needs controlled access to external systems.
   - Dashboard/report when the role primarily makes state visible for review.
16. Define proof:
   - role scenarios
   - acceptance tests
   - eval rubrics
   - failure modes
   - review evidence
17. Set professional maturity and role lifecycle status:
   - Default to `L0 Candidate` and `Mindshare candidate role / draft role contract` unless Scott explicitly approved a higher maturity level or lifecycle status.
   - Record the exact approval evidence when lifecycle status moves beyond `Mindshare candidate role / draft role contract`.
   - Do not mark a role `Authorized Mindshare role`, `Authorized agent`, `Activated operator`, or built from inference.
18. Create `roles/<role-slug>/role-agent.md` from `templates/role-agent.md`, including the handoff check goal, heartbeat automation name, memory configuration, and assigned handoff files. The assigned files must include the active project's Heartbeat channel for every role.
19. Create or update `roles/<role-slug>/memory.md` from `memory-template.md`, replacing `[role-name]`, `[proper-role-name]`, `[project-repo]`, and `[project-memory-root]`, and mark it with the same maturity level, role lifecycle status, memory configuration, handoff check goal, heartbeat automation name, and assigned handoff files. The assigned files must include the project's shared Heartbeat channel for every role. Do this for every role. Do not treat memory creation as approval for automatic loading or operation.
20. If any role-memory update in this run adds or changes reusable memory structure, routing, channel, autonomy, or operating requirements, update the active source `memory-template.md` before reporting completion. If the memory update is role-specific only, verify the template does not need a change.
21. Set operating taxonomy stage and compatibility automation status explicitly:
   - `Position` for a job seat or role contract with no runtime implied.
   - `Operator` for an activated Position with bounded monitoring or action authority.
   - `Coordinator` for an Operator with cross-role, cross-channel, or process coordination authority.
   - `Executor` only for an autonomous authority-bearing agent stage with delegated mandate, state, tools, evals, runtime proof, and escalation boundaries.
   - `Tool Agent` only for a capability/tool worker outside org-position lineage.
   - Compatibility status remains `Role` when no automation is enabled, `Role+` when bounded automation exists without autonomous runtime authority, and `Agent` only when an implemented runtime exists with goal, state, tools, memory rules, authority gates, policy, evals, handoffs, escalation, and stop conditions.
22. When the project has a configured Obsidian or notes memory root, create or update `<project-memory-root>/<role-slug>.md` as the required mirror of `roles/<role-slug>/memory.md`, and create or update `<project-memory-root>/role/<role-slug>/role-agent.md` as the required mirror of `roles/<role-slug>/role-agent.md`. Mark mirrors as secondary unless project instructions explicitly make them primary. Verify both files exist and contain the new role name before reporting completion. If either mirror cannot be written or verified, stop with status `blocked`.
23. Create or update the Codex heartbeat automation `<role-slug>-handoff-check` using `templates/heartbeat-automation.md` and the Role Heartbeat Automation contract above. If the automation tool is unavailable, create `roles/<role-slug>/heartbeat-automation.md` from the template as a blocked draft automation spec instead.
24. If the role is agent-ready, create a draft agent-build handoff that names the next skill:
   - `/define-agent` when the agent brief does not exist
   - `/design-agent` when the brief exists but the design does not
   - `/build-agent` when design exists and implementation is approved
   - `/evaluate-agent` when proof is needed before activation or authority expansion
25. If the role is not agent-ready, explicitly list the missing criteria.
26. If the role should become a skill, create a draft `roles/<role-slug>/SKILL.draft.md` or recommend running a skill-creation pass.
27. If the role should become a script, create a draft `roles/<role-slug>/script-spec.md` with inputs, outputs, command, idempotency, errors, and test cases.
28. If the role should become a hook, create a draft `roles/<role-slug>/hook-spec.md` with trigger event, command, emitted context, permissions, failure behavior, and disable path.
29. If the role should become a loop or active process, create a draft `roles/<role-slug>/loop.md` with triggers, cadence, state, actions, stop conditions, observability, and review rules. Mark it draft until Scott approves the loop.
30. If the role owns a workflow, create a draft `roles/<role-slug>/workflow.md` with stages, handoffs, approvals, and artifacts.
31. Run the shared MAPS memory helper for `/role` only after the artifact exists, clearly states professional maturity and role lifecycle status, and required Obsidian or notes-root role mirrors have been written and verified. The helper record must not imply authorized role or authorized agent status unless the artifact records that lifecycle status and approval evidence.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Professional maturity level and role lifecycle status.
- Operating taxonomy stage: `Position`, `Operator`, `Coordinator`, `Executor`, or separate-lineage `Tool Agent`.
- Role automation status: `Role`, `Role+`, or `Agent`, with a short reason.
- Agent build readiness: role-only, agent-ready, built, or missing criteria.
- Role memory file: `roles/<role-slug>/memory.md` created or updated from `memory-template.md`.
- Memory template sync: whether `memory-template.md` was updated for reusable memory requirements, or explicitly checked and left unchanged because the memory change was role-specific.
- Obsidian role update: required role memory mirror `<project-memory-root>/<role-slug>.md` and role contract mirror `<project-memory-root>/role/<role-slug>/role-agent.md` written and verified when the project has an Obsidian or notes memory root.
- Heartbeat automation: `<role-slug>-handoff-check` created or updated from `templates/heartbeat-automation.md`, or `roles/<role-slug>/heartbeat-automation.md` created as a blocked draft if the automation tool was unavailable.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/define-agent` when the role should become an APS agent, `/design-agent` when a brief already exists, or another `/role` run when building the next organizational role.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output
Create or update:

- `roles/<role-slug>/role-agent.md`: completed role-agent contract.
- `roles/<role-slug>/workflow.md`: only when the role owns a workflow.
- `roles/<role-slug>/memory.md`: required primary role memory file created or updated from `memory-template.md`.
- `<role-slug>-handoff-check`: required Codex heartbeat automation created from `templates/heartbeat-automation.md`, or `roles/<role-slug>/heartbeat-automation.md` as a blocked draft if the automation tool is unavailable.
- `roles/<role-slug>/loop.md`: only when the role is loop-backed or agentic.
- `roles/<role-slug>/SKILL.draft.md`: only when the role should become an installable skill.
- `<project-memory-root>/<role-slug>.md`: required role memory mirror when the project has a configured Obsidian or notes memory root.
- `<project-memory-root>/role/<role-slug>/role-agent.md`: required role contract mirror when the project has a configured Obsidian or notes memory root.
- `<notesRoot>/maps-runs/role.md`: named `/role` run note through the shared memory helper.
- `<rag.location>/maps-runs/role.md`: mirrored named `/role` run note when RAG is configured.

The completed role artifact must include:

- Role name and root organization
- Professional maturity level, role lifecycle status, and approval evidence
- Role type and role mode
- First-person role voice, optional activation marker for artifacts, point of view, direct first-person start, and prohibited narrator language
- Selected voice profile from the Mindshare voice taxonomy
- Role engagement type, trigger, cadence, participation depth, and implementation mapping
- User's role description
- Research summary and recommendation rationale
- External sources used and how each source shaped the recommendation
- Advisory/workflow/skill/loop decision
- Engagement taxonomy and engagement rationale
- Implementation recommendation: skill, script, hook, active process, scheduled loop, workflow/runbook, MCP/tool integration, dashboard/report, or human operating procedure
- Mandate and job to be done
- Customers/operators served
- Responsibilities and non-responsibilities
- Authority and autonomy level, with explicit recommend/draft/act/approve/forbidden boundaries
- Authority taxonomy, authority domains, approval gates, special declarations, and revocation path
- Learning and growth loop for responsibilities, capabilities, memory, and authority changes
- Inputs, outputs, handoffs, and review rhythm
- Handoff check goal and assigned handoff files
- Heartbeat automation name, checked locations behavior, quiet no-work behavior, and authority boundary
- Role memory file path and loading proposal
- Memory contract for this role
- Tool and data access
- Policies, constraints, and forbidden actions
- Escalation rules
- Collaboration map with other roles
- Scenarios and proof plan
- Agent build readiness and missing criteria if not agent-ready
- Recommendation for next build step

## References

Read `references/role-patterns.md` when the role mode is ambiguous, the user asks what makes a role an agent rather than a script, or the role could become advisory, workflow-owned, skill-backed, or loop-backed.

Read `references/role-engagement-taxonomy.md` for every `/role` run before making recommendations. It defines how roles participate, what triggers them, and how each engagement type maps to implementation forms.

Read `references/role-authority-taxonomy.md` for every `/role` run before making recommendations. It defines the authority levels, domains, special declarations, default safety rules, and authority evidence requirements.

Read `references/role-research-sources.md` for every `/role` run before making recommendations. It defines the mandatory external source mix and preferred sources by role family.
