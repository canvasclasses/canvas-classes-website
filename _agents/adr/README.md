# Architecture Decision Records

Short records of the load-bearing architectural decisions made during the
canvas → monorepo migration (2026-05) and the admin-app split.

ADRs are append-only and immutable once committed. If a decision is reversed,
write a new ADR that supersedes the old one — don't edit history. Each ADR
links from / to any predecessor.

## Index

| # | Title | Status | Date |
|---|---|---|---|
| [001](./001-service-layer-di-pattern.md) | Service-layer DI pattern for shared route handlers | Accepted | 2026-05-16 |
| [002](./002-admin-app-split.md) | Split admin into its own Next.js app (same-origin API) | Accepted | 2026-05-15 |
| [003](./003-admin-auth-shape-a-first.md) | Ship admin auth as Shape A; defer Shape B | Accepted | 2026-05-15 |
| [004](./004-package-boundary-rules.md) | `@canvas/*` package boundary rules | Accepted | 2026-05-16 |
| [005](./005-admin-url-flatten-and-landing.md) | Flatten admin URLs and introduce the admin home landing | Accepted | 2026-05-17 |
| [006](./006-och-admin-classification.md) | Organic Chemistry Hub admin stays in the student app as a dev tool | Accepted | 2026-05-17 |
| [007](./007-books-editor-migration.md) | Live Books editor moves to apps/admin via a shared renderer package | Accepted | 2026-05-20 |
| [008](./008-biology-subject-addition.md) | Add Biology as a first-class subject (NEET-UG track) | Accepted | 2026-05-20 |

## When to write a new ADR

- A decision will affect multiple files or change a non-obvious tradeoff
- Future maintainers will ask "why is it like this?"
- The decision has runtime, security, or build-time consequences
- A decision rejects a tempting alternative (record what was rejected and why)

If a decision is a one-off implementation detail with no broader pull, don't
write an ADR — comment the code and move on.

## Template

```markdown
# ADR-NNN: Short Imperative Title

**Status:** Proposed | Accepted | Superseded by [#NNN](./NNN-...)
**Date:** YYYY-MM-DD
**Tags:** comma, separated

## Context
What forces are in play? What problem are we solving? What did the previous
state look like, and why is it no longer adequate?

## Decision
The decision itself, in one short paragraph. Imperative voice.

## Consequences
What follows — both wins and costs. Be honest about the tradeoffs.

## Alternatives considered
What did we reject, and why?

## Links
- Code: paths to the canonical files
- Migration plan: ref to the relevant phase if applicable
```
