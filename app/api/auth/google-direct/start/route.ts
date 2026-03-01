import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const next = searchParams.get('next') || '/';

    const clientId = process.env.GOOGLE_CLIENT_ID;
    
    if (!clientId) {
        console.error('❌ [Google OAuth] GOOGLE_CLIENT_ID not configured');
        return NextResponse.redirect(
            new URL('/login?error=OAuth not configured', request.url)
        );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const redirectUri = `${baseUrl}/api/auth/google-direct/callback`;

    const state = encodeURIComponent(JSON.stringify({ next }));

    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', clientId);
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('state', state);
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'select_account');

    if (process.env.NODE_ENV === 'development') {
        console.log('🔄 [Google Direct] Starting OAuth flow');
        console.log('   Redirect URI:', redirectUri);
    }

    return NextResponse.redirect(googleAuthUrl.toString());
}
