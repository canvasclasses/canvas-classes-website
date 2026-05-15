import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getChapterSummaries } from '../../lib/flashcardsData';
import FlashcardsChapterClient from './FlashcardsChapterClient';

export const revalidate = 86400;

const BASE_URL = 'https://www.canvasclasses.in';

interface Props {
    params: Promise<{ chapter: string }>;
}

export async function generateStaticParams() {
    const summaries = await getChapterSummaries();
    return summaries.map((s) => ({ chapter: s.slug }));
}

// ─── Per-chapter metadata ─────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { chapter: chapterSlug } = await params;
    const summaries = await getChapterSummaries();
    const summary = summaries.find((s) => s.slug === chapterSlug);

    if (!summary) return { title: 'Chapter Not Found' };

    const cardCount = summary.topics.reduce((sum, t) => sum + t.cardIds.length, 0);
    const topicNames = summary.topics.map((t) => t.name).join(', ');
    const chapterUrl = `${BASE_URL}/chemistry-flashcards/${chapterSlug}`;

    const title = `${summary.name} Flashcards – ${cardCount} Cards | Class 12 Chemistry`;
    const description = `Practice ${cardCount} flashcards for ${summary.name} (Class 12 Chemistry) using spaced repetition. Topics: ${topicNames}. Covers all key facts, reactions & formulas for JEE Main, NEET & BITSAT.`;

    return {
        title,
        description,
        keywords: [
            `${summary.name} flashcards`,
            `${summary.name} class 12`,
            `${summary.name} JEE`,
            `${summary.name} NEET`,
            `${summary.name} BITSAT`,
            `${summary.name} revision cards`,
            `${summary.name} chemistry notes`,
            'class 12 chemistry flashcards',
            'NCERT chemistry revision',
            'spaced repetition chemistry',
            'Canvas Classes',
        ],
        alternates: {
            canonical: chapterUrl,
        },
        openGraph: {
            type: 'website',
            url: chapterUrl,
            title,
            description,
            siteName: 'Canvas Classes',
            images: [
                {
                    url: `${BASE_URL}/og-flashcards.png`,
                    width: 1200,
                    height: 630,
                    alt: `${summary.name} Flashcards – Canvas Classes`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`${BASE_URL}/og-flashcards.png`],
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

// ─── Structured data builders ─────────────────────────────────────────────────

function buildBreadcrumbSchema(chapterName: string, chapterSlug: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Chemistry Flashcards', item: `${BASE_URL}/chemistry-flashcards` },
            { '@type': 'ListItem', position: 3, name: `${chapterName} Flashcards`, item: `${BASE_URL}/chemistry-flashcards/${chapterSlug}` },
        ],
    };
}

function buildCourseSchema(
    chapterName: string,
    chapterSlug: string,
    cardCount: number,
    topicNames: string[]
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: `${chapterName} – Class 12 Chemistry Flashcards`,
        description: `${cardCount} spaced-repetition flashcards covering ${topicNames.join(', ')} in ${chapterName}. Designed for JEE Main, JEE Advanced, NEET, and BITSAT Class 12 Chemistry preparation.`,
        url: `${BASE_URL}/chemistry-flashcards/${chapterSlug}`,
        provider: {
            '@type': 'Organization',
            name: 'Canvas Classes',
            url: BASE_URL,
        },
        instructor: {
            '@type': 'Person',
            name: 'Paaras Thakur',
            jobTitle: 'Chemistry Educator',
        },
        educationalLevel: 'Class 12 / Grade 12',
        isAccessibleForFree: true,
        inLanguage: 'en',
        numberOfCredits: cardCount,
        teaches: topicNames,
        hasPart: topicNames.map((name) => ({
            '@type': 'CourseUnit',
            name,
        })),
        dateModified: new Date().toISOString().split('T')[0],
    };
}

function buildTopicListSchema(
    chapterName: string,
    chapterSlug: string,
    topics: { name: string; cardIds: string[] }[]
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${chapterName} – Flashcard Topics`,
        description: `Sub-topics within the ${chapterName} chapter flashcard set`,
        url: `${BASE_URL}/chemistry-flashcards/${chapterSlug}`,
        numberOfItems: topics.length,
        itemListElement: topics.map((t, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: `${t.name} (${t.cardIds.length} cards)`,
        })),
    };
}

function buildFaqSchema(chapterName: string, topicNames: string[], cardCount: number) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: `What topics are covered in the ${chapterName} flashcard set?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `The ${chapterName} flashcard set covers ${topicNames.length} topics: ${topicNames.join(', ')}. Each topic has dedicated cards focusing on key definitions, reactions, formulas, and exam-pattern facts.`,
                },
            },
            {
                '@type': 'Question',
                name: `How many flashcards are there for ${chapterName}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `There are ${cardCount} flashcards for ${chapterName}, distributed across ${topicNames.length} sub-topics. Every card is reviewed and aligned with NCERT Class 12 content and JEE/NEET/BITSAT exam patterns.`,
                },
            },
            {
                '@type': 'Question',
                name: `Is ${chapterName} important for JEE and NEET?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Yes. ${chapterName} is part of the Class 12 NCERT Chemistry syllabus, which is tested in JEE Main, JEE Advanced, NEET, and BITSAT. These flashcards cover the high-weightage facts, exceptions, and conceptual distinctions that exams target.`,
                },
            },
            {
                '@type': 'Question',
                name: `How should I use these ${chapterName} flashcards?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Start with "Review Due Cards" to work through cards scheduled by the spaced repetition algorithm. After seeing the answer, rate yourself Correct or Needs Review. The system will schedule the next review automatically. For targeted practice, select specific topics like ${topicNames[0] ?? chapterName} to focus on weaker areas.`,
                },
            },
            {
                '@type': 'Question',
                name: `What is the best way to revise ${chapterName} for BITSAT?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${chapterName} is largely memory-based in BITSAT. Revise all ${cardCount} flashcards at least twice, focusing on direct-recall facts. Use the spaced repetition system daily in the 30 days before the exam — the algorithm will automatically surface forgotten facts before they become a problem.`,
                },
            },
        ],
    };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function FlashcardsChapterPage({ params }: Props) {
    const { chapter: chapterSlug } = await params;

    const summaries = await getChapterSummaries();
    const summary = summaries.find((s) => s.slug === chapterSlug);

    if (!summary) notFound();

    const cardCount = summary.topics.reduce((sum, t) => sum + t.cardIds.length, 0);
    const topicNames = summary.topics.map((t) => t.name);

    return (
        <>
            {/* Breadcrumb — helps Google + AI engines understand page location */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(buildBreadcrumbSchema(summary.name, chapterSlug)),
                }}
            />
            {/* Course schema — AI engines recognise this as educational content */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(buildCourseSchema(summary.name, chapterSlug, cardCount, topicNames)),
                }}
            />
            {/* Topic list — lets AI engines surface specific sub-topic information */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(buildTopicListSchema(summary.name, chapterSlug, summary.topics)),
                }}
            />
            {/* Chapter-specific FAQ — primary GEO signal */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(buildFaqSchema(summary.name, topicNames, cardCount)),
                }}
            />

            <FlashcardsChapterClient
                chapterName={summary.name}
                chapterSlug={chapterSlug}
                topics={summary.topics}
            />
        </>
    );
}
