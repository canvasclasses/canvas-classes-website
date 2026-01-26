/**
 * SM-2 Spaced Repetition Algorithm
 * 
 * Based on the SuperMemo 2 algorithm for calculating optimal review intervals.
 * Quality ratings: 0-2 = fail (reset), 3 = hard, 4 = good, 5 = easy
 */

export interface CardProgress {
    cardId: string;
    easeFactor: number;      // Default 2.5, minimum 1.3
    interval: number;        // Days until next review
    repetitions: number;     // Consecutive correct answers
    nextReviewDate: string;  // ISO date string
    lastReviewDate: string;  // ISO date string
}

export type QualityRating = 0 | 1 | 2 | 3 | 4 | 5;

// Minimum ease factor to prevent cards from becoming too difficult
const MIN_EASE_FACTOR = 1.3;

// Default ease factor for new cards
const DEFAULT_EASE_FACTOR = 2.5;

/**
 * Create initial progress for a new card
 */
export function createInitialProgress(cardId: string): CardProgress {
    return {
        cardId,
        easeFactor: DEFAULT_EASE_FACTOR,
        interval: 0,
        repetitions: 0,
        nextReviewDate: new Date().toISOString().split('T')[0],
        lastReviewDate: ''
    };
}

/**
 * Calculate the next review state using SM-2 algorithm
 * 
 * @param progress - Current card progress
 * @param quality - Quality of recall (0-5)
 * @returns Updated card progress
 */
export function calculateNextReview(
    progress: CardProgress,
    quality: QualityRating
): CardProgress {
    const today = new Date().toISOString().split('T')[0];

    // Clone the progress object
    const newProgress: CardProgress = { ...progress, lastReviewDate: today };

    if (quality >= 3) {
        // Correct response - update interval
        if (newProgress.repetitions === 0) {
            newProgress.interval = 1;
        } else if (newProgress.repetitions === 1) {
            newProgress.interval = 6;
        } else {
            // SM-2 formula: interval = previous_interval * ease_factor
            newProgress.interval = Math.round(progress.interval * progress.easeFactor);
        }
        newProgress.repetitions += 1;
    } else {
        // Incorrect response - reset to beginning
        newProgress.repetitions = 0;
        newProgress.interval = 1;
    }

    // Update ease factor using SM-2 formula
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    const efChange = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
    newProgress.easeFactor = Math.max(MIN_EASE_FACTOR, progress.easeFactor + efChange);

    // Calculate next review date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + newProgress.interval);
    newProgress.nextReviewDate = nextDate.toISOString().split('T')[0];

    return newProgress;
}

/**
 * Check if a card is due for review
 */
export function isCardDue(progress: CardProgress): boolean {
    const today = new Date().toISOString().split('T')[0];
    return progress.nextReviewDate <= today;
}

/**
 * Get the mastery level of a card based on interval
 */
export type MasteryLevel = 'new' | 'learning' | 'reviewing' | 'mastered';

export function getMasteryLevel(progress: CardProgress): MasteryLevel {
    if (progress.repetitions === 0) return 'new';
    if (progress.interval < 2) return 'learning';
    if (progress.interval < 6) return 'reviewing';
    return 'mastered';
}

/**
 * Get color for mastery level (for UI)
 */
export function getMasteryColor(level: MasteryLevel): string {
    switch (level) {
        case 'new': return 'slate';
        case 'learning': return 'amber';
        case 'reviewing': return 'blue';
        case 'mastered': return 'emerald';
    }
}

/**
 * Calculate days until next review (can be negative if overdue)
 */
export function daysUntilReview(progress: CardProgress): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reviewDate = new Date(progress.nextReviewDate);
    reviewDate.setHours(0, 0, 0, 0);
    const diffTime = reviewDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
