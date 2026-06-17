---
name: equip-agent
description: Create the Phase 4 capability map by attaching tools, permissions, memory, connectors, runtime settings, and operating limits to a working agent.
---

# Equip Agent

Use this skill after Phase 3 has produced a working agent and before Phase 5 evaluates reliability and safety.

## Input

- `agents/{agent-handle}/agent-design.md`
- `agents/{agent-handle}/agent-build.md`
- Working agent code, runtime profile, or runtime adapter

## Workflow

1. Identify every capability the working agent needs to operate for real.
2. Map tools, connectors, MCP servers, APIs, databases, files, browser access, and runtime permissions.
3. Define what each capability can read, write, call, spend, retain, or modify.
4. Configure memory or retrieval boundaries.
5. Set API keys, environment variables, rate limits, budgets, scopes, and approval gates.
6. Define fallback behavior for tool, connector, memory, or runtime failures.
7. Record human approval points and forbidden capabilities.
8. Produce or update the capability map.

## Output

- `agents/{agent-handle}/capability-map.md`
- Tool and connector inventory
- Permission and data-access boundaries
- Memory and retrieval configuration
- Runtime settings and fallback behavior
