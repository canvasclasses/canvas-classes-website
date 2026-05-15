import { Metadata } from 'next';
import FlashcardsClient from './FlashcardsClient';
import { getChapterSummaries } from '../lib/flashcardsData';
import { FLASHCARD_CATEGORIES } from '@/lib/flashcardTaxonomy';

export const revalidate = 86400;

const BASE_URL = 'https://www.canvasclasses.in';

// ─── Dynamic metadata — uses live chapter data for accurate counts ────────────
export async function generateMetadata(): Promise<Metadata> {
    const summaries = await getChapterSummaries();
    const totalCards = summaries.reduce(
        (sum, s) => sum + s.topics.reduce((t, tp) => t + tp.cardIds.length, 0),
        0
    );
    const totalChapters = summaries.length;

    return {
        title: `Chemistry Flashcards – ${totalCards}+ Cards, ${totalChapters} Chapters | Canvas Classes`,
        description: `Master Class 12 Chemistry with ${totalCards}+ flashcards across ${totalChapters} chapters — Physical, Organic & Inorganic. Spaced repetition algorithm built for JEE Main, JEE Advanced, NEET & BITSAT. Made by Paaras Sir at Canvas Classes.`,
        keywords: [
            'chemistry flashcards class 12',
            'JEE chemistry revision flashcards',
            'NEET chemistry flashcards',
            'BITSAT chemistry cards',
            'spaced repetition chemistry',
            'NCERT chemistry revision',
            'physical chemistry flashcards',
            'organic chemistry flashcards',
            'inorganic chemistry flashcards',
            'solutions electrochemistry flashcards',
            'coordination compounds flashcards',
            'polymers biomolecules flashcards',
            'class 12 chemistry quick revision',
            'Paaras Sir flashcards',
            'Canvas Classes study tool',
            'active recall chemistry',
        ],
        alternates: {
            canonical: `${BASE_URL}/chemistry-flashcards`,
        },
        openGraph: {
            type: 'website',
            url: `${BASE_URL}/chemistry-flashcards`,
            title: `Chemistry Flashcards – ${totalCards}+ Cards | Canvas Classes`,
            description: `${totalCards}+ research-backed flashcards for Class 12 Chemistry. Covers all ${totalChapters} chapters with spaced repetition. Ideal for JEE, NEET & BITSAT prep.`,
            siteName: 'Canvas Classes',
            images: [
                {
                    url: `${BASE_URL}/og-flashcards.png`,
                    width: 1200,
                    height: 630,
                    alt: 'Canvas Classes Chemistry Flashcards – Spaced Repetition for JEE & NEET',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `Chemistry Flashcards – ${totalCards}+ Cards | Canvas Classes`,
            description: `Master Class 12 Chemistry with spaced repetition. ${totalCards}+ cards, ${totalChapters} chapters. JEE · NEET · BITSAT.`,
            images: [`${BASE_URL}/og-flashcards.png`],
        },
        robots: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
        },
    };
}

// ─── Structured data builders ─────────────────────────────────────────────────

function buildBreadcrumbSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Study Lab', item: `${BASE_URL}/study-lab` },
            { '@type': 'ListItem', position: 3, name: 'Chemistry Flashcards', item: `${BASE_URL}/chemistry-flashcards` },
        ],
    };
}

function buildCourseSchema(totalCards: number, totalChapters: number) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: 'Class 12 Chemistry Flashcards – Complete Revision',
        description: `Comprehensive spaced-repetition flashcard course covering all ${totalChapters} chapters of Class 12 NCERT Chemistry. ${totalCards}+ cards designed for JEE Main, JEE Advanced, NEET, and BITSAT preparation.`,
        url: `${BASE_URL}/chemistry-flashcards`,
        provider: {
            '@type': 'Organization',
            name: 'Canvas Classes',
            url: BASE_URL,
            logo: `${BASE_URL}/logo.png`,
        },
        instructor: {
            '@type': 'Person',
            name: 'Paaras Thakur',
            jobTitle: 'Chemistry Educator',
            url: BASE_URL,
        },
        educationalLevel: 'Class 12 / Grade 12',
        audience: {
            '@type': 'EducationalAudience',
            educationalRole: 'student',
            audienceType: 'JEE, NEET, BITSAT, CBSE Class 12 students',
        },
        about: [
            { '@type': 'Thing', name: 'Physical Chemistry' },
            { '@type': 'Thing', name: 'Organic Chemistry' },
            { '@type': 'Thing', name: 'Inorganic Chemistry' },
            { '@type': 'Thing', name: 'Spaced Repetition Learning' },
        ],
        teaches: [
            'Solutions and Colligative Properties',
            'Electrochemistry and Nernst Equation',
            'Chemical Kinetics and Rate Laws',
            'Solid State Chemistry',
            'Surface Chemistry and Adsorption',
            'Coordination Compounds and Crystal Field Theory',
            'Haloalkanes and Haloarenes',
            'Alcohols, Phenols and Ethers',
            'Aldehydes, Ketones and Carboxylic Acids',
            'Amines and Diazonium Salts',
            'Biomolecules – Carbohydrates, Proteins, Enzymes',
            'Polymers – Classification, Types, Mechanisms',
            'P-Block, D-Block and F-Block Elements',
            'Metallurgy and Extraction of Metals',
        ],
        isAccessibleForFree: true,
        inLanguage: 'en',
        datePublished: '2024-01-01',
        dateModified: new Date().toISOString().split('T')[0],
    };
}

function buildItemListSchema() {
    const allChapters = FLASHCARD_CATEGORIES.flatMap((cat) =>
        cat.chapters.map((ch) => ({
            name: ch.displayName,
            url: `${BASE_URL}/chemistry-flashcards/${ch.id.replace('fc_', '')}`,
            cardCount: ch.cardCount,
            category: cat.displayName,
        }))
    );

    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Class 12 Chemistry Flashcard Chapters',
        description: 'Complete list of chemistry flashcard chapters covering Physical, Organic, and Inorganic Chemistry for Class 12 JEE/NEET/BITSAT preparation.',
        numberOfItems: allChapters.length,
        itemListElement: allChapters.map((ch, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: `${ch.name} Flashcards – ${ch.cardCount} Cards`,
            url: ch.url,
            description: `${ch.cardCount} flashcards on ${ch.name} (${ch.category}) for Class 12 chemistry revision.`,
        })),
    };
}

function buildFaqSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What chemistry chapters are covered in these flashcards?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'All 30 chapters across Physical Chemistry (Solutions, Electrochemistry, Chemical Kinetics, Solid State, Surface Chemistry, Atomic Structure), Organic Chemistry (Biomolecules, Haloalkanes, Alcohols & Phenols, Stereochemistry, Aldehydes & Ketones, Amines, GOC, Polymers, Organic Name Reactions), and Inorganic Chemistry (D & F Block, Coordination Compounds, P-Block Elements, Salt Analysis, Metallurgy, Alloys, and more). Also includes JEE PYQ cards.',
                },
            },
            {
                '@type': 'Question',
                name: 'Are these flashcards good for JEE Main and JEE Advanced?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Every card is written to the JEE Mains and JEE Advanced syllabus. Cards cover reaction mechanisms, named reactions, exceptions, standard electrode potentials, coordination compound theory, and all high-weightage concepts that JEE tests. The spaced repetition algorithm ensures you retain these facts till exam day.',
                },
            },
            {
                '@type': 'Question',
                name: 'How does the spaced repetition system work?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'After you rate a card (Correct / Needs Review), the algorithm schedules the next review using the SM-2 algorithm. Cards you find hard appear again in 1–2 days; cards you know well are pushed to 7, 14, or 30+ days. This mirrors how long-term memory actually works and dramatically reduces total study time compared to re-reading notes.',
                },
            },
            {
                '@type': 'Question',
                name: 'What is the difference between these flashcards and regular notes?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Notes are passive — you read and forget. Flashcards force active recall: your brain must retrieve the answer before seeing it, which strengthens the memory trace 3–5× more than re-reading. Our spaced repetition system also shows each card at the exact moment you are about to forget it, making revision highly efficient.',
                },
            },
            {
                '@type': 'Question',
                name: 'Can I practice specific topics within a chapter?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Every chapter is divided into focused sub-topics. For example, Electrochemistry has 9 sub-topics: Batteries, Conductance, Corrosion, Electrolysis & Faraday\'s Laws, Fuel Cells, Galvanic Cells, Kohlrausch Law, Nernst Equation, and Standard Electrode Potential. You can select any combination of sub-topics to practice.',
                },
            },
            {
                '@type': 'Question',
                name: 'Are these flashcards useful for NEET chemistry?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Absolutely. The flashcards are based on NCERT Class 12 Chemistry, which is the primary source for NEET. Topics like Biomolecules, Polymers, Chemistry in Everyday Life, Electrochemistry, and all inorganic chapters are covered in depth. NEET-specific facts, exceptions, and direct-question patterns are embedded in every card.',
                },
            },
            {
                '@type': 'Question',
                name: 'What makes Polymers a memory-based chapter for BITSAT?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'In BITSAT, Polymers questions test direct recall: monomer names, polymer classifications (addition vs condensation), linkage types (amide, ester), biodegradability, specific uses, and molecular mass formulas (Mn, Mw, PDI). There is very little calculation — every question is about remembering a specific fact, making flashcard revision ideal for this chapter.',
                },
            },
            {
                '@type': 'Question',
                name: 'Is my progress saved between sessions?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Your mastery level, due dates, and accuracy for every card are stored in your browser\'s local storage. They persist across browser sessions on the same device. The system tracks New, Learning, Reviewing, and Mastered status for each of the 2500+ cards separately.',
                },
            },
        ],
    };
}

function buildOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: 'Canvas Classes',
        url: BASE_URL,
        description: 'Canvas Classes is a chemistry-first EdTech platform for Class 11–12 students preparing for JEE, NEET, and BITSAT. Founded by Paaras Sir, it offers flashcards, question banks, interactive simulations, and college predictor tools.',
        founder: {
            '@type': 'Person',
            name: 'Paaras Thakur',
        },
        sameAs: [
            'https://www.youtube.com/@canvasclasses',
        ],
        offers: {
            '@type': 'Offer',
            name: 'Free Chemistry Flashcards',
            price: '0',
            priceCurrency: 'INR',
            url: `${BASE_URL}/chemistry-flashcards`,
        },
    };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function FlashcardsPage() {
    const chapterSummaries = await getChapterSummaries();
    const totalCards = chapterSummaries.reduce(
        (sum, s) => sum + s.topics.reduce((t, tp) => t + tp.cardIds.length, 0),
        0
    );
    const totalChapters = chapterSummaries.length;

    return (
        <>
            {/* Breadcrumb */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema()) }}
            />
            {/* Course */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCourseSchema(totalCards, totalChapters)) }}
            />
            {/* Chapter list — enables AI engines to discover individual chapter URLs */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildItemListSchema()) }}
            />
            {/* FAQ — primary GEO signal; answers questions students ask AI engines */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema()) }}
            />
            {/* Organization entity — helps AI engines understand who publishes this */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }}
            />

            <FlashcardsClient chapterSummaries={chapterSummaries} />
        </>
    );
}
