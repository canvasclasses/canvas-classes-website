// GET a profile — owner or admin only. Anonymous profiles can be fetched
// with just the profile id (treated as an unguessable UUID bearer token),
// which is the compromise we accept to allow students to run the quiz
// without forcing signup first.

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { CareerProfile } from '@/lib/models/CareerProfile';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth';
import { errorResponse } from '../../_shared';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    await connectToDatabase();
    const profile = await CareerProfile.findById(id).lean<{ user_id?: string } | null>();
    if (!profile) return errorResponse('Not found', 404);

    // Owner check: if user_id is set, require matching user; if null (anon),
    // the UUID in the URL is the bearer.
    if (profile.user_id) {
      const user = await getAuthenticatedUser(request);
      if (!user || (user.id !== profile.user_id && !isAdmin(user.email))) {
        return errorResponse('Unauthorized', 401);
      }
    }

    return NextResponse.json({ profile });
  } catch (e) {
    console.error('GET /career-explorer/profiles/[id]', e);
    return errorResponse('Failed to load profile');
  }
}
