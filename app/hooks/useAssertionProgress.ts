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

// Separate storage key for assertion-reason progress (keeps flashcard data separate)
const STORAGE_KEY = 'canvas_assertion_progress';

interface ProgressMap {
    [questionId: string]: CardProgress;
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
 * Hook for managing assertion-reason question progress with LocalStorage persistence
 * Mirrors useCardProgress but with separate storage for assertion-reason questions
 */
export function useAssertionProgress() {
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
            console.error('Error loading assertion progress:', error);
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage whenever progressMap changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
            } catch (error) {
                console.error('Error saving assertion progress:', error);
            }
        }
    }, [progressMap, isLoaded]);

    /**
     * Get progress for a specific question (creates new if doesn't exist)
     */
    const getProgress = useCallback((questionId: string): CardProgress => {
        return progressMap[questionId] || createInitialProgress(questionId);
    }, [progressMap]);

    /**
     * Update progress after answering a question
     */
    const updateProgress = useCallback((questionId: string, quality: QualityRating) => {
        setProgressMap(prev => {
            const currentProgress = prev[questionId] || createInitialProgress(questionId);
            const newProgress = calculateNextReview(currentProgress, quality);
            return { ...prev, [questionId]: newProgress };
        });
    }, []);

    /**
     * Get all questions that are due for review from a list of question IDs
     */
    const getDueCards = useCallback((questionIds: string[]): string[] => {
        return questionIds.filter(questionId => {
            const progress = progressMap[questionId];
            if (!progress) return true; // New questions are always due
            return isCardDue(progress);
        });
    }, [progressMap]);

    /**
     * Sort questions by priority (due first, then by how overdue they are)
     */
    const sortByPriority = useCallback((questionIds: string[]): string[] => {
        return [...questionIds].sort((a, b) => {
            const progressA = progressMap[a];
            const progressB = progressMap[b];

            // New questions get high priority
            if (!progressA && !progressB) return 0;
            if (!progressA) return -1;
            if (!progressB) return 1;

            // Sort by next review date (earlier = higher priority)
            return progressA.nextReviewDate.localeCompare(progressB.nextReviewDate);
        });
    }, [progressMap]);

    /**
     * Get statistics for a list of question IDs
     */
    const getStatistics = useCallback((questionIds: string[]): Statistics => {
        const stats: Statistics = {
            total: questionIds.length,
            new: 0,
            learning: 0,
            reviewing: 0,
            mastered: 0,
            dueToday: 0
        };

        questionIds.forEach(questionId => {
            const progress = progressMap[questionId];
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
     * Reset progress for all questions (for testing/debugging)
     */
    const resetAllProgress = useCallback(() => {
        setProgressMap({});
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    /**
     * Check if any questions have been reviewed
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
