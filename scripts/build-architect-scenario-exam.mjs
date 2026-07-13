import fs from "node:fs";

const domains = [
  "Agentic Architecture & Orchestration",
  "Tool Design & MCP Integration",
  "Claude Code Configuration & Workflows",
  "Prompt Engineering & Structured Output",
  "Context Management & Reliability",
];

const cases = [
  {
    type: "Customer Support Resolution Agent",
    title: "Refunds with identity and policy gates",
    org: "A subscription billing team",
    situation: "Customers contact chat support about duplicate charges, refunds, failed plan changes, and missing invoices. The company wants Claude to resolve routine cases, gather evidence from billing and CRM systems, and prepare escalations for finance when the requested action exceeds policy.",
    architecture: "The proposed design uses an Agent SDK loop with tools for identity verification, account lookup, invoice search, refund eligibility, refund execution, and ticket notes. A coordinator agent owns the conversation, tool sequencing, and final response. Refund execution must be blocked unless identity verification, account ownership, refund eligibility, and amount threshold checks have all passed.",
    failure: "In pilot testing, Claude sometimes writes that the customer is verified before the identity tool returns success. In other runs it retries a failed refund tool without explaining the failure. Finance also reports escalations that omit invoice IDs, customer IDs, and the policy clause that forced escalation.",
    constraints: ["Refunds over $250 require human approval.", "PII must never be sent to logging tools.", "Every escalation must include account ID, invoice ID, attempted actions, and policy reason.", "The final customer response must be concise and must not expose internal policy text."],
  },
  {
    type: "Customer Support Resolution Agent",
    title: "Order replacement triage across carriers",
    org: "An ecommerce operations group",
    situation: "Support agents receive thousands of messages about lost deliveries, damaged goods, delayed shipments, and incorrect addresses. The desired Claude workflow should decide whether to answer directly, request missing information, open a carrier claim, create a replacement order, or escalate to fraud review.",
    architecture: "The design includes tools for customer authentication, order lookup, tracking lookup, address validation, carrier claim creation, replacement order creation, and CRM note writing. Claude receives short policy excerpts and a structured summary of prior interactions. A coordinator may ask a shipping-specialist subagent to inspect carrier evidence and a policy-specialist subagent to classify eligibility.",
    failure: "The first implementation lets the model call replacement_order whenever it predicts the customer is eligible. It also sends carrier screenshots to subagents without source labels. When carrier APIs timeout, the final message often sounds confident even though the shipment status is unknown.",
    constraints: ["Replacement orders require a verified order, verified customer, eligible policy result, and known shipment state.", "Carrier claim failures must be surfaced to the coordinator.", "Subagents do not inherit parent context.", "Customer-facing uncertainty must be explicit when evidence is incomplete."],
  },
  {
    type: "Customer Support Resolution Agent",
    title: "Healthcare appointment support",
    org: "A clinic network",
    situation: "The clinic wants a Claude support agent to answer appointment questions, reschedule visits, route billing questions, and prepare handoffs to staff. The agent can access scheduling metadata but must not offer clinical advice or infer diagnoses.",
    architecture: "The workflow has tools for patient verification, appointment lookup, provider availability, rescheduling, billing-ticket creation, and staff handoff. A guardrail hook checks whether the proposed action is administrative or clinical. The final response must be warm, brief, and grounded in verified appointment data.",
    failure: "During review, the agent sometimes attempts to reschedule before patient verification completes. It also summarizes symptoms into the staff note without indicating that the note came from unverified patient text. Staff want fewer generic escalations and more structured handoffs.",
    constraints: ["No clinical advice.", "Rescheduling requires verification and available slot confirmation.", "Staff handoffs must separate verified records from patient-provided claims.", "Tool errors must not be hidden from staff."],
  },
  {
    type: "Code Generation with Claude Code",
    title: "Legacy API migration",
    org: "A SaaS platform team",
    situation: "Engineers are migrating a legacy REST billing API to a new internal service. They want Claude Code to inspect the repository, propose an implementation plan, update handlers and tests, and prepare a pull request summary for reviewers.",
    architecture: "The repository has AGENTS.md instructions, a service-specific CLAUDE.md, custom slash commands for test selection, and a skill for billing migration conventions. Claude Code is expected to use plan mode before edits, respect protected files, run focused tests, and summarize changed behavior rather than simply listing files.",
    failure: "A trial run edited generated client files, skipped the repo migration guide, and used broad test commands that timed out. The PR summary omitted one behavior change around idempotency. Reviewers want the workflow configured so Claude Code follows repository-local rules and asks before risky operations.",
    constraints: ["Generated client files are read-only.", "Migration changes must include unit tests and contract tests.", "Claude Code must not run destructive git commands.", "CI uses a custom command that requires the correct changed-package list."],
  },
  {
    type: "Code Generation with Claude Code",
    title: "Frontend accessibility repair",
    org: "A product design systems team",
    situation: "A dashboard has keyboard traps, missing labels, inconsistent loading states, and brittle component tests. The team wants Claude Code to identify the issues, repair components, update tests, and avoid broad visual redesign.",
    architecture: "Claude Code has access to component source, Playwright tests, design-system rules, and a skill describing accessibility review conventions. The workflow should start with a plan, inspect existing patterns, make scoped edits, run relevant tests, and produce a reviewer-ready explanation.",
    failure: "In the first attempt, Claude changed unrelated colors, created a new button abstraction, and missed that a modal close button had an accessible name conflict. It also claimed tests passed without actually running the failing Playwright file.",
    constraints: ["No unrelated visual redesign.", "Use existing design-system primitives.", "Do not invent test results.", "Every interactive control needs a stable accessible name and keyboard path."],
  },
  {
    type: "Code Generation with Claude Code",
    title: "CI failure repair",
    org: "A platform engineering team",
    situation: "A monorepo has intermittent CI failures after a dependency upgrade. Engineers want Claude Code to inspect failing logs, identify the smallest behavioral fix, update tests if needed, and create a concise repair summary.",
    architecture: "The setup includes CI log artifacts, package-level commands, repository rules, and a Claude Code skill for triaging test failures. The desired agent should reason from actual logs, avoid shotgun dependency changes, and ask before changing lockfiles.",
    failure: "A previous run updated multiple packages without proving they caused the failure. Another run only changed snapshots, masking a real timeout bug in a retry helper. The team needs a workflow that distinguishes flaky infrastructure from product regressions.",
    constraints: ["Use log evidence before editing.", "Lockfile changes require approval.", "Prefer narrow package tests before full CI.", "Do not mark failures fixed without rerunning the relevant command."],
  },
  {
    type: "Multi-Agent Research System",
    title: "Competitive intelligence report",
    org: "A strategy team",
    situation: "The team wants a multi-agent research system to compare five competitors, summarize product positioning, identify pricing signals, cite sources, and produce a brief for executives. The source set includes web pages, filings, release notes, and internal notes.",
    architecture: "A coordinator decomposes the task into competitor research, pricing research, product-change research, and synthesis. Each subagent receives explicit instructions, source requirements, and output schema. The coordinator must aggregate evidence, detect contradictions, and request a second pass when coverage is thin.",
    failure: "The initial design produced a polished report but lost citations for several claims. Subagents duplicated work because task boundaries were vague. The synthesis agent treated stale pricing pages as current and failed to mark uncertainty.",
    constraints: ["Every important claim needs a source.", "Source date matters.", "Subagents have isolated context.", "The final report must separate findings, confidence, gaps, and recommended follow-up."],
  },
  {
    type: "Multi-Agent Research System",
    title: "Regulatory change monitor",
    org: "A compliance group",
    situation: "The company wants Claude to monitor regulatory updates, classify relevance by business unit, summarize obligations, and prepare review packets for lawyers. The information comes from agency pages, newsletters, PDFs, and internal policy mappings.",
    architecture: "A coordinator routes collection, extraction, legal-summary, and impact-analysis tasks to separate subagents. MCP resources expose policy mappings and jurisdiction metadata. Tools can fetch documents, extract text, and store reviewed summaries.",
    failure: "In testing, collection agents included unrelated jurisdictions, extraction agents dropped page numbers, and the final synthesis mixed legal obligations with operational recommendations. Lawyers asked for provenance, confidence, and explicit unknowns.",
    constraints: ["No legal advice should be presented as final.", "PDF references need page numbers.", "Jurisdiction and effective date must be preserved.", "Low-confidence items require human review."],
  },
  {
    type: "Multi-Agent Research System",
    title: "Technical architecture due diligence",
    org: "An investment diligence team",
    situation: "Analysts want Claude to evaluate an acquisition target's public technical footprint, hiring signals, dependency risks, and likely architecture maturity. The system should produce a diligence memo with cited evidence and caveats.",
    architecture: "The coordinator uses web research, repository analysis, hiring-signal analysis, and synthesis subagents. Each subagent returns structured findings with sources, dates, confidence, and unresolved questions. The final memo must distinguish observed facts from inference.",
    failure: "The first memo overstated conclusions based on job postings and treated old GitHub activity as current. The coordinator failed to ask for additional evidence when the repository analysis was sparse.",
    constraints: ["Do not imply private knowledge.", "Inference must be labeled.", "Missing evidence must be visible.", "Subagent outputs must include source URLs and dates."],
  },
  {
    type: "Developer Productivity with Claude",
    title: "Internal developer assistant rollout",
    org: "A 400-engineer software company",
    situation: "Engineering leadership is rolling out Claude as an internal development assistant for code search, design questions, test generation, and onboarding. The assistant must answer from internal docs and repositories while avoiding unsupported claims.",
    architecture: "The system combines retrieval over approved docs, tools for issue lookup and repository search, Claude Code for implementation tasks, and a feedback loop for failed answers. Prompts instruct Claude to cite sources, ask for clarification when requests are ambiguous, and route implementation work to Claude Code.",
    failure: "Early users report confident answers from outdated docs and inconsistent handoffs from chat to Claude Code. Some answers include too much irrelevant context, pushing key constraints into the middle of the prompt.",
    constraints: ["Answers must cite internal docs or say evidence is missing.", "Implementation tasks should move to Claude Code with explicit repo context.", "Context should be ordered so critical constraints are hard to miss.", "Feedback should capture bad source use and missing clarifications."],
  },
  {
    type: "Developer Productivity with Claude",
    title: "Data science notebook assistant",
    org: "A data platform team",
    situation: "Data scientists want Claude to help debug notebooks, explain model evaluation results, generate SQL, and create repeatable analysis steps. The assistant can read notebook cells, dataset schemas, and selected run metadata.",
    architecture: "The workflow uses tools for schema lookup, query validation, notebook cell summarization, and experiment metadata retrieval. Claude should preserve assumptions, avoid fabricating dataset columns, and escalate when a requested query may expose restricted data.",
    failure: "A pilot answer invented a column name, gave a confident model explanation despite missing experiment metadata, and buried data-access warnings after a long explanation. The team wants safer defaults and better structured outputs.",
    constraints: ["Schema must be verified before SQL generation.", "Restricted data requires escalation.", "Model interpretations need run metadata.", "Warnings and assumptions must appear before generated code."],
  },
  {
    type: "Developer Productivity with Claude",
    title: "Architecture decision support",
    org: "A cloud architecture guild",
    situation: "Architects want Claude to help compare design options, draft ADRs, identify risks, and check decisions against internal platform standards. Inputs include user requirements, diagrams, standards, and prior ADRs.",
    architecture: "Claude uses retrieval for platform standards, a tool for ADR lookup, and a structured ADR output schema. For complex requests, it asks clarifying questions before recommending an option. It must label tradeoffs and preserve decision rationale.",
    failure: "The first workflow produced polished ADRs that skipped nonfunctional requirements and ignored contradictory prior decisions. It also treated a preferred option in the prompt as a final decision without checking constraints.",
    constraints: ["Prior ADR conflicts must be surfaced.", "Nonfunctional requirements must be represented.", "Recommendations need assumptions and tradeoffs.", "Final ADRs should use the approved schema."],
  },
  {
    type: "Claude Code for CI/CD",
    title: "Automated pull request repair",
    org: "A DevOps enablement team",
    situation: "The team wants Claude Code to respond to failed pull-request checks by reading logs, making minimal fixes, rerunning relevant tests, and posting a summary for reviewers. The goal is to reduce developer wait time without hiding risk.",
    architecture: "GitHub Actions provides logs and artifacts. Claude Code runs in a constrained environment with repository instructions, a CI-fix skill, and commands for package-specific test selection. The system must avoid force-pushes, destructive git operations, and broad formatting churn.",
    failure: "In dry runs, Claude fixed lint errors but ignored a failing integration test. Another run changed generated files and committed snapshots without explaining why. Reviewers need proof of what was run and what remains risky.",
    constraints: ["No force push.", "Generated files are protected.", "Every fix summary must list commands run and residual risk.", "If tests cannot run, the summary must say so plainly."],
  },
  {
    type: "Claude Code for CI/CD",
    title: "Release note generation from commits",
    org: "A release management team",
    situation: "Release managers want Claude Code to generate release notes by inspecting commits, issues, and merged pull requests. The output should separate user-facing changes, internal maintenance, migrations, and known issues.",
    architecture: "Claude Code can read git history, issue metadata, and templates. It should run in plan mode first, use a structured output template, and avoid including unreleased or unrelated work. A reviewer approves the final notes before publication.",
    failure: "A trial note included internal refactors as customer features and missed a migration warning buried in a PR description. It also linked to a private issue in public notes.",
    constraints: ["Public notes cannot expose private issue links.", "Migration warnings must be prominent.", "Only commits in the release range are in scope.", "Reviewer approval is required before publication."],
  },
  {
    type: "Claude Code for CI/CD",
    title: "Security patch verification",
    org: "A security engineering team",
    situation: "A dependency vulnerability requires a patch across several services. The team wants Claude Code to identify affected packages, update code if necessary, run targeted tests, and prepare evidence for security review.",
    architecture: "The workflow uses dependency scanning output, repository manifests, service ownership data, and package test commands. Claude Code must distinguish direct from transitive exposure and request approval before changing lockfiles in shared packages.",
    failure: "A previous agent upgraded a root dependency but missed a service-specific override. Another generated a security summary without proof that the vulnerable path was no longer reachable.",
    constraints: ["Lockfile changes require approval.", "Security evidence must cite scanner output and tests.", "Service owners must be named for unresolved exposure.", "Do not claim remediation without verification."],
  },
  {
    type: "Structured Data Extraction",
    title: "Invoice extraction pipeline",
    org: "A finance operations team",
    situation: "The finance team receives supplier invoices in PDF, email, and scanned image form. They want Claude to extract vendor, invoice number, purchase order, line items, totals, tax, currency, due date, and exceptions into a validated JSON object.",
    architecture: "The workflow uses document text extraction, image OCR when needed, Claude structured output with JSON Schema, validation, retry with error feedback, and a human-review queue for low-confidence or inconsistent documents. Few-shot examples cover normal invoices, credit notes, and missing purchase orders.",
    failure: "The first pipeline returned valid-looking JSON even when totals did not reconcile. It also merged tax and shipping into line items and failed silently when OCR confidence was low.",
    constraints: ["Output must match the schema.", "Totals must reconcile or flag an exception.", "OCR confidence below threshold requires review.", "Retries should include validation errors, not vague instructions."],
  },
  {
    type: "Structured Data Extraction",
    title: "Contract obligation extraction",
    org: "A legal operations team",
    situation: "The team wants Claude to extract obligations from customer contracts, including renewal notice periods, security commitments, data residency terms, liability caps, and unusual obligations. The output feeds a contract management system.",
    architecture: "Documents are chunked by section with page metadata. Claude returns structured obligations with clause text, page number, confidence, party, deadline, and review flag. A second review pass checks for missed obligations and conflicts.",
    failure: "A pilot extracted obligations but dropped page references and treated definitions as obligations. It also missed a conflict between an addendum and the master agreement.",
    constraints: ["Every extracted obligation needs page and clause reference.", "Definitions are context, not obligations.", "Conflicts must be flagged.", "Low confidence or unusual terms require human review."],
  },
  {
    type: "Structured Data Extraction",
    title: "Support ticket classification",
    org: "A customer experience analytics team",
    situation: "Managers want Claude to classify support tickets into product area, issue type, severity, sentiment, root cause, and recommended next action. The output will drive dashboards and escalation queues.",
    architecture: "The classifier uses structured output, a taxonomy resource, examples for edge cases, and validation against allowed labels. It can ask for missing context when a ticket is too ambiguous. A batch job processes historical tickets and routes uncertain cases for review.",
    failure: "The first batch overused high severity, invented taxonomy labels, and mixed customer emotion with operational severity. Some records exceeded the context window and lost the most important recent message.",
    constraints: ["Use only allowed taxonomy labels.", "Severity must be evidence-based.", "Customer sentiment is separate from operational severity.", "Recent decisive messages must stay near the model's attention."],
  },
  {
    type: "Structured Data Extraction",
    title: "Clinical intake normalization",
    org: "A healthcare administration team",
    situation: "The team wants Claude to normalize patient intake forms into administrative routing fields: appointment type, requested provider, insurance status, urgency, missing documents, and staff follow-up needs. It must not diagnose or recommend treatment.",
    architecture: "The system uses schema-constrained output, source-span references, validation, and staff review for urgent or ambiguous cases. Prompts distinguish patient-reported symptoms from verified administrative data.",
    failure: "A test run inferred urgency from symptom wording without routing criteria and summarized symptoms as facts. It also omitted the source field for missing insurance documents.",
    constraints: ["No diagnosis or treatment advice.", "Patient-reported claims must be labeled.", "Urgency routing must follow explicit criteria.", "Missing document decisions need source references."],
  },
  {
    type: "Multi-Agent Research System",
    title: "Incident postmortem evidence synthesis",
    org: "A reliability engineering team",
    situation: "After a production incident, engineers want Claude to synthesize logs, chat transcripts, deployment records, alerts, and runbooks into a postmortem draft. The system should identify timeline events, contributing factors, customer impact, and follow-up actions.",
    architecture: "A coordinator routes timeline extraction, log analysis, chat summarization, runbook comparison, and action-item synthesis to separate agents. Each agent returns evidence with timestamps and confidence. The coordinator reconciles conflicts before drafting.",
    failure: "The initial postmortem mixed speculation with facts and lost timezone information. It also failed to indicate that one log source was unavailable, causing reviewers to assume coverage was complete.",
    constraints: ["Timestamp and timezone must be preserved.", "Unavailable sources must be disclosed.", "Speculation must be labeled.", "Action items need owners, evidence, and verification criteria."],
  },
  {
    type: "Developer Productivity with Claude",
    title: "Enterprise prompt library governance",
    org: "An AI enablement office",
    situation: "The company maintains reusable prompts, Claude Code commands, and skills for different business teams. They want Claude to help authors improve prompts while enforcing governance rules around data handling, citations, and testing.",
    architecture: "The workflow uses a prompt review rubric, examples of approved patterns, a repository of skills, and an evaluation set for common failure modes. Claude should suggest changes, explain risks, and generate tests for ambiguous or high-impact prompts.",
    failure: "A previous review accepted prompts that lacked failure handling and allowed sensitive data to be pasted into third-party tools. It also treated style improvements as sufficient evidence that the prompt was safer.",
    constraints: ["Prompts that touch sensitive data require explicit handling rules.", "High-impact prompts need eval cases.", "Style polish is not a safety evaluation.", "Reusable assets should define inputs, outputs, and refusal/escalation behavior."],
  },
];

const questionSet = [
  {
    domain: domains[0],
    select: 1,
    stem: "Given this case, what is the best orchestration boundary for Claude?",
    options: [
      "Use a single long-running assistant prompt that describes the desired workflow and asks Claude to decide when each step is complete.",
      "Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.",
      "Run each tool in a fixed sequence before calling Claude, then ask Claude to summarize the collected results.",
      "Give each specialist subagent the full transcript and let the final subagent decide when the overall task is complete.",
    ],
    answer: ["B"],
    explanation: "The exam favors explicit agent loops and scoped delegation, not free-form state transitions or assumed shared context.",
  },
  {
    domain: domains[0],
    select: 2,
    stem: "Which two design choices best reduce unsafe autonomous action in this scenario?",
    options: [
      "Programmatic gates or hooks around irreversible or high-risk tools.",
      "A broader context window that includes the full policy manual for every request.",
      "Clear escalation criteria with structured handoff fields.",
      "A prompt instruction telling Claude to be conservative with high-impact actions.",
      "A post-hoc audit report that reviews completed actions once per day.",
    ],
    answer: ["A", "C"],
    explanation: "Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.",
  },
  {
    domain: domains[1],
    select: 1,
    stem: "Which tool design is most appropriate for the system described in the case?",
    options: [
      "A small set of broad workflow tools that accept natural-language task descriptions so Claude has flexibility.",
      "Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.",
      "A single orchestration tool that internally calls the right service and returns a concise success or failure message.",
      "Tools that return human-readable summaries with enough detail for Claude to infer status and next steps.",
    ],
    answer: ["B"],
    explanation: "Exam-style tool design emphasizes narrow, well-described tools with explicit schemas, errors, and prerequisites.",
  },
  {
    domain: domains[1],
    select: 2,
    stem: "If this system exposes context through MCP, which two resources or tools are best aligned to the case?",
    options: [
      "A resource that provides approved policy or taxonomy data with version metadata.",
      "A tool that performs a controlled external action only after required identifiers are present.",
      "A resource that exposes recent related tickets without source labels so Claude can infer patterns quickly.",
      "A tool that accepts a free-form instruction and chooses the downstream API operation internally.",
      "A project-level MCP resource that is available but not explicitly passed to subagents.",
    ],
    answer: ["A", "B"],
    explanation: "MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.",
  },
  {
    domain: domains[2],
    select: 1,
    stem: "For implementation work related to this case, what should Claude Code do first?",
    options: [
      "Start by editing the file most likely to contain the behavior, then adjust the plan after tests fail.",
      "Read repository instructions, inspect existing patterns, and produce a plan before changing files.",
      "Ask Claude Code to generate a complete patch from the issue description before spending context on repository exploration.",
      "Run the broadest available test command first so the failure output determines where to inspect.",
    ],
    answer: ["B"],
    explanation: "Claude Code exam questions reward respecting local instructions, planning, and matching existing patterns before edits.",
  },
  {
    domain: domains[2],
    select: 2,
    stem: "Which two Claude Code workflow controls are most important here?",
    options: [
      "Use CLAUDE.md or AGENTS.md rules to encode repository constraints.",
      "Prefer a repository-wide cleanup pass before the requested change so hidden inconsistencies do not remain.",
      "Run focused verification commands and report what did or did not run.",
      "Keep project rules in the developer's user-level Claude memory so they apply across all repositories.",
      "Use only the generic Claude Code workflow so custom skills do not bias the implementation.",
    ],
    answer: ["A", "C"],
    explanation: "Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.",
  },
  {
    domain: domains[3],
    select: 1,
    stem: "Which prompt/output strategy best fits this case?",
    options: [
      "Ask Claude for a concise paragraph, then use regex extraction for fields that downstream systems need.",
      "Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.",
      "Use a detailed prose template with headings, then ask Claude to keep the same headings on every response.",
      "Use a schema for the final response but avoid retry feedback so the model does not overfit to validator wording.",
    ],
    answer: ["B"],
    explanation: "Structured output, examples, and validation loops are the reliable pattern for scenario-grade exam questions.",
  },
  {
    domain: domains[3],
    select: 2,
    stem: "Which two prompt details should be preserved in the case output?",
    options: [
      "Source or evidence references for important claims.",
      "Assumptions, uncertainty, or review flags when evidence is incomplete.",
      "A concise confidence score without requiring the source evidence behind it.",
      "A final natural-language rationale that explains why validation warnings can be accepted.",
      "A compact summary of reasoning steps instead of source-linked output fields.",
    ],
    answer: ["A", "B"],
    explanation: "The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.",
  },
  {
    domain: domains[4],
    select: 1,
    stem: "What is the strongest context-management improvement for this scenario?",
    options: [
      "Send the complete available history so Claude can decide which details matter.",
      "Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.",
      "Summarize the entire context at each turn and rely on the summary as the source of truth.",
      "Give each subagent access to the same large context bundle so no context is accidentally omitted.",
    ],
    answer: ["B"],
    explanation: "Good context management is selective, ordered, source-linked, and explicit about what each agent receives.",
  },
  {
    domain: domains[4],
    select: 2,
    stem: "Which two reliability behaviors should the final system demonstrate?",
    options: [
      "Escalate or ask for clarification when required evidence is missing.",
      "Disclose unresolved tool errors or low-confidence evidence in the appropriate internal handoff.",
      "Use cached prior results when the same user or repository appears in a later request.",
      "Preserve only the final synthesized answer so reviewers are not distracted by intermediate uncertainty.",
      "Prefer an answer with caveats over asking for clarification when the user expects speed.",
    ],
    answer: ["A", "B"],
    explanation: "Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.",
  },
];

const speedRoundTopics = {
  [domains[0]]: [
    [
      "What controls the Agent SDK loop after Claude returns tool_use?",
      "Execute the requested tool, append the tool result, and call Claude again.",
      "The loop is driven by stop_reason, not by parsing the assistant's prose. Valid stop_reason values: end_turn, max_tokens, stop_sequence, tool_use, pause_turn, refusal, model_context_window_exceeded.",
      `<span>The loop is driven by <code>stop_reason</code>, not by parsing the assistant's prose.</span><ol class="stop-reason-list"><li><code>end_turn</code></li><li><code>max_tokens</code></li><li><code>stop_sequence</code></li><li><code>tool_use</code></li><li><code>pause_turn</code></li><li><code>refusal</code></li><li><code>model_context_window_exceeded</code></li></ol>`,
    ],
    ["What stop_reason normally ends an agent loop?", "end_turn.", "When Claude is done using tools, the final answer is returned on end_turn."],
    ["What is a common way that we might test for loop completion incorrectly because it is brittle and inconsistent?", "Checking assistant text for words like complete or done.", "Text parsing is brittle; use explicit stop_reason values."],
    ["What is a coordinator responsible for in a multi-agent system?", "Decomposition, routing, aggregation, and error handling.", "Subagents do focused work; the coordinator owns the overall task state."],
    ["Do subagents automatically inherit parent context?", "No.", "Pass source material, constraints, and expected output explicitly."],
    ["How do you spawn parallel subagents?", "Emit multiple Task tool calls in one coordinator response.", "Parallel delegation is a coordination pattern, not separate user turns."],
    ["When should a workflow use a deterministic gate or hook?", "When a rule must be enforced reliably before an action.", "Refund thresholds, identity checks, and permission checks should not rely on prompt text alone."],
    ["What should the coordinator do when subagent coverage is incomplete?", "Send targeted follow-up tasks or escalate the gap.", "Iterative refinement is expected when evidence is missing."],
    ["What is context isolation good for?", "Reducing cross-task contamination and keeping specialists focused.", "Isolation helps, but only if the coordinator passes needed context."],
    ["What should happen to partial failures in a multi-agent system?", "They should be captured, surfaced, and handled by the coordinator.", "Hiding failures creates false confidence."],
    ["What is the safest way to handle an irreversible action?", "Require explicit prerequisites and a programmatic control before tool execution.", "The exam favors enforceable guardrails for high-impact actions."],
    ["What is a good subagent prompt include?", "Task, relevant context, sources, constraints, output schema, and success criteria.", "A subagent cannot reliably infer missing context."],
    ["What should a coordinator aggregate?", "Findings, confidence, sources, errors, and unresolved gaps.", "Aggregation is more than summarization."],
    ["When should a coordinator ask for clarification?", "When required inputs or decision criteria are missing.", "Clarification beats guessing."],
    ["What is over-decomposition?", "Splitting work so narrowly that important coverage is lost.", "Subtasks should map to meaningful responsibility boundaries."],
    ["What is under-decomposition?", "Giving one agent too much broad work without specialization.", "Complex scenarios often benefit from role-based subagents."],
    ["What makes a routing decision exam-worthy?", "It is explicit, evidence-based, and tied to agent/tool capability.", "Do not route based on vague labels."],
    ["What should happen after a tool error?", "Record the error, decide retry/escalation policy, and avoid claiming success.", "Tool errors are part of the state."],
    ["Why use a coordinator instead of peer agents only?", "To preserve task state, resolve conflicts, and produce a coherent final answer.", "Peer-only systems can lose authority and accountability."],
    ["What is the core architecture instinct for Domain 1?", "Make control flow explicit and keep authority boundaries clear.", "Agentic architecture questions usually test orchestration discipline."],
  ],
  [domains[1]]: [
    ["What makes a good tool description?", "It clearly states purpose, required inputs, side effects, and when not to use it.", "Claude chooses tools based heavily on descriptions."],
    ["What is a poor tool design?", "A broad do_everything tool with free-text arguments.", "Broad tools obscure intent, validation, and safety boundaries."],
    ["How should tool errors be returned?", "Structured status with a clear error message and recoverable details.", "The model needs machine-readable failure context."],
    ["What does tool_choice help control?", "Whether Claude may, must, or must not use tools.", "Use it to constrain tool behavior for the task."],
    ["When is a read-only MCP resource appropriate?", "When Claude needs stable context such as policy, schema, or documentation.", "Resources provide context; tools perform actions."],
    ["When is an MCP tool appropriate?", "When Claude needs to perform a controlled operation with typed inputs.", "Tools should have scoped authority."],
    ["What metadata should MCP resources preserve?", "Version, source, date, owner, and access context when relevant.", "Metadata supports provenance and freshness decisions."],
    ["Why avoid arbitrary code execution tools?", "They create broad security and reliability risk.", "Constrain tools to purposeful operations."],
    ["What should a tool schema validate?", "Required identifiers, allowed values, formats, and action prerequisites.", "Validation catches failures before unsafe execution."],
    ["What is the best response to missing required tool input?", "Ask for the missing input or use a lookup tool if available.", "Do not invent identifiers."],
    ["How should side effects be documented?", "Explicitly in the tool description and guarded by prerequisites.", "Claude must know when a tool changes external state."],
    ["What is the difference between a resource and a tool?", "A resource supplies context; a tool performs work.", "Mixing the two leads to unclear authority."],
    ["How should authentication failures be handled?", "Return structured permission error context and escalation guidance.", "Retry loops cannot fix missing permissions."],
    ["What should happen when a tool times out?", "Classify the failure, retry only if policy allows, and disclose uncertainty.", "Timeouts are evidence gaps."],
    ["What is a good tool naming pattern?", "Specific verb-noun names like lookup_order or create_refund_request.", "Names should reveal intent."],
    ["What is an isError-style signal for?", "Letting Claude distinguish failed tool results from successful data.", "Without an error signal, failures can be treated as facts."],
    ["What should tool outputs avoid?", "Unstructured blobs when the next step requires reliable parsing.", "Structured outputs support downstream decisions."],
    ["How do you reduce unsafe tool use?", "Limit allowed tools, use precise descriptions, validate inputs, and gate risky calls.", "Defense is layered."],
    ["What is an MCP integration trap?", "Assuming resources are automatically available to all agents.", "Context still has to be routed intentionally."],
    ["What is the core architecture instinct for Domain 2?", "Design narrow, typed, well-described tools with explicit errors and authority.", "Tool questions usually test contract quality."],
  ],
  [domains[2]]: [
    ["What should Claude Code read before editing?", "Repository instructions such as AGENTS.md, CLAUDE.md, and relevant local docs.", "Local rules are part of the task contract."],
    ["What is Plan Mode for?", "Thinking through scope and approach before making changes.", "Use it for risky or multi-step edits."],
    ["What should Claude Code do before broad refactors?", "Confirm scope and match existing patterns.", "Unrelated churn is a review risk."],
    ["What belongs in a slash command?", "Repeatable repo-specific workflows or checks.", "Commands make common workflows consistent."],
    ["What belongs in a skill?", "Reusable procedural knowledge with clear trigger conditions.", "Skills help standardize complex workflows."],
    ["How should Claude Code report tests?", "List exactly what ran, what passed, what failed, and what was not run.", "Do not imply verification that did not happen."],
    ["What is a destructive git operation?", "Commands like reset hard or checkout that discard work.", "These require explicit user approval."],
    ["How should generated files be handled?", "Respect repo rules; do not edit protected generated files unless instructed.", "Generated artifacts often have source owners."],
    ["What should a PR summary emphasize?", "Behavioral change, tests, risks, and reviewer notes.", "A file list is not enough."],
    ["What should happen when tests time out?", "Report the timeout and run narrower diagnostics if useful.", "Do not claim success."],
    ["Why inspect existing patterns first?", "To avoid inventing incompatible abstractions.", "Claude Code should work with the codebase."],
    ["When should Claude Code ask before changing lockfiles?", "When repo policy or risk indicates dependency changes need approval.", "Lockfiles can affect broad dependency state."],
    ["What is a focused verification command?", "The smallest meaningful test or lint command for the changed surface.", "Focused tests provide faster evidence."],
    ["What is a CI repair anti-pattern?", "Changing snapshots or dependencies without proving the root cause.", "Fix evidence, not symptoms."],
    ["How should Claude Code handle unresolved failures?", "Document them plainly with likely cause and next step.", "Transparency matters."],
    ["What should repository memory files contain?", "Durable project guidance, not ad hoc hidden assumptions.", "Memory should be explicit and maintainable."],
    ["What is a good Claude Code handoff?", "Context, files changed, commands run, residual risk, and suggested next action.", "Handoffs should let a human resume easily."],
    ["How should Claude Code handle conflicting instructions?", "Follow precedence and ask if the conflict blocks safe action.", "Instruction hierarchy matters."],
    ["What is the risk of oversized context in Claude Code?", "Important constraints can get lost or stale.", "Summaries and scoped reads help."],
    ["What is the core architecture instinct for Domain 3?", "Use repo-local rules, plan before risky edits, verify honestly, and keep diffs scoped.", "Claude Code questions test workflow discipline."],
  ],
  [domains[3]]: [
    ["When should you use structured output?", "When downstream code or review needs reliable fields.", "Schemas reduce ambiguity."],
    ["What should a retry include after schema validation fails?", "The validation errors and the original task context.", "Specific feedback beats vague retry instructions."],
    ["What is few-shot prompting best for?", "Teaching format and edge-case distinctions.", "Examples shape behavior more concretely than abstract rules."],
    ["What is a structured extraction risk?", "Valid-looking JSON with wrong or unsupported content.", "Validation must check semantics when possible."],
    ["What should be included for source-grounded answers?", "Citations, source labels, or evidence references.", "Grounding enables review."],
    ["What should the model do when evidence is incomplete?", "Flag uncertainty or request missing context.", "Do not fill gaps with invention."],
    ["What is an output schema field good for?", "Making required decisions explicit and machine-checkable.", "Schema design is part of prompt engineering."],
    ["Why separate assumptions from facts?", "So reviewers can see what is proven and what is inferred.", "This is common in exam scenarios."],
    ["What is a batch-processing risk?", "Systematic errors scale across many records.", "Use evals, sampling, and review queues."],
    ["How should prompts treat critical constraints?", "Put them clearly near the task and output requirements.", "Avoid burying them in long context."],
    ["What is a good review pass for extraction?", "Check missing fields, conflicts, confidence, and source references.", "Second passes catch omissions."],
    ["Why avoid parsing polished prose?", "It is less reliable than constrained structured output.", "Use JSON/schema when a machine consumes the result."],
    ["What should a confidence field mean?", "A defined signal tied to evidence quality.", "Uncalibrated confidence is weak."],
    ["How do you handle multiple-response questions in prompts?", "State exactly how many selections are expected.", "Ambiguity creates scoring errors."],
    ["What should a prompt do with policy exceptions?", "Ask the model to flag exception conditions explicitly.", "Exceptions often drive escalation."],
    ["What is a common prompt anti-pattern?", "One huge prompt with hidden goals and no output contract.", "Clarity and structure win."],
    ["When should human review be routed?", "Low confidence, high impact, policy conflict, or missing evidence.", "Review criteria should be explicit."],
    ["What makes guidance useful?", "It explains the principle, not just the answer.", "Guidance helps transfer to new scenarios."],
    ["What should be avoided in final answers?", "Hidden chain-of-thought requests and unsupported certainty.", "Use concise rationale instead."],
    ["What is the core architecture instinct for Domain 4?", "Constrain outputs, teach edge cases, validate, and preserve evidence.", "Prompt questions test reliability under ambiguity."],
  ],
  [domains[4]]: [
    ["What is lost-in-the-middle?", "Important context being underused when buried in long inputs.", "Position and compactness matter."],
    ["How should critical context be ordered?", "Place instructions, constraints, and current evidence where the model can use them.", "Do not bury decisive facts."],
    ["What should happen when context is too large?", "Summarize, retrieve selectively, or split work with explicit handoffs.", "More context is not always better."],
    ["Why preserve source metadata?", "It supports provenance, freshness checks, and review.", "Context without sources is harder to trust."],
    ["What is a good escalation trigger?", "Missing required evidence, low confidence, high-impact action, or policy conflict.", "Escalation should be rule-based."],
    ["What should be disclosed in internal handoffs?", "Tool errors, missing inputs, assumptions, confidence, and attempted actions.", "Handoffs need operational truth."],
    ["Why avoid stale tool results?", "Files, records, or policies may have changed.", "Refresh or summarize with timestamps."],
    ["What is confidence calibration?", "Tying confidence to evidence quality and uncertainty.", "Confidence should not be a vibes score."],
    ["What should happen with contradictory sources?", "Surface the conflict and resolve or escalate it.", "Do not average contradictions into a false answer."],
    ["What is a reliable final answer?", "Grounded, appropriately scoped, and honest about uncertainty.", "Reliability includes saying what is not known."],
    ["How should long documents be chunked?", "With section boundaries, page/source metadata, and task-relevant retrieval.", "Chunking should preserve meaning."],
    ["What is a context handoff?", "A structured package of relevant facts, sources, constraints, and next task.", "Handoffs prevent context loss."],
    ["When should the system ask a clarifying question?", "When the answer depends on missing user intent or required data.", "Guessing can create unsafe outcomes."],
    ["What does provenance mean?", "Where a claim or field came from.", "Provenance enables audit."],
    ["What is an evidence gap?", "A required fact that the system does not have.", "Gaps should be visible."],
    ["How should tool failures affect confidence?", "They should lower confidence or trigger retry/escalation.", "Failures are not neutral."],
    ["What is a reliability anti-pattern?", "Returning a confident answer after missing or failed evidence.", "This is a common exam trap."],
    ["What should be compacted in a long-running session?", "Stable conclusions and relevant state, not raw noise.", "Compaction should preserve decisions and evidence."],
    ["Why label user-provided claims?", "They are not the same as verified records.", "This matters in support, legal, and healthcare scenarios."],
    ["What is the core architecture instinct for Domain 5?", "Manage context deliberately and make uncertainty operationally visible.", "Reliability questions test evidence discipline."],
  ],
};

const scenarioTrapQuestionByType = {
  "Customer Support Resolution Agent": [
    {
      domain: domains[4],
      select: 1,
      stem: "A long support conversation contains account IDs, invoice IDs, refund amounts, and a policy exception from earlier turns. Claude is starting to miss those facts. What is the best fix?",
      options: [
        "Ask Claude to maintain a running natural-language summary of the whole transcript after each turn.",
        "Extract durable facts into a compact case block and re-anchor that block near the current task on each turn.",
        "Move the complete transcript into a long-context prompt so the earlier IDs remain available.",
        "Store the transcript in an MCP resource and let the support subagent retrieve whatever it needs.",
      ],
      answer: ["B"],
      explanation: "The exam trap is lossy summarization of IDs and amounts. Preserve durable facts in a structured case block placed where the model can use it.",
    },
  ],
  "Code Generation with Claude Code": [
    {
      domain: domains[2],
      select: 1,
      stem: "The team wants every clone of the repository to follow the same lint-before-commit rule. Where should that shared Claude Code instruction live?",
      options: [
        "In each developer's user-level Claude config so the rule follows their personal workflow.",
        "In a project-level CLAUDE.md or equivalent committed repository instruction file.",
        "Inside a slash command used by the release lead when preparing pull requests.",
        "In the CI failure prompt so Claude sees the rule only when a check fails.",
      ],
      answer: ["B"],
      explanation: "Team-shared rules belong in committed project instructions. User-level memory is private and will not travel with the repo.",
    },
  ],
  "Multi-Agent Research System": [
    {
      domain: domains[0],
      select: 1,
      stem: "One research subagent fails after other subagents have already stored findings and created review artifacts. What should the coordinator do first?",
      options: [
        "Rerun the full workflow so all subagent outputs are produced from the same fresh context.",
        "Retry or replace only the failed subtask and preserve successful side-effecting work.",
        "Ask the synthesis subagent to proceed using the successful outputs and mark the missing section as low confidence.",
        "Merge the failed subagent's partial notes into the final answer and let human reviewers catch any gaps.",
      ],
      answer: ["B"],
      explanation: "Blanket retries can duplicate side effects and waste work. The coordinator should isolate the failed subtask and make the gap visible.",
    },
  ],
  "Developer Productivity with Claude": [
    {
      domain: domains[4],
      select: 2,
      stem: "A developer assistant uses a 50,000-token stable system prompt, a fixed set of few-shot examples, and a unique user question each turn. Which two prompt-caching choices are best?",
      options: [
        "Cache the stable system prompt prefix.",
        "Cache the reusable few-shot examples when they remain identical.",
        "Cache the full prompt including the user question so repeated users get faster responses.",
        "Cache only the retrieved documents because they are usually the largest part of the prompt.",
        "Avoid caching few-shot examples because examples can bias later tasks.",
      ],
      answer: ["A", "B"],
      explanation: "Prompt caching pays off on repeated stable prefixes, not one-off user turns or stale evidence that must be refreshed.",
    },
  ],
  "Claude Code for CI/CD": [
    {
      domain: domains[3],
      select: 1,
      stem: "A CI review prompt says 'review this PR carefully' and the pipeline fails on vague model concern. What should the architect change?",
      options: [
        "Keep the prompt broad but require Claude to include a confidence score for each concern.",
        "Fail only on schema-named categories with mechanically checkable criteria, such as security violation or breaking API change.",
        "Let Claude produce a natural-language severity label and fail on high or critical findings.",
        "Send the entire repository context so Claude has enough background to judge concerns more accurately.",
      ],
      answer: ["B"],
      explanation: "The trap is vague adjectives driving false positives. CI gates need explicit categories and checkable criteria.",
    },
  ],
  "Structured Data Extraction": [
    {
      domain: domains[3],
      select: 2,
      stem: "An extraction pipeline returns schema-valid JSON, but review finds unsupported fields and missing source evidence. Which two changes best improve reliability?",
      options: [
        "Require source spans or page references for extracted fields.",
        "Run semantic validation and retry with the specific validation error.",
        "Add a prompt instruction telling Claude to be stricter about unsupported fields.",
        "Accept parsed JSON automatically and sample a small percentage later for quality review.",
        "Use a broader schema with optional fields so unusual documents do not fail validation.",
      ],
      answer: ["A", "B"],
      explanation: "Parsing is not enough. Extraction needs evidence-bearing fields plus validation feedback when content is unsupported or inconsistent.",
    },
  ],
};

const scenarioTrapQuestionByTitle = {
  "Competitive intelligence report": [
    {
      domain: domains[1],
      select: 1,
      stem: "The MCP server for competitor research can run on the same machine as the client during analyst workflows. Which transport is the better default?",
      options: [
        "stdio, because the server can run locally without HTTP authentication and network overhead.",
        "SSE, because it matches the same HTTP pattern the production web app will eventually use.",
        "SSE, because it makes logs and authentication centralized even for a single local analyst.",
        "stdio for reads and SSE for writes so the model can choose the safer transport per call.",
      ],
      answer: ["A"],
      explanation: "For same-machine MCP servers, stdio is the exam-favored default. SSE is for remote or shared-host servers that need HTTP access patterns.",
    },
  ],
  "Internal developer assistant rollout": [
    {
      domain: domains[1],
      select: 1,
      stem: "Three tools are described as 'gets user info': get_user, lookup_user, and find_customer. Claude picks randomly. What is the best fix?",
      options: [
        "Keep the tools separate but add a system prompt telling Claude to choose carefully.",
        "Rewrite descriptions with purpose, when-to-use guidance, example arguments, and possible error conditions.",
        "Rename the tools with longer names but keep the existing descriptions to avoid changing behavior.",
        "Route all three through one wrapper tool that decides which backend call to make from Claude's prose.",
      ],
      answer: ["B"],
      explanation: "Tool descriptions are selection controls. Ambiguous sibling tools need disambiguation rules, examples, and error contracts.",
    },
  ],
};

function extraQuestionsForCase(item) {
  return [
    ...(scenarioTrapQuestionByType[item.type] ?? []),
    ...(scenarioTrapQuestionByTitle[item.title] ?? []),
  ];
}

const practiceCases = cases.slice(0, 20).map((item) => ({
  ...item,
  questions: [...questionSet, ...extraQuestionsForCase(item)],
}));

const totalScenarioQuestions = practiceCases.reduce((total, item) => total + item.questions.length, 0);

function renderCases(renderCase) {
  let firstQuestion = 1;
  return practiceCases.map((item, index) => {
    const rendered = renderCase(item, index + 1, firstQuestion);
    firstQuestion += item.questions.length;
    return rendered;
  });
}

const speedTrapTopics = {
  [domains[0]]: [
    ["What is the blanket retry trap?", "Rerunning every subagent after one subagent fails.", "Retry only the failed or incomplete subtask when other subagents already produced valid work or side effects."],
    ["What should the coordinator do after one side-effecting subagent succeeds and another fails?", "Preserve successful work, retry the failed subtask if policy allows, and disclose the gap.", "A full rerun can duplicate external actions."],
    ["What is the inspect-execute-append-call loop?", "Inspect stop_reason, execute requested tool, append tool_result, call Claude again.", "Dropping append often makes Claude repeat the same tool call."],
    ["What is the stateless API trap?", "Assuming Claude remembers prior API calls without conversation history.", "The application owns state and loop control."],
    ["When is adaptive decomposition better than a fixed pipeline?", "When the next subtask depends on what earlier evidence reveals.", "Open-ended investigations often need dynamic routing."],
  ],
  [domains[1]]: [
    ["When should MCP use stdio transport?", "When the server can run on the same machine as the client.", "stdio avoids network/auth overhead for local integrations."],
    ["When should MCP use SSE or remote HTTP transport?", "When the MCP server must live on another host or serve multiple remote clients.", "Remote transport adds auth and network design concerns."],
    ["What is the SSE-on-localhost trap?", "Choosing remote/SSE transport for a server that can run locally with the client.", "The exam often rewards stdio for same-machine MCP servers."],
    ["What should a tool description include beyond purpose?", "When to use it over similar tools, example arguments, side effects, and error conditions.", "Tool descriptions are part of the model's selection interface."],
    ["What is the sibling-tool ambiguity trap?", "Multiple similar tools with descriptions like 'gets user info'.", "Disambiguate tools or Claude may choose randomly."],
  ],
  [domains[2]]: [
    ["Where should team-shared Claude Code rules live?", "In committed project-level instructions such as repo CLAUDE.md or AGENTS.md.", "User-level config is private and does not ship to teammates."],
    ["What belongs in user-level Claude Code memory?", "Personal preferences that should apply only to that user.", "Do not put team policy where the team cannot see it."],
    ["What is the project-vs-user CLAUDE.md trap?", "Putting shared repo behavior in a home-directory file.", "The grader expects shared rules in repo/project scope."],
    ["What should a read-only review slash command restrict?", "Allowed tools to read/search tools, excluding write/edit/bash when not needed.", "Slash command frontmatter can reduce accidental side effects."],
    ["What should CI review fail on?", "Explicit schema categories with defined severity and evidence.", "Vague model concern should not fail a pipeline by itself."],
  ],
  [domains[3]]: [
    ["What is the vague adjective trap?", "Prompts like 'review carefully' or 'be thorough' without checkable criteria.", "Replace adjectives with numbered, mechanically checkable rules."],
    ["How do you reduce CI false positives from Claude review?", "Use explicit violation categories and fail only on named categories that meet criteria.", "Teams ignore noisy gates."],
    ["What is the reliable alternative to 'return JSON' in prose?", "Define a schema-producing tool and force tool use when appropriate.", "Tool-use input schemas are more reliable than prose-only formatting requests."],
    ["What should a validation retry include?", "The exact validation error and a request to correct the prior output.", "Blind retries repeat mistakes."],
    ["What is the schema-valid-but-wrong trap?", "JSON parses but values are unsupported, stale, or semantically invalid.", "Add semantic checks, evidence fields, and review routing."],
  ],
  [domains[4]]: [
    ["What is the summarization trap for support conversations?", "Summarizing a long thread when exact IDs, amounts, or policy exceptions matter.", "Extract durable facts into a structured case block instead."],
    ["Where should durable case facts sit in a long context?", "Near the current task or end of the context where attention is strongest.", "Do not bury decisive facts in the middle."],
    ["What should be prompt-cached?", "Stable repeated prefixes such as system prompts and fixed few-shot examples.", "Caching helps when the prefix repeats exactly."],
    ["What should not be prompt-cached?", "Unique user turns or evidence that changes and needs freshness checks.", "One-off content creates poor cache hits and can preserve stale context."],
    ["What is the confidence trap?", "Letting the model sound certain after missing tools, stale sources, or incomplete evidence.", "Confidence should fall or trigger escalation when evidence is weak."],
  ],
};

const speedRounds = domains.map((domain) => ({
  domain,
  items: [
    ...speedRoundTopics[domain],
    ...(speedTrapTopics[domain] ?? []),
  ].map(([prompt, answer, guidance, guidanceHtml], index) => ({
    id: `${slug(domain)}-${index + 1}`,
    prompt,
    answer,
    guidance,
    guidanceHtml,
  })),
}));

const totalSpeedDrills = speedRounds.reduce((total, round) => total + round.items.length, 0);

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function answerText(answer) {
  return answer.join(", ");
}

function renderCaseMd(item, caseIndex, firstQuestion) {
  const lines = [];
  const questions = item.questions ?? questionSet;
  lines.push(`## Scenario ${caseIndex}: ${item.title}`);
  lines.push("");
  lines.push(`**Official scenario type:** ${item.type}`);
  lines.push("");
  lines.push(`**Case file:** ${item.org} is preparing a Claude architecture for the following situation.`);
  lines.push("");
  lines.push(item.situation);
  lines.push("");
  lines.push(item.architecture);
  lines.push("");
  lines.push(item.failure);
  lines.push("");
  lines.push("**Constraints and artifacts:**");
  for (const constraint of item.constraints) lines.push(`- ${constraint}`);
  lines.push("");
  lines.push(`### Questions ${firstQuestion}-${firstQuestion + questions.length - 1}`);
  lines.push("");
  questions.forEach((q, idx) => {
    const qn = firstQuestion + idx;
    lines.push(`${qn}. [${q.domain}] ${q.stem} (Select ${q.select}.)`);
    "ABCDE".slice(0, q.options.length).split("").forEach((letter, optionIndex) => {
      lines.push(`   ${letter}. ${q.options[optionIndex]}`);
    });
    lines.push(`   Answer: ${answerText(q.answer)}. ${q.explanation}`);
    lines.push("");
  });
  return lines.join("\n");
}

function renderQuestionHtml(q, qn, caseIndex, idx) {
  const id = `answer-${caseIndex}-${idx + 1}`;
  const optionLetters = "ABCDE".slice(0, q.options.length).split("");
  return `<section class="exam-question" id="q${qn}">
    <div class="exam-question-head">
      <span class="scenario-pill">${esc(q.domain)}</span>
      <button class="answer-toggle" type="button" data-target="${id}" aria-expanded="false">Show answer</button>
    </div>
    <h4><span class="question-number">${qn}</span>. ${esc(q.stem)} <span class="select-note">(Select ${q.select}.)</span></h4>
    <ul class="answer-options">
${optionLetters.map((letter, optionIndex) => `      <li><span>${letter}.</span> ${esc(q.options[optionIndex])}</li>`).join("\n")}
    </ul>
    <div class="answer-panel" id="${id}" hidden><strong>Correct answer:</strong> ${esc(answerText(q.answer))}. ${esc(q.explanation)}</div>
  </section>`;
}

function renderCaseHtml(item, caseIndex, firstQuestion) {
  const questions = item.questions ?? questionSet;
  return `<section class="case-file" id="scenario-${caseIndex}">
  <div class="case-file-head">
    <span class="scenario-pill">Scenario ${caseIndex}</span>
    <span class="case-type">${esc(item.type)}</span>
  </div>
  <h3>${esc(item.title)}</h3>
  <div class="case-brief">
    <p><strong>Case file:</strong> ${esc(item.org)} is preparing a Claude architecture for the following situation.</p>
    <p>${esc(item.situation)}</p>
    <p>${esc(item.architecture)}</p>
    <p>${esc(item.failure)}</p>
  </div>
  <div class="case-artifacts">
    <h4>Constraints and artifacts</h4>
    <ul>
${item.constraints.map((constraint) => `      <li>${esc(constraint)}</li>`).join("\n")}
    </ul>
  </div>
  <h4 class="question-set-title">Questions ${firstQuestion}-${firstQuestion + questions.length - 1}</h4>
${questions.map((q, idx) => renderQuestionHtml(q, firstQuestion + idx, caseIndex, idx)).join("\n")}
</section>`;
}

function renderSpeedRoundMd(round) {
  const lines = [];
  lines.push(`## Speed Round: ${round.domain}`);
  lines.push("");
  round.items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.prompt}`);
    lines.push(`   Answer: ${item.answer}`);
    lines.push(`   Guidance: ${item.guidance}`);
    lines.push("");
  });
  return lines.join("\n");
}

function renderSpeedRoundHtml(round) {
  return `<section class="speed-domain" id="speed-${slug(round.domain)}">
  <h3>${esc(round.domain)}</h3>
${round.items.map((item, index) => `<article class="speed-card">
    <div class="speed-card-head">
      <span class="scenario-pill">Speed ${index + 1}</span>
      <button class="answer-toggle" type="button" data-target="speed-${item.id}" aria-expanded="false">Show answer</button>
    </div>
    <h4>${esc(item.prompt)}</h4>
    <div class="answer-panel" id="speed-${item.id}" hidden>
      <p><strong>Answer:</strong> ${esc(item.answer)}</p>
      ${item.guidanceHtml
        ? `<div class="guidance-block"><strong>Guidance:</strong> ${item.guidanceHtml}</div>`
        : `<p><strong>Guidance:</strong> ${esc(item.guidance)}</p>`}
    </div>
  </article>`).join("\n")}
</section>`;
}

const md = `# Anthropic Architect Foundations Scenario Practice Exam

${totalScenarioQuestions} original scenario practice questions plus ${totalSpeedDrills} speed-round drills aligned to the official Anthropic Architect Foundations Exam Guide, version 1.0, effective July 2026, exam code \`CCAR-F\`.

This prep bank is structured like the exam: read a scenario case file, then answer the questions that belong to that case. The real exam has 60 questions across 4 scenarios drawn from the official scenario bank. This practice bank includes ${totalScenarioQuestions} scenario-based questions and ${totalSpeedDrills} speed-round questions.

## Official Scenario Bank Covered

- Customer Support Resolution Agent
- Code Generation with Claude Code
- Multi-Agent Research System
- Developer Productivity with Claude
- Claude Code for CI/CD
- Structured Data Extraction

## Practice Structure

- ${totalScenarioQuestions} total scenario questions
- ${totalSpeedDrills} total speed-round questions
- Mixed single-select and multiple-response questions
- Questions test all five official domains inside realistic case contexts

${renderCases(renderCaseMd).join("\n\n")}

# Speed Round

These are not exam scenarios. They are fast recall drills for teaching, warmups, and end-of-class review. Each official domain has core prompts plus added trap drills with an answer and guidance.

${speedRounds.map(renderSpeedRoundMd).join("\n\n")}

## Instructor Notes

- For a 60-question simulation, assign scenario-based question blocks that total 60 questions.
- For a 20-minute review block, assign one speed-round domain and have students answer aloud before revealing guidance.
- For every miss, identify the scenario evidence, official domain, primitive tested, and reliability principle missed.
- This practice exam is original training material, not copied exam content.
`;

const css = `      :root { color-scheme: light; }
      body { background: #f7f5ef; color: #161618; }
      .architect-header { background: #101018; color: #fff; }
      .architect-header .site-nav a { color: inherit; }
      .architect-header .site-nav .brand span { color: #2563eb; }
      .architect-hero { max-width: 1120px; margin: 0 auto; padding: 116px 24px 58px; display: grid; gap: 18px; }
      .architect-hero h1 { max-width: 880px; margin: 0; font-size: clamp(2.2rem, 5vw, 4.8rem); line-height: .95; letter-spacing: 0; }
      .architect-hero p { max-width: 760px; margin: 0; color: rgba(255,255,255,.78); font-size: 1.08rem; }
      .architect-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 8px; }
      .architect-button { display: inline-flex; align-items: center; justify-content: center; min-height: 42px; padding: 0 16px; border-radius: 8px; background: #f5d36b; color: #111; text-decoration: none; font-weight: 800; }
      .architect-shell { max-width: 1120px; margin: 0 auto; padding: 66px 24px 80px; }
      .architect-content { background: #fff; border: 1px solid #e5dfd2; border-radius: 8px; padding: clamp(22px, 4vw, 42px); box-shadow: 0 20px 60px rgba(16,16,24,.08); }
      .architect-content h2 { margin-top: 0; font-size: clamp(1.6rem, 3vw, 2.2rem); letter-spacing: 0; }
      .architect-content > p { max-width: 850px; }
      .architect-content p, .architect-content li { line-height: 1.68; }
      .architect-content code { background: #f2eee4; border: 1px solid #e4dccb; border-radius: 6px; padding: 0 5px; font-size: .92em; }
      .mode-toggle { position: sticky; top: 96px; z-index: 7; display: inline-flex; gap: 4px; margin: 24px 0 12px; padding: 5px; border: 1px solid #d9ceb9; border-radius: 8px; background: rgba(255,255,255,.94); box-shadow: 0 10px 28px rgba(16,16,24,.08); }
      .mode-toggle button { appearance: none; border: 0; border-radius: 6px; min-height: 38px; padding: 0 14px; background: transparent; color: #3b372f; font-weight: 900; cursor: pointer; }
      .mode-toggle button[aria-pressed="true"] { background: #161618; color: #fff; }
      .exam-mode[hidden] { display: none; }
      .case-file { border: 1px solid #d9ceb9; border-radius: 8px; margin: 34px 0 46px; background: #fffaf0; overflow: hidden; }
      .case-file-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 20px; background: #17171f; color: #fff; }
      .case-file h3 { margin: 0; padding: 22px 20px 0; font-size: clamp(1.45rem, 2.8vw, 2.15rem); letter-spacing: 0; }
      .case-brief { display: grid; gap: 12px; padding: 16px 20px 8px; }
      .case-brief p { margin: 0; }
      .case-artifacts { margin: 14px 20px 20px; padding: 16px; border: 1px solid #e5d8bf; border-radius: 8px; background: #fff; }
      .case-artifacts h4, .question-set-title { margin: 0 0 10px; font-size: 1.05rem; letter-spacing: 0; }
      .case-artifacts ul { margin: 0; padding-left: 20px; }
      .question-set-title { padding: 0 20px; }
      .exam-question { border-top: 1px solid #eadfc9; padding: 18px 20px; background: #fffdf8; }
      .exam-question-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
      .scenario-pill { display: inline-flex; align-items: center; min-height: 26px; border-radius: 999px; background: #eee7d8; color: #3b372f; padding: 0 10px; font-size: .82rem; font-weight: 800; }
      .case-file-head .scenario-pill { background: #f5d36b; color: #141414; }
      .case-type { font-weight: 800; font-size: .92rem; color: rgba(255,255,255,.78); text-align: right; }
      .exam-question h4 { margin: 0 0 12px; font-size: 1.05rem; line-height: 1.45; }
      .question-number { color: #7a4f00; font-weight: 900; }
      .select-note { color: #5d5b55; font-weight: 700; }
      .answer-options { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
      .answer-options li { border: 1px solid #eee4d2; border-radius: 8px; padding: 10px 12px; background: #fff; }
      .answer-options span { font-weight: 900; color: #6d4a00; margin-right: 6px; }
      .answer-toggle { appearance: none; border: 1px solid #2d2b25; background: #161618; color: #fff; border-radius: 8px; min-height: 34px; padding: 0 12px; font-weight: 800; cursor: pointer; white-space: nowrap; }
      .answer-toggle:hover { background: #2a2a31; }
      .answer-panel { margin-top: 12px; border-left: 4px solid #e0b33c; background: #fff7df; padding: 12px 14px; border-radius: 6px; line-height: 1.6; }
      .answer-panel p { margin: 0; }
      .answer-panel p + p { margin-top: 8px; }
      .stop-reason-list { color: #b42318; margin: 8px 0 0 22px; padding: 0; font-weight: 800; }
      .stop-reason-list code { color: #b42318; border-color: #f3b3ac; background: #fff4f2; }
      .speed-intro { max-width: 850px; margin: 0 0 20px; }
      .speed-domain { border-top: 1px solid #eadfc9; padding-top: 26px; margin-top: 28px; }
      .speed-domain h3 { margin: 0 0 14px; font-size: clamp(1.35rem, 2.5vw, 1.9rem); letter-spacing: 0; }
      .speed-card { border: 1px solid #e6dece; border-radius: 8px; padding: 16px; margin: 12px 0; background: #fffdf8; }
      .speed-card-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 10px; }
      .speed-card h4 { margin: 0; font-size: 1.03rem; line-height: 1.45; letter-spacing: 0; }
      .architect-footer { max-width: 1120px; margin: 0 auto; padding: 0 24px 52px; color: #5d5b55; }
      .architect-footer a { color: #181817; font-weight: 700; }
      @media (max-width: 980px) {
        .architect-hero { padding-top: 160px; }
        .mode-toggle { top: 144px; }
      }
      @media (max-width: 640px) {
        .architect-hero { padding-top: 204px; }
        .architect-content { padding: 20px; }
        .mode-toggle { top: 188px; width: 100%; }
        .mode-toggle button { flex: 1; }
        .case-file-head, .exam-question-head, .speed-card-head { align-items: flex-start; flex-direction: column; }
        .case-type { text-align: left; }
      }`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Scenario-based Anthropic Architect Foundations practice exam with 200 questions, plus speed-round domain drills." />
    <title>Anthropic Architect Foundations Practice Exam | Mojo AI Studio</title>
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="canonical" href="https://mojoaistudio.com/architect/exam/" />
    <meta name="theme-color" content="#0f0f1a" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Mojo AI Studio" />
    <meta property="og:url" content="https://mojoaistudio.com/architect/exam/" />
    <meta property="og:title" content="Anthropic Architect Foundations Practice Exam | Mojo AI Studio" />
    <meta property="og:description" content="Scenario-based Anthropic Architect Foundations practice exam with 200 questions, plus speed-round domain drills." />
    <meta property="og:image" content="https://mojoaistudio.com/assets/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="stylesheet" href="/styles/shared.css?v=__CACHE_BUST__" />
    <style>
${css}
    </style>
  </head>
  <body>
    <header class="architect-header" id="top">
      <nav class="site-nav" aria-label="Primary navigation">
        <a class="brand" href="/" aria-label="Mojo AI Studio home">
          <img class="brand-logo" src="/assets/logo.png" alt="" width="54" height="36" />
          <span>Mojo AI Studio</span>
        </a>
        <div class="nav-links">
          <a href="/buy/">Buy</a>
          <a href="/sell">Sell</a>
          <a href="/sell/fractional-caio-ciso/">Fractional CAIO/CISO</a>
          <a href="/request/">Request</a>
          <a href="/learn/">Learn</a>
          <a href="/architect/learn/">Architect Training</a>
          <a href="/forum/">Forum</a>
        </div>
      </nav>
      <section class="architect-hero">
        <p class="kicker">Practice exam</p>
        <h1>Anthropic Architect Foundations Practice Exam</h1>
        <p>${totalScenarioQuestions} scenario-based questions plus ${totalSpeedDrills} speed-round questions for Anthropic Architect Foundations exam prep.</p>
        <div class="architect-actions"><a class="architect-button" href="/architect/learn/">Study syllabus</a></div>
      </section>
    </header>
    <main class="architect-shell">
      <article class="architect-content">
        <h2>Anthropic Architect Foundations Exam Prep</h2>
        <p>Use Scenarios for exam-like case files with attached multiple-choice questions. Use Speed Round for fast domain recall with answer and guidance.</p>
        <div class="mode-toggle" role="group" aria-label="Practice mode">
          <button type="button" data-mode-target="scenario-mode" aria-pressed="true">Scenarios</button>
          <button type="button" data-mode-target="speed-mode" aria-pressed="false">Speed Round</button>
        </div>
        <section class="exam-mode" id="scenario-mode">
          <h3>Scenario-Based Practice Bank</h3>
          <p>This prep bank is structured like the exam: read a scenario case file, then answer the questions that belong to that case. The real exam has 60 questions across 4 scenarios drawn from the official scenario bank. This practice bank includes ${totalScenarioQuestions} scenario-based questions and ${totalSpeedDrills} speed-round questions.</p>
          <p>Each question states how many answers to select. Use the answer buttons only after committing to a choice.</p>
${renderCases(renderCaseHtml).join("\n")}
        </section>
        <section class="exam-mode" id="speed-mode" hidden>
          <h3>Speed Round</h3>
          <p class="speed-intro">These are fast drills, not exam scenarios. Each official domain has core prompts plus added trap drills with an answer and guidance so you can run warmups, review blocks, or quick oral checks.</p>
${speedRounds.map(renderSpeedRoundHtml).join("\n")}
        </section>
        <h3>Instructor Notes</h3>
        <ul>
          <li>For a 60-question simulation, assign scenario-based question blocks that total 60 questions.</li>
          <li>For a 20-minute review block, assign one speed-round domain and have students answer aloud before revealing guidance.</li>
          <li>For every miss, identify the scenario evidence, official domain, primitive tested, and reliability principle missed.</li>
          <li>This practice exam is original training material, not copied exam content.</li>
        </ul>
      </article>
    </main>
    <footer class="architect-footer">
      <p><a href="/">Mojo AI Studio</a> - Anthropic Architect Foundations preparation material.</p>
    </footer>
    <script>
      document.addEventListener('click', (event) => {
        const modeButton = event.target.closest('[data-mode-target]');
        if (modeButton) {
          const targetId = modeButton.dataset.modeTarget;
          document.querySelectorAll('[data-mode-target]').forEach((button) => {
            button.setAttribute('aria-pressed', String(button === modeButton));
          });
          document.querySelectorAll('.exam-mode').forEach((section) => {
            if (section.id === targetId) {
              section.removeAttribute('hidden');
            } else {
              section.setAttribute('hidden', '');
            }
          });
          return;
        }
        const button = event.target.closest('.answer-toggle');
        if (!button) return;
        const panel = document.getElementById(button.dataset.target);
        if (!panel) return;
        const isHidden = panel.hasAttribute('hidden');
        if (isHidden) {
          panel.removeAttribute('hidden');
          button.setAttribute('aria-expanded', 'true');
          button.textContent = 'Hide answer';
        } else {
          panel.setAttribute('hidden', '');
          button.setAttribute('aria-expanded', 'false');
          button.textContent = 'Show answer';
        }
      });
    </script>
  </body>
</html>
`;

fs.writeFileSync("Claude_Architect_Practice_Exam.md", md, "utf8");
fs.writeFileSync("architect/exam/index.html", html, "utf8");
