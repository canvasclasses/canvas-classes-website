import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const next = searchParams.get('next') || '/';

    try {
        const supabase = await createClient();

        if (!supabase) {
            console.error('❌ [OAuth] Supabase client not configured');
            return NextResponse.redirect(
                new URL('/login?error=Authentication service not configured', request.url)
            );
        }

        // Use env var for production, request origin for development
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
        const callbackUrl = `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`;

        if (process.env.NODE_ENV === 'development') {
            console.log('🔄 [OAuth] Initiating Google OAuth flow');
            console.log('   Callback URL:', callbackUrl);
        }

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: callbackUrl,
            },
        });

        if (error) {
            console.error('❌ [OAuth] Supabase error:', error);
            return NextResponse.redirect(
                new URL('/login?error=Google login failed', request.url)
            );
        }

        if (data.url) {
            // Rewrite the Supabase authorize URL to go through our auth proxy
            // e.g. https://xxx.supabase.co/auth/v1/authorize?params 
            //   → /api/supabase-proxy/auth/authorize?params
            const authUrl = new URL(data.url);
            const supabasePath = authUrl.pathname; // /auth/v1/authorize
            const proxyPath = supabasePath.replace('/auth/v1/', '/api/supabase-proxy/auth/');
            
            const proxyUrl = new URL(proxyPath, request.url);
            // Copy all query params from the Supabase URL
            authUrl.searchParams.forEach((value, key) => {
                proxyUrl.searchParams.set(key, value);
            });

            if (process.env.NODE_ENV === 'development') {
                console.log('✅ [OAuth] Redirecting browser through proxy:', proxyUrl.toString());
            }
            return NextResponse.redirect(proxyUrl);
        }

        console.error('❌ [OAuth] No URL returned from Supabase');
        return NextResponse.redirect(new URL('/login?error=No OAuth URL returned', request.url));
    } catch (error: any) {
        console.error('❌ [OAuth] Unexpected error:', error);
        return NextResponse.redirect(
            new URL('/login?error=Connection failed', request.url)
        );
    }
}
