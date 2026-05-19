// PUBLIC GET: read a single active career. Admin write methods (PATCH +
// DELETE) live in apps/admin.

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { CareerPath } from '@canvas/data/models/CareerPath';
import { errorResponse, rateLimit, requestIp } from '../../_shared';

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const ip = requestIp(request);
  const rl = rateLimit(`ce-cs-${ip}`, 60);
  if (!rl.ok) return errorResponse('Too many requests', 429);

  const { slug } = await context.params;
  try {
    await connectToDatabase();
    const item = await CareerPath.findById(slug).lean<{ is_active?: boolean } | null>();
    if (!item || !item.is_active) return errorResponse('Not found', 404);
    return NextResponse.json({ item });
  } catch (e) {
    console.error('GET /career-explorer/careers/[slug]', e);
    return errorResponse('Failed to load career');
  }
}
