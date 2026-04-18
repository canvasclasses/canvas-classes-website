import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    throw new Error('sentry-smoketest ' + new Date().toISOString());
  } catch (err) {
    Sentry.captureException(err);
  }

  return NextResponse.json({ ok: true, message: 'Test exception captured' });
}
