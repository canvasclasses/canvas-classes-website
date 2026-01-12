import { Metadata } from 'next';
import ComingSoonTemplate from '../components/ComingSoonTemplate';

export const metadata: Metadata = {
    title: 'CBSE Class 11 Chemistry - Coming Soon',
    description: 'CBSE Class 11 Chemistry resources coming soon! Video lectures, notes, NCERT solutions, and practice materials for Class 11 students preparing for boards and competitive exams.',
    keywords: ['CBSE Class 11 Chemistry', 'Class 11 Chemistry notes', 'Class 11 NCERT solutions', 'Class 11 Chemistry lectures', 'JEE preparation Class 11'],
};

export default function CBSEClass11Page() {
    return (
        <ComingSoonTemplate
            classNumber="11"
            title="CBSE Class 11 Chemistry"
            description="Build your foundation strong with Class 11 Chemistry. Complete NCERT coverage, JEE/NEET oriented content, video lectures, and comprehensive notes - all coming soon!"
            features={[
                "Video Lectures",
                "Handwritten Notes",
                "NCERT Solutions",
                "JEE/NEET Prep"
            ]}
            accentColor="blue"
            gradientFrom="from-blue-500"
            gradientTo="to-cyan-500"
        />
    );
}
