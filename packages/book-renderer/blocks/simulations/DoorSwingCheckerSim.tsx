'use client';

// DoorSwingCheckerSim.tsx
// Class 9 Mathematics — Chapter 1 — Page 7 (Reiaan's Whole House — Q2)
// A door pivots at a hinge point and swings through an arc. The student can:
//   - Drag the hinge between B₁(0, 1.5) and B₂(0, 4)
//   - Adjust door width
//   - Adjust swing angle (0° to 180°)
// The sim draws the swept arc and detects collision with the wardrobe rectangle.

import { useState, useCallback, useMemo, useRef } from 'react';

const X_MIN = 0;
const X_MAX = 12;
const Y_MIN = 0;
const Y_MAX = 10;
const UNIT = 36;
const PAD = 30;
const SVG_W = (X_MAX - X_MIN) * UNIT + PAD * 2;
const SVG_H = (Y_MAX - Y_MIN) * UNIT + PAD * 2;

function toSvg(x: number, y: number) {
  return {
    px: PAD + (x - X_MIN) * UNIT,
    py: PAD + (Y_MAX - y) * UNIT,
  };
}

// Wardrobe corners (matches Page 5 floor plan): W₁(3,1), W₂(7,1), W₃(7,3), W₄(3,3)
const WARDROBE = { x1: 3, y1: 1, x2: 7, y2: 3 };

// Bathroom door endpoints from NCERT
const HINGE_DEFAULT = { x: 0, y: 1.5 };

// Collision: does the segment from (hx, hy) to (hx + len*cos(θ), hy + len*sin(θ))
// intersect the wardrobe rectangle?
function segmentIntersectsRect(hx: number, hy: number, ex: number, ey: number, r: typeof WARDROBE) {
  // Quick reject
  if (Math.max(hx, ex) < r.x1 || Math.min(hx, ex) > r.x2) return false;
  if (Math.max(hy, ey) < r.y1 || Math.min(hy, ey) > r.y2) return false;
  // The endpoint inside rect counts
  if (ex >= r.x1 && ex <= r.x2 && ey >= r.y1 && ey <= r.y2) return true;
  // Segment-vs-rect-edge intersections
  const edges = [
    [r.x1, r.y1, r.x2, r.y1],
    [r.x2, r.y1, r.x2, r.y2],
    [r.x2, r.y2, r.x1, r.y2],
    [r.x1, r.y2, r.x1, r.y1],
  ];
  return edges.some(([ax, ay, bx, by]) => segmentsIntersect(hx, hy, ex, ey, ax, ay, bx, by));
}

function segmentsIntersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
  const d = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3);
  if (Math.abs(d) < 1e-9) return false;
  const t = ((x3 - x1) * (y4 - y3) - (y3 - y1) * (x4 - x3)) / d;
  const u = ((x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1)) / d;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

export default function DoorSwingCheckerSim() {
  const [hingeY, setHingeY] = useState(1.5);          // bathroom door hinge B₁ y-coord
  const [doorWidth, setDoorWidth] = useState(2.5);    // distance from hinge to free end (ft)
  const [swingDeg, setSwingDeg] = useState(60);       // 0..180

  const hinge = { x: 0, y: hingeY };
  const rad = (swingDeg * Math.PI) / 180;
  // Door rests along the y-axis (closed = pointing along +y from hinge).
  // As it opens (θ increases), the free end swings into the room (+x direction).
  const freeEnd = {
    x: hinge.x + doorWidth * Math.sin(rad),
    y: hinge.y + doorWidth * Math.cos(rad),
  };

  const collides = useMemo(() => segmentIntersectsRect(hinge.x, hinge.y, freeEnd.x, freeEnd.y, WARDROBE), [hinge, freeEnd]);

  // Find any collision angle for the current width/hinge
  const earliestCollision = useMemo(() => {
    for (let deg = 0; deg <= 180; deg += 1) {
      const r = (deg * Math.PI) / 180;
      const ex = hinge.x + doorWidth * Math.sin(r);
      const ey = hinge.y + doorWidth * Math.cos(r);
      if (segmentIntersectsRect(hinge.x, hinge.y, ex, ey, WARDROBE)) return deg;
    }
    return null;
  }, [hinge.x, hinge.y, doorWidth]);

  // Build SVG arc path for the swept region
  const arcPath = useMemo(() => {
    if (swingDeg <= 0) return '';
    const start = toSvg(hinge.x, hinge.y + doorWidth);    // 0 deg: along +y
    const end = toSvg(freeEnd.x, freeEnd.y);
    const center = toSvg(hinge.x, hinge.y);
    const r = doorWidth * UNIT;
    const large = swingDeg > 180 ? 1 : 0;
    const sweep = 0;       // visually anti-clockwise in screen-y-down means arc goes "out"
    return `M ${start.px} ${start.py} A ${r} ${r} 0 ${large} ${sweep} ${end.px} ${end.py} L ${center.px} ${center.py} Z`;
  }, [hinge, freeEnd, swingDeg, doorWidth]);

  return (
    <div style={{
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          Door <span style={{ color: '#f59e0b' }}>Swing Checker</span>
        </h1>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginTop: 4 }}>
          Will the door hit the wardrobe? · Class 9 Mathematics
        </p>
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12, lineHeight: 1.5 }}>
        The bathroom door is hinged on the left wall (the y-axis) and opens into the bedroom. Adjust the hinge height, door width, and swing angle below — the simulator highlights collision with the wardrobe in real time.
      </p>

      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)', background: '#1c1410',
        marginBottom: 14,
      }}>
        <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ display: 'block' }}>
          {/* Room */}
          <rect x={PAD} y={PAD} width={(X_MAX - X_MIN) * UNIT} height={(Y_MAX - Y_MIN) * UNIT}
            fill="#3a2918" stroke="#94a3b8" strokeWidth={2} />

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

          {/* Wardrobe */}
          {(() => {
            const a = toSvg(WARDROBE.x1, WARDROBE.y2);
            const b = toSvg(WARDROBE.x2, WARDROBE.y1);
            return (
              <g>
                <rect x={a.px} y={a.py} width={b.px - a.px} height={b.py - a.py}
                  fill={collides ? 'rgba(248,113,113,0.45)' : 'rgba(180,140,90,0.4)'}
                  stroke={collides ? '#f87171' : 'rgba(180,140,90,0.7)'} strokeWidth={2} />
                <text x={(a.px + b.px) / 2} y={(a.py + b.py) / 2 + 4}
                  fill="#fbbf24" fontSize={11} fontWeight={700} textAnchor="middle">Wardrobe</text>
              </g>
            );
          })()}

          {/* Swept arc */}
          {arcPath && (
            <path d={arcPath} fill={collides ? 'rgba(248,113,113,0.18)' : 'rgba(245,158,11,0.18)'}
              stroke={collides ? 'rgba(248,113,113,0.5)' : 'rgba(245,158,11,0.5)'} strokeWidth={1.5} />
          )}

          {/* Door (current angle) */}
          {(() => {
            const h = toSvg(hinge.x, hinge.y);
            const e = toSvg(freeEnd.x, freeEnd.y);
            return (
              <g>
                <line x1={h.px} y1={h.py} x2={e.px} y2={e.py}
                  stroke={collides ? '#f87171' : '#fbbf24'} strokeWidth={5} strokeLinecap="round" />
                {/* Hinge */}
                <circle cx={h.px} cy={h.py} r={5} fill="#dc2626" stroke="#0B0F15" strokeWidth={2} />
                <text x={h.px - 8} y={h.py + 4} fill="#fbbf24" fontSize={10} fontWeight={700} textAnchor="end">
                  B₁({hinge.x}, {hingeY.toFixed(1)})
                </text>
                {/* Free end */}
                <circle cx={e.px} cy={e.py} r={4} fill="#fbbf24" stroke="#0B0F15" strokeWidth={2} />
              </g>
            );
          })()}

          {/* Tick numbers */}
          {Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => {
            const x = X_MIN + i;
            if (x === 0) return null;
            const { px } = toSvg(x, 0);
            return <text key={`tx${x}`} x={px} y={SVG_H - 14}
              fill="#94a3b8" fontSize={9} fontWeight={600} textAnchor="middle">{x}</text>;
          })}
          {Array.from({ length: Y_MAX - Y_MIN + 1 }, (_, i) => {
            const y = Y_MIN + i;
            if (y === 0) return null;
            const { py } = toSvg(0, y);
            return <text key={`ty${y}`} x={18} y={py + 3}
              fill="#94a3b8" fontSize={9} fontWeight={600} textAnchor="middle">{y}</text>;
          })}
        </svg>
      </div>

      {/* Sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '10px 14px', alignItems: 'center', marginBottom: 14 }}>
        <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>Hinge y:</label>
        <input type="range" min={1} max={9} step={0.5} value={hingeY}
          onChange={e => setHingeY(parseFloat(e.target.value))} style={{ accentColor: '#f59e0b' }} />
        <span style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{hingeY.toFixed(1)} ft</span>

        <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>Door width:</label>
        <input type="range" min={1} max={5} step={0.1} value={doorWidth}
          onChange={e => setDoorWidth(parseFloat(e.target.value))} style={{ accentColor: '#f59e0b' }} />
        <span style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{doorWidth.toFixed(1)} ft</span>

        <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>Swing angle:</label>
        <input type="range" min={0} max={180} step={1} value={swingDeg}
          onChange={e => setSwingDeg(parseFloat(e.target.value))} style={{ accentColor: '#f59e0b' }} />
        <span style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{swingDeg}°</span>
      </div>

      {/* Verdict */}
      <div style={{
        borderRadius: 10, padding: '12px 14px',
        background: collides ? 'rgba(248,113,113,0.06)' : 'rgba(52,211,153,0.06)',
        border: collides ? '1px solid rgba(248,113,113,0.3)' : '1px solid rgba(52,211,153,0.25)',
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: collides ? '#f87171' : '#34d399', margin: 0, marginBottom: 6 }}>
          Collision Status
        </p>
        <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>
          {collides ? (
            <>The door <b style={{ color: '#f87171' }}>strikes the wardrobe</b> at this angle. {earliestCollision !== null ? <>It first collides at <b>{earliestCollision}°</b>.</> : null}</>
          ) : (
            <>At this angle, the door <b style={{ color: '#34d399' }}>clears the wardrobe</b>. {earliestCollision !== null ? <>(With this width, the door first collides at <b>{earliestCollision}°</b>.)</> : <>(The door never reaches the wardrobe at this width.)</>}</>
          )}
        </p>
      </div>
    </div>
  );
}
