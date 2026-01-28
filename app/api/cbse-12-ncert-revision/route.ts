import { NextResponse } from 'next/server';
import { fetchRevisionData, fetchRevisionTopics, fetchFlashcards } from '../../lib/revisionData';

// Revalidate every hour
export const revalidate = 86400; // 24 hours

export async function GET() {
    try {
        const [chapters, topics, flashcards] = await Promise.all([
            fetchRevisionData(),
            fetchRevisionTopics(),
            fetchFlashcards()
        ]);

        // Enrich chapters with counts
        const enrichedChapters = chapters.map(chapter => {
            // Count infographics for this chapter (topics that have an infographicUrl)
            const chapterTopics = topics.filter(t => t.chapterNum === chapter.chapterNum.toString());
            const infographicsCount = chapterTopics.filter(t => t.infographicUrl && t.infographicUrl.trim() !== '').length;

            // Count flashcards for this chapter
            const flashcardsCount = flashcards.filter(f =>
                f.chapterName.toLowerCase() === chapter.chapterName.toLowerCase()
            ).length;

            return {
                ...chapter,
                infographicsCount,
                flashcardsCount,
                hasSummary: chapter.summary && chapter.summary.trim().length > 50
            };
        });

        return NextResponse.json(enrichedChapters);
    } catch (error) {
        console.error('Error fetching revision data:', error);
        return NextResponse.json({ error: 'Failed to fetch revision data' }, { status: 500 });
    }
}
