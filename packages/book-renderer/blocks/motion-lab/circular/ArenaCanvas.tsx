'use client';

/*
 * motion-lab/circular/ArenaCanvas.tsx — the main circle scene.
 * ─────────────────────────────────────────────────────────────────────────────
 * One SVG, fixed viewBox, explicit pixel height. It is NEVER height:100% inside
 * the flex row: a sidebar that grows by one line would then resize the canvas
 * and the circle would visibly breathe while a student drags it.
 *
 * THE FRAME TRICK. Everything in the world lives inside one <g rotate(A)> about
 * the centre. In the ground frame A = 0. In the rotating frame A cancels the
 * ball's angular travel, so the BALL sits still and the landmark ticks sweep
 * past — which is exactly what a rotating observer sees. The same transform
 * keeps running on the frame's own clock after a release, so a ball cut loose
 * traces a genuine spiral in the rotating frame instead of a faked one.
 *
 * LABELS (§4E). Exactly ONE <text> element on this canvas: the state word. Every
 * arrow is colour-keyed and named in the <Legend> below the canvas, never in
 * place — overlapping in-canvas labels are the recurring bug class this rule
 * exists to kill.
 */

import * as React from 'react';
import { useRef } from 'react';
import type { CircularSpec, MotionState } from '../types';
import { posAt, tangentAt, inwardAt, dirOf, readout } from '../lib/circular';
import { TEXT, BORDER, SIM_CANVAS_BG, accentTint } from '../../simulations/_shared';
import { Arrow, MOTION, FORCE, GHOST, VIEW, project, type Screen } from './parts';
import { useStageWidth, stageHeight } from './useStageWidth';

export interface ArenaLayers {
  string: boolean;
  velocity: boolean;
  centripetal: boolean;
  tangential: boolean;
  total: boolean;
  agent: boolean;
  weight: boolean;
  centrifugal: boolean;
  trail: boolean;
  landmarks: boolean;
}

export const NO_LAYERS: ArenaLayers = {
  string: false, velocity: false, centripetal: false, tangential: false,
  total: false, agent: false, weight: false, centrifugal: false,
  trail: false, landmarks: true,
};

export const ALL_LAYERS: ArenaLayers = {
  string: true, velocity: true, centripetal: true, tangential: false,
  total: false, agent: false, weight: false, centrifugal: false,
  trail: true, landmarks: true,
};

interface Props {
  spec: CircularSpec;
  /** Angular position from the TOP, radians, increasing along the motion. */
  theta: number;
  g: number;
  rotating: boolean;
  /** Degrees the world group is rotated by — see "the frame trick" above. */
  frameRotDeg: number;
  layers: ArenaLayers;
  trail: { x: number; y: number }[];
  /** The post-release path, in world metres, from the projectile integrator. */
  flight: MotionState[] | null;
  flightIndex: number;
  /** The ONE text element on the canvas. */
  status: string;
  /** Called on pointer drag. Never gated on the animation clock. */
  onScrub?: (theta: number) => void;
  height: number;
}

/**
 * Arrow lengths are in SCREEN PIXELS — a fraction of a fixed `maxPx`, never a
 * world-space multiple of the quantity. That is not a preference: `centrifuge`
 * runs at a_c ≈ 157 914 m/s² and `uniform-basics` at 0.04 m/s², so any
 * world-scaled arrow either shoots several screens off-canvas or disappears.
 *
 * The floor matters as much as the cap. Below ~1.5 px there is genuinely
 * nothing to draw (a slack string really is pulling with nothing), but anything
 * above that is lifted clear of the 12 px ball so a small-but-real quantity
 * reads as small rather than as absent.
 */
const ARROW_MIN_PX = 13;
const arrowPx = (value: number, reference: number, maxPx: number): number => {
  if (!Number.isFinite(value) || reference <= 0) return 0;
  const raw = (Math.abs(value) / reference) * maxPx;
  if (raw < 1.5) return 0;
  return Math.min(maxPx * 1.35, Math.max(ARROW_MIN_PX, raw));
};

/**
 * How far a guide ray from `p` in screen direction `(ux, uy)` can run before it
 * leaves the viewBox.
 *
 * The tangent and radial guide lines used to be drawn a whole `VIEW.w` long,
 * which put geometry a full canvas-width outside the viewBox. Nothing was ever
 * visible there — the SVG viewport clips it — but it inflated the canvas's own
 * content box to 2.0× the viewBox width and made every automated fill/overflow
 * sweep unreadable. Stopping the ray at the edge draws exactly the same picture
 * and leaves the content box honest.
 */
const rayToEdge = (p: Screen, ux: number, uy: number): number => {
  let t = Math.hypot(VIEW.w, VIEW.h);
  if (ux > 1e-6) t = Math.min(t, (VIEW.w - p.x) / ux);
  else if (ux < -1e-6) t = Math.min(t, -p.x / ux);
  if (uy > 1e-6) t = Math.min(t, (VIEW.h - p.y) / uy);
  else if (uy < -1e-6) t = Math.min(t, -p.y / uy);
  return Math.max(0, t);
};

export default function ArenaCanvas({
  spec, theta, g, rotating, frameRotDeg, layers, trail, flight, flightIndex,
  status, onScrub, height,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragging = useRef(false);
  const [wrapRef, stageW] = useStageWidth<HTMLDivElement>();
  // A fixed-height stage letterboxes the moment the container is narrower than
  // the viewBox — on a phone that is a small circle floating in a tall empty
  // box. Cap the height at the container's own aspect ratio instead.
  const h = stageHeight(stageW, VIEW.w, VIEW.h, height);

  const r = spec.radius;
  const vertical = spec.plane === 'vertical';
  const dir = dirOf(spec);
  const rd = readout(spec, theta, g);

  // ── Fit ────────────────────────────────────────────────────────────────────
  // The world half-width must cover the circle, the arrows hanging off it, and
  // whatever the flight path reaches — computed once per render from the FULL
  // flight, never from the currently-drawn prefix, so the view does not zoom
  // out frame by frame while the ball is in the air.
  let reachX = r * 1.5;
  let reachYUp = r * 1.4;
  let reachYDown = vertical ? r * 1.85 : r * 1.4;
  if (flight && flight.length) {
    for (const p of flight) {
      reachX = Math.max(reachX, Math.abs(p.pos.x) + r * 0.15);
      reachYUp = Math.max(reachYUp, p.pos.y + r * 0.15);
      reachYDown = Math.max(reachYDown, -p.pos.y + r * 0.15);
    }
  }
  const pad = 26;
  const scale = Math.max(
    6,
    Math.min(
      (VIEW.w / 2 - pad) / reachX,
      (VIEW.h - 2 * pad) / (reachYUp + reachYDown)
    )
  );
  const cx = VIEW.w / 2;
  const cy = pad + reachYUp * scale;
  const to = (p: { x: number; y: number }): Screen => project(p, cx, cy, scale);

  const centre: Screen = { x: cx, y: cy };
  const ballWorld = posAt(spec, theta, { x: 0, y: 0 });
  const ball = to(ballWorld);
  const flying = !!flight && flight.length > 0;
  const flyState = flying ? flight[Math.min(flightIndex, flight.length - 1)] : null;
  const flyPt = flyState ? to(flyState.pos) : null;

  const tan = tangentAt(spec, theta);
  const inw = inwardAt(spec, theta);

  // ── Reference lengths ──────────────────────────────────────────────────────
  // Every arrow of the same physical kind is drawn against the SAME reference,
  // and that reference is the maximum the quantity reaches ANYWHERE on this
  // motion — not its value at this instant.
  //
  // That distinction is the whole bug. Taking the reference from the current
  // instant (`max(rd.speed, …)`) makes the ratio identically 1, so the arrow is
  // pinned at full length however the number moves: a vertical circle's tension
  // arrow stayed the same size from the bottom (largest) to the top (smallest,
  // sometimes zero), silently contradicting the readout next to it. Sampling
  // the whole revolution once per configuration fixes it, and costs 48 pure
  // function calls when a slider moves — not per frame.
  const refs = React.useMemo(() => {
    let v = 0, a = 0, f = 0;
    for (let i = 0; i < 48; i++) {
      const s = readout(spec, (i / 48) * 2 * Math.PI, g);
      if (!Number.isFinite(s.speed)) continue;
      v = Math.max(v, s.speed);
      a = Math.max(a, s.centripetal, Math.abs(s.total));
      f = Math.max(f, Math.abs(s.agentForce));
    }
    return {
      v: Math.max(v, Math.abs(spec.omega) * spec.radius, 1e-6),
      a: Math.max(a, 1e-6),
      // Weight rides the force scale too, so it has to be in the running for
      // that reference — otherwise a heavy bob's weight arrow runs off-canvas,
      // and the tension-vs-weight comparison (the whole vertical-circle
      // argument) is between two arrows on different scales.
      f: Math.max(f, spec.mass * g, 1e-6),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec.radius, spec.mass, spec.omega, spec.plane, spec.agent,
    spec.bankDeg, spec.mu_s, spec.alphaTangential, g]);

  const vRef = refs.v;
  const aRef = refs.a;
  const fRef = refs.f;
  const V_PX = 78;
  const A_PX = 68;

  const tip = (unit: { x: number; y: number }, px: number): Screen => ({
    x: ball.x + unit.x * px,
    y: ball.y - unit.y * px,
  });

  // Tangential acceleration points along the motion when positive, against it
  // when negative — drawing it always-forward would be a lie the student can
  // see through the moment they set a negative alpha.
  const tanSign = rd.tangential >= 0 ? 1 : -1;
  const totalUnit = (() => {
    const vx = inw.x * rd.centripetal + tan.x * rd.tangential;
    const vy = inw.y * rd.centripetal + tan.y * rd.tangential;
    const m = Math.hypot(vx, vy) || 1;
    return { x: vx / m, y: vy / m };
  })();

  // ── Pointer scrub ──────────────────────────────────────────────────────────
  // Pointer events (not mouse events) so it works on a phone, and NOT gated on
  // whether the animation is running — a previous sim shipped with its drag
  // silently dead because the handler checked an animation flag first.
  const clientToView = (clientX: number, clientY: number): Screen | null => {
    const el = svgRef.current;
    if (!el) return null;
    const box = el.getBoundingClientRect();
    if (!box.width || !box.height) return null;
    const k = Math.min(box.width / VIEW.w, box.height / VIEW.h);
    const offX = (box.width - VIEW.w * k) / 2;
    const offY = (box.height - VIEW.h * k) / 2;
    return { x: (clientX - box.left - offX) / k, y: (clientY - box.top - offY) / k };
  };

  const scrubTo = (clientX: number, clientY: number) => {
    if (!onScrub) return;
    const v = clientToView(clientX, clientY);
    if (!v) return;
    // Undo the world rotation before reading the angle, or dragging in the
    // rotating frame would fight the transform.
    const a = (-frameRotDeg * Math.PI) / 180;
    const rx = v.x - cx;
    const ry = v.y - cy;
    const ux = rx * Math.cos(a) - ry * Math.sin(a);
    const uy = rx * Math.sin(a) + ry * Math.cos(a);
    const px = ux / scale;
    const py = -uy / scale;
    const th = Math.atan2(-dir * px, py);
    onScrub(((th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI));
  };

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!onScrub || flying) return;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    scrubTo(e.clientX, e.clientY);
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    scrubTo(e.clientX, e.clientY);
  };
  const onUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already released */ }
  };

  // ── Ground line, for vertical circles ──────────────────────────────────────
  const groundY = -reachYDown + r * 0.1;

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden rounded-2xl"
      style={{ height: h, background: SIM_CANVAS_BG, border: `1px solid ${BORDER.card}` }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height={h}
        style={{ display: 'block', touchAction: 'none', cursor: onScrub && !flying ? 'grab' : 'default' }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <g transform={`rotate(${frameRotDeg} ${cx} ${cy})`}>
          {/* Ground. Spans the viewBox and no further: a vertical circle never
              offers the frame toggle (gravity is in the drawing plane), so
              `frameRotDeg` is always 0 here and there is nothing to cover. */}
          {vertical && (
            <line
              x1={0} y1={to({ x: 0, y: groundY }).y}
              x2={VIEW.w} y2={to({ x: 0, y: groundY }).y}
              stroke="rgba(226,232,240,0.22)" strokeWidth={2}
            />
          )}

          {/* The path */}
          <circle
            cx={cx} cy={cy} r={r * scale}
            fill="none" stroke={accentTint(MOTION, 0.32)} strokeWidth={1.5} strokeDasharray="7 6"
          />

          {/* Landmark ticks — without these a rotating frame looks identical to a
              still one, and the whole toggle would teach nothing. */}
          {layers.landmarks && Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * 2 * Math.PI;
            const inner = r * scale + 4;
            const outer = r * scale + (i === 0 ? 16 : 10);
            return (
              <line
                key={i}
                x1={cx + Math.sin(a) * inner} y1={cy - Math.cos(a) * inner}
                x2={cx + Math.sin(a) * outer} y2={cy - Math.cos(a) * outer}
                stroke={i === 0 ? accentTint(MOTION, 0.75) : 'rgba(226,232,240,0.22)'}
                strokeWidth={i === 0 ? 3 : 1.5} strokeLinecap="round"
              />
            );
          })}

          {/* Centre */}
          <circle cx={cx} cy={cy} r={4} fill={TEXT.muted} />

          {/* The string / rod */}
          {layers.string && !flying && (
            <line
              x1={centre.x} y1={centre.y} x2={ball.x} y2={ball.y}
              stroke={rd.released ? GHOST : 'rgba(226,232,240,0.5)'}
              strokeWidth={spec.agent === 'rod' ? 4 : 2}
              strokeDasharray={rd.released ? '4 6' : undefined}
            />
          )}

          {/* Trail */}
          {layers.trail && trail.map((p, i) => {
            const s = to(p);
            return (
              <circle key={i} cx={s.x} cy={s.y} r={2.6} fill={MOTION}
                opacity={((i + 1) / trail.length) * 0.5} />
            );
          })}

          {/* Post-release flight path + the ball in the air */}
          {flying && flyPt && (
            <>
              <polyline
                points={flight!.slice(0, Math.max(2, flightIndex + 1)).map((p) => {
                  const s = to(p.pos);
                  return `${s.x},${s.y}`;
                }).join(' ')}
                fill="none" stroke={MOTION} strokeWidth={2.5} strokeLinecap="round" opacity={0.85}
              />
              {/* The tangent it left along, extended — the line the student did
                  NOT predict, kept on screen next to the real curved path. */}
              <line
                x1={ball.x} y1={ball.y}
                x2={ball.x + tan.x * rayToEdge(ball, tan.x, -tan.y)}
                y2={ball.y - tan.y * rayToEdge(ball, tan.x, -tan.y)}
                stroke={MOTION} strokeWidth={1.5} strokeDasharray="8 7" opacity={0.4}
              />
              {/* The radially-outward line they probably DID predict. */}
              <line
                x1={ball.x} y1={ball.y}
                x2={ball.x - inw.x * rayToEdge(ball, -inw.x, inw.y)}
                y2={ball.y + inw.y * rayToEdge(ball, -inw.x, inw.y)}
                stroke={GHOST} strokeWidth={1.5} strokeDasharray="3 8" opacity={0.5}
              />
              <circle cx={flyPt.x} cy={flyPt.y} r={11} fill={accentTint(MOTION, 0.9)}
                stroke={MOTION} strokeWidth={2} />
            </>
          )}

          {/* ── Arrows on the body ── */}
          {!flying && (
            <>
              {/* The body sits UNDER its own arrows. Drawn on top (as it was) a
                  12 px ball swallows the first 12 px of every arrow, so a small
                  quantity looked like no quantity at all. */}
              <circle cx={ball.x} cy={ball.y} r={12}
                fill={accentTint(MOTION, 0.9)} stroke={MOTION} strokeWidth={2} />

              {layers.weight && (
                <Arrow from={ball} to={tip({ x: 0, y: -1 }, arrowPx(spec.mass * g, fRef, A_PX))}
                  color={GHOST} width={3} />
              )}
              {/* The agent force and the centripetal acceleration are parallel
                  by construction, so drawing both at the same weight hid one
                  inside the other. The force goes down first as a broad shaft;
                  the acceleration rides on top of it, thinner. Two heads at two
                  distances, one ray — still exactly aligned, now countable. */}
              {layers.agent && (
                <Arrow
                  from={ball}
                  to={tip(
                    rd.agentForce >= 0 ? inw : { x: -inw.x, y: -inw.y },
                    arrowPx(rd.agentForce, fRef, A_PX)
                  )}
                  color={FORCE} width={5} opacity={0.5}
                />
              )}
              {layers.centripetal && (
                <Arrow from={ball} to={tip(inw, arrowPx(rd.centripetal, aRef, A_PX))}
                  color={FORCE} width={3} />
              )}
              {layers.tangential && Math.abs(rd.tangential) > 1e-6 && (
                <Arrow
                  from={ball}
                  to={tip({ x: tan.x * tanSign, y: tan.y * tanSign }, arrowPx(rd.tangential, aRef, A_PX))}
                  color={FORCE} width={3} dashed
                />
              )}
              {layers.total && rd.total > 1e-6 && (
                <Arrow from={ball} to={tip(totalUnit, arrowPx(rd.total, aRef, A_PX))}
                  color={FORCE} width={2} opacity={0.55} />
              )}
              {layers.velocity && (
                <Arrow from={ball} to={tip(tan, arrowPx(rd.speed, vRef, V_PX))}
                  color={MOTION} width={3.5} />
              )}
              {/* Centrifugal — drawn ONLY when the student has chosen a rotating
                  frame. Dashed, because it has no agent: nothing is pushing. */}
              {rotating && layers.centrifugal && (
                <Arrow from={ball} to={tip({ x: -inw.x, y: -inw.y }, arrowPx(rd.centripetal, aRef, A_PX))}
                  color={FORCE} width={3} dashed opacity={0.9} />
              )}
            </>
          )}
        </g>

        {/* The ONE text element on this canvas (§4E). */}
        <text
          x={14} y={24}
          fill={rd.released || flying ? FORCE : TEXT.muted}
          fontSize={12} fontWeight={600} letterSpacing="0.12em"
          style={{ pointerEvents: 'none', textTransform: 'uppercase' }}
        >
          {status}
        </text>
      </svg>
    </div>
  );
}
