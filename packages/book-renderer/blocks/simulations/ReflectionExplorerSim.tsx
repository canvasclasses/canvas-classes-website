'use client';

// ReflectionExplorerSim.tsx
// Class 9 Mathematics — Chapter 1 — Page 11 (Reflections in the Axes)
// Drag the three vertices of triangle ABC. Toggle reflections across the
// x-axis, y-axis, and the origin to see the image triangles appear with
// updated coordinates. Side lengths are computed live for both the original
// and the active reflection — the student verifies that lengths are preserved.

import { useState, useCallback, useMemo, useRef } from 'react';

const X_MIN = -8;
const X_MAX = 8;
const Y_MIN = -6;
const Y_MAX = 6;
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

function fromSvg(px: number, py: number) {
  const x = Math.round((px - PAD) / UNIT) + X_MIN;
  const y = Y_MAX - Math.round((py - PAD) / UNIT);
  return { x, y };
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function fmt(n: number) { return n < 0 ? '−' + Math.abs(n) : String(n); }

function dist(p: { x: number; y: number }, q: { x: number; y: number }) {
  return Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2);
}

type Axis = 'none' | 'x' | 'y' | 'origin';

interface Pt { x: number; y: number; label: string }

const INITIAL: Pt[] = [
  { x: 3, y: 4, label: 'A' },
  { x: 9, y: 6, label: 'M' },
  { x: 7, y: 1, label: 'D' },
];

function reflect(p: Pt, axis: Axis): Pt {
  if (axis === 'x')      return { ...p, y: -p.y };
  if (axis === 'y')      return { ...p, x: -p.x };
  if (axis === 'origin') return { ...p, x: -p.x, y: -p.y };
  return p;
}

export default function ReflectionExplorerSim() {
  const [pts, setPts] = useState<Pt[]>(INITIAL);
  const [axis, setAxis] = useState<Axis>('y');
  const [dragging, setDragging] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const reflected = useMemo<Pt[]>(() => pts.map((p, i) => {
    const r = reflect(p, axis);
    return { ...r, label: r.label + "'" };
  }), [pts, axis]);

  const onPtrDown = useCallback((i: number) => (e: React.PointerEvent) => {
    e.stopPropagation();
    setDragging(i);
  }, []);

  const onMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (dragging === null) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const py = ((e.clientY - rect.top) / rect.height) * SVG_H;
    const { x, y } = fromSvg(px, py);
    const cx = clamp(x, X_MIN, X_MAX);
    const cy = clamp(y, Y_MIN, Y_MAX);
    setPts(curr => curr.map((pt, idx) => idx === dragging ? { ...pt, x: cx, y: cy } : pt));
  }, [dragging]);

  const onUp = useCallback(() => setDragging(null), []);

  // Side lengths for original and reflected
  const origSides = [dist(pts[0], pts[1]), dist(pts[1], pts[2]), dist(pts[2], pts[0])];
  const reflSides = [dist(reflected[0], reflected[1]), dist(reflected[1], reflected[2]), dist(reflected[2], reflected[0])];

  return (
    <div style={{
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          Reflection <span style={{ color: '#f59e0b' }}>Explorer</span>
        </h1>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginTop: 4 }}>
          Mirror images and preserved lengths · Class 9 Mathematics
        </p>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {([
          ['none', 'No Reflection'],
          ['y', 'Reflect in y-axis'],
          ['x', 'Reflect in x-axis'],
          ['origin', 'Reflect in Origin'],
        ] as [Axis, string][]).map(([a, label]) => {
          const active = axis === a;
          return (
            <button key={a} onClick={() => setAxis(a)}
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
        Drag any vertex of the orange triangle. Toggle the reflection axis above to see the green image triangle appear. Side lengths of <i>both</i> triangles are computed live below — confirm for yourself that reflections preserve distance.
      </p>

      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)', background: '#0B0F15',
        marginBottom: 14,
      }}>
        <svg
          ref={svgRef} width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block', cursor: dragging !== null ? 'grabbing' : 'default', touchAction: 'none' }}
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

          {/* Axes (highlighted in colour matching the active reflection axis) */}
          {(() => {
            const o = toSvg(0, 0);
            const xCol = axis === 'x' ? '#34d399' : '#fbbf24';
            const yCol = axis === 'y' ? '#34d399' : '#fbbf24';
            const xW = axis === 'x' ? 3 : 1.5;
            const yW = axis === 'y' ? 3 : 1.5;
            return (
              <g>
                <line x1={PAD} y1={o.py} x2={SVG_W - PAD} y2={o.py} stroke={xCol} strokeWidth={xW} />
                <line x1={o.px} y1={PAD} x2={o.px} y2={SVG_H - PAD} stroke={yCol} strokeWidth={yW} />
                <path d={`M${SVG_W - PAD},${o.py} l-7,-4 l0,8 z`} fill={xCol} />
                <path d={`M${o.px},${PAD} l-4,7 l8,0 z`} fill={yCol} />
                {axis === 'origin' && (
                  <circle cx={o.px} cy={o.py} r={9} fill="none" stroke="#34d399" strokeWidth={2} strokeDasharray="3 2" />
                )}
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

          {/* Reflected triangle (drawn first so it sits behind the original) */}
          {axis !== 'none' && (
            <g>
              <polygon
                points={reflected.map(p => { const s = toSvg(p.x, p.y); return `${s.px},${s.py}`; }).join(' ')}
                fill="rgba(52,211,153,0.18)" stroke="#34d399" strokeWidth={2}
              />
              {reflected.map((p, i) => {
                const s = toSvg(p.x, p.y);
                return (
                  <g key={`rfl${i}`}>
                    <circle cx={s.px} cy={s.py} r={4} fill="#34d399" stroke="#0B0F15" strokeWidth={1.5} />
                    <text x={s.px + 6} y={s.py - 6} fill="#34d399" fontSize={10} fontWeight={700}>
                      {p.label}({fmt(p.x)}, {fmt(p.y)})
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Original triangle */}
          <polygon
            points={pts.map(p => { const s = toSvg(p.x, p.y); return `${s.px},${s.py}`; }).join(' ')}
            fill="rgba(245,158,11,0.18)" stroke="#fbbf24" strokeWidth={2}
          />
          {pts.map((p, i) => {
            const s = toSvg(p.x, p.y);
            return (
              <g key={`orig${i}`}>
                <circle cx={s.px} cy={s.py} r={14} fill="transparent"
                  onPointerDown={onPtrDown(i)}
                  style={{ cursor: dragging === i ? 'grabbing' : 'grab' }} />
                <circle cx={s.px} cy={s.py} r={6} fill="#fbbf24" stroke="#0B0F15" strokeWidth={2} pointerEvents="none" />
                <text x={s.px + 8} y={s.py - 8} fill="#fbbf24" fontSize={11} fontWeight={700} pointerEvents="none">
                  {p.label}({fmt(p.x)}, {fmt(p.y)})
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Side lengths */}
      <div style={{
        borderRadius: 10, padding: '12px 14px',
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fbbf24', margin: 0, marginBottom: 6 }}>
          Side Lengths — Original vs Reflected
        </p>
        <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.7 }}>
          <b style={{ color: '#fbbf24' }}>{pts[0].label}{pts[1].label}</b> = {origSides[0].toFixed(3)}
          {axis !== 'none' && <> &nbsp;|&nbsp; <b style={{ color: '#34d399' }}>{reflected[0].label}{reflected[1].label}</b> = {reflSides[0].toFixed(3)}</>}
          <br />
          <b style={{ color: '#fbbf24' }}>{pts[1].label}{pts[2].label}</b> = {origSides[1].toFixed(3)}
          {axis !== 'none' && <> &nbsp;|&nbsp; <b style={{ color: '#34d399' }}>{reflected[1].label}{reflected[2].label}</b> = {reflSides[1].toFixed(3)}</>}
          <br />
          <b style={{ color: '#fbbf24' }}>{pts[2].label}{pts[0].label}</b> = {origSides[2].toFixed(3)}
          {axis !== 'none' && <> &nbsp;|&nbsp; <b style={{ color: '#34d399' }}>{reflected[2].label}{reflected[0].label}</b> = {reflSides[2].toFixed(3)}</>}
        </p>
        {axis !== 'none' && (
          <p style={{ fontSize: 12, color: '#34d399', margin: 0, marginTop: 6, fontWeight: 700 }}>
            ✓ All three corresponding sides are exactly equal — reflection preserves length.
          </p>
        )}
      </div>
    </div>
  );
}
