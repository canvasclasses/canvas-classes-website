'use client';

// Gravitational Force Explorer — Chapter 3: Gravitation
// Newton's Universal Law: F = Gm₁m₂/r²
// Shows force vectors, inverse-square relationship, live formula substitution

import { useState, useMemo } from 'react';

const G_REAL = 6.674e-11; // N·m²/kg² — shown for context

interface Preset {
  label: string;
  m1: number; m2: number; r: number;
  desc: string;
}

const PRESETS: Preset[] = [
  { label: 'Earth–Moon',    m1: 100, m2: 12,  r: 4,  desc: 'Earth pulls the Moon, Moon pulls Earth — equal & opposite.' },
  { label: 'Earth–Sun',     m1: 60,  m2: 100, r: 10, desc: 'The Sun\'s huge mass keeps Earth in orbit despite large distance.' },
  { label: 'Two boulders',  m1: 20,  m2: 20,  r: 2,  desc: 'Gravity between everyday objects is tiny — G is very small.' },
  { label: 'Custom',        m1: 50,  m2: 50,  r: 5,  desc: 'Drag the sliders to explore the law yourself.' },
];

function fmtSci(n: number): string {
  if (n === 0) return '0';
  const exp = Math.floor(Math.log10(Math.abs(n)));
  const coeff = (n / Math.pow(10, exp)).toFixed(2);
  return `${coeff} × 10^${exp}`;
}

export default function GravitationalForceSim() {
  const [m1, setM1] = useState(50);
  const [m2, setM2] = useState(50);
  const [r,  setR]  = useState(5);
  const [preset, setPreset] = useState(3);

  // Normalised force (arbitrary units for visualisation)
  const forceNorm = (m1 * m2) / (r * r);
  const forceRef  = (50 * 50) / (5 * 5);
  const ratio     = forceNorm / forceRef;

  // Real force in Newtons assuming masses in ×10²⁴ kg, r in ×10⁸ m
  const m1_kg = m1 * 1e24;
  const m2_kg = m2 * 1e24;
  const r_m   = r  * 1e8;
  const forceReal = G_REAL * m1_kg * m2_kg / (r_m * r_m);

  // SVG geometry
  const SW = 500, SH = 220;
  const cy = SH / 2;
  const R1 = Math.max(14, Math.min(42, 12 + m1 * 0.28));
  const R2 = Math.max(14, Math.min(42, 12 + m2 * 0.28));
  const minGap = R1 + R2 + 40;
  const maxGap = SW - 60;
  const distPx = minGap + ((r - 1) / 9) * (maxGap - minGap);
  const p1x = (SW - distPx) / 2 + R1;
  const p2x = p1x + distPx - R1;
  const arrowLen = Math.max(6, Math.min(60, ratio * 32));

  // Inverse-square insight: what happens at 2× distance?
  const doubleForce = (m1 * m2) / ((r * 2) * (r * 2));
  const ratioDouble = (doubleForce / forceNorm * 100).toFixed(0);

  function applyPreset(idx: number) {
    const p = PRESETS[idx];
    setM1(p.m1); setM2(p.m2); setR(p.r); setPreset(idx);
  }

  return (
    <div style={{
      background: '#0b0f15', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24, fontFamily: 'system-ui, sans-serif',
      color: '#e2e8f0', maxWidth: 940, margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#fff' }}>
          Gravitational Force Explorer
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          Newton's Universal Law: F = Gm₁m₂ / r² — every mass attracts every other mass
        </p>
      </div>

      {/* Preset buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' as const }}>
        {PRESETS.map((p, i) => (
          <button key={i} onClick={() => applyPreset(i)} style={{
            padding: '5px 14px', borderRadius: 20,
            border: preset === i ? '1px solid #fb923c' : '1px solid rgba(255,255,255,0.1)',
            background: preset === i ? 'rgba(251,146,60,0.12)' : 'rgba(255,255,255,0.03)',
            color: preset === i ? '#fb923c' : '#94a3b8',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Two-column body */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* LEFT — SVG visualisation */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            background: 'linear-gradient(135deg, #060d1f 0%, #0a0e1a 100%)',
            border: '1px solid rgba(251,146,60,0.15)',
            borderRadius: 14, overflow: 'hidden',
          }}>
            <svg viewBox={`0 0 ${SW} ${SH}`} style={{ width: '100%', display: 'block' }}>
              {/* Space background stars */}
              {useMemo(() => Array.from({ length: 30 }, (_, i) => (
                <circle key={i} cx={(i * 173) % SW} cy={(i * 97) % SH}
                  r={0.8} fill="rgba(255,255,255,0.35)" />
              )), [])}

              {/* Distance bracket */}
              <line x1={p1x} y1={28} x2={p2x} y2={28}
                stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="3,3" />
              <line x1={p1x} y1={22} x2={p1x} y2={34}
                stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
              <line x1={p2x} y1={22} x2={p2x} y2={34}
                stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
              <text x={(p1x + p2x) / 2} y={20} textAnchor="middle"
                fill="#94a3b8" fontSize={10}>
                r = {r} units
              </text>

              {/* Force arrows — pointing inward */}
              {/* Arrow from m1 toward m2 */}
              <defs>
                <marker id="arr-orange" markerWidth="6" markerHeight="6"
                  refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#fb923c" />
                </marker>
              </defs>
              <line
                x1={p1x + R1 + 4} y1={cy}
                x2={p1x + R1 + 4 + arrowLen} y2={cy}
                stroke="#fb923c" strokeWidth={2.5}
                markerEnd="url(#arr-orange)"
              />
              <line
                x1={p2x - R2 - 4} y1={cy}
                x2={p2x - R2 - 4 - arrowLen} y2={cy}
                stroke="#fb923c" strokeWidth={2.5}
                markerEnd="url(#arr-orange)"
              />

              {/* Body 1 — blue planet */}
              <circle cx={p1x} cy={cy} r={R1}
                fill="url(#grad1)" stroke="#60a5fa" strokeWidth={1.5} />
              <defs>
                <radialGradient id="grad1" cx="35%" cy="35%">
                  <stop offset="0%" stopColor="#93c5fd" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </radialGradient>
                <radialGradient id="grad2" cx="35%" cy="35%">
                  <stop offset="0%" stopColor="#fcd34d" />
                  <stop offset="100%" stopColor="#b45309" />
                </radialGradient>
              </defs>
              <text x={p1x} y={cy + R1 + 14} textAnchor="middle"
                fill="#93c5fd" fontSize={11} fontWeight={700}>
                m₁ = {m1}
              </text>

              {/* Body 2 — amber planet */}
              <circle cx={p2x} cy={cy} r={R2}
                fill="url(#grad2)" stroke="#fbbf24" strokeWidth={1.5} />
              <text x={p2x} y={cy + R2 + 14} textAnchor="middle"
                fill="#fbbf24" fontSize={11} fontWeight={700}>
                m₂ = {m2}
              </text>

              {/* Force label */}
              <text x={SW / 2} y={SH - 12} textAnchor="middle"
                fill="#fb923c" fontSize={11} fontWeight={600}>
                F ∝ {forceNorm.toFixed(0)} units  (arrows show magnitude)
              </text>
            </svg>
          </div>

          {/* Inverse-square callout */}
          <div style={{
            marginTop: 12,
            background: 'rgba(251,146,60,0.07)',
            border: '1px solid rgba(251,146,60,0.2)',
            borderRadius: 10, padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 22 }}>🔬</span>
            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>
              <strong style={{ color: '#fb923c' }}>Inverse-square law: </strong>
              At double the distance (r → 2r), force becomes{' '}
              <strong style={{ color: '#fbbf24' }}>{ratioDouble}%</strong> — just ¼ of its value.
              Triple the distance → force falls to <strong style={{ color: '#fbbf24' }}>1/9th</strong>.
            </p>
          </div>
        </div>

        {/* RIGHT — controls + formula */}
        <div style={{ width: 240, flexShrink: 0 }}>

          {/* Sliders */}
          {([
            { label: 'm₁ — Mass of body 1', val: m1, set: setM1, color: '#60a5fa' },
            { label: 'm₂ — Mass of body 2', val: m2, set: setM2, color: '#fbbf24' },
            { label: 'r — Distance', val: r, set: setR, color: '#a78bfa', min: 1, max: 10 },
          ] as { label: string; val: number; set: (n: number) => void; color: string; min?: number; max?: number }[])
            .map(({ label, val, set, color, min = 1, max = 100 }) => (
              <div key={label} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: 13, color, fontWeight: 700 }}>{val}</span>
                </div>
                <input type="range" min={min} max={max} value={val}
                  onChange={e => { set(Number(e.target.value)); setPreset(3); }}
                  style={{ width: '100%', accentColor: color }} />
              </div>
            ))}

          {/* Live formula */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '14px 12px',
            marginBottom: 14,
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              Live Formula
            </p>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600, lineHeight: 1.4 }}>
                <span style={{ color: '#fb923c' }}>F</span>
                {' = G × '}
                <span style={{ color: '#60a5fa' }}>{m1}</span>
                {' × '}
                <span style={{ color: '#fbbf24' }}>{m2}</span>
                {' / '}
                <span style={{ color: '#a78bfa' }}>{r}²</span>
              </div>
            </div>
            <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 8 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 3 }}>With real masses (×10²⁴ kg)</div>
              <div style={{ fontSize: 14, color: '#fb923c', fontWeight: 700 }}>
                ≈ {fmtSci(forceReal)} N
              </div>
            </div>
          </div>

          {/* Key facts */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10, padding: '12px',
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Key Facts
            </p>
            {[
              ['G', '6.674 × 10⁻¹¹ N·m²/kg²'],
              ['Direction', 'Always attractive'],
              ['Range', 'Infinite (weakens with r²)'],
              ['Newton\'s 3rd', 'F₁₂ = −F₂₁'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between',
                marginBottom: 6, alignItems: 'flex-start', gap: 4 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>{k}</span>
                <span style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 600, textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Preset description */}
          <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.55,
            marginTop: 12, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {PRESETS[preset].desc}
          </p>
        </div>
      </div>
    </div>
  );
}
