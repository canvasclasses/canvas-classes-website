/*
 * _shared/tokens.ts
 * ------------------
 * SINGLE SOURCE OF TRUTH for simulator colour + typography design tokens.
 *
 * Every simulator should import from here instead of hardcoding hex strings
 * or Tailwind size/weight combos. The validator (scripts/validate-sims.mjs)
 * treats this file as the ONLY sanctioned home for accent hex literals, and
 * enforces the typography rules these tokens encode.
 *
 * ── The two-colour rule (project decision 2026-07-23) ─────────────────────
 * A simulator uses ONE primary accent plus AT MOST ONE secondary accent, and
 * both must be LIGHT-TIER colours (they sit as foreground on a near-black
 * background, so a mid/dark tier like #6366f1 or #7c3aed reads muddy and
 * pulls focus). Everything else is white/gray. The default primary is violet
 * (ACCENT); reach for a secondary from ACCENTS only when the sim's content
 * genuinely has a second axis (water vs solute, acid vs base, reactant vs
 * product). This keeps hundreds of sims reading as one product without
 * forcing every sim to be literally the same colour.
 *
 * Two colours are allowed OUTSIDE the accent rule because they carry meaning,
 * not decoration — mark them `// sim-lint-ok` at the usage site:
 *   • a real-world identity colour (a solute's actual solution colour, an
 *     atom's periodic-table colour) shown inside the visualization;
 *   • the pass/fail pair OK / BAD for right-vs-wrong feedback.
 */

// ── Backgrounds & surfaces ─────────────────────────────────────────────────
export const SIM_BG = '#0d1117';        // simulator root — must match page bg
export const SIM_SURFACE = '#0B0F15';   // raised surfaces / info panels
export const SIM_INPUT = '#151E32';     // tabs, selectors, SVG canvas bg
export const SIM_CANVAS_BG =
  'radial-gradient(circle at center,#1e204a 0%,#050614 100%)'; // SVG viewports

// ── Accents (LIGHT tier only — see the two-colour rule above) ──────────────
export const ACCENT = '#c4b5fd';        // violet-300 — DEFAULT primary
export const ACCENT_2 = '#7dd3fc';      // sky-300 — default secondary axis

/**
 * Approved light-tier accents. When a sim needs a specific hue, pick from
 * here — never invent one, and never drop to a mid/dark tier for foreground.
 */
export const ACCENTS = {
  violet:  '#c4b5fd',
  sky:     '#7dd3fc',
  emerald: '#6ee7b7',
  amber:   '#fcd34d',
  pink:    '#f9a8d4',
  orange:  '#fdba74',
} as const;

// ── Text tiers ─────────────────────────────────────────────────────────────
export const TEXT = {
  primary:   '#e2e8f0',   // headings / primary readouts (use instead of pure white)
  secondary: '#94a3b8',   // body / explanation
  ghost:     '#64748b',   // micro-labels, units, tips
  muted:     '#475569',   // dimmest — subtitles, sub-labels
} as const;

// ── Semantic pass/fail (the ONE non-accent colour pair — mark sim-lint-ok) ──
export const OK = '#6ee7b7';    // pale emerald — "correct"
export const BAD = '#fca5a5';   // pale red — "wrong"

// ── Borders & dividers ─────────────────────────────────────────────────────
export const BORDER = {
  card:    'rgba(255,255,255,0.07)',
  divider: 'rgba(255,255,255,0.06)',
  hairline:'rgba(255,255,255,0.05)',
} as const;

// ── Low-opacity accent tints (backgrounds / active borders) ─────────────────
// Base tiers MAY appear here (as a translucent fill/border), never as fg text.
export const accentTint = (hex: string, alpha: number) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

/**
 * ── Typography scale (className strings) ───────────────────────────────────
 * Weight scales DOWN with size: font-black only at text-lg and above; at
 * text-xs / text-[10px] / text-[11px] the ceiling is font-semibold. These
 * strings bake that rule in — use them instead of hand-rolling size+weight,
 * and the validator won't flag you. Colour is applied separately via TEXT.
 *
 * The StepBar pill label is the ONE sanctioned font-black-at-small-size
 * exception (it sits alone inside a bordered pill), and lives in the shared
 * StepBar component so individual sims never reproduce it.
 */
export const TYPE = {
  title:          'text-2xl md:text-3xl font-black tracking-tight text-white',
  subtitle:       'text-[11px] font-semibold uppercase tracking-widest',      // + TEXT.muted
  badge:          'text-[10px] font-semibold uppercase tracking-widest',      // + TEXT.ghost
  sectionLabel:   'text-[10px] font-semibold uppercase tracking-widest',      // + TEXT.secondary
  conceptHeading: 'text-lg font-bold leading-snug text-white',
  body:           'text-sm leading-snug',                                     // + TEXT.secondary
  stepLabel:      'text-xs font-semibold uppercase tracking-widest',          // + accent
  metadata:       'text-[10px] font-medium',                                  // + TEXT.ghost
  expertTip:      'text-sm font-medium leading-snug italic',                  // + TEXT.primary
} as const;
