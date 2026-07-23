'use client';

/**
 * Shared typography helpers for simulators.
 *
 * Per SIMULATION_DESIGN_WORKFLOW.md §2:
 *
 *   • prettyExp() — never expose JS's "1.5e+23" notation to students. Use
 *     this helper to render "1.5 × 10²³" with proper Unicode superscript
 *     digits. That's the form NCERT and every chemistry / physics textbook
 *     uses; the "e+" form is programming syntax and actively confuses.
 *
 *   • <Frac/> — never use ÷ in formulas or calc steps. Use this component
 *     to render a vertical numerator/denominator stack. From any normal
 *     viewing distance the ÷ glyph reads as a +, silently turning A÷B
 *     into "A + B" in the student's eyes.
 *
 * Both helpers are intentionally tiny so they can be inlined per-file if
 * an existing simulator can't take a new import for some reason. New
 * simulators should import from here.
 */

import * as React from 'react';

const SUP_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/**
 * Converts a JS exponential-notation string ("6.022e+23") into
 * proper scientific notation ("6.022 × 10²³") with Unicode superscripts.
 * Returns the input unchanged if it isn't in e-notation, so it's safe to
 * wrap any toExponential() call: prettyExp(value.toExponential(3)).
 */
export function prettyExp(eNotation: string): string {
  const m = eNotation.match(/^(-?[\d.]+)e([+-]?\d+)$/);
  if (!m) return eNotation;
  const mantissa = m[1];
  const expNum = parseInt(m[2], 10);
  if (expNum === 0) return mantissa;
  const sup = String(Math.abs(expNum))
    .split('')
    .map((d) => SUP_DIGITS[parseInt(d, 10)])
    .join('');
  const sign = expNum < 0 ? '⁻' : '';
  return `${mantissa} × 10${sign}${sup}`;
}

/**
 * Standard number formatter for simulator readouts. Keeps sensible precision by
 * magnitude and routes anything very large/small through prettyExp so students
 * never see "6.02e+23". Reused by calc-style sims instead of each re-deriving it.
 */
export function fmt(v: number, digits = 3): string {
  if (!isFinite(v) || isNaN(v)) return '—';
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs < 0.001 || abs > 1e5) return prettyExp(v.toExponential(2));
  if (abs >= 100) return v.toFixed(1);
  if (abs >= 10) return v.toFixed(2);
  return v.toFixed(digits);
}

/**
 * Inline vertical fraction. Renders num stacked over den separated by a
 * horizontal divider line in the current text colour. Use anywhere a
 * division would otherwise be written with ÷.
 *
 * Align containing rows with `items-center` (not baseline) so neighbours
 * sit at the visual centre of the fraction.
 */
export function Frac({ num, den }: { num: React.ReactNode; den: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      verticalAlign: 'middle',
      lineHeight: 1.15,
      margin: '0 4px',
    }}>
      <span style={{ padding: '0 6px 2px 6px' }}>{num}</span>
      <span style={{
        padding: '2px 6px 0 6px',
        borderTop: '1.5px solid currentColor',
        width: '100%',
        textAlign: 'center',
      }}>{den}</span>
    </span>
  );
}
