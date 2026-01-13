import { Metadata } from 'next';
import TwoMinClient from './TwoMinClient';

// Fetch data from the API route
async function fetchTwoMinData() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://canvasclasses.in';
    try {
        const response = await fetch(`${baseUrl}/api/2-min-chemistry`, { next: { revalidate: 3600 } });
        const data = await response.json();
        return data.videos || [];
    } catch (error) {
        console.error('Failed to fetch 2 minute chemistry data:', error);
        return [];
    }
}

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
    const videos = await fetchTwoMinData();
    return <TwoMinClient initialVideos={videos} />;
}
