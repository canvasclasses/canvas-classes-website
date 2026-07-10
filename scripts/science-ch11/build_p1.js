'use strict';
/**
 * Class 9 Science · Chapter 11 "Reproduction: How Life Continues"
 * PILOT PAGE 1 — "Why Do Organisms Reproduce?" (slug why-organisms-reproduce)
 *
 * Source: NCERT-Simplified Ch.11 (iesc111.pdf) p208 intro + §11.1/§11.2 framing
 *         + "At a Glance" (p224). Every claim grounded in the source — no invention.
 *
 * Follows BOOK_PAGE_WORKFLOW §4B (Exploration template): curiosity_prompt block 0,
 * Vedic verse as block 2, a reasoning_prompt mid-page, inline_quiz last (L1→L2→L3),
 * ≥1 special callout. §3.6.1 quiz rules: every distractor a real misconception,
 * length-parity options, difficulty-tagged, positions varied, explanations teach.
 * Teacher voice: plain classroom English, no AI-tell phrases.
 *
 * Updates the existing stub page in place (same _id / page_number / published).
 *   node scripts/science-ch11/build_p1.js [--dry]
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const crypto = require('crypto');
const { MongoClient } = require('mongodb');

const BOOK_SLUG = 'class9-science';
const CH = 11;
const SLUG = 'why-organisms-reproduce';
const DRY = process.argv.includes('--dry');
const uid = () => crypto.randomUUID();
const seq = (blocks) => blocks.map((b, i) => ({ id: uid(), order: i, ...b }));

// ── factories ────────────────────────────────────────────────────────────────
const img = (alt, generation_prompt, aspect_ratio = '16:5') =>
  ({ type: 'image', src: '', alt, caption: '', width: 'full', aspect_ratio, generation_prompt });
const txt = (markdown) => ({ type: 'text', markdown });
const h = (text, objective) => ({ type: 'heading', level: 2, text, objective });
const cur = (prompt, hint, reveal) => ({ type: 'curiosity_prompt', prompt, hint, reveal });
const callout = (variant, title, markdown) => ({ type: 'callout', variant, title, markdown });
const cmp = (title, columns) => ({ type: 'comparison_card', title, columns });
const reason = (reasoning_type, prompt, options, correct_index, reveal, difficulty_level) =>
  ({ type: 'reasoning_prompt', reasoning_type, prompt, options, correct_index, reveal, difficulty_level });
const q = (question, options, correct_index, explanation, difficulty_level) =>
  ({ id: uid(), question, options, correct_index, explanation, difficulty_level });
const quiz = (questions) => ({ type: 'inline_quiz', pass_threshold: 0.67, questions });

// ── blocks ───────────────────────────────────────────────────────────────────
const blocks = seq([
  cur(
    'Here is something strange, but completely true. Not one of your ancestors ever died before becoming a parent. Not your grandparents, not their grandparents — go back ten thousand generations, all the way to the very first humans — and every single one of them lived long enough to pass life on. If even ONE link in that chain had broken, you would not be here reading this. So what is this chain that has never snapped — not once in millions of years?',
    'Each living thing is a link that joins its parents to its children.',
    'Let that sink in for a moment — you are the newest link in the longest unbroken chain on Earth. The single word for how that chain keeps adding new links is what this whole chapter is about.'
  ),
  img(
    'A wide scene showing life passing from old to new: an old mango tree dropping seeds with tiny saplings sprouting below it, a cow standing beside its calf, and a hen with chicks',
    'Wide 16:5 banner on a dark background. Left: a large old mango tree shedding seeds, with small green mango saplings sprouting in the soil below. Middle: a cow gently standing next to its newborn calf. Right: a mother hen with three small chicks. Warm natural light, simple and clear, gentle storybook style. Theme: old life giving rise to new life. No text in the image.'
  ),
  callout('fun_fact', 'An Old Idea About New Life',
`वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि।
तथा शरीराणि विहाय जीर्णान्यन्यानि संयाति नवानि देही॥
*(Bhagavad Gita 2.22)*

Just as a person takes off old, worn-out clothes and puts on fresh ones, life too leaves old bodies behind and carries on in new ones. The Gita is speaking about the soul here — but look around and you can see the same idea in nature. Old plants and animals pass away, and new ones take their place. Life never stops; it keeps moving into fresh bodies. That is exactly what reproduction does for every kind of living thing.`),
  h('Every Living Thing Has a Time Limit', 'See why no single plant or animal can keep life going on its own.'),
  txt(
`But every chain like this has a problem built right into it. Every single link runs out of time. A peepal tree may stand for three hundred years and a housefly may last barely a month, yet the ending is the same for both: nothing alive stays alive forever.

So here is the real puzzle. If every link keeps breaking off, how does the chain keep going at all?`),
  txt(
`The trick is that each link makes a **new link before it goes**. This is **reproduction** — the making of a new living thing of the same kind. A peepal scatters seeds that grow into new peepal trees. A hen hatches chicks, an elephant raises a calf, and people have children.

The old ones fade away, but their young ones carry life forward, so the chain never actually has to break. This is how life on Earth has kept going for billions of years — and it is exactly why this chapter is called *How Life Continues*.`),
  reason('logical',
    'Imagine a kind of fish that could never reproduce — not even once. Each fish is still born, grows, gets old, and dies, but no new fish are ever made. What happens to this kind of fish as years pass?',
    [
      'It slowly turns into a different animal',
      'It stays the same in number forever',
      'It disappears completely once all of them die',
      'It is forced to start reproducing on its own',
    ],
    2,
    'Every living thing has a fixed life span, so the old ones keep dying. If no new fish are ever made to replace them, then once the last fish dies, that kind of fish is gone for good. This is the key idea: a single animal cannot live forever, so reproduction is what keeps the whole *kind* (the species) alive.',
    2),
  h('Two Ways Life Makes More Life', 'Find out how reproduction with one parent differs from reproduction with two.'),
  txt(
`Living things reproduce in two main ways.

In **asexual reproduction**, there is only **one parent**. The new individual is an almost exact copy of that single parent, much like a photocopy. Simple living things such as yeast, *Hydra*, and many plants reproduce this way.

In **sexual reproduction**, there are **two parents**. The young one gets a mix of features from both. That is why you might have your mother's eyes but your father's height. Most animals and all flowering plants reproduce this way.`),
  cmp('One Parent or Two?', [
    { heading: 'Asexual — one parent', points: [
      'Only one parent is needed',
      'Young ones are near-identical copies',
      'Usually fast; many produced quickly',
      'Very little variety among the young',
      'Examples: yeast, Hydra, potato, ginger',
    ] },
    { heading: 'Sexual — two parents', points: [
      'Two parents are needed',
      'Young ones are a mix of both',
      'Usually slower than asexual',
      'Plenty of variety among the young',
      'Examples: most animals, flowering plants',
    ] },
  ]),
  txt(
`Why does all this variety matter? Think about your own family. Brothers and sisters share the same parents, yet none of them look exactly alike. Sexual reproduction shuffles the features each time, so every child turns out a little different.

These small differences add up over many, many generations. Some young ones may happen to deal with a new problem — a hotter climate, a new disease — a little better than the rest. Over a very long time, this is how living things slowly change, and how completely new kinds of organisms come about.`),
  callout('threads_of_curiosity', 'Same Parents, Different Children',
`Two children of the same parents can differ in height, in skin tone, even in nature. They came from the same family — so why are they not identical? The mixing that happens during sexual reproduction is the reason. Now think about this: if that mixing did not happen at all, what would a family of ten children look like?`),
  callout('bridging_science', 'Why a Farmer Picks One Way Over the Other',
`Suppose a farmer has one banana plant that gives sweet, disease-free fruit. To get many plants exactly like it, the farmer uses an **asexual** method, so every new plant is a copy of that good one. But to create a **new** variety — say a wheat that can resist a new disease — the farmer needs the mixing that comes with **sexual** reproduction. Both ways of reproducing help feed the country, each in its own role.`),
  quiz([
    q('Reproduction is best described as the process by which living things —',
      [
        'produce new individuals of their own kind',
        'grow larger in size as they age',
        'take in food and release energy',
        'sense and respond to their surroundings',
      ], 0,
      'Reproduction means making new individuals of the same kind. The other three are also things living things do — growth, nutrition, and response — but they keep a single body running; they do not make a new one. Mixing these up is the most common slip here.',
      1),
    q('A farmer has one mango tree that gives unusually sweet fruit. He wants many trees that give exactly the same sweet mango. Which approach fits best?',
      [
        'Grow new trees from the seeds of its fruit',
        'Grow new trees from its cuttings or grafts',
        'Cross it with a sour wild mango tree',
        'Plant seeds collected from many mango trees',
      ], 1,
      'Cuttings and grafts are asexual — they make near-exact copies, so the sweetness is kept. Seeds come from sexual reproduction, which mixes features, so seed-grown trees may not give the same sweet fruit. That is the trap in option A: people assume seeds copy the parent, but they do not.',
      2),
    q('Over many generations, why does sexual reproduction help a kind of animal survive a changing environment better than asexual reproduction?',
      [
        'It produces a much larger number of young each time',
        'It makes young that are identical and equally strong',
        'It mixes features, so some young may handle new conditions',
        'It lets a single parent reproduce faster, on its own',
      ], 2,
      'Sexual reproduction mixes features, so the young are varied — and in a changing environment, some of those varied young may cope with the new conditions. Option A actually describes asexual reproduction (faster, more young), and B is the opposite of what helps, since identical young would all struggle in the same way.',
      3),
  ]),
]);

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db('crucible');
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error('book not found');
    const page = await db.collection('book_pages').findOne({ book_id: String(book._id), chapter_number: CH, slug: SLUG });
    if (!page) throw new Error('stub page not found: ' + SLUG);
    console.log(`Target: p${page.page_number} "${page.title}" _id=${page._id} (current blocks: ${(page.blocks||[]).length}, published: ${page.published})`);
    console.log(`New blocks: ${blocks.length}`);
    const types = blocks.map(b => b.type);
    console.log('Block order:', types.join(' → '));
    if (DRY) { console.log('\n[dry run] no write performed.'); return; }
    await db.collection('book_pages').updateOne(
      { _id: page._id },
      { $set: {
          blocks,
          subtitle: 'Why every living thing must make more of its own kind — and the two ways it happens',
          updated_at: new Date(),
        } }
    );
    console.log('\n✅ Page filled in place. published stays:', page.published);
  } finally { await client.close(); }
})();
