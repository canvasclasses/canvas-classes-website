import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { UserProgress } from '@/lib/models/UserProgress';
import { QuestionV2 } from '@/lib/models/Question.v2';

interface StarredEntry {
    question_id: string;
    chapter_id: string;
    starred_at: Date;
}

// ─── GET /api/v2/user/starred ─────────────────────────────────────────────────
// Returns full question documents for all starred questions.
// Optional query param: ?chapterId=ch11_atom  to filter by chapter
export async function GET(req: NextRequest) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        const progress = await UserProgress.findById(userId).lean() as unknown as {
            starred_questions?: StarredEntry[];
        } | null;
        if (!progress || !progress.starred_questions?.length) {
            return NextResponse.json({ success: true, questions: [], total: 0 });
        }

        const chapterId = req.nextUrl.searchParams.get('chapterId');

        // Filter starred entries by chapter if requested
        const starredEntries: StarredEntry[] =
            chapterId
                ? progress.starred_questions.filter((s: StarredEntry) => s.chapter_id === chapterId)
                : progress.starred_questions;

        if (starredEntries.length === 0) {
            return NextResponse.json({ success: true, questions: [], total: 0 });
        }

        const questionIds = starredEntries.map((s: StarredEntry) => s.question_id);

        // Fetch full question documents from questions_v2
        const questions = await QuestionV2.find({
            _id: { $in: questionIds },
            deleted_at: null,
            status: { $in: ['published', 'review'] },
        }).lean();

        // Sort questions to match the starred_questions order (most recently starred first)
        const idToStarredAt: Record<string, Date> = {};
        starredEntries.forEach((s: StarredEntry) => { idToStarredAt[s.question_id] = s.starred_at; });
        questions.sort((a: unknown, b: unknown) => {
            const aId = (a as Record<string, unknown>)._id as string;
            const bId = (b as Record<string, unknown>)._id as string;
            const ta = new Date(idToStarredAt[aId] ?? 0).getTime();
            const tb = new Date(idToStarredAt[bId] ?? 0).getTime();
            return tb - ta; // most recently starred first
        });

        return NextResponse.json({ success: true, questions, total: questions.length });
    } catch (err) {
        console.error('[GET /api/v2/user/starred]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// ─── POST /api/v2/user/starred ────────────────────────────────────────────────
// Body: { question_id, chapter_id, action: 'star' | 'unstar' }
export async function POST(req: NextRequest) {
    try {
        const userId = await getUserIdFromRequest(req);
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
            (s: StarredEntry) => s.question_id === question_id
        );

        if (action === 'star' && !alreadyStarred) {
            progress.starred_questions.push({ question_id, chapter_id, starred_at: new Date() });
            progress.updated_at = new Date();
            await progress.save();
        } else if (action === 'unstar' && alreadyStarred) {
            progress.starred_questions = progress.starred_questions.filter(
                (s: StarredEntry) => s.question_id !== question_id
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
