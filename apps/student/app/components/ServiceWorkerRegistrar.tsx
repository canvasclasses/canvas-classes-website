'use client';

import { useEffect } from 'react';

/* Registers the service worker in production only. Registering in dev interferes
   with Next HMR. Gating on NODE_ENV here is standard PWA practice and is NOT an
   auth bypass (CLAUDE.md §8.3 concerns auth, which this does not touch). */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* registration failures are non-fatal */
      });
    };

    if (document.readyState === 'complete') {
      register();
      return;
    }
    window.addEventListener('load', register);
    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
