/*
 * rotation/lib/inertia.ts — why the race is decided before it starts.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. Node-verifiable, no React.
 *
 * ── THE RESULT ───────────────────────────────────────────────────────────────
 * Write every rolling body's moment of inertia as I = k·m·r². Then rolling
 * without slipping down an incline,
 *
 *      mg sin θ − f = ma        (along the slope)
 *      f·r = Iα = k m r² · a/r  (about the centre)
 *   →  a = g sin θ / (1 + k)
 *
 * `m` and `r` are GONE. Not "cancel approximately" — algebraically absent. The
 * only survivor is k, and k is a pure number that depends on nothing but SHAPE:
 *
 *      hoop 1  ·  hollow sphere 2/3  ·  disc 1/2  ·  solid sphere 2/5
 *
 * So the order of finish is fixed by shape alone: sphere, disc, hollow sphere,
 * hoop. A student is allowed to pick any masses and any radii they like and
 * cannot change it, which is a far stronger demonstration than being told mass
 * cancels.
 *
 * The same k also splits the kinetic energy: a fraction 1/(1+k) is
 * translational and k/(1+k) is rotational. The hoop puts HALF its energy into
 * spinning and only half into going anywhere — which is the same fact seen from
 * the energy side, and it is what the Energy Ledger's stacked bar renders.
 */

export type RollShape = 'sphere' | 'disc' | 'hollow-sphere' | 'hoop';

export const ROLL_SHAPES: RollShape[] = ['sphere', 'disc', 'hollow-sphere', 'hoop'];

/** k in I = k·m·r². The entire physics of the race lives in this table. */
export const SHAPE_K: Record<RollShape, number> = {
  sphere: 2 / 5,
  disc: 1 / 2,
  'hollow-sphere': 2 / 3,
  hoop: 1,
};

export const SHAPE_LABEL: Record<RollShape, string> = {
  sphere: 'Solid sphere',
  disc: 'Solid disc',
  'hollow-sphere': 'Hollow sphere',
  hoop: 'Hoop / ring',
};

/** The symbolic form of I, for the ledger. */
export const SHAPE_I_LATEX: Record<RollShape, string> = {
  sphere: '\\tfrac{2}{5}mr^2',
  disc: '\\tfrac{1}{2}mr^2',
  'hollow-sphere': '\\tfrac{2}{3}mr^2',
  hoop: 'mr^2',
};

const DEG = Math.PI / 180;
const G_DEFAULT = 9.8;

/** kg m². */
export const inertiaOf = (shape: RollShape, m: number, r: number): number =>
  SHAPE_K[shape] * m * r * r;

/** Rolling acceleration down a slope: a = g sin θ / (1 + k). */
export const rollingAccel = (shape: RollShape, thetaDeg: number, g = G_DEFAULT): number =>
  (g * Math.sin(thetaDeg * DEG)) / (1 + SHAPE_K[shape]);

/** A frictionless SLIDING body: a = g sin θ. Always the fastest — it wastes
 *  nothing on spinning — and drawing it alongside is what shows where the
 *  rolling bodies' missing acceleration went. */
export const slidingAccel = (thetaDeg: number, g = G_DEFAULT, mu = 0): number =>
  g * (Math.sin(thetaDeg * DEG) - mu * Math.cos(thetaDeg * DEG));

/** Fraction of the kinetic energy that is translational, 1/(1+k). */
export const translationalShare = (shape: RollShape): number => 1 / (1 + SHAPE_K[shape]);

/** Fraction that is rotational, k/(1+k). */
export const rotationalShare = (shape: RollShape): number =>
  SHAPE_K[shape] / (1 + SHAPE_K[shape]);

/**
 * The least friction that can sustain rolling without slipping:
 *
 *      f = ma·k/... → μ_min = k·tan θ / (1 + k)
 *
 * Below it the body slips, the race stops being about k, and the whole lesson
 * quietly changes — so the sim reports it rather than assuming rolling.
 */
export const minMuForRolling = (shape: RollShape, thetaDeg: number): number => {
  const k = SHAPE_K[shape];
  return (k * Math.tan(thetaDeg * DEG)) / (1 + k);
};

export interface RaceEntry {
  shape: RollShape;
  mass: number;
  radius: number;
  /** kg m² */
  inertia: number;
  /** m/s² */
  accel: number;
  /** s to cover the course */
  time: number;
  /** m/s at the finish */
  finishSpeed: number;
  /** rad/s at the finish */
  finishOmega: number;
  translationalShare: number;
  rotationalShare: number;
  minMu: number;
  /** 1 = won. */
  place: number;
}

export interface RaceOptions {
  /** Distance ALONG the slope, m. */
  distance: number;
  thetaDeg: number;
  g?: number;
  /** Available friction. Any entry needing more than this slips — reported, not
   *  silently re-solved, because a slipping race is a different exercise. */
  mu?: number;
}

/**
 * Run the race. `entries` carries each body's own mass and radius so a student
 * can load the dice — give the hoop a tenth of the sphere's mass, make the
 * sphere enormous — and watch the finishing order refuse to move.
 */
export function race(
  entries: { shape: RollShape; mass: number; radius: number }[],
  o: RaceOptions,
): RaceEntry[] {
  const g = o.g ?? G_DEFAULT;
  const rows = entries.map((e) => {
    const a = rollingAccel(e.shape, o.thetaDeg, g);
    // d = ½at² with v₀ = 0.
    const t = a > 0 ? Math.sqrt((2 * o.distance) / a) : Infinity;
    const v = a * t;
    return {
      shape: e.shape,
      mass: e.mass,
      radius: e.radius,
      inertia: inertiaOf(e.shape, e.mass, e.radius),
      accel: a,
      time: t,
      finishSpeed: v,
      finishOmega: e.radius > 0 ? v / e.radius : 0,
      translationalShare: translationalShare(e.shape),
      rotationalShare: rotationalShare(e.shape),
      minMu: minMuForRolling(e.shape, o.thetaDeg),
      place: 0,
    };
  });
  const order = [...rows].sort((a, b) => a.time - b.time);
  order.forEach((r, i) => { r.place = i + 1; });
  return rows;
}

/**
 * Finish speed from the energy route, as a cross-check on the kinematic one:
 *
 *      mgh = ½mv²(1 + k)   →   v = √(2gh/(1+k))
 *
 * Two independent derivations landing on the same number is the sim's own
 * evidence that the k-factor is not a fudge, and the verifier asserts it.
 */
export const finishSpeedByEnergy = (shape: RollShape, height: number, g = G_DEFAULT): number =>
  Math.sqrt((2 * g * height) / (1 + SHAPE_K[shape]));
