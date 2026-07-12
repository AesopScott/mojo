---
name: speed-matcher
description: "Use when working on the Select harness and you need performance control: Weights capability matching toward faster candidates when task quality permits."
---

# Speed Matcher

## Harness

- Harness: Select
- Axis: Performance
- Command: /speed-matcher

## What This Skill Does

Weights capability matching toward faster candidates when task quality permits.

Changing this harness changes candidate choice: how task type, capability, price tier, latency, and trust are weighted before the system decides which model should handle the request.

This is a working harness-control runbook. Use it to inspect the current boundary, choose a small control change, define tests, and produce an implementation-ready patch plan.

## Use This Skill When

- You are changing or reviewing the Select harness.
- You need to reduce latency, friction, repeated work, or blocked throughput.
- You need a bounded change that can be tested before it affects real users, money, secrets, production, or external systems.

## Required Inputs

- Current objective or task the harness must support.
- Current config, script, prompt, policy, UI, queue, route, or workflow that controls this boundary.
- One concrete failure, bottleneck, cost problem, missing capability, or operator complaint.
- Existing logs, traces, screenshots, examples, diffs, or event records if available.
- Authority limit: what the skill may change without human approval.

## Quick Start

1. Name the exact boundary: `Select` / `Performance`.
2. Answer: What path is currently slow, repeated, blocking, or over-synchronized?
3. Pick one lever from the list below.
4. Propose the smallest rule, config, script, checklist, UI, prompt, or test change that moves that lever.
5. Run or define one positive test and one boundary test.
6. Stop and escalate if the change touches secrets, spending, production, customer communication, deletion, access control, legal/medical/HR decisions, or public claims.

## Control Levers

- Capability-match weighting toward speed

## Basic Procedure

1. Inspect current state. Identify the file, prompt, API route, policy, config, data source, queue, or human step that currently owns the boundary.
2. Write the observed failure mode in one sentence: "Speed Matcher is needed because ..."
3. Choose one lever only. Avoid combining multiple behavior changes unless the first change cannot work alone.
4. Define the control change as one of: config value, allowlist/denylist, checklist, test, prompt clause, route rule, UI affordance, script, policy gate, or log field.
5. Define allowed behavior and blocked behavior. The blocked behavior is mandatory for capability and safety-related changes.
6. Add observability: log, trace, counter, screenshot, audit note, or before/after measurement.
7. Verify locally or in dry-run first. Use mocked data if live execution would spend money or affect users.
8. Produce an implementation handoff with exact files, exact tests, rollback path, and approval gate.

## Verification

Use this minimum evidence before trusting the change:

- Evidence type: before/after timing, queue depth, stall count, retry count, or operator wait time.
- Positive test: a normal request uses `Speed Matcher` and produces the expected controlled behavior.
- Boundary test: an overreach, missing-input, unsafe, expensive, or unsupported request is blocked, downgraded, or escalated.
- Regression check: existing Select behavior that should not change still works.
- Rollback check: previous behavior can be restored by reverting the specific rule, config, script, prompt, or file.

## Output Format

Return this structure:

```markdown
## Speed Matcher Harness Update

Boundary: Select / Performance
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
