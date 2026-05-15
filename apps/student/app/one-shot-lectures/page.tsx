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

// FAQ Schema for SEO
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is a one shot lecture?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "A one shot lecture covers an entire chapter in a single video. Unlike marathon 6-8 hour lectures, our one shots are crisp 30-120 minute sessions focused on high-yield topics for JEE and NEET."
            }
        },
        {
            "@type": "Question",
            "name": "How are these different from other one shot videos on YouTube?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our one shots are shorter and more focused. We prioritize conceptual clarity and high-scoring topics rather than trying to cover everything in exhausting marathon sessions."
            }
        },
        {
            "@type": "Question",
            "name": "Which chapters are covered in one shot lectures?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "We cover all major chapters from Class 11 and 12 Chemistry including Physical, Organic, and Inorganic Chemistry - perfect for JEE Main, JEE Advanced, and NEET preparation."
            }
        },
        {
            "@type": "Question",
            "name": "Can I use these for last-minute revision?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely! These are designed for quick revision before exams. Each video covers key concepts, important reactions, and high-yield topics in a focused manner."
            }
        },
        {
            "@type": "Question",
            "name": "Who teaches these one shot lectures?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "All lectures are taught by Paaras Sir in his friendly, easy-to-understand teaching style that students love."
            }
        }
    ]
};

// Server-side data fetching for SEO
export default async function OneShotLecturesPage() {
    const videos = await fetchQuickRecapData();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <OneShotClient initialVideos={videos} />
        </>
    );
}
