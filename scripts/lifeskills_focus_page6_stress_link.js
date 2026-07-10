'use strict';
/**
 * Page 6 ("Breath: The Remote Control") — add the bidirectional stress↔breathing
 * link founder asked for: breathing isn't just a one-way remote control on the
 * body's alarm system, it's a two-way street — stress SHOWS UP as shallow/fast/
 * chest breathing, calm SHOWS UP as slow/deep/belly breathing, and (because it's
 * two-way) controlling breath controls stress back.
 *
 *  - INSERT after the "only dial" section, before "The 4-4-6 pattern": a new
 *    heading + text beat ("It works both ways") + a `self_experiment` activity
 *    ("Catch Your Breath" — notice breathing across excited/sad/relaxed/happy/
 *    stressed moments over the next day or two).
 *  - APPEND one quiz question reinforcing the two-way idea.
 *  - UPDATE the 4-4-6 Reset guided_practice intro to nudge a BEFORE self-check.
 *  - REWRITE the journal prompt to explicitly ask before / after / how it felt /
 *    why (keeping the body-location + trigger-moment asks already there).
 *
 * All additions + text-only edits — 0 blocks removed, no content-loss guard
 * needed. Order renumbered. Run: node scripts/lifeskills_focus_page6_stress_link.js [--dry]
 */
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'life-skills-class-9';
const SLUG = 'breath-the-remote-control';
const DRY = process.argv.includes('--dry');

const SECTION_ONLY_DIAL = '6771f99a'; // insert new beat right after this
const QUIZ_ID = '1e0a8cb1';
const GP_ID = '489c7e95';
const JOURNAL_ID = 'fda4fde6';

const newHeading = () => ({ id: uuidv4(), type: 'heading', order: 0, text: 'It works both ways', level: 2 });

const newText = () => ({
  id: uuidv4(), type: 'text', order: 0,
  markdown:
    "So far this looks like a one-way trick: press a button (breathe slowly) and the alarm quiets down. Look closer, and it's actually a **two-way street**.\n\n" +
    'Your breathing is already reporting your state, whether you notice it or not. Feel anxious, nervous, or under pressure, and your breathing goes ' +
    '**shallow and fast, high in the chest** — small sips of air, because your body is bracing rather than settling. Feel calm, relaxed, happy, or deeply ' +
    'focused, and your breathing goes **slow, deep, and rhythmic, low in the belly** — because there is nothing to brace against.\n\n' +
    'So stress can hijack your breath. And because the wire runs both ways, your **breath can hijack your stress right back**. That is not a coincidence — ' +
    "it's the entire trick behind the pattern below.",
});

const newExperiment = () => ({
  id: uuidv4(), type: 'self_experiment', order: 0,
  title: 'Catch Your Breath',
  intro: 'Over the next day or two, catch yourself in each of these moments — and notice what your breath is doing, without trying to change it. Just notice.',
  steps: [
    'Whenever you notice yourself feeling one of the moods below, pause for two seconds.',
    "Notice your breath exactly as it is — fast or slow, high in the chest or low in the belly, even or jerky. Don't fix it, just notice.",
    'Come back here and tick the ones you caught.',
  ],
  prompt: 'Which of these did you catch yourself in — and what was your breath doing?',
  options: [
    { id: uuidv4(), label: 'Excited',
      explanation: "Excitement speeds breathing up too — but unlike stress, it usually stays lighter and doesn't lock into the chest. Fast isn't always the enemy; *tight and shallow* is." },
    { id: uuidv4(), label: 'Sad',
      explanation: 'Sadness often brings slow, heavy, sighing breaths — long exhales, sometimes an involuntary sigh. The body seems to reach for the exhale\'s calming effect before your mind decides anything.' },
    { id: uuidv4(), label: 'Relaxed',
      explanation: 'Slow, deep, even, low in the belly — barely noticeable, because nothing is bracing for anything. This is the exact pattern the 4-4-6 below is trying to recreate on purpose.' },
    { id: uuidv4(), label: 'Happy',
      explanation: 'Usually easy and full, sometimes with a natural deep sigh — or a laugh (laughing is really just an exhale in bursts). Breath opens up when there is nothing to guard against.' },
    { id: uuidv4(), label: 'Stressed',
      explanation: 'Fast, shallow, high in the chest — small sips of air instead of full breaths. The body is bracing, not settling. This is the exact moment the 4-4-6 is built for.' },
  ],
  min_select: 1,
  completion_note: 'Notice the pattern: calm states breathe low and slow; stressed states breathe high and fast — often before you\'ve consciously registered feeling stressed at all. That makes your breath an early-warning system. The moment you catch the shallow, high, fast pattern, you now have a tool: the 4-4-6 below.',
});

const NEW_QUIZ_Q = {
  id: uuidv4(),
  question: 'Which pattern usually shows up when you\'re anxious or under pressure — often before you\'ve consciously noticed you\'re stressed?',
  options: ['Slow, deep breathing from the belly', 'Fast, shallow breathing, high in the chest', 'No change in breathing at all', 'Breathing that speeds up but stays deep'],
  correct_index: 1,
  explanation: 'Stress shows up in the breath first — fast, shallow, high in the chest — often before you consciously register the feeling. That is why the breath works as an early-warning system.',
  difficulty_level: 1,
};

const NEW_GP_INTRO =
  'Six rounds, under two minutes. Before you press Begin, notice: how does your breath feel right now — fast, slow, shallow, deep? ' +
  'Then follow the circle — grow with the inhale, pause, shrink with the exhale.';

const NEW_JOURNAL_PROMPT =
  'Think back on the 6 rounds. **Before** you began — how did you feel, and what was your breath doing (fast? shallow? high in the chest)? ' +
  '**After** — how do you feel now, and where did you feel the exhale land: shoulders, chest, jaw, stomach? **Why** do you think that shift happened? ' +
  'Finally, pick YOUR trigger moment: before which class, test, or situation will you fire the 4-4-6 this week?';

async function main() {
  await bw.withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book ${BOOK_SLUG} not found`);
    const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug: SLUG });
    if (!page) throw new Error(`page ${SLUG} not found`);

    let insertedAfterSection = false, quizFixed = false, gpFixed = false, journalFixed = false;
    const out = [];
    for (const b of page.blocks) {
      out.push(b);
      if (b.id.startsWith(SECTION_ONLY_DIAL)) {
        insertedAfterSection = true;
        out.push(newHeading(), newText(), newExperiment());
      }
    }
    for (let i = 0; i < out.length; i++) {
      const b = out[i];
      if (b.type === 'inline_quiz' && b.id.startsWith(QUIZ_ID)) {
        out[i] = { ...b, questions: [...b.questions, NEW_QUIZ_Q] };
        quizFixed = true;
      }
      if (b.type === 'guided_practice' && b.id.startsWith(GP_ID)) {
        out[i] = { ...b, intro: NEW_GP_INTRO };
        gpFixed = true;
      }
      if (b.type === 'reflection_journal' && b.id.startsWith(JOURNAL_ID)) {
        out[i] = { ...b, prompt: NEW_JOURNAL_PROMPT, min_words: 20 };
        journalFixed = true;
      }
    }
    if (!insertedAfterSection) throw new Error(`anchor section ${SECTION_ONLY_DIAL} not found`);
    if (!quizFixed) throw new Error(`quiz ${QUIZ_ID} not found`);
    if (!gpFixed) throw new Error(`guided_practice ${GP_ID} not found`);
    if (!journalFixed) throw new Error(`journal ${JOURNAL_ID} not found`);

    out.forEach((b, i) => { b.order = i; });

    const res = await bw.savePage(db, { pageId: page._id }, out, {
      author: 'agent',
      summary: 'page 6: add bidirectional stress↔breathing beat + "Catch Your Breath" self_experiment + quiz Q; add before/after/why to 4-4-6 reflection',
      dryRun: DRY,
    });
    console.log(DRY
      ? `[dry] ${SLUG}: removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length} → ${out.length} blocks`
      : `✓ ${SLUG}: v${res.version} · two-way beat + Catch Your Breath + quiz Q + before/after/why reflection`);
  });
  console.log(DRY ? '\n[dry] no writes.' : '\n✅ Page 6 upgraded with the bidirectional stress-breathing link.');
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
