'use client';

// CircleAndLocusExplorerSim.tsx
// Class 9 Mathematics — Chapter 1 — Page 13 (Circles, Centres & Collinearity)
// Two modes:
//   - Circle: drag the centre (h, k), slide the radius r, click anywhere to drop
//     test points; sim labels each as INSIDE / ON / OUTSIDE the circle.
//   - Collinearity: place three points; the sim computes all three pair-distances
//     and tells you whether they are collinear (one distance equals the sum of
//     the other two — the "triangle inequality is actually an equality" test).

import { useState, useCallback, useRef } from 'react';

const X_MIN = -10;
const X_MAX = 10;
const Y_MIN = -8;
const Y_MAX = 8;
const UNIT = 28;
const PAD = 26;
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

function dist(p: { x: number; y: number }, q: { x: number; y: number }) {
  return Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2);
}

type Mode = 'circle' | 'collinear';

export default function CircleAndLocusExplorerSim() {
  const [mode, setMode] = useState<Mode>('circle');

  // Circle mode
  const [centre, setCentre] = useState({ x: 0, y: 0 });
  const [radius, setRadius] = useState(5);
  const [testPts, setTestPts] = useState<{ x: number; y: number }[]>([
    { x: 3, y: 4 }, { x: -5, y: 6 }, { x: 6, y: 0 },
  ]);
  const [draggingC, setDraggingC] = useState(false);

  // Collinearity mode
  const [tris, setTris] = useState<{ x: number; y: number }[]>([
    { x: -3, y: -4 }, { x: 0, y: 0 }, { x: 6, y: 8 },
  ]);
  const [draggingT, setDraggingT] = useState<number | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // ── Circle handlers ──
  const onCentreDown = useCallback((e: React.PointerEvent) => {
    if (mode !== 'circle') return;
    e.stopPropagation();
    setDraggingC(true);
  }, [mode]);

  const onSvgPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (mode !== 'circle') return;
    if (draggingC) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const py = ((e.clientY - rect.top) / rect.height) * SVG_H;
    const { x, y } = fromSvgSnap(px, py);
    const cx = clamp(x, X_MIN, X_MAX);
    const cy = clamp(y, Y_MIN, Y_MAX);
    setTestPts(curr => [...curr.slice(-5), { x: cx, y: cy }]);
  }, [mode, draggingC]);

  // ── Collinearity handlers ──
  const onTriDown = useCallback((i: number) => (e: React.PointerEvent) => {
    if (mode !== 'collinear') return;
    e.stopPropagation();
    setDraggingT(i);
  }, [mode]);

  const onMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const py = ((e.clientY - rect.top) / rect.height) * SVG_H;
    const { x, y } = fromSvgSnap(px, py);
    const cx = clamp(x, X_MIN, X_MAX);
    const cy = clamp(y, Y_MIN, Y_MAX);
    if (mode === 'circle' && draggingC) setCentre({ x: cx, y: cy });
    if (mode === 'collinear' && draggingT !== null) {
      setTris(curr => curr.map((p, idx) => idx === draggingT ? { x: cx, y: cy } : p));
    }
  }, [mode, draggingC, draggingT]);

  const onUp = useCallback(() => { setDraggingC(false); setDraggingT(null); }, []);

  // Collinearity test
  const ab = dist(tris[0], tris[1]);
  const bc = dist(tris[1], tris[2]);
  const ac = dist(tris[0], tris[2]);
  const sortedSides = [ab, bc, ac].sort((a, b) => b - a);
  const collinearityResidual = Math.abs(sortedSides[0] - (sortedSides[1] + sortedSides[2]));
  const isCollinear = collinearityResidual < 0.01;

  // For test points classification (circle mode)
  function classifyPoint(p: { x: number; y: number }): 'inside' | 'on' | 'outside' {
    const d = dist(p, centre);
    if (Math.abs(d - radius) < 0.05) return 'on';
    return d < radius ? 'inside' : 'outside';
  }

  return (
    <div style={{
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          Circle &amp; <span style={{ color: '#f59e0b' }}>Locus Explorer</span>
        </h1>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginTop: 4 }}>
          Distance, Centres, and Straight Lines · Class 9 Mathematics
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {([
          ['circle', 'Circle: Inside / On / Outside'],
          ['collinear', 'Collinearity: Three Points on a Line?'],
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
        {mode === 'circle' && 'Drag the centre, slide the radius, click anywhere to drop test points. Each point is classified as **inside**, **on**, or **outside** the circle by comparing its distance from the centre to the radius.'}
        {mode === 'collinear' && 'Drag the three points. The simulator computes the three pair-distances and applies the **collinearity test**: if one of the three distances equals the sum of the other two, the three points lie on the same straight line.'}
      </p>

      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)', background: '#0B0F15',
        marginBottom: 14,
      }}>
        <svg
          ref={svgRef} width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block', cursor: (draggingC || draggingT !== null) ? 'grabbing' : (mode === 'circle' ? 'crosshair' : 'default'), touchAction: 'none' }}
          onPointerDown={onSvgPointerDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={onUp}
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
                <line x1={PAD} y1={o.py} x2={SVG_W - PAD} y2={o.py} stroke="#fbbf24" strokeWidth={1.2} />
                <line x1={o.px} y1={PAD} x2={o.px} y2={SVG_H - PAD} stroke="#fbbf24" strokeWidth={1.2} />
              </g>
            );
          })()}

          {/* Circle mode rendering */}
          {mode === 'circle' && (() => {
            const c = toSvg(centre.x, centre.y);
            const rPx = radius * UNIT;
            return (
              <g>
                <circle cx={c.px} cy={c.py} r={rPx}
                  fill="rgba(245,158,11,0.06)" stroke="#fbbf24" strokeWidth={2} />
                {/* Centre */}
                <circle cx={c.px} cy={c.py} r={14} fill="transparent"
                  onPointerDown={onCentreDown} style={{ cursor: 'grab' }} />
                <circle cx={c.px} cy={c.py} r={5} fill="#fbbf24" stroke="#0B0F15" strokeWidth={2} pointerEvents="none" />
                <text x={c.px + 8} y={c.py - 8} fill="#fbbf24" fontSize={10} fontWeight={700} pointerEvents="none">
                  centre ({fmt(centre.x)}, {fmt(centre.y)}), r = {radius}
                </text>
                {/* Test points */}
                {testPts.map((p, i) => {
                  const k = classifyPoint(p);
                  const colour = k === 'on' ? '#fbbf24' : k === 'inside' ? '#34d399' : '#f87171';
                  const sp = toSvg(p.x, p.y);
                  return (
                    <g key={`tp${i}`}>
                      <circle cx={sp.px} cy={sp.py} r={5} fill={colour} stroke="#0B0F15" strokeWidth={1.5} />
                      <text x={sp.px + 7} y={sp.py - 6} fill={colour} fontSize={10} fontWeight={700}>
                        ({fmt(p.x)}, {fmt(p.y)}) {k}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })()}

          {/* Collinearity mode rendering */}
          {mode === 'collinear' && (() => {
            const sa = toSvg(tris[0].x, tris[0].y);
            const sb = toSvg(tris[1].x, tris[1].y);
            const sc = toSvg(tris[2].x, tris[2].y);
            const colour = isCollinear ? '#34d399' : '#f87171';
            return (
              <g>
                <polygon points={`${sa.px},${sa.py} ${sb.px},${sb.py} ${sc.px},${sc.py}`}
                  fill={colour + '22'} stroke={colour} strokeWidth={2} />
                {tris.map((p, i) => {
                  const sp = toSvg(p.x, p.y);
                  const lab = ['A', 'B', 'C'][i];
                  return (
                    <g key={`pt${i}`}>
                      <circle cx={sp.px} cy={sp.py} r={14} fill="transparent"
                        onPointerDown={onTriDown(i)} style={{ cursor: 'grab' }} />
                      <circle cx={sp.px} cy={sp.py} r={6} fill="#fbbf24" stroke="#0B0F15" strokeWidth={2} pointerEvents="none" />
                      <text x={sp.px + 8} y={sp.py - 8} fill="#fbbf24" fontSize={11} fontWeight={700} pointerEvents="none">
                        {lab}({fmt(p.x)}, {fmt(p.y)})
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Mode-specific controls and readouts */}
      {mode === 'circle' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '10px 14px', alignItems: 'center', marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>Radius:</label>
            <input type="range" min={1} max={10} step={1} value={radius}
              onChange={e => setRadius(parseInt(e.target.value, 10))} style={{ accentColor: '#f59e0b' }} />
            <span style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{radius}</span>
          </div>
          <div style={{
            borderRadius: 10, padding: '12px 14px',
            background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fbbf24', margin: 0, marginBottom: 6 }}>
              Locus Test
            </p>
            <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
              A point $(x, y)$ lies on the circle of centre $(h, k)$ and radius $r$ exactly when
              <br />$\\sqrt{`{(x-h)^2 + (y-k)^2}`} = r$  ⇔  $(x - h)^2 + (y - k)^2 = r^2$.
              <br /><br />
              <b style={{ color: '#34d399' }}>green = inside</b> (distance &lt; r)&nbsp;·&nbsp;
              <b style={{ color: '#fbbf24' }}>amber = on</b> (distance = r)&nbsp;·&nbsp;
              <b style={{ color: '#f87171' }}>red = outside</b> (distance &gt; r)
            </p>
          </div>
        </>
      )}

      {mode === 'collinear' && (
        <div style={{
          borderRadius: 10, padding: '12px 14px',
          background: isCollinear ? 'rgba(52,211,153,0.06)' : 'rgba(248,113,113,0.06)',
          border: isCollinear ? '1px solid rgba(52,211,153,0.25)' : '1px solid rgba(248,113,113,0.3)',
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: isCollinear ? '#34d399' : '#f87171', margin: 0, marginBottom: 6 }}>
            Collinearity Verdict
          </p>
          <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.7, fontVariantNumeric: 'tabular-nums' }}>
            AB = {ab.toFixed(3)} &nbsp;·&nbsp; BC = {bc.toFixed(3)} &nbsp;·&nbsp; AC = {ac.toFixed(3)}
            <br />
            Largest side = {sortedSides[0].toFixed(3)}, sum of other two = {(sortedSides[1] + sortedSides[2]).toFixed(3)}, difference = {collinearityResidual.toFixed(3)}.
            <br />
            {isCollinear
              ? <b style={{ color: '#34d399' }}>The three points are collinear (one distance equals the sum of the other two).</b>
              : <b style={{ color: '#f87171' }}>The three points are not collinear (largest side ≠ sum of the other two — they form a real triangle).</b>}
          </p>
        </div>
      )}
    </div>
  );
}
