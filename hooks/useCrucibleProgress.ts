'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/app/utils/supabase/client';

// Types for progress tracking
export interface QuestionProgress {
    questionId: string;
    chapterId: string;
    difficulty: string;
    isCorrect: boolean;
    attemptedAt: number;
}

export interface ChapterStats {
    total: number;
    attempted: number;
    correct: number;
    incorrect: number;
    accuracy: number;
}

export interface CrucibleProgress {
    questionHistory: Record<string, QuestionProgress>;
    totalAttempted: number;
    totalCorrect: number;
    totalIncorrect: number;
    currentStreak: number;
    bestStreak: number;
    lastSessionDate: string;
    chapterStats: Record<string, ChapterStats>;
    starredIds: string[];
    masteredIds: string[];
    userNotes: Record<string, string>;
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
    starredIds: [],
    masteredIds: [],
    userNotes: {},
};

export function useCrucibleProgress() {
    const [progress, setProgress] = useState<CrucibleProgress>(DEFAULT_PROGRESS);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Check auth status and load progress
    useEffect(() => {
        const initializeProgress = async () => {
            // Load local progress first
            let localProgress = DEFAULT_PROGRESS;
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    localProgress = JSON.parse(stored) as CrucibleProgress;
                    setProgress(localProgress);
                }
            } catch (error) {
                console.error('Failed to load local Crucible progress:', error);
            }

            // Check if user is logged in
            const supabase = createClient();
            if (supabase) {
                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) {
                        setUserId(session.user.id);
                        // Sync with cloud
                        await syncFromCloud(session.user.id, localProgress);
                    }
                } catch (error) {
                    console.error('Failed to check auth:', error);
                }
            }

            setIsLoaded(true);
        };

        initializeProgress();
    }, []);

    // Sync from cloud and merge with local data
    const syncFromCloud = async (uid: string, localData: CrucibleProgress) => {
        setIsSyncing(true);
        try {
            // Fetch cloud progress from our MongoDB API
            const response = await fetch('/api/activity/log', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Error fetching cloud progress:', response.statusText);
                return;
            }

            const data = await response.json();

            // Transform MongoDB format to CrucibleProgress format if needed
            // The API returns { masteryMap, stats, summary }
            // We need to map this back to our local state structure

            // For now, let's trust the local storage as primary for session data (like question status)
            // but use cloud stats for total counts if they are higher.
            // And definitely use mastery map.

            const cloudStats = data.stats || {};
            const cloudMastery = data.masteryMap || {};

            const masteredIds = Object.keys(cloudMastery).filter(k => cloudMastery[k].status === 'GREEN');

            // Merge strategy: take higher values for stats
            const merged: CrucibleProgress = {
                ...localData,
                totalAttempted: Math.max(cloudStats.total_questions_attempted || 0, localData.totalAttempted || 0),
                totalCorrect: Math.max(cloudStats.total_correct || 0, localData.totalCorrect || 0),
                currentStreak: localData.currentStreak || cloudStats.current_streak || 0,
                bestStreak: Math.max(cloudStats.best_streak || 0, localData.bestStreak || 0),
                masteredIds: [...new Set([...masteredIds, ...(localData.masteredIds || [])])],
            };

            setProgress(merged);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

        } catch (err) {
            console.error('Cloud sync error:', err);
        } finally {
            setIsSyncing(false);
        }
    };

    // Save to cloud (deprecated - handled by Activity Logger)
    const saveToCloud = useCallback(async (data: CrucibleProgress) => {
        // We no longer save directly to Supabase from here.
        // Activity Logger handles all writes to MongoDB via /api/activity/log
    }, []);

    // Debounced cloud save
    const debouncedCloudSave = useCallback((data: CrucibleProgress) => {
        if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
        }
        syncTimeoutRef.current = setTimeout(() => {
            saveToCloud(data);
        }, 2000); // Save after 2 seconds of inactivity
    }, [saveToCloud]);

    // Save progress to localStorage and trigger cloud sync
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
                if (userId) {
                    debouncedCloudSave(progress);
                }
            } catch (error) {
                console.error('Failed to save Crucible progress:', error);
            }
        }
    }, [progress, isLoaded, userId, debouncedCloudSave]);

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

            let newTotalAttempted = prev.totalAttempted;
            let newTotalCorrect = prev.totalCorrect;
            let newTotalIncorrect = prev.totalIncorrect;

            if (isFirstAttempt) {
                newTotalAttempted += 1;
                if (isCorrect) newTotalCorrect += 1;
                else newTotalIncorrect += 1;
            } else if (wasCorrectBefore !== isCorrect) {
                if (isCorrect) {
                    newTotalCorrect += 1;
                    newTotalIncorrect -= 1;
                } else {
                    newTotalCorrect -= 1;
                    newTotalIncorrect += 1;
                }
            }

            const newCurrentStreak = isCorrect ? prev.currentStreak + 1 : 0;
            const newBestStreak = Math.max(prev.bestStreak, newCurrentStreak);

            const chapterStats = { ...prev.chapterStats };
            if (!chapterStats[chapterId]) {
                chapterStats[chapterId] = { total: 0, attempted: 0, correct: 0, incorrect: 0, accuracy: 0 };
            }

            if (isFirstAttempt) {
                chapterStats[chapterId].attempted += 1;
                if (isCorrect) chapterStats[chapterId].correct += 1;
                else chapterStats[chapterId].incorrect += 1;
            } else if (wasCorrectBefore !== isCorrect) {
                if (isCorrect) {
                    chapterStats[chapterId].correct += 1;
                    chapterStats[chapterId].incorrect -= 1;
                } else {
                    chapterStats[chapterId].correct -= 1;
                    chapterStats[chapterId].incorrect += 1;
                }
            }

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

    // Initialize chapter totals
    const initializeChapterTotals = useCallback((questions: { id: string; chapterId?: string }[]) => {
        setProgress(prev => {
            const chapterStats = { ...prev.chapterStats };
            const chapterCounts: Record<string, number> = {};

            questions.forEach(q => {
                const chapter = q.chapterId || 'Unknown';
                chapterCounts[chapter] = (chapterCounts[chapter] || 0) + 1;
            });

            Object.entries(chapterCounts).forEach(([chapter, count]) => {
                if (!chapterStats[chapter]) {
                    chapterStats[chapter] = { total: count, attempted: 0, correct: 0, incorrect: 0, accuracy: 0 };
                } else {
                    chapterStats[chapter].total = count;
                }
            });

            return { ...prev, chapterStats };
        });
    }, []);

    const getChapterStats = useCallback((chapterId: string): ChapterStats => {
        return progress.chapterStats[chapterId] || { total: 0, attempted: 0, correct: 0, incorrect: 0, accuracy: 0 };
    }, [progress.chapterStats]);

    const isQuestionAttempted = useCallback((questionId: string): boolean => {
        return Boolean(progress.questionHistory[questionId]);
    }, [progress.questionHistory]);

    const getQuestionResult = useCallback((questionId: string): boolean | null => {
        const entry = progress.questionHistory[questionId];
        return entry ? entry.isCorrect : null;
    }, [progress.questionHistory]);

    const overallAccuracy = progress.totalAttempted > 0
        ? Math.round((progress.totalCorrect / progress.totalAttempted) * 100)
        : 0;

    const resetProgress = useCallback(() => {
        setProgress(DEFAULT_PROGRESS);
        if (userId) {
            saveToCloud(DEFAULT_PROGRESS);
        }
    }, [userId, saveToCloud]);

    const toggleStar = useCallback((questionId: string) => {
        setProgress(prev => {
            const starred = prev.starredIds || [];
            const isStarred = starred.includes(questionId);
            return {
                ...prev,
                starredIds: isStarred
                    ? starred.filter(id => id !== questionId)
                    : [...starred, questionId]
            };
        });
    }, []);

    const toggleMaster = useCallback((questionId: string) => {
        setProgress(prev => {
            const mastered = prev.masteredIds || [];
            const isMastered = mastered.includes(questionId);
            return {
                ...prev,
                masteredIds: isMastered
                    ? mastered.filter(id => id !== questionId)
                    : [...mastered, questionId]
            };
        });
    }, []);

    const saveNote = useCallback((questionId: string, note: string) => {
        setProgress(prev => ({
            ...prev,
            userNotes: {
                ...(prev.userNotes || {}),
                [questionId]: note
            }
        }));
    }, []);

    return {
        progress,
        isLoaded,
        isSyncing,
        isLoggedIn: !!userId,
        recordAttempt,
        initializeChapterTotals,
        getChapterStats,
        isQuestionAttempted,
        getQuestionResult,
        overallAccuracy,
        resetProgress,
        toggleStar,
        toggleMaster,
        saveNote,
    };
}
