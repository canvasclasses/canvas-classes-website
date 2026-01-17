import type { Metadata } from 'next';
import PeriodicTableClient from './PeriodicTableClient';

export const metadata: Metadata = {
    title: 'Interactive Periodic Table | Canvas Classes',
    description: 'Explore the periodic table with dynamic heatmaps, property comparison, and exception highlighting. Based on NCERT data, ideal for JEE, NEET & CBSE exams.',
    keywords: ['periodic table', 'chemistry', 'elements', 'atomic radius', 'ionization energy', 'electronegativity', 'NCERT', 'CBSE', 'JEE'],
    openGraph: {
        title: 'Interactive Periodic Table | Canvas Classes',
        description: 'Dynamic periodic table with trend visualization and exception highlighting. Trained on NCERT data and a must for JEE, NEET & CBSE exams.',
        type: 'website',
    },
};

export default function PeriodicTablePage() {
    return <PeriodicTableClient />;
}
