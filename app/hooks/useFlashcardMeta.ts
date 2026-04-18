'use client';

import { useState, useEffect, useCallback } from 'react';

const STREAK_KEY = 'canvas_flashcard_streak';
const LAST_CHAPTER_KEY = 'canvas_flashcard_last_chapter';

interface StreakState {
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string; // ISO yyyy-mm-dd
}

const defaultStreak: StreakState = {
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: ''
};

function isoToday(): string {
    return new Date().toISOString().split('T')[0];
}

function diffDays(a: string, b: string): number {
    const d1 = new Date(a);
    const d2 = new Date(b);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export function useFlashcardMeta() {
    const [streak, setStreak] = useState<StreakState>(defaultStreak);
    const [lastChapter, setLastChapterState] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const s = localStorage.getItem(STREAK_KEY);
            if (s) {
                const parsed: StreakState = JSON.parse(s);
                // Break streak if last study was more than 1 day ago
                if (parsed.lastStudyDate) {
                    const gap = diffDays(parsed.lastStudyDate, isoToday());
                    if (gap > 1) {
                        parsed.currentStreak = 0;
                    }
                }
                setStreak(parsed);
            }
            const c = localStorage.getItem(LAST_CHAPTER_KEY);
            if (c) setLastChapterState(c);
        } catch (err) {
            console.error('Error loading flashcard meta:', err);
        }
        setIsLoaded(true);
    }, []);

    const recordStudyToday = useCallback(() => {
        setStreak(prev => {
            const today = isoToday();
            if (prev.lastStudyDate === today) return prev;

            const gap = prev.lastStudyDate ? diffDays(prev.lastStudyDate, today) : Infinity;
            const nextStreak = gap === 1 ? prev.currentStreak + 1 : 1;
            const next: StreakState = {
                currentStreak: nextStreak,
                longestStreak: Math.max(prev.longestStreak, nextStreak),
                lastStudyDate: today
            };
            try {
                localStorage.setItem(STREAK_KEY, JSON.stringify(next));
            } catch {}
            return next;
        });
    }, []);

    const setLastChapter = useCallback((chapterName: string | null) => {
        setLastChapterState(chapterName);
        try {
            if (chapterName) localStorage.setItem(LAST_CHAPTER_KEY, chapterName);
            else localStorage.removeItem(LAST_CHAPTER_KEY);
        } catch {}
    }, []);

    return {
        isLoaded,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastStudyDate: streak.lastStudyDate,
        recordStudyToday,
        lastChapter,
        setLastChapter
    };
}
