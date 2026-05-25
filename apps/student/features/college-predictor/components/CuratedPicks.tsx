'use client';

import Link from 'next/link';
import { useMemo } from 'react';

// "Curated picks for your rank" — replaces the static 8-tile browse grid
// when the user already has predictor results. Picks four facets from the
// student's own result set:
//   - Headline pick   : highest NIRF that's still Safe
//   - Home-state pick : best Safe result in their home state (if any)
//   - Hidden gem      : Safe / Target with a NIRF rank > 30 but rising
//                       trend (we approximate "rising" as projected_close
//                       being notably tighter than mean historical)
//   - Safety bet      : highest-NIRF Safe result with the largest sigma-of-
//                       safety (i.e. nicely above the cutoff every year)
//
// This is NOT analytics-driven — we don't yet have anon aggregates of
// "what other students near your rank explored." When we ship that, this
// component becomes the surface for it without changing its caller.

interface BranchResult {
  college_id: string;
  college_short_name: string;
  college_type: 'NIT' | 'IIIT' | 'GFTI' | 'IIT';
  college_state: string;
  college_region: string;
  nirf_rank_engineering?: number;
  branch_short_name: string;
  branch_name: string;
  bucket: 'safe' | 'target' | 'reach' | 'unlikely';
  probability_pct: number;
  projected_closing_rank: number;
  historical: { year: number; closing_rank: number }[];
  quota_matched: string;
}

interface CollegeGroup {
  college_id: string;
  college_short_name: string;
  college_type: 'NIT' | 'IIIT' | 'GFTI' | 'IIT';
  college_state: string;
  college_region: string;
  nirf_rank_engineering?: number;
  best_bucket: 'safe' | 'target' | 'reach' | 'unlikely';
  best_probability_pct: number;
  branches: BranchResult[];
}

interface Pick {
  label: string;
  reason: string;
  group: CollegeGroup;
  branch: BranchResult;
  emoji: string;
}

function flatten(groups: CollegeGroup[]): { g: CollegeGroup; b: BranchResult }[] {
  const out: { g: CollegeGroup; b: BranchResult }[] = [];
  for (const g of groups) for (const b of g.branches) out.push({ g, b });
  return out;
}

function safeNirf(g: CollegeGroup) {
  return g.nirf_rank_engineering ?? 9999;
}

/**
 * Estimate "rising trend" — how much tighter (lower) the projected close is
 * vs the historical mean. Larger positive number = the cutoff has been
 * getting tighter. Useful for the "hidden gem" pick.
 */
function trendTightness(b: BranchResult): number {
  if (!b.historical || b.historical.length < 2) return 0;
  const mean = b.historical.reduce((a, x) => a + x.closing_rank, 0) / b.historical.length;
  // Lower projected rank = tighter. Express as fractional improvement.
  return (mean - b.projected_closing_rank) / mean;
}

function pickFour(groups: CollegeGroup[], homeState: string): Pick[] {
  const all = flatten(groups);
  const safe = all.filter(({ b }) => b.bucket === 'safe');
  const safeOrTarget = all.filter(({ b }) => b.bucket === 'safe' || b.bucket === 'target');

  const picks: Pick[] = [];
  const usedKeys = new Set<string>();
  const key = (g: CollegeGroup, b: BranchResult) => `${g.college_id}::${b.branch_short_name}`;

  // 1. Headline — best NIRF in Safe
  const headline = [...safe].sort((a, b) => safeNirf(a.g) - safeNirf(b.g))[0];
  if (headline) {
    picks.push({
      label: 'Headline pick',
      reason: 'Highest-ranked college that\'s a Safe call for your rank.',
      group: headline.g,
      branch: headline.b,
      emoji: '🏆',
    });
    usedKeys.add(key(headline.g, headline.b));
  }

  // 2. Home-state pick — best Safe result in home_state
  const hsCandidates = safe.filter(({ g, b }) => !usedKeys.has(key(g, b)) && g.college_state.toLowerCase() === homeState.toLowerCase());
  const hs = hsCandidates.sort((a, b) => safeNirf(a.g) - safeNirf(b.g))[0];
  if (hs) {
    picks.push({
      label: 'Home-state pick',
      reason: `Best Safe option close to home — ${hs.g.college_state}.`,
      group: hs.g,
      branch: hs.b,
      emoji: '🏠',
    });
    usedKeys.add(key(hs.g, hs.b));
  }

  // 3. Hidden gem — Safe/Target with rising trend (cutoff getting tighter)
  const gemPool = safeOrTarget
    .filter(({ g, b }) => !usedKeys.has(key(g, b)) && trendTightness(b) > 0.08)
    .sort((a, b) => trendTightness(b.b) - trendTightness(a.b));
  const gem = gemPool[0];
  if (gem) {
    picks.push({
      label: 'Hidden gem',
      reason: `Cutoff has tightened ${Math.round(trendTightness(gem.b) * 100)}% in recent years — momentum pick.`,
      group: gem.g,
      branch: gem.b,
      emoji: '💎',
    });
    usedKeys.add(key(gem.g, gem.b));
  }

  // 4. Safety bet — highest NIRF Safe with the most cushion (large gap between
  //    user's rank and projected close — but we don't have user rank here,
  //    so use highest probability instead).
  const safetyPool = safe
    .filter(({ g, b }) => !usedKeys.has(key(g, b)))
    .sort((a, b) => {
      if (b.b.probability_pct !== a.b.probability_pct) return b.b.probability_pct - a.b.probability_pct;
      return safeNirf(a.g) - safeNirf(b.g);
    });
  const safety = safetyPool[0];
  if (safety) {
    picks.push({
      label: 'Safety bet',
      reason: 'A near-certain admission as your backup.',
      group: safety.g,
      branch: safety.b,
      emoji: '🛟',
    });
  }

  return picks;
}

interface Props {
  groups: CollegeGroup[];
  homeState: string;
}

export default function CuratedPicks({ groups, homeState }: Props) {
  const picks = useMemo(() => pickFour(groups, homeState), [groups, homeState]);
  if (picks.length === 0) return null;

  return (
    <section aria-label="Curated picks for your rank" className="mt-12">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Curated picks for your rank</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Four facets drawn from your result set — best of NIRF, home, momentum, safety.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {picks.map((p) => (
          <Link
            key={p.label}
            href={p.group.college_type === 'IIT' ? '#' : `/college-predictor/college/${p.group.college_id}`}
            prefetch={false}
            className="group p-4 rounded-xl bg-[#0B0F15] border border-white/5 hover:border-orange-500/30 hover:bg-orange-500/[0.03] transition-colors flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="text-2xl leading-none" aria-hidden>{p.emoji}</div>
              <span className="text-[10px] uppercase tracking-wider text-orange-300/80 font-semibold">
                {p.label}
              </span>
            </div>
            <div className="text-sm font-semibold text-white group-hover:text-orange-300 transition-colors leading-tight">
              {p.group.college_short_name}
            </div>
            <div className="text-[11px] text-zinc-400 truncate">{p.branch.branch_name}</div>
            <div className="text-[10px] text-zinc-500 leading-snug mt-1">
              {p.reason}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
