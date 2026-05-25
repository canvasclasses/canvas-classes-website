'use client';

import { parentVerdict, type Bucket } from '../lib/parentVocab';

// Parent-mode card for a single BITSAT (campus × programme) result.

interface ProgrammeResult {
  campus_id: 'pilani' | 'goa' | 'hyderabad';
  campus_name: 'Pilani' | 'Goa' | 'Hyderabad';
  campus_state: string;
  campus_region: string;
  nirf_rank_engineering?: number;
  programme_code: string;
  programme_short_name: string;
  programme_name: string;
  degree_type: 'BE' | 'MSC' | 'BPHARM';
  bucket: Bucket;
  probability_pct: number;
  projected_cutoff_score: number;
  max_score: number;
}

const TONE_BADGE: Record<'green' | 'amber' | 'blue' | 'grey', string> = {
  green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  amber: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  blue:  'bg-sky-500/15 text-sky-400 border-sky-500/30',
  grey:  'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
};

export default function ParentProgrammeRow({ item, rank }: { item: ProgrammeResult; rank: number }) {
  const verdict = parentVerdict(item.bucket, item.probability_pct);

  return (
    <div className="rounded-xl bg-[#151E32] border border-white/5 hover:border-white/10 transition-colors p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-zinc-500 tabular-nums w-5">
              #{rank}
            </span>
            <span className="text-base md:text-lg font-semibold text-white">
              BITS {item.campus_name}
            </span>
            {item.nirf_rank_engineering && (
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">
                NIRF #{item.nirf_rank_engineering}
              </span>
            )}
          </div>

          <div className="text-base md:text-lg text-zinc-100 mb-1">{item.programme_name}</div>

          <div className="text-xs text-zinc-500 mb-2">{item.campus_state}</div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded border ${TONE_BADGE[verdict.tone]}`}>
              {verdict.short}
            </span>
            <span className="text-xs text-zinc-400">{verdict.explainer}</span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-orange-400 tabular-nums">{item.probability_pct}%</div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">chance</div>
        </div>
      </div>
    </div>
  );
}
