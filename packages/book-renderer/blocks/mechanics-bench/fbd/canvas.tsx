'use client';

/*
 * fbd/canvas.tsx — how every FBD board is measured, laid out, and framed.
 * ─────────────────────────────────────────────────────────────────────────────
 * A browser QA pass on 2026-07-29 measured three defects on real boards, and all
 * three trace back to this one missing layer. So they are fixed once, here, and
 * every stage inherits the fix.
 *
 *  D1  THE CANVAS WAS CLIPPED. Each board set `viewBox="0 0 430 360"` with
 *      `width:100%` and NO height, so the browser derived the SVG's height from
 *      the VIEWBOX ASPECT against the container width — 611 × 512 CSS px inside
 *      a container fixed at 613 × 360 with `overflow:hidden`. 152px of drawing
 *      was silently cut off the bottom (a weight arrow ran off the edge). Now
 *      the viewBox is the MEASURED pixel box and the SVG is absolutely
 *      positioned to fill it, so one viewBox unit is exactly one CSS pixel and
 *      the element can never exceed the box.
 *
 *      That 1:1 mapping has a second payoff: a radius written in viewBox units
 *      IS a radius in CSS pixels, so hit targets stop shrinking as the camera
 *      zooms out. See `HIT` below.
 *
 *  D2  THE DIAGRAM WAS TINY. The camera was a hardcoded window, not a fit:
 *      content occupied 7.7% of the board's area (28.5% × 27.1% linear). Every
 *      stage now fits the camera to the union of what it ACTUALLY draws —
 *      bodies, strings, ground/wall/ceiling AND the force arrows. Arrows are
 *      what overflow, so leaving them out of the fit would just re-create D1.
 *
 *  D3  IT WAS UNUSABLE ON A PHONE. The canvas/sidebar split used Tailwind's
 *      `lg:` — a VIEWPORT media query — so a 375px-wide stage inside a 1440px
 *      window kept two columns and the board collapsed to 128 × 107. The split
 *      is now driven by the measured CONTAINER width, which is also the only
 *      thing that can be right inside the admin editor's narrow split-pane
 *      preview, where the viewport is wide but the block is not.
 *
 * ⚠ ONE SCALE FOR BOTH AXES, ALWAYS. `fitView` never fits x and y independently:
 *   a stretched axis would make a 30° incline look like 60° and silently
 *   contradict the readout next to it. That is a correctness constraint.
 */

import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { stableFit } from '../lib/svg';
import type { Bounds, View } from '../lib/svg';
import { FIT_PAD, isNarrowStage, stageColumns, stageAspect } from './fit';
import { CANVAS_STYLE } from './theme';

// The camera MATH and the responsive DECISION both live in `./fit` (pure .ts,
// so node scripts can execute them). This file owns only the React around them.
export {
  FIT_PAD, NARROW_PX, mixedBounds, sceneWorldBounds, localBounds,
  isNarrowStage, stageColumns, stageAspect,
} from './fit';
export type { Spur } from './fit';

// ── Measurement ──────────────────────────────────────────────────────────────

export interface BoxSize { w: number; h: number }

/** A ref you hand to `ref={}` — a CALLBACK ref, not a ref object. See below. */
export type BoxRef = (el: HTMLElement | null) => void;

/**
 * The element's own CSS-pixel box, as STATE (a ref object would not re-render,
 * and the viewBox has to change with the box).
 *
 * THIS IS A CALLBACK REF, and that is the whole point. The first version used
 * `useRef` + a `[]`-dep layout effect, which observes whatever node happened to
 * be mounted on the very first commit and never looks again. If React later
 * swaps the DOM node — a remount, a keyed re-create, a parent that re-mounts
 * the subtree — the observer stays attached to the OLD, now-detached element.
 * A detached element measures 0 × 0 forever, and the component quietly keeps
 * rendering at whatever the zero-width branch happens to be. React calls a
 * callback ref with every new node (and `null` on detach), so the observer can
 * never end up watching a corpse.
 *
 * The callback is stable across renders — an unstable one makes React detach
 * and re-attach on every commit, which would thrash the observer instead.
 */
export function useBoxSize(): [BoxRef, BoxSize] {
  const [size, setSize] = useState<BoxSize>({ w: 0, h: 0 });
  const node = useRef<HTMLElement | null>(null);
  const obs = useRef<ResizeObserver | null>(null);

  const measure = useCallback(() => {
    const el = node.current;
    // `isConnected` guards the detached-node case above: a stale measurement of
    // 0 is worse than no measurement, because 0 silently picks a branch.
    if (!el || !el.isConnected) return;
    const r = el.getBoundingClientRect();
    const w = Math.max(0, Math.round(r.width));
    const h = Math.max(0, Math.round(r.height));
    setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
  }, []);

  const attach = useCallback<BoxRef>((el) => {
    obs.current?.disconnect();
    obs.current = null;
    node.current = el;
    if (!el) return;
    measure();                       // synchronous, before paint
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    obs.current = ro;
  }, [measure]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Belt and braces for two cases a lone ResizeObserver misses: a harness (or
    // a split pane) that resizes an ANCESTOR in the same tick as our mount, and
    // a browser that drops an RO notification after a "loop completed with
    // undelivered notifications" frame. Both leave a stale width otherwise.
    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  useEffect(() => () => { obs.current?.disconnect(); obs.current = null; }, []);

  return [attach, size];
}

// ── Responsive stage layout ──────────────────────────────────────────────────

export interface StageBox {
  /** Goes on the plain full-width wrapper — NOT on the grid. See below. */
  rootRef: BoxRef;
  /** Goes on the canvas box. */
  boxRef: BoxRef;
  /** The measured stage width, in CSS px. 0 until the first measurement. */
  stageW: number;
  /** true when the stage is narrow enough to stack — and while unmeasured. */
  narrow: boolean;
  /** The CANVAS box, in CSS px. */
  w: number;
  h: number;
  ready: boolean;
}

/**
 * Measure the stage and its board. Called by the STAGE component (never inside
 * a render prop) so React's hook order stays fixed even before the first
 * measurement lands.
 */
export function useStageBox(): StageBox {
  const [rootRef, root] = useBoxSize();
  const [boxRef, box] = useBoxSize();
  return {
    rootRef, boxRef,
    stageW: root.w,
    narrow: isNarrowStage(root.w),
    w: box.w, h: box.h,
    ready: box.w >= 40 && box.h >= 40,
  };
}

/**
 * The board + its footer on the left, the panels on the right — or stacked, on
 * a narrow container.
 *
 * WHAT IS MEASURED IS A PLAIN BLOCK WRAPPER, NOT THE GRID. A block element's
 * width is its parent's content width, full stop — nothing inside it can
 * influence it. Measuring the grid itself invites a feedback loop, because the
 * grid's own template is the thing being decided from that measurement, and a
 * ResizeObserver whose callback changes the observed element's layout is how a
 * browser ends up dropping notifications ("loop completed with undelivered
 * notifications") and leaving a stale width behind.
 *
 * The board's HEIGHT comes from a CSS aspect ratio on its own width, so the box
 * and the SVG inside it always agree and nothing is ever cropped.
 */
export function StagePanels({ box, footer, side, children }: {
  box: StageBox;
  footer?: React.ReactNode;
  side: React.ReactNode;
  /** The <svg>. Render it only when `box.ready`. */
  children: React.ReactNode;
}) {
  return (
    <div ref={box.rootRef} style={{ width: '100%' }}>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: stageColumns(box.stageW),
          alignItems: 'start',
        }}>
        <div className="flex min-w-0 flex-col gap-2">
          <div
            ref={box.boxRef}
            className="relative overflow-hidden"
            style={{
              ...CANVAS_STYLE,
              width: '100%',
              aspectRatio: stageAspect(box.stageW),
              minHeight: 250,
              maxHeight: 470,
            }}>
            {children}
          </div>
          {footer}
        </div>
        <div className="flex min-w-0 flex-col gap-3">{side}</div>
      </div>
    </div>
  );
}

/** The one <svg> shape every board uses: viewBox = the measured pixel box, and
 *  absolutely positioned so a percentage height can never collapse it (the
 *  failure the old header warned about) nor overflow it (D1). */
export const boardSvgStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  touchAction: 'none',
};

// ── Hit targets ──────────────────────────────────────────────────────────────

/**
 * Handle radii, in viewBox units — which, because the viewBox is the measured
 * pixel box, are CSS pixels at every zoom level. The VISIBLE radius stays small
 * enough to read as a handle; the HIT radius is what a finger has to find, and
 * a 44px target is the phone floor.
 *
 * Sizing these in WORLD units would shrink them as the camera zooms out, which
 * is exactly how a draggable head becomes untappable on a wide scene.
 */
export const HIT = {
  /** Arrow head: aims + sizes the force. */
  head: { r: 13, hit: 23 },
  /** Arrow tail: moves the attachment point. */
  tail: { r: 9.5, hit: 21 },
  /** The wedge's retilt grips. */
  wedge: { r: 11, hit: 22 },
  /** The wedge apex grip. */
  apex: { r: 8, hit: 20 },
} as const;

// ── The camera ───────────────────────────────────────────────────────────────

const FALLBACK = (w: number, h: number): View =>
  ({ cx: 0, cy: 0, scale: 60, w: Math.max(1, w), h: Math.max(1, h) });

/**
 * Fit the camera to `bounds`, with two pieces of restraint:
 *
 *  • `stableFit` hysteresis, so a small change in what is drawn re-centres the
 *    board without rescaling it;
 *  • `frozen`, which holds the camera completely still. Pass the drag flag:
 *    re-fitting mid-gesture is how an earlier sim zoomed out from under the
 *    user's finger, and a handle that runs away from the finger is worse than a
 *    board that is briefly too tight.
 *
 * The committed view is cached in a ref rather than state so the first painted
 * frame is already framed correctly — `stableFit(b, w, h, itsOwnResult)` returns
 * that same result, so this stays idempotent under a StrictMode double render.
 */
export function useFittedView(
  bounds: Bounds | null,
  w: number,
  h: number,
  frozen = false,
  padFrac = FIT_PAD,
  maxScale = 900,
  minScale = 6,
): View {
  const held = useRef<View | null>(null);

  const fitted = useMemo(() => {
    if (!bounds || w < 40 || h < 40) return held.current;
    return stableFit(bounds, w, h, held.current, { padFrac, maxScale, minScale });
    // `held` is read, never subscribed to — it is the previous committed value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds, w, h, padFrac, maxScale, minScale]);

  const view = (frozen ? held.current : fitted) ?? FALLBACK(w, h);
  held.current = view;
  return view;
}
