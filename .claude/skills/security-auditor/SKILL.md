---
name: security-auditor
description: Perform a targeted security audit on API routes, server actions, or the full codebase — checking for auth gaps, injection vulnerabilities, XSS, data leakage, and OWASP Top 10 issues in the Next.js + MongoDB + Supabase stack. Trigger when the user says "security audit", "check for vulnerabilities", "security review", "is this secure", "audit my routes", or "audit security".
---

# Security Auditor

You are auditing the Canvas Classes Next.js 15 codebase for security issues.

**Read `CLAUDE.md §8` first.** That section is the canonical security rulebook for this project — it defines exactly which auth functions to use, how bodies must be validated, what error responses must look like, and which bypass patterns are forbidden. Violations of §8 are treated as bugs, not style issues.

## Output format

```
### Critical   — exploit today, fix immediately
### High       — significant risk, fix this sprint
### Medium     — should fix, lower urgency
### Low / Info — best-practice gap, worth noting
### Clean      — areas with no issues found
```

---

## Audit checklist

### Authentication (§8.1, §8.2, §8.3)
- [ ] Every `POST`/`PATCH`/`PUT`/`DELETE` under `/api/v2/` calls an auth guard before any DB operation
- [ ] Admin routes use `requireAdmin()` from `lib/bookAuth.ts` or `getAuthenticatedUser()` + `isAdmin()` from `lib/auth.ts`
- [ ] Student routes use `getAuthenticatedUser()` from `lib/auth.ts`
- [ ] Public GET routes have `// PUBLIC: no auth required` comment
- [ ] Auth logic is NOT redefined inline — always imported from `lib/auth.ts` or `lib/bookAuth.ts`
- [ ] `process.env.NODE_ENV === 'development'` is never used as an auth bypass (§8.3) — only `isLocalhostDev()`

### Input validation (§8.4)
- [ ] Every POST/PATCH body is validated with Zod schema OR an explicit field whitelist before reaching the DB
- [ ] Raw `body` is never passed directly to `$set` or any Mongoose update
- [ ] File upload filenames are sanitized (no `..`, `/`, `\`, special chars), size-limited, path-contained
- [ ] User-supplied redirect URLs pass through `sanitizeRedirect()` from `lib/redirectValidation.ts`
- [ ] `innerHTML` assignments use `DOMPurify.sanitize()` (see `MathRenderer.tsx` for the allowlist pattern)

### Error responses (§8.5)
- [ ] No `error.message`, `error.stack`, or exception strings returned to client
- [ ] Generic messages only: `"Failed to save question"`, `"Internal server error"`
- [ ] Full error logged server-side with `console.error()`

### Database safety (§8.6)
- [ ] No mass assignment — explicit field whitelist in every `$set`
- [ ] All `.find()` calls have `.limit()` — no unbounded queries
- [ ] `deleted_at: null` filter on every query that shouldn't return soft-deleted docs
- [ ] Writes to canonical field names only (never legacy aliases — CLAUDE.md §4.5)
- [ ] Inserts on unique-field collections (e.g. `display_id`) wrapped in E11000 retry loop

### Secrets & client exposure (§8.7)
- [ ] No secrets, API keys, or admin tokens in client-side code or response bodies
- [ ] `NEXT_PUBLIC_*` vars contain only Supabase URL + anon key — nothing else
- [ ] `.env.local` is in `.gitignore` and never committed

### SSRF / external requests (§8.8)
- [ ] Server-side fetches to user-supplied URLs validate hostname with strict `.endsWith()` against an allowlist
- [ ] Only HTTPS external URLs allowed

### Rate limiting (§8.9)
- [ ] In-memory rate limiters have TTL cleanup and hard entry cap (≤ 5000)
- [ ] Comment present noting Redis/Upstash should replace in-memory maps at scale

### Common patterns to flag
- `$set: req.body` — mass assignment, Critical
- `return NextResponse.json({ error: error.message })` — internal leak, High
- Auth check missing on write route — Critical
- `process.env.NODE_ENV === 'development'` for auth bypass — Critical (§8.3)
- Unbounded `.find()` without `.limit()` — Medium
- `import { getAuthenticatedUser } from './localHelper'` — auth defined locally, High

---

## Severity definitions

| Level | Examples |
|---|---|
| **Critical** | Auth bypass, secret exposure, mass assignment, NoSQL injection, remote code execution |
| **High** | XSS, missing auth on write route, stack trace in response, SSRF |
| **Medium** | Missing rate limit, generic error without server-side logging, unbounded query |
| **Low** | Missing `// PUBLIC:` comment on legitimate public route, minor best-practice gap |

---

## Monorepo migration audit (only when diff touches `apps/*` or `packages/*`)

Fire this section in addition to the main checklist when the change is part of the canvas → monorepo migration tracked in `_agents/MONOREPO_MIGRATION_PLAN.md`.

### Auth gate preservation
- [ ] After a route moves between apps/packages, the auth guard still runs FIRST in the handler — no path where the move accidentally dropped the `getAuthenticatedUser()` / `requireAdmin()` call
- [ ] If a route's auth helper was inlined before extraction, it now imports from the shared auth module — no orphaned inline `getUserId` / `isAdmin` left behind
- [ ] Admin app's mutating routes call admin-auth-specific guard (Phase 5+) — not the student `getAuthenticatedUser()` which only verifies Supabase tokens
- [ ] Public GET routes that were public BEFORE the move are STILL public after (and still have the `// PUBLIC: no auth required` comment); auth wasn't accidentally added or removed

### Env-var leakage
- [ ] No server-only env var (`MONGODB_URI`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_JWT_SECRET`, R2 secrets, Sentry DSNs that aren't `NEXT_PUBLIC_*`) appears in any `packages/*` file unless the file is server-only (no `'use client'`, no client-bundle entrypoint)
- [ ] No `process.env.*` reference appears in client components shipped from `packages/ui/` — packages must not bake env vars into the client bundle
- [ ] `NEXT_PUBLIC_*` env vars are still scoped to Supabase URL + anon key only — no admin secrets accidentally promoted to `NEXT_PUBLIC_*` to "make them work in admin app"

### Rate-limit wiring
- [ ] Every public/mutating route in the diff is rate-limited via `@canvas/core/rate-limit` (or the equivalent at the time of the phase)
- [ ] If a route moved into `apps/admin/`, it has its OWN limiter instance (separate budget from student app's limiter — different `createRateLimiter()` call)
- [ ] No two routes share the same limiter Map unintentionally — limiters created at module scope are per-route by design

### Cross-app import-direction enforcement
- [ ] `apps/admin/` does not import from `apps/student/` (any path, any alias)
- [ ] `apps/student/` does not import from `apps/admin/` (any path, any alias)
- [ ] If shared code is needed between apps, it lives in `packages/*` — never copied between apps

### Package surface = attack surface
- [ ] When a function moves from `apps/student/lib/...` into `packages/*`, audit the function as if it's now PUBLIC API — even if only one app calls it today, the package contract makes it broadly reachable
- [ ] Functions that accept user input (request bodies, query params, raw strings) MUST validate at the package boundary — the package can't assume the caller did it
- [ ] If the package exports a function that touches the DB, it must enforce its own field whitelist — caller can't be trusted to do mass-assignment prevention

### Admin auth (Phase 5+)
- [ ] `admin_accounts` records use bcrypt for password hashes (cost factor ≥ 10) — never plain text, never SHA without salt
- [ ] Admin JWT signing secret is loaded from env (`ADMIN_JWT_SECRET`), never hardcoded
- [ ] Admin session cookie is `HttpOnly`, `Secure` (production), `SameSite=Lax` or stricter
- [ ] Login endpoint has rate limiting per IP AND per email (separate budgets) — brute force on a known admin email must be slowed independently
- [ ] No path resolves to admin routes without a valid admin JWT — verify by curl with no cookie → 401

### Plan doc + decision log
- [ ] If this diff completes a phase, `_agents/MONOREPO_MIGRATION_PLAN.md` is updated in the same commit (status, commit hash)
- [ ] If this diff implements a previously-`[TBD]` decision, the answer is recorded under "Decision log" — not left implicit in the code

### Common monorepo security anti-patterns to flag

| Pattern | Severity |
|---|---|
| Auth guard removed during route relocation (intentionally or not) | Critical |
| Server-only env var imported into a `packages/ui/` client component | Critical |
| `NEXT_PUBLIC_*` env var contains an admin token / service-role key | Critical |
| Admin route in `apps/admin/` missing admin-auth guard | Critical |
| Inline `getUserId` reappearing in a moved route | High |
| Rate-limiter Map shared between admin + student routes (e.g. via package singleton) | High |
| Cross-app import (`apps/admin → apps/student` or vice versa) | High |
| Function moved to a package but no input validation at the new boundary | High |
| Admin password stored without bcrypt | Critical |
| Admin JWT secret hardcoded | Critical |
| Admin cookie missing `HttpOnly` or `Secure` flag | High |
