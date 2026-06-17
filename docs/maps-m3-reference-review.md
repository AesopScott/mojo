# MAPS M3 Experience Design Review

Date: 2026-06-17

## Existing Phase Review

| Phase | What is working | M3 implication |
|---|---|---|
| Phase 0 Alignment | Establishes the two-layer MAPS structure and keeps M layer and APS layer separate. | M3 should be a real M-layer page while optional A2 shares the same artifact when no M layer exists. |
| Phase 1 Define | Captures one agent's job, user, scope, authority, success, failure, risks, and escalation. | M3 can feed user-facing constraints, care text, and visibility requirements back into agent briefs. |
| Phase 2 Design | Produces an agent design, runtime/adapter notes, proof gates, and build backlog. | M3 should provide journeys, surfaces, IA, interaction states, accessibility, and agent visibility rules before Build. |
| Phase 3 Build | Builds from a dependency-aware backlog and proof plan. | M3 prevents Build from inventing product UX after implementation has started. |
| Phase 4 Equip | Defines tools, permissions, memory, connectors, secrets, limits, and fallbacks. | M3 should decide how tool use, memory, approvals, refusals, and fallbacks appear to users. |
| Phase 5 Evaluate | Creates eval suites/reports and distinguishes executable versus specification evidence. | M3 should add journey, state, accessibility, and trust scenarios to eval coverage. |
| Phase 6 Deploy | Packages and releases with runtime metadata, smoke checks, evidence, and rollback. | M3 should identify the production surface and smallest recognizable user smoke path. |
| Phase 7 Observe | Tracks runtime evidence, quality, cost, incidents, and improvement signals. | M3 should define feedback moments and user-visible signals worth observing. |
| Phase 8 Improve | Converts evidence into prioritized, routed backlog items. | M3 should help classify UX, IA, content, accessibility, and state-model improvements. |

## Evaluation: M3 Experience Design References

Mode: Search/direct hybrid

### Recommended action

Use all listed repos as references. Do not make M3 depend on a UI framework yet. If a later implementation needs a UI dependency, evaluate that specific runtime and product surface then.

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

Shallow clones are kept outside git in `tmp/maps-m3-references/` for local inspection.

## M3 Build Decision

Build `m3.html` as the first concrete M-layer page, and point optional A2 Experience Design to the same page. Add `/design-experience` and `templates/experience-design.md` so the phase can produce a durable artifact before APS Build begins.
