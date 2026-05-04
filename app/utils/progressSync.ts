import { createClient } from './supabase/client';
import { CardProgress } from '../lib/spacedRepetition';

type FeatureType = 'flashcard' | 'salt_mcq' | 'salt_flashcard' | 'assertion_reason' | 'crucible_item' | 'crucible_stats';

interface ProgressMap {
    [itemId: string]: CardProgress;
}

interface PendingWrite {
    featureType: FeatureType;
    progress: CardProgress;
    enqueuedAt: number;
    attempts: number;
}

const PENDING_KEY = 'canvas_progress_pending_writes';
const MAX_PENDING = 500;
const MAX_ATTEMPTS = 6;

// Window during which we batch consecutive saves before sending them in one
// API call. Cuts request volume by ~10x during a typical practice session.
const BATCH_WINDOW_MS = 800;

const MONGO_FLASHCARD_ENDPOINT = '/api/v2/user/flashcard-progress';

export type SyncEvent =
    | { type: 'queued'; pendingCount: number }
    | { type: 'flushed'; pendingCount: number }
    | { type: 'failed'; pendingCount: number; error: string }
    | { type: 'remote-update'; cardId: string; progress: CardProgress };

const subscribers = new Set<(e: SyncEvent) => void>();

export function subscribeSyncEvents(fn: (e: SyncEvent) => void): () => void {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
}

function emit(event: SyncEvent) {
    subscribers.forEach(fn => {
        try {
            fn(event);
        } catch (err) {
            console.error('Sync subscriber error:', err);
        }
    });
}

function readPending(): PendingWrite[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(PENDING_KEY);
        return raw ? (JSON.parse(raw) as PendingWrite[]) : [];
    } catch {
        return [];
    }
}

function writePending(queue: PendingWrite[]): boolean {
    if (typeof window === 'undefined') return false;
    try {
        const trimmed = queue.length > MAX_PENDING ? queue.slice(-MAX_PENDING) : queue;
        localStorage.setItem(PENDING_KEY, JSON.stringify(trimmed));
        return true;
    } catch (err) {
        console.error('Failed to persist pending writes:', err);
        return false;
    }
}

function enqueuePending(write: PendingWrite) {
    const queue = readPending();
    const filtered = queue.filter(
        w => !(w.featureType === write.featureType && w.progress.cardId === write.progress.cardId)
    );
    filtered.push(write);
    writePending(filtered);
    emit({ type: 'queued', pendingCount: filtered.length });
}

function pendingCount(): number {
    return readPending().length;
}

function getMasteryLevelForDb(progress: CardProgress): string {
    if (progress.repetitions === 0) return 'new';
    if (progress.interval < 2) return 'learning';
    if (progress.interval < 6) return 'reviewing';
    return 'mastered';
}

interface SupabaseRow {
    user_id: string;
    feature_type: FeatureType;
    item_id: string;
    data: CardProgress;
    mastery_level: string;
    next_review_at: string | null;
    updated_at: string;
}

function buildSupabaseRow(userId: string, featureType: FeatureType, progress: CardProgress): SupabaseRow {
    return {
        user_id: userId,
        feature_type: featureType,
        item_id: progress.cardId,
        data: progress,
        mastery_level: getMasteryLevelForDb(progress),
        next_review_at: progress.nextReviewDate ? new Date(progress.nextReviewDate).toISOString() : null,
        updated_at: progress.updatedAt ? new Date(progress.updatedAt).toISOString() : new Date().toISOString()
    };
}

async function isAuthenticated(): Promise<boolean> {
    const supabase = createClient();
    if (!supabase) return false;
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user;
}

async function pushToMongo(progresses: CardProgress[]): Promise<{ ok: boolean; status: number; error?: string }> {
    if (typeof window === 'undefined') return { ok: false, status: 0, error: 'no-window' };
    try {
        const res = await fetch(MONGO_FLASHCARD_ENDPOINT, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cards: progresses })
        });
        if (!res.ok) {
            return { ok: false, status: res.status, error: `HTTP ${res.status}` };
        }
        return { ok: true, status: res.status };
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { ok: false, status: 0, error: msg };
    }
}

interface MongoFlashcardSnapshot {
    cards: Record<string, CardProgress>;
    streak?: { currentStreak: number; longestStreak: number; lastStudyDate: string; updatedAt: number };
}

async function pullFromMongo(): Promise<MongoFlashcardSnapshot | null> {
    if (typeof window === 'undefined') return null;
    try {
        const res = await fetch(MONGO_FLASHCARD_ENDPOINT, {
            method: 'GET',
            credentials: 'same-origin'
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        console.error('Mongo flashcard pull failed:', err);
        return null;
    }
}

async function pushToSupabase(rows: SupabaseRow[]): Promise<{ ok: boolean; error?: string }> {
    const supabase = createClient();
    if (!supabase) return { ok: false, error: 'no-supabase-client' };
    const { error } = await supabase
        .from('user_progress')
        .upsert(rows, { onConflict: 'user_id, feature_type, item_id' });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
}

/**
 * Try to flush every pending write. Called on online events, after successful
 * single writes, and once at startup.
 */
export async function flushPendingWrites(): Promise<void> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;
    if (!(await isAuthenticated())) return;

    const queue = readPending();
    if (queue.length === 0) return;

    const supabase = createClient();
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const userId = session.user.id;

    // Group flashcard writes — they go to Mongo as a batch.
    const flashcards = queue.filter(w => w.featureType === 'flashcard');
    const others = queue.filter(w => w.featureType !== 'flashcard');

    const remaining: PendingWrite[] = [];
    let lastError: string | undefined;

    if (flashcards.length > 0) {
        const mongoResult = await pushToMongo(flashcards.map(w => w.progress));
        if (mongoResult.ok) {
            // Mirror to Supabase (best-effort cache fill).
            const rows = flashcards.map(w => buildSupabaseRow(userId, 'flashcard', w.progress));
            await pushToSupabase(rows);
        } else {
            // Mongo failed — try Supabase as a fallback so writes aren't lost.
            const rows = flashcards.map(w => buildSupabaseRow(userId, 'flashcard', w.progress));
            const supaResult = await pushToSupabase(rows);
            if (!supaResult.ok) {
                lastError = mongoResult.error ?? supaResult.error;
                flashcards.forEach(w => {
                    const next = { ...w, attempts: w.attempts + 1 };
                    if (next.attempts < MAX_ATTEMPTS) remaining.push(next);
                    else console.error(`Dropped pending write for ${w.progress.cardId}: ${lastError}`);
                });
            }
        }
    }

    // Other feature types still go through Supabase only.
    for (const write of others) {
        const row = buildSupabaseRow(userId, write.featureType, write.progress);
        const result = await pushToSupabase([row]);
        if (result.ok) continue;
        const next = { ...write, attempts: write.attempts + 1 };
        if (next.attempts >= MAX_ATTEMPTS) {
            console.error(`Dropped pending write for ${write.progress.cardId}: ${result.error}`);
            continue;
        }
        remaining.push(next);
        lastError = result.error;
    }

    writePending(remaining);

    if (lastError && remaining.length > 0) {
        emit({ type: 'failed', pendingCount: remaining.length, error: lastError });
    } else {
        emit({ type: 'flushed', pendingCount: remaining.length });
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        flushPendingWrites().catch(err => console.error('Flush on online failed:', err));
    });
}

/**
 * Initial sync. Pulls the authoritative copy from Mongo, falls back to
 * Supabase, merges with local using last-write-wins, and pushes any
 * local-newer items back to both stores.
 */
export async function syncProgressWithCloud(
    featureType: FeatureType,
    localData: ProgressMap
): Promise<ProgressMap> {
    // Drain queue first so the upcoming pull reflects everything we already
    // accepted locally.
    await flushPendingWrites();

    // For flashcards, Mongo is authoritative.
    if (featureType === 'flashcard') {
        const snapshot = await pullFromMongo();
        if (snapshot) {
            const merged: ProgressMap = { ...localData };
            const toPush: CardProgress[] = [];

            Object.entries(snapshot.cards).forEach(([cardId, mongoProgress]) => {
                const localProgress = localData[cardId];
                if (!localProgress) {
                    merged[cardId] = mongoProgress;
                    return;
                }
                const mongoTs = mongoProgress.updatedAt ?? 0;
                const localTs = localProgress.updatedAt ?? 0;
                if (mongoTs > localTs) merged[cardId] = mongoProgress;
                else if (mongoTs === localTs && mongoProgress.repetitions > localProgress.repetitions) {
                    merged[cardId] = mongoProgress;
                }
            });

            Object.entries(merged).forEach(([cardId, progress]) => {
                const mongoCopy = snapshot.cards[cardId];
                if (!mongoCopy) {
                    toPush.push(progress);
                    return;
                }
                if ((progress.updatedAt ?? 0) > (mongoCopy.updatedAt ?? 0)) {
                    toPush.push(progress);
                }
            });

            if (toPush.length > 0) {
                const result = await pushToMongo(toPush);
                if (!result.ok) {
                    toPush.forEach(p => enqueuePending({
                        featureType: 'flashcard',
                        progress: p,
                        enqueuedAt: Date.now(),
                        attempts: 0
                    }));
                }
            }

            return merged;
        }
        // Mongo unreachable — fall through to Supabase path below.
    }

    const supabase = createClient();
    if (!supabase) return localData;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return localData;
    const userId = session.user.id;

    try {
        const { data: cloudRecords, error } = await supabase
            .from('user_progress')
            .select('item_id, data, updated_at')
            .eq('user_id', userId)
            .eq('feature_type', featureType);

        if (error) {
            console.error('Error fetching cloud progress:', error);
            return localData;
        }

        const cloudMap: ProgressMap = {};
        cloudRecords?.forEach(record => {
            if (record.data && typeof record.data === 'object') {
                cloudMap[record.item_id] = record.data as CardProgress;
            }
        });

        const merged: ProgressMap = { ...localData };
        const toUpsert: SupabaseRow[] = [];

        Object.entries(cloudMap).forEach(([itemId, cloudProgress]) => {
            const localProgress = localData[itemId];
            if (!localProgress) {
                merged[itemId] = cloudProgress;
                return;
            }
            const cloudTs = cloudProgress.updatedAt ?? 0;
            const localTs = localProgress.updatedAt ?? 0;
            if (cloudTs > localTs) merged[itemId] = cloudProgress;
            else if (cloudTs === localTs && cloudProgress.repetitions > localProgress.repetitions) {
                merged[itemId] = cloudProgress;
            }
        });

        Object.entries(merged).forEach(([itemId, progress]) => {
            const cloudProgress = cloudMap[itemId];
            if (!cloudProgress) {
                toUpsert.push(buildSupabaseRow(userId, featureType, progress));
                return;
            }
            if ((progress.updatedAt ?? 0) > (cloudProgress.updatedAt ?? 0)) {
                toUpsert.push(buildSupabaseRow(userId, featureType, progress));
            }
        });

        if (toUpsert.length > 0) {
            const result = await pushToSupabase(toUpsert);
            if (!result.ok) {
                console.error('Bulk Supabase upsert failed:', result.error);
                toUpsert.forEach(row => enqueuePending({
                    featureType,
                    progress: row.data,
                    enqueuedAt: Date.now(),
                    attempts: 0
                }));
            }
        }

        return merged;
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Unexpected error during sync:', errorMessage);
        return localData;
    }
}

// Coalesce flashcard writes inside a short window so a rapid run of ratings
// becomes a single network round-trip.
let pendingBatch: Map<string, CardProgress> = new Map();
let batchTimer: ReturnType<typeof setTimeout> | null = null;

async function flushBatch(): Promise<void> {
    if (pendingBatch.size === 0) return;
    const batch = Array.from(pendingBatch.values());
    pendingBatch = new Map();
    batchTimer = null;

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        batch.forEach(p => enqueuePending({
            featureType: 'flashcard',
            progress: p,
            enqueuedAt: Date.now(),
            attempts: 0
        }));
        return;
    }

    if (!(await isAuthenticated())) return;

    const mongoResult = await pushToMongo(batch);
    if (mongoResult.ok) {
        // Mirror to Supabase as a cache (best-effort).
        const supabase = createClient();
        if (supabase) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const rows = batch.map(p => buildSupabaseRow(session.user!.id, 'flashcard', p));
                pushToSupabase(rows).catch(err => console.error('Supabase mirror failed:', err));
            }
        }
        emit({ type: 'flushed', pendingCount: pendingCount() });
        return;
    }

    // Mongo failed — fall back to Supabase, queue what doesn't land.
    const supabase = createClient();
    if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            const rows = batch.map(p => buildSupabaseRow(session.user!.id, 'flashcard', p));
            const supaResult = await pushToSupabase(rows);
            if (supaResult.ok) {
                // Best case under failure: Supabase saved it, will reconcile to Mongo later.
                emit({ type: 'flushed', pendingCount: pendingCount() });
                return;
            }
        }
    }

    batch.forEach(p => enqueuePending({
        featureType: 'flashcard',
        progress: p,
        enqueuedAt: Date.now(),
        attempts: 0
    }));
    emit({ type: 'failed', pendingCount: pendingCount(), error: mongoResult.error ?? 'sync failed' });
}

/**
 * Save a single progress item. For flashcards this batches into a window so
 * a rapid burst of ratings turns into one request. For other feature types
 * it goes straight to Supabase.
 */
export async function saveProgressItemToCloud(
    featureType: FeatureType,
    progress: CardProgress
): Promise<{ ok: boolean; queued: boolean }> {
    if (featureType === 'flashcard') {
        pendingBatch.set(progress.cardId, progress);
        if (batchTimer === null) {
            batchTimer = setTimeout(() => {
                flushBatch().catch(err => console.error('Batch flush failed:', err));
            }, BATCH_WINDOW_MS);
        }
        return { ok: true, queued: false };
    }

    // Non-flashcard path: direct Supabase upsert.
    const supabase = createClient();
    if (!supabase) return { ok: false, queued: false };

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        enqueuePending({ featureType, progress, enqueuedAt: Date.now(), attempts: 0 });
        return { ok: false, queued: true };
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { ok: false, queued: false };

    const row = buildSupabaseRow(session.user.id, featureType, progress);
    const result = await pushToSupabase([row]);

    if (!result.ok) {
        enqueuePending({ featureType, progress, enqueuedAt: Date.now(), attempts: 0 });
        emit({ type: 'failed', pendingCount: pendingCount(), error: result.error ?? 'unknown' });
        return { ok: false, queued: true };
    }

    return { ok: true, queued: false };
}

/**
 * Force-flush any pending in-window batch. Useful when the user navigates
 * away or signs out.
 */
export async function flushBatchNow(): Promise<void> {
    if (batchTimer !== null) {
        clearTimeout(batchTimer);
        batchTimer = null;
    }
    await flushBatch();
}

export function getPendingWriteCount(): number {
    return pendingCount();
}

/**
 * Subscribe to realtime updates on this user's flashcard rows so other
 * devices' reviews reflect immediately. Returns an unsubscribe function.
 *
 * Implemented via Supabase Realtime — relies on the user_progress table
 * having Realtime publications enabled (configured in the Supabase dashboard
 * or via the migration's REPLICA IDENTITY).
 */
export async function subscribeToRemoteUpdates(featureType: FeatureType): Promise<() => void> {
    const supabase = createClient();
    if (!supabase) return () => {};

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return () => {};
    const userId = session.user.id;

    const channel = supabase
        .channel(`user_progress:${userId}:${featureType}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'user_progress',
                filter: `user_id=eq.${userId}`
            },
            (payload: { new?: { feature_type?: string; item_id?: string; data?: unknown } }) => {
                const row = payload.new;
                if (!row || row.feature_type !== featureType || !row.item_id) return;
                if (!row.data || typeof row.data !== 'object') return;
                emit({
                    type: 'remote-update',
                    cardId: row.item_id,
                    progress: row.data as CardProgress
                });
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

// Flush any in-flight batch when the page is hidden so we don't lose the last
// few reviews to a sudden tab close.
if (typeof window !== 'undefined') {
    window.addEventListener('pagehide', () => {
        flushBatchNow().catch(() => {});
    });
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            flushBatchNow().catch(() => {});
        }
    });
}
