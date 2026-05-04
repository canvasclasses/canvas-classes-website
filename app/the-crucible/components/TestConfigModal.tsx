"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { X, Bookmark } from 'lucide-react';
import { Chapter, Question } from './types';
import { TAXONOMY_FROM_CSV } from '@/app/crucible/admin/taxonomy/taxonomyData_from_csv';
import { NCERT_TOPIC_ORDER } from '@/app/the-crucible/lib/ncertTopicOrder';
import { createClient as createSupabaseClient } from '@/app/utils/supabase/client';
import { track } from '@/lib/analytics/mixpanel';

// ─────────────────── Types ───────────────────
export type DifficultyMix = 'balanced' | 'easy' | 'hard' | 'pyq' | 'custom';
export type QuestionSort = 'random' | 'difficulty' | 'topic';
export type PoolFilter = 'all' | 'unseen' | 'attempted' | 'wrong';
export type PoolSubset = 'unseen' | 'attempted' | 'wrong';

export interface CustomMixWeights {
  easy: number;
  medium: number;
  hard: number;
}

export interface TestStartConfig {
  count: number;
  mix: DifficultyMix;
  /** Only set when mix === 'custom'. Raw percentages — generator normalises. */
  customMix?: CustomMixWeights;
  sort: QuestionSort;
  topicIds: string[];        // empty array = all topics implicitly
  /** Single-value summary of the multi-select pool toggles for legacy
   *  consumers — reflects the most-specific selection. The eligibility set
   *  below is the authoritative filter. */
  poolFilter: PoolFilter;
  useStarOnly: boolean;
  // Pre-computed eligibility set the modal already filtered to.
  eligibleQuestionIds: string[];
}

// ─────────────────── Constants ───────────────────
const CAT_COLOR: Record<string, string> = {
  Physical: '#38bdf8',
  Organic: '#c084fc',
  Inorganic: '#34d399',
  Practical: '#fbbf24',
};
const catAccent = (cat?: string): string => CAT_COLOR[cat ?? ''] ?? '#fb923c';

// Quick-start presets — 4 entries. "Resume last" reads from localStorage and
// replays the user's most recent test config for this chapter (audit follow-
// up: replaces the old no-op "Custom" preset which was a redundant button).
type QuickPresetId = 'daily' | 'mock' | 'cram' | 'last';
interface QuickPreset {
  id: QuickPresetId;
  label: string;
  q: number;
  durMin: number;
  mix: DifficultyMix;
}
const BASE_PRESETS: QuickPreset[] = [
  { id: 'daily',  label: 'Daily Drill',  q: 10, durMin: 15, mix: 'balanced' },
  { id: 'mock',   label: 'Weekly Mock',  q: 40, durMin: 60, mix: 'balanced' },
  { id: 'cram',   label: 'Cram Mode',    q: 60, durMin: 90, mix: 'pyq' },
];

const DIFFICULTY_OPTIONS: Array<{ id: Exclude<DifficultyMix, 'custom'>; label: string; color: string }> = [
  { id: 'easy',     label: 'Warm Up',   color: '#34d399' },
  { id: 'balanced', label: 'Balanced',  color: '#c084fc' },
  { id: 'hard',     label: 'Challenge', color: '#f87171' },
  { id: 'pyq',      label: 'PYQ Only',  color: '#fbbf24' },
];

// Each named preset implies a representative difficulty distribution shown on
// the always-visible composition strip + legend. The generator still uses its
// own per-tier multipliers for the non-custom presets — these percentages are
// purely for visualisation.
const PRESET_DISTRIBUTION: Record<Exclude<DifficultyMix, 'custom'>, CustomMixWeights> = {
  easy:     { easy: 55, medium: 35, hard: 10 },  // Warm Up
  balanced: { easy: 33, medium: 34, hard: 33 },
  hard:     { easy: 10, medium: 40, hard: 50 },  // Challenge
  pyq:      { easy: 25, medium: 50, hard: 25 },
};

const SORT_OPTIONS: Array<{ id: QuestionSort; label: string; desc: string; icon: string }> = [
  { id: 'random',     label: 'Random',      desc: 'Shuffled', icon: '⟳' },
  { id: 'difficulty', label: 'Easy → Hard', desc: 'Gradual',  icon: '↗' },
  { id: 'topic',      label: 'By Topic',    desc: 'Grouped',  icon: '☷' },
];

const COUNT_CHIPS = [10, 25, 50, 100];

const LAST_CONFIG_KEY_PREFIX = 'crucible:last-test-config:';

interface LastConfigSnapshot {
  count: number;
  mix: DifficultyMix;
  customMix?: CustomMixWeights;
  ts: number;
}

function readLastConfig(chapterId: string | undefined): LastConfigSnapshot | null {
  if (!chapterId || typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LAST_CONFIG_KEY_PREFIX + chapterId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastConfigSnapshot;
    if (typeof parsed.count !== 'number' || typeof parsed.mix !== 'string') return null;
    return parsed;
  } catch { return null; }
}
function writeLastConfig(chapterId: string | undefined, snap: LastConfigSnapshot): void {
  if (!chapterId || typeof window === 'undefined') return;
  try { window.localStorage.setItem(LAST_CONFIG_KEY_PREFIX + chapterId, JSON.stringify(snap)); } catch { /* quota */ }
}
function relativeAge(ts: number): string {
  const sec = Math.floor((Date.now() - ts) / 1000);
  if (sec < 60) return 'just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  const days = Math.floor(sec / 86400);
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ─────────────────── Component ───────────────────
export default function TestConfigModal({
  chapter,
  questions = [],
  maxQ,
  starQuestionCount = 0,
  onStart,
  onClose,
}: {
  chapter?: Chapter;
  questions?: Question[];
  maxQ?: number;
  starQuestionCount?: number;
  onStart: (config: TestStartConfig) => void;
  onClose: () => void;
}) {
  const accent = catAccent(chapter?.category);
  const chapterId = chapter?.id ?? '';
  const totalQs = questions.length > 0 ? questions.length : (maxQ ?? 0);
  const richMode = !!chapter && questions.length > 0;

  // ── Last config (drives the "Resume last" preset) ──
  const lastConfig = useMemo(() => readLastConfig(chapterId), [chapterId]);

  const PRESETS: QuickPreset[] = useMemo(() => {
    if (!lastConfig) return BASE_PRESETS;
    return [
      ...BASE_PRESETS,
      { id: 'last' as const, label: 'Resume last', q: lastConfig.count, durMin: Math.max(1, Math.round(lastConfig.count * 1.5)), mix: lastConfig.mix },
    ];
  }, [lastConfig]);

  // ── User progress (drives Pool counts + topic mastery) ──
  type AttemptRow = { question_id: string; times_attempted: number; times_correct: number };
  const [attempted, setAttempted] = useState<AttemptRow[]>([]);
  const [progressLoaded, setProgressLoaded] = useState(false);

  useEffect(() => {
    if (!richMode || !chapterId) { setProgressLoaded(true); return; }
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseClient();
        if (!supabase) { setProgressLoaded(true); return; }
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) { setProgressLoaded(true); return; }
        const res = await fetch(`/api/v2/user/progress?chapterId=${chapterId}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) { setProgressLoaded(true); return; }
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data.attempted_ids)) setAttempted(data.attempted_ids);
        setProgressLoaded(true);
      } catch {
        if (!cancelled) setProgressLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [chapterId, richMode]);

  // ── Pool sets ──
  const { unseenIds, attemptedIds, wrongIds } = useMemo(() => {
    const attMap = new Map(attempted.map(a => [a.question_id, a]));
    const unseen = new Set<string>();
    const att = new Set<string>();
    const wrong = new Set<string>();
    for (const q of questions) {
      const row = attMap.get(q.id);
      if (!row) { unseen.add(q.id); continue; }
      att.add(q.id);
      if (row.times_correct < row.times_attempted) wrong.add(q.id);
    }
    return { unseenIds: unseen, attemptedIds: att, wrongIds: wrong };
  }, [attempted, questions]);

  // ── Topic taxonomy + per-topic mastery + weak detection ──
  const topics = useMemo(() => {
    const list = (TAXONOMY_FROM_CSV as Array<{ type?: string; parent_id?: string; id?: string; name?: string }>)
      .filter(n => n.type === 'topic' && n.parent_id === chapterId)
      .map(n => ({ id: n.id || '', name: n.name || '' }));
    const order = NCERT_TOPIC_ORDER[chapterId];
    if (!order) return list;
    return [...list].sort((a, b) => {
      const ai = order.indexOf(a.id); const bi = order.indexOf(b.id);
      return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
    });
  }, [chapterId]);

  const topicMeta = useMemo(() => {
    const counts = new Map<string, number>();
    const agg = new Map<string, { att: number; cor: number }>();

    // Per-topic question count
    const tagsByQ = new Map<string, string[]>();
    for (const q of questions) {
      const tags = (q.metadata.tags ?? []).map(t => t.tag_id);
      tagsByQ.set(q.id, tags);
      for (const t of tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    // Per-topic accuracy from attempted history
    for (const a of attempted) {
      const tags = tagsByQ.get(a.question_id) ?? [];
      for (const t of tags) {
        const cur = agg.get(t) ?? { att: 0, cor: 0 };
        cur.att += a.times_attempted ?? 1;
        cur.cor += a.times_correct ?? 0;
        agg.set(t, cur);
      }
    }
    return new Map(
      topics.map(t => {
        const total = counts.get(t.id) ?? 0;
        const a = agg.get(t.id);
        const mastery = a && a.att > 0 ? a.cor / a.att : null;        // null = no signal yet
        const weak = !!(a && a.att >= 3 && (a.cor / a.att) < 0.6);
        return [t.id, { total, mastery, weak }] as const;
      })
    );
  }, [topics, questions, attempted]);

  // ── Form state ──
  const [activePreset, setActivePreset] = useState<QuickPresetId>('mock');
  const [count, setCount] = useState(40);
  const [mix, setMix] = useState<DifficultyMix>('balanced');
  const [sort, setSort] = useState<QuestionSort>('random');

  // Pool: multi-select. Default = unseen only (sensible default — prioritise
  // fresh questions over re-attempts).
  const [poolFilters, setPoolFilters] = useState<Set<PoolSubset>>(new Set(['unseen']));

  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set()); // empty = all
  const [useStarOnly, setUseStarOnly] = useState(false);
  const [customMix, setCustomMix] = useState<CustomMixWeights>({ easy: 33, medium: 34, hard: 33 });

  // ── Eligibility ──
  const eligibleIds = useMemo(() => {
    if (!richMode) return new Set<string>();
    let pool: Set<string>;
    if (poolFilters.size === 0) {
      pool = new Set(questions.map(q => q.id));
    } else {
      pool = new Set();
      if (poolFilters.has('unseen')) for (const id of unseenIds) pool.add(id);
      if (poolFilters.has('attempted')) for (const id of attemptedIds) pool.add(id);
      if (poolFilters.has('wrong')) for (const id of wrongIds) pool.add(id);
    }
    if (selectedTopics.size > 0) {
      const inTopics = new Set<string>();
      for (const q of questions) {
        if (!pool.has(q.id)) continue;
        if ((q.metadata.tags ?? []).some(t => selectedTopics.has(t.tag_id))) inTopics.add(q.id);
      }
      pool = inTopics;
    }
    return pool;
  }, [richMode, poolFilters, selectedTopics, unseenIds, attemptedIds, wrongIds, questions]);

  const sliderMax = richMode ? eligibleIds.size : Math.max(totalQs, 1);
  const safeCount = Math.min(count, Math.max(sliderMax, 1));
  const canStart = sliderMax > 0 && safeCount > 0;

  useEffect(() => {
    if (count > sliderMax && sliderMax > 0) setCount(sliderMax);
  }, [sliderMax]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Preset application ──
  const applyPreset = (p: QuickPreset) => {
    setActivePreset(p.id);
    setCount(Math.min(p.q, totalQs > 0 ? totalQs : p.q));
    setMix(p.mix);
    if (p.id === 'last' && lastConfig?.customMix) setCustomMix(lastConfig.customMix);
    else if (p.mix !== 'custom') setCustomMix(PRESET_DISTRIBUTION[p.mix as Exclude<DifficultyMix, 'custom'>]);
  };

  // Manual edits to count/mix break preset alignment → set activePreset to null
  // (no preset highlighted). We don't have a "custom preset" anymore.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const preset = PRESETS.find(p => p.id === activePreset);
    if (!preset) return;
    const matchesCount = preset.q === count;
    const matchesMix = preset.mix === mix;
    if (!matchesCount || !matchesMix) {
      // Use a sentinel — keep activePreset as-is but visual-clear via a separate flag.
      // Simpler: just clear it.
      setActivePreset('' as QuickPresetId);
    }
  }, [count, mix]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Star availability ──
  const canUseStarFilter = starQuestionCount > 0 && starQuestionCount >= safeCount;

  // ── Topic helpers ──
  const toggleTopic = (id: string) => {
    setSelectedTopics(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const selectTopics = (which: 'all' | 'weak' | 'none') => {
    if (which === 'all') setSelectedTopics(new Set(topics.map(t => t.id)));
    else if (which === 'none') setSelectedTopics(new Set());
    else {
      const weak = topics.filter(t => topicMeta.get(t.id)?.weak).map(t => t.id);
      setSelectedTopics(new Set(weak));
    }
  };

  const togglePool = (key: PoolSubset) => {
    setPoolFilters(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const ratio: CustomMixWeights = mix === 'custom'
    ? customMix
    : PRESET_DISTRIBUTION[mix as Exclude<DifficultyMix, 'custom'>];

  // Estimate minutes from per-tier baseline weights (1.0 / 1.5 / 2.2 min)
  const minPerQ = (ratio.easy * 1.0 + ratio.medium * 1.5 + ratio.hard * 2.2) / 100;
  const estMin = Math.max(1, Math.round(safeCount * minPerQ));
  const weakSelected = topics.filter(t => selectedTopics.has(t.id) && topicMeta.get(t.id)?.weak).length;

  // Custom slider with auto-rebalance — moving one bucket re-distributes the
  // remaining percentage across the other two proportionally to their existing
  // share, so the sum always stays at 100 without the student doing math.
  const setCustomBucket = (key: keyof CustomMixWeights, val: number) => {
    val = Math.max(0, Math.min(100, val));
    const others = (['easy', 'medium', 'hard'] as Array<keyof CustomMixWeights>).filter(k => k !== key);
    const otherSum = (customMix[others[0]] + customMix[others[1]]) || 1;
    const remaining = 100 - val;
    const next: CustomMixWeights = { ...customMix, [key]: val };
    next[others[0]] = Math.round(customMix[others[0]] / otherSum * remaining);
    next[others[1]] = 100 - val - next[others[0]];
    setCustomMix(next);
    setMix('custom');
  };

  const handleStart = () => {
    if (!canStart) return;
    // Single-value summary for legacy poolFilter consumers + analytics.
    const poolFilterSummary: PoolFilter =
      poolFilters.size === 0 || poolFilters.size === 3 ? 'all' :
        poolFilters.has('unseen') ? 'unseen' :
          poolFilters.has('wrong') ? 'wrong' : 'attempted';

    track('test_started', {
      chapter_id: chapter?.id,
      preset: activePreset || 'manual',
      count: safeCount,
      mix,
      sort,
      pool_filters: [...poolFilters],
      topics_selected: selectedTopics.size,
      topics_total: topics.length,
      star_only: canUseStarFilter && useStarOnly,
    });

    // Persist this config so "Resume last" can replay it next time.
    writeLastConfig(chapter?.id, { count: safeCount, mix, customMix: mix === 'custom' ? customMix : undefined, ts: Date.now() });

    onStart({
      count: safeCount,
      mix,
      customMix: mix === 'custom' ? customMix : undefined,
      sort,
      topicIds: selectedTopics.size > 0 ? [...selectedTopics] : [],
      poolFilter: poolFilterSummary,
      useStarOnly: canUseStarFilter && useStarOnly,
      eligibleQuestionIds: [...eligibleIds],
    });
  };

  // ─────────────────── Render ───────────────────
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-stretch lg:items-center justify-center p-0 lg:p-8"
      style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(14px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-none lg:max-w-[1000px] h-full lg:h-auto lg:max-h-[94vh] overflow-hidden lg:rounded-3xl shadow-2xl flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #15151D 0%, #0F0F16 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Ambient accent wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(700px 400px at 90% -10%, ${accent}1F, transparent 60%),
              radial-gradient(500px 400px at -10% 110%, ${accent}10, transparent 65%)
            `,
          }}
        />

        {/* HEADER */}
        <header className="relative flex items-start justify-between px-4 lg:px-7 pt-4 lg:pt-6 pb-2 lg:pb-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
                {chapter ? `${chapter.category ? chapter.category + ' · ' : ''}${chapter.name}` : 'Custom Test'}
              </span>
              {totalQs > 0 && (
                <span className="text-[10.5px] text-white/40 font-mono normal-case tracking-normal">
                  · {totalQs} questions
                </span>
              )}
            </div>
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-white">Configure Test</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/55 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* BODY — 2 columns lg+, single column mobile */}
        <div className="relative flex-1 overflow-y-auto">
          <div className={`grid grid-cols-1 ${richMode ? 'lg:grid-cols-[1fr_360px]' : ''} gap-0`}>

            {/* LEFT COLUMN ─────────────── */}
            <div className={`px-4 lg:px-7 pt-3 lg:pt-4 pb-4 lg:pb-5 space-y-4 lg:space-y-5 ${richMode ? 'lg:border-r lg:pr-5 border-white/[0.05]' : ''}`}>

              {/* QUICK START */}
              <section>
                <SectionHead label="Quick start" hint="One tap to begin" />
                <div className={`grid gap-2 ${PRESETS.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                  {PRESETS.map(p => {
                    const active = activePreset === p.id;
                    const meta = p.id === 'last' && lastConfig
                      ? `${p.q}Q · ${p.durMin}m · ${relativeAge(lastConfig.ts)}`
                      : `${p.q}Q · ${p.durMin}m`;
                    return (
                      <button
                        key={p.id}
                        onClick={() => applyPreset(p)}
                        className="rounded-xl px-3 py-2.5 text-left transition-all"
                        style={active ? {
                          background: `linear-gradient(180deg, ${accent}26 0%, ${accent}08 100%)`,
                          border: `1px solid ${accent}80`,
                        } : {
                          background: 'rgba(255,255,255,0.025)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <div className="text-[12.5px] font-bold leading-tight text-white truncate">{p.label}</div>
                        <div className="text-[10.5px] font-mono mt-1 text-white/45 truncate">{meta}</div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* QUESTION POOL — multi-select toggles */}
              {richMode && (
                <section>
                  <SectionHead
                    label="Question pool"
                    hint={progressLoaded
                      ? ([...poolFilters].map(p => p === 'unseen' ? 'Unseen' : p === 'attempted' ? 'Attempted' : 'Got wrong').join(' · ') || 'None selected')
                      : 'Loading…'}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <PoolToggle on={poolFilters.has('unseen')}    label="Unseen"    count={unseenIds.size}    color="#34D399" onClick={() => togglePool('unseen')} />
                    <PoolToggle on={poolFilters.has('attempted')} label="Attempted" count={attemptedIds.size} color={accent}    onClick={() => togglePool('attempted')} />
                    <PoolToggle on={poolFilters.has('wrong')}     label="Got wrong" count={wrongIds.size}     color="#F87171" onClick={() => togglePool('wrong')} />
                  </div>
                </section>
              )}

              {/* QUESTION COUNT */}
              <section>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/55">Question count</span>
                  <span className="font-mono text-[14px] tabular-nums text-white">
                    {safeCount}<span className="text-white/40"> / {sliderMax || totalQs}</span>
                  </span>
                </div>
                <CountSliderWithTicks
                  value={safeCount}
                  max={Math.max(sliderMax, 100)}
                  ticks={COUNT_CHIPS.filter(n => n <= sliderMax)}
                  accent={accent}
                  onChange={setCount}
                />
              </section>

              {/* DIFFICULTY MIX */}
              <section>
                <div className="flex items-baseline justify-between mb-2.5">
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/55">Difficulty mix</span>
                  <button
                    onClick={() => setMix(mix === 'custom' ? 'balanced' : 'custom')}
                    className="text-[10.5px] font-bold uppercase tracking-[0.08em] transition-colors"
                    style={{ color: mix === 'custom' ? accent : 'rgba(232,232,240,0.45)' }}
                  >
                    {mix === 'custom' ? '✓ Custom mix' : 'Customize'}
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5 mb-3">
                  {DIFFICULTY_OPTIONS.map(o => {
                    const active = mix === o.id;
                    return (
                      <button
                        key={o.id}
                        onClick={() => { setMix(o.id); setCustomMix(PRESET_DISTRIBUTION[o.id]); }}
                        className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-[12.5px] font-semibold transition-all"
                        style={active ? {
                          background: `linear-gradient(180deg, ${o.color}26, ${o.color}10)`,
                          border: `1px solid ${o.color}80`,
                          color: '#fff',
                        } : {
                          background: 'rgba(255,255,255,0.025)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          color: 'rgba(232,232,240,0.7)',
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: o.color }} />
                        {o.label}
                      </button>
                    );
                  })}
                </div>

                {/* Composition strip — always visible */}
                <div className="flex h-1.5 rounded overflow-hidden bg-white/[0.04] mb-1.5">
                  <div style={{ flex: ratio.easy,   background: '#34D399', minWidth: ratio.easy   ? 4 : 0 }} />
                  <div style={{ flex: ratio.medium, background: '#FBBF24', minWidth: ratio.medium ? 4 : 0 }} />
                  <div style={{ flex: ratio.hard,   background: '#F87171', minWidth: ratio.hard   ? 4 : 0 }} />
                </div>
                <div className="flex gap-4 text-[11px] font-mono text-white/60">
                  <LegendDot color="#34D399" label={`Easy ${ratio.easy}%`} />
                  <LegendDot color="#FBBF24" label={`Medium ${ratio.medium}%`} />
                  <LegendDot color="#F87171" label={`Hard ${ratio.hard}%`} />
                </div>

                {/* Sliders — only when Custom is active */}
                {mix === 'custom' && (
                  <div
                    className="mt-3 rounded-xl p-3.5 space-y-2.5"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <DiffSlider label="Easy"   value={customMix.easy}   color="#34D399" onChange={v => setCustomBucket('easy', v)} />
                    <DiffSlider label="Medium" value={customMix.medium} color="#FBBF24" onChange={v => setCustomBucket('medium', v)} />
                    <DiffSlider label="Hard"   value={customMix.hard}   color="#F87171" onChange={v => setCustomBucket('hard', v)} />
                  </div>
                )}
              </section>

              {/* QUESTION ORDER */}
              <section>
                <SectionHead label="Question order" />
                <div className="grid grid-cols-3 gap-1.5">
                  {SORT_OPTIONS.map(o => {
                    const active = sort === o.id;
                    return (
                      <button
                        key={o.id}
                        onClick={() => setSort(o.id)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all"
                        style={active ? {
                          background: `linear-gradient(180deg, ${accent}26 0%, ${accent}08 100%)`,
                          border: `1px solid ${accent}80`,
                          color: '#fff',
                        } : {
                          background: 'rgba(255,255,255,0.025)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          color: 'rgba(232,232,240,0.7)',
                        }}
                      >
                        <span className="w-6 h-6 rounded-md flex items-center justify-center text-[13px] shrink-0"
                          style={{ background: 'rgba(255,255,255,0.04)', color: active ? accent : 'rgba(232,232,240,0.55)' }}>
                          {o.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="text-[12.5px] font-semibold leading-tight">{o.label}</div>
                          <div className="text-[10.5px] font-mono text-white/45 mt-0.5">{o.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* STAR-MARKED — switch */}
              {starQuestionCount > 0 && (
                <button
                  onClick={() => canUseStarFilter && setUseStarOnly(v => !v)}
                  disabled={!canUseStarFilter}
                  className="w-full flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={useStarOnly ? {
                    background: 'rgba(251,191,36,0.06)',
                    border: '1px solid rgba(251,191,36,0.25)',
                  } : {
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <Bookmark className="w-4 h-4 shrink-0" style={{ color: useStarOnly ? '#fbbf24' : 'rgba(255,255,255,0.4)' }} fill={useStarOnly ? '#fbbf24' : 'none'} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-white">Star-marked questions only</div>
                    <div className="text-[11px] mt-0.5" style={{ color: useStarOnly ? 'rgba(251,191,36,0.7)' : 'rgba(255,255,255,0.5)' }}>
                      {canUseStarFilter
                        ? `${starQuestionCount} hand-picked from this chapter`
                        : `Need ${safeCount} stars (only ${starQuestionCount})`}
                    </div>
                  </div>
                  {/* Switch */}
                  <div
                    className="relative w-9 h-5 rounded-full transition-colors shrink-0"
                    style={{ background: useStarOnly ? '#FBBF24' : 'rgba(255,255,255,0.10)' }}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                      style={{ left: 2, transform: useStarOnly ? 'translateX(16px)' : 'none' }}
                    />
                  </div>
                </button>
              )}
            </div>

            {/* RIGHT COLUMN — Topics + Test Summary */}
            {richMode && (
              <aside className="px-4 lg:px-6 pt-3 lg:pt-4 pb-4 lg:pb-5 flex flex-col gap-3 min-h-0">
                {/* Topics card */}
                <div
                  className="flex-1 flex flex-col min-h-0 rounded-xl p-3.5"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div className="flex items-baseline justify-between mb-2.5">
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/55 inline-flex items-center gap-2">
                      Topics
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded normal-case tracking-normal"
                        style={{ background: `${accent}26`, color: accent }}
                      >
                        {selectedTopics.size > 0 ? `${selectedTopics.size}/${topics.length}` : `${topics.length}/${topics.length}`}
                      </span>
                    </span>
                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider">
                      <button onClick={() => selectTopics('all')} className="px-1 transition-colors" style={{ color: accent }}>All</button>
                      <span className="text-white/15">·</span>
                      <button onClick={() => selectTopics('weak')} className="px-1 transition-colors" style={{ color: accent }}>Weak</button>
                      <span className="text-white/15">·</span>
                      <button onClick={() => selectTopics('none')} className="px-1 transition-colors" style={{ color: accent }}>None</button>
                    </div>
                  </div>

                  {/* Topics list — natural height so all chips are visible at
                      a glance. The modal body itself scrolls if the column
                      runs longer than the viewport. */}
                  <div className="flex flex-col gap-1">
                    {topics.length === 0 && (
                      <div className="text-[12px] text-white/35 italic py-3 text-center">No topics defined for this chapter.</div>
                    )}
                    {topics.map(t => {
                      const meta = topicMeta.get(t.id);
                      if (!meta || meta.total === 0) return null;
                      const on = selectedTopics.has(t.id);
                      const masteryColor = meta.mastery == null
                        ? 'rgba(255,255,255,0.18)'
                        : meta.mastery > 0.7 ? '#34D399' : meta.mastery > 0.5 ? '#FBBF24' : '#F87171';
                      const masteryWidth = meta.mastery == null ? 0 : meta.mastery * 100;
                      return (
                        <button
                          key={t.id}
                          onClick={() => toggleTopic(t.id)}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors"
                          style={on ? {
                            background: `${accent}10`,
                            border: `1px solid ${accent}30`,
                          } : {
                            background: 'transparent',
                            border: '1px solid transparent',
                          }}
                        >
                          {/* Checkbox */}
                          <div
                            className="w-4 h-4 rounded border-[1.5px] flex items-center justify-center shrink-0 transition-colors"
                            style={on ? { background: accent, borderColor: accent } : { borderColor: 'rgba(255,255,255,0.18)' }}
                          >
                            {on && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                                <polyline points="5 12 10 17 19 8" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-[12.5px] font-medium" style={{ color: on ? '#fff' : 'rgba(232,232,240,0.78)' }}>
                              {meta.weak && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#FBBF24' }} title="Weak topic" />}
                              <span className="truncate">{t.name}</span>
                            </div>
                            <div className="mt-1 h-[2px] rounded-full bg-white/[0.05] overflow-hidden">
                              <div
                                className="h-full transition-all"
                                style={{ width: `${masteryWidth}%`, background: masteryColor }}
                              />
                            </div>
                          </div>
                          <div className="text-[11px] font-mono text-white/40 shrink-0">{meta.total}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Test Summary card */}
                <div
                  className="rounded-xl p-3.5"
                  style={{
                    background: `linear-gradient(180deg, ${accent}14 0%, ${accent}04 100%)`,
                    border: `1px solid ${accent}33`,
                  }}
                >
                  <div className="flex items-baseline justify-between mb-2.5">
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
                      Test Summary
                    </span>
                    <span className="text-[10.5px] font-mono text-white/50">
                      {weakSelected > 0 ? `${weakSelected} weak topic${weakSelected === 1 ? '' : 's'}` : 'all areas'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <div className="flex-1 text-center">
                      <div className="font-mono text-[28px] font-medium leading-none text-white">{safeCount}</div>
                      <div className="text-[10.5px] uppercase tracking-[0.08em] text-white/50 mt-1.5">Questions</div>
                    </div>
                    <div className="w-px h-9 bg-white/[0.08]" />
                    <div className="flex-1 text-center">
                      <div className="font-mono text-[28px] font-medium leading-none text-white">{estMin}</div>
                      <div className="text-[10.5px] uppercase tracking-[0.08em] text-white/50 mt-1.5">Min est.</div>
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>

        {/* FOOTER — sticky at the bottom of the modal. Two-row stack on
            mobile (metric above the button row) so the Start Test button gets
            the full width it deserves; single row on desktop. */}
        <footer
          className="relative flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3.5 px-4 lg:px-7 py-3 lg:py-3.5 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.25)' }}
        >
          {/* Metric strip — its own row on mobile, inline on desktop */}
          <div className="order-1 lg:order-2 flex-1 flex items-center justify-center lg:justify-start gap-1.5 text-[11.5px] lg:text-[12px]">
            {canStart ? (
              <>
                <span className="font-mono font-semibold text-white text-[12.5px] lg:text-[13px]">{safeCount}</span>
                <span className="text-white/55">questions</span>
                <span className="text-white/25">·</span>
                <span className="font-mono font-semibold text-white text-[12.5px] lg:text-[13px]">{estMin}</span>
                <span className="text-white/55">min</span>
                <span className="text-white/25">·</span>
                <span className="text-white/55">
                  {mix === 'custom' ? 'Custom' : DIFFICULTY_OPTIONS.find(d => d.id === mix)?.label ?? '—'}
                </span>
              </>
            ) : (
              <span className="text-red-300/80">No questions match your filters</span>
            )}
          </div>

          {/* Button row — Cancel + Start Test side by side; on mobile Start
              expands to fill remaining width. */}
          <div className="order-2 lg:order-1 lg:contents flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="order-1 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white/70 border border-white/10 hover:bg-white/5 transition-colors shrink-0"
            >
              Cancel
            </button>
            <button
              onClick={handleStart}
              disabled={!canStart}
              className="order-3 flex-1 lg:flex-none lg:min-w-[220px] flex items-center justify-center gap-2.5 px-6 lg:px-8 py-3 rounded-xl text-[13.5px] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={canStart ? {
                background: `linear-gradient(180deg, ${accent} 0%, ${accent}cc 100%)`,
                color: '#0A0B12',
                boxShadow: `0 8px 24px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.2)`,
              } : {
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.35)',
              }}
            >
              <span>Start Test</span>
              <span
                className="hidden sm:inline px-1.5 py-0.5 rounded text-[11px] font-mono"
                style={{
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: canStart ? 'rgba(0,0,0,0.6)' : 'inherit',
                }}
            >↵</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ─────────────────── Sub-components ───────────────────
function SectionHead({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-2.5">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/55">{label}</span>
      {hint && <span className="text-[10.5px] font-mono text-white/40 truncate max-w-[60%]">{hint}</span>}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <i className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function PoolToggle({
  on, label, count, color, onClick,
}: {
  on: boolean;
  label: string;
  count: number;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-1.5 px-3 py-2.5 rounded-xl text-left transition-all"
      style={on ? {
        background: `${color}14`,
        border: `1px solid ${color}66`,
        opacity: 1,
      } : {
        background: 'rgba(255,255,255,0.015)',
        border: '1px solid rgba(255,255,255,0.05)',
        opacity: 0.45,
      }}
    >
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/70">{label}</span>
      </div>
      <div className="font-mono text-[18px] font-medium tabular-nums text-white">{count}</div>
    </button>
  );
}

function CountSliderWithTicks({
  value, max, ticks, accent, onChange,
}: {
  value: number;
  max: number;
  ticks: number[];
  accent: string;
  onChange: (v: number) => void;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="relative h-9">
        <div className="absolute top-4 left-0 right-0 h-1 rounded bg-white/[0.06]" />
        <div
          className="absolute top-4 left-0 h-1 rounded"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${accent}cc, ${accent})`,
            boxShadow: `0 0 12px ${accent}88`,
          }}
        />
        {ticks.map(t => {
          const left = max > 0 ? (t / max) * 100 : 0;
          const filled = value >= t;
          return (
            <button
              key={t}
              onClick={() => onChange(t)}
              className="absolute top-3 w-4 h-4 p-0 border-0 bg-transparent cursor-pointer"
              style={{ left: `calc(${left}% - 8px)` }}
              aria-label={`${t} questions`}
            >
              <div
                className="w-[2px] h-2.5 mx-auto rounded-sm"
                style={{ background: filled ? `${accent}b0` : 'rgba(255,255,255,0.18)' }}
              />
            </button>
          );
        })}
        <input
          type="range"
          min={1}
          max={max}
          value={value}
          onChange={e => onChange(parseInt(e.target.value, 10))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-2.5 w-4 h-4 rounded-full bg-white pointer-events-none"
          style={{
            left: `calc(${pct}% - 8px)`,
            boxShadow: `0 2px 10px ${accent}99, 0 0 0 4px ${accent}33`,
          }}
        />
      </div>
      <div className="flex justify-between px-1 mt-0.5 font-mono text-[10px] text-white/40">
        {ticks.map(t => <span key={t}>{t}</span>)}
      </div>
    </div>
  );
}

function DiffSlider({
  label, value, color, onChange,
}: {
  label: string;
  value: number;
  color: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 text-[12px] text-white/70 shrink-0">{label}</span>
      <div className="relative flex-1 h-5">
        <div className="absolute top-2 left-0 right-0 h-1 rounded bg-white/[0.06]" />
        <div
          className="absolute top-2 left-0 h-1 rounded"
          style={{ width: `${value}%`, background: color }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={e => onChange(parseInt(e.target.value, 10))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1 rounded-full pointer-events-none"
          style={{
            width: 12, height: 12,
            left: `calc(${value}% - 6px)`,
            background: color,
            boxShadow: `0 0 0 3px ${color}33`,
          }}
        />
      </div>
      <span className="w-9 text-right font-mono text-[12px] text-white/85 shrink-0">{value}%</span>
    </div>
  );
}
