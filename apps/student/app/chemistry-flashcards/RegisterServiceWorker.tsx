'use client';

import { useEffect } from 'react';
import { flushPendingWrites } from '../utils/progressSync';

/**
 * Registers the flashcards service worker once on mount and listens for
 * `flashcard-flush` messages it sends back when Background Sync fires. Safe
 * no-op in browsers without serviceWorker support.
 */
export default function RegisterServiceWorker() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!('serviceWorker' in navigator)) return;

        let registration: ServiceWorkerRegistration | null = null;

        navigator.serviceWorker
            .register('/flashcards-sw.js', { scope: '/chemistry-flashcards/' })
            .then((reg) => {
                registration = reg;
            })
            .catch((err) => {
                console.error('Flashcards SW register failed:', err);
            });

        const onMessage = (event: MessageEvent) => {
            if (event.data?.type === 'flashcard-flush') {
                flushPendingWrites().catch(err => console.error('SW-triggered flush failed:', err));
            }
        };
        navigator.serviceWorker.addEventListener('message', onMessage);

        // Try to register a Background Sync request whenever a write fails;
        // this requires an unsafe cast because the type isn't in stock TS DOM
        // libs yet.
        const trySync = () => {
            const reg = registration as (ServiceWorkerRegistration & { sync?: { register: (tag: string) => Promise<void> } }) | null;
            if (reg?.sync) {
                reg.sync.register('flashcard-flush').catch(() => {});
            }
        };
        const onOnline = () => trySync();
        window.addEventListener('online', onOnline);

        return () => {
            navigator.serviceWorker.removeEventListener('message', onMessage);
            window.removeEventListener('online', onOnline);
        };
    }, []);

    return null;
}
