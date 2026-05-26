import { Metadata } from 'next';
import TwoMinClient from './TwoMinClient';
import { fetch2MinData } from '@/features/public-content/data/twoMinData';

export const revalidate = 86400;

const PAGE_URL = 'https://www.canvasclasses.in/2-minute-chemistry';
const SITE_URL = 'https://www.canvasclasses.in';

// SEO rewritten 2026-05-25 per audit:
//   • Old title was 64 chars + brand suffix (truncated).
//   • Old meta said "under 5 minutes" while the title said "2 minute" —
//     internal inconsistency. Picked one truth: 2 minutes is the brand.
//   • Old meta mentioned "2025" (stale).
//   • No schema at all (no FAQ, no ItemList) and only skeletal OG fields.
//   • Duplicate metadata block in layout.tsx — removed.
// ItemList schema added so each short qualifies for Google's video-carousel
// rich result. Upgrading individual entries to VideoObject (with thumbnails)
// is a follow-up worth doing if the impression-to-thumbnail conversion is
// worth the schema bloat.
export const metadata: Metadata = {
    title: {
        absolute: '2-Minute Chemistry — JEE/NEET 2027 Concept Shorts',
    },
    description: 'Bite-sized chemistry concepts in 2 minutes. JEE/NEET 2027 & 2028 shortcuts, mnemonics, exam tricks. Free, on-the-go revision for Physical, Organic & Inorganic Chemistry.',
    keywords: [
        '2 minute chemistry',
        'chemistry shorts',
        'chemistry shorts videos',
        'quick chemistry revision',
        'chemistry tips JEE',
        'chemistry tips NEET',
        'chemistry shortcuts',
        'chemistry mnemonics',
        'fast chemistry learning',
        '2 minute chemistry 2027',
        '2 minute chemistry 2028',
    ],
    openGraph: {
        title: '2-Minute Chemistry — JEE/NEET 2027 Concept Shorts',
        description: 'Bite-sized chemistry concepts in 2 minutes. JEE/NEET 2027 & 2028 shortcuts, mnemonics, exam tricks. Free, on-the-go revision.',
        type: 'website',
        url: PAGE_URL,
        siteName: 'Canvas Classes',
    },
    twitter: {
        card: 'summary_large_image',
        title: '2-Minute Chemistry — JEE/NEET 2027 Concept Shorts',
        description: 'Bite-sized chemistry concepts in 2 minutes. Free JEE/NEET shortcuts.',
    },
    alternates: { canonical: PAGE_URL },
};

function buildSchema(stats: { videoCount: number }) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'ItemList',
                '@id': `${PAGE_URL}#itemlist`,
                name: '2-Minute Chemistry — JEE/NEET Concept Shorts',
                description:
                    `${stats.videoCount}+ two-minute Chemistry concept videos for JEE/NEET ` +
                    `2027 & 2028 aspirants. Shortcuts, mnemonics, and exam-pattern tricks.`,
                numberOfItems: stats.videoCount,
                itemListOrder: 'https://schema.org/ItemListOrderAscending',
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${PAGE_URL}#breadcrumb`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                    { '@type': 'ListItem', position: 2, name: '2-Minute Chemistry', item: PAGE_URL },
                ],
            },
            {
                '@type': 'CreativeWork',
                '@id': `${PAGE_URL}#collection`,
                name: '2-Minute Chemistry',
                url: PAGE_URL,
                inLanguage: 'en-IN',
                isAccessibleForFree: true,
                educationalLevel: 'Higher Secondary',
                educationalUse: 'Exam Revision',
                about: [
                    'JEE Main 2027', 'JEE Main 2028',
                    'JEE Advanced 2027', 'JEE Advanced 2028',
                    'NEET 2027', 'NEET 2028',
                    'CBSE Class 11 Chemistry', 'CBSE Class 12 Chemistry',
                ],
                dateModified: new Date().toISOString(),
                temporalCoverage: '2026/2028',
                creator: {
                    '@type': 'Person',
                    '@id': `${SITE_URL}#paaras-sir`,
                    name: 'Paaras Sir',
                    jobTitle: 'Chemistry Educator',
                },
                publisher: {
                    '@type': 'Organization',
                    '@id': `${SITE_URL}#org`,
                    name: 'Canvas Classes',
                    url: SITE_URL,
                },
                audience: {
                    '@type': 'EducationalAudience',
                    educationalRole: 'student',
                    audienceType: 'JEE 2027, JEE 2028, NEET 2027, NEET 2028 aspirants',
                },
            },
        ],
    };
}

export default async function TwoMinChemistryPage() {
    const videos = await fetch2MinData();
    const schema = buildSchema({ videoCount: videos.length });
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <TwoMinClient initialVideos={videos} />
        </>
    );
}
