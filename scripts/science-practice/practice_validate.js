'use strict';
/**
 * Practice & Mastery quality gate for the science chapter_practice banks.
 *
 * Enforces the MECHANICAL rules from BOOK_PAGE_WORKFLOW.md §4F.1 (rules 1–6):
 *
 *   1. Bank size            24–28 questions (FAIL if < 24)
 *   2. Concept coverage     all 5 science tags present; each ≥ 4 (FAIL if any 0;
 *                           WARN if 1–3). numerical ≥ 2 always.
 *   3. Difficulty spread    levels 1–5 all present (WARN if a level unused);
 *                           no single level > 50% of the bank (FAIL)
 *   4. Answer-position bias key spread across A/B/C/D; no position > 40% (FAIL);
 *                           none ever 0% (FAIL)
 *   5. Length tell          key uniquely-longest-by-a-visible-margin ≤ 40% (FAIL);
 *                           ZERO questions where key > 1.3× next-longest (FAIL)
 *   6. Option hygiene       exactly 4 options, no duplicate texts, index in range
 *
 * The QUALITATIVE rules (§4F.1 rules 7–9: distractor plausibility per §3.6.1,
 * guess-resistance, factual grounding) cannot be automated — they are the
 * author's job. This script is the floor, not the ceiling.
 *
 *   node scripts/science-practice/practice_validate.js [chapter|all]
 *   exit code 0 = all PASS, 1 = at least one FAIL (CI-friendly)
 */
const { withBook, SCIENCE_CONCEPTS } = require('./_lib');

const CONCEPTS = SCIENCE_CONCEPTS; // recall, concept, application, numerical, reasoning
const arg = process.argv[2] && process.argv[2] !== 'all' ? Number(process.argv[2]) : null;

const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
const POS = ['A', 'B', 'C', 'D'];

function validateBank(ch, questions) {
  const n = questions.length;
  const fails = [];
  const warns = [];

  // 1. bank size
  if (n < 24) fails.push(`bank size ${n} < 24`);
  if (n > 28) warns.push(`bank size ${n} > 28 (target 26)`);

  // 2. concept coverage
  const tagCount = Object.fromEntries(CONCEPTS.map((t) => [t, 0]));
  for (const q of questions) if (tagCount[q.concept_tag] != null) tagCount[q.concept_tag]++;
  const unknownTags = [...new Set(questions.map((q) => q.concept_tag).filter((t) => !CONCEPTS.includes(t)))];
  if (unknownTags.length) fails.push(`non-science concept tags used: ${unknownTags.join(', ')}`);
  const missingTags = CONCEPTS.filter((t) => tagCount[t] === 0);
  if (missingTags.length) fails.push(`missing concept tags: ${missingTags.join(', ')}`);
  const thinTags = CONCEPTS.filter((t) => tagCount[t] > 0 && tagCount[t] < 4);
  if (thinTags.length) warns.push(`thin concept coverage (<4): ${thinTags.map((t) => `${t}:${tagCount[t]}`).join(', ')}`);
  if (tagCount.numerical > 0 && tagCount.numerical < 2) fails.push(`numerical coverage ${tagCount.numerical} < 2`);

  // 3. difficulty spread
  const diff = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const q of questions) if (diff[q.difficulty] != null) diff[q.difficulty]++;
  const missingDiff = Object.keys(diff).filter((d) => diff[d] === 0);
  if (missingDiff.length) warns.push(`difficulty levels unused: ${missingDiff.join(', ')}`);
  const maxDiff = Math.max(...Object.values(diff));
  if (maxDiff > n * 0.5) fails.push(`one difficulty level is ${pct(maxDiff, n)}% of the bank (>50%)`);

  // 4. answer-position bias
  const posCount = [0, 0, 0, 0];
  for (const q of questions) if (q.correct_index >= 0 && q.correct_index < 4) posCount[q.correct_index]++;
  const maxPos = Math.max(...posCount);
  const unused = posCount.map((c, i) => (c === 0 ? POS[i] : null)).filter(Boolean);
  if (maxPos > n * 0.4) {
    const worst = POS[posCount.indexOf(maxPos)];
    fails.push(`answer "${worst}" is correct ${pct(maxPos, n)}% of the time (>40%) — position bias`);
  }
  if (unused.length) fails.push(`answer position(s) never correct: ${unused.join(', ')}`);

  // 5. length tell — a length cue only helps a guesser when the key VISIBLY
  //    stands out: uniquely longest AND ≥15% longer than the best distractor.
  //    The hard 1.3× rule independently catches blatant giveaways.
  const MARGIN = 1.15;
  let tied = 0, strict = 0, tell = 0;
  const overRatio = [];
  questions.forEach((q, i) => {
    const lens = (q.options || []).map((o) => String(o).length);
    const cl = lens[q.correct_index];
    const maxLen = Math.max(...lens);
    if (cl === maxLen) tied++;
    const others = lens.filter((_, k) => k !== q.correct_index);
    const nextMax = others.length ? Math.max(...others) : 0;
    if (cl > nextMax) strict++;
    if (cl > nextMax && cl >= MARGIN * nextMax) tell++;
    if (others.length && cl > 1.3 * nextMax) overRatio.push(`pr-${String(i + 1).padStart(2, '0')}`);
  });
  if (pct(tell, n) > 40) fails.push(`length tell (uniquely longest & ≥15% longer) ${pct(tell, n)}% (>40%)`);
  if (overRatio.length) fails.push(`key > 1.3× next-longest in: ${overRatio.join(', ')}`);

  // 6. option hygiene
  const hygiene = [];
  questions.forEach((q, i) => {
    const id = `pr-${String(i + 1).padStart(2, '0')}`;
    if (!Array.isArray(q.options) || q.options.length !== 4) hygiene.push(`${id}: ${(q.options || []).length} options (want 4)`);
    if (q.correct_index < 0 || q.correct_index >= (q.options || []).length) hygiene.push(`${id}: correct_index out of range`);
    const seen = new Set();
    for (const o of q.options || []) {
      const k = String(o).trim().toLowerCase();
      if (seen.has(k)) hygiene.push(`${id}: duplicate option "${o}"`);
      seen.add(k);
    }
  });
  if (hygiene.length) fails.push(`option hygiene: ${hygiene.join(' | ')}`);

  return {
    ch, n, fails, warns,
    posCount, tagCount, diff, tellPct: pct(tell, n), strictPct: pct(strict, n), tiedPct: pct(tied, n),
  };
}

(async () => {
  await withBook(async ({ allPages }) => {
    const banks = [];
    for (const p of allPages) {
      if (arg && p.chapter_number !== arg) continue;
      for (const b of p.blocks || []) {
        if (b.type === 'chapter_practice') banks.push({ ch: p.chapter_number, questions: b.questions || [] });
      }
    }
    banks.sort((a, b) => a.ch - b.ch);
    if (!banks.length) { console.log('No chapter_practice banks found.'); process.exit(1); }

    let anyFail = false;
    for (const { ch, questions } of banks) {
      const r = validateBank(ch, questions);
      const ok = r.fails.length === 0;
      if (!ok) anyFail = true;
      console.log(`\n━━ Chapter ${ch} — ${r.n} questions — ${ok ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   positions A/B/C/D: ${r.posCount.join(' / ')}   length-tell: ${r.tellPct}%  (uniquely-longest ${r.strictPct}%, incl. ties ${r.tiedPct}%)`);
      console.log(`   concepts: ${CONCEPTS.map((t) => `${t}:${r.tagCount[t]}`).join('  ')}`);
      console.log(`   difficulty 1–5: ${[1, 2, 3, 4, 5].map((d) => r.diff[d]).join(' / ')}`);
      r.fails.forEach((f) => console.log(`   ❌ ${f}`));
      r.warns.forEach((w) => console.log(`   ⚠️  ${w}`));
    }
    console.log(`\nRESULT: ${anyFail ? '❌ one or more chapters FAIL' : '✅ all chapters PASS'}`);
    process.exit(anyFail ? 1 : 0);
  });
})().catch((e) => { console.error(e); process.exit(1); });
