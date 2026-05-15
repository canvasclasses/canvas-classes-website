'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '../utils/supabase/client';

const STORAGE_KEY = 'canvas_flashcard_metadata';
const MONGO_ENDPOINT = '/api/v2/user/flashcard-metadata';

export interface CardMetadata {
    starred?: boolean;
    suspended?: boolean;        // Excluded from all queues until un-suspended
    buriedUntil?: string;       // local-TZ yyyy-mm-dd; excluded from queues until past
    note?: string;
    updatedAt: number;
}

export interface MetadataMap {
    [cardId: string]: CardMetadata;
}

function safeRead(): MetadataMap {
    if (typeof window === 'undefined') return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as MetadataMap) : {};
    } catch {
        return {};
    }
}

function safeWrite(map: MetadataMap) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch (err) {
        console.error('Card metadata persist failed:', err);
    }
}

async function isLoggedIn(): Promise<boolean> {
    const supabase = createClient();
    if (!supabase) return false;
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user;
}

async function pushToMongo(map: MetadataMap): Promise<boolean> {
    if (!(await isLoggedIn())) return false;
    try {
        const res = await fetch(MONGO_ENDPOINT, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ metadata: map })
        });
        return res.ok;
    } catch (err) {
        console.error('Card metadata cloud push failed:', err);
        return false;
    }
}

async function pullFromMongo(): Promise<MetadataMap | null> {
    if (!(await isLoggedIn())) return null;
    try {
        const res = await fetch(MONGO_ENDPOINT, { credentials: 'same-origin' });
        if (!res.ok) return null;
        const body = await res.json();
        return (body?.metadata as MetadataMap | undefined) ?? null;
    } catch (err) {
        console.error('Card metadata cloud fetch failed:', err);
        return null;
    }
}

function mergeMaps(a: MetadataMap, b: MetadataMap): MetadataMap {
    const merged: MetadataMap = { ...a };
    Object.entries(b).forEach(([cardId, meta]) => {
        const existing = merged[cardId];
        if (!existing || (meta.updatedAt ?? 0) > (existing.updatedAt ?? 0)) {
            merged[cardId] = meta;
        }
    });
    return merged;
}

export function useCardMetadata() {
    const [metadata, setMetadata] = useState<MetadataMap>({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const local = safeRead();
        if (!cancelled) {
            setMetadata(local);
            setIsLoaded(true);
        }

        pullFromMongo().then(remote => {
            if (cancelled || !remote) return;
            setMetadata(prev => {
                const merged = mergeMaps(prev, remote);
                safeWrite(merged);
                return merged;
            });
        }).catch(err => console.error(err));

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (isLoaded) safeWrite(metadata);
    }, [metadata, isLoaded]);

    const update = useCallback((cardId: string, patch: Partial<CardMetadata>) => {
        setMetadata(prev => {
            const next: MetadataMap = {
                ...prev,
                [cardId]: {
                    ...(prev[cardId] ?? {}),
                    ...patch,
                    updatedAt: Date.now()
                }
            };
            // Push the single change to cloud (whole-map upsert is fine for now;
            // metadata is small).
            pushToMongo(next).catch(err => console.error(err));
            return next;
        });
    }, []);

    const toggleStar = useCallback((cardId: string) => {
        update(cardId, { starred: !metadata[cardId]?.starred });
    }, [metadata, update]);

    const toggleSuspend = useCallback((cardId: string) => {
        update(cardId, { suspended: !metadata[cardId]?.suspended });
    }, [metadata, update]);

    const buryUntil = useCallback((cardId: string, dateString: string) => {
        update(cardId, { buriedUntil: dateString });
    }, [update]);

    const get = useCallback((cardId: string): CardMetadata | undefined => {
        return metadata[cardId];
    }, [metadata]);

    /**
     * Filter out cards that are currently suspended or buried (until past).
     */
    const filterPlayable = useCallback((cardIds: string[], today: string): string[] => {
        return cardIds.filter(id => {
            const m = metadata[id];
            if (!m) return true;
            if (m.suspended) return false;
            if (m.buriedUntil && m.buriedUntil > today) return false;
            return true;
        });
    }, [metadata]);

    return {
        isLoaded,
        metadata,
        get,
        toggleStar,
        toggleSuspend,
        buryUntil,
        update,
        filterPlayable
    };
}
