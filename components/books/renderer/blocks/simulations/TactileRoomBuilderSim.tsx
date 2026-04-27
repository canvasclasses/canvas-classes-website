'use client';

// TactileRoomBuilderSim.tsx
// Class 9 Mathematics — Chapter 1 — Page 3 (Reiaan's Room)
// Drag four pins onto a coordinate grid to mark the corners of a piece of
// furniture. Threads auto-connect adjacent corners. The four corners' coordinates
// are read out below, and the furniture's width/length are computed live.
// A "feel mode" toggle hides labels to simulate reading the map by touch.

import { useState, useCallback, useRef } from 'react';

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

function fromSvg(px: number, py: number) {
  const x = Math.round((px - PAD) / UNIT) + X_MIN;
  const y = Y_MAX - Math.round((py - PAD) / UNIT);
  return { x, y };
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

interface Pin {
  x: number;
  y: number;
  label: string;
}

const FURNITURE_PRESETS: { id: string; label: string; pins: Pin[] }[] = [
  {
    id: 'wardrobe',
    label: 'Wardrobe (4 ft × 2 ft)',
    pins: [
      { label: 'W₁', x: 3, y: 1 },
      { label: 'W₂', x: 7, y: 1 },
      { label: 'W₃', x: 7, y: 3 },
      { label: 'W₄', x: 3, y: 3 },
    ],
  },
  {
    id: 'bed',
    label: 'Bed (6 ft × 4 ft)',
    pins: [
      { label: 'S₁', x: 1, y: 5 },
      { label: 'S₂', x: 7, y: 5 },
      { label: 'S₃', x: 7, y: 9 },
      { label: 'S₄', x: 1, y: 9 },
    ],
  },
  {
    id: 'desk',
    label: 'Desk (3 ft × 2 ft)',
    pins: [
      { label: 'D₁', x: 8, y: 4 },
      { label: 'D₂', x: 11, y: 4 },
      { label: 'D₃', x: 11, y: 6 },
      { label: 'D₄', x: 8, y: 6 },
    ],
  },
];

export default function TactileRoomBuilderSim() {
  const [presetIdx, setPresetIdx] = useState(0);
  const [pins, setPins] = useState<Pin[]>(FURNITURE_PRESETS[0].pins);
  const [feelMode, setFeelMode] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const selectPreset = useCallback((idx: number) => {
    setPresetIdx(idx);
    setPins(FURNITURE_PRESETS[idx].pins);
  }, []);

  const onPointerDown = useCallback((i: number) => (e: React.PointerEvent) => {
    e.stopPropagation();
    setDragging(i);
  }, []);

  const onSvgPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (dragging === null) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const py = ((e.clientY - rect.top) / rect.height) * SVG_H;
    const { x, y } = fromSvg(px, py);
    const cx = clamp(x, X_MIN, X_MAX);
    const cy = clamp(y, Y_MIN, Y_MAX);
    setPins(curr => curr.map((p, idx) => idx === dragging ? { ...p, x: cx, y: cy } : p));
  }, [dragging]);

  const onSvgPointerUp = useCallback(() => setDragging(null), []);

  // Compute width and length (using the bounding box of the pins, since pins may
  // not always be in a clean rectangle while a student is dragging).
  const xs = pins.map(p => p.x);
  const ys = pins.map(p => p.y);
  const widthFt = Math.max(...xs) - Math.min(...xs);
  const lengthFt = Math.max(...ys) - Math.min(...ys);

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
          Tactile <span style={{ color: '#f59e0b' }}>Room Builder</span>
        </h1>
        <p style={{
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
          color: '#475569', marginTop: 4, marginBottom: 0,
        }}>
          Pins, Threads, Coordinates · Class 9 Mathematics
        </p>
      </div>

      {/* Preset chooser */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {FURNITURE_PRESETS.map((p, i) => {
          const active = i === presetIdx;
          return (
            <button
              key={p.id} onClick={() => selectPreset(i)}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: active ? '1px solid rgba(245,158,11,0.6)' : '1px solid rgba(255,255,255,0.08)',
                background: active ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                color: active ? '#fbbf24' : '#94a3b8',
              }}
            >
              {p.label}
            </button>
          );
        })}
        <button
          onClick={() => setFeelMode(v => !v)}
          style={{
            padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            border: feelMode ? '1px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.08)',
            background: feelMode ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
            color: feelMode ? '#c7d2fe' : '#94a3b8',
            marginLeft: 'auto',
          }}
        >
          {feelMode ? '● Feel Mode (labels hidden)' : '○ Feel Mode'}
        </button>
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12, lineHeight: 1.5 }}>
        Drag any pin to a new corner of the grid. The threads stretch automatically. Tap <b>Feel Mode</b> to hide labels — what Reiaan&rsquo;s fingers would experience on the tactile map.
      </p>

      {/* SVG */}
      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)', background: '#1a1410',
        marginBottom: 14,
      }}>
        <svg
          ref={svgRef} width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block', cursor: dragging !== null ? 'grabbing' : 'crosshair', touchAction: 'none' }}
          onPointerMove={onSvgPointerMove}
          onPointerUp={onSvgPointerUp}
          onPointerCancel={onSvgPointerUp}
          onPointerLeave={onSvgPointerUp}
        >
          {/* Cardboard background */}
          <rect x={0} y={0} width={SVG_W} height={SVG_H} fill="#241710" />

          {/* Grid */}
          {Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => {
            const x = X_MIN + i;
            const { px } = toSvg(x, 0);
            return (
              <line key={`vg${x}`} x1={px} y1={PAD} x2={px} y2={SVG_H - PAD}
                stroke="rgba(245,158,11,0.12)" strokeWidth={1} />
            );
          })}
          {Array.from({ length: Y_MAX - Y_MIN + 1 }, (_, i) => {
            const y = Y_MIN + i;
            const { py } = toSvg(0, y);
            return (
              <line key={`hg${y}`} x1={PAD} y1={py} x2={SVG_W - PAD} y2={py}
                stroke="rgba(245,158,11,0.12)" strokeWidth={1} />
            );
          })}

          {/* Axis labels */}
          {!feelMode && (
            <>
              {Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => {
                const x = X_MIN + i;
                if (x === 0) return null;
                const { px } = toSvg(x, 0);
                return (
                  <text key={`tx${x}`} x={px} y={SVG_H - 12}
                    fill="#94a3b8" fontSize={9} fontWeight={600} textAnchor="middle">
                    {x}
                  </text>
                );
              })}
              {Array.from({ length: Y_MAX - Y_MIN + 1 }, (_, i) => {
                const y = Y_MIN + i;
                if (y === 0) return null;
                const { py } = toSvg(0, y);
                return (
                  <text key={`ty${y}`} x={18} y={py + 3}
                    fill="#94a3b8" fontSize={9} fontWeight={600} textAnchor="middle">
                    {y}
                  </text>
                );
              })}
              <text x={18} y={SVG_H - 12} fill="#fbbf24" fontSize={9} fontWeight={700} textAnchor="middle">O</text>
            </>
          )}

          {/* Threads — connect each pin to the next, closing the loop */}
          {pins.map((p, i) => {
            const next = pins[(i + 1) % pins.length];
            const a = toSvg(p.x, p.y);
            const b = toSvg(next.x, next.y);
            return (
              <line key={`thr${i}`} x1={a.px} y1={a.py} x2={b.px} y2={b.py}
                stroke="#dc2626" strokeWidth={3} strokeLinecap="round"
                opacity={feelMode ? 0.5 : 0.85} />
            );
          })}

          {/* Bounding box highlight (subtle fill) */}
          {(() => {
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);
            const a = toSvg(minX, maxY);
            const b = toSvg(maxX, minY);
            return (
              <rect x={a.px} y={a.py} width={b.px - a.px} height={b.py - a.py}
                fill="rgba(245,158,11,0.06)" stroke="none" />
            );
          })()}

          {/* Pins */}
          {pins.map((p, i) => {
            const { px, py } = toSvg(p.x, p.y);
            return (
              <g key={`pin${i}`}>
                {/* Pin head — slightly larger hit zone for fingers/cursor */}
                <circle cx={px} cy={py} r={14}
                  fill="transparent"
                  onPointerDown={onPointerDown(i)}
                  style={{ cursor: dragging === i ? 'grabbing' : 'grab' }} />
                <circle cx={px} cy={py} r={6}
                  fill="#fbbf24" stroke="#0B0F15" strokeWidth={2} pointerEvents="none" />
                {!feelMode && (
                  <text x={px + 10} y={py - 9} fill="#fbbf24"
                    fontSize={11} fontWeight={700} pointerEvents="none">
                    {p.label} ({p.x}, {p.y})
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Coordinate readout */}
      <div style={{
        borderRadius: 10, padding: '12px 14px',
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
        marginBottom: 8,
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fbbf24', margin: 0, marginBottom: 6 }}>
          Pin Coordinates · 1 unit = 1 foot
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px' }}>
          {pins.map((p, i) => (
            <span key={i} style={{ fontSize: 13, color: '#e2e8f0' }}>
              <b style={{ color: '#fbbf24' }}>{p.label}</b> = ({p.x}, {p.y})
            </span>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, marginTop: 8, lineHeight: 1.5 }}>
          Bounding-box width: <b style={{ color: '#fbbf24' }}>{widthFt} ft</b> · length: <b style={{ color: '#fbbf24' }}>{lengthFt} ft</b>
        </p>
      </div>
    </div>
  );
}
