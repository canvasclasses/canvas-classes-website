import { Metadata } from 'next';
import Top50Client from './Top50Client';
import { fetchTop50Data } from '@/features/public-content/data/top50Data';

export const revalidate = 86400;

const PAGE_URL = 'https://www.canvasclasses.in/top-50-concepts';
const SITE_URL = 'https://www.canvasclasses.in';

// SEO rewritten 2026-05-25 per audit:
//   • Old title was 75 chars + "2025" (stale) → truncated on mobile.
//   • Meta description had a "Physics, Chemistry" typo (this is a chemistry-
//     only page; left over from a multi-subject template).
//   • Only FAQ schema present — Course + ItemList missing.
//   • layout.tsx had a duplicate (and drifted) metadata block — removed.
// Title uses `absolute` to suppress the root layout's "| Canvas Classes"
// template suffix.
export const metadata: Metadata = {
    title: {
        absolute: 'Top 50 Chemistry Concepts — JEE/NEET 2027 High-Yield',
    },
    description: 'The 50 chemistry concepts behind ~90% of JEE & NEET questions. Free, with video lectures + PDF notes. For JEE/NEET 2027 & 2028 aspirants — Physical, Organic, Inorganic.',
    keywords: [
        'top 50 chemistry concepts',
        'top 50 chemistry concepts JEE',
        'top 50 chemistry concepts NEET',
        'important chemistry topics',
        'must-know chemistry concepts',
        'JEE chemistry important topics',
        'NEET chemistry high yield topics',
        'top chemistry concepts class 11 12',
        'chemistry concepts 2027',
        'chemistry concepts 2028',
    ],
    openGraph: {
        title: 'Top 50 Chemistry Concepts — JEE/NEET 2027 High-Yield',
        description: 'The 50 chemistry concepts behind ~90% of JEE & NEET questions. Free, with video lectures + PDF notes. For JEE/NEET 2027 & 2028 aspirants.',
        type: 'website',
        url: PAGE_URL,
        siteName: 'Canvas Classes',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Top 50 Chemistry Concepts — JEE/NEET 2027 High-Yield',
        description: 'The 50 concepts behind ~90% of JEE/NEET Chemistry questions. Free.',
    },
    alternates: { canonical: PAGE_URL },
};

function buildSchema(stats: { conceptCount: number }) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Course',
                '@id': `${PAGE_URL}#course`,
                name: 'Top 50 Chemistry Concepts — JEE & NEET High-Yield',
                description:
                    `The ${stats.conceptCount} highest-yield Chemistry concepts for JEE Main, ` +
                    `JEE Advanced, and NEET — covering roughly 90% of the concepts asked in ` +
                    `recent past-year papers. Free, with video lectures and PDF notes.`,
                url: PAGE_URL,
                inLanguage: 'en-IN',
                isAccessibleForFree: true,
                educationalLevel: 'Higher Secondary',
                educationalUse: 'Exam Preparation',
                teaches: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
                about: [
                    'JEE Main 2027', 'JEE Main 2028',
                    'JEE Advanced 2027', 'JEE Advanced 2028',
                    'NEET 2027', 'NEET 2028',
                    'CBSE Class 11 Chemistry', 'CBSE Class 12 Chemistry',
                ],
                dateModified: new Date().toISOString(),
                temporalCoverage: '2026/2028',
                provider: {
                    '@type': 'Organization',
                    '@id': `${SITE_URL}#org`,
                    name: 'Canvas Classes',
                    url: SITE_URL,
                    sameAs: SITE_URL,
                },
                instructor: {
                    '@type': 'Person',
                    '@id': `${SITE_URL}#paaras-sir`,
                    name: 'Paaras Sir',
                    jobTitle: 'Chemistry Educator',
                },
                audience: {
                    '@type': 'EducationalAudience',
                    educationalRole: 'student',
                    audienceType: 'JEE 2027, JEE 2028, NEET 2027, NEET 2028 aspirants',
                },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${PAGE_URL}#breadcrumb`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                    { '@type': 'ListItem', position: 2, name: 'Top 50 Chemistry Concepts', item: PAGE_URL },
                ],
            },
            {
                '@type': 'FAQPage',
                '@id': `${PAGE_URL}#faq`,
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'How were these 50 concepts selected?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Selected based on frequency in JEE Main, JEE Advanced, and NEET past-year papers, conceptual importance, and scoring potential. Roughly 90% of recent-year questions trace back to one of these 50 concepts.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Are these concepts from NCERT?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes — all 50 concepts are aligned with the NCERT Class 11 and Class 12 Chemistry syllabus, explained in a format optimized for JEE/NEET competitive-exam preparation.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Are these targeted for JEE or NEET?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Both. The 50 concepts are common to JEE Main, JEE Advanced, and NEET Chemistry syllabi — useful whether you\'re preparing for engineering or medical entrance.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'How should I use these concepts for revision?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Use them as a quick revision checklist 2-3 months before JEE 2027 or NEET 2027. Each concept includes a video lecture and PDF notes — work through one per day in the final stretch.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Are numerical problems also covered?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes. Numerical concepts, formulas, and problem-solving approaches are integrated into the lectures and notes for every applicable Physical Chemistry topic.',
                        },
                    },
                ],
            },
        ],
    };
}

export default async function Top50Page() {
    const concepts = await fetchTop50Data();
    const schema = buildSchema({ conceptCount: concepts.length });
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <Top50Client initialConcepts={concepts} />
        </>
    );
}
