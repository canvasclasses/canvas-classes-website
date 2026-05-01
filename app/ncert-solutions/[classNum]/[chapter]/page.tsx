import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchNCERTData } from '@/app/lib/ncertData';
import ChapterSolutionsClient from './ChapterSolutionsClient';

const BASE_URL = 'https://www.canvasclasses.in';

interface PageProps {
    params: Promise<{ classNum: string; chapter: string }>;
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function parseClassNum(classNumParam: string): number {
    return parseInt(classNumParam.replace('class-', ''), 10) || 11;
}

async function getChapterData(classNumParam: string, chapterSlug: string) {
    const classNum = parseClassNum(classNumParam);
    const allQuestions = await fetchNCERTData();
    const questions = allQuestions.filter(
        (q) => q.classNum === classNum && slugify(q.chapter) === chapterSlug
    );
    if (questions.length === 0) return null;
    return {
        classNum,
        chapterName: questions[0].chapter,
        classification: questions[0].classification,
        questions,
    };
}

export async function generateStaticParams() {
    const allQuestions = await fetchNCERTData();
    const seen = new Set<string>();
    const params: { classNum: string; chapter: string }[] = [];
    for (const q of allQuestions) {
        const key = `${q.classNum}-${slugify(q.chapter)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        params.push({
            classNum: `class-${q.classNum}`,
            chapter: slugify(q.chapter),
        });
    }
    return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { classNum: classNumParam, chapter: chapterSlug } = await params;
    const data = await getChapterData(classNumParam, chapterSlug);

    if (!data) {
        return { title: 'Chapter Not Found | NCERT Solutions | Canvas Classes' };
    }

    const url = `${BASE_URL}/ncert-solutions/class-${data.classNum}/${chapterSlug}`;
    const title = `NCERT Solutions for Class ${data.classNum} Chemistry — ${data.chapterName} | Canvas Classes`;
    const description = `Free NCERT solutions for Class ${data.classNum} Chemistry chapter "${data.chapterName}" — ${data.questions.length} step-by-step solutions with detailed explanations and video walkthroughs by Paaras Sir. Updated for 2025-26 CBSE, JEE & NEET.`;

    return {
        title,
        description,
        keywords: [
            `${data.chapterName} NCERT solutions`,
            `${data.chapterName} Class ${data.classNum} Chemistry`,
            `Class ${data.classNum} ${data.chapterName} solutions`,
            `NCERT Class ${data.classNum} Chemistry`,
            `${data.chapterName} CBSE solutions`,
            `${data.chapterName} JEE`,
            `${data.chapterName} NEET`,
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

export default async function ChapterSolutionsPage({ params }: PageProps) {
    const { classNum: classNumParam, chapter: chapterSlug } = await params;
    const data = await getChapterData(classNumParam, chapterSlug);

    if (!data) {
        notFound();
    }

    const url = `${BASE_URL}/ncert-solutions/class-${data.classNum}/${chapterSlug}`;

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'NCERT Solutions', item: `${BASE_URL}/ncert-solutions` },
            { '@type': 'ListItem', position: 3, name: `Class ${data.classNum} Chemistry — ${data.chapterName}`, item: url },
        ],
    };

    const qaSchema = {
        '@context': 'https://schema.org',
        '@type': 'QAPage',
        mainEntity: data.questions.slice(0, 10).map((q) => ({
            '@type': 'Question',
            name: q.questionText.slice(0, 200),
            acceptedAnswer: {
                '@type': 'Answer',
                text: q.solutionContent.replace(/<br>/g, ' ').replace(/\|/g, '').slice(0, 500),
            },
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(qaSchema) }}
            />
            <ChapterSolutionsClient
                chapterName={data.chapterName}
                classNum={data.classNum}
                questions={data.questions}
            />
        </>
    );
}

export const revalidate = 86400;
