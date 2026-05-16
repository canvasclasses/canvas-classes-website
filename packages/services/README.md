# @canvas/services

Server-side route-handler logic shared between `apps/student/` and `apps/admin/`.

## Why this exists

After Phase 5, nine `/api/v2/*` route handlers existed as byte-for-byte
duplicates in both apps (modulo a `@/lib/bookAuth` → `@/lib/adminAuth`
import rewrite). The lockstep-change requirement was real maintenance tax.

This package owns the handler logic; each app's `app/api/v2/<route>/route.ts`
becomes an ~8-line wrapper that imports the service function and passes the
app-local auth helpers.

## Auth via dependency injection

Service functions take a `deps` argument with the auth helpers each app
already exposes. Both apps' auth helpers are identical implementations
(student's `lib/auth.ts` is the source; admin's is a verbatim port); they
stay per-app for boundary-of-responsibility reasons (admin auth can evolve
independently in a future Shape B migration).

```ts
import type { ServiceDeps } from '@canvas/services/types';
import { GET as svcGET, POST as svcPOST } from '@canvas/services/questions';

// In each app's route.ts:
const deps: ServiceDeps = { getAuthenticatedUser, isAdmin, hasScriptSecret, isLocalhostDev };
export const GET = (req: NextRequest) => svcGET(req, deps);
export const POST = (req: NextRequest) => svcPOST(req, deps);
```

Each service file exports `GET` / `POST` / `PATCH` / `DELETE` named after the
HTTP method it implements — same names as Next.js expects in `route.ts`. Alias
them at the import site (above) to avoid colliding with the wrapper's exports.

## Layout

Flat — one service file per route file in the apps. The 1:1 mapping makes
audits trivial.

| Service module | Replaces |
|---|---|
| `chapters.ts` | `/api/v2/chapters/route.ts` (GET) |
| `taxonomy-load.ts` | `/api/v2/taxonomy/load/route.ts` (GET) |
| `assets-by-id.ts` | `/api/v2/assets/[id]/route.ts` (DELETE) |
| `assets-upload.ts` | `/api/v2/assets/upload/route.ts` (POST) |
| `export-ppt.ts` | `/api/v2/export/ppt/route.ts` (POST) |
| `questions.ts` | `/api/v2/questions/route.ts` (GET + POST) |
| `questions-by-id.ts` | `/api/v2/questions/[id]/route.ts` (GET + PATCH + DELETE) |
| `flashcards.ts` | `/api/v2/flashcards/route.ts` (GET + POST) |
| `flashcards-by-id.ts` | `/api/v2/flashcards/[id]/route.ts` (GET + PATCH + DELETE) |

## Package boundaries

- Imports `@canvas/data/*` freely (Mongoose models, taxonomy, schemas, rbac)
- Imports `@canvas/core/*` for rate limiting, R2, etc.
- Never imports `apps/*`
- Never uses the `@/` alias
