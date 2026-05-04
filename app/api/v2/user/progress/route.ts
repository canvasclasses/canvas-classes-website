import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { UserProgress, IQuestionAttempt } from '@/lib/models/UserProgress';
import { StudentChapterProfile, IStudentChapterProfile } from '@/lib/models/StudentChapterProfile';
import { updateProfileFromAttempt, createEmptyProfile } from '@/lib/profileEngine';
import { getUserIdFromRequest } from '@/lib/auth';

// ─── GET /api/v2/user/progress?chapterId=xxx ──────────────────────────────────
// Returns: starred_ids for this chapter, all_attempted_ids for this chapter,
//          last 3 test session question sets for this chapter (for overlap check)
export async function GET(req: NextRequest) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const chapterId = req.nextUrl.searchParams.get('chapterId');

        await connectToDatabase();
        interface StarredQuestion {
            question_id: string;
            chapter_id?: string;
            starred_at?: Date;
        }
        interface AttemptedId {
            question_id: string;
            chapter_id: string;
            difficulty?: string;
            times_attempted?: number;
            times_correct?: number;
            last_correct_at?: Date;
        }
        interface TestSession {
            chapter_id: string;
            started_at: Date;
            question_ids: string[];
        }

        const progress = await UserProgress.findById(userId).lean() as unknown as {
            starred_questions?: StarredQuestion[];
            all_attempted_ids?: AttemptedId[];
            test_sessions?: TestSession[];
        } | null;

        if (!progress) {
            // New user — return empty sets
            return NextResponse.json({
                starred_ids: [],
                attempted_ids: [],
                last_3_sessions: [],
            });
        }

        // Starred IDs — all chapters (needed for the star button across pages)
        const starred_ids: string[] = (progress.starred_questions ?? []).map(
            (s: StarredQuestion) => s.question_id
        );

        // Attempted IDs — filtered to this chapter if provided
        const all_attempted: AttemptedId[] = progress.all_attempted_ids ?? [];
        const attempted_ids = chapterId
            ? all_attempted.filter((e: AttemptedId) => e.chapter_id === chapterId)
            : all_attempted;

        // Last 3 test sessions for this chapter
        const all_sessions: TestSession[] = progress.test_sessions ?? [];
        const chapter_sessions = chapterId
            ? all_sessions.filter((s: TestSession) => s.chapter_id === chapterId)
            : all_sessions;
        const last_3_sessions = chapter_sessions
            .sort((a: TestSession, b: TestSession) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
            .slice(0, 3)
            .map((s: TestSession) => s.question_ids);

        return NextResponse.json({ starred_ids, attempted_ids, last_3_sessions });
    } catch (err) {
        console.error('[GET /api/v2/user/progress]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// ─── POST /api/v2/user/progress ──────────────────────────────────────────────
// Body: { question_id, display_id, chapter_id, difficulty, concept_tags,
//         is_correct, time_spent_seconds, selected_option, source }
// Records a question attempt; upserts the UserProgress document.
export async function POST(req: NextRequest) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const {
            question_id, display_id, chapter_id, difficulty,
            concept_tags = [], is_correct, time_spent_seconds = 0,
            selected_option = null, source = 'browse',
            confidence, session_id,
            // Persona unification — required to feed StudentChapterProfile.
            // Falls back to '_untagged' if the question has no microConcept.
            micro_concept,
        } = body;

        if (!question_id || !chapter_id || is_correct === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Tiered signal — see CRUCIBLE_ARCHITECTURE.md §3.2.
        // Default by source: test/guided → high, browse → medium.
        // Client may override (e.g. casual-tagged retroactively → low).
        const ALLOWED_CONFIDENCE = ['high', 'medium', 'low'] as const;
        const confidenceTier =
            ALLOWED_CONFIDENCE.includes(confidence)
                ? (confidence as 'high' | 'medium' | 'low')
                : (source === 'test' || source === 'guided' ? 'high' : 'medium');

        await connectToDatabase();

        const attempt: IQuestionAttempt = {
            question_id,
            display_id: display_id ?? question_id.slice(0, 8).toUpperCase(),
            chapter_id,
            is_correct,
            time_spent_seconds,
            attempted_at: new Date(),
            difficulty: difficulty ?? 'Medium',
            concept_tags,
            source,
            selected_option,
            confidence: confidenceTier,
            session_id: typeof session_id === 'string' ? session_id : undefined,
        };

        // Retry loop: optimistic concurrency on UserProgress means a
        // VersionError is thrown if another request modified the document
        // between our read and save. Retry up to 3 times.
        const MAX_RETRIES = 3;
        for (let attempt_num = 0; attempt_num <= MAX_RETRIES; attempt_num++) {
            try {
                let progress = await UserProgress.findById(userId);
                if (!progress) {
                    progress = new UserProgress({
                        _id: userId,
                        user_email: '',
                        recent_attempts: [],
                        all_attempted_ids: [],
                        starred_questions: [],
                        test_sessions: [],
                        chapter_progress: new Map(),
                        concept_mastery: new Map(),
                        stats: {},
                        current_session: null,
                    });
                }
                await progress.recordAttempt(attempt);
                break; // success
            } catch (concurrencyErr: unknown) {
                const isVersionError =
                    concurrencyErr instanceof Error && concurrencyErr.name === 'VersionError';
                if (isVersionError && attempt_num < MAX_RETRIES) {
                    continue; // re-read and retry
                }
                throw concurrencyErr;
            }
        }

        // ── Persona unification (audit #5). Mirror the attempt into
        // StudentChapterProfile so the multi-dimensional persona reflects
        // browse/test signal too — not just guided practice. Tier-gated
        // inside updateProfileFromAttempt: only HIGH-confidence attempts
        // move the profile. Failure here is non-fatal — primary write
        // (UserProgress) already succeeded.
        if (confidenceTier === 'high') {
            try {
                for (let p = 0; p <= MAX_RETRIES; p++) {
                    try {
                        let profile = await StudentChapterProfile.findOne({
                            studentId: userId,
                            chapterId: chapter_id,
                        }) as (IStudentChapterProfile & { save: () => Promise<unknown> }) | null;
                        if (!profile) {
                            profile = new StudentChapterProfile(createEmptyProfile(userId, chapter_id)) as unknown as typeof profile;
                        }
                        const updated = updateProfileFromAttempt(profile as unknown as IStudentChapterProfile, {
                            questionId: question_id,
                            microConcept: typeof micro_concept === 'string' && micro_concept ? micro_concept : '_untagged',
                            answeredCorrectly: !!is_correct,
                            timestamp: attempt.attempted_at,
                            confidence: confidenceTier,
                        });
                        await StudentChapterProfile.findOneAndUpdate(
                            { studentId: userId, chapterId: chapter_id },
                            { $set: updated },
                            { upsert: true, new: true, setDefaultsOnInsert: true },
                        );
                        break;
                    } catch (e: unknown) {
                        if (e instanceof Error && e.name === 'VersionError' && p < MAX_RETRIES) continue;
                        throw e;
                    }
                }
            } catch (profileErr) {
                console.error('[POST /api/v2/user/progress] persona update failed (non-fatal)', profileErr);
            }
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[POST /api/v2/user/progress]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
