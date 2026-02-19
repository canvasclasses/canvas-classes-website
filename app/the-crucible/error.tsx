'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Crucible error:', error);
  }, [error]);

  return (
    <div style={{ minHeight: '100vh', background: '#080a0f', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '24px', textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>⚗️</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Something went wrong</h2>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24, maxWidth: 320 }}>
        The Crucible hit an unexpected error. This is usually temporary.
      </p>
      <button
        onClick={reset}
        style={{ padding: '12px 24px', borderRadius: 12, border: 'none', background: '#7c3aed', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
      >
        Try again
      </button>
      <a href="/" style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>← Back to home</a>
    </div>
  );
}
