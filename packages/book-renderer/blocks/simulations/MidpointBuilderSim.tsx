'use client';

// MidpointBuilderSim.tsx
// Class 9 Mathematics — Chapter 1 — Page 12 (The Midpoint Formula)
// Two modes:
//   - Forward: drag P and Q, the midpoint M auto-snaps; both coordinates and the
//     "average of x and y" derivation are shown live.
//   - Reverse: a midpoint M and one endpoint A are given; the student types
//     the (x, y) of B and the simulator checks correctness.

import { useState, useCallback, useRef } from 'react';

const X_MIN = -8;
const X_MAX = 10;
const Y_MIN = -6;
const Y_MAX = 8;
const UNIT = 30;
const PAD = 28;
const SVG_W = (X_MAX - X_MIN) * UNIT + PAD * 2;
const SVG_H = (Y_MAX - Y_MIN) * UNIT + PAD * 2;

function toSvg(x: number, y: number) {
  return {
    px: PAD + (x - X_MIN) * UNIT,
    py: PAD + (Y_MAX - y) * UNIT,
  };
}

function fromSvgSnap(px: number, py: number) {
  const x = (px - PAD) / UNIT + X_MIN;
  const y = Y_MAX - (py - PAD) / UNIT;
  return { x: Math.round(x), y: Math.round(y) };
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function fmt(n: number) { return n < 0 ? '−' + Math.abs(n) : String(n); }

function fmtHalf(n: number) {
  // Show .5 as a half; otherwise show integer
  if (Math.abs(n - Math.round(n)) < 1e-9) return String(Math.round(n));
  return n.toFixed(1);
}

function midpoint(p: { x: number; y: number }, q: { x: number; y: number }) {
  return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
}

type Mode = 'forward' | 'reverse';

interface ReverseTask {
  M: { x: number; y: number };
  A: { x: number; y: number };
  B: { x: number; y: number };  // expected answer
  blurb: string;
}

const REVERSE: ReverseTask[] = [
  { M: { x: -7, y: 1 }, A: { x: 3, y: -4 }, B: { x: -17, y: 6 }, blurb: 'NCERT Q10' },
  { M: { x: 0, y: 0 }, A: { x: 4, y: 5 }, B: { x: -4, y: -5 }, blurb: 'A symmetric pair through the origin' },
  { M: { x: 2, y: 3 }, A: { x: -1, y: 1 }, B: { x: 5, y: 5 }, blurb: 'Mid of small segment' },
  { M: { x: 5, y: -2 }, A: { x: 8, y: 4 }, B: { x: 2, y: -8 }, blurb: 'Crossing into Quadrant III' },
];

export default function MidpointBuilderSim() {
  const [mode, setMode] = useState<Mode>('forward');

  // Forward
  const [P, setP] = useState({ x: -3, y: 2 });
  const [Q, setQ] = useState({ x: 5, y: 6 });
  const [dragging, setDragging] = useState<'P' | 'Q' | null>(null);
  const M = midpoint(P, Q);

  // Reverse
  const [tIdx, setTIdx] = useState(0);
  const [bxInput, setBxInput] = useState('');
  const [byInput, setByInput] = useState('');
  const [revStatus, setRevStatus] = useState<'pending' | 'correct' | 'wrong'>('pending');

  const svgRef = useRef<SVGSVGElement | null>(null);
  const task = REVERSE[tIdx];

  const onPtrDown = useCallback((which: 'P' | 'Q') => (e: React.PointerEvent) => {
    if (mode !== 'forward') return;
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
    const { x, y } = fromSvgSnap(px, py);
    const cx = clamp(x, X_MIN, X_MAX);
    const cy = clamp(y, Y_MIN, Y_MAX);
    if (dragging === 'P') setP({ x: cx, y: cy });
    else setQ({ x: cx, y: cy });
  }, [dragging]);

  const onUp = useCallback(() => setDragging(null), []);

  const checkReverse = useCallback(() => {
    const bx = parseFloat(bxInput);
    const by = parseFloat(byInput);
    if (Number.isNaN(bx) || Number.isNaN(by)) { setRevStatus('wrong'); return; }
    setRevStatus(bx === task.B.x && by === task.B.y ? 'correct' : 'wrong');
  }, [bxInput, byInput, task]);

  const nextTask = useCallback(() => {
    setTIdx(i => (i + 1) % REVERSE.length);
    setBxInput(''); setByInput('');
    setRevStatus('pending');
  }, []);

  return (
    <div style={{
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          Midpoint <span style={{ color: '#f59e0b' }}>Builder</span>
        </h1>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginTop: 4 }}>
          The Halfway Point of a Segment · Class 9 Mathematics
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {([
          ['forward', 'Forward: Drag P and Q'],
          ['reverse', 'Reverse: Find the missing endpoint'],
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
        {mode === 'forward' && 'Drag P or Q. The midpoint M is computed live as the average of the two coordinates.'}
        {mode === 'reverse' && (<>The midpoint <b style={{ color: '#a78bfa' }}>M({fmt(task.M.x)}, {fmt(task.M.y)})</b> and one endpoint <b style={{ color: '#fbbf24' }}>A({fmt(task.A.x)}, {fmt(task.A.y)})</b> are given. Find the other endpoint <b>B(x, y)</b>. <i>{task.blurb}.</i></>)}
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
              stroke="rgba(255,255,255,0.05)" strokeWidth={1} />;
          })}
          {Array.from({ length: Y_MAX - Y_MIN + 1 }, (_, i) => {
            const y = Y_MIN + i;
            const { py } = toSvg(0, y);
            return <line key={`hg${y}`} x1={PAD} y1={py} x2={SVG_W - PAD} y2={py}
              stroke="rgba(255,255,255,0.05)" strokeWidth={1} />;
          })}

          {/* Axes */}
          {(() => {
            const o = toSvg(0, 0);
            return (
              <g>
                <line x1={PAD} y1={o.py} x2={SVG_W - PAD} y2={o.py} stroke="#fbbf24" strokeWidth={1.5} />
                <line x1={o.px} y1={PAD} x2={o.px} y2={SVG_H - PAD} stroke="#fbbf24" strokeWidth={1.5} />
                <path d={`M${SVG_W - PAD},${o.py} l-7,-4 l0,8 z`} fill="#fbbf24" />
                <path d={`M${o.px},${PAD} l-4,7 l8,0 z`} fill="#fbbf24" />
              </g>
            );
          })()}

          {/* Tick numbers */}
          {Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => {
            const x = X_MIN + i;
            if (x === 0) return null;
            const { px } = toSvg(x, 0);
            const oy = toSvg(0, 0).py;
            return <text key={`tx${x}`} x={px} y={oy + 13} fill="#94a3b8" fontSize={9} fontWeight={600} textAnchor="middle">{fmt(x)}</text>;
          })}
          {Array.from({ length: Y_MAX - Y_MIN + 1 }, (_, i) => {
            const y = Y_MIN + i;
            if (y === 0) return null;
            const { py } = toSvg(0, y);
            const ox = toSvg(0, 0).px;
            return <text key={`ty${y}`} x={ox - 6} y={py + 3} fill="#94a3b8" fontSize={9} fontWeight={600} textAnchor="end">{fmt(y)}</text>;
          })}

          {/* Mode-specific drawing */}
          {mode === 'forward' && (() => {
            const sP = toSvg(P.x, P.y);
            const sQ = toSvg(Q.x, Q.y);
            const sM = toSvg(M.x, M.y);
            return (
              <g>
                {/* Segment */}
                <line x1={sP.px} y1={sP.py} x2={sQ.px} y2={sQ.py} stroke="#fbbf24" strokeWidth={2} />
                {/* Midpoint */}
                <circle cx={sM.px} cy={sM.py} r={6} fill="#a78bfa" stroke="#0B0F15" strokeWidth={2} />
                <text x={sM.px + 9} y={sM.py - 8} fill="#a78bfa" fontSize={11} fontWeight={700}>
                  M({fmtHalf(M.x)}, {fmtHalf(M.y)})
                </text>
                {/* P */}
                <circle cx={sP.px} cy={sP.py} r={14} fill="transparent"
                  onPointerDown={onPtrDown('P')} style={{ cursor: 'grab' }} />
                <circle cx={sP.px} cy={sP.py} r={6} fill="#fbbf24" stroke="#0B0F15" strokeWidth={2} pointerEvents="none" />
                <text x={sP.px + 8} y={sP.py - 8} fill="#fbbf24" fontSize={11} fontWeight={700} pointerEvents="none">P({fmt(P.x)}, {fmt(P.y)})</text>
                {/* Q */}
                <circle cx={sQ.px} cy={sQ.py} r={14} fill="transparent"
                  onPointerDown={onPtrDown('Q')} style={{ cursor: 'grab' }} />
                <circle cx={sQ.px} cy={sQ.py} r={6} fill="#fbbf24" stroke="#0B0F15" strokeWidth={2} pointerEvents="none" />
                <text x={sQ.px + 8} y={sQ.py - 8} fill="#fbbf24" fontSize={11} fontWeight={700} pointerEvents="none">Q({fmt(Q.x)}, {fmt(Q.y)})</text>
              </g>
            );
          })()}

          {mode === 'reverse' && (() => {
            const sM = toSvg(task.M.x, task.M.y);
            const sA = toSvg(task.A.x, task.A.y);
            // Show user's guess if entered
            const bx = parseFloat(bxInput);
            const by = parseFloat(byInput);
            const haveGuess = !Number.isNaN(bx) && !Number.isNaN(by);
            return (
              <g>
                {haveGuess && (() => {
                  const cx = clamp(bx, X_MIN, X_MAX);
                  const cy = clamp(by, Y_MIN, Y_MAX);
                  const sB = toSvg(cx, cy);
                  const colour = revStatus === 'correct' ? '#34d399' : revStatus === 'wrong' ? '#f87171' : '#94a3b8';
                  return (
                    <g>
                      <line x1={sA.px} y1={sA.py} x2={sB.px} y2={sB.py} stroke={colour} strokeWidth={2} strokeDasharray="3 3" />
                      <circle cx={sB.px} cy={sB.py} r={6} fill={colour} stroke="#0B0F15" strokeWidth={2} />
                      <text x={sB.px + 8} y={sB.py - 8} fill={colour} fontSize={11} fontWeight={700}>B({fmt(cx)}, {fmt(cy)})</text>
                    </g>
                  );
                })()}
                <circle cx={sM.px} cy={sM.py} r={6} fill="#a78bfa" stroke="#0B0F15" strokeWidth={2} />
                <text x={sM.px + 9} y={sM.py - 8} fill="#a78bfa" fontSize={11} fontWeight={700}>M({fmt(task.M.x)}, {fmt(task.M.y)})</text>
                <circle cx={sA.px} cy={sA.py} r={6} fill="#fbbf24" stroke="#0B0F15" strokeWidth={2} />
                <text x={sA.px + 9} y={sA.py - 8} fill="#fbbf24" fontSize={11} fontWeight={700}>A({fmt(task.A.x)}, {fmt(task.A.y)})</text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Mode-specific controls */}
      {mode === 'forward' && (
        <div style={{
          borderRadius: 10, padding: '12px 14px',
          background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.25)',
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa', margin: 0, marginBottom: 6 }}>
            The Midpoint, Live
          </p>
          <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.7 }}>
            {`$M = \\left( \\dfrac{x_1 + x_2}{2}, \\dfrac{y_1 + y_2}{2} \\right)$`}
            <br />
            {` = $\\left( \\dfrac{${fmt(P.x)} + ${fmt(Q.x)}}{2}, \\dfrac{${fmt(P.y)} + ${fmt(Q.y)}}{2} \\right)$`}
            <br />
            {` = $\\left( ${fmtHalf(M.x)}, ${fmtHalf(M.y)} \\right)$`}
          </p>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, marginTop: 6, lineHeight: 1.5 }}>
            (Symbolic display — your reader app renders the LaTeX. The midpoint is simply the **average of the two coordinates**, separately for x and y.)
          </p>
        </div>
      )}

      {mode === 'reverse' && (
        <div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>B = ( </label>
            <input
              type="number" value={bxInput} onChange={e => setBxInput(e.target.value)} placeholder="x"
              style={{
                width: 70, padding: '6px 8px', borderRadius: 6,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fbbf24', fontSize: 13, fontWeight: 700, textAlign: 'center',
              }}
            />
            <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>,</label>
            <input
              type="number" value={byInput} onChange={e => setByInput(e.target.value)} placeholder="y"
              style={{
                width: 70, padding: '6px 8px', borderRadius: 6,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fbbf24', fontSize: 13, fontWeight: 700, textAlign: 'center',
              }}
            />
            <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>)</label>
            <button onClick={checkReverse}
              style={{
                padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: '1px solid rgba(245,158,11,0.6)', background: 'rgba(245,158,11,0.15)', color: '#fbbf24',
              }}>
              Check
            </button>
            <button onClick={nextTask}
              style={{
                padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
                marginLeft: 'auto',
              }}>
              Next Task →
            </button>
          </div>
          {revStatus === 'correct' && (
            <div style={{ borderRadius: 10, padding: '10px 14px',
              background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.25)' }}>
              <p style={{ fontSize: 12, color: '#34d399', margin: 0, fontWeight: 700, lineHeight: 1.5 }}>
                ✓ Correct. B = ({fmt(task.B.x)}, {fmt(task.B.y)}). Reasoning: since M is the midpoint of A and B, $B_x = 2 M_x - A_x$ and $B_y = 2 M_y - A_y$.
              </p>
            </div>
          )}
          {revStatus === 'wrong' && (
            <div style={{ borderRadius: 10, padding: '10px 14px',
              background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.3)' }}>
              <p style={{ fontSize: 12, color: '#f87171', margin: 0, fontWeight: 700, lineHeight: 1.5 }}>
                Not quite. <span style={{ color: '#94a3b8', fontWeight: 400 }}>{'Hint: $M_x = \\dfrac{A_x + B_x}{2}$, so $B_x = 2 M_x - A_x$ — and similarly for y. Try again or press Next.'}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
