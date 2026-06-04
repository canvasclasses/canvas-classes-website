import { ContentBlock, PracticeQuestion, PracticeConceptTag } from '../types/books';
import { flattenBlocks } from './utils';

/**
 * Adaptive practice — a lightweight, book-scoped question selector.
 *
 * This is deliberately NOT the Crucible adaptive engine: that engine lives in a
 * protected app path, is bound to the questions_v2 schema + StudentChapterProfile,
 * and can't be imported from a package anyway. This selector borrows only the
 * *shape* (difficulty ladder on streaks, concept rotation, spaced review of
 * earlier material) over the book's own practice questions + the student's
 * cumulative attempt history. Pure functions, no I/O, no Date.now/random — so it
 * is unit-testable and deterministic.
 */

export interface PracticeAttemptStat {
  question_id: string;
  concept_tag: string;
  difficulty: number;
  correct: boolean;
  chapter_number: number;
}

/** A bank question tagged with the chapter it came from (for cumulative review). */
export interface BankQuestion extends PracticeQuestion {
  chapter_number: number;
}

export interface PracticeSessionConfig {
  /** Every practice question across the book (harvested from all chapter_practice blocks). */
  bank: BankQuestion[];
  currentChapter: number;
  history: PracticeAttemptStat[];
  sessionSize: number;
  /** Inject one spaced-review question from an earlier chapter every Nth pick. */
  reviewEvery?: number;
}

export interface PracticeRuntimeState {
  config: PracticeSessionConfig;
  askedIds: string[];
  targetDifficulty: number;   // 1–5
  streak: number;             // consecutive correct
  lastConceptTag: string | null;
  servedCount: number;
}

const MIN_DIFF = 1;
const MAX_DIFF = 5;

/** Starting difficulty from the student's cumulative accuracy (all chapters). */
function startingDifficulty(history: PracticeAttemptStat[]): number {
  if (history.length === 0) return 2;
  const correct = history.filter((h) => h.correct).length;
  const acc = correct / history.length;
  if (acc >= 0.85) return 4;
  if (acc >= 0.65) return 3;
  if (acc >= 0.4) return 2;
  return 1;
}

/** Concepts the student has been weakest on, worst first — used to break ties. */
function weakConcepts(history: PracticeAttemptStat[]): Map<string, number> {
  const seen = new Map<string, number>();
  const wrong = new Map<string, number>();
  for (const h of history) {
    seen.set(h.concept_tag, (seen.get(h.concept_tag) ?? 0) + 1);
    if (!h.correct) wrong.set(h.concept_tag, (wrong.get(h.concept_tag) ?? 0) + 1);
  }
  const rate = new Map<string, number>();
  for (const [tag, n] of seen) rate.set(tag, (wrong.get(tag) ?? 0) / n);
  return rate;
}

export function initPracticeSession(config: PracticeSessionConfig): PracticeRuntimeState {
  return {
    config,
    askedIds: [],
    targetDifficulty: startingDifficulty(config.history),
    streak: 0,
    lastConceptTag: null,
    servedCount: 0,
  };
}

/** Pick the candidate closest to target difficulty, preferring a fresh concept
 *  and (tie-break) the student's weaker concepts, then stable id order. */
function pickClosest(
  candidates: BankQuestion[],
  target: number,
  lastConcept: string | null,
  weak: Map<string, number>
): BankQuestion | null {
  if (candidates.length === 0) return null;
  const scored = candidates
    .map((q) => ({
      q,
      diffGap: Math.abs(q.difficulty - target),
      sameConcept: q.concept_tag === lastConcept ? 1 : 0,
      weakness: weak.get(q.concept_tag) ?? 0,
    }))
    .sort((a, b) =>
      a.diffGap - b.diffGap ||
      a.sameConcept - b.sameConcept ||      // avoid repeating the last concept
      b.weakness - a.weakness ||            // prefer weaker concepts
      a.q.id.localeCompare(b.q.id)          // stable deterministic tiebreak
    );
  return scored[0].q;
}

/**
 * Returns the next question to serve, plus the advanced state. Returns null when
 * the session is complete (size reached or bank exhausted). Difficulty for the
 * *next* call is set by recordPracticeAnswer based on the student's answer.
 */
export function nextPracticeQuestion(
  state: PracticeRuntimeState
): { question: BankQuestion; state: PracticeRuntimeState } | null {
  const { config } = state;
  if (state.servedCount >= config.sessionSize) return null;

  const asked = new Set(state.askedIds);
  const weak = weakConcepts(config.history);
  const reviewEvery = config.reviewEvery ?? 3;

  const currentPool = config.bank.filter(
    (q) => q.chapter_number === config.currentChapter && !asked.has(q.id)
  );
  const reviewPool = config.bank.filter(
    (q) => q.chapter_number < config.currentChapter && !asked.has(q.id)
  );

  // Every Nth served question is a spaced-review item from an earlier chapter,
  // if any exist (none for Chapter 1 — it simply draws from the current pool).
  const wantReview =
    reviewPool.length > 0 && state.servedCount > 0 && state.servedCount % reviewEvery === 0;

  let chosen =
    (wantReview ? pickClosest(reviewPool, state.targetDifficulty, state.lastConceptTag, weak) : null) ??
    pickClosest(currentPool, state.targetDifficulty, state.lastConceptTag, weak) ??
    pickClosest(reviewPool, state.targetDifficulty, state.lastConceptTag, weak);

  if (!chosen) return null;

  return {
    question: chosen,
    state: {
      ...state,
      askedIds: [...state.askedIds, chosen.id],
      lastConceptTag: chosen.concept_tag,
      servedCount: state.servedCount + 1,
    },
  };
}

/** Update the difficulty ladder + streak after the student answers. */
export function recordPracticeAnswer(
  state: PracticeRuntimeState,
  correct: boolean
): PracticeRuntimeState {
  if (correct) {
    const streak = state.streak + 1;
    // Climb after two correct in a row; one-off correct holds difficulty.
    const targetDifficulty = streak >= 2 ? Math.min(MAX_DIFF, state.targetDifficulty + 1) : state.targetDifficulty;
    return { ...state, streak, targetDifficulty };
  }
  return { ...state, streak: 0, targetDifficulty: Math.max(MIN_DIFF, state.targetDifficulty - 1) };
}

/**
 * Harvest every practice question across a set of pages' blocks, tagged with
 * its chapter. Mirrors harvestVocabulary — single source of truth is the
 * authored content. `pageChapter` maps each page to its chapter number.
 */
export function harvestPractice(
  blocks: ContentBlock[],
  chapterNumber: number
): BankQuestion[] {
  const out: BankQuestion[] = [];
  for (const block of flattenBlocks(blocks)) {
    if (block.type === 'chapter_practice') {
      const chapter = block.chapter_number ?? chapterNumber;
      for (const q of block.questions ?? []) {
        out.push({ ...q, chapter_number: chapter });
      }
    }
  }
  return out;
}

export type { PracticeConceptTag };
