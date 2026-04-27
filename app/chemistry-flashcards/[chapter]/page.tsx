import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getChapterSummaries } from '../../lib/flashcardsData';
import FlashcardsChapterClient from './FlashcardsChapterClient';

export const revalidate = 86400;

interface Props {
    params: Promise<{ chapter: string }>;
}

export async function generateStaticParams() {
    const summaries = await getChapterSummaries();
    return summaries.map((s) => ({ chapter: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { chapter: chapterSlug } = await params;
    const summaries = await getChapterSummaries();
    const summary = summaries.find((s) => s.slug === chapterSlug);

    if (!summary) {
        return { title: 'Chapter Not Found' };
    }

    const cardCount = summary.topics.reduce((sum, t) => sum + t.cardIds.length, 0);

    return {
        title: `${summary.name} Flashcards - Class 12 Chemistry`,
        description: `Practice ${cardCount} flashcards for ${summary.name} - Class 12 CBSE Chemistry. Master key concepts with spaced repetition for JEE, NEET & Board exams.`,
        keywords: [
            `${summary.name} flashcards`,
            `${summary.name} chemistry`,
            'Class 12 Chemistry',
            'CBSE flashcards',
            'JEE chemistry revision',
            'NEET chemistry practice',
        ],
        openGraph: {
            title: `${summary.name} Flashcards | Canvas Classes`,
            description: `Practice ${cardCount} flashcards for ${summary.name} chemistry with spaced repetition.`,
        },
    };
}

export default async function FlashcardsChapterPage({ params }: Props) {
    const { chapter: chapterSlug } = await params;

    const summaries = await getChapterSummaries();
    const summary = summaries.find((s) => s.slug === chapterSlug);

    if (!summary) {
        notFound();
    }

    // Topics + per-topic card IDs come from the summary. Question/answer content
    // loads via /api/flashcards/cards/[slug] when the user starts practice.
    return (
        <FlashcardsChapterClient
            chapterName={summary.name}
            chapterSlug={chapterSlug}
            topics={summary.topics}
        />
    );
}
