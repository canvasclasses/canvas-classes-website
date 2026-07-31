/*
 * field-bench/lib/format.ts — numbers a student can read out loud.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * These archetypes span fourteen orders of magnitude — 8×10⁻⁷ N on a bead,
 * 5.97×10²⁴ kg for the Earth — so a fixed number of decimals is useless and
 * `toExponential()` prints "5.972e+24", which the sim design gate bans outright
 * because students read "e+24" as a typo. SI prefixes instead: 5.97 Mm,
 * 226 nC, 1.13 kV/m. Same information, in the notation the textbook uses.
 *
 * Values with no sensible prefix (a bare ratio, an angle) go through `fixed`.
 */

const PREFIXES: { p: number; s: string }[] = [
  { p: 1e24, s: 'Y' }, { p: 1e21, s: 'Z' }, { p: 1e18, s: 'E' }, { p: 1e15, s: 'P' },
  { p: 1e12, s: 'T' }, { p: 1e9, s: 'G' }, { p: 1e6, s: 'M' }, { p: 1e3, s: 'k' },
  { p: 1, s: '' },
  { p: 1e-3, s: 'm' }, { p: 1e-6, s: 'µ' }, { p: 1e-9, s: 'n' }, { p: 1e-12, s: 'p' },
  { p: 1e-15, s: 'f' }, { p: 1e-18, s: 'a' },
];

/** `1.13 kV/m`, `226 nC`, `0` — three significant figures, SI prefix, no
 *  exponent notation anywhere. */
export function si(value: number, unit = '', sig = 3): string {
  if (!Number.isFinite(value)) return '—';
  const a = Math.abs(value);
  if (a === 0) return unit ? `0 ${unit}` : '0';

  const entry = PREFIXES.find((e) => a >= e.p) ?? PREFIXES[PREFIXES.length - 1];
  const scaled = value / entry.p;
  const digits = Math.max(0, sig - 1 - Math.floor(Math.log10(Math.abs(scaled))));
  const text = scaled.toFixed(Math.min(digits, 4));
  const trimmed = text.includes('.') ? text.replace(/\.?0+$/, '') : text;
  return `${trimmed} ${entry.s}${unit}`.trim();
}

/** Fixed decimals, for ratios and angles where a prefix would be silly. */
export const fixed = (v: number, dp = 2): string => (Number.isFinite(v) ? v.toFixed(dp) : '—');

/** A signed value where the sign carries meaning (charge, flux, potential). */
export const signed = (v: number, unit = '', sig = 3): string =>
  (v > 0 ? '+' : '') + si(v, unit, sig);

/** Degrees, always in [0, 180] — an angle BETWEEN two lines has no direction. */
export function betweenDeg(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const ma = Math.hypot(a.x, a.y);
  const mb = Math.hypot(b.x, b.y);
  if (ma === 0 || mb === 0) return NaN;
  const c = Math.min(1, Math.max(-1, (a.x * b.x + a.y * b.y) / (ma * mb)));
  const d = (Math.acos(c) * 180) / Math.PI;
  return d > 90 ? 180 - d : d;
}
