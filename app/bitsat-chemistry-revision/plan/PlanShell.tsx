'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Menu, X } from 'lucide-react';
import { dayByNumber, TOTAL_DAYS, isCompletableKind, visualResourceOrder } from './planData';
import { CurriculumRail } from './CurriculumRail';
import { ResourcePanel } from './ResourcePanel';
import { DayContent } from './DayContent';
import { FooterActions } from './FooterActions';
import { usePlanProgress } from '../usePlanProgress';

type Props = {
    initialDay: number;
};

export function PlanShell({ initialDay }: Props) {
    const day = dayByNumber(initialDay);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const rParam = searchParams.get('r');
    const parsedIndex = rParam === null ? null : Number(rParam);
    const selectedIndex =
        parsedIndex !== null && Number.isInteger(parsedIndex) && parsedIndex >= 0
            ? parsedIndex
            : null;

    const {
        completed,
        isModuleDone,
        toggleModule,
        completedCountForDay,
        totalCountForDay,
    } = usePlanProgress();
    const [leftCollapsed, setLeftCollapsed] = useState(false);
    const [rightCollapsed, setRightCollapsed] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Close the mobile curriculum drawer whenever the active day changes —
    // the user has navigated, so the drawer's job is done.
    useEffect(() => {
        setDrawerOpen(false);
    }, [initialDay]);

    // Lock body scroll while the drawer is open so the background doesn't
    // scroll behind the overlay on mobile.
    useEffect(() => {
        if (typeof document === 'undefined') return;
        const prev = document.body.style.overflow;
        if (drawerOpen) document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [drawerOpen]);

    const selectResource = useCallback(
        (index: number) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('r', String(index));
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [router, pathname, searchParams]
    );

    const clearResource = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('r');
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, [router, pathname, searchParams]);

    const isIndexDone = useCallback(
        (index: number) => isModuleDone(initialDay, index),
        [isModuleDone, initialDay]
    );

    // Toggle a module and, on the not-done → done transition, advance to the
    // next incomplete completable module on this day. Advance follows the
    // visual order of the resource panel (Videos → Notes → Flashcards →
    // Tools), not the raw resources[] index. If none remain, navigate to the
    // next day.
    const handleToggleModule = useCallback(
        (index: number) => {
            const wasDone = isModuleDone(initialDay, index);
            toggleModule(initialDay, index);
            if (wasDone) return;

            const resources = day?.resources ?? [];
            if (resources.length === 0) return;

            const order = visualResourceOrder(resources);
            const pos = order.indexOf(index);
            if (pos === -1) return;

            let nextIncomplete: number | null = null;
            for (let step = 1; step <= order.length; step++) {
                const i = order[(pos + step) % order.length];
                if (i === index) continue;
                const r = resources[i];
                if (!isCompletableKind(r.kind)) continue;
                if (!isModuleDone(initialDay, i)) {
                    nextIncomplete = i;
                    break;
                }
            }

            if (nextIncomplete !== null) {
                selectResource(nextIncomplete);
                return;
            }

            const nextDay = initialDay + 1;
            if (nextDay <= TOTAL_DAYS) {
                router.push(`/bitsat-chemistry-revision/plan/day/${nextDay}`);
            }
        },
        [initialDay, isModuleDone, toggleModule, day, selectResource, router]
    );

    if (!day) {
        return (
            <div className="min-h-screen bg-[#050505] text-white grid place-items-center">
                <div className="text-center">
                    <p className="text-zinc-400 mb-4">Day {initialDay} doesn&apos;t exist.</p>
                    <Link
                        href="/bitsat-chemistry-revision/plan/day/1"
                        className="text-blue-400 hover:text-blue-300 underline"
                    >
                        Start from Day 1
                    </Link>
                </div>
            </div>
        );
    }

    const totalDone = completed.size;
    const overallPct = Math.round((totalDone / TOTAL_DAYS) * 100);

    const leftW = leftCollapsed ? '56px' : '272px';
    const rightW = rightCollapsed ? '0px' : '320px';

    const effectiveSelectedIndex =
        selectedIndex !== null && selectedIndex < day.resources.length ? selectedIndex : null;

    const dayCompletedCount = completedCountForDay(initialDay);
    const dayTotalCount = totalCountForDay(initialDay);

    const selectedModuleDone =
        effectiveSelectedIndex !== null && isModuleDone(initialDay, effectiveSelectedIndex);
    const toggleSelectedModule = () => {
        if (effectiveSelectedIndex === null) return;
        handleToggleModule(effectiveSelectedIndex);
    };

    const dayCleanTitle = day.title.split('—')[0].trim();

    return (
        <div className="h-[100dvh] md:h-screen bg-[#050505] text-white flex flex-col overflow-hidden plan-scroll">
            <div className="h-0.5 bg-white/[0.05] shrink-0">
                <div
                    className="h-full bg-blue-500 transition-[width] duration-500"
                    style={{ width: `${overallPct}%` }}
                />
            </div>

            {/* Mobile top bar */}
            <nav className="md:hidden flex items-center gap-3 px-4 py-3 bg-[#050505]/95 backdrop-blur-md border-b border-white/[0.06] shrink-0">
                <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className="-ml-1.5 w-9 h-9 grid place-items-center text-zinc-300 hover:text-white active:bg-white/[0.06] rounded-lg transition-colors"
                    aria-label="Open curriculum"
                >
                    <Menu size={18} />
                </button>
                <div className="min-w-0 flex-1 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-semibold text-blue-300 tracking-wider shrink-0">
                        DAY {String(initialDay).padStart(2, '0')}
                    </span>
                    <span className="text-zinc-700 shrink-0">·</span>
                    <span className="font-[var(--font-outfit)] text-[13px] font-medium text-white truncate">
                        {dayCleanTitle}
                    </span>
                </div>
                <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-full text-[11px] tabular-nums">
                    <span className="text-white font-medium">{totalDone}</span>
                    <span className="text-zinc-600">/</span>
                    <span className="text-zinc-400">{TOTAL_DAYS}</span>
                </div>
            </nav>

            {/* Desktop top bar */}
            <nav className="hidden md:flex items-center justify-between px-6 py-3 bg-[#050505]/95 backdrop-blur-md border-b border-white/[0.06] shrink-0">
                <div className="flex items-center gap-5">
                    <Link
                        href="/bitsat-chemistry-revision"
                        className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-[13px] px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors no-underline"
                    >
                        <ChevronLeft size={14} />
                        Overview
                    </Link>
                    <span className="font-[var(--font-outfit)] font-semibold text-[15px] text-white tracking-tight">
                        BITSAT Chemistry <span className="font-normal text-zinc-500">· 30-Day Plan</span>
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full text-xs">
                        <span className="text-white tabular-nums font-medium">
                            {totalDone} / {TOTAL_DAYS}
                        </span>
                        <span className="text-zinc-600">·</span>
                        <span className="text-blue-300 font-medium tabular-nums">{overallPct}%</span>
                    </div>
                </div>
            </nav>

            {/* Mobile curriculum drawer */}
            {drawerOpen && (
                <div
                    className="md:hidden fixed inset-0 z-50 flex"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Curriculum"
                >
                    <button
                        type="button"
                        aria-label="Close curriculum"
                        className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-[planFadeIn_160ms_ease-out]"
                        onClick={() => setDrawerOpen(false)}
                    />
                    <div className="relative w-[86%] max-w-[340px] h-full bg-[#050505] border-r border-white/[0.08] flex flex-col shadow-[10px_0_40px_rgba(0,0,0,0.5)] animate-[planSlideInLeft_220ms_cubic-bezier(0.2,0.8,0.2,1)]">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/bitsat-chemistry-revision"
                                    className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 text-[11px] no-underline"
                                >
                                    <ChevronLeft size={12} />
                                    Overview
                                </Link>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDrawerOpen(false)}
                                className="w-8 h-8 grid place-items-center text-zinc-400 hover:text-white active:bg-white/[0.06] rounded transition-colors"
                                aria-label="Close"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <CurriculumRail
                                currentDay={initialDay}
                                completed={completed}
                                collapsed={false}
                                onToggleCollapse={() => {}}
                                variant="drawer"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Main layout: mobile = single scroll column, desktop = 3-col grid */}
            <div
                className="flex-1 min-h-0 flex flex-col overflow-y-auto md:grid md:overflow-hidden md:transition-[grid-template-columns] md:duration-[240ms]"
                style={{ gridTemplateColumns: `${leftW} 1fr ${rightW}` }}
            >
                <div className="hidden md:block min-h-0">
                    <CurriculumRail
                        currentDay={initialDay}
                        completed={completed}
                        collapsed={leftCollapsed}
                        onToggleCollapse={() => setLeftCollapsed((v) => !v)}
                    />
                </div>

                <DayContent
                    day={day}
                    selectedIndex={effectiveSelectedIndex}
                    onClearSelection={clearResource}
                    selectedModuleDone={selectedModuleDone}
                    onToggleSelectedModule={toggleSelectedModule}
                    dayCompletedCount={dayCompletedCount}
                    dayTotalCount={dayTotalCount}
                />

                {/* Mobile: inline resource panel below day content, only when no player */}
                {effectiveSelectedIndex === null && (
                    <div className="md:hidden pb-24">
                        <ResourcePanel
                            dayNumber={day.day}
                            resources={day.resources}
                            checklist={day.checklist}
                            selectedIndex={effectiveSelectedIndex}
                            onSelectResource={selectResource}
                            isModuleDone={isIndexDone}
                            onToggleModule={handleToggleModule}
                            collapsed={false}
                            onToggleCollapse={() => {}}
                            variant="inline"
                        />
                    </div>
                )}

                {/* Desktop: right rail */}
                <div className="hidden md:block min-h-0">
                    <ResourcePanel
                        dayNumber={day.day}
                        resources={day.resources}
                        checklist={day.checklist}
                        selectedIndex={effectiveSelectedIndex}
                        onSelectResource={selectResource}
                        isModuleDone={isIndexDone}
                        onToggleModule={handleToggleModule}
                        collapsed={rightCollapsed}
                        onToggleCollapse={() => setRightCollapsed((v) => !v)}
                    />
                </div>
            </div>

            {rightCollapsed && (
                <button
                    type="button"
                    onClick={() => setRightCollapsed(false)}
                    className="hidden md:block fixed right-0 top-[140px] px-2 py-3 bg-[#0B0F15] border border-white/[0.08] border-r-0 rounded-l-xl text-zinc-400 text-[11px] font-medium [writing-mode:vertical-rl] hover:text-white hover:bg-[#151E32] transition-colors z-20"
                >
                    Resources
                </button>
            )}

            <FooterActions
                currentDay={initialDay}
                dayCompletedCount={dayCompletedCount}
                dayTotalCount={dayTotalCount}
                leftCollapsed={leftCollapsed}
                rightCollapsed={rightCollapsed}
            />
        </div>
    );
}
