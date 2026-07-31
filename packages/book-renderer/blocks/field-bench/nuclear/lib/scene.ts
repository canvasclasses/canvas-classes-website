/*
 * nuclear/lib/scene.ts — authored block → resolved nuclear exercise.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * Same join as `field-bench/lib/scene.ts`: the engine ships once as code, every
 * exercise on every page is a block naming ONE archetype id plus params. This
 * file merges the archetype's parameter defaults under the block's overrides and
 * produces the one object a view reads.
 *
 * ⚠ `nuclearKey` exists for the same reason `sceneKey` does. The admin
 * books-editor autosaves on a debounce and hands the renderer a NEW block object
 * on every keystroke, so anything memoised on block IDENTITY re-seeds the
 * controls continuously and yanks the exercise out from under a student
 * mid-interaction. Memoise on this CONTENT key. Never on the block.
 *
 * ⚠ THE BLOCK TYPE IS DELIBERATELY STRUCTURAL, NOT `FieldBenchBlock`.
 * `FieldBenchBlock['mode']` is a frozen union that does not yet contain
 * `'nuclear'` (reported to the founder — see the header of
 * `archetypes.nuclear.ts`). Typing against the fields actually used means a real
 * `FieldBenchBlock` is already assignable today, and stays assignable the moment
 * `'nuclear'` is added, with nothing here to change.
 */

import type { NuclearArchetype, NuclearParamBag } from '../../archetypes.nuclear';

export interface NuclearBlockLike {
  title?: string;
  caption?: string;
  archetype?: string;
  params?: Record<string, number | string | boolean>;
  guided?: boolean;
  steps?: { say: string; cta: string }[];
  predict?: {
    prompt: string; options: string[]; answer_index?: number; reveal?: string;
  };
  numeric?: {
    prompt: string; answer: number; tolerance?: number; unit?: string; reveal?: string;
  };
  height?: number;
}

export interface ResolvedNuclear {
  title: string;
  summary: string;
  view: NuclearArchetype['view'];
  params: NuclearParamBag;
  guided: boolean;
  steps: { say: string; cta: string }[];
  archetypeId?: string;
}

/** Merge the archetype's parameter defaults under the block's overrides. */
export function resolveNuclearParams(
  block: NuclearBlockLike, arch?: NuclearArchetype,
): NuclearParamBag {
  const out: NuclearParamBag = {};
  for (const p of arch?.params ?? []) out[p.key] = p.default;
  for (const [k, v] of Object.entries(block.params ?? {})) out[k] = v;
  return out;
}

export function resolveNuclear(
  block: NuclearBlockLike, arch?: NuclearArchetype,
): ResolvedNuclear {
  const steps = block.steps?.length ? block.steps : (arch?.defaultSteps ?? []);
  return {
    title: block.title ?? arch?.title ?? 'Nuclear bench',
    summary: arch?.summary ?? '',
    view: arch?.view ?? 'curve',
    params: resolveNuclearParams(block, arch),
    guided: block.guided ?? steps.length > 0,
    steps,
    ...(arch?.id ? { archetypeId: arch.id } : {}),
  };
}

/** Content key for memoisation. NEVER memoise on the block object. */
export const nuclearKey = (block: NuclearBlockLike): string => JSON.stringify([
  block.archetype, block.params, block.steps, block.guided,
  block.predict, block.numeric, block.title,
]);
