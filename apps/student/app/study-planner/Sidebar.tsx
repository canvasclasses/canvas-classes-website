'use client';

import { useState } from 'react';
import { ChevronRight, Flame, Grid3x3, CalendarDays, RotateCw } from 'lucide-react';
import type { ChapterPlanItem, Subject } from './planner-data';
import { LOOP_STEPS, PLANNER_SUBJECTS, SUBJECT_META } from './planner-data';
import { chapterPct, chapterStepsDone, isChapterDone, type Diagnostic, type PlannerMode } from './lib/state';
import type { ScreenName } from './PlannerClient';

const RATING_COLOR: Record<Diagnostic, string> = {
    strong: 'var(--c-strong)',
    weak: 'var(--c-weak)',
    new: 'var(--c-new)',
};

function groupKey(g: string, cls: 11 | 12) {
    return `${g}-${cls}`;
}

// Derive the ordered list of (group, classLevel) sections present in the
// catalog, preserving first-seen order. Works for any subject: chemistry yields
// Physical/Inorganic/Organic/Practical × class; physics yields Physics × class;
// math yields Algebra/Calculus/… (all class 11).
function deriveSections(catalog: ChapterPlanItem[]): { group: string; cls: 11 | 12 }[] {
    const seen = new Set<string>();
    const out: { group: string; cls: 11 | 12 }[] = [];
    for (const c of catalog) {
        const k = groupKey(c.group, c.classLevel);
        if (!seen.has(k)) { seen.add(k); out.push({ group: c.group, cls: c.classLevel }); }
    }
    return out;
}

type Props = {
    catalog: ChapterPlanItem[];
    completed: Set<string>;
    diagnostic: Record<string, Diagnostic>;
    screen: ScreenName;
    activeChapterId: string | null;
    revisionDueCount: number;
    mode: PlannerMode;
    subject: Subject;
    onSubject: (s: Subject) => void;
    onNav: (s: ScreenName) => void;
    onChapter: (chapterId: string) => void;
};

export function Sidebar({
    catalog, completed, diagnostic, screen, activeChapterId, revisionDueCount, mode, subject, onSubject, onNav, onChapter,
}: Props) {
    const sections = deriveSections(catalog);
    // A group name needs its "Class N" sub-label only when the same name appears
    // under more than one class level (chemistry's Physical/Inorganic/… span 11
    // and 12). Physics areas and math types are class-homogeneous, so the label
    // would just be redundant noise — hide it for those.
    const multiClassGroups = (() => {
        const classesByGroup = new Map<string, Set<number>>();
        for (const c of catalog) {
            let set = classesByGroup.get(c.group);
            if (!set) { set = new Set(); classesByGroup.set(c.group, set); }
            set.add(c.classLevel);
        }
        const multi = new Set<string>();
        for (const [g, set] of classesByGroup) if (set.size > 1) multi.add(g);
        return multi;
    })();
    const activeChap = catalog.find((c) => c.chapterId === activeChapterId);
    const [open, setOpen] = useState<Record<string, boolean>>(() => {
        const first = activeChap
            ? groupKey(activeChap.group, activeChap.classLevel)
            : sections[0] ? groupKey(sections[0].group, sections[0].cls) : '';
        return first ? { [first]: true } : {};
    });
    const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));

    const nav: { id: ScreenName; label: string; Icon: typeof Grid3x3; badge?: number }[] = [
        { id: 'dashboard', label: 'Dashboard', Icon: Grid3x3 },
        { id: 'plan', label: 'Study Plan', Icon: CalendarDays },
        { id: 'revision', label: 'Revision', Icon: RotateCw, badge: revisionDueCount },
    ];

    return (
        <aside className="dyp-sidebar">
            <nav className="dyp-sb-nav">
                {nav.map((n) => {
                    const I = n.Icon;
                    return (
                        <button
                            key={n.id}
                            type="button"
                            onClick={() => onNav(n.id)}
                            className={['dyp-sb-item', screen === n.id ? 'dyp-on' : ''].join(' ')}
                        >
                            <I size={17} className="dyp-ico" />
                            {n.label}
                            {n.badge ? <span className="dyp-sb-badge">{n.badge}</span> : null}
                        </button>
                    );
                })}
            </nav>
            <div className="dyp-sb-sep" />
            {mode === 'dropper' && (
                <div className="dyp-sb-subjects">
                    <div role="tablist" aria-label="Subject" className="dyp-modeswitch dyp-subjectswitch">
                        {PLANNER_SUBJECTS.map((s) => {
                            const active = s === subject;
                            return (
                                <button
                                    key={s}
                                    role="tab"
                                    aria-selected={active}
                                    type="button"
                                    onClick={() => onSubject(s)}
                                    className={['dyp-modeseg', active ? 'dyp-on' : ''].join(' ')}
                                >
                                    {SUBJECT_META[s].label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            <div className="dyp-sb-label">Syllabus · {SUBJECT_META[subject].label}</div>
            <div className="dyp-sb-scroll">
                {sections.map(({ group, cls }) => {
                    const list = catalog.filter((c) => c.group === group && c.classLevel === cls);
                    if (!list.length) return null;
                    const k = groupKey(group, cls);
                    const isOpen = !!open[k];
                    const sum = list.reduce((acc, c) => acc + chapterPct(c.chapterId, completed), 0);
                    const pct = sum / list.length;
                    return (
                        <div className="dyp-sb-group" key={k}>
                            <button
                                type="button"
                                onClick={() => toggle(k)}
                                aria-expanded={isOpen}
                                className={['dyp-sb-grow', isOpen ? 'dyp-open' : ''].join(' ')}
                            >
                                <ChevronRight size={14} className="dyp-chev" />
                                <div>
                                    <div className="dyp-sb-gname">{group}</div>
                                    {multiClassGroups.has(group) && <div className="dyp-sb-gmeta">Class {cls}</div>}
                                </div>
                                <span className="dyp-sb-gpct">{Math.round(pct)}%</span>
                            </button>
                            {isOpen && (
                                <>
                                    <div className="dyp-sb-gbar">
                                        <div className="dyp-bar" style={{ height: 3 }}>
                                            <div className="dyp-bar-fill" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
                                        </div>
                                    </div>
                                    {list.map((c) => {
                                        const cp = chapterPct(c.chapterId, completed);
                                        const stepsDone = chapterStepsDone(c.chapterId, completed);
                                        const rating = diagnostic[c.chapterId];
                                        const allDone = isChapterDone(c.chapterId, completed);
                                        const dotStyle = rating
                                            ? { background: RATING_COLOR[rating] }
                                            : allDone
                                            ? { borderColor: 'var(--accent)' }
                                            : undefined;
                                        return (
                                            <button
                                                key={c.chapterId}
                                                type="button"
                                                onClick={() => onChapter(c.chapterId)}
                                                className={['dyp-sb-chap', c.chapterId === activeChapterId ? 'dyp-on' : ''].join(' ')}
                                            >
                                                <span
                                                    className={['dyp-sb-rdot', rating ? 'dyp-filled' : ''].join(' ')}
                                                    style={dotStyle}
                                                />
                                                <span className="dyp-sb-cname">{c.name}</span>
                                                {c.highYield && <Flame size={12} className="dyp-sb-cflame" />}
                                                <span className="dyp-sb-cpct">{Math.round(cp)}%</span>
                                                <span className="sr-only">{stepsDone}/{LOOP_STEPS.length} steps</span>
                                            </button>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}
