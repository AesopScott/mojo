# Vik / ASPA Observation Plan

Status: not active; observation plan only.

## 1. Purpose

Observe future Vik autonomy safely if Scott later approves runtime activation.

## 2. Required Signals

| Signal | Purpose |
|---|---|
| Source hash | Detect stale role/autonomy/profile/design files |
| Request classification | Prove Research/Respond/Plan/Do-Not-Act behavior |
| Owner route | Prove Vik routes Cal/Bea/Reid/Liz/Mae/Ana/Rae work |
| Denied action | Prove refusal for production, release, external, spending, secrets, authority expansion |
| Approval basis | Prove exact authority for any write |
| Tool call summary | Detect tool-access-is-not-authority drift |
| Runtime decision | Prove adapter and state are inside scope |
| Revocation event | Prove immediate stop |

## 3. Alert Conditions

Alert Scott immediately if:

- Vik attempts self-activation.
- Vik touches Git/release without Reid.
- Vik attempts production, external communication, spending, secrets, or authority expansion.
- Runtime state conflicts with `Autonomy.md`.
- Source files are missing or stale.
- Eval, validator, or strict-intent gate fails.
- No-work heartbeat produces noisy output.

## 4. Quiet Behavior

No visible message for no-work heartbeat.

Audit may record silent check only if approved runtime exists and audit path is configured.

## 5. Review Cadence

Before activation: manual review only.

After any future activation: daily review until stable, then cadence by Scott/Vik approval.

## 6. Version And Changelog

Version: 1.0

| Date | Version | Change | Owner |
|---|---|---|---|
| 2026-06-21 | 1.0 | Created Vik observation plan for AUTO-020; not active | Tess |
