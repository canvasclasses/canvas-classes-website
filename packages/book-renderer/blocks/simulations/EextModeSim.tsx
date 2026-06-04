'use client';

/**
 * External-EMF Mode Flipper — galvanic ↔ electrolytic
 *
 * Academic source: NCERT Class 12 Chemistry, Chapter 3 (Electrochemistry),
 * Daniell-cell-with-external-EMF analysis:
 *   - E_ext < 1.1 V → galvanic: electrons flow Zn → Cu; Zn dissolves (anode),
 *     Cu deposits (cathode).
 *   - E_ext = 1.1 V → no current flows (I = 0); no chemical change.
 *   - E_ext > 1.1 V → electrolytic: electrons flow Cu → Zn; Zn²⁺ deposits on
 *     the zinc electrode, copper dissolves at the copper electrode.
 * Reasoning shown to students: the external source is wired to OPPOSE the cell,
 * so the physical polarity is preserved — the zinc side stays negative and the
 * copper side stays positive. What flips is the ROLE (anode↔cathode), the
 * electron-flow direction, and which electrode dissolves vs deposits. This is
 * consistent with the per-mode sign convention (galvanic: anode −, cathode +;
 * electrolytic: anode +, cathode −).
 */

import { useState } from 'react';

type Regime = 'galvanic' | 'balanced' | 'electrolytic';
const CELL_EMF = 1.1;
const TOL = 0.06;

const ZN_L = '#cdd6df', ZN_B = '#9aa7b4', ZN_D = '#6b7884';
const CU_L = '#e8a96b', CU_B = '#c8743a', CU_D = '#8f4f22';
const SOL_ZN = 'rgba(173,216,222,0.14)', SOL_ZN_T = 'rgba(173,216,222,0.26)';
const SOL_CU = 'rgba(46,120,210,0.34)', SOL_CU_T = 'rgba(96,165,235,0.42)';
const ELECTRON = '#818cf8';
const GAL = '#34d399', BAL = '#94a3b8', ELY = '#8b5cf6';

const REGIME_META: Record<Regime, { label: string; accent: string; current: string; body: string }> = {
  galvanic: {
    label: 'GALVANIC', accent: GAL, current: 'flows · Zn → Cu',
    body: 'The cell wins. It pushes electrons out from zinc to copper through the wire — zinc dissolves at the anode, copper deposits at the cathode. The cell is delivering energy, just like a battery.',
  },
  balanced: {
    label: 'BALANCED · I = 0', accent: BAL, current: 'no flow (I = 0)',
    body: 'The external voltage exactly cancels the cell\'s 1.1 V. No net push, so no electrons move and nothing happens at either electrode. This standoff is how a cell\'s true EMF is measured without drawing current.',
  },
  electrolytic: {
    label: 'ELECTROLYTIC', accent: ELY, current: 'forced · Cu → Zn',
    body: 'The external source overpowers the cell and forces everything backwards. Electrons are pushed from copper to zinc — now zinc²⁺ deposits on the zinc electrode and copper dissolves. The cell is being charged.',
  },
};

function regimeOf(eext: number): Regime {
  if (Math.abs(eext - CELL_EMF) <= TOL) return 'balanced';
  return eext < CELL_EMF ? 'galvanic' : 'electrolytic';
}

function Electrode({ x, gradId, metal, role, sign, chem, accent, dim }: {
  x: number; gradId: string; metal: string; role: string; sign: string; chem: string; accent: string; dim: boolean;
}) {
  return (
    <g style={{ opacity: dim ? 0.85 : 1 }}>
      <rect x={x - 22} y={120} width={44} height={282} rx="5" fill={`url(#${gradId})`} stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
      <rect x={x - 16} y={124} width={5} height={274} rx="2.5" fill="rgba(255,255,255,0.35)" />
      {/* sign chip */}
      <g transform={`translate(${x},150)`}>
        <circle r="13" fill={sign === '−' ? 'rgba(129,140,248,0.25)' : 'rgba(248,113,113,0.25)'} stroke={sign === '−' ? '#818cf8' : '#f87171'} strokeWidth="1.5" />
        <text fontSize="16" fontWeight="900" fill={sign === '−' ? '#818cf8' : '#f87171'} textAnchor="middle" dominantBaseline="central">{sign}</text>
      </g>
      <text x={x} y={108} fontSize="13" fontWeight="800" fill="#e2e8f0" textAnchor="middle">{metal}</text>
      {/* role badge */}
      <g transform={`translate(${x},420)`}>
        <rect x="-46" y="-13" width="92" height="26" rx="8" fill={`${accent}1c`} stroke={`${accent}66`} strokeWidth="1.2" />
        <text fontSize="11" fontWeight="900" fill={accent} textAnchor="middle" dominantBaseline="central" letterSpacing="1">{role}</text>
      </g>
      <text x={x} y={452} fontSize="11" fontWeight="600" fill="#94a3b8" textAnchor="middle">{chem}</text>
    </g>
  );
}

function Scene({ eext, regime }: { eext: number; regime: Regime }) {
  const dir = regime === 'galvanic' ? 'lr' : regime === 'electrolytic' ? 'rl' : 'none';
  const meta = REGIME_META[regime];
  // role/chemistry per electrode
  const zn = regime === 'galvanic'
    ? { role: 'ANODE', chem: 'dissolving · Zn → Zn²⁺' }
    : regime === 'electrolytic'
      ? { role: 'CATHODE', chem: 'depositing · Zn²⁺ → Zn' }
      : { role: '—', chem: 'no change' };
  const cu = regime === 'galvanic'
    ? { role: 'CATHODE', chem: 'depositing · Cu²⁺ → Cu' }
    : regime === 'electrolytic'
      ? { role: 'ANODE', chem: 'dissolving · Cu → Cu²⁺' }
      : { role: '—', chem: 'no change' };

  return (
    <svg width="100%" height="100%" viewBox="0 0 880 560" style={{ minHeight: 440 }}>
      <defs>
        <linearGradient id="ex-zn" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={ZN_D} /><stop offset="38%" stopColor={ZN_L} /><stop offset="62%" stopColor={ZN_B} /><stop offset="100%" stopColor={ZN_D} /></linearGradient>
        <linearGradient id="ex-cu" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={CU_D} /><stop offset="38%" stopColor={CU_L} /><stop offset="62%" stopColor={CU_B} /><stop offset="100%" stopColor={CU_D} /></linearGradient>
        <linearGradient id="ex-sol-zn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={SOL_ZN_T} /><stop offset="100%" stopColor={SOL_ZN} /></linearGradient>
        <linearGradient id="ex-sol-cu" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={SOL_CU_T} /><stop offset="100%" stopColor={SOL_CU} /></linearGradient>
        <linearGradient id="ex-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="rgba(255,255,255,0.10)" /><stop offset="15%" stopColor="rgba(255,255,255,0.02)" /><stop offset="85%" stopColor="rgba(255,255,255,0.02)" /><stop offset="100%" stopColor="rgba(255,255,255,0.08)" /></linearGradient>
      </defs>

      {/* top wire rail with external battery in the middle */}
      <polyline points="250,120 250,60 360,60" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="520,60 630,60 630,120" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* external battery box */}
      <g transform="translate(440,60)">
        <rect x="-58" y="-26" width="116" height="52" rx="9" fill="rgba(0,0,0,0.4)" stroke={meta.accent} strokeWidth="1.6" />
        <text x="0" y="-8" fontSize="9" fontWeight="800" fill="#94a3b8" textAnchor="middle" letterSpacing="1">EXTERNAL EMF</text>
        <text x="0" y="13" fontSize="17" fontWeight="900" fill={meta.accent} textAnchor="middle" className="tabular-nums">{eext.toFixed(2)} V</text>
        {/* battery terminals: + on the Cu(right) side, − on the Zn(left) side (opposing the cell) */}
        <text x="-70" y="4" fontSize="14" fontWeight="900" fill="#818cf8" textAnchor="middle">−</text>
        <text x="70" y="4" fontSize="14" fontWeight="900" fill="#f87171" textAnchor="middle">+</text>
      </g>

      {/* ammeter */}
      <g transform="translate(310,60)">
        <circle r="15" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        <text fontSize="12" fontWeight="900" fill="#94a3b8" textAnchor="middle" dominantBaseline="central">A</text>
      </g>

      {/* electrons on the rail (skip when balanced) */}
      {dir !== 'none' && [0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform="translate(255,60)">
          <g style={{ animation: `ex-${dir} 2.4s linear infinite`, animationDelay: `${-i * 0.48}s` }}>
            <circle r="6.5" fill={ELECTRON} />
            <text fontSize="8" fontWeight="900" fill="#0d1117" textAnchor="middle" dominantBaseline="central">−</text>
          </g>
        </g>
      ))}
      <text x="350" y="44" fontSize="11" fontWeight="700" fill={dir === 'none' ? '#64748b' : ELECTRON} textAnchor="middle">
        {dir === 'lr' ? 'electrons →' : dir === 'rl' ? '← electrons' : 'no electron flow'}
      </text>

      {/* LEFT beaker — Zn | ZnSO4 */}
      <clipPath id="ex-clip-l"><path d="M158 200 L322 200 L315 452 Q315 466 301 466 L172 466 Q158 466 158 452 Z" /></clipPath>
      <g clipPath="url(#ex-clip-l)"><rect x="156" y="236" width="168" height="230" fill="url(#ex-sol-zn)" /></g>
      <path d="M158 200 L322 200 L315 452 Q315 466 301 466 L172 466 Q158 466 158 452 Z" fill="url(#ex-glass)" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinejoin="round" />
      <Electrode x={250} gradId="ex-zn" metal="Zn" role={zn.role} sign="−" chem={zn.chem} accent={meta.accent} dim={regime === 'balanced'} />
      <text x="240" y="486" fontSize="12" fontWeight="700" fill="#94a3b8" textAnchor="middle">ZnSO₄ (1 M)</text>

      {/* RIGHT beaker — Cu | CuSO4 */}
      <clipPath id="ex-clip-r"><path d="M558 200 L722 200 L715 452 Q715 466 701 466 L572 466 Q558 466 558 452 Z" /></clipPath>
      <g clipPath="url(#ex-clip-r)"><rect x="556" y="236" width="168" height="230" fill="url(#ex-sol-cu)" /></g>
      <path d="M558 200 L722 200 L715 452 Q715 466 701 466 L572 466 Q558 466 558 452 Z" fill="url(#ex-glass)" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinejoin="round" />
      <Electrode x={630} gradId="ex-cu" metal="Cu" role={cu.role} sign="+" chem={cu.chem} accent={meta.accent} dim={regime === 'balanced'} />
      <text x="640" y="486" fontSize="12" fontWeight="700" fill="#94a3b8" textAnchor="middle">CuSO₄ (1 M)</text>

      {/* salt bridge */}
      <path d="M300 250 C300 150 580 150 580 250" fill="none" stroke="#cbd5e1" strokeWidth="18" strokeLinecap="round" opacity="0.8" />
      <text x="440" y="158" fontSize="11" fontWeight="700" fill="#94a3b8" textAnchor="middle">salt bridge</text>
    </svg>
  );
}

export default function EextModeSim() {
  const [eext, setEext] = useState(0.5);
  const regime = regimeOf(eext);
  const meta = REGIME_META[regime];
  const net = eext - CELL_EMF;

  return (
    <div className="p-4 md:p-6 not-prose" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, minHeight: '60vh', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        @keyframes ex-lr { from{transform:translateX(0)} to{transform:translateX(370px)} }
        @keyframes ex-rl { from{transform:translateX(370px)} to{transform:translateX(0)} }
        input[type=range].ex-slider { -webkit-appearance:none; appearance:none; height:6px; border-radius:6px; outline:none; }
        input[type=range].ex-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:22px; height:22px; border-radius:50%; background:#c4b5fd; border:3px solid #6366f1; cursor:pointer; }
        input[type=range].ex-slider::-moz-range-thumb { width:22px; height:22px; border-radius:50%; background:#c4b5fd; border:3px solid #6366f1; cursor:pointer; }
      `}</style>

      {/* Header */}
      <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">External EMF <span style={{ color: '#7c3aed' }}>Mode Flipper</span></h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>Galvanic ↔ electrolytic across 1.1 V · NCERT Class 12 Ch. 3</p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{ color: meta.accent }}>{meta.label}</div>
      </div>

      {/* Slider */}
      <div className="rounded-2xl px-5 py-4 mb-5" style={{ background: '#0b0f15', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>External battery voltage</span>
          <span className="text-lg font-black tabular-nums" style={{ color: meta.accent }}>{eext.toFixed(2)} V</span>
        </div>
        <input type="range" min={0} max={2} step={0.01} value={eext} onChange={(e) => setEext(parseFloat(e.target.value))}
          className="ex-slider w-full"
          style={{ background: `linear-gradient(to right, ${GAL} 0%, ${GAL} ${(CELL_EMF / 2) * 100 - 3}%, ${BAL} ${(CELL_EMF / 2) * 100}%, ${ELY} ${(CELL_EMF / 2) * 100 + 3}%, ${ELY} 100%)` }} />
        <div className="relative mt-1 text-[10px]" style={{ color: '#64748b' }}>
          <span className="absolute left-0">0 V</span>
          <span className="absolute" style={{ left: `${(CELL_EMF / 2) * 100}%`, transform: 'translateX(-50%)', color: BAL, fontWeight: 800 }}>↑ 1.10 V (cell EMF)</span>
          <span className="absolute right-0">2 V</span>
        </div>
      </div>

      {/* Canvas + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-6">
        <div className="relative overflow-hidden rounded-3xl" style={{ minHeight: 440, background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: `1px solid ${meta.accent}33` }}>
          <Scene eext={eext} regime={regime} />
          <div className="absolute top-3 left-4">
            <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: `${meta.accent}1c`, color: meta.accent, border: `1px solid ${meta.accent}66` }}>{meta.label}</span>
          </div>
        </div>

        <div className="flex flex-col py-1 gap-4">
          {/* opposing EMFs readout */}
          <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: '#94a3b8' }}>Cell EMF</span><span className="font-bold tabular-nums" style={{ color: '#e2e8f0' }}>1.10 V</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span style={{ color: '#94a3b8' }}>External (opposing)</span><span className="font-bold tabular-nums" style={{ color: meta.accent }}>{eext.toFixed(2)} V</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1 pt-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: '#94a3b8' }}>Net push</span>
              <span className="font-black tabular-nums" style={{ color: meta.accent }}>
                {Math.abs(net) < TOL ? '0 — balanced' : net < 0 ? `${Math.abs(net).toFixed(2)} V forward` : `${net.toFixed(2)} V reverse`}
              </span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: meta.accent }}>{meta.label} · current {meta.current}</div>
            <p className="text-base leading-snug" style={{ color: '#cbd5e1' }}>{meta.body}</p>
          </div>

          {/* the key insight */}
          <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.3)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#818cf8' }}>Watch the signs</div>
            <p className="text-sm leading-snug" style={{ color: '#cbd5e1' }}>Zinc stays <span style={{ color: '#818cf8', fontWeight: 800 }}>−</span> and copper stays <span style={{ color: '#f87171', fontWeight: 800 }}>+</span> the whole time. What flips as you cross 1.1 V is the <b style={{ color: '#e2e8f0' }}>role</b> (anode↔cathode), the <b style={{ color: '#e2e8f0' }}>electron direction</b>, and which electrode dissolves vs deposits.</p>
          </div>

          <div className="mt-auto pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert Tip</div>
            <p className="text-sm font-bold leading-snug italic text-white">&ldquo;Oxidation is always at the anode and reduction always at the cathode — even here. Crossing 1.1 V doesn&rsquo;t break that rule; it just swaps which metal plays each part.&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  );
}
