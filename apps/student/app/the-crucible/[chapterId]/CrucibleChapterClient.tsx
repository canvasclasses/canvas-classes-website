'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CrucibleWizard from '@/features/crucible/components/CrucibleWizard';
import { createClient } from '@/app/utils/supabase/client';
import type { ChapterWithCounts } from '@/features/crucible/lib/chapterCounts';

// Client island for /the-crucible/[chapterId].
//
// The page itself (page.tsx) is statically renderable + ISR-cached now —
// it reads only public Mongo data. The two pieces that used to force
// dynamic rendering at the server level were:
//   1. The Supabase auth check (isLoggedIn) — now read here via the
//      browser client and threaded into CrucibleWizard after mount.
//   2. searchParams['examBoard'] — accessing searchParams in a Server
//      Component automatically opts the route into dynamic rendering.
//      Read here via useSearchParams() instead, which is RSC-cache-safe.
//
// First-paint shows isLoggedIn=false (same as the prior fall-through on
// Supabase failure); the real value lands on mount via setState. Logged-in
// users see a brief flash of the logged-out UI on first visit, then the
// real state. This trade-off is acceptable because the page itself is now
// served from the edge cache — the savings far outweigh the brief flash.
export default function CrucibleChapterClient({
    chapters,
    initialChapterId,
}: {
    chapters: ChapterWithCounts[];
    initialChapterId: string;
}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const searchParams = useSearchParams();
    const rawBoard = searchParams.get('examBoard');
    const examBoard = rawBoard === 'NEET' ? 'NEET' : rawBoard === 'JEE' ? 'JEE' : undefined;

    useEffect(() => {
        // Localhost dev bypass — mirrors the server-side behaviour in
        // @/lib/bookAuth.isLocalhostDev so dev experience is unchanged.
        if (
            typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ) {
            setIsLoggedIn(true);
            return;
        }

        const supabase = createClient();
        if (!supabase) return;

        let cancelled = false;
        supabase.auth
            .getUser()
            .then(({ data: { user } }) => {
                if (!cancelled) setIsLoggedIn(!!user);
            })
            .catch((err) => {
                console.error('Supabase auth check failed in CrucibleChapterClient:', err);
                // Leave isLoggedIn=false on failure — matches the prior server-side fall-through.
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <CrucibleWizard
            chapters={chapters}
            isLoggedIn={isLoggedIn}
            initialChapterId={initialChapterId}
            initialMode="browse"
            initialExam={examBoard}
        />
    );
}
