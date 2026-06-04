// ============================================================================
// COMPARE DATA LOADER — assembles one normalized `CompareCollege` per institute
// for the side-by-side compare tool, across two different admission systems:
//
//   - JoSAA institutes (NIT / IIIT / GFTI): RANK-based. Reuses loadCollegeDeepDive.
//   - BITS campuses:                          SCORE-based. Reads bitsat_cutoffs.
//
// The two systems can't share a numeric admission axis (a rank is not a score),
// so `selectedBranch.unit` tells the UI which it is and we never force a false
// common scale. Everything else (NIRF, cost, location, character, heritage) IS
// directly comparable and renders uniformly.
//
// All durable, qualitative "fit" data comes from data/instituteProfiles.ts.
// ============================================================================

import { cache } from 'react';
import connectDB from '@canvas/data/db/mongodb';
import { CollegeCutoff } from '@canvas/data/models/CollegeCutoff';
import { BitsatCutoff } from '@canvas/data/models/BitsatCutoff';
import { BITSAT_CAMPUS_BY_ID, type BitsatCampusId } from '@canvas/data/bitsat/campuses';
import { BITSAT_PROGRAMME_BY_CODE } from '@canvas/data/bitsat/programmes';
import { loadCollegeDeepDive, type CategoryFilter, type GenderFilter, type BranchSummary } from './deepDive';
import { getInstituteProfile, isLegacyStrength, type InstituteProfile } from '../data/instituteProfiles';

export interface CompareTrendPoint {
  year: number;
  value: number; // closing_rank (JoSAA) or cutoff_score (BITS)
}

export type Momentum = 'tightening' | 'loosening' | 'stable';

export interface CompareBranchView {
  short_name: string;
  name: string;
  unit: 'rank' | 'score';
  latest: number | null;
  latestYear: number | null;
  trend: CompareTrendPoint[];
  yoyDeltaPct: number | null;
  momentum: Momentum | null;
  // NIT-only home-state advantage for this branch (null otherwise).
  homeState: { hs: number | null; os: number | null } | null;
}

export interface CompareHeritage {
  establishedYear: number | null;
  branchIsLegacyStrength: boolean;
  trackedSinceYear: number | null; // earliest year we hold cutoff data for this branch
}

export interface CompareCollege {
  system: 'josaa' | 'bits';
  id: string; // url id: College slug, or "bits-<campus>"
  name: string;
  short_name: string;
  type: string; // NIT | IIIT | GFTI | IIT | BITS
  state: string;
  city: string;
  region: string;
  established: number | null;
  website: string | null;
  nirf_engineering: number | null;
  nirf_overall: number | null;
  total_seats: number | null;
  annual_fees: number | null;
  hostel_fees: number | null;
  total_cost_4yr: number | null;
  description: string | null;
  selectedBranch: CompareBranchView | null;
  availableBranches: { short_name: string; name: string }[];
  profile: InstituteProfile | null;
  heritage: CompareHeritage;
}

const MOMENTUM_THRESHOLD_PCT = 2;

// BITS campuses aren't in the `colleges` collection (separate score-based
// system), so their researched factual data lives here. Sources: BITS official
// fee structure + careers360 BITSAT fee/seat-matrix articles + nirfindia.org
// 2024 (see _agents/college-data-research-2026-06.md). Tuition is per-year
// (BITS publishes per-semester ₹2,67,500 → ₹5.35L/yr, 2025-26), excl hostel/mess.
// NIRF ranks the BITS deemed university as ONE entity (Eng 20, Overall 23),
// attributed to Pilani; Goa/Hyderabad are not separately ranked.
const BITS_FACTS: Record<BitsatCampusId, {
  annual_fees: number; hostel_fees: number; total_seats: number;
  nirf_engineering: number | null; nirf_overall: number | null;
}> = {
  pilani:    { annual_fees: 535000, hostel_fees: 85400, total_seats: 1045, nirf_engineering: 20, nirf_overall: 23 },
  goa:       { annual_fees: 535000, hostel_fees: 85400, total_seats: 855,  nirf_engineering: null, nirf_overall: null },
  hyderabad: { annual_fees: 535000, hostel_fees: 85400, total_seats: 1080, nirf_engineering: null, nirf_overall: null },
};

// For ranks: a FALLING closing rank (negative %) means tougher to get in →
// tightening. For scores: a RISING cutoff score (positive %) means tougher →
// tightening. Same idea, opposite sign.
function deriveMomentum(yoyDeltaPct: number | null, unit: 'rank' | 'score'): Momentum | null {
  if (yoyDeltaPct == null) return null;
  const competitivenessUp = unit === 'rank' ? -yoyDeltaPct : yoyDeltaPct;
  if (competitivenessUp > MOMENTUM_THRESHOLD_PCT) return 'tightening';
  if (competitivenessUp < -MOMENTUM_THRESHOLD_PCT) return 'loosening';
  return 'stable';
}

// NITs store one cutoff row per (branch, quota) — typically HS and OS — so the
// deep-dive returns the same branch twice. Collapse to one entry per branch for
// the picker, preferring the most universally-meaningful quota for the headline
// rank (All-India / Other-State applies to the most students). Home-state edge
// is shown separately, so we don't lose the HS signal.
const QUOTA_PREF = ['AI', 'OS', 'HS', 'GO', 'JK', 'LA'];
function quotaRank(q: string): number {
  const i = QUOTA_PREF.indexOf(q);
  return i >= 0 ? i : 99;
}
function dedupeBranches(list: BranchSummary[]): BranchSummary[] {
  const byName = new Map<string, BranchSummary>();
  for (const b of list) {
    const ex = byName.get(b.branch_short_name);
    if (!ex || quotaRank(b.quota) < quotaRank(ex.quota)) byName.set(b.branch_short_name, b);
  }
  return [...byName.values()].sort(
    (a, b) => (a.latest_closing_rank ?? Infinity) - (b.latest_closing_rank ?? Infinity),
  );
}

// Stem-aware match so "Metallurgy" hits "Metallurgical and Materials Engineering",
// "Mining" hits "MIN", and "CSE" hits "CSE (AI & DS)".
function branchTokenMatch(a: string, b: string): boolean {
  const x = a.toLowerCase().trim();
  const y = b.toLowerCase().trim();
  if (!x || !y) return false;
  if (x.includes(y) || y.includes(x)) return true;
  let i = 0;
  while (i < x.length && i < y.length && x[i] === y[i]) i++;
  return i >= 5; // shared leading stem (metallurgy / metallurgical)
}

// Resolve a REQUESTED branch only — returns null when nothing matches, so the
// caller controls the default (we never silently fall back to an arbitrary
// branch, which previously let a low Paper-2 rank like B.Arch become flagship).
function pickJosaaBranch(all: BranchSummary[], requested?: string): BranchSummary | null {
  if (!requested || all.length === 0) return null;
  const want = requested.trim();
  return (
    all.find((b) => b.branch_short_name.toLowerCase() === want.toLowerCase())
    ?? all.find((b) => branchTokenMatch(b.branch_short_name, want) || branchTokenMatch(b.branch_name, want))
    ?? null
  );
}

async function loadJosaa(
  slug: string,
  branch: string | undefined,
  category: CategoryFilter,
  gender: GenderFilter,
): Promise<CompareCollege | null> {
  const dd = await loadCollegeDeepDive(slug, { category, gender }).catch(() => null);
  if (!dd) return null;

  const c = dd.college;
  // Keep Paper-1 (mainstream) and Paper-2 (architecture/planning) separate: their
  // ranks live on different scales, so they must never be co-sorted. Paper-1
  // leads the picker AND supplies the default flagship; architecture stays
  // selectable but never becomes the silent default.
  const paper1 = dedupeBranches(dd.branches);
  const arch = dedupeBranches(dd.architecture_branches);
  const allBranches = [...paper1, ...arch];
  const sel = pickJosaaBranch(allBranches, branch) ?? paper1[0] ?? arch[0] ?? null;

  const profile = getInstituteProfile(slug);

  let selectedBranch: CompareBranchView | null = null;
  let trackedSince: number | null = null;
  if (sel) {
    const trend: CompareTrendPoint[] = sel.trend
      .map((t) => ({ year: t.year, value: t.closing_rank }))
      .sort((a, b) => a.year - b.year);
    trackedSince = trend.length ? trend[0].year : null;

    // Home-state advantage (NITs only) for the selected branch's latest year.
    let homeState: { hs: number | null; os: number | null } | null = null;
    if (c.type === 'NIT' && sel.latest_year) {
      try {
        await connectDB();
        const rows = await CollegeCutoff.find({
          college_id: slug,
          branch_short_name: sel.branch_short_name,
          is_final_round: true,
          category,
          gender,
          year: sel.latest_year,
          quota: { $in: ['HS', 'OS'] },
        })
          .select('quota closing_rank')
          .limit(6)
          .lean<{ quota: string; closing_rank: number }[]>();
        const hs = rows.find((r) => r.quota === 'HS')?.closing_rank ?? null;
        const os = rows.find((r) => r.quota === 'OS')?.closing_rank ?? null;
        if (hs != null || os != null) homeState = { hs, os };
      } catch {
        homeState = null;
      }
    }

    selectedBranch = {
      short_name: sel.branch_short_name,
      name: sel.branch_name,
      unit: 'rank',
      latest: sel.latest_closing_rank,
      latestYear: sel.latest_year,
      trend,
      yoyDeltaPct: sel.yoy_delta_pct,
      momentum: deriveMomentum(sel.yoy_delta_pct, 'rank'),
      homeState,
    };
  }

  const annual = c.annual_fees ?? null;
  const hostel = c.hostel_fees ?? null;
  // Only a true total when BOTH are known — never mix tuition-only with
  // tuition+hostel across colleges (that would make the comparison dishonest).
  const total4yr = annual != null && hostel != null ? (annual + hostel) * 4 : null;

  return {
    system: 'josaa',
    id: slug,
    name: c.name,
    short_name: c.short_name,
    type: c.type,
    state: c.state,
    city: c.city,
    region: c.region,
    established: c.established ?? null,
    website: c.website ?? null,
    nirf_engineering: c.nirf_rank_engineering ?? null,
    nirf_overall: c.nirf_rank_overall ?? null,
    total_seats: c.total_seats ?? null,
    annual_fees: annual,
    hostel_fees: hostel,
    total_cost_4yr: total4yr,
    description: c.description ?? null,
    selectedBranch,
    availableBranches: allBranches.map((b) => ({ short_name: b.branch_short_name, name: b.branch_name })),
    profile,
    heritage: {
      establishedYear: c.established ?? null,
      branchIsLegacyStrength: sel ? isLegacyStrength(profile, sel.branch_short_name, sel.branch_name) : false,
      trackedSinceYear: trackedSince,
    },
  };
}

async function loadBits(
  campusId: BitsatCampusId,
  branch: string | undefined,
): Promise<CompareCollege | null> {
  const campus = BITSAT_CAMPUS_BY_ID[campusId];
  if (!campus) return null;

  await connectDB();
  // Modern regime only (max_score 390, 2022+) so trend years are comparable;
  // the pre-2022 450-scale scores live on a different axis.
  const rows = await BitsatCutoff.find({ campus: campus.name, max_score: 390 })
    .select('programme_code programme_name year cutoff_score')
    .lean<{ programme_code: string; programme_name: string; year: number; cutoff_score: number }[]>();

  // Group by programme.
  const byCode = new Map<string, { name: string; points: CompareTrendPoint[] }>();
  for (const r of rows) {
    if (!byCode.has(r.programme_code)) byCode.set(r.programme_code, { name: r.programme_name, points: [] });
    byCode.get(r.programme_code)!.points.push({ year: r.year, value: r.cutoff_score });
  }
  for (const v of byCode.values()) v.points.sort((a, b) => a.year - b.year);

  const id = `bits-${campusId}`;
  const profile = getInstituteProfile(id);
  const facts = BITS_FACTS[campusId];

  const availableBranches = [...byCode.entries()]
    .map(([code, v]) => ({
      short_name: BITSAT_PROGRAMME_BY_CODE[code as keyof typeof BITSAT_PROGRAMME_BY_CODE]?.short_name ?? code,
      name: v.name,
      code,
    }))
    .sort((a, b) => a.short_name.localeCompare(b.short_name));

  // Pick the requested branch (by short_name or code), else the flagship =
  // programme with the highest latest cutoff score (most competitive).
  let selCode: string | null = null;
  if (branch) {
    const want = branch.toLowerCase();
    selCode = availableBranches.find(
      (b) => b.short_name.toLowerCase() === want || b.code.toLowerCase() === want,
    )?.code ?? null;
  }
  if (!selCode) {
    let best: { code: string; latest: number } | null = null;
    for (const [code, v] of byCode.entries()) {
      const latest = v.points.length ? v.points[v.points.length - 1].value : -1;
      if (!best || latest > best.latest) best = { code, latest };
    }
    selCode = best?.code ?? null;
  }

  let selectedBranch: CompareBranchView | null = null;
  let trackedSince: number | null = null;
  if (selCode && byCode.has(selCode)) {
    const v = byCode.get(selCode)!;
    const trend = v.points;
    trackedSince = trend.length ? trend[0].year : null;
    const latestYear = trend.length ? trend[trend.length - 1].year : null;
    const latest = trend.length ? trend[trend.length - 1].value : null;
    const prev = trend.length >= 2 ? trend[trend.length - 2].value : null;
    const yoy = latest != null && prev ? Math.round(((latest - prev) / prev) * 100) : null;
    const short = BITSAT_PROGRAMME_BY_CODE[selCode as keyof typeof BITSAT_PROGRAMME_BY_CODE]?.short_name ?? selCode;
    selectedBranch = {
      short_name: short,
      name: v.name,
      unit: 'score',
      latest,
      latestYear,
      trend,
      yoyDeltaPct: yoy,
      momentum: deriveMomentum(yoy, 'score'),
      homeState: null,
    };
  }

  return {
    system: 'bits',
    id,
    name: `BITS Pilani — ${campus.name} Campus`,
    short_name: `BITS ${campus.name}`,
    type: 'BITS',
    state: campus.state,
    city: campus.city,
    region: campus.region,
    established: campus.established ?? null,
    website: campus.website ?? null,
    nirf_engineering: facts?.nirf_engineering ?? null,
    nirf_overall: facts?.nirf_overall ?? null,
    total_seats: facts?.total_seats ?? null,
    annual_fees: facts?.annual_fees ?? null,
    hostel_fees: facts?.hostel_fees ?? null,
    total_cost_4yr: facts ? (facts.annual_fees + facts.hostel_fees) * 4 : null,
    description: campus.description ?? null,
    selectedBranch,
    availableBranches: availableBranches.map(({ short_name, name }) => ({ short_name, name })),
    profile,
    heritage: {
      establishedYear: campus.established ?? null,
      branchIsLegacyStrength: selectedBranch
        ? isLegacyStrength(profile, selectedBranch.short_name, selectedBranch.name)
        : false,
      trackedSinceYear: trackedSince,
    },
  };
}

const BITS_IDS: BitsatCampusId[] = ['pilani', 'goa', 'hyderabad'];

/**
 * Load one institute (JoSAA slug or "bits-<campus>") into the normalized
 * compare shape. Returns null if the institute isn't found. Request-cached.
 */
export const loadCompareCollege = cache(async function loadCompareCollege(
  id: string,
  branch: string | undefined,
  category: CategoryFilter,
  gender: GenderFilter,
): Promise<CompareCollege | null> {
  if (id.startsWith('bits-')) {
    const campusId = id.slice('bits-'.length) as BitsatCampusId;
    if (!BITS_IDS.includes(campusId)) return null;
    return loadBits(campusId, branch);
  }
  return loadJosaa(id, branch, category, gender);
});
