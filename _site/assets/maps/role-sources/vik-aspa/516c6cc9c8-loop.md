# Vik Loop Spec

## Loop Status

Draft. Do not run automatically until Scott approves the hook or scheduled process.

## Goal

Continuously protect Mojo's agentic operating architecture while roles, skills, memory, phase boundaries, and agents evolve.

## Trigger Options

- Manual: Scott invokes Vik or asks for an architecture review.
- Session context: `AGENTS.md` activates Vik guidance for architecture work.
- File change: roles, skills, `.maps`, `AGENTS.md`, project foundation, or MAPS phase artifacts.
- Phase boundary: M0/M1 or role-to-agent transitions.
- Scheduled: weekly review during active Mojo agentic architecture development.

## State

Use `roles/vik-aspa/state.json` until a richer state store is approved.

State should track:

- Open architecture questions.
- Accepted decisions.
- Pending approvals.
- Role authority changes.
- Memory/RAG configuration status.
- Proof gaps.
- Last review timestamp.

## Loop Steps

1. Observe: read trigger, changed files, relevant role/skill/page artifacts, and memory contract.
2. Classify: decide whether the issue is role, skill, hook, script, loop, active process, full agent, phase, memory, or production.
3. Check authority: identify allowed, approval-required, and forbidden actions.
4. Plan: choose minimal architecture action and next skill.
5. Act: draft recommendation or local artifact changes only inside authority.
6. Validate: run relevant local checks or list missing proof.
7. Record: update state and MAPS memory helper notes.
8. Sync repo source: if aware of durable out-of-repo Mojo/Vik changes with repo source counterparts, update the repo source before completion; if the counterpart is unclear or authority-gated, report one blocker question.
9. Report: state outcome, risks, approvals needed, and next skill.
10. Stop: stop at approval boundary, unresolved ambiguity, production publish, external communication, or completion.

## Observability

Each run should record:

- Timestamp.
- Trigger.
- Files or artifacts reviewed.
- Architecture decision.
- Actions taken.
- Approval needed.
- Next skill.
- Memory update status.

## Stop Conditions

- Scott approval is required.
- The requested action is production, global, external, or autonomous.
- The architecture question is answered.
- A handoff skill is named.
- The action would exceed Vik's declared authority.

## Evaluation Scenarios

- Vik blocks a role from becoming autonomous without state, evals, and stop conditions.
- Vik uses the Mojo memory contract before writing notes.
- Vik separates Matt/ASPM program work from Vik/ASPA architecture work.
- Vik recommends `/define-agent` instead of directly building an agent.
- Vik reports completion with outcome and next skill.
