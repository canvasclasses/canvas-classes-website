'use client';

import dynamic from 'next/dynamic';

// three/drei are client-only → load the explorer with ssr:false from this client island.
const AnatomyExplorer = dynamic(() => import('@/features/anatomy/AnatomyExplorer'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
      Loading the Anatomy Explorer…
    </div>
  ),
});

export default function AnatomyExplorerPageClient() {
  return (
    <main style={{ minHeight: '100vh', background: '#070a12', color: '#fff', padding: '24px 16px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '4px 0 6px' }}>Anatomy Explorer</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: '0 0 18px', maxWidth: 720 }}>
          A full-body 3D atlas. Toggle each body system on or off, fade a layer to peel it away, rotate
          and zoom, and tap any structure to see its name. For Class 9–12 &amp; NEET.
        </p>
        <AnatomyExplorer />
      </div>
    </main>
  );
}
