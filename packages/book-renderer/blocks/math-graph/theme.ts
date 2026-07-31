// Dark-theme tokens for the JSXGraph math board. The shelved 2026-06 grapher
// rendered a WHITE board as an inset on the dark page — the main "unfinished"
// tell. Everything here forces the board onto the platform's dark reading
// surface with the sim two-colour, light-tier accent palette
// (see _shared/tokens.ts + SIMULATION_DESIGN_WORKFLOW.md).
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { MathAccent } from '@canvas/data/types/books';

// Board surface — matches the sim canvas inset (#0d1117 root → #0B0F15 canvas).
export const BOARD = {
  canvas: '#0B0F15',      // graph card interior
  frame: '#151E32',       // card border-ish surround
  axis: '#8b93a7',        // axis lines
  tick: '#8b93a7',        // tick marks
  tickLabel: '#94a3b8',   // numbers on the axes
  gridMajor: '#ffffff',   // grid lines (drawn at low opacity below)
  gridMajorOpacity: 0.07,
  gridMinor: '#ffffff',
  gridMinorOpacity: 0.035,
} as const;

// Text tiers (mirror _shared/tokens.ts TEXT).
export const TEXT = {
  primary: '#e2e8f0',
  secondary: '#94a3b8',
  ghost: '#64748b',
} as const;

// Light-tier accents — foreground on near-black, so mid/dark tones read muddy.
// Same family the sims use. Primary = violet, secondary = sky.
export const ACCENT: Record<MathAccent, string> = {
  violet: '#c4b5fd',
  sky: '#7dd3fc',
  emerald: '#6ee7b7',
  amber: '#fbbf24',
  pink: '#f9a8d4',
  orange: '#fdba74',
};

export const ACCENT_ORDER: MathAccent[] = ['violet', 'sky', 'amber', 'emerald', 'pink', 'orange'];

export function accentHex(name: MathAccent | undefined, fallbackIndex = 0): string {
  if (name && ACCENT[name]) return ACCENT[name];
  return ACCENT[ACCENT_ORDER[fallbackIndex % ACCENT_ORDER.length]];
}

// NOTE (2026-07-24): curve labels are NOT drawn on the canvas — an earlier
// approach placed each curve's label near the curve with an anti-overlap
// solver (placeLabels/pickLabelPosition, removed), but labels still sat on top
// of the lines. They now live in an HTML LEGEND box in the graph's corner, one
// colour-matched row per curve, so a label can never overlap a line.

// NOTE (2026-07-24): a JSXGraph-native "panel" polygon behind the sliders was
// tried here and removed — even with fixed/highlight disabled at every level
// JSXGraph exposes, the polygon remained draggable and showed a stray
// highlight outline on interaction (a real, reported bug). Sliders are now
// invisible JXG elements driven by real HTML <input type="range"> controls in
// a sidebar OUTSIDE the canvas (see archetypes.ts LiveSliderMeta + mkSlider,
// and MathGraphBoard.tsx's slider sidebar) — a plain CSS div can never be
// dragged or highlighted the way a canvas element can.
