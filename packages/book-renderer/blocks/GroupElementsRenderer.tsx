'use client';

// ─────────────────────────────────────────────────────────────────────────────
// GroupElementsRenderer — a row of element buttons (one per authored symbol)
// that expand inline into a rich ElementDetailCard. Built for the Class 12
// p-Block chapters: an author lists a group's members by symbol and the reader
// taps to explore each. Symbols are looked up in the shared 118-element table
// (@canvas/data/periodic/elementsData); unknown symbols are skipped silently.
//
// Interaction: clicking a button selects that element (showing its card below the
// button row); clicking another swaps it; clicking the active one collapses.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GroupElementsBlock } from '@canvas/data/types/books';
import { ELEMENTS, Element } from '@canvas/data/periodic/elementsData';
import { ElementDetailCard, getElementColor, isLightColor } from '../components/ElementDetailCard';

export default function GroupElementsRenderer({ block }: { block: GroupElementsBlock }) {
  const [activeSymbol, setActiveSymbol] = useState<string | null>(null);

  // Resolve authored symbols → Element, preserving author order, skipping unknowns.
  const elements: Element[] = (block.element_symbols || [])
    .map((sym) => ELEMENTS.find((e) => e.symbol === sym))
    .filter((e): e is Element => Boolean(e));

  if (elements.length === 0) return null;

  const active = elements.find((e) => e.symbol === activeSymbol) || null;

  return (
    <div className="my-6 rounded-2xl border border-white/5 bg-[#0B0F15] p-4 md:p-5">
      {block.title && (
        <h3 className="text-lg md:text-xl font-bold text-white mb-1">{block.title}</h3>
      )}
      {block.intro && (
        <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-4">{block.intro}</p>
      )}

      {/* Element button row — wraps on desktop, horizontally scrollable on mobile */}
      <div className="flex flex-nowrap sm:flex-wrap gap-2.5 overflow-x-auto sm:overflow-visible pb-1 -mx-1 px-1">
        {elements.map((el) => {
          const color = getElementColor(el);
          const dark = !isLightColor(color);
          const isActive = el.symbol === activeSymbol;
          return (
            <button
              key={el.symbol}
              onClick={() => setActiveSymbol(isActive ? null : el.symbol)}
              aria-pressed={isActive}
              className={`shrink-0 w-20 sm:w-24 rounded-xl p-2.5 text-center transition-all border
                ${isActive
                  ? 'ring-2 ring-white/80 border-white/30 scale-[1.03]'
                  : 'border-white/10 hover:border-white/30 hover:scale-[1.02]'}`}
              style={{ backgroundColor: color, color: dark ? '#fff' : '#111827' }}
            >
              <div className="text-[10px] font-semibold opacity-70 leading-none mb-1">{el.atomicNumber}</div>
              <div className="text-2xl sm:text-3xl font-bold leading-none">{el.symbol}</div>
              <div className="text-[11px] sm:text-xs font-medium opacity-90 mt-1 truncate">{el.name}</div>
            </button>
          );
        })}
      </div>

      {/* Inline expanded detail card */}
      <AnimatePresence initial={false} mode="wait">
        {active && (
          <motion.div
            key={active.symbol}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            <ElementDetailCard element={active} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
