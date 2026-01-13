import { Metadata } from 'next';
import OneShotClient from './OneShotClient';
import { fetchQuickRecapData } from '../lib/quickRecapData';

export const metadata: Metadata = {
    title: 'One Shot Chemistry Lectures for JEE & NEET 2025 - Complete Chapters | Canvas Classes',
    description: 'One shot Chemistry lectures covering complete chapters in single videos. Master Organic, Inorganic & Physical Chemistry for JEE Main, JEE Advanced & NEET 2025 preparation.',
    keywords: [
        'one shot chemistry',
        'one shot chemistry JEE',
        'one shot organic chemistry',
        'one shot inorganic chemistry',
        'one shot physical chemistry',
        'chemistry one shot NEET',
        'complete chemistry in one video',
        'JEE chemistry revision one shot',
        'NEET chemistry full syllabus one shot',
        'one shot chemistry class 12',
        'one shot chemistry class 11',
        'chemistry one shot for boards',
    ],
    openGraph: {
        title: 'One Shot Chemistry Lectures for JEE & NEET 2025 | Canvas Classes',
        description: 'Master complete Chemistry chapters in single videos. Free one shot lectures for JEE & NEET preparation.',
        type: 'website',
    },
    alternates: {
        canonical: '/one-shot-lectures',
    },
};

// Server-side data fetching for SEO
export default async function OneShotLecturesPage() {
    const videos = await fetchQuickRecapData();
    return <OneShotClient initialVideos={videos} />;
}
