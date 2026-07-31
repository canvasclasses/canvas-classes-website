/*
 * field-bench/lib/params.ts — reading authored parameters safely.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. Blocks are Mixed-stored in Mongo and hand-editable, so a param can
 * arrive as the wrong type or as a string that used to be a number. Every
 * archetype reads through these three functions so a bad value falls back to
 * the default instead of producing NaN geometry — a NaN position silently
 * removes a charge from the scene, and nothing on screen says why.
 */

export type ParamBag = Record<string, number | string | boolean> | undefined;

export function num(p: ParamBag, key: string, fallback: number): number {
  const v = p?.[key];
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = parseFloat(v);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

export function bool(p: ParamBag, key: string, fallback: boolean): boolean {
  const v = p?.[key];
  if (typeof v === 'boolean') return v;
  if (v === 'true') return true;
  if (v === 'false') return false;
  return fallback;
}

export function str(p: ParamBag, key: string, fallback: string): string {
  const v = p?.[key];
  return typeof v === 'string' && v.length ? v : fallback;
}

/** nanocoulombs → coulombs. Scene numbers are authored in the units a student
 *  reads (nC, µC, cm) and converted here, once, so no archetype carries a
 *  stray 1e-9 in the middle of a position calculation. */
export const nC = (v: number): number => v * 1e-9;
export const uC = (v: number): number => v * 1e-6;
