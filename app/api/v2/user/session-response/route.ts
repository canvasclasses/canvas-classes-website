import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import connectToDatabase from '@/lib/mongodb';
import { StudentResponse } from '@/lib/models/StudentResponse';
import { StudentChapterProfile } from '@/lib/models/StudentChapterProfile';
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

// ─── POST /api/v2/user/session-response ──────────────────────────────────────
// Records a single question attempt during a guided practice session.
// Called immediately after the student provides micro-feedback (and optionally stuckPoint).
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      sessionId,
      questionId,
      chapterId = '',
      primaryConcept = '',
      microConcept = '',
      answeredCorrectly,
      timeSpentMs,
      viewedSolutionBeforeAnswer = false,
      microFeedback,
      stuckPoint = null,
      sessionPhase,
      positionInSession,
    } = body;

    // Validate required fields
    if (!sessionId || !questionId || answeredCorrectly === undefined || !microFeedback || !sessionPhase || positionInSession === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, questionId, answeredCorrectly, microFeedback, sessionPhase, positionInSession' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const doc = await StudentResponse.create({
      studentId: userId,
      sessionId,
      questionId,
      primaryConcept,
      microConcept,
      answeredCorrectly,
      timeSpentMs: timeSpentMs ?? 0,
      viewedSolutionBeforeAnswer,
      microFeedback,
      stuckPoint,
      sessionPhase,
      positionInSession,
      timestamp: new Date(),
    });

    // Also update the StudentChapterProfile if chapterId is provided
    if (chapterId) {
      try {
        let profileDoc = await StudentChapterProfile.findOne({ studentId: userId, chapterId });
        let profileData: any = profileDoc ? profileDoc.toObject() : createEmptyProfile(userId, chapterId);
        const updatedProfile = updateProfileFromResponse(profileData, {
          studentId: userId,
          sessionId,
          questionId,
          primaryConcept,
          microConcept,
          answeredCorrectly,
          timeSpentMs: timeSpentMs ?? 0,
          viewedSolutionBeforeAnswer,
          microFeedback,
          stuckPoint,
          sessionPhase,
          positionInSession,
          timestamp: new Date(),
        });
        await StudentChapterProfile.findOneAndUpdate(
          { studentId: userId, chapterId },
          { $set: updatedProfile },
          { upsert: true }
        );
      } catch (profileErr) {
        // Profile update is best-effort — don't fail the response write
        console.error('[session-response] profile update error:', profileErr);
      }
    }

    return NextResponse.json({ success: true, id: doc._id });
  } catch (err) {
    console.error('[POST /api/v2/user/session-response]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
