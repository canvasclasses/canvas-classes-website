import { Metadata } from 'next';
import ComingSoonTemplate from '../components/ComingSoonTemplate';

export const metadata: Metadata = {
    title: 'CBSE Class 12 Chemistry - Coming Soon',
    description: 'CBSE Class 12 Chemistry resources coming soon! Additional video lectures, advanced notes, and board exam preparation materials.',
    keywords: ['CBSE Class 12 Chemistry', 'Class 12 Chemistry notes', 'Class 12 board preparation', 'Class 12 Chemistry lectures'],
};

export default function CBSEClass12Page() {
    return (
        <ComingSoonTemplate
            classNumber="12"
            title="CBSE Class 12 Chemistry"
            description="More Class 12 Chemistry content coming soon! While we prepare additional resources, explore our existing Class 12 revision materials, flashcards, and practice questions."
            features={[
                "More Lectures",
                "Board Tips",
                "Previous Years",
                "Mock Tests"
            ]}
            accentColor="purple"
            gradientFrom="from-purple-500"
            gradientTo="to-pink-500"
        />
    );
}
