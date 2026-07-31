/*
 * field-bench/lib/scene.ts — authored block → live scene.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * The engine ships once as code; every exercise on every page is a
 * `field_bench` block naming ONE archetype id plus params
 * (PHYSICS_SIMULATION_PROGRAM.md §3). This file is the join: it runs the
 * archetype's `build(params)`, then lets any explicitly authored sources /
 * surfaces / test charges OVERRIDE the result, so a faculty member can start
 * from `dipole` and move one charge without a developer.
 *
 * ⚠ `sceneKey` exists because of a real shipped bug class. The admin
 * books-editor autosaves on a debounce and hands the renderer a NEW block
 * object on every keystroke. Anything memoised on block IDENTITY would re-seed
 * the sliders continuously and yank a scene out from under a student mid-drag.
 * Memoise on this CONTENT key instead — never on the block.
 */

import type { FieldBenchBlock } from '@canvas/data/types/books';
import type { FieldArchetype, FieldScene, FieldSource, GaussSurface, TestCharge } from '../types';

export interface ShowFlags {
  fieldLines: boolean;
  equipotentials: boolean;
  vectors: boolean;
  flux: boolean;
  magnitudeHeatmap: boolean;
}

export interface ResolvedScene {
  scene: FieldScene;
  show: ShowFlags;
  guided: boolean;
  steps: { say: string; cta: string }[];
  title: string;
  summary: string;
  params: Record<string, number | string | boolean>;
  archetypeId?: string;
  allowDragSurface: boolean;
}

/** Defaults per mode. A Gauss lab with the flux readout off would be a picture
 *  of a circle; a sculptor with no lines would be a picture of a dot. */
function defaultShow(mode: FieldBenchBlock['mode']): ShowFlags {
  switch (mode) {
    case 'gauss':
      return { fieldLines: true, equipotentials: false, vectors: true, flux: true, magnitudeHeatmap: false };
    case 'trajectory':
      return { fieldLines: true, equipotentials: false, vectors: true, flux: false, magnitudeHeatmap: false };
    case 'photoelectric':
      return { fieldLines: false, equipotentials: false, vectors: false, flux: false, magnitudeHeatmap: false };
    default:
      return { fieldLines: true, equipotentials: true, vectors: false, flux: false, magnitudeHeatmap: false };
  }
}

const toSource = (s: NonNullable<FieldBenchBlock['sources']>[number]): FieldSource => ({
  id: s.id,
  kind: s.kind,
  pos: { x: s.x, y: s.y },
  strength: s.strength,
  ...(s.angle !== undefined ? { angleDeg: s.angle } : {}),
  ...(s.radius !== undefined ? { radius: s.radius } : {}),
  ...(s.length !== undefined ? { length: s.length } : {}),
  ...(s.label !== undefined ? { label: s.label } : {}),
  ...(s.fixed !== undefined ? { fixed: s.fixed } : {}),
});

const toTestCharge = (t: NonNullable<FieldBenchBlock['testCharges']>[number]): TestCharge => ({
  id: t.id,
  pos: { x: t.x, y: t.y },
  ...(t.vx !== undefined || t.vy !== undefined ? { vel: { x: t.vx ?? 0, y: t.vy ?? 0 } } : {}),
  charge: t.charge,
  mass: t.mass,
  ...(t.label !== undefined ? { label: t.label } : {}),
});

const toSurface = (g: NonNullable<FieldBenchBlock['surfaces']>[number]): GaussSurface => ({
  id: g.id,
  shape: g.shape,
  centre: { x: g.x, y: g.y },
  ...(g.radius !== undefined ? { radius: g.radius } : {}),
  ...(g.w !== undefined && g.h !== undefined ? { size: { w: g.w, h: g.h } } : {}),
  ...(g.label !== undefined ? { label: g.label } : {}),
});

/** Merge the archetype's parameter defaults under the block's overrides. */
export function resolveParams(
  block: FieldBenchBlock, arch?: FieldArchetype,
): Record<string, number | string | boolean> {
  const out: Record<string, number | string | boolean> = {};
  for (const p of arch?.params ?? []) out[p.key] = p.default;
  for (const [k, v] of Object.entries(block.params ?? {})) out[k] = v;
  return out;
}

export function resolveScene(block: FieldBenchBlock, arch?: FieldArchetype): ResolvedScene {
  const params = resolveParams(block, arch);
  const built: FieldScene = arch
    ? arch.build(params)
    : { kind: block.kind, sources: [] };

  const scene: FieldScene = {
    kind: block.kind ?? built.kind,
    sources: block.sources?.length ? block.sources.map(toSource) : built.sources,
    ...(block.testCharges?.length
      ? { testCharges: block.testCharges.map(toTestCharge) }
      : built.testCharges ? { testCharges: built.testCharges } : {}),
    ...(block.surfaces?.length
      ? { surfaces: block.surfaces.map(toSurface) }
      : built.surfaces ? { surfaces: built.surfaces } : {}),
  };

  const base = defaultShow(block.mode);
  const show: ShowFlags = {
    fieldLines: block.show?.fieldLines ?? base.fieldLines,
    equipotentials: block.show?.equipotentials ?? base.equipotentials,
    vectors: block.show?.vectors ?? base.vectors,
    flux: block.show?.flux ?? base.flux,
    magnitudeHeatmap: block.show?.magnitudeHeatmap ?? base.magnitudeHeatmap,
  };

  const steps = block.steps?.length ? block.steps : (arch?.defaultSteps ?? []);

  return {
    scene,
    show,
    guided: block.guided ?? steps.length > 0,
    steps,
    title: block.title ?? arch?.title ?? 'Field bench',
    summary: arch?.summary ?? '',
    params,
    ...(arch?.id ? { archetypeId: arch.id } : {}),
    allowDragSurface: block.allow_drag_surface ?? true,
  };
}

/** Content key for memoisation. NEVER memoise on the block object — see the
 *  file header. */
export const sceneKey = (block: FieldBenchBlock): string => JSON.stringify([
  block.archetype, block.kind, block.mode, block.params,
  block.sources, block.testCharges, block.surfaces,
  block.show, block.steps, block.guided, block.allow_drag_surface,
]);
