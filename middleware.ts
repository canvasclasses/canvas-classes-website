import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Routes that require authentication
    const isCrucibleRoute = pathname.startsWith('/crucible');
    // Books are publicly accessible (metered gate handled client-side in BookReader).
    // We still refresh the Supabase session if the user happens to be logged in.
    const isBooksRoute = pathname.startsWith('/books');

    // If neither a gated nor a books route, skip entirely.
    if (!isCrucibleRoute && !isBooksRoute) {
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

    // If Supabase not configured, block gated routes in production
    // but allow books through (they work without auth).
    if (!supabaseUrl || !supabaseAnonKey) {
        if (isBooksRoute) return NextResponse.next({ request });
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

    // Crucible: hard auth gate — not logged in → redirect to /login
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
