'use client';

/**
 * Periodic Trends Explorer — Class 11 Chemistry, Ch.3 (Periodicity)
 *
 * Self-contained, book-embeddable simulation with two linked views:
 *   1) Heatmap periodic table — colour every element by a chosen property.
 *   2) Trend graph — plot the property across a period OR down a group,
 *      with the famous JEE/NEET exceptions annotated.
 *
 * Reuses the existing app's data source (elementsData) and the hand-rolled
 * SVG + framer-motion charting approach used by PeriodTrendsChart /
 * TrendsComponent. No external charting library.
 *
 * Default export, no props — renders as <PeriodicTrendsExplorerSim />.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  AlertTriangle,
  X,
  ArrowRight,
  ArrowDown,
  Thermometer,
} from 'lucide-react';
import { ELEMENTS, type Element } from '@canvas/data/periodic/elementsData';

// ─── Property config ────────────────────────────────────────────────────────

type PropKey =
  | 'atomicRadius'
  | 'ionizationEnergy'
  | 'electronegativity'
  | 'electronAffinity'
  | 'density'
  | 'meltingPoint';

interface PropertyDef {
  key: PropKey;
  label: string;
  short: string;
  unit: string;
  /** true → higher value = "hotter" (orange). For radius, bigger is also shown hot. */
  logScale?: boolean;
  decimals?: number;
}

const PROPERTIES: PropertyDef[] = [
  { key: 'atomicRadius', label: 'Atomic Radius', short: 'AR', unit: 'pm', decimals: 0 },
  { key: 'ionizationEnergy', label: 'Ionization Energy', short: 'IE', unit: 'kJ/mol', decimals: 0 },
  { key: 'electronegativity', label: 'Electronegativity', short: 'EN', unit: 'Pauling', decimals: 2 },
  { key: 'electronAffinity', label: 'Electron Affinity', short: 'EA', unit: 'kJ/mol', decimals: 0 },
  { key: 'density', label: 'Density', short: 'ρ', unit: 'g/cm³', logScale: true, decimals: 2 },
  { key: 'meltingPoint', label: 'Melting Point', short: 'MP', unit: 'K', decimals: 0 },
];

// ─── Exceptions (well-known JEE/NEET anomalies) ─────────────────────────────
// Keyed by property → element symbol. Shown when an element appears in the
// active period/group graph and on the heatmap legend note.

interface ExceptionNote {
  title: string;
  explanation: string;
  jeeTag: string;
}

const PERIOD_EXCEPTIONS: Record<string, Record<string, ExceptionNote>> = {
  ionizationEnergy: {
    B: {
      title: 'IE of B < Be (Period 2)',
      explanation:
        'Be has a fully-filled, extra-stable 2s². Boron’s lone 2p¹ electron sits higher in energy and is easier to remove despite B having more protons.',
      jeeTag: 'Fully-filled 2s² stability of Be',
    },
    O: {
      title: 'IE of O < N (Period 2)',
      explanation:
        'Nitrogen’s half-filled 2p³ is extra stable. Oxygen’s 2p⁴ forces two electrons to pair in one orbital; the repulsion lowers its IE. The most-tested IE exception.',
      jeeTag: 'Half-filled 2p³ stability of N',
    },
    Al: {
      title: 'IE of Al < Mg (Period 3)',
      explanation:
        'Mg’s fully-filled 3s² is extra stable. Al’s lone 3p¹ electron is higher in energy and shielded — easier to remove. Mirror of the B vs Be case.',
      jeeTag: 'Fully-filled 3s² stability of Mg',
    },
    S: {
      title: 'IE of S < P (Period 3)',
      explanation:
        'Phosphorus has a half-filled 3p³. Sulfur’s 3p⁴ forces pairing; paired-electron repulsion lowers the IE. Mirror of the N vs O case.',
      jeeTag: 'Half-filled 3p³ stability of P',
    },
  },
  electronAffinity: {
    N: {
      title: 'EA of N ≈ 0 (Period 2)',
      explanation:
        'N’s half-filled 2p³ resists a new electron — adding one means pairing in an occupied orbital with strong repulsion.',
      jeeTag: 'Half-filled 2p³ resists e⁻ addition',
    },
    F: {
      title: 'EA of F < Cl (classic anomaly)',
      explanation:
        'F is most electronegative yet has lower EA than Cl. Its compact 2p orbitals are crowded, so an incoming electron faces more repulsion than in Cl’s roomier 3p.',
      jeeTag: 'Small size → high e⁻ repulsion in F',
    },
    P: {
      title: 'EA of P unusually low',
      explanation:
        'Half-filled 3p³ resists a new electron — same logic as N. EA is near-zero / positive.',
      jeeTag: 'Half-filled 3p³ resists e⁻ addition',
    },
  },
};

const GROUP_EXCEPTIONS: Record<string, Record<string, ExceptionNote>> = {
  electronAffinity: {
    Cl: {
      title: 'EA of Cl > F (Group 17)',
      explanation:
        'Going down a group EA should fall, but Cl has higher EA than F. F’s small, crowded 2p shell makes electron addition less favourable, so Cl wins.',
      jeeTag: 'Cl beats F — small-size repulsion in F',
    },
  },
  atomicRadius: {
    Ga: {
      title: 'Ga radius ≈ Al (Group 13)',
      explanation:
        'After the 3d block fills, the poorly-shielding d-electrons let the nucleus pull harder, so Ga ends up almost the same size as Al instead of clearly larger.',
      jeeTag: 'Poor d-electron shielding at Ga',
    },
  },
  ionizationEnergy: {
    Ga: {
      title: 'IE of Ga ≈ Al (Group 13)',
      explanation:
        'Poor d-electron shielding raises Ga’s effective nuclear charge, keeping its IE close to Al rather than dropping smoothly down the group.',
      jeeTag: 'Poor d-electron shielding at Ga',
    },
  },
};

// ─── Category colour bridge (for the heatmap "no data" / outline) ───────────

// ─── Helpers ────────────────────────────────────────────────────────────────

function getVal(el: Element, key: PropKey): number | null {
  const v = el[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function fmt(v: number, p: PropertyDef): string {
  if (p.key === 'density' && v < 0.1) return v.toFixed(4);
  return v.toFixed(p.decimals ?? 0);
}

// Heatmap colour: map a normalised 0..1 value onto a cool→warm gradient that
// stays inside the app's allowed palette (indigo → teal → amber → orange).
function heatColor(t: number): string {
  // clamp
  const x = Math.max(0, Math.min(1, t));
  // 5-stop gradient: indigo → cyan → emerald → amber → orange
  const stops = [
    { p: 0.0, c: [99, 102, 241] }, // indigo-500
    { p: 0.25, c: [34, 211, 238] }, // cyan-400
    { p: 0.5, c: [52, 211, 153] }, // emerald-400
    { p: 0.75, c: [251, 191, 36] }, // amber-400
    { p: 1.0, c: [249, 115, 22] }, // orange-500
  ];
  let lo = stops[0];
  let hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (x >= stops[i].p && x <= stops[i + 1].p) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }
  const span = hi.p - lo.p || 1;
  const f = (x - lo.p) / span;
  const ch = (i: number) => Math.round(lo.c[i] + (hi.c[i] - lo.c[i]) * f);
  return `rgb(${ch(0)}, ${ch(1)}, ${ch(2)})`;
}

// ─── Sub-component: Exception popup card ────────────────────────────────────

function ExceptionCard({ note, onClose }: { note: ExceptionNote; onClose: () => void }) {
  return (
    <div className="mt-3 p-4 rounded-xl bg-[#151E32] border border-amber-500/40 shadow-xl shadow-black/40">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <AlertTriangle size={13} className="text-amber-400" />
          </span>
          <span className="text-sm font-bold text-amber-300">{note.title}</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 flex-shrink-0" aria-label="Close">
          <X size={15} />
        </button>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed mb-3 pl-8">{note.explanation}</p>
      <div className="ml-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25">
        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">JEE Key</span>
        <span className="text-xs text-amber-200">{note.jeeTag}</span>
      </div>
    </div>
  );
}

// ─── Sub-component: Heatmap periodic table ──────────────────────────────────

interface HoverCell {
  el: Element;
  value: number | null;
}

function Heatmap({
  property,
  onPickGroup,
  onPickPeriod,
}: {
  property: PropertyDef;
  onPickGroup: (g: number) => void;
  onPickPeriod: (p: number) => void;
}) {
  const [hovered, setHovered] = useState<HoverCell | null>(null);

  // Build value range for the property over all elements that have it.
  const { min, max, useLog } = useMemo(() => {
    const vals = ELEMENTS.map((e) => getVal(e, property.key)).filter(
      (v): v is number => v !== null,
    );
    let mn = vals.length ? Math.min(...vals) : 0;
    let mx = vals.length ? Math.max(...vals) : 1;
    const log = !!property.logScale && mn > 0 && mx / mn > 100;
    if (log) {
      mn = Math.log10(mn);
      mx = Math.log10(mx);
    }
    return { min: mn, max: mx, useLog: log };
  }, [property]);

  const norm = (v: number) => {
    const x = useLog ? Math.log10(Math.max(0.0001, v)) : v;
    return (x - min) / (max - min || 1);
  };

  // The grid: 18 cols, rows 1-7 (main) then a gap then lanthanide (8) /
  // actinide (9). We render rows 1-7 in one grid, then the f-block strip below.
  const mainRows = [1, 2, 3, 4, 5, 6, 7];
  const byPos = useMemo(() => {
    const m = new Map<string, Element>();
    ELEMENTS.forEach((e) => m.set(`${e.row}:${e.col}`, e));
    return m;
  }, []);

  const Cell = ({ el }: { el: Element }) => {
    const value = getVal(el, property.key);
    const t = value !== null ? norm(value) : null;
    const bg = t !== null ? heatColor(t) : 'rgba(255,255,255,0.04)';
    const noData = value === null;
    return (
      <button
        type="button"
        onMouseEnter={() => setHovered({ el, value })}
        onMouseLeave={() => setHovered(null)}
        onClick={() => setHovered({ el, value })}
        className="relative aspect-square w-full rounded-[3px] flex items-center justify-center transition-transform hover:scale-110 hover:z-10 hover:ring-2 hover:ring-white/70 focus:outline-none focus:ring-2 focus:ring-white/70"
        style={{
          background: bg,
          opacity: noData ? 0.5 : 1,
        }}
        title={`${el.name} — ${value !== null ? fmt(value, property) + ' ' + property.unit : 'no data'}`}
      >
        <span
          className="text-[7px] sm:text-[9px] font-bold leading-none"
          style={{ color: t !== null && t > 0.55 ? '#0d1117' : '#ffffff' }}
        >
          {el.symbol}
        </span>
      </button>
    );
  };

  return (
    <div>
      {/* Hover read-out */}
      <div className="h-12 mb-2 flex items-center">
        {hovered ? (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#151E32] border border-white/10">
            <span className="text-base font-bold text-white">{hovered.el.symbol}</span>
            <span className="text-sm text-gray-400">{hovered.el.name}</span>
            <span className="h-4 w-px bg-white/10" />
            {hovered.value !== null ? (
              <span className="text-sm font-semibold text-amber-300 tabular-nums">
                {fmt(hovered.value, property)} {property.unit}
              </span>
            ) : (
              <span className="text-sm text-gray-500 italic">no NCERT data for {property.short}</span>
            )}
            <span className="hidden sm:inline text-xs text-gray-600">
              · Period {hovered.el.period} · Group {hovered.el.group}
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-500 italic">
            Hover or tap a cell to read its exact value. Colours run cool (low) → warm (high).
          </span>
        )}
      </div>

      {/* Scrollable grid (horizontal scroll on mobile) */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="min-w-[560px]">
          {/* group header row */}
          <div
            className="grid gap-[2px] mb-[2px]"
            style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
          >
            {Array.from({ length: 18 }, (_, i) => i + 1).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onPickGroup(g)}
                className="text-[8px] sm:text-[9px] text-gray-500 hover:text-amber-300 text-center leading-none py-0.5 transition-colors"
                title={`Plot Group ${g} down`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* main rows 1-7 */}
          {mainRows.map((r) => (
            <div
              key={r}
              className="grid gap-[2px] mb-[2px] items-center"
              style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
            >
              {Array.from({ length: 18 }, (_, i) => i + 1).map((c) => {
                const el = byPos.get(`${r}:${c}`);
                if (!el) {
                  // Period-label badge in the gap of group-3 for rows 6 & 7 (f-block marker)
                  return <div key={c} className="aspect-square" />;
                }
                return <Cell key={c} el={el} />;
              })}
            </div>
          ))}

          {/* f-block strip */}
          <div className="h-2" />
          {[8, 9].map((r) => (
            <div
              key={r}
              className="grid gap-[2px] mb-[2px]"
              style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
            >
              {Array.from({ length: 18 }, (_, i) => i + 1).map((c) => {
                const el = byPos.get(`${r}:${c}`);
                if (!el) return <div key={c} className="aspect-square" />;
                return <Cell key={c} el={el} />;
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Period quick-pick + legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Plot a period:</span>
          {[2, 3, 4, 5, 6].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPickPeriod(p)}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              P{p}
            </button>
          ))}
        </div>

        {/* Gradient legend */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 tabular-nums">
            {fmt(useLog ? Math.pow(10, min) : min, property)}
          </span>
          <div
            className="h-3 w-32 rounded-full border border-white/10"
            style={{
              background:
                'linear-gradient(to right, rgb(99,102,241), rgb(34,211,238), rgb(52,211,153), rgb(251,191,36), rgb(249,115,22))',
            }}
          />
          <span className="text-xs text-gray-500 tabular-nums">
            {fmt(useLog ? Math.pow(10, max) : max, property)} {property.unit}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-component: Trend line chart ────────────────────────────────────────

interface TrendPoint {
  el: Element;
  value: number | null;
}

function TrendChart({
  axis,
  selection,
  property,
}: {
  axis: 'period' | 'group';
  selection: number;
  property: PropertyDef;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [openExc, setOpenExc] = useState<ExceptionNote | null>(null);

  const excMap = (axis === 'period' ? PERIOD_EXCEPTIONS : GROUP_EXCEPTIONS)[property.key] || {};

  const points: TrendPoint[] = useMemo(() => {
    const els =
      axis === 'period'
        ? ELEMENTS.filter((e) => e.period === selection).sort((a, b) => a.group - b.group)
        : ELEMENTS.filter((e) => e.group === selection).sort((a, b) => a.period - b.period);
    return els.map((e) => ({ el: e, value: getVal(e, property.key) }));
  }, [axis, selection, property]);

  const vals = points.map((p) => p.value).filter((v): v is number => v !== null);
  const rawMin = vals.length ? Math.min(...vals) : 0;
  const rawMax = vals.length ? Math.max(...vals) : 1;
  const useLog = !!property.logScale && rawMin > 0 && rawMax / rawMin > 100;

  const toNorm = (v: number) => {
    if (useLog) {
      const lmin = Math.log10(Math.max(0.0001, rawMin));
      const lmax = Math.log10(Math.max(0.001, rawMax));
      return (Math.log10(Math.max(0.0001, v)) - lmin) / (lmax - lmin || 1);
    }
    const pad = (rawMax - rawMin) * 0.12;
    return (v - (rawMin - pad)) / ((rawMax + pad) - (rawMin - pad) || 1);
  };

  // SVG geometry (matches PeriodTrendsChart desktop dims)
  const VB_W = 600;
  const VB_H = 375;
  const X0 = 36;
  const X1 = 588;
  const Y0 = 40;
  const Y1 = 320;
  const W = X1 - X0;
  const H = Y1 - Y0;

  const getX = (i: number) =>
    points.length <= 1 ? X0 + W / 2 : X0 + (i / (points.length - 1)) * W;
  const getY = (v: number) => Y0 + (1 - toNorm(v)) * H;

  const validPts = points
    .map((p, i) => ({ ...p, i, x: getX(i), y: p.value !== null ? getY(p.value) : null }))
    .filter((p): p is TrendPoint & { i: number; x: number; y: number } => p.y !== null);

  const pathD = validPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const gridYs = [Y0 + H * 0.07, Y0 + H * 0.5, Y0 + H * 0.93];

  const isValley = (i: number) => {
    const cur = points[i].value;
    if (cur === null) return false;
    const prev = points.slice(0, i).reverse().find((p) => p.value !== null)?.value ?? null;
    const next = points.slice(i + 1).find((p) => p.value !== null)?.value ?? null;
    return prev !== null && next !== null && cur < prev && cur < next;
  };

  const hasAnyData = validPts.length > 0;

  return (
    <>
      <div className="relative h-[360px] sm:h-[440px] bg-[#0B0F15] rounded-xl border border-white/5 p-3 sm:p-5">
        <div className="absolute top-3 left-4 sm:left-6 text-sm sm:text-base text-gray-200 font-bold flex items-center gap-2">
          {property.label}
          <span className="text-xs sm:text-sm font-normal text-gray-500">({property.unit})</span>
        </div>
        {Object.keys(excMap).length > 0 && (
          <div className="absolute top-3 right-4 sm:right-6 flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-[10px] sm:text-xs text-gray-400">Exception — tap</span>
          </div>
        )}

        {!hasAnyData ? (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            No NCERT {property.short} data for {axis === 'period' ? `Period ${selection}` : `Group ${selection}`}.
          </div>
        ) : (
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="ptx-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="50%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
            </defs>

            {gridYs.map((y) => (
              <line
                key={y}
                x1={X0}
                x2={X1}
                y1={y}
                y2={y}
                stroke="#374151"
                strokeDasharray="2"
                strokeWidth="0.5"
              />
            ))}

            {validPts.length > 1 && (
              <motion.path
                key={`${axis}-${selection}-${property.key}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9 }}
                d={pathD}
                fill="none"
                stroke="url(#ptx-line)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {validPts.map(({ el, i, x, y, value }) => {
              const isHov = hovered === i;
              const hasExc = excMap[el.symbol] !== undefined;
              const valley = isValley(i);
              const labelY = y + (valley ? 22 : -14);
              return (
                <g
                  key={el.atomicNumber}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() =>
                    hasExc && setOpenExc(openExc?.title === excMap[el.symbol].title ? null : excMap[el.symbol])
                  }
                  style={{ cursor: hasExc ? 'pointer' : 'default' }}
                >
                  {hasExc && (
                    <circle
                      cx={x}
                      cy={y}
                      r={10}
                      fill="rgba(251,191,36,0.08)"
                      stroke="rgba(251,191,36,0.4)"
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHov ? 5 : 3.5}
                    className="transition-all"
                    fill={hasExc ? '#fbbf24' : '#ffffff'}
                    stroke={hasExc ? '#f59e0b' : '#818cf8'}
                    strokeWidth="1.5"
                  />
                  {hasExc && !isHov && (
                    <text x={x} y={y - 10} textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">
                      !
                    </text>
                  )}
                  {value !== null && (validPts.length <= 12 || isHov) && (
                    <text
                      x={x}
                      y={labelY}
                      textAnchor="middle"
                      fill="white"
                      fontSize="13"
                      fontWeight="500"
                      stroke="#0d1117"
                      strokeWidth="3"
                      strokeLinejoin="round"
                      style={{ paintOrder: 'stroke' }}
                    >
                      {fmt(value, property)}
                    </text>
                  )}
                  <text x={x} y={345} textAnchor="middle" fill="#9ca3af" fontSize="13">
                    {el.symbol}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {Object.keys(excMap).length > 0 && (
        <p className="text-center text-xs text-amber-500/60 mt-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5 align-middle" />
          Amber dots mark exceptions — tap one for the explanation
        </p>
      )}

      <AnimatePresence>
        {openExc && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            <ExceptionCard note={openExc} onClose={() => setOpenExc(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function PeriodicTrendsExplorerSim() {
  const [property, setProperty] = useState<PropertyDef>(PROPERTIES[0]);
  const [axis, setAxis] = useState<'period' | 'group'>('period');
  const [period, setPeriod] = useState(2);
  const [group, setGroup] = useState(1);

  const selection = axis === 'period' ? period : group;

  const visibleExceptions = useMemo(() => {
    const map = (axis === 'period' ? PERIOD_EXCEPTIONS : GROUP_EXCEPTIONS)[property.key] || {};
    // only those whose element is actually in the current selection
    const inView = new Set(
      ELEMENTS.filter((e) => (axis === 'period' ? e.period === selection : e.group === selection)).map(
        (e) => e.symbol,
      ),
    );
    return Object.entries(map)
      .filter(([sym]) => inView.has(sym))
      .map(([, note]) => note);
  }, [axis, selection, property]);

  return (
    <div className="rounded-2xl border border-white/5 p-3 sm:p-5" style={{ background: '#0d1117' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-indigo-500/10">
          <TrendingUp size={22} className="text-indigo-300" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Periodic Trends Explorer</h3>
          <p className="text-sm text-gray-400">See every trend — and its exceptions — on real NCERT data</p>
        </div>
      </div>

      {/* Property selector */}
      <div className="mb-5">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
          Choose a property
        </span>
        <div className="flex flex-wrap gap-2">
          {PROPERTIES.map((p) => {
            const active = p.key === property.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setProperty(p)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                  active
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold border-transparent shadow-lg'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* View 1: Heatmap */}
      <div className="rounded-xl bg-[#0B0F15] border border-white/5 p-3 sm:p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Thermometer size={15} className="text-amber-400" />
          <h4 className="text-sm font-semibold text-gray-200">
            Heatmap — every element coloured by {property.label}
          </h4>
        </div>
        <Heatmap
          property={property}
          onPickGroup={(g) => {
            setAxis('group');
            setGroup(g);
          }}
          onPickPeriod={(p) => {
            setAxis('period');
            setPeriod(p);
          }}
        />
      </div>

      {/* View 2: Trend graph */}
      <div className="rounded-xl bg-[#0B0F15] border border-white/5 p-3 sm:p-4">
        {/* Axis toggle + selectors */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setAxis('period')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                axis === 'period' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ArrowRight size={14} /> Across a period
            </button>
            <button
              type="button"
              onClick={() => setAxis('group')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                axis === 'group' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ArrowDown size={14} /> Down a group
            </button>
          </div>

          {/* selector pills */}
          {axis === 'period' ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-gray-500 mr-1">Period</span>
              {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                    period === p ? 'bg-indigo-500/30 border border-indigo-400/50 text-white' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1 flex-wrap max-w-full overflow-x-auto">
              <span className="text-xs text-gray-500 mr-1">Group</span>
              {Array.from({ length: 18 }, (_, i) => i + 1).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGroup(g)}
                  className={`w-7 h-7 rounded-md text-xs font-semibold transition-all flex-shrink-0 ${
                    group === g ? 'bg-indigo-500/30 border border-indigo-400/50 text-white' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          )}
        </div>

        <TrendChart axis={axis} selection={selection} property={property} />

        {/* Key exceptions list for current view */}
        {visibleExceptions.length > 0 && (
          <div className="mt-5">
            <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2 mb-3">
              <AlertTriangle size={15} />
              Key Exceptions — {property.label} {axis === 'period' ? `(Period ${selection})` : `(Group ${selection})`}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {visibleExceptions.map((exc) => (
                <div
                  key={exc.title}
                  className="flex flex-col gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/5 border-l-2 border-l-amber-500/60"
                >
                  <span className="text-sm font-semibold text-amber-300 leading-snug">{exc.title}</span>
                  <p className="text-sm text-gray-300 leading-relaxed flex-1">{exc.explanation}</p>
                  <span className="self-start inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-medium">
                    {exc.jeeTag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sign-convention footnotes */}
        {property.key === 'electronAffinity' && (
          <p className="text-xs text-gray-500 italic mt-4 border-t border-white/5 pt-3">
            Sign convention varies by source. Here, more negative (or larger magnitude) means the element
            releases more energy on gaining an electron. Noble gases and Be/Mg-type elements show near-zero EA.
          </p>
        )}
        {property.key === 'density' && (
          <p className="text-xs text-gray-500 italic mt-4 border-t border-white/5 pt-3">
            Density uses a logarithmic scale. Gas-phase elements (H₂, N₂, O₂, noble gases) have near-zero
            density and can’t be meaningfully compared to solids on a linear axis.
          </p>
        )}
      </div>
    </div>
  );
}
