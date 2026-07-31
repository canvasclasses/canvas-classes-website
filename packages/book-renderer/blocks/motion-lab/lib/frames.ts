/*
 * motion-lab/lib/frames.ts — reference-frame transforms.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * This file is small and it is the whole point of half the E2 module. A ball
 * dropped from a moving trolley traces a PARABOLA to someone standing on the
 * road and a STRAIGHT LINE DOWN to someone riding the trolley. Same event, two
 * truths, and a printed figure can only ever show one of them. Rendering the
 * same stored trajectory through two different `FrameSpec`s is how the sim
 * shows both without re-running any physics — which is also the guarantee that
 * they really are the same motion and not two hand-drawn pictures.
 *
 * CONVENTION. A `FrameSpec` describes how the frame moves relative to the
 * ground frame. `t` is time measured from the instant the frame's origin sat at
 * `origin` (default: the world origin) — i.e. the same clock the trajectory
 * uses. `toFrame` returns the state as measured BY that frame.
 *
 * Rotating frames are transformed here too, but note what this file does and
 * does not do: it converts kinematics (where the body is, how fast it moves).
 * It does NOT invent a centrifugal force — pseudo-forces are a mechanics-bench
 * concern, and `isInertial()` in ../types is the flag that decides whether one
 * is required or is a grading error.
 */

import type { MotionState, FrameSpec, Trajectory, Vec2 } from '../types';

const v_sub = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y });
const v_add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });

/** Rotate a vector by `rad` CCW. */
function rotate(v: Vec2, rad: number): Vec2 {
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
}

const ZERO: Vec2 = { x: 0, y: 0 };

/** Where the frame's origin sits, in ground coordinates, at time `t`. */
export function frameOrigin(f: FrameSpec, t: number): Vec2 {
  switch (f.kind) {
    case 'ground':
      return ZERO;
    case 'translating': {
      const o = f.origin ?? ZERO;
      return { x: o.x + f.vel.x * t, y: o.y + f.vel.y * t };
    }
    case 'accelerating': {
      const o = f.origin ?? ZERO;
      const v0 = f.vel0 ?? ZERO;
      return {
        x: o.x + v0.x * t + 0.5 * f.accel.x * t * t,
        y: o.y + v0.y * t + 0.5 * f.accel.y * t * t,
      };
    }
    case 'rotating':
      return f.centre;
  }
}

/** How fast the frame's origin is moving, in ground coordinates, at time `t`. */
export function frameVelocity(f: FrameSpec, t: number): Vec2 {
  switch (f.kind) {
    case 'ground':
      return ZERO;
    case 'translating':
      return f.vel;
    case 'accelerating': {
      const v0 = f.vel0 ?? ZERO;
      return { x: v0.x + f.accel.x * t, y: v0.y + f.accel.y * t };
    }
    case 'rotating':
      return ZERO;
  }
}

/**
 * Express a ground-frame state as the frame `f` measures it at time `t`.
 *
 * Translating / accelerating: subtract the frame's origin and its velocity.
 * Rotating: subtract the rotational drag term ω × r first, then rotate the
 * result back by −ωt. The frame's centre is returned as a FIXED point in both
 * frames, so a renderer can draw the same pivot in either view instead of the
 * scene jumping when the toggle is pressed.
 */
export function toFrame(s: MotionState, f: FrameSpec, t: number): MotionState {
  if (f.kind === 'ground') {
    return { t: s.t, pos: { ...s.pos }, vel: { ...s.vel } };
  }

  if (f.kind === 'rotating') {
    const theta = f.omega * t;
    const r = v_sub(s.pos, f.centre);
    // ω ẑ × r = ω(−r_y, r_x). Velocity relative to the co-rotating point:
    const vRel: Vec2 = { x: s.vel.x + f.omega * r.y, y: s.vel.y - f.omega * r.x };
    return {
      t: s.t,
      pos: v_add(f.centre, rotate(r, -theta)),
      vel: rotate(vRel, -theta),
    };
  }

  const o = frameOrigin(f, t);
  const v = frameVelocity(f, t);
  return { t: s.t, pos: v_sub(s.pos, o), vel: v_sub(s.vel, v) };
}

/**
 * Re-express a whole integrated path in frame `f`.
 *
 * Each point is transformed at ITS OWN time — using a single time for the whole
 * path would slide the frame's origin uniformly and produce a translated copy
 * of the parabola instead of the straight line that is the entire lesson.
 */
export function transformTrajectory(tr: Trajectory, f: FrameSpec): Trajectory {
  const points = tr.points.map((p) => toFrame(p, f, p.t));
  const events = tr.events.map((e) => ({ ...e, at: toFrame(e.at, f, e.at.t) }));
  if (!tr.stoppedAt) return { points, events };
  return { points, events, stoppedAt: toFrame(tr.stoppedAt, f, tr.stoppedAt.t) };
}
