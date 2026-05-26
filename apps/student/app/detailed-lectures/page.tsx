import { Metadata } from 'next';
import LecturesClient from './LecturesClient';
import { fetchLecturesData, getLecturesStats } from '@/features/public-content/data/lecturesData';

export const revalidate = 86400;

const PAGE_URL = 'https://www.canvasclasses.in/detailed-lectures';
const SITE_URL = 'https://www.canvasclasses.in';

// SEO metadata — rewritten 2026-05-25 in response to the morning-briefing
// alert flagging this page as the #2 quick win:
//   • 2,899 impressions over 28 days at avg position 2.1
//   • 1.52% CTR vs ~15% expected for position 2 (the title isn't doing its
//     job — Google ranks the page extremely well but searchers don't click)
//   • Old title was 91 chars after the root layout's "| Canvas Classes"
//     template suffix appended a second copy; truncated on mobile SERPs
//   • Real value (30 chapters, 530+ video lectures, every chapter has a
//     handwritten notes PDF) was buried — none of those numbers appeared in
//     the title or meta despite being the page's strongest differentiator
// New title uses `absolute` to opt out of the template (prevents the
// duplicate brand suffix); leads with the concrete numbers + exam mentions.
export const metadata: Metadata = {
    title: {
        absolute: 'Class 11-12 Chemistry: 530+ Video Lectures + Notes — JEE/NEET',
    },
    description: '30 chapters, 530+ video lectures, handwritten notes PDF per chapter. Free chemistry course for JEE Main, JEE Advanced & NEET 2027/2028 aspirants — CBSE Class 11-12.',
    keywords: [
        'JEE Chemistry lectures',
        'NEET Chemistry video lectures',
        'Free Chemistry lectures Class 11 12',
        'JEE Chemistry video course',
        'NEET Chemistry course free',
        'Chemistry lectures for JEE Mains',
        'JEE Advanced Chemistry',
        'CBSE Chemistry video lectures',
        'chemistry notes PDF',
        'NCERT chemistry video',
    ],
    openGraph: {
        title: 'Class 11-12 Chemistry: 530+ Video Lectures + Notes — JEE/NEET',
        description: '30 chapters, 530+ video lectures, handwritten notes PDF per chapter. Free chemistry course for JEE Main, JEE Advanced & NEET 2027/2028 aspirants — CBSE Class 11-12.',
        type: 'website',
        url: PAGE_URL,
        siteName: 'Canvas Classes',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Class 11-12 Chemistry: 530+ Video Lectures + Notes — JEE/NEET',
        description: '30 chapters, 530+ lectures, handwritten notes PDF per chapter. Free.',
    },
    alternates: { canonical: PAGE_URL },
};

// ────────────────────────────────────────────────────────────────────────────
// Course JSON-LD — the biggest single SEO/CTR win available for this page.
// Google renders Course rich-result cards in SERPs (provider, level, language,
// "free" indicator, duration) that visually dominate plain text results and
// historically lift CTR 2-4× when present. Required fields: name, description,
// provider. Optional fields below (audience, teaches, courseInstance) qualify
// the page for the richer card variants.
//
// We build the schema with the live stats so the courseWorkload duration
// reflects the actual content rather than a hand-typed estimate that drifts.
// ────────────────────────────────────────────────────────────────────────────

function buildCourseSchema(stats: { chapterCount: number; videoCount: number; totalHours: number }) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Course',
                '@id': `${PAGE_URL}#course`,
                name: 'Chemistry — Class 11-12 for JEE, NEET & CBSE',
                description:
                    `Complete chemistry video course covering NCERT Class 11 and 12 — ` +
                    `${stats.chapterCount} chapters, ${stats.videoCount}+ video lectures, ` +
                    `handwritten notes PDF per chapter. Free, no signup required.`,
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
                // ISO-8601 timestamp refreshed at build time. Helps Google's
                // freshness ranking signals + makes "Updated" badges in some
                // SERP variants eligible without spending title characters.
                dateModified: new Date().toISOString(),
                // Cohort span — the course content is reusable across the
                // 2026-2028 JEE/NEET cycles. Encoded in schema so Google sees
                // the audience without us bloating the title.
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
                    // ISO-8601 duration. Hours are integer-truncated from the live data.
                    courseWorkload: `PT${stats.totalHours}H`,
                    inLanguage: 'en-IN',
                    isAccessibleForFree: true,
                },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${PAGE_URL}#breadcrumb`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                    { '@type': 'ListItem', position: 2, name: 'Chemistry Lectures', item: PAGE_URL },
                ],
            },
        ],
    };
}

// Server-side data fetching for SEO (ensures Google sees content on first render)
export default async function LecturesPage() {
    const chapters = await fetchLecturesData();
    const stats = await getLecturesStats();
    const courseSchema = buildCourseSchema(stats);

    return (
        <>
            {/* Plain <script> instead of next/script so JSON-LD lands in the
                initial SSR HTML — Googlebot reads the static response for
                rich-result eligibility, and next/script defers to client-side
                injection which would miss the first crawl. */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
            />
            <LecturesClient initialChapters={chapters} initialStats={stats} />
        </>
    );
}
