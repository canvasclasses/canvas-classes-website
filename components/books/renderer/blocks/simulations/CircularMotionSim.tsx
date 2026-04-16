'use client';

// CircularMotionSim.tsx
// Class 9 Physics — Uniform Circular Motion
// Shows a ball moving in a circle with velocity (tangent) and centripetal force arrows.
// Demonstrates that velocity is always tangent, centripetal acceleration points inward.

import { useState, useEffect, useRef, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface TrailPoint {
  x: number;
  y: number;
}

// ── Arrow helper ──────────────────────────────────────────────────────────────

function Arrow({
  x1, y1, x2, y2, color, width = 2,
}: {
  x1: number; y1: number; x2: number; y2: number; color: string; width?: number;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return null;
  const ux = dx / len;
  const uy = dy / len;
  const headLen = 10;
  const headWidth = 5;
  const bx = x2 - ux * headLen;
  const by = y2 - uy * headLen;
  const px = -uy * headWidth;
  const py = ux * headWidth;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <polygon
        points={`${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`}
        fill={color}
      />
    </g>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CircularMotionSim() {
  const [playing, setPlaying]   = useState(true);
  const [radius, setRadius]     = useState(100);   // px on SVG (display units)
  const [period, setPeriod]     = useState(3);     // seconds
  const [mass, setMass]         = useState(2);     // kg

  const angleRef  = useRef(0);
  const lastTRef  = useRef<number | null>(null);
  const rafRef    = useRef<number | null>(null);
  const [angle, setAngle]   = useState(0);
  const [trail, setTrail]   = useState<TrailPoint[]>([]);

  const SVG_W = 500;
  const SVG_H = 340;
  const cx = SVG_W / 2;
  const cy = SVG_H / 2;

  // ── Physics loop ─────────────────────────────────────────────────────────────
  const tick = useCallback((ts: number) => {
    if (lastTRef.current === null) {
      lastTRef.current = ts;
    }
    const dt = Math.min((ts - lastTRef.current) / 1000, 0.05);
    lastTRef.current = ts;

    const omega = (2 * Math.PI) / period;
    angleRef.current = angleRef.current + omega * dt;

    const a = angleRef.current;
    setAngle(a);
    const bx = cx + radius * Math.cos(a);
    const by = cy + radius * Math.sin(a);
    setTrail(prev => {
      const next = [...prev, { x: bx, y: by }];
      return next.slice(-8);
    });

    rafRef.current = requestAnimationFrame(tick);
  }, [period, radius, cx, cy]);

  useEffect(() => {
    if (playing) {
      lastTRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, tick]);

  // ── Derived quantities ────────────────────────────────────────────────────────
  const radiusM = radius / 100;          // 100px = 1m for display
  const v       = (2 * Math.PI * radiusM) / period;
  const ac      = (v * v) / radiusM;
  const Fc      = mass * ac;

  const bx = cx + radius * Math.cos(angle);
  const by = cy + radius * Math.sin(angle);

  // Velocity arrow: tangent CCW = (-sin, cos)
  const vLen  = 55;
  const vx2   = bx + (-Math.sin(angle)) * vLen;
  const vy2   = by + Math.cos(angle) * vLen;

  // Centripetal force arrow: toward center
  const fcLen = 42;
  const dx    = cx - bx;
  const dy    = cy - by;
  const dist  = Math.sqrt(dx * dx + dy * dy) || 1;
  const fcx2  = bx + (dx / dist) * fcLen;
  const fcy2  = by + (dy / dist) * fcLen;

  // Label positions (offset from arrow tip)
  const vLabelX = vx2 + (-Math.sin(angle)) * 14;
  const vLabelY = vy2 + Math.cos(angle) * 14;
  const fcLabelX = fcx2 + (dx / dist) * 14;
  const fcLabelY = fcy2 + (dy / dist) * 14;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      background: '#0b0f15',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24,
      fontFamily: 'system-ui, sans-serif',
      color: '#e2e8f0',
      maxWidth: 940,
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#fff' }}>
          Uniform Circular Motion
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          Velocity is always tangent to the circle · Centripetal force points to the centre
        </p>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>

        {/* SVG Visualization */}
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{
              width: '100%',
              background: '#060d1f',
              borderRadius: 12,
              border: '1px solid rgba(99,102,241,0.2)',
              display: 'block',
            }}
          >
            {/* Orbit circle */}
            <circle
              cx={cx} cy={cy} r={radius}
              fill="none"
              stroke="rgba(99,102,241,0.3)"
              strokeWidth={1.5}
              strokeDasharray="6 5"
            />

            {/* Center dot */}
            <circle cx={cx} cy={cy} r={5} fill="#6366f1" opacity={0.7} />

            {/* Trail */}
            {trail.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={4}
                fill="#818cf8"
                opacity={(i + 1) / trail.length * 0.45}
              />
            ))}

            {/* Centripetal force arrow */}
            <Arrow x1={bx} y1={by} x2={fcx2} y2={fcy2} color="#f87171" width={2.5} />

            {/* Velocity arrow */}
            <Arrow x1={bx} y1={by} x2={vx2} y2={vy2} color="#34d399" width={2.5} />

            {/* Ball */}
            <circle cx={bx} cy={by} r={14} fill="#6366f1" stroke="#818cf8" strokeWidth={2} />

            {/* Arrow labels */}
            <text
              x={vLabelX} y={vLabelY}
              fill="#34d399"
              fontSize={11}
              fontWeight={600}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              v (tangent)
            </text>
            <text
              x={fcLabelX} y={fcLabelY}
              fill="#f87171"
              fontSize={11}
              fontWeight={600}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              F_c
            </text>

            {/* Legend bottom */}
            <circle cx={24} cy={SVG_H - 20} r={5} fill="#34d399" />
            <text x={34} y={SVG_H - 16} fill="#94a3b8" fontSize={10}>Velocity (tangent)</text>
            <circle cx={170} cy={SVG_H - 20} r={5} fill="#f87171" />
            <text x={180} y={SVG_H - 16} fill="#94a3b8" fontSize={10}>Centripetal Force</text>
          </svg>
        </div>

        {/* Controls panel */}
        <div style={{ flex: '1 1 220px' }}>

          {/* Play / Pause */}
          <button
            onClick={() => setPlaying(p => !p)}
            style={{
              width: '100%',
              padding: '10px 0',
              background: playing
                ? 'rgba(99,102,241,0.15)'
                : 'linear-gradient(135deg,#6366f1,#818cf8)',
              border: '1px solid rgba(99,102,241,0.4)',
              borderRadius: 8,
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              marginBottom: 18,
            }}
          >
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>

          {/* Sliders */}
          {[
            {
              label: `Radius r: ${radius} px  (${radiusM.toFixed(2)} m)`,
              value: radius, min: 60, max: 160, step: 1,
              set: (v: number) => setRadius(v),
            },
            {
              label: `Period T: ${period.toFixed(1)} s`,
              value: period, min: 1, max: 8, step: 0.5,
              set: (v: number) => setPeriod(v),
            },
            {
              label: `Mass m: ${mass} kg`,
              value: mass, min: 1, max: 10, step: 1,
              set: (v: number) => setMass(v),
            },
          ].map(({ label, value, min, max, step, set }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 5 }}>{label}</div>
              <input
                type="range"
                min={min} max={max} step={step}
                value={value}
                onChange={e => set(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#6366f1' }}
              />
            </div>
          ))}

          {/* Live formula card */}
          <div style={{
            background: '#0d1526',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            padding: '12px 14px',
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>
              Live Calculations
            </div>
            {[
              { label: 'v = 2πr/T', value: `${v.toFixed(2)} m/s`, color: '#34d399' },
              { label: 'a_c = v²/r', value: `${ac.toFixed(2)} m/s²`, color: '#818cf8' },
              { label: 'F_c = mv²/r', value: `${Fc.toFixed(2)} N`, color: '#f87171' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{row.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Key concepts */}
          <div style={{
            background: '#0d1526',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            padding: '12px 14px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>
              Key Concepts
            </div>
            {[
              { title: 'Direction of v', body: 'Always tangent to the circle — perpendicular to the radius at that instant.' },
              { title: 'Centripetal acceleration', body: 'Points radially inward toward the centre. Magnitude = v²/r.' },
              { title: 'Centrifugal myth', body: 'Centrifugal "force" is a pseudo-force felt in the rotating frame. It does not exist in an inertial frame.' },
            ].map(c => (
              <div key={c.title} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>{c.title}</div>
                <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
