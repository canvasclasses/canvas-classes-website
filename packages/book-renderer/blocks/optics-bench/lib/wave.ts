/*
 * optics-bench/lib/wave.ts — the part of optics rays cannot reach.
 * ─────────────────────────────────────────────────────────────────────────────
 * A ray tracer is a lie about light that happens to be extremely useful. It
 * stops being useful the moment the aperture is comparable to the wavelength,
 * and that is exactly where Young's slits and single-slit diffraction live. So
 * `wave` mode does NOT trace anything: it computes intensity from path
 * difference, which is the only variable that matters.
 *
 * Keeping this apart from the tracer is a correctness decision, not a tidiness
 * one. A sim that "bends" rays round a slit teaches that diffraction is a kind
 * of refraction, which is the misconception this module exists to prevent.
 *
 * UNITS. λ in nm, slit width/separation in mm, screen distance in cm. Those are
 * the units the questions are written in; the conversions happen once, here.
 *
 * Pure. No React, no DOM.
 */

export interface WaveSpec {
  /** nm. */
  lambda: number;
  /** mm. Centre-to-centre slit separation (YDSE). */
  d: number;
  /** mm. Width of each slit. 0 disables the envelope. */
  a: number;
  /** cm. Slit-to-screen distance. */
  D: number;
  /** How many slits. 2 = Young; 1 = single-slit diffraction; >2 = grating. */
  slits: number;
}

export interface FringeSample {
  /** mm on the screen, measured from the central maximum. */
  y: number;
  /** 0…1. */
  intensity: number;
}

const NM = 1e-6; // nm → mm
const CM = 10;   // cm → mm

/**
 * Fringe width (spacing between adjacent bright fringes), mm.
 *      β = λ D / d
 * Check: λ = 600 nm, d = 0.5 mm, D = 100 cm → β = (6e-4 × 1000)/0.5 = 1.2 mm.
 */
export function fringeWidth(s: WaveSpec): number {
  if (s.d <= 0) return Infinity;
  return (s.lambda * NM * s.D * CM) / s.d;
}

/** Angular position of the m-th minimum of a single slit: a sinθ = mλ. */
export function singleSlitMinimumRad(m: number, s: WaveSpec): number | null {
  if (s.a <= 0) return null;
  const sinT = (m * s.lambda * NM) / s.a;
  return Math.abs(sinT) > 1 ? null : Math.asin(sinT);
}

/** Half-width of the central diffraction maximum on the screen, mm: D λ / a. */
export function centralMaxHalfWidth(s: WaveSpec): number {
  if (s.a <= 0) return Infinity;
  return (s.D * CM * s.lambda * NM) / s.a;
}

/**
 * Intensity at a point y mm from the centre of the screen, normalised to 1.
 *
 *      single slit envelope :  sinc²(β)          β = π a sinθ / λ
 *      N-slit interference  :  [sin(Nα)/(N sinα)]²   α = π d sinθ / λ
 *
 * For N = 2 the interference term collapses to cos²α, which is the form every
 * textbook prints — but writing the general N means the same function draws a
 * grating, and the student can watch the fringes sharpen as N grows without the
 * sim switching to different physics behind their back.
 *
 * The envelope is what makes the 5th-order fringe MISSING when d = 5a. That
 * "missing order" is the observation that proves both effects are present at
 * once, and it falls out of the product rather than being drawn in.
 */
export function intensityAt(y: number, s: WaveSpec): number {
  const Dmm = s.D * CM;
  const sinT = y / Math.hypot(Dmm, y);
  const lam = s.lambda * NM;

  let envelope = 1;
  if (s.a > 0) {
    const beta = (Math.PI * s.a * sinT) / lam;
    envelope = Math.abs(beta) < 1e-9 ? 1 : (Math.sin(beta) / beta) ** 2;
  }

  if (s.slits <= 1) return envelope;

  const alpha = (Math.PI * s.d * sinT) / lam;
  const N = Math.round(s.slits);
  let inter: number;
  if (Math.abs(Math.sin(alpha)) < 1e-9) inter = 1;
  else inter = (Math.sin(N * alpha) / (N * Math.sin(alpha))) ** 2;

  return envelope * inter;
}

/** A profile across ±`halfSpan` mm of the screen. */
export function intensityProfile(s: WaveSpec, halfSpan: number, samples = 481): FringeSample[] {
  const out: FringeSample[] = [];
  for (let i = 0; i < samples; i++) {
    const y = -halfSpan + (2 * halfSpan * i) / (samples - 1);
    out.push({ y, intensity: intensityAt(y, s) });
  }
  return out;
}

/** Orders that vanish because a minimum of the envelope lands on a maximum of
 *  the interference: n = m · d/a, integer m. The classic "missing order". */
export function missingOrders(s: WaveSpec, upTo = 12): number[] {
  if (s.a <= 0 || s.d <= 0) return [];
  const ratio = s.d / s.a;
  const out: number[] = [];
  for (let m = 1; m <= upTo; m++) {
    const n = m * ratio;
    if (Math.abs(n - Math.round(n)) < 1e-6 && Math.round(n) <= upTo) out.push(Math.round(n));
  }
  return out;
}

/** A sensible half-span for the plot: five fringes, or one central max. */
export function suggestedSpan(s: WaveSpec): number {
  if (s.slits <= 1) return Math.min(60, centralMaxHalfWidth(s) * 2.6);
  const b = fringeWidth(s);
  return Number.isFinite(b) ? Math.min(60, b * 5.5) : 20;
}
