'use client';

// Sound Wave Simulator — Chapter 12: Sound
// Animated longitudinal wave showing compressions and rarefactions.
// Academic accuracy:
//   - Longitudinal wave: molecules oscillate PARALLEL to wave direction
//   - Compression = high density, high pressure region
//   - Rarefaction = low density, low pressure region
//   - λ = v / f (v = 343 m/s for sound in air)

import { useState, useEffect, useRef, useCallback } from 'react';

const NUM_MOLECULES = 40;
const SVG_W = 500;
const MOL_SVG_H = 160;
const PRESSURE_H = 70;
const SOUND_SPEED = 343; // m/s (for display only)

// Molecule base x positions
const BASE_XS = Array.from({ length: NUM_MOLECULES }, (_, i) =>
  (i + 0.5) * (SVG_W / NUM_MOLECULES)
);

function getMoleculeX(baseX: number, index: number, amplitude: number, freq: number, time: number): number {
  const A_px = amplitude * 8;
  const displacement = A_px * Math.sin(2 * Math.PI * freq * time - (2 * Math.PI * index) / 10);
  return baseX + displacement;
}

// Compute local density for a molecule: compare distance to neighbors
function getDensity(positions: number[], i: number): number {
  // Average of inverse distances to neighbors
  let sum = 0;
  let count = 0;
  const spacing = SVG_W / NUM_MOLECULES;
  for (let j = Math.max(0, i - 3); j <= Math.min(NUM_MOLECULES - 1, i + 3); j++) {
    if (j === i) continue;
    const dist = Math.abs(positions[i] - positions[j]);
    if (dist > 0.5) {
      sum += spacing / dist;
      count++;
    }
  }
  return count > 0 ? sum / count : 1;
}

function densityToColor(density: number): string {
  // density ~1 = normal, >1 = compression, <1 = rarefaction
  const t = Math.max(0, Math.min(1, (density - 0.3) / 1.4));
  // low density: dim blue  #1e3a5f  →  high density: bright blue  #93c5fd
  const r = Math.round(30 + t * (147 - 30));
  const g = Math.round(58 + t * (197 - 58));
  const b = Math.round(95 + t * (253 - 95));
  return `rgb(${r},${g},${b})`;
}

// ── Molecule animation SVG ─────────────────────────────────────────────────────

function MoleculeField({
  frequency, amplitude, animTime,
}: { frequency: number; amplitude: number; animTime: number }) {
  const molY = MOL_SVG_H / 2;

  const positions = BASE_XS.map((bx, i) =>
    getMoleculeX(bx, i, amplitude, frequency, animTime)
  );
  const densities = positions.map((_, i) => getDensity(positions, i));

  // Find a compression and rarefaction region for labels
  const maxDensIdx = densities.reduce((best, d, i) => d > densities[best] ? i : best, 0);
  const minDensIdx = densities.reduce((best, d, i) => d < densities[best] ? i : best, 0);

  return (
    <svg viewBox={`0 0 ${SVG_W} ${MOL_SVG_H}`} style={{ width: '100%', display: 'block' }}>
      {/* Background */}
      <rect x={0} y={0} width={SVG_W} height={MOL_SVG_H} fill="#060d1f" />

      {/* Center line (equilibrium) */}
      <line x1={0} y1={molY} x2={SVG_W} y2={molY}
        stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4,4" />

      {/* Molecules */}
      {positions.map((x, i) => (
        <circle
          key={i}
          cx={Math.max(4, Math.min(SVG_W - 4, x))}
          cy={molY}
          r={4.5}
          fill={densityToColor(densities[i])}
          opacity={0.9}
        />
      ))}

      {/* Compression label */}
      {maxDensIdx > 2 && maxDensIdx < NUM_MOLECULES - 3 && (
        <g>
          <line x1={positions[maxDensIdx]} y1={molY - 18} x2={positions[maxDensIdx]} y2={molY - 8}
            stroke="#93c5fd" strokeWidth={1.2} />
          <text x={positions[maxDensIdx]} y={molY - 22} textAnchor="middle"
            fill="#93c5fd" fontSize={9} fontWeight={700}>
            COMPRESSION
          </text>
        </g>
      )}

      {/* Rarefaction label */}
      {minDensIdx > 2 && minDensIdx < NUM_MOLECULES - 3 && (
        <g>
          <line x1={positions[minDensIdx]} y1={molY + 8} x2={positions[minDensIdx]} y2={molY + 18}
            stroke="#1e6a9f" strokeWidth={1.2} />
          <text x={positions[minDensIdx]} y={molY + 28} textAnchor="middle"
            fill="#60a5fa" fontSize={9} fontWeight={700}>
            RAREFACTION
          </text>
        </g>
      )}

      {/* Wave direction arrow */}
      <defs>
        <marker id="sw-arrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#64748b" />
        </marker>
      </defs>
      <line x1={SVG_W - 80} y1={MOL_SVG_H - 12} x2={SVG_W - 20} y2={MOL_SVG_H - 12}
        stroke="#64748b" strokeWidth={1.5} markerEnd="url(#sw-arrow)" />
      <text x={SVG_W - 105} y={MOL_SVG_H - 8} fill="#64748b" fontSize={9}>wave →</text>
    </svg>
  );
}

// ── Pressure (sine) wave SVG ───────────────────────────────────────────────────

function PressureWave({
  frequency, amplitude, animTime,
}: { frequency: number; amplitude: number; animTime: number }) {
  const midY = PRESSURE_H / 2;
  const A_px = (amplitude / 5) * (PRESSURE_H / 2 - 8);

  const points: string[] = [];
  for (let px = 0; px <= SVG_W; px += 2) {
    const phase = (px / SVG_W) * 10; // 10 / (2π) wave cycles across width
    const y = midY - A_px * Math.sin(2 * Math.PI * (phase - frequency * animTime));
    points.push(`${px},${y}`);
  }

  return (
    <svg viewBox={`0 0 ${SVG_W} ${PRESSURE_H}`} style={{ width: '100%', display: 'block' }}>
      <rect x={0} y={0} width={SVG_W} height={PRESSURE_H} fill="#04091a" />

      {/* Baseline */}
      <line x1={0} y1={midY} x2={SVG_W} y2={midY}
        stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

      {/* Pressure labels */}
      <text x={4} y={14} fill="#60a5fa" fontSize={8} fontWeight={600}>High pressure</text>
      <text x={4} y={PRESSURE_H - 5} fill="#1e6a9f" fontSize={8} fontWeight={600}>Low pressure</text>

      {/* Pressure wave line */}
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="#6366f1"
        strokeWidth={2}
        opacity={0.85}
      />

      {/* Y-axis label */}
      <text x={SVG_W - 60} y={PRESSURE_H / 2 + 4} fill="#64748b" fontSize={9}>
        Pressure →
      </text>
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function SoundWaveSim() {
  const [frequency, setFrequency] = useState(3);
  const [amplitude, setAmplitude] = useState(3);
  const [running, setRunning] = useState(true);

  const animTimeRef = useRef(0);
  const lastTimestampRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const [animTime, setAnimTime] = useState(0);

  const wavelength = (SOUND_SPEED / frequency).toFixed(1);

  const tick = useCallback((timestamp: number) => {
    if (lastTimestampRef.current === null) {
      lastTimestampRef.current = timestamp;
    }
    const dt = (timestamp - lastTimestampRef.current) / 1000;
    lastTimestampRef.current = timestamp;
    animTimeRef.current += dt;
    setAnimTime(animTimeRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (running) {
      lastTimestampRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [running, tick]);

  const concepts = [
    {
      label: 'Longitudinal wave',
      desc: 'Molecules move PARALLEL to wave direction (not up-down!)',
      color: '#818cf8',
    },
    {
      label: 'Compression',
      desc: 'Molecules pushed together → high pressure region',
      color: '#93c5fd',
    },
    {
      label: 'Rarefaction',
      desc: 'Molecules pulled apart → low pressure region',
      color: '#60a5fa',
    },
    {
      label: 'No medium = no sound',
      desc: 'Sound needs a medium — space is silent!',
      color: '#f87171',
    },
  ];

  return (
    <div style={{
      background: '#0b0f15',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24,
      maxWidth: 940,
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif',
      color: '#e2e8f0',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#fff' }}>
          Sound Wave — Longitudinal Wave Visualiser
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          Watch molecules oscillate parallel to wave direction — creating compressions and rarefactions
        </p>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>

        {/* LEFT — animation */}
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <div style={{
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            {/* Label */}
            <div style={{
              background: '#060d1f',
              padding: '6px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
                letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                Molecule motion (longitudinal)
              </span>
            </div>

            {/* Molecule field */}
            <MoleculeField
              frequency={frequency}
              amplitude={amplitude}
              animTime={animTime}
            />

            {/* Pressure wave label */}
            <div style={{
              background: '#04091a',
              padding: '6px 12px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600,
                letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                Pressure variation (same wave)
              </span>
            </div>

            {/* Pressure sine wave */}
            <PressureWave
              frequency={frequency}
              amplitude={amplitude}
              animTime={animTime}
            />
          </div>

          {/* Wavelength display */}
          <div style={{
            marginTop: 10,
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap' as const,
          }}>
            {[
              { label: 'Frequency', value: `${frequency} Hz`, color: '#fbbf24' },
              { label: 'Wavelength λ = v/f', value: `${wavelength} m`, color: '#34d399' },
              { label: 'Speed (air)', value: '343 m/s', color: '#94a3b8' },
            ].map(item => (
              <div key={item.label} style={{
                flex: '1 1 100px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8,
                padding: '8px 10px',
              }}>
                <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 15, color: item.color, fontWeight: 800 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Controls */}
        <div style={{ flex: '1 1 220px' }}>

          {/* Play/Pause */}
          <button
            onClick={() => setRunning(r => !r)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: running ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.15)',
              background: running ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.05)',
              color: running ? '#34d399' : '#94a3b8',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: 20,
              letterSpacing: '0.02em',
            }}
          >
            {running ? '⏸ Pause' : '▶ Play'}
          </button>

          {/* Frequency slider */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                Frequency
              </span>
              <span style={{ fontSize: 18, color: '#fbbf24', fontWeight: 700 }}>
                {frequency} Hz
              </span>
            </div>
            <input
              type="range" min={1} max={8} step={1} value={frequency}
              onChange={e => setFrequency(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#fbbf24' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', marginTop: 2 }}>
              <span>1 Hz (slow)</span><span>8 Hz (fast)</span>
            </div>
          </div>

          {/* Amplitude slider */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                Amplitude
              </span>
              <span style={{ fontSize: 18, color: '#818cf8', fontWeight: 700 }}>
                {amplitude}
              </span>
            </div>
            <input
              type="range" min={1} max={5} step={1} value={amplitude}
              onChange={e => setAmplitude(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#818cf8' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', marginTop: 2 }}>
              <span>Quiet</span><span>Loud</span>
            </div>
          </div>

          {/* Key concepts */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            padding: '12px',
          }}>
            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              Key Concepts
            </p>
            {concepts.map(c => (
              <div key={c.label} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: c.color, fontWeight: 700, marginBottom: 2 }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>
                  {c.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Amplitude vs loudness note */}
          <div style={{
            marginTop: 12,
            background: 'rgba(99,102,241,0.07)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 10,
            padding: '10px 12px',
          }}>
            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>
              <strong style={{ color: '#818cf8' }}>Amplitude = Loudness.</strong>
              {' '}Higher amplitude → molecules pushed closer together → more pressure → louder sound.
            </p>
          </div>

          {/* Frequency vs pitch note */}
          <div style={{
            marginTop: 10,
            background: 'rgba(251,191,36,0.07)',
            border: '1px solid rgba(251,191,36,0.2)',
            borderRadius: 10,
            padding: '10px 12px',
          }}>
            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>
              <strong style={{ color: '#fbbf24' }}>Frequency = Pitch.</strong>
              {' '}More compressions per second → higher pitch.
              Human range: 20 Hz – 20,000 Hz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
