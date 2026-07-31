'use client';

/*
 * pulley/useStageWidth.ts — measure the CONTAINER, never the viewport.
 * ─────────────────────────────────────────────────────────────────────────────
 * A Tailwind `lg:` variant asks the VIEWPORT how wide it is, and that is the
 * wrong question here: Pulley Lab also renders inside the admin books-editor's
 * split-pane preview, where the viewport is a 1440 px desktop and the pane is
 * ~380 px. A viewport query keeps the two-column layout there and squeezes the
 * diagram to nothing — which is exactly the failure a browser QA pass measured
 * at a 375 px stage on 2026-07-29 (a sibling canvas collapsed to 128×107 inside
 * a still-360-px-tall parent).
 *
 * `width` is 0 until the first measurement lands, and every caller reads that
 * as "keep the server-rendered layout" — no hydration mismatch, and no flash on
 * a desktop where the SSR guess was already right.
 */

import * as React from 'react';

/** Below this measured container width the canvas goes full-width and the
 *  panels stack underneath it. */
export const STACK_WIDTH = 640;

export function useStageWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = React.useRef<T | null>(null);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const read = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      // Same number in, same number out — no re-render, so an observer that
      // fires because we changed the HEIGHT can never loop.
      setWidth((prev) => (prev === w ? prev : w));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, width];
}
