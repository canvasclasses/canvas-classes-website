/*
 * optics-bench/ui/theme.ts — the two accents, and the one sanctioned exception.
 * ─────────────────────────────────────────────────────────────────────────────
 * ONE primary accent plus AT MOST one secondary, both light-tier, both from
 * `_shared/tokens`. This sim's second axis is real and it is the subject of the
 * whole engine:
 *
 *      LIGHT  (amber)  — rays, the object, the image. The thing being studied.
 *      GLASS  (sky)    — lenses, mirrors, stops, screens. The apparatus.
 *
 * Everything else is white/grey from TEXT.
 *
 * ── THE EXCEPTION ────────────────────────────────────────────────────────────
 * Spectral colours (`lib/spectral.ts`) are wavelength-accurate and are the
 * sanctioned "real-world identity colour" case: a 486 nm ray drawn in the house
 * amber is a lie about the physics, and a dispersion demo in two shades of one
 * accent teaches nothing at all. Every site that paints one carries
 * `// sim-lint-ok` and that reason.
 *
 * Pure — no React, no DOM.
 */

import { ACCENTS, TEXT, accentTint } from '../../simulations/_shared';

/** Primary accent — light itself. */
export const LIGHT = ACCENTS.amber;
/** The one secondary accent — the apparatus. */
export const GLASS = ACCENTS.sky;

/** Construction rays are drawn in the same accent, just insistently. */
export const RAY_FAN = accentTint(LIGHT, 0.55);
export const RAY_CONSTRUCTION = LIGHT;
export const RAY_BLOCKED = accentTint(LIGHT, 0.18);

/** Glass body fill and outline. */
export const GLASS_FILL = accentTint(GLASS, 0.13);
export const GLASS_LINE = GLASS;
export const HARDWARE = accentTint(GLASS, 0.75);

/** The axis and the construction furniture. */
export const AXIS = 'rgba(226,232,240,0.28)';
export const TICK = 'rgba(226,232,240,0.45)';
export const GHOST = TEXT.ghost;

export const SIM_CANVAS = '#0B0F15';
