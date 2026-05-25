'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import BitsatImpactExplorer from './BitsatImpactExplorer';
import ParentProgrammeRow from './ParentProgrammeRow';
import ShareCardButton from '../components/ShareCardButton';
import DropYearAnalyzer from '../components/DropYearAnalyzer';
import { parentSummary } from '../lib/parentVocab';

type Bucket = 'safe' | 'target' | 'reach' | 'unlikely';
type Regime = 'modern' | 'legacy';
type CampusId = 'pilani' | 'goa' | 'hyderabad';

// Programme codes — kept in sync with packages/data/bitsat/programmes.ts.
const PROGRAMME_CODES = [
  'BE-CSE', 'BE-MNC', 'BE-ECE', 'BE-EEE', 'BE-EIE',
  'BE-MECH', 'BE-CHE', 'BE-CIV', 'BE-MANF', 'BE-ENV', 'BE-ECMP',
  'MSC-ECON', 'MSC-SEMI', 'MSC-MATH', 'MSC-PHYS', 'MSC-CHEM', 'MSC-BIO', 'MSC-GEN',
  'BPHARM',
] as const;
type ProgrammeCode = typeof PROGRAMME_CODES[number];

const PROGRAMME_LABELS: Record<ProgrammeCode, { short: string; full: string }> = {
  'BE-CSE':   { short: 'CSE',   full: 'B.E. Computer Science' },
  'BE-MNC':   { short: 'MnC',   full: 'B.E. Mathematics and Computing' },
  'BE-ECE':   { short: 'ECE',   full: 'B.E. Electronics & Communication' },
  'BE-EEE':   { short: 'EEE',   full: 'B.E. Electrical & Electronics' },
  'BE-EIE':   { short: 'EIE',   full: 'B.E. Electronics & Instrumentation' },
  'BE-MECH':  { short: 'MECH',  full: 'B.E. Mechanical' },
  'BE-CHE':   { short: 'CHEM',  full: 'B.E. Chemical' },
  'BE-CIV':   { short: 'CIV',   full: 'B.E. Civil' },
  'BE-MANF':  { short: 'MANF',  full: 'B.E. Manufacturing' },
  'BE-ENV':   { short: 'ENV',   full: 'B.E. Environmental and Sustainability' },
  'BE-ECMP':  { short: 'EnC',   full: 'B.E. Electronics and Computer' },
  'MSC-ECON': { short: 'Econ',  full: 'M.Sc. Economics' },
  'MSC-SEMI': { short: 'Semi',  full: 'M.Sc. Semiconductor and Nanoscience' },
  'MSC-MATH': { short: 'Math',  full: 'M.Sc. Mathematics' },
  'MSC-PHYS': { short: 'Phys',  full: 'M.Sc. Physics' },
  'MSC-CHEM': { short: 'Chem',  full: 'M.Sc. Chemistry' },
  'MSC-BIO':  { short: 'Bio',   full: 'M.Sc. Biological Sciences' },
  'MSC-GEN':  { short: 'GS',    full: 'M.Sc. (Tech.) General Studies' },
  'BPHARM':   { short: 'Pharm', full: 'B. Pharm.' },
};

const CAMPUSES: { id: CampusId; name: string; subtitle: string }[] = [
  { id: 'pilani',    name: 'Pilani',    subtitle: 'Rajasthan · 1964' },
  { id: 'goa',       name: 'Goa',       subtitle: 'K K Birla Goa · 2004' },
  { id: 'hyderabad', name: 'Hyderabad', subtitle: 'Telangana · 2008' },
];

interface ProgrammeResult {
  campus_id: CampusId;
  campus_name: 'Pilani' | 'Goa' | 'Hyderabad';
  campus_state: string;
  campus_region: string;
  nirf_rank_engineering?: number;
  programme_code: ProgrammeCode;
  programme_short_name: string;
  programme_name: string;
  degree_type: 'BE' | 'MSC' | 'BPHARM';
  bucket: Bucket;
  probability_pct: number;
  projected_cutoff_score: number;
  historical: { year: number; cutoff_score: number }[];
  confidence: 'high' | 'medium' | 'low';
  confidence_reason: string;
  regime: Regime;
  max_score: number;
}

interface PredictResponse {
  success: boolean;
  error?: string;
  input_summary?: { score: number; regime: Regime; max_score: number };
  counts?: Record<Bucket, number>;
  total_programmes?: number;
  returned_programmes?: number;
  extended?: boolean;
  programmes?: ProgrammeResult[];
}

const BUCKET_META: Record<Bucket, { label: string; badge: string; dot: string }> = {
  safe:     { label: 'Safe',     badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
  target:   { label: 'Target',   badge: 'bg-orange-500/15 text-orange-400 border-orange-500/30',    dot: 'bg-orange-400' },
  reach:    { label: 'Reach',    badge: 'bg-sky-500/15 text-sky-400 border-sky-500/30',             dot: 'bg-sky-400' },
  unlikely: { label: 'Unlikely', badge: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',          dot: 'bg-zinc-400' },
};

const URL_KEYS = {
  score: 'bs',
  regime: 'rg',
  campuses: 'cmp',
  programmes: 'pr',
  view: 'view',
} as const;

export default function BitsatPredictorClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialUrl = searchParams;

  const [scoreInput, setScoreInput] = useState(() => initialUrl.get(URL_KEYS.score) ?? '');
  const [regime, setRegime] = useState<Regime>(() =>
    initialUrl.get(URL_KEYS.regime) === 'legacy' ? 'legacy' : 'modern',
  );
  const [campuses, setCampuses] = useState<Set<CampusId>>(() => {
    const csv = initialUrl.get(URL_KEYS.campuses);
    if (!csv) return new Set();
    const valid = csv.split(',').filter((c): c is CampusId =>
      (['pilani', 'goa', 'hyderabad'] as string[]).includes(c),
    );
    return new Set(valid);
  });
  const [programmes, setProgrammes] = useState<Set<ProgrammeCode>>(() => {
    const csv = initialUrl.get(URL_KEYS.programmes);
    if (!csv) return new Set();
    const valid = csv.split(',').filter((c): c is ProgrammeCode =>
      (PROGRAMME_CODES as readonly string[]).includes(c),
    );
    return new Set(valid);
  });

  const [showFilters, setShowFilters] = useState(() =>
    initialUrl.has(URL_KEYS.campuses) || initialUrl.has(URL_KEYS.programmes),
  );

  const [loading, setLoading] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [response, setResponse] = useState<PredictResponse | null>(null);
  const [lastBody, setLastBody] = useState<Record<string, unknown> | null>(null);
  const [sharedCopied, setSharedCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'student' | 'parent'>(() =>
    initialUrl.get(URL_KEYS.view) === 'parent' ? 'parent' : 'student',
  );
  const [showDropYear, setShowDropYear] = useState(false);

  const maxScore = regime === 'modern' ? 390 : 450;
  const activeFilterCount = campuses.size + programmes.size;

  function toggleCampus(c: CampusId) {
    setCampuses((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }
  function toggleProgramme(p: ProgrammeCode) {
    setProgrammes((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  }
  function clearFilters() {
    setCampuses(new Set());
    setProgrammes(new Set());
  }

  function buildQuery(): string {
    const params = new URLSearchParams(searchParams.toString());
    // Strip JoSAA tool params to keep the shared URL clean; preserve only ours + the tool tab.
    for (const k of Array.from(params.keys())) {
      if (k !== 'tool' && !(Object.values(URL_KEYS) as string[]).includes(k)) params.delete(k);
    }
    params.set('tool', 'bitsat');
    if (scoreInput) params.set(URL_KEYS.score, scoreInput);
    params.set(URL_KEYS.regime, regime);
    if (campuses.size > 0) params.set(URL_KEYS.campuses, [...campuses].join(','));
    else params.delete(URL_KEYS.campuses);
    if (programmes.size > 0) params.set(URL_KEYS.programmes, [...programmes].join(','));
    else params.delete(URL_KEYS.programmes);
    if (viewMode === 'parent') params.set(URL_KEYS.view, 'parent');
    else params.delete(URL_KEYS.view);
    return params.toString();
  }

  function syncUrl() {
    router.replace(`${pathname}?${buildQuery()}`, { scroll: false });
  }

  async function copyShareLink() {
    const url = `${window.location.origin}${pathname}?${buildQuery()}`;
    try {
      await navigator.clipboard.writeText(url);
      setSharedCopied(true);
      setTimeout(() => setSharedCopied(false), 2000);
    } catch {
      setSharedCopied(false);
    }
  }

  // Auto-submit when a shared link lands with a score already filled.
  const didAutoSubmit = useRef(false);
  useEffect(() => {
    if (didAutoSubmit.current) return;
    if (initialUrl.get(URL_KEYS.score)) {
      didAutoSubmit.current = true;
      requestAnimationFrame(() => {
        const form = document.getElementById('bitsat-form') as HTMLFormElement | null;
        form?.requestSubmit();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runPredict(body: Record<string, unknown>, opts: { extended?: boolean; includeUnlikely?: boolean } = {}) {
    const payload = {
      ...body,
      ...(opts.extended ? { extended: true } : {}),
      ...(opts.includeUnlikely ? { include_unlikely: true } : {}),
    };
    const res = await fetch('/api/v2/college-predictor/bitsat/predict', {
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

    const score = parseInt(scoreInput, 10);
    if (!Number.isFinite(score) || score < 0 || score > maxScore) {
      setResponse({ success: false, error: `Enter a valid BITSAT score (0–${maxScore})` });
      setLoading(false);
      return;
    }

    const body: Record<string, unknown> = { score, regime };
    if (campuses.size > 0) body.campuses = [...campuses];
    if (programmes.size > 0) body.programmes = [...programmes];

    try {
      const data = await runPredict(body);
      setResponse(data);
      setLastBody(body);
      syncUrl();
    } catch (err) {
      console.error(err);
      setResponse({ success: false, error: 'Request failed. Please try again.' });
    } finally {
      setLoading(false);
    }
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

  const items = response?.success ? response.programmes ?? [] : [];
  const total = response?.total_programmes ?? items.length;
  const isExtended = response?.extended === true;
  const truncated = !isExtended && total > items.length;

  return (
    <div className="space-y-8">
      <form
        id="bitsat-form"
        onSubmit={handleSubmit}
        className="p-6 md:p-8 rounded-2xl bg-[#0B0F15] border border-white/5"
      >
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <button
            type="button"
            onClick={() => setRegime('modern')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              regime === 'modern'
                ? 'bg-orange-500 text-black'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            Modern paper (2022+, max 390)
          </button>
          <button
            type="button"
            onClick={() => setRegime('legacy')}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              regime === 'legacy'
                ? 'bg-orange-500 text-black'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            Legacy (≤ 2021, max 450)
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label={`BITSAT score (0–${maxScore})`}>
            <input
              type="number"
              min={0}
              max={maxScore}
              required
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
              placeholder={regime === 'modern' ? 'e.g. 305' : 'e.g. 360'}
              className="input"
            />
            <p className="mt-1.5 text-[11px] text-zinc-500">
              Enter the total BITSAT score (no sectional split).{' '}
              {regime === 'modern'
                ? 'The modern paper is out of 390 and is used from BITSAT 2022 onward.'
                : 'The legacy paper was out of 450 — used for BITSAT 2017–2021. Scores are not comparable across the boundary.'}
            </p>
          </Field>

          <Field label="What this returns">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-[12px] text-zinc-300 leading-relaxed">
              We compare your score to {regime === 'modern' ? '4 years' : '5 years'} of final BITSAT closing scores at Pilani, Goa and Hyderabad
              and bucket each programme as <span className="text-emerald-400 font-medium">Safe</span>,{' '}
              <span className="text-orange-400 font-medium">Target</span> or{' '}
              <span className="text-sky-400 font-medium">Reach</span>.
              <span className="block mt-1 text-[11px] text-zinc-500">
                BITS has no category quotas — every result is open-merit.
              </span>
            </div>
          </Field>
        </div>

        <div className="mt-6 pt-5 border-t border-white/5">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center justify-between w-full group"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Narrow it down</span>
              <span className="text-xs text-zinc-500">(optional — pin campuses / programmes)</span>
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
                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-2">
                      Campuses
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {CAMPUSES.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleCampus(c.id)}
                          className={`text-left p-3 rounded-lg border transition-colors ${
                            campuses.has(c.id)
                              ? 'bg-orange-500/10 border-orange-500/40'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="text-sm font-medium text-white">BITS {c.name}</div>
                          <div className="text-[11px] text-zinc-500">{c.subtitle}</div>
                        </button>
                      ))}
                    </div>
                    <p className="mt-1.5 text-[11px] text-zinc-500">
                      Leave empty to see results across all three campuses.
                    </p>
                  </div>

                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-2">
                      Programmes
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {PROGRAMME_CODES.map((code) => (
                        <Chip
                          key={code}
                          active={programmes.has(code)}
                          onClick={() => toggleProgramme(code)}
                        >
                          {PROGRAMME_LABELS[code].short}
                        </Chip>
                      ))}
                    </div>
                    <p className="mt-1.5 text-[11px] text-zinc-500">
                      Leave empty for the full programme list across the chosen campuses.
                    </p>
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
          {loading ? 'Predicting…' : 'Predict my BITS programmes'}
        </button>

        <p className="mt-3 text-xs text-zinc-500">
          {regime === 'modern'
            ? 'Predictions use 4 years of final BITSAT closing scores (2022–2025).'
            : 'Legacy mode uses BITSAT closing scores from 2017–2021 (max 450).'}
          {' '}Every result shows a confidence tag.
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

            {response.success && items.length === 0 && (
              <div className="p-6 rounded-xl bg-[#151E32] border border-white/5 space-y-3">
                <div className="text-sm text-zinc-300">
                  No <span className="font-semibold text-white">Safe / Target / Reach</span> programmes
                  matched this combination.
                  {response.input_summary && (
                    <>
                      {' '}At <span className="font-semibold text-white">score {response.input_summary.score}</span>{' '}
                      (out of {response.input_summary.max_score}), every programme in your filters closes well above your score.
                    </>
                  )}
                </div>
                <div className="text-xs text-zinc-500 leading-relaxed">
                  Try removing campus or programme filters — or keep the current inputs and view the unlikely matches anyway.
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

            {response.success && items.length > 0 && (
              <div>
                {response.input_summary && (
                  <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-zinc-400">
                    Comparing your <span className="font-semibold text-zinc-200">score {response.input_summary.score}</span> against
                    {' '}{response.input_summary.regime === 'modern' ? 'BITSAT 2022–2025 (max 390)' : 'BITSAT 2017–2021 (max 450)'}.
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="text-sm text-zinc-300">
                    {isExtended ? (
                      <>Showing <span className="font-semibold text-white">all {total}</span> matching programmes</>
                    ) : (
                      <>
                        Your <span className="font-semibold text-white">top {items.length}</span> programmes
                        {total > items.length && (
                          <span className="text-zinc-500"> · {total} total matches</span>
                        )}
                      </>
                    )}
                    {viewMode === 'parent' && response.counts && (
                      <span className="text-zinc-500">
                        {' '}· {parentSummary({
                          safe: response.counts.safe,
                          target: response.counts.target,
                          reach: response.counts.reach,
                        })}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className="hidden md:inline text-[10px] uppercase tracking-wider text-zinc-500">Showing for</span>
                      <div role="group" className="inline-flex items-center gap-0.5 p-1 rounded-full bg-white/5 border border-white/10 shadow-inner">
                        <button
                          type="button"
                          onClick={() => setViewMode('student')}
                          className={`px-3 py-1 rounded-full transition-colors text-xs ${
                            viewMode === 'student'
                              ? 'bg-orange-500 text-black font-semibold shadow-sm'
                              : 'text-zinc-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          🎓 Student
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('parent')}
                          className={`px-3 py-1 rounded-full transition-colors text-xs ${
                            viewMode === 'parent'
                              ? 'bg-orange-500 text-black font-semibold shadow-sm'
                              : 'text-zinc-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          👨‍👩‍👧 Parent
                        </button>
                      </div>
                    </div>
                    {viewMode === 'student' &&
                      (['safe', 'target', 'reach'] as Bucket[]).map((b) =>
                        response.counts && response.counts[b] > 0 ? (
                          <span
                            key={b}
                            className={`px-2 py-0.5 rounded-full border ${BUCKET_META[b].badge}`}
                          >
                            {BUCKET_META[b].label} · {response.counts[b]}
                          </span>
                        ) : null,
                      )}
                  </div>
                </div>

                <div className="space-y-3">
                  {items.map((p, i) => {
                    const showSeparator = isExtended && i > 0 && i % 10 === 0;
                    const card = viewMode === 'parent' ? (
                      <ParentProgrammeRow item={p} rank={i + 1} />
                    ) : (
                      <ProgrammeRow item={p} rank={i + 1} />
                    );
                    return (
                      <div key={`${p.campus_id}-${p.programme_code}`} className="contents">
                        {showSeparator && (
                          <div className="pt-2 pb-1 flex items-center gap-3">
                            <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-semibold whitespace-nowrap">
                              Programmes {i + 1}–{Math.min(i + 10, items.length)}
                            </div>
                            <div className="flex-1 h-px bg-white/5" />
                          </div>
                        )}
                        {card}
                      </div>
                    );
                  })}
                </div>

                {/* What-if explorer — lives directly below results so a student
                    sees their current outcome FIRST, then sees the score-delta
                    impact as a follow-on. Reads the same filters as the main
                    predictor for an apples-to-apples comparison. */}
                {response.input_summary && (
                  <div className="mt-6">
                    <BitsatImpactExplorer
                      baseScore={response.input_summary.score}
                      regime={response.input_summary.regime}
                      campuses={lastBody?.campuses as string[] | undefined}
                      programmes={lastBody?.programmes as string[] | undefined}
                    />
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/[0.03] border border-white/10 p-4">
                  <div className="text-xs text-zinc-400">
                    Share a link with parents, or send them an image summary for WhatsApp.
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={copyShareLink}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-zinc-200 transition-colors"
                    >
                      {sharedCopied ? 'Link copied ✓' : 'Share link'}
                    </button>
                    {response.input_summary && (
                      <ShareCardButton
                        params={{
                          tool: 'bitsat',
                          score: response.input_summary.score,
                          regime: response.input_summary.regime,
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Drop-year CTA — quieter than primary actions, visible to
                    those who want it. */}
                {response.input_summary && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10 px-4 py-3">
                    <div className="text-xs text-zinc-400">
                      Curious what an extra year of prep could buy? See the realistic range of outcomes.
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDropYear(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-zinc-200 transition-colors"
                    >
                      Drop-year analysis →
                    </button>
                  </div>
                )}

                {truncated && (
                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={handleExpand}
                      disabled={expanding}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium text-zinc-200 disabled:opacity-60 transition-colors"
                    >
                      {expanding ? 'Loading…' : `Show all ${total} programmes →`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {response?.input_summary && (
        <DropYearAnalyzer
          open={showDropYear}
          onClose={() => setShowDropYear(false)}
          exam="bitsat"
          inputs={{
            score: response.input_summary.score,
            regime: response.input_summary.regime,
          }}
        />
      )}

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

// Compact sparkline of historical closing scores. Same visual language as the
// JoSAA predictor's CutoffSparkline, but inverted semantics: scores trend UP =
// tighter cutoff. Higher Y = higher score.
function ScoreSparkline({
  history,
  projection,
  maxScore,
}: {
  history: { year: number; cutoff_score: number }[];
  projection: number;
  maxScore: number;
}) {
  if (!history || history.length < 2) return null;
  const sorted = [...history].sort((a, b) => a.year - b.year);
  const allScores = [...sorted.map((h) => h.cutoff_score), projection];
  const minS = Math.min(...allScores);
  const maxS = Math.max(...allScores);
  const range = maxS - minS || 1;

  const W = 80;
  const H = 24;
  const PAD_X = 2;
  const PAD_Y = 3;
  const innerW = W - 2 * PAD_X;
  const innerH = H - 2 * PAD_Y;

  const totalSlots = sorted.length;
  const xAt = (i: number) => PAD_X + (i / totalSlots) * innerW;
  // Higher score → lower Y (closer to top of SVG).
  const yAt = (s: number) => PAD_Y + (1 - (s - minS) / range) * innerH;

  const points = sorted.map((h, i) => ({ x: xAt(i), y: yAt(h.cutoff_score), ...h }));
  const projX = xAt(totalSlots);
  const projY = yAt(projection);

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const first = sorted[0].cutoff_score;
  const last = sorted[sorted.length - 1].cutoff_score;
  const pctChange = ((last - first) / first) * 100;
  const trend =
    pctChange > 5
      ? `tighter by ${Math.round(pctChange)}% since ${sorted[0].year}`
      : pctChange < -5
      ? `easier by ${Math.abs(Math.round(pctChange))}% since ${sorted[0].year}`
      : `stable since ${sorted[0].year}`;
  const title =
    sorted.map((h) => `${h.year}: ${h.cutoff_score}/${maxScore}`).join(' · ') +
    ` · projected: ${Math.round(projection)}/${maxScore} · ${trend}`;

  return (
    <div className="hidden sm:block shrink-0" title={title} aria-label={title}>
      <svg width={W} height={H} className="block" aria-hidden>
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
          <circle key={p.year} cx={p.x} cy={p.y} r={1.4} className="fill-zinc-400" />
        ))}
        <circle cx={projX} cy={projY} r={1.9} className="fill-orange-400" />
      </svg>
    </div>
  );
}

function ProgrammeRow({ item, rank }: { item: ProgrammeResult; rank: number }) {
  const meta = BUCKET_META[item.bucket];
  const confidenceDots = { high: '●●●', medium: '●●○', low: '●○○' }[item.confidence];

  return (
    <div className="rounded-xl bg-[#151E32] border border-white/5 hover:border-white/10 transition-colors p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-500 tabular-nums w-5">
              #{rank}
            </span>
            <span className="text-base md:text-lg font-semibold text-white truncate">
              {item.programme_name}
            </span>
            <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${meta.badge}`}>
              {meta.label}
            </span>
          </div>
          <div className="text-xs text-zinc-500 mt-1 flex flex-wrap items-center gap-x-1.5">
            <span className="text-zinc-300 font-medium">BITS {item.campus_name}</span>
            <span>· {item.campus_state}</span>
            {item.nirf_rank_engineering && <span>· NIRF #{item.nirf_rank_engineering}</span>}
            <span className="text-zinc-600">·</span>
            <span>
              Projected close{' '}
              <span className="text-zinc-300 font-medium tabular-nums">
                {item.projected_cutoff_score}
              </span>
              <span className="text-zinc-600">/{item.max_score}</span>
            </span>
            <span className="text-zinc-600">·</span>
            <span
              className="text-zinc-400 font-mono tracking-tighter"
              title={`Confidence: ${item.confidence} — ${item.confidence_reason}`}
            >
              {confidenceDots}
            </span>
            <span className="text-zinc-500">{item.confidence}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <ScoreSparkline
            history={item.historical}
            projection={item.projected_cutoff_score}
            maxScore={item.max_score}
          />
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-400 tabular-nums">
              {item.probability_pct}%
            </div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">chance</div>
          </div>
        </div>
      </div>
    </div>
  );
}
