import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTaxonomy, getChapterQuestions, getChapterQuestionCounts } from '../actions';
import ChapterPracticePage from './ChapterPracticePage';

// ISR: revalidate every 10 minutes — question content changes infrequently
export const revalidate = 600;

// Generate all 28 chapter routes at build time
export async function generateStaticParams() {
    const chapters = await getTaxonomy();
    return chapters.map(ch => ({ chapterId: ch.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ chapterId: string }> }): Promise<Metadata> {
    const { chapterId } = await params;
    const chapters = await getTaxonomy();
    const chapter = chapters.find(ch => ch.id === chapterId);
    if (!chapter) return { title: 'Not Found' };

    return {
        title: `${chapter.name} PYQ Practice | The Crucible — Canvas Classes`,
        description: `Practice ${chapter.name} questions from JEE Main, JEE Advanced and NEET. Curated PYQs with full solutions by Paaras Sir.`,
        keywords: [
            `${chapter.name} JEE questions`,
            `${chapter.name} NEET questions`,
            `${chapter.name} PYQ`,
            `${chapter.name} practice`,
            'Canvas Classes Crucible',
            'Paaras Sir Chemistry',
        ],
        alternates: {
            canonical: `https://www.canvasclasses.in/the-crucible/${chapterId}`,
        },
        openGraph: {
            title: `${chapter.name} — Practice Questions | Canvas Classes`,
            description: `Master ${chapter.name} with curated JEE/NEET PYQs and detailed solutions.`,
            url: `https://www.canvasclasses.in/the-crucible/${chapterId}`,
        },
    };
}

export default async function Page({ params }: { params: Promise<{ chapterId: string }> }) {
    const { chapterId } = await params;

    const [chapters, questions, questionCounts] = await Promise.all([
        getTaxonomy(),
        getChapterQuestions(chapterId),
        getChapterQuestionCounts(),
    ]);

    const chapter = chapters.find(ch => ch.id === chapterId);
    if (!chapter) notFound();

    const chaptersWithCounts = chapters.map(ch => ({
        ...ch,
        question_count: questionCounts[ch.id] ?? 0,
    }));

    return (
        <ChapterPracticePage
            chapter={{ ...chapter, question_count: questionCounts[chapterId] ?? 0 }}
            questions={questions}
            allChapters={chaptersWithCounts}
        />
    );
}
