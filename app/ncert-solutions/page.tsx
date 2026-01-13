import { Metadata } from 'next';
import NCERTSolutionsClient from './NCERTSolutionsClient';
import { getChapterGroups, getNCERTStats } from '../lib/ncertData';

export const metadata: Metadata = {
    title: 'NCERT Solutions for Class 11 & 12 Chemistry - Free PDF | Canvas Classes',
    description: 'Free NCERT Chemistry solutions for Class 11 & 12 with step-by-step explanations. All chapters covered including Solutions, Electrochemistry, Organic Chemistry. Updated for 2025-26 CBSE, JEE & NEET.',
    keywords: [
        'NCERT Solutions Class 12 Chemistry',
        'NCERT Solutions Class 11 Chemistry',
        'Chemistry NCERT solutions PDF',
        'CBSE Chemistry solutions free',
        'JEE Chemistry NCERT',
        'NEET Chemistry solutions',
        'Electrochemistry Class 12 NCERT Solutions',
        'Organic Chemistry NCERT solutions',
    ],
    openGraph: {
        title: 'NCERT Solutions for Class 11 & 12 Chemistry | Canvas Classes',
        description: 'Free step-by-step NCERT Chemistry solutions for Class 11 & 12. All chapters with detailed explanations for CBSE, JEE & NEET.',
        type: 'website',
    },
};

// Server-side data fetching for SEO (ensures Google sees content on first render)
export default async function NCERTSolutionsPage() {
    const [chapters, stats] = await Promise.all([
        getChapterGroups(),
        getNCERTStats(),
    ]);

    return <NCERTSolutionsClient initialChapters={chapters} initialStats={stats} />;
}
