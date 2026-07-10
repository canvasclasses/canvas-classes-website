import { Metadata } from 'next';
import BiologyHubClient from './BiologyHubClient';

// Public, content-identical for everyone → cacheable per CLAUDE.md §10.
// The catalog is static; the interactivity lives in the client island below.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Biology Simulations Hub | Interactive 3D Models for Class 9–12, NEET',
  description:
    'Explore interactive 3D biology models and simulations — the human heart in 3D, and more — for Class 9, 10, 11, 12 and NEET. Rotate, peel layers, slice cross-sections, and tap to learn. Free, by Canvas Classes.',
  keywords: [
    'Biology Simulations',
    '3D Human Heart',
    'Interactive Biology',
    'NEET Biology 3D Models',
    'Human Anatomy 3D',
    'Class 11 Biology Simulations',
    'Class 12 Biology Simulations',
    'Body Fluids and Circulation',
    'Canvas Classes Biology',
  ],
  openGraph: {
    title: 'Biology Simulations Hub — Interactive 3D Models',
    description:
      'Interactive 3D biology models for Class 9–12 & NEET — rotate, peel, slice and explore the human heart and more.',
    type: 'website',
    url: 'https://www.canvasclasses.in/biology-hub',
  },
  alternates: {
    canonical: 'https://www.canvasclasses.in/biology-hub',
  },
};

export default function BiologyHubPage() {
  return <BiologyHubClient />;
}
