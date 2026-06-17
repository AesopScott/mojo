---
name: deploy-agent
description: Run MAPS Phase 6 Deploy for any target runtime. Use when Codex needs to package an evaluated agent, choose or document a runtime release path, create deployment commands, hand off secrets/config, run preflight and smoke checks, capture release evidence, define rollback, or produce deploy-plan.md and deployment-record.md.
---

# Deploy Agent

Use this skill after Phase 5 has produced `agents/{agent-handle}/eval-report.md` and before Phase 7 Observe.

This is the base Deploy skill. It is runtime-neutral. Use `/deploy-agent++` only when the release path specifically uses GitHub Actions environments to deploy to Cloudflare.

## Input

- `agents/{agent-handle}/agent-brief.md`
- `agents/{agent-handle}/agent-design.md`
- `agents/{agent-handle}/agent-build.md`
- `agents/{agent-handle}/capability-map.md`
- `agents/{agent-handle}/eval-suite.md`
- `agents/{agent-handle}/eval-report.md`
- Working agent code, package, runtime profile, or runtime adapter
- Target runtime account/project/service details when available

## Workflow

1. Read the Phase 5 eval report first. Do not deploy if the eval gate is blocked unless the user explicitly requests a package/specification-only artifact.
2. Restate the release target, runtime, environment, package artifact, manifest or package metadata, entrypoint, required commands, secrets, config, and expected production surface.
3. Research comparable deployment references for the chosen runtime before recommending the release path.
4. Recommend the deployment plan before asking broad questions:
   - target runtime
   - package artifact
   - runtime manifest or package metadata
   - deploy commands
   - secrets/config handoff
   - preflight checks
   - smoke test
   - release evidence
   - rollback plan
   - deployment record
5. Ask the user to accept the recommended release path or override only the parts that are wrong, risky, unavailable, or too expensive.
6. Produce or update `agents/{agent-handle}/deploy-plan.md`.
7. Choose the deployment mode:
   - Executable deploy when the target runtime can be released now.
   - Package-only deploy when the artifact can be built but release is intentionally held.
   - Specification deploy when accounts, secrets, credentials, approvals, runtime access, or deployment pieces are missing.
8. In Executable deploy, run preflight, deploy, smoke test, and record evidence.
9. In Package-only deploy, build or describe the artifact and record the exact release command, required approvals, and deferred release steps.
10. In Specification deploy, record exact commands, missing requirements, missing secrets, missing accounts, missing credentials, missing approvals, fixtures, and manual checks needed to deploy later.
11. Produce or update `agents/{agent-handle}/deployment-record.md`.
12. Prepare Phase 7 Observe handoff notes.

## Deployment Must Cover

- Target runtime: where the evaluated agent will run.
- Package artifact: what ships, where it is built, and how it can be reproduced.
- Runtime manifest or package metadata: how the runtime loads the agent, entrypoint, version, permissions, commands, and required env vars.
- Deploy commands: exact local, CI/CD, platform, or manual commands.
- Secrets/config handoff: where secrets live and which values are runtime secrets versus deploy pipeline secrets.
- Preflight checks: eval gate, build, tests, config validation, secret presence, migration readiness, and rollback readiness.
- Smoke test: the smallest meaningful post-deploy check against the released runtime.
- Release evidence: commit SHA, build ID, artifact, deploy URL, runtime version, config snapshot, command output, and smoke result.
- Rollback plan: previous version, rollback command, owner, trigger, and post-rollback smoke check.
- Deployment record: what actually happened, not what was merely intended.

## Runtime Reference Guidance

- For Python agents, consider Google ADK, OpenAI Agents Python, Cloud Run, containers, serverless functions, or durable workflow hosts.
- For JavaScript/TypeScript agents, consider OpenAI Agents JS, Cloudflare Workers, Node services, package scripts, and CI/CD build output.
- For MCP server packaging, consider MCPB when the deployable artifact should be a portable bundle with `manifest.json`, local server files, capabilities, runtime requirements, and install metadata.
- For durable OpenAI Agents SDK deployments, consider Temporal when the agent needs long-running execution, retries, state persistence, recovery, human-in-the-loop waits, or activity-based tool calls.
- For Cloudflare agents, prefer GitHub-driven deployment through `/deploy-agent++` when repo and credentials are available.
- For OpenClaw, verify gateway setup, daemon mode, `openclaw.json`, routing bindings, skills, channels, and provider config.
- For Hermes, verify install/update path, gateway or desktop distribution, providers, channel surfaces, remote backend sync, and GitHub integration.
- For Electron, verify packaging tool, signing, GitHub Releases or artifact host, update metadata, and auto-update constraints.

## Output

- `agents/{agent-handle}/deploy-plan.md`
- `agents/{agent-handle}/deployment-record.md`
- Deployment mode decision and rationale
- Release gate decision: deployed, conditional, package-only, specification-only, rolled back, or blocked
- Phase 7 Observe handoff notes
