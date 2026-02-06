import { Metadata } from 'next';
import LecturesClient from './LecturesClient';
import { fetchLecturesData, getLecturesStats } from '../lib/lecturesData';

export const revalidate = 86400;

export const metadata: Metadata = {
    title: 'JEE & NEET Chemistry Video Lectures - Complete Course Free | Canvas Classes',
    description: 'Free Chemistry video lectures for JEE & NEET. Complete Class 11 & 12 course covering NCERT with detailed explanations and handwritten notes. CBSE, JEE Mains & Advanced preparation.',
    keywords: [
        'JEE Chemistry lectures',
        'NEET Chemistry video lectures',
        'Free Chemistry lectures Class 11 12',
        'JEE Chemistry video course',
        'NEET Chemistry course free',
        'Chemistry lectures for JEE Mains',
        'JEE Advanced Chemistry',
        'CBSE Chemistry video lectures',
    ],
    openGraph: {
        title: 'JEE & NEET Chemistry Video Lectures - Complete Course Free | Canvas Classes',
        description: 'Free Chemistry video lectures covering complete Class 11 & 12 for JEE & NEET preparation.',
        type: 'website',
    },
};

// Server-side data fetching for SEO (ensures Google sees content on first render)
export default async function LecturesPage() {
    const chapters = await fetchLecturesData();
    const stats = await getLecturesStats();

    return <LecturesClient initialChapters={chapters} initialStats={stats} />;
}
