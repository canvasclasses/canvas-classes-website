'use client';

/**
 * Daniell Cell Builder — three-stage discovery
 *
 * Academic source: NCERT Class 12 Chemistry, Chapter 3 (Electrochemistry).
 *  - Direct Zn-in-CuSO₄: spontaneous redox (Zn + Cu²⁺ → Zn²⁺ + Cu) but the
 *    energy is released as heat; electrons transfer at the metal surface and
 *    are not available as useful current.
 *  - Daniell cell: Zn|ZnSO₄ anode and Cu|CuSO₄ cathode in separate beakers,
 *    joined by a salt bridge; ~1.1 V when both solutions are 1 M (298 K).
 *  - Salt-bridge functions (NCERT): completes the circuit, maintains electrical
 *    neutrality in the two half-cells (preventing the charge build-up that
 *    would otherwise stop the reaction).
 *
 * Pedagogical goal: let the student watch WHY each piece is needed — a single
 * beaker can't light a bulb, two beakers without a bridge stall as charge
 * builds, and only the salt bridge completes a steady working cell.
 */

import { useState } from 'react';

type Phase = 'single' | 'no-bridge' | 'with-bridge';

const STEPS: { id: Phase; label: string }[] = [
  { id: 'single', label: '1 Beaker' },
  { id: 'no-bridge', label: '2 Beakers · No Bridge' },
  { id: 'with-bridge', label: '+ Salt Bridge' },
];

const ACCENT: Record<Phase, string> = { single: '#f87171', 'no-bridge': '#fbbf24', 'with-bridge': '#34d399' };

const PHASE_INFO: Record<Phase, { title: string; body: string; bulb: string; current: string; bulbState: 'off' | 'flicker' | 'on' }> = {
  single: {
    title: 'Stage 1 — One beaker',
    body: 'A zinc rod sits directly in copper sulfate. The reaction is spontaneous — copper plates onto the zinc and the blue slowly fades — but the electrons jump straight to Cu²⁺ ions right at the metal surface. They never travel through the wire, so the energy escapes as heat.',
    bulb: 'OFF', current: 'none (energy lost as heat)', bulbState: 'off',
  },
  'no-bridge': {
    title: 'Stage 2 — Two beakers, no salt bridge',
    body: 'Split the half-reactions into separate beakers and wire them through the bulb. For an instant electrons flow — but Zn²⁺ piles up in the left beaker (going +) and SO₄²⁻ is left behind in the right (going −). Nature blocks this charge build-up, so the reaction stalls almost at once.',
    bulb: 'OFF', current: 'stalls → 0', bulbState: 'off',
  },
  'with-bridge': {
    title: 'Stage 3 — Add the salt bridge',
    body: 'The salt bridge feeds ions into each beaker — anions to the zinc side, cations to the copper side — cancelling the charge build-up and completing the circuit. Electrons now flow steadily from zinc to copper, and the bulb glows and keeps glowing.',
    bulb: 'GLOWING', current: 'steady (~1.1 V at 1 M)', bulbState: 'on',
  },
};

// realistic apparatus colours
const ZN_L = '#cdd6df', ZN_B = '#9aa7b4', ZN_D = '#6b7884';
const CU_L = '#e8a96b', CU_B = '#c8743a', CU_D = '#8f4f22';
const SOL_ZN = 'rgba(173,216,222,0.14)', SOL_ZN_T = 'rgba(173,216,222,0.26)';
const SOL_CU = 'rgba(46,120,210,0.34)', SOL_CU_T = 'rgba(96,165,235,0.42)';
const ELECTRON = '#818cf8', POS = '#f87171', NEG = '#818cf8', OK = '#34d399', AMBER = '#fbbf24';

function GlowBulb({ x, y, state }: { x: number; y: number; state: 'off' | 'flicker' | 'on' }) {
  const on = state === 'on';
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r="50" fill="url(#dc-glow)" style={{ opacity: on ? 1 : state === 'flicker' ? 0.3 : 0, transition: 'opacity 0.4s ease' }} />
      <circle r="20" fill={on ? 'rgba(251,191,36,0.9)' : 'rgba(255,255,255,0.05)'} stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
      <path d="M-8 7 Q-3 -9 0 4 Q3 -9 8 7" fill="none" stroke={on ? '#fff7e0' : '#64748b'} strokeWidth="2.2" />
      <rect x="-9" y="19" width="18" height="11" rx="2" fill="#475569" />
    </g>
  );
}

// a metal electrode bar with metallic gradient
function Electrode({ x, gradId, label, labelColor, sign }: { x: number; gradId: string; label: string; labelColor: string; sign?: string }) {
  return (
    <g>
      <rect x={x - 22} y={120} width={44} height={282} rx="5" fill={`url(#${gradId})`} stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
      <rect x={x - 16} y={124} width={5} height={274} rx="2.5" fill="rgba(255,255,255,0.35)" />
      <text x={x} y={108} fontSize="14" fontWeight="800" fill={labelColor} textAnchor="middle">{label}</text>
      {sign && <text x={x} y={150} fontSize="22" fontWeight="900" fill={labelColor} textAnchor="middle">{sign}</text>}
    </g>
  );
}

// charge badge above a beaker
function ChargeBadge({ x, kind }: { x: number; kind: 'pos' | 'neg' | 'ok' }) {
  const cfg = kind === 'pos'
    ? { c: POS, t: 'BUILDING +', bg: 'rgba(248,113,113,0.12)' }
    : kind === 'neg'
      ? { c: NEG, t: 'BUILDING −', bg: 'rgba(129,140,248,0.12)' }
      : { c: OK, t: 'NEUTRAL ✓', bg: 'rgba(52,211,153,0.12)' };
  return (
    <g transform={`translate(${x},452)`}>
      <rect x="-58" y="-15" width="116" height="30" rx="9" fill={cfg.bg} stroke={cfg.c} strokeWidth="1.3" />
      <text x="0" y="1" fontSize="11" fontWeight="800" fill={cfg.c} textAnchor="middle" dominantBaseline="central" letterSpacing="0.5">{cfg.t}</text>
    </g>
  );
}

function Scene({ phase }: { phase: Phase }) {
  const info = PHASE_INFO[phase];

  return (
    <svg width="100%" height="100%" viewBox="0 0 880 560" style={{ minHeight: 440 }}>
      <defs>
        <radialGradient id="dc-glow"><stop offset="0%" stopColor="rgba(251,191,36,0.85)" /><stop offset="60%" stopColor="rgba(251,191,36,0.18)" /><stop offset="100%" stopColor="rgba(251,191,36,0)" /></radialGradient>
        <linearGradient id="dc-zn" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={ZN_D} /><stop offset="38%" stopColor={ZN_L} /><stop offset="62%" stopColor={ZN_B} /><stop offset="100%" stopColor={ZN_D} /></linearGradient>
        <linearGradient id="dc-cu" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={CU_D} /><stop offset="38%" stopColor={CU_L} /><stop offset="62%" stopColor={CU_B} /><stop offset="100%" stopColor={CU_D} /></linearGradient>
        <linearGradient id="dc-sol-zn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={SOL_ZN_T} /><stop offset="100%" stopColor={SOL_ZN} /></linearGradient>
        <linearGradient id="dc-sol-cu" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={SOL_CU_T} /><stop offset="100%" stopColor={SOL_CU} /></linearGradient>
        <linearGradient id="dc-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="rgba(255,255,255,0.10)" /><stop offset="15%" stopColor="rgba(255,255,255,0.02)" /><stop offset="85%" stopColor="rgba(255,255,255,0.02)" /><stop offset="100%" stopColor="rgba(255,255,255,0.08)" /></linearGradient>
      </defs>

      {phase === 'single' ? (
        /* ───────── STAGE 1 — single beaker ───────── */
        <g>
          {/* dark bulb with a disconnected (dashed) wire */}
          <GlowBulb x={440} y={66} state="off" />
          <path d="M340 90 Q360 120 400 120" fill="none" stroke="#475569" strokeWidth="3" strokeDasharray="6 6" />
          <path d="M540 90 Q520 120 480 120" fill="none" stroke="#475569" strokeWidth="3" strokeDasharray="6 6" />
          <text x="440" y="118" fontSize="12" fontWeight="700" fill="#f87171" textAnchor="middle">✗ no usable current</text>

          {/* beaker */}
          <g clipPath="url(#dc-clip-single)">
            <rect x="350" y="232" width="180" height="232" fill="url(#dc-sol-cu)" />
          </g>
          <clipPath id="dc-clip-single"><path d="M352 196 L528 196 L520 452 Q520 466 506 466 L374 466 Q360 466 360 452 Z" /></clipPath>
          <path d="M352 196 L528 196 L520 452 Q520 466 506 466 L374 466 Q360 466 360 452 Z" fill="url(#dc-glass)" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinejoin="round" />

          {/* zinc strip with copper deposit building on it */}
          <rect x={418} y={150} width={44} height={290} rx="5" fill="url(#dc-zn)" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
          <rect x={418} y={300} width={44} height={140} rx="3" fill="rgba(60,40,30,0.55)" />
          <text x="440" y="138" fontSize="14" fontWeight="800" fill={ZN_L} textAnchor="middle">Zn strip</text>

          {/* local electron-transfer sparks at the surface */}
          {[260, 300, 340, 380].map((y, i) => (
            <g key={i} style={{ animation: 'dc-spark 1.4s ease-in-out infinite', animationDelay: `${-i * 0.35}s` }}>
              <text x={462} y={y} fontSize="11" fontWeight="800" fill={ELECTRON} textAnchor="middle">e⁻</text>
              <path d={`M470 ${y - 3} q14 -4 24 4`} fill="none" stroke={ELECTRON} strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx={498} cy={y + 2} r="4" fill={CU_B} />
            </g>
          ))}
          {/* heat shimmer */}
          {[395, 415, 435].map((x, i) => (
            <path key={i} d={`M${x} 210 q6 -10 0 -20 q-6 -10 0 -20`} fill="none" stroke="rgba(251,191,36,0.4)" strokeWidth="2"
              style={{ animation: 'dc-spark 1.8s ease-in-out infinite', animationDelay: `${-i * 0.4}s` }} />
          ))}
          <text x="440" y="500" fontSize="13" fontWeight="700" fill="#94a3b8" textAnchor="middle">Zn strip in CuSO₄ — spontaneous, but energy leaks away as heat</text>
        </g>
      ) : (
        /* ───────── STAGE 2 & 3 — two beakers ───────── */
        <g>
          {/* top wire rail through the bulb */}
          <polyline points="250,120 250,66 390,66" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="490,66 630,66 630,120" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <GlowBulb x={440} y={66} state={info.bulbState} />

          {/* electrons flowing on the rail — only when working */}
          {phase === 'with-bridge' && [0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform="translate(255,66)">
              <g style={{ animation: 'dc-flow 2.6s linear infinite', animationDelay: `${-i * 0.52}s` }}>
                <circle r="6.5" fill={ELECTRON} />
                <text fontSize="8" fontWeight="900" fill="#0d1117" textAnchor="middle" dominantBaseline="central">−</text>
              </g>
            </g>
          ))}
          {/* electron-direction label */}
          {phase === 'with-bridge' && <text x="350" y="52" fontSize="11" fontWeight="700" fill={ELECTRON} textAnchor="middle">electrons →</text>}
          {phase === 'no-bridge' && <text x="440" y="40" fontSize="12" fontWeight="800" fill={AMBER} textAnchor="middle">current stalls → 0</text>}

          {/* LEFT beaker — Zn | ZnSO4 (anode) */}
          <clipPath id="dc-clip-l"><path d="M158 200 L322 200 L315 452 Q315 466 301 466 L172 466 Q158 466 158 452 Z" /></clipPath>
          <g clipPath="url(#dc-clip-l)"><rect x="156" y="236" width="168" height="230" fill="url(#dc-sol-zn)" /></g>
          <path d="M158 200 L322 200 L315 452 Q315 466 301 466 L172 466 Q158 466 158 452 Z" fill="url(#dc-glass)" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinejoin="round" />
          <Electrode x={250} gradId="dc-zn" label="Zn (anode)" labelColor={ZN_L} sign={phase === 'with-bridge' ? '−' : undefined} />
          <text x="240" y="486" fontSize="12" fontWeight="700" fill="#94a3b8" textAnchor="middle">ZnSO₄</text>
          <ChargeBadge x={240} kind={phase === 'no-bridge' ? 'pos' : 'ok'} />

          {/* RIGHT beaker — Cu | CuSO4 (cathode) */}
          <clipPath id="dc-clip-r"><path d="M558 200 L722 200 L715 452 Q715 466 701 466 L572 466 Q558 466 558 452 Z" /></clipPath>
          <g clipPath="url(#dc-clip-r)"><rect x="556" y="236" width="168" height="230" fill="url(#dc-sol-cu)" /></g>
          <path d="M558 200 L722 200 L715 452 Q715 466 701 466 L572 466 Q558 466 558 452 Z" fill="url(#dc-glass)" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinejoin="round" />
          <Electrode x={630} gradId="dc-cu" label="Cu (cathode)" labelColor={CU_L} sign={phase === 'with-bridge' ? '+' : undefined} />
          <text x="640" y="486" fontSize="12" fontWeight="700" fill="#94a3b8" textAnchor="middle">CuSO₄</text>
          <ChargeBadge x={640} kind={phase === 'no-bridge' ? 'neg' : 'ok'} />

          {/* salt bridge slot */}
          {phase === 'with-bridge' ? (
            <g>
              {/* bridge tube */}
              <path d="M300 250 C300 150 580 150 580 250" fill="none" stroke="#cbd5e1" strokeWidth="20" strokeLinecap="round" opacity="0.85" />
              <path d="M300 250 C300 150 580 150 580 250" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="20" strokeLinecap="round" />
              <text x="440" y="150" fontSize="12" fontWeight="800" fill={OK} textAnchor="middle">salt bridge (KNO₃)</text>
              {/* ions leaving the bridge into each beaker */}
              {[0, 1, 2].map((i) => (
                <g key={`il${i}`} transform="translate(300,248)">
                  <g style={{ animation: 'dc-ion-l 2.4s linear infinite', animationDelay: `${-i * 0.8}s` }}>
                    <circle r="9" fill="rgba(248,113,113,0.18)" stroke={POS} strokeWidth="1.3" />
                    <text fontSize="9" fontWeight="800" fill={POS} textAnchor="middle" dominantBaseline="central">NO₃⁻</text>
                  </g>
                </g>
              ))}
              {[0, 1, 2].map((i) => (
                <g key={`ir${i}`} transform="translate(580,248)">
                  <g style={{ animation: 'dc-ion-r 2.4s linear infinite', animationDelay: `${-i * 0.8}s` }}>
                    <circle r="9" fill="rgba(129,140,248,0.18)" stroke={NEG} strokeWidth="1.3" />
                    <text fontSize="10" fontWeight="800" fill={NEG} textAnchor="middle" dominantBaseline="central">K⁺</text>
                  </g>
                </g>
              ))}
            </g>
          ) : (
            <g>
              <path d="M300 250 C300 150 580 150 580 250" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" strokeDasharray="8 8" />
              <text x="440" y="150" fontSize="12" fontWeight="700" fill="#64748b" textAnchor="middle">no salt bridge</text>
            </g>
          )}
        </g>
      )}
    </svg>
  );
}

export default function DaniellCellSim() {
  const [phase, setPhase] = useState<Phase>('single');
  const currentIndex = STEPS.findIndex((s) => s.id === phase);
  const info = PHASE_INFO[phase];
  const accent = ACCENT[phase];

  return (
    <div className="p-4 md:p-6 not-prose" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, minHeight: '60vh', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        @keyframes dc-flow   { from{transform:translateX(0)} to{transform:translateX(370px)} }
        @keyframes dc-flicker{ 0%,100%{opacity:.3} 50%{opacity:.05} }
        @keyframes dc-ion-l  { 0%{transform:translate(0,0);opacity:0} 20%{opacity:1} 100%{transform:translate(-44px,30px);opacity:0} }
        @keyframes dc-ion-r  { 0%{transform:translate(0,0);opacity:0} 20%{opacity:1} 100%{transform:translate(44px,30px);opacity:0} }
        @keyframes dc-spark  { 0%,100%{opacity:.25} 50%{opacity:1} }
      `}</style>

      {/* Header */}
      <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">Daniell Cell <span style={{ color: '#7c3aed' }}>Builder</span></h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>From a dead bulb to a working cell · NCERT Class 12 Ch. 3</p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{ color: '#64748b' }}>Zn / Cu cell</div>
      </div>

      {/* StepBar (§4c) */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {STEPS.map((s, i) => {
          const active = s.id === phase, done = i < currentIndex;
          return (
            <button key={s.id} onClick={() => (done || i <= currentIndex) && setPhase(s.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all"
              style={{
                background: active ? 'rgba(129,140,248,0.15)' : done ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : done ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.07)'}`,
                color: active ? '#c4b5fd' : done ? '#6ee7b7' : 'rgba(255,255,255,0.3)', cursor: 'pointer',
              }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                style={{ background: active ? '#6366f1' : done ? '#059669' : 'rgba(255,255,255,0.06)', color: 'white' }}>{done ? '✓' : i + 1}</span>
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Canvas + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-6">
        <div className="relative overflow-hidden rounded-3xl" style={{ minHeight: 440, background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <Scene phase={phase} />
          <div className="absolute top-3 left-4 flex gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.35)', color: info.bulbState === 'on' ? OK : '#f87171', border: `1px solid ${info.bulbState === 'on' ? OK : '#f87171'}55` }}>
              Bulb: {info.bulb}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.35)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.12)' }}>
              Current: {info.current}
            </span>
          </div>
        </div>

        <div className="flex flex-col py-1 gap-4">
          <div>
            <div className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: accent }}>{info.title}</div>
            <p className="text-base leading-snug" style={{ color: '#cbd5e1' }}>{info.body}</p>
          </div>

          {/* stage list */}
          <div className="space-y-2.5 flex-grow">
            {STEPS.map((s, i) => (
              <div key={s.id} className="rounded-lg px-3 py-2 transition-all"
                style={{ background: s.id === phase ? `${ACCENT[s.id]}12` : 'transparent', border: `1px solid ${s.id === phase ? `${ACCENT[s.id]}45` : 'rgba(255,255,255,0.06)'}`, opacity: s.id === phase ? 1 : 0.55 }}>
                <span className="text-[12px] font-bold" style={{ color: s.id === phase ? ACCENT[s.id] : '#94a3b8' }}>{i + 1}. {s.label}</span>
              </div>
            ))}
          </div>

          {/* Expert Tip (§4j) */}
          <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert Tip</div>
            <p className="text-sm font-bold leading-snug italic text-white">&ldquo;No salt bridge, no current. The wire carries the electrons; the bridge carries the ions. A circuit only works when both halves of the loop are closed.&rdquo;</p>
          </div>
        </div>
      </div>

      {/* Back / Next (§4d) */}
      <div className="flex justify-between items-center pt-4">
        <button onClick={() => currentIndex > 0 && setPhase(STEPS[currentIndex - 1].id)} disabled={currentIndex === 0}
          className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: currentIndex === 0 ? '#334155' : '#94a3b8', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer' }}>← Back</button>
        {currentIndex < STEPS.length - 1 ? (
          <button onClick={() => setPhase(STEPS[currentIndex + 1].id)}
            className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
            style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(129,140,248,0.4)', color: '#c4b5fd' }}>
            Next: {STEPS[currentIndex + 1].label} →
          </button>
        ) : (
          <button onClick={() => setPhase('single')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(129,140,248,0.3)', color: '#a5b4fc' }}>↺ Start over</button>
        )}
      </div>
    </div>
  );
}
