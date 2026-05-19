# ADR-006: Organic Chemistry Hub admin stays in the student app as a dev tool

**Status:** Accepted
**Date:** 2026-05-17
**Tags:** admin, organic-chemistry-hub, dev-tools, scope

## Context

The Organic Chemistry Hub (`apps/student/app/organic-chemistry-hub/`)
includes a sub-route at `/organic-chemistry-hub/admin/` with what looks
like an admin panel — a form for editing named reactions, an SVG drop
zone, an audio recorder. After Phase 5's admin-app split, the question
naturally arose: should this admin move into `apps/admin/` alongside the
Crucible / flashcards / blog / etc. panels?

Three things make OCH admin categorically different from the rest:

1. **Production writes are hard-blocked.**
   `apps/student/app/api/organic/reactions/route.ts:23-28` returns 403
   for any POST when `NODE_ENV === 'production'`. The admin can read
   reactions in prod but can't save changes. It's not a runtime tool;
   it's a local-dev convenience UI.

2. **There is no auth check.** No `getAuthenticatedUser`, no
   `ADMIN_EMAILS`, no `requireAdmin`. The NODE_ENV gate is the entire
   access control. For a Crucible-class admin this would be a §8.3
   violation; for a "edit a file on your laptop" tool the production
   hard-block makes it acceptable.

3. **Its data is checked into the repo.** The admin writes to
   `app/organic-master/reactions.json` (a file shipped with the
   student bundle). Operators don't use this — developers do, and they
   commit the change to git. The "database" is the working tree.

## Decision

**The OCH reactions admin stays at `apps/student/app/organic-chemistry-hub/admin/` and is classified as a developer tool, not a production admin panel.**

The admin home landing at `admin.canvasclasses.in/` (see
[ADR-005](./005-admin-url-flatten-and-landing.md)) includes a tile for
it under a clearly-labeled "Developer tools" section that cross-links
to the student origin in a new tab.

Implications:

- It does NOT live in `apps/admin/`.
- It does NOT use Supabase auth or `ADMIN_EMAILS`.
- The NODE_ENV-only production block is acceptable because production
  cannot write — it's not enforcing access, it's enforcing read-only.
- The OCH simulator's data (`data.ts`, `reactions.json`) stays bundled
  with the simulator code.

## Consequences

**Wins**
- Zero scope addition to Phase 5. OCH stayed where it was.
- The "admin app = production-write surface" mental model is
  preserved. Operators training on the admin app don't have to learn
  exceptions.
- OCH simulator + its dev admin stay co-located, so a developer
  editing reactions sees the simulator code next door.

**Costs**
- The landing tile lives in a separate "Developer tools" section,
  which means the admin home isn't a single uniform grid. Visually
  intentional — a real admin shouldn't blend in with a dev tool.
- "Admin" now means two different things in the codebase: production
  operator panels (in `apps/admin/`) vs developer tools (the OCH
  reactions editor). The README in `apps/admin/` and ADR-005 explain
  the distinction.

## What would trigger reclassification (i.e., promoting OCH admin to a real admin)

If any of the following becomes true, this ADR is up for revision and
the admin should be migrated into `apps/admin/`:

1. Non-developer operators need to edit reactions in production.
2. OCH reactions move from a checked-in JSON file to a real MongoDB
   collection.
3. The reaction dataset grows large enough that "edit and commit" is
   no longer practical.

Until then, dev-tool classification is the right scope match.

## Alternatives considered

- **Move OCH admin into `apps/admin/`.** Rejected: requires porting
  reactions data to MongoDB, adding auth, deleting the NODE_ENV
  guard, and detaching the admin UI from the simulator's static data
  files. Substantial scope for no current user-facing benefit.
- **Delete the OCH admin entirely; edit `reactions.json` by hand.**
  Rejected: the admin UI is genuinely useful for the developers who do
  edit it — adding a new named reaction by hand is error-prone.
- **Omit OCH from the admin home landing.** Rejected: discoverability
  matters. Users looking for "the admin for OCH" should find it from
  the same place they find every other admin. The "Developer tools"
  section flags it correctly without hiding it.

## Links

- Code: `apps/student/app/organic-chemistry-hub/admin/`, `apps/student/app/api/organic/reactions/route.ts`
- Related: [ADR-005](./005-admin-url-flatten-and-landing.md), [ADR-002](./002-admin-app-split.md)
