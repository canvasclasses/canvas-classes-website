import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import connectToDatabase from '@/lib/mongodb';
import { UserProgress } from '@/lib/models/UserProgress';

async function getUserId(req: NextRequest): Promise<string | null> {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    // SECURITY FIX: Use anon key instead of service role key
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user.id;
}

// ─── POST /api/v2/user/test-session ──────────────────────────────────────────
// Body: { chapter_id, question_ids: string[], config: { count, mix } }
// Called when a test begins. Stores the session so future tests can
// measure overlap and avoid repeating the same question set.
export async function POST(req: NextRequest) {
    try {
        const userId = await getUserId(req);
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

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[POST /api/v2/user/test-session]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
