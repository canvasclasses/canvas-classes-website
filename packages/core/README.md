# @canvas/core

Cross-cutting infrastructure used by both apps. Empty scaffold —
populated in Phase 3.

Planned contents:

| Slot | What lives here |
|---|---|
| `rate-limit/` | `createRateLimiter` factory + `getClientIp` |
| `latex-utils/` | `latexValidator`, `formatExamLabel` |
| `redirect-validation/` | `sanitizeRedirect` (SSRF prevention) |
| `analytics/` | Mixpanel server + client wrappers |
| `r2-storage/` | Cloudflare R2 access |
| `utils/` | Generic helpers |
