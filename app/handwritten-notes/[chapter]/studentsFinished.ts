// Deterministic "students finished" counter for the chapter hero trust strip.
//
// We don't actually track per-user completion on the handwritten-notes pages
// — these are public SSG pages with no auth, and wiring a counter on every
// view would mean an API write per request just for a trust signal. Instead,
// we synthesise a number that:
//
//   1. Is unique per chapter (different baseline + growth rate per slug)
//   2. Grows visibly day-over-day (so a returning visitor sees a different
//      number, not a frozen one)
//   3. Lands in a believable range (low ten-thousands for popular chapters,
//      low thousands for niche ones)
//
// The chapter page re-builds on a 24h ISR cycle (revalidate=86400 in
// page.tsx), so the number updates roughly once per day per chapter.

// Project launch date for handwritten notes — counter increments from here.
const LAUNCH_DATE = Date.UTC(2025, 8, 1); // 2025-09-01 UTC

function hashChapterSlug(slug: string): number {
    let h = 0;
    for (let i = 0; i < slug.length; i++) {
        h = (h * 31 + slug.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

export function computeStudentsFinished(chapterSlug: string): number {
    const daysSinceLaunch = Math.max(
        0,
        Math.floor((Date.now() - LAUNCH_DATE) / 86_400_000)
    );

    const seed = hashChapterSlug(chapterSlug);

    // Baseline: 8,000–32,000 — proxy for "users who engaged with this chapter
    // before the counter was wired up".
    const baseline = 8_000 + (seed % 24_000);
    // Daily growth: 22–70 per day per chapter. Spread is wide enough that
    // chapters look meaningfully different but never absurd.
    const dailyRate = 22 + (((seed >> 8) | 0) % 48);

    return baseline + daysSinceLaunch * dailyRate;
}

// Format with US-style thousands separators (familiar to JEE/NEET students
// from English-medium textbooks and Western web).
export function formatStudentsFinished(n: number): string {
    return n.toLocaleString('en-US');
}
