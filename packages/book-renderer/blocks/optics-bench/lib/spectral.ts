/*
 * optics-bench/lib/spectral.ts — wavelength → colour, and the visible sample set.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM.
 *
 * ── WHY THESE COLOURS ARE ALLOWED ────────────────────────────────────────────
 * The sim design rule is one primary accent plus at most one secondary. The
 * sanctioned exception is a REAL-WORLD IDENTITY COLOUR shown inside the
 * visualization — and a spectrum is the purest possible case of one: a 486 nm
 * ray that is not drawn blue teaches nothing at all, and a dispersion demo in
 * two shades of the house accent is a lie about the physics. Every usage site
 * that paints one of these carries `// sim-lint-ok` with that reason.
 *
 * The mapping is Dan Bruton's approximation to the CIE response — the standard
 * one, chosen because it is smooth (no banding as λ sweeps) and because its
 * intensity roll-off at the ends of the visible range is real: 400 nm and
 * 700 nm light IS dim to the eye, and a spectrum that stays equally bright to
 * the edges looks like a paint chart rather than a spectrum.
 */

export type RGB = [number, number, number];

/** nm. The visible window this engine draws. */
export const LAMBDA_MIN = 380;
export const LAMBDA_MAX = 750;

/** nm. The default "white light" sample set, spread across the visible range.
 *  Seven rays is Newton's own count and it is also about the most a ray diagram
 *  can carry before the fan turns into a smear. */
export const WHITE_SAMPLES: number[] = [660, 610, 580, 550, 500, 470, 435];

/** nm. Named lines a physics page is likely to ask for by name. */
export const LINES = {
  redC: 656.3,      // hydrogen C line — the red end of the dispersion measurement
  sodiumD: 589.3,   // sodium doublet — where n is quoted
  blueF: 486.1,     // hydrogen F line — the blue end
  heNe: 632.8,      // He–Ne laser, the one every lab actually has
  green: 546.1,     // mercury green
} as const;

/**
 * Bruton's wavelength → linear RGB, with the eye's end-of-range roll-off.
 * Returns 0–255 components.
 */
export function wavelengthToRGB(nm: number, gamma = 0.8): RGB {
  let r = 0, g = 0, b = 0;

  if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; g = 0; b = 1; }
  else if (nm >= 440 && nm < 490) { r = 0; g = (nm - 440) / 50; b = 1; }
  else if (nm >= 490 && nm < 510) { r = 0; g = 1; b = -(nm - 510) / 20; }
  else if (nm >= 510 && nm < 580) { r = (nm - 510) / 70; g = 1; b = 0; }
  else if (nm >= 580 && nm < 645) { r = 1; g = -(nm - 645) / 65; b = 0; }
  else if (nm >= 645 && nm <= 780) { r = 1; g = 0; b = 0; }
  else if (nm < 380) { r = 0.35; g = 0; b = 0.6; }   // near-UV placeholder
  else { r = 0.45; g = 0; b = 0; }                    // near-IR placeholder

  // The eye is nearly blind at both ends. Keeping a floor of 0.35 means an
  // extreme ray is still VISIBLE on the diagram while still reading as dim.
  let f = 1;
  if (nm >= 380 && nm < 420) f = 0.35 + (0.65 * (nm - 380)) / 40;
  else if (nm > 700 && nm <= 780) f = 0.35 + (0.65 * (780 - nm)) / 80;
  else if (nm < 380 || nm > 780) f = 0.35;

  const c = (x: number) => Math.round(255 * Math.pow(Math.max(0, x) * f, gamma));
  return [c(r), c(g), c(b)];
}

/** CSS colour for a wavelength. */
export function wavelengthCSS(nm: number, alpha = 1): string {
  const [r, g, b] = wavelengthToRGB(nm);
  return alpha >= 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${alpha})`;
}

/** A readable name for a wavelength — for the legend, which is where every
 *  label lives (the canvas is allowed exactly one text element). */
export function colourName(nm: number): string {
  if (nm < 425) return 'violet';
  if (nm < 460) return 'indigo';
  if (nm < 500) return 'blue';
  if (nm < 545) return 'green';
  if (nm < 580) return 'yellow';
  if (nm < 625) return 'orange';
  return 'red';
}

/** n evenly spaced visible samples, red → violet (the order a spectrum lands
 *  in when a prism disperses a downward beam). */
export function spectrumSamples(count: number, lo = 420, hi = 680): number[] {
  if (count <= 1) return [(lo + hi) / 2];
  const out: number[] = [];
  for (let i = 0; i < count; i++) out.push(hi - ((hi - lo) * i) / (count - 1));
  return out;
}
