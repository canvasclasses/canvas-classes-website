'use client';

/*
 * field-bench/useStageWidth.ts — measure the CONTAINER, never the viewport.
 * ─────────────────────────────────────────────────────────────────────────────
 * A Tailwind `lg:` variant asks the VIEWPORT how wide it is, which is the wrong
 * question here twice over: these components also render inside the admin
 * books-editor's split-pane preview (viewport 1440, pane ~380), and a browser
 * QA pass measured a canvas collapsing to 128×107 inside a still-360-tall
 * parent because a viewport query kept the two-column layout at a 375 px stage.
 *
 * ⚠ 0 MEANS NARROW, NOT DESKTOP. `width` is 0 until the first ResizeObserver
 * callback lands. Earlier engines wrote `w > 0 && w < STACK_WIDTH`, which reads
 * "unmeasured ⇒ desktop" and shipped one frame of two-column layout into a
 * phone — a visible reflow, and on a slow device more than one frame. The rule
 * here is the opposite and it is deliberate: an unmeasured stage is assumed
 * NARROW, because the stacked layout is correct at every width (it is merely
 * roomier than necessary on a desktop) while the two-column layout is broken
 * below 640. Guess the safe one.
 */

import * as React from 'react';

/** Below this MEASURED container width the panels stack under the canvas. */
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

/** Stacked layout? 0 (unmeasured) counts as narrow — see the header. */
export const isNarrow = (measured: number): boolean => measured < STACK_WIDTH;

/**
 * Height to render a fixed-aspect stage at.
 *
 * A stage with a fixed height letterboxes as soon as the container is narrower
 * than its viewBox: the drawing shrinks to fit the width while the box keeps
 * its full height, leaving a small diagram in a tall empty frame on a phone.
 * Capping the height at the container's own aspect ratio removes the dead
 * bands.
 */
export function stageHeight(containerWidth: number, aspect = 0.66, max = 430, min = 260): number {
  if (containerWidth <= 0) return min;
  return Math.max(min, Math.min(max, Math.round(containerWidth * aspect)));
}
