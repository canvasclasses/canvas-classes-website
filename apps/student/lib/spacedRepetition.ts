/**
 * Spaced repetition scheduling — FSRS-backed.
 *
 * FSRS (Free Spaced Repetition Scheduler) is the algorithm Anki ships in
 * 2024+ as its default. Compared to SM-2 (which this module used to run),
 * FSRS gives roughly 20–30% fewer reviews for the same retention because it
 * separately models card *stability* (how durable the memory is) and
 * *difficulty* (how hard the user finds the card), instead of a single
 * ease factor.
 *
 * For backward compatibility every existing CardProgress record continues to
 * work — the SM-2 fields (easeFactor, interval, repetitions) are still set
 * so the UI and stats keep rendering, and the FSRS-specific fields are
 * hydrated from those defaults on the first FSRS scheduling pass.
 */

import {
    fsrs,
    createEmptyCard,
    Rating,
    State,
    type Card as FsrsCard,
    type Grade
} from 'ts-fsrs';

export type QualityRating = 0 | 1 | 2 | 3 | 4 | 5;

export interface CardProgress {
    cardId: string;

    // SM-2-era fields, kept for backward compatibility and UI display.
    easeFactor: number;
    interval: number;          // days
    repetitions: number;       // consecutive correct answers
    nextReviewDate: string;    // local-TZ yyyy-mm-dd
    lastReviewDate: string;    // local-TZ yyyy-mm-dd
    totalReviews?: number;
    correctReviews?: number;
    updatedAt?: number;        // ms epoch
    lapses?: number;

    // FSRS state — added in Phase 4. Optional for back-compat with cards
    // serialized before the migration; hydrated on first FSRS pass.
    fsrs?: {
        due: number;              // ms epoch — minute-precision next due time
        stability: number;
        difficulty: number;
        elapsed_days: number;
        scheduled_days: number;
        learning_steps: number;
        reps: number;
        lapses: number;
        state: State;
        last_review?: number;     // ms epoch
    };
}

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

export const NEW_CARDS_PER_DAY = 20;
export const REVIEW_CARDS_PER_DAY = 100;

// Single FSRS instance — defaults are tuned for general study material and
// match Anki's defaults closely enough.
const scheduler = fsrs();

// All date fields use local-timezone yyyy-mm-dd. Converting via toISOString()
// would shift days for users west of UTC.
export function localDateString(d: Date = new Date()): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function parseLocalDate(s: string): Date {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
}

export function createInitialProgress(cardId: string): CardProgress {
    const empty = createEmptyCard(new Date());
    return {
        cardId,
        easeFactor: DEFAULT_EASE_FACTOR,
        interval: 0,
        repetitions: 0,
        nextReviewDate: localDateString(),
        lastReviewDate: '',
        totalReviews: 0,
        correctReviews: 0,
        updatedAt: 0,
        lapses: 0,
        fsrs: serializeFsrs(empty)
    };
}

function serializeFsrs(card: FsrsCard): NonNullable<CardProgress['fsrs']> {
    return {
        due: card.due.getTime(),
        stability: card.stability,
        difficulty: card.difficulty,
        elapsed_days: card.elapsed_days,
        scheduled_days: card.scheduled_days,
        learning_steps: card.learning_steps,
        reps: card.reps,
        lapses: card.lapses,
        state: card.state,
        last_review: card.last_review ? card.last_review.getTime() : undefined
    };
}

function deserializeFsrs(s: NonNullable<CardProgress['fsrs']>): FsrsCard {
    return {
        due: new Date(s.due),
        stability: s.stability,
        difficulty: s.difficulty,
        elapsed_days: s.elapsed_days,
        scheduled_days: s.scheduled_days,
        learning_steps: s.learning_steps ?? 0,
        reps: s.reps,
        lapses: s.lapses,
        state: s.state,
        last_review: s.last_review ? new Date(s.last_review) : undefined
    };
}

// Build an FSRS card from an SM-2-only CardProgress so legacy data can keep
// being scheduled without resetting progress. We use the empty-card defaults
// for stability/difficulty (FSRS will adapt within a couple of reviews) and
// pin reps/lapses/state to what we know from the legacy record.
function migrateLegacyToFsrs(p: CardProgress): FsrsCard {
    const empty = createEmptyCard(new Date());
    let state: State = State.New;
    if (p.repetitions > 0) {
        state = p.lapses && p.lapses > 0 && p.repetitions <= 1 ? State.Relearning : State.Review;
    }
    const due = p.nextReviewDate ? parseLocalDate(p.nextReviewDate) : new Date();
    return {
        ...empty,
        due,
        reps: p.repetitions,
        lapses: p.lapses ?? 0,
        state,
        last_review: p.lastReviewDate ? parseLocalDate(p.lastReviewDate) : undefined
    };
}

function qualityToRating(quality: QualityRating): Grade {
    if (quality < 3) return Rating.Again as Grade;
    if (quality === 3) return Rating.Hard as Grade;
    if (quality === 4) return Rating.Good as Grade;
    return Rating.Easy as Grade;
}

/**
 * Score a review with FSRS and return the updated progress record.
 *
 * The SM-2 fields (easeFactor, interval, repetitions) are kept in sync from
 * FSRS output so older UI code and exports keep working without changes.
 */
export function calculateNextReview(
    progress: CardProgress,
    quality: QualityRating
): CardProgress {
    const today = localDateString();
    const now = new Date();

    const fsrsCard = progress.fsrs ? deserializeFsrs(progress.fsrs) : migrateLegacyToFsrs(progress);
    const log = scheduler.repeat(fsrsCard, now);
    const rating = qualityToRating(quality);
    const result = log[rating];
    const nextFsrs = result.card;

    // Clamp interval to whole days for the legacy SM-2 view of the world.
    const intervalDays = Math.max(0, Math.round(nextFsrs.scheduled_days));

    const newProgress: CardProgress = {
        ...progress,
        lastReviewDate: today,
        interval: intervalDays,
        repetitions: nextFsrs.reps,
        // Approximate easeFactor from FSRS difficulty (1=easy → high EF, 10=hard → low EF).
        easeFactor: Math.max(MIN_EASE_FACTOR, DEFAULT_EASE_FACTOR + (5 - nextFsrs.difficulty) * 0.15),
        nextReviewDate: localDateString(nextFsrs.due),
        totalReviews: (progress.totalReviews ?? 0) + 1,
        correctReviews: (progress.correctReviews ?? 0) + (quality >= 4 ? 1 : 0),
        lapses: nextFsrs.lapses,
        updatedAt: Date.now(),
        fsrs: serializeFsrs(nextFsrs)
    };

    return newProgress;
}

export function daysOverdue(progress: CardProgress): number {
    return -daysUntilReview(progress);
}

export function isCardDue(progress: CardProgress): boolean {
    if (progress.fsrs) {
        return progress.fsrs.due <= Date.now();
    }
    return progress.nextReviewDate <= localDateString();
}

export type MasteryLevel = 'new' | 'learning' | 'reviewing' | 'mastered';

// A card is considered a "leech" if it has been forgotten this many times.
// Anki's default is 8.
export const LEECH_THRESHOLD = 8;

export function isLeech(progress: CardProgress): boolean {
    return (progress.lapses ?? 0) >= LEECH_THRESHOLD;
}

export function getMasteryLevel(progress: CardProgress): MasteryLevel {
    if (progress.fsrs) {
        switch (progress.fsrs.state) {
            case State.New: return 'new';
            case State.Learning: return 'learning';
            case State.Relearning: return 'learning';
            case State.Review:
                // Bucket Review-state cards by stability so the UI keeps the
                // 4-tier breakdown (mastered = stable for at least ~3 weeks).
                return progress.fsrs.stability >= 21 ? 'mastered' : 'reviewing';
        }
    }
    if (progress.repetitions === 0) return 'new';
    if (progress.interval < 2) return 'learning';
    if (progress.interval < 6) return 'reviewing';
    return 'mastered';
}

export function getMasteryColor(level: MasteryLevel): string {
    switch (level) {
        case 'new': return 'slate';
        case 'learning': return 'amber';
        case 'reviewing': return 'blue';
        case 'mastered': return 'emerald';
    }
}

export function daysUntilReview(progress: CardProgress): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let reviewDate: Date;
    if (progress.fsrs) {
        reviewDate = new Date(progress.fsrs.due);
        reviewDate.setHours(0, 0, 0, 0);
    } else {
        reviewDate = parseLocalDate(progress.nextReviewDate);
    }
    const diffTime = reviewDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Exported for tests / leech detector / observability.
export { State as FsrsState, Rating as FsrsRating };
