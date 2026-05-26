// PUBLIC: no auth required.
// GET → fetch ONE published CareerSpec by slug. Returns 404 for draft /
// archived / nonexistent slugs (we never leak unpublished editorial content).

import { NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { CareerSpec } from '@canvas/data/models/CareerSpec';
import { createRateLimiter, getClientIp } from '@canvas/core/rate-limit';
import type { NextRequest } from 'next/server';

const limiter = createRateLimiter({ max: 60, windowMs: 60_000 });

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const ip = getClientIp(request);
  const rl = limiter.check(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please wait a minute.' },
      { status: 429 },
    );
  }

  const { slug } = await context.params;
  // Defensive slug validation — even though only published docs match the
  // unique index, accepting absurd payloads wastes Mongo CPU + index lookups.
  if (typeof slug !== 'string' || slug.length < 2 || slug.length > 60 || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ success: false, error: 'Invalid slug' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    // Public projection — same fields the detail page renders, stripping
    // internal lifecycle data the public has no use for.
    const item = await CareerSpec.findOne({ slug, status: 'published', deleted_at: null })
      .select(
        '-created_by -updated_by -deleted_at -deleted_by -__v',
      )
      .lean();

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Career spec not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, item },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (err) {
    console.error('GET /career-guide/[slug] error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
