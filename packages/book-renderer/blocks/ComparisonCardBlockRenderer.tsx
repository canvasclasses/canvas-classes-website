import React from 'react';
import { ComparisonCardBlock } from '@canvas/data/types/books';
import InlineMarkdown from './InlineMarkdown';

// Frosted-glass panel treatment (founder decision 2026-07-26, standardized
// across every comparison_card on the platform): a translucent blurred
// surface with a thin top highlight, no full-perimeter colored border — the
// old bordered-box look read as "boring/generic". Colour now lives only in
// the heading text and bullet dots, both at a light tier (never the mid
// -400/-500 saturation) so nothing reads as a bright/neon accent.
const COLUMN_COLORS: Record<string, { heading: string; dot: string }> = {
  blue:   { heading: 'text-blue-300',    dot: 'bg-blue-400'    },
  green:  { heading: 'text-emerald-300', dot: 'bg-emerald-400' },
  red:    { heading: 'text-red-300',     dot: 'bg-red-400'     },
  orange: { heading: 'text-orange-300',  dot: 'bg-orange-400'  },
  purple: { heading: 'text-purple-300',  dot: 'bg-purple-400'  },
};

const CARD_SURFACE = 'bg-white/[0.035] backdrop-blur-md border-t border-white/10';

const DEFAULT_COLORS = ['blue', 'green', 'red'];

export default function ComparisonCardBlockRenderer({ block }: { block: ComparisonCardBlock }) {
  const cols = block.columns.length;
  return (
    <div className="my-4">
      {block.title && (
        <p className="text-xs font-bold text-white/45 mb-2.5 uppercase tracking-widest">
          {block.title}
        </p>
      )}

      {/* Mobile: stacked full-width cards with VS divider */}
      <div className="sm:hidden flex flex-col gap-0">
        {block.columns.map((col, idx) => {
          const colorKey = col.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
          const colors = COLUMN_COLORS[colorKey] ?? COLUMN_COLORS.blue;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && cols === 2 && (
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-white/6" />
                  <span className="text-[10px] font-bold tracking-widest text-white/45">VS</span>
                  <div className="flex-1 h-px bg-white/6" />
                </div>
              )}
              <div className={`p-3 rounded-xl ${CARD_SURFACE}`}>
                <p className={`text-[14px] font-bold mb-2 ${colors.heading}`}><InlineMarkdown>{col.heading}</InlineMarkdown></p>
                <ul className="flex flex-col gap-1.5">
                  {col.points.map((point, pi) => (
                    <li key={pi} className="flex items-start gap-2 text-[14px] text-white/82 leading-snug">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                      <span><InlineMarkdown>{point}</InlineMarkdown></span>
                    </li>
                  ))}
                </ul>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* sm+: side-by-side grid */}
      <div className={`hidden sm:grid gap-3 ${cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
        {block.columns.map((col, idx) => {
          const colorKey = col.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
          const colors = COLUMN_COLORS[colorKey] ?? COLUMN_COLORS.blue;
          return (
            <div key={idx} className={`p-4 rounded-xl ${CARD_SURFACE}`}>
              <p className={`text-[15px] font-bold mb-3 ${colors.heading}`}><InlineMarkdown>{col.heading}</InlineMarkdown></p>
              <ul className="flex flex-col gap-2">
                {col.points.map((point, pi) => (
                  <li key={pi} className="flex items-start gap-2 text-[15px] text-white/82">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                    <span><InlineMarkdown>{point}</InlineMarkdown></span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
