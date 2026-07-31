/*
 * circuit-bench/lib/netlist.ts — the graph, and what each element actually IS.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM, no dependencies — node-verifiable, like every other
 * `lib/` module in this program.
 *
 * Everything downstream (the solver, the redraw, the canvas) asks this file two
 * questions: "what resistance does this element present?" and "who is joined to
 * whom?". Keeping both answers in one place is what stops a bulb behaving like a
 * resistor in the solver and like something else in the redraw.
 *
 * ── THE TWO CONVENTIONS THAT EVERY SIGN QUESTION TURNS ON ────────────────────
 *
 * 1. CURRENT SIGN. `currents[id]` is positive when current flows a → b THROUGH
 *    the element (types.ts). For a resistor that is just "left to right if you
 *    wrote it a-then-b".
 *
 * 2. BATTERY POLARITY. `a` is the NEGATIVE terminal, `b` is the POSITIVE one.
 *    Inside a battery, conventional current is pumped from − to +, so a
 *    discharging cell reports a POSITIVE current — which is the only choice
 *    that makes convention (1) read naturally for the element students meet
 *    first. It follows that
 *
 *        V(b) − V(a) = EMF − I·r          (terminal p.d.)
 *
 *    and therefore `voltages[battery] = V(a) − V(b)` is NEGATIVE for a
 *    discharging cell. That is not a bug; it is what "V(a) − V(b)" means when a
 *    is the − terminal. Use `terminalVoltage()` below for anything a student
 *    reads.
 *
 * ── WHAT EACH KIND CONTRIBUTES ──────────────────────────────────────────────
 *
 *   resistor / bulb   R = value                     (a bulb is a resistor that
 *                                                    also reports brightness)
 *   wire              R = 0 exactly — NOT a big/small number. An ideal wire is
 *                     an equality between two potentials, and the solver
 *                     enforces it as one (see solve.ts, MNA). Approximating it
 *                     as 1e-9 Ω is how a matrix becomes ill-conditioned and
 *                     starts printing 1e12 A.
 *   switch            open → removed from the solve; closed → R = internal ?? 0
 *   ammeter           R = internal ?? 0        ideal = 0, and a REAL one is not
 *   voltmeter         R = internal ?? ∞        ideal = open, and a REAL one is not
 *   galvanometer      R = internal ?? value ?? 0
 *   battery           EMF = value, series r = internal ?? 0
 *   capacitor         open in the DC steady state (with a warning)
 *   inductor          a wire in the DC steady state (with a warning)
 */

import type {
  Circuit, CircuitComponent, CircuitNode, ComponentKind, Vec2,
} from '../types';

/** A branch that carries no current at all — removed from the solve entirely. */
export const OPEN = Number.POSITIVE_INFINITY;

/** Below this, a resistance is treated as EXACTLY zero (an equality, not a
 *  conductance). Real component values in this engine are ≥ 0.1 Ω. */
export const ZERO_R = 1e-12;

// ── Element semantics ────────────────────────────────────────────────────────

/** DC resistance in ohms. `OPEN` means "not in the circuit". */
export function resistanceOf(c: CircuitComponent): number {
  if (c.open) return OPEN;
  switch (c.kind) {
    case 'resistor':
    case 'bulb':
      return Math.max(0, c.value ?? 0);
    case 'wire':
      return Math.max(0, c.internal ?? 0);
    case 'switch':
      return Math.max(0, c.internal ?? 0);
    case 'ammeter':
      return Math.max(0, c.internal ?? 0);
    case 'voltmeter':
      return c.internal == null ? OPEN : Math.max(0, c.internal);
    case 'galvanometer':
      return Math.max(0, c.internal ?? c.value ?? 0);
    case 'battery':
      return Math.max(0, c.internal ?? 0);
    case 'capacitor':
      return OPEN;
    case 'inductor':
      return 0;
    default:
      return OPEN;
  }
}

/** EMF in volts, raising the potential from a (−) to b (+). Zero for passives. */
export function emfOf(c: CircuitComponent): number {
  return c.kind === 'battery' ? (c.value ?? 0) : 0;
}

/** True when the element carries no current by construction. */
export function isOpen(c: CircuitComponent): boolean {
  return resistanceOf(c) === OPEN;
}

/** True when the element FORCES a relation between two potentials rather than
 *  offering a conductance — an ideal wire, an ideal cell, a closed ideal
 *  switch, an ideal ammeter. These get their own current unknown in the MNA. */
export function isVoltageBranch(c: CircuitComponent): boolean {
  const r = resistanceOf(c);
  return r !== OPEN && r <= ZERO_R;
}

/** The p.d. a student would read off this element, in the direction they'd
 *  read it: + terminal minus − terminal for a cell, a → b for everything else. */
export function terminalVoltage(c: CircuitComponent, vab: number): number {
  return c.kind === 'battery' ? -vab : vab;
}

/** "R1 (6 Ω)" — used verbatim inside redraw explanations, so it has to read as
 *  English rather than as a debug dump. */
export function describe(c: CircuitComponent, withValue = true): string {
  const name = labelOf(c);
  if (!withValue) return name;
  const r = resistanceOf(c);
  if (c.kind === 'battery') return `${name} (${fmtNum(emfOf(c))} V)`;
  if (r === OPEN) return `${name} (open)`;
  if (r <= ZERO_R) return `${name} (no resistance)`;
  return `${name} (${fmtNum(r)} Ω)`;
}

export function labelOf(c: CircuitComponent): string {
  return c.label ?? c.id;
}

/** Short numbers without trailing zeros — 6, 2.5, 0.33. */
export function fmtNum(v: number, dp = 3): string {
  if (!Number.isFinite(v)) return '∞';
  const r = Number(v.toFixed(dp));
  return String(r);
}

// ── Graph queries ────────────────────────────────────────────────────────────

/** Components that are actually in the circuit (open ones are not). */
export function activeComponents(circuit: Circuit): CircuitComponent[] {
  return circuit.components.filter((c) => !isOpen(c));
}

/** How many active components touch this node. A self-loop counts twice — it
 *  really does attach both of its ends here. */
export function degreeOf(circuit: Circuit, nodeId: string): number {
  let d = 0;
  for (const c of activeComponents(circuit)) {
    if (c.a === nodeId) d++;
    if (c.b === nodeId) d++;
  }
  return d;
}

export function componentsAt(circuit: Circuit, nodeId: string): CircuitComponent[] {
  return activeComponents(circuit).filter((c) => c.a === nodeId || c.b === nodeId);
}

/** The other end of `c` from `nodeId` (equal to nodeId for a self-loop). */
export function otherEnd(c: CircuitComponent, nodeId: string): string {
  return c.a === nodeId ? c.b : c.a;
}

/** Unordered node-pair key — the ONLY correct way to ask "same two ends?".
 *  Parallel is a statement about shared nodes, never about drawn position; that
 *  is the whole `series_parallel_by_appearance` misconception. */
export function pairKey(c: CircuitComponent): string {
  return c.a < c.b ? `${c.a}|${c.b}` : `${c.b}|${c.a}`;
}

export function nodeIdsOf(circuit: Circuit): string[] {
  return circuit.nodes.map((n) => n.id);
}

export function findNode(circuit: Circuit, id: string): CircuitNode | undefined {
  return circuit.nodes.find((n) => n.id === id);
}

export function findComponent(circuit: Circuit, id: string): CircuitComponent | undefined {
  return circuit.components.find((c) => c.id === id);
}

/** Node ids reachable from `start` over active components. */
export function reachableFrom(circuit: Circuit, start: string): Set<string> {
  const seen = new Set<string>([start]);
  const queue = [start];
  const comps = activeComponents(circuit);
  while (queue.length) {
    const n = queue.shift()!;
    for (const c of comps) {
      if (c.a !== n && c.b !== n) continue;
      const o = otherEnd(c, n);
      if (!seen.has(o)) { seen.add(o); queue.push(o); }
    }
  }
  return seen;
}

/** Every connected island of the circuit, as sets of node ids. A circuit a
 *  student wired badly has more than one; the solver has to say so rather than
 *  invent potentials for a floating island. */
export function connectedIslands(circuit: Circuit): Set<string>[] {
  const out: Set<string>[] = [];
  const placed = new Set<string>();
  for (const n of circuit.nodes) {
    if (placed.has(n.id)) continue;
    const island = reachableFrom(circuit, n.id);
    island.forEach((id) => placed.add(id));
    out.push(island);
  }
  return out;
}

/** True when a and b are joined by a chain of exactly-zero-resistance branches
 *  — i.e. they are already the same electrical point. */
export function shortedTogether(circuit: Circuit, a: string, b: string): boolean {
  if (a === b) return true;
  const seen = new Set([a]);
  const queue = [a];
  const zero = activeComponents(circuit).filter(isVoltageBranch)
    .filter((c) => emfOf(c) === 0);
  while (queue.length) {
    const n = queue.shift()!;
    for (const c of zero) {
      if (c.a !== n && c.b !== n) continue;
      const o = otherEnd(c, n);
      if (o === b) return true;
      if (!seen.has(o)) { seen.add(o); queue.push(o); }
    }
  }
  return false;
}

// ── Normalisation ────────────────────────────────────────────────────────────

export function cloneCircuit(circuit: Circuit): Circuit {
  return {
    nodes: circuit.nodes.map((n) => ({ ...n, pos: n.pos ? { ...n.pos } : undefined })),
    components: circuit.components.map((c) => ({ ...c, pos: c.pos ? { ...c.pos } : undefined })),
  };
}

export interface NormalizeResult {
  circuit: Circuit;
  warnings: string[];
  /** The reference node the solver will use. */
  ground: string | null;
}

/**
 * Make a hand-authored or student-built circuit safe to solve:
 *   • every referenced node exists;
 *   • exactly one ground (if the author marked none, the battery's − terminal
 *     is chosen AND SAID SO, per the types.ts contract);
 *   • duplicate ids are reported rather than silently shadowing each other.
 */
export function normalizeCircuit(input: Circuit): NormalizeResult {
  const warnings: string[] = [];
  const circuit = cloneCircuit(input);

  // Referenced-but-undeclared nodes.
  const known = new Set(circuit.nodes.map((n) => n.id));
  for (const c of circuit.components) {
    for (const end of [c.a, c.b]) {
      if (!known.has(end)) {
        known.add(end);
        circuit.nodes.push({ id: end });
        warnings.push(`Node "${end}" was used by ${labelOf(c)} but never declared — added it.`);
      }
    }
  }

  // Duplicate ids would make findComponent/findNode ambiguous.
  const seenN = new Set<string>();
  for (const n of circuit.nodes) {
    if (seenN.has(n.id)) warnings.push(`Duplicate node id "${n.id}".`);
    seenN.add(n.id);
  }
  const seenC = new Set<string>();
  for (const c of circuit.components) {
    if (seenC.has(c.id)) warnings.push(`Duplicate component id "${c.id}".`);
    seenC.add(c.id);
  }

  // Ground.
  const marked = circuit.nodes.filter((n) => n.ground);
  let ground: string | null = null;
  if (marked.length === 1) {
    ground = marked[0].id;
  } else if (marked.length > 1) {
    ground = marked[0].id;
    for (const n of marked.slice(1)) n.ground = false;
    warnings.push(
      `${marked.length} nodes were marked ground; kept "${ground}" and cleared the rest. `
      + 'Exactly one node is the 0 V reference.',
    );
  } else {
    const cell = circuit.components.find((c) => c.kind === 'battery');
    ground = cell ? cell.a : (circuit.nodes[0]?.id ?? null);
    if (ground) {
      const g = circuit.nodes.find((n) => n.id === ground);
      if (g) g.ground = true;
      warnings.push(
        cell
          ? `No node was marked ground, so "${ground}" — the − terminal of ${labelOf(cell)} — is the 0 V reference.`
          : `No node was marked ground, so "${ground}" is the 0 V reference.`,
      );
    }
  }

  return { circuit, warnings, ground };
}

// ── Builders (archetypes author with these, never with object literals) ──────

const at = (x?: number, y?: number): Vec2 | undefined =>
  x == null || y == null ? undefined : { x, y };

export function mkNode(id: string, x?: number, y?: number,
  opts: { label?: string; ground?: boolean } = {}): CircuitNode {
  return { id, pos: at(x, y), label: opts.label, ground: opts.ground };
}

interface MkOpts { label?: string; x?: number; y?: number; internal?: number; open?: boolean }

function mk(kind: ComponentKind, id: string, a: string, b: string,
  value: number, o: MkOpts = {}): CircuitComponent {
  return {
    id, kind, a, b, value,
    internal: o.internal, label: o.label, open: o.open, pos: at(o.x, o.y),
  };
}

export const mkResistor = (id: string, a: string, b: string, ohms: number, o?: MkOpts) =>
  mk('resistor', id, a, b, ohms, { label: id, ...o });

export const mkBulb = (id: string, a: string, b: string, ohms: number, o?: MkOpts) =>
  mk('bulb', id, a, b, ohms, { label: id, ...o });

/** `a` is the − terminal and `b` is the + terminal — see the header. */
export const mkBattery = (id: string, a: string, b: string, emf: number, o?: MkOpts) =>
  mk('battery', id, a, b, emf, { label: id, ...o });

export const mkWire = (id: string, a: string, b: string, o?: MkOpts) =>
  mk('wire', id, a, b, 0, { label: id, ...o });

export const mkSwitch = (id: string, a: string, b: string, o?: MkOpts) =>
  mk('switch', id, a, b, 0, { label: id, ...o });

export const mkAmmeter = (id: string, a: string, b: string, o?: MkOpts) =>
  mk('ammeter', id, a, b, 0, { label: id, ...o });

export const mkVoltmeter = (id: string, a: string, b: string, o?: MkOpts) =>
  mk('voltmeter', id, a, b, 0, { label: id, ...o });

export const mkGalvanometer = (id: string, a: string, b: string, ohms = 0, o?: MkOpts) =>
  mk('galvanometer', id, a, b, ohms, { label: id, ...o });

export const mkCircuit = (nodes: CircuitNode[], components: CircuitComponent[]): Circuit =>
  ({ nodes, components });
