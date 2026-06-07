/**
 * Lightweight server-side lookup over the canonical taxonomy file.
 *
 * Importing the full TAXONOMY_FROM_CSV array into route handlers each request is
 * cheap (it's a static module-level array, evaluated once per process), but the
 * routes need name lookups by id frequently. This module builds the Map once
 * and exports a small surface.
 *
 * Source of truth: lib/taxonomy/taxonomyData_from_csv.ts.
 */

import { TAXONOMY_FROM_CSV, TaxonomyNode } from './taxonomyData_from_csv';
import { getSkillName } from '../skills';

const idToNode = new Map<string, TaxonomyNode>();
for (const node of TAXONOMY_FROM_CSV) {
  if (node.id) idToNode.set(node.id, node);
}

/** Returns the human-readable name for a skill id. Resolution order:
 *  Crucible taxonomy (chem/phys/math `tag_*`) → unified Skill Graph
 *  (Live Books `bk:*` / NCF `comp:*` skills) → the id itself as a last resort.
 *  This is what lets a globally skill-keyed concept_mastery render real names
 *  for every surface. See _agents/plans/UNIFIED_LEARNER_PERSONA.md (Layer 2). */
export function getTagName(id: string): string {
  return idToNode.get(id)?.name ?? getSkillName(id) ?? id;
}

/** Returns the parent chapter id for a topic tag, or null if the id is itself
 *  a chapter / unknown. Useful for chapter-level rollup of concept attempts. */
export function getParentChapter(tagId: string): string | null {
  const node = idToNode.get(tagId);
  if (!node) return null;
  return node.parent_id ?? null;
}

/** Returns the display category for a chapter ('Physical' | 'Organic' | …),
 *  or null if the id is unknown or refers to a topic. Used to derive the
 *  per-chapter accent colour in surfaces that only have a chapter id (e.g.
 *  TestView, which receives questions[] but no chapter prop). */
export function getChapterCategory(chapterId: string): string | null {
  const node = idToNode.get(chapterId);
  if (!node || node.type !== 'chapter') return null;
  const t = (node as { chapterType?: string }).chapterType;
  if (!t) return null;
  // Map taxonomy chapterType → display category. Subjects (physics, biology,
  // calculus, etc.) bubble up to themselves so a non-chemistry chapter still
  // gets a sensible label/accent.
  const map: Record<string, string> = {
    physical: 'Physical',
    organic: 'Organic',
    inorganic: 'Inorganic',
    practical: 'Practical',
    physics: 'Physics',
    biology: 'Biology',
    algebra: 'Maths',
    calculus: 'Maths',
    coordinate_geometry: 'Maths',
    trigonometry: 'Maths',
    vector_algebra: 'Maths',
  };
  return map[t] ?? t.charAt(0).toUpperCase() + t.slice(1);
}
