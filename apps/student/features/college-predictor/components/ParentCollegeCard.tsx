'use client';

import Link from 'next/link';
import { parentVerdict, type Bucket } from '../lib/parentVocab';

// Parent-mode version of the JoSAA result card. Same data as CollegeCard but
// stripped of jargon (no projected ranks, no sparkline, no R1/R3 churn flag).
// Visual emphasis: college name, branch, plain-English verdict, location.

interface BranchResult {
  college_id: string;
  college_short_name: string;
  college_type: 'NIT' | 'IIIT' | 'GFTI' | 'IIT';
  college_state: string;
  college_region: string;
  nirf_rank_engineering?: number;
  branch_short_name: string;
  branch_name: string;
  bucket: Bucket;
  probability_pct: number;
  quota_matched: string;
}

interface CollegeGroup {
  college_id: string;
  college_short_name: string;
  college_type: 'NIT' | 'IIIT' | 'GFTI' | 'IIT';
  college_state: string;
  college_region: string;
  nirf_rank_engineering?: number;
  best_bucket: Bucket;
  best_probability_pct: number;
  branches: BranchResult[];
}

const TONE_BADGE: Record<'green' | 'amber' | 'blue' | 'grey', string> = {
  green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  amber: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  blue:  'bg-sky-500/15 text-sky-400 border-sky-500/30',
  grey:  'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
};

export default function ParentCollegeCard({ group, rank }: { group: CollegeGroup; rank: number }) {
  // For the parent card we only surface the SINGLE best branch per college —
  // parents don't want 6 sub-rows per college. Students who want the full
  // branch list can flip back to the student view.
  const top = group.branches[0];
  const verdict = parentVerdict(top.bucket, top.probability_pct);
  const isIIT = group.college_type === 'IIT';

  return (
    <div className="rounded-xl bg-[#151E32] border border-white/5 hover:border-white/10 transition-colors p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-zinc-500 tabular-nums w-5">
              #{rank}
            </span>
            {isIIT ? (
              <span className="text-base md:text-lg font-semibold text-white">{group.college_short_name}</span>
            ) : (
              <Link
                href={`/college-predictor/college/${group.college_id}`}
                prefetch={false}
                className="text-base md:text-lg font-semibold text-white hover:text-orange-300 transition-colors"
              >
                {group.college_short_name}
              </Link>
            )}
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">
              {group.college_type}
            </span>
          </div>

          <div className="text-base md:text-lg text-zinc-100 mb-1">
            {top.branch_name}
          </div>

          <div className="text-xs text-zinc-500 mb-2">
            {group.college_state}
            {group.nirf_rank_engineering && <> · NIRF #{group.nirf_rank_engineering}</>}
          </div>

          {/* Plain-English verdict */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded border ${TONE_BADGE[verdict.tone]}`}>
              {verdict.short}
            </span>
            <span className="text-xs text-zinc-400">
              {verdict.explainer}
            </span>
          </div>

          {group.branches.length > 1 && (
            <div className="mt-2 text-[11px] text-zinc-500">
              + {group.branches.length - 1} other {group.branches.length === 2 ? 'branch' : 'branches'} at this college
            </div>
          )}
        </div>

        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-orange-400 tabular-nums">{top.probability_pct}%</div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">chance</div>
        </div>
      </div>
    </div>
  );
}
