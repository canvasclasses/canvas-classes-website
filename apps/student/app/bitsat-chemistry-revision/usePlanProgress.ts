'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import {
    ALL_DAYS,
    TOTAL_DAYS,
    completableModuleIdsForDay,
    completableCountForDay,
    moduleId,
} from './plan/planData';

const MODULES_STORAGE_KEY = 'bitsat-chem-plan-modules-v1';
const LEGACY_DAYS_STORAGE_KEY = 'bitsat-chem-plan-v1';
const SYNC_DEBOUNCE_MS = 400;
const PROGRESS_ENDPOINT = '/api/bitsat-plan/progress';

function readLocalModules(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(MODULES_STORAGE_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return [];
        return arr.filter((s) => typeof s === 'string');
    } catch {
        return [];
    }
}

function readLegacyLocalDays(): number[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(LEGACY_DAYS_STORAGE_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return [];
        return arr.filter((n) => Number.isInteger(n) && n >= 1 && n <= TOTAL_DAYS);
    } catch {
        return [];
    }
}

function writeLocalModules(modules: string[]) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(modules));
    } catch {}
}

function writeLocalDays(days: number[]) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(LEGACY_DAYS_STORAGE_KEY, JSON.stringify(days));
    } catch {}
}

function seedModulesFromDays(days: number[]): string[] {
    const set = new Set<string>();
    for (const d of days) {
        for (const id of completableModuleIdsForDay(d)) set.add(id);
    }
    return Array.from(set).sort();
}

function deriveCompletedDays(modules: Set<string>): Set<number> {
    const days = new Set<number>();
    for (const day of ALL_DAYS) {
        const ids = completableModuleIdsForDay(day.day);
        if (ids.length === 0) continue;
        if (ids.every((id) => modules.has(id))) days.add(day.day);
    }
    return days;
}

function sortedStrings(set: Set<string>): string[] {
    return Array.from(set).sort();
}

function sortedNumbers(set: Set<number>): number[] {
    return Array.from(set).sort((a, b) => a - b);
}

export type PlanProgress = {
    // Authoritative module-level state.
    completedModules: Set<string>;
    // Derived day-level completion (all completable modules of the day done).
    completed: Set<number>;
    hydrated: boolean;
    isAuthed: boolean;
    isModuleDone: (dayNum: number, resourceIndex: number) => boolean;
    toggleModule: (dayNum: number, resourceIndex: number) => void;
    setModuleCompleted: (dayNum: number, resourceIndex: number, done: boolean) => void;
    markDayAllComplete: (dayNum: number) => void;
    clearDayCompletion: (dayNum: number) => void;
    completedCountForDay: (dayNum: number) => number;
    totalCountForDay: (dayNum: number) => number;
    resumeDay: number | null;
};

export function usePlanProgress(): PlanProgress {
    const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
    const [hydrated, setHydrated] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);

    const accessTokenRef = useRef<string | null>(null);
    const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const latestModulesRef = useRef<Set<string>>(new Set());

    const pushToServer = useCallback(async (modules: string[], days: number[]) => {
        const token = accessTokenRef.current;
        if (!token) return;
        try {
            await fetch(PROGRESS_ENDPOINT, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ completed_days: days, completed_modules: modules }),
            });
        } catch {}
    }, []);

    useEffect(() => {
        let cancelled = false;

        // Local-first hydration. Prefer new module-scoped key; fall back to
        // legacy day-scoped key by seeding every completable module of each
        // completed day.
        let localModules = readLocalModules();
        const legacyDays = readLegacyLocalDays();
        if (localModules.length === 0 && legacyDays.length > 0) {
            localModules = seedModulesFromDays(legacyDays);
            writeLocalModules(localModules);
        }

        const localSet = new Set(localModules);
        setCompletedModules(localSet);
        latestModulesRef.current = localSet;
        setHydrated(true);

        const supabase = createClient();
        if (!supabase) return;

        (async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (cancelled) return;
            if (!session?.access_token) return;

            accessTokenRef.current = session.access_token;
            setIsAuthed(true);

            try {
                const res = await fetch(PROGRESS_ENDPOINT, {
                    headers: { Authorization: `Bearer ${session.access_token}` },
                });
                if (!res.ok) return;
                const data = await res.json();
                const serverModules: string[] = Array.isArray(data?.completed_modules)
                    ? data.completed_modules
                    : [];
                const serverDays: number[] = Array.isArray(data?.completed_days)
                    ? data.completed_days
                    : [];
                // Migrate server-side: if the server has day-level progress from
                // the v1 schema but no module-level progress, seed modules from it.
                const serverSeed =
                    serverModules.length === 0 && serverDays.length > 0
                        ? seedModulesFromDays(serverDays)
                        : serverModules;

                const merged = new Set<string>([...localSet, ...serverSeed]);
                if (cancelled) return;

                setCompletedModules(merged);
                latestModulesRef.current = merged;
                writeLocalModules(sortedStrings(merged));
                const mergedDays = sortedNumbers(deriveCompletedDays(merged));
                writeLocalDays(mergedDays);

                const diverged =
                    merged.size !== serverSeed.length ||
                    [...localSet].some((m) => !serverSeed.includes(m));
                if (diverged) {
                    pushToServer(sortedStrings(merged), mergedDays);
                }
            } catch {}
        })();

        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            accessTokenRef.current = session?.access_token ?? null;
            setIsAuthed(!!session?.access_token);
        });

        return () => {
            cancelled = true;
            sub.subscription.unsubscribe();
            if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
        };
    }, [pushToServer]);

    // Persist on every change + debounced server sync.
    useEffect(() => {
        if (!hydrated) return;
        const mods = sortedStrings(completedModules);
        const days = sortedNumbers(deriveCompletedDays(completedModules));
        writeLocalModules(mods);
        writeLocalDays(days);
        latestModulesRef.current = completedModules;

        if (!isAuthed) return;
        if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
        syncTimerRef.current = setTimeout(() => {
            const latest = latestModulesRef.current;
            pushToServer(sortedStrings(latest), sortedNumbers(deriveCompletedDays(latest)));
        }, SYNC_DEBOUNCE_MS);
    }, [completedModules, hydrated, isAuthed, pushToServer]);

    const toggleModule = useCallback((dayNum: number, resourceIndex: number) => {
        if (!Number.isInteger(dayNum) || dayNum < 1 || dayNum > TOTAL_DAYS) return;
        if (!Number.isInteger(resourceIndex) || resourceIndex < 0) return;
        const id = moduleId(dayNum, resourceIndex);
        setCompletedModules((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const setModuleCompleted = useCallback(
        (dayNum: number, resourceIndex: number, done: boolean) => {
            if (!Number.isInteger(dayNum) || dayNum < 1 || dayNum > TOTAL_DAYS) return;
            if (!Number.isInteger(resourceIndex) || resourceIndex < 0) return;
            const id = moduleId(dayNum, resourceIndex);
            setCompletedModules((prev) => {
                const already = prev.has(id);
                if (already === done) return prev;
                const next = new Set(prev);
                if (done) next.add(id);
                else next.delete(id);
                return next;
            });
        },
        []
    );

    const markDayAllComplete = useCallback((dayNum: number) => {
        const ids = completableModuleIdsForDay(dayNum);
        if (ids.length === 0) return;
        setCompletedModules((prev) => {
            const next = new Set(prev);
            let changed = false;
            for (const id of ids) {
                if (!next.has(id)) {
                    next.add(id);
                    changed = true;
                }
            }
            return changed ? next : prev;
        });
    }, []);

    const clearDayCompletion = useCallback((dayNum: number) => {
        const ids = completableModuleIdsForDay(dayNum);
        if (ids.length === 0) return;
        setCompletedModules((prev) => {
            const next = new Set(prev);
            let changed = false;
            for (const id of ids) {
                if (next.has(id)) {
                    next.delete(id);
                    changed = true;
                }
            }
            return changed ? next : prev;
        });
    }, []);

    const isModuleDone = useCallback(
        (dayNum: number, resourceIndex: number) =>
            completedModules.has(moduleId(dayNum, resourceIndex)),
        [completedModules]
    );

    const completedCountForDay = useCallback(
        (dayNum: number) => {
            const ids = completableModuleIdsForDay(dayNum);
            let n = 0;
            for (const id of ids) if (completedModules.has(id)) n++;
            return n;
        },
        [completedModules]
    );

    const totalCountForDay = useCallback(
        (dayNum: number) => completableCountForDay(dayNum),
        []
    );

    const completed = useMemo(
        () => deriveCompletedDays(completedModules),
        [completedModules]
    );

    const resumeDay = useMemo(() => {
        if (completed.size === 0) return null;
        return Math.min(TOTAL_DAYS, Math.max(...completed) + 1);
    }, [completed]);

    return {
        completedModules,
        completed,
        hydrated,
        isAuthed,
        isModuleDone,
        toggleModule,
        setModuleCompleted,
        markDayAllComplete,
        clearDayCompletion,
        completedCountForDay,
        totalCountForDay,
        resumeDay,
    };
}
