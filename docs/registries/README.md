# Cross-Boundary Registries

This directory contains registries of every cross-boundary contract in the mojo project. A **boundary** is anywhere two pieces of code, config, or infrastructure refer to the same name independently and can disagree.

Examples:
- A REST API endpoint defined in server code and called from client code
- An environment variable set in `.env` and used in multiple places
- A data file produced by one task and consumed by another
- A Stripe webhook event type sent by Stripe and handled in code

These registries are the **source of truth** for these contracts. Every PR that touches a cross-boundary name must update the relevant registry in the same commit.

---

## Registry Files

- **`endpoints.md`** — HTTP routes, API endpoints, and handlers
- **`env-vars.md`** — Environment variables and configuration
- **`file-paths.md`** — File locations and data structure paths
- **`stripe-config.md`** — Stripe account configuration and integration points

---

## Why Registries Matter

Without registries:
- A producer and consumer can disagree silently (one writes `firstName`, the other reads `first_name`)
- An endpoint can be removed and the client code still builds (until runtime)
- A webhook listener can be orphaned (created in code but never registered in external service)

With registries:
- Every producer/consumer pair is visible in one place
- PRs are reviewed against the contract (not just code style)
- Gaps are caught before implementation (not after bugs ship)
- New team members understand the architecture at a glance

---

## How to Maintain Registries

### Adding a New Cross-Boundary Name

1. Identify the boundary kind: endpoint, env var, file path, etc.
2. Add an entry to the relevant registry markdown file
3. Document the producer(s) and consumer(s) with file:line references
4. Set status: `✓` (healthy), `⚠ [gap type]` (issue), or `✓ (intentional bypass)` if known
5. Commit the registry change in the same commit as the code change

Example PR workflow:
```
Commit message:
  feat: add /api/custom-handler endpoint
  
  Updates env-vars.md to add CUSTOM_API_KEY
  Updates endpoints.md to register /api/custom-handler
  
  Producers: api/custom-handler.js:15
  Consumers: client/pages/settings.js:42
  Status: ✓
```

### Updating an Existing Entry

If a cross-boundary name changes (renamed, moved, interface changes):
1. Update the relevant registry entry
2. Update producer/consumer references with new file:line locations
3. Update the status if applicable
4. Commit with message: `docs: update [kind] registry — [name] moved/changed`

### Removing an Entry

If a cross-boundary name is deleted:
1. Verify both producer and consumer code are removed
2. Remove the entry from the registry
3. Commit with message: `docs: remove [kind] registry entry — [name]`

---

## PR Review Checklist

Before merging any PR that touches a cross-boundary name, verify:

- [ ] Code change is in the PR
- [ ] Corresponding registry update is in the same commit
- [ ] Producer/consumer references are correct file:line citations (not paraphrases)
- [ ] Status reflects the health of the boundary (✓ if healthy, ⚠ if gaps)
- [ ] If there's a ⚠ gap, the PR description explains why it's acceptable or what will fix it

If a PR touches cross-boundary code but **doesn't update registries**, request changes.

---

## Audit Trail & Verification

Each registry includes an **Audit Trail** section at the end showing:
- When the registry was last verified (`/cross-boundary-audit` timestamp)
- What boundaries were checked
- Count of healthy entries (✓) vs. entries with gaps (⚠)
- List of new identifiers introduced
- Whether the registry matches the current code diff

### Running /cross-boundary-audit

The `/cross-boundary-audit` skill walks the codebase and re-verifies registries:

```bash
/cross-boundary-audit
```

This produces an updated audit trail for each registry. Use this:
- After planning a large feature (to catch gaps before build)
- After a batch of PRs (to catch drift between code and registries)
- Before shipping a release (to confirm contracts are still honored)

Audit output flags:
- `✓` — producer and consumer both exist, shapes match
- `⚠ orphan producer` — written but never read
- `⚠ orphan consumer` — read but never written (most dangerous)
- `⚠ shape mismatch` — producer and consumer disagree on fields/types
- `⚠ misnamed` — same concept spelled differently (e.g., familyGroups vs family_groups)

---

## Common Gaps & How to Fix Them

### Orphan Producer
**Problem:** Code writes a value but nothing reads it.

**Fix:** Either remove the write, or add a consumer. If intentional (e.g., a feature flag set for future use), document it in the registry as `✓ (intentional, used by [future task])`.

### Orphan Consumer
**Problem:** Code reads/checks a value but nothing produces it.

**Danger:** Very high — usually a bug waiting to happen.

**Fix:** Add a producer, or remove the consumer. Check it's not expecting a field that was renamed or removed. If intentional (e.g., optional field with default), document it as `✓ (optional, default provided)`.

### Shape Mismatch
**Problem:** Producer writes `email` but consumer expects `user_email`.

**Fix:** Align the names. Update registries to show what changed. If renaming is too costly, add a transformation layer and document it in the registry entry.

### Misnamed
**Problem:** Same concept has different names in different places.

**Fix:** Pick a canonical name and rename all instances. Use registries to verify before/after (should go from N mismatched entries to 1 unified entry).

---

## This Project's Boundaries (as of task #1 planning)

The `/cross-boundary-audit` skill detected these boundary kinds for the mojo project:

| Kind | Count | Files |
|------|-------|-------|
| API Endpoints | 5 | `endpoints.md` |
| Environment Variables | 8 | `env-vars.md` |
| File Paths | 12 | `file-paths.md` |
| Stripe Integration | 7 | `stripe-config.md` |

**Total:** 32 cross-boundary names across 4 registry files.

These kinds were auto-detected by scanning code patterns. If new boundary kinds emerge (e.g., database migrations, message queue topics), new registries will be created.

---

## Tools & Integration

### VSCode Extension (Future)
Highlight cross-boundary names in the editor and link to their registry entry.

### Pre-commit Hook (Future)
Check that any modified cross-boundary names have corresponding registry updates.

### CI/CD Integration (Future)
Fail the build if a PR changes cross-boundary code without updating registries.

For now, these are manual: **include registry updates in every PR that touches a boundary**.

---

## Questions?

- **"Why is entry X marked ⚠?"** — See the entry's full description in the relevant registry file.
- **"How do I add a new boundary kind?"** — Run `/cross-boundary-audit` and it will detect new kinds automatically.
- **"Can I mark something as intentionally orphaned?"** — Yes, use status `✓ (intentional)` and explain in the entry.
- **"Should I update registries for internal refactors?"** — No, unless the refactor changes a cross-boundary name. Internal renames don't affect registries.

---

## Last Updated

**Audit Date:** 2026-05-24 (Task #1 planning)

**Audit Scope:** Pre-implementation audit of planned boundaries (code doesn't exist yet)

**Status:** Registries complete; 32 named boundaries identified; 7 gaps documented for build phase.
