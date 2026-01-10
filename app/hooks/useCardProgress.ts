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

const STORAGE_KEY = 'canvas_flashcard_progress';

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
 * Hook for managing flashcard progress with LocalStorage persistence
 */
export function useCardProgress() {
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
            console.error('Error loading flashcard progress:', error);
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage whenever progressMap changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
            } catch (error) {
                console.error('Error saving flashcard progress:', error);
            }
        }
    }, [progressMap, isLoaded]);

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
     * Reset progress for all cards (for testing/debugging)
     */
    const resetAllProgress = useCallback(() => {
        setProgressMap({});
        localStorage.removeItem(STORAGE_KEY);
    }, []);

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
        getDueCards,
        sortByPriority,
        getStatistics,
        resetAllProgress,
        hasAnyProgress
    };
}
