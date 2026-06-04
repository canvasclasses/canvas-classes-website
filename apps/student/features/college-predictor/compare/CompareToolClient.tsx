'use client';

// ============================================================================
// COLLEGE COMPARE TOOL — pick 2–3 institutes and compare them on FIT, not
// generalized placement numbers. Cacheable page shell mounts this client island
// (per the §10 caching rules); all data is fetched from public APIs.
// ============================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BITSAT_CAMPUSES } from '@canvas/data/bitsat/campuses';
import {
  ASPIRATIONS,
  type AspirationKey,
} from '@/features/college-predictor/data/instituteProfiles';
import type { CompareCollege, Momentum } from '@/features/college-predictor/lib/compareData';

const ACCENT = '#f59e0b';
const MAX_ITEMS = 3;
const MIN_ITEMS = 2;

type Category = 'OPEN' | 'OBC-NCL' | 'EWS' | 'SC' | 'ST';

interface PickerCollege {
  id: string;
  short_name: string;
  name: string;
  type: string;
  state: string;
  city: string;
}

interface SelectedItem {
  id: string;
  branch?: string;
}

// ── Small formatters ────────────────────────────────────────────────────────
function fmtInt(n: number | null | undefined): string {
  if (n == null) return '—';
  return n.toLocaleString('en-IN');
}
function fmtFeesLakh(n: number | null | undefined): string {
  if (n == null) return '—';
  if (n < 1000) return `₹${n.toLocaleString('en-IN')}`;
  const lakh = n / 100000;
  return lakh >= 1 ? `₹${lakh.toFixed(lakh < 10 ? 1 : 0)} L` : `₹${(n / 1000).toFixed(0)}k`;
}
function momentumLabel(m: Momentum | null): { text: string; color: string } | null {
  if (!m) return null;
  if (m === 'tightening') return { text: '↑ Getting tougher', color: '#fb7185' };
  if (m === 'loosening') return { text: '↓ Getting easier', color: '#34d399' };
  return { text: '→ Stable', color: '#9a9aa6' };
}

// ── Tiny sparkline for a branch's cutoff trend ──────────────────────────────
function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return <span style={{ color: '#5e5e6a', fontSize: 12 }}>not enough data</span>;
  const w = 96;
  const h = 26;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / span) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }} aria-hidden>
      <polyline points={pts} fill="none" stroke={ACCENT} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Orientation bar ─────────────────────────────────────────────────────────
function OrientationBar({ value, highlight }: { value: number; highlight: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{
            width: 14,
            height: 7,
            borderRadius: 2,
            background: n <= value ? (highlight ? ACCENT : 'rgba(245,158,11,0.45)') : 'rgba(255,255,255,0.08)',
          }}
        />
      ))}
    </div>
  );
}

const TYPE_COLORS: Record<string, string> = {
  NIT: '#60a5fa',
  IIIT: '#a78bfa',
  GFTI: '#34d399',
  IIT: '#fbbf24',
  BITS: '#f472b6',
};

export default function CompareToolClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pickerList, setPickerList] = useState<PickerCollege[]>([]);
  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [category, setCategory] = useState<Category>('OPEN');
  const [aspiration, setAspiration] = useState<AspirationKey | null>(null);

  const [data, setData] = useState<CompareCollege[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Hydrate selection from the URL once (shareable links).
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const ids = (searchParams.get('ids') || '').split(',').map((s) => s.trim()).filter(Boolean);
    const branches = (searchParams.get('branches') || '').split(',');
    const cat = searchParams.get('cat');
    if (cat && ['OPEN', 'OBC-NCL', 'EWS', 'SC', 'ST'].includes(cat)) setCategory(cat as Category);
    if (ids.length) {
      setSelected(ids.slice(0, MAX_ITEMS).map((id, i) => ({ id, branch: branches[i] || undefined })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch the picker list (all JoSAA institutes) and append the 3 BITS campuses.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/v2/college-predictor/colleges').then((r) => r.json());
        const josaa: PickerCollege[] = (res?.colleges ?? []).map((c: Record<string, string>) => ({
          id: c._id,
          short_name: c.short_name,
          name: c.name,
          type: c.type,
          state: c.state,
          city: c.city,
        }));
        const bits: PickerCollege[] = BITSAT_CAMPUSES.map((c) => ({
          id: `bits-${c.id}`,
          short_name: `BITS ${c.name}`,
          name: `BITS Pilani — ${c.name} Campus`,
          type: 'BITS',
          state: c.state,
          city: c.city,
        }));
        if (!cancelled) setPickerList([...josaa, ...bits]);
      } catch {
        if (!cancelled) setPickerList([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Close picker dropdown on outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setPickerOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Keep the URL in sync (shareable + survives refresh).
  useEffect(() => {
    const params = new URLSearchParams();
    if (selected.length) {
      params.set('ids', selected.map((s) => s.id).join(','));
      if (selected.some((s) => s.branch)) params.set('branches', selected.map((s) => s.branch || '').join(','));
    }
    if (category !== 'OPEN') params.set('cat', category);
    const qs = params.toString();
    router.replace(qs ? `/college-predictor/compare?${qs}` : '/college-predictor/compare', { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, category]);

  // Fetch the comparison whenever the selection or category changes.
  const fetchKey = useMemo(
    () => JSON.stringify({ s: selected, category }),
    [selected, category],
  );
  useEffect(() => {
    if (selected.length < MIN_ITEMS) {
      setData(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await fetch('/api/v2/college-predictor/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: selected, category }),
        }).then((r) => r.json());
        if (cancelled) return;
        if (res?.success) {
          setData(res.colleges as CompareCollege[]);
        } else {
          setData(null);
          setError(res?.error || 'Could not load the comparison.');
        }
      } catch {
        if (!cancelled) {
          setData(null);
          setError('Could not load the comparison. Please try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchKey]);

  const selectedIds = useMemo(() => new Set(selected.map((s) => s.id)), [selected]);
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = pickerList.filter((c) => !selectedIds.has(c.id));
    if (!q) return base.slice(0, 40);
    return base
      .filter(
        (c) =>
          c.short_name.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q),
      )
      .slice(0, 40);
  }, [pickerList, query, selectedIds]);

  const addCollege = useCallback(
    (id: string) => {
      setSelected((arr) => (arr.length >= MAX_ITEMS || arr.some((s) => s.id === id) ? arr : [...arr, { id }]));
      setQuery('');
      setPickerOpen(false);
    },
    [],
  );
  const removeCollege = useCallback((id: string) => {
    setSelected((arr) => arr.filter((s) => s.id !== id));
  }, []);
  const setBranch = useCallback((id: string, branch: string) => {
    setSelected((arr) => arr.map((s) => (s.id === id ? { ...s, branch: branch || undefined } : s)));
  }, []);

  // Order `data` to match the selected order (the API de-dupes/filters).
  const cols = useMemo(() => {
    if (!data) return [] as CompareCollege[];
    const byId = new Map(data.map((c) => [c.id, c]));
    return selected.map((s) => byId.get(s.id)).filter((c): c is CompareCollege => !!c);
  }, [data, selected]);

  // Best-fit column(s) for the active aspiration lens (highest orientation
  // score). Tie-aware: every college sharing the top score is a winner — we
  // never break a genuine tie by selection order (that would falsely crown,
  // e.g., a NIT over BITS for entrepreneurship). If ALL profiled colleges tie,
  // there's no differentiator, so we highlight none.
  const lensWinnerIds = useMemo(() => {
    const empty = new Set<string>();
    if (!aspiration || cols.length === 0) return empty;
    const scored = cols
      .map((c) => ({ id: c.id, v: c.profile?.orientation[aspiration] ?? -1 }))
      .filter((s) => s.v >= 0);
    if (scored.length === 0) return empty;
    const max = Math.max(...scored.map((s) => s.v));
    const winners = scored.filter((s) => s.v === max);
    // No clear winner if everyone (with a profile) ties at the top.
    if (winners.length === scored.length && scored.length === cols.length) return empty;
    return new Set(winners.map((s) => s.id));
  }, [aspiration, cols]);

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 12px 100px', fontFamily: 'inherit' }}>
      {/* ── Picker bar ───────────────────────────────────────────────────── */}
      <div
        style={{
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.06)',
          background: '#0B0F15',
          padding: 18,
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          {/* Selected chips */}
          {selected.map((s) => {
            const meta = pickerList.find((p) => p.id === s.id);
            return (
              <span
                key={s.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: `1px solid ${ACCENT}55`,
                  background: `${ACCENT}12`,
                  color: '#f5f5f7',
                  fontSize: 13.5,
                  fontWeight: 600,
                }}
              >
                {meta?.short_name ?? s.id}
                <button
                  type="button"
                  onClick={() => removeCollege(s.id)}
                  aria-label={`Remove ${meta?.short_name ?? s.id}`}
                  style={{ all: 'unset', cursor: 'pointer', color: '#9a9aa6', fontSize: 15, lineHeight: 1 }}
                >
                  ×
                </button>
              </span>
            );
          })}

          {/* Add-college combobox */}
          {selected.length < MAX_ITEMS && (
            <div ref={pickerRef} style={{ position: 'relative', flex: '1 1 240px', minWidth: 220 }}>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPickerOpen(true);
                }}
                onFocus={() => setPickerOpen(true)}
                placeholder={selected.length === 0 ? 'Search a college to compare… (e.g. NIT Trichy, BITS Goa)' : 'Add another…'}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)',
                  color: '#f5f5f7',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              {pickerOpen && matches.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    zIndex: 30,
                    maxHeight: 320,
                    overflowY: 'auto',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: '#10141d',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                  }}
                >
                  {matches.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => addCollege(c.id)}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 12px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ color: '#f5f5f7', fontSize: 13.5, fontWeight: 600 }}>{c.short_name}</span>
                      <span style={{ color: '#7d7d88', fontSize: 11.5 }}>
                        <span style={{ color: TYPE_COLORS[c.type] ?? '#9a9aa6', fontWeight: 700 }}>{c.type}</span>
                        {' · '}
                        {c.city}, {c.state}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Category selector */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#7d7d88', fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em' }}>
              CATEGORY
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              style={{
                padding: '8px 10px',
                borderRadius: 9,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
                color: '#f5f5f7',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            >
              {(['OPEN', 'OBC-NCL', 'EWS', 'SC', 'ST'] as Category[]).map((c) => (
                <option key={c} value={c} style={{ background: '#10141d' }}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selected.length < MIN_ITEMS && (
          <p style={{ marginTop: 12, color: '#7d7d88', fontSize: 13 }}>
            Pick at least two colleges (up to three) to see them side-by-side.
          </p>
        )}
      </div>

      {/* ── Aspiration lens ─────────────────────────────────────────────── */}
      {cols.length >= MIN_ITEMS && (
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              color: '#cfcfd6',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.16em',
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 10,
            }}
          >
            WHAT DO YOU WANT FROM COLLEGE? — pick a lens to see which fits you
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ASPIRATIONS.map((a) => {
              const active = aspiration === a.key;
              return (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => setAspiration(active ? null : a.key)}
                  title={a.blurb}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '8px 13px',
                    borderRadius: 999,
                    border: active ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.1)',
                    background: active ? `${ACCENT}1a` : 'rgba(255,255,255,0.02)',
                    color: active ? ACCENT : '#cfcfd6',
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <span aria-hidden>{a.icon}</span>
                  {a.label}
                </button>
              );
            })}
          </div>
          {aspiration && (
            <p style={{ marginTop: 8, color: '#9a9aa6', fontSize: 13 }}>
              {ASPIRATIONS.find((a) => a.key === aspiration)?.blurb}{' '}
              {(() => {
                const names = cols.filter((c) => lensWinnerIds.has(c.id)).map((c) => c.short_name);
                if (names.length > 0) return `Best fit below: ${names.join(' & ')}.`;
                const anyProfiled = cols.some((c) => (c.profile?.orientation[aspiration] ?? -1) >= 0);
                return anyProfiled
                  ? 'These colleges are comparable on this lens — no clear standout.'
                  : 'None of the selected colleges are profiled for this lens yet.';
              })()}
            </p>
          )}
        </div>
      )}

      {/* ── States ───────────────────────────────────────────────────────── */}
      {loading && (
        <div className="h-72 rounded-2xl bg-[#0B0F15] border border-white/5 animate-pulse" />
      )}
      {error && !loading && (
        <div
          style={{
            borderRadius: 14,
            border: '1px solid rgba(251,113,133,0.3)',
            background: 'rgba(251,113,133,0.06)',
            padding: 18,
            color: '#fda4af',
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {/* ── Comparison grid ──────────────────────────────────────────────── */}
      {!loading && !error && cols.length >= MIN_ITEMS && (
        <ComparisonGrid cols={cols} aspiration={aspiration} lensWinnerIds={lensWinnerIds} onBranch={setBranch} />
      )}

      {/* ── Guidance ─────────────────────────────────────────────────────── */}
      {cols.length >= MIN_ITEMS && !loading && <GuidancePanel />}
    </div>
  );
}

// ── Comparison grid ─────────────────────────────────────────────────────────
function ComparisonGrid({
  cols,
  aspiration,
  lensWinnerIds,
  onBranch,
}: {
  cols: CompareCollege[];
  aspiration: AspirationKey | null;
  lensWinnerIds: Set<string>;
  onBranch: (id: string, branch: string) => void;
}) {
  const n = cols.length;
  const gridCols = `minmax(160px, 200px) repeat(${n}, minmax(180px, 1fr))`;
  // Best (lowest) values for subtle "best" markers. Only meaningful when AT
  // LEAST TWO colleges have the value — otherwise a lone known value would be
  // wrongly badged "best/lowest" against unknown ("—") columns (e.g. tagging a
  // pricey BITS "lowest" just because the NIT's total cost isn't loaded).
  const nirfKnown = cols.filter((c) => c.nirf_engineering != null).length;
  const costKnown = cols.filter((c) => c.total_cost_4yr != null).length;
  const bestNirf = Math.min(...cols.map((c) => c.nirf_engineering ?? Infinity));
  const bestCost = Math.min(...cols.map((c) => c.total_cost_4yr ?? Infinity));
  // These fields aren't populated for every institute yet — only render the row
  // if at least one selected college has the data, so we never show a dead
  // all-"—" row. (When fees/seats get curated later, the rows appear on their own.)
  const anySeats = cols.some((c) => c.total_seats != null);
  const anyAnnualFees = cols.some((c) => c.annual_fees != null);
  const anyTotalCost = cols.some((c) => c.total_cost_4yr != null);

  const cellPad = '14px 16px';
  const labelStyle: React.CSSProperties = {
    color: '#9a9aa6',
    fontSize: 12.5,
    fontWeight: 600,
    padding: cellPad,
    display: 'flex',
    alignItems: 'center',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  };
  const cellStyle: React.CSSProperties = {
    padding: cellPad,
    fontSize: 14,
    color: '#e7e7ea',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    borderLeft: '1px solid rgba(255,255,255,0.05)',
  };

  const colHighlight = (id: string): React.CSSProperties =>
    aspiration && lensWinnerIds.has(id) ? { background: `${ACCENT}0d` } : {};

  function Row({ label, render }: { label: string; render: (c: CompareCollege) => React.ReactNode }) {
    return (
      <>
        <div style={labelStyle}>{label}</div>
        {cols.map((c) => (
          <div key={c.id} style={{ ...cellStyle, ...colHighlight(c.id) }}>
            {render(c)}
          </div>
        ))}
      </>
    );
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: '#0B0F15' }}>
      <div style={{ display: 'grid', gridTemplateColumns: gridCols, minWidth: 520 }}>
        {/* Header row */}
        <div style={{ padding: cellPad }} />
        {cols.map((c) => {
          const winner = aspiration && lensWinnerIds.has(c.id);
          return (
            <div key={c.id} style={{ padding: cellPad, borderLeft: '1px solid rgba(255,255,255,0.05)', ...colHighlight(c.id) }}>
              {winner && (
                <div
                  style={{
                    display: 'inline-block',
                    marginBottom: 6,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: ACCENT,
                    color: '#0a0a0f',
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                  }}
                >
                  BEST FIT
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                <span style={{ color: '#f5f5f7', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>
                  {c.short_name}
                </span>
                <span style={{ color: TYPE_COLORS[c.type] ?? '#9a9aa6', fontSize: 11, fontWeight: 800 }}>{c.type}</span>
              </div>
              <div style={{ color: '#7d7d88', fontSize: 12, marginTop: 3 }}>
                {c.city}, {c.state}
              </div>
              {/* Branch selector */}
              {c.availableBranches.length > 0 && (
                <select
                  value={c.selectedBranch?.short_name ?? ''}
                  onChange={(e) => onBranch(c.id, e.target.value)}
                  style={{
                    marginTop: 8,
                    maxWidth: '100%',
                    padding: '6px 8px',
                    borderRadius: 8,
                    border: `1px solid ${ACCENT}40`,
                    background: 'rgba(255,255,255,0.03)',
                    color: '#f5f5f7',
                    fontSize: 12.5,
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  {c.availableBranches.map((b) => (
                    <option key={b.short_name} value={b.short_name} style={{ background: '#10141d' }}>
                      {b.short_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        })}

        {/* Snapshot */}
        <Row label="NIRF (Engineering)" render={(c) => (
          <span>
            {c.nirf_engineering != null ? `#${c.nirf_engineering}` : 'Not ranked'}
            {c.nirf_engineering != null && c.nirf_engineering === bestNirf && nirfKnown >= 2 && (
              <span style={{ color: '#34d399', fontSize: 11, marginLeft: 6 }}>best</span>
            )}
          </span>
        )} />
        <Row label="Established" render={(c) => (c.established ? c.established : '—')} />
        {anySeats && <Row label="Total seats" render={(c) => fmtInt(c.total_seats)} />}

        {/* Admission reality for the chosen branch */}
        <Row
          label="Branch compared"
          render={(c) => (c.selectedBranch ? <span style={{ fontWeight: 600 }}>{c.selectedBranch.name}</span> : '—')}
        />
        <Row
          label="Latest cutoff"
          render={(c) => {
            const b = c.selectedBranch;
            if (!b || b.latest == null) return <span style={{ color: '#7d7d88' }}>no data</span>;
            return (
              <div>
                <span style={{ fontWeight: 700 }}>
                  {b.unit === 'rank' ? `${fmtInt(b.latest)}` : `${b.latest}`}
                </span>{' '}
                <span style={{ color: '#7d7d88', fontSize: 12 }}>
                  {b.unit === 'rank' ? `closing rank · ${b.latestYear}` : `BITSAT score · ${b.latestYear}`}
                </span>
              </div>
            );
          }}
        />
        <Row
          label="Cutoff trend"
          render={(c) => {
            const b = c.selectedBranch;
            if (!b || b.trend.length < 2) return <span style={{ color: '#7d7d88', fontSize: 12 }}>—</span>;
            const m = momentumLabel(b.momentum);
            return (
              <div>
                <Sparkline values={b.trend.map((t) => t.value)} />
                {m && <span style={{ color: m.color, fontSize: 11.5 }}>{m.text}</span>}
              </div>
            );
          }}
        />
        <Row
          label="Home-state edge (NIT)"
          render={(c) => {
            const hs = c.selectedBranch?.homeState;
            if (!hs) return <span style={{ color: '#7d7d88', fontSize: 12 }}>—</span>;
            return (
              <div style={{ fontSize: 12.5 }}>
                <div>Home: <strong>{fmtInt(hs.hs)}</strong></div>
                <div style={{ color: '#9a9aa6' }}>Other: {fmtInt(hs.os)}</div>
              </div>
            );
          }}
        />

        {/* Cost (rendered only when data exists) */}
        {anyAnnualFees && <Row label="Annual fees" render={(c) => fmtFeesLakh(c.annual_fees)} />}
        {anyTotalCost && (
          <Row
            label="~Total cost (4 yr)"
            render={(c) => (
              <span>
                {fmtFeesLakh(c.total_cost_4yr)}
                {c.total_cost_4yr != null && c.total_cost_4yr === bestCost && costKnown >= 2 && (
                  <span style={{ color: '#34d399', fontSize: 11, marginLeft: 6 }}>lowest</span>
                )}
              </span>
            )}
          />
        )}

        {/* Branch heritage */}
        <Row
          label="Branch heritage"
          render={(c) =>
            c.heritage.branchIsLegacyStrength ? (
              <span style={{ color: ACCENT, fontWeight: 600, fontSize: 13 }}>★ Long-standing strength</span>
            ) : c.profile ? (
              <span style={{ color: '#7d7d88', fontSize: 12.5 }}>Not a flagged legacy branch here</span>
            ) : (
              <span style={{ color: '#5e5e6a', fontSize: 12 }}>not profiled</span>
            )
          }
        />
        <Row
          label="Known for"
          render={(c) =>
            c.profile?.knownForBranches?.length ? (
              <span style={{ fontSize: 12.5, color: '#cfcfd6' }}>{c.profile.knownForBranches.join(', ')}</span>
            ) : (
              <span style={{ color: '#5e5e6a', fontSize: 12 }}>—</span>
            )
          }
        />

        {/* Orientation (character) */}
        {ASPIRATIONS.map((a) => (
          <Row
            key={a.key}
            label={`${a.icon} ${a.short}`}
            render={(c) => {
              const v = c.profile?.orientation[a.key];
              if (v == null) return <span style={{ color: '#5e5e6a', fontSize: 12 }}>—</span>;
              return <OrientationBar value={v} highlight={aspiration === a.key && lensWinnerIds.has(c.id)} />;
            }}
          />
        ))}

        {/* Highlights */}
        <Row
          label="Highlights"
          render={(c) =>
            c.profile?.highlights?.length ? (
              <ul style={{ margin: 0, paddingLeft: 16, color: '#cfcfd6', fontSize: 12.5, lineHeight: 1.5 }}>
                {c.profile.highlights.map((h, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>
                    {h}
                  </li>
                ))}
              </ul>
            ) : (
              <span style={{ color: '#5e5e6a', fontSize: 12 }}>Profile coming soon.</span>
            )
          }
        />

        {/* Links */}
        <Row
          label=""
          render={(c) =>
            c.system === 'josaa' ? (
              <a
                href={`/college-predictor/college/${c.id}`}
                style={{ color: ACCENT, fontSize: 12.5, textDecoration: 'none', fontWeight: 600 }}
              >
                Full cutoff history →
              </a>
            ) : c.website ? (
              <a href={c.website} target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, fontSize: 12.5, textDecoration: 'none', fontWeight: 600 }}>
                Official site →
              </a>
            ) : null
          }
        />
      </div>
    </div>
  );
}

// ── Guidance panel ──────────────────────────────────────────────────────────
function GuidancePanel() {
  const items: { t: string; b: string }[] = [
    {
      t: 'Branch vs college',
      b: 'At the very top, the brand clears the floor everywhere — take the tag. As you go down the list, the branch matters more: a core branch at a slightly lower-ranked institute often beats a non-core branch at a higher one.',
    },
    {
      t: 'Match the place to your goal',
      b: 'Use the lens above. If you want to build a startup, weight entrepreneurship and alumni founders. If you want research or to go abroad, weight research orientation. If you want PSU stability, weight the govt/PSU pipeline.',
    },
    {
      t: 'Heritage beats hype',
      b: 'For a specific branch (metallurgy, mining, civil), an institute that has run it for decades has a deeper recruiter and alumni network than one that added it recently — even if its overall rank is similar.',
    },
    {
      t: 'Read the cutoff trend',
      b: 'A cutoff that is tightening year on year is a quiet signal of rising demand and reputation; a loosening one is worth a second look. It is momentum, not just a single number.',
    },
  ];
  return (
    <section style={{ marginTop: 28 }}>
      <h2 style={{ color: '#f5f5f7', fontSize: 18, fontWeight: 700, marginBottom: 14 }}>How to weigh this</h2>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {items.map((it) => (
          <div
            key={it.t}
            style={{
              padding: 16,
              borderRadius: 12,
              background: '#0B0F15',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div style={{ color: ACCENT, fontSize: 13.5, fontWeight: 700, marginBottom: 6 }}>{it.t}</div>
            <div style={{ color: '#9a9aa6', fontSize: 13, lineHeight: 1.55 }}>{it.b}</div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 16, color: '#5e5e6a', fontSize: 12, lineHeight: 1.6 }}>
        Character scores (research / startups / industry / govt-PSU / abroad) are editorial assessments of an
        institute&apos;s durable reputation, not a precise metric — use them as a starting point, then talk to current
        students and alumni before you finalise. We deliberately do not rank colleges by average placement packages:
        outlier salaries don&apos;t generalise to your own outcome.
      </p>
    </section>
  );
}
