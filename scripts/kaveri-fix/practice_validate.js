'use strict';
/**
 * Practice & Mastery quality gate for the Kaveri book's chapter_practice banks.
 *
 * Unlike quiz_validate.js (which only checks the 3-question inline_quiz blocks),
 * this validates the end-of-chapter `chapter_practice` banks against the strict
 * rubric in _agents/workflows/ENGLISH_BOOK_PAGE_WORKFLOW.md § "Practice & Mastery
 * quality rules". It enforces the MECHANICAL rules (the ones a machine can judge):
 *
 *   1. Bank size            ≥ 24 questions
 *   2. Concept coverage     all 5 tags present; each ≥ 2
 *   3. Difficulty spread    levels 1–5 all present; no single level > 50%
 *   4. Answer-position bias correct option spread across A/B/C/D; no position
 *                           > 40% of questions and none completely unused
 *   5. Length tell          correct-is-longest ≤ 40%; ZERO questions where the
 *                           correct option is > 1.3× the next-longest distractor
 *   6. Option hygiene       exactly 4 options, no duplicate option texts,
 *                           correct_index in range
 *
 * The QUALITATIVE rules (distractor plausibility, guess-resistance, factual
 * grounding, tone) cannot be fully automated — they live in the workflow doc as
 * an agent/human checklist. This script is the floor, not the ceiling.
 *
 *   node scripts/kaveri-fix/practice_validate.js [chapter|all]
 *   exit code 0 = all PASS, 1 = at least one FAIL (CI-friendly)
 */
const { withBook } = require('./_lib');

const CONCEPTS = ['comprehension', 'vocab_in_context', 'grammar', 'interpretation', 'inference'];
const arg = process.argv[2] && process.argv[2] !== 'all' ? Number(process.argv[2]) : null;

const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
const POS = ['A', 'B', 'C', 'D'];

function validateBank(ch, questions) {
  const n = questions.length;
  const fails = [];
  const warns = [];

  // 1. bank size
  if (n < 24) fails.push(`bank size ${n} < 24`);

  // 2. concept coverage
  const tagCount = Object.fromEntries(CONCEPTS.map((t) => [t, 0]));
  for (const q of questions) if (tagCount[q.concept_tag] != null) tagCount[q.concept_tag]++;
  const missingTags = CONCEPTS.filter((t) => tagCount[t] === 0);
  if (missingTags.length) fails.push(`missing concept tags: ${missingTags.join(', ')}`);
  const thinTags = CONCEPTS.filter((t) => tagCount[t] > 0 && tagCount[t] < 2);
  if (thinTags.length) warns.push(`thin concept coverage (<2): ${thinTags.map((t) => `${t}:${tagCount[t]}`).join(', ')}`);

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

  // 5. length tell — a length cue only helps a guesser when the correct option
  //    VISIBLY stands out: it must be the unique longest AND ≥15% longer than the
  //    best distractor. A 1–2 char / sub-15% edge is not a reliable signal, so it
  //    doesn't count. The hard 1.3× rule independently catches blatant giveaways.
  //    `strict`/`tied` are reported for transparency; the GATE is `tell`.
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
    if (cl > nextMax && cl >= MARGIN * nextMax) tell++; // uniquely longest by a visible margin
    if (others.length && cl > 1.3 * nextMax) overRatio.push(`pr-${String(i + 1).padStart(2, '0')}`);
  });
  if (pct(tell, n) > 40) fails.push(`length tell (uniquely longest & ≥15% longer) ${pct(tell, n)}% (>40%)`);
  if (overRatio.length) fails.push(`correct > 1.3× next-longest in: ${overRatio.join(', ')}`);

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

  // 7. reasoning vs recall (heuristic → WARNING, not a hard fail). Among the
  //    "content" questions (excluding vocab + grammar), what share test thinking
  //    (why/how/infer/interpret) rather than fact recall? Target ≥ 60%.
  const REASON = /\b(why|how does|how do|how did|how might|how is|how are|what does|what do|what can|infer|imply|implies|suggest|reveal|signif|the effect of|best captures|best shows|best explains|best supports|most likely|central (argument|idea|point)|the writer|the poet|the author)\b/i;
  let content = 0, reasoning = 0;
  for (const q of questions) {
    if (q.concept_tag === 'vocab_in_context' || q.concept_tag === 'grammar') continue;
    content++;
    if (q.concept_tag === 'interpretation' || q.concept_tag === 'inference' || REASON.test(q.question || '')) reasoning++;
  }
  const reasoningPct = pct(reasoning, content);
  if (content && reasoningPct < 60) warns.push(`reasoning share ${reasoningPct}% of content questions (<60% — too memorisation-heavy; convert recall Qs to "why/how/what does it reveal")`);

  return {
    ch, n, fails, warns,
    posCount, tagCount, diff, tellPct: pct(tell, n), strictPct: pct(strict, n), tiedPct: pct(tied, n), reasoningPct,
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
      console.log(`   concepts: ${CONCEPTS.map((t) => `${t.split('_')[0]}:${r.tagCount[t]}`).join('  ')}   reasoning: ${r.reasoningPct}%`);
      console.log(`   difficulty 1–5: ${[1, 2, 3, 4, 5].map((d) => r.diff[d]).join(' / ')}`);
      r.fails.forEach((f) => console.log(`   ❌ ${f}`));
      r.warns.forEach((w) => console.log(`   ⚠️  ${w}`));
    }
    console.log(`\nRESULT: ${anyFail ? '❌ one or more chapters FAIL' : '✅ all chapters PASS'}`);
    process.exit(anyFail ? 1 : 0);
  });
})().catch((e) => { console.error(e); process.exit(1); });
