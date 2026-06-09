'use client';

import { useMemo, useState } from 'react';
import {
    CalendarDays, Layers, Calendar, RotateCw, Flame, RotateCcw, GripVertical,
    Plus, Minus, X, Shield, Clock,
} from 'lucide-react';
import {
    DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors,
    closestCenter, type DragEndEvent, type DragStartEvent,
} from '@dnd-kit/core';
import {
    SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ChapterPlanItem, LoopStep } from './planner-data';
import { LOOP_STEPS, CHAPTER_DAYS_MIN, CHAPTER_DAYS_MAX } from './planner-data';
import { TelegramCTA } from './TelegramCTA';
import {
    addDaysISO, computeRoadmapLayout, daysBetween, isBufferId, isChapterDone,
    orderedCatalog, priorityIncomplete, type PlannerState, type RoadmapItem,
} from './lib/state';

const STEP_LABEL: Record<LoopStep, string> = { learn: 'Learn', solve: 'Solve', pyq: 'PYQ', retest: 'Re-test' };

// Deterministic 3-char month abbreviation — `toLocaleDateString` returns "Sept"
// (4 chars) in en-GB which overflows the side pill. Hand-rolled gives consistent
// "14 Sep" / "30 Sep" across browsers.
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function fmtShort(iso: string): string {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (!m) return iso;
    return `${Number(m[3])} ${MONTH_SHORT[Number(m[2]) - 1]}`;
}

function startOfWeekISO(todayISO: string): string {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(todayISO);
    if (!m) return todayISO;
    const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12));
    const day = (d.getUTCDay() + 6) % 7; // Mon=0
    d.setUTCDate(d.getUTCDate() - day);
    return d.toISOString().slice(0, 10);
}

// Compute new full roadmapOrder after a drag: weave the new visible (incomplete +
// buffer) sequence back into the full catalog ordering, preserving completed
// chapter positions.
function fullOrderAfterDrag(
    currentFull: ChapterPlanItem[],
    currentBufferIds: string[],
    newVisibleOrder: string[],
    completed: Set<string>
): string[] {
    const completedSet = new Set(currentFull.filter((c) => isChapterDone(c.chapterId, completed)).map((c) => c.chapterId));
    const visibleQueue = [...newVisibleOrder];
    const allBuffers = new Set(currentBufferIds);
    const out: string[] = [];
    for (const c of currentFull) {
        if (completedSet.has(c.chapterId)) {
            out.push(c.chapterId);
            continue;
        }
        // Pop from queue, skipping buffers (they get added wherever the visibleQueue says).
        // Actually: just pop the next visible item — chapter or buffer. Completed chapters
        // are reinserted in their original catalog position separately.
        const next = visibleQueue.shift();
        if (next) out.push(next);
    }
    // Append any remaining (defensive — including buffers placed past the end).
    out.push(...visibleQueue.filter((id) => allBuffers.has(id) || true));
    return out;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type Props = {
    catalog: ChapterPlanItem[];
    state: PlannerState;
    completed: Set<string>;
    today: string;
    defaultTargetISO: string;
    eyebrow: string;
    onChapter: (id: string) => void;
    onSetTarget: (iso: string | null) => void;
    onSetOrder: (newFullOrder: string[]) => void;
    onResetOrder: () => void;
    onAddBuffer: (days?: number, insertAfter?: string) => string;
    onRemoveBuffer: (id: string) => void;
    onSetBufferDays: (id: string, days: number) => void;
    onSetChapterDays: (chapterId: string, days: number) => void;
};

export function PlanScreen({
    catalog, state, completed, today, defaultTargetISO, eyebrow, onChapter, onSetTarget, onSetOrder, onResetOrder,
    onAddBuffer, onRemoveBuffer, onSetBufferDays, onSetChapterDays,
}: Props) {
    const targetISO = state.settings.targetDate ?? defaultTargetISO;
    const daysLeft = Math.max(1, daysBetween(today, targetISO) ?? 1);
    const weeksLeft = Math.max(1, Math.ceil(daysLeft / 7));

    const layout = useMemo(
        () => computeRoadmapLayout(catalog, state, completed, today, targetISO),
        [catalog, state, completed, today, targetISO]
    );
    const incomplete = useMemo(() => priorityIncomplete(catalog, state, completed), [catalog, state, completed]);
    const hasCustomOrder = state.roadmapOrder.length > 0;

    // This-week daily grid (Mon..Sun, starting Monday of the current week).
    // Pulls steps from the next 1–2 chapters that fit in 7 days.
    const mondayISO = startOfWeekISO(today);
    const thisWeekChaps: ChapterPlanItem[] = [];
    {
        let acc = 0;
        for (const c of incomplete) {
            if (acc >= 7) break;
            thisWeekChaps.push(c);
            acc += c.daysNeeded;
        }
    }
    const tasks: { c: ChapterPlanItem; step: LoopStep }[] = [];
    for (const c of thisWeekChaps) {
        for (const s of LOOP_STEPS) {
            if (!completed.has(`${c.chapterId}:${s.id}`)) tasks.push({ c, step: s.id });
        }
    }
    const studyDays = 6;
    const perDay = Math.max(1, Math.ceil(tasks.length / studyDays));
    const days = DAY_NAMES.map((dn, i) => {
        const dateISO = addDaysISO(mondayISO, i);
        const isToday = dateISO === today;
        const rest = i === 6;
        const dayTasks = rest ? [] : tasks.slice(i * perDay, (i + 1) * perDay);
        return { dn, dateISO, isToday, rest, dayTasks, past: dateISO < today };
    });

    // --- DnD setup ---
    // Sortable items = chapters + user buffer blocks. Auto-revision items are
    // rendered between sortable items but are NOT in the sortable context.
    const sortableItems = useMemo(
        () => layout.items.filter((it) => it.kind !== 'auto-revision'),
        [layout.items]
    );
    const sortableIds = useMemo(
        () => sortableItems.map((it) => (it.kind === 'chapter' ? it.chapter.chapterId : it.id)),
        [sortableItems]
    );
    const bufferIds = useMemo(
        () => sortableItems.filter((it) => it.kind === 'buffer').map((it) => (it as { id: string }).id),
        [sortableItems]
    );

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );
    const [dragId, setDragId] = useState<string | null>(null);

    const onDragStart = (e: DragStartEvent) => setDragId(String(e.active.id));
    const onDragEnd = (e: DragEndEvent) => {
        setDragId(null);
        const { active, over } = e;
        if (!over || active.id === over.id) return;
        const oldIndex = sortableIds.indexOf(String(active.id));
        const newIndex = sortableIds.indexOf(String(over.id));
        if (oldIndex < 0 || newIndex < 0) return;
        const newVisible = arrayMove(sortableIds, oldIndex, newIndex);
        const fullOrder = fullOrderAfterDrag(orderedCatalog(catalog, state), bufferIds, newVisible, completed);
        onSetOrder(fullOrder);
    };

    return (
        <div className="dyp-wrap">
            <div className="dyp-eyebrow">{eyebrow}</div>
            <div className="dyp-plan-head">
                <h1 className="dyp-h1">Study Plan</h1>
                <ul className="dyp-plan-points">
                    <li>We&apos;ll go <b>chapter by chapter</b> — Class 11 first, then Class 12, in NCERT order.</li>
                    <li>Each chapter shows the <b>days it usually needs</b> — adjust it to suit you.</li>
                    <li>After every 3 chapters, a short <b>2-day revision break</b> so nothing fades.</li>
                    <li>Finish the syllabus by <b>{fmtShort(targetISO)}</b> — then it&apos;s full revision.</li>
                </ul>
            </div>

            <div className="dyp-plan-stats">
                <div className="dyp-pstat dyp-tone-accent">
                    <div className="dyp-ps-label">Weeks left</div>
                    <div className="dyp-ps-val">{weeksLeft}</div>
                    <div className="dyp-ps-sub">to {fmtShort(targetISO)}</div>
                </div>
                <div className="dyp-pstat dyp-tone-blue">
                    <div className="dyp-ps-label">Chapters left</div>
                    <div className="dyp-ps-val">{incomplete.length}</div>
                    <div className="dyp-ps-sub">of {catalog.length}</div>
                </div>
                <div className="dyp-pstat dyp-tone-purple">
                    <div className="dyp-ps-label">Study + check-ins</div>
                    <div className="dyp-ps-val">{layout.chapterDaysSum + layout.autoRevisionDays}<span className="dyp-ps-unit">days</span></div>
                    <div className="dyp-ps-sub">{layout.chapterDaysSum}d chapters + {layout.autoRevisionDays}d revision</div>
                </div>
                <div className={['dyp-pstat', layout.overflowDays > 0 ? 'dyp-warn' : 'dyp-good'].join(' ')}>
                    <div className="dyp-ps-label">Buffer available</div>
                    <div className="dyp-ps-val">{layout.bufferAvailable}<span className="dyp-ps-unit">days</span></div>
                    <div className="dyp-ps-sub">
                        {layout.overflowDays > 0
                            ? `over by ${layout.overflowDays}d — extend target`
                            : `${layout.placedBufferDays}d placed / ${layout.bufferPool}d total`}
                    </div>
                </div>
                <label className="dyp-target-ctl dyp-compact dyp-plan-target">
                    <Calendar size={15} className="dyp-ico" />
                    <span className="dyp-tc-label">Finish by</span>
                    <input type="date" value={targetISO} onChange={(e) => onSetTarget(e.target.value || null)} />
                </label>
            </div>

            <TelegramCTA />

            <section className="dyp-card dyp-pad dyp-mt-18">
                <div className="dyp-sec-head">
                    <CalendarDays size={18} style={{ color: 'var(--accent)' }} />
                    <h2 className="dyp-sec-title">This week</h2>
                    <span className="dyp-sec-sub">{fmtShort(mondayISO)} – {fmtShort(addDaysISO(mondayISO, 6))}</span>
                </div>
                <div className="dyp-day-grid">
                    {days.map((d, i) => (
                        <div key={i} className={['dyp-daycol', d.isToday ? 'dyp-today' : '', d.rest ? 'dyp-rest' : '', d.past ? 'dyp-past' : ''].join(' ')}>
                            <div className="dyp-day-hd">
                                <span className="dyp-day-dn">{d.dn}</span>
                                <span className="dyp-day-num">{Number(d.dateISO.slice(-2))}</span>
                            </div>
                            {d.isToday && <span className="dyp-day-tag">Today</span>}
                            {d.rest ? (
                                <div className="dyp-day-rest">Rest / catch-up</div>
                            ) : d.dayTasks.length === 0 ? (
                                <div className="dyp-day-empty">—</div>
                            ) : (
                                d.dayTasks.map((t, j) => (
                                    <button key={j} type="button" className="dyp-daytask" onClick={() => onChapter(t.c.chapterId)}>
                                        <span className="dyp-dt-step">{STEP_LABEL[t.step]}</span>
                                        <span className="dyp-dt-name">{t.c.name.split('(')[0].trim()}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section className="dyp-card dyp-pad dyp-mt-18">
                <div className="dyp-sec-head">
                    <Layers size={18} style={{ color: 'var(--accent)' }} />
                    <h2 className="dyp-sec-title">The roadmap</h2>
                    <span className="dyp-sec-sub">
                        {layout.items.filter((it) => it.kind === 'chapter').length} chapters
                        <span style={{ color: 'var(--text-4)', marginLeft: 14 }}>· drag to reorder</span>
                    </span>
                    <button
                        type="button"
                        className="dyp-sec-link"
                        onClick={() => onAddBuffer()}
                        disabled={layout.bufferAvailable < 1}
                        title={layout.bufferAvailable < 1 ? 'No buffer days available — extend target or remove a block' : 'Add a buffer block (default 3 days)'}
                        style={layout.bufferAvailable < 1 ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
                    >
                        <Plus size={13} />
                        Add buffer
                    </button>
                    {hasCustomOrder && (
                        <button type="button" className="dyp-sec-link" onClick={onResetOrder} title="Restore the default NCERT syllabus order and clear buffer blocks">
                            <RotateCcw size={13} />
                            Reset
                        </button>
                    )}
                </div>

                <div className="dyp-buffer-banner">
                    <Shield size={15} style={{ color: 'var(--c-new)' }} />
                    <div className="dyp-buf-msg">
                        <b>{layout.bufferAvailable} buffer days</b> available out of <b>{layout.bufferPool}</b>.
                        Drop them anywhere you expect breaks — sick days, family events, prep cushion — and they slide in between chapters.
                    </div>
                </div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setDragId(null)}>
                    <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                        <div className="dyp-roadmap">
                            {layout.items.map((item, i) => (
                                <RoadmapRow
                                    key={item.kind === 'chapter' ? item.chapter.chapterId : item.id}
                                    item={item}
                                    index={i}
                                    isDragging={(item.kind !== 'auto-revision') && dragId === (item.kind === 'chapter' ? item.chapter.chapterId : item.id)}
                                    onOpenChapter={onChapter}
                                    onRemoveBuffer={onRemoveBuffer}
                                    onSetBufferDays={onSetBufferDays}
                                    onSetChapterDays={onSetChapterDays}
                                    bufferAvailable={layout.bufferAvailable}
                                />
                            ))}

                            {/* Revision phase marker at the end */}
                            <div className="dyp-rweek dyp-phase">
                                <div className="dyp-rw-side">
                                    <div className="dyp-rw-no dyp-rw-rev">REV</div>
                                    <div className="dyp-rw-date">{fmtShort(targetISO)}</div>
                                </div>
                                <div className="dyp-rw-chaps">
                                    <span className="dyp-rw-phase">
                                        <RotateCw size={13} />
                                        Revision phase begins · full PYQs + mock tests
                                    </span>
                                </div>
                            </div>
                        </div>
                    </SortableContext>
                </DndContext>
            </section>
        </div>
    );
}

// --- one row ---
function RoadmapRow({
    item, isDragging, onOpenChapter, onRemoveBuffer, onSetBufferDays, onSetChapterDays, bufferAvailable,
}: {
    item: RoadmapItem;
    index: number;
    isDragging: boolean;
    onOpenChapter: (id: string) => void;
    onRemoveBuffer: (id: string) => void;
    onSetBufferDays: (id: string, days: number) => void;
    onSetChapterDays: (chapterId: string, days: number) => void;
    bufferAvailable: number;
}) {
    if (item.kind === 'auto-revision') {
        return (
            <div className="dyp-rweek dyp-auto-rev">
                <div className="dyp-rw-side">
                    <div className="dyp-rw-no dyp-rw-rev">REV</div>
                    <div className="dyp-rw-date">{fmtShort(item.startDate)}</div>
                </div>
                <div className="dyp-rw-chaps">
                    <span className="dyp-rw-revchip">
                        <RotateCw size={12} />
                        Quick revision · re-test &amp; flashcards
                        <span className="dyp-rw-days">{item.days}d</span>
                    </span>
                </div>
            </div>
        );
    }

    if (item.kind === 'buffer') {
        return (
            <BufferRow
                id={item.id}
                days={item.days}
                startDate={item.startDate}
                isDragging={isDragging}
                onRemove={() => onRemoveBuffer(item.id)}
                onSetDays={(d) => onSetBufferDays(item.id, d)}
                bufferAvailable={bufferAvailable}
            />
        );
    }

    return (
        <ChapterRow
            chapter={item.chapter}
            days={item.days}
            startDate={item.startDate}
            isDragging={isDragging}
            onOpen={() => onOpenChapter(item.chapter.chapterId)}
            onSetDays={(d) => onSetChapterDays(item.chapter.chapterId, d)}
        />
    );
}

function ChapterRow({
    chapter, days, startDate, isDragging, onOpen, onSetDays,
}: {
    chapter: ChapterPlanItem;
    days: number;
    startDate: string;
    isDragging: boolean;
    onOpen: () => void;
    onSetDays: (d: number) => void;
}) {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isSorting } =
        useSortable({ id: chapter.chapterId });
    const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition };
    return (
        <div ref={setNodeRef} style={style} className={['dyp-rweek', isDragging ? 'dyp-rweek-dragging' : '', isSorting ? 'dyp-sorting' : ''].join(' ')}>
            <div className="dyp-rw-side">
                <div className="dyp-rw-no">{fmtShort(startDate)}</div>
            </div>
            <div className="dyp-rw-chaps">
                <div className="dyp-rw-row">
                    <button
                        ref={setActivatorNodeRef}
                        type="button"
                        className="dyp-rw-handle"
                        aria-label={`Drag to reorder ${chapter.name}`}
                        title="Drag to reorder"
                        {...attributes}
                        {...listeners}
                    >
                        <GripVertical size={13} />
                    </button>
                    <button type="button" className="dyp-rw-chip" onClick={onOpen}>
                        {chapter.highYield && <Flame size={12} style={{ color: 'var(--accent)' }} />}
                        {chapter.name.split('(')[0].trim()}
                    </button>
                </div>
                {/* Editable day budget — pushed right; re-flows the whole timeline. */}
                <div className="dyp-rw-days-ctl" title="Study days for this chapter — adjust to re-flow your timeline">
                    <button
                        type="button"
                        className="dyp-day-adjust"
                        onClick={() => onSetDays(days - 1)}
                        disabled={days <= CHAPTER_DAYS_MIN}
                        aria-label={`Fewer days for ${chapter.name}`}
                    >
                        <Minus size={11} />
                    </button>
                    <span className="dyp-day-val">{days}<span className="dyp-day-unit">d</span></span>
                    <button
                        type="button"
                        className="dyp-day-adjust"
                        onClick={() => onSetDays(days + 1)}
                        disabled={days >= CHAPTER_DAYS_MAX}
                        aria-label={`More days for ${chapter.name}`}
                    >
                        <Plus size={11} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function BufferRow({
    id, days, startDate, isDragging, onRemove, onSetDays, bufferAvailable,
}: {
    id: string;
    days: number;
    startDate: string;
    isDragging: boolean;
    onRemove: () => void;
    onSetDays: (d: number) => void;
    bufferAvailable: number;
}) {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isSorting } =
        useSortable({ id });
    const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition };
    return (
        <div ref={setNodeRef} style={style} className={['dyp-rweek', 'dyp-buf-row', isDragging ? 'dyp-rweek-dragging' : '', isSorting ? 'dyp-sorting' : ''].join(' ')}>
            <div className="dyp-rw-side">
                <div className="dyp-rw-no dyp-rw-buf">BUF</div>
                <div className="dyp-rw-date">{fmtShort(startDate)}</div>
            </div>
            <div className="dyp-rw-chaps">
                <div className="dyp-rw-row">
                    <button
                        ref={setActivatorNodeRef}
                        type="button"
                        className="dyp-rw-handle"
                        aria-label="Drag to reorder buffer block"
                        title="Drag to reorder"
                        {...attributes}
                        {...listeners}
                    >
                        <GripVertical size={13} />
                    </button>
                    <div className="dyp-buf-chip">
                        <Clock size={12} style={{ color: 'var(--c-new)' }} />
                        <span className="dyp-buf-label">Buffer</span>
                        <span className="dyp-buf-days">· {days} day{days === 1 ? '' : 's'}</span>
                        <button
                            type="button"
                            className="dyp-buf-adjust"
                            onClick={() => onSetDays(days - 1)}
                            disabled={days <= 1}
                            title="Shorter"
                            aria-label="Decrease buffer days"
                        >
                            <Minus size={11} />
                        </button>
                        <button
                            type="button"
                            className="dyp-buf-adjust"
                            onClick={() => onSetDays(days + 1)}
                            disabled={bufferAvailable < 1}
                            title="Longer"
                            aria-label="Increase buffer days"
                        >
                            <Plus size={11} />
                        </button>
                        <button
                            type="button"
                            className="dyp-buf-remove"
                            onClick={onRemove}
                            title="Remove buffer block"
                            aria-label="Remove buffer block"
                        >
                            <X size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
