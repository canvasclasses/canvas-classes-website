import { Metadata } from 'next';
import { fetchLecturesData, getChapterBySlug } from '@/app/lib/lecturesData';
import ChapterPageClient from './ChapterPageClient';
import { notFound } from 'next/navigation';

const BASE_URL = 'https://www.canvasclasses.in';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const chapters = await fetchLecturesData();
    return chapters.map((chapter) => ({
        slug: chapter.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const chapter = await getChapterBySlug(slug);

    if (!chapter) {
        return { title: 'Chapter Not Found | Canvas Classes' };
    }

    const url = `${BASE_URL}/detailed-lectures/${slug}`;
    const title = `${chapter.name} — Class ${chapter.class} Chemistry Video Lectures | Canvas Classes`;
    const description = `${chapter.videoCount} free video lectures on ${chapter.name} (Class ${chapter.class}, ${chapter.classification} Chemistry) — total ${chapter.totalDuration} of complete chapter coverage by Paaras Sir for JEE Main, JEE Advanced, NEET & CBSE.${chapter.keyTopics?.length ? ` Topics: ${chapter.keyTopics.slice(0, 5).join(', ')}.` : ''}`;

    return {
        title,
        description,
        keywords: [
            `${chapter.name} video lectures`,
            `${chapter.name} JEE`,
            `${chapter.name} NEET`,
            `${chapter.name} class ${chapter.class}`,
            `${chapter.name} ${chapter.classification} chemistry`,
            'free chemistry lectures',
            'JEE chemistry video course',
            'NEET chemistry video course',
            'Paaras Sir',
            'Canvas Classes',
        ],
        alternates: { canonical: url },
        openGraph: {
            type: 'website',
            url,
            siteName: 'Canvas Classes',
            title,
            description,
            images: [
                { url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: title },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            creator: '@canvasclasses',
        },
        robots: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
        },
    };
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
export const revalidate = 86400; // 24 hours
