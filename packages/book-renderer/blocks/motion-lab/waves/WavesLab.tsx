'use client';

/*
 * motion-lab/waves/WavesLab.tsx — the unit-8 switchboard.
 * ─────────────────────────────────────────────────────────────────────────────
 * Four benches, twelve archetypes, one entry point.
 *
 * ── WHY THIS DISPATCHES ON THE ARCHETYPE, NOT ON `block.scenario` ────────────
 * `MotionLab.tsx` routes on `block.scenario`, whose union
 * (`MotionScenarioId`) is part of the frozen E2 contract and has no member for
 * waves. Phase 2 therefore authors under the engine's existing `'graphs'` id
 * and each archetype names its own bench in `sim`.
 *
 * That is a deliberate stopgap, not a design: the build report asks for a
 * `'waves'` (and `'thermo'`) scenario on `MotionScenarioId`, after which
 * `MotionLab.tsx` gains two cases pointing here and at `ThermoLab`, and this
 * file's job shrinks to what it should be — picking between four benches.
 * Nothing authored needs changing when that lands, because the archetype id is
 * what a page stores.
 */

import type { MotionBenchBlock } from '@canvas/data/types/books';
import { wavesArchetype } from '../archetypes.waves';
import ShmBench from './ShmBench';
import WaveStudio from './WaveStudio';
import DopplerBench from './DopplerBench';
import ResonanceRig from './ResonanceRig';
import { Unknown } from './ui';

export default function WavesLab({ block }: { block: MotionBenchBlock }) {
  const arch = wavesArchetype(block.archetype);

  if (!arch) {
    return (
      <Unknown
        title="Oscillations & waves"
        body={`No waves archetype named “${String(block.archetype ?? '')}”. Pick one in the editor — the id is what the page stores, so a typo shows up here rather than as a blank card.`}
      />
    );
  }

  switch (arch.sim) {
    case 'shm-bench':     return <ShmBench block={block} arch={arch} />;
    case 'wave-studio':   return <WaveStudio block={block} arch={arch} />;
    case 'doppler-bench': return <DopplerBench block={block} arch={arch} />;
    case 'resonance-rig': return <ResonanceRig block={block} arch={arch} />;
    default:
      return (
        <Unknown
          title={arch.title}
          body={`The “${String(arch.sim)}” bench is not built yet. This block is authored and will render as soon as it ships — nothing needs re-authoring.`}
        />
      );
  }
}
