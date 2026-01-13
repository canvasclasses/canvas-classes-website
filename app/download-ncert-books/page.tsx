import { Metadata } from 'next';
import NcertBooksClient from './NcertBooksClient';
import { fetchNcertBooksData } from '../lib/ncertBooksData';

export const metadata: Metadata = {
    title: 'Download NCERT Chemistry Books PDF Class 11 & 12 - Textbook, Exemplar, Lab Manual',
    description: 'Free PDF download of NCERT Chemistry textbooks, exemplar problems, and lab manuals for Class 11 & 12. Official NCERT books for CBSE 2025-26. Read online or download.',
    keywords: [
        'NCERT Chemistry book PDF download',
        'NCERT Chemistry Class 12 PDF',
        'NCERT Chemistry Class 11 PDF',
        'Chemistry exemplar PDF',
        'NCERT lab manual Chemistry',
        'NCERT Chemistry textbook download free',
        'Class 11 Chemistry book PDF NCERT',
        'Class 12 Chemistry book PDF NCERT',
    ],
    openGraph: {
        title: 'Download NCERT Chemistry Books PDF Class 11 & 12 | Canvas Classes',
        description: 'Free PDF download of NCERT Chemistry textbooks, exemplar, and lab manuals for Class 11 & 12.',
        type: 'website',
    },
};

// Server-side data fetching for SEO (ensures Google sees content on first render)
export default async function NcertBooksPage() {
    const data = await fetchNcertBooksData();

    return <NcertBooksClient initialData={data} />;
}
