'use strict';
/**
 * Page 4 ("The Multitasking Myth") — rebuild around a BETTER example + convert the
 * didactic middle into an interactive click-to-advance walkthrough. (Founder:
 * study-plus-chat is a strawman students already know is wrong; use a combo they
 * defend as efficient — studying with MUSIC — and dismantle it via the shared
 * language-channel mechanism, one beat at a time.)
 *
 *  - REPLACE the teaching middle (2 headings + 2 sections) with ONE `guided_reveal`
 *    block ("The Multitasking Myth, one step at a time") — 8 beats + a
 *    "Will your playlist cost you?" cost_checker.
 *  - REFRAME the rest to music so the page is coherent: curiosity hook, quiz
 *    (now channel/music), journal, cue, and the page subtitle.
 *  - KEEP: hero, the Gita 2.41 verse, the One-Track Sprint practice.
 *
 * Removing the 2 sections drops 2 switching-metaphor side images (R2 files are
 * RETAINED per §0.6 — only the block refs go) → allowContentLoss with a reason;
 * old blocks are version-snapshotted and fully reversible. Top-level order is
 * renumbered. Subtitle updated via savePage extraSet.
 *
 * Run: node scripts/lifeskills_focus_page4_walkthrough.js [--dry]
 */
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'life-skills-class-9';
const SLUG = 'the-multitasking-myth';
const DRY = process.argv.includes('--dry');

// anchor ids (from live inspection)
const HEADING1 = '2f7ad9bf';   // "Your brain doesn't multitask — it switches"
const SECTION1 = '86f0ab00';
const HEADING2 = '192aab7c';   // "Do the maths on 'just five seconds'"
const SECTION2 = 'b410fc91';
const REMOVE = [HEADING1, SECTION1, HEADING2, SECTION2];
const CURIOSITY = '94dc4123';
const QUIZ = 'e06abb11';
const JOURNAL = 'dff72e98';
const CUE = 'f7952143';

const NEW_SUBTITLE = '"Songs help me focus" — true, false, or… it depends? Let\'s find out.';

const NEW_CURIOSITY =
  "Your friend swears they study better with their playlist on — the songs help them focus. Here's the thing: they're half right. " +
  'So when does music actually help you study… and when is it quietly stealing the line you just read?';

const walkthrough = () => ({
  id: uuidv4(), type: 'guided_reveal', order: 0,
  title: 'The Multitasking Myth — one step at a time',
  intro: 'Tap to walk through it. One idea at a time — see where the "music helps me study" belief holds up, and where it quietly breaks.',
  steps: [
    { id: uuidv4(), kind: 'point', kicker: 'The claim',
      headline: '“Music helps me study.”',
      body: "Earphones in, playlist on — and you can sit for hours. Most students would swear songs *help* them focus. Let's test that, because half of it is true… and half is quietly costing you." },
    { id: uuidv4(), kind: 'point', kicker: "What's real",
      headline: 'Music really does do something for you',
      body: "It lifts your mood, and it walls off a noisy house — a chatty sibling, the TV, the street. That part is genuine: a better mood and less background racket help you *start* and *stay put*. Keep that." },
    { id: uuidv4(), kind: 'point', kicker: 'The catch',
      headline: 'Learning words runs on one channel',
      body: "Reading a chapter, understanding a theory, memorising a definition — that's all **language**. Your brain handles language on a single “word channel,” and it can follow *one* stream of words at a time." },
    { id: uuidv4(), kind: 'point', kicker: 'The collision',
      headline: 'Song lyrics are words too',
      body: "So when a lyric plays while you read, **two streams of words** hit that one channel at once — and collide. You reach the end of the paragraph and realise nothing went in, so you read it again. The songs you know by heart are the worst: your brain can't help but sing along." },
    { id: uuidv4(), kind: 'cost_checker', kicker: 'Test your own setup',
      headline: 'Will your playlist cost you?',
      body: "It isn't the same for every task. Pick what you're doing and what's playing — watch the verdict change:",
      checker: {
        task_label: 'What are you studying?',
        tasks: [
          { id: uuidv4(), label: 'Reading / understanding theory', weight: 2 },
          { id: uuidv4(), label: 'Memorising (bio, definitions, dates)', weight: 2 },
          { id: uuidv4(), label: 'Drilling sums you already know', weight: 1 },
          { id: uuidv4(), label: 'Organising notes / making a timetable', weight: 0 },
        ],
        audio_label: "What's playing?",
        audios: [
          { id: uuidv4(), label: 'Songs with lyrics', weight: 2 },
          { id: uuidv4(), label: 'Instrumental / lo-fi', weight: 1 },
          { id: uuidv4(), label: 'Silence', weight: 0 },
        ],
        verdicts: {
          high: 'Heavy word-work **and** words in your ears — they fight for the same channel. Expect to reread lines and remember less. For this, kill the lyrics.',
          mild: "A bit of a clash. It won't wreck the session, but you'd hold on to more with the words off. Your call.",
          clear: 'Go for it — this pairing barely competes. Music here is fine, and the mood boost can genuinely help you get going.',
        },
      } },
    { id: uuidv4(), kind: 'point', kicker: 'The trap',
      headline: 'It *feels* efficient — that’s the trick',
      body: "Here's the sneaky part. The music makes the hour *feel* smooth and focused, so you rate it a great session. But test students afterwards and the ones who studied language material with lyrics **remember less** — even though they felt *more* focused. Feels efficient; retains less." },
    { id: uuidv4(), kind: 'point', kicker: 'The rule',
      headline: 'Not “no music” — the right music for the job',
      body: "You don't have to study in silence. The clash is only **lyrics + word-work**. So the rule is simple: **words in your ears fight words on your page.** Reading, theory, memorising → go **instrumental**, or silent. Mechanical work you've mastered — drilling similar sums, copying a diagram, organising notes → lyrics are fine, even helpful." },
    { id: uuidv4(), kind: 'point', kicker: 'The old idea',
      headline: 'One-pointed, not thousand-branched',
      body: "Two thousand years ago the Gita named this (2.41): the steady mind is *one-pointed*; the scattered mind splits into *endless branches*. Giving your word-work one clear channel **is** one-pointedness, in practice. It was never about silence — it's about not splitting the stream." },
  ],
  outro: "You'll never hear your study playlist the same way again — and now you know exactly when to hit play, and when to hit pause.",
});

const NEW_QUIZ_QUESTIONS = [
  { id: uuidv4(), question: "Reading, understanding theory, and memorising all run on your brain's…",
    options: ['A separate maths channel', 'A single “word” (language) channel', 'Two word channels at once', 'Pure muscle memory'],
    correct_index: 1, difficulty_level: 1,
    explanation: 'Language learning uses one word channel that can follow a single stream of words at a time.' },
  { id: uuidv4(), question: 'Why do song lyrics hurt reading or memorising more than instrumental music does?',
    options: ['Lyrics are simply louder', 'Lyrics are words too, so they compete on the same word channel', 'Instrumental music is banned in exams', 'Lyrics speed up your heartbeat'],
    correct_index: 1, difficulty_level: 2,
    explanation: 'Two streams of words collide on one channel; instrumental music has no words to fight the page.' },
  { id: uuidv4(), question: 'When is studying with your lyric playlist LEAST harmful?',
    options: ['While reading a brand-new chapter', 'While memorising definitions', 'While drilling maths problems you have already mastered', 'While understanding a new theory'],
    correct_index: 2, difficulty_level: 3,
    explanation: 'Mechanical work you have mastered is low on word-work, so lyrics barely clash — the mood boost can even help.' },
  { id: uuidv4(), question: 'Studying with lyrics often FEELS more focused because…',
    options: ['You genuinely learn more that way', 'The music lifts your mood, so you rate the session high even when recall drops', 'The lyrics contain the answers', 'It makes time pass slower'],
    correct_index: 1, difficulty_level: 2,
    explanation: 'The mood boost makes the hour feel great; tests show recall is lower. Feels efficient, retains less.' },
];

const NEW_JOURNAL =
  "Be honest: what do you usually play while studying, and what were you studying last time? Using today's idea — was it mostly " +
  'word-work (reading, memorising) or mechanical (drilling problems you know)? What will you change next time: the music, or the task you play it during?';

const NEW_CUE =
  '**Tomorrow:** for your hardest *reading or memorising* block, go **lyrics-free** — instrumental or silent. Keep your playlist for the ' +
  'mechanical stuff (drilling, organising). Then notice, honestly, how much more actually sticks.';

async function main() {
  await bw.withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book ${BOOK_SLUG} not found`);
    const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug: SLUG });
    if (!page) throw new Error(`page ${SLUG} not found`);

    let insertedWalk = false, curiosityFixed = false, quizFixed = false, journalFixed = false, cueFixed = false;
    const out = [];
    for (const b of page.blocks) {
      if (REMOVE.some((id) => b.id.startsWith(id))) {
        if (b.id.startsWith(HEADING1)) { out.push(walkthrough()); insertedWalk = true; }
        continue; // drop the 4 middle blocks
      }
      if (b.type === 'curiosity_prompt' && b.id.startsWith(CURIOSITY)) { out.push({ ...b, prompt: NEW_CURIOSITY }); curiosityFixed = true; continue; }
      if (b.type === 'inline_quiz' && b.id.startsWith(QUIZ)) { out.push({ ...b, questions: NEW_QUIZ_QUESTIONS }); quizFixed = true; continue; }
      if (b.type === 'reflection_journal' && b.id.startsWith(JOURNAL)) { out.push({ ...b, prompt: NEW_JOURNAL }); journalFixed = true; continue; }
      if (b.type === 'text' && b.id.startsWith(CUE)) { out.push({ ...b, markdown: NEW_CUE }); cueFixed = true; continue; }
      out.push(b);
    }
    const checks = { insertedWalk, curiosityFixed, quizFixed, journalFixed, cueFixed };
    for (const [k, v] of Object.entries(checks)) if (!v) throw new Error(`anchor miss: ${k}`);

    out.forEach((b, i) => { b.order = i; });

    const res = await bw.savePage(db, { pageId: page._id }, out, {
      author: 'agent',
      summary: 'page 4: switch example WhatsApp→music; convert teaching middle to interactive guided_reveal walkthrough; reframe hook/quiz/journal/cue/subtitle',
      allowContentLoss: true,
      lossReason: 'Founder-approved: convert the didactic middle (2 headings + 2 sections) into the interactive music walkthrough. 2 switching-metaphor side images unlinked (R2 files retained per §0.6); old blocks snapshotted for recovery.',
      extraSet: { subtitle: NEW_SUBTITLE },
      dryRun: DRY,
    });
    console.log(DRY
      ? `[dry] ${SLUG}: removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length} → ${out.length} blocks; wouldBlock=${res.wouldBlock}`
      : `✓ ${SLUG}: v${res.version} · walkthrough in · hook/quiz/journal/cue/subtitle reframed to music`);
  });
  console.log(DRY ? '\n[dry] no writes.' : '\n✅ Page 4 rebuilt around the music example with the interactive walkthrough.');
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
