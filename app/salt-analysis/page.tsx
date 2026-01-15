import type { Metadata } from 'next';
import SaltAnalysisClient from './SaltAnalysisClient';

export const metadata: Metadata = {
    title: 'Salt Analysis Simulator | NCERT Lab Practical | Canvas Classes',
    description: 'Interactive Salt Analysis Simulator based on NCERT Chemistry Lab Manual. Practice qualitative analysis for CBSE Class 12 practical exams with step-by-step guided experiments.',
    keywords: ['salt analysis', 'NCERT chemistry', 'CBSE practical', 'qualitative analysis', 'cation analysis', 'anion analysis', 'chemistry lab', 'class 12 chemistry'],
    openGraph: {
        title: 'Salt Analysis Simulator - NCERT Lab Practical',
        description: 'Practice CBSE Chemistry practical with our interactive salt analysis simulator',
    },
};

export default function SaltAnalysisPage() {
    return <SaltAnalysisClient />;
}
