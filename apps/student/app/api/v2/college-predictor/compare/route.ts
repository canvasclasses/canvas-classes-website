// PUBLIC: no auth required — the college compare tool is a free, public tool.
// Read-only (no DB writes); rate-limited per IP and hard-capped at 3 institutes.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { loadCompareCollege } from '@/features/college-predictor/lib/compareData';
import { createRateLimiter, getClientIp } from '@canvas/core/rate-limit';

export const revalidate = 0; // dynamic per selection; the PAGE is cached, not this API

const CompareRequestSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(2).max(80),
        branch: z.string().max(80).optional(),
      }),
    )
    .min(2)
    .max(3),
  category: z
    .enum(['OPEN', 'OBC-NCL', 'SC', 'ST', 'EWS'])
    .optional(),
  gender: z
    .enum(['Gender-Neutral', 'Female-only (including Supernumerary)'])
    .optional(),
});

const compareLimiter = createRateLimiter({ max: 40, windowMs: 60_000 });

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = compareLimiter.check(ip);
    if (!rl.ok) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a minute.' },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = CompareRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.issues },
        { status: 400 },
      );
    }
    const { items, category = 'OPEN', gender = 'Gender-Neutral' } = parsed.data;

    // De-dupe ids (comparing a college against itself is meaningless) while
    // preserving order.
    const seen = new Set<string>();
    const uniqueItems = items.filter((it) => (seen.has(it.id) ? false : (seen.add(it.id), true)));

    const loaded = await Promise.all(
      uniqueItems.map((it) =>
        loadCompareCollege(it.id, it.branch, category, gender).catch(() => null),
      ),
    );
    const colleges = loaded.filter((c): c is NonNullable<typeof c> => c != null);

    if (colleges.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Could not load at least two of the selected institutes.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, colleges });
  } catch (err) {
    console.error('College compare error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
