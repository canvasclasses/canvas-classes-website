/*
 * optics-bench/lib/vec.ts — 2-D vector maths and the two laws light obeys.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM, no imports beyond the frozen `Vec2` type.
 *
 * SIGN CONVENTION IN FORCE HERE: none. This module is pure geometry — it knows
 * nothing about poles, object distances or which way light travels. Snell's law
 * and the law of reflection are direction-vector identities that hold in any
 * convention, which is exactly why they live apart from `convention.ts`.
 *
 * The one thing to be careful about: every `refract` / `reflect` call takes the
 * normal ALREADY ORIENTED AGAINST the incoming ray (n · d < 0). Orienting it is
 * the caller's job because only the caller knows which side of the surface the
 * glass is on — and getting that backwards is the classic way a tracer silently
 * swaps n1 and n2 and reports refraction where there should be TIR.
 */

import type { Vec2 } from '../types';

export const EPS = 1e-9;

export const v = (x: number, y: number): Vec2 => ({ x, y });
export const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y });
export const mul = (a: Vec2, k: number): Vec2 => ({ x: a.x * k, y: a.y * k });
export const dot = (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y;
/** 2-D "cross product" — the z-component of a × b. Zero ⇒ parallel. */
export const cross = (a: Vec2, b: Vec2): number => a.x * b.y - a.y * b.x;
export const len = (a: Vec2): number => Math.hypot(a.x, a.y);
export const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.y - b.y);

export function unit(a: Vec2): Vec2 {
  const L = Math.hypot(a.x, a.y);
  return L < EPS ? { x: 1, y: 0 } : { x: a.x / L, y: a.y / L };
}

/** Rotate CCW by `deg`. Physics angles: CCW from +x, y up. */
export function rotate(a: Vec2, deg: number): Vec2 {
  const r = (deg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return { x: a.x * c - a.y * s, y: a.x * s + a.y * c };
}

/** Rotate about a pivot — used to tilt a whole prism or slab about its centre. */
export function rotateAbout(p: Vec2, pivot: Vec2, deg: number): Vec2 {
  return add(pivot, rotate(sub(p, pivot), deg));
}

/** Unit direction from a physics angle in degrees (CCW from +x). */
export const dirFromDeg = (deg: number): Vec2 => {
  const r = (deg * Math.PI) / 180;
  return { x: Math.cos(r), y: Math.sin(r) };
};

/** Physics angle of a direction, in degrees, CCW from +x, in (−180, 180]. */
export const degOf = (d: Vec2): number => (Math.atan2(d.y, d.x) * 180) / Math.PI;

export const rad = (deg: number): number => (deg * Math.PI) / 180;
export const deg = (r: number): number => (r * 180) / Math.PI;

/** Perpendicular, rotated +90° (CCW). */
export const perp = (a: Vec2): Vec2 => ({ x: -a.y, y: a.x });

// ── The two laws ─────────────────────────────────────────────────────────────

/**
 * Law of reflection, vector form. `n` must already point AGAINST `d`.
 *   d' = d − 2 (d · n) n
 */
export function reflect(d: Vec2, n: Vec2): Vec2 {
  const k = 2 * dot(d, n);
  return unit({ x: d.x - k * n.x, y: d.y - k * n.y });
}

export interface RefractResult {
  /** Outgoing unit direction. On TIR this is the REFLECTED ray — light really
   *  does go that way, which is the whole point of a fibre. */
  dir: Vec2;
  /** true when sin θ₂ would have exceeded 1: total internal reflection. */
  tir: boolean;
  /** Angle of incidence in degrees, measured from the normal. */
  incidenceDeg: number;
  /** Angle of refraction in degrees. NaN when `tir`. */
  refractionDeg: number;
}

/**
 * Snell's law in vector form: n₁ sin θ₁ = n₂ sin θ₂.
 *
 *   η = n₁ / n₂
 *   cos θ₁ = −d · n                    (n oriented against d, so this is ≥ 0)
 *   sin²θ₂ = η² (1 − cos²θ₁)
 *   d' = η d + (η cos θ₁ − cos θ₂) n
 *
 * When sin²θ₂ > 1 there is no transmitted ray at all and the surface reflects
 * 100% of the light — total internal reflection. It is NOT special-cased
 * anywhere else in the engine: the fibre, the 45° prism and the "why does the
 * water surface go silver" demo all come out of this one branch.
 */
export function refract(d: Vec2, n: Vec2, n1: number, n2: number): RefractResult {
  const eta = n1 / n2;
  const cos1 = -dot(d, n);
  const sin2Sq = eta * eta * Math.max(0, 1 - cos1 * cos1);
  const incidenceDeg = deg(Math.acos(Math.min(1, Math.max(0, cos1))));

  if (sin2Sq > 1) {
    return { dir: reflect(d, n), tir: true, incidenceDeg, refractionDeg: NaN };
  }

  const cos2 = Math.sqrt(1 - sin2Sq);
  const k = eta * cos1 - cos2;
  return {
    dir: unit({ x: eta * d.x + k * n.x, y: eta * d.y + k * n.y }),
    tir: false,
    incidenceDeg,
    refractionDeg: deg(Math.asin(Math.min(1, Math.sqrt(sin2Sq)))),
  };
}

// ── Line helpers used by the image finder ────────────────────────────────────

/** Signed parameter t where the line p + t·d crosses the plane x = X. */
export function tAtX(p: Vec2, d: Vec2, X: number): number | null {
  if (Math.abs(d.x) < 1e-12) return null;
  return (X - p.x) / d.x;
}

/** Point where the line p + t·d crosses x = X, or null when it never does. */
export function atX(p: Vec2, d: Vec2, X: number): Vec2 | null {
  const t = tAtX(p, d, X);
  return t === null ? null : { x: X, y: p.y + t * d.y };
}

/** Round to `dp` decimals — for stable path strings and readouts. */
export const round = (x: number, dp = 3): number => {
  const f = 10 ** dp;
  return Math.round(x * f) / f;
};
