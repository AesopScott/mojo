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
      "Let the model decide all state transitions from free-form text.",
      "Use a coordinator loop that advances on tool_use, appends tool results, terminates on end_turn, and delegates only explicitly scoped work.",
      "Skip tool results and rely on a final natural-language answer.",
      "Create separate agents that assume shared hidden memory.",
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
      "A larger context window as the only control.",
      "Clear escalation criteria with structured handoff fields.",
      "Hiding tool failures from the final response so users stay confident.",
      "Allowing subagents to call any tool by default.",
    ],
    answer: ["A", "C"],
    explanation: "Risky actions need enforceable gates and explicit escalation paths. Prompt-only controls and hidden failures are weak patterns.",
  },
  {
    domain: domains[1],
    select: 1,
    stem: "Which tool design is most appropriate for the system described in the case?",
    options: [
      "One broad tool named do_everything with a free-text argument.",
      "Narrow tools with typed inputs, precise descriptions, error states, and documented prerequisites.",
      "Tools that return prose only, with no machine-readable status.",
      "Tools that silently retry until they produce a success response.",
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
      "A resource that contains every past conversation without access control.",
      "A tool that accepts arbitrary JavaScript from the model.",
      "A hidden resource that subagents are expected to discover without being told.",
    ],
    answer: ["A", "B"],
    explanation: "MCP should expose controlled resources and tools with clear contracts, not uncontrolled data or arbitrary execution.",
  },
  {
    domain: domains[2],
    select: 1,
    stem: "For implementation work related to this case, what should Claude Code do first?",
    options: [
      "Immediately edit the largest file that looks relevant.",
      "Read repository instructions, inspect existing patterns, and produce a plan before changing files.",
      "Skip local tests and rely on the model's confidence.",
      "Rewrite the architecture into a new framework.",
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
      "Prefer broad unrelated refactors so the final diff looks comprehensive.",
      "Run focused verification commands and report what did or did not run.",
      "Use destructive git commands to reset uncertainty.",
      "Ignore custom skills because they add too much context.",
    ],
    answer: ["A", "C"],
    explanation: "Repo-local rules and focused verification are central. Unrelated churn and destructive operations are anti-patterns.",
  },
  {
    domain: domains[3],
    select: 1,
    stem: "Which prompt/output strategy best fits this case?",
    options: [
      "Ask for a polished paragraph and parse it later.",
      "Use a structured output schema with required fields, examples for edge cases, and validation feedback on retry.",
      "Avoid examples because they make the model less reliable.",
      "Put critical constraints only at the very end of a long prompt.",
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
      "A guarantee that the model is correct.",
      "A request to ignore validation errors on retry.",
      "Internal chain-of-thought as the final answer.",
    ],
    answer: ["A", "B"],
    explanation: "The exam rewards source-grounded outputs and explicit uncertainty, not unsupported guarantees or hidden reasoning dumps.",
  },
  {
    domain: domains[4],
    select: 1,
    stem: "What is the strongest context-management improvement for this scenario?",
    options: [
      "Send all available information in arbitrary order.",
      "Keep critical constraints, current evidence, and decision criteria compact, explicit, and near the task they control.",
      "Remove source metadata to save tokens.",
      "Let subagents infer missing context from the coordinator's private transcript.",
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
      "Convert every uncertain case into a confident final answer.",
      "Drop provenance after synthesis to reduce clutter.",
      "Assume older retrieved context is still current.",
    ],
    answer: ["A", "B"],
    explanation: "Reliable systems surface missing evidence, tool failures, and uncertainty through the right channel.",
  },
];

const practiceCases = cases.slice(0, 20);

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
  lines.push(`### Questions ${firstQuestion}-${firstQuestion + questionSet.length - 1}`);
  lines.push("");
  questionSet.forEach((q, idx) => {
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
  <h4 class="question-set-title">Questions ${firstQuestion}-${firstQuestion + questionSet.length - 1}</h4>
${questionSet.map((q, idx) => renderQuestionHtml(q, firstQuestion + idx, caseIndex, idx)).join("\n")}
</section>`;
}

const md = `# Claude Architect Scenario Practice Exam

200 original practice questions aligned to the official Claude Certified Architect - Foundations Exam Guide, version 1.0, effective July 2026, exam code \`CCAR-F\`.

This prep bank is structured like the exam: read a scenario case file, then answer the questions that belong to that case. The real exam has 60 questions across 4 scenarios drawn from the official scenario bank. This practice bank gives you 20 scenario sets with 10 questions each so you can drill the pattern repeatedly.

## Official Scenario Bank Covered

- Customer Support Resolution Agent
- Code Generation with Claude Code
- Multi-Agent Research System
- Developer Productivity with Claude
- Claude Code for CI/CD
- Structured Data Extraction

## Practice Structure

- 20 scenario case files
- 10 questions immediately following each case
- 200 total questions
- Mixed single-select and multiple-response questions
- Questions test all five official domains inside realistic case contexts

${practiceCases.map((item, index) => renderCaseMd(item, index + 1, index * questionSet.length + 1)).join("\n\n")}

## Instructor Notes

- For a 60-question simulation, assign any 6 scenario sets.
- For every miss, identify the scenario evidence, official domain, primitive tested, and reliability principle missed.
- This practice exam is original training material, not copied exam content.
`;

const css = `      :root { color-scheme: light; }
      body { background: #f7f5ef; color: #161618; }
      .architect-header { background: #101018; color: #fff; }
      .architect-header .site-nav a { color: inherit; }
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
      .architect-footer { max-width: 1120px; margin: 0 auto; padding: 0 24px 52px; color: #5d5b55; }
      .architect-footer a { color: #181817; font-weight: 700; }
      @media (max-width: 980px) {
        .architect-hero { padding-top: 160px; }
      }
      @media (max-width: 640px) {
        .architect-hero { padding-top: 204px; }
        .architect-content { padding: 20px; }
        .case-file-head, .exam-question-head { align-items: flex-start; flex-direction: column; }
        .case-type { text-align: left; }
      }`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Scenario-based Claude Certified Architect practice exam with 200 questions and answer reveals." />
    <title>Claude Architect Practice Exam | Mojo AI Studio</title>
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
    <meta property="og:title" content="Claude Architect Practice Exam | Mojo AI Studio" />
    <meta property="og:description" content="Scenario-based Claude Certified Architect practice exam with 200 questions and answer reveals." />
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
        <h1>Claude Architect Practice Exam</h1>
        <p>Twenty full scenario case files with two hundred attached questions aligned to the official CCAR-F exam guide.</p>
        <div class="architect-actions"><a class="architect-button" href="/architect/learn/">Study syllabus</a></div>
      </section>
    </header>
    <main class="architect-shell">
      <article class="architect-content">
        <h2>Scenario-Based Practice Bank</h2>
        <p>This prep bank is structured like the exam: read a scenario case file, then answer the questions that belong to that case. The real exam has 60 questions across 4 scenarios drawn from the official scenario bank. This practice bank gives you 20 scenario sets with 10 questions each so you can drill the pattern repeatedly.</p>
        <p>Each question states how many answers to select. Use the answer buttons only after committing to a choice.</p>
${practiceCases.map((item, index) => renderCaseHtml(item, index + 1, index * questionSet.length + 1)).join("\n")}
        <h3>Instructor Notes</h3>
        <ul>
          <li>For a 60-question simulation, assign any 6 scenario sets.</li>
          <li>For every miss, identify the scenario evidence, official domain, primitive tested, and reliability principle missed.</li>
          <li>This practice exam is original training material, not copied exam content.</li>
        </ul>
      </article>
    </main>
    <footer class="architect-footer">
      <p><a href="/">Mojo AI Studio</a> - Claude Architect preparation material.</p>
    </footer>
    <script>
      document.addEventListener('click', (event) => {
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
