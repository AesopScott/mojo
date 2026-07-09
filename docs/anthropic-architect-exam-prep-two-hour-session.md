# Anthropic Architect Foundations Exam Prep - Two-Hour Session

Student-facing crash session aligned to the official Anthropic Architect Foundations Exam Guide, version 1.0, effective July 2026, exam code `CCAR-F`.

Format: one 2-hour instructor-led session.

Last updated: 2026-07-09.

## Exam Facts

| Item | Detail |
| --- | --- |
| Questions | 60 |
| Format | Multiple-choice and multiple-response |
| Scenario structure | 4 scenarios drawn from a bank of 6 |
| Time | 120 minutes |
| Passing score | 720 scaled score |
| Domains | 5 |

## Official Domain Weights

| Domain | Weight |
| --- | ---: |
| Agentic Architecture & Orchestration | 27% |
| Tool Design & MCP Integration | 18% |
| Claude Code Configuration & Workflows | 20% |
| Prompt Engineering & Structured Output | 20% |
| Context Management & Reliability | 15% |

## Official Scenario Bank

Expect 4 of these 6:

1. Customer Support Resolution Agent
2. Code Generation with Claude Code
3. Multi-Agent Research System
4. Developer Productivity with Claude
5. Claude Code for CI/CD
6. Structured Data Extraction

## Agenda

| Time | Segment | Learn |
| ---: | --- | --- |
| 0:00-0:07 | Exam reality | format, weights, scenarios |
| 0:07-0:25 | Agent SDK loops | `stop_reason`, tool results, subagents, hooks |
| 0:25-0:43 | Tools and MCP | tool descriptions, errors, `tool_choice`, resources |
| 0:43-1:02 | Claude Code | `CLAUDE.md`, rules, commands, skills, plan mode, CI |
| 1:02-1:18 | Structured output | JSON Schema, Pydantic, few-shot, batch, review passes |
| 1:18-1:33 | Context/reliability | escalation, provenance, confidence, error propagation |
| 1:33-1:53 | Practice quiz | official-style mixed question drill |
| 1:53-2:00 | Close | study plan and exam instincts |

## Must-Know Rules

### Agent Loop

```text
If stop_reason == "tool_use":
  execute requested tool
  append tool result to conversation
  continue loop

If stop_reason == "end_turn":
  stop
```

Do not terminate by parsing assistant text. Do not use arbitrary iteration cap as primary completion logic.

### Multi-Agent Systems

- Coordinator owns decomposition, routing, error handling, and aggregation.
- Subagents have isolated context.
- Pass all needed context explicitly in subagent prompt.
- Use structured context with source URLs, document names, page numbers, and metadata.
- Spawn parallel subagents with multiple `Task` tool calls in one coordinator response.
- Coordinator must have `allowedTools` including `Task` to spawn subagents.

### Hooks

- Use hooks when compliance must be deterministic.
- `PostToolUse` can normalize tool results before Claude sees them.
- Tool-call interception can block policy violations, such as refunds over threshold.

### Tools and MCP

- Tool descriptions drive tool selection.
- Split vague generic tools into purpose-specific tools.
- Too many tools degrades selection reliability.
- Give each subagent only role-relevant tools.
- MCP tool = action.
- MCP resource = read-only context.
- MCP prompt = reusable workflow template.
- MCP errors should include `isError`, category, retryable flag, and human-readable explanation.

### `tool_choice`

| Option | Meaning |
| --- | --- |
| `auto` | Claude may call a tool or answer normally |
| `any` | Claude must call some tool |
| forced tool | Claude must call named tool |

### Claude Code

| Need | Use |
| --- | --- |
| Shared repo/project instructions | `CLAUDE.md` |
| Path-scoped conventions | `.claude/rules/` with YAML frontmatter/globs |
| Reusable slash workflow | `.claude/commands/` |
| Reusable task capability | `.claude/skills/` with `SKILL.md` |
| Complex/architectural change | plan mode |
| Simple local change | direct execution |
| CI non-interactive run | `claude -p` / `--print` |
| Structured CI output | `--output-format json`, `--json-schema` |
| Long session cleanup | `/compact` |
| Persistent useful project knowledge | `/memory` |
| Continue named session | `--resume <session-name>` |
| Explore divergent approaches | `fork_session` |

### Structured Output

- Use `tool_use` with JSON Schema for reliable structured output.
- Use required vs optional fields intentionally.
- Use nullable fields instead of forcing hallucinated values.
- Use enums for finite choices.
- Use `"other"` plus detail field for unknown categories.
- Validate with Pydantic or equivalent.
- Retry with validation feedback.
- Include field-level confidence and evidence for extraction.

### Message Batches API

- 50% cost savings.
- Up to 24-hour processing window.
- Use `custom_id` to correlate responses.
- No multi-turn tool calling support.
- Good for overnight reports.
- Bad for blocking pre-merge checks.

### Context and Reliability

- Use progressive summarization for long sessions.
- Avoid lost-in-the-middle by ordering and extracting key facts.
- Use scratchpad files for long codebase exploration.
- Do not paste whole repos into context.
- Escalation needs explicit criteria and structured handoff.
- Preserve claim-source mappings.
- Annotate conflicts and coverage gaps.
- Calibrate confidence with labeled validation sets and stratified sampling.

## Live Drill Set

Answer with the specific primitive or design choice.

1. Pipeline hangs waiting for input.
   - `claude -p`.

2. Refund must never happen before identity verification.
   - Programmatic prerequisite/hook, not prompt-only guidance.

3. Synthesis subagent needs web findings.
   - Pass findings explicitly in prompt with source metadata.

4. MCP timeout occurs during research.
   - Structured error with category, retryable flag, attempted actions, partial results.

5. CI output must be machine-readable.
   - `--output-format json` and `--json-schema`.

6. Extraction hallucinates missing field.
   - Nullable field, evidence requirement, validation retry.

7. Large PR review misses cross-file bugs.
   - Per-file passes plus cross-file integration pass.

8. Technical debt report due tomorrow morning.
   - Message Batches API is appropriate.

9. Blocking PR review before merge.
   - Real-time call, not batch.

10. Report has conflicting dates from sources.
   - Preserve both sources, annotate conflict, report uncertainty.

## Exam Traps

- Subagents do not automatically inherit parent context.
- Prompt instructions are not deterministic enforcement.
- Empty result is not same as failed query.
- Larger context window does not fix attention dilution.
- More tools can make tool selection worse.
- Batch API is wrong for latency-sensitive blocking work.
- `claude -p` is the CI/non-interactive flag.
- MCP resource is not an action.
- Hooks are for deterministic event/tool interception, not model judgment.
- Prompt caching internals are out of scope beyond knowing it exists.

## Practice

Use `Claude_Architect_Practice_Exam.md`, questions 1-20 during class. Finish all 200 as homework.

For every missed question, write:

- official domain.
- official scenario.
- primitive tested.
- why your wrong answer was tempting.

## Closeout

When stuck, choose the answer that makes the system more:

- bounded
- observable
- recoverable
- source-faithful
- policy-compliant

