import { Metadata } from 'next';
import OneShotClient from './OneShotClient';
import { fetchQuickRecapData } from '@/features/public-content/data/quickRecapData';

export const revalidate = 86400;

const PAGE_URL = 'https://www.canvasclasses.in/one-shot-lectures';
const SITE_URL = 'https://www.canvasclasses.in';

// SEO rewritten 2026-05-25 — flagged in the audit as #1 priority quick win:
//   • 900 impressions over 28d at avg position 5.7 but only 0.78% CTR
//     (~5-7% benchmark). One of the biggest single CTR leaks in the dropdown.
//   • Old title was 86 chars (truncated past "Complete Chap..." on mobile)
//     and the brand suffix "| Canvas Classes" ate 18 chars for no SEO value.
//   • "2025" was stale — NEET 2025 was a year ago.
//   • No Course schema — missed Google's Course rich-result card eligibility
//     (the lift we just shipped on /detailed-lectures and /neet-crash-course).
// New title uses `title.absolute` to opt out of the root layout's "| Canvas
// Classes" template (otherwise the brand suffix gets appended). Course schema
// + BreadcrumbList + FAQPage are merged into a single @graph payload — same
// pattern as the other course landings.
export const metadata: Metadata = {
    title: {
        absolute: 'Free Chemistry One Shots — JEE/NEET 2027 Revision',
    },
    description: 'Full chapters in one video — free chemistry one-shots for JEE/NEET 2027 & 2028. Organic, Inorganic, Physical. 30–120 min sessions, focused on high-yield topics.',
    keywords: [
        'chemistry one shot',
        'one shot chemistry JEE',
        'one shot organic chemistry',
        'one shot inorganic chemistry',
        'one shot physical chemistry',
        'chemistry one shot NEET',
        'JEE chemistry revision one shot',
        'NEET chemistry full syllabus one shot',
        'one shot chemistry class 11',
        'one shot chemistry class 12',
        'chemistry one shot 2027',
        'chemistry one shot 2028',
    ],
    openGraph: {
        title: 'Free Chemistry One Shots — JEE/NEET 2027 Revision',
        description: 'Full chapters in one video — free chemistry one-shots for JEE/NEET 2027 & 2028. Organic, Inorganic, Physical. 30–120 min sessions, focused on high-yield topics.',
        type: 'website',
        url: PAGE_URL,
        siteName: 'Canvas Classes',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Chemistry One Shots — JEE/NEET 2027 Revision',
        description: 'Full chapters in one video. Free, 30–120 min sessions, JEE/NEET-focused.',
    },
    alternates: { canonical: PAGE_URL },
};

function buildSchema(stats: { videoCount: number }) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Course',
                '@id': `${PAGE_URL}#course`,
                name: 'Chemistry One Shots — JEE/NEET Full-Chapter Revision',
                description:
                    `${stats.videoCount}+ one-shot Chemistry videos covering full NCERT ` +
                    `chapters in 30-120 minute sessions. Free revision course for JEE Main, ` +
                    `JEE Advanced, and NEET aspirants — focused on high-yield topics rather ` +
                    `than marathon coverage.`,
                url: PAGE_URL,
                inLanguage: 'en-IN',
                isAccessibleForFree: true,
                educationalLevel: 'Higher Secondary',
                educationalUse: 'Exam Revision',
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
                hasCourseInstance: {
                    '@type': 'CourseInstance',
                    courseMode: 'online',
                    inLanguage: 'en-IN',
                    isAccessibleForFree: true,
                },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${PAGE_URL}#breadcrumb`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                    { '@type': 'ListItem', position: 2, name: 'Chemistry One Shots', item: PAGE_URL },
                ],
            },
            {
                '@type': 'FAQPage',
                '@id': `${PAGE_URL}#faq`,
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'What is a one shot lecture?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'A one shot lecture covers an entire chapter in a single video. Unlike marathon 6-8 hour lectures, our one shots are crisp 30-120 minute sessions focused on high-yield topics for JEE 2027/2028 and NEET 2027/2028 aspirants.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'How are these different from other one shot videos on YouTube?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Our one shots are shorter and more focused. We prioritize conceptual clarity and high-scoring topics rather than trying to cover everything in exhausting marathon sessions.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Which chapters are covered in one shot lectures?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'All major chapters from Class 11 and 12 Chemistry — Physical, Organic, and Inorganic — perfect for JEE Main, JEE Advanced, and NEET 2027/2028 revision.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Can I use these for last-minute revision?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Absolutely. Each video covers key concepts, important reactions, and high-yield topics in a focused 30-120 minute format — designed specifically for the last-month revision window before JEE and NEET.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Who teaches these one shot lectures?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'All lectures are taught by Paaras Sir in his friendly, easy-to-understand teaching style that students love.',
                        },
                    },
                ],
            },
        ],
    };
}

export default async function OneShotLecturesPage() {
    const videos = await fetchQuickRecapData();
    const schema = buildSchema({ videoCount: videos.length });
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <OneShotClient initialVideos={videos} />
        </>
    );
}
