'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { parseResourceUrl } from './lib/toEmbed';
import {
    addDaysISO,
    BUFFER_BLOCK_DEFAULT_DAYS,
    BUFFER_BLOCK_MAX_DAYS,
    BUFFER_BLOCK_MIN_DAYS,
    defaultRoadmapSort,
    emptyFullState,
    emptyModeState,
    isBufferId,
    PLANNER_MODES,
    REV_INTERVALS,
    type FullPlannerState,
    type ModeState,
    type PlannerMode,
    type UserResource,
    type Diagnostic,
} from './lib/state';
import type { ChapterPlanItem, Subject } from './planner-data';
import { stepId, customModuleId, PLANNER_SUBJECTS, CHAPTER_DAYS_MIN, CHAPTER_DAYS_MAX, type LoopStep, type ResourceKind } from './planner-data';

// v3 = multi-mode wrapping (FullPlannerState). Older keys are read as legacy
// shapes by `migrate()` and rewritten under the new key on next save.
const STORAGE_KEY = 'drop-planner-state-v3';
const LEGACY_KEYS = ['drop-planner-state-v2', 'drop-planner-state-v1'];
const ENDPOINT = '/api/drop-planner/progress';
const SYNC_DEBOUNCE_MS = 500;
const WEEK_HISTORY = 30;

const todayISO = () => new Date().toISOString().slice(0, 10);
function newId(): string {
    try {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    } catch {}
    return `r${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
}

// Coerce one mode slice. Every field defensively defaulted.
// roadmapOrder / bufferBlocks became per-subject on 2026-06-09. Coerce the
// legacy shapes (flat array / flat buffer record) into the per-subject record,
// dropping the old data under 'chemistry' (the original single-subject scope).
function coerceRoadmapOrder(v: unknown): Record<Subject, string[]> {
    const out: Record<Subject, string[]> = { chemistry: [], physics: [], math: [] };
    if (Array.isArray(v)) { out.chemistry = v.filter((x): x is string => typeof x === 'string'); return out; }
    if (v && typeof v === 'object') {
        for (const s of PLANNER_SUBJECTS) {
            const arr = (v as Record<string, unknown>)[s];
            if (Array.isArray(arr)) out[s] = arr.filter((x): x is string => typeof x === 'string');
        }
    }
    return out;
}
function coerceBufferBlocks(v: unknown): Record<Subject, Record<string, { days: number }>> {
    const out: Record<Subject, Record<string, { days: number }>> = { chemistry: {}, physics: {}, math: {} };
    if (!v || typeof v !== 'object') return out;
    const obj = v as Record<string, unknown>;
    // Legacy flat shape: values are { days } blocks keyed by buf_… ids.
    const vals = Object.values(obj);
    const isLegacyFlat = vals.length > 0 && vals.every((x) => !!x && typeof x === 'object' && typeof (x as { days?: unknown }).days === 'number');
    if (isLegacyFlat) { out.chemistry = obj as Record<string, { days: number }>; return out; }
    for (const s of PLANNER_SUBJECTS) {
        const rec = obj[s];
        if (rec && typeof rec === 'object') out[s] = rec as Record<string, { days: number }>;
    }
    return out;
}

// Remap a legacy completion id (chapterId:step) after the 2026-06-09 loop
// rename. Custom-module ids (chapterId#custom:…) and already-new ids pass through.
function migrateStepId(id: string): string {
    if (id.endsWith(':solve')) return id.slice(0, -6) + ':apply';
    if (id.endsWith(':pyq')) return id.slice(0, -4) + ':practice';
    if (id.endsWith(':retest')) return id.slice(0, -7) + ':revise';
    return id;
}

function migrateModeState(s: Partial<ModeState> | null | undefined): ModeState {
    const base = emptyModeState();
    if (!s || typeof s !== 'object') return base;
    return {
        ...base,
        ...s,
        currentSubject: (PLANNER_SUBJECTS as string[]).includes(s.currentSubject as string) ? (s.currentSubject as Subject) : 'chemistry',
        // Loop step ids were renamed 2026-06-09 (solve→apply, pyq→practice,
        // retest→revise). Remap saved completion ticks so progress isn't lost.
        completed: Array.isArray(s.completed) ? s.completed.map(migrateStepId) : [],
        deadlines: (s.deadlines && typeof s.deadlines === 'object') ? (s.deadlines as Record<string, string>) : {},
        chapterDays: (s.chapterDays && typeof s.chapterDays === 'object') ? (s.chapterDays as Record<string, number>) : {},
        diagnostic: (s.diagnostic && typeof s.diagnostic === 'object') ? (s.diagnostic as Record<string, Diagnostic>) : {},
        notes: (s.notes && typeof s.notes === 'object') ? (s.notes as Record<string, string>) : {},
        stars: (s.stars && typeof s.stars === 'object') ? (s.stars as Record<string, string[]>) : {},
        customResources: (s.customResources && typeof s.customResources === 'object') ? (s.customResources as ModeState['customResources']) : {},
        revisionStages: (s.revisionStages && typeof s.revisionStages === 'object') ? (s.revisionStages as ModeState['revisionStages']) : {},
        weekActivity: Array.isArray(s.weekActivity) ? (s.weekActivity as string[]) : [],
        roadmapOrder: coerceRoadmapOrder(s.roadmapOrder),
        bufferBlocks: coerceBufferBlocks(s.bufferBlocks),
        lastAccessedChapter: typeof s.lastAccessedChapter === 'string' ? s.lastAccessedChapter : null,
        settings: (s.settings && typeof s.settings === 'object') ? (s.settings as ModeState['settings']) : {},
        streak: (s.streak && typeof s.streak === 'object') ? (s.streak as ModeState['streak']) : { count: 0, lastActiveDate: '' },
    };
}

// Migration accepts both v1 (flat single-mode) and v2 (wrapped multi-mode)
// shapes and always returns v2. Any v1 payload — local OR server — collapses
// into modes.dropper, since the planner started as a dropper-only product.
function migrate(s: unknown): FullPlannerState {
    if (!s || typeof s !== 'object') return emptyFullState();
    const obj = s as Record<string, unknown>;
    // v2 shape: has explicit modes record + currentMode
    if (obj.modes && typeof obj.modes === 'object' && !Array.isArray(obj.modes)) {
        const modesObj = obj.modes as Record<string, unknown>;
        const currentMode: PlannerMode =
            (typeof obj.currentMode === 'string' && (PLANNER_MODES as string[]).includes(obj.currentMode))
                ? (obj.currentMode as PlannerMode)
                : 'dropper';
        return {
            currentMode,
            modes: {
                class11: migrateModeState(modesObj.class11 as Partial<ModeState>),
                class12: migrateModeState(modesObj.class12 as Partial<ModeState>),
                dropper: migrateModeState(modesObj.dropper as Partial<ModeState>),
            },
            schemaVersion: 2,
        };
    }
    // v1 shape: flat single-mode state. Collapse into modes.dropper.
    return {
        currentMode: 'dropper',
        modes: {
            class11: emptyModeState(),
            class12: emptyModeState(),
            dropper: migrateModeState(obj as Partial<ModeState>),
        },
        schemaVersion: 2,
    };
}

function readLocal(): FullPlannerState | null {
    if (typeof window === 'undefined') return null;
    try {
        let raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            for (const k of LEGACY_KEYS) {
                const legacy = localStorage.getItem(k);
                if (legacy) { raw = legacy; break; }
            }
        }
        if (!raw) return null;
        const obj = JSON.parse(raw);
        return migrate(obj);
    } catch {
        return null;
    }
}
function writeLocal(state: FullPlannerState) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
}

// "Empty" means the student has done ZERO customization or activity in this
// MODE. Per-mode emptiness is what matters for the sign-in merge decision.
function isModeEmpty(s: ModeState): boolean {
    return (
        s.completed.length === 0 &&
        Object.keys(s.deadlines).length === 0 &&
        Object.keys(s.chapterDays).length === 0 &&
        Object.keys(s.diagnostic).length === 0 &&
        Object.keys(s.notes).length === 0 &&
        Object.keys(s.stars).length === 0 &&
        Object.keys(s.customResources).length === 0 &&
        Object.keys(s.revisionStages).length === 0 &&
        PLANNER_SUBJECTS.every((sub) => (s.roadmapOrder[sub]?.length ?? 0) === 0) &&
        PLANNER_SUBJECTS.every((sub) => Object.keys(s.bufferBlocks[sub] ?? {}).length === 0) &&
        s.lastAccessedChapter === null &&
        s.streak.count === 0 &&
        !s.settings.targetDate
    );
}

function isFullEmpty(s: FullPlannerState): boolean {
    return PLANNER_MODES.every((m) => isModeEmpty(s.modes[m]));
}

function mergeModeStates(local: ModeState, server: ModeState): ModeState {
    const completed = Array.from(new Set([...local.completed, ...server.completed]));
    const customResources: ModeState['customResources'] = { ...server.customResources };
    for (const [ch, list] of Object.entries(local.customResources)) {
        const byId = new Map((customResources[ch] ?? []).map((r) => [r.id, r]));
        for (const r of list) byId.set(r.id, r);
        customResources[ch] = Array.from(byId.values());
    }
    const stars: ModeState['stars'] = { ...server.stars };
    for (const [ch, list] of Object.entries(local.stars)) {
        stars[ch] = Array.from(new Set([...(stars[ch] ?? []), ...list]));
    }
    const weekActivity = Array.from(new Set([...(server.weekActivity ?? []), ...local.weekActivity])).sort().slice(-WEEK_HISTORY);
    // Per-subject: local order wins when the student has customized that subject;
    // buffers union per subject (local entries override on id collision).
    const roadmapOrder = {} as Record<Subject, string[]>;
    const bufferBlocks = {} as Record<Subject, Record<string, { days: number }>>;
    for (const sub of PLANNER_SUBJECTS) {
        const lo = local.roadmapOrder[sub] ?? [];
        const so = server.roadmapOrder[sub] ?? [];
        roadmapOrder[sub] = lo.length > 0 ? lo : so;
        bufferBlocks[sub] = { ...(server.bufferBlocks[sub] ?? {}), ...(local.bufferBlocks[sub] ?? {}) };
    }
    return {
        // local wins — the student's most recent subject choice on this device
        // beats the server snapshot (same pattern as lastAccessedChapter).
        currentSubject: local.currentSubject ?? server.currentSubject ?? 'chemistry',
        completed,
        deadlines: { ...server.deadlines, ...local.deadlines },
        chapterDays: { ...server.chapterDays, ...local.chapterDays },
        diagnostic: { ...server.diagnostic, ...local.diagnostic },
        notes: { ...server.notes, ...local.notes },
        stars,
        customResources,
        revisionStages: { ...server.revisionStages, ...local.revisionStages },
        weekActivity,
        roadmapOrder,
        bufferBlocks,
        lastAccessedChapter: local.lastAccessedChapter ?? server.lastAccessedChapter,
        settings: { ...server.settings, ...local.settings },
        streak: local.streak.count >= server.streak.count ? local.streak : server.streak,
    };
}

// Whole-document merge: per-mode merge, plus prefer local's currentMode
// (their latest explicit choice).
function mergeFullStates(local: FullPlannerState, server: FullPlannerState): FullPlannerState {
    const merged = {} as Record<PlannerMode, ModeState>;
    for (const m of PLANNER_MODES) {
        const ls = local.modes[m];
        const ss = server.modes[m];
        merged[m] = isModeEmpty(ls) ? ss : isModeEmpty(ss) ? ls : mergeModeStates(ls, ss);
    }
    return { currentMode: local.currentMode, modes: merged, schemaVersion: 2 };
}

export type SyncStatus = 'idle' | 'syncing' | 'saved' | 'error' | 'offline';

export function usePlannerState() {
    // Internal state is the full multi-mode document. The hook exposes the
    // ACTIVE mode's slice as `state`, so components can stay unchanged.
    const [fullState, setFullState] = useState<FullPlannerState>(() => emptyFullState());
    const [hydrated, setHydrated] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
    const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

    const tokenRef = useRef<string | null>(null);
    const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const latest = useRef<FullPlannerState>(fullState);
    const pulledForUser = useRef<string | null>(null);

    // Derive the active-mode slice. Components read THIS as `state`.
    const mode = fullState.currentMode;
    const state = fullState.modes[mode];

    // Apply a ModeState updater to ONLY the active mode. All chapter-scoped
    // mutators below use this — they don't know or care about other modes.
    const updateModeState = useCallback((updater: (s: ModeState) => ModeState) => {
        setFullState((prev) => ({
            ...prev,
            modes: { ...prev.modes, [prev.currentMode]: updater(prev.modes[prev.currentMode]) },
        }));
    }, []);

    // Switch which mode is active. State for other modes is preserved untouched.
    const setMode = useCallback((next: PlannerMode) => {
        setFullState((prev) => (prev.currentMode === next ? prev : { ...prev, currentMode: next }));
    }, []);

    // Switch the active mode's subject (Dropper only in v1). A preference
    // change, not engagement — does NOT bump the streak / week activity.
    const setSubject = useCallback((next: Subject) => {
        updateModeState((prev) => (prev.currentSubject === next ? prev : { ...prev, currentSubject: next }));
    }, [updateModeState]);

    const push = useCallback(async (s: FullPlannerState) => {
        const token = tokenRef.current;
        if (!token) return;
        setSyncStatus('syncing');
        try {
            const res = await fetch(ENDPOINT, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ state: s }),
            });
            if (res.ok) {
                setSyncStatus('saved');
                setLastSyncedAt(Date.now());
            } else {
                setSyncStatus('error');
            }
        } catch {
            setSyncStatus('offline');
        }
    }, []);

    // Pull server state and merge with current local state. Called both on
    // initial mount (if a session already exists) AND on sign-in mid-session.
    //
    // IMPORTANT: We merge against `latest.current` — NOT a captured local
    // snapshot. If the student types into a notes textarea between the GET
    // request leaving and the response arriving, those keystrokes are in
    // `latest.current` and SURVIVE the merge. Using a stale snapshot was the
    // bug that silently lost in-flight edits during sign-in.
    const pullAndMerge = useCallback(
        async (token: string, userId: string) => {
            if (pulledForUser.current === userId) return;
            pulledForUser.current = userId;
            try {
                const res = await fetch(ENDPOINT, { headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) return;
                const data = await res.json();
                const server: FullPlannerState | null = data?.state ? migrate(data.state) : null;
                if (!server) {
                    if (!isFullEmpty(latest.current)) push(latest.current);
                    return;
                }
                const current = latest.current;
                const merged = isFullEmpty(current) ? server : mergeFullStates(current, server);
                setFullState(merged);
                latest.current = merged;
                writeLocal(merged);
                push(merged);
            } catch {
                setSyncStatus('offline');
            }
        },
        [push]
    );

    // hydrate
    useEffect(() => {
        let cancelled = false;
        const local = readLocal() ?? emptyFullState();
        setFullState(local);
        latest.current = local;
        setHydrated(true);

        const supabase = createClient();
        if (!supabase) return;
        (async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (cancelled || !session?.access_token || !session.user?.id) return;
            tokenRef.current = session.access_token;
            setIsAuthed(true);
            await pullAndMerge(session.access_token, session.user.id);
        })();

        // Sign-in mid-session: re-pull from the server so the student sees
        // their existing work. Sign-out clears the cache so a different user
        // signing in next gets a fresh pull.
        const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
            tokenRef.current = session?.access_token ?? null;
            const wasAuthed = !!pulledForUser.current;
            const nowAuthed = !!session?.access_token;
            setIsAuthed(nowAuthed);
            if (!nowAuthed) {
                pulledForUser.current = null;
                setSyncStatus('idle');
                return;
            }
            // Only re-pull on actual sign-in or sign-up — not on token refresh
            // for an already-pulled user.
            const uid = session?.user?.id;
            if (uid && (!wasAuthed || event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
                pullAndMerge(session.access_token!, uid);
            }
        });
        return () => {
            cancelled = true;
            sub.subscription.unsubscribe();
            if (syncTimer.current) clearTimeout(syncTimer.current);
        };
    }, [pullAndMerge]);

    // persist + debounced sync
    useEffect(() => {
        if (!hydrated) return;
        latest.current = fullState;
        writeLocal(fullState);
        if (!isAuthed) return;
        if (syncTimer.current) clearTimeout(syncTimer.current);
        syncTimer.current = setTimeout(() => push(latest.current), SYNC_DEBOUNCE_MS);
    }, [fullState, hydrated, isAuthed, push]);

    // Mark any meaningful student action — bumps streak + records week activity.
    const withActivity = useCallback((s: ModeState): ModeState => {
        const t = todayISO();
        const last = s.streak.lastActiveDate;
        if (last === t) return s;
        const wasYesterday = last === addDaysISO(t, -1);
        const week = [...s.weekActivity, t].filter((v, i, a) => a.indexOf(v) === i).sort().slice(-WEEK_HISTORY);
        return {
            ...s,
            streak: { count: wasYesterday ? s.streak.count + 1 : 1, lastActiveDate: t },
            weekActivity: week,
        };
    }, []);

    // Stamp a chapter as "where the student was actively working." This is the
    // marker the dashboard's "Pick up · X" CTA reads. ONLY call this from
    // mutators that ACTUALLY change chapter data — never from pure navigation,
    // since browsing in and out of a chapter from the rail isn't engagement.
    const touchChapter = useCallback((s: ModeState, chapterId: string): ModeState => {
        if (s.lastAccessedChapter === chapterId) return s;
        return { ...s, lastAccessedChapter: chapterId };
    }, []);

    const completedSet = useMemo(() => new Set(state.completed), [state.completed]);

    const isStepDone = useCallback(
        (chapterId: string, step: LoopStep) => completedSet.has(stepId(chapterId, step)),
        [completedSet]
    );

    // Toggle a loop step. Side-effects:
    //  - First completion of `learn` schedules stage 0 revision for tomorrow.
    //  - First completion of `retest` advances stage if a revision entry exists.
    const toggleStep = useCallback(
        (chapterId: string, step: LoopStep) => {
            updateModeState((prev) => {
                const id = stepId(chapterId, step);
                const has = prev.completed.includes(id);
                const completed = has ? prev.completed.filter((x) => x !== id) : [...prev.completed, id];
                let revisionStages = prev.revisionStages;

                if (!has && step === 'learn' && !prev.revisionStages[chapterId]) {
                    const t = todayISO();
                    revisionStages = {
                        ...revisionStages,
                        [chapterId]: { stage: 0, dueOn: addDaysISO(t, REV_INTERVALS[0]), lastOn: t },
                    };
                }
                return touchChapter(withActivity({ ...prev, completed, revisionStages }), chapterId);
            });
        },
        [updateModeState, withActivity, touchChapter]
    );

    // "Recalled it" — advance stage and reschedule by the next interval.
    const reviseRecalled = useCallback((chapterId: string) => {
        updateModeState((prev) => {
            const t = todayISO();
            const entry = prev.revisionStages[chapterId];
            const cur = entry?.stage ?? 0;
            const ns = Math.min(cur + 1, REV_INTERVALS.length);
            const interval = REV_INTERVALS[Math.min(ns, REV_INTERVALS.length - 1)];
            return touchChapter(withActivity({
                ...prev,
                revisionStages: {
                    ...prev.revisionStages,
                    [chapterId]: { stage: ns, dueOn: addDaysISO(t, interval), lastOn: t },
                },
            }), chapterId);
        });
    }, [updateModeState, withActivity, touchChapter]);

    // "Forgot — reset" — back to stage 0, due tomorrow.
    const reviseForgot = useCallback((chapterId: string) => {
        updateModeState((prev) => {
            const t = todayISO();
            return touchChapter(withActivity({
                ...prev,
                revisionStages: {
                    ...prev.revisionStages,
                    [chapterId]: { stage: 0, dueOn: addDaysISO(t, REV_INTERVALS[0]), lastOn: t },
                },
            }), chapterId);
        });
    }, [updateModeState, withActivity, touchChapter]);

    const toggleCustomDone = useCallback(
        (chapterId: string, id: string) => {
            updateModeState((prev) => {
                const mid = customModuleId(chapterId, id);
                const has = prev.completed.includes(mid);
                const completed = has ? prev.completed.filter((x) => x !== mid) : [...prev.completed, mid];
                return touchChapter(withActivity({ ...prev, completed }), chapterId);
            });
        },
        [updateModeState, withActivity, touchChapter]
    );
    const isCustomDone = useCallback(
        (chapterId: string, id: string) => completedSet.has(customModuleId(chapterId, id)),
        [completedSet]
    );

    const setDeadline = useCallback((chapterId: string, iso: string | null) => {
        updateModeState((prev) => {
            const deadlines = { ...prev.deadlines };
            if (iso) deadlines[chapterId] = iso;
            else delete deadlines[chapterId];
            return touchChapter({ ...prev, deadlines }, chapterId);
        });
    }, [updateModeState, touchChapter]);

    // Override a chapter's study-day count in the roadmap. Clamped to
    // [CHAPTER_DAYS_MIN, CHAPTER_DAYS_MAX]. The roadmap layout reads this and
    // re-flows the timeline + buffer pool dynamically. Not engagement — no
    // streak bump.
    const setChapterDays = useCallback((chapterId: string, days: number) => {
        const clamped = Math.max(CHAPTER_DAYS_MIN, Math.min(CHAPTER_DAYS_MAX, Math.round(days)));
        updateModeState((prev) => ({
            ...prev,
            chapterDays: { ...prev.chapterDays, [chapterId]: clamped },
        }));
    }, [updateModeState]);

    const setRating = useCallback((chapterId: string, value: Diagnostic | null) => {
        updateModeState((prev) => {
            const diagnostic = { ...prev.diagnostic };
            if (value) diagnostic[chapterId] = value;
            else delete diagnostic[chapterId];
            return touchChapter({ ...prev, diagnostic }, chapterId);
        });
    }, [updateModeState, touchChapter]);

    const setNote = useCallback((chapterId: string, note: string) => {
        updateModeState((prev) => {
            const notes = { ...prev.notes };
            const trimmed = note.slice(0, 4000);
            if (trimmed) notes[chapterId] = trimmed;
            else delete notes[chapterId];
            return touchChapter({ ...prev, notes }, chapterId);
        });
    }, [updateModeState, touchChapter]);

    const isStarred = useCallback(
        (chapterId: string, resourceId: string) => (state.stars[chapterId] ?? []).includes(resourceId),
        [state.stars]
    );
    const toggleStar = useCallback((chapterId: string, resourceId: string) => {
        updateModeState((prev) => {
            const cur = prev.stars[chapterId] ?? [];
            const next = cur.includes(resourceId) ? cur.filter((x) => x !== resourceId) : [...cur, resourceId];
            const stars = { ...prev.stars };
            if (next.length) stars[chapterId] = next;
            else delete stars[chapterId];
            return touchChapter({ ...prev, stars }, chapterId);
        });
    }, [updateModeState, touchChapter]);

    const setTargetDate = useCallback((iso: string | null) => {
        updateModeState((prev) => {
            const settings = { ...prev.settings };
            if (iso) {
                settings.targetDate = iso;
                if (!settings.startDate) settings.startDate = todayISO();
            } else {
                delete settings.targetDate;
            }
            return { ...prev, settings };
        });
    }, [updateModeState]);

    const addCustomResource = useCallback(
        (chapterId: string, input: { label: string; kind: ResourceKind; url: string }): { ok: boolean; error?: string } => {
            const parsed = parseResourceUrl(input.url);
            if (!parsed.ok) return { ok: false, error: 'Enter a valid https link.' };
            const label = input.label.trim().slice(0, 120) || 'My resource';
            const resource: UserResource = {
                id: newId(),
                label,
                kind: input.kind,
                url: parsed.normalizedUrl,
                embeddable: parsed.embeddable,
                addedAt: new Date().toISOString(),
            };
            let rejected = false;
            updateModeState((prev) => {
                const list = prev.customResources[chapterId] ?? [];
                if (list.length >= 10) {
                    rejected = true;
                    return prev;
                }
                return touchChapter(withActivity({
                    ...prev,
                    customResources: { ...prev.customResources, [chapterId]: [...list, resource] },
                }), chapterId);
            });
            return rejected ? { ok: false, error: 'Up to 10 of your own resources per chapter.' } : { ok: true };
        },
        [updateModeState, withActivity, touchChapter]
    );

    // --- roadmap ordering -------------------------------------------------
    // setRoadmapOrder persists the user's full preferred chapter ordering
    // (incomplete + completed). Drag-and-drop in the Smart Plan computes the
    // new full order — completed chapters keep their slots, incomplete chapters
    // fill the rest in the new visible order.
    // setRoadmapOrder also opportunistically GCs orphan buffer blocks: any
    // bufferBlocks entry whose ID is no longer in roadmapOrder is dropped.
    const setRoadmapOrder = useCallback((fullOrder: string[]) => {
        updateModeState((prev) => {
            const sub = prev.currentSubject;
            const stillInUse = new Set(fullOrder.filter(isBufferId));
            const nextBuffers: Record<string, { days: number }> = {};
            for (const [id, cfg] of Object.entries(prev.bufferBlocks[sub] ?? {})) {
                if (stillInUse.has(id)) nextBuffers[id] = cfg;
            }
            return {
                ...prev,
                roadmapOrder: { ...prev.roadmapOrder, [sub]: fullOrder },
                bufferBlocks: { ...prev.bufferBlocks, [sub]: nextBuffers },
            };
        });
    }, [updateModeState]);

    // Reset clears chapter customization AND user buffer blocks for the active
    // subject only. (The auto-revision breaks recompute from the default order.)
    const resetRoadmapOrder = useCallback(() => {
        updateModeState((prev) => ({
            ...prev,
            roadmapOrder: { ...prev.roadmapOrder, [prev.currentSubject]: [] },
            bufferBlocks: { ...prev.bufferBlocks, [prev.currentSubject]: {} },
        }));
    }, [updateModeState]);

    // Buffer block lifecycle. Each block lives in `bufferBlocks` (config) and
    // its ID is inserted into `roadmapOrder` (position).
    //
    // Default insertion: TOP of the roadmap. The student sees the new block
    // immediately and can drag it wherever they want. This matches the
    // affordance most familiar from todo apps and notion-style lists.
    //
    // Passing `insertAfter` overrides this — inserts immediately after that
    // chapter/buffer ID (used for "+ Add buffer here" inline affordances).
    const addBufferBlock = useCallback(
        (catalog: ChapterPlanItem[], days: number = BUFFER_BLOCK_DEFAULT_DAYS, insertAfter?: string) => {
            const clampedDays = Math.max(BUFFER_BLOCK_MIN_DAYS, Math.min(BUFFER_BLOCK_MAX_DAYS, days));
            const id = `buf_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
            updateModeState((prev) => {
                const sub = prev.currentSubject;
                const prevOrder = prev.roadmapOrder[sub] ?? [];
                // Materialize the full ordered list first so existing chapters
                // don't fall out — if the student has never customized this
                // subject's order, it's empty. Seed it with the default sort so
                // the new buffer sits in a recognizable roadmap.
                const existing = new Set(prevOrder);
                const tail = catalog
                    .filter((c) => !existing.has(c.chapterId))
                    .sort(defaultRoadmapSort)
                    .map((c) => c.chapterId);
                const order = [...prevOrder, ...tail];
                let pos = 0; // default: top of list
                if (insertAfter) {
                    const i = order.indexOf(insertAfter);
                    if (i >= 0) pos = i + 1;
                }
                order.splice(pos, 0, id);
                return {
                    ...prev,
                    roadmapOrder: { ...prev.roadmapOrder, [sub]: order },
                    bufferBlocks: { ...prev.bufferBlocks, [sub]: { ...(prev.bufferBlocks[sub] ?? {}), [id]: { days: clampedDays } } },
                };
            });
            return id;
        },
        [updateModeState]
    );

    const removeBufferBlock = useCallback((id: string) => {
        updateModeState((prev) => {
            const sub = prev.currentSubject;
            const order = (prev.roadmapOrder[sub] ?? []).filter((x) => x !== id);
            const nextBuffers = { ...(prev.bufferBlocks[sub] ?? {}) };
            delete nextBuffers[id];
            return {
                ...prev,
                roadmapOrder: { ...prev.roadmapOrder, [sub]: order },
                bufferBlocks: { ...prev.bufferBlocks, [sub]: nextBuffers },
            };
        });
    }, [updateModeState]);

    const setBufferBlockDays = useCallback((id: string, days: number) => {
        const clamped = Math.max(BUFFER_BLOCK_MIN_DAYS, Math.min(BUFFER_BLOCK_MAX_DAYS, days));
        updateModeState((prev) => {
            const sub = prev.currentSubject;
            const subBuffers = prev.bufferBlocks[sub] ?? {};
            if (!subBuffers[id]) return prev;
            return { ...prev, bufferBlocks: { ...prev.bufferBlocks, [sub]: { ...subBuffers, [id]: { days: clamped } } } };
        });
    }, [updateModeState]);

    const removeCustomResource = useCallback((chapterId: string, id: string) => {
        updateModeState((prev) => {
            const list = (prev.customResources[chapterId] ?? []).filter((r) => r.id !== id);
            const customResources = { ...prev.customResources };
            if (list.length) customResources[chapterId] = list;
            else delete customResources[chapterId];
            const mid = customModuleId(chapterId, id);
            const stars = { ...prev.stars };
            if (stars[chapterId]) {
                const filtered = stars[chapterId].filter((x) => x !== id);
                if (filtered.length) stars[chapterId] = filtered;
                else delete stars[chapterId];
            }
            return touchChapter({
                ...prev,
                customResources,
                stars,
                completed: prev.completed.filter((x) => x !== mid),
            }, chapterId);
        });
    }, [updateModeState, touchChapter]);

    return {
        state,
        mode,
        setMode,
        subject: state.currentSubject,
        setSubject,
        hydrated,
        isAuthed,
        syncStatus,
        lastSyncedAt,
        completedSet,
        today: todayISO(),
        isStepDone,
        toggleStep,
        reviseRecalled,
        reviseForgot,
        isCustomDone,
        toggleCustomDone,
        setDeadline,
        setChapterDays,
        setRating,
        setNote,
        isStarred,
        toggleStar,
        setTargetDate,
        addCustomResource,
        removeCustomResource,
        setRoadmapOrder,
        resetRoadmapOrder,
        addBufferBlock,
        removeBufferBlock,
        setBufferBlockDays,
    };
}

export type PlannerStateApi = ReturnType<typeof usePlannerState>;
