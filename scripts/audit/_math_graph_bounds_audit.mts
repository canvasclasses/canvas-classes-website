/**
 * Coverage + sanity audit for `ARCHETYPE_DEFAULT_BOUNDS`.
 *
 * The bounds cannot be derived by running the archetypes headlessly — they build
 * JSXGraph elements, which need a DOM. So this audit checks the things that CAN
 * be checked mechanically, and which is where the real defects hid:
 *
 *   1. COVERAGE — every archetype in ARCHETYPES has a bounds entry. A missing
 *      entry silently falls back to the generic ±6 box, which is the whole bug.
 *   2. VALIDITY — finite numbers, xmin < xmax, ymin < ymax, non-degenerate.
 *   3. ASPECT — any entry that does NOT opt out of keepSquare must already be
 *      near-square, because JSXGraph will otherwise stretch one axis and the
 *      authored box is a lie about what the student sees.
 *   4. PARAMS-AWARENESS — entries declared as functions are exercised against
 *      several plausible param sets, so an `r` override cannot reintroduce the
 *      "tiny circle in a huge box" defect.
 *
 * Run:  npx tsx scripts/audit/_math_graph_bounds_audit.mts
 */
import { ARCHETYPES, ARCHETYPE_DEFAULT_BOUNDS, resolveArchetypeBounds } from '@canvas/book-renderer/math-graph-archetypes';

const PARAM_SETS: Record<string, any>[] = [
  {},
  { r: 1 }, { r: 2 }, { r: 5 },
  { shape: 'parabola' }, { shape: 'circle' },
  { base: 'sin' }, { base: 'cube' }, { base: 'square' },
  { demo: 'sine' }, { demo: 'parabola' },
  { kind: 'gp' }, { kind: 'ap' },
  { constrainD: false },
  { n: 12 }, { terms: 12 }, { b: 8, h: 5, s: 3 }, { c: 3 },
];

/**
 * Closed-form content extents for the archetypes whose drawn geometry can be
 * stated exactly. The bounds MUST contain these, or the construction is clipped
 * — which is not merely wasteful, it hides part of the proof. Two entries here
 * (the circle-area strip and the Gauss staircase) were genuinely clipped by the
 * old generic ±6 box, and that is what this assertion exists to prevent.
 */
const CONTENT: { name: string; params: Record<string, any>; x0: number; x1: number; y0: number; y1: number; note: string }[] = [
  { name: 'unit-circle', params: {}, x0: -1, x1: 1, y0: -1, y1: 1, note: 'unit disc' },
  { name: 'sector-explorer', params: {}, x0: -3, x1: 3, y0: -3, y1: 3, note: 'r = 3 disc' },
  { name: 'sector-explorer', params: { r: 5 }, x0: -5, x1: 5, y0: -5, y1: 5, note: 'r = 5 disc' },
  { name: 'inscribed-angle-explorer', params: {}, x0: -3, x1: 3, y0: -3, y1: 3, note: 'r = 3 disc' },
  { name: 'chord-distance-explorer', params: {}, x0: -3, x1: 3, y0: -3, y1: 3, note: 'r = 3 disc' },
  { name: 'circle-anatomy-explorer', params: {}, x0: -3, x1: 3, y0: -3, y1: 3, note: 'r = 3 disc' },
  { name: 'chord-perpendicular-bisector', params: {}, x0: -3, x1: 3, y0: -3, y1: 3, note: 'r = 3 disc' },
  { name: 'circle-symmetry-explorer', params: {}, x0: -3, x1: 3, y0: -3, y1: 3, note: 'r = 3 disc' },
  { name: 'cyclic-quad-explorer', params: {}, x0: -3, x1: 3, y0: -3, y1: 3, note: 'r = 3 disc' },
  { name: 'cyclic-quad-explorer', params: { constrainD: false }, x0: -4.2, x1: 4.2, y0: -4.2, y1: 4.2, note: 'D starts at 1.4r' },
  { name: 'vlt-sweep', params: {}, x0: -3, x1: 3, y0: -3, y1: 3, note: 'r = 3 disc' },
  // WAS CLIPPED: strip is 2πr wide, circle centre at y = 1.7r so rim reaches 2.7r.
  { name: 'circle-area-slice-rearrange', params: {}, x0: -Math.PI * 3, x1: Math.PI * 3, y0: -3, y1: 3 * 2.7, note: 'strip 2πr wide + circle at 1.7r' },
  // WAS CLIPPED: Gauss rectangle is n × (n+1), n reaches 12.
  { name: 'sum-pairing-proof', params: { n: 12 }, x0: 0, x1: 12, y0: 0, y1: 13, note: 'n × (n+1) rectangle' },
  { name: 'surd-spiral-construction', params: {}, x0: -4.2, x1: 1.5, y0: -1, y1: 4.2, note: 'spiral out to √17' },
  { name: 'parallelogram-to-rectangle', params: {}, x0: 0, x1: 7, y0: 0, y1: 3, note: 'b + s wide, h tall' },
  { name: 'triangle-pair-to-parallelogram', params: {}, x0: 0, x1: 6.5, y0: 0, y1: 3, note: 'b + c wide, h tall' },
  { name: 'trial-convergence', params: {}, x0: 1, x1: 200, y0: 0, y1: 1, note: '200 trials, p in [0,1]' },
  { name: 'distance-explorer', params: {}, x0: 1, x1: 6, y0: 1, y1: 5, note: 'seed points P, Q' },
  { name: 'midpoint-explorer', params: {}, x0: -2, x1: 4, y0: 1, y1: 5, note: 'seed points P, Q' },
  { name: 'collinearity-checker', params: {}, x0: -3, x1: 5, y0: -2, y1: 4, note: 'seed points A, B, C' },
  { name: 'circumcircle-explorer', params: {}, x0: -2.6, x1: 3.6, y0: -2.6, y1: 2.6, note: 'seed triangle + circumcircle' },
  { name: 'exp-base-explorer', params: {}, x0: -3, x1: 3, y0: 0, y1: 6, note: 'y = 2^x over the readable range' },
  { name: 'piecewise-highlight', params: {}, x0: -4, x1: 4, y0: 0, y1: 4, note: '|x| across the full width' },
  { name: 'reflection', params: { x: 3, y: 4 }, x0: -3, x1: 3, y0: -4, y1: 4, note: 'P and its mirror' },
];

/**
 * Extra invariants for the boards that ship on LIVE pages, keyed to those pages'
 * actual params. Both of these were real regressions caught during the
 * 2026-07-29 pass and would have shipped silently.
 */
const LIVE_INVARIANTS: { name: string; params: Record<string, any>; check: (b: any) => string | null; why: string }[] = [
  {
    name: 'distance-explorer', params: { x1: 1, y1: 1, x2: 6, y2: 5 },
    why: 'live Class 9 distance-formula page — the axes must be on screen',
    check: (b) => (b.xmin <= 0 && b.ymin <= 0 ? null : `origin outside the box (xmin ${b.xmin.toFixed(2)}, ymin ${b.ymin.toFixed(2)})`),
  },
  {
    name: 'midpoint-explorer', params: { x1: -2, y1: 5, x2: 6, y2: -3 },
    why: 'live Class 9 midpoint page — the axes must be on screen',
    check: (b) => (b.xmin <= 0 && b.ymin <= 0 ? null : 'origin outside the box'),
  },
  {
    name: 'sequence-pattern', params: { kind: 'ap', a: 1, d: 2, terms: 6 },
    why: 'live Class 9 linear-patterns page — terms run 1..11, so the box must hug them',
    check: (b) => (b.ymax <= 20 && b.ymax >= 11 ? null : `y range framed for the slider max, not the seed (ymax ${b.ymax.toFixed(1)}, terms reach 11)`),
  },
  {
    name: 'sequence-pattern', params: { kind: 'ap', a: 6, d: 5, terms: 8 },
    why: 'the hexagon-matchstick page — terms run 6..41',
    check: (b) => (b.ymax >= 41 ? null : `clips the last term (ymax ${b.ymax.toFixed(1)} < 41)`),
  },
];

let liveFails = 0;
const liveRows: string[] = [];
for (const inv of LIVE_INVARIANTS) {
  const b = resolveArchetypeBounds(inv.name, inv.params as any);
  const msg = b ? inv.check(b) : 'no bounds';
  const label = `${inv.name} ${JSON.stringify(inv.params)}`;
  if (msg) { liveFails++; liveRows.push(`  ✗ ${label}\n      ${msg}\n      (${inv.why})`); }
  else liveRows.push(`  ✓ ${label.padEnd(62)} ${inv.why}`);
}

// A default must never be WORSE than the generic ±6 box it replaces.
const NOT_WORSE_THAN_DEFAULT = [
  { name: 'reflection', params: { x: 3, y: 4 } },
  { name: 'step-explorer', params: {} },
  { name: 'piecewise-highlight', params: {} },
  { name: 'exp-base-explorer', params: {} },
];
let worse = 0;
const worseRows: string[] = [];
for (const c of NOT_WORSE_THAN_DEFAULT) {
  const b = resolveArchetypeBounds(c.name, c.params as any)!;
  const span = Math.max(b.xmax - b.xmin, b.ymax - b.ymin);
  const label = `${c.name} ${JSON.stringify(c.params)}`;
  if (span > 12) { worse++; worseRows.push(`  ✗ ${label.padEnd(46)} span ${span.toFixed(1)} — WIDER than the generic 12 it replaces`); }
  else worseRows.push(`  ✓ ${label.padEnd(46)} span ${span.toFixed(1)} vs generic 12`);
}

let clipped = 0;
const clipRows: string[] = [];
for (const c of CONTENT) {
  const b = resolveArchetypeBounds(c.name, c.params as any);
  if (!b) { clipped++; clipRows.push(`  ✗ ${c.name} — no bounds`); continue; }
  const fails: string[] = [];
  if (b.xmin > c.x0) fails.push(`xmin ${b.xmin.toFixed(2)} > ${c.x0.toFixed(2)}`);
  if (b.xmax < c.x1) fails.push(`xmax ${b.xmax.toFixed(2)} < ${c.x1.toFixed(2)}`);
  if (b.ymin > c.y0) fails.push(`ymin ${b.ymin.toFixed(2)} > ${c.y0.toFixed(2)}`);
  if (b.ymax < c.y1) fails.push(`ymax ${b.ymax.toFixed(2)} < ${c.y1.toFixed(2)}`);
  // How much of the box width the content actually uses.
  const use = Math.round(((c.x1 - c.x0) / (b.xmax - b.xmin)) * 100);
  const label = `${c.name}${Object.keys(c.params).length ? ' ' + JSON.stringify(c.params) : ''}`;
  if (fails.length) { clipped++; clipRows.push(`  ✗ CLIPPED ${label.padEnd(48)} ${fails.join(', ')}`); }
  else clipRows.push(`  ✓ ${label.padEnd(48)} uses ${String(use).padStart(3)}% of width   (${c.note})`);
}

const names = Object.keys(ARCHETYPES);
let missing = 0, invalid = 0, aspect = 0;
const rows: string[] = [];

for (const name of names) {
  if (!(name in ARCHETYPE_DEFAULT_BOUNDS)) {
    missing++;
    rows.push(`  ✗ ${name.padEnd(34)} NO BOUNDS ENTRY — falls back to the generic ±6 box`);
    continue;
  }
  const seen: string[] = [];
  let worstAspect = 1;
  let bad = '';
  for (const ps of PARAM_SETS) {
    let b;
    try {
      b = resolveArchetypeBounds(name, ps as any);
    } catch (e: any) {
      bad = `threw on ${JSON.stringify(ps)}: ${e.message}`;
      break;
    }
    if (!b) { bad = `resolved to undefined on ${JSON.stringify(ps)}`; break; }
    const { xmin, xmax, ymin, ymax } = b;
    if (![xmin, xmax, ymin, ymax].every(Number.isFinite)) { bad = `non-finite on ${JSON.stringify(ps)}`; break; }
    if (xmax - xmin < 0.2 || ymax - ymin < 0.2) { bad = `degenerate span on ${JSON.stringify(ps)}`; break; }
    const w = xmax - xmin, h = ymax - ymin;
    const ar = Math.max(w / h, h / w);
    if (b.keepSquare !== false) worstAspect = Math.max(worstAspect, ar);
    const key = `${w.toFixed(1)}×${h.toFixed(1)}`;
    if (!seen.includes(key)) seen.push(key);
  }
  if (bad) { invalid++; rows.push(`  ✗ ${name.padEnd(34)} ${bad}`); continue; }

  const isFn = typeof ARCHETYPE_DEFAULT_BOUNDS[name] === 'function';
  const squareFlag = worstAspect > 1.25 ? `  ⚠️ aspect ${worstAspect.toFixed(2)} but keepSquare not disabled` : '';
  if (squareFlag) aspect++;
  rows.push(`  ${squareFlag ? '⚠' : '✓'} ${name.padEnd(34)} ${isFn ? 'params-aware' : 'static      '}  spans: ${seen.slice(0, 4).join('  ')}${squareFlag}`);
}

console.log(`\nmath_graph default-bounds audit — ${names.length} archetypes\n`);
rows.sort().forEach((r) => console.log(r));

const extra = Object.keys(ARCHETYPE_DEFAULT_BOUNDS).filter((k) => !names.includes(k));
if (extra.length) console.log(`\n  ⚠️ bounds entries with no matching archetype: ${extra.join(', ')}`);

console.log('\ncontent-containment (bounds must not clip the construction):\n');
clipRows.forEach((r) => console.log(r));

console.log('\nno-regression (must beat the generic ±6 box):\n');
worseRows.forEach((r) => console.log(r));

console.log('\nlive-page invariants:\n');
liveRows.forEach((r) => console.log(r));

console.log(`\ncoverage: ${names.length - missing}/${names.length}` +
  `   invalid: ${invalid}   aspect warnings: ${aspect}   clipped: ${clipped}   live-invariant failures: ${liveFails}   regressions: ${worse}`);
const ok = missing === 0 && invalid === 0 && aspect === 0 && extra.length === 0 && clipped === 0 && liveFails === 0 && worse === 0;
console.log(ok ? '\n✅ every archetype has valid, aspect-consistent default bounds\n' : '\n❌ issues above\n');
process.exit(ok ? 0 : 1);
