import { Metadata } from 'next';
import OrganicReactionsClient from './OrganicReactionsClient';
import { fetchOrganicReactions } from '../lib/organicReactionsData';

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
};

// Server-side data fetching for SEO (ensures Google sees content on first render)
export default async function OrganicNameReactionsPage() {
    const reactions = await fetchOrganicReactions();

    return <OrganicReactionsClient initialReactions={reactions} />;
}
