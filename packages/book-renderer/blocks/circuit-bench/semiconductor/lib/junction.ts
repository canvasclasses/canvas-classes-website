/*
 * semiconductor/lib/junction.ts — the barrier a junction builds for itself.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * ── THE IDEA THE WHOLE BENCH IS FOR ─────────────────────────────────────────
 * A diode is not a component with a rule attached. Join p-type to n-type and
 * NOBODY applies a voltage: electrons diffuse across, holes diffuse the other
 * way, and the moment they leave they uncover the fixed ionised dopants they
 * came from. Those exposed ions are charged and immobile, so a field appears —
 * pointing the wrong way for further diffusion — and it grows until it exactly
 * stops the diffusion it was created by. That standoff IS the depletion region,
 * and the potential across it is the built-in potential:
 *
 *      V_bi = V_T · ln( N_A · N_D / nᵢ² )
 *
 * which for silicon at ordinary doping comes out around 0.7 V — the same 0.7 V
 * that shows up as the knee. That is not a coincidence, and it is the connection
 * this file exists to make computable.
 *
 * Forward bias pushes against the barrier, so the barrier shrinks and the
 * depletion layer narrows. Reverse bias adds to it, so it widens. Both come out
 * of ONE formula with the sign of V, not two rules.
 *
 * ── THE MODEL, AND EXACTLY WHERE IT STOPS BEING VALID ───────────────────────
 * Abrupt (step) junction, depletion approximation: the transition regions are
 * taken as fully depleted and the bulk as neutral. Standard, and it is what
 * every textbook derivation uses. It fails as V → V_bi, where the real width
 * tends to a small non-zero value while this formula tends to zero. The
 * conventional validity limit is V ≲ V_bi − 4V_T, and `depletion()` reports
 * `beyondApproximation` rather than quietly drawing a junction of zero width.
 */

import {
  carriers, permittivity, Q_ELECTRON, thermalVoltage, T_ROOM, type Material,
} from './materials';

export interface JunctionSpec {
  material: Material;
  /** Acceptor density on the p-side, per m³. */
  na: number;
  /** Donor density on the n-side, per m³. */
  nd: number;
  temperatureK?: number;
}

/**
 * Built-in potential, volts.
 *
 * ⚠ IT IS DERIVED FROM THE SAME EXPRESSION AS THE BAND OFFSETS. `materials.ts`
 * `fermiOffsetEv` gives V_T·ln(n/nᵢ) per side; the two sides sum to
 * V_T·ln(N_A N_D/nᵢ²), which is this. So the band diagram's total bend and the
 * built-in potential are one number computed once — they cannot disagree, and
 * the verifier checks that they do not.
 */
export function builtInPotential(j: JunctionSpec): number {
  const vt = thermalVoltage(j.temperatureK ?? T_ROOM);
  const ni = j.material.intrinsicPerM3;
  return vt * Math.log((j.na * j.nd) / (ni * ni));
}

export interface DepletionResult {
  /** Applied bias, V. Positive = forward (p-side made positive). */
  bias: number;
  builtIn: number;
  /** The barrier that is actually there now: V_bi − V_applied. */
  barrier: number;
  /** The barrier the GEOMETRY was computed from — equal to `barrier` except when
   *  it has been clamped past the validity limit. Exposed so `bandProfile` uses
   *  the same number and the drawn bend can never disagree with the drawn width. */
  barrierUsed: number;
  /** Total depletion width, m. */
  width: number;
  /** How far it reaches into the p-side and the n-side, m. */
  intoP: number;
  intoN: number;
  /** Peak field at the junction plane, V/m. */
  peakField: number;
  /** Junction capacitance per unit area, F/m² — εA/W, which is why a reverse
   *  biased diode is a voltage-controlled capacitor (a varactor). */
  capacitancePerArea: number;
  /** True once the depletion approximation has stopped being trustworthy. */
  beyondApproximation: boolean;
  /** Why, in words, when it has. */
  note?: string;
}

/**
 * Depletion width and field at a given bias.
 *
 *      W = √( 2ε(V_bi − V)/q · (1/N_A + 1/N_D) )
 *      x_p/x_n = N_D/N_A          (equal charge on both sides)
 *      E_max = 2(V_bi − V)/W
 *
 * The asymmetry matters and is not cosmetic: dope one side 100× harder and the
 * depletion region sits almost entirely in the LIGHTLY doped side, because the
 * two sides must expose equal amounts of charge and the lightly doped side needs
 * more volume to do it. That is why a real diode's n⁺ region is invisible on a
 * band diagram and why the p-side does all the depleting.
 */
export function depletion(j: JunctionSpec, bias = 0): DepletionResult {
  const vt = thermalVoltage(j.temperatureK ?? T_ROOM);
  const eps = permittivity(j.material);
  const vbi = builtInPotential(j);
  const barrierRaw = vbi - bias;

  // Clamp so a forward bias past V_bi cannot produce a NaN width. Reported, not
  // hidden: the flag and the note travel with the result.
  const limit = 4 * vt;
  const beyond = barrierRaw < limit;
  const barrier = Math.max(barrierRaw, limit * 0.25);

  const width = Math.sqrt((2 * eps * barrier / Q_ELECTRON) * (1 / j.na + 1 / j.nd));
  const intoP = (width * j.nd) / (j.na + j.nd);
  const intoN = (width * j.na) / (j.na + j.nd);

  return {
    bias,
    builtIn: vbi,
    barrier: barrierRaw,
    barrierUsed: barrier,
    width,
    intoP,
    intoN,
    peakField: (2 * barrier) / width,
    capacitancePerArea: eps / width,
    beyondApproximation: beyond,
    ...(beyond
      ? {
        note:
          'Forward bias is now within a few kT/q of the built-in potential, where the depletion '
          + 'approximation stops being valid — the real layer narrows to a small non-zero width '
          + 'rather than to nothing. The width shown is clamped, and this is where the diode is '
          + 'conducting hard anyway.',
      }
      : {}),
  };
}

// ── The band diagram ─────────────────────────────────────────────────────────

export interface BandProfile {
  /** Position along the device, m, from deep in the p-side to deep in the n-side.
   *  x = 0 is the junction plane. */
  x: number[];
  /** Conduction-band edge, eV, measured from the Fermi level (which is FLAT at
   *  equilibrium and is the zero of this scale). */
  ec: number[];
  /** Valence-band edge, eV, same reference. */
  ev: number[];
  /** Quasi-Fermi reference — flat at zero under no bias, and split by the applied
   *  voltage under bias. Drawn because "the Fermi level is flat at equilibrium"
   *  is the statement that makes the bend necessary. */
  efP: number[];
  efN: number[];
  /** Total bend, eV — equal to the barrier, which is V_bi − V. */
  bendEv: number;
  /** Where the depletion region starts and ends, m. */
  depletionFrom: number;
  depletionTo: number;
}

/**
 * The band diagram, computed rather than drawn by hand.
 *
 * Outside the depletion region the bands are FLAT — that is what "neutral bulk"
 * means, and drawing them sloped (a common textbook-figure error) would imply a
 * field, and therefore a current, in a resistanceless region.
 *
 * Inside it, the potential is the exact solution of Poisson's equation for a step
 * junction: parabolic on each side, meeting with matched slope at the junction
 * plane. Since the bands are −q·φ, they are parabolic too. Getting this right is
 * what makes the peak field at the junction plane and the total bend agree with
 * `depletion()`.
 */
export function bandProfile(j: JunctionSpec, bias = 0, samples = 160): BandProfile {
  const dep = depletion(j, bias);
  const eg = j.material.bandGapEv;
  const vt = thermalVoltage(j.temperatureK ?? T_ROOM);

  // Fermi level relative to the mid-gap intrinsic level, per side. Negative on
  // the p-side (E_F sits toward the valence band), positive on the n-side.
  const cP = carriers(j.material, 'p-type', j.na);
  const cN = carriers(j.material, 'n-type', j.nd);
  const offP = vt * Math.log(cP.electrons / j.material.intrinsicPerM3);
  const offN = vt * Math.log(cN.electrons / j.material.intrinsicPerM3);

  // Conduction-band edge above the LOCAL Fermi level, deep in each bulk.
  // Their difference is offN − offP = V_T·ln(N_A N_D/nᵢ²) = V_bi exactly — the
  // same expression `builtInPotential` returns, which is the consistency the
  // header promises and the verifier checks.
  const ecN = eg / 2 - offN;

  // Everything is measured from the n-side Fermi level, taken as zero. Under
  // forward bias the p-side is raised in POTENTIAL, so electron energies there
  // are LOWERED by qV — hence the p-side quasi-Fermi level sits at −V, and the
  // total band bend is the barrier V_bi − V rather than the equilibrium V_bi.
  const vb = dep.barrierUsed;
  const ecPbiased = ecN + vb;

  const xp = Math.max(dep.intoP, 1e-18);
  const xn = Math.max(dep.intoN, 1e-18);
  const wtot = Math.max(dep.width, 1e-18);

  /**
   * Electrostatic potential, volts, measured from the p-side depletion edge.
   * The exact solution of Poisson's equation for a step junction: parabolic on
   * each side, and the two halves meet at x = 0 with matched value AND slope,
   * because φ(0) = V_b·x_p/W from both directions. Outside the depletion region
   * φ is constant — the bands there are FLAT, which is what "neutral bulk" means.
   * Sloping them (a common textbook-figure error) would imply a field, and so a
   * current, in a region with no resistance.
   */
  const phi = (xi: number): number => {
    if (xi <= -dep.intoP) return 0;
    if (xi >= dep.intoN) return vb;
    if (xi <= 0) return vb * (xp / wtot) * Math.pow((xi + xp) / xp, 2);
    return vb - vb * (xn / wtot) * Math.pow((xn - xi) / xn, 2);
  };

  /**
   * ⚠ THIS PADDING MUST MATCH `view.ts junctionLimits`, WHICH USES 0.55·W.
   * It was 1.6·W here, so the profile extended further than the axis the view drew
   * it on and the ends of both bands were clipped outside the plot rect — caught by
   * the "nothing is drawn outside the rect" check, and invisible on screen because
   * the interesting part is in the middle. If either padding changes, change both;
   * the verifier asserts they agree.
   */
  const pad = Math.max(dep.width, 1e-9) * 0.55;
  const xMin = -(dep.intoP + pad);
  const xMax = dep.intoN + pad;

  const x: number[] = [];
  const ec: number[] = [];
  const ev: number[] = [];
  const efP: number[] = [];
  const efN: number[] = [];

  for (let k = 0; k <= samples; k++) {
    const xi = xMin + ((xMax - xMin) * k) / samples;
    x.push(xi);
    const e = ecPbiased - phi(xi);
    ec.push(e);
    ev.push(e - eg);
    // The two quasi-Fermi levels are split by exactly the applied voltage. Drawing
    // them is what makes "the Fermi level is flat" visibly an EQUILIBRIUM
    // statement rather than a universal one.
    efP.push(xi <= 0 ? -bias : 0);
    efN.push(xi >= 0 ? 0 : -bias);
  }

  return {
    x, ec, ev, efP, efN,
    bendEv: vb,
    depletionFrom: -dep.intoP,
    depletionTo: dep.intoN,
  };
}

/**
 * The ionised-dopant charge profile — the thing that makes the field.
 *
 * Negative acceptor ions on the p-side, positive donor ions on the n-side,
 * exactly equal in total. Returned as blocks rather than a sampled curve because
 * the step-junction charge density IS piecewise constant, and sampling a step
 * function only invents intermediate values that are not there.
 */
export interface ChargeBlocks {
  /** [from, to] in m, and charge density in C/m³. */
  blocks: { from: number; to: number; rho: number }[];
  /** Total exposed charge per unit area on each side, C/m². Equal and opposite —
   *  the verifier checks it. */
  chargeP: number;
  chargeN: number;
}

export function chargeProfile(j: JunctionSpec, bias = 0): ChargeBlocks {
  const dep = depletion(j, bias);
  return {
    blocks: [
      { from: -dep.intoP, to: 0, rho: -Q_ELECTRON * j.na },
      { from: 0, to: dep.intoN, rho: Q_ELECTRON * j.nd },
    ],
    chargeP: -Q_ELECTRON * j.na * dep.intoP,
    chargeN: Q_ELECTRON * j.nd * dep.intoN,
  };
}
