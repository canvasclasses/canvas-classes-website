import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import BookProgressModel from '@/lib/models/BookProgress';
import { getUserId } from '@/lib/bookAuth';

export const dynamic = 'force-dynamic';

const PRIVATE_NO_STORE = {
  'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
};

// GET /api/v2/books/stats?book_slug=x — aggregated reading stats for stats banner
export async function GET(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthenticated' },
      { status: 401, headers: PRIVATE_NO_STORE }
    );
  }

  const bookSlug = req.nextUrl.searchParams.get('book_slug');
  if (!bookSlug) {
    return NextResponse.json(
      { success: false, error: 'book_slug required' },
      { status: 400, headers: PRIVATE_NO_STORE }
    );
  }

  try {
    await connectToDatabase();

    const records = await BookProgressModel
      .find({ user_id: userId, book_slug: bookSlug })
      .select('completed_at quiz_score page_slug')
      .lean();

    // Compute streak: count consecutive days with at least one completion
    // working backwards from today.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completionDays = new Set<string>();
    for (const r of records) {
      const d = new Date(r.completed_at);
      completionDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    }

    let streak = 0;
    const check = new Date(today);
    while (true) {
      const key = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`;
      if (completionDays.has(key)) {
        streak++;
        check.setDate(check.getDate() - 1);
      } else {
        break;
      }
    }

    // Average quiz score (only for pages that had quizzes — score < 100 indicates a real quiz)
    const quizRecords = records.filter(r => r.quiz_score < 100);
    const avgQuizScore = quizRecords.length > 0
      ? Math.round(quizRecords.reduce((s, r) => s + r.quiz_score, 0) / quizRecords.length)
      : null;

    // Most recently completed page (for "continue reading" context)
    let lastCompleted: { page_slug: string; completed_at: string } | null = null;
    if (records.length > 0) {
      const sorted = [...records].sort(
        (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      );
      lastCompleted = {
        page_slug: sorted[0].page_slug,
        completed_at: sorted[0].completed_at.toISOString(),
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        pages_completed: records.length,
        streak_days: streak,
        avg_quiz_score: avgQuizScore,
        last_completed: lastCompleted,
      },
    }, { headers: PRIVATE_NO_STORE });
  } catch (err) {
    console.error('GET /api/v2/books/stats error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500, headers: PRIVATE_NO_STORE }
    );
  }
}
