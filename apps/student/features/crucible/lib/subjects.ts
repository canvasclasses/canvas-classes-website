// Pure, client-safe subject/group helpers for the Crucible question bank.
//
// This module has NO server-only imports (no next/cache, no mongoose), so both
// Server Components (chapterCounts.ts, the route pages) AND Client Components
// (BrowseView, CrucibleWizard) can import it. Subject identity + the chapterType
// → group label mapping live here so they don't drift across the four+ places
// that used to re-derive them.

export type CrucibleSubject = 'Chemistry' | 'Physics' | 'Maths';

// Every subject the Crucible can serve. Pass this to buildChaptersWithCounts()
// to opt into the full bank; the default there is Chemistry-only (safe historical
// behaviour) so a caller that forgets never accidentally floods chemistry
// surfaces with physics/maths.
export const CRUCIBLE_ALL_SUBJECTS: CrucibleSubject[] = ['Chemistry', 'Physics', 'Maths'];

// Chapter-id prefixes per subject (the inverse of subjectForChapterId).
export const SUBJECT_PREFIXES: Record<CrucibleSubject, string[]> = {
  Chemistry: ['ch11_', 'ch12_'],
  Physics: ['ph11_', 'ph12_'],
  Maths: ['ma_'],
};

// Subject is derived purely from the chapter-id prefix:
//   ch11_/ch12_ → Chemistry · ph11_/ph12_ → Physics · ma_ → Maths.
export function subjectForChapterId(id: string): CrucibleSubject {
  if (id.startsWith('ph11_') || id.startsWith('ph12_')) return 'Physics';
  if (id.startsWith('ma_')) return 'Maths';
  return 'Chemistry';
}

// Capitalize a chemistry category string from the taxonomy into the canonical UI
// type. Non-chemistry chapterTypes fall through to 'Physical' (a placeholder —
// physics/maths surfaces label by `group`/subject, never this).
export function capitalizeCategory(cat?: string): 'Physical' | 'Inorganic' | 'Organic' | 'Practical' {
  switch ((cat ?? '').toLowerCase()) {
    case 'inorganic': return 'Inorganic';
    case 'organic': return 'Organic';
    case 'practical': return 'Practical';
    default: return 'Physical';
  }
}

// Physics modules — stored in the taxonomy `chapterType` (migrated 2026-06-09
// from the flat 'physics'), mirroring how Maths stores its section.
export const PHYSICS_GROUP_LABEL: Record<string, string> = {
  mechanics_1: 'Mechanics 1',
  mechanics_2: 'Mechanics 2',
  thermo_waves: 'Thermodynamics & Waves',
  electromagnetism: 'Electromagnetism',
  optics: 'Optics',
  modern_physics: 'Modern Physics',
  experimental_physics: 'Experimental Physics',
};

export const MATH_GROUP_LABEL: Record<string, string> = {
  algebra: 'Algebra',
  calculus: 'Calculus',
  coordinate_geometry: 'Coordinate Geometry',
  trigonometry: 'Trigonometry',
  vector_algebra: 'Vector Algebra',
};

// The display bucket the Crucible chapter list groups under, per subject:
//  - Chemistry → its category (Physical / Inorganic / Organic / Practical).
//  - Physics   → its chapterType MODULE (mechanics_1 / electromagnetism / …).
//  - Maths     → its chapterType section (algebra / calculus / …).
// `chapterType` may be undefined on the DB-down fallback path — the class-level
// fallback keeps it sensible there.
export function groupForChapter(id: string, chapterType: string | undefined, classLevel: number): string {
  if (id.startsWith('ma_')) return MATH_GROUP_LABEL[chapterType ?? ''] ?? 'Mathematics';
  if (id.startsWith('ph11_') || id.startsWith('ph12_')) return PHYSICS_GROUP_LABEL[chapterType ?? ''] ?? `Class ${classLevel}`;
  return capitalizeCategory(chapterType);
}
