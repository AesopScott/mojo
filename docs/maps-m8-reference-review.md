# MAPS M8 Experience Design Review

Date: 2026-06-17

## Phase Placement Update

Based on the feed relationships, Experience Design belongs after Orchestration Build. The multi-agent sequence should stay compact:

M0 Product Intent -> M1 System Shape -> M2 Roster -> M3 Contracts -> M4 Coordination -> M5 Agent Buildout -> M6 Shared Capabilities -> M7 Orchestration Build -> M8 Experience Design -> M9 System Evaluate -> M10 System Deploy/Observe -> M11 System Improve.

M8 is still shared with optional single-agent A2, but only the multi-agent placement moves. Optional A2 remains between APS Phase 2 Design and Phase 3 Build when there is no multi-agent M layer.

| Phase | What is working | M8 implication |
|---|---|---|
| M7 Orchestration Build | Defines how agents route, hand off, wait, fail, retry, and complete work together. | M8 can now design the user-visible experience from actual orchestration behavior instead of guessing too early. |
| M9 System Evaluate | Proves full product and cross-agent workflows. | M8 should feed journey, state, accessibility, trust, and user-recognizable success scenarios into evaluation. |
| M10 System Deploy/Observe | Releases and watches the full orchestrated system. | M8 should define the production surfaces, feedback moments, and user-visible states worth observing. |
| M11 System Improve | Routes evidence-backed improvements. | M8 should help classify UX, IA, content, accessibility, and state-model failures. |

## Evaluation: M8 Experience Design References

Mode: Search/direct hybrid

### Recommended action

Use all listed repos as references. Do not make M8 depend on a UI framework yet. If a later implementation needs a UI dependency, evaluate that specific runtime and product surface then.

### Candidate breakdown

| Repo | Verdict | Evidence |
|---|---|---|
| `uswds/uswds` | Use as reference only | Strong accessibility and public-service design fit, active as of 2026-06-16 with 7,114 stars; license reports as non-standard/NOASSERTION, so avoid adopting code by default. |
| `alphagov/govuk-frontend` | Use as reference; adopt with caveats only for service flows | MIT, active as of 2026-06-17, 1,414 stars; excellent fit for service UX, forms, errors, content clarity, and progressive disclosure. |
| `microsoft/fluentui` | Use as reference only | Very active and high-adoption at 20,057 stars; license reports as non-standard/NOASSERTION through repo metadata, and it is broader/heavier than M3 needs. |
| `primer/react` | Use as reference; adopt with caveats for React product UI | MIT, active as of 2026-06-17, 3,860 stars; good fit for compact product surfaces and accessible component states. |
| `assistant-ui/assistant-ui` | Use as reference; adopt with caveats for React assistant surfaces | MIT, active as of 2026-06-17, 10,663 stars; strong fit for chat threads, streaming, tool UI, and assistant-specific interaction patterns. |
| `CopilotKit/CopilotKit` | Use as reference; adopt with caveats for agentic frontends | MIT, active as of 2026-06-17, 35,247 stars; strong fit for generative UI, shared state, and human-in-the-loop flows, but broader than a phase reference. |
| `langchain-ai/agent-chat-ui` | Use as reference only | MIT, active as of 2026-06-13, 2,934 stars; useful for agent conversation surfaces, but specifically shaped around LangGraph server/chat assumptions. |

## Local Reference Clones

Shallow clones are kept outside git in `tmp/maps-m8-references/` for local inspection.

## M8 Build Decision

Build `m8.html` as the Experience Design page after Orchestration Build, and point optional A2 Experience Design to the same page. Add `/design-experience` and `templates/experience-design.md` so the phase can produce a durable artifact before M9 System Evaluate begins.
