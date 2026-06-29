import { Metadata } from 'next';
import AnatomyExplorerPageClient from './AnatomyExplorerPageClient';

// Public, content-identical for everyone → cacheable per CLAUDE.md §10.
// The 3D interactivity lives in the client island below.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Anatomy Explorer | Interactive 3D Human Body for Class 9–12 & NEET',
  description:
    'Explore the whole human body in 3D — toggle and peel away the skeletal, muscular, nervous, cardiovascular, lymphatic and organ systems, rotate, zoom and tap any structure to learn its name. Free interactive anatomy by Canvas Classes.',
  keywords: [
    'Anatomy Explorer',
    '3D Human Body',
    'Interactive Anatomy',
    'NEET Anatomy 3D',
    'Human Body Systems 3D',
    'Muscular System 3D',
    'Skeletal System 3D',
    'Nervous System 3D',
    'Class 11 Biology Anatomy',
    'Canvas Classes',
  ],
  openGraph: {
    title: 'Anatomy Explorer — Interactive 3D Human Body',
    description:
      'A full-body 3D atlas — toggle, peel and tap every body system. For Class 9–12 & NEET.',
    type: 'website',
    url: 'https://www.canvasclasses.in/anatomy-explorer',
  },
  alternates: { canonical: 'https://www.canvasclasses.in/anatomy-explorer' },
};

export default function AnatomyExplorerPage() {
  return <AnatomyExplorerPageClient />;
}
