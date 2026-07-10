import { Metadata } from 'next';
import MuscularSystemPageClient from './MuscularSystemPageClient';

// Public, content-identical for everyone → cacheable per CLAUDE.md §10.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'The Muscular System — Interactive 3D | NEET Locomotion & Movement',
  description:
    'Learn the human muscular system in 3D — peel from superficial to deep muscles, tap any muscle for what it does, take a guided tour, and test yourself with a tap-the-muscle quiz. For Class 11–12 & NEET (Locomotion & Movement). Free, by Canvas Classes.',
  keywords: [
    'Muscular System 3D', 'Human Muscles 3D', 'NEET Locomotion and Movement',
    'Interactive Muscular System', 'Muscle Anatomy 3D', 'Class 11 Biology Muscles',
    'Superficial vs Deep Muscles', 'Canvas Classes',
  ],
  openGraph: {
    title: 'The Muscular System — Interactive 3D',
    description: 'Peel, tap, tour and quiz the human muscles in 3D. NEET Locomotion & Movement.',
    type: 'website',
    url: 'https://www.canvasclasses.in/muscular-system',
  },
  alternates: { canonical: 'https://www.canvasclasses.in/muscular-system' },
};

export default function MuscularSystemPage() {
  return <MuscularSystemPageClient />;
}
