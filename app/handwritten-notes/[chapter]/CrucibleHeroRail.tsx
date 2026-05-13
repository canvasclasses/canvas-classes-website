import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import MathRenderer from '../../crucible/admin/components/MathRenderer';
import type { ChapterCrucibleStats } from './chapterStats.server';

// Sticky right-rail Crucible CTA in the chapter hero. Replaces the old
// CruciblePracticeCard that sat under the notes grid — moves the primary
// conversion lever above the fold and keeps it visible during scroll.
// Server-rendered with real stats from questions_v2 and a sample demo
// question pulled at build time.

interface Props {
    chapterId: string;          // crucible chapter_id, e.g. 'ch11_mole'
    chapterName: string;        // for the CTA copy
    stats: ChapterCrucibleStats;
}

export default function CrucibleHeroRail({ chapterId, chapterName, stats }: Props) {
    const { totalPublished, pyqCount, demoCount, sampleDemo } = stats;
    const pyqPct = totalPublished > 0 ? Math.round((pyqCount / totalPublished) * 100) : 0;
    const correctOption = sampleDemo?.options.find((o) => o.is_correct);

    return (
        <aside
            className="sticky top-24 overflow-hidden rounded-3xl border border-orange-500/25 shadow-[0_30px_80px_-30px_rgba(255,106,26,0.35)]"
            style={{
                background:
                    'radial-gradient(120% 80% at 0% 0%, rgba(255,106,26,0.18), transparent 50%), linear-gradient(180deg, #1a1108 0%, #0f0a06 100%)',
            }}
        >
            {/* faint dot grid — depth */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
                    backgroundSize: '14px 14px',
                    maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.5), transparent 50%)',
                    WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.5), transparent 50%)',
                }}
            />

            {/* HEAD — brand + headline */}
            <div className="relative px-[18px] pb-3 pt-4">
                <div className="mb-2.5 flex items-center gap-2.5">
                    <div
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                        style={{
                            background: 'linear-gradient(135deg, #ff6a1a, #ff3d00)',
                            boxShadow:
                                '0 4px 14px -2px rgba(255,106,26,0.55), inset 0 0 0 1px rgba(255,255,255,0.18)',
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                            <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                            <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="2" />
                            <circle cx="12" cy="12" r="1.5" fill="white" />
                        </svg>
                    </div>
                    <div>
                        <div className="font-mono text-[10.5px] font-bold uppercase leading-tight tracking-[0.14em] text-orange-400">
                            Crucible
                        </div>
                        <div className="mt-0.5 text-[11px] text-zinc-500">
                            Adaptive practice. JEE/NEET PYQ DNA.
                        </div>
                    </div>
                </div>

                {totalPublished > 0 ? (
                    <div className="text-[18px] font-semibold leading-snug tracking-tight text-white">
                        <span className="font-mono">{totalPublished}</span>{' '}
                        <span className="text-amber-300">{chapterName}</span> questions sharpened on{' '}
                        <span className="text-amber-300">12 years of PYQs</span>
                    </div>
                ) : (
                    <div className="text-[18px] font-semibold leading-snug tracking-tight text-white">
                        Practice this chapter with <span className="text-amber-300">Crucible</span>
                    </div>
                )}
                <div className="mt-1 text-[12.5px] leading-snug text-zinc-300">
                    Every wrong answer gets a worked solution from Paaras Sir.
                </div>
            </div>

            {/* SAMPLE QUESTION — only when we have a curated demo question */}
            {sampleDemo && (
                <div className="relative mx-3.5 mb-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2.5">
                    <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.08em] text-zinc-500">
                        {sampleDemo.examLabel && (
                            <span className="rounded bg-sky-400/12 px-1.5 py-[1px] font-semibold tracking-[0.06em] text-sky-300">
                                {sampleDemo.examLabel}
                            </span>
                        )}
                        <span className="ml-auto">Sample · {sampleDemo.display_id}</span>
                    </div>
                    <div className="mb-2 text-zinc-100" style={{ fontSize: 13, lineHeight: 1.55 }}>
                        <MathRenderer
                            markdown={
                                sampleDemo.questionMarkdown.length > 220
                                    ? sampleDemo.questionMarkdown.slice(0, 220) + '…'
                                    : sampleDemo.questionMarkdown
                            }
                            fontSize={13}
                        />
                    </div>
                    {sampleDemo.options.length > 0 && (
                        <div className="grid gap-1">
                            {sampleDemo.options.slice(0, 3).map((opt) => {
                                const isCorrect = opt.is_correct;
                                return (
                                    <div
                                        key={opt.id}
                                        className={`flex items-start gap-2 rounded-md border px-2 py-1.5 text-[11.5px] leading-snug ${
                                            isCorrect
                                                ? 'border-teal-400/40 bg-teal-400/10 text-white'
                                                : 'border-white/[0.06] bg-black/30 text-zinc-300'
                                        }`}
                                    >
                                        <span
                                            className={`grid h-4 w-4 shrink-0 place-items-center rounded font-mono text-[9.5px] font-semibold uppercase ${
                                                isCorrect ? 'bg-teal-400 text-[#001613]' : 'bg-white/10 text-zinc-300'
                                            }`}
                                        >
                                            {opt.id}
                                        </span>
                                        <span className="flex-1" style={{ fontSize: 12.5, lineHeight: 1.5 }}>
                                            <MathRenderer markdown={opt.text} fontSize={12.5} />
                                        </span>
                                        {isCorrect && (
                                            <Check size={11} className="mt-0.5 shrink-0 text-teal-300" />
                                        )}
                                    </div>
                                );
                            })}
                            {sampleDemo.options.length > 3 && correctOption && !sampleDemo.options.slice(0, 3).some((o) => o.is_correct) && (
                                <div className="px-2 pt-0.5 text-[10px] italic text-zinc-500">
                                    + {sampleDemo.options.length - 3} more options
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* STATS — Questions / PYQ% / Demo */}
            <div className="relative grid grid-cols-3 border-y border-dashed border-white/[0.06] px-3.5 py-2.5">
                <div className="pr-2">
                    <div className="font-sans text-[16px] font-semibold leading-tight tracking-tight text-white">
                        {totalPublished}
                    </div>
                    <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-zinc-500">
                        Questions
                    </div>
                </div>
                <div className="border-x border-dashed border-white/[0.06] px-2">
                    <div className="font-sans text-[16px] font-semibold leading-tight tracking-tight text-white">
                        {pyqPct}
                        <span className="text-[10.5px] font-normal text-zinc-500">%</span>
                    </div>
                    <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-zinc-500">
                        PYQ rate
                    </div>
                </div>
                <div className="pl-2">
                    <div className="font-sans text-[16px] font-semibold leading-tight tracking-tight text-white">
                        {demoCount > 0 ? demoCount : '—'}
                    </div>
                    <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-zinc-500">
                        Free demo
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="relative px-3.5 pb-4 pt-3">
                <Link
                    href={`/the-crucible/${chapterId}?mode=browse`}
                    className="flex h-[46px] w-full items-center justify-center gap-2.5 rounded-[10px] text-[14px] font-semibold tracking-tight text-white transition-transform duration-150 hover:-translate-y-px"
                    style={{
                        background: 'linear-gradient(180deg, #ff7a2e, #f04e00)',
                        boxShadow:
                            '0 1px 0 rgba(255,255,255,0.25) inset, 0 -2px 0 rgba(0,0,0,0.15) inset, 0 14px 30px -10px rgba(255,106,26,0.6)',
                    }}
                >
                    Start practicing free
                    <ArrowRight size={16} strokeWidth={2} />
                </Link>
                <div className="mt-2 text-center text-[11.5px] text-zinc-500">
                    <b className="font-medium text-zinc-300">First {Math.min(demoCount || 10, 25)} questions free</b> · No
                    card · Worked solutions
                </div>
            </div>
        </aside>
    );
}
