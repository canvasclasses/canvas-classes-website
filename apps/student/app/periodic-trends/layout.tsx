import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Periodic Trends and Exceptions - Interactive NCERT Graphs | JEE NEET',
    description: 'Explore periodic property trends with interactive graphs from NCERT Chemistry. Visualize atomic radius, ionization energy, electronegativity, and important exceptions for s, p, d, f blocks. Essential for JEE Main, JEE Advanced, and NEET preparation.',
    keywords: [
        'periodic trends',
        'periodic table trends',
        'ionization energy trend',
        'atomic radius trend',
        'electronegativity trend',
        'NCERT chemistry',
        'JEE chemistry',
        'NEET chemistry',
        's block elements',
        'p block elements',
        'd block elements',
        'f block elements',
        'lanthanide contraction',
        'periodic exceptions',
        'inert pair effect'
    ],
    openGraph: {
        title: 'Periodic Trends & Exceptions - Interactive NCERT Graphs',
        description: 'Visualize periodic property trends across s, p, d, f blocks with interactive graphs from NCERT Chemistry for JEE/NEET.',
        type: 'website',
    },
};

export default function PeriodicTrendsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
