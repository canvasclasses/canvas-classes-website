/*
 * verify-fbd-fill.mjs — MEASURES how much of each FBD board the diagram fills.
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO RUN
 *
 *     node scripts/verify-fbd-fill.mjs
 *
 * WHY THIS EXISTS. "The diagram is tiny" and "the diagram is clipped" are the
 * same bug seen from two sides, and both are invisible to tsc, to eslint and to
 * the physics verifier. The 2026-07-29 browser sweep measured a Draw board
 * drawing into 7.7% of its own area, and `string-over-pulley` overflowing its
 * viewBox by 18% vertically — i.e. being silently cropped.
 *
 * So the camera math lives in `fbd/fit.ts` (pure TS, no JSX) and this script
 * runs it over EVERY archetype at a desktop board and a phone board, computes
 * the content box in screen pixels, and fails if anything overflows or is left
 * swimming in whitespace. Fill is reported LINEARLY (per axis), because that is
 * what the eye reads — an area figure makes a tall narrow diagram look broken
 * when it is correct.
 *
 * Requires Node ≥ 22.6, same `registerHooks` TS shim as the other verifiers.
 * Exits non-zero on any failure.
 */

import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

registerHooks({
  resolve(spec, ctx, next) {
    if ((spec.startsWith('./') || spec.startsWith('../')) && ctx.parentURL) {
      const base = fileURLToPath(new URL(spec, ctx.parentURL));
      // A bare './foo' may be a missing extension OR a directory. Try both:
      // native ESM resolution does neither.
      for (const ext of ['', '.ts', '.tsx', '/index.ts']) {
        if (ext === '' && existsSync(base) && !base.endsWith('.ts')) continue;
        if (existsSync(base + ext) && (base + ext).endsWith('.ts')) {
          return { url: pathToFileURL(base + ext).href, shortCircuit: true };
        }
      }
    }
    return next(spec, ctx);
  },
});

const ROOT = new URL('../packages/book-renderer/blocks/mechanics-bench/', import.meta.url).href;
const { FBD_ARCHETYPES, FBD_ARCHETYPE_ORDER } = await import(`${ROOT}archetypes.fbd.ts`);
const { normalizeScene } = await import(`${ROOT}lib/scene.ts`);
const { fitView, worldToScreen } = await import(`${ROOT}lib/svg.ts`);
const { mixedBounds, sceneWorldBounds, localBounds, FIT_PAD } = await import(`${ROOT}fbd/fit.ts`);
const { arrowRefPx, nPerPx, appliedArrowPx } = await import(`${ROOT}fbd/fit.ts`);
const { localOutline, bodyRadius, findBody, DEG } = await import(`${ROOT}fbd/sceneEdit.ts`);

// The two boards the layout actually produces, both measured in a browser
// rather than assumed. Desktop: the 7fr canvas column of a 1440px window, at
// the 3:2 aspect `StagePanels` gives it. Phone: a 375px stage, whose content
// box after the sim shell's padding is 325 — stacked to ONE column, so the
// board gets all of it, at 4:3 floored by `minHeight: 250`.
const BOARDS = [
  { name: 'desktop 613×409', w: 613, h: 409 },
  { name: 'phone   325×250', w: 325, h: 250 },
];

// A diagram that fills less than this on BOTH axes is lost in whitespace; more
// than 100% on either is being cropped. The brief asked for ~60–75% linear on
// the binding axis, so the floor is set below that to leave honest headroom for
// scenes that genuinely are tall and narrow (a two-force vertical FBD is).
const MIN_BINDING_FILL = 0.55;
const MAX_FILL = 1.0;

let pass = 0, fail = 0;
const rows = [];

const check = (name, ok, detail) => {
  ok ? pass++ : fail++;
  if (!ok) console.log(`FAIL  ${name}\n      ${detail}`);
};

/** Screen-space box of a fitted content bounds, as a fraction of the board. */
function fillOf(bounds, w, h) {
  const view = fitView(bounds, w, h, { padFrac: FIT_PAD, maxScale: 4000, minScale: 1 });
  const a = worldToScreen({ x: bounds.minX, y: bounds.maxY }, view);
  const b = worldToScreen({ x: bounds.maxX, y: bounds.minY }, view);
  return { fx: Math.abs(b.x - a.x) / w, fy: Math.abs(b.y - a.y) / h, scale: view.scale };
}

const pct = (v) => `${(v * 100).toFixed(0)}%`;

console.log('\nFBD canvas fill — measured, not eyeballed');
console.log('─'.repeat(96));
console.log('archetype                 board            COMPOSE (x × y)      DRAW (x × y)');
console.log('─'.repeat(96));

for (const id of FBD_ARCHETYPE_ORDER) {
  const arch = FBD_ARCHETYPES[id];
  const scene = normalizeScene(arch.buildScene({}));
  const bodyId = arch.defaultBody ?? scene.bodies[0].id;
  const body = findBody(scene, bodyId);

  for (const board of BOARDS) {
    const { w, h } = board;
    const refPx = arrowRefPx(w, h);

    // ── COMPOSE / CUT: the world canvas, plus any composed push arrows.
    const worldSpurs = (scene.applied ?? []).flatMap((a) => {
      const b = findBody(scene, a.body);
      return b ? [{ at: b.pos, angleDeg: a.angleDeg, px: appliedArrowPx(a.mag, refPx) }] : [];
    });
    const composeB = mixedBounds(sceneWorldBounds(scene), worldSpurs, w, h);
    const compose = fillOf(composeB, w, h);

    // ── DRAW: the isolated body plus a realistic student diagram — weight down
    //    and the normal along its real contact, both at full reference length.
    //    That is the worst case the board has to hold without cropping.
    const rot = body.shape === 'wedge' ? 0 : (body.angleDeg ?? 0) * DEG;
    const outline = localOutline(body).map((p) => ({
      x: p.x * Math.cos(rot) - p.y * Math.sin(rot),
      y: p.x * Math.sin(rot) + p.y * Math.cos(rot),
    }));
    const perPx = nPerPx(body.mass * (scene.g ?? 9.8), refPx);
    const normalDeg = scene.contacts.find((c) => c.bodyA === bodyId)?.normalDeg ?? 90;
    const drawSpurs = [
      { at: { x: 0, y: 0 }, angleDeg: 270, px: (body.mass * 9.8) / perPx },
      { at: { x: 0, y: 0 }, angleDeg: normalDeg, px: (body.mass * 9.8) / perPx },
      // the always-on floor `DrawStage` reserves so placement never re-frames
      ...[0, 90, 180, 270].map((d) => ({ at: { x: 0, y: 0 }, angleDeg: d, px: refPx * 0.55 })),
    ];
    const drawB = mixedBounds(localBounds(outline, bodyRadius(body)), drawSpurs, w, h);
    const draw = fillOf(drawB, w, h);

    rows.push([id, board.name, compose, draw]);

    for (const [stage, f] of [['compose', compose], ['draw', draw]]) {
      check(`${id} / ${board.name} / ${stage} does not overflow`,
        f.fx <= MAX_FILL + 1e-6 && f.fy <= MAX_FILL + 1e-6,
        `content is ${pct(f.fx)} × ${pct(f.fy)} of the board — anything over 100% is cropped`);
      check(`${id} / ${board.name} / ${stage} is not lost in whitespace`,
        Math.max(f.fx, f.fy) >= MIN_BINDING_FILL,
        `binding axis fills only ${pct(Math.max(f.fx, f.fy))} (floor ${pct(MIN_BINDING_FILL)})`);
    }
  }
}

for (const [id, board, c, d] of rows) {
  console.log(
    `${id.padEnd(25)} ${board.padEnd(16)} ${(pct(c.fx) + ' × ' + pct(c.fy)).padEnd(20)} ${pct(d.fx)} × ${pct(d.fy)}`
  );
}

console.log('─'.repeat(96));
console.log(`${pass}/${pass + fail} checks passed`);
process.exit(fail ? 1 : 0);
