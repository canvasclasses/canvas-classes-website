import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/bookAuth';

const ALLOWED_TAGS = new Set(['questions']);

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  const isLocalDev = await isLocalhostDev();
  if (!user && !isLocalDev) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (user && !isAdmin(user.email!) && !isLocalDev) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const tag = typeof body?.tag === 'string' ? body.tag : 'questions';
  if (!ALLOWED_TAGS.has(tag)) {
    return NextResponse.json({ success: false, error: 'Unknown tag' }, { status: 400 });
  }

  revalidateTag(tag);
  return NextResponse.json({ success: true, revalidated: tag });
}
