/*
 * circuit-bench/archetypes.ts — the E3 construction library. PURE.
 * ─────────────────────────────────────────────────────────────────────────────
 * The engine ships once as code; every circuits exercise on every page is a
 * `circuit_bench` block naming ONE id from this file plus params. Extending what
 * the bench CAN do is code; building an exercise is DATA, authorable by faculty
 * in the books editor. Same contract as motion-lab and mechanics-bench.
 *
 * Every archetype declares:
 *   • `params`       — the knobs, so the admin editor renders inputs with no
 *                      developer involvement, and so the STUDENT can change the
 *                      scene rather than watch ours (design law #1);
 *   • `defaultSteps` — the GUIDED script. The panel says what is about to
 *                      happen, the student clicks, ONE thing appears. Never an
 *                      auto-playing animation (design law #5);
 *   • `targets`      — the named misconception it exists to attack, wired to
 *                      real feedback in `lib/misconceptions.ts` (design law #2).
 *                      An archetype that attacks nothing is a moving diagram.
 *
 * ── COORDINATES ─────────────────────────────────────────────────────────────
 * Board units, y DOWN (SVG-native — a netlist has no physical "up"). Positions
 * are drawing only: NOTHING in the solver or the redraw ever reads them. Where a
 * component carries a `pos`, it is routed with orthogonal elbows through that
 * point, which is how a cell ends up drawn along the bottom of a bridge instead
 * of straight through the middle of it.
 *
 * ── EVERY NUMBER BELOW IS HAND-CHECKED ──────────────────────────────────────
 * The expected result of each default build is stated in its comment and
 * re-derived independently in `scripts/verify-circuit-bench.mjs`.
 */

import type { Circuit, CircuitArchetype } from './types';
import {
  mkAmmeter, mkBattery, mkBulb, mkCircuit, mkGalvanometer, mkNode, mkResistor,
  mkSwitch, mkVoltmeter, mkWire,
} from './lib/netlist';

// ── Param helpers ────────────────────────────────────────────────────────────

type Bag = Record<string, number | string | boolean>;
type Param = NonNullable<CircuitArchetype['params']>[number];

const num = (
  key: string, label: string, def: number,
  min: number, max: number, step: number, unit?: string,
): Param => ({ key, label, kind: 'number', default: def, min, max, step, unit });

const sel = (key: string, label: string, def: string, options: string[]): Param =>
  ({ key, label, kind: 'select', default: def, options });

const yesno = (key: string, label: string, def: boolean): Param =>
  ({ key, label, kind: 'boolean', default: def });

const N = (p: Bag | undefined, k: string, d: number): number => {
  const v = p?.[k];
  return typeof v === 'number' && Number.isFinite(v) ? v : d;
};
const S = (p: Bag | undefined, k: string, d: string): string => {
  const v = p?.[k];
  return typeof v === 'string' && v ? v : d;
};
const Y = (p: Bag | undefined, k: string, d: boolean): boolean => {
  const v = p?.[k];
  return typeof v === 'boolean' ? v : d;
};

// ── The library ──────────────────────────────────────────────────────────────

export const CIRCUIT_ARCHETYPES: Record<string, CircuitArchetype> = {

  // 1 ────────────────────────────────────────────────────────────────────────
  // 6 Ω and 3 Ω: in series 9 Ω, in parallel 2 Ω. Same two resistors.
  'series-vs-parallel': {
    id: 'series-vs-parallel',
    title: 'Series or parallel?',
    summary:
      'The same two resistors, wired two ways. The only thing that changes is which nodes they share — and the answer moves from 9 Ω to 2 Ω.',
    targets: 'series_parallel_by_appearance',
    params: [
      num('r1', 'R1', 6, 1, 50, 1, 'Ω'),
      num('r2', 'R2', 3, 1, 50, 1, 'Ω'),
      sel('layout', 'Wiring', 'series', ['series', 'parallel']),
    ],
    probes: ['A', 'B'],
    build(p) {
      const r1 = N(p, 'r1', 6);
      const r2 = N(p, 'r2', 3);
      if (S(p, 'layout', 'series') === 'parallel') {
        return mkCircuit(
          [mkNode('A', 0, 0), mkNode('B', 380, 0)],
          [mkResistor('R1', 'A', 'B', r1), mkResistor('R2', 'A', 'B', r2)],
        );
      }
      return mkCircuit(
        [mkNode('A', 0, 0), mkNode('M', 190, 0), mkNode('B', 380, 0)],
        [mkResistor('R1', 'A', 'M', r1), mkResistor('R2', 'M', 'B', r2)],
      );
    },
    defaultSteps: [
      { say: 'Two resistors and two probe points. Before anything is combined, look at the middle point M — how many things are attached to it?', cta: 'Show the nodes' },
      { say: 'Only R1 and R2 touch M. There is nowhere else for the current to go, so every electron through R1 goes through R2. That is what series MEANS — not "drawn in a row".', cta: 'Combine them' },
      { say: 'Now switch the wiring to parallel and watch what happens to M: it disappears. Both resistors now touch A at one end and B at the other.', cta: 'Rewire as parallel' },
      { say: 'Same two resistors, and the total has dropped below the smaller one. Sharing BOTH ends is the whole difference.', cta: 'Show both answers' },
    ],
  },

  // 2 ────────────────────────────────────────────────────────────────────────
  // R1 6 ‖ R2 3 = 2, in series with R3 4 → 6 Ω. Drawn so that the parallel pair
  // is nowhere near each other on the page.
  'ugly-redraw': {
    id: 'ugly-redraw',
    title: 'The exam-style tangle',
    summary:
      'A circuit drawn the way exams draw it: two long wires hide the fact that R1 and R2 share both ends. Collapse the wires and it is an ordinary parallel pair.',
    targets: 'series_parallel_by_appearance',
    params: [
      num('r1', 'R1 (the far one)', 6, 1, 50, 1, 'Ω'),
      num('r2', 'R2', 3, 1, 50, 1, 'Ω'),
      num('r3', 'R3', 4, 1, 50, 1, 'Ω'),
    ],
    probes: ['A', 'C'],
    build(p) {
      return mkCircuit(
        [
          mkNode('A', 0, 0), mkNode('A2', 40, -220), mkNode('B2', 340, -180),
          mkNode('B', 300, 70), mkNode('C', 500, 170),
        ],
        [
          mkWire('w1', 'A', 'A2'),
          mkResistor('R1', 'A2', 'B2', N(p, 'r1', 6)),
          mkWire('w2', 'B2', 'B'),
          mkResistor('R2', 'A', 'B', N(p, 'r2', 3)),
          mkResistor('R3', 'B', 'C', N(p, 'r3', 4)),
        ],
      );
    },
    defaultSteps: [
      { say: 'Look at the drawing and answer honestly: are R1 and R2 in series, in parallel, or neither? They are drawn nowhere near each other.', cta: 'I have decided' },
      { say: 'Now follow w1 with your finger. A wire has no resistance, so A and A2 are not two places — they are one point wearing two names.', cta: 'Collapse w1' },
      { say: 'Same for w2: B2 and B are one point. Watch what R1 and R2 become once the two wires are gone.', cta: 'Collapse w2' },
      { say: 'Both ends shared. R1 and R2 were in parallel the whole time — the drawing was the only thing hiding it.', cta: 'Finish the reduction' },
    ],
  },

  // 3 ────────────────────────────────────────────────────────────────────────
  // 12 V ideal cell, two 6 Ω bulbs in series → R = 12 Ω, I = 1 A everywhere,
  // 6 W in each bulb. Identical brightness.
  'current-not-used-up': {
    id: 'current-not-used-up',
    title: 'Two bulbs in series',
    summary:
      'Identical bulbs one after the other. Measure the current before, between and after them — it is the same number three times.',
    targets: 'current_used_up',
    params: [
      num('emf', 'Cell EMF', 12, 1, 24, 1, 'V'),
      num('bulb_r', 'Each bulb', 6, 1, 40, 1, 'Ω'),
    ],
    probes: ['neg', 'pos'],
    build(p) {
      const rb = N(p, 'bulb_r', 6);
      return mkCircuit(
        [
          mkNode('neg', 0, 240, { ground: true }), mkNode('pos', 0, 0),
          mkNode('m', 240, 0), mkNode('rt', 480, 0),
        ],
        [
          mkBattery('B1', 'neg', 'pos', N(p, 'emf', 12)),
          mkBulb('L1', 'pos', 'm', rb),
          mkBulb('L2', 'm', 'rt', rb),
          mkWire('w1', 'rt', 'neg', { x: 240, y: 240 }),
        ],
      );
    },
    defaultSteps: [
      { say: 'Two identical bulbs, one after the other. Predict first: is L1 brighter than L2, dimmer, or exactly the same?', cta: 'Lock in my prediction' },
      { say: 'Here is the current in the wire before L1. Remember the number.', cta: 'Measure before L1' },
      { say: 'Now between the two bulbs — the current that got "past" the first one.', cta: 'Measure between them' },
      { say: 'Identical. A bulb uses up ENERGY, not charge: what drops across it is the p.d., and both bulbs drop the same, so both are equally bright.', cta: 'Show the power in each' },
    ],
  },

  // 4 ────────────────────────────────────────────────────────────────────────
  // n identical 6 Ω resistors across a 12 V ideal cell → R = 6/n, I = 2n A.
  'adding-parallel-lowers-R': {
    id: 'adding-parallel-lowers-R',
    title: 'Adding resistors — lower resistance',
    summary:
      'Add a second resistor in parallel and the total resistance HALVES. More components, less resistance, more current out of the cell.',
    targets: 'more_resistors_more_resistance',
    params: [
      num('n', 'How many branches', 2, 1, 4, 1, ''),
      num('r', 'Each branch', 6, 1, 40, 1, 'Ω'),
      num('emf', 'Cell EMF', 12, 1, 24, 1, 'V'),
    ],
    probes: ['neg', 'pos'],
    build(p) {
      const n = Math.max(1, Math.min(4, Math.round(N(p, 'n', 2))));
      const r = N(p, 'r', 6);
      const comps = [mkBattery('B1', 'neg', 'pos', N(p, 'emf', 12))];
      for (let i = 0; i < n; i++) {
        comps.push(mkResistor(`R${i + 1}`, 'pos', 'neg', r, { x: 180 + i * 170, y: 120 }));
      }
      return mkCircuit(
        [mkNode('neg', 0, 240, { ground: true }), mkNode('pos', 0, 0)],
        comps,
      );
    },
    defaultSteps: [
      { say: 'One resistor across the cell. Note the current the cell is delivering.', cta: 'Show the current' },
      { say: 'Predict before you touch the slider: add a SECOND identical resistor in parallel. Does the total resistance go up, down, or stay the same?', cta: 'Lock in my prediction' },
      { say: 'Add it. Each branch still has the full cell voltage across it, so each still carries the same current as before — and now there are two of them.', cta: 'Add the second branch' },
      { say: 'Twice the current out of the cell means half the resistance. A parallel resistor is another lane on the road, not a narrower road.', cta: 'Show the total' },
    ],
  },

  // 5 ────────────────────────────────────────────────────────────────────────
  // EMF 12 V, r = 1 Ω, load 5 Ω → total 6 Ω, I = 2 A, terminal p.d. = 10 V.
  'internal-resistance': {
    id: 'internal-resistance',
    title: 'The cell fights itself',
    summary:
      'A real cell has resistance inside it. Terminal p.d. = EMF − I·r, so the voltage you can actually use drops as soon as you draw current.',
    targets: 'battery_constant_current',
    params: [
      num('emf', 'EMF', 12, 1, 24, 1, 'V'),
      num('internal', 'Internal resistance r', 1, 0, 5, 0.1, 'Ω'),
      num('load', 'External load R', 5, 0.5, 40, 0.5, 'Ω'),
    ],
    probes: ['neg', 'pos'],
    build(p) {
      return mkCircuit(
        [mkNode('neg', 0, 240, { ground: true }), mkNode('pos', 0, 0)],
        [
          mkBattery('B1', 'neg', 'pos', N(p, 'emf', 12), {
            internal: N(p, 'internal', 1), x: 0, y: 120,
          }),
          mkResistor('R1', 'pos', 'neg', N(p, 'load', 5), { x: 320, y: 120 }),
        ],
      );
    },
    defaultSteps: [
      { say: 'A 12 V cell and a 5 Ω resistor. Predict the current before we solve it — most people say 12 ÷ 5 = 2.4 A.', cta: 'Lock in my prediction' },
      { say: 'Lift the cell out and look inside it. There is a small resistance in there too, in the same loop as the load — so the current has to go through BOTH.', cta: 'Open up the cell' },
      { say: 'Total resistance is r + R, not R. That is what sets the current — and it is why a cell is not a current source: change R and the current changes.', cta: 'Add them up' },
      { say: 'Now the p.d. you can actually use at the terminals: EMF minus what the cell loses inside itself. Drag the load down and watch it fall further.', cta: 'Show terminal p.d.' },
    ],
  },

  // 6 ────────────────────────────────────────────────────────────────────────
  // ammeter: 12 V, 5 Ω, meter 0.1 Ω → I = 12/5.1 = 2.3529 A (ideal 2.4 A).
  // voltmeter: 12 V, two 5 Ω; ideal V reads 6.000 V; with 20 Ω it reads 5.333 V.
  'meter-loading': {
    id: 'meter-loading',
    title: 'Meter Lab — the meter changes the circuit',
    summary:
      'A real ammeter has resistance and a real voltmeter draws current. Watch the reading move as you make each meter less ideal.',
    targets: 'meter_is_ideal',
    params: [
      sel('meter', 'Which meter', 'ammeter', ['ammeter', 'voltmeter']),
      yesno('ideal', 'Pretend the meter is ideal', false),
      num('ammeter_r', 'Ammeter resistance', 0.1, 0, 2, 0.05, 'Ω'),
      num('voltmeter_r', 'Voltmeter resistance', 20, 1, 500, 1, 'Ω'),
      num('r', 'Each resistor', 5, 1, 40, 1, 'Ω'),
      num('emf', 'Cell EMF', 12, 1, 24, 1, 'V'),
    ],
    probes: ['neg', 'pos'],
    build(p) {
      const emf = N(p, 'emf', 12);
      const r = N(p, 'r', 5);
      // "Ideal" is a real toggle, not a slider extreme: an ideal voltmeter is
      // INFINITE resistance, which no finite slider position can reach.
      const ideal = Y(p, 'ideal', false);
      if (S(p, 'meter', 'ammeter') === 'voltmeter') {
        return mkCircuit(
          [
            mkNode('neg', 0, 260, { ground: true }), mkNode('pos', 0, 0),
            mkNode('m', 300, 0), mkNode('br', 620, 0),
          ],
          [
            mkBattery('B1', 'neg', 'pos', emf),
            mkResistor('R1', 'pos', 'm', r),
            mkResistor('R2', 'm', 'br', r),
            mkVoltmeter('V1', 'm', 'br', {
              internal: ideal ? undefined : N(p, 'voltmeter_r', 20), x: 460, y: 170,
            }),
            mkWire('w1', 'br', 'neg', { x: 300, y: 260 }),
          ],
        );
      }
      return mkCircuit(
        [
          mkNode('neg', 0, 260, { ground: true }), mkNode('pos', 0, 0),
          mkNode('m', 440, 0), mkNode('br', 440, 260),
        ],
        [
          mkBattery('B1', 'neg', 'pos', emf),
          mkAmmeter('A1', 'pos', 'm', { internal: ideal ? 0 : N(p, 'ammeter_r', 0.1) }),
          mkResistor('R1', 'm', 'br', r),
          mkWire('w1', 'br', 'neg'),
        ],
      );
    },
    defaultSteps: [
      { say: 'A cell and a resistor. Work out the current you EXPECT here, before any meter is inserted.', cta: 'Show the expected current' },
      { say: 'Now insert the ammeter to measure it. An ammeter goes in series — it has to carry the current it is reporting.', cta: 'Insert the ammeter' },
      { say: 'Drag its resistance up from zero. Every ohm you add is an ohm in the loop, so the meter reads a current smaller than the one that was there before it arrived.', cta: 'Make the meter real' },
      { say: 'Switch to the voltmeter and the same story runs the other way: a voltmeter sits in parallel and steals current, dragging down the very p.d. it is measuring.', cta: 'Try the voltmeter' },
    ],
  },

  // 7 ────────────────────────────────────────────────────────────────────────
  // P/Q = 10/20 = R/S = 30/60 → BALANCED. I_G = 0 exactly, and R_eq between the
  // cell terminals = (10+20) ‖ (30+60) = 30 ‖ 90 = 22.5 Ω.
  'wheatstone-balanced': {
    id: 'wheatstone-balanced',
    title: 'Wheatstone bridge — balanced',
    summary:
      'When P/Q = R/S the galvanometer carries exactly zero current, whatever its resistance. Lift it out and the bridge falls apart into two ordinary series pairs.',
    targets: 'balanced_bridge_carries_current',
    params: [
      num('p', 'P (left top)', 10, 1, 100, 1, 'Ω'),
      num('q', 'Q (left bottom)', 20, 1, 100, 1, 'Ω'),
      num('rr', 'R (right top)', 30, 1, 100, 1, 'Ω'),
      num('s', 'S (right bottom)', 60, 1, 200, 1, 'Ω'),
      num('g', 'Galvanometer', 15, 0, 100, 1, 'Ω'),
      num('emf', 'Cell EMF', 12, 1, 24, 1, 'V'),
    ],
    probes: ['Rt', 'L'],
    build(p) { return bridge(p, 60); },
    defaultSteps: [
      { say: 'Four resistors in a diamond with a galvanometer across the middle. Predict: how much current crosses the galvanometer?', cta: 'Lock in my prediction' },
      { say: 'Look at the two potentials the galvanometer sits between, before you look at any current.', cta: 'Show node potentials' },
      { say: 'They are identical. Nothing pushes charge across it, so the current through it is exactly zero — not small, zero. That is the balance condition P/Q = R/S.', cta: 'Show the current' },
      { say: 'A branch carrying zero current can be lifted straight out. Watch the bridge become two series pairs in parallel.', cta: 'Remove it and reduce' },
    ],
  },

  // 8 ────────────────────────────────────────────────────────────────────────
  // S = 40 breaks the balance: 10/20 ≠ 30/40. NOT series-parallel — the redraw
  // must refuse. Nodal analysis still solves it: R_eq = 815/39 = 20.897435… Ω.
  'wheatstone-unbalanced': {
    id: 'wheatstone-unbalanced',
    title: 'Wheatstone bridge — unbalanced',
    summary:
      'Change one arm and the bridge stops being series-parallel altogether. The redraw refuses to finish and says why; Kirchhoff still solves it.',
    targets: 'series_parallel_by_appearance',
    params: [
      num('p', 'P (left top)', 10, 1, 100, 1, 'Ω'),
      num('q', 'Q (left bottom)', 20, 1, 100, 1, 'Ω'),
      num('rr', 'R (right top)', 30, 1, 100, 1, 'Ω'),
      num('s', 'S (right bottom)', 40, 1, 200, 1, 'Ω'),
      num('g', 'Galvanometer', 15, 1, 100, 1, 'Ω'),
      num('emf', 'Cell EMF', 12, 1, 24, 1, 'V'),
    ],
    probes: ['Rt', 'L'],
    build(p) { return bridge(p, 40); },
    defaultSteps: [
      { say: 'The same bridge with one arm changed. Try to find a series pair or a parallel pair anywhere in it — take your time.', cta: 'I have looked' },
      { say: 'There is none. Every junction has three elements on it, so no node is a plain series joint, and no two elements share both ends.', cta: 'Check every node' },
      { say: 'So the redraw stops and says so. A tool that guessed a number here would be teaching you to guess too.', cta: 'Run the redraw anyway' },
      { say: 'Kirchhoff has no such problem — it never needed the network to be series-parallel. Here is the answer from the junction and loop equations.', cta: 'Solve it properly' },
    ],
  },

  // 9 ────────────────────────────────────────────────────────────────────────
  // Driver 6 V across a 10 Ω wire → 0.6 A, so V(J)−V(WB) = 6(1−k). With a 2 V
  // secondary cell the null is at k = 2/3. At null the secondary delivers ZERO
  // current, so its internal resistance drops nothing and you read the true EMF.
  potentiometer: {
    id: 'potentiometer',
    title: 'Potentiometer — measuring without taking',
    summary:
      'Slide the jockey until the galvanometer reads zero. At that point the cell being measured supplies no current at all, so you read its true EMF — not its terminal p.d.',
    targets: 'meter_is_ideal',
    params: [
      num('driver_emf', 'Driver cell', 6, 2, 12, 0.5, 'V'),
      num('wire_r', 'Wire resistance', 10, 2, 40, 1, 'Ω'),
      num('jockey', 'Jockey position', 0.5, 0.02, 0.98, 0.01, ''),
      num('cell_emf', 'Cell under test', 2, 0.5, 6, 0.1, 'V'),
      num('cell_r', 'Its internal r', 0.5, 0, 5, 0.1, 'Ω'),
      num('galv_r', 'Galvanometer', 20, 1, 200, 1, 'Ω'),
    ],
    probes: ['WB', 'WA'],
    build(p) {
      const k = Math.max(0.02, Math.min(0.98, N(p, 'jockey', 0.5)));
      const rw = N(p, 'wire_r', 10);
      const jx = 200 + 400 * k;
      return mkCircuit(
        [
          mkNode('WA', 200, 0), mkNode('J', jx, 0),
          mkNode('WB', 600, 0, { ground: true }), mkNode('sm', 600, 300),
        ],
        [
          mkBattery('Bd', 'WB', 'WA', N(p, 'driver_emf', 6), { x: 400, y: -180 }),
          mkResistor('RW1', 'WA', 'J', k * rw),
          mkResistor('RW2', 'J', 'WB', (1 - k) * rw),
          mkBattery('Bs', 'WB', 'sm', N(p, 'cell_emf', 2), { internal: N(p, 'cell_r', 0.5) }),
          mkGalvanometer('G', 'sm', 'J', N(p, 'galv_r', 20), { x: jx, y: 150 }),
        ],
      );
    },
    defaultSteps: [
      { say: 'A driver cell pushes a steady current along a uniform wire, so the p.d. from the right-hand end grows evenly as you move left.', cta: 'Show the wire potentials' },
      { say: 'The cell we want to measure is connected between that right-hand end and the jockey, opposing the wire. Slide the jockey and watch the galvanometer.', cta: 'Let me slide the jockey' },
      { say: 'At the null point the galvanometer reads zero — so the cell under test is supplying no current. Nothing is being lost across its internal resistance.', cta: 'Find the null' },
      { say: 'That is why this beats a voltmeter: a voltmeter always draws something and always reads a bit low. A null method draws nothing and reads the true EMF.', cta: 'Compare with a voltmeter' },
    ],
  },

  // 10 ───────────────────────────────────────────────────────────────────────
  // A cube of 12 equal resistors. Across the BODY diagonal, R = 5r/6 (= 5 Ω for
  // r = 6). Across a FACE diagonal, 3r/4. Across one EDGE, 7r/12. All three come
  // from joining nodes that symmetry puts at the same potential.
  'symmetry-shortcut': {
    id: 'symmetry-shortcut',
    title: 'Cube of resistors — the symmetry shortcut',
    summary:
      'Twelve identical resistors on the edges of a cube. No series, no parallel anywhere — until you notice which corners must sit at the same potential.',
    targets: 'series_parallel_by_appearance',
    params: [
      num('r', 'Each edge', 6, 1, 30, 1, 'Ω'),
      sel('diagonal', 'Measure across', 'body', ['body', 'face', 'edge']),
    ],
    probes: ['A', 'B'],
    build(p) {
      const r = N(p, 'r', 6);
      // Corners are the eight bit-triples; an EDGE joins two corners differing
      // in exactly one bit. Which corner gets called "B" is the only thing the
      // `diagonal` param changes, so `probes` can stay the static ['A','B'] the
      // contract wants while the question moves between the three classic ones.
      const which = S(p, 'diagonal', 'body');
      const far = which === 'face' ? 0b110 : which === 'edge' ? 0b100 : 0b111;
      const name = (bits: number) => (bits === 0 ? 'A' : bits === far ? 'B' : `C${bits}`);
      // Isometric projection of the unit cube — x from bit0, y from bit1, and
      // bit2 pushed up and right to read as depth.
      const px = (b: number) => 220 * (b & 1) + 120 * ((b >> 2) & 1);
      const py = (b: number) => 220 * ((b >> 1) & 1) - 120 * ((b >> 2) & 1);

      const nodes = [];
      for (let b = 0; b < 8; b++) nodes.push(mkNode(name(b), px(b), py(b)));

      const comps = [];
      let n = 0;
      for (let b = 0; b < 8; b++) {
        for (const bit of [1, 2, 4]) {
          const other = b ^ bit;
          if (other < b) continue;                 // each edge once
          comps.push(mkResistor(`e${++n}`, name(b), name(other), r));
        }
      }
      return mkCircuit(nodes, comps);
    },
    defaultSteps: [
      { say: 'Twelve identical resistors on the edges of a cube, measured corner to opposite corner. Hunt for a series pair or a parallel pair — there is not one.', cta: 'I have looked' },
      { say: 'Every corner has exactly three edges on it, so no node is a plain series joint. Series and parallel alone will never finish this.', cta: 'Check every corner' },
      { say: 'Now look at the three corners next to the entry point. Nothing in the cube distinguishes them — same resistance to A, same resistance onward. They must be at the same potential.', cta: 'Colour by potential' },
      { say: 'Two points at the same potential can be joined by a wire, because no current would ever cross it. Join them and the cube collapses into three parallel groups in series.', cta: 'Join the equals' },
    ],
  },

  // 11 ───────────────────────────────────────────────────────────────────────
  // Ladder of series-r / shunt-r sections. For r = 1: 1 section → 2 Ω,
  // 2 → 5/3 = 1.667, 3 → 1.625, 4 → 1.6190…, converging on the golden ratio
  // (1 + √5)/2 = 1.6180…, which solves x = r + (r ‖ x).
  'infinite-ladder': {
    id: 'infinite-ladder',
    title: 'The ladder that never ends',
    summary:
      'Keep adding sections and the resistance does not run away — it converges. Four sections already agree with the infinite answer to three decimals.',
    targets: 'more_resistors_more_resistance',
    params: [
      num('r', 'Every resistor', 1, 0.5, 20, 0.5, 'Ω'),
      num('sections', 'Sections', 4, 1, 8, 1, ''),
    ],
    probes: ['A', 'Bot'],
    build(p) {
      const r = N(p, 'r', 1);
      const k = Math.max(1, Math.min(8, Math.round(N(p, 'sections', 4))));
      const nodes = [mkNode('A', 0, 0), mkNode('Bot', 0, 240, { ground: true })];
      const comps = [];
      let left = 'A';
      for (let i = 1; i <= k; i++) {
        const n = `n${i}`;
        nodes.push(mkNode(n, 170 * i, 0));
        comps.push(mkResistor(`Rs${i}`, left, n, r));
        comps.push(mkResistor(`Rp${i}`, n, 'Bot', r, { x: 170 * i, y: 120 }));
        left = n;
      }
      return mkCircuit(nodes, comps);
    },
    defaultSteps: [
      { say: 'One section: a resistor along the top, a resistor down to the bottom rail. Work out the resistance between the two probes.', cta: 'Reduce one section' },
      { say: 'Add a second section and predict before it solves: does the total go up a lot, up a little, or down?', cta: 'Lock in my prediction' },
      { say: 'Each new section hangs off the END, so it changes what the previous shunt is in parallel with. Reduce from the far end backwards — that is the only order that works.', cta: 'Add a section' },
      { say: 'Keep going. The answer settles instead of growing, because each new section is seen through everything before it. That limit is what "infinite ladder" means.', cta: 'Push it to eight' },
    ],
  },

  // 12 ───────────────────────────────────────────────────────────────────────
  // 12 V, three 6 Ω bulbs: L1 alone in series with L2 ‖ L3. R = 6 + 3 = 9 Ω,
  // I = 4/3 A through L1 (P = 10.67 W) and 2/3 A through each of L2, L3
  // (P = 2.67 W each). Swapping the ORDER changes nothing.
  'bulb-brightness': {
    id: 'bulb-brightness',
    title: 'Which bulb is brightest?',
    summary:
      'One bulb in series with two in parallel. Swap which group comes first and every reading stays exactly where it was — brightness is P = I²R, not position.',
    targets: 'brightness_by_position',
    params: [
      sel('mode', 'Order', 'single-first', ['single-first', 'pair-first']),
      num('bulb_r', 'Each bulb', 6, 1, 40, 1, 'Ω'),
      num('emf', 'Cell EMF', 12, 1, 24, 1, 'V'),
    ],
    probes: ['neg', 'pos'],
    build(p) {
      const rb = N(p, 'bulb_r', 6);
      const emf = N(p, 'emf', 12);
      const nodes = [
        mkNode('neg', 0, 280, { ground: true }), mkNode('pos', 0, 0),
        mkNode('m', 260, 0), mkNode('x', 580, 0),
      ];
      const wire = mkWire('w1', 'x', 'neg', { x: 290, y: 280 });
      if (S(p, 'mode', 'single-first') === 'pair-first') {
        return mkCircuit(nodes, [
          mkBattery('B1', 'neg', 'pos', emf),
          mkBulb('L2', 'pos', 'm', rb), mkBulb('L3', 'pos', 'm', rb),
          mkBulb('L1', 'm', 'x', rb),
          wire,
        ]);
      }
      return mkCircuit(nodes, [
        mkBattery('B1', 'neg', 'pos', emf),
        mkBulb('L1', 'pos', 'm', rb),
        mkBulb('L2', 'm', 'x', rb), mkBulb('L3', 'm', 'x', rb),
        wire,
      ]);
    },
    defaultSteps: [
      { say: 'Three identical bulbs: one on its own, then two side by side. Predict the order of brightness before anything is solved.', cta: 'Lock in my prediction' },
      { say: 'L1 has to carry everything that then splits between L2 and L3, so it carries twice what either of them does.', cta: 'Show the currents' },
      { say: 'Brightness is power, and power is I²R. Twice the current in the same resistance is four times the power.', cta: 'Show the power' },
      { say: 'Now swap the order so the pair comes first. Every reading follows its own bulb — nothing follows position on the page.', cta: 'Swap the order' },
    ],
  },

  // 13 ───────────────────────────────────────────────────────────────────────
  // 12 V, R1 = 4 Ω, R2 = 8 Ω with a switch across R2. Open: R = 12 Ω, I = 1 A,
  // 8 V across R2. Closed: R2 is shorted out, R = 4 Ω, I = 3 A, 0 V across R2.
  'short-circuit': {
    id: 'short-circuit',
    title: 'A wire across a resistor',
    summary:
      'Close the switch and R2 stops existing: both its ends become the same point, so it has no p.d. across it and carries nothing at all.',
    targets: 'short_circuit_ignored',
    params: [
      num('r1', 'R1', 4, 1, 40, 1, 'Ω'),
      num('r2', 'R2 (the one being shorted)', 8, 1, 40, 1, 'Ω'),
      yesno('closed', 'Switch closed', true),
      num('emf', 'Cell EMF', 12, 1, 24, 1, 'V'),
    ],
    probes: ['neg', 'pos'],
    build(p) {
      return mkCircuit(
        [
          mkNode('neg', 0, 280, { ground: true }), mkNode('pos', 0, 0),
          mkNode('m', 280, 0), mkNode('x', 580, 0),
        ],
        [
          mkBattery('B1', 'neg', 'pos', N(p, 'emf', 12)),
          mkResistor('R1', 'pos', 'm', N(p, 'r1', 4)),
          mkResistor('R2', 'm', 'x', N(p, 'r2', 8)),
          mkSwitch('S1', 'm', 'x', { open: !Y(p, 'closed', true) }),
          mkWire('w1', 'x', 'neg', { x: 290, y: 280 }),
        ],
      );
    },
    defaultSteps: [
      { say: 'A 4 Ω and an 8 Ω in series, with a switch wired straight across the 8 Ω. Open the switch first and note the current.', cta: 'Open the switch' },
      { say: 'Now predict: close the switch. Does the current go up, down, or stay the same — and what does the voltmeter across R2 do?', cta: 'Lock in my prediction' },
      { say: 'Closed, the switch is a wire between the two ends of R2. Those two ends are now one point, so the p.d. across R2 is zero.', cta: 'Close the switch' },
      { say: 'And zero p.d. across a resistor means zero current through it. Everything goes the easy way. The circuit behaves as if R2 were not there.', cta: 'Show where the current goes' },
    ],
  },

  // 14 ───────────────────────────────────────────────────────────────────────
  // 12 V, 6 Ω load, ideal leads → I = 2 A, 0 V across each lead, 12 V across R1.
  // Give the leads 1 Ω each and the same circuit gives I = 1.5 A, 1.5 V per lead
  // and only 9 V across the load — which is the honest version of the story.
  'wire-has-no-drop': {
    id: 'wire-has-no-drop',
    title: 'Is there a voltage across a wire?',
    summary:
      'Two voltmeters: one across the connecting lead, one across the resistor. The lead carries the full current and still reads zero — until you give it resistance.',
    targets: 'voltage_across_wire',
    params: [
      num('emf', 'Cell EMF', 12, 1, 24, 1, 'V'),
      num('r', 'The load', 6, 1, 40, 1, 'Ω'),
      num('lead_r', 'Resistance of each lead', 0, 0, 3, 0.1, 'Ω'),
    ],
    probes: ['neg', 'pos'],
    build(p) {
      const lead = N(p, 'lead_r', 0);
      return mkCircuit(
        [
          mkNode('neg', 0, 280, { ground: true }), mkNode('pos', 0, 0),
          mkNode('m', 280, 0), mkNode('x', 560, 0),
        ],
        [
          mkBattery('B1', 'neg', 'pos', N(p, 'emf', 12)),
          mkWire('W1', 'pos', 'm', { internal: lead }),
          mkResistor('R1', 'm', 'x', N(p, 'r', 6)),
          mkWire('W2', 'x', 'neg', { internal: lead, x: 280, y: 280 }),
          mkVoltmeter('V1', 'pos', 'm', { x: 140, y: -170 }),
          mkVoltmeter('V2', 'm', 'x', { x: 420, y: -170 }),
        ],
      );
    },
    defaultSteps: [
      { say: 'Predict both readings first: the voltmeter across the connecting lead, and the voltmeter across the resistor.', cta: 'Lock in my prediction' },
      { say: 'Here is the current. Note that the lead is carrying every bit of it — the same 2 A that goes through the resistor.', cta: 'Show the current' },
      { say: 'And here are the readings. Zero across the lead, everything across the resistor. V = I·R, and R = 0 kills it whatever I is.', cta: 'Show both voltmeters' },
      { say: 'Now give the leads a real resistance and watch the zero turn into something. "No p.d. across a wire" is a statement about R = 0, not about wires being magic.', cta: 'Make the leads real' },
    ],
  },
};

// ── Shared construction: the bridge (archetypes 7 and 8) ─────────────────────
//
// One shape, two arm sets. The cell is routed BELOW the diamond via its own
// `pos` so it does not cut through the galvanometer — the drawing every textbook
// uses, and the reason `pos` exists at all.
function bridge(p: Bag | undefined, sDefault: number): Circuit {
  return mkCircuit(
    [
      mkNode('L', 0, 160), mkNode('T', 240, 0),
      mkNode('Bt', 240, 320), mkNode('Rt', 480, 160, { ground: true }),
    ],
    [
      mkResistor('P', 'L', 'T', N(p, 'p', 10)),
      mkResistor('Q', 'T', 'Rt', N(p, 'q', 20)),
      mkResistor('R', 'L', 'Bt', N(p, 'rr', 30)),
      mkResistor('S', 'Bt', 'Rt', N(p, 's', sDefault)),
      mkGalvanometer('G', 'T', 'Bt', N(p, 'g', 15)),
      mkBattery('B1', 'Rt', 'L', N(p, 'emf', 12), { x: 240, y: 500 }),
    ],
  );
}

// ── Predict-first gates ──────────────────────────────────────────────────────
//
// Design law #2 says a wrong answer must map to a NAMED misconception and the
// feedback must attack that misconception. These are the questions that force a
// commitment BEFORE any number is on screen; when the answer is wrong the bench
// shows the archetype's own `targets` entry from `lib/misconceptions.ts`. That
// is the wiring which makes `targets` a delivery rather than a declaration.
//
// A prediction is never a gate on progress — the student can always look. It is
// a gate on being TOLD, which is the only thing that makes being wrong useful.

export interface CircuitPredict {
  prompt: string;
  options: string[];
  answer_index: number;
  reveal: string;
}

export const CIRCUIT_PREDICTS: Record<string, CircuitPredict> = {
  'series-vs-parallel': {
    prompt: 'Wired in parallel instead of in series, does the total resistance of the SAME two resistors go up, go down, or stay put?',
    options: ['Up — there are still two resistors', 'Down — below the smaller one', 'The same — nothing was added or removed'],
    answer_index: 1,
    reveal: 'Down, and below the smaller of the two. A second path lets more current through for the same p.d., and more current for the same voltage IS less resistance.',
  },
  'ugly-redraw': {
    prompt: 'Look only at the drawing. Are R1 and R2 in series, in parallel, or neither?',
    options: ['In series', 'In parallel', 'Neither — they are not connected'],
    answer_index: 1,
    reveal: 'In parallel. The two wires are not components — follow them and both resistors turn out to start at the same point and end at the same point.',
  },
  'current-not-used-up': {
    prompt: 'Two identical bulbs, one after the other. Which is brighter?',
    options: ['The first one — it gets the current fresh', 'The second one', 'Exactly the same'],
    answer_index: 2,
    reveal: 'Exactly the same. The current through both is one number, and both have the same resistance, so P = I²R is identical.',
  },
  'adding-parallel-lowers-R': {
    prompt: 'Add a second identical resistor in parallel with the first. What happens to the total resistance?',
    options: ['Doubles', 'Halves', 'Stays the same'],
    answer_index: 1,
    reveal: 'It halves. Each branch still has the full cell voltage across it, so each carries what the single one did — twice the current out of the cell means half the resistance.',
  },
  'internal-resistance': {
    prompt: 'A 12 V cell with r = 1 Ω drives a 5 Ω resistor. What current flows?',
    options: ['2.4 A — that is 12 ÷ 5', '2 A', '12 A'],
    answer_index: 1,
    reveal: '2 A. The current has to pass through the cell as well as the resistor, so it is 12 ÷ (5 + 1). The terminal p.d. is then only 10 V.',
  },
  'meter-loading': {
    prompt: 'You insert a real ammeter to measure a current. What does it read?',
    options: ['Exactly the current that was flowing', 'A little less than it was', 'A little more than it was'],
    answer_index: 1,
    reveal: 'A little less. The meter adds its own resistance to the loop, so the number it reports is the current AFTER it arrived — never the one before.',
  },
  'wheatstone-balanced': {
    prompt: 'P/Q = R/S. How much current crosses the galvanometer?',
    options: ['A small current', 'Exactly zero', 'It depends on the galvanometer'],
    answer_index: 1,
    reveal: 'Exactly zero, and it does not depend on the galvanometer at all — its two ends are at the same potential, so nothing pushes charge across it whatever its resistance.',
  },
  'wheatstone-unbalanced': {
    prompt: 'One arm has changed and the bridge is no longer balanced. Can you still reduce it by series and parallel?',
    options: ['Yes — every network reduces eventually', 'No — a bridge is not series-parallel', 'Only if the galvanometer is ideal'],
    answer_index: 1,
    reveal: 'No. Every junction carries three elements, so nothing is in series, and no two elements share both ends. Kirchhoff still solves it — series and parallel do not.',
  },
  potentiometer: {
    prompt: 'At the null point the galvanometer reads zero. What is the potentiometer measuring?',
    options: ['The terminal p.d. of the cell', 'The true EMF of the cell', 'Neither — it needs a voltmeter'],
    answer_index: 1,
    reveal: 'The true EMF. At balance the cell delivers no current at all, so nothing is lost across its internal resistance — which no voltmeter can ever manage.',
  },
  'symmetry-shortcut': {
    prompt: 'Twelve equal resistors on a cube, measured across the body diagonal. Where do you start?',
    options: ['Find a series pair', 'Find a parallel pair', 'Find corners that must be at the same potential'],
    answer_index: 2,
    reveal: 'Symmetry first. There is no series pair and no parallel pair anywhere in a cube — but the three corners next to each probe are indistinguishable, so they must sit at the same potential, and equal potentials can be joined.',
  },
  'infinite-ladder': {
    prompt: 'Keep adding sections to the ladder for ever. What happens to the resistance between the probes?',
    options: ['It grows without limit', 'It settles on a fixed value', 'It falls to zero'],
    answer_index: 1,
    reveal: 'It settles. Each new section is seen through everything in front of it, so its effect shrinks — the total converges on the value that solves x = r + (r ∥ x).',
  },
  'bulb-brightness': {
    prompt: 'One bulb, then two identical bulbs side by side. Which is brightest?',
    options: ['The one nearest the + terminal', 'The single one, wherever it is drawn', 'All three are equal'],
    answer_index: 1,
    reveal: 'The single one — because it carries the whole current while the other two share it. Move it to the far side of the circuit and it stays the brightest.',
  },
  'short-circuit': {
    prompt: 'Close a switch wired straight across R2. What happens to the current through R2?',
    options: ['It goes up', 'It stays the same', 'It drops to zero'],
    answer_index: 2,
    reveal: 'Zero. Both ends of R2 become the same point, so there is no p.d. across it — and no p.d. across a resistor means no current through it.',
  },
  'wire-has-no-drop': {
    prompt: 'A voltmeter across an ideal connecting lead that is carrying 2 A. What does it read?',
    options: ['2 V', 'Something small but not zero', 'Exactly zero'],
    answer_index: 2,
    reveal: 'Exactly zero. V = I·R, and an ideal lead has R = 0, so no current can produce a p.d. across it. Give the lead real resistance and the zero turns into a real number.',
  },
};

// ── Catalog (what the admin picker needs — metadata only) ────────────────────

export interface CircuitArchetypeSummary {
  id: string;
  title: string;
  summary: string;
  params: NonNullable<CircuitArchetype['params']>;
  targets?: CircuitArchetype['targets'];
  stepCount: number;
}

/** Stable display order — the teaching order, not alphabetical. */
export const CIRCUIT_ARCHETYPE_ORDER: string[] = [
  'series-vs-parallel',
  'ugly-redraw',
  'current-not-used-up',
  'adding-parallel-lowers-R',
  'short-circuit',
  'wire-has-no-drop',
  'internal-resistance',
  'bulb-brightness',
  'meter-loading',
  'wheatstone-balanced',
  'wheatstone-unbalanced',
  'potentiometer',
  'symmetry-shortcut',
  'infinite-ladder',
];

export const CIRCUIT_ARCHETYPE_CATALOG: CircuitArchetypeSummary[] =
  CIRCUIT_ARCHETYPE_ORDER.map((id) => CIRCUIT_ARCHETYPES[id]).map((a) => ({
    id: a.id,
    title: a.title,
    summary: a.summary,
    params: a.params ?? [],
    targets: a.targets,
    stepCount: a.defaultSteps?.length ?? 0,
  }));

/** Lookup. Undefined for an unknown id — the caller decides whether that is an
 *  authoring mistake or just an unset field. */
export function getCircuitArchetype(id?: string): CircuitArchetype | undefined {
  return id ? CIRCUIT_ARCHETYPES[id] : undefined;
}
