/**
 * Space-utilisation audit for every `vector_board` archetype.
 *
 * Founder, 2026-07-29: "since we are working in only one quadrant of this
 * coordinate system for the vectors, the rest of the three quadrants (that is,
 * 75% of the space) are being wasted… adjust the coordinates so the origin is
 * near the left bottom, so the vectors can be bigger."
 *
 * This measures the claim instead of guessing at it. For each archetype it runs
 * the real `build()` at the final step, collects EVERY drawn point (arrow tails
 * and tips, guide ends, the resultant), and reports:
 *
 *   ink%      — area of the drawn bounding box as a % of the 460×420 canvas
 *   scale     — the px-per-unit the current frame hints produce
 *   bestScale — the px-per-unit an OPTIMALLY anchored frame would allow
 *   gain      — bestScale / scale, i.e. "the drawing could be this much bigger"
 *
 * The audit imports the REAL `computeFrame` from the pure frame module, so it
 * cannot drift out of sync with what the boards actually render.
 *
 * Run:  npx tsx scripts/audit/_vector_board_space_audit.mts
 */
import { ARCHETYPES, seedVectors, type ArchetypeDef } from '@canvas/book-renderer/vector-board';

import { computeFrame, computeContentBox, VIEW } from '@canvas/book-renderer/vector-board-frame';

const PAD = 44;

const rows: any[] = [];

for (const [id, def] of Object.entries(ARCHETYPES) as [string, ArchetypeDef][]) {
  const specs = def.defaultVectors;
  const vecs = seedVectors(specs);
  const steps = def.defaultSteps?.length ?? 1;
  const frame = computeFrame(def, specs, {});

  let res: any;
  try {
    res = def.build({
      vecs, specs, units: 'N', params: {}, step: steps + 1, t: 1,
      show: { grid: true, axes: true, components: true, angleArc: true, readout: true, formula: true, compass: false },
    } as any);
  } catch (e: any) {
    rows.push({ id, error: e.message });
    continue;
  }

  // Collect every point the archetype actually draws, in WORLD units.
  const pts: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  for (const a of res.arrows ?? []) { pts.push(a.from, a.to); }
  for (const g of res.guides ?? []) { pts.push(g.from, g.to); }
  if (res.resultant) pts.push(res.resultant);

  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const wU = maxX - minX, hU = maxY - minY;

  // Ink as drawn now.
  const inkW = wU * frame.scale, inkH = hU * frame.scale;
  const inkPct = Math.round((inkW * inkH) / (VIEW.w * VIEW.h) * 100);

  // The best a perfectly-anchored frame could do for this exact content.
  const bestScale = Math.min((VIEW.w - 2 * PAD) / (wU || 1), (VIEW.h - 2 * PAD) / (hU || 1));
  const gain = bestScale / frame.scale;

  rows.push({
    id, quadrantHint: def.frameQuadrant ? 'yes' : '—', anchorHint: def.frameAnchor ? 'yes' : '—',
    worldBox: `${minX.toFixed(1)}..${maxX.toFixed(1)} × ${minY.toFixed(1)}..${maxY.toFixed(1)}`,
    inkPct, scale: +frame.scale.toFixed(1), bestScale: +bestScale.toFixed(1), gain: +gain.toFixed(2),
  });
}

const pad = (s: any, n: number) => String(s).padEnd(n);
console.log('\nvector_board — space utilisation (canvas 460×420, pad 40)\n');
console.log(pad('archetype', 22) + pad('anchor', 8) + pad('quad', 6) + pad('world extent', 26) + pad('ink%', 6) + pad('scale', 7) + pad('best', 7) + 'gain');
console.log('─'.repeat(96));
for (const r of rows.sort((a, b) => (b.gain ?? 0) - (a.gain ?? 0))) {
  if (r.error) { console.log(pad(r.id, 22) + 'ERROR ' + r.error); continue; }
  const flag = r.gain >= 1.5 ? '  ⚠️ ' + Math.round((r.gain - 1) * 100) + '% bigger possible' : r.gain >= 1.2 ? '  ·' : '';
  console.log(pad(r.id, 22) + pad(r.anchorHint, 8) + pad(r.quadrantHint, 6) + pad(r.worldBox, 26) + pad(r.inkPct + '%', 6) + pad(r.scale, 7) + pad(r.bestScale, 7) + r.gain + flag);
}
const wasteful = rows.filter((r) => !r.error && r.gain >= 1.5);
console.log(`\n${wasteful.length} of ${rows.length} archetypes could be ≥50% bigger at the same canvas size.`);
console.log('Median ink coverage: ' + (() => {
  const v = rows.filter((r) => !r.error).map((r) => r.inkPct).sort((a, b) => a - b);
  return v[Math.floor(v.length / 2)] + '%';
})() + '\n');
