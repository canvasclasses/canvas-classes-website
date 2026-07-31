'use client';

/*
 * OpticsBench.tsx — the E4 switchboard.
 * ─────────────────────────────────────────────────────────────────────────────
 * One block type, three surfaces, one engine behind all of them. This file owns
 * nothing but the routing decision.
 *
 *   bench      → OpticalBench. Lenses, mirrors, slabs, fibres, prisms — a real
 *                surface-by-surface trace with the paraxial formula printed
 *                beside it so the student can see where they part company.
 *   assembler  → InstrumentAssembler. The §6 arc: lens → camera → eye → myopia
 *                → spectacles → microscope → telescope → binoculars, with the
 *                instrument RECOGNISED from the structure rather than declared.
 *   wave       → WaveBench. Young's slits and single-slit diffraction, computed
 *                from path difference. Deliberately not traced: rays have no
 *                phase, and pretending otherwise teaches that diffraction is a
 *                kind of refraction.
 *
 * The mode comes from the block, and the archetype's own mode wins when they
 * disagree — a page that names `microscope` with `mode: 'bench'` is an
 * authoring slip, and rendering the microscope in the bench UI would silently
 * drop the entire assembler. See PHYSICS_SIMULATION_PROGRAM.md §6.
 */

import * as React from 'react';
import type { OpticsBenchBlock } from '@canvas/data/types/books';
import { getOpticsArchetype } from './archetypes';
import { SIM_SURFACE, TEXT, BORDER, TYPE } from '../simulations/_shared';
import OpticalBench from './bench/OpticalBench';
import InstrumentAssembler from './assembler/InstrumentAssembler';
import WaveBench from './wave/WaveBench';

export default function OpticsBench({ block }: { block: OpticsBenchBlock }) {
  // The archetype knows what kind of thing it is. If the block's `mode` and the
  // archetype's disagree, trust the archetype: it is the one that built the
  // bench, and a mismatched mode would render a microscope with no eyepiece
  // controls and no recognition at all.
  const arch = getOpticsArchetype(block.archetype);
  const mode = arch?.mode ?? block.mode;

  switch (mode) {
    case 'assembler':
      return <InstrumentAssembler block={block} />;
    case 'wave':
      return <WaveBench block={block} />;
    case 'bench':
      return <OpticalBench block={block} />;
    default:
      // Blocks are Mixed-stored, so a hand-edited page can carry an unknown
      // mode string. Name it instead of rendering nothing.
      return (
        <div className="rounded-xl border p-4" style={{ background: SIM_SURFACE, borderColor: BORDER.card }}>
          <p className={TYPE.badge} style={{ color: TEXT.ghost }}>Optics bench</p>
          <p className={TYPE.body} style={{ color: TEXT.secondary }}>
            {`Unknown mode "${String(mode)}". Pick bench, assembler or wave in the editor.`}
          </p>
        </div>
      );
  }
}
