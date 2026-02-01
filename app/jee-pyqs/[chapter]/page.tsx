
import { notFound } from 'next/navigation';
import { getQuestionsByChapter, getAllChapters } from '../../lib/jee-pyqs/data';
import JeeTestClient from '../JeeTestClient';

export async function generateStaticParams() {
    const chapters = getAllChapters();
    return chapters.map((c) => ({
        chapter: c.id,
    }));
}

export const dynamicParams = false; // 404 if chapter not found

export default async function ChapterTestPage(props: { params: Promise<{ chapter: string }> }) {
    const params = await props.params;
    const chapters = getAllChapters();
    const chapterData = chapters.find(c => c.id === params.chapter);

    if (!chapterData) {
        notFound();
    }

    const questions = getQuestionsByChapter(params.chapter);

    return (
        <JeeTestClient 
            chapterName={chapterData.name} 
            questions={questions} 
        />
    );
}
