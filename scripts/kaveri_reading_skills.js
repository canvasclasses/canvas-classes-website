'use strict';
require('./lib/legacy-book-guard'); // CLAUDE.md §0.6 — refuse silent hard-delete of book_pages
/**
 * Kaveri — builds the "Reading Skills" unit (the CBSE Reading-section pillar):
 * a teaching page + a discursive unseen passage + a case-based unseen passage,
 * each with basic-understanding questions (mcq / assertion-reason / short-answer).
 * Voice = a friendly North-Indian-classroom teacher. Competitive-level items live
 * in Crucible, not here.
 *
 * Idempotent by slug. Run: node scripts/kaveri_reading_skills.js [--rollback]
 * Docs affected: up to 2 book_pages (upsert) + 1 new book.chapters entry (#9).
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

const BOOK_SLUG = 'class9-english-kaveri';
const CHAPTER = 9;
const uid = () => randomUUID();

// ── Discursive passage ───────────────────────────────────────────────────────
const DISCURSIVE = `Most of us believe that big results need big actions. We imagine that the student who tops the class must study for ten hours a day, or that the athlete who wins must train like a machine. But if you look closely at people who do well — in studies, in sport, in life — you will often find something surprising. Their secret is not one giant effort. It is a small habit, repeated every single day.

Think about a person who wants to learn English. They could try to cram a thousand words in one night. By morning they will have forgotten most of them, and they will feel tired and defeated. Now think about another person who learns just five new words a day. In one month that is one hundred and fifty words; in one year it is more than eighteen hundred. The second person never struggled, never stayed up late — yet they ended up far ahead.

This is the quiet power of small habits. A small action feels too tiny to matter. Reading two pages, walking for ten minutes, revising one chapter — none of these will change your life in a day. That is exactly why people give them up. They want to see results at once, and when they don't, they stop. But habits work like interest in a bank: each small deposit looks meaningless, until time quietly turns it into something large.

There is another reason small habits win — they are easy to start. The hardest part of any task is beginning it. If you tell yourself you will study for four hours, your mind resists. But if you promise just ten minutes, you sit down — and very often you keep going. The small habit removes the fear. It opens the door, and the rest follows.

Of course, small habits are not magic. They need patience, and patience is hard when everyone around you seems to be in a hurry. But the student who reads a little every day, without fail, builds something that cannot be built in one night before the exam. They build understanding — and understanding, once gained, does not slip away.

So the next time a big goal frightens you, do not hunt for a big effort. Look for the smallest step you can take today, and take it again tomorrow. Slowly, almost without noticing, you will become the person you wanted to be.`;

const DISCURSIVE_Q = [
  { kind: 'mcq', id: 'rs-d-q1', question: 'According to the passage, what is the real secret of people who do well?',
    options: ['One giant effort made at the right moment', 'A small habit repeated every single day', 'Studying for ten hours a day', 'The talent they were born with'],
    correct_index: 1, explanation: 'the passage says their secret is not one giant effort but “a small habit, repeated every single day.”' },
  { kind: 'mcq', id: 'rs-d-q2', question: 'The example of learning five words a day is given mainly to show that —',
    options: ['memorising words is a waste of time', 'English is a very difficult language', 'one should always study at night', 'small, steady effort adds up to a lot over time'],
    correct_index: 3, explanation: 'five words a day quietly becomes 1,800 in a year — the writer uses it to prove that small, regular effort piles up.' },
  { kind: 'mcq', id: 'rs-d-q3', question: 'The writer compares small habits to “interest in a bank.” This comparison means that —',
    options: ['each small effort seems tiny but grows large with time', 'saving money is more useful than reading', 'habits cost a lot of money', 'banks are safer than good habits'],
    correct_index: 0, explanation: 'like a small deposit that grows through interest, each tiny effort “looks meaningless, until time quietly turns it into something large.”' },
  { kind: 'assertion_reason', id: 'rs-d-q4',
    assertion: 'A small habit is easier to begin than a big task.', reason: 'The hardest part of any task is beginning it.',
    correct_index: 0, explanation: 'because beginning is the hardest part (R), a tiny ten-minute promise removes the fear and gets you to sit down (A) — so R correctly explains A.' },
  { kind: 'short_answer', id: 'rs-d-q5', question: 'In your own words, why do many people give up on small habits?',
    model_answer: 'Because a small action feels too tiny to matter, and they want to see results at once. When the change does not show up quickly, they lose patience and stop.',
    hint: 'Read the paragraph that explains why people “give them up.”' },
];

// ── Case-based passage ───────────────────────────────────────────────────────
const CASE = `In 2023, a small survey was carried out in three schools of a north Indian town. Two hundred students of Class 9 were asked one simple question: how do you spend your free time after school? Their answers were grouped into four activities, and the results are shown below.

| Activity | Students |
|---|---|
| Watching videos / phone | 96 |
| Playing outdoors | 54 |
| Reading (books, comics) | 28 |
| Helping at home | 22 |

The teachers who ran the survey were not surprised that screens came first. Phones are cheap now, and a video asks nothing of you — you simply watch. What worried them was the small number of readers: only twenty-eight students, about one in seven, read for pleasure.

So the teachers tried a small experiment. For two months, every classroom kept a shelf of story books, and the first ten minutes of each day were set aside for silent reading — nothing else, no questions, no marks. When the survey was repeated, the number of regular readers had nearly doubled, to fifty-one.

The lesson, the teachers felt, was not that children dislike reading. It was that reading simply needs a chance. Given a quiet ten minutes and an interesting book within reach, many students who had called themselves “non-readers” quietly became readers. Sometimes a habit is missing not because people refuse it, but because nobody ever opened the door.`;

const CASE_Q = [
  { kind: 'mcq', id: 'rs-c-q1', question: 'According to the table, which activity did the most students choose?',
    options: ['Reading books and comics', 'Playing outdoors', 'Watching videos on the phone', 'Helping at home'],
    correct_index: 2, explanation: 'the table shows 96 students chose watching videos / phone — the highest of the four.' },
  { kind: 'mcq', id: 'rs-c-q2', question: 'Before the experiment, about how many of the students read for pleasure?',
    options: ['About one in seven', 'Exactly half of them', 'About one in three', 'None of them at all'],
    correct_index: 0, explanation: '28 out of 200 is roughly one in seven — the passage says this directly.' },
  { kind: 'mcq', id: 'rs-c-q3', question: 'After the ten-minute reading experiment, the number of regular readers —',
    options: ['stayed exactly the same', 'nearly doubled', 'fell down to zero', 'became the highest activity of all'],
    correct_index: 1, explanation: 'it rose from 28 to 51 — nearly double.' },
  { kind: 'assertion_reason', id: 'rs-c-q4',
    assertion: 'Watching videos was the most common free-time activity in the survey.', reason: 'Phones are expensive, so very few students could afford to use them.',
    correct_index: 2, explanation: 'A is true — 96 students, the highest, chose watching videos. But R is false: the passage says phones are *cheap* now, which is exactly why screens won. So the right choice is “A is true, but R is false.”' },
  { kind: 'short_answer', id: 'rs-c-q5', question: 'What simple change did the teachers make, and what does its result teach us?',
    model_answer: 'They kept story books in every classroom and gave ten quiet minutes for silent reading each morning. The number of readers nearly doubled — showing that many children will read if reading is simply made easy and available to them.',
    hint: 'Look at the “small experiment” the teachers tried, and what happened after it.' },
];

// ── Pages ────────────────────────────────────────────────────────────────────
function introPage() {
  return [
    { id: uid(), type: 'heading', order: 0, level: 1, text: 'Reading Skills: Cracking the Unseen Passage' },
    { id: uid(), type: 'text', order: 1, markdown: "In your English exam, one part is not from your textbook at all. The examiner hands you a passage you have **never seen before** — a *seen* one would be too easy! — and asks questions on it. This is the **unseen passage**, and it carries good marks. Here is the happy secret: you don't have to *remember* anything. Every answer is sitting right there in the lines. Your only job is to read carefully and find it. Let's learn exactly how." },
    { id: uid(), type: 'callout', order: 2, variant: 'note', title: "Don't fear the word 'unseen'", markdown: "An unseen passage is not a trap. For a careful reader it is the **easiest marks in the paper** — because the answers cannot run away. They are hidden in the lines right in front of you." },
    { id: uid(), type: 'heading', order: 3, level: 2, text: 'Teen tarah ke passage — the three you will meet' },
    { id: uid(), type: 'text', order: 4, markdown: "Don't worry about the difficult names. In simple words:\n\n- **Discursive** — the writer is *sharing a view* and giving reasons, like a short essay (for example, *why small habits matter*).\n- **Factual** — the passage is full of *facts and information*, often with numbers, a table or a chart.\n- **Case-based** — a short factual passage built around a real situation or some data, with questions that make you *use* the information.\n\nWhatever the kind, the rule never changes: **the answer is in the passage.**" },
    { id: uid(), type: 'callout', order: 5, variant: 'exam_tip', title: 'How to attack any passage — 4 steps', markdown: "1. **Read the whole passage once**, calmly. Don't stop at every hard word — get the overall idea first.\n2. **Read the questions.** Now you know what to hunt for.\n3. **Go back and find** each answer in the lines, and underline it. The passage is your answer key.\n4. **Answer from the passage, not from your own head.** Even if you disagree, write what the passage says. Never add your own opinion in a comprehension answer." },
    { id: uid(), type: 'heading', order: 6, level: 2, text: 'Chalo, ek passage try karte hain' },
    { id: uid(), type: 'text', order: 7, markdown: "Here is a discursive passage. Read it the way we just learned — **once fully, then answer.** Take your time; there is no hurry." },
    { id: uid(), type: 'reading_comprehension', order: 8, passage_type: 'discursive', title: 'The Power of Small Habits',
      intro: 'Read the passage carefully, then answer the questions. Remember — har jawab passage ke andar hai.',
      passage: DISCURSIVE, numbered: true, word_count: 430, questions: DISCURSIVE_Q },
  ];
}

function casePage() {
  return [
    { id: uid(), type: 'heading', order: 0, level: 1, text: 'Practice: A Case-based Passage' },
    { id: uid(), type: 'text', order: 1, markdown: "This time the passage carries some **data** — a little table. Case-based questions love numbers, so read the table as carefully as you read the words. And remember our golden rule: every answer is right there in front of you." },
    { id: uid(), type: 'reading_comprehension', order: 2, passage_type: 'case_based', title: 'A Reading Survey in Three Schools',
      intro: 'Read the passage and the table, then answer. Table ko bhi dhyaan se padho — usmein bhi jawab chhupe hain.',
      passage: CASE, numbered: true, word_count: 235, questions: CASE_Q },
  ];
}

const PAGES = [
  { slug: 'reading-skills-intro', title: 'Reading Skills: The Unseen Passage', subtitle: 'Find the answer — it is already in the lines', blocks: introPage() },
  { slug: 'reading-skills-case-based', title: 'Practice: A Case-based Passage', subtitle: 'Read the data as carefully as the words', blocks: casePage() },
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

  if (rollback) {
    const slugs = PAGES.map((p) => p.slug);
    const existing = await pages.find({ book_id: bookId, slug: { $in: slugs } }).toArray();
    if (existing.length) await pages.deleteMany({ _id: { $in: existing.map((e) => e._id) } });
    await books.updateOne({ _id: book._id }, { $pull: { chapters: { number: CHAPTER } } });
    console.log(`Rolled back: removed ${existing.length} reading-skills pages and chapter ${CHAPTER}.`);
    await c.close();
    return;
  }

  const pageIds = [];
  for (let i = 0; i < PAGES.length; i++) {
    const def = PAGES[i];
    const existing = await pages.findOne({ book_id: bookId, slug: def.slug });
    const _id = existing ? existing._id : uid();
    pageIds.push(_id);
    const doc = {
      _id, book_id: bookId, chapter_number: CHAPTER, page_number: i + 1,
      slug: def.slug, title: def.title, subtitle: def.subtitle,
      blocks: def.blocks, hinglish_blocks: existing?.hinglish_blocks ?? [],
      tags: ['kaveri_chapter:9', 'kaveri_section:reading_skills'],
      published: true, content_types: ['reading_skills'], updated_at: new Date(),
    };
    if (existing) { await pages.updateOne({ _id }, { $set: doc }); console.log(`Updated ${def.slug}`); }
    else { doc.created_at = new Date(); await pages.insertOne(doc); console.log(`Inserted ${def.slug}`); }
  }

  // Upsert the chapter entry.
  const chapterEntry = { number: CHAPTER, title: 'Reading Skills: Unseen Passages', slug: 'reading-skills', page_ids: pageIds, is_published: true };
  const hasChapter = (book.chapters || []).some((ch) => ch.number === CHAPTER);
  if (hasChapter) {
    await books.updateOne({ _id: book._id, 'chapters.number': CHAPTER }, { $set: { 'chapters.$': chapterEntry } });
    console.log(`Updated chapter ${CHAPTER} (page_ids: ${pageIds.length}).`);
  } else {
    await books.updateOne({ _id: book._id }, { $push: { chapters: chapterEntry } });
    console.log(`Added chapter ${CHAPTER} "Reading Skills" with ${pageIds.length} pages.`);
  }

  await c.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
