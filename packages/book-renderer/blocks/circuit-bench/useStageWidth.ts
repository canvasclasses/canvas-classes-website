'use client';

/*
 * circuit-bench/useStageWidth.ts — measure the CONTAINER, never the viewport.
 * ─────────────────────────────────────────────────────────────────────────────
 * A Tailwind `lg:` variant asks the BROWSER WINDOW how wide it is, which is the
 * wrong question: Circuit Bench also renders inside the admin books-editor's
 * split-pane preview, where the viewport is a 1440 px desktop and the pane is
 * ~380 px. A viewport query keeps the two-column layout there and squeezes the
 * board to nothing.
 *
 * ⚠ AN UNMEASURED WIDTH COUNTS AS NARROW. `width` is 0 until the first
 * measurement lands, and `isStacked` treats 0 as stacked. A previous engine
 * shipped `w > 0 && w < 640`, which fell through to the DESKTOP branch for the
 * first paint and for any container that never reports — the phone layout then
 * appeared only after a resize. Narrow is the safe default; being briefly
 * single-column on a desktop costs nothing.
 */

import * as React from 'react';

/** Below this MEASURED container width the board goes full-width and the panels
 *  stack underneath it. Never a CSS media query. */
export const STACK_WIDTH = 640;

export function useStageWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = React.useRef<T | null>(null);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const read = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      // Same number in, same number out — no re-render, so an observer firing
      // because we changed the HEIGHT can never loop.
      setWidth((prev) => (prev === w ? prev : w));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, width];
}

/** The one place the breakpoint is applied. 0 (unmeasured) is NARROW. */
export const isStacked = (measuredWidth: number): boolean => measuredWidth < STACK_WIDTH;
