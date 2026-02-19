import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Admin emails allowed to access /crucible/admin
// Add your team members' emails here
const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only enforce auth on /crucible/* routes
    const isCrucibleRoute = pathname.startsWith('/crucible');
    if (!isCrucibleRoute) {
        return NextResponse.next({ request });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If Supabase not configured, block all crucible routes in production
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

    const { data: { user } } = await supabase.auth.getUser();

    // Not logged in → redirect to /login (skip on local dev)
    const isLocalDev = request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1';
    if (!user && !isLocalDev) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // /crucible/admin requires email to be in the ADMIN_EMAILS allowlist
    if (pathname.startsWith('/crucible/admin') && user) {
        const userEmail = user.email || '';
        if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(userEmail)) {
            return NextResponse.json(
                { error: 'Forbidden: Admin access only' },
                { status: 403 }
            );
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
