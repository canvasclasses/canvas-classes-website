import { Metadata } from 'next';
import BitsatRevisionClient from './BitsatRevisionClient';

export const metadata: Metadata = {
    title: 'BITSAT 2026 Chemistry Revision: 30-Day Session 2 Master Plan | Canvas Classes',
    description:
        'Free BITSAT 2026 Chemistry revision plan built from real Session 1 data. 30-day master plan covering deleted syllabus, Physical, Organic & Inorganic — with flashcards, interactive periodic table, one-shot lectures and handwritten notes for every phase.',
    keywords: [
        'BITSAT 2026 Chemistry preparation',
        'BITSAT Chemistry revision',
        'BITSAT Session 2 plan',
        'BITSAT 30 day plan',
        'BITSAT Chemistry strategy',
        'BITSAT deleted syllabus chemistry',
        'BITSAT Polymers Solid State preparation',
        'BITSAT Chemistry in Everyday Life',
        'BITSAT mock chaos drill',
        'BITSAT Chemistry crash course',
    ],
    openGraph: {
        title: 'BITSAT 2026 Chemistry Revision — 30-Day Session 2 Master Plan',
        description:
            'The most precise BITSAT Chemistry plan online — built from Session 1 post-mortem. 4 phases, 30 days, every day mapped to free Canvas Classes resources.',
        type: 'website',
    },
    alternates: {
        canonical: '/bitsat-chemistry-revision',
    },
};

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'Why is BITSAT Chemistry harder than JEE Mains Chemistry?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'BITSAT does not follow the reduced JEE syllabus. Chapters like Polymers, Solid State, s-Block, Chemistry in Everyday Life and Environmental Chemistry are fully active and account for 5–10 questions per paper — roughly 30 marks that JEE-only aspirants typically lose.',
            },
        },
        {
            '@type': 'Question',
            name: 'Which Chemistry chapters were most asked in BITSAT Session 1?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Solid State, Polymers, Chemistry in Everyday Life, Electrochemistry, Chemical Kinetics, Stereoisomerism, Coordination Compounds and niche Inorganic trivia (Polydispersity Index, Agostic interactions, oxidation state of Fe in deoxymyoglobin).',
            },
        },
        {
            '@type': 'Question',
            name: 'Is 30 days enough to prepare Chemistry for BITSAT 2026 Session 2?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes — if you follow a phased plan. Days 1–7 lock in the deleted-syllabus marks, Days 8–17 build calculation stamina for Physical Chemistry, Days 18–25 cover Organic mechanisms and niche Inorganic, and Days 26–30 are pure mock simulation with the BITSAT UI quirks.',
            },
        },
        {
            '@type': 'Question',
            name: 'How do I practise without a calculator the way BITSAT demands?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'BITSAT gives non-standard numbers (e.g. 10.1 minute half-life, awkward log values in Nernst). Build the habit of approximation: round to one significant figure first, then refine. If a Physical Chemistry question takes more than 90 seconds, skip and return.',
            },
        },
        {
            '@type': 'Question',
            name: 'Should I attempt the BITSAT bonus questions?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Only if you have 20+ minutes left and have confidently attempted 115+ regular questions. The Session 1 bonus block was reported as advanced and trap-heavy — it is high-risk, high-reward and can wreck accuracy.',
            },
        },
        {
            '@type': 'Question',
            name: 'Is this BITSAT Chemistry plan free?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes — the entire 30-day plan and every linked resource (flashcards, interactive periodic table, one-shot lectures, handwritten notes) is free on Canvas Classes.',
            },
        },
    ],
};

export default function BitsatRevisionPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <BitsatRevisionClient />
        </>
    );
}
