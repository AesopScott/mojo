---
name: evaluate-agent
description: Create the MAPS Evaluate phase artifact for an agent or multi-agent system. Use when designing scenario tests, eval datasets, rubrics, scorecards, regression checks, red-team prompts, safety checks, and release evidence.
---

# Evaluate Agent
## Versioning

Current version: 0.3.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-19 - v0.3.0 - Added role-to-agent implementation confidence scenarios, `Role` / `Role+` / `Agent` category gates, executable-vs-specification evidence rules, and real template routing for eval suites and reports.
- 2026-06-19 - v0.2.0 - Added required agent profile conformance evaluations for activation, authority, tools, memory, approvals, stop conditions, voice, handoffs, runtime enforcement, and website mirror sync.
- 2026-06-19 - v0.1.0 - Established the initial MAPS skill version baseline and changelog tracking.

## Overview

Use this skill to prove agent behavior before release and create evidence for improvement.

For built agents and role-to-agent work, `agents/{agent-handle}/agent-profile.md` is the required control contract for activation, authority, tools, memory rights, approvals, stop conditions, runtime enforcement, and website mirror status. Evaluation must test runtime behavior against the profile plus design before any release, activation, authority expansion, or deployment recommendation.

Website profile pages are mirrors only. Evaluation may check whether a website profile page matches `agent-profile.md`, but it must not treat the website page as authority evidence.

Role-to-agent evaluation must preserve the category boundary:

- `Role`: no automation enabled.
- `Role+`: automation-enabled but no independent authority, contract, goal outside automation rules, runtime state, or agentic status.
- `Agent`: implemented runtime with approved authority, tools, memory, evaluation, deployment, observation, escalation, and stop conditions.

Do not score a `Role` or `Role+` as an implemented `Agent` because it has a memory file, heartbeat, automation, handoff channel, website page, profile, design, or backlog. Those artifacts can be evaluated for readiness only.

## Project foundation updates

At the start of every project run, look for `project-foundation.md`. If it exists, read `Persistent Memory Contract` and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If `.maps/foundation-preferences.json` exists, use it as the structured preference source for automation.

When this skill creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends `MAPS Skill Run Log`, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

```bash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /evaluate-agent --phase A5 --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
```

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to `project-foundation.md`, then update this skill's named note in `<notesRoot>/maps-runs/`.

## Required interview

Before writing evals or scorecards, ask for any missing answers. Do not create generic tests that are detached from the real agent job.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Use the questions below as the internal interview sequence: ask the next most important missing question, wait for the answer, then continue.

Ask:

- Which agent, role, workflow, or release candidate is being evaluated?
- What success criteria, failure criteria, and release gates already exist?
- Which `agents/{agent-handle}/agent-profile.md` and `agents/{agent-handle}/agent-design.md` define the profile and design controls being tested?
- What real tasks or customer stories should become eval scenarios?
- What edge cases, unsafe requests, adversarial inputs, and escalation cases matter?
- What tools, memory, RAG, or human approvals need to be tested?
- Which profile-denied behaviors must be refused or escalated?
- What rubric or scoring style should be used?
- What minimum score or evidence is needed for release?
- What known failures need regression coverage?
- Should evals be runnable now, specified for later, or both?
- Who reviews the eval results and makes the go/no-go decision?

If the user does not have eval scenarios, draft candidates and ask for approval before treating them as the suite.

## Workflow

1. Restate the agent's success and failure criteria.
2. Read `agents/{agent-handle}/agent-profile.md` and `agents/{agent-handle}/agent-design.md` when evaluating a built agent or role-to-agent implementation. If either is missing, mark evaluation blocked.
3. Extract profile controls: activation status, authority level, allowed and forbidden tools, memory rights, approval gates, stop conditions, voice profile, handoffs, runtime enforcement status, and website mirror status.
4. Extract category controls: current category, target category, category-change approval, runtime target, build gate, and proof required before Build/Equip/Deploy.
5. Choose executable mode only when the built agent can actually run in the approved runtime or sandbox. Use specification mode when execution is blocked by missing implementation, secrets, connectors, credentials, runtime access, deployment pieces, or approval.
6. Create common, edge, adversarial, and unsafe scenarios.
7. Add role-to-agent implementation confidence scenarios for:
   - `Role` remains non-automated unless explicitly promoted
   - `Role+` automation stays bounded to heartbeat or assigned automation rules
   - `Role+` is not treated as agentic because memory or automation exists
   - `Agent` claims require executable loop evidence
   - design and backlog are not treated as implementation
   - build output includes local run command, changed files, tests, and deferred gaps
   - equip output distinguishes stubbed tools from granted tools
   - eval report distinguishes executed evidence from specification-only checks
8. Add profile-conformance scenarios for:
   - activation and autonomous runtime refusal
   - authority limits and approval gates
   - allowed and forbidden tools
   - memory read/write boundaries
   - external communication, production, spending, secrets, and authority expansion refusals
   - stop conditions and escalation
   - voice profile adherence
   - handoff routing and noisy-log avoidance
   - runtime enforcement status
   - website profile mirror sync without treating the page as authority
9. Define expected behavior and scoring rubrics.
10. Add regression cases for known failures.
11. Include tool-use and escalation checks.
12. Run or specify the evaluation process.
13. Produce a scorecard and release recommendation.

## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: `/deploy-agent` when release evidence passes, or `/improve-agent` when failures need fixes before release.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.
## Output
Return:

- Eval scenarios
- Rubric or scoring method
- Scorecard
- Failure categories
- Release recommendation
- Execution mode evidence: executable, specification-only, or mixed
- Role-agent category matrix covering `Role`, `Role+`, and `Agent` claims
- Profile conformance matrix covering authority, tools, memory, approvals, stop conditions, voice, handoffs, runtime enforcement, and website mirror sync
- Release gates that must remain blocked until profile-denied behaviors are proven refused or escalated

Use `assets/maps/templates/eval-suite.md` for planned scenarios and `assets/maps/templates/eval-report.md` for results when working inside the Mojo repo.

## Done Criteria

- Evals reflect real tasks.
- Risky behavior is tested.
- Agent profile controls are tested before release, activation, deployment, or authority expansion recommendations.
- `Role`, `Role+`, and `Agent` categories are scored separately.
- A `Role+` is not treated as an implemented agent merely because it has automation, memory, handoffs, profile, design, or backlog.
- Executable evidence and specification-only evidence are clearly separated.
- Profile-denied behaviors are proven refused or escalated.
- Website profile pages are checked as mirrors only and are not treated as authority evidence.
- Results can guide go/no-go decisions.
- Failures feed the Improve phase.
