# Vik / ASPA Deployment Record

Status: not deployed.

This deployment record is a planning artifact only. It does not activate or deploy Vik.

## 1. Runtime Target

Selected runtime adapter: local Python runner for current proof harness.

Rationale: Vik already has `agents/vik-aspa/runtime/aspa_runtime.py` and local unit tests. This is the safest current adapter for contract loading, denied-action classification, and fail-closed proof.

Deferred adapters:

- Codex or Claude CLI operator runtime: useful for supervised drafting, not approved as autonomous runtime.
- Cloudflare/OpenAI Agents SDK: deferred until state, audit, secrets, and deployment controls are approved.

## 2. Deployment State

| Field | Value |
|---|---|
| Package built | no |
| Runtime deployed | no |
| Scheduler installed | no |
| Production access | no |
| Secrets configured | no |
| External connectors enabled | no |
| Git/release approval | not requested |

## 3. Required Approval Before Deploy

- Scott: final activation and production authority.
- Vik: architecture/control-plane fit.
- Reid: any Git/GitHub/release/production promotion.
- Mae: any channel/external communication behavior.

## 4. Preflight Checklist

- Canonical `Autonomy.md` loads.
- Runtime tests pass.
- Shared strict-intent tests pass.
- State schema selected.
- Audit log path selected.
- Rollback and revocation procedure proven.
- Observation plan accepted.
- Promotion review completed.
- Scott explicitly approves activation.

## 5. Rollback

Rollback target before any future deploy:

- Disable runtime or scheduler.
- Preserve state and audit.
- Revert approved files through normal source-control or backup process.
- Notify Scott and owner routes.

## 6. Version And Changelog

Version: 1.0

| Date | Version | Change | Owner |
|---|---|---|---|
| 2026-06-21 | 1.0 | Created no-deploy record for Vik AUTO-020 hardening | Tess |
