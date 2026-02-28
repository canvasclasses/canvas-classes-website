import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
        console.error('❌ [Google Direct] OAuth error:', error);
        return NextResponse.redirect(
            new URL('/login?error=Google login failed', request.url)
        );
    }

    if (!code) {
        console.error('❌ [Google Direct] No authorization code received');
        return NextResponse.redirect(
            new URL('/login?error=No authorization code', request.url)
        );
    }

    let next = '/';
    if (state) {
        try {
            const stateData = JSON.parse(decodeURIComponent(state));
            next = stateData.next || '/';
        } catch (e) {
            console.error('Failed to parse state:', e);
        }
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error('❌ [Google Direct] Missing Google OAuth credentials');
        return NextResponse.redirect(
            new URL('/login?error=OAuth not configured', request.url)
        );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const redirectUri = `${baseUrl}/api/auth/google-direct/callback`;

    try {
        if (process.env.NODE_ENV === 'development') {
            console.log('🔄 [Google Direct] Exchanging code for tokens');
        }

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('❌ [Google Direct] Token exchange failed:', errorText);
            return NextResponse.redirect(
                new URL('/login?error=Failed to get Google tokens', request.url)
            );
        }

        const tokens = await tokenResponse.json();
        const idToken = tokens.id_token;

        if (!idToken) {
            console.error('❌ [Google Direct] No id_token in response');
            return NextResponse.redirect(
                new URL('/login?error=No ID token received', request.url)
            );
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('✅ [Google Direct] Got ID token, signing into Supabase');
        }

        const supabase = await createClient();
        if (!supabase) {
            console.error('❌ [Google Direct] Supabase client not configured');
            return NextResponse.redirect(
                new URL('/login?error=Auth service not configured', request.url)
            );
        }

        const { data, error: supabaseError } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: idToken,
        });

        if (supabaseError) {
            console.error('❌ [Google Direct] Supabase signInWithIdToken failed:', supabaseError);
            return NextResponse.redirect(
                new URL('/login?error=Failed to sign in', request.url)
            );
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('✅ [Google Direct] Successfully signed in:', data.user?.email);
        }

        return NextResponse.redirect(new URL(next, request.url));
    } catch (error: any) {
        console.error('❌ [Google Direct] Unexpected error:', error);
        return NextResponse.redirect(
            new URL('/login?error=Authentication failed', request.url)
        );
    }
}
