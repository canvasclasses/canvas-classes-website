import type { Metadata } from 'next';
import PeriodicTableClient from './PeriodicTableClient';

export const metadata: Metadata = {
    title: 'Interactive Periodic Table | Canvas Classes',
    description: 'Explore the periodic table with dynamic heatmaps, property comparison, and exception highlighting. Learn trends in atomic radius, ionization energy, electronegativity, and more.',
    keywords: ['periodic table', 'chemistry', 'elements', 'atomic radius', 'ionization energy', 'electronegativity', 'NCERT', 'CBSE', 'JEE'],
    openGraph: {
        title: 'Interactive Periodic Table | Canvas Classes',
        description: 'Dynamic periodic table with trend visualization and exception highlighting for chemistry students.',
        type: 'website',
    },
};

export default function PeriodicTablePage() {
    return <PeriodicTableClient />;
}
