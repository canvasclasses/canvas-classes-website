/*
 * _shared/index.ts
 * -----------------
 * Barrel export for the simulator helper module. Every simulator component
 * should import from `./_shared` rather than reaching into individual files
 * so we can swap implementations (e.g. a future WebGL renderer, a better
 * PRNG, a different spectrum table) without touching every sim.
 */

export { useAnimationFrame } from './useAnimationFrame';
export { mulberry32 } from './mulberry32';
export { useResolvedFont } from './useResolvedFont';
export { useCanvasSize } from './useCanvasSize';
export type { CanvasDims } from './useCanvasSize';
export {
  interpolateRGB,
  nuToRGB,
  logFreqToRGB,
  rgbString,
} from './spectrum';
export type { RGB, ColorStops } from './spectrum';

// Design tokens — single source of truth for sim colour + typography.
export {
  SIM_BG, SIM_SURFACE, SIM_INPUT, SIM_CANVAS_BG,
  ACCENT, ACCENT_2, ACCENTS, TEXT, OK, BAD, BORDER, TYPE, accentTint,
} from './tokens';

// Shared chrome components — compose these instead of hand-rolling sim chrome.
export {
  SimShell, SimHeader, SectionLabel, SimTabs, StepBar, NavButtons, SimSlider, ExpertTip,
} from './components';
export type { TabDef, StepDef } from './components';

// Math/format helpers (re-exported from the sibling _typography module so the
// barrel is the one import surface a sim needs).
export { prettyExp, fmt, Frac } from '../_typography';
