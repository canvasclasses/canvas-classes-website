import { notFound } from 'next/navigation';
import { fetchRevisionData, getTopicsByChapter, getFlashcardsByChapter } from '../../lib/revisionData';
import ChapterClient from './ChapterClient';

interface PageProps {
    params: Promise<{
        chapter: string;
    }>;
}

export default async function ChapterPage({ params }: PageProps) {
    const { chapter } = await params;
    const slug = chapter;

    // Fetch data server-side
    const chapters = await fetchRevisionData();
    const chapterData = chapters.find((c) => c.slug === slug);

    if (!chapterData) {
        notFound();
    }

    // Fetch related data
    const [topics, flashcards] = await Promise.all([
        getTopicsByChapter(chapterData.chapterNum),
        getFlashcardsByChapter(chapterData.chapterName)
    ]);

    const infographicsTopics = topics.filter(t => t.infographicUrl);
    const flashcardTopics = Array.from(new Set(flashcards.map(c => c.topicName).filter(Boolean)));

    return (
        <ChapterClient
            chapterData={chapterData}
            infographicsTopics={infographicsTopics}
            flashcards={flashcards}
            flashcardTopics={flashcardTopics}
        />
    );
}
