import { Metadata } from 'next';
import NeetCrashCourseClient from './NeetCrashCourseClient';
import { fetchNeetCrashCourseData } from '@/features/public-content/data/neetCrashCourseData';

export const revalidate = 86400;

const PAGE_URL = 'https://www.canvasclasses.in/neet-crash-course';
const SITE_URL = 'https://www.canvasclasses.in';

// SEO metadata — rewritten 2026-05-25 alongside the /detailed-lectures fix,
// applying the same playbook to the NEET-specific landing page:
//   • Old title was ~75 chars and got truncated past "| Canvas Classes" on
//     mobile SERPs; the brand suffix was wasted real estate when ranking for
//     intent queries like "neet chemistry crash course".
//   • Old meta (132 chars) didn't surface the three highest-value
//     differentiators that students actually search for: Class 11+12 split,
//     downloadable PDF notes, and DPP (Daily Practice Problems).
//   • Page is a 3-month structured crash course — lectures + DPP + PDF notes
//     per chapter. The new copy + Course schema make all of that legible to
//     both Google's classifier and the human scanning the SERP snippet.
//   • Course / Breadcrumb / FAQPage JSON-LD added (consolidated into a single
//     @graph payload, same shape as /detailed-lectures) — qualifies the page
//     for Google's Course rich-result card, which historically lifts CTR 2-4×.
// `title.absolute` opts out of the root layout's "| Canvas Classes" template
// so we control exactly what appears in the SERP.
export const metadata: Metadata = {
    title: {
        absolute: 'Free NEET 2027 Chemistry Crash Course — DPP + PDF',
    },
    description: 'Free NEET 2027 Chemistry crash course — Class 11 & 12 lectures, daily practice problems (DPP), PDF notes, video solutions. 3 months to NEET-ready.',
    keywords: [
        'NEET Chemistry crash course',
        'NEET Chemistry preparation',
        'NEET Chemistry revision course',
        'NEET Chemistry free course',
        'NEET Chemistry DPP',
        'NEET Chemistry PDF notes',
        'NEET Class 11 12 Chemistry',
        '3 month NEET crash course',
        'NEET 2026 Chemistry',
        'NEET 2027 Chemistry',
    ],
    openGraph: {
        title: 'Free NEET 2027 Chemistry Crash Course — DPP + PDF',
        description: 'Free NEET 2027 Chemistry crash course — Class 11 & 12 lectures, daily practice problems (DPP), PDF notes, video solutions. 3 months to NEET-ready.',
        type: 'website',
        url: PAGE_URL,
        siteName: 'Canvas Classes',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free NEET 2027 Chemistry Crash Course — DPP + PDF',
        description: 'Class 11 & 12 lectures, DPP, PDF notes, video solutions. 3 months to NEET-ready.',
    },
    alternates: { canonical: PAGE_URL },
};

// ────────────────────────────────────────────────────────────────────────────
// JSON-LD — Course + BreadcrumbList + FAQPage, all in one @graph payload.
// Mirrors the structure of /detailed-lectures so future fields (e.g.
// AggregateRating once we collect reviews) can be added in lockstep.
//
// `courseWorkload: 'P3M'` (ISO-8601) is the structured-timeline signal that
// matches Google's Course-card "duration" field. Stats use the live data so
// the description doesn't drift when chapters are added to the underlying
// CSV.
// ────────────────────────────────────────────────────────────────────────────

function buildSchema(stats: {
    chapterCount: number;
    videoCount: number;
    class11Count: number;
    class12Count: number;
}) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Course',
                '@id': `${PAGE_URL}#course`,
                name: 'NEET 2027 Chemistry Crash Course — Class 11 & 12',
                description:
                    `3-month NEET 2027 Chemistry crash course covering Class 11 and 12 — ` +
                    `${stats.chapterCount} chapters, ${stats.videoCount}+ video lectures, ` +
                    `Daily Practice Problems (DPP) with solutions, and handwritten notes PDF per chapter. ` +
                    `Free, no signup required.`,
                url: PAGE_URL,
                inLanguage: 'en-IN',
                isAccessibleForFree: true,
                educationalLevel: 'Higher Secondary',
                educationalUse: 'Exam Preparation',
                teaches: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'],
                about: ['NEET 2027', 'NEET UG', 'NEET Chemistry', 'CBSE Class 11 Chemistry', 'CBSE Class 12 Chemistry'],
                // ISO-8601 timestamp refreshed at build time. Helps Google's
                // freshness ranking signals + makes "Updated" badges in some
                // SERP variants eligible without spending title characters.
                dateModified: new Date().toISOString(),
                temporalCoverage: '2026/2027',
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
                },
                hasCourseInstance: {
                    '@type': 'CourseInstance',
                    courseMode: 'online',
                    // 3-month structured timeline → ISO 8601 P3M
                    courseWorkload: 'P3M',
                    inLanguage: 'en-IN',
                    isAccessibleForFree: true,
                },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${PAGE_URL}#breadcrumb`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                    { '@type': 'ListItem', position: 2, name: 'NEET Chemistry Crash Course', item: PAGE_URL },
                ],
            },
            {
                '@type': 'FAQPage',
                '@id': `${PAGE_URL}#faq`,
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'What is covered in the NEET Chemistry Crash Course?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text:
                                `Complete NEET Chemistry syllabus across ${stats.chapterCount} chapters — ` +
                                `Class 11 (${stats.class11Count}) and Class 12 (${stats.class12Count}) — ` +
                                `with high-yield video lectures, Daily Practice Problems (DPP) with solutions, ` +
                                `and handwritten PDF notes per chapter. Covers Physical, Organic, and Inorganic ` +
                                `Chemistry with NEET-pattern focus.`,
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'How long does the NEET Chemistry crash course take?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text:
                                'The course is structured as a 3-month plan for serious NEET 2027 aspirants. ' +
                                'Each chapter combines fast-paced video lectures with PDF notes for revision ' +
                                'and a DPP for active recall — the recommended pace is one chapter every 2-3 days.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Are PDF notes and DPP included?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text:
                                'Yes. Every chapter ships with handwritten PDF notes (downloadable) and a ' +
                                'Daily Practice Problems (DPP) sheet with video solutions. No login or payment required.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'How is the crash course different from regular lectures?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text:
                                'Crash-course lectures are faster-paced, NEET-focused, and prioritise the high-yield ' +
                                'concepts that appear most frequently in NEET past-year questions. If you have more ' +
                                'time, pair them with our full chapter lectures at /detailed-lectures.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Are NEET previous-year questions discussed?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text:
                                'Yes. NEET PYQs are integrated into both the video lectures (worked examples) and ' +
                                'the DPP solutions, with shortcuts and elimination tricks for NEET-style multiple choice.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Is this suitable for students starting from zero?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text:
                                'The crash course assumes basic familiarity with NCERT chapters. Complete beginners ' +
                                'should start with our detailed chapter lectures at /detailed-lectures, then move to ' +
                                'the crash course in the final 3 months before NEET.',
                        },
                    },
                ],
            },
        ],
    };
}

// Server-side data fetching so Google sees content + accurate stats on first render.
export default async function NeetCrashCoursePage() {
    const chapters = await fetchNeetCrashCourseData();

    // Inline stats — this page is the only consumer, no need for a separate
    // getter in the data module. classNum is '11' | '12' on every chapter.
    const chapterCount = chapters.length;
    const class11Count = chapters.filter(c => c.classNum === '11').length;
    const class12Count = chapters.filter(c => c.classNum === '12').length;
    const videoCount = chapters.reduce(
        (sum, c) => sum + c.lectures.length + c.dppSolutions.length,
        0,
    );

    const schema = buildSchema({ chapterCount, videoCount, class11Count, class12Count });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <NeetCrashCourseClient initialChapters={chapters} />
        </>
    );
}
