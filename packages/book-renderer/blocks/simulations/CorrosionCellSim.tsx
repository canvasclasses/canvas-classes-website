'use client';

/**
 * Corrosion Cell & Protection
 *
 * Academic source: NCERT Class 12 Chemistry, Chapter 3 (Electrochemistry) —
 * "Corrosion".
 *  - Rusting is electrochemical: patches of an iron surface act as a tiny
 *    galvanic cell with a water film (holding dissolved O₂ and H⁺ from CO₂) as
 *    electrolyte.
 *      Anode:   Fe(s) -> Fe^2+ + 2e^-            E°(Fe^2+/Fe) = -0.44 V
 *      Cathode: O2 + 4H+ + 4e- -> 2H2O           E° = +1.23 V
 *      Fe^2+ is then oxidised by O2 to Fe^3+, giving hydrated ferric oxide
 *      Fe2O3·xH2O = rust.
 *  - Protection:
 *      • Barrier (paint / grease / coating) keeps O₂ and water off the metal.
 *      • Sacrificial / cathodic protection: connect or coat iron with a MORE
 *        active metal — Zn (galvanising, E° = -0.76 V) or Mg (E° = -2.37 V).
 *        The more active metal becomes the ANODE and corrodes; iron becomes the
 *        cathode and is protected — even if the coat is scratched.
 *      • A LESS active coating (tin, E°(Sn^2+/Sn) = -0.14 V) protects only while
 *        intact; once scratched, iron is the anode and corrodes FASTER than bare.
 *
 * Pedagogical goal: show the rusting micro-cell, then let the student apply each
 * protection method and (for coatings) scratch it — discovering that sacrificial
 * metals keep protecting after a scratch while tin makes things worse.
 */

import { useState } from 'react';

// ── Types & data ─────────────────────────────────────────────────────────────

type Method = 'none' | 'paint' | 'tin' | 'zinc' | 'mg';

interface MethodInfo {
  id: Method;
  tab: string;
  coating: boolean; // has a scratchable coating
  coatColor: string;
}

const METHODS: Record<Method, MethodInfo> = {
  none: { id: 'none', tab: 'Bare iron', coating: false, coatColor: '' },
  paint: { id: 'paint', tab: 'Painted', coating: true, coatColor: '#7c3aed' },
  tin: { id: 'tin', tab: 'Tin-coated', coating: true, coatColor: '#cbd5e1' },
  zinc: { id: 'zinc', tab: 'Galvanised (Zn)', coating: true, coatColor: '#9fb4c9' },
  mg: { id: 'mg', tab: 'Mg sacrificial anode', coating: false, coatColor: '' },
};
const ORDER: Method[] = ['none', 'paint', 'tin', 'zinc', 'mg'];

// reduction potentials for the reference scale (V vs SHE, NCERT)
const POTENTIALS = [
  { sym: 'Mg', e: -2.37 }, { sym: 'Zn', e: -0.76 }, { sym: 'Fe', e: -0.44 }, { sym: 'Sn', e: -0.14 },
];

// UI palette (workflow §3)
const RUST = '#c8743a';
const ELECTRON = '#818cf8';
const OK = '#34d399';
const BAD = '#f87171';
const AMBER = '#fbbf24';
const FE = { light: '#c7ccd1', base: '#8d949c', dark: '#5c636b' };

interface Verdict {
  corroding: boolean;
  status: string;
  anode: string;
  cathode: string;
  detail: string;
  color: string;
}

function verdictFor(method: Method, scratched: boolean): Verdict {
  switch (method) {
    case 'none':
      return { corroding: true, status: 'CORRODING', anode: 'Fe → Fe²⁺ + 2e⁻', cathode: 'O₂ + 4H⁺ + 4e⁻ → 2H₂O', color: BAD,
        detail: 'Bare iron in a water film is its own little galvanic cell: one patch is the anode (iron dissolves), another the cathode (oxygen is reduced). The Fe²⁺ is further oxidised to hydrated Fe₂O₃·xH₂O — rust.' };
    case 'paint':
      return scratched
        ? { corroding: true, status: 'CORRODING AT THE SCRATCH', anode: 'Fe (exposed)', cathode: 'O₂ + 4H⁺ + 4e⁻ → 2H₂O', color: BAD,
            detail: 'Paint is only a barrier. Scratch it and the bare iron underneath is exposed to air and water again — rust starts right at the scratch.' }
        : { corroding: false, status: 'PROTECTED (barrier)', anode: '—', cathode: '—', color: OK,
            detail: 'Paint simply keeps oxygen and water away from the metal. No electrolyte contact, no rusting — but only while the layer is unbroken.' };
    case 'tin':
      return scratched
        ? { corroding: true, status: 'CORRODING FASTER THAN BARE', anode: 'Fe → Fe²⁺ + 2e⁻', cathode: 'Sn (cathode)', color: BAD,
            detail: 'Tin is LESS active than iron (E° = −0.14 V vs −0.44 V). While intact it protects as a barrier, but once scratched iron becomes the anode and tin the cathode — so the iron corrodes even faster than if it were bare. This is why a scratched tin can rusts quickly.' }
        : { corroding: false, status: 'PROTECTED (barrier only)', anode: '—', cathode: '—', color: OK,
            detail: 'Intact tin plating works purely as a barrier. The danger is hidden: if it is ever scratched, the protection flips into accelerated attack.' };
    case 'zinc':
      return scratched
        ? { corroding: false, status: 'IRON STILL PROTECTED', anode: 'Zn → Zn²⁺ + 2e⁻', cathode: 'Fe (protected)', color: OK,
            detail: 'Zinc is MORE active than iron (E° = −0.76 V vs −0.44 V), so even at a scratch the zinc becomes the anode and dissolves, while iron is forced to be the cathode. The zinc sacrifices itself — galvanised iron keeps protecting even when the coat is broken.' }
        : { corroding: false, status: 'PROTECTED (barrier + sacrificial)', anode: 'Zn (if exposed)', cathode: 'Fe', color: OK,
            detail: 'Galvanising coats iron with zinc — both a barrier and a sacrificial metal. That combination is why galvanised steel lasts so long outdoors.' };
    case 'mg':
      return { corroding: false, status: 'IRON PROTECTED — Mg sacrificed', anode: 'Mg → Mg²⁺ + 2e⁻', cathode: 'Fe (protected)', color: OK,
        detail: 'A block of magnesium (E° = −2.37 V, far more active than iron) is wired to the structure. Mg becomes the anode and corrodes away, pumping electrons into the iron so it can only act as the cathode. This is how underground pipelines and ship hulls are protected — replace the Mg block periodically.' };
  }
}

// ── SVG scene ────────────────────────────────────────────────────────────────

function Scene({ method, scratched, v }: { method: Method; scratched: boolean; v: Verdict }) {
  const info = METHODS[method];
  const showScratch = info.coating && scratched;
  const ironTop = 360;
  const corroding = v.corroding;

  return (
    <svg width="100%" height="100%" viewBox="0 0 760 520" style={{ minHeight: 420 }}>
      <defs>
        <linearGradient id="cor-fe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={FE.light} /><stop offset="50%" stopColor={FE.base} /><stop offset="100%" stopColor={FE.dark} /></linearGradient>
        <radialGradient id="cor-drop"><stop offset="0%" stopColor="rgba(96,165,235,0.30)" /><stop offset="100%" stopColor="rgba(96,165,235,0.12)" /></radialGradient>
      </defs>

      {/* water film / droplet (electrolyte) */}
      <path d="M150 360 Q150 250 380 235 Q610 250 610 360 Z" fill="url(#cor-drop)" stroke="rgba(96,165,235,0.4)" strokeWidth="2" />
      <text x="585" y="280" fontSize="11" fontWeight="700" fill="#60a5eb" textAnchor="end">water film (O₂, H⁺)</text>

      {/* iron slab */}
      <rect x="120" y={ironTop} width="520" height="70" rx="4" fill="url(#cor-fe)" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
      <text x="380" y={ironTop + 92} fontSize="13" fontWeight="800" fill={FE.light} textAnchor="middle">iron object</text>

      {/* coating layer */}
      {info.coating && (
        <g>
          <rect x="120" y={ironTop - 10} width="520" height="10" fill={info.coatColor} opacity="0.92" />
          <text x="135" y={ironTop - 15} fontSize="10.5" fontWeight="700" fill={info.coatColor}>{info.tab.toLowerCase()} layer</text>
          {showScratch && (
            <g>
              <path d={`M360 ${ironTop - 10} L372 ${ironTop} L388 ${ironTop} L400 ${ironTop - 10} Z`} fill="#0d1117" />
              <text x="380" y={ironTop - 16} fontSize="10" fontWeight="800" fill={AMBER} textAnchor="middle">scratch ✂</text>
            </g>
          )}
        </g>
      )}

      {/* Mg sacrificial anode block + wire */}
      {method === 'mg' && (
        <g>
          <rect x="60" y={ironTop - 6} width="48" height="70" rx="4" fill="#b9c2c9" stroke="#7c8893" strokeWidth="1.5" />
          <text x="84" y={ironTop - 14} fontSize="12" fontWeight="800" fill="#dfe4e8" textAnchor="middle">Mg</text>
          <path d={`M84 ${ironTop - 6} Q84 320 120 330`} fill="none" stroke="#94a3b8" strokeWidth="2.5" />
          {/* Mg dissolving */}
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(108,${ironTop + 12 + i * 18})`} style={{ animation: 'cor-dissolve 2.6s ease-in infinite', animationDelay: `${-i * 0.8}s` }}>
              <circle r="8" fill="rgba(185,194,201,0.25)" stroke="#cbd5e1" strokeWidth="1.2" /><text fontSize="8" fontWeight="800" fill="#e2e8f0" textAnchor="middle" dominantBaseline="central">Mg²⁺</text>
            </g>
          ))}
          {/* electrons into iron */}
          {[0, 1, 2].map((i) => (
            <g key={`e${i}`} transform="translate(120,330)"><g style={{ animation: 'cor-eflow 2s linear infinite', animationDelay: `${-i * 0.66}s` }}><circle r="5.5" fill={ELECTRON} /><text fontSize="7" fontWeight="900" fill="#0d1117" textAnchor="middle" dominantBaseline="central">−</text></g></g>
          ))}
        </g>
      )}

      {/* corrosion micro-cell on the iron */}
      {corroding && (
        <g>
          {/* anode region */}
          {(() => { const ax = showScratch ? 380 : 250; return (
            <g>
              <ellipse cx={ax} cy={ironTop + 4} rx="34" ry="9" fill="rgba(248,113,113,0.18)" stroke={BAD} strokeWidth="1.2" />
              <text x={ax} y={ironTop - (showScratch ? 30 : 22)} fontSize="10.5" fontWeight="800" fill={BAD} textAnchor="middle">anode</text>
              {/* Fe2+ leaving */}
              {[0, 1, 2].map((i) => (
                <g key={i} transform={`translate(${ax},${ironTop})`} style={{ animation: 'cor-dissolve 2.4s ease-in infinite', animationDelay: `${-i * 0.7}s` }}>
                  <circle r="9" fill="rgba(200,116,58,0.22)" stroke={RUST} strokeWidth="1.2" /><text fontSize="8" fontWeight="800" fill={RUST} textAnchor="middle" dominantBaseline="central">Fe²⁺</text>
                </g>
              ))}
              {/* rust pile */}
              {[0, 1, 2, 3, 4].map((i) => (
                <circle key={`r${i}`} cx={ax - 16 + i * 8} cy={ironTop - 2 - (i % 2) * 4} r={3 + (i % 2)} fill={RUST}
                  style={{ animation: 'cor-rust 3s ease-in-out infinite', animationDelay: `${-i * 0.4}s` }} />
              ))}
            </g>
          ); })()}
          {/* cathode region (where O2 is reduced) */}
          {!showScratch && (
            <g>
              <ellipse cx={510} cy={ironTop + 4} rx="34" ry="9" fill="rgba(52,211,153,0.16)" stroke={OK} strokeWidth="1.2" />
              <text x={510} y={ironTop - 22} fontSize="10.5" fontWeight="800" fill={OK} textAnchor="middle">cathode (O₂ reduced)</text>
            </g>
          )}
          {/* electron flow inside the metal, anode → cathode */}
          {!showScratch && [0, 1, 2, 3].map((i) => (
            <g key={`em${i}`} transform={`translate(284,${ironTop + 30})`}><g style={{ animation: 'cor-emetal 2.4s linear infinite', animationDelay: `${-i * 0.6}s` }}><circle r="5.5" fill={ELECTRON} /><text fontSize="7" fontWeight="900" fill="#0d1117" textAnchor="middle" dominantBaseline="central">−</text></g></g>
          ))}
        </g>
      )}

      {/* protected stamp */}
      {!corroding && (
        <g transform="translate(380,300)">
          <rect x="-70" y="-18" width="140" height="36" rx="10" fill="rgba(52,211,153,0.12)" stroke={OK} strokeWidth="1.4" />
          <text x="0" y="1" fontSize="13" fontWeight="900" fill={OK} textAnchor="middle" dominantBaseline="central">✓ iron protected</text>
        </g>
      )}
    </svg>
  );
}

// ── Potential reference strip ──────────────────────────────────────────────────

function PotentialStrip({ method }: { method: Method }) {
  const active = method === 'zinc' ? 'Zn' : method === 'mg' ? 'Mg' : method === 'tin' ? 'Sn' : '';
  const pct = (e: number) => ((e + 2.6) / 2.7) * 100; // map [-2.6, +0.1] → 0..100
  return (
    <div className="rounded-xl px-4 pt-3 pb-5" style={{ background: '#0b0f15', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>Reduction potential E° (V) — more negative = more active = becomes the anode</div>
      <div className="relative" style={{ height: 44, marginTop: 10 }}>
        <div className="absolute" style={{ left: 0, right: 0, top: 8, height: 3, borderRadius: 3, background: 'linear-gradient(to right,#f87171,#475569 60%,#34d399)' }} />
        {POTENTIALS.map((p) => {
          const isFe = p.sym === 'Fe';
          const isActive = p.sym === active;
          const c = isFe ? AMBER : isActive ? OK : '#94a3b8';
          return (
            <div key={p.sym} className="absolute" style={{ left: `${pct(p.e)}%`, top: 0, transform: 'translateX(-50%)' }}>
              <div style={{ width: isFe || isActive ? 14 : 9, height: isFe || isActive ? 14 : 9, borderRadius: '50%', background: c, margin: '0 auto', boxShadow: isFe || isActive ? `0 0 10px ${c}` : 'none' }} />
              <div className="text-center mt-1 tabular-nums" style={{ fontSize: 11, fontWeight: 800, color: c }}>{p.sym}</div>
              <div className="text-center tabular-nums text-[9px]" style={{ color: '#64748b' }}>{p.e.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CorrosionCellSim() {
  const [method, setMethod] = useState<Method>('none');
  const [scratched, setScratched] = useState(false);
  const info = METHODS[method];
  const v = verdictFor(method, scratched);

  return (
    <div className="p-4 md:p-6 not-prose" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, minHeight: '60vh', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        @keyframes cor-dissolve { 0%{transform:translateY(0);opacity:0} 20%{opacity:1} 100%{transform:translateY(-70px);opacity:0} }
        @keyframes cor-rust { 0%,100%{opacity:.45} 50%{opacity:1} }
        @keyframes cor-emetal { from{transform:translateX(0)} to{transform:translateX(220px)} }
        @keyframes cor-eflow { from{transform:translateX(0)} to{transform:translateX(150px)} }
      `}</style>

      {/* Header */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">Corrosion <span style={{ color: '#7c3aed' }}>& Protection</span></h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>Why iron rusts — and how to stop it · NCERT Class 12 Ch. 3</p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{ color: '#64748b' }}>{info.tab}</div>
      </div>

      {/* Method tabs (§4g) */}
      <div className="flex mb-4 flex-wrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {ORDER.map((id) => {
          const active = id === method;
          return (
            <button key={id} onClick={() => { setMethod(id); setScratched(false); }}
              className="px-4 py-2.5 text-center transition-all"
              style={{ background: 'none', outline: 'none', borderBottom: `2px solid ${active ? '#818cf8' : 'rgba(255,255,255,0.06)'}`, opacity: active ? 1 : 0.55, marginBottom: -1 }}>
              <div className="text-[13px] font-black" style={{ color: active ? '#c4b5fd' : '#94a3b8' }}>{METHODS[id].tab}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-6">
        {/* canvas */}
        <div className="relative overflow-hidden rounded-3xl" style={{ minHeight: 420, background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <Scene method={method} scratched={scratched} v={v} />
          <div className="absolute top-3 left-4">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.4)', color: v.color, border: `1px solid ${v.color}66` }}>{v.status}</span>
          </div>
        </div>

        {/* readout */}
        <div className="flex flex-col gap-4">
          {/* scratch toggle (§4f) — only for coatings */}
          {info.coating ? (
            <button onClick={() => setScratched((s) => !s)} className="self-start text-sm font-semibold transition-colors pb-0.5"
              style={{ color: scratched ? AMBER : '#475569', borderBottom: `1px solid ${scratched ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.1)'}`, background: 'none', outline: 'none' }}>
              {scratched ? '✓ Coating is scratched — watch what happens' : 'Scratch the coating'}
            </button>
          ) : (
            <div className="text-[11px]" style={{ color: '#475569' }}>{method === 'mg' ? 'A magnesium block is wired to the iron.' : 'Bare iron, no protection applied.'}</div>
          )}

          {/* half-reactions */}
          <div className="rounded-xl px-4 py-3.5" style={{ background: '#0b0f15', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>What's happening</div>
            <div className="space-y-1.5 text-[13px]">
              <div className="flex justify-between gap-3"><span style={{ color: '#64748b' }}>anode (oxidation)</span><span className="font-bold text-right" style={{ color: v.anode === '—' ? '#475569' : BAD }}>{v.anode}</span></div>
              <div className="flex justify-between gap-3"><span style={{ color: '#64748b' }}>cathode (reduction)</span><span className="font-bold text-right" style={{ color: v.cathode === '—' ? '#475569' : OK }}>{v.cathode}</span></div>
            </div>
          </div>

          {/* verdict */}
          <div className="rounded-xl px-4 py-3.5" style={{ background: `${v.color}12`, border: `1px solid ${v.color}40` }}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: v.color }}>{v.corroding ? '⚠ Result' : '✓ Result'}</div>
            <p className="text-sm leading-snug" style={{ color: '#cbd5e1' }}>{v.detail}</p>
          </div>

          <PotentialStrip method={method} />
        </div>
      </div>

      {/* Expert Tip (§4j) */}
      <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert Tip</div>
        <p className="text-sm font-bold leading-snug italic text-white">
          &ldquo;Sacrificial protection is the clever bit: coat iron with a <span style={{ color: OK }}>more active</span> metal (Zn, Mg) and it keeps protecting even when scratched, because the active metal — not the iron — becomes the anode. Coat it with a <span style={{ color: BAD }}>less active</span> one (tin) and a scratch turns the protection into accelerated rusting.&rdquo;
        </p>
      </div>
    </div>
  );
}
