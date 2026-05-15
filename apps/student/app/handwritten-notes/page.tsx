import { Metadata } from "next";
import Script from "next/script";
import HandwrittenNotesClient from "./HandwrittenNotesClient";
import { fetchHandwrittenNotes, type HandwrittenNote } from "../lib/handwrittenNotesData";

export const revalidate = 86400;

const BASE_URL = 'https://www.canvasclasses.in';

// Branded social-share image — used on this index page and across every
// chapter page. White-themed alt also lives in R2 if we ever want to flip:
//   https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/handwritten-notes/White%20Notes%20by%20Paaras%20Sir.webp
const OG_IMAGE_URL =
    'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/handwritten-notes/Black%20notes%20by%20Paaras%20Sir.webp';

// Author entity — referenced from every LearningResource via @id so Google
// can attribute all 54 notes to the same Person without inflating the graph.
const PAARAS_PERSON = {
    '@type': 'Person' as const,
    '@id': `${BASE_URL}#paaras-sir`,
    name: 'Paaras Sir',
    description:
        'Chemistry educator at Canvas Classes. Founder and lead author of the handwritten Chemistry notes used by JEE, NEET and CBSE students.',
    jobTitle: 'Chemistry Educator',
    worksFor: {
        '@type': 'Organization',
        '@id': `${BASE_URL}#org`,
        name: 'Canvas Classes',
        url: BASE_URL,
    },
    knowsAbout: [
        'JEE Chemistry',
        'NEET Chemistry',
        'CBSE Class 11 Chemistry',
        'CBSE Class 12 Chemistry',
        'Organic Chemistry',
        'Inorganic Chemistry',
        'Physical Chemistry',
    ],
};

// Notes were first published mid-2025 alongside the rest of Canvas Classes.
// Use a stable date here; dateModified is regenerated on every ISR build.
const DATE_PUBLISHED = '2025-09-01T00:00:00+05:30';

export const metadata: Metadata = {
    title: "Free Handwritten Chemistry Notes PDF — All Chapters | JEE, NEET & CBSE",
    description:
        "Download free handwritten chemistry notes by Paaras Sir — all Class 11 & 12 chapters: Organic, Inorganic & Physical Chemistry. Highlighted NCERTs, revision sheets, and exam-focused PDFs for JEE Main, JEE Advanced, NEET, and CBSE 2025-26.",
    keywords: [
        "handwritten chemistry notes PDF",
        "free chemistry notes download",
        "JEE chemistry notes",
        "NEET chemistry notes PDF",
        "CBSE class 12 chemistry notes",
        "CBSE class 11 chemistry notes",
        "organic chemistry handwritten notes",
        "physical chemistry notes JEE",
        "inorganic chemistry notes NEET",
        "chemistry notes by Paaras Sir",
        "highlighted NCERT chemistry",
        "chemistry revision notes PDF",
        "class 11 chemistry notes",
        "class 12 chemistry notes",
    ],
    authors: [{ name: 'Paaras Sir', url: BASE_URL }],
    creator: 'Paaras Sir',
    publisher: 'Canvas Classes',
    openGraph: {
        title: "Free Handwritten Chemistry Notes PDF — All Chapters | JEE, NEET & CBSE",
        description:
            "Free handwritten chemistry notes by Paaras Sir. All chapters of Organic, Inorganic & Physical Chemistry for Class 11 & 12, JEE, and NEET.",
        type: "website",
        url: `${BASE_URL}/handwritten-notes`,
        locale: "en_IN",
        siteName: "Canvas Classes",
        images: [
            {
                url: OG_IMAGE_URL,
                width: 1200,
                height: 630,
                alt: 'Free Handwritten Chemistry Notes by Paaras Sir — Canvas Classes',
                type: 'image/webp',
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Handwritten Chemistry Notes PDF | JEE, NEET & CBSE",
        description:
            "Download free handwritten notes for all Chemistry chapters — Organic, Inorganic & Physical. JEE, NEET & CBSE Class 11 & 12.",
        images: [OG_IMAGE_URL],
        creator: '@canvasclasses',
    },
    alternates: { canonical: `${BASE_URL}/handwritten-notes` },
};

function buildStructuredData(notes: HandwrittenNote[]) {
    const url = `${BASE_URL}/handwritten-notes`;
    const dateModified = new Date().toISOString();
    return {
        '@context': 'https://schema.org',
        '@graph': [
            // Person — referenced from every LearningResource via @id
            PAARAS_PERSON,
            {
                '@type': 'CollectionPage',
                '@id': url,
                url,
                name: 'Free Handwritten Chemistry Notes PDF — All Chapters | JEE, NEET & CBSE',
                description:
                    'Free handwritten chemistry notes by Paaras Sir covering all Class 11 & 12 chapters — Organic, Inorganic, and Physical Chemistry. For JEE Main, JEE Advanced, NEET, and CBSE boards.',
                inLanguage: 'en-IN',
                isPartOf: {
                    '@type': 'WebSite',
                    '@id': `${BASE_URL}#website`,
                    name: 'Canvas Classes',
                    url: BASE_URL,
                },
                breadcrumb: { '@id': `${url}#breadcrumb` },
                mainEntity: { '@id': `${url}#itemlist` },
                primaryImageOfPage: {
                    '@type': 'ImageObject',
                    url: OG_IMAGE_URL,
                    width: 1200,
                    height: 630,
                },
                creator: { '@id': `${BASE_URL}#paaras-sir` },
                datePublished: DATE_PUBLISHED,
                dateModified,
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${url}#breadcrumb`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Handwritten Chemistry Notes',
                        item: url,
                    },
                ],
            },
            {
                '@type': 'ItemList',
                '@id': `${url}#itemlist`,
                name: 'Handwritten Chemistry Notes — All Chapters',
                numberOfItems: notes.length,
                itemListElement: notes.map((note, idx) => ({
                    '@type': 'ListItem',
                    position: idx + 1,
                    item: {
                        '@type': 'LearningResource',
                        '@id': `${url}#note-${note.id}`,
                        name: note.title,
                        url,
                        inLanguage: 'en-IN',
                        educationalLevel: 'CBSE Class 11-12',
                        learningResourceType: 'Handwritten Notes',
                        isAccessibleForFree: true,
                        about: { '@type': 'Thing', name: note.chapter },
                        teaches: {
                            '@type': 'DefinedTerm',
                            name: note.category,
                            inDefinedTermSet: 'Chemistry',
                        },
                        author: { '@id': `${BASE_URL}#paaras-sir` },
                        creator: { '@id': `${BASE_URL}#paaras-sir` },
                        datePublished: DATE_PUBLISHED,
                        dateModified,
                    },
                })),
            },
            {
                '@type': 'FAQPage',
                '@id': `${url}#faq`,
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'Are these handwritten chemistry notes free to download?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes. All handwritten chemistry notes by Paaras Sir on Canvas Classes are completely free — no login or payment required. Open any chapter to read online or tap "Open PDF" to download.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Which chapters are covered in these handwritten chemistry notes?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'The notes cover all major Class 11 and Class 12 chapters: Organic Chemistry (Amines, Aldehydes & Ketones, Aromatic Compounds, Organic Name Reactions), Physical Chemistry (Thermodynamics, Chemical Kinetics, Electrochemistry, Solutions, States of Matter, Surface Chemistry), and Inorganic Chemistry (Chemical Bonding, Coordination Compounds, Metallurgy, Environmental Chemistry).',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Are these chemistry notes useful for JEE Main and JEE Advanced?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes — the notes are written with JEE patterns in mind. High-yield concepts, mechanisms, and shortcuts are highlighted throughout. Pair them with the Crucible question bank to convert reading into active recall.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Are these notes good for NEET Chemistry preparation?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Absolutely. NEET tests Organic, Inorganic, and Physical Chemistry — all three are covered. The notes follow NCERT closely and highlight every topic that appears frequently in NEET previous-year questions.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Are these chemistry notes aligned with the NCERT Class 11 & 12 syllabus?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes. Every note follows the CBSE-prescribed NCERT syllabus for Class 11 and Class 12 Chemistry, making them equally useful for CBSE board exams and entrance tests like JEE and NEET.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Who created these handwritten chemistry notes?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Paaras Sir, a chemistry educator at Canvas Classes. The notes reflect his classroom teaching style — concise, visual, and exam-focused for JEE and NEET aspirants studying Class 11 and Class 12 Chemistry.',
                        },
                    },
                ],
            },
        ],
    };
}

export default async function HandwrittenNotesPage() {
    const notes = await fetchHandwrittenNotes();
    const structuredData = buildStructuredData(notes);

    return (
        <>
            <Script
                id="notes-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <HandwrittenNotesClient initialNotes={notes} />
        </>
    );
}
