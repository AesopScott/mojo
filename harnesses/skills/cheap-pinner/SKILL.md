---
name: cheap-pinner
description: "Control model cost for an Identity harness or model router by pinning the cheapest sufficient provider/model/version, defining task-to-model routing, fallback rules, telemetry, tests, rollback, and approval gates. Use when changing or reviewing model selection, model pinning, AI spend, token/call waste, routing policies, or reproducibility controls."
---

# Cheap Pinner

Use this skill to make a small, testable model-selection change that lowers cost without silently reducing required capability.

## Boundary

- Harness: Identity
- Axis: Cost efficiency
- Command: `/cheap-pinner`
- Primary control: pin the cheapest sufficient model version when capability allows.

Pin exact provider, model, and version where the harness supports it. Avoid aliases such as `latest`, `default`, or unversioned model names when reproducibility matters.

## Required Inputs

- Current objective the harness must support.
- Current config, route, prompt, script, queue, workflow, or policy that selects models.
- One concrete cost problem, waste pattern, bottleneck, or operator complaint.
- Existing logs, traces, screenshots, diffs, examples, or event records when available.
- Authority limit: what may change without human approval.

If any required input is missing, inspect the repo or local artifacts first. Ask one blocker question only when the missing input cannot be inferred safely.

## Procedure

1. Name the exact boundary: `Identity / Cost efficiency`.
2. Identify the current model owner: config file, route rule, prompt clause, policy, SDK wrapper, queue worker, or human checklist.
3. Write the failure mode in one sentence: `Cheap Pinner is needed because ...`
4. Classify the task using the decision matrix below.
5. Choose one lever only: model pin, route rule, fallback rule, telemetry field, test, approval gate, or rollback switch.
6. Define allowed behavior and blocked behavior.
7. Add telemetry or evidence capture before trusting the change.
8. Verify locally or in dry-run first. Use mocked calls if live execution would spend money or affect users.
9. Produce an implementation handoff with exact files, tests, rollback path, and approval gate.

## Decision Matrix

Use the cheapest pinned model that meets the minimum capability. Escalate only on defined signals.

| Task type | Minimum capability | Default route | Escalate when |
| --- | --- | --- | --- |
| Classification, tagging, routing | Low reasoning, short context | Cheapest small pinned model | Confidence below threshold, missing required label, policy uncertainty |
| Extraction, normalization, dedupe | Low-medium reasoning, structured output | Cheapest small or medium pinned model | Invalid schema, low confidence, ambiguous source, repeated validation failure |
| Summarization, rewrite, simple drafting | Low-medium reasoning, medium context | Cheapest sufficient pinned model | Context exceeds limit, named-entity risk, user-facing quality failure |
| Code search, small code edits, config edits | Medium reasoning, tool use | Medium pinned model | Tests fail twice, broad refactor needed, security-sensitive code |
| Architecture, debugging, complex code changes | High reasoning, tool use | Strong pinned model | No cheaper route unless validated by existing evals |
| Security, legal, medical, HR, finance, public claims | High accuracy and policy care | Approved strong pinned model | Always require approval before cheap downgrade |
| Production action, secrets, access control, deletion, external communication | High authority risk | Human-approved route | Do not cheap-downgrade without explicit approval |

## Pin Format

Prefer an explicit policy object or equivalent config. Adapt names to the repo's existing conventions.

```json
{
  "model_policy": {
    "allow_unpinned": false,
    "default": "provider/model-version",
    "routes": {
      "cheap": "provider/cheap-model-version",
      "standard": "provider/standard-model-version",
      "strong": "provider/strong-model-version"
    },
    "fallback": {
      "cheap": "standard",
      "standard": "strong"
    }
  }
}
```

If the codebase already has a model registry, add the pin there instead of inventing a parallel config.

## Routing Rule Pattern

Define routing as a deterministic rule before calling a model.

```pseudo
if task.risk in ["security", "legal", "medical", "hr", "finance", "public_claim", "production_action"]:
    route = "strong"
elif task.requires_code_edit or task.requires_tool_use:
    route = "standard"
elif task.is_reversible and task.has_validation:
    route = "cheap"
else:
    route = "standard"

model = model_policy.routes[route]
```

Do not route by cost alone. Route by required capability, validation strength, reversibility, and authority risk.

## Fallback Rule

Try the cheaper pinned model only when the task is reversible, low risk, and has validation. Escalate to the next pinned route when any of these occur:

- Required output fields are missing.
- Schema validation fails.
- Confidence is below the configured threshold.
- The model refuses, times out, or returns unusable output.
- Local tests fail twice after model-generated code changes.
- Context length exceeds the cheaper model's safe capacity.
- User-visible quality risk is higher than the expected savings.

Log every fallback. Silent fallback hides cost and reproducibility drift.

## Telemetry

Capture enough data to prove cost changed and behavior stayed acceptable.

Required fields:

- `model_requested`
- `model_selected`
- `model_version`
- `route`
- `route_reason`
- `input_tokens`
- `output_tokens`
- `estimated_cost`
- `actual_cost` when available
- `fallback_used`
- `validation_result`
- `approval_gate`

Evidence must include at least one before/after cost, token count, call count, review volume, rejected waste count, or timing measurement.

## Tests

Minimum test set:

- Positive test: a normal low-risk request uses the cheap pinned route and passes validation.
- Boundary test: an unsafe, unsupported, high-risk, or missing-input request is blocked, escalated, or approval-gated.
- Fallback test: a cheap-route validation failure escalates to the configured fallback route and logs the reason.
- Regression test: existing Identity behavior that should not change still works.
- Rollback test: previous behavior returns by reverting the specific rule, config, script, prompt, or feature flag.

Use mocked providers unless live calls are explicitly approved.

## Implementation Handoff

Return this structure:

```markdown
## Cheap Pinner Harness Update

Boundary: Identity / Cost efficiency
Problem: <one sentence>
Selected lever: <model pin | route rule | fallback rule | telemetry field | test | approval gate | rollback switch>
Decision matrix row: <task type and minimum capability>
Change: <smallest concrete change>
Model policy: <provider/model-version pins or existing registry entry>
Files or systems touched: <paths, configs, tools, policies, or human steps>
Allowed behavior: <what may happen>
Blocked behavior: <what must not happen>
Fallback behavior: <when and where to escalate>
Telemetry: <fields, logs, traces, screenshots, costs, timings, or audit records>
Verification: <positive, boundary, fallback, regression, rollback>
Evidence captured: <before/after measurement>
Rollback: <how to undo>
Approval needed: <none or specific human gate>
```

## Codex Use

To make this skill discoverable by Codex, install it as:

```text
C:\Users\scott\.codex\skills\cheap-pinner\SKILL.md
```

The downloaded standalone file can be reviewed manually, but Codex discovers skills from skill folders. The folder name must match the skill name.

## Safety

Do not grant new runtime authority, spend money, deploy, modify secrets, delete data, contact external users, change access control, or bypass approval gates unless the operator explicitly authorizes that action.

If authority is unclear, stop with one blocker question and state the exact approval needed.
