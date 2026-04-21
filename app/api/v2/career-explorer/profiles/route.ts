// Creates a new CareerProfile (questionnaire session).
// Anonymous sessions are allowed for top-of-funnel; we attach user_id if the
// caller is authenticated.

import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import connectToDatabase from '@/lib/mongodb';
import { CareerProfile } from '@/lib/models/CareerProfile';
import { getAuthenticatedUser } from '@/lib/auth';
import { errorResponse, rateLimit, requestIp } from '../_shared';
import { EMPTY_SCORES } from '@/lib/careerExplorer/facets';

const CreateSchema = z.object({
  name: z.string().max(80).optional(),
  email: z.string().email().max(120).optional(),
  class_level: z.enum(['9', '10', '11', '12', 'ug', 'pg', 'other']).optional(),
});

export async function POST(request: NextRequest) {
  const ip = requestIp(request);
  const rl = rateLimit(`ce-pp-${ip}`, 10);
  if (!rl.ok) return errorResponse('Too many requests', 429);

  try {
    const body = await request.json().catch(() => ({}));
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) return errorResponse('Invalid payload', 400);

    const user = await getAuthenticatedUser(request);
    await connectToDatabase();
    const id = randomUUID();
    const profile = await CareerProfile.create({
      _id: id,
      user_id: user?.id,
      meta: {
        name: parsed.data.name,
        email: parsed.data.email ?? user?.email,
        class_level: parsed.data.class_level,
      },
      responses: [],
      scores: EMPTY_SCORES(),
      constraints: {},
      status: 'in_progress',
      progress_pct: 0,
    });
    return NextResponse.json({ profile: profile.toObject() }, { status: 201 });
  } catch (e) {
    console.error('POST /career-explorer/profiles', e);
    return errorResponse('Failed to start session');
  }
}
