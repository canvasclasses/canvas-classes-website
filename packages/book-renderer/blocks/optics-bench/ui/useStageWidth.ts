'use client';

/*
 * optics-bench/ui/useStageWidth.ts — measure the CONTAINER, never the viewport.
 * ─────────────────────────────────────────────────────────────────────────────
 * A Tailwind `lg:` variant asks the VIEWPORT how wide it is, which is the wrong
 * question twice over: these components also render inside the admin
 * books-editor's split-pane preview (1440 px viewport, ~380 px pane), and a
 * browser QA pass in July measured a canvas collapsed to 128×107 inside a
 * still-360-px-tall parent because the two-column split never gave way.
 *
 * So every responsive decision here is driven off a ResizeObserver.
 *
 * ⚠ `width` is 0 until the first measurement lands, and 0 MUST count as NARROW.
 * An earlier sim treated an unmeasured width as desktop, which is exactly
 * backwards: the phone case is the one that breaks, so the unmeasured case has
 * to fail towards it. Stacking for one frame on a desktop is invisible;
 * two-columning for one frame on a phone squeezes the canvas to nothing.
 */

import * as React from 'react';

/** Below this MEASURED container width the canvas goes full-width and the
 *  panels stack underneath. Chosen so a 375 px phone stage always stacks and a
 *  normal desktop column never does. */
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

/** true when the layout must stack. An unmeasured width (0) is NARROW. */
export const isNarrow = (width: number): boolean => width < STACK_WIDTH;

/**
 * Height to render a fixed-aspect SVG stage at.
 *
 * A stage with a viewBox and `preserveAspectRatio: meet` letterboxes as soon as
 * the container is narrower than the viewBox: the drawing shrinks to fit the
 * width while the box keeps its full height, so a phone gets a small diagram
 * floating in a tall empty frame. Capping the height at the container's own
 * aspect ratio removes the dead bands.
 */
export function stageHeight(
  containerWidth: number, viewW: number, viewH: number, max: number, min = 220,
): number {
  if (containerWidth <= 0) return Math.min(max, Math.max(min, 300));
  return Math.max(min, Math.min(max, Math.round((containerWidth * viewH) / viewW)));
}
