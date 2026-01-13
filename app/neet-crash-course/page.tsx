import { Metadata } from 'next';
import NeetCrashCourseClient from './NeetCrashCourseClient';
import { fetchNeetCrashCourseData } from '@/app/lib/neetCrashCourseData';

export const metadata: Metadata = {
    title: 'NEET Chemistry Crash Course 2025 - Free Complete Course | Canvas Classes',
    description: 'Free NEET Chemistry crash course with high-yield lectures, DPP, and video solutions. Complete Class 11 & 12 revision for NEET 2025 preparation.',
    keywords: [
        'NEET Chemistry crash course',
        'NEET 2025 Chemistry preparation',
        'Quick NEET Chemistry course',
        'NEET Chemistry revision',
        'Free NEET crash course',
        'NEET Chemistry free course',
        'NEET 2025 preparation Chemistry',
    ],
    openGraph: {
        title: 'NEET Chemistry Crash Course 2025 - Free Complete Course | Canvas Classes',
        description: 'Free comprehensive NEET Chemistry crash course covering Class 11 & 12 syllabus.',
        type: 'website',
    },
};

// Server-side data fetching for SEO
export default async function NeetCrashCoursePage() {
    const chapters = await fetchNeetCrashCourseData();
    return <NeetCrashCourseClient initialChapters={chapters} />;
}
