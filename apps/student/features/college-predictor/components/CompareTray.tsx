'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCompare, MAX_PINNED } from './CompareContext';

// Floating bottom-anchored tray that appears once at least one college is
// pinned. Shows chips for each pinned item + a Compare CTA + a Clear button.

interface PinnedDisplay {
  id: string;
  title: string;
  subtitle?: string;
}

interface Props {
  /** Map pinned items into a tiny display shape. The tray doesn't know the
   *  data — caller decides how to render the chip label. */
  displayMapper: (item: { id: string; payload: unknown }) => PinnedDisplay;
}

export default function CompareTray({ displayMapper }: Props) {
  const { pinned, toggle, clear, setOpenModal } = useCompare();

  return (
    <AnimatePresence>
      {pinned.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl"
        >
          <div className="rounded-2xl bg-[#0B0F15] border border-white/15 shadow-2xl shadow-black/60 p-3 md:p-4 flex flex-wrap items-center gap-2">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mr-1">
              Compare ({pinned.length}/{MAX_PINNED})
            </div>
            {pinned.map((p) => {
              const d = displayMapper(p);
              return (
                <div
                  key={p.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-200"
                >
                  <span className="font-medium">{d.title}</span>
                  {d.subtitle && <span className="text-zinc-500">· {d.subtitle}</span>}
                  <button
                    type="button"
                    onClick={() => toggle({ id: p.id, payload: p.payload })}
                    className="text-zinc-500 hover:text-white text-base leading-none -mr-0.5"
                    aria-label={`Remove ${d.title} from comparison`}
                  >
                    ×
                  </button>
                </div>
              );
            })}
            <div className="flex-1" />
            <button
              type="button"
              onClick={clear}
              className="px-3 py-1.5 rounded-full text-[11px] text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={pinned.length < 2}
              onClick={() => setOpenModal(true)}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
            >
              {pinned.length < 2 ? 'Pin 2+ to compare' : 'Compare now →'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
