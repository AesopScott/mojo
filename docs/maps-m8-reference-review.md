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

Mode: Search/direct hybrid. Repository stars are a point-in-time research signal from 2026-06-17.

### Recommended action

Use two reference shelves. Do not make M8 depend on a UI framework yet. If a later implementation needs a UI dependency, evaluate that specific runtime, target surface, accessibility need, license, bundle impact, and maintenance profile then.

### UI Design Systems

| Repo | Verdict | Evidence |
|---|---|---|
| `shadcn-ui/ui` | Use as reference; adopt only after runtime review | 116,840 stars; strong fit for copy-in React components, accessible primitives, local ownership, and polished SaaS/product UI. |
| `radix-ui/primitives` | Use as reference; adopt with caveats for custom design systems | 18,986 stars; excellent reference for focus, overlays, menus, dialogs, and low-level accessibility behavior. |
| `tailwindlabs/headlessui` | Use as reference; adopt with caveats for Tailwind projects | 28,622 stars; useful for unstyled accessible controls that can inherit the product visual language. |
| `mui/material-ui` | Use as reference; adopt with caveats for Material-style React apps | 98,425 stars; mature coverage for components, navigation, data display, forms, theming, and dense states. |
| `ant-design/ant-design` | Use as reference; adopt with caveats for enterprise apps | 98,374 stars; strong reference for operational workflows, tables, filters, dashboards, confirmations, and enterprise density. |
| `chakra-ui/chakra-ui` | Use as reference; adopt with caveats for SaaS/product UI | 40,441 stars; useful for accessible defaults, themeable controls, and fast product composition. |
| `mantinedev/mantine` | Use as reference; adopt with caveats for broad React UX coverage | 31,266 stars; broad component and utility surface spanning inputs, overlays, layout, charts, and app utilities. |
| `heroui-inc/heroui` | Use as reference; adopt with caveats for modern React/Next UI | 29,651 stars; useful for contemporary styling and NextUI-derived component patterns. |
| `adobe/react-spectrum` | Use as reference; adopt with caveats when accessibility depth matters | 15,541 stars; strong reference for accessibility, adaptive behavior, internationalization, and cross-device rules. |
| `uswds/uswds` | Use as reference only | 7,114 stars; strong reference for accessibility, plain-language service design, responsive guidance, and public trust. |
| `alphagov/govuk-frontend` | Use as reference only | 1,414 stars; excellent fit for service UX, forms, errors, content clarity, and progressive disclosure. |
| `microsoft/fluentui` | Use as reference only | 20,059 stars; useful for dense product interfaces, enterprise controls, theming, and cross-surface component behavior. |
| `primer/react` | Use as reference only | 3,860 stars; good fit for compact developer-product surfaces, accessible component states, navigation, and dialogs. |

### Agent Interaction Surfaces

| Repo | Verdict | Evidence |
|---|---|---|
| `assistant-ui/assistant-ui` | Use as reference; adopt with caveats for React assistant surfaces | 10,666 stars; strong fit for chat threads, streaming, tool UI, and assistant-specific interaction patterns. |
| `CopilotKit/CopilotKit` | Use as reference; adopt with caveats for agentic frontends | 35,251 stars; strong fit for generative UI, shared state, human-in-the-loop flows, and agent activity inside products. |
| `langchain-ai/agent-chat-ui` | Use as reference only | 2,934 stars; useful for running-agent conversation surfaces, but shaped around LangGraph server/chat assumptions. |
| `open-webui/open-webui` | Use as reference only | 142,022 stars; strong reference for full AI product surfaces, model selection, threads, tools, settings, and local-first workflows. |
| `lobehub/lobehub` | Use as reference only | 78,779 stars; useful for organizing agents, workspaces, scheduling, reporting, and agent operations surfaces. |
| `mckaywrigley/chatbot-ui` | Use as reference only | 33,273 stars; useful for model-agnostic chat, conversation organization, and configurable assistant surfaces. |
| `vercel/chatbot` | Use as reference; adopt patterns with runtime review | 20,502 stars; useful for Next.js chat flows, persistence, streaming, artifacts, and Vercel AI SDK integration. |
| `vercel/ai` | Use as reference; adopt with caveats for TypeScript AI apps | 24,934 stars; strong reference for streaming messages, tool calls, generated UI, structured outputs, and AI application state. |
| `Chainlit/chainlit` | Use as reference only | 12,218 stars; useful for rapid conversational AI prototypes, session state, feedback, and evaluation-friendly chat surfaces. |
| `gradio-app/gradio` | Use as reference only | 42,951 stars; useful for demos, controls, multimodal inputs, review queues, and human-in-the-loop AI interfaces. |
| `streamlit/streamlit` | Use as reference only | 44,992 stars; useful for internal dashboards, inspection tools, review surfaces, and fast data-rich AI workflows. |

## Local Reference Clones

Any shallow reference clones are local inspection cache only and stay outside git under `tmp/`.

## M8 Build Decision

Build `m8.html` as the Experience Design page after Orchestration Build, and point optional A2 Experience Design to the same page. Add `/design-experience` and `templates/experience-design.md` so the phase can produce a durable artifact before M9 System Evaluate begins.
