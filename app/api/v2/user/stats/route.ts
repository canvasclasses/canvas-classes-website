import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import connectToDatabase from '@/lib/mongodb';
import { UserProgress } from '@/lib/models/UserProgress';

async function getUserId(req: NextRequest): Promise<string | null> {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7);
    const supabase = await createClient();
    if (!supabase) return null;
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user.id;
}

export async function GET(req: NextRequest) {
    try {
        // Localhost dev bypass — no auth needed when running locally
        const host = req.headers.get('host') || '';
        const isLocalDev = host.startsWith('localhost') || host.startsWith('127.0.0.1');

        const userId = isLocalDev ? 'local-dev' : await getUserId(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // For local dev, just return zero-state
        if (isLocalDev) {
            return NextResponse.json({
                stats: { total_questions_attempted: 0, total_correct: 0, overall_accuracy: 0, streak_days: 0 },
                mastered_chapters: 0,
                active_days: [],
            });
        }
        await connectToDatabase();

        // Lean query: we only need the stats and maybe a few top-level fields
        const progress = await UserProgress.findById(userId)
            .select('stats recent_attempts chapter_progress')
            .lean();

        if (!progress) {
            // New user, return zero-state
            return NextResponse.json({
                stats: {
                    total_questions_attempted: 0,
                    total_correct: 0,
                    overall_accuracy: 0,
                    streak_days: 0,
                },
                mastered_chapters: 0,
                active_days: [],
            });
        }

        // Calculate mastered chapters
        let masteredCount = 0;
        if (progress.chapter_progress) {
            Object.values(progress.chapter_progress).forEach((cp: any) => {
                if (cp.mastery_level === 'Mastered') masteredCount++;
            });
        }

        // Calculate active days this week (0=Mon, 6=Sun) based on recent attempts
        const active_days = new Set<number>();
        const now = new Date();
        const startOfWeek = new Date(now);
        // JS getDay() is 0=Sun, 1=Mon. Convert to 0=Mon, 6=Sun
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        (progress.recent_attempts || []).forEach((a: any) => {
            const attemptedDate = new Date(a.attempted_at);
            if (attemptedDate >= startOfWeek) {
                let d = attemptedDate.getDay();
                d = d === 0 ? 6 : d - 1; // map Sun->6, Mon->0
                active_days.add(d);
            }
        });

        return NextResponse.json({
            stats: progress.stats || {
                total_questions_attempted: 0,
                total_correct: 0,
                overall_accuracy: 0,
                streak_days: 0,
            },
            mastered_chapters: masteredCount,
            active_days: Array.from(active_days).sort(),
        });

    } catch (err) {
        console.error('[GET /api/v2/user/stats]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
