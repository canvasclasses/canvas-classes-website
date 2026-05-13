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

                {/* Two-line title: chapter name in handwritten Kalam amber (the
                    brand differentiator), followed by "Handwritten Notes" in Geist
                    white. The canonical meta.h1 is preserved via aria-label so SEO
                    and screen-reader output match the original semantics. */}
                <h1
                    className="mb-5 leading-[1.02] tracking-[-0.025em]"
                    style={{ textWrap: 'balance' }}
                    aria-label={meta.h1}
                >
                    <span
                        className="block text-amber-300"
                        style={{
                            fontFamily: 'var(--font-kalam), cursive',
                            fontSize: 'clamp(40px, 5.5vw, 60px)',
                            fontWeight: 600,
                            letterSpacing: '-0.01em',
                            lineHeight: 1.05,
                        }}
                    >
                        {meta.chapterName}
                    </span>
                    <span
                        className="mt-0.5 block font-semibold text-white"
                        style={{
                            fontSize: 'clamp(32px, 4.2vw, 48px)',
                            letterSpacing: '-0.035em',
                            lineHeight: 1.05,
                        }}
                    >
                        Handwritten Notes
                    </span>
                </h1>

                <p className="mb-7 max-w-[58ch] text-[15px] leading-relaxed text-zinc-300 md:text-[16px]">
                    {meta.leadParagraph}
                </p>

                {/* Stats strip — 4 real data tiles */}
                <ChapterStatsStrip notes={notes} stats={crucibleStats} />

                {/* Soft non-numeric trust strip. The design's version had
                    fabricated "42,108 students" + "4.92 stars" counts — replaced
                    with honest signals that don't claim specific numbers. */}
                <div className="mb-2 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-full border border-white/[0.07] bg-white/[0.02] px-5 py-2.5 text-[12.5px] text-zinc-400">
                    <div className="flex items-center gap-2.5">
                        <span className="inline-flex">
                            <span className="-ml-0 inline-block h-5 w-5 rounded-full border-2 border-gray-950 bg-violet-400" />
                            <span className="-ml-1.5 inline-block h-5 w-5 rounded-full border-2 border-gray-950 bg-cyan-400" />
                            <span className="-ml-1.5 inline-block h-5 w-5 rounded-full border-2 border-gray-950 bg-amber-400" />
                            <span className="-ml-1.5 inline-block h-5 w-5 rounded-full border-2 border-gray-950 bg-emerald-400" />
                        </span>
                        <span>
                            <b className="font-semibold text-white">Trusted</b> by JEE/NEET aspirants across India
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500">
                        <span className="text-amber-400" style={{ letterSpacing: '-1px' }}>★★★★★</span>
                        <span>Written by Paaras Sir · 2025-26 syllabus</span>
                    </div>
                </div>
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
// 4 tiles, all data-driven (no fabricated counts):
//   PDFs              — count of handwritten note PDFs
//   PYQs Tagged       — count of PYQ-source questions in the chapter
//   Weightage         — approximate % of JEE Main PYQs (chapter share within class)
//   Difficulty        — Easy / Medium / Hard from mean difficultyLevel
function ChapterStatsStrip({
    notes,
    stats,
}: {
    notes: HandwrittenNote[];
    stats: ChapterCrucibleStats;
}) {
    type Tile = { label: string; value: string; hint: string };
    const tiles: Tile[] = [];
    tiles.push({ label: 'PDFs', value: String(notes.length), hint: notes.length === 1 ? 'in this chapter' : 'PDFs in chapter' });
    if (stats.totalPublished > 0) {
        tiles.push({ label: 'PYQs Tagged', value: String(stats.pyqCount), hint: 'JEE + NEET' });
    }
    if (stats.weightagePct !== null) {
        tiles.push({ label: 'Weightage', value: String(stats.weightagePct), hint: '% in JEE' });
    }
    if (stats.difficultyLabel) {
        const initial = stats.difficultyLabel[0];
        tiles.push({ label: 'Difficulty', value: initial, hint: stats.difficultyLabel.slice(1).toLowerCase() });
    }

    if (tiles.length === 0) return null;

    // Use 4 columns when we have 4 tiles, otherwise scale down. Mobile stays 2 cols.
    const colsCls = tiles.length >= 4 ? 'sm:grid-cols-2 md:grid-cols-4' : tiles.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';

    return (
        <div className={`mb-2 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015] ${colsCls}`}>
            {tiles.map((tile, i) => (
                <div
                    key={tile.label}
                    className={`px-5 py-4 ${
                        // Border logic: separators between tiles, never on the right of the last column.
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
