/*
 * circuit-bench/lib/kirchhoff.ts — the independent audit of a solve.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM.
 *
 * The solver is a matrix; Kirchhoff's laws are the physics. This module checks
 * the second against the first WITHOUT reusing any of the solver's machinery:
 *
 *   KCL  — at every node, Σ (current leaving) = 0.
 *   KVL  — round every independent loop, Σ (i·R − EMF) = 0.
 *
 * KVL is deliberately written in ELEMENT terms rather than as a sum of
 * V(a) − V(b). The latter telescopes to zero for any node-potential solution
 * whatsoever, so it would pass even if every element law were stamped wrongly.
 * Written as i·R − EMF it is a real test of the stamping — and it is also
 * exactly the sentence a Class 12 student writes when they go round a loop.
 *
 * The UI uses this for its "check the numbers" panel; `verify-circuit-bench.mjs`
 * uses it on randomly generated networks, where hand-derived expectations are
 * impossible but the two laws still have to hold to 1e-9.
 */

import type { Circuit, CircuitSolution } from '../types';
import { activeComponents, emfOf, labelOf, otherEnd, resistanceOf } from './netlist';

export interface LoopHop {
  componentId: string;
  /** True when the loop traverses the element from its `a` end to its `b` end. */
  forward: boolean;
}

export interface Loop {
  hops: LoopHop[];
  nodes: string[];
}

export interface KirchhoffReport {
  ok: boolean;
  maxKcl: number;
  worstNode: string | null;
  maxKvl: number;
  worstLoop: Loop | null;
  loops: Loop[];
  /** Human summary — used verbatim in the UI's audit panel. */
  summary: string;
}

/** Potential DROP across `c` when walked from its `a` end to its `b` end. */
export function elementDrop(
  circuit: Circuit, sol: CircuitSolution, id: string,
): number {
  const c = circuit.components.find((x) => x.id === id);
  if (!c) return 0;
  const r = resistanceOf(c);
  const i = sol.currents[id] ?? 0;
  if (!Number.isFinite(r)) return 0;
  return i * r - emfOf(c);
}

/** Σ (current leaving) at each node. */
export function kclResiduals(
  circuit: Circuit, sol: CircuitSolution,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const n of circuit.nodes) out[n.id] = 0;
  for (const c of activeComponents(circuit)) {
    const i = sol.currents[c.id] ?? 0;
    if (c.a === c.b) continue;                 // leaves and returns at the same node
    out[c.a] = (out[c.a] ?? 0) + i;
    out[c.b] = (out[c.b] ?? 0) - i;
  }
  return out;
}

/**
 * One independent loop per non-tree edge of a spanning forest — the standard
 * fundamental cycle basis. For a connected network with N nodes and B branches
 * that is exactly B − N + 1 loops, which is exactly the number of independent
 * KVL equations a student would write.
 */
export function fundamentalLoops(circuit: Circuit): Loop[] {
  const comps = activeComponents(circuit);
  const parent = new Map<string, { node: string; comp: string } | null>();
  const inTree = new Set<string>();

  // BFS spanning forest.
  for (const n of circuit.nodes) {
    if (parent.has(n.id)) continue;
    parent.set(n.id, null);
    const queue = [n.id];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const c of comps) {
        if (c.a === c.b) continue;
        if (c.a !== cur && c.b !== cur) continue;
        if (inTree.has(c.id)) continue;
        const nxt = otherEnd(c, cur);
        if (parent.has(nxt)) continue;
        parent.set(nxt, { node: cur, comp: c.id });
        inTree.add(c.id);
        queue.push(nxt);
      }
    }
  }

  const compById = new Map(comps.map((c) => [c.id, c] as const));
  const hopTo = (from: string, to: string, compId: string): LoopHop => {
    const c = compById.get(compId)!;
    return { componentId: compId, forward: c.a === from && c.b === to };
  };
  const chainToRoot = (start: string): { node: string; hop: LoopHop | null }[] => {
    const out: { node: string; hop: LoopHop | null }[] = [];
    let cur: string | undefined = start;
    while (cur) {
      const p = parent.get(cur);
      if (!p) { out.push({ node: cur, hop: null }); break; }
      out.push({ node: cur, hop: hopTo(cur, p.node, p.comp) });
      cur = p.node;
    }
    return out;
  };

  const loops: Loop[] = [];
  for (const c of comps) {
    if (c.a === c.b) {
      loops.push({ hops: [{ componentId: c.id, forward: true }], nodes: [c.a] });
      continue;
    }
    if (inTree.has(c.id)) continue;

    // Walk a→b through the closing edge, then b back to a through the tree.
    const upA = chainToRoot(c.a);
    const upB = chainToRoot(c.b);
    const idxA = new Map(upA.map((s, i) => [s.node, i] as const));
    let meet = -1;
    let meetB = -1;
    for (let i = 0; i < upB.length; i++) {
      if (idxA.has(upB[i].node)) { meetB = i; meet = idxA.get(upB[i].node)!; break; }
    }
    if (meet < 0) continue;                    // different trees — not a loop

    const hops: LoopHop[] = [{ componentId: c.id, forward: true }];
    const nodes: string[] = [c.a, c.b];
    for (let i = 0; i < meetB; i++) {
      const h = upB[i].hop;
      if (h) { hops.push(h); nodes.push(upB[i + 1].node); }
    }
    for (let i = meet - 1; i >= 0; i--) {
      const h = upA[i].hop;
      if (h) { hops.push({ ...h, forward: !h.forward }); nodes.push(upA[i].node); }
    }
    loops.push({ hops, nodes });
  }
  return loops;
}

export function checkKirchhoff(
  circuit: Circuit, sol: CircuitSolution, tol = 1e-9,
): KirchhoffReport {
  const kcl = kclResiduals(circuit, sol);
  let maxKcl = 0;
  let worstNode: string | null = null;
  for (const [node, r] of Object.entries(kcl)) {
    if (Math.abs(r) > maxKcl) { maxKcl = Math.abs(r); worstNode = node; }
  }

  const loops = fundamentalLoops(circuit);
  let maxKvl = 0;
  let worstLoop: Loop | null = null;
  for (const loop of loops) {
    let sum = 0;
    for (const hop of loop.hops) {
      const d = elementDrop(circuit, sol, hop.componentId);
      sum += hop.forward ? d : -d;
    }
    if (Math.abs(sum) > maxKvl) { maxKvl = Math.abs(sum); worstLoop = loop; }
  }

  const ok = maxKcl <= tol && maxKvl <= tol;
  return {
    ok, maxKcl, worstNode, maxKvl, worstLoop, loops,
    summary: ok
      ? `Charge balances at all ${circuit.nodes.length} junctions, and the potential comes back to `
        + `where it started round all ${loops.length} independent loops.`
      : `Kirchhoff's laws do NOT hold for these numbers — worst junction ${worstNode ?? '?'} is out `
        + `by ${micro(maxKcl)} µA, worst loop by ${micro(maxKvl)} µV.`,
  };
}

/** A residual in micro-units, so the reader gets a SIZE rather than "1.2e-10". */
function micro(v: number): string {
  const u = v * 1e6;
  return u >= 0.01 ? u.toFixed(2) : u.toFixed(6);
}

/** "12 = 2×1 + 2×5" — the loop written the way a student writes it. */
export function loopSentence(
  circuit: Circuit, sol: CircuitSolution, loop: Loop,
): string {
  const parts: string[] = [];
  for (const hop of loop.hops) {
    const c = circuit.components.find((x) => x.id === hop.componentId);
    if (!c) continue;
    const d = elementDrop(circuit, sol, hop.componentId) * (hop.forward ? 1 : -1);
    parts.push(`${d >= 0 ? '−' : '+'}${Math.abs(d).toFixed(2)} V across ${labelOf(c)}`);
  }
  return `${parts.join(', ')} — back to where we started.`;
}
