---
name: lifecycle-hooks
description: "Use when working on the Session Manager harness and you need capability control: Exposes recovery-strategy scripts, worktree-isolation rules, and open/close lifecycle hooks for custom session behavior."
---

# Lifecycle Hooks

## Harness

- Harness: Session Manager
- Axis: Capability
- Command: /lifecycle-hooks

## What This Skill Does

Exposes recovery-strategy scripts, worktree-isolation rules, and open/close lifecycle hooks for custom session behavior.

Changing this harness changes session continuity: when sessions open, suspend, resume, migrate, recover, or close, and whether those lifecycle moves happen automatically or wait at a gate.

This is a working harness-control runbook. Use it to inspect the current boundary, choose a small control change, define tests, and produce an implementation-ready patch plan.

## Use This Skill When

- You are changing or reviewing the Session Manager harness.
- You need to add a controlled capability without expanding authority by accident.
- You need a bounded change that can be tested before it affects real users, money, secrets, production, or external systems.

## Required Inputs

- Current objective or task the harness must support.
- Current config, script, prompt, policy, UI, queue, route, or workflow that controls this boundary.
- One concrete failure, bottleneck, cost problem, missing capability, or operator complaint.
- Existing logs, traces, screenshots, examples, diffs, or event records if available.
- Authority limit: what the skill may change without human approval.

## Quick Start

1. Name the exact boundary: `Session Manager` / `Capability`.
2. Answer: What capability is missing, and what authority boundary must contain it?
3. Pick one lever from the list below.
4. Propose the smallest rule, config, script, checklist, UI, prompt, or test change that moves that lever.
5. Run or define one positive test and one boundary test.
6. Stop and escalate if the change touches secrets, spending, production, customer communication, deletion, access control, legal/medical/HR decisions, or public claims.

## Control Levers

- Recovery strategy (script)
- Worktree-isolation rules
- Lifecycle hooks

## Basic Procedure

1. Inspect current state. Identify the file, prompt, API route, policy, config, data source, queue, or human step that currently owns the boundary.
2. Write the observed failure mode in one sentence: "Lifecycle Hooks is needed because ..."
3. Choose one lever only. Avoid combining multiple behavior changes unless the first change cannot work alone.
4. Define the control change as one of: config value, allowlist/denylist, checklist, test, prompt clause, route rule, UI affordance, script, policy gate, or log field.
5. Define allowed behavior and blocked behavior. The blocked behavior is mandatory for capability and safety-related changes.
6. Add observability: log, trace, counter, screenshot, audit note, or before/after measurement.
7. Verify locally or in dry-run first. Use mocked data if live execution would spend money or affect users.
8. Produce an implementation handoff with exact files, exact tests, rollback path, and approval gate.

## Verification

Use this minimum evidence before trusting the change:

- Evidence type: a passing allowed-case test and a passing denied-case boundary test.
- Positive test: a normal request uses `Lifecycle Hooks` and produces the expected controlled behavior.
- Boundary test: an overreach, missing-input, unsafe, expensive, or unsupported request is blocked, downgraded, or escalated.
- Regression check: existing Session Manager behavior that should not change still works.
- Rollback check: previous behavior can be restored by reverting the specific rule, config, script, prompt, or file.

## Output Format

Return this structure:

```markdown
## Lifecycle Hooks Harness Update

Boundary: Session Manager / Capability
Problem: <one sentence>
Selected lever: <one lever>
Change: <smallest concrete change>
Files or systems touched: <paths, configs, tools, policies, or human steps>
Allowed behavior: <what may happen>
Blocked behavior: <what must not happen>
Verification: <positive test, boundary test, regression check>
Evidence captured: <logs, traces, screenshots, costs, timings, or audit records>
Rollback: <how to undo>
Approval needed: <none or specific human gate>
```

## Safety

Do not grant new runtime authority, spend money, deploy, modify secrets, delete data, contact external users, change access control, or bypass approval gates unless the operator explicitly authorizes that action. If authority is unclear, stop with a blocker question and state the exact approval needed.
