'use client';

/**
 * Unit Conversion Arena — SI prefixes for Length & Volume
 *
 * Academic source: NCERT Class 11 Chemistry, Chapter 1 — Some Basic Concepts
 * of Chemistry, §1.4 "Properties of Matter and their Measurement" (The
 * International System of Units, SI prefixes — Table 1.4).
 *
 * Sourced facts (verbatim relationships, not generated):
 *   SI prefixes: kilo = 10³, deci = 10⁻¹, centi = 10⁻², milli = 10⁻³,
 *                micro = 10⁻⁶, nano = 10⁻⁹.
 *   Length base unit = metre (m). Volume is derived from length.
 *   1 L = 1 dm³ ; 1 mL = 1 cm³ ; 1 m³ = 1000 L = 10⁶ cm³ ; 1 cm³ = 10⁻⁶ m³.
 *   THE CUBE TRAP: 1 cm = 10⁻² m, but 1 cm³ = (10⁻²)³ m³ = 10⁻⁶ m³ — cubing a
 *   length cubes its conversion factor. This is where most exam slips happen.
 *
 * Pedagogical goal: drill the two places students lose easy marks —
 *   (1) sliding a value up/down the metric prefix ladder by powers of ten, and
 *   (2) remembering that volume (length³) scales by the CUBE of the linear
 *       factor (cm³ ↔ mm³ is ×1000, not ×10).
 *
 * Two modes:
 *   • Ladder  — an explorer: type a value at any rung, watch every other unit
 *               update live, with the power-of-ten gap shown on each step.
 *   • Arena   — a scored challenge game: convert X to Y, pick from 4 options
 *               whose distractors are the real mistakes (decade slip, inverted
 *               direction, linear-instead-of-cubic), streak + best-streak.
 *
 * This component is loaded with { ssr: false } via SimulationBlockRenderer, so
 * Math.random() at runtime is safe (no hydration mismatch).
 */

import { useState, useMemo, useCallback } from 'react';

// ── Unit model ──────────────────────────────────────────────────────────────
// `exp` = power of ten of ONE unit measured in the quantity's base unit.
//   Length base = metre.  Volume base = litre.
// `linExp` (volume cubic units only) = the LINEAR decade index, i.e. exp / 3.
//   Used to build the "linear-instead-of-cubic" trap distractor.

interface Unit {
  sym: React.ReactNode;   // display symbol (may carry a superscript)
  plain: string;          // plain-text symbol for question prose
  exp: number;            // decades above/below the base unit
  prefix: string;         // prefix name (for captions)
  equiv?: string;         // equivalent name shown as a chip (e.g. cm³ = mL)
  linExp?: number;        // linear decade index for cubic volume units
  real?: string;          // approximate real-world scale anchor (illustrative)
}

// Length ladder — metre base. Covers every prefix the syllabus drills.
// `real` values are approximate everyday scale anchors (illustrative, not exact
// measurements) — they make the abstract power-of-ten scale tangible.
const LENGTH_UNITS: Unit[] = [
  { sym: 'km', plain: 'km', exp: 3,  prefix: 'kilo',  real: 'a 12-minute walk' },
  { sym: 'm',  plain: 'm',  exp: 0,  prefix: '—',     real: 'one big step' },
  { sym: 'dm', plain: 'dm', exp: -1, prefix: 'deci',  real: 'a hand-span' },
  { sym: 'cm', plain: 'cm', exp: -2, prefix: 'centi', real: 'a fingernail' },
  { sym: 'mm', plain: 'mm', exp: -3, prefix: 'milli', real: 'a grain of sand' },
  { sym: 'µm', plain: 'µm', exp: -6, prefix: 'micro', real: 'a bacterium' },
  { sym: 'nm', plain: 'nm', exp: -9, prefix: 'nano',  real: 'a strand of DNA' },
];

// Volume units — cubic-length, base litre (1 L = 1 dm³). The whole insight is
// that each named cube unit is THREE decades from the next, because cubing a
// length cubes its factor. The litre twins (dm³=L, cm³=mL, mm³=µL) are shown
// as equivalence chips.
const VOLUME_CUBIC: Unit[] = [
  { sym: <>m³</>,  plain: 'm³',  exp: 3,  prefix: 'kilo',  equiv: 'kL',  linExp: 1,  real: 'a washing machine' },
  { sym: <>dm³</>, plain: 'dm³', exp: 0,  prefix: '—',     equiv: 'L',   linExp: 0,  real: 'a 1-litre carton' },
  { sym: <>cm³</>, plain: 'cm³', exp: -3, prefix: 'milli', equiv: 'mL',  linExp: -1, real: 'a sugar cube' },
  { sym: <>mm³</>, plain: 'mm³', exp: -6, prefix: 'micro', equiv: 'µL',  linExp: -2, real: 'a pin-head' },
];

// ── Power-of-ten rendering ──────────────────────────────────────────────────
// Options all share one mantissa and differ only by exponent, so we render
// every value as "mantissa × 10ᵉ unit" — never JS "2.5e+5" e-notation.

function Pow({ mantissa, exp }: { mantissa: number; exp: number }) {
  if (exp === 0) return <span className="tabular-nums">{trimMantissa(mantissa)}</span>;
  return (
    <span className="tabular-nums">
      {trimMantissa(mantissa)} × 10<sup style={{ fontSize: '0.7em' }}>{exp}</sup>
    </span>
  );
}

function trimMantissa(m: number): string {
  // 2.5 → "2.5", 2 → "2", 7.5 → "7.5"
  return Number.isInteger(m) ? String(m) : String(m);
}

// Format a value (mantissa × 10^exp in some unit) as a normalised plain number
// for the live Ladder readout. Keeps a clean decimal when the magnitude is
// human-friendly, otherwise falls back to scientific.
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function sci(value: number): string {
  if (value === 0) return '0';
  const e = Math.floor(Math.log10(Math.abs(value)));
  const m = value / Math.pow(10, e);
  const supStr = String(Math.abs(e)).split('').map((d) => SUP[+d]).join('');
  const sign = e < 0 ? '⁻' : '';
  const mant = Number(m.toFixed(3)).toString();
  return `${mant} × 10${sign}${supStr}`;
}
function ladderReadout(value: number): string {
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 0.001 && abs < 1e7) {
    // human-friendly decimal
    return Number(value.toPrecision(6)).toLocaleString('en-US', { maximumFractionDigits: 6 });
  }
  return sci(value);
}

// Signed Unicode superscript for an integer exponent, e.g. -3 → "⁻³", 5 → "⁵".
function supSigned(n: number): string {
  const digits = String(Math.abs(n)).split('').map((d) => SUP[+d]).join('');
  return (n < 0 ? '⁻' : '') + digits;
}

// ── Shared palette (Section 3 of SIMULATION_DESIGN_WORKFLOW) ─────────────────
const ACCENT = {
  length: { color: '#818cf8', soft: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.4)' },
  volume: { color: '#22d3ee', soft: 'rgba(34,211,238,0.12)',  border: 'rgba(34,211,238,0.4)' },
} as const;

type Quantity = 'length' | 'volume';
type Mode = 'explore' | 'arena';

// ════════════════════════════════════════════════════════════════════════════
//  EXPLORE MODE — ask one question, get one answer, SEE the jump
// ════════════════════════════════════════════════════════════════════════════
//
// Redesigned (2026-06-10) away from the 7-row "ladder" that overwhelmed
// students. Now it reads like a sentence — "I have [1] [km], how much in [m]?"
// — gives one big answer, and draws the gap on a scale where one decade = one
// fixed step, so the on-screen DISTANCE between two units literally equals the
// number of decimal places you slide. Micro/nano sit far from the everyday
// units, which is the point.

// A horizontal row of unit pills — the only control the student touches.
function PillRow({ units, idx, onPick, accent, label }: {
  units: Unit[]; idx: number; onPick: (i: number) => void;
  accent: { color: string; soft: string; border: string }; label: string;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-black uppercase tracking-widest" style={{ width: 42, color: '#64748b' }}>
        {label}
      </span>
      {units.map((u, i) => {
        const on = i === idx;
        return (
          <button
            key={u.plain}
            onClick={() => onPick(i)}
            className="px-3 py-1.5 rounded-lg text-base font-bold transition-all"
            style={{
              background: on ? accent.soft : 'rgba(255,255,255,0.03)',
              border: `1px solid ${on ? accent.border : 'rgba(255,255,255,0.08)'}`,
              color: on ? accent.color : '#94a3b8',
              minWidth: 52,
            }}
          >
            {u.sym}
          </button>
        );
      })}
    </div>
  );
}

// The power-of-ten scale: units placed by exponent so distance = decades.
function ScaleStrip({ units, fromIdx, toIdx, accent }: {
  units: Unit[]; fromIdx: number; toIdx: number; accent: { color: string };
}) {
  const exps = units.map((u) => u.exp);
  const minE = Math.min(...exps) - 1;
  const maxE = Math.max(...exps) + 1;
  const W = 1000, H = 132, padX = 70, axisY = 78;
  const xOf = (e: number) => padX + ((e - minE) / (maxE - minE)) * (W - 2 * padX);

  const from = units[fromIdx], to = units[toIdx];
  const xF = xOf(from.exp), xT = xOf(to.exp);
  const k = from.exp - to.exp;
  const left = Math.min(xF, xT), right = Math.max(xF, xT);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {/* base axis */}
      <line x1={padX} y1={axisY} x2={W - padX} y2={axisY} stroke="rgba(255,255,255,0.12)" strokeWidth={2} />

      {/* highlighted span between the two chosen units */}
      {fromIdx !== toIdx && (
        <>
          <line x1={left} y1={axisY} x2={right} y2={axisY} stroke={accent.color} strokeWidth={5} strokeLinecap="round" />
          <path
            d={`M ${left} ${axisY - 30} L ${left} ${axisY - 14} M ${left} ${axisY - 30} L ${right} ${axisY - 30} M ${right} ${axisY - 30} L ${right} ${axisY - 14}`}
            stroke={accent.color} strokeWidth={2.5} fill="none"
          />
          <text x={(left + right) / 2} y={axisY - 40} textAnchor="middle" fill={accent.color} style={{ fontSize: 30, fontWeight: 800 }}>
            × 10{supSigned(k)}
          </text>
        </>
      )}

      {/* unit stops */}
      {units.map((u, i) => {
        const ux = xOf(u.exp);
        const isF = i === fromIdx, isT = i === toIdx, on = isF || isT;
        return (
          <g key={u.plain}>
            <circle cx={ux} cy={axisY} r={on ? 8 : 4} fill={on ? accent.color : 'rgba(255,255,255,0.28)'} />
            <text x={ux} y={axisY + 30} textAnchor="middle" fill={on ? '#ffffff' : '#64748b'} style={{ fontSize: 21, fontWeight: 800 }}>
              {u.plain}
            </text>
            {on && (
              <text x={ux} y={axisY + 48} textAnchor="middle" fill={accent.color} style={{ fontSize: 13, fontWeight: 700 }}>
                {isF ? 'from' : 'to'}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// The volume cube picture — answers "why 1000, not 10?" at a glance.
function CubeTrap() {
  // 10×10 front grid + skewed top/side faces to suggest a 10×10×10 solid.
  const cells = Array.from({ length: 11 }, (_, i) => i);
  const x0 = 30, y0 = 56, s = 90, step = s / 10, depth = 34;
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.25)' }}>
      <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#fbbf24' }}>
        Why volume jumps by 1000, not 10
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <svg viewBox="0 0 180 180" width={150} height={150} style={{ flexShrink: 0 }}>
          {/* top face */}
          <path d={`M ${x0} ${y0} L ${x0 + depth} ${y0 - depth} L ${x0 + s + depth} ${y0 - depth} L ${x0 + s} ${y0} Z`}
            fill="rgba(251,191,36,0.10)" stroke="rgba(251,191,36,0.6)" strokeWidth={1.2} />
          {/* right face */}
          <path d={`M ${x0 + s} ${y0} L ${x0 + s + depth} ${y0 - depth} L ${x0 + s + depth} ${y0 + s - depth} L ${x0 + s} ${y0 + s} Z`}
            fill="rgba(251,191,36,0.06)" stroke="rgba(251,191,36,0.6)" strokeWidth={1.2} />
          {/* front face */}
          <rect x={x0} y={y0} width={s} height={s} fill="rgba(251,191,36,0.05)" stroke="rgba(251,191,36,0.7)" strokeWidth={1.4} />
          {/* front grid */}
          {cells.map((i) => (
            <g key={i}>
              <line x1={x0 + i * step} y1={y0} x2={x0 + i * step} y2={y0 + s} stroke="rgba(251,191,36,0.28)" strokeWidth={0.7} />
              <line x1={x0} y1={y0 + i * step} x2={x0 + s} y2={y0 + i * step} stroke="rgba(251,191,36,0.28)" strokeWidth={0.7} />
            </g>
          ))}
          {/* edge labels */}
          <text x={x0 + s / 2} y={y0 + s + 16} textAnchor="middle" fill="#fbbf24" style={{ fontSize: 12, fontWeight: 800 }}>10</text>
          <text x={x0 + s + depth + 8} y={y0 + s / 2} textAnchor="start" fill="#fbbf24" style={{ fontSize: 12, fontWeight: 800 }}>10</text>
        </svg>
        <p className="text-sm leading-snug flex-1" style={{ color: '#cbd5e1', minWidth: 220 }}>
          A cube <b>1 cm</b> on each side is filled by <b style={{ color: '#fbbf24' }}>10 × 10 × 10 = 1000</b> little <b>1 mm</b> cubes.
          So even though <b>1 cm = 10 mm</b> in length, <b style={{ color: '#fbbf24' }}>1 cm³ = 1000 mm³</b> in volume.
          Cubing the side cubes the count — that is the slip examiners count on.
        </p>
      </div>
      <div className="flex gap-2 mt-3 flex-wrap">
        {[['1 m³', '1000 L'], ['1 dm³', '1 L'], ['1 cm³', '1 mL'], ['1 mm³', '1 µL']].map(([a, b]) => (
          <span key={a} className="px-2.5 py-1 rounded-md text-[12px]"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#cbd5e1' }}>
            <b style={{ color: '#fbbf24' }}>{a}</b> = {b}
          </span>
        ))}
      </div>
    </div>
  );
}

function ExploreMode({ quantity }: { quantity: Quantity }) {
  const units = quantity === 'length' ? LENGTH_UNITS : VOLUME_CUBIC;
  const accent = ACCENT[quantity];
  const [fromIdx, setFromIdx] = useState(1);                              // m / dm³
  const [toIdx, setToIdx] = useState(quantity === 'length' ? 3 : 2);     // cm / cm³
  const [draft, setDraft] = useState('1');

  const v = parseFloat(draft);
  const valid = isFinite(v);
  const from = units[fromIdx], to = units[toIdx];
  const k = from.exp - to.exp;
  const result = valid ? v * Math.pow(10, k) : NaN;
  const places = Math.abs(k);
  const dir = k >= 0 ? 'right' : 'left';
  const same = fromIdx === toIdx;

  return (
    <div className="flex flex-col gap-5">
      {/* The question — value input + two pill rows */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ width: 42, color: '#64748b' }}>
            I have
          </span>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            inputMode="decimal"
            className="tabular-nums text-center"
            style={{
              width: 120, background: 'rgba(255,255,255,0.04)', border: `1px solid ${accent.border}`,
              borderRadius: 10, padding: '8px 10px', color: '#fff', fontSize: 22, fontWeight: 800, outline: 'none',
            }}
          />
        </div>
        <PillRow units={units} idx={fromIdx} onPick={setFromIdx} accent={accent} label="of" />
        <PillRow units={units} idx={toIdx} onPick={setToIdx} accent={accent} label="in" />
      </div>

      {/* The answer */}
      <div className="rounded-2xl px-6 py-6 text-center"
        style={{ background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <div className="flex items-center justify-center gap-3 flex-wrap" style={{ fontSize: 34, fontWeight: 800, color: '#fff' }}>
          <span className="tabular-nums">{valid ? trimMantissa(v) : '—'} {from.plain}</span>
          <span style={{ color: accent.color }}>=</span>
          <span className="tabular-nums" style={{ color: accent.color }}>{valid ? ladderReadout(result) : '—'} {to.plain}</span>
        </div>
        {!same && valid && (
          <div className="text-sm mt-3" style={{ color: '#94a3b8' }}>
            multiply by <b style={{ color: '#fff' }}>10{supSigned(k)}</b> — slide the decimal point{' '}
            <b style={{ color: '#fff' }}>{places}</b> place{places !== 1 ? 's' : ''} to the <b style={{ color: '#fff' }}>{dir}</b>
          </div>
        )}
        {same && (
          <div className="text-sm mt-3" style={{ color: '#64748b' }}>Pick two different units to see the jump.</div>
        )}
      </div>

      {/* The scale */}
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#475569' }}>
          {quantity === 'length'
            ? 'The scale — distance here = how far the decimal moves'
            : 'The scale — each cube unit is 3 steps away (that is the cube)'}
        </div>
        <ScaleStrip units={units} fromIdx={fromIdx} toIdx={toIdx} accent={accent} />
        <div className="flex justify-center gap-8 text-sm" style={{ color: '#94a3b8' }}>
          {from.real && <span><b style={{ color: accent.color }}>{from.plain}</b> ≈ {from.real}</span>}
          {to.real && <span><b style={{ color: accent.color }}>{to.plain}</b> ≈ {to.real}</span>}
        </div>
      </div>

      {/* Volume cube trap */}
      {quantity === 'volume' && <CubeTrap />}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  ARENA MODE — the scored challenge game
// ════════════════════════════════════════════════════════════════════════════

interface Question {
  quantity: Quantity;
  mantissa: number;
  from: Unit;
  to: Unit;
  correctExp: number;          // Δ = from.exp − to.exp
  options: number[];           // candidate exponents, shuffled
  explanation: React.ReactNode;
}

const MANTISSAS = [1, 2, 2.5, 3, 4, 5, 7.5];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildQuestion(focus: Quantity | 'mixed'): Question {
  const quantity: Quantity = focus === 'mixed' ? (Math.random() < 0.5 ? 'length' : 'volume') : focus;
  // For volume, deliberately use the cubic-length units so the cube trap shows up.
  const pool = quantity === 'length' ? LENGTH_UNITS : VOLUME_CUBIC;

  let from = pick(pool);
  let to = pick(pool);
  let guard = 0;
  while (to.plain === from.plain && guard++ < 20) to = pick(pool);

  const mantissa = pick(MANTISSAS);
  const correctExp = from.exp - to.exp;

  // Distractor exponents — each a real mistake path:
  const cand = new Set<number>();
  cand.add(correctExp + 1);          // slipped one decade
  cand.add(correctExp - 1);          // slipped one decade the other way
  cand.add(-correctExp);             // multiplied where they should have divided
  if (from.linExp !== undefined && to.linExp !== undefined) {
    cand.add(from.linExp - to.linExp); // used the LINEAR gap, forgot to cube
  }
  cand.add(correctExp + 2);          // backups in case of collisions
  cand.add(correctExp - 2);
  cand.delete(correctExp);

  const distractors = Array.from(cand).filter((e) => e !== correctExp).slice(0, 3);
  const options = shuffle([correctExp, ...distractors]);

  // Explanation names why the key is right + why the tempting trap is wrong.
  const usedCube = from.linExp !== undefined && to.linExp !== undefined && (from.linExp - to.linExp) !== correctExp;
  const explanation = (
    <>
      {from.plain} → {to.plain}: subtract the exponents,{' '}
      <b style={{ color: '#34d399' }}>
        ({from.exp}) − ({to.exp}) = {correctExp}
      </b>
      , so multiply by <b style={{ color: '#34d399' }}>10<sup>{correctExp}</sup></b>:{' '}
      {mantissa} {from.plain} = <b style={{ color: '#34d399' }}>{trimMantissa(mantissa)} × 10<sup>{correctExp}</sup> {to.plain}</b>.
      {usedCube && (
        <> The trap: {from.plain} and {to.plain} look one prefix apart, but they are <b style={{ color: '#fbbf24' }}>cubic</b> units — the factor is cubed (×10<sup>{correctExp}</sup>, not ×10<sup>{from.linExp! - to.linExp!}</sup>).</>
      )}
    </>
  );

  return { quantity, mantissa, from, to, correctExp, options, explanation };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ArenaMode() {
  const [focus, setFocus] = useState<Quantity | 'mixed'>('mixed');
  const [q, setQ] = useState<Question>(() => buildQuestion('mixed'));
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  const next = useCallback((f: Quantity | 'mixed') => {
    setQ(buildQuestion(f));
    setPicked(null);
  }, []);

  const choose = (exp: number) => {
    if (picked !== null) return;
    setPicked(exp);
    setAnswered((n) => n + 1);
    if (exp === q.correctExp) {
      setScore((s) => s + 1);
      setStreak((s) => {
        const ns = s + 1;
        setBest((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
  };

  const setFocusAndReset = (f: Quantity | 'mixed') => { setFocus(f); next(f); };

  const isDone = picked !== null;
  const isCorrect = picked === q.correctExp;
  const qAccent = q.quantity === 'length' ? ACCENT.length : ACCENT.volume;

  return (
    <div className="flex flex-col gap-4">
      {/* Focus selector + scoreboard */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex gap-1">
          {(['mixed', 'length', 'volume'] as const).map((f) => {
            const active = focus === f;
            return (
              <button
                key={f}
                onClick={() => setFocusAndReset(f)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all"
                style={{
                  background: active ? 'rgba(129,140,248,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : 'rgba(255,255,255,0.07)'}`,
                  color: active ? '#c4b5fd' : '#64748b',
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
        <div className="flex gap-4 tabular-nums">
          <Stat label="Score" value={`${score}/${answered}`} color="#e2e8f0" />
          <Stat label="Streak" value={String(streak)} color="#fbbf24" />
          <Stat label="Best" value={String(best)} color="#34d399" />
        </div>
      </div>

      {/* Question card */}
      <div
        className="rounded-2xl px-6 py-7 text-center"
        style={{ background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)' }}
      >
        <div className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: qAccent.color }}>
          Convert this {q.quantity}
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap" style={{ fontSize: 30, fontWeight: 800, color: '#ffffff' }}>
          <span className="tabular-nums">{trimMantissa(q.mantissa)} {q.from.sym}</span>
          <span style={{ color: '#6366f1' }}>=</span>
          <span style={{ color: qAccent.color }}>?</span>
          <span style={{ color: '#cbd5e1' }}>{q.to.sym}</span>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {q.options.map((exp) => {
          const isKey = exp === q.correctExp;
          const isPick = exp === picked;
          let bg = 'rgba(255,255,255,0.03)';
          let border = 'rgba(255,255,255,0.08)';
          let col = '#cbd5e1';
          if (isDone) {
            if (isKey) { bg = 'rgba(52,211,153,0.12)'; border = 'rgba(52,211,153,0.5)'; col = '#6ee7b7'; }
            else if (isPick) { bg = 'rgba(248,113,113,0.1)'; border = 'rgba(248,113,113,0.5)'; col = '#f87171'; }
            else { col = '#64748b'; }
          }
          return (
            <button
              key={exp}
              onClick={() => choose(exp)}
              disabled={isDone}
              className="rounded-xl px-4 py-3.5 text-lg font-bold transition-all flex items-center justify-center gap-2"
              style={{ background: bg, border: `1.5px solid ${border}`, color: col, cursor: isDone ? 'default' : 'pointer' }}
            >
              <Pow mantissa={q.mantissa} exp={exp} /> <span>{q.to.sym}</span>
              {isDone && isKey && <span style={{ color: '#34d399' }}>✓</span>}
              {isDone && isPick && !isKey && <span style={{ color: '#f87171' }}>✗</span>}
            </button>
          );
        })}
      </div>

      {/* Feedback + next */}
      {isDone && (
        <div
          className="rounded-xl px-4 py-3.5"
          style={{
            background: isCorrect ? 'rgba(52,211,153,0.07)' : 'rgba(248,113,113,0.06)',
            border: `1px solid ${isCorrect ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
          }}
        >
          <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: isCorrect ? '#34d399' : '#f87171' }}>
            {isCorrect ? '✓ Spot on' : '✗ Not quite'}
          </div>
          <p className="text-sm leading-snug" style={{ color: '#cbd5e1' }}>{q.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => next(focus)}
          className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
          style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(129,140,248,0.4)', color: '#c4b5fd' }}
        >
          {isDone ? 'Next question →' : 'Skip →'}
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center">
      <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#64748b' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  ROOT
// ════════════════════════════════════════════════════════════════════════════

export default function UnitConversionArenaSim() {
  const [mode, setMode] = useState<Mode>('explore');
  const [quantity, setQuantity] = useState<Quantity>('length');
  const accent = ACCENT[quantity];

  const modeTabs = useMemo(
    () => [
      { id: 'explore' as Mode, label: 'Convert', sub: 'see how' },
      { id: 'arena' as Mode, label: 'Arena', sub: 'scored game' },
    ],
    []
  );

  return (
    <div
      className="p-4 md:p-6 not-prose"
      style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, minHeight: '60vh', fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Unit Conversion <span style={{ color: '#7c3aed' }}>Arena</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
            SI prefixes · Length &amp; Volume · NCERT Class 11 Ch. 1
          </p>
        </div>
        {/* Mode tabs (underline style) */}
        <div className="flex gap-1">
          {modeTabs.map((t) => {
            const active = mode === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setMode(t.id)}
                className="px-3 py-1.5 text-center transition-all"
                style={{ borderBottom: `2px solid ${active ? '#818cf8' : 'rgba(255,255,255,0.06)'}`, opacity: active ? 1 : 0.5, background: 'none' }}
              >
                <div className="text-xs font-black" style={{ color: '#818cf8' }}>{t.label}</div>
                <div className="text-[10px]" style={{ color: '#475569' }}>{t.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity toggle — only meaningful in Convert (Arena has its own focus) */}
      {mode === 'explore' && (
        <div className="flex gap-2 mb-4">
          {(['length', 'volume'] as const).map((qn) => {
            const active = quantity === qn;
            const a = ACCENT[qn];
            return (
              <button
                key={qn}
                onClick={() => setQuantity(qn)}
                className="px-4 py-2 rounded-lg text-[12px] font-black uppercase tracking-wider transition-all"
                style={{
                  background: active ? a.soft : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? a.border : 'rgba(255,255,255,0.07)'}`,
                  color: active ? a.color : '#64748b',
                }}
              >
                {qn}
              </button>
            );
          })}
        </div>
      )}

      {mode === 'explore' ? <ExploreMode key={quantity} quantity={quantity} /> : <ArenaMode />}

      {/* Expert tip */}
      <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert Tip</div>
        <p className="text-sm font-bold leading-snug italic text-white">
          &ldquo;Write the prefix as a power of ten first (c = 10<sup>−2</sup>, µ = 10<sup>−6</sup>), then just add exponents.
          For volume, cube the prefix before you start — that single habit kills the most common conversion mistake in the exam.&rdquo;
        </p>
      </div>
    </div>
  );
}
