import type { Metadata } from 'next';

const BASE_URL = 'https://www.canvasclasses.in';

export const metadata: Metadata = {
    title: 'Chemihex — Hexagonal Reaction Game for Organic Chemistry | Canvas Classes',
    description: 'Learn organic chemistry reactions through play. Chemihex is an interactive hexagonal puzzle that lets you experiment with reagents and watch products form in real time. Built for JEE, NEET, and CBSE students by Paaras Sir.',
    keywords: [
        'organic chemistry game',
        'organic reactions practice',
        'reagents and products',
        'organic chemistry puzzle',
        'chemistry interactive game',
        'JEE organic chemistry',
        'NEET organic chemistry',
        'reaction mechanism game',
        'Paaras Sir',
        'Canvas Classes',
    ],
    alternates: {
        canonical: `${BASE_URL}/chemihex`,
    },
    openGraph: {
        type: 'website',
        url: `${BASE_URL}/chemihex`,
        siteName: 'Canvas Classes',
        title: 'Chemihex — Hexagonal Organic Chemistry Reaction Game',
        description: 'Interactive hexagonal puzzle for learning organic chemistry reactions. Free for JEE & NEET students.',
        images: [
            { url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Chemihex — Canvas Classes' },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Chemihex — Hexagonal Organic Chemistry Reaction Game',
        description: 'Interactive hexagonal puzzle for learning organic chemistry reactions. Free for JEE & NEET students.',
        creator: '@canvasclasses',
    },
    robots: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
    },
};

export default function ChemihexLayout({ children }: { children: React.ReactNode }) {
    return children;
}
