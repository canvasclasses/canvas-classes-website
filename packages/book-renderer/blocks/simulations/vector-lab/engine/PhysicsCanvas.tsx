'use client';

// PhysicsCanvas.tsx — a responsive, DPR-correct 2-D canvas that drives a
// fixed-timestep simulation loop. The physics engine (planck) is owned by the
// caller; this component just (a) advances the world at a stable 60 Hz using an
// accumulator, (b) hands the caller a fresh drawing context + metre transform
// each frame, and (c) maps pointer events into world (metre) coordinates.
//
// Reuses the shared useAnimationFrame hook so the loop auto-pauses when the
// canvas scrolls off-screen or the tab is hidden — important on a page that may
// host several heavy sims.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAnimationFrame } from '../../_shared/useAnimationFrame';
import { makeTransform, type ViewTransform, type XY } from './transform';
import { clear } from './canvasKit';

export interface PhysicsCanvasProps {
  metersWide: number;
  originXFrac?: number;
  originYFrac?: number;
  height?: number;
  running?: boolean;
  fixedDt?: number;
  /** Advance the world by exactly `dt` seconds. Called 0..n times per frame. */
  onStep?: (dt: number) => void;
  /** Draw one frame. The canvas is already cleared to the lab gradient. */
  onDraw: (ctx: CanvasRenderingContext2D, tf: ViewTransform) => void;
  onPointerDown?: (world: XY, e: React.PointerEvent) => void;
  onPointerMove?: (world: XY, e: React.PointerEvent) => void;
  onPointerUp?: (world: XY, e: React.PointerEvent) => void;
}

export function PhysicsCanvas(props: PhysicsCanvasProps) {
  const { metersWide, originXFrac = 0.5, originYFrac = 0.5, height = 440, running = true, fixedDt = 1 / 60 } = props;

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tfRef = useRef<ViewTransform | null>(null);
  const accRef = useRef(0);
  const [size, setSize] = useState({ w: 0, h: height });

  // Keep callbacks fresh without re-binding the rAF loop.
  const stepRef = useRef(props.onStep);
  const drawRef = useRef(props.onDraw);
  stepRef.current = props.onStep;
  drawRef.current = props.onDraw;

  // Track CSS size + apply DPR scaling to the backing store.
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const apply = () => {
      const w = wrap.clientWidth;
      const h = height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setSize({ w, h });
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [height]);

  useAnimationFrame(
    (delta) => {
      const canvas = canvasRef.current;
      if (!canvas || size.w === 0) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const tf = makeTransform(size.w, size.h, { metersWide, originXFrac, originYFrac });
      tfRef.current = tf;

      // Fixed-step integration with an accumulator → stable, deterministic physics.
      if (stepRef.current) {
        accRef.current += delta;
        let guard = 0;
        while (accRef.current >= fixedDt && guard < 6) {
          stepRef.current(fixedDt);
          accRef.current -= fixedDt;
          guard++;
        }
        if (guard >= 6) accRef.current = 0; // shed backlog after a long stall
      }

      clear(ctx, size.w, size.h);
      drawRef.current(ctx, tf);
    },
    { target: canvasRef, enabled: running && size.w > 0 }
  );

  const toWorld = useCallback((e: React.PointerEvent): XY => {
    const canvas = canvasRef.current;
    const tf = tfRef.current;
    if (!canvas || !tf) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return tf.toM({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: 24,
        overflow: 'hidden',
        border: '1px solid rgba(99,102,241,0.2)',
        touchAction: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture(e.pointerId);
          props.onPointerDown?.(toWorld(e), e);
        }}
        onPointerMove={(e) => props.onPointerMove?.(toWorld(e), e)}
        onPointerUp={(e) => {
          try {
            (e.target as Element).releasePointerCapture(e.pointerId);
          } catch {
            /* capture already released */
          }
          props.onPointerUp?.(toWorld(e), e);
        }}
      />
    </div>
  );
}
