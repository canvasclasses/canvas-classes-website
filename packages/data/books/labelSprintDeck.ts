// Pure spaced-repetition engine for the Live Book "Bio Deck" (Label Sprint review).
//
// No I/O, no Date.now() inside — every function takes `today` as an ISO date string
// (YYYY-MM-DD) so it is deterministic and unit-testable. The client hook
// (`useBookDeck`) owns persistence (localStorage) and passes the real date in.
//
// A "sprint" = one Label Sprint round, keyed by its interactive_image block id.

export interface SprintProgress {
  level: number;         // 0..MASTERED_LEVEL — position on the spacing curve
  nextDue: string;       // ISO date (YYYY-MM-DD) this sprint next becomes due
  plays: number;
  bestAccuracy: number;  // 0..100
  lastPlayed?: string;   // ISO date
}

export interface DeckState {
  sprints: Record<string, SprintProgress>;
  streak: number;        // consecutive-day review streak
  lastActive?: string;   // ISO date of the last day a due sprint was cleared
  xp: number;            // XP toward the current learner level
  level: number;         // learner level (from accumulated XP)
}

export type SprintStatus = 'new' | 'due' | 'scheduled' | 'mastered';

// Days until a sprint is due again, indexed by review-count (level 1..5).
// Day 1 / 3 / 7 / 14 / 30 curve: 1st correct review → +1d, 2nd → +3d, … 5th → +30d.
export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30];
export const MASTERED_LEVEL = REVIEW_INTERVALS_DAYS.length; // 5
export const PASS_ACCURACY = 80;

// level 0 = new or just-failed → comes back tomorrow; level L≥1 → the L-th interval.
function intervalForLevel(level: number): number {
  if (level <= 0) return 1;
  return REVIEW_INTERVALS_DAYS[Math.min(level, MASTERED_LEVEL) - 1];
}
export const XP_PER_CLEAR = 40;
export const LEVEL_XP = 1000;

export function emptyDeck(): DeckState {
  return { sprints: {}, streak: 0, xp: 0, level: 1 };
}

export function toISODate(now: Date): string {
  return now.toISOString().slice(0, 10);
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00Z').getTime();
  const db = new Date(b + 'T00:00:00Z').getTime();
  return Math.round((db - da) / 86_400_000);
}

export function sprintStatus(p: SprintProgress | undefined, today: string): SprintStatus {
  if (!p) return 'new';
  if (p.nextDue <= today) return 'due';
  if (p.level >= MASTERED_LEVEL) return 'mastered';
  return 'scheduled';
}

export function sprintMastery(p: SprintProgress | undefined): number {
  if (!p) return 0;
  return Math.round((p.level / MASTERED_LEVEL) * 100);
}

// Apply the result of one completed Label Sprint round to the deck (immutably).
export function recordSprintResult(
  deck: DeckState,
  sprintId: string,
  accuracy: number,
  today: string,
): DeckState {
  const prev = deck.sprints[sprintId];
  const passed = accuracy >= PASS_ACCURACY;
  const prevLevel = prev?.level ?? 0;
  // Pass advances one step up the curve; a miss drops back to the start.
  const newLevel = passed ? Math.min(prevLevel + 1, MASTERED_LEVEL) : 0;

  const updated: SprintProgress = {
    level: newLevel,
    nextDue: addDays(today, intervalForLevel(newLevel)),
    plays: (prev?.plays ?? 0) + 1,
    bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, Math.round(accuracy)),
    lastPlayed: today,
  };

  // Streak: clearing a *due* (or brand-new) sprint with a pass counts today as active.
  let streak = deck.streak;
  let lastActive = deck.lastActive;
  const wasDue = !prev || prev.nextDue <= today;
  if (passed && wasDue && lastActive !== today) {
    streak = lastActive && daysBetween(lastActive, today) === 1 ? streak + 1 : 1;
    lastActive = today;
  }

  let xp = deck.xp + (passed ? XP_PER_CLEAR : Math.round(XP_PER_CLEAR / 2));
  let level = deck.level;
  while (xp >= LEVEL_XP) {
    xp -= LEVEL_XP;
    level += 1;
  }

  return {
    ...deck,
    sprints: { ...deck.sprints, [sprintId]: updated },
    streak,
    lastActive,
    xp,
    level,
  };
}

export interface DeckSummary {
  total: number;
  due: number;        // new + past-due (what "Due today" shows)
  scheduled: number;  // learned, not yet due
  mastered: number;   // at the top of the curve
  fresh: number;      // never played
}

export function deckSummary(deck: DeckState, sprintIds: string[], today: string): DeckSummary {
  let due = 0, scheduled = 0, mastered = 0, fresh = 0;
  for (const id of sprintIds) {
    const status = sprintStatus(deck.sprints[id], today);
    if (status === 'new') { fresh += 1; due += 1; }
    else if (status === 'due') due += 1;
    else if (status === 'mastered') mastered += 1;
    else scheduled += 1;
  }
  return { total: sprintIds.length, due, scheduled, mastered, fresh };
}
