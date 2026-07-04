---
name: cheap-recall
description: Use when working on the Knowledge Retrieval harness and you need a repeatable cost efficiency control: Tries cached embeddings and cheap recall before broad search, bounding retrieval breadth to the context budget.
---

# Cheap Recall

## Harness

- Harness: Knowledge Retrieval
- Axis: Cost Efficiency
- Command: /cheap-recall

## Purpose

Tries cached embeddings and cheap recall before broad search, bounding retrieval breadth to the context budget.

## Use This Skill When

- You are designing or reviewing the Knowledge Retrieval harness.
- You need to tune the cost efficiency boundary without changing the whole system.
- You want a reusable control pattern that can be installed, reviewed, and improved.

## Inputs

- Current objective and project scope.
- The harness behavior being tuned.
- Relevant limits, gates, risks, costs, latency targets, or proof requirements.
- Existing scripts, config, policies, or logs that show how the harness currently behaves.

## Process

1. Identify the controlled boundary for the Knowledge Retrieval harness.
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
