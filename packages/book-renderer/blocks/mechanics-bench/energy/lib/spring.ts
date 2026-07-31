/*
 * energy/lib/spring.ts — work done by a force that will not hold still.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. Node-verifiable, no React.
 *
 * ── THE MISCONCEPTION THIS FILE IS BUILT AROUND ──────────────────────────────
 * W = F·d is drilled so hard that students apply it to a spring, get 2× the
 * right answer, and never notice — because both numbers are plausible and
 * neither is obviously wrong. The gap is exactly a factor of two for a linear
 * spring, which makes it the cleanest possible demonstration that "multiply"
 * only works when the force is CONSTANT, and "the area under the F–x graph" is
 * what you actually mean by work.
 *
 *      naive   W = F(x)·x        = k·x²        ← the trap
 *      true    W = ∫F dx         = ½k·x²       ← the area
 *
 * ── WHY THE NON-LINEAR LAW IS HERE ───────────────────────────────────────────
 * A student who learns "spring work is ½kx²" has swapped one formula for
 * another and can still not integrate. So the sim also offers a stiffening band,
 * F = kx + βx³ — a real rubber band stiffens as it stretches — where ½kx² is
 * simply wrong and only the area survives. Simpson's rule is EXACT for cubics,
 * so the numerical area and the closed form agree to floating point and the sim
 * can show both without hedging.
 */

/** F(x) = k·x + β·x³, with x measured from the natural length. β = 0 is Hooke. */
export interface ForceLaw {
  /** N/m */
  k: number;
  /** N/m³. Positive stiffens (a rubber band); 0 is an ideal spring. */
  beta?: number;
}

/** The restoring-force MAGNITUDE at extension x. */
export function forceAt(law: ForceLaw, x: number): number {
  const b = law.beta ?? 0;
  return law.k * x + b * x * x * x;
}

/**
 * Work done stretching from x0 to x1 — the exact area under F–x.
 *
 *      ∫(kx + βx³)dx = ½k(x₁² − x₀²) + ¼β(x₁⁴ − x₀⁴)
 */
export function workExact(law: ForceLaw, x0: number, x1: number): number {
  const b = law.beta ?? 0;
  return 0.5 * law.k * (x1 * x1 - x0 * x0) + 0.25 * b * (x1 ** 4 - x0 ** 4);
}

/**
 * The area under F–x by composite Simpson's rule.
 *
 * Simpson integrates any cubic EXACTLY, so for this force law it reproduces
 * `workExact` to floating point — which is the point. The sim shows the shaded
 * strips being added up and the running total matching the algebra, so "the
 * area IS the work" is demonstrated rather than asserted.
 *
 * `n` is rounded up to an even number of strips, as Simpson requires.
 */
export function workBySimpson(law: ForceLaw, x0: number, x1: number, n = 200): number {
  const m = Math.max(2, Math.ceil(n / 2) * 2);
  const h = (x1 - x0) / m;
  let sum = forceAt(law, x0) + forceAt(law, x1);
  for (let i = 1; i < m; i++) {
    sum += (i % 2 ? 4 : 2) * forceAt(law, x0 + i * h);
  }
  return (h / 3) * sum;
}

/**
 * The WRONG answer, computed properly so the sim can draw it.
 *
 * A ghost rectangle of height F(x₁) and width (x₁ − x₀) — "I multiplied the
 * force I ended up with by the distance". Drawing the student's error next to
 * the truth is how the projectile engine handles the radial-vs-tangential
 * prediction, and it works for the same reason: the gap is visible, not stated.
 */
export function naiveWork(law: ForceLaw, x0: number, x1: number): number {
  return forceAt(law, x1) * (x1 - x0);
}

/** Elastic PE stored at extension x, measured from the natural length. */
export const springPE = (law: ForceLaw, x: number): number => workExact(law, 0, x);

/**
 * How far a block of mass m launched at v0 into a spring compresses it,
 * for the LINEAR case: ½mv² = ½kx² → x = v√(m/k).
 *
 * Linear only, and it says so: with β ≠ 0 the inversion is a quartic and the sim
 * solves it numerically instead (`compressionFor`).
 */
export function compressionLinear(k: number, mass: number, v0: number): number {
  return v0 * Math.sqrt(mass / k);
}

/** Compression for any law, by bisection on the monotone PE(x). */
export function compressionFor(law: ForceLaw, mass: number, v0: number, xMax = 5): number {
  const target = 0.5 * mass * v0 * v0;
  let lo = 0;
  let hi = xMax;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (springPE(law, mid) < target) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Strips for the shaded-area drawing: [xLeft, xRight, meanF] per strip. */
export function areaStrips(law: ForceLaw, x0: number, x1: number, n: number)
: { a: number; b: number; f: number }[] {
  const strips: { a: number; b: number; f: number }[] = [];
  const h = (x1 - x0) / Math.max(1, n);
  for (let i = 0; i < n; i++) {
    const a = x0 + i * h;
    const b = a + h;
    strips.push({ a, b, f: forceAt(law, (a + b) / 2) });
  }
  return strips;
}
