import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { UserProgress } from '@/lib/models/UserProgress';
import { trackServer } from '@/lib/analytics/mixpanel.server';

// ─── POST /api/v2/user/test-session ──────────────────────────────────────────
// Body: { chapter_id, question_ids: string[], config: { count, mix } }
// Called when a test begins. Stores the session so future tests can
// measure overlap and avoid repeating the same question set.
export async function POST(req: NextRequest) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { chapter_id, question_ids, config } = await req.json();
        if (!chapter_id || !Array.isArray(question_ids) || question_ids.length === 0) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        await connectToDatabase();

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

        // Prepend new session, keep only the last 10
        progress.test_sessions.unshift({
            chapter_id,
            question_ids,
            started_at: new Date(),
            config: config ?? {},
        });
        if (progress.test_sessions.length > 10) {
            progress.test_sessions = progress.test_sessions.slice(0, 10);
        }

        progress.updated_at = new Date();
        await progress.save();

        await trackServer(userId, 'practice_session_started', {
            chapter_id,
            mode: config?.difficulty_mix ?? config?.mix ?? 'guided',
            question_count: question_ids.length,
            difficulty_range: config?.difficulty_mix ?? config?.difficulty_range,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[POST /api/v2/user/test-session]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
