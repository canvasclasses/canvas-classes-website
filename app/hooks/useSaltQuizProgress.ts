'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    CardProgress,
    QualityRating,
    createInitialProgress,
    calculateNextReview,
    isCardDue,
    getMasteryLevel,
    MasteryLevel
} from '../lib/spacedRepetition';

// Separate storage keys for MCQs and Flashcards
const MCQ_STORAGE_KEY = 'canvas_salt_quiz_mcq_progress';
const FLASHCARD_STORAGE_KEY = 'canvas_salt_quiz_flashcard_progress';

interface ProgressMap {
    [cardId: string]: CardProgress;
}

interface Statistics {
    total: number;
    new: number;
    learning: number;
    reviewing: number;
    mastered: number;
    dueToday: number;
}

/**
 * Hook for managing Salt Analysis quiz progress with LocalStorage persistence
 * Supports both MCQ questions and Mastery flashcards with separate storage
 */
export function useSaltQuizProgress(type: 'mcq' | 'flashcard' = 'mcq') {
    const STORAGE_KEY = type === 'mcq' ? MCQ_STORAGE_KEY : FLASHCARD_STORAGE_KEY;

    const [progressMap, setProgressMap] = useState<ProgressMap>({});
    const [isLoaded, setIsLoaded] = useState(false);

    // Load progress from LocalStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setProgressMap(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading salt quiz progress:', error);
        }
        setIsLoaded(true);
    }, [STORAGE_KEY]);

    // Save to LocalStorage whenever progressMap changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
            } catch (error) {
                console.error('Error saving salt quiz progress:', error);
            }
        }
    }, [progressMap, isLoaded, STORAGE_KEY]);

    /**
     * Get progress for a specific card (creates new if doesn't exist)
     */
    const getProgress = useCallback((cardId: string): CardProgress => {
        return progressMap[cardId] || createInitialProgress(cardId);
    }, [progressMap]);

    /**
     * Update progress after reviewing a card
     */
    const updateProgress = useCallback((cardId: string, quality: QualityRating) => {
        setProgressMap(prev => {
            const currentProgress = prev[cardId] || createInitialProgress(cardId);
            const newProgress = calculateNextReview(currentProgress, quality);
            return { ...prev, [cardId]: newProgress };
        });
    }, []);

    /**
     * Simple correct/incorrect update (maps to quality 4 or 1)
     */
    const recordAnswer = useCallback((cardId: string, isCorrect: boolean) => {
        const quality: QualityRating = isCorrect ? 4 : 1;
        updateProgress(cardId, quality);
    }, [updateProgress]);

    /**
     * Get all cards that are due for review from a list of card IDs
     */
    const getDueCards = useCallback((cardIds: string[]): string[] => {
        return cardIds.filter(cardId => {
            const progress = progressMap[cardId];
            if (!progress) return true; // New cards are always due
            return isCardDue(progress);
        });
    }, [progressMap]);

    /**
     * Get cards that are new (never reviewed)
     */
    const getNewCards = useCallback((cardIds: string[]): string[] => {
        return cardIds.filter(cardId => !progressMap[cardId]);
    }, [progressMap]);

    /**
     * Get mastered cards
     */
    const getMasteredCards = useCallback((cardIds: string[]): string[] => {
        return cardIds.filter(cardId => {
            const progress = progressMap[cardId];
            if (!progress) return false;
            return getMasteryLevel(progress) === 'mastered';
        });
    }, [progressMap]);

    /**
     * Sort cards by priority (due first, then by how overdue they are)
     */
    const sortByPriority = useCallback((cardIds: string[]): string[] => {
        return [...cardIds].sort((a, b) => {
            const progressA = progressMap[a];
            const progressB = progressMap[b];

            // New cards get high priority
            if (!progressA && !progressB) return 0;
            if (!progressA) return -1;
            if (!progressB) return 1;

            // Sort by next review date (earlier = higher priority)
            return progressA.nextReviewDate.localeCompare(progressB.nextReviewDate);
        });
    }, [progressMap]);

    /**
     * Get a random selection of cards, prioritizing due and new cards
     */
    const getRandomSelection = useCallback((cardIds: string[], count: number): string[] => {
        const dueCards = getDueCards(cardIds);
        const sorted = sortByPriority(dueCards);

        // If we have enough due cards, just shuffle and take
        if (sorted.length >= count) {
            // Shuffle the due cards
            const shuffled = [...sorted].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, count);
        }

        // Otherwise, take all due cards and fill with random non-due cards
        const nonDueCards = cardIds.filter(id => !dueCards.includes(id));
        const shuffledNonDue = [...nonDueCards].sort(() => Math.random() - 0.5);
        const remaining = count - sorted.length;

        return [...sorted, ...shuffledNonDue.slice(0, remaining)];
    }, [getDueCards, sortByPriority]);

    /**
     * Get statistics for a list of card IDs
     */
    const getStatistics = useCallback((cardIds: string[]): Statistics => {
        const stats: Statistics = {
            total: cardIds.length,
            new: 0,
            learning: 0,
            reviewing: 0,
            mastered: 0,
            dueToday: 0
        };

        cardIds.forEach(cardId => {
            const progress = progressMap[cardId];
            if (!progress) {
                stats.new++;
                stats.dueToday++;
                return;
            }

            const level = getMasteryLevel(progress);
            stats[level]++;

            if (isCardDue(progress)) {
                stats.dueToday++;
            }
        });

        return stats;
    }, [progressMap]);

    /**
     * Get mastery level for a specific card
     */
    const getCardMasteryLevel = useCallback((cardId: string): MasteryLevel => {
        const progress = progressMap[cardId];
        if (!progress) return 'new';
        return getMasteryLevel(progress);
    }, [progressMap]);

    /**
     * Reset progress for all cards
     */
    const resetAllProgress = useCallback(() => {
        setProgressMap({});
        localStorage.removeItem(STORAGE_KEY);
    }, [STORAGE_KEY]);

    /**
     * Check if any cards have been reviewed
     */
    const hasAnyProgress = useCallback((): boolean => {
        return Object.keys(progressMap).length > 0;
    }, [progressMap]);

    return {
        isLoaded,
        getProgress,
        updateProgress,
        recordAnswer,
        getDueCards,
        getNewCards,
        getMasteredCards,
        sortByPriority,
        getRandomSelection,
        getStatistics,
        getCardMasteryLevel,
        resetAllProgress,
        hasAnyProgress
    };
}
