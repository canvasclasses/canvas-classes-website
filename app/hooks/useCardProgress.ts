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
import { syncProgressWithCloud, saveProgressItemToCloud } from '../utils/progressSync';
import { createClient } from '../utils/supabase/client';

const STORAGE_KEY = 'canvas_flashcard_progress';
const FEATURE_TYPE = 'flashcard';

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
 * Hook for managing flashcard progress with LocalStorage persistence AND Supabase Cloud Sync
 */
export function useCardProgress() {
    const [progressMap, setProgressMap] = useState<ProgressMap>({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Initial Load & Sync
    useEffect(() => {
        const loadAndSync = async () => {
            let initialData: ProgressMap = {};

            // 1. Load Local
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    initialData = JSON.parse(stored);
                    setProgressMap(initialData);
                }
            } catch (error) {
                console.error('Error loading flashcard progress:', error);
            }
            setIsLoaded(true);

            // 2. Sync with Cloud
            setIsSyncing(true);
            try {
                const mergedData = await syncProgressWithCloud(FEATURE_TYPE, initialData);

                // Only update if different
                if (JSON.stringify(mergedData) !== JSON.stringify(initialData)) {
                    setProgressMap(mergedData);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedData));
                }
            } catch (err) {
                console.error('Sync failed:', err);
            } finally {
                setIsSyncing(false);
            }
        };

        loadAndSync();
    }, []);

    // Save to LocalStorage whenever progressMap changes (backup)
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

            // Fire and forget cloud save
            saveProgressItemToCloud(FEATURE_TYPE, newProgress);

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
        hasAnyProgress,
        isSyncing
    };
}
