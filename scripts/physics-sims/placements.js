/*
 * placements.js — the data behind the insertion run.
 * ─────────────────────────────────────────────────────────────────────────────
 * One row per simulation block. Derived from
 * `_agents/plans/PHYSICS_SIM_PLACEMENT_MAP.md`, which explains WHY each
 * archetype belongs on its page; this file is only the machine-readable form.
 *
 * `page` is the page SLUG, which is stable across renumbering — page_number is
 * not, so it is deliberately absent here and only printed by the runner.
 *
 * Block shape mirrors what the admin editor writes, so a page authored by hand
 * and a page authored by this script are indistinguishable afterwards. Note the
 * required discriminators: `mechanics_bench` needs `mode`, `motion_lab` needs
 * `scenario`, `field_bench` needs `kind` + `mode`. Getting one wrong renders a
 * placeholder rather than throwing, so they are spelled out on every row.
 *
 * NEVER write null into a block field — Mixed-stored but Zod-validated with
 * `.optional()`, which rejects null. Omit the key instead.
 */

const M = (mode, archetype, extra = {}) =>
  ({ type: 'mechanics_bench', mode, archetype, ...extra });
const L = (scenario, archetype, extra = {}) =>
  ({ type: 'motion_lab', scenario, archetype, ...extra });
const C = (archetype, extra = {}) =>
  ({ type: 'circuit_bench', archetype, ...extra });
const F = (kind, mode, archetype, extra = {}) =>
  ({ type: 'field_bench', kind, mode, archetype, ...extra });

/** Standard FBD task. `body` is left to the archetype's own defaultBody. */
const fbdTask = (prompt) => ({
  fbd: { prompt, require_agent: true, allow_cut: true, then_solve: true },
  show: { grid: true, axes: true, readout: true, equations: true, values: true },
});
const pulleyTask = (prompt) => ({
  pulley: { prompt, show_constraint_ledger: true, allow_extend: true },
  show: { readout: true, equations: true, values: true },
});

const PLACEMENTS = [
  // ══════════════════════════════════════════════════════════════════════════
  // CLASS 11 · Ch.4 — LAWS OF MOTION. The chapter the mechanics engines were
  // built for; the page order matches the ladder they were designed as.
  // ══════════════════════════════════════════════════════════════════════════
  { book: 'class11-physics', chapter: 4, page: 'newtons-first-and-third-law',
    block: M('fbd', 'single-body-ground', fbdTask('Nothing is pushing this block along. Draw every force that is genuinely acting on it.')) },
  { book: 'class11-physics', chapter: 4, page: 'newtons-second-law-and-equilibrium',
    block: M('solve', 'applied-at-angle', fbdTask('Draw the forces, then resolve them and set up ΣF = ma.')) },
  { book: 'class11-physics', chapter: 4, page: 'free-body-diagrams',
    block: M('fbd', 'body-on-incline', fbdTask('Isolate the block. Which way does the surface push?')) },
  { book: 'class11-physics', chapter: 4, page: 'connected-bodies',
    block: M('fbd', 'two-blocks-in-contact', fbdTask('Draw the forces on the front block — then cut the system and watch the contact pair vanish.')) },
  { book: 'class11-physics', chapter: 4, page: 'connected-bodies',
    block: M('fbd', 'string-over-pulley', fbdTask('Isolate one body, then the other. Which forces change and which do not?')) },
  { book: 'class11-physics', chapter: 4, page: 'constraint-equations-fixed-pulley',
    block: M('pulley', 'fixed-pulley', pulleyTask('How many ropes hold the load? Predict the pull before you look.')) },
  { book: 'class11-physics', chapter: 4, page: 'constraint-equations-fixed-pulley',
    block: M('pulley', 'atwood', pulleyTask('Same rope, unequal masses. Does the constraint change?')) },
  { book: 'class11-physics', chapter: 4, page: 'constraint-equations-fixed-pulley',
    block: M('pulley', 'table-and-hanging', pulleyTask('The two bodies move along different axes now. Does the rope care?')) },
  { book: 'class11-physics', chapter: 4, page: 'constraint-equations-movable-pulleys-and-wedges',
    block: M('pulley', 'movable-pulley', pulleyTask('Two rope segments now hold the sheave. Predict how its acceleration compares with the load.')) },
  { book: 'class11-physics', chapter: 4, page: 'constraint-equations-movable-pulleys-and-wedges',
    block: M('pulley', 'block-and-tackle', pulleyTask('Add falls one at a time and watch the coefficient follow.')) },
  { book: 'class11-physics', chapter: 4, page: 'constraint-equations-movable-pulleys-and-wedges',
    block: M('pulley', 'double-atwood', pulleyTask('The upper rope hangs a PULLEY, not a block. Is that pulley fixed?')) },
  { book: 'class11-physics', chapter: 4, page: 'constraint-equations-movable-pulleys-and-wedges',
    block: M('fbd', 'block-on-movable-wedge', fbdTask('Isolate the wedge. What does the block do to it?')) },
  { book: 'class11-physics', chapter: 4, page: 'friction-basics',
    block: M('fbd', 'incline-with-friction', fbdTask('Is this block sliding or stuck? Decide first, then draw friction.')) },
  { book: 'class11-physics', chapter: 4, page: 'friction-pulling-pushing-and-stacked-blocks',
    block: M('fbd', 'two-stacked-blocks', fbdTask('Isolate the TOP block. What is the only horizontal force on it?')) },
  { book: 'class11-physics', chapter: 4, page: 'friction-walls-wedges-and-minimum-force',
    block: M('solve', 'applied-at-angle', fbdTask('Pull at an angle. Watch the normal force — and the friction ceiling — change with it.')) },
  { book: 'class11-physics', chapter: 4, page: 'pseudo-force-and-lift-problems',
    block: M('fbd', 'lift-accelerating', fbdTask('Draw it standing on the ground. Then switch to the lift and draw it again.')) },
  { book: 'class11-physics', chapter: 4, page: 'pseudo-force-and-lift-problems',
    block: M('pulley', 'pulley-on-accelerating-support', pulleyTask('The whole machine is accelerating. What happens to g?')) },
  { book: 'class11-physics', chapter: 4, page: 'pseudo-force-wedges-vehicles-and-pendulums',
    block: M('fbd', 'rotating-drum', fbdTask('You are watching from the ground. Is there an outward force on the rider?')) },
  { book: 'class11-physics', chapter: 4, page: 'circular-dynamics-vertical-circle-and-conical-pendulum',
    block: L('vertical-circle', 'vertical-circle') },
  { book: 'class11-physics', chapter: 4, page: 'circular-dynamics-vertical-circle-and-conical-pendulum',
    block: L('vertical-circle', 'critical-speed') },
  { book: 'class11-physics', chapter: 4, page: 'circular-dynamics-vertical-circle-and-conical-pendulum',
    block: L('circular', 'conical-pendulum') },
  { book: 'class11-physics', chapter: 4, page: 'circular-dynamics-banking-of-roads',
    block: L('banked-road', 'banked-road') },
  // Enrichment — a massive sheave is a JEE trap, not NCERT.
  { book: 'class11-physics', chapter: 4, page: 'constraint-equations-movable-pulleys-and-wedges',
    block: M('pulley', 'pulley-with-mass', { ...pulleyTask('Give the sheave mass. Are the two tensions still equal?'), tier: 'competitive' }) },

  // ══════════════════════════════════════════════════════════════════════════
  // CLASS 11 · Ch.2 — MOTION IN ONE DIMENSION
  // ══════════════════════════════════════════════════════════════════════════
  { book: 'class11-physics', chapter: 2, page: 'instantaneous-velocity', block: L('graphs', 'tangent-vs-chord') },
  { book: 'class11-physics', chapter: 2, page: 'reading-an-x-t-graph', block: L('graphs', 'slope-is-velocity') },
  { book: 'class11-physics', chapter: 2, page: 'reading-an-x-t-graph', block: L('graphs', 'two-flat-lines') },
  { book: 'class11-physics', chapter: 2, page: 'acceleration-the-rate-of-a-rate', block: L('graphs', 'turning-point') },
  { book: 'class11-physics', chapter: 2, page: 'speeding-up-or-slowing-down', block: L('graphs', 'slowing-down-positive-a') },
  { book: 'class11-physics', chapter: 2, page: 'speeding-up-or-slowing-down', block: L('graphs', 'retardation-both-signs') },
  { book: 'class11-physics', chapter: 2, page: 'slope-down-area-up', block: L('graphs', 'area-is-displacement') },
  { book: 'class11-physics', chapter: 2, page: 'slope-down-area-up', block: L('graphs', 'there-and-back') },
  { book: 'class11-physics', chapter: 2, page: 'the-four-motions-drawn-three-ways', block: L('graphs', 'sketch-your-own') },
  { book: 'class11-physics', chapter: 2, page: 'the-four-motions-drawn-three-ways', block: L('graphs', 'match-uniform') },
  { book: 'class11-physics', chapter: 2, page: 'the-four-motions-drawn-three-ways', block: L('graphs', 'match-reversal') },
  { book: 'class11-physics', chapter: 2, page: 'the-three-equations-derived', block: L('graphs', 'uniform-accel-equations') },
  { book: 'class11-physics', chapter: 2, page: 'relative-velocity-in-one-dimension', block: L('graphs', 'frame-swap-1d') },
  { book: 'class11-physics', chapter: 2, page: 'relative-velocity-in-one-dimension', block: L('graphs', 'two-trains') },

  // ══════════════════════════════════════════════════════════════════════════
  // CLASS 11 · Ch.3 — MOTION IN TWO DIMENSIONS
  // ══════════════════════════════════════════════════════════════════════════
  { book: 'class11-physics', chapter: 3, page: 'projectile-motion-setting-it-up', block: L('projectile', 'basic-launch') },
  { book: 'class11-physics', chapter: 3, page: 'projectile-motion-setting-it-up', block: L('projectile', 'independence-of-components') },
  { book: 'class11-physics', chapter: 3, page: 'time-of-flight-height-and-range', block: L('projectile', 'apex-anatomy') },
  { book: 'class11-physics', chapter: 3, page: 'time-of-flight-height-and-range', block: L('projectile', 'apex-gravity') },
  { book: 'class11-physics', chapter: 3, page: 'time-of-flight-height-and-range', block: L('projectile', 'range-vs-angle') },
  { book: 'class11-physics', chapter: 3, page: 'time-of-flight-height-and-range', block: L('projectile', 'same-range-pair') },
  { book: 'class11-physics', chapter: 3, page: 'the-equation-of-the-path', block: L('projectile', 'safety-envelope') },
  { book: 'class11-physics', chapter: 3, page: 'thrown-from-a-height', block: L('projectile', 'launch-from-height') },
  { book: 'class11-physics', chapter: 3, page: 'projectile-problems-that-look-different', block: L('monkey-hunter', 'monkey-hunter') },
  { book: 'class11-physics', chapter: 3, page: 'projectile-problems-that-look-different', block: L('projectile', 'target-practice') },
  { book: 'class11-physics', chapter: 3, page: 'projectile-problems-that-look-different', block: L('relative', 'cart-frame') },
  { book: 'class11-physics', chapter: 3, page: 'projectile-on-an-inclined-plane', block: L('projectile-incline', 'incline-launch') },
  { book: 'class11-physics', chapter: 3, page: 'going-round-in-a-circle', block: L('circular', 'uniform-basics') },
  { book: 'class11-physics', chapter: 3, page: 'going-round-in-a-circle', block: L('circular', 'velocity-is-tangential') },
  { book: 'class11-physics', chapter: 3, page: 'centripetal-acceleration', block: L('circular', 'cut-the-string') },
  { book: 'class11-physics', chapter: 3, page: 'centripetal-acceleration', block: L('circular', 'frame-toggle') },
  { book: 'class11-physics', chapter: 3, page: 'when-the-circle-speeds-up', block: L('circular', 'non-uniform') },
  { book: 'class11-physics', chapter: 3, page: 'crossing-a-river-and-walking-in-the-rain', block: L('graphs', 'river-crossing') },
  { book: 'class11-physics', chapter: 3, page: 'crossing-a-river-and-walking-in-the-rain', block: L('graphs', 'rain-and-man') },

  // ══════════════════════════════════════════════════════════════════════════
  // CLASS 12 · Ch.1 — ELECTROSTATICS
  // ══════════════════════════════════════════════════════════════════════════
  { book: 'class12-physics', chapter: 1, page: 'superposition-more-than-two-charges', block: F('electric', 'sculptor', 'two-like-charges') },
  { book: 'class12-physics', chapter: 1, page: 'the-electric-field', block: F('electric', 'sculptor', 'single-charge') },
  { book: 'class12-physics', chapter: 1, page: 'electric-field-lines', block: F('electric', 'trajectory', 'charge-with-sideways-velocity') },
  { book: 'class12-physics', chapter: 1, page: 'charge-set-free-in-a-uniform-field', block: F('electric', 'trajectory', 'charge-released-from-rest') },
  { book: 'class12-physics', chapter: 1, page: 'the-field-of-a-dipole', block: F('electric', 'sculptor', 'dipole') },
  { book: 'class12-physics', chapter: 1, page: 'electric-flux', block: F('electric', 'gauss', 'gauss-sphere', { allow_drag_surface: true }) },
  { book: 'class12-physics', chapter: 1, page: 'gausss-law', block: F('electric', 'gauss', 'gauss-drag-me', { allow_drag_surface: true }) },
  { book: 'class12-physics', chapter: 1, page: 'gauss-in-action', block: F('electric', 'gauss', 'gauss-off-centre', { allow_drag_surface: true }) },
  { book: 'class12-physics', chapter: 1, page: 'cavities-and-shielding', block: F('electric', 'gauss', 'conductor-cavity') },

  // CLASS 12 · Ch.2 — CAPACITANCE (the only honest fit; see the map's gap note)
  { book: 'class12-physics', chapter: 2, page: 'equipotential-surfaces', block: F('electric', 'sculptor', 'equipotentials') },

  // ══════════════════════════════════════════════════════════════════════════
  // CLASS 12 · Ch.3 — CURRENT ELECTRICITY
  // ══════════════════════════════════════════════════════════════════════════
  { book: 'class12-physics', chapter: 3, page: 'ohms-law-and-resistance', block: C('wire-has-no-drop') },
  { book: 'class12-physics', chapter: 3, page: 'what-a-cell-really-does', block: C('internal-resistance') },
  { book: 'class12-physics', chapter: 3, page: 'resistors-in-series-and-parallel', block: C('series-vs-parallel') },
  { book: 'class12-physics', chapter: 3, page: 'resistors-in-series-and-parallel', block: C('adding-parallel-lowers-R') },
  { book: 'class12-physics', chapter: 3, page: 'reading-a-circuit-you-have-not-seen-before', block: C('ugly-redraw') },
  { book: 'class12-physics', chapter: 3, page: 'reading-a-circuit-you-have-not-seen-before', block: C('symmetry-shortcut') },
  { book: 'class12-physics', chapter: 3, page: 'reading-a-circuit-you-have-not-seen-before', block: C('infinite-ladder', { tier: 'competitive' }) },
  { book: 'class12-physics', chapter: 3, page: 'kirchhoffs-two-laws', block: C('wheatstone-unbalanced') },
  { book: 'class12-physics', chapter: 3, page: 'power-and-the-heating-effect', block: C('bulb-brightness') },
  { book: 'class12-physics', chapter: 3, page: 'power-and-the-heating-effect', block: C('current-not-used-up') },
  { book: 'class12-physics', chapter: 3, page: 'power-and-the-heating-effect', block: C('short-circuit') },
  { book: 'class12-physics', chapter: 3, page: 'the-wheatstone-bridge', block: C('wheatstone-balanced') },
  { book: 'class12-physics', chapter: 3, page: 'the-potentiometer', block: C('potentiometer') },
  { book: 'class12-physics', chapter: 3, page: 'inside-a-meter', block: C('meter-loading') },

  // ══════════════════════════════════════════════════════════════════════════
  // CLASS 12 · Ch.5 — MAGNETIC EFFECTS (thin: the source models are missing)
  // ══════════════════════════════════════════════════════════════════════════
  { book: 'class12-physics', chapter: 5, page: 'the-lorentz-force-and-the-velocity-selector', block: F('magnetic', 'trajectory', 'velocity-selector') },
  { book: 'class12-physics', chapter: 5, page: 'circular-motion-in-a-magnetic-field', block: F('magnetic', 'trajectory', 'uniform-B-circular') },
  { book: 'class12-physics', chapter: 5, page: 'the-cyclotron', block: F('magnetic', 'trajectory', 'cyclotron') },

  // ══════════════════════════════════════════════════════════════════════════
  // CLASS 12 · Ch.6 — ELECTROMAGNETIC INDUCTION (complete coverage)
  // ══════════════════════════════════════════════════════════════════════════
  { book: 'class12-physics', chapter: 6, page: 'emi-magnetic-flux', block: F('magnetic', 'emi', 'loop-tilt-flux') },
  { book: 'class12-physics', chapter: 6, page: 'emi-faradays-law', block: F('magnetic', 'emi', 'flux-not-flux-rate') },
  { book: 'class12-physics', chapter: 6, page: 'emi-lenzs-law', block: F('magnetic', 'emi', 'lenz-both-ways') },
  { book: 'class12-physics', chapter: 6, page: 'emi-reading-a-lenz-situation', block: F('magnetic', 'emi', 'flux-machine') },
  { book: 'class12-physics', chapter: 6, page: 'emi-motional-emf', block: F('magnetic', 'emi', 'motional-emf-rod') },
  { book: 'class12-physics', chapter: 6, page: 'emi-motional-emf-geometries', block: F('magnetic', 'emi', 'rod-terminal-velocity') },
  { book: 'class12-physics', chapter: 6, page: 'emi-the-energy-account', block: F('magnetic', 'emi', 'motional-power-balance') },
  { book: 'class12-physics', chapter: 6, page: 'emi-eddy-currents', block: F('magnetic', 'emi', 'eddy-brake-solid') },
  { book: 'class12-physics', chapter: 6, page: 'emi-eddy-currents', block: F('magnetic', 'emi', 'eddy-slotted-plate') },
  { book: 'class12-physics', chapter: 6, page: 'emi-self-inductance', block: F('magnetic', 'emi', 'self-inductance-ramp') },
  { book: 'class12-physics', chapter: 6, page: 'emi-mutual-inductance', block: F('magnetic', 'emi', 'mutual-inductance-pair') },
  { book: 'class12-physics', chapter: 6, page: 'emi-the-lr-circuit', block: C('lr-current-growth') },
  { book: 'class12-physics', chapter: 6, page: 'emi-the-ac-generator', block: F('magnetic', 'emi', 'ac-generator-loop') },

  // ══════════════════════════════════════════════════════════════════════════
  // CLASS 12 · Ch.7 — ALTERNATING CURRENT (complete coverage)
  // ══════════════════════════════════════════════════════════════════════════
  { book: 'class12-physics', chapter: 7, page: 'ac-lc-oscillations', block: C('lc-oscillation') },
  { book: 'class12-physics', chapter: 7, page: 'ac-rms-and-peak-values', block: C('rms-not-average') },
  { book: 'class12-physics', chapter: 7, page: 'ac-phasors', block: C('phasor-is-the-waveform') },
  { book: 'class12-physics', chapter: 7, page: 'ac-through-a-resistor', block: C('ac-resistor-only') },
  { book: 'class12-physics', chapter: 7, page: 'ac-through-an-inductor', block: C('ac-inductor-only') },
  { book: 'class12-physics', chapter: 7, page: 'ac-through-a-capacitor', block: C('ac-capacitor-only') },
  { book: 'class12-physics', chapter: 7, page: 'ac-through-a-capacitor', block: C('capacitor-frequency-gate') },
  { book: 'class12-physics', chapter: 7, page: 'ac-series-lr-and-cr', block: C('reactance-vs-frequency') },
  { book: 'class12-physics', chapter: 7, page: 'ac-series-lcr-circuit', block: C('series-lcr-phasor') },
  { book: 'class12-physics', chapter: 7, page: 'ac-resonance', block: C('lcr-resonance') },
  { book: 'class12-physics', chapter: 7, page: 'ac-sharpness-of-resonance', block: C('lcr-damping') },
  { book: 'class12-physics', chapter: 7, page: 'ac-power-and-power-factor', block: C('power-factor') },
  { book: 'class12-physics', chapter: 7, page: 'ac-transformers', block: C('transformer-turns-ratio') },
  { book: 'class12-physics', chapter: 7, page: 'ac-transformers', block: C('transmission-at-high-voltage') },
];

module.exports = { PLACEMENTS };
