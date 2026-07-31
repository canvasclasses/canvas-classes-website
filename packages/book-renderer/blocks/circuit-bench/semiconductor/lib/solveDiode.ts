/*
 * semiconductor/lib/solveDiode.ts — nonlinear circuits, on the LINEAR solver.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * ── WHY THERE IS NO SECOND SOLVER HERE ──────────────────────────────────────
 * A diode is nonlinear and the frozen E3 engine does modified nodal analysis on
 * linear elements. The obvious move — write a Newton–Raphson loop with its own
 * matrix — would put a SECOND solver in a program whose stated invariant is that
 * there is one (`circuit-bench/lib/solve.ts` header: "there is ONE dense linear
 * solver in this program and this is not a second one").
 *
 * So instead: in each piecewise state a diode IS a linear element, and this file
 * enumerates the states, hands each version to the frozen `solveCircuit`, and
 * keeps the ones that turn out to be self-consistent. That is the same
 * assume-then-test fixed point `mechanics-bench` uses for static-versus-kinetic
 * friction — the pattern that caught the `{mB: 2.742, mA: 0}` bug during Phase 1.
 *
 * It has three properties a Newton loop does not:
 *   • it always terminates — the state space is finite and enumerated;
 *   • it cannot converge to a wrong root, because every candidate is TESTED;
 *   • it reports honestly when NO state is consistent or when several are, rather
 *     than returning the last iterate and calling it an answer.
 *
 * Cost: 2ⁿ for n plain diodes, 3ⁿ with Zeners. A bridge rectifier is 16 solves
 * of a five-node circuit, which is microseconds. There is no exercise in this
 * chapter with enough devices for that to matter, and `MAX_DEVICES` refuses
 * rather than hanging if one ever appears.
 *
 * ── HOW A DIODE BECOMES A FROZEN-ENGINE ELEMENT ─────────────────────────────
 * Using ONLY the existing `ComponentKind` values, with no change to the frozen
 * contract (`'diode'` is reported as a wanted kind, not forced in):
 *
 *   off        → `switch` with `open: true`. `resistanceOf` returns OPEN, the
 *                solver drops the branch entirely, and the p.d. across it is
 *                still reported — which is exactly what the consistency test
 *                needs.
 *   forward    → `battery` from anode to cathode with EMF = −V_knee.
 *                netlist.ts defines `a` as the − terminal, so the branch equation
 *                V(a) − V(b) = −EMF gives V(anode) − V(cathode) = +V_knee. With
 *                `internal: 0` it is a zero-resistance branch, so MNA gives it
 *                its own current unknown and enforces the drop EXACTLY — no
 *                1e-9 Ω fudge, no ill-conditioning. A bulk resistance, if the
 *                author sets one, goes in as `internal` and it is stamped as a
 *                genuine conductance instead.
 *   breakdown  → the same battery with EMF = +V_Z, giving
 *                V(anode) − V(cathode) = −V_Z.
 *
 * The sign conventions are the frozen engine's own, not new ones, so a current
 * reported here means the same thing as a current anywhere else in E3.
 */

import type { Circuit, CircuitComponent, CircuitSolution } from '../../types';
import { solveCircuit } from '../../lib/solve';
import { cloneCircuit } from '../../lib/netlist';
import {
  allowedStates, stateIsConsistent, type DiodeSpec, type DiodeState,
} from './diode';

/** Refuse rather than hang. 8 plain diodes = 256 solves; nothing in this
 *  chapter has more than 4. */
export const MAX_DEVICES = 8;

export interface DiodeSolution {
  /** The solved circuit — with every diode replaced by its consistent companion,
   *  so a caller can read currents and potentials the ordinary way. */
  circuit: Circuit;
  solution: CircuitSolution;
  /** What each diode turned out to be doing, keyed by diode id. */
  states: Record<string, DiodeState>;
  /** V(anode) − V(cathode) per diode. */
  drops: Record<string, number>;
  /** Current anode → cathode per diode. */
  currents: Record<string, number>;
  /** How many state combinations were tried, and how many were consistent. */
  tried: number;
  consistentCount: number;
  /** True when no combination was consistent — reported, never papered over. */
  unsolved: boolean;
  /** True when more than one was. A piecewise-linear model genuinely admits this
   *  for some pathological topologies; saying so beats picking silently. */
  ambiguous: boolean;
  warnings: string[];
}

/**
 * Replace one diode by the two-terminal element its assumed state makes it.
 *
 * The placeholder in the authored circuit is a `switch` carrying the diode's id,
 * so the topology is complete and drawable before any state is chosen — and an
 * open switch IS the correct representation of a non-conducting diode, which is
 * why that placeholder was picked over an invented kind.
 */
function companion(d: DiodeSpec, state: DiodeState): CircuitComponent {
  const label = d.label ?? d.id;
  if (state === 'off') {
    return {
      id: d.id, kind: 'switch', a: d.anode, b: d.cathode, value: 0,
      open: true, label,
    };
  }
  const emf = state === 'forward' ? -d.knee : d.breakdown;
  const internal = state === 'forward' ? d.bulk : d.zenerResistance;
  return {
    id: d.id, kind: 'battery', a: d.anode, b: d.cathode, value: emf,
    internal: internal > 0 ? internal : undefined, label,
  };
}

/** Every combination of states, as an array of arrays. */
function combinations(devices: DiodeSpec[]): DiodeState[][] {
  let out: DiodeState[][] = [[]];
  for (const d of devices) {
    const next: DiodeState[][] = [];
    for (const partial of out) for (const s of allowedStates(d)) next.push([...partial, s]);
    out = next;
  }
  return out;
}

/**
 * Solve a circuit containing diodes.
 *
 * `base` must already contain a placeholder component with each diode's id (the
 * archetypes build it that way); the placeholder is swapped for the companion
 * element of the assumed state. A diode whose id is not in the circuit is an
 * authoring error and is reported rather than ignored — silently dropping a
 * device would produce a plausible answer to a different circuit.
 */
export function solveDiodeCircuit(
  base: Circuit,
  devices: DiodeSpec[],
  opts: { ground?: string; probes?: [string, string] } = {},
): DiodeSolution {
  const warnings: string[] = [];

  if (devices.length > MAX_DEVICES) {
    return {
      circuit: base,
      solution: {
        potentials: {}, currents: {}, voltages: {}, power: {}, singular: true,
        warnings: [`This circuit has ${devices.length} nonlinear devices; the state search is capped at ${MAX_DEVICES}.`],
      },
      states: {}, drops: {}, currents: {},
      tried: 0, consistentCount: 0, unsolved: true, ambiguous: false,
      warnings: [`Too many nonlinear devices (${devices.length} > ${MAX_DEVICES}).`],
    };
  }

  const ids = new Set(base.components.map((c) => c.id));
  for (const d of devices) {
    if (!ids.has(d.id)) {
      warnings.push(
        `Diode "${d.id}" has no placeholder component in the circuit, so it was added between `
        + `${d.anode} and ${d.cathode}. Author the placeholder to control where it is drawn.`,
      );
    }
  }

  const combos = combinations(devices);
  const consistent: { states: DiodeState[]; circuit: Circuit; solution: CircuitSolution }[] = [];

  for (const states of combos) {
    const trial = cloneCircuit(base);
    trial.components = trial.components.filter((c) => !devices.some((d) => d.id === c.id));
    devices.forEach((d, i) => trial.components.push(companion(d, states[i])));

    const sol = solveCircuit(trial, opts);
    if (sol.singular) continue;

    const ok = devices.every((d, i) => stateIsConsistent(
      d, states[i], sol.voltages[d.id] ?? 0, sol.currents[d.id] ?? 0,
    ));
    if (ok) consistent.push({ states, circuit: trial, solution: sol });
  }

  if (!consistent.length) {
    // Genuinely no consistent assignment. Fall back to all-off so a caller has a
    // drawable circuit, and SAY the answer is not trustworthy — the alternative
    // is a blank panel that gives no clue what went wrong.
    const trial = cloneCircuit(base);
    trial.components = trial.components.filter((c) => !devices.some((d) => d.id === c.id));
    devices.forEach((d) => trial.components.push(companion(d, 'off')));
    const sol = solveCircuit(trial, opts);
    return {
      circuit: trial,
      solution: sol,
      states: Object.fromEntries(devices.map((d) => [d.id, 'off' as DiodeState])),
      drops: Object.fromEntries(devices.map((d) => [d.id, sol.voltages[d.id] ?? 0])),
      currents: Object.fromEntries(devices.map((d) => [d.id, 0])),
      tried: combos.length,
      consistentCount: 0,
      unsolved: true,
      ambiguous: false,
      warnings: [
        ...warnings,
        `No consistent diode state was found in ${combos.length} combinations. This usually means two `
        + 'ideal sources are fighting across one pair of nodes, or a diode is short-circuited by a wire.',
      ],
    };
  }

  const winner = consistent[0];
  return {
    circuit: winner.circuit,
    solution: winner.solution,
    states: Object.fromEntries(devices.map((d, i) => [d.id, winner.states[i]])),
    drops: Object.fromEntries(devices.map((d) => [d.id, winner.solution.voltages[d.id] ?? 0])),
    currents: Object.fromEntries(devices.map((d) => [d.id, winner.solution.currents[d.id] ?? 0])),
    tried: combos.length,
    consistentCount: consistent.length,
    unsolved: false,
    ambiguous: consistent.length > 1,
    warnings: consistent.length > 1
      ? [...warnings, `${consistent.length} different diode-state assignments all solve this circuit — the piecewise model does not pick between them.`]
      : warnings,
  };
}

/**
 * Set a source's EMF and re-solve. Used by the rectifier sweep, which is the
 * same circuit solved at 240 phases of the input sinusoid.
 *
 * ⚠ THIS IS A QUASI-STATIC SWEEP AND IT IS ONLY VALID BECAUSE THERE IS NO
 * REACTANCE. Every element in these rectifier circuits is a resistor, a source
 * or a diode, so the circuit has no memory and its state at each instant depends
 * only on the input at that instant. Add a smoothing capacitor and this stops
 * being true — the frozen DC solver treats a capacitor as an open circuit and
 * would silently return the unsmoothed answer. `rectifier.ts` therefore computes
 * ripple analytically and labels it, rather than pretending this sweep can do it.
 */
export function withSourceEmf(
  base: Circuit, sourceIds: string | string[], emf: number,
): Circuit {
  // ⚠ AN ARRAY, NOT A STRING. A centre-tapped transformer is TWO source halves
  // driven by one winding, and a first version of this took a single id — so the
  // lower half stayed at 0 V for the whole sweep and the centre-tap rectifier
  // silently behaved as a half-wave one: average V_p/π instead of 2V_p/π, ripple
  // 1.21 instead of 0.48, and the negative half missing from a circuit whose
  // entire purpose is that the negative half is there. tsc could not see it and
  // the waveform looked plausible. The verifier now asserts the centre-tap
  // average against 2V_p/π, which is the check that caught it.
  const ids = new Set(Array.isArray(sourceIds) ? sourceIds : [sourceIds]);
  const c = cloneCircuit(base);
  c.components = c.components.map((x) => (ids.has(x.id) ? { ...x, value: emf } : x));
  return c;
}
