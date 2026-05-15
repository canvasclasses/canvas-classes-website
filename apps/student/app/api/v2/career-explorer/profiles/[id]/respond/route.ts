// Record a single question response on a profile. Runs applyResponse which
// mutates scores/constraints in-place. Kept as its own endpoint so partial
// progress is always persisted.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectToDatabase from '@/lib/mongodb';
import { CareerProfile } from '@/lib/models/CareerProfile';
import { CareerQuestion } from '@/lib/models/CareerQuestion';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth';
import { errorResponse, rateLimit, requestIp } from '../../../_shared';
import { applyResponse } from '@/lib/careerExplorer/applyResponse';
import type { ICareerQuestion } from '@/lib/models/CareerQuestion';

const RespondSchema = z.object({
  question_id: z.string().min(1).max(64),
  option_id: z.string().min(1).max(32).optional(),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  progress_pct: z.number().min(0).max(100).optional(),
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const ip = requestIp(request);
  const rl = rateLimit(`ce-resp-${ip}`, 120);
  if (!rl.ok) return errorResponse('Too many requests', 429);

  try {
    const body = await request.json();
    const parsed = RespondSchema.safeParse(body);
    if (!parsed.success) return errorResponse('Invalid payload', 400);

    await connectToDatabase();
    const profile = await CareerProfile.findById(id);
    if (!profile) return errorResponse('Not found', 404);

    if (profile.user_id) {
      const user = await getAuthenticatedUser(request);
      if (!user || (user.id !== profile.user_id && !isAdmin(user.email))) {
        return errorResponse('Unauthorized', 401);
      }
    }

    const question = await CareerQuestion.findById(parsed.data.question_id).lean<ICareerQuestion | null>();
    if (!question) return errorResponse('Unknown question', 400);

    applyResponse(profile, {
      question,
      option_id: parsed.data.option_id,
      value: parsed.data.value,
    });

    if (parsed.data.progress_pct !== undefined) profile.progress_pct = parsed.data.progress_pct;
    profile.updated_at = new Date();
    profile.markModified('scores');
    profile.markModified('constraints');
    profile.markModified('responses');
    await profile.save();

    return NextResponse.json({ ok: true, progress_pct: profile.progress_pct });
  } catch (e) {
    console.error('PATCH /career-explorer/profiles/[id]/respond', e);
    return errorResponse('Failed to save response');
  }
}
