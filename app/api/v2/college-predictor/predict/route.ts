// PUBLIC: no auth required — the college predictor is a free, public tool.
// The endpoint is rate-limited per IP to prevent abuse. Write-side routes
// (saving choice lists) will live separately and require auth.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { predictColleges, type PredictorResult, type Bucket } from '@/lib/collegePredictor/predictor';
import { percentileToRank } from '@/lib/collegePredictor/percentileToRank';

const PredictRequestSchema = z.object({
  rank: z.number().int().positive().max(2_000_000).optional(),
  percentile: z.number().min(0).max(100).optional(),
  category: z.enum([
    'OPEN', 'OBC-NCL', 'SC', 'ST', 'EWS',
    'OPEN (PwD)', 'OBC-NCL (PwD)', 'SC (PwD)', 'ST (PwD)', 'EWS (PwD)',
  ]),
  gender: z.enum(['Gender-Neutral', 'Female-only (including Supernumerary)']),
  home_state: z.string().min(2).max(50),
  year: z.number().int().min(2016).max(2030).optional(),
  include_unlikely: z.boolean().optional(),
  extended: z.boolean().optional(), // false (default) → top 10 colleges; true → full list

  // ── Optional refinement filters ────────────────────────────────────────────
  regions: z.array(z.enum(['North', 'South', 'East', 'West', 'Central', 'Northeast'])).optional(),
  college_types: z.array(z.enum(['NIT', 'IIIT', 'GFTI'])).optional(),
  dream_branch: z.string().max(80).optional(),   // e.g. "CSE", "ECE", "ME"
  dream_college: z.string().max(80).optional(),  // slug OR short_name (partial match OK)
}).refine((d) => d.rank !== undefined || d.percentile !== undefined, {
  message: 'Provide either rank or percentile',
});

// ── Basic in-memory rate limit ─────────────────────────────────────────────────
// TODO(production): replace with Upstash Redis when traffic scales. In-memory
// maps don't survive serverless cold-starts and don't coordinate across regions.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_MAX_ENTRIES = 5000;
type RateEntry = { count: number; reset_at: number };
const rateStore = new Map<string, RateEntry>();

function rateLimit(ip: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  if (rateStore.size > RATE_LIMIT_MAX_ENTRIES) {
    for (const [k, v] of rateStore) {
      if (v.reset_at < now) rateStore.delete(k);
      if (rateStore.size <= RATE_LIMIT_MAX_ENTRIES) break;
    }
  }
  const entry = rateStore.get(ip);
  if (!entry || entry.reset_at < now) {
    rateStore.set(ip, { count: 1, reset_at: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { ok: false, remaining: 0 };
  }
  entry.count++;
  return { ok: true, remaining: RATE_LIMIT_MAX - entry.count };
}

// ── Dream-branch canonicalisation ─────────────────────────────────────────────
// Users write "CSE", "Computer Science", "Mechanical Engineering" — map any of
// those inputs to the set of canonical aliases for one branch. Keys here cover
// both the short code and the long form the datalist surfaces.
const BRANCH_ALIASES: Record<string, string[]> = {
  cse: ['CSE', 'Computer Science and Engineering'],
  'computer science and engineering': ['CSE', 'Computer Science and Engineering'],
  'computer science': ['CSE', 'Computer Science and Engineering'],

  ece: ['ECE', 'Electronics and Communication Engineering'],
  'electronics and communication engineering': ['ECE', 'Electronics and Communication Engineering'],

  ee: ['EE', 'Electrical Engineering'],
  'electrical engineering': ['EE', 'Electrical Engineering'],

  eee: ['EEE', 'Electrical and Electronics Engineering'],
  'electrical and electronics engineering': ['EEE', 'Electrical and Electronics Engineering'],

  me: ['ME', 'Mechanical Engineering'],
  mechanical: ['ME', 'Mechanical Engineering'],
  'mechanical engineering': ['ME', 'Mechanical Engineering'],

  ce: ['CE', 'Civil Engineering'],
  civil: ['CE', 'Civil Engineering'],
  'civil engineering': ['CE', 'Civil Engineering'],

  che: ['CHE', 'Chemical Engineering'],
  chemical: ['CHE', 'Chemical Engineering'],
  'chemical engineering': ['CHE', 'Chemical Engineering'],

  mme: ['MME', 'Metallurgical and Materials Engineering'],
  metallurgy: ['MME', 'Metallurgical and Materials Engineering'],
  'metallurgical and materials engineering': ['MME', 'Metallurgical and Materials Engineering'],

  ae: ['AE', 'Aerospace Engineering'],
  aerospace: ['AE', 'Aerospace Engineering'],
  'aerospace engineering': ['AE', 'Aerospace Engineering'],

  // Biotechnology shows up under TWO short-names in the DB:
  //   "BT" → "Biotechnology"  (141 rows, mostly at MNITs)
  //   "Bio Technology" → "Bio Technology" (1473 rows, wider coverage)
  // Include both so a student typing "biotech" doesn't miss 10× the seats.
  bt: ['BT', 'Biotechnology', 'Bio Technology'],
  biotech: ['BT', 'Biotechnology', 'Bio Technology'],
  biotechnology: ['BT', 'Biotechnology', 'Bio Technology'],

  it: ['IT', 'Information Technology'],
  'information technology': ['IT', 'Information Technology'],

  ai: ['AI', 'Artificial Intelligence'],
  'artificial intelligence': ['AI', 'Artificial Intelligence'],

  'ai ml': ['AI & ML', 'Artificial Intelligence and Machine Learning'],
  'ai & ml': ['AI & ML', 'Artificial Intelligence and Machine Learning'],
  'ai and ml': ['AI & ML', 'Artificial Intelligence and Machine Learning'],
  'artificial intelligence and machine learning': ['AI & ML', 'Artificial Intelligence and Machine Learning'],

  'ai ds': ['AI & DS', 'Artificial Intelligence and Data Science'],
  'ai & ds': ['AI & DS', 'Artificial Intelligence and Data Science'],
  'ai and ds': ['AI & DS', 'Artificial Intelligence and Data Science'],
  'artificial intelligence and data science': ['AI & DS', 'Artificial Intelligence and Data Science'],

  ds: ['DSE', 'Data Science and Engineering', 'Data Science'],
  'data science': ['DSE', 'Data Science', 'Data Science and Engineering'],
  'data science and engineering': ['DSE', 'Data Science and Engineering'],

  mnc: ['M&C', 'Mathematics and Computing'],
  'm&c': ['M&C', 'Mathematics and Computing'],
  'mathematics and computing': ['M&C', 'Mathematics and Computing'],

  ep: ['EP', 'Engineering Physics'],
  'engineering physics': ['EP', 'Engineering Physics'],

  // ── Added after DB audit — top missing coverage ─────────────────────────────
  arch: ['B.Arch', 'Architecture'],
  'b.arch': ['B.Arch', 'Architecture'],
  'b arch': ['B.Arch', 'Architecture'],
  architecture: ['B.Arch', 'Architecture'],

  'b.plan': ['B.Plan', 'Planning'],
  'b plan': ['B.Plan', 'Planning'],
  planning: ['B.Plan', 'Planning'],

  min: ['MIN', 'Mining Engineering'],
  mining: ['MIN', 'Mining Engineering'],
  'mining engineering': ['MIN', 'Mining Engineering'],

  pie: ['PIE', 'Production and Industrial Engineering'],
  production: ['PIE', 'Production Engineering', 'Production and Industrial Engineering'],
  'production engineering': ['Production Engineering', 'Production and Industrial Engineering'],
  'production and industrial engineering': ['PIE', 'Production and Industrial Engineering'],

  eie: ['EIE', 'Electronics and Instrumentation Engineering'],
  instrumentation: [
    'EIE',
    'Electronics and Instrumentation Engineering',
    'Instrumentation and Control Engineering',
    'Instrumentation Engineering',
  ],
  'instrumentation and control': ['Instrumentation and Control Engineering'],

  aeronautical: ['Aeronautical Engineering'],
  'aeronautical engineering': ['Aeronautical Engineering'],
  aero: ['AE', 'Aerospace Engineering', 'Aeronautical Engineering'],

  mechatronics: ['Mechatronics', 'Mechatronics Engineering', 'Mechatronics and Automation Engineering'],
  'mechatronics engineering': ['Mechatronics', 'Mechatronics Engineering'],

  robotics: ['R&A', 'Robotics and Automation'],
  'r&a': ['R&A', 'Robotics and Automation'],
  'robotics and automation': ['R&A', 'Robotics and Automation'],

  vlsi: ['VLSI', 'Microelectronics and VLSI Engineering', 'VLSI Design and Technology', 'Electronics and VLSI Engineering'],

  food: ['Food Technology', 'Food Engineering and Technology', 'Food Process Engineering'],
  'food tech': ['Food Technology', 'Food Engineering and Technology'],
  'food technology': ['Food Technology'],

  textile: [
    'TT',
    'Textile Technology',
    'Handloom and Textile Technology',
    'Carpet and Textile Technology',
  ],
  tt: ['TT', 'Textile Technology'],
  'textile technology': ['TT', 'Textile Technology'],

  agri: ['Agricultural Engineering'],
  agriculture: ['Agricultural Engineering'],
  agricultural: ['Agricultural Engineering'],
  'agricultural engineering': ['Agricultural Engineering'],

  cer: ['CER', 'Ceramic Engineering'],
  ceramic: ['CER', 'Ceramic Engineering'],
  'ceramic engineering': ['CER', 'Ceramic Engineering'],

  'bio medical': ['Bio Medical Engineering', 'Biomedical Engineering'],
  biomedical: ['Bio Medical Engineering', 'Biomedical Engineering'],
  'biomedical engineering': ['Bio Medical Engineering', 'Biomedical Engineering'],

  'industrial design': ['Industrial Design'],

  chemistry: ['Chemistry'],
  physics: ['Physics'],
  math: ['Mathematics'],
  maths: ['Mathematics'],
  mathematics: [
    'Mathematics',
    'Mathematics and Computing',
    'Mathematics and Data Science',
    'Mathematics and Scientific Computing',
    'Computational Mathematics',
  ],

  energy: ['Energy Engineering', 'Sustainable Energy Technologies'],
};

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Short names in the DB can carry suffixes: "CSE (AI & DS)" or "ME [5Y]".
// For exact-code matching we only care about the base stem before those.
function shortStem(shortName: string): string {
  return shortName.toLowerCase().split(/[\s([]/)[0];
}

function branchMatches(branchShort: string, branchName: string, dream: string): boolean {
  const d = dream.trim().toLowerCase();
  if (!d) return false;
  const aliases = BRANCH_ALIASES[d] ?? [d];
  const stem = shortStem(branchShort);
  const nameLower = branchName.toLowerCase();
  for (const a of aliases) {
    const al = a.toLowerCase();
    // Exact short-code match on the base stem — prevents "ME" from matching "MME".
    if (stem === al) return true;
    // Word-boundary contains on full name — prevents "me" from matching inside "materials".
    const rx = new RegExp(`\\b${escapeRegex(al)}\\b`);
    if (rx.test(nameLower)) return true;
  }
  return false;
}

function collegeMatches(collegeId: string, shortName: string, dream: string): boolean {
  const d = dream.trim().toLowerCase();
  if (!d) return false;
  return collegeId.toLowerCase().includes(d) || shortName.toLowerCase().includes(d);
}

// ── Group per-branch results into per-college cards ───────────────────────────
const BUCKET_RANK: Record<Bucket, number> = { safe: 0, target: 1, reach: 2, unlikely: 3 };

interface CollegeGroup {
  college_id: string;
  college_short_name: string;
  college_type: 'NIT' | 'IIIT' | 'GFTI' | 'IIT';
  college_state: string;
  college_region: string;
  nirf_rank_engineering?: number;
  best_bucket: Bucket;
  best_probability_pct: number;
  branches: PredictorResult[];
}

function groupByCollege(
  results: PredictorResult[],
  dreamBranch?: string,
  dreamCollege?: string,
): CollegeGroup[] {
  const map = new Map<string, CollegeGroup>();
  for (const r of results) {
    if (!map.has(r.college_id)) {
      map.set(r.college_id, {
        college_id: r.college_id,
        college_short_name: r.college_short_name,
        college_type: r.college_type,
        college_state: r.college_state,
        college_region: r.college_region,
        nirf_rank_engineering: r.nirf_rank_engineering,
        best_bucket: r.bucket,
        best_probability_pct: r.probability_pct,
        branches: [],
      });
    }
    const g = map.get(r.college_id)!;
    g.branches.push(r);
    // Track the "headline" bucket/probability for this college (the best branch).
    if (
      BUCKET_RANK[r.bucket] < BUCKET_RANK[g.best_bucket] ||
      (BUCKET_RANK[r.bucket] === BUCKET_RANK[g.best_bucket] && r.probability_pct > g.best_probability_pct)
    ) {
      g.best_bucket = r.bucket;
      g.best_probability_pct = r.probability_pct;
    }
  }

  const groups = [...map.values()];

  // Sort branches inside each group: dream branch first, then by probability.
  for (const g of groups) {
    g.branches.sort((a, b) => {
      if (dreamBranch) {
        const aDream = branchMatches(a.branch_short_name, a.branch_name, dreamBranch) ? 0 : 1;
        const bDream = branchMatches(b.branch_short_name, b.branch_name, dreamBranch) ? 0 : 1;
        if (aDream !== bDream) return aDream - bDream;
      }
      const d = BUCKET_RANK[a.bucket] - BUCKET_RANK[b.bucket];
      if (d !== 0) return d;
      return b.probability_pct - a.probability_pct;
    });
  }

  // Sort groups: dream college pinned, then by best_bucket, then NIRF, then probability.
  groups.sort((a, b) => {
    if (dreamCollege) {
      const aDream = collegeMatches(a.college_id, a.college_short_name, dreamCollege) ? 0 : 1;
      const bDream = collegeMatches(b.college_id, b.college_short_name, dreamCollege) ? 0 : 1;
      if (aDream !== bDream) return aDream - bDream;
    }
    const d = BUCKET_RANK[a.best_bucket] - BUCKET_RANK[b.best_bucket];
    if (d !== 0) return d;
    const nirfA = a.nirf_rank_engineering ?? 9999;
    const nirfB = b.nirf_rank_engineering ?? 9999;
    if (nirfA !== nirfB) return nirfA - nirfB;
    return b.best_probability_pct - a.best_probability_pct;
  });

  return groups;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const rl = rateLimit(ip);
    if (!rl.ok) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a minute.' },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 },
      );
    }

    const parsed = PredictRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.issues },
        { status: 400 },
      );
    }
    const input = parsed.data;

    const targetYear = input.year ?? new Date().getFullYear();
    // Reserved categories: input.percentile is the category percentile, and
    // we need to convert it to a category rank that matches how JoSAA stores
    // closing ranks for that category. percentileToRank handles the routing
    // by category. For input.rank, we trust the caller to pass the right
    // unit — the form is responsible for asking "Category Rank" when the
    // selected category is non-OPEN.
    const effectiveRank =
      input.rank ?? percentileToRank(input.percentile as number, targetYear, input.category);

    const allResults = await predictColleges(
      {
        rank: effectiveRank,
        category: input.category,
        gender: input.gender,
        home_state: input.home_state,
        year: targetYear,
        include_unlikely: input.include_unlikely ?? false,
      },
      {},
    );

    // Apply region + college-type filters (hard filters).
    const regionSet = input.regions && input.regions.length > 0 ? new Set(input.regions) : null;
    const typeSet = input.college_types && input.college_types.length > 0
      ? new Set(input.college_types)
      : null;

    const filtered = allResults.filter((r) => {
      if (regionSet && !regionSet.has(r.college_region as 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast')) return false;
      if (typeSet && !typeSet.has(r.college_type as 'NIT' | 'IIIT' | 'GFTI')) return false;
      return true;
    });

    let groups = groupByCollege(filtered, input.dream_branch, input.dream_college);

    // If the user named a dream branch, the list should only show colleges
    // where that branch actually appears. Otherwise the top card ends up
    // displaying an unrelated program (Civil at a college with no Mechanical),
    // which is misleading.
    if (input.dream_branch && input.dream_branch.trim()) {
      groups = groups.filter((g) =>
        g.branches.some((b) =>
          branchMatches(b.branch_short_name, b.branch_name, input.dream_branch as string),
        ),
      );
    }

    // Per-bucket counts — based on each college's best bucket, not per-branch.
    const counts = groups.reduce(
      (acc, g) => {
        acc[g.best_bucket] = (acc[g.best_bucket] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const extended = input.extended === true;
    const DEFAULT_TOP_COLLEGES = 10;
    const MAX_COLLEGES = 100;
    const limit = extended ? MAX_COLLEGES : DEFAULT_TOP_COLLEGES;
    const colleges = groups.slice(0, limit);

    return NextResponse.json({
      success: true,
      input_summary: {
        effective_rank: effectiveRank,
        category: input.category,
        gender: input.gender,
        home_state: input.home_state,
        year: targetYear,
      },
      counts,
      total_colleges: groups.length,
      returned_colleges: colleges.length,
      extended,
      colleges,
    });
  } catch (err) {
    console.error('College predictor error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
