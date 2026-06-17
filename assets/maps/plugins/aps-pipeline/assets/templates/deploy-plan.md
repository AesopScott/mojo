# Agent Deploy Plan

## Input

- Agent brief:
- Agent design:
- Agent build:
- Capability map:
- Eval report:
- Target runtime:
- Runtime adapter or profile:
- Research sources:

## Recommendation Summary

- Recommended release path:
- Deployment mode:
- Base skill used:
- Wrapper skill used:
- Key assumptions:
- User overrides:
- Deferred deployment work:

## Deployment Coverage

| Deploy Area | Decision | Evidence Required | Owner | Status |
|---|---|---|---|---|
| Target runtime |  |  |  |  |
| Package artifact |  |  |  |  |
| Manifest/package metadata |  |  |  |  |
| Deploy commands |  |  |  |  |
| Secrets/config handoff |  |  |  |  |
| Preflight checks |  |  |  |  |
| Smoke test |  |  |  |  |
| Release evidence |  |  |  |  |
| Rollback plan |  |  |  |  |

## Runtime Package

- Artifact path:
- Version:
- Commit SHA:
- Build command:
- Entrypoint:
- Manifest or package metadata:
- Required runtime files:

## Secrets And Config

- Runtime secrets:
- CI/CD deployment secrets:
- Local development env vars:
- Managed secret store:
- Connector/OAuth token store:
- Environment scopes:
- Rotation/revocation notes:

## GitHub And Cloudflare

- GitHub workflow:
- GitHub environment:
- Required GitHub secrets:
- Cloudflare project/service:
- Cloudflare account:
- Wrangler config:
- Manual Wrangler commands being replaced:

## Preflight

- Eval gate:
- Tests:
- Build:
- Config validation:
- Secret presence:
- Migration/binding readiness:
- Rollback readiness:

## Smoke Test

- Production URL:
- Health endpoint:
- Command:
- Expected result:
- Failure behavior:

## Rollback

- Previous version:
- Rollback command:
- Dashboard rollback path:
- Owner:
- Trigger:
- Post-rollback smoke test:
