'use client';

import { JuniorPracticeBlock } from '@canvas/data/types/books';

// Editor for the bank-backed junior practice block. It carries NO questions —
// those live in the Junior Question Bank (admin → /junior-bank) and are fetched
// at render time by book_slug + chapter_number. Leave book_slug blank to use
// the page's own book.
export default function JuniorPracticeEditor({
  block, onChange,
}: { block: JuniorPracticeBlock; onChange: (patch: Partial<JuniorPracticeBlock>) => void }) {
  const inp = 'w-full rounded-lg border border-white/10 bg-[#151E32] px-3 py-2 text-sm text-white/90 focus:border-orange-400/50 focus:outline-none';
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-xs text-white/50">Chapter number</span>
          <input type="number" min={1} value={block.chapter_number}
            onChange={(e) => onChange({ chapter_number: Number(e.target.value) })} className={inp} />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-white/50">Mode</span>
          <select value={block.mode ?? 'practice'} onChange={(e) => onChange({ mode: e.target.value as 'practice' | 'test' })} className={inp}>
            <option value="practice">Practice (with feedback)</option>
            <option value="test">Test (timed, no feedback)</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-xs text-white/50">Questions per session</span>
          <input type="number" min={1} max={50} value={block.session_size ?? 10}
            onChange={(e) => onChange({ session_size: Number(e.target.value) })} className={inp} />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-white/50">Pass threshold (0–1)</span>
          <input type="number" min={0} max={1} step={0.05} value={block.pass_threshold ?? 0.7}
            onChange={(e) => onChange({ pass_threshold: Number(e.target.value) })} className={inp} />
        </label>
      </div>
      <label className="block space-y-1">
        <span className="text-xs text-white/50">Title (optional)</span>
        <input value={block.title ?? ''} onChange={(e) => onChange({ title: e.target.value })} className={inp} placeholder="Practice this chapter" />
      </label>
      <label className="block space-y-1">
        <span className="text-xs text-white/50">Intro (optional)</span>
        <input value={block.intro ?? ''} onChange={(e) => onChange({ intro: e.target.value })} className={inp} />
      </label>
      <label className="block space-y-1">
        <span className="text-xs text-white/50">Bank source book_slug (blank = this book)</span>
        <input value={block.book_slug ?? ''} onChange={(e) => onChange({ book_slug: e.target.value })} className={inp} placeholder="class9-science" />
      </label>
      <p className="text-xs text-white/35">
        Questions are authored in the Junior Question Bank panel, not here. This block serves
        published questions for the chosen chapter.
      </p>
    </div>
  );
}
