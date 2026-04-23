'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { ALL_DAYS } from './planData';
import { Day } from '../planTypes';

type Props = {
    currentDay: number;
    dayCompletedCount: number;
    dayTotalCount: number;
    leftCollapsed: boolean;
    rightCollapsed: boolean;
};

export function FooterActions({
    currentDay,
    dayCompletedCount,
    dayTotalCount,
    leftCollapsed,
    rightCollapsed,
}: Props) {
    const prev = ALL_DAYS.find((d: Day) => d.day === currentDay - 1);
    const next = ALL_DAYS.find((d: Day) => d.day === currentDay + 1);

    const allDone = dayTotalCount > 0 && dayCompletedCount >= dayTotalCount;

    // Desktop: offset the fixed footer to the column gutters so it only
    // covers the center column. Mobile: footer spans the full viewport.
    const leftOffset = leftCollapsed ? '56px' : '272px';
    const rightOffset = rightCollapsed ? '0px' : '320px';

    return (
        <>
            {/* Mobile footer: compact prev / progress chip / next */}
            <footer className="md:hidden fixed left-0 right-0 bottom-0 flex items-center justify-between gap-2 px-3 py-2.5 bg-[#050505]/95 backdrop-blur-md border-t border-white/[0.06] z-30">
                {prev ? (
                    <Link
                        href={`/bitsat-chemistry-revision/plan/day/${prev.day}`}
                        className="flex items-center gap-1 pl-1 pr-2.5 py-2 rounded-lg text-zinc-300 hover:text-white active:bg-white/[0.04] no-underline"
                        aria-label={`Previous day · Day ${prev.day}`}
                    >
                        <ChevronLeft size={16} />
                        <span className="font-mono text-[11px] text-zinc-500">
                            {String(prev.day).padStart(2, '0')}
                        </span>
                    </Link>
                ) : (
                    <span className="w-14" aria-hidden />
                )}

                {dayTotalCount > 0 ? (
                    <div
                        className={[
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11.5px] font-medium tabular-nums',
                            allDone
                                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                                : 'bg-white/[0.04] border-white/[0.08] text-zinc-300',
                        ].join(' ')}
                    >
                        {allDone && <Check size={12} strokeWidth={2.5} />}
                        {allDone ? 'Day done' : `${dayCompletedCount} / ${dayTotalCount}`}
                    </div>
                ) : (
                    <span />
                )}

                {next ? (
                    <Link
                        href={`/bitsat-chemistry-revision/plan/day/${next.day}`}
                        className="flex items-center gap-1 pl-2.5 pr-1 py-2 rounded-lg text-zinc-300 hover:text-white active:bg-white/[0.04] no-underline"
                        aria-label={`Next day · Day ${next.day}`}
                    >
                        <span className="font-mono text-[11px] text-zinc-500">
                            {String(next.day).padStart(2, '0')}
                        </span>
                        <ChevronRight size={16} />
                    </Link>
                ) : (
                    <span className="w-14" aria-hidden />
                )}
            </footer>

            {/* Desktop footer: offset to center column, includes titles */}
            <footer
                className="hidden md:flex fixed bottom-0 items-center justify-between gap-4 px-12 py-3 bg-[#050505]/95 backdrop-blur-md border-t border-white/[0.06] z-30 transition-[left,right] duration-[240ms]"
                style={{ left: leftOffset, right: rightOffset }}
            >
                {prev ? (
                    <Link
                        href={`/bitsat-chemistry-revision/plan/day/${prev.day}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:bg-white/[0.04] hover:text-white text-sm transition-colors no-underline min-w-0"
                    >
                        <ChevronLeft size={14} />
                        <span className="font-mono text-[11px] text-zinc-500">Day {String(prev.day).padStart(2, '0')}</span>
                        <span className="truncate max-w-[160px]">{prev.title}</span>
                    </Link>
                ) : (
                    <span />
                )}

                {dayTotalCount > 0 ? (
                    <div
                        className={[
                            'flex items-center gap-2 px-4 py-1.5 rounded-full border text-[12px] font-medium tabular-nums',
                            allDone
                                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                                : 'bg-white/[0.04] border-white/[0.08] text-zinc-300',
                        ].join(' ')}
                    >
                        {allDone && <Check size={13} strokeWidth={2.5} />}
                        {allDone ? `Day ${String(currentDay).padStart(2, '0')} complete` : `${dayCompletedCount} / ${dayTotalCount} modules`}
                    </div>
                ) : (
                    <span />
                )}

                {next ? (
                    <Link
                        href={`/bitsat-chemistry-revision/plan/day/${next.day}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:bg-white/[0.04] hover:text-white text-sm transition-colors no-underline min-w-0 justify-end"
                    >
                        <span className="truncate max-w-[160px]">{next.title}</span>
                        <span className="font-mono text-[11px] text-zinc-500">Day {String(next.day).padStart(2, '0')}</span>
                        <ChevronRight size={14} />
                    </Link>
                ) : (
                    <span />
                )}
            </footer>
        </>
    );
}
