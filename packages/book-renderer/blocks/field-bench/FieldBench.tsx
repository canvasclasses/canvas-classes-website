'use client';

/*
 * FieldBench.tsx — the E5 mode switchboard.
 * ─────────────────────────────────────────────────────────────────────────────
 * One block type, sixteen authored archetypes, four modes. This file owns
 * nothing but the routing decision.
 *
 *   sculptor · gauss · trajectory
 *        → FieldLab. All three are the same scene graph — sources, a sampled
 *          field, an optional closed surface, optional integrated paths — with
 *          different panels over it, which is exactly why they are one
 *          component and not three.
 *   photoelectric
 *        → PhotoelectricBench. No field to sample; its physics is a photon
 *          count and an energy balance, so it gets its own view.
 *
 * A block carrying an unknown mode degrades to a named card rather than
 * throwing: blocks are Mixed-stored and hand-editable, and a page that blanks
 * out is far harder to diagnose than one that says what it could not render.
 *
 * See _agents/plans/PHYSICS_SIMULATION_PROGRAM.md §4, units 9, 11 and 13.
 */

import type { FieldBenchBlock } from '@canvas/data/types/books';
import { SIM_SURFACE, TEXT, BORDER, TYPE } from '../simulations/_shared';
import FieldLab from './FieldLab';
import PhotoelectricBench from './PhotoelectricBench';
import EmiBench from './emi/EmiBench';
import NuclearBench, { isNuclearArchetype } from './nuclear/NuclearBench';

export default function FieldBench({ block }: { block: FieldBenchBlock }) {
  // Nuclear routes on the ARCHETYPE ID, not on a `mode`. Same call as AC on the
  // circuit engine: a nuclear bench is not a static-field sculpt, a Gauss
  // surface, a trajectory or a photoemission curve, and inventing a fifth mode
  // would mean touching packages/data + Zod + the admin editor for a
  // discriminator the archetype id already carries uniquely. Ids are asserted
  // disjoint by verify-modern-physics.mjs.
  if (isNuclearArchetype(block.archetype)) return <NuclearBench block={block} />;

  switch (block.mode) {
    case 'sculptor':
    case 'gauss':
    case 'trajectory':
      return <FieldLab block={block} />;

    case 'photoelectric':
      return <PhotoelectricBench block={block} />;

    // Induction. Its own mode rather than a fifth guest on 'gauss': ten of the
    // twelve rungs do drag a closed loop through a field and read the flux, so
    // 'gauss' was the closest TRUE statement while the union lacked this — but
    // Faraday is not Gauss, and the dispatch key belongs in the type, not in a
    // side-channel field on the archetype.
    case 'emi':
      return <EmiBench block={block} />;

    default:
      return (
        <div className="rounded-xl border p-4" style={{ background: SIM_SURFACE, borderColor: BORDER.card }}>
          <p className={TYPE.badge} style={{ color: TEXT.ghost }}>Field bench</p>
          <p className={TYPE.body} style={{ color: TEXT.secondary }}>
            {`Unknown mode "${String((block as FieldBenchBlock).mode)}". Pick sculptor, gauss, trajectory or photoelectric in the editor.`}
          </p>
        </div>
      );
  }
}
