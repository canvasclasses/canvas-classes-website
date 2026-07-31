/*
 * circuit-bench/ac/lib/setup.ts — params bag → typed AC inputs + a netlist. PURE.
 * ─────────────────────────────────────────────────────────────────────────────
 * No React, no DOM. Node-verifiable.
 *
 * ── ONE READER OF THE PARAMS BAG ────────────────────────────────────────────
 * `CircuitArchetype.build()` returns a `Circuit` — a netlist, i.e. a DRAWING.
 * The AC physics needs an `AcCircuit`, an `LRSpec`, an `LCRSpec`, a transformer
 * and a transmission line, none of which a netlist can hold.
 *
 * The shortcut to avoid is `build()` reading `params` for the drawing and the
 * component reading `params` again for the numbers. That is how a canvas ends up
 * labelled 0.2 H while the readout is computed from 0.25 H. So `acSetup` is the
 * single reader: `build()` derives the netlist from it and `AcBench` derives every
 * readout from it. A picture that disagrees with its own numbers is not a bug
 * that can be introduced here.
 *
 * ── THE NETLIST IS REAL, NOT DECORATIVE ─────────────────────────────────────
 * `ComponentKind` already has `inductor` and `capacitor`, so the circuits built
 * below are genuine E3 netlists and the frozen `CircuitCanvas` can draw them
 * unchanged. What the E3 SOLVER would make of them is the DC steady state (an
 * inductor is a wire, a capacitor a gap) — correct for what it models and not
 * what this bench is about, which is why `AcBench` computes from
 * `phasor.ts`/`transient.ts` and never calls `solveCircuit`. The netlist is the
 * drawing and the topology; it is not the answer.
 *
 * ── WHY THESE DEFAULTS ──────────────────────────────────────────────────────
 * Chosen so the arithmetic a student checks by hand comes out clean:
 *
 *   LR         ε 12 V, R 4 Ω, L 2 H     → τ = 0.5 s exactly, I_final = 3 A,
 *                                          and 1.8964 A at t = τ
 *   LC         L 0.5 H, C 200 µF        → LC = 1e-4, so ω₀ = 100 rad/s EXACTLY
 *              q₀ = 2 mC (10 V)         → U = q₀²/2C = 10 mJ, I_peak = q₀ω₀ = 200 mA
 *   LCR        the same L and C          → R_critical = 2√(L/C) = 100 Ω exactly,
 *                                          so 20 Ω / 100 Ω / 200 Ω are the three regimes
 *   series LCR R 30 Ω, L 0.2 H, C 50 µF → f₀ = 50.33 Hz, near mains, and at
 *                                          120 Hz the circuit is firmly inductive
 *   transformer 500 : 5000 turns, 230 V → 2300 V, 4600 Ω load gives 0.5 A and
 *                                          1150 W, so I_p is exactly 5 A
 *   transmission 100 kW down 10 Ω        → at 1 kV the loss is 100 kW (all of it);
 *                                          at 10 kV it is 1 kW; at 100 kV, 10 W
 */

import type { Circuit } from '../../types';
import { mkBattery, mkCircuit, mkNode, mkResistor } from '../../lib/netlist';
import type { AcCircuit } from './phasor';
import type { LCRSpec, LCSpec, LRSpec } from './transient';
import type { TransformerSpec } from './transformer';

export type AcView = 'phasor' | 'sweep' | 'transient' | 'transformer' | 'transmission';
/** Which elements the series loop contains. Four of these are the AC bench's
 *  first four rungs, and they are one code path. */
export type AcElements = 'R' | 'L' | 'C' | 'RL' | 'RC' | 'LCR';
export type TransientKind = 'lr-growth' | 'lr-decay' | 'lc' | 'lcr';

type Bag = Record<string, number | string | boolean> | undefined;

const N = (p: Bag, k: string, d: number): number => {
  const v = p?.[k];
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const f = parseFloat(v);
    if (Number.isFinite(f)) return f;
  }
  return d;
};
const S = (p: Bag, k: string, d: string): string => {
  const v = p?.[k];
  return typeof v === 'string' && v.length ? v : d;
};

const ELEMENT_SETS: AcElements[] = ['R', 'L', 'C', 'RL', 'RC', 'LCR'];
const TRANSIENTS: TransientKind[] = ['lr-growth', 'lr-decay', 'lc', 'lcr'];

export interface AcSetup {
  view: AcView;
  elements: AcElements;
  transient: TransientKind;
  /** The series loop the phasor bench and the sweep are about. */
  circuit: AcCircuit;
  lr: LRSpec;
  lc: LCSpec;
  lcr: LCRSpec;
  transformer: TransformerSpec;
  transmission: { demand: number; voltage: number; resistance: number };
  sweep: { fMin: number; fMax: number };
  /** s — how much time the transient plot covers. */
  tMax: number;
}

/** Whether each element is present, from the `elements` selector. */
export function presentIn(e: AcElements): { R: boolean; L: boolean; C: boolean } {
  return {
    R: e === 'R' || e === 'RL' || e === 'RC' || e === 'LCR',
    L: e === 'L' || e === 'RL' || e === 'LCR',
    C: e === 'C' || e === 'RC' || e === 'LCR',
  };
}

/**
 * Read every AC number out of one bag.
 *
 * ⚠ AN ABSENT ELEMENT IS ZERO, NOT INFINITE. `AcCircuit.C = 0` means "there is
 * no capacitor in this loop", which is a plain short in the phasor arithmetic.
 * That is the opposite of `C` present at f = 0, where X_C is infinite and the
 * loop is broken. Conflating the two is how a pure-inductor rung silently
 * reports zero current, so `presentIn` decides membership and the frequency
 * decides reactance, and neither is allowed to stand in for the other.
 */
export function acSetup(view: AcView, p?: Bag): AcSetup {
  const raw = S(p, 'elements', view === 'phasor' ? 'R' : 'LCR');
  const elements: AcElements = (ELEMENT_SETS as string[]).includes(raw)
    ? (raw as AcElements) : 'LCR';
  const has = presentIn(elements);

  const rawT = S(p, 'transient', 'lr-growth');
  const transient: TransientKind = (TRANSIENTS as string[]).includes(rawT)
    ? (rawT as TransientKind) : 'lr-growth';

  const R = Math.max(0, N(p, 'R', 30));
  const L = Math.max(0, N(p, 'L', 0.2));
  const C = Math.max(0, N(p, 'C', 50e-6));

  const lrR = Math.max(0.01, N(p, 'lr_R', 4));
  const lrL = Math.max(1e-6, N(p, 'lr_L', 2));

  const lcL = Math.max(1e-6, N(p, 'lc_L', 0.5));
  const lcC = Math.max(1e-9, N(p, 'lc_C', 200e-6));
  const q0 = lcC * N(p, 'lc_V', 10);

  return {
    view,
    elements,
    transient,
    circuit: {
      R: has.R ? R : 0,
      L: has.L ? L : 0,
      C: has.C ? C : 0,
      V0: N(p, 'V0', 100),
      f: Math.max(0, N(p, 'f', view === 'phasor' && elements === 'LCR' ? 120 : 50)),
    },
    lr: { emf: N(p, 'lr_emf', 12), R: lrR, L: lrL },
    lc: { L: lcL, C: lcC, q0 },
    lcr: { L: lcL, C: lcC, q0, R: Math.max(0, N(p, 'lcr_R', 20)) },
    transformer: {
      Np: Math.max(1, Math.round(N(p, 'Np', 500))),
      Ns: Math.max(1, Math.round(N(p, 'Ns', 5000))),
      Vp: N(p, 'Vp', 230),
      load: Math.max(0.1, N(p, 'load', 4600)),
      efficiency: Math.min(1, Math.max(0.5, N(p, 'eta', 1))),
    },
    transmission: {
      demand: Math.max(1, N(p, 'demand', 100000)),
      voltage: Math.max(1, N(p, 'line_V', 1000)),
      resistance: Math.max(0.01, N(p, 'line_R', 10)),
    },
    sweep: {
      fMin: Math.max(0.1, N(p, 'f_min', 5)),
      fMax: Math.max(1, N(p, 'f_max', 500)),
    },
    tMax: Math.max(1e-4, N(p, 't_max', transient === 'lr-growth' || transient === 'lr-decay' ? 3 : 0.25)),
  };
}

// ── The netlist, derived from the setup ──────────────────────────────────────

/**
 * The series loop as a real E3 `Circuit`.
 *
 * Node ids are the four corners a student would label: `s−` and `s+` are the
 * source terminals and `m1`/`m2` the junctions between elements, so the drawing
 * reads left to right in the order the phasor triangle is built (R, then L,
 * then C). Positions are drawing only — nothing reads them.
 */
export function buildAcCircuit(s: AcSetup): Circuit {
  const has = presentIn(s.elements);
  const nodes = [
    mkNode('s-', 0, 220, { ground: true, label: 'source −' }),
    mkNode('s+', 0, 0, { label: 'source +' }),
  ];
  const comps = [mkBattery('AC', 's-', 's+', s.circuit.V0, { label: 'AC supply' })];

  const chain: { kind: 'resistor' | 'inductor' | 'capacitor'; id: string; value: number }[] = [];
  if (has.R) chain.push({ kind: 'resistor', id: 'R', value: s.circuit.R });
  if (has.L) chain.push({ kind: 'inductor', id: 'L', value: s.circuit.L });
  if (has.C) chain.push({ kind: 'capacitor', id: 'C', value: s.circuit.C });

  let prev = 's+';
  chain.forEach((el, i) => {
    const last = i === chain.length - 1;
    const next = last ? 's-' : `m${i + 1}`;
    if (!last) nodes.push(mkNode(next, 180 * (i + 1), 0));
    comps.push({
      id: el.id, kind: el.kind, a: prev, b: next, value: el.value, label: el.id,
      pos: last ? { x: 180 * (i + 1), y: 220 } : undefined,
    });
    prev = next;
  });

  // A loop with no elements at all cannot be drawn as a loop; close it with a
  // wire-equivalent 0 Ω resistor and say nothing clever about it.
  if (!chain.length) comps.push(mkResistor('R0', 's+', 's-', 0, { x: 180, y: 220 }));

  return mkCircuit(nodes, comps);
}

/** The transient circuit: a cell, a resistor and whichever storage element the
 *  transient kind is about. */
export function buildTransientCircuit(s: AcSetup): Circuit {
  const nodes = [
    mkNode('n-', 0, 220, { ground: true }),
    mkNode('n+', 0, 0),
    mkNode('mid', 200, 0),
  ];
  if (s.transient === 'lr-growth' || s.transient === 'lr-decay') {
    return mkCircuit(nodes, [
      mkBattery('E', 'n-', 'n+', s.lr.emf, { label: 'cell' }),
      mkResistor('R', 'n+', 'mid', s.lr.R),
      { id: 'L', kind: 'inductor', a: 'mid', b: 'n-', value: s.lr.L, label: 'L', pos: { x: 200, y: 220 } },
    ]);
  }
  return mkCircuit(nodes, [
    { id: 'C', kind: 'capacitor', a: 'n-', b: 'n+', value: s.lcr.C, label: 'C' },
    mkResistor('R', 'n+', 'mid', s.transient === 'lcr' ? s.lcr.R : 0),
    { id: 'L', kind: 'inductor', a: 'mid', b: 'n-', value: s.lcr.L, label: 'L', pos: { x: 200, y: 220 } },
  ]);
}

/** Primary loop, secondary loop, and no conducting path between them — which is
 *  the whole point and is visible in the netlist as two disjoint islands. The E3
 *  solver would warn about exactly that, correctly. */
export function buildTransformerCircuit(s: AcSetup): Circuit {
  return mkCircuit(
    [
      mkNode('p-', 0, 220, { ground: true, label: 'primary −' }),
      mkNode('p+', 0, 0, { label: 'primary +' }),
      mkNode('s-', 420, 220, { label: 'secondary −' }),
      mkNode('s+', 420, 0, { label: 'secondary +' }),
    ],
    [
      mkBattery('Vp', 'p-', 'p+', s.transformer.Vp, { label: 'AC supply' }),
      { id: 'Lp', kind: 'inductor', a: 'p+', b: 'p-', value: 1, label: 'primary winding', pos: { x: 170, y: 110 } },
      { id: 'Ls', kind: 'inductor', a: 's+', b: 's-', value: 1, label: 'secondary winding', pos: { x: 250, y: 110 } },
      mkResistor('RL', 's+', 's-', s.transformer.load, { label: 'load', x: 420, y: 110 }),
    ],
  );
}

/** The grid: a station, two line resistances (out and back) and the town. */
export function buildTransmissionCircuit(s: AcSetup): Circuit {
  return mkCircuit(
    [
      mkNode('g', 0, 220, { ground: true, label: 'station −' }),
      mkNode('a', 0, 0, { label: 'station +' }),
      mkNode('b', 300, 0, { label: 'town +' }),
    ],
    [
      mkBattery('P', 'g', 'a', s.transmission.voltage, { label: 'power station' }),
      mkResistor('Rline', 'a', 'b', s.transmission.resistance, { label: 'the cables' }),
      mkResistor('Town', 'b', 'g', Math.max(0.01,
        (s.transmission.voltage * s.transmission.voltage) / s.transmission.demand),
      { label: 'the town', x: 300, y: 220 }),
    ],
  );
}
