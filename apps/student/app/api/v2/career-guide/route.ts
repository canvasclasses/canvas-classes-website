// PUBLIC: no auth required.
// GET → list all PUBLISHED CareerSpec docs with a summary-only projection.
// Used by the student-facing /career-guide index page (when rendered as a
// client component, or for any future filtered query a UI needs). The page
// itself is a server component that reads from Mongo directly, so this route
// is for: (a) future client-side filtering, (b) external consumers who want
// a JSON feed of our career briefs.

import { NextResponse } from 'next/server';
import connectToDatabase from '@canvas/data/db/mongodb';
import { CareerSpec } from '@canvas/data/models/CareerSpec';
import { createRateLimiter, getClientIp } from '@canvas/core/rate-limit';
import type { NextRequest } from 'next/server';

const limiter = createRateLimiter({ max: 60, windowMs: 60_000 });

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = limiter.check(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please wait a minute.' },
      { status: 429 },
    );
  }

  try {
    await connectToDatabase();

    // Public projection — strips internal fields the public has no need for
    // (created_by, updated_by, version, deleted_at, etc.). Keeps the JSON
    // payload tight on the wire and the data shape stable for external
    // consumers if anyone scripts against the feed.
    const items = await CareerSpec.find({ status: 'published', deleted_at: null })
      .select(
        'slug display_name category archetype one_line linked_career_path_slug ' +
          'last_full_review next_review_due published_at',
      )
      .sort({ published_at: -1 })
      .limit(100)
      .lean();

    return NextResponse.json(
      { success: true, items },
      {
        headers: {
          // Cache for 10 minutes at the edge. Published specs change quarterly,
          // not minute-by-minute. Keeping s-maxage moderate so a fresh publish
          // shows up reasonably quickly without hammering Mongo.
          'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
        },
      },
    );
  } catch (err) {
    console.error('GET /career-guide error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
