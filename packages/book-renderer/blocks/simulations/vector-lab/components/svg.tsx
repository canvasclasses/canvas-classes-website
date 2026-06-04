'use client';

// svg.tsx — SVG drawing primitives for the Vector Lab.
// All inputs are in PHYSICS coordinates (y up); toScreen() does the only flip.
// Arrow lengths are therefore always true to magnitude (design workflow §7 —
// "vector arrows must have correct relative magnitudes, never decorative").

import React from 'react';
import type { Vec2 } from '../lib/vectorMath';
import { magnitude } from '../lib/vectorMath';
import { toScreen, type Frame } from '../lib/viewport';
import { C, VIEW } from '../lib/theme';

// ── Background grid + axes ─────────────────────────────────────────────────────
export function Grid({ frame, step = 1 }: { frame: Frame; step?: number }) {
  const lines: React.ReactNode[] = [];
  const px = step * frame.scale;
  for (let x = frame.originX; x <= VIEW.w; x += px) lines.push(<line key={`xr${x}`} x1={x} y1={0} x2={x} y2={VIEW.h} stroke="rgba(255,255,255,0.04)" />);
  for (let x = frame.originX - px; x >= 0; x -= px) lines.push(<line key={`xl${x}`} x1={x} y1={0} x2={x} y2={VIEW.h} stroke="rgba(255,255,255,0.04)" />);
  for (let y = frame.originY; y <= VIEW.h; y += px) lines.push(<line key={`yd${y}`} x1={0} y1={y} x2={VIEW.w} y2={y} stroke="rgba(255,255,255,0.04)" />);
  for (let y = frame.originY - px; y >= 0; y -= px) lines.push(<line key={`yu${y}`} x1={0} y1={y} x2={VIEW.w} y2={y} stroke="rgba(255,255,255,0.04)" />);
  return <g>{lines}</g>;
}

export function Axes({ frame }: { frame: Frame }) {
  return (
    <g>
      <line x1={0} y1={frame.originY} x2={VIEW.w} y2={frame.originY} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      <line x1={frame.originX} y1={0} x2={frame.originX} y2={VIEW.h} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      <text x={VIEW.w - 12} y={frame.originY - 8} fill={C.ghost} fontSize={12} fontStyle="italic">x</text>
      <text x={frame.originX + 8} y={14} fill={C.ghost} fontSize={12} fontStyle="italic">y</text>
    </g>
  );
}

// ── Arrow ──────────────────────────────────────────────────────────────────────
export interface ArrowProps {
  from: Vec2; // physics coords
  to: Vec2; // physics coords
  frame: Frame;
  color: string;
  label?: string;
  width?: number;
  dashed?: boolean;
  opacity?: number;
  /** Render label in italic (vector symbol) vs upright. */
  italicLabel?: boolean;
}

export function VectorArrow({ from, to, frame, color, label, width = 3.5, dashed, opacity = 1, italicLabel = true }: ArrowProps) {
  const a = toScreen(from, frame);
  const b = toScreen(to, frame);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len < 0.5) {
    // Degenerate (zero) vector — draw just a dot so the student still sees it.
    return <circle cx={a.x} cy={a.y} r={4} fill={color} opacity={opacity} />;
  }
  const ux = dx / len;
  const uy = dy / len;
  // Arrowhead sized in px but capped so short vectors still look like arrows.
  const head = Math.min(14, len * 0.4);
  const tipX = b.x;
  const tipY = b.y;
  // Pull the shaft back so it ends at the base of the head (cleaner join).
  const shaftX = tipX - ux * head * 0.9;
  const shaftY = tipY - uy * head * 0.9;
  const perpX = -uy;
  const perpY = ux;
  const w = head * 0.55;
  const p1 = `${tipX},${tipY}`;
  const p2 = `${shaftX + perpX * w},${shaftY + perpY * w}`;
  const p3 = `${shaftX - perpX * w},${shaftY - perpY * w}`;
  // Label sits a little beyond the tip, offset perpendicular for legibility.
  const lx = tipX + ux * 6 + perpX * 12;
  const ly = tipY + uy * 6 + perpY * 12;
  return (
    <g opacity={opacity}>
      <line
        x1={a.x}
        y1={a.y}
        x2={shaftX}
        y2={shaftY}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? '7 6' : undefined}
      />
      <polygon points={`${p1} ${p2} ${p3}`} fill={color} />
      {label ? (
        <text
          x={lx}
          y={ly}
          fill={color}
          fontSize={15}
          fontWeight={800}
          fontStyle={italicLabel ? 'italic' : 'normal'}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

// ── Angle arc between two directions (for "θ between A and B") ─────────────────
export function AngleArc({
  vertex,
  fromDeg,
  toDeg,
  frame,
  radiusPx = 34,
  color = C.ghost,
  label,
}: {
  vertex: Vec2;
  fromDeg: number;
  toDeg: number;
  frame: Frame;
  radiusPx?: number;
  color?: string;
  label?: string;
}) {
  const c = toScreen(vertex, frame);
  // Screen angles: y is flipped, so negate the physics angle.
  const a0 = (-fromDeg * Math.PI) / 180;
  const a1 = (-toDeg * Math.PI) / 180;
  const x0 = c.x + radiusPx * Math.cos(a0);
  const y0 = c.y + radiusPx * Math.sin(a0);
  const x1 = c.x + radiusPx * Math.cos(a1);
  const y1 = c.y + radiusPx * Math.sin(a1);
  const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0;
  // Sweep flag: physics CCW = screen CW because of the y flip.
  const sweep = toDeg > fromDeg ? 0 : 1;
  const midDeg = (fromDeg + toDeg) / 2;
  const mid = (-midDeg * Math.PI) / 180;
  const lx = c.x + (radiusPx + 14) * Math.cos(mid);
  const ly = c.y + (radiusPx + 14) * Math.sin(mid);
  return (
    <g>
      <path d={`M ${x0} ${y0} A ${radiusPx} ${radiusPx} 0 ${large} ${sweep} ${x1} ${y1}`} fill="none" stroke={color} strokeWidth={1.5} />
      {label ? (
        <text x={lx} y={ly} fill={color} fontSize={12} fontWeight={700} textAnchor="middle" dominantBaseline="middle">
          {label}
        </text>
      ) : null}
    </g>
  );
}

// ── Dot at a world point (origin marker, etc.) ────────────────────────────────
export function Dot({ at, frame, color = C.amber, r = 4 }: { at: Vec2; frame: Frame; color?: string; r?: number }) {
  const p = toScreen(at, frame);
  return <circle cx={p.x} cy={p.y} r={r} fill={color} />;
}

/** Length helper re-exported so phases can size things off magnitude. */
export const vlen = magnitude;
