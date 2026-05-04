// Service worker for the chemistry flashcards feature.
//
// Scope: registered with `scope: '/chemistry-flashcards/'` so it only
// intercepts requests under that path tree. Other features are unaffected.
//
// Caches:
// - flashcard-cards: stale-while-revalidate for /api/flashcards/cards/*
// - flashcard-shell: cache-first for the page shells
//
// Background Sync:
// - tag 'flashcard-flush' is registered by the page when a cloud write fails
//   while offline. When connectivity returns the SW posts a message back to
//   any open client which calls flushPendingWrites().

const CARDS_CACHE = 'flashcard-cards-v1';
const SHELL_CACHE = 'flashcard-shell-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(SHELL_CACHE).then((cache) =>
            cache.addAll([
                '/chemistry-flashcards',
            ]).catch(() => {})
        )
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((keys) =>
                Promise.all(
                    keys
                        .filter((k) => k !== CARDS_CACHE && k !== SHELL_CACHE)
                        .filter((k) => k.startsWith('flashcard-'))
                        .map((k) => caches.delete(k))
                )
            )
        ])
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;

    // /api/flashcards/cards/* — stale-while-revalidate.
    if (url.pathname.startsWith('/api/flashcards/cards/')) {
        event.respondWith(staleWhileRevalidate(req, CARDS_CACHE));
        return;
    }

    // /chemistry-flashcards routes — network first, fall back to cached shell.
    if (url.pathname === '/chemistry-flashcards' || url.pathname.startsWith('/chemistry-flashcards/')) {
        event.respondWith(networkFirst(req, SHELL_CACHE));
        return;
    }
});

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    const network = fetch(request)
        .then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
        })
        .catch(() => cached || Response.error());

    return cached || network;
}

async function networkFirst(request, cacheName) {
    try {
        const res = await fetch(request);
        if (res.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, res.clone());
        }
        return res;
    } catch {
        const cached = await caches.match(request);
        return cached || Response.error();
    }
}

// Background Sync: when connectivity returns, ping every controlled tab so
// it can drain its localStorage retry queue.
self.addEventListener('sync', (event) => {
    if (event.tag !== 'flashcard-flush') return;
    event.waitUntil(
        (async () => {
            const all = await self.clients.matchAll({ includeUncontrolled: true });
            all.forEach((c) => c.postMessage({ type: 'flashcard-flush' }));
        })()
    );
});
