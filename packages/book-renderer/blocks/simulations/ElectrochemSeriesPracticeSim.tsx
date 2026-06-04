'use client';

/**
 * Electrochemical Series — Practice Drill
 *
 * Academic source: NCERT Class 12 Chemistry, Chapter 3 (Electrochemistry),
 * standard reduction potentials (Table 3.1, vs SHE, 298 K) and the
 * "applications of the electrochemical series" rules:
 *   E°(V): Ag⁺/Ag +0.80, Cu²⁺/Cu +0.34, Pb²⁺/Pb −0.13, Ni²⁺/Ni −0.25,
 *          Fe²⁺/Fe −0.44, Zn²⁺/Zn −0.76, Al³⁺/Al −1.66, Mg²⁺/Mg −2.37.
 *  - A metal displaces another metal's ion from solution when it is the
 *    stronger reducing agent (lower / more negative SRP): reaction is feasible
 *    iff E°cell = E°(ion couple) − E°(metal couple) > 0.
 *  - A salt solution cannot be stored in a container metal whose SRP is lower
 *    than the dissolved cation's couple (the container would displace it).
 *
 * This is an INTERACTIVE PRACTICE drill (not a data table): the student
 * predicts displacement / storage outcomes and checks against the rule.
 */

import { useState } from 'react';

// ── Data ─────────────────────────────────────────────────────────────────────
interface Metal {
  id: string;
  symbol: string;
  name: string;
  charge: number;       // charge of its cation
  ion: string;          // pretty cation, e.g. 'Cu²⁺'
  salt: string;         // pretty salt, e.g. 'CuSO₄'
  eRed: number;         // standard reduction potential / V
  metalColor: string;   // realistic metallic colour
  metalDark: string;
  solnFill: string;     // solution colour (by cation)
  solnTop: string;
}

const METALS: Record<string, Metal> = {
  mg: { id: 'mg', symbol: 'Mg', name: 'Magnesium', charge: 2, ion: 'Mg²⁺', salt: 'MgSO₄', eRed: -2.37, metalColor: '#c4cdd6', metalDark: '#878f98', solnFill: 'rgba(173,216,222,0.12)', solnTop: 'rgba(173,216,222,0.22)' },
  al: { id: 'al', symbol: 'Al', name: 'Aluminium', charge: 3, ion: 'Al³⁺', salt: 'Al₂(SO₄)₃', eRed: -1.66, metalColor: '#b9c0c8', metalDark: '#7e858d', solnFill: 'rgba(173,216,222,0.12)', solnTop: 'rgba(173,216,222,0.22)' },
  zn: { id: 'zn', symbol: 'Zn', name: 'Zinc', charge: 2, ion: 'Zn²⁺', salt: 'ZnSO₄', eRed: -0.76, metalColor: '#9aa7b4', metalDark: '#6b7884', solnFill: 'rgba(173,216,222,0.12)', solnTop: 'rgba(173,216,222,0.22)' },
  fe: { id: 'fe', symbol: 'Fe', name: 'Iron', charge: 2, ion: 'Fe²⁺', salt: 'FeSO₄', eRed: -0.44, metalColor: '#8a8f98', metalDark: '#5a5f68', solnFill: 'rgba(120,165,110,0.20)', solnTop: 'rgba(150,195,135,0.28)' },
  ni: { id: 'ni', symbol: 'Ni', name: 'Nickel', charge: 2, ion: 'Ni²⁺', salt: 'NiSO₄', eRed: -0.25, metalColor: '#a9b0a3', metalDark: '#717869', solnFill: 'rgba(80,170,95,0.26)', solnTop: 'rgba(110,200,120,0.34)' },
  pb: { id: 'pb', symbol: 'Pb', name: 'Lead', charge: 2, ion: 'Pb²⁺', salt: 'Pb(NO₃)₂', eRed: -0.13, metalColor: '#7c828c', metalDark: '#52575f', solnFill: 'rgba(173,216,222,0.12)', solnTop: 'rgba(173,216,222,0.22)' },
  cu: { id: 'cu', symbol: 'Cu', name: 'Copper', charge: 2, ion: 'Cu²⁺', salt: 'CuSO₄', eRed: 0.34, metalColor: '#c8743a', metalDark: '#8f4f22', solnFill: 'rgba(46,120,210,0.34)', solnTop: 'rgba(96,165,235,0.42)' },
  ag: { id: 'ag', symbol: 'Ag', name: 'Silver', charge: 1, ion: 'Ag⁺', salt: 'AgNO₃', eRed: 0.80, metalColor: '#d4d9df', metalDark: '#9aa1a9', solnFill: 'rgba(173,216,222,0.12)', solnTop: 'rgba(173,216,222,0.22)' },
};
// top (strong oxidiser, high SRP) → bottom (strong reducer, low SRP)
const LADDER = ['ag', 'cu', 'pb', 'ni', 'fe', 'zn', 'al', 'mg'];
const IDS = LADDER;

// palette
const INDIGO = '#818cf8', GOOD = '#34d399', BAD = '#f87171', AMBER = '#fbbf24';

function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a; }
function coef(n: number) { return n === 1 ? '' : String(n); }

// balanced displacement: metal A displaces cation of B
function displacementEqn(A: Metal, B: Metal): string {
  const g = gcd(A.charge, B.charge);
  const nA = B.charge / g; // moles of A
  const nB = A.charge / g; // moles of B-ion
  return `${coef(nA)}${A.symbol} + ${coef(nB)}${B.ion} → ${coef(nA)}${A.ion} + ${coef(nB)}${B.symbol}`;
}

type Mode = 'displace' | 'store';

function randomPair(): [string, string] {
  let a = IDS[Math.floor(Math.random() * IDS.length)];
  let b = IDS[Math.floor(Math.random() * IDS.length)];
  while (b === a) b = IDS[Math.floor(Math.random() * IDS.length)];
  return [a, b];
}

// ── Scene (SVG) ───────────────────────────────────────────────────────────────
function Scene({ mode, metal, ion, checked, reacts }: { mode: Mode; metal: Metal; ion: Metal; checked: boolean; reacts: boolean }) {
  // mode 'displace': glass beaker, solution = ion's salt, a strip of `metal` dips in
  // mode 'store':    vessel walls = container `metal`, solution = ion's salt inside
  const gradId = `esp-strip-${metal.id}`;
  const wallStroke = mode === 'store' ? metal.metalColor : 'rgba(255,255,255,0.22)';
  const wallWidth = mode === 'store' ? 10 : 2.5;
  return (
    <svg width="100%" height="100%" viewBox="0 0 460 420" style={{ minHeight: 360 }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={metal.metalDark} />
          <stop offset="40%" stopColor={metal.metalColor} />
          <stop offset="100%" stopColor={metal.metalDark} />
        </linearGradient>
        <linearGradient id="esp-soln" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ion.solnTop} />
          <stop offset="100%" stopColor={ion.solnFill} />
        </linearGradient>
        <clipPath id="esp-clip"><path d="M120 112 L340 112 L330 348 Q330 362 316 362 L144 362 Q130 362 130 348 Z" /></clipPath>
      </defs>

      {/* solution */}
      <g clipPath="url(#esp-clip)">
        <rect x="118" y="170" width="224" height="200" fill="url(#esp-soln)" />
        {/* unsafe corrosion tint creeps up the inner wall in store mode */}
        {mode === 'store' && checked && reacts && (
          <rect x="118" y="170" width="224" height="200" fill="rgba(200,90,40,0.18)" style={{ animation: 'esp-pulse 1.6s ease-in-out infinite' }} />
        )}
      </g>

      {/* beaker / vessel walls */}
      <path d="M120 112 L340 112 L330 348 Q330 362 316 362 L144 362 Q130 362 130 348 Z"
        fill={mode === 'store' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.04)'}
        stroke={wallStroke} strokeWidth={wallWidth} strokeLinejoin="round" />
      {/* meniscus */}
      <path d="M132 170 Q230 162 328 170" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />

      {/* DISPLACE mode: a metal strip dips in */}
      {mode === 'displace' && (
        <g>
          <rect x="210" y="74" width="40" height="250" rx="5" fill={`url(#${gradId})`} stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
          <rect x="216" y="78" width="5" height="242" rx="2.5" fill="rgba(255,255,255,0.35)" />
          {/* deposited metal coating + dissolving, only when reaction occurs */}
          {checked && reacts && (
            <g style={{ animation: 'esp-pulse 1.8s ease-in-out infinite' }}>
              <rect x="210" y="200" width="40" height="124" rx="4" fill={ion.metalColor} opacity="0.85" />
              <text x="230" y="345" fontSize="11" fontWeight="800" fill={ion.metalColor} textAnchor="middle">{ion.symbol} deposits</text>
            </g>
          )}
          <text x="230" y="62" fontSize="13" fontWeight="800" fill={metal.metalColor} textAnchor="middle">{metal.symbol} strip</text>
        </g>
      )}

      {/* labels */}
      <text x="230" y="388" fontSize="13" fontWeight="700" fill="#94a3b8" textAnchor="middle">
        {mode === 'store' ? `${ion.salt} in a ${metal.symbol} container` : `${ion.salt} solution`}
      </text>

      {/* result stamp */}
      {checked && (
        <g transform="translate(390,130)">
          <circle r="30" fill={reacts ? (mode === 'displace' ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)') : 'rgba(148,163,184,0.12)'}
            stroke={reacts ? (mode === 'displace' ? GOOD : BAD) : '#94a3b8'} strokeWidth="2" />
          <text x="0" y="2" fontSize={mode === 'store' ? 20 : 22} fontWeight="900"
            fill={reacts ? (mode === 'displace' ? GOOD : BAD) : '#94a3b8'} textAnchor="middle" dominantBaseline="central">
            {mode === 'displace' ? (reacts ? '✓' : '✗') : (reacts ? '⚠' : '✓')}
          </text>
        </g>
      )}
    </svg>
  );
}

// ── Mini ladder ────────────────────────────────────────────────────────────────
function Ladder({ aId, bId }: { aId: string; bId: string }) {
  return (
    <div className="rounded-2xl px-4 py-3" style={{ background: '#0b0f15', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>
        Electrochemical series · E° (V)
      </div>
      <div className="flex flex-col gap-0.5">
        {LADDER.map((id) => {
          const m = METALS[id];
          const hi = id === aId || id === bId;
          return (
            <div key={id} className="flex items-center justify-between rounded px-2 py-0.5"
              style={{ background: hi ? 'rgba(129,140,248,0.14)' : 'transparent', border: `1px solid ${hi ? 'rgba(129,140,248,0.35)' : 'transparent'}` }}>
              <span className="text-[12px] font-bold" style={{ color: hi ? '#c4b5fd' : '#94a3b8' }}>
                {m.ion} / {m.symbol}
              </span>
              <span className="text-[12px] tabular-nums" style={{ color: hi ? '#c4b5fd' : '#64748b' }}>
                {m.eRed > 0 ? '+' : ''}{m.eRed.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-[9px]" style={{ color: '#475569' }}>
        <span>↑ stronger oxidiser</span><span>stronger reducer ↓</span>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function ElectrochemSeriesPracticeSim() {
  const [mode, setMode] = useState<Mode>('displace');
  const [pair, setPair] = useState<[string, string]>(() => randomPair());
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0, streak: 0 });
  const [showLadder, setShowLadder] = useState(true);

  const A = METALS[pair[0]]; // strip / container metal
  const B = METALS[pair[1]]; // dissolved cation
  // reaction / corrosion happens iff A is the stronger reducer (lower SRP) than B
  const reacts = A.eRed < B.eRed;
  const eCell = B.eRed - A.eRed; // E°cell for A oxidised, B reduced

  const correctAns = mode === 'displace' ? (reacts ? 'yes' : 'no') : (reacts ? 'unsafe' : 'safe');
  const options: { key: string; label: string }[] =
    mode === 'displace'
      ? [{ key: 'yes', label: 'Reaction occurs' }, { key: 'no', label: 'No reaction' }]
      : [{ key: 'safe', label: 'Safe to store' }, { key: 'unsafe', label: 'Unsafe' }];

  function check() {
    if (picked === null) return;
    setChecked(true);
    setScore((s) => ({
      correct: s.correct + (picked === correctAns ? 1 : 0),
      total: s.total + 1,
      streak: picked === correctAns ? s.streak + 1 : 0,
    }));
  }
  function next() { setPair(randomPair()); setPicked(null); setChecked(false); }
  function switchMode(m: Mode) { setMode(m); setPair(randomPair()); setPicked(null); setChecked(false); }

  const isCorrect = checked && picked === correctAns;

  return (
    <div className="p-4 md:p-6 not-prose" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, minHeight: '60vh', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`@keyframes esp-pulse { 0%,100%{opacity:.6} 50%{opacity:1} }`}</style>

      {/* Header */}
      <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">Electrochemical Series <span style={{ color: '#7c3aed' }}>Practice</span></h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>Predict & check · NCERT Class 12 Ch. 3</p>
        </div>
        <div className="flex gap-2">
          <div className="text-center px-3 py-1 rounded-lg" style={{ background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.25)' }}>
            <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: GOOD }}>Score</div>
            <div className="text-sm font-black tabular-nums" style={{ color: GOOD }}>{score.correct}/{score.total}</div>
          </div>
          <div className="text-center px-3 py-1 rounded-lg" style={{ background: 'rgba(251,191,36,0.10)', border: '1px solid rgba(251,191,36,0.25)' }}>
            <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: AMBER }}>Streak</div>
            <div className="text-sm font-black tabular-nums" style={{ color: AMBER }}>{score.streak}🔥</div>
          </div>
        </div>
      </div>

      {/* Mode tabs (§4g) */}
      <div className="flex mb-5 flex-wrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {([['displace', 'Who displaces whom?', 'metal + salt solution'], ['store', 'Safe to store?', 'salt in a metal vessel']] as const).map(([key, label, sub]) => {
          const active = mode === key;
          return (
            <button key={key} onClick={() => switchMode(key)} className="px-4 py-3 text-left transition-all"
              style={{ background: 'none', outline: 'none', borderBottom: `2px solid ${active ? INDIGO : 'rgba(255,255,255,0.06)'}`, opacity: active ? 1 : 0.55, marginBottom: -1 }}>
              <div className="text-sm font-black" style={{ color: active ? INDIGO : '#94a3b8' }}>{label}</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#475569' }}>{sub}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[6fr_5fr] gap-6">
        {/* Left — scene */}
        <div className="relative overflow-hidden rounded-3xl" style={{ minHeight: 360, background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <Scene mode={mode} metal={A} ion={B} checked={checked} reacts={reacts} />
        </div>

        {/* Right — question + answer + feedback */}
        <div className="flex flex-col gap-3.5">
          {/* Question */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: INDIGO }}>Your call</div>
            <p className="text-lg font-bold leading-snug text-white">
              {mode === 'displace'
                ? <>You drop a <span style={{ color: A.metalColor }}>{A.name} ({A.symbol})</span> strip into <span style={{ color: AMBER }}>{B.salt}</span> solution. Does a reaction happen?</>
                : <>Can <span style={{ color: AMBER }}>{B.salt}</span> solution be safely stored in a <span style={{ color: A.metalColor }}>{A.name} ({A.symbol})</span> container?</>}
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-2">
            {options.map((opt) => {
              const sel = picked === opt.key;
              let bg = sel ? 'rgba(129,140,248,0.12)' : 'rgba(255,255,255,0.03)';
              let bd = sel ? 'rgba(129,140,248,0.5)' : 'rgba(255,255,255,0.08)';
              let col = sel ? '#c4b5fd' : '#94a3b8';
              if (checked) {
                if (opt.key === correctAns) { bg = 'rgba(52,211,153,0.14)'; bd = GOOD; col = GOOD; }
                else if (sel) { bg = 'rgba(248,113,113,0.14)'; bd = BAD; col = BAD; }
              }
              return (
                <button key={opt.key} disabled={checked} onClick={() => setPicked(opt.key)}
                  className="text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: bg, border: `1.5px solid ${bd}`, color: col, cursor: checked ? 'default' : 'pointer' }}>
                  {opt.label}
                  {checked && opt.key === correctAns && ' ✓'}
                  {checked && sel && opt.key !== correctAns && ' ✗'}
                </button>
              );
            })}
          </div>

          {/* Check / Next */}
          {!checked ? (
            <button onClick={check} disabled={picked === null}
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: picked !== null ? 'linear-gradient(135deg,#6366f1,#818cf8)' : 'rgba(255,255,255,0.04)', color: picked !== null ? '#fff' : 'rgba(255,255,255,0.25)', cursor: picked !== null ? 'pointer' : 'not-allowed' }}>
              Check answer
            </button>
          ) : (
            <button onClick={next} className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(129,140,248,0.3)', color: '#a5b4fc' }}>
              Next scenario →
            </button>
          )}

          {/* Feedback */}
          {checked && (
            <div className="rounded-xl px-4 py-3" style={{ background: isCorrect ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)', border: `1px solid ${isCorrect ? GOOD : BAD}40` }}>
              <div className="text-[11px] font-black uppercase tracking-widest mb-1.5" style={{ color: isCorrect ? GOOD : BAD }}>
                {isCorrect ? 'Correct!' : 'Not quite'}
              </div>
              <p className="text-sm leading-snug" style={{ color: '#cbd5e1' }}>
                <b>{A.symbol}</b> ({A.eRed > 0 ? '+' : ''}{A.eRed.toFixed(2)} V) vs <b>{B.symbol}</b> ({B.eRed > 0 ? '+' : ''}{B.eRed.toFixed(2)} V):
                {' '}{A.symbol} sits <b>{reacts ? 'below' : 'above'}</b> {B.symbol} in the series, so it is the {reacts ? 'stronger' : 'weaker'} reducing agent.
              </p>
              {mode === 'displace' ? (
                reacts ? (
                  <p className="text-sm leading-snug mt-1.5" style={{ color: '#e2e8f0' }}>
                    ✓ {A.symbol} displaces {B.symbol}: <b style={{ color: GOOD }}>{displacementEqn(A, B)}</b><br />
                    <span className="tabular-nums" style={{ color: '#94a3b8' }}>E°cell = {B.eRed.toFixed(2)} − ({A.eRed.toFixed(2)}) = <b style={{ color: GOOD }}>+{eCell.toFixed(2)} V</b> (feasible)</span>
                  </p>
                ) : (
                  <p className="text-sm leading-snug mt-1.5" style={{ color: '#e2e8f0' }}>
                    ✗ No reaction — {A.symbol} can't displace {B.symbol}. E°cell = {eCell.toFixed(2)} V (negative ⇒ non-spontaneous).
                  </p>
                )
              ) : (
                reacts ? (
                  <p className="text-sm leading-snug mt-1.5" style={{ color: '#e2e8f0' }}>
                    ⚠ <b style={{ color: BAD }}>Unsafe</b> — the {A.symbol} container would displace {B.symbol} from solution and corrode: <b>{displacementEqn(A, B)}</b>
                  </p>
                ) : (
                  <p className="text-sm leading-snug mt-1.5" style={{ color: '#e2e8f0' }}>
                    ✓ <b style={{ color: GOOD }}>Safe</b> — {A.symbol} is above {B.symbol} in the series, so it has no tendency to displace {B.symbol}. The container is untouched.
                  </p>
                )
              )}
            </div>
          )}

          {/* Ladder toggle (§4f) + ladder */}
          <button onClick={() => setShowLadder((v) => !v)} className="self-start text-xs font-semibold transition-colors pb-0.5"
            style={{ color: showLadder ? AMBER : '#475569', borderBottom: `1px solid ${showLadder ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.1)'}`, background: 'none', outline: 'none' }}>
            {showLadder ? '✓ Showing the series' : 'Show the series'}
          </button>
          {showLadder && <Ladder aId={A.id} bId={B.id} />}
        </div>
      </div>

      {/* Expert Tip (§4j) */}
      <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert Tip</div>
        <p className="text-sm font-bold leading-snug italic text-white">&ldquo;One rule runs both modes: a metal attacks any ion <i>above</i> it in the series. So a metal displaces ions above it — and you must never store a solution in a vessel made of a metal that sits below that solution's ion.&rdquo;</p>
      </div>
    </div>
  );
}
