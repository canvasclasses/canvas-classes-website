'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    CardProgress,
    QualityRating,
    createInitialProgress,
    calculateNextReview,
    isCardDue,
    getMasteryLevel,
    MasteryLevel,
    daysOverdue,
    localDateString,
    NEW_CARDS_PER_DAY,
    REVIEW_CARDS_PER_DAY
} from '../lib/spacedRepetition';
import {
    syncProgressWithCloud,
    saveProgressItemToCloud,
    subscribeSyncEvents,
    getPendingWriteCount,
    flushPendingWrites,
    subscribeToRemoteUpdates
} from '../utils/progressSync';

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

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline' | 'queued';

// In-memory undo stack — only the most-recent action is undoable, like Anki.
interface UndoEntry {
    cardId: string;
    previous: CardProgress | undefined; // undefined = card had no prior progress
    quality: QualityRating;             // what the user just rated
}

// Safe localStorage write — surfaces quota errors so the caller can react
// instead of silently losing data.
function safeWriteLocal(key: string, value: string): boolean {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (err) {
        console.error('localStorage write failed:', err);
        return false;
    }
}

// Record a review against today's heatmap cell. Best-effort fire-and-forget;
// the heatmap can rebuild from cards if the call fails.
function recordReviewDay() {
    if (typeof window === 'undefined') return;
    fetch('/api/v2/user/flashcard-day', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: localDateString(), delta: 1 })
    }).catch(() => {});
}

/**
 * Hook for managing flashcard progress with localStorage persistence and
 * Supabase cloud sync. Exposes an undo stack of one entry (last review) so
 * accidental rating clicks can be reversed without corrupting the SR state.
 */
export function useCardProgress() {
    const [progressMap, setProgressMap] = useState<ProgressMap>({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
    const [pendingWrites, setPendingWrites] = useState(0);
    const [lastUndo, setLastUndo] = useState<UndoEntry | null>(null);

    // Tracks reviews that happened during the initial cloud sync window so
    // they aren't clobbered by the server response. Without this, a user who
    // rates a card before sync completes loses that review.
    const inFlightReviewsRef = useRef<Set<string>>(new Set());

    // Initial load + sync
    useEffect(() => {
        let cancelled = false;
        const loadAndSync = async () => {
            let initialData: ProgressMap = {};

            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    initialData = JSON.parse(stored);
                    if (!cancelled) setProgressMap(initialData);
                }
            } catch (error) {
                console.error('Error loading flashcard progress:', error);
            }
            if (!cancelled) setIsLoaded(true);

            if (typeof navigator !== 'undefined' && !navigator.onLine) {
                if (!cancelled) setSyncStatus('offline');
                return;
            }

            setSyncStatus('syncing');
            try {
                const mergedData = await syncProgressWithCloud(FEATURE_TYPE, initialData);
                if (cancelled) return;

                // Skip merging back any cards the user reviewed during the sync
                // — those local writes win over what the server returned.
                setProgressMap(prev => {
                    const next: ProgressMap = { ...mergedData };
                    inFlightReviewsRef.current.forEach(cardId => {
                        if (prev[cardId]) next[cardId] = prev[cardId];
                    });
                    inFlightReviewsRef.current.clear();
                    return next;
                });
                setSyncStatus('idle');
            } catch (err) {
                if (!cancelled) setSyncStatus('error');
                console.error('Sync failed:', err);
            }
        };

        loadAndSync();
        return () => {
            cancelled = true;
        };
    }, []);

    // Persist progressMap to localStorage on every change.
    useEffect(() => {
        if (isLoaded) {
            safeWriteLocal(STORAGE_KEY, JSON.stringify(progressMap));
        }
    }, [progressMap, isLoaded]);

    // Online/offline + cross-tab + sync-event subscriptions.
    useEffect(() => {
        const onOnline = () => {
            setSyncStatus(prev => (prev === 'offline' ? 'idle' : prev));
            flushPendingWrites().catch(err => console.error('Reconnect flush failed:', err));
        };
        const onOffline = () => setSyncStatus('offline');

        // Cross-tab: when another tab updates progress, mirror it here.
        const onStorage = (e: StorageEvent) => {
            if (e.key !== STORAGE_KEY || !e.newValue) return;
            try {
                const next = JSON.parse(e.newValue) as ProgressMap;
                setProgressMap(next);
            } catch (err) {
                console.error('Cross-tab sync parse failed:', err);
            }
        };

        const unsubscribe = subscribeSyncEvents(event => {
            if (event.type === 'remote-update') {
                // Apply incoming change from another device — but only if it's
                // newer than our local copy.
                setProgressMap(prev => {
                    const local = prev[event.cardId];
                    const localTs = local?.updatedAt ?? 0;
                    const remoteTs = event.progress.updatedAt ?? 0;
                    if (remoteTs <= localTs) return prev;
                    return { ...prev, [event.cardId]: event.progress };
                });
                return;
            }
            setPendingWrites(event.pendingCount);
            if (event.type === 'queued') setSyncStatus('queued');
            else if (event.type === 'flushed') {
                setSyncStatus(event.pendingCount > 0 ? 'queued' : 'idle');
            } else if (event.type === 'failed') {
                setSyncStatus('error');
            }
        });

        let unsubscribeRealtime: (() => void) | null = null;
        subscribeToRemoteUpdates('flashcard')
            .then(unsub => {
                unsubscribeRealtime = unsub;
            })
            .catch(err => console.error('Realtime subscribe failed:', err));

        // Initialize pending count on mount.
        setPendingWrites(getPendingWriteCount());

        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);
        window.addEventListener('storage', onStorage);
        return () => {
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
            window.removeEventListener('storage', onStorage);
            unsubscribe();
            if (unsubscribeRealtime) unsubscribeRealtime();
        };
    }, []);

    /**
     * Get progress for a specific card (creates new if doesn't exist)
     */
    const getProgress = useCallback((cardId: string): CardProgress => {
        return progressMap[cardId] || createInitialProgress(cardId);
    }, [progressMap]);

    /**
     * Update progress after reviewing a card. Returns the new state so callers
     * can immediately act on it (e.g. for same-session requeue).
     */
    const updateProgress = useCallback((cardId: string, quality: QualityRating): CardProgress => {
        let nextProgress: CardProgress = createInitialProgress(cardId);
        let previous: CardProgress | undefined;

        setProgressMap(prev => {
            previous = prev[cardId];
            const currentProgress = previous || createInitialProgress(cardId);
            nextProgress = calculateNextReview(currentProgress, quality);
            return { ...prev, [cardId]: nextProgress };
        });

        // Track this review so the in-flight sync doesn't overwrite it.
        if (syncStatus === 'syncing') {
            inFlightReviewsRef.current.add(cardId);
        }

        setLastUndo({ cardId, previous, quality });

        // Cloud save with retry/queueing handled inside saveProgressItemToCloud.
        saveProgressItemToCloud(FEATURE_TYPE, nextProgress).catch(err => {
            console.error('Cloud save failed:', err);
        });

        // Record a review for today's heatmap cell. Best-effort.
        recordReviewDay();

        return nextProgress;
    }, [syncStatus]);

    /**
     * Reverse the most recent updateProgress call. Returns the rating that
     * was reversed (so callers can roll back session counters), or null if
     * the undo stack was empty.
     */
    const undoLastReview = useCallback((): QualityRating | null => {
        if (!lastUndo) return null;
        const { cardId, previous, quality } = lastUndo;

        setProgressMap(prev => {
            const next = { ...prev };
            if (previous) {
                next[cardId] = previous;
            } else {
                delete next[cardId];
            }
            return next;
        });

        // Reflect the undo in the cloud too. If we had a previous state, push
        // it; if not, the row should be deleted server-side.
        if (previous) {
            saveProgressItemToCloud(FEATURE_TYPE, previous).catch(err => {
                console.error('Cloud undo failed:', err);
            });
        } else {
            // No prior state — best-effort: push a zeroed-out record so the
            // remote is at least consistent. Full delete is handled in Phase 2.
            saveProgressItemToCloud(FEATURE_TYPE, createInitialProgress(cardId)).catch(err => {
                console.error('Cloud undo (reset) failed:', err);
            });
        }

        setLastUndo(null);
        return quality;
    }, [lastUndo]);

    const canUndo = lastUndo !== null;

    /**
     * Get all cards that are due for review from a list of card IDs.
     * Optionally cap new (unseen) cards at the daily limit so a fresh deck
     * doesn't flood the user.
     */
    const getDueCards = useCallback((cardIds: string[], opts?: { capNew?: boolean; newCap?: number }): string[] => {
        const capNew = opts?.capNew ?? false;
        const cap = opts?.newCap ?? NEW_CARDS_PER_DAY;
        let newCount = 0;
        return cardIds.filter(cardId => {
            const progress = progressMap[cardId];
            if (!progress) {
                if (capNew && newCount >= cap) return false;
                newCount++;
                return true;
            }
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

            if (!progressA && !progressB) return 0;
            if (!progressA) return -1;
            if (!progressB) return 1;

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
     * Today's recommended queue, capped by daily limits.
     * Reviews (overdue first) come before new cards.
     */
    const getTodaysQueue = useCallback((cardIds: string[], caps?: { newCap?: number; reviewCap?: number }): string[] => {
        const newCap = caps?.newCap ?? NEW_CARDS_PER_DAY;
        const reviewCap = caps?.reviewCap ?? REVIEW_CARDS_PER_DAY;
        const newIds: string[] = [];
        const reviewIds: { id: string; overdue: number }[] = [];

        cardIds.forEach(id => {
            const progress = progressMap[id];
            if (!progress || progress.repetitions === 0) {
                newIds.push(id);
            } else if (isCardDue(progress)) {
                reviewIds.push({ id, overdue: daysOverdue(progress) });
            }
        });

        reviewIds.sort((a, b) => b.overdue - a.overdue);
        const reviewSlice = reviewIds.slice(0, reviewCap).map(r => r.id);
        const newSlice = newIds.slice(0, newCap);

        return [...reviewSlice, ...newSlice];
    }, [progressMap]);

    /**
     * All-time accuracy for a set of cards (quality >= 4 / totalReviews).
     * Returns null when no reviews have been recorded.
     */
    const getAccuracy = useCallback((cardIds: string[]): number | null => {
        let total = 0;
        let correct = 0;
        cardIds.forEach(id => {
            const progress = progressMap[id];
            if (progress?.totalReviews) {
                total += progress.totalReviews;
                correct += progress.correctReviews ?? 0;
            }
        });
        if (total === 0) return null;
        return correct / total;
    }, [progressMap]);

    /**
     * Most recent review date (yyyy-mm-dd) across cards, or null if none.
     */
    const getLastReviewDate = useCallback((cardIds: string[]): string | null => {
        let latest = '';
        cardIds.forEach(id => {
            const d = progressMap[id]?.lastReviewDate;
            if (d && d > latest) latest = d;
        });
        return latest || null;
    }, [progressMap]);

    /**
     * Largest days-overdue value across due cards. Used for pill urgency.
     */
    const getMaxOverdue = useCallback((cardIds: string[]): number => {
        let max = 0;
        cardIds.forEach(id => {
            const progress = progressMap[id];
            if (progress && isCardDue(progress)) {
                const overdue = daysOverdue(progress);
                if (overdue > max) max = overdue;
            }
        });
        return max;
    }, [progressMap]);

    /**
     * Reset progress for all cards (for testing/debugging)
     */
    const resetAllProgress = useCallback(() => {
        setProgressMap({});
        setLastUndo(null);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (err) {
            console.error('Failed to clear local progress:', err);
        }
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
        undoLastReview,
        canUndo,
        getDueCards,
        sortByPriority,
        getStatistics,
        getTodaysQueue,
        getAccuracy,
        getLastReviewDate,
        getMaxOverdue,
        resetAllProgress,
        hasAnyProgress,
        syncStatus,
        pendingWrites,
        // Back-compat alias for callers still on the old name
        isSyncing: syncStatus === 'syncing'
    };
}

export type { Statistics };
