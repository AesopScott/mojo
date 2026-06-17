---
name: equip-agent
description: Run Research and Recommend for Phase 4, then create the capability map for tools, permissions, memory, connectors, runtime settings, operating limits, and fallback behavior.
---

# Equip Agent

Use this skill after Phase 3 has produced a working agent and before Phase 5 evaluates reliability and safety.

This skill must not become a blank questionnaire. It should research and recommend the first capability map, then ask the user to accept or override the specific recommendations.

## Input

- `agents/{agent-handle}/agent-design.md`
- `agents/{agent-handle}/agent-build.md`
- Working agent code, runtime profile, or runtime adapter

## Workflow

1. Read the agent design, build artifact, target runtime, runtime profile or adapter, and existing code/config.
2. Restate the agent's job, first working loop, runtime target, and authority boundary.
3. Research comparable capability patterns, tool integrations, connector models, memory/retrieval approaches, permission patterns, and runtime configuration guidance.
4. Recommend the capability map:
   - tools and connectors
   - MCP servers or native integrations
   - browser, repo, mail, chat, drive, database, file, and API access
   - short-term memory, long-term memory, retrieval, retention, and delete behavior
   - runtime permissions, sandbox settings, secrets, and environment variables
   - rate limits, budgets, scopes, and approval gates
   - fallback behavior for each tool, connector, memory, or runtime failure
   - forbidden capabilities
5. For each recommendation, record reasoning, assumptions, confidence, and risk.
6. Ask the user to accept the recommended capability map or override only the parts that are wrong, risky, missing, or too broad.
7. Apply user overrides.
8. Produce or update the capability map.

## Recommendation Rules

- Prefer least privilege over broad access.
- Recommend read-only access before write access unless the working loop requires writes.
- Recommend sandbox or test credentials before production credentials.
- Recommend explicit human approval for money movement, external messages, publishing, deletion, production writes, sensitive data access, and irreversible actions.
- Prefer MCP servers or connector standards when they reduce custom integration work without weakening security.
- Do not invent a tool requirement if the Phase 3 build does not need it.
- If a capability is likely needed later but not needed for the current working loop, mark it as deferred.

## Output

- `agents/{agent-handle}/capability-map.md`
- Recommended capability map with user overrides
- Tool and connector inventory
- Permission and data-access boundaries
- Memory and retrieval configuration
- Runtime settings and fallback behavior
