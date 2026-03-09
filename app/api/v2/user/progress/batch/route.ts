import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import connectToDatabase from '@/lib/mongodb';
import { UserProgress } from '@/lib/models/UserProgress';

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

// ─── POST /api/v2/user/progress/batch ────────────────────────────────────────
// Body: { attempts: Array<{ question_id, display_id, chapter_id, difficulty, 
//                           concept_tags, is_correct, selected_option, source }> }
// Batch saves multiple question attempts in a single transaction
export async function POST(req: NextRequest) {
    try {
        const userId = await getUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { attempts } = body;

        if (!Array.isArray(attempts) || attempts.length === 0) {
            return NextResponse.json({ error: 'Invalid attempts array' }, { status: 400 });
        }

        await connectToDatabase();

        // Upsert: create document if user has never practised before
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

        const now = new Date();
        let totalCorrect = 0;
        let totalAttempted = 0;

        // Process each attempt
        for (const attempt of attempts) {
            const {
                question_id,
                display_id,
                chapter_id,
                difficulty,
                concept_tags = [],
                is_correct,
                selected_option = null,
                source = 'test',
                time_spent_seconds = 0,
            } = attempt;

            if (!question_id || !chapter_id || is_correct === undefined) {
                continue; // Skip invalid attempts
            }

            totalAttempted++;
            if (is_correct) totalCorrect++;

            // Update all_attempted_ids
            const existingIdx = progress.all_attempted_ids.findIndex(
                (e: any) => e.question_id === question_id
            );

            if (existingIdx >= 0) {
                const entry = progress.all_attempted_ids[existingIdx];
                entry.times_attempted = (entry.times_attempted || 0) + 1;
                if (is_correct) {
                    entry.times_correct = (entry.times_correct || 0) + 1;
                    entry.last_correct_at = now;
                }
            } else {
                progress.all_attempted_ids.push({
                    question_id,
                    chapter_id,
                    difficulty,
                    times_attempted: 1,
                    times_correct: is_correct ? 1 : 0,
                    last_correct_at: is_correct ? now : undefined,
                });
            }

            // Add to recent_attempts (keep last 100)
            progress.recent_attempts.unshift({
                question_id,
                display_id,
                chapter_id,
                difficulty,
                concept_tags,
                is_correct,
                selected_option,
                attempted_at: now,
                source,
                time_spent_seconds,
            });
            if (progress.recent_attempts.length > 100) {
                progress.recent_attempts = progress.recent_attempts.slice(0, 100);
            }

            // Update concept mastery
            for (const tag of concept_tags) {
                const existing = progress.concept_mastery.get(tag);
                if (existing) {
                    existing.times_attempted = (existing.times_attempted || 0) + 1;
                    if (is_correct) existing.times_correct = (existing.times_correct || 0) + 1;
                    existing.last_attempted_at = now;
                } else {
                    progress.concept_mastery.set(tag, {
                        times_attempted: 1,
                        times_correct: is_correct ? 1 : 0,
                        last_attempted_at: now,
                    });
                }
            }
        }

        // Update global stats
        if (!progress.stats) progress.stats = {};
        progress.stats.total_questions_attempted = (progress.stats.total_questions_attempted || 0) + totalAttempted;
        progress.stats.total_correct = (progress.stats.total_correct || 0) + totalCorrect;
        progress.stats.overall_accuracy = progress.stats.total_questions_attempted > 0
            ? Math.round((progress.stats.total_correct / progress.stats.total_questions_attempted) * 100)
            : 0;
        progress.stats.last_activity_at = now;

        progress.updated_at = now;
        await progress.save();

        return NextResponse.json({ 
            success: true, 
            processed: totalAttempted,
            message: `Saved ${totalAttempted} question attempts` 
        });
    } catch (err) {
        console.error('[POST /api/v2/user/progress/batch]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
