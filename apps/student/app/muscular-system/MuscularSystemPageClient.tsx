'use client';

import dynamic from 'next/dynamic';

const MuscularSystemViewer = dynamic(() => import('@/features/anatomy/MuscularSystemViewer'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
      Loading the Muscular System…
    </div>
  ),
});

export default function MuscularSystemPageClient() {
  return (
    <main style={{ minHeight: '100vh', background: '#070a12', color: '#fff', padding: '24px 16px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '4px 0 6px' }}>The Muscular System — 3D</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: '0 0 18px', maxWidth: 720 }}>
          Peel from superficial to deep muscles, tap any muscle to learn what it does, take the guided
          tour, or test yourself with the “tap the muscle” quiz. NEET · Locomotion &amp; Movement.
        </p>
        <MuscularSystemViewer />
      </div>
    </main>
  );
}
