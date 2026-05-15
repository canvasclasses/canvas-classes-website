import { NextRequest, NextResponse } from 'next/server';
import { getChapterCards, getChapterSummaries } from '@/app/lib/flashcardsData';

// PUBLIC: no auth required — flashcard content is public study material.
// Lazy-loaded by the client when a user selects a chapter to practice.
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const summaries = await getChapterSummaries();
    const match = summaries.find((s) => s.slug === slug);
    if (!match) {
        return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const cards = await getChapterCards(match.name);
    return NextResponse.json(
        { cards },
        {
            headers: {
                // Cache aggressively — flashcard content rarely changes.
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
            },
        }
    );
}
