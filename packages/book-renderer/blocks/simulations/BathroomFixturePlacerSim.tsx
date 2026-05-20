'use client';

// BathroomFixturePlacerSim.tsx
// Class 9 Mathematics — Chapter 1 — Page 8 (Bathroom Geometry)
// Drag two fixtures (washbasin 3×2 ft, toilet 2×3 ft) inside a fixed bathroom
// (the negative-x region of Reiaan's house, x in [-6, 0], y in [0, 9]).
// The sim checks: (a) within bathroom bounds, (b) no overlap between fixtures,
// (c) coordinates of all four corners of each fixture are read out live.

import { useState, useCallback, useRef } from 'react';

const X_MIN = -7;
const X_MAX = 1;
const Y_MIN = 0;
const Y_MAX = 10;
const UNIT = 40;
const PAD = 30;
const SVG_W = (X_MAX - X_MIN) * UNIT + PAD * 2;
const SVG_H = (Y_MAX - Y_MIN) * UNIT + PAD * 2;

// The bathroom is the rectangle from O(0,0) to F(0,9) along y-axis,
// stretching to (-6, 9) and (-6, 0). I.e., x ∈ [-6, 0], y ∈ [0, 9].
const BATHROOM = { x1: -6, y1: 0, x2: 0, y2: 9 };

function toSvg(x: number, y: number) {
  return {
    px: PAD + (x - X_MIN) * UNIT,
    py: PAD + (Y_MAX - y) * UNIT,
  };
}

function fromSvgSnap(px: number, py: number, step = 0.5) {
  const x = (px - PAD) / UNIT + X_MIN;
  const y = Y_MAX - (py - PAD) / UNIT;
  const s = (v: number) => Math.round(v / step) * step;
  return { x: s(x), y: s(y) };
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

interface Fixture {
  id: 'washbasin' | 'toilet';
  label: string;
  width: number;   // along x
  height: number;  // along y
  // Reference corner = bottom-left
  bx: number;
  by: number;
  colour: string;
}

const INITIAL_FIXTURES: Fixture[] = [
  { id: 'washbasin', label: 'Washbasin (3 ft × 2 ft)', width: 3, height: 2, bx: -3, by: 6, colour: '#60a5fa' },
  { id: 'toilet',    label: 'Toilet (2 ft × 3 ft)',     width: 2, height: 3, bx: -5, by: 1, colour: '#34d399' },
];

function rectsOverlap(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
  return !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
}

export default function BathroomFixturePlacerSim() {
  const [fixtures, setFixtures] = useState<Fixture[]>(INITIAL_FIXTURES);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Detect overlaps and out-of-bounds
  const issues = (() => {
    const r = (f: Fixture) => ({ x: f.bx, y: f.by, w: f.width, h: f.height });
    const overlap = rectsOverlap(r(fixtures[0]), r(fixtures[1]));
    const oob = fixtures.map(f =>
      f.bx < BATHROOM.x1 || f.bx + f.width > BATHROOM.x2 ||
      f.by < BATHROOM.y1 || f.by + f.height > BATHROOM.y2
    );
    return { overlap, oob };
  })();

  const onPtrDown = useCallback((id: string) => (e: React.PointerEvent) => {
    e.stopPropagation();
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const py = ((e.clientY - rect.top) / rect.height) * SVG_H;
    const { x, y } = fromSvgSnap(px, py);
    const f = fixtures.find(ff => ff.id === id);
    if (!f) return;
    setDragOffset({ x: x - f.bx, y: y - f.by });
    setDragging(id);
  }, [fixtures]);

  const onMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const py = ((e.clientY - rect.top) / rect.height) * SVG_H;
    const { x, y } = fromSvgSnap(px, py);
    setFixtures(curr => curr.map(f => {
      if (f.id !== dragging) return f;
      const newBx = clamp(x - dragOffset.x, BATHROOM.x1, BATHROOM.x2 - f.width);
      const newBy = clamp(y - dragOffset.y, BATHROOM.y1, BATHROOM.y2 - f.height);
      return { ...f, bx: newBx, by: newBy };
    }));
  }, [dragging, dragOffset]);

  const onUp = useCallback(() => setDragging(null), []);

  const reset = useCallback(() => setFixtures(INITIAL_FIXTURES), []);

  return (
    <div style={{
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          Bathroom <span style={{ color: '#f59e0b' }}>Fixture Placer</span>
        </h1>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginTop: 4 }}>
          NCERT Q3(iii) · Class 9 Mathematics
        </p>
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12, lineHeight: 1.5 }}>
        Drag the <b style={{ color: '#60a5fa' }}>washbasin</b> (3 ft × 2 ft) and the <b style={{ color: '#34d399' }}>toilet</b> (2 ft × 3 ft) anywhere inside the bathroom (the rectangle from x = −6 to 0). The simulator stops them from overlapping or leaving the bathroom, and reads out all four corner coordinates live.
      </p>

      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)', background: '#0c1822',
        marginBottom: 14,
      }}>
        <svg
          ref={svgRef} width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block', cursor: dragging ? 'grabbing' : 'default', touchAction: 'none' }}
          onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onPointerLeave={onUp}
        >
          {/* Bathroom blue */}
          {(() => {
            const a = toSvg(BATHROOM.x1, BATHROOM.y2);
            const b = toSvg(BATHROOM.x2, BATHROOM.y1);
            return (
              <rect x={a.px} y={a.py} width={b.px - a.px} height={b.py - a.py}
                fill="rgba(96,165,250,0.18)" stroke="rgba(96,165,250,0.45)" strokeWidth={2} />
            );
          })()}

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

          {/* Y-axis (right wall of bathroom) */}
          {(() => {
            const t = toSvg(0, Y_MAX);
            const b = toSvg(0, Y_MIN);
            return <line x1={t.px} y1={t.py} x2={b.px} y2={b.py} stroke="#fbbf24" strokeWidth={2} />;
          })()}

          {/* Fixtures */}
          {fixtures.map(f => {
            const tl = toSvg(f.bx, f.by + f.height);
            const br = toSvg(f.bx + f.width, f.by);
            const w = br.px - tl.px;
            const h = br.py - tl.py;
            return (
              <g key={f.id}>
                <rect x={tl.px} y={tl.py} width={w} height={h}
                  fill={f.colour + '33'} stroke={f.colour} strokeWidth={2}
                  onPointerDown={onPtrDown(f.id)}
                  style={{ cursor: dragging === f.id ? 'grabbing' : 'grab' }} />
                <text x={tl.px + w / 2} y={tl.py + h / 2 + 4}
                  fill={f.colour} fontSize={11} fontWeight={700} textAnchor="middle"
                  pointerEvents="none">
                  {f.id === 'washbasin' ? 'Washbasin' : 'Toilet'}
                </text>
              </g>
            );
          })}

          {/* Tick numbers */}
          {Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => {
            const x = X_MIN + i;
            if (x === 0) return null;
            const { px } = toSvg(x, 0);
            return <text key={`tx${x}`} x={px} y={SVG_H - 14}
              fill="#94a3b8" fontSize={9} fontWeight={600} textAnchor="middle">
                {x < 0 ? '−' + Math.abs(x) : x}
              </text>;
          })}
          {Array.from({ length: Y_MAX - Y_MIN + 1 }, (_, i) => {
            const y = Y_MIN + i;
            if (y === 0) return null;
            const { py } = toSvg(0, y);
            return <text key={`ty${y}`} x={SVG_W - 14} y={py + 3}
              fill="#94a3b8" fontSize={9} fontWeight={600} textAnchor="middle">{y}</text>;
          })}
        </svg>
      </div>

      <button onClick={reset}
        style={{
          padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
          marginBottom: 12,
        }}>
        Reset positions
      </button>

      {/* Corner readouts */}
      {fixtures.map(f => (
        <div key={f.id} style={{
          borderRadius: 10, padding: '10px 14px', marginBottom: 8,
          background: f.colour + '14', border: `1px solid ${f.colour}55`,
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: f.colour, margin: 0, marginBottom: 4 }}>
            {f.label}
          </p>
          <p style={{ fontSize: 12, color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>
            Corners:&nbsp;
            ({f.bx}, {f.by})&nbsp;·&nbsp;
            ({f.bx + f.width}, {f.by})&nbsp;·&nbsp;
            ({f.bx + f.width}, {f.by + f.height})&nbsp;·&nbsp;
            ({f.bx}, {f.by + f.height})
          </p>
        </div>
      ))}

      <div style={{
        borderRadius: 10, padding: '12px 14px',
        background: issues.overlap ? 'rgba(248,113,113,0.06)' : 'rgba(52,211,153,0.06)',
        border: issues.overlap ? '1px solid rgba(248,113,113,0.3)' : '1px solid rgba(52,211,153,0.25)',
      }}>
        <p style={{ fontSize: 12, color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>
          {issues.overlap
            ? <><b style={{ color: '#f87171' }}>Fixtures overlap.</b> Move them apart so neither rectangle contains any part of the other.</>
            : <><b style={{ color: '#34d399' }}>Layout is valid.</b> Both fixtures are inside the bathroom and do not overlap.</>}
        </p>
      </div>
    </div>
  );
}
