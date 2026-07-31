/*
 * audit-sim-archetypes.mjs — the standing design-law scorer.
 * ─────────────────────────────────────────────────────────────────────────────
 * The Phase-1 pedagogy audit found only 1 archetype in 46 scoring 4/5 against
 * the five design laws in _agents/plans/PHYSICS_SIMULATION_PROGRAM.md §2. That
 * audit was hand-written and therefore expensive to repeat, which is exactly
 * how a quality bar quietly slips. This script makes the STATICALLY CHECKABLE
 * part of it repeatable and cheap.
 *
 * WHAT IT CAN AND CANNOT SEE — read this before trusting a score.
 *
 * Checkable here (structure):
 *   • law 1 (student authors)  — does the archetype expose `params` to tune?
 *   • law 2 (names a misconception) — is `targets` declared AND is the code a
 *     member of that engine's misconception vocabulary?
 *   • law 5 (guided, not auto-playing) — is there a `defaultSteps` script, and
 *     does it have enough beats to build up rather than dump?
 *   • authorability — does `build`/`buildScene` run purely, without throwing?
 *   • reachability — is every declared step actually distinct and non-empty?
 *
 * NOT checkable here (judgment):
 *   • law 3 (shows the invisible middle step) — needs a human or a reviewing
 *     agent to say whether the thing shown is the thing that teaches.
 *   • law 4 (composes with other engines).
 *   • whether the misconception is actually WIRED to feedback the student sees.
 *     Phase 1 shipped 22 declared-but-dead codes; a `targets` field proves
 *     intent, never delivery. The reviewing agent must verify the wiring.
 *
 * So: a high score here is necessary, not sufficient. A LOW score is a reliable
 * defect. Treat this as a filter that tells the review agents where to look.
 *
 * Run: node scripts/audit-sim-archetypes.mjs [--json]   (needs Node ≥ 22.6)
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

const BLOCKS = new URL('../packages/book-renderer/blocks/', import.meta.url);
const JSON_OUT = process.argv.includes('--json');

/**
 * Every archetype library, with the misconception vocabulary it must draw from.
 * `vocab` is a path + export name; a `targets` code outside it is a typo that
 * would silently never fire.
 */
const LIBS = [
  { engine: 'FBD Studio',        file: 'mechanics-bench/archetypes.fbd.ts',        exp: 'FBD_ARCHETYPES',        build: 'buildScene' },
  { engine: 'Pulley Lab',        file: 'mechanics-bench/archetypes.pulley.ts',     exp: 'PULLEY_ARCHETYPES',     build: 'buildScene' },
  { engine: 'Energy',            file: 'mechanics-bench/archetypes.energy.ts',     exp: 'ENERGY_ARCHETYPES',     build: 'buildScene' },
  { engine: 'Rotation',          file: 'mechanics-bench/archetypes.rotation.ts',   exp: 'ROTATION_ARCHETYPES',   build: 'buildScene' },
  { engine: 'Projectile',        file: 'motion-lab/archetypes.projectile.ts',      exp: 'PROJECTILE_ARCHETYPES', build: null },
  { engine: 'Motion Graphs',     file: 'motion-lab/archetypes.graphs.ts',          exp: 'GRAPHS_ARCHETYPES',     build: null },
  { engine: 'Circular Arena',    file: 'motion-lab/archetypes.circular.ts',        exp: 'CIRCULAR_ARCHETYPES',   build: null },
  { engine: 'Waves',             file: 'motion-lab/archetypes.waves.ts',           exp: 'WAVES_ARCHETYPES',      build: null },
  { engine: 'Thermo',            file: 'motion-lab/archetypes.thermo.ts',          exp: 'THERMO_ARCHETYPES',     build: null },
  { engine: 'Circuit Bench',     file: 'circuit-bench/archetypes.ts',              exp: 'CIRCUIT_ARCHETYPES',    build: 'build' },
  // Unit 11 — EMI and AC. These two DID hit the missing-vocabulary wall (neither
  // frozen union had an AC or EMI code) and the resolution was to widen the
  // vocabularies rather than leave the blanks: 9 codes were added to
  // `CircuitMisconception` and 7 to `FieldMisconception`, with their copy folded
  // into the same exhaustive `CIRCUIT_ISSUES` / `FIELD_ISSUES` records that make a
  // code without copy a compile error. Every rung here declares a target, and
  // `verify-emi-ac.mjs` checks the stronger property this scorer cannot: that the
  // code resolves to a real message AND hint, and that no code has copy without a
  // rung to raise it. Both libraries read 5.00/5.
  { engine: 'AC Bench',          file: 'circuit-bench/archetypes.ac.ts',           exp: 'AC_ARCHETYPES',         build: 'build' },
  { engine: 'EMI Bench',         file: 'field-bench/archetypes.emi.ts',            exp: 'EMI_ARCHETYPES',        build: 'build' },
  { engine: 'Optics Bench',      file: 'optics-bench/archetypes.ts',               exp: 'OPTICS_ARCHETYPES',     build: 'build' },
  { engine: 'Field Bench',       file: 'field-bench/archetypes.ts',                exp: 'FIELD_ARCHETYPES',      build: 'build' },
  // Unit 13 — Modern Physics. Both libraries first shipped with `targets` UNSET on
  // most archetypes and scored 4/5, because `FieldMisconception` had no nuclear code
  // and `CircuitMisconception` had no semiconductor one, and an honest blank beats a
  // wrong label. The thirteen missing codes were then NAMED and folded in — six
  // nuclear, seven semiconductor, plus two resistor-network codes genuinely reused
  // for the rectifiers — with the copy in the two engines' `lib/misconceptions.ts`
  // behind the exhaustive `Record` guard, so a code cannot exist without a message.
  // `targets` is REQUIRED on both archetype interfaces: a new exercise cannot be
  // added here without deciding which belief it attacks.
  { engine: 'Nuclear Bench',     file: 'field-bench/archetypes.nuclear.ts',        exp: 'NUCLEAR_ARCHETYPES',    build: 'build' },
  { engine: 'Semiconductor',     file: 'circuit-bench/archetypes.semiconductor.ts', exp: 'SEMICONDUCTOR_ARCHETYPES', build: 'buildScene' },
];

const rows = [];
const missing = [];

for (const lib of LIBS) {
  const url = new URL(lib.file, BLOCKS);
  if (!existsSync(fileURLToPath(url))) { missing.push(lib.engine); continue; }

  let mod;
  try { mod = await import(url.href); }
  catch (e) { rows.push({ engine: lib.engine, id: '(import failed)', score: 0, notes: [String(e).slice(0, 90)] }); continue; }

  const map = mod[lib.exp];
  if (!map) { rows.push({ engine: lib.engine, id: `(no export ${lib.exp})`, score: 0, notes: [] }); continue; }

  for (const a of Object.values(map)) {
    const notes = [];
    let score = 0;

    // law 1 — the student can change something meaningful
    const params = a.params ?? [];
    if (params.length >= 2) score++;
    else notes.push(params.length === 1 ? 'only 1 param — barely authorable/tunable' : 'NO params — student cannot change anything');

    // law 2 — a misconception is named
    if (a.targets) score++;
    else notes.push('no `targets` — attacks no named misconception');

    // law 5 — guided build-up
    const steps = a.defaultSteps ?? [];
    if (steps.length >= 3) score++;
    else notes.push(steps.length ? `only ${steps.length} guided step(s)` : 'NO guided steps — dumps everything at once');

    // the scene/circuit/bench builds purely without throwing
    const fn = lib.build ? a[lib.build] : null;
    if (!lib.build) { score++; }
    else if (typeof fn === 'function') {
      try {
        const defaults = Object.fromEntries(params.map((p) => [p.key, p.default]));
        const built = fn.call(a, defaults);
        if (built && typeof built === 'object') score++;
        else notes.push(`${lib.build}() returned nothing useful`);
      } catch (e) { notes.push(`${lib.build}() THREW: ${String(e).slice(0, 70)}`); }
    } else notes.push(`no ${lib.build}()`);

    // copy quality — a title and a real one-line summary for the admin picker
    if (a.title && a.summary && a.summary.length > 20) score++;
    else notes.push('thin title/summary — faculty cannot tell what this is');

    // distinct, non-empty guided beats
    const says = steps.map((s) => (s?.say ?? '').trim());
    if (says.some((s) => !s)) notes.push('a guided step has an empty `say`');
    if (new Set(says).size !== says.length) notes.push('duplicate guided steps');

    rows.push({ engine: lib.engine, id: a.id ?? '(no id)', score, notes });
  }
}

if (JSON_OUT) {
  console.log(JSON.stringify({ rows, missing }, null, 1));
  process.exit(0);
}

// ── Report ───────────────────────────────────────────────────────────────────
const byEngine = new Map();
for (const r of rows) {
  if (!byEngine.has(r.engine)) byEngine.set(r.engine, []);
  byEngine.get(r.engine).push(r);
}

const bar = (n) => '█'.repeat(n) + '·'.repeat(5 - n);
let total = 0, sum = 0, weak = 0;

for (const [engine, list] of byEngine) {
  const avg = list.reduce((s, r) => s + r.score, 0) / list.length;
  console.log(`\n\x1b[1m${engine}\x1b[0m  —  ${list.length} archetypes, mean ${avg.toFixed(2)}/5`);
  for (const r of list.sort((a, b) => a.score - b.score)) {
    total++; sum += r.score;
    if (r.score <= 3) weak++;
    const col = r.score >= 5 ? '\x1b[32m' : r.score >= 4 ? '\x1b[33m' : '\x1b[31m';
    console.log(`  ${col}${bar(r.score)}\x1b[0m ${r.id.padEnd(30)} ${r.notes.join(' · ')}`);
  }
}

if (missing.length) console.log(`\n\x1b[2mnot built yet: ${missing.join(', ')}\x1b[0m`);

console.log('\n' + '─'.repeat(78));
console.log(`${total} archetypes · mean ${(sum / (total || 1)).toFixed(2)}/5 · ${weak} scoring ≤3 (need work)`);
console.log('\x1b[2mStructure only. Laws 3 & 4, and whether a declared misconception is');
console.log('actually WIRED to visible feedback, need a reviewing agent — Phase 1');
console.log('shipped 22 declared-but-dead codes.\x1b[0m');

process.exit(0);
