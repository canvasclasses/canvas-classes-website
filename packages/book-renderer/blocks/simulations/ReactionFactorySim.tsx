'use client';

/**
 * The Reaction Factory — a limiting-reagent explorer.
 *
 * Academic source: NCERT Class 11 Chemistry, Chapter 1 — Some Basic Concepts
 * of Chemistry (§1.10.2 Limiting Reagent). All four reactions and their
 * coefficients are standard balanced equations:
 *   2H2 + O2  -> 2H2O       (water synthesis)
 *   N2 + 3H2  -> 2NH3       (Haber process)
 *   C  + O2   -> CO2        (combustion of carbon)
 *   2CO + O2  -> 2CO2       (combustion of carbon monoxide)
 *
 * PEDAGOGICAL SHAPE — explore first, then predict (founder decision 2026-07-21):
 *
 *   1. EXPLORE (sandbox, default). The student drags each reactant's quantity
 *      and watches, live, which one becomes limiting. Because the amount can be
 *      displayed as mass / moles / gas volume of the SAME physical quantity,
 *      switching units teaches the conversion without a separate quiz gate.
 *   2. PREDICT (challenges). Fixed quantities in mixed units; the student
 *      commits to an answer BEFORE the bars are revealed, so the "bigger isn't
 *      more" misconception gets tested rather than just narrated.
 *
 * The core idea both halves drive at: what decides the limiting reagent is
 * moles / coefficient ("batches supported"), never the raw amount.
 *
 * Molarity / solution-volume conversion is intentionally excluded — the
 * Concentration of Solutions topic comes later in the chapter.
 *
 * DESIGN: follows SIMULATION_DESIGN_WORKFLOW.md. Deliberately restrained —
 * structure is carried by hairline dividers, never nested cards (§8), and
 * colour is reserved for MEANING, not identity: amber = the limiting reagent,
 * emerald = a perfectly balanced batch, indigo = interactive/product. Reactants
 * are told apart by position and formula, not by a colour each.
 *
 * NEEDS_REVIEW: none — standard NCERT reactions; molar masses use the book's
 * rounded convention (H2 = 2, N2 = 28, O2 = 32, C = 12, CO = 28, CO2 = 44,
 * NH3 = 17, H2O = 18) and the 22.4 L/mol molar volume at STP used throughout
 * this chapter.
 */

import { useState } from 'react';

const MOLAR_VOLUME_STP = 22.4;

// Palette — workflow §3 only. Each colour carries one meaning.
const C_LIMIT_BAR = '#d97706';   // amber, bar fill for the limiting reagent
const C_LIMIT_TXT = '#fbbf24';   // amber, its label
const C_NEUTRAL = 'rgba(148,163,184,0.38)'; // slate, every non-limiting bar
const C_ACCENT = '#818cf8';      // indigo, interactive + product
const C_OK = '#34d399';          // emerald, perfect-ratio state
const HAIRLINE = '1px solid rgba(255,255,255,0.05)';

// ── Number formatting (no monospace; trim to 3dp) ───────────────────────────
function fmt(v: number): string {
  if (!isFinite(v) || isNaN(v)) return '—';
  return String(Math.round(v * 1000) / 1000);
}

// ── Stacked fraction (workflow §2 — the ÷ glyph is banned; it reads as +) ────
function Frac({ num, den }: { num: React.ReactNode; den: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
      verticalAlign: 'middle', lineHeight: 1.15, margin: '0 3px',
    }}>
      <span style={{ padding: '0 5px 1px 5px' }}>{num}</span>
      <span style={{
        padding: '1px 5px 0 5px', borderTop: '1.5px solid currentColor',
        width: '100%', textAlign: 'center',
      }}>{den}</span>
    </span>
  );
}

// Rich formula with subscripts, e.g. sub('NH', 3) -> NH₃
function sub(base: string, ...subs: (string | number)[]): React.ReactNode {
  return <>{base}{subs.map((s, i) => <sub key={i}>{s}</sub>)}</>;
}

type Unit = 'g' | 'mol' | 'L';

interface Species {
  key: string;
  formula: React.ReactNode;
  coef: number;
  molarMass: number;
  gas: boolean;           // only gases offer the litres-at-STP unit
}

interface Reaction {
  id: string;
  label: string;
  equation: React.ReactNode;
  a: Species;
  b: Species;
  product: Species;
  /** Fixed quantities for the Predict half — deliberately mixed units. */
  challenge: { a: { given: number; unit: Unit }; b: { given: number; unit: Unit }; context: string };
}

const H2O = <>{sub('H', 2)}O</>;

const REACTIONS: Reaction[] = [
  {
    id: 'water',
    label: 'Water',
    equation: <>2{sub('H', 2)} + {sub('O', 2)} → 2{H2O}</>,
    a: { key: 'h2', formula: sub('H', 2), coef: 2, molarMass: 2, gas: true },
    b: { key: 'o2', formula: sub('O', 2), coef: 1, molarMass: 32, gas: true },
    product: { key: 'h2o', formula: H2O, coef: 2, molarMass: 18, gas: false },
    challenge: { a: { given: 5, unit: 'mol' }, b: { given: 3, unit: 'mol' },
      context: 'Hydrogen burning in oxygen — the reaction inside a fuel cell.' },
  },
  {
    id: 'haber',
    label: 'Ammonia',
    equation: <>{sub('N', 2)} + 3{sub('H', 2)} → 2{sub('NH', 3)}</>,
    a: { key: 'n2', formula: sub('N', 2), coef: 1, molarMass: 28, gas: true },
    b: { key: 'h2', formula: sub('H', 2), coef: 3, molarMass: 2, gas: true },
    product: { key: 'nh3', formula: sub('NH', 3), coef: 2, molarMass: 17, gas: true },
    challenge: { a: { given: 42, unit: 'g' }, b: { given: 6, unit: 'g' },
      context: 'The Haber process — how the world makes fertiliser. Given as masses.' },
  },
  {
    id: 'carbon',
    label: 'CO₂ from C',
    equation: <>C + {sub('O', 2)} → {sub('CO', 2)}</>,
    a: { key: 'c', formula: <>C</>, coef: 1, molarMass: 12, gas: false },
    b: { key: 'o2', formula: sub('O', 2), coef: 1, molarMass: 32, gas: true },
    product: { key: 'co2', formula: sub('CO', 2), coef: 1, molarMass: 44, gas: true },
    challenge: { a: { given: 24, unit: 'g' }, b: { given: 22.4, unit: 'L' },
      context: 'Burning carbon in oxygen — mass of a solid meets volume of a gas.' },
  },
  {
    id: 'co',
    label: 'CO₂ from CO',
    equation: <>2CO + {sub('O', 2)} → 2{sub('CO', 2)}</>,
    a: { key: 'co', formula: <>CO</>, coef: 2, molarMass: 28, gas: true },
    b: { key: 'o2', formula: sub('O', 2), coef: 1, molarMass: 32, gas: true },
    product: { key: 'co2', formula: sub('CO', 2), coef: 2, molarMass: 44, gas: true },
    challenge: { a: { given: 44.8, unit: 'L' }, b: { given: 33.6, unit: 'L' },
      context: 'Carbon monoxide burning — two gas volumes, an uneven ratio.' },
  },
];

// Quantity conversions — moles is always the internal source of truth.
function fromMoles(moles: number, unit: Unit, sp: Species): number {
  if (unit === 'g') return moles * sp.molarMass;
  if (unit === 'L') return moles * MOLAR_VOLUME_STP;
  return moles;
}
function toMoles(given: number, unit: Unit, sp: Species): number {
  if (unit === 'g') return given / sp.molarMass;
  if (unit === 'L') return given / MOLAR_VOLUME_STP;
  return given;
}

// ── Shared: the "who runs out first" bars ───────────────────────────────────
function BatchBars({ pairs }: { pairs: { sp: Species; moles: number; limiting: boolean }[] }) {
  const max = Math.max(...pairs.map(p => p.moles / p.sp.coef), 0.0001);
  return (
    <div className="flex flex-col gap-3">
      {pairs.map(({ sp, moles, limiting }) => {
        const batches = moles / sp.coef;
        return (
          <div key={sp.key} className="flex items-center gap-3">
            <span className="text-sm font-bold shrink-0" style={{ width: 44, color: limiting ? C_LIMIT_TXT : '#e2e8f0' }}>
              {sp.formula}
            </span>
            <div className="flex-1 rounded-full" style={{ height: 6, background: 'rgba(255,255,255,0.05)' }}>
              <div className="h-full rounded-full" style={{
                width: `${Math.min(100, (batches / max) * 100)}%`,
                background: limiting ? C_LIMIT_BAR : C_NEUTRAL,
                transition: 'width 0.35s ease, background 0.35s ease',
              }} />
            </div>
            <span className="flex items-center text-[13px] shrink-0 tabular-nums" style={{ color: '#94a3b8' }}>
              <Frac num={<>{fmt(moles)} mol</>} den={sp.coef} />
              <span className="mx-1">=</span>
              <b style={{ color: limiting ? C_LIMIT_TXT : '#e2e8f0' }}>{fmt(batches)}</b>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest shrink-0" style={{ width: 62, color: C_LIMIT_TXT }}>
              {limiting ? 'limiting' : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Root ────────────────────────────────────────────────────────────────────
export default function ReactionFactorySim() {
  const [mode, setMode] = useState<'explore' | 'predict'>('explore');

  return (
    <div className="p-4 md:p-6 not-prose" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16 }}>
      <div className="mb-6 flex justify-between items-start flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">The Reaction Factory</h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
            Whoever runs out first decides the yield
          </p>
        </div>
        {/* Underline tabs — workflow §4g */}
        <div className="flex gap-1">
          {([['explore', 'Explore', 'try any amounts'], ['predict', 'Predict', 'test yourself']] as const).map(([m, label, sublabel]) => (
            <button key={m} onClick={() => setMode(m)}
              className="px-3 py-2 text-center transition-all"
              style={{
                borderBottom: `2px solid ${mode === m ? C_ACCENT : 'rgba(255,255,255,0.06)'}`,
                opacity: mode === m ? 1 : 0.45, background: 'none', outline: 'none',
              }}>
              <div className="text-xs font-semibold" style={{ color: mode === m ? C_ACCENT : '#94a3b8' }}>{label}</div>
              <div className="text-[10px]" style={{ color: '#475569' }}>{sublabel}</div>
            </button>
          ))}
        </div>
      </div>

      {mode === 'explore' ? <ExploreMode /> : <PredictMode />}

      <div className="mt-7 pt-4" style={{ borderTop: HAIRLINE }}>
        <div className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert Tip</div>
        <p className="text-sm font-bold leading-snug italic text-white">
          &ldquo;Never compare raw grams, litres, or even moles directly. Convert everything to moles, then divide each by its
          coefficient — the <span style={{ color: C_LIMIT_TXT }}>smallest</span> answer is the limiting reagent, because it supports
          the fewest batches and runs out first.&rdquo;
        </p>
      </div>
    </div>
  );
}

// ── Explore (sandbox) ───────────────────────────────────────────────────────
function ExploreMode() {
  const [rx, setRx] = useState(0);
  const [molesA, setMolesA] = useState(4);
  const [molesB, setMolesB] = useState(3);
  const [unitA, setUnitA] = useState<Unit>('mol');
  const [unitB, setUnitB] = useState<Unit>('mol');

  const r = REACTIONS[rx];

  function pickReaction(i: number) {
    setRx(i); setMolesA(4); setMolesB(3); setUnitA('mol'); setUnitB('mol');
  }

  const batchesA = molesA / r.a.coef;
  const batchesB = molesB / r.b.coef;
  const extent = Math.min(batchesA, batchesB);
  const aLimits = batchesA < batchesB;
  const balanced = Math.abs(batchesA - batchesB) < 1e-9 && extent > 0;
  const productMoles = extent * r.product.coef;
  const leftA = molesA - extent * r.a.coef;
  const leftB = molesB - extent * r.b.coef;

  return (
    <div>
      {/* Reaction picker — plain underline text, no pills */}
      <div className="flex gap-4 flex-wrap mb-5">
        {REACTIONS.map((c, i) => (
          <button key={c.id} onClick={() => pickReaction(i)}
            className="text-xs font-bold transition-colors pb-0.5"
            style={{
              color: i === rx ? '#e2e8f0' : '#475569',
              borderBottom: `1px solid ${i === rx ? 'rgba(129,140,248,0.6)' : 'transparent'}`,
              background: 'none', outline: 'none',
            }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Equation */}
      <div className="text-center mb-6">
        <div className="text-3xl font-black text-white">{r.equation}</div>
      </div>

      {/* Two reactants, separated by a hairline — no cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <ReactantDial sp={r.a} moles={molesA} setMoles={setMolesA} unit={unitA} setUnit={setUnitA} />
        {/* Divider sits on top when stacked (mobile), on the left when side-by-side */}
        <div className="mt-6 pt-6 border-t sm:mt-0 sm:pt-0 sm:border-t-0 sm:pl-6 sm:border-l"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <ReactantDial sp={r.b} moles={molesB} setMoles={setMolesB} unit={unitB} setUnit={setUnitB} />
        </div>
      </div>

      {/* Verdict */}
      <div className="mt-7 pt-5" style={{ borderTop: HAIRLINE }}>
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-4 flex items-center" style={{ color: '#64748b' }}>
          Who runs out first
          <span className="ml-2 normal-case tracking-normal font-normal text-[12px] flex items-center" style={{ color: '#475569' }}>
            — compare <Frac num="moles" den="coefficient" />, smallest wins
          </span>
        </p>

        <BatchBars pairs={[
          { sp: r.a, moles: molesA, limiting: !balanced && aLimits && extent > 0 },
          { sp: r.b, moles: molesB, limiting: !balanced && !aLimits && extent > 0 },
        ]} />

        <p className="text-sm leading-relaxed mt-5" style={{ color: '#94a3b8' }}>
          {extent === 0 ? (
            <>One reactant is at zero, so nothing can react. Give both some amount.</>
          ) : balanced ? (
            <>
              <b style={{ color: C_OK }}>Perfectly balanced.</b> Both support the same {fmt(batchesA)} batches, so neither is
              limiting and nothing is left over — this is the exact stoichiometric ratio. The line makes{' '}
              <b style={{ color: C_ACCENT }}>{fmt(productMoles)} mol {r.product.formula}</b>.
            </>
          ) : (
            <>
              <b style={{ color: C_LIMIT_TXT }}>{aLimits ? r.a.formula : r.b.formula}</b> runs out first, so it caps the run at{' '}
              {fmt(extent)} batches — making <b style={{ color: C_ACCENT }}>{fmt(productMoles)} mol {r.product.formula}</b>{' '}
              and leaving <b className="text-white">{fmt(aLimits ? leftB : leftA)} mol {aLimits ? r.b.formula : r.a.formula}</b> unused.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

// One reactant column: formula, amount in the chosen unit, unit switch, slider.
function ReactantDial({ sp, moles, setMoles, unit, setUnit }: {
  sp: Species; moles: number; setMoles: (v: number) => void; unit: Unit; setUnit: (u: Unit) => void;
}) {
  const units: Unit[] = sp.gas ? ['g', 'mol', 'L'] : ['g', 'mol'];
  const shown = fromMoles(moles, unit, sp);

  return (
    <div className="flex flex-col">
      {/* Formula and amount share one size and weight — "H₂ = 4 mol" reads as a
          single statement rather than a label with a huge number under it. */}
      <div className="flex items-baseline justify-between flex-wrap gap-x-3 gap-y-1 mb-1.5">
        <div className="text-2xl font-bold text-white tabular-nums">
          {sp.formula} = {fmt(shown)}
          <span className="font-semibold ml-1.5" style={{ color: '#475569' }}>{unit}</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>
          coefficient {sp.coef}
        </span>
      </div>

      {/* Conversion line — the teaching moment when the unit isn't moles */}
      <div className="text-[12px] flex items-center flex-wrap mb-3" style={{ color: '#64748b', minHeight: 30 }}>
        {unit === 'mol' ? (
          <span>already in moles — ready to compare</span>
        ) : (
          <>
            {fmt(shown)} {unit} ×
            <Frac num="1 mol" den={unit === 'g' ? <>{sp.molarMass} g</> : '22.4 L'} />
            = <b className="ml-1" style={{ color: '#94a3b8' }}>{fmt(moles)} mol</b>
          </>
        )}
      </div>

      <input type="range" min={0} max={10} step={0.25} value={moles}
        onChange={(e) => setMoles(parseFloat(e.target.value))}
        className="w-full mb-3" style={{ accentColor: C_ACCENT }} />

      <div className="flex gap-3">
        {units.map((u) => (
          <button key={u} onClick={() => setUnit(u)}
            className="text-[11px] font-bold transition-colors pb-0.5"
            style={{
              color: unit === u ? '#e2e8f0' : '#475569',
              borderBottom: `1px solid ${unit === u ? 'rgba(129,140,248,0.6)' : 'transparent'}`,
              background: 'none', outline: 'none',
            }}>
            {u === 'g' ? 'mass (g)' : u === 'mol' ? 'moles' : 'volume (L)'}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Predict (challenges) ────────────────────────────────────────────────────
function PredictMode() {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [solved, setSolved] = useState<Set<string>>(new Set());

  const r = REACTIONS[idx];
  const molesA = toMoles(r.challenge.a.given, r.challenge.a.unit, r.a);
  const molesB = toMoles(r.challenge.b.given, r.challenge.b.unit, r.b);
  const batchesA = molesA / r.a.coef;
  const batchesB = molesB / r.b.coef;
  const extent = Math.min(batchesA, batchesB);
  const limitingKey = batchesA <= batchesB ? r.a.key : r.b.key;
  const aLimits = limitingKey === r.a.key;
  const revealed = answer !== null;
  const correct = answer === limitingKey;
  const productMoles = extent * r.product.coef;
  const leftOver = aLimits ? molesB - extent * r.b.coef : molesA - extent * r.a.coef;

  function pick(i: number) { setIdx(i); setAnswer(null); }
  function commit(key: string) {
    if (revealed) return;
    setAnswer(key);
    setSolved(prev => new Set(prev).add(r.id));
  }

  return (
    <div>
      {/* Challenge picker — plain text with a tick once solved, no pills */}
      <div className="flex gap-4 flex-wrap mb-5">
        {REACTIONS.map((c, i) => (
          <button key={c.id} onClick={() => pick(i)}
            className="text-xs font-bold transition-colors pb-0.5 flex items-center gap-1.5"
            style={{
              color: i === idx ? '#e2e8f0' : '#475569',
              borderBottom: `1px solid ${i === idx ? 'rgba(129,140,248,0.6)' : 'transparent'}`,
              background: 'none', outline: 'none',
            }}>
            {solved.has(c.id) && <span style={{ color: C_OK }}>✓</span>}
            {c.label}
          </button>
        ))}
      </div>

      <div className="text-center mb-2">
        <div className="text-3xl font-black text-white">{r.equation}</div>
      </div>
      <p className="text-sm text-center mb-6" style={{ color: '#94a3b8' }}>{r.challenge.context}</p>

      {/* Given quantities — flat, hairline-separated */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6" style={{ borderBottom: HAIRLINE }}>
        {[{ sp: r.a, g: r.challenge.a, moles: molesA }, { sp: r.b, g: r.challenge.b, moles: molesB }].map(({ sp, g, moles }) => (
          <div key={sp.key}>
            {/* Matches ExploreMode's ReactantDial — one size, one weight. */}
            <div className="flex items-baseline justify-between flex-wrap gap-x-3 gap-y-1 mb-1.5">
              <div className="text-2xl font-bold text-white tabular-nums">
                {sp.formula} = {fmt(g.given)}
                <span className="font-semibold ml-1.5" style={{ color: '#475569' }}>{g.unit}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>
                coefficient {sp.coef}
              </span>
            </div>
            <div className="text-[12px] flex items-center flex-wrap" style={{ color: '#64748b' }}>
              {g.unit === 'mol' ? (
                <span>already in moles</span>
              ) : (
                <>
                  ×<Frac num="1 mol" den={g.unit === 'g' ? <>{sp.molarMass} g</> : '22.4 L'} />
                  = <b className="ml-1" style={{ color: '#94a3b8' }}>{fmt(moles)} mol</b>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* The question */}
      <div className="pt-6">
        <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>
          Both are in moles now — <b className="text-white">{fmt(molesA)} mol {r.a.formula}</b> and{' '}
          <b className="text-white">{fmt(molesB)} mol {r.b.formula}</b>.{' '}
          <b className="text-white">Which one runs out first?</b>
        </p>

        <div className="flex gap-3 flex-wrap mb-6">
          {[r.a, r.b].map((sp) => {
            const isLim = sp.key === limitingKey;
            const chosen = answer === sp.key;
            let color = '#94a3b8', border = 'rgba(255,255,255,0.12)';
            if (revealed) {
              color = isLim ? C_LIMIT_TXT : '#64748b';
              border = isLim ? 'rgba(217,119,6,0.55)' : 'rgba(255,255,255,0.08)';
            } else if (chosen) {
              color = C_ACCENT; border = 'rgba(129,140,248,0.5)';
            }
            return (
              <button key={sp.key} onClick={() => commit(sp.key)} disabled={revealed}
                className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                style={{ border: `1px solid ${border}`, background: 'none', color, cursor: revealed ? 'default' : 'pointer' }}>
                {sp.formula}
                {revealed && (
                  <span className="ml-2 text-[10px] font-semibold uppercase tracking-widest">
                    {isLim ? 'limiting' : 'in excess'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div>
            <BatchBars pairs={[
              { sp: r.a, moles: molesA, limiting: aLimits },
              { sp: r.b, moles: molesB, limiting: !aLimits },
            ]} />

            <p className="text-sm leading-relaxed mt-5" style={{ color: '#94a3b8' }}>
              <b style={{ color: correct ? C_OK : C_LIMIT_TXT }}>
                {correct ? 'Correct. ' : 'Not quite. '}
              </b>
              <b style={{ color: C_LIMIT_TXT }}>{aLimits ? r.a.formula : r.b.formula}</b> supports only {fmt(extent)} batches,
              so it runs out first and stops the reaction — making{' '}
              <b style={{ color: C_ACCENT }}>{fmt(productMoles)} mol {r.product.formula}</b>{' '}
              (= {fmt(productMoles * r.product.molarMass)} g) and leaving{' '}
              <b className="text-white">{fmt(leftOver)} mol {aLimits ? r.b.formula : r.a.formula}</b> unused.
            </p>

            <div className="flex gap-4 mt-5">
              <button onClick={() => setAnswer(null)}
                className="text-xs font-bold pb-0.5"
                style={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.15)', background: 'none' }}>
                ↺ Try again
              </button>
              {idx < REACTIONS.length - 1 && (
                <button onClick={() => pick(idx + 1)}
                  className="text-xs font-bold pb-0.5"
                  style={{ color: C_ACCENT, borderBottom: '1px solid rgba(129,140,248,0.5)', background: 'none' }}>
                  Next: {REACTIONS[idx + 1].label} →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
