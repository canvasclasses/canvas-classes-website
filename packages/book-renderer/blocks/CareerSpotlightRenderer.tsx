'use client';

import { CareerSpotlightBlock } from '@canvas/data/types/books';
import InlineMarkdown from './InlineMarkdown';

/**
 * Career Spotlight — "who does this become, as a job?" Each profession is its
 * own scannable row (icon + bolded role + description), not one dense
 * paragraph. Promoted from a `callout` variant (2026-07-08, founder feedback:
 * a wall of text buried the actual list of professions).
 *
 * Visual identity: a warm bronze/gold accent — deliberately distinct from every
 * other family (teal curiosity, amber exam_tip, indigo perspective_scenario) —
 * evokes an achievement/insignia feel appropriate to "real careers."
 */

const ACCENT = '#c9974a';
const ACCENT_DIM = 'rgba(201,151,74,0.09)';
const ACCENT_BORDER = 'rgba(201,151,74,0.28)';

export default function CareerSpotlightRenderer({ block }: { block: CareerSpotlightBlock }) {
  return (
    <div className="my-8 rounded-2xl border overflow-hidden" style={{ borderColor: ACCENT_BORDER }}>

      {/* Header */}
      <div className="px-5 py-3 border-b flex items-center gap-2.5" style={{ borderColor: ACCENT_BORDER, background: ACCENT_DIM }}>
        <span style={{ color: ACCENT }} className="text-[15px] leading-none">💼</span>
        <span className="text-[10px] font-bold uppercase tracking-widest flex-1" style={{ color: ACCENT }}>
          {block.title}
        </span>
      </div>

      <div className="px-5 py-4">
        {/* Intro */}
        {block.intro && (
          <InlineMarkdown paragraphClassName="text-[14px] italic text-white/55 mb-4 leading-relaxed">
            {block.intro}
          </InlineMarkdown>
        )}

        {/* Roles — one scannable row each, not one paragraph */}
        <div className="flex flex-col">
          {block.careers.map((c, i) => (
            <div
              key={c.id}
              className="flex gap-3 py-3"
              style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="mt-[3px] w-[6px] h-[6px] rounded-full shrink-0" style={{ background: ACCENT }} />
              <div className="min-w-0">
                <p className="text-[14.5px] font-semibold text-white/90 mb-0.5">{c.role}</p>
                <InlineMarkdown paragraphClassName="text-[13.5px] leading-[1.7] text-white/60">
                  {c.description}
                </InlineMarkdown>
              </div>
            </div>
          ))}
        </div>

        {/* Closing */}
        {block.closing && (
          <div className="pt-3 mt-1 border-t border-white/8">
            <InlineMarkdown paragraphClassName="text-[13.5px] italic text-white/45 leading-relaxed">
              {block.closing}
            </InlineMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
