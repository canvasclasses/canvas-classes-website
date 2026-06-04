// theme.ts — shared design tokens for the Vector Lab.
// Values are copied verbatim from SIMULATION_DESIGN_WORKFLOW.md so the lab is
// indistinguishable from the rest of the Canvas Classes interactive labs.
// Do NOT invent new colors here — every value below has a §3 entry.

export const C = {
  // Background hierarchy (§1)
  root: '#0d1117',
  card: '#0B0F15',
  surface: '#151E32',

  // Indigo — primary interactive (§3)
  indigo: '#6366f1',
  indigoMid: '#818cf8',
  indigoLight: '#c4b5fd',
  indigoDeep: '#4338ca',

  // Semantic accents (§3)
  emerald: '#10b981',
  emeraldLight: '#34d399',
  emeraldPale: '#6ee7b7',
  amber: '#fbbf24',
  amberDark: '#d97706',
  red: '#f87171',
  redDark: '#dc2626',
  pink: '#f472b6',
  violet: '#7c3aed',
  violetMid: '#8b5cf6',

  // Text & border hierarchy (§3)
  text: '#e2e8f0',
  text2: '#94a3b8',
  muted: '#475569',
  ghost: '#64748b',
  divider: 'rgba(255,255,255,0.05)',
  cardBorder: 'rgba(255,255,255,0.07)',
} as const;

/** Per-vector colours so every arrow reads the same across all 9 modules. */
export const VEC = {
  A: { stroke: '#818cf8', label: 'A' }, // indigo  — first vector
  B: { stroke: '#fbbf24', label: 'B' }, // amber   — second vector
  R: { stroke: '#34d399', label: 'R' }, // emerald — resultant
  negB: { stroke: '#f472b6', label: '−B' }, // pink — reversed vector (subtraction)
  wrong: { stroke: '#f87171', label: '✗' }, // red  — the common-mistake ghost
  comp: { stroke: '#64748b', label: '' }, // ghost — dashed component guides
} as const;

// Canvas viewport used by every phase that draws an arrow diagram.
export const VIEW = {
  w: 460,
  h: 420,
  // Origin sits left-of-centre, vertically centred, leaving room for a
  // resultant that grows to the upper-right (the common teaching layout).
  originX: 150,
  originY: 250,
  // Pixels per physical unit (N, m/s, …). One slider "unit" → this many px.
  scale: 18,
};

export const canvasStyle: React.CSSProperties = {
  background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
  border: '1px solid rgba(99,102,241,0.2)',
  borderRadius: 24,
};
