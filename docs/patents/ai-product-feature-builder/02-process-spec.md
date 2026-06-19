# Process Specification

## Actors

- Requester: The customer, user, or client who submits the product or feature request.
- Mojo/provider reviewer: The person or role that approves whether Mojo should proceed.
- Technical reviewer: The person or role that reviews build plans, generated artifacts, validation output, and release readiness.
- AI planner: The AI component that converts requests into overview and detailed plans.
- AI builder: The AI component that creates software artifacts.
- Validation system: The automated build, test, scan, and preview environment.
- Release system: The system that deploys approved outputs.

## Stage 1: Request Intake

The requester submits a natural-language request through a product interface or Mojo request interface.

Inputs may include:

- Plain-language description.
- Product or business objective.
- Existing product context.
- Screenshots or examples.
- Desired users.
- Constraints.
- Deadline or urgency.

System outputs:

- Request record.
- Requester identity.
- Product or tenant context.
- Timestamp.
- Request classification candidates.

## Stage 2: Request Classification

The system classifies the request as one or more of the following:

- Existing product feature request.
- New product request.
- Product modification.
- Integration request.
- Bug or support issue.
- Out-of-scope request.

If the request is ambiguous, the AI planner asks clarifying questions before moving to the overview stage.

## Stage 3: Overview Plan Generation

The AI planner generates an overview plan that is understandable to a non-technical requester.

For a feature request, the overview plan may include:

- Feature name.
- Problem solved.
- User workflow.
- Affected product areas.
- Expected behavior.
- Known assumptions.
- Exclusions.

For a new product request, the overview plan may include:

- Product summary.
- Target users.
- Core workflows.
- Primary screens.
- Data entities.
- Required integrations.
- Permissions.
- Minimal viable scope.
- Future scope.

## Stage 4: Requester Approval

The requester reviews the overview plan.

Possible outcomes:

- Approve.
- Request changes.
- Reject.
- Pause.

Only approved overview plans move to provider approval.

The system records:

- Approved overview version.
- Requester identity.
- Approval timestamp.
- Comments or changes.

## Stage 5: Mojo/Provider Approval

The approved overview plan is routed to Mojo/provider review.

The provider reviewer may evaluate:

- Business fit.
- Customer authorization.
- Pricing or contract status.
- Technical feasibility.
- Security and compliance exposure.
- Product roadmap alignment.
- Whether the output should be reusable.
- Whether the build should be manual, AI-assisted, or rejected.

Possible outcomes:

- Approve for detailed planning.
- Approve with constraints.
- Request clarification.
- Reject.
- Quote or price before proceeding.

## Stage 6: Detailed Implementation Plan

After provider approval, the AI planner generates a detailed implementation plan.

Possible outputs:

- User stories.
- Acceptance criteria.
- Technical architecture.
- Database changes.
- API changes.
- UI/component changes.
- Permissions model.
- Integration plan.
- Test plan.
- Deployment plan.
- Rollback plan.
- Risk rating.

The technical reviewer may approve or modify the detailed plan before build execution.

## Stage 7: Controlled AI Build

The AI builder creates implementation artifacts in a controlled environment.

Controls may include:

- Isolated branch or workspace.
- Product-specific context boundaries.
- Tenant/customer-specific constraints.
- Repository access restrictions.
- Allowed file scopes.
- Dependency controls.
- Audit logging.

Possible artifacts:

- Source code.
- Database migrations.
- Configuration.
- Tests.
- Documentation.
- Review notes.
- Pull request or equivalent change package.

## Stage 8: Automated Validation

The validation system checks the generated artifacts.

Possible checks:

- Build success.
- Unit tests.
- Integration tests.
- End-to-end tests.
- Linting.
- Type checking.
- Security scanning.
- Policy checks.
- UI preview checks.
- Regression comparison.
- Acceptance criteria evaluation.

Validation output is attached to the approval package.

## Stage 9: Human Review Package

The system assembles a review package.

The package may contain:

- Original request.
- Approved overview plan.
- Provider approval record.
- Detailed implementation plan.
- Generated artifact summary.
- Code diff.
- Screenshots or previews.
- Test results.
- Risk rating.
- Deployment target.
- Rollback instructions.

## Stage 10: Release Approval

A human reviewer decides whether the generated work may be released.

Possible outcomes:

- Approve deployment.
- Request changes.
- Reject.
- Approve for limited beta.
- Approve for customer-specific release.
- Approve for product-wide release.

## Stage 11: Deployment

The release system deploys the approved output according to the approved scope.

Deployment scopes may include:

- One customer.
- One tenant.
- A product beta.
- A single product.
- Multiple Mojo products.
- A reusable module library.
- A marketplace listing.

## Stage 12: Audit Record

The system retains an audit record.

The record may include:

- Request versions.
- Plan versions.
- Approval events.
- AI-generated artifacts.
- Human modifications.
- Validation results.
- Deployment scope.
- Release timestamp.
- Reviewer identities.
