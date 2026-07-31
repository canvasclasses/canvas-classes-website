/*
 * energy/lib/coaster.ts — where a roller-coaster loop actually fails.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. Node-verifiable, no React.
 *
 * ── THE RESULT THIS FILE HANDS BACK TO THE CIRCULAR ARENA ────────────────────
 * At the top of the loop the track is ABOVE the car, so the track can only push
 * DOWN. Both forces available there point to the centre, and the smallest
 * possible centripetal force is therefore the one with N = 0:
 *
 *      mg = m v²/r      →      v²_top(min) = g·r
 *
 * That is the Circular Arena's `critical-speed` result, arrived at from the
 * energy side instead of the force side. Same number, two routes — which is the
 * whole argument for engines that share physics rather than each owning a copy.
 *
 * Energy from the release height h down to the loop top at 2r (smooth):
 *
 *      v²_top = 2g(h − 2r)   ≥ g·r    →    h ≥ 2.5·r
 *
 * The famous 2½ radii. It is NOT "just get it over the top" — a car that
 * arrives at the top with v = 0 left the track long before it got there.
 *
 * ── SCOPE, STATED ────────────────────────────────────────────────────────────
 * Friction is applied on the horizontal RUN-IN only, where N = mg and the heat
 * is exactly μmgd. Inside the loop N varies with angle, so a friction model
 * there would be a differential equation, not a Class-11 result; the loop is
 * taken as smooth and `assumptions` says so in words the UI prints.
 */

export interface CoasterSpec {
  /** Release height above the loop's base, m. */
  releaseH: number;
  /** Loop radius, m. */
  loopR: number;
  /** Horizontal run between the bottom of the drop and the loop, m. */
  runIn: number;
  /** Kinetic friction on the run-in. 0 = smooth. */
  mu?: number;
  /** kg — cancels out of every speed, and the sim SAYS so. */
  mass?: number;
  /** m/s², default 9.8 */
  g?: number;
}

export type CoasterFailure = 'stops-before-loop' | 'falls-off-inside-loop' | null;

export interface CoasterVerdict {
  /** v² at the bottom of the loop, m²/s². Negative is impossible — clamped to 0
   *  and reported through `failure` instead. */
  vBottomSq: number;
  /** v² at the top of the loop, m²/s². */
  vTopSq: number;
  /** The minimum the top needs: g·r. */
  vTopMinSq: number;
  /** vTopSq − vTopMinSq. Negative = it comes off the track. */
  headroom: number;
  /** Normal force at the top, N. Zero at exactly critical; negative is
   *  impossible for a track that cannot pull, and signals departure. */
  nTop: number;
  /** Normal force at the bottom of the loop, N — the 6mg moment at critical. */
  nBottom: number;
  clears: boolean;
  failure: CoasterFailure;
  /** Heat dumped into the run-in, J. */
  heat: number;
  /** The smallest release height that would work, m. */
  minReleaseH: number;
  assumptions: string[];
}

const G_DEFAULT = 9.8;

/** Minimum release height for a smooth loop of radius r, plus whatever the
 *  run-in's friction steals. Frictionless it is exactly 2.5·r. */
export function minReleaseHeight(loopR: number, mu = 0, runIn = 0): number {
  return 2.5 * loopR + mu * runIn;
}

export function analyseLoop(spec: CoasterSpec): CoasterVerdict {
  const g = spec.g ?? G_DEFAULT;
  const m = spec.mass ?? 1;
  const mu = spec.mu ?? 0;
  const r = Math.max(spec.loopR, 1e-6);

  const heat = mu * m * g * spec.runIn;
  // ½mv² = mgh − μmg·d  →  v² = 2g(h − μd)
  const vBottomSqRaw = 2 * g * (spec.releaseH - mu * spec.runIn);
  const vBottomSq = Math.max(0, vBottomSqRaw);
  // Loop taken as smooth: v²_top = v²_bottom − 4gr
  const vTopSqRaw = vBottomSq - 4 * g * r;
  const vTopSq = Math.max(0, vTopSqRaw);
  const vTopMinSq = g * r;

  const failure: CoasterFailure =
    vBottomSqRaw <= 0 ? 'stops-before-loop'
      : vTopSqRaw < vTopMinSq - 1e-12 ? 'falls-off-inside-loop'
        : null;

  return {
    vBottomSq,
    vTopSq,
    vTopMinSq,
    headroom: vTopSqRaw - vTopMinSq,
    // At the top both N and mg point DOWN toward the centre: N + mg = mv²/r.
    nTop: (m * vTopSqRaw) / r - m * g,
    // At the bottom N points UP and gravity down: N − mg = mv²/r.
    nBottom: (m * vBottomSq) / r + m * g,
    clears: failure === null,
    failure,
    heat,
    minReleaseH: minReleaseHeight(r, mu, spec.runIn),
    assumptions: [
      'The loop itself is taken as smooth — inside it the normal force changes with angle, so friction there is not a Class-11 result.',
      'Friction acts on the flat run-in, where N = mg, so the heat is exactly μmgd.',
      'The mass cancels out of every speed here. A heavier car needs exactly the same release height.',
    ],
  };
}

/**
 * Normal force at angle φ round the loop, measured from the BOTTOM (φ = 0) going
 * up, radians.
 *
 * Outward radial unit vector at φ is (sin φ, −cos φ) — straight down at the
 * bottom, straight up at the top. Resolving toward the centre,
 *
 *      N + mg·(−cos φ)·(−1) = m v²/r      →      N = m v²/r + mg·cos φ
 *
 * so N = mv²/r + mg at the bottom (φ = 0) and N = mv²/r − mg at the top
 * (φ = π), which is the pair of signs the whole loop argument turns on.
 *
 * The sim plots this so the student can see WHERE it first hits zero — always
 * the top — instead of being told.
 */
export function normalAtAngle(spec: CoasterSpec, phi: number): number {
  const g = spec.g ?? G_DEFAULT;
  const m = spec.mass ?? 1;
  const mu = spec.mu ?? 0;
  const r = Math.max(spec.loopR, 1e-6);
  const height = r * (1 - Math.cos(phi));
  const vSq = 2 * g * (spec.releaseH - mu * spec.runIn) - 2 * g * height;
  return (m * vSq) / r + m * g * Math.cos(phi);
}
