'use client';

import { useState } from 'react';
import { YouSolveItBlock } from '@canvas/data/types/books';
import InlineMarkdown from './InlineMarkdown';

/**
 * "You Solve It" — a real, unsolved Indian problem (web-verified against actual
 * reports, never invented) that the student must reason a solution to. Unlike
 * perspective_scenario (which is about appreciating why stakeholders disagree and
 * never asks for a solution), this lays out the ACTUAL proposals being debated —
 * each with its genuine upside AND its genuine catch, all visible so weighing
 * them is the exercise — and asks the student to COMMIT to one and defend it,
 * naming their own pick's weakness. Committing unlocks a reality-check on where
 * the real debate stands: grounding, not "the correct answer."
 *
 * Visual identity: a warm amber accent, deliberately distinct from the indigo
 * perspective_scenario, teal curiosity_prompt and per-type reasoning_prompt
 * families — this block is about grappling with a hard real-world problem.
 */

const ACCENT = '#f59e0b';        // amber-500
const ACCENT_DIM = 'rgba(245,158,11,0.10)';
const ACCENT_BORDER = 'rgba(245,158,11,0.35)';
const UPSIDE = '#34d399';        // emerald-400 — semantic, separate from accent
const CATCH = '#fb7185';         // rose-400   — semantic, separate from accent

export default function YouSolveItRenderer({ block }: { block: YouSolveItBlock }) {
  const [chosenId, setChosenId] = useState<string | null>(null);

  return (
    <div className="my-10 rounded-2xl border overflow-hidden" style={{ borderColor: ACCENT_BORDER }}>

      {/* Header */}
      <div className="px-5 py-3 border-b flex items-center gap-2.5" style={{ borderColor: ACCENT_BORDER, background: ACCENT_DIM }}>
        <span style={{ color: ACCENT }} className="text-[15px] leading-none">◎</span>
        <span className="text-[10px] font-bold uppercase tracking-widest flex-1" style={{ color: ACCENT }}>
          You Solve It — A Real, Unsolved Indian Problem
        </span>
      </div>

      <div className="px-5 py-5">
        {/* Title */}
        <h4 className="text-[19px] font-bold text-white/92 mb-4 leading-snug">{block.title}</h4>

        {/* Optional infographic */}
        {(block.image_src || block.image_prompt) && (
          <figure className="mb-4">
            {block.image_src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={block.image_src}
                alt={block.image_caption ?? block.title}
                loading="lazy"
                className="w-full rounded-lg border border-white/10"
              />
            ) : (
              <div className="rounded-lg border border-dashed border-white/12 bg-white/[0.02] px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1.5">
                  Infographic needed — generation prompt:
                </p>
                <p className="text-[12px] text-white/38 font-mono leading-relaxed select-all">
                  {block.image_prompt}
                </p>
              </div>
            )}
            {block.image_caption && (
              <figcaption className="text-[12px] text-white/35 italic mt-1.5">{block.image_caption}</figcaption>
            )}
          </figure>
        )}

        {/* The Problem */}
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: ACCENT }}>
          The Problem
        </p>
        <InlineMarkdown paragraphClassName="text-[14.5px] leading-[1.8] text-white/75 mb-4">
          {block.problem}
        </InlineMarkdown>

        {/* Why it's stubborn */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/45 mb-1.5">
          Why It&rsquo;s Stubborn
        </p>
        <InlineMarkdown paragraphClassName="text-[14.5px] leading-[1.8] text-white/75 mb-4">
          {block.why_hard}
        </InlineMarkdown>

        {/* Source note — always visible */}
        <div className="flex items-start gap-2 mb-5 pt-3 border-t border-white/8">
          <span className="text-[11px] mt-[1px]" style={{ color: ACCENT }}>◆</span>
          <p className="text-[12.5px] text-white/40 leading-relaxed italic">{block.source_note}</p>
        </div>

        {/* Solutions on the table — upside + catch always visible; weighing them is the point */}
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/45 mb-3">
          The Solutions on the Table
        </p>
        <div className="flex flex-col gap-3 mb-6">
          {block.solutions.map((sol) => {
            const isChosen = chosenId === sol.id;
            return (
              <div
                key={sol.id}
                className="rounded-xl border px-4 py-4 transition-all duration-150"
                style={{
                  borderColor: isChosen ? ACCENT_BORDER : 'rgba(255,255,255,0.09)',
                  background: isChosen ? ACCENT_DIM : 'rgba(255,255,255,0.02)',
                  opacity: chosenId && !isChosen ? 0.6 : 1,
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <p className="text-[15px] font-semibold text-white/90 leading-snug">{sol.label}</p>
                  {isChosen && (
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md"
                      style={{ color: ACCENT, background: ACCENT_DIM, border: `1px solid ${ACCENT_BORDER}` }}>
                      ✓ Your call
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide mt-[3px] shrink-0" style={{ color: UPSIDE }}>Upside</span>
                  <InlineMarkdown paragraphClassName="text-[13.5px] leading-[1.7] text-white/68">
                    {sol.upside}
                  </InlineMarkdown>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wide mt-[3px] shrink-0" style={{ color: CATCH }}>The&nbsp;catch</span>
                  <InlineMarkdown paragraphClassName="text-[13.5px] leading-[1.7] text-white/68">
                    {sol.tradeoff}
                  </InlineMarkdown>
                </div>

                {!chosenId && (
                  <button
                    onClick={() => setChosenId(sol.id)}
                    className="mt-3 text-[13px] font-semibold px-3.5 py-1.5 rounded-lg transition-colors"
                    style={{ color: ACCENT, background: ACCENT_DIM, border: `1px solid ${ACCENT_BORDER}` }}
                  >
                    I&rsquo;d back this →
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Prompt — asks the student to commit + name their own pick's weakness */}
        <p className="text-[15.5px] font-semibold text-white/90 mb-2">{block.prompt}</p>

        {chosenId ? (
          <div className="mt-5 pt-4 border-t border-white/8">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
              Where the Debate Actually Stands
            </p>
            <InlineMarkdown paragraphClassName="text-[14px] leading-[1.8] text-white/64">
              {block.reality_check}
            </InlineMarkdown>
            <button
              onClick={() => setChosenId(null)}
              className="mt-4 text-[12px] text-white/35 hover:text-white/55 transition-colors"
            >
              ↺ Rethink from scratch
            </button>
          </div>
        ) : (
          <p className="text-[13px] text-white/40 italic mt-1">
            Pick the solution you&rsquo;d back above to see where the real debate stands.
          </p>
        )}
      </div>
    </div>
  );
}
