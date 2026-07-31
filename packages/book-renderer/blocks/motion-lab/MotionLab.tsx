'use client';

// MotionLab.tsx — the E2 scenario switchboard.
// ─────────────────────────────────────────────────────────────────────────────
// One block type, eight authored scenarios, two engines behind them. This file
// owns nothing but the routing decision.
//
//   projectile · projectile-incline · monkey-hunter · relative
//        → ProjectilePlayground. All four are the same integrator with a
//          different launch, target and frame — which is exactly why they are
//          one component and not four.
//   circular · vertical-circle · banked-road
//        → CircularArena. Same constraint solver, different agent supplying
//          the centripetal force.
//   graphs
//        → THREE libraries, resolved by archetype id (see below).
//
// ── WHY 'graphs' ROUTES BY ARCHETYPE ID (2026-07-30) ─────────────────────────
// Three Phase-2/3 libraries independently chose `scenario: 'graphs'` — Motion
// Graphs (16 archetypes), Waves (12) and Thermo (12) — because it was the only
// value in the frozen `MotionScenario` union that fitted a "plot something over
// time" bench. That left 40 archetypes pointing at one placeholder.
//
// The alternative was widening `MotionScenario` with 'graphs-1d' | 'waves' |
// 'thermo'. Rejected: `scenario` is a persisted field on every authored block,
// so widening it means every one of those 40 archetypes must change its declared
// scenario AND any page already authored against them silently stops resolving.
// The archetype id is ALSO persisted, is already unique across all libraries
// (asserted in verify-graphs.mjs), and is the thing an author actually picks. So
// the id is the honest discriminator and nothing needs re-authoring.
//
// Lookup order is fixed and the maps are disjoint. An id in none of them falls
// through to a named placeholder rather than blanking the page.
//
// See _agents/plans/PHYSICS_SIMULATION_PROGRAM.md §5.3–5.4 and §4 units 1, 6, 7.

import type { MotionBenchBlock } from '@canvas/data/types/books';
import { SIM_SURFACE, TEXT, BORDER, TYPE } from '../simulations/_shared';
import ProjectilePlayground from './projectile/ProjectilePlayground';
import CircularArena from './circular/CircularArena';
import GraphsLab from './graphs/GraphsLab';
import WavesLab from './waves/WavesLab';
import ThermoLab from './thermo/ThermoLab';
import { GRAPHS_ARCHETYPES } from './archetypes.graphs';
import { WAVES_ARCHETYPES } from './archetypes.waves';
import { THERMO_ARCHETYPES } from './archetypes.thermo';

export default function MotionLab({ block }: { block: MotionBenchBlock }) {
  switch (block.scenario) {
    case 'projectile':
    case 'projectile-incline':
    case 'monkey-hunter':
    case 'relative':
      return <ProjectilePlayground block={block} />;

    case 'circular':
    case 'vertical-circle':
    case 'banked-road':
      return <CircularArena block={block} />;

    case 'graphs': {
      const id = block.archetype ?? '';
      if (id in GRAPHS_ARCHETYPES) return <GraphsLab block={block} />;
      if (id in WAVES_ARCHETYPES) return <WavesLab block={block} />;
      if (id in THERMO_ARCHETYPES) return <ThermoLab block={block} />;
      return (
        <Placeholder
          title="Motion lab"
          body={
            id
              ? `No library owns the archetype "${id}". Pick one in the editor — the graphs scenario is shared by the Motion Graph Studio, Wave Studio and PV Workbench, and the archetype is what selects between them.`
              : 'This block has no archetype set. The graphs scenario is shared by three libraries, so the archetype is what decides which one renders.'
          }
        />
      );
    }

    default:
      // Blocks are Mixed-stored, so a hand-edited page can carry an unknown
      // scenario string. Name it instead of rendering nothing.
      return (
        <Placeholder
          title="Motion lab"
          body={`Unknown scenario "${String((block as MotionBenchBlock).scenario)}". Pick one in the editor.`}
        />
      );
  }
}

function Placeholder({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: SIM_SURFACE, borderColor: BORDER.card }}
    >
      <p className={TYPE.badge} style={{ color: TEXT.ghost }}>
        {title}
      </p>
      <p className={TYPE.body} style={{ color: TEXT.secondary }}>
        {body}
      </p>
    </div>
  );
}
