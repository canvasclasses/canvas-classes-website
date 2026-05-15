import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CrucibleBrand from '@/features/crucible/components/CrucibleBrand';
import CrucibleQuestionCarousel, {
    type CarouselQuestion,
} from '@/features/crucible/components/CrucibleQuestionCarousel';
import type { ChapterCrucibleStats, SampleDemoQuestion } from '../lib/chapterStats.server';
import type { ChapterMeta } from '../data/chapterMetadata';

// Sticky right-rail Crucible CTA in the chapter hero. Brand identity
// (icon + wordmark + tagline) comes from the shared <CrucibleBrand/>
// component; the cycling question card is the same <CrucibleQuestionCarousel/>
// the landing's hero uses — visual + animation parity is intentional, the
// rail IS Crucible's voice on this surface.

// Subject sub-type → accent colour for the carousel pill. Matches the
// per-subject palette used in ChapterHero's meta pills so a student sees
// the same colour for the same chapter category across the page.
const SUBJECT_ACCENT: Record<ChapterMeta['subject'], string> = {
    Physical: '#38bdf8',
    Organic: '#a78bfa',
    Inorganic: '#34d399',
    Practical: '#fbbf24',
};

interface Props {
    chapterId: string;                  // crucible chapter_id, e.g. 'ch11_mole'
    chapterName: string;                // shown in the carousel meta row + headline
    subject: ChapterMeta['subject'];    // for the carousel subject pill + accent
    stats: ChapterCrucibleStats;
}

// Map a SampleDemoQuestion (server-fetched shape) → the CarouselQuestion
// shape the shared client component expects.
function toCarousel(d: SampleDemoQuestion): CarouselQuestion {
    const correctIndex = Math.max(
        0,
        d.options.findIndex((o) => o.is_correct)
    );
    return {
        exam: d.examLabel ?? '',
        body: d.questionMarkdown,
        options: d.options.map((o) => o.text),
        correctIndex,
    };
}

export default function CrucibleHeroRail({ chapterId, chapterName, subject, stats }: Props) {
    const { totalPublished, pyqCount, sampleDemos } = stats;
    const nonPyqCount = Math.max(0, totalPublished - pyqCount);
    const carouselQuestions: CarouselQuestion[] = sampleDemos
        .filter((d) => d.options.length >= 2 && d.options.some((o) => o.is_correct))
        .map(toCarousel);
    const subjectLabel = `${subject} Chemistry`;
    const subjectAccent = SUBJECT_ACCENT[subject] ?? '#38bdf8';

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

            {/* HEAD — shared Crucible brand (icon + wordmark + tagline) so this
                rail and the /the-crucible landing always read as the same product.
                Sized to fit the 380px rail (35px icon, 18px wordmark, 9px tagline)
                but visually identical to the landing's nav at proportional sizes. */}
            <div className="relative px-5 pb-3.5 pt-5">
                <CrucibleBrand iconSize={35} wordmarkSize={18} taglineSize={9} idPrefix="rail" />

                {totalPublished > 0 ? (
                    <div
                        className="mt-4 font-semibold text-white"
                        style={{ fontSize: 22, lineHeight: 1.2, letterSpacing: '-0.015em' }}
                    >
                        <span>{totalPublished} questions </span>
                        <em className="not-italic text-amber-300" style={{ fontStyle: 'italic' }}>
                            tailored
                        </em>
                        <span> to your accuracy</span>
                    </div>
                ) : (
                    <div
                        className="mt-4 font-semibold text-white"
                        style={{ fontSize: 22, lineHeight: 1.2, letterSpacing: '-0.015em' }}
                    >
                        Practice this chapter with <span className="text-amber-300">Crucible</span>
                    </div>
                )}
                <div className="mt-2 text-[13px] leading-snug text-zinc-400">
                    Sharpened on 12 years of {chapterName} PYQs. Every wrong answer gets a worked
                    solution from Paaras Sir.
                </div>
            </div>

            {/* CYCLING SAMPLE — same QuestionCard design and timings as the
                Crucible landing hero, parameterised with this chapter's curated
                demo questions. Only renders when we have at least one usable demo. */}
            {carouselQuestions.length > 0 && (
                <div className="relative mx-3.5 mb-3">
                    <CrucibleQuestionCarousel
                        questions={carouselQuestions}
                        subjectLabel={subjectLabel}
                        chapterName={chapterName}
                        subjectAccent={subjectAccent}
                    />
                </div>
            )}

            {/* STATS — Questions / PYQs / Non-PYQs. Three real counts that
                describe the bank's composition: total practice questions, of
                which N are previous-year exam questions and the rest are
                handwritten practice problems. */}
            <div className="relative grid grid-cols-3 border-y border-dashed border-white/[0.06] px-5 py-3">
                <div className="pr-3">
                    <div className="font-sans text-[19px] font-semibold leading-tight tracking-tight text-white">
                        {totalPublished}
                    </div>
                    <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-zinc-500">
                        Questions
                    </div>
                </div>
                <div className="border-x border-dashed border-white/[0.06] px-3">
                    <div className="font-sans text-[19px] font-semibold leading-tight tracking-tight text-white">
                        {pyqCount}
                    </div>
                    <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-zinc-500">
                        PYQs
                    </div>
                </div>
                <div className="pl-3">
                    <div className="font-sans text-[19px] font-semibold leading-tight tracking-tight text-white">
                        {nonPyqCount}
                    </div>
                    <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-zinc-500">
                        Non-PYQ
                    </div>
                </div>
            </div>

            {/* CTA — sized up to match the design's visual weight: 52px tall,
                16px text, slightly bolder ring. */}
            <div className="relative px-5 pb-5 pt-4">
                <Link
                    href={`/the-crucible/${chapterId}?mode=browse`}
                    className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl font-semibold tracking-tight text-white transition-transform duration-150 hover:-translate-y-px"
                    style={{
                        background: 'linear-gradient(180deg, #ff7a2e, #f04e00)',
                        boxShadow:
                            '0 1px 0 rgba(255,255,255,0.25) inset, 0 -2px 0 rgba(0,0,0,0.15) inset, 0 18px 36px -10px rgba(255,106,26,0.65)',
                        fontSize: 16,
                    }}
                >
                    Start practicing
                    <ArrowRight size={18} strokeWidth={2.25} />
                </Link>
            </div>
        </aside>
    );
}
