---
name: deploy-agent-plus-plus
description: Run MAPS Phase 6 Deploy by wrapping /deploy-agent with GitHub Actions environments and Cloudflare deployment automation. Use when Codex needs GitHub to deploy a Cloudflare Pages, Workers, or Agents project; replace manual Wrangler deploys; configure workflow gates, encrypted secrets, smoke tests, release evidence, and rollback records.
---

# Deploy Agent++

Use this skill when the target release path is Cloudflare and deployment should be owned by GitHub Actions instead of manual local Wrangler commands.

This skill extends `/deploy-agent`. It does not replace the base Deploy coverage: target runtime, package artifact, runtime manifest/package metadata, deploy commands, secrets/config handoff, preflight checks, smoke test, release evidence, rollback plan, and deployment record must still be covered.

## References To Cite

When producing a deploy plan or recommending a workflow, cite the relevant references:

- GitHub Actions environments for environment secrets, protection rules, branch restrictions, and approvals.
- GitHub deployment protection rules for release gates.
- Cloudflare Workers SDK/Wrangler for deploy commands, Pages/Workers project behavior, and secret handling.
- Cloudflare Workers versions, deployments, and rollbacks for release and rollback evidence.
- Cloudflare Agents SDK when the deployed runtime is a Cloudflare Agent.

## Input

- All `/deploy-agent` inputs
- `.github/workflows/*`
- `wrangler.toml`, `wrangler.json`, or `wrangler.jsonc`
- `package.json` scripts
- Cloudflare Pages/Workers project name
- Cloudflare account ID and API token secret names
- Existing manual Wrangler commands or deploy notes
- Target branch and GitHub environment name

## Workflow

1. Run the base `/deploy-agent` workflow first through release-path recommendation.
2. Confirm the repository is a Cloudflare target:
   - Cloudflare Pages indicators: `_headers`, `_redirects`, `functions/`, Pages deploy command, or Pages project notes.
   - Cloudflare Workers indicators: `wrangler.*`, Workers entrypoint, bindings, Durable Objects, KV, R2, D1, Queues, Workflows, or Agents SDK.
3. Prefer GitHub Actions deployment over manual `wrangler deploy` or `wrangler pages deploy` when credentials and repo access are available.
4. Inspect existing workflows before proposing a new one.
5. Recommend the GitHub deployment path:
   - trigger: usually push to `main`, plus optional manual `workflow_dispatch`
   - GitHub environment: usually `production`
   - required secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, plus project-specific deploy secrets
   - runtime secrets: set in Cloudflare, not baked into repository files
   - preflight: install, build, tests, lint/typecheck if available, config validation
   - deploy: `cloudflare/wrangler-action` or `npx wrangler ...`
   - smoke test: production URL or health endpoint
   - evidence: run ID, commit SHA, deployment URL, version ID where available
   - rollback: Cloudflare dashboard or `wrangler rollback` for Workers where supported
6. Produce or update `agents/{agent-handle}/deploy-plan.md` and `agents/{agent-handle}/deployment-record.md`.
7. If asked to modify a repo, create or update `.github/workflows/deploy.yml` conservatively and keep secrets as named placeholders.
8. Do not commit Cloudflare account IDs or API tokens unless the repository already treats the account ID as non-secret configuration and the user confirms.

## GitHub Environment Guidance

- Use environment secrets for deploy-time credentials.
- Use deployment protection rules for manual approvals, branch restrictions, or external quality gates when risk justifies it.
- Keep production deployment on protected branches.
- Include a manual dispatch path for emergency redeploys or rollbacks when appropriate.
- Record the GitHub run ID and environment name in the deployment record.

## Cloudflare Guidance

- For Workers, use `wrangler deploy` and record version/deployment details when available.
- For Pages, use `wrangler pages deploy` or the established Pages workflow for the project.
- For Cloudflare Agents SDK, preserve bindings, Durable Object migrations, stateful storage, scheduled tasks, and channel-specific configuration.
- Store runtime secrets in Cloudflare runtime secrets, not in `.env` or GitHub workflow logs.
- Store deployment credentials in GitHub encrypted secrets or environment secrets.
- Document rollback commands and dashboard rollback path.

## Output

- Base Deploy outputs
- GitHub Actions environment recommendation
- Cloudflare deployment workflow recommendation or updated workflow
- Required GitHub secrets and Cloudflare runtime secrets
- Manual Wrangler commands replaced or retained with rationale
- Smoke test command and evidence
- Rollback command or dashboard rollback instructions
