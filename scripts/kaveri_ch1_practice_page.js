'use strict';
/**
 * Kaveri Ch.1 — adds a "Practice & Mastery" page with one adaptive
 * `chapter_practice` block. Questions are seeded from Ch1's own authenticated
 * inline_quiz / comprehension content + vocabulary, laddered difficulty 1–5
 * across concept tags. Idempotent: re-running updates the same page (matched
 * by slug) rather than duplicating.
 *
 * Run:  node scripts/kaveri_ch1_practice_page.js   [--rollback]
 * Docs affected: 1 book_pages doc (upsert) + 1 book.chapters[0].page_ids entry.
 * Rollback: --rollback deletes that page and removes it from page_ids.
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_SLUG = 'class9-english-kaveri';
const PAGE_SLUG = 'ch1-practice-mastery';
const CHAPTER = 1;

const QUESTIONS = [
  // ── Comprehension (recall → understand) ──────────────────────────────────
  { id: 'ch1-pr-01', concept_tag: 'comprehension', difficulty: 1,
    question: 'Who is Krishtakka in the story?',
    options: ["The narrator's mother", "The grandmother — the narrator's *Avva*", 'A character inside the novel *Kashi Yatre*', "The writer Triveni's pen-name"],
    correct_index: 1, explanation: 'Krishtakka is the grandmother — the narrator calls her Avva (Kannada for grandmother).' },
  { id: 'ch1-pr-02', concept_tag: 'comprehension', difficulty: 1,
    question: 'Which novel does the narrator read aloud to her grandmother every week?',
    options: ['A Tamil novel called *The Lake Isle*', "Triveni's *Kashi Yatre*", 'A school textbook', 'An old book of folk tales'],
    correct_index: 1, explanation: 'The weekly serial of Triveni’s *Kashi Yatre* is what the grandmother waits for.' },
  { id: 'ch1-pr-03', concept_tag: 'comprehension', difficulty: 2,
    question: "What was the real name of the writer who wrote under the pen-name 'Triveni'?",
    options: ['Sudha Murty', 'Krishtakka', 'Anasuya Shankar', 'It is never revealed'],
    correct_index: 2, explanation: 'Triveni was the pen-name of Anasuya Shankar.' },
  { id: 'ch1-pr-04', concept_tag: 'comprehension', difficulty: 2,
    question: 'By which day did Krishtakka set herself the goal of learning to read?',
    options: ['The next monsoon', 'Saraswati Puja day during Dassara', 'Her sixty-third birthday', 'The end of the village fair'],
    correct_index: 1, explanation: 'She set Saraswati Puja during Dassara as her deadline — a date sacred to learning.' },

  // ── Vocabulary in context (real Ch1 words, new sentences) ────────────────
  { id: 'ch1-pr-05', concept_tag: 'vocab_in_context', difficulty: 2,
    question: 'On her first day at the new school, no one helped Meera — it was **sink or swim**. Here, *sink or swim* means she had to:',
    options: ['ask the teacher for constant help', 'succeed or fail entirely on her own, without help', 'choose between two subjects', 'learn to swim before studying'],
    correct_index: 1, explanation: '*Sink or swim* = you manage on your own; no one will rescue you.' },
  { id: 'ch1-pr-06', concept_tag: 'vocab_in_context', difficulty: 3,
    question: 'After practising every evening, the grandmother’s reading improved by **leaps and bounds**. This means her reading improved:',
    options: ['very slowly, letter by letter', 'only on festival days', 'very quickly', 'with someone else’s help'],
    correct_index: 2, explanation: '*By leaps and bounds* = developing very rapidly.' },
  { id: 'ch1-pr-07', concept_tag: 'vocab_in_context', difficulty: 3,
    question: 'Waiting for the weekly bus was **part and parcel** of village life. *Part and parcel* means it was:',
    options: ['an annoying, avoidable habit', 'an essential, inseparable part of it', 'a rare and special event', 'a recent change to it'],
    correct_index: 1, explanation: '*Part and parcel* = a basic, inseparable part of something.' },

  // ── Grammar (prefixes / suffixes — the chapter’s word-formation focus) ───
  { id: 'ch1-pr-08', concept_tag: 'grammar', difficulty: 2,
    question: "Which prefix turns **respect** into its opposite — 'lack of respect'?",
    options: ['un-', 'dis-', 'mis-', 'in-'],
    correct_index: 1, explanation: 'dis- + respect → *disrespect*. (un-/mis-/in- do not form this word.)' },
  { id: 'ch1-pr-09', concept_tag: 'grammar', difficulty: 3,
    question: 'In the word **generous**, the suffix *-ous* means:',
    options: ['without', 'the most', 'full of', 'one who does'],
    correct_index: 2, explanation: '*-ous* = full of. *Generous* = full of giving.' },
  { id: 'ch1-pr-10', concept_tag: 'grammar', difficulty: 4,
    question: "Krishtakka first thought she was too old to learn. Her ______ slowly melted once she began. Which correctly-formed word fits the blank?",
    options: ['unbelief', 'disbelief', 'misbelief', 'non-belief'],
    correct_index: 1, explanation: "The standard opposite of *belief* is *disbelief* — the prefix dis- marks the refusal to accept." },

  // ── Interpretation / inference (the deeper questions) ─────────────────────
  { id: 'ch1-pr-11', concept_tag: 'interpretation', difficulty: 3,
    question: "Why might Anasuya Shankar have chosen a male-sounding pen-name like 'Triveni'?",
    options: ['She wanted her readers to feel her work was unusual and exotic.', 'Indian publishing in the 1950s and 60s did not take women writers seriously, so a male-sounding name helped her work get read fairly.', 'Her family disapproved of her writing, so she hid her identity from them.', 'It is impossible to know — the story gives no reason.'],
    correct_index: 1, explanation: 'A male-sounding name helped a woman writer be judged on the work, not her gender, in that era.' },
  { id: 'ch1-pr-12', concept_tag: 'interpretation', difficulty: 4,
    question: "Why does Sudha Murty tell us the *plot* of Triveni's novel (the old lady, the orphan girl, the gift of savings) inside her own story?",
    options: ['To prove Triveni was a great writer', 'Because students like summaries', 'The plot inside the novel mirrors the real grandmother — both old women, both with a choice to make. The inner story prepares us to understand the outer one.', 'It is just background; the plot has no link to Krishtakka.'],
    correct_index: 2, explanation: 'The story-within-the-story rhymes with Krishtakka’s own situation — that mirroring is the point.' },
  { id: 'ch1-pr-13', concept_tag: 'interpretation', difficulty: 4,
    question: "Sudha Murty *never uses the word 'education'* in the whole story. The story argues this is deliberate. Why?",
    options: ['She forgot the word and the editors missed it.', 'The translator dropped it from the Kannada.', 'Stating the message directly closes the door on the reader; showing it through events makes the reader *feel* it.', 'The story is not really about education at all.'],
    correct_index: 2, explanation: 'Showing rather than telling lets the reader arrive at the meaning themselves.' },
  { id: 'ch1-pr-14', concept_tag: 'interpretation', difficulty: 5,
    question: "Which line is the **strongest** textual evidence for the theme *'the dignity of self-sufficiency'*?",
    options: ["'When I was a girl of about twelve...'", "'For learning there is no age bar.'", "'We are well-off, but what use is money when I cannot be independent?'", "'The Dassara festival came as usual.'"],
    correct_index: 2, explanation: 'This line ties dignity directly to being able to do a basic thing for oneself — the heart of self-sufficiency.' },
  { id: 'ch1-pr-15', concept_tag: 'inference', difficulty: 4,
    question: 'Which single comparison best captures the role-shift across the story?',
    options: ['Narrator: rich → poor; grandmother: poor → rich', 'Narrator: reader → teacher; grandmother: listener → student → reader', 'Both characters’ personalities change completely', 'Neither character changes at all'],
    correct_index: 1, explanation: 'The granddaughter becomes the teacher; the grandmother moves from listening to reading for herself.' },
];

(async () => {
  const rollback = process.argv.includes('--rollback');
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  const db = c.db('crucible');
  const books = db.collection('books');
  const pages = db.collection('book_pages');

  const book = await books.findOne({ slug: BOOK_SLUG });
  if (!book) throw new Error(`Book ${BOOK_SLUG} not found`);
  const bookId = String(book._id);
  const chapter = book.chapters.find((ch) => ch.number === CHAPTER);
  if (!chapter) throw new Error(`Chapter ${CHAPTER} not found`);

  const existing = await pages.findOne({ book_id: bookId, slug: PAGE_SLUG });

  if (rollback) {
    if (existing) {
      await pages.deleteOne({ _id: existing._id });
      await books.updateOne(
        { _id: book._id, 'chapters.number': CHAPTER },
        { $pull: { 'chapters.$.page_ids': existing._id } }
      );
      console.log(`Rolled back: removed page ${PAGE_SLUG} and its page_id.`);
    } else {
      console.log('Nothing to roll back.');
    }
    await c.close();
    return;
  }

  // page_number = one past the current max in this chapter.
  const chPages = await pages.find({ book_id: bookId, chapter_number: CHAPTER }).project({ page_number: 1 }).toArray();
  const nextPageNumber = chPages.reduce((m, p) => Math.max(m, p.page_number || 0), 0) + 1;

  const practiceBlock = {
    id: randomUUID(),
    type: 'chapter_practice',
    order: 2,
    title: 'Chapter 1 Practice',
    intro: "You've read the whole chapter — now make it stick. These questions **adapt** to how you answer: get a streak right and they get harder; slip and they ease off. They draw on the story, its vocabulary, and the word-formation you met along the way.",
    chapter_number: CHAPTER,
    session_size: 8,
    pass_threshold: 0.7,
    questions: QUESTIONS,
  };

  const blocks = [
    { id: randomUUID(), type: 'heading', order: 0, text: 'Practice & Mastery', level: 1 },
    { id: randomUUID(), type: 'text', order: 1, markdown: "This is where reading turns into knowing. Work through a short, adaptive set drawn from everything in *How I Taught My Grandmother to Read* — the people, the ideas, the words. There's no rush: read each option, choose, and learn from the explanation before moving on." },
    practiceBlock,
  ];

  const pageId = existing ? existing._id : randomUUID();
  const doc = {
    _id: pageId,
    book_id: bookId,
    chapter_number: CHAPTER,
    page_number: existing ? existing.page_number : nextPageNumber,
    slug: PAGE_SLUG,
    title: 'Practice & Mastery',
    blocks,
    tags: ['kaveri_section:practice'],
    published: true,
    content_types: ['practice'],
    updated_at: new Date(),
  };

  if (existing) {
    await pages.updateOne({ _id: pageId }, { $set: { blocks, title: doc.title, tags: doc.tags, published: true, updated_at: new Date() } });
    console.log(`Updated existing practice page ${PAGE_SLUG} (${QUESTIONS.length} questions).`);
  } else {
    doc.created_at = new Date();
    await pages.insertOne(doc);
    await books.updateOne(
      { _id: book._id, 'chapters.number': CHAPTER },
      { $addToSet: { 'chapters.$.page_ids': pageId } }
    );
    console.log(`Created practice page ${PAGE_SLUG} (page ${doc.page_number}, ${QUESTIONS.length} questions) and linked it to Chapter ${CHAPTER}.`);
  }

  await c.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
