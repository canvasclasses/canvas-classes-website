/*
 * circuit-bench/lib/misconceptions.ts — every `targets` code, actually wired.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM.
 *
 * Design law #2: a wrong answer must map to a NAMED misconception and the
 * feedback must attack that specific misconception. Declaring `targets` on an
 * archetype is a promise; this file is where the promise gets kept. Two halves:
 *
 *   CIRCUIT_ISSUES  — the standing message + hint for EVERY code in
 *                     `CircuitMisconception`, shown when the student's prediction
 *                     misses (and never before they have committed to one). The
 *                     `Record<CircuitMisconception, CircuitIssue>` annotation is
 *                     load-bearing: it makes adding a code without copy a COMPILE
 *                     ERROR, which is the guard that keeps the "declared but
 *                     dead" defect out. Never weaken it to a Partial.
 *   detectIssues()  — reads the SOLVED DC circuit and raises the codes that
 *                     circuit currently demonstrates, with its own numbers in the
 *                     sentence. "Your wire carries 2 A and has 0 V across it"
 *                     beats a generic warning by a mile. It covers the nine DC
 *                     codes only; the AC codes have no DC state to detect and are
 *                     raised by `ac/AcBench.tsx` instead — see the note beside
 *                     them in the table.
 *
 * If you add a code to `CircuitMisconception`, add it here too — a code with no
 * entry is a declared-but-dead target, which is the exact defect the Phase-1
 * audit found 22 of.
 *
 * ⚠ NOT EVERY CODE IS RAISED BY `detectIssues`, AND THAT IS FINE. `detectIssues`
 * reads a solved resistor network, so it can only raise beliefs that are visible
 * in a node potential or a branch current. The AC and semiconductor codes are
 * raised instead by their own benches, from their own evidence gates, and each
 * entry below records which gate. What is NOT fine is a code with no copy — the
 * exhaustive `Record` annotation makes that a compile error.
 */

import type {
  Circuit, CircuitComponent, CircuitIssue, CircuitMisconception, CircuitSolution,
} from '../types';
import {
  ZERO_R, activeComponents, degreeOf, emfOf, labelOf, pairKey, resistanceOf,
} from './netlist';
import { fmtAmp, fmtOhm, fmtVolt, fmtWatt, sig } from './format';

/** The standing statement of each misconception, and what to do about it. */
export const CIRCUIT_ISSUES: Record<CircuitMisconception, CircuitIssue> = {
  series_parallel_by_appearance: {
    code: 'series_parallel_by_appearance',
    message:
      'Series and parallel are not about how the circuit is DRAWN. Two resistors '
      + 'side by side on the page can be in parallel; two drawn as a neat ladder can be in series.',
    hint:
      'Ask only one question: which NODES do they share? Both ends shared → parallel. '
      + 'Meeting at a point with nothing else on it → series. Nothing else counts as evidence.',
  },
  current_used_up: {
    code: 'current_used_up',
    message:
      'Current is not used up as it goes round. Charge cannot pile up inside a bulb, '
      + 'so exactly as much comes out of it as went in.',
    hint:
      'What a bulb uses up is ENERGY, not charge. Energy per coulomb (the p.d.) drops '
      + 'across it; coulombs per second (the current) does not.',
  },
  battery_constant_current: {
    code: 'battery_constant_current',
    message:
      'A cell is not a current source. It holds a roughly fixed EMF; the current that '
      + 'results is whatever the circuit lets through — change the resistance and the current changes.',
    hint:
      'And the terminal p.d. is not fixed either: V = EMF − I·r. Draw more current from a '
      + 'real cell and its own internal resistance eats more of the EMF.',
  },
  voltage_across_wire: {
    code: 'voltage_across_wire',
    message:
      'An ideal wire has no resistance, so there is NO potential difference across it '
      + 'however much current it carries. Everything joined by wire alone is one point.',
    hint:
      'V = I·R, and R = 0 makes V = 0 for any I. That is why a wire can be redrawn as a '
      + 'dot without changing a single number.',
  },
  meter_is_ideal: {
    code: 'meter_is_ideal',
    message:
      'A real meter changes the circuit it is measuring. An ammeter has some resistance '
      + 'and reduces the current it reports; a voltmeter draws some current and reduces the p.d. it reports.',
    hint:
      'Ammeter → low resistance, in SERIES. Voltmeter → high resistance, in PARALLEL. '
      + 'The null method (potentiometer) beats both, because at balance it draws no current at all.',
  },
  more_resistors_more_resistance: {
    code: 'more_resistors_more_resistance',
    message:
      'Adding a resistor in PARALLEL lowers the total resistance. It is only in series '
      + 'that more resistors mean more resistance.',
    hint:
      'A parallel resistor is another lane on the road — you have not made the road narrower, '
      + 'you have widened it. R_parallel is always smaller than the smallest branch.',
  },
  brightness_by_position: {
    code: 'brightness_by_position',
    message:
      'A bulb is not brighter for being "nearer the +". The current does not know which '
      + 'terminal it left first — brightness is P = I²R, and nothing in that depends on position.',
    hint:
      'Swap two bulbs round in the same circuit and the readings swap with them. '
      + 'Compare currents and resistances, never places on the page.',
  },
  short_circuit_ignored: {
    code: 'short_circuit_ignored',
    message:
      'A wire across a component short-circuits it. Both its ends are then the same point, '
      + 'so there is no p.d. across it and NO current through it — it may as well not be there.',
    hint:
      'Current takes every path, in inverse proportion to resistance. Beside a 0 Ω path, '
      + 'a resistor gets nothing.',
  },
  balanced_bridge_carries_current: {
    code: 'balanced_bridge_carries_current',
    message:
      'At balance the galvanometer carries exactly ZERO current — not "a little". '
      + 'Its two ends sit at the same potential, so nothing pushes charge across it.',
    hint:
      'That is why the balance condition P/Q = R/S has no G in it at all: the answer does '
      + 'not depend on the galvanometer, which is what makes the method precise.',
  },

  // ── AC and transients (unit 11) ────────────────────────────────────────────
  // `detectIssues` below does NOT raise these, and that is correct rather than an
  // omission: it inspects a solved DC circuit, where there is no frequency and no
  // phase to inspect. These nine are declared by an AC archetype's `targets` and
  // rendered by `ac/AcBench.tsx` from evidence the student has already seen — a
  // full cycle of p(t) traced, the sweep crossed through f₀, the phasor turned.
  // Every one of them has a live render site; none is a declared-but-dead code.
  reactance_is_a_resistance: {
    code: 'reactance_is_a_resistance',
    message:
      'Reactance is measured in ohms and is not a resistance. A resistance turns electrical energy '
      + 'into heat; a reactance stores it and hands every joule back, half a cycle later.',
    hint:
      'And a resistance does not care about frequency. X_L = 2πfL climbs with it, X_C = 1/(2πfC) falls '
      + 'with it — so the same coil is a short circuit at DC and a wall at 1 MHz.',
  },
  impedances_add_arithmetically: {
    code: 'impedances_add_arithmetically',
    message:
      'Z is not R + X_L + X_C. The three do not point the same way, so they add as PHASORS: '
      + 'Z = √(R² + (X_L − X_C)²).',
    hint:
      'Try it: R = 30 Ω, X_L = 80 Ω, X_C = 40 Ω. Added up that is 150 Ω; done properly it is '
      + '√(900 + 1600) = 50 Ω. Three times out, and the arithmetic version can never fall below R.',
  },
  element_voltages_add_arithmetically: {
    code: 'element_voltages_add_arithmetically',
    message:
      'V_R + V_L + V_C does not equal the supply voltage, and nothing is broken. They add as phasors: '
      + '√(V_R² + (V_L − V_C)²) is what has to match.',
    hint:
      'At resonance V_L and V_C can each be many times the supply, exactly opposite, cancelling in the '
      + 'sum and not in the readings. That is a real effect and it is how a radio picks one station.',
  },
  reactive_element_dissipates_power: {
    code: 'reactive_element_dissipates_power',
    message:
      'A pure inductor or a pure capacitor dissipates NOTHING on average, however large the current '
      + 'through it. Over a full cycle it takes exactly as much energy as it gives back.',
    hint:
      'Watch p = v·i on the trace. It swings positive and negative in equal measure, and the average '
      + 'over one cycle is zero to the last digit. Only the resistor has a p that never goes negative.',
  },
  resonance_is_maximum_impedance: {
    code: 'resonance_is_maximum_impedance',
    message:
      'At series resonance the impedance is at its MINIMUM, not its maximum — and the current at its '
      + 'largest. X_L and X_C have cancelled, leaving nothing but R.',
    hint:
      'Sweep the frequency and watch |Z| dip to exactly R while the phase passes through zero. '
      + 'Below resonance the capacitor dominates; above it the coil does; at it, neither.',
  },
  rms_is_the_cycle_average: {
    code: 'rms_is_the_cycle_average',
    message:
      'The average of a sine over a full cycle is zero, so "average" cannot be the useful number. '
      + 'RMS is the root of the mean of the SQUARE — and squaring is what removes the sign.',
    hint:
      'V_rms is the DC voltage that would heat the same resistor at the same rate, because heating goes '
      + 'as V², not as V. For a sine it works out at exactly V_peak/√2.',
  },
  phasor_is_a_different_quantity: {
    code: 'phasor_is_a_different_quantity',
    message:
      'The phasor diagram is not a second picture of a related idea. It is the SAME numbers: the height '
      + 'of the rotating arrow is the value on the wave, at every instant.',
    hint:
      'Drag the arrow round by hand and the dot on the trace follows it exactly. Phase difference is the '
      + 'fixed ANGLE between two arrows — which is why it stays constant while both of them turn.',
  },
  lc_current_stops_when_capacitor_empties: {
    code: 'lc_current_stops_when_capacitor_empties',
    message:
      'When the capacitor is fully discharged the current is at its MAXIMUM, not zero. The energy has '
      + 'not gone — it is all in the inductor\'s magnetic field, and it will recharge the capacitor the other way round.',
    hint:
      'Watch the two energy bars trade places. The moment one is empty the other is full, and their '
      + 'sum never moves. It is exactly a mass on a spring passing through the middle at full speed.',
  },
  transformer_creates_power: {
    code: 'transformer_creates_power',
    message:
      'A step-up transformer does not create power. It trades voltage for current at a constant '
      + 'product: ten times the volts means a tenth of the amps available.',
    hint:
      'Look at the two power rows — primary and secondary — and at the two products V·I. '
      + 'An ideal transformer keeps them equal; a real one makes the secondary\'s slightly smaller, never bigger.',
  },
  // ── Semiconductors (unit 13) ───────────────────────────────────────────────
  //
  // ⚠ THESE SEVEN ARE NOT RAISED BY `detectIssues`. That function reads a SOLVED
  // resistor network and reports what the numbers currently demonstrate; a belief
  // about carrier concentrations or a band diagram is not visible in a node
  // potential. The Semiconductor Bench renders them from its own evidence gates
  // instead — listed against each code below — and every gate requires the student
  // to have SEEN the contradicting thing first.
  doping_adds_both_carriers: {
    code: 'doping_adds_both_carriers',
    belief:
      'Doping adds carriers, so a doped semiconductor has more of both electrons and holes.',
    message:
      'Doping TRADES one carrier for the other. n·p = nᵢ² always, at a fixed temperature — so if '
      + 'the electrons go up by a factor of a million, the holes go DOWN by a factor of a million '
      + 'and the product has not moved at all.',
    hint:
      'The extra electrons fill holes. Watch the two counts while you drag the dopant slider: their '
      + 'product stays pinned at nᵢ² through five decades of doping. That is the law of mass action, '
      + 'and it is the whole reason a junction can have a majority side and a minority side.',
    // Gate: DopingView, once the dopant slider has moved AND the hole count is on
    // screen — the product staying still is the punchline, so it cannot come first.
  },
  depletion_region_is_empty_space: {
    code: 'depletion_region_is_empty_space',
    belief: 'The depletion region is a gap in the material where the atoms have been used up.',
    message:
      'Nothing is missing from the depletion region. Every silicon atom is exactly where it was — '
      + 'what has gone is the MOBILE carriers, leaving the fixed dopant ions uncovered and therefore '
      + 'charged. It is depleted of carriers, not of matter.',
    hint:
      'Turn on the ion view: negative acceptor ions on the p-side, positive donor ions on the '
      + 'n-side, and exactly equal amounts of each. They cannot move — they are part of the crystal '
      + '— which is why their field stays put and holds the barrier up.',
    // Gate: JunctionView, once the ions have been revealed (reveal rung 2).
  },
  forward_and_reverse_are_different_rules: {
    code: 'forward_and_reverse_are_different_rules',
    belief:
      'Forward and reverse bias are two different rules — one lets current through, the other blocks it.',
    message:
      'They are ONE formula with the sign of V in it: the barrier is V_bi − V, and the depletion '
      + 'width goes as its square root. Forward bias makes the barrier smaller, reverse makes it '
      + 'bigger. Nothing is being blocked; a hill is being raised.',
    hint:
      'Watch the width readout as you drag through zero — it moves continuously and never jumps. If '
      + 'there were two rules there would be a discontinuity at V = 0, and there is not.',
    // Gate: JunctionView, once the bias slider has been moved through zero.
  },
  diode_has_a_resistance: {
    code: 'diode_has_a_resistance',
    belief: 'A conducting diode has a resistance of about 0.7 V divided by the current.',
    message:
      'A diode has no resistance in the Ohm\'s-law sense, because I is not proportional to V — it is '
      + 'exponential in V. Divide V by I at two points on the forward branch and you get two '
      + 'different numbers, which is the definition of a non-ohmic device.',
    hint:
      'At 0.65 V the current is about 0.14 mA, so "R" is 4.6 kΩ. At 0.75 V it is about 7 mA, so "R" '
      + 'is 107 Ω. Same diode, 43 times the resistance, and neither number means anything. What IS '
      + 'constant is the 59.5 mV it takes to multiply the current by ten.',
    // Gate: DiodeView, once the LOG axis has been used — the knee visibly vanishing
    // is the evidence, and the card would be a spoiler before it.
  },
  breakdown_destroys_a_diode: {
    code: 'breakdown_destroys_a_diode',
    belief:
      'Breakdown destroys a diode, so a Zener must be a special diode that does not break down.',
    message:
      'A Zener breaks down exactly like any other diode — the difference is that it is BUILT to '
      + 'survive it. Heavy doping on both sides makes the depletion layer thin enough for the field '
      + 'to strip electrons out of bonds directly, reversibly, at a sharply defined voltage.',
    hint:
      'What kills an ordinary diode in breakdown is not the voltage, it is the POWER: nothing limits '
      + 'the current, so it cooks. Take the series resistor out and the same thing happens to the '
      + 'Zener. R_S is not a detail of the circuit, it is what makes the circuit possible.',
    // Gate: ZenerView, once the supply has been swept and the flat region has been
    // seen alongside the drop-out.
  },
  collector_current_is_always_beta_ib: {
    code: 'collector_current_is_always_beta_ib',
    belief:
      'Raise the base current far enough and the collector current keeps rising — that is what β means.',
    message:
      'It stops. Once V_CE has fallen to about 0.2 V there is no field left to sweep carriers across '
      + 'the base, so the collector physically cannot take βI_B however much base current arrives. '
      + 'The transistor is SATURATED, and β has stopped applying.',
    hint:
      'Watch the effective β — I_C divided by I_B, measured rather than assumed. In the active '
      + 'region it sits at the rated value. Push into saturation and it falls, and keeps falling. '
      + 'That drop is the measurable signature of a closed switch, and it is why a switch is designed '
      + 'to sit there: at the ends of the curve the exact value of β does not matter.',
    // Gate: TransistorView, once the stage has been driven into saturation and the
    // effective β has visibly parted from the rating.
  },
  amplifier_output_follows_the_input: {
    code: 'amplifier_output_follows_the_input',
    belief:
      'An amplifier makes the signal bigger, so the output looks like the input only larger.',
    message:
      'A common-emitter stage makes it bigger AND UPSIDE DOWN. More base current means more '
      + 'collector current means a bigger drop across R_C, which means the collector voltage goes '
      + 'DOWN. The gain is negative, and that minus sign is geometry, not convention.',
    hint:
      'And "bigger" has a ceiling that is not about β: the output cannot go above V_CC or below '
      + 'about 0.2 V. Widen the input swing until the peaks flatten — that is clipping, and it is '
      + 'why the bias point is put in the MIDDLE of the slope rather than anywhere on it.',
    // Gate: TransistorView, once the gain has been MEASURED by nudging the input and
    // its sign is on screen.
  },
};

export function issueFor(code: CircuitMisconception): CircuitIssue {
  return CIRCUIT_ISSUES[code];
}

// ── Live detection ───────────────────────────────────────────────────────────

const TOL_I = 1e-9;
const TOL_V = 1e-9;

/**
 * Which of the nine this circuit is, right now, a live demonstration of —
 * with its own numbers in the sentence.
 *
 * Ordered so the most specific fires first; the UI shows the ones matching the
 * archetype's declared `targets` at the top and the rest as "also true here".
 */
export function detectIssues(circuit: Circuit, sol: CircuitSolution): CircuitIssue[] {
  if (sol.singular) return [];
  const out: CircuitIssue[] = [];
  const comps = activeComponents(circuit);
  const push = (code: CircuitMisconception, message: string) =>
    out.push({ code, message, hint: CIRCUIT_ISSUES[code].hint });

  // voltage_across_wire — a conductor carrying real current with no p.d.
  const liveWire = comps.find(
    (c) => resistanceOf(c) <= ZERO_R && emfOf(c) === 0
      && Math.abs(sol.currents[c.id] ?? 0) > 1e-6
      && Math.abs(sol.voltages[c.id] ?? 0) < TOL_V,
  );
  if (liveWire) {
    push('voltage_across_wire',
      `${labelOf(liveWire)} is carrying ${fmtAmp(sol.currents[liveWire.id] ?? 0)} and the p.d. `
      + 'across it is exactly 0 V. Its two ends are the same point.');
  }

  // short_circuit_ignored — a real resistance bypassed by a zero-ohm path.
  for (const c of comps) {
    const r = resistanceOf(c);
    if (r <= ZERO_R || !Number.isFinite(r)) continue;
    if (Math.abs(sol.currents[c.id] ?? 0) > TOL_I) continue;
    const bypass = comps.find(
      (x) => x.id !== c.id && pairKey(x) === pairKey(c) && resistanceOf(x) <= ZERO_R,
    );
    if (bypass) {
      push('short_circuit_ignored',
        `${labelOf(c)} is ${fmtOhm(r)} and carries nothing at all — ${labelOf(bypass)} shorts `
        + 'straight across it, so both its ends sit at the same potential.');
      break;
    }
  }

  // balanced_bridge_carries_current — a real bridge arm at exactly zero.
  const bridgeArm = comps.find((c) => {
    const r = resistanceOf(c);
    if (!Number.isFinite(r) || r <= ZERO_R) return false;
    if (Math.abs(sol.currents[c.id] ?? 0) > TOL_I) return false;
    return degreeOf(circuit, c.a) >= 3 && degreeOf(circuit, c.b) >= 3;
  });
  if (bridgeArm) {
    push('balanced_bridge_carries_current',
      `${labelOf(bridgeArm)} sits between two points at ${fmtVolt(sol.potentials[bridgeArm.a] ?? 0)} `
      + 'each. The bridge is balanced, so its current is exactly zero — no matter what its resistance is.');
  }

  // current_used_up — the same current in every element of a series chain.
  const chain = seriesChain(circuit, sol);
  if (chain) {
    push('current_used_up',
      `${chain.map(labelOf).join(' and ')} are in series and both carry `
      + `${fmtAmp(Math.abs(sol.currents[chain[0].id] ?? 0))} — the identical number, `
      + 'not "less after the first one".');
  }

  // more_resistors_more_resistance — a parallel group is present.
  const par = parallelGroup(circuit);
  if (par) {
    const rs = par.map(resistanceOf);
    const combined = 1 / rs.reduce((s, r) => s + 1 / r, 0);
    push('more_resistors_more_resistance',
      `${par.map(labelOf).join(' and ')} are in parallel: ${rs.map((r) => sig(r)).join(' and ')} Ω `
      + `together make ${fmtOhm(combined)} — less than either of them on its own.`);
  }

  // battery_constant_current — a real cell losing volts to its own r.
  for (const c of comps) {
    if (c.kind !== 'battery') continue;
    const r = resistanceOf(c);
    const i = sol.currents[c.id] ?? 0;
    if (r <= ZERO_R || Math.abs(i) < 1e-9) continue;
    const terminal = emfOf(c) - i * r;
    push('battery_constant_current',
      `${labelOf(c)} has an EMF of ${fmtVolt(emfOf(c))} but its terminals are only `
      + `${fmtVolt(terminal)} apart — ${fmtVolt(i * r)} is lost inside the cell itself, `
      + `because it is delivering ${fmtAmp(i)}.`);
    break;
  }

  // meter_is_ideal — a meter that is loading the circuit it reports on.
  for (const c of comps) {
    if (c.kind !== 'ammeter' && c.kind !== 'voltmeter') continue;
    const r = resistanceOf(c);
    if (c.kind === 'ammeter' && r <= ZERO_R) continue;
    if (c.kind === 'voltmeter' && !Number.isFinite(r)) continue;
    push('meter_is_ideal',
      c.kind === 'ammeter'
        ? `${labelOf(c)} has ${fmtOhm(r)} of its own resistance in the loop, so the current it `
          + 'reports is smaller than the current that flowed before you inserted it.'
        : `${labelOf(c)} is only ${fmtOhm(r)}, so it draws `
          + `${fmtAmp(Math.abs(sol.currents[c.id] ?? 0))} of its own and pulls down the very p.d. it is reporting.`);
    break;
  }

  // brightness_by_position — two bulbs, and what actually decides brightness.
  const bulbs = comps.filter((c) => c.kind === 'bulb');
  if (bulbs.length >= 2) {
    const powers = bulbs.map((b) => Math.abs(sol.power[b.id] ?? 0));
    const spread = Math.max(...powers) - Math.min(...powers);
    push('brightness_by_position',
      spread < 1e-9
        ? `Both bulbs are dissipating ${fmtWatt(powers[0])} — identical brightness, though one is `
          + 'obviously "nearer the +" on the page.'
        : `${bulbs.map((b, i) => `${labelOf(b)} ${fmtWatt(powers[i])}`).join(', ')}. `
          + 'The difference is I²R, and it is the currents that differ — not the positions.');
  }

  return out;
}

/** Two elements meeting at a node with nothing else on it — a series pair. */
function seriesChain(circuit: Circuit, sol: CircuitSolution): CircuitComponent[] | null {
  for (const n of circuit.nodes) {
    if (degreeOf(circuit, n.id) !== 2) continue;
    const pair = activeComponents(circuit).filter((c) => c.a === n.id || c.b === n.id);
    if (pair.length !== 2) continue;
    if (pair.some((c) => resistanceOf(c) <= ZERO_R || !Number.isFinite(resistanceOf(c)))) continue;
    if (Math.abs(sol.currents[pair[0].id] ?? 0) < 1e-9) continue;
    return pair;
  }
  return null;
}

/** Two or more elements sharing BOTH ends. */
function parallelGroup(circuit: Circuit): CircuitComponent[] | null {
  const groups = new Map<string, CircuitComponent[]>();
  for (const c of activeComponents(circuit)) {
    if (c.a === c.b) continue;
    const r = resistanceOf(c);
    if (r <= ZERO_R || !Number.isFinite(r)) continue;
    const list = groups.get(pairKey(c)) ?? [];
    list.push(c);
    groups.set(pairKey(c), list);
  }
  for (const [, list] of groups) if (list.length >= 2) return list;
  return null;
}
