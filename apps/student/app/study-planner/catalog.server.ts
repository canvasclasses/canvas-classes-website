// Server-only catalog source for the Drop Year Planner's physics & math
// subjects. Chemistry is built from the Crucible's `buildChaptersWithCounts()`;
// this file is the parallel source for physics (ph11_*/ph12_*) and math (ma_*),
// which that chem-only helper deliberately excludes.
//
// We REUSE the Crucible's `getExamBoardChapterCounts()` (read-only) — it groups
// every question in questions_v2 by `metadata.chapter_id` with NO subject
// filter, so physics/math chapters get accurate JEE counts automatically. Only
// `import type` / read-only calls cross in; nothing here is mutated.
//
// This module is imported by the Server Component (page.tsx) only — never the
// client island (it touches Mongo via the cached aggregation).

import { getExamBoardChapterCounts } from '@/features/crucible/lib/chapterCounts';
import type { PlannerSourceChapter } from './planner-data';

type CountRow = { _id: string; count: number };

async function buildForPrefixes(prefixes: string[]): Promise<PlannerSourceChapter[]> {
    const { TAXONOMY_FROM_CSV } = await import('@canvas/data/taxonomy/taxonomyData_from_csv');
    const nodes = TAXONOMY_FROM_CSV.filter(
        (n) => n.type === 'chapter' && prefixes.some((p) => n.id.startsWith(p))
    );

    const { jeeStarCounts, jeeAllCounts, neetStarCounts, neetAllCounts } = await getExamBoardChapterCounts();
    const jeeStar = new Map((jeeStarCounts as CountRow[]).map((i) => [i._id, i.count]));
    const jeeAll = new Map((jeeAllCounts as CountRow[]).map((i) => [i._id, i.count]));
    const neetStar = new Map((neetStarCounts as CountRow[]).map((i) => [i._id, i.count]));
    const neetAll = new Map((neetAllCounts as CountRow[]).map((i) => [i._id, i.count]));

    return nodes.map((n) => ({
        id: n.id,
        name: n.name,
        class_level: n.class_level ?? 11,
        display_order: n.sequence_order ?? 0,
        // Physics/math have no chem category; 'Physical' is a harmless
        // placeholder. The planner groups these subjects by `group` (derived
        // from the chapterType carried below), never by `category`.
        category: 'Physical' as const,
        question_count: jeeAll.get(n.id) ?? 0,
        star_question_count: jeeStar.get(n.id) ?? 0,
        neet_question_count: neetAll.get(n.id) ?? 0,
        neet_star_question_count: neetStar.get(n.id) ?? 0,
        chapterType: n.chapterType,
    }));
}

export const buildPhysicsChapters = () => buildForPrefixes(['ph11_', 'ph12_']);
export const buildMathChapters = () => buildForPrefixes(['ma_']);
