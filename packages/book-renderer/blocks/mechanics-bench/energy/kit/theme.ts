/*
 * energy/kit/theme.ts — the Phase-2 colour + surface vocabulary.
 * ─────────────────────────────────────────────────────────────────────────────
 * EVERY colour here comes from `_shared/tokens`. No hex literal is written
 * anywhere under `energy/` or `rotation/` — SIMULATION_DESIGN_WORKFLOW §3 is
 * canonical and `npm run lint:sims` enforces it over both directories.
 *
 * ── THE TWO-COLOUR RULE, AND THE ONE EXCEPTION ───────────────────────────────
 * Chrome (headers, step bars, buttons, panels, sliders) uses exactly ONE primary
 * accent (violet `ACCENT`) plus ONE secondary (sky `ACCENT_2`). That is the whole
 * chrome palette, identical to FBD Studio's, so the two engines read as one
 * product.
 *
 * `ACCOUNT` and `SHAPE_COLOR` below are NOT chrome. They are the sanctioned
 * "real-world identity colour shown INSIDE the visualization" exception (§3),
 * for the two data axes these sims exist to teach:
 *
 *   • WHICH ACCOUNT a joule is sitting in — kinetic, potential, or heat. The
 *     entire Energy Ledger is the claim that these three are one total shared
 *     three ways, and a student has to be able to tell them apart at a glance
 *     while the bars move.
 *   • WHICH SHAPE is rolling — the MoI race is a four-way comparison and the
 *     four bodies are drawn on one ramp.
 *
 * Every value is an approved light-tier token from `ACCENTS`, every one is keyed
 * to a row in the legend below the canvas, and none is ever used for chrome.
 *
 * ── ZERO TEXT ON THE CANVAS ──────────────────────────────────────────────────
 * Same structural answer to the §4E label-overlap rule that FBD Studio uses:
 *
 *   ▸ The Phase-2 benches draw ZERO <text> elements on any canvas.
 *
 * Names, agents, magnitudes and units all live in the colour-keyed legend under
 * the board. Two labels cannot collide if no label is ever placed, so the bug
 * class is designed out rather than tuned away.
 */

import type { CSSProperties } from 'react';
import {
  ACCENT, ACCENT_2, ACCENTS, TEXT, OK, BAD, BORDER, accentTint, SIM_CANVAS_BG,
} from '../../../simulations/_shared';

// ── Chrome accents (the two-colour rule) ─────────────────────────────────────
export const PRIMARY = ACCENT;      // violet-300 — the sim's accent
export const SECONDARY = ACCENT_2;  // sky-300 — the "second axis" accent

export { TEXT, OK, BAD, BORDER, accentTint, ACCENTS };

// ── The energy accounts (in-visualization data axis) ─────────────────────────

export type Account = 'ke' | 'pe' | 'heat' | 'rot';

export interface AccountStyle {
  label: string;
  color: string;
  /** One line under the legend row — the definition, not a hint. */
  blurb: string;
}

/* sim-lint-ok — which energy account a joule sits in is the data axis these
   sims exist to teach; drawn only inside the SVG and keyed to the legend. */
export const ACCOUNT: Record<Account, AccountStyle> = {
  ke: { label: 'Kinetic', color: ACCENTS.sky,
    blurb: '½mv² — the energy of going somewhere.' },
  pe: { label: 'Potential', color: ACCENTS.violet,
    blurb: 'mgh — the energy of being up high.' },
  heat: { label: 'Heat', color: ACCENTS.orange,
    blurb: 'μmgΔx — warmed track, warmed block. Still joules.' },
  rot: { label: 'Rotational', color: ACCENTS.amber,
    blurb: '½Iω² — the energy of going round.' },
};

/** The order the stack is drawn in, bottom to top. Heat on top so its growth
 *  is read against a flat ceiling rather than against a moving neighbour. */
export const STACK_ORDER: Account[] = ['ke', 'rot', 'pe', 'heat'];

// ── Rolling-body identity (the second in-visualization axis) ─────────────────

/* sim-lint-ok — four bodies race on one ramp and must be distinguishable;
   every value is an approved light-tier token and each has a legend row. */
export const SHAPE_COLOR: Record<string, string> = {
  sphere: ACCENTS.emerald,
  disc: ACCENTS.sky,
  'hollow-sphere': ACCENTS.amber,
  hoop: ACCENTS.pink,
  slider: TEXT.ghost,
};

/** The two colliding bodies, and the two beam sides. Two is within the chrome
 *  rule on its own, so these are just the chrome accents reused. */
export const BODY_A = ACCENT;
export const BODY_B = ACCENT_2;

// ── Surfaces ─────────────────────────────────────────────────────────────────

export const CANVAS_STYLE: CSSProperties = {
  background: SIM_CANVAS_BG,
  borderRadius: 18,
  border: `1px solid ${accentTint(PRIMARY, 0.18)}`,
};

export const CARD_STYLE: CSSProperties = {
  background: 'rgba(255,255,255,0.02)',
  border: `1px solid ${BORDER.card}`,
  borderRadius: 14,
};

/** A ghost outline — the wrong answer, drawn beside the right one. Deliberately
 *  the muted text tier rather than a dimmed accent: it must be visible enough to
 *  compare against and never look like a third data series. */
export const GHOST = TEXT.muted;

// ── Number formatting ────────────────────────────────────────────────────────
// Readouts live in the legend, so they need to be short, aligned and honest
// about precision. `sig` keeps three significant figures without the
// exponential form that the sim validator (rule 6) rejects.

export function sig(v: number, digits = 3): string {
  if (!Number.isFinite(v)) return '—';
  if (v === 0) return '0';
  const a = Math.abs(v);
  if (a >= 1000) return Math.round(v).toLocaleString('en-IN');
  if (a >= 100) return v.toFixed(0);
  if (a >= 10) return v.toFixed(1);
  if (a >= 1) return v.toFixed(2);
  return v.toFixed(Math.min(digits + 1, 4));
}

/** Joules, with the unit. */
export const J = (v: number): string => `${sig(v)} J`;
