'use client';

// EnergyProfileSim.tsx
// Class 12 Chemistry — Chemical Kinetics — activation energy & catalysis.
// Drag the activation-energy barrier and the products level (ΔH), and toggle a catalyst.
// The reaction-coordinate profile redraws live; Ea(forward), Ea(backward) and ΔH update; a
// catalyst opens a visibly LOWER path while the reactant and product levels stay put — proving
// a catalyst changes the rate, not ΔH or the equilibrium. Slider/toggle-driven.

import { useState, useMemo } from 'react';

const R = 8.314e-3; // kJ mol^-1 K^-1
const T = 300;      // K, for the speed-up factor

export default function EnergyProfileSim() {
  const [eaF, setEaF] = useState(75);   // forward activation energy (kJ/mol from reactants)
  const [dH, setDH] = useState(-40);    // ΔH (product − reactant)
  const [cat, setCat] = useState(false);
  const [catLower, setCatLower] = useState(30); // how much the catalyst lowers Ea

  const reactant = 0;
  const product = dH;
  // peak must sit above both reactant and product
  const peak = reactant + Math.max(eaF, dH + 10);
  const eaForward = peak - reactant;
  const eaBackward = peak - product;
  const catPeak = reactant + Math.max(eaF - catLower, dH + 5);
  const catEaForward = catPeak - reactant;
  const speedup = Math.exp((eaForward - catEaForward) / (R * T));

  // profile path: reactant → peak → product over x∈[0,1]
  const profile = (pk: number) => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= 100; i++) {
      const x = i / 100;
      let y: number;
      if (x <= 0.5) { const u = (1 - Math.cos((Math.PI * x) / 0.5)) / 2; y = reactant + (pk - reactant) * u; }
      else { const u = (1 - Math.cos((Math.PI * (x - 0.5)) / 0.5)) / 2; y = pk + (product - pk) * u; }
      pts.push([x, y]);
    }
    return pts;
  };
  const uncat = useMemo(() => profile(peak), [peak, product]); // eslint-disable-line react-hooks/exhaustive-deps
  const catalysed = useMemo(() => profile(catPeak), [catPeak, product]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── geometry ──────────────────────────────────────────────────
  const W = 560, H = 300, PAD_L = 48, PAD_B = 30, PAD_T = 22, PAD_R = 16;
  const eMin = Math.min(reactant, product, catPeak, 0) - 15;
  const eMax = peak + 20;
  const px = (x: number) => PAD_L + x * (W - PAD_L - PAD_R);
  const py = (e: number) => PAD_T + (1 - (e - eMin) / (eMax - eMin)) * (H - PAD_T - PAD_B);
  const pathOf = (pts: [number, number][]) => pts.map(([x, e], i) => `${i === 0 ? 'M' : 'L'}${px(x).toFixed(1)},${py(e).toFixed(1)}`).join(' ');

  const exo = dH < 0;

  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="mb-3">
        <h1 className="text-2xl font-black tracking-tight text-white">
          Energy Profile <span style={{ color: '#7c3aed' }}>Explorer</span>
        </h1>
        <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
          The barrier sets the speed · the drop sets the heat
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)' }}>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
              <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
              {/* reactant & product level guides */}
              <line x1={PAD_L} y1={py(reactant)} x2={W - PAD_R} y2={py(reactant)} stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="3 4" />
              <line x1={PAD_L} y1={py(product)} x2={W - PAD_R} y2={py(product)} stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="3 4" />
              {/* catalysed path */}
              {cat && <path d={pathOf(catalysed)} fill="none" stroke="#34d399" strokeWidth={2.5} strokeDasharray="6 4" />}
              {/* uncatalysed path */}
              <path d={pathOf(uncat)} fill="none" stroke="#fbbf24" strokeWidth={2.5} />
              {/* Ea(forward) arrow */}
              <line x1={px(0.5)} y1={py(reactant)} x2={px(0.5)} y2={py(peak)} stroke="#f87171" strokeWidth={1.5} />
              <text x={px(0.5) + 6} y={(py(reactant) + py(peak)) / 2} fill="#f87171" fontSize={10} fontWeight={800}>Eₐ(fwd) {eaForward.toFixed(0)}</text>
              {/* ΔH arrow */}
              <line x1={px(0.92)} y1={py(reactant)} x2={px(0.92)} y2={py(product)} stroke="#818cf8" strokeWidth={1.5} />
              <text x={px(0.92) - 4} y={(py(reactant) + py(product)) / 2} fill="#818cf8" fontSize={10} fontWeight={800} textAnchor="end">ΔH {dH > 0 ? '+' : ''}{dH}</text>
              {/* labels */}
              <text x={px(0.02)} y={py(reactant) - 8} fill="#cbd5e1" fontSize={11} fontWeight={700}>Reactants</text>
              <text x={px(0.98)} y={py(product) + (product > reactant ? -8 : 16)} fill="#cbd5e1" fontSize={11} fontWeight={700} textAnchor="end">Products</text>
              <text x={px(0.5)} y={py(peak) - 6} fill="#fbbf24" fontSize={10} fontWeight={800} textAnchor="middle">transition state</text>
              {cat && <text x={px(0.5)} y={py(catPeak) - 6} fill="#34d399" fontSize={9} fontWeight={800} textAnchor="middle">with catalyst</text>}
              <text x={W / 2} y={H - 3} fill="#94a3b8" fontSize={10} fontWeight={700} textAnchor="middle">progress of reaction →</text>
              <text x={14} y={H / 2} fill="#94a3b8" fontSize={10} fontWeight={700} textAnchor="middle" transform={`rotate(-90 14 ${H / 2})`}>potential energy</text>
            </svg>
          </div>

          <div className="grid grid-cols-1 gap-3 mt-3">
            <Slider label={`Activation energy Eₐ: ${eaF} kJ/mol`} min={20} max={150} step={5} value={eaF} onChange={setEaF} accent="#f87171" />
            <Slider label={`ΔH (products vs reactants): ${dH > 0 ? '+' : ''}${dH} kJ/mol`} min={-80} max={80} step={5} value={dH} onChange={setDH} accent="#818cf8" />
            <div className="flex items-center gap-3">
              <button onClick={() => setCat((v) => !v)}
                className="px-3 py-2 rounded-lg text-sm font-bold transition-all"
                style={{ background: cat ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${cat ? '#34d399' : 'rgba(255,255,255,0.1)'}`, color: cat ? '#6ee7b7' : '#94a3b8', outline: 'none' }}>
                {cat ? '✓ Catalyst added' : 'Add catalyst'}
              </button>
              {cat && (
                <div className="flex-1">
                  <Slider label={`Catalyst lowers Eₐ by ${catLower} kJ/mol`} min={10} max={60} step={5} value={catLower} onChange={setCatLower} accent="#34d399" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* sidebar */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Eₐ forward" value={`${eaForward.toFixed(0)}`} unit="kJ/mol" color="#f87171" />
            <Stat label="Eₐ backward" value={`${eaBackward.toFixed(0)}`} unit="kJ/mol" color="#fbbf24" />
          </div>

          <div style={{ borderRadius: 10, padding: '12px 14px', background: exo ? 'rgba(52,211,153,0.06)' : 'rgba(129,140,248,0.06)', border: `1px solid ${exo ? 'rgba(52,211,153,0.25)' : 'rgba(129,140,248,0.25)'}` }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: exo ? '#34d399' : '#818cf8' }}>{exo ? 'Exothermic (ΔH < 0)' : dH === 0 ? 'Thermoneutral' : 'Endothermic (ΔH > 0)'}</p>
            <p className="text-sm leading-snug" style={{ color: '#cbd5e1' }}>
              The heat released or absorbed is fixed by ΔH — the product level. The <b>speed</b> is fixed by the barrier Eₐ. They move independently: a big drop (very exothermic) can still sit behind a tall, slow barrier.
            </p>
          </div>

          {cat ? (
            <div style={{ borderRadius: 10, padding: '12px 14px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.3)' }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#34d399' }}>Catalyst speed-up at {T} K</p>
              <p className="text-2xl font-black" style={{ color: '#6ee7b7', fontVariantNumeric: 'tabular-nums' }}>≈ {speedup < 1000 ? speedup.toFixed(0) : speedup.toExponential(1)}×</p>
              <p className="text-sm mt-1 leading-snug" style={{ color: '#cbd5e1' }}>
                The catalyst lowers the barrier to <b>{catEaForward.toFixed(0)} kJ/mol</b> — faster — but notice the reactant and product levels (and so ΔH) <b>did not move</b>.
              </p>
            </div>
          ) : (
            <div style={{ borderRadius: 10, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-sm leading-snug" style={{ color: '#94a3b8' }}>
                Add a catalyst to open a lower path. Watch the peak drop while the reactant and product levels stay exactly where they are.
              </p>
            </div>
          )}

          <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert tip</p>
            <p className="text-white text-sm font-bold leading-tight italic">
              &ldquo;A catalyst is a tunnel through the hill, not a smaller hill. It speeds both directions equally — so it never shifts where equilibrium sits.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <div style={{ borderRadius: 8, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <p className="text-[9px] font-black uppercase tracking-widest" style={{ color }}>{label}</p>
      <p className="text-lg font-black text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>{value} <span className="text-[10px]" style={{ color: '#64748b' }}>{unit}</span></p>
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
