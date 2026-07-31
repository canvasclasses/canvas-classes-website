'use client';

/*
 * field-bench/emi/EmiBench.tsx — the EMI switchboard.
 * ─────────────────────────────────────────────────────────────────────────────
 * Twelve archetypes, five views. This file owns nothing but the routing.
 *
 *   flux        → FluxMachine       (the flagship: flux, its rate, Lenz, the drag)
 *   motional    → MotionalEmf       (ε = Bℓv, the energy identity, terminal speed)
 *   eddy        → EddyBrake         (a solid plate, and why slots barely brake)
 *   inductance  → InductanceBench   (self and mutual: opposition to the CHANGE)
 *   generator   → GeneratorBench    (the loop that makes AC — the bridge out)
 *
 * ── HOW TO REACH THIS FROM A PAGE ───────────────────────────────────────────
 * `FieldBenchBlock.mode` is frozen at sculptor | gauss | trajectory |
 * photoelectric, so a `field_bench` block cannot yet route here. Two lines fix
 * it, and they are outside this folder's ownership:
 *
 *   1. add `'emi'` to `FieldBenchBlock['mode']` (packages/data/types/books.ts and
 *      its Zod union in packages/data/books/schemas.ts) and to
 *      `FieldArchetype['mode']` (field-bench/types.ts);
 *   2. add `case 'emi': return <EmiBench block={block} />;` to
 *      field-bench/FieldBench.tsx, and register `EMI_ARCHETYPES` in
 *      field-bench/archetypes.ts's merge list.
 *
 * Until then the routing key is `EMI_VIEW`, keyed on `block.archetype`, which is
 * what this component switches on — so nothing here depends on the new mode
 * existing, and adding it changes no behaviour.
 *
 * An unknown archetype degrades to a named card rather than throwing. Blocks are
 * Mixed-stored and hand-editable, and a page that blanks out is far harder to
 * diagnose than one that says what it could not render.
 */

import type { FieldBenchBlock } from '@canvas/data/types/books';
import { BORDER, SIM_SURFACE, TEXT, TYPE } from '../../simulations/_shared';
import { EMI_ARCHETYPES, EMI_VIEW } from '../archetypes.emi';
import FluxMachine from './FluxMachine';
import MotionalEmf from './MotionalEmf';
import EddyBrake from './EddyBrake';
import InductanceBench from './InductanceBench';
import GeneratorBench from './GeneratorBench';

export default function EmiBench({ block }: { block: FieldBenchBlock }) {
  const id = block.archetype ?? 'flux-machine';
  const view = EMI_VIEW[id];

  if (!view || !EMI_ARCHETYPES[id]) {
    return (
      <div className="rounded-xl border p-4" style={{ background: SIM_SURFACE, borderColor: BORDER.card }}>
        <p className={TYPE.badge} style={{ color: TEXT.ghost }}>EMI bench</p>
        <p className={TYPE.body} style={{ color: TEXT.secondary }}>
          {`No EMI exercise is called "${id}". Pick one of: `
            + `${Object.keys(EMI_VIEW).join(', ')}.`}
        </p>
      </div>
    );
  }

  switch (view) {
    case 'flux': return <FluxMachine block={block} archetypeId={id} />;
    case 'motional': return <MotionalEmf block={block} archetypeId={id} />;
    case 'eddy': return <EddyBrake block={block} archetypeId={id} />;
    case 'inductance': return <InductanceBench block={block} archetypeId={id} />;
    case 'generator': return <GeneratorBench block={block} archetypeId={id} />;
    default: return <FluxMachine block={block} archetypeId="flux-machine" />;
  }
}
