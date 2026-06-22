# Vik Architecture Backlog

Status: Active architecture backlog; not an autonomous execution queue
Owner: Vik / MAPS ASPA
Final authority: Scott
Created: 2026-06-21
Source prompt: Scott requested an architecture backlog seeded from the "20 Practical Agentic AI Use Cases in 5 Cybersecurity Domains" infographic by NothingCyber / Dr. Meisam Eslahi.

## Purpose

This backlog turns external agentic-AI use cases into research, evaluation, and architecture prompts for Vik's future automation.

It does not authorize implementation, deployment, scanning, security tooling, production access, external communication, or autonomous action. When Vik's automation is working, this backlog becomes a research queue and evaluation source for improving Mojo's agentic architecture, especially around authority gates, runtime controls, memory quality, telemetry, and stop conditions.

## Operating Rule

When operating inside approved Vik automation, use this backlog to:

1. Select one research item at a time.
2. Research the architecture pattern, failure modes, and guardrails.
3. Classify the result as role, skill, script, hook, loop, active process, or agent.
4. Recommend whether Mojo/MAPS needs a backlog item, eval, validator, policy, template, or runtime gate.
5. Write only analysis, recommendation, or approved memory notes unless Scott grants operational approval.

## Automation Fit Summary

| Domain | Main Relevance To Vik Automation | Primary Risk | Architecture Use |
| --- | --- | --- | --- |
| Threat Hunting & Intelligence | Continuous signal ingestion, correlation, anomaly handling, and escalation discipline | False positives, noisy telemetry, over-trust | Heartbeat/file-watch classification, evidence scoring, escalation gates |
| SOC Operations & Incident Response | Triage, incident orchestration, phishing/ransomware response, approval workflows | Automated containment or over-action | Stop conditions, human approval gates, role handoffs |
| Engineering, Architecture & Enrichment | Parsing, rule tuning, analyst copilots, reverse-engineering support | Unsafe execution, bad recommendations, blind spots | Validators, safe tool wrappers, recommendation-only modes |
| Offense, Exposure & Deception | Discovery, validation, blast-radius analysis, red-team automation | Unauthorized scanning, operational disruption | Strict scope control, lab-only execution, release/security gates |
| Identity, Cloud & Compliance | Identity signals, cloud config, policy mapping, compliance evidence | Unsafe remediation, stale policy, sensitive access | Config memory, compliance RAG, approval-gated remediation |

## Backlog Items

| ID | Source Use Case | Research Question | Vik Automation Analysis | Likely Architecture Output | Required Gate Or Eval | Priority | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| VA-001 | Autonomous threat hunting | How should an agent continuously inspect multiple sources without inventing urgency or drowning operators in noise? | Mirrors heartbeat/file-watch automation: ingest signals, classify novelty, correlate with memory, and escalate only when concrete changed-file work or risk exists. | Heartbeat evidence-scoring model and quiet/noisy notification policy. | Eval for false-positive suppression, audit trace, and escalation threshold. | P1 | Open |
| VA-002 | AI-assisted threat intelligence correlation | How should an agent combine weak indicators from multiple sources into a useful recommendation? | Useful for connecting role memory, handoff channels, release decisions, Obsidian notes, and repo state without treating any single source as authority. | Source reputation and conflict-resolution rubric. | Eval for contradictory sources and stale memory. | P1 | Open |
| VA-003 | Automated security telemetry analysis | How should telemetry be filtered before an agent acts on it? | Directly maps to future Vik observe loop: large event streams need prioritization, deterministic filters, and bounded AI interpretation. | Telemetry intake schema for role/automation events. | Eval for noisy telemetry and missing context. | P2 | Open |
| VA-004 | Behavioral baseline monitoring | How should a role detect behavior drift without mistaking normal change for a violation? | Relevant to detecting role drift, authority drift, memory-size drift, and channel-ownership drift. | Role behavior baseline and drift-review checklist. | Eval for normal vs abnormal behavior deltas. | P1 | Open |
| VA-005 | AI SOC triage assistant | How should an agent triage alerts while preserving analyst control? | Maps to Vik backlog triage: classify issues by owner, authority, risk, urgency, and proof without taking over execution. | Architecture triage rubric for MAPS/role issues. | Eval for missed high-risk item and over-escalation. | P1 | Open |
| VA-006 | Multi-step incident investigation | How should an agent coordinate a multi-step investigation without wandering? | Useful for goal-driven architecture investigations: each step needs scope, evidence, next question, and stop condition. | Investigation workflow template for architecture incidents. | Eval for scope creep and unresolved owner handoff. | P1 | Open |
| VA-007 | Automated phishing and social engineering analysis | How should an agent analyze messages safely without performing broad automated response? | Maps to communications/handoff safety: classify suspicious requests, authority escalation attempts, and impersonation-like instructions. | Internal-message risk classifier recommendation. | Eval for authority-bypass attempts and false trust. | P2 | Open |
| VA-008 | Ransomware early detection and response | How should an agent detect urgent destructive risk while still requiring approval for containment? | Useful as a model for destructive-change prevention: broad deletes, resets, moves, or gate modifications should trigger hard stops. | Destructive-action guardrail and emergency escalation pattern. | Eval for destructive command blocking and escalation. | P0 | Open |
| VA-009 | AI malware reverse-engineering assistant | How should AI assist high-risk technical analysis without executing unsafe artifacts? | Maps to safe analysis of hooks/scripts/runtime adapters: inspect, decompose, explain, and recommend without executing unknown behavior. | Safe-static-analysis policy for scripts/hooks. | Eval for refusing unsafe execution and preserving evidence. | P2 | Open |
| VA-010 | Autonomous log enrichment and parsing | How should logs be normalized into usable memory without corrupting meaning? | Directly relevant to Obsidianify, role-memory rollover, audit logs, and future automation traces. | Log-to-memory classification schema. | Eval for valuable/not-valuable and type classification quality. | P0 | Open |
| VA-011 | Continuous detection rule tuning | How should an agent tune rules without creating blind spots? | Maps to validators and gates: rules need regression cases before edits, and tuning must not silently weaken safety. | Validator-regression policy and rule-change proof matrix. | Eval for weaker rule rejection and approval routing. | P0 | Open |
| VA-012 | AI security copilot for analysts | What guardrails keep a copilot helpful without executing unsafe actions? | Maps to Vik's primary mode: research, recommend, draft, route; no execution without authority. | Copilot-mode contract for Role+ agents. | Eval for recommendation/action separation. | P0 | Open |
| VA-013 | Attack surface discovery agents | How should discovery stay within approved scope? | Maps to repo/project isolation and source-root boundaries: no cross-project inspection without named approval. | Scope-validation gate for project/file discovery. | Eval for denied cross-project read/write. | P0 | Open |
| VA-014 | Autonomous vulnerability validation | How should validation distinguish safe checking from exploit-like action? | Useful for testing gate behavior, validators, and runtime adapters while avoiding operational disruption. | Safe-validation vs exploitation taxonomy. | Eval for lab-only validation and approval requirement. | P1 | Open |
| VA-015 | Exposure relationship analysis | How should agents model relationships between identities, systems, permissions, and workflows? | Maps to entity-map, role hierarchy, channel ownership, repo source policy, and authority graph. | Agentic authority graph model. | Eval for incorrect ownership inference. | P1 | Open |
| VA-016 | Blast-radius validation | How should agents estimate impact before acting? | Directly relevant to strict intent, gate edits, repo sync, automations, and memory writes. | Blast-radius checklist for architecture/source changes. | Eval for "this and nothing else" exact-scope proof. | P0 | Open |
| VA-017 | Red team automation agents | How should offensive automation be restricted to approved libraries, scope, and oversight? | Maps to adversarial evals for autonomy: test prompts should try to bypass R&R, owner routing, release gates, and authority boundaries. | Red-team eval suite for Vik autonomy. | Eval for bypass resistance and full audit logging. | P0 | Open |
| VA-018 | Identity threat detection and response | How should agents detect suspicious identity/authority changes? | Maps to role promotion, principal/agent status, operational authority, and tool-access-vs-permission errors. | Authority-change detection policy. | Eval for unauthorized promotion and implicit authority rejection. | P0 | Open |
| VA-019 | Cloud misconfiguration detection and remediation | How should agents recommend config fixes without auto-remediating risky settings? | Maps to gate.md, automations, hooks, deploy settings, and source policy: classify, recommend, get approval, then verify. | Configuration-change approval pattern. | Eval for config write requiring explicit operational scope. | P0 | Open |
| VA-020 | Security knowledge and compliance mapping agents | How should agents keep policy/RAG/current-state knowledge trustworthy and version-aware? | Maps to Obsidianify, project-context, glossary, role memory, Autonomy.md, and architecture notes. | Version-aware architecture knowledge map. | Eval for stale policy detection and cited source updates. | P0 | Open |

## First Research Cycle

When automation is approved, start with the P0 items because they directly address known trust failures:

1. VA-010: Log enrichment and parsing.
2. VA-011: Detection rule tuning.
3. VA-012: Copilot action separation.
4. VA-013: Scope-validation gate.
5. VA-016: Blast-radius validation.
6. VA-017: Red-team automation agents.
7. VA-018: Identity and authority-change detection.
8. VA-019: Configuration-change approval.
9. VA-020: Compliance and knowledge mapping.

## Standing Analysis Questions

For each backlog item, answer:

- What is the equivalent Mojo/MAPS architecture surface?
- Is this a role, skill, script, hook, loop, active process, or full agent?
- What authority is required?
- What must remain recommendation-only?
- What runtime gate would prevent over-action?
- What eval proves the guardrail works?
- What memory/RAG artifact should preserve the learning?
- Which owner should implement, review, approve, or release the change?

## Approval Boundary

This backlog authorizes research and recommendation only. Implementation, automation activation, runtime adapter changes, gate changes, source publication, production changes, or role promotion require separate approval.

## Changelog

- 2026-06-21 - v0.1.0 - Created architecture backlog from 20 cybersecurity agentic AI use cases and mapped each item to Vik automation research, gates, evals, and architecture outputs.
