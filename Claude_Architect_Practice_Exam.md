# Claude Architect Practice Exam

200 original practice questions aligned to the official Claude Certified Architect - Foundations Exam Guide, version 1.0, effective July 2026, exam code `CCAR-F`.

Format mirrors the exam style: scenario-based multiple-choice and multiple-response items. Each question states how many answers to select.

## Domains

- Questions 1-40: Agentic Architecture & Orchestration
- Questions 41-80: Tool Design & MCP Integration
- Questions 81-120: Claude Code Configuration & Workflows
- Questions 121-160: Prompt Engineering & Structured Output
- Questions 161-200: Context Management & Reliability

## Official Scenario Bank Covered

- Customer Support Resolution Agent
- Code Generation with Claude Code
- Multi-Agent Research System
- Developer Productivity with Claude
- Claude Code for CI/CD
- Structured Data Extraction

## Questions

### Domain 1: Agentic Architecture & Orchestration

1. [Customer Support Resolution Agent] A support agent receives a Claude response with stop_reason set to tool_use and a requested lookup_order call. What should the loop do next? (Select 1.)
   A. Parse assistant text for the word complete.
   B. Stop because the assistant already responded.
   C. Start a new conversation without the tool result.
   D. Execute the requested tool, append the tool result to conversation history, and send the next request.

2. [Customer Support Resolution Agent] A support agent receives stop_reason end_turn after several tool calls. What is the correct loop behavior? (Select 1.)
   A. Parse the final text for a hidden completion token.
   B. Retry until max iterations is reached.
   C. Terminate the loop and return the final response.
   D. Force one more tool call for safety.

3. [Customer Support Resolution Agent] Which loop termination approach is an anti-pattern for the exam? (Select 1.)
   A. Using stop_reason end_turn.
   B. Appending tool results before the next request.
   C. Continuing on stop_reason tool_use.
   D. Checking assistant text content as the primary completion signal.

4. [Customer Support Resolution Agent] A refund workflow must verify customer identity before process_refund. What is the strongest enforcement? (Select 1.)
   A. A polite sentence in the system prompt only.
   B. A higher temperature setting.
   C. Programmatic prerequisite gate or hook that blocks process_refund until verification succeeds.
   D. A larger context window.

5. [Customer Support Resolution Agent] Select 2 correct responsibilities of a coordinator in a multi-agent support system. (Select 2.)
   A. Bypass all tool restrictions to maximize autonomy.
   B. Assume subagents share memory automatically.
   C. Hide partial failures from downstream agents.
   D. Aggregate results and handle errors consistently.
   E. Route work to appropriate subagents.

6. [Multi-Agent Research System] A research coordinator invokes a synthesis subagent. What must be included for reliable synthesis? (Select 1.)
   A. Complete relevant findings and metadata explicitly in the subagent prompt.
   B. A request to check hidden shared memory.
   C. Nothing, because subagents inherit all parent context automatically.
   D. Only the name of the previous subagent.

7. [Multi-Agent Research System] How should a coordinator spawn web-search and document-analysis subagents in parallel? (Select 1.)
   A. Emit multiple Task tool calls in a single coordinator response.
   B. Ask the synthesis agent to infer missing research.
   C. Use prompt caching as a substitute for spawning.
   D. Call them across separate user turns only.

8. [Multi-Agent Research System] A broad research query is incomplete because the coordinator split it into very narrow tasks. What is the design issue? (Select 1.)
   A. MCP resources cannot support research.
   B. The system used too few final tokens.
   C. The subagents inherited too much context.
   D. Overly narrow decomposition caused incomplete coverage.

9. [Multi-Agent Research System] Select 3 facts about subagent context. (Select 3.)
   A. Subagents cannot receive source URLs.
   B. Subagents automatically inherit the coordinator transcript.
   C. Subagents operate with isolated context.
   D. Needed context must be passed explicitly.
   E. Context passing is unnecessary if the model is strong.
   F. Structured metadata helps preserve attribution.

10. [Multi-Agent Research System] A coordinator reviews a draft report, finds missing coverage, and sends targeted follow-up tasks to search and analysis agents. What pattern is this? (Select 1.)
   A. Prompt caching.
   B. Static one-pass routing.
   C. Forced JSON schema only.
   D. Iterative refinement through coordinator re-delegation.

11. [Customer Support Resolution Agent] A PostToolUse hook converts mixed Unix timestamps and ISO strings into a consistent date format before Claude sees results. What is this hook doing? (Select 1.)
   A. Creating a vector index.
   B. Replacing tool descriptions.
   C. Choosing a model.
   D. Normalizing heterogeneous tool results deterministically.

12. [Customer Support Resolution Agent] A tool-call interception hook blocks refunds over $500 and routes to escalation. Why use a hook instead of prompt-only instruction? (Select 1.)
   A. Hooks remove need for tool schemas.
   B. Hooks make responses more creative.
   C. The rule requires deterministic compliance.
   D. Prompt instructions cannot mention money.

13. [Developer Productivity with Claude] A developer wants to compare two testing strategies from the same codebase analysis baseline. Which session feature fits? (Select 1.)
   A. tool_choice any.
   B. MCP isError.
   C. Message Batches API.
   D. fork_session.

14. [Developer Productivity with Claude] A resumed coding session has stale tool results because files changed. Best action? (Select 1.)
   A. Tell the agent which files changed or start fresh with a structured summary.
   B. Assume old tool results are still valid.
   C. Force process_refund first.
   D. Increase temperature.

15. [Developer Productivity with Claude] When is starting a fresh session with a structured summary more reliable than resuming? (Select 1.)
   A. When the user wants hidden context.
   B. When prior tool results are stale or much of the previous context is invalid.
   C. When the task is exactly continuing the prior investigation.
   D. When no files changed.

16. [Developer Productivity with Claude] Select 2 valid uses of fork_session. (Select 2.)
   A. Share mutable memory between subagents automatically.
   B. Bypass project rules.
   C. Force a specific MCP tool choice.
   D. Compare two testing strategies independently.
   E. Explore divergent refactoring approaches from the same baseline.

17. [Developer Productivity with Claude] A legacy test-generation task is open-ended. The agent should first map structure, identify high-impact areas, then adapt as dependencies are discovered. What decomposition style is this? (Select 1.)
   A. One-pass JSON extraction.
   B. Prompt caching.
   C. Dynamic adaptive decomposition.
   D. Fixed sequential pipeline only.

18. [Developer Productivity with Claude] A PR review should analyze files individually, then inspect cross-file data flow. What decomposition is being used? (Select 1.)
   A. Prompt chaining with focused local passes and an integration pass.
   B. OAuth flow.
   C. Random voting only.
   D. Batch API correlation.

19. [Customer Support Resolution Agent] A customer has a return issue and an account access issue in one message. Best workflow? (Select 1.)
   A. Decompose into distinct items, investigate each, then synthesize one resolution.
   B. Always escalate immediately.
   C. Run process_refund before lookup.
   D. Handle only the first issue.

20. [Customer Support Resolution Agent] Human support agents cannot see the conversation transcript. What should escalation include? (Select 1.)
   A. Structured handoff with customer details, root cause, recommended action, and relevant evidence.
   B. No customer ID because tools have it.
   C. The full hidden system prompt.
   D. Only the word escalated.

21. [Customer Support Resolution Agent] Select 2 agentic loop facts. (Select 2.)
   A. Arbitrary iteration cap should be the primary success condition.
   B. Tool calls should be ignored if text is present.
   C. Assistant prose should be parsed as the main loop controller.
   D. stop_reason tool_use means the application should execute requested tools.
   E. Tool results should be appended so Claude can reason about next action.

22. [Multi-Agent Research System] A synthesis agent often needs simple fact checks. 85% are date/name/stat checks; 15% need deep research. Best design? (Select 1.)
   A. Give synthesis a scoped verify_fact tool and keep deep verification routed through coordinator.
   B. Route every tiny fact check through full coordinator loop.
   C. Speculatively cache all possible facts.
   D. Give synthesis every web-search tool.

23. [Multi-Agent Research System] Why route all subagent communication through the coordinator? (Select 1.)
   A. Because subagents cannot return text.
   B. For observability, consistent error handling, and controlled information flow.
   C. Because JSON schemas do not work in subagents.
   D. Because MCP forbids direct tools.

24. [Multi-Agent Research System] Coordinator prompts should usually specify research goals and quality criteria rather than rigid step-by-step procedures because: (Select 1.)
   A. Subagents cannot follow goals.
   B. Rigid procedures always increase recall.
   C. Subagents need adaptability based on findings.
   D. Quality criteria prevent tool use.

25. [Customer Support Resolution Agent] Select 3 cases where deterministic enforcement beats prompt guidance. (Select 3.)
   A. Brainstorming alternate titles.
   B. Asking for concise writing.
   C. Requiring identity verification before financial action.
   D. Choosing a friendly tone.
   E. Normalizing tool data before model processing.
   F. Blocking refunds above a policy threshold.

26. [Developer Productivity with Claude] A named investigation should continue across work sessions with mostly valid prior context. Which option fits? (Select 1.)
   A. --resume with the named session.
   B. Use enum other_detail.
   C. Use Message Batches API.
   D. Start unrelated blank session.

27. [Multi-Agent Research System] A coordinator always invokes all four research subagents for every query, including simple ones. What is the issue? (Select 1.)
   A. It ignores dynamic subagent selection based on query complexity.
   B. It lacks image analysis.
   C. It should use OAuth.
   D. It uses too many JSON schemas.

28. [Customer Support Resolution Agent] An agent returns a natural-language sentence saying 'I need a tool' but stop_reason is end_turn. What should loop control follow? (Select 1.)
   A. The stop_reason, not natural-language text.
   B. The phrase 'need a tool'.
   C. A regex over the response.
   D. A hidden completion marker.

29. [Developer Productivity with Claude] A tool result from tests shows failures. How should an agent use it? (Select 1.)
   A. Remove it from context.
   B. Treat it as environment feedback to plan the next step.
   C. End because any tool result means success.
   D. Ignore it and rely on initial plan.

30. [Multi-Agent Research System] Select 2 risks of poor subagent decomposition. (Select 2.)
   A. Duplicate work across agents.
   B. Elimination of error handling.
   C. Automatic source attribution.
   D. Guaranteed lower latency.
   E. Incomplete coverage of broad topics.

31. [Customer Support Resolution Agent] A customer asks for a refund above policy but also requests a callback. Best behavior? (Select 1.)
   A. Return generic failure.
   B. Block refund tool, create structured escalation respecting customer preference.
   C. Refund anyway because user asked.
   D. Pretend refund succeeded.

32. [Developer Productivity with Claude] A coding agent should not use arbitrary iteration caps as the primary stopping condition because: (Select 1.)
   A. Completion should be based on model/tool loop state and task success signals.
   B. Tools cannot fail.
   C. stop_reason is unavailable.
   D. Caps are never useful as safety backstops.

33. [Multi-Agent Research System] What is the best way to preserve attribution when passing document analysis to a synthesis subagent? (Select 1.)
   A. Pass only a prose summary with no sources.
   B. Use random IDs not mapped to sources.
   C. Ask synthesis to recreate citations later.
   D. Pass structured content plus source URL, document name, and page number metadata.

34. [Customer Support Resolution Agent] A business rule requires no account changes before get_customer returns verified status. Which architecture piece should enforce this? (Select 1.)
   A. Vision analysis.
   B. Programmatic prerequisite gate before downstream tools.
   C. Prompt cache breakpoint.
   D. Few-shot tone example.

35. [Developer Productivity with Claude] Select 2 correct session-management choices. (Select 2.)
   A. Assume named sessions update file facts automatically.
   B. Resume blindly after file changes.
   C. Use fresh structured summaries when old tool results are stale.
   D. Use fork_session for independent branches from shared analysis.
   E. Use batch API to share session memory.

36. [Multi-Agent Research System] A coordinator receives partial results plus an unrecoverable web-search timeout. Best next step? (Select 1.)
   A. Decide whether to retry, use alternative sources, or proceed with caveats using structured error context.
   B. Mark empty results as success.
   C. Terminate every research workflow.
   D. Discard all partial results.

37. [Customer Support Resolution Agent] A support agent should escalate when policy is ambiguous. What should the escalation include? (Select 1.)
   A. Only a generic escalation code.
   B. A fabricated policy answer.
   C. No evidence to avoid bias.
   D. Policy gap, evidence, attempted tools, customer preference, and recommended next action.

38. [Developer Productivity with Claude] For a predictable multi-aspect code review, what pattern is preferred? (Select 1.)
   A. Prompt chaining into focused passes.
   B. Unbounded autonomous exploration only.
   C. No validation.
   D. Forced first refund tool.

39. [Multi-Agent Research System] For an open-ended research question whose needed subtopics are unknown up front, best decomposition? (Select 1.)
   A. No subagents ever.
   B. Single unsupported answer.
   C. Fixed exact pipeline for every query.
   D. Coordinator-driven dynamic decomposition.

40. [Customer Support Resolution Agent] Best high-level Domain 1 instinct? (Select 1.)
   A. Give every agent every tool.
   B. Control the loop explicitly, pass context deliberately, and enforce critical rules programmatically.
   C. Prefer stale sessions over summaries.
   D. Trust prose to control everything.

### Domain 2: Tool Design & MCP Integration

41. [Customer Support Resolution Agent] Two tools, analyze_content and analyze_document, have nearly identical descriptions. Claude misroutes calls. Best fix? (Select 1.)
   A. Increase max_tokens only.
   B. Rename and describe tools with clear purpose, inputs, outputs, and boundaries.
   C. Give every subagent both tools.
   D. Make both descriptions shorter.

42. [Customer Support Resolution Agent] A generic analyze_document tool handles extraction, summarization, and claim verification poorly. Best redesign? (Select 1.)
   A. Force all calls to the generic tool.
   B. Keep one vague tool.
   C. Remove schemas.
   D. Split it into purpose-specific tools with clear contracts.

43. [Customer Support Resolution Agent] An MCP tool returns only 'Operation failed'. Why is this bad? (Select 1.)
   A. It exposes too much category metadata.
   B. It forces correct retries.
   C. It prevents the agent from choosing retry, clarification, escalation, or user explanation.
   D. It is too structured.

44. [Customer Support Resolution Agent] What should a structured MCP validation error include? (Select 1.)
   A. A hidden stack trace with secrets.
   B. isError, errorCategory, isRetryable false, and a human-readable explanation of invalid input.
   C. A successful empty result.
   D. Only HTTP 500.

45. [Customer Support Resolution Agent] Select 3 useful MCP error categories. (Select 3.)
   A. validation
   B. embedding
   C. transient
   D. creative
   E. permission
   F. temperature

46. [Customer Support Resolution Agent] A timeout occurs in a web search subagent. What should local recovery do first? (Select 1.)
   A. Hide what was attempted.
   B. Retry transient failures locally with limits, then propagate unresolved errors with context.
   C. Immediately terminate all research.
   D. Mark timeout as successful empty result.

47. [Multi-Agent Research System] The synthesis agent has 18 tools and often chooses wrong ones. Best fix? (Select 1.)
   A. Add more tools.
   B. Remove all descriptions.
   C. Use every MCP server at once.
   D. Restrict tools to those relevant to the synthesis role.

48. [Multi-Agent Research System] A synthesis agent needs simple claim checks frequently. Best tool distribution? (Select 1.)
   A. Remove verification.
   B. Give it unrestricted web crawling.
   C. Force all checks through full pipeline.
   D. Give it a scoped verify_fact tool and keep complex search with the search agent.

49. [Customer Support Resolution Agent] When should tool_choice forced selection be used? (Select 1.)
   A. When any conversational answer is fine.
   B. To make all tools optional.
   C. To hide tool errors.
   D. When a specific first tool must run, such as extract_metadata before enrichment.

50. [Customer Support Resolution Agent] What does tool_choice any mean? (Select 1.)
   A. Claude must call some tool rather than return only conversational text.
   B. Claude must call every tool.
   C. Claude cannot call tools.
   D. Claude must call a named tool.

51. [Developer Productivity with Claude] Which built-in tool should inspect file contents? (Select 1.)
   A. Read.
   B. Write.
   C. Bash only.
   D. Glob.

52. [Developer Productivity with Claude] Which built-in tool should find files by pattern? (Select 1.)
   A. process_refund.
   B. Glob.
   C. Write.
   D. Edit.

53. [Developer Productivity with Claude] Which built-in tool should search text across files? (Select 1.)
   A. Grep.
   B. fork_session.
   C. Write.
   D. MCP prompt.

54. [Developer Productivity with Claude] Which built-in tool should make a targeted modification to existing file content? (Select 1.)
   A. Edit.
   B. Glob.
   C. Read.
   D. tool_choice auto.

55. [Developer Productivity with Claude] Which built-in tool is riskiest and most likely needs permission boundaries? (Select 1.)
   A. Read.
   B. Glob.
   C. Grep.
   D. Bash.

56. [Multi-Agent Research System] An MCP resource is best for: (Select 1.)
   A. Running shell commands.
   B. Forcing JSON output.
   C. Processing a refund.
   D. Exposing read-only content catalogs or documents.

57. [Customer Support Resolution Agent] An MCP tool is best for: (Select 1.)
   A. Path-scoped coding convention.
   B. Performing an action or query the model can request.
   C. Read-only catalog metadata only.
   D. Static style guidance only.

58. [Multi-Agent Research System] A project needs a reusable research prompt template in MCP. Which primitive? (Select 1.)
   A. MCP resource.
   B. MCP tool.
   C. PostToolUse hook.
   D. MCP prompt.

59. [Multi-Agent Research System] Select 2 MCP server configuration facts in scope. (Select 2.)
   A. Container orchestration details are tested deeply.
   B. MCP servers cannot coexist.
   C. OAuth rotation is core exam content.
   D. Project vs user scope matters.
   E. Environment variable expansion can configure servers.

60. [Customer Support Resolution Agent] A query returns no matching orders successfully. How should this differ from access failure? (Select 1.)
   A. Mark both as generic failure.
   B. Retry no-match forever.
   C. Mark access failure as successful empty result.
   D. Return successful empty result for no matches; structured error for access failure.

61. [Customer Support Resolution Agent] A business rule blocks refund. What should MCP response convey? (Select 1.)
   A. Non-retryable business error with customer-friendly explanation and escalation path.
   B. Transient retryable timeout.
   C. Permission granted.
   D. Successful refund with no ID.

62. [Multi-Agent Research System] Why include edge cases in tool descriptions? (Select 1.)
   A. They make all errors retryable.
   B. They help Claude choose and call tools correctly in ambiguous situations.
   C. They hide business rules.
   D. They replace the schema entirely.

63. [Customer Support Resolution Agent] A system prompt says 'always analyze content with analyze_content' and causes wrong tool use. What should you inspect? (Select 1.)
   A. Only API billing.
   B. Only vector database settings.
   C. Keyword-sensitive system prompt wording that overrides tool descriptions.
   D. Only cloud provider region.

64. [Developer Productivity with Claude] A developer agent needs to run tests. Which built-in tool? (Select 1.)
   A. Glob only.
   B. MCP resource only.
   C. Bash with appropriate permissions.
   D. JSON Schema enum.

65. [Developer Productivity with Claude] A tool validates document URLs before loading them, replacing generic fetch_url. What principle? (Select 1.)
   A. Prompt caching internals.
   B. Overbroad access.
   C. No boundary design.
   D. Constrained alternatives reduce misuse.

66. [Customer Support Resolution Agent] Select 2 components of useful structured error metadata. (Select 2.)
   A. isRetryable boolean.
   B. model benchmark score.
   C. errorCategory.
   D. hidden chain of thought.
   E. random temperature.

67. [Multi-Agent Research System] A subagent handles transient MCP failures and returns partial results plus attempts to coordinator. What is this? (Select 1.)
   A. Suppressing errors.
   B. Computer use.
   C. Prompt-only validation.
   D. Local recovery before escalation.

68. [Customer Support Resolution Agent] Minimal descriptions like 'gets data' are risky because: (Select 1.)
   A. MCP forbids examples.
   B. Schemas cannot include text.
   C. Claude ignores descriptions.
   D. Tool descriptions are primary signals for model tool selection.

69. [Developer Productivity with Claude] The agent needs to create a new file from scratch. Which built-in tool? (Select 1.)
   A. Read.
   B. Glob.
   C. Grep.
   D. Write.

70. [Developer Productivity with Claude] The agent needs to inspect command output from a test run. Best sequence? (Select 1.)
   A. Use Bash to run tests, then append/inspect output as tool result.
   B. Use MCP resource as shell.
   C. Use Glob to execute tests.
   D. Guess test result.

71. [Multi-Agent Research System] A research system needs multiple MCP servers active for web and documents. Official guide says: (Select 1.)
   A. MCP hosting infrastructure is tested deeply.
   B. Multi-server simultaneous access is in scope.
   C. MCP resources are actions.
   D. Only one MCP server can exist.

72. [Customer Support Resolution Agent] When should a generic tool be consolidated rather than split? (Select 1.)
   A. When inputs/outputs are unrelated.
   B. When purposes are genuinely similar and descriptions remain unambiguous.
   C. When selection is already failing.
   D. When side effects differ.

73. [Customer Support Resolution Agent] A refund tool has required customer_id and amount. Why require these fields? (Select 1.)
   A. To make every error transient.
   B. To bypass approval.
   C. To increase hallucination.
   D. To prevent guessed or incomplete side-effectful calls.

74. [Developer Productivity with Claude] Select 3 built-in tool purposes. (Select 3.)
   A. Grep searches contents.
   B. Edit modifies existing content.
   C. Read executes shell.
   D. Bash is read-only metadata.
   E. Write only searches text.
   F. Glob finds files.

75. [Multi-Agent Research System] A tool result includes source URL and title. Why? (Select 1.)
   A. It supports provenance and later synthesis attribution.
   B. It forces batch mode.
   C. It replaces coordinator logic.
   D. It prevents all errors.

76. [Customer Support Resolution Agent] A permission error from an MCP tool should usually be: (Select 1.)
   A. Marked successful.
   B. Retried infinitely.
   C. Non-retryable until credentials/permissions change, with clear explanation.
   D. Hidden from coordinator.

77. [Developer Productivity with Claude] A code exploration agent should first locate candidate files. Best tools? (Select 1.)
   A. Only Bash delete commands.
   B. Write and process_refund.
   C. MCP prompt only.
   D. Glob and Grep, followed by Read.

78. [Multi-Agent Research System] A report-generation tool and source-analysis tool overlap. Best fix? (Select 1.)
   A. Raise temperature.
   B. Give both to every agent without docs.
   C. Remove all descriptions.
   D. Clarify boundaries and expected outputs, or split/rename tools.

79. [Customer Support Resolution Agent] What is the main Domain 2 instinct? (Select 1.)
   A. Make tool choice easy, scoped, recoverable, and explicit.
   B. Hide errors.
   C. Give broad vague tools.
   D. Treat empty results as failures.

80. [Multi-Agent Research System] A tool must be called first to extract metadata before enrichment. Best configuration? (Select 1.)
   A. tool_choice auto and hope.
   B. No tools.
   C. Forced tool_choice for extract_metadata, then follow-up turns for later steps.
   D. Batch API only.

### Domain 3: Claude Code Configuration & Workflows

81. [Code Generation with Claude Code] Where should shared project instructions for Claude Code live? (Select 1.)
   A. Message Batches request.
   B. Pydantic model only.
   C. Project `CLAUDE.md`.
   D. MCP isError flag.

82. [Code Generation with Claude Code] What does the official guide test about CLAUDE.md? (Select 1.)
   A. OAuth rotation.
   B. API billing setup.
   C. Vision analysis.
   D. Hierarchy across user, project, and directory plus @import patterns.

83. [Code Generation with Claude Code] A monorepo needs path-specific conventions for frontend and backend. Best feature? (Select 1.)
   A. Message Batches API.
   B. One global vague prompt.
   C. tool_choice any.
   D. `.claude/rules/` with YAML frontmatter and glob/path scoping.

84. [Code Generation with Claude Code] A repeated team workflow should be invoked as /review-pr. Best feature? (Select 1.)
   A. PostToolUse date normalization.
   B. Pydantic validator.
   C. Custom slash command in `.claude/commands/`.
   D. MCP resource only.

85. [Code Generation with Claude Code] A reusable Claude Code capability needs `SKILL.md` frontmatter with allowed tools and argument hints. Best feature? (Select 1.)
   A. Batch custom_id.
   B. MCP isError only.
   C. `.claude/skills/` Agent Skill.
   D. CLAUDE.md import only.

86. [Code Generation with Claude Code] Select 3 skill frontmatter concepts in official guide. (Select 3.)
   A. custom_id
   B. argument-hint
   C. context: fork
   D. stop_reason
   E. allowed-tools
   F. isRetryable

87. [Code Generation with Claude Code] When is plan mode preferred? (Select 1.)
   A. Single obvious typo fix.
   B. Structured extraction schema validation only.
   C. Every CI non-interactive call.
   D. Complex, ambiguous, multi-file, or architectural changes.

88. [Code Generation with Claude Code] When is direct execution preferred? (Select 1.)
   A. Simple, localized, low-risk changes.
   B. Large architectural refactor.
   C. Ambiguous multi-step migration.
   D. Unknown codebase redesign.

89. [Claude Code for CI/CD] A CI job hangs because Claude Code waits for interactive input. Correct command style? (Select 1.)
   A. Redirect stdin only.
   B. `claude --batch`.
   C. `claude -p "..."` or `claude --print "..."`.
   D. Set `CLAUDE_HEADLESS=true`.

90. [Claude Code for CI/CD] A CI system needs machine-readable review output. Which flags are in scope? (Select 1.)
   A. `--output-format json` and `--json-schema`.
   B. `--oauth-rotate`.
   C. `--cloud-provider aws`.
   D. `--vision-output png`.

91. [Claude Code for CI/CD] Blocking pre-merge checks should usually use: (Select 1.)
   A. Real-time Claude calls.
   B. No output schema.
   C. Manual next-day review only.
   D. Message Batches API with up to 24-hour window.

92. [Claude Code for CI/CD] Overnight technical debt report is cost-sensitive and not latency-sensitive. Best API? (Select 1.)
   A. Computer use.
   B. Message Batches API.
   C. Real-time only.
   D. Vision API.

93. [Claude Code for CI/CD] Select 2 Message Batches facts. (Select 2.)
   A. Results can be correlated with custom_id.
   B. Requires computer use.
   C. Guaranteed low-latency SLA for merge gates.
   D. Supports multi-turn tool calling.
   E. About 50% cost savings.

94. [Code Generation with Claude Code] A developer wants Claude to remember useful project conventions. Which command? (Select 1.)
   A. `/compact`.
   B. `tool_choice any`.
   C. `--json-schema`.
   D. `/memory`.

95. [Code Generation with Claude Code] A long Claude Code session is bloated but still useful. Which command helps compress context? (Select 1.)
   A. `custom_id`.
   B. `/memory` only.
   C. `/compact`.
   D. `process_refund`.

96. [Developer Productivity with Claude] Which subagent is specifically listed for codebase exploration? (Select 1.)
   A. Vision subagent.
   B. Refund subagent.
   C. OAuth subagent.
   D. Explore subagent.

97. [Developer Productivity with Claude] A developer wants to continue named investigation later. Best option? (Select 1.)
   A. `strict mode`.
   B. `--output-format json`.
   C. `--resume <session-name>`.
   D. `isRetryable`.

98. [Code Generation with Claude Code] Path-specific rules should load conditionally based on: (Select 1.)
   A. Current temperature.
   B. Glob/path patterns in rule frontmatter.
   C. Embedding index type.
   D. Billing tier.

99. [Code Generation with Claude Code] A command should be shared only inside one repository. Scope? (Select 1.)
   A. User-global command.
   B. Project command.
   C. MCP hosting scope.
   D. Pearson VUE command.

100. [Code Generation with Claude Code] A command should be available across user's projects. Scope? (Select 1.)
   A. Directory rule only.
   B. User command.
   C. Tool result.
   D. Project-only command.

101. [Claude Code for CI/CD] Automated PR feedback has high false positives. Best improvement? (Select 1.)
   A. Increase randomness.
   B. Use batch for blocking checks.
   C. Remove examples.
   D. Add explicit review criteria, examples, and structured output for actionable findings.

102. [Claude Code for CI/CD] A PR modifies many files and one-pass review is shallow. Best review structure? (Select 1.)
   A. Skip cross-file analysis.
   B. Focused per-file passes followed by cross-file integration pass.
   C. One larger context pass only.
   D. Force all issues into one paragraph.

103. [Claude Code for CI/CD] Which output style helps downstream CI parse findings? (Select 1.)
   A. Hidden chain-of-thought.
   B. Free-form prose only.
   C. JSON matching a schema.
   D. Screenshots.

104. [Code Generation with Claude Code] What should CLAUDE.md not be used for? (Select 1.)
   A. Workflow conventions.
   B. Storing secrets.
   C. Project instructions.
   D. Imported guidance.

105. [Code Generation with Claude Code] Select 2 official Claude Code configuration topics. (Select 2.)
   A. Cloud provider-specific network config.
   B. Vision feature tuning.
   C. `.claude/rules/` glob patterns.
   D. Claude model weight architecture.
   E. `CLAUDE.md` hierarchy.

106. [Code Generation with Claude Code] A coding task requires architectural decision before edits. Best approach? (Select 1.)
   A. Batch overnight.
   B. Use only MCP resource.
   C. Directly edit without planning.
   D. Use plan mode and get plan before execution.

107. [Developer Productivity with Claude] A developer productivity agent needs to explore unfamiliar repo. Good first steps? (Select 1.)
   A. Run process_refund.
   B. Write new files immediately.
   C. Use Glob/Grep/Read to map relevant files before editing.
   D. Assume structure from memory.

108. [Claude Code for CI/CD] What should a CI prompt request for PR review? (Select 1.)
   A. Vague 'is this good?'.
   B. Actionable findings with evidence and clear severity/criteria.
   C. Only compliments.
   D. No file references.

109. [Code Generation with Claude Code] A skill should be limited to safe tools for its task. Which frontmatter field? (Select 1.)
   A. `stop_reason`.
   B. `custom_id`.
   C. `isError`.
   D. `allowed-tools`.

110. [Code Generation with Claude Code] A skill should run in separate context/fork. Which frontmatter concept? (Select 1.)
   A. `errorCategory`.
   B. `max_tokens`.
   C. `tool_choice auto`.
   D. `context: fork`.

111. [Code Generation with Claude Code] A slash command needs user-supplied argument guidance. Which field? (Select 1.)
   A. `isRetryable`.
   B. `end_turn`.
   C. `argument-hint`.
   D. `custom_id`.

112. [Claude Code for CI/CD] Claude Code CLI output should be JSON for CI because: (Select 1.)
   A. It enables image analysis.
   B. Downstream systems can parse and gate results reliably.
   C. It makes Claude non-proctored.
   D. It replaces code review criteria.

113. [Code Generation with Claude Code] An imported instruction file should be referenced using: (Select 1.)
   A. MCP isError.
   B. Message custom_id.
   C. `@import` pattern in CLAUDE.md configuration.
   D. Pydantic nullable.

114. [Developer Productivity with Claude] For a small documentation typo in one file, best execution mode? (Select 1.)
   A. Multi-agent research.
   B. Message Batches API.
   C. Plan mode required always.
   D. Direct execution.

115. [Developer Productivity with Claude] For refactoring authentication across five modules, best execution mode? (Select 1.)
   A. MCP resource.
   B. JSON Schema only.
   C. Plan mode.
   D. Direct execution with no plan.

116. [Claude Code for CI/CD] Select 2 valid CI/CD design choices. (Select 2.)
   A. Require webcam proctor in CI.
   B. Use nonexistent `--batch` flag for Claude Code.
   C. Use `claude -p` for non-interactive execution.
   D. Use batch API for blocking merge gate.
   E. Use `--json-schema` for structured output.

117. [Claude Code for CI/CD] Batch API result ordering should be handled by: (Select 1.)
   A. OAuth token rotation.
   B. `custom_id` correlation.
   C. Assuming returned order always matches input.
   D. Human memory.

118. [Code Generation with Claude Code] A project has directory-specific coding style. Where should this be represented? (Select 1.)
   A. Global hidden prompt only.
   B. PostToolUse hook only.
   C. Directory/path-scoped rules.
   D. Batch request ID.

119. [Developer Productivity with Claude] Explore subagent is most relevant for: (Select 1.)
   A. Changing API billing.
   B. Issuing refunds.
   C. Searching and understanding codebases.
   D. Vision OCR.

120. [Claude Code for CI/CD] Best Domain 3 instinct? (Select 1.)
   A. Use interactive mode in CI.
   B. Store secrets in CLAUDE.md.
   C. Choose correct Claude Code scope, mode, and automation interface for the workflow.
   D. Memorize cloud configs.

### Domain 4: Prompt Engineering & Structured Output

121. [Structured Data Extraction] A document extraction prompt produces inconsistent fields. Best first fix? (Select 1.)
   A. Use a larger context window only.
   B. Use structured output via tool_use with JSON Schema.
   C. Increase temperature.
   D. Ask for prettier prose.

122. [Structured Data Extraction] A field may be absent in source documents. Best schema design? (Select 1.)
   A. Remove validation.
   B. Tell Claude to guess.
   C. Make the field nullable and require evidence/confidence.
   D. Force a non-empty string.

123. [Structured Data Extraction] A category set is finite but new categories may appear. Best schema pattern? (Select 1.)
   A. Enum plus `other` and detail string.
   B. Free text only.
   C. Closed enum with no fallback.
   D. Boolean only.

124. [Structured Data Extraction] What is strict mode useful for in structured output? (Select 1.)
   A. Changing exam score.
   B. Running shell commands.
   C. Replacing semantic validation.
   D. Reducing syntax errors in schema-constrained output.

125. [Structured Data Extraction] Select 3 JSON Schema topics in scope. (Select 3.)
   A. required vs optional fields
   B. enum types
   C. nullable fields
   D. OAuth rotation
   E. vision model tuning
   F. cloud subnet design

126. [Structured Data Extraction] Pydantic validation catches syntactically valid JSON with impossible date range. What kind of validation? (Select 1.)
   A. MCP hosting.
   B. Tokenization.
   C. Computer use.
   D. Semantic validation.

127. [Structured Data Extraction] A validation retry loop should pass back: (Select 1.)
   A. Validation errors and instructions to correct only invalid fields.
   B. A request to hallucinate missing values.
   C. Hidden answer key.
   D. A generic failure with no details.

128. [Structured Data Extraction] Few-shot prompting is best when: (Select 1.)
   A. The system needs OAuth.
   B. No format matters.
   C. The task is pure shell execution.
   D. Ambiguous scenarios need examples to improve consistency.

129. [Claude Code for CI/CD] PR review has too many false positives. What prompt improvement helps? (Select 1.)
   A. Explicit criteria and examples of true vs false positives.
   B. Remove criteria.
   C. Use no severity.
   D. Increase randomness.

130. [Claude Code for CI/CD] A review prompt should produce actionable feedback by including: (Select 1.)
   A. Only 'looks bad'.
   B. File/line evidence, severity, rationale, and suggested fix.
   C. No evidence.
   D. No criteria.

131. [Claude Code for CI/CD] When reviewing 14 files, one full-PR pass causes attention dilution. Best architecture? (Select 1.)
   A. One larger context pass only.
   B. Sequential focused passes per file plus cross-file integration pass.
   C. Randomly sample files.
   D. Skip integration.

132. [Claude Code for CI/CD] Parallel issue resolution is risky when: (Select 1.)
   A. No edits are made.
   B. Issues are completely independent.
   C. Edits overlap and can conflict.
   D. Tasks have no shared files.

133. [Claude Code for CI/CD] Sequential issue resolution is better when: (Select 1.)
   A. All tasks are independent.
   B. Batch custom_id is missing.
   C. No context needed.
   D. Later fixes depend on earlier changes or files overlap.

134. [Structured Data Extraction] A prompt should include explicit criteria because: (Select 1.)
   A. It removes need for evidence.
   B. It improves precision and reduces ambiguous interpretation.
   C. It forces hidden reasoning output.
   D. It replaces schemas.

135. [Structured Data Extraction] For extraction, evidence fields are useful because: (Select 1.)
   A. They support validation and human review.
   B. They force hallucination.
   C. They make all values non-null.
   D. They hide provenance.

136. [Structured Data Extraction] Select 2 correct structured extraction reliability practices. (Select 2.)
   A. Use prose-only output.
   B. Include confidence/evidence for extracted fields.
   C. Ignore edge cases.
   D. Force every field to be non-null.
   E. Validate output and retry with validation feedback.

137. [Claude Code for CI/CD] Message Batches API is best for: (Select 1.)
   A. Latency-tolerant batch jobs like overnight reports.
   B. Blocking pre-merge checks.
   C. Interactive multi-turn tool use.
   D. Immediate user chat.

138. [Claude Code for CI/CD] Message Batches API is inappropriate when: (Select 1.)
   A. Report is due next morning.
   B. Workflow needs guaranteed low latency before merge.
   C. Requests can be correlated later.
   D. Cost savings matter.

139. [Claude Code for CI/CD] Batch responses should be correlated using: (Select 1.)
   A. `custom_id`.
   B. Hidden chain of thought.
   C. MCP resource URI only.
   D. Output order only.

140. [Claude Code for CI/CD] Which Message Batches limitation is in scope? (Select 1.)
   A. No multi-turn tool calling support.
   B. Cannot use custom IDs.
   C. Requires image input.
   D. No cost savings.

141. [Structured Data Extraction] A schema has enum values low/medium/high confidence. What does this help? (Select 1.)
   A. Authenticate API calls.
   B. Constrain output to valid confidence labels.
   C. Run Bash.
   D. Spawn subagents.

142. [Structured Data Extraction] A prompt asks 'extract all important data' with no schema. Risk? (Select 1.)
   A. Overuse of enum.
   B. Inconsistent output and missing downstream contract.
   C. Too much deterministic enforcement.
   D. Too many validation errors.

143. [Structured Data Extraction] Best retry after Pydantic error: amount must be numeric. (Select 1.)
   A. Tell Claude the specific validation error and ask for corrected JSON.
   B. Ask it to rewrite entire document creatively.
   C. Ignore the error.
   D. Change every field randomly.

144. [Claude Code for CI/CD] A CI review should minimize false positives because: (Select 1.)
   A. Developers lose trust and useful feedback becomes noise.
   B. CI cannot parse JSON.
   C. False positives improve merge speed.
   D. Severity fields are out of scope.

145. [Claude Code for CI/CD] Select 2 review architecture facts. (Select 2.)
   A. Batch is always best for PR gates.
   B. Per-file passes improve local attention.
   C. Larger context always fixes attention dilution.
   D. Voting should suppress all intermittent bugs.
   E. Cross-file pass catches integration issues.

146. [Structured Data Extraction] Few-shot examples should be targeted at: (Select 1.)
   A. Cloud provider setup.
   B. Unrelated domains.
   C. Only trivial happy paths.
   D. Ambiguous or failure-prone cases.

147. [Structured Data Extraction] Format demonstration examples help because: (Select 1.)
   A. They hide source evidence.
   B. They replace validation forever.
   C. They enable OAuth.
   D. They show the expected output shape.

148. [Structured Data Extraction] A nullable field prevents hallucination by: (Select 1.)
   A. Hiding missingness.
   B. Increasing temperature.
   C. Allowing 'not present' rather than forcing invented value.
   D. Preventing all errors.

149. [Claude Code for CI/CD] A multi-instance review that only flags issues found by two of three runs can be bad because: (Select 1.)
   A. It always creates too many findings.
   B. It cannot run in parallel.
   C. It prevents JSON output.
   D. It may suppress real bugs caught intermittently.

150. [Claude Code for CI/CD] A code review prompt should define severity levels to: (Select 1.)
   A. Store credentials.
   B. Make output consistent and actionable.
   C. Choose MCP server transport.
   D. Avoid evidence.

151. [Structured Data Extraction] An extraction system should handle edge cases gracefully by: (Select 1.)
   A. Removing optionality.
   B. Including examples, schema fallbacks, validation, and confidence.
   C. Guessing missing fields.
   D. Using a generic prompt only.

152. [Structured Data Extraction] A validation loop should stop when: (Select 1.)
   A. Output passes schema and semantic checks or escalation/failure criteria are met.
   B. The prose sounds confident.
   C. A random iteration cap is hit regardless of success.
   D. A hidden token appears.

153. [Claude Code for CI/CD] For automated PR comments, structured output helps: (Select 1.)
   A. Bypass tests.
   B. Remove evidence.
   C. Route comments, count severities, and fail/pass CI deterministically.
   D. Make findings less parseable.

154. [Structured Data Extraction] Best prompt for ambiguous extraction: (Select 1.)
   A. Force non-null values.
   B. No examples.
   C. Use only 'extract data'.
   D. Include instructions, schema, few-shot examples, and missing-data behavior.

155. [Structured Data Extraction] Select 3 structured-output concepts tested. (Select 3.)
   A. vision OCR tuning
   B. field-level confidence
   C. tool_use with JSON schemas
   D. embedding model training
   E. SSE streaming implementation
   F. Pydantic validation-retry loops

156. [Claude Code for CI/CD] A nightly job has thousands of independent reviews and can complete tomorrow. Best cost design? (Select 1.)
   A. Blocking real-time merge gate.
   B. Computer use.
   C. Interactive Claude Code session per item.
   D. Message Batches API.

157. [Structured Data Extraction] Strict syntax alone is insufficient because: (Select 1.)
   A. Output can be syntactically valid but semantically wrong.
   B. JSON cannot be validated.
   C. Pydantic is out of scope.
   D. Schemas remove all errors.

158. [Claude Code for CI/CD] Input/output examples in iterative refinement are used to: (Select 1.)
   A. Guide improvements toward desired behavior.
   B. Replace tests.
   C. Store secrets.
   D. Configure OAuth.

159. [Structured Data Extraction] Best Domain 4 instinct? (Select 1.)
   A. Force guesses.
   B. Trust prose-only output.
   C. Specify output contract, validate it, retry with feedback, and measure failure modes.
   D. Use batch for all latency-sensitive work.

160. [Claude Code for CI/CD] A review system should reduce false positives by: (Select 1.)
   A. Increasing temperature.
   B. Using explicit criteria, few-shot examples, and focused passes.
   C. Removing examples.
   D. Suppressing all rare findings.

### Domain 5: Context Management & Reliability

161. [Multi-Agent Research System] Long research conversations lose key facts. Best context strategy? (Select 1.)
   A. Progressive summarization and structured extraction of critical facts.
   B. Paste everything forever.
   C. Increase temperature.
   D. Ignore lost-in-the-middle.

162. [Multi-Agent Research System] Lost-in-the-middle effect means: (Select 1.)
   A. Important information can be overlooked when buried in long context.
   B. Context windows are unlimited.
   C. MCP resources cannot help.
   D. Middle context is always weighted highest.

163. [Developer Productivity with Claude] Large codebase exploration should begin with: (Select 1.)
   A. Run refunds.
   B. Paste entire repository into one prompt.
   C. Write files before reading.
   D. Glob/Grep/Read mapping and focused summaries.

164. [Developer Productivity with Claude] Scratchpad files are useful for: (Select 1.)
   A. Persisting structured notes during long codebase exploration.
   B. Replacing validation.
   C. Changing exam scoring.
   D. Storing API secrets.

165. [Customer Support Resolution Agent] A customer explicitly prefers escalation to phone support. What should system do? (Select 1.)
   A. Ignore preference.
   B. Honor preference when escalation criteria are met and include it in handoff.
   C. Refund without verification.
   D. Hide it from human agent.

166. [Customer Support Resolution Agent] Escalation criteria should be: (Select 1.)
   A. Never documented.
   B. Based only on response length.
   C. Explicit and tied to ambiguity, policy gaps, failures, or risk.
   D. Implicit and hidden.

167. [Customer Support Resolution Agent] A human receiving escalation lacks transcript access. Handoff must include: (Select 1.)
   A. Only ticket ID with no context.
   B. Customer details, issue summary, root cause, attempted actions, recommended next step.
   C. Hidden system prompt.
   D. No evidence.

168. [Multi-Agent Research System] A subagent cannot recover from repeated timeout. What should it return? (Select 1.)
   A. Nothing.
   B. Fabricated findings.
   C. Structured error, attempted steps, partial results, and alternatives.
   D. Successful empty result.

169. [Multi-Agent Research System] Why is marking timeout as empty successful result dangerous? (Select 1.)
   A. Coordinator may think no evidence exists rather than recovery failed.
   B. It improves provenance.
   C. It is always correct.
   D. It forces retry.

170. [Multi-Agent Research System] Select 3 provenance elements for research reports. (Select 3.)
   A. model weights
   B. conflict annotation
   C. browser screenshots
   D. temporal data handling
   E. claim-source mappings
   F. OAuth secrets

171. [Multi-Agent Research System] Research sources conflict on a date. Best output? (Select 1.)
   A. Invent a third date.
   B. Pick one silently.
   C. Omit all dates.
   D. Annotate conflict, cite both sources, and express uncertainty or resolution criteria.

172. [Structured Data Extraction] Field-level confidence is useful for: (Select 1.)
   A. Hiding uncertainty.
   B. Replacing evidence.
   C. Targeting human review and calibrating extraction reliability.
   D. Running Bash.

173. [Structured Data Extraction] Confidence should be calibrated with: (Select 1.)
   A. Labeled validation sets.
   B. Cloud region.
   C. Gut feeling.
   D. Output length.

174. [Structured Data Extraction] If overall extraction accuracy is high but invoices fail often, use: (Select 1.)
   A. No human review.
   B. Stratified sampling by document type and field.
   C. Random confidence labels.
   D. Only aggregate accuracy.

175. [Structured Data Extraction] Human review workflows should sample: (Select 1.)
   A. By confidence, document type, field, and risk segment.
   B. Only successful validations.
   C. Only easiest documents.
   D. Only longest outputs.

176. [Customer Support Resolution Agent] A policy gap is discovered in support workflow. Best response? (Select 1.)
   A. Process refund anyway.
   B. Ignore ambiguity.
   C. Invent a policy.
   D. Escalate with policy gap identified and evidence.

177. [Developer Productivity with Claude] Context extraction means: (Select 1.)
   A. Extracting API keys.
   B. Pulling key facts into compact structured context for future steps.
   C. Deleting all summaries.
   D. Turning off tools.

178. [Multi-Agent Research System] Coverage gap reporting means: (Select 1.)
   A. Hiding missing evidence.
   B. Filling gaps with guesses.
   C. Explicitly stating what was not found or could not be verified.
   D. Removing citations.

179. [Multi-Agent Research System] Temporal data handling is important because: (Select 1.)
   A. Dates are never relevant.
   B. Claims may depend on dates, versions, or source freshness.
   C. It only affects images.
   D. It replaces source maps.

180. [Developer Productivity with Claude] After code files changed, old context should be treated as: (Select 1.)
   A. A substitute for tests.
   B. Always authoritative.
   C. Better than current file reads.
   D. Potentially stale and needing targeted re-analysis.

181. [Customer Support Resolution Agent] Select 2 escalation triggers. (Select 2.)
   A. Question uses polite language.
   B. Output is short.
   C. Customer request requiring human approval.
   D. Tool succeeded with complete answer.
   E. Policy ambiguity or gap.

182. [Multi-Agent Research System] Error propagation across multi-agent systems should: (Select 1.)
   A. Preserve enough context for coordinator recovery decisions.
   B. Treat every error as success.
   C. Hide local attempts.
   D. Always terminate immediately.

183. [Developer Productivity with Claude] A codebase exploration context is too large. Best action? (Select 1.)
   A. Summarize findings, keep file references, and retrieve/read details as needed.
   B. Ignore relevant files.
   C. Use vision.
   D. Paste every file repeatedly.

184. [Structured Data Extraction] A low-confidence extracted tax ID should: (Select 1.)
   A. Be routed to human review or flagged, with evidence.
   B. Be guessed from vendor name.
   C. Be treated as certain.
   D. Be deleted silently.

185. [Multi-Agent Research System] Claim-source mapping means: (Select 1.)
   A. Sources are hidden.
   B. Every key claim links to supporting source metadata.
   C. Every claim has same source.
   D. Claims are generated without evidence.

186. [Customer Support Resolution Agent] A support agent should resolve ambiguity by: (Select 1.)
   A. Guessing user intent for side effects.
   B. Ignoring ambiguity.
   C. Asking clarifying questions or escalating based on explicit criteria.
   D. Pretending tool succeeded.

187. [Developer Productivity with Claude] Token budgets help: (Select 1.)
   A. Guarantee correctness.
   B. Run commands.
   C. Decide what to keep, summarize, retrieve, or drop.
   D. Replace evidence.

188. [Structured Data Extraction] Accuracy segmentation by field reveals: (Select 1.)
   A. Model billing.
   B. OAuth status.
   C. MCP transport.
   D. Which fields fail even if aggregate accuracy looks good.

189. [Multi-Agent Research System] A coordinator should receive partial results because: (Select 1.)
   A. They replace task goals.
   B. They prevent citations.
   C. It can decide to proceed, retry, or report caveats.
   D. Partial results are always wrong.

190. [Structured Data Extraction] Confidence labels without calibration are risky because: (Select 1.)
   A. They replace validation.
   B. They cannot be reviewed.
   C. They may not match actual error rates.
   D. They are always exact.

191. [Customer Support Resolution Agent] Structured handoff is especially important when: (Select 1.)
   A. No escalation occurs.
   B. Output is JSON.
   C. Only one source exists.
   D. Human agent lacks access to full conversation transcript.

192. [Multi-Agent Research System] When source coverage is insufficient, final report should: (Select 1.)
   A. State coverage gap and avoid unsupported conclusions.
   B. Infer missing evidence.
   C. Hide uncertainty.
   D. Cite nonexistent source.

193. [Structured Data Extraction] Select 3 human review design concepts. (Select 3.)
   A. cloud subnets
   B. vision tuning
   C. model weights
   D. field-level confidence
   E. stratified sampling
   F. accuracy segmentation

194. [Developer Productivity with Claude] A long coding session should preserve: (Select 1.)
   A. Every raw log forever.
   B. No test results.
   C. Only model guesses.
   D. Current task state, key findings, file references, and validation status.

195. [Multi-Agent Research System] Conflict annotation is preferable to: (Select 1.)
   A. Silently choosing one conflicting source.
   B. Citing both sources.
   C. Reporting date differences.
   D. Explaining uncertainty.

196. [Customer Support Resolution Agent] Honoring customer preference in escalation means: (Select 1.)
   A. Ignore preference after escalation.
   B. Include requested contact method or constraints in handoff when relevant.
   C. Delete customer context.
   D. Use random channel.

197. [Multi-Agent Research System] A research report with comprehensive citations but no coverage gap section may fail when: (Select 1.)
   A. All claims are sourced.
   B. The report is concise.
   C. No conflicts exist.
   D. Important subtopics lacked evidence and this is not disclosed.

198. [Developer Productivity with Claude] Position-aware input ordering helps mitigate: (Select 1.)
   A. Exam proctoring.
   B. MCP permission errors.
   C. OAuth rotation.
   D. Lost-in-the-middle and attention issues.

199. [Structured Data Extraction] Best Domain 5 instinct? (Select 1.)
   A. Maximize raw context always.
   B. Trust uncalibrated confidence.
   C. Hide uncertainty.
   D. Keep critical context compact, source-linked, recoverable, and reviewable.

200. [Customer Support Resolution Agent] A support workflow has repeated unresolved permission errors. Best next step? (Select 1.)
   A. Escalate with structured permission error context and attempted actions.
   B. Retry forever.
   C. Invent customer data.
   D. Mark as successful.

## Answer Key

1 D
2 C
3 D
4 C
5 DE
6 A
7 A
8 D
9 CDF
10 D
11 D
12 C
13 D
14 A
15 B
16 DE
17 C
18 A
19 A
20 A
21 DE
22 A
23 B
24 C
25 CEF
26 A
27 A
28 A
29 B
30 AE
31 B
32 A
33 D
34 B
35 CD
36 A
37 D
38 A
39 D
40 B
41 B
42 D
43 C
44 B
45 ACE
46 B
47 D
48 D
49 D
50 A
51 A
52 B
53 A
54 A
55 D
56 D
57 B
58 D
59 DE
60 D
61 A
62 B
63 C
64 C
65 D
66 AC
67 D
68 D
69 D
70 A
71 B
72 B
73 D
74 ABF
75 A
76 C
77 D
78 D
79 A
80 C
81 C
82 D
83 D
84 C
85 C
86 BCE
87 D
88 A
89 C
90 A
91 A
92 B
93 AE
94 D
95 C
96 D
97 C
98 B
99 B
100 B
101 D
102 B
103 C
104 B
105 CE
106 D
107 C
108 B
109 D
110 D
111 C
112 B
113 C
114 D
115 C
116 CE
117 B
118 C
119 C
120 C
121 B
122 C
123 A
124 D
125 ABC
126 D
127 A
128 D
129 A
130 B
131 B
132 C
133 D
134 B
135 A
136 BE
137 A
138 B
139 A
140 A
141 B
142 B
143 A
144 A
145 BE
146 D
147 D
148 C
149 D
150 B
151 B
152 A
153 C
154 D
155 BCF
156 D
157 A
158 A
159 C
160 B
161 A
162 A
163 D
164 A
165 B
166 C
167 B
168 C
169 A
170 BDE
171 D
172 C
173 A
174 B
175 A
176 D
177 B
178 C
179 B
180 D
181 CE
182 A
183 A
184 A
185 B
186 C
187 C
188 D
189 C
190 C
191 D
192 A
193 DEF
194 D
195 A
196 B
197 D
198 D
199 D
200 A

## Instructor Notes

- Questions include both single-select and multiple-response items.
- Keep answer key separate until review.
- For every miss, ask students to identify official domain, scenario, primitive tested, and reliability principle missed.
- This practice exam is original training material, not copied exam content.
