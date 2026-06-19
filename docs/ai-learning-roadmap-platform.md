# AI Learning Roadmap Platform Spec

Status: planning draft v0
Last updated: 2026-06-08
Owner: Mojo AI Studio / Aesop AI Academy
Proposed first deployment path: https://aesopacademy.org/theladder

## Purpose

Build a robust AI learning application, not a single web page. The system should help learners choose a structured path through AI, learn through guided AI conversations and labs, track their progress, discover the best learning material, connect topics to real AI products, and produce a transcript of what they have completed.

This is not a traditional course catalog. Mojo and Aesop do not need to teach every subject through prerecorded lessons. The platform should define the map, guide the learner through guarded AI conversations, provide labs, track progress, reference the best places to learn, and identify gaps where Aesop AI Academy should create new guided conversations, labs, or supporting resources.

Important sequencing: do not replace or modify existing Aesop Academy pages as part of the first build. Build and prove this ladder platform first. After the platform works, decide how and when it should replace, absorb, or sit beside the existing Aesop course experience.

Initial deployment target: build this as a new experience at `/theladder` on AesopAcademy.org. This should launch as a separate ladder product surface before any migration of existing Aesop Academy course pages.

## Product Concept

The application has seven connected layers:

1. Master AI competency map
2. Guided AI conversation engine for every topic
3. Guardrailed AI labs for practice and applied work
4. Learner-selected roadmap and progress tracking
5. Resource atlas for legacy courses, YouTube, docs, articles, books, podcasts, and prompts to ask AI
6. AI product atlas mapped to the same topics
7. Coverage and gap dashboard for Aesop AI Academy

The learner experience should be one ladder and one interface. The learner should be able to select goals, industries, roles, products, skill depth, and language. The system then generates a personal path through the same canonical ladder.

The primary learning experience should not be a page of course content. Each topic should become a guided conversation with AI that forces discovery, critical thinking, and application. Labs provide the hands-on environment for practicing the same ideas with AI and guardrails. The platform provides the map, the researched resources, the conversation design, the lab design, and the transcript.

## Core Principles

- Every topic is a trackable checklist item.
- The learner experience is one ladder, not many disconnected courses.
- The learner interface should be consistent across every topic, tier, lab, and language.
- Every topic has a guided AI conversation, not a static lesson.
- Every topic can have one or more labs for applied practice.
- Aesop AI Academy may eventually evolve away from a course-first model toward guided conversations plus labs, but only after this platform is built and validated.
- Every tier begins with vocabulary.
- Every 16 to 20 levels should form a new tier.
- Topics should be specific enough that a learner can mark them complete with confidence.
- Completion should support self-reported and verified evidence.
- Courses, products, videos, docs, and AI prompts attach to topics, not just broad tiers.
- Topic conversations should retrieve previously researched resources and trigger fresh research when current coverage is weak.
- Conversation design should force discovery, critical thinking, practice, and application before completion.
- The product atlas is a living database, not a static list.
- The coverage map should show where Aesop AI Academy already has guided conversations, labs, and supporting resources.
- Official sources should be labeled separately from community sources.
- Every external resource should have a last verified date.

## Ladder and Single Interface Model

The platform should feel like climbing a ladder. Courses, videos, products, docs, prompts, labs, and assessments are all attached to the rungs, but the learner does not navigate a pile of separate course pages.

Canonical ladder structure:

- Ladder
- Tier
- Topic/rung
- Guided conversation
- Lab
- Resource links
- Assessment
- Transcript event

The same learner interface should support every rung:

- Topic overview
- Start or continue guided conversation
- Vocabulary check
- Research resources
- AI-guided questions
- Lab or practice task
- Readiness check
- Completion controls
- Transcript evidence

The interface changes content, language, difficulty, examples, resources, and guardrails based on learner context. It should not change into a separate product for each learning path.

## On-Demand Language Translation

The canonical source of truth should be stored once, preferably in English at first, with stable IDs for tiers, topics, conversations, labs, rubrics, resources, and transcript events. The platform should translate the learner experience on demand.

Translation principles:

- Store canonical content once.
- Translate display text on demand into the learner's selected language.
- Preserve stable topic IDs and transcript records across all languages.
- Let learners switch languages without losing progress.
- Translate AI conversation instructions, learner-facing prompts, rubrics, lab instructions, and UI labels.
- Keep source URLs in their original language, but label resource language clearly.
- Prefer same-language resources when available.
- Allow multilingual resource discovery, especially for YouTube.
- Record transcript entries against canonical topic IDs, not translated strings.
- Cache reviewed translations for high-traffic content.
- Allow human review of important translations.

Translation record fields:

- id
- entity_type
- entity_id
- source_language
- target_language
- source_version
- translated_title
- translated_body
- translation_method: AI_on_demand, AI_cached, human_reviewed
- reviewed_by
- reviewed_at
- created_at
- updated_at

Learner language preferences:

- preferred_interface_language
- preferred_resource_language
- allow_subtitled_videos
- allow_original_language_resources
- translation_formality
- regional_variant

## Guided Conversation Model

Every roadmap topic should have a structured AI-guided conversation. This is the main learning unit.

The guided conversation should:

- Start by checking the learner's current understanding
- Introduce vocabulary through questions, not lecture-only content
- Ask the learner to explain the topic in their own words
- Surface common misconceptions
- Use examples tied to the learner's role, goals, and industry
- Link to previously researched videos, courses, docs, and product examples
- Search for newer YouTube resources when the database has stale or weak coverage
- Ask the learner to compare sources or products
- Ask the learner to apply the topic to a realistic scenario
- Ask the learner to critique an AI answer, workflow, policy, or design
- End with a readiness check and transcript event

Conversation phases:

1. Orientation: what do you already know?
2. Vocabulary: which terms can you explain?
3. Discovery: what should you investigate and why?
4. Guided research: use these videos/docs/courses, then report back.
5. Critical thinking: compare, challenge, and verify what you found.
6. Application: use the idea in a realistic task.
7. Reflection: explain what changed in your understanding.
8. Assessment: prove readiness to move on.
9. Transcript: record what was completed and what evidence exists.

Conversation modes:

- Beginner explanation
- Socratic tutor
- Role-specific coach
- Product walkthrough guide
- Video study companion
- Research assistant
- Project mentor
- Assessment interviewer
- Governance/risk reviewer
- Debugging partner

The AI should avoid simply giving the learner a completed answer when the goal is learning. It should ask the learner to reason, choose, compare, revise, and apply.

Guided conversation record fields:

- id
- topic_id
- title
- conversation_goal
- learner_level
- role_context
- system_instructions
- phase_outline
- required_vocabulary_ids
- required_resource_types
- required_application_task
- assessment_rubric
- completion_threshold
- transcript_event_type
- version
- status
- created_at
- updated_at

Conversation session fields:

- id
- user_id
- topic_id
- guided_conversation_id
- status
- current_phase
- learner_goal
- learner_role
- learner_industry
- selected_resources
- discovered_resource_ids
- notes
- assessment_result
- completion_signal
- started_at
- completed_at
- updated_at

## Guardrailed Lab Model

Labs are the applied side of the guided conversation model. A lab gives the learner a realistic task, an AI assistant, boundaries, tools, evidence requirements, and a completion rubric.

The teaching method is the same: AI guides, questions, challenges, and reviews the learner. The difference is that labs require the learner to make or evaluate something.

Lab examples:

- Prompt a chatbot to produce a useful work output, then revise it.
- Compare three AI tools for a specific business use case.
- Build a no-code automation with human review.
- Design a RAG knowledge base plan.
- Create an eval rubric for an AI assistant.
- Identify prompt injection risks in a workflow.
- Draft an AI workplace policy.
- Create a vendor evaluation scorecard.
- Use an AI coding assistant to modify a small app.
- Produce a transcript-ready project artifact.

Lab guardrails:

- Clear task boundaries
- Allowed AI tools
- Disallowed shortcuts
- Privacy and sensitive data warnings
- Source and citation requirements
- Required reflection
- Required evidence
- Rubric-based completion
- Optional human review
- Safety escalation for risky topics

Lab record fields:

- id
- topic_id
- title
- lab_goal
- scenario
- learner_level
- required_tools
- allowed_tools
- prohibited_actions
- privacy_notes
- safety_notes
- instructions
- AI_coach_instructions
- evidence_requirements
- assessment_rubric
- completion_threshold
- estimated_time
- version
- status
- created_at
- updated_at

Lab session fields:

- id
- user_id
- topic_id
- lab_id
- status
- submitted_artifact_ids
- AI_feedback
- assessment_result
- evidence_summary
- completion_signal
- started_at
- completed_at
- updated_at

## Learner Completion Model

Each topic can have multiple completion signals:

- Not started
- Introduced
- Learning
- Practiced
- Confident
- Assessed
- Applied in a project
- Verified by course
- Verified by quiz
- Verified by human review
- Skipped

Vocabulary terms can use a lighter scale:

- Never heard it
- Recognize it
- Can explain it
- Can use it correctly

Resources can use:

- Saved
- Opened
- Watched/read
- Took notes
- Completed
- Recommended
- Not useful

## Learner Transcript

The platform should generate a transcript for each user.

Transcript sections:

- Completed roadmap topics
- Completed vocabulary groups
- Tier self-assessments
- Aesop AI Academy courses completed
- Anthropic Academy courses completed or referenced
- Other external courses completed
- YouTube videos completed
- Official docs completed
- Guided topic conversations completed
- AI prompts practiced
- Products explored
- Projects completed
- Assessment results
- Completion dates
- Confidence levels
- Evidence notes
- Certificates or badges

Transcript export formats:

- Private dashboard
- Public share page
- PDF
- CSV
- JSON
- Employer/team summary
- Detailed learning record

Important distinction: transcripts should separate self-reported completion from verified completion.

## Tier Summary

The initial master map uses 15 tiers. Each tier has 16 to 20 trackable topics, plus a vocabulary group and a self-assessment.

1. Beginner: AI Orientation
2. Novice: Prompting and Chatbot Fluency
3. Capable Learner: Research, Study, and Information Literacy
4. Knowledge Worker: Productivity and Professional Workflows
5. Creative User: Multimodal, Media, and Content Creation
6. Business Practitioner: Function-Specific AI Use
7. Workflow Designer: No-Code, Automation, and Team Systems
8. Applied Builder: APIs, Structured Outputs, and AI App Basics
9. Knowledge Systems Builder: Data, Embeddings, Search, and RAG
10. Agent Builder: Agents, Tools, MCP, and Orchestration
11. AI Engineer: Evaluation, Reliability, Deployment, and Operations
12. AI Security Practitioner: Security, Privacy, Abuse, and Red Teaming
13. AI Governance Practitioner: Law, Ethics, Policy, and Compliance
14. AI Specialist: Model Science, ML, and Advanced AI Domains
15. AI Strategist: Product, Market, Adoption, and Frontier Planning

## Master Topic Map

### Tier 1: Beginner - AI Orientation

Vocabulary: artificial intelligence, machine learning, generative AI, model, chatbot, assistant, prompt, response, token, context, training data, inference, hallucination, multimodal, privacy.

1. T01-L01: What artificial intelligence is and is not
2. T01-L02: Traditional software vs AI systems
3. T01-L03: Generative AI vs predictive AI
4. T01-L04: Machine learning at a plain-language level
5. T01-L05: Large language models at a plain-language level
6. T01-L06: Chatbots, assistants, copilots, and agents
7. T01-L07: Prompts, responses, and conversation turns
8. T01-L08: Tokens and context windows
9. T01-L09: Training data vs live information
10. T01-L10: Hallucinations and why AI can be wrong
11. T01-L11: AI strengths and weaknesses
12. T01-L12: Common AI tool categories
13. T01-L13: Multimodal AI basics
14. T01-L14: Everyday AI use cases
15. T01-L15: Basic privacy and sensitive data precautions
16. T01-L16: Copyright and ownership awareness for beginners
17. T01-L17: When not to use AI
18. T01-L18: Beginner self-assessment

### Tier 2: Novice - Prompting and Chatbot Fluency

Vocabulary: system prompt, user prompt, role prompt, instruction, constraint, example, few-shot, output format, tone, persona, grounding, source, citation, follow-up, prompt template.

1. T02-L01: Prompt anatomy
2. T02-L02: Writing clear instructions
3. T02-L03: Giving useful context
4. T02-L04: Defining roles and personas
5. T02-L05: Setting goals and success criteria
6. T02-L06: Asking for specific output formats
7. T02-L07: Using examples in prompts
8. T02-L08: Prompt iteration and refinement
9. T02-L09: Follow-up questions
10. T02-L10: Asking AI to ask clarifying questions
11. T02-L11: Asking for assumptions
12. T02-L12: Asking for alternatives
13. T02-L13: Asking for risks and tradeoffs
14. T02-L14: Prompting for tone and audience
15. T02-L15: Prompting for step-by-step help
16. T02-L16: Prompting for checklists
17. T02-L17: Prompting for critique and revision
18. T02-L18: Novice self-assessment

### Tier 3: Capable Learner - Research, Study, and Information Literacy

Vocabulary: source, primary source, secondary source, citation, claim, evidence, summary, synthesis, literature review, fact-checking, recency, credibility, bias, media literacy, epistemic humility.

1. T03-L01: Using AI to learn unfamiliar topics
2. T03-L02: Asking AI for learning plans
3. T03-L03: Asking AI to explain at different difficulty levels
4. T03-L04: Socratic tutoring with AI
5. T03-L05: Generating practice questions
6. T03-L06: Explaining mistakes with AI
7. T03-L07: Summarizing articles and documents
8. T03-L08: Comparing sources
9. T03-L09: Identifying claims and evidence
10. T03-L10: Fact-checking AI answers
11. T03-L11: Understanding citation quality
12. T03-L12: Using AI for research outlines
13. T03-L13: Using AI for literature reviews
14. T03-L14: Detecting weak or fabricated references
15. T03-L15: Recognizing bias in AI responses
16. T03-L16: Using AI with search engines
17. T03-L17: Personal knowledge capture with AI
18. T03-L18: Capable learner self-assessment

### Tier 4: Knowledge Worker - Productivity and Professional Workflows

Vocabulary: workflow, SOP, template, knowledge base, meeting note, action item, task extraction, summarization, transformation, classification, prioritization, decision support, dashboard, review loop, human-in-the-loop.

1. T04-L01: AI-assisted email drafting
2. T04-L02: AI-assisted meeting notes
3. T04-L03: AI-assisted action item extraction
4. T04-L04: AI-assisted calendar and planning workflows
5. T04-L05: AI-assisted document drafting
6. T04-L06: AI-assisted document review
7. T04-L07: AI-assisted spreadsheets
8. T04-L08: AI-assisted data cleanup
9. T04-L09: AI-assisted slide decks
10. T04-L10: AI-assisted decision memos
11. T04-L11: AI-assisted brainstorming
12. T04-L12: AI-assisted project planning
13. T04-L13: AI-assisted task prioritization
14. T04-L14: AI-assisted personal productivity systems
15. T04-L15: AI-assisted team communication
16. T04-L16: Reusable prompt libraries
17. T04-L17: Human review checkpoints
18. T04-L18: Knowledge worker self-assessment

### Tier 5: Creative User - Multimodal, Media, and Content Creation

Vocabulary: multimodal, image generation, video generation, text-to-speech, speech-to-text, transcription, style transfer, storyboard, scene, prompt weighting, seed, upscaling, masking, inpainting, synthetic media.

1. T05-L01: Image understanding with AI
2. T05-L02: Image generation fundamentals
3. T05-L03: Image editing and inpainting
4. T05-L04: Brand-safe image generation
5. T05-L05: Video generation fundamentals
6. T05-L06: Video editing with AI
7. T05-L07: Storyboarding with AI
8. T05-L08: Audio transcription
9. T05-L09: Voice generation and text-to-speech
10. T05-L10: Music generation
11. T05-L11: Podcast production with AI
12. T05-L12: Social content workflows
13. T05-L13: Marketing content workflows
14. T05-L14: Design assistant workflows
15. T05-L15: Presentation design with AI
16. T05-L16: Synthetic media disclosure
17. T05-L17: Deepfake awareness
18. T05-L18: Creative user self-assessment

### Tier 6: Business Practitioner - Function-Specific AI Use

Vocabulary: use case, business process, ROI, customer journey, pipeline, segmentation, personalization, support ticket, knowledge article, HR screening, financial analysis, legal review, clinical decision support, domain risk, escalation.

1. T06-L01: AI use-case discovery
2. T06-L02: AI for marketing
3. T06-L03: AI for sales
4. T06-L04: AI for customer support
5. T06-L05: AI for operations
6. T06-L06: AI for finance and accounting
7. T06-L07: AI for HR and recruiting
8. T06-L08: AI for legal workflows
9. T06-L09: AI for healthcare workflows
10. T06-L10: AI for education workflows
11. T06-L11: AI for nonprofits
12. T06-L12: AI for small businesses
13. T06-L13: AI for enterprise teams
14. T06-L14: AI for ecommerce
15. T06-L15: AI for real estate
16. T06-L16: AI for government and civic services
17. T06-L17: AI use-case risk screening
18. T06-L18: Business practitioner self-assessment

### Tier 7: Workflow Designer - No-Code, Automation, and Team Systems

Vocabulary: automation, trigger, action, webhook, integration, connector, no-code, low-code, custom assistant, custom GPT, workspace, permission, audit trail, approval step, escalation path, workflow owner.

1. T07-L01: Workflow mapping for AI automation
2. T07-L02: Repeated-task identification
3. T07-L03: SOP design for AI-assisted work
4. T07-L04: No-code automation basics
5. T07-L05: Low-code automation basics
6. T07-L06: Trigger and action design
7. T07-L07: Webhook literacy
8. T07-L08: Custom assistant design
9. T07-L09: Custom GPT design
10. T07-L10: Knowledge upload patterns
11. T07-L11: Team prompt libraries
12. T07-L12: Workspace permissions
13. T07-L13: Approval and review flows
14. T07-L14: Escalation flows
15. T07-L15: Audit trails for AI workflows
16. T07-L16: Change management for AI workflows
17. T07-L17: Automation failure modes
18. T07-L18: Workflow designer self-assessment

### Tier 8: Applied Builder - APIs, Structured Outputs, and AI App Basics

Vocabulary: API, SDK, endpoint, request, response, JSON, schema, structured output, function calling, tool calling, streaming, latency, rate limit, token cost, model provider, environment variable.

1. T08-L01: AI API fundamentals
2. T08-L02: Model provider comparison
3. T08-L03: API authentication
4. T08-L04: Request and response structure
5. T08-L05: Prompt variables in applications
6. T08-L06: System and developer instructions
7. T08-L07: Structured outputs
8. T08-L08: JSON schema for AI responses
9. T08-L09: Function calling basics
10. T08-L10: Tool calling basics
11. T08-L11: Streaming response UX
12. T08-L12: File inputs
13. T08-L13: Image inputs
14. T08-L14: Audio inputs
15. T08-L15: Cost estimation
16. T08-L16: Latency management
17. T08-L17: Basic AI application architecture
18. T08-L18: Applied builder self-assessment

### Tier 9: Knowledge Systems Builder - Data, Embeddings, Search, and RAG

Vocabulary: embedding, vector, vector database, semantic search, keyword search, hybrid search, chunking, metadata, retrieval, reranking, RAG, grounding, citation, corpus, index, knowledge graph.

1. T09-L01: Embeddings basics
2. T09-L02: Vector search basics
3. T09-L03: Vector database options
4. T09-L04: Keyword search vs semantic search
5. T09-L05: Hybrid search
6. T09-L06: Document ingestion
7. T09-L07: Chunking strategies
8. T09-L08: Metadata design
9. T09-L09: Retrieval-augmented generation
10. T09-L10: Grounded answers
11. T09-L11: Citation design
12. T09-L12: Reranking
13. T09-L13: Knowledge base design
14. T09-L14: Knowledge graph integration
15. T09-L15: Data freshness
16. T09-L16: Retrieval evaluation
17. T09-L17: Enterprise search architecture
18. T09-L18: Knowledge systems builder self-assessment

### Tier 10: Agent Builder - Agents, Tools, MCP, and Orchestration

Vocabulary: agent, tool use, planning, orchestration, task loop, subagent, delegation, memory, state, trace, Model Context Protocol, MCP server, MCP client, tool permission, tool result, sandbox.

1. T10-L01: Agent concepts
2. T10-L02: AI workflow vs AI agent
3. T10-L03: Tool-using agents
4. T10-L04: Agent planning patterns
5. T10-L05: Task decomposition
6. T10-L06: State and memory
7. T10-L07: Short-term memory patterns
8. T10-L08: Long-term memory patterns
9. T10-L09: Subagents
10. T10-L10: Multi-agent coordination
11. T10-L11: Agent orchestration frameworks
12. T10-L12: Model Context Protocol basics
13. T10-L13: MCP server design
14. T10-L14: MCP client design
15. T10-L15: Agent permissions
16. T10-L16: Agent sandboxes
17. T10-L17: Agent observability
18. T10-L18: Agent builder self-assessment

### Tier 11: AI Engineer - Evaluation, Reliability, Deployment, and Operations

Vocabulary: eval, benchmark, golden dataset, test set, regression, LLM-as-judge, rubric, trace, observability, monitoring, fallback, cache, deployment, throughput, SLA, incident.

1. T11-L01: Evaluation fundamentals
2. T11-L02: Golden dataset creation
3. T11-L03: LLM-as-judge evaluation
4. T11-L04: Human evaluation workflows
5. T11-L05: Rubric design
6. T11-L06: Error analysis
7. T11-L07: Prompt versioning
8. T11-L08: Model comparison
9. T11-L09: Regression testing for AI apps
10. T11-L10: Trace analysis
11. T11-L11: Observability tooling
12. T11-L12: Monitoring production AI systems
13. T11-L13: Fallback strategies
14. T11-L14: Caching strategies
15. T11-L15: Deployment patterns
16. T11-L16: Incident response for AI systems
17. T11-L17: AI system lifecycle management
18. T11-L18: AI engineer self-assessment

### Tier 12: AI Security Practitioner - Security, Privacy, Abuse, and Red Teaming

Vocabulary: prompt injection, indirect prompt injection, jailbreak, data exfiltration, sensitive information disclosure, model theft, supply chain, sandbox escape, overreliance, excessive agency, adversarial example, red team, threat model, abuse monitoring.

1. T12-L01: AI threat modeling
2. T12-L02: Prompt injection
3. T12-L03: Indirect prompt injection
4. T12-L04: Jailbreaks
5. T12-L05: Sensitive information disclosure
6. T12-L06: Data exfiltration through tools
7. T12-L07: Insecure output handling
8. T12-L08: Tool permission risks
9. T12-L09: Excessive agency
10. T12-L10: Model denial of service and unbounded consumption
11. T12-L11: Model theft and extraction
12. T12-L12: Training data poisoning
13. T12-L13: Vector and embedding weaknesses
14. T12-L14: Supply chain risks in AI systems
15. T12-L15: Red teaming AI applications
16. T12-L16: Abuse monitoring
17. T12-L17: Secure AI deployment checklists
18. T12-L18: AI security practitioner self-assessment

### Tier 13: AI Governance Practitioner - Law, Ethics, Policy, and Compliance

Vocabulary: governance, ethics, responsible AI, transparency, explainability, fairness, bias, accountability, auditability, privacy, consent, copyright, intellectual property, high-risk AI, GPAI, AI management system.

1. T13-L01: Responsible AI fundamentals
2. T13-L02: AI ethics frameworks
3. T13-L03: Bias and fairness
4. T13-L04: Explainability and interpretability
5. T13-L05: Transparency and disclosure
6. T13-L06: Human oversight
7. T13-L07: Privacy law basics for AI use
8. T13-L08: Data protection and consent
9. T13-L09: Copyright and training data
10. T13-L10: AI-generated content ownership
11. T13-L11: Workplace AI policy
12. T13-L12: Education and academic integrity
13. T13-L13: Vendor risk management
14. T13-L14: NIST AI Risk Management Framework
15. T13-L15: ISO/IEC 42001 AI management systems
16. T13-L16: EU AI Act basics
17. T13-L17: Sector-specific AI compliance
18. T13-L18: AI governance practitioner self-assessment

### Tier 14: AI Specialist - Model Science, ML, and Advanced AI Domains

Vocabulary: neural network, deep learning, transformer, attention, pretraining, post-training, fine-tuning, reinforcement learning, diffusion, classifier, recommender, time series, computer vision, speech model, robotics, MLOps.

1. T14-L01: Machine learning fundamentals
2. T14-L02: Supervised learning
3. T14-L03: Unsupervised learning
4. T14-L04: Deep learning fundamentals
5. T14-L05: Transformer architecture
6. T14-L06: Attention mechanisms
7. T14-L07: Pretraining
8. T14-L08: Post-training
9. T14-L09: Fine-tuning
10. T14-L10: Synthetic data
11. T14-L11: Dataset quality
12. T14-L12: Diffusion models
13. T14-L13: Computer vision
14. T14-L14: Speech AI
15. T14-L15: Recommendation systems
16. T14-L16: Forecasting and time series
17. T14-L17: Reinforcement learning and robotics
18. T14-L18: AI specialist self-assessment

### Tier 15: AI Strategist - Product, Market, Adoption, and Frontier Planning

Vocabulary: AI strategy, adoption roadmap, operating model, capability map, build vs buy, product moat, unit economics, adoption metric, change management, frontier model, alignment, interpretability, capability evaluation, regulatory monitoring, market map.

1. T15-L01: AI strategy fundamentals
2. T15-L02: AI opportunity discovery
3. T15-L03: Use-case prioritization
4. T15-L04: Build vs buy decisions
5. T15-L05: AI vendor evaluation
6. T15-L06: AI product management
7. T15-L07: AI UX strategy
8. T15-L08: AI business model design
9. T15-L09: AI adoption roadmaps
10. T15-L10: Team enablement programs
11. T15-L11: Measuring AI adoption
12. T15-L12: AI operating models
13. T15-L13: AI market mapping
14. T15-L14: Frontier AI capability tracking
15. T15-L15: Interpretability and alignment awareness
16. T15-L16: Regulatory monitoring
17. T15-L17: Future-of-work planning
18. T15-L18: AI strategist self-assessment

## Cross-Cutting Topic Tracks

The tier list is the learner sequence. The system should also support selectable tracks that cut across tiers.

Tracks:

- AI basics and vocabulary
- Prompting
- AI-assisted learning
- Research and information literacy
- Productivity
- Creative and multimodal AI
- Business use cases
- AI automation
- AI apps and APIs
- Data and RAG
- Agents and MCP
- AI engineering
- AI security
- AI governance, law, ethics, and compliance
- Model science and ML
- Product strategy
- Industry-specific AI
- Teaching AI to others
- AI product literacy
- YouTube learning path
- Official vendor course path
- Aesop AI Academy course path

## Product Atlas

The product atlas should map every AI-integrated product we can reasonably discover to the same topic framework.

Product categories:

- General AI assistants
- AI search and answer engines
- Research assistants
- Writing and editing tools
- Coding assistants
- AI IDEs and coding agents
- Image generation tools
- Image editing tools
- Video generation tools
- Video editing tools
- Audio generation tools
- Music generation tools
- Voice assistants
- Transcription tools
- Meeting assistants
- Presentation tools
- Spreadsheet and data tools
- Document AI tools
- Legal AI tools
- Healthcare AI tools
- Finance AI tools
- HR and recruiting AI tools
- Marketing AI tools
- Sales AI tools
- Customer support AI tools
- Ecommerce AI tools
- Education AI tools
- No-code automation platforms
- Low-code automation platforms
- Agent platforms
- API model providers
- Cloud AI platforms
- Vector databases
- RAG platforms
- Knowledge base platforms
- AI observability tools
- AI evaluation tools
- AI security tools
- AI governance tools
- Local model tools
- Open-source model tools
- Robotics and embodied AI tools
- Browser agents
- Desktop agents
- Enterprise copilots
- CRM AI integrations
- ERP AI integrations
- Productivity suite AI integrations

Product record fields:

- id
- name
- company
- website_url
- category_ids
- description
- product_type
- roadmap_topic_ids
- tier_ids
- use_case_ids
- industry_ids
- skill_level
- pricing_model
- free_plan_available
- integrations
- official_docs_url
- official_tutorials_url
- official_youtube_url
- community_youtube_query
- alternatives
- vendor_status
- last_verified_at
- verification_source_url
- notes

Product-topic mapping fields:

- product_id
- topic_id
- mapping_type: primary, supporting, advanced, adjacent
- relevance_score
- difficulty_level
- notes
- reviewed_by
- reviewed_at

## Course and Resource Providers

Traditional courses should be normalized across providers so Anthropic, legacy Aesop courses, and future sources can all map into the roadmap. Courses are supporting resources, not the primary Aesop learning format.

Aesop AI Academy's primary native formats should become:

- Guided topic conversations
- Guardrailed labs
- Assessments
- Transcript-backed learning paths
- Supporting resources and references

Course providers:

- Aesop AI Academy legacy courses
- Anthropic Academy on Skilljar
- OpenAI docs and cookbook
- Google Cloud Skills Boost
- Microsoft Learn
- AWS Skill Builder
- DeepLearning.AI
- Coursera
- edX
- university open courses
- YouTube channels
- vendor academies
- community course creators

Course provider fields:

- id
- name
- platform
- website_url
- provider_type: owned, official_vendor, university, marketplace, community
- API_available
- API_type
- API_auth_method
- sync_method
- last_synced_at

Course fields:

- id
- provider_id
- external_course_id
- title
- description
- url
- thumbnail_url
- instructor
- difficulty
- estimated_duration
- language
- product_focus
- official_vendor
- status
- last_synced_at
- last_verified_at

Course-topic mapping fields:

- course_id
- topic_id
- relevance: primary, supporting, prerequisite, advanced
- confidence_score
- mapping_source: manual, AI_suggested, API_metadata, learner_feedback
- reviewed_by
- reviewed_at
- notes

### Aesop AI Academy Integration

Aesop AI Academy is an owned source. Use its REST API as the source of truth for course metadata.

Integration goals:

- Pull all courses
- Pull course modules if available
- Pull lessons if available
- Pull completion data for authenticated Aesop learners if permitted
- Store references, not duplicated course bodies
- Map every course to roadmap topics
- Show roadmap coverage inside Aesop
- Show Aesop courses inside roadmap topic pages

### Anthropic Academy Integration

Anthropic Academy should be treated as an official vendor course source.

Public courses verified on 2026-06-08:

- Claude 101
- Claude Code 101
- Introduction to Claude Cowork
- Claude Code in Action
- AI Fluency: Framework and Foundations
- Building with the Claude API
- Introduction to Model Context Protocol
- AI Fluency for educators
- AI Fluency for students
- Model Context Protocol: Advanced Topics
- Claude with Amazon Bedrock
- Claude with Google Cloud's Vertex AI
- Teaching AI Fluency
- AI Fluency for nonprofits
- Introduction to agent skills
- Introduction to subagents
- AI Capabilities and Limitations
- AI Fluency for Small Businesses

Likely mappings:

- Claude 101: T01, T02, T04
- Claude Code 101: T08, T10, T11
- Introduction to Claude Cowork: T04, T07, T10
- Claude Code in Action: T08, T10, T11
- AI Fluency: Framework and Foundations: T01, T02, T03, T13
- Building with the Claude API: T08, T10, T11
- Introduction to Model Context Protocol: T10, T12
- AI Fluency for educators: T03, T06, T13
- AI Fluency for students: T03, T13
- Model Context Protocol: Advanced Topics: T10, T11, T12
- Claude with Amazon Bedrock: T08, T11, T15
- Claude with Google Cloud's Vertex AI: T08, T11, T15
- Teaching AI Fluency: T03, T13, T15
- AI Fluency for nonprofits: T06, T13, T15
- Introduction to agent skills: T07, T10
- Introduction to subagents: T10
- AI Capabilities and Limitations: T01, T03, T13
- AI Fluency for Small Businesses: T06, T07, T15

## YouTube Discovery

YouTube is a primary learning source. The Experts project has an API for YouTube search, and this platform should use it as a discovery service once Scott approves cross-project inspection or provides the API contract.

Discovery flow:

1. Generate topic-specific search queries.
2. Call Experts YouTube API.
3. Store candidate videos.
4. Analyze title, channel, description, transcript if available, age, and duration.
5. Score candidates for relevance, authority, clarity, freshness, depth, and bias.
6. Map candidates to roadmap topics and products.
7. Send candidates to human review.
8. Publish approved videos as resources.

Conversation-triggered discovery flow:

1. Learner opens a topic conversation.
2. System retrieves approved videos already mapped to the topic.
3. If the approved resources are stale, thin, or poorly matched to the learner's role, the AI asks permission to search for newer videos.
4. Experts YouTube API returns candidates.
5. The conversation can show clearly labeled "newly discovered, not yet reviewed" candidates to the learner.
6. Candidates are stored for admin review.
7. Approved candidates become shared resources for future learners.
8. The transcript records whether the learner used reviewed or newly discovered material.

Default query patterns:

- "{topic} explained"
- "{topic} tutorial"
- "{topic} for beginners"
- "{topic} practical example"
- "{topic} best practices"
- "{topic} mistakes"
- "{topic} 2026"
- "{product} {topic} tutorial"
- "{provider} {topic} official"
- "{topic} deep dive"

YouTube candidate fields:

- id
- video_id
- url
- title
- channel_name
- channel_id
- description
- published_at
- duration
- view_count
- like_count
- thumbnail_url
- transcript_available
- transcript_summary
- query_used
- topic_id
- product_id
- relevance_score
- authority_score
- freshness_score
- clarity_score
- depth_score
- vendor_bias_score
- difficulty_guess
- review_status
- reviewed_by
- reviewed_at

Every topic page should eventually show:

- Best beginner video
- Best practical walkthrough
- Best official/vendor video
- Best deep dive
- Best recent update
- Best product demo
- Best video to pair with AI study prompts

## Guided AI Conversations and Questions to Ask AI

Every topic should include reusable AI-learning prompts, but those prompts should usually live inside a guided conversation. The conversation is more important than long lesson content.

Prompt types:

- Explain this topic like I am new
- Explain the topic for my role
- Give examples
- Give counterexamples
- Quiz me
- Ask me Socratic questions
- Help me practice
- Review my understanding
- Compare this topic to related topics
- Show common mistakes
- Show real-world use cases
- Help me build a mini project
- Help me verify sources

Conversation prompt types:

- Diagnose my current understanding
- Teach me through questions
- Make me define the vocabulary
- Give me a video to watch and questions to answer
- Ask me to compare two explanations
- Ask me to apply this to my role
- Ask me to identify risks or limitations
- Ask me to critique an AI-generated answer
- Ask me to build a small example
- Ask me to explain the topic back to you
- Decide whether I am ready to mark this topic complete

Prompt record fields:

- id
- topic_id
- prompt_type
- title
- prompt_text
- learner_level
- role_context
- expected_output_type
- safety_notes
- created_at
- reviewed_at

Guided conversations should be versioned separately from topic records. A topic can have multiple conversation designs for different learner goals, roles, industries, or depths.

## Coverage and Gap Dashboard

The dashboard should show where Aesop AI Academy has course coverage and where new courses should be created.

Coverage statuses:

- No coverage
- AI prompts only
- YouTube only
- External resources only
- Official vendor course only
- Aesop course planned
- Aesop course in production
- Aesop course published
- Aesop course needs update
- Strong coverage

Coverage dimensions:

- Has vocabulary
- Has topic description
- Has AI prompts
- Has YouTube videos
- Has official docs
- Has official vendor course
- Has Aesop course
- Has product mappings
- Has self-assessment
- Has project ideas
- Has verification date

Gap priority signals:

- Foundational prerequisite
- High learner demand
- High business demand
- Revenue opportunity
- Strategic differentiator
- Fast to produce
- Requires expert input
- Vendor-specific gap
- Governance or risk gap
- Product-market trend
- Outdated resources

## Database Model

Initial collections/tables:

- roadmap_tiers
- roadmap_topics
- topic_prerequisites
- vocabulary_terms
- topic_vocabulary
- user_profiles
- user_topic_progress
- user_vocab_progress
- user_resource_progress
- learner_language_preferences
- content_translations
- assessments
- assessment_questions
- assessment_responses
- resources
- resource_sources
- ai_learning_prompts
- guided_conversations
- guided_conversation_sessions
- guided_conversation_messages
- guided_conversation_resource_events
- course_providers
- external_courses
- course_modules
- course_lessons
- course_topic_mappings
- products
- product_categories
- product_topic_mappings
- product_integrations
- product_alternatives
- youtube_candidates
- resource_discovery_jobs
- coverage_records
- content_versions
- transcript_events
- transcript_exports

### `roadmap_tiers`

Fields:

- id
- slug
- name
- display_order
- description
- learner_label
- min_level
- max_level
- created_at
- updated_at

### `roadmap_topics`

Fields:

- id
- tier_id
- slug
- title
- short_description
- display_order
- topic_family
- difficulty
- estimated_learning_time
- status
- version
- created_at
- updated_at

### `transcript_events`

Fields:

- id
- user_id
- event_type
- entity_type
- entity_id
- status
- confidence_level
- evidence_type
- evidence_url
- notes
- occurred_at
- recorded_at

Event examples:

- topic_introduced
- topic_practiced
- topic_confident
- topic_assessed
- course_completed
- video_completed
- vocabulary_mastered
- product_explored
- project_completed
- assessment_passed
- guided_conversation_completed
- guided_research_completed
- newly_discovered_resource_used

### `guided_conversations`

Fields:

- id
- topic_id
- slug
- title
- conversation_goal
- learner_level
- role_context
- industry_context
- system_instructions
- phase_outline
- required_vocabulary_ids
- required_resource_types
- required_application_task
- assessment_rubric
- completion_threshold
- version
- status
- created_at
- updated_at

### `guided_conversation_sessions`

Fields:

- id
- user_id
- topic_id
- guided_conversation_id
- status
- current_phase
- learner_goal
- learner_role
- learner_industry
- selected_resource_ids
- discovered_resource_ids
- completion_signal
- assessment_result
- started_at
- completed_at
- updated_at

### `guided_conversation_resource_events`

Fields:

- id
- session_id
- user_id
- topic_id
- resource_id
- event_type: suggested, opened, completed, critiqued, rejected, newly_discovered
- source_status: approved, candidate, stale, unreviewed
- occurred_at

### `content_versions`

Fields:

- id
- entity_type
- entity_id
- version
- change_type
- change_summary
- active
- created_at
- created_by

Versioning matters because roadmap topics will evolve. User progress should survive topic edits.

## Learner Views

Required app views:

- Roadmap overview
- Tier detail
- Topic detail
- Personal roadmap builder
- Profile dashboard
- Transcript
- Product atlas
- Product detail
- Course atlas
- Resource discovery results
- Coverage dashboard
- Admin review queue

## Topic Detail Page Requirements

Each topic page should include:

- Topic title
- Tier
- Track tags
- Plain-language description
- Why it matters
- Start guided conversation
- Continue guided conversation
- Conversation phase and completion status
- Vocabulary
- Prerequisites
- Completion checklist
- Questions to ask AI
- Aesop courses
- Anthropic Academy courses
- Other courses
- YouTube videos
- Official docs
- Product mappings
- Practice tasks
- Readiness signals
- Self-assessment questions
- Related topics
- User notes
- Completion controls

The topic page should feel like a launchpad into the guided AI conversation, not a static article. Static text should orient the learner; the guided conversation should do the teaching, coaching, research, and assessment.

## Self-Assessment Model

Each tier should have a self-assessment. It should check understanding without feeling like school.

Assessment item types:

- Explain a concept
- Choose the right tool
- Identify a risk
- Critique an AI answer
- Match vocabulary
- Complete a mini workflow
- Pick the right prompt
- Spot a hallucination
- Design a simple AI workflow
- Interpret a policy scenario
- Evaluate a product

## Personal Roadmap Builder

User selectors:

- Current skill level
- Desired role
- Learning goal
- Industry
- Product interests
- Technical depth
- Governance depth
- Preferred learning style
- Time available
- Need for transcript or certificate

Example goals:

- I want to understand AI basics
- I want to use AI at work
- I want to automate my business
- I want to build AI apps
- I want to become an AI strategist
- I want to understand AI law and ethics
- I want to use AI for creative work
- I want to learn AI coding tools
- I want to evaluate AI products
- I want to teach AI to others

## Official Reference Sources for Initial Taxonomy

Use these sources as anchors for research and validation:

- OpenAI Agents docs: https://platform.openai.com/docs/guides/agents
- OpenAI Retrieval docs: https://platform.openai.com/docs/guides/retrieval
- OpenAI function calling and structured outputs: https://help.openai.com/en/articles/8555517-function-calling-in-the-openai-api
- Anthropic MCP docs: https://docs.anthropic.com/en/docs/mcp
- Anthropic tool use docs: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
- Anthropic Academy: https://anthropic.skilljar.com/
- Skilljar API docs: https://api.skilljar.com/docs/
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- NIST trustworthy AI glossary: https://www.nist.gov/publications/language-trustworthy-ai-depth-glossary-terms
- OWASP Top 10 for LLM Applications: https://owasp.org/www-project-top-10-for-large-language-model-applications
- OWASP MCP Top 10: https://owasp.org/www-project-mcp-top-10/
- EU AI Act overview: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- EU AI Act implementation timeline: https://ai-act-service-desk.ec.europa.eu/en/ai-act/eu-ai-act-implementation-timeline
- ISO/IEC 42001 overview: https://www.iso.org/standard/81230.html

## Next Implementation Steps

1. Review and edit this topic map with Scott.
2. Convert tiers and topics into seed data.
3. Design the guided conversation engine and topic conversation templates.
4. Add or update Firestore collection registry entries.
5. Define Aesop AI Academy REST API sync contract.
6. Get approval or API documentation for the Experts YouTube API.
7. Build YouTube/resource discovery and candidate review flow.
8. Build initial admin-only topic, conversation, and resource management screens.
9. Build learner roadmap, guided conversation, and profile progress screens.
10. Build transcript event recording.
11. Build Aesop coverage dashboard.
12. Add product atlas ingestion and review workflow.
