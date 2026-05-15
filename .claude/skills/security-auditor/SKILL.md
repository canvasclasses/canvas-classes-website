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
