import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import connectToDatabase from '@/lib/mongodb';
import { StudentChapterProfile } from '@/lib/models/StudentChapterProfile';
import { StudentResponse } from '@/lib/models/StudentResponse';
import { updateProfileFromResponse, createEmptyProfile } from '@/lib/profileEngine';

async function getUserId(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

// ─── GET /api/v2/user/chapter-profile?chapterId=xxx ──────────────────────────
// Returns the student's multi-dimensional profile for a chapter.
// If none exists, returns a fresh empty profile.
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const chapterId = req.nextUrl.searchParams.get('chapterId');
    if (!chapterId) {
      return NextResponse.json({ error: 'chapterId is required' }, { status: 400 });
    }

    await connectToDatabase();
    const profile = await StudentChapterProfile.findOne({ studentId: userId, chapterId }).lean();

    if (!profile) {
      return NextResponse.json({ profile: createEmptyProfile(userId, chapterId) });
    }

    return NextResponse.json({ profile });
  } catch (err) {
    console.error('[GET /api/v2/user/chapter-profile]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── POST /api/v2/user/chapter-profile ───────────────────────────────────────
// Updates the student's chapter profile based on a new StudentResponse.
// Body: { chapterId, responseId } OR inline response data.
// Called by the session-response API or by AdaptiveSession after writing a response.
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { chapterId, response: inlineResponse } = body;

    if (!chapterId) {
      return NextResponse.json({ error: 'chapterId is required' }, { status: 400 });
    }
    if (!inlineResponse) {
      return NextResponse.json({ error: 'response data is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Load or create profile
    let profileDoc = await StudentChapterProfile.findOne({ studentId: userId, chapterId });
    let profileData: any;

    if (profileDoc) {
      profileData = profileDoc.toObject();
    } else {
      profileData = createEmptyProfile(userId, chapterId);
    }

    // Run pure-function update
    const updatedProfile = updateProfileFromResponse(profileData, {
      ...inlineResponse,
      studentId: userId,
    });

    // Upsert back to DB
    await StudentChapterProfile.findOneAndUpdate(
      { studentId: userId, chapterId },
      { $set: updatedProfile },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (err) {
    console.error('[POST /api/v2/user/chapter-profile]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
