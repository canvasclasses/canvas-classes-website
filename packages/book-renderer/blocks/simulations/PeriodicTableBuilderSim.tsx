'use client';

// Periodic Table Builder — Aufbau-driven structure simulation.
// Class 11 Chemistry Ch.3 (Periodicity). Teaches that an element's POSITION
// in the table is a direct readout of its electron configuration.
//
// Data source: @canvas/data/periodic/elementsData (single source of truth
// for symbols, grid positions, blocks, periods, groups, electronConfig).
//
// Academic facts visualized (NCERT Class 11 Ch.3):
//  - Aufbau filling order: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p 7s 5f 6d 7p
//  - Block = subshell that receives the last (differentiating) electron.
//  - Period = highest principal quantum number n occupied.
//  - Group / valence: ns + np for main-group; (n-1)d ns for d-block.
// Note: the standard table layout places f-block (La/Ac series) as two detached
// rows; the data file already encodes this via row 8 (lanthanides) / row 9
// (actinides). We render those rows separately below the main grid.

import { useMemo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, RotateCcw, Atom } from 'lucide-react';
import { ELEMENTS, type Element } from '@canvas/data/periodic/elementsData';

// ---------------------------------------------------------------------------
// Palette (from SIMULATION_DESIGN_WORKFLOW §1, §3). Orange/amber is the
// product primary accent for this app (per task brief).
// ---------------------------------------------------------------------------
const BG_ROOT = '#050505';
const BG_CARD = '#0B0F15';
const BG_SURFACE = '#151E32';

// Block colors — used for the "color by block" view. Kept within the
// product's warm/cool palette family; orange remains the "current" highlight.
const BLOCK_COLORS: Record<Element['block'], { fill: string; text: string; label: string }> = {
  s: { fill: 'rgba(244,114,182,0.85)', text: '#fff', label: 's-block' }, // pink
  p: { fill: 'rgba(96,165,250,0.85)', text: '#fff', label: 'p-block' }, // blue
  d: { fill: 'rgba(52,211,153,0.85)', text: '#03251a', label: 'd-block' }, // emerald
  f: { fill: 'rgba(167,139,250,0.85)', text: '#fff', label: 'f-block' }, // violet
};

const ORANGE = '#f97316'; // current element highlight
const AMBER = '#fbbf24';

// ---------------------------------------------------------------------------
// Aufbau order + configuration parsing
// ---------------------------------------------------------------------------

// Canonical Aufbau fill order (n+l rule). Used to order the per-element
// configuration breakdown so the filling animation reflects Aufbau, even when
// the stored config lists subshells in n-order (e.g. [Ne] 3s² 3p⁶).
const AUFBAU_ORDER = [
  '1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p',
  '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p',
];
const AUFBAU_INDEX: Record<string, number> = Object.fromEntries(
  AUFBAU_ORDER.map((o, i) => [o, i]),
);

// Noble-gas cores → atomic number, so [Ne] etc. can be expanded.
const NOBLE_CORE: Record<string, number> = {
  He: 2, Ne: 10, Ar: 18, Kr: 36, Xe: 54, Rn: 86,
};

// Unicode superscripts ⁰¹²³… → integer count, and vice versa.
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function supToInt(s: string): number {
  let out = '';
  for (const ch of s) {
    const idx = SUP.indexOf(ch);
    if (idx >= 0) out += String(idx);
    else if (ch >= '0' && ch <= '9') out += ch;
  }
  return out === '' ? 1 : parseInt(out, 10);
}
function intToSup(n: number): string {
  return String(n).split('').map((d) => SUP[parseInt(d, 10)]).join('');
}

type Orbital = { key: string; n: number; sub: string; count: number };

const byId = (() => {
  const m = new Map<number, Element>();
  for (const el of ELEMENTS) m.set(el.atomicNumber, el);
  return m;
})();

// Parse one stored electronConfig string into explicit orbitals, expanding the
// noble-gas core recursively. Returns orbitals merged & sorted in Aufbau order.
function parseConfig(config: string): Orbital[] {
  const acc = new Map<string, number>(); // "3d" -> count

  function addToken(token: string) {
    // token like "3d¹⁰" or "2s²"
    const m = token.match(/^(\d)([spdf])([⁰¹²³⁴⁵⁶⁷⁸⁹]*|\d*)$/);
    if (!m) return;
    const n = parseInt(m[1], 10);
    const sub = m[2];
    const count = m[3] ? supToInt(m[3]) : 1;
    const key = `${n}${sub}`;
    acc.set(key, (acc.get(key) ?? 0) + count);
  }

  function expand(cfg: string) {
    const tokens = cfg.trim().split(/\s+/).filter(Boolean);
    for (const tk of tokens) {
      const core = tk.match(/^\[([A-Za-z]+)\]$/);
      if (core) {
        const z = NOBLE_CORE[core[1]];
        const coreEl = z ? byId.get(z) : undefined;
        if (coreEl) expand(coreEl.electronConfig);
        continue;
      }
      addToken(tk);
    }
  }

  expand(config);

  const orbitals: Orbital[] = [];
  for (const [key, count] of acc) {
    const n = parseInt(key[0], 10);
    const sub = key[1];
    orbitals.push({ key, n, sub, count });
  }
  orbitals.sort(
    (a, b) => (AUFBAU_INDEX[a.key] ?? 999) - (AUFBAU_INDEX[b.key] ?? 999),
  );
  return orbitals;
}

// Cache per-element parsed configs (computed once).
const configCache = new Map<number, Orbital[]>();
function configFor(z: number): Orbital[] {
  const cached = configCache.get(z);
  if (cached) return cached;
  const el = byId.get(z);
  const parsed = el ? parseConfig(el.electronConfig) : [];
  configCache.set(z, parsed);
  return parsed;
}

// The "differentiating" subshell = the one that gained an electron going from
// Z-1 to Z (this is what determines the block). Compares the two parsed configs
// in Aufbau order and finds the subshell with a higher count (or newly present).
function differentiatingSubshell(z: number): string | null {
  const cur = configFor(z);
  if (z <= 1) return cur[0]?.key ?? null;
  const prev = configFor(z - 1);
  const prevMap = new Map(prev.map((o) => [o.key, o.count]));
  // Prefer a subshell whose count increased. If several changed (rare data
  // quirks around d/f exceptions), pick the one latest in Aufbau order that
  // increased — that is the genuinely new electron.
  let best: string | null = null;
  let bestIdx = -1;
  for (const o of cur) {
    const before = prevMap.get(o.key) ?? 0;
    if (o.count > before) {
      const idx = AUFBAU_INDEX[o.key] ?? -1;
      if (idx >= bestIdx) {
        bestIdx = idx;
        best = o.key;
      }
    }
  }
  return best;
}

// Block letter inferred from the differentiating subshell (falls back to the
// data file's block field if the diff is ambiguous, e.g. Cr/Cu exceptions).
function blockFor(z: number): { block: Element['block']; diff: string | null } {
  const diff = differentiatingSubshell(z);
  const el = byId.get(z);
  const sub = diff ? (diff[1] as Element['block']) : null;
  // Trust the curated block field for placement; diff letter is for the "why".
  return { block: el?.block ?? (sub ?? 's'), diff };
}

// Valence (outermost-shell) configuration string for the caption.
function valenceConfig(z: number): string {
  const orbitals = configFor(z);
  const el = byId.get(z);
  if (!el) return '';
  const nMax = el.period;
  // Main group: ns + np at n = period. d-block: (n-1)d + ns. f-block: keep
  // outer ns plus the filling (n-2)f / (n-1)d for context.
  const pieces = orbitals.filter((o) => {
    if (o.n === nMax) return true; // outer s, p
    if (el.block === 'd' && o.sub === 'd' && o.n === nMax - 1) return true;
    if (el.block === 'f' && ((o.sub === 'f' && o.n === nMax - 2) || (o.sub === 'd' && o.n === nMax - 1))) return true;
    return false;
  });
  return pieces.map((o) => `${o.n}${o.sub}${intToSup(o.count)}`).join(' ');
}

// ---------------------------------------------------------------------------
// Grid geometry. Build a sparse map of (row,col) -> element. Main grid is
// rows 1-7, cols 1-18. f-block lives on rows 8 (lanthanides) and 9 (actinides).
// ---------------------------------------------------------------------------
const MAIN_ROWS = [1, 2, 3, 4, 5, 6, 7];
const F_ROWS = [8, 9];
const COLS = Array.from({ length: 18 }, (_, i) => i + 1);

const cellAt = (() => {
  const m = new Map<string, Element>();
  for (const el of ELEMENTS) m.set(`${el.row}:${el.col}`, el);
  return m;
})();

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function PeriodicTableBuilderSim() {
  const [z, setZ] = useState(1); // current atomic number (1..118)
  const [colorByBlock, setColorByBlock] = useState(true);
  // Track previous period so we can surface "Period N begins" notes.
  const [prevPeriod, setPrevPeriod] = useState(1);
  const [periodNote, setPeriodNote] = useState<string | null>(null);

  const el = byId.get(z)!;
  const orbitals = useMemo(() => configFor(z), [z]);
  const diff = useMemo(() => differentiatingSubshell(z), [z]);
  const { block } = useMemo(() => blockFor(z), [z]);
  const valence = useMemo(() => valenceConfig(z), [z]);

  // Detect entering a new period when advancing.
  useEffect(() => {
    if (el.period > prevPeriod) {
      const shell = el.period;
      setPeriodNote(
        `Period ${shell} begins — electrons start filling the n=${shell} shell.`,
      );
    } else if (el.period < prevPeriod) {
      setPeriodNote(null);
    }
    setPrevPeriod(el.period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [z]);

  const next = useCallback(() => setZ((v) => Math.min(118, v + 1)), []);
  const prev = useCallback(() => setZ((v) => Math.max(1, v - 1)), []);
  const reset = useCallback(() => {
    setZ(1);
    setPrevPeriod(1);
    setPeriodNote(null);
  }, []);

  // Keyboard arrows for desktop convenience.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const blockReason = (() => {
    if (!diff) return '';
    const sub = diff[1];
    const map: Record<string, string> = {
      s: 'the last electron entered an s-orbital → s-block',
      p: 'the last electron entered a p-orbital → p-block',
      d: 'the last electron entered a d-orbital → d-block',
      f: 'the last electron entered an f-orbital → f-block',
    };
    return map[sub] ?? '';
  })();

  return (
    <div
      className="w-full rounded-2xl p-4 sm:p-5 md:p-6"
      style={{ background: BG_ROOT, color: '#e2e8f0' }}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <Atom size={26} style={{ color: ORANGE }} />
            Periodic Table <span style={{ color: ORANGE }}>Builder</span>
          </h1>
          <p
            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mt-1"
            style={{ color: '#64748b' }}
          >
            Add electrons → watch the table build itself
          </p>
        </div>
        <div
          className="text-[10px] font-black uppercase tracking-widest pt-1"
          style={{ color: '#64748b' }}
        >
          Z = {z} / 118
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={prev}
          disabled={z <= 1}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-30"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8',
          }}
        >
          <ChevronLeft size={16} /> Prev
        </button>

        <button
          onClick={next}
          disabled={z >= 118}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-black transition-all disabled:opacity-40"
          style={{
            background: `linear-gradient(to right, ${ORANGE}, ${AMBER})`,
            color: '#000',
          }}
        >
          <Plus size={16} /> Add electron → next element
        </button>

        <button
          onClick={reset}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8',
          }}
        >
          <RotateCcw size={14} /> Reset
        </button>

        <button
          onClick={() => setColorByBlock((v) => !v)}
          className="px-3 py-2 rounded-lg text-xs font-bold transition-colors ml-auto"
          style={{
            background: colorByBlock ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${colorByBlock ? 'rgba(249,115,22,0.45)' : 'rgba(255,255,255,0.1)'}`,
            color: colorByBlock ? AMBER : '#64748b',
          }}
        >
          {colorByBlock ? '✓ Color by block' : 'Color by block'}
        </button>
      </div>

      {/* Quick-jump slider */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest shrink-0" style={{ color: '#64748b' }}>
          Jump to Z
        </span>
        <input
          type="range"
          min={1}
          max={118}
          value={z}
          onChange={(e) => setZ(parseInt(e.target.value, 10))}
          className="w-full"
          style={{ accentColor: ORANGE }}
          aria-label="Atomic number slider"
        />
        <span className="text-sm font-black tabular-nums w-10 text-right" style={{ color: AMBER }}>
          {z}
        </span>
      </div>

      {/* Period-begins note */}
      <AnimatePresence>
        {periodNote && (
          <motion.div
            key={periodNote}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold"
            style={{
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.3)',
              color: AMBER,
            }}
          >
            {periodNote}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Periodic table grid (horizontal scroll on mobile) */}
      <div className="overflow-x-auto -mx-1 px-1 pb-2">
        <div style={{ minWidth: 620 }}>
          <PeriodicGrid current={z} colorByBlock={colorByBlock} onPick={setZ} />
        </div>
      </div>

      {/* Lower panels: Aufbau + Caption reflow side-by-side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <AufbauPanel orbitals={orbitals} diff={diff} z={z} />
        <CaptionPanel
          el={el}
          block={block}
          blockReason={blockReason}
          valence={valence}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Periodic table grid
// ---------------------------------------------------------------------------
function PeriodicGrid({
  current,
  colorByBlock,
  onPick,
}: {
  current: number;
  colorByBlock: boolean;
  onPick: (z: number) => void;
}) {
  const renderRow = (row: number) => (
    <div
      key={row}
      className="grid gap-[2px] mb-[2px]"
      style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}
    >
      {COLS.map((col) => {
        const cell = cellAt.get(`${row}:${col}`);
        if (!cell) return <div key={col} aria-hidden />;
        return (
          <Cell
            key={col}
            el={cell}
            current={current}
            colorByBlock={colorByBlock}
            onPick={onPick}
          />
        );
      })}
    </div>
  );

  return (
    <div>
      {MAIN_ROWS.map(renderRow)}
      {/* Spacer between main grid and detached f-block */}
      <div className="h-2" />
      {F_ROWS.map(renderRow)}
    </div>
  );
}

function Cell({
  el,
  current,
  colorByBlock,
  onPick,
}: {
  el: Element;
  current: number;
  colorByBlock: boolean;
  onPick: (z: number) => void;
}) {
  const isCurrent = el.atomicNumber === current;
  const isBuilt = el.atomicNumber < current;
  const isFuture = el.atomicNumber > current;

  let bg = 'rgba(255,255,255,0.03)';
  let borderColor = 'rgba(255,255,255,0.06)';
  let symColor = '#475569';
  let znColor = '#334155';

  if (isCurrent) {
    bg = `linear-gradient(135deg, ${ORANGE}, ${AMBER})`;
    borderColor = AMBER;
    symColor = '#000';
    znColor = 'rgba(0,0,0,0.65)';
  } else if (isBuilt) {
    if (colorByBlock) {
      bg = BLOCK_COLORS[el.block].fill;
      symColor = BLOCK_COLORS[el.block].text;
      znColor = 'rgba(255,255,255,0.7)';
    } else {
      bg = 'rgba(249,115,22,0.16)';
      symColor = '#e2e8f0';
      znColor = '#94a3b8';
    }
    borderColor = 'rgba(255,255,255,0.12)';
  }

  return (
    <motion.button
      type="button"
      onClick={() => onPick(el.atomicNumber)}
      title={`${el.name} (${el.symbol}) — Z=${el.atomicNumber}`}
      animate={isCurrent ? { scale: [1, 1.12, 1] } : { scale: 1 }}
      transition={{ duration: 0.35 }}
      className="relative flex flex-col items-center justify-center rounded-[3px] select-none"
      style={{
        aspectRatio: '1 / 1',
        background: bg,
        border: `1px solid ${borderColor}`,
        boxShadow: isCurrent ? `0 0 14px rgba(249,115,22,0.6)` : 'none',
        opacity: isFuture ? 0.5 : 1,
        cursor: 'pointer',
        minHeight: 0,
        zIndex: isCurrent ? 2 : 1,
      }}
    >
      <span
        className="leading-none font-black"
        style={{ fontSize: 'clamp(7px, 1.1vw, 12px)', color: znColor }}
      >
        {el.atomicNumber}
      </span>
      <span
        className="leading-none font-black"
        style={{ fontSize: 'clamp(9px, 1.5vw, 15px)', color: symColor }}
      >
        {el.symbol}
      </span>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Aufbau electron-filling panel
// ---------------------------------------------------------------------------
function AufbauPanel({
  orbitals,
  diff,
  z,
}: {
  orbitals: Orbital[];
  diff: string | null;
  z: number;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: BG_CARD, border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <h2
        className="text-xs font-black uppercase tracking-widest mb-3"
        style={{ color: '#818cf8' }}
      >
        Aufbau — electron configuration
      </h2>

      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-2">
        <AnimatePresence mode="popLayout">
          {orbitals.map((o) => {
            const isNew = o.key === diff;
            return (
              <motion.span
                key={`${z}-${o.key}`}
                layout
                initial={isNew ? { scale: 0.6, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="font-bold rounded-md px-1.5 py-0.5"
                style={{
                  fontSize: 'clamp(13px, 2.4vw, 18px)',
                  background: isNew ? 'rgba(249,115,22,0.18)' : 'transparent',
                  border: isNew
                    ? `1px solid ${ORANGE}`
                    : '1px solid transparent',
                  color: isNew ? AMBER : '#cbd5e1',
                }}
              >
                {o.n}
                {o.sub}
                <sup style={{ fontSize: '0.7em' }}>{o.count}</sup>
              </motion.span>
            );
          })}
        </AnimatePresence>
      </div>

      <p className="mt-3 text-xs leading-snug" style={{ color: '#64748b' }}>
        Newest electron highlighted in orange. Orbitals are shown in Aufbau
        filling order: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p 7s 5f 6d 7p.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live explanation caption
// ---------------------------------------------------------------------------
function CaptionPanel({
  el,
  block,
  blockReason,
  valence,
}: {
  el: Element;
  block: Element['block'];
  blockReason: string;
  valence: string;
}) {
  const blockInfo = BLOCK_COLORS[block];
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{ background: BG_SURFACE, border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex flex-col items-center justify-center rounded-lg shrink-0"
          style={{
            width: 58,
            height: 58,
            background: `linear-gradient(135deg, ${ORANGE}, ${AMBER})`,
            color: '#000',
          }}
        >
          <span className="text-[9px] font-black leading-none">{el.atomicNumber}</span>
          <span className="text-2xl font-black leading-none">{el.symbol}</span>
        </div>
        <div>
          <div className="text-lg font-black text-white leading-tight">{el.name}</div>
          <div className="text-xs font-bold" style={{ color: '#94a3b8' }}>
            Atomic number {el.atomicNumber} · mass {el.atomicMass}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          label={blockInfo.label}
          color={blockInfo.fill}
        />
        <Badge label={`Period ${el.period}`} color="rgba(96,165,250,0.5)" />
        <Badge label={`Group ${el.group}`} color="rgba(52,211,153,0.45)" />
      </div>

      <div className="space-y-2 text-sm leading-snug" style={{ color: '#cbd5e1' }}>
        <p>
          <span className="font-black" style={{ color: AMBER }}>Block:</span>{' '}
          {blockReason || `${blockInfo.label}`}.
        </p>
        <p>
          <span className="font-black" style={{ color: AMBER }}>Period {el.period}:</span>{' '}
          the highest principal quantum number occupied is n = {el.period}.
        </p>
        <p>
          <span className="font-black" style={{ color: AMBER }}>Group {el.group}:</span>{' '}
          valence configuration{' '}
          <span className="font-bold" style={{ color: '#fff' }}>
            {valence || el.electronConfig}
          </span>
          .
        </p>
      </div>

      <p
        className="text-xs italic leading-snug pt-2"
        style={{ color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        Where an element sits in the table is just a readout of its electron
        configuration — the block is the last subshell filled, the period is the
        outer shell number, and the group follows the valence electrons.
      </p>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${color}`,
        color: '#e2e8f0',
      }}
    >
      {label}
    </span>
  );
}
