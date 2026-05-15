import { Metadata } from 'next';
import Script from 'next/script';
import NcertBooksClient from './NcertBooksClient';
import { getAllNcertBooks } from '@/features/books/data/ncertBooksData';

const BASE_URL = 'https://www.canvasclasses.in';

export const metadata: Metadata = {
    title: 'NCERT Books PDF Download — Class 8, 9, 10, 11 & 12 (2025-26) | Canvas Classes',
    description:
        'Free PDF download of every NCERT textbook for Class 8 to 12 — Physics, Chemistry, Biology, Mathematics, Science, English & Social Science. Latest CBSE 2025-26 syllabus including the new NEP 2020 books for Class 9 (Kaveri, Science, Mathematics). Read online or download instantly. No login.',
    keywords: [
        'NCERT books PDF download',
        'NCERT textbook class 8',
        'NCERT textbook class 9',
        'NCERT textbook class 10',
        'NCERT textbook class 11',
        'NCERT textbook class 12',
        'NCERT Physics class 11 PDF',
        'NCERT Physics class 12 PDF',
        'NCERT Biology class 11 PDF',
        'NCERT Biology class 12 PDF',
        'NCERT Maths class 11 PDF',
        'NCERT Maths class 12 PDF',
        'NCERT Chemistry class 11 PDF',
        'NCERT Chemistry class 12 PDF',
        'NCERT Science class 9 PDF',
        'NCERT Science class 10 PDF',
        'NCERT English Kaveri class 9',
        'NCERT new book class 9',
        'NEP 2020 NCERT textbook',
        'CBSE 2025-26 NCERT textbook',
        'CBSE class 9 new syllabus 2025',
        'NCERT chapter wise PDF',
        'NCERT book free download',
        'JEE chemistry NCERT',
        'NEET biology NCERT',
        'download NCERT books free',
    ],
    alternates: {
        canonical: `${BASE_URL}/download-ncert-books`,
    },
    openGraph: {
        title: 'NCERT Books PDF — Class 8 to 12 All Subjects (2025-26) | Canvas Classes',
        description:
            'Free PDFs of every NCERT textbook for Class 8 to 12 — Physics, Chemistry, Biology, Maths, Science, English, Social Science. Includes new NEP 2020 books. Read online or download free.',
        type: 'website',
        url: `${BASE_URL}/download-ncert-books`,
        locale: 'en_IN',
        siteName: 'Canvas Classes',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NCERT Books PDF Download Class 8–12 (2025-26)',
        description:
            'Free NCERT textbooks for Class 8–12. All subjects, every chapter, instant PDF — including the new NEP 2020 books.',
    },
};

const FAQS: { q: string; a: string }[] = [
    {
        q: 'Are these the latest 2025-26 NCERT textbooks?',
        a: 'Yes. The library mirrors the current 2025-26 CBSE NCERT editions, including all rationalised chapters and the new NEP 2020 textbooks for Class 9 (Kaveri English, the new Science book and the new Mathematics book).',
    },
    {
        q: 'Are these PDFs really free? Is there any login?',
        a: 'Completely free. No login, no email, no payment. Tap any chapter and the official PDF opens in your browser. You can read it online or save it for offline study.',
    },
    {
        q: 'Which classes and subjects are covered?',
        a: 'Class 8, 9, 10, 11 and 12 — across Physics, Chemistry, Biology, Mathematics, Science, English (Honeydew, Beehive, Kaveri, Hornbill, Flamingo and others) and Social Science (History, Civics, Geography, Economics).',
    },
    {
        q: 'Why should I study from NCERT books for JEE and NEET?',
        a: 'NCERT is the official syllabus reference for both JEE Main and NEET. CBSE board paper-setters and NTA (NEET) directly lift concepts, definitions and even questions from NCERT — especially in Class 11 and 12 Physics, Chemistry and Biology. Mastering NCERT first is the highest-leverage way to score.',
    },
    {
        q: 'Is NCERT alone enough for JEE Advanced or NEET top ranks?',
        a: 'NCERT is necessary but not sufficient for JEE Advanced or NEET top ranks. Once you have full NCERT command, layer in question practice (try The Crucible for chemistry), previous-year papers and concise revision notes.',
    },
    {
        q: 'Can I download the PDFs to read offline?',
        a: 'Yes. Each chapter opens as a regular PDF in your browser — use your browser\'s "Download" or "Save" option to keep a copy. You can also print specific chapters for annotation.',
    },
];

function buildStructuredData(bookCount: number, chapterCount: number) {
    const url = `${BASE_URL}/download-ncert-books`;
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': url,
                url,
                name: 'NCERT Textbooks PDF Download — Class 8 to 12',
                description:
                    `Free PDF download of ${bookCount} NCERT textbooks (${chapterCount} chapters) for Class 8, 9, 10, 11, and 12. Covers Science, Mathematics, English, Physics, Biology, Chemistry, and Social Science for the CBSE 2025-26 syllabus, including the new NEP 2020 textbooks.`,
                inLanguage: 'en-IN',
                isPartOf: {
                    '@type': 'WebSite',
                    '@id': `${BASE_URL}#website`,
                    name: 'Canvas Classes',
                    url: BASE_URL,
                },
                breadcrumb: { '@id': `${url}#breadcrumb` },
                mainEntity: { '@id': `${url}#itemlist` },
                about: [
                    { '@type': 'Thing', name: 'NCERT' },
                    { '@type': 'Thing', name: 'CBSE 2025-26 syllabus' },
                    { '@type': 'Thing', name: 'NEP 2020' },
                ],
                provider: {
                    '@type': 'EducationalOrganization',
                    name: 'Canvas Classes',
                    url: BASE_URL,
                },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${url}#breadcrumb`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
                    { '@type': 'ListItem', position: 2, name: 'NCERT Books PDF', item: url },
                ],
            },
            {
                '@type': 'ItemList',
                '@id': `${url}#itemlist`,
                name: 'NCERT Textbooks — Class 8 to 12',
                numberOfItems: bookCount,
                description: `Collection of ${bookCount} NCERT textbooks for Class 8–12, covering all major subjects.`,
            },
            {
                '@type': 'FAQPage',
                '@id': `${url}#faq`,
                mainEntity: FAQS.map((faq) => ({
                    '@type': 'Question',
                    name: faq.q,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: faq.a,
                    },
                })),
            },
        ],
    };
}

export default function NcertBooksPage() {
    const books = getAllNcertBooks();
    const chapterCount = books.reduce((sum, b) => sum + b.chapters.length, 0);
    const structuredData = buildStructuredData(books.length, chapterCount);

    return (
        <>
            <Script
                id="ncert-books-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <NcertBooksClient books={books} />
        </>
    );
}
