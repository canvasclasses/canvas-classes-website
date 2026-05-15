// Finalise a profile and run matching. Idempotent — rerunning clears and
// recomputes CareerMatch rows for the profile.

import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import connectToDatabase from '@/lib/mongodb';
import { CareerProfile } from '@/lib/models/CareerProfile';
import { CareerPath } from '@/lib/models/CareerPath';
import { CareerMatch } from '@/lib/models/CareerMatch';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth';
import { errorResponse, rateLimit, requestIp } from '../../../_shared';
import { scoreMatches } from '@/lib/careerExplorer/scoring';
import type { ICareerProfile } from '@/lib/models/CareerProfile';
import type { ICareerPath } from '@/lib/models/CareerPath';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const ip = requestIp(request);
  const rl = rateLimit(`ce-sub-${ip}`, 10);
  if (!rl.ok) return errorResponse('Too many requests', 429);

  try {
    await connectToDatabase();
    const profile = await CareerProfile.findById(id);
    if (!profile) return errorResponse('Not found', 404);

    if (profile.user_id) {
      const user = await getAuthenticatedUser(request);
      if (!user || (user.id !== profile.user_id && !isAdmin(user.email))) {
        return errorResponse('Unauthorized', 401);
      }
    }

    const careers = await CareerPath.find({ is_active: true }).limit(500).lean<ICareerPath[]>();
    const matches = scoreMatches(profile.toObject() as ICareerProfile, careers);

    // Replace any prior matches for this profile.
    await CareerMatch.deleteMany({ profile_id: id });
    if (matches.length) {
      const now = new Date();
      await CareerMatch.insertMany(
        matches.map((m) => ({
          _id: randomUUID(),
          profile_id: id,
          career_id: m.career_id,
          computed_score: m.score,
          computed_bucket: m.bucket,
          computed_breakdown: m.breakdown,
          exclusion_reasons: m.exclusion_reasons,
          created_at: now,
          updated_at: now,
        })),
      );
    }

    profile.status = 'completed';
    profile.completed_at = new Date();
    profile.progress_pct = 100;
    profile.updated_at = new Date();
    await profile.save();

    return NextResponse.json({ ok: true, match_count: matches.length });
  } catch (e) {
    console.error('POST /career-explorer/profiles/[id]/submit', e);
    return errorResponse('Failed to submit');
  }
}
