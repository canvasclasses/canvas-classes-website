'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { PHASES, TOTAL_DAYS } from './planData';

type Props = {
    currentDay: number;
    completed: Set<number>;
    collapsed: boolean;
    onToggleCollapse: () => void;
};

const PHASE_STRIPE: Record<string, string> = {
    phase1: 'bg-red-400',
    phase2: 'bg-emerald-400',
    phase3: 'bg-purple-400',
    phase4: 'bg-amber-400',
};

const PHASE_ACCENT_TEXT: Record<string, string> = {
    phase1: 'text-red-300',
    phase2: 'text-emerald-300',
    phase3: 'text-purple-300',
    phase4: 'text-amber-300',
};

export function CurriculumRail({ currentDay, completed, collapsed, onToggleCollapse }: Props) {
    const totalDone = completed.size;
    const overallPct = Math.round((totalDone / TOTAL_DAYS) * 100);

    const currentPhaseId = PHASES.find((p) => p.items.some((d) => d.day === currentDay))?.id;
    const [openPhases, setOpenPhases] = useState<Set<string>>(
        () => new Set(currentPhaseId ? [currentPhaseId] : [])
    );

    const togglePhase = (id: string) => {
        setOpenPhases((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <aside className="bg-[#050505] border-r border-white/[0.05] overflow-hidden relative overflow-y-auto">
            <div className="flex items-center justify-between px-5 pt-5 pb-2.5">
                {!collapsed && (
                    <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                        Curriculum
                    </span>
                )}
                <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="w-6 h-6 grid place-items-center text-zinc-500 hover:text-white hover:bg-white/[0.05] rounded transition-colors"
                    aria-label={collapsed ? 'Expand curriculum' : 'Collapse curriculum'}
                    style={{ marginLeft: collapsed ? 'auto' : undefined, marginRight: collapsed ? 'auto' : undefined }}
                >
                    <ChevronLeft size={14} className={collapsed ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
            </div>

            {collapsed ? (
                <CollapsedProgressDial totalDone={totalDone} overallPct={overallPct} />
            ) : (
                <div className="mx-4 mb-4 p-3 rounded-xl bg-[#0B0F15] border border-white/[0.06]">
                    <div className="flex items-baseline justify-between mb-2">
                        <span className="font-[var(--font-outfit)] font-semibold text-[15px] text-white tracking-tight">
                            {totalDone} / {TOTAL_DAYS} days
                        </span>
                        <span className="text-[11px] text-zinc-500 tabular-nums">{overallPct}%</span>
                    </div>
                    <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-[width] duration-500"
                            style={{ width: `${overallPct}%` }}
                        />
                    </div>
                </div>
            )}

            {PHASES.map((phase, pi) => {
                const phaseDays = phase.items.map((d) => d.day);
                const phaseDone = phaseDays.filter((d) => completed.has(d)).length;
                const isOpen = openPhases.has(phase.id);
                const stripe = PHASE_STRIPE[phase.id] ?? 'bg-white/20';

                if (collapsed) {
                    return (
                        <div key={phase.id} className={pi > 0 ? 'mt-3' : ''}>
                            <div className="flex items-center justify-center mx-2 mb-1.5">
                                <span
                                    className={`h-0.5 w-6 rounded-full ${stripe}`}
                                    aria-hidden
                                    title={phase.label}
                                />
                            </div>
                            {phase.items.map((d) => {
                                const isDone = completed.has(d.day);
                                const isActive = d.day === currentDay;
                                return (
                                    <Link
                                        key={d.day}
                                        href={`/bitsat-chemistry-revision/plan/day/${d.day}`}
                                        className={[
                                            'relative flex items-center justify-center mx-1.5 my-0.5 h-7 rounded-md font-mono text-[11px] tabular-nums font-medium no-underline transition-colors',
                                            isActive
                                                ? 'bg-blue-500 text-white shadow-[0_0_0_1px_rgba(59,130,246,0.4)]'
                                                : isDone
                                                ? 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                                                : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200',
                                        ].join(' ')}
                                        title={`Day ${d.day} · ${d.title.split('—')[0].trim()}`}
                                    >
                                        <span
                                            className={`absolute left-0 top-1 bottom-1 w-[2px] rounded-r ${stripe} ${
                                                isActive ? 'opacity-0' : 'opacity-70'
                                            }`}
                                            aria-hidden
                                        />
                                        {isDone && !isActive ? (
                                            <Check size={11} strokeWidth={3} />
                                        ) : (
                                            String(d.day).padStart(2, '0')
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    );
                }

                return (
                    <div key={phase.id} className="px-3 mb-2">
                        <button
                            type="button"
                            onClick={() => togglePhase(phase.id)}
                            aria-expanded={isOpen}
                            className="w-full grid grid-cols-[3px_14px_1fr_auto] items-center gap-2 px-2 py-2 rounded hover:bg-white/[0.03] transition-colors"
                        >
                            <span className={`h-5 rounded-full ${stripe}`} aria-hidden />
                            <ChevronRight
                                size={12}
                                className={[
                                    'text-zinc-500 transition-transform',
                                    isOpen ? 'rotate-90' : '',
                                ].join(' ')}
                            />
                            <span className="text-left text-[13px] font-medium text-zinc-100 tracking-tight truncate">
                                {phase.label}
                            </span>
                            <span
                                className={[
                                    'text-[11px] tabular-nums shrink-0 font-medium',
                                    phaseDone === phaseDays.length
                                        ? 'text-emerald-400'
                                        : phaseDone > 0
                                        ? PHASE_ACCENT_TEXT[phase.id] ?? 'text-zinc-400'
                                        : 'text-zinc-500',
                                ].join(' ')}
                            >
                                {phaseDone}/{phaseDays.length}
                            </span>
                        </button>

                        {isOpen && (
                            <div className="mt-1 pl-3 border-l border-white/[0.05] ml-2.5">
                                {phase.items.map((d) => {
                                    const isDone = completed.has(d.day);
                                    const isActive = d.day === currentDay;
                                    return (
                                        <Link
                                            key={d.day}
                                            href={`/bitsat-chemistry-revision/plan/day/${d.day}`}
                                            className={[
                                                'relative grid grid-cols-[18px_42px_1fr] items-center gap-2.5 py-2 pl-3 pr-2.5 rounded no-underline transition-colors',
                                                isActive
                                                    ? 'bg-blue-500/[0.10] text-white'
                                                    : isDone
                                                    ? 'text-zinc-400 hover:bg-white/[0.03]'
                                                    : 'text-zinc-400 hover:bg-white/[0.03] hover:text-white',
                                            ].join(' ')}
                                        >
                                            {isActive && (
                                                <span
                                                    className="absolute left-0 top-1 bottom-1 w-[2px] rounded-r bg-blue-400"
                                                    aria-hidden
                                                />
                                            )}
                                            <span
                                                className={[
                                                    'w-4 h-4 rounded-full border grid place-items-center transition-all',
                                                    isDone
                                                        ? 'bg-emerald-500 border-emerald-500'
                                                        : isActive
                                                        ? 'border-blue-400 bg-blue-500/20'
                                                        : 'border-white/15',
                                                ].join(' ')}
                                            >
                                                {isDone && <Check size={10} strokeWidth={3} className="text-black" />}
                                            </span>
                                            <span
                                                className={[
                                                    'font-mono text-[11px] tabular-nums',
                                                    isDone ? 'text-emerald-400' : isActive ? 'text-blue-300 font-semibold' : 'text-zinc-500',
                                                ].join(' ')}
                                            >
                                                Day {String(d.day).padStart(2, '0')}
                                            </span>
                                            <span
                                                className={[
                                                    'text-[13px] leading-tight truncate',
                                                    isActive ? 'text-white font-medium' : isDone ? 'text-zinc-500' : '',
                                                ].join(' ')}
                                            >
                                                {d.title.split('—')[0].trim()}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}

            <div className="h-10" />
        </aside>
    );
}

// Compact circular progress for the collapsed rail — shows the same
// X/30 information as the expanded progress card in a 48px footprint.
function CollapsedProgressDial({ totalDone, overallPct }: { totalDone: number; overallPct: number }) {
    const size = 40;
    const stroke = 3;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dash = (overallPct / 100) * c;

    return (
        <div className="flex flex-col items-center gap-1 mx-auto mb-3 mt-1" title={`${totalDone} of ${TOTAL_DAYS} days · ${overallPct}%`}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={r}
                        fill="none"
                        stroke="rgb(59,130,246)"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={`${dash} ${c}`}
                        className="transition-[stroke-dasharray] duration-500"
                    />
                </svg>
                <span className="absolute inset-0 grid place-items-center font-mono text-[10px] font-semibold text-zinc-200 tabular-nums">
                    {totalDone}
                </span>
            </div>
            <span className="text-[9px] text-zinc-600 tabular-nums uppercase tracking-wider">/{TOTAL_DAYS}</span>
        </div>
    );
}
