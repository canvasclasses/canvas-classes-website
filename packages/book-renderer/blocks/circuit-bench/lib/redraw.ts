/*
 * circuit-bench/lib/redraw.ts — THE TOPOLOGICAL REDRAW. The reason E3 exists.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM. `redraw()` is a pure function of the netlist: same
 * circuit in, same ordered step list out, every step carrying the circuit AFTER
 * it so the UI can render each frame directly and animate between them.
 *
 * ── THE ONE RULE ────────────────────────────────────────────────────────────
 * Series and parallel are decided by SHARED NODES, never by drawn position:
 *
 *   • parallel  ⇔  two elements share BOTH ends
 *   • series    ⇔  two elements meet at a node that has nothing else on it
 *
 * That is the entire fix for `series_parallel_by_appearance`. Two resistors
 * drawn side by side in a row can be in parallel; two drawn as a neat ladder can
 * be in series; the drawing is not evidence. Nothing in this file ever reads
 * `pos` — positions exist only so the canvas can animate the SAME graph from the
 * exam-style tangle into the canonical form.
 *
 * ── WHAT IT REFUSES TO DO ───────────────────────────────────────────────────
 * A Wheatstone bridge with a real galvanometer in it is NOT a series-parallel
 * network, and no amount of squinting makes it one. When the rules run out, this
 * returns `fullyReduced: false` with a `stalledReason` naming the node that
 * blocks it — never a plausible-looking wrong number. The two escape hatches it
 * DOES know are the two a student is actually taught:
 *
 *   1. a branch carrying zero current can be lifted out (balanced bridge);
 *   2. two nodes at equal potential can be joined (the symmetry shortcut),
 *
 * and both are checked against a real solve of the current network, not guessed
 * from the shape.
 */

import type {
  Circuit, CircuitComponent, ComponentKind, RedrawResult, RedrawStep,
} from '../types';
import {
  activeComponents, cloneCircuit, componentsAt, degreeOf, describe, fmtNum,
  isVoltageBranch, labelOf, otherEnd, pairKey, resistanceOf,
} from './netlist';
import { prepareForResistance, solveCircuit } from './solve';

export interface RedrawOptions {
  /** Currents/potentials below this count as zero when hunting for a balanced
   *  branch. Relative to the test current, so it does not depend on scale. */
  tolerance?: number;
  maxSteps?: number;
}

const DEFAULT_TOL = 1e-9;
const DEFAULT_MAX = 200;

/**
 * Reduce `circuit` between `probes`, one explainable step at a time.
 *
 * Probes default to the single cell's terminals — the ordinary exam question,
 * "what resistance does this cell drive?" — which also triggers the CUT
 * described in `prepareForResistance`, so a cell's internal resistance ends up
 * in series with the load instead of in parallel with it.
 */
export function redraw(
  input: Circuit,
  probes?: [string, string],
  opts: RedrawOptions = {},
): RedrawResult {
  const tol = opts.tolerance ?? DEFAULT_TOL;
  const maxSteps = opts.maxSteps ?? DEFAULT_MAX;

  const prep = prepareForResistance(input, probes);
  const [pa0, pb0] = prep.probes;
  if (!pa0 || !pb0) {
    return {
      steps: [], fullyReduced: false,
      stalledReason: 'No probe nodes were given, so there is no "resistance between" to find.',
    };
  }

  // Start from the circuit WITH the open elements still in it, so taking each
  // one out is a visible step a student can follow rather than something that
  // silently happened before the animation began.
  const work: Circuit = {
    nodes: prep.circuit.nodes.map((n) => ({ ...n, pos: n.pos ? { ...n.pos } : undefined })),
    components: [
      ...prep.circuit.components.map((c) => ({ ...c, pos: c.pos ? { ...c.pos } : undefined })),
      ...prep.removed.map((r) => ({ ...r.component })),
    ],
  };
  // Keep the authored drawing order, which is the order the student wired it.
  const order = new Map(input.components.map((c, i) => [c.id, i] as const));
  work.components.sort((x, y) => (order.get(x.id) ?? 999) - (order.get(y.id) ?? 999));

  const probesRef: [string, string] = [pa0, pb0];
  const steps: RedrawStep[] = [];
  const emit = (
    kind: RedrawStep['kind'],
    componentIds: string[],
    explanation: string,
    extra: Partial<RedrawStep> = {},
  ) => {
    prune(work, probesRef);
    steps.push({ kind, componentIds, explanation, ...extra, after: cloneCircuit(work) });
  };

  // ── 0 · elements that were never in the circuit ───────────────────────────
  for (const r of prep.removed) {
    work.components = work.components.filter((c) => c.id !== r.component.id);
    emit('drop-zero-current', [r.component.id], r.reason);
  }
  // The CUT itself is deliberately not a step: it is the question being set up,
  // not a reduction. It shows in the panel as a note (PreparedNetwork.notes),
  // and the internal resistance it leaves behind gets named by whichever merge
  // picks it up — which is where the r + R lesson actually lands.

  // ── 1 · the reduction loop ────────────────────────────────────────────────
  let guard = 0;
  let stalled: string | undefined;

  while (guard++ < maxSteps) {
    if (isDone(work, probesRef)) break;

    const wire = findWire(work);
    if (wire) {
      const [keep, gone] = mergeNodes(work, wire.a, wire.b, probesRef);
      work.components = work.components.filter((c) => c.id !== wire.id);
      emit('collapse-wire', [wire.id], wireText(wire, keep, gone), { nodeIds: [keep, gone] });
      continue;
    }

    const shorted = activeComponents(work).find((c) => c.a === c.b);
    if (shorted) {
      work.components = work.components.filter((c) => c.id !== shorted.id);
      emit('drop-zero-current', [shorted.id],
        `${describe(shorted)} now has both ends on the same point. There is no p.d. across it, `
        + 'so no current goes through it — it is shorted out and cannot change the answer.');
      continue;
    }

    const dead = findDeadEnd(work, probesRef);
    if (dead) {
      work.components = work.components.filter((c) => c.id !== dead.comp.id);
      emit('drop-zero-current', [dead.comp.id],
        `Nothing else joins node ${dead.node}, so ${describe(dead.comp)} is a dead end — `
        + 'current that went in would have nowhere to come out. It carries nothing.');
      continue;
    }

    const par = findParallel(work);
    if (par) {
      const rep = replaceParallel(work, par[0], par[1]);
      emit('merge-parallel', [par[0].id, par[1].id], parallelText(par[0], par[1], rep.value), {
        replacement: { id: rep.id, kind: rep.kind, value: rep.value, a: rep.a, b: rep.b },
        latex: parallelLatex(par[0], par[1], rep.value),
      });
      continue;
    }

    const ser = findSeries(work, probesRef);
    if (ser) {
      const rep = replaceSeries(work, ser.c1, ser.c2, ser.via);
      emit('merge-series', [ser.c1.id, ser.c2.id], seriesText(ser.c1, ser.c2, ser.via, rep.value), {
        nodeIds: [ser.via],
        replacement: { id: rep.id, kind: rep.kind, value: rep.value, a: rep.a, b: rep.b },
        latex: seriesLatex(ser.c1, ser.c2, rep.value),
      });
      continue;
    }

    // ── The two shortcuts a student is actually taught ─────────────────────
    const zero = findZeroCurrent(work, probesRef, tol);
    if (zero) {
      work.components = work.components.filter((c) => c.id !== zero.comp.id);
      emit('drop-zero-current', [zero.comp.id], zero.explanation);
      continue;
    }

    const join = findEqualPotentialJoin(work, probesRef, tol);
    if (join) {
      const [keep, gone] = mergeNodes(work, join.u, join.v, probesRef);
      emit('collapse-wire', [], join.explanation, { nodeIds: [keep, gone] });
      continue;
    }

    stalled = stallReason(work, probesRef);
    break;
  }

  if (guard >= maxSteps && !stalled) {
    stalled = 'The reduction did not settle. That is a bug in the engine, not in your circuit — please report the circuit.';
  }

  // ── 2 · the verdict ───────────────────────────────────────────────────────
  const [pa, pb] = probesRef;
  const left = activeComponents(work);
  let rEquivalent: number | undefined;
  let fullyReduced = false;

  if (pa === pb) {
    rEquivalent = 0;
    fullyReduced = true;
    emit('done', [],
      'The two probe points have collapsed into one — they are joined by wire alone. '
      + 'R between them is exactly 0 Ω: this is a short circuit.');
  } else if (!left.length) {
    rEquivalent = Number.POSITIVE_INFINITY;
    fullyReduced = true;
    emit('done', [],
      'Nothing conducts between the two probes any more, so the resistance between them is '
      + 'infinite — an open circuit, and no current flows.');
  } else if (left.length === 1 && sameEnds(left[0], pa, pb)) {
    rEquivalent = resistanceOf(left[0]);
    fullyReduced = true;
    emit('done', [left[0].id],
      `One element left between the probes. R_eq = ${fmtNum(rEquivalent)} Ω — and every step that `
      + 'got here was a statement about which nodes were shared, never about how it was drawn.',
      { latex: `R_{eq} = ${fmtNum(rEquivalent)}\\ \\Omega` });
  } else if (!stalled) {
    stalled = stallReason(work, probesRef);
  }

  return { steps, fullyReduced, rEquivalent, stalledReason: fullyReduced ? undefined : stalled };
}

// ── Termination ──────────────────────────────────────────────────────────────

function sameEnds(c: CircuitComponent, a: string, b: string): boolean {
  return (c.a === a && c.b === b) || (c.a === b && c.b === a);
}

function isDone(circuit: Circuit, probes: [string, string]): boolean {
  const [a, b] = probes;
  if (a === b) return true;
  const left = activeComponents(circuit);
  return left.length === 0 || (left.length === 1 && sameEnds(left[0], a, b));
}

/** Drop nodes nothing is attached to any more (never a probe). Keeps `after`
 *  frames honest: a node with no elements on it is not part of the circuit. */
function prune(circuit: Circuit, probes: [string, string]) {
  circuit.nodes = circuit.nodes.filter(
    (n) => probes.includes(n.id) || degreeOf(circuit, n.id) > 0,
  );
}

// ── Rule 1 · collapse a zero-resistance branch ───────────────────────────────

function findWire(circuit: Circuit): CircuitComponent | undefined {
  return activeComponents(circuit).find((c) => isVoltageBranch(c) && c.a !== c.b);
}

function wireText(c: CircuitComponent, keep: string, gone: string): string {
  const both = `${keep} and ${gone} are the same point`;
  switch (c.kind) {
    case 'battery':
    case 'wire':
      return c.label && /ideal cell/i.test(c.label)
        ? `${labelOf(c)} is an ideal cell: it pushes current but adds no resistance, so for a `
          + `resistance question its two ends are one point. ${both} — draw them as one node.`
        : `${labelOf(c)} is a plain wire — no resistance, so there is no p.d. across it however `
          + `much current it carries. ${both}. Every wire you can slide your finger along without `
          + 'passing a component is one node.';
    case 'ammeter':
      return `${labelOf(c)} is an ideal ammeter — zero resistance, so it does not separate the two `
        + `points it sits between. ${both}.`;
    case 'switch':
      return `${labelOf(c)} is closed and has no resistance, so ${both}.`;
    case 'inductor':
      return `In the steady state ${labelOf(c)} is just a coil of wire — no p.d. across it, so ${both}.`;
    default:
      return `${describe(c)} has no resistance, so ${both}.`;
  }
}

// ── Rule 2 · dead ends ───────────────────────────────────────────────────────

function findDeadEnd(circuit: Circuit, probes: [string, string]):
{ node: string; comp: CircuitComponent } | undefined {
  for (const n of circuit.nodes) {
    if (probes.includes(n.id)) continue;
    if (degreeOf(circuit, n.id) !== 1) continue;
    const comp = componentsAt(circuit, n.id)[0];
    if (comp) return { node: n.label ?? n.id, comp };
  }
  return undefined;
}

// ── Rule 3 · parallel: SHARES BOTH ENDS ──────────────────────────────────────

function findParallel(circuit: Circuit): [CircuitComponent, CircuitComponent] | undefined {
  const byPair = new Map<string, CircuitComponent[]>();
  for (const c of activeComponents(circuit)) {
    if (c.a === c.b) continue;
    const k = pairKey(c);
    const list = byPair.get(k) ?? [];
    list.push(c);
    byPair.set(k, list);
  }
  for (const [, list] of byPair) if (list.length >= 2) return [list[0], list[1]];
  return undefined;
}

function parallelValue(c1: CircuitComponent, c2: CircuitComponent): number {
  const r1 = resistanceOf(c1);
  const r2 = resistanceOf(c2);
  if (r1 <= 0 || r2 <= 0) return 0;
  return 1 / (1 / r1 + 1 / r2);
}

function replaceParallel(circuit: Circuit, c1: CircuitComponent, c2: CircuitComponent) {
  const value = parallelValue(c1, c2);
  const rep: CircuitComponent = {
    id: `${c1.id}‖${c2.id}`,
    kind: 'resistor' as ComponentKind,
    a: c1.a, b: c1.b, value,
    label: `${labelOf(c1)}‖${labelOf(c2)}`,
    pos: midpoint(c1, c2),
  };
  const at = circuit.components.findIndex((c) => c.id === c1.id);
  circuit.components = circuit.components.filter((c) => c.id !== c1.id && c.id !== c2.id);
  circuit.components.splice(Math.max(0, at), 0, rep);
  return rep;
}

function parallelText(c1: CircuitComponent, c2: CircuitComponent, value: number): string {
  const r1 = resistanceOf(c1);
  const r2 = resistanceOf(c2);
  return `${labelOf(c1)} and ${labelOf(c2)} share BOTH ends — both are joined to ${c1.a} at one `
    + `side and to ${c1.b} at the other. That is what parallel means, whatever the drawing looks `
    + `like: ${fmtNum(r1)}‖${fmtNum(r2)} = ${fmtNum(value)} Ω. Notice it is smaller than either one — `
    + 'two paths let more current through than one.';
}

function parallelLatex(c1: CircuitComponent, c2: CircuitComponent, value: number): string {
  const r1 = fmtNum(resistanceOf(c1));
  const r2 = fmtNum(resistanceOf(c2));
  return `\\frac{1}{R_p} = \\frac{1}{${r1}} + \\frac{1}{${r2}} \\Rightarrow R_p = ${fmtNum(value)}\\ \\Omega`;
}

// ── Rule 4 · series: A NODE WITH NOTHING ELSE ON IT ──────────────────────────

function findSeries(circuit: Circuit, probes: [string, string]):
{ via: string; c1: CircuitComponent; c2: CircuitComponent } | undefined {
  for (const n of circuit.nodes) {
    if (probes.includes(n.id)) continue;          // a probe is where we measure
    if (degreeOf(circuit, n.id) !== 2) continue;
    const [c1, c2] = componentsAt(circuit, n.id);
    if (!c1 || !c2 || c1.id === c2.id) continue;
    // Same two far ends ⇒ they are parallel, and the parallel rule (which runs
    // first) states it far better. Skip rather than call it series.
    if (otherEnd(c1, n.id) === otherEnd(c2, n.id)) continue;
    return { via: n.id, c1, c2 };
  }
  return undefined;
}

function replaceSeries(
  circuit: Circuit, c1: CircuitComponent, c2: CircuitComponent, via: string,
) {
  const value = resistanceOf(c1) + resistanceOf(c2);
  const rep: CircuitComponent = {
    id: `${c1.id}+${c2.id}`,
    kind: 'resistor' as ComponentKind,
    a: otherEnd(c1, via), b: otherEnd(c2, via), value,
    label: `${labelOf(c1)}+${labelOf(c2)}`,
    pos: midpoint(c1, c2),
  };
  const at = circuit.components.findIndex((c) => c.id === c1.id);
  circuit.components = circuit.components.filter((c) => c.id !== c1.id && c.id !== c2.id);
  circuit.components.splice(Math.max(0, at), 0, rep);
  circuit.nodes = circuit.nodes.filter((n) => n.id !== via);
  return rep;
}

function seriesText(
  c1: CircuitComponent, c2: CircuitComponent, via: string, value: number,
): string {
  return `${labelOf(c1)} and ${labelOf(c2)} are the only two things joined at ${via} — there is `
    + 'nowhere else for the current to go, so whatever passes through one must pass through the '
    + `other. That is series: ${fmtNum(resistanceOf(c1))} + ${fmtNum(resistanceOf(c2))} `
    + `= ${fmtNum(value)} Ω, and node ${via} disappears because it was never a junction.`;
}

function seriesLatex(c1: CircuitComponent, c2: CircuitComponent, value: number): string {
  return `R_s = ${fmtNum(resistanceOf(c1))} + ${fmtNum(resistanceOf(c2))} = ${fmtNum(value)}\\ \\Omega`;
}

// ── Rule 5 · the balanced branch ─────────────────────────────────────────────

/**
 * A branch carrying exactly zero current can be lifted out without changing
 * anything else. Checked against a real solve of the CURRENT network with a
 * 1 V test source across the probes — never guessed from the shape, because
 * "it looks symmetric" is how students get an unbalanced bridge wrong.
 */
function findZeroCurrent(circuit: Circuit, probes: [string, string], tol: number):
{ comp: CircuitComponent; explanation: string } | undefined {
  const sol = testSolve(circuit, probes);
  if (!sol) return undefined;
  const scale = Math.max(Math.abs(sol.currents.__probe__ ?? 0), 1);

  for (const c of activeComponents(circuit)) {
    if (c.id === '__probe__') continue;
    if (Math.abs(sol.currents[c.id] ?? 0) > tol * scale) continue;
    return { comp: c, explanation: zeroCurrentText(circuit, c, sol.potentials) };
  }
  return undefined;
}

function zeroCurrentText(
  circuit: Circuit, c: CircuitComponent, potentials: Record<string, number>,
): string {
  const bridge = bridgeArms(circuit, c);
  const head = `No current at all crosses ${labelOf(c)}: ${c.a} and ${c.b} are at exactly the `
    + `same potential (${fmtNum(potentials[c.a] ?? 0, 4)} V each), so there is nothing to push `
    + 'current across it.';
  const ratio = bridge
    ? ` That is the balance condition: ${fmtNum(bridge.p)}/${fmtNum(bridge.q)} = `
      + `${fmtNum(bridge.r)}/${fmtNum(bridge.s)}. `
    : ' ';
  return `${head}${ratio}A branch carrying zero current can be lifted straight out — with it gone, `
    + 'what is left is ordinary series and parallel.';
}

/** The four arms of a Wheatstone bridge around element `c`, when it IS one. */
function bridgeArms(circuit: Circuit, c: CircuitComponent):
{ p: number; q: number; r: number; s: number } | undefined {
  const left = componentsAt(circuit, c.a).filter((x) => x.id !== c.id);
  const right = componentsAt(circuit, c.b).filter((x) => x.id !== c.id);
  if (left.length !== 2 || right.length !== 2) return undefined;
  const lEnds = left.map((x) => otherEnd(x, c.a)).sort();
  const rEnds = right.map((x) => otherEnd(x, c.b)).sort();
  if (lEnds[0] !== rEnds[0] || lEnds[1] !== rEnds[1]) return undefined;
  const top = lEnds[0];
  const arm = (list: CircuitComponent[], node: string, far: string) =>
    list.find((x) => otherEnd(x, node) === far);
  const p = arm(left, c.a, top);
  const q = arm(left, c.a, lEnds[1]);
  const r = arm(right, c.b, top);
  const s = arm(right, c.b, rEnds[1]);
  if (!p || !q || !r || !s) return undefined;
  return {
    p: resistanceOf(p), q: resistanceOf(q), r: resistanceOf(r), s: resistanceOf(s),
  };
}

// ── Rule 6 · the symmetry join ───────────────────────────────────────────────

/**
 * Two nodes at the same potential may be wired together — no current would cross
 * the added wire, so nothing changes. This is the symmetry shortcut (the cube of
 * resistors, the infinite ladder's repeat point).
 *
 * Gated by a LOOKAHEAD: the join only happens if it actually unlocks a series or
 * parallel merge. Without that gate a network with two coincidentally-equal
 * potentials collects joins that explain nothing and reduce nothing.
 */
function findEqualPotentialJoin(circuit: Circuit, probes: [string, string], tol: number):
{ u: string; v: string; explanation: string } | undefined {
  const sol = testSolve(circuit, probes);
  if (!sol) return undefined;
  const ids = circuit.nodes.map((n) => n.id);
  // Scale the tolerance by the potential SPAN across the network (1 V for the
  // test source), so "equal" means equal relative to the excitation rather than
  // to an absolute volt.
  const vals = Object.values(sol.potentials);
  const span = Math.max(1e-12, Math.max(...vals) - Math.min(...vals));

  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const u = ids[i];
      const v = ids[j];
      if (probes.includes(u) && probes.includes(v)) continue;
      const du = Math.abs((sol.potentials[u] ?? 0) - (sol.potentials[v] ?? 0));
      if (du > tol * span) continue;

      const trial = cloneCircuit(circuit);
      const trialProbes: [string, string] = [...probes];
      mergeNodes(trial, u, v, trialProbes);
      if (!findParallel(trial) && !findSeries(trial, trialProbes)) continue;

      return {
        u, v,
        explanation:
          `${u} and ${v} sit at exactly the same potential (${fmtNum(sol.potentials[u] ?? 0, 4)} V). `
          + 'Join them with a wire and nothing changes — no current would ever cross a wire between '
          + 'two equal potentials. But now they are one node, and the network falls apart into '
          + 'ordinary series and parallel.',
      };
    }
  }
  return undefined;
}

/** Solve the working network with a 1 V test source across the probes. Returns
 *  null when that has no unique answer — in which case we do not guess. */
function testSolve(circuit: Circuit, probes: [string, string]) {
  const [a, b] = probes;
  if (a === b) return null;
  const test: Circuit = {
    nodes: circuit.nodes.map((n) => ({ ...n, ground: n.id === a })),
    components: [
      ...circuit.components,
      { id: '__probe__', kind: 'battery' as ComponentKind, a, b, value: 1, label: 'test source' },
    ],
  };
  const sol = solveCircuit(test, { ground: a });
  return sol.singular ? null : sol;
}

// ── Node merging ─────────────────────────────────────────────────────────────

/**
 * Fuse `u` and `v` into one node. Returns [survivor, absorbed].
 *
 * The survivor is chosen so a probe or a ground can never be the one that
 * disappears — every later step, and the caller's own probe pair, refer to node
 * ids by name.
 */
function mergeNodes(
  circuit: Circuit, u: string, v: string, probes: [string, string],
): [string, string] {
  const rank = (id: string) =>
    (probes.includes(id) ? 0 : 1) * 10
    + (circuit.nodes.find((n) => n.id === id)?.ground ? 0 : 1);
  let keep = u;
  let gone = v;
  if (rank(v) < rank(u) || (rank(v) === rank(u) && v < u)) { keep = v; gone = u; }

  const kn = circuit.nodes.find((n) => n.id === keep);
  const gn = circuit.nodes.find((n) => n.id === gone);
  if (kn && gn?.pos && kn.pos) {
    kn.pos = { x: (kn.pos.x + gn.pos.x) / 2, y: (kn.pos.y + gn.pos.y) / 2 };
  } else if (kn && gn?.pos && !kn.pos) {
    kn.pos = { ...gn.pos };
  }
  if (kn) kn.ground = kn.ground || gn?.ground;

  circuit.nodes = circuit.nodes.filter((n) => n.id !== gone);
  for (const c of circuit.components) {
    if (c.a === gone) c.a = keep;
    if (c.b === gone) c.b = keep;
  }
  if (probes[0] === gone) probes[0] = keep;
  if (probes[1] === gone) probes[1] = keep;
  return [keep, gone];
}

function midpoint(c1: CircuitComponent, c2: CircuitComponent) {
  if (c1.pos && c2.pos) return { x: (c1.pos.x + c2.pos.x) / 2, y: (c1.pos.y + c2.pos.y) / 2 };
  return c1.pos ? { ...c1.pos } : c2.pos ? { ...c2.pos } : undefined;
}

// ── The honest refusal ───────────────────────────────────────────────────────

/**
 * Say exactly WHICH structural fact blocks the reduction. "Cannot reduce" is
 * useless to a student; "node B has three elements on it, so nothing there is
 * in series, and no two elements share both ends" is the actual lesson.
 */
function stallReason(circuit: Circuit, probes: [string, string]): string {
  const left = activeComponents(circuit);
  const junctions = circuit.nodes
    .filter((n) => degreeOf(circuit, n.id) >= 3)
    .map((n) => `${n.id} (${degreeOf(circuit, n.id)} elements)`);

  const shape = junctions.length
    ? `Every remaining junction has three or more elements on it — ${junctions.join(', ')} — so no `
      + 'node is a plain series joint, and no two elements share both of their ends.'
    : 'No two elements share both ends, and no node has exactly two elements on it.';

  const bridge = left.length === 5 && junctions.length >= 2;

  return `${shape} This network is not series-parallel, so there is no sequence of "add them" and `
    + `"combine them" that will finish it${bridge ? ' — this is a BRIDGE' : ''}. `
    + 'Two things still work: check whether it is balanced (in a Wheatstone bridge, P/Q = R/S makes '
    + 'the middle branch carry zero current, and then you can lift it out), or drop the shortcuts '
    + 'and use Kirchhoff\'s laws directly. A star-delta transform also works. '
    + `Probes: ${probes[0]} → ${probes[1]}; ${left.length} elements left.`;
}

// ── What the fold/unfold ladder needs ────────────────────────────────────────

export interface FoldNode {
  id: string;
  label: string;
  value: number;
  op?: 'series' | 'parallel';
  children?: FoldNode[];
}

/**
 * Rebuild the grouping tree from the step list, so the ladder can show
 * "R2‖R3 = 2 Ω replaced these two" and unfold it again. Derived rather than
 * stored: the steps already carry every replacement, and two sources of truth
 * for the same tree is how the ladder and the animation drift apart.
 */
export function foldTree(steps: RedrawStep[], baseline: Circuit): FoldNode[] {
  const leaves = new Map<string, FoldNode>();
  for (const c of baseline.components) {
    leaves.set(c.id, { id: c.id, label: labelOf(c), value: resistanceOf(c) });
  }
  const roots = new Map(leaves);

  for (const s of steps) {
    if (!s.replacement) {
      // A wire that collapsed, or a branch that was lifted out, never enters the
      // resistance ladder — it is not a rung, it is a step that removed one.
      // Leaving them as roots is what made the ladder show three trees for a
      // circuit that reduces to a single number.
      if (s.kind === 'collapse-wire' || s.kind === 'drop-zero-current') {
        for (const id of s.componentIds) roots.delete(id);
      }
      continue;
    }
    const children = s.componentIds
      .map((id) => roots.get(id) ?? leaves.get(id))
      .filter((x): x is FoldNode => !!x);
    for (const id of s.componentIds) roots.delete(id);
    const node: FoldNode = {
      id: s.replacement.id,
      label: s.replacement.id,
      value: s.replacement.value,
      op: s.kind === 'merge-parallel' ? 'parallel' : 'series',
      children,
    };
    leaves.set(node.id, node);
    roots.set(node.id, node);
  }
  return [...roots.values()];
}
