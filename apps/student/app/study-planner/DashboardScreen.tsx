'use client';

import { useMemo } from 'react';
import {
    Play, ArrowRight, Flame, TrendingUp, AlertTriangle, CalendarDays, RotateCw, Check,
} from 'lucide-react';
import type { ChapterPlanItem } from './planner-data';
import {
    addDaysISO,
    daysBetween,
    dimensionStats,
    isChapterDone,
    nextChapter,
    nextStepLabel,
    overallProgress,
    priorityIncomplete,
    revisionDue,
    type PlannerState,
    type PlannerMode,
} from './lib/state';
import { Ring } from './Ring';
import { TelegramCTA } from './TelegramCTA';

// Fixed colors for the chemistry dimensions (unchanged); any other group
// (physics, math chapter-types) cycles through a small palette by index so the
// dashboard never renders an undefined bar color.
const DIM_COLOR_FIXED: Record<string, string> = {
    Physical: 'var(--accent)',
    Inorganic: 'var(--c-new)',
    Organic: 'var(--c-strong)',
    Practical: '#c084fc',
};
const DIM_PALETTE = ['var(--accent)', 'var(--c-new)', 'var(--c-strong)', '#c084fc', '#60a5fa', '#f472b6'];
function dimColor(group: string, idx: number): string {
    return DIM_COLOR_FIXED[group] ?? DIM_PALETTE[idx % DIM_PALETTE.length];
}

function greeting(): string {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

// Batch-specific motivational message — speaks to each batch's real failure mode
// (droppers: time mismanagement; Class 11: late start + the Class-10→11 jump +
// backlog; Class 12: balancing the new syllabus with Class 11 revision).
function HeroPitch({ mode, pace }: { mode: PlannerMode; pace: number }) {
    const perWeek = <b>{pace} chapter{pace > 1 ? 's' : ''} a week</b>;
    if (mode === 'class11') {
        return (
            <>Class 11 is a real step up from Class 10 — and the students who fall behind are usually the ones who start late and let a backlog pile up before they feel the jump in difficulty. Begin now, keep it steady at around {perWeek}, and the climb stays manageable. One chapter at a time — let&apos;s begin.</>
        );
    }
    if (mode === 'class12') {
        return (
            <>Class 12 is a balancing act — you have to finish the new syllabus on time and keep revising Class 11, or the backlog quietly snowballs. So plan both: about {perWeek} for Class 12, with your Class 11 chapters revised alongside. Stay steady and nothing gets left behind — let&apos;s begin.</>
        );
    }
    return (
        <>Most droppers don&apos;t fall short on ability — they fall short on time, spending weeks on a few chapters while the rest of the syllabus slips by. Keep it balanced — around {perWeek} — and we&apos;ll finish one chapter at a time.</>
    );
}

type Props = {
    catalog: ChapterPlanItem[];
    state: PlannerState;
    completed: Set<string>;
    today: string;
    defaultTargetISO: string;
    eyebrow: string;
    mode: PlannerMode;
    onChapter: (id: string) => void;
    onNavPlan: () => void;
    onNavRevision: () => void;
    onSetTarget: (iso: string | null) => void;
};

export function DashboardScreen({
    catalog, state, completed, today, defaultTargetISO, eyebrow, mode, onChapter, onNavPlan, onNavRevision, onSetTarget,
}: Props) {
    const overall = overallProgress(catalog, completed);
    const dims = dimensionStats(catalog, completed);
    const targetISO = state.settings.targetDate ?? defaultTargetISO;
    const daysLeft = Math.max(0, daysBetween(today, targetISO) ?? 0);
    const weeks = Math.max(1, Math.ceil(daysLeft / 7));
    const incomplete = useMemo(() => priorityIncomplete(catalog, state, completed), [catalog, state, completed]);
    const pace = weeks > 0 ? Math.max(1, Math.round(incomplete.length / weeks)) : incomplete.length;
    const onTrack = pace <= 2;
    // Continue with where they left off if possible. Fallback rules:
    //   1. lastAccessedChapter if it exists in the catalog AND isn't fully done
    //   2. nextChapter (first incomplete by roadmap order)
    // This keeps students on the chapter they were last working in instead of
    // pushing them back to whatever the roadmap's first incomplete chapter is.
    const lastId = state.lastAccessedChapter;
    const lastChapter = lastId ? catalog.find((c) => c.chapterId === lastId) ?? null : null;
    const lastChapterIsAvailable = !!lastChapter && !isChapterDone(lastChapter.chapterId, completed);
    const fallback = nextChapter(catalog, state, completed);
    const nc = lastChapterIsAvailable ? lastChapter! : fallback;
    const isResuming = lastChapterIsAvailable;
    const due = revisionDue(catalog, state, today);
    const hyChips = catalog.filter((c) => c.highYield);

    return (
        <div className="dyp-wrap">
            <section className="dyp-card dyp-hero">
                <div className="dyp-hero-glow" />
                <HeroCountdown
                    eyebrow={eyebrow}
                    mode={mode}
                    daysLeft={daysLeft}
                    targetISO={targetISO}
                    weeksLeft={weeks}
                    pace={pace}
                    onTrack={onTrack}
                    streak={state.streak.count}
                    nextChapter={nc}
                    nextStep={nextStepLabel(nc.chapterId, completed)}
                    isResuming={isResuming}
                    targetSet={!!state.settings.targetDate}
                    onSetTarget={onSetTarget}
                    onContinue={() => onChapter(nc.chapterId)}
                    onPlan={onNavPlan}
                />
                <ProgressPanel overall={overall} dims={dims} streak={state.streak.count} weekActivity={state.weekActivity} today={today} />
            </section>

            <TelegramCTA />

            <div className="dyp-grid-2">
                <ThisWeek incomplete={incomplete} completed={completed} onChapter={onChapter} onNavPlan={onNavPlan} />
                <RevisionPreview due={due} onChapter={onChapter} onNavRevision={onNavRevision} />
            </div>

            <HighYieldChips
                chapters={hyChips}
                state={state}
                completed={completed}
                onChapter={onChapter}
                onNavPlan={onNavPlan}
            />
        </div>
    );
}

// ---------------- HERO ----------------
function HeroCountdown({
    eyebrow, mode, daysLeft, targetISO, weeksLeft, pace, onTrack, streak, nextChapter, nextStep, isResuming, targetSet, onSetTarget, onContinue, onPlan,
}: {
    eyebrow: string;
    mode: PlannerMode;
    daysLeft: number;
    targetISO: string;
    weeksLeft: number;
    pace: number;
    onTrack: boolean;
    streak: number;
    nextChapter: ChapterPlanItem;
    nextStep: string;
    isResuming: boolean;
    targetSet: boolean;
    onSetTarget: (iso: string | null) => void;
    onContinue: () => void;
    onPlan: () => void;
}) {
    return (
        <div className="dyp-hero-l">
            <div className="dyp-eyebrow">{eyebrow}</div>
            <div className="dyp-hero-greet">{greeting()} — let&apos;s make today count.</div>
            <h1 className="dyp-hero-count">
                <span className="dyp-num">{daysLeft}</span>
                <span className="dyp-unit">days to go</span>
            </h1>
            <p className="dyp-hero-desc">
                <HeroPitch mode={mode} pace={pace} />{' '}
                {!targetSet && <span style={{ color: 'var(--text-4)' }}>(Set your finish-by date below.)</span>}
            </p>
            <div className="dyp-momentum">
                <span className="dyp-mpill">
                    <span className="dyp-flamewrap"><Flame size={13} strokeWidth={2} /></span>
                    {streak}-day streak
                </span>
                <span className={['dyp-mpill', onTrack ? 'dyp-good' : 'dyp-warn'].join(' ')}>
                    {onTrack ? <TrendingUp size={13} /> : <AlertTriangle size={13} />}
                    {onTrack ? 'On track' : 'Speed up a little'}
                </span>
                <label className="dyp-target-ctl dyp-compact">
                    <CalendarDays size={15} className="dyp-ico" />
                    <span className="dyp-tc-label">Finish by</span>
                    <input
                        type="date"
                        value={targetISO}
                        onChange={(e) => onSetTarget(e.target.value || null)}
                    />
                </label>
            </div>
            <div className="dyp-hero-cta">
                <button type="button" className="dyp-btn dyp-primary dyp-lg" onClick={onContinue}>
                    <Play size={16} strokeWidth={2} />
                    {isResuming ? 'Pick up' : 'Start'} · {nextChapter.name.split('(')[0].trim()}
                    <span className="dyp-cta-step">{nextStep}</span>
                </button>
                <button type="button" className="dyp-btn dyp-ghost" onClick={onPlan}>
                    Open Study Plan
                    <ArrowRight size={15} />
                </button>
            </div>
        </div>
    );
}

// --------------- PROGRESS PANEL ---------------
function ProgressPanel({
    overall, dims, streak, weekActivity, today,
}: {
    overall: { done: number; total: number; pct: number };
    dims: { group: string; pct: number }[];
    streak: number;
    weekActivity: string[];
    today: string;
}) {
    // last 7 days (Mon..Sun ending today) as dots
    const week: boolean[] = [];
    const set = new Set(weekActivity);
    for (let i = 6; i >= 0; i--) {
        const iso = addDaysISO(today, -i);
        week.push(set.has(iso));
    }
    return (
        <div className="dyp-prog-panel">
            <div className="dyp-prog-top">
                <Ring pct={overall.pct} size={108} stroke={9}>
                    <div>
                        <div className="dyp-prog-pct">{overall.pct}%</div>
                        <div className="dyp-prog-steps">{overall.done}/{overall.total}</div>
                    </div>
                </Ring>
                <div className="dyp-prog-meta">
                    <div className="dyp-prog-label">Syllabus complete</div>
                    <div className="dyp-prog-streak">
                        <span className="dyp-flamewrap"><Flame size={15} strokeWidth={2} /></span>
                        <b>{streak}-day</b> streak
                    </div>
                    <div className="dyp-weekdots">
                        {week.map((on, i) => (
                            <span key={i} className={['dyp-wd', on ? 'dyp-on' : ''].join(' ')} title={on ? 'Studied' : 'Missed'} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="dyp-prog-dims">
                {dims.map((d, i) => (
                    <div className="dyp-dimrow" key={d.group}>
                        <span className="dyp-dimname">{d.group}</span>
                        <div className="dyp-bar" style={{ height: 5 }}>
                            <div className="dyp-bar-fill" style={{ width: `${d.pct}%`, background: dimColor(d.group, i) }} />
                        </div>
                        <span className="dyp-dimpct">{Math.round(d.pct)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --------------- THIS WEEK ---------------
function ThisWeek({
    incomplete, completed, onChapter, onNavPlan,
}: {
    incomplete: ChapterPlanItem[];
    completed: Set<string>;
    onChapter: (id: string) => void;
    onNavPlan: () => void;
}) {
    const list = incomplete.slice(0, 3);
    return (
        <section className="dyp-card dyp-pad">
            <div className="dyp-sec-head">
                <CalendarDays size={18} style={{ color: 'var(--accent)' }} />
                <h2 className="dyp-sec-title">This week — start here</h2>
                <button type="button" className="dyp-sec-link" onClick={onNavPlan}>
                    Full schedule
                    <ArrowRight size={14} />
                </button>
            </div>
            <div className="dyp-week-list">
                {list.map((c, i) => (
                    <button key={c.chapterId} type="button" className="dyp-week-item" onClick={() => onChapter(c.chapterId)}>
                        <span className="dyp-wi-day">Day {i * 2 + 1}</span>
                        <div className="dyp-wi-main">
                            <div className="dyp-wi-name">{c.name}</div>
                            <div className="dyp-wi-meta">{c.group} · Class {c.classLevel}</div>
                        </div>
                        {c.highYield && (
                            <span className="dyp-hy dyp-sm">
                                <Flame size={11} strokeWidth={2} />
                                High yield
                            </span>
                        )}
                        <span className="dyp-wi-step">{nextStepLabel(c.chapterId, completed)}</span>
                        <ArrowRight size={16} className="dyp-wi-arrow" />
                    </button>
                ))}
                {list.length === 0 && (
                    <div className="dyp-empty">Every chapter is done — incredible. Time to mock test.</div>
                )}
            </div>
        </section>
    );
}

// --------------- REVISION PREVIEW ---------------
function RevisionPreview({
    due, onChapter, onNavRevision,
}: {
    due: ReturnType<typeof revisionDue>;
    onChapter: (id: string) => void;
    onNavRevision: () => void;
}) {
    return (
        <section className="dyp-card dyp-pad">
            <div className="dyp-sec-head">
                <RotateCw size={18} style={{ color: 'var(--c-new)' }} />
                <h2 className="dyp-sec-title">Due for revision</h2>
                <button type="button" className="dyp-sec-link" onClick={onNavRevision}>
                    Open queue
                    <ArrowRight size={14} />
                </button>
            </div>
            {due.length === 0 ? (
                <div className="dyp-rev-empty">
                    <Check size={18} style={{ color: 'var(--c-strong)' }} />
                    All caught up — nothing due today.
                </div>
            ) : (
                <div className="dyp-rev-list">
                    {due.slice(0, 3).map((r) => (
                        <button key={r.chapter.chapterId} type="button" className="dyp-rev-item" onClick={() => onChapter(r.chapter.chapterId)}>
                            <span className="dyp-rev-dot" />
                            <div className="dyp-rev-main">
                                <div className="dyp-wi-name">{r.chapter.name}</div>
                                <div className="dyp-wi-meta">Stage {r.stage + 1} · last seen {r.ago === 0 ? 'today' : r.ago === 1 ? 'yesterday' : `${r.ago}d ago`}</div>
                            </div>
                            <span className="dyp-btn dyp-sm">Revise</span>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}

// --------------- HIGH YIELD ---------------
function HighYieldChips({
    chapters, state, completed, onChapter, onNavPlan,
}: {
    chapters: ChapterPlanItem[];
    state: PlannerState;
    completed: Set<string>;
    onChapter: (id: string) => void;
    onNavPlan: () => void;
}) {
    return (
        <section className="dyp-card dyp-pad" style={{ marginTop: 18 }}>
            <div className="dyp-sec-head">
                <Flame size={18} style={{ color: 'var(--accent)' }} />
                <h2 className="dyp-sec-title">High-yield chapters</h2>
                <button type="button" className="dyp-sec-link" onClick={onNavPlan}>
                    Plan them in
                    <ArrowRight size={14} />
                </button>
            </div>
            <div className="dyp-chip-wrap">
                {chapters.map((c) => {
                    const rating = state.diagnostic[c.chapterId];
                    const done = isChapterDone(c.chapterId, completed);
                    return (
                        <button key={c.chapterId} type="button" className="dyp-hychip" onClick={() => onChapter(c.chapterId)}>
                            {rating && (
                                <span
                                    className="dyp-hychip-dot"
                                    style={{
                                        background:
                                            rating === 'strong'
                                                ? 'var(--c-strong)'
                                                : rating === 'weak'
                                                ? 'var(--c-weak)'
                                                : 'var(--c-new)',
                                    }}
                                />
                            )}
                            {c.name.split('(')[0].trim()}
                            {done && <Check size={13} style={{ color: 'var(--c-strong)' }} />}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
