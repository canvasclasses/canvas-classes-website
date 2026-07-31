/*
 * field-bench/emi/lib/loop.ts — the Flux Machine's physics. PURE.
 * ─────────────────────────────────────────────────────────────────────────────
 * No React, no DOM, no imports outside this folder's siblings. Node-verifiable;
 * `scripts/verify-emi-ac.mjs` runs every claim in this file directly.
 *
 * ── WHAT THIS MODELS, AND WHY THAT GEOMETRY ─────────────────────────────────
 * A rectangular loop sliding along x through a BOUNDED band of uniform field:
 * B out of the page for x in [x0, x1], and exactly zero outside it. That one
 * choice is the whole design.
 *
 * A loop in an UNBOUNDED uniform field can be slid around all day with zero
 * EMF, and a loop in a field that varies everywhere gives an EMF that is
 * impossible to attribute. The bounded band gives all four cases inside ONE
 * gesture the student performs themselves:
 *
 *      outside        → no flux, no EMF
 *      entering       → flux rising, EMF one way
 *      FULLY INSIDE   → flux large and CONSTANT, EMF exactly zero
 *      exiting        → flux falling, EMF the OTHER way
 *
 * The third case is the lesson (§4 unit 11): "EMF depends on dΦ/dt, not on Φ."
 * A loop parked in the strongest field on the page reads zero. Nothing else in
 * the chapter makes that as hard to disbelieve, because the student is holding
 * the loop when it happens.
 *
 * ── SIGN CONVENTIONS (every sign question in this chapter turns on these) ────
 *  • x to the right, y UP, B_z POSITIVE means OUT of the page. Same convention
 *    as `../../lib/sources.ts`, which is why a `uniform-B` source can carry the
 *    band's field without a translation layer.
 *  • Positive circulation round the loop is COUNTER-CLOCKWISE, which is the
 *    right-hand-rule partner of "positive flux is out of the page". So a
 *    positive current means CCW and its own field inside the loop is OUT of the
 *    page.
 *  • Faraday: emf = −N dΦ/dt. Current I = emf / R.
 *
 * With those three fixed, Lenz is not asserted anywhere in this file — it comes
 * out of the arithmetic. Push the loop into the band: Φ_out rises, emf < 0,
 * I < 0 (clockwise), and a clockwise current makes its own field INTO the page
 * inside the loop, opposing the rise. Pull it out: every sign flips. The
 * verifier checks both directions rather than trusting the sentence.
 *
 * ── THE RETARDING FORCE IS DERIVED, NOT ADDED ───────────────────────────────
 * F = I L × B on each side of the loop that is inside the band. A side carrying
 * current in +y inside B = +B ẑ feels I h B in +x. For a fully-inside loop both
 * vertical sides are in the field, carry opposite currents, and cancel exactly —
 * which is the same "no force" the zero EMF already implied, arrived at
 * independently. When only one side is in the field the net force survives, and
 * it always comes out OPPOSING v (see `machineState`). That force is what the
 * student feels as drag on the pointer: Lenz's law as something physical rather
 * than a rule about signs.
 *
 * And then the identity that makes EMI stop feeling like magic:
 *
 *      mechanical power you supply   =   electrical power dissipated
 *      (−F_x) · v                    =   I² R
 *
 * Both are computed here by different routes and the verifier holds them equal
 * to 1e-9. Nothing is back-derived from the other.
 *
 * ── TILT LIVES SOMEWHERE ELSE, ON PURPOSE ───────────────────────────────────
 * `machineState` is FACE-ON only (the loop's normal along B). Tilting a sliding
 * loop changes its x-footprint to w·cosθ AND changes which sides are in the
 * band, so a single model covering both would be two models wearing one name.
 * Tilt is therefore its own exact model, `tiltedFlux` (uniform field, whole
 * loop inside — Φ = B A cos θ), and rotation is `generatorState`. Three exact
 * models beat one approximate one.
 */

// ── Geometry ─────────────────────────────────────────────────────────────────

/** A band of uniform field: B_z tesla for x in [x0, x1], zero elsewhere. */
export interface FieldBand {
  x0: number;
  x1: number;
  /** Tesla. Positive = out of the page. */
  B: number;
}

/** The loop. `turns` multiplies the flux linkage; `resistance` is the whole
 *  circuit's, so a "broken loop" is modelled as an enormous resistance rather
 *  than as a special case. */
export interface LoopSpec {
  /** m, along x. */ w: number;
  /** m, along y. */ h: number;
  turns: number;
  /** Ω. */ resistance: number;
}

export type Placement = 'outside' | 'entering' | 'fully-inside' | 'exiting' | 'spanning';

/** Direction of the induced current, in the words the canvas legend uses. */
export type Sense = 'ccw' | 'cw' | 'none';

export interface EmiState {
  /** Where the loop is, and how fast. Echoed back so a readout row and the
   *  drawing can never disagree about which frame they describe. */
  xc: number;
  v: number;

  placement: Placement;
  /** m — how much of the loop's width is over the band right now. */
  overlapWidth: number;
  /** m² — the area actually threaded by field. */
  linkedArea: number;

  /** Wb, one turn. */
  flux: number;
  /** Wb — N·Φ, the quantity Faraday's law actually differentiates. */
  linkage: number;
  /** Wb/s of ONE turn's flux. */
  dFluxDt: number;
  /** V — emf = −N dΦ/dt. */
  emf: number;
  /** A — positive is counter-clockwise. */
  current: number;
  sense: Sense;

  /** N, along x. Always opposite to v whenever a current flows. */
  forceX: number;
  /** W — what the hand must supply to keep the loop moving at this v. */
  mechanicalPower: number;
  /** W — I²R, computed from the current, not from the force. */
  electricalPower: number;
}

const clamp0 = (v: number): number => (v > 0 ? v : 0);

/** How much of the loop's width lies over the band. */
export function overlapWidth(band: FieldBand, loop: LoopSpec, xc: number): number {
  const xl = xc - loop.w / 2;
  const xr = xc + loop.w / 2;
  return clamp0(Math.min(xr, band.x1) - Math.max(xl, band.x0));
}

/**
 * d(overlap)/dxc — the ONE-SIDED derivative in the direction of travel.
 *
 * The overlap is piecewise linear with corners where an edge crosses a band
 * boundary, so at a corner the derivative genuinely differs on the two sides
 * and `dir` says which one is wanted. Getting this wrong is not a rounding
 * error: at the exact instant the leading edge reaches x1 the loop stops
 * gaining flux and starts losing it, and a two-sided derivative would report
 * the average of +1 and −1, i.e. zero EMF at the very moment the EMF reverses.
 *
 * Returns exactly +1, 0 or −1 (times nothing — the band's width in y and B
 * are applied by the caller).
 *
 * Reading the two flags: `rIn` is "the right edge is inside the band", `lIn` is
 * "the left edge is inside the band". Their difference is both the flux
 * derivative AND the count of current-carrying sides that feel a force, which
 * is why `machineState` can use the one number for both.
 */
export function dOverlapDx(band: FieldBand, loop: LoopSpec, xc: number, dir: number): number {
  const xl = xc - loop.w / 2;
  const xr = xc + loop.w / 2;
  if (Math.min(xr, band.x1) - Math.max(xl, band.x0) <= 0) return 0;
  const forward = dir >= 0;
  const rIn = forward ? xr < band.x1 : xr <= band.x1;
  const lIn = forward ? xl >= band.x0 : xl > band.x0;
  return (rIn ? 1 : 0) - (lIn ? 1 : 0);
}

export function placementOf(band: FieldBand, loop: LoopSpec, xc: number): Placement {
  const xl = xc - loop.w / 2;
  const xr = xc + loop.w / 2;
  if (Math.min(xr, band.x1) - Math.max(xl, band.x0) <= 0) return 'outside';
  const lIn = xl >= band.x0;
  const rIn = xr <= band.x1;
  if (lIn && rIn) return 'fully-inside';
  if (!lIn && !rIn) return 'spanning';
  return rIn ? 'entering' : 'exiting';
}

/** Wb through one turn at this position. */
export function fluxOf(band: FieldBand, loop: LoopSpec, xc: number): number {
  return band.B * overlapWidth(band, loop, xc) * loop.h;
}

/**
 * Everything the Flux Machine shows, from one position and one velocity.
 *
 * `resistance` <= 0 would be a short circuit with infinite current, which is
 * not a hard case but a scene that cannot exist; it is floored so the readouts
 * stay finite and the UI says what it did.
 */
export function machineState(band: FieldBand, loop: LoopSpec, xc: number, v: number): EmiState {
  const R = Math.max(loop.resistance, 1e-9);
  const N = loop.turns;
  const k = dOverlapDx(band, loop, xc, v);

  const ow = overlapWidth(band, loop, xc);
  const linkedArea = ow * loop.h;
  const flux = band.B * linkedArea;

  // dΦ/dt = B · h · (d overlap/dx) · v.   Exactly zero when k = 0 or v = 0.
  const dFluxDt = band.B * loop.h * k * v;
  const emf = -N * dFluxDt;
  const current = emf / R;

  // F = N I B h summed over the sides inside the band, and (rIn − lIn) IS k.
  const forceX = N * current * band.B * loop.h * k;

  return {
    xc,
    v,
    placement: placementOf(band, loop, xc),
    overlapWidth: ow,
    linkedArea,
    flux,
    linkage: N * flux,
    dFluxDt,
    emf,
    current,
    sense: current > 0 ? 'ccw' : current < 0 ? 'cw' : 'none',
    forceX,
    // The hand pushes against the magnetic force, so it supplies −F_x·v.
    mechanicalPower: -forceX * v,
    electricalPower: current * current * R,
  };
}

/**
 * Which way the induced current goes and why, in one sentence built from the
 * signs rather than from a lookup table — so it cannot drift out of step with
 * the arrow the canvas draws.
 */
export function lenzSentence(s: EmiState): string {
  if (s.sense === 'none') {
    return s.placement === 'fully-inside'
      ? 'The loop is completely inside the field. The flux through it is large and it is not changing, '
        + 'so there is no EMF and no current at all.'
      : 'Nothing is changing, so there is no EMF. Flux on its own drives nothing.';
  }
  const rising = s.dFluxDt > 0;
  const own = s.sense === 'ccw' ? 'out of the page' : 'into the page';
  return `Flux out of the page is ${rising ? 'rising' : 'falling'}, so the induced current runs `
    + `${s.sense === 'ccw' ? 'counter-clockwise' : 'clockwise'}. Inside the loop its own field points `
    + `${own} — ${rising ? 'against the rise' : 'propping up the fall'}. It opposes the CHANGE, `
    + 'never the field.';
}

// ── Tilt: the same loop, turned away from the field ──────────────────────────

/**
 * Φ = B A cos θ for a loop entirely inside a uniform field, θ measured between
 * the loop's normal and B.
 *
 * Face-on (θ = 0) gives the maximum; edge-on (θ = 90°) gives EXACTLY zero, not
 * "nearly zero" — at 90° the field runs along the plane of the loop and threads
 * none of it. `Math.cos(Math.PI/2)` is 6.1e-17, so the 90° case is snapped, and
 * the comment says so rather than the sim quietly printing 1e-17 Wb.
 */
export function tiltedFlux(B: number, area: number, turns: number, tiltDeg: number): number {
  const t = ((tiltDeg % 360) + 360) % 360;
  if (t === 90 || t === 270) return 0;
  return turns * B * area * Math.cos((t * Math.PI) / 180);
}

/** The projected area a field "sees" — the thing that actually matters. */
export function projectedArea(area: number, tiltDeg: number): number {
  const t = ((tiltDeg % 360) + 360) % 360;
  if (t === 90 || t === 270) return 0;
  return area * Math.cos((t * Math.PI) / 180);
}

// ── Rotation: the loop that never stops changing its flux ────────────────────

export interface GeneratorSpec {
  /** T. */ B: number;
  /** m². */ area: number;
  turns: number;
  /** rad/s. */ omega: number;
  /** Ω. */ resistance: number;
}

export interface GeneratorState {
  t: number;
  /** Wb, one turn: Φ = B A cos ωt. */
  flux: number;
  /** V: emf = −N dΦ/dt = N B A ω sin ωt. */
  emf: number;
  current: number;
  /** V — the peak the sine reaches, N B A ω. */
  peakEmf: number;
}

/**
 * A loop spun at constant ω in a uniform field — the bridge from EMI to AC.
 *
 * This is the SAME Faraday law as the sliding loop, and its output is a sine
 * wave, which is where the AC bench's waveform comes from. Building it here
 * rather than inventing a sine source in the AC engine is design law #4: the
 * alternating voltage on the next page is this loop, still turning.
 */
export function generatorState(g: GeneratorSpec, t: number): GeneratorState {
  const peakEmf = g.turns * g.B * g.area * g.omega;
  const emf = peakEmf * Math.sin(g.omega * t);
  return {
    t,
    flux: g.B * g.area * Math.cos(g.omega * t),
    emf,
    current: emf / Math.max(g.resistance, 1e-9),
    peakEmf,
  };
}
