'use client';

/*
 * motion-lab/thermo/ThermoLab.tsx — the units-6-and-7 switchboard.
 * ─────────────────────────────────────────────────────────────────────────────
 * Five benches, twelve archetypes, one entry point. Sibling of `WavesLab.tsx`,
 * and the same stopgap applies: `MotionLab.tsx` routes on `block.scenario`,
 * whose union is part of the frozen E2 contract and has no member for
 * thermodynamics, so Phase 2 authors under the engine's existing `'graphs'` id
 * and each archetype names its own bench in `sim`.
 *
 * The build report asks for a `'thermo'` scenario. When it lands, `MotionLab`
 * gains one case pointing here and nothing authored has to change — the
 * archetype id is what a page stores.
 */

import type { MotionBenchBlock } from '@canvas/data/types/books';
import { thermoArchetype } from '../archetypes.thermo';
import PvWorkbench from './PvWorkbench';
import HeatEngineBench from './HeatEngineBench';
import MolecularChamber from './MolecularChamber';
import FluidBench from './FluidBench';
import BuoyancyLab from './BuoyancyLab';
import { Unknown } from '../waves/ui';

export default function ThermoLab({ block }: { block: MotionBenchBlock }) {
  const arch = thermoArchetype(block.archetype);

  if (!arch) {
    return (
      <Unknown
        title="Heat, gases & fluids"
        body={`No thermo archetype named “${String(block.archetype ?? '')}”. Pick one in the editor — the id is what the page stores, so a typo shows up here rather than as a blank card.`}
      />
    );
  }

  switch (arch.sim) {
    case 'pv-workbench':      return <PvWorkbench block={block} arch={arch} />;
    case 'heat-engine':       return <HeatEngineBench block={block} arch={arch} />;
    case 'molecular-chamber': return <MolecularChamber block={block} arch={arch} />;
    case 'fluid-bench':       return <FluidBench block={block} arch={arch} />;
    case 'buoyancy-lab':      return <BuoyancyLab block={block} arch={arch} />;
    default:
      return (
        <Unknown
          title={arch.title}
          body={`The “${String(arch.sim)}” bench is not built yet. This block is authored and will render as soon as it ships — nothing needs re-authoring.`}
        />
      );
  }
}
