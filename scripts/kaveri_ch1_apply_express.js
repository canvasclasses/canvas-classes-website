'use strict';
/**
 * Kaveri Ch.1 — adds the "Apply & Express" (productive, gamified) block onto the
 * existing `ch1-practice-mastery` page, after the MCQ `chapter_practice` block.
 * Challenges are grounded in the real NCERT chapter: past-perfect drills,
 * predict-the-next-word from actual lines, the prefix exercise, and the
 * binomials/idioms the chapter asks students to "use in sentences of your own".
 *
 * Run:  node scripts/kaveri_ch1_apply_express.js   [--rollback]
 * Docs affected: 1 book_pages doc (the practice page) — its blocks array.
 * Rollback: --rollback strips the apply_express block back out.
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_SLUG = 'class9-english-kaveri';
const PAGE_SLUG = 'ch1-practice-mastery';
const CHAPTER = 1;

const CHALLENGES = [
  // ── Predict the next word (real lines from the story) ────────────────────
  { id: 'ch1-ae-01', kind: 'predict_word', concept_tag: 'comprehension', difficulty: 2,
    lead: 'For a good cause, if you are determined, you can overcome any obstacle. For learning there is no age',
    answers: ['bar', 'limit'],
    full_line: 'For learning there is no age bar.',
    explanation: "The grandmother's belief — learning has no age bar — is the heart of the chapter." },
  { id: 'ch1-ae-02', kind: 'predict_word', concept_tag: 'vocab_in_context', difficulty: 2,
    lead: 'She opened it and read the title at once. I knew then that my student had passed with flying',
    answers: ['colours', 'colors'],
    full_line: 'I knew then that my student had passed with flying colours.',
    explanation: "'Passed with flying colours' is an idiom for outstanding success." },
  { id: 'ch1-ae-03', kind: 'predict_word', concept_tag: 'comprehension', difficulty: 3,
    lead: 'Avva was a wonderful student. She would read, repeat, write, and',
    answers: ['recite'],
    full_line: 'She would read, repeat, write, and recite.',
    explanation: "Four verbs in a row show how completely the grandmother threw herself into learning." },

  // ── Fill the blank — PAST PERFECT TENSE (the chapter's grammar focus) ─────
  { id: 'ch1-ae-04', kind: 'fill_blank', concept_tag: 'grammar', difficulty: 3,
    prompt: 'By the time the narrator ________ (return) from the wedding, her grandmother ________ (already / decide) to learn to read.',
    answers: [['returned'], ['had already decided', 'had decided']],
    hint: 'The earlier action takes the past perfect (had + verb); the later action is simple past.',
    explanation: "Past perfect ('had decided') marks the action that happened first; simple past ('returned') the one that followed." },
  { id: 'ch1-ae-05', kind: 'fill_blank', concept_tag: 'grammar', difficulty: 4,
    prompt: 'When the delegates ________ (arrive) at the conference, the keynote speaker ________ (already / begin) the session.',
    answers: [['arrived'], ['had already begun', 'had begun']],
    explanation: "The speaker began first → past perfect ('had begun'); the delegates arrived after → simple past ('arrived')." },
  { id: 'ch1-ae-06', kind: 'fill_blank', concept_tag: 'vocab_in_context', difficulty: 3,
    prompt: '“We are well-off, but what use is money when I cannot be ________?” The grandmother longed to read on her own.',
    answers: [['independent']],
    hint: 'The word means doing things for yourself, needing no one else.',
    explanation: "Independence — being able to read for herself — is exactly what she is reaching for." },

  // ── Word builder — prefixes (the chapter's actual word-formation exercise) ─
  { id: 'ch1-ae-07', kind: 'word_builder', concept_tag: 'grammar', difficulty: 2,
    base: 'respect', affixes: ['un', 'dis', 'mis', 'im'], correct: 'dis', target: 'disrespect',
    meaning_hint: 'lack of respect', position: 'prefix',
    explanation: 'dis- turns respect into its opposite: disrespect.' },
  { id: 'ch1-ae-08', kind: 'word_builder', concept_tag: 'grammar', difficulty: 3,
    base: 'possible', affixes: ['un', 'im', 'in', 'dis'], correct: 'im', target: 'impossible',
    meaning_hint: 'not able to happen', position: 'prefix',
    explanation: "Before a 'p', the negative prefix is im-: impossible." },
  { id: 'ch1-ae-09', kind: 'word_builder', concept_tag: 'grammar', difficulty: 3,
    base: 'ordinary', affixes: ['un', 'extra', 'in', 'dis'], correct: 'extra', target: 'extraordinary',
    meaning_hint: 'far beyond ordinary; remarkable', position: 'prefix',
    explanation: 'extra- = beyond. extraordinary = far beyond the ordinary.' },

  // ── Compose your own (the chapter: "use these in sentences of your own") ──
  { id: 'ch1-ae-10', kind: 'sentence_compose', concept_tag: 'vocab_in_context', difficulty: 3,
    word: 'part and parcel',
    instruction: 'Write a sentence of your own using the binomial below.',
    rubric: ['I used the phrase “part and parcel”', 'My sentence shows it means an essential, inseparable part', 'It is a complete sentence'],
    model_answer: 'Waiting for the weekly bus was part and parcel of life in the village.',
    min_words: 6,
    explanation: "'Part and parcel' = an essential, inseparable part of something." },
  { id: 'ch1-ae-11', kind: 'sentence_compose', concept_tag: 'vocab_in_context', difficulty: 4,
    word: 'sink or swim',
    instruction: 'Write a sentence of your own using the binomial below.',
    rubric: ['I used the phrase “sink or swim”', 'My sentence shows it means succeed or fail on your own', 'It is a complete sentence'],
    model_answer: 'On my first day at the new school, no one helped me — it was sink or swim.',
    min_words: 6,
    explanation: "'Sink or swim' = you manage on your own, with no help." },

  // ── Unscramble (rebuild a memorable line) ────────────────────────────────
  { id: 'ch1-ae-12', kind: 'unscramble', concept_tag: 'comprehension', difficulty: 3,
    tokens: ['age', 'For', 'no', 'there', 'bar', 'learning', 'is'],
    answer: 'For learning there is no age bar',
    explanation: "The grandmother's whole spirit in seven words." },
  { id: 'ch1-ae-13', kind: 'unscramble', concept_tag: 'interpretation', difficulty: 4,
    tokens: ['respected', 'A', 'age', 'should', 'teacher', 'of', 'be', 'irrespective'],
    answer: 'A teacher should be respected irrespective of age',
    explanation: "The grandmother uses tradition's own rule — respect the teacher — to justify touching her granddaughter's feet." },
];

(async () => {
  const rollback = process.argv.includes('--rollback');
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  const db = c.db('crucible');
  const pages = db.collection('book_pages');

  const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
  if (!book) throw new Error(`Book ${BOOK_SLUG} not found`);
  const page = await pages.findOne({ book_id: String(book._id), slug: PAGE_SLUG });
  if (!page) throw new Error(`Page ${PAGE_SLUG} not found — run kaveri_ch1_practice_page.js first`);

  // Keep every block except any prior apply_express (idempotent re-run).
  const kept = (page.blocks || []).filter((b) => b.type !== 'apply_express');

  if (rollback) {
    await pages.updateOne({ _id: page._id }, { $set: { blocks: kept.map((b, i) => ({ ...b, order: i })), updated_at: new Date() } });
    console.log(`Rolled back: removed apply_express from ${PAGE_SLUG}.`);
    await c.close();
    return;
  }

  const applyBlock = {
    id: randomUUID(),
    type: 'apply_express',
    order: kept.length,
    title: 'Apply & Express',
    intro: "Now show what you can **do** with the chapter — not just what you remember. Fill in the blanks, predict the next word, build words, and write your own sentences. Earn XP, keep your streak, and chase three stars.",
    chapter_number: CHAPTER,
    challenges: CHALLENGES,
  };

  const blocks = [...kept, applyBlock].map((b, i) => ({ ...b, order: i }));
  await pages.updateOne({ _id: page._id }, { $set: { blocks, updated_at: new Date() } });
  console.log(`Added apply_express (${CHALLENGES.length} challenges) to ${PAGE_SLUG}. Page now has ${blocks.length} blocks.`);

  await c.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
