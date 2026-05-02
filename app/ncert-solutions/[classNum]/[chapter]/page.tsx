import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchNCERTData } from '@/app/lib/ncertData';
import BreadcrumbSchema from '@/app/components/BreadcrumbSchema';
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

// Strict validation — only `class-11` and `class-12` are real NCERT routes.
// Any other input returns NaN so getChapterData -> notFound() instead of
// silently rendering a Class 11 page (which would create duplicate-content
// variants for arbitrary URL inputs).
function parseClassNum(classNumParam: string): number {
    if (classNumParam === 'class-11') return 11;
    if (classNumParam === 'class-12') return 12;
    return NaN;
}

// Serialize JSON for <script type="application/ld+json"> safely.
// JSON.stringify does NOT escape `<`, `>`, `&`, or `'`. If any user-supplied
// field (e.g. a Google-Sheet-sourced question text) contained `</script>`,
// the closing tag would break out of the script element. Escaping these
// four chars to their \uXXXX form keeps the JSON valid AND parser-safe.
function safeJsonLd(data: unknown): string {
    return JSON.stringify(data)
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026')
        .replace(/'/g, '\\u0027');
}

async function getChapterData(classNumParam: string, chapterSlug: string) {
    const classNum = parseClassNum(classNumParam);
    if (Number.isNaN(classNum)) return null;
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
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: BASE_URL },
                    { name: 'NCERT Solutions', url: `${BASE_URL}/ncert-solutions` },
                    { name: `Class ${data.classNum} — ${data.chapterName}`, url },
                ]}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLd(qaSchema) }}
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
