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
    alternates: {
        canonical: '/ncert-solutions',
    },
};

// FAQ Schema for SEO
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Are NCERT solutions available for all chemistry chapters?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we provide detailed solutions for all Class 11 and Class 12 NCERT Chemistry textbook questions, covering every chapter."
            }
        },
        {
            "@type": "Question",
            "name": "Are these solutions free to access?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, all NCERT solutions on Canvas Classes are completely free."
            }
        },
        {
            "@type": "Question",
            "name": "Do solutions include step-by-step explanations?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, each solution includes detailed step-by-step explanations with concepts, formulas, and reasoning clearly explained."
            }
        },
        {
            "@type": "Question",
            "name": "Are these solutions sufficient for board exams?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely! NCERT solutions form the foundation of CBSE board exams. Mastering these ensures you're well-prepared for your Class 12 Chemistry exam."
            }
        },
        {
            "@type": "Question",
            "name": "Can I use these for JEE/NEET preparation?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, NCERT is the base for competitive exams. Our solutions help you understand concepts deeply which is essential for JEE and NEET."
            }
        }
    ]
};

// Server-side data fetching for SEO (ensures Google sees content on first render)
export default async function NCERTSolutionsPage() {
    const [chapters, stats] = await Promise.all([
        getChapterGroups(),
        getNCERTStats(),
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <NCERTSolutionsClient initialChapters={chapters} initialStats={stats} />
        </>
    );
}
