# @canvas/core

Cross-cutting platform utilities shared between `apps/student` (today) and
`apps/admin` (Phase 5). Leaf-status: depends only on externals (AWS SDK,
clsx, mixpanel, tailwind-merge, server-only) and the host app's
`@supabase/supabase-js` + `next`. Never imports from `@canvas/data`,
`@canvas/persona`, `@canvas/ui`, or `apps/*`.

## Layout

| File / Folder | What lives here |
|---|---|
| `rate-limit.ts` | `createRateLimiter` factory + `getClientIp` — in-memory token bucket with TTL cleanup. CLAUDE.md §8.9 notes Redis-backed replacement is expected at scale. |
| `latex-validator.ts` | `validateLaTeX`, `autoFixLatex`, `getLatexSuggestions`, `extractLatexExpressions` — pure functions over LaTeX strings. |
| `redirect-validation.ts` | `isValidRedirect`, `sanitizeRedirect` — SSRF guards for user-supplied redirect URLs (CLAUDE.md §8.4 + §8.8). |
| `r2-storage.ts` | Cloudflare R2 client + upload/sign/delete helpers. Reads env vars at module init. |
| `utils.ts` | `cn()` — class-name merger (clsx + tailwind-merge). |
| `analytics/mixpanel.server.ts` | Server-side Mixpanel wrapper. `server-only` import enforces this never reaches the client bundle. |
| `analytics/mixpanel.ts` | Browser Mixpanel wrapper. |
| `analytics/sanitize.ts` | PII-key denylist for analytics props. |
| `analytics/serverConsent.ts` | Reads server-side analytics consent from Supabase. |

## Public surface

Subpath imports are the primary pattern:

```ts
import { createRateLimiter } from '@canvas/core/rate-limit';
import { sanitizeRedirect }  from '@canvas/core/redirect-validation';
import { track }             from '@canvas/core/analytics/mixpanel';
```

The barrel (`@canvas/core`) re-exports the most-touched symbols.

## Rules

- **No `@/` alias inside this package.** Internal imports relative.
- **No imports from `apps/*` or sibling packages.** Leaf-status enforced.
- **Server-only modules** must `import 'server-only'` so the Next.js
  bundler blocks accidental client-side import.
- **Env-vars** (R2 credentials, MIXPANEL tokens) are read at module init
  inside the package. The package never needs to know which app it's
  running in.
- Consumed as TS source — Next.js compiles via `transpilePackages: ['@canvas/core']`.
