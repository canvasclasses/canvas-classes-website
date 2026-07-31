/*
 * motion-lab/waves/lib/resolve.ts — archetype defaults + block overrides → numbers.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM. Shared by every Phase-2 bench (`thermo/` imports it
 * across, for the reason given in `plot.ts`).
 *
 * Resolution order, once, in one place:
 *
 *      block.params[key]  →  archetype param default  →  hard fallback
 *
 * ── WHY THE PARAM LIST IS THE UI, NOT JUST THE DEFAULTS ─────────────────────
 * The Phase-1 audit found the Circular Arena reading masses out of archetype
 * `params` and then rendering only its OWN four hardcoded sliders — so a
 * declared `plane` select had no control anywhere and half of the flagship
 * exercise was author-only and unreachable by a student.
 *
 * So `controlDefs()` returns the archetype's own declared params, in the
 * archetype's own order, and the benches render a slider or a toggle for EVERY
 * one of them. Declaring a parameter is therefore the same act as surfacing it;
 * the two cannot drift apart, and the verifier checks that every declared
 * numeric param carries the min/max/step a slider needs.
 */

import type { MotionArchetype } from '../../types';

export type ParamDef = NonNullable<MotionArchetype['params']>[number];
export type Bag = Record<string, number | string | boolean>;

/** Merge the archetype's defaults with whatever the block overrode. */
export function resolveParams(
  params: ParamDef[] | undefined,
  overrides: Record<string, number | string | boolean> | undefined
): Bag {
  const out: Bag = {};
  for (const p of params ?? []) out[p.key] = p.default;
  for (const [k, v] of Object.entries(overrides ?? {})) {
    if (v !== null && v !== undefined) out[k] = v;
  }
  return out;
}

export const num = (bag: Bag, key: string, fallback: number): number =>
  typeof bag[key] === 'number' && Number.isFinite(bag[key] as number) ? (bag[key] as number) : fallback;

export const bool = (bag: Bag, key: string, fallback: boolean): boolean =>
  typeof bag[key] === 'boolean' ? (bag[key] as boolean) : fallback;

export const str = (bag: Bag, key: string, fallback: string): string =>
  typeof bag[key] === 'string' ? (bag[key] as string) : fallback;

/** True when the archetype declares this key at all — the benches use it to
 *  decide which parts of a scene exist, so an archetype's param list really is
 *  its scene description. */
export const declares = (params: ParamDef[] | undefined, key: string): boolean =>
  (params ?? []).some((p) => p.key === key);

/** The controls to render, in the archetype's own order. */
export const controlDefs = (params: ParamDef[] | undefined): ParamDef[] => params ?? [];

/**
 * A stable content key for a resolved bag.
 *
 * Used to re-seed live controls when the AUTHORED values change — never the
 * block's object identity. The admin books-editor autosaves on a debounce and
 * recreates the block object on every keystroke, so an identity-keyed effect
 * would reset a student's settings mid-drag. This is the single most-repeated
 * lesson in the engine's history and it is one line.
 */
export const bagKey = (bag: Bag): string =>
  Object.keys(bag).sort().map((k) => `${k}=${String(bag[k])}`).join('|');

/** Leading integer of a "5 — diatomic (air)" style select value. Selects are
 *  authored as human sentences so the admin picker reads well; the number is
 *  parsed back out here rather than in five different benches. */
export const leadingInt = (value: string, fallback: number): number => {
  const m = /^\s*(-?\d+)/.exec(value);
  return m ? parseInt(m[1], 10) : fallback;
};
