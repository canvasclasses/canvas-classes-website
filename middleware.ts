import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ── Redirect old /books/ URLs for Class 9 books to /class-9/ ────────
    const class9Redirect = pathname.match(/^\/books\/(class9-[^/]+)(\/(.+))?$/);
    if (class9Redirect) {
        const [, bookSlug, , pageSlug] = class9Redirect;
        const dest = request.nextUrl.clone();
        dest.pathname = pageSlug ? `/class-9/${bookSlug}/${pageSlug}` : '/class-9';
        return NextResponse.redirect(dest, 301);
    }

    // Routes that require authentication (admin Crucible only)
    const isCrucibleRoute = pathname.startsWith('/crucible');
    // Routes that are publicly viewable but where we still want to refresh the
    // Supabase session cookie so SSR can read the user. Without this refresh,
    // a freshly signed-in user lands on /the-crucible and the SSR `auth.getUser()`
    // call may not see the new cookie, causing the page to render as logged-out
    // and (in some cases) appear stuck/blank while client-side hydration races.
    const isBooksRoute = pathname.startsWith('/books')
        || pathname.startsWith('/class-9')
        || pathname.startsWith('/class-11');
    const isStudentCrucibleRoute = pathname.startsWith('/the-crucible');

    // If none of the routes that need session handling, skip entirely.
    if (!isCrucibleRoute && !isBooksRoute && !isStudentCrucibleRoute) {
        return NextResponse.next({ request });
    }

    // Local development bypass — so the author can keep editing on
    // localhost without needing to stay logged in. NEVER bypasses in prod.
    const isLocalDev =
        request.nextUrl.hostname === 'localhost' ||
        request.nextUrl.hostname === '127.0.0.1';
    if (isLocalDev) {
        return NextResponse.next({ request });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If Supabase not configured, block gated /crucible (admin) in production
    // but allow books and /the-crucible (student) through — they work without auth.
    if (!supabaseUrl || !supabaseAnonKey) {
        if (isBooksRoute || isStudentCrucibleRoute) return NextResponse.next({ request });
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.next({ request });
    }

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() { return request.cookies.getAll(); },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                supabaseResponse = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                );
            },
        },
    });

    let user = null;
    try {
        const { data } = await supabase.auth.getUser();
        user = data.user;
    } catch {
        // Supabase network error — treat as unauthenticated
    }

    // Books: allow through regardless of auth (metered gate is client-side).
    // The Supabase cookie refresh above still runs so logged-in users get
    // their session kept alive.
    if (isBooksRoute) {
        return supabaseResponse;
    }

    // /the-crucible (student-facing): no auth gate — page allows non-logged-in
    // users (gated CTAs trigger an in-page auth dialog). We *only* ran middleware
    // here to keep the Supabase session cookie fresh so SSR sees the right user.
    if (isStudentCrucibleRoute) {
        return supabaseResponse;
    }

    // /crucible (admin): hard auth gate — not logged in → redirect to /login
    if (!user) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // /crucible/admin: verify user is in ADMIN_EMAILS before granting access.
    // This is a server-side gate — the client-side usePermissions hook provides
    // granular RBAC, but it must not be the only layer of defence.
    if (pathname.startsWith('/crucible/admin')) {
        const adminEmails = (process.env.ADMIN_EMAILS || '')
            .split(',')
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean);
        if (!user.email || !adminEmails.includes(user.email.toLowerCase())) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html|js|css|txt)$).*)',
    ],
}
