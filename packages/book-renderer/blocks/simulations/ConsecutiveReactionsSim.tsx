'use client';

// ConsecutiveReactionsSim.tsx
// Class 12 Chemistry — Chemical Kinetics — consecutive reactions A →(k1) I →(k2) P.
// The student controls k1 and k2 (the two step rate constants). All three curves redraw live:
// A decays, the intermediate I rises to a peak then falls, P builds in an S-curve. As k2 is
// pushed above k1 the intermediate's peak collapses toward zero — drawing the steady-state
// picture. A readout names the rate-determining (slower) step. Slider-driven.

import { useState, useMemo } from 'react';

const A0 = 100;

export default function ConsecutiveReactionsSim() {
  const [k1, setK1] = useState(0.5);
  const [k2, setK2] = useState(0.5);

  // time window covers ~6 time-constants of the slower step
  const tMax = useMemo(() => 6 / Math.min(k1, k2), [k1, k2]);

  const sample = useMemo(() => {
    const N = 240;
    const A: [number, number][] = [], I: [number, number][] = [], P: [number, number][] = [];
    const near = Math.abs(k1 - k2) < 1e-3;
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * tMax;
      const a = A0 * Math.exp(-k1 * t);
      const iConc = near
        ? A0 * k1 * t * Math.exp(-k1 * t)
        : A0 * (k1 / (k2 - k1)) * (Math.exp(-k1 * t) - Math.exp(-k2 * t));
      const p = Math.max(0, A0 - a - iConc);
      A.push([t, a]); I.push([t, Math.max(0, iConc)]); P.push([t, p]);
    }
    return { A, I, P };
  }, [k1, k2, tMax]);

  // intermediate peak
  const peak = useMemo(() => {
    let best = { t: 0, c: 0 };
    for (const [t, c] of sample.I) if (c > best.c) best = { t, c };
    return best;
  }, [sample]);

  // ── geometry ──────────────────────────────────────────────────
  const W = 560, H = 300, PAD_L = 40, PAD_B = 32, PAD_T = 16, PAD_R = 16;
  const px = (t: number) => PAD_L + (t / tMax) * (W - PAD_L - PAD_R);
  const py = (c: number) => PAD_T + (1 - c / A0) * (H - PAD_T - PAD_B);
  const pathOf = (pts: [number, number][]) => pts.map(([t, c], i) => `${i === 0 ? 'M' : 'L'}${px(t).toFixed(1)},${py(c).toFixed(1)}`).join(' ');

  const ratio = k2 / k1;
  const regime = ratio >= 3 ? 'steady-state' : ratio <= 1 / 3 ? 'build-up' : 'balanced';
  const slower = k1 < k2 ? 'first step (A → I)' : k2 < k1 ? 'second step (I → P)' : 'both steps equally';

  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="mb-3">
        <h1 className="text-2xl font-black tracking-tight text-white">
          Consecutive <span style={{ color: '#7c3aed' }}>Reactions</span>
        </h1>
        <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
          A →(k₁) I →(k₂) P — watch the intermediate live and die
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)' }}>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
              {[0, 25, 50, 75, 100].map((c) => (
                <g key={c}>
                  <line x1={PAD_L} y1={py(c)} x2={W - PAD_R} y2={py(c)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                  <text x={PAD_L - 6} y={py(c) + 3} fill="#64748b" fontSize={9} textAnchor="end" style={{ fontVariantNumeric: 'tabular-nums' }}>{c}</text>
                </g>
              ))}
              <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
              <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
              {/* curves */}
              <path d={pathOf(sample.A)} fill="none" stroke="#818cf8" strokeWidth={2.5} />
              <path d={pathOf(sample.I)} fill="none" stroke="#f472b6" strokeWidth={2.5} />
              <path d={pathOf(sample.P)} fill="none" stroke="#34d399" strokeWidth={2.5} />
              {/* peak marker for I */}
              {peak.c > 1 && (
                <g>
                  <circle cx={px(peak.t)} cy={py(peak.c)} r={4} fill="#f472b6" />
                  <line x1={px(peak.t)} y1={py(peak.c)} x2={px(peak.t)} y2={H - PAD_B} stroke="#f472b6" strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
                  <text x={px(peak.t)} y={py(peak.c) - 8} fill="#f472b6" fontSize={9} fontWeight={800} textAnchor="middle">I peak {peak.c.toFixed(0)}</text>
                </g>
              )}
              <text x={W / 2} y={H - 3} fill="#94a3b8" fontSize={10} fontWeight={700} textAnchor="middle">time →</text>
              <text x={12} y={H / 2} fill="#94a3b8" fontSize={10} fontWeight={700} textAnchor="middle" transform={`rotate(-90 12 ${H / 2})`}>concentration (%)</text>
              {/* legend */}
              <g transform={`translate(${W - 126},${PAD_T + 2})`}>
                <rect x={-8} y={-10} width={126} height={46} rx={6} fill="rgba(5,6,20,0.72)" stroke="rgba(255,255,255,0.08)" />
                <line x1={0} y1={0} x2={16} y2={0} stroke="#818cf8" strokeWidth={2.5} /><text x={22} y={3} fill="#cbd5e1" fontSize={9}>A (reactant)</text>
                <line x1={0} y1={13} x2={16} y2={13} stroke="#f472b6" strokeWidth={2.5} /><text x={22} y={16} fill="#cbd5e1" fontSize={9}>I (intermediate)</text>
                <line x1={0} y1={26} x2={16} y2={26} stroke="#34d399" strokeWidth={2.5} /><text x={22} y={29} fill="#cbd5e1" fontSize={9}>P (product)</text>
              </g>
            </svg>
          </div>

          <div className="grid grid-cols-1 gap-3 mt-3">
            <Slider label={`k₁  (A → I): ${k1.toFixed(2)}`} min={0.1} max={2} step={0.1} value={k1} onChange={setK1} accent="#818cf8" />
            <Slider label={`k₂  (I → P): ${k2.toFixed(2)}`} min={0.1} max={2} step={0.1} value={k2} onChange={setK2} accent="#34d399" />
          </div>
        </div>

        {/* sidebar */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: '#f472b6' }}>The intermediate</p>
            <p className="text-white font-bold text-base leading-snug">
              I is made from A and consumed to P at the same time, so it <span style={{ color: '#f472b6' }}>rises to a peak, then drains away</span>. Where its peak sits depends entirely on k₁ and k₂.
            </p>
          </div>

          <div style={{
            borderRadius: 10, padding: '12px 14px',
            background: regime === 'steady-state' ? 'rgba(52,211,153,0.06)' : regime === 'build-up' ? 'rgba(244,114,182,0.06)' : 'rgba(129,140,248,0.06)',
            border: `1px solid ${regime === 'steady-state' ? 'rgba(52,211,153,0.25)' : regime === 'build-up' ? 'rgba(244,114,182,0.3)' : 'rgba(129,140,248,0.25)'}`,
          }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: regime === 'steady-state' ? '#34d399' : regime === 'build-up' ? '#f472b6' : '#818cf8' }}>
              {regime === 'steady-state' ? 'Steady-state regime (k₂ ≫ k₁)' : regime === 'build-up' ? 'Build-up regime (k₁ ≫ k₂)' : 'Balanced (k₁ ≈ k₂)'}
            </p>
            <p className="text-sm leading-snug" style={{ color: '#cbd5e1' }}>
              {regime === 'steady-state' && <>The second step is so fast that I is removed almost as soon as it forms — its peak stays <b>low and flat</b>. This is exactly the steady-state approximation.</>}
              {regime === 'build-up' && <>The first step floods I in faster than the second can clear it, so the intermediate <b>piles up</b> to a high peak before draining.</>}
              {regime === 'balanced' && <>With the two steps comparable, I rises to a clear, moderate peak partway through.</>}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Stat label="I peak height" value={`${peak.c.toFixed(0)}%`} color="#f472b6" />
            <Stat label="k₂ / k₁" value={ratio.toFixed(2)} color="#94a3b8" />
          </div>

          <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Rate-determining step</p>
            <p className="text-white text-sm font-bold leading-tight italic">
              &ldquo;The slower step is the <span style={{ color: '#fbbf24' }}>{slower}</span> — it sets the overall pace, just like the pothole stretch on a highway.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ borderRadius: 8, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <p className="text-[9px] font-black uppercase tracking-widest" style={{ color }}>{label}</p>
      <p className="text-lg font-black text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</p>
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
