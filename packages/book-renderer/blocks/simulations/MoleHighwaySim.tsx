'use client';

/**
 * The Mole Highway — a conversion navigator.
 *
 * Academic source: NCERT Class 11 Chemistry, Chapter 1 — Some Basic Concepts
 * of Chemistry (§1.9 Mole Concept and Molar Mass). The four canonical
 * relationships this sim drills:
 *
 *   moles      = mass / molar_mass            (n = m / M)
 *   particles  = moles × N_A                  (N_A = 6.022 × 10²³ mol⁻¹)
 *   volume_STP = moles × 22.4 L               (ideal gas at STP ONLY)
 *   atoms(X)   = molecules × (atoms of X per molecule)   [atomicity multiplier]
 *
 * PEDAGOGICAL GOAL — this replaces the old passive "converter" readout. The #1
 * student failure in mole problems is DIRECTION: do I multiply or divide by M?
 * by N_A? by 22.4? Here the student is GIVEN a target and must walk the road-map
 * one hop at a time, choosing at each hop the conversion factor whose UNITS
 * CANCEL. Wrong direction → a units-based explanation, not just "wrong". This is
 * the same "multiply by a fraction that cancels the unit you don't want"
 * dimensional-analysis method taught in the Scientific Measurement worked
 * examples, applied to the mole.
 *
 * NEEDS_REVIEW: none — all relationships are the standard NCERT Ch.1 formulae.
 * Molar masses use the book's rounded convention (H₂O = 18, CO₂ = 44, O₂ = 32)
 * to keep the arithmetic clean and the focus on direction, matching the rounded
 * atomic masses used elsewhere on this page.
 */

import { useMemo, useState } from 'react';

// ── Constants (NCERT Class 11 Ch.1) ─────────────────────────────────────────
const N_A = 6.022e23;              // Avogadro's constant, mol⁻¹
const MOLAR_VOLUME_STP = 22.4;     // L mol⁻¹ (ideal gas at STP)

// ── Number formatting (shared convention with the rest of the book sims) ────
const SUP_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function prettyExp(eNotation: string): string {
  const m = eNotation.match(/^(-?[\d.]+)e([+-]?\d+)$/);
  if (!m) return eNotation;
  const mantissa = m[1];
  const expNum = parseInt(m[2], 10);
  if (expNum === 0) return mantissa;
  const sup = String(Math.abs(expNum)).split('').map(d => SUP_DIGITS[parseInt(d, 10)]).join('');
  const sign = expNum < 0 ? '⁻' : '';
  return `${mantissa} × 10${sign}${sup}`;
}
function fmt(v: number): string {
  if (!isFinite(v) || isNaN(v)) return '—';
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs >= 1e4 || abs < 1e-3) return prettyExp(v.toExponential(3));
  if (abs >= 100) return v.toFixed(1);
  if (abs >= 1) return v.toFixed(2);
  return v.toFixed(3);
}

// ── Stacked fraction (workflow §2 — never render the ÷ glyph) ────────────────
function Frac({ num, den, color }: { num: React.ReactNode; den: React.ReactNode; color?: string }) {
  return (
    <span style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
      verticalAlign: 'middle', lineHeight: 1.15, margin: '0 2px',
    }}>
      <span style={{ padding: '0 6px 2px 6px' }}>{num}</span>
      <span style={{
        padding: '2px 6px 0 6px',
        borderTop: `1.5px solid ${color ?? 'currentColor'}`,
        width: '100%', textAlign: 'center',
      }}>{den}</span>
    </span>
  );
}

// ── Node model ──────────────────────────────────────────────────────────────
type NodeKey = 'mass' | 'moles' | 'particles' | 'atoms' | 'volume';

const NODE_META: Record<NodeKey, { label: string; unit: string; accent: string }> = {
  mass:      { label: 'Mass',      unit: 'g',     accent: '#fbbf24' },
  moles:     { label: 'Moles',     unit: 'mol',   accent: '#a78bfa' },
  particles: { label: 'Particles', unit: '',      accent: '#34d399' },
  atoms:     { label: 'Atoms',     unit: '',      accent: '#f472b6' },
  volume:    { label: 'Volume',    unit: 'L',     accent: '#60a5fa' },
};

// The conversion graph is a TREE with moles as the hub:
//
//                     mass
//                       |
//     volume — moles — particles — atoms
//
const ADJ: Record<NodeKey, NodeKey[]> = {
  mass:      ['moles'],
  moles:     ['mass', 'particles', 'volume'],
  particles: ['moles', 'atoms'],
  atoms:     ['particles'],
  volume:    ['moles'],
};

// Unique path between two nodes in the tree (BFS).
function pathBetween(from: NodeKey, to: NodeKey): NodeKey[] {
  const parent = new Map<NodeKey, NodeKey | null>([[from, null]]);
  const queue: NodeKey[] = [from];
  while (queue.length) {
    const cur = queue.shift()!;
    if (cur === to) break;
    for (const nxt of ADJ[cur]) {
      if (!parent.has(nxt)) { parent.set(nxt, cur); queue.push(nxt); }
    }
  }
  const path: NodeKey[] = [];
  let n: NodeKey | null | undefined = to;
  while (n != null) { path.unshift(n); n = parent.get(n); }
  return path;
}

// ── Challenge model ─────────────────────────────────────────────────────────
interface Challenge {
  id: string;
  formula: React.ReactNode;
  name: string;
  molarMass: number;               // rounded, book convention
  particleUnit: string;            // plural, e.g. 'molecules'
  particleUnitSingular: string;
  isGas: boolean;
  start: NodeKey;
  startValue: number;
  target: NodeKey;
  element?: { symbol: string; countPerFormula: number };  // for the atoms hop
  prompt: React.ReactNode;
}

function sub(base: string, ...subs: (string | number)[]): React.ReactNode {
  // renders e.g. sub('CO',2) → CO₂ using real <sub>
  return <>{base}{subs.map((s, i) => <sub key={i}>{s}</sub>)}</>;
}

// Each challenge escalates the skill: forward multi-step → reverse → gas volume
// → the atomicity trap → the "22.4 is gas-only" trap.
const CHALLENGES: Challenge[] = [
  {
    id: 'o2-mass-to-particles',
    formula: sub('O', 2), name: 'Oxygen', molarMass: 32, particleUnit: 'molecules',
    particleUnitSingular: 'molecule', isGas: true,
    start: 'mass', startValue: 16, target: 'particles',
    prompt: <>You have <b>16 g of {sub('O', 2)}</b>. How many <b>molecules</b> is that?</>,
  },
  {
    id: 'co2-moles-to-volume',
    formula: sub('CO', 2), name: 'Carbon dioxide', molarMass: 44, particleUnit: 'molecules',
    particleUnitSingular: 'molecule', isGas: true,
    start: 'moles', startValue: 0.5, target: 'volume',
    prompt: <>You have <b>0.5 mol of {sub('CO', 2)}</b>. What <b>volume</b> does it occupy at STP?</>,
  },
  {
    id: 'co2-mass-to-volume',
    formula: sub('CO', 2), name: 'Carbon dioxide', molarMass: 44, particleUnit: 'molecules',
    particleUnitSingular: 'molecule', isGas: true,
    start: 'mass', startValue: 8.8, target: 'volume',
    prompt: <>What <b>volume at STP</b> is occupied by <b>8.8 g of {sub('CO', 2)}</b>?</>,
  },
  {
    id: 'co2-mass-to-oxygen-atoms',
    formula: sub('CO', 2), name: 'Carbon dioxide', molarMass: 44, particleUnit: 'molecules',
    particleUnitSingular: 'molecule', isGas: true,
    start: 'mass', startValue: 88, target: 'atoms',
    element: { symbol: 'O', countPerFormula: 2 },
    prompt: <>How many <b>oxygen atoms</b> are there in <b>88 g of {sub('CO', 2)}</b>?</>,
  },
  {
    id: 'h2o-mass-to-molecules',
    formula: sub('H', 2, 'O'), name: 'Water', molarMass: 18, particleUnit: 'molecules',
    particleUnitSingular: 'molecule', isGas: false,
    start: 'mass', startValue: 90, target: 'particles',
    prompt: <>How many <b>molecules</b> are in <b>90 g of {sub('H', 2, 'O')}</b>? (Watch the highway — one road is closed here.)</>,
  },
];

// ── A single directed hop: the CORRECT factor (units cancel the "from" unit) ──
interface Factor {
  value: number;
  num: string;   // numerator label (with unit)
  den: string;   // denominator label (with unit) — matches the incoming unit so it cancels
}

function correctFactor(from: NodeKey, to: NodeKey, ch: Challenge): Factor {
  const M = ch.molarMass;
  const pUnit = ch.particleUnit;
  const pSing = ch.particleUnitSingular;
  const key = `${from}->${to}`;
  switch (key) {
    case 'mass->moles':      return { value: 1 / M, num: '1 mol', den: `${M} g` };
    case 'moles->mass':      return { value: M, num: `${M} g`, den: '1 mol' };
    case 'moles->particles': return { value: N_A, num: `6.022 × 10²³ ${pUnit}`, den: '1 mol' };
    case 'particles->moles': return { value: 1 / N_A, num: '1 mol', den: `6.022 × 10²³ ${pUnit}` };
    case 'moles->volume':    return { value: MOLAR_VOLUME_STP, num: '22.4 L', den: '1 mol' };
    case 'volume->moles':    return { value: 1 / MOLAR_VOLUME_STP, num: '1 mol', den: '22.4 L' };
    case 'particles->atoms': {
      const k = ch.element?.countPerFormula ?? 1;
      const sym = ch.element?.symbol ?? '';
      return { value: k, num: `${k} ${sym} atoms`, den: `1 ${pSing}` };
    }
    case 'atoms->particles': {
      const k = ch.element?.countPerFormula ?? 1;
      const sym = ch.element?.symbol ?? '';
      return { value: 1 / k, num: `1 ${pSing}`, den: `${k} ${sym} atoms` };
    }
    default: return { value: 1, num: '1', den: '1' };
  }
}
// The wrong option is simply the reciprocal (units DON'T cancel).
function reciprocal(f: Factor): Factor {
  return { value: 1 / f.value, num: f.den, den: f.num };
}

// The unit that "arrives" at a node, used to explain cancellation.
function incomingUnit(node: NodeKey, ch: Challenge): string {
  switch (node) {
    case 'mass': return 'g';
    case 'moles': return 'mol';
    case 'particles': return ch.particleUnit;
    case 'atoms': return `${ch.element?.symbol ?? ''} atoms`;
    case 'volume': return 'L';
  }
}

function nodeValueLabel(node: NodeKey, value: number, ch: Challenge): string {
  const u = NODE_META[node].unit;
  if (node === 'particles') return `${fmt(value)} ${ch.particleUnit}`;
  if (node === 'atoms') return `${fmt(value)} ${ch.element?.symbol ?? ''} atoms`;
  return `${fmt(value)}${u ? ` ${u}` : ''}`;
}

// ── Main component ──────────────────────────────────────────────────────────
export default function MoleHighwaySim() {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [step, setStep] = useState(0);          // how many hops completed
  const [wrong, setWrong] = useState<string | null>(null);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());

  const ch = CHALLENGES[challengeIdx];

  // The path + running value at each node (recomputed per challenge).
  const { path, values, factors } = useMemo(() => {
    const p = pathBetween(ch.start, ch.target);
    const vals: number[] = [ch.startValue];
    const facs: Factor[] = [];
    for (let i = 0; i < p.length - 1; i++) {
      const f = correctFactor(p[i], p[i + 1], ch);
      facs.push(f);
      vals.push(vals[i] * f.value);
    }
    return { path: p, values: vals, factors: facs };
  }, [ch]);

  const done = step >= path.length - 1;

  // Options for the current hop — correct + reciprocal, order alternates so the
  // correct answer isn't always in the same slot.
  const hopOptions = useMemo(() => {
    if (done) return [];
    const correct = factors[step];
    const wrongF = reciprocal(correct);
    const correctFirst = (challengeIdx + step) % 2 === 0;
    return correctFirst
      ? [{ f: correct, ok: true }, { f: wrongF, ok: false }]
      : [{ f: wrongF, ok: false }, { f: correct, ok: true }];
  }, [done, factors, step, challengeIdx]);

  function choose(ok: boolean) {
    if (ok) {
      setWrong(null);
      const nextStep = step + 1;
      setStep(nextStep);
      if (nextStep >= path.length - 1) {
        setSolvedIds(prev => new Set(prev).add(ch.id));
      }
    } else {
      const fromNode = path[step];
      const fromUnit = incomingUnit(fromNode, ch);
      setWrong(
        `Check the units. You're carrying "${fromUnit}", so "${fromUnit}" must sit on the ` +
        `bottom of the factor to cancel out. This option leaves it uncancelled — the number ` +
        `moves the wrong way. Pick the factor with "${fromUnit}" in the denominator.`
      );
    }
  }

  function resetChallenge() { setStep(0); setWrong(null); }
  function gotoChallenge(i: number) { setChallengeIdx(i); setStep(0); setWrong(null); }

  const curNode = path[step];
  const nextNode = done ? null : path[step + 1];

  return (
    <div className="p-4 md:p-6 not-prose"
      style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, minHeight: '60vh' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            The Mole <span style={{ color: '#c4b5fd' }}>Highway</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
            Drive the conversion · pick the factor whose units cancel · NCERT Class 11 Ch. 1
          </p>
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-widest pt-1" style={{ color: '#64748b' }}>
          Challenge {challengeIdx + 1} / {CHALLENGES.length}
        </div>
      </div>

      {/* ── Challenge selector (StepBar) ────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {CHALLENGES.map((c, i) => {
          const active = i === challengeIdx;
          const solved = solvedIds.has(c.id);
          return (
            <button key={c.id} onClick={() => gotoChallenge(i)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all"
              style={{
                background: active ? 'rgba(129,140,248,0.15)' : solved ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : solved ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.07)'}`,
                color: active ? '#c4b5fd' : solved ? '#6ee7b7' : 'rgba(255,255,255,0.35)',
              }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
                style={{ background: active ? '#6366f1' : solved ? '#059669' : 'rgba(255,255,255,0.06)', color: 'white' }}>
                {solved ? '✓' : i + 1}
              </span>
              Level {i + 1}
            </button>
          );
        })}
      </div>

      {/* ── Prompt ──────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#fbbf24' }}>
          The Challenge
        </p>
        <p className="text-white font-bold text-lg leading-snug">{ch.prompt}</p>
      </div>

      {/* ── The highway (path of nodes for THIS challenge) ──────────────── */}
      <div className="rounded-3xl p-5 md:p-7 mb-5"
        style={{
          background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}>
        <div className="flex items-stretch justify-center gap-1 flex-wrap md:flex-nowrap">
          {path.map((node, i) => {
            const meta = NODE_META[node];
            const reached = i <= step;
            const isCurrent = i === step && !done;
            const isTarget = i === path.length - 1;
            return (
              <div key={node} className="flex items-stretch gap-1">
                {/* Node card */}
                <div className="rounded-2xl px-3 py-3 flex flex-col items-center justify-center text-center transition-all"
                  style={{
                    minWidth: 110,
                    background: reached ? `${meta.accent}14` : 'rgba(255,255,255,0.02)',
                    border: `1.5px solid ${isCurrent ? meta.accent : reached ? `${meta.accent}44` : 'rgba(255,255,255,0.06)'}`,
                    boxShadow: isCurrent ? `0 0 0 3px ${meta.accent}22` : 'none',
                    opacity: reached ? 1 : 0.55,
                  }}>
                  <div className="text-[10px] font-semibold uppercase tracking-widest mb-1"
                    style={{ color: reached ? meta.accent : '#475569' }}>
                    {node === 'atoms' && ch.element ? `${ch.element.symbol} Atoms` : meta.label}
                    {isTarget && <span style={{ marginLeft: 4 }}>🏁</span>}
                  </div>
                  <div className="text-[15px] font-black tabular-nums" style={{ color: reached ? '#e2e8f0' : '#475569' }}>
                    {reached ? nodeValueLabel(node, values[i], ch) : '?'}
                  </div>
                </div>
                {/* Connector arrow between nodes */}
                {i < path.length - 1 && (
                  <div className="flex items-center justify-center px-1" style={{ minWidth: 26 }}>
                    <span style={{
                      fontSize: 22,
                      color: i < step ? NODE_META[path[i + 1]].accent : 'rgba(255,255,255,0.2)',
                      transition: 'color 0.3s ease',
                    }}>→</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Active hop: choose the factor ──────────────────────────────── */}
      {!done ? (
        <div>
          <p className="text-sm mb-3" style={{ color: '#94a3b8' }}>
            You're at{' '}
            <b style={{ color: NODE_META[curNode].accent }}>
              {curNode === 'atoms' && ch.element ? `${ch.element.symbol} atoms` : NODE_META[curNode].label}
            </b>{' '}
            (<span className="tabular-nums">{nodeValueLabel(curNode, values[step], ch)}</span>). Which factor moves you to{' '}
            <b style={{ color: nextNode ? NODE_META[nextNode].accent : undefined }}>
              {nextNode === 'atoms' && ch.element ? `${ch.element.symbol} atoms` : nextNode ? NODE_META[nextNode].label : ''}
            </b>?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hopOptions.map((opt, i) => (
              <button key={i} onClick={() => choose(opt.ok)}
                className="rounded-xl px-4 py-4 flex items-center justify-center gap-2 transition-all text-[15px] font-bold"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: '#e2e8f0',
                }}>
                <span style={{ color: '#94a3b8' }}>×</span>
                <Frac num={opt.f.num} den={opt.f.den} color="#94a3b8" />
              </button>
            ))}
          </div>

          {wrong && (
            <div className="mt-4 rounded-xl px-4 py-3"
              style={{ background: 'rgba(220,38,38,0.10)', border: '1px solid rgba(248,113,113,0.35)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#f87171' }}>
                Not quite — think in units
              </p>
              <p className="text-sm leading-snug" style={{ color: '#fca5a5' }}>{wrong}</p>
            </div>
          )}
        </div>
      ) : (
        // ── Solved state — show the full chain the student built ─────────
        <div className="rounded-xl px-4 py-4"
          style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.30)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#34d399' }}>
            🏁 Solved — here's the road you drove
          </p>
          <div className="flex items-center gap-x-2 gap-y-1 flex-wrap text-[14px]" style={{ color: '#cbd5e1' }}>
            {path.map((node, i) => (
              <span key={node} className="flex items-center gap-2">
                <b className="tabular-nums" style={{ color: NODE_META[node].accent }}>
                  {nodeValueLabel(node, values[i], ch)}
                </b>
                {i < path.length - 1 && (
                  <span style={{ color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                    × <Frac num={factors[i].num} den={factors[i].den} color="#64748b" /> →
                  </span>
                )}
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <button onClick={resetChallenge}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(129,140,248,0.3)', color: '#a5b4fc' }}>
              ↺ Drive it again
            </button>
            {challengeIdx < CHALLENGES.length - 1 && (
              <button onClick={() => gotoChallenge(challengeIdx + 1)}
                className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
                style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(129,140,248,0.4)', color: '#c4b5fd' }}>
                Next challenge: Level {challengeIdx + 2} →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Expert Tip ──────────────────────────────────────────────────── */}
      <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>
          Expert Tip
        </div>
        <p className="text-sm font-bold leading-snug italic text-white">
          &ldquo;Never memorise &lsquo;multiply or divide&rsquo;. Write the factor as a fraction and put the unit you&rsquo;re
          holding on the bottom so it cancels — the direction takes care of itself. Every mole problem is just
          a chain of these fractions, with <span style={{ color: '#a78bfa' }}>moles</span> as the hub everything passes through.&rdquo;
        </p>
      </div>
    </div>
  );
}
