'use client';

// MaxwellBoltzmannSim.tsx
// Class 12 Chemistry — Chemical Kinetics — Arrhenius / temperature dependence.
// Drag temperature and activation energy. The energy-distribution curve shifts right and
// flattens as T rises, while the shaded area BEYOND Ea (molecules that can react) grows.
// The total area under the curve stays constant (both curves normalised to unit area) — the
// whole point: heating does not add molecules, it moves more of them past the barrier.
// Slider-driven; live readout of the reactive fraction e^(-Ea/RT) and the relative rate.

import { useState, useMemo } from 'react';

const R = 8.314e-3; // kJ mol^-1 K^-1
// Schematic energy axis: real activation energies (50–200 kJ/mol) sit so far out on the tail
// that the reactive area is invisible — so, like every textbook Maxwell–Boltzmann figure, the
// axis is drawn schematically (Eₐ kept small) so the shaded reactive tail is actually visible.
const E_MAX = 30;   // kJ/mol on the x-axis (schematic)
const T_REF = 300;  // reference temperature for the dashed comparison curve
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';

function prettyExp(v: number): string {
  if (v === 0) return '0';
  const e = v.toExponential(2);
  const m = e.match(/^(-?[\d.]+)e([+-]?\d+)$/);
  if (!m) return e;
  const expNum = parseInt(m[2], 10);
  if (expNum === 0) return m[1];
  const sup = String(Math.abs(expNum)).split('').map((d) => SUP[+d]).join('');
  return `${m[1]} × 10${expNum < 0 ? '⁻' : ''}${sup}`;
}

// rate ratio: a clean ×N for normal magnitudes, scientific only for extremes
function fmtRatio(r: number): string {
  if (r >= 0.01 && r < 1e4) return `${r >= 100 ? Math.round(r) : r.toFixed(1)}×`;
  return `${prettyExp(r)}×`;
}

// unnormalised Maxwell-Boltzmann energy distribution f(E) ∝ √E · e^(-E/RT)
function dist(E: number, T: number) { return Math.sqrt(E) * Math.exp(-E / (R * T)); }

// sample + normalise to unit area over [0, E_MAX]
function curveOf(T: number) {
  const N = 240, dE = E_MAX / N;
  const raw: number[] = [];
  let area = 0;
  for (let i = 0; i <= N; i++) { const v = dist(i * dE, T); raw.push(v); area += v * dE; }
  return { ys: raw.map((v) => v / area), dE, N };
}

export default function MaxwellBoltzmannSim() {
  const [T, setT] = useState(400);
  const [Ea, setEa] = useState(12);

  const cur = useMemo(() => curveOf(T), [T]);
  const ref = useMemo(() => curveOf(T_REF), []);

  // reactive fraction (Arrhenius / NCERT form) and rate ratio vs reference T
  const fracCur = Math.exp(-Ea / (R * T));
  const fracRef = Math.exp(-Ea / (R * T_REF));
  const rateRatio = fracCur / fracRef;

  // ── geometry ──────────────────────────────────────────────────
  const W = 560, H = 300, PAD_L = 30, PAD_B = 34, PAD_T = 16, PAD_R = 16;
  const yMax = Math.max(...cur.ys, ...ref.ys) * 1.05;
  const px = (E: number) => PAD_L + (E / E_MAX) * (W - PAD_L - PAD_R);
  const py = (y: number) => PAD_T + (1 - y / yMax) * (H - PAD_T - PAD_B);
  const pathOf = (ys: number[]) => ys.map((y, i) => `${i === 0 ? 'M' : 'L'}${px(i * cur.dE).toFixed(1)},${py(y).toFixed(1)}`).join(' ');

  // shaded reactive area (E ≥ Ea) under the current-T curve
  const eaIndex = Math.round(Ea / cur.dE);
  const shade = (() => {
    let d = `M${px(Ea).toFixed(1)},${py(0).toFixed(1)}`;
    for (let i = eaIndex; i <= cur.N; i++) d += ` L${px(i * cur.dE).toFixed(1)},${py(cur.ys[i]).toFixed(1)}`;
    d += ` L${px(E_MAX).toFixed(1)},${py(0).toFixed(1)} Z`;
    return d;
  })();

  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="mb-3">
        <h1 className="text-2xl font-black tracking-tight text-white">
          Maxwell–Boltzmann <span style={{ color: '#7c3aed' }}>Lab</span>
        </h1>
        <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
          Why heating speeds a reaction up
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)' }}>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
              {/* axes */}
              <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
              <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
              {/* reactive shaded area */}
              <path d={shade} fill="rgba(52,211,153,0.45)" stroke="#34d399" strokeWidth={1} strokeOpacity={0.5} />
              {/* reference-T curve (dashed) */}
              <path d={pathOf(ref.ys)} fill="none" stroke="#64748b" strokeWidth={1.5} strokeDasharray="5 4" opacity={0.8} />
              {/* current-T curve */}
              <path d={pathOf(cur.ys)} fill="none" stroke="#fbbf24" strokeWidth={2.5} />
              {/* Ea line */}
              <line x1={px(Ea)} y1={PAD_T} x2={px(Ea)} y2={H - PAD_B} stroke="#f87171" strokeWidth={2} strokeDasharray="3 3" />
              <text x={px(Ea)} y={PAD_T + 10} fill="#f87171" fontSize={11} fontWeight={800} textAnchor="middle">Eₐ</text>
              {/* x ticks */}
              {[0, 10, 20, 30].map((E) => (
                <text key={E} x={px(E)} y={H - PAD_B + 14} fill="#64748b" fontSize={9} textAnchor="middle" style={{ fontVariantNumeric: 'tabular-nums' }}>{E}</text>
              ))}
              <text x={W / 2} y={H - 3} fill="#94a3b8" fontSize={10} fontWeight={700} textAnchor="middle">kinetic energy (kJ/mol, schematic)</text>
              <text x={12} y={H / 2} fill="#94a3b8" fontSize={10} fontWeight={700} textAnchor="middle" transform={`rotate(-90 12 ${H / 2})`}>fraction of molecules</text>
              {/* legend */}
              <g transform={`translate(${W - 156},${PAD_T + 2})`}>
                <rect x={-8} y={-10} width={156} height={46} rx={6} fill="rgba(5,6,20,0.72)" stroke="rgba(255,255,255,0.08)" />
                <line x1={0} y1={0} x2={18} y2={0} stroke="#fbbf24" strokeWidth={2.5} /><text x={24} y={3} fill="#cbd5e1" fontSize={9}>at {T} K</text>
                <line x1={0} y1={14} x2={18} y2={14} stroke="#64748b" strokeWidth={1.5} strokeDasharray="5 4" /><text x={24} y={17} fill="#cbd5e1" fontSize={9}>at {T_REF} K (ref)</text>
                <rect x={0} y={24} width={18} height={8} fill="rgba(52,211,153,0.5)" /><text x={24} y={31} fill="#cbd5e1" fontSize={9}>can react (E ≥ Eₐ)</text>
              </g>
            </svg>
          </div>

          <div className="grid grid-cols-1 gap-3 mt-3">
            <Slider label={`Temperature: ${T} K`} min={260} max={700} step={10} value={T} onChange={setT} accent="#fbbf24" />
            <Slider label={`Activation energy Eₐ: ${Ea} kJ/mol`} min={6} max={24} step={1} value={Ea} onChange={setEa} accent="#f87171" />
          </div>
        </div>

        {/* sidebar */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: '#fbbf24' }}>What you see</p>
            <p className="text-white font-bold text-base leading-snug">
              Raise the temperature and the curve shifts <span style={{ color: '#fbbf24' }}>right</span> and flattens. The green area past Eₐ — the molecules energetic enough to react — <span style={{ color: '#34d399' }}>grows</span>, even though the total area under the curve never changes.
            </p>
            <p className="text-xs leading-snug mt-2" style={{ color: '#64748b' }}>
              The energy axis is drawn schematically (Eₐ kept small) so the reactive tail is visible — for a real reaction Eₐ is far larger and the fraction far tinier.
            </p>
          </div>

          <div style={{ borderRadius: 10, padding: '12px 14px', background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.25)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#34d399' }}>Reactive fraction e^(−Eₐ/RT)</p>
            <p className="text-2xl font-black" style={{ color: '#6ee7b7', fontVariantNumeric: 'tabular-nums' }}>{prettyExp(fracCur)}</p>
            <p className="text-sm mt-1 leading-snug" style={{ color: '#cbd5e1' }}>
              of all collisions clear the barrier at {T} K.
            </p>
          </div>

          <div style={{ borderRadius: 10, padding: '12px 14px', background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.25)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#818cf8' }}>Rate vs {T_REF} K</p>
            <p className="text-2xl font-black" style={{ color: '#c4b5fd', fontVariantNumeric: 'tabular-nums' }}>
              {fmtRatio(rateRatio)}
            </p>
            <p className="text-sm mt-1 leading-snug" style={{ color: '#cbd5e1' }}>
              The reaction is {rateRatio >= 1 ? 'this many times faster' : 'this fraction of the speed'} compared with {T_REF} K.
            </p>
          </div>

          <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert tip</p>
            <p className="text-white text-sm font-bold leading-tight italic">
              &ldquo;Heating doesn&rsquo;t make more molecules — it gives the ones you have a better chance of crossing the barrier. A taller Eₐ shrinks that green sliver.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, min, max, step, value, onChange, accent }: {
  label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void; accent: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold block mb-1" style={{ color: '#94a3b8' }}>{label}</label>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: accent }} />
    </div>
  );
}
