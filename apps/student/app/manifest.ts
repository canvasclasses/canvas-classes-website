import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Canvas Classes — JEE & NEET Chemistry',
    short_name: 'Canvas',
    description:
      'Free JEE & NEET Chemistry preparation — video lectures, NCERT solutions, flashcards, and adaptive practice by Paaras Sir.',
    id: '/',
    start_url: '/?utm_source=pwa',
    scope: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#050505',
    categories: ['education'],
    lang: 'en-IN',
    dir: 'ltr',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
