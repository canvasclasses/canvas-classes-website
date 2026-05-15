import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import FlashcardProgress from '@/lib/models/FlashcardProgress';
import { getAuthenticatedUser } from '@/lib/auth';

const MAX_RETRIES = 3;
const HISTORY_WINDOW_DAYS = 365;

/**
 * POST { date: 'yyyy-mm-dd', delta: number }
 * Increments the per-day review count for the heatmap. Old days outside the
 * 365-day window are pruned on every write so the document stays bounded.
 */
export async function POST(request: NextRequest) {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    const b = body as { date?: unknown; delta?: unknown };
    if (typeof b.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(b.date)) {
        return NextResponse.json({ error: 'date required (yyyy-mm-dd)' }, { status: 400 });
    }
    const delta = typeof b.delta === 'number' && b.delta > 0 ? Math.min(1000, Math.floor(b.delta)) : 1;

    try {
        await connectToDatabase();
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                let doc = await FlashcardProgress.findOne({ user_id: user.id });
                if (!doc) {
                    doc = new FlashcardProgress({
                        user_id: user.id,
                        user_email: user.email ?? '',
                        cards: new Map(),
                        history: []
                    });
                }
                if (!Array.isArray(doc.history)) doc.history = [];

                const idx = doc.history.findIndex(h => h.date === b.date);
                if (idx >= 0) doc.history[idx].reviews += delta;
                else doc.history.push({ date: b.date as string, reviews: delta });

                // Prune to the most recent HISTORY_WINDOW_DAYS days.
                const cutoff = new Date();
                cutoff.setDate(cutoff.getDate() - HISTORY_WINDOW_DAYS);
                const pad = (n: number) => String(n).padStart(2, '0');
                const cutoffStr = `${cutoff.getFullYear()}-${pad(cutoff.getMonth() + 1)}-${pad(cutoff.getDate())}`;
                doc.history = doc.history.filter(h => h.date >= cutoffStr);

                await doc.save();
                return NextResponse.json({ ok: true });
            } catch (err) {
                const error = err as { name?: string };
                if (error?.name === 'VersionError' && attempt < MAX_RETRIES - 1) continue;
                throw err;
            }
        }
        return NextResponse.json({ error: 'Conflict; please retry' }, { status: 409 });
    } catch (err) {
        console.error('POST /api/v2/user/flashcard-day failed:', err);
        return NextResponse.json({ error: 'Failed to record day' }, { status: 500 });
    }
}
