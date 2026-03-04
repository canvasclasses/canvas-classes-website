import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import connectToDatabase from '@/lib/mongodb';
import { UserProgress } from '@/lib/models/UserProgress';

async function getUserId(req: NextRequest): Promise<string | null> {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user.id;
}

// ─── POST /api/v2/user/starred ────────────────────────────────────────────────
// Body: { question_id, chapter_id, action: 'star' | 'unstar' }
export async function POST(req: NextRequest) {
    try {
        const userId = await getUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { question_id, chapter_id, action } = await req.json();
        if (!question_id || !chapter_id || !['star', 'unstar'].includes(action)) {
            return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
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

        const alreadyStarred = progress.starred_questions.some(
            (s: any) => s.question_id === question_id
        );

        if (action === 'star' && !alreadyStarred) {
            progress.starred_questions.push({ question_id, chapter_id, starred_at: new Date() });
            progress.updated_at = new Date();
            await progress.save();
        } else if (action === 'unstar' && alreadyStarred) {
            progress.starred_questions = progress.starred_questions.filter(
                (s: any) => s.question_id !== question_id
            );
            progress.updated_at = new Date();
            await progress.save();
        }
        // else: idempotent no-op

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[POST /api/v2/user/starred]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
