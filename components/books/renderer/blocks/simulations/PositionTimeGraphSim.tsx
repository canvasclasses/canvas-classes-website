'use client';

// PositionTimeGraphSim.tsx
// Class 9 Physics — Position-Time Graphs (slope = velocity)
// Left: animated object on track. Right: live x-t graph with tangent.

import { useState, useEffect, useRef, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

type MotionType = 'stationary' | 'uniform' | 'accelerating' | 'decelerating' | 'return';
type SpeedMult  = 0.5 | 1 | 2;

interface MotionMeta {
  id: MotionType;
  label: string;
  insight: string;
}

// ── Motion config ─────────────────────────────────────────────────────────────

const MOTIONS: MotionMeta[] = [
  { id: 'stationary',    label: 'Stationary',    insight: 'Slope = 0 → velocity = 0. Horizontal line.' },
  { id: 'uniform',       label: 'Uniform',        insight: 'Constant slope → constant velocity. Straight line.' },
  { id: 'accelerating',  label: 'Accelerating',   insight: 'Increasing slope → increasing velocity. Concave-up curve.' },
  { id: 'decelerating',  label: 'Decelerating',   insight: 'Decreasing slope → decreasing velocity. Concave-down curve.' },
  { id: 'return',        label: 'Return',          insight: 'Slope changes sign → reversal of direction.' },
];

const T_MAX = 5;   // seconds
const X_MAX = 10;  // metres
const REAL_DURATION = 5000; // ms for full 0→5s playthrough at ×1

// ── Physics functions ─────────────────────────────────────────────────────────

function positionAt(type: MotionType, t: number): number {
  switch (type) {
    case 'stationary':   return 5;
    case 'uniform':      return t;
    case 'accelerating': return 0.5 * t * t;
    case 'decelerating': return 4 * t - 0.4 * t * t;
    case 'return':       return t < 2.5 ? 2 * t : 2 * (5 - t);
  }
}

function velocityAt(type: MotionType, t: number): number {
  const dt = 0.001;
  return (positionAt(type, Math.min(t + dt, T_MAX)) - positionAt(type, Math.max(t - dt, 0))) / (2 * dt);
}

// ── Graph helpers ─────────────────────────────────────────────────────────────

const GRAPH_W = 280;
const GRAPH_H = 200;
const PAD_L   = 36;
const PAD_B   = 28;
const PAD_T   = 10;
const PAD_R   = 10;
const GW = GRAPH_W - PAD_L - PAD_R;   // drawable width
const GH = GRAPH_H - PAD_T - PAD_B;   // drawable height

function toGX(t: number) { return PAD_L + (t / T_MAX) * GW; }
function toGY(x: number) { return PAD_T + (1 - x / X_MAX) * GH; }

// Build full curve as polyline points string
function buildCurve(type: MotionType): string {
  const steps = 80;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * T_MAX;
    const x = Math.max(0, Math.min(X_MAX, positionAt(type, t)));
    pts.push(`${toGX(t)},${toGY(x)}`);
  }
  return pts.join(' ');
}

// ── Track constants ───────────────────────────────────────────────────────────

const TRACK_W  = 480;
const TRACK_H  = 100;
const TRACK_Y  = 60;
const BALL_R   = 12;
const TRACK_L  = 30;
const TRACK_R  = TRACK_W - 30;
const TRACK_RANGE = TRACK_R - TRACK_L;

function trackBallX(type: MotionType, t: number): number {
  const x = Math.max(0, Math.min(X_MAX, positionAt(type, t)));
  return TRACK_L + (x / X_MAX) * TRACK_RANGE;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PositionTimeGraphSim() {
  const [motionType, setMotionType] = useState<MotionType>('uniform');
  const [speedMult, setSpeedMult]   = useState<SpeedMult>(1);
  const [playing, setPlaying]       = useState(false);
  const [playhead, setPlayhead]     = useState(0);   // 0→5 seconds

  const playheadRef = useRef(0);
  const lastTRef    = useRef<number | null>(null);
  const rafRef      = useRef<number | null>(null);

  // ── Animation loop ──────────────────────────────────────────────────────────
  const tick = useCallback((ts: number) => {
    if (lastTRef.current === null) lastTRef.current = ts;
    const elapsed = ts - lastTRef.current;
    lastTRef.current = ts;

    const dtSim = (elapsed / REAL_DURATION) * T_MAX * speedMult;
    playheadRef.current = Math.min(playheadRef.current + dtSim, T_MAX);
    setPlayhead(playheadRef.current);

    if (playheadRef.current >= T_MAX) {
      setPlaying(false);
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [speedMult]);

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

  const reset = useCallback(() => {
    setPlaying(false);
    playheadRef.current = 0;
    setPlayhead(0);
  }, []);

  // Reset when motion type changes
  useEffect(() => { reset(); }, [motionType, reset]);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const currentX = Math.max(0, Math.min(X_MAX, positionAt(motionType, playhead)));
  const currentV = velocityAt(motionType, playhead);
  const ballSVGX = trackBallX(motionType, playhead);

  // Graph current point
  const gPx = toGX(playhead);
  const gPy = toGY(currentX);

  // Tangent line: ±0.5s window
  const tSpan = 0.7;
  const t0    = Math.max(0, playhead - tSpan);
  const t1    = Math.min(T_MAX, playhead + tSpan);
  const tx0   = toGX(t0);
  const ty0   = toGY(Math.max(0, Math.min(X_MAX, positionAt(motionType, t0))));
  const tx1   = toGX(t1);
  const ty1   = toGY(Math.max(0, Math.min(X_MAX, positionAt(motionType, t1))));

  // Recorded path (up to playhead)
  const recordedSteps = 60;
  const recordedPts: string[] = [];
  for (let i = 0; i <= recordedSteps; i++) {
    const t = (i / recordedSteps) * playhead;
    const x = Math.max(0, Math.min(X_MAX, positionAt(motionType, t)));
    recordedPts.push(`${toGX(t)},${toGY(x)}`);
  }
  const recordedPolyline = recordedPts.join(' ');

  // Full guide curve
  const guideCurve = buildCurve(motionType);

  const selectedMeta = MOTIONS.find(m => m.id === motionType)!;

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
          Position–Time Graph
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          Slope of x-t graph = velocity · Steeper means faster · Horizontal means stationary
        </p>
      </div>

      {/* Motion type tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
        {MOTIONS.map(m => (
          <button
            key={m.id}
            onClick={() => setMotionType(m.id)}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: motionType === m.id
                ? '1px solid #6366f1'
                : '1px solid rgba(255,255,255,0.08)',
              background: motionType === m.id ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
              color: motionType === m.id ? '#818cf8' : '#94a3b8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Body — flex-wrap for mobile */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>

        {/* Left: track */}
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <svg
            viewBox={`0 0 ${TRACK_W} ${TRACK_H}`}
            style={{
              width: '100%',
              background: '#060d1f',
              borderRadius: 10,
              border: '1px solid rgba(99,102,241,0.15)',
              display: 'block',
            }}
          >
            {/* Track rail */}
            <rect x={TRACK_L} y={TRACK_Y + BALL_R - 2} width={TRACK_RANGE} height={4} rx={2} fill="#1e293b" />
            <line x1={TRACK_L} y1={TRACK_Y + BALL_R} x2={TRACK_R} y2={TRACK_Y + BALL_R} stroke="rgba(99,102,241,0.2)" strokeWidth={1} />

            {/* Distance markers */}
            {[0, 2, 4, 6, 8, 10].map(m => {
              const mx = TRACK_L + (m / X_MAX) * TRACK_RANGE;
              return (
                <g key={m}>
                  <line x1={mx} y1={TRACK_Y + BALL_R - 6} x2={mx} y2={TRACK_Y + BALL_R + 6} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                  <text x={mx} y={TRACK_Y + BALL_R + 16} fill="#4b5563" fontSize={9} textAnchor="middle">{m}m</text>
                </g>
              );
            })}

            {/* Ball */}
            <circle cx={ballSVGX} cy={TRACK_Y} r={BALL_R} fill="#6366f1" stroke="#818cf8" strokeWidth={2} />

            {/* Current x label */}
            <text x={ballSVGX} y={TRACK_Y - BALL_R - 6} fill="#818cf8" fontSize={10} fontWeight={700} textAnchor="middle">
              {currentX.toFixed(1)} m
            </text>
          </svg>

          {/* Play/Pause + Reset */}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button
              onClick={() => {
                if (playhead >= T_MAX) { reset(); setTimeout(() => setPlaying(true), 50); }
                else setPlaying(p => !p);
              }}
              style={{
                flex: 1,
                padding: '9px 0',
                background: 'linear-gradient(135deg,#6366f1,#818cf8)',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {playing ? '⏸ Pause' : playhead >= T_MAX ? '↺ Replay' : '▶ Play'}
            </button>
            <button
              onClick={reset}
              style={{
                padding: '9px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                color: '#94a3b8',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          </div>

          {/* Speed toggle */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
              Speed
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {([0.5, 1, 2] as SpeedMult[]).map(s => (
                <button
                  key={s}
                  onClick={() => setSpeedMult(s)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 6,
                    border: speedMult === s ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.08)',
                    background: speedMult === s ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.03)',
                    color: speedMult === s ? '#fbbf24' : '#94a3b8',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ×{s}
                </button>
              ))}
            </div>
          </div>

          {/* Key insight */}
          <div style={{
            marginTop: 14,
            background: '#0d1526',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            padding: '10px 12px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#64748b', marginBottom: 5 }}>
              Key Insight
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>
              {selectedMeta.insight}
            </div>
          </div>
        </div>

        {/* Right: x-t graph */}
        <div style={{ flex: '1 1 280px', minWidth: 0 }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>
            x-t Graph
          </div>
          <svg
            viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`}
            style={{
              width: '100%',
              background: '#060d1f',
              borderRadius: 10,
              border: '1px solid rgba(99,102,241,0.15)',
              display: 'block',
            }}
          >
            {/* Grid lines */}
            {[0, 1, 2, 3, 4, 5].map(t => (
              <line key={`gt${t}`} x1={toGX(t)} y1={PAD_T} x2={toGX(t)} y2={PAD_T + GH}
                stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            ))}
            {[0, 2, 4, 6, 8, 10].map(x => (
              <line key={`gx${x}`} x1={PAD_L} y1={toGY(x)} x2={PAD_L + GW} y2={toGY(x)}
                stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            ))}

            {/* Axes */}
            <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + GH} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
            <line x1={PAD_L} y1={PAD_T + GH} x2={PAD_L + GW} y2={PAD_T + GH} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />

            {/* Axis labels */}
            {[0, 1, 2, 3, 4, 5].map(t => (
              <text key={`tl${t}`} x={toGX(t)} y={GRAPH_H - 5} fill="#4b5563" fontSize={9} textAnchor="middle">{t}</text>
            ))}
            {[0, 5, 10].map(x => (
              <text key={`xl${x}`} x={PAD_L - 4} y={toGY(x) + 4} fill="#4b5563" fontSize={9} textAnchor="end">{x}</text>
            ))}

            {/* Axis names */}
            <text x={PAD_L + GW / 2} y={GRAPH_H - 1} fill="#475569" fontSize={9} textAnchor="middle">Time (s)</text>
            <text x={8} y={PAD_T + GH / 2} fill="#475569" fontSize={9} textAnchor="middle"
              transform={`rotate(-90,8,${PAD_T + GH / 2})`}>Pos (m)</text>

            {/* Guide curve (dashed) */}
            <polyline points={guideCurve} fill="none" stroke="rgba(99,102,241,0.25)" strokeWidth={1.5} strokeDasharray="4 4" />

            {/* Recorded path (solid) */}
            {playhead > 0 && (
              <polyline points={recordedPolyline} fill="none" stroke="#818cf8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            )}

            {/* Tangent line */}
            {playhead > 0.05 && (
              <line x1={tx0} y1={ty0} x2={tx1} y2={ty1}
                stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="3 3" opacity={0.8} />
            )}

            {/* Current point dot */}
            {playhead > 0 && (
              <circle cx={gPx} cy={gPy} r={5} fill="#fbbf24" stroke="#0b0f15" strokeWidth={1.5} />
            )}
          </svg>

          {/* Slope readout */}
          <div style={{
            marginTop: 10,
            background: '#0d1526',
            border: '1px solid rgba(251,191,36,0.15)',
            borderRadius: 8,
            padding: '8px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>Slope = velocity</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fbbf24' }}>
              {currentV.toFixed(2)} m/s
            </span>
          </div>

          {/* Playhead info */}
          <div style={{
            marginTop: 8,
            background: '#0d1526',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8,
            padding: '8px 12px',
            display: 'flex',
            gap: 18,
          }}>
            <div>
              <div style={{ fontSize: 10, color: '#64748b' }}>Time</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#818cf8' }}>{playhead.toFixed(2)} s</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#64748b' }}>Position</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#34d399' }}>{currentX.toFixed(2)} m</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
