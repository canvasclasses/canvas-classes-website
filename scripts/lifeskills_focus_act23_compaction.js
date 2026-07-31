'use strict';
/**
 * Focus module redesign — ACT II & III compaction (10→9), 2026-07-23.
 * Founder consent this session: "cut aggressively" + "unpublish the whole chapter".
 *
 * Merges (content MOVED into the survivor with fresh ids so nothing is lost from
 * version history; source shells are soft-deleted, never erased — §0.6):
 *   T4 the-spotlight-and-the-lever   ← repurpose P2 (spotlight) + variable-reward-lever sim + P3's Gita 2.62 verse
 *   T5 the-notification-autopsy      ← repurpose P3 (xray+self_experiment) + P4's multitasking guided_reveal + P4's Gita 2.41 verse
 *   T6 two-resets-breath-and-dharana ← repurpose P5 (dhāraṇā) + P6's breath verse/section/practice
 *   T7 your-focus-setup              ← repurpose P7 (desk) + P8's sprint verse/section/practice
 *   T8 sleep-the-night-shift-of-memory ← P9, + one mood-cost line (additive)
 *   T9 your-7-day-focus-challenge    ← P10, + one self-image challenge action (additive)
 * Soft-delete: P4, P6, P8 (their kept content already moved into survivors).
 * Every verse (Gita 6.26/2.62/2.41/6.11/2.47/6.17/6.35, YS 3.1–3.2/1.34) and every
 * guided_practice is preserved. Prose sections are the aggressive cut.
 *
 * All pages end published:false (whole chapter unpublished for review).
 *
 * Run:         node scripts/lifeskills_focus_act23_compaction.js --dry
 * Then commit: node scripts/lifeskills_focus_act23_compaction.js
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const bw = require('./lib/book-writer');

const DRY = process.argv.includes('--dry');
const BOOK_SLUG = 'life-skills-class-9';
const CH_SLUG = 'focus-and-attention';
const LOSS = 'Founder-approved Focus redesign (2026-07-23): aggressive 10→9 compaction; kept verses/practices moved into survivor pages, redundant prose trimmed.';

let _o = 0;
const reset = () => { _o = 0; };
const heading = (text, level = 2) => ({ id: uuidv4(), type: 'heading', order: _o++, text, level });
const text = (markdown) => ({ id: uuidv4(), type: 'text', order: _o++, markdown });
const sim = (simulation_id, title) => ({ id: uuidv4(), type: 'simulation', order: _o++, simulation_id, ...(title ? { title } : {}) });
const keep = (b) => ({ ...b, order: _o++ });            // same page → preserve id
const move = (b) => ({ ...b, id: uuidv4(), order: _o++ }); // pulled from a soon-deleted page → fresh id

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const books = db.collection('books');
  const pages = db.collection('book_pages');

  const book = await books.findOne({ slug: BOOK_SLUG });
  const chapter = book.chapters.find((c) => c.slug === CH_SLUG);

  const bySlug = {};
  for (const s of ['the-spotlight-in-your-head', 'why-reels-feel-impossible-to-stop', 'the-multitasking-myth',
    'dharana-the-original-attention-training', 'breath-the-remote-control', 'design-your-environment',
    'the-25-minute-sprint', 'sleep-the-night-shift-of-memory', 'your-7-day-focus-challenge']) {
    bySlug[s] = await pages.findOne({ slug: s });
  }
  // pick a block by its order index within a page
  const at = (slug, order) => {
    const p = bySlug[slug];
    const b = (p.blocks || []).find((x) => x.order === order);
    if (!b) throw new Error(`block order ${order} not found on ${slug}`);
    return b;
  };
  const P2 = 'the-spotlight-in-your-head', P3 = 'why-reels-feel-impossible-to-stop', P4 = 'the-multitasking-myth',
    P5 = 'dharana-the-original-attention-training', P6 = 'breath-the-remote-control', P7 = 'design-your-environment',
    P8 = 'the-25-minute-sprint', P9 = 'sleep-the-night-shift-of-memory', P10 = 'your-7-day-focus-challenge';

  // ─── T4 = P2 + lever (mostly additive) ───
  reset();
  const t4 = [
    keep(at(P2, 0)), keep(at(P2, 1)), keep(at(P2, 2)), keep(at(P2, 3)), keep(at(P2, 4)), keep(at(P2, 5)), keep(at(P2, 6)),
    heading('Now meet what’s engineered to grab the beam'),
    move(at(P3, 1)), // Gita 2.62 — dwelling → craving, fits the lever
    text('Your beam isn’t weak. It’s outgunned. The apps in your pocket were tuned by brilliant people to hijack exactly this spotlight — and the trick has a name. Pull both machines below and *feel* it for yourself.'),
    sim('variable-reward-lever', 'Pull the Lever'),
    text('That “maybe *this* pull” is **variable reward** — the single most powerful hook ever found, and it’s wired into every feed, every pull-to-refresh, every red dot. You just saw it work on your own hand. Seeing the trick is the first step to beating it.'),
    keep(at(P2, 7)), keep(at(P2, 8)), keep(at(P2, 9)), keep(at(P2, 10)),
  ];

  // ─── T5 = P3 (xray + self_experiment) + P4 multitasking; drop slot-machine prose ───
  reset();
  const t5 = [
    keep(at(P3, 0)),
    move(at(P4, 1)), // Gita 2.41 — the resolute mind is one-pointed (anchors multitasking)
    heading('The machine, part by part'),
    keep(at(P3, 7)), keep(at(P3, 8)), keep(at(P3, 9)), // "Nothing on your screen is an accident" + image + attention_xray
    heading('And “doing two things” means doing both worse'),
    text('“I study with WhatsApp open, I can handle both.” You can’t — nobody can. Your brain doesn’t run two streams; it *switches*, and every switch leaves a smear of the last task behind. Walk through why:'),
    move(at(P4, 3)), // the multitasking guided_reveal
    keep(at(P3, 10)), keep(at(P3, 11)), keep(at(P3, 12)), // quiz + self_experiment + reflection
    text('**You’ve now seen the whole machine** — the hook, the timing, the switching tax. Here’s the good news the designers hope you never reach: a machine you can see is a machine you can *beat*. The rest of this book is how. Turn the page and take the controls.'),
  ];

  // ─── T6 = P5 dhāraṇā + P6 breath (two resets, both practices kept) ───
  reset();
  const t6 = [
    keep(at(P5, 0)),
    keep(at(P5, 1)), // YS 3.1–3.2 (dhāraṇā)
    heading('Reset 1 — Dhāraṇā: hold one thing'),
    keep(at(P5, 3)), keep(at(P5, 4)), // "two-line manual" + section
    text('The whole exercise is: pick one thing, and every time the mind slips, bring it back. The slipping isn’t failure — *the bringing-back is the rep.*'),
    keep(at(P5, 8)), // guided_practice meditation (breath-counting dhāraṇā)
    heading('Reset 2 — Breath: the one dial you can turn by hand'),
    move(at(P6, 1)), // YS 1.34 (breath)
    move(at(P6, 9)), // the 4-4-6 section
    move(at(P6, 11)), // guided_practice 4-4-6 breathing pacer
    keep(at(P5, 9)), // reflection
    text('**Tonight:** one round of each — a minute of breath-counting, then six slow 4-4-6 breaths before sleep. Two dials, both in your hands.'),
  ];

  // ─── T7 = P7 desk + P8 sprint (environment + rhythm) ───
  reset();
  const t7 = [
    keep(at(P7, 0)),
    keep(at(P7, 1)), // Gita 6.11 — prepare the place
    heading('Step 1 — Design the desk'),
    keep(at(P7, 3)), keep(at(P7, 4)), // "brain bills you" + section
    keep(at(P7, 8)), // guided_practice desk reset
    heading('Step 2 — Run one real sprint'),
    move(at(P8, 1)), // Gita 2.47 — right to the action, not the fruit
    move(at(P8, 4)), // sprint-protocol section
    move(at(P8, 8)), // guided_practice focus_timer sprint
    keep(at(P7, 9)), // reflection
    text('**Your rep:** desk cleared, phone in another room, one 25-minute sprint. That single setup — environment plus rhythm — is 80% of focus, before any willpower is spent.'),
  ];

  // ─── T8 = P9 sleep, + mood-cost line (additive) ───
  reset();
  const p9 = bySlug[P9];
  const t8 = [];
  for (const b of p9.blocks) {
    t8.push(keep(b));
    if (b.order === 6) { // after the "double theft" section
      t8.push(text('And there’s a third theft the tiredness hides: **mood**. A brain that never got its night shift wakes up more anxious, shorter-tempered, quicker to feel behind — which is exactly when the comparison feed hits hardest. Protecting sleep isn’t only protecting marks. It’s protecting how you’ll *feel* about yourself tomorrow.'));
    }
  }

  // ─── T9 = P10 challenge, + self-image action (additive) ───
  reset();
  const p10 = bySlug[P10];
  const t9 = [];
  for (const b of p10.blocks) {
    t9.push(keep(b));
    if (b.order === 9) { // right after the habit_tracker
      t9.push(text('**One extra rep, any day this week:** the self-image one. Open your feed, find the account that most makes you feel behind, and unfollow it. Winning back your attention and winning back how you see yourself are the same fight.'));
    }
  }

  const plan = [
    ['the-spotlight-and-the-lever', P2, 'The Spotlight & The Lever', 'Your attention is a beam — and here’s the machine engineered to grab it.', t4, false],
    ['the-notification-autopsy', P3, 'The Notification Autopsy', 'Open the machine and look inside. A trick you can see is a trick you can beat.', t5, true],
    ['two-resets-breath-and-dharana', P5, 'Two Resets: Breath & Dhāraṇā', 'Two hand-turned dials for a restless mind — do them, don’t just read them.', t6, true],
    ['your-focus-setup', P7, 'Your Focus Setup', 'Willpower is overrated. Set the desk and the rhythm, and focus mostly takes care of itself.', t7, true],
  ];

  if (DRY) {
    console.log('\n=== DRY RUN (Act II/III compaction) ===');
    for (const [newSlug, srcSlug, , , blocks] of plan) {
      const d = await bw.savePage(db, { slug: srcSlug }, blocks, { dryRun: true, author: 'agent:act23', summary: 'compaction' });
      console.log(`${srcSlug} → ${newSlug}: ${(bySlug[srcSlug].blocks || []).length}→${blocks.length} blocks | loss:${d.diff.lossDetected} | ${JSON.stringify(d.diff.reasons)}`);
    }
    const d8 = await bw.savePage(db, { slug: P9 }, t8, { dryRun: true, author: 'agent:act23', summary: 'sleep + mood' });
    console.log(`${P9} → T8: ${(bySlug[P9].blocks||[]).length}→${t8.length} | loss:${d8.diff.lossDetected}`);
    const d9 = await bw.savePage(db, { slug: P10 }, t9, { dryRun: true, author: 'agent:act23', summary: 'challenge + self-image' });
    console.log(`${P10} → T9: ${(bySlug[P10].blocks||[]).length}→${t9.length} | loss:${d9.diff.lossDetected}`);
    console.log('\nSoft-delete: the-multitasking-myth, breath-the-remote-control, the-25-minute-sprint');
    console.log('Final chapter: opener + 9 pages; all published:false.');
    await client.close();
    return;
  }

  // 1) Save the four merged survivors (rename + allowContentLoss for the trims)
  for (const [newSlug, srcSlug, title, subtitle, blocks, allowLoss] of plan) {
    const r = await bw.savePage(db, { slug: srcSlug }, blocks, {
      author: 'agent:act23', summary: `Focus redesign compaction → ${newSlug}`,
      allowContentLoss: allowLoss, lossReason: allowLoss ? LOSS : '',
      extraSet: { slug: newSlug, title, subtitle, published: false },
    });
    console.log(`${srcSlug} → ${newSlug}: v${r.version}`);
  }
  // 2) T8, T9 additive (+ unpublish)
  await bw.savePage(db, { slug: P9 }, t8, { author: 'agent:act23', summary: 'sleep: add mood-cost line', extraSet: { published: false } });
  await bw.savePage(db, { slug: P10 }, t9, { author: 'agent:act23', summary: 'challenge: add self-image action', extraSet: { published: false } });
  console.log('T8, T9 saved.');

  // 3) Soft-delete the merged-away shells
  for (const s of [P4, P6, P8]) {
    await bw.softDeletePage(db, { slug: s }, { author: 'agent:act23', reason: LOSS });
    console.log('soft-deleted', s);
  }

  // 4) Rebuild chapter.page_ids excluding deleted; renumber two-phase
  const survive = {};
  for (const s of ['the-time-paradox-and-your-flame', 'the-other-half-of-the-post', 'fragmented-not-broken',
    'the-spotlight-and-the-lever', 'the-notification-autopsy', 'two-resets-breath-and-dharana',
    'your-focus-setup', 'sleep-the-night-shift-of-memory', 'your-7-day-focus-challenge']) {
    const p = await pages.findOne({ slug: s });
    survive[s] = String(p._id);
  }
  const openerId = String(chapter.page_ids[0]);
  const newOrder = [openerId, survive['the-time-paradox-and-your-flame'], survive['the-other-half-of-the-post'],
    survive['fragmented-not-broken'], survive['the-spotlight-and-the-lever'], survive['the-notification-autopsy'],
    survive['two-resets-breath-and-dharana'], survive['your-focus-setup'],
    survive['sleep-the-night-shift-of-memory'], survive['your-7-day-focus-challenge']];
  await books.updateOne({ _id: book._id, 'chapters.slug': CH_SLUG }, { $set: { 'chapters.$.page_ids': newOrder } });
  for (let i = 0; i < newOrder.length; i++) await pages.updateOne({ _id: newOrder[i] }, { $set: { page_number: 1000 + i } });
  for (let i = 0; i < newOrder.length; i++) await pages.updateOne({ _id: newOrder[i] }, { $set: { page_number: i } });

  // 5) Make sure the opener page is unpublished too (whole chapter draft)
  await pages.updateOne({ _id: openerId }, { $set: { published: false } });

  console.log('\nChapter compacted to', newOrder.length, 'pages (opener + 9), all published:false. P4/P6/P8 soft-deleted & pulled from page_ids.');
  await client.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
