/*
 * semiconductor/lib/format.ts — numbers a student can read out loud.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM.
 *
 * This chapter spans about thirty orders of magnitude — a 1.7×10⁻¹⁵ A reverse
 * saturation current and a 5×10²⁸ per m³ atom density in the same exercise — so a
 * fixed number of decimals is useless, and `toExponential()` prints "5e+28",
 * which the design gate bans outright because students read "e+28" as a typo.
 *
 * Two presentations, and the choice is not arbitrary:
 *   • `si()`   for anything with a UNIT a student meets in a lab: 4.30 mA, 470 Ω,
 *     6.20 V, 427 nm, 100 µF. SI prefixes are what the instrument says.
 *   • `power()` for COUNTS, where a prefix would be absurd — nobody writes
 *     "10 ronna per cubic metre". 1.50 × 10²² m⁻³, in the notation the book uses.
 *
 * `circuit-bench/lib/format.ts` already covers the ordinary circuit range and is
 * used where it fits; these exist for the decades it was never meant to reach.
 */

const PREFIXES: { p: number; s: string }[] = [
  { p: 1e12, s: 'T' }, { p: 1e9, s: 'G' }, { p: 1e6, s: 'M' }, { p: 1e3, s: 'k' },
  { p: 1, s: '' },
  { p: 1e-3, s: 'm' }, { p: 1e-6, s: 'µ' }, { p: 1e-9, s: 'n' }, { p: 1e-12, s: 'p' },
  { p: 1e-15, s: 'f' }, { p: 1e-18, s: 'a' },
];

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/** `4.30 mA`, `470 Ω`, `427 nm`. Three significant figures, SI prefix, and never
 *  an exponent. */
export function si(value: number, unit = '', sig = 3): string {
  if (!Number.isFinite(value)) return '—';
  const a = Math.abs(value);
  if (a === 0) return unit ? `0 ${unit}` : '0';
  if (a >= 1e15 || a < 1e-18) return power(value, unit, sig);

  const entry = PREFIXES.find((e) => a >= e.p) ?? PREFIXES[PREFIXES.length - 1];
  const scaled = value / entry.p;
  const digits = Math.max(0, sig - 1 - Math.floor(Math.log10(Math.abs(scaled))));
  const text = scaled.toFixed(Math.min(digits, 4));
  const trimmed = text.includes('.') ? text.replace(/\.?0+$/, '') : text;
  return `${trimmed} ${entry.s}${unit}`.trim();
}

/**
 * `1.50 × 10²² m⁻³`. Mantissa × power of ten with Unicode superscripts — the
 * notation NCERT uses. Never `1.5e+22`.
 */
export function power(value: number, unit = '', sig = 3): string {
  if (!Number.isFinite(value)) return '—';
  if (value === 0) return unit ? `0 ${unit}` : '0';
  const exp = Math.floor(Math.log10(Math.abs(value)));
  const mant = value / Math.pow(10, exp);
  const sup = String(Math.abs(exp)).split('').map((d) => SUP[Number(d)]).join('');
  const sign = exp < 0 ? '⁻' : '';
  const m = mant.toFixed(Math.max(0, sig - 1));
  return `${m} × 10${sign}${sup}${unit ? ` ${unit}` : ''}`;
}

/** A carrier or atom density, per cubic metre. */
export const perM3 = (value: number): string => power(value, 'm⁻³');

/** Fixed decimals, for ratios and gains where a prefix would be silly. */
export const fixed = (v: number, dp = 2): string => (Number.isFinite(v) ? v.toFixed(dp) : '—');

/** A signed value where the sign carries meaning (bias, gain). */
export const signed = (v: number, unit = '', sig = 3): string =>
  (v > 0 ? '+' : '') + si(v, unit, sig);

/** `1 in 5,000,000` — a doping fraction, read the way a person says it. */
export function oneIn(fraction: number): string {
  if (!Number.isFinite(fraction) || fraction <= 0) return 'none';
  const n = Math.round(1 / fraction);
  return `1 in ${n.toLocaleString('en-IN')}`;
}
