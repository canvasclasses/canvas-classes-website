import { Metadata } from 'next';
import FlashcardsClient from './FlashcardsClient';
import { fetchFlashcards } from '../lib/revisionData';

export const revalidate = 86400;

export const metadata: Metadata = {
    title: 'Mastering NCERT Chemistry with well researched Flashcards, made by Paaras Sir | Canvas Classes',
    description: 'Master Class 12 NCERT Chemistry with well-researched flashcards made by Paaras Sir. Interactive spaced repetition for Solutions, Electrochemistry, Organic & Inorganic. Perfect for CBSE, JEE & NEET prep.',
    keywords: [
        'chemistry flashcards',
        'class 12 flashcards',
        'CBSE flashcards',
        'JEE chemistry cards',
        'NEET chemistry revision',
        'physical chemistry flashcards',
        'organic chemistry flashcards',
        'inorganic chemistry flashcards',
        'spaced repetition chemistry',
        'NCERT chemistry revision',
        'Paaras Sir chemistry',
        'Canvas Classes flashcards'
    ],
    alternates: {
        canonical: '/chemistry-flashcards',
    },
};

// FAQ Schema for SEO
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What are Chemistry Flashcards?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Chemistry flashcards are digital study cards that present questions on one side and answers on the other. Our flashcards cover all Class 12 NCERT Chemistry topics including Physical, Organic, and Inorganic Chemistry, designed specifically for JEE, NEET, and CBSE board exam preparation."
            }
        },
        {
            "@type": "Question",
            "name": "How does spaced repetition help in learning?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Spaced repetition is a scientifically-proven learning technique that shows you cards at increasing intervals based on how well you remember them. Cards you find difficult appear more frequently, while mastered cards appear less often. This optimizes your study time and improves long-term retention by up to 200%."
            }
        },
        {
            "@type": "Question",
            "name": "Which chemistry chapters are covered?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our flashcards cover all 16 chapters of Class 12 NCERT Chemistry including Solutions, Electrochemistry, Chemical Kinetics, Surface Chemistry, Coordination Compounds, Haloalkanes, Alcohols, Aldehydes & Ketones, Amines, Biomolecules, Polymers, and more."
            }
        },
        {
            "@type": "Question",
            "name": "Are these flashcards aligned with NCERT?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! All our flashcards are based on NCERT textbooks and cover the exact topics, definitions, reactions, and concepts mentioned in the NCERT curriculum. They're perfect for CBSE board exams, JEE Main, JEE Advanced, and NEET preparation."
            }
        },
        {
            "@type": "Question",
            "name": "How do I track my progress?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Your progress is automatically saved in your browser. You can see mastery levels for each chapter - from 'New' to 'Mastered'. The system tracks which cards are due for review and shows you statistics like total cards reviewed, cards mastered, and cards that need more practice."
            }
        },
        {
            "@type": "Question",
            "name": "Can I practice specific topics within a chapter?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely! After selecting a chapter, you can choose specific topics to practice. You can also filter between 'Due Cards' (cards that need review based on spaced repetition) or 'All Cards' for comprehensive practice."
            }
        }
    ]
};

// Server-side data fetching for SEO (ensures Google sees content on first render)
export default async function FlashcardsPage() {
    const flashcards = await fetchFlashcards();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <FlashcardsClient initialFlashcards={flashcards} />
        </>
    );
}
