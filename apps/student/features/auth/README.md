# features/auth

User-facing authentication: login form, account page, OAuth callback,
and the navbar's AuthButton.

## Routes

| Route | File | Notes |
|---|---|---|
| `/login` | `app/login/page.tsx` | Inline JSX (321 lines); imports `server-actions` from this feature |
| `/account` | `app/account/page.tsx` | Inline JSX |
| `/auth/callback` | `app/auth/callback/route.ts` | OAuth callback handler |

`AuthButton` is rendered globally from `app/layout.tsx`.

## Public surface

```ts
import { AuthButton } from '@/features/auth';
import { signIn, signOut } from '@/features/auth';
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
