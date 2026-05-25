'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  ACCENT,
  AudienceToggle,
  BUCKET_COLOR,
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
import DropYearAnalyzer from '../components/DropYearAnalyzer';

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
  {
    n: '04',
    icon: 'refresh',
    color: '#c4b5fd',
    title: 'Drop-year scenarios',
    desc: 'See the realistic spread of outcomes if you put in another year — pessimistic to optimistic.',
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
}

// ── Sensitivity-chart row (from /predict-range) ──────────────────────────────
interface SensRow {
  score?: number;
  rank?: number;
  safe: number;
  target: number;
  reach: number;
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
  const [showDropYear, setShowDropYear] = useState(false);

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
            rangeRes.points.map((p: { rank: number; counts: { safe: number; target: number; reach: number } }) => ({
              rank: p.rank,
              safe: p.counts.safe ?? 0,
              target: p.counts.target ?? 0,
              reach: p.counts.reach ?? 0,
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
            rangeRes.points.map((p: { score: number; counts: { safe: number; target: number; reach: number } }) => ({
              score: p.score,
              safe: p.counts.safe ?? 0,
              target: p.counts.target ?? 0,
              reach: p.counts.reach ?? 0,
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: '100px 8px 0' }}>
      <SectionHead
        eyebrow="STEP 02 · YOUR TURN"
        titlePlain="Tell us your rank."
        titleAccent="We'll do the rest."
        sub="Four steps. Sixty seconds. A college list backed by five years of counseling data."
      />
      <TrustRow />

      {/* 4 feature cards — 2-up on mobile, 4-up at md+ so the titles don't
          wrap to 5 lines at narrow widths. Tailwind grid utilities keep this
          declarative inside the otherwise-inline-style component. */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[18px] mb-12">
        {FEATURES.map((f) => (
          <FeatureCard key={f.n} f={f} />
        ))}
      </div>

      {/* Exam tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div
          style={{
            display: 'inline-flex',
            padding: 6,
            gap: 4,
            borderRadius: 999,
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {([
            { id: 'jee' as const, label: 'JEE Main', sub: 'NIT · IIIT · GFTI' },
            { id: 'bitsat' as const, label: 'BITSAT', sub: 'BITS Pilani · Goa · Hyderabad' },
          ]).map((t) => {
            const active = exam === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setExam(t.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                  background: active ? `linear-gradient(180deg, ${ACCENT}, #f97316)` : 'transparent',
                  color: active ? '#0a0a0f' : '#cfcfd6',
                  fontFamily: 'inherit',
                  fontSize: 13.5,
                  fontWeight: active ? 700 : 500,
                  letterSpacing: '-0.005em',
                  boxShadow: active ? `0 6px 16px -8px ${ACCENT}aa` : 'none',
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>{t.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    opacity: active ? 0.65 : 0.5,
                    fontWeight: active ? 600 : 400,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {t.sub}
                </span>
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
                · {totalCount ?? 0} total matches ·{' '}
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

          {/* Share row + drop-year link */}
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
            <div
              style={{
                padding: '18px 22px',
                borderRadius: 14,
                background: 'linear-gradient(180deg, rgba(20,22,34,0.4), rgba(12,13,22,0.55))',
                border: '1px solid rgba(255,255,255,0.05)',
                borderLeft: '2px solid #c4b5fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 14,
              }}
            >
              <div style={{ color: '#cfcfd6', fontSize: 14 }}>
                <span style={{ color: '#f5f5f7', fontWeight: 600 }}>Curious about another year of prep?</span>{' '}
                See the realistic range of outcomes if you dropped a year.
              </div>
              <button
                type="button"
                onClick={() => setShowDropYear(true)}
                style={{
                  padding: '9px 16px',
                  borderRadius: 999,
                  background: 'rgba(196,181,253,0.1)',
                  border: '1px solid rgba(196,181,253,0.3)',
                  color: '#ddd6fe',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Drop-year analysis →
              </button>
            </div>
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
      <DropYearAnalyzer
        open={showDropYear}
        onClose={() => setShowDropYear(false)}
        exam={exam === 'jee' ? 'jee_main' : 'bitsat'}
        inputs={
          exam === 'jee'
            ? { rank, category, gender: 'Gender-Neutral', home_state: homeState }
            : { score, regime: paper }
        }
      />
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
  return (
    <div
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
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateX(2px)';
      }}
      onMouseLeave={(e) => {
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
            style={{
              padding: '2.5px 7px',
              borderRadius: 5,
              border: `1px solid ${palette.border}`,
              background: palette.bg,
              color: palette.fg,
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: '0.16em',
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
      </div>
    </div>
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
  const totals = points.map((p) => p.safe + p.target + p.reach);
  const maxTotal = Math.max(...totals, 1);
  const barMaxHeight = 240;

  const delta = sel
    ? exam === 'jee'
      ? (sel.rank ?? 0) - userValue
      : (sel.score ?? 0) - userValue
    : 0;
  const safeDelta = sel ? sel.safe - (current?.safe ?? 0) : 0;

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
        Each bar is what the predictor would have said at that {exam === 'jee' ? 'rank' : 'score'}. Hover any bar
        to see the diff against your current input.
      </p>

      {/* Bars — on mobile we allow horizontal scroll so 9 bars don't squish
          below readable width. Each bar gets a min-width of 60px on small. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${points.length}, minmax(60px, 1fr))`,
          gap: 10,
          alignItems: 'end',
          marginTop: 28,
          height: barMaxHeight + 70,
          overflowX: 'auto',
        }}
      >
        {points.map((p, i) => {
          const t = p.safe + p.target + p.reach;
          const h = (t / maxTotal) * barMaxHeight;
          const safeH = (p.safe / Math.max(t, 1)) * h;
          const targetH = (p.target / Math.max(t, 1)) * h;
          const reachH = (p.reach / Math.max(t, 1)) * h;
          const isYou = i === userIdx;
          const isHover = i === activeIdx;
          const labelValue = exam === 'jee' ? (p.rank ?? 0).toLocaleString('en-IN') : (p.score ?? 0);
          return (
            <button
              key={i}
              type="button"
              onClick={() => setHover(i)}
              onMouseEnter={() => setHover(i)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
                height: barMaxHeight + 70,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  color: isHover ? '#f5f5f7' : '#5e5e6a',
                  fontSize: 11.5,
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: 6,
                  transition: 'color 0.15s',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {t}
              </span>
              <div
                style={{
                  width: '100%',
                  maxWidth: 78,
                  height: h,
                  position: 'relative',
                  borderRadius: 6,
                  overflow: 'hidden',
                  outline: isHover ? `2px solid ${ACCENT}` : 'none',
                  outlineOffset: 2,
                  transition: 'outline 0.15s',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: safeH,
                    background: isHover ? 'linear-gradient(180deg, #34d399, #10b981)' : 'rgba(16,185,129,0.55)',
                    transition: 'background 0.15s',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: safeH,
                    height: targetH,
                    background: isHover ? 'linear-gradient(180deg, #fbbf24, #f59e0b)' : 'rgba(245,158,11,0.55)',
                    transition: 'background 0.15s',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: safeH + targetH,
                    height: reachH,
                    background: isHover ? 'linear-gradient(180deg, #7dd3fc, #38bdf8)' : 'rgba(56,189,248,0.55)',
                    transition: 'background 0.15s',
                  }}
                />
              </div>
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

      <div style={{ display: 'flex', gap: 16, marginTop: 22, flexWrap: 'wrap' }}>
        {[
          { k: 'SAFE', color: '#34d399', label: 'Safe' },
          { k: 'TARGET', color: '#fbbf24', label: 'Target' },
          { k: 'REACH', color: '#7dd3fc', label: 'Reach' },
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
              {sel?.safe ?? 0} Safe · {sel?.target ?? 0} Target · {sel?.reach ?? 0} Reach.
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
                ({safeDelta > 0 ? `+${safeDelta}` : safeDelta} Safe vs your current)
              </span>
            </>
          )}
        </div>
        {delta !== 0 && (
          <div style={{ marginTop: 6, color: safeDelta < 0 ? '#fb7185' : '#34d399', fontSize: 13, fontWeight: 600 }}>
            {safeDelta < 0 ? (
              <>
                You&apos;d lose: <span style={{ fontWeight: 700 }}>{Math.abs(safeDelta)} Safe colleges</span> — a
                reminder of what your current {exam === 'jee' ? 'rank' : 'score'} has already earned you.
              </>
            ) : (
              <>
                You&apos;d unlock: <span style={{ fontWeight: 700 }}>{safeDelta} more Safe colleges</span>.
              </>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: 14,
          color: '#5e5e6a',
          fontSize: 11.5,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        hover any bar · bar heights show total Safe + Target + Reach at that {exam === 'jee' ? 'rank' : 'score'}
      </div>
    </div>
  );
}
