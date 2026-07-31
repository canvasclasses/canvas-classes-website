/*
 * verify-fbd-scene-edits.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Regression guard for a WRONG-ANSWER bug found in browser QA on 2026-07-29.
 *
 * `Contact.slidingSign` asserts a FACT about the current motion (±1 = "this is
 * really sliding, so friction is kinetic and its direction is known"). That
 * fact follows from the geometry — so when the student drags the incline angle
 * or changes μ, it goes stale. A contact marked "sliding down" at 35° stayed
 * marked that way at 10°, where friction actually holds the block, and the
 * engine then reported a block accelerating UP a 10° slope.
 *
 * The fix is NOT to guess the new sliding state, it is to reset it to 0
 * ("undetermined") and let `solveScene`'s assumption-then-test loop resolve it:
 * assume static, compare the demanded friction against μₛN, and flip to kinetic
 * with the implied sense only when the assumption breaks.
 *
 * Run: node scripts/verify-fbd-scene-edits.mjs      (needs Node ≥ 22.6)
 */

import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

registerHooks({
  resolve(spec, ctx, next) {
    if ((spec.startsWith('./') || spec.startsWith('../')) && ctx.parentURL) {
      const base = fileURLToPath(new URL(spec, ctx.parentURL));
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
const { FBD_ARCHETYPES } = await import(`${ROOT}archetypes.fbd.ts`);
const { normalizeScene } = await import(`${ROOT}lib/scene.ts`);
const { solveScene } = await import(`${ROOT}lib/dynamics.ts`);
const { setWedgeAngle, setFriction } = await import(`${ROOT}fbd/sceneEdit.ts`);

let pass = 0, fail = 0;
const rows = [];
function check(name, got, want, note = '') {
  const ok = typeof want === 'function' ? want(got) : Object.is(got, want);
  rows.push([ok ? 'PASS' : 'FAIL', name, String(got), String(typeof want === 'function' ? '(predicate)' : want), note]);
  ok ? pass++ : fail++;
}

const wedgeOf = (s) => s.bodies.find((b) => b.shape === 'wedge');
const blockOf = (s) => s.bodies.find((b) => b.shape === 'block');
const g = 9.8;

// ── The reported case: incline-with-friction, dragged 35° → 10° ──────────────
// At μs = 0.375 the block slides while tan(35°) = 0.700 > 0.375, and is held
// once tan(10°) = 0.176 < 0.375. Down-slope is the block's +dof direction, so a
// NEGATIVE acceleration would mean "accelerating up the slope" — the bug.
{
  const a0 = FBD_ARCHETYPES['incline-with-friction'];
  const s35 = normalizeScene(a0.buildScene());
  const w = wedgeOf(s35), b = blockOf(s35);
  const sol35 = solveScene(s35);
  const a35 = sol35.accelerations[b.id];
  check('35° slides down-slope (a > 0)', +a35.toFixed(4), (v) => v > 0.5, 'tanθ=0.700 > μs');

  const s10 = normalizeScene(setWedgeAngle(s35, w.id, 10));
  const sol10 = solveScene(s10);
  const a10 = sol10.accelerations[b.id];

  check('10° does NOT accelerate up the slope', +a10.toFixed(4), (v) => v >= -1e-6,
    'the reported bug returned a negative a here');
  check('10° is held by static friction (a ≈ 0)', +a10.toFixed(4), (v) => Math.abs(v) < 1e-6,
    'tanθ=0.176 < μs=0.375');

  const rough = s10.contacts.find((c) => (c.mu_s ?? 0) > 0);
  check('geometry change clears the stale sliding verdict', rough.slidingSign, 0,
    'reset to undetermined, not guessed');

  // …and dragging back up must slide again — the reset must not stick at 0.
  const s50 = normalizeScene(setWedgeAngle(s10, w.id, 50));
  const a50 = solveScene(s50).accelerations[blockOf(s50).id];
  check('50° slides again (a > 0)', +a50.toFixed(4), (v) => v > 0.5, 'tanθ=1.19 > μs');
  check('50° exceeds 35° acceleration', +(a50 - a35).toFixed(4), (v) => v > 0, 'steeper ⇒ faster');
}

// ── The μ slider must behave the same way ────────────────────────────────────
{
  const a0 = FBD_ARCHETYPES['incline-with-friction'];
  const base = normalizeScene(a0.buildScene());
  const held = normalizeScene(setWedgeAngle(base, wedgeOf(base).id, 20));
  const rough = held.contacts.find((c) => (c.mu_s ?? 0) > 0);

  // tan(20°) = 0.364. μs = 0.9 holds it; μs = 0.05 cannot.
  const sticky = normalizeScene(setFriction(held, rough.id, 0.9));
  const slick = normalizeScene(setFriction(held, rough.id, 0.05));
  const aSticky = solveScene(sticky).accelerations[blockOf(sticky).id];
  const aSlick = solveScene(slick).accelerations[blockOf(slick).id];

  check('μs=0.90 at 20° holds (a ≈ 0)', +aSticky.toFixed(4), (v) => Math.abs(v) < 1e-6, 'tanθ=0.364 < 0.90');
  check('μs=0.05 at 20° slides (a > 0)', +aSlick.toFixed(4), (v) => v > 0.5, 'tanθ=0.364 > 0.05');
  check('μs=0.05 never accelerates up-slope', +aSlick.toFixed(4), (v) => v >= -1e-6);
  check('raising μ clears the stale verdict', sticky.contacts.find((c) => c.id === rough.id).slidingSign, 0);
}

// ── A frictionless contact keeps its sign — nothing to determine ─────────────
{
  const a0 = FBD_ARCHETYPES['body-on-incline'];
  const s = normalizeScene(a0.buildScene());
  const before = s.contacts.find((c) => (c.mu_s ?? 0) === 0 && (c.mu_k ?? 0) === 0);
  const after = normalizeScene(setWedgeAngle(s, wedgeOf(s).id, 25));
  const same = after.contacts.find((c) => c.id === before.id);
  check('frictionless contact keeps its sliding sign', same.slidingSign, before.slidingSign,
    'no friction ⇒ nothing to resolve');
  const a25 = solveScene(after).accelerations[blockOf(after).id];
  check('frictionless 25° gives g·sin25', +a25.toFixed(4), +(g * Math.sin(25 * Math.PI / 180)).toFixed(4));
}

// ── Report ───────────────────────────────────────────────────────────────────
const w0 = Math.max(...rows.map((r) => r[1].length));
for (const [st, name, got, want, note] of rows) {
  console.log(`${st}  ${name.padEnd(w0)}  got=${got.padEnd(10)} want=${String(want).padEnd(12)} ${note}`);
}
console.log('─'.repeat(60));
console.log(`${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
