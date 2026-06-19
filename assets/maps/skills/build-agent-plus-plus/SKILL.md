---
name: build-agent-plus-plus
description: MAPS Phase 3 Build skill that merges base /build-agent, incremental implementation, and test-driven development into one implementation workflow.
---

# Build Agent++
## Versioning

Current version: 0.1.0.

Follow semantic versioning for this skill:

- Patch: wording, examples, references, or small workflow clarifications.
- Minor: new outputs, new required steps, new helper behavior, or expanded workflow capability.
- Major: renamed outputs, changed artifact contracts, removed behavior, or incompatible workflow changes.

When changing this skill, update `Current version` and add a `Changelog` entry with the date, version, and short summary of behavior changed.

## Changelog

- 2026-06-19 - v0.1.0 - Established the initial MAPS wrapper skill version baseline and changelog tracking.

Use `/build-agent++` when an approved MAPS agent design is ready to become a working agent.

This skill merges three ideas:

- MAPS `/build-agent`: build from the approved agent design and record MAPS artifacts.
- Incremental implementation: build one thin, testable vertical slice at a time.
- Test-driven development: prove behavior with failing tests before implementation whenever the slice changes behavior.

## Augmentation References

This skill is MAPS-native, but it is explicitly augmented by these reference skills and repositories:

- MAPS base `/build-agent`: `assets/maps/skills/build-agent/SKILL.md`
- Addy Osmani Agent Skills: `https://github.com/addyosmani/agent-skills`
- Incremental implementation skill: `https://github.com/addyosmani/agent-skills/blob/main/skills/incremental-implementation/SKILL.md`
- Test-driven development skill: `https://github.com/addyosmani/agent-skills/blob/main/skills/test-driven-development/SKILL.md`
- Code review and quality skill: `https://github.com/addyosmani/agent-skills/blob/main/skills/code-review-and-quality/SKILL.md`
- GitHub Spec Kit: `https://github.com/github/spec-kit`
- OpenAI Agents SDK: `https://github.com/openai/openai-agents-python`
- CrewAI: `https://github.com/crewAIInc/crewAI`
- Google ADK: `https://github.com/google/adk-python`
- Awesome Agent Skills: `https://github.com/VoltAgent/awesome-agent-skills`
- Claude Code Templates: `https://github.com/davila7/claude-code-templates`
- AI Agents for Beginners: `https://github.com/microsoft/ai-agents-for-beginners`


## Project foundation updates

At the start of every project run, look for project-foundation.md. If it exists, read Persistent Memory Contract and use its configured notes, sources, memory, RAG, and sync rules as the project defaults. If .maps/foundation-preferences.json exists, use it as the structured preference source for automation.

When this wrapper creates durable knowledge, write it through the shared MAPS memory helper. The helper gives this skill its own named note under the configured notes root, mirrors that note into the configured RAG location when one exists, appends MAPS Skill Run Log, and records a RAG reindex manifest.

At the end of the run, call the helper after creating the primary output artifact:

`ash
python "$CODEX_HOME/skills/foundation/scripts/maps_memory.py" complete-run --project . --skill /build-agent++ --phase Wrapper --output "<primary artifact path>" --summary-file "<primary artifact path>" --memory-updates "<notes, sources, memory, or RAG updates>"
`

If the helper is unavailable, manually append the timestamp, skill, phase, output path, memory updates, and short note to project-foundation.md, then update this skill's named note in <notesRoot>/maps-runs/.


- `agents/{agent-handle}/agent-design.md`
- `agents/{agent-handle}/agent-backlog.md`
- Phase 2 Build gate and proof plan
- Target runtime, framework, or platform
- Runtime profile or adapter requirement from Phase 2
- Existing project conventions and tests

## Stop If

- The Phase 2 Build gate is missing or unresolved.
- Required secrets, tools, or permissions are not available.
- The design requires a risky external integration that has not been approved.
- The first slice cannot be verified locally or in a safe sandbox.


## Required interview

Before acting, ask for any missing answers required to choose the target artifact, wrapper path, runtime, provider, evidence source, or approval boundary.

Ask exactly one question at a time. Do not present the user with a multi-question form, checklist, or table to fill out. Ask the next most important missing question, wait for the answer, then continue.


1. Read the approved agent design and dependency-aware backlog.
2. Extract the build target, runtime target, adapter requirement, behavior contract, backlog priority, dependencies, tool boundaries, and proof plan.
3. Create or update `agents/{agent-handle}/agent-build.md` with:
   - implementation slices
   - runtime adapter/profile work
   - tests or evals per slice
   - acceptance evidence
   - remaining risks
4. Select the highest-priority unblocked backlog item. If it is too large, split it into smaller items before coding.
5. If the first working agent needs a runtime adapter or runtime profile, create the smallest adapter/profile that lets the first slice run.
6. Choose the first thin vertical slice that creates observable agent behavior.
7. Write or update the smallest failing test, eval, fixture, or scripted check for that slice.
8. Implement the minimum code, configuration, or adapter transformation needed to pass.
9. Run the slice checks and the relevant regression checks.
10. Refactor only after checks pass.
11. Recommend whether the build should receive an optional code review before Equip.
12. For higher-risk builds, recommend a second optional review with a different model or reviewer to catch builder-model blind spots.
13. Record evidence in the build artifact, including review decision, findings, fixes, skipped-review rationale, or unresolved risks.
14. Repeat until the first working agent is usable enough for Phase 4 Equip.

## Slice Rules

- Each slice must leave the system working.
- Prefer vertical behavior over horizontal plumbing.
- Pull slices from the backlog in priority/dependency order.
- Split oversized backlog items before implementation.
- Keep defaults safe and reversible.
- Do not add broad abstractions before the second real use.
- Treat external tools as explicit boundaries with failure behavior.

## TDD Rules

- For behavior changes, write the proof first.
- The proof can be a unit test, integration test, scenario eval, trace assertion, or browser/runtime check.
- The proof must fail for the right reason before implementation.
- If a test-first path is impossible, document why and add the closest verification guard before moving on.

## Optional Review Rules

- Treat code review as optional but worth raising before Phase 4 Equip.
- Recommend a standard review when the build touches tools, credentials, runtime adapters, production code, user-facing behavior, memory, permissions, or security-sensitive paths.
- Recommend a second review with a different model or reviewer for high-risk, high-impact, security-sensitive, production-facing, or model-generated changes.
- The second review should look for blind spots from the original builder model, not repeat the same checklist mechanically.
- Record whether review was skipped, completed, escalated, or deferred.
- Record review findings, fixes applied, unresolved risks, and why a different-model review was or was not used.

## Runtime Adapter Rules

- Treat Codex and Claude Code as runtime profiles unless the target requires transformation beyond install/use instructions.
- Treat OpenClaw, Manus, Hermes, OpenAI Agents SDK, CrewAI, and Google ADK as possible runtime adapters until their packaging requirements are proven simple.
- Reserve LangGraph for later multi-agent orchestration implementation or graph-state runtimes when the design requires it.
- Build only the adapter/profile required for the first working runtime in Phase 3.
- Defer broader multi-runtime packaging to Phase 6 Deploy unless portability is part of the first working agent.
- Record unsupported MAPS features and runtime-specific assumptions in the build artifact.


## Completion report

When the skill is complete, tell the user explicitly. Do not end with only files changed or raw output.

Report:

- Completion status: complete, blocked, or needs more answers.
- Outcome: the concrete artifact, decision, scaffold, implementation, or plan produced.
- Key decisions or changes made.
- Memory update: whether the shared MAPS memory helper ran, what note/run log was updated, and what RAG or notes locations need syncing.
- Next skill: the next MAPS phase skill, wrapper, or follow-up skill that should run.

If the skill is blocked, say what answer, artifact, access, approval, or tool is needed before the next skill can run.

## Output

- Working agent implementation
- `agents/{agent-handle}/agent-build.md`
- Runtime adapter/profile files when required
- Passing checks or documented blocked checks
- Optional code review decision and different-model review decision
- Evidence needed by Phase 4 Equip and Phase 5 Evaluate
