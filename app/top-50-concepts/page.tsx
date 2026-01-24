import { Metadata } from 'next';
import Top50Client from './Top50Client';

import { fetchTop50Data } from '@/app/lib/top50Data';

export const metadata: Metadata = {
    title: 'Top 50 Must-Know Chemistry Concepts for JEE & NEET 2025 | Canvas Classes',
    description: 'Handpicked top 50 Chemistry concepts frequently asked in JEE & NEET. Essential preparation topics with video lectures and PDF notes for Physics, Chemistry.',
    keywords: [
        'Top 50 Chemistry concepts JEE',
        'Important Chemistry topics NEET',
        'Must-know Chemistry concepts',
        'JEE Chemistry important topics',
        'NEET Chemistry high yield topics',
        'Top Chemistry concepts Class 11 12',
        'JEE Mains Chemistry topics',
    ],
    openGraph: {
        title: 'Top 50 Must-Know Chemistry Concepts for JEE & NEET | Canvas Classes',
        description: 'Master the most important Chemistry concepts for JEE & NEET with video lectures and notes.',
        type: 'website',
    },
    alternates: {
        canonical: '/top-50-concepts',
    },
};

// FAQ Schema for SEO
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "How were these 50 concepts selected?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "These concepts were selected based on frequency in previous year JEE and NEET papers, their importance in building conceptual understanding, and their scoring potential."
            }
        },
        {
            "@type": "Question",
            "name": "Are these concepts from NCERT?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, all concepts are aligned with NCERT syllabus but explained in a way that's optimized for competitive exam preparation."
            }
        },
        {
            "@type": "Question",
            "name": "Which exam are these targeted for - JEE or NEET?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "These concepts are common to both JEE and NEET Chemistry syllabus, making them useful for students preparing for either exam."
            }
        },
        {
            "@type": "Question",
            "name": "How should I use these concepts for revision?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Use these as a quick revision checklist before exams. Ensure you understand each concept thoroughly and can solve related problems."
            }
        },
        {
            "@type": "Question",
            "name": "Are numerical problems also covered?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, important numerical concepts and formulas are included with problem-solving approaches."
            }
        }
    ]
};

// Server-side data fetching for SEO
export default async function Top50Page() {
    const concepts = await fetchTop50Data();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Top50Client initialConcepts={concepts} />
        </>
    );
}
