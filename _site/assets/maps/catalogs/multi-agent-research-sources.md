# Multi-Agent Research Sources

Use these references when strengthening M2-M7. Prefer the primary source for the phase question, then cite only the sources actually used in the output artifact.

## Core References

- OpenAI Agents SDK handoffs: https://openai.github.io/openai-agents-python/handoffs/
  - Use for delegation, specialist handoff, and handoff-as-tool design.
- OpenAI Agents SDK guardrails: https://openai.github.io/openai-agents-python/guardrails/
  - Use for input/output guardrails and the warning that handoffs need their own controls.
- OpenAI Agents guide: https://developers.openai.com/api/docs/guides/agents
  - Use for agent definitions, orchestration, human review, state, integrations, and observability.
- A2A Protocol: https://a2aproject.github.io/A2A/latest/
  - Use for agent-to-agent discovery, task delegation, messages, artifacts, and interoperability boundaries.
- MCP specification: https://modelcontextprotocol.io/specification/2025-06-18
  - Use for tool/resource/prompt capability mapping and agent-to-tool boundaries.
- NIST AI RMF Core: https://airc.nist.gov/airmf-resources/airmf/5-sec-core/
  - Use for govern, map, measure, manage risk controls across the multi-agent lifecycle.
- BPMN 2.0 / OMG: https://www.omg.org/spec/BPMN/2.0/About-BPMN
  - Use for workflow tasks, gateways, messages, handoffs, events, and exception paths.
- LangChain multi-agent patterns: https://docs.langchain.com/oss/python/langchain/multi-agent
  - Use for supervisor, subagent, handoff, router, and skill-pattern tradeoffs.
- OpenTelemetry GenAI semantic conventions: https://opentelemetry.io/docs/specs/semconv/gen-ai/
  - Use for traces, model calls, tool calls, token usage, metrics, and observable runtime events.
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
  - Use when M8 depends on M2-M7 outputs becoming user-facing surfaces.

## Phase Fit

- M2 Roster: role pressure, authority, responsibility, human owner, and whether a participant is Role, Role+, Agent, tool, service, or human.
- M3 Contracts: inputs, outputs, authority, memory, tools, handoffs, escalation, stop conditions, and acceptance evidence.
- M4 Coordination: workflow model, message routes, approval gates, retries, failure modes, and who controls routing.
- M5 Agent Buildout: child APS plans, runtime-neutral proof, dependency order, build/no-build decisions, and test-first slices.
- M6 Capabilities: MCP/tool resources, credentials, permissions, data, memory, shared services, fallbacks, and audit needs.
- M7 Orchestration: runtime topology, handoff protocol, state, queues, schedulers, supervisor/society pattern, observability, rollback, and human override.
