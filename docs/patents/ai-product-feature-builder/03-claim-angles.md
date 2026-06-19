# Claim Angles

## Primary Claim Direction

A computer-implemented method for generating software products and software product features from user requests using a multi-stage approval process.

## Draft Independent Claim Skeleton

A computer-implemented method comprising:

1. receiving, through a software interface, a natural-language request associated with a software product or proposed software product;
2. classifying the request as a new product request or an existing-product feature request;
3. generating, by an artificial intelligence system, an overview plan based on the request;
4. receiving approval of the overview plan from a requester;
5. routing the approved overview plan to a provider approval system;
6. receiving provider approval for detailed planning or implementation;
7. generating, by the artificial intelligence system, a detailed implementation plan based on the approved overview plan;
8. generating one or more software artifacts based on the detailed implementation plan;
9. validating the one or more software artifacts in an isolated environment;
10. generating a human-reviewable approval package comprising validation results and a proposed deployment scope; and
11. releasing the software product or feature only after a release approval gate is satisfied.

## Important Novelty Themes

- Two request modes in one system: new product and existing-product feature.
- Overview-stage approval by the requester before provider review.
- Provider-side approval before detailed technical planning or build.
- Detailed plan generated only after an approved overview and provider gate.
- AI build constrained by product, tenant, customer, or module context.
- Human-reviewable package combining request, plans, generated artifacts, tests, risk, and deployment scope.
- Deployment scoped to customer, tenant, product, beta group, module, marketplace, or all users.

## Dependent Claim Ideas

### Request Classification

The method further comprises determining whether the request is:

- a new software product request;
- an existing-product feature request;
- an integration request;
- a support request;
- a bug report;
- or an out-of-scope request.

### Clarifying Questions

The method further comprises generating clarifying questions when the request does not satisfy one or more completeness thresholds.

### Overview Plan

The overview plan may include:

- intended users;
- product or feature purpose;
- workflows;
- screens;
- data objects;
- integrations;
- permissions;
- assumptions;
- exclusions;
- rough complexity.

### Requester Approval

The requester approval may include approving, editing, rejecting, or requesting revision of the overview plan.

### Provider Approval

The provider approval system may evaluate:

- business fit;
- pricing;
- customer eligibility;
- technical feasibility;
- security risk;
- compliance risk;
- roadmap alignment;
- reusable module potential.

### Detailed Implementation Plan

The detailed implementation plan may include:

- user stories;
- acceptance criteria;
- database schema;
- API definitions;
- UI components;
- test cases;
- deployment plan;
- rollback plan.

### Controlled Build

The software artifacts may be generated in:

- an isolated workspace;
- a branch;
- a sandbox;
- a container;
- a tenant-limited environment;
- a restricted repository context.

### Validation

Validation may include:

- compilation;
- unit tests;
- integration tests;
- UI tests;
- security checks;
- policy checks;
- regression checks;
- acceptance-criteria evaluation.

### Review Package

The approval package may include:

- the original request;
- approved overview plan;
- provider approval record;
- detailed implementation plan;
- generated code summary;
- code differences;
- test results;
- screenshots;
- live preview;
- risk score;
- release scope.

### Deployment Scope

The release gate may authorize deployment to:

- a single customer;
- a single tenant;
- a beta group;
- a product module;
- a product marketplace;
- all users of a product;
- multiple products.

## Claim Framing To Avoid

Avoid making the invention sound like these broad, crowded ideas:

- AI writes code from natural language.
- A user requests a feature.
- A system generates software requirements.
- A system tests generated code.
- A human approves code.

Those elements can be part of the claim, but the invention should be framed as the specific staged workflow and approval-controlled product generation lifecycle.
