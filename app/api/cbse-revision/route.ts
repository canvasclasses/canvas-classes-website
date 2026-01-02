import { NextResponse } from 'next/server';
import { getRevisionChapters } from '@/app/lib/revisionData';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
    try {
        const chapters = await getRevisionChapters();

        return NextResponse.json({
            chapters,
            stats: {
                totalChapters: chapters.length,
                totalInfographics: chapters.reduce((sum, ch) => sum + ch.infographicsCount, 0),
                totalFlashcards: chapters.reduce((sum, ch) => sum + ch.flashcardsCount, 0)
            }
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch revision data' },
            { status: 500 }
        );
    }
}
