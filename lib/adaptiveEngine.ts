// ADAPTIVE ENGINE: Pure function decision engine for guided practice.
// Zero side effects — all state lives in the AdaptiveSession container.
// V1 (Legacy): 7 decision rules in strict priority order.
// V2 (Step 4 Upgrade): 5-rule multi-dimensional system using StudentChapterProfile.

import {
  SESSION_PYQ_FINAL_PCT,
  CONCEPT_MASTERY_THRESHOLD,
  STRUGGLE_REPEAT_THRESHOLD,
  CONCEPT_ROTATION_AFTER,
  SESSION_MAX_QUESTIONS,
} from '@/constants/adaptivePractice';
import { Question } from '@/app/the-crucible/components/types';
import type { IStudentChapterProfile, IMicroConceptProfile, DominantWeakness } from '@/lib/models/StudentChapterProfile';

// ── Types ────────────────────────────────────────────────────────────────────

export type MicroFeedbackResponse = 'too_hard' | 'got_it' | 'too_easy';
export type ConceptLevel = 'unseen' | 'weak' | 'developing' | 'strong' | 'mastered';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface MicroFeedback {
  questionId: string;
  response: MicroFeedbackResponse;
  answeredCorrectly: boolean;
  timeSpentMs: number;
  viewedSolutionBeforeAnswering: boolean;
  conceptIds: string[]; // tags from the question
  difficulty: Difficulty;
}

export interface ConceptBaseline {
  conceptId: string;
  attempted: boolean;
  correct: boolean | null;
  timeSpentMs: number;
  viewedSolutionBeforeAnswering: boolean;
}

export interface UserConceptProfile {
  [conceptId: string]: {
    level: ConceptLevel;
    questionsAttempted: number;
    correctCount: number;
    lastPracticed?: Date;
    recentFeedback: MicroFeedbackResponse[]; // last 5 signals
  };
}

export interface AdaptiveEngineInput {
  chapter: { id: string; name: string };
  sessionHistory: MicroFeedback[];          // all feedback so far this session
  conceptBaseline: ConceptBaseline[];        // from diagnostic warm-up
  availableQuestions: Question[];            // all questions for this chapter
  userGlobalProfile: UserConceptProfile;     // from DB / session store
  seenQuestionIds: Set<string>;              // session + recent 3 sessions
  sessionMaxQuestions?: number;              // override SESSION_MAX_QUESTIONS
  initialDifficulty?: Difficulty;           // user's selected starting difficulty
}

export interface NextQuestionDecision {
  question: Question;
  reason: string; // ≤60 chars, shown in TransparencyBar
  targetDifficulty: Difficulty;
  targetConceptId: string | null;
}

// ── V2 Types ──────────────────────────────────────────────────────────────────

export interface AdaptiveEngineInputV2 extends AdaptiveEngineInput {
  chapterProfile?: IStudentChapterProfile | null;  // from DB, null = first session
  viewedExampleMicroConcepts?: Set<string>;        // from Phase 1 carousel, if student viewed examples
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDifficultyRank(d: Difficulty): number {
  return d === 'Easy' ? 0 : d === 'Medium' ? 1 : 2;
}

function rankToDifficulty(r: number): Difficulty {
  if (r <= 0) return 'Easy';
  if (r >= 2) return 'Hard';
  return 'Medium';
}

function bumpDifficulty(d: Difficulty, delta: 1 | -1): Difficulty {
  return rankToDifficulty(getDifficultyRank(d) + delta);
}

function getQuestionConceptIds(q: Question): string[] {
  return q.metadata.tags?.map(t => t.tag_id) ?? [];
}

function getLastNConcepts(history: MicroFeedback[], n: number): string[] {
  return history.slice(-n).flatMap(h => h.conceptIds);
}

// Counts how many times the concept got a signal type in the session
function countSignalForConcept(
  history: MicroFeedback[],
  conceptId: string,
  signal: MicroFeedbackResponse | 'positive'
): number {
  return history.filter(h =>
    h.conceptIds.includes(conceptId) &&
    (signal === 'positive'
      ? h.response === 'got_it' || h.response === 'too_easy'
      : h.response === signal)
  ).length;
}

// Returns concept → number of consecutive too_hard signals (reset on other signal)
function buildStrugglingConcepts(history: MicroFeedback[]): Map<string, number> {
  const streaks = new Map<string, number>();
  for (const fb of history) {
    for (const cid of fb.conceptIds) {
      if (fb.response === 'too_hard') {
        streaks.set(cid, (streaks.get(cid) ?? 0) + 1);
      } else {
        streaks.set(cid, 0); // reset streak on non-hard signal
      }
    }
  }
  return streaks;
}

// Picks from pool; shuffles with seed based on history length to vary picks
function pickBest(pool: Question[], seenIds: Set<string>): Question | null {
  const unseen = pool.filter(q => !seenIds.has(q.id));
  if (unseen.length === 0) return null;
  // Bias toward unseens — shuffle lightly
  const shuffled = [...unseen].sort(() => Math.random() - 0.5);
  return shuffled[0];
}

// ── Main Engine Function (dispatcher) ─────────────────────────────────────────

export function getNextQuestion(input: AdaptiveEngineInput | AdaptiveEngineInputV2): NextQuestionDecision | null {
  // If a chapterProfile is provided, use V2 engine
  const v2Input = input as AdaptiveEngineInputV2;
  if (v2Input.chapterProfile) {
    return getNextQuestionV2(v2Input);
  }
  return getNextQuestionLegacy(input);
}

// ── V1 Legacy Engine ──────────────────────────────────────────────────────────

function getNextQuestionLegacy(input: AdaptiveEngineInput): NextQuestionDecision | null {
  const {
    sessionHistory,
    conceptBaseline,
    availableQuestions,
    userGlobalProfile,
    seenQuestionIds,
    sessionMaxQuestions = SESSION_MAX_QUESTIONS,
    initialDifficulty,
  } = input;

  const totalServed = sessionHistory.length + conceptBaseline.length;
  const sessionFraction = totalServed / sessionMaxQuestions;

  // Determine current difficulty from last feedback, or use user's chosen difficulty on first question
  const currentDifficulty: Difficulty =
    sessionHistory.length > 0
      ? sessionHistory[sessionHistory.length - 1].difficulty
      : (initialDifficulty ?? 'Easy');

  // Pool of questions not yet seen
  const unseenPool = availableQuestions.filter(q => !seenQuestionIds.has(q.id));
  if (unseenPool.length === 0) return null;

  // ── Build concept intelligence ────────────────────────────────────────────

  const strugglingConcepts = buildStrugglingConcepts(sessionHistory);

  // Concepts with 3+ positive signals → deprioritized
  const allConceptIds = new Set(unseenPool.flatMap(getQuestionConceptIds));
  const deprioritizedConcepts = new Set<string>();
  for (const cid of allConceptIds) {
    if (countSignalForConcept(sessionHistory, cid, 'positive') >= CONCEPT_MASTERY_THRESHOLD) {
      deprioritizedConcepts.add(cid);
    }
  }

  // Last N concept ids for rotation check
  const recentConceptIds = getLastNConcepts(sessionHistory, CONCEPT_ROTATION_AFTER);
  const lastConceptId =
    sessionHistory.length > 0
      ? sessionHistory[sessionHistory.length - 1].conceptIds[0] ?? null
      : null;

  // ── Apply implicit signal override (Rule 5) ───────────────────────────────
  // If last feedback was got_it but viewed solution → treat as too_hard
  const lastFeedback = sessionHistory[sessionHistory.length - 1] ?? null;
  const effectiveLastResponse: MicroFeedbackResponse | null =
    lastFeedback?.viewedSolutionBeforeAnswering && lastFeedback?.response === 'got_it'
      ? 'too_hard'
      : (lastFeedback?.response ?? null);

  // ── Determine target difficulty ───────────────────────────────────────────
  let targetDifficulty = currentDifficulty;
  let targetConceptId: string | null = lastConceptId;
  let reason = 'Continuing practice';

  // Rule 3: Confidence escalation
  if (effectiveLastResponse === 'too_easy') {
    const bumped = bumpDifficulty(currentDifficulty, 1);
    if (bumped !== currentDifficulty) {
      targetDifficulty = bumped;
      reason = `You've got this — going ${bumped} on ${shortConceptName(lastConceptId, input)}`;
    } else {
      // Already Hard → mark mastered, rotate
      deprioritizedConcepts.add(lastConceptId ?? '');
      targetConceptId = null; // signal rotation
      reason = `${shortConceptName(lastConceptId, input)} mastered — switching concept`;
    }
  }

  // Rule 4: Struggle detection (too_hard × 2 on same concept)
  if (
    effectiveLastResponse === 'too_hard' &&
    lastConceptId &&
    (strugglingConcepts.get(lastConceptId) ?? 0) >= STRUGGLE_REPEAT_THRESHOLD
  ) {
    targetDifficulty = bumpDifficulty(currentDifficulty, -1);
    reason = `Trying a simpler ${shortConceptName(lastConceptId, input)} question`;
  }

  // Rule 2: Concept rotation (last N questions all same concept)
  const allSameConcept =
    recentConceptIds.length === CONCEPT_ROTATION_AFTER &&
    recentConceptIds.every(c => c === lastConceptId);
  if (allSameConcept && targetConceptId === lastConceptId) {
    targetConceptId = null; // force rotation below
    reason = `Good streak — switching to a new concept`;
  }

  // Rule 6: Proficiency cap — if target concept is deprioritized, rotate
  if (targetConceptId && deprioritizedConcepts.has(targetConceptId)) {
    targetConceptId = null;
    reason = `You've nailed this — moving to a fresh concept`;
  }

  // ── Rule 7: Final 20% → prefer PYQ ───────────────────────────────────────
  const preferPYQ = sessionFraction >= (1 - SESSION_PYQ_FINAL_PCT);
  if (preferPYQ) {
    reason = `Mixing in a PYQ at your current level`;
  }

  // ── Build candidate pools ─────────────────────────────────────────────────

  let candidates = unseenPool;

  // Filter by target difficulty
  const byDifficulty = candidates.filter(q => q.metadata.difficulty === targetDifficulty);
  if (byDifficulty.length > 0) candidates = byDifficulty;

  // Filter by PYQ if in final stretch
  if (preferPYQ) {
    const pyqCandidates = candidates.filter(q => q.metadata.is_pyq);
    if (pyqCandidates.length > 0) candidates = pyqCandidates;
  }

  // Filter by target concept (if set) or avoid deprioritized concepts
  if (targetConceptId) {
    const byConcept = candidates.filter(q =>
      getQuestionConceptIds(q).includes(targetConceptId!)
    );
    if (byConcept.length > 0) candidates = byConcept;
    // else fall through to full candidates (no match for concept)
  } else {
    // Rotate: prefer questions NOT from deprioritized or recent concepts
    const rotated = candidates.filter(q => {
      const qConcepts = getQuestionConceptIds(q);
      return (
        !qConcepts.some(c => deprioritizedConcepts.has(c)) &&
        !qConcepts.some(c => c === lastConceptId)
      );
    });
    if (rotated.length > 0) candidates = rotated;
  }

  // ── Rule 1: Never repeat (guaranteed by unseen pool) ─────────────────────
  const picked = pickBest(candidates, seenQuestionIds);
  if (!picked) return null;

  // Truncate reason to 60 chars
  const truncatedReason = reason.length > 60 ? reason.slice(0, 57) + '…' : reason;
  const pickedConceptId = getQuestionConceptIds(picked)[0] ?? null;

  return {
    question: picked,
    reason: truncatedReason,
    targetDifficulty,
    targetConceptId: pickedConceptId,
  };
}

// ── V2 Engine: Multi-dimensional 5-rule system ───────────────────────────────

function getNextQuestionV2(input: AdaptiveEngineInputV2): NextQuestionDecision | null {
  const {
    sessionHistory,
    conceptBaseline,
    availableQuestions,
    seenQuestionIds,
    sessionMaxQuestions = SESSION_MAX_QUESTIONS,
    chapterProfile,
    initialDifficulty,
  } = input;

  const profile = chapterProfile!;
  const totalServed = sessionHistory.length + conceptBaseline.length;
  const sessionFraction = totalServed / sessionMaxQuestions;

  // ── Rule 1: Never repeat a question from last 3 sessions ──────────────────
  const recentQIds = new Set([
    ...seenQuestionIds,
    ...(profile.recentQuestionIds ?? []),
  ]);
  const unseenPool = availableQuestions.filter(q => !recentQIds.has(q.id));
  if (unseenPool.length === 0) {
    // Fallback: allow session-only dedup if history is too restrictive
    const sessionOnlyPool = availableQuestions.filter(q => !seenQuestionIds.has(q.id));
    if (sessionOnlyPool.length === 0) return null;
    // Use legacy logic as fallback
    return getNextQuestionLegacy(input);
  }

  // ── Rule 5: Diagnostic phase (first 5 questions) ──────────────────────────
  if (totalServed < 5) {
    return pickDiagnosticQuestion(unseenPool, totalServed, seenQuestionIds, profile);
  }

  // ── Rule 4: Worked example trigger ────────────────────────────────────────
  // 2+ consecutive wrong/too_hard on same micro concept → serve worked example
  const workedExampleTarget = checkWorkedExampleTrigger(sessionHistory);
  if (workedExampleTarget) {
    const workedQ = findWorkedExample(unseenPool, workedExampleTarget, seenQuestionIds);
    if (workedQ) {
      return {
        question: workedQ,
        reason: truncReason("Let's look at a solved example first"),
        targetDifficulty: 'Easy',
        targetConceptId: workedExampleTarget,
      };
    }
  }

  // ── Rule 2: Pick micro concept with lowest proficiency ────────────────────
  const lastTwoMicroConcepts = sessionHistory.slice(-2).map(
    h => availableQuestions.find(q => q.id === h.questionId)?.metadata.microConcept ?? ''
  ).filter(Boolean);

  const targetMC = pickWeakestMicroConcept(profile, lastTwoMicroConcepts);

  // ── Rule 3: Target question type by dominantWeakness ──────────────────────
  const mcProfile = targetMC
    ? profile.microConceptProfiles.find(p => p.microConcept === targetMC)
    : null;
  const weakness = mcProfile?.dominantWeakness ?? null;

  let candidates = unseenPool;
  let reason = 'Continuing practice';

  // Filter by target micro concept if available
  if (targetMC) {
    const byMC = candidates.filter(q => q.metadata.microConcept === targetMC);
    if (byMC.length > 0) {
      candidates = byMC;
      reason = `Focusing on ${targetMC.slice(0, 30)}`;
    }
  }

  // Apply weakness-based filtering
  candidates = applyWeaknessFilter(candidates, weakness);
  reason = getWeaknessReason(weakness, targetMC, reason);

  // Apply difficulty targeting based on proficiency
  const targetDiff = getTargetDifficulty(mcProfile, initialDifficulty);
  const byDiff = candidates.filter(q => q.metadata.difficulty === targetDiff);
  if (byDiff.length > 0) candidates = byDiff;

  // Final 20% → prefer PYQ
  if (sessionFraction >= (1 - SESSION_PYQ_FINAL_PCT)) {
    const pyqs = candidates.filter(q => q.metadata.is_pyq);
    if (pyqs.length > 0) {
      candidates = pyqs;
      reason = 'Mixing in a PYQ at your current level';
    }
  }

  // Pick best from candidates
  const picked = pickBest(candidates, seenQuestionIds);
  if (!picked) {
    // Fallback to full unseen pool
    const fallback = pickBest(unseenPool, seenQuestionIds);
    if (!fallback) return null;
    return {
      question: fallback,
      reason: truncReason('Continuing practice'),
      targetDifficulty: fallback.metadata.difficulty,
      targetConceptId: getQuestionConceptIds(fallback)[0] ?? null,
    };
  }

  return {
    question: picked,
    reason: truncReason(reason),
    targetDifficulty: targetDiff,
    targetConceptId: getQuestionConceptIds(picked)[0] ?? null,
  };
}

// ── V2 Helper: Diagnostic phase question selection ───────────────────────────

function pickDiagnosticQuestion(
  pool: Question[],
  position: number,
  seenIds: Set<string>,
  profile: IStudentChapterProfile,
): NextQuestionDecision {
  // During diagnostic: pick conceptual, calc-none, clear-entry questions
  // One per distinct micro concept to get a breadth reading

  const seenMicroConcepts = new Set<string>();

  // Collect micro concepts already covered in this diagnostic
  // (We infer from profile's recent attempts, but since diagnostic is positions 0-4,
  //  we just use the pool filtering approach)

  // Prefer questions tagged: cognitiveType=conceptual, calcLoad=calc-none, entryPoint=clear-entry
  let diagnosticPool = pool.filter(q => {
    const ct = q.metadata.cognitiveType;
    const cl = q.metadata.calcLoad;
    const ep = q.metadata.entryPoint;
    const mc = q.metadata.microConcept ?? '';
    // Don't repeat same micro concept in diagnostic
    if (mc && seenMicroConcepts.has(mc)) return false;
    // Prefer conceptual + calc-none + clear-entry when tagged
    const matchesDiagnostic = (!ct || ct === 'conceptual') &&
                              (!cl || cl === 'calc-none' || cl === 'calc-light') &&
                              (!ep || ep === 'clear-entry');
    return matchesDiagnostic;
  });

  // Prefer Easy difficulty for diagnostic
  const easyDiag = diagnosticPool.filter(q => q.metadata.difficulty === 'Easy');
  if (easyDiag.length > 0) diagnosticPool = easyDiag;

  // Fallback: if not enough tagged questions, use any Easy from pool
  if (diagnosticPool.length === 0) {
    diagnosticPool = pool.filter(q => q.metadata.difficulty === 'Easy');
  }
  if (diagnosticPool.length === 0) {
    diagnosticPool = pool;
  }

  const picked = pickBest(diagnosticPool, seenIds);
  const fallback = picked ?? pool[0];

  return {
    question: fallback,
    reason: truncReason('Warm-up question'),
    targetDifficulty: 'Easy',
    targetConceptId: getQuestionConceptIds(fallback)[0] ?? null,
  };
}

// ── V2 Helper: Worked example trigger ────────────────────────────────────────

function checkWorkedExampleTrigger(history: MicroFeedback[]): string | null {
  if (history.length < 2) return null;
  const last2 = history.slice(-2);
  // Both must be wrong/too_hard AND share a micro concept
  const bothStruggling = last2.every(
    h => h.response === 'too_hard' || !h.answeredCorrectly
  );
  if (!bothStruggling) return null;

  // Find common concept
  const concepts0 = new Set(last2[0].conceptIds);
  const common = last2[1].conceptIds.find(c => concepts0.has(c));
  return common ?? null;
}

function findWorkedExample(
  pool: Question[],
  conceptId: string,
  seenIds: Set<string>,
): Question | null {
  // A "worked example" is an Easy question with clear-entry on the target concept
  const examples = pool.filter(q =>
    !seenIds.has(q.id) &&
    getQuestionConceptIds(q).includes(conceptId) &&
    q.metadata.difficulty === 'Easy' &&
    (!q.metadata.entryPoint || q.metadata.entryPoint === 'clear-entry')
  );
  return examples.length > 0 ? examples[Math.floor(Math.random() * examples.length)] : null;
}

// ── V2 Helper: Pick weakest micro concept ────────────────────────────────────

const PROFICIENCY_RANK: Record<string, number> = {
  unseen: 0, weak: 1, developing: 2, strong: 3, mastered: 4,
};

function pickWeakestMicroConcept(
  profile: IStudentChapterProfile,
  recentMicroConcepts: string[],
): string | null {
  const profiles = profile.microConceptProfiles;
  if (profiles.length === 0) return null;

  // Exclude micro concepts served in last 2 questions
  const recentSet = new Set(recentMicroConcepts);
  const eligible = profiles.filter(p => !recentSet.has(p.microConcept));
  const pool = eligible.length > 0 ? eligible : profiles;

  // Sort by proficiency level (lowest first), then by accuracy (lowest first)
  const sorted = [...pool].sort((a, b) => {
    const rankDiff = (PROFICIENCY_RANK[a.proficiencyLevel] ?? 0) - (PROFICIENCY_RANK[b.proficiencyLevel] ?? 0);
    if (rankDiff !== 0) return rankDiff;
    return a.accuracyRate - b.accuracyRate;
  });

  return sorted[0]?.microConcept ?? null;
}

// ── V2 Helper: Weakness-based question type targeting ────────────────────────

function applyWeaknessFilter(candidates: Question[], weakness: DominantWeakness): Question[] {
  if (!weakness || candidates.length <= 1) return candidates;

  let filtered: Question[] = [];

  switch (weakness) {
    case 'concept-gap':
      // Prefer conceptual, calc-none, clear-entry
      filtered = candidates.filter(q =>
        (!q.metadata.cognitiveType || q.metadata.cognitiveType === 'conceptual') &&
        (!q.metadata.calcLoad || q.metadata.calcLoad === 'calc-none')
      );
      break;

    case 'unclear-entry':
      // Prefer strategy-first at student's accuracy level
      filtered = candidates.filter(q =>
        q.metadata.entryPoint === 'strategy-first'
      );
      break;

    case 'calc-error':
      // Prefer calc-moderate or calc-heavy, procedural type
      filtered = candidates.filter(q =>
        q.metadata.calcLoad === 'calc-moderate' ||
        q.metadata.calcLoad === 'calc-heavy' ||
        q.metadata.cognitiveType === 'procedural'
      );
      break;

    case 'time-pressure':
    case 'silly-mistake':
      // No special filtering — serve normally
      return candidates;
  }

  // Fallback to full candidates if filter is too restrictive
  return filtered.length > 0 ? filtered : candidates;
}

function getWeaknessReason(weakness: DominantWeakness, microConcept: string | null, fallback: string): string {
  const mc = microConcept ? microConcept.slice(0, 20) : 'this topic';
  switch (weakness) {
    case 'concept-gap':
      return `Testing your understanding of ${mc}`;
    case 'unclear-entry':
      return 'Practising how to approach this problem';
    case 'calc-error':
      return 'Working through the calculation carefully';
    case 'time-pressure':
    case 'silly-mistake':
      return `Reinforcing ${mc}`;
    default:
      return fallback;
  }
}

// ── V2 Helper: Target difficulty from proficiency ────────────────────────────

function getTargetDifficulty(
  mcProfile: IMicroConceptProfile | null | undefined,
  initialDifficulty?: Difficulty,
): Difficulty {
  if (!mcProfile) return initialDifficulty ?? 'Easy';

  switch (mcProfile.proficiencyLevel) {
    case 'unseen':
    case 'weak':
      return 'Easy';
    case 'developing':
      return 'Medium';
    case 'strong':
      // If dominant weakness exists, stay Medium to drill it
      return mcProfile.dominantWeakness ? 'Medium' : 'Hard';
    case 'mastered':
      return 'Hard';
    default:
      return initialDifficulty ?? 'Medium';
  }
}

function truncReason(reason: string): string {
  return reason.length > 60 ? reason.slice(0, 57) + '…' : reason;
}

// ── Concept level transition logic ────────────────────────────────────────────

export function updateConceptLevel(
  current: ConceptLevel,
  recentFeedback: MicroFeedbackResponse[],
  newFeedback: MicroFeedbackResponse,
  atDifficulty: Difficulty
): ConceptLevel {
  const updated = [...recentFeedback.slice(-4), newFeedback]; // keep last 5

  // Too hard → drop one level (min: weak)
  if (newFeedback === 'too_hard') {
    if (current === 'mastered') return 'strong';
    if (current === 'strong') return 'developing';
    if (current === 'developing') return 'weak';
    return 'weak';
  }

  const positives = updated.filter(f => f === 'got_it' || f === 'too_easy').length;
  const noTooHard = !updated.slice(-5).includes('too_hard');

  if (current === 'unseen') return 'weak';
  if (current === 'weak' && positives >= 2 && noTooHard) return 'developing';
  if (
    current === 'developing' &&
    positives >= 3 &&
    (atDifficulty === 'Medium' || atDifficulty === 'Hard')
  ) return 'strong';
  if (
    current === 'strong' &&
    newFeedback === 'too_easy' &&
    atDifficulty === 'Hard' &&
    updated.filter(f => f === 'too_easy').length >= 2
  ) return 'mastered';

  return current;
}

// ── Utility ───────────────────────────────────────────────────────────────────

function shortConceptName(
  conceptId: string | null,
  input: AdaptiveEngineInput
): string {
  if (!conceptId) return 'concept';
  // Concept name lookup would come from taxonomy — return a trimmed id as fallback
  return conceptId.replace(/_/g, ' ').replace(/^(ch\d+_)/, '').slice(0, 20);
}

// ── Concept baseline helpers ──────────────────────────────────────────────────

export function buildInitialProfileFromBaseline(
  baseline: ConceptBaseline[]
): UserConceptProfile {
  const profile: UserConceptProfile = {};
  for (const b of baseline) {
    profile[b.conceptId] = {
      level: 'weak', // first attempt → weak
      questionsAttempted: b.attempted ? 1 : 0,
      correctCount: b.correct ? 1 : 0,
      recentFeedback: [],
    };
  }
  return profile;
}
