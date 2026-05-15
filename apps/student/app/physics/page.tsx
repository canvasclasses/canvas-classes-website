import type { Metadata } from 'next';
import PhysicsComingSoon from './PhysicsComingSoon';

const SITE_URL = 'https://www.canvasclasses.in';
const CANONICAL = `${SITE_URL}/physics`;

export const metadata: Metadata = {
  title: 'Physics Simulations — Conservation of Energy, Motion, Forces | Canvas Classes',
  description:
    'Interactive Physics simulations from Canvas Classes. Pendulum, projectile motion, conservation of energy, optics and more — built to make concepts visible. Coming soon.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: 'website',
    url: CANONICAL,
    siteName: 'Canvas Classes',
    locale: 'en_IN',
    title: 'Physics Simulations — Coming Soon',
    description:
      'Interactive Physics simulations from Canvas Classes. Pendulum, energy, motion, optics — built to make concepts visible.',
  },
};

export default function PhysicsPage() {
  return <PhysicsComingSoon />;
}
