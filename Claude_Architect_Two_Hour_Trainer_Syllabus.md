# Anthropic Architect Foundations Two-Hour Trainer Syllabus

Instructor-facing guide for a two-hour prep session aligned to the official **Anthropic Architect Foundations Exam Guide**, version 1.0, effective July 2026, exam code `CCAR-F`.

Companion files:

- Student crash agenda: `docs/anthropic-architect-exam-prep-two-hour-session.md`
- Long syllabus/reference: `docs/anthropic-architect-exam-prep-syllabus.md`
- Practice exam: `Claude_Architect_Practice_Exam.md`
- Official guide source: `C:\Users\scott\Downloads\Claude+Certified+Architect+–+Foundations+Exam+Guide.pdf`

## Trainer Goal

Train scenario judgment, not feature trivia. The official exam tests whether candidates can make production architecture tradeoffs across Claude Agent SDK, Claude Code, Claude API, and MCP.

Students must leave able to:

- Read a production scenario and identify the tested domain.
- Choose correct control flow for agentic loops using `stop_reason`.
- Design coordinator-subagent systems with explicit context passing.
- Use hooks, tool restrictions, and structured errors for deterministic reliability.
- Choose the right Claude Code configuration primitive.
- Design structured output with JSON Schema, validation, retries, and confidence handling.
- Manage context, provenance, escalation, and human review.

## Official Exam Facts

| Fact | Value |
| --- | --- |
| Exam code | `CCAR-F` |
| Items | 60 |
| Format | Multiple-choice and multiple-response; each item says how many to select |
| Structure | 4 scenarios drawn from a bank of 6 |
| Time | 120 minutes |
| Passing score | 720 scaled score, 100-1000 scale |
| Fee | $125 USD |
| Validity | 12 months |

## Official Domains

| Domain | Weight | Trainer Emphasis |
| --- | ---: | --- |
| Agentic Architecture & Orchestration | 27% | Agent loops, coordinator-subagent systems, hooks, decomposition, sessions |
| Tool Design & MCP Integration | 18% | Tool descriptions, structured errors, scoped tools, MCP config, built-in tools |
| Claude Code Configuration & Workflows | 20% | `CLAUDE.md`, rules, commands, skills, plan mode, CI/CD |
| Prompt Engineering & Structured Output | 20% | Few-shot, JSON Schema, tool_use, validation loops, batches, reviews |
| Context Management & Reliability | 15% | Context preservation, escalation, error propagation, provenance, confidence |

## Official Scenario Bank

Teach from these, because exam presents 4 of 6:

1. **Customer Support Resolution Agent**
   - MCP tools: `get_customer`, `lookup_order`, `process_refund`, `escalate_to_human`
   - Themes: escalation, refund gates, first-contact resolution, structured handoff

2. **Code Generation with Claude Code**
   - Themes: custom slash commands, `CLAUDE.md`, plan mode vs direct execution

3. **Multi-Agent Research System**
   - Coordinator delegates to web search, document analysis, synthesis, report agents
   - Themes: explicit context passing, attribution, iterative refinement

4. **Developer Productivity with Claude**
   - Built-in tools: Read, Write, Edit, Bash, Grep, Glob
   - Themes: codebase exploration, boilerplate, legacy understanding, MCP integrations

5. **Claude Code for CI/CD**
   - Themes: `claude -p`, JSON output, PR review, false positives, Message Batches API

6. **Structured Data Extraction**
   - Themes: JSON Schema, Pydantic validation, confidence scoring, edge cases

## Two-Hour Run Of Show

| Time | Segment | Outcome |
| ---: | --- | --- |
| 0:00-0:07 | Exam Reality | Students know official format, scenarios, weights |
| 0:07-0:25 | Agent SDK Loops & Orchestration | Students can answer Domain 1 operational questions |
| 0:25-0:43 | Tools & MCP | Students can design tools, errors, and MCP resources/tools |
| 0:43-1:02 | Claude Code Workflows | Students can choose config, plan mode, commands, skills, CI flags |
| 1:02-1:18 | Structured Output & Evals | Students can design schema, retries, few-shot, batch, review systems |
| 1:18-1:33 | Context & Reliability | Students can handle escalation, context limits, provenance, confidence |
| 1:33-1:53 | Scenario Quiz | Students answer official-style questions under time |
| 1:53-2:00 | Debrief & Study Plan | Students leave with exam heuristics |

## Segment 1 - Exam Reality

Time: 0:00-0:07.

### Talk Track

"This exam is not broad AI literacy. It is a production Claude architect exam. Expect scenario blocks, multiple-response items, and questions about exact control flow: `stop_reason`, `tool_choice`, MCP `isError`, Claude Code `-p`, `CLAUDE.md` hierarchy, plan mode, and structured output validation."

"Your job is to choose the design that is reliable, bounded, observable, and appropriate for the scenario."

### Whiteboard

```text
Scenario -> Domain -> Failure mode -> Correct primitive -> Reliability gate
```

## Segment 2 - Agent SDK Loops & Orchestration

Time: 0:07-0:25.

### Must Teach

- Agentic loop lifecycle:
  - Send request to Claude.
  - If `stop_reason == "tool_use"`, execute requested tools.
  - Append tool results to conversation.
  - Continue.
  - If `stop_reason == "end_turn"`, terminate.
- Avoid loop anti-patterns:
  - Parsing natural language to decide completion.
  - Using arbitrary iteration caps as primary stopping condition.
  - Checking assistant text instead of `stop_reason`.
- Coordinator-subagent architecture:
  - Hub-and-spoke coordinator handles routing, aggregation, errors.
  - Subagents have isolated context.
  - Context must be explicitly passed in prompt.
  - Coordinator should dynamically select subagents, not always run full pipeline.
- Subagent spawning:
  - Coordinator needs `allowedTools` including `Task`.
  - Spawn parallel subagents by emitting multiple `Task` tool calls in one response.
  - Pass structured data with metadata/source attribution.
- Hooks:
  - `PostToolUse` normalizes tool results before model sees them.
  - Tool-call interception blocks policy violations.
  - Use hooks for deterministic guarantees, prompts for guidance.
- Sessions:
  - `--resume <session-name>` for valid prior context.
  - `fork_session` for divergent approaches.
  - Start fresh with structured summary when prior tool results are stale.

### Instructor Drill

Ask: "A refund agent must never call `process_refund` before verified customer lookup. Prompt instruction or programmatic gate?"

Answer: programmatic prerequisite/hook/gate. Prompt alone has non-zero failure rate.

Ask: "Research coordinator wants web search and document analysis in parallel. How?"

Answer: emit multiple `Task` tool calls in one coordinator response and pass each subagent scoped context/goals.

### Common Wrong Answers

- "Always run every subagent." Wrong: dynamic selection reduces cost/latency and avoids irrelevant work.
- "Subagents inherit all parent context." Wrong: pass needed context explicitly.
- "Retry forever." Wrong: structured error propagation and local recovery first.

## Segment 3 - Tools & MCP

Time: 0:25-0:43.

### Must Teach

- Tool descriptions drive model selection.
- Include input formats, examples, edge cases, and boundaries.
- Split generic tools into purpose-specific tools when ambiguity hurts selection.
- Avoid keyword-sensitive system prompts that accidentally bias tool choice.
- MCP error responses should include:
  - `isError`
  - `errorCategory`: transient, validation, permission, business
  - `isRetryable`
  - human-readable explanation
  - partial results/attempted actions when relevant
- Distribute tools by role:
  - Too many tools degrades selection.
  - Give each subagent only role-relevant tools.
  - Add scoped cross-role tools for high-frequency needs.
- `tool_choice`:
  - `auto`: model may choose tool or text.
  - `any`: model must call some tool.
  - forced tool: model must call named tool first.
- MCP config:
  - Project vs user scope.
  - Environment variable expansion.
  - Multiple MCP servers can be available simultaneously.
- Built-in tools:
  - `Read`: inspect file.
  - `Write`: create/overwrite file.
  - `Edit`: targeted modification.
  - `Bash`: run shell command.
  - `Grep`: search contents.
  - `Glob`: find files by pattern.

### Instructor Drill

Bad error:

```json
{ "error": "Operation failed" }
```

Better:

```json
{
  "isError": true,
  "errorCategory": "business",
  "isRetryable": false,
  "message": "Refund exceeds $500 policy limit.",
  "recommendedAction": "Escalate to human approval."
}
```

Ask: "Why is second better?"

Answer: agent can choose no retry, explain policy, and escalate.

## Segment 4 - Claude Code Workflows

Time: 0:43-1:02.

### Must Teach

- `CLAUDE.md` hierarchy:
  - user/project/directory context.
  - `@import` patterns.
- `.claude/rules/`:
  - YAML frontmatter with glob/path scoping.
  - Conditional convention loading.
- `.claude/commands/`:
  - custom slash commands.
  - project vs user scope.
- `.claude/skills/`:
  - `SKILL.md` frontmatter.
  - `context: fork`.
  - `allowed-tools`.
  - `argument-hint`.
- Plan mode vs direct execution:
  - Plan mode for complex, multi-file, architectural, ambiguous work.
  - Direct execution for simple, localized, low-risk edits.
- Claude Code CLI in CI:
  - Use `claude -p` / `--print` for non-interactive pipeline execution.
  - Use `--output-format json` and `--json-schema` for structured CI output.
- Memory/context:
  - `/memory` for persistent useful project knowledge.
  - `/compact` for long sessions.
  - `--resume` for named sessions.
  - `fork_session` for divergent approaches.
  - Explore subagent for codebase exploration.

### Instructor Drill

Ask: "Pipeline hangs because Claude waits for interactive input. Fix?"

Answer: use `claude -p "..."`.

Ask: "Large PR review misses issues across files. Fix?"

Answer: split into per-file local passes plus cross-file integration pass.

Ask: "Simple single-file typo fix: plan mode or direct execution?"

Answer: direct execution.

Ask: "Architectural refactor touching several modules: plan mode or direct execution?"

Answer: plan mode.

## Segment 5 - Structured Output & Evals

Time: 1:02-1:18.

### Must Teach

- Structured output via `tool_use` with JSON Schema.
- `tool_choice` can force schema-producing tool.
- JSON Schema:
  - required vs optional.
  - enum types.
  - nullable fields.
  - `"other"` plus detail string for categories that do not fit enum.
  - strict mode to reduce syntax errors.
- Pydantic:
  - schema validation.
  - semantic validation errors.
  - validation-retry loops.
- Few-shot prompting:
  - use for ambiguous cases.
  - demonstrate format.
  - reduce false positives.
- Batch processing:
  - Message Batches API gives 50% cost savings.
  - Up to 24-hour processing window.
  - Use `custom_id` for request/response correlation.
  - No multi-turn tool calling support.
  - Good for overnight reports, bad for blocking pre-merge checks.
- Multi-pass review:
  - Sequential focused passes beat one overloaded pass.
  - Parallel issue resolution can create conflicts when changes overlap.

### Instructor Drill

Ask: "Extraction system hallucinates value when field missing. Schema fix?"

Answer: make field nullable and require evidence/confidence; do not force fabricated string.

Ask: "Technical debt report due next morning: batch or real-time?"

Answer: batch.

Ask: "Blocking PR check: batch or real-time?"

Answer: real-time.

## Segment 6 - Context & Reliability

Time: 1:18-1:33.

### Must Teach

- Context window management:
  - token budgets.
  - progressive summarization.
  - lost-in-the-middle effects.
  - context extraction.
  - scratchpad files.
- Large codebase exploration:
  - start with Glob/Grep/Read mapping.
  - do not paste whole repo.
  - preserve key findings in compact summaries.
- Escalation:
  - explicit criteria.
  - honor customer preferences.
  - policy gap identification.
  - structured handoff summary for humans without transcript.
- Error propagation:
  - local recovery for transient failures.
  - coordinator gets unresolved errors with attempted actions and partial results.
  - never mark timeout as successful empty result.
- Human review:
  - field-level confidence.
  - calibration with labeled validation sets.
  - stratified sampling by document type/field.
  - segment accuracy by field and source type.
- Provenance:
  - claim-source mappings.
  - temporal data handling.
  - conflict annotation.
  - coverage gap reporting.

### Instructor Drill

Ask: "Research report has conflicting dates from two sources. What should system do?"

Answer: preserve both sources, annotate conflict, report uncertainty, do not silently choose one without criteria.

Ask: "Extraction accuracy overall is 94%, but legal documents fail often. What evaluation?"

Answer: stratify by document type and field; calibrate confidence per segment.

## Segment 7 - Scenario Quiz

Time: 1:33-1:53.

Use `Claude_Architect_Practice_Exam.md`, questions 1-20. Include at least 3 multiple-response questions.

Timing:

- 10 minutes silent.
- 7 minutes answer review.
- 3 minutes "why wrong answers were tempting."

Debrief each miss:

1. Which official scenario/domain?
2. Which exact primitive was tested?
3. What reliability risk mattered?
4. Why was the wrong option tempting?

## Segment 8 - Close

Time: 1:53-2:00.

### Closeout Script

"The exam rewards operational architecture judgment. Watch for exact signals: `stop_reason`, Task tool, explicit context passing, hooks for deterministic rules, MCP `isError`, scoped tools, `CLAUDE.md` hierarchy, plan mode, `claude -p`, JSON Schema validation, batch latency, confidence calibration, and provenance."

"When stuck, pick the answer that makes the system more bounded, observable, recoverable, and faithful to source evidence."

## Trainer Cheat Sheet

### Agent Loop

```text
request -> stop_reason tool_use -> execute tool -> append result -> continue
request -> stop_reason end_turn -> stop
```

### MCP

```text
Tool = action
Resource = read-only context
Prompt = reusable workflow
isError + category + retryable = recoverable tool failures
```

### Claude Code

```text
CLAUDE.md = instruction hierarchy
.claude/rules = path scoped conventions
.claude/commands = slash commands
.claude/skills = reusable procedures/assets
plan mode = complex/architectural/ambiguous
direct execution = simple/local/low-risk
claude -p = non-interactive CI
```

### Structured Output

```text
tool_use + JSON Schema
required/optional/nullable/enums
Pydantic validation
retry with validation feedback
confidence + evidence
```

### Reliability

```text
explicit escalation criteria
local recovery before coordinator escalation
structured handoff
field-level confidence
stratified sampling
claim-source mapping
```

## Topics To De-Emphasize

Official guide lists these as out of scope:

- Fine-tuning/training custom models.
- API authentication, billing, account management.
- MCP hosting/infrastructure.
- Claude internal architecture, model weights, Constitutional AI, RLHF.
- Embedding/vector database implementation details.
- Computer use.
- Vision/image analysis.
- Streaming/SSE implementation.
- Rate limits/quotas/pricing calculations.
- OAuth/API key rotation.
- Cloud provider configuration.
- Benchmarking/model comparisons.
- Prompt caching implementation details beyond knowing it exists.
- Tokenization algorithms.

## Homework

Assign:

- Practice exam questions 1-200.
- For every miss, write:
  - official domain.
  - scenario type.
  - correct primitive.
  - reliability principle missed.

