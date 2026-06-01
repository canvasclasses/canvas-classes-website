'use client';

/**
 * Limiting Reagent Visualizer
 *
 * Academic source: NCERT Class 11 Chemistry, Chapter 1 — Some Basic Concepts
 * of Chemistry (§1.10.2 Limiting Reagent). The "which reactant runs out
 * first" question is the central technique tested in every JEE/NEET
 * stoichiometry problem.
 *
 * Pedagogical goal: let students set arbitrary moles of two reactants A and
 * B for a balanced reaction "aA + bB → cC + dD", watch the system compute
 * which reactant is limiting via the "moles-over-coefficient" rule, then see
 * the products formed AND the excess reactant remaining. The visualisation
 * uses a side-by-side particle column for each species so the proportions
 * are immediately visible.
 */

import { useState, useMemo } from 'react';

// ── Reaction catalogue ────────────────────────────────────────────────────
//
// Six classic NCERT/JEE reactions covering different stoichiometric ratios.
// Each species has a colour from the workflow palette (Section 3 — only
// indigo/emerald/amber/red/violet/cyan permitted).

interface Species {
  formula: string;
  formulaDisplay: React.ReactNode;
  coef: number;
  color: string;
}

interface Reaction {
  id: string;
  label: string;
  context: string;
  reactants: [Species, Species];
  products:  Species[];
}

// Helper for rich formulas
function f(parts: (string | number | { sub: string | number })[]) {
  return (
    <>
      {parts.map((p, i) => {
        if (typeof p === 'string' || typeof p === 'number') return <span key={i}>{p}</span>;
        if ('sub' in p) return <sub key={i}>{p.sub}</sub>;
        return null;
      })}
    </>
  );
}

const REACTIONS: Reaction[] = [
  {
    id: 'haber',
    label: 'Haber process',
    context: 'Industrial ammonia synthesis — the workhorse of modern fertiliser manufacturing.',
    reactants: [
      { formula: 'N₂', formulaDisplay: f(['N', {sub: 2}]),   coef: 1, color: '#60a5fa' },
      { formula: 'H₂', formulaDisplay: f(['H', {sub: 2}]),   coef: 3, color: '#34d399' },
    ],
    products: [
      { formula: 'NH₃', formulaDisplay: f(['NH', {sub: 3}]), coef: 2, color: '#a78bfa' },
    ],
  },
  {
    id: 'water',
    label: 'Water synthesis',
    context: 'Hydrogen + oxygen combustion — the classic 2:1 ratio that catches students out.',
    reactants: [
      { formula: 'H₂', formulaDisplay: f(['H', {sub: 2}]),   coef: 2, color: '#34d399' },
      { formula: 'O₂', formulaDisplay: f(['O', {sub: 2}]),   coef: 1, color: '#fbbf24' },
    ],
    products: [
      { formula: 'H₂O', formulaDisplay: f(['H', {sub: 2}, 'O']), coef: 2, color: '#22d3ee' },
    ],
  },
  {
    id: 'methane',
    label: 'Methane combustion',
    context: 'Burning natural gas — needs twice as much O₂ as CH₄.',
    reactants: [
      { formula: 'CH₄', formulaDisplay: f(['CH', {sub: 4}]), coef: 1, color: '#34d399' },
      { formula: 'O₂',  formulaDisplay: f(['O', {sub: 2}]),  coef: 2, color: '#fbbf24' },
    ],
    products: [
      { formula: 'CO₂', formulaDisplay: f(['CO', {sub: 2}]), coef: 1, color: '#a78bfa' },
      { formula: 'H₂O', formulaDisplay: f(['H', {sub: 2}, 'O']), coef: 2, color: '#22d3ee' },
    ],
  },
  {
    id: 'thermite',
    label: 'Thermite reaction',
    context: 'Iron oxide + aluminium — the welding reaction that releases enough heat to melt iron.',
    reactants: [
      { formula: 'Fe₂O₃', formulaDisplay: f(['Fe', {sub: 2}, 'O', {sub: 3}]), coef: 1, color: '#f87171' },
      { formula: 'Al',    formulaDisplay: f(['Al']),                          coef: 2, color: '#a3a3a3' },
    ],
    products: [
      { formula: 'Al₂O₃', formulaDisplay: f(['Al', {sub: 2}, 'O', {sub: 3}]), coef: 1, color: '#fbbf24' },
      { formula: 'Fe',    formulaDisplay: f(['Fe']),                          coef: 2, color: '#94a3b8' },
    ],
  },
  {
    id: 'agno3',
    label: 'Silver chloride precipitation',
    context: 'AgNO₃ + NaCl → AgCl↓ + NaNO₃ — a 1:1 reaction; perfect for first practice.',
    reactants: [
      { formula: 'AgNO₃', formulaDisplay: f(['AgNO', {sub: 3}]),       coef: 1, color: '#94a3b8' },
      { formula: 'NaCl',  formulaDisplay: f(['NaCl']),                 coef: 1, color: '#34d399' },
    ],
    products: [
      { formula: 'AgCl',  formulaDisplay: f(['AgCl']),                 coef: 1, color: '#e2e8f0' },
      { formula: 'NaNO₃', formulaDisplay: f(['NaNO', {sub: 3}]),       coef: 1, color: '#a78bfa' },
    ],
  },
  {
    id: 'propane',
    label: 'Propane combustion',
    context: 'LPG combustion — needs 5 mol O₂ per mol propane.',
    reactants: [
      { formula: 'C₃H₈', formulaDisplay: f(['C', {sub: 3}, 'H', {sub: 8}]), coef: 1, color: '#34d399' },
      { formula: 'O₂',   formulaDisplay: f(['O', {sub: 2}]),                coef: 5, color: '#fbbf24' },
    ],
    products: [
      { formula: 'CO₂',  formulaDisplay: f(['CO', {sub: 2}]),               coef: 3, color: '#a78bfa' },
      { formula: 'H₂O',  formulaDisplay: f(['H', {sub: 2}, 'O']),           coef: 4, color: '#22d3ee' },
    ],
  },
];

// ── Computation ───────────────────────────────────────────────────────────

interface SolveResult {
  limitingIdx: 0 | 1;          // which reactant is limiting (always defined when both > 0)
  excessIdx: 0 | 1;
  reactionExtent: number;      // ξ (xi) — moles of "reaction units" that can proceed
  consumed: [number, number];  // moles of A, B actually consumed
  excessRemaining: number;     // moles of the excess reactant left over
  productsFormed: number[];    // moles of each product (parallel to reaction.products)
  ratioA: number;              // molesA / coefA
  ratioB: number;              // molesB / coefB
}

function solve(rxn: Reaction, molesA: number, molesB: number): SolveResult | null {
  if (molesA <= 0 || molesB <= 0) return null;
  const [A, B] = rxn.reactants;

  // The "moles-over-coefficient" rule — whichever ratio is smaller IS the
  // limiting reagent, and that ratio = extent of reaction ξ.
  const ratioA = molesA / A.coef;
  const ratioB = molesB / B.coef;
  const limitingIdx: 0 | 1 = ratioA <= ratioB ? 0 : 1;
  const excessIdx:   0 | 1 = limitingIdx === 0 ? 1 : 0;
  const xi = Math.min(ratioA, ratioB);

  const consumed: [number, number] = [A.coef * xi, B.coef * xi];
  const excessRemaining = (excessIdx === 0 ? molesA : molesB) - consumed[excessIdx];
  const productsFormed = rxn.products.map((p) => p.coef * xi);

  return { limitingIdx, excessIdx, reactionExtent: xi, consumed, excessRemaining, productsFormed, ratioA, ratioB };
}

// ── Visual: stacked particle column ───────────────────────────────────────
// Shows `nVisible` filled circles out of `nMax` to convey "how much is here".
// We cap at 24 visible circles to keep the canvas tidy and avoid CPU on huge inputs.

function ParticleColumn({ count, max, color, faded = false }:
                        { count: number; max: number; color: string; faded?: boolean }) {
  const VISIBLE_CAP = 24;
  const filled = Math.min(VISIBLE_CAP, Math.round((count / max) * VISIBLE_CAP));
  return (
    <div className="flex flex-col-reverse gap-1 items-center justify-end" style={{ minHeight: 168 }}>
      {Array.from({ length: VISIBLE_CAP }).map((_, i) => {
        const isFilled = i < filled;
        return (
          <div key={i}
            style={{
              width: 14, height: 14, borderRadius: '50%',
              background: isFilled ? color : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isFilled ? color : 'rgba(255,255,255,0.08)'}`,
              opacity: isFilled ? (faded ? 0.35 : 0.85) : 0.5,
              transition: 'all 0.3s',
              boxShadow: isFilled && !faded ? `0 0 6px ${color}66` : 'none',
            }} />
        );
      })}
    </div>
  );
}

// ── Slider input ──────────────────────────────────────────────────────────
function MoleSlider({ label, value, color, onChange, max }:
                    { label: string; value: number; color: string; onChange: (v: number) => void; max: number }) {
  return (
    <div className="flex items-center gap-3">
      <div style={{ minWidth: 70, fontSize: 13, fontWeight: 700, color }}>{label}</div>
      <input type="range" min={0} max={max} step={0.1} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1" style={{ accentColor: color }} />
      <div style={{ minWidth: 56, textAlign: 'right', fontSize: 14, fontWeight: 800,
        fontVariantNumeric: 'tabular-nums', color }}>
        {value.toFixed(1)} mol
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export default function LimitingReagentSim() {
  const [rxnId, setRxnId] = useState<string>('water');
  const reaction = useMemo(() => REACTIONS.find(r => r.id === rxnId) ?? REACTIONS[0], [rxnId]);
  const [A, B] = reaction.reactants;
  const [molesA, setMolesA] = useState<number>(A.coef * 2);
  const [molesB, setMolesB] = useState<number>(B.coef * 1.3);

  const result = solve(reaction, molesA, molesB);
  const colMax = Math.max(molesA, molesB, ...(result?.productsFormed ?? []), 1);

  function selectReaction(id: string) {
    const r = REACTIONS.find(rx => rx.id === id);
    if (!r) return;
    setRxnId(id);
    // Set reactants at "almost stoichiometric" defaults so the sim has something interesting to show
    setMolesA(r.reactants[0].coef * 2);
    setMolesB(r.reactants[1].coef * 1.3);
  }

  // Pretty-print the balanced equation: "a A  +  b B  →  c C  +  d D"
  function CoefSpan({ coef }: { coef: number }) {
    if (coef === 1) return null;
    return <span style={{ color: '#94a3b8', fontWeight: 700, marginRight: 2 }}>{coef}</span>;
  }

  return (
    <div className="p-4 md:p-6 not-prose"
      style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16,
               minHeight: '60vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Limiting Reagent <span style={{ color: '#7c3aed' }}>Visualiser</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5"
            style={{ color: '#475569' }}>
            Which reactant runs out first? · NCERT Class 11 Ch. 1
          </p>
        </div>
        {result && (
          <div className="text-[10px] font-black uppercase tracking-widest pt-1 px-2 py-1 rounded-full"
            style={{
              background: `${reaction.reactants[result.limitingIdx].color}18`,
              border: `1px solid ${reaction.reactants[result.limitingIdx].color}45`,
              color: reaction.reactants[result.limitingIdx].color,
            }}>
            Limiting → {reaction.reactants[result.limitingIdx].formula}
          </div>
        )}
      </div>

      {/* ── Reaction selector pills ────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-5">
        {REACTIONS.map(r => {
          const active = r.id === rxnId;
          return (
            <button key={r.id} onClick={() => selectReaction(r.id)}
              className="px-3 py-1.5 rounded-full text-[13px] font-bold transition-all"
              style={{
                background: active ? 'rgba(124,58,237,0.18)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? 'rgba(124,58,237,0.45)' : 'rgba(255,255,255,0.08)'}`,
                color: active ? '#c4b5fd' : '#94a3b8',
                fontFamily: 'system-ui',
              }}>
              {r.label}
            </button>
          );
        })}
      </div>

      {/* Reaction equation + context */}
      <div className="rounded-xl px-4 py-3 mb-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2 flex-wrap text-lg font-bold text-white" style={{ fontFamily: 'system-ui' }}>
          {reaction.reactants.map((s, i) => (
            <span key={'r' + i} className="flex items-center gap-1">
              {i > 0 && <span style={{ color: '#475569' }}>+</span>}
              <span><CoefSpan coef={s.coef} /><span style={{ color: s.color }}>{s.formulaDisplay}</span></span>
            </span>
          ))}
          <span style={{ color: '#7c3aed', fontWeight: 800, padding: '0 6px' }}>→</span>
          {reaction.products.map((s, i) => (
            <span key={'p' + i} className="flex items-center gap-1">
              {i > 0 && <span style={{ color: '#475569' }}>+</span>}
              <span><CoefSpan coef={s.coef} /><span style={{ color: s.color }}>{s.formulaDisplay}</span></span>
            </span>
          ))}
        </div>
        <p className="text-[12px] mt-1.5" style={{ color: '#94a3b8' }}>{reaction.context}</p>
      </div>

      {/* ── Mole sliders ───────────────────────────────────────────────── */}
      <div className="rounded-xl p-4 mb-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#94a3b8' }}>
          You have these reactants
        </div>
        <div className="flex flex-col gap-3">
          <MoleSlider label={A.formula} value={molesA} color={A.color} onChange={setMolesA} max={10} />
          <MoleSlider label={B.formula} value={molesB} color={B.color} onChange={setMolesB} max={10} />
        </div>
      </div>

      {/* ── Main 3-column visualisation: Before | Reaction | After ──── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

        {/* Before */}
        <div className="rounded-2xl p-4 flex flex-col"
          style={{ background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
                   border: '1px solid rgba(99,102,241,0.2)', minHeight: 320 }}>
          <div className="text-[10px] font-black uppercase tracking-widest mb-3 text-center"
            style={{ color: '#94a3b8' }}>Before</div>
          <div className="grid grid-cols-2 gap-2 flex-1">
            {[A, B].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.formulaDisplay}</div>
                <div className="text-[10px]" style={{ color: '#94a3b8' }}>
                  {(i === 0 ? molesA : molesB).toFixed(1)} mol
                </div>
                <ParticleColumn count={i === 0 ? molesA : molesB} max={colMax} color={s.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Reaction (consumed amounts) */}
        <div className="rounded-2xl p-4 flex flex-col"
          style={{ background: 'radial-gradient(circle at center,#2a1a4a 0%,#050614 100%)',
                   border: '1px solid rgba(124,58,237,0.30)', minHeight: 320 }}>
          <div className="text-[10px] font-black uppercase tracking-widest mb-3 text-center"
            style={{ color: '#c4b5fd' }}>Reacted (consumed)</div>
          {!result ? (
            <div className="flex-1 flex items-center justify-center text-center text-[11px]" style={{ color: '#64748b' }}>
              Add some of both reactants to see the reaction proceed.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 flex-1">
              {[A, B].map((s, i) => {
                const isLimiting = i === result.limitingIdx;
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.formulaDisplay}</div>
                      {isLimiting && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider"
                          style={{ background: `${s.color}25`, color: s.color,
                                   border: `1px solid ${s.color}55` }}>LR</span>
                      )}
                    </div>
                    <div className="text-[10px]" style={{ color: '#94a3b8' }}>
                      −{result.consumed[i].toFixed(2)} mol
                    </div>
                    <ParticleColumn count={result.consumed[i]} max={colMax} color={s.color} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* After (products + excess) */}
        <div className="rounded-2xl p-4 flex flex-col"
          style={{ background: 'radial-gradient(circle at center,#1a3a2e 0%,#050614 100%)',
                   border: '1px solid rgba(52,211,153,0.30)', minHeight: 320 }}>
          <div className="text-[10px] font-black uppercase tracking-widest mb-3 text-center"
            style={{ color: '#6ee7b7' }}>After (products + excess)</div>
          {!result ? (
            <div className="flex-1 flex items-center justify-center text-[11px]" style={{ color: '#64748b' }}>—</div>
          ) : (
            <div className="grid grid-cols-2 gap-2 flex-1">
              {reaction.products.map((s, i) => (
                <div key={'p' + i} className="flex flex-col items-center gap-2">
                  <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.formulaDisplay}</div>
                  <div className="text-[10px]" style={{ color: '#94a3b8' }}>
                    +{result.productsFormed[i].toFixed(2)} mol
                  </div>
                  <ParticleColumn count={result.productsFormed[i]} max={colMax} color={s.color} />
                </div>
              ))}
              {/* Excess reactant column */}
              <div className="flex flex-col items-center gap-2"
                style={{ gridColumn: reaction.products.length === 1 ? 'span 1' : 'auto' }}>
                <div className="flex items-center gap-1">
                  <div style={{ fontSize: 16, fontWeight: 800, color: reaction.reactants[result.excessIdx].color }}>
                    {reaction.reactants[result.excessIdx].formulaDisplay}
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider"
                    style={{ background: 'rgba(251,191,36,0.18)', color: '#fbbf24',
                             border: '1px solid rgba(251,191,36,0.45)' }}>excess</span>
                </div>
                <div className="text-[10px]" style={{ color: '#94a3b8' }}>
                  {result.excessRemaining.toFixed(2)} mol left
                </div>
                <ParticleColumn count={result.excessRemaining}
                  max={colMax} color={reaction.reactants[result.excessIdx].color} faded />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Derivation strip ───────────────────────────────────────────── */}
      {result && (
        <div className="mt-4 rounded-xl p-4"
          style={{ background: 'rgba(167,139,250,0.06)',
                   border: '1px solid rgba(167,139,250,0.18)' }}>
          <div className="text-[10px] font-black uppercase tracking-widest mb-2"
            style={{ color: '#a78bfa' }}>
            The "moles over coefficient" rule
          </div>
          <div className="text-[13px] tabular-nums leading-relaxed flex flex-wrap items-center gap-x-3 gap-y-2"
            style={{ color: '#cbd5e1' }}>
            {/* Each ratio shown as a vertical fraction so it reads unambiguously
                from a distance — the ÷ glyph can look like + at a glance. */}
            <span style={{ color: A.color, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {A.formula}:
              <span style={{
                display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
                lineHeight: 1.15,
              }}>
                <span style={{ padding: '0 6px 2px 6px' }}>{molesA.toFixed(2)}</span>
                <span style={{
                  padding: '2px 6px 0 6px',
                  borderTop: '1.5px solid currentColor',
                  width: '100%', textAlign: 'center',
                }}>{A.coef}</span>
              </span>
              = {result.ratioA.toFixed(3)}
            </span>
            <span style={{ color: '#64748b' }}>vs</span>
            <span style={{ color: B.color, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {B.formula}:
              <span style={{
                display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
                lineHeight: 1.15,
              }}>
                <span style={{ padding: '0 6px 2px 6px' }}>{molesB.toFixed(2)}</span>
                <span style={{
                  padding: '2px 6px 0 6px',
                  borderTop: '1.5px solid currentColor',
                  width: '100%', textAlign: 'center',
                }}>{B.coef}</span>
              </span>
              = {result.ratioB.toFixed(3)}
            </span>
            <div className="mt-2 text-[12px]" style={{ color: '#94a3b8' }}>
              Smaller ratio = limiting reagent.{' '}
              <span style={{ color: reaction.reactants[result.limitingIdx].color, fontWeight: 700 }}>
                {reaction.reactants[result.limitingIdx].formula}
              </span>{' '}wins → extent of reaction ξ = {result.reactionExtent.toFixed(3)}.
              {' '}{reaction.reactants[result.excessIdx].formula} left over: {result.excessRemaining.toFixed(2)} mol.
            </div>
          </div>
        </div>
      )}

      {/* ── Expert tip ─────────────────────────────────────────────────── */}
      <div className="mt-4 pt-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1.5"
          style={{ color: '#6366f1' }}>Expert Tip</div>
        <p className="text-sm font-bold leading-snug italic text-white">
          &ldquo;Never trust the reactant that's there in larger absolute amount — divide each by its coefficient first.
          The one that gives the smaller number is the limiting reagent, no matter how much of the other you piled in.&rdquo;
        </p>
      </div>
    </div>
  );
}
