import { Metadata } from 'next';
import RevisionClient from './RevisionClient';
import { fetchRevisionData, fetchRevisionTopics, fetchFlashcards } from '../lib/revisionData';

export const metadata: Metadata = {
    title: 'NCERT Chemistry Revision Class 12 - Formulas, Infographics & Flashcards | Canvas Classes',
    description: 'Quick revision for CBSE Class 12 Chemistry with chapter summaries, infographics, and flashcards. All formulas, graphs, and tricks in one place for CBSE Boards, JEE & NEET 2025-26.',
    keywords: [
        'NCERT Chemistry revision Class 12',
        'CBSE Chemistry quick revision',
        'Chemistry formulas Class 12',
        'Chemistry infographics PDF',
        'Class 12 Chemistry chapter summaries',
        'Last minute revision Chemistry CBSE',
        'JEE Chemistry revision notes',
        'NEET Chemistry quick revision',
    ],
    openGraph: {
        title: 'NCERT Chemistry Revision Class 12 | Canvas Classes',
        description: 'Quick revision for CBSE Class 12 Chemistry with summaries, infographics, and flashcards for JEE & NEET.',
        type: 'website',
    },
    alternates: {
        canonical: '/cbse-12-ncert-revision',
    },
};

// FAQ Schema for SEO
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Is this aligned with the latest CBSE syllabus?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, all content is based on the latest CBSE Class 12 Chemistry syllabus and NCERT textbooks."
            }
        },
        {
            "@type": "Question",
            "name": "What's included in the revision materials?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Chapter summaries, key concepts, important reactions, formulas, and exam-oriented tips for each chapter."
            }
        },
        {
            "@type": "Question",
            "name": "How much time do I need to revise using these?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Each chapter can be revised in 15-30 minutes, making it perfect for exam preparation when time is limited."
            }
        },
        {
            "@type": "Question",
            "name": "Are sample questions included?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, important questions and previous year board exam questions are highlighted for practice."
            }
        },
        {
            "@type": "Question",
            "name": "Can I use this the night before my exam?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! These summaries are designed for quick last-minute revision to refresh all key concepts."
            }
        }
    ]
};

// Server-side data fetching for SEO (ensures Google sees content on first render)
export default async function RevisionPage() {
    const [chapters, topics, flashcards] = await Promise.all([
        fetchRevisionData(),
        fetchRevisionTopics(),
        fetchFlashcards()
    ]);

    // Enrich chapters with counts
    const enrichedChapters = chapters.map(chapter => {
        const chapterTopics = topics.filter(t => t.chapterNum === chapter.chapterNum.toString());
        const infographicsCount = chapterTopics.filter(t => t.infographicUrl && t.infographicUrl.trim() !== '').length;
        const flashcardsCount = flashcards.filter(f =>
            f.chapterName.toLowerCase() === chapter.chapterName.toLowerCase()
        ).length;

        return {
            ...chapter,
            infographicsCount,
            flashcardsCount,
            hasSummary: Boolean(chapter.summary && chapter.summary.trim().length > 50)
        };
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <RevisionClient initialChapters={enrichedChapters} />
        </>
    );
}
