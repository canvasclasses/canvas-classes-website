import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      // Cookie clear still succeeds at the client; log but don't fail the
      // request — leaving the user stuck on /admin with a half-valid session
      // is worse than redirecting them to /login.
      console.error('supabase.auth.signOut() failed:', err);
    }
  }
  // Always same-origin. Building the URL from `request.url` removes the
  // open-redirect surface that the prior `NEXT_PUBLIC_SITE_URL` fallback
  // had if that env var was ever misconfigured to an external host.
  return NextResponse.redirect(new URL('/login', request.url), { status: 302 });
}
