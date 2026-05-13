import { Clock } from 'lucide-react';
import type { ChapterMeta } from '../chapterMetadata';
import type { HandwrittenNote } from '../../lib/handwrittenNotesData';
import type { ChapterCrucibleStats } from './chapterStats.server';
import { computeStudentsFinished, formatStudentsFinished } from './studentsFinished';

// Chapter intro: meta pills, two-line title (handwritten + print), lead
// paragraph, and soft trust strip. Rendered inside the left column of the
// page-level 2-col grid (the Crucible rail occupies the right column at
// the page level — see app/handwritten-notes/[chapter]/page.tsx).

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

                <p className="mb-7 text-[15px] leading-relaxed text-zinc-300 md:text-[16px]">
                    {meta.leadParagraph}
                </p>

                {/* Trust strip — student-count counter on the left (deterministic
                    daily growth via studentsFinished.ts; the page rebuilds on a
                    24h ISR cycle), author + syllabus stamp on the right. */}
                <div className="mb-2 mt-2 flex flex-wrap items-center justify-between gap-3 rounded-full border border-white/[0.07] bg-white/[0.02] px-5 py-2.5 text-[12.5px] text-zinc-400">
                    <div className="flex items-center gap-2.5">
                        <span className="inline-flex">
                            <span className="-ml-0 inline-block h-5 w-5 rounded-full border-2 border-gray-950 bg-violet-400" />
                            <span className="-ml-1.5 inline-block h-5 w-5 rounded-full border-2 border-gray-950 bg-cyan-400" />
                            <span className="-ml-1.5 inline-block h-5 w-5 rounded-full border-2 border-gray-950 bg-amber-400" />
                            <span className="-ml-1.5 inline-block h-5 w-5 rounded-full border-2 border-gray-950 bg-emerald-400" />
                        </span>
                        <span>
                            <b className="font-semibold text-white">
                                {formatStudentsFinished(computeStudentsFinished(meta.slug))}
                            </b>{' '}
                            students finished this chapter
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500">
                        <span className="text-amber-400" style={{ letterSpacing: '-1px' }}>★★★★★</span>
                        <span>Written by Paaras Sir · 2025-26 syllabus</span>
                    </div>
                </div>
        </div>
    );
}

