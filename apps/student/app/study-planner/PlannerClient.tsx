'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { ChapterPlanItem } from './planner-data';
import { filterCatalog, SUBJECT_META } from './planner-data';
import { overallProgress, revisionDue, MODE_META, PLANNER_MODES, DEFAULT_TARGET_DATES, type PlannerMode } from './lib/state';
import { usePlannerState } from './usePlannerState';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { DashboardScreen } from './DashboardScreen';
import { ChapterScreen } from './ChapterScreen';
import { PlanScreen } from './PlanScreen';
import { RevisionScreen } from './RevisionScreen';

export type ScreenName = 'dashboard' | 'plan' | 'revision' | 'chapter';

type Props = { fullCatalog: ChapterPlanItem[] };

export function PlannerClient({ fullCatalog }: Props) {
    const api = usePlannerState();
    const {
        state, mode, setMode, subject, setSubject, hydrated, completedSet, today, setTargetDate, reviseRecalled, reviseForgot,
        setRoadmapOrder, resetRoadmapOrder, addBufferBlock, removeBufferBlock, setBufferBlockDays, setChapterDays,
        syncStatus, lastSyncedAt, isAuthed,
    } = api;

    // --- URL ↔ mode sync ----------------------------------------------------
    // On first render after hydration, read ?m=... and adopt it if the URL
    // says so (deep links / bookmarks). On every subsequent mode change,
    // push the new value to the URL via shallow router.replace.
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const urlReadOnce = useMemo(() => ({ done: false }), []);
    useEffect(() => {
        if (!hydrated || urlReadOnce.done) return;
        urlReadOnce.done = true;
        const m = searchParams.get('m');
        if (m && (PLANNER_MODES as readonly string[]).includes(m) && m !== mode) {
            setMode(m as PlannerMode);
        }
    }, [hydrated, searchParams, mode, setMode, urlReadOnce]);
    useEffect(() => {
        if (!hydrated) return;
        const current = searchParams.get('m');
        if (current === mode) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('m', mode);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [mode, hydrated, pathname, router, searchParams]);

    const [screen, setScreen] = useState<ScreenName>('dashboard');
    const [activeId, setActiveId] = useState<string | null>(null);
    // Mobile only: the sidebar is an off-canvas drawer below 768px. Desktop
    // ignores this (CSS keeps the sidebar in-flow), so it's a no-op there.
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // modeCatalog drives sidebar + roadmap + dashboard (the chapters this
    // (mode, subject) "owns"). fullCatalog stays available for chapter lookups
    // so a Class 12 student can open a Class 11 prereq chapter without leaving
    // Class 12 mode. In class11/class12 modes the subject is always chemistry;
    // only Dropper switches subject (v1).
    const catalog = useMemo(() => filterCatalog(fullCatalog, mode, subject), [fullCatalog, mode, subject]);

    // Dashboard hero eyebrow. Dropper reflects the active subject; the class
    // modes keep their fixed copy.
    const eyebrow = mode === 'dropper'
        ? `JEE 2027 · ${SUBJECT_META[subject].label}`
        : MODE_META[mode].subtitle;

    const overall = useMemo(() => overallProgress(catalog, completedSet), [catalog, completedSet]);
    const due = useMemo(() => revisionDue(catalog, state, today), [catalog, state, today]);

    // Lookup ALWAYS uses the full catalog — prereq chapters live outside the
    // current mode's filter but still need to render.
    const activeChapter = activeId ? fullCatalog.find((c) => c.chapterId === activeId) ?? null : null;

    const navTo = (s: ScreenName) => {
        setSidebarOpen(false); // close the mobile drawer after a nav tap
        setScreen(s);
        if (s !== 'chapter') setActiveId(null);
        const main = document.querySelector('.dyp-main') as HTMLElement | null;
        if (main) main.scrollTop = 0;
    };

    // Opening a chapter is pure navigation — it does NOT stamp the chapter as
    // "where they left off." That stamp is set inside engagement mutators
    // (toggleStep, setNote, setRating, …) so the dashboard's "Pick up" CTA
    // only ever points to a chapter the student actually worked in.
    const openChapter = (id: string) => {
        setSidebarOpen(false); // close the mobile drawer after picking a chapter
        setActiveId(id);
        setScreen('chapter');
        const main = document.querySelector('.dyp-main') as HTMLElement | null;
        if (main) main.scrollTop = 0;
    };

    return (
        <div
            className="dyp-app"
            data-mode={mode}
            style={
                {
                    height: 'calc(100dvh - 80px)',
                    marginTop: '80px',
                    // Per-mode palette override. The default --accent is dropper-orange
                    // (defined in planner.css). We override it inline based on mode so
                    // every accent-coloured element re-tints automatically.
                    ['--accent' as never]: MODE_META[mode].accent,
                } as React.CSSProperties
            }
        >
            <TopBar
                screen={screen}
                activeChapterName={activeChapter?.name ?? null}
                overall={overall}
                onNavDashboard={() => navTo('dashboard')}
                syncStatus={syncStatus}
                lastSyncedAt={lastSyncedAt}
                isAuthed={isAuthed}
                mode={mode}
                onChangeMode={setMode}
                onMenu={() => setSidebarOpen((o) => !o)}
            />
            <div className={`dyp-body${sidebarOpen ? ' dyp-sb-open' : ''}`}>
                <button
                    type="button"
                    className="dyp-sb-backdrop"
                    aria-label="Close menu"
                    onClick={() => setSidebarOpen(false)}
                />
                <Sidebar
                    catalog={catalog}
                    completed={completedSet}
                    diagnostic={state.diagnostic}
                    screen={screen}
                    activeChapterId={activeId}
                    revisionDueCount={due.length}
                    mode={mode}
                    subject={subject}
                    onSubject={setSubject}
                    onNav={navTo}
                    onChapter={openChapter}
                />
                <main className="dyp-main">
                    <div className="dyp-main-glow" />
                    {screen === 'dashboard' && (
                        <DashboardScreen
                            catalog={catalog}
                            state={state}
                            completed={completedSet}
                            today={today}
                            defaultTargetISO={DEFAULT_TARGET_DATES[mode]}
                            eyebrow={eyebrow}
                            onChapter={openChapter}
                            onNavPlan={() => navTo('plan')}
                            onNavRevision={() => navTo('revision')}
                            onSetTarget={setTargetDate}
                        />
                    )}
                    {screen === 'plan' && (
                        <PlanScreen
                            catalog={catalog}
                            state={state}
                            completed={completedSet}
                            today={today}
                            defaultTargetISO={DEFAULT_TARGET_DATES[mode]}
                            eyebrow={eyebrow}
                            onChapter={openChapter}
                            onSetTarget={setTargetDate}
                            onSetOrder={setRoadmapOrder}
                            onResetOrder={resetRoadmapOrder}
                            onAddBuffer={(days, insertAfter) => addBufferBlock(catalog, days, insertAfter)}
                            onRemoveBuffer={removeBufferBlock}
                            onSetBufferDays={setBufferBlockDays}
                            onSetChapterDays={setChapterDays}
                        />
                    )}
                    {screen === 'revision' && (
                        <RevisionScreen
                            catalog={catalog}
                            state={state}
                            today={today}
                            onChapter={openChapter}
                            onRecalled={(id) => {
                                reviseRecalled(id);
                            }}
                            onForgot={(id) => {
                                reviseForgot(id);
                            }}
                        />
                    )}
                    {screen === 'chapter' && activeChapter && (
                        <ChapterScreen
                            chapter={activeChapter}
                            state={state}
                            completed={completedSet}
                            api={api}
                            fullCatalog={fullCatalog}
                            mode={mode}
                            onOpenChapter={openChapter}
                            showPrereqs={mode === 'class12'}
                        />
                    )}
                    {screen === 'chapter' && !activeChapter && (
                        <div className="dyp-wrap">
                            <p className="dyp-empty">Chapter not found.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

