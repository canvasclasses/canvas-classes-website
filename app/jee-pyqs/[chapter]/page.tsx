
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getQuestionsByChapter, getAllChapters } from '../../lib/jee-pyqs/data';
import JeeTestClient from '../JeeTestClient';

const BASE_URL = 'https://www.canvasclasses.in';

export async function generateStaticParams() {
    const chapters = getAllChapters();
    return chapters.map((c) => ({
        chapter: c.id,
    }));
}

export const dynamicParams = false; // 404 if chapter not found

export async function generateMetadata(
    props: { params: Promise<{ chapter: string }> }
): Promise<Metadata> {
    const { chapter } = await props.params;
    const chapters = getAllChapters();
    const chapterData = chapters.find(c => c.id === chapter);

    if (!chapterData) {
        return { title: 'Chapter Not Found | JEE PYQs | Canvas Classes' };
    }

    const questionCount = getQuestionsByChapter(chapter).length;
    const url = `${BASE_URL}/jee-pyqs/${chapter}`;
    const title = `${chapterData.name} JEE Main PYQs — Top ${questionCount} Previous Year Questions | Canvas Classes`;
    const description = `Practice ${questionCount} curated JEE Main PYQs on ${chapterData.name} (${chapterData.category} Chemistry) with detailed video solutions by Paaras Sir. Hand-picked from recent years for high-yield revision.`;

    return {
        title,
        description,
        keywords: [
            `${chapterData.name} JEE PYQ`,
            `${chapterData.name} JEE Main`,
            `${chapterData.name} previous year questions`,
            `${chapterData.name} ${chapterData.category} chemistry`,
            'JEE Chemistry PYQ',
            'JEE Main practice',
            'Top 500 JEE PYQs',
            'Canvas Classes',
            'Paaras Sir',
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
