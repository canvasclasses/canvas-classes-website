'use client';

import { useEffect } from 'react';

// Fire-and-forget per-chapter view increment. Mounts on the chapter page,
// posts to /api/handwritten-notes/[chapter]/view, marks the slug seen in
// sessionStorage so reloads in the same tab don't double-count.
//
// Renders nothing — no UI, no fallback. The "X students visited" number
// shown in the hero trust strip is read server-side at build/revalidate
// time and is INDEPENDENT of this component succeeding on any given page
// load. If sessionStorage is blocked or the fetch fails, the count just
// doesn't move for that visitor; the page renders fine either way.

interface Props {
    chapterSlug: string;
}

const SESSION_KEY_PREFIX = 'canvas:chapter-viewed:';

export default function ViewTracker({ chapterSlug }: Props) {
    useEffect(() => {
        // Defensive — sessionStorage may be unavailable (incognito, strict
        // privacy modes). If it throws, just skip the dedup and POST anyway
        // (worst case: a few duplicate increments from a single user).
        let alreadySeen = false;
        const key = `${SESSION_KEY_PREFIX}${chapterSlug}`;
        try {
            alreadySeen = sessionStorage.getItem(key) === '1';
        } catch {
            alreadySeen = false;
        }

        if (alreadySeen) return;

        try {
            sessionStorage.setItem(key, '1');
        } catch {
            // Continue — dedup is best-effort.
        }

        // keepalive: 'true' so the request still goes if the user navigates
        // away immediately after landing.
        fetch(`/api/handwritten-notes/${chapterSlug}/view`, {
            method: 'POST',
            keepalive: true,
        }).catch(() => {
            // Silent — the trust-strip number is a UX signal, not critical.
        });
    }, [chapterSlug]);

    return null;
}
