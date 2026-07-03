# Agent Capability Map

## Input

- Agent design:
- Agent build:
- Target runtime:
- Runtime adapter or profile:
- Research sources:

## Recommendation Summary

- Recommended operating capability model:
- Key assumptions:
- User overrides:
- Deferred capabilities:

## Capability Map Answers

- What tools does this agent have?
- What can each tool do?
- What permissions does each tool require?
- What data can the agent read/write?
- What memory does it use?
- What runtime or adapter settings are required?
- Which capabilities need human approval?
- Which capabilities are forbidden?
- What happens when a tool fails?

## Capability Inventory

| Capability | Tool/Connector | Recommendation | Reasoning | Confidence | User Override |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## Access Matrix

| Capability | Read | Write | Spend/Send/Publish/Delete | Approval Required | Failure Behavior |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## Access And Permissions

- Browser access:
- GitHub repo access:
- Gmail/Slack/Drive connectors:
- Database credentials or read-only views:
- MCP servers:
- Sandbox/runtime permissions:
- API keys and environment variables:

## Runtime Config Details

- Local development secrets (`.env`, `.env.local`, `.dev.vars`, or runtime equivalent):
- Platform runtime secrets:
- CI/CD encrypted secrets:
- Managed secret manager:
- Connector or OAuth token storage:
- Browser-exposed public keys:
- Must cover - scope by environment:
  - Separate dev/staging/production keys:
  - Test agent cannot mutate production systems:
- Must cover - limit blast radius:
  - Read-only scopes:
  - Allowlists, referrer/IP restrictions, spend caps, and tool-specific approval gates:
- Must cover - plan rotation:
  - Secret owner:
  - Rotation schedule:
  - Revocation path:
  - Leak response:
- `.env.example` entries to document required names:

## Memory And Retrieval

- Short-term memory:
- Long-term memory:
- Retrieval sources:
- Retention limits:
- Forget/delete behavior:

## Operating Limits

- Rate limits:
- Budgets:
- Scopes:
- Human approval gates:
- Forbidden capabilities:

## Fallbacks

- Tool failure:
- Connector failure:
- Memory/retrieval failure:
- Runtime failure:
- Escalation path:
