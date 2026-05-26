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
  ReturnsCard,
  SectionHead,
  Seg,
  Sparkline,
  TrustRow,
  chanceToWords,
} from './primitives';
import ShareCardButton from '../components/ShareCardButton';
import ChoiceListBuilder from '../components/ChoiceListBuilder';

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

export default function PredictorExperience() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial exam tab from URL so a shared link lands in the right place.
  const initialExam: Exam = searchParams.get('tool') === 'bitsat' ? 'bitsat' : 'jee';
  const [exam, setExam] = useState<Exam>(initialExam);

  // JEE form state
  const [category, setCategory] = useState<'OPEN' | 'EWS' | 'OBC-NCL' | 'SC' | 'ST'>('OPEN');
  const [quota, setQuota] = useState<'HS' | 'OS' | 'AI'>('HS');
  const [homeState, setHomeState] = useState('Uttar Pradesh');
  const [rankType, setRankType] = useState<'CRL' | 'CAT'>('CRL');
  const [rank, setRank] = useState(8532);

  // BITSAT form state
  const [paper, setPaper] = useState<'modern' | 'legacy'>('modern');
  const [score, setScore] = useState(295);
  const maxScore = paper === 'modern' ? 390 : 450;

  // Narrow-down state
  const [narrowOpen, setNarrowOpen] = useState(false);
  const [pickedBranches, setPickedBranches] = useState<string[]>([]);
  const [tierOnly, setTierOnly] = useState(false);

  // Submission + results state
  const [loading, setLoading] = useState(false);
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

  const resultsRef = useRef<HTMLDivElement>(null);

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
  async function submitJEE() {
    setLoading(true);
    setExtended(false);
    setFilter('all');
    try {
      // For category rank, percentileToRank knows the conversion isn't needed
      // since user already typed a category rank. We pass the raw rank.
      const body: Record<string, unknown> = {
        rank,
        category,
        gender: 'Gender-Neutral',
        home_state: homeState,
        // Branch filter (best-effort): pass first picked branch as dream_branch
        // since the API accepts only one. Tier-only is enforced client-side.
        ...(pickedBranches[0] ? { dream_branch: pickedBranches[0] } : {}),
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
            category,
            gender: 'Gender-Neutral',
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
        let groups: JoSAACollegeGroup[] = predictRes.colleges ?? [];
        if (tierOnly) {
          groups = groups.filter((g) => (g.nirf_rank_engineering ?? 9999) <= 25);
        }
        setJeeGroups(groups);
        setBitsatRows(null);
        setTotalCount(predictRes.total_colleges ?? groups.length);
        setCounts({
          safe: predictRes.counts?.safe ?? 0,
          target: predictRes.counts?.target ?? 0,
          reach: predictRes.counts?.reach ?? 0,
        });
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
      const body = { score, regime: paper, extended: false };
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
  const visibleRows = extended ? filteredRows : filteredRows.slice(0, 10);
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

      {/* 3 feature cards — stacked at narrow widths, 3-up at md+. */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[18px] mb-12">
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
                onClick={() => setExam(t.id)}
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
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
            </div>
            <ReturnsCard exam="jee" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
            </div>
            <ReturnsCard exam="bitsat" />
          </div>
        )}

        {/* Narrow down */}
        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: 22, marginTop: 24 }}>
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
            <div>
              <span style={{ color: '#f5f5f7', fontSize: 15, fontWeight: 600, letterSpacing: '-0.005em' }}>
                Narrow it down
              </span>
              <span style={{ color: '#5e5e6a', fontSize: 13, marginLeft: 10 }}>
                optional · pin branches or campuses
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
                  BRANCHES — pick any
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(exam === 'jee'
                    ? ['CSE', 'ECE', 'IT', 'EE', 'Mechanical', 'Civil', 'Chemical', 'Materials']
                    : ['CSE', 'ECE', 'EEE', 'Mechanical', 'Chemical', 'Biological', 'Pharmacy', 'Manufacturing']
                  ).map((b) => {
                    const active = pickedBranches.includes(b);
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() =>
                          setPickedBranches((arr) =>
                            arr.includes(b) ? arr.filter((x) => x !== b) : [...arr, b],
                          )
                        }
                        style={{
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
                        }}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>
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
            </div>
          )}
        </div>

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

          {/* Show all */}
          {filteredRows.length > 10 && !extended && (
            <div style={{ textAlign: 'center', marginTop: 26 }}>
              <button
                type="button"
                onClick={() => setExtended(true)}
                style={{
                  padding: '12px 22px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#cfcfd6',
                  fontFamily: 'inherit',
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                }}
              >
                Show all {filteredRows.length} {exam === 'jee' ? 'colleges' : 'programmes'}
                {Icons.arrow('currentColor')}
              </button>
            </div>
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
                      category,
                      gender: 'Gender-Neutral',
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
            category,
            gender: 'Gender-Neutral',
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
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '44px 1fr auto',
        gap: 18,
        alignItems: 'center',
        padding: '16px 22px 18px',
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
          top: 14,
          bottom: 14,
          width: 2,
          background: palette.fg,
          opacity: 0.5,
          borderRadius: '0 2px 2px 0',
        }}
      />
      <div
        style={{
          color: '#5e5e6a',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.04em',
        }}
      >
        #{r.rank}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              color: '#f5f5f7',
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: '-0.012em',
            }}
          >
            {r.programme}
          </span>
          <span
            title={BUCKET_DEFINITIONS[r.bucket.toUpperCase() as 'SAFE' | 'TARGET' | 'REACH']}
            style={{
              padding: '2.5px 7px',
              borderRadius: 5,
              border: `1px solid ${palette.border}`,
              background: palette.bg,
              color: palette.fg,
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: '0.16em',
              cursor: 'help',
            }}
          >
            {r.bucket.toUpperCase()}
          </span>
        </div>
        <div
          style={{
            marginTop: 5,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
            color: '#7d7d88',
            fontSize: 12.5,
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <Sparkline data={r.trend} />
        <div style={{ textAlign: 'right', minWidth: 64 }}>
          <div
            style={{
              color: ACCENT,
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {r.pct}%
          </div>
          <div style={{ color: '#5e5e6a', fontSize: 10, marginTop: 4, letterSpacing: '0.14em', fontWeight: 600 }}>
            CHANCE
          </div>
        </div>
        {clickable && (
          <span
            aria-hidden
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
