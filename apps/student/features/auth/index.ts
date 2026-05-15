// features/auth — user-facing authentication.
//
// Routes:
//   /login            → app/login/page.tsx (uses server actions from here)
//   /account          → app/account/page.tsx (inline)
//   /auth/callback    → app/auth/callback/route.ts (Supabase OAuth callback)
//
// Site-level: app/layout.tsx renders <AuthButton /> in the navbar surface.
//
// What's NOT in this feature:
//   - apps/student/lib/auth.ts, lib/bookAuth.ts, lib/rbac.ts: cross-feature
//     auth helpers used by every API route and server component.
//   - apps/student/app/utils/supabase/{client,server,middleware}.ts: low-level
//     Supabase client wrappers (22 importers across the codebase, cross-feature).

export { AuthButton } from './components/AuthButton';
export * from './server-actions';
