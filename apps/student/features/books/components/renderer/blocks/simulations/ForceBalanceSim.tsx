'use client';

// ForceBalanceSim.tsx
// Class 10 Physics — Balanced and Unbalanced Forces
// Up to 4 force vectors on a central object. Net force → balanced or unbalanced.

import { useState, useMemo } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ForceState {
  enabled:   boolean;
  magnitude: number;   // N
  angle:     number;   // degrees (0 = right, 90 = down in screen coords)
}

// ── Arrow helper (SVG) ────────────────────────────────────────────────────────

function ArrowSVG({
  cx, cy, angle, length, color, width = 2.5, dashed = false,
}: {
  cx: number; cy: number; angle: number; length: number;
  color: string; width?: number; dashed?: boolean;
}) {
  if (length < 1) return null;
  const rad = (angle * Math.PI) / 180;
  const tx  = cx + Math.cos(rad) * length;
  const ty  = cy + Math.sin(rad) * length;
  const headLen   = 11;
  const headWidth = 5;
  const dx = tx - cx;
  const dy = ty - cy;
  const L  = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / L;
  const uy = dy / L;
  const bx = tx - ux * headLen;
  const by = ty - uy * headLen;
  const px = -uy * headWidth;
  const py =  ux * headWidth;
  return (
    <g>
      <line
        x1={cx} y1={cy} x2={bx} y2={by}
        stroke={color} strokeWidth={width} strokeLinecap="round"
        strokeDasharray={dashed ? '6 4' : undefined}
      />
      <polygon
        points={`${tx},${ty} ${bx + px},${by + py} ${bx - px},${by - py}`}
        fill={color}
      />
    </g>
  );
}

// ── Force colors ──────────────────────────────────────────────────────────────

const FORCE_COLORS = ['#60a5fa', '#fb923c', '#34d399', '#a78bfa'];
const FORCE_LABELS = ['F1', 'F2', 'F3', 'F4'];

// ── Default forces: balanced 60+60 + 40+40 ───────────────────────────────────

const DEFAULT_FORCES: ForceState[] = [
  { enabled: true, magnitude: 60, angle:   0 },
  { enabled: true, magnitude: 60, angle: 180 },
  { enabled: true, magnitude: 40, angle:  90 },
  { enabled: true, magnitude: 40, angle: 270 },
];

// ── Slider helper ─────────────────────────────────────────────────────────────

function LabeledSlider({
  label, value, min, max, step, color, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  color?: string; onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>{label}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: color ?? '#e2e8f0' }}>{value}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: color ?? '#6366f1', height: 14 }}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ForceBalanceSim() {
  const [forces, setForces] = useState<ForceState[]>(DEFAULT_FORCES);
  const [mass,   setMass]   = useState(5);   // kg

  const SVG_W = 400;
  const SVG_H = 340;
  const CX    = SVG_W / 2;
  const CY    = SVG_H / 2;
  const BOX   = 40;
  const SCALE = 2.0;   // px per N

  // ── Compute net force ───────────────────────────────────────────────────────
  const { netFx, netFy, netF, netAngle, accel } = useMemo(() => {
    let fx = 0, fy = 0;
    forces.forEach(f => {
      if (!f.enabled) return;
      const rad = (f.angle * Math.PI) / 180;
      fx += f.magnitude * Math.cos(rad);
      fy += f.magnitude * Math.sin(rad);
    });
    const mag   = Math.sqrt(fx * fx + fy * fy);
    const ang   = Math.atan2(fy, fx) * (180 / Math.PI);
    const a     = mag / mass;
    return { netFx: fx, netFy: fy, netF: mag, netAngle: ang, accel: a };
  }, [forces, mass]);

  const isBalanced = netF < 1.5;

  // ── Force update helpers ────────────────────────────────────────────────────
  const updateForce = (i: number, patch: Partial<ForceState>) => {
    setForces(prev => prev.map((f, idx) => idx === i ? { ...f, ...patch } : f));
  };

  // ── Render ──────────────────────────────────────────────────────────────────
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
          Balanced &amp; Unbalanced Forces
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          Add forces and see if they balance · Net force = 0 → no acceleration
        </p>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>

        {/* SVG diagram */}
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            style={{
              width: '100%',
              background: '#060d1f',
              borderRadius: 12,
              border: '1px solid rgba(99,102,241,0.15)',
              display: 'block',
            }}
          >
            {/* Grid faint */}
            {[0.25, 0.5, 0.75].map(f => (
              <g key={f}>
                <line x1={SVG_W * f} y1={0} x2={SVG_W * f} y2={SVG_H} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
                <line x1={0} y1={SVG_H * f} x2={SVG_W} y2={SVG_H * f} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
              </g>
            ))}

            {/* Individual force arrows */}
            {forces.map((f, i) => {
              if (!f.enabled || f.magnitude === 0) return null;
              return (
                <ArrowSVG
                  key={i}
                  cx={CX} cy={CY}
                  angle={f.angle}
                  length={f.magnitude * SCALE}
                  color={FORCE_COLORS[i]}
                  width={2.5}
                />
              );
            })}

            {/* Resultant arrow */}
            {netF > 1.5 && (
              <ArrowSVG
                cx={CX} cy={CY}
                angle={netAngle}
                length={Math.min(netF * SCALE, 130)}
                color="#fbbf24"
                width={3.5}
                dashed={true}
              />
            )}

            {/* Central block */}
            <rect
              x={CX - BOX / 2} y={CY - BOX / 2}
              width={BOX} height={BOX}
              rx={6}
              fill={isBalanced ? 'rgba(52,211,153,0.15)' : 'rgba(251,191,36,0.10)'}
              stroke={isBalanced ? '#34d399' : '#fbbf24'}
              strokeWidth={2}
            />
            {/* Glow effect */}
            {isBalanced && (
              <rect
                x={CX - BOX / 2 - 4} y={CY - BOX / 2 - 4}
                width={BOX + 8} height={BOX + 8}
                rx={9}
                fill="none"
                stroke="rgba(52,211,153,0.25)"
                strokeWidth={3}
              />
            )}
            <text x={CX} y={CY + 4} fill="#e2e8f0" fontSize={10} fontWeight={700} textAnchor="middle" dominantBaseline="middle">
              m={mass}kg
            </text>

            {/* Status label */}
            <text
              x={CX} y={isBalanced ? CY - BOX / 2 - 14 : CY + BOX / 2 + 22}
              fill={isBalanced ? '#34d399' : '#fbbf24'}
              fontSize={11}
              fontWeight={700}
              textAnchor="middle"
            >
              {isBalanced ? 'BALANCED — no acceleration' : `UNBALANCED — a = ${accel.toFixed(2)} m/s²`}
            </text>

            {/* Force labels at arrow tips */}
            {forces.map((f, i) => {
              if (!f.enabled || f.magnitude === 0) return null;
              const rad = (f.angle * Math.PI) / 180;
              const len = f.magnitude * SCALE + 18;
              const lx  = CX + Math.cos(rad) * len;
              const ly  = CY + Math.sin(rad) * len;
              return (
                <text
                  key={i}
                  x={lx} y={ly}
                  fill={FORCE_COLORS[i]}
                  fontSize={11}
                  fontWeight={700}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {FORCE_LABELS[i]}
                </text>
              );
            })}

            {/* Resultant label */}
            {netF > 1.5 && (
              <text
                x={CX + Math.cos(netAngle * Math.PI / 180) * (Math.min(netF * SCALE, 130) + 20)}
                y={CY + Math.sin(netAngle * Math.PI / 180) * (Math.min(netF * SCALE, 130) + 20)}
                fill="#fbbf24"
                fontSize={11}
                fontWeight={700}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                F_net
              </text>
            )}

            {/* Legend */}
            {FORCE_LABELS.map((lbl, i) => (
              <g key={i}>
                <rect x={12 + i * 90} y={SVG_H - 20} width={10} height={10} rx={2} fill={FORCE_COLORS[i]} opacity={forces[i].enabled ? 1 : 0.3} />
                <text x={26 + i * 90} y={SVG_H - 12} fill="#4b5563" fontSize={10}>{lbl}: {forces[i].enabled ? `${forces[i].magnitude}N` : 'off'}</text>
              </g>
            ))}
          </svg>
        </div>

        {/* Controls panel */}
        <div style={{ flex: '1 1 220px' }}>

          {/* Per-force controls */}
          {forces.map((f, i) => (
            <div
              key={i}
              style={{
                background: '#0d1526',
                border: `1px solid ${f.enabled ? FORCE_COLORS[i] + '40' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 10,
                padding: '10px 12px',
                marginBottom: 10,
                opacity: f.enabled ? 1 : 0.5,
                transition: 'opacity 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 8 }}>
                <button
                  onClick={() => updateForce(i, { enabled: !f.enabled })}
                  style={{
                    width: 32, height: 18,
                    borderRadius: 9,
                    border: 'none',
                    background: f.enabled ? FORCE_COLORS[i] : 'rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    position: 'relative',
                    flexShrink: 0,
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 2, left: f.enabled ? 14 : 2,
                    width: 14, height: 14,
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'left 0.2s',
                  }} />
                </button>
                <span style={{ fontSize: 12, fontWeight: 700, color: FORCE_COLORS[i] }}>
                  {FORCE_LABELS[i]}
                </span>
              </div>
              <LabeledSlider
                label={`Magnitude (N): ${f.magnitude}`}
                value={f.magnitude}
                min={0} max={100} step={1}
                color={FORCE_COLORS[i]}
                onChange={v => updateForce(i, { magnitude: v })}
              />
              <LabeledSlider
                label={`Direction: ${f.angle}°`}
                value={f.angle}
                min={0} max={360} step={5}
                color={FORCE_COLORS[i]}
                onChange={v => updateForce(i, { angle: v })}
              />
            </div>
          ))}

          {/* Mass slider */}
          <div style={{
            background: '#0d1526',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            padding: '10px 12px',
            marginBottom: 12,
          }}>
            <LabeledSlider
              label={`Mass (kg): ${mass}`}
              value={mass}
              min={1} max={20} step={1}
              color="#94a3b8"
              onChange={v => setMass(v)}
            />
          </div>

          {/* Results card */}
          <div style={{
            background: '#0d1526',
            border: `1px solid ${isBalanced ? 'rgba(52,211,153,0.2)' : 'rgba(251,191,36,0.2)'}`,
            borderRadius: 10,
            padding: '12px 14px',
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>
              Net Force
            </div>
            {[
              { label: 'Net Force X',  value: `${netFx.toFixed(1)} N`,       color: '#94a3b8' },
              { label: 'Net Force Y',  value: `${netFy.toFixed(1)} N`,       color: '#94a3b8' },
              { label: 'Magnitude',    value: `${netF.toFixed(1)} N`,        color: isBalanced ? '#34d399' : '#fbbf24' },
              { label: 'Direction',    value: `${netAngle.toFixed(1)}°`,     color: '#818cf8' },
              { label: 'Acceleration', value: `${accel.toFixed(2)} m/s²`,   color: isBalanced ? '#34d399' : '#fb923c' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{row.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Status badge */}
          <div style={{
            padding: '10px 16px',
            borderRadius: 8,
            background: isBalanced ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)',
            border: `1px solid ${isBalanced ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.3)'}`,
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: isBalanced ? '#34d399' : '#fbbf24',
          }}>
            {isBalanced ? '⚖️ BALANCED' : '⚡ UNBALANCED'}
          </div>
        </div>
      </div>
    </div>
  );
}
