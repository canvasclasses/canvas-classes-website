'use client';

/*
 * circular/useStageWidth.ts — measure the CONTAINER, never the viewport.
 * ─────────────────────────────────────────────────────────────────────────────
 * A Tailwind `lg:` variant asks the VIEWPORT how wide it is. That is the wrong
 * question here twice over:
 *
 *   • these components also render inside the admin books-editor's split-pane
 *     preview, where the viewport is a 1440 px desktop and the pane is ~380 px
 *     — so a viewport query keeps the two-column layout and squeezes the canvas
 *     to nothing;
 *   • a browser QA pass on 2026-07-29 measured exactly that failure at a 375 px
 *     stage: a canvas collapsed to 128×107 inside a still-360-px-tall parent,
 *     because the canvas/side-panel split stayed two-column.
 *
 * So every responsive decision in this directory is driven off a ResizeObserver
 * on the wrapper element instead.
 *
 * `width` is 0 until the first measurement lands. That is deliberate: 0 means
 * "not measured yet", and every caller treats it as "keep the server-rendered
 * layout" — no hydration mismatch, and no layout flash on a desktop where the
 * SSR guess was already right.
 */

import * as React from 'react';

/** Below this measured container width the canvas goes full-width and the
 *  panels stack underneath it. Chosen so a 375 px phone stage always stacks and
 *  a normal desktop column (7fr of ~1000 px) never does. */
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

/**
 * The height to actually render a fixed-aspect SVG stage at.
 *
 * A stage with `viewBox="0 0 vw vh"`, `height={vh}` and `preserveAspectRatio`
 * "meet" letterboxes as soon as the container is narrower than `vw`: the
 * drawing shrinks to fit the width while the box keeps its full height, so a
 * phone gets a small diagram floating in a tall empty frame. Capping the height
 * at the container's own aspect ratio removes the dead bands and the drawing is
 * then as large as the width allows.
 */
export function stageHeight(
  containerWidth: number,
  viewW: number,
  viewH: number,
  max: number,
  min = 190,
): number {
  if (containerWidth <= 0) return max;
  return Math.max(min, Math.min(max, Math.round((containerWidth * viewH) / viewW)));
}
