import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { UserProgress } from '@/lib/models/UserProgress';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        // NOTE: removed the `NODE_ENV === 'development'` placeholder bypass —
        // it was a CLAUDE.md §8.3 violation (Vercel previews also set NODE_ENV
        // to 'development', so it would have leaked the placeholder dataset to
        // every preview deployment). If you need a previewable dashboard for
        // local dev, hit it as a logged-in user with seeded data.
        const userId = await getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
        interface ChapterProgress {
            mastery_level?: string;
            [key: string]: unknown;
        }
        interface Attempt {
            attempted_at: Date | string;
            [key: string]: unknown;
        }

        let masteredCount = 0;
        if (progress.chapter_progress) {
            Object.values(progress.chapter_progress).forEach((cp: unknown) => {
                const chapterProg = cp as ChapterProgress;
                if (chapterProg.mastery_level === 'Mastered') masteredCount++;
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

        (progress.recent_attempts || []).forEach((a: unknown) => {
            const attempt = a as Attempt;
            const attemptedDate = new Date(attempt.attempted_at);
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
