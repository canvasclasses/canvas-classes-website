'use client';

// DistanceExplorerSim.tsx
// Class 9 Mathematics — Chapter 1 — Pages 9 & 10 (Distance between two points,
// and the Distance Formula).
// Drag two points P, Q on the plane. The simulator auto-draws a right triangle
// with horizontal leg |x₂−x₁| and vertical leg |y₂−y₁|, computes the diagonal
// using Baudhāyana–Pythagoras, and toggles between three readout modes:
//   - Triangle: shows leg lengths and the diagonal length
//   - Formula: shows the full distance formula step-by-step
//   - Practice: pose a randomised "find the distance" challenge

import { useState, useCallback, useMemo, useRef } from 'react';

const X_MIN = -8;
const X_MAX = 10;
const Y_MIN = -2;
const Y_MAX = 10;
const UNIT = 30;
const PAD = 30;
const SVG_W = (X_MAX - X_MIN) * UNIT + PAD * 2;
const SVG_H = (Y_MAX - Y_MIN) * UNIT + PAD * 2;

function toSvg(x: number, y: number) {
  return {
    px: PAD + (x - X_MIN) * UNIT,
    py: PAD + (Y_MAX - y) * UNIT,
  };
}

function fromSvg(px: number, py: number) {
  const x = Math.round((px - PAD) / UNIT) + X_MIN;
  const y = Y_MAX - Math.round((py - PAD) / UNIT);
  return { x, y };
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function fmt(n: number) { return n < 0 ? '−' + Math.abs(n) : String(n); }

function distance(p: { x: number; y: number }, q: { x: number; y: number }) {
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  return { dx, dy, hyp: Math.sqrt(dx * dx + dy * dy) };
}

type Mode = 'triangle' | 'formula' | 'practice';

const PRACTICE_PROBLEMS: { p: { x: number; y: number }; q: { x: number; y: number }; answer: number }[] = [
  { p: { x: 0, y: 0 }, q: { x: 3, y: 4 }, answer: 5 },
  { p: { x: 1, y: 2 }, q: { x: 4, y: 6 }, answer: 5 },
  { p: { x: -2, y: 1 }, q: { x: 4, y: 9 }, answer: 10 },
  { p: { x: 3, y: 4 }, q: { x: 7, y: 1 }, answer: 5 },
  { p: { x: -3, y: -4 }, q: { x: 0, y: 0 }, answer: 5 },
  { p: { x: 2, y: 3 }, q: { x: 8, y: 11 }, answer: 10 },
];

export default function DistanceExplorerSim() {
  const [mode, setMode] = useState<Mode>('triangle');
  const [p, setP] = useState({ x: 3, y: 4 });
  const [q, setQ] = useState({ x: 7, y: 1 });
  const [dragging, setDragging] = useState<'p' | 'q' | null>(null);

  // Practice mode
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [studentInput, setStudentInput] = useState('');
  const [practiceStatus, setPracticeStatus] = useState<'pending' | 'correct' | 'wrong'>('pending');

  const svgRef = useRef<SVGSVGElement | null>(null);

  const pickedProblem = PRACTICE_PROBLEMS[practiceIdx];

  // When mode is practice, lock points to the problem
  const displayP = mode === 'practice' ? pickedProblem.p : p;
  const displayQ = mode === 'practice' ? pickedProblem.q : q;

  const { dx, dy, hyp } = distance(displayP, displayQ);

  const onPtDown = useCallback((which: 'p' | 'q') => (e: React.PointerEvent) => {
    if (mode === 'practice') return;
    e.stopPropagation();
    setDragging(which);
  }, [mode]);

  const onMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const py = ((e.clientY - rect.top) / rect.height) * SVG_H;
    const { x, y } = fromSvg(px, py);
    const cx = clamp(x, X_MIN, X_MAX);
    const cy = clamp(y, Y_MIN, Y_MAX);
    if (dragging === 'p') setP({ x: cx, y: cy });
    else setQ({ x: cx, y: cy });
  }, [dragging]);

  const onUp = useCallback(() => setDragging(null), []);

  const checkPractice = useCallback(() => {
    const v = parseFloat(studentInput);
    if (Number.isNaN(v)) { setPracticeStatus('wrong'); return; }
    setPracticeStatus(Math.abs(v - pickedProblem.answer) < 0.05 ? 'correct' : 'wrong');
  }, [studentInput, pickedProblem]);

  const nextPractice = useCallback(() => {
    setPracticeIdx(i => (i + 1) % PRACTICE_PROBLEMS.length);
    setStudentInput('');
    setPracticeStatus('pending');
  }, []);

  // Build the right-angle triangle path
  const corner = { x: displayQ.x, y: displayP.y };  // the right-angle corner
  const sP = toSvg(displayP.x, displayP.y);
  const sQ = toSvg(displayQ.x, displayQ.y);
  const sCorner = toSvg(corner.x, corner.y);
  const showTriangle = displayP.x !== displayQ.x && displayP.y !== displayQ.y;

  return (
    <div style={{
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          Distance <span style={{ color: '#f59e0b' }}>Explorer</span>
        </h1>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginTop: 4 }}>
          Pythagoras &amp; the Distance Formula · Class 9 Mathematics
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {([
          ['triangle', 'Triangle View'],
          ['formula', 'Distance Formula'],
          ['practice', 'Practice Problems'],
        ] as [Mode, string][]).map(([m, label]) => {
          const active = mode === m;
          return (
            <button key={m} onClick={() => setMode(m)}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: active ? '1px solid rgba(245,158,11,0.6)' : '1px solid rgba(255,255,255,0.08)',
                background: active ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                color: active ? '#fbbf24' : '#94a3b8',
              }}>{label}</button>
          );
        })}
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12, lineHeight: 1.5 }}>
        {mode === 'triangle' && 'Drag P and Q. The simulator builds the right triangle and reads off both legs.'}
        {mode === 'formula' && 'Drag P and Q. Watch the full distance formula update step by step.'}
        {mode === 'practice' && (
          <>Find the distance between <b style={{ color: '#fbbf24' }}>P({fmt(pickedProblem.p.x)}, {fmt(pickedProblem.p.y)})</b> and <b style={{ color: '#fbbf24' }}>Q({fmt(pickedProblem.q.x)}, {fmt(pickedProblem.q.y)})</b>.</>
        )}
      </p>

      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)', background: '#0B0F15',
        marginBottom: 14,
      }}>
        <svg
          ref={svgRef} width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block', cursor: dragging ? 'grabbing' : 'default', touchAction: 'none' }}
          onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onPointerLeave={onUp}
        >
          {/* Grid */}
          {Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => {
            const x = X_MIN + i;
            const { px } = toSvg(x, 0);
            return <line key={`vg${x}`} x1={px} y1={PAD} x2={px} y2={SVG_H - PAD}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} />;
          })}
          {Array.from({ length: Y_MAX - Y_MIN + 1 }, (_, i) => {
            const y = Y_MIN + i;
            const { py } = toSvg(0, y);
            return <line key={`hg${y}`} x1={PAD} y1={py} x2={SVG_W - PAD} y2={py}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} />;
          })}

          {/* Axes */}
          {(() => {
            const ox = toSvg(0, 0);
            return (
              <g>
                <line x1={PAD} y1={ox.py} x2={SVG_W - PAD} y2={ox.py} stroke="#fbbf24" strokeWidth={1.5} />
                <line x1={ox.px} y1={PAD} x2={ox.px} y2={SVG_H - PAD} stroke="#fbbf24" strokeWidth={1.5} />
                <path d={`M${SVG_W - PAD},${ox.py} l-7,-4 l0,8 z`} fill="#fbbf24" />
                <path d={`M${ox.px},${PAD} l-4,7 l8,0 z`} fill="#fbbf24" />
                <text x={SVG_W - PAD - 4} y={ox.py - 6} fill="#fbbf24" fontSize={11} fontWeight={700} textAnchor="end">x</text>
                <text x={ox.px + 6} y={PAD + 12} fill="#fbbf24" fontSize={11} fontWeight={700}>y</text>
              </g>
            );
          })()}

          {/* Tick numbers */}
          {Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => {
            const x = X_MIN + i;
            if (x === 0) return null;
            const { px } = toSvg(x, 0);
            const oy = toSvg(0, 0).py;
            return <text key={`tx${x}`} x={px} y={oy + 12} fill="#94a3b8" fontSize={9} fontWeight={600} textAnchor="middle">{fmt(x)}</text>;
          })}
          {Array.from({ length: Y_MAX - Y_MIN + 1 }, (_, i) => {
            const y = Y_MIN + i;
            if (y === 0) return null;
            const { py } = toSvg(0, y);
            const ox = toSvg(0, 0).px;
            return <text key={`ty${y}`} x={ox - 6} y={py + 3} fill="#94a3b8" fontSize={9} fontWeight={600} textAnchor="end">{fmt(y)}</text>;
          })}

          {/* Right triangle */}
          {showTriangle && (
            <g>
              {/* Horizontal leg */}
              <line x1={sP.px} y1={sP.py} x2={sCorner.px} y2={sCorner.py}
                stroke="#34d399" strokeWidth={2} strokeDasharray="4 3" />
              {/* Vertical leg */}
              <line x1={sCorner.px} y1={sCorner.py} x2={sQ.px} y2={sQ.py}
                stroke="#60a5fa" strokeWidth={2} strokeDasharray="4 3" />
              {/* Hypotenuse */}
              <line x1={sP.px} y1={sP.py} x2={sQ.px} y2={sQ.py}
                stroke="#a78bfa" strokeWidth={2.5} />
              {/* Right-angle marker */}
              <rect x={sCorner.px + (displayP.x > displayQ.x ? 0 : -8)} y={sCorner.py + (displayP.y > displayQ.y ? -8 : 0)}
                width={8} height={8} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
              {/* Leg labels */}
              <text x={(sP.px + sCorner.px) / 2} y={sP.py + (displayP.y > displayQ.y ? 18 : -8)}
                fill="#34d399" fontSize={10} fontWeight={700} textAnchor="middle">
                |Δx| = {Math.abs(dx)}
              </text>
              <text x={sCorner.px + (displayP.x > displayQ.x ? 8 : -8)} y={(sCorner.py + sQ.py) / 2}
                fill="#60a5fa" fontSize={10} fontWeight={700}
                textAnchor={displayP.x > displayQ.x ? 'start' : 'end'}>
                |Δy| = {Math.abs(dy)}
              </text>
              {/* Hypotenuse label */}
              <text x={(sP.px + sQ.px) / 2 + 8} y={(sP.py + sQ.py) / 2 - 8}
                fill="#a78bfa" fontSize={11} fontWeight={700}>
                d = {hyp.toFixed(2)}
              </text>
            </g>
          )}

          {/* Points */}
          <g>
            <circle cx={sP.px} cy={sP.py} r={14} fill="transparent"
              onPointerDown={onPtDown('p')}
              style={{ cursor: mode === 'practice' ? 'default' : 'grab' }} />
            <circle cx={sP.px} cy={sP.py} r={6} fill="#fbbf24" stroke="#0B0F15" strokeWidth={2} pointerEvents="none" />
            <text x={sP.px + 8} y={sP.py - 8} fill="#fbbf24" fontSize={10} fontWeight={700} pointerEvents="none">
              P({fmt(displayP.x)}, {fmt(displayP.y)})
            </text>
            <circle cx={sQ.px} cy={sQ.py} r={14} fill="transparent"
              onPointerDown={onPtDown('q')}
              style={{ cursor: mode === 'practice' ? 'default' : 'grab' }} />
            <circle cx={sQ.px} cy={sQ.py} r={6} fill="#fbbf24" stroke="#0B0F15" strokeWidth={2} pointerEvents="none" />
            <text x={sQ.px + 8} y={sQ.py - 8} fill="#fbbf24" fontSize={10} fontWeight={700} pointerEvents="none">
              Q({fmt(displayQ.x)}, {fmt(displayQ.y)})
            </text>
          </g>
        </svg>
      </div>

      {/* Mode-specific readouts */}
      {mode === 'triangle' && (
        <div style={{
          borderRadius: 10, padding: '12px 14px',
          background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fbbf24', margin: 0, marginBottom: 6 }}>
            Right Triangle from Coordinates
          </p>
          <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
            Horizontal leg <b style={{ color: '#34d399' }}>|Δx| = |{fmt(displayQ.x)} − {fmt(displayP.x)}| = {Math.abs(dx)}</b>
            <br />
            Vertical leg <b style={{ color: '#60a5fa' }}>|Δy| = |{fmt(displayQ.y)} − {fmt(displayP.y)}| = {Math.abs(dy)}</b>
            <br />
            By Baudhāyana–Pythagoras: <b style={{ color: '#a78bfa' }}>d² = {Math.abs(dx)}² + {Math.abs(dy)}² = {dx * dx + dy * dy}</b>
            {' → '} d ≈ <b style={{ color: '#a78bfa' }}>{hyp.toFixed(3)}</b>
          </p>
        </div>
      )}

      {mode === 'formula' && (
        <div style={{
          borderRadius: 10, padding: '12px 14px',
          background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.25)',
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa', margin: 0, marginBottom: 6 }}>
            Distance Formula
          </p>
          <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.7, fontVariantNumeric: 'tabular-nums' }}>
            d = √((x₂ − x₁)² + (y₂ − y₁)²)
            <br />
            &nbsp;&nbsp;= √(({fmt(displayQ.x)} − {fmt(displayP.x)})² + ({fmt(displayQ.y)} − {fmt(displayP.y)})²)
            <br />
            &nbsp;&nbsp;= √(({fmt(dx)})² + ({fmt(dy)})²)
            <br />
            &nbsp;&nbsp;= √({dx * dx} + {dy * dy})
            <br />
            &nbsp;&nbsp;= √{dx * dx + dy * dy}
            {' '}≈ <b style={{ color: '#a78bfa' }}>{hyp.toFixed(3)}</b>
          </p>
        </div>
      )}

      {mode === 'practice' && (
        <div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>Your answer (d):</label>
            <input
              type="number" step="0.01" value={studentInput}
              onChange={e => setStudentInput(e.target.value)}
              style={{
                width: 110, padding: '6px 8px', borderRadius: 6,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fbbf24', fontSize: 13, fontWeight: 700, textAlign: 'center',
              }}
            />
            <button onClick={checkPractice}
              style={{
                padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: '1px solid rgba(245,158,11,0.6)', background: 'rgba(245,158,11,0.15)', color: '#fbbf24',
              }}>
              Check
            </button>
            <button onClick={nextPractice}
              style={{
                padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
                marginLeft: 'auto',
              }}>
              Next Problem →
            </button>
          </div>
          {practiceStatus === 'correct' && (
            <div style={{
              borderRadius: 10, padding: '10px 14px',
              background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.25)',
            }}>
              <p style={{ fontSize: 12, color: '#34d399', margin: 0, fontWeight: 700, lineHeight: 1.5 }}>
                ✓ Correct. d = {pickedProblem.answer}. Good — that&rsquo;s √(({fmt(pickedProblem.q.x - pickedProblem.p.x)})² + ({fmt(pickedProblem.q.y - pickedProblem.p.y)})²) = √{(pickedProblem.q.x - pickedProblem.p.x) ** 2 + (pickedProblem.q.y - pickedProblem.p.y) ** 2}.
              </p>
            </div>
          )}
          {practiceStatus === 'wrong' && (
            <div style={{
              borderRadius: 10, padding: '10px 14px',
              background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.3)',
            }}>
              <p style={{ fontSize: 12, color: '#f87171', margin: 0, fontWeight: 700, lineHeight: 1.5 }}>
                Not quite. Try again. <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Hint: compute |Δx|, |Δy|, then √(|Δx|² + |Δy|²).)</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
