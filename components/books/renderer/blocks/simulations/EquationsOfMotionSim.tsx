'use client';

// EquationsOfMotionSim.tsx
// Class 9 Physics — Motion Chapter
// Students enter any 3 of 5 kinematic variables (u, v, a, s, t) and get the
// other 2 solved, with a brief SVG animation showing the motion.
//
// Equations of motion (NCERT Class 9 Science, Chapter 8 — Motion):
//   1. v = u + at
//   2. s = ut + ½at²
//   3. v² = u² + 2as
//   (derived: s = ½(u+v)t)
//
// Design: follows SIMULATION_DESIGN_WORKFLOW.md exactly.

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

type VarKey = 'u' | 'v' | 'a' | 's' | 't';

interface VarMeta {
  symbol: VarKey;
  name: string;
  unit: string;
}

interface SolveResult {
  solved: Partial<Record<VarKey, number>>;
  equation_used: string;
  all_values: Record<VarKey, number>;
}

// ── Variable metadata ──────────────────────────────────────────────────────────

const VARS: VarMeta[] = [
  { symbol: 'u', name: 'Initial velocity', unit: 'm/s' },
  { symbol: 'v', name: 'Final velocity',   unit: 'm/s' },
  { symbol: 'a', name: 'Acceleration',     unit: 'm/s²' },
  { symbol: 's', name: 'Displacement',     unit: 'm'    },
  { symbol: 't', name: 'Time',             unit: 's'    },
];

// ── Preset scenarios ───────────────────────────────────────────────────────────

interface Preset {
  label: string;
  values: Partial<Record<VarKey, string>>;
}

const PRESETS: Preset[] = [
  {
    label: 'Braking car',
    // Car decelerates from 20 m/s to rest in 4 s
    values: { u: '20', v: '0', t: '4' },
  },
  {
    label: 'Free fall',
    // Object dropped from rest, a = 9.8 m/s² (approx 10), t = 3 s
    values: { u: '0', a: '10', t: '3' },
  },
  {
    label: 'Train',
    // Train starts at 5 m/s, accelerates at 2 m/s² over 100 m
    values: { u: '5', a: '2', s: '100' },
  },
];

// ── Solve logic ────────────────────────────────────────────────────────────────
// Source: NCERT Class 9 Science Chapter 8 — Motion
// All three standard equations plus the derived fourth equation are used.

function parseNum(s: string): number | null {
  if (s.trim() === '') return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function solveKinematics(
  inputs: Record<VarKey, string>,
): SolveResult | string {
  const k: Partial<Record<VarKey, number>> = {};
  for (const key of ['u', 'v', 'a', 's', 't'] as VarKey[]) {
    const n = parseNum(inputs[key]);
    if (n !== null) k[key] = n;
  }

  const knowns = Object.keys(k) as VarKey[];
  if (knowns.length < 3) {
    return `Need exactly 3 known values. Currently have ${knowns.length}.`;
  }

  const has = (key: VarKey) => k[key] !== undefined;
  const n = (key: VarKey) => k[key] as number;

  // Try all known combos and pick the first that works
  let solved: Partial<Record<VarKey, number>> | null = null;
  let equation_used = '';
  let computed: Record<VarKey, number> | null = null;

  // 1. know u, a, t → v and s
  if (!solved && has('u') && has('a') && has('t')) {
    const v = n('u') + n('a') * n('t');                       // v = u + at
    const s = n('u') * n('t') + 0.5 * n('a') * n('t') ** 2;  // s = ut + ½at²
    solved = {};
    if (!has('v')) solved.v = v;
    if (!has('s')) solved.s = s;
    equation_used = 'v = u + at  and  s = ut + ½at²';
    computed = { u: n('u'), v: has('v') ? n('v') : v, a: n('a'), s: has('s') ? n('s') : s, t: n('t') };
  }

  // 2. know u, v, t → a and s
  if (!solved && has('u') && has('v') && has('t')) {
    if (n('t') === 0) return 'Time t cannot be 0.';
    const a = (n('v') - n('u')) / n('t');                     // a = (v−u)/t
    const s = 0.5 * (n('u') + n('v')) * n('t');               // s = ½(u+v)t
    solved = {};
    if (!has('a')) solved.a = a;
    if (!has('s')) solved.s = s;
    equation_used = 'a = (v − u)/t  and  s = ½(u+v)t';
    computed = { u: n('u'), v: n('v'), a: has('a') ? n('a') : a, s: has('s') ? n('s') : s, t: n('t') };
  }

  // 3. know u, v, a → t and s
  if (!solved && has('u') && has('v') && has('a')) {
    if (n('a') === 0) return 'Acceleration a cannot be 0 when solving for t.';
    const t = (n('v') - n('u')) / n('a');                     // t = (v−u)/a
    const s = (n('v') ** 2 - n('u') ** 2) / (2 * n('a'));    // v² = u² + 2as
    solved = {};
    if (!has('t')) solved.t = t;
    if (!has('s')) solved.s = s;
    equation_used = 't = (v − u)/a  and  v² = u² + 2as';
    computed = { u: n('u'), v: n('v'), a: n('a'), s: has('s') ? n('s') : s, t: has('t') ? n('t') : t };
  }

  // 4. know u, a, s → v and t
  if (!solved && has('u') && has('a') && has('s')) {
    const disc = n('u') ** 2 + 2 * n('a') * n('s');
    if (disc < 0) return 'No real solution: discriminant < 0 for these values.';
    const v = Math.sqrt(disc);                                 // v = √(u²+2as)
    if (n('a') === 0) return 'Acceleration a cannot be 0 when solving for t this way.';
    const t = (v - n('u')) / n('a');
    solved = {};
    if (!has('v')) solved.v = v;
    if (!has('t')) solved.t = t;
    equation_used = 'v² = u² + 2as  and  t = (v − u)/a';
    computed = { u: n('u'), v: has('v') ? n('v') : v, a: n('a'), s: n('s'), t: has('t') ? n('t') : t };
  }

  // 5. know v, a, t → u and s
  if (!solved && has('v') && has('a') && has('t')) {
    const u = n('v') - n('a') * n('t');                        // u = v − at
    const s = n('v') * n('t') - 0.5 * n('a') * n('t') ** 2;
    solved = {};
    if (!has('u')) solved.u = u;
    if (!has('s')) solved.s = s;
    equation_used = 'u = v − at  and  s = vt − ½at²';
    computed = { u: has('u') ? n('u') : u, v: n('v'), a: n('a'), s: has('s') ? n('s') : s, t: n('t') };
  }

  // 6. know u, v, s → a and t
  if (!solved && has('u') && has('v') && has('s')) {
    if (n('s') === 0) return 'Displacement s cannot be 0 when solving for a and t this way.';
    const a = (n('v') ** 2 - n('u') ** 2) / (2 * n('s'));     // v² = u² + 2as
    const sum = n('u') + n('v');
    if (sum === 0) return 'u + v cannot be 0 when solving for t.';
    const t = (2 * n('s')) / sum;                              // t = 2s/(u+v)
    solved = {};
    if (!has('a')) solved.a = a;
    if (!has('t')) solved.t = t;
    equation_used = 'v² = u² + 2as  and  t = 2s/(u+v)';
    computed = { u: n('u'), v: n('v'), a: has('a') ? n('a') : a, s: n('s'), t: has('t') ? n('t') : t };
  }

  // 7. know a, s, t → u and v
  if (!solved && has('a') && has('s') && has('t')) {
    if (n('t') === 0) return 'Time t cannot be 0.';
    const u = n('s') / n('t') - 0.5 * n('a') * n('t');        // from s = ut + ½at²
    const v = u + n('a') * n('t');
    solved = {};
    if (!has('u')) solved.u = u;
    if (!has('v')) solved.v = v;
    equation_used = 's = ut + ½at²  and  v = u + at';
    computed = { u: has('u') ? n('u') : u, v: has('v') ? n('v') : v, a: n('a'), s: n('s'), t: n('t') };
  }

  // 8. know v, s, t → u and a
  if (!solved && has('v') && has('s') && has('t')) {
    if (n('t') === 0) return 'Time t cannot be 0.';
    const u = (2 * n('s') - n('v') * n('t')) / n('t');        // from s = ½(u+v)t → u = 2s/t − v
    const a = (n('v') - u) / n('t');
    solved = {};
    if (!has('u')) solved.u = u;
    if (!has('a')) solved.a = a;
    equation_used = 's = ½(u+v)t  and  a = (v − u)/t';
    computed = { u: has('u') ? n('u') : u, v: n('v'), a: has('a') ? n('a') : a, s: n('s'), t: n('t') };
  }

  if (!solved || !computed) {
    return 'Cannot solve with this combination. Try different variables.';
  }

  return {
    solved: solved!,
    equation_used,
    all_values: computed!,
  };
}

// ── Helper: format number ──────────────────────────────────────────────────────

function fmt(n: number): string {
  if (Math.abs(n) < 0.001 && n !== 0) return n.toExponential(2);
  const s = parseFloat(n.toFixed(3)).toString();
  return s;
}

// ── Animation SVG component ────────────────────────────────────────────────────
// Shows a ball moving along a track from left to right.
// animProgress: 0 → 1

interface AnimProps {
  animProgress: number; // 0–1
  allValues: Record<VarKey, number> | null;
}

function MotionAnimation({ animProgress, allValues }: AnimProps) {
  const W = 380;
  const H = 90;
  const trackY = 62;
  const ballR = 10;
  const startX = 30 + ballR;
  const endX = W - 30 - ballR;
  const trackLen = endX - startX;

  const ballX = startX + animProgress * trackLen;

  // Tick marks every 10% of track
  const ticks = Array.from({ length: 11 }, (_, i) => startX + i * trackLen * 0.1);

  const uVal = allValues?.u ?? 0;
  const vVal = allValues?.v ?? 0;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {/* Track */}
      <line x1={startX} y1={trackY} x2={endX} y2={trackY} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
      {/* Track ticks */}
      {ticks.map((tx, i) => (
        <line key={i} x1={tx} y1={trackY - 4} x2={tx} y2={trackY + 4}
          stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
      ))}
      {/* Start label */}
      <text x={startX} y={trackY + 18} fill="#94a3b8" fontSize={10} textAnchor="middle" fontWeight={700}>
        Start
      </text>
      {/* End label */}
      <text x={endX} y={trackY + 18} fill="#94a3b8" fontSize={10} textAnchor="middle" fontWeight={700}>
        End
      </text>

      {/* Ball */}
      <circle cx={ballX} cy={trackY - ballR - 1} r={ballR}
        fill="#f59e0b" stroke="#0B0F15" strokeWidth={2} />

      {/* u arrow (initial velocity — at start) */}
      {animProgress < 0.15 && (
        <g>
          <line x1={startX + ballR + 2} y1={trackY - ballR - 1}
            x2={startX + ballR + 30} y2={trackY - ballR - 1}
            stroke="#34d399" strokeWidth={2} />
          <polygon
            points={`${startX + ballR + 30},${trackY - ballR - 5} ${startX + ballR + 38},${trackY - ballR - 1} ${startX + ballR + 30},${trackY - ballR + 3}`}
            fill="#34d399" />
          <text x={startX + ballR + 20} y={trackY - ballR - 8}
            fill="#34d399" fontSize={10} textAnchor="middle" fontWeight={700}>
            u = {fmt(uVal)} m/s
          </text>
        </g>
      )}

      {/* v arrow (final velocity — at end) */}
      {animProgress > 0.85 && (
        <g>
          <line x1={endX - ballR - 38} y1={trackY - ballR - 1}
            x2={endX - ballR - 2} y2={trackY - ballR - 1}
            stroke="#f59e0b" strokeWidth={2} />
          <polygon
            points={`${endX - ballR - 2},${trackY - ballR - 5} ${endX - ballR + 6},${trackY - ballR - 1} ${endX - ballR - 2},${trackY - ballR + 3}`}
            fill="#f59e0b" />
          <text x={endX - ballR - 20} y={trackY - ballR - 8}
            fill="#fbbf24" fontSize={10} textAnchor="middle" fontWeight={700}>
            v = {fmt(vVal)} m/s
          </text>
        </g>
      )}
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function EquationsOfMotionSim() {
  const [inputs, setInputs] = useState<Record<VarKey, string>>({
    u: '', v: '', a: '', s: '', t: '',
  });
  const [result, setResult] = useState<SolveResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [animProgress, setAnimProgress] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const animStartRef = useRef<number | null>(null);

  // Count filled inputs
  const filledCount = useMemo(() =>
    Object.values(inputs).filter(v => v.trim() !== '' && !isNaN(parseFloat(v))).length,
    [inputs],
  );

  const handleInputChange = useCallback((key: VarKey, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
    // Reset result when inputs change
    setResult(null);
    setError(null);
    setAnimProgress(0);
  }, []);

  const handleClear = useCallback((key: VarKey) => {
    setInputs(prev => ({ ...prev, [key]: '' }));
    setResult(null);
    setError(null);
    setAnimProgress(0);
  }, []);

  const handleSolve = useCallback(() => {
    const res = solveKinematics(inputs);
    if (typeof res === 'string') {
      setError(res);
      setResult(null);
      setAnimProgress(0);
    } else {
      setResult(res);
      setError(null);
      setAnimProgress(0);
    }
  }, [inputs]);

  const handleReset = useCallback(() => {
    setInputs({ u: '', v: '', a: '', s: '', t: '' });
    setResult(null);
    setError(null);
    setAnimProgress(0);
  }, []);

  const handlePreset = useCallback((preset: Preset) => {
    const fresh: Record<VarKey, string> = { u: '', v: '', a: '', s: '', t: '' };
    for (const [k, val] of Object.entries(preset.values)) {
      fresh[k as VarKey] = val as string;
    }
    setInputs(fresh);
    setResult(null);
    setError(null);
    setAnimProgress(0);
  }, []);

  // Run animation when result arrives
  useEffect(() => {
    if (!result) return;
    setAnimProgress(0);
    animStartRef.current = null;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const DURATION = 2000; // ms

    function step(ts: number) {
      if (!animStartRef.current) animStartRef.current = ts;
      const elapsed = ts - animStartRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      setAnimProgress(progress);
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      }
    }

    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [result]);

  // ── Render ────────────────────────────────────────────────────────────────

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

      {/* ── Header ── */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: '#fff',
          margin: 0,
        }}>
          Equations of <span style={{ color: '#f59e0b' }}>Motion</span>
        </h1>
        <p style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#475569',
          marginTop: 4,
          marginBottom: 0,
        }}>
          Kinematic Variable Solver · Class 9 Physics
        </p>
      </div>

      {/* ── Preset buttons ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => handlePreset(p)}
            style={{
              padding: '5px 12px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: '#94a3b8',
              transition: 'all 0.2s',
            }}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={handleReset}
          style={{
            padding: '5px 12px',
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            border: '1px solid rgba(99,102,241,0.3)',
            background: 'rgba(99,102,241,0.08)',
            color: '#a5b4fc',
            marginLeft: 'auto',
            transition: 'all 0.2s',
          }}
        >
          ↺ Reset
        </button>
      </div>

      {/* ── Variable input cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 8,
        marginBottom: 16,
      }}>
        {VARS.map(({ symbol, name, unit }) => {
          const isSolved = result?.solved[symbol] !== undefined;
          const isKnown = !isSolved && inputs[symbol].trim() !== '' && !isNaN(parseFloat(inputs[symbol]));
          const displayVal = isSolved ? fmt(result!.solved[symbol]!) : inputs[symbol];

          let borderColor = 'rgba(255,255,255,0.08)';
          let boxShadow = 'none';
          if (isSolved) {
            borderColor = 'rgba(245,158,11,0.5)';
            boxShadow = '0 0 0 2px rgba(245,158,11,0.4)';
          } else if (isKnown) {
            borderColor = 'rgba(52,211,153,0.5)';
            boxShadow = '0 0 0 1px rgba(52,211,153,0.2)';
          }

          return (
            <div
              key={symbol}
              style={{
                borderRadius: 12,
                background: '#0B0F15',
                border: `1px solid ${borderColor}`,
                boxShadow,
                padding: '10px 8px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.25s ease',
                position: 'relative',
              }}
            >
              {/* Symbol */}
              <span style={{
                fontSize: 22,
                fontWeight: 900,
                fontStyle: 'italic',
                color: isSolved ? '#fbbf24' : isKnown ? '#34d399' : '#e2e8f0',
                lineHeight: 1,
              }}>
                {symbol}
              </span>
              {/* Name */}
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#475569',
                textAlign: 'center',
                lineHeight: 1.2,
              }}>
                {name}
              </span>
              {/* Unit */}
              <span style={{
                fontSize: 10,
                color: '#64748b',
                fontWeight: 600,
              }}>
                {unit}
              </span>
              {/* Input */}
              <input
                type="number"
                value={isSolved ? fmt(result!.solved[symbol]!) : inputs[symbol]}
                onChange={e => !isSolved && handleInputChange(symbol, e.target.value)}
                readOnly={isSolved}
                placeholder="—"
                style={{
                  width: '100%',
                  background: isSolved ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.04)',
                  border: 'none',
                  borderRadius: 6,
                  color: isSolved ? '#fbbf24' : '#e2e8f0',
                  fontSize: 13,
                  fontWeight: 700,
                  textAlign: 'center',
                  padding: '4px 2px',
                  outline: 'none',
                  cursor: isSolved ? 'default' : 'text',
                  boxSizing: 'border-box',
                }}
              />
              {/* Clear button */}
              {(inputs[symbol] !== '' || isSolved) && !isSolved && (
                <button
                  onClick={() => handleClear(symbol)}
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    fontSize: 9,
                    padding: '1px 4px',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#475569',
                    cursor: 'pointer',
                    lineHeight: 1.4,
                    fontWeight: 700,
                  }}
                >
                  ×
                </button>
              )}
              {/* Solved badge */}
              {isSolved && (
                <span style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  fontSize: 11,
                  color: '#fbbf24',
                  lineHeight: 1,
                }}>
                  ★
                </span>
              )}
              {/* Known badge */}
              {isKnown && (
                <span style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  fontSize: 11,
                  color: '#34d399',
                  lineHeight: 1,
                }}>
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Solve button ── */}
      <button
        onClick={handleSolve}
        disabled={filledCount < 3}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 800,
          cursor: filledCount < 3 ? 'not-allowed' : 'pointer',
          border: 'none',
          background: filledCount < 3
            ? 'rgba(255,255,255,0.05)'
            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: filledCount < 3 ? '#334155' : '#000',
          marginBottom: 16,
          transition: 'all 0.2s',
          letterSpacing: '0.02em',
        }}
      >
        {filledCount < 3 ? `Need 3 values (${filledCount}/3 filled)` : 'Solve'}
      </button>

      {/* ── Error message ── */}
      {error && (
        <div style={{
          borderRadius: 10,
          padding: '12px 14px',
          background: 'rgba(248,113,113,0.08)',
          border: '1px solid rgba(248,113,113,0.25)',
          marginBottom: 16,
        }}>
          <p style={{ margin: 0, fontSize: 13, color: '#f87171', fontWeight: 600 }}>
            {error}
          </p>
        </div>
      )}

      {/* ── Results panel ── */}
      {result && (
        <div style={{ marginBottom: 16 }}>
          {/* Equation used */}
          <div style={{
            borderRadius: 10,
            padding: '10px 14px',
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.2)',
            marginBottom: 12,
          }}>
            <p style={{
              margin: 0,
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#f59e0b',
              marginBottom: 4,
            }}>
              Equation used
            </p>
            <p style={{
              margin: 0,
              fontSize: 14,
              color: '#fbbf24',
              fontWeight: 700,
              fontStyle: 'italic',
            }}>
              {result.equation_used}
            </p>
          </div>

          {/* All 5 values table */}
          <div style={{
            borderRadius: 10,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            {VARS.map(({ symbol, name, unit }, idx) => {
              const val = result.all_values[symbol];
              const isSolved = result.solved[symbol] !== undefined;
              return (
                <div
                  key={symbol}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '9px 14px',
                    background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    borderBottom: idx < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  {/* Status icon */}
                  <span style={{
                    width: 22,
                    fontSize: 13,
                    color: isSolved ? '#fbbf24' : '#34d399',
                    flexShrink: 0,
                  }}>
                    {isSolved ? '★' : '✓'}
                  </span>
                  {/* Symbol + name */}
                  <span style={{
                    fontStyle: 'italic',
                    fontWeight: 800,
                    fontSize: 16,
                    color: isSolved ? '#fbbf24' : '#34d399',
                    width: 24,
                    flexShrink: 0,
                  }}>
                    {symbol}
                  </span>
                  <span style={{
                    fontSize: 12,
                    color: '#64748b',
                    flex: 1,
                    marginLeft: 8,
                  }}>
                    {name}
                  </span>
                  {/* Value */}
                  <span style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: isSolved ? '#fbbf24' : '#e2e8f0',
                    textAlign: 'right',
                  }}>
                    {fmt(val)} <span style={{ fontSize: 11, fontWeight: 500, color: '#475569' }}>{unit}</span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 8, paddingLeft: 2 }}>
            <span style={{ fontSize: 10, color: '#34d399', fontWeight: 700 }}>✓ Known input</span>
            <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700 }}>★ Solved value</span>
          </div>
        </div>
      )}

      {/* ── Animation ── */}
      {result && (
        <div style={{
          borderRadius: 12,
          background: '#0B0F15',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '14px 12px 10px',
          marginBottom: 0,
        }}>
          <p style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#475569',
            margin: '0 0 8px',
          }}>
            Motion Preview
          </p>
          <MotionAnimation
            animProgress={animProgress}
            allValues={result.all_values}
          />
          {/* Replay button */}
          {animProgress >= 1 && (
            <button
              onClick={() => {
                setAnimProgress(0);
                animStartRef.current = null;
                if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
                const DURATION = 2000;
                function step(ts: number) {
                  if (!animStartRef.current) animStartRef.current = ts;
                  const elapsed = ts - animStartRef.current;
                  const progress = Math.min(elapsed / DURATION, 1);
                  setAnimProgress(progress);
                  if (progress < 1) {
                    animFrameRef.current = requestAnimationFrame(step);
                  }
                }
                animFrameRef.current = requestAnimationFrame(step);
              }}
              style={{
                display: 'block',
                margin: '6px auto 0',
                padding: '5px 16px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: '#94a3b8',
              }}
            >
              ↺ Replay
            </button>
          )}
        </div>
      )}
    </div>
  );
}
