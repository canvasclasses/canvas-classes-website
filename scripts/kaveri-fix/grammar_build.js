'use strict';
/**
 * Fix #2 — the Grammar Gym. Inserts an apply_express(variant:'grammar') block on
 * each chapter's grammar page, drilling exactly the grammar that page teaches,
 * using the new transform / spot_error / form_select / fill_blank interactions.
 * Content lives in _grammar_gyms.json. Idempotent (removes any prior grammar gym
 * on the target page before inserting), then renumbers `order`.
 *   node scripts/kaveri-fix/grammar_build.js [--dry]
 */
const fs = require('fs');
const crypto = require('crypto');
const { withBook, savePageBlocks } = require('./_lib');
const DRY = process.argv.includes('--dry');

const uid = () => crypto.randomUUID();
const GYMS = JSON.parse(fs.readFileSync('scripts/kaveri-fix/_grammar_gyms.json', 'utf8'));

function validateChallenge(c) {
  const e = [];
  if (!['comprehension', 'vocab_in_context', 'grammar', 'interpretation', 'inference'].includes('grammar')) e.push('concept');
  if (![1, 2, 3, 4, 5].includes(c.difficulty)) e.push('difficulty');
  if (c.kind === 'transform') {
    if (!c.source || !c.instruction) e.push('transform fields');
    if (!Array.isArray(c.answers) || !c.answers.length) e.push('transform answers');
  } else if (c.kind === 'spot_error') {
    if (!Array.isArray(c.tokens) || c.tokens.length < 3) e.push('spot tokens');
    if (typeof c.error_index !== 'number' || c.error_index < 0 || c.error_index >= c.tokens.length) e.push('error_index');
    if (!c.fix) e.push('fix');
    if (c.fix_options && !c.fix_options.includes(c.fix)) e.push('fix not in options');
  } else if (c.kind === 'form_select') {
    if (!c.prompt || !c.prompt.includes('____')) e.push('form_select prompt/blank');
    if (!Array.isArray(c.options) || c.options.length < 2) e.push('options');
    if (typeof c.correct_index !== 'number' || c.correct_index < 0 || c.correct_index >= c.options.length) e.push('correct_index');
  } else if (c.kind === 'fill_blank') {
    if (!c.prompt || !/_{4,}/.test(c.prompt)) e.push('fill_blank prompt/blank');
    if (!Array.isArray(c.answers) || !c.answers.length) e.push('fill_blank answers');
  } else e.push('kind ' + c.kind);
  return e;
}

(async () => {
  // validate + stamp ids
  let errs = 0;
  for (const [slug, g] of Object.entries(GYMS)) {
    g.challenges.forEach((c, i) => {
      const e = validateChallenge(c);
      if (e.length) { errs++; console.log(`✗ ${slug} #${i} (${c.kind}):`, e.join(', ')); }
      c.id = `ch${g.chapter_number}-gram-${String(i + 1).padStart(2, '0')}`;
      c.concept_tag = 'grammar';
    });
  }
  if (errs) { console.error(`\n${errs} validation errors — aborting.`); process.exit(1); }
  console.log('All challenges valid.');

  await withBook(async ({ pages, allPages }) => {
    for (const [slug, g] of Object.entries(GYMS)) {
      const page = allPages.find((p) => p.slug === slug);
      if (!page) { console.log(`⚠ page not found: ${slug}`); continue; }
      let blocks = (page.blocks || []).filter((b) => !(b.type === 'apply_express' && b.variant === 'grammar'));
      const gymBlock = {
        id: uid(), type: 'apply_express', order: 0,
        title: g.title, intro: g.intro, chapter_number: g.chapter_number,
        variant: 'grammar', challenges: g.challenges,
      };
      const lastQuiz = blocks.map((b) => b.type).lastIndexOf('inline_quiz');
      if (lastQuiz >= 0) blocks.splice(lastQuiz, 0, gymBlock);
      else blocks.push(gymBlock);
      blocks.forEach((b, i) => (b.order = i));
      console.log(`${slug}: ${g.challenges.length} challenges → order ${gymBlock.order} of ${blocks.length} blocks`);
      if (!DRY) await savePageBlocks(pages, page._id, blocks);
    }
  });
  console.log(DRY ? '\n[DRY] nothing written.' : '\nGrammar gyms saved.');
})().catch((e) => { console.error(e); process.exit(1); });
