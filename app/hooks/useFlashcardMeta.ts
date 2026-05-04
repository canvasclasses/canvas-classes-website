'use client';

import { useState, useEffect, useCallback } from 'react';
import { localDateString } from '../lib/spacedRepetition';
import { createClient } from '../utils/supabase/client';

const STREAK_KEY = 'canvas_flashcard_streak';
const LAST_CHAPTER_KEY = 'canvas_flashcard_last_chapter';

interface StreakState {
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string; // local-TZ yyyy-mm-dd
    updatedAt?: number;    // ms epoch for cloud last-write-wins
}

const defaultStreak: StreakState = {
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: '',
    updatedAt: 0
};

function isoToday(): string {
    return localDateString();
}

function diffDays(a: string, b: string): number {
    // Parse as local-TZ midnight to avoid the UTC shift bug.
    const [ay, am, ad] = a.split('-').map(Number);
    const [by, bm, bd] = b.split('-').map(Number);
    const d1 = new Date(ay, am - 1, ad);
    const d2 = new Date(by, bm - 1, bd);
    return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

const META_FEATURE_TYPE = 'flashcard_meta';
const META_ITEM_ID = 'streak';

// Mongo is authoritative for streak; Supabase mirrored as a fallback cache.
const MONGO_ENDPOINT = '/api/v2/user/flashcard-progress';

async function isLoggedIn(): Promise<boolean> {
    const supabase = createClient();
    if (!supabase) return false;
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user;
}

async function loadStreakFromCloud(): Promise<StreakState | null> {
    if (!(await isLoggedIn())) return null;
    try {
        const res = await fetch(MONGO_ENDPOINT, { credentials: 'same-origin' });
        if (res.ok) {
            const body = await res.json();
            if (body?.streak) return body.streak as StreakState;
        }
    } catch (err) {
        console.error('Streak Mongo fetch failed:', err);
    }
    // Fallback: Supabase cache.
    const supabase = createClient();
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    const { data, error } = await supabase
        .from('user_progress')
        .select('data')
        .eq('user_id', session.user.id)
        .eq('feature_type', META_FEATURE_TYPE)
        .eq('item_id', META_ITEM_ID)
        .maybeSingle();
    if (error || !data?.data) return null;
    return data.data as StreakState;
}

async function pushStreakToCloud(state: StreakState): Promise<void> {
    if (!(await isLoggedIn())) return;
    let mongoOk = false;
    try {
        const res = await fetch(MONGO_ENDPOINT, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ streak: state })
        });
        mongoOk = res.ok;
        if (!res.ok) console.error('Streak Mongo push failed:', res.status);
    } catch (err) {
        console.error('Streak Mongo push errored:', err);
    }
    // Mirror to Supabase regardless (cache fill or fallback when Mongo failed).
    const supabase = createClient();
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const { error } = await supabase.from('user_progress').upsert(
        {
            user_id: session.user.id,
            feature_type: META_FEATURE_TYPE,
            item_id: META_ITEM_ID,
            data: state,
            mastery_level: null,
            next_review_at: null,
            updated_at: new Date(state.updatedAt ?? Date.now()).toISOString()
        },
        { onConflict: 'user_id, feature_type, item_id' }
    );
    if (error && !mongoOk) console.error('Streak Supabase mirror failed:', error);
}

function mergeStreak(local: StreakState, cloud: StreakState): StreakState {
    // Last-write-wins on updatedAt; fall back to longest streak.
    const localTs = local.updatedAt ?? 0;
    const cloudTs = cloud.updatedAt ?? 0;
    if (cloudTs > localTs) return cloud;
    if (localTs > cloudTs) return local;
    // Same timestamp — keep the better record so users don't lose their streak
    // when they sign in on a new device.
    return {
        currentStreak: Math.max(local.currentStreak, cloud.currentStreak),
        longestStreak: Math.max(local.longestStreak, cloud.longestStreak),
        lastStudyDate: local.lastStudyDate > cloud.lastStudyDate ? local.lastStudyDate : cloud.lastStudyDate,
        updatedAt: localTs
    };
}

export function useFlashcardMeta() {
    const [streak, setStreak] = useState<StreakState>(defaultStreak);
    const [lastChapter, setLastChapterState] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;
        try {
            const s = localStorage.getItem(STREAK_KEY);
            if (s) {
                const parsed: StreakState = JSON.parse(s);
                if (parsed.lastStudyDate) {
                    const gap = diffDays(parsed.lastStudyDate, isoToday());
                    if (gap > 1) parsed.currentStreak = 0;
                }
                if (!cancelled) setStreak(parsed);
            }
            const c = localStorage.getItem(LAST_CHAPTER_KEY);
            if (c && !cancelled) setLastChapterState(c);
        } catch (err) {
            console.error('Error loading flashcard meta:', err);
        }
        if (!cancelled) setIsLoaded(true);

        // Pull cloud copy and merge.
        loadStreakFromCloud()
            .then(cloud => {
                if (cancelled || !cloud) return;
                setStreak(prev => {
                    const merged = mergeStreak(prev, cloud);
                    try {
                        localStorage.setItem(STREAK_KEY, JSON.stringify(merged));
                    } catch (err) {
                        console.error('Streak local persist failed:', err);
                    }
                    // If our local was newer, push it back up.
                    if ((prev.updatedAt ?? 0) > (cloud.updatedAt ?? 0)) {
                        pushStreakToCloud(merged).catch(err => console.error(err));
                    }
                    return merged;
                });
            })
            .catch(err => console.error('Streak cloud load failed:', err));

        return () => {
            cancelled = true;
        };
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
                lastStudyDate: today,
                updatedAt: Date.now()
            };
            try {
                localStorage.setItem(STREAK_KEY, JSON.stringify(next));
            } catch (err) {
                console.error('Streak local persist failed:', err);
            }
            pushStreakToCloud(next).catch(err => console.error('Streak cloud push failed:', err));
            return next;
        });
    }, []);

    const setLastChapter = useCallback((chapterName: string | null) => {
        setLastChapterState(chapterName);
        try {
            if (chapterName) localStorage.setItem(LAST_CHAPTER_KEY, chapterName);
            else localStorage.removeItem(LAST_CHAPTER_KEY);
        } catch (err) {
            console.error('Last chapter persist failed:', err);
        }
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
