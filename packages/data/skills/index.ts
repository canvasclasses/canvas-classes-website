/**
 * @canvas/data/skills — the unified Skill Graph.
 *
 * One curriculum-agnostic catalogue of skills, shared by every surface
 * (Crucible questions, Live Book practice, future lectures/flashcards). Each
 * assessable item is tagged with one or more *global skill ids*; the learner
 * persona (UserProgress.concept_mastery) is keyed by those ids, so a single
 * student model spans subjects, classes, and products.
 *
 * See _agents/plans/UNIFIED_LEARNER_PERSONA.md (Layer 2) + ADR-011.
 *
 * ID NAMESPACES (opaque strings — only this module interprets their shape):
 *   - Crucible chem/phys/math:  `tag_atom_3`  → resolved by packages/data/taxonomy
 *     (this registry deliberately does NOT duplicate them).
 *   - Live Books:               `bk:<subj><grade>:<concept>` and
 *                               `bk:<subj><grade>:grammar:<microskill>`
 *   - NCF-SE competencies:      `comp:<subj>:C<n>`
 *
 * Pure module — no DB, no server-only — safe to import from the persona
 * value-core (user-progress-updater.ts) and from any app.
 */

export type SkillKind = 'micro' | 'topic' | 'competency';

export interface SkillNode {
  id: string;
  name: string;
  subject: string;          // 'english' | 'chemistry' | ...
  grade?: number;           // 8 | 9 | 10 | 11 | 12
  kind: SkillKind;
  /** Skill ids that should be learned/mastered before this one (a DAG). */
  prerequisites: string[];
}

// ── Seed: English Class 9 (the Phase-0 pilot) ────────────────────────────────
// Topic-level concept skills (mirror the Live Books practice concept_tags).
const EN9_CONCEPTS: Array<[string, string]> = [
  ['comprehension', 'Reading Comprehension'],
  ['vocab_in_context', 'Vocabulary in Context'],
  ['grammar', 'Grammar'],
  ['interpretation', 'Interpretation'],
  ['inference', 'Inference'],
];

// Grammar micro-skills + their prerequisite DAG (proof-of-concept).
const EN9_GRAMMAR_MICRO: Array<{ key: string; name: string; prereq: string[] }> = [
  { key: 'tenses', name: 'Tenses', prereq: [] },
  { key: 'clauses', name: 'Clauses (main / subordinate / relative)', prereq: [] },
  { key: 'present_perfect', name: 'Present Perfect Tense', prereq: ['bk:en9:grammar:tenses'] },
  { key: 'reported_speech', name: 'Reported Speech', prereq: ['bk:en9:grammar:tenses'] },
  { key: 'modals', name: 'Modals', prereq: ['bk:en9:grammar:tenses'] },
  { key: 'active_passive', name: 'Active & Passive Voice', prereq: ['bk:en9:grammar:tenses'] },
  { key: 'reported_exclamations', name: 'Reported Exclamations & Commands', prereq: ['bk:en9:grammar:reported_speech'] },
  { key: 'conditionals', name: 'Conditionals & "could"', prereq: ['bk:en9:grammar:tenses'] },
];

// Which grammar micro-skill each Kaveri chapter's grammar focus drills.
// Lets a coarse `concept_tag:'grammar'` book attempt resolve to the precise skill.
export const EN9_CHAPTER_GRAMMAR: Record<number, string> = {
  1: 'tenses',          // prefixes/binomials — no single grammar micro; default
  2: 'clauses',
  3: 'present_perfect',
  4: 'reported_speech',
  5: 'modals',
  6: 'reported_exclamations',
  7: 'active_passive',
  8: 'conditionals',
};

// NCF-SE 2023 competencies (cross-cutting, coarse skills).
const NCF_COMPETENCIES: Array<[string, string]> = [
  ['C1', 'Read & Comprehend'],
  ['C2', 'Interpret & Infer'],
  ['C3', 'Speak & Write for Real Purposes'],
  ['C4', 'Appreciate Literary Craft'],
  ['C5', 'Vocabulary & Grammar in Use'],
  ['C6', 'Appreciate Writers & Diversity'],
  ['C7', 'Consolidate & Apply'],
];

// ── Build the registry ───────────────────────────────────────────────────────
function buildRegistry(): Map<string, SkillNode> {
  const m = new Map<string, SkillNode>();
  const add = (n: SkillNode) => m.set(n.id, n);

  for (const [key, name] of EN9_CONCEPTS) {
    add({ id: `bk:en9:${key}`, name, subject: 'english', grade: 9, kind: 'topic', prerequisites: [] });
  }
  for (const g of EN9_GRAMMAR_MICRO) {
    add({ id: `bk:en9:grammar:${g.key}`, name: g.name, subject: 'english', grade: 9, kind: 'micro', prerequisites: g.prereq });
  }
  for (const [code, name] of NCF_COMPETENCIES) {
    add({ id: `comp:en:${code}`, name: `${name} (${code})`, subject: 'english', kind: 'competency', prerequisites: [] });
  }
  return m;
}

const REGISTRY: Map<string, SkillNode> = buildRegistry();

// ── Public API ────────────────────────────────────────────────────────────────

/** The full node, or null if this id is not in the skill registry. */
export function getSkill(id: string): SkillNode | null {
  return REGISTRY.get(id) ?? null;
}

/**
 * Human-readable name for a skill id, or null if unknown to this registry.
 * Used as the fallback inside taxonomy `getTagName` so Live Books skills
 * render with real names in dashboards. Crucible `tag_*` ids are NOT in this
 * registry — they resolve via the taxonomy and this returns null for them.
 */
export function getSkillName(id: string): string | null {
  return REGISTRY.get(id)?.name ?? null;
}

/** Direct prerequisites of a skill (empty if none / unknown). */
export function prerequisitesOf(id: string): string[] {
  return REGISTRY.get(id)?.prerequisites ?? [];
}

/** Every seeded skill (for admin tooling / coverage checks). */
export function allSkills(): SkillNode[] {
  return [...REGISTRY.values()];
}

/**
 * Map a Live Books practice/challenge attempt to its global skill id.
 * Grammar attempts resolve to the chapter's specific grammar micro-skill;
 * everything else uses the subject-level concept skill.
 *
 *   resolveBookSkill({ subject:'english', grade:9, chapter:4, conceptTag:'grammar' })
 *     → 'bk:en9:grammar:reported_speech'
 *   resolveBookSkill({ subject:'english', grade:9, chapter:4, conceptTag:'inference' })
 *     → 'bk:en9:inference'
 */
export function resolveBookSkill(opts: {
  subject: string;
  grade: number;
  chapter: number;
  conceptTag: string;
}): string {
  const subj = opts.subject === 'english' ? 'en' : opts.subject.slice(0, 2);
  const base = `bk:${subj}${opts.grade}`;
  if (opts.conceptTag === 'grammar') {
    const micro = opts.subject === 'english' ? EN9_CHAPTER_GRAMMAR[opts.chapter] : undefined;
    if (micro) return `${base}:grammar:${micro}`;
    return `${base}:grammar`;
  }
  return `${base}:${opts.conceptTag}`;
}
