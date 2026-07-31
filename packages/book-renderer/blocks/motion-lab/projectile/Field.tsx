'use client';

/*
 * motion-lab/projectile/Field.tsx — the split screen.
 * ─────────────────────────────────────────────────────────────────────────────
 * ONE SVG holds all three views:
 *
 *      ┌────┬──────────────────────────────┐
 *      │ y  │                              │   left gutter  = the VERTICAL movie
 *      │ s  │        the trajectory        │   centre       = the trajectory
 *      │ t  │                              │   bottom band  = the HORIZONTAL movie
 *      ├────┼──────────────────────────────┤
 *      │    │      x strip                 │
 *      └────┴──────────────────────────────┘
 *
 * They share one SVG on purpose. Three separate SVGs in a flex row would drift
 * out of alignment the moment the container resized — and the whole claim of
 * this simulation is that the dot on the side track is EXACTLY level with the
 * ball. That has to be true in pixels, not approximately.
 *
 * ON A PHONE THE STRIPS COMPRESS, THEY DO NOT DISAPPEAR. The gutter/band
 * thickness is a fraction of the canvas (`stripSize`), not a constant, because
 * the left-gutter + bottom-band + centre-trajectory arrangement IS the lesson.
 * Dropping the strips at a breakpoint would leave a phone user looking at an
 * ordinary parabola with nothing to compare it against.
 *
 * Every mark here is placed by `view` (see model.ts), which uses one scale for
 * x and one identical scale for y. A stretched axis would make a 30° launch
 * look like a 60° one and quietly contradict the readout printed beside it.
 *
 * ── LABEL OVERLAP RULE (SIMULATION_DESIGN_WORKFLOW §4E) ─────────────────────
 * This file renders EXACTLY ONE <text> element: the clock riding above the
 * ball. Nothing else on the canvas is text. Every name, value, unit and axis
 * range lives in the colour-keyed legend below, which is why arrows here are
 * free to shrink to nothing or grow off-screen without ever colliding.
 *
 * ── Colour ──────────────────────────────────────────────────────────────────
 * Primary accent (violet) = everything HORIZONTAL. Secondary (sky) = everything
 * VERTICAL. Two accents, both light-tier, and the split is the physics itself.
 * Reference/ghost curves are white at low opacity, never a third hue.
 */

import * as React from 'react';
import { ACCENT, ACCENT_2, TEXT, OK, accentTint } from '../../simulations/_shared';
import { sx, sy, type View } from './model';

export interface Pt { x: number; y: number }

/**
 * Thickness of the gutter and the band, in viewBox px.
 *
 * NOT a constant. A fixed 56 px gutter plus a fixed 56 px band is 12% of a
 * 780 px desktop canvas and 33% of a 340 px phone canvas — the same code that
 * frames the trajectory generously on a laptop strangles it on a phone. The
 * strips are the pedagogical point of this view, so they must compress rather
 * than be dropped; this is the compression law.
 */
export const stripSize = (w: number): number =>
  Math.round(Math.min(56, Math.max(26, w * 0.072)));

export const stripPad = (s: number) => ({ l: s + 10, r: 16, t: 14, b: s + 10 });
export const PLAIN_PAD = { l: 30, r: 16, t: 16, b: 30 };

/**
 * Mark-size multiplier. Radii and stroke widths are quoted at the 780×430
 * reference canvas and scaled from there, with a floor so nothing becomes a
 * pinprick and a ceiling so nothing becomes a blob. The floor is deliberately
 * generous (0.72) — on a phone the marks SHOULD be proportionally larger,
 * because the finger has not shrunk with the screen.
 */
export const uiScale = (w: number, h: number): number =>
  Math.min(1.2, Math.max(0.72, Math.min(w, h) / 430));

// ── primitives ──────────────────────────────────────────────────────────────

const path = (v: View, pts: Pt[], everyNth = 1): string => {
  if (!pts.length) return '';
  let d = '';
  for (let i = 0; i < pts.length; i += everyNth) {
    d += `${i ? 'L' : 'M'}${sx(v, pts[i].x).toFixed(1)},${sy(v, pts[i].y).toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  d += `L${sx(v, last.x).toFixed(1)},${sy(v, last.y).toFixed(1)}`;
  return d;
};

function Arrow({ x1, y1, x2, y2, color, width = 2.5, dashed, opacity = 1 }:
  { x1: number; y1: number; x2: number; y2: number; color: string; width?: number; dashed?: boolean; opacity?: number }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (!Number.isFinite(len) || len < 2) return null;
  const ux = dx / len, uy = dy / len;
  const head = Math.min(10, Math.max(5, len * 0.3));
  const bx = x2 - ux * head, by = y2 - uy * head;
  const px = -uy, py = ux;
  return (
    <g opacity={opacity} style={{ pointerEvents: 'none' }}>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={width} strokeLinecap="round"
        strokeDasharray={dashed ? '5 4' : undefined} />
      <polygon fill={color}
        points={`${x2},${y2} ${bx + px * head * 0.48},${by + py * head * 0.48} ${bx - px * head * 0.48},${by - py * head * 0.48}`} />
    </g>
  );
}

/** A "nice" world-unit grid step giving roughly `want` divisions. */
function niceStep(span: number, want = 8): number {
  const raw = span / Math.max(1, want);
  const mag = 10 ** Math.floor(Math.log10(Math.max(raw, 1e-6)));
  const n = raw / mag;
  return (n >= 5 ? 5 : n >= 2 ? 2 : 1) * mag;
}

// ── the scene payload ───────────────────────────────────────────────────────

export interface FieldPaths {
  /** The whole flight, already in display space (frame + axis rotation applied). */
  live: Pt[];
  /** The part flown so far. */
  trail: Pt[];
  ideal: Pt[] | null;
  partner: Pt[] | null;
  heavy: Pt[] | null;
  dropped: Pt[] | null;
  monkeyPath: Pt[] | null;
  fan: Pt[][];
  envelope: Pt[] | null;
  /** Two points: the ground line, or the incline. */
  surface: [Pt, Pt];
}

export interface FieldMarks {
  launch: Pt;
  ball: Pt;
  /** Velocity and acceleration at the ball, in world units (m/s, m/s²). */
  vel: Pt;
  accel: Pt;
  droppedBall: Pt | null;
  heavyBall: Pt | null;
  partnerBall: Pt | null;
  monkey: Pt | null;
  /** The straight "no-gravity" aim line for monkey & hunter. */
  aim: [Pt, Pt] | null;
  target: Pt | null;
  /** The moving cart, when a translating frame is on offer. */
  cart: Pt | null;
  /** Ball positions at equally spaced times — even along x, bunched along y. */
  equalTime: Pt[];
}

export interface FieldFlags {
  grid: boolean;
  trail: boolean;
  vectors: boolean;
  components: boolean;
  strips: boolean;
  envelope: boolean;
  showFullPath: boolean;
  targetHit: boolean | null;
}

export interface FieldProps {
  view: View;
  paths: FieldPaths;
  marks: FieldMarks;
  flags: FieldFlags;
  /** Gutter/band thickness in viewBox px — see `stripSize`. */
  strip: number;
  /** Mark-size multiplier — see `uiScale`. */
  ui: number;
  /** m/s per pixel for the velocity arrows — one scale for every arrow drawn. */
  vecPxPerUnit: number;
  accelPxPerUnit: number;
  /** The ONE text element on the canvas. */
  clockLabel: string;
  svgRef: React.RefObject<SVGSVGElement | null>;
  onPointerDown: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => void;
  onPointerUp: (e: React.PointerEvent<SVGSVGElement>) => void;
  /** Where the "grab me" halo sits — the tip of the launch arrow. */
  aimTip: Pt | null;
  showGrabHint: boolean;
}

// ── component ───────────────────────────────────────────────────────────────

export default function Field(p: FieldProps) {
  const v = p.view;
  const { paths: q, marks: m, flags: f, strip: STRIP, ui: k } = p;

  const bx = sx(v, m.ball.x), by = sy(v, m.ball.y);
  const gx = niceStep(v.xMax - v.xMin);
  const gy = niceStep(v.yMax - v.yMin);

  const gridLines: React.ReactElement[] = [];
  if (f.grid) {
    for (let x = Math.ceil(v.xMin / gx) * gx; x <= v.xMax; x += gx) {
      gridLines.push(<line key={`gx${x.toFixed(2)}`} x1={sx(v, x)} y1={sy(v, v.yMax)} x2={sx(v, x)} y2={sy(v, v.yMin)}
        stroke="rgba(255,255,255,0.055)" strokeWidth={1} />);
    }
    for (let y = Math.ceil(v.yMin / gy) * gy; y <= v.yMax; y += gy) {
      gridLines.push(<line key={`gy${y.toFixed(2)}`} x1={sx(v, v.xMin)} y1={sy(v, y)} x2={sx(v, v.xMax)} y2={sy(v, y)}
        stroke="rgba(255,255,255,0.055)" strokeWidth={1} />);
    }
  }

  // Velocity + acceleration arrows, one shared px-per-unit scale each.
  const vTip = { x: bx + m.vel.x * p.vecPxPerUnit, y: by - m.vel.y * p.vecPxPerUnit };
  const aTip = { x: bx + m.accel.x * p.accelPxPerUnit, y: by - m.accel.y * p.accelPxPerUnit };

  return (
    <svg
      ref={p.svgRef}
      viewBox={`0 0 ${v.w} ${v.h}`}
      width="100%" height="100%"
      style={{ display: 'block', touchAction: 'none', cursor: p.aimTip ? 'crosshair' : 'default' }}
      onPointerDown={p.onPointerDown}
      onPointerMove={p.onPointerMove}
      onPointerUp={p.onPointerUp}
      onPointerCancel={p.onPointerUp}
    >
      {/* ── grid + surface ─────────────────────────────────────────────── */}
      {gridLines}

      <line x1={sx(v, q.surface[0].x)} y1={sy(v, q.surface[0].y)}
        x2={sx(v, q.surface[1].x)} y2={sy(v, q.surface[1].y)}
        stroke="rgba(255,255,255,0.4)" strokeWidth={2} />

      {/* ── the fan and its bounding parabola ──────────────────────────── */}
      {q.fan.map((pts, i) => (
        <path key={`fan${i}`} d={path(v, pts, 2)} fill="none" stroke={ACCENT} strokeWidth={1.2} opacity={0.28} />
      ))}
      {f.envelope && q.envelope && (
        <path d={path(v, q.envelope)} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={2} strokeDasharray="7 5" />
      )}

      {/* ── reference paths ────────────────────────────────────────────── */}
      {q.ideal && (
        <path d={path(v, q.ideal, 3)} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2} strokeDasharray="6 5" />
      )}
      {q.partner && (
        <path d={path(v, q.partner, 3)} fill="none" stroke={ACCENT} strokeWidth={2} strokeDasharray="6 5" opacity={0.75} />
      )}
      {q.heavy && (
        <path d={path(v, q.heavy, 3)} fill="none" stroke={ACCENT_2} strokeWidth={2} opacity={0.85} />
      )}
      {q.dropped && (
        <path d={path(v, q.dropped, 3)} fill="none" stroke={ACCENT_2} strokeWidth={2} opacity={0.7} />
      )}
      {q.monkeyPath && (
        <path d={path(v, q.monkeyPath, 3)} fill="none" stroke={ACCENT_2} strokeWidth={2} strokeDasharray="4 4" opacity={0.8} />
      )}

      {/* ── the flight ─────────────────────────────────────────────────── */}
      {f.showFullPath && (
        <path d={path(v, q.live, 3)} fill="none" stroke={ACCENT} strokeWidth={1.5} opacity={0.28} />
      )}
      {f.trail && q.trail.length > 1 && (
        <path d={path(v, q.trail, 2)} fill="none" stroke={ACCENT} strokeWidth={3} strokeLinecap="round" />
      )}

      {/* Equal-time stamps. On the field they crowd near the top; on the two
          strips below/left the SAME stamps are even along x and bunched along
          y. That contrast is the lesson, and it is visible before anything
          moves. */}
      {m.equalTime.map((s, i) => (
        <circle key={`et${i}`} cx={sx(v, s.x)} cy={sy(v, s.y)} r={2.4 * k} fill={ACCENT} opacity={0.5} />
      ))}

      {/* ── monkey & hunter extras ─────────────────────────────────────── */}
      {m.aim && (
        <line x1={sx(v, m.aim[0].x)} y1={sy(v, m.aim[0].y)} x2={sx(v, m.aim[1].x)} y2={sy(v, m.aim[1].y)}
          stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} strokeDasharray="3 5" />
      )}
      {m.monkey && (
        <g style={{ pointerEvents: 'none' }}>
          <circle cx={sx(v, m.monkey.x)} cy={sy(v, m.monkey.y)} r={9 * k} fill={accentTint(ACCENT_2, 0.35)} stroke={ACCENT_2} strokeWidth={2} />
        </g>
      )}

      {/* ── target ─────────────────────────────────────────────────────── */}
      {m.target && (
        <g style={{ pointerEvents: 'none' }}>
          <circle cx={sx(v, m.target.x)} cy={sy(v, m.target.y)} r={13 * k} fill="none"
            stroke={f.targetHit ? OK : 'rgba(255,255,255,0.55)'} strokeWidth={2.5} />
          <circle cx={sx(v, m.target.x)} cy={sy(v, m.target.y)} r={4 * k} fill={f.targetHit ? OK : 'rgba(255,255,255,0.55)'} />
        </g>
      )}

      {/* ── the cart (translating-frame scenes) ────────────────────────── */}
      {m.cart && (
        <g style={{ pointerEvents: 'none' }}>
          <rect x={sx(v, m.cart.x) - 17 * k} y={sy(v, m.cart.y) - 9 * k} width={34 * k} height={13 * k} rx={3}
            fill={accentTint(ACCENT, 0.22)} stroke={ACCENT} strokeWidth={1.5} />
          <circle cx={sx(v, m.cart.x) - 9 * k} cy={sy(v, m.cart.y) + 5 * k} r={4 * k} fill="none" stroke={ACCENT} strokeWidth={1.5} />
          <circle cx={sx(v, m.cart.x) + 9 * k} cy={sy(v, m.cart.y) + 5 * k} r={4 * k} fill="none" stroke={ACCENT} strokeWidth={1.5} />
        </g>
      )}

      {/* ── launcher ───────────────────────────────────────────────────── */}
      <g style={{ pointerEvents: 'none' }}>
        <rect x={sx(v, m.launch.x) - 7 * k} y={sy(v, m.launch.y) - 4 * k} width={14 * k} height={8 * k} rx={2}
          fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
        {m.launch.y > q.surface[0].y + 1e-6 && (
          <line x1={sx(v, m.launch.x)} y1={sy(v, m.launch.y) + 4 * k} x2={sx(v, m.launch.x)} y2={sy(v, 0)}
            stroke="rgba(255,255,255,0.22)" strokeWidth={3} />
        )}
      </g>

      {/* ── companion balls ────────────────────────────────────────────── */}
      {m.droppedBall && <circle cx={sx(v, m.droppedBall.x)} cy={sy(v, m.droppedBall.y)} r={6 * k} fill={ACCENT_2} opacity={0.9} />}
      {m.heavyBall && <circle cx={sx(v, m.heavyBall.x)} cy={sy(v, m.heavyBall.y)} r={8 * k} fill={ACCENT_2} opacity={0.9} />}
      {m.partnerBall && <circle cx={sx(v, m.partnerBall.x)} cy={sy(v, m.partnerBall.y)} r={5.5 * k} fill={ACCENT} opacity={0.6} />}

      {/* ── shadow guides: the ball projected onto both strips ─────────── */}
      {f.strips && (
        <g style={{ pointerEvents: 'none' }}>
          <line x1={bx} y1={by} x2={bx} y2={v.h - STRIP / 2} stroke={ACCENT} strokeWidth={1} strokeDasharray="2 4" opacity={0.5} />
          <line x1={bx} y1={by} x2={STRIP / 2} y2={by} stroke={ACCENT_2} strokeWidth={1} strokeDasharray="2 4" opacity={0.5} />
        </g>
      )}

      {/* ── component + velocity + acceleration arrows ─────────────────── */}
      {f.components && (
        <g style={{ pointerEvents: 'none' }}>
          <Arrow x1={bx} y1={by} x2={bx + m.vel.x * p.vecPxPerUnit} y2={by} color={ACCENT} width={2.5} />
          <Arrow x1={bx} y1={by} x2={bx} y2={by - m.vel.y * p.vecPxPerUnit} color={ACCENT_2} width={2.5} />
          <line x1={bx + m.vel.x * p.vecPxPerUnit} y1={by} x2={vTip.x} y2={vTip.y}
            stroke={ACCENT_2} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
          <line x1={bx} y1={by - m.vel.y * p.vecPxPerUnit} x2={vTip.x} y2={vTip.y}
            stroke={ACCENT} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
        </g>
      )}
      {f.vectors && (
        <>
          <Arrow x1={bx} y1={by} x2={vTip.x} y2={vTip.y} color="rgba(255,255,255,0.85)" width={3} />
          <Arrow x1={bx} y1={by} x2={aTip.x} y2={aTip.y} color={ACCENT_2} width={2} dashed opacity={0.9} />
        </>
      )}

      {/* ── the ball ───────────────────────────────────────────────────── */}
      <circle cx={bx} cy={by} r={7 * k} fill={ACCENT} stroke="rgba(255,255,255,0.85)" strokeWidth={1.5} />

      {/* ── the launch arrow ───────────────────────────────────────────────
          The handle has to hang off SOMETHING. Previously the only shaft under
          it was the live velocity arrow, which (a) leaves the launch point the
          instant the flight starts and (b) vanishes entirely when the student
          turns "v and a arrows" off — leaving the sidebar telling them to
          "drag the handle at the tip of the launch arrow" while a bare circle
          floats in empty space. Design law #1 says the primary gesture is
          grabbing this vector, so the vector is drawn unconditionally.
          White, like the live velocity arrow, because it IS the velocity — the
          one at t = 0. Faint so it never competes with the live one, which it
          sits exactly under while the flight has not started. */}
      {p.aimTip && (
        <Arrow x1={sx(v, m.launch.x)} y1={sy(v, m.launch.y)}
          x2={sx(v, p.aimTip.x)} y2={sy(v, p.aimTip.y)}
          color="rgba(255,255,255,0.45)" width={2.5} />
      )}

      {/* ── the aim handle ─────────────────────────────────────────────── */}
      {p.aimTip && (
        <g>
          {p.showGrabHint && (
            <circle cx={sx(v, p.aimTip.x)} cy={sy(v, p.aimTip.y)} r={15 * k} fill="none" stroke={ACCENT} strokeWidth={2} opacity={0.55}>
              <animate attributeName="r" values={`${12 * k};${19 * k};${12 * k}`} dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.12;0.6" dur="1.6s" repeatCount="indefinite" />
            </circle>
          )}
          <circle cx={sx(v, p.aimTip.x)} cy={sy(v, p.aimTip.y)} r={7.5 * k} fill={accentTint(ACCENT, 0.85)}
            stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} style={{ cursor: 'grab' }} />
        </g>
      )}

      {/* ══ THE ONE TEXT ELEMENT ON THIS CANVAS (§4E) ══════════════════════
          It rides with the ball, so it cannot collide with anything: there is
          nothing else here to collide WITH. Every other value is in the legend.
          The floor of 11 px is the §2 minimum-readable rule: the viewBox is now
          in CSS pixels, so this number is what the student's eye actually gets. */}
      <text x={bx + 12 * k} y={by - 12 * k} fill={TEXT.primary} fontSize={Math.max(11, Math.round(12 * k))} fontWeight={600}
        className="tabular-nums" style={{ pointerEvents: 'none' }}>
        {p.clockLabel}
      </text>

      {/* ── the two 1-D movies ─────────────────────────────────────────── */}
      {f.strips && <VerticalStrip view={v} ball={m.ball} equalTime={m.equalTime} step={gy} strip={STRIP} k={k} />}
      {f.strips && <HorizontalStrip view={v} ball={m.ball} equalTime={m.equalTime} step={gx} strip={STRIP} k={k} />}
    </svg>
  );
}

// ── the strips ──────────────────────────────────────────────────────────────

/**
 * The VERTICAL movie: an ordinary throw, straight up and back down. Its dot is
 * placed with the same `sy()` as the ball, so it is always exactly level with
 * it — that pixel-level agreement is the argument the sim is making.
 */
function VerticalStrip({ view, ball, equalTime, step, strip, k }:
  { view: View; ball: Pt; equalTime: Pt[]; step: number; strip: number; k: number }) {
  const cx = strip / 2;
  const top = sy(view, view.yMax);
  const bot = sy(view, view.yMin);
  const tick = Math.max(3, 5 * k);
  const ticks: React.ReactElement[] = [];
  for (let y = Math.ceil(view.yMin / step) * step; y <= view.yMax; y += step) {
    ticks.push(<line key={y.toFixed(2)} x1={cx - tick} y1={sy(view, y)} x2={cx + tick} y2={sy(view, y)}
      stroke="rgba(255,255,255,0.18)" strokeWidth={1} />);
  }
  return (
    <g style={{ pointerEvents: 'none' }}>
      <rect x={2} y={top - 8} width={strip - 6} height={bot - top + 16} rx={8}
        fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      <line x1={cx} y1={top} x2={cx} y2={bot} stroke="rgba(255,255,255,0.28)" strokeWidth={1.5} />
      {ticks}
      <line x1={cx} y1={sy(view, 0)} x2={cx} y2={sy(view, ball.y)} stroke={ACCENT_2} strokeWidth={5 * k}
        strokeLinecap="round" opacity={0.35} />
      {equalTime.map((s, i) => (
        <circle key={i} cx={cx} cy={sy(view, s.y)} r={2.6 * k} fill={ACCENT_2} opacity={0.55} />
      ))}
      <circle cx={cx} cy={sy(view, ball.y)} r={7 * k} fill={ACCENT_2} stroke="rgba(255,255,255,0.85)" strokeWidth={1.5} />
    </g>
  );
}

/**
 * The HORIZONTAL movie: constant velocity, forever. Its equal-time stamps are
 * evenly spaced — put beside the vertical strip's bunched ones, that is the
 * clearest statement of independence the sim can make, and it is true even
 * while nothing is moving.
 */
function HorizontalStrip({ view, ball, equalTime, step, strip, k }:
  { view: View; ball: Pt; equalTime: Pt[]; step: number; strip: number; k: number }) {
  const cy = view.h - strip / 2;
  const left = sx(view, view.xMin);
  const right = sx(view, view.xMax);
  const tick = Math.max(3, 5 * k);
  const ticks: React.ReactElement[] = [];
  for (let x = Math.ceil(view.xMin / step) * step; x <= view.xMax; x += step) {
    ticks.push(<line key={x.toFixed(2)} x1={sx(view, x)} y1={cy - tick} x2={sx(view, x)} y2={cy + tick}
      stroke="rgba(255,255,255,0.18)" strokeWidth={1} />);
  }
  return (
    <g style={{ pointerEvents: 'none' }}>
      <rect x={left - 8} y={view.h - strip + 2} width={right - left + 16} height={strip - 6} rx={8}
        fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      <line x1={left} y1={cy} x2={right} y2={cy} stroke="rgba(255,255,255,0.28)" strokeWidth={1.5} />
      {ticks}
      <line x1={sx(view, 0)} y1={cy} x2={sx(view, ball.x)} y2={cy} stroke={ACCENT} strokeWidth={5 * k}
        strokeLinecap="round" opacity={0.35} />
      {equalTime.map((s, i) => (
        <circle key={i} cx={sx(view, s.x)} cy={cy} r={2.6 * k} fill={ACCENT} opacity={0.55} />
      ))}
      <circle cx={sx(view, ball.x)} cy={cy} r={7 * k} fill={ACCENT} stroke="rgba(255,255,255,0.85)" strokeWidth={1.5} />
    </g>
  );
}

// ── graph-mode strips (rendered below the canvas, not inside it) ─────────────

/**
 * A value-against-time mini plot for a `mode: 'graph'` strip. Separate SVG
 * because it is a time series, not a spatial shadow — nothing needs to line up
 * with the field. Still zero text inside: the label and the live value are HTML
 * above it.
 */
export function GraphStrip({ series, tNow, accent, height = 74 }:
  { series: { t: number; v: number }[]; tNow: number; accent: string; height?: number }) {
  const W = 300, H = height, PAD = 8;
  if (series.length < 2) return null;
  const tMax = Math.max(series[series.length - 1].t, 1e-6);
  let lo = Infinity, hi = -Infinity;
  for (const s of series) { lo = Math.min(lo, s.v); hi = Math.max(hi, s.v); }
  if (hi - lo < 1e-6) { hi = lo + 1; lo -= 1; }
  const px = (t: number) => PAD + (t / tMax) * (W - 2 * PAD);
  const py = (val: number) => H - PAD - ((val - lo) / (hi - lo)) * (H - 2 * PAD);
  const d = series.map((s, i) => `${i ? 'L' : 'M'}${px(s.t).toFixed(1)},${py(s.v).toFixed(1)}`).join(' ');
  const cur = series.reduce((b, s) => (Math.abs(s.t - tNow) < Math.abs(b.t - tNow) ? s : b), series[0]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height, display: 'block' }}>
      {lo < 0 && hi > 0 && (
        <line x1={PAD} y1={py(0)} x2={W - PAD} y2={py(0)} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      )}
      <path d={d} fill="none" stroke={accent} strokeWidth={2} opacity={0.55} />
      <path d={series.filter((s) => s.t <= tNow).map((s, i) => `${i ? 'L' : 'M'}${px(s.t).toFixed(1)},${py(s.v).toFixed(1)}`).join(' ')}
        fill="none" stroke={accent} strokeWidth={2.5} />
      <circle cx={px(cur.t)} cy={py(cur.v)} r={4} fill={accent} />
    </svg>
  );
}
