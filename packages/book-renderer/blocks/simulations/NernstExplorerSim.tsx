'use client';

/**
 * Nernst Equation Explorer
 *
 * Academic source: NCERT Class 12 Chemistry, Chapter 3 (Electrochemistry).
 *  - Nernst equation at 298 K:  E_cell = E°_cell − (0.0591/n) · log Q,
 *    where 0.0591 V = 2.303 RT / F at 298 K.
 *  - Daniell cell  Zn | Zn²⁺ ‖ Cu²⁺ | Cu :  E°_cell = E°(Cu²⁺/Cu) − E°(Zn²⁺/Zn)
 *    = (+0.34) − (−0.76) = +1.10 V ; n = 2 ; Q = [Zn²⁺]/[Cu²⁺].
 *  - Concentration cell  Cu | Cu²⁺(c_L) ‖ Cu²⁺(c_R) | Cu :  E° = 0 ; n = 2 ;
 *    E_cell = (0.0591/2) · log(c_R / c_L)  →  0 as c_L → c_R.
 *  - Standard reduction potentials (NCERT Table 3.1, 298 K):
 *    E°(Cu²⁺/Cu) = +0.34 V, E°(Zn²⁺/Zn) = −0.76 V.
 *
 * Both modes collapse to the single relation  E = E° − (0.0591/n)·log(c_L/c_R),
 * with c_L the anode-ion concentration (left) and c_R the cathode-ion (right).
 *
 * Pedagogical goal: the student drags the two ion concentrations and watches Q,
 * the (0.0591/n)·log Q correction term and E_cell update live — seeing that for a
 * big-E° cell concentration only nudges the voltage, while a concentration cell is
 * driven *entirely* by the concentration difference and dies (E → 0) at equality.
 */

import { useState } from 'react';

// ── Constants & data ─────────────────────────────────────────────────────────

const NERNST_K = 0.0591; // V at 298 K (2.303 RT / F)

type Mode = 'daniell' | 'concentration';

interface Electrode {
  symbol: string;
  ion: string;
  solution: string;
  rodLight: string;
  rodBase: string;
  rodDark: string;
  ionFill: string; // dot colour
}

interface CellConfig {
  id: Mode;
  tab: string;
  tabSub: string;
  E0: number;
  n: number;
  anode: Electrode; // left
  cathode: Electrode; // right
  leftLabel: string; // slider label for c_L
  rightLabel: string; // slider label for c_R
  reaction: string;
  qExpr: string; // pretty Q expression, e.g. '[Zn²⁺] / [Cu²⁺]'
}

const ZN: Electrode = { symbol: 'Zn', ion: 'Zn²⁺', solution: 'ZnSO₄', rodLight: '#cdd6df', rodBase: '#9aa7b4', rodDark: '#6b7884', ionFill: 'rgba(173,216,222,0.9)' };
const CU: Electrode = { symbol: 'Cu', ion: 'Cu²⁺', solution: 'CuSO₄', rodLight: '#e8a96b', rodBase: '#c8743a', rodDark: '#8f4f22', ionFill: 'rgba(96,165,235,0.95)' };

const CELLS: Record<Mode, CellConfig> = {
  daniell: {
    id: 'daniell', tab: 'Daniell cell', tabSub: 'E° = 1.10 V', E0: 1.10, n: 2,
    anode: ZN, cathode: CU,
    leftLabel: '[Zn²⁺] (anode)', rightLabel: '[Cu²⁺] (cathode)',
    reaction: 'Zn + Cu²⁺ → Zn²⁺ + Cu',
    qExpr: '[Zn²⁺] / [Cu²⁺]',
  },
  concentration: {
    id: 'concentration', tab: 'Concentration cell', tabSub: 'E° = 0 V', E0: 0, n: 2,
    anode: { ...CU, solution: 'Cu²⁺ (dilute)' }, cathode: { ...CU, solution: 'Cu²⁺ (conc.)' },
    leftLabel: '[Cu²⁺] left (anode)', rightLabel: '[Cu²⁺] right (cathode)',
    reaction: 'Cu²⁺(conc.) → Cu²⁺(dilute)',
    qExpr: '[Cu²⁺]_anode / [Cu²⁺]_cathode',
  },
};

// UI accent semantics (workflow §3)
const POS = '#34d399'; // spontaneous / positive — emerald
const NEG = '#f87171'; // reversed / negative — red
const DEAD = '#94a3b8'; // equilibrium / zero
const ELECTRON = '#818cf8'; // electrons — indigo
const ACCENT = '#fbbf24'; // highlight — amber

// ── Helpers ──────────────────────────────────────────────────────────────────

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function prettyExp(eNotation: string): string {
  const m = eNotation.match(/^(-?[\d.]+)e([+-]?\d+)$/);
  if (!m) return eNotation;
  const expNum = parseInt(m[2], 10);
  if (expNum === 0) return m[1];
  const sup = String(Math.abs(expNum)).split('').map((d) => SUP[parseInt(d, 10)]).join('');
  return `${m[1]} × 10${expNum < 0 ? '⁻' : ''}${sup}`;
}
function fmtConc(c: number): string {
  return c >= 0.0995 ? c.toFixed(2) : c.toFixed(3);
}
function fmtQ(q: number): string {
  if (q >= 0.01 && q < 1000) {
    const s = q.toPrecision(3);
    return s.includes('.') ? s.replace(/\.?0+$/, '') : s;
  }
  return prettyExp(q.toExponential(2));
}

// Stacked fraction (workflow §2 — never use ÷)
function Frac({ num, den }: { num: React.ReactNode; den: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1.1, margin: '0 4px' }}>
      <span style={{ padding: '0 6px 2px 6px' }}>{num}</span>
      <span style={{ padding: '2px 6px 0 6px', borderTop: '1.5px solid currentColor', width: '100%', textAlign: 'center' }}>{den}</span>
    </span>
  );
}

// ── SVG scene ────────────────────────────────────────────────────────────────

function ionDots(count: number, cx: number, top: number, bottom: number, fill: string) {
  const dots: React.ReactNode[] = [];
  const cols = 3;
  const rows = Math.ceil(count / cols);
  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const x = cx - 26 + c * 26 + ((r % 2) * 13);
    const y = top + 14 + r * ((bottom - top - 24) / Math.max(1, rows - 1 || 1));
    dots.push(
      <circle key={i} cx={x} cy={Math.min(y, bottom - 10)} r="4.5" fill={fill}
        style={{ animation: 'nernst-bob 3s ease-in-out infinite', animationDelay: `${-(i % 5) * 0.5}s` }} />
    );
  }
  return dots;
}

function Scene({ cfg, cL, cR, E }: { cfg: CellConfig; cL: number; cR: number; E: number }) {
  const dir: 'lr' | 'rl' | 'none' = E > 0.0005 ? 'lr' : E < -0.0005 ? 'rl' : 'none';
  const nL = Math.round(2 + ((Math.log10(cL) + 3) / 3) * 12); // 2..14 dots
  const nR = Math.round(2 + ((Math.log10(cR) + 3) / 3) * 12);
  const Ecolor = dir === 'lr' ? POS : dir === 'rl' ? NEG : DEAD;

  return (
    <svg width="100%" height="100%" viewBox="0 0 760 540" style={{ minHeight: 420 }}>
      <defs>
        <linearGradient id="ne-rodL" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={cfg.anode.rodDark} /><stop offset="38%" stopColor={cfg.anode.rodLight} /><stop offset="62%" stopColor={cfg.anode.rodBase} /><stop offset="100%" stopColor={cfg.anode.rodDark} /></linearGradient>
        <linearGradient id="ne-rodR" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={cfg.cathode.rodDark} /><stop offset="38%" stopColor={cfg.cathode.rodLight} /><stop offset="62%" stopColor={cfg.cathode.rodBase} /><stop offset="100%" stopColor={cfg.cathode.rodDark} /></linearGradient>
        <linearGradient id="ne-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="rgba(255,255,255,0.10)" /><stop offset="15%" stopColor="rgba(255,255,255,0.02)" /><stop offset="85%" stopColor="rgba(255,255,255,0.02)" /><stop offset="100%" stopColor="rgba(255,255,255,0.08)" /></linearGradient>
        <clipPath id="ne-clip-l"><path d="M150 210 L314 210 L307 452 Q307 466 293 466 L164 466 Q150 466 150 452 Z" /></clipPath>
        <clipPath id="ne-clip-r"><path d="M446 210 L610 210 L603 452 Q603 466 589 466 L460 466 Q446 466 446 452 Z" /></clipPath>
      </defs>

      {/* top wire through the voltmeter */}
      <polyline points="232,118 232,72 318,72" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="442,72 528,72 528,118" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* electrons */}
      {dir !== 'none' && [0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform="translate(0,72)">
          <g style={{ animation: `nernst-flow-${dir} 2.8s linear infinite`, animationDelay: `${-i * 0.56}s` }}>
            <circle r="6" fill={ELECTRON} /><text fontSize="8" fontWeight="900" fill="#0d1117" textAnchor="middle" dominantBaseline="central">−</text>
          </g>
        </g>
      ))}
      {dir === 'lr' && <text x="380" y="58" fontSize="11" fontWeight="800" fill={ELECTRON} textAnchor="middle">electrons →</text>}
      {dir === 'rl' && <text x="380" y="58" fontSize="11" fontWeight="800" fill={ELECTRON} textAnchor="middle">← electrons</text>}
      {dir === 'none' && <text x="380" y="58" fontSize="11" fontWeight="800" fill={DEAD} textAnchor="middle">no flow — dead cell</text>}

      {/* voltmeter */}
      <g transform="translate(380,72)">
        <circle r="36" fill="#0b0f15" stroke={`${Ecolor}88`} strokeWidth="2.5" />
        <text x="0" y="-11" fontSize="12" fontWeight="900" fill="#94a3b8" textAnchor="middle" dominantBaseline="central">V</text>
        <text x="0" y="9" fontSize="15" fontWeight="900" fill={Ecolor} textAnchor="middle" dominantBaseline="central" className="tabular-nums">{E.toFixed(3)}</text>
        <text x="0" y="24" fontSize="8" fontWeight="700" fill="#64748b" textAnchor="middle">volts</text>
      </g>

      {/* salt bridge */}
      <path d="M290 250 C290 158 470 158 470 250" fill="none" stroke="#cbd5e1" strokeWidth="16" strokeLinecap="round" opacity="0.5" />
      <text x="380" y="150" fontSize="10.5" fontWeight="700" fill="#94a3b8" textAnchor="middle">salt bridge</text>

      {/* LEFT beaker (anode) */}
      <g clipPath="url(#ne-clip-l)">{ionDots(nL, 232, 250, 452, cfg.anode.ionFill)}</g>
      <path d="M150 210 L314 210 L307 452 Q307 466 293 466 L164 466 Q150 466 150 452 Z" fill="url(#ne-glass)" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x={232 - 20} y={118} width={40} height={296} rx="5" fill="url(#ne-rodL)" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
      <text x={232} y={108} fontSize="13" fontWeight="800" fill={cfg.anode.rodLight} textAnchor="middle">{cfg.anode.symbol}</text>
      <text x={232} y={138} fontSize="18" fontWeight="900" fill={NEG} textAnchor="middle">−</text>
      <text x={232} y={486} fontSize="11" fontWeight="700" fill="#94a3b8" textAnchor="middle">{fmtConc(cL)} M {cfg.anode.ion}</text>
      <text x={232} y={502} fontSize="9.5" fill="#64748b" textAnchor="middle">anode (oxidation)</text>

      {/* RIGHT beaker (cathode) */}
      <g clipPath="url(#ne-clip-r)">{ionDots(nR, 528, 250, 452, cfg.cathode.ionFill)}</g>
      <path d="M446 210 L610 210 L603 452 Q603 466 589 466 L460 466 Q446 466 446 452 Z" fill="url(#ne-glass)" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x={528 - 20} y={118} width={40} height={296} rx="5" fill="url(#ne-rodR)" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
      <text x={528} y={108} fontSize="13" fontWeight="800" fill={cfg.cathode.rodLight} textAnchor="middle">{cfg.cathode.symbol}</text>
      <text x={528} y={138} fontSize="18" fontWeight="900" fill={POS} textAnchor="middle">+</text>
      <text x={528} y={486} fontSize="11" fontWeight="700" fill="#94a3b8" textAnchor="middle">{fmtConc(cR)} M {cfg.cathode.ion}</text>
      <text x={528} y={502} fontSize="9.5" fill="#64748b" textAnchor="middle">cathode (reduction)</text>
    </svg>
  );
}

// ── Concentration slider ───────────────────────────────────────────────────────

function ConcSlider({ label, exp, onChange, color }: { label: string; exp: number; onChange: (v: number) => void; color: string }) {
  const c = Math.pow(10, exp);
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>{label}</span>
        <span className="text-[13px] font-black tabular-nums" style={{ color }}>{fmtConc(c)} M</span>
      </div>
      <input type="range" min={-3} max={0} step={0.05} value={exp}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full" style={{ accentColor: color }} />
      <div className="flex justify-between text-[9px] mt-0.5" style={{ color: '#475569' }}>
        <span>0.001 M</span><span>1 M</span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NernstExplorerSim() {
  const [mode, setMode] = useState<Mode>('daniell');
  const [expL, setExpL] = useState(0); // log10(c_L); 0 → 1 M
  const [expR, setExpR] = useState(0);
  const cfg = CELLS[mode];

  const cL = Math.pow(10, expL);
  const cR = Math.pow(10, expR);
  const Q = cL / cR;
  const logQ = expL - expR; // log10(c_L/c_R)
  const term = (NERNST_K / cfg.n) * logQ; // the (0.0591/n)·log Q correction
  const E = cfg.E0 - term;
  const state = E > 0.0005 ? 'spontaneous' : E < -0.0005 ? 'reversed' : 'equilibrium';
  const stateColor = state === 'spontaneous' ? POS : state === 'reversed' ? NEG : DEAD;
  const stateText =
    state === 'spontaneous' ? 'Spontaneous as written — the cell delivers current'
      : state === 'reversed' ? 'Negative EMF — the reaction would run backward'
        : mode === 'concentration' ? 'Equilibrium — concentrations equal, EMF has died to zero'
          : 'At equilibrium (E = 0): Q has reached K';

  const reset = () => { setExpL(0); setExpR(0); };

  return (
    <div className="p-4 md:p-6 not-prose" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, minHeight: '60vh', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        @keyframes nernst-flow-lr { from{transform:translateX(237px)} to{transform:translateX(523px)} }
        @keyframes nernst-flow-rl { from{transform:translateX(523px)} to{transform:translateX(237px)} }
        @keyframes nernst-bob { 0%,100%{transform:translateY(0);opacity:.85} 50%{transform:translateY(-4px);opacity:1} }
      `}</style>

      {/* Header */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">Nernst Equation <span style={{ color: '#7c3aed' }}>Explorer</span></h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>How concentration moves the cell voltage · NCERT Class 12 Ch. 3</p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{ color: '#64748b' }}>{cfg.tab}</div>
      </div>

      {/* Mode tabs (§4g) */}
      <div className="flex mb-5 flex-wrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {(Object.keys(CELLS) as Mode[]).map((id) => {
          const active = id === mode;
          return (
            <button key={id} onClick={() => { setMode(id); reset(); }}
              className="px-5 py-3 text-center transition-all"
              style={{ background: 'none', outline: 'none', borderBottom: `2px solid ${active ? '#818cf8' : 'rgba(255,255,255,0.06)'}`, opacity: active ? 1 : 0.55, marginBottom: -1 }}>
              <div className="text-sm font-black" style={{ color: active ? '#c4b5fd' : '#94a3b8' }}>{CELLS[id].tab}</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#475569' }}>{CELLS[id].tabSub}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-6">
        {/* canvas */}
        <div className="relative overflow-hidden rounded-3xl" style={{ minHeight: 420, background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <Scene cfg={cfg} cL={cL} cR={cR} E={E} />
          <div className="absolute top-3 left-4">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.35)', color: stateColor, border: `1px solid ${stateColor}55` }}>
              E_cell = {E.toFixed(3)} V
            </span>
          </div>
        </div>

        {/* readout + sliders */}
        <div className="flex flex-col gap-4">
          {/* The live Nernst equation */}
          <div className="rounded-2xl px-4 py-4" style={{ background: '#0b0f15', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-2.5" style={{ color: '#94a3b8' }}>The Nernst equation, live</div>
            <div className="flex items-center flex-wrap text-[15px] font-bold" style={{ color: '#e2e8f0' }}>
              <span style={{ color: stateColor }}>E</span>
              <span className="mx-1.5">=</span>
              <span>{cfg.E0.toFixed(2)}</span>
              <span className="mx-1.5">−</span>
              <Frac num={NERNST_K.toString()} den={cfg.n.toString()} />
              <span className="ml-1">log&nbsp;</span>
              <Frac num={`${fmtConc(cL)}`} den={`${fmtConc(cR)}`} />
            </div>
            {/* breakdown */}
            <div className="mt-3 space-y-1.5 text-[13px] tabular-nums">
              <div className="flex justify-between"><span style={{ color: '#64748b' }}>E° (standard)</span><span style={{ color: '#cbd5e1' }}>{cfg.E0.toFixed(3)} V</span></div>
              <div className="flex justify-between"><span style={{ color: '#64748b' }}>Q = {cfg.qExpr}</span><span style={{ color: '#cbd5e1' }}>{fmtQ(Q)}</span></div>
              <div className="flex justify-between"><span style={{ color: '#64748b' }}>correction −(0.0591/{cfg.n})·log Q</span><span style={{ color: term > 0 ? NEG : term < 0 ? POS : DEAD }}>{term >= 0 ? '−' : '+'}{Math.abs(term).toFixed(3)} V</span></div>
              <div className="flex justify-between pt-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}><span className="font-black" style={{ color: '#94a3b8' }}>E_cell</span><span className="font-black" style={{ color: stateColor }}>{E.toFixed(3)} V</span></div>
            </div>
          </div>

          {/* sliders */}
          <div className="flex flex-col gap-3.5">
            <ConcSlider label={cfg.leftLabel} exp={expL} onChange={setExpL} color="#c4b5fd" />
            <ConcSlider label={cfg.rightLabel} exp={expR} onChange={setExpR} color={mode === 'daniell' ? '#60a5eb' : '#34d399'} />
          </div>

          {/* state verdict */}
          <div className="rounded-xl px-4 py-3" style={{ background: `${stateColor}12`, border: `1px solid ${stateColor}40` }}>
            <p className="text-sm leading-snug" style={{ color: '#cbd5e1' }}>{stateText}</p>
          </div>

          <button onClick={reset} className="self-start flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all" style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(129,140,248,0.3)', color: '#a5b4fc' }}>↺ Reset to 1 M / 1 M (standard)</button>
        </div>
      </div>

      {/* Expert Tip (§4j) */}
      <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert Tip</div>
        <p className="text-sm font-bold leading-snug italic text-white">
          {mode === 'daniell'
            ? '“With a big E° like 1.10 V, concentration only nudges the voltage by a few hundredths of a volt — you can’t drive a Daniell cell to 0 V by changing concentrations. E° dominates.”'
            : '“Same metal on both sides means E° = 0, so the voltage comes purely from the log of the concentration ratio. Make the two concentrations equal and the EMF dies to exactly zero — that’s a concentration cell.”'}
        </p>
      </div>
    </div>
  );
}
