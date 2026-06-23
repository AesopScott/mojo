# Vik / ASPA Observation Log

Trace execution log for vik-aspa agent autonomy observation. Records setup, trace runs, alerts, and evidence flow.

## Secret Handling Policy

**CRITICAL:** LANGSMITH_API_KEY is present in environment but MUST NEVER be printed, logged, or persisted to any file. All traces are sanitized before transmission. No credentials, tokens, or secrets appear in run names, tags, metadata, or payloads.

## Setup Entries

### 2026-06-23 — LangSmith Observation Framework Activated

**Owner:** Bea  
**Status:** Framework ready for validation; no traces recorded yet  
**Authority:** Configuration only (no runtime activation, no production deployment, no spending)

#### Setup Actions Completed

1. ✓ observation-plan.md upgraded with full LangSmith integration spec
2. ✓ Trace schema defined (run structure, child spans, metadata)
3. ✓ Signal list expanded with source hashes, decision classification, boundary checks
4. ✓ Alert conditions specified with detection rules
5. ✓ Manual fallback configured (JSONL audit trail if LangSmith unavailable)
6. ✓ First trace target identified: `agents/vik-aspa/tests/test_aspa_runtime.py` (proof harness)
7. ✓ Validation plan specified: `python -m unittest agents.vik-aspa.tests.test_aspa_runtime`
8. ✓ Evidence-to-improve flow documented (traces → design updates → re-evaluation)
9. ✓ Missing setup gaps listed (datasets, experiments, annotation queue)

#### Runtime Instrumentation Added (2026-06-23)

**File:** `agents/vik-aspa/runtime/aspa_runtime.py`

Instrumentation changes:
- Added optional LangSmith import with fallback when the package is unavailable.
- Added `compute_source_hash(path)` helper to generate SHA256 hashes of source files.
- Added sanitized LangSmith input/output processors so traces do not include file contents or secrets.
- Refactored the decision path so public `decide(request, paths)` is the single instrumentation point for tests, CLI, and future runtime callers.
- Added fail-open tracing behavior: if LangSmith tracing fails, the runtime falls back to the normal decision implementation.
- Auto-sets `LANGSMITH_TRACING_V2=true` inside the process when `LANGSMITH_TRACING=true` and the V2 flag is unset.

Trace captures:
- **Inputs:** request text, source hashes (role, profile, design, backlog, autonomy_contract, canonical_autonomy), agent="vik-aspa", autonomy_level="4_scoped"
- **Outputs:** status, category, needs_approval, message, sources_count
- **Project:** Uses env var `LANGSMITH_PROJECT` or defaults to "vik-aspa"

Safety guarantees:
- No LANGSMITH_API_KEY printed or logged (read-only)
- No file contents included (hashes only)
- All CLI exit codes preserved (0 allowed, 2 blocked, 3 contract error)
- No behavioral changes if LangSmith unavailable, the API key is missing, or tracing is disabled

#### Environment Check

- LANGSMITH_API_KEY: Present in environment (not logged or persisted; read-only for traces only)
- LANGSMITH_PROJECT: Should be set to `vik-aspa` when tracing enabled
- LANGSMITH_TRACING: Set to `true` to activate (default: false for level 4 scoped work)
- LANGSMITH_TRACING_V2: Auto-set to `true` inside process if LANGSMITH_TRACING=true
- Fallback audit path: `run-artifacts/audit.jsonl` (if key unavailable)

#### Next Steps (Pending)

- [x] Run validation: `python -m unittest agents.vik-aspa.tests.test_aspa_runtime`
- [x] Exercise CLI runtime path: `python agents\vik-aspa\run_aspa.py --request "Review role-agent boundary for Bea"`
- [ ] Create LangSmith project (if not exists) and verify API key access
- [ ] Manual review of first 5 traces before broader logging
- [ ] Confirm no secrets appear in audit JSONL (if fallback used)

#### Validation Result (2026-06-23)

- Unit tests: 16 passed.
- CLI proof run: returned allowed `architecture_review` decision through public `decide()` instrumentation point.
- Secret scan: no API keys, tokens, passwords, or Claude ownership strings found in the runtime or observation notes.

#### Authority Boundaries (Strictly Enforced)

- ❌ No autonomous runtime activation (Level 4 scoped only)
- ❌ No production deployment of observation
- ❌ No external communication of traces
- ❌ No spending on LangSmith features
- ❌ No secrets or credentials in trace payloads
- ❌ No Git/release operations for this observation work
- ❌ No authority expansion or privilege escalation

---

## Trace Runs

(No traces recorded yet. First trace entry to follow after validation harness runs and Scott approves live tracing.)

---

## Alert Events

(None yet. Alerts will be logged here if boundary violations, contract failures, or stale sources detected.)

---

## Evidence-to-Improve Log

(No evidence collected yet. Future design updates, promotion readiness signals, or authority drift detections will be recorded here with links to trace findings.)

---

## Manual Review Checklist

Before Scott approves any traces for broader logging:

- [ ] All test cases in proof harness pass
- [ ] No ContractError exceptions on valid requests
- [ ] All denied actions properly blocked (production, external, spending, secrets, authority expansion)
- [ ] Decision_status and category fields match expected values
- [ ] Source hashes are correctly computed and included
- [ ] Validation_gate shows "validator_passed" for allowed decisions
- [ ] No credentials, tokens, or secrets leaked into any trace field
- [ ] JSONL fallback (if used) contains no plaintext API keys
- [ ] Timestamp and metadata fields are consistent

---

## References

- Autonomy contract (canonical): `roles/vik/Autonomy.md`
- Observation plan: `agents/vik-aspa/observation-plan.md`
- Runtime validator: `agents/vik-aspa/runtime/aspa_runtime.py`
- Proof harness: `agents/vik-aspa/tests/test_aspa_runtime.py`
- Audit trail (fallback): `agents/vik-aspa/run-artifacts/audit.jsonl`
