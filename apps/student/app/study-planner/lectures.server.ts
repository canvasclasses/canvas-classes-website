// Server-only bridge from the Complete Chemistry Lectures page
// (/detailed-lectures, sourced from a Google Sheet) into the planner's catalog.
// Resolves each planner chemistry chapter → its detailed-lecture chapter(s) so
// the Class 11 / Class 12 resource lists can show "Detailed Lectures · N videos"
// + the chapter's PDF notes, live and auto-updating.
//
// Imported only by page.tsx (a Server Component) — never the client island.

import { fetchLecturesData } from '@/features/public-content/data/lecturesData';
import type { DetailedLectureRef } from './planner-data';

// planner chapter id → exact chapter name(s) on the lectures sheet. A planner
// chapter can map to more than one lecture chapter (e.g. Carbonyls = Aldehydes &
// Ketones + Carboxylic Acids). Names are matched case-insensitively; a slug
// fallback covers minor punctuation drift.
const DETAILED_NAMES: Record<string, string[]> = {
    // Class 11
    ch11_mole: ['Mole Concept'],
    ch11_atom: ['Atomic Structure'],
    ch11_periodic: ['Periodic Properties'],
    ch11_bonding: ['Chemical Bonding'],
    ch11_thermo: ['Thermodynamics'],
    ch11_chem_eq: ['Chemical equilibrium'],
    ch11_ionic_eq: ['Ionic Equilibrium'],
    ch11_redox: ['Redox Reactions'],
    ch11_pblock: ['P Block (Group 13 & 14))'],
    ch11_goc: ['GOC', 'Stereochemistry'],
    ch11_hydrocarbon: ['Hydrocarbons', 'Aromatic Compounds'],
    // Class 12
    ch12_solutions: ['Solutions'],
    ch12_electrochem: ['Electrochemistry'],
    ch12_kinetics: ['Chemical Kinetics'],
    ch12_pblock: ['P Block - 12th'],
    ch12_dblock: ['D & F Block'],
    ch12_coord: ['Coordination Compounds'],
    ch12_haloalkanes: ['Haloalkanes, Alcohols & Ethers'],
    ch12_alcohols: ['Haloalkanes, Alcohols & Ethers'],
    ch12_carbonyl: ['Aldehydes & Ketones', 'Carboxylic Acids & Derivatives'],
    ch12_amines: ['Amines'],
    ch12_biomolecules: ['Biomolecules'],
    ch12_salt: ['Salt Analysis'],
};

// Mirror of slugify() in lecturesData.ts (kept local to avoid importing a
// non-exported helper).
function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function buildDetailedLecturesMap(): Promise<Record<string, DetailedLectureRef[]>> {
    let chapters;
    try {
        chapters = await fetchLecturesData();
    } catch {
        return {}; // sheet unreachable → planner falls back to class-hub links
    }

    const byKey = new Map<string, (typeof chapters)[number]>();
    for (const c of chapters) {
        byKey.set(c.name.trim().toLowerCase(), c);
        byKey.set(c.slug, c);
    }

    const out: Record<string, DetailedLectureRef[]> = {};
    for (const [chId, names] of Object.entries(DETAILED_NAMES)) {
        const refs: DetailedLectureRef[] = [];
        for (const name of names) {
            const c = byKey.get(name.trim().toLowerCase()) ?? byKey.get(slugify(name));
            if (c) {
                refs.push({
                    slug: c.slug,
                    name: c.name,
                    videoCount: c.videoCount ?? c.lectures.length,
                    notesLink: c.notesLink ?? '',
                });
            }
        }
        if (refs.length) out[chId] = refs;
    }
    return out;
}
