'use strict';
/**
 * Focus module redesign — ACT I (The Mirror / diagnosis), 2026-07-23.
 *
 * Founder brief: the chapter taught before it convinced. This adds the diagnosis
 * act FIRST, using the 5 new "discover, don't display" instruments. It is
 * deliberately ADDITIVE and SAFE (CLAUDE.md §0.6):
 *   - Page 1 (your-attention-is-a-superpower) is REPURPOSED into T1 by INSERTING
 *     new blocks around the existing ones — every existing block id is preserved,
 *     so the content-loss guard passes with no override.
 *   - T2 and T3 are BRAND NEW pages (insert-only).
 *   - No page is deleted; no verse or practice is removed. The Act II/III
 *     compaction (which WOULD merge/drop founder content) is intentionally NOT
 *     done here — it needs the founder to approve the exact cuts first.
 *
 * New/changed pages land `published:false` (drafts) for founder review.
 *
 * Run:         node scripts/lifeskills_focus_act1_diagnosis.js --dry
 * Then commit: node scripts/lifeskills_focus_act1_diagnosis.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const bw = require('./lib/book-writer');

const DRY = process.argv.includes('--dry');
const BOOK_SLUG = 'life-skills-class-9';
const CH_SLUG = 'focus-and-attention';

// ── Cold "Mirror" register image style (distinct from the warm painterly Act III)
const COLD =
  'Cinematic, editorial illustration on a deep desaturated charcoal background. ' +
  'Cold blue-grey palette with a single restrained cool light and a lonely, glassy ' +
  'screen-glow motif; a mood of fragmentation and quiet isolation. Sober, ' +
  'documentary-poster feeling — NOT warm, NOT storybook, no orange, no neon, no 3D ' +
  'render, no photographic realism. Ultra-wide cinematic banner in a 16:5 ratio, ' +
  'subject centred with generous empty space left and right.';

// ── block builders ───────────────────────────────────────────────────────────
let _o = 0;
const reset = () => { _o = 0; };
const heading = (text, level = 2) => ({ id: uuidv4(), type: 'heading', order: _o++, text, level });
const text = (markdown) => ({ id: uuidv4(), type: 'text', order: _o++, markdown });
const hero = (alt, prompt) => ({ id: uuidv4(), type: 'image', order: _o++, src: '', alt, caption: '', width: 'full', aspect_ratio: '16:5', generation_prompt: `${prompt} ${COLD}` });
const curiosity = (prompt, hint, reveal) => ({ id: uuidv4(), type: 'curiosity_prompt', order: _o++, prompt, ...(hint ? { hint } : {}), ...(reveal ? { reveal } : {}) });
const journal = (prompt, min_words) => ({ id: uuidv4(), type: 'reflection_journal', order: _o++, prompt, ...(min_words ? { min_words } : {}) });
const sim = (simulation_id, title) => ({ id: uuidv4(), type: 'simulation', order: _o++, simulation_id, ...(title ? { title } : {}) });
const reveal = (props) => ({ id: uuidv4(), type: 'guided_reveal', order: _o++, ...props, steps: props.steps.map((s) => ({ id: uuidv4(), ...s })) });
const estimate = (props) => ({ id: uuidv4(), type: 'estimate_reveal', order: _o++, ...props });
const feed = (props) => ({ id: uuidv4(), type: 'comparison_feed', order: _o++, ...props, posts: props.posts.map((p) => ({ id: uuidv4(), ...p })) });
// re-emit an existing block, re-stamping order (preserves id + all fields)
const keep = (block) => ({ ...block, order: _o++ });

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const books = db.collection('books');
  const pages = db.collection('book_pages');

  const book = await books.findOne({ slug: BOOK_SLUG });
  if (!book) throw new Error('book not found');
  const chapter = book.chapters.find((c) => c.slug === CH_SLUG);
  const chIds = chapter.page_ids.map(String);

  const loadBySlug = async (slug) => pages.findOne({ slug });
  // Idempotent: if T1 was already repurposed on a prior run, its slug is the new one.
  let p1 = await loadBySlug('your-attention-is-a-superpower');
  let t1AlreadyDone = false;
  if (!p1) {
    p1 = await loadBySlug('the-time-paradox-and-your-flame');
    t1AlreadyDone = true;
  }
  if (!p1) throw new Error('page 1 not found (neither old nor new slug)');
  const bById = new Map((p1.blocks || []).map((b) => [b.order, b]));

  // ─── T1: repurpose page 1 — INSERT the time-paradox + estimate around existing blocks ───
  reset();
  const t1 = t1AlreadyDone ? null : [
    keep(bById.get(0)),   // chariot hero image (existing)
    keep(bById.get(1)),   // Katha Upanishad verse (existing)
    heading('First — is it really *time* you’re short on?'),
    text(
      'Everyone says the same thing: *“there’s no time.”* You have a search engine in your pocket, answers in seconds, ' +
      'notes on your phone — and somehow you finish *less* than students did twenty years ago. So here’s the honest question: ' +
      'did the day get shorter… or did something else?'
    ),
    sim('focus-time-paradox', 'The Time Paradox'),
    text(
      'The day didn’t shrink. **Your deep-focus time did.** Sitting for three hours is not three hours of work — for most ' +
      'students, real focus is a fraction of that, and the rest leaks away to switching. Here’s the good news hiding inside ' +
      'that: whoever learns to focus deeply does the *same* work in *half* the time — and wins the other half back for sport, ' +
      'music, friends, actually living — while scoring **higher**, not lower. That skill is what these next pages hand you.'
    ),
    keep(bById.get(2)),   // curiosity prompt (existing)
    keep(bById.get(3)),   // heading "The skill under every other skill" (existing)
    keep(bById.get(4)),   // section (existing)
    keep(bById.get(5)),   // heading "First, measure it" (existing)
    keep(bById.get(6)),   // section (existing)
    keep(bById.get(7)),   // focus_game baseline (existing)
    estimate({
      question: 'One more honest guess — how many times a day do you *touch* your phone? Every tap, swipe, unlock.',
      unit: 'touches / day',
      min: 0, max: 5000, step: 25, default_guess: 200,
      truth: 2617,
      reveal_unit: 'measured · taps, swipes, clicks a day',
      source: '*Measured by dscout — 94 people, every single interaction, five days straight.*',
      reveal:
        'You guessed **{guess}**. Researchers actually clocked about **2,617** — roughly **{ratio}×** more than that. ' +
        'That’s a touch every ~22 seconds you’re awake, a habit running quietly under the floor of your own attention.',
      caption:
        'The lesson isn’t the number. It’s the *gap* between what you thought and what’s true — the size of a habit you can’t even see.',
    }),
    keep(bById.get(8)),   // reflection journal (existing)
    keep(bById.get(9)),   // "tonight, one act of noticing" text (existing)
  ];

  // ─── T2: NEW page — the self-image mirror ───
  reset();
  const t2Blocks = [
    hero(
      'A teenager alone in cold blue phone-glow, surrounded by floating perfect images of other people',
      'A lone teenager sits in the dark lit only by the cold blue glow of a phone; around them float bright, ' +
      'flawless images of other people — a topper’s result, a perfect body, a beach — while the teenager themselves ' +
      'sits small and shadowed.'
    ),
    heading('The feed you scroll is lying — politely'),
    text(
      'Nobody posts the bad take. The failed attempt. The boring Tuesday. A feed is a *highlight reel* — everyone’s single ' +
      'best frame, stacked back to back. Then, quietly, it asks you to compare your whole messy unedited life to it. ' +
      'Scroll the feed below. Watch how you feel — then flip each post over.'
    ),
    feed({
      title: 'The Other Half of the Post',
      meter_label: 'How you feel about your own life',
      posts: [
        {
          who: 'Aarav · topper',
          meta: '2 hrs ago',
          front: '**99.2 percentile 🔥** Hard work always pays off. Grateful. #blessed',
          reveal_label: 'What the frame cut out',
          back: 'Third attempt. Two years on a coaching loan the family is still repaying. Cried the night the first mock came back. Posted the one screenshot that looked like triumph.',
        },
        {
          who: 'Meera',
          meta: '5 hrs ago',
          front: 'morning run before sunrise ☀️ that post-workout glow hits different',
          reveal_label: 'What the frame cut out',
          back: '47 photos to get one. A filter that smooths skin and widens the eyes. Went straight back to bed after. The “glow” is a preset called *Aura 3*.',
        },
        {
          who: 'Kabir',
          meta: '1 day ago',
          front: 'just vibing on the trip 🌊 life’s good when you stop overthinking',
          reveal_label: 'What the frame cut out',
          back: 'Borrowed a friend’s balcony for the shot. Anxious about the exact same exam you are. “Stop overthinking” was a caption, not a life.',
        },
      ],
      closing:
        'Same people. Same day. Every one of them is fighting something the frame hid. Your feed is a wall of everyone’s ' +
        '*best* moments — and you’re comparing it to your own ordinary, behind-the-scenes whole. That’s not a fair mirror. ' +
        'It’s a funhouse one.',
    }),
    heading('It doesn’t just change how you see *them*'),
    text(
      'Do this enough and the damage turns inward. You start to feel behind, less-than, not-enough — not because you *are*, ' +
      'but because you’ve been staring into everyone’s highlight reel and grading yourself against it. And it warps how you ' +
      'see the *world* too: the feed feeds you the loudest, most extreme, most outrage-worthy slice of everything, until ' +
      '“normal” quietly stops looking normal. A tuned mirror, tilted just enough to make you doubt yourself.'
    ),
    curiosity(
      'Think of the last post that made you feel a little smaller. What did it show — and what do you think it left out?',
      'You already know feeds are curated. The question is whether you *felt* it, or just knew it.',
      'The feeling is the point. Once you can catch a post doing that to you, it loses most of its power. Naming it is half the cure.'
    ),
    journal(
      'Who or what do you compare yourself to most on your feed? Now — honestly — what part of *their* real, ' +
      'behind-the-scenes life is the frame almost certainly hiding from you?',
      20
    ),
    text(
      '**Tonight:** one unfollow. Pick the single account that most reliably makes you feel behind, and mute or unfollow it. ' +
      'You’re not running from the truth — you’re turning off a mirror that was built to bend it.'
    ),
  ];

  // ─── T3: NEW page — everyone's window is shrinking; ADHD, honestly ───
  reset();
  const t3Blocks = [
    hero(
      'A wide window slowly narrowing to a thin slit, a small figure trying to look through it',
      'A person stands before a tall window that is slowly narrowing to a thin vertical slit of cold light; ' +
      'the world beyond it shrinks to a sliver, while the figure strains to keep looking through.'
    ),
    heading('Everyone’s window is shrinking — including yours'),
    text(
      'That short number you got on the flame test? It isn’t a flaw in *you*. It’s the whole generation. Scientists have ' +
      'measured how long people hold their focus on a single screen before jumping — and watched it collapse. Drag the ' +
      'years yourself.'
    ),
    sim('shrinking-window', 'The Shrinking Window'),
    text(
      'Twenty years ago, two and a half minutes. Today, about forty-seven seconds — measured, and found again by other ' +
      'labs. This is the *water you swim in*: apps engineered by brilliant people to break your focus, all day, on purpose. ' +
      'You didn’t fail at attention. You were handed a fragmented one. And fragmented can be **retrained** — that’s the ' +
      'entire back half of this book.'
    ),
    heading('But wait — is this ADHD?'),
    reveal({
      title: 'Fatigue, or something more? Let’s be honest about ADHD.',
      intro: 'Tap through this slowly — one honest step at a time.',
      steps: [
        {
          kind: 'point',
          kicker: 'Start here',
          headline: 'A shrinking attention span is *not* a disorder.',
          body:
            'What you measured on the flame is what the whole world is wrestling with — a mind trained by fast feeds to ' +
            'jump. That’s **fatigue**, and fatigue can be trained back. This chapter is that training.',
        },
        {
          kind: 'point',
          kicker: 'So what actually IS ADHD?',
          headline: 'ADHD is a specific, medical thing — not “I get distracted sometimes.”',
          body:
            'Doctors look for a *pattern* that: **(1)** has been there since childhood — before about age 12; ' +
            '**(2)** shows up *everywhere* — school **and** home **and** play, not only on your phone; and ' +
            '**(3)** genuinely gets in the way of your life, again and again. Not a bad week. A years-long pattern ' +
            'across your whole world.',
        },
        {
          kind: 'point',
          kicker: 'The honest line',
          headline: 'If that sounds like you, this chapter still helps — but it is not the answer.',
          body:
            'Real ADHD is real, and it deserves a real professional — a doctor or counsellor — not a book, and never a ' +
            'social-media quiz. Telling a trusted adult is the *strong* move, not the weak one.',
        },
        {
          kind: 'point',
          kicker: 'And if it’s the everyday kind?',
          headline: 'Then you are in exactly the right place.',
          body:
            'Most students who feel “I just can’t focus anymore” are carrying *trained fatigue*, not a disorder. The next ' +
            'pages hand you the tools to rebuild the focus the feeds wore down.',
        },
      ],
      outro: 'Either way, the next move is the same — turn the page and start taking your attention back.',
    }),
    journal(
      'Before this page, what did you privately assume about your own focus? Has that assumption shifted — and if so, how?',
      20
    ),
    text(
      '**So here’s where we are:** you’ve seen how short focus has become, what the feed does to how you see yourself, and ' +
      'that none of it is a personal failing. It’s a *machine* — and it was built on purpose. Next, we open it up and look ' +
      'at exactly how it works. Because a machine you can see is a machine you can beat.'
    ),
  ];

  // ─── Apply ───────────────────────────────────────────────────────────────────
  const now = new Date();
  const mkPage = (slug, page_number, title, subtitle, blocks) => ({
    _id: uuidv4(), book_id: book._id, chapter_number: chapter.number ?? 1,
    page_number, slug, title, subtitle, blocks, published: false,
    deleted_at: null, created_at: now, updated_at: now,
  });

  if (DRY) {
    console.log('\n=== DRY RUN ===');
    if (t1AlreadyDone) {
      console.log('T1: already repurposed (slug the-time-paradox-and-your-flame) — would skip.');
    } else {
      const d = await bw.savePage(db, { slug: 'your-attention-is-a-superpower' }, t1, {
        dryRun: true, author: 'agent:act1', summary: 'T1 time-paradox + estimate (additive)',
      });
      console.log('T1 (repurpose page 1):', JSON.stringify(d.diff.reasons), '| wouldBlock:', d.wouldBlock,
        '| blocks', (p1.blocks || []).length, '→', t1.length);
    }
    console.log('T2 (new page):', t2Blocks.length, 'blocks —', t2Blocks.map((b) => b.type).join(', '));
    console.log('T3 (new page):', t3Blocks.length, 'blocks —', t3Blocks.map((b) => b.type).join(', '));
    console.log('\nNew chapter order would be: opener, T1, T2, T3, then P2..P10 (13 content pages, intermediate).');
    await client.close();
    return;
  }

  // T1 — savePage (additive; every existing id preserved → no content-loss). Skip if already done.
  if (!t1AlreadyDone) {
    const r1 = await bw.savePage(db, { slug: 'your-attention-is-a-superpower' }, t1, {
      author: 'agent:act1',
      summary: 'Act I redesign: time-paradox sim + phone-touch estimate + reframe (additive, no content dropped)',
      extraSet: {
        slug: 'the-time-paradox-and-your-flame',
        title: 'The Time Paradox',
        subtitle: 'You’re not short on hours — you’re short on focus. Let’s prove it, and start winning it back.',
        page_number: 1,
        published: false,
      },
    });
    console.log('T1 saved:', r1.slug, 'v' + r1.version);
  } else {
    console.log('T1: already repurposed — skipped.');
  }

  // T2, T3 — insert-only, guarded, with TEMP high page_numbers to dodge the unique index.
  let t2 = await loadBySlug('the-other-half-of-the-post');
  if (!t2) {
    t2 = mkPage('the-other-half-of-the-post', 9001, 'The Other Half of the Post',
      'The feed shows you everyone’s best frame — then asks you to compare your whole life to it.', t2Blocks);
    await pages.insertOne(t2);
    console.log('T2 inserted:', t2._id);
  } else { console.log('T2: already exists —', t2._id); }

  let t3 = await loadBySlug('fragmented-not-broken');
  if (!t3) {
    t3 = mkPage('fragmented-not-broken', 9002, 'Fragmented, Not Broken',
      'Why everyone’s focus is shrinking — and the honest truth about ADHD.', t3Blocks);
    await pages.insertOne(t3);
    console.log('T3 inserted:', t3._id);
  } else { console.log('T3: already exists —', t3._id); }

  // Re-order chapter.page_ids: opener, T1(p1 id), T2, T3, then the rest (P2..P10) in place.
  const openerId = chIds[0];
  const p1Id = String(p1._id);
  const rest = chIds.filter((id) => id !== openerId && id !== p1Id); // P2..P10 preserving order
  const newOrder = [openerId, p1Id, String(t2._id), String(t3._id), ...rest];
  await books.updateOne(
    { _id: book._id, 'chapters.slug': CH_SLUG },
    { $set: { 'chapters.$.page_ids': newOrder } }
  );

  // Two-phase renumber to respect the unique (book_id, chapter_number, page_number) index:
  // phase A → park everything at 1000+index (no overlap with current 0..10),
  // phase B → set final 0..N.
  for (let i = 0; i < newOrder.length; i++) {
    await pages.updateOne({ _id: newOrder[i] }, { $set: { page_number: 1000 + i } });
  }
  for (let i = 0; i < newOrder.length; i++) {
    await pages.updateOne({ _id: newOrder[i] }, { $set: { page_number: i } });
  }
  console.log('Chapter re-ordered to', newOrder.length, 'pages; page_numbers renumbered 0..' + (newOrder.length - 1));
  console.log('\nAct I is in place as DRAFTS (published:false on T1/T2/T3). Nothing deleted; Act II/III untouched.');

  await client.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
