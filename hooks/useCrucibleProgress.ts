'use client';

import { useState, useEffect, useCallback } from 'react';

// Types for progress tracking
export interface QuestionProgress {
    questionId: string;
    chapterId: string;
    difficulty: string;
    isCorrect: boolean;
    attemptedAt: number; // timestamp
}

export interface ChapterStats {
    total: number;
    attempted: number;
    correct: number;
    incorrect: number;
    accuracy: number;
}

export interface CrucibleProgress {
    questionHistory: Record<string, QuestionProgress>; // questionId -> last attempt
    totalAttempted: number;
    totalCorrect: number;
    totalIncorrect: number;
    currentStreak: number;
    bestStreak: number;
    lastSessionDate: string;
    chapterStats: Record<string, ChapterStats>;
}

const STORAGE_KEY = 'crucible_progress';

const DEFAULT_PROGRESS: CrucibleProgress = {
    questionHistory: {},
    totalAttempted: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastSessionDate: '',
    chapterStats: {},
};

export function useCrucibleProgress() {
    const [progress, setProgress] = useState<CrucibleProgress>(DEFAULT_PROGRESS);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load progress from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as CrucibleProgress;
                setProgress(parsed);
            }
        } catch (error) {
            console.error('Failed to load Crucible progress:', error);
        }
        setIsLoaded(true);
    }, []);

    // Save progress to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
            } catch (error) {
                console.error('Failed to save Crucible progress:', error);
            }
        }
    }, [progress, isLoaded]);

    // Record a question attempt
    const recordAttempt = useCallback((
        questionId: string,
        chapterId: string,
        difficulty: string,
        isCorrect: boolean
    ) => {
        setProgress(prev => {
            const isFirstAttempt = !prev.questionHistory[questionId];
            const wasCorrectBefore = prev.questionHistory[questionId]?.isCorrect || false;

            // Update question history
            const newQuestionHistory = {
                ...prev.questionHistory,
                [questionId]: {
                    questionId,
                    chapterId,
                    difficulty,
                    isCorrect,
                    attemptedAt: Date.now(),
                },
            };

            // Calculate new totals (only count first attempts for totals)
            let newTotalAttempted = prev.totalAttempted;
            let newTotalCorrect = prev.totalCorrect;
            let newTotalIncorrect = prev.totalIncorrect;

            if (isFirstAttempt) {
                newTotalAttempted += 1;
                if (isCorrect) {
                    newTotalCorrect += 1;
                } else {
                    newTotalIncorrect += 1;
                }
            } else {
                // Re-attempt: update correct/incorrect counts
                if (wasCorrectBefore !== isCorrect) {
                    if (isCorrect) {
                        newTotalCorrect += 1;
                        newTotalIncorrect -= 1;
                    } else {
                        newTotalCorrect -= 1;
                        newTotalIncorrect += 1;
                    }
                }
            }

            // Update streak
            let newCurrentStreak = isCorrect ? prev.currentStreak + 1 : 0;
            let newBestStreak = Math.max(prev.bestStreak, newCurrentStreak);

            // Update chapter stats
            const chapterStats = { ...prev.chapterStats };
            if (!chapterStats[chapterId]) {
                chapterStats[chapterId] = {
                    total: 0,
                    attempted: 0,
                    correct: 0,
                    incorrect: 0,
                    accuracy: 0,
                };
            }

            if (isFirstAttempt) {
                chapterStats[chapterId].attempted += 1;
                if (isCorrect) {
                    chapterStats[chapterId].correct += 1;
                } else {
                    chapterStats[chapterId].incorrect += 1;
                }
            } else if (wasCorrectBefore !== isCorrect) {
                if (isCorrect) {
                    chapterStats[chapterId].correct += 1;
                    chapterStats[chapterId].incorrect -= 1;
                } else {
                    chapterStats[chapterId].correct -= 1;
                    chapterStats[chapterId].incorrect += 1;
                }
            }

            // Recalculate accuracy
            if (chapterStats[chapterId].attempted > 0) {
                chapterStats[chapterId].accuracy = Math.round(
                    (chapterStats[chapterId].correct / chapterStats[chapterId].attempted) * 100
                );
            }

            return {
                ...prev,
                questionHistory: newQuestionHistory,
                totalAttempted: newTotalAttempted,
                totalCorrect: newTotalCorrect,
                totalIncorrect: newTotalIncorrect,
                currentStreak: newCurrentStreak,
                bestStreak: newBestStreak,
                lastSessionDate: new Date().toISOString().split('T')[0],
                chapterStats,
            };
        });
    }, []);

    // Initialize chapter totals from question data
    const initializeChapterTotals = useCallback((questions: { id: string; chapterId?: string }[]) => {
        setProgress(prev => {
            const chapterStats = { ...prev.chapterStats };

            // Count total questions per chapter
            const chapterCounts: Record<string, number> = {};
            questions.forEach(q => {
                const chapter = q.chapterId || 'Unknown';
                chapterCounts[chapter] = (chapterCounts[chapter] || 0) + 1;
            });

            // Update totals in chapter stats
            Object.entries(chapterCounts).forEach(([chapter, count]) => {
                if (!chapterStats[chapter]) {
                    chapterStats[chapter] = {
                        total: count,
                        attempted: 0,
                        correct: 0,
                        incorrect: 0,
                        accuracy: 0,
                    };
                } else {
                    chapterStats[chapter].total = count;
                }
            });

            return { ...prev, chapterStats };
        });
    }, []);

    // Get stats for a specific chapter
    const getChapterStats = useCallback((chapterId: string): ChapterStats => {
        return progress.chapterStats[chapterId] || {
            total: 0,
            attempted: 0,
            correct: 0,
            incorrect: 0,
            accuracy: 0,
        };
    }, [progress.chapterStats]);

    // Check if a question was already attempted
    const isQuestionAttempted = useCallback((questionId: string): boolean => {
        return Boolean(progress.questionHistory[questionId]);
    }, [progress.questionHistory]);

    // Get previous result for a question
    const getQuestionResult = useCallback((questionId: string): boolean | null => {
        const entry = progress.questionHistory[questionId];
        return entry ? entry.isCorrect : null;
    }, [progress.questionHistory]);

    // Calculate overall accuracy
    const overallAccuracy = progress.totalAttempted > 0
        ? Math.round((progress.totalCorrect / progress.totalAttempted) * 100)
        : 0;

    // Reset all progress
    const resetProgress = useCallback(() => {
        setProgress(DEFAULT_PROGRESS);
    }, []);

    return {
        progress,
        isLoaded,
        recordAttempt,
        initializeChapterTotals,
        getChapterStats,
        isQuestionAttempted,
        getQuestionResult,
        overallAccuracy,
        resetProgress,
    };
}
