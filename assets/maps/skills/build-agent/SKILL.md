---
name: build-agent
description: Implement the MAPS Build phase for an agent or multi-agent system. Use when turning a design into a runnable agent loop, prompts, state, routing, orchestration, project files, local run commands, and basic tests.
---

# Build Agent
## Versioning

Current version: 0.6.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-19 - v0.6.0 - Rebuilt the Autonomy Contract Gate as an input-led, one-question-at-a-time contract interview with required R&R capture before any autonomy build, scaffolded authority, or activation proof.
- 2026-06-19 - v0.5.0 - Added the Autonomy Contract Gate: Build must ask for and enforce an explicit autonomy contract before implementing autonomous behavior, recurring triggers, scheduled checks, independent goal pursuit, or action outside a visible user turn.
- 2026-06-19 - v0.4.0 - Added 10/10 role-to-agent proof requirements: runnable command evidence, fail-closed contract tests, stricter-profile conflict tests, profile-denied behavior tests, audit/state/log artifacts, runtime-adapter proof timing, and Equip/Evaluate handoffs.
- 2026-06-19 - v0.3.0 - Made agent profile enforcement a required build step: Build must read profile plus design, fail closed when either is missing or conflicting, and block behavior beyond profile limits.
- 2026-06-19 - v0.1.0 - Established the initial MAPS skill version baseline and changelog tracking.
- 2026-06-19 - v0.2.0 - Added role-to-agent build contract alignment: Build must read the source role contract, agent profile, design artifact, and backlog before implementation, preserve authority boundaries, preserve the `Role` / `Role+` / `Agent` distinction, and avoid treating design artifacts as operating authorization.

## Overview

Use this skill to implement the smallest useful agent that matches the design.

For role-to-agent work, this skill is the first implementation phase after `/design-agent`. It must turn the approved design contract into a runnable slice without expanding the role's authority, activation state, tool permissions, memory access, spending ability, external communication ability, or autonomous runtime. A design artifact is not operating authorization. Build may create code, prompts, local state, adapters, fixtures, and tests within the approved slice; operational confidence still requires the appropriate Equip, Evaluate, Deploy, Observe, and Improve evidence.

Preserve Scott's role-agent taxonomy:

- `Role` means no automation enabled.
- `Role+` means automation-enabled but no independent authority, contract, goal outside automation rules, runtime state, or agentic status; a memory file alone does not make a role stateful or agentic.
- `Agent` means an implemented runtime category with the explicitly approved runtime contract, authority, tools, memory, evaluation, deployment, observation, and stop conditions.

Build must not silently promote `Role` to `Role+`, or `Role+` to `Agent`.

Build must fail closed unless both control artifacts exist:

- `agents/{agent-handle}/agent-profile.md`
- `agents/{agent-handle}/agent-design.md`

The profile is the runtime control contract for activation, authority, tools, memory rights, approval gates, stop conditions, runtime enforcement status, profile gates, and website mirror status. The design is the workflow and implementation contract. Runtime behavior must be generated from or checked against both.

If the profile and design conflict, the stricter limit wins and Build must stop for an approval gate before implementation when the requested behavior would exceed the profile. Website profile pages are mirrors only and must never be used as behavior input or authority evidence.

For role-to-agent work, do not call a build 10/10 mature unless it has proof from at least one real role-to-agent build, a runnable local command, fail-closed tests for missing `agent-profile.md` and `agent-design.md`, conflict tests where the stricter profile limit wins, profile-denied behavior tests, audit/state/log artifacts, and explicit runtime-adapter evidence after a runtime target is chosen.

Runtime adapters are mandatory after runtime selection for real built agents. If no runtime target is selected yet, keep the build runtime-neutral, record the adapter decision as pending, and hand off the runtime gap to `/equip-agent` or `/evaluate-agent` as appropriate. Do not infer a specific adapter while the system is still Codex-centered.

## Autonomy Contract Gate

Build must treat autonomy as an input-led contract, not as an implementation detail or inferred build scaffold.

Do not implement autonomous behavior unless the source role contract, agent profile, design artifact, and autonomy contract include explicit, approved user input for the requested behavior. Autonomous behavior includes:

- recurring or scheduled triggers
- heartbeat-style checks that can act beyond reading and reporting
- independent goal pursuit
- tool, memory, communication, production, spending, or workflow actions outside a visible user-directed turn
- self-continuation after the initiating request is complete
- authority to choose new work instead of only completing the assigned build slice

If autonomy is requested or implied and no approved autonomy contract exists, stop the normal build path and start the Autonomy Contract Interview. Do not infer, fill, smooth, or complete missing contract answers from architecture judgment. Preserve Scott's exact answers in a `Scott Contract Inputs` section and mark missing fields `input-needed`.

Build may create or reset `agents/{agent-handle}/autonomy-contract.md` as a worksheet. The worksheet is not approval and must say `Contract status: input-interview-in-progress` or `Contract status: draft-not-approved`, plus `Activation status: not active`, until Scott approves activation.

Before the first contract question, briefly name the contract map so Scott can see the surface being built. Then ask exactly one question. Do not present a multi-question form, checklist, or table for Scott to fill out.

An autonomy contract must answer these fields in this order unless Scott explicitly redirects the sequence:

1. Mission or delegated goal.
2. Scope: single-agent, multi-agent, or both.
3. R&R: roles and responsibilities.
4. Trigger, cadence, wakeup source, or explicit no-trigger rule.
5. Allowed outputs.
6. Allowed actions.
7. Disallowed actions.
8. Decision authority.
9. Tool authority.
10. Memory and state rights.
11. Approval gates.
12. Stop conditions.
13. Evaluation and proof requirements.
14. Audit, log, and reporting requirements.
15. Rollback or revocation path.
16. Notification and noise policy.
17. Named owner and final approver.

R&R means roles and responsibilities. The R&R answer must name which responsibilities belong to the built agent, Scott, and any relevant coordinating roles, and which responsibilities are explicitly outside the automation. If R&R is missing, stop before implementation and ask:

`Who owns what in this automation: what should the agent own, and what must remain with Scott or another named role?`

If autonomy is requested or implied and the autonomy contract is missing, incomplete, stale, inferred, or weaker than the requested behavior, stop before implementation and ask the next unanswered contract question. Route the gap back to `/define-agent`, `/design-agent`, `/equip-agent`, or `/evaluate-agent` only after the missing contract field is identified. Build may create stubs, policy checks, and tests that prove autonomous behavior is blocked until the autonomy contract is approved.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

For role-to-agent builds, preserve the source role contract as the authority source for mandate, voice, maturity, authority, non-responsibilities, forbidden actions, escalation, learning loop, and memory rules. Treat `agents/{agent-handle}/agent-profile.md` as the required runtime control contract. Website profile pages are mirrors only and must not grant authority.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /build-agent --phase A3 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Required interview

Before changing implementation files, ask for any missing answers. Do not build an agent without a confirmed design target and run path.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Use the questions below as the internal interview sequence: ask the next most important missing question, wait for the answer, then continue.

Ask:

- Which agent, role, or capability should be built now?
- Which design artifact is the source of truth?
- For role-to-agent builds, which source role contract, `agents/{agent-handle}/agent-profile.md`, design artifact, and `agents/{agent-handle}/agent-backlog.md` define the approved build contract?
- Does the requested build include or imply autonomous behavior, recurring triggers, scheduled checks, heartbeat actions, independent goal pursuit, or action outside a visible user-directed turn?
- If autonomy is requested or implied, start or continue the Autonomy Contract Interview. Ask the next unanswered question from the Autonomy Contract Gate sequence. Do not ask for implementation slice, runtime, tools, or local command until the contract is complete or Scott explicitly defers the missing field.
- Does the profile allow the requested runtime, tools, memory writes, approval behavior, external communication, production access, spending, and autonomy level?
- What is the smallest useful runnable slice?
- What runtime, framework, language, or repo conventions should be used?
- What tools, APIs, secrets, memory, or RAG access should be stubbed versus wired for real?
- What should be explicitly out of scope for this build pass?
- What command should run the agent locally?
- What test or verification should prove the first slice works?
- What failure behavior or guardrail must exist in the first build?
- What audit, state, and log artifacts should prove the build ran and enforced profile limits?
- If a runtime target is chosen, what runtime adapter must be built or proven?
- What should be deferred to Equip, Evaluate, or Deploy?

If the answers are missing, ask before editing code.

## Workflow

1. Read the project structure and existing conventions first.
2. Read the source design artifact and confirm the approved build slice, runtime target, proof plan, and build gate.
3. Read `agents/{agent-handle}/agent-profile.md` before implementation. If it is missing, stop and route back to `/define-agent` or `/design-agent`.
4. For role-to-agent builds, also read the source role contract and `agents/{agent-handle}/agent-backlog.md` when present before editing implementation files.
5. Compare the role contract, agent profile, design artifact, and backlog. If they conflict on role-agent category, authority, tools, memory, approvals, activation, runtime enforcement, profile gates, stop conditions, or forbidden actions, stop and ask one blocker question before implementation.
6. Check the Autonomy Contract Gate. If the requested build includes or implies autonomous behavior, recurring triggers, scheduled checks, heartbeat actions, independent goal pursuit, or action outside a visible user-directed turn, require an input-led autonomy contract before implementation.
7. If the autonomy contract is missing, incomplete, inferred, missing R&R, or conflicts with the role/profile/design/backlog, stop and ask the next unanswered contract question. Do not fill in missing autonomy authority during Build.
8. Generate or update runtime prompts, policy, routing, tool allowlist, memory rights, approval gates, and stop conditions only from the profile plus design plus approved autonomy contract when autonomy exists.
9. Treat profile-denied tools, memory writes, external communication, production access, spending, autonomous timers, secrets, and authority expansion as blocked unless explicit approval updates the profile first.
10. Identify the minimal runnable agent path.
11. Implement prompts, state, routing, and orchestration only inside the approved build slice.
12. Add tool stubs or interfaces needed by the design, defaulting to stubs when real credentials, external communication, production action, spending, autonomous behavior, or expanded authority are not explicitly approved in the profile and autonomy contract.
13. Add basic verification for the happy path and at least one guardrail or refusal path named by the role contract, profile, design, or autonomy contract.
14. Add tests proving profile-denied and autonomy-denied actions are refused or escalated when the slice touches tools, memory, external communication, production access, spending, autonomous timers, secrets, authority expansion, scheduled triggers, heartbeat actions, independent goal pursuit, or self-continuation.
15. Add fail-closed tests proving the build refuses to run when `agent-profile.md` or `agent-design.md` is missing.
16. Add conflict tests proving that when profile and design disagree, the stricter profile limit wins and any exceeding behavior stops at an approval gate.
17. Produce or name audit, state, and log artifacts that show the local run, profile/design sources read, autonomy contract source or deferral, approval gates applied, profile-denied behavior, autonomy-denied behavior, and stop-condition behavior.
18. Document the local run command and include evidence that it was executed or explain the blocker.
19. If a runtime target is selected, build or prove the runtime adapter. If no runtime target is selected, record a runtime-neutral adapter decision and defer adapter proof explicitly.
20. Record deferred risks for Equip, Evaluate, Deploy, Observe, or Improve.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/equip-agent` to wire tools, permissions, memory, and data sources, or `/evaluate-agent` if the build is already equipped enough to test.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output
Return:

- Files changed
- How to run locally
- What was verified
- What remains for Equip, Evaluate, or Deploy
- For role-to-agent builds, the source role contract, agent profile, design artifact, and backlog read before implementation
- Any role-agent category, authority, tool, memory, approval, activation, or forbidden-action constraints preserved from the role contract/profile
- Autonomy contract source, interview status, exact Scott inputs captured, R&R answer or blocker, autonomy level, delegated goal, trigger/cadence, approval gates, stop conditions, audit/log artifacts, rollback/revocation path, and owner/approver, or the blocker that prevents autonomy implementation
- Any profile/design conflicts found, the stricter limit applied, and any approval-required gate left for Scott or the named approver
- Profile-denied behavior tests added or deferred
- Autonomy-denied behavior tests added or deferred
- Runnable local command evidence, including command, result, and blocker if not run
- Fail-closed test evidence for missing `agent-profile.md` and missing `agent-design.md`
- Conflict test evidence proving the stricter profile limit wins
- Audit, state, and log artifacts created or updated
- Runtime target, runtime-neutral adapter decision, runtime adapter proof, or explicit adapter-proof deferral
- Equip and Evaluate handoffs for unproven tools, permissions, memory, data sources, runtime adapters, eval coverage, or profile-denied behavior gaps

## Done Criteria

- The agent runs.
- The implementation matches the design.
- For role-to-agent builds, the implementation matches the source role contract, agent profile, design artifact, and approved backlog slice.
- Build fails closed when `agent-profile.md` or `agent-design.md` is missing.
- Runtime behavior is generated from or checked against profile plus design.
- Profile-denied tools, memory writes, external communication, production access, spending, autonomous timers, secrets, and authority expansion are blocked or escalated.
- Website profile pages are not used as behavior input or authority evidence.
- The implementation preserves the approved `Role`, `Role+`, or `Agent` category and does not promote the role-agent category without explicit approval.
- Autonomous behavior is implemented only when an explicit, input-led autonomy contract exists in the approved role/profile/design source set.
- R&R is captured before any autonomy implementation, trigger, or activation proof is built.
- Missing, incomplete, or conflicting autonomy contracts stop the build before implementation and route the gap to the appropriate MAPS skill.
- No authority expansion, autonomous runtime, production action, external communication, spending, secrets change, or activation status change is introduced without Scott's explicit approval.
- Basic behavior is verified.
- Known gaps are explicit.
- At least one real role-to-agent proof build exists before claiming the role-to-agent Build contract is 10/10 mature.
- The local run command is documented and has execution evidence or a named blocker.
- Missing `agent-profile.md` and missing `agent-design.md` fail closed in tests.
- Profile/design conflict tests prove the stricter profile limit wins.
- Profile-denied behavior tests cover tools, memory writes, external communication, production access, spending, autonomous timers, secrets, and authority expansion when those surfaces exist in the build.
- Autonomy-denied behavior tests cover scheduled triggers, heartbeat actions, independent goal pursuit, self-continuation, and action outside a visible user-directed turn when those surfaces exist in the build.
- Audit, state, and log artifacts prove the build read the expected control artifacts, enforced profile limits, and either enforced or explicitly deferred the autonomy contract.
- Runtime adapter proof exists after a runtime target is chosen; otherwise the build records a runtime-neutral adapter decision and keeps adapter proof deferred.
- Unproven tool, permission, memory, data-source, runtime-adapter, and eval gaps are handed off to `/equip-agent` or `/evaluate-agent`.
