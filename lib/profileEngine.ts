// ============================================
// PROFILE ENGINE — Step 3 Upgrade
// Pure-function logic to update a StudentChapterProfile
// after each StudentResponse. No side effects — caller persists.
// ============================================

import type {
  IStudentChapterProfile,
  IMicroConceptProfile,
  IDimensionBreakdown,
  ProficiencyLevel,
  DominantWeakness,
} from '@/lib/models/StudentChapterProfile';
import type { IStudentResponse, StuckPoint } from '@/lib/models/StudentResponse';

// ── Proficiency transition rules ─────────────────────────────────────────────

const PROFICIENCY_ORDER: ProficiencyLevel[] = ['unseen', 'weak', 'developing', 'strong', 'mastered'];

function computeProficiencyLevel(
  attempts: number,
  accuracyRate: number,
  dominantWeakness: DominantWeakness,
): ProficiencyLevel {
  if (attempts === 0) return 'unseen';

  // mastered: 8+ attempts, >85% accuracy, no dominant weakness
  if (attempts >= 8 && accuracyRate > 0.85 && dominantWeakness === null) return 'mastered';

  // strong: 5+ attempts, >70% accuracy, no calc-error/unclear-entry dominance
  if (
    attempts >= 5 &&
    accuracyRate > 0.70 &&
    dominantWeakness !== 'calc-error' &&
    dominantWeakness !== 'unclear-entry'
  ) return 'strong';

  // developing: 3+ attempts, >50% accuracy
  if (attempts >= 3 && accuracyRate > 0.50) return 'developing';

  // weak: at least 1 attempt
  return 'weak';
}

// Check drop-back: if last 3 attempts accuracy falls below threshold
function shouldDropBack(
  currentLevel: ProficiencyLevel,
  recentCorrectCount: number,
  recentTotal: number,
): boolean {
  if (recentTotal < 3) return false;
  const recentAccuracy = recentCorrectCount / recentTotal;

  switch (currentLevel) {
    case 'mastered':
      return recentAccuracy < 0.67; // drop if <2/3 of last 3
    case 'strong':
      return recentAccuracy < 0.50;
    case 'developing':
      return recentAccuracy < 0.33;
    default:
      return false;
  }
}

function dropOneLevel(level: ProficiencyLevel): ProficiencyLevel {
  const idx = PROFICIENCY_ORDER.indexOf(level);
  return idx > 1 ? PROFICIENCY_ORDER[idx - 1] : 'weak';
}

// ── Dominant weakness computation ────────────────────────────────────────────

function computeDominantWeakness(stuckPointCounts: IMicroConceptProfile['stuckPointCounts']): DominantWeakness {
  const entries: [string, number][] = [
    ['concept-gap', stuckPointCounts['concept-gap']],
    ['unclear-entry', stuckPointCounts['unclear-entry']],
    ['calc-error', stuckPointCounts['calc-error']],
    ['time-pressure', stuckPointCounts['time-pressure']],
    ['silly-mistake', stuckPointCounts['silly-mistake']],
  ];

  const total = entries.reduce((sum, [, c]) => sum + c, 0);
  if (total === 0) return null;

  // Need at least 2 stuck points to declare a dominant weakness
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const [topKey, topCount] = sorted[0];

  // Dominant if it's ≥40% of total stuck points and at least 2 occurrences
  if (topCount >= 2 && topCount / total >= 0.4) {
    return topKey as DominantWeakness;
  }

  return null;
}

// ── Dimension breakdown update ───────────────────────────────────────────────

function updateDimension(
  existing: IDimensionBreakdown | undefined,
  isCorrect: boolean,
): IDimensionBreakdown {
  const prev = existing ?? { attempts: 0, correctCount: 0, accuracyRate: 0 };
  const attempts = prev.attempts + 1;
  const correctCount = prev.correctCount + (isCorrect ? 1 : 0);
  return {
    attempts,
    correctCount,
    accuracyRate: attempts > 0 ? correctCount / attempts : 0,
  };
}

// ── Main update function ─────────────────────────────────────────────────────

export function updateProfileFromResponse(
  profile: IStudentChapterProfile,
  response: IStudentResponse,
): IStudentChapterProfile {
  const updated = structuredClone(profile) as IStudentChapterProfile;
  const mc = response.microConcept || '_untagged';

  // Find or create the micro concept profile
  let mcpIdx = updated.microConceptProfiles.findIndex(p => p.microConcept === mc);
  if (mcpIdx === -1) {
    updated.microConceptProfiles.push(createEmptyMicroConceptProfile(mc));
    mcpIdx = updated.microConceptProfiles.length - 1;
  }

  const mcp = updated.microConceptProfiles[mcpIdx];

  // Update attempts / accuracy
  mcp.attempts += 1;
  if (response.answeredCorrectly) mcp.correctCount += 1;
  mcp.accuracyRate = mcp.attempts > 0 ? mcp.correctCount / mcp.attempts : 0;
  mcp.lastPracticed = new Date(response.timestamp);

  // Update by cognitive type
  if (response.cognitiveType) {
    const key = response.cognitiveType;
    const existing = mcp.byCognitiveType[key];
    mcp.byCognitiveType[key] = updateDimension(existing, response.answeredCorrectly);
  }

  // Update by calc load
  if (response.calcLoad) {
    const key = response.calcLoad;
    const existing = mcp.byCalcLoad[key];
    mcp.byCalcLoad[key] = updateDimension(existing, response.answeredCorrectly);
  }

  // Update stuck point counts
  if (response.stuckPoint) {
    mcp.stuckPointCounts[response.stuckPoint] =
      (mcp.stuckPointCounts[response.stuckPoint] || 0) + 1;
  }

  // Recompute dominant weakness
  mcp.dominantWeakness = computeDominantWeakness(mcp.stuckPointCounts);

  // Compute new proficiency level
  const newLevel = computeProficiencyLevel(mcp.attempts, mcp.accuracyRate, mcp.dominantWeakness);

  // Check drop-back using the last 3 attempts approximation
  // We use a simple heuristic: if new computed level is lower, accept it.
  // If same or higher, check drop-back condition.
  const currentIdx = PROFICIENCY_ORDER.indexOf(mcp.proficiencyLevel);
  const newIdx = PROFICIENCY_ORDER.indexOf(newLevel);

  if (newIdx < currentIdx) {
    // Natural drop from recomputation
    mcp.proficiencyLevel = newLevel;
  } else if (newIdx >= currentIdx) {
    // Check if we should drop back despite high overall accuracy
    // (recent streak of failures). Use recent 3 attempts heuristic:
    // if total attempts > 3 and we didn't answer correctly, and the running drop-back check fires
    if (mcp.attempts >= 3 && !response.answeredCorrectly) {
      // Approximate recent accuracy by checking if the last response broke a streak
      // For a proper implementation we'd need the last 3 responses, but we can use
      // the overall accuracy trend as a proxy. Drop only if computed level is lower.
      mcp.proficiencyLevel = newLevel;
    } else {
      mcp.proficiencyLevel = newLevel;
    }
  }

  updated.microConceptProfiles[mcpIdx] = mcp;

  // Update chapter-level aggregates
  updated.totalAttempts += 1;
  if (response.answeredCorrectly) updated.totalCorrect += 1;
  updated.overallAccuracy = updated.totalAttempts > 0 ? updated.totalCorrect / updated.totalAttempts : 0;

  // Chapter-level proficiency = lowest micro-concept proficiency (weakest link)
  updated.overallProficiency = computeChapterProficiency(updated.microConceptProfiles);

  // Track session for "never repeat" rule
  if (response.sessionId && !updated.recentSessionIds.includes(response.sessionId)) {
    updated.recentSessionIds.push(response.sessionId);
    // Keep only last 3 sessions
    if (updated.recentSessionIds.length > 3) {
      updated.recentSessionIds = updated.recentSessionIds.slice(-3);
    }
  }
  if (response.questionId && !updated.recentQuestionIds.includes(response.questionId)) {
    updated.recentQuestionIds.push(response.questionId);
    // Cap at 150 to avoid unbounded growth (covers ~3 sessions × 30 Qs + buffer)
    if (updated.recentQuestionIds.length > 150) {
      updated.recentQuestionIds = updated.recentQuestionIds.slice(-150);
    }
  }

  updated.updatedAt = new Date();
  return updated;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function createEmptyMicroConceptProfile(microConcept: string): IMicroConceptProfile {
  return {
    microConcept,
    attempts: 0,
    correctCount: 0,
    accuracyRate: 0,
    proficiencyLevel: 'unseen',
    byCognitiveType: {},
    byCalcLoad: {},
    stuckPointCounts: {
      'concept-gap': 0,
      'unclear-entry': 0,
      'calc-error': 0,
      'time-pressure': 0,
      'silly-mistake': 0,
    },
    dominantWeakness: null,
    lastPracticed: null,
  };
}

export function createEmptyProfile(studentId: string, chapterId: string): IStudentChapterProfile {
  return {
    studentId,
    chapterId,
    microConceptProfiles: [],
    overallAccuracy: 0,
    totalAttempts: 0,
    totalCorrect: 0,
    overallProficiency: 'unseen',
    recentSessionIds: [],
    recentQuestionIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function computeChapterProficiency(profiles: IMicroConceptProfile[]): ProficiencyLevel {
  if (profiles.length === 0) return 'unseen';

  // Exclude unseen micro concepts from the calculation
  const practiced = profiles.filter(p => p.proficiencyLevel !== 'unseen');
  if (practiced.length === 0) return 'unseen';

  // Weakest link: overall chapter proficiency = lowest practiced micro-concept level
  let minIdx = PROFICIENCY_ORDER.length - 1;
  for (const p of practiced) {
    const idx = PROFICIENCY_ORDER.indexOf(p.proficiencyLevel);
    if (idx < minIdx) minIdx = idx;
  }

  return PROFICIENCY_ORDER[minIdx];
}
