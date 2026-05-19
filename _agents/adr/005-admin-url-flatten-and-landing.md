# ADR-005: Flatten admin URLs and introduce the admin home landing

**Status:** Accepted
**Date:** 2026-05-17
**Tags:** admin, urls, ux, deployment

## Context

After Phase 5 shipped, the admin app's URL tree looked like this:

```
admin.canvasclasses.in/
├── /admin                       ← Crucible question editor (the main one)
├── /admin/flashcards
├── /admin/blog
├── /admin/books                 ← placeholder
├── /admin/taxonomy
├── /admin/career-explorer
├── /dashboard
├── /preview
└── /login
```

Three things were off:

1. **The `/admin/` prefix was redundant.** The whole subdomain
   (`admin.canvasclasses.in`) is already the admin app. Nesting under
   `/admin/` repeats the namespace twice.
2. **The Crucible editor was nameless.** It lived at bare `/admin`,
   making it indistinguishable from "the admin app's home page." There
   was no real home page — `/admin` *was* the home, and it also *was*
   Crucible. Operators new to the platform couldn't form a mental model
   of "I'm in Crucible right now."
3. **There was no panel-discovery surface.** Users had to know URLs
   ahead of time. Sibling panels (flashcards, blog, etc.) had no
   cross-links from each other or from the root.

## Decision

**Rename `/admin` → `/crucible`, flatten the subroutes to live at
top-level, and add a new card-grid landing at `/`.**

URL changes (file moves preserved via `git mv`):

| Before | After |
|---|---|
| `/admin` | `/crucible` |
| `/admin/flashcards` | `/flashcards` |
| `/admin/blog` | `/blog` |
| `/admin/books` | `/books` |
| `/admin/taxonomy` | `/taxonomy` |
| `/admin/career-explorer/*` | `/career-explorer/*` |

The new `apps/admin/app/page.tsx` is a server component rendering a
card grid with three sections:

1. **Content panels** — Crucible, Flashcards, Books, Blog, Taxonomy,
   Career Explorer. Production-write surfaces.
2. **Operator tools** — Dashboard, Preview. Read-only operator views.
3. **Developer tools** — Cross-origin link to the Organic Chemistry Hub
   reactions editor on the student site. The dev-tool section is
   visually distinct so it can't be mistaken for a production panel.

The OCH reactions editor stays on the student app (`canvasclasses.in/
organic-chemistry-hub/admin`) — moving it into the admin app would
require detaching it from the static `data.ts` it sits next to and
porting OCH data to MongoDB, which is out of scope. The landing tile
opens it in a new tab.

## Consequences

**Wins**
- URLs read cleanly: `admin.canvasclasses.in/crucible`, not
  `admin.canvasclasses.in/admin/admin/page` (which is what the file
  path looked like).
- Operators have a discoverable home. New admins land on `/`, see
  every panel, and click through.
- No redirect indirection — flat URLs are what they say they are.
- Aligns with how `/dashboard` and `/preview` already existed at the
  top level. Consistency.
- Each subroute file move is detected by `git mv` so blame history
  follows the code.

**Costs**
- Bookmarks pointing at `/admin/...` URLs break after deploy. The
  middleware doesn't issue redirects for the old paths — those URLs
  404. Acceptable cost: the admin app has ~10 active users, all of
  whom can update their bookmarks.
- The `apps/admin/app/admin/` folder no longer exists. Anyone with a
  mental model of "admin code = `/admin/` URL" has to re-learn that
  the subdomain *is* the admin namespace.
- One internal hook (`useAdminFilterUrlSync`) had a hardcoded `/admin`
  fallback URL; updated to `/crucible`. Two login-redirect strings
  (`/login?next=/admin`) inside Crucible's data-load error handler
  updated to `/login?next=/crucible`.

**Non-issues**
- Middleware behavior is unchanged: it still gates every path except
  `/login`, `/api/auth/*`, and `/_next/*`. The login redirect default
  was already `/` (not `/admin`), so flattening doesn't change the
  post-login experience.
- API routes under `/api/v2/*` are untouched — the rename only affects
  UI page routes.

## Alternatives considered

- **Keep `/admin/*` nesting, just rename `/admin` → `/admin/crucible`.**
  Rejected: keeps the redundant prefix. The whole subdomain is the
  admin app — nesting under `/admin/` adds nothing.
- **Move OCH admin into the admin app.** Rejected for scope: requires
  porting OCH data from a static `.ts` file to MongoDB, plus moving
  the simulator's data dependencies. The OCH "admin" is a local-dev
  tool (production writes return 403), not a real admin panel — see
  [ADR-006](./006-och-admin-classification.md) for the long-form
  rationale. Cross-origin link from the landing is enough for now.
- **Sidebar-based landing instead of card grid.** Rejected: persistent
  sidebar needs a layout-level change and state passing across all
  routes. The card-grid landing is one self-contained page, no
  cross-route coupling.
- **301 redirects from old `/admin/*` to new flat URLs.** Rejected:
  the admin app has a tiny user base, redirect maintenance cost
  outweighs the bookmark-preservation benefit, and Next.js redirects
  add a request hop. If a user does land on `/admin/...`, the 404 is
  recoverable in one click via the landing.

## Links

- Code: `apps/admin/app/page.tsx` (new landing), `apps/admin/app/crucible/page.tsx` (Crucible editor), other `apps/admin/app/<panel>/` folders
- Commit: TBD on `code-refactor`
- Related: [ADR-002](./002-admin-app-split.md) (which created the URL structure this revises)
