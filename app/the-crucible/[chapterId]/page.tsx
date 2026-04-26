import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTaxonomy, getChapterQuestionCounts, getChapterStarCounts } from '../actions';
import CrucibleWizard from '../components/CrucibleWizard';
import { createClient } from '@/app/utils/supabase/server';
import { isLocalhostDev } from '@/lib/bookAuth';

// ISR: revalidate every 10 minutes — question content changes infrequently
export const revalidate = 600;

// Generate all 28 chapter routes at build time
export async function generateStaticParams() {
    const chapters = await getTaxonomy();
    return chapters.map(ch => ({
        chapterId: ch.id.toString()
    }));
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

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ chapterId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { chapterId } = await params;
    const resolvedSearch = await searchParams;

    // Read examBoard from URL (?examBoard=NEET or ?examBoard=JEE)
    const rawBoard = resolvedSearch['examBoard'];
    const examBoard = rawBoard === 'NEET' ? 'NEET' : rawBoard === 'JEE' ? 'JEE' : undefined;

    // Any direct chapter URL implies browse intent — the [chapterId] route only exists for browse deep-links
    const mode: 'browse' = 'browse';

    const supabase = await createClient();
    const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
    const isLoggedIn = (await isLocalhostDev()) || !!user;

    const [chapters, questionCounts, starCounts] = await Promise.all([
        getTaxonomy(),
        getChapterQuestionCounts(),
        getChapterStarCounts(),
    ]);

    const chapter = chapters.find(ch => ch.id === chapterId);
    if (!chapter) notFound();

    const chaptersWithCounts = chapters.map(ch => ({
        ...ch,
        question_count: questionCounts[ch.id] ?? 0,
        star_question_count: starCounts[ch.id] ?? 0,
    }));

    return (
        <CrucibleWizard
            chapters={chaptersWithCounts}
            isLoggedIn={isLoggedIn}
            initialChapterId={chapterId}
            initialMode={mode}
            initialExam={examBoard}
        />
    );
}
