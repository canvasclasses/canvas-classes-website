'use client';

/**
 * The Reaction Factory — a limiting-reagent assembly line.
 *
 * Academic source: NCERT Class 11 Chemistry, Chapter 1 — Some Basic Concepts
 * of Chemistry (§1.10.2 Limiting Reagent). All four reactions and their
 * coefficients are standard balanced equations:
 *   2H2 + O2 -> 2H2O        (water synthesis)
 *   N2 + 3H2 -> 2NH3        (Haber process)
 *   C + O2 -> CO2           (combustion of carbon)
 *   2CO + O2 -> 2CO2        (combustion of carbon monoxide)
 *
 * PEDAGOGICAL GOAL — this replaces the old mole-only "limiting-reagent"
 * visualizer, which took moles as input and simply displayed the answer. The
 * two things students actually fail at are addressed head-on here:
 *
 *   1. UNIT CONVERSION. Real problems give mass / mole / gas-volume, never
 *      moles directly. Each reactant must pass a conversion "gate" (mass ÷
 *      molar mass, gas-volume ÷ 22.4, mole straight through) before it can
 *      reach the line — you physically cannot compare quantities until they
 *      are all in moles.
 *   2. "BIGGER ISN'T MORE." The reactant with more moles can still be
 *      limiting, because what matters is moles ÷ coefficient ("batches
 *      supported"). Students predict the limiting reagent, then watch the
 *      line drain each stockpile at coefficient-proportional rates and halt
 *      the instant one hits zero.
 *
 * Molarity / solution-volume conversion is intentionally excluded — the
 * Concentration of Solutions topic comes later in the chapter.
 *
 * NEEDS_REVIEW: none — standard NCERT reactions; molar masses use the book's
 * rounded convention (H2 = 2, N2 = 28, O2 = 32, C = 12, CO = 28) and the
 * 22.4 L/mol molar volume at STP used throughout this chapter.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ── Number formatting (no monospace; strip trailing zeros) ──────────────────
function fmt(v: number): string {
  if (!isFinite(v) || isNaN(v)) return '—';
  const r = Math.round(v * 1000) / 1000;
  return Number.isInteger(r) ? String(r) : String(r);
}

// ── Stacked fraction (workflow §2 — never render the ÷ glyph) ────────────────
function Frac({ num, den }: { num: React.ReactNode; den: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
      verticalAlign: 'middle', lineHeight: 1.15, margin: '0 3px',
    }}>
      <span style={{ padding: '0 6px 2px 6px' }}>{num}</span>
      <span style={{
        padding: '2px 6px 0 6px', borderTop: '1.5px solid currentColor',
        width: '100%', textAlign: 'center',
      }}>{den}</span>
    </span>
  );
}

// Rich formula with subscripts, e.g. sub('NH', 3) -> NH₃
function sub(base: string, ...subs: (string | number)[]): React.ReactNode {
  return <>{base}{subs.map((s, i) => <sub key={i}>{s}</sub>)}</>;
}

type Unit = 'g' | 'L' | 'mol';

interface Reactant {
  key: string;
  formula: React.ReactNode;
  coef: number;
  color: string;
  given: number;          // the quantity as presented
  unit: Unit;             // g, L (gas at STP), or mol
  molarMass?: number;     // required when unit === 'g'
}

interface ProductSpec {
  formula: React.ReactNode;
  coef: number;
  color: string;
  molarMass: number;
}

interface Challenge {
  id: string;
  label: string;
  context: string;
  equation: React.ReactNode;
  reactants: Reactant[];
  product: ProductSpec;
}

const MOLAR_VOLUME_STP = 22.4;

// Convert a reactant's given quantity to moles.
function toMoles(r: Reactant): number {
  if (r.unit === 'mol') return r.given;
  if (r.unit === 'g') return r.given / (r.molarMass ?? 1);
  return r.given / MOLAR_VOLUME_STP; // 'L' — gas at STP
}

// The conversion shown to the student for each unit.
function conversionLabel(r: Reactant): React.ReactNode {
  if (r.unit === 'mol') return <>Already in moles — no conversion needed.</>;
  if (r.unit === 'g') {
    return (
      <>
        {fmt(r.given)} g × <Frac num="1 mol" den={<>{r.molarMass} g</>} /> = <b>{fmt(toMoles(r))} mol</b>
      </>
    );
  }
  return (
    <>
      {fmt(r.given)} L × <Frac num="1 mol" den="22.4 L" /> = <b>{fmt(toMoles(r))} mol</b>
    </>
  );
}

// ── Challenges — spread across mole/mole, mass/mass, mass/volume, vol/vol ────
const CHALLENGES: Challenge[] = [
  {
    id: 'water',
    label: 'Water',
    context: 'Hydrogen burning in oxygen — the reaction inside a fuel cell.',
    equation: <>2{sub('H', 2)} + {sub('O', 2)} → 2{<>{sub('H', 2)}O</>}</>,
    reactants: [
      { key: 'h2', formula: sub('H', 2), coef: 2, color: '#34d399', given: 5, unit: 'mol' },
      { key: 'o2', formula: sub('O', 2), coef: 1, color: '#60a5fa', given: 3, unit: 'mol' },
    ],
    product: { formula: <>{sub('H', 2)}O</>, coef: 2, color: '#a78bfa', molarMass: 18 },
  },
  {
    id: 'haber',
    label: 'Ammonia',
    context: 'The Haber process — how the world makes fertiliser. Given as masses this time.',
    equation: <>{sub('N', 2)} + 3{sub('H', 2)} → 2{sub('NH', 3)}</>,
    reactants: [
      { key: 'n2', formula: sub('N', 2), coef: 1, color: '#60a5fa', given: 42, unit: 'g', molarMass: 28 },
      { key: 'h2', formula: sub('H', 2), coef: 3, color: '#34d399', given: 6, unit: 'g', molarMass: 2 },
    ],
    product: { formula: sub('NH', 3), coef: 2, color: '#a78bfa', molarMass: 17 },
  },
  {
    id: 'carbon',
    label: 'CO₂ from C',
    context: 'Burning carbon in oxygen — mass of solid meets volume of gas.',
    equation: <>C + {sub('O', 2)} → {sub('CO', 2)}</>,
    reactants: [
      { key: 'c', formula: <>C</>, coef: 1, color: '#fbbf24', given: 24, unit: 'g', molarMass: 12 },
      { key: 'o2', formula: sub('O', 2), coef: 1, color: '#60a5fa', given: 22.4, unit: 'L' },
    ],
    product: { formula: sub('CO', 2), coef: 1, color: '#a78bfa', molarMass: 44 },
  },
  {
    id: 'co',
    label: 'CO₂ from CO',
    context: 'Carbon monoxide burning — two gas volumes, an uneven ratio.',
    equation: <>2CO + {sub('O', 2)} → 2{sub('CO', 2)}</>,
    reactants: [
      { key: 'co', formula: <>CO</>, coef: 2, color: '#22d3ee', given: 44.8, unit: 'L' },
      { key: 'o2', formula: sub('O', 2), coef: 1, color: '#60a5fa', given: 33.6, unit: 'L' },
    ],
    product: { formula: sub('CO', 2), coef: 2, color: '#a78bfa', molarMass: 44 },
  },
];

type Stage = 'load' | 'predict' | 'result';
type Mode = 'challenge' | 'freeplay';

// ── Main component ──────────────────────────────────────────────────────────
export default function ReactionFactorySim() {
  const [mode, setMode] = useState<Mode>('challenge');

  return (
    <div className="p-4 md:p-6 not-prose" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, minHeight: '60vh' }}>
      {/* Header */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            The Reaction <span style={{ color: '#7c3aed' }}>Factory</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
            Convert to moles · find who runs out first
          </p>
        </div>
        {/* Mode toggle (underline tabs, §4g) */}
        <div className="flex gap-1">
          {(['challenge', 'freeplay'] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className="px-3 py-2 text-center transition-all"
              style={{
                borderBottom: `2px solid ${mode === m ? '#818cf8' : 'rgba(255,255,255,0.06)'}`,
                opacity: mode === m ? 1 : 0.5, background: 'none', outline: 'none',
              }}>
              <div className="text-xs font-black" style={{ color: '#818cf8' }}>
                {m === 'challenge' ? 'Challenges' : 'Perfect Batch'}
              </div>
              <div className="text-[10px]" style={{ color: '#475569' }}>
                {m === 'challenge' ? 'guided' : 'sandbox'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {mode === 'challenge' ? <ChallengeMode /> : <FreePlayMode />}

      {/* Expert Tip */}
      <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert Tip</div>
        <p className="text-sm font-bold leading-snug italic text-white">
          &ldquo;Never compare raw grams, litres, or even moles directly. Convert everything to moles, then divide each by its
          coefficient — the <span style={{ color: '#f87171' }}>smallest</span> answer is the limiting reagent, because it supports the
          fewest batches of the reaction and runs out first.&rdquo;
        </p>
      </div>
    </div>
  );
}

// ── Challenge mode ──────────────────────────────────────────────────────────
function ChallengeMode() {
  const [idx, setIdx] = useState(0);
  const [stage, setStage] = useState<Stage>('load');
  const [converted, setConverted] = useState<Record<string, boolean>>({});
  const [prediction, setPrediction] = useState<string | null>(null);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0); // 0→1 assembly-line animation
  const rafRef = useRef<number | null>(null);

  const ch = CHALLENGES[idx];
  const moles = Object.fromEntries(ch.reactants.map((r) => [r.key, toMoles(r)]));
  const batches = Object.fromEntries(ch.reactants.map((r) => [r.key, moles[r.key] / r.coef]));
  const extent = Math.min(...ch.reactants.map((r) => batches[r.key]));
  const limitingKey = ch.reactants.reduce((a, b) => (batches[a.key] <= batches[b.key] ? a : b)).key;
  const allConverted = ch.reactants.every((r) => converted[r.key] || r.unit === 'mol');
  const productMoles = extent * ch.product.coef;

  const reset = useCallback((keepIdx: number) => {
    setStage('load'); setConverted({}); setPrediction(null); setProgress(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  function goChallenge(i: number) { setIdx(i); reset(i); }

  // Animate the line when entering the result stage.
  useEffect(() => {
    if (stage !== 'result') return;
    const DURATION = 1700;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / DURATION);
      setProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [stage, idx]);

  function commitPrediction() {
    if (!prediction) return;
    setStage('result');
    setSolved((prev) => new Set(prev).add(ch.id));
  }

  const predictionRight = prediction === limitingKey;

  return (
    <div>
      {/* Challenge selector */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {CHALLENGES.map((c, i) => {
          const active = i === idx; const done = solved.has(c.id);
          return (
            <button key={c.id} onClick={() => goChallenge(i)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all"
              style={{
                background: active ? 'rgba(129,140,248,0.15)' : done ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : done ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.07)'}`,
                color: active ? '#c4b5fd' : done ? '#6ee7b7' : 'rgba(255,255,255,0.35)',
              }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                style={{ background: active ? '#6366f1' : done ? '#059669' : 'rgba(255,255,255,0.06)', color: 'white' }}>
                {done ? '✓' : i + 1}
              </span>
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Blueprint / equation */}
      <div className="mb-5">
        <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#fbbf24' }}>The Blueprint</p>
        <div className="text-2xl font-black text-white mb-1.5 tabular-nums">{ch.equation}</div>
        <p className="text-sm" style={{ color: '#94a3b8' }}>{ch.context}</p>
      </div>

      {/* ── STAGE: LOAD ── */}
      <div className="rounded-2xl p-5 mb-4" style={{ background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#818cf8' }}>
          Loading Dock — convert every reactant to moles first
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ch.reactants.map((r) => {
            // Moles need no conversion, so they count as "done" from the start.
            const isConv = !!converted[r.key] || r.unit === 'mol';
            return (
              <div key={r.key} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${isConv ? `${r.color}55` : 'rgba(255,255,255,0.08)'}` }}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-lg font-black" style={{ color: r.color }}>{r.formula}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>
                    {r.unit === 'mol' ? 'given in moles' : r.unit === 'g' ? 'given by mass' : 'given by gas volume'}
                  </span>
                </div>
                <div className="text-lg font-black tabular-nums text-white mb-2">
                  {fmt(r.given)} {r.unit}
                </div>
                {!isConv ? (
                  <button onClick={() => setConverted((p) => ({ ...p, [r.key]: true }))}
                    disabled={stage !== 'load'}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: `${r.color}18`, border: `1px solid ${r.color}55`, color: r.color, opacity: stage !== 'load' ? 0.4 : 1 }}>
                    → Convert to moles
                  </button>
                ) : (
                  <div className="text-[13px] flex items-center flex-wrap" style={{ color: '#cbd5e1' }}>
                    {conversionLabel(r)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {stage === 'load' && (
          <div className="flex justify-end mt-4">
            <button onClick={() => setStage('predict')} disabled={!allConverted}
              className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                background: allConverted ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${allConverted ? 'rgba(129,140,248,0.4)' : 'rgba(255,255,255,0.06)'}`,
                color: allConverted ? '#c4b5fd' : 'rgba(255,255,255,0.2)',
                cursor: allConverted ? 'pointer' : 'not-allowed',
              }}>
              Reactants loaded → Predict
            </button>
          </div>
        )}
      </div>

      {/* ── STAGE: PREDICT ── */}
      {(stage === 'predict' || stage === 'result') && (
        <div className="mb-4">
          <p className="text-sm mb-3" style={{ color: '#94a3b8' }}>
            All in moles now: {ch.reactants.map((r, i) => (
              <span key={r.key}>
                <b style={{ color: r.color }}>{fmt(moles[r.key])} mol {r.formula}</b>{i < ch.reactants.length - 1 ? ' and ' : ''}
              </span>
            ))}. <b className="text-white">Which one runs out first (the limiting reagent)?</b>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ch.reactants.map((r) => {
              const chosen = prediction === r.key;
              const locked = stage === 'result';
              const isLimiting = r.key === limitingKey;
              let border = chosen ? r.color : 'rgba(255,255,255,0.09)';
              let bg = chosen ? `${r.color}14` : 'rgba(255,255,255,0.03)';
              if (locked) {
                border = isLimiting ? 'rgba(239,68,68,0.5)' : 'rgba(52,211,153,0.35)';
                bg = isLimiting ? 'rgba(69,10,10,0.5)' : 'rgba(6,78,59,0.35)';
              }
              return (
                <button key={r.key} onClick={() => stage === 'predict' && setPrediction(r.key)} disabled={locked}
                  className="text-left px-4 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ border: `1px solid ${border}`, background: bg, color: '#e2e8f0' }}>
                  {r.formula}
                  {locked && (
                    <span className="ml-2 text-xs font-black uppercase tracking-widest" style={{ color: isLimiting ? '#f87171' : '#6ee7b7' }}>
                      {isLimiting ? 'limiting' : 'in excess'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {stage === 'predict' && (
            <div className="flex justify-end mt-4">
              <button onClick={commitPrediction} disabled={!prediction}
                className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
                style={{
                  background: prediction ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${prediction ? 'rgba(129,140,248,0.4)' : 'rgba(255,255,255,0.06)'}`,
                  color: prediction ? '#c4b5fd' : 'rgba(255,255,255,0.2)',
                  cursor: prediction ? 'pointer' : 'not-allowed',
                }}>
                Run the line →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── STAGE: RESULT ── */}
      {stage === 'result' && (
        <div>
          {/* Batches meter — the identification method */}
          <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#fbbf24' }}>
              Batches each reactant can support = moles ÷ coefficient
            </p>
            <div className="flex flex-col gap-2">
              {ch.reactants.map((r) => {
                const isLim = r.key === limitingKey;
                return (
                  <div key={r.key} className="flex items-center gap-3 text-sm" style={{ color: '#cbd5e1' }}>
                    <span className="font-black w-12" style={{ color: r.color }}>{r.formula}</span>
                    <span className="flex items-center">
                      <Frac num={<>{fmt(moles[r.key])} mol</>} den={<>{r.coef}</>} /> = <b className="tabular-nums ml-1" style={{ color: isLim ? '#f87171' : '#e2e8f0' }}>{fmt(batches[r.key])} batches</b>
                    </span>
                    {isLim && <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#f87171' }}>← fewest = limiting</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assembly line — stockpiles drain, product fills */}
          <div className="rounded-2xl p-5 mb-4" style={{ background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div className="flex items-end justify-center gap-6 flex-wrap">
              {ch.reactants.map((r) => {
                const initial = moles[r.key];
                const remaining = initial - progress * extent * r.coef;
                const maxMol = Math.max(...ch.reactants.map((x) => moles[x.key]), productMoles);
                const h = maxMol > 0 ? (remaining / maxMol) * 140 : 0;
                return (
                  <div key={r.key} className="flex flex-col items-center gap-1.5" style={{ width: 76 }}>
                    <span className="text-xs font-black tabular-nums" style={{ color: r.color }}>{fmt(Math.max(0, remaining))}</span>
                    <div className="w-9 rounded-t-md relative flex items-end" style={{ height: 140, background: 'rgba(255,255,255,0.04)' }}>
                      <div className="w-full rounded-t-md" style={{ height: Math.max(0, h), background: r.color, transition: 'none' }} />
                    </div>
                    <span className="text-[11px] font-bold" style={{ color: '#94a3b8' }}>{r.formula}</span>
                    <span className="text-[9px] uppercase tracking-widest" style={{ color: '#475569' }}>mol left</span>
                  </div>
                );
              })}

              {/* Arrow */}
              <div className="flex flex-col items-center justify-center pb-8">
                <span style={{ fontSize: 26, color: 'rgba(255,255,255,0.3)' }}>→</span>
              </div>

              {/* Product */}
              {(() => {
                const made = progress * productMoles;
                const maxMol = Math.max(...ch.reactants.map((x) => moles[x.key]), productMoles);
                const h = maxMol > 0 ? (made / maxMol) * 140 : 0;
                return (
                  <div className="flex flex-col items-center gap-1.5" style={{ width: 76 }}>
                    <span className="text-xs font-black tabular-nums" style={{ color: ch.product.color }}>{fmt(made)}</span>
                    <div className="w-9 rounded-t-md relative flex items-end" style={{ height: 140, background: 'rgba(255,255,255,0.04)' }}>
                      <div className="w-full rounded-t-md" style={{ height: Math.max(0, h), background: ch.product.color }} />
                    </div>
                    <span className="text-[11px] font-bold" style={{ color: '#94a3b8' }}>{ch.product.formula}</span>
                    <span className="text-[9px] uppercase tracking-widest" style={{ color: '#475569' }}>made</span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Result summary */}
          <div className="rounded-xl px-4 py-4" style={{ background: predictionRight ? 'rgba(6,78,59,0.35)' : 'rgba(69,10,10,0.4)', border: `1px solid ${predictionRight ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: predictionRight ? '#34d399' : '#f87171' }}>
              {predictionRight ? '✓ Correct — the line halted here' : '✗ Not quite — watch what actually ran out'}
            </p>
            <div className="text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>
              {(() => {
                const lim = ch.reactants.find((r) => r.key === limitingKey)!;
                const exc = ch.reactants.find((r) => r.key !== limitingKey)!;
                const excLeft = moles[exc.key] - extent * exc.coef;
                return (
                  <>
                    <b style={{ color: lim.color }}>{lim.formula}</b> is the limiting reagent — it hit zero first, stopping the reaction.
                    The line made <b style={{ color: ch.product.color }}>{fmt(productMoles)} mol of {ch.product.formula}</b>
                    {' '}(= {fmt(productMoles * ch.product.molarMass)} g), and left <b style={{ color: exc.color }}>{fmt(excLeft)} mol of {exc.formula}</b> unused as excess.
                  </>
                );
              })()}
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <button onClick={() => reset(idx)} className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(129,140,248,0.3)', color: '#a5b4fc' }}>
                ↺ Run it again
              </button>
              {idx < CHALLENGES.length - 1 && (
                <button onClick={() => goChallenge(idx + 1)} className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
                  style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(129,140,248,0.4)', color: '#c4b5fd' }}>
                  Next challenge: {CHALLENGES[idx + 1].label} →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Free Play (Perfect Batch) sandbox ───────────────────────────────────────
// Pure ratio insight, in moles only (no unit gates) — chase zero waste.
function FreePlayMode() {
  const [h2, setH2] = useState(4);
  const [o2, setO2] = useState(3);
  // 2 H2 + O2 -> 2 H2O
  const bH2 = h2 / 2, bO2 = o2 / 1;
  const extent = Math.min(bH2, bO2);
  const product = extent * 2;
  const leftH2 = h2 - extent * 2;
  const leftO2 = o2 - extent * 1;
  const waste = leftH2 + leftO2;
  const perfect = Math.abs(waste) < 1e-9 && extent > 0;

  const Slider = ({ label, value, set, color }: { label: React.ReactNode; value: number; set: (v: number) => void; color: string }) => (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-black" style={{ color }}>{label}</span>
        <span className="text-sm font-black tabular-nums text-white">{fmt(value)} mol</span>
      </div>
      <input type="range" min={0} max={10} step={0.5} value={value}
        onChange={(e) => set(parseFloat(e.target.value))} className="w-full" style={{ accentColor: color }} />
    </div>
  );

  return (
    <div>
      <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>
        Reaction: <b className="text-white">2{sub('H', 2)} + {sub('O', 2)} → 2{<>{sub('H', 2)}O</>}</b>. Set the moles of each reactant and
        try to make the factory <b style={{ color: '#fbbf24' }}>waste nothing</b> — no limiting reagent, no leftovers.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <Slider label={sub('H', 2)} value={h2} set={setH2} color="#34d399" />
        <Slider label={sub('O', 2)} value={o2} set={setO2} color="#60a5fa" />
      </div>

      <div className="rounded-xl p-4 mb-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm" style={{ color: '#cbd5e1' }}>
          <span>Batches: <b style={{ color: '#34d399' }}>{fmt(bH2)}</b> ({sub('H', 2)}) vs <b style={{ color: '#60a5fa' }}>{fmt(bO2)}</b> ({sub('O', 2)})</span>
          <span>Product: <b style={{ color: '#a78bfa' }}>{fmt(product)} mol {<>{sub('H', 2)}O</>}</b></span>
          <span>Leftover: <b className="tabular-nums" style={{ color: waste < 1e-9 ? '#6ee7b7' : '#f87171' }}>{fmt(waste)} mol</b></span>
        </div>
      </div>

      <div className="rounded-xl px-4 py-3 text-sm leading-relaxed" style={{
        background: perfect ? 'rgba(6,78,59,0.4)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${perfect ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.07)'}`,
        color: perfect ? '#6ee7b7' : '#94a3b8',
      }}>
        {perfect ? (
          <><b>Perfect batch.</b> Both reactants support the same number of batches ({fmt(bH2)}), so neither is limiting and nothing is left over — this is the exact stoichiometric ratio, {sub('H', 2)} : {sub('O', 2)} = 2 : 1.</>
        ) : extent === 0 ? (
          <>One reactant is at zero — no reaction can run. Give both some moles.</>
        ) : (
          <><b style={{ color: bH2 < bO2 ? '#34d399' : '#60a5fa' }}>{bH2 < bO2 ? sub('H', 2) : sub('O', 2)}</b> is limiting (fewer batches), so {fmt(waste)} mol of the other reactant is wasted. Nudge the sliders until both batch counts match to hit zero waste.</>
        )}
      </div>
    </div>
  );
}
