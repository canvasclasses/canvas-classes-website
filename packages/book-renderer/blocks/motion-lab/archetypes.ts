/*
 * motion-lab/archetypes.ts — the E2 archetype BARREL.
 * ─────────────────────────────────────────────────────────────────────────────
 * Sibling of mechanics-bench/archetypes.ts, for the same reason: the E2 engine
 * ships once as code, and every projectile / circular-motion / relative-motion
 * exercise on every page is a `motion_lab` block naming ONE archetype id plus
 * params. This file is the index those ids resolve through.
 *
 * The constructions live in `archetypes.projectile.ts` and
 * `archetypes.circular.ts` so each stays a focused, pure, node-verifiable
 * module. This file only merges them and exposes the lookups.
 *
 * WHY THE MERGE THROWS. Archetype ids are stored on saved book pages. A silent
 * spread-overwrite of a duplicate id would re-point already-authored exercises
 * at a different construction with no error and no type failure — invisible
 * until a student sees the wrong scene. Fail loudly at module load instead.
 *
 * Pure — no React, no DOM. See _agents/plans/PHYSICS_SIMULATION_PROGRAM.md §3.
 */

import type { MotionArchetype } from './types';
import { PROJECTILE_ARCHETYPES } from './archetypes.projectile';
import { CIRCULAR_ARCHETYPES } from './archetypes.circular';
import { GRAPHS_ARCHETYPES } from './archetypes.graphs';
import { WAVES_ARCHETYPES } from './archetypes.waves';
import { THERMO_ARCHETYPES } from './archetypes.thermo';

export type MotionArchetypeMap = Record<string, MotionArchetype>;

function mergeArchetypes(
  sources: { from: string; map: MotionArchetypeMap }[]
): MotionArchetypeMap {
  const merged: MotionArchetypeMap = {};
  const definedIn: Record<string, string> = {};

  for (const source of sources) {
    for (const [id, archetype] of Object.entries(source.map)) {
      if (definedIn[id]) {
        throw new Error(
          `motion-lab: duplicate archetype id "${id}" — defined in both ` +
            `${definedIn[id]} and ${source.from}. Archetype ids are stored on ` +
            `saved book pages, so a silent overwrite would re-point already-` +
            `authored exercises at a different scene. Rename one of them.`
        );
      }
      definedIn[id] = source.from;
      merged[id] = archetype;
    }
  }

  return merged;
}

/** Every E2 construction, keyed by its authoring id. */
// All five E2 libraries. Graphs, Waves and Thermo all declare
// `scenario: 'graphs'` and are told apart by archetype id — see the routing note
// in MotionLab.tsx. `mergeArchetypes` throws on a duplicate id across sources,
// which is exactly the guard that makes id-based routing safe: three libraries
// sharing one scenario value can only work if their ids are provably disjoint.
export const MOTION_ARCHETYPES: MotionArchetypeMap = mergeArchetypes([
  { from: 'archetypes.projectile.ts', map: PROJECTILE_ARCHETYPES },
  { from: 'archetypes.circular.ts', map: CIRCULAR_ARCHETYPES },
  { from: 'archetypes.graphs.ts', map: GRAPHS_ARCHETYPES },
  { from: 'archetypes.waves.ts', map: WAVES_ARCHETYPES },
  { from: 'archetypes.thermo.ts', map: THERMO_ARCHETYPES },
]);

/** Lookup helper. Returns undefined for an unknown or absent id. */
export function getMotionArchetype(id?: string): MotionArchetype | undefined {
  return id ? MOTION_ARCHETYPES[id] : undefined;
}

/** What the admin picker needs — metadata only. `params` is what the editor
 *  turns into form inputs, so no form is ever hardcoded per archetype. */
export interface MotionArchetypeSummary {
  id: string;
  title: string;
  summary: string;
  scenario: MotionArchetype['scenario'];
  params: NonNullable<MotionArchetype['params']>;
  stepped: boolean;
  stepCount: number;
  targets?: MotionArchetype['targets'];
}

export const MOTION_ARCHETYPE_CATALOG: MotionArchetypeSummary[] = Object.values(
  MOTION_ARCHETYPES
).map((a) => ({
  id: a.id,
  title: a.title,
  summary: a.summary,
  scenario: a.scenario,
  params: a.params ?? [],
  stepped: !!a.defaultSteps?.length,
  stepCount: a.defaultSteps?.length ?? 0,
  targets: a.targets,
}));
