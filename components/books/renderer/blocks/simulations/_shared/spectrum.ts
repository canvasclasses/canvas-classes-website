/*
 * spectrum.ts
 * ------------
 * Colour-from-frequency helpers shared by the light-based simulators
 * (PhotoelectricSim, WaveVsPhotonSim, and eventually EMWaveSim /
 * WaveDynamicsSim if they need it).
 *
 * Two sims were already implementing almost-identical 11-stop linear RGB
 * interpolators with slightly different input ranges and COLOR_STOPS tables:
 *   - PhotoelectricSim:  nu ∈ [3, 20] (units of 10¹⁴ Hz)
 *   - WaveVsPhotonSim:   logFreq ∈ [12, 16] (log10 Hz)
 *
 * Both stop tables have been lifted here verbatim so the lookup output is
 * pixel-identical before and after the refactor — no visual regression.
 *
 * The generic interpolator `interpolateRGB` is exported so any future sim
 * can plug in its own stop table without re-implementing the search loop.
 */

export type RGB = [number, number, number];

export type ColorStops = ReadonlyArray<readonly [number, RGB]>;

/**
 * Linear RGB interpolation across a sorted stop table.
 * Values outside the stops clamp to the nearest endpoint.
 */
export function interpolateRGB(stops: ColorStops, x: number): RGB {
  if (stops.length === 0) return [0, 0, 0];
  const first = stops[0];
  const last = stops[stops.length - 1];
  if (x <= first[0]) return first[1];
  if (x >= last[0]) return last[1];
  for (let i = 0; i < stops.length - 1; i++) {
    const [x1, c1] = stops[i];
    const [x2, c2] = stops[i + 1];
    if (x >= x1 && x <= x2) {
      const t = (x - x1) / (x2 - x1);
      return [
        Math.round(c1[0] + t * (c2[0] - c1[0])),
        Math.round(c1[1] + t * (c2[1] - c1[1])),
        Math.round(c1[2] + t * (c2[2] - c1[2])),
      ];
    }
  }
  return first[1];
}

// ── PhotoelectricSim stops (nu in units of 10¹⁴ Hz) ──────────────────────
// Sweeps IR red → visible rainbow → near/far UV white.
const PHOTOELECTRIC_STOPS: ColorStops = [
  [3,  [180,  60,  30]],  // far IR — dim red
  [4,  [255,  90,  50]],  // red (visible edge)
  [5,  [255, 140,  50]],  // orange
  [6,  [255, 210,  70]],  // yellow
  [7,  [120, 220, 110]],  // green
  [8,  [ 60, 170, 255]],  // blue
  [9,  [110, 110, 250]],  // indigo
  [10, [170,  90, 240]],  // violet (visible edge)
  [12, [195, 130, 255]],  // near UV
  [16, [215, 195, 255]],  // mid UV
  [20, [230, 225, 255]],  // far UV — pale blue-white
];

/**
 * Map frequency in units of 10¹⁴ Hz to an RGB colour that walks the visible
 * spectrum across the [3, 20] range. Used by PhotoelectricSim.
 */
export function nuToRGB(nu10_14: number): RGB {
  return interpolateRGB(PHOTOELECTRIC_STOPS, nu10_14);
}

// ── WaveVsPhotonSim stops (log10 of frequency in Hz) ─────────────────────
// Maps logFreq ∈ [12, 16] to dim IR red → rainbow → pale UV white.
const WAVE_PHOTON_STOPS: ColorStops = [
  [12.0,  [110,  30,  20]],  // far IR — very dim red
  [13.5,  [160,  45,  25]],  // mid IR
  [14.2,  [220,  55,  30]],  // near IR
  [14.4,  [255,  70,  40]],  // red (visible edge, λ≈700 nm)
  [14.55, [255, 145,  40]],  // orange
  [14.65, [255, 220,  60]],  // yellow
  [14.78, [ 80, 220, 110]],  // green
  [14.85, [ 60, 130, 255]],  // blue
  [14.93, [170,  80, 240]],  // violet (λ≈400 nm)
  [15.1,  [200, 110, 255]],  // near UV
  [16.0,  [210, 220, 255]],  // far UV — pale blue-white
];

/**
 * Map log10(frequency/Hz) to an RGB colour. Used by WaveVsPhotonSim.
 */
export function logFreqToRGB(logFreq: number): RGB {
  return interpolateRGB(WAVE_PHOTON_STOPS, logFreq);
}

/** Convenience — format an RGB tuple into a CSS string. */
export function rgbString([r, g, b]: RGB, alpha = 1): string {
  if (alpha >= 1) return `rgb(${r}, ${g}, ${b})`;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
