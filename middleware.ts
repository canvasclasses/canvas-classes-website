import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Enforce auth on /crucible/* (question practice + admin)
    // and on /books/* (premium digital textbook — will later gate behind
    // an entitlement check too, but for now just requires a logged-in user).
    const isCrucibleRoute = pathname.startsWith('/crucible');
    const isBooksRoute = pathname.startsWith('/books');
    if (!isCrucibleRoute && !isBooksRoute) {
        return NextResponse.next({ request });
    }

    // Local development bypass — so the author can keep editing the book on
    // localhost without needing to stay logged in. NEVER bypasses in prod.
    const isLocalDev =
        request.nextUrl.hostname === 'localhost' ||
        request.nextUrl.hostname === '127.0.0.1';
    if (isLocalDev) {
        return NextResponse.next({ request });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If Supabase not configured, block all gated routes in production
    if (!supabaseUrl || !supabaseAnonKey) {
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

    // Not logged in → redirect to /login (localhost bypass already handled above)
    if (!user) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // NOTE: /crucible/admin RBAC is checked client-side by usePermissions hook.
    // When the book paywall lands, this is the place to layer an entitlement
    // check for /books/* (e.g. `if (isBooksRoute && !hasBookEntitlement(user))`).

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html|js|css|txt)$).*)',
    ],
}
