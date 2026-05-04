import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import TestResult from '@/lib/models/TestResult';
import { QuestionV2 } from '@/lib/models/Question.v2';
import { nanoid } from 'nanoid';
import {
    trackServer,
    peopleSetServer,
    peopleIncrementServer,
} from '@/lib/analytics/mixpanel.server';

// Subset of Question shape we need to recompute correctness server-side.
interface CanonicalQuestion {
    _id: string;
    type: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC' | 'SUBJ' | 'WKEX';
    options?: Array<{ id: string; is_correct: boolean }>;
    answer?: { integer_value?: number; correct_option?: string };
}

/**
 * Recompute whether a single attempt is correct using the CANONICAL question
 * doc — never the client's `is_correct` claim. This closes the audit-#8
 * mass-assignment hole (a malicious client could previously POST `score:{
 * correct: 50, total: 50 }` for a 5-Q test and the dashboard would show 100%).
 */
function recomputeCorrect(
    q: CanonicalQuestion,
    selected: unknown,
): boolean {
    if (selected === null || selected === undefined || selected === '') return false;
    if (q.type === 'NVT') {
        const expected = q.answer?.integer_value;
        if (expected === undefined || expected === null) return false;
        const userNum = Number(typeof selected === 'string' ? selected.trim() : selected);
        return Number.isFinite(userNum) && userNum === expected;
    }
    if (q.type === 'MCQ') {
        const userArr: string[] = Array.isArray(selected)
            ? selected.filter((x): x is string => typeof x === 'string')
            : [];
        const correctIds = (q.options ?? []).filter(o => o.is_correct).map(o => o.id);
        if (userArr.length !== correctIds.length || correctIds.length === 0) return false;
        return correctIds.every(id => userArr.includes(id));
    }
    // SCQ / AR / MST / MTC — single selected option id
    if (typeof selected !== 'string') return false;
    return !!q.options?.find(o => o.id === selected && o.is_correct);
}

// ─── POST /api/v2/test-results ───────────────────────────────────────────────
// Body: { chapter_id, test_config, questions, timing, saved_to_progress }
//
// Note: the client's `score` and per-question `is_correct` are IGNORED — both
// are recomputed server-side from QuestionV2 docs. Audit-#8 fix.
export async function POST(req: NextRequest) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { chapter_id, test_config, questions, timing, saved_to_progress } = body;

        if (!chapter_id || !test_config || !Array.isArray(questions) || questions.length === 0 || !timing) {
            return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
        }
        if (questions.length > 200) {
            return NextResponse.json({ error: 'Too many questions in test' }, { status: 400 });
        }

        await connectToDatabase();

        // Pre-validate body shape (cheap structural check before the DB hop).
        interface ClientQuestionEntry {
            question_id?: unknown;
            display_id?: unknown;
            difficulty?: unknown;
            selected_option?: unknown;
            time_spent_seconds?: unknown;
            marked_for_review?: unknown;
        }
        const clientQs = questions as ClientQuestionEntry[];
        const ids = clientQs
            .map(q => (typeof q.question_id === 'string' ? q.question_id : null))
            .filter((x): x is string => !!x);
        if (ids.length !== clientQs.length) {
            return NextResponse.json({ error: 'Invalid question_id in payload' }, { status: 400 });
        }

        // Fetch canonical question docs in one round-trip.
        const canonicals = await QuestionV2.find(
            { _id: { $in: ids }, deleted_at: null },
            { _id: 1, type: 1, options: { id: 1, is_correct: 1 }, answer: 1 },
        ).lean<CanonicalQuestion[]>();
        const byId = new Map(canonicals.map(c => [c._id, c]));

        // Recompute per-question correctness + score, never trusting client.
        let correct = 0;
        const verifiedQuestions = clientQs.map(cq => {
            const qid = cq.question_id as string;
            const canon = byId.get(qid);
            // If the question has been deleted or the id is unknown, treat as
            // wrong (safer than awarding a point for a non-existent question).
            const isCorrect = canon ? recomputeCorrect(canon, cq.selected_option) : false;
            if (isCorrect) correct += 1;
            return {
                question_id: qid,
                display_id: typeof cq.display_id === 'string' ? cq.display_id : qid.slice(0, 8).toUpperCase(),
                difficulty: cq.difficulty,             // cosmetic only — schema accepts Mixed
                is_correct: isCorrect,                  // ← server-computed, not client-supplied
                selected_option: cq.selected_option as string | string[] | number | boolean | null,
                time_spent_seconds: typeof cq.time_spent_seconds === 'number' ? cq.time_spent_seconds : 0,
                marked_for_review: !!cq.marked_for_review,
            };
        });

        const total = verifiedQuestions.length;
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        const verifiedScore = { correct, total, percentage };

        const testResult = new TestResult({
            _id: nanoid(16),
            user_id: userId,
            chapter_id,
            test_config,                          // schema enforces enum (incl. 'custom')
            questions: verifiedQuestions,
            score: verifiedScore,                 // ← canonical, derived from QuestionV2
            timing,
            saved_to_progress: saved_to_progress ?? false,
        });

        await testResult.save();

        const duration_sec = timing?.total_seconds ?? 0;

        await Promise.all([
            trackServer(userId, 'practice_session_completed', {
                chapter_id,
                mode: test_config?.difficulty_mix ?? 'guided',
                accuracy: percentage,
                duration_sec,
                correct_count: correct,
                total_count: total,
                session_id: testResult._id?.toString() ?? testResult.id,
            }),
            peopleSetServer(userId, { last_active_at: new Date().toISOString() }),
            peopleIncrementServer(userId, {
                total_questions_answered: total,
                total_practice_minutes: Math.round(duration_sec / 60),
            }),
        ]).catch((err) => console.error('[analytics test-results]', err));

        return NextResponse.json({
            success: true,
            test_result_id: testResult._id,
            score: verifiedScore,
            message: 'Test result saved successfully',
        });
    } catch (err) {
        console.error('[POST /api/v2/test-results]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// ─── GET /api/v2/test-results?chapterId=xxx&limit=10 ─────────────────────────
// Returns: list of test results for the user, optionally filtered by chapter
export async function GET(req: NextRequest) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const chapterId = req.nextUrl.searchParams.get('chapterId');
        const limitParam = req.nextUrl.searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam, 10) : 20;

        await connectToDatabase();

        const query: Record<string, unknown> = { user_id: userId };
        if (chapterId) query.chapter_id = chapterId;

        const results = await TestResult.find(query)
            .sort({ created_at: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json({ 
            success: true, 
            results,
            count: results.length 
        });
    } catch (err) {
        console.error('[GET /api/v2/test-results]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
