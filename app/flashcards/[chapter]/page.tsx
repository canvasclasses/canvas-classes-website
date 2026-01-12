import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchFlashcards, getFlashcardChapters, getChapterFromSlug, generateChapterSlug } from '../../lib/revisionData';
import FlashcardsChapterClient from './FlashcardsChapterClient';

interface Props {
    params: Promise<{ chapter: string }>;
}

// Generate static params for all chapters at build time
export async function generateStaticParams() {
    const chapters = await getFlashcardChapters();
    return chapters.map((chapter) => ({
        chapter: chapter.slug,
    }));
}

// Generate dynamic metadata for each chapter
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { chapter: chapterSlug } = await params;
    const chapters = await getFlashcardChapters();
    const chapterNames = chapters.map(c => c.name);
    const chapterName = getChapterFromSlug(chapterSlug, chapterNames);

    if (!chapterName) {
        return {
            title: 'Chapter Not Found',
        };
    }

    const chapterData = chapters.find(c => c.slug === chapterSlug);
    const cardCount = chapterData?.cardCount || 0;

    return {
        title: `${chapterName} Flashcards - Class 12 Chemistry`,
        description: `Practice ${cardCount} flashcards for ${chapterName} - Class 12 CBSE Chemistry. Master key concepts with spaced repetition for JEE, NEET & Board exams.`,
        keywords: [
            `${chapterName} flashcards`,
            `${chapterName} chemistry`,
            'Class 12 Chemistry',
            'CBSE flashcards',
            'JEE chemistry revision',
            'NEET chemistry practice',
        ],
        openGraph: {
            title: `${chapterName} Flashcards | Canvas Classes`,
            description: `Practice ${cardCount} flashcards for ${chapterName} chemistry with spaced repetition.`,
        },
    };
}

export default async function FlashcardsChapterPage({ params }: Props) {
    const { chapter: chapterSlug } = await params;
    const chapters = await getFlashcardChapters();
    const chapterNames = chapters.map(c => c.name);
    const chapterName = getChapterFromSlug(chapterSlug, chapterNames);

    if (!chapterName) {
        notFound();
    }

    // Fetch flashcards for this chapter
    const allFlashcards = await fetchFlashcards();
    const chapterFlashcards = allFlashcards.filter(
        card => generateChapterSlug(card.chapterName) === chapterSlug
    );

    // Get unique topics for this chapter
    const topics = [...new Set(chapterFlashcards.map(card => card.topicName))].filter(Boolean);

    return (
        <FlashcardsChapterClient
            chapterName={chapterName}
            chapterSlug={chapterSlug}
            initialFlashcards={chapterFlashcards}
            topics={topics}
            totalChapters={chapters.length}
        />
    );
}
