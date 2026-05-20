'use client';

// QuadrantClassifierSim.tsx
// Class 9 Mathematics — Chapter 1 — Page 6 (The Four Quadrants)
// Three modes:
//   - Identify: a random point is plotted, student picks the correct quadrant.
//   - Sign Flip: a point is shown; toggling x or y sign-flips it; watch which
//     quadrant it migrates into.
//   - Reflect: a point is shown with its three reflections (across x-axis,
//     y-axis, and origin) — student names each new quadrant.
// Strong drill design: rapid-fire scoring on Identify mode encourages practice.

import { useState, useCallback, useMemo, useEffect } from 'react';

const X_MIN = -7;
const X_MAX = 7;
const Y_MIN = -5;
const Y_MAX = 5;
const UNIT = 32;
const PAD = 28;
const SVG_W = (X_MAX - X_MIN) * UNIT + PAD * 2;
const SVG_H = (Y_MAX - Y_MIN) * UNIT + PAD * 2;

function toSvg(x: number, y: number) {
  return {
    px: PAD + (x - X_MIN) * UNIT,
    py: PAD + (Y_MAX - y) * UNIT,
  };
}

function fmt(n: number) {
  return n < 0 ? '−' + Math.abs(n) : String(n);
}

type Quadrant = 'I' | 'II' | 'III' | 'IV' | 'x-axis' | 'y-axis' | 'origin';

function classify(x: number, y: number): Quadrant {
  if (x === 0 && y === 0) return 'origin';
  if (y === 0) return 'x-axis';
  if (x === 0) return 'y-axis';
  if (x > 0 && y > 0) return 'I';
  if (x < 0 && y > 0) return 'II';
  if (x < 0 && y < 0) return 'III';
  return 'IV';
}

// Random non-axis point
function randomPoint() {
  const x = (Math.floor(Math.random() * 11) - 5) || 1;       // -5..5, no 0
  const y = (Math.floor(Math.random() * 9) - 4) || 1;        // -4..4, no 0
  return { x, y };
}

type Mode = 'identify' | 'flip' | 'reflect';

export default function QuadrantClassifierSim() {
  const [mode, setMode] = useState<Mode>('identify');

  // Identify mode
  const [target, setTarget] = useState<{ x: number; y: number }>({ x: 3, y: 4 });
  const [pickedAns, setPickedAns] = useState<Quadrant | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const newIdentifyTarget = useCallback(() => {
    setTarget(randomPoint());
    setPickedAns(null);
    setFeedback(null);
  }, []);
  useEffect(() => { newIdentifyTarget(); }, [newIdentifyTarget]);

  const submitAnswer = useCallback((ans: Quadrant) => {
    setPickedAns(ans);
    const correct = classify(target.x, target.y);
    if (ans === correct) {
      setCorrectCount(c => c + 1);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
    setTotalCount(c => c + 1);
  }, [target]);

  // Flip mode
  const [flipPoint, setFlipPoint] = useState({ x: 3, y: 4 });

  // Reflect mode
  const reflectPoint = { x: 3, y: 2 };
  const reflections = useMemo(() => ({
    original: { ...reflectPoint, label: 'P' },
    acrossX:  { x: reflectPoint.x, y: -reflectPoint.y, label: "P'" },
    acrossY:  { x: -reflectPoint.x, y: reflectPoint.y, label: "P''" },
    origin:   { x: -reflectPoint.x, y: -reflectPoint.y, label: "P'''" },
  }), []);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    setPickedAns(null);
    setFeedback(null);
  }, []);

  const origin = toSvg(0, 0);

  return (
    <div style={{
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          The Four <span style={{ color: '#f59e0b' }}>Quadrants</span>
        </h1>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginTop: 4 }}>
          Sign Rules · Class 9 Mathematics
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {([
          ['identify', 'Practice: Identify Quadrant'],
          ['flip', 'Sign-Flip Explorer'],
          ['reflect', 'Reflections'],
        ] as [Mode, string][]).map(([m, label]) => {
          const active = mode === m;
          return (
            <button key={m} onClick={() => switchMode(m)}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: active ? '1px solid rgba(245,158,11,0.6)' : '1px solid rgba(255,255,255,0.08)',
                background: active ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                color: active ? '#fbbf24' : '#94a3b8',
              }}>{label}</button>
          );
        })}
      </div>

      {/* SVG plane with quadrant tints */}
      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)', background: '#0B0F15',
        marginBottom: 14,
      }}>
        <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ display: 'block' }}>
          {/* Quadrant tints */}
          <rect x={origin.px} y={PAD} width={SVG_W - PAD - origin.px} height={origin.py - PAD}
            fill="rgba(52,211,153,0.06)" />
          <rect x={PAD} y={PAD} width={origin.px - PAD} height={origin.py - PAD}
            fill="rgba(96,165,250,0.06)" />
          <rect x={PAD} y={origin.py} width={origin.px - PAD} height={SVG_H - PAD - origin.py}
            fill="rgba(248,113,113,0.06)" />
          <rect x={origin.px} y={origin.py} width={SVG_W - PAD - origin.px} height={SVG_H - PAD - origin.py}
            fill="rgba(167,139,250,0.06)" />

          {/* Grid */}
          {Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => {
            const x = X_MIN + i;
            const { px } = toSvg(x, 0);
            return <line key={`vg${x}`} x1={px} y1={PAD} x2={px} y2={SVG_H - PAD}
              stroke="rgba(255,255,255,0.05)" strokeWidth={1} />;
          })}
          {Array.from({ length: Y_MAX - Y_MIN + 1 }, (_, i) => {
            const y = Y_MIN + i;
            const { py } = toSvg(0, y);
            return <line key={`hg${y}`} x1={PAD} y1={py} x2={SVG_W - PAD} y2={py}
              stroke="rgba(255,255,255,0.05)" strokeWidth={1} />;
          })}

          {/* Quadrant labels (subtle, in each region) */}
          {(['I', 'II', 'III', 'IV'] as const).map(q => {
            const pos = q === 'I'  ? toSvg(5, 4)
                      : q === 'II' ? toSvg(-5, 4)
                      : q === 'III' ? toSvg(-5, -4)
                      : toSvg(5, -4);
            const colour = q === 'I' ? '#34d399' : q === 'II' ? '#60a5fa' : q === 'III' ? '#f87171' : '#a78bfa';
            return (
              <text key={q} x={pos.px} y={pos.py} fill={colour}
                fontSize={11} fontWeight={700} textAnchor="middle" opacity={0.65}>
                Quadrant {q}
              </text>
            );
          })}

          {/* Axes */}
          <line x1={PAD} y1={origin.py} x2={SVG_W - PAD} y2={origin.py} stroke="#fbbf24" strokeWidth={1.5} />
          <line x1={origin.px} y1={PAD} x2={origin.px} y2={SVG_H - PAD} stroke="#fbbf24" strokeWidth={1.5} />
          <path d={`M${SVG_W - PAD},${origin.py} l-7,-4 l0,8 z`} fill="#fbbf24" />
          <path d={`M${origin.px},${PAD} l-4,7 l8,0 z`} fill="#fbbf24" />

          {/* Tick marks */}
          {Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => {
            const x = X_MIN + i;
            if (x === 0) return null;
            const { px } = toSvg(x, 0);
            return (
              <g key={`tx${x}`}>
                <line x1={px} y1={origin.py - 3} x2={px} y2={origin.py + 3} stroke="#fbbf24" strokeWidth={1.2} />
                <text x={px} y={origin.py + 13} fill="#94a3b8" fontSize={9} fontWeight={600} textAnchor="middle">{fmt(x)}</text>
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
                <text x={origin.px - 7} y={py + 3} fill="#94a3b8" fontSize={9} fontWeight={600} textAnchor="end">{fmt(y)}</text>
              </g>
            );
          })}
          <text x={origin.px - 7} y={origin.py + 13} fill="#94a3b8" fontSize={9} fontWeight={700} textAnchor="end">O</text>

          {/* Mode-specific points */}
          {mode === 'identify' && (() => {
            const p = toSvg(target.x, target.y);
            return (
              <g>
                <circle cx={p.px} cy={p.py} r={7} fill="#fbbf24" stroke="#0B0F15" strokeWidth={2} />
                <text x={p.px + 10} y={p.py - 8} fill="#fbbf24" fontSize={11} fontWeight={700}>
                  P({fmt(target.x)}, {fmt(target.y)})
                </text>
              </g>
            );
          })()}

          {mode === 'flip' && (() => {
            const p = toSvg(flipPoint.x, flipPoint.y);
            return (
              <g>
                <circle cx={p.px} cy={p.py} r={7} fill="#fbbf24" stroke="#0B0F15" strokeWidth={2} />
                <text x={p.px + 10} y={p.py - 8} fill="#fbbf24" fontSize={11} fontWeight={700}>
                  ({fmt(flipPoint.x)}, {fmt(flipPoint.y)}) → Quadrant {classify(flipPoint.x, flipPoint.y)}
                </text>
              </g>
            );
          })()}

          {mode === 'reflect' && (() => {
            const colours = { original: '#fbbf24', acrossX: '#34d399', acrossY: '#60a5fa', origin: '#a78bfa' };
            const labels = { original: 'P (original)', acrossX: "P' (across x)", acrossY: "P'' (across y)", origin: "P''' (across O)" };
            return (
              <g>
                {(['original', 'acrossX', 'acrossY', 'origin'] as const).map(k => {
                  const r = reflections[k];
                  const p = toSvg(r.x, r.y);
                  return (
                    <g key={k}>
                      <circle cx={p.px} cy={p.py} r={6} fill={colours[k]} stroke="#0B0F15" strokeWidth={2} />
                      <text x={p.px + 10} y={p.py - 6} fill={colours[k]} fontSize={10} fontWeight={700}>
                        {r.label} ({fmt(r.x)}, {fmt(r.y)})
                      </text>
                    </g>
                  );
                })}
                <text x={origin.px} y={SVG_H - 6} fill="#475569" fontSize={9} fontWeight={700} textAnchor="middle">
                  Original P=({fmt(reflectPoint.x)}, {fmt(reflectPoint.y)}) plus three reflections
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Mode-specific controls */}
      {mode === 'identify' && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, marginBottom: 8 }}>
            Where does P({fmt(target.x)}, {fmt(target.y)}) lie?
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['I', 'II', 'III', 'IV'] as const).map(q => {
              const correct = classify(target.x, target.y) === q;
              const picked = pickedAns === q;
              return (
                <button key={q} onClick={() => !pickedAns && submitAnswer(q)} disabled={!!pickedAns}
                  style={{
                    padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                    cursor: pickedAns ? 'default' : 'pointer',
                    border: pickedAns
                      ? (correct ? '1.5px solid rgba(52,211,153,0.7)' : (picked ? '1.5px solid rgba(248,113,113,0.7)' : '1px solid rgba(255,255,255,0.08)'))
                      : '1px solid rgba(255,255,255,0.08)',
                    background: pickedAns
                      ? (correct ? 'rgba(52,211,153,0.15)' : (picked ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.04)'))
                      : 'rgba(255,255,255,0.04)',
                    color: pickedAns
                      ? (correct ? '#34d399' : (picked ? '#f87171' : '#475569'))
                      : '#fbbf24',
                  }}>
                  Quadrant {q}
                </button>
              );
            })}
            <button onClick={newIdentifyTarget}
              style={{
                padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
                marginLeft: 'auto',
              }}>
              Next →
            </button>
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, marginTop: 10 }}>
            Score: <b style={{ color: '#fbbf24' }}>{correctCount}</b> / {totalCount} correct
            {feedback === 'correct' && <span style={{ color: '#34d399', marginLeft: 14 }}>✓ Correct</span>}
            {feedback === 'wrong' && <span style={{ color: '#f87171', marginLeft: 14 }}>
              The correct answer is Quadrant {classify(target.x, target.y)} ({fmt(target.x)} {target.x > 0 ? '> 0' : '< 0'}, {fmt(target.y)} {target.y > 0 ? '> 0' : '< 0'})
            </span>}
          </p>
        </div>
      )}

      {mode === 'flip' && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          <button onClick={() => setFlipPoint(p => ({ ...p, x: -p.x }))}
            style={{
              padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              border: '1px solid rgba(245,158,11,0.6)', background: 'rgba(245,158,11,0.15)', color: '#fbbf24',
            }}>
            Flip x-sign
          </button>
          <button onClick={() => setFlipPoint(p => ({ ...p, y: -p.y }))}
            style={{
              padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              border: '1px solid rgba(245,158,11,0.6)', background: 'rgba(245,158,11,0.15)', color: '#fbbf24',
            }}>
            Flip y-sign
          </button>
          <button onClick={() => setFlipPoint({ x: -flipPoint.x, y: -flipPoint.y })}
            style={{
              padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              border: '1px solid rgba(167,139,250,0.6)', background: 'rgba(167,139,250,0.15)', color: '#a78bfa',
            }}>
            Flip both
          </button>
          <button onClick={() => setFlipPoint({ x: 3, y: 4 })}
            style={{
              padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
            }}>
            Reset to (3, 4)
          </button>
        </div>
      )}

      <div style={{
        borderRadius: 10, padding: '12px 14px',
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fbbf24', margin: 0, marginBottom: 6 }}>
          Sign Rules
        </p>
        <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
          <b style={{ color: '#34d399' }}>Q I</b> (+, +)&nbsp;·&nbsp;
          <b style={{ color: '#60a5fa' }}>Q II</b> (−, +)&nbsp;·&nbsp;
          <b style={{ color: '#f87171' }}>Q III</b> (−, −)&nbsp;·&nbsp;
          <b style={{ color: '#a78bfa' }}>Q IV</b> (+, −)
        </p>
      </div>
    </div>
  );
}
