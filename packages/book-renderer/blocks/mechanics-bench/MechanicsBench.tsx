'use client';

// MechanicsBench.tsx — the E1 mode switchboard.
// ─────────────────────────────────────────────────────────────────────────────
// One block type, three interaction modes. This file owns nothing but the
// routing decision; all the physics, drawing and grading lives in the two
// studios it delegates to.
//
//   'fbd'    → FbdStudio — draw the free-body diagram, every arrow's agent named.
//   'solve'  → FbdStudio with the solve step switched on: once the FBD is
//              correct, the axis choice and the ΣF = ma lines are revealed.
//              Same tool, one stage further — NOT a separate studio, because
//              the whole point is that solving is what the FBD was FOR.
//   'pulley' → PulleyLab — predict, run, then see the constraint equation
//              derived from the string-length ledger.
//
// See _agents/plans/PHYSICS_SIMULATION_PROGRAM.md §5.1–5.2.

import type { MechanicsBenchBlock } from '@canvas/data/types/books';
import { SIM_SURFACE, TEXT, BORDER, TYPE } from '../simulations/_shared';
import FbdStudio from './fbd/FbdStudio';
import PulleyLab from './pulley/PulleyLab';

export default function MechanicsBench({ block }: { block: MechanicsBenchBlock }) {
  switch (block.mode) {
    case 'pulley':
      return <PulleyLab block={block} />;

    case 'solve':
      // Turn on the solve stage without inventing an fbd task the author never
      // wrote. When `fbd` is absent the studio falls back to the archetype's
      // `defaultBody`, so passing the block through untouched is correct —
      // and never writes a key the Zod schema would reject.
      return (
        <FbdStudio
          block={
            block.fbd ? { ...block, fbd: { ...block.fbd, then_solve: true } } : block
          }
        />
      );

    case 'fbd':
      return <FbdStudio block={block} />;

    default:
      // `mode` is a three-way union, but blocks are Mixed-stored in Mongo, so a
      // hand-edited or partially-migrated page can still arrive with junk here.
      // Say so plainly rather than rendering nothing.
      return <UnknownMode mode={String((block as MechanicsBenchBlock).mode)} />;
  }
}

function UnknownMode({ mode }: { mode: string }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: SIM_SURFACE, borderColor: BORDER.card }}
    >
      <p className={TYPE.badge} style={{ color: TEXT.ghost }}>
        Mechanics bench
      </p>
      <p className={TYPE.body} style={{ color: TEXT.secondary }}>
        Unknown mode <code>{mode}</code>. Pick <code>fbd</code>, <code>pulley</code> or{' '}
        <code>solve</code> in the editor.
      </p>
    </div>
  );
}
