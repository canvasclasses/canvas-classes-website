/*
 * field-bench/archetypes.ts — the E5 archetype BARREL.
 * ─────────────────────────────────────────────────────────────────────────────
 * The engine ships once as code; every electrostatics / Gauss / magnetism /
 * gravitation / photoelectric exercise on every page is a `field_bench` block
 * naming ONE id from this map plus params
 * (PHYSICS_SIMULATION_PROGRAM.md §3). This file is the index those ids resolve
 * through — the same shape as `motion-lab/archetypes.ts`, deliberately.
 *
 * WHY THE MERGE THROWS. Archetype ids are stored on saved book pages. A silent
 * spread-overwrite of a duplicate id would re-point already-authored exercises
 * at a different construction with no error and no type failure — invisible
 * until a student sees the wrong scene. Fail loudly at module load instead.
 *
 * Pure — no React, no DOM.
 */

import type { FieldArchetype, FieldMisconception } from './types';
import { ELECTROSTATIC_ARCHETYPES } from './archetypes.electrostatic';
import { GAUSS_ARCHETYPES } from './archetypes.gauss';
import { MAGNETIC_ARCHETYPES } from './archetypes.magnetic';
import { GRAVITATION_ARCHETYPES } from './archetypes.gravitation';
import { MODERN_ARCHETYPES } from './archetypes.modern';
import { EMI_ARCHETYPES } from './archetypes.emi';

export type FieldArchetypeMap = Record<string, FieldArchetype>;

function mergeArchetypes(sources: { from: string; map: FieldArchetypeMap }[]): FieldArchetypeMap {
  const merged: FieldArchetypeMap = {};
  const definedIn: Record<string, string> = {};

  for (const source of sources) {
    for (const [id, archetype] of Object.entries(source.map)) {
      if (definedIn[id]) {
        throw new Error(
          `field-bench: duplicate archetype id "${id}" — defined in both `
          + `${definedIn[id]} and ${source.from}. Archetype ids are stored on `
          + `saved book pages, so a silent overwrite would re-point already-`
          + `authored exercises at a different scene. Rename one of them.`,
        );
      }
      definedIn[id] = source.from;
      merged[id] = archetype;
    }
  }

  return merged;
}

/** Every E5 construction, keyed by its authoring id. */
export const FIELD_ARCHETYPES: FieldArchetypeMap = mergeArchetypes([
  { from: 'archetypes.electrostatic.ts', map: ELECTROSTATIC_ARCHETYPES },
  { from: 'archetypes.gauss.ts', map: GAUSS_ARCHETYPES },
  { from: 'archetypes.magnetic.ts', map: MAGNETIC_ARCHETYPES },
  { from: 'archetypes.gravitation.ts', map: GRAVITATION_ARCHETYPES },
  { from: 'archetypes.modern.ts', map: MODERN_ARCHETYPES },
  { from: 'archetypes.emi.ts', map: EMI_ARCHETYPES },
]);

/** Stable presentation order for a picker — the teaching order, not
 *  alphabetical: build the field, then Gauss, then magnetism, then gravitation,
 *  then the photon. */
export const FIELD_ARCHETYPE_ORDER: string[] = [
  'single-charge', 'dipole', 'two-like-charges', 'equipotentials',
  'charge-released-from-rest', 'charge-with-sideways-velocity',
  'gauss-sphere', 'gauss-drag-me', 'gauss-off-centre', 'conductor-cavity',
  'uniform-B-circular', 'velocity-selector', 'cyclotron',
  'g-inside-earth', 'orbit-sandbox',
  'photoelectric',
];

/** Lookup helper. Returns undefined for an unknown or absent id. */
export function getFieldArchetype(id?: string): FieldArchetype | undefined {
  return id ? FIELD_ARCHETYPES[id] : undefined;
}

/** What the admin picker needs — metadata only, readable without running
 *  `build()`. `params` is what the editor turns into form inputs, so no form is
 *  ever hardcoded per archetype. */
export interface FieldArchetypeSummary {
  id: string;
  title: string;
  summary: string;
  mode: FieldArchetype['mode'];
  kind: NonNullable<FieldArchetype['kind']>;
  params: NonNullable<FieldArchetype['params']>;
  stepped: boolean;
  stepCount: number;
  targets?: FieldMisconception;
}

export const FIELD_ARCHETYPE_CATALOG: FieldArchetypeSummary[] =
  FIELD_ARCHETYPE_ORDER
    .map((id) => FIELD_ARCHETYPES[id])
    .filter((a): a is FieldArchetype => !!a)
    .map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      mode: a.mode,
      kind: a.kind ?? 'electric',
      params: a.params ?? [],
      stepped: !!a.defaultSteps?.length,
      stepCount: a.defaultSteps?.length ?? 0,
      ...(a.targets ? { targets: a.targets } : {}),
    }));
