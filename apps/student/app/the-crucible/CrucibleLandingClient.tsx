'use client';

import { useEffect, useState } from 'react';
import CrucibleWizard from '@/features/crucible/components/CrucibleWizard';
import { createClient } from '@/app/utils/supabase/client';
import type { ChapterWithCounts } from '@/features/crucible/lib/chapterCounts';

// Client island for the /the-crucible landing page.
//
// The page itself (page.tsx) is statically renderable + ISR-cached
// (revalidate = 3600) — it reads ONLY public Mongo data (chapter counts).
// The one thing that used to force dynamic rendering at the server level was
// the Supabase auth check (isLoggedIn), which reads cookies() and silently
// opted the route out of the edge cache (CLAUDE.md §10.2/§10.3). That check
// now happens here, in the browser, and is threaded into CrucibleWizard
// after mount.
//
// First paint shows isLoggedIn=false (same as the prior fall-through when the
// server-side Supabase check failed); the real value lands on mount via
// setState. Logged-in users may see a brief flash of the logged-out UI on
// first visit — acceptable because the page is now served from the edge
// cache. Mirrors the sibling [chapterId]/CrucibleChapterClient.tsx.
export default function CrucibleLandingClient({
    chapters,
}: {
    chapters: ChapterWithCounts[];
}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Localhost dev bypass — mirrors @/lib/bookAuth.isLocalhostDev so the
        // dev experience is unchanged.
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
                console.error('Supabase auth check failed in CrucibleLandingClient:', err);
                // Leave isLoggedIn=false on failure — matches the prior server-side fall-through.
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return <CrucibleWizard chapters={chapters} isLoggedIn={isLoggedIn} />;
}
