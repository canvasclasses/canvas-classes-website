// List matches for a profile, joined with career summaries. The UI calls
// this once after submit to render the three curated lists.

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { CareerProfile } from '@/lib/models/CareerProfile';
import { CareerMatch } from '@/lib/models/CareerMatch';
import { CareerPath } from '@/lib/models/CareerPath';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth';
import { errorResponse, rateLimit, requestIp } from '../../../_shared';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const ip = requestIp(request);
  const rl = rateLimit(`ce-m-${ip}`, 60);
  if (!rl.ok) return errorResponse('Too many requests', 429);

  try {
    await connectToDatabase();
    const p = await CareerProfile.findById(id).lean<{ user_id?: string } | null>();
    if (!p) return errorResponse('Not found', 404);

    if (p.user_id) {
      const user = await getAuthenticatedUser(request);
      if (!user || (user.id !== p.user_id && !isAdmin(user.email))) {
        return errorResponse('Unauthorized', 401);
      }
    }

    type MatchDoc = {
      _id: unknown;
      career_id: string;
      computed_score: number;
      computed_bucket: string;
      computed_breakdown?: unknown;
      exclusion_reasons?: string[];
      admin_override?: { bucket: string } | null;
    };
    type CareerDoc = { _id: string } & Record<string, unknown>;

    const matches = await CareerMatch.find({ profile_id: id }).sort({ computed_score: -1 }).limit(200).lean<MatchDoc[]>();
    const careerIds = matches.map((m) => m.career_id);
    const careers = await CareerPath.find({ _id: { $in: careerIds } }).lean<CareerDoc[]>();
    const careerById = new Map<string, CareerDoc>(careers.map((c) => [c._id, c]));

    const hydrated = matches.map((m) => {
      const effectiveBucket = m.admin_override?.bucket ?? m.computed_bucket;
      return {
        _id: m._id,
        career_id: m.career_id,
        career: careerById.get(m.career_id) ?? null,
        score: m.computed_score,
        bucket: effectiveBucket,
        breakdown: m.computed_breakdown,
        exclusion_reasons: m.exclusion_reasons ?? [],
        admin_override: m.admin_override ?? null,
      };
    });

    const strong_fits = hydrated.filter((m) => m.bucket === 'strong_fit').slice(0, 5);
    const hidden_gems = hydrated.filter((m) => m.bucket === 'hidden_gem').slice(0, 3);
    const stretch = hydrated.filter((m) => m.bucket === 'stretch').slice(0, 3);

    return NextResponse.json({ profile: p, lists: { strong_fits, hidden_gems, stretch }, all: hydrated });

  } catch (e) {
    console.error('GET /career-explorer/profiles/[id]/matches', e);
    return errorResponse('Failed to load matches');
  }
}
