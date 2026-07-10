/* Canvas Classes — minimal PWA service worker.
   Network-first for navigations with an offline fallback; passthrough for the rest.
   Deliberately does NOT cache HTML / API / questions / book data.
   See docs/superpowers/specs/2026-06-26-pwa-design.md. */
const CACHE = 'cc-shell-v1';
const PRECACHE = ['/offline', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  // Navigations: try the network first; fall back to the cached offline page.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/offline')));
  }
  // Everything else: default network behavior (no caching).
});
