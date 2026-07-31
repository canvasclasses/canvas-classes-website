/*
 * circuit-bench/lib/solve.ts — Modified Nodal Analysis for the E3 engine.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM. Reuses `SystemBuilder` / `solveLinear` from the E1
 * engine (`../../mechanics-bench/lib/linalg`) — there is ONE dense linear solver
 * in this program and this is not a second one.
 *
 * ── WHY MNA AND NOT PLAIN NODAL ─────────────────────────────────────────────
 * Plain nodal analysis builds a conductance matrix G·v = i, which needs every
 * branch to HAVE a conductance. An ideal wire and an ideal cell do not: they
 * impose an equality between two potentials. The usual dodges — give the wire
 * 1e-9 Ω, or hand-roll a supernode pass — either wreck the conditioning (a
 * 1e9-magnitude entry beside a 0.5 makes the pivot search meaningless and the
 * answer arrives as 1e12 A) or need special cases for every topology a student
 * can wire.
 *
 * So this is MODIFIED nodal analysis. Unknowns are:
 *
 *      v:<node>        one potential per node
 *      i:<component>   one current per ZERO-resistance branch
 *                      (ideal wire, ideal cell, closed ideal switch, ideal
 *                       ammeter, inductor in the DC steady state)
 *
 * and equations are:
 *
 *      KCL at every node except the reference
 *      v:<ground> = 0
 *      V(a) − V(b) = −EMF          for each zero-resistance branch
 *
 * which is square, exact for R = 0, and needs no supernode bookkeeping. A cell
 * WITH internal resistance is stamped the ordinary way (conductance 1/r plus a
 * current source g·E), because it genuinely has a conductance.
 *
 * `singular` is reported honestly with a reason. No number is ever invented.
 */

import type { Circuit, CircuitComponent, CircuitSolution } from '../types';
import { SystemBuilder, type LinearSolution } from '../../mechanics-bench/lib/linalg';
import {
  OPEN, activeComponents, cloneCircuit, connectedIslands, emfOf, isOpen,
  isVoltageBranch, labelOf, normalizeCircuit, resistanceOf, shortedTogether,
} from './netlist';

const V = (node: string) => `v:${node}`;
const I = (comp: string) => `i:${comp}`;

export interface SolveOptions {
  /** Override the reference node. Defaults to the circuit's marked ground. */
  ground?: string;
  /** Measure R between these two nodes as well as solving the circuit. */
  probes?: [string, string];
}

/**
 * Solve a DC circuit.
 *
 * Everything a student reads is derived from ONE solve — the potentials — so a
 * current and the p.d. beside it can never disagree.
 */
export function solveCircuit(input: Circuit, opts: SolveOptions = {}): CircuitSolution {
  const norm = normalizeCircuit(input);
  const circuit = norm.circuit;
  const warnings = [...norm.warnings];
  const ground = opts.ground ?? norm.ground;

  const empty: CircuitSolution = {
    potentials: {}, currents: {}, voltages: {}, power: {},
    singular: true, warnings,
  };

  if (!ground) {
    warnings.push('The circuit has no nodes, so there is nothing to solve.');
    return empty;
  }

  const active = activeComponents(circuit);
  if (!active.length) {
    warnings.push('Every element is open or removed — no current can flow anywhere.');
  }

  // DC steady-state notes. Said once, plainly, because both are real exam traps.
  if (circuit.components.some((c) => c.kind === 'capacitor')) {
    warnings.push('In the steady state a capacitor carries no current — it is treated as a gap, and the p.d. across it is still reported.');
  }
  if (circuit.components.some((c) => c.kind === 'inductor')) {
    warnings.push('In the steady state an ideal inductor is just a wire — no p.d. across it.');
  }

  const builder = new SystemBuilder();

  // Register every node potential up front so column order is stable and a node
  // that only appears in a branch equation still gets a column.
  for (const n of circuit.nodes) builder.unknown(V(n.id));

  // ── KCL rows: Σ (current leaving the node) = 0 ─────────────────────────────
  // Islands that do not contain the reference node have no absolute potential.
  // Pin each one to 0 at its own first node and SAY SO — inventing a potential
  // silently is how a student ends up trusting a number that means nothing.
  const islands = connectedIslands(circuit);
  const groundIsland = islands.find((s) => s.has(ground));
  const pinned = new Set<string>([ground]);
  for (const island of islands) {
    if (island === groundIsland) continue;
    const anchor = [...island].sort()[0];
    pinned.add(anchor);
    warnings.push(
      `Nodes ${[...island].sort().join(', ')} are not connected to the rest of the circuit. `
      + `Their potentials are shown relative to "${anchor}", not to ground.`,
    );
  }

  for (const n of circuit.nodes) {
    if (pinned.has(n.id)) continue;
    const coeffs: Record<string, number> = {};
    let rhs = 0;
    let touched = 0;

    for (const c of active) {
      const atA = c.a === n.id;
      const atB = c.b === n.id;
      if (!atA && !atB) continue;
      if (atA && atB) continue;                  // self-loop: leaves and returns
      touched++;
      const sign = atA ? 1 : -1;                 // current a→b LEAVES a, ENTERS b
      if (isVoltageBranch(c)) {
        coeffs[I(c.id)] = (coeffs[I(c.id)] ?? 0) + sign;
        builder.unknown(I(c.id));
      } else {
        const g = 1 / resistanceOf(c);
        coeffs[V(c.a)] = (coeffs[V(c.a)] ?? 0) + sign * g;
        coeffs[V(c.b)] = (coeffs[V(c.b)] ?? 0) - sign * g;
        // A source with internal resistance is a conductance plus a current
        // source of g·EMF pushing from a to b.
        rhs -= sign * g * emfOf(c);
      }
    }

    if (!touched) {
      // An isolated node inside a pinned island can't happen (it would BE its
      // own island), but a node whose only element is a self-loop can.
      builder.equation({ [V(n.id)]: 1 }, 0, `isolated ${n.id}`);
      warnings.push(`Node "${n.id}" has nothing attached that can carry current away — shown at 0 V.`);
      continue;
    }
    builder.equation(coeffs, rhs, `KCL ${n.id}`);
  }

  // ── Reference rows ────────────────────────────────────────────────────────
  for (const p of pinned) builder.equation({ [V(p)]: 1 }, 0, `reference ${p}`);

  // ── Branch rows for the zero-resistance elements ──────────────────────────
  for (const c of active) {
    if (!isVoltageBranch(c)) continue;
    builder.unknown(I(c.id));
    if (c.a === c.b) {
      // A zero-ohm self-loop is a closed ring of wire with nothing driving it.
      builder.equation({ [I(c.id)]: 1 }, 0, `self-loop ${c.id}`);
      continue;
    }
    // V(a) − V(b) = −EMF  (b is the + terminal, so it sits EMF volts above a).
    builder.equation({ [V(c.a)]: 1, [V(c.b)]: -1 }, -emfOf(c), `branch ${c.id}`);
  }

  const lin: LinearSolution = builder.solve();
  if (lin.singular) {
    return {
      ...empty,
      warnings: [...warnings, explainSingular(circuit, lin.reason)],
    };
  }

  // ── Read the answers back out ─────────────────────────────────────────────
  const potentials: Record<string, number> = {};
  for (const n of circuit.nodes) potentials[n.id] = lin.values[V(n.id)] ?? 0;

  const currents: Record<string, number> = {};
  const voltages: Record<string, number> = {};
  const power: Record<string, number> = {};

  for (const c of circuit.components) {
    const vab = (potentials[c.a] ?? 0) - (potentials[c.b] ?? 0);
    voltages[c.id] = vab;
    let i = 0;
    if (isOpen(c)) {
      i = 0;                                   // an open branch carries nothing
    } else if (isVoltageBranch(c)) {
      i = lin.values[I(c.id)] ?? 0;
    } else {
      i = (vab + emfOf(c)) / resistanceOf(c);
    }
    currents[c.id] = i;
    power[c.id] = vab * i;
  }

  const solution: CircuitSolution = {
    potentials, currents, voltages, power, singular: false, warnings,
  };

  if (opts.probes) {
    const r = equivalentResistance(circuit, opts.probes[0], opts.probes[1]);
    if (!r.singular) solution.rEquivalent = r.value;
    else solution.warnings.push(r.reason ?? 'R between the probes could not be found.');
  }

  return solution;
}

/** Why the matrix failed, in words an author can act on. */
function explainSingular(circuit: Circuit, reason?: string): string {
  // The commonest real cause by far: two ideal sources of different EMF wired
  // directly across the same pair of nodes, which is a contradiction, not a
  // hard problem.
  const byPair = new Map<string, { emf: number; id: string }[]>();
  for (const c of activeComponents(circuit)) {
    if (!isVoltageBranch(c) || c.a === c.b) continue;
    const key = c.a < c.b ? `${c.a}|${c.b}` : `${c.b}|${c.a}`;
    const flip = c.a < c.b ? 1 : -1;
    const list = byPair.get(key) ?? [];
    list.push({ emf: flip * emfOf(c), id: labelOf(c) });
    byPair.set(key, list);
  }
  for (const [, list] of byPair) {
    if (list.length < 2) continue;
    const spread = Math.max(...list.map((x) => x.emf)) - Math.min(...list.map((x) => x.emf));
    if (spread > 1e-9) {
      return `${list.map((x) => x.id).join(' and ')} are wired across the same two points but `
        + 'demand different potential differences. That circuit cannot exist — one of them has to go, '
        + 'or one needs some resistance in series with it.';
    }
  }
  return reason
    ? `This circuit has no unique solution. ${reason}`
    : 'This circuit has no unique solution — check for a loop of ideal wires and cells with nothing to limit the current.';
}

// ── Equivalent resistance ────────────────────────────────────────────────────

export interface REqResult {
  value: number;
  singular: boolean;
  reason?: string;
}

/**
 * The 1 V test measurement. Assumes `passive` has NO sources left in it —
 * callers get it there via `killSources` or `prepareForResistance`.
 *
 * Putting a source across the probes and reading its current (rather than
 * inverting a conductance matrix by hand) means this inherits the MNA's
 * exactness for zero-ohm paths, so a shorted branch gives 0 Ω and not 1e-9.
 */
function measurePassive(passive: Circuit, a: string, b: string): REqResult {
  const ids = new Set(passive.nodes.map((n) => n.id));
  if (!ids.has(a) || !ids.has(b)) {
    return { value: NaN, singular: true, reason: `Probe node "${ids.has(a) ? b : a}" is not in this circuit.` };
  }
  if (a === b) return { value: 0, singular: false };

  // A path of pure wire between the probes IS zero ohms. Asked as a matrix
  // question it looks like a contradiction (two ideal sources across one pair),
  // so answer it structurally instead of letting the solver report singular.
  if (shortedTogether(passive, a, b)) return { value: 0, singular: false };

  const probe = {
    id: '__probe__', kind: 'battery' as const, a, b, value: 1, label: 'test source',
  };
  const test: Circuit = {
    nodes: passive.nodes.map((n) => ({ ...n, ground: n.id === a })),
    components: [...passive.components, probe],
  };

  const sol = solveCircuit(test, { ground: a });
  if (sol.singular) {
    return {
      value: NaN, singular: true,
      reason: sol.warnings[sol.warnings.length - 1]
        ?? 'The resistance between those two points is not defined for this circuit.',
    };
  }

  const i = sol.currents['__probe__'] ?? 0;
  if (Math.abs(i) < 1e-12) {
    return {
      value: Number.POSITIVE_INFINITY, singular: false,
      reason: `Nothing conducts between ${a} and ${b} — the resistance is infinite (an open circuit).`,
    };
  }
  return { value: 1 / i, singular: false };
}

/**
 * Resistance looked into nodes `a` and `b` with every independent source killed
 * — the textbook definition. An ideal cell becomes a wire; a real one becomes
 * its own internal resistance.
 */
export function equivalentResistance(input: Circuit, a: string, b: string): REqResult {
  return measurePassive(killSources(input), a, b);
}

/**
 * Replace every independent source by its own internal resistance — a wire when
 * it is ideal.
 */
export function killSources(input: Circuit): Circuit {
  const c = cloneCircuit(input);
  c.components = c.components.map((comp) => {
    if (comp.kind !== 'battery') return comp;
    const r = resistanceOf(comp);
    if (r === OPEN) return comp;
    if (r <= 0) {
      return { ...comp, kind: 'wire' as const, value: 0, internal: 0,
        label: `${labelOf(comp)} (ideal cell — no resistance)` };
    }
    return { ...comp, kind: 'resistor' as const, value: r, internal: undefined,
      label: `r of ${labelOf(comp)}` };
  });
  return c;
}

// ── The network a resistance question is really about ────────────────────────

export interface PreparedNetwork {
  /** Purely resistive — every source and every open element already dealt with. */
  circuit: Circuit;
  probes: [string, string];
  /** Set when the probes were a cell's own terminals and it was CUT open. */
  cutSource?: { id: string; label: string; emf: number; internal: number; gapNode: string };
  /** Elements dropped before the reduction even starts, with the reason. The
   *  whole component is kept so the redraw can put it back and then take it out
   *  again as a VISIBLE step instead of it vanishing between frames. */
  removed: { component: CircuitComponent; reason: string }[];
  notes: string[];
}

/**
 * Turn a circuit into the passive network whose resistance the question is
 * actually asking about, and say what was done to it.
 *
 * ⚠ THE CUT. If the probes are a cell's own two terminals, the cell is OPENED,
 * not shorted — you cannot measure the resistance across a component you have
 * just replaced by a wire. Opening it and measuring across the gap is what makes
 * "the total resistance the cell drives" come out as r + R_external, which is
 * the number the internal-resistance lesson is about. Shorting it instead would
 * give the Thévenin resistance r ∥ R_external — a real quantity, but the answer
 * to a different question, and 0.83 Ω where the student expects 6 Ω.
 *
 * The cell's internal resistance survives the cut as a real resistor between the
 * + terminal and a new gap node, so the reduction can put it in series with the
 * load and SHOW that step rather than asserting it.
 */
export function prepareForResistance(
  input: Circuit,
  probes?: [string, string],
): PreparedNetwork {
  const norm = normalizeCircuit(input);
  const circuit = cloneCircuit(norm.circuit);
  const notes: string[] = [];
  const removed: PreparedNetwork['removed'] = [];

  let outProbes: [string, string] =
    probes ?? defaultProbes(circuit) ?? ['', ''];

  // ── The cut ──────────────────────────────────────────────────────────────
  const same = (c: { a: string; b: string }) =>
    (c.a === outProbes[0] && c.b === outProbes[1])
    || (c.a === outProbes[1] && c.b === outProbes[0]);
  const cell = circuit.components.find((c) => c.kind === 'battery' && !c.open && same(c));

  let cutSource: PreparedNetwork['cutSource'];
  if (cell) {
    const r = resistanceOf(cell);
    // An IDEAL cell leaves no resistance behind, so the gap it opens is just its
    // own + terminal — the probes are unchanged and the branch simply goes. (An
    // earlier version used `cell.a` here, which made both probes the same node
    // and quietly reported every ideal-cell circuit as a 0 Ω short.)
    const gap = r > 0 ? `${cell.id}#gap` : cell.b;
    if (r > 0) {
      circuit.nodes.push({ id: gap, pos: cell.pos ? { ...cell.pos } : undefined });
      circuit.components.push({
        id: `${cell.id}#r`, kind: 'resistor', a: gap, b: cell.b, value: r,
        label: `r of ${labelOf(cell)}`, pos: cell.pos ? { ...cell.pos } : undefined,
      });
    }
    circuit.components = circuit.components.filter((c) => c.id !== cell.id);
    outProbes = [cell.a, gap];
    cutSource = {
      id: cell.id, label: labelOf(cell), emf: emfOf(cell), internal: r, gapNode: gap,
    };
    notes.push(
      r > 0
        ? `${labelOf(cell)} is lifted out and its own ${r} Ω internal resistance left in the loop, so the total it has to drive comes out as r + R.`
        : `${labelOf(cell)} is lifted out — what is left is the resistance it has to drive.`,
    );
  }

  // ── Everything else becomes a resistance ─────────────────────────────────
  const rest: Circuit['components'] = [];
  for (const c of circuit.components) {
    if (c.kind === 'battery') {
      const r = resistanceOf(c);
      if (r > 0 && r !== OPEN) {
        rest.push({ ...c, kind: 'resistor', value: r, internal: undefined,
          label: `r of ${labelOf(c)}` });
        notes.push(`${labelOf(c)} contributes only its ${r} Ω internal resistance here — an EMF pushes current, it does not resist it.`);
      } else if (r !== OPEN) {
        rest.push({ ...c, kind: 'wire', value: 0, internal: 0,
          label: `${labelOf(c)} (ideal cell)` });
        notes.push(`${labelOf(c)} is an ideal cell — for resistance it counts as a plain wire.`);
      } else {
        removed.push({ component: c, reason: `${labelOf(c)} is disconnected.` });
      }
      continue;
    }
    if (isOpen(c)) {
      removed.push({
        component: c,
        reason:
          c.kind === 'switch' ? `${labelOf(c)} is open, so that whole branch is out of the circuit.`
          : c.kind === 'voltmeter' ? `${labelOf(c)} is an ideal voltmeter — infinite resistance, so no current takes that path.`
          : c.kind === 'capacitor' ? `${labelOf(c)} is a capacitor: in the steady state it passes no current at all.`
          : `${labelOf(c)} carries no current.`,
      });
      continue;
    }
    rest.push(c);
  }
  circuit.components = rest;

  return { circuit, probes: outProbes, cutSource, removed, notes };
}

/** When no probes are given: a cell's terminals if there is exactly one cell,
 *  else the two nodes furthest apart in the graph. Never a guess presented as
 *  fact — callers show the chosen probes on screen. */
function defaultProbes(circuit: Circuit): [string, string] | null {
  const cells = circuit.components.filter((c) => c.kind === 'battery' && !c.open);
  if (cells.length === 1) return [cells[0].a, cells[0].b];
  const ids = circuit.nodes.map((n) => n.id);
  return ids.length >= 2 ? [ids[0], ids[ids.length - 1]] : null;
}

/**
 * The resistance the block's probes are asking for — the single entry point the
 * UI and the verifier both use, so a redraw and a readout can never disagree
 * about which question was asked.
 */
export function probeResistance(input: Circuit, probes?: [string, string]): REqResult {
  const prep = prepareForResistance(input, probes);
  if (!prep.probes[0] || !prep.probes[1]) {
    return { value: NaN, singular: true, reason: 'No probe nodes were given.' };
  }
  return measurePassive(prep.circuit, prep.probes[0], prep.probes[1]);
}

// ── Small readouts the UI needs and must not recompute ───────────────────────

/** Power dissipated, always positive, for brightness comparisons. */
export function dissipated(sol: CircuitSolution, id: string): number {
  return Math.abs(sol.power[id] ?? 0);
}

/** Largest |current| in the circuit — the scale for stroke width. */
export function peakCurrent(sol: CircuitSolution): number {
  let m = 0;
  for (const v of Object.values(sol.currents)) m = Math.max(m, Math.abs(v));
  return m;
}

/** Potential range, for the heatmap. */
export function potentialRange(sol: CircuitSolution): { lo: number; hi: number } {
  const vals = Object.values(sol.potentials);
  if (!vals.length) return { lo: 0, hi: 0 };
  return { lo: Math.min(...vals), hi: Math.max(...vals) };
}
