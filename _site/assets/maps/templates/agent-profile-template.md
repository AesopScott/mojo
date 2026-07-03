# {{agent_name}} Agent Profile

Template version: 0.3.0.

## Changelog

- 2026-06-19 - v0.3.0 - Added design/profile sync fields, website mirror status, runtime enforcement status, and profile conflict gates for `/design-agent` profile-contract integration.
- 2026-06-19 - v0.2.0 - Added role-agent category, runtime contract, authority domains, memory/state boundaries, approval gates, stop conditions, and proof gates.

## Identity

- Agent: {{agent_name}}
- Agent handle: {{agent_handle}}
- Source role: {{source_role_path}}
- Source role memory: {{source_role_memory_path}}
- Agent brief: agents/{{agent_handle}}/agent-brief.md
- Agent design: agents/{{agent_handle}}/agent-design.md
- Agent backlog: agents/{{agent_handle}}/agent-backlog.md
- Profile status: {{profile_status}}
- Owner: {{owner}}

## Role-Agent Category

- Current category: Role / Role+ / Agent
- Target category: Role / Role+ / Agent
- Category change approved by Scott: Yes / No / Not applicable
- `Role`: no automation enabled.
- `Role+`: automation-enabled but no independent authority, contract, goal outside automation rules, runtime state, or agentic status; a memory file alone does not make a role stateful or agentic.
- `Agent`: implemented runtime with approved runtime contract, authority, tools, memory, evaluation, deployment, observation, escalation, and stop conditions.
- Promotion guard: do not promote Role to Role+ or Role+ to Agent without explicit approval.

## Activation

- Agent profile enabled: {{yes_no}}
- Manual invocation enabled: {{yes_no}}
- Autonomous runtime installed: {{yes_no}}
- Production publishing allowed: {{yes_no}}
- External communication allowed: {{yes_no}}
- Spending allowed: {{yes_no}}
- Authority expansion allowed: {{yes_no}}

## Runtime Contract

- Runtime target: {{runtime_target}}
- Runtime profile or adapter: {{runtime_profile_or_adapter}}
- Runtime state allowed: {{yes_no}}
- Runtime state location: {{runtime_state_location}}
- Sandbox or execution boundary: {{sandbox_or_execution_boundary}}
- Local run command: {{local_run_command}}

## Design And Runtime Sync

- Last synchronized design artifact: {{last_synchronized_design_artifact}}
- Last synchronized design timestamp: {{last_synchronized_design_timestamp}}
- Design sync status: not started / in sync / needs review / blocked
- Runtime enforcement status: not built / design only / implemented locally / evaluated / deployed
- Pending profile questions:
  - {{pending_profile_question}}
- Next MAPS skill: {{next_maps_skill}}
- Profile conflict status: none / approval required / blocked
- Approval-required profile conflicts:
  - {{approval_required_profile_conflict}}
- Website profile page: {{website_profile_page_path_or_url}}
- Website mirror sync status: none / not applicable / in sync / sync needed / stale / blocked
- Website mirror boundary: website profile pages are mirrors only and do not grant authority, activation, tool access, memory rights, production access, external communication, spending, or autonomous runtime.

## Autonomy

Current level: {{autonomy_level}}

{{autonomy_notes}}

## Authority

Current level: {{authority_level}}

{{authority_notes}}

## Authority Domains

Allowed without approval:

- {{allowed_without_approval}}

Requires approval:

- {{requires_approval}}

Forbidden:

- {{forbidden_action}}

Approval gates:

- Production:
- External communication:
- Spending:
- Secrets or credentials:
- Global installs:
- Authority expansion:
- Autonomous activation:

## Voice Profile

- Primary voice: {{primary_voice}}
- Secondary voice blend: {{secondary_voice_blend}}
- Voice blend ratio: {{voice_blend_ratio}}
- Voice intensity: low / medium / high
- Formality: casual / neutral / formal
- Emotional temperature: warm / steady / sharp / playful / grave
- Challenge style: {{challenge_style}}
- Default sentence shape: {{sentence_shape}}
- Humor level: none / light / moderate / high
- Forbidden voice habits: {{forbidden_voice_habits}}
- Example response: {{example_response}}

Voice palette source: `G:\My Drive\Mindshare\voice-taxonomy.md`

## Tool Access

Allowed:

- {{allowed_tool_or_capability}}

Not allowed:

- {{forbidden_tool_or_capability}}

## Known Hooks

- {{hook_name}}: {{enabled_candidate_or_forbidden}}

## Memory Rights

Allowed:

- {{allowed_memory_right}}

Forbidden:

- {{forbidden_memory_right}}

## Memory And State Boundaries

- Primary memory location: {{primary_memory_location}}
- Mirror memory location: {{mirror_memory_location}}
- RAG/read-write rule: {{rag_rule}}
- Handoff files assigned as inputs: {{assigned_handoff_files}}
- Memory write authority: {{memory_write_authority}}
- Stale or harmful memory correction path: {{memory_correction_path}}

## Stop Conditions And Escalation

- Stop conditions:
  - {{stop_condition}}
- Escalation points:
  - {{escalation_point}}
- Refusal conditions:
  - {{refusal_condition}}
- Audit evidence required:
  - {{audit_evidence}}

## Proof Gates

| Gate | Required evidence | Current state | Owner | Next action |
|---|---|---|---|---|
| Design contract | agents/{{agent_handle}}/agent-design.md names build gate and non-implementation boundary | {{state}} | {{owner}} | {{next_action}} |
| Build readiness | agents/{{agent_handle}}/agent-backlog.md has first slice, proof, runtime, authority, memory, and stop-condition constraints | {{state}} | {{owner}} | {{next_action}} |
| Local run | Runnable loop or explicit blocked reason exists | {{state}} | {{owner}} | {{next_action}} |
| Authority boundary | Refusal/escalation behavior is specified or tested | {{state}} | {{owner}} | {{next_action}} |
| Memory boundary | Memory writes are specified or tested against project rules | {{state}} | {{owner}} | {{next_action}} |
| Evaluation | Eval or specification-mode eval records what was proven and unproven | {{state}} | {{owner}} | {{next_action}} |

## Profile Gates

| Gate | Owner | Current state | Next action |
|---|---|---|---|
| Role contract | {{owner}} | {{state}} | {{next_action}} |
| Agent definition | {{owner}} | {{state}} | {{next_action}} |
| Agent design | {{owner}} | {{state}} | {{next_action}} |
| Build backlog | {{owner}} | {{state}} | {{next_action}} |
| Profile/design sync | {{owner}} | {{state}} | {{next_action}} |
| Runtime enforcement | {{owner}} | {{state}} | {{next_action}} |
| Website mirror sync | {{owner}} | {{state}} | {{next_action}} |
| Architecture review | {{owner}} | {{state}} | {{next_action}} |
| Pipeline movement | {{owner}} | {{state}} | {{next_action}} |
| Activation approval | {{owner}} | {{state}} | {{next_action}} |

## Next Skill

Next skill: {{next_skill}}
