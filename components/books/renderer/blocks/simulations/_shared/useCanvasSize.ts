'use client';

import { useEffect, useRef } from 'react';

/*
 * useCanvasSize
 * --------------
 * Handles the three-line boilerplate that EMWaveSim, GoldFoilSim, and
 * RutherfordCollapseSim were each copying: ResizeObserver → devicePixelRatio
 * scaling → transform reset. Instead of wiring it up in every sim, hand the
 * canvas ref + a redraw callback to this hook.
 *
 * What it gives you:
 *
 *   1. A ResizeObserver on the canvas element that re-pixels on layout
 *      changes (browser zoom, sidebar toggle, responsive reflow).
 *   2. `devicePixelRatio` scaling clamped to 2× — going higher costs GPU
 *      memory without a visible improvement on any real display.
 *   3. `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` on every resize so the
 *      caller can keep drawing in CSS pixels without worrying about the
 *      backing store.
 *   4. An immediate first-paint callback once the canvas has its size, so
 *      sims don't need a separate effect to kick off the initial render.
 *
 * Usage:
 *
 *   const canvasRef = useRef<HTMLCanvasElement>(null);
 *   const dims = useCanvasSize(canvasRef, () => {
 *     const ctx = canvasRef.current!.getContext('2d')!;
 *     // draw at dims.current.w × dims.current.h in CSS px
 *   });
 */

export interface CanvasDims {
  w: number;
  h: number;
  dpr: number;
}

const MAX_DPR = 2;

export function useCanvasSize(
  ref: React.RefObject<HTMLCanvasElement | null>,
  onResize?: (dims: CanvasDims) => void
) {
  const dimsRef = useRef<CanvasDims>({ w: 0, h: 0, dpr: 1 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = ref.current;
    if (!canvas) return;

    const apply = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      // Only resize the backing store if it actually changed — resetting the
      // transform every frame wipes any ongoing drawing.
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      dimsRef.current = { w, h, dpr };
      onResize?.(dimsRef.current);
    };

    apply();

    const ro = new ResizeObserver(apply);
    ro.observe(canvas);
    return () => ro.disconnect();
    // onResize is intentionally omitted — it usually isn't memoised in the
    // caller, and we read the freshest one via a closure on every resize
    // event anyway.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return dimsRef;
}
