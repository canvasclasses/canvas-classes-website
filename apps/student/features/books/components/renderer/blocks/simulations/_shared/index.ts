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
