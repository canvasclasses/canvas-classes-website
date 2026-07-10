'use client';

import { useState } from 'react';
import { PerspectiveScenarioBlock } from '@canvas/data/types/books';
import InlineMarkdown from './InlineMarkdown';

/**
 * Perspective Scenario — a real, documented Indian case (a genuine institutional
 * or expert debate, never an invented hypothetical) framed as a decision the
 * student has to make. Every option is an ACTUAL real-world position, not a
 * right/wrong choice — picking one reveals that position's real reasoning and
 * tradeoff, then the other options unlock too, so the student sees every real
 * perspective regardless of which they picked. Closes on a synthesis that is
 * explicitly not a verdict.
 *
 * Visual identity: a cool slate/indigo accent, deliberately distinct from the
 * curiosity_prompt (teal), exam_tip (amber) and reasoning_prompt (per-type
 * colour) families — this block is about weighing real civic tradeoffs, not
 * "getting it right," so nothing here reads as correct/incorrect.
 */

const ACCENT = '#818cf8';       // indigo-400
const ACCENT_DIM = 'rgba(129,140,248,0.10)';
const ACCENT_BORDER = 'rgba(129,140,248,0.35)';

export default function PerspectiveScenarioRenderer({ block }: { block: PerspectiveScenarioBlock }) {
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const chosen = block.options.find((o) => o.id === chosenId) ?? null;
  const others = block.options.filter((o) => o.id !== chosenId);

  return (
    <div className="my-10 rounded-2xl border overflow-hidden" style={{ borderColor: ACCENT_BORDER }}>

      {/* Header */}
      <div className="px-5 py-3 border-b flex items-center gap-2.5" style={{ borderColor: ACCENT_BORDER, background: ACCENT_DIM }}>
        <span style={{ color: ACCENT }} className="text-[15px] leading-none">⚖</span>
        <span className="text-[10px] font-bold uppercase tracking-widest flex-1" style={{ color: ACCENT }}>
          A Real Decision — No Single Right Answer
        </span>
      </div>

      <div className="px-5 py-5">
        {/* Title */}
        <h4 className="text-[19px] font-bold text-white/92 mb-2 leading-snug">{block.title}</h4>

        {/* Role frame */}
        <p className="text-[15px] italic text-white/60 mb-4 leading-relaxed">{block.role_frame}</p>

        {/* Infographic — offloads comparative/timeline facts so event_context stays short */}
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

        {/* Event context */}
        <InlineMarkdown paragraphClassName="text-[14.5px] leading-[1.8] text-white/72 mb-2">
          {block.event_context}
        </InlineMarkdown>

        {/* Source note — citation, always visible */}
        <div className="flex items-start gap-2 mt-3 mb-5 pt-3 border-t border-white/8">
          <span className="text-[11px] mt-[1px]" style={{ color: ACCENT }}>◆</span>
          <p className="text-[12.5px] text-white/40 leading-relaxed italic">{block.source_note}</p>
        </div>

        {/* Prompt */}
        <p className="text-[15.5px] font-semibold text-white/90 mb-4">{block.prompt}</p>

        {/* Options — equal visual weight, no correctness styling */}
        {!chosen && (
          <div className="flex flex-col gap-2.5">
            {block.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setChosenId(opt.id)}
                className="text-left px-4 py-3 rounded-xl text-[14.5px] transition-all duration-150 border"
                style={{
                  borderColor: 'rgba(255,255,255,0.09)',
                  background: 'rgba(255,255,255,0.02)',
                  color: 'rgba(255,255,255,0.82)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Chosen option — its real position + reasoning */}
        {chosen && (
          <div className="rounded-xl px-4 py-4 mb-5 border" style={{ borderColor: ACCENT_BORDER, background: ACCENT_DIM }}>
            <p className="text-[14.5px] font-semibold text-white/90 mb-1.5">{chosen.label}</p>
            <p className="text-[11px] font-bold uppercase tracking-wide mb-3" style={{ color: ACCENT }}>
              {chosen.real_position}
            </p>
            <InlineMarkdown paragraphClassName="text-[14px] leading-[1.8] text-white/70">
              {chosen.perspective}
            </InlineMarkdown>
          </div>
        )}

        {/* Other perspectives — unlock after a choice, explorable */}
        {chosen && others.length > 0 && (
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/35 mb-2.5">
              How others might have approached this
            </p>
            <div className="flex flex-col gap-2">
              {others.map((opt) => {
                const isOpen = openId === opt.id;
                return (
                  <div key={opt.id} className="rounded-xl border border-white/8 overflow-hidden">
                    <button
                      onClick={() => setOpenId(isOpen ? null : opt.id)}
                      className="w-full text-left px-4 py-3 text-[14px] text-white/70 flex items-center justify-between gap-3"
                    >
                      <span>{opt.label}</span>
                      <span className="text-white/30 text-[12px] shrink-0">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1">
                        <p className="text-[10.5px] font-bold uppercase tracking-wide mb-2" style={{ color: ACCENT }}>
                          {opt.real_position}
                        </p>
                        <InlineMarkdown paragraphClassName="text-[13.5px] leading-[1.75] text-white/60">
                          {opt.perspective}
                        </InlineMarkdown>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Synthesis — explicitly not a verdict */}
        {chosen && (
          <div className="pt-4 border-t border-white/8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/35 mb-2">
              Where This Actually Stands
            </p>
            <InlineMarkdown paragraphClassName="text-[14px] leading-[1.8] text-white/62">
              {block.synthesis}
            </InlineMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
