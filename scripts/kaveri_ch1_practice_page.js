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
    options: ['rely on her teacher and her classmates to guide her through every step', 'succeed or fail entirely on her own, without help', 'choose between two different subjects', 'learn to swim before she could study'],
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
    question: "Why might Anasuya Shankar have chosen to write under a pen-name like 'Triveni' rather than her own name?",
    options: ['Women writers were often not taken seriously in that era, so a pen-name let her work be judged on its own merit.', "'Triveni' — the meeting of three sacred rivers — was chosen purely for its auspicious, devotional sound.", 'Her family strongly disapproved of women writing novels, so she hid her identity from them.', 'Magazines at the time required every author to publish under a single-word name.'],
    correct_index: 0, explanation: 'A pen-name helped a woman writer of that time be read and judged on the work itself, not on her gender.' },
  { id: 'ch1-pr-12', concept_tag: 'interpretation', difficulty: 4,
    question: "Why does Sudha Murty tell us the *plot* of Triveni's novel (the old lady, the orphan girl, the gift of savings) inside her own story?",
    options: ['To show off the narrator’s wide reading and her deep love of literature.', 'Because the novel was so famous at the time that readers would naturally expect a short recap of its plot here.', 'The inner plot mirrors Krishtakka — both old women facing a choice — readying us for her own story.', 'It only sets the scene; the inner plot has no real link to Krishtakka.'],
    correct_index: 2, explanation: 'The story-within-the-story rhymes with Krishtakka’s own situation — that mirroring is the point.' },
  { id: 'ch1-pr-13', concept_tag: 'interpretation', difficulty: 4,
    question: "Sudha Murty *never directly states a moral* like 'education matters' in the story. The chapter argues this is a deliberate craft choice. Why?",
    options: ['A warm, personal story like this one would quickly feel flat and preachy if it ever stopped to spell out its message.', 'Stating a lesson outright tells readers what to think; showing it through events lets them feel and discover it.', 'The story is really about family love, not learning, so a moral would be out of place.', 'Indian textbooks forbid stating morals inside a story.'],
    correct_index: 1, explanation: 'Showing rather than telling lets the reader arrive at the meaning themselves — the heart of good storytelling.' },
  { id: 'ch1-pr-14', concept_tag: 'interpretation', difficulty: 5,
    question: "Which line is the **strongest** textual evidence for the theme *'the dignity of self-sufficiency'*?",
    options: ["'When I was a girl of about twelve...'", "'For learning there is no age bar.'", "'We are well-off, but what use is money when I cannot be independent?'", "'For a good cause, if you are determined, you can overcome any obstacle.'"],
    correct_index: 2, explanation: 'This line ties dignity directly to being able to do a basic thing for oneself — the heart of self-sufficiency.' },
  { id: 'ch1-pr-15', concept_tag: 'inference', difficulty: 4,
    question: 'Which single comparison best captures the role-shift across the story?',
    options: ['Narrator: rich → poor; grandmother: poor → rich', 'Narrator: reader → teacher; grandmother: listener → student → reader', 'Both characters swap roles and end up with completely different personalities', 'Neither character changes at all'],
    correct_index: 1, explanation: 'The granddaughter becomes the teacher; the grandmother moves from listening to reading for herself.' },

  // ── Plot-specific comprehension (you must actually know the story) ────────
  { id: 'ch1-pr-16', concept_tag: 'comprehension', difficulty: 2,
    question: 'What finally pushed Krishtakka to decide to learn to read herself?',
    options: ['With the narrator away at a wedding, Krishtakka couldn’t read that week’s instalment herself — and it stung.', 'The narrator told her she would stop reading aloud to her altogether unless she first agreed to learn the alphabet herself.', 'A teacher came to the village and offered free lessons to everyone.', 'Her friends teased her for not being able to read.'],
    correct_index: 0, explanation: 'Missing an instalment because no one was there to read it made her feel her dependence — and she resolved to end it.' },
  { id: 'ch1-pr-17', concept_tag: 'comprehension', difficulty: 3,
    question: 'On Saraswati Puja day, how did Krishtakka honour her young teacher?',
    options: ['She wrote her a long thank-you letter and read it aloud to the family.', 'She gave her a gift and insisted on touching her feet, honouring her as a *guru*.', 'She cooked a grand feast for the whole village.', 'She enrolled her in a teacher-training course in the city.'],
    correct_index: 1, explanation: 'Following tradition, she treated her granddaughter as a guru — a gift and a touch of the feet, respect irrespective of age.' },
  { id: 'ch1-pr-18', concept_tag: 'comprehension', difficulty: 1,
    question: 'What is *Kashi Yatre* in the story?',
    options: ['A pilgrimage to the holy city of Kashi that the grandmother had long been hoping to make herself.', 'A novel by Triveni that the narrator read aloud to her grandmother in weekly instalments.', 'A devotional song sung during the Dassara festival.', 'The name of the grandmother’s home village.'],
    correct_index: 1, explanation: '*Kashi Yatre* is Triveni’s serialised novel — the weekly instalment the grandmother waited for. (Its title *means* a pilgrimage to Kashi, which is the tempting wrong answer.)' },

  // ── Vocabulary in context (tight, near-miss distractors) ─────────────────
  { id: 'ch1-pr-19', concept_tag: 'vocab_in_context', difficulty: 2,
    question: 'In the novel, the old lady had no children of her own, so she gave the orphan girl her **life’s savings**. Here *life’s savings* means:',
    options: ['all the money she had carefully set aside over the years', 'the lessons she had learned across her life', 'the few years of life she had left', 'the house, land, and jewellery she had inherited from her family'],
    correct_index: 0, explanation: '*Life’s savings* = the money saved up over a lifetime.' },
  { id: 'ch1-pr-20', concept_tag: 'vocab_in_context', difficulty: 3,
    question: 'Krishtakka kept her word and practised every single day **without fail**. *Without fail* here means:',
    options: ['without ever making a single mistake', 'every time, with no exception', 'without needing anyone’s help', 'without ever feeling tired'],
    correct_index: 1, explanation: '*Without fail* = every single time, no exceptions. (Note the tempting near-miss: it is about *never skipping*, not about *never erring*.)' },

  // ── Grammar (suffixes, negative prefixes, the chapter’s past-perfect focus) ─
  { id: 'ch1-pr-21', concept_tag: 'grammar', difficulty: 2,
    question: 'In the word **helpless**, the suffix *-less* means:',
    options: ['full of', 'without', 'able to be', 'in the manner of'],
    correct_index: 1, explanation: '*-less* = without. *Helpless* = without help.' },
  { id: 'ch1-pr-22', concept_tag: 'grammar', difficulty: 3,
    question: 'Which is the correctly-formed opposite of **literate**, using a negative prefix?',
    options: ['unliterate', 'disliterate', 'illiterate', 'nonliterate'],
    correct_index: 2, explanation: 'Before a word starting with *l*, the negative prefix *in-* becomes *il-*: *illiterate*.' },
  { id: 'ch1-pr-23', concept_tag: 'grammar', difficulty: 4,
    question: 'Which sentence uses the **past perfect** correctly?',
    options: ['By the time her granddaughter returned, Krishtakka had already learnt the alphabet.', 'By the time her granddaughter returned, Krishtakka has already learnt the alphabet.', 'By the time her granddaughter returned, Krishtakka already learns the alphabet.', 'By the time her granddaughter returned, Krishtakka was already learn the alphabet.'],
    correct_index: 0, explanation: 'The earlier action takes *had + past participle*: “had already learnt.”' },

  // ── Interpretation / inference (higher-order, guess-resistant) ───────────
  { id: 'ch1-pr-24', concept_tag: 'interpretation', difficulty: 4,
    question: 'Why is it meaningful that Krishtakka set **Saraswati Puja** as her deadline to learn to read?',
    options: ['It was simply the next big festival on the calendar, and honestly any nearby date would have done just as well.', 'Saraswati is the goddess of learning, so the date links her goal to a celebration of knowledge.', 'It happened to be her own birthday, so it was easy to remember.', 'The village school reopened on that day.'],
    correct_index: 1, explanation: 'Choosing the festival of the goddess of learning makes her private effort part of something larger and sacred.' },
  { id: 'ch1-pr-25', concept_tag: 'inference', difficulty: 3,
    question: 'When the narrator sees her grandmother read the novel’s title on her own for the first time, she most likely feels:',
    options: ['proud and moved — her “student” has truly succeeded', 'worried that her grandmother no longer needs her', 'amused at the slow, careful way she reads', 'indifferent, because she always expected it'],
    correct_index: 0, explanation: 'The narrator calls it passing “with flying colours” — the pride of a teacher whose student has made it.' },
  { id: 'ch1-pr-26', concept_tag: 'interpretation', difficulty: 5,
    question: 'Sudha Murty tells this as a **true memory of her own grandmother**, not as invented fiction. How does that choice strengthen the story?',
    options: ['It makes the story harder to believe, since memories are often unreliable.', 'It makes the lesson feel lived and true, so the reader trusts the emotion more deeply.', 'It has no effect — a memoir and a made-up story read exactly the same.', 'It turns the piece into a dry, factual history with little feeling.'],
    correct_index: 1, explanation: 'Because it really happened to her, the warmth and the lesson land as truth rather than as a moral tacked on.' },
];

// Spread the correct answer across A/B/C/D so "always pick B" can't beat the
// quiz. Deterministic (fixed pattern, not a plain A-B-C-D cycle) → re-running
// this script always yields the same balanced layout. Mirrors
// scripts/kaveri-fix/balance_positions.js for the JSON-sourced chapters.
const POS_PATTERN = [1, 3, 0, 2, 2, 0, 3, 1];
function balancePositions(questions) {
  return questions.map((q, i) => {
    if (!Array.isArray(q.options) || q.options.length !== 4) return q;
    const target = POS_PATTERN[i % POS_PATTERN.length];
    const correct = q.options[q.correct_index];
    const distractors = q.options.filter((_, k) => k !== q.correct_index);
    const opts = [];
    let di = 0;
    for (let p = 0; p < 4; p++) opts.push(p === target ? correct : distractors[di++]);
    return { ...q, options: opts, correct_index: target };
  });
}

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
    session_size: 10,
    pass_threshold: 0.7,
    questions: balancePositions(QUESTIONS),
  };

  // Preserve any apply_express block previously added by kaveri_ch1_apply_express.js —
  // otherwise re-running this script (e.g. to rebalance positions) would silently
  // wipe the Apply & Express challenges off the live page.
  const existingApply = existing?.blocks?.find((b) => b.type === 'apply_express');
  const blocks = [
    { id: randomUUID(), type: 'heading', order: 0, text: 'Practice & Mastery', level: 1 },
    { id: randomUUID(), type: 'text', order: 1, markdown: "This is where reading turns into knowing. Work through a short, adaptive set drawn from everything in *How I Taught My Grandmother to Read* — the people, the ideas, the words. There's no rush: read each option, choose, and learn from the explanation before moving on." },
    practiceBlock,
    ...(existingApply ? [{ ...existingApply, order: 3 }] : []),
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
