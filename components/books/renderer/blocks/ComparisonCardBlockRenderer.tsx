import React from 'react';
import { ComparisonCardBlock } from '@/types/books';

const COLUMN_COLORS: Record<string, { border: string; heading: string; dot: string }> = {
  blue:  { border: 'border-blue-500/30',    heading: 'text-blue-400',    dot: 'bg-blue-500'    },
  green: { border: 'border-emerald-500/30', heading: 'text-emerald-400', dot: 'bg-emerald-500' },
  red:   { border: 'border-red-500/30',     heading: 'text-red-400',     dot: 'bg-red-500'     },
  orange:{ border: 'border-orange-500/30',  heading: 'text-orange-400',  dot: 'bg-orange-500'  },
  purple:{ border: 'border-purple-500/30',  heading: 'text-purple-400',  dot: 'bg-purple-500'  },
};

const DEFAULT_COLORS = ['blue', 'green', 'red'];

export default function ComparisonCardBlockRenderer({ block }: { block: ComparisonCardBlock }) {
  const cols = block.columns.length;
  return (
    <div className="my-4">
      {block.title && (
        <p className="text-xs font-bold text-white/40 mb-2.5 uppercase tracking-widest">
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
                  <span className="text-[10px] font-bold tracking-widest text-white/20">VS</span>
                  <div className="flex-1 h-px bg-white/6" />
                </div>
              )}
              <div className={`p-3 bg-[#0B0F15] border rounded-xl ${colors.border}`}>
                <p className={`text-[14px] font-bold mb-2 ${colors.heading}`}>{col.heading}</p>
                <ul className="flex flex-col gap-1.5">
                  {col.points.map((point, pi) => (
                    <li key={pi} className="flex items-start gap-2 text-[14px] text-white/75 leading-snug">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                      {point}
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
            <div key={idx} className={`p-4 bg-[#0B0F15] border rounded-xl ${colors.border}`}>
              <p className={`text-[15px] font-bold mb-3 ${colors.heading}`}>{col.heading}</p>
              <ul className="flex flex-col gap-2">
                {col.points.map((point, pi) => (
                  <li key={pi} className="flex items-start gap-2 text-[15px] text-white/75">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                    {point}
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
