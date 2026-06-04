'use client';

/**
 * Electrode Potential — Charge-at-the-Interface Explorer
 *
 * Academic source: NCERT Class 12 Chemistry, Chapter 3 (Electrochemistry).
 *  - Qualitative interface mechanism (verbatim idea): "there is a tendency of
 *    metal ions from the solution to deposit on the metal electrode trying to
 *    make it positively charged. At the same time, metal atoms of the electrode
 *    have a tendency to go into the solution as ions and leave behind the
 *    electrons at the electrode trying to make it negatively charged ... the
 *    electrode may be positively or negatively charged with respect to the
 *    solution depending on the tendencies of the two opposing reactions."
 *  - Standard reduction potentials (Table 3.1, vs SHE, 298 K):
 *      E°(Zn²⁺/Zn) = −0.76 V   (oxidation potential +0.76 V → rod tends NEGATIVE)
 *      E°(Cu²⁺/Cu) = +0.34 V   (rod tends POSITIVE)
 *      E°(Ag⁺/Ag)  = +0.80 V   (rod tends POSITIVE, most strongly)
 *
 * Pedagogical goal: a student picks Zn / Cu / Ag, dips the rod into a solution
 * of its OWN ions, and sees the two competing interfacial tendencies (dissolving
 * vs depositing). The dominant tendency decides whether the rod builds up
 * negative or positive charge. A potential scale shows that it is the RELATIVE
 * position in the electrochemical series — not the metal in isolation — that
 * sets the sign.
 */

import { useState } from 'react';

// ── Types & data ────────────────────────────────────────────────────────────

type MetalId = 'zn' | 'cu' | 'ag';

interface Metal {
  id: MetalId;
  symbol: string;
  name: string;
  ion: string; // pretty ion, e.g. 'Zn²⁺'
  solution: string; // e.g. 'ZnSO₄'
  oxHalf: string; // M → Mⁿ⁺ + ne⁻
  redHalf: string; // Mⁿ⁺ + ne⁻ → M
  eRed: number; // standard reduction potential / V (vs SHE)
  dominant: 'dissolve' | 'deposit';
  rodCharge: 'negative' | 'positive';
  dissolveCount: number; // amber ions leaving the rod
  depositCount: number; // emerald ions arriving at the rod
  chargeCount: number; // charge tokens shown on the rod
  // realistic apparatus colours (not UI accents)
  rodLight: string;
  rodBase: string;
  rodDark: string;
  solutionFill: string;
  solutionTop: string;
  verdict: string; // plain-English explanation of why
}

const METALS: Record<MetalId, Metal> = {
  zn: {
    id: 'zn', symbol: 'Zn', name: 'Zinc', ion: 'Zn²⁺', solution: 'ZnSO₄',
    oxHalf: 'Zn → Zn²⁺ + 2e⁻', redHalf: 'Zn²⁺ + 2e⁻ → Zn',
    eRed: -0.76, dominant: 'dissolve', rodCharge: 'negative',
    dissolveCount: 6, depositCount: 2, chargeCount: 5,
    rodLight: '#cdd6df', rodBase: '#9aa7b4', rodDark: '#6b7884',
    solutionFill: 'rgba(173,216,222,0.14)', solutionTop: 'rgba(173,216,222,0.26)',
    verdict: 'Zinc atoms are eager to dissolve, so dissolving wins. Electrons are left behind on the rod, and it builds up a negative charge.',
  },
  cu: {
    id: 'cu', symbol: 'Cu', name: 'Copper', ion: 'Cu²⁺', solution: 'CuSO₄',
    oxHalf: 'Cu → Cu²⁺ + 2e⁻', redHalf: 'Cu²⁺ + 2e⁻ → Cu',
    eRed: 0.34, dominant: 'deposit', rodCharge: 'positive',
    dissolveCount: 2, depositCount: 5, chargeCount: 4,
    rodLight: '#e8a96b', rodBase: '#c8743a', rodDark: '#8f4f22',
    solutionFill: 'rgba(46,120,210,0.34)', solutionTop: 'rgba(96,165,235,0.42)',
    verdict: 'Copper ions prefer to deposit rather than copper dissolving. Depositing ions pull electrons off the rod, so it builds up a positive charge.',
  },
  ag: {
    id: 'ag', symbol: 'Ag', name: 'Silver', ion: 'Ag⁺', solution: 'AgNO₃',
    oxHalf: 'Ag → Ag⁺ + e⁻', redHalf: 'Ag⁺ + e⁻ → Ag',
    eRed: 0.80, dominant: 'deposit', rodCharge: 'positive',
    dissolveCount: 1, depositCount: 7, chargeCount: 6,
    rodLight: '#eef1f4', rodBase: '#cfd5db', rodDark: '#9aa1a9',
    solutionFill: 'rgba(200,210,222,0.12)', solutionTop: 'rgba(220,228,238,0.24)',
    verdict: 'Silver ions deposit very strongly (they are the least eager to stay dissolved). They strip electrons from the rod, giving it a strong positive charge.',
  },
};

const ORDER: MetalId[] = ['zn', 'cu', 'ag'];

// charge palette (UI semantics, from workflow §3)
const NEG = '#818cf8'; // electrons / negative — indigo
const POS = '#f87171'; // positive — red
const OX = '#fbbf24'; // oxidation / dissolving — amber
const RED = '#34d399'; // reduction / depositing — emerald

// ── Particle layout helper ───────────────────────────────────────────────────

interface P { y: number; side: 'l' | 'r'; dur: number; delay: number; }

function buildParticles(count: number): P[] {
  const top = 250, bottom = 402;
  const arr: P[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const y = top + t * (bottom - top);
    const side: 'l' | 'r' = i % 2 === 0 ? 'l' : 'r';
    const dur = 2.4 + (i % 3) * 0.4;
    const delay = -(t * dur + i * 0.19);
    arr.push({ y, side, dur, delay });
  }
  return arr;
}

// ── SVG scene ────────────────────────────────────────────────────────────────

const ROD_L = 356, ROD_R = 404, ROD_CX = 380;

function BeakerScene({ m, showLayer }: { m: Metal; showLayer: boolean }) {
  const dissolve = buildParticles(m.dissolveCount);
  const deposit = buildParticles(m.depositCount);
  const isNeg = m.rodCharge === 'negative';
  const chargeColor = isNeg ? NEG : POS;
  const chargeGlyph = isNeg ? '−' : '+';
  const layerGlyph = isNeg ? '+' : '−';
  const layerColor = isNeg ? POS : NEG;

  return (
    <svg width="100%" height="100%" viewBox="0 0 760 540" style={{ minHeight: 420 }}>
      <defs>
        <linearGradient id="ep-rod" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={m.rodDark} />
          <stop offset="38%" stopColor={m.rodLight} />
          <stop offset="62%" stopColor={m.rodBase} />
          <stop offset="100%" stopColor={m.rodDark} />
        </linearGradient>
        <linearGradient id="ep-sol" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={m.solutionTop} />
          <stop offset="100%" stopColor={m.solutionFill} />
        </linearGradient>
        <linearGradient id="ep-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="14%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="86%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
        </linearGradient>
        <clipPath id="ep-beaker-clip">
          <path d="M252 168 L508 168 L500 486 Q500 502 484 502 L276 502 Q260 502 260 486 Z" />
        </clipPath>
      </defs>

      {/* solution + clipped contents */}
      <g clipPath="url(#ep-beaker-clip)">
        {/* solution body */}
        <rect x="250" y="232" width="260" height="276" fill="url(#ep-sol)" />
        {/* faint depth shading at bottom */}
        <rect x="250" y="430" width="260" height="80" fill="rgba(0,0,0,0.18)" />

        {/* double layer (toggle): opposite charges lining up beside the rod */}
        {showLayer && (
          <g style={{ animation: 'ep-pulse 2.6s ease-in-out infinite' }}>
            {[0, 1, 2, 3, 4].map((i) => {
              const y = 262 + i * 34;
              return (
                <g key={`dl-${i}`}>
                  <text x={ROD_L - 20} y={y} fontSize="15" fontWeight="800" fill={layerColor} textAnchor="middle" dominantBaseline="central">{layerGlyph}</text>
                  <text x={ROD_R + 20} y={y} fontSize="15" fontWeight="800" fill={layerColor} textAnchor="middle" dominantBaseline="central">{layerGlyph}</text>
                </g>
              );
            })}
          </g>
        )}

        {/* depositing ions (emerald) — arrive at the rod */}
        {deposit.map((p, i) => {
          const baseX = p.side === 'l' ? ROD_L : ROD_R;
          return (
            <g key={`dep-${i}`} transform={`translate(${baseX},${p.y})`}>
              <g style={{ animation: `ep-in-${p.side} ${p.dur}s linear infinite`, animationDelay: `${p.delay}s` }}>
                <circle r="16" fill="rgba(52,211,153,0.18)" stroke={RED} strokeWidth="1.5" />
                <text fontSize="10" fontWeight="800" fill={RED} textAnchor="middle" dominantBaseline="central">{m.ion}</text>
              </g>
            </g>
          );
        })}

        {/* dissolving ions (amber) — leave the rod into solution */}
        {dissolve.map((p, i) => {
          const baseX = p.side === 'l' ? ROD_L : ROD_R;
          return (
            <g key={`dis-${i}`} transform={`translate(${baseX},${p.y})`}>
              <g style={{ animation: `ep-out-${p.side} ${p.dur}s linear infinite`, animationDelay: `${p.delay}s` }}>
                <circle r="16" fill="rgba(251,191,36,0.18)" stroke={OX} strokeWidth="1.5" />
                <text fontSize="10" fontWeight="800" fill={OX} textAnchor="middle" dominantBaseline="central">{m.ion}</text>
              </g>
            </g>
          );
        })}
      </g>

      {/* glass walls (over the solution edge) */}
      <path d="M252 168 L508 168 L500 486 Q500 502 484 502 L276 502 Q260 502 260 486 Z"
        fill="url(#ep-glass)" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinejoin="round" />
      {/* meniscus / liquid surface line */}
      <path d="M261 232 Q380 224 499 232" fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="2" />
      {/* glass highlight */}
      <path d="M272 184 L268 478" fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth="3" strokeLinecap="round" />

      {/* the metal rod */}
      <g>
        {/* submerged + dry rod body */}
        <rect x={ROD_L} y="58" width={ROD_R - ROD_L} height="368" rx="6" fill="url(#ep-rod)" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
        {/* top terminal cap */}
        <rect x={ROD_L - 6} y="50" width={ROD_R - ROD_L + 12} height="14" rx="3" fill={m.rodDark} />
        {/* sheen highlight */}
        <rect x={ROD_L + 6} y="62" width="6" height="360" rx="3" fill="rgba(255,255,255,0.35)" />

        {/* charge tokens on the submerged rod */}
        {Array.from({ length: m.chargeCount }).map((_, i) => {
          const y = 256 + i * ((400 - 256) / Math.max(1, m.chargeCount - 1));
          return (
            <g key={`chg-${i}`} style={{ animation: 'ep-pulse 2s ease-in-out infinite', animationDelay: `${-i * 0.3}s` }}>
              <circle cx={ROD_CX} cy={y} r="9.5" fill={isNeg ? 'rgba(129,140,248,0.22)' : 'rgba(248,113,113,0.22)'} stroke={chargeColor} strokeWidth="1.5" />
              <text x={ROD_CX} y={y} fontSize="13" fontWeight="900" fill={chargeColor} textAnchor="middle" dominantBaseline="central">{chargeGlyph}</text>
            </g>
          );
        })}
      </g>

      {/* labels */}
      <text x={ROD_CX} y="38" fontSize="14" fontWeight="800" fill="#e2e8f0" textAnchor="middle">{m.symbol} electrode</text>
      <text x="380" y="528" fontSize="13" fontWeight="700" fill="#94a3b8" textAnchor="middle">{m.solution} solution</text>

      {/* charge verdict badge floating top-right of rod */}
      <g transform="translate(560,150)">
        <rect x="-86" y="-26" width="172" height="52" rx="12"
          fill={isNeg ? 'rgba(129,140,248,0.12)' : 'rgba(248,113,113,0.12)'}
          stroke={chargeColor} strokeWidth="1.5" />
        <text x="0" y="-7" fontSize="10" fontWeight="800" fill="#94a3b8" textAnchor="middle" letterSpacing="1.5">ROD CHARGE</text>
        <text x="0" y="13" fontSize="16" fontWeight="900" fill={chargeColor} textAnchor="middle">
          {chargeGlyph} {isNeg ? 'NEGATIVE' : 'POSITIVE'}
        </text>
      </g>
    </svg>
  );
}

// ── Potential scale (HTML) ───────────────────────────────────────────────────

function PotentialScale({ active }: { active: MetalId }) {
  // map E° in [-1.0, +1.0] → 0..100%
  const pct = (e: number) => ((e + 1.0) / 2.0) * 100;
  return (
    <div className="rounded-2xl px-5 pt-4 pb-6"
      style={{ background: '#0b0f15', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>
        Standard reduction potential E° (V vs SHE)
      </div>
      <div className="flex justify-between mb-3 text-[10px]" style={{ color: '#64748b' }}>
        <span style={{ color: NEG }}>← eager to dissolve · rod turns −</span>
        <span style={{ color: POS }}>ions eager to deposit · rod turns + →</span>
      </div>
      <div className="relative" style={{ height: 64, marginTop: 8 }}>
        {/* axis line */}
        <div className="absolute" style={{ left: 0, right: 0, top: 10, height: 3, borderRadius: 3, background: `linear-gradient(to right, ${NEG}, #475569 50%, ${POS})` }} />
        {/* SHE zero tick */}
        <div className="absolute" style={{ left: '50%', top: 2, transform: 'translateX(-50%)' }}>
          <div style={{ width: 2, height: 18, background: '#64748b', margin: '0 auto' }} />
          <div className="text-[9px] text-center mt-1" style={{ color: '#64748b' }}>0<br />SHE</div>
        </div>
        {ORDER.map((id) => {
          const m = METALS[id];
          const isActive = id === active;
          const c = m.rodCharge === 'negative' ? NEG : POS;
          return (
            <div key={id} className="absolute" style={{ left: `${pct(m.eRed)}%`, top: 0, transform: 'translateX(-50%)', transition: 'all 0.3s ease' }}>
              <div style={{
                width: isActive ? 18 : 12, height: isActive ? 18 : 12, borderRadius: '50%',
                background: isActive ? c : 'rgba(255,255,255,0.15)',
                border: `2px solid ${isActive ? c : 'rgba(255,255,255,0.3)'}`,
                margin: '0 auto', boxShadow: isActive ? `0 0 12px ${c}` : 'none',
              }} />
              <div className="text-center mt-1.5 tabular-nums" style={{ fontSize: isActive ? 12 : 11, fontWeight: 800, color: isActive ? c : '#94a3b8' }}>
                {m.symbol}
              </div>
              <div className="text-center tabular-nums text-[10px]" style={{ color: isActive ? '#cbd5e1' : '#64748b' }}>
                {m.eRed > 0 ? '+' : ''}{m.eRed.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ElectrodePotentialSim() {
  const [active, setActive] = useState<MetalId>('zn');
  const [showLayer, setShowLayer] = useState(false);
  const m = METALS[active];
  const isNeg = m.rodCharge === 'negative';
  const chargeColor = isNeg ? NEG : POS;

  const HalfRow = ({ label, eqn, accent, isDominant }: { label: string; eqn: string; accent: string; isDominant: boolean }) => (
    <div className="rounded-xl px-3.5 py-3" style={{
      background: isDominant ? `${accent}14` : 'rgba(255,255,255,0.02)',
      border: `1px solid ${isDominant ? `${accent}55` : 'rgba(255,255,255,0.07)'}`,
      transition: 'all 0.3s ease',
    }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: accent }}>{label}</span>
        {isDominant && (
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: `${accent}22`, color: accent }}>
            wins
          </span>
        )}
      </div>
      <div className="text-[15px] font-bold" style={{ color: isDominant ? '#e2e8f0' : '#64748b' }}>{eqn}</div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 not-prose"
      style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, minHeight: '60vh', fontFamily: 'system-ui, sans-serif' }}>

      <style>{`
        @keyframes ep-out-l { 0%{transform:translate(0,0);opacity:0} 14%{opacity:.95} 100%{transform:translate(-86px,48px);opacity:0} }
        @keyframes ep-out-r { 0%{transform:translate(0,0);opacity:0} 14%{opacity:.95} 100%{transform:translate(86px,48px);opacity:0} }
        @keyframes ep-in-l  { 0%{transform:translate(-90px,40px);opacity:0} 22%{opacity:.95} 82%{opacity:.95} 100%{transform:translate(0,0);opacity:0} }
        @keyframes ep-in-r  { 0%{transform:translate(90px,40px);opacity:0} 22%{opacity:.95} 82%{opacity:.95} 100%{transform:translate(0,0);opacity:0} }
        @keyframes ep-pulse { 0%,100%{opacity:.55} 50%{opacity:1} }
      `}</style>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Electrode Potential <span style={{ color: '#7c3aed' }}>Explorer</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
            Why a dipped rod turns + or − · NCERT Class 12 Ch. 3
          </p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{ color: '#64748b' }}>
          {m.name} in {m.solution}
        </div>
      </div>

      {/* ── Metal selector (underline tabs §4g) ─────────────────────────────── */}
      <div className="flex mb-5 flex-wrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {ORDER.map((id) => {
          const mm = METALS[id];
          const isActive = id === active;
          const c = mm.rodCharge === 'negative' ? NEG : POS;
          return (
            <button key={id} onClick={() => setActive(id)}
              className="px-5 py-3 text-center transition-all"
              style={{ background: 'none', outline: 'none', borderBottom: `2px solid ${isActive ? c : 'rgba(255,255,255,0.06)'}`, opacity: isActive ? 1 : 0.55, marginBottom: -1 }}>
              <div className="text-sm font-black" style={{ color: isActive ? c : '#94a3b8' }}>{mm.symbol}</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#475569' }}>{mm.solution}</div>
            </button>
          );
        })}
      </div>

      {/* ── Main grid: beaker + readout ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-6">

        {/* Left — beaker canvas */}
        <div className="relative overflow-hidden rounded-3xl"
          style={{ minHeight: 420, background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <BeakerScene m={m} showLayer={showLayer} />
          {/* legend */}
          <div className="absolute bottom-3 left-4 flex gap-4 text-[10px]" style={{ color: '#94a3b8' }}>
            <span className="flex items-center gap-1.5"><span style={{ width: 10, height: 10, borderRadius: '50%', background: 'transparent', border: `1.5px solid ${OX}`, display: 'inline-block' }} /> dissolving ({m.ion} out)</span>
            <span className="flex items-center gap-1.5"><span style={{ width: 10, height: 10, borderRadius: '50%', background: 'transparent', border: `1.5px solid ${RED}`, display: 'inline-block' }} /> depositing ({m.ion} in)</span>
          </div>
        </div>

        {/* Right — readout panel */}
        <div className="flex flex-col gap-3.5">

          <div>
            <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>
              Two tendencies competing at the surface
            </div>
            <div className="flex flex-col gap-2.5">
              <HalfRow label="Dissolving (oxidation)" eqn={m.oxHalf} accent={OX} isDominant={m.dominant === 'dissolve'} />
              <HalfRow label="Depositing (reduction)" eqn={m.redHalf} accent={RED} isDominant={m.dominant === 'deposit'} />
            </div>
          </div>

          {/* verdict */}
          <div className="rounded-xl px-4 py-3.5" style={{ background: isNeg ? 'rgba(129,140,248,0.08)' : 'rgba(248,113,113,0.08)', border: `1px solid ${chargeColor}40` }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: chargeColor }}>Result</span>
              <span className="text-[13px] font-black" style={{ color: chargeColor }}>
                Rod becomes {isNeg ? 'NEGATIVE (−)' : 'POSITIVE (+)'}
              </span>
            </div>
            <p className="text-sm leading-snug" style={{ color: '#cbd5e1' }}>{m.verdict}</p>
          </div>

          {/* double-layer toggle (§4f) */}
          <button onClick={() => setShowLayer((v) => !v)}
            className="self-start text-xs font-semibold transition-colors pb-0.5"
            style={{ color: showLayer ? '#fbbf24' : '#475569', borderBottom: `1px solid ${showLayer ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.1)'}`, background: 'none', outline: 'none' }}>
            {showLayer ? '✓ Showing the electrical double layer' : 'Show the electrical double layer'}
          </button>

          <PotentialScale active={active} />
        </div>
      </div>

      {/* ── Expert Tip footer (§4j) ─────────────────────────────────────────── */}
      <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert Tip</div>
        <p className="text-sm font-bold leading-snug italic text-white">
          &ldquo;The metal doesn&rsquo;t &lsquo;know&rsquo; it is positive or negative — the sign is just whichever tendency wins. Read it straight off the electrochemical series: the more negative the reduction potential, the more the rod wants to dissolve and go negative.&rdquo;
        </p>
      </div>
    </div>
  );
}
