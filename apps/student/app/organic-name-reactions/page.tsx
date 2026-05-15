import { Metadata } from 'next';
import OrganicReactionsClient from './OrganicReactionsClient';
import { fetchOrganicReactions } from '../lib/organicReactionsData';

export const revalidate = 86400;

export const metadata: Metadata = {
    title: 'All Organic Name Reactions for JEE, NEET & CBSE - Mechanisms & Notes | Canvas Classes',
    description: 'Complete list of all organic name reactions from NCERT Class 11 & 12 with mechanisms, reagents, and handwritten notes. Master Aldol, Cannizzaro, Friedel-Crafts for JEE, NEET & CBSE Boards.',
    keywords: [
        'Organic name reactions JEE',
        'Name reactions organic chemistry NEET',
        'Organic reactions Class 12',
        'Name reactions PDF',
        'Aldol condensation mechanism',
        'Cannizzaro reaction',
        'Friedel-Crafts reaction',
        'Wurtz reaction',
        'Sandmeyer reaction',
        'NCERT organic chemistry reactions',
    ],
    openGraph: {
        title: 'All Organic Name Reactions for JEE, NEET & CBSE | Canvas Classes',
        description: 'Complete list of organic name reactions with mechanisms and notes for NCERT Class 11 & 12.',
        type: 'website',
    },
    alternates: {
        canonical: '/organic-name-reactions',
    },
};

// FAQ Schema for SEO
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "How many name reactions are covered?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "All important organic name reactions from Class 11 and 12 NCERT syllabus are covered, including those frequently asked in JEE and NEET."
            }
        },
        {
            "@type": "Question",
            "name": "Are reaction mechanisms explained?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, each reaction includes complete mechanism with arrow pushing, intermediates, and products clearly shown."
            }
        },
        {
            "@type": "Question",
            "name": "Are these reactions sufficient for JEE Advanced?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, these cover all NCERT reactions which form the base. For JEE Advanced, understanding mechanisms is key, which we explain in detail."
            }
        },
        {
            "@type": "Question",
            "name": "How should I memorize these reactions?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Focus on understanding the mechanism rather than rote memorization. We provide tips and patterns to remember reactions easily."
            }
        },
        {
            "@type": "Question",
            "name": "Are reagent conditions also covered?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, specific reagents, conditions (temperature, catalyst), and any special requirements are mentioned for each reaction."
            }
        }
    ]
};

// Server-side data fetching for SEO (ensures Google sees content on first render)
export default async function OrganicNameReactionsPage() {
    const reactions = await fetchOrganicReactions();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <OrganicReactionsClient initialReactions={reactions} />
        </>
    );
}
