'use client';

/*
 * Ionic Radius Comparator — Class 11 Chemistry, Ch.3 Periodicity
 *
 * ACADEMIC SOURCES (anti-hallucination gate, per SIMULATION_DESIGN_WORKFLOW §7):
 *  - Neutral atomic radii: read at runtime from the canonical element data file
 *    (`@canvas/data/periodic/elementsData`), field `atomicRadius` (pm).
 *  - Ion radii + isoelectronic-series radii: standard NCERT values supplied in the
 *    build brief; hardcoded below as the source of truth for IONS. These are NOT
 *    pulled from training knowledge — they are the exact values given in the brief.
 *      Na 95, K 133, Mg 65, Al 50, F 136, Cl 181, O 140  (Mode A ions)
 *      10e⁻ series: N³⁻171, O²⁻140, F⁻136, Na⁺95, Mg²⁺65, Al³⁺50  (Z 7→13)
 *      18e⁻ series: S²⁻184, Cl⁻181, K⁺133, Ca²⁺99, Sc³⁺81       (Z 16→21)
 *  - Concept (isoelectronic rule): NCERT Class 11 Ch.3 — "In isoelectronic species
 *    the radius decreases with increasing nuclear charge (Z)."
 *
 * Design: dark theme #0d1117, indigo primary accent, no monospace, CSS-only animation.
 */

import { useMemo, useState } from 'react';
import { ELEMENTS } from '@canvas/data/periodic/elementsData';

type Mode = 'atom-ion' | 'series';

/* ---- Ion radii (pm) — source of truth from the brief. NOT from training. ---- */
const ION_RADIUS: Record<string, number> = {
  Na: 95,
  K: 133,
  Mg: 65,
  Al: 50,
  F: 136,
  Cl: 181,
  O: 140,
};

/* Charge / electron-change descriptor for each Mode-A element */
const ION_INFO: Record<
  string,
  { ionLabel: string; kind: 'cation' | 'anion'; why: string }
> = {
  Na: {
    ionLabel: 'Na⁺',
    kind: 'cation',
    why: 'Lost 1 electron → fewer electrons, the same protons pull the cloud in tighter.',
  },
  K: {
    ionLabel: 'K⁺',
    kind: 'cation',
    why: 'Lost 1 electron → an entire shell is gone, so the ion is much smaller.',
  },
  Mg: {
    ionLabel: 'Mg²⁺',
    kind: 'cation',
    why: 'Lost 2 electrons → 12 protons now grip only 10 electrons, shrinking it sharply.',
  },
  Al: {
    ionLabel: 'Al³⁺',
    kind: 'cation',
    why: 'Lost 3 electrons → very high pull per electron, one of the smallest common ions.',
  },
  F: {
    ionLabel: 'F⁻',
    kind: 'anion',
    why: 'Gained 1 electron → more electron–electron repulsion swells the cloud.',
  },
  Cl: {
    ionLabel: 'Cl⁻',
    kind: 'anion',
    why: 'Gained 1 electron → extra repulsion pushes the cloud outward.',
  },
  O: {
    ionLabel: 'O²⁻',
    kind: 'anion',
    why: 'Gained 2 electrons → strong added repulsion makes it much larger than the atom.',
  },
};

const MODE_A_ORDER = ['Na', 'K', 'Mg', 'Al', 'F', 'Cl', 'O'];

/* ---- Isoelectronic series (pm + Z) — source of truth from the brief ---- */
type Species = { label: string; radius: number; z: number };

const SERIES: Record<string, { title: string; electrons: number; species: Species[] }> = {
  '10e': {
    title: '10-electron series',
    electrons: 10,
    species: [
      { label: 'N³⁻', radius: 171, z: 7 },
      { label: 'O²⁻', radius: 140, z: 8 },
      { label: 'F⁻', radius: 136, z: 9 },
      { label: 'Na⁺', radius: 95, z: 11 },
      { label: 'Mg²⁺', radius: 65, z: 12 },
      { label: 'Al³⁺', radius: 50, z: 13 },
    ],
  },
  '18e': {
    title: '18-electron series',
    electrons: 18,
    species: [
      { label: 'S²⁻', radius: 184, z: 16 },
      { label: 'Cl⁻', radius: 181, z: 17 },
      { label: 'K⁺', radius: 133, z: 19 },
      { label: 'Ca²⁺', radius: 99, z: 20 },
      { label: 'Sc³⁺', radius: 81, z: 21 },
    ],
  },
};

/* Lookup a neutral atomic radius from the canonical data file (pm). */
function neutralRadius(symbol: string): number | undefined {
  return ELEMENTS.find((e) => e.symbol === symbol)?.atomicRadius;
}
function elementName(symbol: string): string {
  return ELEMENTS.find((e) => e.symbol === symbol)?.name ?? symbol;
}

/* ---------- Scaled circle (radius in pm → px) ---------- */
function ScaledCircle({
  pm,
  maxPm,
  maxPx,
  label,
  sub,
  fill,
  stroke,
}: {
  pm: number;
  maxPm: number;
  maxPx: number;
  label: string;
  sub: string;
  fill: string;
  stroke: string;
}) {
  // Area-true would over-shrink small ions; linear radius scaling reads more clearly
  // for students and is what NCERT diagrams use. Min floor keeps tiny ions visible.
  const px = Math.max(18, (pm / maxPm) * maxPx);
  return (
    <div className="flex flex-col items-center justify-end" style={{ minWidth: px + 8 }}>
      <div
        className="rounded-full flex items-center justify-center transition-all"
        style={{
          width: px,
          height: px,
          background: fill,
          border: `2.5px solid ${stroke}`,
          transitionDuration: '0.4s',
        }}
      >
        <span className="font-black text-white" style={{ fontSize: Math.max(11, px * 0.22) }}>
          {label}
        </span>
      </div>
      <span className="mt-2 text-sm font-bold tabular-nums text-white">{pm} pm</span>
      <span className="text-[10px] text-center leading-tight mt-0.5" style={{ color: '#64748b' }}>
        {sub}
      </span>
    </div>
  );
}

export default function IonicRadiusComparatorSim() {
  const [mode, setMode] = useState<Mode>('atom-ion');
  const [selected, setSelected] = useState<string>('Na');
  const [seriesKey, setSeriesKey] = useState<keyof typeof SERIES>('10e');

  /* ----- Mode A derived state ----- */
  const atomPm = neutralRadius(selected);
  const ionPm = ION_RADIUS[selected];
  const info = ION_INFO[selected];
  const aMax = Math.max(atomPm ?? 0, ionPm ?? 0);

  /* ----- Mode B derived state ----- */
  const series = SERIES[seriesKey];
  const sMax = useMemo(
    () => Math.max(...series.species.map((s) => s.radius)),
    [series],
  );

  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', minHeight: '70vh' }}>
      {/* Header */}
      <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Ionic Radius <span style={{ color: '#818cf8' }}>Comparator</span>
          </h1>
          <p
            className="text-[11px] font-bold uppercase tracking-widest mt-0.5"
            style={{ color: '#475569' }}
          >
            Sizes drawn to scale · radius in pm
          </p>
        </div>
        <div
          className="text-[10px] font-black uppercase tracking-widest pt-1"
          style={{ color: '#64748b' }}
        >
          Class 11 · Periodicity
        </div>
      </div>

      {/* Mode tabs (underline style §4g) */}
      <div className="flex gap-1 mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {(
          [
            { key: 'atom-ion' as Mode, label: 'Atom vs Ion', sub: 'how charge changes size' },
            { key: 'series' as Mode, label: 'Isoelectronic', sub: 'same electrons, Z varies' },
          ]
        ).map((t) => {
          const active = mode === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setMode(t.key)}
              className="px-3 py-2 text-left transition-all"
              style={{
                borderBottom: `2px solid ${active ? '#818cf8' : 'transparent'}`,
                opacity: active ? 1 : 0.5,
                background: 'none',
                outline: 'none',
              }}
            >
              <div className="text-xs font-black" style={{ color: active ? '#c4b5fd' : '#94a3b8' }}>
                {t.label}
              </div>
              <div className="text-[10px]" style={{ color: '#475569' }}>
                {t.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* ================= MODE A ================= */}
      {mode === 'atom-ion' && (
        <div className="flex flex-col gap-6">
          {/* Element picker */}
          <div className="flex flex-col gap-2">
            <p
              className="text-xs font-black uppercase tracking-widest"
              style={{ color: '#818cf8' }}
            >
              Pick an element
            </p>
            <div className="flex flex-wrap gap-2">
              {MODE_A_ORDER.map((sym) => {
                const active = sym === selected;
                const isCat = ION_INFO[sym].kind === 'cation';
                const accent = isCat ? '#fbbf24' : '#34d399';
                return (
                  <button
                    key={sym}
                    onClick={() => setSelected(sym)}
                    className="px-3 py-2 rounded-lg text-sm font-black transition-all"
                    style={{
                      background: active ? `${accent}22` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${active ? accent : 'rgba(255,255,255,0.07)'}`,
                      color: active ? accent : '#94a3b8',
                    }}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          {atomPm === undefined || ionPm === undefined || !info ? (
            <p className="text-base" style={{ color: '#94a3b8' }}>
              Radius data unavailable for this element.
            </p>
          ) : (
            <>
              {/* Visualization viewport (§4i) */}
              <div
                className="relative overflow-hidden rounded-3xl px-4 py-8"
                style={{
                  minHeight: 320,
                  background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
              >
                <div className="flex items-end justify-center gap-10 md:gap-16 h-full">
                  <ScaledCircle
                    pm={atomPm}
                    maxPm={aMax}
                    maxPx={200}
                    label={selected}
                    sub={`${elementName(selected)} atom`}
                    fill="#2d3a5a"
                    stroke="#6366f1"
                  />
                  {/* arrow */}
                  <div className="flex flex-col items-center self-center pb-10" style={{ color: '#64748b' }}>
                    <span className="text-2xl font-black" style={{ color: '#c4b5fd' }}>
                      →
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest mt-1">
                      {info.kind === 'cation' ? 'loses e⁻' : 'gains e⁻'}
                    </span>
                  </div>
                  <ScaledCircle
                    pm={ionPm}
                    maxPm={aMax}
                    maxPx={200}
                    label={info.ionLabel}
                    sub={`${info.ionLabel} ion`}
                    fill={info.kind === 'cation' ? '#3a2e10' : '#0a2218'}
                    stroke={info.kind === 'cation' ? '#fbbf24' : '#34d399'}
                  />
                </div>
              </div>

              {/* The "why" (plain text, §4e) */}
              <div>
                <p
                  className="text-xs font-black uppercase tracking-widest mb-2"
                  style={{ color: info.kind === 'cation' ? '#fbbf24' : '#34d399' }}
                >
                  {info.kind === 'cation' ? 'Cation < atom' : 'Anion > atom'}
                </p>
                <p className="text-white font-bold text-lg leading-snug">
                  {selected} ({atomPm} pm) → {info.ionLabel} ({ionPm} pm).{' '}
                  <span style={{ color: '#94a3b8', fontWeight: 500 }}>{info.why}</span>
                </p>
              </div>
            </>
          )}

          {/* Expert tip */}
          <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <h5
              className="text-[9px] font-black uppercase tracking-widest mb-1.5"
              style={{ color: '#6366f1' }}
            >
              Expert Tip
            </h5>
            <p className="text-white text-base font-bold leading-tight italic">
              &ldquo;Remove electrons → shrink. Add electrons → swell. The protons
              never change — it&rsquo;s the electron count that moves the size.&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* ================= MODE B ================= */}
      {mode === 'series' && (
        <div className="flex flex-col gap-6">
          {/* Series picker */}
          <div className="flex flex-col gap-2">
            <p
              className="text-xs font-black uppercase tracking-widest"
              style={{ color: '#818cf8' }}
            >
              Pick a series
            </p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SERIES) as (keyof typeof SERIES)[]).map((k) => {
                const active = k === seriesKey;
                return (
                  <button
                    key={k}
                    onClick={() => setSeriesKey(k)}
                    className="px-3 py-2 rounded-lg text-sm font-black transition-all"
                    style={{
                      background: active ? 'rgba(129,140,248,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : 'rgba(255,255,255,0.07)'}`,
                      color: active ? '#c4b5fd' : '#94a3b8',
                    }}
                  >
                    {SERIES[k].electrons} e⁻
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visualization viewport — largest → smallest */}
          <div
            className="relative overflow-x-auto rounded-3xl px-4 py-8"
            style={{
              minHeight: 300,
              background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
          >
            <div className="flex items-end justify-center gap-4 md:gap-7 h-full min-w-max px-2">
              {series.species.map((s) => (
                <ScaledCircle
                  key={s.label}
                  pm={s.radius}
                  maxPm={sMax}
                  maxPx={170}
                  label={s.label}
                  sub={`Z = ${s.z}`}
                  fill="#2d3a5a"
                  stroke="#818cf8"
                />
              ))}
            </div>
          </div>

          {/* Z arrow strip */}
          <div className="flex items-center justify-center gap-3 -mt-2">
            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#64748b' }}>
              Z increases →
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#fbbf24' }}>
              radius falls →
            </span>
          </div>

          {/* Rule caption (plain text §4e) */}
          <div>
            <p
              className="text-xs font-black uppercase tracking-widest mb-2"
              style={{ color: '#fbbf24' }}
            >
              The Rule
            </p>
            <p className="text-white font-bold text-lg leading-snug">
              Same number of electrons →{' '}
              <span style={{ color: '#fbbf24' }}>more protons (higher Z)</span> pulls
              them in tighter → <span style={{ color: '#34d399' }}>smaller radius</span>.
            </p>
            <p className="text-base leading-snug mt-2" style={{ color: '#94a3b8' }}>
              All {series.electrons} species here have {series.electrons} electrons. The
              only thing changing is the nuclear charge — and that alone shrinks the
              cloud from {series.species[0].label} ({series.species[0].radius} pm) down to{' '}
              {series.species[series.species.length - 1].label} (
              {series.species[series.species.length - 1].radius} pm).
            </p>
          </div>

          {/* Expert tip */}
          <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <h5
              className="text-[9px] font-black uppercase tracking-widest mb-1.5"
              style={{ color: '#6366f1' }}
            >
              Expert Tip
            </h5>
            <p className="text-white text-base font-bold leading-tight italic">
              &ldquo;Isoelectronic species? Just rank by Z. Highest proton count = smallest
              ion, every time.&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
