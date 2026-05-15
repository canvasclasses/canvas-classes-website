'use client';

// Archimedes' Principle Simulator — Chapter 3: Gravitation
// Upthrust = weight of fluid displaced = ρ_fluid × V × g
// Objects float if ρ_object < ρ_fluid, sink if ρ_object > ρ_fluid

import { useState } from 'react';

const G = 9.8;        // m/s²
const RHO_WATER = 1000; // kg/m³

interface Material {
  label: string;
  emoji: string;
  density: number;  // kg/m³
  color: string;
  desc: string;
}

const MATERIALS: Material[] = [
  { label: 'Cork',      emoji: '🟤', density: 200,  color: '#a16207', desc: 'Very light — floats high with most of it above water.' },
  { label: 'Wood',      emoji: '🪵', density: 600,  color: '#92400e', desc: 'Less dense than water — floats with 60% submerged.' },
  { label: 'Plastic',   emoji: '🟦', density: 900,  color: '#3b82f6', desc: 'Just below water density — barely floats.' },
  { label: 'Water',     emoji: '💧', density: 1000, color: '#60a5fa', desc: 'Same density as water — suspended at any depth.' },
  { label: 'Aluminium', emoji: '⬜', density: 2700, color: '#94a3b8', desc: 'Denser than water — sinks, feels lighter in water.' },
  { label: 'Iron',      emoji: '🔩', density: 7874, color: '#475569', desc: 'Much denser — sinks quickly. Ships float by trapping air.' },
  { label: 'Lead',      emoji: '⚫', density: 11340, color: '#1e293b', desc: 'Very dense — sinks fast with small upthrust vs weight.' },
];

const FLUIDS = [
  { label: 'Fresh water', density: 1000, color: '#3b82f6', colorLight: '#bfdbfe' },
  { label: 'Sea water',   density: 1025, color: '#0891b2', colorLight: '#a5f3fc' },
  { label: 'Oil',         density: 800,  color: '#d97706', colorLight: '#fde68a' },
  { label: 'Mercury',     density: 13600, color: '#94a3b8', colorLight: '#e2e8f0' },
];

export default function ArchimedesPrincipleSim() {
  const [matIdx,   setMatIdx]   = useState(4);       // Aluminium default
  const [fluidIdx, setFluidIdx] = useState(0);       // Fresh water
  const [volume,   setVolume]   = useState(1.0);     // litres (= 0.001 m³)
  const [submerged, setSubmerged] = useState(false);

  const mat   = MATERIALS[matIdx];
  const fluid = FLUIDS[fluidIdx];

  const vol_m3     = volume * 0.001;       // litres → m³
  const mass_obj   = mat.density * vol_m3; // kg
  const weight_air = mass_obj * G;         // N (weight in air)

  // Upthrust = ρ_fluid × V_submerged × g
  // Float: if mat.density <= fluid.density, object floats with fraction submerged = ρ_obj/ρ_fluid
  const floats = mat.density <= fluid.density;
  const fracSubmerged = floats ? mat.density / fluid.density : 1.0; // fraction below waterline

  const volSubmerged = vol_m3 * (submerged ? 1 : floats ? fracSubmerged : 1);
  const upthrust     = fluid.density * volSubmerged * G;
  const apparentWeight = Math.max(0, weight_air - upthrust);

  // SVG dimensions
  const SW = 260, SH = 340;
  const waterTop = 80;
  const waterH   = 200;
  const waterBot = waterTop + waterH;

  // Object size in SVG (scaled by volume)
  const objR  = Math.max(14, Math.min(38, 14 + volume * 8));

  // Object position:
  // - in air: centre just above water surface
  // - in water (floats): sits at waterline with fracSubmerged below
  // - in water (sinks): rests on bottom
  let objCy: number;
  if (!submerged) {
    objCy = waterTop - objR - 8; // above water
  } else if (floats) {
    // centre such that fracSubmerged fraction is below waterTop
    objCy = waterTop - objR * (1 - 2 * fracSubmerged);
  } else {
    objCy = waterBot - objR - 4; // sitting on bottom
  }

  // Weight arrows (in air: just weight down; in water: weight down + upthrust up)
  const arrowScale = 40;
  const wtArrow = Math.min(80, (weight_air / (mass_obj * G)) * arrowScale);
  const utArrow = submerged ? Math.min(70, (upthrust / (weight_air + 0.01)) * arrowScale) : 0;

  return (
    <div style={{
      background: '#0b0f15', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24, fontFamily: 'system-ui, sans-serif',
      color: '#e2e8f0', maxWidth: 940, margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Archimedes' Principle</h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          Upthrust = weight of fluid displaced — objects float when ρ_object &lt; ρ_fluid
        </p>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* LEFT — fluid tank visualisation */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            background: '#060a18',
            border: `1px solid ${fluid.color}40`,
            borderRadius: 14, overflow: 'hidden',
            display: 'flex', justifyContent: 'center',
          }}>
            <svg viewBox={`0 0 ${SW} ${SH}`}
              style={{ width: '100%', maxWidth: SW, display: 'block' }}>

              <defs>
                <linearGradient id="fluid-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={fluid.color} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={fluid.color} stopOpacity={0.85} />
                </linearGradient>
                <clipPath id="tank-clip">
                  <rect x={40} y={waterTop} width={SW - 80} height={waterH} />
                </clipPath>
              </defs>

              {/* Tank walls */}
              <rect x={40} y={waterTop} width={SW - 80} height={waterH + 8}
                rx={4} fill="rgba(255,255,255,0.03)"
                stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />

              {/* Fluid body */}
              <rect x={41} y={waterTop + 1} width={SW - 82} height={waterH + 5}
                fill="url(#fluid-grad)" clipPath="url(#tank-clip)" />

              {/* Water surface shimmer */}
              <line x1={41} y1={waterTop + 1} x2={SW - 41} y2={waterTop + 1}
                stroke={fluid.colorLight} strokeWidth={1.5} opacity={0.5} />

              {/* Displaced water level indicator (when submerged) */}
              {submerged && (
                <>
                  <line x1={41} y1={waterTop - 6} x2={SW - 41} y2={waterTop - 6}
                    stroke={fluid.colorLight} strokeWidth={1} strokeDasharray="3,3" opacity={0.4} />
                  <text x={SW - 38} y={waterTop - 2} fill={fluid.colorLight}
                    fontSize={8} textAnchor="start" opacity={0.7}>
                    +displaced
                  </text>
                </>
              )}

              {/* Object */}
              <circle cx={SW / 2} cy={objCy} r={objR}
                fill={mat.color} stroke={mat.color} strokeWidth={1.5} opacity={0.9} />
              <text x={SW / 2} y={objCy + 4} textAnchor="middle"
                fill="#fff" fontSize={10} fontWeight={700}>{mat.emoji}</text>

              {/* String (only when submerged and sinks) */}
              {submerged && !floats && (
                <line x1={SW / 2} y1={objCy - objR}
                  x2={SW / 2} y2={20}
                  stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3,3" />
              )}

              {/* Force arrows */}
              {/* Weight (always down) */}
              <defs>
                <marker id="arr-down-red" markerWidth="6" markerHeight="6"
                  refX="3" refY="6" orient="auto">
                  <path d="M0,0 L3,6 L6,0" fill="none" stroke="#f87171" strokeWidth={1.5} />
                </marker>
                <marker id="arr-up-green" markerWidth="6" markerHeight="6"
                  refX="3" refY="0" orient="auto">
                  <path d="M0,6 L3,0 L6,6" fill="none" stroke="#4ade80" strokeWidth={1.5} />
                </marker>
              </defs>

              <line x1={SW / 2} y1={objCy + objR + 2}
                x2={SW / 2} y2={objCy + objR + 2 + wtArrow}
                stroke="#f87171" strokeWidth={2.5}
                markerEnd="url(#arr-down-red)" />
              <text x={SW / 2 + 8} y={objCy + objR + wtArrow / 2 + 6}
                fill="#f87171" fontSize={9}>W</text>

              {/* Upthrust (up) */}
              {submerged && upthrust > 0.1 && (
                <>
                  <line x1={SW / 2} y1={objCy - objR - 2}
                    x2={SW / 2} y2={objCy - objR - 2 - utArrow}
                    stroke="#4ade80" strokeWidth={2.5}
                    markerEnd="url(#arr-up-green)" />
                  <text x={SW / 2 + 8} y={objCy - objR - utArrow / 2 - 2}
                    fill="#4ade80" fontSize={9}>U</text>
                </>
              )}

              {/* Labels */}
              <text x={SW / 2} y={SH - 18} textAnchor="middle"
                fill={floats ? '#4ade80' : '#f87171'} fontSize={11} fontWeight={700}>
                {!submerged ? `${mat.label} — drag into water →` : floats ? '✓ Floats!' : '↓ Sinks'}
              </text>
              <text x={SW / 2} y={SH - 6} textAnchor="middle"
                fill="#475569" fontSize={9}>
                ρ_obj = {mat.density} | ρ_fluid = {fluid.density} kg/m³
              </text>
            </svg>
          </div>

          {/* Submerge button */}
          <button onClick={() => setSubmerged(v => !v)} style={{
            width: '100%', marginTop: 12,
            padding: '11px 0', borderRadius: 10,
            border: 'none', cursor: 'pointer',
            background: submerged
              ? 'linear-gradient(135deg, #0891b2, #06b6d4)'
              : `linear-gradient(135deg, ${fluid.color}, #0369a1)`,
            color: '#fff', fontSize: 13, fontWeight: 700,
          }}>
            {submerged ? '⬆ Lift out of water' : '⬇ Submerge in water'}
          </button>

          {/* Readings */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 8, marginTop: 12,
          }}>
            {[
              { label: 'Weight (air)', val: `${weight_air.toFixed(2)} N`, color: '#f87171' },
              { label: 'Upthrust', val: submerged ? `${upthrust.toFixed(2)} N` : '—', color: '#4ade80' },
              { label: 'App. weight', val: submerged ? `${apparentWeight.toFixed(2)} N` : '—', color: '#fbbf24' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, padding: '8px 10px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 9, color: '#64748b', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: 14, color, fontWeight: 700 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — controls */}
        <div style={{ width: 244, flexShrink: 0 }}>

          {/* Material selector */}
          <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
            letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Object material
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 18 }}>
            {MATERIALS.map((m, i) => (
              <button key={m.label} onClick={() => { setMatIdx(i); setSubmerged(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 10px', borderRadius: 8,
                border: matIdx === i
                  ? `1px solid ${m.color}` : '1px solid rgba(255,255,255,0.07)',
                background: matIdx === i ? `${m.color}1a` : 'rgba(255,255,255,0.02)',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <span style={{ fontSize: 14 }}>{m.emoji}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, color: matIdx === i ? m.color : '#94a3b8',
                    fontWeight: 600 }}>{m.label}</span>
                  <span style={{ fontSize: 10, color: '#475569', marginLeft: 6 }}>
                    {m.density} kg/m³
                  </span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700,
                  color: m.density <= fluid.density ? '#4ade80' : '#f87171' }}>
                  {m.density <= fluid.density ? 'FLOAT' : 'SINK'}
                </span>
              </button>
            ))}
          </div>

          {/* Fluid selector */}
          <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
            letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Fluid
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 18 }}>
            {FLUIDS.map((f, i) => (
              <button key={f.label} onClick={() => { setFluidIdx(i); setSubmerged(false); }} style={{
                padding: '7px 8px', borderRadius: 8,
                border: fluidIdx === i
                  ? `1px solid ${f.color}` : '1px solid rgba(255,255,255,0.07)',
                background: fluidIdx === i ? `${f.color}1a` : 'transparent',
                cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{ fontSize: 11, color: fluidIdx === i ? f.color : '#94a3b8', fontWeight: 600 }}>
                  {f.label}
                </div>
                <div style={{ fontSize: 10, color: '#475569' }}>{f.density} kg/m³</div>
              </button>
            ))}
          </div>

          {/* Volume slider */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Object volume</span>
              <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 700 }}>{volume.toFixed(1)} L</span>
            </div>
            <input type="range" min={0.2} max={5} step={0.2} value={volume}
              onChange={e => { setVolume(Number(e.target.value)); setSubmerged(false); }}
              style={{ width: '100%', accentColor: '#a78bfa' }} />
          </div>

          {/* Formula box */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10, padding: '12px 14px',
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              Archimedes' Formula
            </p>
            <div style={{ fontSize: 12, color: '#60a5fa', fontWeight: 600,
              lineHeight: 1.8, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8, marginBottom: 8 }}>
              U = ρ_fluid × V × g<br />
              W_apparent = W − U
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>
              <div>U = <span style={{ color: '#4ade80' }}>{fluid.density}</span> × <span style={{ color: '#a78bfa' }}>{vol_m3.toFixed(4)}</span> × 9.8</div>
              <div style={{ color: '#4ade80', fontWeight: 700 }}>= {upthrust.toFixed(2)} N</div>
            </div>
          </div>

          {/* Insight */}
          <div style={{
            marginTop: 12,
            background: 'rgba(74,222,128,0.07)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: 10, padding: '10px 12px',
          }}>
            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', lineHeight: 1.55 }}>
              <strong style={{ color: '#4ade80' }}>💡 {mat.label}: </strong>
              {mat.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
