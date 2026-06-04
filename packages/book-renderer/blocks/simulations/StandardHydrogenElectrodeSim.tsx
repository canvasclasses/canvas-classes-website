'use client';

/**
 * Standard Hydrogen Electrode (SHE) — Reference-Electrode Builder
 *
 * Academic source: NCERT Class 12 Chemistry, Chapter 3 (Electrochemistry).
 *  - The SHE is assigned E° = 0.00 V by convention. It is built from a
 *    platinised platinum foil dipping in 1 M H⁺ with pure H₂ gas at 1 bar
 *    bubbled over it:  2H⁺(1 M) + 2e⁻  ⇌  H₂(1 bar).
 *  - A metal half-cell is connected to the SHE through a salt bridge and a
 *    voltmeter. The standard reduction potentials (Table 3.1, vs SHE, 298 K):
 *      Mg²⁺/Mg −2.37 · Al³⁺/Al −1.66 · Zn²⁺/Zn −0.76 · Fe²⁺/Fe −0.44 ·
 *      Ni²⁺/Ni −0.25 · Cu²⁺/Cu +0.34 · Ag⁺/Ag +0.80.
 *  - Sign rule: a metal with E° < 0 has a greater tendency to be oxidised than
 *    H₂, so the metal is the ANODE and the SHE is the CATHODE. A metal with
 *    E° > 0 is reduced more readily than H⁺, so the metal is the CATHODE and
 *    the SHE is the ANODE. Electron flow in the external wire reverses with the
 *    sign. E°cell = E°cathode − E°anode = |E°metal| (always positive).
 *
 * Pedagogical goal: the student picks a metal, and watches the SHE flip between
 * anode and cathode, the electron-flow arrow reverse, and the balanced half +
 * net reactions and E°cell update — driving home that "zero" is a reference,
 * not a fixed role.
 */

import { useState } from 'react';

// ── Types & data ────────────────────────────────────────────────────────────

type MetalId = 'mg' | 'al' | 'zn' | 'fe' | 'ni' | 'cu' | 'ag';

interface Metal {
  id: MetalId;
  symbol: string;
  name: string;
  n: number; // electrons in M ⇌ Mⁿ⁺ + ne⁻
  ion: string; // pretty ion, e.g. 'Zn²⁺'
  solution: string; // salt providing the 1 M Mⁿ⁺ solution
  eRed: number; // standard reduction potential / V (vs SHE)
  // realistic apparatus colours (not UI accents)
  rodLight: string;
  rodBase: string;
  rodDark: string;
  solutionFill: string;
  solutionTop: string;
}

const METALS: Record<MetalId, Metal> = {
  mg: {
    id: 'mg', symbol: 'Mg', name: 'Magnesium', n: 2, ion: 'Mg²⁺', solution: 'MgSO₄', eRed: -2.37,
    rodLight: '#e3e8ec', rodBase: '#b9c2c9', rodDark: '#899099',
    solutionFill: 'rgba(200,212,222,0.10)', solutionTop: 'rgba(220,230,238,0.20)',
  },
  al: {
    id: 'al', symbol: 'Al', name: 'Aluminium', n: 3, ion: 'Al³⁺', solution: 'Al₂(SO₄)₃', eRed: -1.66,
    rodLight: '#dfe4e8', rodBase: '#b3bcc4', rodDark: '#828b94',
    solutionFill: 'rgba(200,212,222,0.10)', solutionTop: 'rgba(220,230,238,0.20)',
  },
  zn: {
    id: 'zn', symbol: 'Zn', name: 'Zinc', n: 2, ion: 'Zn²⁺', solution: 'ZnSO₄', eRed: -0.76,
    rodLight: '#cdd6df', rodBase: '#9aa7b4', rodDark: '#6b7884',
    solutionFill: 'rgba(173,216,222,0.14)', solutionTop: 'rgba(173,216,222,0.26)',
  },
  fe: {
    id: 'fe', symbol: 'Fe', name: 'Iron', n: 2, ion: 'Fe²⁺', solution: 'FeSO₄', eRed: -0.44,
    rodLight: '#c7ccd1', rodBase: '#8d949c', rodDark: '#5c636b',
    solutionFill: 'rgba(120,180,130,0.16)', solutionTop: 'rgba(150,205,160,0.26)',
  },
  ni: {
    id: 'ni', symbol: 'Ni', name: 'Nickel', n: 2, ion: 'Ni²⁺', solution: 'NiSO₄', eRed: -0.25,
    rodLight: '#d8dde2', rodBase: '#aeb6bf', rodDark: '#7c8893',
    solutionFill: 'rgba(90,190,150,0.16)', solutionTop: 'rgba(120,215,175,0.26)',
  },
  cu: {
    id: 'cu', symbol: 'Cu', name: 'Copper', n: 2, ion: 'Cu²⁺', solution: 'CuSO₄', eRed: 0.34,
    rodLight: '#e8a96b', rodBase: '#c8743a', rodDark: '#8f4f22',
    solutionFill: 'rgba(46,120,210,0.34)', solutionTop: 'rgba(96,165,235,0.42)',
  },
  ag: {
    id: 'ag', symbol: 'Ag', name: 'Silver', n: 1, ion: 'Ag⁺', solution: 'AgNO₃', eRed: 0.80,
    rodLight: '#eef1f4', rodBase: '#cfd5db', rodDark: '#9aa1a9',
    solutionFill: 'rgba(200,210,222,0.12)', solutionTop: 'rgba(220,228,238,0.24)',
  },
};

const ORDER: MetalId[] = ['mg', 'al', 'zn', 'fe', 'ni', 'cu', 'ag'];

// UI accent semantics (workflow §3)
const ANODE = '#fbbf24'; // oxidation / anode — amber
const CATHODE = '#34d399'; // reduction / cathode — emerald
const ELECTRON = '#818cf8'; // electrons — indigo
const NEG = '#818cf8';
const POS = '#f87171';

// ── Reaction chemistry ───────────────────────────────────────────────────────

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
function lcm(a: number, b: number): number { return (a * b) / gcd(a, b); }
// drop a leading coefficient of 1 ("1Zn" → "Zn")
const co = (k: number, f: string) => (k === 1 ? f : `${k}${f}`);

interface Reactions {
  metalRole: 'anode' | 'cathode';
  sheRole: 'anode' | 'cathode';
  electronDir: 'lr' | 'rl'; // external-wire electron direction (metal → SHE = lr)
  anodeLabel: string; // "Mg electrode" or "SHE (Pt | H₂)"
  cathodeLabel: string;
  anodeHalf: string;
  cathodeHalf: string;
  net: string;
  eCell: string; // e.g. "2.37"
  notation: string;
  verdict: string;
}

function buildReactions(m: Metal): Reactions {
  const n = m.n;
  const L = lcm(n, 2); // total electrons exchanged
  const kM = L / n; // metal-atom coefficient
  const kH2 = L / 2; // H₂ coefficient
  const eCell = Math.abs(m.eRed).toFixed(2);
  const sheLabel = 'SHE (Pt | H₂)';
  const metalLabel = `${m.symbol} electrode`;

  if (m.eRed < 0) {
    // metal is the ANODE, SHE is the CATHODE
    return {
      metalRole: 'anode', sheRole: 'cathode', electronDir: 'lr',
      anodeLabel: metalLabel, cathodeLabel: sheLabel,
      anodeHalf: `${co(kM, m.symbol)} → ${co(kM, m.ion)} + ${L}e⁻`,
      cathodeHalf: `${L}H⁺ + ${L}e⁻ → ${co(kH2, 'H₂')}`,
      net: `${co(kM, m.symbol)} + ${L}H⁺ → ${co(kM, m.ion)} + ${co(kH2, 'H₂')}`,
      eCell,
      notation: `${m.symbol} | ${m.ion} (1 M) || H⁺ (1 M) | H₂ (1 bar) | Pt`,
      verdict: `${m.name}'s reduction potential (${m.eRed.toFixed(2)} V) sits below the SHE's 0.00 V, so ${m.name.toLowerCase()} gives up electrons more readily than hydrogen. ${m.name} becomes the anode (−); the SHE is forced to be the cathode (+), where H⁺ ions collect those electrons and bubble off as H₂ gas. Electrons travel from ${m.symbol} to the platinum.`,
    };
  }
  // metal is the CATHODE, SHE is the ANODE
  return {
    metalRole: 'cathode', sheRole: 'anode', electronDir: 'rl',
    anodeLabel: sheLabel, cathodeLabel: metalLabel,
    anodeHalf: `${co(kH2, 'H₂')} → ${L}H⁺ + ${L}e⁻`,
    cathodeHalf: `${co(kM, m.ion)} + ${L}e⁻ → ${co(kM, m.symbol)}`,
    net: `${co(kH2, 'H₂')} + ${co(kM, m.ion)} → ${L}H⁺ + ${co(kM, m.symbol)}`,
    eCell,
    notation: `Pt | H₂ (1 bar) | H⁺ (1 M) || ${m.ion} (1 M) | ${m.symbol}`,
    verdict: `${m.name}'s reduction potential (+${m.eRed.toFixed(2)} V) sits above the SHE's 0.00 V, so ${m.ion} ions are reduced more readily than H⁺. ${m.name} becomes the cathode (+); the SHE is forced to be the anode (−), where H₂ gas is oxidised back to H⁺. Electrons travel from the platinum to ${m.symbol}.`,
  };
}

// ── SVG scene ────────────────────────────────────────────────────────────────

const M_CX = 250; // metal-rod centre x
const PT_CX = 630; // Pt-foil centre x

function CellScene({ m, r }: { m: Metal; r: Reactions }) {
  const metalSign = r.metalRole === 'anode' ? '−' : '+';
  const metalSignColor = r.metalRole === 'anode' ? NEG : POS;
  const ptSign = r.sheRole === 'anode' ? '−' : '+';
  const ptSignColor = r.sheRole === 'anode' ? NEG : POS;
  const lr = r.electronDir === 'lr';

  return (
    <svg width="100%" height="100%" viewBox="0 0 880 560" style={{ minHeight: 440 }}>
      <defs>
        <linearGradient id="she-rod" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={m.rodDark} />
          <stop offset="38%" stopColor={m.rodLight} />
          <stop offset="62%" stopColor={m.rodBase} />
          <stop offset="100%" stopColor={m.rodDark} />
        </linearGradient>
        <linearGradient id="she-sol-m" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={m.solutionTop} /><stop offset="100%" stopColor={m.solutionFill} />
        </linearGradient>
        <linearGradient id="she-sol-h" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(196,181,253,0.16)" /><stop offset="100%" stopColor="rgba(129,140,248,0.08)" />
        </linearGradient>
        <linearGradient id="she-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)" /><stop offset="15%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="85%" stopColor="rgba(255,255,255,0.02)" /><stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
        </linearGradient>
        <clipPath id="she-clip-l"><path d="M158 200 L322 200 L315 452 Q315 466 301 466 L172 466 Q158 466 158 452 Z" /></clipPath>
        <clipPath id="she-clip-r"><path d="M558 200 L722 200 L715 452 Q715 466 701 466 L572 466 Q558 466 558 452 Z" /></clipPath>
      </defs>

      {/* ── Top wire rail through the voltmeter ── */}
      <polyline points={`${M_CX},112 ${M_CX},70 406,70`} fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`474,70 ${PT_CX},70 ${PT_CX},112`} fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* electrons travelling along the rail — direction flips with the metal */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} transform="translate(0,70)">
          <g style={{ animation: `she-flow-${lr ? 'lr' : 'rl'} 3s linear infinite`, animationDelay: `${-i * 0.5}s` }}>
            <circle r="6.5" fill={ELECTRON} />
            <text fontSize="8" fontWeight="900" fill="#0d1117" textAnchor="middle" dominantBaseline="central">−</text>
          </g>
        </g>
      ))}
      {/* electron-direction caption */}
      {lr
        ? <text x="335" y="54" fontSize="11" fontWeight="800" fill={ELECTRON} textAnchor="middle">electrons →</text>
        : <text x="545" y="54" fontSize="11" fontWeight="800" fill={ELECTRON} textAnchor="middle">← electrons</text>}

      {/* ── Voltmeter ── */}
      <g transform="translate(440,70)">
        <circle r="34" fill="#0b0f15" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
        <text x="0" y="-8" fontSize="13" fontWeight="900" fill="#e2e8f0" textAnchor="middle" dominantBaseline="central">V</text>
        <text x="0" y="11" fontSize="13" fontWeight="900" fill="#fcd34d" textAnchor="middle" dominantBaseline="central" className="tabular-nums">{r.eCell} V</text>
      </g>

      {/* ── Salt bridge ── */}
      <path d="M300 250 C300 150 580 150 580 250" fill="none" stroke="#cbd5e1" strokeWidth="18" strokeLinecap="round" opacity="0.5" />
      <path d="M300 250 C300 150 580 150 580 250" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="18" strokeLinecap="round" />
      <text x="440" y="142" fontSize="11" fontWeight="700" fill="#94a3b8" textAnchor="middle">salt bridge (KCl)</text>

      {/* ── LEFT beaker — metal half-cell ── */}
      <g clipPath="url(#she-clip-l)"><rect x="156" y="236" width="168" height="230" fill="url(#she-sol-m)" /></g>
      <path d="M158 200 L322 200 L315 452 Q315 466 301 466 L172 466 Q158 466 158 452 Z" fill="url(#she-glass)" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinejoin="round" />
      {/* metal rod */}
      <rect x={M_CX - 22} y={112} width={44} height={300} rx="5" fill="url(#she-rod)" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
      <rect x={M_CX - 16} y={116} width={5} height={292} rx="2.5" fill="rgba(255,255,255,0.35)" />
      <text x={M_CX} y={132} fontSize="22" fontWeight="900" fill={metalSignColor} textAnchor="middle">{metalSign}</text>
      <text x={M_CX} y={486} fontSize="12" fontWeight="700" fill="#94a3b8" textAnchor="middle">1 M {m.ion} ({m.solution})</text>

      {/* ── RIGHT beaker — Standard Hydrogen Electrode ── */}
      <g clipPath="url(#she-clip-r)"><rect x="556" y="236" width="168" height="230" fill="url(#she-sol-h)" /></g>
      <path d="M558 200 L722 200 L715 452 Q715 466 701 466 L572 466 Q558 466 558 452 Z" fill="url(#she-glass)" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinejoin="round" />

      {/* inner gas tube around the Pt foil */}
      <rect x={PT_CX - 30} y={150} width={60} height={272} rx="14" fill="rgba(196,181,253,0.05)" stroke="rgba(196,181,253,0.30)" strokeWidth="2" />
      {/* H₂ inlet from the top */}
      <rect x={PT_CX - 6} y={92} width={12} height={64} rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(196,181,253,0.30)" strokeWidth="1.5" />
      <text x={PT_CX} y={86} fontSize="11" fontWeight="800" fill="#c4b5fd" textAnchor="middle">H₂ in (1 bar)</text>
      <path d={`M${PT_CX} 100 v40`} stroke="#c4b5fd" strokeWidth="2" markerEnd="url(#she-arrow)" fill="none" />
      <defs>
        <marker id="she-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#c4b5fd" />
        </marker>
      </defs>

      {/* Pt foil (platinised — dark, stippled) */}
      <rect x={PT_CX - 9} y={170} width={18} height={238} rx="3" fill="#2b2f36" stroke="#10141a" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <circle key={i} cx={PT_CX - 4 + (i % 2) * 8} cy={186 + i * 28} r="1.6" fill="#5b6470" />
      ))}
      <text x={PT_CX} y={132} fontSize="13" fontWeight="800" fill="#cbd5e1" textAnchor="middle">Pt foil</text>
      <text x={PT_CX} y={150} fontSize="22" fontWeight="900" fill={ptSignColor} textAnchor="middle">{ptSign}</text>

      {/* H₂ bubbles rising past the foil */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={`b${i}`} cx={PT_CX + (i % 2 === 0 ? -16 : 16)} cy={0} r={3 + (i % 3)}
          fill="none" stroke="rgba(196,181,253,0.55)" strokeWidth="1.3"
          style={{ animation: 'she-bubble 2.6s ease-in infinite', animationDelay: `${-i * 0.42}s`, transformBox: 'view-box' }} />
      ))}
      <text x={PT_CX} y={486} fontSize="12" fontWeight="700" fill="#94a3b8" textAnchor="middle">1 M H⁺ (HCl)</text>

      {/* ── Role tags under each electrode ── */}
      <g transform="translate(250,506)">
        <rect x="-62" y="-15" width="124" height="30" rx="9" fill={`${r.metalRole === 'anode' ? ANODE : CATHODE}1f`} stroke={r.metalRole === 'anode' ? ANODE : CATHODE} strokeWidth="1.3" />
        <text x="0" y="1" fontSize="11" fontWeight="900" fill={r.metalRole === 'anode' ? ANODE : CATHODE} textAnchor="middle" dominantBaseline="central" letterSpacing="0.5">
          {m.symbol} · {r.metalRole.toUpperCase()}
        </text>
      </g>
      <g transform="translate(630,506)">
        <rect x="-62" y="-15" width="124" height="30" rx="9" fill={`${r.sheRole === 'anode' ? ANODE : CATHODE}1f`} stroke={r.sheRole === 'anode' ? ANODE : CATHODE} strokeWidth="1.3" />
        <text x="0" y="1" fontSize="11" fontWeight="900" fill={r.sheRole === 'anode' ? ANODE : CATHODE} textAnchor="middle" dominantBaseline="central" letterSpacing="0.5">
          SHE · {r.sheRole.toUpperCase()}
        </text>
      </g>
    </svg>
  );
}

// ── Potential scale (HTML) ───────────────────────────────────────────────────

function PotentialScale({ active }: { active: MetalId }) {
  // map E° in [-2.5, +1.0] → 0..100%
  const pct = (e: number) => ((e + 2.5) / 3.5) * 100;
  return (
    <div className="rounded-2xl px-5 pt-4 pb-7" style={{ background: '#0b0f15', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>
        Standard reduction potential E° (V vs SHE)
      </div>
      <div className="flex justify-between mb-3 text-[10px]" style={{ color: '#64748b' }}>
        <span style={{ color: ANODE }}>← below 0 · metal is anode</span>
        <span style={{ color: CATHODE }}>above 0 · metal is cathode →</span>
      </div>
      <div className="relative" style={{ height: 60, marginTop: 8 }}>
        <div className="absolute" style={{ left: 0, right: 0, top: 10, height: 3, borderRadius: 3, background: `linear-gradient(to right, ${ANODE}, #475569 71%, ${CATHODE})` }} />
        {/* SHE zero tick at E°=0 → pct(0) */}
        <div className="absolute" style={{ left: `${pct(0)}%`, top: 2, transform: 'translateX(-50%)' }}>
          <div style={{ width: 2, height: 16, background: '#94a3b8', margin: '0 auto' }} />
          <div className="text-[9px] text-center mt-1" style={{ color: '#94a3b8' }}>0.00<br />SHE</div>
        </div>
        {ORDER.map((id) => {
          const mm = METALS[id];
          const isActive = id === active;
          const c = mm.eRed < 0 ? ANODE : CATHODE;
          return (
            <div key={id} className="absolute" style={{ left: `${pct(mm.eRed)}%`, top: 0, transform: 'translateX(-50%)', transition: 'all 0.3s ease' }}>
              <div style={{
                width: isActive ? 16 : 10, height: isActive ? 16 : 10, borderRadius: '50%',
                background: isActive ? c : 'rgba(255,255,255,0.15)',
                border: `2px solid ${isActive ? c : 'rgba(255,255,255,0.3)'}`,
                margin: '0 auto', boxShadow: isActive ? `0 0 12px ${c}` : 'none',
              }} />
              <div className="text-center mt-1 tabular-nums" style={{ fontSize: isActive ? 12 : 10, fontWeight: 800, color: isActive ? c : '#94a3b8' }}>{mm.symbol}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function StandardHydrogenElectrodeSim() {
  const [active, setActive] = useState<MetalId>('zn');
  const m = METALS[active];
  const r = buildReactions(m);

  const HalfRow = ({ label, role, eqn }: { label: string; role: 'anode' | 'cathode'; eqn: string }) => {
    const accent = role === 'anode' ? ANODE : CATHODE;
    return (
      <div className="rounded-xl px-3.5 py-3" style={{ background: `${accent}12`, border: `1px solid ${accent}45` }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: accent }}>
            {role === 'anode' ? 'Anode · oxidation' : 'Cathode · reduction'}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>{label}</span>
        </div>
        <div className="text-[15px] font-bold" style={{ color: '#e2e8f0' }}>{eqn}</div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 not-prose"
      style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, minHeight: '60vh', fontFamily: 'system-ui, sans-serif' }}>

      <style>{`
        @keyframes she-flow-lr { from{transform:translateX(255px)} to{transform:translateX(625px)} }
        @keyframes she-flow-rl { from{transform:translateX(625px)} to{transform:translateX(255px)} }
        @keyframes she-bubble  { 0%{transform:translateY(400px);opacity:0} 18%{opacity:.9} 90%{opacity:.9} 100%{transform:translateY(176px);opacity:0} }
      `}</style>

      {/* ── Header ── */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Standard Hydrogen Electrode <span style={{ color: '#7c3aed' }}>Builder</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
            Why the SHE flips between anode &amp; cathode · NCERT Class 12 Ch. 3
          </p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{ color: '#64748b' }}>
          {m.name} vs SHE
        </div>
      </div>

      {/* ── Metal selector (underline tabs §4g) ── */}
      <div className="flex mb-5 flex-wrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {ORDER.map((id) => {
          const mm = METALS[id];
          const isActive = id === active;
          const c = mm.eRed < 0 ? ANODE : CATHODE;
          return (
            <button key={id} onClick={() => setActive(id)}
              className="px-4 py-3 text-center transition-all"
              style={{ background: 'none', outline: 'none', borderBottom: `2px solid ${isActive ? c : 'rgba(255,255,255,0.06)'}`, opacity: isActive ? 1 : 0.5, marginBottom: -1 }}>
              <div className="text-sm font-black" style={{ color: isActive ? c : '#94a3b8' }}>{mm.symbol}</div>
              <div className="text-[10px] mt-0.5 tabular-nums" style={{ color: '#475569' }}>{mm.eRed > 0 ? '+' : ''}{mm.eRed.toFixed(2)}</div>
            </button>
          );
        })}
      </div>

      {/* ── Main grid: cell canvas + readout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-6">

        {/* Left — cell canvas */}
        <div className="relative overflow-hidden rounded-3xl"
          style={{ minHeight: 420, background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <CellScene m={m} r={r} />
          <div className="absolute top-3 left-4 flex gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(0,0,0,0.35)', color: '#fcd34d', border: '1px solid rgba(252,211,77,0.4)' }}>
              E°cell = {r.eCell} V
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(0,0,0,0.35)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.12)' }}>
              SHE is the {r.sheRole}
            </span>
          </div>
        </div>

        {/* Right — readout panel */}
        <div className="flex flex-col gap-3.5">

          <div>
            <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>
              Half-reactions &amp; complete cell reaction
            </div>
            <div className="flex flex-col gap-2.5">
              <HalfRow label={r.anodeLabel} role="anode" eqn={r.anodeHalf} />
              <HalfRow label={r.cathodeLabel} role="cathode" eqn={r.cathodeHalf} />
              <div className="rounded-xl px-3.5 py-3" style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(129,140,248,0.4)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#c4b5fd' }}>Net cell reaction</span>
                  <span className="text-[11px] font-black tabular-nums" style={{ color: '#fcd34d' }}>E°cell = {r.eCell} V</span>
                </div>
                <div className="text-[15px] font-bold" style={{ color: '#e2e8f0' }}>{r.net}</div>
              </div>
            </div>
          </div>

          {/* cell notation */}
          <div className="rounded-xl px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>Cell notation (anode | … || … | cathode)</div>
            <div className="text-[13px] font-bold" style={{ color: '#cbd5e1' }}>{r.notation}</div>
          </div>

          {/* verdict */}
          <div className="rounded-xl px-4 py-3.5" style={{ background: r.sheRole === 'cathode' ? 'rgba(251,191,36,0.07)' : 'rgba(52,211,153,0.07)', border: `1px solid ${r.metalRole === 'anode' ? ANODE : CATHODE}40` }}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: r.metalRole === 'anode' ? ANODE : CATHODE }}>
              What's happening
            </div>
            <p className="text-sm leading-snug" style={{ color: '#cbd5e1' }}>{r.verdict}</p>
          </div>

          <PotentialScale active={active} />
        </div>
      </div>

      {/* ── Expert Tip footer (§4j) ── */}
      <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert Tip</div>
        <p className="text-sm font-bold leading-snug italic text-white">
          &ldquo;The SHE is not &lsquo;always the cathode&rsquo; — it is just zero on the scale. Whichever electrode has the higher reduction potential is the cathode. Since E°cell = E°cathode − E°anode and the SHE contributes 0, the meter simply reads the size of the metal&rsquo;s own potential.&rdquo;
        </p>
      </div>
    </div>
  );
}
