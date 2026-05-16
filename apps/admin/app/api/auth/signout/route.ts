import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

export async function POST() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'), {
    status: 302,
  });
}
