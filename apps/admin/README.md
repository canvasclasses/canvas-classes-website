# apps/admin

Crucible operator console — a separate Next.js 15 app for admin/internal use.

- **Production:** `admin.canvasclasses.in`
- **Local dev:** `http://localhost:3001` (run `npm run dev:admin` from the repo root)
- **Auth:** Supabase + `ADMIN_EMAILS` allowlist (Shape A). Enforced at middleware.

## Why this exists

`apps/admin` is split from `apps/student` to keep the public-internet surface
(student) on a different network host than the admin write surface. Any
vulnerability in a public student page or API cannot reach admin write
endpoints — they live on a different deployment.

See `_agents/plans/PHASE_5_ADMIN_SPLIT.md` for the full decision record.

## Layout (after Phase 5 completes)

```
apps/admin/
├── app/
│   ├── layout.tsx, page.tsx, globals.css
│   ├── login/                  ← Supabase sign-in
│   ├── admin/                  ← main question admin (was /crucible/admin)
│   │   ├── blog/, books/, flashcards/, taxonomy/, career-explorer/
│   │   └── preview/
│   ├── dashboard/              ← admin user dashboard
│   ├── preview/                ← question preview
│   └── api/v2/                 ← admin write API (moved from apps/student)
├── features/admin/             ← admin React components + hooks
├── lib/auth.ts                 ← Shape A auth helpers (port of student's)
├── middleware.ts               ← global session check + ADMIN_EMAILS gate
├── instrumentation.ts          ← Sentry register
└── next.config.ts, tsconfig.json, etc.
```

## Shared packages

This app imports the same workspace packages as `apps/student`:

- `@canvas/core` — LaTeX validator, rate limiter, R2 helpers, redirect validation, analytics
- `@canvas/data` — Mongoose models, db connection, taxonomy, id-generator
- `@canvas/persona` — adaptive engine writer (admin reads stats; rarely writes)
- `@canvas/ui` — `MathRenderer` + shared UI primitives

## What does NOT live here

- The student app (`canvasclasses.in`) — see `apps/student/`
- Public-facing API routes (`/v2/user/*`, `/v2/test-results`, `/v2/college-predictor/*`, etc.) — they stay in `apps/student/app/api/`
- The shared data layer — that's `packages/data/`

## Cross-app boundary

`apps/admin` must never import from `apps/student/*`, and vice versa. Anything
shared goes through `packages/*`. The TSC compiler enforces this via
workspace boundaries.

## Deployment

Each app is its own Vercel project (or the same project with two domains).
Each needs its own env vars: `MONGODB_URI`, `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_EMAILS`, R2 keys, Sentry DSN.

A future hardening step (tracked as Phase 5.5d) is to give `apps/admin` and
`apps/student` different MongoDB users with different collection-level
permissions, so a student-side DB injection cannot modify admin-managed
data.
