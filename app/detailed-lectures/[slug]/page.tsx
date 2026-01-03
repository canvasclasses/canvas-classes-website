import { fetchLecturesData, getChapterBySlug } from '@/app/lib/lecturesData';
import ChapterPageClient from './ChapterPageClient';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const chapters = await fetchLecturesData();
    return chapters.map((chapter) => ({
        slug: chapter.slug,
    }));
}

export default async function ChapterPage({ params }: PageProps) {
    const { slug } = await params;
    const chapter = await getChapterBySlug(slug);

    if (!chapter) {
        notFound();
    }

    return <ChapterPageClient chapter={chapter} />;
}

// Enable ISR
export const revalidate = 3600;
