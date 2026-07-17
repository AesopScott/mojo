# Anthropic Architect Foundations Scenario Practice Exam

222 original scenario practice questions plus 125 speed-round drills aligned to the official Anthropic Architect Foundations Exam Guide, version 1.0, effective July 2026, exam code `CCAR-F`.

This prep bank is structured like the exam: read a scenario case file, then answer the questions that belong to that case. The real exam has 60 questions across 4 scenarios drawn from the official scenario bank. This practice bank includes 222 scenario-based questions and 125 speed-round questions.

## Official Scenario Bank Covered

- Customer Support Resolution Agent
- Code Generation with Claude Code
- Multi-Agent Research System
- Developer Productivity with Claude
- Claude Code for CI/CD
- Structured Data Extraction

## Practice Structure

- 222 total scenario questions
- 125 total speed-round questions
- Mixed single-select and multiple-response questions
- Questions test all five official domains inside realistic case contexts

## Scenario 1: Refunds with identity and policy gates

**Official scenario type:** Customer Support Resolution Agent

**Case file:** A subscription billing team is preparing a Claude architecture for the following situation.

Customers contact chat support about duplicate charges, refunds, failed plan changes, and missing invoices. The company wants Claude to resolve routine cases, gather evidence from billing and CRM systems, and prepare escalations for finance when the requested action exceeds policy.

The proposed design uses an Agent SDK loop with tools for identity verification, account lookup, invoice search, refund eligibility, refund execution, and ticket notes. A coordinator agent owns the conversation, tool sequencing, and final response. Refund execution must be blocked unless identity verification, account ownership, refund eligibility, and amount threshold checks have all passed.

In pilot testing, Claude sometimes writes that the customer is verified before the identity tool returns success. In other runs it retries a failed refund tool without explaining the failure. Finance also reports escalations that omit invoice IDs, customer IDs, and the policy clause that forced escalation.

**Constraints and artifacts:**
- Refunds over $250 require human approval.
- PII must never be sent to logging tools.
- Every escalation must include account ID, invoice ID, attempted actions, and policy reason.
- The final customer response must be concise and must not expose internal policy text.

### Questions 1-11

**Question:** **1**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **2**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **3**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **4**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **5**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **6**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **7**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **8**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **9**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **10**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **11**
**Domain:** Context Management & Reliability

A long support conversation contains account IDs, invoice IDs, refund amounts, and a policy exception from earlier turns. Claude is starting to miss those facts. What is the best fix? (Select 1.)
   A. Ask Claude to maintain a running natural-language summary of the whole transcript after each turn.
   B. Extract durable facts into a compact case block and re-anchor that block near the current task on each turn.
   C. Move the complete transcript into a long-context prompt so the earlier IDs remain available.
   D. Store the transcript in an MCP resource and let the support subagent retrieve whatever it needs.

**Answer:** **B**

**Explanation:**

**A. Ask Claude to maintain a running natural-language summary of the whole transcript after each turn.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam trap is lossy summarization of IDs and amounts. Preserve durable facts in a structured case block placed where the model can use it.

**B. Extract durable facts into a compact case block and re-anchor that block near the current task on each turn.** ✅ Correct

The exam trap is lossy summarization of IDs and amounts. Preserve durable facts in a structured case block placed where the model can use it.

**C. Move the complete transcript into a long-context prompt so the earlier IDs remain available.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam trap is lossy summarization of IDs and amounts. Preserve durable facts in a structured case block placed where the model can use it.

**D. Store the transcript in an MCP resource and let the support subagent retrieve whatever it needs.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam trap is lossy summarization of IDs and amounts. Preserve durable facts in a structured case block placed where the model can use it.



## Scenario 2: Order replacement triage across carriers

**Official scenario type:** Customer Support Resolution Agent

**Case file:** An ecommerce operations group is preparing a Claude architecture for the following situation.

Support agents receive thousands of messages about lost deliveries, damaged goods, delayed shipments, and incorrect addresses. The desired Claude workflow should decide whether to answer directly, request missing information, open a carrier claim, create a replacement order, or escalate to fraud review.

The design includes tools for customer authentication, order lookup, tracking lookup, address validation, carrier claim creation, replacement order creation, and CRM note writing. Claude receives short policy excerpts and a structured summary of prior interactions. A coordinator may ask a shipping-specialist subagent to inspect carrier evidence and a policy-specialist subagent to classify eligibility.

The first implementation lets the model call replacement_order whenever it predicts the customer is eligible. It also sends carrier screenshots to subagents without source labels. When carrier APIs timeout, the final message often sounds confident even though the shipment status is unknown.

**Constraints and artifacts:**
- Replacement orders require a verified order, verified customer, eligible policy result, and known shipment state.
- Carrier claim failures must be surfaced to the coordinator.
- Subagents do not inherit parent context.
- Customer-facing uncertainty must be explicit when evidence is incomplete.

### Questions 12-22

**Question:** **12**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **13**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **14**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **15**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **16**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **17**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **18**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **19**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **20**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **21**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **22**
**Domain:** Context Management & Reliability

A long support conversation contains account IDs, invoice IDs, refund amounts, and a policy exception from earlier turns. Claude is starting to miss those facts. What is the best fix? (Select 1.)
   A. Ask Claude to maintain a running natural-language summary of the whole transcript after each turn.
   B. Extract durable facts into a compact case block and re-anchor that block near the current task on each turn.
   C. Move the complete transcript into a long-context prompt so the earlier IDs remain available.
   D. Store the transcript in an MCP resource and let the support subagent retrieve whatever it needs.

**Answer:** **B**

**Explanation:**

**A. Ask Claude to maintain a running natural-language summary of the whole transcript after each turn.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam trap is lossy summarization of IDs and amounts. Preserve durable facts in a structured case block placed where the model can use it.

**B. Extract durable facts into a compact case block and re-anchor that block near the current task on each turn.** ✅ Correct

The exam trap is lossy summarization of IDs and amounts. Preserve durable facts in a structured case block placed where the model can use it.

**C. Move the complete transcript into a long-context prompt so the earlier IDs remain available.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam trap is lossy summarization of IDs and amounts. Preserve durable facts in a structured case block placed where the model can use it.

**D. Store the transcript in an MCP resource and let the support subagent retrieve whatever it needs.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam trap is lossy summarization of IDs and amounts. Preserve durable facts in a structured case block placed where the model can use it.



## Scenario 3: Healthcare appointment support

**Official scenario type:** Customer Support Resolution Agent

**Case file:** A clinic network is preparing a Claude architecture for the following situation.

The clinic wants a Claude support agent to answer appointment questions, reschedule visits, route billing questions, and prepare handoffs to staff. The agent can access scheduling metadata but must not offer clinical advice or infer diagnoses.

The workflow has tools for patient verification, appointment lookup, provider availability, rescheduling, billing-ticket creation, and staff handoff. A guardrail hook checks whether the proposed action is administrative or clinical. The final response must be warm, brief, and grounded in verified appointment data.

During review, the agent sometimes attempts to reschedule before patient verification completes. It also summarizes symptoms into the staff note without indicating that the note came from unverified patient text. Staff want fewer generic escalations and more structured handoffs.

**Constraints and artifacts:**
- No clinical advice.
- Rescheduling requires verification and available slot confirmation.
- Staff handoffs must separate verified records from patient-provided claims.
- Tool errors must not be hidden from staff.

### Questions 23-33

**Question:** **23**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **24**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **25**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **26**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **27**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **28**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **29**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **30**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **31**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **32**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **33**
**Domain:** Context Management & Reliability

A long support conversation contains account IDs, invoice IDs, refund amounts, and a policy exception from earlier turns. Claude is starting to miss those facts. What is the best fix? (Select 1.)
   A. Ask Claude to maintain a running natural-language summary of the whole transcript after each turn.
   B. Extract durable facts into a compact case block and re-anchor that block near the current task on each turn.
   C. Move the complete transcript into a long-context prompt so the earlier IDs remain available.
   D. Store the transcript in an MCP resource and let the support subagent retrieve whatever it needs.

**Answer:** **B**

**Explanation:**

**A. Ask Claude to maintain a running natural-language summary of the whole transcript after each turn.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam trap is lossy summarization of IDs and amounts. Preserve durable facts in a structured case block placed where the model can use it.

**B. Extract durable facts into a compact case block and re-anchor that block near the current task on each turn.** ✅ Correct

The exam trap is lossy summarization of IDs and amounts. Preserve durable facts in a structured case block placed where the model can use it.

**C. Move the complete transcript into a long-context prompt so the earlier IDs remain available.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam trap is lossy summarization of IDs and amounts. Preserve durable facts in a structured case block placed where the model can use it.

**D. Store the transcript in an MCP resource and let the support subagent retrieve whatever it needs.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam trap is lossy summarization of IDs and amounts. Preserve durable facts in a structured case block placed where the model can use it.



## Scenario 4: Legacy API migration

**Official scenario type:** Code Generation with Claude Code

**Case file:** A SaaS platform team is preparing a Claude architecture for the following situation.

Engineers are migrating a legacy REST billing API to a new internal service. They want Claude Code to inspect the repository, propose an implementation plan, update handlers and tests, and prepare a pull request summary for reviewers.

The repository has AGENTS.md instructions, a service-specific CLAUDE.md, custom slash commands for test selection, and a skill for billing migration conventions. Claude Code is expected to use plan mode before edits, respect protected files, run focused tests, and summarize changed behavior rather than simply listing files.

A trial run edited generated client files, skipped the repo migration guide, and used broad test commands that timed out. The PR summary omitted one behavior change around idempotency. Reviewers want the workflow configured so Claude Code follows repository-local rules and asks before risky operations.

**Constraints and artifacts:**
- Generated client files are read-only.
- Migration changes must include unit tests and contract tests.
- Claude Code must not run destructive git commands.
- CI uses a custom command that requires the correct changed-package list.

### Questions 34-44

**Question:** **34**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **35**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **36**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **37**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **38**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **39**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **40**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **41**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **42**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **43**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **44**
**Domain:** Claude Code Configuration & Workflows

The team wants every clone of the repository to follow the same lint-before-commit rule. Where should that shared Claude Code instruction live? (Select 1.)
   A. In each developer's user-level Claude config so the rule follows their personal workflow.
   B. In a project-level CLAUDE.md or equivalent committed repository instruction file.
   C. Inside a slash command used by the release lead when preparing pull requests.
   D. In the CI failure prompt so Claude sees the rule only when a check fails.

**Answer:** **B**

**Explanation:**

**A. In each developer's user-level Claude config so the rule follows their personal workflow.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Team-shared rules belong in committed project instructions. User-level memory is private and will not travel with the repo.

**B. In a project-level CLAUDE.md or equivalent committed repository instruction file.** ✅ Correct

Team-shared rules belong in committed project instructions. User-level memory is private and will not travel with the repo.

**C. Inside a slash command used by the release lead when preparing pull requests.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Team-shared rules belong in committed project instructions. User-level memory is private and will not travel with the repo.

**D. In the CI failure prompt so Claude sees the rule only when a check fails.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Team-shared rules belong in committed project instructions. User-level memory is private and will not travel with the repo.



## Scenario 5: Frontend accessibility repair

**Official scenario type:** Code Generation with Claude Code

**Case file:** A product design systems team is preparing a Claude architecture for the following situation.

A dashboard has keyboard traps, missing labels, inconsistent loading states, and brittle component tests. The team wants Claude Code to identify the issues, repair components, update tests, and avoid broad visual redesign.

Claude Code has access to component source, Playwright tests, design-system rules, and a skill describing accessibility review conventions. The workflow should start with a plan, inspect existing patterns, make scoped edits, run relevant tests, and produce a reviewer-ready explanation.

In the first attempt, Claude changed unrelated colors, created a new button abstraction, and missed that a modal close button had an accessible name conflict. It also claimed tests passed without actually running the failing Playwright file.

**Constraints and artifacts:**
- No unrelated visual redesign.
- Use existing design-system primitives.
- Do not invent test results.
- Every interactive control needs a stable accessible name and keyboard path.

### Questions 45-55

**Question:** **45**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **46**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **47**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **48**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **49**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **50**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **51**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **52**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **53**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **54**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **55**
**Domain:** Claude Code Configuration & Workflows

The team wants every clone of the repository to follow the same lint-before-commit rule. Where should that shared Claude Code instruction live? (Select 1.)
   A. In each developer's user-level Claude config so the rule follows their personal workflow.
   B. In a project-level CLAUDE.md or equivalent committed repository instruction file.
   C. Inside a slash command used by the release lead when preparing pull requests.
   D. In the CI failure prompt so Claude sees the rule only when a check fails.

**Answer:** **B**

**Explanation:**

**A. In each developer's user-level Claude config so the rule follows their personal workflow.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Team-shared rules belong in committed project instructions. User-level memory is private and will not travel with the repo.

**B. In a project-level CLAUDE.md or equivalent committed repository instruction file.** ✅ Correct

Team-shared rules belong in committed project instructions. User-level memory is private and will not travel with the repo.

**C. Inside a slash command used by the release lead when preparing pull requests.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Team-shared rules belong in committed project instructions. User-level memory is private and will not travel with the repo.

**D. In the CI failure prompt so Claude sees the rule only when a check fails.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Team-shared rules belong in committed project instructions. User-level memory is private and will not travel with the repo.



## Scenario 6: CI failure repair

**Official scenario type:** Code Generation with Claude Code

**Case file:** A platform engineering team is preparing a Claude architecture for the following situation.

A monorepo has intermittent CI failures after a dependency upgrade. Engineers want Claude Code to inspect failing logs, identify the smallest behavioral fix, update tests if needed, and create a concise repair summary.

The setup includes CI log artifacts, package-level commands, repository rules, and a Claude Code skill for triaging test failures. The desired agent should reason from actual logs, avoid shotgun dependency changes, and ask before changing lockfiles.

A previous run updated multiple packages without proving they caused the failure. Another run only changed snapshots, masking a real timeout bug in a retry helper. The team needs a workflow that distinguishes flaky infrastructure from product regressions.

**Constraints and artifacts:**
- Use log evidence before editing.
- Lockfile changes require approval.
- Prefer narrow package tests before full CI.
- Do not mark failures fixed without rerunning the relevant command.

### Questions 56-66

**Question:** **56**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **57**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **58**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **59**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **60**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **61**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **62**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **63**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **64**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **65**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **66**
**Domain:** Claude Code Configuration & Workflows

The team wants every clone of the repository to follow the same lint-before-commit rule. Where should that shared Claude Code instruction live? (Select 1.)
   A. In each developer's user-level Claude config so the rule follows their personal workflow.
   B. In a project-level CLAUDE.md or equivalent committed repository instruction file.
   C. Inside a slash command used by the release lead when preparing pull requests.
   D. In the CI failure prompt so Claude sees the rule only when a check fails.

**Answer:** **B**

**Explanation:**

**A. In each developer's user-level Claude config so the rule follows their personal workflow.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Team-shared rules belong in committed project instructions. User-level memory is private and will not travel with the repo.

**B. In a project-level CLAUDE.md or equivalent committed repository instruction file.** ✅ Correct

Team-shared rules belong in committed project instructions. User-level memory is private and will not travel with the repo.

**C. Inside a slash command used by the release lead when preparing pull requests.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Team-shared rules belong in committed project instructions. User-level memory is private and will not travel with the repo.

**D. In the CI failure prompt so Claude sees the rule only when a check fails.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Team-shared rules belong in committed project instructions. User-level memory is private and will not travel with the repo.



## Scenario 7: Competitive intelligence report

**Official scenario type:** Multi-Agent Research System

**Case file:** A strategy team is preparing a Claude architecture for the following situation.

The team wants a multi-agent research system to compare five competitors, summarize product positioning, identify pricing signals, cite sources, and produce a brief for executives. The source set includes web pages, filings, release notes, and internal notes.

A coordinator decomposes the task into competitor research, pricing research, product-change research, and synthesis. Each subagent receives explicit instructions, source requirements, and output schema. The coordinator must aggregate evidence, detect contradictions, and request a second pass when coverage is thin.

The initial design produced a polished report but lost citations for several claims. Subagents duplicated work because task boundaries were vague. The synthesis agent treated stale pricing pages as current and failed to mark uncertainty.

**Constraints and artifacts:**
- Every important claim needs a source.
- Source date matters.
- Subagents have isolated context.
- The final report must separate findings, confidence, gaps, and recommended follow-up.

### Questions 67-78

**Question:** **67**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **68**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **69**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **70**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **71**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **72**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **73**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **74**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **75**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **76**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **77**
**Domain:** Agentic Architecture & Orchestration

One research subagent fails after other subagents have already stored findings and created review artifacts. What should the coordinator do first? (Select 1.)
   A. Rerun the full workflow so all subagent outputs are produced from the same fresh context.
   B. Retry or replace only the failed subtask and preserve successful side-effecting work.
   C. Ask the synthesis subagent to proceed using the successful outputs and mark the missing section as low confidence.
   D. Merge the failed subagent's partial notes into the final answer and let human reviewers catch any gaps.

**Answer:** **B**

**Explanation:**

**A. Rerun the full workflow so all subagent outputs are produced from the same fresh context.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.

**B. Retry or replace only the failed subtask and preserve successful side-effecting work.** ✅ Correct

Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.

**C. Ask the synthesis subagent to proceed using the successful outputs and mark the missing section as low confidence.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.

**D. Merge the failed subagent's partial notes into the final answer and let human reviewers catch any gaps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.


**Question:** **78**
**Domain:** Tool Design & MCP Integration

The MCP server for competitor research can run on the same machine as the client during analyst workflows. Which transport is the better default? (Select 1.)
   A. stdio, because the server can run locally without HTTP authentication and network overhead.
   B. SSE, because it matches the same HTTP pattern the production web app will eventually use.
   C. SSE, because it makes logs and authentication centralized even for a single local analyst.
   D. stdio for reads and SSE for writes so the model can choose the safer transport per call.

**Answer:** **A**

**Explanation:**

**A. stdio, because the server can run locally without HTTP authentication and network overhead.** ✅ Correct

For same-machine MCP servers, stdio is the exam-favored default. SSE is for remote or shared-host servers that need HTTP access patterns.

**B. SSE, because it matches the same HTTP pattern the production web app will eventually use.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A because For same-machine MCP servers, stdio is the exam-favored default. SSE is for remote or shared-host servers that need HTTP access patterns.

**C. SSE, because it makes logs and authentication centralized even for a single local analyst.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A because For same-machine MCP servers, stdio is the exam-favored default. SSE is for remote or shared-host servers that need HTTP access patterns.

**D. stdio for reads and SSE for writes so the model can choose the safer transport per call.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A because For same-machine MCP servers, stdio is the exam-favored default. SSE is for remote or shared-host servers that need HTTP access patterns.



## Scenario 8: Regulatory change monitor

**Official scenario type:** Multi-Agent Research System

**Case file:** A compliance group is preparing a Claude architecture for the following situation.

The company wants Claude to monitor regulatory updates, classify relevance by business unit, summarize obligations, and prepare review packets for lawyers. The information comes from agency pages, newsletters, PDFs, and internal policy mappings.

A coordinator routes collection, extraction, legal-summary, and impact-analysis tasks to separate subagents. MCP resources expose policy mappings and jurisdiction metadata. Tools can fetch documents, extract text, and store reviewed summaries.

In testing, collection agents included unrelated jurisdictions, extraction agents dropped page numbers, and the final synthesis mixed legal obligations with operational recommendations. Lawyers asked for provenance, confidence, and explicit unknowns.

**Constraints and artifacts:**
- No legal advice should be presented as final.
- PDF references need page numbers.
- Jurisdiction and effective date must be preserved.
- Low-confidence items require human review.

### Questions 79-89

**Question:** **79**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **80**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **81**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **82**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **83**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **84**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **85**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **86**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **87**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **88**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **89**
**Domain:** Agentic Architecture & Orchestration

One research subagent fails after other subagents have already stored findings and created review artifacts. What should the coordinator do first? (Select 1.)
   A. Rerun the full workflow so all subagent outputs are produced from the same fresh context.
   B. Retry or replace only the failed subtask and preserve successful side-effecting work.
   C. Ask the synthesis subagent to proceed using the successful outputs and mark the missing section as low confidence.
   D. Merge the failed subagent's partial notes into the final answer and let human reviewers catch any gaps.

**Answer:** **B**

**Explanation:**

**A. Rerun the full workflow so all subagent outputs are produced from the same fresh context.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.

**B. Retry or replace only the failed subtask and preserve successful side-effecting work.** ✅ Correct

Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.

**C. Ask the synthesis subagent to proceed using the successful outputs and mark the missing section as low confidence.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.

**D. Merge the failed subagent's partial notes into the final answer and let human reviewers catch any gaps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.



## Scenario 9: Technical architecture due diligence

**Official scenario type:** Multi-Agent Research System

**Case file:** An investment diligence team is preparing a Claude architecture for the following situation.

Analysts want Claude to evaluate an acquisition target's public technical footprint, hiring signals, dependency risks, and likely architecture maturity. The system should produce a diligence memo with cited evidence and caveats.

The coordinator uses web research, repository analysis, hiring-signal analysis, and synthesis subagents. Each subagent returns structured findings with sources, dates, confidence, and unresolved questions. The final memo must distinguish observed facts from inference.

The first memo overstated conclusions based on job postings and treated old GitHub activity as current. The coordinator failed to ask for additional evidence when the repository analysis was sparse.

**Constraints and artifacts:**
- Do not imply private knowledge.
- Inference must be labeled.
- Missing evidence must be visible.
- Subagent outputs must include source URLs and dates.

### Questions 90-100

**Question:** **90**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **91**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **92**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **93**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **94**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **95**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **96**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **97**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **98**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **99**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **100**
**Domain:** Agentic Architecture & Orchestration

One research subagent fails after other subagents have already stored findings and created review artifacts. What should the coordinator do first? (Select 1.)
   A. Rerun the full workflow so all subagent outputs are produced from the same fresh context.
   B. Retry or replace only the failed subtask and preserve successful side-effecting work.
   C. Ask the synthesis subagent to proceed using the successful outputs and mark the missing section as low confidence.
   D. Merge the failed subagent's partial notes into the final answer and let human reviewers catch any gaps.

**Answer:** **B**

**Explanation:**

**A. Rerun the full workflow so all subagent outputs are produced from the same fresh context.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.

**B. Retry or replace only the failed subtask and preserve successful side-effecting work.** ✅ Correct

Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.

**C. Ask the synthesis subagent to proceed using the successful outputs and mark the missing section as low confidence.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.

**D. Merge the failed subagent's partial notes into the final answer and let human reviewers catch any gaps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.



## Scenario 10: Internal developer assistant rollout

**Official scenario type:** Developer Productivity with Claude

**Case file:** A 400-engineer software company is preparing a Claude architecture for the following situation.

Engineering leadership is rolling out Claude as an internal development assistant for code search, design questions, test generation, and onboarding. The assistant must answer from internal docs and repositories while avoiding unsupported claims.

The system combines retrieval over approved docs, tools for issue lookup and repository search, Claude Code for implementation tasks, and a feedback loop for failed answers. Prompts instruct Claude to cite sources, ask for clarification when requests are ambiguous, and route implementation work to Claude Code.

Early users report confident answers from outdated docs and inconsistent handoffs from chat to Claude Code. Some answers include too much irrelevant context, pushing key constraints into the middle of the prompt.

**Constraints and artifacts:**
- Answers must cite internal docs or say evidence is missing.
- Implementation tasks should move to Claude Code with explicit repo context.
- Context should be ordered so critical constraints are hard to miss.
- Feedback should capture bad source use and missing clarifications.

### Questions 101-112

**Question:** **101**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **102**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **103**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **104**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **105**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **106**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **107**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **108**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **109**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **110**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **111**
**Domain:** Context Management & Reliability

A developer assistant uses a 50,000-token stable system prompt, a fixed set of few-shot examples, and a unique user question each turn. Which two prompt-caching choices are best? (Select 2.)
   A. Cache the stable system prompt prefix.
   B. Cache the reusable few-shot examples when they remain identical.
   C. Cache the full prompt including the user question so repeated users get faster responses.
   D. Cache only the retrieved documents because they are usually the largest part of the prompt.
   E. Avoid caching few-shot examples because examples can bias later tasks.

**Answer:** **A, B**

**Explanation:**

**A. Cache the stable system prompt prefix.** ✅ Correct

Prompt caching pays off on repeated stable prefixes, not one-off user turns or stale evidence that must be refreshed.

**B. Cache the reusable few-shot examples when they remain identical.** ✅ Correct

Prompt caching pays off on repeated stable prefixes, not one-off user turns or stale evidence that must be refreshed.

**C. Cache the full prompt including the user question so repeated users get faster responses.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Prompt caching pays off on repeated stable prefixes, not one-off user turns or stale evidence that must be refreshed.

**D. Cache only the retrieved documents because they are usually the largest part of the prompt.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Prompt caching pays off on repeated stable prefixes, not one-off user turns or stale evidence that must be refreshed.

**E. Avoid caching few-shot examples because examples can bias later tasks.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Prompt caching pays off on repeated stable prefixes, not one-off user turns or stale evidence that must be refreshed.


**Question:** **112**
**Domain:** Tool Design & MCP Integration

Three tools are described as 'gets user info': get_user, lookup_user, and find_customer. Claude picks randomly. What is the best fix? (Select 1.)
   A. Keep the tools separate but add a system prompt telling Claude to choose carefully.
   B. Rewrite descriptions with purpose, when-to-use guidance, example arguments, and possible error conditions.
   C. Rename the tools with longer names but keep the existing descriptions to avoid changing behavior.
   D. Route all three through one wrapper tool that decides which backend call to make from Claude's prose.

**Answer:** **B**

**Explanation:**

**A. Keep the tools separate but add a system prompt telling Claude to choose carefully.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Tool descriptions are selection controls. Ambiguous sibling tools need disambiguation rules, examples, and error contracts.

**B. Rewrite descriptions with purpose, when-to-use guidance, example arguments, and possible error conditions.** ✅ Correct

Tool descriptions are selection controls. Ambiguous sibling tools need disambiguation rules, examples, and error contracts.

**C. Rename the tools with longer names but keep the existing descriptions to avoid changing behavior.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Tool descriptions are selection controls. Ambiguous sibling tools need disambiguation rules, examples, and error contracts.

**D. Route all three through one wrapper tool that decides which backend call to make from Claude's prose.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Tool descriptions are selection controls. Ambiguous sibling tools need disambiguation rules, examples, and error contracts.



## Scenario 11: Data science notebook assistant

**Official scenario type:** Developer Productivity with Claude

**Case file:** A data platform team is preparing a Claude architecture for the following situation.

Data scientists want Claude to help debug notebooks, explain model evaluation results, generate SQL, and create repeatable analysis steps. The assistant can read notebook cells, dataset schemas, and selected run metadata.

The workflow uses tools for schema lookup, query validation, notebook cell summarization, and experiment metadata retrieval. Claude should preserve assumptions, avoid fabricating dataset columns, and escalate when a requested query may expose restricted data.

A pilot answer invented a column name, gave a confident model explanation despite missing experiment metadata, and buried data-access warnings after a long explanation. The team wants safer defaults and better structured outputs.

**Constraints and artifacts:**
- Schema must be verified before SQL generation.
- Restricted data requires escalation.
- Model interpretations need run metadata.
- Warnings and assumptions must appear before generated code.

### Questions 113-123

**Question:** **113**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **114**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **115**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **116**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **117**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **118**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **119**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **120**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **121**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **122**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **123**
**Domain:** Context Management & Reliability

A developer assistant uses a 50,000-token stable system prompt, a fixed set of few-shot examples, and a unique user question each turn. Which two prompt-caching choices are best? (Select 2.)
   A. Cache the stable system prompt prefix.
   B. Cache the reusable few-shot examples when they remain identical.
   C. Cache the full prompt including the user question so repeated users get faster responses.
   D. Cache only the retrieved documents because they are usually the largest part of the prompt.
   E. Avoid caching few-shot examples because examples can bias later tasks.

**Answer:** **A, B**

**Explanation:**

**A. Cache the stable system prompt prefix.** ✅ Correct

Prompt caching pays off on repeated stable prefixes, not one-off user turns or stale evidence that must be refreshed.

**B. Cache the reusable few-shot examples when they remain identical.** ✅ Correct

Prompt caching pays off on repeated stable prefixes, not one-off user turns or stale evidence that must be refreshed.

**C. Cache the full prompt including the user question so repeated users get faster responses.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Prompt caching pays off on repeated stable prefixes, not one-off user turns or stale evidence that must be refreshed.

**D. Cache only the retrieved documents because they are usually the largest part of the prompt.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Prompt caching pays off on repeated stable prefixes, not one-off user turns or stale evidence that must be refreshed.

**E. Avoid caching few-shot examples because examples can bias later tasks.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Prompt caching pays off on repeated stable prefixes, not one-off user turns or stale evidence that must be refreshed.



## Scenario 12: Architecture decision support

**Official scenario type:** Developer Productivity with Claude

**Case file:** A cloud architecture guild is preparing a Claude architecture for the following situation.

Architects want Claude to help compare design options, draft ADRs, identify risks, and check decisions against internal platform standards. Inputs include user requirements, diagrams, standards, and prior ADRs.

Claude uses retrieval for platform standards, a tool for ADR lookup, and a structured ADR output schema. For complex requests, it asks clarifying questions before recommending an option. It must label tradeoffs and preserve decision rationale.

The first workflow produced polished ADRs that skipped nonfunctional requirements and ignored contradictory prior decisions. It also treated a preferred option in the prompt as a final decision without checking constraints.

**Constraints and artifacts:**
- Prior ADR conflicts must be surfaced.
- Nonfunctional requirements must be represented.
- Recommendations need assumptions and tradeoffs.
- Final ADRs should use the approved schema.

### Questions 124-134

**Question:** **124**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **125**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **126**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **127**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **128**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **129**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **130**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **131**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **132**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **133**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **134**
**Domain:** Context Management & Reliability

A developer assistant uses a 50,000-token stable system prompt, a fixed set of few-shot examples, and a unique user question each turn. Which two prompt-caching choices are best? (Select 2.)
   A. Cache the stable system prompt prefix.
   B. Cache the reusable few-shot examples when they remain identical.
   C. Cache the full prompt including the user question so repeated users get faster responses.
   D. Cache only the retrieved documents because they are usually the largest part of the prompt.
   E. Avoid caching few-shot examples because examples can bias later tasks.

**Answer:** **A, B**

**Explanation:**

**A. Cache the stable system prompt prefix.** ✅ Correct

Prompt caching pays off on repeated stable prefixes, not one-off user turns or stale evidence that must be refreshed.

**B. Cache the reusable few-shot examples when they remain identical.** ✅ Correct

Prompt caching pays off on repeated stable prefixes, not one-off user turns or stale evidence that must be refreshed.

**C. Cache the full prompt including the user question so repeated users get faster responses.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Prompt caching pays off on repeated stable prefixes, not one-off user turns or stale evidence that must be refreshed.

**D. Cache only the retrieved documents because they are usually the largest part of the prompt.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Prompt caching pays off on repeated stable prefixes, not one-off user turns or stale evidence that must be refreshed.

**E. Avoid caching few-shot examples because examples can bias later tasks.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Prompt caching pays off on repeated stable prefixes, not one-off user turns or stale evidence that must be refreshed.



## Scenario 13: Automated pull request repair

**Official scenario type:** Claude Code for CI/CD

**Case file:** A DevOps enablement team is preparing a Claude architecture for the following situation.

The team wants Claude Code to respond to failed pull-request checks by reading logs, making minimal fixes, rerunning relevant tests, and posting a summary for reviewers. The goal is to reduce developer wait time without hiding risk.

GitHub Actions provides logs and artifacts. Claude Code runs in a constrained environment with repository instructions, a CI-fix skill, and commands for package-specific test selection. The system must avoid force-pushes, destructive git operations, and broad formatting churn.

In dry runs, Claude fixed lint errors but ignored a failing integration test. Another run changed generated files and committed snapshots without explaining why. Reviewers need proof of what was run and what remains risky.

**Constraints and artifacts:**
- No force push.
- Generated files are protected.
- Every fix summary must list commands run and residual risk.
- If tests cannot run, the summary must say so plainly.

### Questions 135-145

**Question:** **135**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **136**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **137**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **138**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **139**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **140**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **141**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **142**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **143**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **144**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **145**
**Domain:** Prompt Engineering & Structured Output

A CI review prompt says 'review this PR carefully' and the pipeline fails on vague model concern. What should the architect change? (Select 1.)
   A. Keep the prompt broad but require Claude to include a confidence score for each concern.
   B. Fail only on schema-named categories with mechanically checkable criteria, such as security violation or breaking API change.
   C. Let Claude produce a natural-language severity label and fail on high or critical findings.
   D. Send the entire repository context so Claude has enough background to judge concerns more accurately.

**Answer:** **B**

**Explanation:**

**A. Keep the prompt broad but require Claude to include a confidence score for each concern.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The trap is vague adjectives driving false positives. CI gates need explicit categories and checkable criteria.

**B. Fail only on schema-named categories with mechanically checkable criteria, such as security violation or breaking API change.** ✅ Correct

The trap is vague adjectives driving false positives. CI gates need explicit categories and checkable criteria.

**C. Let Claude produce a natural-language severity label and fail on high or critical findings.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The trap is vague adjectives driving false positives. CI gates need explicit categories and checkable criteria.

**D. Send the entire repository context so Claude has enough background to judge concerns more accurately.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The trap is vague adjectives driving false positives. CI gates need explicit categories and checkable criteria.



## Scenario 14: Release note generation from commits

**Official scenario type:** Claude Code for CI/CD

**Case file:** A release management team is preparing a Claude architecture for the following situation.

Release managers want Claude Code to generate release notes by inspecting commits, issues, and merged pull requests. The output should separate user-facing changes, internal maintenance, migrations, and known issues.

Claude Code can read git history, issue metadata, and templates. It should run in plan mode first, use a structured output template, and avoid including unreleased or unrelated work. A reviewer approves the final notes before publication.

A trial note included internal refactors as customer features and missed a migration warning buried in a PR description. It also linked to a private issue in public notes.

**Constraints and artifacts:**
- Public notes cannot expose private issue links.
- Migration warnings must be prominent.
- Only commits in the release range are in scope.
- Reviewer approval is required before publication.

### Questions 146-156

**Question:** **146**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **147**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **148**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **149**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **150**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **151**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **152**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **153**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **154**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **155**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **156**
**Domain:** Prompt Engineering & Structured Output

A CI review prompt says 'review this PR carefully' and the pipeline fails on vague model concern. What should the architect change? (Select 1.)
   A. Keep the prompt broad but require Claude to include a confidence score for each concern.
   B. Fail only on schema-named categories with mechanically checkable criteria, such as security violation or breaking API change.
   C. Let Claude produce a natural-language severity label and fail on high or critical findings.
   D. Send the entire repository context so Claude has enough background to judge concerns more accurately.

**Answer:** **B**

**Explanation:**

**A. Keep the prompt broad but require Claude to include a confidence score for each concern.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The trap is vague adjectives driving false positives. CI gates need explicit categories and checkable criteria.

**B. Fail only on schema-named categories with mechanically checkable criteria, such as security violation or breaking API change.** ✅ Correct

The trap is vague adjectives driving false positives. CI gates need explicit categories and checkable criteria.

**C. Let Claude produce a natural-language severity label and fail on high or critical findings.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The trap is vague adjectives driving false positives. CI gates need explicit categories and checkable criteria.

**D. Send the entire repository context so Claude has enough background to judge concerns more accurately.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The trap is vague adjectives driving false positives. CI gates need explicit categories and checkable criteria.



## Scenario 15: Security patch verification

**Official scenario type:** Claude Code for CI/CD

**Case file:** A security engineering team is preparing a Claude architecture for the following situation.

A dependency vulnerability requires a patch across several services. The team wants Claude Code to identify affected packages, update code if necessary, run targeted tests, and prepare evidence for security review.

The workflow uses dependency scanning output, repository manifests, service ownership data, and package test commands. Claude Code must distinguish direct from transitive exposure and request approval before changing lockfiles in shared packages.

A previous agent upgraded a root dependency but missed a service-specific override. Another generated a security summary without proof that the vulnerable path was no longer reachable.

**Constraints and artifacts:**
- Lockfile changes require approval.
- Security evidence must cite scanner output and tests.
- Service owners must be named for unresolved exposure.
- Do not claim remediation without verification.

### Questions 157-167

**Question:** **157**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **158**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **159**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **160**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **161**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **162**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **163**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **164**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **165**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **166**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **167**
**Domain:** Prompt Engineering & Structured Output

A CI review prompt says 'review this PR carefully' and the pipeline fails on vague model concern. What should the architect change? (Select 1.)
   A. Keep the prompt broad but require Claude to include a confidence score for each concern.
   B. Fail only on schema-named categories with mechanically checkable criteria, such as security violation or breaking API change.
   C. Let Claude produce a natural-language severity label and fail on high or critical findings.
   D. Send the entire repository context so Claude has enough background to judge concerns more accurately.

**Answer:** **B**

**Explanation:**

**A. Keep the prompt broad but require Claude to include a confidence score for each concern.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The trap is vague adjectives driving false positives. CI gates need explicit categories and checkable criteria.

**B. Fail only on schema-named categories with mechanically checkable criteria, such as security violation or breaking API change.** ✅ Correct

The trap is vague adjectives driving false positives. CI gates need explicit categories and checkable criteria.

**C. Let Claude produce a natural-language severity label and fail on high or critical findings.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The trap is vague adjectives driving false positives. CI gates need explicit categories and checkable criteria.

**D. Send the entire repository context so Claude has enough background to judge concerns more accurately.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The trap is vague adjectives driving false positives. CI gates need explicit categories and checkable criteria.



## Scenario 16: Invoice extraction pipeline

**Official scenario type:** Structured Data Extraction

**Case file:** A finance operations team is preparing a Claude architecture for the following situation.

The finance team receives supplier invoices in PDF, email, and scanned image form. They want Claude to extract vendor, invoice number, purchase order, line items, totals, tax, currency, due date, and exceptions into a validated JSON object.

The workflow uses document text extraction, image OCR when needed, Claude structured output with JSON Schema, validation, retry with error feedback, and a human-review queue for low-confidence or inconsistent documents. Few-shot examples cover normal invoices, credit notes, and missing purchase orders.

The first pipeline returned valid-looking JSON even when totals did not reconcile. It also merged tax and shipping into line items and failed silently when OCR confidence was low.

**Constraints and artifacts:**
- Output must match the schema.
- Totals must reconcile or flag an exception.
- OCR confidence below threshold requires review.
- Retries should include validation errors, not vague instructions.

### Questions 168-178

**Question:** **168**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **169**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **170**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **171**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **172**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **173**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **174**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **175**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **176**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **177**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **178**
**Domain:** Prompt Engineering & Structured Output

An extraction pipeline returns schema-valid JSON, but review finds unsupported fields and missing source evidence. Which two changes best improve reliability? (Select 2.)
   A. Require source spans or page references for extracted fields.
   B. Run semantic validation and retry with the specific validation error.
   C. Add a prompt instruction telling Claude to be stricter about unsupported fields.
   D. Accept parsed JSON automatically and sample a small percentage later for quality review.
   E. Use a broader schema with optional fields so unusual documents do not fail validation.

**Answer:** **A, B**

**Explanation:**

**A. Require source spans or page references for extracted fields.** ✅ Correct

Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.

**B. Run semantic validation and retry with the specific validation error.** ✅ Correct

Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.

**C. Add a prompt instruction telling Claude to be stricter about unsupported fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.

**D. Accept parsed JSON automatically and sample a small percentage later for quality review.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.

**E. Use a broader schema with optional fields so unusual documents do not fail validation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.



## Scenario 17: Contract obligation extraction

**Official scenario type:** Structured Data Extraction

**Case file:** A legal operations team is preparing a Claude architecture for the following situation.

The team wants Claude to extract obligations from customer contracts, including renewal notice periods, security commitments, data residency terms, liability caps, and unusual obligations. The output feeds a contract management system.

Documents are chunked by section with page metadata. Claude returns structured obligations with clause text, page number, confidence, party, deadline, and review flag. A second review pass checks for missed obligations and conflicts.

A pilot extracted obligations but dropped page references and treated definitions as obligations. It also missed a conflict between an addendum and the master agreement.

**Constraints and artifacts:**
- Every extracted obligation needs page and clause reference.
- Definitions are context, not obligations.
- Conflicts must be flagged.
- Low confidence or unusual terms require human review.

### Questions 179-189

**Question:** **179**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **180**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **181**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **182**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **183**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **184**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **185**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **186**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **187**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **188**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **189**
**Domain:** Prompt Engineering & Structured Output

An extraction pipeline returns schema-valid JSON, but review finds unsupported fields and missing source evidence. Which two changes best improve reliability? (Select 2.)
   A. Require source spans or page references for extracted fields.
   B. Run semantic validation and retry with the specific validation error.
   C. Add a prompt instruction telling Claude to be stricter about unsupported fields.
   D. Accept parsed JSON automatically and sample a small percentage later for quality review.
   E. Use a broader schema with optional fields so unusual documents do not fail validation.

**Answer:** **A, B**

**Explanation:**

**A. Require source spans or page references for extracted fields.** ✅ Correct

Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.

**B. Run semantic validation and retry with the specific validation error.** ✅ Correct

Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.

**C. Add a prompt instruction telling Claude to be stricter about unsupported fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.

**D. Accept parsed JSON automatically and sample a small percentage later for quality review.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.

**E. Use a broader schema with optional fields so unusual documents do not fail validation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.



## Scenario 18: Support ticket classification

**Official scenario type:** Structured Data Extraction

**Case file:** A customer experience analytics team is preparing a Claude architecture for the following situation.

Managers want Claude to classify support tickets into product area, issue type, severity, sentiment, root cause, and recommended next action. The output will drive dashboards and escalation queues.

The classifier uses structured output, a taxonomy resource, examples for edge cases, and validation against allowed labels. It can ask for missing context when a ticket is too ambiguous. A batch job processes historical tickets and routes uncertain cases for review.

The first batch overused high severity, invented taxonomy labels, and mixed customer emotion with operational severity. Some records exceeded the context window and lost the most important recent message.

**Constraints and artifacts:**
- Use only allowed taxonomy labels.
- Severity must be evidence-based.
- Customer sentiment is separate from operational severity.
- Recent decisive messages must stay near the model's attention.

### Questions 190-200

**Question:** **190**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **191**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **192**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **193**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **194**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **195**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **196**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **197**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **198**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **199**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **200**
**Domain:** Prompt Engineering & Structured Output

An extraction pipeline returns schema-valid JSON, but review finds unsupported fields and missing source evidence. Which two changes best improve reliability? (Select 2.)
   A. Require source spans or page references for extracted fields.
   B. Run semantic validation and retry with the specific validation error.
   C. Add a prompt instruction telling Claude to be stricter about unsupported fields.
   D. Accept parsed JSON automatically and sample a small percentage later for quality review.
   E. Use a broader schema with optional fields so unusual documents do not fail validation.

**Answer:** **A, B**

**Explanation:**

**A. Require source spans or page references for extracted fields.** ✅ Correct

Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.

**B. Run semantic validation and retry with the specific validation error.** ✅ Correct

Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.

**C. Add a prompt instruction telling Claude to be stricter about unsupported fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.

**D. Accept parsed JSON automatically and sample a small percentage later for quality review.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.

**E. Use a broader schema with optional fields so unusual documents do not fail validation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.



## Scenario 19: Clinical intake normalization

**Official scenario type:** Structured Data Extraction

**Case file:** A healthcare administration team is preparing a Claude architecture for the following situation.

The team wants Claude to normalize patient intake forms into administrative routing fields: appointment type, requested provider, insurance status, urgency, missing documents, and staff follow-up needs. It must not diagnose or recommend treatment.

The system uses schema-constrained output, source-span references, validation, and staff review for urgent or ambiguous cases. Prompts distinguish patient-reported symptoms from verified administrative data.

A test run inferred urgency from symptom wording without routing criteria and summarized symptoms as facts. It also omitted the source field for missing insurance documents.

**Constraints and artifacts:**
- No diagnosis or treatment advice.
- Patient-reported claims must be labeled.
- Urgency routing must follow explicit criteria.
- Missing document decisions need source references.

### Questions 201-211

**Question:** **201**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **202**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **203**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **204**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **205**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **206**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **207**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **208**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **209**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **210**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **211**
**Domain:** Prompt Engineering & Structured Output

An extraction pipeline returns schema-valid JSON, but review finds unsupported fields and missing source evidence. Which two changes best improve reliability? (Select 2.)
   A. Require source spans or page references for extracted fields.
   B. Run semantic validation and retry with the specific validation error.
   C. Add a prompt instruction telling Claude to be stricter about unsupported fields.
   D. Accept parsed JSON automatically and sample a small percentage later for quality review.
   E. Use a broader schema with optional fields so unusual documents do not fail validation.

**Answer:** **A, B**

**Explanation:**

**A. Require source spans or page references for extracted fields.** ✅ Correct

Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.

**B. Run semantic validation and retry with the specific validation error.** ✅ Correct

Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.

**C. Add a prompt instruction telling Claude to be stricter about unsupported fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.

**D. Accept parsed JSON automatically and sample a small percentage later for quality review.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.

**E. Use a broader schema with optional fields so unusual documents do not fail validation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.



## Scenario 20: Incident postmortem evidence synthesis

**Official scenario type:** Multi-Agent Research System

**Case file:** A reliability engineering team is preparing a Claude architecture for the following situation.

After a production incident, engineers want Claude to synthesize logs, chat transcripts, deployment records, alerts, and runbooks into a postmortem draft. The system should identify timeline events, contributing factors, customer impact, and follow-up actions.

A coordinator routes timeline extraction, log analysis, chat summarization, runbook comparison, and action-item synthesis to separate agents. Each agent returns evidence with timestamps and confidence. The coordinator reconciles conflicts before drafting.

The initial postmortem mixed speculation with facts and lost timezone information. It also failed to indicate that one log source was unavailable, causing reviewers to assume coverage was complete.

**Constraints and artifacts:**
- Timestamp and timezone must be preserved.
- Unavailable sources must be disclosed.
- Speculation must be labeled.
- Action items need owners, evidence, and verification criteria.

### Questions 212-222

**Question:** **212**
**Domain:** Agentic Architecture & Orchestration

Given this case, what is the best orchestration boundary for Claude? (Select 1.)
   A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.
   B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.
   C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.
   D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.

**Answer:** **B**

**Explanation:**

**A. Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**B. Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.** ✅ Correct

The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**C. Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.

**D. Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.


**Question:** **213**
**Domain:** Agentic Architecture & Orchestration

Which two design choices best reduce unsafe autonomous action in this scenario? (Select 2.)
   A. Programmatic gates or hooks around irreversible or high-risk tools.
   B. A broader context window that includes the full policy manual for every request.
   C. Clear escalation criteria with structured handoff fields.
   D. A prompt instruction telling Claude to be conservative with high-impact actions.
   E. A post-hoc audit report that reviews completed actions once per day.

**Answer:** **A, C**

**Explanation:**

**A. Programmatic gates or hooks around irreversible or high-risk tools.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**B. A broader context window that includes the full policy manual for every request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**C. Clear escalation criteria with structured handoff fields.** ✅ Correct

Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**D. A prompt instruction telling Claude to be conservative with high-impact actions.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.

**E. A post-hoc audit report that reviews completed actions once per day.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.


**Question:** **214**
**Domain:** Tool Design & MCP Integration

Which tool design is most appropriate for the system described in the case? (Select 1.)
   A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.
   B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.
   C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.
   D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.

**Answer:** **B**

**Explanation:**

**A. A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**B. Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.** ✅ Correct

Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**C. A single orchestration tool that internally calls the right service and returns a concise success or failure message.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.

**D. Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.


**Question:** **215**
**Domain:** Tool Design & MCP Integration

If this system exposes context through MCP, which two resources or tools are best aligned to the case? (Select 2.)
   A. A resource that provides approved policy or taxonomy data with version metadata.
   B. A tool that performs a controlled external action only after required identifiers are present.
   C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.
   D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.
   E. A project-level MCP resource that is available but not explicitly passed to subagents.

**Answer:** **A, B**

**Explanation:**

**A. A resource that provides approved policy or taxonomy data with version metadata.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**B. A tool that performs a controlled external action only after required identifiers are present.** ✅ Correct

MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**C. A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**D. A tool that accepts a free-form instruction and chooses the downstream API operation internally.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.

**E. A project-level MCP resource that is available but not explicitly passed to subagents.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.


**Question:** **216**
**Domain:** Claude Code Configuration & Workflows

For implementation work related to this case, what should Claude Code do first? (Select 1.)
   A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.
   B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.
   C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.
   D. Run the broadest available test command first so the failure output determines where to inspect.

**Answer:** **B**

**Explanation:**

**A. Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**B. Read repository instructions, inspect existing patterns, and produce a plan before changing files.** ✅ Correct

Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**C. Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.

**D. Run the broadest available test command first so the failure output determines where to inspect.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.


**Question:** **217**
**Domain:** Claude Code Configuration & Workflows

Which two Claude Code workflow controls are most important here? (Select 2.)
   A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.
   B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.
   C. Run focused verification commands and report what did or did not run.
   D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.
   E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.

**Answer:** **A, C**

**Explanation:**

**A. Use CLAUDE.md or AGENTS.md rules to encode repository constraints.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**B. Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**C. Run focused verification commands and report what did or did not run.** ✅ Correct

Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**D. Keep project rules in the developer's user-level Claude memory so they apply across all repositories.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.

**E. Use only the generic Claude Code workflow so custom skills do not bias the implementation.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, C because Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.


**Question:** **218**
**Domain:** Prompt Engineering & Structured Output

Which prompt/output strategy best fits this case? (Select 1.)
   A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.
   B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.
   C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.
   D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.

**Answer:** **B**

**Explanation:**

**A. Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**B. Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.** ✅ Correct

Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**C. Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.

**D. Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.


**Question:** **219**
**Domain:** Prompt Engineering & Structured Output

Which two prompt details should be preserved in the case output? (Select 2.)
   A. Source or evidence references for important claims.
   B. Assumptions, uncertainty, or review flags when evidence is incomplete.
   C. A concise confidence score without requiring the source evidence behind it.
   D. A final natural-language rationale that explains why validation warnings can be accepted.
   E. A compact summary of reasoning steps instead of source-linked output fields.

**Answer:** **A, B**

**Explanation:**

**A. Source or evidence references for important claims.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**B. Assumptions, uncertainty, or review flags when evidence is incomplete.** ✅ Correct

The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**C. A concise confidence score without requiring the source evidence behind it.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**D. A final natural-language rationale that explains why validation warnings can be accepted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.

**E. A compact summary of reasoning steps instead of source-linked output fields.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.


**Question:** **220**
**Domain:** Context Management & Reliability

What is the strongest context-management improvement for this scenario? (Select 1.)
   A. Send the complete available history so Claude can decide which details matter.
   B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.
   C. Summarize the entire context at each turn and rely on the summary as the source of truth.
   D. Give each subagent access to the same large context bundle so no context is accidentally omitted.

**Answer:** **B**

**Explanation:**

**A. Send the complete available history so Claude can decide which details matter.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**B. Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.** ✅ Correct

Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**C. Summarize the entire context at each turn and rely on the summary as the source of truth.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.

**D. Give each subagent access to the same large context bundle so no context is accidentally omitted.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Good context management is selective, ordered, source-linked, and explicit about what each agent receives.


**Question:** **221**
**Domain:** Context Management & Reliability

Which two reliability behaviors should the final system demonstrate? (Select 2.)
   A. Escalate or ask for clarification when required evidence is missing.
   B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.
   C. Use cached prior results when the same user or repository appears in a later request.
   D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.
   E. Prefer an answer with caveats over asking for clarification when the user expects speed.

**Answer:** **A, B**

**Explanation:**

**A. Escalate or ask for clarification when required evidence is missing.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**B. Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.** ✅ Correct

Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**C. Use cached prior results when the same user or repository appears in a later request.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**D. Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.

**E. Prefer an answer with caveats over asking for clarification when the user expects speed.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is A, B because Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.


**Question:** **222**
**Domain:** Agentic Architecture & Orchestration

One research subagent fails after other subagents have already stored findings and created review artifacts. What should the coordinator do first? (Select 1.)
   A. Rerun the full workflow so all subagent outputs are produced from the same fresh context.
   B. Retry or replace only the failed subtask and preserve successful side-effecting work.
   C. Ask the synthesis subagent to proceed using the successful outputs and mark the missing section as low confidence.
   D. Merge the failed subagent's partial notes into the final answer and let human reviewers catch any gaps.

**Answer:** **B**

**Explanation:**

**A. Rerun the full workflow so all subagent outputs are produced from the same fresh context.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.

**B. Retry or replace only the failed subtask and preserve successful side-effecting work.** ✅ Correct

Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.

**C. Ask the synthesis subagent to proceed using the successful outputs and mark the missing section as low confidence.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.

**D. Merge the failed subagent's partial notes into the final answer and let human reviewers catch any gaps.** ❌ Incorrect

This is a plausible distractor, but it does not best satisfy the scenario constraints. The correct answer is B because Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.



# Speed Round

These are not exam scenarios. They are fast recall drills for teaching, warmups, and end-of-class review. Each official domain has core prompts plus added trap drills with an answer and guidance.

## Speed Round: Agentic Architecture & Orchestration

1. What controls the Agent SDK loop after Claude returns tool_use?
   Answer: Execute the requested tool, append the tool result, and call Claude again.
   Guidance: The loop is driven by stop_reason, not by parsing the assistant's prose. Valid stop_reason values: end_turn, max_tokens, stop_sequence, tool_use, pause_turn, refusal, model_context_window_exceeded.

2. What stop_reason normally ends an agent loop?
   Answer: end_turn.
   Guidance: When Claude is done using tools, the final answer is returned on end_turn.

3. What is a common way that we might test for loop completion incorrectly because it is brittle and inconsistent?
   Answer: Checking assistant text for words like complete or done.
   Guidance: Text parsing is brittle; use explicit stop_reason values.

4. What is a coordinator responsible for in a multi-agent system?
   Answer: Decomposition, routing, aggregation, and error handling.
   Guidance: Subagents do focused work; the coordinator owns the overall task state.

5. Do subagents automatically inherit parent context?
   Answer: No.
   Guidance: Pass source material, constraints, and expected output explicitly.

6. How do you spawn parallel subagents?
   Answer: Emit multiple Task tool calls in one coordinator response.
   Guidance: Parallel delegation is a coordination pattern, not separate user turns.

7. When should a workflow use a deterministic solution like a gate or hook?
   Answer: When a rule must be enforced reliably before an action.
   Guidance: Refund thresholds, identity checks, and permission checks should not rely on prompt text alone.

8. What should the coordinator do when subagent coverage is incomplete?
   Answer: Send targeted follow-up tasks or escalate the gap.
   Guidance: Iterative refinement is expected when evidence is missing.

9. What is context isolation good for?
   Answer: Reducing cross-task contamination and keeping specialists focused.
   Guidance: Isolation helps, but only if the coordinator passes needed context.

10. What should happen to partial failures in a multi-agent system?
   Answer: They should be captured, surfaced, and handled by the coordinator.
   Guidance: Hiding failures creates false confidence.

11. What is the safest way to handle an irreversible action?
   Answer: Require explicit prerequisites and a programmatic control before tool execution.
   Guidance: The exam favors enforceable guardrails for high-impact actions.

12. What is a good subagent prompt include?
   Answer: Task, relevant context, sources, constraints, output schema, and success criteria.
   Guidance: A subagent cannot reliably infer missing context.

13. What should a coordinator aggregate?
   Answer: Findings, confidence, sources, errors, and unresolved gaps.
   Guidance: A coordinator is not just writing a nicer summary of subagent outputs. It is responsible for combining the work into a usable decision package. Aggregation is more than summarization.

14. When should a coordinator ask for clarification?
   Answer: When required inputs or decision criteria are missing.
   Guidance: Clarification beats guessing.

15. What is over-decomposition?
   Answer: Splitting work so narrowly that important coverage is lost.
   Guidance: Subtasks should map to meaningful responsibility boundaries.

16. What is under-decomposition?
   Answer: Giving one agent too much broad work without specialization.
   Guidance: Complex scenarios often benefit from role-based subagents.

17. What makes a routing decision exam-worthy?
   Answer: It is explicit, evidence-based, and tied to agent/tool capability.
   Guidance: Do not route based on vague labels.

18. What should happen after a tool error?
   Answer: Record the error, decide retry/escalation policy, and avoid claiming success.
   Guidance: Tool errors are part of the state.

19. Why use a coordinator instead of peer agents only?
   Answer: To preserve task state, resolve conflicts, and produce a coherent final answer.
   Guidance: Peer-only systems can lose authority and accountability.

20. What is the core architecture instinct for Domain 1?
   Answer: Make control flow explicit and keep authority boundaries clear.
   Guidance: Agentic architecture questions usually test orchestration discipline.

21. What is the blanket retry trap?
   Answer: Rerunning every subagent after one subagent fails.
   Guidance: Retry only the failed or incomplete subtask when other subagents already produced valid work or side effects.

22. What should the coordinator do after one side-effecting subagent succeeds and another fails?
   Answer: Preserve successful work, retry the failed subtask if policy allows, and disclose the gap.
   Guidance: A full rerun can duplicate external actions.

23. What is the inspect-execute-append-call loop?
   Answer: Inspect stop_reason, execute requested tool, append tool_result, call Claude again.
   Guidance: Dropping append often makes Claude repeat the same tool call.

24. What is the stateless API trap?
   Answer: Assuming Claude remembers prior API calls without conversation history.
   Guidance: The application owns state and loop control.

25. When is adaptive decomposition better than a fixed pipeline?
   Answer: When the next subtask depends on what earlier evidence reveals.
   Guidance: Open-ended investigations often need dynamic routing.


## Speed Round: Tool Design & MCP Integration

1. What makes a good tool description?
   Answer: It clearly states purpose, required inputs, side effects, and when not to use it.
   Guidance: Claude chooses tools based heavily on descriptions.

2. What is a poor tool design?
   Answer: A broad do_everything tool with free-text arguments.
   Guidance: Broad tools obscure intent, validation, and safety boundaries.

3. How should tool errors be returned?
   Answer: Structured status with a clear error message and recoverable details.
   Guidance: The model needs machine-readable failure context.

4. What does tool_choice help control?
   Answer: Whether Claude may, must, or must not use tools.
   Guidance: Use it to constrain tool behavior for the task.

5. When is a read-only MCP resource appropriate?
   Answer: When Claude needs stable context such as policy, schema, or documentation.
   Guidance: Resources provide context; tools perform actions.

6. When is an MCP tool appropriate?
   Answer: When Claude needs to perform a controlled operation with typed inputs.
   Guidance: Tools should have scoped authority.

7. What metadata should MCP resources preserve?
   Answer: Version, source, date, owner, and access context when relevant.
   Guidance: Metadata supports provenance and freshness decisions.

8. Why avoid arbitrary code execution tools?
   Answer: They create broad security and reliability risk.
   Guidance: Constrain tools to purposeful operations.

9. What should a tool schema validate?
   Answer: Required identifiers, allowed values, formats, and action prerequisites.
   Guidance: Validation catches failures before unsafe execution.

10. What is the best response to missing required tool input?
   Answer: Ask for the missing input or use a lookup tool if available.
   Guidance: Do not invent identifiers.

11. How should side effects be documented?
   Answer: Explicitly in the tool description and guarded by prerequisites.
   Guidance: Claude must know when a tool changes external state.

12. What is the difference between a resource and a tool?
   Answer: A resource supplies context; a tool performs work.
   Guidance: Mixing the two leads to unclear authority.

13. How should authentication failures be handled?
   Answer: Return structured permission error context and escalation guidance.
   Guidance: Retry loops cannot fix missing permissions.

14. What should happen when a tool times out?
   Answer: Classify the failure, retry only if policy allows, and disclose uncertainty.
   Guidance: Timeouts are evidence gaps.

15. What is a good tool naming pattern?
   Answer: Specific verb-noun names like lookup_order or create_refund_request.
   Guidance: Names should reveal intent.

16. What is an isError-style signal for?
   Answer: Letting Claude distinguish failed tool results from successful data.
   Guidance: Without an error signal, failures can be treated as facts.

17. What should tool outputs avoid?
   Answer: Unstructured blobs when the next step requires reliable parsing.
   Guidance: Structured outputs support downstream decisions.

18. How do you reduce unsafe tool use?
   Answer: Limit allowed tools, use precise descriptions, validate inputs, and gate risky calls.
   Guidance: Defense is layered.

19. What is an MCP integration trap?
   Answer: Assuming resources are automatically available to all agents.
   Guidance: Context still has to be routed intentionally.

20. What is the core architecture instinct for Domain 2?
   Answer: Design narrow, typed, well-described tools with explicit errors and authority.
   Guidance: Tool questions usually test contract quality.

21. When should MCP use stdio transport?
   Answer: When the server can run on the same machine as the client.
   Guidance: stdio avoids network/auth overhead for local integrations.

22. When should MCP use SSE or remote HTTP transport?
   Answer: When the MCP server must live on another host or serve multiple remote clients.
   Guidance: Remote transport adds auth and network design concerns.

23. What is the SSE-on-localhost trap?
   Answer: Choosing remote/SSE transport for a server that can run locally with the client.
   Guidance: The exam often rewards stdio for same-machine MCP servers.

24. What should a tool description include beyond purpose?
   Answer: When to use it over similar tools, example arguments, side effects, and error conditions.
   Guidance: Tool descriptions are part of the model's selection interface.

25. What is the sibling-tool ambiguity trap?
   Answer: Multiple similar tools with descriptions like 'gets user info'.
   Guidance: Disambiguate tools or Claude may choose randomly.


## Speed Round: Claude Code Configuration & Workflows

1. What should Claude Code read before editing?
   Answer: Repository instructions such as AGENTS.md, CLAUDE.md, and relevant local docs.
   Guidance: Local rules are part of the task contract.

2. What is Plan Mode for?
   Answer: Thinking through scope and approach before making changes.
   Guidance: Use it for risky or multi-step edits.

3. What should Claude Code do before broad refactors?
   Answer: Confirm scope and match existing patterns.
   Guidance: Unrelated churn is a review risk.

4. What belongs in a slash command?
   Answer: Repeatable repo-specific workflows or checks.
   Guidance: Commands make common workflows consistent.

5. What belongs in a skill?
   Answer: Reusable procedural knowledge with clear trigger conditions.
   Guidance: Skills help standardize complex workflows.

6. How should Claude Code report tests?
   Answer: List exactly what ran, what passed, what failed, and what was not run.
   Guidance: Do not imply verification that did not happen.

7. What is a destructive git operation?
   Answer: Commands like reset hard or checkout that discard work.
   Guidance: These require explicit user approval.

8. How should generated files be handled?
   Answer: Respect repo rules; do not edit protected generated files unless instructed.
   Guidance: Generated artifacts often have source owners.

9. What should a PR summary emphasize?
   Answer: Behavioral change, tests, risks, and reviewer notes.
   Guidance: A file list is not enough.

10. What should happen when tests time out?
   Answer: Report the timeout and run narrower diagnostics if useful.
   Guidance: Do not claim success.

11. Why inspect existing patterns first?
   Answer: To avoid inventing incompatible abstractions.
   Guidance: Claude Code should work with the codebase.

12. When should Claude Code ask before changing lockfiles?
   Answer: When repo policy or risk indicates dependency changes need approval.
   Guidance: Lockfiles can affect broad dependency state.

13. What is a focused verification command?
   Answer: The smallest meaningful test or lint command for the changed surface.
   Guidance: Focused tests provide faster evidence.

14. What is a CI repair anti-pattern?
   Answer: Changing snapshots or dependencies without proving the root cause.
   Guidance: Fix evidence, not symptoms.

15. How should Claude Code handle unresolved failures?
   Answer: Document them plainly with likely cause and next step.
   Guidance: Transparency matters.

16. What should repository memory files contain?
   Answer: Durable project guidance, not ad hoc hidden assumptions.
   Guidance: Memory should be explicit and maintainable.

17. What is a good Claude Code handoff?
   Answer: Context, files changed, commands run, residual risk, and suggested next action.
   Guidance: Handoffs should let a human resume easily.

18. How should Claude Code handle conflicting instructions?
   Answer: Follow precedence and ask if the conflict blocks safe action.
   Guidance: Instruction hierarchy matters.

19. What is the risk of oversized context in Claude Code?
   Answer: Important constraints can get lost or stale.
   Guidance: Summaries and scoped reads help.

20. What is the core architecture instinct for Domain 3?
   Answer: Use repo-local rules, plan before risky edits, verify honestly, and keep diffs scoped.
   Guidance: Claude Code questions test workflow discipline.

21. Where should team-shared Claude Code rules live?
   Answer: In committed project-level instructions such as repo CLAUDE.md or AGENTS.md.
   Guidance: User-level config is private and does not ship to teammates.

22. What belongs in user-level Claude Code memory?
   Answer: Personal preferences that should apply only to that user.
   Guidance: Do not put team policy where the team cannot see it.

23. What is the project-vs-user CLAUDE.md trap?
   Answer: Putting shared repo behavior in a home-directory file.
   Guidance: The grader expects shared rules in repo/project scope.

24. What should a read-only review slash command restrict?
   Answer: Allowed tools to read/search tools, excluding write/edit/bash when not needed.
   Guidance: Slash command frontmatter can reduce accidental side effects.

25. What should CI review fail on?
   Answer: Explicit schema categories with defined severity and evidence.
   Guidance: Vague model concern should not fail a pipeline by itself.


## Speed Round: Prompt Engineering & Structured Output

1. When should you use structured output?
   Answer: When downstream code or review needs reliable fields.
   Guidance: Schemas reduce ambiguity.

2. What should a retry include after schema validation fails?
   Answer: The validation errors and the original task context.
   Guidance: Specific feedback beats vague retry instructions.

3. What is few-shot prompting best for?
   Answer: Teaching format and edge-case distinctions.
   Guidance: Examples shape behavior more concretely than abstract rules.

4. What is a structured extraction risk?
   Answer: Valid-looking JSON with wrong or unsupported content.
   Guidance: Validation must check semantics when possible.

5. What should be included for source-grounded answers?
   Answer: Citations, source labels, or evidence references.
   Guidance: Grounding enables review.

6. What should the model do when evidence is incomplete?
   Answer: Flag uncertainty or request missing context.
   Guidance: Do not fill gaps with invention.

7. What is an output schema field good for?
   Answer: Making required decisions explicit and machine-checkable.
   Guidance: Schema design is part of prompt engineering.

8. Why separate assumptions from facts?
   Answer: So reviewers can see what is proven and what is inferred.
   Guidance: This is common in exam scenarios.

9. What is a batch-processing risk?
   Answer: Systematic errors scale across many records.
   Guidance: Use evals, sampling, and review queues.

10. How should prompts treat critical constraints?
   Answer: Put them clearly near the task and output requirements.
   Guidance: Avoid burying them in long context.

11. What is a good review pass for extraction?
   Answer: Check missing fields, conflicts, confidence, and source references.
   Guidance: Second passes catch omissions.

12. Why avoid parsing polished prose?
   Answer: It is less reliable than constrained structured output.
   Guidance: Use JSON/schema when a machine consumes the result.

13. What should a confidence field mean?
   Answer: A defined signal tied to evidence quality.
   Guidance: Uncalibrated confidence is weak.

14. How do you handle multiple-response questions in prompts?
   Answer: State exactly how many selections are expected.
   Guidance: Ambiguity creates scoring errors.

15. What should a prompt do with policy exceptions?
   Answer: Ask the model to flag exception conditions explicitly.
   Guidance: Exceptions often drive escalation.

16. What is a common prompt anti-pattern?
   Answer: One huge prompt with hidden goals and no output contract.
   Guidance: Clarity and structure win.

17. When should human review be routed?
   Answer: Low confidence, high impact, policy conflict, or missing evidence.
   Guidance: Review criteria should be explicit.

18. What makes guidance useful?
   Answer: It explains the principle, not just the answer.
   Guidance: Guidance helps transfer to new scenarios.

19. What should be avoided in final answers?
   Answer: Hidden chain-of-thought requests and unsupported certainty.
   Guidance: Use concise rationale instead.

20. What is the core architecture instinct for Domain 4?
   Answer: Constrain outputs, teach edge cases, validate, and preserve evidence.
   Guidance: Prompt questions test reliability under ambiguity.

21. What is the vague adjective trap?
   Answer: Prompts like 'review carefully' or 'be thorough' without checkable criteria.
   Guidance: Replace adjectives with numbered, mechanically checkable rules.

22. How do you reduce CI false positives from Claude review?
   Answer: Use explicit violation categories and fail only on named categories that meet criteria.
   Guidance: Teams ignore noisy gates.

23. What is the reliable alternative to 'return JSON' in prose?
   Answer: Define a schema-producing tool and force tool use when appropriate.
   Guidance: Tool-use input schemas are more reliable than prose-only formatting requests.

24. What should a validation retry include?
   Answer: The exact validation error and a request to correct the prior output.
   Guidance: Blind retries repeat mistakes.

25. What is the schema-valid-but-wrong trap?
   Answer: JSON parses but values are unsupported, stale, or semantically invalid.
   Guidance: Add semantic checks, evidence fields, and review routing.


## Speed Round: Context Management & Reliability

1. What is lost-in-the-middle?
   Answer: Important context being underused when buried in long inputs.
   Guidance: Position and compactness matter.

2. How should critical context be ordered?
   Answer: Place instructions, constraints, and current evidence where the model can use them.
   Guidance: Do not bury decisive facts.

3. What should happen when context is too large?
   Answer: Summarize, retrieve selectively, or split work with explicit handoffs.
   Guidance: More context is not always better.

4. Why preserve source metadata?
   Answer: It supports provenance, freshness checks, and review.
   Guidance: Context without sources is harder to trust.

5. What is a good escalation trigger?
   Answer: Missing required evidence, low confidence, high-impact action, or policy conflict.
   Guidance: Escalation should be rule-based.

6. What should be disclosed in internal handoffs?
   Answer: Tool errors, missing inputs, assumptions, confidence, and attempted actions.
   Guidance: Handoffs need operational truth.

7. Why avoid stale tool results?
   Answer: Files, records, or policies may have changed.
   Guidance: Refresh or summarize with timestamps.

8. What is confidence calibration?
   Answer: Tying confidence to evidence quality and uncertainty.
   Guidance: Confidence should not be a vibes score.

9. What should happen with contradictory sources?
   Answer: Surface the conflict and resolve or escalate it.
   Guidance: Do not average contradictions into a false answer.

10. What is a reliable final answer?
   Answer: Grounded, appropriately scoped, and honest about uncertainty.
   Guidance: Reliability includes saying what is not known.

11. How should long documents be chunked?
   Answer: With section boundaries, page/source metadata, and task-relevant retrieval.
   Guidance: Chunking should preserve meaning.

12. What is a context handoff?
   Answer: A structured package of relevant facts, sources, constraints, and next task.
   Guidance: Handoffs prevent context loss.

13. When should the system ask a clarifying question?
   Answer: When the answer depends on missing user intent or required data.
   Guidance: Guessing can create unsafe outcomes.

14. What does provenance mean?
   Answer: Where a claim or field came from.
   Guidance: Provenance enables audit.

15. What is an evidence gap?
   Answer: A required fact that the system does not have.
   Guidance: Gaps should be visible.

16. How should tool failures affect confidence?
   Answer: They should lower confidence or trigger retry/escalation.
   Guidance: Failures are not neutral.

17. What is a reliability anti-pattern?
   Answer: Returning a confident answer after missing or failed evidence.
   Guidance: This is a common exam trap.

18. What should be compacted in a long-running session?
   Answer: Stable conclusions and relevant state, not raw noise.
   Guidance: Compaction should preserve decisions and evidence.

19. Why label user-provided claims?
   Answer: They are not the same as verified records.
   Guidance: This matters in support, legal, and healthcare scenarios.

20. What is the core architecture instinct for Domain 5?
   Answer: Manage context deliberately and make uncertainty operationally visible.
   Guidance: Reliability questions test evidence discipline.

21. What is the summarization trap for support conversations?
   Answer: Summarizing a long thread when exact IDs, amounts, or policy exceptions matter.
   Guidance: Extract durable facts into a structured case block instead.

22. Where should durable case facts sit in a long context?
   Answer: Near the current task or end of the context where attention is strongest.
   Guidance: Do not bury decisive facts in the middle.

23. What should be prompt-cached?
   Answer: Stable repeated prefixes such as system prompts and fixed few-shot examples.
   Guidance: Caching helps when the prefix repeats exactly.

24. What should not be prompt-cached?
   Answer: Unique user turns or evidence that changes and needs freshness checks.
   Guidance: One-off content creates poor cache hits and can preserve stale context.

25. What is the confidence trap?
   Answer: Letting the model sound certain after missing tools, stale sources, or incomplete evidence.
   Guidance: Confidence should fall or trigger escalation when evidence is weak.


## Instructor Notes

- For a 60-question simulation, assign scenario-based question blocks that total 60 questions.
- For a 20-minute review block, assign one speed-round domain and have students answer aloud before revealing guidance.
- For every miss, identify the scenario evidence, official domain, primitive tested, and reliability principle missed.
- This practice exam is original training material, not copied exam content.
