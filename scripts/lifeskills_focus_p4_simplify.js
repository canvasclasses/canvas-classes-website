'use strict';
/**
 * Page 4 walkthrough — simplify the language (founder: the copy drifted writerly:
 * "walls off a noisy house", "background racket", "That part is genuine"). Rewrites
 * every beat + the cost-checker verdicts + intro/outro into plain classroom English,
 * and switches the core metaphor from "channel" to the more concrete "word lane".
 * Aligns the two quiz questions that referenced "channel" so the page stays coherent.
 *
 * Text-only edits (headline/body/verdict/option strings); NO blocks removed, all
 * ids + checker weights + correct_index preserved. Lossless → plain book-writer save.
 *
 * Run: node scripts/lifeskills_focus_p4_simplify.js [--dry]
 */
require('dotenv').config({ path: '.env.local' });
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'life-skills-class-9';
const SLUG = 'the-multitasking-myth';
const DRY = process.argv.includes('--dry');

const NEW_INTRO = 'Tap to walk through it. One idea at a time — see where “music helps me study” is true, and where it quietly breaks.';
const NEW_OUTRO = "You'll never hear your study playlist the same way again — and now you know when to press play, and when to press pause.";

// 8 beats, in order. id/kind/checker are preserved from the live block.
const STEPS = [
  { kicker: 'The claim', headline: '“Music helps me study.”',
    body: "Earphones in, playlist on — and you can study for hours. Most students say music helps them focus. Let's check that, because part of it is true… and part of it is quietly costing you." },
  { kicker: "What's real", headline: 'Music really does help you',
    body: "It puts you in a better mood, and it covers up noise — a loud sibling, the TV, the street. That's real: a good mood and less noise help you sit down and get started. Keep that part." },
  { kicker: 'The catch', headline: 'Reading uses one “word lane”',
    body: "Reading a chapter, understanding a topic, learning a definition — that's all words. Your brain has just one lane for words, and it can only follow one set of words at a time." },
  { kicker: 'The clash', headline: 'Song words use the same lane',
    body: "So when a song with words plays while you read, two sets of words try to use that one lane together — and crash. You finish the line and nothing went in, so you read it again. Songs you know by heart are the worst: you can't stop following the words." },
  { kicker: 'Test your own setup', headline: 'Will your playlist cost you?',
    body: "It's not the same for every task. Pick what you're doing and what's playing — watch the answer change:" },
  { kicker: 'The trap', headline: 'It feels good — that’s the trap',
    body: "Here's the sneaky part. Music makes studying feel smooth and nice, so you think it went great. But in tests, students who studied with word-songs remember less — even when they felt more focused. It feels good; you learn less." },
  { kicker: 'The rule', headline: 'Not “no music” — the right music',
    body: "You don't have to study in silence. The only problem is word-songs during word-work. Simple rule: words in your ears fight words on your page. For reading and learning → music with no words, or nothing. For easy repeat-work you already know — similar sums, copying notes → songs are fine." },
  { kicker: 'The old idea', headline: 'One thing at a time',
    body: "The Gita said this long ago (2.41): a steady mind holds one aim; a scattered mind splits into a hundred. Giving your reading one clear lane is exactly that — one thing at a time. It was never about silence. It's about not splitting your attention." },
];

const VERDICTS = {
  high: "Hard word-work **and** words in your ears — both fight for the one lane. You'll reread lines and forget more. Turn the words off for this.",
  mild: "A small clash. It won't ruin the session, but you'd remember a little more with the words off. Up to you.",
  clear: 'Go ahead — these two barely fight. Music here is fine, and it can even help you get started.',
};

// Quiz: only Q1 + Q2 referenced "channel"; realign to "word lane". (Q3/Q4 untouched.)
const Q1 = {
  question: 'Reading, understanding a topic, and learning definitions all use…',
  options: ['A separate lane just for numbers', 'One “word lane” in your brain', 'Two word lanes at once', 'Pure muscle memory'],
  explanation: 'Words all use one lane, and it can only follow one set of words at a time.',
};
const Q2 = {
  question: 'Why do song words hurt reading more than music with no words?',
  options: ['The words are simply louder', 'Song words use the same lane as the words on your page', 'Wordless music is banned in exams', 'Song words speed up your heartbeat'],
  explanation: 'Two sets of words crash in one lane; music with no words leaves the lane free for the page.',
};

async function main() {
  await bw.withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book ${BOOK_SLUG} not found`);
    const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug: SLUG });
    if (!page) throw new Error(`page ${SLUG} not found`);

    let walkDone = false, quizDone = false;
    const out = page.blocks.map((b) => {
      if (b.type === 'guided_reveal') {
        if (b.steps.length !== STEPS.length) throw new Error(`walkthrough has ${b.steps.length} steps, expected ${STEPS.length}`);
        walkDone = true;
        return {
          ...b,
          intro: NEW_INTRO,
          outro: NEW_OUTRO,
          steps: b.steps.map((s, i) => ({
            ...s,
            kicker: STEPS[i].kicker,
            headline: STEPS[i].headline,
            body: STEPS[i].body,
            ...(s.kind === 'cost_checker' && s.checker ? { checker: { ...s.checker, verdicts: VERDICTS } } : {}),
          })),
        };
      }
      if (b.type === 'inline_quiz') {
        quizDone = true;
        return {
          ...b,
          questions: b.questions.map((q, i) =>
            i === 0 ? { ...q, ...Q1 } : i === 1 ? { ...q, ...Q2 } : q),
        };
      }
      return b;
    });
    if (!walkDone) throw new Error('guided_reveal block not found');
    if (!quizDone) throw new Error('inline_quiz block not found');

    const res = await bw.savePage(db, { pageId: page._id }, out, {
      author: 'agent',
      summary: 'page 4: simplify walkthrough language (plain classroom English; "channel"→"word lane"); align quiz Q1/Q2',
      dryRun: DRY,
    });
    console.log(DRY
      ? `[dry] ${SLUG}: removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length} (expect 0/0 — text-only)`
      : `✓ ${SLUG}: v${res.version} · walkthrough + quiz language simplified`);
  });
  console.log(DRY ? '\n[dry] no writes.' : '\n✅ Page 4 language simplified.');
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
