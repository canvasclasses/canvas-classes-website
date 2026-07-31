/*
 * fbd/theme.ts — FBD Studio's colour + geometry vocabulary.
 * ─────────────────────────────────────────────────────────────────────────────
 * EVERY colour here comes from `_shared/tokens`. No hex literal is written in
 * this folder — SIMULATION_DESIGN_WORKFLOW §3 is canonical and `npm run
 * lint:sims` enforces it.
 *
 * ── The two-colour rule, and how a seven-kind force palette lives inside it ──
 * Chrome (headers, step bar, buttons, panels, sliders) uses exactly ONE primary
 * accent (violet `ACCENT`) plus ONE secondary (sky `ACCENT_2`). That is the
 * whole chrome palette.
 *
 * The force-kind colours below are NOT chrome — they are the sanctioned
 * "real-world identity colour shown INSIDE the visualization" exception (§3),
 * because force kind is the one data axis this simulator exists to teach, and a
 * student must be able to tell a normal from a friction at a glance. They are
 * drawn only inside the SVG, they are all approved light-tier tokens from
 * `ACCENTS`, and every one of them is keyed to a row in the legend below the
 * canvas — which is also how the §4E LABEL OVERLAP RULE is satisfied:
 *
 *   ▸ FBD Studio draws ZERO <text> elements on any of its canvases.
 *
 * Not "one" — zero. Names, agents and magnitudes all live in the colour-keyed
 * legend under the board, and a body is identified by selecting its legend row
 * (which puts a halo on it). A label cannot overlap another label if no label is
 * ever placed on the canvas, so this bug class is designed out structurally
 * rather than tuned away.
 */

import type { CSSProperties } from 'react';
import {
  ACCENT, ACCENT_2, ACCENTS, TEXT, OK, BAD, BORDER, accentTint, SIM_CANVAS_BG,
} from '../../simulations/_shared';
import type { ForceKind } from '../types';

// ── Chrome accents (the two-colour rule) ─────────────────────────────────────
export const PRIMARY = ACCENT;      // violet-300 — the sim's accent
export const SECONDARY = ACCENT_2;  // sky-300 — the "system / boundary" axis

export { TEXT, OK, BAD, BORDER, accentTint };

// ── Viewport ─────────────────────────────────────────────────────────────────

/**
 * The world→screen mapping is the ENGINE's, not ours: `View`, `worldToScreen`
 * and `screenToWorld` all come from `lib/svg`, which owns the single y-flip in
 * the whole program (physics y is UP, SVG y is DOWN). FBD Studio re-exports them
 * so no stage file reaches past this module for geometry, and so there is
 * exactly one definition of "where is this metre on screen".
 */
export type { View } from '../lib/svg';
export { worldToScreen, screenToWorld } from '../lib/svg';

/**
 * There is no fixed viewBox any more. Every board measures its own CSS-pixel box
 * and uses that AS its viewBox (`fbd/canvas.tsx`), so one viewBox unit is one
 * CSS pixel. A hardcoded window is what made the diagram occupy 7.7% of its own
 * canvas and clipped 152px off the bottom of the Draw stage; both are structural
 * bugs of a fixed viewBox, not tuning mistakes.
 */

// ── Force identity (in-visualization data axis — see the header) ─────────────

export interface ForceStyle {
  /** Palette button + legend name. */
  label: string;
  color: string;
  /** Pseudo-forces are dashed: they are not real interactions. */
  dashed?: boolean;
  /** One line under the palette button — the definition, not a hint. */
  blurb: string;
  /** Default direction when the arrow is first placed, degrees CCW from +x. */
  defaultDeg: number;
  /** Weight always acts at the centre of mass; contact forces at the surface. */
  anchorsAtCentre?: boolean;
}

/* sim-lint-ok — force kind is the data axis this sim teaches, drawn only inside
   the SVG and keyed to the legend; every value is an approved light-tier token. */
export const FORCE_STYLE: Record<ForceKind | 'unknown', ForceStyle> = {
  weight:   { label: 'Weight',   color: ACCENTS.violet,  defaultDeg: 270, anchorsAtCentre: true,
              blurb: 'Earth pulls every gram of it. Always straight down.' },
  normal:   { label: 'Normal',   color: ACCENTS.sky,     defaultDeg: 90,
              blurb: 'A surface pushing back. Always ⟂ to that surface.' },
  friction: { label: 'Friction', color: ACCENTS.amber,   defaultDeg: 180,
              blurb: 'Along the surface, opposing the sliding at the contact.' },
  tension:  { label: 'Tension',  color: ACCENTS.emerald, defaultDeg: 90,
              blurb: 'A string pulls. It can never push.' },
  applied:  { label: 'Applied',  color: ACCENTS.orange,  defaultDeg: 0,
              blurb: 'A hand, an engine, a rope you are pulling.' },
  spring:   { label: 'Spring',   color: ACCENTS.pink,    defaultDeg: 0,
              blurb: 'Back toward the natural length, by kx.' },
  pseudo:   { label: 'Pseudo',   color: ACCENTS.pink,    defaultDeg: 270, dashed: true,
              blurb: 'Only exists once you sit in an accelerating frame.' },
  unknown:  { label: 'Unlabelled', color: TEXT.ghost,    defaultDeg: 0,
              blurb: 'An arrow with no name is not yet physics.' },
};

/**
 * The order the palette lists them in — the order a student should think in.
 *
 * `spring` is deliberately ABSENT. Nothing in the engine can put a spring into
 * an FBD scene (`MechanicsSceneSpec` has no springs field and no archetype
 * builds one), so a spring arrow was guaranteed spurious in 100% of
 * configurations — a palette button whose only possible outcome was being
 * marked wrong. A trap is not a distractor. `FORCE_STYLE` keeps the entry so
 * that if a spring scene ever exists the legend and grader still name it.
 */
export const PALETTE_ORDER: ForceKind[] =
  ['weight', 'normal', 'friction', 'tension', 'applied', 'pseudo'];

/** A ghosted "something acts here" hint. Deliberately colourless so it reveals
 *  that a force is missing WITHOUT revealing which kind it is. */
export const HINT_COLOR = TEXT.muted;

// ── Shared surface styles ────────────────────────────────────────────────────

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

/**
 * Arrow lengths. DEFINED in `./fit` (pure, no shared-token dependency) so the
 * fill verifier can execute the same rule the renderer draws with; re-exported
 * here because this is the vocabulary module every stage imports from.
 */
export { arrowRefPx, nPerPx, appliedArrowPx } from './fit';
