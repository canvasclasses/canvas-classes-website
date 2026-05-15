import { Metadata } from 'next';
import ComingSoonTemplate from '../components/ComingSoonTemplate';

export const metadata: Metadata = {
    title: 'CBSE Class 10 Chemistry - Coming Soon',
    description: 'CBSE Class 10 Chemistry resources coming soon! Video lectures, notes, NCERT solutions, and practice materials for Class 10 students.',
    keywords: ['CBSE Class 10 Chemistry', 'Class 10 Chemistry notes', 'Class 10 NCERT solutions', 'Class 10 Chemistry lectures'],
};

export default function CBSEClass10Page() {
    return (
        <ComingSoonTemplate
            classNumber="10"
            title="CBSE Class 10 Chemistry"
            description="Comprehensive Chemistry resources for Class 10 students. Complete NCERT coverage, video lectures, notes, and practice materials - all coming soon!"
            features={[
                "Video Lectures",
                "Chapter Notes",
                "NCERT Solutions",
                "Practice MCQs"
            ]}
            accentColor="emerald"
            gradientFrom="from-emerald-500"
            gradientTo="to-teal-500"
        />
    );
}
