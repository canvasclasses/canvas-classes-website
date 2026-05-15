import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
        return NextResponse.redirect(
            new URL('/login?error=Configuration error', request.url)
        );
    }

    // Reconstruct the full Supabase authorization URL with all query params
    const authUrl = new URL(`${supabaseUrl}/auth/v1/authorize`);
    
    // Copy all query parameters from the request
    request.nextUrl.searchParams.forEach((value, key) => {
        authUrl.searchParams.set(key, value);
    });

    console.log('🔄 [OAuth Proxy] Redirecting to Supabase OAuth:', authUrl.toString());

    try {
        // Fetch the authorization page from Supabase server-side
        const response = await fetch(authUrl.toString(), {
            redirect: 'manual',
            headers: {
                'User-Agent': request.headers.get('user-agent') || '',
            },
        });

        // If Supabase redirects (to Google), follow that redirect
        if (response.status >= 300 && response.status < 400) {
            const redirectLocation = response.headers.get('location');
            if (redirectLocation) {
                console.log('✅ [OAuth Proxy] Redirecting to Google:', redirectLocation);
                return NextResponse.redirect(redirectLocation);
            }
        }

        // If it's not a redirect, something went wrong
        console.error('❌ [OAuth Proxy] Unexpected response:', response.status);
        return NextResponse.redirect(
            new URL('/login?error=OAuth initialization failed', request.url)
        );
    } catch (error) {
        console.error('❌ [OAuth Proxy] Error:', error);
        return NextResponse.redirect(
            new URL('/login?error=Connection failed', request.url)
        );
    }
}
