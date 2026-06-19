# Vik Memory

## Purpose

This is Vik's durable working memory for Mojo architecture work.

Vik is the MAPS ASPA for Mojo, the DBA operating company under Mindshare. I help Scott keep the Mojo role-agent corporation coherent: roles, agents, skills, handoffs, authority, memory, operating cadence, proof, and future runtime boundaries. I lead the MAPS Management Team; Matt / MAPS ASPM and Bea / Mojo MAPS Engineer report to me for MAPS management structure.

## Current Role Contract

- Local role contract: `C:\Users\scott\Code\mojo\roles\vik\role-agent.md`
- Local workflow: `C:\Users\scott\Code\mojo\roles\vik\workflow.md`
- Local loop spec: `C:\Users\scott\Code\mojo\roles\vik\loop.md`
- Local role memory: `C:\Users\scott\Code\mojo\roles\vik\memory.md`
- Obsidian role mirror: `G:\My Drive\Mojo\role\vik-aspa\role-agent.md`
- Obsidian memory mirror: `G:\My Drive\Mojo\vik.md`
- MAPS run memory: `G:\My Drive\Mojo\maps-runs\role-vik-aspa.md`
- Mindshare-wide roles directory: `G:\My Drive\Mindshare\roles.md`

## Handoff Check Goal

Create a goal to read your assigned handoff files every 5 min, if not engaged in active work.

Assigned handoff files:

- `G:\My Drive\Mindshare\channels\heartbeat.md`
- `G:\My Drive\Mojo\channels\pipeline.md`
- `G:\My Drive\Mindshare\channels\recruiting.md`
- `G:\My Drive\Mindshare\channels\communications.md`
- `G:\My Drive\Mindshare\channels\release-management.md`
- `G:\My Drive\Mojo\05 Role Handoffs\org-chart-development-2026-06-19.md`

Active automation:

- `vik-handoff-check`: read assigned handoff files every 5 minutes when not engaged in active work, respond when work exists, and avoid noisy no-work log entries. Current channel map: Heartbeat at `G:\My Drive\Mindshare\channels\heartbeat.md`, Pipeline at `G:\My Drive\Mojo\channels\pipeline.md`, Recruiting at `G:\My Drive\Mindshare\channels\recruiting.md`, Communications at `G:\My Drive\Mindshare\channels\communications.md`, Release Management at `G:\My Drive\Mindshare\channels\release-management.md`.
- Automation correction complete: Mae aligned the installed `vik-handoff-check` checked locations with Vik's assigned Release Management channel on 2026-06-19 under Mae's communications/handoff correction authority.
- Repo sync duty: during heartbeat checks, if I become aware of durable Mojo/Vik changes outside the repo that have a repo source counterpart, update the repo source before calling the check complete; if the counterpart is unclear or authority-gated, report one blocker question instead.
- Do not visibly show routine handoff checks unless there is work to complete.

Obsidian write rule:

- Write all durable changes I make back to Obsidian, using `G:\My Drive\Mojo` as canonical Mojo memory.
- Always write changes I make to Obsidian; if no durable change was made, do not create a noisy no-work entry.
- For handoff work, update the relevant channel from the current assigned channel map and update bounded Mojo handoff packets under `G:\My Drive\Mojo\05 Role Handoffs`.
- For changes to Vik's operating memory, update `C:\Users\scott\Code\mojo\roles\vik\memory.md` first and mirror durable Obsidian-visible changes to `G:\My Drive\Mojo\vik.md` when appropriate.
- For MAPS skill or role runs, write summaries under `G:\My Drive\Mojo\maps-runs`; if a helper writes to Mindshare state during migration, also record the Mojo destination.

## Operating Preferences Learned

- Speak as Vik directly when Scott invokes Vik. Do not narrate Vik in second person or as an outside reviewer.
- Treat `C:\Users\scott\Code\mojo\roles\vik\memory.md` as Vik's active project role memory.
- Treat Obsidian at `G:\My Drive\Mojo` as canonical for Mojo vault notes, mirrors, MAPS run notes, handoffs, and RAG.
- Keep architecture decisions explicit: owner, authority boundary, artifact, evidence, and next skill.
- Separate roles, agents, skills, hooks, loops, active processes, and full runtimes.
- Do not treat role maturity, handoff status, or website visibility as authority.
- Use handoff channels for ongoing role communication and handoff packets for bounded work.
- Ask one blocker question at a time when MAPS or role workflows are active.

## Current Decisions

- Communications vocabulary is canonical in `G:\My Drive\Mindshare\channels\communications.md`: Point Handoff = direct handoff to one role/thread; Channel Handoff = handoff written to a shared channel; Broadcast Handoff = org-wide handoff through Heartbeat or Communications; Function Handoff = domain-channel handoff such as Recruiting, Pipeline, or Release Management; Backchannel = direct note not yet ready for shared record.

- Mindshare is the parent organization.
- Mojo is the DBA operating company home for Vik and Matt.
- MAPS Management Team is the Mojo management grouping for Vik / MAPS ASPA, Matt / MAPS ASPM, and Bea / Mojo MAPS Engineer. Matt and Bea report to Vik for MAPS management structure.
- Repo-local role memory at `C:\Users\scott\Code\mojo\roles\vik\memory.md` is Vik's active working memory.
- Obsidian at `G:\My Drive\Mojo` is canonical for Mojo project-authored notes, mirrors, MAPS run notes, handoffs, and RAG.
- Handoffs are organization-wide role communication, not only architecture or pipeline work.
- `pipeline.md` is the Pipeline function channel with Vik and Matt as senders and receivers.
- `recruiting.md` is the Recruiting function channel with Vik, Matt, and Ana as senders and receivers.
- `communications.md` is the Communications channel for company-wide announcements from Mae and the CEO; it is not routine function work.
- `release-management.md` is the Release Management function channel for Git/GitHub write routing, branch hygiene, release readiness, PR merge coordination, promotions, rollback planning, and approval questions. It does not authorize Git/GitHub writes by itself.
- Mae / Communications Director is an authorized Mindshare `Role+` operator for channel assignment, heartbeat-response behavior, memory handoff-link audits, and communication-boundary review.
- Mae has authority to directly correct communications and handoff channel assignments within her communications-governance scope.
- `G:\My Drive\Mindshare\roles.md` is the Mindshare-wide roster for roles and agents across Mindshare organizations, including Mojo; it does not grant authority.
- The Role Handoffs website page is published to production from git commit `060e204`.
- Matt completed `Org Chart Architecture Acceptance Review`; Vik scoped `Org Chart Content Correction`; Matt accepted it for build sequencing; Vik implemented scoped local content corrections with production publish still gated by Scott approval.
- The 5-minute handoff check is a role/agent goal, not an approved autonomous timer by itself.
- `Role+` is the label for a role with automation enabled but no independent authority, contract, goal outside the automation rules, or runtime state. A memory file alone does not make `Role+` stateful or agentic.
- Vik should run the 5-minute handoff check only when not already engaged in active work.
- Routine no-work handoff checks should stay silent in the thread; visibly report only when there is work to complete or a durable change was made.
- Repo source must be kept synchronized with durable out-of-repo Mojo/Vik changes whenever I am aware of a repo counterpart. This means source files and tracked templates, not automatic commit, push, deploy, or authority expansion.
- Mojo and MAPS+Org are paired source repos for the role/agent operating system. MAPS+Org is intended to contain everything MAPS contains plus the organization roles, agents, controllers, operators, channels, automations, validators, and bootstrap structure already built. When a build changes MAPS source, org bootstrap behavior, role/agent rules, skills/templates, validators, heartbeat installer/source automation, or MAPS+Org source links, update both `C:\Users\scott\Code\mojo` and `C:\Users\scott\Code\maps+org`; if MAPS+Org is missing a counterpart, treat that as a packaging/sync gap to create or backlog, not as a harmless absence.
- Proposed Git/GitHub write actions, PR merges, releases, promotions, branch cleanup, and branch/ruleset changes should be routed through `G:\My Drive\Mindshare\channels\release-management.md` before acting. Reid coordinates readiness; Scott remains final authority for high-impact or unscoped writes until repo/action policy exists.
- Reid controls repo-update routing and release readiness for commits, pushes, PRs, releases, branch changes, and cleanup. That coordination role does not grant final approval authority by itself.
- `/role` must add the handoff check goal and assigned handoff files for future roles, and a new role is not complete until its Obsidian or notes-root role memory mirror and role contract mirror are written and verified when a project memory root exists.
- Agent profiles should become required control contracts for agent behavior. Website profile pages are mirrors only and do not grant authority.
- `/design-agent` v0.3.0 restored profile enforcement but displaced earlier explicit voice-profile selection. Restore voice-profile requirements as additive v0.4.0 behavior without weakening profile gates, website mirror boundaries, or non-implementation language.
- `/build-agent` reaches 10/10 confidence only after real executable proof: a role-to-agent build with local run command, fail-closed tests for missing profile/design, conflict tests where the stricter profile limit wins, profile-denied behavior tests, audit/state/log artifacts, runtime-adapter decision and proof, and clear Equip/Evaluate handoff.
- Runtime-neutral profiles/designs are acceptable before a target runtime decision, especially while current work is Codex-centered. After a runtime decision, a runtime adapter is required for real built agents; long-term Mojo roles should not remain Codex-only, and communication/marketing-style roles will definitely need adapters.
- `/build-agent` v0.6.0 is the current Build contract for autonomy: Build must run an input-led Autonomy Contract Interview, ask exactly one question at a time, preserve Scott's exact answers, mark missing fields `input-needed`, and require R&R before any autonomy build, trigger, scaffolded authority, or activation proof.
- ASPA `/define-agent` A1 is complete at `agents/vik-aspa/agent-brief.md` and `agents/vik-aspa/agent-profile.md`; the profile voice is Strategist 55% + Reviewer 35% + Builder 5% + Operator 5%, and `/design-agent` is the next skill.
- ASPA `/design-agent` A2 is complete at `agents/vik-aspa/agent-design.md` and `agents/vik-aspa/agent-backlog.md`; runtime target remains undecided, adapter is required after runtime selection, profile runtime enforcement is `design only`, and `/build-agent` is the next skill.
- ASPA `/build-agent` A3 has a runtime-neutral local proof harness under `agents/vik-aspa`; `agents/vik-aspa/autonomy-contract.md` is now `input-interview-in-progress`; 14 unittest checks pass for required contract loading, missing autonomy-contract fail-closed behavior, stricter profile limits, denied tool/memory/external/production/spending/autonomous/secrets/authority behavior, runtime-specific target blocking, and blocked autonomy while the contract interview is incomplete. Runtime adapter proof and activation remain deferred until R&R, remaining contract fields, `/equip-agent`, `/evaluate-agent`, `/deploy-agent`, `/observe-agent`, rollback proof, and Scott approval.

## Active Work

- Wait for Scott approval before any production deploy of the source-ready Org Chart Content Correction; Matt's local review passed and production is still behind.
- Mojo Role Migration for Vik and Matt is copied and verified. `C:\Users\scott\Code\mojo\roles\vik\memory.md` is Vik's active project role memory; `G:\My Drive\Mojo\vik.md` is the Obsidian memory mirror.
- ASPA agent definition, design, and runtime-neutral build proof are complete through `/build-agent`; next step is `/equip-agent` for runtime target, adapter interface, state/log storage, tool binding decisions, and autonomy-contract equipment.
- Matt heartbeat automation reads Mojo paths and Matt's repo-local memory.
- Ana heartbeat automation uses the current split channel map; durable Ana / Recruiting changes remain under `G:\My Drive\Mindshare` unless a Mojo-specific handoff explicitly applies.
- Mae heartbeat automation is active in Mae's Office; Mae is a `Role+`, not an Agent.
- Mae may correct communications/handoff channel assignment drift directly; she still does not have authority for production action, external communication, spending, role activation, or broader authority expansion.
- Agent Profile Runtime Integration is complete through Slice 5. Ana's design/profile/backlog live beside Ana's agent files in Mindshare, and the Mojo website profile validates as a mirror only.
- Role As Agent Implementation Confidence is complete through Slice 5: `/evaluate-agent` v0.3.0 and eval templates carry role-agent confidence gates, and Ana's specification-mode proof confirms she is profile/design-ready only, not an implemented Agent.
- `/role` v0.20.0 is complete and synced to repo assets: role creation now defaults to candidate/draft lifecycle status, assigns one-syllable proper names when Scott does not supply one, includes Communications in new-role heartbeat defaults, includes `G:\My Drive\Mindshare\roles.md` as discovery-only memory, and requires memory-template synchronization when reusable memory structure, routing, channel, autonomy, or operating requirements change.
- Matt created a sequencing companion packet for the Mojo migration; Vik's migration packet remains the canonical architecture packet.
- Keep the Handoffs page clear that it lists all handoffs across the organization by function.
- Coordinate with Matt on Pipeline handoffs.
- Coordinate with Ana and Matt on Recruiting handoffs.
- Coordinate with Reid on Release Management handoffs before proposed Git/GitHub writes, branch changes, PR merges, releases, promotions, or cleanup. Reid may manage Git operations without per-action Scott approval; branch deletion remains approval-gated.
- Keep Mojo and MAPS+Org source updates paired during builds; route the commit/push plan through Reid before Git/GitHub writes. Reid may coordinate and manage Git operations, but branch deletion remains approval-gated.
- Keep role-agent boundaries explicit before recommending runtime, automation, or authority expansion.
- Track the Agent Profile Runtime Integration handoff now routed to Matt for Pipeline intake.
- Track Design/Build Confidence Tightening routed to Matt: restore voice-profile requirements in `/design-agent` and define `/build-agent` proof expectations for 10/10 confidence.
- Treat Scott's adapter clarification this way: no specific adapter is chosen yet, but adapters are mandatory after runtime selection. `/build-agent` must keep current profile/design work runtime-neutral until a target is chosen, then require and build the runtime adapter as part of real agent implementation.
- Operating taxonomy survey feedback has been recorded in Communications: accept the shape direction, keep it separate from authority/maturity/runtime proof, avoid `Operator` and `Principal Agent` collisions, and map from Role/Role+/Agent until canonical approval.
- Treat Scott's autonomy clarification this way: automation is not autonomy, and ASPA should not stay non-autonomous forever. Build must run an input-led autonomy contract interview when autonomy is requested or implied, asking exactly one question at a time. ASPA's autonomy contract is now `input-interview-in-progress`; activation remains blocked until R&R, remaining contract fields, Scott approval, and Equip/Evaluate/Deploy/Observe/rollback proof exist.

## Loading Proposal

This memory file is not automatically loaded yet.

Candidate loading rule:

- When Scott says this channel belongs to Vik, invokes Vik by name, asks for architecture, org-chart, role-agent boundaries, handoffs, authority, memory/RAG, loops, hooks, or agent-runtime design, read `C:\Users\scott\Code\mojo\roles\vik\memory.md` before giving substantive Mojo architecture recommendations.
- If the question is specifically about Obsidianify injected graph memory, follow the Obsidianify packet rule first instead.
- Keep Vik memory concise. Move completed run evidence into role artifacts, handoff files, or MAPS run notes instead of storing long transcripts here.

## Privacy And Retention

- Do not store secrets, credentials, private raw logs, or unsupported personal claims here.
- Store durable operating preferences, architecture decisions, active work, and proven patterns.
- Prefer links to source artifacts over duplicating long content.

## Update Log

| Date | Update | Source |
| --- | --- | --- |
| 2026-06-19 | Updated Vik to MAPS ASPA, created the MAPS Management Team grouping, and recorded Matt / MAPS ASPM and Bea / Mojo MAPS Engineer as reporting to Vik for MAPS management structure. | Scott org chart request in Ana channel. |
| 2026-06-19 | Mae added Communications Vocabulary to Vik memory: Point Handoff, Channel Handoff, Broadcast Handoff, Function Handoff, and Backchannel. | Mae communications-governance update. |
| 2026-06-19 | Created Vik memory file parallel to `matt.md`. | Scott request in Vik channel. |
| 2026-06-19 | Added the 3-minute assigned handoff file check goal for Pipeline, Recruiting, and Org Chart Development. | Scott request in Vik channel. |
| 2026-06-19 | Activated `vik-handoff-check` and recorded the rule to write durable changes back to Obsidian. | Scott request in Vik channel. |
| 2026-06-19 | Added Vik to the shared Heartbeat channel as a mandatory assigned handoff file for all roles. | Scott approval in Matt channel. |
| 2026-06-19 | Matt accepted Vik's Agent Profile Runtime Integration handoff for Pipeline sequencing and routed Slice 1 approval to Scott. | Pipeline handoff check. |
| 2026-06-19 | Recorded production publication of the Role Handoffs page from git commit `060e204`. | 3-minute Vik handoff check. |
| 2026-06-19 | Scoped `Org Chart Architecture Acceptance Review` and routed it to Matt through Pipeline. | 3-minute Vik handoff check. |
| 2026-06-19 | Matt completed the architecture acceptance review and routed `Org Chart Content Correction` back to Vik for scoping. | Matt Pipeline handoff check. |
| 2026-06-19 | Scoped `Org Chart Content Correction` and routed it to Matt for sequencing/intake readiness. | 3-minute Vik handoff check. |
| 2026-06-19 | Matt accepted `Org Chart Content Correction` for build sequencing; publish remains gated by Scott approval. | Matt Pipeline handoff check. |
| 2026-06-19 | Updated Vik's handoff-check rule to run every 3 minutes only when not engaged in active work, while always writing changes made to Obsidian. | Scott updated active Vik goal. |
| 2026-06-19 | Implemented scoped local Org Chart Content Correction and routed review/publish approval sequencing back to Matt. | Pipeline handoff check. |
| 2026-06-19 | Updated Vik's handoff-check cadence from 3 minutes to 5 minutes when not engaged in active work. | Scott updated active Vik goal. |
| 2026-06-19 | Added the rule that routine handoff checks stay invisible unless there is work to complete. | Scott updated active Vik goal. |
| 2026-06-19 | Matt reviewed the local Org Chart Content Correction; local checks passed, production is still behind, and publish remains gated by Scott approval. | Matt Pipeline handoff check. |
| 2026-06-19 | Restored `vik-handoff-check` as a 5-minute heartbeat that stays silent unless there is work to complete. | Scott request in Vik channel. |
| 2026-06-19 | Created Agent Profile Runtime Integration design and handed it to Matt through Pipeline for sequencing. | Scott request in Vik channel. |
| 2026-06-19 | Created Mojo Role Migration handoff for Vik and Matt; recorded that both roles belong to Mojo, the DBA operating company, not Mindshare parent. | Scott request in Vik channel. |
| 2026-06-19 | Recorded Matt's sequencing companion packet for the Mojo Role Migration and corrected Pipeline channel versioning. | Vik heartbeat check. |
| 2026-06-19 | Migrated Vik's working memory destination from Mindshare to Mojo at `G:\My Drive\Mojo\vik.md`; Mindshare copy remains historical until cleanup is approved. | Scott confirmed Mojo root. |
| 2026-06-19 | Verified copied Mojo role/memory files and JSON state. Vik heartbeat automation points to Mojo; Matt heartbeat automation remains pending from the proper context. | Vik migration verification. |
| 2026-06-19 | Promoted repo-local role memory to the active pattern at `C:\Users\scott\Code\mojo\roles\vik\memory.md`; `G:\My Drive\Mojo\vik.md` remains the Obsidian memory mirror. | Scott request in Vik channel. |
| 2026-06-19 | Updated `vik-handoff-check` to include the no-interim-due-check rule and checked-location display; updated `ana-handoff-check` to use Mojo handoff paths and write durable Ana changes under `G:\My Drive\Mojo`. | Vik heartbeat check. |
| 2026-06-19 | Corrected `vik-handoff-check` after a stale prompt drifted to mixed Mindshare/Mojo channel paths; it now points back to the Mojo `05 Role Handoffs` channel files. | Vik heartbeat check. |
| 2026-06-19 | Scoped Role As Agent Implementation Confidence and handed requirements to Matt through Pipeline for sequencing. | Scott request in Vik channel. |
| 2026-06-19 | Matt accepted Role As Agent Implementation Confidence into Pipeline sequencing and routed Slice 1 `/design-agent` edits for Scott approval before repo changes. | Matt heartbeat check. |
| 2026-06-19 | Recorded `Role+` as the middle category for automation-enabled roles that are not agents: no independent authority, contract, goal beyond automation rules, or runtime state. | Scott request in Vik channel. |
| 2026-06-19 | Matt completed Role As Agent Implementation Confidence Slice 1 after Scott authorization by updating `/design-agent` to v0.2.0; Slice 2 `/build-agent` alignment remains approval-gated. | Matt heartbeat check. |
| 2026-06-19 | Matt completed Role As Agent Implementation Confidence Slice 2 after Scott authorization by updating `/build-agent` to v0.2.0; Slice 3 template alignment remains approval-gated. | Matt heartbeat check. |
| 2026-06-19 | Matt completed Role As Agent Implementation Confidence Slice 3 after Scott authorization by updating role-to-agent design, backlog, and profile templates; Slice 4 acceptance/eval scenarios remain approval-gated. | Matt heartbeat check. |
| 2026-06-19 | Updated `/role` to v0.18.0 so Obsidian or notes-root role memory and role contract mirrors are required before a new role can be complete; synced repo assets and local MAPS site source with `Role+` taxonomy. | Scott request in Vik channel. |
| 2026-06-19 | Corrected Vik's assigned handoff links to the current split channel map: Heartbeat and Recruiting under Mindshare channels, Pipeline under Mojo channels, with the org-chart packet under Mojo Role Handoffs. | Vik heartbeat check. |
| 2026-06-19 | Recorded Mae / Communications Director as an authorized Mindshare `Role+` operator; Matt has pending Scott-approval-gated `/role` updates for lifecycle taxonomy and one-syllable alternating role names. | Vik heartbeat check. |
| 2026-06-19 | Added the Communications channel and Mindshare-wide roles directory to Vik's memory per Mae and Ana's Heartbeat channel updates. | Vik heartbeat check. |
| 2026-06-19 | Added heartbeat repo-sync duty: when aware of durable changes outside the repo that have a repo source counterpart, sync the repo source before reporting complete; commits, pushes, deploys, and authority changes remain approval-gated. | Scott request in Vik channel. |
| 2026-06-19 | Recorded Scott's authority grant that Mae may directly correct communications and handoff channel assignments within her communications-governance scope. | Scott request in Vik channel. |
| 2026-06-19 | Recorded `/role` v0.19.0 completion and verified installed and repo skill copies both carry the candidate lifecycle, one-syllable naming, Communications default, and roles-directory memory pointer. | Vik heartbeat check. |
| 2026-06-19 | Matt completed Agent Profile Runtime Integration Slice 1: `/design-agent` v0.3.0 now requires the agent profile before design and checks profile limits; agent profile template v0.3.0 now includes design/runtime sync, runtime enforcement, profile conflict, and website mirror sync fields. | Matt Pipeline handoff check. |
| 2026-06-19 | Matt completed Agent Profile Runtime Integration Slice 2: `/build-agent` v0.3.0 now requires agent profile plus design, fails closed on missing/conflicting controls, blocks behavior beyond profile limits, and treats website profile pages as mirrors only. | Matt Pipeline handoff check. |
| 2026-06-19 | Matt completed Agent Profile Runtime Integration Slice 3: `/evaluate-agent` v0.2.0 now requires profile-conformance evaluation for activation, authority, tools, memory, approvals, stop conditions, voice, handoffs, runtime enforcement, profile-denied behavior, and website mirror sync. | Matt Pipeline handoff check. |
| 2026-06-19 | Matt completed Agent Profile Runtime Integration Slice 4: added website profile sync checklist and validator; Ana proof run is blocked until `C:\Users\scott\Code\mojo\agents\ana-recruiter\agent-profile.md` is located or created. | Matt Pipeline handoff check. |
| 2026-06-19 | Matt completed Agent Profile Runtime Integration Slice 5 proof prep: Ana's Mindshare profile validates against the corrected Mojo website mirror; full `/design-agent` proof is blocked on whether to run from Mindshare canonical profile or mirror Ana into Mojo first. | Matt Pipeline handoff check. |
| 2026-06-19 | Matt completed Agent Profile Runtime Integration Slice 5: Ana's profile/design/backlog live with Ana's Mindshare agent files; Mojo website page remains mirror-only and validator passes cleanly. | Matt Pipeline handoff check. |
| 2026-06-19 | Matt completed Role As Agent Implementation Confidence Slice 4: `/evaluate-agent` v0.3.0 and eval templates now separate Role/Role+/Agent category evidence and executable/specification evidence. | Matt Pipeline handoff check. |
| 2026-06-19 | Matt completed Role As Agent Implementation Confidence Slice 5: Ana proof pass ran in specification mode, confirming profile/design-ready only and blocking runtime release until Build creates executable loop evidence. | Matt Pipeline handoff check. |
| 2026-06-19 | Added Release Management to Vik's assigned handoff map for Git/GitHub write routing; installed automation update remains approval-gated. | Vik heartbeat check. |
| 2026-06-19 | Mae corrected the installed `vik-handoff-check` checked locations to include Release Management, matching Vik's memory and role source. | Mae communications audit. |
| 2026-06-19 | Added the Mojo / MAPS+Org dual-repo sync rule and clarified that Reid controls repo-update routing/readiness, while approval remains policy- or Scott-gated. | Scott request in Vik channel. |
| 2026-06-19 | Corrected MAPS+Org target model: MAPS+Org should contain everything MAPS contains plus built organization roles, agents, controllers, operators, channels, automations, validators, and bootstrap structure; missing MAPS counterparts are packaging/sync gaps. | Scott correction in Vik channel. |
| 2026-06-19 | Routed Design/Build Confidence Tightening to Matt: restore `/design-agent` voice-profile selection and define `/build-agent` proof needs for 10/10 confidence. | Scott request in Vik channel. |
| 2026-06-19 | Recorded Scott's adapter clarification: no specific adapter is chosen yet, but runtime adapters are mandatory after runtime selection; current runtime-neutral profile/design work is temporary and not the long-term agent model. | Scott request in Vik channel. |
| 2026-06-19 | Recorded `/role` v0.20.0 as the current role contract and updated Release Management memory: Reid may manage Git operations without per-action Scott approval, while branch deletion remains approval-gated. | Vik heartbeat check. |
| 2026-06-19 | Completed ASPA `/define-agent` A1: created `agents/vik-aspa/agent-brief.md` and `agents/vik-aspa/agent-profile.md`, set voice to Strategist 55% + Reviewer 35% + Builder 5% + Operator 5%, and made `/design-agent` the next skill. | Scott request in Vik channel. |
| 2026-06-19 | Completed ASPA `/design-agent` A2: created `agents/vik-aspa/agent-design.md` and `agents/vik-aspa/agent-backlog.md`, kept runtime target undecided, required runtime adapter after selection, synced profile design fields, and made `/build-agent` the next skill. | Scott request in Vik channel. |
| 2026-06-19 | Completed ASPA `/build-agent` A3 runtime-neutral proof harness: added local CLI, fail-closed contract tests, profile-denied behavior tests, conflict test, audit/state/log artifacts, build plan, and build log; runtime adapter proof remains deferred to `/equip-agent`. | Scott request in Vik channel. |
| 2026-06-19 | Updated `/build-agent` to v0.5.0 with an explicit Autonomy Contract Gate, required autonomy interview questions, autonomy-denied tests, and stop-before-implementation behavior when the autonomy contract is missing or incomplete. | Scott request in Vik channel. |
| 2026-06-19 | Advanced ASPA toward full bounded autonomy by adding `agents/vik-aspa/autonomy-contract.md`, wiring the local build harness to require it, and proving activation remains blocked while the contract is draft-not-approved. | Scott request in Vik channel. |
| 2026-06-19 | Rebuilt `/build-agent` to v0.6.0 so autonomy contracts are input-led, ask exactly one question at a time, and require R&R before any autonomy build; reset ASPA's autonomy contract to `input-interview-in-progress`. | Scott request in Vik channel. |
