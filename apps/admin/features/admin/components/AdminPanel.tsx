// Server-side auth gate shared by every server-rendered admin dashboard page.
//
// Collapses the preamble that was copy-pasted across the admin pages:
//
//     const admin = await requireSuperAdmin();   // or requireAdmin()
//     if (!admin) redirect('/');                 // blog: redirect('/login?next=/blog')
//     return <Workspace />;
//
// Scope is INTENTIONALLY just the auth gate — not the header / toolbar /
// loading / empty-state chrome. Those are genuinely bespoke per dashboard and
// unifying them would change rendered output. See the decision memo:
//   _agents/decisions/2026-06-08-adminpanel-consolidation-memo.md  (Option B)
//
// Not migrated: `/crucible` — it is a `'use client'` page with no server gate
// (it relies on middleware + a client-side redirect inside its data loader).
//
// This is a Server Component (no 'use client'). Because JSX children are
// created lazily, the gate always runs *before* any child renders: an
// unauthorised visitor is redirected before a wrapped dashboard executes its
// own data fetching. Pass a render function as children when the dashboard
// needs the resolved admin identity (e.g. blog reads `admin.email`).

import { redirect } from 'next/navigation';
import { requireAdmin, requireSuperAdmin, type AdminIdentity } from '@/lib/adminAuth';

type AdminGate = 'admin' | 'super';

interface AdminPanelProps {
  /**
   * Which tier to require. Both 'super' and 'admin' gate on SUPER_ADMIN_EMAILS
   * today (`requireSuperAdmin` is an alias of `requireAdmin`); the prop
   * preserves each page's original, self-documenting choice so the intent
   * survives if the two checks ever diverge.
   */
  gate?: AdminGate;
  /** Where to send unauthenticated / unauthorised users. Defaults to '/'. */
  redirectTo?: string;
  /**
   * The dashboard to render once the gate passes. Pass a render function to
   * receive the resolved admin identity.
   */
  children: React.ReactNode | ((admin: AdminIdentity) => React.ReactNode);
}

export default async function AdminPanel({
  gate = 'super',
  redirectTo = '/',
  children,
}: AdminPanelProps) {
  const admin = gate === 'super' ? await requireSuperAdmin() : await requireAdmin();
  if (!admin) redirect(redirectTo);
  return <>{typeof children === 'function' ? children(admin) : children}</>;
}
