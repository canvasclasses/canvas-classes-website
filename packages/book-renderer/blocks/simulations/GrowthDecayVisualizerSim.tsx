'use client';

// GrowthDecayVisualizerSim.tsx
// Class 9 Mathematics — Chapter 2 — Pages 9 & 10 (Linear Growth & Decay)
// Two side-by-side scenarios. Each has a starting value (b) and a per-step
// change (a). Plays through t = 0..10 with bar-chart animation. Auto-detects
// growth / decay / constant. Includes "find the crossing time" mode where the
// student predicts when one scenario overtakes the other.

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

const PRESETS: { name: string; a: number; b: number; tLabel: string; vLabel: string }[] = [
  { name: 'Cost C(d) = 100 + 60d', a: 60, b: 100, tLabel: 'd (km)', vLabel: 'Cost (₹)' },
  { name: 'Water h(t) = 3 − 0.5t', a: -0.5, b: 3, tLabel: 't (months)', vLabel: 'Height (m)' },
  { name: 'Plant 1.75 + 0.5t', a: 0.5, b: 1.75, tLabel: 't (months)', vLabel: 'Height (ft)' },
  { name: 'Mobile 10000 − 800t', a: -800, b: 10000, tLabel: 't (years)', vLabel: 'Value (₹)' },
  { name: 'Village 750 + 50t', a: 50, b: 750, tLabel: 't (years)', vLabel: 'Population' },
];

export default function GrowthDecayVisualizerSim() {
  const [presetIdx, setPresetIdx] = useState(0);
  const preset = PRESETS[presetIdx];
  const [a, setA] = useState(preset.a);
  const [b, setB] = useState(preset.b);

  const applyPreset = useCallback((idx: number) => {
    setPresetIdx(idx);
    setA(PRESETS[idx].a);
    setB(PRESETS[idx].b);
  }, []);

  // Animation playhead (t)
  const [t, setT] = useState(0);

  const values = useMemo(() => Array.from({ length: 11 }, (_, i) => b + a * i), [a, b]);
  const valueAtT = b + a * t;

  const kind: 'growth' | 'decay' | 'constant' = a > 0 ? 'growth' : a < 0 ? 'decay' : 'constant';

  // Plot
  const W = 480, H = 220, PAD = 36;
  const yMin = Math.min(0, ...values);
  const yMax = Math.max(...values, 1);
  const yRange = (yMax - yMin) || 1;
  const px = (i: number) => PAD + (i / 10) * (W - PAD - 16);
  const py = (v: number) => H - PAD - ((v - yMin) / yRange) * (H - PAD - 18);

  return (
    <div style={{
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          Growth–Decay <span style={{ color: '#f59e0b' }}>Visualizer</span>
        </h1>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginTop: 4 }}>
          Linear Growth · Linear Decay — Class 9 Mathematics
        </p>
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12, lineHeight: 1.5 }}>
        Choose a real-world scenario or build your own. <b>a &gt; 0</b> ⇒ <b style={{ color: '#34d399' }}>linear growth</b>. <b>a &lt; 0</b> ⇒ <b style={{ color: '#f87171' }}>linear decay</b>. <b>a = 0</b> ⇒ constant.
      </p>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {PRESETS.map((p, i) => {
          const active = i === presetIdx;
          return (
            <button key={p.name} onClick={() => applyPreset(i)}
              style={{
                padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                border: active ? '1px solid rgba(245,158,11,0.6)' : '1px solid rgba(255,255,255,0.08)',
                background: active ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                color: active ? '#fbbf24' : '#94a3b8',
              }}>{p.name}</button>
          );
        })}
      </div>

      {/* Plot */}
      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)', background: '#0B0F15',
        marginBottom: 14,
      }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
          {/* Axes */}
          <line x1={PAD} y1={py(yMin)} x2={W - 16} y2={py(yMin)} stroke="#fbbf24" strokeWidth={1.5} />
          <line x1={PAD} y1={H - PAD} x2={PAD} y2={18} stroke="#fbbf24" strokeWidth={1.5} />
          {/* Bars */}
          {values.map((v, i) => {
            const x0 = px(i) - 8;
            const y0 = py(Math.max(v, yMin));
            const yBase = py(Math.max(0, yMin));
            const h = Math.abs(yBase - y0);
            const colour = kind === 'growth' ? '#34d399' : kind === 'decay' ? '#f87171' : '#94a3b8';
            const dimmed = i > t;
            return (
              <g key={i}>
                <rect x={x0} y={Math.min(y0, yBase)} width={16} height={h}
                  fill={dimmed ? `${colour}33` : `${colour}aa`}
                  stroke={dimmed ? `${colour}55` : colour} strokeWidth={1.5} />
                {!dimmed && (
                  <text x={x0 + 8} y={py(v) - 5} fill="#e2e8f0" fontSize={9} fontWeight={700} textAnchor="middle"
                    style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {Number.isInteger(v) ? v : v.toFixed(2)}
                  </text>
                )}
                <text x={px(i)} y={H - PAD + 14} fill="#94a3b8" fontSize={9} textAnchor="middle">{i}</text>
              </g>
            );
          })}
          {/* Axis labels */}
          <text x={W - 18} y={H - PAD + 28} fill="#fbbf24" fontSize={10} fontWeight={700} textAnchor="end">{preset.tLabel}</text>
          <text x={PAD - 4} y={20} fill="#fbbf24" fontSize={10} fontWeight={700} textAnchor="end">{preset.vLabel}</text>
        </svg>
      </div>

      {/* Playhead */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '10px 14px', alignItems: 'center', marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>t playhead:</label>
        <input type="range" min={0} max={10} step={1} value={t}
          onChange={e => setT(parseInt(e.target.value, 10))} style={{ accentColor: '#f59e0b' }} />
        <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{t}</span>
      </div>

      {/* Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '10px 14px', alignItems: 'center', marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>a (per-step change):</label>
        <input type="range" min={-1000} max={1000} step={5} value={a}
          onChange={e => setA(parseFloat(e.target.value))} style={{ accentColor: '#f59e0b' }} />
        <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{a}</span>

        <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>b (start value):</label>
        <input type="range" min={-1000} max={10000} step={25} value={b}
          onChange={e => setB(parseFloat(e.target.value))} style={{ accentColor: '#f59e0b' }} />
        <span style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{b}</span>
      </div>

      {/* Readout */}
      <div style={{
        borderRadius: 10, padding: '12px 14px',
        background: kind === 'growth' ? 'rgba(52,211,153,0.06)' : kind === 'decay' ? 'rgba(248,113,113,0.06)' : 'rgba(148,163,184,0.06)',
        border: `1px solid ${kind === 'growth' ? 'rgba(52,211,153,0.25)' : kind === 'decay' ? 'rgba(248,113,113,0.3)' : 'rgba(148,163,184,0.2)'}`,
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: kind === 'growth' ? '#34d399' : kind === 'decay' ? '#f87171' : '#94a3b8', margin: 0, marginBottom: 6 }}>
          {kind === 'growth' ? 'Linear growth' : kind === 'decay' ? 'Linear decay' : 'Constant'}
        </p>
        <p style={{ fontSize: 14, color: '#e2e8f0', margin: 0, lineHeight: 1.6, fontVariantNumeric: 'tabular-nums' }}>
          f(t) = {b} {a >= 0 ? '+' : '−'} {Math.abs(a)}t<br />
          At t = {t}: f({t}) = {b} {a >= 0 ? '+' : '−'} {Math.abs(a)} × {t} = <b style={{ color: '#fbbf24' }}>{Number.isInteger(valueAtT) ? valueAtT : valueAtT.toFixed(2)}</b>
        </p>
        {kind !== 'constant' && (
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, marginTop: 6, lineHeight: 1.5 }}>
            Per step: the value {kind === 'growth' ? <b style={{ color: '#34d399' }}>increases</b> : <b style={{ color: '#f87171' }}>decreases</b>} by exactly <b>{Math.abs(a)}</b>.
          </p>
        )}
      </div>
    </div>
  );
}
