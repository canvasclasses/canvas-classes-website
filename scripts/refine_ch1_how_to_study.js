'use strict';
/**
 * Folds three foundation sections into Ch.1 page `how-chemistry-began` (founder
 * decision 2026-06-14: merge rather than add a separate page):
 *   - How Science Works (law → hypothesis → theory)   [reference-first: Mittal §1.2]
 *   - How to Study Chemistry                            [Mittal §1.6]
 *   - How to Use This Book                              [Mittal "Guide to Using This Text"]
 * Inserted after the existing "What chemistry is, now" text, before the quiz.
 * Additive only → content-loss guard passes. Writes via scripts/lib/book-writer.js.
 * Run: node scripts/refine_ch1_how_to_study.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const SLUG = 'how-chemistry-began';

function newBlocks() {
  return [
    { id: uuidv4(), type: 'heading', level: 2, text: 'How Science Works: Law → Hypothesis → Theory',
      objective: 'Tell a law, a hypothesis and a theory apart, and see why chemistry’s big ideas all began as experiments.' },
    { id: uuidv4(), type: 'text', markdown:
      "Chemistry didn’t arrive as a finished set of facts. It was built, step by step, the way all science is built.\n\n" +
      "A scientist starts by **observing and experimenting**. When the same result shows up again and again, it gets summed up as a **law** — a short statement of *what* happens, every time (it does not say *why*). To explain why a law holds, someone proposes a **hypothesis**, a tentative idea. A hypothesis that survives repeated testing and goes on to explain many separate facts becomes a **theory** — and a good theory can even *predict* results no one has measured yet.\n\n" +
      "Every major idea in this book travelled that road. The **Law of Conservation of Mass** and the **Law of Definite Proportions** were squeezed out of careful weighing experiments; Dalton’s **Atomic Theory** was the idea that explained them; and because it kept working, it became the foundation the whole subject is built on." },
    { id: uuidv4(), type: 'table', caption: 'How an idea grows in science',
      headers: ['Stage', 'What it is', 'Example from chemistry'],
      rows: [
        ['Law', 'A concise statement of what always happens — with no explanation', 'Law of Conservation of Mass'],
        ['Hypothesis', 'A tentative idea put forward to explain a law', 'Matter is made of indivisible atoms (early Dalton)'],
        ['Theory', 'A well-tested explanation that fits many facts and predicts new ones', 'Dalton’s Atomic Theory'],
      ] },

    { id: uuidv4(), type: 'heading', level: 2, text: 'How to Study Chemistry',
      objective: 'Build the handful of habits that make chemistry click instead of pile up.' },
    { id: uuidv4(), type: 'text', markdown:
      "Chemistry feels hard at first for one honest reason: it is like **learning a new language**. There is fresh vocabulary ($\\ce{NaCl}$, mole, oxidation), new symbols, and some ideas you can’t see directly. The good news — with a few steady habits it becomes one of the most logical, rewarding subjects you’ll study.\n\n" +
      "- **Don’t read passively.** Skim a page’s outline first to see where it’s heading, then read for understanding. Reading chemistry like a story doesn’t stick.\n" +
      "- **Work problems — don’t just watch them.** You learn chemistry the way you learn cricket or cycling: by doing. Read a solved example, then close it and redo it yourself.\n" +
      "- **Review the same day.** Ten minutes revisiting today’s topic tonight saves an hour of relearning next week.\n" +
      "- **Test yourself by explaining.** If you can explain an idea to a friend in plain words, you own it. If you stumble, you’ve just found exactly what to revise.\n" +
      "- **Ask early.** One cleared doubt today prevents ten confused pages later." },

    { id: uuidv4(), type: 'heading', level: 2, text: 'How to Use This Book',
      objective: 'Get the most out of every feature on these pages.' },
    { id: uuidv4(), type: 'text', markdown:
      "This isn’t a printed textbook — it’s built to teach you actively. Here’s how to use what’s on each page:\n\n" +
      "- **Start at the chapter overview.** It maps the whole journey so you always know where a topic fits.\n" +
      "- **Watch and listen.** The video and audio clips are short explanations in your teacher’s own voice — use them when a concept needs to be *heard*, not just read.\n" +
      "- **Try the worked examples before revealing the answer.** Attempt first, then tap to check. The struggle is where the learning happens.\n" +
      "- **Use the quick quizzes as a checkpoint**, not a test. Get one wrong and the explanation tells you why — that’s the point.\n" +
      "- **Read the Exam Insight boxes** for what JEE/NEET actually ask, and use the practice links to drill the topic in the Crucible question bank.\n\n" +
      "A short video walking you through **how to use this book, which topics are must-do, and which you can skip if your basics are solid** will be added once the chapter is complete." },
  ];
}

bw.withDb(async (db) => {
  const page = await db.collection('book_pages').findOne({ slug: SLUG });
  if (!page) throw new Error(`${SLUG} not found`);
  if ((page.blocks || []).some((b) => b.type === 'heading' && /How to Study Chemistry/.test(b.text || ''))) {
    console.log('⚠  foundation sections already present — skipping (idempotent).');
    return;
  }
  const sorted = (page.blocks || []).slice().sort((a, b) => a.order - b.order);
  // Insert after the "What chemistry is, now" closing text, before the quiz.
  let idx = sorted.findIndex((b) => b.type === 'text' && /What chemistry is, now/.test(b.markdown || ''));
  if (idx === -1) idx = sorted.findIndex((b) => b.type === 'inline_quiz') - 1; // fallback: before quiz
  const insertAt = idx + 1;
  const merged = [...sorted.slice(0, insertAt), ...newBlocks(), ...sorted.slice(insertAt)].map((b, i) => ({ ...b, order: i }));

  const preview = await bw.savePage(db, { slug: SLUG }, merged, { dryRun: true });
  console.log(`DRY-RUN ${SLUG}: ${sorted.length} → ${merged.length} blocks · lossDetected=${preview.diff.lossDetected}`);
  const res = await bw.savePage(db, { slug: SLUG }, merged,
    { author: 'agent', summary: 'add How Science Works + How to Study Chemistry + How to Use This Book (Mittal §1.2/§1.6)' });
  console.log(`✓ saved. version #${res.version}. Page now ${merged.length} blocks.`);
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
