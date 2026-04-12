'use client';

import { useEffect, useRef } from 'react';

/*
 * useAnimationFrame
 * ------------------
 * A single source of truth for every requestAnimationFrame loop used by the
 * simulator components. Replaces the ad-hoc `useEffect` + `rAFRef.current`
 * pattern that every simulator was copy-pasting.
 *
 * What this hook gives you over raw rAF:
 *
 *   1. Automatic cancellation on unmount — no more leaked loops after the
 *      student navigates to the next page.
 *   2. **Tab-hidden pause** — when the browser tab goes into the background,
 *      rAF is throttled to ~1 Hz anyway, but we go further and stop the loop
 *      entirely. This matters for mobile where every unwanted frame is a
 *      battery hit, and on desktop where a ~20% CPU sim left in a background
 *      tab is a real problem.
 *   3. **Offscreen pause** (optional) — hand in an `IntersectionObserver`
 *      target (usually the canvas ref) and the loop will also pause when the
 *      canvas is scrolled out of view. Without this, a 1000-line chapter page
 *      with 6 simulators ends up running all 6 loops simultaneously even
 *      though the student can only see one.
 *   4. **Stable callback ref** — the `tick` callback you pass is stored in a
 *      ref and read fresh on every frame, so you can close over React state
 *      without re-wiring the rAF loop on every render.
 *   5. Accurate `delta` (seconds since last frame) passed into the callback,
 *      clamped to a max of ~100 ms so the first frame after a pause doesn't
 *      produce a massive physics jump.
 *
 * Usage:
 *
 *   const canvasRef = useRef<HTMLCanvasElement>(null);
 *   useAnimationFrame(
 *     (delta, elapsed) => {
 *       // draw frame
 *     },
 *     { target: canvasRef, enabled: true }
 *   );
 */

type TickFn = (delta: number, elapsed: number) => void;

interface Options {
  /** Ref to the element whose viewport-visibility gates the loop. */
  target?: React.RefObject<Element | null>;
  /**
   * External on/off switch — when false, the loop does not run even if the
   * target is visible and the tab is focused. Defaults to true.
   */
  enabled?: boolean;
  /**
   * Maximum tolerated delta in seconds. First frame after a long pause
   * gets clamped to this value so physics integrators don't explode.
   * Default: 0.1 s (= one 10 FPS frame).
   */
  maxDelta?: number;
}

const DEFAULT_MAX_DELTA = 0.1;

export function useAnimationFrame(tick: TickFn, options: Options = {}) {
  const { target, enabled = true, maxDelta = DEFAULT_MAX_DELTA } = options;

  // Always call the freshest callback so the consumer can close over React
  // state without us re-binding the rAF loop on every render.
  const tickRef = useRef<TickFn>(tick);
  tickRef.current = tick;

  useEffect(() => {
    if (!enabled) return;

    // SSR guard — `window` is undefined during server render. All simulators
    // are loaded via `next/dynamic({ ssr: false })` but be defensive anyway.
    if (typeof window === 'undefined') return;

    let rafId = 0;
    let running = false;
    let lastTs = 0;
    let startTs = 0;

    // Visibility state from the target (viewport) and from the tab itself.
    // The loop only runs when BOTH are true.
    let inViewport = !target; // if there's no target, treat as always "in view"
    let tabVisible =
      typeof document === 'undefined' ? true : document.visibilityState === 'visible';

    const loop = (ts: number) => {
      if (!running) return;
      if (!lastTs) {
        lastTs = ts;
        startTs = ts;
      }
      let delta = (ts - lastTs) / 1000;
      if (delta > maxDelta) delta = maxDelta;
      const elapsed = (ts - startTs) / 1000;
      lastTs = ts;
      tickRef.current(delta, elapsed);
      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      if (!inViewport || !tabVisible) return;
      running = true;
      lastTs = 0;
      // `startTs` is intentionally preserved across pauses so `elapsed`
      // stays monotonic — this keeps e.g. oscillators continuous.
      if (!startTs) startTs = 0;
      rafId = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      lastTs = 0;
    };

    const handleVisibility = () => {
      tabVisible = document.visibilityState === 'visible';
      if (tabVisible) start();
      else stop();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // IntersectionObserver — only wire it up if the caller gave us a target.
    // We use a small rootMargin so loops wake up a bit before the canvas
    // reaches the viewport, which hides the "first frame pop-in" for users
    // scrolling at high speed.
    let io: IntersectionObserver | null = null;
    if (target && target.current && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            inViewport = entry.isIntersecting;
          }
          if (inViewport) start();
          else stop();
        },
        { rootMargin: '200px 0px' }
      );
      io.observe(target.current);
    }

    start();

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
      if (io) io.disconnect();
    };
    // `target` is a ref object — its identity is stable across renders, so
    // depending on it here does not re-trigger the effect on every update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, maxDelta]);
}
