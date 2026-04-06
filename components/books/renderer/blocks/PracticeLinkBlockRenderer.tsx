'use client';

import { PracticeLinkBlock } from '@/types/books';

export default function PracticeLinkBlockRenderer({ block }: { block: PracticeLinkBlock }) {
  const href =
    block.style === 'link_to_crucible'
      ? block.chapter_tag
        ? `/the-crucible?tag=${block.chapter_tag}`
        : `/the-crucible?ids=${block.question_ids.join(',')}`
      : '#'; // inline_quiz handled by student app

  const count = block.question_ids.length;

  return (
    <div className="my-4 p-4 bg-[#151E32] border border-orange-500/20 rounded-xl flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-white/90">{block.label}</p>
        {count > 0 && (
          <p className="text-xs text-white/50 mt-0.5">
            {count} question{count !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      <a
        href={href}
        className="shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500
          text-black text-sm font-bold hover:opacity-90 transition-opacity"
      >
        Practice →
      </a>
    </div>
  );
}
