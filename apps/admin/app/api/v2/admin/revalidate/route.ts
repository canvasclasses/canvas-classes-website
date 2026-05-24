import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth';

const ALLOWED_TAGS = new Set(['questions']);

export async function POST(request: NextRequest) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const body = await request.json().catch(() => ({}));
  const tag = typeof body?.tag === 'string' ? body.tag : 'questions';
  if (!ALLOWED_TAGS.has(tag)) {
    return NextResponse.json({ success: false, error: 'Unknown tag' }, { status: 400 });
  }

  revalidateTag(tag);
  return NextResponse.json({ success: true, revalidated: tag });
}
