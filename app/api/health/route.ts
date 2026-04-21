import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: Record<string, boolean> = { mongo: false, supabase: false };
  const start = Date.now();

  try {
    const conn = await connectToDatabase();
    checks.mongo = conn?.connection?.readyState === 1;
  } catch {
    checks.mongo = false;
  }

  try {
    const supa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supa.auth.getSession();
    checks.supabase = !error;
  } catch {
    checks.supabase = false;
  }

  const ok = checks.mongo && checks.supabase;
  return NextResponse.json(
    { ok, checks, duration_ms: Date.now() - start },
    { status: ok ? 200 : 503 }
  );
}
