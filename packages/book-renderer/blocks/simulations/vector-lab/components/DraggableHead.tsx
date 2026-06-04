'use client';

// DraggableHead.tsx — a pointer-draggable handle that sits at a vector's head.
// Dragging it sets the vector's (x, y) in PHYSICS coordinates. This is the
// PhET-validated core interaction: students grab the tip and feel magnitude +
// direction change together. Works with mouse, touch and pen via Pointer Events.

import React, { useCallback, useRef } from 'react';
import type { Vec2 } from '../lib/vectorMath';
import { magnitude, fromPolar, angleDeg } from '../lib/vectorMath';
import { toScreen, toWorld, type Frame } from '../lib/viewport';

/** Convert a pointer event into SVG user-space coordinates for the given <svg>. */
function eventToSvg(svg: SVGSVGElement, clientX: number, clientY: number): { x: number; y: number } {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const local = pt.matrixTransform(ctm.inverse());
  return { x: local.x, y: local.y };
}

export interface DraggableHeadProps {
  /** Current head position in physics coords. */
  value: Vec2;
  frame: Frame;
  /** Ref to the parent <svg>, needed to map screen → user space. */
  svgRef: React.RefObject<SVGSVGElement | null>;
  onChange: (next: Vec2) => void;
  color: string;
  /** Tail of the vector — defaults to the frame origin (0,0 in world). */
  tail?: Vec2;
  /** Clamp magnitude to this maximum (in units). */
  maxMag?: number;
  /** Snap the angle to this increment in degrees (e.g. 15). 0 = no snap. */
  angleSnap?: number;
  /** Snap components to whole units. */
  gridSnap?: boolean;
  disabled?: boolean;
  radius?: number;
}

export function DraggableHead({
  value,
  frame,
  svgRef,
  onChange,
  color,
  tail = { x: 0, y: 0 },
  maxMag = 12,
  angleSnap = 0,
  gridSnap = false,
  disabled = false,
  radius = 9,
}: DraggableHeadProps) {
  const dragging = useRef(false);
  const screen = toScreen(value, frame);

  const apply = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return;
      const local = eventToSvg(svg, clientX, clientY);
      let world = toWorld(local.x, local.y, frame);
      // Express relative to the tail so dragging respects a non-origin start.
      let rel: Vec2 = { x: world.x - tail.x, y: world.y - tail.y };

      // Clamp magnitude.
      const m = magnitude(rel);
      if (m > maxMag) rel = fromPolar(maxMag, angleDeg(rel));

      // Angle snap (takes priority — keeps magnitude, rounds direction).
      if (angleSnap > 0 && magnitude(rel) > 0.1) {
        const a = Math.round(angleDeg(rel) / angleSnap) * angleSnap;
        rel = fromPolar(magnitude(rel), a);
      }

      // Grid snap (whole units).
      if (gridSnap) rel = { x: Math.round(rel.x), y: Math.round(rel.y) };

      world = { x: tail.x + rel.x, y: tail.y + rel.y };
      onChange(world);
    },
    [svgRef, frame, tail, maxMag, angleSnap, gridSnap, onChange]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragging.current = true;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    apply(e.clientX, e.clientY);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      /* capture may already be gone */
    }
  };

  return (
    <g style={{ cursor: disabled ? 'default' : 'grab' }}>
      {/* Generous invisible hit area so it's grabbable on touch screens. */}
      <circle
        cx={screen.x}
        cy={screen.y}
        r={radius + 12}
        fill="transparent"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
      <circle cx={screen.x} cy={screen.y} r={radius} fill={color} opacity={0.25} />
      <circle cx={screen.x} cy={screen.y} r={radius - 3} fill={color} stroke="#0d1117" strokeWidth={2} pointerEvents="none" />
    </g>
  );
}
