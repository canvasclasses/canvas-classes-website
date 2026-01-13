import { Metadata } from 'next';
import RevisionClient from './RevisionClient';
import { fetchRevisionData, fetchRevisionTopics, fetchFlashcards } from '../lib/revisionData';

export const metadata: Metadata = {
    title: 'NCERT Chemistry Revision Class 12 - Formulas, Infographics & Flashcards | Canvas Classes',
    description: 'Quick revision for CBSE Class 12 Chemistry with chapter summaries, infographics, and flashcards. All formulas, graphs, and tricks in one place for CBSE Boards, JEE & NEET 2025-26.',
    keywords: [
        'NCERT Chemistry revision Class 12',
        'CBSE Chemistry quick revision',
        'Chemistry formulas Class 12',
        'Chemistry infographics PDF',
        'Class 12 Chemistry chapter summaries',
        'Last minute revision Chemistry CBSE',
        'JEE Chemistry revision notes',
        'NEET Chemistry quick revision',
    ],
    openGraph: {
        title: 'NCERT Chemistry Revision Class 12 | Canvas Classes',
        description: 'Quick revision for CBSE Class 12 Chemistry with summaries, infographics, and flashcards for JEE & NEET.',
        type: 'website',
    },
};

// Server-side data fetching for SEO (ensures Google sees content on first render)
export default async function RevisionPage() {
    const [chapters, topics, flashcards] = await Promise.all([
        fetchRevisionData(),
        fetchRevisionTopics(),
        fetchFlashcards()
    ]);

    // Enrich chapters with counts
    const enrichedChapters = chapters.map(chapter => {
        const chapterTopics = topics.filter(t => t.chapterNum === chapter.chapterNum.toString());
        const infographicsCount = chapterTopics.filter(t => t.infographicUrl && t.infographicUrl.trim() !== '').length;
        const flashcardsCount = flashcards.filter(f =>
            f.chapterName.toLowerCase() === chapter.chapterName.toLowerCase()
        ).length;

        return {
            ...chapter,
            infographicsCount,
            flashcardsCount,
            hasSummary: Boolean(chapter.summary && chapter.summary.trim().length > 50)
        };
    });

    return <RevisionClient initialChapters={enrichedChapters} />;
}
