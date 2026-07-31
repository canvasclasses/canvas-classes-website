/*
 * circuit-bench/archetypes.ac.ts — Unit 11's AC construction library. PURE.
 * ─────────────────────────────────────────────────────────────────────────────
 * The engine ships once as code; every AC or transient exercise on every page is
 * a `circuit_bench` block naming ONE id from this map plus params
 * (PHYSICS_SIMULATION_PROGRAM.md §3). Fifteen rungs, all data.
 *
 * ═══ EVERY RUNG NAMES A MISCONCEPTION, AND EVERY CODE HAS A HOME ═════════════
 * `CircuitMisconception` gained nine AC codes when this library landed (see
 * circuit-bench/types.ts); their copy lives in `lib/misconceptions.ts` beside the
 * DC nine, under the same exhaustive `Record` that makes a code without copy a
 * compile error. Two of the original DC codes are honestly reused at 50 Hz:
 *
 *   • `battery_constant_current` on `lr-current-growth`. Its message — "a cell
 *     is not a current source; the current that results is whatever the circuit
 *     lets through" — IS the lesson: at t = 0 the inductor lets through nothing
 *     while the whole EMF is applied across it.
 *   • `voltage_across_wire` on `capacitor-frequency-gate`. Its message — an
 *     element of no impedance drops no voltage however much current it carries —
 *     is exactly what X_C → 0 does to a capacitor at high frequency.
 *
 * `element_voltages_add_arithmetically` is the one AC code no single rung claims
 * as its headline, because two rungs demonstrate it and neither is mainly about
 * it. It is raised instead as a SECONDARY card by `PhasorBench` and `SweepBench`
 * the moment the element-voltage layer is on and the arithmetic sum visibly
 * misses the supply — evidence-gated like every other, and never a preamble.
 *
 * ═══ DISPATCH ════════════════════════════════════════════════════════════════
 * `CircuitBenchBlock` has no `mode` field, so nothing needs adding to the block
 * type: `AC_VIEW` below carries the sub-view and `ac/AcBench.tsx` switches on it.
 * To reach these from a page the engine owner adds one line — spread
 * `AC_ARCHETYPES` into `CIRCUIT_ARCHETYPES` (or route `circuit_bench` blocks
 * whose archetype id is in `AC_VIEW` to `AcBench`).
 *
 * ═══ EVERY DEFAULT IS HAND-DERIVED IN ITS COMMENT ════════════════════════════
 * and re-derived independently in `scripts/verify-emi-ac.mjs`.
 */

import type { Circuit, CircuitArchetype } from './types';
import {
  acSetup, buildAcCircuit, buildTransformerCircuit, buildTransientCircuit,
  buildTransmissionCircuit, type AcView,
} from './ac/lib/setup';

// ── Param helpers ────────────────────────────────────────────────────────────

type Bag = Record<string, number | string | boolean>;
type Param = NonNullable<CircuitArchetype['params']>[number];

const n = (
  key: string, label: string, def: number,
  min: number, max: number, step: number, unit?: string,
): Param => ({ key, label, kind: 'number', default: def, min, max, step, unit });

const sel = (key: string, label: string, def: string, options: string[]): Param =>
  ({ key, label, kind: 'select', default: def, options });

/** Every AC archetype builds through `acSetup`, so the netlist and the readouts
 *  can never read different numbers (see ac/lib/setup.ts). */
const netlistFor = (view: AcView) => (p?: Bag): Circuit => {
  const s = acSetup(view, p);
  if (view === 'transformer') return buildTransformerCircuit(s);
  if (view === 'transmission') return buildTransmissionCircuit(s);
  if (view === 'transient') return buildTransientCircuit(s);
  return buildAcCircuit(s);
};

/** The sub-view each archetype routes to — `AcBench` reads this. */
export const AC_VIEW: Record<string, AcView> = {
  'ac-resistor-only': 'phasor',
  'ac-inductor-only': 'phasor',
  'ac-capacitor-only': 'phasor',
  'phasor-is-the-waveform': 'phasor',
  'series-lcr-phasor': 'phasor',
  'rms-not-average': 'phasor',
  'power-factor': 'phasor',
  'reactance-vs-frequency': 'sweep',
  'lcr-resonance': 'sweep',
  'capacitor-frequency-gate': 'sweep',
  'lr-current-growth': 'transient',
  'lc-oscillation': 'transient',
  'lcr-damping': 'transient',
  'transformer-turns-ratio': 'transformer',
  'transmission-at-high-voltage': 'transmission',
};

// ── The library ──────────────────────────────────────────────────────────────

export const AC_ARCHETYPES: Record<string, CircuitArchetype> = {

  // ── 1 ─────────────────────────────────────────────────────────────────────
  // Pure R: X = 0, Z = R = 30 Ω, φ = 0, cos φ = 1.
  // V₀ = 100 V → I₀ = 3.3333 A, I_rms = 2.3570 A, V_rms = 70.711 V,
  // P_avg = 70.711 × 2.3570 × 1 = 166.67 W = I_rms²R = 5.5556 × 30 ✓
  'ac-resistor-only': {
    id: 'ac-resistor-only',
    title: 'A resistor on AC — nothing new',
    summary:
      'The baseline rung. Voltage and current rise and fall together, the two phasors sit on top of each '
      + 'other, and the power is positive at every instant. Everything after this is a departure from it.',
    targets: 'reactance_is_a_resistance',
    probes: ['s-', 's+'],
    params: [
      sel('elements', 'Elements in the loop', 'R', ['R', 'L', 'C', 'RL', 'RC', 'LCR']),
      n('R', 'Resistance', 30, 5, 200, 5, 'Ω'),
      n('V0', 'Peak supply voltage', 100, 10, 320, 10, 'V'),
      n('f', 'Frequency', 50, 5, 500, 5, 'Hz'),
    ],
    build: netlistFor('phasor'),
    defaultSteps: [
      { say: 'One resistor across an alternating supply. Two arrows on the left — voltage and current — and the traces they draw on the right. **Predict:** as the arrows turn, will the two stay together or drift apart?', cta: 'Turn the phasors' },
      { say: 'Locked together. A resistor has no memory: the current at every instant is just v/R at that instant, so the two waves cross zero at the same moment and peak at the same moment.', cta: 'Show the power trace' },
      { say: 'And the power p = v·i never goes below zero — when v is negative, i is too, and the product is positive again. The resistor takes energy on every half-cycle and never gives any back.', cta: 'Show the average' },
      { say: 'The average power is V_rms × I_rms, with no correction factor. Hold on to that: every other element in this unit needs one.', cta: 'Done' },
    ],
  },

  // ── 2 ─────────────────────────────────────────────────────────────────────
  // Pure L: R = 0, X_L = 2π(50)(0.2) = 62.832 Ω, Z = 62.832, φ = +90°,
  // cos φ = R/Z = 0 EXACTLY, so P_avg = 0 exactly.
  // I₀ = 100/62.832 = 1.5915 A.
  'ac-inductor-only': {
    id: 'ac-inductor-only',
    title: 'A coil on AC — current a quarter-cycle late',
    summary:
      'Only an inductor. The current lags the voltage by exactly 90°, so the power trace spends as long '
      + 'negative as positive — and the average over a full cycle is exactly zero.',
    targets: 'reactive_element_dissipates_power',
    probes: ['s-', 's+'],
    params: [
      sel('elements', 'Elements in the loop', 'L', ['R', 'L', 'C', 'RL', 'RC', 'LCR']),
      n('L', 'Inductance', 0.2, 0.02, 1, 0.02, 'H'),
      n('V0', 'Peak supply voltage', 100, 10, 320, 10, 'V'),
      n('f', 'Frequency', 50, 5, 500, 5, 'Hz'),
    ],
    build: netlistFor('phasor'),
    defaultSteps: [
      { say: 'A coil, and nothing else. **Predict before you turn anything:** does the current peak at the same moment as the voltage, a quarter-cycle after it, or a quarter-cycle before?', cta: 'Turn the phasors' },
      { say: 'A quarter-cycle behind. The coil fights the CHANGE in current, so the current cannot get going until the voltage has already been pushing for a while. The two arrows stand at a fixed 90°.', cta: 'Show the power trace' },
      { say: 'Look at p = v·i. Positive for a quarter-cycle while the coil stores energy in its field, then NEGATIVE for a quarter-cycle while it hands it all back to the supply. Then again, the other way round.', cta: 'Show the average power' },
      { say: 'Exactly zero. A pure inductor is a wall to the current and a perfect borrower of energy — 1.59 A flowing, 62.8 Ω of reactance, and not one watt turned into heat.', cta: 'Raise the frequency' },
      { say: 'Faster shaking, more reactance: X_L = 2πfL. That is why a coil passes DC easily and chokes off a high-frequency signal, and why it is called a choke.', cta: 'Done' },
    ],
  },

  // ── 3 ─────────────────────────────────────────────────────────────────────
  // Pure C: X_C = 1/(2π(50)(50e-6)) = 63.662 Ω, Z = 63.662, φ = −90°,
  // cos φ = 0 exactly, P_avg = 0. I₀ = 100/63.662 = 1.5708 A.
  // At f = 0 the reactance is infinite — the DC block, from the formula.
  'ac-capacitor-only': {
    id: 'ac-capacitor-only',
    title: 'A capacitor on AC — current a quarter-cycle early',
    summary:
      'Only a capacitor. Now the current runs AHEAD of the voltage, its reactance FALLS as the frequency '
      + 'rises, and the average power is zero again. The mirror image of the coil.',
    targets: 'reactive_element_dissipates_power',
    probes: ['s-', 's+'],
    params: [
      sel('elements', 'Elements in the loop', 'C', ['R', 'L', 'C', 'RL', 'RC', 'LCR']),
      n('C', 'Capacitance', 50e-6, 5e-6, 500e-6, 5e-6, 'F'),
      n('V0', 'Peak supply voltage', 100, 10, 320, 10, 'V'),
      n('f', 'Frequency', 50, 5, 500, 5, 'Hz'),
    ],
    build: netlistFor('phasor'),
    defaultSteps: [
      { say: 'A capacitor on its own. There is a gap in the circuit — the plates do not touch. **Predict:** does any current flow at all?', cta: 'Turn the phasors' },
      { say: 'It does, and it runs a quarter-cycle AHEAD of the voltage. No charge crosses the gap: charge piles onto one plate and off the other, and that flow is the current.', cta: 'Compare with the coil' },
      { say: 'The coil lagged, the capacitor leads. The current is largest when the voltage is CHANGING fastest, which for a capacitor is as it passes through zero.', cta: 'Sweep the frequency' },
      { say: 'And the reactance goes the other way too: X_C = 1/(2πfC) FALLS as frequency rises. At DC it is infinite — which is the whole of "a capacitor blocks DC", straight out of the formula.', cta: 'Show the average power' },
      { say: 'Zero again. Two elements that both oppose the current, both measured in ohms, and neither one dissipates a thing. That is what makes reactance a different animal from resistance.', cta: 'Done' },
    ],
  },

  // ── 4 · THE CLAIM THE WHOLE BENCH RESTS ON ────────────────────────────────
  // R = 30 Ω, L = 0.2 H at f = 50 Hz: X_L = 62.832, Z = √(900 + 3947.8)
  //   = √4847.8 = 69.626 Ω, φ = atan(62.832/30) = 64.48°, cos φ = 0.4309.
  // The phasor's vertical projection must equal the waveform for every t:
  //   V₀ sin(ωt), checked to 1e-12 in the verifier.
  'phasor-is-the-waveform': {
    id: 'phasor-is-the-waveform',
    title: 'The phasor IS the wave',
    summary:
      'Drag the rotating arrow round by hand and watch the dot on the trace move with it. The height of '
      + 'the arrow is the value on the wave — not an analogy, the same number.',
    targets: 'phasor_is_a_different_quantity',
    probes: ['s-', 's+'],
    params: [
      sel('elements', 'Elements in the loop', 'RL', ['R', 'L', 'C', 'RL', 'RC', 'LCR']),
      n('R', 'Resistance', 30, 5, 200, 5, 'Ω'),
      n('L', 'Inductance', 0.2, 0.02, 1, 0.02, 'H'),
      n('V0', 'Peak supply voltage', 100, 10, 320, 10, 'V'),
      n('f', 'Frequency', 50, 5, 500, 5, 'Hz'),
    ],
    build: netlistFor('phasor'),
    defaultSteps: [
      { say: 'Two things on screen: an arrow that can turn, and a wave. **Take hold of the arrow** and drag it round slowly. Watch the dot on the wave.', cta: 'Show the projection line' },
      { say: 'The dashed line is doing the work. The HEIGHT of the arrow — its vertical shadow — is the value plotted on the wave. Point the arrow straight up and the wave is at its peak; lay it flat and the wave is at zero.', cta: 'Show both arrows' },
      { say: 'Now there are two arrows, voltage and current, and they turn together with a fixed angle between them. That angle is the phase difference, and it does not change as they spin — which is why one number describes it.', cta: 'Change the frequency' },
      { say: 'Change the frequency and the arrows turn faster, and the angle between them opens up. Nothing on the wave picture explains WHY it opened; the arrow picture does, because X_L grew.', cta: 'Done' },
    ],
  },

  // ── 5 ─────────────────────────────────────────────────────────────────────
  // Series LCR, R 30 Ω, L 0.2 H, C 50 µF at f = 120 Hz:
  //   X_L = 2π(120)(0.2) = 150.796 Ω,  X_C = 1/(2π(120)(50e-6)) = 26.5258 Ω
  //   X = 124.270,  Z = √(900 + 15443.1) = 127.840 Ω
  //   φ = atan(124.270/30) = 76.43°,  cos φ = 30/127.840 = 0.23467
  //   I₀ = 100/127.840 = 0.78223 A
  //   V_R = 23.467 V, V_L = 117.947 V, V_C = 20.752 V
  //   phasor sum √(23.467² + (117.947 − 20.752)²) = 100.000 V = V₀ ✓
  'series-lcr-phasor': {
    id: 'series-lcr-phasor',
    title: 'Series LCR — why you cannot just add the ohms',
    summary:
      'All three elements in one loop. Add the ohms and you get 207; do it as phasors and you get 128. '
      + 'The three voltages do not point the same way, so they cannot be added like numbers.',
    targets: 'impedances_add_arithmetically',
    probes: ['s-', 's+'],
    params: [
      sel('elements', 'Elements in the loop', 'LCR', ['R', 'L', 'C', 'RL', 'RC', 'LCR']),
      n('R', 'Resistance', 30, 5, 200, 5, 'Ω'),
      n('L', 'Inductance', 0.2, 0.02, 1, 0.02, 'H'),
      n('C', 'Capacitance', 50e-6, 5e-6, 500e-6, 5e-6, 'F'),
      n('V0', 'Peak supply voltage', 100, 10, 320, 10, 'V'),
      n('f', 'Frequency', 120, 5, 500, 5, 'Hz'),
    ],
    build: netlistFor('phasor'),
    defaultSteps: [
      { say: 'R = 30 Ω, X_L = 151 Ω, X_C = 27 Ω, all in series. **Predict, in ohms:** what is the total opposition to the current? Write your number down before you look.', cta: 'Show the impedance' },
      { say: '128 Ω, not 207. The same current flows through all three, so their VOLTAGES add — but V_L is 90° ahead of V_R and V_C is 90° behind it, so the adding has to be done as arrows.', cta: 'Build the phasor triangle' },
      { say: 'Watch V_L and V_C point in exactly opposite directions. They cancel down to a single leftover of 97 V, which then makes a right angle with V_R — and the hypotenuse is the supply, exactly 100 V.', cta: 'Check the sum' },
      { say: 'That is Z = √(R² + (X_L − X_C)²), and the angle of the triangle is the phase. Add the ohms arithmetically and you can never get below R; do it properly and the reactances can cancel.', cta: 'Done' },
    ],
  },

  // ── 6 ─────────────────────────────────────────────────────────────────────
  // V₀ = 100 V → V_rms = 70.711 V, cycle average = 0 EXACTLY,
  // mean of the square = V₀²/2 = 5000 V², root of it = 70.711 ✓
  'rms-not-average': {
    id: 'rms-not-average',
    title: 'Why AC is quoted as 230 V and not 325 V',
    summary:
      'The average of a sine over a cycle is zero, so it cannot be the useful number. RMS is the root of '
      + 'the mean of the square, and it is the DC voltage that would heat the same resistor equally.',
    targets: 'rms_is_the_cycle_average',
    probes: ['s-', 's+'],
    params: [
      sel('elements', 'Elements in the loop', 'R', ['R', 'L', 'C', 'RL', 'RC', 'LCR']),
      n('R', 'Resistance', 30, 5, 200, 5, 'Ω'),
      n('V0', 'Peak supply voltage', 100, 10, 320, 10, 'V'),
      n('f', 'Frequency', 50, 5, 500, 5, 'Hz'),
    ],
    build: netlistFor('phasor'),
    defaultSteps: [
      { say: 'A 100 V peak supply across a resistor. **Predict:** what is the average voltage over one complete cycle?', cta: 'Compute the cycle average' },
      { say: 'Zero — and that is exact, not an artefact. The sine spends as long below the axis as above it. So "average voltage" is useless: it says nothing about how hot the resistor gets.', cta: 'Square the wave' },
      { say: 'Square it, and every value is positive. The average of the SQUARE is not zero — it is half the peak squared. Take the root of that and you have the RMS.', cta: 'Show the RMS' },
      { say: '70.7 V, which is 100 divided by √2. That is the DC voltage that would heat this resistor at the same rate, because heating goes as V², not V. Your socket says 230 V and peaks at 325 V.', cta: 'Done' },
    ],
  },

  // ── 7 ─────────────────────────────────────────────────────────────────────
  // Power factor: R 30 Ω, L 0.2 H, C 50 µF at 120 Hz, from rung 5:
  //   Z = 127.840 Ω, cos φ = 30/127.840 = 0.23467
  //   V_rms = 70.711 V, I_rms = 0.55298 A
  //   apparent = 39.111 V·A, real = 9.1774 W, and I_rms²R = 0.30579 × 30 = 9.1737 W
  //   (the two agree; they differ only in how many digits the display shows)
  'power-factor': {
    id: 'power-factor',
    title: 'Power factor — volts times amps is not watts',
    summary:
      'Multiply the meter readings and you get 39 V·A. The resistor is actually dissipating 9 W. The '
      + 'difference is cos φ, and it is exactly R over Z.',
    targets: 'reactive_element_dissipates_power',
    probes: ['s-', 's+'],
    params: [
      sel('elements', 'Elements in the loop', 'LCR', ['R', 'L', 'C', 'RL', 'RC', 'LCR']),
      n('R', 'Resistance', 30, 5, 200, 5, 'Ω'),
      n('L', 'Inductance', 0.2, 0.02, 1, 0.02, 'H'),
      n('C', 'Capacitance', 50e-6, 5e-6, 500e-6, 5e-6, 'F'),
      n('V0', 'Peak supply voltage', 100, 10, 320, 10, 'V'),
      n('f', 'Frequency', 120, 5, 500, 5, 'Hz'),
    ],
    build: netlistFor('phasor'),
    defaultSteps: [
      { say: 'A voltmeter reads 70.7 V and an ammeter reads 0.553 A on this circuit. **Predict:** how many watts is it consuming?', cta: 'Show the real power' },
      { say: '9 W, not 39. Only the resistor turns anything into heat, and only the part of the current that is IN PHASE with the voltage goes through it usefully. The rest sloshes in and out of L and C.', cta: 'Show cos φ' },
      { say: 'cos φ = 0.235 — and it is exactly R/Z, which you can read straight off the impedance triangle. Real power = V_rms × I_rms × cos φ, and the correction factor is that cosine.', cta: 'Check it against I²R' },
      { say: 'I_rms²R gives the same 9 W by a completely different route. Now push the frequency toward resonance and watch cos φ climb toward 1: at resonance the circuit behaves as if L and C were not there.', cta: 'Done' },
    ],
  },

  // ── 8 ─────────────────────────────────────────────────────────────────────
  // L 0.2 H, C 50 µF: X_L = X_C where 2πfL = 1/(2πfC)
  //   → f₀ = 1/(2π√(LC)) = 1/(2π√(1e-5)) = 1/(2π × 3.16228e-3) = 50.3292 Hz
  // At 10 Hz: X_L = 12.566, X_C = 318.31 — capacitive.
  // At 300 Hz: X_L = 376.99, X_C = 10.610 — inductive.
  'reactance-vs-frequency': {
    id: 'reactance-vs-frequency',
    title: 'Two reactances going opposite ways',
    summary:
      'X_L climbs with frequency, X_C falls. Plot them together and they cross at exactly one frequency — '
      + 'and that crossing is what resonance is.',
    targets: 'reactance_is_a_resistance',
    probes: ['s-', 's+'],
    params: [
      sel('elements', 'Elements in the loop', 'LCR', ['R', 'L', 'C', 'RL', 'RC', 'LCR']),
      n('R', 'Resistance', 30, 5, 200, 5, 'Ω'),
      n('L', 'Inductance', 0.2, 0.02, 1, 0.02, 'H'),
      n('C', 'Capacitance', 50e-6, 5e-6, 500e-6, 5e-6, 'F'),
      n('f_min', 'Sweep from', 5, 1, 50, 1, 'Hz'),
      n('f_max', 'Sweep to', 500, 100, 5000, 50, 'Hz'),
      n('V0', 'Peak supply voltage', 100, 10, 320, 10, 'V'),
    ],
    build: netlistFor('sweep'),
    defaultSteps: [
      { say: 'One coil and one capacitor. **Predict the shapes:** as the frequency rises, does each of their reactances rise, fall, or stay put?', cta: 'Plot X_L' },
      { say: 'A straight line up: X_L = 2πfL. Faster changes mean a bigger dI/dt for the same current, so a bigger back-EMF to fight. Now the capacitor.', cta: 'Plot X_C' },
      { say: 'A hyperbola coming down: X_C = 1/(2πfC). At high frequency the plates never get time to charge up much, so they barely oppose anything. At DC they oppose everything.', cta: 'Mark the crossing' },
      { say: 'They cross at 50.3 Hz. Set 2πfL = 1/(2πfC) and solve: f₀ = 1/(2π√(LC)). Below it the capacitor is in charge and the current leads; above it the coil is, and the current lags.', cta: 'Done' },
    ],
  },

  // ── 9 ─────────────────────────────────────────────────────────────────────
  // At resonance, f = f₀ = 50.3292 Hz: X_L = X_C = 63.246 Ω,
  //   X = 0 → Z = R = 30 Ω exactly, φ = 0 exactly, cos φ = 1.
  //   I₀ = 100/30 = 3.3333 A — the largest the circuit will ever carry.
  //   V_L = V_C = 3.3333 × 63.246 = 210.82 V, each MORE THAN TWICE the supply.
  //   Q = √(L/C)/R = √4000/30 = 2.1082, so V_L/V_supply = Q = 2.108 ✓
  'lcr-resonance': {
    id: 'lcr-resonance',
    title: 'Resonance — the impedance falls to just R',
    summary:
      'Sweep the frequency and the impedance dips, the current peaks and the phase passes through zero, '
      + 'all at the same instant. And the voltage across the coil ends up twice the supply.',
    targets: 'resonance_is_maximum_impedance',
    probes: ['s-', 's+'],
    params: [
      sel('elements', 'Elements in the loop', 'LCR', ['R', 'L', 'C', 'RL', 'RC', 'LCR']),
      n('R', 'Resistance', 30, 2, 200, 2, 'Ω'),
      n('L', 'Inductance', 0.2, 0.02, 1, 0.02, 'H'),
      n('C', 'Capacitance', 50e-6, 5e-6, 500e-6, 5e-6, 'F'),
      n('f_min', 'Sweep from', 5, 1, 50, 1, 'Hz'),
      n('f_max', 'Sweep to', 500, 100, 5000, 50, 'Hz'),
      n('V0', 'Peak supply voltage', 100, 10, 320, 10, 'V'),
    ],
    build: netlistFor('sweep'),
    defaultSteps: [
      { say: 'The same three elements. **Predict:** at the frequency where X_L and X_C are equal, is the impedance at its largest or its smallest?', cta: 'Plot the impedance' },
      { say: 'Its smallest — and not just small, exactly R. X_L and X_C are equal and opposite, so the reactive part of Z is zero and there is literally nothing left but the resistor.', cta: 'Plot the current' },
      { say: 'So the current peaks there, at V/R, the largest it can ever be. And the phase passes through zero: at resonance the circuit behaves exactly as if the coil and the capacitor were not in it.', cta: 'Read V across L and C' },
      { say: '211 V across the coil, from a 100 V supply — and 211 V across the capacitor too, pointing the opposite way. They cancel in the sum and not in the readings. That ratio is the Q factor.', cta: 'Lower the resistance' },
      { say: 'Less resistance, sharper peak, bigger Q, bigger element voltages. That sharpness is how a radio picks one station out of hundreds sharing the same aerial.', cta: 'Done' },
    ],
  },

  // ── 10 ────────────────────────────────────────────────────────────────────
  // R 30 Ω, C 50 µF. At 5 Hz: X_C = 636.62 Ω, Z = 637.33, V_C/V₀ = 0.99889.
  // At 2000 Hz: X_C = 1.5915 Ω, Z = 30.042, V_C/V₀ = 0.05298.
  // The capacitor's own p.d. collapses while the current is at its largest.
  'capacitor-frequency-gate': {
    id: 'capacitor-frequency-gate',
    title: 'The capacitor that becomes a wire',
    summary:
      'Push the frequency up and the capacitor\'s reactance falls toward zero. It ends up carrying the '
      + 'largest current in the circuit with almost no voltage across it — behaving exactly like a wire.',
    targets: 'voltage_across_wire',
    probes: ['s-', 's+'],
    params: [
      sel('elements', 'Elements in the loop', 'RC', ['R', 'L', 'C', 'RL', 'RC', 'LCR']),
      n('R', 'Resistance', 30, 5, 200, 5, 'Ω'),
      n('C', 'Capacitance', 50e-6, 5e-6, 500e-6, 5e-6, 'F'),
      n('f_min', 'Sweep from', 5, 1, 50, 1, 'Hz'),
      n('f_max', 'Sweep to', 2000, 100, 5000, 50, 'Hz'),
      n('V0', 'Peak supply voltage', 100, 10, 320, 10, 'V'),
    ],
    build: netlistFor('sweep'),
    defaultSteps: [
      { say: 'A resistor and a capacitor in series, and a frequency you can sweep from 5 Hz to 2 kHz. **Predict:** at the top of the sweep, how much of the supply voltage sits across the capacitor?', cta: 'Sweep the frequency' },
      { say: 'Almost none — about 5 V out of 100, while the current is at its largest of the whole sweep. An element of vanishing impedance drops no voltage however much current it carries.', cta: 'Read the reactance' },
      { say: '1.6 Ω at 2 kHz, against 637 Ω at 5 Hz. The capacitor has effectively become a piece of wire, and everything the supply offers now falls across the resistor instead.', cta: 'Go back to 5 Hz' },
      { say: 'At the bottom of the sweep it is the other way round: the capacitor takes nearly all of it and the resistor almost none. One component, two completely different jobs, decided by frequency alone.', cta: 'Done' },
    ],
  },

  // ── 11 ────────────────────────────────────────────────────────────────────
  // ε 12 V, R 4 Ω, L 2 H → τ = L/R = 0.5 s, I_final = ε/R = 3 A.
  //   At t = τ: I = 3(1 − e⁻¹) = 3 × 0.6321205588 = 1.8963617 A
  //   At t = 0: I = 0 and V_L = 12 V — the WHOLE supply across the coil.
  //   Energy at the end: ½LI² = 0.5 × 2 × 9 = 9 J
  'lr-current-growth': {
    id: 'lr-current-growth',
    title: 'LR growth — the current that cannot start',
    summary:
      'Close the switch on a coil and the current does not appear. It climbs, reaching 63.2% of its final '
      + 'value at exactly one time constant — and at the first instant the whole supply sits across a coil '
      + 'with no resistance at all.',
    targets: 'battery_constant_current',
    probes: ['n-', 'n+'],
    params: [
      sel('transient', 'Which transient', 'lr-growth', ['lr-growth', 'lr-decay', 'lc', 'lcr']),
      n('lr_emf', 'Cell EMF', 12, 2, 24, 1, 'V'),
      n('lr_R', 'Resistance', 4, 1, 40, 1, 'Ω'),
      n('lr_L', 'Inductance', 2, 0.1, 10, 0.1, 'H'),
      n('t_max', 'Plot length', 3, 0.2, 10, 0.2, 's'),
    ],
    build: netlistFor('transient'),
    defaultSteps: [
      { say: 'A 12 V cell, a 4 Ω resistor and a 2 H coil, with the switch about to close. **Predict:** at the very first instant, is the current 3 A, 0 A, or somewhere in between?', cta: 'Close the switch' },
      { say: 'Zero. The coil will not let the current change instantly, so at t = 0 there is no current — and therefore no volts across the resistor. All 12 V of it is across the coil.', cta: 'Show the two voltages' },
      { say: 'Watch them trade places. V_L falls as V_R rises, and they always sum to 12 V. As the current levels off, the coil stops mattering and becomes a plain piece of wire.', cta: 'Mark one time constant' },
      { say: 'At t = τ = L/R = 0.5 s the current is at 63.2% of its final value. That is 1 − 1/e, and it is the same fraction for every LR circuit ever built. Change L or R and only the timescale moves.', cta: 'Change the inductance' },
      { say: 'A bigger coil takes longer and settles at the SAME final current — because the final current is set by ε/R alone, and the coil has nothing to say once nothing is changing.', cta: 'Done' },
    ],
  },

  // ── 12 ────────────────────────────────────────────────────────────────────
  // L 0.5 H, C 200 µF → LC = 1e-4, ω₀ = 1/√(LC) = 100 rad/s EXACTLY,
  //   f₀ = 15.9155 Hz, T = 2π/100 = 62.832 ms.
  //   q₀ = C × 10 V = 2 mC. U_total = q₀²/2C = 4e-6/4e-4 = 10 mJ.
  //   I_peak = q₀ω₀ = 0.2 A, and ½LI² = 0.5 × 0.5 × 0.04 = 10 mJ ✓ same total.
  'lc-oscillation': {
    id: 'lc-oscillation',
    title: 'LC — energy sloshing, and nothing lost',
    summary:
      'A charged capacitor across a coil, with no resistance anywhere. The charge oscillates, the energy '
      + 'moves back and forth between the two fields, and the total never changes by a single joule.',
    targets: 'lc_current_stops_when_capacitor_empties',
    probes: ['n-', 'n+'],
    params: [
      sel('transient', 'Which transient', 'lc', ['lr-growth', 'lr-decay', 'lc', 'lcr']),
      n('lc_L', 'Inductance', 0.5, 0.05, 5, 0.05, 'H'),
      n('lc_C', 'Capacitance', 200e-6, 10e-6, 1000e-6, 10e-6, 'F'),
      n('lc_V', 'Starting voltage', 10, 1, 50, 1, 'V'),
      n('t_max', 'Plot length', 0.25, 0.02, 1, 0.01, 's'),
    ],
    build: netlistFor('transient'),
    defaultSteps: [
      { say: 'A capacitor charged to 10 V, connected across a coil. No resistor. **Predict:** the capacitor discharges — at the moment it is completely empty, what is the current doing?', cta: 'Release it' },
      { say: 'At its MAXIMUM. Nothing has stopped: the energy that was in the capacitor is now entirely in the coil\'s magnetic field, and that field will not collapse without pushing the current on.', cta: 'Show the energy bars' },
      { say: 'Two bars trading places. When one is empty the other is full, and their SUM does not move — 10 mJ, all the way through. It is a mass on a spring: fastest as it passes the middle.', cta: 'Read the frequency' },
      { say: 'ω₀ = 1/√(LC) = 100 rad/s exactly for these values, so 15.9 oscillations a second. The coil pushes the charge straight past zero and charges the capacitor up the OTHER way round.', cta: 'Done' },
    ],
  },

  // ── 13 ────────────────────────────────────────────────────────────────────
  // Same L and C: R_critical = 2√(L/C) = 2√(0.5/2e-4) = 2√2500 = 100 Ω exactly.
  //   R = 20 Ω  → α = R/2L = 20, ω_d = √(10000 − 400) = √9600 = 97.9796 rad/s → under-damped
  //   R = 100 Ω → α = 100 = ω₀ → critically damped, no oscillation at all
  //   R = 200 Ω → over-damped, and SLOWER to settle than the critical case
  'lcr-damping': {
    id: 'lcr-damping',
    title: 'Add a resistor and the oscillation dies',
    summary:
      'The same LC loop with a resistor in it. A little resistance and it rings down; exactly 100 Ω and it '
      + 'stops oscillating altogether; more than that and it settles more SLOWLY, not faster.',
    targets: 'lc_current_stops_when_capacitor_empties',
    probes: ['n-', 'n+'],
    params: [
      sel('transient', 'Which transient', 'lcr', ['lr-growth', 'lr-decay', 'lc', 'lcr']),
      n('lcr_R', 'Resistance', 20, 0, 300, 5, 'Ω'),
      n('lc_L', 'Inductance', 0.5, 0.05, 5, 0.05, 'H'),
      n('lc_C', 'Capacitance', 200e-6, 10e-6, 1000e-6, 10e-6, 'F'),
      n('lc_V', 'Starting voltage', 10, 1, 50, 1, 'V'),
      n('t_max', 'Plot length', 0.25, 0.02, 1, 0.01, 's'),
    ],
    build: netlistFor('transient'),
    defaultSteps: [
      { say: 'The same oscillator with 20 Ω added. **Predict:** does it oscillate at the same frequency and fade, oscillate slower and fade, or stop oscillating?', cta: 'Release it' },
      { say: 'It rings down — slightly slower than before, because ω_d = √(ω₀² − α²) is a little less than ω₀. And the total energy is now falling, because the resistor is taking a bite every pass.', cta: 'Show the energy lost' },
      { say: 'Now turn the resistance up to 100 Ω, which for this L and C is exactly 2√(L/C). **Predict:** does it ring very fast, ring very slowly, or not ring at all?', cta: 'Try 100 Ω' },
      { say: 'It does not ring. That is critical damping: the charge slides to zero in the shortest possible time with no overshoot. Every good instrument needle and every car damper is aimed at this point.', cta: 'Try 200 Ω' },
      { say: 'More resistance is SLOWER, not faster. Over-damped, it creeps to zero. So there is a best amount of damping, and more of a good thing stops being good — which is the surprise of this rung.', cta: 'Done' },
    ],
  },

  // ── 14 ────────────────────────────────────────────────────────────────────
  // 500 : 5000 turns, ratio 10. V_p = 230 V → V_s = 2300 V.
  //   Load 4600 Ω → I_s = 0.5 A, P_s = 1150 W.
  //   Ideal: P_p = 1150 W → I_p = 1150/230 = 5 A exactly.
  //   I_s/I_p = 0.5/5 = 0.1 = N_p/N_s ✓  and V_p I_p = V_s I_s = 1150 W ✓
  'transformer-turns-ratio': {
    id: 'transformer-turns-ratio',
    title: 'A transformer trades volts for amps',
    summary:
      'Ten times the turns gives ten times the volts — and a tenth of the current. Watch the two power '
      + 'readings: an ideal transformer keeps them equal, and never makes the second one bigger.',
    targets: 'transformer_creates_power',
    probes: ['p-', 'p+'],
    params: [
      n('Np', 'Primary turns', 500, 50, 2000, 50, ''),
      n('Ns', 'Secondary turns', 5000, 50, 20000, 50, ''),
      n('Vp', 'Primary voltage (RMS)', 230, 12, 400, 1, 'V'),
      n('load', 'Load resistance', 4600, 100, 20000, 100, 'Ω'),
      n('eta', 'Efficiency', 1, 0.5, 1, 0.01, ''),
    ],
    build: netlistFor('transformer'),
    defaultSteps: [
      { say: '500 turns on one side, 5000 on the other, and no wire between them at all. 230 V goes in. **Predict:** what comes out, and what does that do to the current available?', cta: 'Show the secondary voltage' },
      { say: '2300 V — ten times, because every turn sees the same dΦ/dt and there are ten times as many of them. Now look at the currents.', cta: 'Show both currents' },
      { say: '0.5 A out, 5 A in. Exactly a tenth. **The secondary voltage is set by the turns; the secondary CURRENT is set by the load** — and only then is the primary current whatever is needed to supply it.', cta: 'Compare the two powers' },
      { say: 'Both 1150 W. A step-up transformer creates no power whatsoever; it trades volts for amps at a constant product. Now drop the efficiency to 0.9 and watch which side loses.', cta: 'Make it a real transformer' },
      { say: 'The primary now draws MORE than the secondary delivers — the difference is heat in the core and the windings. Never the other way round, in any transformer that has ever been built.', cta: 'Done' },
    ],
  },

  // ── 15 ────────────────────────────────────────────────────────────────────
  // Deliver 100 kW down a 10 Ω line.
  //   at 1 kV:   I = 100 A → loss = 100² × 10 = 100 000 W  (as much as the demand)
  //   at 10 kV:  I = 10 A  → loss = 1 000 W                (100× less)
  //   at 100 kV: I = 1 A   → loss = 10 W                   (another 100× less)
  // Loss ∝ 1/V², because loss = I²R and I = P/V.
  'transmission-at-high-voltage': {
    id: 'transmission-at-high-voltage',
    title: 'Why the grid runs at 400 000 volts',
    summary:
      'The same 100 kW down the same cables. At 1 kV you lose all of it in the wires; at 10 kV you lose '
      + '1%; at 100 kV you lose almost nothing. The loss falls as the SQUARE of the voltage.',
    targets: 'transformer_creates_power',
    probes: ['g', 'a'],
    params: [
      n('demand', 'Power the town needs', 100000, 10000, 1000000, 10000, 'W'),
      n('line_V', 'Transmission voltage', 1000, 500, 400000, 500, 'V'),
      n('line_R', 'Total cable resistance', 10, 1, 100, 1, 'Ω'),
    ],
    build: netlistFor('transmission'),
    defaultSteps: [
      { say: 'A town needs 100 kW, down cables with 10 Ω of resistance. Send it at 1000 V. **Predict:** roughly how much is lost heating the cables — a few percent, a quarter, or nearly all of it?' , cta: 'Send it at 1 kV' },
      { say: 'All of it. 100 A through 10 Ω dissipates 100 kW — the station has to generate 200 kW to deliver 100. The cables are as big a load as the town.', cta: 'Step it up to 10 kV' },
      { say: 'Ten times the voltage means a tenth of the current, and the loss is I²R — so a HUNDREDTH of the loss. 1 kW instead of 100 kW, in the same cables, delivering the same power.', cta: 'Step it up again' },
      { say: 'At 100 kV the cables waste 10 W. The whole national grid is built around that one inverse square, and transformers exist to step up at the station and back down at your street.', cta: 'Thicken the cables instead' },
      { say: 'Compare: dropping the cable resistance from 10 Ω to 5 Ω only halves the loss, and copper is expensive by the tonne. Raising the voltage is cheap by comparison. That is why they chose voltage.', cta: 'Done' },
    ],
  },
};

/** Teaching order: one element at a time, then all three, then the sweep, then
 *  time, then the machines. */
export const AC_ARCHETYPE_ORDER: string[] = [
  'ac-resistor-only', 'ac-inductor-only', 'ac-capacitor-only',
  'phasor-is-the-waveform', 'series-lcr-phasor', 'rms-not-average', 'power-factor',
  'reactance-vs-frequency', 'lcr-resonance', 'capacitor-frequency-gate',
  'lr-current-growth', 'lc-oscillation', 'lcr-damping',
  'transformer-turns-ratio', 'transmission-at-high-voltage',
];
