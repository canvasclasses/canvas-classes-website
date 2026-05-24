import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  try {
    throw new Error('sentry-smoketest ' + new Date().toISOString());
  } catch (err) {
    Sentry.captureException(err);
  }

  return NextResponse.json({ ok: true, message: 'Test exception captured' });
}
