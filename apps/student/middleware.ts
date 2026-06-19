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

    // The student app no longer serves any admin routes — those moved to
    // apps/admin/ (Phase 5). The only paths that need middleware here are
    // routes that depend on a fresh Supabase session cookie for SSR auth.
    const isBooksRoute = pathname.startsWith('/books')
        || pathname.startsWith('/class-9')
        || pathname.startsWith('/class-11');
    // Skip /the-crucible/q/* — those are ISR-cached question detail pages
    // and a cookie-writing middleware flips them to dynamic at runtime,
    // throwing 500s on every bot crawl. Client-side auth still works there.
    const isStudentCrucibleRoute = pathname.startsWith('/the-crucible')
        && !pathname.startsWith('/the-crucible/q/');

    if (!isBooksRoute && !isStudentCrucibleRoute) {
        return NextResponse.next({ request });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.next({ request });
    }

    // Anonymous / bot traffic carries no Supabase auth cookie — there's no session
    // to refresh, so skip the Edge invocation + Supabase round-trip entirely on
    // these high-traffic content trees. Logged-in users still get the refresh. (vercel-cost #21)
    const hasAuthCookie = request.cookies.getAll().some((c) => c.name.includes('-auth-token'));
    if (!hasAuthCookie) {
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

    try {
        // Refresh the Supabase session cookie. Both /books and /the-crucible
        // allow anonymous users — the gating is in-page — so we don't redirect
        // here. We only run middleware to keep the cookie fresh so SSR sees
        // the right user.
        await supabase.auth.getUser();
    } catch {
        // Supabase network error — pass through without refresh.
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html|js|css|txt)$).*)',
    ],
}
