/*
 * circuit-bench/archetypes.semiconductor.ts — the Semiconductor Bench library.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM. Every `build()` and `buildScene()` runs in plain node.
 *
 * ═══ WHAT THIS NEEDS FROM THE FROZEN E3 CONTRACT — REPORTED, NOT FORCED ══════
 *
 * `ComponentKind` is `resistor | battery | wire | capacitor | inductor | ammeter
 * | voltmeter | switch | bulb | galvanometer`. There is no diode, no Zener and
 * nothing three-terminal. Rather than invent kinds inside a frozen contract that
 * another agent is concurrently touching, this library works entirely within the
 * existing kinds and the wanted additions are reported:
 *
 *   WANTED (nice to have, not blocking):
 *     • `ComponentKind` += `'diode' | 'zener'` — purely so the CANVAS can draw the
 *       triangle-and-bar glyph instead of a switch, and so a netlist reads as the
 *       circuit it is. The SOLVE does not need it: in each piecewise state a diode
 *       IS a linear element the existing MNA already handles exactly (see
 *       `semiconductor/lib/solveDiode.ts`).
 *     • A three-terminal element, or a current-controlled current source, for the
 *       BJT. This one genuinely cannot be worked around: `CircuitComponent` is
 *       two-terminal by definition. Faking it as a battery behind a 10⁹ Ω
 *       resistor would wreck the matrix conditioning that `lib/solve.ts` exists to
 *       protect, so the transistor's collector side is solved in CLOSED FORM in
 *       `semiconductor/lib/transistor.ts` and its BASE LOOP — which is an ordinary
 *       linear circuit — goes through the frozen solver as a cross-check. The two
 *       must agree, and the verifier asserts they do.
 *
 * HOW A DIODE IS REPRESENTED TODAY. Each diode has a PLACEHOLDER component in the
 * built circuit — a `switch` with `open: true`, carrying the diode's id. That is
 * not a hack standing in for something better: an open switch is the correct
 * two-terminal representation of a non-conducting diode, the topology is complete
 * and drawable before any state is chosen, and `solveDiodeCircuit` swaps it for
 * the companion element of whichever state turns out to be consistent. So
 * `build()` returns a real, solvable, honest `Circuit` and `SEMICONDUCTOR_ARCHETYPES`
 * is assignable to `Record<string, CircuitArchetype>` with no cast.
 *
 * ═══ MISCONCEPTION CODES — TWO REUSED, SEVEN NAMED ══════════════════════════
 *
 * `CircuitMisconception` originally had nine codes and all nine were about
 * resistor networks. TWO of them fit an archetype here exactly and are reused
 * rather than duplicated:
 *
 *   half-wave-rectifier  → `current_used_up`
 *        "Current is not used up as it goes round" is verbatim the belief this
 *        exercise breaks: the diode current and the load current are the same
 *        number at every instant. And `detectIssues` raises it live, from the
 *        circuit's own numbers.
 *   full-wave-rectifier  → `series_parallel_by_appearance`
 *        "Series and parallel are not about how the circuit is DRAWN" is exactly
 *        the bridge question. The conducting pair is DIAGONAL, and no amount of
 *        looking at which side of the diamond a diode is on will say so.
 *
 * The remaining seven beliefs no existing code could express were NAMED and folded
 * into the union rather than force-fitted:
 *
 *   doping_adds_both_carriers                n·p = nᵢ² — doping TRADES carriers
 *   depletion_region_is_empty_space          the atoms are all still there
 *   forward_and_reverse_are_different_rules  one formula, with the sign of V in it
 *   diode_has_a_resistance                   V/I differs at every point
 *   breakdown_destroys_a_diode               the POWER kills it, not the volts
 *   collector_current_is_always_beta_ib      saturation caps it; β stops applying
 *   amplifier_output_follows_the_input       common emitter INVERTS, and it clips
 *
 * The copy lives in `lib/misconceptions.ts` — ONE source of truth, and the
 * `Record<CircuitMisconception, CircuitIssue>` annotation there makes a code
 * without copy a compile error. `SemiconductorBench` resolves `targets` through
 * `issueFor()` and renders the card only once the student has SEEN the
 * contradicting evidence; the gate for each code is recorded beside its entry.
 */

import type { Circuit, CircuitArchetype, CircuitMisconception } from './types';
import {
  mkBattery, mkNode, mkResistor, mkSwitch,
} from './lib/netlist';
import { diode, type DiodeSpec } from './semiconductor/lib/diode';
import type { JunctionSpec } from './semiconductor/lib/junction';
import type { TransistorSpec } from './semiconductor/lib/transistor';
import { baseLoopCircuit } from './semiconductor/lib/transistor';
import { MATERIAL_NAMES, material, type DopingType } from './semiconductor/lib/materials';

export type SemiParamBag = Record<string, number | string | boolean> | undefined;

/** Which face of the bench an archetype opens on. */
export type SemiView = 'doping' | 'junction' | 'iv' | 'rectifier' | 'zener' | 'transistor';

export interface SemiconductorScene {
  view: SemiView;
  /** The linear circuit, with an open-switch placeholder per diode. */
  circuit: Circuit;
  diodes: DiodeSpec[];
  /** Present for the junction and doping views. */
  junction?: JunctionSpec;
  doping?: { materialName: string; type: DopingType; dopantPerM3: number };
  transistor?: TransistorSpec;
  rectifier?: {
    sourceIds: string[];
    peak: number;
    frequency: number;
    outputNodes: [string, string];
    loadOhms: number;
    topology: 'half-wave' | 'centre-tap' | 'bridge';
  };
  zener?: { sourceIds: string[]; outputNodes: [string, string]; seriesOhms: number; loadOhms: number };
  probes?: [string, string];
}

/**
 * `CircuitArchetype` plus the two things a semiconductor exercise needs that a
 * resistor network does not: which face to open on, and the nonlinear devices.
 * It EXTENDS the frozen interface, so `Record<string, SemiconductorArchetype>` is
 * assignable to `Record<string, CircuitArchetype>` — asserted at the bottom of
 * this file so a future edit cannot silently break it.
 */
export interface SemiconductorArchetype extends Omit<CircuitArchetype, 'targets'> {
  view: SemiView;
  buildScene(params?: SemiParamBag): SemiconductorScene;
  /**
   * REQUIRED here, unlike on `CircuitArchetype`. Every semiconductor exercise
   * exists to break one specific belief, the copy for it lives in
   * `lib/misconceptions.ts`, and making the field mandatory means a new archetype
   * cannot be added without deciding which belief it attacks.
   */
  targets: CircuitMisconception;
}

// ── param readers (local; `lib/params` belongs to the field engine) ───────────

const num = (p: SemiParamBag, k: string, d: number): number => {
  const v = p?.[k];
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') { const n = parseFloat(v); if (Number.isFinite(n)) return n; }
  return d;
};
const str = (p: SemiParamBag, k: string, d: string): string => {
  const v = p?.[k];
  return typeof v === 'string' && v.length ? v : d;
};
const bool = (p: SemiParamBag, k: string, d: boolean): boolean => {
  const v = p?.[k];
  if (typeof v === 'boolean') return v;
  if (v === 'true') return true;
  if (v === 'false') return false;
  return d;
};

/** Doping is authored in the units a book uses — dopant atoms per cm³ — and
 *  converted here, once. 1 cm⁻³ = 10⁶ m⁻³. */
const perCm3 = (v: number): number => v * 1e6;

/** A diode placeholder: an open switch carrying the diode's id. See the header. */
const diodeSlot = (id: string, a: string, b: string, x: number, y: number) =>
  mkSwitch(id, a, b, { label: id, open: true, x, y });

// ── the circuits ─────────────────────────────────────────────────────────────

/** A single diode in series with a load — the circuit the I–V curve is measured
 *  on, and the half-wave rectifier with the source held still. */
function seriesDiodeCircuit(loadOhms: number): Circuit {
  return {
    nodes: [
      mkNode('gnd', 0, 0, { label: '0 V', ground: true }),
      mkNode('in', 0, 2, { label: 'source +' }),
      mkNode('out', 3, 2, { label: 'output' }),
    ],
    components: [
      mkBattery('VS', 'gnd', 'in', 0, { label: 'supply', x: 0, y: 1 }),
      diodeSlot('D1', 'in', 'out', 1.5, 2),
      mkResistor('RL', 'out', 'gnd', loadOhms, { label: 'R_L', x: 3, y: 1 }),
    ],
  };
}

/** Centre-tapped full-wave: nothing floats, and only ONE diode drop per half. */
function centreTapCircuit(loadOhms: number): Circuit {
  return {
    nodes: [
      mkNode('ct', 0, 0, { label: 'centre tap', ground: true }),
      mkNode('a', 0, 2, { label: 'top of secondary' }),
      mkNode('b', 0, -2, { label: 'bottom of secondary' }),
      mkNode('out', 3, 0, { label: 'output' }),
    ],
    components: [
      // Two halves of one secondary. V(a) − V(ct) = +v and V(ct) − V(b) = +v, so
      // the two ends swing in antiphase about the centre tap — which is what a
      // centre-tapped winding IS.
      mkBattery('VS', 'ct', 'a', 0, { label: 'secondary, upper half', x: 0, y: 1 }),
      mkBattery('VS2', 'b', 'ct', 0, { label: 'secondary, lower half', x: 0, y: -1 }),
      diodeSlot('D1', 'a', 'out', 1.5, 2),
      diodeSlot('D2', 'b', 'out', 1.5, -2),
      mkResistor('RL', 'out', 'ct', loadOhms, { label: 'R_L', x: 3.4, y: 0 }),
    ],
  };
}

/**
 * The bridge. Four diodes in a diamond, and the pair that conducts changes with
 * the half cycle — which is exactly the `series_parallel_by_appearance` question:
 * WHICH NODES do they share?
 *
 * ⚠ THE 10 MΩ REFERENCE RESISTOR IS REAL AND IS LABELLED. A transformer secondary
 * has no defined d.c. level of its own, so in the dead band where all four diodes
 * are off the winding is genuinely floating and no potential across a diode is
 * defined. That is not a modelling artefact — it is why a bench measurement of a
 * bridge needs a reference. 10 MΩ draws 1.2 µA against a milliamp load, i.e. it is
 * invisible in every number displayed, and the alternative (letting the solver pin
 * a floating island wherever it likes) makes the diode-state test depend on an
 * arbitrary choice.
 */
function bridgeCircuit(loadOhms: number): Circuit {
  return {
    nodes: [
      mkNode('gnd', 1.5, -2, { label: '0 V', ground: true }),
      mkNode('ac1', 0, 0, { label: 'secondary A' }),
      mkNode('ac2', 3, 0, { label: 'secondary B' }),
      mkNode('out', 1.5, 2, { label: 'output +' }),
    ],
    components: [
      mkBattery('VS', 'ac2', 'ac1', 0, { label: 'secondary', x: 1.5, y: 0.4 }),
      diodeSlot('D1', 'ac1', 'out', 0.7, 1.2),
      diodeSlot('D2', 'ac2', 'out', 2.3, 1.2),
      diodeSlot('D3', 'gnd', 'ac1', 0.7, -1.2),
      diodeSlot('D4', 'gnd', 'ac2', 2.3, -1.2),
      mkResistor('RL', 'out', 'gnd', loadOhms, { label: 'R_L', x: 4, y: 0 }),
      mkResistor('RREF', 'ac2', 'gnd', 1e7, { label: 'reference resistor (10 MΩ) — see the note', x: 3.6, y: -1 }),
    ],
  };
}

/** Zener shunt regulator: unregulated supply, series resistor, Zener across the
 *  load. The Zener is REVERSE biased, so its anode is at the 0 V rail. */
function zenerCircuit(seriesOhms: number, loadOhms: number): Circuit {
  return {
    nodes: [
      mkNode('gnd', 0, 0, { label: '0 V', ground: true }),
      mkNode('in', 0, 2, { label: 'unregulated in' }),
      mkNode('out', 3, 2, { label: 'regulated out' }),
    ],
    components: [
      mkBattery('VS', 'gnd', 'in', 0, { label: 'unregulated supply', x: 0, y: 1 }),
      mkResistor('RS', 'in', 'out', seriesOhms, { label: 'R_S', x: 1.5, y: 2 }),
      diodeSlot('DZ', 'gnd', 'out', 3, 1),
      mkResistor('RL', 'out', 'gnd', loadOhms, { label: 'R_L', x: 4.2, y: 1 }),
    ],
  };
}

// ── the library ──────────────────────────────────────────────────────────────

export const SEMICONDUCTOR_ARCHETYPES: Record<string, SemiconductorArchetype> = {

  // ── 1 ──────────────────────────────────────────────────────────────────────
  'intrinsic-to-doped': {
    id: 'intrinsic-to-doped',
    title: 'One dopant atom in five million changes everything',
    summary:
      'Pure silicon has 1.5×10¹⁶ free electrons per cubic metre out of 5×10²⁸ atoms. Add one '
      + 'phosphorus atom per five million silicon atoms and the electron count rises by a factor of a '
      + 'million — while the hole count falls by exactly the same factor.',
    view: 'doping',
    targets: 'doping_adds_both_carriers',
    params: [
      { key: 'material', label: 'Material', kind: 'select', default: 'Si', options: [...MATERIAL_NAMES] },
      { key: 'type', label: 'Doping', kind: 'select', default: 'n-type', options: ['intrinsic', 'n-type', 'p-type'] },
      { key: 'dopant', label: 'Dopant density', kind: 'number', default: 1e16, min: 0, max: 1e19, step: 1e15, unit: 'per cm³' },
      { key: 'showBands', label: 'Show the band picture', kind: 'boolean', default: true },
    ],
    build(p?: SemiParamBag): Circuit {
      // A doped bar has a resistance, so the honest circuit is one resistor whose
      // value comes from the carrier physics rather than from a literal.
      const m = material(str(p, 'material', 'Si'));
      void m;
      return {
        nodes: [mkNode('gnd', 0, 0, { ground: true }), mkNode('a', 2, 0)],
        components: [mkResistor('BAR', 'a', 'gnd', 1000, { label: 'the doped bar' })],
      };
    },
    buildScene(p?: SemiParamBag): SemiconductorScene {
      const materialName = str(p, 'material', 'Si');
      const type = str(p, 'type', 'n-type') as DopingType;
      void bool(p, 'showBands', true);
      return {
        view: 'doping',
        circuit: this.build(p),
        diodes: [],
        doping: { materialName, type, dopantPerM3: perCm3(num(p, 'dopant', 1e16)) },
      };
    },
    defaultSteps: [
      { say: 'Pure silicon, 300 K. Every atom has four bonds and every bond is full, so a carrier only exists when heat breaks a bond. **Predict:** out of 5×10²⁸ atoms per cubic metre, how many free electrons do you expect?', cta: 'Count them' },
      { say: '1.5×10¹⁶ per cubic metre — about one atom in three trillion. Pure silicon is a very poor conductor, and that is the problem doping exists to solve.', cta: 'Add phosphorus' },
      { say: 'Phosphorus has five outer electrons. Four go into bonds and the fifth has nowhere to go, so it is free at room temperature. Watch both counts, not just the electrons.', cta: 'Watch the hole count' },
      { say: 'The electrons went up a million-fold and the holes went DOWN a million-fold. Their product has not moved: n·p = nᵢ². Doping did not add carriers, it traded them — and that is what creates a majority and a minority carrier.', cta: 'Try boron instead' },
      { say: 'Boron has three outer electrons, so one bond is short and there is a hole. Now the holes are the majority. Same silicon, same crystal, opposite carrier — and putting these two next to each other is the next exercise.', cta: 'Done' },
    ],
  },

  // ── 2 ──────────────────────────────────────────────────────────────────────
  'pn-junction': {
    id: 'pn-junction',
    title: 'The junction builds its own barrier, with nobody helping',
    summary:
      'Join p-type to n-type with no battery anywhere. Carriers diffuse across, uncover the fixed '
      + 'ions they left behind, and those ions make a field that stops the diffusion that made them. '
      + 'The standoff is the depletion region, and its 0.7 V is the same 0.7 V as the diode knee.',
    view: 'junction',
    targets: 'depletion_region_is_empty_space',
    params: [
      { key: 'material', label: 'Material', kind: 'select', default: 'Si', options: [...MATERIAL_NAMES] },
      { key: 'na', label: 'Acceptors on the p-side', kind: 'number', default: 1e16, min: 1e14, max: 1e19, step: 1e15, unit: 'per cm³' },
      { key: 'nd', label: 'Donors on the n-side', kind: 'number', default: 1e16, min: 1e14, max: 1e19, step: 1e15, unit: 'per cm³' },
      { key: 'showCharge', label: 'Show the exposed ions', kind: 'boolean', default: true },
    ],
    build(p?: SemiParamBag): Circuit {
      // The unbiased junction has no source at all. That is the point, and an
      // honest circuit says so: two terminals, nothing driving them.
      void num(p, 'na', 1e16);
      return {
        nodes: [mkNode('p', 0, 0, { label: 'p-side', ground: true }), mkNode('n', 3, 0, { label: 'n-side' })],
        components: [diodeSlot('D1', 'p', 'n', 1.5, 0)],
      };
    },
    buildScene(p?: SemiParamBag): SemiconductorScene {
      const m = material(str(p, 'material', 'Si'));
      void bool(p, 'showCharge', true);
      return {
        view: 'junction',
        circuit: this.build(p),
        diodes: [diode('D1', 'p', 'n', { material: m.name, label: 'the junction' })],
        junction: { material: m, na: perCm3(num(p, 'na', 1e16)), nd: perCm3(num(p, 'nd', 1e16)) },
      };
    },
    defaultSteps: [
      { say: 'A p-type block and an n-type block, about to be joined. No battery. **Predict:** with nothing connected, does anything happen at the boundary?', cta: 'Join them' },
      { say: 'Electrons diffuse from the crowded n-side into the p-side, holes go the other way — for the same reason a smell spreads across a room. But look at what they LEAVE.', cta: 'Show the ions they uncovered' },
      { say: 'Fixed ions. Negative acceptors on the p-side, positive donors on the n-side, in exactly equal amounts, and none of them can move because they are part of the crystal. That charge makes a field.', cta: 'See what the field does' },
      { say: 'The field points from the n-side to the p-side — precisely the wrong way for any more diffusion. So diffusion stops, and it stopped itself. The width it settles at is the depletion region.', cta: 'Read the barrier height' },
      { say: 'About 0.7 V for silicon at this doping — and that is not a coincidence with the diode knee, it is the SAME NUMBER. A diode conducts at 0.7 V because that is what it takes to cancel the barrier the junction built for itself.', cta: 'Done' },
    ],
  },

  // ── 3 ──────────────────────────────────────────────────────────────────────
  biasing: {
    id: 'biasing',
    title: 'A diode is a barrier you are raising or lowering',
    summary:
      'One slider, one formula, both directions. Forward bias subtracts from the built-in potential so '
      + 'the depletion layer narrows and the bands flatten; reverse bias adds to it so the layer widens '
      + 'and the bend steepens. There is no second rule for reverse.',
    view: 'junction',
    targets: 'forward_and_reverse_are_different_rules',
    params: [
      { key: 'material', label: 'Material', kind: 'select', default: 'Si', options: [...MATERIAL_NAMES] },
      { key: 'bias', label: 'Applied bias', kind: 'number', default: 0, min: -10, max: 0.6, step: 0.05, unit: 'V' },
      { key: 'na', label: 'Acceptors, p-side', kind: 'number', default: 1e16, min: 1e14, max: 1e19, step: 1e15, unit: 'per cm³' },
      { key: 'nd', label: 'Donors, n-side', kind: 'number', default: 1e16, min: 1e14, max: 1e19, step: 1e15, unit: 'per cm³' },
    ],
    build(p?: SemiParamBag): Circuit {
      const bias = num(p, 'bias', 0);
      return {
        nodes: [
          mkNode('gnd', 0, 0, { label: '0 V', ground: true }),
          mkNode('p', 0, 2, { label: 'p-side' }),
          mkNode('n', 3, 2, { label: 'n-side' }),
        ],
        components: [
          mkBattery('VBIAS', 'gnd', 'p', bias, { label: 'bias supply', x: 0, y: 1 }),
          diodeSlot('D1', 'p', 'n', 1.5, 2),
          mkResistor('RS', 'n', 'gnd', 1000, { label: 'R_S (1 kΩ, to limit the current)', x: 3, y: 1 }),
        ],
      };
    },
    buildScene(p?: SemiParamBag): SemiconductorScene {
      const m = material(str(p, 'material', 'Si'));
      return {
        view: 'junction',
        circuit: this.build(p),
        diodes: [diode('D1', 'p', 'n', { material: m.name, label: 'the junction' })],
        junction: { material: m, na: perCm3(num(p, 'na', 1e16)), nd: perCm3(num(p, 'nd', 1e16)) },
        probes: ['p', 'n'],
      };
    },
    defaultSteps: [
      { say: 'The junction at zero bias, with its self-built barrier. **Predict:** connect the battery + to the p-side. Does the depletion region get wider, narrower, or stay the same?', cta: 'Apply forward bias' },
      { say: 'Narrower. The battery pushes holes toward the junction from the left and electrons from the right, and they refill part of the depleted zone — so the barrier the ions were holding up is partly cancelled.', cta: 'Watch the bands flatten' },
      { say: 'The bend is V_bi − V, so it is shrinking. When it is nearly gone, carriers can cross in numbers and the diode conducts. That is what "0.7 V" is buying you.', cta: 'Now reverse it' },
      { say: 'Wider, and the bend steeper — because now the applied voltage ADDS to the barrier. The carriers are pulled further apart, the exposed-ion region grows, and almost nothing crosses.', cta: 'Check the one formula' },
      { say: 'Both directions came out of W = √(2ε(V_bi − V)/q · (1/N_A + 1/N_D)). One expression, one sign, no second rule — a diode is not a component with a behaviour, it is a barrier with a height you control.', cta: 'Done' },
    ],
  },

  // ── 4 ──────────────────────────────────────────────────────────────────────
  'diode-iv': {
    id: 'diode-iv',
    title: 'There is no knee in the equation',
    summary:
      'The diode characteristic is I = I_S(e^(V/V_T) − 1) — a smooth exponential with no corner in it '
      + 'anywhere. The "knee at 0.7 V" is what an exponential looks like on a linear axis. Switch the '
      + 'current axis to logarithmic and it is a straight line rising 59.5 mV per decade.',
    view: 'iv',
    targets: 'diode_has_a_resistance',
    params: [
      { key: 'material', label: 'Diode material', kind: 'select', default: 'Si', options: ['Si', 'Ge'] },
      { key: 'logAxis', label: 'Logarithmic current axis', kind: 'boolean', default: false },
      { key: 'load', label: 'Series resistor', kind: 'number', default: 1000, min: 100, max: 10000, step: 100, unit: 'Ω' },
      { key: 'supply', label: 'Supply voltage', kind: 'number', default: 5, min: -10, max: 12, step: 0.5, unit: 'V' },
    ],
    build(p?: SemiParamBag): Circuit {
      const c = seriesDiodeCircuit(num(p, 'load', 1000));
      c.components = c.components.map((x) => (x.id === 'VS' ? { ...x, value: num(p, 'supply', 5) } : x));
      return c;
    },
    buildScene(p?: SemiParamBag): SemiconductorScene {
      void bool(p, 'logAxis', false);
      const m = str(p, 'material', 'Si');
      return {
        view: 'iv',
        circuit: this.build(p),
        diodes: [diode('D1', 'in', 'out', { material: m, label: 'D1' })],
        probes: ['in', 'out'],
      };
    },
    defaultSteps: [
      { say: 'Nothing plotted yet. **Predict:** sketch what you expect the forward part of a diode\'s I–V graph to look like. Most sketches have a flat bit and then a sharp corner.', cta: 'Plot the real curve' },
      { say: 'There is the corner — at about 0.7 V for silicon. Now look closely at the flat part: it is not flat, it is a very small exponential. Nothing about this curve has a corner in it.', cta: 'Switch to a log current axis' },
      { say: 'A straight line. The corner was never in the diode — it was in your linear axis. On a log axis the current multiplies by ten for every 59.5 mV, all the way from a nanoamp to an amp.', cta: 'Try germanium' },
      { say: 'The same shape, shifted left to about 0.3 V — and its reverse leakage is thousands of times bigger, which is exactly why silicon replaced germanium. Now put it in a circuit.', cta: 'Load-line it' },
      { say: 'A 5 V supply through 1 kΩ. The diode and the resistor have to agree on one current, so the answer is where the diode curve crosses the load line — and that graphical solve is the whole method for any nonlinear element.', cta: 'Done' },
    ],
  },

  // ── 5 ──────────────────────────────────────────────────────────────────────
  'half-wave-rectifier': {
    id: 'half-wave-rectifier',
    title: 'Half the wave is gone, and so is half the energy',
    summary:
      'One diode, one load, and the input and output on the same time axis. The negative half is not '
      + 'inverted and not attenuated — it is absent, because for that whole half cycle the diode has no '
      + 'consistent conducting state and the solver finds none.',
    view: 'rectifier',
    targets: 'current_used_up',
    params: [
      { key: 'peak', label: 'Peak input', kind: 'number', default: 12, min: 2, max: 30, step: 0.5, unit: 'V' },
      { key: 'load', label: 'Load', kind: 'number', default: 1000, min: 100, max: 10000, step: 100, unit: 'Ω' },
      { key: 'material', label: 'Diode material', kind: 'select', default: 'Si', options: ['Si', 'Ge'] },
      { key: 'frequency', label: 'Supply frequency', kind: 'number', default: 50, min: 50, max: 60, step: 10, unit: 'Hz' },
    ],
    build(p?: SemiParamBag): Circuit {
      return seriesDiodeCircuit(num(p, 'load', 1000));
    },
    buildScene(p?: SemiParamBag): SemiconductorScene {
      const load = num(p, 'load', 1000);
      return {
        view: 'rectifier',
        circuit: this.build(p),
        diodes: [diode('D1', 'in', 'out', { material: str(p, 'material', 'Si'), label: 'D1' })],
        rectifier: {
          sourceIds: ['VS'],
          peak: num(p, 'peak', 12),
          frequency: num(p, 'frequency', 50),
          outputNodes: ['out', 'gnd'],
          loadOhms: load,
          topology: 'half-wave',
        },
        probes: ['out', 'gnd'],
      };
    },
    defaultSteps: [
      { say: 'A 12 V peak sinusoid, one silicon diode, a 1 kΩ load. **Predict:** on the negative half cycle, is the output inverted, reduced, or nothing at all?', cta: 'Sweep one cycle' },
      { say: 'Nothing at all — a flat line at zero for half the time. And the positive half does not reach 12 V either: it peaks 0.7 V lower, because the conducting diode is holding that much across itself.', cta: 'Compare the two currents' },
      { say: 'The diode current and the load current lie exactly on top of each other. They are in series — the diode does not consume current, it decides WHETHER there is any.', cta: 'Read the average' },
      { say: 'The mean output is V_p/π, about 0.318 of the peak, and the ripple factor is 1.21 — the a.c. left in the output is bigger than the d.c. This is a poor power supply, and the next exercise says why.', cta: 'Done' },
    ],
  },

  // ── 6 ──────────────────────────────────────────────────────────────────────
  'full-wave-rectifier': {
    id: 'full-wave-rectifier',
    title: 'Both halves, and which pair conducts is a topology question',
    summary:
      'Now the negative half is there, flipped up. Twice the average, half the ripple, and twice the '
      + 'ripple frequency. Which diodes conduct on which half cycle cannot be read off the drawing — '
      + 'only off which nodes they share.',
    view: 'rectifier',
    targets: 'series_parallel_by_appearance',
    params: [
      { key: 'topology', label: 'Circuit', kind: 'select', default: 'centre-tap', options: ['centre-tap', 'bridge'] },
      { key: 'peak', label: 'Peak input', kind: 'number', default: 12, min: 2, max: 30, step: 0.5, unit: 'V' },
      { key: 'load', label: 'Load', kind: 'number', default: 1000, min: 100, max: 10000, step: 100, unit: 'Ω' },
      { key: 'frequency', label: 'Supply frequency', kind: 'number', default: 50, min: 50, max: 60, step: 10, unit: 'Hz' },
    ],
    build(p?: SemiParamBag): Circuit {
      const load = num(p, 'load', 1000);
      return str(p, 'topology', 'centre-tap') === 'bridge'
        ? bridgeCircuit(load)
        : centreTapCircuit(load);
    },
    buildScene(p?: SemiParamBag): SemiconductorScene {
      const topology = str(p, 'topology', 'centre-tap') === 'bridge' ? 'bridge' : 'centre-tap';
      const load = num(p, 'load', 1000);
      const diodes = topology === 'bridge'
        ? [
          diode('D1', 'ac1', 'out', { label: 'D1' }),
          diode('D2', 'ac2', 'out', { label: 'D2' }),
          diode('D3', 'gnd', 'ac1', { label: 'D3' }),
          diode('D4', 'gnd', 'ac2', { label: 'D4' }),
        ]
        : [
          diode('D1', 'a', 'out', { label: 'D1' }),
          diode('D2', 'b', 'out', { label: 'D2' }),
        ];
      return {
        view: 'rectifier',
        circuit: this.build(p),
        diodes,
        rectifier: {
          // Both halves of a centre-tapped winding are driven together — see the
          // `sourceIds` note in rectifier.ts. A bridge has one winding.
          sourceIds: topology === 'bridge' ? ['VS'] : ['VS', 'VS2'],
          peak: num(p, 'peak', 12),
          frequency: num(p, 'frequency', 50),
          outputNodes: topology === 'bridge' ? ['out', 'gnd'] : ['out', 'ct'],
          loadOhms: load,
          topology,
        },
        probes: topology === 'bridge' ? ['out', 'gnd'] : ['out', 'ct'],
      };
    },
    defaultSteps: [
      { say: 'A centre-tapped winding and two diodes. **Predict:** the half-wave circuit gave an average of V_p/π. What will this one give?', cta: 'Sweep one cycle' },
      { say: '2V_p/π — exactly twice, because the second half is no longer thrown away. And notice the output repeats twice per input cycle, so on a 50 Hz supply the ripple is at 100 Hz. That is the quickest way to tell the two circuits apart on a scope.', cta: 'Check the ripple factor' },
      { say: 'Ripple has fallen from 1.21 to 0.48, and efficiency has doubled from 4/π² = 40.5% to 8/π² = 81.1%. Same diodes, same load — the improvement came entirely from not discarding half the input.', cta: 'Switch to the bridge' },
      { say: 'Four diodes now, and a plain winding with no centre tap. **Predict, before the highlight moves:** on the positive half, which two conduct?', cta: 'Run it and watch' },
      { say: 'Diagonally opposite pairs — D1 with D4, then D2 with D3. Not the two on the left. And the trade: the bridge needs no centre tap and each diode only has to withstand V_p in reverse instead of 2V_p, but the output loses TWO diode drops instead of one.', cta: 'Done' },
    ],
  },

  // ── 7 ──────────────────────────────────────────────────────────────────────
  'zener-regulator': {
    id: 'zener-regulator',
    title: 'A diode that is useful precisely because it broke',
    summary:
      'Run a Zener backwards past its breakdown voltage and it holds that voltage almost exactly, '
      + 'whatever current you push through it. Vary the supply from 4 V to 20 V and watch the output '
      + 'refuse to move.',
    view: 'zener',
    targets: 'breakdown_destroys_a_diode',
    params: [
      { key: 'zener', label: 'Zener voltage', kind: 'number', default: 6.2, min: 3.3, max: 12, step: 0.1, unit: 'V' },
      { key: 'supply', label: 'Unregulated supply', kind: 'number', default: 12, min: 2, max: 24, step: 0.5, unit: 'V' },
      { key: 'series', label: 'Series resistor R_S', kind: 'number', default: 470, min: 100, max: 4700, step: 10, unit: 'Ω' },
      { key: 'load', label: 'Load', kind: 'number', default: 1000, min: 200, max: 100000, step: 100, unit: 'Ω' },
    ],
    build(p?: SemiParamBag): Circuit {
      const c = zenerCircuit(num(p, 'series', 470), num(p, 'load', 1000));
      c.components = c.components.map((x) => (x.id === 'VS' ? { ...x, value: num(p, 'supply', 12) } : x));
      return c;
    },
    buildScene(p?: SemiParamBag): SemiconductorScene {
      return {
        view: 'zener',
        circuit: this.build(p),
        diodes: [diode('DZ', 'gnd', 'out', {
          breakdown: num(p, 'zener', 6.2), zenerResistance: 5, label: 'Zener',
        })],
        zener: {
          sourceIds: ['VS'],
          outputNodes: ['out', 'gnd'],
          seriesOhms: num(p, 'series', 470),
          loadOhms: num(p, 'load', 1000),
        },
        probes: ['out', 'gnd'],
      };
    },
    defaultSteps: [
      { say: 'A 6.2 V Zener across the load, reverse biased, with a 470 Ω resistor feeding it. **Predict:** raise the supply from 12 V to 20 V. What does the output do?', cta: 'Raise the supply' },
      { say: 'It does not move — 6.2 V, still. Every extra volt from the supply is dropped across R_S, and the extra current it produces goes through the Zener, not the load.', cta: 'Drop the supply below 6.2 V' },
      { say: 'Now regulation is gone: the Zener is no longer in breakdown, so it is simply off, and the output is a plain resistor divider. A regulator needs headroom, and this is where it runs out.', cta: 'Change the load instead' },
      { say: 'Output still 6.2 V, and now watch the Zener current: it takes up exactly whatever the load stopped taking. That is the mechanism — the Zener is a shunt that absorbs the difference.', cta: 'Find the limit' },
      { say: 'Make the load heavy enough and the Zener current falls to zero — beyond that it drops out of breakdown and regulation fails again. Between those two limits, the design works. Outside them, it does not.', cta: 'Done' },
    ],
  },

  // ── 8 ──────────────────────────────────────────────────────────────────────
  'transistor-switch': {
    id: 'transistor-switch',
    title: 'β is not a gain, it is a ratio in which a base splits carriers',
    summary:
      'Microamps into the base, milliamps out of the collector. β = 100 means 99 carriers in 100 cross '
      + 'the base without recombining — a statement about how thin and how lightly doped the base is, not '
      + 'about amplification.',
    view: 'transistor',
    targets: 'collector_current_is_always_beta_ib',
    params: [
      { key: 'beta', label: 'Current gain β', kind: 'number', default: 100, min: 20, max: 300, step: 5 },
      { key: 'vbb', label: 'Base supply V_BB', kind: 'number', default: 3, min: 0, max: 12, step: 0.1, unit: 'V' },
      { key: 'rb', label: 'Base resistor R_B', kind: 'number', default: 100000, min: 1000, max: 1000000, step: 1000, unit: 'Ω' },
      { key: 'vcc', label: 'Collector supply V_CC', kind: 'number', default: 12, min: 3, max: 24, step: 0.5, unit: 'V' },
      { key: 'rc', label: 'Collector resistor R_C', kind: 'number', default: 2200, min: 100, max: 22000, step: 100, unit: 'Ω' },
    ],
    build(p?: SemiParamBag): Circuit {
      // The BASE LOOP is an ordinary linear circuit and goes through the frozen
      // nodal solver; the collector side is closed form. See the header.
      return baseLoopCircuit({
        beta: num(p, 'beta', 100),
        vbeOn: 0.7,
        vceSat: 0.2,
        vbb: num(p, 'vbb', 3),
        rb: num(p, 'rb', 100000),
        vcc: num(p, 'vcc', 12),
        rc: num(p, 'rc', 2200),
      });
    },
    buildScene(p?: SemiParamBag): SemiconductorScene {
      const t: TransistorSpec = {
        beta: num(p, 'beta', 100),
        vbeOn: 0.7,
        vceSat: 0.2,
        vbb: num(p, 'vbb', 3),
        rb: num(p, 'rb', 100000),
        vcc: num(p, 'vcc', 12),
        rc: num(p, 'rc', 2200),
        label: 'Q1',
      };
      return { view: 'transistor', circuit: this.build(p), diodes: [], transistor: t, probes: ['bb', 'e'] };
    },
    defaultSteps: [
      { say: 'V_BB = 0, so nothing flows. **Predict:** the base-emitter junction is a diode. What has to happen before ANY base current flows?', cta: 'Raise V_BB to 0.5 V' },
      { say: 'Still nothing — 0.5 V has not reached the 0.7 V the junction needs. This is cutoff, the switch open, and the whole 12 V supply is sitting across the transistor.', cta: 'Push past 0.7 V' },
      { say: 'Now base current flows, and the collector current is β times it. 23 µA in, 2.3 mA out — and notice that the base current is set entirely by V_BB, R_B and 0.7 V, not by the transistor.', cta: 'Keep raising it' },
      { say: 'V_CE is falling as the collector current grows, because the load resistor is taking the difference. **Predict:** what happens when it reaches zero?', cta: 'Push it into saturation' },
      { say: 'It never reaches zero — it stops at about 0.2 V. The collector cannot pass more than (V_CC − 0.2)/R_C, so the effective β falls below the rated value and keeps falling. The switch is closed, and β has stopped mattering.', cta: 'Read the overdrive' },
      { say: 'That ratio — the base current you are supplying divided by the base current needed to just saturate — is what a designer calls overdrive. Above about 3 the switch is solid across temperature and across the 3:1 spread of β between parts. That spread is why a switch is never designed to sit in the active region.', cta: 'Done' },
    ],
  },

  // ── 9 ──────────────────────────────────────────────────────────────────────
  'transistor-amplifier': {
    id: 'transistor-amplifier',
    title: 'The same curve, used in the middle instead of at the ends',
    summary:
      'A switch lives at the two flat ends of the transfer curve. An amplifier lives on the slope '
      + 'between them — and that slope is negative, so a common-emitter stage always inverts.',
    view: 'transistor',
    targets: 'amplifier_output_follows_the_input',
    params: [
      { key: 'beta', label: 'Current gain β', kind: 'number', default: 100, min: 20, max: 300, step: 5 },
      { key: 'vbb', label: 'Bias point V_BB', kind: 'number', default: 1.4, min: 0, max: 6, step: 0.02, unit: 'V' },
      { key: 'rb', label: 'Base resistor R_B', kind: 'number', default: 100000, min: 1000, max: 1000000, step: 1000, unit: 'Ω' },
      { key: 'vcc', label: 'Collector supply V_CC', kind: 'number', default: 12, min: 3, max: 24, step: 0.5, unit: 'V' },
      { key: 'rc', label: 'Collector resistor R_C', kind: 'number', default: 2200, min: 100, max: 22000, step: 100, unit: 'Ω' },
      { key: 'swing', label: 'Input swing', kind: 'number', default: 0.2, min: 0.01, max: 2, step: 0.01, unit: 'V' },
    ],
    build(p?: SemiParamBag): Circuit {
      return baseLoopCircuit({
        beta: num(p, 'beta', 100),
        vbeOn: 0.7,
        vceSat: 0.2,
        vbb: num(p, 'vbb', 1.4),
        rb: num(p, 'rb', 100000),
        vcc: num(p, 'vcc', 12),
        rc: num(p, 'rc', 2200),
      });
    },
    buildScene(p?: SemiParamBag): SemiconductorScene {
      void num(p, 'swing', 0.2);
      const t: TransistorSpec = {
        beta: num(p, 'beta', 100),
        vbeOn: 0.7,
        vceSat: 0.2,
        vbb: num(p, 'vbb', 1.4),
        rb: num(p, 'rb', 100000),
        vcc: num(p, 'vcc', 12),
        rc: num(p, 'rc', 2200),
        label: 'Q1',
      };
      return { view: 'transistor', circuit: this.build(p), diodes: [], transistor: t, probes: ['bb', 'e'] };
    },
    defaultSteps: [
      { say: 'The transfer curve — collector voltage against base voltage — with the bias point sitting on it. **Predict:** nudge the input UP. Does the output go up or down?', cta: 'Nudge the input up' },
      { say: 'Down. More base current, more collector current, a bigger drop across R_C, so less left for the collector. A common-emitter stage inverts, always, and the gain is negative for that reason and no other.', cta: 'Measure the gain' },
      { say: 'ΔV_CE/ΔV_BB, measured off your own two points — and it matches −βR_C/R_B. The base resistor is in the input path, so it divides the input down before the transistor ever sees it.', cta: 'Widen the swing' },
      { say: 'The peaks have flattened. The output ran into V_CC at one end and 0.2 V at the other, and no value of β can push it past a supply rail. That is clipping.', cta: 'Move the bias point' },
      { say: 'Bias too low and the bottom clips first; too high and the top does. Put it in the middle of the slope and you get the largest undistorted swing — which is the entire reason a bias point is chosen rather than left wherever it lands.', cta: 'Done' },
    ],
  },
};

/** Stable presentation order — the teaching order: the material, then the '
 *  junction, then the device, then what the device is for. */
export const SEMICONDUCTOR_ARCHETYPE_ORDER: string[] = [
  'intrinsic-to-doped',
  'pn-junction',
  'biasing',
  'diode-iv',
  'half-wave-rectifier',
  'full-wave-rectifier',
  'zener-regulator',
  'transistor-switch',
  'transistor-amplifier',
];

export const getSemiconductorArchetype = (id?: string): SemiconductorArchetype | undefined =>
  id ? SEMICONDUCTOR_ARCHETYPES[id] : undefined;

/** What an admin picker needs — metadata only, readable without running build(). */
export interface SemiconductorArchetypeSummary {
  id: string;
  title: string;
  summary: string;
  view: SemiView;
  params: NonNullable<CircuitArchetype['params']>;
  stepped: boolean;
  stepCount: number;
  /** Always present — required on `SemiconductorArchetype`. */
  targets: CircuitMisconception;
}

export const SEMICONDUCTOR_ARCHETYPE_CATALOG: SemiconductorArchetypeSummary[] =
  SEMICONDUCTOR_ARCHETYPE_ORDER
    .map((id) => SEMICONDUCTOR_ARCHETYPES[id])
    .filter((a): a is SemiconductorArchetype => !!a)
    .map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      view: a.view,
      params: a.params ?? [],
      stepped: !!a.defaultSteps?.length,
      stepCount: a.defaultSteps?.length ?? 0,
      targets: a.targets,
    }));

/**
 * Compile-time proof that this library satisfies the frozen contract, so it can
 * be merged into `CIRCUIT_ARCHETYPES` the day the founder wants it there with no
 * cast and no adaptation. A future edit that breaks assignability fails here
 * rather than at the merge site.
 */
const _satisfiesFrozenContract: Record<string, CircuitArchetype> = SEMICONDUCTOR_ARCHETYPES;
void _satisfiesFrozenContract;
