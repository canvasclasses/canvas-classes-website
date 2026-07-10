import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import connectToDatabase from '@canvas/data/db/mongodb';
import { StudentResponse } from '@canvas/data/models/StudentResponse';
import { StudentChapterProfile, IStudentChapterProfile } from '@canvas/data/models/StudentChapterProfile';
import { QuestionV2 } from '@canvas/data/models/Question.v2';
import { updateProfileFromResponse, createEmptyProfile } from '@canvas/persona/profile-engine';
import { isAnswerCorrect, type ScorableQuestion } from '@canvas/persona/scoring';
import { resolveTenantId } from '@canvas/data/tenancy';

type CanonicalQuestion = ScorableQuestion & { _id: string };

// ─── POST /api/v2/user/session-response ──────────────────────────────────────
// Records a single question attempt during a guided practice session.
// Called immediately after the student provides micro-feedback (and optionally stuckPoint).
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
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
      selectedOption,
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

    // Recompute correctness server-side from the canonical question, never
    // trusting the client (mirrors the test-results / progress-batch routes).
    // Backward-compatible: only override when the client actually sent the raw
    // selection AND the question is found — otherwise fall back to the client's
    // value (older clients that don't send selectedOption keep working).
    let effectiveCorrect: boolean = !!answeredCorrectly;
    if (selectedOption !== undefined) {
      const canon = await QuestionV2.findOne(
        { _id: questionId, deleted_at: null },
        { _id: 1, type: 1, options: { id: 1, is_correct: 1 }, answer: 1 },
      ).lean<CanonicalQuestion | null>();
      if (canon) effectiveCorrect = isAnswerCorrect(canon, selectedOption);
    }

    const doc = await StudentResponse.create({
      studentId: userId,
      sessionId,
      questionId,
      primaryConcept,
      microConcept,
      answeredCorrectly: effectiveCorrect,
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
        let profileData: IStudentChapterProfile = profileDoc ? profileDoc.toObject() : createEmptyProfile(userId, chapterId, await resolveTenantId(userId));
        const updatedProfile = updateProfileFromResponse(profileData, {
          studentId: userId,
          sessionId,
          questionId,
          primaryConcept,
          microConcept,
          answeredCorrectly: effectiveCorrect,
          timeSpentMs: timeSpentMs ?? 0,
          viewedSolutionBeforeAnswer,
          microFeedback,
          stuckPoint,
          sessionPhase,
          positionInSession,
          timestamp: new Date(),
        } as Parameters<typeof updateProfileFromResponse>[1]);
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
