# Security Audit Report — Canvas Classes

**Date:** February 2026
**Scope:** Full codebase static analysis
**Standard:** OWASP Top 10 (2021), CWE/SANS Top 25
**Method:** Manual code review — no code was executed

---

## Executive Summary

The Canvas Classes web application (Next.js + MongoDB + Supabase) was subjected to a comprehensive static security audit. **3 Critical, 4 High, and 5 Medium severity findings** were identified. The most urgent issues are unauthenticated destructive API endpoints, a filesystem-write path traversal vector, and disabled authentication enforcement in middleware.

| Severity | Count |
|----------|-------|
| 🔴 Critical | 3 |
| 🟠 High | 4 |
| 🟡 Medium | 5 |
| 🔵 Low / Informational | 3 |

---

## Critical Findings

### CRIT-01 · Unauthenticated Destructive API — Questions Endpoint

| Field | Value |
|-------|-------|
| **File** | `app/api/questions/route.ts` |
| **CWE** | CWE-306 (Missing Authentication for Critical Function) |
| **CVSS** | 9.1 |

The `POST` endpoint accepts an `action: "seed"` payload that executes `Question.deleteMany({})` followed by `Question.insertMany(seedData)` — effectively wiping and replacing the entire question database. **No authentication or authorization check is performed.**

```javascript
// Current code — no auth guard
if (body.action === 'seed') {
    await Question.deleteMany({});          // Deletes ALL questions
    await Question.insertMany(seedData);    // Replaces with attacker-controlled data
}
```

**Impact:** Any unauthenticated internet user can destroy or poison the entire question bank by sending a single HTTP POST request.

**Recommendation:**
1. Add Supabase `getUser()` authentication check.
2. Restrict seed operations to an admin role via Supabase custom claims or a server-side allowlist.
3. Disable the seed endpoint entirely in production.

---

### CRIT-02 · Unauthenticated File Upload with Path Traversal

| Field | Value |
|-------|-------|
| **File** | `app/api/upload-audio/route.ts` |
| **CWE** | CWE-22 (Path Traversal), CWE-434 (Unrestricted Upload) |
| **CVSS** | 9.8 |

The upload endpoint writes files to the local filesystem using an unsanitized `filename` parameter from the request body. There is **no authentication** and **no path sanitization**.

```javascript
const filename = formData.get('filename') as string;
const filePath = join(publicPath, finalFilename);   // No sanitization
await writeFile(filePath, buffer);                   // Writes to filesystem
```

An attacker can craft `filename` as `../../.env` or `../../../etc/cron.d/backdoor` to write arbitrary files anywhere the process has write access.

**Impact:** Remote code execution, credential theft, or server compromise via arbitrary file write.

**Recommendation:**
1. Add authentication.
2. Strip directory separators: `path.basename(filename)`.
3. Validate MIME type against an allowlist.
4. Migrate to Supabase Storage (already used elsewhere via `uploadUtils.ts`) to avoid local filesystem writes entirely.

---

### CRIT-03 · Disabled Authentication Enforcement in Middleware

| Field | Value |
|-------|-------|
| **File** | `app/utils/supabase/middleware.ts` |
| **CWE** | CWE-862 (Missing Authorization) |
| **CVSS** | 8.1 |

The middleware contains commented-out redirect logic for unauthenticated users:

```javascript
// const url = request.nextUrl.clone();
// url.pathname = '/login';
// return NextResponse.redirect(url);
```

As a result, **all application routes are accessible without authentication**, including admin and API endpoints. The middleware only refreshes existing sessions but never enforces login.

**Impact:** All protected routes are publicly accessible. Auth is cosmetic, not enforced at the edge.

**Recommendation:**
1. Uncomment and enable the redirect logic.
2. Define explicit public routes (`/`, `/login`, `/auth/callback`, static content pages).
3. Redirect all other routes to `/login` if no valid session exists.

---

## High Findings

### HIGH-01 · Open Redirect in Auth Callback

| Field | Value |
|-------|-------|
| **File** | `app/auth/callback/route.ts` |
| **CWE** | CWE-601 (URL Redirection to Untrusted Site) |
| **CVSS** | 6.1 |

The `next` query parameter controls the post-authentication redirect destination. While the code uses `x-forwarded-host`, **no explicit origin validation** is performed to ensure the redirect stays within the application domain.

```javascript
const redirectTo = requestUrl.searchParams.get('next') ?? '/';
return NextResponse.redirect(`${origin}${redirectTo}`);
```

If an attacker crafts `next=//evil.com`, the browser may interpret `https://app.com//evil.com` differently depending on the user-agent.

**Recommendation:**
1. Validate that `redirectTo` starts with `/` and does not contain `//`.
2. Reject any redirect containing a protocol scheme (`http:`, `javascript:`, `data:`).
3. Use a hardcoded allowlist for known redirect destinations.

---

### HIGH-02 · Insecure Session Verification — `getSession()` vs `getUser()`

| Field | Value |
|-------|-------|
| **File** | `app/utils/progressSync.ts`, `app/api/activity/log/route.ts` |
| **CWE** | CWE-287 (Improper Authentication) |
| **CVSS** | 7.4 |

Several files use `supabase.auth.getSession()` to verify authentication. Per [Supabase security documentation](https://supabase.com/docs/guides/auth/sessions), `getSession()` reads from **local storage/cookies without server-side verification**. This means a tampered or expired JWT in the cookie is accepted as valid.

```javascript
// INSECURE — reads unverified local data
const { data: { session } } = await supabase.auth.getSession();
if (session?.user) { /* trusted */ }

// SECURE — verifies JWT with Supabase server
const { data: { user } } = await supabase.auth.getUser();
```

**Impact:** An attacker with a forged or expired JWT cookie can bypass authentication checks on server-side routes.

**Recommendation:** Replace all server-side `getSession()` calls with `getUser()` for auth verification.

---

### HIGH-03 · Cross-Site Scripting (XSS) via `dangerouslySetInnerHTML`

| Field | Value |
|-------|-------|
| **File** | `app/salt-analysis/SaltAnalysisClient.tsx` (line 1212) |
| **CWE** | CWE-79 (XSS — Stored/Reflected) |
| **CVSS** | 6.1 |

The FAQ section renders `item.answer` directly as raw HTML:

```jsx
<p dangerouslySetInnerHTML={{ __html: item.answer }} />
```

While the data currently appears to come from a hardcoded `CONCEPTUAL_QUESTIONS` array (reducing immediate risk), this pattern is dangerous if the data source ever changes to user-generated content or a database.

> [!NOTE]
> Other `dangerouslySetInnerHTML` usages in the codebase (13 instances across pages) exclusively use `JSON.stringify()` for JSON-LD structured data, which is safe.

**Recommendation:**
1. Replace with React-rendered text or a sanitization library (`DOMPurify`).
2. If HTML rendering is required, sanitize the input with an allowlist of tags/attributes.

---

### HIGH-04 · No Rate Limiting on Any API Endpoint

| Field | Value |
|-------|-------|
| **Files** | All 11 files in `app/api/*/route.ts` |
| **CWE** | CWE-770 (Allocation of Resources Without Limits) |
| **CVSS** | 5.3 |

None of the 11 API routes implement rate limiting. This exposes the application to:

- **Brute-force attacks** on the login endpoint.
- **Database denial-of-service** via rapid POST/GET requests to `/api/questions` or `/api/activity/log`.
- **Storage exhaustion** via rapid file uploads to `/api/upload-audio`.

**Recommendation:**
1. Implement rate limiting at the Vercel/edge level (e.g., `@vercel/firewall` or `@upstash/ratelimit`).
2. As a minimum, add per-IP rate limiting on authentication and write endpoints.

---

## Medium Findings

### MED-01 · Missing Security Headers

| Field | Value |
|-------|-------|
| **Files** | `next.config.ts`, `middleware.ts` |
| **CWE** | CWE-693 (Protection Mechanism Failure) |

No security headers are configured anywhere in the application:

| Header | Status | Risk |
|--------|--------|------|
| `Content-Security-Policy` | ❌ Missing | XSS amplification |
| `X-Content-Type-Options` | ❌ Missing | MIME sniffing attacks |
| `X-Frame-Options` | ❌ Missing | Clickjacking |
| `Referrer-Policy` | ❌ Missing | Information leakage |
| `Permissions-Policy` | ❌ Missing | Feature abuse |
| `Strict-Transport-Security` | ❌ Missing | Downgrade attacks |

**Recommendation:** Add headers via `next.config.ts`:

```javascript
async headers() {
    return [{
        source: '/(.*)',
        headers: [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'X-DNS-Prefetch-Control', value: 'on' },
            { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
    }];
}
```

---

### MED-02 · Email Exposed in Client-Side JSON-LD

| Field | Value |
|-------|-------|
| **File** | `app/about/AboutPage.tsx` (line 328) |
| **CWE** | CWE-200 (Information Exposure) |

A personal email address (`paaras.thakur07@gmail.com`) is hardcoded in the FAQ schema JSON-LD, rendered directly in the HTML. This exposes the email to scraping bots.

**Recommendation:** Use a contact form instead, or obfuscate the email address.

---

### MED-03 · Verbose Error Messages in API Responses

| Field | Value |
|-------|-------|
| **Files** | `app/api/questions/route.ts`, `app/api/activity/log/route.ts`, `app/api/upload-audio/route.ts` |
| **CWE** | CWE-209 (Information Exposure Through Error Message) |

Several API routes return raw error objects or stack traces to the client:

```javascript
catch (error) {
    console.error('Error uploading audio:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
}
```

While most error messages are generic, `console.error` statements log full stack traces to server logs visible on Vercel. Some routes pass `error.message` directly which could leak internal details.

**Recommendation:** Return generic error messages to clients. Log detailed errors server-side only.

---

### MED-04 · Fragile Environment Variable Handling

| Field | Value |
|-------|-------|
| **Files** | `lib/supabase.ts`, `app/utils/supabase/server.ts`, `app/utils/supabase/client.ts`, `app/lib/sheets.ts` |
| **CWE** | CWE-252 (Unchecked Return Value) |

Several files use the non-null assertion operator (`!`) on environment variables or fail silently:

```javascript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
```

If an environment variable is missing, the application will throw a cryptic runtime error rather than failing gracefully at startup.

**Recommendation:**
1. Add explicit null checks with descriptive error messages at module initialization.
2. Consider a validation library like `zod` or `envalid` for environment variable schemas.

---

### MED-05 · No CORS Configuration

| Field | Value |
|-------|-------|
| **Files** | All API routes |
| **CWE** | CWE-346 (Origin Validation Error) |

No `Access-Control-Allow-Origin` headers or CORS middleware is configured. While Next.js API routes default to same-origin, the lack of explicit CORS policy means:

- If the API is intended to be consumed by other domains, there is no controlled access.
- If it is not, there is no explicit deny-by-default policy documented.

**Recommendation:** Explicitly configure CORS headers in `next.config.ts` or middleware, either allowing specific origins or explicitly denying cross-origin requests.

---

## Informational Findings

### INFO-01 · Image Optimization Disabled

| Field | Value |
|-------|-------|
| **File** | `next.config.ts` |

`images: { unoptimized: true }` disables Next.js's built-in image optimization. This increases bandwidth usage and load times. While not a direct security vulnerability, it impacts availability and can increase infrastructure costs.

---

### INFO-02 · `NEXT_PUBLIC_` Prefix Exposes Configuration

| Field | Value |
|-------|-------|
| **Files** | Multiple Supabase utility files |

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are intentionally public (Supabase design), but developers should be aware these values are embedded in the client-side JavaScript bundle. Row Level Security (RLS) policies on Supabase tables must be the primary access control mechanism.

**Verification needed:** Ensure all Supabase tables have appropriate RLS policies enabled.

---

### INFO-03 · Utility Scripts with Hardcoded Data Paths

| Field | Value |
|-------|-------|
| **Files** | `scripts/push_json_to_mongo.js`, `scripts/sync-json-to-mongo.js` |

These scripts read from local JSON files and write directly to MongoDB. While they are development utilities (not deployed), they should be excluded from production builds and their MongoDB URI should come exclusively from environment variables.

> [!IMPORTANT]
> A past conversation (`f57f82b6`) documented that a MongoDB URI was previously committed to Git history. **Ensure credentials have been rotated and the Git history has been cleaned with `git filter-repo` or BFG Repo-Cleaner.**

---

## Files Reviewed

| File | Reviewed |
|------|----------|
| `package.json` | ✅ |
| `.gitignore` | ✅ |
| `next.config.ts` | ✅ |
| `middleware.ts` | ✅ |
| `lib/mongodb.ts` | ✅ |
| `lib/supabase.ts` | ✅ |
| `lib/models.ts` | ✅ |
| `lib/uploadUtils.ts` | ✅ |
| `app/api/questions/route.ts` | ✅ |
| `app/api/activity/log/route.ts` | ✅ |
| `app/api/upload-audio/route.ts` | ✅ |
| `app/api/lectures/route.ts` | ✅ |
| `app/api/2-min-chemistry/route.ts` | ✅ |
| `app/api/cbse-12-ncert-revision/route.ts` | ✅ |
| `app/api/cbse-revision/route.ts` | ✅ |
| `app/api/ncert-solutions/route.ts` | ✅ |
| `app/api/quick-recap/route.ts` | ✅ |
| `app/api/sample-papers/route.ts` | ✅ |
| `app/api/top-50/route.ts` | ✅ |
| `app/utils/supabase/middleware.ts` | ✅ |
| `app/utils/supabase/server.ts` | ✅ |
| `app/utils/supabase/client.ts` | ✅ |
| `app/login/actions.ts` | ✅ |
| `app/login/page.tsx` | ✅ |
| `app/auth/callback/route.ts` | ✅ |
| `app/layout.tsx` | ✅ |
| `app/about/AboutPage.tsx` | ✅ |
| `app/salt-analysis/SaltAnalysisClient.tsx` | ✅ |
| `app/utils/progressSync.ts` | ✅ |
| `app/lib/sheets.ts` | ✅ |
| `hooks/useActivityLogger.ts` | ✅ |
| `components/admin/SmartUploader.tsx` | ✅ |
| `scripts/push_json_to_mongo.js` | ✅ |
| `scripts/sync-json-to-mongo.js` | ✅ |
| `scripts/import-jee-2026.js` | ✅ |
| `server/models/*.js` | ✅ |

---

## Prioritized Remediation Roadmap

| Priority | Finding | Effort | Impact |
|----------|---------|--------|--------|
| 1 | CRIT-02 — File upload path traversal | Low | Prevents RCE |
| 2 | CRIT-01 — Unauthenticated question wipe | Low | Prevents data destruction |
| 3 | CRIT-03 — Enable middleware auth | Medium | Enforces perimeter auth |
| 4 | HIGH-02 — Replace `getSession()` with `getUser()` | Low | Prevents JWT forgery bypass |
| 5 | HIGH-01 — Open redirect validation | Low | Prevents phishing |
| 6 | HIGH-04 — Rate limiting | Medium | Prevents abuse/DoS |
| 7 | HIGH-03 — XSS via `dangerouslySetInnerHTML` | Low | Prevents future XSS |
| 8 | MED-01 — Security headers | Low | Defense-in-depth |
| 9 | MED-03 — Verbose errors | Low | Reduces info leakage |
| 10 | MED-04 — Env var validation | Low | Prevents startup crashes |

---

*Report generated via static code analysis. No code was executed during this audit.*
