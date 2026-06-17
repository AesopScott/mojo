---
name: design-experience
description: Run MAPS M3 Experience Design for multi-agent products, or optional A2 Experience Design for single-agent products without an M layer. Use when Codex needs to turn product intent, system shape, roster, and agent design constraints into user journeys, surfaces, information architecture, interaction states, accessibility requirements, and APS handoffs.
---

# Design Experience

Use this skill after M0 Product Intent, M1 System Shape, and M2 Roster exist, and before M4 Contracts and M6 Agent Buildout depend on product behavior. For a standalone agent with no multi-agent system, use the same workflow as optional A2 between Phase 2 Design and Phase 3 Build.

## Inputs

- Product intent, audience, promise, success criteria, failure criteria, and taste standard
- System shape: surfaces, workflows, objects, integrations, boundaries, and first useful slice
- Agent roster: agent roles, authority, responsibilities, handoffs, and human ownership
- Existing Phase 1 and Phase 2 APS artifacts when the project already has agent briefs or designs
- Brand, design-system, accessibility, compliance, or platform constraints

## Workflow

1. Restate the product promise, target user, trust boundary, and first useful user journey.
2. Identify every surface the user touches: app screens, chat surfaces, dashboards, notifications, approvals, settings, errors, docs, and handoff points.
3. Map the core journeys from user intent to completion, including human decisions, agent work, waiting, uncertainty, escalation, and recovery.
4. Define the information architecture: navigation, object hierarchy, labels, content grouping, and how users find current state.
5. Define how agent activity appears to users: planning, tool use, memory use, confidence, uncertainty, citations, approvals, refusals, handoffs, and completion.
6. Model interaction states: loading, streaming, empty, draft, pending approval, blocked, partial success, error, retry, escalation, success, and post-completion review.
7. Define visual and tone standards: density, hierarchy, affordances, language, voice, motion, and personality.
8. Define accessibility expectations: keyboard paths, focus behavior, semantics, contrast, motion, readable copy, form errors, and assistive-technology notes.
9. Decide what the experience requires from each APS agent: brief changes, design constraints, tool visibility, memory boundaries, eval scenarios, and observability signals.
10. Write `experience-design.md` from the template and record unresolved decisions as explicit follow-up items.

## Output

- `m/{project-handle}/experience-design.md` for a multi-agent project, or `agents/{agent-handle}/experience-design.md` for optional single-agent A2
- User journeys and front-end surfaces
- Information architecture and navigation model
- Agent visibility, control, approval, refusal, handoff, and recovery rules
- Interaction-state inventory
- Accessibility and content requirements
- APS handoff notes for Phase 1 Define, Phase 2 Design, Phase 3 Build, Phase 5 Evaluate, and Phase 7 Observe

## Guardrails

- Do not design generic decoration. M3 is about product behavior, user control, clarity, and trust.
- Do not hide agent uncertainty, tool use, or approval needs if the user must understand them to make a safe decision.
- Do not move orchestration logic into M3. Coordination belongs in M5; M3 describes the user-facing experience of coordination.
- Do not create new agent responsibilities silently. Send responsibility changes back to M2 Roster or APS Phase 1.
- Do not skip accessibility. Treat keyboard, focus, semantics, contrast, motion, and readable state/error copy as phase requirements.
