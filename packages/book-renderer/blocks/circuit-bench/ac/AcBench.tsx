'use client';

/*
 * circuit-bench/ac/AcBench.tsx — the AC switchboard.
 * ─────────────────────────────────────────────────────────────────────────────
 * Fifteen archetypes, four views. This file owns nothing but the routing.
 *
 *   phasor      → PhasorBench     (the flagship: the phasor IS the wave)
 *   sweep       → SweepBench      (reactance against frequency, resonance, the gate)
 *   transient   → TransientBench  (LR growth, LC oscillation, LCR damping)
 *   transformer → MachineBench    (turns ratio, and the grid)
 *   transmission→ MachineBench    (same component — it is the same argument)
 *
 * ── HOW TO REACH THIS FROM A PAGE ───────────────────────────────────────────
 * `CircuitBenchBlock` has no `mode` field, so nothing needs adding to the block
 * type. One line of wiring in the engine, outside this folder's ownership:
 * spread `AC_ARCHETYPES` into `CIRCUIT_ARCHETYPES` (circuit-bench/archetypes.ts)
 * and route `circuit_bench` blocks whose archetype id is in `AC_VIEW` here
 * instead of to `CircuitBench` — e.g. at the top of `CircuitBench` itself, or in
 * `BlockRenderer`'s `circuit_bench` case.
 *
 * The frozen `CircuitBench` would not crash on an AC archetype — the netlists
 * these archetypes build are real E3 netlists and it would draw and DC-solve them
 * correctly. It would just answer a different question (the DC steady state, in
 * which the inductor is a wire and the capacitor a gap), which is why the routing
 * matters rather than being a nicety.
 *
 * An unknown archetype degrades to a named card rather than throwing. Blocks are
 * Mixed-stored and hand-editable, and a page that blanks out is far harder to
 * diagnose than one that says what it could not render.
 */

import type { CircuitBenchBlock } from '@canvas/data/types/books';
import { BORDER, SIM_SURFACE, TEXT, TYPE } from '../../simulations/_shared';
import { AC_ARCHETYPES, AC_VIEW } from '../archetypes.ac';
import PhasorBench from './PhasorBench';
import SweepBench from './SweepBench';
import TransientBench from './TransientBench';
import MachineBench from './MachineBench';

export default function AcBench({ block }: { block: CircuitBenchBlock }) {
  const id = block.archetype ?? 'ac-resistor-only';
  const view = AC_VIEW[id];

  if (!view || !AC_ARCHETYPES[id]) {
    return (
      <div className="rounded-xl border p-4" style={{ background: SIM_SURFACE, borderColor: BORDER.card }}>
        <p className={TYPE.badge} style={{ color: TEXT.ghost }}>AC bench</p>
        <p className={TYPE.body} style={{ color: TEXT.secondary }}>
          {`No AC exercise is called "${id}". Pick one of: ${Object.keys(AC_VIEW).join(', ')}.`}
        </p>
      </div>
    );
  }

  switch (view) {
    case 'phasor': return <PhasorBench block={block} archetypeId={id} />;
    case 'sweep': return <SweepBench block={block} archetypeId={id} />;
    case 'transient': return <TransientBench block={block} archetypeId={id} />;
    case 'transformer':
    case 'transmission': return <MachineBench block={block} archetypeId={id} />;
    default: return <PhasorBench block={block} archetypeId="ac-resistor-only" />;
  }
}

/** True when a `circuit_bench` block's archetype belongs to the AC library — the
 *  one predicate the engine's router needs, so it does not have to know the
 *  fifteen ids. */
export const isAcArchetype = (archetype?: string): boolean =>
  !!archetype && !!AC_VIEW[archetype];
