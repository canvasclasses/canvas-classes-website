import { Metadata } from 'next';
import QuickRecapClient from './QuickRecapClient';

// Fetch data from the API route
async function fetchQuickRecapData() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://canvasclasses.in';
    try {
        const response = await fetch(`${baseUrl}/api/quick-recap`, { next: { revalidate: 3600 } });
        const data = await response.json();
        return data.videos || [];
    } catch (error) {
        console.error('Failed to fetch quick recap data:', error);
        return [];
    }
}

export const metadata: Metadata = {
    title: 'Chemistry Quick Revision Videos for JEE & NEET - Fast Recap | Canvas Classes',
    description: 'Quick revision videos for Chemistry. Master complex topics in minutes with exam-oriented content for JEE Main, JEE Advanced, and NEET preparation.',
    keywords: [
        'Chemistry quick revision JEE',
        'NEET Chemistry revision videos',
        'Last minute Chemistry revision',
        'Quick recap Chemistry Class 12',
        'JEE Chemistry revision',
        'Fast Chemistry revision NEET',
        'Chemistry short notes video',
    ],
    openGraph: {
        title: 'Chemistry Quick Revision Videos for JEE & NEET | Canvas Classes',
        description: 'Master Chemistry quickly with focused revision videos for JEE & NEET exams.',
        type: 'website',
    },
};

// Server-side data fetching for SEO
export default async function QuickRecapPage() {
    const videos = await fetchQuickRecapData();
    return <QuickRecapClient initialVideos={videos} />;
}
