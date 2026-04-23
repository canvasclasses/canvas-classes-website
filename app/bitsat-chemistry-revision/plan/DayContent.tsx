'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ExternalLink } from 'lucide-react';
import { Day, Resource } from '../planTypes';
import { phaseForDay } from './planData';
import { TipCallout } from './TipCallout';
import { canIframeResource } from './ResourcePanel';

type Props = {
    day: Day;
    selectedIndex: number | null;
    onClearSelection: () => void;
    selectedModuleDone: boolean;
    onToggleSelectedModule: () => void;
    dayCompletedCount: number;
    dayTotalCount: number;
};

export function DayContent({
    day,
    selectedIndex,
    onClearSelection,
    selectedModuleDone,
    onToggleSelectedModule,
    dayCompletedCount,
    dayTotalCount,
}: Props) {
    const phase = phaseForDay(day.day);
    const selected =
        selectedIndex !== null && selectedIndex >= 0 && selectedIndex < day.resources.length
            ? day.resources[selectedIndex]
            : null;
    const dayAllDone = dayTotalCount > 0 && dayCompletedCount >= dayTotalCount;

    return (
        <main className="flex flex-col min-h-0 bg-[#050505]">
            <header className="shrink-0 bg-[#050505]/95 backdrop-blur-md border-b border-white/[0.05] px-8 py-3.5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <nav className="text-[11px] text-zinc-500 flex items-center gap-1.5 mb-1.5">
                            <Link href="/bitsat-chemistry-revision" className="text-zinc-500 hover:text-zinc-300 no-underline">
                                Overview
                            </Link>
                            <span className="text-zinc-700">›</span>
                            <span className="text-zinc-500">{phase?.label.split('·')[0].trim() ?? 'Phase'}</span>
                            <span className="text-zinc-700">›</span>
                            <span className="text-zinc-300">Day {day.day}</span>
                        </nav>
                        <div className="flex items-center gap-3">
                            <span className="bg-blue-500 text-white font-mono font-semibold px-2 py-0.5 rounded-full text-[10px] tracking-wider">
                                DAY {String(day.day).padStart(2, '0')}
                            </span>
                            <h1 className="font-[var(--font-outfit)] font-semibold text-[17px] text-white m-0 tracking-tight truncate">
                                {day.title.split('—')[0].trim()}
                            </h1>
                        </div>
                    </div>
                    <div className="shrink-0 pt-0.5">
                        {selected ? (
                            <button
                                type="button"
                                onClick={onToggleSelectedModule}
                                className={
                                    selectedModuleDone
                                        ? 'flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold text-[12px] transition-colors hover:bg-emerald-500/25'
                                        : 'flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-500 text-white font-semibold text-[12px] transition-colors hover:bg-blue-600'
                                }
                            >
                                <Check size={13} strokeWidth={2.5} />
                                {selectedModuleDone ? 'Completed' : 'Mark as complete'}
                            </button>
                        ) : dayTotalCount > 0 ? (
                            <div
                                className={[
                                    'flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[12px] font-medium tabular-nums',
                                    dayAllDone
                                        ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                                        : 'bg-white/[0.04] border-white/[0.08] text-zinc-300',
                                ].join(' ')}
                            >
                                {dayAllDone && <Check size={13} strokeWidth={2.5} />}
                                {dayAllDone
                                    ? 'Day complete'
                                    : `${dayCompletedCount} / ${dayTotalCount} modules`}
                            </div>
                        ) : null}
                    </div>
                </div>
            </header>

            <div className="flex-1 min-h-0 overflow-y-auto">
                {selected ? (
                    <PlayerView resource={selected} onBack={onClearSelection} />
                ) : (
                    <IntroView day={day} />
                )}
            </div>
        </main>
    );
}

function IntroView({ day }: { day: Day }) {
    return (
        <div className="max-w-[780px] mx-auto px-8 pt-10 pb-28">
            <h2 className="font-[var(--font-outfit)] font-bold text-3xl md:text-4xl leading-[1.15] tracking-tight text-white m-0 mb-4">
                {day.title.split('—')[0].trim()}
            </h2>
            <p className="text-[15px] leading-[1.7] text-zinc-300 m-0 mb-8 max-w-[62ch]">
                {day.focus}
            </p>

            {day.tip && <TipCallout text={day.tip} />}

            <div className="mt-10 p-5 rounded-xl bg-[#0B0F15] border border-white/[0.06] flex items-center gap-3">
                <ArrowRight size={18} className="text-blue-300 shrink-0" />
                <p className="m-0 text-[13px] text-zinc-300">
                    Pick a module on the right to start. <span className="text-zinc-500">Tick the circle next to each module as you finish it; the day completes automatically when all modules are done.</span>
                </p>
            </div>
        </div>
    );
}

function PlayerView({ resource, onBack }: { resource: Resource; onBack: () => void }) {
    const iframeable = canIframeResource(resource);
    const src = resource.embedUrl ?? resource.href;
    const isVideo =
        resource.kind === 'oneshot' || resource.kind === 'crash-course' || resource.kind === 'twomin';

    return (
        <div className="flex flex-col min-h-full">
            <div className="px-8 pt-5 pb-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-white transition-colors mb-1.5"
                    >
                        <ArrowLeft size={12} />
                        Back to overview
                    </button>
                    <h2 className="font-[var(--font-outfit)] font-semibold text-[18px] text-white m-0 truncate">
                        {resource.label}
                    </h2>
                </div>
                {iframeable && src && (
                    <a
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[12px] text-zinc-300 no-underline transition-colors"
                    >
                        <ExternalLink size={12} />
                        Open in new tab
                    </a>
                )}
            </div>

            {iframeable && src ? (
                <div className="flex-1 min-h-0 px-8 pb-24">
                    {isVideo ? (
                        <div className="relative w-full rounded-xl overflow-hidden border border-white/[0.08] bg-black" style={{ aspectRatio: '16 / 9' }}>
                            <iframe
                                key={src}
                                src={src}
                                className="absolute inset-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                allowFullScreen
                                title={resource.label}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-[min(82vh,900px)] rounded-xl overflow-hidden border border-white/[0.08] bg-[#0B0F15]">
                            <iframe
                                key={src}
                                src={src}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                allowFullScreen
                                title={resource.label}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex-1 min-h-0 px-8 pb-24 grid place-items-center">
                    <div className="max-w-md text-center p-8 rounded-xl bg-[#0B0F15] border border-white/[0.06]">
                        <ExternalLink size={22} className="text-blue-300 mx-auto mb-3" />
                        <h3 className="font-[var(--font-outfit)] font-semibold text-white m-0 mb-1.5 text-[16px]">
                            Opens in a new tab
                        </h3>
                        <p className="text-[13px] text-zinc-400 m-0 mb-5">
                            This tool needs a full browser tab to work well.
                        </p>
                        <a
                            href={resource.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium text-[13px] no-underline transition-colors"
                        >
                            Open {resource.label}
                            <ArrowRight size={14} />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
