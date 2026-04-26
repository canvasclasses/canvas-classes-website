/**
 * Deep-dive data loader for a single college.
 *
 * Given a college slug, this reads the `colleges` and `college_cutoffs`
 * collections and returns a pre-shaped payload for the deep-dive page
 * (/college-predictor/college/[slug]).
 *
 * All heavy filtering happens here so the RSC can render quickly. The page
 * is ISR-cached (24h revalidate) so this is essentially a build-time query.
 *
 * Anti-hallucination note: everything in the returned shape comes from the DB
 * — no year/rank fabrication. If the DB has no 2025 data for a branch, the
 * page will silently omit that branch from the "2025 closing rank" column.
 */
import connectDB from '@/lib/mongodb';
import { College, type ICollege } from '@/lib/models/College';
import { CollegeCutoff, type ICollegeCutoff } from '@/lib/models/CollegeCutoff';

/**
 * B.Arch and B.Plan admissions run on JEE Main **Paper 2** ranks, which is a
 * completely separate rank list from Paper 1 (all the B.E./B.Tech branches).
 * A B.Arch closing rank of 289 is *not* comparable to a CSE closing rank of
 * 4,500 — the 289 is within the ~40k-candidate Paper 2 pool, the 4,500 is
 * within the ~14-lakh Paper 1 pool.
 *
 * We split them here so:
 *   - the flagship / "top branch" stat always picks a Paper 1 branch
 *   - the trend chart only plots like-with-like
 *   - Architecture + Planning render in their own section with a clear note
 */
const PAPER_2_BRANCH_SHORT_NAMES = new Set(['B.Arch', 'B.Plan']);
function isPaper2Branch(shortName: string): boolean {
  return PAPER_2_BRANCH_SHORT_NAMES.has(shortName);
}

export type CategoryFilter =
  | 'OPEN' | 'OBC-NCL' | 'SC' | 'ST' | 'EWS';

export type GenderFilter = 'Gender-Neutral' | 'Female-only (including Supernumerary)';

export interface YearTrend {
  year: number;
  closing_rank: number;
  opening_rank: number;
}

export interface BranchSummary {
  branch_short_name: string;
  branch_name: string;
  quota: string;                    // primary quota shown (AI, OS, or HS — whichever the college uses)
  // Per-year closing rank across all years seen (sorted ascending).
  trend: YearTrend[];
  // Convenience numbers for the table.
  latest_year: number | null;
  latest_closing_rank: number | null;
  latest_opening_rank: number | null;
  prev_year_closing_rank: number | null;
  yoy_delta_pct: number | null;     // (latest - prev) / prev × 100
}

export interface RoundProgression {
  branch_short_name: string;
  quota: string;
  year: number;
  rounds: { round: number; opening_rank: number; closing_rank: number }[];
}

export interface QuotaCompare {
  // NIT-only: closing rank for the flagship branch in the most recent year,
  // shown separately for HS vs OS so the home-state advantage is visible.
  branch_short_name: string;
  year: number;
  hs: { opening_rank: number; closing_rank: number } | null;
  os: { opening_rank: number; closing_rank: number } | null;
}

export interface CollegeDeepDive {
  college: Pick<
    ICollege,
    | '_id' | 'name' | 'short_name' | 'type' | 'state' | 'city' | 'region'
    | 'established' | 'website' | 'nirf_rank_engineering' | 'nirf_rank_overall'
    | 'total_seats' | 'annual_fees' | 'hostel_fees' | 'description' | 'institute_code'
  >;
  years_covered: number[];           // e.g. [2022, 2023, 2024, 2025]
  latest_year: number | null;
  // Paper-1 (B.E./B.Tech) branches, sorted by latest_closing_rank ascending
  // (most competitive first). This is the primary trend-chart dataset.
  branches: BranchSummary[];
  // Paper-2 branches (Architecture, Planning). Rendered separately because
  // their ranks come from a different JEE Main list and cannot be compared
  // against Paper-1 ranks on the same axis. Null when the college has none.
  architecture_branches: BranchSummary[];
  // Flagship branch's round-by-round progression for the latest year.
  // Helps students see that "R1 rank ≠ final rank".
  round_progression: RoundProgression | null;
  quota_compare: QuotaCompare | null;
  // Category/gender that was used to build this payload. Default is OPEN /
  // Gender-Neutral; the page will offer a dropdown that hits another route
  // with different filters once we wire personalisation.
  filter: { category: CategoryFilter; gender: GenderFilter };
}

export async function loadCollegeDeepDive(
  slug: string,
  opts: { category?: CategoryFilter; gender?: GenderFilter } = {},
): Promise<CollegeDeepDive | null> {
  const category: CategoryFilter = opts.category ?? 'OPEN';
  const gender: GenderFilter = opts.gender ?? 'Gender-Neutral';

  await connectDB();

  const college = await College.findOne({ _id: slug, is_active: true })
    .select('_id name short_name type state city region established website nirf_rank_engineering nirf_rank_overall total_seats annual_fees hostel_fees description institute_code')
    .lean<Pick<
      ICollege,
      | '_id' | 'name' | 'short_name' | 'type' | 'state' | 'city' | 'region'
      | 'established' | 'website' | 'nirf_rank_engineering' | 'nirf_rank_overall'
      | 'total_seats' | 'annual_fees' | 'hostel_fees' | 'description' | 'institute_code'
    > | null>();

  if (!college) return null;

  // Pick the default quota for this college type. NITs have both HS and OS
  // under the same category/gender filter; we default to OS for the headline
  // numbers because out-of-state is what most students will compare against.
  // IIITs/GFTIs use AI only.
  const isNIT = college.type === 'NIT';
  const defaultQuota = isNIT ? 'OS' : 'AI';

  // Pull every (final round) cutoff for this college, across all years,
  // matching the selected category/gender. We'll split by quota client-side.
  const finals = await CollegeCutoff.find({
    college_id: slug,
    is_final_round: true,
    category,
    gender,
  })
    .select('branch_short_name branch_name year quota opening_rank closing_rank')
    .lean<Pick<
      ICollegeCutoff,
      'branch_short_name' | 'branch_name' | 'year' | 'quota' | 'opening_rank' | 'closing_rank'
    >[]>();

  if (finals.length === 0) {
    // College exists but we have no cutoffs matching this category/gender.
    // Return an empty shell so the page can show a "no data yet" message.
    return {
      college,
      years_covered: [],
      latest_year: null,
      branches: [],
      architecture_branches: [],
      round_progression: null,
      quota_compare: null,
      filter: { category, gender },
    };
  }

  // ── years_covered + latest_year ──────────────────────────────────────────
  const years = Array.from(new Set(finals.map((c) => c.year))).sort((a, b) => a - b);
  const latestYear = years[years.length - 1];

  // ── group by (branch_short_name, quota) → trend points ──────────────────
  // Primary quota per branch: the one we index into branches[]. Extra quotas
  // are still computed so quota_compare has data to pull from.
  type Key = string; // `${branch}::${quota}`
  const byKey = new Map<Key, { branch_short_name: string; branch_name: string; quota: string; points: YearTrend[] }>();
  for (const row of finals) {
    const key = `${row.branch_short_name}::${row.quota}`;
    const entry = byKey.get(key) ?? {
      branch_short_name: row.branch_short_name,
      branch_name: row.branch_name,
      quota: row.quota,
      points: [] as YearTrend[],
    };
    entry.points.push({
      year: row.year,
      opening_rank: row.opening_rank,
      closing_rank: row.closing_rank,
    });
    byKey.set(key, entry);
  }

  // Build per-branch summaries using the college's default quota. A branch
  // without that quota in any year (rare — some IIIT branches only appear
  // under AI etc.) falls back to whatever quota it does have.
  const byBranch = new Map<string, BranchSummary>();
  for (const [key, entry] of byKey) {
    const branch = entry.branch_short_name;
    const existing = byBranch.get(branch);

    // Sort points chronologically so trend[] is stable left→right on charts.
    entry.points.sort((a, b) => a.year - b.year);
    const latestPoint = entry.points[entry.points.length - 1];
    const prevPoint = entry.points[entry.points.length - 2];
    const summary: BranchSummary = {
      branch_short_name: branch,
      branch_name: entry.branch_name,
      quota: entry.quota,
      trend: entry.points,
      latest_year: latestPoint?.year ?? null,
      latest_closing_rank: latestPoint?.closing_rank ?? null,
      latest_opening_rank: latestPoint?.opening_rank ?? null,
      prev_year_closing_rank: prevPoint?.closing_rank ?? null,
      yoy_delta_pct:
        latestPoint && prevPoint && prevPoint.closing_rank
          ? Math.round(((latestPoint.closing_rank - prevPoint.closing_rank) / prevPoint.closing_rank) * 100)
          : null,
    };

    if (!existing) {
      byBranch.set(branch, summary);
      continue;
    }
    // Prefer the default quota when a branch has multiple.
    if (existing.quota !== defaultQuota && entry.quota === defaultQuota) {
      byBranch.set(branch, summary);
    }
    // Silence unused-var lint on `key`.
    void key;
  }

  // Split Paper-1 (B.E./B.Tech) from Paper-2 (Architecture, Planning). They
  // share no rank basis, so they must never be mixed on the same chart or
  // compared in the same "most competitive" ordering.
  const allBranches = [...byBranch.values()];
  const sortByRankAsc = (a: BranchSummary, b: BranchSummary) => {
    if (a.latest_closing_rank == null) return 1;
    if (b.latest_closing_rank == null) return -1;
    return a.latest_closing_rank - b.latest_closing_rank;
  };
  const branches = allBranches
    .filter((b) => !isPaper2Branch(b.branch_short_name))
    .sort(sortByRankAsc);
  const architectureBranches = allBranches
    .filter((b) => isPaper2Branch(b.branch_short_name))
    .sort(sortByRankAsc);

  // ── round_progression — flagship branch, latest year, all rounds ─────────
  // "Flagship" = the most competitive branch (top of `branches` list).
  let roundProgression: RoundProgression | null = null;
  if (branches.length > 0 && latestYear != null) {
    const flagship = branches[0];
    const allRounds = await CollegeCutoff.find({
      college_id: slug,
      branch_short_name: flagship.branch_short_name,
      year: latestYear,
      category,
      gender,
      quota: flagship.quota,
    })
      .select('round opening_rank closing_rank')
      .sort({ round: 1 })
      .lean<Pick<ICollegeCutoff, 'round' | 'opening_rank' | 'closing_rank'>[]>();

    if (allRounds.length > 0) {
      roundProgression = {
        branch_short_name: flagship.branch_short_name,
        quota: flagship.quota,
        year: latestYear,
        rounds: allRounds.map((r) => ({
          round: r.round,
          opening_rank: r.opening_rank,
          closing_rank: r.closing_rank,
        })),
      };
    }
  }

  // ── quota_compare — NIT-only, flagship branch, latest year ───────────────
  let quotaCompare: QuotaCompare | null = null;
  if (isNIT && branches.length > 0 && latestYear != null) {
    const flagship = branches[0];
    const hs = byKey.get(`${flagship.branch_short_name}::HS`)?.points.find((p) => p.year === latestYear);
    const os = byKey.get(`${flagship.branch_short_name}::OS`)?.points.find((p) => p.year === latestYear);
    if (hs || os) {
      quotaCompare = {
        branch_short_name: flagship.branch_short_name,
        year: latestYear,
        hs: hs ? { opening_rank: hs.opening_rank, closing_rank: hs.closing_rank } : null,
        os: os ? { opening_rank: os.opening_rank, closing_rank: os.closing_rank } : null,
      };
    }
  }

  return {
    college,
    years_covered: years,
    latest_year: latestYear ?? null,
    branches,
    architecture_branches: architectureBranches,
    round_progression: roundProgression,
    quota_compare: quotaCompare,
    filter: { category, gender },
  };
}

/**
 * List all college slugs — used by generateStaticParams for ISR.
 */
export async function loadAllCollegeSlugs(): Promise<string[]> {
  await connectDB();
  const rows = await College.find({ is_active: true })
    .select('_id')
    .lean<{ _id: string }[]>();
  return rows.map((r) => r._id);
}
