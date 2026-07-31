/*
 * optics-bench/archetypes.ts — the E4 archetype BARREL.
 * ─────────────────────────────────────────────────────────────────────────────
 * The engine ships once as code; every optics exercise on every page is an
 * `optics_bench` block naming ONE archetype id plus params. This file is the
 * index those ids resolve through.
 *
 * WHY THE MERGE THROWS. Archetype ids are stored on saved book pages. A silent
 * spread-overwrite of a duplicate id would re-point an already-authored
 * exercise at a different construction, with no error and no type failure —
 * invisible until a student sees the wrong scene. Fail loudly at module load.
 *
 * Pure — no React, no DOM. See _agents/plans/PHYSICS_SIMULATION_PROGRAM.md §3
 * for the engine/archetype split and §6 for the Instrument Assembler arc.
 */

import type { OpticsArchetype } from './types';
import {
  BENCH_ARCHETYPES, BENCH_ARCHETYPE_ORDER,
  type OpticsArchetypeEx, type OpticsArchetypeMap, type MisconceptionProbe,
} from './archetypes.bench';
import { INSTRUMENT_ARCHETYPES, INSTRUMENT_ARCHETYPE_ORDER } from './archetypes.instruments';
import { WAVE_ARCHETYPES, WAVE_ARCHETYPE_ORDER } from './archetypes.wave';

export type { OpticsArchetypeEx, OpticsArchetypeMap, MisconceptionProbe };

function mergeArchetypes(sources: { from: string; map: OpticsArchetypeMap }[]): OpticsArchetypeMap {
  const merged: OpticsArchetypeMap = {};
  const definedIn: Record<string, string> = {};
  for (const source of sources) {
    for (const [id, archetype] of Object.entries(source.map)) {
      if (definedIn[id]) {
        throw new Error(
          `optics-bench: duplicate archetype id "${id}" — defined in both `
          + `${definedIn[id]} and ${source.from}. Archetype ids are stored on saved `
          + `book pages, so a silent overwrite would re-point already-authored `
          + `exercises at a different scene. Rename one of them.`,
        );
      }
      definedIn[id] = source.from;
      merged[id] = archetype;
    }
  }
  return merged;
}

/** Every E4 construction, keyed by its authoring id. */
export const OPTICS_ARCHETYPES: OpticsArchetypeMap = mergeArchetypes([
  { from: 'archetypes.bench.ts', map: BENCH_ARCHETYPES },
  { from: 'archetypes.instruments.ts', map: INSTRUMENT_ARCHETYPES },
  { from: 'archetypes.wave.ts', map: WAVE_ARCHETYPES },
]);

/** Authoring order — bench fundamentals, then the assembler arc, then waves. */
export const OPTICS_ARCHETYPE_ORDER: string[] = [
  ...BENCH_ARCHETYPE_ORDER,
  ...INSTRUMENT_ARCHETYPE_ORDER,
  ...WAVE_ARCHETYPE_ORDER,
];

export const DEFAULT_OPTICS_ARCHETYPE = 'converging-lens';

/** Lookup. Returns undefined for an unknown or absent id. */
export function getOpticsArchetype(id?: string): OpticsArchetypeEx | undefined {
  return id ? OPTICS_ARCHETYPES[id] : undefined;
}

/** Resolve a block's archetype, falling back to the mode's natural default so a
 *  hand-edited page with a typo still renders something honest. */
export function resolveArchetype(
  id: string | undefined,
  mode: OpticsArchetype['mode'],
): OpticsArchetypeEx {
  const found = getOpticsArchetype(id);
  if (found) return found;
  const fallback = mode === 'assembler' ? 'camera' : mode === 'wave' ? 'ydse' : DEFAULT_OPTICS_ARCHETYPE;
  return OPTICS_ARCHETYPES[fallback];
}

/** Default params for an archetype — every declared param at its default. */
export function defaultParams(a: OpticsArchetypeEx): Record<string, number | string | boolean> {
  const out: Record<string, number | string | boolean> = {};
  for (const p of a.params ?? []) out[p.key] = p.default;
  return out;
}

/** What the admin picker needs — metadata only. `params` is what the editor
 *  turns into form inputs, so no form is ever hardcoded per archetype. */
export interface OpticsArchetypeSummary {
  id: string;
  title: string;
  summary: string;
  mode: OpticsArchetype['mode'];
  params: NonNullable<OpticsArchetype['params']>;
  stepped: boolean;
  stepCount: number;
  targets?: OpticsArchetype['targets'];
  probed: boolean;
}

export const OPTICS_ARCHETYPE_CATALOG: OpticsArchetypeSummary[] = OPTICS_ARCHETYPE_ORDER
  .map((id) => OPTICS_ARCHETYPES[id])
  .filter(Boolean)
  .map((a) => ({
    id: a.id,
    title: a.title,
    summary: a.summary,
    mode: a.mode,
    params: a.params ?? [],
    stepped: !!a.defaultSteps?.length,
    stepCount: a.defaultSteps?.length ?? 0,
    targets: a.targets,
    probed: !!a.probe,
  }));
