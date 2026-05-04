'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '../utils/supabase/client';
import { NEW_CARDS_PER_DAY, REVIEW_CARDS_PER_DAY } from '../lib/spacedRepetition';

const STORAGE_KEY = 'canvas_flashcard_settings';
const ENDPOINT = '/api/v2/user/flashcard-progress';

export interface PerDeckSettings {
    newCardsPerDay?: number;
    reviewCardsPerDay?: number;
}

export interface FlashcardSettings {
    newCardsPerDay?: number;       // global default override
    reviewCardsPerDay?: number;
    perDeck?: Record<string, PerDeckSettings>;
}

const defaultSettings: FlashcardSettings = {};

function safeRead(): FlashcardSettings {
    if (typeof window === 'undefined') return defaultSettings;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as FlashcardSettings) : defaultSettings;
    } catch {
        return defaultSettings;
    }
}

function safeWrite(s: FlashcardSettings) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch (err) {
        console.error('Settings persist failed:', err);
    }
}

async function isLoggedIn(): Promise<boolean> {
    const supabase = createClient();
    if (!supabase) return false;
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user;
}

async function pushSettings(s: FlashcardSettings): Promise<void> {
    if (!(await isLoggedIn())) return;
    try {
        await fetch(ENDPOINT, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ settings: s })
        });
    } catch (err) {
        console.error('Settings cloud push failed:', err);
    }
}

async function pullSettings(): Promise<FlashcardSettings | null> {
    if (!(await isLoggedIn())) return null;
    try {
        const res = await fetch(ENDPOINT, { credentials: 'same-origin' });
        if (!res.ok) return null;
        const body = await res.json();
        return (body?.settings as FlashcardSettings | null) ?? null;
    } catch (err) {
        console.error('Settings cloud fetch failed:', err);
        return null;
    }
}

export function useFlashcardSettings() {
    const [settings, setSettings] = useState<FlashcardSettings>(defaultSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const local = safeRead();
        if (!cancelled) {
            setSettings(local);
            setIsLoaded(true);
        }
        pullSettings().then(remote => {
            if (cancelled || !remote) return;
            setSettings(remote);
            safeWrite(remote);
        }).catch(err => console.error(err));
        return () => {
            cancelled = true;
        };
    }, []);

    const updateGlobal = useCallback((patch: Pick<FlashcardSettings, 'newCardsPerDay' | 'reviewCardsPerDay'>) => {
        setSettings(prev => {
            const next = { ...prev, ...patch };
            safeWrite(next);
            pushSettings(next).catch(err => console.error(err));
            return next;
        });
    }, []);

    const updatePerDeck = useCallback((deckSlug: string, patch: PerDeckSettings) => {
        setSettings(prev => {
            const next: FlashcardSettings = {
                ...prev,
                perDeck: {
                    ...(prev.perDeck ?? {}),
                    [deckSlug]: { ...(prev.perDeck?.[deckSlug] ?? {}), ...patch }
                }
            };
            safeWrite(next);
            pushSettings(next).catch(err => console.error(err));
            return next;
        });
    }, []);

    const getNewCap = useCallback((deckSlug?: string): number => {
        if (deckSlug) {
            const v = settings.perDeck?.[deckSlug]?.newCardsPerDay;
            if (typeof v === 'number') return v;
        }
        return settings.newCardsPerDay ?? NEW_CARDS_PER_DAY;
    }, [settings]);

    const getReviewCap = useCallback((deckSlug?: string): number => {
        if (deckSlug) {
            const v = settings.perDeck?.[deckSlug]?.reviewCardsPerDay;
            if (typeof v === 'number') return v;
        }
        return settings.reviewCardsPerDay ?? REVIEW_CARDS_PER_DAY;
    }, [settings]);

    return {
        isLoaded,
        settings,
        updateGlobal,
        updatePerDeck,
        getNewCap,
        getReviewCap
    };
}
