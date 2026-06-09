// PlannerState shape + pure derivations. No React, no browser APIs — every function
// takes its inputs explicitly (including `todayISO`) so it is trivially testable and
// safe to import anywhere (client, server validator, tests).

import type { ChapterPlanItem, LoopStep, ResourceKind, Subject } from '../planner-data';
import { AUTO_REVISION_DAYS, AUTO_REVISION_EVERY_N_CHAPTERS, LOOP_STEPS, stepId } from '../planner-data';

// Three planner modes, one product. Each has its own state slice + own
// catalog filter + own default deadline.
export type PlannerMode = 'class11' | 'class12' | 'dropper';
export const PLANNER_MODES: PlannerMode[] = ['class11', 'class12', 'dropper'];

// Default target dates per mode (when the syllabus phase ends).
//  - Dropper:  Dec 1, 2026 — JEE Main Attempt 1 in January
//  - Class 12: Dec 25, 2026 — pre-boards start in January
//  - Class 11: Jan 10, 2027 — school finals in February
export const DEFAULT_TARGET_DATES: Record<PlannerMode, string> = {
    dropper: '2026-12-01',
    class12: '2026-12-25',
    class11: '2027-01-10',
};

// Mode metadata for the switcher + topbar subtitle + per-mode SEO.
export const MODE_META: Record<PlannerMode, { label: string; subtitle: string; accent: string }> = {
    class11: { label: 'Class 11', subtitle: 'Class 11 · Chemistry', accent: '#34d399' },  // emerald
    class12: { label: 'Class 12', subtitle: 'Class 12 · with Class 11 revision', accent: '#6aa6ff' },  // cool blue
    dropper: { label: 'Dropper', subtitle: 'JEE 2027 · Chemistry', accent: '#e8954a' },  // warm orange
};

// Legacy export kept for any caller still referencing it.
export const DEFAULT_REVISION_START = DEFAULT_TARGET_DATES.dropper;

// Buffer block sizing constraints. Each block represents a contiguous gap
// (sick days, family events, mock prep) the student carves out of the pool.
export const BUFFER_BLOCK_DEFAULT_DAYS = 3;
export const BUFFER_BLOCK_MIN_DAYS = 1;
export const BUFFER_BLOCK_MAX_DAYS = 14;

export const isBufferId = (id: string) => id.startsWith('buf_');
export const isChapterId = (id: string) => !isBufferId(id);

export type Diagnostic = 'strong' | 'weak' | 'new';

export type UserResource = {
    id: string;
    label: string;
    kind: ResourceKind;
    url: string;
    embeddable: boolean;
    addedAt: string;
};

// 5-stage spaced repetition (1 → 3 → 7 → 21 → 45 days). After stage 5 a chapter is
// "Mastered" and stays out of the queue unless reset by a Forgot tap.
export const REV_INTERVALS = [1, 3, 7, 21, 45];
export const REV_STAGE_LABEL = ['1 day', '3 days', '1 week', '3 weeks', '6 weeks', 'Mastered'];
export const REV_STAGE_SHORT = [
    'Recall · day-1 gap',
    'Recall · 3-day gap',
    'Recall · 1-week gap',
    'Recall · 3-week gap',
    'Recall · 6-week gap',
    'Mastered',
];

export type RevisionEntry = {
    stage: number;     // 0..5  (5 = mastered)
    dueOn: string;     // ISO yyyy-mm-dd
    lastOn: string;    // ISO yyyy-mm-dd of last revision (or initial schedule)
};

export type PlannerSettings = {
    targetDate?: string;   // ISO yyyy-mm-dd
    startDate?: string;    // ISO yyyy-mm-dd (set when targetDate first set)
    track?: 'jee_main' | 'jee_advanced' | 'neet';
};

// Per-mode state slice. Same shape as the old single-mode PlannerState — every
// helper in this file operates on a ModeState, so existing logic doesn't change.
export type ModeState = {
    // The subject this mode is currently showing. Only Dropper exposes a
    // switcher (chemistry | physics | math); class11/class12 stay 'chemistry'
    // for v1. Per-mode and independent — see the Phase-5 handoff. All other
    // state (completed, deadlines, …) is shared across subjects within a mode;
    // chapter IDs are subject-unique so they never collide.
    currentSubject: Subject;
    completed: string[];                          // step ids + custom module ids
    deadlines: Record<string, string>;            // chapterId -> ISO date ("Do by")
    // Student override of the per-chapter study-day count shown in the roadmap.
    // Absent → the catalog's ideal `daysNeeded` is used. Editing one chapter
    // dynamically re-flows the whole timeline + buffer pool.
    chapterDays: Record<string, number>;          // chapterId -> days
    diagnostic: Record<string, Diagnostic>;       // chapterId -> Strong/Weak/New
    notes: Record<string, string>;                // chapterId -> free-form notes & doubts
    stars: Record<string, string[]>;              // chapterId -> array of resource ids starred
    customResources: Record<string, UserResource[]>;
    revisionStages: Record<string, RevisionEntry>;
    weekActivity: string[];                       // last N ISO dates the student was active (capped 30)
    // Student-customized roadmap order + buffer blocks, kept PER SUBJECT. Items
    // can be chapter IDs ('ch11_mole') or buffer IDs ('buf_…'). Buffer IDs are
    // NOT subject-unique, so a shared list leaked every buffer into every
    // subject (and dragging in one subject wiped another's order) — see the
    // 2026-06-09 bug fix. Scoping by subject isolates each subject's plan.
    roadmapOrder: Record<Subject, string[]>;
    // Buffer blocks per subject. A block exists only while present in that
    // subject's roadmapOrder; orphans are cleaned on next save.
    bufferBlocks: Record<Subject, Record<string, { days: number }>>;
    // The last chapter the student opened — drives the "Continue · X" CTA on
    // the dashboard. null when they've never opened a chapter (we fall back
    // to the next incomplete by roadmap order).
    lastAccessedChapter: string | null;
    settings: PlannerSettings;
    streak: { count: number; lastActiveDate: string };
};

// Backward-compat alias: 99% of helpers and components still operate on a
// single mode slice. The hook exposes the active mode's ModeState as `state`.
export type PlannerState = ModeState;

// Whole-document state: one slice per mode + which mode is active.
export type FullPlannerState = {
    currentMode: PlannerMode;
    modes: Record<PlannerMode, ModeState>;
    schemaVersion: 2;
};

export function emptyModeState(): ModeState {
    return {
        currentSubject: 'chemistry',
        completed: [],
        deadlines: {},
        chapterDays: {},
        diagnostic: {},
        notes: {},
        stars: {},
        customResources: {},
        revisionStages: {},
        weekActivity: [],
        roadmapOrder: { chemistry: [], physics: [], math: [] },
        bufferBlocks: { chemistry: {}, physics: {}, math: {} },
        lastAccessedChapter: null,
        settings: {},
        streak: { count: 0, lastActiveDate: '' },
    };
}

export function emptyFullState(currentMode: PlannerMode = 'dropper'): FullPlannerState {
    return {
        currentMode,
        modes: {
            class11: emptyModeState(),
            class12: emptyModeState(),
            dropper: emptyModeState(),
        },
        schemaVersion: 2,
    };
}

// Legacy single-mode emptyState — kept for callers that still expect the
// flat shape. Now identical to emptyModeState() (schemaVersion is a property
// of FullPlannerState, not the per-mode slice).
export const emptyState = emptyModeState;

// --- date helpers (ISO yyyy-mm-dd, UTC-noon to dodge DST) ------------------
const MS_DAY = 86_400_000;
function toEpochDay(iso: string): number | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (!m) return null;
    const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12);
    return Math.floor(t / MS_DAY);
}
export function daysBetween(fromISO: string, toISO: string): number | null {
    const a = toEpochDay(fromISO);
    const b = toEpochDay(toISO);
    if (a === null || b === null) return null;
    return b - a;
}
export function addDaysISO(iso: string, days: number): string {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (!m) return iso;
    const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12));
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
}

// --- completion derivations ----------------------------------------------
export function chapterStepsDone(chapterId: string, completed: Set<string>): number {
    let n = 0;
    for (const s of LOOP_STEPS) if (completed.has(stepId(chapterId, s.id))) n++;
    return n;
}
export function chapterPct(chapterId: string, completed: Set<string>): number {
    return (chapterStepsDone(chapterId, completed) / LOOP_STEPS.length) * 100;
}
export function isChapterDone(chapterId: string, completed: Set<string>): boolean {
    return chapterStepsDone(chapterId, completed) >= LOOP_STEPS.length;
}

export function nextStepLabel(chapterId: string, completed: Set<string>): string {
    const labels: Record<LoopStep, string> = { learn: 'Learn', apply: 'Apply', practice: 'Practice', revise: 'Revise' };
    for (const s of LOOP_STEPS) {
        if (!completed.has(stepId(chapterId, s.id))) return labels[s.id];
    }
    return 'Done';
}

export function overallProgress(catalog: ChapterPlanItem[], completed: Set<string>) {
    const total = catalog.length * LOOP_STEPS.length;
    let done = 0;
    for (const ch of catalog) done += chapterStepsDone(ch.chapterId, completed);
    return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

// Progress per sidebar group (chemistry → Physical/Inorganic/Organic/Practical,
// physics → Physics, math → Algebra/Calculus/…). Groups appear in first-seen
// catalog order, which for chemistry is Physical → Inorganic → Organic →
// Practical (matching the historical fixed order).
export type DimensionStat = { group: string; done: number; total: number; pct: number };
export function dimensionStats(catalog: ChapterPlanItem[], completed: Set<string>): DimensionStat[] {
    const order: string[] = [];
    const byGroup = new Map<string, ChapterPlanItem[]>();
    for (const c of catalog) {
        let list = byGroup.get(c.group);
        if (!list) { list = []; byGroup.set(c.group, list); order.push(c.group); }
        list.push(c);
    }
    return order.map((group) => {
        const chs = byGroup.get(group)!;
        const total = chs.length * LOOP_STEPS.length;
        let done = 0;
        for (const c of chs) done += chapterStepsDone(c.chapterId, completed);
        return { group, done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
    });
}

export function groupPct(
    catalog: ChapterPlanItem[],
    completed: Set<string>,
    classLevel: 11 | 12,
    category: ChapterPlanItem['category']
): number {
    const list = catalog.filter((c) => c.classLevel === classLevel && c.category === category);
    if (!list.length) return 0;
    const sum = list.reduce((a, c) => a + chapterPct(c.chapterId, completed), 0);
    return sum / list.length;
}

// --- ordering: syllabus sequence (Class 11 → 12); respects user customization ---
// Class 11 chapters come before Class 12 (foundational concepts first). Within
// each class, chapters appear in their natural NCERT syllabus order — so a
// student walks through Mole → Atom → Periodic → Bonding → Thermo → Equilibrium →
// Redox the way the textbook teaches them.
//
// High-yield, must-do, and weightage % are PURELY informational tags shown on
// each chapter chip — they do NOT influence the default sort. Students who want
// to prioritise differently use the up/down move buttons in the roadmap.
export function defaultRoadmapSort(a: ChapterPlanItem, b: ChapterPlanItem): number {
    if (a.classLevel !== b.classLevel) return a.classLevel - b.classLevel;
    return a.sequence - b.sequence;
}

// roadmapOrder + bufferBlocks are per-subject. A subject-filtered catalog tells
// us which slice to read (all items in a filtered catalog share a subject).
export function subjectOf(catalog: ChapterPlanItem[]): Subject {
    return catalog[0]?.subject ?? 'chemistry';
}
export function roadmapOrderFor(state: PlannerState, catalog: ChapterPlanItem[]): string[] {
    return state.roadmapOrder?.[subjectOf(catalog)] ?? [];
}
export function bufferBlocksFor(state: PlannerState, catalog: ChapterPlanItem[]): Record<string, { days: number }> {
    return state.bufferBlocks?.[subjectOf(catalog)] ?? {};
}

// Authoritative chapter ordering for everywhere we show a priority sequence:
//  - Anything the student has manually placed in `roadmapOrder` keeps that
//    position (in that order).
//  - Anything else gets appended by the default sort.
// This preserves stability when new chapters are added to the taxonomy: they
// flow to the end of the user's custom order, sorted naturally.
export function orderedCatalog(catalog: ChapterPlanItem[], state: PlannerState): ChapterPlanItem[] {
    const byId = new Map(catalog.map((c) => [c.chapterId, c]));
    const seen = new Set<string>();
    const ordered: ChapterPlanItem[] = [];
    for (const id of roadmapOrderFor(state, catalog)) {
        const c = byId.get(id);
        if (c && !seen.has(id)) {
            ordered.push(c);
            seen.add(id);
        }
    }
    const rest = catalog.filter((c) => !seen.has(c.chapterId)).sort(defaultRoadmapSort);
    return [...ordered, ...rest];
}

export function priorityIncomplete(
    catalog: ChapterPlanItem[],
    state: PlannerState,
    completed: Set<string>
): ChapterPlanItem[] {
    return orderedCatalog(catalog, state).filter((c) => !isChapterDone(c.chapterId, completed));
}

export function nextChapter(
    catalog: ChapterPlanItem[],
    state: PlannerState,
    completed: Set<string>
): ChapterPlanItem {
    return priorityIncomplete(catalog, state, completed)[0] || catalog[0];
}

// --- at-risk (deadline missed, not done) ---------------------------------
export type AtRiskChapter = { chapterId: string; name: string; deadline: string; overdueBy: number };
export function chaptersAtRisk(
    catalog: ChapterPlanItem[],
    state: PlannerState,
    completed: Set<string>,
    todayISO: string
): AtRiskChapter[] {
    const out: AtRiskChapter[] = [];
    for (const ch of catalog) {
        const deadline = state.deadlines[ch.chapterId];
        if (!deadline) continue;
        if (isChapterDone(ch.chapterId, completed)) continue;
        const diff = daysBetween(todayISO, deadline);
        if (diff === null || diff > 0) continue;
        out.push({ chapterId: ch.chapterId, name: ch.name, deadline, overdueBy: -diff });
    }
    return out.sort((a, b) => b.overdueBy - a.overdueBy);
}

// --- revision queue (5-stage spaced repetition) --------------------------
export type RevisionBucket = 'due' | 'tomorrow' | 'week' | 'later';

export type RevisionItem = {
    chapter: ChapterPlanItem;
    stage: number;
    dueOn: string;
    lastOn: string;
    ago: number;        // days since last revision (or first schedule)
    bucket: RevisionBucket;
};

function bucketFor(dueOn: string, todayISO: string): RevisionBucket {
    const d = daysBetween(todayISO, dueOn) ?? 99;
    if (d <= 0) return 'due';
    if (d === 1) return 'tomorrow';
    if (d <= 7) return 'week';
    return 'later';
}

export function revisionEntries(
    catalog: ChapterPlanItem[],
    state: PlannerState,
    todayISO: string
): RevisionItem[] {
    const out: RevisionItem[] = [];
    for (const ch of catalog) {
        const rev = state.revisionStages[ch.chapterId];
        if (!rev) continue;
        const ago = daysBetween(rev.lastOn, todayISO) ?? 0;
        out.push({ chapter: ch, stage: rev.stage, dueOn: rev.dueOn, lastOn: rev.lastOn, ago, bucket: bucketFor(rev.dueOn, todayISO) });
    }
    return out;
}

export function revisionDue(
    catalog: ChapterPlanItem[],
    state: PlannerState,
    todayISO: string
): RevisionItem[] {
    return revisionEntries(catalog, state, todayISO)
        .filter((r) => r.bucket === 'due')
        .sort((a, b) => (a.dueOn < b.dueOn ? -1 : 1));
}

export function revisionRetention(items: RevisionItem[]): number {
    if (items.length === 0) return 0;
    const advanced = items.filter((r) => r.stage >= 2).length;
    return Math.round((advanced / items.length) * 100);
}

// --- reverse-planner pace -------------------------------------------------
export type Pace = {
    hasTarget: boolean;
    targetDate?: string;
    daysLeft: number;
    weeksLeft: number;
    remainingChapters: number;
    neededPerWeek: number;
    completedChapters: number;
    onTrack: boolean;
    suggested: string[];
};

export function computePace(
    catalog: ChapterPlanItem[],
    state: PlannerState,
    completed: Set<string>,
    todayISO: string
): Pace {
    const completedChapters = catalog.filter((c) => isChapterDone(c.chapterId, completed)).length;
    const incomplete = priorityIncomplete(catalog, state, completed);
    const remainingChapters = incomplete.length;

    const target = state.settings.targetDate;
    if (!target) {
        return {
            hasTarget: false,
            daysLeft: 0,
            weeksLeft: 0,
            remainingChapters,
            neededPerWeek: 0,
            completedChapters,
            onTrack: true,
            suggested: [],
        };
    }

    const daysLeft = Math.max(0, daysBetween(todayISO, target) ?? 0);
    const weeksLeft = Math.max(1, Math.ceil(daysLeft / 7));
    const neededPerWeek = remainingChapters === 0 ? 0 : Math.ceil(remainingChapters / weeksLeft);
    return {
        hasTarget: true,
        targetDate: target,
        daysLeft,
        weeksLeft,
        remainingChapters,
        neededPerWeek,
        completedChapters,
        onTrack: neededPerWeek <= 2,
        suggested: incomplete.slice(0, Math.max(neededPerWeek, 1)).map((c) => c.chapterId),
    };
}

// --- roadmap layout (chapters + auto-revision + user buffer) -------------
// A single ordered timeline with three item kinds:
//  - 'chapter'        — a chapter consuming chapter.daysNeeded days
//  - 'auto-revision'  — system-inserted 2-day consolidation after every 3 chapters
//                       (NOT draggable; recomputed each render)
//  - 'buffer'         — student-created buffer block (draggable, removable, resizable)
//
// Each item carries `startDate` (ISO) and `days`. The walker accumulates from
// `todayISO`, so the dates always reflect the live cursor.
export type RoadmapItem =
    | { kind: 'chapter'; chapter: ChapterPlanItem; days: number; startDate: string; endDate: string }
    | { kind: 'auto-revision'; id: string; days: number; startDate: string; endDate: string; afterCount: number }
    | { kind: 'buffer'; id: string; days: number; startDate: string; endDate: string };

export type RoadmapLayout = {
    items: RoadmapItem[];
    // raw day counts
    chapterDaysSum: number;       // sum of incomplete chapter.daysNeeded
    autoRevisionDays: number;     // breaks * 2
    placedBufferDays: number;     // sum of user buffer block days currently in roadmap
    // budget
    totalAvailableDays: number;   // days between today and target
    bufferPool: number;           // totalAvailableDays - chapterDaysSum - autoRevisionDays
    bufferAvailable: number;      // bufferPool - placedBufferDays  (clamped >= 0)
    overflowDays: number;         // amount we exceed totalAvailableDays (0 if within budget)
    endDate: string;              // when chapters + breaks + placed buffer end
};

export function computeRoadmapLayout(
    catalog: ChapterPlanItem[],
    state: PlannerState,
    completed: Set<string>,
    todayISO: string,
    targetISO: string
): RoadmapLayout {
    // Effective ordered list, including buffer IDs. Whatever the student has
    // listed wins (chapters + buffer positions); any catalog chapters NOT yet
    // in roadmapOrder get appended at the end via the default sort. This
    // guarantees that adding a buffer at position 0 doesn't make chapters
    // disappear from the roadmap.
    const subjectOrder = roadmapOrderFor(state, catalog);
    const subjectBuffers = bufferBlocksFor(state, catalog);
    const byChapterId = new Map(catalog.map((c) => [c.chapterId, c]));
    const seen = new Set(subjectOrder);
    const tail = catalog
        .filter((c) => !seen.has(c.chapterId))
        .sort(defaultRoadmapSort)
        .map((c) => c.chapterId);
    const order = [...subjectOrder, ...tail];

    const incompleteChapterIds = new Set(
        catalog.filter((c) => !isChapterDone(c.chapterId, completed)).map((c) => c.chapterId)
    );
    const totalIncomplete = incompleteChapterIds.size;

    const items: RoadmapItem[] = [];
    let cursor = todayISO;
    let chapterCount = 0;

    const push = (it: RoadmapItem) => {
        items.push(it);
        cursor = addDaysISO(cursor, Math.max(1, it.days));
    };
    const rangeEnd = (days: number) => addDaysISO(cursor, Math.max(1, days) - 1);

    for (const id of order) {
        if (isBufferId(id)) {
            const cfg = subjectBuffers[id];
            if (!cfg) continue;
            push({ kind: 'buffer', id, days: cfg.days, startDate: cursor, endDate: rangeEnd(cfg.days) });
            continue;
        }
        if (!incompleteChapterIds.has(id)) continue;
        const ch = byChapterId.get(id);
        if (!ch) continue;
        // Student-edited day count wins over the catalog ideal; this is what
        // makes the timeline + buffer pool re-flow when a chapter is resized.
        const effDays = state.chapterDays?.[id] ?? ch.daysNeeded;
        push({ kind: 'chapter', chapter: ch, days: effDays, startDate: cursor, endDate: rangeEnd(effDays) });
        chapterCount++;
        if (
            chapterCount % AUTO_REVISION_EVERY_N_CHAPTERS === 0 &&
            chapterCount < totalIncomplete
        ) {
            push({
                kind: 'auto-revision',
                id: `auto_rev_${chapterCount}`,
                days: AUTO_REVISION_DAYS,
                afterCount: chapterCount,
                startDate: cursor,
                endDate: rangeEnd(AUTO_REVISION_DAYS),
            });
        }
    }

    // Tally
    let chapterDaysSum = 0;
    let autoRevisionDays = 0;
    let placedBufferDays = 0;
    for (const it of items) {
        if (it.kind === 'chapter') chapterDaysSum += it.days;
        else if (it.kind === 'auto-revision') autoRevisionDays += it.days;
        else placedBufferDays += it.days;
    }

    const totalAvailableDays = Math.max(0, daysBetween(todayISO, targetISO) ?? 0);
    const bufferPool = Math.max(0, totalAvailableDays - chapterDaysSum - autoRevisionDays);
    const bufferAvailable = Math.max(0, bufferPool - placedBufferDays);
    const usedDays = chapterDaysSum + autoRevisionDays + placedBufferDays;
    const overflowDays = Math.max(0, usedDays - totalAvailableDays);

    return {
        items,
        chapterDaysSum,
        autoRevisionDays,
        placedBufferDays,
        totalAvailableDays,
        bufferPool,
        bufferAvailable,
        overflowDays,
        endDate: cursor,
    };
}

// --- diagnostic-driven mode (unchanged from prior) ------------------------
export function stepsForChapter(chapterId: string, state: PlannerState): { primary: LoopStep[]; reviseOnly: boolean } {
    const d = state.diagnostic[chapterId];
    if (d === 'strong') return { primary: ['revise'], reviseOnly: true };
    return { primary: ['learn', 'apply', 'practice', 'revise'], reviseOnly: false };
}
