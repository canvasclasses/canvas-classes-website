'use client';

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
  return (
    <div className="my-4">
      {block.title && (
        <p className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wide">
          {block.title}
        </p>
      )}
      <div className={`grid gap-3 ${block.columns.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {block.columns.map((col, idx) => {
          const colorKey = col.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
          const colors = COLUMN_COLORS[colorKey] ?? COLUMN_COLORS.blue;

          return (
            <div
              key={idx}
              className={`p-4 bg-[#0B0F15] border rounded-xl ${colors.border}`}
            >
              <p className={`text-sm font-bold mb-3 ${colors.heading}`}>
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2">
                {col.points.map((point, pi) => (
                  <li key={pi} className="flex items-start gap-2 text-sm text-white/75">
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
