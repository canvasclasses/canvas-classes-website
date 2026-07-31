'use client';

/*
 * motion-lab/graphs/GraphsLab.tsx — the Unit-1 graphs switchboard.
 * ─────────────────────────────────────────────────────────────────────────────
 * Three benches, sixteen archetypes, one entry point. Sibling of `WavesLab.tsx`
 * and `ThermoLab.tsx`, and it dispatches the same way and for the same reason.
 *
 * ── WHY THIS DISPATCHES ON THE ARCHETYPE, NOT ON `block.scenario` ────────────
 * `MotionLab.tsx` routes on `block.scenario`, whose union (`MotionScenarioId`) is
 * part of the frozen E2 contract. It has exactly one slot for everything in this
 * module — `'graphs'` — and that slot is currently shared with the Phase-2 waves
 * and thermo libraries, which chose it for the same reason. So each archetype
 * names its own bench in `sim` and this file picks between three.
 *
 * ── WIRING THIS UP IS NOT THIS AGENT'S CHANGE ───────────────────────────────
 * `MotionLab.tsx` still routes `scenario: 'graphs'` to a "not built yet"
 * placeholder card, and `MOTION_ARCHETYPES` in `archetypes.ts` merges only the
 * projectile and circular maps. Both are outside the files this build owns, and
 * the routing decision is not a mechanical one — three libraries now want the
 * same scenario id, so `MotionLab.tsx` has to disambiguate on the ARCHETYPE
 * rather than on the scenario, or `MotionScenarioId` needs `'graphs-1d'`,
 * `'waves'` and `'thermo'` added to it. That is reported rather than assumed.
 *
 * Nothing authored needs changing when it lands: the archetype id is what a page
 * stores, and every id here is already final.
 */

import type { MotionBenchBlock } from '@canvas/data/types/books';
import { graphsArchetype } from '../archetypes.graphs';
import GraphStudio from './GraphStudio';
import MatchTheMotion from './MatchTheMotion';
import RelativeDeck from './RelativeDeck';
import { Unknown } from './panels';

export default function GraphsLab({ block }: { block: MotionBenchBlock }) {
  const arch = graphsArchetype(block.archetype);

  if (!arch) {
    return (
      <Unknown
        title="Motion graphs"
        body={`No graphs archetype named “${String(block.archetype ?? '')}”. Pick one in the editor — the id is what the page stores, so a typo shows up here rather than as a blank card.`}
      />
    );
  }

  switch (arch.sim) {
    case 'graph-studio':     return <GraphStudio block={block} arch={arch} />;
    case 'match-the-motion': return <MatchTheMotion block={block} arch={arch} />;
    case 'relative-deck':    return <RelativeDeck block={block} arch={arch} />;
    default:
      return (
        <Unknown
          title={arch.title}
          body={`The “${String(arch.sim)}” bench is not built yet. This block is authored and will render as soon as it ships — nothing needs re-authoring.`}
        />
      );
  }
}
