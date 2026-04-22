'use client';

import { useCallback, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, User } from 'lucide-react';
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

    return (
        <div className="h-screen bg-[#050505] text-white flex flex-col overflow-hidden plan-scroll">
            <div className="h-0.5 bg-white/[0.05] shrink-0">
                <div
                    className="h-full bg-blue-500 transition-[width] duration-500"
                    style={{ width: `${overallPct}%` }}
                />
            </div>

            <nav className="flex items-center justify-between px-6 py-3 bg-[#050505]/95 backdrop-blur-md border-b border-white/[0.06] shrink-0">
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

            <div
                className="flex-1 min-h-0 grid transition-[grid-template-columns] duration-[240ms]"
                style={{ gridTemplateColumns: `${leftW} 1fr ${rightW}` }}
            >
                <CurriculumRail
                    currentDay={initialDay}
                    completed={completed}
                    collapsed={leftCollapsed}
                    onToggleCollapse={() => setLeftCollapsed((v) => !v)}
                />

                <DayContent
                    day={day}
                    selectedIndex={effectiveSelectedIndex}
                    onClearSelection={clearResource}
                    selectedModuleDone={selectedModuleDone}
                    onToggleSelectedModule={toggleSelectedModule}
                    dayCompletedCount={dayCompletedCount}
                    dayTotalCount={dayTotalCount}
                />

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

            {rightCollapsed && (
                <button
                    type="button"
                    onClick={() => setRightCollapsed(false)}
                    className="fixed right-0 top-[140px] px-2 py-3 bg-[#0B0F15] border border-white/[0.08] border-r-0 rounded-l-xl text-zinc-400 text-[11px] font-medium [writing-mode:vertical-rl] hover:text-white hover:bg-[#151E32] transition-colors z-20"
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
