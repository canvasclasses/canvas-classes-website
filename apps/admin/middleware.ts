import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './app/utils/supabase/middleware';
import { isSuperAdmin, getEffectiveAccess } from '@canvas/data/rbac';

// Admin app middleware — enforces a hard auth gate at the framework boundary
// for EVERY path except the login flow and auth callbacks.
//
// Defense in depth: route handlers under /api/v2/* should ALSO call
// `requireAdmin()` directly. The middleware is the first line; the route
// handlers are the second. Never rely on either alone.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths — must be reachable without auth so users can sign in.
  const isPublicPath =
    pathname === '/login' ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico';

  if (isPublicPath) {
    return NextResponse.next({ request });
  }

  // Localhost dev bypass — same rules as adminAuth.isLocalhostDev. Never
  // trips on a Vercel preview deployment.
  const isLocalDev =
    process.env.NODE_ENV === 'development' &&
    process.env.VERCEL !== '1' &&
    (request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1');

  if (isLocalDev) {
    return NextResponse.next({ request });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Misconfigured deployment — deny everything in production rather than
    // silently going wide open.
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next({ request });
  }

  const { response, user } = await updateSession(request);

  // Not signed in → redirect to login (UI paths) or 401 (API paths).
  if (!user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Gate: must be either a super admin (env) or have an active user_access doc.
  // getEffectiveAccess uses the 60s cache, short-circuits super admins (no Mongo),
  // and reads from the user_access collection for staff.
  if (!user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const access = await getEffectiveAccess(user.email);
    const allowed = access.isSuperAdmin || (access.grants.length > 0);
    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } catch (err) {
    console.error('Middleware access lookup failed:', err);
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return response;
}

export const config = {
  matcher: [
    // Match everything except Next internals (full /_next/* tree, not just
    // static/image — covers _next/data, _next/webpack-hmr, etc.) and static
    // asset extensions. We intentionally INCLUDE /api/* here so admin API
    // routes get the same gate as pages.
    '/((?!_next/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html|js|css|txt|ico)$).*)',
  ],
};
