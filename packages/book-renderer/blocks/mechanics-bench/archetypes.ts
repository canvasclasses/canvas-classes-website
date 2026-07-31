/*
 * mechanics-bench/archetypes.ts — the E1 archetype BARREL.
 * ─────────────────────────────────────────────────────────────────────────────
 * The engine ships once as code; every FBD / pulley / incline exercise on every
 * page is a `mechanics_bench` block naming ONE archetype id plus params. That
 * makes this file the authoring contract's index: the admin picker, the block's
 * `archetype` field and the runtime scene build all resolve through here.
 *
 * The constructions themselves live in the two source maps —
 * `archetypes.fbd.ts` (FBD Studio) and `archetypes.pulley.ts` (Pulley Lab) —
 * so each stays a focused, node-verifiable, pure module. This file only merges
 * them and exposes the two lookups everything else needs.
 *
 * WHY THE MERGE THROWS. An archetype id is a stable authoring handle: it is
 * stored on saved book pages. If both source maps ever defined the same id, a
 * silent object-spread overwrite would quietly re-point every page already
 * authored against it at a different construction — a content bug with no
 * error, no type failure and no visible symptom until a student sees the wrong
 * scene. Failing loudly at module load is the cheap version of that bug.
 *
 * Pure — no React, no DOM. See _agents/plans/PHYSICS_SIMULATION_PROGRAM.md §3.
 */

import type { MechanicsArchetype } from './types';
import { FBD_ARCHETYPES } from './archetypes.fbd';
import { PULLEY_ARCHETYPES } from './archetypes.pulley';

export type MechanicsArchetypeMap = Record<string, MechanicsArchetype>;

function mergeArchetypes(
  sources: { from: string; map: MechanicsArchetypeMap }[]
): MechanicsArchetypeMap {
  const merged: MechanicsArchetypeMap = {};
  const definedIn: Record<string, string> = {};

  for (const source of sources) {
    for (const [id, archetype] of Object.entries(source.map)) {
      if (definedIn[id]) {
        throw new Error(
          `mechanics-bench: duplicate archetype id "${id}" — defined in both ` +
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

/** Every E1 construction, keyed by its authoring id. */
export const MECHANICS_ARCHETYPES: MechanicsArchetypeMap = mergeArchetypes([
  { from: 'archetypes.fbd.ts', map: FBD_ARCHETYPES },
  { from: 'archetypes.pulley.ts', map: PULLEY_ARCHETYPES },
]);

/** Lookup helper. Returns undefined for an unknown or absent id — the caller
 *  decides whether that is an authoring mistake or just an unset field. */
export function getMechanicsArchetype(id?: string): MechanicsArchetype | undefined {
  return id ? MECHANICS_ARCHETYPES[id] : undefined;
}

/** What the admin picker needs — metadata only, no engine internals. The
 *  `params` array is what the editor turns into form inputs, which is why the
 *  editor never hardcodes a form per archetype. */
export interface MechanicsArchetypeSummary {
  id: string;
  title: string;
  summary: string;
  mode: MechanicsArchetype['mode'];
  params: NonNullable<MechanicsArchetype['params']>;
  stepped: boolean;
  stepCount: number;
  defaultBody?: string;
}

export const MECHANICS_ARCHETYPE_CATALOG: MechanicsArchetypeSummary[] = Object.values(
  MECHANICS_ARCHETYPES
).map((a) => ({
  id: a.id,
  title: a.title,
  summary: a.summary,
  mode: a.mode,
  params: a.params ?? [],
  stepped: !!a.defaultSteps?.length,
  stepCount: a.defaultSteps?.length ?? 0,
  defaultBody: a.defaultBody,
}));
