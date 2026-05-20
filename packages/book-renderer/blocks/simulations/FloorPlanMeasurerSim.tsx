'use client';

// FloorPlanMeasurerSim.tsx
// Class 9 Mathematics — Chapter 1 — Page 5 (Mapping Reiaan's Room)
// Reiaan's room rendered on a coordinate grid. Two modes:
//   - Measure: click two points on the floor plan; see the segment length
//     computed live ("|x₂ − x₁| = ..." or "|y₂ − y₁| = ..." or Pythagoras hint).
//   - Door:    drag the two endpoints of a door; live width readout with a
//     wheelchair-accessibility threshold (90 cm) check.

import { useState, useCallback, useRef } from 'react';

const X_MIN = 0;
const X_MAX = 12;
const Y_MIN = 0;
const Y_MAX = 10;
const UNIT = 36;
const PAD = 30;
const SVG_W = (X_MAX - X_MIN) * UNIT + PAD * 2;
const SVG_H = (Y_MAX - Y_MIN) * UNIT + PAD * 2;

const FT_TO_CM = 30.48;
const ACCESS_MIN_CM = 90;

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

function fmt(n: number) {
  return Math.abs(n) === Math.round(Math.abs(n)) ? n.toFixed(0) : n.toFixed(1);
}

type Mode = 'measure' | 'door';

export default function FloorPlanMeasurerSim() {
  const [mode, setMode] = useState<Mode>('measure');

  // Measure-mode state: click pickup of (P, Q)
  const [pointP, setPointP] = useState<{ x: number; y: number } | null>(null);
  const [pointQ, setPointQ] = useState<{ x: number; y: number } | null>(null);

  // Door-mode state: two draggable endpoints
  const [door, setDoor] = useState<{ a: { x: number; y: number }, b: { x: number; y: number } }>({
    a: { x: 7.5, y: 0 },
    b: { x: 11.5, y: 0 },
  });
  const [draggingEnd, setDraggingEnd] = useState<'a' | 'b' | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    setPointP(null); setPointQ(null);
    setDraggingEnd(null);
  }, []);

  // ── Measure mode click handler ─────────────────────────────────────────────
  const onMeasureClick = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (mode !== 'measure') return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const py = ((e.clientY - rect.top) / rect.height) * SVG_H;
    const { x, y } = fromSvgSnap(px, py);
    const cx = clamp(x, X_MIN, X_MAX);
    const cy = clamp(y, Y_MIN, Y_MAX);
    if (!pointP) {
      setPointP({ x: cx, y: cy });
    } else if (!pointQ) {
      setPointQ({ x: cx, y: cy });
    } else {
      // restart
      setPointP({ x: cx, y: cy });
      setPointQ(null);
    }
  }, [mode, pointP, pointQ]);

  // ── Door mode drag handlers ────────────────────────────────────────────────
  const onDoorDown = useCallback((end: 'a' | 'b') => (e: React.PointerEvent) => {
    e.stopPropagation();
    setDraggingEnd(end);
  }, []);

  const onSvgMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingEnd) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const py = ((e.clientY - rect.top) / rect.height) * SVG_H;
    const { x, y } = fromSvgSnap(px, py);
    const cx = clamp(x, X_MIN, X_MAX);
    const cy = clamp(y, Y_MIN, Y_MAX);
    setDoor(curr => ({ ...curr, [draggingEnd]: { x: cx, y: cy } }));
  }, [draggingEnd]);

  const onSvgUp = useCallback(() => setDraggingEnd(null), []);

  // ── Distance computation (Page-1 chapter only knows axis-aligned subtraction;
  //     for diagonal segments we show a "use Pythagoras in Class 10" hint) ──────
  const distOf = (P: { x: number; y: number }, Q: { x: number; y: number }) => {
    const dx = Q.x - P.x;
    const dy = Q.y - P.y;
    if (dy === 0) return { kind: 'horizontal' as const, len: Math.abs(dx), formula: `|x₂ − x₁| = |${fmt(Q.x)} − ${fmt(P.x)}| = ${fmt(Math.abs(dx))}` };
    if (dx === 0) return { kind: 'vertical' as const, len: Math.abs(dy), formula: `|y₂ − y₁| = |${fmt(Q.y)} − ${fmt(P.y)}| = ${fmt(Math.abs(dy))}` };
    const len = Math.sqrt(dx * dx + dy * dy);
    return {
      kind: 'diagonal' as const,
      len,
      formula: `√((${fmt(dx)})² + (${fmt(dy)})²) = ${len.toFixed(2)} (Pythagoras — Class 10)`,
    };
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          Reiaan&rsquo;s Room <span style={{ color: '#f59e0b' }}>Measurer</span>
        </h1>
        <p style={{
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
          color: '#475569', marginTop: 4, marginBottom: 0,
        }}>
          Distances and Door Widths · Class 9 Mathematics
        </p>
      </div>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {([
          ['measure', 'Measure Distance'],
          ['door', 'Door & Accessibility'],
        ] as [Mode, string][]).map(([m, label]) => {
          const active = mode === m;
          return (
            <button
              key={m} onClick={() => switchMode(m)}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: active ? '1px solid rgba(245,158,11,0.6)' : '1px solid rgba(255,255,255,0.08)',
                background: active ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                color: active ? '#fbbf24' : '#94a3b8',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12, lineHeight: 1.5 }}>
        {mode === 'measure' && 'Click any two points on the room. The simulator works out the distance using the coordinates alone — no measuring tape needed.'}
        {mode === 'door' && 'Drag either red endpoint of the door. The width updates live, in feet and centimetres, with a built-in wheelchair-accessibility check (≥ 90 cm).'}
      </p>

      {/* SVG */}
      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)', background: '#1c1410',
        marginBottom: 14,
      }}>
        <svg
          ref={svgRef} width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block', cursor: mode === 'measure' ? 'crosshair' : (draggingEnd ? 'grabbing' : 'default'), touchAction: 'none' }}
          onPointerDown={onMeasureClick}
          onPointerMove={onSvgMove}
          onPointerUp={onSvgUp}
          onPointerCancel={onSvgUp}
          onPointerLeave={onSvgUp}
        >
          {/* Room background */}
          <rect x={PAD} y={PAD} width={(X_MAX - X_MIN) * UNIT} height={(Y_MAX - Y_MIN) * UNIT}
            fill="#3a2918" stroke="#94a3b8" strokeWidth={2} />

          {/* Grid */}
          {Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => {
            const x = X_MIN + i;
            const { px } = toSvg(x, 0);
            return (
              <line key={`vg${x}`} x1={px} y1={PAD} x2={px} y2={SVG_H - PAD}
                stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
            );
          })}
          {Array.from({ length: Y_MAX - Y_MIN + 1 }, (_, i) => {
            const y = Y_MIN + i;
            const { py } = toSvg(0, y);
            return (
              <line key={`hg${y}`} x1={PAD} y1={py} x2={SVG_W - PAD} y2={py}
                stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
            );
          })}

          {/* Bed */}
          {(() => {
            const a = toSvg(1, 5);
            const b = toSvg(7, 9);
            return (
              <g>
                <rect x={a.px} y={b.py} width={b.px - a.px} height={a.py - b.py}
                  fill="rgba(135,206,235,0.18)" stroke="rgba(135,206,235,0.4)" strokeWidth={1.5} />
                <text x={(a.px + b.px) / 2} y={(a.py + b.py) / 2 + 4}
                  fill="#94a3b8" fontSize={11} fontWeight={700} textAnchor="middle">Bed</text>
              </g>
            );
          })()}

          {/* Wardrobe */}
          {(() => {
            const a = toSvg(3, 1);
            const b = toSvg(7, 3);
            return (
              <g>
                <rect x={a.px} y={b.py} width={b.px - a.px} height={a.py - b.py}
                  fill="rgba(180,140,90,0.25)" stroke="rgba(180,140,90,0.55)" strokeWidth={1.5} />
                <text x={(a.px + b.px) / 2} y={(a.py + b.py) / 2 + 4}
                  fill="#94a3b8" fontSize={10} fontWeight={700} textAnchor="middle">Wardrobe</text>
              </g>
            );
          })()}

          {/* Axis tick numbers */}
          {Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => {
            const x = X_MIN + i;
            if (x === 0) return null;
            const { px } = toSvg(x, 0);
            return (
              <text key={`tx${x}`} x={px} y={SVG_H - 14}
                fill="#94a3b8" fontSize={9} fontWeight={600} textAnchor="middle">{x}</text>
            );
          })}
          {Array.from({ length: Y_MAX - Y_MIN + 1 }, (_, i) => {
            const y = Y_MIN + i;
            if (y === 0) return null;
            const { py } = toSvg(0, y);
            return (
              <text key={`ty${y}`} x={18} y={py + 3}
                fill="#94a3b8" fontSize={9} fontWeight={600} textAnchor="middle">{y}</text>
            );
          })}
          <text x={18} y={SVG_H - 14} fill="#fbbf24" fontSize={9} fontWeight={700} textAnchor="middle">O</text>

          {/* Mode-specific overlays */}
          {mode === 'measure' && (
            <>
              {pointP && pointQ && (() => {
                const a = toSvg(pointP.x, pointP.y);
                const b = toSvg(pointQ.x, pointQ.y);
                const d = distOf(pointP, pointQ);
                const colour = d.kind === 'diagonal' ? '#a78bfa' : '#34d399';
                return (
                  <g>
                    <line x1={a.px} y1={a.py} x2={b.px} y2={b.py}
                      stroke={colour} strokeWidth={2.5} />
                    <text x={(a.px + b.px) / 2} y={(a.py + b.py) / 2 - 8}
                      fill={colour} fontSize={11} fontWeight={700} textAnchor="middle">
                      {fmt(d.len)} ft
                    </text>
                  </g>
                );
              })()}
              {pointP && (() => {
                const a = toSvg(pointP.x, pointP.y);
                return (
                  <g>
                    <circle cx={a.px} cy={a.py} r={6} fill="#fbbf24" stroke="#0B0F15" strokeWidth={2} />
                    <text x={a.px + 8} y={a.py - 8} fill="#fbbf24" fontSize={10} fontWeight={700}>
                      P({fmt(pointP.x)}, {fmt(pointP.y)})
                    </text>
                  </g>
                );
              })()}
              {pointQ && (() => {
                const b = toSvg(pointQ.x, pointQ.y);
                return (
                  <g>
                    <circle cx={b.px} cy={b.py} r={6} fill="#fbbf24" stroke="#0B0F15" strokeWidth={2} />
                    <text x={b.px + 8} y={b.py - 8} fill="#fbbf24" fontSize={10} fontWeight={700}>
                      Q({fmt(pointQ.x)}, {fmt(pointQ.y)})
                    </text>
                  </g>
                );
              })()}
            </>
          )}

          {mode === 'door' && (() => {
            const a = toSvg(door.a.x, door.a.y);
            const b = toSvg(door.b.x, door.b.y);
            const dx = door.b.x - door.a.x;
            const dy = door.b.y - door.a.y;
            const widthFt = Math.sqrt(dx * dx + dy * dy);
            const widthCm = widthFt * FT_TO_CM;
            const accessible = widthCm >= ACCESS_MIN_CM;
            const colour = accessible ? '#34d399' : '#f87171';
            return (
              <g>
                <line x1={a.px} y1={a.py} x2={b.px} y2={b.py}
                  stroke={colour} strokeWidth={5} strokeLinecap="round" />
                {/* Endpoints */}
                <circle cx={a.px} cy={a.py} r={14} fill="transparent"
                  onPointerDown={onDoorDown('a')}
                  style={{ cursor: 'grab' }} />
                <circle cx={a.px} cy={a.py} r={6}
                  fill="#dc2626" stroke="#0B0F15" strokeWidth={2} pointerEvents="none" />
                <text x={a.px + 8} y={a.py + 16} fill="#fbbf24" fontSize={10} fontWeight={700} pointerEvents="none">
                  ({fmt(door.a.x)}, {fmt(door.a.y)})
                </text>
                <circle cx={b.px} cy={b.py} r={14} fill="transparent"
                  onPointerDown={onDoorDown('b')}
                  style={{ cursor: 'grab' }} />
                <circle cx={b.px} cy={b.py} r={6}
                  fill="#dc2626" stroke="#0B0F15" strokeWidth={2} pointerEvents="none" />
                <text x={b.px + 8} y={b.py + 16} fill="#fbbf24" fontSize={10} fontWeight={700} pointerEvents="none">
                  ({fmt(door.b.x)}, {fmt(door.b.y)})
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Mode-specific readout */}
      {mode === 'measure' && (
        <div style={{
          borderRadius: 10, padding: '12px 14px',
          background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fbbf24', margin: 0, marginBottom: 6 }}>
            Distance Computation
          </p>
          {pointP && pointQ ? (() => {
            const d = distOf(pointP, pointQ);
            return (
              <>
                <p style={{ fontSize: 14, color: '#e2e8f0', margin: 0, marginBottom: 4, lineHeight: 1.5 }}>
                  P = ({fmt(pointP.x)}, {fmt(pointP.y)}) &nbsp;·&nbsp; Q = ({fmt(pointQ.x)}, {fmt(pointQ.y)})
                </p>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                  Segment is <b>{d.kind}</b>. Length = <b style={{ color: '#fbbf24' }}>{d.formula}</b> ft
                </p>
                {d.kind === 'diagonal' && (
                  <p style={{ fontSize: 12, color: '#a78bfa', margin: 0, marginTop: 6, lineHeight: 1.5 }}>
                    Note: in Class 9 Chapter 1, distances along axes can be found by simple subtraction. Diagonal distances need the <b>distance formula</b>, which builds on Pythagoras — you&rsquo;ll meet it formally later.
                  </p>
                )}
              </>
            );
          })() : (
            <p style={{ fontSize: 13, color: '#475569', margin: 0, fontStyle: 'italic' }}>
              {pointP ? 'Now click a second point to measure.' : 'Click any point on the room to start.'}
            </p>
          )}
        </div>
      )}

      {mode === 'door' && (() => {
        const dx = door.b.x - door.a.x;
        const dy = door.b.y - door.a.y;
        const widthFt = Math.sqrt(dx * dx + dy * dy);
        const widthCm = widthFt * FT_TO_CM;
        const accessible = widthCm >= ACCESS_MIN_CM;
        return (
          <div style={{
            borderRadius: 10, padding: '12px 14px',
            background: accessible ? 'rgba(52,211,153,0.06)' : 'rgba(248,113,113,0.06)',
            border: accessible ? '1px solid rgba(52,211,153,0.25)' : '1px solid rgba(248,113,113,0.3)',
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accessible ? '#34d399' : '#f87171', margin: 0, marginBottom: 6 }}>
              Door Width &amp; Accessibility
            </p>
            <p style={{ fontSize: 14, color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>
              Width = <b style={{ color: accessible ? '#34d399' : '#f87171' }}>{widthFt.toFixed(2)} ft</b> &nbsp;≈&nbsp; <b style={{ color: accessible ? '#34d399' : '#f87171' }}>{widthCm.toFixed(0)} cm</b>
            </p>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, marginTop: 6, lineHeight: 1.5 }}>
              India&rsquo;s Harmonised Guidelines for Universal Accessibility require doors used by wheelchair users to be at least <b>90 cm</b> wide.{' '}
              {accessible ? (
                <span style={{ color: '#34d399' }}>This door <b>passes</b> — accessible.</span>
              ) : (
                <span style={{ color: '#f87171' }}>This door <b>fails</b> the standard by {(ACCESS_MIN_CM - widthCm).toFixed(0)} cm — would block wheelchair access.</span>
              )}
            </p>
          </div>
        );
      })()}
    </div>
  );
}
