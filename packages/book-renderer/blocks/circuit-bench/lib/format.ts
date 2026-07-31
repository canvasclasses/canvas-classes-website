/*
 * circuit-bench/lib/format.ts — how numbers are written for a student.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM.
 *
 * One place, because a current shown as "0.5 A" in the legend and "500 mA" in
 * the working panel is the kind of small inconsistency that makes a student
 * think two different things are being talked about.
 *
 * No exponent notation anywhere — engineering prefixes only (mA, µA, kΩ, MΩ),
 * per SIMULATION_DESIGN_WORKFLOW §2 ("never render e+23 to students").
 */

/** Significant-figure rounding that keeps 2 as "2" and 0.333333 as "0.333". */
export function sig(v: number, digits = 3): string {
  if (!Number.isFinite(v)) return v > 0 ? '∞' : '−∞';
  if (v === 0) return '0';
  const mag = Math.floor(Math.log10(Math.abs(v)));
  const dp = Math.max(0, Math.min(6, digits - 1 - mag));
  return String(Number(v.toFixed(dp)));
}

export function fmtOhm(v: number): string {
  if (!Number.isFinite(v)) return '∞ Ω';
  const a = Math.abs(v);
  if (a >= 1e6) return `${sig(v / 1e6)} MΩ`;
  if (a >= 1e3) return `${sig(v / 1e3)} kΩ`;
  return `${sig(v)} Ω`;
}

export function fmtAmp(v: number): string {
  const a = Math.abs(v);
  if (a < 1e-9) return '0 A';
  if (a < 1e-3) return `${sig(v * 1e6)} µA`;
  if (a < 1) return `${sig(v * 1e3)} mA`;
  return `${sig(v)} A`;
}

export function fmtVolt(v: number): string {
  const a = Math.abs(v);
  if (a < 1e-9) return '0 V';
  if (a < 1e-3) return `${sig(v * 1e6)} µV`;
  if (a < 1) return `${sig(v * 1e3)} mV`;
  return `${sig(v)} V`;
}

export function fmtWatt(v: number): string {
  const a = Math.abs(v);
  if (a < 1e-9) return '0 W';
  if (a < 1) return `${sig(v * 1e3)} mW`;
  return `${sig(v)} W`;
}

/** Signed, with a real minus sign rather than a hyphen. */
export function signed(s: string): string {
  return s.startsWith('-') ? `−${s.slice(1)}` : s;
}

/** "6‖3" — the way the working panel names a parallel pair. */
export const parallelPair = (a: number, b: number) => `${sig(a)}‖${sig(b)}`;
