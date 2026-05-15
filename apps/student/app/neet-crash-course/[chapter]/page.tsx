import { notFound } from 'next/navigation';
import { getNeetChapter, fetchNeetCrashCourseData } from '@/app/lib/neetCrashCourseData';
import NeetChapterClient from './NeetChapterClient';
import { Metadata } from 'next';

export const revalidate = 86400; // 24 hours

export async function generateStaticParams() {
    const chapters = await fetchNeetCrashCourseData();
    return chapters.map((c) => ({
        chapter: c.slug,
    }));
}

type Props = {
    params: Promise<{ chapter: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const chapter = await getNeetChapter(params.chapter);
    
    if (!chapter) return {};
    
    return {
        title: `${chapter.title} - NEET Crash Course 2025 | Canvas Classes`,
        description: chapter.description || `Complete revision for ${chapter.title}`,
    };
}

export default async function NeetChapterPage(props: Props) {
    const params = await props.params;
    const chapter = await getNeetChapter(params.chapter);

    if (!chapter) {
        notFound();
    }

    return <NeetChapterClient chapter={chapter} />;
}
