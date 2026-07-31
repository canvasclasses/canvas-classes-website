/*
 * verify-pulley-wiring.mjs — proves the Pulley Lab misconception codes are LIVE.
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO RUN
 *
 *     node scripts/verify-pulley-wiring.mjs
 *
 * WHY THIS EXISTS. `archetypes.pulley.ts` declares a `MisconceptionCode` on all
 * nine rungs, and its own header names the failure mode: Phase 1 of this program
 * shipped 22 codes that were declared and read by no feedback path at all. A
 * `targets` value is a promise the UI has to keep, and nothing in tsc, eslint,
 * `lint:sims` or `verify-mechanics-bench` can tell whether it was kept — every
 * one of those passes cleanly on a codebase where the codes are inert, which is
 * exactly the state this file was written to end.
 *
 * So it asserts the five things that would have caught the Phase-1 regression:
 *
 *   1. COPY, BOTH DIRECTIONS. Every rung's `targets` has copy, and every entry
 *      of copy is some rung's `targets`. (`energy/kit/phase2.ts` runs the same
 *      two-way check; the one-way version missed four E1 codes that could never
 *      fire.) Plus the house rule that the copy never says "wrong".
 *   2. REACHABILITY. Every rung reaches a student through at least one of the
 *      four surfaces `PulleyLab` actually has, computed by CALLING the same
 *      functions the component calls — not by reading the component's mind.
 *   3. RUNG 0 CAN PRODUCE A VERDICT. The original blocker: the ladder verdict
 *      compares against the previous rung, so `fixed-pulley` could never yield
 *      one, and it is the default entry rung.
 *   4. THE GATE IS ON BY DEFAULT. `predictNeeded` must not require the author to
 *      set `block.pulley.predict_body`; no authored page in this repo sets it, so
 *      that one `&&` switched the whole surface off everywhere.
 *   5. NO CARD BEFORE EVIDENCE. Design law #5. Every `<MisconceptionCard>` call
 *      site's `evidence={…}` expression must name a committed prediction, and the
 *      component must refuse to render without it.
 *
 * Checks 1–3 run the real code. Checks 4–5 are STATIC reads of `PulleyLab.tsx`,
 * because "this JSX is behind that guard" is a fact about source, not about
 * values — a plain node script cannot render React. They are string-shaped and
 * therefore brittle to renaming; that is the intended trade. A rename that
 * breaks them fails loudly, which is the correct outcome for a rename that moves
 * a design law's enforcement point.
 *
 * Requires Node ≥ 22.6 for TS stripping, same `registerHooks` shim as
 * `verify-fbd-fill.mjs`. Exits non-zero on any failure.
 */

import { registerHooks } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

registerHooks({
  resolve(spec, ctx, next) {
    if ((spec.startsWith('./') || spec.startsWith('../')) && ctx.parentURL) {
      const base = fileURLToPath(new URL(spec, ctx.parentURL));
      for (const ext of ['', '.ts', '/index.ts']) {
        if (ext === '' && existsSync(base) && !base.endsWith('.ts')) continue;
        if (existsSync(base + ext) && (base + ext).endsWith('.ts')) {
          return { url: pathToFileURL(base + ext).href, shortCircuit: true };
        }
      }
    }
    return next(spec, ctx);
  },
});

const BENCH = new URL('../packages/book-renderer/blocks/mechanics-bench/', import.meta.url);
const ROOT = BENCH.href;

const { PULLEY_ARCHETYPES, PULLEY_LADDER } = await import(`${ROOT}archetypes.pulley.ts`);
const { PULLEY_MISCONCEPTION, PULLEY_MISCONCEPTION_CODES } =
  await import(`${ROOT}pulley/misconceptions.ts`);
const { deriveConstraints } = await import(`${ROOT}lib/constraints.ts`);
const { solveScene } = await import(`${ROOT}lib/dynamics.ts`);
const { segmentsOf } = await import(`${ROOT}pulley/geometry.ts`);
const {
  buildLedger, buildForceFacts, holdingCountOptionIndex, tensionsSplit,
} = await import(`${ROOT}pulley/ledger.ts`);

const LAB_SRC = readFileSync(new URL('pulley/PulleyLab.tsx', BENCH), 'utf8');
const CARD_SRC = readFileSync(new URL('pulley/MisconceptionCard.tsx', BENCH), 'utf8');

// ── Harness ──────────────────────────────────────────────────────────────────

let pass = 0;
let fail = 0;
const failures = [];

function check(group, name, ok, detail = '') {
  if (ok) { pass++; return true; }
  fail++;
  failures.push(`${group} · ${name}${detail ? `\n      ${detail}` : ''}`);
  return false;
}

const B = '\x1b[1m';
const D = '\x1b[2m';
const R = '\x1b[0m';
const GRN = '\x1b[32m';
const RED = '\x1b[31m';

/** The single `const NAME = …;` statement, comments already stripped. */
function statement(src, name) {
  const stripped = src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/^[ \t]*\/\/.*$/gm, ' ');
  const at = stripped.indexOf(`const ${name} =`);
  if (at < 0) return null;
  const end = stripped.indexOf(';', at);
  return end < 0 ? null : stripped.slice(at, end).replace(/\s+/g, ' ').trim();
}

// ── Per-rung facts, built by calling the component's own helpers ──────────────

const rungs = PULLEY_LADDER.map((rung, index) => {
  const archetype = PULLEY_ARCHETYPES[rung.id];
  const scene = archetype.buildScene({});
  const constraints = deriveConstraints(scene);
  const solve = solveScene(scene);
  const groups = buildLedger(scene, constraints, segmentsOf(scene)).groups;
  const facts = buildForceFacts(scene, groups, solve, archetype.defaultBody);
  return { rung, index, archetype, scene, constraints, solve, groups, facts };
});

const watchedBody = (r) => r.archetype.defaultBody ?? null;

/**
 * Which of the four surfaces can carry this rung's code to a student.
 *
 *  advantage — surface 1. Needs a focus term, so it needs a derived constraint.
 *              Available on EVERY rung including rung 0, which is its whole job.
 *  verdict   — surface 2. Needs the previous rung to have watched the SAME body,
 *              which is what `PulleyLab`'s prevRunRef requires.
 *  tension   — surface 3. Only the rung whose targets is the tension code.
 *  numeric   — surface 4. Present on any rung, but only when the AUTHOR supplies
 *              `block.numeric`, so it is reported and never counted as the sole
 *              route: a code that only reaches through optional authoring is the
 *              declared-but-dead failure with extra steps.
 */
function surfacesFor(r) {
  const out = [];
  if (r.facts && holdingCountOptionIndex(r.facts.n) >= 0) out.push('advantage');
  const prev = rungs[r.index - 1];
  if (r.index > 0 && prev && watchedBody(prev) && watchedBody(prev) === watchedBody(r)) {
    out.push('verdict');
  }
  if (r.archetype.targets === 'tension_equal_across_any_pulley') out.push('tension');
  return out;
}

// ── 1. Copy, both directions ─────────────────────────────────────────────────

const G1 = '1 copy';
const declared = new Set();

for (const r of rungs) {
  const code = r.archetype.targets;
  check(G1, `${r.rung.id} declares a targets code`, !!code);
  if (!code) continue;
  declared.add(code);
  const copy = PULLEY_MISCONCEPTION[code];
  check(G1, `${code} has copy`, !!copy,
    `${r.rung.id} targets "${code}", which has no entry in PULLEY_MISCONCEPTION.`);
  if (!copy) continue;
  check(G1, `${code} names the belief in the student's words`,
    typeof copy.heading === 'string' && /[“"]/.test(copy.heading) && copy.heading.length > 20,
    'The heading must be the belief said out loud, in quotes (the phase2.ts pattern).');
  check(G1, `${code} explains what happens and why it felt right`,
    typeof copy.body === 'string' && copy.body.split(/\s+/).length >= 60,
    `body is ${copy.body ? copy.body.split(/\s+/).length : 0} words; the pattern is `
    + 'name the belief, say what happens, say why it felt right.');
  check(G1, `${code} never says "wrong"`,
    !/\bwrong(ly|ness)?\b/i.test(`${copy.heading} ${copy.body}`),
    'A student told their reasoning is wrong has stopped reading.');
}

for (const code of PULLEY_MISCONCEPTION_CODES) {
  check(G1, `${code} is some rung's targets`, declared.has(code),
    'Copy that no archetype points at is the mirror image of a dead code — '
    + 'it can never appear. Delete it or point a rung at it.');
}
check(G1, 'no copy outside the declared list',
  Object.keys(PULLEY_MISCONCEPTION).every((k) => PULLEY_MISCONCEPTION_CODES.includes(k)));

// ── 2. Reachability, and 3. rung 0 ───────────────────────────────────────────

const G2 = '2 reachability';
const table = [];

for (const r of rungs) {
  const surfaces = surfacesFor(r);
  table.push({ r, surfaces });
  check(G2, `${r.rung.id} reaches a student`, surfaces.length > 0,
    `targets "${r.archetype.targets}" has no live surface on this rung.`);

  // No new physics: every number the advantage panel shows must be a value the
  // solve or the deriver already produced.
  if (r.facts) {
    const coeffs = r.constraints.flatMap((c) => c.terms)
      .filter((t) => t.bodyId === r.facts.bodyId)
      .map((t) => Math.max(1, Math.round(Math.abs(t.coeff))));
    check(G2, `${r.rung.id} advantage is the deriver's own coefficient`,
      coeffs.includes(r.facts.n),
      `panel says n = ${r.facts.n}; deriver's terms at ${r.facts.bodyId} are ${coeffs.join('/')}.`);
    if (r.facts.tension != null) {
      const solved = Object.values(r.solve.tensions).map((v) => Math.abs(v));
      check(G2, `${r.rung.id} tension is read off the solve`,
        solved.some((v) => Math.abs(v - r.facts.tension) < 1e-9));
    }
    if (r.facts.accel != null) {
      check(G2, `${r.rung.id} acceleration is read off the solve`,
        Math.abs((r.solve.accelerations[r.facts.bodyId] ?? NaN) - r.facts.accel) < 1e-12);
    }
  }
}

const G3 = '3 rung 0';
const first = rungs[0];
check(G3, 'the entry rung is fixed-pulley', first.rung.id === 'fixed-pulley');
check(G3, 'it has NO ladder verdict available', !surfacesFor(first).includes('verdict'),
  'If this ever passes, the assumption behind surface 1 has changed — re-read it.');
check(G3, 'it produces a verdict anyway (surface 1)',
  !!first.facts && holdingCountOptionIndex(first.facts.n) === 0,
  'rung 0 must be able to be right or wrong about something, or its code is dead.');
check(G3, 'and the evidence IS pulley_multiplies_force',
  !!first.facts && first.facts.n === 1
  && first.facts.weight != null && first.facts.tension != null
  && Math.abs(first.facts.tension - first.facts.weight) < 1e-6,
  `n=${first.facts?.n} weight=${first.facts?.weight} tension=${first.facts?.tension} — `
  + 'on a fixed sheave the rope must pull the load\'s full weight, which is the '
  + 'measurement that answers "a pulley makes it lighter".');

// The tension gate must be answerable at BOTH pulley masses, or it is a question
// about a number instead of a question about an assumption.
const massive = rungs.find((r) => r.rung.id === 'pulley-with-mass');
if (massive) {
  const zero = solveScene(massive.archetype.buildScene({ M: 0 }));
  check(G3, 'tension gate answers "different" when the sheave has mass',
    tensionsSplit(massive.solve) === true);
  check(G3, 'tension gate answers "equal" when M = 0',
    tensionsSplit(zero) === false,
    'The massless case is the assumption being named, not an absence of content.');
}

// ── 4. The predict gate is on by default ─────────────────────────────────────

const G4 = '4 gate defaults';
const predictNeeded = statement(LAB_SRC, 'predictNeeded');
const holdNeeded = statement(LAB_SRC, 'holdNeeded');
const predictBody = statement(LAB_SRC, 'predictBody');

check(G4, 'predictNeeded exists', !!predictNeeded);
check(G4, 'predictNeeded does NOT require block.pulley.predict_body',
  !!predictNeeded && !/predictBodyProp/.test(predictNeeded),
  `No authored page in this repo sets predict_body, so this switched surface 2 `
  + `off everywhere.\n      got: ${predictNeeded}`);
check(G4, 'it gates on the body, which falls back to the archetype',
  !!predictNeeded && /\bpredictBody\b/.test(predictNeeded)
  && !!predictBody && /archetype\.defaultBody/.test(predictBody));
check(G4, 'surface 1 needs no author prop and no previous rung',
  !!holdNeeded && !/predictBodyProp/.test(holdNeeded) && !/\brung\s*[<>=]/.test(holdNeeded),
  `Surface 1 is the only route a rung-0 or single-rung block has.\n      got: ${holdNeeded}`);

// ── 5. No card before evidence ───────────────────────────────────────────────

const G5 = '5 evidence gate';
const EVIDENCE_TOKENS = ['cardEvidence'];
const cardEvidence = statement(LAB_SRC, 'cardEvidence');
const committed = statement(LAB_SRC, 'committed');
const revealSolve = statement(LAB_SRC, 'revealSolve');

const sites = [...LAB_SRC.matchAll(/<MisconceptionCard\b([\s\S]*?)\/>/g)].map((m) => m[1]);
check(G5, 'the card is rendered somewhere', sites.length > 0);
sites.forEach((attrs, i) => {
  const evidence = attrs.match(/evidence=\{([\s\S]*?)\}\s/);
  check(G5, `call site ${i + 1} passes an evidence expression`, !!evidence);
  if (!evidence) return;
  const expr = evidence[1].replace(/\s+/g, ' ').trim();
  check(G5, `call site ${i + 1} gates on a committed prediction`,
    EVIDENCE_TOKENS.some((t) => expr.includes(t)) && !/^(true|1)$/.test(expr),
    `evidence={${expr}} names no committed prediction. A literal here is the one `
    + 'thing that breaks the contract in MisconceptionCard.tsx.');
});

check(G5, 'the component refuses to render without evidence',
  /if\s*\(\s*!evidence/.test(CARD_SRC),
  'The gate must live in the component, not be re-remembered at each call site.');
check(G5, 'cardEvidence requires BOTH a prediction and a solved system',
  !!cardEvidence && /\bcommitted\b/.test(cardEvidence) && /\brevealSolve\b/.test(cardEvidence),
  `got: ${cardEvidence}`);
check(G5, 'committed means a real per-rung commitment',
  !!committed && /holdChoice|holdSaid/.test(committed)
  && /predictions\[rungId\]/.test(committed)
  && /tensionChoice|tensionSaid/.test(committed),
  `got: ${committed}`);
check(G5, 'revealSolve is held by both pre-solve gates',
  !!revealSolve && /holdNeeded/.test(revealSolve) && /predictNeeded/.test(revealSolve),
  `got: ${revealSolve}`);

// The tension answer must not be on screen while the tension gate is open — the
// readout prose and the ledger's τ = Iα rows both state it in words.
check(G5, 'cardEvidence waits for the tension gate too',
  !!cardEvidence && /!tensionNeeded/.test(cardEvidence),
  'Surface 1 resolves first on the massive-sheave rung, so without this the card '
  + 'would spell out the tension answer while its gate was still open.');
check(G5, 'the tensions readout is withheld behind the tension gate',
  /showTensions=\{!tensionNeeded\}/.test(LAB_SRC));
check(G5, 'the ledger\'s torque rows are withheld too',
  /torque=\{revealSolve\s*&&\s*!tensionNeeded/.test(LAB_SRC));
check(G5, 'the written-out equations are withheld too',
  /revealSolve\s*&&\s*!tensionNeeded\s*&&\s*showEquations/.test(LAB_SRC),
  'One of those rows is (T₁ − T₂)·r = Iα, which answers surface 3 in symbols.');
check(G5, 'the ledger is withheld behind the advantage gate',
  !!statement(LAB_SRC, 'ledgerRevealed')
  && /holdNeeded/.test(statement(LAB_SRC, 'ledgerRevealed')),
  'The ledger prints the coefficient and draws it as that many lines, which is '
  + 'surface 1\'s answer.');

// ── Report ───────────────────────────────────────────────────────────────────

const line = '─'.repeat(96);
console.log(`\n${B}Pulley Lab · misconception wiring${R}\n${D}${line}${R}`);
console.log(
  `${D}${'rung'.padEnd(32)}${'targets'.padEnd(34)}${'surfaces'.padEnd(24)}n${R}`);
for (const { r, surfaces } of table) {
  const numeric = ' (+numeric if authored)';
  console.log(
    `${String(r.index + 1).padStart(2)} ${r.rung.id.padEnd(32)}`
    + `${String(r.archetype.targets ?? '—').padEnd(34)}`
    + `${surfaces.join(', ').padEnd(24)}${r.facts?.n ?? '—'}`
    + `${surfaces.length === 1 ? D + numeric + R : ''}`);
}
console.log(`${D}${line}${R}`);
console.log(
  `${D}surfaces: advantage = "how many lengths hold it" gate + What you actually pull`
  + `\n          verdict   = faster/slower/same against the previous rung`
  + `\n          tension   = equal-or-different, ahead of the tensions readout`
  + `\n          numeric   = a missed answer gets the rung's diagnostic${R}`);

if (fail) {
  console.log(`\n${RED}${fail} failure(s)${R}`);
  for (const f of failures) console.log(`${RED}FAIL${R}  ${f}`);
  console.log(`\n${pass}/${pass + fail} passed`);
  process.exit(1);
}
console.log(`\n${GRN}${pass}/${pass} passed${R} — every declared code reaches a student.\n`);
