'use strict';
/**
 * Page 3 ("Why Reels Feel Impossible to Stop") — add the Social-Dilemma reveal and
 * upgrade the practice, per founder plan (2026-07-04):
 *
 *  1. INSERT after the "it's not your fault" section, before the quiz:
 *     - heading "Nothing on Your Screen Is an Accident"
 *     - a 16:9 full-width diptych IMAGE (placeholder src; generation_prompt set)
 *     - the interactive `attention_xray` block ("The Notification Autopsy")
 *  2. APPEND one quiz question (the red-dot one) to the existing inline_quiz.
 *  3. SWAP the "Urge Surfing" guided_practice block → the new `self_experiment`
 *     block ("The 5-Minute Experiment": no phone for 5 min → tick which urges
 *     showed up → each reveals what it means).
 *
 * (1) + (2) are pure additions. (3) removes one block, so allowContentLoss is
 * passed with a reason; book-writer snapshots the old Urge-Surfing block, so it
 * is fully reversible. Top-level `order` is renumbered sequentially after the edit.
 *
 * Run: node scripts/lifeskills_focus_page3_social.js [--dry]
 */
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'life-skills-class-9';
const SLUG = 'why-reels-feel-impossible-to-stop';
const DRY = process.argv.includes('--dry');

// anchor ids (from live inspection)
const AFTER_SECTION_ID = 'e1392bb3';   // "not your fault" 50-50 section — insert after this
const QUIZ_ID = '765c9bed';            // inline_quiz — append the red-dot question
const URGE_GP_ID = '1f419004';         // guided_practice "Urge Surfing" — swap out

const DIPTYCH_PROMPT =
  'A hand-drawn coloured illustration, warm storybook-editorial style, on a deep charcoal (#121316) background. ' +
  'Muted earthy palette — dusty ochre, terracotta, sage, faded indigo, warm brown — with rich warm light and deep soft shadows. ' +
  'No neon, no glow, no 3D render, no photographic look. Landscape 16:9, composed as a diptych split by a soft vertical seam, joined by a single phone motif. ' +
  'LEFT HALF — "the outside": a teenage student sitting cross-legged on the floor, shoulders hunched, face softly lit by the phone in their hands, expression blank and absorbed. ' +
  'Fine thin marionette strings rise from the top of the phone up to a pair of large, calm puppeteer hands at the top of the frame, gently working the strings. The phone light is soft and warm, never neon. ' +
  'RIGHT HALF — "the inside": the same phone turned and cracked open like an engineering cutaway, revealing the hidden machinery behind one innocent notification — small brass fishing-hooks, interlocking gears, a lure, and a red alert dot wired into the mechanism — drawn as a warm hand-illustrated blueprint in the same earthy palette. ' +
  'Balanced, desktop-friendly composition; both halves clearly readable. No text, no captions, no logos.';

const newHeading = () => ({ id: uuidv4(), type: 'heading', order: 0, text: 'Nothing on Your Screen Is an Accident', level: 2 });

const newImage = () => ({
  id: uuidv4(), type: 'image', order: 0,
  src: '', // placeholder until Phase B generates + ingests the diptych
  alt: 'Left: a teenager controlled like a puppet by their phone. Right: the same phone cracked open to reveal the hidden machinery of hooks and gears behind a single notification.',
  caption: '',
  width: 'full',
  aspect_ratio: '16:9',
  generation_prompt: DIPTYCH_PROMPT,
});

const newXray = () => ({
  id: uuidv4(), type: 'attention_xray', order: 0,
  title: 'The Notification Autopsy',
  intro: "Here's a phone screen you've seen a thousand times. Tap each part. Every single one was designed, tested, and chosen — in a meeting, by someone paid to keep you here longer.",
  cards: [
    { id: uuidv4(), front: '🔴 3', label: 'The little red dot',
      reveal: 'Red is the colour your brain reads as danger — *look now*. Apps tested other colours; red made people open more, so red won. That "3" is an open loop your mind itches to close.' },
    { id: uuidv4(), front: '🏷️', label: '"Tagged you in a photo"',
      reveal: "The most irresistible bait there is: *what did they say about me?* Your brain is built to care what the group thinks of you. A hint you can't leave alone until you look." },
    { id: uuidv4(), front: '🕓', label: 'The time it arrives',
      reveal: "That buzz didn't come at a random moment. Apps learn when you usually get bored — right after school, late at night — and nudge you *exactly then*." },
    { id: uuidv4(), front: '🔥', label: 'The streak',
      reveal: "You don't keep a streak because it's fun. You keep it so you don't *lose* it. Miss one day and 12 days “die.” Fear of loss, built on purpose." },
    { id: uuidv4(), front: '♾️', label: 'The feed that never ends',
      reveal: "A book ends — that ending is your cue to stop. Infinite scroll deletes the cue. A bowl of chips that refills itself so you never notice how much you've had. (The engineer who invented it says he regrets it.)" },
    { id: uuidv4(), front: '▶️', label: 'The next video, auto-playing',
      reveal: "You never *chose* to watch it — it just started. Staying takes nothing; leaving takes effort. The lazy choice is the one that keeps you watching." },
  ],
  closing:
    "So why the trouble? Here's the part nobody advertises: **you are not the customer — you are the product.** These apps are free because your *attention* is what's being sold, to advertisers who pay for every extra minute you stay. On the other side of the glass sit teams of brilliant engineers whose paid job is to win those minutes.\n\n" +
    "That sounds grim. It isn't — because there's one thing they can't design around: **a student who can see the trick.** You can't out-willpower a slot machine, but you *can* stop sitting at it, kill the red dots, and practise watching the pull instead of obeying it. Seeing the blueprint is step one. You just did it.",
  watch_note: 'Want the full story? Watch *The Social Dilemma* (Netflix) — it’s the designers themselves, telling on their own industry.',
});

const RED_DOT_Q = {
  id: uuidv4(),
  question: 'The little red notification dot is red because…',
  options: [
    "It's simply the app's brand colour",
    'Red is the cheapest colour to display',
    "Red reads as 'alarm' to your brain — and in testing it made people open the app more",
    'It was picked at random',
  ],
  correct_index: 2,
  explanation: 'The colour was tested. Red triggers an urgency response and won because it drove more opens. Nothing on the screen is an accident.',
  difficulty_level: 1,
};

const newExperiment = () => ({
  id: uuidv4(), type: 'self_experiment', order: 0,
  title: 'The 5-Minute Experiment',
  intro: "Reading about the pull is one thing. Feeling it is another. Let's run a tiny experiment on yourself — and watch what your own mind does when the phone is just out of reach.",
  steps: [
    'Put your phone across the room, in a bag, or face-down and far — somewhere you’d have to stand up to reach it.',
    'Set it for 5 minutes (use the timer below). Then just sit. Don’t reach for it.',
    'Your only job: notice what your mind tries to do. Watch it like a scientist watching an animal.',
  ],
  duration_sec: 300,
  prompt: 'Which of these showed up while you sat? Tick every one you felt — then see what each one actually is.',
  options: [
    { id: uuidv4(), label: "A sudden itch to 'just check' something — with no notification",
      explanation: "That itch is a *phantom cue* — your brain firing the habit loop on its own, with nothing to check. It proves the habit lives in *you*, not the phone. Good news: a habit you can see is a habit you can retrain." },
    { id: uuidv4(), label: "I invented a 'reason' I needed it (check the time, a reminder, something 'important')",
      explanation: "That's your mind negotiating — dressing up the urge as a sensible task so you'll obey it. Naming the trick (“ah, that's just the pull wearing a disguise”) is enough to weaken it." },
    { id: uuidv4(), label: 'Physical restlessness — fidgeting, bouncing a leg, itchy hands',
      explanation: "The urge is partly in the *body*, not just the mind. It rises like a wave — and, like a wave, it peaks and falls on its own if you don't feed it. You just have to let it crest." },
    { id: uuidv4(), label: 'Boredom that felt almost unbearable',
      explanation: "Boredom feels like an emergency because the feed trained your brain to expect a hit every few seconds. It isn't an emergency. Sitting through plain boredom is exactly how you rebuild a longer attention span." },
    { id: uuidv4(), label: "A specific worry — 'what if someone messaged / I'm missing something?'",
      explanation: "That's FOMO — fear of missing out — and apps feed it on purpose. Ask honestly: in 5 minutes, what could you realistically have missed that won't still be there later? Almost always: nothing." },
    { id: uuidv4(), label: 'A settling — after a bit, it got easier and calmer',
      explanation: "This is the most important one. You felt the urge *pass without obeying it*. Every time you ride one out, the next one is a little weaker. That settling is the skill growing in real time." },
    { id: uuidv4(), label: "Honestly, not much — it was fine",
      explanation: "Either you have unusually steady attention, or you did the reps recently. Try it again at a harder moment — right after school, or late at night — and see if the pull shows up then." },
  ],
  min_select: 1,
  completion_note: "Notice what you just proved: the urge is not a command. It rises, peaks, and — if you don't feed it — falls on its own. You didn't fight it; you *watched* it. That watching, repeated, is how focus is rebuilt.",
});

async function main() {
  await bw.withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book ${BOOK_SLUG} not found`);
    const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug: SLUG });
    if (!page) throw new Error(`page ${SLUG} not found`);

    let inserted = false, quizFixed = false, swapped = false;
    const out = [];
    for (const b of page.blocks) {
      if (b.type === 'inline_quiz' && b.id.startsWith(QUIZ_ID)) {
        quizFixed = true;
        out.push({ ...b, questions: [...b.questions, RED_DOT_Q] });
        continue;
      }
      if (b.type === 'guided_practice' && b.id.startsWith(URGE_GP_ID)) {
        swapped = true;
        out.push(newExperiment());
        continue;
      }
      out.push(b);
      if (b.id.startsWith(AFTER_SECTION_ID)) {
        inserted = true;
        out.push(newHeading(), newImage(), newXray());
      }
    }
    if (!inserted) throw new Error(`anchor section ${AFTER_SECTION_ID} not found`);
    if (!quizFixed) throw new Error(`quiz ${QUIZ_ID} not found`);
    if (!swapped) throw new Error(`urge-surfing GP ${URGE_GP_ID} not found`);

    // renumber top-level order sequentially
    out.forEach((b, i) => { b.order = i; });

    const res = await bw.savePage(db, { pageId: page._id }, out, {
      author: 'agent',
      summary: 'page 3: add Social-Dilemma reveal (heading + 16:9 diptych + attention_xray + quiz Q); swap Urge Surfing → self_experiment',
      allowContentLoss: true,
      lossReason: 'Founder-approved: replace the passive "Urge Surfing" observation drill with the interactive "5-Minute Experiment" self_experiment block. Old guided_practice block snapshotted for recovery.',
      dryRun: DRY,
    });
    console.log(DRY
      ? `[dry] ${SLUG}: removed=${res.diff.removedBlockIds.length} added=${res.diff.addedBlockIds.length} → ${out.length} top-level blocks`
      : `✓ ${SLUG}: v${res.version} · +heading +image +xray +quizQ · Urge Surfing → 5-Minute Experiment`);
  });
  console.log(DRY ? '\n[dry] no writes.' : '\n✅ Page 3 upgraded with the Social-Dilemma reveal + self-experiment.');
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
