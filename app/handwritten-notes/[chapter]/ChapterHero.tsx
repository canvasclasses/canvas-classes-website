import { Clock } from 'lucide-react';
import CrucibleHeroRail from './CrucibleHeroRail';
import type { ChapterMeta } from '../chapterMetadata';
import type { HandwrittenNote } from '../../lib/handwrittenNotesData';
import type { ChapterCrucibleStats } from './chapterStats.server';

// Two-column hero: chapter intro + breadcrumb stats on the left, sticky
// Crucible rail on the right. Replaces the previous single-column hero —
// moves the primary conversion CTA above the fold and keeps it visible
// during scroll.

const SUBJECT_PILL: Record<ChapterMeta['subject'], string> = {
    Physical: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
    Organic: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
    Inorganic: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    Practical: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
};

interface Props {
    meta: ChapterMeta;
    notes: HandwrittenNote[];
    crucibleStats: ChapterCrucibleStats;
}

export default function ChapterHero({ meta, notes, crucibleStats }: Props) {
    return (
        <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            {/* LEFT — chapter intro */}
            <div className="min-w-0">
                {/* Meta pills */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] ${SUBJECT_PILL[meta.subject]}`}
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        Class {meta.classLevel} · {meta.subject}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.10] bg-white/[0.03] px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
                        {notes.length} {notes.length === 1 ? 'PDF' : 'PDFs'}
                    </span>
                    {crucibleStats.totalPublished > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.10] bg-white/[0.03] px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
                            <Clock size={11} />
                            {crucibleStats.totalPublished} practice Qs
                        </span>
                    )}
                </div>

                <h1
                    className="mb-4 text-[clamp(34px,4.5vw,52px)] font-semibold leading-[1.04] tracking-[-0.035em] text-white"
                    style={{ textWrap: 'balance' }}
                >
                    {meta.h1}
                </h1>

                <p className="mb-7 max-w-[58ch] text-[15px] leading-relaxed text-zinc-300 md:text-[16px]">
                    {meta.leadParagraph}
                </p>

                {/* Stats strip — three real data tiles */}
                <ChapterStatsStrip notes={notes} stats={crucibleStats} />
            </div>

            {/* RIGHT — Crucible rail (hidden on mobile, sticky on desktop). Only
                renders when the chapter has a Crucible mapping — chapters without
                a crucibleChapterId (a few practicals) just leave a single-column
                hero on desktop. */}
            {meta.crucibleChapterId && (
                <div className="hidden lg:block">
                    <CrucibleHeroRail
                        chapterId={meta.crucibleChapterId}
                        chapterName={meta.chapterName}
                        stats={crucibleStats}
                    />
                </div>
            )}
        </section>
    );
}

// ── Stats strip ──────────────────────────────────────────────────────────
// Three tiles with real data: PDFs, PYQs, free-demo questions. Skips
// fabricated metrics from the design (weightage %, difficulty letter) —
// we'd rather show fewer real numbers than guess.
function ChapterStatsStrip({
    notes,
    stats,
}: {
    notes: HandwrittenNote[];
    stats: ChapterCrucibleStats;
}) {
    const tiles = [
        { label: 'PDFs', value: String(notes.length), hint: 'in this chapter' },
        stats.totalPublished > 0
            ? { label: 'JEE / NEET PYQs', value: String(stats.pyqCount), hint: `of ${stats.totalPublished}` }
            : null,
        stats.demoCount > 0
            ? { label: 'Free demo Qs', value: String(stats.demoCount), hint: 'with worked solutions' }
            : null,
    ].filter((t): t is { label: string; value: string; hint: string } => t !== null);

    if (tiles.length === 0) return null;

    return (
        <div className="mb-2 grid grid-cols-1 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015] sm:grid-cols-3">
            {tiles.map((tile, i) => (
                <div
                    key={tile.label}
                    className={`px-5 py-4 ${
                        i > 0 ? 'border-t border-white/[0.07] sm:border-l sm:border-t-0' : ''
                    }`}
                >
                    <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-500">
                        {tile.label}
                    </div>
                    <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-[22px] font-semibold tracking-tight text-white">
                            {tile.value}
                        </span>
                        <span className="text-[12px] text-zinc-500">{tile.hint}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
