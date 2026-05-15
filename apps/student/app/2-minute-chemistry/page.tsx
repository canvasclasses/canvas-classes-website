import { Metadata } from 'next';
import TwoMinClient from './TwoMinClient';

import { fetch2MinData } from '../lib/twoMinData';

export const metadata: Metadata = {
    title: '2 Minute Chemistry - Quick Lessons for JEE & NEET | Canvas Classes',
    description: 'Bite-sized Chemistry lessons in under 5 minutes. Perfect for quick revision and on-the-go learning for JEE Main, JEE Advanced, and NEET 2025 preparation.',
    keywords: [
        'Short Chemistry videos',
        '2 minute Chemistry',
        'Quick Chemistry revision',
        'Chemistry shorts for NEET JEE',
        'Quick Chemistry lessons',
        'Chemistry shorts videos',
        'Fast Chemistry learning',
    ],
    openGraph: {
        title: '2 Minute Chemistry - Quick Lessons for JEE & NEET | Canvas Classes',
        description: 'Quick, bite-sized Chemistry lessons perfect for revision on the go.',
        type: 'website',
    },
};

// Server-side data fetching for SEO
export default async function TwoMinChemistryPage() {
    const videos = await fetch2MinData();
    return <TwoMinClient initialVideos={videos} />;
}
