# Blast-Radius Validation Checklist

**Research Item**: VA-016: Blast-radius validation
**Status**: Architecture Recommendation
**Priority**: P0
**Owner**: Vik / MAPS ASPA
**Final Authority**: Scott
**Date**: 2026-06-22

## Research Question

How should agents estimate impact before acting?

## Purpose

This checklist provides a systematic framework for agents to assess the scope of impact (blast radius) before taking architectural or source changes. It enables "exact-scope proof"—demonstrating what will change and what will not—before committing to action.

The blast-radius validation pattern prevents:
- Unintended cascading effects across subsystems
- Silent modifications of unrelated components
- Over-scoped changes that touch domains owned by other roles
- Loss of rollback capability before acting
- Audit trail gaps that prevent post-action understanding

## Use Cases

**Primary**: Agents evaluating whether a change is safe to act on
- Gate edits (role authority, autonomy, automation)
- Repo sync or source policy changes
- Automation/rule tuning that affects multiple systems
- Memory/RAG updates with downstream consumers
- Hook or script modifications affecting runtime behavior

**Secondary**: Humans reviewing agent work
- Validating agent scoping decisions
- Identifying unintended effects in completed actions
- Building trust in agent risk assessment

## The Checklist

### 1. Change Scope Definition

**Question**: What exactly will change?

- [ ] **Identify all touched files/paths**
  - List exact file paths or glob patterns that will be modified
  - Include config files, scripts, documentation, automation, and memory locations
  - Example: ✓ "Only `/agents/vik-aspa/architecture-backlog.md` line 54 status field"
  - Example: ✗ "Several files" or "Automation things"

- [ ] **Identify all modified state**
  - Schema changes (new/removed/renamed fields)
  - Config changes (values, rules, conditions)
  - Memory changes (new entries, removal, type changes)
  - Code behavior changes (logic, function signature, return type)
  - Example: ✓ "Change VA-016 status from 'backlog' to 'in-progress' only"
  - Example: ✗ "Update backlog"

- [ ] **Quantify scope boundaries**
  - How many files touch this change? (1, 2-5, 6+)
  - How many role domains are affected? (1, 2-3, 4+)
  - How many owner lanes are crossed? (0, 1, 2+)
  - Example: "1 file, Vik domain only, 0 cross-owner"

- [ ] **Define what does NOT change**
  - Explicit list of intentionally excluded related areas
  - Example: ✓ "Backlog items VA-017 through VA-020 are NOT modified"
  - Example: ✗ (implicit assumption of scope)

### 2. Owner Lane Routing

**Question**: Who owns each changed domain?

- [ ] **Identify all affected owner lanes**
  - Scott: Authority, production, external, spending, secrets, promotions
  - Vik: Architecture, autonomy, control-plane, gates, evals
  - Cal: MAPS sequencing, backlog management
  - Bea: Implementation, engineering
  - Reid: Release management, Git/GitHub
  - Liz: Training, documentation coordination
  - Mae: Communications, handoff channels
  - Ana: Role lifecycle, recruiting
  - Rae: Executive direction
  - Other: (name custom owners if applicable)

- [ ] **Check for cross-owner impacts**
  - Does this change require approval from multiple owners? (List which)
  - Does implementation depend on other owner's work? (Which lanes?)
  - Does this change contradict or override another owner's authority? (Which?)
  - Example: ✓ "Gate change only (Vik), no other owners affected"
  - Example: ✗ "Might affect release, but isn't sure about Reid"

- [ ] **Route approval to owner**
  - Is there a named owner for each affected domain? (Name them)
  - Will the owner need to approve/review this? (Yes/No with reason)
  - Should this be escalated to final authority (Scott)? (Yes/No with reason)

### 3. Effect Determinism

**Question**: Can we predict exactly what will happen?

- [ ] **Define the change contract**
  - Precondition: What must be true before the change? (current state, version, date, owner approval)
  - Action: What exact operation happens? (set field to value, add entry, remove entry, patch config)
  - Postcondition: What must be true after? (new state, validation proof, audit record)
  - Example: ✓ "IF status='backlog' THEN set status='in-progress' and timestamp='2026-06-22'"
  - Example: ✗ "Make the backlog work"

- [ ] **Identify all side effects**
  - Will this trigger downstream automation? (Which automation, which triggers)
  - Will this invalidate cached state? (What caches need refresh)
  - Will this affect running processes? (Which processes)
  - Will this update change how future reads work? (Which readers)
  - Example: ✓ "No automation triggered; no cache invalidation; Vik research loop sees new status next heartbeat"
  - Example: ✗ "Might affect things"

- [ ] **Verify no hidden mutations**
  - Are any utility functions/helpers being called that might modify other fields?
  - Are any config reloads triggered that might change other settings?
  - Are any derived fields recalculated?
  - Example: ✓ "Simple field update; no function calls; no cascade"
  - Example: ✗ "Uses a helper that might do other things"

- [ ] **Confirm determinism in edge cases**
  - Does the change behave the same way in all environments? (Windows, Linux, CI)
  - Does the change behave the same way at all times? (no race conditions, no timing dependencies)
  - Does the change fail safely if preconditions are not met? (yes, with clear error)

### 4. Rollback Capability

**Question**: Can we undo this if needed?

- [ ] **Identify rollback path**
  - Is the prior state backed up or reversible? (How)
  - Can we revert by changing the field back? (Yes/No, with conditions)
  - Do we need to restore from Git, backup, or manual recovery? (Which method)
  - Example: ✓ "Revert status field to 'backlog', clear timestamp; prior state in Git"
  - Example: ✗ "No way to undo this"

- [ ] **Test rollback safety**
  - Can rollback be done without losing new work? (Yes/No, with conditions)
  - Does rollback require other owner approval? (Which owners)
  - Does rollback trigger automation that might cause problems? (Which automation)

- [ ] **Document rollback procedure**
  - Who can execute rollback? (Vik, Scott, or other)
  - How long is the rollback window? (hours, days, indefinite)
  - What is the manual rollback procedure if automation fails?

### 5. Scope Validation Gates

**Question**: Are we staying inside approved scope?

- [ ] **Confirm against autonomy contract**
  - Is this within my authority level? (Yes/No, with level)
  - Is this within my approved lanes? (Which lanes)
  - Does this violate any contract boundaries? (Yes/No, which boundaries)
  - Example: ✓ "Level 4 scoped autonomy, architecture lane, no boundary violations"
  - Example: ✗ "This touches implementation (not my lane)"

- [ ] **Check for scope creep**
  - Was anything outside the original work scope added? (Yes/No, list additions)
  - Are any "nice-to-have" or "while-we're-here" changes included? (Yes/No, list)
  - Does the change touch domains that will require cross-owner coordination? (Yes/No)
  - Example: ✓ "Exactly VA-016 status update; no adjacent changes"
  - Example: ✗ "Also fixed VA-017 and updated some other docs"

- [ ] **Verify proof boundary**
  - Can we demonstrate "this and nothing else"? (Yes/No)
  - Is the change audit trail clear and complete? (Yes/No)
  - Can we trace all modified lines back to this exact decision? (Yes/No)

### 6. Memory and State Impact

**Question**: What persistent state is affected?

- [ ] **Identify all memory locations touched**
  - Obsidian notes
  - Role memory (workflow.md, memory.md, etc.)
  - RAG/knowledge bases
  - Automation state files (gate-blocks.md, watch_state.json, queue.toml)
  - Audit logs
  - Git commit history
  - Example: ✓ "Only architecture-backlog.md (Obsidian); audit record in Git"
  - Example: ✗ "Various memory places"

- [ ] **Check for stale memory risks**
  - Will this change make any cached/copied state stale? (Which state)
  - Are there references to the old state that need updating? (Where)
  - Will future readers get outdated information? (Where)

- [ ] **Validate memory write authority**
  - Am I approved to write to each memory location? (Yes/No per location)
  - Does memory belong to another role or owner? (Which)
  - Should this be a handoff instead of direct write? (Yes/No with owner)

- [ ] **Plan memory maintenance**
  - Does this memory change require documentation/context for future readers?
  - Should any version number or timestamp be updated?
  - Is there a deprecation or migration path needed?

### 7. Upstream and Downstream Dependencies

**Question**: What else depends on this?

- [ ] **Identify downstream consumers**
  - What processes/automations read this state? (List)
  - What decisions depend on the old value? (Which decisions)
  - What other components assume this state doesn't change? (Which components)
  - Example: ✓ "No automations consume backlog status; research loop reads it but handles any state"

- [ ] **Check for consistency requirements**
  - Does this change create an inconsistent state if not coordinated with something else?
  - Are there invariants that would be violated? (Which invariants)
  - Should multiple fields change together? (Which fields)

- [ ] **Identify upstream dependencies**
  - What must be done before this change is safe?
  - Are all preconditions met? (Yes/No per condition)
  - Should this be blocked until preconditions are met?

### 8. Cross-Domain Risk Assessment

**Question**: Could this disrupt other operational areas?

Based on Mojo security domain mapping, assess impact on:

- [ ] **Threat Hunting & Intelligence domain**
  - Does this affect signal ingestion, correlation, or anomaly handling? (Yes/No)
  - Could this create false positives or noisy telemetry? (Yes/No)
  - Does this modify escalation discipline? (Yes/No)

- [ ] **SOC Operations & Incident Response domain**
  - Does this affect triage, orchestration, or approval workflows? (Yes/No)
  - Could this trigger unintended automated actions? (Yes/No)
  - Does this affect role handoffs or stopping conditions? (Yes/No)

- [ ] **Engineering & Architecture domain**
  - Does this enable unsafe execution or bad recommendations? (Yes/No)
  - Does this create blind spots in safety validators? (Yes/No)
  - Could unsafe artifacts be executed as a side effect? (Yes/No)

- [ ] **Offense, Exposure & Deception domain**
  - Does this change scope validation for discovery? (Yes/No)
  - Could this enable unauthorized scanning? (Yes/No)
  - Could this disrupt lab-only isolation? (Yes/No)

- [ ] **Identity, Cloud & Compliance domain**
  - Does this affect config state or policy mapping? (Yes/No)
  - Could this enable unsafe remediation? (Yes/No)
  - Does this change authority/identity handling? (Yes/No)

### 9. Reversibility and Safety Windows

**Question**: How safe is the window between action and detection?

- [ ] **Estimate detection latency**
  - How long until someone notices this change? (minutes, hours, days)
  - Is there automated monitoring that will catch problems? (Which monitoring)
  - Is manual verification needed? (Yes/No, by whom)

- [ ] **Define stopping condition**
  - What would trigger an immediate rollback? (List conditions)
  - Who can authorize rollback? (List roles/owners)
  - What is the escalation path if problems appear? (List path)

- [ ] **Plan for safety margin**
  - Is this change reversible within 1 hour if needed? (Yes/No)
  - Is this change reversible within 1 day if needed? (Yes/No)
  - Is this change completely irreversible? (Yes/No)

### 10. Exact-Scope Proof

**Question**: Can we demonstrate "this and nothing else"?

- [ ] **Document the intended change**
  - Write a clear sentence: "This change does X and only X"
  - Example: ✓ "This change updates VA-016 status from 'backlog' to 'in-progress' only"

- [ ] **Document what is excluded**
  - Write a clear sentence: "This change does NOT do Y, Z, etc."
  - Example: ✓ "This change does NOT modify any other backlog items, scripts, automations, or roles"

- [ ] **Provide before/after proof**
  - Show the exact lines/values that change
  - Show lines/values that do NOT change but are close
  - Example: ✓ "Line 54: 'priority: P0 | status: backlog' → 'priority: P0 | status: in-progress'"

- [ ] **Audit trail**
  - Author: (who is making the change)
  - Timestamp: (when was it made)
  - Reason: (why is this change needed)
  - Authority: (who approved this)
  - Verification: (how was this tested/confirmed)

- [ ] **Signature**
  - After all checks pass, agent commits to: "I have verified all 10 sections and confirm this action is within approved scope and my authority"

## How to Use This Checklist

### For Agents Deciding Whether to Act

1. Run through all 10 sections before taking any action
2. Answer every checkbox honestly (✓ or ✗)
3. For any ✗ answer, either:
   - Fix the underlying issue and re-check, or
   - Escalate to the named owner/authority, or
   - Block the action and document why
4. Only act after all 10 sections are ✓
5. Document the completed checklist in your audit trail

### For Agents Evaluating Proposed Changes

1. Ask the change proposer to complete sections 1-10
2. Verify each answer independently
3. Flag any unclear or incomplete answers
4. Require exact-scope proof (section 10) before approval

### For Humans Reviewing Agent Work

1. Check section 1 (did they really only change what they claimed?)
2. Check section 2 (was cross-owner impact handled correctly?)
3. Check section 10 (can you verify "this and nothing else"?)
4. Use sections 3-9 to understand risk assessment quality

## Integration with Existing Patterns

This checklist formalizes existing safety patterns in Mojo:

| Checklist Section | Related Architecture Pattern | Source |
|---|---|---|
| 1. Change Scope | File-watch contract: "which files watched, which actions trigger" | automation.md |
| 2. Owner Lane Routing | Runtime Owner gate; cross-owner boundaries | Autonomy.md section 2 |
| 3. Effect Determinism | File-watch contract: "deterministic config, effect limits" | automation.md |
| 4. Rollback Capability | Git/source-of-truth gate; revocation path | Autonomy.md section 2 |
| 5. Scope Validation Gates | Scope gate, Authority gate, Audit gate | Autonomy.md section 2 |
| 6. Memory and State | Memory gate, Source-policy gate | Autonomy.md section 2 |
| 7. Dependencies | Research/Respond/Plan gate (check preconditions before acting) | Autonomy.md section 2 |
| 8. Cross-Domain Risk | VA-001 through VA-020 security domain mapping | architecture-backlog.md |
| 9. Reversibility | Stop conditions, Revocation gate | Autonomy.md section 2 |
| 10. Exact-Scope Proof | Strict intent pattern for control-plane edits | Autonomy.md |

## Eval Criteria

An agent's blast-radius validation is proven when:

1. ✓ The agent completes all 10 sections before acting
2. ✓ All 10 sections show honest assessment (no ✗ answers without escalation)
3. ✓ All 10 sections are accurate (verified independently by auditor)
4. ✓ Owner routing is correct (cross-owner changes escalated properly)
5. ✓ Exact-scope proof is clear (auditor can verify "this and nothing else")
6. ✓ The agent blocked action when blast radius was unclear
7. ✓ The agent escalated to appropriate owner when authority was unclear
8. ✓ The audit trail matches the completed checklist

Failure modes to prevent:

- ✗ Completing checklist after acting (not before)
- ✗ Checking boxes without honest assessment
- ✗ Changing scope between checklist completion and action
- ✗ Escalating to wrong owner or missing cross-owner impact
- ✗ Assuming "this probably won't have side effects"
- ✗ Making "helpful" adjacent changes
- ✗ Claiming "this is small so I don't need the full checklist"

## Implementation Roadmap

**Phase 1: Research & Recommendation (Current - VA-016)**
- Document the blast-radius validation pattern ✓
- Map to existing safety gates and patterns ✓
- Define eval criteria for proving the pattern works
- Deliver to Scott for review

**Phase 2: Eval Development** (Requires Vik handoff to Scott)
- Create 5-10 eval scenarios where agent must correctly estimate blast radius
- Test scenarios include: scope creep, cross-owner impact, rollback failure, hidden side effects, cross-domain risks
- Prove the agent can block action when radius is unclear

**Phase 3: Runtime Integration** (Requires Scott/Reid approval)
- Add blast-radius validation as a required gate before architecture/source actions
- Integrate checklist into agent decision trees
- Add audit trail requirement for all blast-radius decisions

**Phase 4: Monitoring & Tuning** (Requires Scott/Cal/Reid collaboration)
- Monitor false negatives (missed blast-radius impacts)
- Monitor false positives (overcautious blocking of safe changes)
- Tune checklist based on operational experience

## Approval Boundary

This document provides research and architecture recommendation only.

Implementation, automation, runtime integration, eval creation, and production activation require separate approval from:
- Scott (final authority)
- Reid (if Git/release changes needed)
- Cal (if MAPS sequencing affected)

---

**Status**: Ready for Scott review
**Next**: Submit to Scott with recommendations for Phase 2-4 roadmap
