'use client';

/**
 * Electrolysis Product Predictor — a predict-then-check drill.
 *
 * Academic source: NCERT Class 12 Chemistry, Chapter 3 (Electrochemistry) —
 * "Products of electrolysis".
 *  - MOLTEN salt: the cation is reduced at the cathode, the anion oxidised at
 *    the anode (e.g. molten NaCl → Na + Cl₂).
 *  - AQUEOUS solution: water competes.
 *      Cathode — very active cations (Na⁺, K⁺, Ca²⁺, Mg²⁺, Al³⁺) are NOT reduced
 *      from water; instead water → H₂ (2H₂O + 2e⁻ → H₂ + 2OH⁻). Less-active
 *      cations (Cu²⁺, Ag⁺) deposit as the metal.
 *      Anode (inert) — halides (Cl⁻, Br⁻, I⁻) are oxidised to the halogen
 *      (helped by the O₂ over-voltage); oxo-anions (SO₄²⁻, NO₃⁻, F⁻) are NOT
 *      oxidised, so water → O₂ (2H₂O → O₂ + 4H⁺ + 4e⁻).
 *      Anode (attackable, e.g. Cu) — the electrode metal itself dissolves
 *      (Cu → Cu²⁺ + 2e⁻): the basis of electro-refining and electroplating.
 *
 * Pedagogical goal: drill the single hardest electrolysis skill — deciding which
 * species is actually discharged at each electrode — with immediate feedback and
 * the governing rule for every scenario.
 */

import { useState } from 'react';

// ── palette (workflow §3) ──────────────────────────────────────────────────────
const OK = '#34d399';
const BAD = '#f87171';
const INDIGO = '#818cf8';
const AMBER = '#fbbf24';

interface Scenario {
  electrolyte: string;
  electrodes: string;
  cathodeOpts: string[];
  cathodeAns: string;
  anodeOpts: string[];
  anodeAns: string;
  why: string;
}

const SCENARIOS: Scenario[] = [
  {
    electrolyte: 'Molten NaCl', electrodes: 'inert',
    cathodeOpts: ['Na metal', 'H₂', 'O₂'], cathodeAns: 'Na metal',
    anodeOpts: ['Cl₂', 'O₂', 'H₂'], anodeAns: 'Cl₂',
    why: 'Molten salt has no water to compete, so the ions are discharged directly: Na⁺ → Na at the cathode, Cl⁻ → Cl₂ at the anode.',
  },
  {
    electrolyte: 'Aqueous NaCl (brine)', electrodes: 'inert',
    cathodeOpts: ['H₂', 'Na metal', 'O₂'], cathodeAns: 'H₂',
    anodeOpts: ['Cl₂', 'O₂', 'H₂'], anodeAns: 'Cl₂',
    why: 'Na⁺ is far too hard to reduce from water, so water is reduced to H₂. Cl⁻ is oxidised to Cl₂ (water’s O₂ is held back by over-voltage). The basis of the chlor-alkali process.',
  },
  {
    electrolyte: 'Aqueous CuSO₄', electrodes: 'inert (Pt)',
    cathodeOpts: ['Cu metal', 'H₂', 'O₂'], cathodeAns: 'Cu metal',
    anodeOpts: ['O₂', 'Cl₂', 'SO₂'], anodeAns: 'O₂',
    why: 'Cu²⁺ is easily reduced, so copper deposits at the cathode. SO₄²⁻ cannot be oxidised, so water → O₂ at the anode and the solution turns acidic.',
  },
  {
    electrolyte: 'Aqueous CuSO₄', electrodes: 'copper (Cu)',
    cathodeOpts: ['Cu metal', 'H₂', 'O₂'], cathodeAns: 'Cu metal',
    anodeOpts: ['Cu dissolves (Cu → Cu²⁺)', 'O₂', 'Cl₂'], anodeAns: 'Cu dissolves (Cu → Cu²⁺)',
    why: 'With an attackable copper anode, the electrode itself dissolves (Cu → Cu²⁺) instead of releasing O₂, while copper plates onto the cathode — exactly how copper is electro-refined and how plating works.',
  },
  {
    electrolyte: 'Aqueous AgNO₃', electrodes: 'inert',
    cathodeOpts: ['Ag metal', 'H₂', 'O₂'], cathodeAns: 'Ag metal',
    anodeOpts: ['O₂', 'NO₂', 'H₂'], anodeAns: 'O₂',
    why: 'Ag⁺ is readily reduced → silver deposits. NO₃⁻ is not oxidised, so water → O₂ at the anode (solution turns acidic).',
  },
  {
    electrolyte: 'Aqueous K₂SO₄', electrodes: 'inert',
    cathodeOpts: ['H₂', 'K metal', 'O₂'], cathodeAns: 'H₂',
    anodeOpts: ['O₂', 'Cl₂', 'SO₂'], anodeAns: 'O₂',
    why: 'Both K⁺ and SO₄²⁻ are spectators — neither is discharged. Only water reacts: H₂ at the cathode, O₂ at the anode. The H⁺ and OH⁻ made balance out, so the solution stays neutral.',
  },
  {
    electrolyte: 'Aqueous KI', electrodes: 'inert',
    cathodeOpts: ['H₂', 'K metal', 'O₂'], cathodeAns: 'H₂',
    anodeOpts: ['I₂', 'O₂', 'H₂'], anodeAns: 'I₂',
    why: 'K⁺ is too active to reduce from water → H₂ at the cathode. I⁻ is oxidised to I₂ at the anode (iodide is even easier to oxidise than water).',
  },
  {
    electrolyte: 'Molten MgCl₂', electrodes: 'inert',
    cathodeOpts: ['Mg metal', 'H₂', 'O₂'], cathodeAns: 'Mg metal',
    anodeOpts: ['Cl₂', 'O₂', 'H₂'], anodeAns: 'Cl₂',
    why: 'A molten salt again — ions discharged directly: Mg²⁺ → Mg at the cathode, Cl⁻ → Cl₂ at the anode. (This is how magnesium metal is produced.)',
  },
  {
    electrolyte: 'Dilute H₂SO₄ (acidified water)', electrodes: 'inert',
    cathodeOpts: ['H₂', 'O₂', 'S'], cathodeAns: 'H₂',
    anodeOpts: ['O₂', 'SO₂', 'H₂'], anodeAns: 'O₂',
    why: 'This is effectively the electrolysis of water: H₂ at the cathode, O₂ at the anode (SO₄²⁻ is a spectator). Volume ratio H₂ : O₂ = 2 : 1.',
  },
  {
    electrolyte: 'Aqueous NaBr', electrodes: 'inert',
    cathodeOpts: ['H₂', 'Na metal', 'O₂'], cathodeAns: 'H₂',
    anodeOpts: ['Br₂', 'O₂', 'H₂'], anodeAns: 'Br₂',
    why: 'Na⁺ too active → water reduced to H₂. Br⁻ is oxidised to Br₂ at the anode (halide beats water’s O₂ thanks to over-voltage).',
  },
];

function shuffleNext(current: number): number {
  if (SCENARIOS.length < 2) return current;
  let n = current;
  while (n === current) n = Math.floor(Math.random() * SCENARIOS.length);
  return n;
}

// ── Option chip ────────────────────────────────────────────────────────────────

function Chip({ label, picked, checked, correct, onClick }:
  { label: string; picked: boolean; checked: boolean; correct: boolean; onClick: () => void }) {
  let border = 'rgba(255,255,255,0.1)', bg = 'transparent', color = 'rgba(255,255,255,0.6)';
  if (checked) {
    if (correct) { border = OK; bg = 'rgba(52,211,153,0.12)'; color = OK; }
    else if (picked) { border = BAD; bg = 'rgba(248,113,113,0.12)'; color = BAD; }
  } else if (picked) { border = 'rgba(129,140,248,0.6)'; bg = 'rgba(129,140,248,0.12)'; color = '#c7d2fe'; }
  return (
    <button onClick={onClick} disabled={checked}
      className="px-3.5 py-2 rounded-xl text-[13px] font-bold transition-all"
      style={{ border: `1.5px solid ${border}`, background: bg, color, cursor: checked ? 'default' : 'pointer' }}>
      {label}{checked && correct ? ' ✓' : checked && picked ? ' ✗' : ''}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ElectrolysisPredictorSim() {
  const [idx, setIdx] = useState(0);
  const [cPick, setCPick] = useState<string | null>(null);
  const [aPick, setAPick] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);

  const s = SCENARIOS[idx];
  const bothPicked = cPick !== null && aPick !== null;
  const allRight = checked && cPick === s.cathodeAns && aPick === s.anodeAns;

  const check = () => {
    if (!bothPicked || checked) return;
    setChecked(true);
    setAttempts((a) => a + 1);
    const right = cPick === s.cathodeAns && aPick === s.anodeAns;
    if (right) { setScore((v) => v + 1); setStreak((v) => v + 1); } else { setStreak(0); }
  };
  const next = () => { setIdx((i) => shuffleNext(i)); setCPick(null); setAPick(null); setChecked(false); };

  return (
    <div className="p-4 md:p-6 not-prose" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, minHeight: '60vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">Electrolysis <span style={{ color: '#7c3aed' }}>Product Predictor</span></h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>Predict what forms at each electrode · NCERT Class 12 Ch. 3</p>
        </div>
        <div className="flex gap-2 pt-1">
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.12)', color: INDIGO }}>Score {score}/{attempts}</span>
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: 'rgba(251,191,36,0.12)', color: AMBER }}>Streak {streak}</span>
        </div>
      </div>

      {/* Scenario card */}
      <div className="rounded-2xl px-5 py-4 mb-5" style={{ background: '#0b0f15', border: '1px solid rgba(129,140,248,0.25)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>Electrolyse</div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-xl font-black text-white">{s.electrolyte}</span>
          <span className="text-[12px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>{s.electrodes} electrodes</span>
        </div>
      </div>

      {/* Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <div className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: '#f87171' }}>Cathode (−) — what is reduced?</div>
          <div className="flex flex-wrap gap-2">
            {s.cathodeOpts.map((o) => (
              <Chip key={o} label={o} picked={cPick === o} checked={checked} correct={o === s.cathodeAns} onClick={() => setCPick(o)} />
            ))}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: '#34d399' }}>Anode (+) — what is oxidised?</div>
          <div className="flex flex-wrap gap-2">
            {s.anodeOpts.map((o) => (
              <Chip key={o} label={o} picked={aPick === o} checked={checked} correct={o === s.anodeAns} onClick={() => setAPick(o)} />
            ))}
          </div>
        </div>
      </div>

      {/* Action / reveal */}
      {!checked ? (
        <button onClick={check} disabled={!bothPicked}
          className="w-full py-3 rounded-xl text-sm font-bold transition-all"
          style={{ background: bothPicked ? 'linear-gradient(135deg,#6366f1,#818cf8)' : 'rgba(255,255,255,0.04)', color: bothPicked ? '#fff' : 'rgba(255,255,255,0.25)', cursor: bothPicked ? 'pointer' : 'not-allowed' }}>
          Check my prediction →
        </button>
      ) : (
        <div className="rounded-xl px-4 py-4" style={{ background: allRight ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.08)', border: `1px solid ${allRight ? OK : BAD}40` }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: allRight ? OK : BAD }}>{allRight ? '✓ Both correct' : 'Not quite'}</span>
            <span className="text-[12px] font-bold" style={{ color: '#94a3b8' }}>cathode: {s.cathodeAns} · anode: {s.anodeAns}</span>
          </div>
          <p className="text-sm leading-snug" style={{ color: '#cbd5e1' }}>{s.why}</p>
          <button onClick={next} className="mt-3 px-5 py-2 rounded-lg text-sm font-bold transition-all" style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(129,140,248,0.4)', color: '#c4b5fd' }}>Next scenario →</button>
        </div>
      )}

      {/* Rules reference */}
      <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>The rules in one breath</div>
        <p className="text-sm font-bold leading-snug italic text-white">
          &ldquo;<span style={{ color: AMBER }}>Molten</span> → the ions themselves discharge. <span style={{ color: AMBER }}>Aqueous</span> → water competes: very active cations (Na⁺, K⁺, Mg²⁺, Al³⁺) give <span style={{ color: '#f87171' }}>H₂</span> not metal; oxo-anions (SO₄²⁻, NO₃⁻) give <span style={{ color: '#34d399' }}>O₂</span> not the anion — but halides still give the halogen (over-voltage). An attackable Cu anode just dissolves.&rdquo;
        </p>
      </div>
    </div>
  );
}
