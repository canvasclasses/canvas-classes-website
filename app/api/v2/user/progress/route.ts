import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import connectToDatabase from '@/lib/mongodb';
import { UserProgress, IQuestionAttempt } from '@/lib/models/UserProgress';

async function getUserId(req: NextRequest): Promise<string | null> {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    // SECURITY FIX: Use anon key instead of service role key
    // Service role key bypasses RLS and should NEVER be used in client-accessible routes
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user.id;
}

// ─── GET /api/v2/user/progress?chapterId=xxx ──────────────────────────────────
// Returns: starred_ids for this chapter, all_attempted_ids for this chapter,
//          last 3 test session question sets for this chapter (for overlap check)
export async function GET(req: NextRequest) {
    try {
        const userId = await getUserId(req);
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
        const userId = await getUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const {
            question_id, display_id, chapter_id, difficulty,
            concept_tags = [], is_correct, time_spent_seconds = 0,
            selected_option = null, source = 'browse',
        } = body;

        if (!question_id || !chapter_id || is_correct === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();

        // Upsert: create document if user has never practised before
        let progress = await UserProgress.findById(userId);
        if (!progress) {
            progress = new UserProgress({
                _id: userId,
                user_email: '', // filled on profile completion
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
        };

        await progress.recordAttempt(attempt);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[POST /api/v2/user/progress]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
