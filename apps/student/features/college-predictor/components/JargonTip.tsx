'use client';

import { useState } from 'react';

// Inline tooltip for predictor jargon (CRL, NIRF, HS quota, etc.).
// Renders the term as a dotted-underline span; tap/hover reveals a small
// dark popover that auto-positions below the term.
//
// Native `title=` is set as well so screen readers + non-JS users still get
// the explanation, and so tooltips don't require client JS to be useful.

interface Props {
  term: string;
  explainer: string;
}

export default function JargonTip({ term, explainer }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="underline decoration-dotted underline-offset-2 decoration-zinc-500 hover:decoration-orange-400 transition-colors cursor-help"
        aria-expanded={open}
        title={explainer}
      >
        {term}
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute z-30 left-1/2 -translate-x-1/2 top-full mt-1.5 w-56 max-w-[80vw] rounded-lg bg-[#0B0F15] border border-white/15 shadow-xl shadow-black/40 px-3 py-2 text-[11px] text-zinc-200 leading-snug whitespace-normal text-left"
        >
          {explainer}
        </span>
      )}
    </span>
  );
}

// Canonical glossary entries, kept in this module so usage stays
// terminology-consistent across both predictors.
export const GLOSSARY = {
  CRL: 'Common Rank List — your overall JEE Main rank across every category. Lower is better.',
  CategoryRank: "Your rank within your reserved category only (OBC-NCL / SC / ST / EWS). JoSAA uses category ranks — not CRL — to allocate reserved seats.",
  NIRF: 'National Institutional Ranking Framework — the government\'s official India ranking of engineering colleges. Lower number = higher rank.',
  HS: 'Home-State quota — seats reserved for residents of the state where the NIT is located. Cutoffs are usually softer than All-India (AI) for HS candidates.',
  OS: 'Other-State quota — seats open to students from outside the NIT\'s home state. Tighter cutoffs than HS.',
  AI: 'All-India quota — used at IIITs and GFTIs (no state-quota concept). Same cutoff for everyone in the same category.',
  PYQ: 'Previous Year Question paper — past JEE / BITSAT exam papers used to gauge difficulty.',
} as const;
