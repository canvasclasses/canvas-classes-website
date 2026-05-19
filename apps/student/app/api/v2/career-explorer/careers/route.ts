// PUBLIC GET: lists active careers (optionally filtered by slug).
// The matching admin POST (create career) lives in apps/admin.

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { CareerPath } from '@canvas/data/models/CareerPath';
import { errorResponse, rateLimit, requestIp } from '../_shared';

export async function GET(request: NextRequest) {
  const ip = requestIp(request);
  const rl = rateLimit(`ce-c-${ip}`, 60);
  if (!rl.ok) return errorResponse('Too many requests', 429);

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '100', 10) || 100, 200);
  const hiddenGem = url.searchParams.get('hidden_gem');
  const family = url.searchParams.get('family');
  const slug = url.searchParams.get('slug');

  try {
    await connectToDatabase();
    const q: Record<string, unknown> = { is_active: true };
    if (hiddenGem === 'true') q.hidden_gem = true;
    if (family) q.family = family;
    if (slug) q._id = slug;
    const items = await CareerPath.find(q).sort({ name: 1 }).limit(limit).lean();
    return NextResponse.json({ items });
  } catch (e) {
    console.error('GET /career-explorer/careers', e);
    return errorResponse('Failed to load careers');
  }
}
