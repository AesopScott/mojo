# Anthropic Architect Foundations Exam Prep Course

Audience: developers, solution architects, AI platform leads, and technical consultants preparing for the Anthropic Architect Foundations exam.

Format: 4 sessions, 2.5 hours each, plus self-study and practice exam. Adjust to 2 full days by combining Sessions 1-2 and 3-4.

Last updated: 2026-07-09. Revised against official Anthropic Architect Foundations Exam Guide, version 1.0, effective July 2026, exam code `CCAR-F`.

## Source Baseline

Official source spine:

- Anthropic Academy course catalog: https://anthropic.skilljar.com/
- Building with the Claude API: https://anthropic.skilljar.com/claude-with-the-anthropic-api
- Introduction to Model Context Protocol: https://anthropic.skilljar.com/introduction-to-model-context-protocol
- Building effective agents: https://www.anthropic.com/engineering/building-effective-agents
- Claude Code subagents: https://code.claude.com/docs/en/sub-agents
- Claude Code settings: https://code.claude.com/docs/en/settings
- Claude Code environment variables: https://code.claude.com/docs/en/env-vars
- Claude Agent SDK: https://code.claude.com/docs/en/agent-sdk/overview
- Tool use: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
- Prompting best practices: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- Prompt caching: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- Extended thinking: https://platform.claude.com/docs/en/build-with-claude/extended-thinking
- Agent Skills: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview

Exam details to verify with the official candidate guide before class:

- Number of items: 60.
- Format: multiple-choice and multiple-response; each item states how many responses to select.
- Structure: 4 scenarios drawn from a bank of 6.
- Time limit: 120 minutes.
- Passing score: scaled score of 720 on a 100-1,000 scale.
- Delivery: proctored online and/or Pearson test center.
- Fee: $125 USD.
- Validity: 12 months.

## Official Scenario Bank

The exam presents 4 scenarios drawn from these 6:

| Scenario | Primary Coverage |
| --- | --- |
| Customer Support Resolution Agent | Agent SDK, MCP tools, escalation, refunds, handoff, reliability |
| Code Generation with Claude Code | Claude Code configuration, plan mode, direct execution, context |
| Multi-Agent Research System | coordinator-subagent orchestration, explicit context passing, cited synthesis |
| Developer Productivity with Claude | built-in tools, codebase exploration, MCP integrations |
| Claude Code for CI/CD | `claude -p`, JSON output, PR feedback, false positive reduction, batch tradeoffs |
| Structured Data Extraction | JSON Schema, Pydantic validation, confidence, edge cases |

## Course Outcomes

By end of course, learners can:

- Choose between single-call Claude, workflow, and agent architectures.
- Design prompt chains, routing, parallelization, orchestrator-worker, and evaluator-optimizer systems.
- Explain how tools, MCP, skills, subagents, hooks, settings, environment variables, and permissions fit together.
- Build prompt and context strategies for reliability, cost, latency, and maintainability.
- Diagnose scenario questions by choosing simplest architecture that satisfies constraints.
- Recognize exam traps: over-agentifying, vague tools, unmanaged context, unsafe permissions, and weak evaluation.

## Exam Readiness Map

Use this as teaching emphasis, not official weighting unless confirmed from the guide.

| Domain | Teaching Weight | Core Decisions |
| --- | ---: | --- |
| Agentic Architecture & Orchestration | 27% | `stop_reason` loops, coordinator-subagent systems, hooks, decomposition, sessions |
| Tool Design & MCP Integration | 18% | tool descriptions, structured errors, scoped tools, `tool_choice`, MCP config, built-in tools |
| Claude Code Configuration & Workflows | 20% | `CLAUDE.md`, rules, commands, skills, plan mode, CI/CD |
| Prompt Engineering & Structured Output | 20% | few-shot, JSON Schema, `tool_use`, validation, retries, batches, multi-pass reviews |
| Context Management & Reliability | 15% | context preservation, escalation, error propagation, provenance, confidence calibration |

## Instructor Positioning

Frame exam as architecture judgment test, not memorization test.

Most answers should follow this order:

1. Identify official scenario and domain.
2. Identify the operational primitive being tested.
3. Prefer deterministic enforcement over prompt guidance when compliance is mandatory.
4. Pass context explicitly across subagents.
5. Return structured errors and validation feedback.
6. Preserve provenance and confidence for high-stakes outputs.
7. Choose plan mode, direct execution, batch, or real-time execution based on task complexity and latency.

## Session 1 - Agent SDK Architecture and Orchestration

Time: 2.5 hours.

### Learning Goals

- Implement correct agentic loop control flow using `stop_reason`.
- Design coordinator-subagent systems with explicit context passing.
- Use Task tool spawning, `allowedTools`, parallel subagents, and structured handoffs.
- Apply hooks for deterministic enforcement and data normalization.
- Choose session resumption vs fresh summary vs `fork_session`.

### Agenda

| Time | Topic | Instructor Notes |
| ---: | --- | --- |
| 0:00-0:15 | Exam framing | Official 6 scenarios, weights, multiple-response format. |
| 0:15-0:45 | Agentic loop | `tool_use` continues, `end_turn` terminates; append tool results. |
| 0:45-1:05 | Coordinator-subagent systems | Hub-and-spoke, Task tool, explicit context, parallel spawning. |
| 1:05-1:15 | Break |  |
| 1:15-1:45 | Enforcement and hooks | `PostToolUse`, tool-call interception, prerequisites, refund thresholds. |
| 1:45-2:10 | Sessions | `--resume`, `fork_session`, stale tool results, structured summaries. |
| 2:10-2:30 | Lab 1 | Design customer support resolution agent loop and escalation handoff. |

### Key Concepts

- Use `stop_reason`, not natural language parsing, for loop control.
- Subagents do not inherit parent context automatically.
- Coordinator routes all subagent communication for observability and error handling.
- Hooks provide deterministic guarantees when prompt-only compliance is insufficient.
- Starting fresh with structured summary can be safer than resuming stale tool results.

### Lab 1 - Agent Loop and Handoff

Scenario:

Customer support agent handles return, billing dispute, and account issue in one conversation. It has MCP tools: `get_customer`, `lookup_order`, `process_refund`, `escalate_to_human`.

Student design must include:

- loop control based on `stop_reason`.
- prerequisite gate before `process_refund`.
- parallel investigation of distinct concerns when possible.
- structured escalation handoff: customer ID, root cause, refund amount, recommended action, policy gaps.
- hook for refund amount threshold.

Debrief:

- What changed? Role, task, constraints, evidence boundary, schema, confidence.
- Exam move: when output is inconsistent, first improve instructions/examples/schema before changing model or adding agents.

## Session 2 - Tool Design, MCP, and Claude Code Workflows

Time: 2.5 hours.

### Learning Goals

- Design effective tools and MCP interfaces.
- Implement structured MCP error responses.
- Configure tool distribution and `tool_choice`.
- Choose built-in Claude Code tools correctly.
- Configure `CLAUDE.md`, rules, commands, skills, plan mode, and CI.

### Agenda

| Time | Topic | Instructor Notes |
| ---: | --- | --- |
| 0:00-0:25 | Tool interface design | descriptions, boundaries, examples, splitting vs consolidating. |
| 0:25-0:50 | MCP errors and config | `isError`, category, retryable, env expansion, project/user scope. |
| 0:50-1:20 | Tool distribution | scoped tools per subagent, `tool_choice` auto/any/forced, built-in tools. |
| 1:20-1:30 | Break |  |
| 1:30-2:00 | Claude Code config | `CLAUDE.md`, `@import`, `.claude/rules`, commands, skills. |
| 2:00-2:20 | Workflow choice | plan mode vs direct execution, `claude -p`, JSON output in CI. |
| 2:20-2:30 | Quiz review | Focus on exact primitive and scope. |

### Key Concepts

- Minimal tool descriptions lead to unreliable tool selection.
- Similar tools need clear differentiators.
- Uniform "operation failed" errors prevent recovery.
- Access failure is not same as valid empty result.
- Too many tools can degrade selection.
- `tool_choice: "any"` forces a tool call; forced tool requires one named tool first.
- `claude -p` is the non-interactive CI flag.
- Message Batches API is for latency-tolerant batch work, not blocking PR gates.

### Lab 2 - Tool Design

Scenario:

Claude helps finance analysts answer invoice questions. It can search invoices, fetch invoice details, and create payment dispute tickets.

Poor tool:

```json
{
  "name": "do_invoice_stuff",
  "description": "Does things with invoices",
  "input_schema": {
    "type": "object",
    "properties": {
      "data": { "type": "string" }
    }
  }
}
```

Better tool set:

```json
[
  {
    "name": "search_invoices",
    "description": "Search invoice records by vendor name, invoice number, date range, amount range, or payment status. Use this before fetching details when the exact invoice ID is unknown.",
    "input_schema": {
      "type": "object",
      "properties": {
        "vendor_name": { "type": "string" },
        "invoice_number": { "type": "string" },
        "status": { "type": "string", "enum": ["open", "paid", "overdue", "disputed"] },
        "start_date": { "type": "string", "description": "ISO date YYYY-MM-DD" },
        "end_date": { "type": "string", "description": "ISO date YYYY-MM-DD" }
      }
    }
  },
  {
    "name": "get_invoice",
    "description": "Fetch one invoice by exact invoice_id. Use only after invoice_id is known.",
    "input_schema": {
      "type": "object",
      "required": ["invoice_id"],
      "properties": {
        "invoice_id": { "type": "string" }
      }
    }
  },
  {
    "name": "create_dispute_ticket",
    "description": "Create a payment dispute ticket. Use only when user explicitly asks to dispute or approve creation after Claude explains evidence.",
    "input_schema": {
      "type": "object",
      "required": ["invoice_id", "reason", "evidence"],
      "properties": {
        "invoice_id": { "type": "string" },
        "reason": { "type": "string" },
        "evidence": { "type": "string" }
      }
    }
  }
]
```

Debrief:

- Separate search/read/write.
- Gate side effects.
- Use descriptions to prevent wrong call order.
- Prefer explicit IDs and enums.

## Session 3 - Prompt Engineering, Structured Output, and Review Systems

Time: 2.5 hours.

### Learning Goals

- Design prompts with explicit precision criteria.
- Use few-shot prompting for ambiguous cases and format consistency.
- Enforce structured output using `tool_use` and JSON Schema.
- Implement Pydantic validation, semantic validation, and retry loops.
- Choose batch vs real-time and multi-pass review structures.

### Agenda

| Time | Topic | Instructor Notes |
| ---: | --- | --- |
| 0:00-0:25 | Precision prompts | explicit criteria, false positive reduction, extraction patterns. |
| 0:25-0:55 | Few-shot | ambiguous cases, format examples, generalization. |
| 0:55-1:10 | JSON Schema | required/optional/nullable, enum, other+detail, strict mode. |
| 1:10-1:20 | Break |  |
| 1:20-1:45 | Validation loops | Pydantic, semantic errors, validation retries. |
| 1:45-2:05 | Batch and review | Message Batches, custom_id, multi-pass review, sequential vs parallel issue resolution. |
| 2:05-2:30 | Lab 3 | Structured data extraction design. |

### Structured Output Decision Guide

| Need | Use | Watch For |
| --- | --- | --- |
| Syntax-valid JSON | `tool_use` plus JSON Schema | do not rely on prose-only "return JSON" |
| Missing fields | nullable values plus evidence/confidence | do not force hallucinated values |
| Category extraction | enum plus `"other"` detail field | avoid brittle closed set |
| Semantic correctness | Pydantic/custom validation | syntax valid can still be semantically wrong |
| Batch cost savings | Message Batches API | unsuitable for blocking work; no multi-turn tool calls |
| Large PR review | per-file pass plus cross-file integration pass | larger context alone does not solve attention dilution |

### Lab 3 - Extraction System

Design a structured extraction system for unstructured documents. Include:

- JSON Schema with nullable missing fields.
- enum plus `"other"` detail pattern.
- Pydantic validation.
- retry prompt using validation errors.
- field-level confidence.
- stratified human review by document type and field.

## Session 4 - Context Management, Reliability, and Practice Exam

Time: 2.5 hours.

### Learning Goals

- Preserve critical information across long conversations.
- Design escalation and ambiguity resolution patterns.
- Propagate errors across multi-agent systems.
- Manage large codebase exploration.
- Design human review and confidence calibration.
- Preserve provenance and handle uncertainty.

### Agenda

| Time | Topic | Instructor Notes |
| ---: | --- | --- |
| 0:00-0:25 | Context window management | token budgets, progressive summarization, lost-in-the-middle, scratchpad files. |
| 0:25-0:50 | Escalation and ambiguity | explicit criteria, preferences, policy gaps, structured handoff. |
| 0:50-1:20 | Error propagation and recovery | local recovery, coordinator escalation, partial results. |
| 1:20-1:30 | Break |  |
| 1:30-1:55 | Confidence and provenance | field-level confidence, calibration, stratified sampling, claim-source maps. |
| 1:55-2:15 | Practice exam | 20 official-style questions timed, including multiple-response. |
| 2:15-2:30 | Review and remediation | Map misses to official domains and task statements. |

### Official Quick Reference

| Area | What To Remember |
| --- | --- |
| Agent loop | `stop_reason: "tool_use"` continues; `stop_reason: "end_turn"` stops. |
| Subagents | Spawn with Task tool; coordinator needs `allowedTools` containing `Task`; pass context explicitly. |
| Hooks | Use `PostToolUse` for result normalization and tool-call interception for deterministic policy enforcement. |
| MCP errors | Return `isError`, category, retryable flag, explanation, attempted actions, and partial results when useful. |
| Tool distribution | Give each agent only role-relevant tools; too many tools degrade selection. |
| `tool_choice` | `auto`, `any`, and forced named tool are all in scope. |
| Claude Code config | `CLAUDE.md` hierarchy, `@import`, `.claude/rules/`, `.claude/commands/`, `.claude/skills/`. |
| Claude Code CI | `claude -p`, `--output-format json`, `--json-schema`. |
| Structured output | `tool_use` plus JSON Schema; nullable fields; enums; `"other"` detail; Pydantic validation retries. |
| Batch | 50% cost savings; up to 24-hour processing; `custom_id`; no multi-turn tool calling. |
| Context | progressive summarization, scratchpad files, context extraction, lost-in-the-middle mitigation. |
| Reliability | escalation criteria, structured handoff, field-level confidence, stratified human review, claim-source maps. |

## Practice Exam

Use the separate official-aligned practice file:

`Claude_Architect_Practice_Exam.md`

Coverage:

- 200 original questions.
- 40 questions per official domain.
- All 6 official scenarios represented.
- Mixed single-select and multiple-response items.
- Answer key included.

Recommended classroom use:

- Two-hour crash session: questions 1-20.
- Full course checkpoint: questions 1-60, timed for 120 minutes.
- Homework: all 200.
- Remediation: for every miss, identify official domain, scenario, primitive tested, and reliability principle missed.

## Scenario Drills

Use after each session or as homework.

### Drill A - Customer Support Resolution Agent

Prompt:

The agent has MCP tools `get_customer`, `lookup_order`, `process_refund`, and `escalate_to_human`. It must resolve return and billing issues, but refunds over $500 require human approval.

Expected answer:

- Loop continues on `stop_reason: "tool_use"` and stops on `end_turn`.
- `get_customer` must verify identity before `lookup_order` or `process_refund`.
- Programmatic gate/hook blocks `process_refund` above threshold.
- Structured MCP errors distinguish transient, validation, permission, and business failures.
- Escalation handoff includes customer ID, order ID, root cause, attempted tools, refund amount, policy reason, recommended action.

### Drill B - Multi-Agent Research System

Prompt:

Coordinator delegates to web search, document analysis, synthesis, and report subagents. The report has missing sections and weak citations.

Expected answer:

- Coordinator dynamically selects subagents based on query complexity.
- Subagents receive explicit context; they do not inherit parent conversation automatically.
- Pass structured findings with source URLs, document names, page numbers, and metadata.
- Partition research scope to avoid duplication.
- Coordinator evaluates synthesis for gaps and re-delegates targeted follow-up tasks.
- Preserve claim-source mappings and coverage gaps.

### Drill C - Claude Code for CI/CD

Prompt:

Pipeline runs `claude "Analyze this pull request for security issues"` and hangs. Another overnight technical-debt report is expensive but not time-sensitive.

Expected answer:

- Use `claude -p` or `--print` for non-interactive CI.
- Use `--output-format json` and `--json-schema` when downstream CI needs machine-readable findings.
- Keep real-time calls for blocking pre-merge checks.
- Use Message Batches API for overnight latency-tolerant reports.
- Use `custom_id` to correlate batch responses.

### Drill D - Structured Data Extraction

Prompt:

System extracts fields from unstructured documents. Some documents omit optional fields, and current output fabricates values to satisfy schema.

Expected answer:

- Use `tool_use` with JSON Schema.
- Make absent fields nullable instead of forcing invented strings.
- Use enums plus `"other"` detail pattern.
- Validate with Pydantic or equivalent.
- Retry using validation errors.
- Add field-level confidence, evidence, and human review sampling by document type and field.

## Student Handout - One Page

Exam heuristic:

1. Agent loops:
   - `tool_use` means execute tool, append result, continue.
   - `end_turn` means stop.
   - Do not parse prose as primary loop control.

2. Subagents:
   - Coordinator needs `Task` in `allowedTools`.
   - Subagents do not inherit context automatically.
   - Pass findings and metadata explicitly.

3. Enforcement:
   - Use hooks/gates for deterministic business rules.
   - Prompt instructions are guidance, not guaranteed enforcement.

4. Tools and MCP:
   - Tool descriptions drive selection.
   - MCP tool = action.
   - MCP resource = read-only context.
   - MCP prompt = reusable workflow.
   - Errors need category and retryability.

5. Claude Code:
   - `CLAUDE.md` hierarchy and `@import`.
   - `.claude/rules/` path scoping.
   - `.claude/commands/` slash commands.
   - `.claude/skills/` with frontmatter.
   - Plan mode for complex; direct execution for simple.
   - `claude -p` for CI.

6. Structured output:
   - Use `tool_use` and JSON Schema.
   - Nullable fields prevent hallucinated missing values.
   - Validate and retry with errors.
   - Use field-level confidence.

7. Reliability:
   - Preserve provenance.
   - Annotate conflicts.
   - Report coverage gaps.
   - Calibrate confidence with labeled validation sets.

## Pre-Class Assignment

Ask students to complete or skim:

- Anthropic Academy: Building with the Claude API.
- Anthropic Academy: Introduction to Model Context Protocol.
- Official Anthropic Architect Foundations Exam Guide.
- Claude Code docs: `CLAUDE.md`, rules, commands, skills, plan mode, CI usage.
- Claude Agent SDK docs: agent loops, subagents, hooks, sessions.
- Tool use docs: JSON Schema, `tool_choice`, `stop_reason`.

Ask students to bring:

- One example of a support, research, CI, code-generation, developer-productivity, or extraction workflow.
- One failed tool, prompt, or extraction example, if available.
- Laptop with Claude/Claude Code access if labs will be hands-on.

## Post-Class Study Plan

Day 1:

- Memorize official domain weights and 6 scenario bank.
- Draw the agent loop: request, `tool_use`, execute tool, append result, continue, `end_turn`.

Day 2:

- Practice coordinator-subagent designs.
- Write explicit context payloads with source metadata for synthesis subagents.

Day 3:

- Write 5 MCP tool descriptions and 5 structured error responses.
- Practice `tool_choice` auto/any/forced decisions.

Day 4:

- Review `CLAUDE.md`, `.claude/rules/`, `.claude/commands/`, `.claude/skills/`, plan mode, direct execution, `claude -p`, JSON CI output.

Day 5:

- Take `Claude_Architect_Practice_Exam.md`.
- For each miss, write official domain, scenario, primitive tested, and reliability rule missed.

## Instructor Closing Script

The exam rewards operational architecture judgment. Strong Claude architects control the agent loop explicitly, pass context deliberately, design recoverable tools, configure Claude Code at the right scope, validate structured output, and preserve provenance when systems become uncertain.
