'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type Category =
  | 'OPEN' | 'OBC-NCL' | 'SC' | 'ST' | 'EWS'
  | 'OPEN (PwD)' | 'OBC-NCL (PwD)' | 'SC (PwD)' | 'ST (PwD)' | 'EWS (PwD)';

type Gender = 'Gender-Neutral' | 'Female-only (including Supernumerary)';

type Bucket = 'safe' | 'target' | 'reach' | 'unlikely';

type Region = 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';
type CollegeType = 'NIT' | 'IIIT' | 'GFTI';

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
  projected_closing_rank: number;
  historical: { year: number; closing_rank: number }[];
  r1_projected_closing_rank?: number;
  r1_historical?: { year: number; closing_rank: number }[];
  r3_projected_closing_rank?: number;
  r3_historical?: { year: number; closing_rank: number }[];
  expected_allotment_round?: 'R1' | 'R3' | 'Final';
  confidence: 'high' | 'medium' | 'low';
  confidence_reason: string;
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

interface PredictResponse {
  success: boolean;
  error?: string;
  input_summary?: {
    effective_rank: number;
    year: number;
  };
  counts?: Record<Bucket, number>;
  total_colleges?: number;
  returned_colleges?: number;
  extended?: boolean;
  colleges?: CollegeGroup[];
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Ladakh', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

const CATEGORIES: Category[] = [
  'OPEN', 'OBC-NCL', 'SC', 'ST', 'EWS',
  'OPEN (PwD)', 'OBC-NCL (PwD)', 'SC (PwD)', 'ST (PwD)', 'EWS (PwD)',
];

const REGIONS: Region[] = ['North', 'South', 'East', 'West', 'Central', 'Northeast'];
const COLLEGE_TYPES: CollegeType[] = ['NIT', 'IIIT', 'GFTI'];

const POPULAR_BRANCHES = [
  'Computer Science and Engineering',
  'Electronics and Communication Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Information Technology',
  'Artificial Intelligence and Machine Learning',
  'Artificial Intelligence and Data Science',
  'Mathematics and Computing',
  'Metallurgical and Materials Engineering',
  'Aerospace Engineering',
  'Aeronautical Engineering',
  'Biotechnology',
  'Biomedical Engineering',
  'Engineering Physics',
  'Architecture',
  'Planning',
  'Mining Engineering',
  'Production and Industrial Engineering',
  'Electronics and Instrumentation Engineering',
  'Instrumentation and Control Engineering',
  'Mechatronics Engineering',
  'Robotics and Automation',
  'VLSI Design and Technology',
  'Food Technology',
  'Textile Technology',
  'Agricultural Engineering',
  'Ceramic Engineering',
  'Chemistry',
  'Physics',
  'Mathematics',
];

// Keep in sync with BRANCH_ALIASES on the server so client highlighting
// (the DREAM star) agrees with the server's filter.
const CLIENT_BRANCH_ALIASES: Record<string, string[]> = {
  cse: ['CSE', 'Computer Science and Engineering'],
  'computer science and engineering': ['CSE', 'Computer Science and Engineering'],
  'computer science': ['CSE', 'Computer Science and Engineering'],
  ece: ['ECE', 'Electronics and Communication Engineering'],
  'electronics and communication engineering': ['ECE', 'Electronics and Communication Engineering'],
  ee: ['EE', 'Electrical Engineering'],
  'electrical engineering': ['EE', 'Electrical Engineering'],
  eee: ['EEE', 'Electrical and Electronics Engineering'],
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
  mnc: ['M&C', 'Mathematics and Computing'],
  'mathematics and computing': ['M&C', 'Mathematics and Computing'],
  ep: ['EP', 'Engineering Physics'],
  'engineering physics': ['EP', 'Engineering Physics'],

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

const BUCKET_META: Record<Bucket, { label: string; badge: string; dot: string }> = {
  safe:     { label: 'Safe',     badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
  target:   { label: 'Target',   badge: 'bg-orange-500/15 text-orange-400 border-orange-500/30',    dot: 'bg-orange-400' },
  reach:    { label: 'Reach',    badge: 'bg-sky-500/15 text-sky-400 border-sky-500/30',             dot: 'bg-sky-400' },
  unlikely: { label: 'Unlikely', badge: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',          dot: 'bg-zinc-400' },
};

// Shareable-URL encoding keys (kept short so the URL stays readable in chat/SMS).
const URL_KEYS = {
  mode: 'm',           // 'r' | 'p'
  rank: 'r',
  percentile: 'p',
  category: 'cat',
  gender: 'g',         // 'GN' | 'F'
  homeState: 'hs',
  regions: 'rg',       // csv
  collegeTypes: 'ct',  // csv
  dreamBranch: 'db',
  dreamCollege: 'dc',
} as const;

const ALL_REGIONS: Region[] = ['North', 'South', 'East', 'West', 'Central', 'Northeast'];
const ALL_COLLEGE_TYPES: CollegeType[] = ['NIT', 'IIIT', 'GFTI'];

export default function PredictorClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Lazy-init state from URL so a shared link lands in the shared state.
  const initialUrl = searchParams;
  const [mode, setMode] = useState<'rank' | 'percentile'>(() =>
    initialUrl.get(URL_KEYS.mode) === 'r' ? 'rank' : 'percentile',
  );
  const [rankInput, setRankInput] = useState(() => initialUrl.get(URL_KEYS.rank) ?? '');
  const [percentileInput, setPercentileInput] = useState(() => initialUrl.get(URL_KEYS.percentile) ?? '');
  const [category, setCategory] = useState<Category>(() => {
    const c = initialUrl.get(URL_KEYS.category);
    return (CATEGORIES as readonly string[]).includes(c ?? '') ? (c as Category) : 'OPEN';
  });
  const [gender, setGender] = useState<Gender>(() =>
    initialUrl.get(URL_KEYS.gender) === 'F'
      ? 'Female-only (including Supernumerary)'
      : 'Gender-Neutral',
  );
  const [homeState, setHomeState] = useState(() => {
    const s = initialUrl.get(URL_KEYS.homeState);
    return s && INDIAN_STATES.includes(s) ? s : 'Uttar Pradesh';
  });

  // Optional refinement filters
  const [regions, setRegions] = useState<Set<Region>>(() => {
    const csv = initialUrl.get(URL_KEYS.regions);
    if (!csv) return new Set();
    const valid = csv.split(',').filter((r): r is Region => (ALL_REGIONS as string[]).includes(r));
    return new Set(valid);
  });
  const [collegeTypes, setCollegeTypes] = useState<Set<CollegeType>>(() => {
    const csv = initialUrl.get(URL_KEYS.collegeTypes);
    if (!csv) return new Set();
    const valid = csv.split(',').filter((t): t is CollegeType =>
      (ALL_COLLEGE_TYPES as string[]).includes(t),
    );
    return new Set(valid);
  });
  const [dreamBranch, setDreamBranch] = useState(() => initialUrl.get(URL_KEYS.dreamBranch) ?? '');
  const [dreamCollege, setDreamCollege] = useState(() => initialUrl.get(URL_KEYS.dreamCollege) ?? '');
  const [showFilters, setShowFilters] = useState(() =>
    // Auto-open refinement panel when any filter was shared in the URL.
    initialUrl.has(URL_KEYS.regions) ||
    initialUrl.has(URL_KEYS.collegeTypes) ||
    initialUrl.has(URL_KEYS.dreamBranch) ||
    initialUrl.has(URL_KEYS.dreamCollege),
  );
  const [sharedCopied, setSharedCopied] = useState(false);

  const [loading, setLoading] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [response, setResponse] = useState<PredictResponse | null>(null);
  const [lastBody, setLastBody] = useState<Record<string, unknown> | null>(null);
  const [submittedMode, setSubmittedMode] = useState<'rank' | 'percentile' | null>(null);

  // Choice-list export modal state
  const [showExport, setShowExport] = useState(false);
  const [exportText, setExportText] = useState('');
  const [copied, setCopied] = useState(false);

  const activeFilterCount =
    regions.size + collegeTypes.size + (dreamBranch.trim() ? 1 : 0) + (dreamCollege.trim() ? 1 : 0);

  function toggleRegion(r: Region) {
    setRegions((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  }

  function toggleType(t: CollegeType) {
    setCollegeTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }

  function clearFilters() {
    setRegions(new Set());
    setCollegeTypes(new Set());
    setDreamBranch('');
    setDreamCollege('');
  }

  // ── URL sharing ──────────────────────────────────────────────────────────────
  // Build a query string reflecting the current form state, and replace the
  // browser URL (no new history entry). Called on successful submit so the URL
  // always mirrors the result the user is looking at.
  function buildQuery(): string {
    const params = new URLSearchParams();
    params.set(URL_KEYS.mode, mode === 'rank' ? 'r' : 'p');
    if (mode === 'rank' && rankInput) params.set(URL_KEYS.rank, rankInput);
    if (mode === 'percentile' && percentileInput) params.set(URL_KEYS.percentile, percentileInput);
    params.set(URL_KEYS.category, category);
    params.set(URL_KEYS.gender, gender === 'Gender-Neutral' ? 'GN' : 'F');
    params.set(URL_KEYS.homeState, homeState);
    if (regions.size > 0) params.set(URL_KEYS.regions, [...regions].join(','));
    if (collegeTypes.size > 0) params.set(URL_KEYS.collegeTypes, [...collegeTypes].join(','));
    if (dreamBranch.trim()) params.set(URL_KEYS.dreamBranch, dreamBranch.trim());
    if (dreamCollege.trim()) params.set(URL_KEYS.dreamCollege, dreamCollege.trim());
    return params.toString();
  }

  function syncUrl() {
    const qs = buildQuery();
    router.replace(`${pathname}?${qs}`, { scroll: false });
  }

  async function copyShareLink() {
    const qs = buildQuery();
    const url = `${window.location.origin}${pathname}?${qs}`;
    try {
      await navigator.clipboard.writeText(url);
      setSharedCopied(true);
      setTimeout(() => setSharedCopied(false), 2000);
    } catch {
      setSharedCopied(false);
    }
  }

  // Auto-submit when a shared link lands with a rank/percentile already filled.
  // Runs exactly once on mount; subsequent state changes are user-driven.
  const didAutoSubmit = useRef(false);
  useEffect(() => {
    if (didAutoSubmit.current) return;
    const hasRank = initialUrl.get(URL_KEYS.rank);
    const hasPct = initialUrl.get(URL_KEYS.percentile);
    if (hasRank || hasPct) {
      didAutoSubmit.current = true;
      // Fire the form submit in the next tick so state has settled.
      requestAnimationFrame(() => {
        const form = document.querySelector('form');
        form?.requestSubmit();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runPredict(
    body: Record<string, unknown>,
    opts: { extended?: boolean; includeUnlikely?: boolean } = {},
  ) {
    const payload = {
      ...body,
      ...(opts.extended ? { extended: true } : {}),
      ...(opts.includeUnlikely ? { include_unlikely: true } : {}),
    };
    const res = await fetch('/api/v2/college-predictor/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return (await res.json()) as PredictResponse;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const body: Record<string, unknown> = {
      category,
      gender,
      home_state: homeState,
    };
    if (mode === 'rank') {
      const r = parseInt(rankInput, 10);
      if (!Number.isFinite(r) || r < 1) {
        setResponse({ success: false, error: 'Enter a valid rank' });
        setLoading(false);
        return;
      }
      body.rank = r;
    } else {
      const p = parseFloat(percentileInput);
      if (!Number.isFinite(p) || p < 0 || p > 100) {
        setResponse({ success: false, error: 'Enter a valid percentile (0–100)' });
        setLoading(false);
        return;
      }
      body.percentile = p;
    }

    if (regions.size > 0) body.regions = [...regions];
    if (collegeTypes.size > 0) body.college_types = [...collegeTypes];
    if (dreamBranch.trim()) body.dream_branch = dreamBranch.trim();
    if (dreamCollege.trim()) body.dream_college = dreamCollege.trim();

    try {
      const data = await runPredict(body);
      setResponse(data);
      setLastBody(body);
      setSubmittedMode(mode);
      syncUrl();
    } catch (err) {
      console.error(err);
      setResponse({ success: false, error: 'Request failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  function buildChoiceList(groups: CollegeGroup[]): string {
    const lines: string[] = [];
    lines.push('# JoSAA choice list — generated by Canvas College Predictor');
    lines.push('# Order your choices from MOST preferred (top) to LEAST preferred (bottom).');
    lines.push('# Remove any row you don\'t want. Use this as a reference when filling choices on the JoSAA portal.');
    lines.push('');
    let n = 1;
    for (const g of groups) {
      for (const b of g.branches) {
        const meta = `${b.bucket.toUpperCase()} · ${b.probability_pct}%`;
        lines.push(
          `${n}. ${g.college_short_name} — ${b.branch_name} · Quota ${b.quota_matched} · ${meta}`,
        );
        n++;
      }
    }
    return lines.join('\n');
  }

  function openExport() {
    if (!response?.success || !response.colleges) return;
    setExportText(buildChoiceList(response.colleges));
    setCopied(false);
    setShowExport(true);
  }

  async function copyExport() {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function downloadExport() {
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'josaa-choice-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleExpand() {
    if (!lastBody) return;
    setExpanding(true);
    try {
      const data = await runPredict(lastBody, { extended: true });
      setResponse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setExpanding(false);
    }
  }

  async function handleShowUnlikely() {
    if (!lastBody) return;
    setExpanding(true);
    try {
      const data = await runPredict(lastBody, { extended: true, includeUnlikely: true });
      setResponse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setExpanding(false);
    }
  }

  const colleges = response?.success ? response.colleges ?? [] : [];
  const total = response?.total_colleges ?? colleges.length;
  const isExtended = response?.extended === true;
  const truncated = !isExtended && total > colleges.length;

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="p-6 md:p-8 rounded-2xl bg-[#0B0F15] border border-white/5"
      >
        <div className="flex items-center gap-2 mb-5">
          <button
            type="button"
            onClick={() => setMode('percentile')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              mode === 'percentile'
                ? 'bg-orange-500 text-black'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            Percentile
          </button>
          <button
            type="button"
            onClick={() => setMode('rank')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              mode === 'rank'
                ? 'bg-orange-500 text-black'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            CRL Rank
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {mode === 'percentile' ? (
            <Field label="JEE Main Percentile">
              <input
                type="number"
                step="0.0001"
                min="0"
                max="100"
                required
                value={percentileInput}
                onChange={(e) => setPercentileInput(e.target.value)}
                placeholder="e.g. 98.5432"
                className="input"
              />
              <p className="mt-1.5 text-[11px] text-zinc-500">
                We approximate your CRL rank from percentile. Once your CRL is released, switch to rank mode for a tighter prediction.
              </p>
            </Field>
          ) : (
            <Field label="Common Rank List (CRL) Rank">
              <input
                type="number"
                min="1"
                required
                value={rankInput}
                onChange={(e) => setRankInput(e.target.value)}
                placeholder="e.g. 12500"
                className="input"
              />
            </Field>
          )}

          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="input"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label="Gender">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="input"
            >
              <option value="Gender-Neutral">Gender-Neutral</option>
              <option value="Female-only (including Supernumerary)">
                Female (Supernumerary)
              </option>
            </select>
          </Field>

          <Field label="Home State">
            <select
              value={homeState}
              onChange={(e) => setHomeState(e.target.value)}
              className="input"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* ── Narrow-down filters (collapsible) ────────────────────────────── */}
        <div className="mt-6 pt-5 border-t border-white/5">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center justify-between w-full group"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                Narrow it down
              </span>
              <span className="text-xs text-zinc-500">
                (optional — helps us rank smarter)
              </span>
              {activeFilterCount > 0 && (
                <span className="text-[10px] font-bold bg-orange-500 text-black px-1.5 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors text-xs">
              {showFilters ? 'Hide ▲' : 'Show ▼'}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-5 space-y-5">
                  {/* Region */}
                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-2">
                      Preferred region
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {REGIONS.map((r) => (
                        <Chip key={r} active={regions.has(r)} onClick={() => toggleRegion(r)}>
                          {r}
                        </Chip>
                      ))}
                    </div>
                    <p className="mt-1.5 text-[11px] text-zinc-500">
                      Leave empty to see colleges across India.
                    </p>
                  </div>

                  {/* College type */}
                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-2">
                      Institute type
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {COLLEGE_TYPES.map((t) => (
                        <Chip key={t} active={collegeTypes.has(t)} onClick={() => toggleType(t)}>
                          {t === 'NIT' ? 'NITs' : t === 'IIIT' ? 'IIITs' : 'GFTIs (govt-funded)'}
                        </Chip>
                      ))}
                    </div>
                    <p className="mt-1.5 text-[11px] text-zinc-500">
                      Leave empty for a mix of all three.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Dream branch (optional)">
                      <input
                        type="text"
                        list="branch-suggestions"
                        value={dreamBranch}
                        onChange={(e) => setDreamBranch(e.target.value)}
                        placeholder="e.g. Mechanical Engineering, CSE"
                        className="input"
                      />
                      <datalist id="branch-suggestions">
                        {POPULAR_BRANCHES.map((b) => (
                          <option key={b} value={b} />
                        ))}
                      </datalist>
                      <p className="mt-1.5 text-[11px] text-zinc-500">
                        Branches matching this will be surfaced first inside each college.
                      </p>
                    </Field>

                    <Field label="Dream college (optional)">
                      <input
                        type="text"
                        value={dreamCollege}
                        onChange={(e) => setDreamCollege(e.target.value)}
                        placeholder="e.g. NIT Trichy, IIIT Hyderabad"
                        className="input"
                      />
                      <p className="mt-1.5 text-[11px] text-zinc-500">
                        Pinned to the top if it appears in your matches.
                      </p>
                    </Field>
                  </div>

                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs text-zinc-400 hover:text-white underline underline-offset-2"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full md:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm disabled:opacity-60 transition-opacity"
        >
          {loading ? 'Predicting…' : 'Predict my colleges'}
        </button>

        <p className="mt-3 text-xs text-zinc-500">
          Predictions use 3 years of JoSAA final-round closing ranks (2022–2024). Accuracy
          depends on historical stability — every result shows a confidence tag.
        </p>
      </form>

      <AnimatePresence mode="wait">
        {response && (
          <motion.div
            key={response.success ? 'ok' : 'err'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {!response.success && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                {response.error ?? 'Something went wrong.'}
              </div>
            )}

            {response.success && colleges.length === 0 && (
              <div className="p-6 rounded-xl bg-[#151E32] border border-white/5 space-y-3">
                <div className="text-sm text-zinc-300">
                  No <span className="font-semibold text-white">Safe / Target / Reach</span> colleges
                  matched this combination.
                  {response.input_summary?.effective_rank && (
                    <>
                      {' '}At <span className="font-semibold text-white">
                        CRL ≈ {response.input_summary.effective_rank.toLocaleString('en-IN')}
                      </span>
                      {submittedMode === 'percentile' ? ' (from your percentile)' : ''}
                      , every branch in your filters closes well below your rank — they're classified as
                      "Unlikely" and hidden by default.
                    </>
                  )}
                </div>
                <div className="text-xs text-zinc-500 leading-relaxed">
                  Try removing the region filter, broadening institute types, or checking a wider
                  category — or keep the current inputs and view the unlikely matches anyway so
                  you can see which branches come closest to your rank.
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleShowUnlikely}
                    disabled={expanding}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {expanding ? 'Loading…' : 'Show unlikely matches anyway'}
                  </button>
                </div>
              </div>
            )}

            {response.success && colleges.length > 0 && (
              <div>
                {submittedMode === 'percentile' && response.input_summary?.effective_rank && (
                  <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-zinc-400">
                    Using <span className="font-semibold text-zinc-200">
                      approx. CRL ≈ {response.input_summary.effective_rank.toLocaleString('en-IN')}
                    </span>{' '}
                    (converted from your percentile). This is an approximation — the real CRL can differ by a few hundred ranks. Use CRL rank mode once your rank card is out.
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="text-sm text-zinc-300">
                    {isExtended ? (
                      <>Showing <span className="font-semibold text-white">all {total}</span> matching colleges</>
                    ) : (
                      <>
                        Your <span className="font-semibold text-white">top {colleges.length}</span> colleges
                        {total > colleges.length && (
                          <span className="text-zinc-500"> · {total} total matches</span>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                    {response.counts?.safe !== undefined && response.counts.safe > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        Safe · {response.counts.safe}
                      </span>
                    )}
                    {response.counts?.target !== undefined && response.counts.target > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                        Target · {response.counts.target}
                      </span>
                    )}
                    {response.counts?.reach !== undefined && response.counts.reach > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">
                        Reach · {response.counts.reach}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {colleges.map((g, i) => (
                    <CollegeCard key={g.college_id} group={g} rank={i + 1} dreamBranch={dreamBranch} />
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/[0.03] border border-white/10 p-4">
                  <div className="text-xs text-zinc-400">
                    Ready to fill JoSAA? Export this as a reference list, or share the link with your parents / counselor.
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={copyShareLink}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-zinc-200 transition-colors"
                    >
                      {sharedCopied ? 'Link copied ✓' : 'Share link'}
                    </button>
                    <button
                      type="button"
                      onClick={openExport}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-xs transition-opacity hover:opacity-90"
                    >
                      Export choice list →
                    </button>
                  </div>
                </div>

                {truncated && (
                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={handleExpand}
                      disabled={expanding}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium text-zinc-200 disabled:opacity-60 transition-colors"
                    >
                      {expanding ? 'Loading…' : `Show all ${total} colleges →`}
                    </button>
                    <p className="mt-2 text-[11px] text-zinc-500">
                      A focused top 10 keeps this useful. Click to see every college we matched.
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowExport(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl bg-[#0B0F15] border border-white/10 overflow-hidden"
            >
              <div className="flex items-start justify-between p-5 border-b border-white/5">
                <div>
                  <div className="text-base font-semibold text-white">Your JoSAA choice list</div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    Reorder lines (most preferred at top), delete any you don&apos;t want, then copy or download.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowExport(false)}
                  className="text-zinc-500 hover:text-white transition-colors text-xl leading-none px-2"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="p-5">
                <textarea
                  value={exportText}
                  onChange={(e) => setExportText(e.target.value)}
                  spellCheck={false}
                  className="w-full h-80 p-3 text-[12px] font-mono rounded-lg bg-black/40 border border-white/10 text-zinc-200 outline-none focus:border-orange-500/50 resize-none"
                />
                <p className="mt-2 text-[11px] text-zinc-500">
                  Tip: JoSAA doesn&apos;t accept paste-import — use this list as a reference while filling choices one by one on the portal.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-white/5 bg-black/20">
                <button
                  type="button"
                  onClick={() => setShowExport(false)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-zinc-300 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={downloadExport}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-zinc-200 transition-colors"
                >
                  Download .txt
                </button>
                <button
                  type="button"
                  onClick={copyExport}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-xs transition-opacity hover:opacity-90"
                >
                  {copied ? 'Copied ✓' : 'Copy to clipboard'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.65rem 0.9rem;
          border-radius: 0.6rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus {
          border-color: rgba(251, 146, 60, 0.6);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
        active
          ? 'bg-orange-500 text-black border-orange-500'
          : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
}

// One card per college. Primary branch shown expanded; other branches are
// compact rows so a 10-college list stays scannable.
function CollegeCard({
  group,
  rank,
  dreamBranch,
}: {
  group: CollegeGroup;
  rank: number;
  dreamBranch: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const primary = group.branches[0];
  const others = group.branches.slice(1);
  const headlineMeta = BUCKET_META[group.best_bucket];

  const branchCount = group.branches.length;
  const buckets = useMemo(() => {
    const set = new Set<Bucket>();
    group.branches.forEach((b) => set.add(b.bucket));
    return [...set];
  }, [group.branches]);

  return (
    <div className="rounded-xl bg-[#151E32] border border-white/5 hover:border-white/10 transition-colors overflow-hidden">
      <div className="p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-500 tabular-nums w-5">
                #{rank}
              </span>
              <div className="text-base md:text-lg font-semibold text-white truncate">
                {group.college_short_name}
              </div>
              <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${headlineMeta.badge}`}>
                {headlineMeta.label}
              </span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">
                {group.college_type}
              </span>
              {group.nirf_rank_engineering && (
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">
                  NIRF #{group.nirf_rank_engineering}
                </span>
              )}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {group.college_state} · {group.college_region} · {branchCount} matching {branchCount === 1 ? 'branch' : 'branches'}
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-orange-400">{group.best_probability_pct}%</div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">best chance</div>
          </div>
        </div>

        {/* Primary (top-ranked) branch inline */}
        <div className="mt-4 pt-3 border-t border-white/5">
          <BranchRow branch={primary} highlight={isDream(primary, dreamBranch)} primary />
        </div>

        {others.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            {expanded
              ? `Hide ${others.length} other ${others.length === 1 ? 'branch' : 'branches'} ▲`
              : `Show ${others.length} other ${others.length === 1 ? 'branch' : 'branches'} ▼`}
            <span className="flex items-center gap-1">
              {buckets.map((b) => (
                <span
                  key={b}
                  className={`w-1.5 h-1.5 rounded-full ${BUCKET_META[b].dot}`}
                  title={BUCKET_META[b].label}
                />
              ))}
            </span>
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {expanded && others.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/5 bg-black/20"
          >
            <div className="px-4 md:px-5 py-3 space-y-2">
              {others.map((b) => (
                <BranchRow
                  key={`${b.branch_short_name}-${b.quota_matched}`}
                  branch={b}
                  highlight={isDream(b, dreamBranch)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function isDream(b: BranchResult, dream: string): boolean {
  if (!dream.trim()) return false;
  const d = dream.trim().toLowerCase();
  const aliases = CLIENT_BRANCH_ALIASES[d] ?? [d];
  const stem = b.branch_short_name.toLowerCase().split(/[\s([]/)[0];
  const nameLower = b.branch_name.toLowerCase();
  for (const a of aliases) {
    const al = a.toLowerCase();
    if (stem === al) return true;
    const rx = new RegExp(`\\b${al.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    if (rx.test(nameLower)) return true;
  }
  return false;
}

// Compact 5-year closing-rank sparkline with a dashed projection endpoint.
// Lower closing rank is rendered lower on the Y axis (natural orientation);
// a line trending downward visually = cutoff getting tighter over time.
function CutoffSparkline({
  history,
  projection,
}: {
  history: { year: number; closing_rank: number }[];
  projection: number;
}) {
  if (!history || history.length < 2) return null;

  const sorted = [...history].sort((a, b) => a.year - b.year);
  const allRanks = [...sorted.map((h) => h.closing_rank), projection];
  const minRank = Math.min(...allRanks);
  const maxRank = Math.max(...allRanks);
  const range = maxRank - minRank || 1;

  const W = 72;
  const H = 22;
  const PAD_X = 2;
  const PAD_Y = 3;
  const innerW = W - 2 * PAD_X;
  const innerH = H - 2 * PAD_Y;

  // Reserve the last slot for the projection; historical points fill earlier slots.
  const totalSlots = sorted.length; // projection occupies index = sorted.length
  const xAt = (i: number) => PAD_X + (i / totalSlots) * innerW;
  const yAt = (rank: number) => PAD_Y + ((rank - minRank) / range) * innerH;

  const points = sorted.map((h, i) => ({ x: xAt(i), y: yAt(h.closing_rank), ...h }));
  const projX = xAt(totalSlots);
  const projY = yAt(projection);

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
  const areaPath = `${path} L ${points[points.length - 1].x.toFixed(1)} ${
    H - PAD_Y
  } L ${points[0].x.toFixed(1)} ${H - PAD_Y} Z`;

  // Trend label: compare most recent actual to earliest actual.
  const first = sorted[0].closing_rank;
  const last = sorted[sorted.length - 1].closing_rank;
  const pctChange = ((last - first) / first) * 100;
  const trend =
    pctChange < -10
      ? `tighter by ${Math.abs(Math.round(pctChange))}% since ${sorted[0].year}`
      : pctChange > 10
      ? `looser by ${Math.round(pctChange)}% since ${sorted[0].year}`
      : `stable since ${sorted[0].year}`;

  const title =
    sorted.map((h) => `${h.year}: #${h.closing_rank.toLocaleString('en-IN')}`).join(' · ') +
    ` · projected ${new Date().getFullYear()}: #${projection.toLocaleString('en-IN')} · ${trend}`;

  return (
    <div className="hidden sm:block shrink-0" title={title} aria-label={title}>
      <svg width={W} height={H} className="block" aria-hidden>
        <path d={areaPath} className="fill-zinc-500/10" />
        <path
          d={path}
          className="stroke-zinc-400 fill-none"
          strokeWidth={1.3}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <line
          x1={points[points.length - 1].x}
          y1={points[points.length - 1].y}
          x2={projX}
          y2={projY}
          className="stroke-orange-400"
          strokeWidth={1.3}
          strokeDasharray="2 2"
        />
        {points.map((p) => (
          <circle key={p.year} cx={p.x} cy={p.y} r={1.2} className="fill-zinc-400" />
        ))}
        <circle cx={projX} cy={projY} r={1.8} className="fill-orange-400" />
      </svg>
    </div>
  );
}

function BranchRow({
  branch,
  highlight,
  primary,
}: {
  branch: BranchResult;
  highlight?: boolean;
  primary?: boolean;
}) {
  const meta = BUCKET_META[branch.bucket];
  const confidenceColor = {
    high: 'text-emerald-400',
    medium: 'text-amber-400',
    low: 'text-zinc-500',
  }[branch.confidence];

  const r1 = branch.r1_projected_closing_rank;
  const r3 = branch.r3_projected_closing_rank;
  const rF = branch.projected_closing_rank;
  // Ratio of R1 projection to final projection. R1 should be tighter (smaller).
  // A big gap (ratio < 0.8) means the seat fills mostly from late-round churn.
  const r1Tightness = r1 ? r1 / rF : undefined;
  const highChurn = r1Tightness !== undefined && r1Tightness < 0.8;
  const expected = branch.expected_allotment_round;
  const expectedMeta = expected
    ? expected === 'R1'
      ? { label: 'Likely by R1', cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
      : expected === 'R3'
      ? { label: 'Likely by R3', cls: 'text-sky-400 bg-sky-500/10 border-sky-500/20' }
      : { label: 'Only by final round', cls: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
    : null;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 ${
        highlight ? 'rounded-lg bg-orange-500/5 -mx-2 px-2 py-1.5 border border-orange-500/20' : ''
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
          <span className={`${primary ? 'text-sm font-medium text-white' : 'text-sm text-zinc-200'} truncate`}>
            {branch.branch_name}
          </span>
          {highlight && (
            <span className="text-[9px] uppercase tracking-wider text-orange-400 font-bold">
              ★ dream
            </span>
          )}
          {highChurn && (
            <span
              className="text-[9px] uppercase tracking-wider text-amber-400 font-bold"
              title="Round 1 closes much tighter than the final round — this seat usually fills via late-round upgrades. Rank it carefully in your JoSAA choice list."
            >
              ⚡ late-round seat
            </span>
          )}
        </div>
        <div className="text-[11px] text-zinc-500 mt-0.5">
          {r1 || r3 ? (
            <>
              {r1 && <>R1 #{r1.toLocaleString('en-IN')}</>}
              {r1 && r3 && <> · </>}
              {r3 && <>R3 #{r3.toLocaleString('en-IN')}</>}
              {(r1 || r3) && <> · </>}
              Final #{rF.toLocaleString('en-IN')}
            </>
          ) : (
            <>Projected close #{rF.toLocaleString('en-IN')}</>
          )}
          {' · '}Quota {branch.quota_matched} ·{' '}
          <span className={confidenceColor}>{branch.confidence} confidence</span>
        </div>
        {expectedMeta && (
          <div className="mt-1">
            <span
              className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${expectedMeta.cls}`}
            >
              {expectedMeta.label}
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <CutoffSparkline history={branch.historical} projection={branch.projected_closing_rank} />
        <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${meta.badge}`}>
          {meta.label}
        </span>
        <div className="text-right">
          <div className="text-base font-bold text-white tabular-nums">{branch.probability_pct}%</div>
        </div>
      </div>
    </div>
  );
}
