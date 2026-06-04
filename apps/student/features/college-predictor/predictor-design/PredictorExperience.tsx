'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  ACCENT,
  AudienceToggle,
  BUCKET_COLOR,
  BUCKET_DEFINITIONS,
  ConfidenceDots,
  Dropdown,
  FeatureCard,
  type Feature,
  Icons,
  NumberWithSlider,
  SectionHead,
  Seg,
  Sparkline,
  TrustRow,
  chanceToWords,
} from './primitives';
import ShareCardButton from '../components/ShareCardButton';
import ChoiceListBuilder from '../components/ChoiceListBuilder';
import { BRANCH_BUCKETS, BUCKET_DRILLDOWN } from '../lib/branchBuckets';

// ============================================================================
// PredictorExperience — the unified form + results surface that implements
// the Claude Design lower sections (input-section.jsx + results-section.jsx
// from the handoff bundle).
//
// Wraps both JEE Main and BITSAT predictors behind one tab toggle, runs
// existing APIs, and renders the new visual language across input, results,
// sensitivity chart, and share row.
//
// Underlying APIs reused unchanged:
//   POST /api/v2/college-predictor/predict             (JoSAA)
//   POST /api/v2/college-predictor/predict-range       (JoSAA sensitivity)
//   POST /api/v2/college-predictor/bitsat/predict      (BITSAT)
//   POST /api/v2/college-predictor/bitsat/predict-range (BITSAT sensitivity)
//
// State design: each exam keeps its own form state. Switching tabs preserves
// what the user typed. Submit calls the matching endpoint and renders the
// results panel beneath the form.
// ============================================================================

type Exam = 'jee' | 'bitsat';

// ── Static feature catalog — same 4 cards across both exams ──────────────────
const FEATURES: Feature[] = [
  {
    n: '01',
    icon: 'target',
    color: '#34d399',
    title: 'Predict',
    desc: 'Safe · Target · Reach buckets from your rank or BITSAT score, the moment you hit enter.',
  },
  {
    n: '02',
    icon: 'list',
    color: '#fbbf24',
    title: 'Build a choice list',
    desc: 'JoSAA-ready order — moonshots at the top, safety nets at the bottom, with one click.',
  },
  {
    n: '03',
    icon: 'share',
    color: '#7dd3fc',
    title: 'Share with parents',
    desc: 'A square WhatsApp card with plain-English chance labels. Travels through family groups on its own.',
  },
];

// ── State catalog (canonical names used by the JoSAA predictor) ──────────────
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Ladakh', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

// ── Result row types ─────────────────────────────────────────────────────────
type Bucket = 'safe' | 'target' | 'reach' | 'unlikely';

interface JoSAABranchResult {
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
  projected_closing_rank: number;
  historical: { year: number; closing_rank: number }[];
  confidence: 'high' | 'medium' | 'low';
  quota_matched: string;
}

interface JoSAACollegeGroup {
  college_id: string;
  college_short_name: string;
  college_type: 'NIT' | 'IIIT' | 'GFTI' | 'IIT';
  college_state: string;
  college_region: string;
  nirf_rank_engineering?: number;
  best_bucket: Bucket;
  best_probability_pct: number;
  branches: JoSAABranchResult[];
}

interface BitsatProgrammeResult {
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
  historical: { year: number; cutoff_score: number }[];
  confidence: 'high' | 'medium' | 'low';
  regime: 'modern' | 'legacy';
  max_score: number;
}

// Normalized row shape used by the new ResultRow design. JEE rows compose
// from `branches[0]` of each college group; BITSAT rows map 1:1.
interface DisplayRow {
  rank: number;
  programme: string;
  inst: string;
  state: string;
  nirf?: number;
  close: number;
  closeUnit: '/390' | '/450' | 'CRL';
  conf: 'high' | 'medium' | 'low';
  pct: number;
  bucket: Bucket;
  trend: number[];
  // Score-delta vs the user's input — only meaningful for BITSAT; JoSAA
  // computes rank delta differently.
  delta?: number;
  // Destination for the row click. JEE non-IIT colleges have a deep-dive
  // page at /college-predictor/college/[slug]; IITs + BITSAT campuses don't,
  // so they stay as plain non-clickable cards.
  href?: string;
}

// ── Career-guide suggestions ────────────────────────────────────────────────
// Maps branch / programme codes that show up in predictor results to the
// career-spec slugs they realistically lead toward in 2026.
//
// Why hardcoded vs fetched: with 3-6 published specs the matching surface is
// small enough that an in-component map is more honest than a fuzzy slug-to-
// degree-list matcher. As the editorial catalog grows (target: 12 by Q4) this
// either expands or moves to a `branch_tags: string[]` field on CareerSpec.
//
// Editorial note: this map only surfaces a spec if we have GENUINE coverage
// for that branch. E.g. NIT Mech CSE shows SWE + ML; NIT Mech does NOT show
// the SWE spec because a Mech-Eng graduate isn't a natural product-engineer
// pipeline (despite the occasional switch). The empty-match fallback is the
// generic /career-guide link — better to say "explore" than to fake a match.
const BRANCH_TO_CAREER_SLUGS: Record<string, readonly string[]> = {
  // CS family — software / data / ML / quant / AI-evals are all plausible.
  // Order matters: the first 3 entries become the top-3 suggestions when a
  // student has only CS branches in their matches.
  'CSE': ['software-engineer-product', 'data-engineer', 'ml-engineer'],
  'CS':  ['software-engineer-product', 'data-engineer', 'ml-engineer'],
  'IT':  ['software-engineer-product', 'data-engineer'],
  'AI':  ['ml-engineer', 'ai-evaluations-engineer', 'data-engineer'],
  'AI & ML': ['ml-engineer', 'ai-evaluations-engineer', 'data-engineer'],
  'AIML': ['ml-engineer', 'ai-evaluations-engineer', 'data-engineer'],
  'AI & DS': ['ml-engineer', 'data-engineer'],
  // Math & Computing — uniquely positioned for quant + ML on top of standard SWE.
  'M&C':  ['quant-developer', 'ml-engineer', 'software-engineer-product'],
  'MNC':  ['quant-developer', 'ml-engineer', 'software-engineer-product'],
  'CSAI': ['ml-engineer', 'ai-evaluations-engineer', 'data-engineer'],
  'DSE':  ['data-engineer', 'ml-engineer'],

  // Electronics — primary pipeline is semiconductor; ML / data engineering
  // are real-but-secondary pivots that require self-driven CS work.
  'ECE': ['semiconductor-engineer', 'ml-engineer', 'robotics-engineer'],
  'EE':  ['semiconductor-engineer', 'robotics-engineer', 'ml-engineer'],
  'EEE': ['semiconductor-engineer', 'robotics-engineer', 'ml-engineer'],
  'EIE': ['semiconductor-engineer', 'robotics-engineer'],
  'VLSI': ['semiconductor-engineer'],
  'Microelectronics': ['semiconductor-engineer'],

  // Mechanical family — robotics is the modern path; energy + materials for
  // the chem-adjacent or thermal/EV interest.
  'ME':  ['robotics-engineer', 'energy-materials-engineer'],
  'Mech': ['robotics-engineer', 'energy-materials-engineer'],
  'Mechanical': ['robotics-engineer', 'energy-materials-engineer'],
  'Mechatronics': ['robotics-engineer', 'semiconductor-engineer'],
  'Production': ['robotics-engineer'],
  'Manufacturing': ['robotics-engineer'],
  'Industrial': ['robotics-engineer'],
  'Aerospace': ['robotics-engineer', 'semiconductor-engineer'],

  // Chemical / Materials family
  'ChE': ['energy-materials-engineer'],
  'Chemical': ['energy-materials-engineer'],
  'CHE': ['energy-materials-engineer'],
  'Metallurgy': ['energy-materials-engineer'],
  'Metallurgical': ['energy-materials-engineer'],
  'Materials': ['energy-materials-engineer'],
  'MME': ['energy-materials-engineer'],
  'Polymer': ['energy-materials-engineer'],
  'Ceramic': ['energy-materials-engineer'],

  // Biotech / biological engineering
  'BT':  ['biotech-research', 'healthcare-ai'],
  'Biotech': ['biotech-research', 'healthcare-ai'],
  'Biotechnology': ['biotech-research', 'healthcare-ai'],
  'BioE': ['biotech-research', 'healthcare-ai'],
  'Bioengineering': ['biotech-research', 'healthcare-ai'],
  'Biological': ['biotech-research', 'healthcare-ai'],

  // BITSAT programme codes — extend with Mech / Chem / Bio coverage
  'BE-CSE':  ['software-engineer-product', 'data-engineer', 'ml-engineer'],
  'BE-ECE':  ['semiconductor-engineer', 'ml-engineer', 'robotics-engineer'],
  'BE-EEE':  ['semiconductor-engineer', 'robotics-engineer', 'ml-engineer'],
  'BE-EIE':  ['semiconductor-engineer', 'robotics-engineer'],
  'BE-ECMP': ['software-engineer-product', 'ml-engineer', 'data-engineer'],
  'BE-MECH': ['robotics-engineer', 'energy-materials-engineer'],
  'BE-CHE':  ['energy-materials-engineer'],
  'BE-MANF': ['robotics-engineer'],
  'BE-MNC':  ['quant-developer', 'ml-engineer', 'software-engineer-product'],
  'BE-ENV':  ['energy-materials-engineer'],
  'MSC-MATH':   ['quant-developer', 'ml-engineer'],
  'MSC-PHYS':   ['quant-developer', 'semiconductor-engineer'],
  'MSC-CHEM':   ['energy-materials-engineer', 'biotech-research'],
  'MSC-BIO':    ['biotech-research', 'healthcare-ai'],
  'MSC-ECON':   ['quant-developer', 'data-engineer'],
  'MSC-SEMI':   ['semiconductor-engineer'],
  'BPHARM':     ['biotech-research', 'healthcare-ai'],
};

// Inline spec metadata for the suggestions panel. As the catalog grows this
// either expands or gets fetched from /api/v2/career-guide at mount time.
// For V1 (3-6 specs), hardcoding is cleaner than a loading-state.
interface CareerSuggestion {
  slug: string;
  title: string;
  blurb: string;
  archetype: 'transforming' | 'emerging' | 'traditional';
}
const CAREER_SUGGESTIONS: Record<string, CareerSuggestion> = {
  'software-engineer-product': {
    slug: 'software-engineer-product',
    title: 'Software engineer — product track',
    blurb: 'Build and ship product features at companies that sell software. AI is reshaping it, not replacing it.',
    archetype: 'transforming',
  },
  'ml-engineer': {
    slug: 'ml-engineer',
    title: 'ML / Applied AI engineer',
    blurb: 'Design and deploy ML systems inside real products. The actual "AI engineer" career — and what it really involves.',
    archetype: 'emerging',
  },
  'clinical-doctor': {
    slug: 'clinical-doctor',
    title: 'Clinical doctor (MBBS path)',
    blurb: 'The long, hard, back-loaded medical path. Read this before committing.',
    archetype: 'traditional',
  },
  'data-engineer': {
    slug: 'data-engineer',
    title: 'Data engineer / analytics engineer',
    blurb: 'Build the pipelines analytics, dashboards, and ML rely on. The "switch fields" career — less hype, more durability.',
    archetype: 'transforming',
  },
  'semiconductor-engineer': {
    slug: 'semiconductor-engineer',
    title: 'Semiconductor / chip design engineer',
    blurb: 'Design and verify the chips behind phones, cars, and AI accelerators. ECE\'s most-emerging path.',
    archetype: 'emerging',
  },
  'quant-developer': {
    slug: 'quant-developer',
    title: 'Quant developer / quantitative analyst',
    blurb: 'Build the systems and models trading firms use. Narrow entry, very well paid — read the cons honestly.',
    archetype: 'transforming',
  },
  'robotics-engineer': {
    slug: 'robotics-engineer',
    title: 'Robotics + automation engineer',
    blurb: 'Build machines that move physical stuff — warehouse robots, factory automation, mobile platforms. Mech\'s most modern path.',
    archetype: 'transforming',
  },
  'energy-materials-engineer': {
    slug: 'energy-materials-engineer',
    title: 'Energy / materials engineer',
    blurb: 'Battery chemistry, hydrogen, advanced materials. Chemical Engineering\'s honest second act in 2026.',
    archetype: 'emerging',
  },
  'biotech-research': {
    slug: 'biotech-research',
    title: 'Biotech / drug discovery research',
    blurb: 'Drug discovery, computational biology, biotech R&D. The NEET path without clinical practice.',
    archetype: 'emerging',
  },
  'product-designer': {
    slug: 'product-designer',
    title: 'Product designer / UX research',
    blurb: 'Design how people interact with software — the bridge between engineering, business, and the user.',
    archetype: 'transforming',
  },
  'ai-evaluations-engineer': {
    slug: 'ai-evaluations-engineer',
    title: 'AI evaluations / safety engineer',
    blurb: 'Figure out how to know if AI systems actually work. Brand-new career — didn\'t exist 24 months ago.',
    archetype: 'emerging',
  },
};

// Pure helper — given an array of branch tokens, return up to 3 unique career
// slugs ranked by how many input branches mapped to them (more matches first).
// Honest behavior: empty input or no matches return an empty array; the caller
// then falls back to the static index link.
function suggestCareerSlugsFromBranches(branches: readonly string[]): string[] {
  const score = new Map<string, number>();
  for (const b of branches) {
    const slugs = BRANCH_TO_CAREER_SLUGS[b];
    if (!slugs) continue;
    for (const s of slugs) score.set(s, (score.get(s) ?? 0) + 1);
  }
  return Array.from(score.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([slug]) => slug);
}

// ── Sensitivity-chart row (from /predict-range) ──────────────────────────────
// Now carries:
//   - raw counts (for the stacked-bar segments)
//   - weighted_score (for bar HEIGHTS, so prestigious unlocks visibly outweigh
//     marginal ones — a chart honesty fix)
//   - tier_mix (3-dot indicator under each bar)
//   - newlySafe with NIRF (the "what unlocks at this rank/score" list under
//     the chart, ranked by prestige)
interface SensRow {
  score?: number;
  rank?: number;
  safe: number;
  target: number;
  reach: number;
  weighted_score?: number;
  tier_mix?: { T1: number; T2: number; T3: number };
  newly_safe?: { title: string; subtitle: string; nirf?: number }[];
}

// Maps each BITSAT branch chip label to its canonical programme code (the join
// key the BITSAT predict route filters on — see packages/data/bitsat/programmes.ts).
// JEE matches branches by free-text alias, but BITSAT filters by exact code, so
// the chips must resolve to a code before we can send the `programmes` filter.
// Keep the keys in sync with the BITSAT chip list in the branch panel below.
const BITSAT_BRANCH_TO_CODE: Record<string, string> = {
  CSE: 'BE-CSE',
  ECE: 'BE-ECE',
  EEE: 'BE-EEE',
  Mechanical: 'BE-MECH',
  Chemical: 'BE-CHE',
  Biological: 'MSC-BIO',
  Pharmacy: 'BPHARM',
  Manufacturing: 'BE-MANF',
};

// Shared styles for the branch-filter chips (bucket chips, drill-down chips,
// and the BITSAT programme chips all use the same look).
const BRANCH_LABEL_STYLE: React.CSSProperties = {
  color: '#cfcfd6',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.16em',
  fontFamily: "'JetBrains Mono', monospace",
  marginBottom: 10,
};
function branchChipStyle(active: boolean): React.CSSProperties {
  return {
    padding: '7px 12px',
    borderRadius: 8,
    border: active ? `1px solid ${ACCENT}80` : '1px solid rgba(255,255,255,0.08)',
    background: active ? `${ACCENT}15` : 'rgba(255,255,255,0.02)',
    color: active ? ACCENT : '#cfcfd6',
    fontSize: 12.5,
    fontWeight: active ? 600 : 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  };
}

export default function PredictorExperience() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial exam tab from URL so a shared link lands in the right place.
  const initialExam: Exam = searchParams.get('tool') === 'bitsat' ? 'bitsat' : 'jee';
  const [exam, setExam] = useState<Exam>(initialExam);

  // Branch Finder hands off here with ?dream_branch=<value> — pre-select that
  // branch so the predictor opens already scoped to it. The param wins over any
  // saved session (see the restore effect below).
  const initialBranch = searchParams.get('dream_branch');

  // JEE form state
  const [category, setCategory] = useState<'OPEN' | 'EWS' | 'OBC-NCL' | 'SC' | 'ST'>('OPEN');
  const [quota, setQuota] = useState<'HS' | 'OS' | 'AI'>('HS');
  const [homeState, setHomeState] = useState('Uttar Pradesh');
  const [rankType, setRankType] = useState<'CRL' | 'CAT'>('CRL');
  const [rank, setRank] = useState(8532);
  // Affirmative-action toggles. The cutoff schema models these as:
  //   - Girls Quota → gender = 'Female-only (including Supernumerary)'
  //   - PwD Quota   → category gets a ' (PwD)' suffix at submit time
  // Both default off (i.e. Gender-Neutral, non-PwD seats).
  const [isFemale, setIsFemale] = useState(false);
  const [isPwD, setIsPwD] = useState(false);
  // Derived API-shaped values — used by submitJEE, share-card, and choice-list
  // so all three downstream calls honour the same quota selection.
  const effectiveCategory = isPwD ? (`${category} (PwD)` as const) : category;
  const effectiveGender = isFemale
    ? ('Female-only (including Supernumerary)' as const)
    : ('Gender-Neutral' as const);

  // BITSAT form state
  const [paper, setPaper] = useState<'modern' | 'legacy'>('modern');
  const [score, setScore] = useState(295);
  const maxScore = paper === 'modern' ? 390 : 450;

  // Narrow-down state. Default OPEN so the branch filter (the most-requested
  // refinement) is visible to every user without an extra click — pre-fix
  // analytics showed users were missing the collapsed section entirely and
  // asking us to add a branch filter that was already there.
  const [narrowOpen, setNarrowOpen] = useState(true);
  // BITSAT branch filter still uses single-select programme chips (its ~19
  // programmes don't need bucketing).
  const [pickedBranches, setPickedBranches] = useState<string[]>(
    initialBranch ? [initialBranch] : [],
  );
  // JEE branch filter uses BUCKETS (consolidated branch groups) + an optional
  // drill-down to a specific branch within the chosen bucket.
  const [pickedBucket, setPickedBucket] = useState<string | null>(null);
  const [pickedSpecific, setPickedSpecific] = useState<string | null>(null);
  const [tierOnly, setTierOnly] = useState(false);

  // Submission + results state
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  // When the API reports it converted CRL → category-rank, we show a one-
  // liner above the results so reserved-category users see what the
  // predictor actually matched against. Set from predictRes.rank_conversion.
  const [rankConversion, setRankConversion] = useState<
    { original: number; converted: number; category: string } | null
  >(null);
  const [jeeGroups, setJeeGroups] = useState<JoSAACollegeGroup[] | null>(null);
  const [bitsatRows, setBitsatRows] = useState<BitsatProgrammeResult[] | null>(null);
  const [sens, setSens] = useState<SensRow[] | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [counts, setCounts] = useState<{ safe: number; target: number; reach: number } | null>(null);

  // Results UI state
  const [audience, setAudience] = useState<'student' | 'parent'>('student');
  const [filter, setFilter] = useState<'all' | 'safe' | 'target' | 'reach'>('all');
  const [extended, setExtended] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  // Pagination — slice the result list into 10-row pages so a 96-college
  // response doesn't force a multi-screen scroll. Reset to 0 on every new
  // submission and whenever the active filter changes (handled via useEffect
  // below). The Next button straddles the extended-fetch boundary: if the
  // user is on the last locally-loaded page but the API has more results,
  // pressing Next triggers loadMoreJee() and only then advances the page.
  const PAGE_SIZE = 10;
  const [pageIndex, setPageIndex] = useState(0);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Hydration flag — flipped true once we've attempted to restore from
  // sessionStorage. Must be state (not a ref) so the persistence effect waits
  // for the re-render after the hydration setters apply; otherwise its closure
  // would still hold default values when it fires and would clobber the
  // snapshot we just read.
  const [hydrated, setHydrated] = useState(false);
  const STORAGE_KEY = 'predictor:state:v2';

  // Hydrate from sessionStorage on mount. Navigating away (e.g. clicking a
  // college card) and back used to wipe the form + results because they live
  // entirely in component state. We restore everything except pageIndex
  // (lands on page 1; the reset-on-results-change effect re-fires anyway).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as Record<string, unknown>;
        if (s.exam === 'jee' || s.exam === 'bitsat') setExam(s.exam);
        if (typeof s.rank === 'number') setRank(s.rank);
        if (s.rankType === 'CRL' || s.rankType === 'CAT') setRankType(s.rankType);
        if (s.category === 'OPEN' || s.category === 'EWS' || s.category === 'OBC-NCL' || s.category === 'SC' || s.category === 'ST') setCategory(s.category);
        if (s.quota === 'HS' || s.quota === 'OS' || s.quota === 'AI') setQuota(s.quota);
        if (typeof s.homeState === 'string') setHomeState(s.homeState);
        if (typeof s.isFemale === 'boolean') setIsFemale(s.isFemale);
        if (typeof s.isPwD === 'boolean') setIsPwD(s.isPwD);
        if (typeof s.score === 'number') setScore(s.score);
        if (s.paper === 'modern' || s.paper === 'legacy') setPaper(s.paper);
        // A ?dream_branch= handoff from the Branch Finder takes precedence over
        // the saved selection, so the predictor opens scoped to that branch.
        if (!initialBranch && Array.isArray(s.pickedBranches)) setPickedBranches(s.pickedBranches as string[]);
        if (typeof s.pickedBucket === 'string' || s.pickedBucket === null) setPickedBucket(s.pickedBucket as string | null);
        if (typeof s.pickedSpecific === 'string' || s.pickedSpecific === null) setPickedSpecific(s.pickedSpecific as string | null);
        if (typeof s.tierOnly === 'boolean') setTierOnly(s.tierOnly);
        if (Array.isArray(s.jeeGroups)) setJeeGroups(s.jeeGroups as JoSAACollegeGroup[]);
        if (Array.isArray(s.bitsatRows)) setBitsatRows(s.bitsatRows as BitsatProgrammeResult[]);
        if (Array.isArray(s.sens)) setSens(s.sens as SensRow[]);
        if (typeof s.totalCount === 'number') setTotalCount(s.totalCount);
        if (s.counts && typeof s.counts === 'object') setCounts(s.counts as { safe: number; target: number; reach: number });
        if (s.rankConversion && typeof s.rankConversion === 'object') setRankConversion(s.rankConversion as { original: number; converted: number; category: string });
        if (s.audience === 'student' || s.audience === 'parent') setAudience(s.audience);
        if (s.filter === 'all' || s.filter === 'safe' || s.filter === 'target' || s.filter === 'reach') setFilter(s.filter);
        if (typeof s.extended === 'boolean') setExtended(s.extended);
      }
    } catch {
      // Bad JSON or quota error — keep defaults.
    }
    setHydrated(true);
  }, []);

  // Persist whenever interesting state changes — gated by `hydrated` so the
  // initial render doesn't overwrite a fresh snapshot with default values.
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          exam, rank, rankType, category, quota, homeState, isFemale, isPwD,
          score, paper, pickedBranches, pickedBucket, pickedSpecific, tierOnly,
          jeeGroups, bitsatRows, sens, totalCount, counts, rankConversion,
          audience, filter, extended,
        }),
      );
    } catch {
      // sessionStorage quota / disabled — silent fail; UI still works.
    }
  }, [hydrated, exam, rank, rankType, category, quota, homeState, isFemale, isPwD,
      score, paper, pickedBranches, pickedBucket, pickedSpecific, tierOnly,
      jeeGroups, bitsatRows, sens, totalCount, counts, rankConversion,
      audience, filter, extended]);

  // Keep URL in sync with the active exam so a shared link respects the tab.
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (exam === 'bitsat') params.set('tool', 'bitsat');
    else params.delete('tool');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam]);

  // ── Submit handlers ────────────────────────────────────────────────────────

  // "Load more" — re-fires the predict call with extended:true to lift the
  // result cap from the default 10 colleges to 100. Mirrors submitJEE's body
  // construction so any quota / branch / rank state changes apply uniformly.
  // We only refresh the colleges + counts; the sensitivity sparkline data
  // (predict-range) and the bucket counts are unchanged when the cap lifts,
  // so we skip re-fetching those to stay light on Mongo.
  async function loadMoreJee() {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const body: Record<string, unknown> = {
        rank,
        rank_type: rankType,
        category: effectiveCategory,
        gender: effectiveGender,
        home_state: homeState,
        ...(pickedBucket ? { branch_bucket: pickedBucket } : {}),
        ...(pickedSpecific ? { dream_branch: pickedSpecific } : {}),
        ...(tierOnly ? { tier_only: true } : {}),
        extended: true,
      };
      const predictRes = await fetch('/api/v2/college-predictor/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then((r) => r.json());
      if (predictRes?.success) {
        const groups: JoSAACollegeGroup[] = predictRes.colleges ?? [];
        setJeeGroups(groups);
        setTotalCount(predictRes.total_colleges ?? groups.length);
        setExtended(true);
      }
    } catch {
      // Silently keep the prior (top-10) results visible. The user can retry.
    } finally {
      setLoadingMore(false);
    }
  }

  async function submitJEE() {
    setLoading(true);
    setExtended(false);
    setFilter('all');
    setRankConversion(null);
    try {
      // For category rank, percentileToRank knows the conversion isn't needed
      // since user already typed a category rank. We pass the raw rank.
      const body: Record<string, unknown> = {
        rank,
        // rank_type tells the API whether `rank` is a CRL (Common Rank List,
        // total ranking) or a CAT (category-pool rank). The API converts
        // CRL → category rank automatically when category is non-OPEN. See
        // lib/percentileToRank.ts and lib/predictor.ts for the math.
        rank_type: rankType,
        category: effectiveCategory,
        gender: effectiveGender,
        home_state: homeState,
        // Branch filter: the UI is single-select, so one branch maps cleanly to
        // the API's single dream_branch param. Tier-1 is also enforced
        // server-side so counts/total/pagination stay consistent with the rows.
        ...(pickedBucket ? { branch_bucket: pickedBucket } : {}),
        ...(pickedSpecific ? { dream_branch: pickedSpecific } : {}),
        ...(tierOnly ? { tier_only: true } : {}),
        extended: false,
      };
      const [predictRes, rangeRes] = await Promise.all([
        fetch('/api/v2/college-predictor/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).then((r) => r.json()),
        fetch('/api/v2/college-predictor/predict-range', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rank,
            rank_type: rankType,
            category: effectiveCategory,
            gender: effectiveGender,
            home_state: homeState,
          }),
        }).then((r) => r.json()).catch(() => null),
      ]);
      if (!predictRes?.success) {
        setJeeGroups([]);
        setSens(null);
        setTotalCount(0);
        setCounts({ safe: 0, target: 0, reach: 0 });
      } else {
        const groups: JoSAACollegeGroup[] = predictRes.colleges ?? [];
        setJeeGroups(groups);
        setBitsatRows(null);
        setTotalCount(predictRes.total_colleges ?? groups.length);
        setCounts({
          safe: predictRes.counts?.safe ?? 0,
          target: predictRes.counts?.target ?? 0,
          reach: predictRes.counts?.reach ?? 0,
        });
        // If the API converted CRL → category rank, surface it. Reserved-
        // category students need to see what we actually matched against;
        // otherwise the "Safe-bucket count: 47" feels disconnected from the
        // CRL they typed in.
        setRankConversion(
          predictRes.rank_conversion
            ? {
                original: predictRes.rank_conversion.original,
                converted: predictRes.rank_conversion.converted,
                category: predictRes.rank_conversion.category,
              }
            : null,
        );
        if (rangeRes?.success && rangeRes.points) {
          setSens(
            rangeRes.points.map((p: {
              rank: number;
              counts: { safe: number; target: number; reach: number };
              weighted_score?: number;
              tier_mix?: { T1: number; T2: number; T3: number };
              newly_safe?: { college_short_name: string; branch_name: string; nirf?: number }[];
            }) => ({
              rank: p.rank,
              safe: p.counts.safe ?? 0,
              target: p.counts.target ?? 0,
              reach: p.counts.reach ?? 0,
              weighted_score: p.weighted_score,
              tier_mix: p.tier_mix,
              newly_safe: (p.newly_safe ?? []).map((u) => ({
                title: u.college_short_name,
                subtitle: u.branch_name,
                nirf: u.nirf,
              })),
            })),
          );
        } else {
          setSens(null);
        }
      }
    } finally {
      setLoading(false);
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }

  async function submitBitsat() {
    setLoading(true);
    setExtended(false);
    setFilter('all');
    try {
      // Branch filter: the chips are single-select and BITSAT filters by exact
      // programme code, so resolve the picked label to a code. tier_only does
      // not apply to BITSAT (every result is a BITS campus), so the tier
      // checkbox is hidden on this tab and not sent.
      const programmeCode = pickedBranches[0] ? BITSAT_BRANCH_TO_CODE[pickedBranches[0]] : undefined;
      const body: Record<string, unknown> = {
        score,
        regime: paper,
        ...(programmeCode ? { programmes: [programmeCode] } : {}),
        extended: false,
      };
      const [predictRes, rangeRes] = await Promise.all([
        fetch('/api/v2/college-predictor/bitsat/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).then((r) => r.json()),
        fetch('/api/v2/college-predictor/bitsat/predict-range', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base_score: score, regime: paper }),
        }).then((r) => r.json()).catch(() => null),
      ]);
      if (!predictRes?.success) {
        setBitsatRows([]);
        setSens(null);
        setTotalCount(0);
        setCounts({ safe: 0, target: 0, reach: 0 });
      } else {
        const rows: BitsatProgrammeResult[] = predictRes.programmes ?? [];
        setBitsatRows(rows);
        setJeeGroups(null);
        setTotalCount(predictRes.total_programmes ?? rows.length);
        setCounts({
          safe: predictRes.counts?.safe ?? 0,
          target: predictRes.counts?.target ?? 0,
          reach: predictRes.counts?.reach ?? 0,
        });
        if (rangeRes?.success && rangeRes.points) {
          setSens(
            rangeRes.points.map((p: {
              score: number;
              counts: { safe: number; target: number; reach: number };
              weighted_score?: number;
              tier_mix?: { T1: number; T2: number; T3: number };
              newly_safe?: { campus_name: string; programme_name: string; nirf?: number }[];
            }) => ({
              score: p.score,
              safe: p.counts.safe ?? 0,
              target: p.counts.target ?? 0,
              reach: p.counts.reach ?? 0,
              weighted_score: p.weighted_score,
              tier_mix: p.tier_mix,
              newly_safe: (p.newly_safe ?? []).map((u) => ({
                title: `BITS ${u.campus_name}`,
                subtitle: u.programme_name,
                nirf: u.nirf,
              })),
            })),
          );
        } else {
          setSens(null);
        }
      }
    } finally {
      setLoading(false);
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }

  // ── Adapt results into the new ResultRow display shape ─────────────────────
  const rows: DisplayRow[] = useMemo(() => {
    if (exam === 'jee' && jeeGroups) {
      return jeeGroups.flatMap((g, gi) =>
        g.branches.slice(0, 1).map<DisplayRow>((b) => ({
          rank: gi + 1,
          programme: b.branch_name,
          inst: g.college_short_name,
          state: g.college_state,
          nirf: g.nirf_rank_engineering,
          close: b.projected_closing_rank,
          closeUnit: 'CRL',
          conf: b.confidence,
          pct: b.probability_pct,
          bucket: b.bucket,
          trend: b.historical
            .slice()
            .sort((a, c) => a.year - c.year)
            .map((h) => h.closing_rank)
            .concat([b.projected_closing_rank]),
          // IITs don't have deep-dive pages (JoSAA predictor scope is
          // NIT/IIIT/GFTI), so we only link non-IIT JEE rows.
          href: g.college_type !== 'IIT' ? `/college-predictor/college/${g.college_id}` : undefined,
        })),
      );
    }
    if (exam === 'bitsat' && bitsatRows) {
      return bitsatRows.map<DisplayRow>((r, i) => ({
        rank: i + 1,
        programme: r.programme_name,
        inst: `BITS ${r.campus_name}`,
        state: r.campus_state,
        nirf: r.nirf_rank_engineering,
        close: r.projected_cutoff_score,
        closeUnit: r.max_score === 390 ? '/390' : '/450',
        conf: r.confidence,
        pct: r.probability_pct,
        bucket: r.bucket,
        trend: r.historical
          .slice()
          .sort((a, c) => a.year - c.year)
          .map((h) => h.cutoff_score)
          .concat([r.projected_cutoff_score]),
        delta: r.projected_cutoff_score - score,
      }));
    }
    return [];
  }, [exam, jeeGroups, bitsatRows, score]);

  const filteredRows = useMemo(() => {
    if (filter === 'all') return rows;
    return rows.filter((r) => r.bucket === filter);
  }, [rows, filter]);

  // Reset to page 1 whenever the underlying list changes (new submit, filter
  // toggle, or extended fetch landed). Otherwise the user can end up parked
  // on "page 5" of a 1-page filtered list and see an empty results pane.
  useEffect(() => {
    setPageIndex(0);
  }, [filter, jeeGroups, bitsatRows]);

  // Effective total available for the current view — drives pagination math.
  // Before the bucket-filter fix this only honored totalCount when filter was
  // 'all', which meant clicking SAFE (e.g. Safe · 69) collapsed pagination to
  // the locally-loaded slice (10 rows max), silently hiding the rest. Now we
  // use the per-bucket count from `counts` when a filter is active, so the
  // pager shows the real page count and the extended fetch can be triggered.
  const filteredTotal =
    filter === 'all'
      ? totalCount ?? filteredRows.length
      : counts?.[filter] ?? filteredRows.length;
  const localPageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  // Phantom pages exist when the API capped at 10 (extended=false) but the
  // bucket actually contains more. Once `extended` lands, totalPages collapses
  // to ceil(filteredRows / PAGE_SIZE) of the real loaded data.
  const totalPages =
    !extended && filteredTotal > filteredRows.length
      ? Math.max(localPageCount, Math.ceil(filteredTotal / PAGE_SIZE))
      : localPageCount;
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const pageStart = safePageIndex * PAGE_SIZE;
  const visibleRows = filteredRows.slice(pageStart, pageStart + PAGE_SIZE);
  const rangeStart = filteredRows.length === 0 ? 0 : pageStart + 1;
  const rangeEnd = Math.min(pageStart + PAGE_SIZE, filteredRows.length);

  // Auto-trigger the extended fetch the moment the user activates a bucket
  // filter whose count exceeds what's locally loaded. Without this the
  // pagination at the bottom is enough — but the user expects to see all 69
  // Safe colleges immediately, not have to click Next first. Guarded by
  // `extended` so it fires once per result set, and by `loadingMore` so a
  // pending fetch isn't re-fired.
  useEffect(() => {
    if (filter === 'all') return;
    if (extended || loadingMore) return;
    if (exam !== 'jee') return;
    const bucketCount = counts?.[filter] ?? 0;
    if (bucketCount > filteredRows.length) {
      loadMoreJee();
    }
    // loadMoreJee is stable per submit cycle; deps capture the inputs that
    // could change the answer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, extended, loadingMore, exam, counts, filteredRows.length]);

  // Jump to a specific page. If the target sits past the locally-cached rows
  // and there's more available server-side, fetch the extended set first.
  // Only JEE has a server-side extended fetch — BITSAT returns the full list
  // up-front, so the local slice handles it.
  async function goToPage(target: number) {
    const clamped = Math.max(0, Math.min(target, totalPages - 1));
    const needsMore =
      !extended && (target + 1) * PAGE_SIZE > filteredRows.length && filteredTotal > filteredRows.length;
    if (needsMore) {
      if (exam === 'jee') {
        await loadMoreJee();
      } else {
        setExtended(true);
      }
    }
    setPageIndex(clamped);
    // Scroll the results header back into view so the user sees the new page
    // start, not the bottom of the previous one.
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const hasResults = jeeGroups !== null || bitsatRows !== null;

  // Career-suggestion shortlist — derived from the user's matched branches.
  // Empty array means "no honest match, fall back to the static index link".
  // Only considers Safe + Target buckets because Reach is a stretch and
  // probably shouldn't drive career-direction recommendations.
  const suggestedCareerSlugs = useMemo(() => {
    if (!hasResults) return [];
    const branches: string[] = [];
    if (exam === 'jee' && jeeGroups) {
      for (const g of jeeGroups) {
        for (const b of g.branches) {
          if (b.bucket === 'safe' || b.bucket === 'target') {
            branches.push(b.branch_short_name);
          }
        }
      }
    } else if (exam === 'bitsat' && bitsatRows) {
      for (const r of bitsatRows) {
        if (r.bucket === 'safe' || r.bucket === 'target') {
          branches.push(r.programme_code);
        }
      }
    }
    return suggestCareerSlugsFromBranches(branches);
  }, [exam, jeeGroups, bitsatRows, hasResults]);

  // ── Filter-by-branch panel — shared between the JEE and BITSAT forms.
  // Lives inside whichever grid is active so we can use CSS order to place it
  // between the form fields and the ReturnsCard on mobile (per UX feedback —
  // it belongs right under the home-state filter), and below the full row on
  // desktop. Defined once here so both branches reuse the same instance.
  const narrowDownPanel = (
    <div
      style={{
        borderRadius: 14,
        border: `1px solid ${ACCENT}33`,
        background: `linear-gradient(180deg, ${ACCENT}0d, rgba(255,255,255,0.01))`,
        padding: 18,
      }}
    >
      <button
        type="button"
        onClick={() => setNarrowOpen((v) => !v)}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span
            aria-hidden
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 26,
              height: 26,
              borderRadius: 8,
              background: `${ACCENT}22`,
              color: ACCENT,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            🎯
          </span>
          <span style={{ color: '#f5f5f7', fontSize: 15, fontWeight: 700, letterSpacing: '-0.005em' }}>
            Filter by branch
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.14em',
              fontFamily: "'JetBrains Mono', monospace",
              color: ACCENT,
              background: `${ACCENT}1a`,
              border: `1px solid ${ACCENT}40`,
              padding: '3px 7px',
              borderRadius: 999,
            }}
          >
            MOST USED
          </span>
          <span style={{ color: '#9a9aa6', fontSize: 12.5 }}>
            {exam === 'jee'
              ? (pickedBucket
                  ? `${BRANCH_BUCKETS.find((b) => b.id === pickedBucket)?.short ?? ''}${pickedSpecific ? ` · ${pickedSpecific}` : ''}`
                  : 'pick a branch group — CS, Electronics, Mechanical …')
              : (pickedBranches[0]
                  ? `${pickedBranches[0]} only`
                  : 'pick one — CSE, ECE, Mechanical or any programme')}
          </span>
        </div>
        <span
          style={{
            color: '#9a9aa6',
            display: 'inline-flex',
            alignItems: 'center',
            transform: narrowOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }}
        >
          {Icons.caret('#9a9aa6')}
        </span>
      </button>
      {narrowOpen && (
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {exam === 'jee' ? (
            <>
              {/* JEE: branch BUCKETS (consolidate all naming variants into a few
                  groups so the long tail of branches is reachable without 150+
                  chips). Single-select; clears any drill-down on change. */}
              <div>
                <div style={BRANCH_LABEL_STYLE}>BRANCH GROUP — pick one</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {BRANCH_BUCKETS.map((bk) => {
                    const active = pickedBucket === bk.id;
                    return (
                      <button
                        key={bk.id}
                        type="button"
                        title={bk.title}
                        onClick={() => {
                          setPickedBucket((cur) => (cur === bk.id ? null : bk.id));
                          setPickedSpecific(null);
                        }}
                        style={branchChipStyle(active)}
                      >
                        {bk.short}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Optional drill-down to a specific branch within the chosen bucket. */}
              {pickedBucket && (BUCKET_DRILLDOWN[pickedBucket]?.length ?? 0) > 0 && (
                <div>
                  <div style={BRANCH_LABEL_STYLE}>NARROW DOWN — optional</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {BUCKET_DRILLDOWN[pickedBucket].map((d) => {
                      const active = pickedSpecific === d.match;
                      return (
                        <button
                          key={d.match}
                          type="button"
                          onClick={() => setPickedSpecific((cur) => (cur === d.match ? null : d.match))}
                          style={branchChipStyle(active)}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              <div style={BRANCH_LABEL_STYLE}>BRANCHES — pick one</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['CSE', 'ECE', 'EEE', 'Mechanical', 'Chemical', 'Biological', 'Pharmacy', 'Manufacturing'].map((b) => {
                  const active = pickedBranches.includes(b);
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setPickedBranches((arr) => (arr[0] === b ? [] : [b]))}
                      style={branchChipStyle(active)}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {/* Tier-1 restriction only applies to JEE — NIT/IIIT/GFTI carry an
              NIRF ranking to filter on. Every BITSAT result is a BITS campus,
              so the toggle is hidden on that tab rather than left as a no-op. */}
          {exam === 'jee' && (
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              color: '#cfcfd6',
              fontSize: 13.5,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                border: tierOnly ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.15)',
                background: tierOnly ? ACCENT : 'transparent',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              {tierOnly && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6 L5 9 L10 3"
                    stroke="#0a0a0f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <input
                type="checkbox"
                checked={tierOnly}
                onChange={(e) => setTierOnly(e.target.checked)}
                style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
              />
            </span>
            Only show Tier-1 colleges (top NITs · IIITs · BITS)
          </label>
          )}
        </div>
      )}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: '100px 8px 0' }}>
      <SectionHead
        eyebrow="STEP 02 · YOUR TURN"
        titlePlain="Tell us your rank."
        titleAccent="We'll do the rest."
        sub="Three steps. Sixty seconds. A college list backed by five years of counseling data."
      />
      <TrustRow />

      {/* 3 feature cards — hidden on mobile (the titles essentially restate
          what the tool does; on a narrow screen they pushed the actual form
          ~700px further down without adding information). Show from sm: up,
          where the 3-column layout makes them feel like a scannable summary. */}
      <div className="hidden sm:grid grid-cols-3 gap-[18px] mb-12">
        {FEATURES.map((f) => (
          <FeatureCard key={f.n} f={f} />
        ))}
      </div>

      {/* Exam selector — promoted from a small pill toggle to a two-card
          choice block. This IS the most important control on the page (it
          decides which predictor renders), so the visual weight earns its
          place. Active card uses the same amber gradient as the primary CTA
          so a user instantly maps "amber = current exam." Inactive card stays
          tappable with a visible "Switch →" hint. */}
      <div className="mb-6">
        <div
          className="text-center mb-3"
          style={{
            color: '#9a9aa6',
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.12em',
            fontWeight: 600,
          }}
        >
          WHICH EXAM ARE YOU APPLYING THROUGH?
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mx-auto" style={{ maxWidth: 760 }}>
          {([
            {
              id: 'jee' as const,
              label: 'JEE Main',
              sub: 'NITs, IIITs & GFTIs',
            },
            {
              id: 'bitsat' as const,
              label: 'BITSAT',
              sub: 'BITS Pilani, Goa & Hyderabad',
            },
          ]).map((t) => {
            const active = exam === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  // On a REAL tab switch, clear both the branch selection AND
                  // the previous exam's results. The chip sets differ between
                  // exams, and — more importantly — leaving the other exam's
                  // results/counts/sensitivity mounted under the new exam's
                  // labels renders a broken stale view ("top 0 programmes",
                  // "undefined/390" in the sensitivity chart) until a fresh
                  // predict runs. Guarded by the id check so hydration's setExam
                  // doesn't wipe a restored selection/results.
                  if (t.id !== exam) {
                    setPickedBranches([]);
                    setPickedBucket(null);
                    setPickedSpecific(null);
                    setJeeGroups(null);
                    setBitsatRows(null);
                    setSens(null);
                    setCounts(null);
                    setTotalCount(null);
                    setRankConversion(null);
                    setExtended(false);
                  }
                  setExam(t.id);
                }}
                aria-pressed={active}
                style={{
                  position: 'relative',
                  textAlign: 'left',
                  padding: '16px 22px',
                  borderRadius: 16,
                  cursor: 'pointer',
                  border: active
                    ? '1px solid rgba(245,158,11,0.5)'
                    : '1px solid rgba(255,255,255,0.08)',
                  background: active
                    ? `linear-gradient(180deg, ${ACCENT}, #f97316)`
                    : 'linear-gradient(180deg, rgba(20,22,34,0.6), rgba(12,13,22,0.65))',
                  color: active ? '#0a0a0f' : '#e7e7ea',
                  fontFamily: 'inherit',
                  boxShadow: active
                    ? `0 18px 40px -16px ${ACCENT}aa, 0 1px 0 rgba(255,255,255,0.3) inset`
                    : '0 1px 0 rgba(255,255,255,0.03) inset',
                  transition: 'transform 0.18s, border-color 0.18s, box-shadow 0.18s',
                }}
                onMouseEnter={(e) => {
                  if (active) return;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,158,11,0.35)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  if (active) return;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                }}
              >
                {/* Active dot + selected marker on the top-right */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: active ? '#0a0a0f' : 'rgba(255,255,255,0.2)',
                        boxShadow: active ? '0 0 0 3px rgba(0,0,0,0.15)' : 'none',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        fontSize: 22,
                        fontWeight: 700,
                        letterSpacing: '-0.025em',
                        lineHeight: 1,
                      }}
                    >
                      {t.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      fontFamily: "'JetBrains Mono', monospace",
                      color: active ? 'rgba(10,10,15,0.7)' : '#7d7d88',
                    }}
                  >
                    {active ? 'SELECTED' : 'SWITCH →'}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: active ? 'rgba(10,10,15,0.75)' : '#9a9aa6',
                    fontWeight: 500,
                    marginTop: 6,
                    letterSpacing: '-0.005em',
                  }}
                >
                  {t.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form panel — relaxed padding on mobile so we don't lose 72px of
          width to padding alone on a 390px screen. */}
      <div
        className="rounded-2xl p-5 md:p-9"
        style={{
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(20,22,34,0.7), rgba(12,13,22,0.85))',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 30px 80px -40px rgba(0,0,0,0.7)',
        }}
      >
        {/* Top label bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 26,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: ACCENT,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.16em',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {Icons.bolt(ACCENT)}
            {exam === 'jee' ? 'JEE MAIN · JoSAA 2026' : 'BITSAT · BITS 2026'}
          </span>
          <span
            style={{
              color: '#5e5e6a',
              fontSize: 11,
              letterSpacing: '0.08em',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {exam === 'jee'
              ? '5 yrs · 95 institutes · 1,200+ branches'
              : '9 yrs · 3 campuses · 18 programmes'}
          </span>
        </div>

        {exam === 'jee' ? (
          // Grid uses CSS `order` so on mobile (single column) the children
          // stack in DOM order — form fields, then filter-by-branch, then
          // ReturnsCard (matches UX feedback that the branch filter belongs
          // right under the home-state selector). On desktop, ReturnsCard
          // jumps to col 2 row 1 (order-2) and the filter spans both cols
          // below (order-last, col-span-2).
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Rank input lifted to the top of the form. On mobile especially,
                  asking a student to scroll past category + quota + state
                  selectors before they can type their rank felt backwards —
                  the rank is the one number that always has to be entered, so
                  it leads. Category / quota / state default to sensible values
                  (OPEN, Home State, UP) below, which the student can adjust
                  after they see what they're working with. */}
              <Seg
                label="RANK TYPE"
                value={rankType}
                onChange={setRankType}
                options={[
                  { value: 'CRL', label: 'CRL — Common Rank' },
                  { value: 'CAT', label: 'Category Rank' },
                ]}
              />
              <NumberWithSlider
                label="YOUR RANK"
                sublabel="out of ~1,500,000 candidates"
                value={rank}
                onChange={setRank}
                min={1}
                max={150000}
                suffix={rankType}
                ticks={[
                  { value: 1000, label: 'Top 1K' },
                  { value: 5000, label: 'Top 5K' },
                  { value: 15000, label: '15K' },
                  { value: 50000, label: '50K' },
                  { value: 100000, label: '1L+' },
                ]}
              />

              {/* Visual divider between the primary input (above) and the
                  refinement controls (below). Signals "you've entered the
                  must-have; everything below tunes the result." */}
              <div
                style={{
                  borderTop: '1px dashed rgba(255,255,255,0.08)',
                  margin: '2px 0 -2px',
                }}
              />

              <Seg
                label="CATEGORY"
                value={category}
                onChange={setCategory}
                options={[
                  { value: 'OPEN', label: 'OPEN' },
                  { value: 'EWS', label: 'EWS' },
                  { value: 'OBC-NCL', label: 'OBC-NCL' },
                  { value: 'SC', label: 'SC' },
                  { value: 'ST', label: 'ST' },
                ]}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
                <Seg
                  label="QUOTA"
                  value={quota}
                  onChange={setQuota}
                  options={[
                    { value: 'HS', label: 'Home State' },
                    { value: 'OS', label: 'Other State' },
                    { value: 'AI', label: 'All India' },
                  ]}
                />
                <Dropdown
                  label="HOME STATE"
                  value={homeState}
                  onChange={setHomeState}
                  options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
                />
              </div>
            </div>
            {/* Right column: branch filter, with the additional quotas stacked
                directly beneath it (one flex column, so the quotas sit flush
                under the filter regardless of the left form column's height).
                Frees the space the Safe/Target/Reach card used to take (those
                meanings now live in hover tooltips on the result chips). Stacks
                last on mobile. Quotas are JEE-only — BITS has no category quotas.
                  - Girls ON → gender = 'Female-only (incl. Supernumerary)'
                  - PwD ON   → category = '<base> (PwD)' */}
            <div
              className="lg:col-start-2 lg:row-start-1"
              style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
            >
              {narrowDownPanel}
              <div>
                <div
                style={{
                  color: '#9a9aa6',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: 10,
                }}
              >
                ADDITIONAL QUOTAS · OPTIONAL
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <QuotaToggle
                  label="Girls Quota"
                  sublabel="Female-only + Supernumerary seats"
                  active={isFemale}
                  onToggle={() => setIsFemale((v) => !v)}
                />
                <QuotaToggle
                  label="PwD Quota"
                  sublabel="Persons-with-Disability cutoffs"
                  active={isPwD}
                  onToggle={() => setIsPwD((v) => !v)}
                />
              </div>

              {/* PwD merit-list hint — JoSAA runs a separate ~10K-candidate PwD
                  merit list, so a CRL entered above can read as "0 colleges". */}
              {isPwD && (
                <div
                  role="note"
                  style={{
                    marginTop: 10,
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid rgba(125,211,252,0.25)',
                    background: 'rgba(125,211,252,0.06)',
                    color: '#a7d4f0',
                    fontSize: 12.5,
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: '#bce0f5' }}>PwD uses a separate merit list.</strong>{' '}
                  JoSAA&apos;s PwD pool is roughly 10,000 candidates, so PwD ranks are
                  on a different scale from CRL — typical PwD ranks are{' '}
                  <strong style={{ color: '#bce0f5' }}>under 5,000</strong>. If you
                  entered your CRL above, the predictor may return zero matches
                  because no PwD seat closes that high.
                </div>
              )}
              </div>
            </div>
          </div>
        ) : (
          // Same ordering trick as the JEE grid — see comment above.
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Score lifted above the paper-version selector for the same
                  reason as the JEE form — the marks input is the one number
                  the student always has to type, so it leads. The paper
                  version (modern / legacy) follows as a small refinement;
                  switching it re-clamps the score to the new max. */}
              <NumberWithSlider
                label="YOUR BITSAT SCORE"
                sublabel="enter total (no sectional split)"
                value={Math.min(score, maxScore)}
                onChange={setScore}
                min={0}
                max={maxScore}
                suffix={`/ ${maxScore}`}
                ticks={
                  paper === 'modern'
                    ? [
                        { value: 220, label: '≈ Goa cut' },
                        { value: 260, label: 'Hyd target' },
                        { value: 290, label: 'Pilani edge' },
                        { value: 320, label: 'Pilani CSE' },
                        { value: 350, label: '350+' },
                      ]
                    : [
                        { value: 280, label: 'Goa cut' },
                        { value: 320, label: 'Hyd target' },
                        { value: 350, label: 'Pilani edge' },
                        { value: 380, label: 'Pilani CSE' },
                        { value: 400, label: '400+' },
                      ]
                }
              />

              <div
                style={{
                  borderTop: '1px dashed rgba(255,255,255,0.08)',
                  margin: '2px 0 -2px',
                }}
              />

              <Seg
                label="PAPER VERSION"
                value={paper}
                onChange={(v) => {
                  setPaper(v);
                  // Re-clamp score to the new max when switching regimes.
                  setScore((s) => Math.min(s, v === 'modern' ? 390 : 450));
                }}
                options={[
                  { value: 'modern', label: 'Modern paper · 2022+ · max 390' },
                  { value: 'legacy', label: 'Legacy · ≤2021 · max 450' },
                ]}
              />
            </div>
            {/* Branch filter in the right column — see JEE grid comment above. */}
            <div className="lg:row-start-1 lg:col-start-2">
              {narrowDownPanel}
            </div>
          </div>
        )}

        {/* CTA */}
        <div
          style={{
            marginTop: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 18,
          }}
        >
          <div
            style={{
              color: '#7d7d88',
              fontSize: 12.5,
              fontFamily: "'JetBrains Mono', monospace",
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
              {exam === 'jee' ? 'JoSAA 2020–2024' : 'BITSAT 2017–2025'}
            </span>
            <span style={{ color: '#3a3a44' }}>·</span>
            <span>every result shows a confidence tag</span>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={exam === 'jee' ? submitJEE : submitBitsat}
            style={{
              position: 'relative',
              background: `linear-gradient(180deg, ${ACCENT}, #f97316)`,
              color: '#0a0a0f',
              border: 'none',
              borderRadius: 14,
              padding: '16px 28px',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '-0.005em',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: `0 14px 30px -10px ${ACCENT}99, 0 1px 0 rgba(255,255,255,0.3) inset`,
            }}
          >
            {loading ? 'Predicting…' : exam === 'jee' ? 'Predict my JEE colleges' : 'Predict my BITS programmes'}
            {!loading && Icons.arrow('#0a0a0f')}
          </button>
        </div>
      </div>

      {/* RESULTS SECTION */}
      {hasResults && (
        <div ref={resultsRef} style={{ marginTop: 100 }}>
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#9a9aa6',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.16em',
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT }} />
              STEP 03 · YOUR RESULTS
            </div>
            <h2
              style={{
                margin: '14px 0 6px',
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                fontSize: 'clamp(34px, 4vw, 50px)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: '#f5f5f7',
              }}
            >
              Here&apos;s where you stand.
            </h2>
            <p style={{ margin: 0, color: '#9a9aa6', fontSize: 15 }}>
              Ranked by chance, sorted by institute tier. Sparklines show the last 4 years&apos; closing trend.
            </p>

            {/* CRL → category-rank conversion banner. JoSAA closing-ranks for
                reserved categories are on a category-pool scale (e.g. "SC
                rank 1,081 at NIT Trichy CSE"), NOT CRL. When the user typed
                CRL + selected a reserved category, the API converted before
                matching. Showing it here so the user sees what the predictor
                actually compared their rank against. */}
            {rankConversion && (
              <div
                role="note"
                style={{
                  marginTop: 16,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 16px',
                  borderRadius: 12,
                  background: 'rgba(125,211,252,0.08)',
                  border: '1px solid rgba(125,211,252,0.25)',
                  color: '#bce0f5',
                  fontSize: 13,
                  lineHeight: 1.5,
                  textAlign: 'left',
                  maxWidth: 720,
                }}
              >
                <span aria-hidden style={{ fontSize: 16 }}>↻</span>
                <span>
                  You entered <strong>CRL {rankConversion.original.toLocaleString('en-IN')}</strong>. JoSAA stores{' '}
                  <strong>{rankConversion.category}</strong> closing-ranks on a category-pool scale,
                  so the predictor matched against an approximate{' '}
                  <strong>{rankConversion.category} rank ≈ {rankConversion.converted.toLocaleString('en-IN')}</strong>{' '}
                  (using the 2026 NTA share table). If you know your exact category rank, switch the toggle to{' '}
                  <em>Category Rank</em> and re-submit for higher precision.
                </span>
              </div>
            )}
          </div>

          {/* Header bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
              <h3
                style={{
                  margin: 0,
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#f5f5f7',
                }}
              >
                Your <span style={{ color: ACCENT }}>top {Math.min(visibleRows.length, 10)}</span>{' '}
                {exam === 'jee' ? 'colleges' : 'programmes'}
              </h3>
              <span
                style={{
                  color: '#7d7d88',
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                · {totalCount ?? 0} {exam === 'jee' ? 'colleges' : 'programmes'} matched ·{' '}
                {exam === 'jee'
                  ? `${rankType} ${rank.toLocaleString('en-IN')}`
                  : `BITSAT ${score}/${maxScore}`}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <AudienceToggle value={audience} onChange={setAudience} />
              {/* Bucket filter chips */}
              <div style={{ display: 'flex', gap: 6 }}>
                {(['SAFE', 'TARGET', 'REACH'] as const).map((k) => {
                  const lower = k.toLowerCase() as 'safe' | 'target' | 'reach';
                  const p = BUCKET_COLOR[k];
                  const active = filter === lower;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setFilter(active ? 'all' : lower)}
                      title={BUCKET_DEFINITIONS[k]}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 999,
                        border: `1px solid ${p.border}`,
                        background: active ? p.bg : 'rgba(255,255,255,0.02)',
                        color: p.fg,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.15s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 7,
                      }}
                    >
                      <span style={{ textTransform: 'capitalize' }}>{k.toLowerCase()}</span>
                      <span style={{ color: '#7d7d88', fontSize: 11 }}>·</span>
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{counts?.[lower] ?? 0}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visibleRows.map((r) => (
              <ResultRow key={`${r.rank}-${r.inst}-${r.programme}`} r={r} audience={audience} userScore={score} />
            ))}
            {visibleRows.length === 0 && (
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  borderRadius: 16,
                  border: '1px dashed rgba(255,255,255,0.1)',
                  color: '#7d7d88',
                  fontSize: 14,
                }}
              >
                No matches with the current filter. Try removing the bucket filter or widening branches.
              </div>
            )}
          </div>

          {/* Pagination — 10 rows per page. Replaces the prior "Show all N"
              button + post-load "All shown" footer, which dumped up to 100
              rows into one scroll-forever page. Next/Prev sit alongside a
              page-number strip; on the boundary where local rows run out but
              totalCount says there's more, goToPage transparently triggers
              the extended fetch before advancing. */}
          {filteredRows.length > 0 && totalPages > 1 && (
            <Pager
              pageIndex={safePageIndex}
              totalPages={totalPages}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              total={
                !extended && filteredTotal > filteredRows.length
                  ? filteredTotal
                  : filteredRows.length
              }
              unit={exam === 'jee' ? 'colleges' : 'programmes'}
              loadingMore={loadingMore}
              onGo={goToPage}
              accent={ACCENT}
              capNote={
                extended && (totalCount ?? 0) >= 100
                  ? 'capped at 100 by the predictor'
                  : undefined
              }
            />
          )}

          {/* Sensitivity chart */}
          {sens && sens.length > 0 && (
            <SensitivityChart
              exam={exam}
              points={sens}
              userValue={exam === 'jee' ? rank : score}
              maxScore={maxScore}
            />
          )}

          {/* Share row + career-guide pointer. Two stacked panels: the
              primary share + smart-list panel above, and a quieter pointer
              to the editorial Career Guide below. We surface career briefs
              here because predicting WHICH college is only half of the
              question — the other half is what those colleges actually lead
              to. The link is static (no per-branch matching) in V1; smarter
              branch-aware suggestions land once we have more than 3 specs. */}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                padding: '18px 22px',
                borderRadius: 14,
                background: 'linear-gradient(180deg, rgba(20,22,34,0.4), rgba(12,13,22,0.55))',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 14,
              }}
            >
              <div style={{ color: '#cfcfd6', fontSize: 14 }}>
                Share a link with parents, or send them an image summary for WhatsApp.
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href).catch(() => {});
                    }
                  }}
                  style={{
                    padding: '9px 16px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e7e7ea',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Share link
                </button>
                {exam === 'jee' && (
                  <ShareCardButton
                    params={{
                      tool: 'jeemain',
                      rank,
                      rank_type: rankType,
                      category: effectiveCategory,
                      gender: effectiveGender,
                      home_state: homeState,
                    }}
                  />
                )}
                {exam === 'bitsat' && (
                  <ShareCardButton
                    params={{ tool: 'bitsat', score, regime: paper }}
                  />
                )}
                {exam === 'jee' && (
                  <button
                    type="button"
                    onClick={() => setShowBuilder(true)}
                    style={{
                      padding: '9px 16px',
                      borderRadius: 999,
                      background: `linear-gradient(180deg, ${ACCENT}, #f97316)`,
                      border: 'none',
                      color: '#0a0a0f',
                      fontFamily: 'inherit',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Build smart list →
                  </button>
                )}
              </div>
            </div>

            {/* Career-guide pointer — branch-aware. When the student's matched
                Safe + Target branches map to careers we have published specs
                for (currently SWE + ML for CS-family branches), surface those
                directly as small cards. Otherwise fall back to a generic link
                to the index. The fallback is honest — we don't fake a match. */}
            {suggestedCareerSlugs.length > 0 ? (
              <div
                style={{
                  padding: '20px 22px',
                  borderRadius: 14,
                  background: 'linear-gradient(180deg, rgba(20,22,34,0.4), rgba(12,13,22,0.55))',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderLeft: '2px solid #c4b5fd',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ color: '#cfcfd6', fontSize: 14, lineHeight: 1.5 }}>
                    <span style={{ color: '#f5f5f7', fontWeight: 600 }}>What your matched branches actually lead to</span>
                    <br />
                    <span style={{ color: '#9a9aa6', fontSize: 13 }}>
                      Based on the branches you matched — here are the careers worth investigating before you finalise your choice list.
                    </span>
                  </div>
                  <a
                    href="/career-guide"
                    style={{
                      padding: '7px 14px',
                      borderRadius: 999,
                      background: 'rgba(196,181,253,0.08)',
                      border: '1px solid rgba(196,181,253,0.25)',
                      color: '#ddd6fe',
                      fontFamily: 'inherit',
                      fontSize: 12,
                      fontWeight: 600,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    All career briefs →
                  </a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                  {suggestedCareerSlugs.map((slug) => {
                    const s = CAREER_SUGGESTIONS[slug];
                    if (!s) return null;
                    return (
                      <a
                        key={slug}
                        href={`/career-guide/${slug}`}
                        style={{
                          padding: '14px 16px',
                          borderRadius: 12,
                          background: 'rgba(0,0,0,0.25)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          textDecoration: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                          transition: 'border-color 0.15s, background 0.15s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
                          <span style={{ color: '#f5f5f7', fontWeight: 600, fontSize: 13.5, letterSpacing: '-0.005em' }}>{s.title}</span>
                          <span style={{ color: '#5e5e6a', fontSize: 12 }}>→</span>
                        </div>
                        <span style={{ color: '#9a9aa6', fontSize: 12, lineHeight: 1.5 }}>{s.blurb}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: '16px 22px',
                  borderRadius: 14,
                  background: 'linear-gradient(180deg, rgba(20,22,34,0.3), rgba(12,13,22,0.45))',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderLeft: '2px solid #c4b5fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 14,
                }}
              >
                <div style={{ color: '#cfcfd6', fontSize: 14, lineHeight: 1.5 }}>
                  <span style={{ color: '#f5f5f7', fontWeight: 600 }}>Wondering what these colleges actually lead to?</span>
                  <br />
                  <span style={{ color: '#9a9aa6', fontSize: 13 }}>
                    Honest career briefs — what each career is in 2026, income distributions, AI risk over 10 years.
                  </span>
                </div>
                <a
                  href="/career-guide"
                  style={{
                    padding: '9px 16px',
                    borderRadius: 999,
                    background: 'rgba(196,181,253,0.1)',
                    border: '1px solid rgba(196,181,253,0.3)',
                    color: '#ddd6fe',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  See career briefs →
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {exam === 'jee' && (
        <ChoiceListBuilder
          open={showBuilder}
          onClose={() => setShowBuilder(false)}
          baseInputs={{
            rank,
            rank_type: rankType,
            category: effectiveCategory,
            gender: effectiveGender,
            home_state: homeState,
          }}
        />
      )}
    </section>
  );
}

// ── ResultRow — the new vertical-accent / sparkline / delta design ──────────
function ResultRow({
  r,
  audience,
  userScore,
}: {
  r: DisplayRow;
  audience: 'student' | 'parent';
  userScore: number;
}) {
  const palette = BUCKET_COLOR[r.bucket.toUpperCase() as 'SAFE' | 'TARGET' | 'REACH'] ?? BUCKET_COLOR.TARGET;
  // For BITSAT, delta is precomputed against the user's score.
  const showDelta = r.delta !== undefined;
  const clickable = !!r.href;
  // Polymorphic root — Link when we have a deep-dive URL, plain div otherwise.
  // Using `as` here keeps the JSX tree single-rooted; the Link variant gets the
  // href prop, the div ignores it.
  const Tag = (clickable ? Link : 'div') as 'div';
  const linkProps: { href?: string; prefetch?: boolean } = clickable ? { href: r.href, prefetch: false } : {};
  return (
    <Tag
      {...linkProps}
      // Mobile-compact result card. Below sm: tighter padding, smaller rank
      // column, no sparkline (hidden on mobile to reclaim height — scrolling
      // 10 college cards on a 390px screen was the UX complaint), smaller
      // chance % and programme fonts. From sm: up the original spacing
      // returns. The vertical accent stripe + grid layout stay structurally
      // identical so the change is purely a density tweak.
      className="grid items-center gap-3 sm:gap-[18px] py-3 px-3 sm:py-4 sm:pl-[22px] sm:pr-[22px] grid-cols-[26px_1fr_auto] sm:grid-cols-[44px_1fr_auto]"
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(20,22,34,0.55), rgba(12,13,22,0.7))',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 14,
        transition: 'transform 0.2s, border-color 0.2s, background 0.2s',
        cursor: clickable ? 'pointer' : 'default',
        textDecoration: 'none',
        color: 'inherit',
      }}
      onMouseEnter={(e) => {
        if (!clickable) return;
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateX(2px)';
      }}
      onMouseLeave={(e) => {
        if (!clickable) return;
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.05)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 10,
          bottom: 10,
          width: 2,
          background: palette.fg,
          opacity: 0.5,
          borderRadius: '0 2px 2px 0',
        }}
      />
      <div
        className="text-[11px] sm:text-[12px]"
        style={{
          color: '#5e5e6a',
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 500,
          letterSpacing: '0.04em',
        }}
      >
        #{r.rank}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            className="text-[14.5px] sm:text-[17px]"
            style={{
              color: '#f5f5f7',
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontWeight: 600,
              letterSpacing: '-0.012em',
              lineHeight: 1.2,
            }}
          >
            {r.programme}
          </span>
          <span
            title={BUCKET_DEFINITIONS[r.bucket.toUpperCase() as 'SAFE' | 'TARGET' | 'REACH']}
            style={{
              padding: '2px 6px',
              borderRadius: 5,
              border: `1px solid ${palette.border}`,
              background: palette.bg,
              color: palette.fg,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.16em',
              cursor: 'help',
            }}
          >
            {r.bucket.toUpperCase()}
          </span>
        </div>
        <div
          className="text-[11.5px] sm:text-[12.5px]"
          style={{
            marginTop: 4,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 6,
            color: '#7d7d88',
            lineHeight: 1.35,
          }}
        >
          <span style={{ color: '#cfcfd6', fontWeight: 500 }}>{r.inst}</span>
          <Sep />
          <span>{r.state}</span>
          {r.nirf && (
            <>
              <Sep />
              <span>NIRF #{r.nirf}</span>
            </>
          )}
          <Sep />
          {audience === 'student' ? (
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Projected close{' '}
              <span style={{ color: '#cfcfd6', fontWeight: 600 }}>{r.close.toLocaleString('en-IN')}</span>
              <span style={{ color: '#3a3a44' }}>{r.closeUnit}</span>
              {showDelta && r.delta !== undefined && (
                <span
                  style={{
                    color: r.delta < 0 ? '#34d399' : '#fb923c',
                    marginLeft: 6,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {r.delta < 0 ? `${r.delta}` : `+${r.delta}`}
                </span>
              )}
            </span>
          ) : (
            <span>
              <span style={{ color: '#cfcfd6', fontWeight: 600 }}>{chanceToWords(r.pct)}</span> of getting in
            </span>
          )}
          <Sep />
          <ConfidenceDots level={r.conf} />
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-[18px]">
        {/* Sparkline is decorative — hidden on mobile to save vertical space
            (each row otherwise eats ~110px even before the metadata wraps). */}
        <div className="hidden sm:block">
          <Sparkline data={r.trend} />
        </div>
        <div className="text-right min-w-[44px] sm:min-w-[64px]">
          <div
            className="text-[20px] sm:text-[26px]"
            style={{
              color: ACCENT,
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {r.pct}%
          </div>
          <div
            className="text-[9px] sm:text-[10px] mt-[2px] sm:mt-1"
            style={{ color: '#5e5e6a', letterSpacing: '0.14em', fontWeight: 600 }}
          >
            CHANCE
          </div>
        </div>
        {clickable && (
          <span
            aria-hidden
            className="hidden sm:inline"
            style={{
              color: '#5e5e6a',
              fontSize: 14,
              marginLeft: 4,
              transition: 'color 0.15s',
            }}
          >
            ›
          </span>
        )}
      </div>
    </Tag>
  );
}

function Sep() {
  return <span style={{ color: '#3a3a44' }}>·</span>;
}

// ── Pager — 10-rows-per-page pagination control ────────────────────────────
// Compact, dark-theme paginator used at the bottom of the results list. The
// page-number strip uses the standard 1 … 4 [5] 6 … N compression so we stay
// at ≤7 buttons even when there are 10 pages. The "boundary" Next press is
// handled by the parent's onGo — when the cached rows run out but more
// exist on the server, onGo fetches and then advances.
function Pager({
  pageIndex,
  totalPages,
  rangeStart,
  rangeEnd,
  total,
  unit,
  loadingMore,
  onGo,
  accent,
  capNote,
}: {
  pageIndex: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  total: number;
  unit: 'colleges' | 'programmes';
  loadingMore: boolean;
  onGo: (target: number) => void;
  accent: string;
  capNote?: string;
}) {
  // Build the compressed page-number sequence.
  // - Always show 1 and totalPages.
  // - Show current ± 1.
  // - Insert an ellipsis when the gap is > 1.
  const items: (number | 'ellipsis')[] = [];
  const current = pageIndex;
  const pushedSet = new Set<number>();
  function pushPage(p: number) {
    if (p < 0 || p >= totalPages || pushedSet.has(p)) return;
    pushedSet.add(p);
    items.push(p);
  }
  const ordered = [0, current - 1, current, current + 1, totalPages - 1].filter(
    (p) => p >= 0 && p < totalPages,
  );
  const unique = Array.from(new Set(ordered)).sort((a, b) => a - b);
  let prev = -1;
  for (const p of unique) {
    if (prev !== -1 && p - prev > 1) items.push('ellipsis');
    pushPage(p);
    prev = p;
  }

  const baseBtn: React.CSSProperties = {
    minWidth: 36,
    height: 36,
    padding: '0 10px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    color: '#cfcfd6',
    fontFamily: 'inherit',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'all 0.15s',
  };
  const activeBtn: React.CSSProperties = {
    ...baseBtn,
    background: accent,
    color: '#0a0a0f',
    border: `1px solid ${accent}`,
  };
  const disabledBtn: React.CSSProperties = {
    ...baseBtn,
    opacity: 0.4,
    cursor: 'not-allowed',
  };

  const prevDisabled = pageIndex === 0 || loadingMore;
  const nextDisabled = pageIndex >= totalPages - 1 || loadingMore;

  return (
    <div
      style={{
        marginTop: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          color: '#9a9aa6',
          fontSize: 12.5,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.04em',
        }}
      >
        Showing <span style={{ color: '#f5f5f7', fontWeight: 600 }}>{rangeStart}–{rangeEnd}</span>{' '}
        of <span style={{ color: '#f5f5f7', fontWeight: 600 }}>{total}</span> {unit}
        {capNote && <span style={{ color: '#5e5e6a' }}> · {capNote}</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => onGo(pageIndex - 1)}
          disabled={prevDisabled}
          style={prevDisabled ? disabledBtn : baseBtn}
          aria-label="Previous page"
        >
          ← Prev
        </button>
        {items.map((it, i) =>
          it === 'ellipsis' ? (
            <span
              key={`e-${i}`}
              style={{ color: '#5e5e6a', padding: '0 4px', fontSize: 13 }}
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={it}
              type="button"
              onClick={() => onGo(it)}
              disabled={loadingMore}
              style={it === pageIndex ? activeBtn : baseBtn}
              aria-current={it === pageIndex ? 'page' : undefined}
              aria-label={`Page ${it + 1}`}
            >
              {it + 1}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onGo(pageIndex + 1)}
          disabled={nextDisabled}
          style={nextDisabled ? disabledBtn : baseBtn}
          aria-label="Next page"
        >
          {loadingMore ? 'Loading…' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

// ── Sensitivity chart — stacked bars across score/rank band ─────────────────
function SensitivityChart({
  exam,
  points,
  userValue,
  maxScore,
}: {
  exam: Exam;
  points: SensRow[];
  userValue: number;
  maxScore: number;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const userIdx = useMemo(() => {
    const idx = points.findIndex((p) => (exam === 'jee' ? p.rank === userValue : p.score === userValue));
    return idx >= 0 ? idx : Math.floor(points.length / 2);
  }, [exam, points, userValue]);

  const activeIdx = hover ?? userIdx;
  const sel = points[activeIdx];
  const current = points[userIdx];

  // ── DELTA-FROM-YOU chart ─────────────────────────────────────────────────
  // The chart's headline asks "what does a different rank buy you?". The
  // honest answer is the *delta* against the user's current rank — not the
  // absolute Safe/Target/Reach stack, which is dominated by Safe and looks
  // visually flat (the bug a user reported: 9 nearly-identical green bars).
  //
  // Each bar shows: gained Safe colleges (above the axis, green) or lost
  // Safe colleges (below the axis, pink). YOU's bar sits flat at the axis.
  // Magnitudes are clamped to a small minimum (3 px) when non-zero so a +1
  // delta is still visible — otherwise tiny but real swings disappear.
  const youSafe = current?.safe ?? 0;
  const safeDeltas = points.map((p) => p.safe - youSafe);
  const maxAbsDelta = Math.max(...safeDeltas.map(Math.abs), 1);
  // Flat-band heuristic: if the whole sweep moves fewer than 5 Safe colleges
  // in either direction, the band genuinely doesn't matter and we say so.
  const isFlat = maxAbsDelta < 5;
  // Half-height: each direction (gain/loss) gets this much room, axis in middle.
  // Within each half, the bar itself is capped at `halfBarHeight - labelGutter`
  // so the absolute-positioned numeric label (rendered just above/below the bar
  // tip) doesn't bleed into the subtitle paragraph above or the tier-mix strip
  // below. Previously when a bar hit max height (e.g. +46, −52 at the sweep
  // extremes) its label visually collided with adjacent text.
  const halfBarHeight = 130;
  const labelGutter = 22;
  const maxBarFill = halfBarHeight - labelGutter;
  const barMaxHeight = halfBarHeight * 2; // total vertical room for bars

  const delta = sel
    ? exam === 'jee'
      ? (sel.rank ?? 0) - userValue
      : (sel.score ?? 0) - userValue
    : 0;
  const safeDelta = sel ? sel.safe - youSafe : 0;

  return (
    <div
      style={{
        marginTop: 64,
        padding: '32px 36px 30px',
        borderRadius: 22,
        background: 'linear-gradient(180deg, rgba(20,22,34,0.55), rgba(12,13,22,0.7))',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h3
          style={{
            margin: 0,
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#f5f5f7',
          }}
        >
          What does a <span style={{ color: ACCENT }}>different {exam === 'jee' ? 'rank' : 'score'}</span>{' '}
          buy you?
        </h3>
        <span
          style={{
            color: '#5e5e6a',
            fontSize: 11.5,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.06em',
          }}
        >
          {exam === 'jee' ? 'JEE Main CRL · lower is better' : `BITSAT score · max ${maxScore}`}
        </span>
      </div>
      <p style={{ margin: '8px 0 0', maxWidth: 720, color: '#9a9aa6', fontSize: 13.5, lineHeight: 1.55 }}>
        Each bar shows the <span style={{ color: '#e7e7ea', fontWeight: 600 }}>change in Safe {exam === 'jee' ? 'branches' : 'programmes'}</span>{' '}
        (a branch = one course at one college) vs your current. <span style={{ color: '#34d399', fontWeight: 600 }}>Green up</span> ={' '}
        {exam === 'jee' ? 'branches' : 'programmes'} you&apos;d gain,{' '}
        <span style={{ color: '#fb7185', fontWeight: 600 }}>pink down</span> = {exam === 'jee' ? 'branches' : 'programmes'} you&apos;d
        lose. The tiny purple-blue-grey strip below each bar shows the tier mix of the Safe pool there. Hover
        any bar for the specific {exam === 'jee' ? 'branches' : 'programmes'} that unlock.
      </p>

      {/* (c) Flat-banner — when bar variation is small, the chart is honestly
          uninformative. Say so explicitly instead of pretending bar heights
          mean something. */}
      {isFlat && (
        <div
          style={{
            marginTop: 18,
            padding: '14px 18px',
            borderRadius: 12,
            background: 'rgba(56,189,248,0.06)',
            border: '1px solid rgba(125,211,252,0.25)',
            color: '#bae6fd',
            fontSize: 13,
            lineHeight: 1.55,
          }}
        >
          <span style={{ fontWeight: 700, color: '#7dd3fc', letterSpacing: '0.02em' }}>
            Your option set is essentially stable across this {exam === 'jee' ? 'rank' : 'score'} band.
          </span>{' '}
          The biggest swing is just {maxAbsDelta} Safe {exam === 'jee' ? 'branches' : 'programmes'} — a tiny
          fraction of your option set. At your level, focus on{' '}
          <em style={{ fontStyle: 'normal', color: '#e7e7ea' }}>which</em> options to pick — chasing a few
          more {exam === 'jee' ? 'ranks' : 'marks'} won&apos;t unlock meaningfully new {exam === 'jee' ? 'branches' : 'programmes'}.
        </div>
      )}

      {/* Delta bars — bars sit symmetric around a center axis. Above = gained
          Safe colleges vs YOU. Below = lost. Bar magnitude is scaled to the
          largest |delta| in the sweep so the most informative bar uses the
          full available height. Non-zero deltas get a 3px floor so a +1 still
          renders as a visible sliver instead of disappearing. */}
      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `repeat(${points.length}, minmax(60px, 1fr))`,
          gap: 10,
          marginTop: 28,
          height: barMaxHeight + 90,
          overflowX: 'auto',
        }}
      >
        {/* Center axis line — sits at the middle of the bar area. Drawn as a
            single absolutely-positioned element spanning all columns so the
            visual zero line is consistent across the chart. */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: halfBarHeight,
            height: 1,
            background: 'rgba(255,255,255,0.12)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {points.map((p, i) => {
          const sd = safeDeltas[i];
          const isYou = i === userIdx;
          const isHover = i === activeIdx;
          // Bar magnitude scaled to the sweep's max |delta|, capped at
          // maxBarFill (= halfBarHeight - labelGutter) so the label that
          // sits above/below the bar tip stays inside its half-container.
          // Min 3px when non-zero so small swings are still visible.
          const rawH = (Math.abs(sd) / maxAbsDelta) * maxBarFill;
          const barH = sd === 0 ? 0 : Math.max(rawH, 3);
          const labelValue = exam === 'jee' ? (p.rank ?? 0).toLocaleString('en-IN') : (p.score ?? 0);
          const tierMix = p.tier_mix;
          const deltaLabel = sd === 0 ? (isYou ? '±0' : '0') : sd > 0 ? `+${sd}` : `${sd}`;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setHover(i)}
              onMouseEnter={() => setHover(i)}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
                height: barMaxHeight + 90,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 1,
              }}
            >
              {/* Top half — gained colleges (positive delta). Reserve the
                  full half-height so the axis line stays at a fixed position
                  across all columns regardless of which bar gets the tallest
                  swing. */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 78,
                  height: halfBarHeight,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {/* Above-axis numeric label — visible only when there's a
                    positive delta so we don't litter the axis with zeros. */}
                {sd > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: barH + 4,
                      color: isHover ? '#a7f3d0' : '#34d399',
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontVariantNumeric: 'tabular-nums',
                      transition: 'color 0.15s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {deltaLabel}
                  </span>
                )}
                {sd > 0 && (
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 78,
                      height: barH,
                      borderRadius: '6px 6px 0 0',
                      background: isHover
                        ? 'linear-gradient(180deg, #34d399, #10b981)'
                        : 'rgba(16,185,129,0.55)',
                      outline: isHover ? `2px solid ${ACCENT}` : 'none',
                      outlineOffset: 2,
                      transition: 'background 0.15s, outline 0.15s',
                    }}
                  />
                )}
              </div>
              {/* Bottom half — lost colleges (negative delta). The mirror of
                  the top half, growing downward from the axis. */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 78,
                  height: halfBarHeight,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {sd < 0 && (
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 78,
                      height: barH,
                      borderRadius: '0 0 6px 6px',
                      background: isHover
                        ? 'linear-gradient(180deg, #fb7185, #e11d48)'
                        : 'rgba(244,63,94,0.55)',
                      outline: isHover ? `2px solid ${ACCENT}` : 'none',
                      outlineOffset: 2,
                      transition: 'background 0.15s, outline 0.15s',
                    }}
                  />
                )}
                {sd < 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: barH + 4,
                      color: isHover ? '#fecdd3' : '#fb7185',
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontVariantNumeric: 'tabular-nums',
                      transition: 'color 0.15s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {deltaLabel}
                  </span>
                )}
                {sd === 0 && isYou && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 6,
                      color: ACCENT,
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: '0.06em',
                    }}
                  >
                    ±0
                  </span>
                )}
              </div>
              {/* Tier-mix indicator — composition of the Safe pool at this
                  bar (absolute, not delta). Lets the eye still sense "is the
                  Safe pool here mostly prestigious?" alongside the delta. */}
              {tierMix && (tierMix.T1 + tierMix.T2 + tierMix.T3 > 0) && (
                <div
                  style={{
                    marginTop: 8,
                    display: 'flex',
                    width: '100%',
                    maxWidth: 78,
                    height: 4,
                    borderRadius: 2,
                    overflow: 'hidden',
                    opacity: isHover ? 1 : 0.55,
                    transition: 'opacity 0.15s',
                  }}
                  title={`Safe-pool tier mix here: ${tierMix.T1} top + ${tierMix.T2} solid + ${tierMix.T3} other`}
                >
                  {(() => {
                    const total = tierMix.T1 + tierMix.T2 + tierMix.T3;
                    return (
                      <>
                        <span style={{ flex: tierMix.T1 / total, background: '#c4b5fd' }} />
                        <span style={{ flex: tierMix.T2 / total, background: '#60a5fa' }} />
                        <span style={{ flex: tierMix.T3 / total, background: 'rgba(255,255,255,0.2)' }} />
                      </>
                    );
                  })()}
                </div>
              )}
              {/* x-axis label — the rank/score at this point, plus a YOU
                  marker on the user's actual bar. */}
              <span
                style={{
                  marginTop: 10,
                  color: isYou ? ACCENT : isHover ? '#cfcfd6' : '#7d7d88',
                  fontSize: 13,
                  fontWeight: isYou ? 700 : 500,
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.02em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {labelValue}
              </span>
              {isYou && (
                <span style={{ marginTop: 4, color: ACCENT, fontSize: 9, fontWeight: 800, letterSpacing: '0.2em' }}>
                  YOU
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 18, marginTop: 22, flexWrap: 'wrap' }}>
        {[
          { k: 'GAIN', color: '#34d399', label: `${exam === 'jee' ? 'Branches' : 'Programmes'} you'd gain` },
          { k: 'LOSE', color: '#fb7185', label: `${exam === 'jee' ? 'Branches' : 'Programmes'} you'd lose` },
          { k: 'TIER', color: '#c4b5fd', label: 'Safe-pool tier mix (T1·T2·T3)' },
        ].map((l) => (
          <span
            key={l.k}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#9a9aa6', fontSize: 12.5 }}
          >
            <span style={{ width: 9, height: 9, borderRadius: 2, background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>

      <div
        style={{
          marginTop: 18,
          padding: '16px 20px',
          borderRadius: 12,
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderLeft: `2px solid ${ACCENT}`,
        }}
      >
        <div style={{ color: '#e7e7ea', fontSize: 14, lineHeight: 1.55 }}>
          {delta === 0 ? (
            <>
              This is <span style={{ color: ACCENT, fontWeight: 700 }}>your current {exam === 'jee' ? 'rank' : 'score'}</span>.{' '}
              <span style={{ color: '#34d399', fontWeight: 700 }}>{sel?.safe ?? 0} Safe</span> ·{' '}
              <span style={{ color: '#fbbf24', fontWeight: 700 }}>{sel?.target ?? 0} Target</span> ·{' '}
              <span style={{ color: '#7dd3fc', fontWeight: 700 }}>{sel?.reach ?? 0} Reach</span>{' '}
              <span style={{ color: '#7d7d88' }}>{exam === 'jee' ? 'branches' : 'programmes'}.</span>
            </>
          ) : (
            <>
              If your {exam === 'jee' ? 'rank were' : 'score were'}{' '}
              <span style={{ color: ACCENT, fontWeight: 700 }}>
                {exam === 'jee'
                  ? `${(sel?.rank ?? 0).toLocaleString('en-IN')} CRL`
                  : `${sel?.score}/${maxScore}`}
              </span>
              : <span style={{ color: '#34d399', fontWeight: 700 }}>{sel?.safe ?? 0} Safe</span> ·{' '}
              <span style={{ color: '#fbbf24', fontWeight: 700 }}>{sel?.target ?? 0} Target</span> ·{' '}
              <span style={{ color: '#7dd3fc', fontWeight: 700 }}>{sel?.reach ?? 0} Reach</span>{' '}
              <span style={{ color: '#7d7d88' }}>
                {exam === 'jee' ? 'branches' : 'programmes'} ({safeDelta > 0 ? `+${safeDelta}` : safeDelta} Safe vs your current)
              </span>
            </>
          )}
        </div>
        {delta !== 0 && (
          <div style={{ marginTop: 6, color: safeDelta < 0 ? '#fb7185' : '#34d399', fontSize: 13, fontWeight: 600 }}>
            {safeDelta < 0 ? (
              <>
                You&apos;d lose:{' '}
                <span style={{ fontWeight: 700 }}>
                  {Math.abs(safeDelta)} Safe {exam === 'jee' ? 'branches' : 'programmes'}
                </span>
                {' '}— a reminder of what your current {exam === 'jee' ? 'rank' : 'score'} has already earned you.
              </>
            ) : (
              <>
                You&apos;d unlock:{' '}
                <span style={{ fontWeight: 700 }}>
                  {safeDelta} more Safe {exam === 'jee' ? 'branches' : 'programmes'}
                </span>
                .
              </>
            )}
          </div>
        )}
      </div>

      {/* (a) Unlocks list — the specific colleges that become Safe at the
          hovered bar. This is the chart's actual deliverable: not "more
          options" but WHICH options. Sorted by NIRF on the server so the
          headline names appear first. */}
      {sel?.newly_safe && sel.newly_safe.length > 0 && delta !== 0 && (
        <div
          style={{
            marginTop: 18,
            padding: '18px 22px',
            borderRadius: 12,
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                color: '#5e5e6a',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.18em',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              WHAT UNLOCKS AT{' '}
              {exam === 'jee'
                ? `CRL ${(sel.rank ?? 0).toLocaleString('en-IN')}`
                : `${sel.score}/${maxScore}`}
            </div>
            <span style={{ color: '#7d7d88', fontSize: 11.5 }}>
              {sel.newly_safe.length} new Safe{' '}
              {exam === 'jee'
                ? sel.newly_safe.length === 1 ? 'branch' : 'branches'
                : sel.newly_safe.length === 1 ? 'programme' : 'programmes'}
              {' '}vs your current — top {Math.min(6, sel.newly_safe.length)} shown
            </span>
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
            {sel.newly_safe.slice(0, 6).map((u, i) => (
              <li
                key={`${u.title}-${u.subtitle}-${i}`}
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'baseline',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <span style={{ color: '#34d399', fontSize: 9, marginTop: 2 }}>●</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ color: '#e7e7ea', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
                    {u.title}
                  </div>
                  <div
                    style={{
                      color: '#7d7d88',
                      fontSize: 11.5,
                      lineHeight: 1.3,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {u.subtitle}
                    {u.nirf !== undefined && (
                      <span style={{ color: '#5e5e6a' }}> · NIRF #{u.nirf}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Honest empty-state — if the hovered bar adds nothing new, say so
          instead of leaving the panel blank. Happens when the user hovers a
          worse-than-current rank (everything was already in the option set). */}
      {sel?.newly_safe && sel.newly_safe.length === 0 && delta !== 0 && delta < 0 === (exam === 'jee') && (
        <div
          style={{
            marginTop: 18,
            padding: '14px 18px',
            borderRadius: 12,
            background: 'rgba(0,0,0,0.2)',
            border: '1px dashed rgba(255,255,255,0.08)',
            color: '#7d7d88',
            fontSize: 12.5,
          }}
        >
          No new {exam === 'jee' ? 'branches' : 'programmes'} become Safe at this {exam === 'jee' ? 'rank' : 'score'} compared with your current — the {exam === 'jee' ? 'colleges' : 'programmes'} are the same set, just with shifted bucket assignments.
        </div>
      )}

      <div
        style={{
          marginTop: 14,
          color: '#5e5e6a',
          fontSize: 11.5,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        hover any bar · bar height = number of Safe {exam === 'jee' ? 'branches' : 'programmes'} you&apos;d gain or lose vs your current
      </div>
    </div>
  );
}

// ── QuotaToggle ──────────────────────────────────────────────────────────────
// On/off pill used for the Girls Quota + PwD Quota controls in the JEE form.
// Same visual language as the Seg chips above so the row feels native, but
// state is boolean (toggle) rather than mutually-exclusive (pick-one).
function QuotaToggle({
  label,
  sublabel,
  active,
  onToggle,
}: {
  label: string;
  sublabel: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      style={{
        textAlign: 'left',
        padding: '10px 14px',
        borderRadius: 10,
        border: active
          ? '1px solid rgba(245,158,11,0.5)'
          : '1px solid rgba(255,255,255,0.08)',
        background: active ? 'rgba(245,158,11,0.10)' : 'rgba(255,255,255,0.02)',
        color: active ? '#fbbf24' : '#cfcfd6',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'border-color 0.18s, background 0.18s, color 0.18s',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 200,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 13.5 }}>
        <span
          style={{
            display: 'inline-block',
            width: 14,
            height: 14,
            borderRadius: 4,
            background: active ? '#fbbf24' : 'transparent',
            border: active ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.2)',
            position: 'relative',
          }}
        >
          {active && (
            <span
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(45deg)',
                width: 4,
                height: 8,
                borderRight: '2px solid #0a0a0f',
                borderBottom: '2px solid #0a0a0f',
                marginTop: -1,
              }}
            />
          )}
        </span>
        {label}
      </div>
      <div style={{ color: active ? 'rgba(251,191,36,0.7)' : '#7d7d88', fontSize: 11.5, marginLeft: 22 }}>
        {sublabel}
      </div>
    </button>
  );
}
