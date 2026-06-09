// Server-only: maps each planner chemistry chapter → its Chemistry Flashcards
// chapter slug (/chemistry-flashcards/<slug>), validated against the live
// flashcard chapters so we never deep-link to a 404. Chapters without a
// flashcard set fall back to the flashcards hub. Imported only by page.tsx.

import { getChapterSummaries } from '@/features/flashcards/lib/flashcardsData';

// planner chapter id → exact flashcard chapter name (from the flashcard
// taxonomy / DB). The route slug is slugify(name); we verify it exists before
// emitting a deep link. Chapters with no flashcards are simply omitted.
const FLASHCARD_NAMES: Record<string, string> = {
    ch11_atom: 'Atomic Structure',
    ch11_pblock: 'p-block Group 13 & 14',
    ch11_goc: 'GOC and POC',
    ch12_solutions: 'Solutions',
    ch12_electrochem: 'Electrochemistry',
    ch12_kinetics: 'Chemical Kinetics',
    ch12_pblock: 'P Block elements G15-18',
    ch12_dblock: 'D & F Block',
    ch12_coord: 'Coordination Compounds',
    ch12_haloalkanes: 'Haloalkanes',
    ch12_alcohols: 'Alcohols, Phenols & ethers',
    ch12_carbonyl: 'Aldehydes, Ketones & Acids',
    ch12_amines: 'Amines',
    ch12_biomolecules: 'Biomolecules',
    ch12_salt: 'Salt analysis',
};

// Mirror of generateChapterSlug() in flashcardsData.ts.
function slugify(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function buildFlashcardSlugMap(): Promise<Record<string, string>> {
    let summaries;
    try {
        summaries = await getChapterSummaries();
    } catch {
        return {}; // flashcards unreachable → planner falls back to the hub
    }
    const validSlugs = new Set(summaries.map((s) => s.slug));
    const out: Record<string, string> = {};
    for (const [chId, name] of Object.entries(FLASHCARD_NAMES)) {
        const slug = slugify(name);
        if (validSlugs.has(slug)) out[chId] = slug;
    }
    return out;
}
