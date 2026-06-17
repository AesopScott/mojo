---
name: build-agent++
description: MAPS Phase 3 Build skill that merges base /build-agent, incremental implementation, and test-driven development into one implementation workflow.
---

# Build Agent++

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
- LangGraph: `https://github.com/langchain-ai/langgraph`
- CrewAI: `https://github.com/crewAIInc/crewAI`
- Google ADK: `https://github.com/google/adk-python`
- Awesome Agent Skills: `https://github.com/VoltAgent/awesome-agent-skills`
- Claude Code Templates: `https://github.com/davila7/claude-code-templates`
- AI Agents for Beginners: `https://github.com/microsoft/ai-agents-for-beginners`

## Inputs

- `agents/{agent-handle}/agent-design.md`
- Phase 2 Build gate and proof plan
- Target runtime, framework, or platform
- Runtime profile or adapter requirement from Phase 2
- Existing project conventions and tests

## Stop If

- The Phase 2 Build gate is missing or unresolved.
- Required secrets, tools, or permissions are not available.
- The design requires a risky external integration that has not been approved.
- The first slice cannot be verified locally or in a safe sandbox.

## Workflow

1. Read the approved agent design.
2. Extract the build target, runtime target, adapter requirement, behavior contract, tool boundaries, and proof plan.
3. Create or update `agents/{agent-handle}/agent-build.md` with:
   - implementation slices
   - runtime adapter/profile work
   - tests or evals per slice
   - acceptance evidence
   - remaining risks
4. If the first working agent needs a runtime adapter or runtime profile, create the smallest adapter/profile that lets the first slice run.
5. Choose the first thin vertical slice that creates observable agent behavior.
6. Write or update the smallest failing test, eval, fixture, or scripted check for that slice.
7. Implement the minimum code, configuration, or adapter transformation needed to pass.
8. Run the slice checks and the relevant regression checks.
9. Refactor only after checks pass.
10. Record evidence in the build artifact.
11. Repeat until the first working agent is usable enough for Phase 4 Equip.

## Slice Rules

- Each slice must leave the system working.
- Prefer vertical behavior over horizontal plumbing.
- Keep defaults safe and reversible.
- Do not add broad abstractions before the second real use.
- Treat external tools as explicit boundaries with failure behavior.

## TDD Rules

- For behavior changes, write the proof first.
- The proof can be a unit test, integration test, scenario eval, trace assertion, or browser/runtime check.
- The proof must fail for the right reason before implementation.
- If a test-first path is impossible, document why and add the closest verification guard before moving on.

## Runtime Adapter Rules

- Treat Codex and Claude Code as runtime profiles unless the target requires transformation beyond install/use instructions.
- Treat OpenClaw, Manus, Hermes, LangGraph, OpenAI Agents SDK, CrewAI, and Google ADK as possible runtime adapters until their packaging requirements are proven simple.
- Build only the adapter/profile required for the first working runtime in Phase 3.
- Defer broader multi-runtime packaging to Phase 6 Deploy unless portability is part of the first working agent.
- Record unsupported MAPS features and runtime-specific assumptions in the build artifact.

## Output

- Working agent implementation
- `agents/{agent-handle}/agent-build.md`
- Runtime adapter/profile files when required
- Passing checks or documented blocked checks
- Evidence needed by Phase 4 Equip and Phase 5 Evaluate
