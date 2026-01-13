import { Metadata } from 'next';
import Top50Client from './Top50Client';

// Fetch data from the API route
async function fetchTop50Data() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://canvasclasses.in';
    try {
        const response = await fetch(`${baseUrl}/api/top-50`, { next: { revalidate: 3600 } });
        const data = await response.json();
        return data.concepts || [];
    } catch (error) {
        console.error('Failed to fetch top 50 data:', error);
        return [];
    }
}

export const metadata: Metadata = {
    title: 'Top 50 Must-Know Chemistry Concepts for JEE & NEET 2025 | Canvas Classes',
    description: 'Handpicked top 50 Chemistry concepts frequently asked in JEE & NEET. Essential preparation topics with video lectures and PDF notes for Physics, Chemistry.',
    keywords: [
        'Top 50 Chemistry concepts JEE',
        'Important Chemistry topics NEET',
        'Must-know Chemistry concepts',
        'JEE Chemistry important topics',
        'NEET Chemistry high yield topics',
        'Top Chemistry concepts Class 11 12',
        'JEE Mains Chemistry topics',
    ],
    openGraph: {
        title: 'Top 50 Must-Know Chemistry Concepts for JEE & NEET | Canvas Classes',
        description: 'Master the most important Chemistry concepts for JEE & NEET with video lectures and notes.',
        type: 'website',
    },
};

// Server-side data fetching for SEO
export default async function Top50Page() {
    const concepts = await fetchTop50Data();
    return <Top50Client initialConcepts={concepts} />;
}
