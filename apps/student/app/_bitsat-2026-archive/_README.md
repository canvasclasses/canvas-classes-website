# BITSAT 2026 Archive

This folder contains the full 30-day BITSAT 2026 Chemistry revision plan
that ran during the May 2026 exam window. It's kept in-tree so the work
can be refreshed and republished for **BITSAT 2027** without rebuilding
from scratch.

## Why this folder is `_`-prefixed

Next.js App Router treats any folder whose name starts with `_` as
non-routing — files inside are excluded from the URL surface. That's
why the live URL `/bitsat-chemistry-revision` 404s today: the route
folder was renamed `_bitsat-2026-archive`. The same applies to the
sibling `app/api/_bitsat-plan-2026-archive/` folder.

The trade-off: deep links from external sites (Google Search, shared
social posts) will 404 instead of seeing the old page. That's the right
SEO signal — the page is gone. The previous interim state (kept live +
noindex) accomplished the same goal more slowly. If you want a 301
redirect to a tombstone page instead of a 404, add one in
`apps/student/next.config.ts`.

## What's in here

| File / folder | Purpose |
|---|---|
| `page.tsx` | Landing page that showed when `/bitsat-chemistry-revision` was live |
| `BitsatLandingClient.tsx` | Client component for the landing |
| `BitsatBanner.tsx` | The global banner that previously rendered in `app/layout.tsx` on `/` and the landing page |
| `usePlanProgress.ts` | Hook reading per-user plan progress (was wired to `/api/bitsat-plan/progress` — also archived) |
| `planTypes.ts` | Type definitions for the plan |
| `plan/` | The 30-day plan itself — day routes, content, sidebar, planData.ts |
| `plan/day/[n]/page.tsx` | Individual day pages |
| `plan/planData.ts` | Day-by-day plan content (the editorial substance) |

## Revival checklist (when BITSAT 2027 ships)

1. **Refresh content**
   - Update `plan/planData.ts` with the 2027 syllabus + dates
   - Update any stat references in `page.tsx` and `BitsatLandingClient.tsx`
   - Update the `metadata` in `page.tsx`:
     - title from "BITSAT 2026 Chemistry Revision (archive)" → 2027
     - remove the `robots: { index: false, follow: true }` override
     - refresh `description` + `keywords`
     - openGraph fields too

2. **Re-activate the route folders**
   ```bash
   git mv apps/student/app/_bitsat-2026-archive apps/student/app/bitsat-chemistry-revision
   git mv apps/student/app/api/_bitsat-plan-2026-archive apps/student/app/api/bitsat-plan
   ```

3. **Move BitsatBanner back to its home**
   ```bash
   git mv apps/student/app/bitsat-chemistry-revision/BitsatBanner.tsx \
          apps/student/features/landing/components/BitsatBanner.tsx
   ```
   Then update its imports back to the alias form:
   ```ts
   import { usePlanProgress } from '@/app/bitsat-chemistry-revision/usePlanProgress';
   import { dayByNumber } from '@/app/bitsat-chemistry-revision/plan/planData';
   ```

4. **Re-wire `app/layout.tsx`** — restore the `BitsatBanner` import and the
   `<BitsatBanner />` JSX between `<Navbar>` and `{children}`. Look for the
   "BitsatBanner removed 2026-06" breadcrumb comment.

5. **Restore the navbar/footer hide-rules** — see the matching
   "BITSAT 2026 plan hide-rule removed 2026-06" breadcrumbs in
   `app/components/Navbar.tsx` and `app/components/ConditionalFooter.tsx`.

6. **Re-feature in the Study Lab menu** — `Navbar.tsx`'s `studyLabMenu.featured`
   currently points to the Interactive Periodic Table. The original BITSAT
   2026 featured slot is documented in the comment block above that field.

7. **Re-add to `sitemap.ts`** — the `staticPages` array; group with the other
   exam-prep pages.

8. **Re-add to `llms.txt`, `llms-full.txt`** — under "Video Lectures" /
   "Exam-Specific Courses" respectively.

9. **Update `features/public-content/index.ts` + `README.md`** to bump the
   route count back from 12 to 13 and remove the archive note.

## Why not just delete it?

The plan content (`planData.ts`, day-by-day notes, the styling, the
landing copy) represents a few weeks of editorial work. Deleting it
means rebuilding from scratch when BITSAT 2027 is in scope; keeping it
in `_*` means a half-day refresh instead.
