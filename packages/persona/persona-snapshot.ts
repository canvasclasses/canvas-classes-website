import 'server-only';
import connectToDatabase from '@canvas/data/db/mongodb';
import { UserProgress, type IConceptMastery, type IQuestionAttempt } from '@canvas/data/models/UserProgress';
import {
  StudentChapterProfile,
  type IStudentChapterProfile,
  type DominantWeakness,
  type ProficiencyLevel,
} from '@canvas/data/models/StudentChapterProfile';
import { computeProficiencyLevel } from './contract';
import { getRecommendations, type RecommendationReason, type RecommendationActionType } from './recommendation-engine';
import { getTagName } from '@canvas/data/taxonomy/lookup';
import { getSkill } from '@canvas/data/skills';
import { DEFAULT_TENANT_ID } from '@canvas/data/tenancy';

/**
 * PERSONA SNAPSHOT — the read-only contract the AI tutor consumes (Phase 2, ADR-011).
 *
 * A compact, *versioned* projection over the materialised persona
 * (`UserProgress.concept_mastery` + `StudentChapterProfile`) computed with the
 * existing `contract.ts` classifiers — NOT a new source of truth. The AI tutor
 * reads THIS, never the raw documents or the event log, mirroring the
 * deterministic-engine-computes-state / AI-interprets split
 * (CRUCIBLE_ARCHITECTURE.md §10, UNIFIED_LEARNER_PERSONA.md Layer 6).
 *
 * This module is PURE READ: it never mutates the persona. The only mutation
 * surface remains `writer.ts`.
 *
 * `PERSONA_SNAPSHOT_VERSION` is bumped whenever the snapshot SHAPE changes, so
 * a cached/stored snapshot can be invalidated and the AI prompt template kept
 * in lockstep with the contract.
 */
// v2 (2026-06-07): added `tenant_id` (Phase 3 multi-tenancy).
export const PERSONA_SNAPSHOT_VERSION = 2;

/** Per-skill recent direction, derived from the HIGH-confidence attempt window. */
export type SkillTrajectory = 'improving' | 'declining' | 'steady' | 'new';

export interface PersonaSkill {
  skill_id: string;
  name: string;
  subject?: string;
  /** 'micro' | 'topic' | 'competency' when the skill is in the Skill Graph. */
  kind?: string;
  times_attempted: number;       // HIGH-confidence mastery attempts
  accuracy: number;              // 0–100
  /** BKT-lite P(known) in [0,1], or null for pre-Phase-1 / unscored skills. */
  mastery_prob: number | null;
  /** contract.ts proficiency label (unseen/weak/developing/strong/mastered). */
  proficiency: ProficiencyLevel;
  due_for_review: boolean;
  next_due_at: string | null;    // ISO
  last_attempted_at: string | null; // ISO
  trajectory: SkillTrajectory;
}

export interface PersonaSnapshot {
  snapshot_version: number;
  generated_at: string;          // ISO
  user_id: string;
  /** B2B tenant this learner belongs to (Phase 3). 'public' for B2C students. */
  tenant_id: string;
  summary: {
    total_skills_tracked: number;
    skills_weak: number;
    skills_proficient_or_better: number;
    skills_due_for_review: number;
    overall_accuracy: number;    // 0–100, lifetime HIGH-confidence
  };
  /** Per-skill projection, most-actionable first. May be truncated (see flag). */
  skills: PersonaSkill[];
  skills_truncated: boolean;
  /** Dominant error types rolled up across the student's chapter profiles. */
  weaknesses: Array<{ type: Exclude<DominantWeakness, null>; count: number }>;
  /** Top recommended next actions (reuses the live recommendation engine). */
  recommended: Array<{
    skill_id?: string;
    name: string;
    reason: RecommendationReason;
    reason_label: string;
    action_type: RecommendationActionType;
    action_url: string;
    has_resource: boolean;
  }>;
}

// Mongoose `.lean()` returns Map fields as plain objects on some versions and
// as Maps on others — normalise to [key, value] pairs either way.
function entriesOf<T>(m: unknown): Array<[string, T]> {
  if (!m) return [];
  if (m instanceof Map) return [...m.entries()] as Array<[string, T]>;
  return Object.entries(m as Record<string, T>);
}

const SKILLS_CAP = 150;

/**
 * Per-skill trajectory from the recent-attempts ring buffer. Looks at the
 * student's HIGH-confidence attempts tagged with this skill, splits them
 * chronologically in half, and compares accuracy. < 4 attempts → 'new'
 * (not enough signal to call a trend).
 */
function computeTrajectory(attempts: IQuestionAttempt[]): SkillTrajectory {
  if (attempts.length < 4) return 'new';
  const sorted = [...attempts].sort(
    (a, b) => new Date(a.attempted_at).getTime() - new Date(b.attempted_at).getTime(),
  );
  const mid = Math.floor(sorted.length / 2);
  const older = sorted.slice(0, mid);
  const newer = sorted.slice(mid);
  const rate = (xs: IQuestionAttempt[]) => xs.filter((x) => x.is_correct).length / xs.length;
  const delta = rate(newer) - rate(older);
  if (delta > 0.15) return 'improving';
  if (delta < -0.15) return 'declining';
  return 'steady';
}

/**
 * Build the versioned persona snapshot for a user. Returns a snapshot with
 * empty collections (not null) for a user with no progress yet, so callers
 * never branch on existence.
 */
export async function buildPersonaSnapshot(userId: string): Promise<PersonaSnapshot> {
  await connectToDatabase();

  const nowMs = Date.now();
  const nowIso = new Date(nowMs).toISOString();

  const progress = await UserProgress.findById(userId)
    .select('concept_mastery recent_attempts stats tenant_id')
    .lean() as {
      concept_mastery?: unknown;
      recent_attempts?: IQuestionAttempt[];
      stats?: { overall_accuracy?: number };
      tenant_id?: string;
    } | null;

  const empty: PersonaSnapshot = {
    snapshot_version: PERSONA_SNAPSHOT_VERSION,
    generated_at: nowIso,
    user_id: userId,
    tenant_id: DEFAULT_TENANT_ID,
    summary: {
      total_skills_tracked: 0,
      skills_weak: 0,
      skills_proficient_or_better: 0,
      skills_due_for_review: 0,
      overall_accuracy: 0,
    },
    skills: [],
    skills_truncated: false,
    weaknesses: [],
    recommended: [],
  };

  if (!progress) return empty;

  // ── Per-skill projection from concept_mastery (mastery counters only). ──
  // Group recent HIGH-confidence attempts by skill id for trajectory.
  const recent = Array.isArray(progress.recent_attempts) ? progress.recent_attempts : [];
  const highBySkill = new Map<string, IQuestionAttempt[]>();
  for (const a of recent) {
    if ((a.confidence ?? 'medium') !== 'high') continue;
    for (const tag of a.concept_tags ?? []) {
      if (!highBySkill.has(tag)) highBySkill.set(tag, []);
      highBySkill.get(tag)!.push(a);
    }
  }

  const entries = entriesOf<IConceptMastery>(progress.concept_mastery);
  const skills: PersonaSkill[] = [];
  for (const [skillId, m] of entries) {
    const attempts = m?.times_attempted ?? 0;
    if (attempts < 1) continue; // only skills with mastery signal
    const accuracy = Math.round(m.accuracy_percentage ?? 0);
    const proficiency = computeProficiencyLevel(attempts, accuracy / 100, null);
    const masteryProb = typeof m.mastery_prob === 'number' ? Math.round(m.mastery_prob * 100) / 100 : null;
    const dueAtMs = m.next_due_at ? new Date(m.next_due_at).getTime() : null;
    // Due only counts for skills the student has actually learned (not weak).
    const learned = proficiency === 'developing' || proficiency === 'strong' || proficiency === 'mastered';
    const due = !!(dueAtMs && dueAtMs <= nowMs && learned);
    const node = getSkill(skillId);
    skills.push({
      skill_id: skillId,
      name: getTagName(skillId),
      subject: node?.subject,
      kind: node?.kind,
      times_attempted: attempts,
      accuracy,
      mastery_prob: masteryProb,
      proficiency,
      due_for_review: due,
      next_due_at: m.next_due_at ? new Date(m.next_due_at).toISOString() : null,
      last_attempted_at: m.last_attempted_at ? new Date(m.last_attempted_at).toISOString() : null,
      trajectory: computeTrajectory(highBySkill.get(skillId) ?? []),
    });
  }

  // Most-actionable first: weak skills, then due-for-review, then by attempts.
  const rank = (s: PersonaSkill) => (s.proficiency === 'weak' ? 0 : s.due_for_review ? 1 : 2);
  skills.sort((a, b) => rank(a) - rank(b) || b.times_attempted - a.times_attempted);

  const skills_truncated = skills.length > SKILLS_CAP;
  const cappedSkills = skills.slice(0, SKILLS_CAP);

  const summary = {
    total_skills_tracked: skills.length,
    skills_weak: skills.filter((s) => s.proficiency === 'weak').length,
    skills_proficient_or_better: skills.filter(
      (s) => s.proficiency === 'strong' || s.proficiency === 'mastered',
    ).length,
    skills_due_for_review: skills.filter((s) => s.due_for_review).length,
    overall_accuracy: Math.round(progress.stats?.overall_accuracy ?? 0),
  };

  // ── Dominant-weakness rollup across the student's chapter profiles. ──
  const weaknessCounts: Record<Exclude<DominantWeakness, null>, number> = {
    'concept-gap': 0,
    'unclear-entry': 0,
    'calc-error': 0,
    'time-pressure': 0,
    'silly-mistake': 0,
  };
  const profiles = await StudentChapterProfile.find({ studentId: userId })
    .select('microConceptProfiles')
    .limit(100)
    .lean() as Array<Pick<IStudentChapterProfile, 'microConceptProfiles'>>;
  for (const p of profiles) {
    for (const mc of p.microConceptProfiles ?? []) {
      if (mc.dominantWeakness) weaknessCounts[mc.dominantWeakness] += 1;
    }
  }
  const weaknesses = (Object.entries(weaknessCounts) as Array<[Exclude<DominantWeakness, null>, number]>)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ type, count }));

  // ── Top recommendations — reuse the live engine (no logic duplication). ──
  const recs = await getRecommendations(userId, { limit: 5 });
  const recommended = recs.map((r) => ({
    skill_id: r.topic_tag_id,
    name: r.title,
    reason: r.reason,
    reason_label: r.reason_label,
    action_type: r.action_type,
    action_url: r.action_url,
    has_resource: !!r.resource,
  }));

  return {
    snapshot_version: PERSONA_SNAPSHOT_VERSION,
    generated_at: nowIso,
    user_id: userId,
    tenant_id: progress.tenant_id ?? DEFAULT_TENANT_ID,
    summary,
    skills: cappedSkills,
    skills_truncated,
    weaknesses,
    recommended,
  };
}
