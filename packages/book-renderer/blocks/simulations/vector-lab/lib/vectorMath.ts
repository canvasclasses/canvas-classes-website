// vectorMath.ts
// ─────────────────────────────────────────────────────────────────────────────
// Pure 2-D / 3-D vector algebra for the Vector Lab simulator.
//
// CONVENTION: every function here works in STANDARD MATHEMATICAL coordinates —
// x to the right, y UP, angle measured counter-clockwise from the +x axis.
// The SVG render layer is the ONLY place allowed to flip y (because SVG y grows
// downward). Keeping the math in physics-coordinates means the formulas read
// exactly like NCERT Class 11 Ch. 4 "Motion in a Plane" and there are no
// surprise sign flips in the teaching text.
//
// No React, no DOM — this module is intentionally side-effect-free so it can be
// unit-tested with a plain node script (see scripts/_tmp_verify_*.js style).
// ─────────────────────────────────────────────────────────────────────────────

export interface Vec2 {
  x: number;
  y: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** Polar form of a 2-D vector. `angleDeg` is CCW from +x axis. */
export interface Polar {
  mag: number;
  angleDeg: number;
}

// ── Construction ─────────────────────────────────────────────────────────────

export const vec = (x: number, y: number): Vec2 => ({ x, y });

/** Build a vector from magnitude + direction (degrees, CCW from +x). */
export function fromPolar(mag: number, angleDeg: number): Vec2 {
  const r = (angleDeg * Math.PI) / 180;
  return { x: mag * Math.cos(r), y: mag * Math.sin(r) };
}

// ── Core algebra ─────────────────────────────────────────────────────────────

export const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });

export const negate = (a: Vec2): Vec2 => ({ x: -a.x, y: -a.y });

/** a − b, implemented as a + (−b) — the framing module 6 teaches explicitly. */
export const sub = (a: Vec2, b: Vec2): Vec2 => add(a, negate(b));

export const scale = (a: Vec2, k: number): Vec2 => ({ x: a.x * k, y: a.y * k });

export const magnitude = (a: Vec2): number => Math.hypot(a.x, a.y);

/** Direction in degrees, CCW from +x, in the range (−180, 180]. */
export function angleDeg(a: Vec2): number {
  if (a.x === 0 && a.y === 0) return 0;
  return (Math.atan2(a.y, a.x) * 180) / Math.PI;
}

/** Angle normalised to [0, 360). Handy for compass-style readouts. */
export function angle360(a: Vec2): number {
  const d = angleDeg(a);
  return d < 0 ? d + 360 : d;
}

/** Unit vector in the direction of a. Returns (0,0) for the zero vector. */
export function unit(a: Vec2): Vec2 {
  const m = magnitude(a);
  return m === 0 ? { x: 0, y: 0 } : { x: a.x / m, y: a.y / m };
}

// ── Products ─────────────────────────────────────────────────────────────────

export const dot = (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y;

/**
 * 2-D cross product → the scalar z-component of A × B.
 * Positive = B is CCW from A (out of the page, +k̂); negative = into the page.
 * Magnitude equals the area of the parallelogram spanned by A and B.
 */
export const cross2 = (a: Vec2, b: Vec2): number => a.x * b.y - a.y * b.x;

/** Full 3-D cross product, for the JEE-Advanced dot/cross module. */
export function cross3(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

export const dot3 = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
export const magnitude3 = (a: Vec3): number => Math.hypot(a.x, a.y, a.z);

/** Smallest angle between two vectors, in degrees, via the dot product. */
export function angleBetween(a: Vec2, b: Vec2): number {
  const ma = magnitude(a);
  const mb = magnitude(b);
  if (ma === 0 || mb === 0) return 0;
  // Clamp guards against floating-point drift pushing acos out of [-1, 1].
  const c = Math.max(-1, Math.min(1, dot(a, b) / (ma * mb)));
  return (Math.acos(c) * 180) / Math.PI;
}

// ── Teaching-specific helpers ──────────────────────────────────────────────────

/**
 * Parallelogram law of vector addition (NCERT Class 11, Ch. 4):
 *   R = √(A² + B² + 2·A·B·cosθ)
 * where θ is the angle BETWEEN the two vectors. Returns the magnitude of the
 * resultant so a phase can show this closed-form value next to the
 * component-method answer and prove they agree.
 */
export function parallelogramMagnitude(magA: number, magB: number, betweenDeg: number): number {
  const t = (betweenDeg * Math.PI) / 180;
  return Math.sqrt(magA * magA + magB * magB + 2 * magA * magB * Math.cos(t));
}

/**
 * Direction of the resultant relative to vector A (the "α" in the NCERT
 * derivation):  tanα = (B·sinθ) / (A + B·cosθ).  Returned in degrees.
 */
export function resultantAngleFromA(magA: number, magB: number, betweenDeg: number): number {
  const t = (betweenDeg * Math.PI) / 180;
  const num = magB * Math.sin(t);
  const den = magA + magB * Math.cos(t);
  return (Math.atan2(num, den) * 180) / Math.PI;
}

/** Component of a along a given direction (the scalar projection — the "dot" idea). */
export function projection(a: Vec2, onto: Vec2): number {
  const m = magnitude(onto);
  return m === 0 ? 0 : dot(a, onto) / m;
}

/** Round for display without exposing float noise. Pure — no formatting glyphs. */
export const round = (n: number, dp = 2): number => {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
};
