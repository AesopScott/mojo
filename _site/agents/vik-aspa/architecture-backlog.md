# Vik Architecture Backlog

Status: Active Level 4 research queue; queue occupancy may trigger Vik scoped research, not implementation
Owner: Vik / MAPS ASPA
Final authority: Scott
Created: 2026-06-21
Source prompt: Scott requested an architecture backlog seeded from the "20 Practical Agentic AI Use Cases in 5 Cybersecurity Domains" infographic by NothingCyber / Dr. Meisam Eslahi.

## Purpose

This backlog turns external agentic-AI use cases into research, evaluation, productization, and architecture prompts for Vik's Level 4 scoped research loop.

It does not authorize implementation, deployment, scanning, security tooling, production access, external communication, or action outside Vik's approved Level 4 research lane. Queue occupancy may trigger Vik to pick one eligible backlog item, research it, and produce recommendation/evidence inside the Level 4 contract.

## Operating Rule

When operating inside approved Vik Level 4 queue automation, use this backlog to:

1. Select one research item at a time.
2. Research the architecture pattern, failure modes, and guardrails.
3. Classify the result as role, skill, script, hook, loop, active process, or agent.
4. Recommend whether Mojo/MAPS needs a backlog item, eval, validator, policy, template, runtime gate, or branded security product candidate.
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
| VA-001 | Autonomous threat hunting | How should an agent continuously inspect multiple sources without inventing urgency or drowning operators in noise? | Mirrors heartbeat/file-watch automation: ingest signals, classify novelty, correlate with memory, and escalate only when concrete changed-file work or risk exists. | Heartbeat evidence-scoring model and quiet/noisy notification policy. | Eval for false-positive suppression, audit trace, and escalation threshold. | P1 | complete |
| VA-002 | AI-assisted threat intelligence correlation | How should an agent combine weak indicators from multiple sources into a useful recommendation? | Useful for connecting role memory, handoff channels, release decisions, Obsidian notes, and repo state without treating any single source as authority. | Source reputation and conflict-resolution rubric. | Eval for contradictory sources and stale memory. | P1 | complete |
| VA-003 | Automated security telemetry analysis | How should telemetry be filtered before an agent acts on it? | Directly maps to future Vik observe loop: large event streams need prioritization, deterministic filters, and bounded AI interpretation. | Telemetry intake schema for role/automation events. | Eval for noisy telemetry and missing context. | P2 | complete |
| VA-004 | Behavioral baseline monitoring | How should a role detect behavior drift without mistaking normal change for a violation? | Relevant to detecting role drift, authority drift, memory-size drift, and channel-ownership drift. | Role behavior baseline and drift-review checklist. | Eval for normal vs abnormal behavior deltas. | P1 | complete |
| VA-005 | AI SOC triage assistant | How should an agent triage alerts while preserving analyst control? | Maps to Vik backlog triage: classify issues by owner, authority, risk, urgency, and proof without taking over execution. | Architecture triage rubric for MAPS/role issues. | Eval for missed high-risk item and over-escalation. | P1 | complete |
| VA-006 | Multi-step incident investigation | How should an agent coordinate a multi-step investigation without wandering? | Useful for goal-driven architecture investigations: each step needs scope, evidence, next question, and stop condition. | Investigation workflow template for architecture incidents. | Eval for scope creep and unresolved owner handoff. | P1 | complete |
| VA-007 | Automated phishing and social engineering analysis | How should an agent analyze messages safely without performing broad automated response? | Maps to communications/handoff safety: classify suspicious requests, authority escalation attempts, and impersonation-like instructions. | Internal-message risk classifier recommendation. | Eval for authority-bypass attempts and false trust. | P2 | complete |
| VA-008 | Ransomware early detection and response | How should an agent detect urgent destructive risk while still requiring approval for containment? | Useful as a model for destructive-change prevention: broad deletes, resets, moves, or gate modifications should trigger hard stops. | Destructive-action guardrail and emergency escalation pattern. | Eval for destructive command blocking and escalation. | P0 | complete |
| VA-009 | AI malware reverse-engineering assistant | How should AI assist high-risk technical analysis without executing unsafe artifacts? | Maps to safe analysis of hooks/scripts/runtime adapters: inspect, decompose, explain, and recommend without executing unknown behavior. | Safe-static-analysis policy for scripts/hooks. | Eval for refusing unsafe execution and preserving evidence. | P2 | complete |
| VA-010 | Autonomous log enrichment and parsing | How should logs be normalized into usable memory without corrupting meaning? | Directly relevant to Obsidianify, role-memory rollover, audit logs, and future automation traces. | Log-to-memory classification schema. | Eval for valuable/not-valuable and type classification quality. | P0 | complete |
| VA-011 | Continuous detection rule tuning | How should an agent tune rules without creating blind spots? | Maps to validators and gates: rules need regression cases before edits, and tuning must not silently weaken safety. | Validator-regression policy and rule-change proof matrix. | Eval for weaker rule rejection and approval routing. | P0 | complete |
| VA-012 | AI security copilot for analysts | What guardrails keep a copilot helpful without executing unsafe actions? | Maps to Vik's primary mode: research, recommend, draft, route; no execution without authority. | Copilot-mode contract for Role+ agents. | Eval for recommendation/action separation. | P0 | complete |
| VA-013 | Attack surface discovery agents | How should discovery stay within approved scope? | Maps to repo/project isolation and source-root boundaries: no cross-project inspection without named approval. | Scope-validation gate for project/file discovery. | Eval for denied cross-project read/write. | P0 | complete |
| VA-014 | Autonomous vulnerability validation | How should validation distinguish safe checking from exploit-like action? | Useful for testing gate behavior, validators, and runtime adapters while avoiding operational disruption. | Safe-validation vs exploitation taxonomy. | Eval for lab-only validation and approval requirement. | P1 | complete |
| VA-015 | Exposure relationship analysis | How should agents model relationships between identities, systems, permissions, and workflows? | Maps to entity-map, role hierarchy, channel ownership, repo source policy, and authority graph. | Agentic authority graph model. | Eval for incorrect ownership inference. | P1 | complete |
| VA-016 | Blast-radius validation | How should agents estimate impact before acting? | Directly relevant to strict intent, gate edits, repo sync, automations, and memory writes. | Blast-radius checklist for architecture/source changes. | Eval for "this and nothing else" exact-scope proof. | P0 | complete |
| VA-017 | Red team automation agents | How should offensive automation be restricted to approved libraries, scope, and oversight? | Maps to adversarial evals for autonomy: test prompts should try to bypass R&R, owner routing, release gates, and authority boundaries. | Red-team eval suite for Vik autonomy. | Eval for bypass resistance and full audit logging. | P0 | complete |
| VA-018 | Identity threat detection and response | How should agents detect suspicious identity/authority changes? | Maps to role promotion, principal/agent status, operational authority, and tool-access-vs-permission errors. | Authority-change detection policy. | Eval for unauthorized promotion and implicit authority rejection. | P0 | complete |
| VA-019 | Cloud misconfiguration detection and remediation | How should agents recommend config fixes without auto-remediating risky settings? | Maps to gate.md, automations, hooks, deploy settings, and source policy: classify, recommend, get approval, then verify. | Configuration-change approval pattern. | Eval for config write requiring explicit operational scope. | P0 | complete |
| VA-020 | Security knowledge and compliance mapping agents | How should agents keep policy/RAG/current-state knowledge trustworthy and version-aware? | Maps to Obsidianify, project-context, glossary, role memory, Autonomy.md, and architecture notes. | Version-aware architecture knowledge map. | Eval for stale policy detection and cited source updates. | P0 | complete |
| VA-021 | End-to-end AI agent security lifecycle | How should a security-tool company define a repeatable secure lifecycle for AI agents and LLM apps from design through monitoring? | Maps to productizable control-plane packaging: use-case definition, data/access controls, model/runtime hardening, guardrails, and monitoring. | AI-agent security lifecycle reference architecture. | Eval for complete control coverage across design, data, runtime, guardrails, and response. | P0 | backlog |
| VA-022 | AI agent use-case and trust-boundary design | How should teams define business objectives, users, workflows, and trust boundaries before agent build or product release? | Maps to MAPS scope definition, role authority boundaries, workflow ownership, and customer-facing use-case qualification. | Trust-boundary design checklist for AI-agent products. | Eval for missing objective, user, workflow, or trust-boundary rejection. | P1 | backlog |
| VA-023 | Data-source classification and prompt masking | How should AI systems classify data sources and mask sensitive data before prompts, tool calls, memory writes, or logs? | Maps to Mojo memory/RAG, prompt construction, evidence handling, and customer data-governance product opportunity. | Data classification and masking policy for agent contexts. | Eval for sensitive-data leakage prevention and masking fidelity. | P0 | backlog |
| VA-024 | RBAC for AI apps and agents | How should RBAC apply to agents, tools, users, workflows, and memory stores without confusing role title with executable authority? | Maps to role authority taxonomy, tool permission boundaries, customer tenant separation, and agent action approval. | Agent RBAC and authority-binding model. | Eval for privilege escalation, role/title confusion, and denied unauthorized tool access. | P0 | backlog |
| VA-025 | Scoped API keys and agent secrets management | How should agent runtimes scope, rotate, isolate, and audit API keys and secrets without exposing them to prompts or memory? | Maps to runtime adapter design, tool wrappers, secret redaction, approval gates, and deploy readiness. | Scoped secret-handling contract for AI agents. | Eval for secret exfiltration prompts, overbroad scopes, and rotation proof. | P0 | backlog |
| VA-026 | LLM and agent runtime hardening | How should model, framework, tool, memory, and runtime choices be evaluated before an agent is approved for production or customer use? | Maps to build-vs-buy decisions, runtime adapter selection, memory controls, and product security baseline. | LLM/agent runtime security review matrix. | Eval for unsafe model/tool/runtime configuration rejection. | P0 | backlog |
| VA-027 | Guardrail and policy enforcement across prompts, outputs, and actions | How should guardrails compose across input validation, prompt hardening, output filtering, tool restrictions, and action approval? | Maps to strict-intent gates, recommendation/action separation, policy enforcement, and reusable product controls. | Layered guardrail enforcement pattern. | Eval for prompt injection, unsafe output, and unauthorized action blocking. | P0 | backlog |
| VA-028 | Monitoring, response, and behavior drift for AI agents | How should agent behavior be monitored to detect threats, drift, policy bypass, and incidents quickly without noisy false alarms? | Maps to heartbeat/file-watch observability, agent behavior baselines, incident routing, and customer SOC integration. | Agent behavior monitoring and response model. | Eval for drift detection, false-positive suppression, and response escalation. | P0 | backlog |
| VA-029 | AI usage governance policies and approvals | How should organizations define AI usage policies, approval paths, and exception handling for internal and customer-facing agents? | Maps to Mojo approval gates, release management, product governance, and CISO-facing policy artifacts. | AI usage approval and exception policy template. | Eval for unapproved AI use and missing owner/approver detection. | P1 | backlog |
| VA-030 | Shadow AI discovery and inventory | How should an organization discover, inventory, and risk-rank shadow AI usage without over-collecting sensitive data? | Maps to source discovery, tool inventory, role/agent registry, and customer-facing governance product opportunity. | Shadow AI inventory and discovery pattern. | Eval for scoped discovery, privacy preservation, and unknown-agent detection. | P1 | backlog |
| VA-031 | AI risk register and compliance evidence | How should AI-agent risks, controls, approvals, incidents, and compliance evidence be recorded in a version-aware register? | Maps to MAPS memory, release evidence, audit trails, and compliance productization. | AI risk register schema and evidence map. | Eval for stale evidence, missing approval, and unverifiable compliance claims. | P1 | backlog |
| VA-032 | Prompt injection and jailbreak defenses | How should AI-agent products resist prompt injection and jailbreak attempts across prompts, retrieved content, tools, and memory? | Maps to adversarial evals, message risk classification, tool restrictions, and customer-facing safety claims. | Prompt-injection defense and eval suite. | Eval for indirect prompt injection, jailbreak refusal, and tool-call containment. | P0 | backlog |
| VA-033 | Output filtering and safety checks | How should agents filter outputs for unsafe instructions, sensitive data, policy violations, and unsupported claims before display or action? | Maps to communication safety, report generation, security advisory boundaries, and product response quality. | Output safety filter and claim-check contract. | Eval for unsafe output suppression, false refusal, and evidence-backed recommendations. | P0 | backlog |
| VA-034 | Unsafe or incorrect agent behavior controls | How should agent products detect and constrain incorrect decisions, harmful actions, and business-impacting hallucinations while preserving useful autonomy? | Maps to human-in-the-loop gates, eval harnesses, rollback, behavior monitoring, and customer incident response. | Unsafe-agent-behavior control framework. | Eval for hallucinated authority, harmful-action prevention, and human escalation. | P0 | backlog |
| VA-035 | AI security agent stack architecture | How should a security-tool manufacturer structure the complete AI security agent stack from models through governance? | Maps to product architecture across foundation models, reasoning, data, tools, specialized agents, SOC collaboration, orchestration, and governance. Source image saved at `agents/vik-aspa/run-artifacts/source-images/2026-06-23-ai-security-agent-stack.png`. | AI security agent stack reference architecture. | Eval for layer completeness, unsafe cross-layer authority, and product boundary clarity. | P0 | backlog |
| VA-036 | AI foundation and security-tuned LLM selection | How should GPT-class, Claude-class, Gemini-class, DeepSeek-class, and security-tuned models be selected, routed, and evaluated for cyber-defense tasks? | Maps to model-routing, vendor-risk, eval harnesses, cost/latency, data exposure, and security-task specialization. | Security model selection and routing policy. | Eval for model-task fit, sensitive-data handling, and unsafe model behavior. | P0 | backlog |
| VA-037 | Security reasoning layer | How should threat analysis, risk assessment, IOC correlation, attack-path mapping, and decision engines turn security data into defensible recommendations? | Maps to recommendation-only reasoning, evidence scoring, explainable decisions, and analyst review gates. | Security reasoning pipeline and evidence contract. | Eval for wrong correlation, unsupported risk scores, and overconfident recommendations. | P0 | backlog |
| VA-038 | Security data layer | How should threat intelligence, security logs, SIEM data, vulnerability databases, and asset inventory be normalized for agent use? | Maps to source trust, stale data, entity resolution, RAG grounding, and customer data connector design. | Security data normalization and provenance schema. | Eval for stale data, duplicate entity merge, and source-provenance loss. | P0 | backlog |
| VA-039 | Cyber tool integration layer | How should agents integrate SIEM, SOAR, EDR/XDR, vulnerability scanners, threat-intel platforms, and cloud security tools without unsafe tool use? | Maps to tool-wrapper contracts, scoped permissions, dry-run modes, approval gates, and audit logging. | Cyber tool integration safety contract. | Eval for unauthorized tool call, unsafe remediation, and missing audit trail. | P0 | backlog |
| VA-040 | Specialized AI security agents | Which specialized SOC, threat-hunting, incident-response, vulnerability, compliance, and malware-analysis agents should be built as products versus internal capabilities? | Maps to role-vs-agent taxonomy, product packaging, scope boundaries, and owner handoffs. | Specialized security-agent product taxonomy. | Eval for role overlap, unsafe autonomy, and unclear buyer/user boundary. | P1 | backlog |
| VA-041 | Multi-agent SOC collaboration | How should manager, triage, investigation, remediation, human analyst, and shared-memory agents coordinate without losing accountability? | Maps to multi-agent routing, supervisor patterns, shared memory, handoffs, analyst control, and incident evidence chains. | Multi-agent SOC coordination model. | Eval for dropped handoff, conflicting agents, and unapproved remediation. | P0 | backlog |
| VA-042 | Security automation and orchestration | How should playbooks, automated response, ticketing, workflow automation, and case management be composed into agentic SOC operations? | Maps to orchestration boundaries, queue state, ticket lifecycle, playbook safety, and customer integrations. | Agentic SOC orchestration pattern. | Eval for playbook misfire, duplicate tickets, and case-state corruption. | P1 | backlog |
| VA-043 | Human approval and autonomous security operations boundary | Where should human approval remain mandatory, and where can autonomous security operations be safely allowed? | Maps to Scott approval gates, containment boundaries, production risk, customer trust, and revocation paths. | Human-approval vs autonomy boundary matrix. | Eval for approval bypass and safe autonomous low-risk action. | P0 | backlog |
| VA-044 | Self-healing infrastructure controls | How should self-healing security infrastructure be designed so automated repair does not create outages, loops, or hidden drift? | Maps to remediation gating, rollback, canary repair, blast-radius checks, and observability. | Self-healing infrastructure control pattern. | Eval for repair loop, overbroad remediation, and rollback failure. | P0 | backlog |
| VA-045 | Shared memory for security agents | How should SOC agents share memory without leaking sensitive data, preserving bad facts, or corrupting incident evidence? | Maps to role memory, RAG, audit logs, case notes, provenance, retention, and multi-agent state. | Shared SOC memory contract. | Eval for memory poisoning, sensitive leakage, stale fact reuse, and evidence integrity. | P0 | backlog |
| VA-046 | Security decision engine | How should a security decision engine combine policies, evidence, risk, and approvals into explainable allow/deny/escalate outcomes? | Maps to strict-intent gates, approval workflows, policy evaluation, and productizable decision APIs. | Explainable security decision engine architecture. | Eval for unsupported allow, missing policy citation, and wrong escalation. | P0 | backlog |
| VA-047 | Attack path mapping for AI security agents | How should attack path mapping be represented, updated, and used by AI agents without authorizing offensive action? | Maps to exposure graphs, blast radius, identity/cloud relationships, and recommendation-only analysis. | Attack-path graph and safe-use policy. | Eval for scope control, offensive misuse refusal, and path-evidence accuracy. | P1 | backlog |
| VA-048 | Case management and ticketing for agentic SOC | How should agentic SOC systems synchronize case state, tickets, evidence, approvals, and closeout across humans and agents? | Maps to channel queues, reports, release evidence, incident lifecycle, and customer support workflows. | Agentic case-management state model. | Eval for duplicate state, missing approval history, and incomplete closeout proof. | P1 | backlog |

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

## Second Research Cycle

2026-06-22: Scott requested a rerun of VA-008 through VA-017 because the productization, proof, and visibility contract changed materially after VA-018. Prior reports are retained under `C:\Users\scott\.codex\automations\vik-handoff-check\reports\prior-pass-20260622-before-va008-va017-rerun`; the active queue should produce fresh visible reports before these items return to `complete`.

## Third Research Cycle

2026-06-23: Scott provided the "How to Secure AI Agents & LLM Apps End-to-End" image and asked Vik to add its content as backlog items for later review. VA-021 through VA-034 capture the image's lifecycle, governance, data/access, model security, guardrail, monitoring, and top-risk control topics.

## Fourth Research Cycle

2026-06-23: Scott provided the "AI Security Agent Stack" image and asked Vik to save it and add its content as backlog items for later review. The image is saved at `agents/vik-aspa/run-artifacts/source-images/2026-06-23-ai-security-agent-stack.png`. VA-035 through VA-048 capture the stack layers: foundation models, reasoning, data, tools, specialized agents, multi-agent SOC, orchestration, governance, self-healing, shared memory, decision engines, attack paths, and case management.

## Standing Analysis Questions

For each backlog item, answer:

- What is the equivalent Mojo/MAPS architecture surface?
- Is this a role, skill, script, hook, loop, active process, or full agent?
- What authority is required?
- What must remain recommendation-only?
- What runtime gate would prevent over-action?
- What eval proves the guardrail works?
- What memory/RAG artifact should preserve the learning?
- Should Mindshare/Mojo consider building this as a branded security product, internal capability, enabling component, or not-at-this-time item?
- Which owner should implement, review, approve, or release the change?

## Approval Boundary

This backlog authorizes research and recommendation only. Implementation, automation activation, runtime adapter changes, gate changes, source publication, production changes, or role promotion require separate approval.

## Changelog

- 2026-06-22 - v0.2.0 - Added Scott's productization lens: each security backlog research item should assess whether Mojo/Mindshare should build it as a branded security product, internal capability, enabling component, or not-at-this-time item.
- 2026-06-22 - v0.2.1 - Reopened VA-008 through VA-017 for a second research cycle after the productization, durable proof, and visibility contract changed.
- 2026-06-23 - v0.3.0 - Added VA-021 through VA-034 from Scott's AI-agent and LLM-app security framework image.
- 2026-06-23 - v0.4.0 - Saved Scott's AI Security Agent Stack image and added VA-035 through VA-048 from the stack layers.
- 2026-06-21 - v0.1.0 - Created architecture backlog from 20 cybersecurity agentic AI use cases and mapped each item to Vik automation research, gates, evals, and architecture outputs.
