# features/auth

User-facing authentication: login form, account page, OAuth callback,
and the navbar's AuthButton.

## Routes

| Route | File | Notes |
|---|---|---|
| `/login` | `app/login/page.tsx` | Inline JSX (321 lines); imports `server-actions` from this feature |
| `/account` | `app/account/page.tsx` | Inline JSX |
| `/auth/callback` | `app/auth/callback/route.ts` | OAuth callback handler |

`AuthButton` is rendered globally from `app/layout.tsx`. It is a **client
component** (`'use client'`) that fetches the user via the browser Supabase
client. Keeping it client-side is load-bearing: a server-side `cookies()`
call in the root layout flips every ISR-cached page (e.g. `/the-crucible/q/[slug]`,
`/college-predictor/college/[slug]`) to dynamic at runtime and throws a 500
("Page changed from static to dynamic at runtime, reason: cookies"). Do not
convert this back to a server component without first removing it from the
root layout.

## Public surface

```ts
import { AuthButton } from '@/features/auth';
import { login, signup, signInWithGoogle } from '@/features/auth';
```

## Layout

```
features/auth/
├── components/
│   └── AuthButton.tsx        ← navbar surface (renders in app/layout.tsx)
├── server-actions.ts         ← login flow server actions ('use server')
├── index.ts
└── README.md
```

## Not in this feature

The following auth utilities are intentionally NOT here — they're used
by every feature that touches user data, so they stay at the app level:

- `apps/student/lib/auth.ts` — `getAuthenticatedUser`, `isAdmin`, `hasScriptSecret` for route handlers
- `apps/student/lib/bookAuth.ts` — `requireAdmin`, `getUserId`, `isLocalhostDev` for server components
- `apps/student/lib/rbac.ts` — role-based permissions (canEditQuestions etc.)
- `apps/student/lib/supabase.ts` — top-level Supabase client
- `apps/student/app/utils/supabase/{client,server,middleware}.ts` — Supabase SSR helpers (22 importers across the codebase)

When admin app splits in Phase 5, the admin-specific auth (custom JWT,
admin_accounts collection) will live in its own slice in `apps/admin/`.
The Supabase-backed student auth stays here.
