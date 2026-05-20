'use client';

// CartesianPlotterSim.tsx
// Class 9 Mathematics — Chapter 1: Coordinate Geometry — Page 4
// The chapter's central simulation: an interactive Cartesian plane.
// Modes:
//   - Read: click anywhere on the plane → see the point's coordinates
//   - Type: type (x, y) → the point appears
//   - Challenge: place the marker at a target coordinate; check correctness
//   - Quadrants: toggle the four quadrants on/off to feel what each one means
// Design follows SIMULATION_DESIGN_WORKFLOW.md (dark theme, amber accent).

import { useState, useCallback, useMemo, useRef } from 'react';

// ── Coordinate system ──────────────────────────────────────────────────────────

const X_MIN = -8;
const X_MAX = 8;
const Y_MIN = -6;
const Y_MAX = 6;
const UNIT = 30;             // px per coordinate unit
const PAD = 30;              // px of padding around the axes

const SVG_W = (X_MAX - X_MIN) * UNIT + PAD * 2;
const SVG_H = (Y_MAX - Y_MIN) * UNIT + PAD * 2;

// world (x, y) → svg (px, px)
function toSvg(x: number, y: number) {
  return {
    px: PAD + (x - X_MIN) * UNIT,
    py: PAD + (Y_MAX - y) * UNIT,
  };
}

// svg (px, px) → world (x, y), snapped to nearest 0.5
function fromSvg(px: number, py: number) {
  const x = (px - PAD) / UNIT + X_MIN;
  const y = Y_MAX - (py - PAD) / UNIT;
  // Snap to nearest 0.5 for friendlier numbers
  const snap = (v: number) => Math.round(v * 2) / 2;
  return { x: snap(x), y: snap(y) };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function fmt(n: number) {
  // 4 → "4", 4.5 → "4.5", -3 → "−3"
  const s = Math.abs(n) === Math.round(Math.abs(n)) ? n.toFixed(0) : n.toFixed(1);
  return s.replace('-', '−');
}

// Decide which quadrant a point lives in (or which axis)
function quadrantOf(x: number, y: number): string {
  if (x === 0 && y === 0) return 'origin';
  if (y === 0) return x > 0 ? 'positive x-axis' : 'negative x-axis';
  if (x === 0) return y > 0 ? 'positive y-axis' : 'negative y-axis';
  if (x > 0 && y > 0) return 'Quadrant I';
  if (x < 0 && y > 0) return 'Quadrant II';
  if (x < 0 && y < 0) return 'Quadrant III';
  return 'Quadrant IV';
}

// ── Modes ──────────────────────────────────────────────────────────────────────

type Mode = 'read' | 'type' | 'challenge' | 'quadrants';

// Pre-baked challenges for the Challenge mode
const CHALLENGES: { x: number; y: number; hint: string }[] = [
  { x: 3, y: 4, hint: '3 right, 4 up — Quadrant I.' },
  { x: -2, y: 3, hint: '2 left, 3 up — Quadrant II.' },
  { x: -4, y: -2, hint: '4 left, 2 down — Quadrant III.' },
  { x: 5, y: -3, hint: '5 right, 3 down — Quadrant IV.' },
  { x: 0, y: 4, hint: 'On the y-axis, above the origin.' },
  { x: -6, y: 0, hint: 'On the x-axis, to the left of the origin.' },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function CartesianPlotterSim() {
  const [mode, setMode] = useState<Mode>('read');

  // The current point (used in all modes)
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);

  // Type mode inputs
  const [typedX, setTypedX] = useState('3');
  const [typedY, setTypedY] = useState('4');
  const [typeError, setTypeError] = useState<string | null>(null);

  // Challenge mode state
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [challengeStatus, setChallengeStatus] = useState<'pending' | 'correct' | 'wrong'>('pending');

  // Quadrants mode toggles
  const [showQ1, setShowQ1] = useState(true);
  const [showQ2, setShowQ2] = useState(true);
  const [showQ3, setShowQ3] = useState(true);
  const [showQ4, setShowQ4] = useState(true);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // ── Click / drag on the plane ──────────────────────────────────────────────
  const handleSvgPointer = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (mode === 'type') return; // type mode is keyboard-driven only
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const py = ((e.clientY - rect.top) / rect.height) * SVG_H;
    const { x, y } = fromSvg(px, py);
    const cx = clamp(x, X_MIN, X_MAX);
    const cy = clamp(y, Y_MIN, Y_MAX);
    setPoint({ x: cx, y: cy });
    if (mode === 'challenge') setChallengeStatus('pending');
  }, [mode]);

  // ── Type-mode submit ───────────────────────────────────────────────────────
  const handlePlot = useCallback(() => {
    const x = parseFloat(typedX);
    const y = parseFloat(typedY);
    if (Number.isNaN(x) || Number.isNaN(y)) {
      setTypeError('Both x and y must be numbers.');
      return;
    }
    if (x < X_MIN || x > X_MAX) {
      setTypeError(`x must be between ${X_MIN} and ${X_MAX}.`);
      return;
    }
    if (y < Y_MIN || y > Y_MAX) {
      setTypeError(`y must be between ${Y_MIN} and ${Y_MAX}.`);
      return;
    }
    setTypeError(null);
    setPoint({ x, y });
  }, [typedX, typedY]);

  // ── Challenge check ────────────────────────────────────────────────────────
  const challenge = CHALLENGES[challengeIdx];
  const checkChallenge = useCallback(() => {
    if (!point) return;
    if (point.x === challenge.x && point.y === challenge.y) {
      setChallengeStatus('correct');
    } else {
      setChallengeStatus('wrong');
    }
  }, [point, challenge]);
  const nextChallenge = useCallback(() => {
    setChallengeIdx(i => (i + 1) % CHALLENGES.length);
    setChallengeStatus('pending');
    setPoint(null);
  }, []);

  // ── Quadrant visibility map (used in 'quadrants' mode) ────────────────────
  const qMask = useMemo(() => ({
    I: mode === 'quadrants' ? showQ1 : true,
    II: mode === 'quadrants' ? showQ2 : true,
    III: mode === 'quadrants' ? showQ3 : true,
    IV: mode === 'quadrants' ? showQ4 : true,
  }), [mode, showQ1, showQ2, showQ3, showQ4]);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    setPoint(null);
    setChallengeStatus('pending');
    setTypeError(null);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  const origin = toSvg(0, 0);

  return (
    <div style={{
      background: '#0d1117',
      color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16,
      padding: 24,
      maxWidth: 900,
      margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          The <span style={{ color: '#f59e0b' }}>Cartesian</span> Plane Plotter
        </h1>
        <p style={{
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
          color: '#475569', marginTop: 4, marginBottom: 0,
        }}>
          Interactive Coordinate Explorer · Class 9 Mathematics
        </p>
      </div>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {([
          ['read', 'Click & Read'],
          ['type', 'Type Coordinates'],
          ['challenge', 'Challenge'],
          ['quadrants', 'Toggle Quadrants'],
        ] as [Mode, string][]).map(([m, label]) => {
          const active = mode === m;
          return (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: active ? '1px solid rgba(245,158,11,0.6)' : '1px solid rgba(255,255,255,0.08)',
                background: active ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                color: active ? '#fbbf24' : '#94a3b8',
                transition: 'all 0.2s ease',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Mode-specific instruction */}
      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 14, lineHeight: 1.5, minHeight: 19 }}>
        {mode === 'read' && 'Click anywhere on the plane. The point’s coordinates appear below.'}
        {mode === 'type' && 'Type an x-coordinate and a y-coordinate, then press Plot to see the point appear.'}
        {mode === 'challenge' && (
          <>
            Place the point at <b style={{ color: '#fbbf24' }}>({fmt(challenge.x)}, {fmt(challenge.y)})</b> by clicking the right spot, then press Check.
          </>
        )}
        {mode === 'quadrants' && 'Toggle the four quadrants on and off below. Notice what survives if negative numbers were never invented.'}
      </p>

      {/* SVG plane */}
      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)', background: '#0B0F15',
        marginBottom: 14,
      }}>
        <svg
          ref={svgRef}
          width="100%"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block', cursor: mode === 'type' ? 'default' : 'crosshair', touchAction: 'none' }}
          onPointerDown={handleSvgPointer}
        >
          {/* Quadrant fills (used in quadrants mode for the disabled ones) */}
          {mode === 'quadrants' && (
            <>
              {!qMask.I && (
                <rect x={origin.px} y={PAD} width={SVG_W - PAD - origin.px} height={origin.py - PAD}
                  fill="rgba(0,0,0,0.55)" />
              )}
              {!qMask.II && (
                <rect x={PAD} y={PAD} width={origin.px - PAD} height={origin.py - PAD}
                  fill="rgba(0,0,0,0.55)" />
              )}
              {!qMask.III && (
                <rect x={PAD} y={origin.py} width={origin.px - PAD} height={SVG_H - PAD - origin.py}
                  fill="rgba(0,0,0,0.55)" />
              )}
              {!qMask.IV && (
                <rect x={origin.px} y={origin.py} width={SVG_W - PAD - origin.px} height={SVG_H - PAD - origin.py}
                  fill="rgba(0,0,0,0.55)" />
              )}
            </>
          )}

          {/* Grid */}
          {Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => {
            const x = X_MIN + i;
            const { px } = toSvg(x, 0);
            return (
              <line key={`vg${x}`} x1={px} y1={PAD} x2={px} y2={SVG_H - PAD}
                stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            );
          })}
          {Array.from({ length: Y_MAX - Y_MIN + 1 }, (_, i) => {
            const y = Y_MIN + i;
            const { py } = toSvg(0, y);
            return (
              <line key={`hg${y}`} x1={PAD} y1={py} x2={SVG_W - PAD} y2={py}
                stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            );
          })}

          {/* Axes */}
          <line x1={PAD} y1={origin.py} x2={SVG_W - PAD} y2={origin.py}
            stroke="#fbbf24" strokeWidth={1.5} />
          <line x1={origin.px} y1={PAD} x2={origin.px} y2={SVG_H - PAD}
            stroke="#fbbf24" strokeWidth={1.5} />

          {/* Axis arrowheads */}
          <path d={`M${SVG_W - PAD},${origin.py} l-7,-4 l0,8 z`} fill="#fbbf24" />
          <path d={`M${PAD},${origin.py} l7,-4 l0,8 z`} fill="#fbbf24" />
          <path d={`M${origin.px},${PAD} l-4,7 l8,0 z`} fill="#fbbf24" />
          <path d={`M${origin.px},${SVG_H - PAD} l-4,-7 l8,0 z`} fill="#fbbf24" />

          {/* Tick marks & numbers — every 1 unit on each axis */}
          {Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => {
            const x = X_MIN + i;
            if (x === 0) return null;
            const { px } = toSvg(x, 0);
            return (
              <g key={`tx${x}`}>
                <line x1={px} y1={origin.py - 3} x2={px} y2={origin.py + 3} stroke="#fbbf24" strokeWidth={1.2} />
                <text x={px} y={origin.py + 14} fill="#94a3b8" fontSize={9} fontWeight={600} textAnchor="middle">
                  {x < 0 ? '−' + Math.abs(x) : x}
                </text>
              </g>
            );
          })}
          {Array.from({ length: Y_MAX - Y_MIN + 1 }, (_, i) => {
            const y = Y_MIN + i;
            if (y === 0) return null;
            const { py } = toSvg(0, y);
            return (
              <g key={`ty${y}`}>
                <line x1={origin.px - 3} y1={py} x2={origin.px + 3} y2={py} stroke="#fbbf24" strokeWidth={1.2} />
                <text x={origin.px - 7} y={py + 3} fill="#94a3b8" fontSize={9} fontWeight={600} textAnchor="end">
                  {y < 0 ? '−' + Math.abs(y) : y}
                </text>
              </g>
            );
          })}

          {/* Origin label */}
          <text x={origin.px - 7} y={origin.py + 14} fill="#94a3b8" fontSize={9} fontWeight={700} textAnchor="end">O</text>

          {/* Axis labels */}
          <text x={SVG_W - PAD - 4} y={origin.py - 8} fill="#fbbf24" fontSize={11} fontWeight={700} textAnchor="end">x</text>
          <text x={origin.px + 8} y={PAD + 12} fill="#fbbf24" fontSize={11} fontWeight={700}>y</text>

          {/* Challenge target ring (challenge mode only) */}
          {mode === 'challenge' && (() => {
            const t = toSvg(challenge.x, challenge.y);
            return (
              <g>
                <circle cx={t.px} cy={t.py} r={11} fill="none"
                  stroke="rgba(99,102,241,0.7)" strokeWidth={1.5} strokeDasharray="3 3" />
                <circle cx={t.px} cy={t.py} r={2.5} fill="rgba(99,102,241,0.6)" />
              </g>
            );
          })()}

          {/* Plotted point */}
          {point && (() => {
            const p = toSvg(point.x, point.y);
            const correct = mode === 'challenge' && challengeStatus === 'correct';
            const wrong = mode === 'challenge' && challengeStatus === 'wrong';
            const colour = correct ? '#34d399' : wrong ? '#f87171' : '#f59e0b';
            return (
              <g>
                {/* Drop lines from the point to the axes (light) */}
                {point.x !== 0 && (
                  <line x1={p.px} y1={p.py} x2={p.px} y2={origin.py}
                    stroke="rgba(245,158,11,0.35)" strokeWidth={1} strokeDasharray="2 3" />
                )}
                {point.y !== 0 && (
                  <line x1={p.px} y1={p.py} x2={origin.px} y2={p.py}
                    stroke="rgba(245,158,11,0.35)" strokeWidth={1} strokeDasharray="2 3" />
                )}
                <circle cx={p.px} cy={p.py} r={6} fill={colour} stroke="#0B0F15" strokeWidth={2} />
                <text x={p.px + 10} y={p.py - 8} fill={colour} fontSize={11} fontWeight={700}>
                  ({fmt(point.x)}, {fmt(point.y)})
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Mode-specific control panel */}
      {mode === 'type' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>x =</label>
          <input
            type="number" value={typedX} onChange={e => setTypedX(e.target.value)}
            step="0.5"
            style={{
              width: 70, padding: '6px 8px', borderRadius: 6,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fbbf24', fontSize: 13, fontWeight: 700, textAlign: 'center',
            }}
          />
          <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>y =</label>
          <input
            type="number" value={typedY} onChange={e => setTypedY(e.target.value)}
            step="0.5"
            style={{
              width: 70, padding: '6px 8px', borderRadius: 6,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fbbf24', fontSize: 13, fontWeight: 700, textAlign: 'center',
            }}
          />
          <button
            onClick={handlePlot}
            style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              border: '1px solid rgba(245,158,11,0.6)', background: 'rgba(245,158,11,0.15)', color: '#fbbf24',
            }}
          >
            Plot ({fmt(parseFloat(typedX) || 0)}, {fmt(parseFloat(typedY) || 0)})
          </button>
          {typeError && (
            <span style={{ fontSize: 12, color: '#f87171' }}>{typeError}</span>
          )}
        </div>
      )}

      {mode === 'challenge' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
          <button
            onClick={checkChallenge} disabled={!point}
            style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700,
              cursor: point ? 'pointer' : 'not-allowed',
              border: '1px solid rgba(245,158,11,0.6)',
              background: point ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
              color: point ? '#fbbf24' : '#475569',
            }}
          >
            Check My Answer
          </button>
          <button
            onClick={nextChallenge}
            style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
            }}
          >
            Next Challenge →
          </button>
          {challengeStatus === 'correct' && (
            <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700 }}>
              ✓ Correct — {challenge.hint}
            </span>
          )}
          {challengeStatus === 'wrong' && point && (
            <span style={{ fontSize: 12, color: '#f87171', fontWeight: 700 }}>
              Not quite — you placed ({fmt(point.x)}, {fmt(point.y)}). Try again.
            </span>
          )}
        </div>
      )}

      {mode === 'quadrants' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {([
            ['Q I (+, +)', showQ1, () => setShowQ1(v => !v)],
            ['Q II (−, +)', showQ2, () => setShowQ2(v => !v)],
            ['Q III (−, −)', showQ3, () => setShowQ3(v => !v)],
            ['Q IV (+, −)', showQ4, () => setShowQ4(v => !v)],
          ] as [string, boolean, () => void][]).map(([label, on, toggle]) => (
            <button
              key={label} onClick={toggle}
              style={{
                padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                border: on ? '1px solid rgba(245,158,11,0.6)' : '1px solid rgba(255,255,255,0.1)',
                background: on ? 'rgba(245,158,11,0.15)' : 'rgba(0,0,0,0.4)',
                color: on ? '#fbbf24' : '#475569',
              }}
            >
              {on ? '●' : '○'} {label}
            </button>
          ))}
        </div>
      )}

      {/* Live readout */}
      <div style={{
        borderRadius: 10, padding: '12px 14px',
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fbbf24', margin: 0, marginBottom: 6 }}>
          Live Readout
        </p>
        {point ? (
          <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>
            Point at <b style={{ color: '#fbbf24' }}>({fmt(point.x)}, {fmt(point.y)})</b> —
            x-coordinate is <b>{fmt(point.x)}</b> (distance {Math.abs(point.x) === 0 ? 'on' : Math.sign(point.x) > 0 ? 'right of' : 'left of'} the y-axis),
            y-coordinate is <b>{fmt(point.y)}</b> (distance {Math.abs(point.y) === 0 ? 'on' : Math.sign(point.y) > 0 ? 'above' : 'below'} the x-axis).
            Lies on the <b>{quadrantOf(point.x, point.y)}</b>.
          </p>
        ) : (
          <p style={{ fontSize: 13, color: '#475569', margin: 0, fontStyle: 'italic' }}>
            No point plotted yet. {mode === 'type' ? 'Type values and press Plot.' : 'Click on the plane.'}
          </p>
        )}
      </div>
    </div>
  );
}
