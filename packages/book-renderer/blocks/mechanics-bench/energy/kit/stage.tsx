'use client';

/*
 * energy/kit/stage.tsx — the measurement + camera layer, reused not rebuilt.
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠ THIS FILE DELIBERATELY OWNS ALMOST NOTHING. Everything below is
 * re-exported from `../../fbd/canvas` and `../../lib/svg`.
 *
 * WHY. `fbd/canvas.tsx` is ~290 lines of hard-won, browser-measured behaviour:
 * a CALLBACK ref so a remounted node cannot leave the observer watching a
 * detached element; a viewBox that IS the measured CSS-pixel box, so one unit is
 * one pixel and nothing can letterbox or crop; a stage split driven by the
 * measured CONTAINER width rather than a viewport media query, with an
 * UNMEASURED width counted as NARROW; and a camera with hysteresis that freezes
 * while a handle is being dragged. Each of those is a defect a browser QA pass
 * found and fixed once. Re-implementing them under `energy/` would mean
 * re-earning all of it, and the two engines would drift the moment one was
 * touched.
 *
 * So Phase 2 imports them, and this module is the ONE import site — if
 * `fbd/canvas` ever moves, exactly one file changes.
 *
 * The single thing this file adds is `Board`: the <svg> shape every Phase-2
 * bench uses, so no bench hand-rolls a viewBox.
 */

import * as React from 'react';
import {
  useBoxSize, useStageBox, StagePanels, useFittedView, boardSvgStyle, HIT,
  isNarrowStage, NARROW_PX, FIT_PAD,
} from '../../fbd/canvas';
import type { BoxRef, BoxSize, StageBox } from '../../fbd/canvas';
import { fitView, stableFit, boundsOf, padBounds, unionBounds, worldToScreen, screenToWorld } from '../../lib/svg';
import type { Bounds, View } from '../../lib/svg';
import { CANVAS_STYLE } from './theme';

export {
  useBoxSize, useStageBox, StagePanels, useFittedView, boardSvgStyle, HIT,
  isNarrowStage, NARROW_PX, FIT_PAD,
  fitView, stableFit, boundsOf, padBounds, unionBounds, worldToScreen, screenToWorld,
};
export type { BoxRef, BoxSize, StageBox, Bounds, View };

/**
 * The one <svg> shape every Phase-2 board uses.
 *
 * `viewBox` is the measured pixel box, so a radius written here is a radius in
 * CSS pixels at every camera zoom — which is what keeps a 44 px hit target 44 px
 * after the camera zooms out to fit a longer track.
 */
export const Board = React.forwardRef<SVGSVGElement, {
  w: number; h: number; children: React.ReactNode;
  onPointerDown?: (e: React.PointerEvent) => void;
}>(function Board({ w, h, children, onPointerDown }, ref) {
  return (
    <svg ref={ref} viewBox={`0 0 ${Math.max(1, w)} ${Math.max(1, h)}`}
      style={boardSvgStyle} onPointerDown={onPointerDown}>
      {children}
    </svg>
  );
});

/**
 * `useFittedView` for scenes measured in MILLIONS of metres.
 *
 * ⚠ WHY THIS EXISTS. `fitView` quantises the scale onto a 1% ladder —
 * `Math.round(scale * 100) / 100` — so a slider nudge rescales the diagram in
 * visible steps instead of shimmering every frame. That is exactly right for a
 * bench spanning a few metres, where the scale is 60–90 px/m.
 *
 * It is catastrophic for a planetary scene. Fitting a 16 000 km box into a
 * 460 px board needs 0.0000229 px/m, and `Math.round(0.00229) / 100` is **0** —
 * every point maps to the centre of the board and the Orbit Sandbox renders as a
 * single dot. Verified by execution, not by reading: `verify-mechanics-phase2`
 * §14 asserts both halves of it so the trap cannot come back.
 *
 * `fbd/canvas.useFittedView` bakes the quantisation in and Phase 2 does not own
 * that file, so this is the same contract with `quantise: false`, plus the same
 * two pieces of restraint: `stableFit` hysteresis, and a hard freeze while a
 * handle is under the finger.
 */
export function useFreeView(
  bounds: Bounds | null,
  w: number,
  h: number,
  frozen = false,
  opts: { padFrac?: number; maxScale?: number; minScale?: number } = {},
): View {
  const { padFrac = 0.06, maxScale = 1e9, minScale = 1e-12 } = opts;
  const held = React.useRef<View | null>(null);

  const fitted = React.useMemo(() => {
    if (!bounds || w < 40 || h < 40) return held.current;
    return stableFit(bounds, w, h, held.current, { padFrac, maxScale, minScale, quantise: false });
    // `held` is read, never subscribed to — it is the previous committed value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds, w, h, padFrac, maxScale, minScale]);

  const view = (frozen ? held.current : fitted)
    ?? { cx: 0, cy: 0, scale: 1, w: Math.max(1, w), h: Math.max(1, h) };
  held.current = view;
  return view;
}

/**
 * The layout every Phase-2 bench uses: board on the left, panels on the right,
 * stacked into one column below a MEASURED 640 px container width.
 *
 * ⚠ THE GUIDED PANEL AND THE PREDICT GATE MOVE ABOVE THE BOARD WHEN STACKED.
 * That is not cosmetic. While the guided ladder runs, the action buttons are
 * disabled and the ONLY thing that enables them is the CTA inside the guided
 * panel — so if that panel sat below the board, the legend and the controls, the
 * first thing a phone student would meet is a dead button with its revival
 * off-screen, which reads as "the sim is broken". The same argument applies to
 * the predict gate: "commit before you look" only works if the question is above
 * the thing you must not look at yet.
 *
 * This is `StagePanels` plus that hoist. It does not call `StagePanels` because
 * that component has no above-the-board slot, and adding one would mean editing
 * a shipped file Phase 2 does not own.
 */
export function BenchFrame({ box, aspect, narrowAspect, minHeight = 250, maxHeight = 470, hoist, panels, footer, children }: {
  box: StageBox;
  /** CSS aspect-ratio string for the board on a wide stage. */
  aspect: string;
  /** …and on a narrow one. Taller, because the column is the whole width. */
  narrowAspect?: string;
  minHeight?: number;
  maxHeight?: number;
  /** Guided panel + predict gate. Above the board when stacked. */
  hoist?: React.ReactNode;
  panels?: React.ReactNode;
  footer?: React.ReactNode;
  /** The <svg>. Render it only when `box.ready`. */
  children: React.ReactNode;
}) {
  const { narrow } = box;
  return (
    <div ref={box.rootRef} style={{ width: '100%' }}>
      {narrow && hoist && <div className="mb-3 flex flex-col gap-3">{hoist}</div>}
      <div className="grid gap-4"
        style={{
          gridTemplateColumns: narrow ? 'minmax(0, 1fr)' : 'minmax(0, 7fr) minmax(0, 5fr)',
          alignItems: 'start',
        }}>
        <div className="flex min-w-0 flex-col gap-2">
          <div ref={box.boxRef} className="relative overflow-hidden"
            style={{
              ...CANVAS_STYLE,
              width: '100%',
              aspectRatio: narrow ? (narrowAspect ?? aspect) : aspect,
              minHeight,
              maxHeight,
            }}>
            {children}
          </div>
          {footer}
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          {!narrow && hoist}
          {panels}
        </div>
      </div>
    </div>
  );
}

/**
 * Bounds of a list of world points, padded by a fraction of the larger span.
 *
 * Fitting to the raw content leaves arrowheads and body radii poking over the
 * edge; padding by a FRACTION rather than a fixed number of metres keeps the fit
 * honest across scenes that span 6 m and scenes that span 14 000 km.
 */
export function fitBounds(points: { x: number; y: number }[], padFrac = 0.08): Bounds | null {
  const b = boundsOf(points);
  if (!b) return null;
  const span = Math.max(b.maxX - b.minX, b.maxY - b.minY, 1e-9);
  return padBounds(b, span * padFrac);
}
