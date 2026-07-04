---
name: version-allowlist
description: Use when working on the Identity harness and you need a repeatable capability control: Maintains a version allowlist and identity-record schema so only approved model versions run.
---

# Version Allowlist

## Harness

- Harness: Identity
- Axis: Capability
- Command: /version-allowlist

## Purpose

Maintains a version allowlist and identity-record schema so only approved model versions run.

## Use This Skill When

- You are designing or reviewing the Identity harness.
- You need to tune the capability boundary without changing the whole system.
- You want a reusable control pattern that can be installed, reviewed, and improved.

## Inputs

- Current objective and project scope.
- The harness behavior being tuned.
- Relevant limits, gates, risks, costs, latency targets, or proof requirements.
- Existing scripts, config, policies, or logs that show how the harness currently behaves.

## Process

1. Identify the controlled boundary for the Identity harness.
2. State the current failure mode or opportunity in one sentence.
3. Choose the smallest rule, script, config, or checklist that changes that boundary.
4. Define how the change will be verified before it is trusted.
5. Document what blocks, escalates, or requires human review.

## Output

Return a concise harness update with:

- Boundary controlled.
- Proposed change.
- Expected benefit.
- Required proof.
- Failure or rollback behavior.

## Safety

Do not grant new runtime authority, spend money, deploy, modify secrets, or bypass approval gates unless the operator explicitly authorizes that action.
