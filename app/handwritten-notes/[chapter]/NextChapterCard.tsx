import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CHAPTER_META_LIST, type ChapterMeta } from '../chapterMetadata';

// "Up next · Chapter NN" — derived from CHAPTER_META_LIST by sorting on
// ncertChapterNumber and finding the next chapter after the current one.
// Returns null if no next chapter exists (last chapter of the series).

interface Props {
    current: ChapterMeta;
}

function findNext(current: ChapterMeta): ChapterMeta | null {
    const sorted = [...CHAPTER_META_LIST]
        .filter((c) => c.classLevel === current.classLevel)
        .sort((a, b) => a.ncertChapterNumber - b.ncertChapterNumber);
    const idx = sorted.findIndex((c) => c.slug === current.slug);
    if (idx === -1 || idx + 1 >= sorted.length) return null;
    return sorted[idx + 1];
}

export default function NextChapterCard({ current }: Props) {
    const next = findNext(current);
    if (!next) return null;

    return (
        <Link
            href={`/handwritten-notes/${next.slug}`}
            className="group flex items-center justify-between gap-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/[0.15] hover:bg-white/[0.04]"
        >
            <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                    Up next · Chapter {Math.floor(next.ncertChapterNumber)}
                </div>
                <div className="mt-1 truncate text-[16px] font-semibold text-white">
                    {next.chapterName}
                </div>
            </div>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/[0.06] text-zinc-200 transition-all group-hover:bg-orange-500 group-hover:text-white">
                <ArrowRight size={16} />
            </div>
        </Link>
    );
}
