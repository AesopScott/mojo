# Cross-Boundary Registries

This directory contains registries of every cross-boundary contract in the Mojo project. A **boundary** is anywhere two pieces of code, config, or infrastructure refer to the same name independently and can disagree.

Examples:
- A REST API endpoint defined in server code and called from client code
- An environment variable set on the server and consumed in PHP
- A Polar product ID set in JS data and consumed by the checkout embed
- A Firestore collection written by a Cloud Function and protected by rules

These registries are the **source of truth** for these contracts. Every PR that touches a cross-boundary name must update the relevant registry in the same commit.

---

## Registry Files

| File | What it covers |
|------|----------------|
| **`endpoints.md`** | HTTP endpoints served by PHP and Firebase Cloud Functions |
| **`collections.md`** | Firestore collections — schema, rules, indexes |
| **`env-vars.md`** | Environment variables consumed in PHP and Firebase functions |
| **`polar-products.md`** | Polar.sh product IDs — from `mockups.js` through to checkout overlay |
| **`form-fields.md`** | Development brief form field names — HTML → JS → PHP contract |

---

## Why Registries Matter

Without registries:
- A producer and consumer can disagree silently (one writes `projectName`, the other expects `project_name`)
- An env var can be consumed but never set (orphan consumer — the hardest failure to debug)
- A Polar product ID can be changed in one place and not the other

With registries:
- Every producer/consumer pair is visible in one place
- PRs are reviewed against the contract (not just code style)
- Gaps are caught before they reach production
- New contributors understand the architecture at a glance

---

## How to Maintain Registries

### Adding a cross-boundary name

1. Identify the boundary kind: endpoint, env var, Firestore collection, etc.
2. Add an entry to the relevant registry file
3. Document producer(s) and consumer(s) with real `file:line` references
4. Set status: `✓` (healthy), `⚠ orphan producer/consumer`, `⚠ shape mismatch`
5. Commit the registry change in the same commit as the code change

### Updating an entry

If a cross-boundary name changes (renamed, moved, interface changes):
1. Update the registry entry with new `file:line` locations
2. Update the status if applicable
3. Commit: `docs: update [kind] registry — [name] changed`

### Removing an entry

1. Verify both producer and consumer code are removed
2. Remove the entry from the registry
3. Commit: `docs: remove [kind] registry entry — [name]`

---

## PR Review Checklist

Before merging any PR that touches a cross-boundary name, verify:

- [ ] Code change is in the PR
- [ ] Registry update is in the same commit
- [ ] Producer/consumer references are real `file:line` citations
- [ ] Status reflects the actual health of the boundary
- [ ] Any ⚠ gap is explained in the PR description

---

## Running /cross-boundary-audit

The `/cross-boundary-audit` skill re-verifies all registries against the code:

```
/cross-boundary-audit
```

Run it:
- After planning a large feature (catch gaps before build)
- After a batch of PRs (catch drift between code and registries)
- Before shipping (confirm contracts are still honored)

---

## This Project's Boundaries (as of 2026-05-28)

| Kind | Names | File |
|------|-------|------|
| API Endpoints | 2 | `endpoints.md` |
| Firestore Collections | 2 | `collections.md` |
| Environment Variables | 7 | `env-vars.md` |
| Polar Product IDs | 6 | `polar-products.md` |
| Brief Form Fields | 8 | `form-fields.md` |

**Total:** 25 cross-boundary names across 5 registry files.

**Last full audit:** 2026-05-28 — all registries verified against current code.
