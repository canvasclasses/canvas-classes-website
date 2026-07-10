'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — CHAPTER OPENER (page_number 0).
 * "We Are Made of Stardust" — a story-led opener to get students excited before the
 * lessons begin: every atom in the body was forged in a dying star, and the chemical
 * bond is what assembled that stardust into living things. Two cinematic visuals +
 * open "food for thought" curiosity prompts (active, not passive).
 * Mirrors the Ch.1 `chapter_opener` page_type (21:9 cover banner, hooky subtitle).
 * Inserts at page_number 0 and prepends to ch4 page_ids (sits before page 1).
 * published:false — founder reviews + generates the 2 images, then publishes.
 * Run: node scripts/insert_bond_p0_opener-stardust.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 0;
const NEW_SLUG = 'chapter-4-stardust-opener';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — cinematic cover banner (21:9, like the Ch.1 opener)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '21:9',
      alt: 'A dying star scattering glowing elements across space that drift together into the silhouette of a human figure made of stars',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic cover banner (21:9). A massive dying star (supernova) erupting in deep space on one side, throwing out luminous streams of glowing elemental particles; the particles drift across the frame and gather, on the other side, into the faint silhouette of a human figure that appears to be made of stars and stardust — a body of constellations. The emotional message: the atoms in a person were born in stars. Deep near-black cosmic background (#0a0a0a), warm orange and amber stellar fire, cyan and violet nebula glow, soft volumetric haze, scattering points of light. Photorealistic astrophotography blended with clean scientific illustration. No text, no labels.' },

    // 1 — story heading
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'You Are Made of Stardust' },

    // 2 — the story, part 1
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Hold up your hand and look at it. Every single atom in it has a history older than the Earth, older than the Sun.\n\n" +
      "When the universe began, it made almost nothing but the two lightest elements — **hydrogen** and **helium**. There was no carbon, no oxygen, no iron anywhere. So where did the rest come from — the carbon in your cells, the oxygen you are breathing right now, the calcium in your bones, the iron in your blood?\n\n" +
      "They were **built inside stars.** Deep in a star's core, under crushing heat and pressure, small atoms are fused into bigger ones — hydrogen into helium, helium into carbon and oxygen, and on up the ladder. The heaviest elements were forged in the violent death of giant stars, in explosions called **supernovae** so bright they briefly outshine an entire galaxy." },

    // 3 — the story, part 2
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "When those stars died, they flung their freshly-made atoms across space as glowing clouds of dust and gas. Billions of years later, one such cloud collapsed to form our Sun, the planets, the oceans — and, eventually, **you**.\n\n" +
      "The astronomer Carl Sagan said it best: *\"We are made of star-stuff.\"* It is not poetry — it is chemistry. The atoms that make up your body were cooked in stars that died long before the Sun was born." },

    // 4 — second cinematic visual: elements of the body
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:9',
      alt: 'A human silhouette filled with the glowing chemical symbols of the main elements that make up the body',
      caption: '📸 The main elements of your body — oxygen, carbon, hydrogen, nitrogen, calcium and more — every one with a cosmic origin',
      generation_prompt: 'A human figure silhouette, front-facing, filled with the softly glowing chemical symbols of the main elements that compose the human body — large O, C, H, N and smaller Ca, P, K, S, Na, Fe — scattered like stars throughout the body, denser where each element is more abundant. The symbols glow like distant suns inside the dark silhouette. Deep near-black background (#0a0a0a), warm orange and amber symbol glow, faint cyan accents, clean scientific-illustration style. No extra text or labels beyond the element symbols themselves.' },

    // 5 — food for thought #1 (open, active)
    { id: uuidv4(), order: n(), type: 'curiosity_prompt',
      prompt: "The carbon atoms in your DNA and the carbon atoms in a lump of black coal were forged the same way, inside a star. Atom for atom, they are identical. So what makes one part of a living, thinking person — and the other just a rock you can burn?",
      hint: "Think about it: if the atoms are the same, the difference can't be in the atoms themselves. So where is it?",
      reveal: "The difference isn't the atoms — it's how they are **joined together.** The same carbon atoms, connected in different patterns, give you graphite, diamond, sugar, or DNA. That joining is the **chemical bond** — and it is the whole subject of this chapter." },

    // 6 — the turn: from stardust to bonding
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'A Pile of Atoms Is Not a Person' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Here is the key idea. A bucket holding the exact atoms of a human body — the right carbon, oxygen, hydrogen, nitrogen, calcium — is worth a few hundred rupees of raw chemicals. It is not alive. It is not even water.\n\n" +
      "What turns that lifeless dust into water, into DNA, into a beating heart, is **the way the atoms hold on to one another.** Two hydrogens and one oxygen, *bonded* in just the right shape, become a drop of water. Carbon atoms, *bonded* into long chains, become the backbone of every living thing.\n\n" +
      "Chemistry is, at heart, the study of how atoms join hands. **Chemical bonding is where that story begins** — why atoms bond at all, which ones bond, how strongly, and into what shapes. Master this chapter and the rest of chemistry stops being a list to memorise and starts being a story you can read." },

    // 7 — food for thought #2 (open, active)
    { id: uuidv4(), order: n(), type: 'curiosity_prompt',
      prompt: "Imagine you had a sealed jar containing the precise atoms that make up a single living cell — every element, in exactly the right amount. Could you ever shake that jar hard enough, or long enough, to make a living cell appear inside it?",
      hint: "You already have all the right ingredients. What's missing?",
      reveal: "No amount of shaking would do it. Having the right atoms is not enough — they have to be **bonded into the right molecules, in the right shapes, in the right places.** The information of life lives in the *bonds*, not the *atoms*. That is why understanding bonding matters so much." },

    // 8 — wow-stat fun_fact
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'Mostly Oxygen, Mostly Stardust',
      markdown: "About **65% of your body's mass is oxygen**, and roughly **18% is carbon** — and almost every one of those atoms was manufactured inside a star that exploded before the Sun existed. You are, quite literally, walking, thinking stardust held together by chemical bonds." },

    // 9 — what's ahead + bridge
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'What You Will Learn in This Chapter' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "By the time you finish Chemical Bonding, you will be able to:\n\n" +
      "- Explain **why** atoms bond at all — and predict whether two atoms will *give*, *take*, or *share* electrons\n" +
      "- Draw any molecule's structure and work out its **shape in three dimensions**\n" +
      "- Predict whether a substance will **dissolve, melt high or low, conduct, or stay put**\n" +
      "- Understand why **water is strange**, why **diamond is hard**, and why **oxygen sticks to a magnet**\n\n" +
      "Let's begin where the universe does — with the simple question of *why atoms bond in the first place.*" },
  ];
}

bw.withDb(async (db) => {
  const pages = db.collection('book_pages');
  const books = db.collection('books');
  const book = await books.findOne({ slug: BOOK_SLUG });
  if (!book) throw new Error('book not found');

  if (await pages.findOne({ book_id: book._id, slug: NEW_SLUG })) {
    console.log(`⚠  ${NEW_SLUG} already exists — skipping (idempotent).`);
    return;
  }
  if (await pages.findOne({ book_id: book._id, chapter_number: CH, page_number: PAGE_NUMBER })) {
    throw new Error(`a page already occupies ch${CH} page_number ${PAGE_NUMBER}`);
  }

  const blocks = buildBlocks();
  const newId = uuidv4();
  const now = new Date();
  const doc = {
    _id: newId, book_id: book._id, chapter_number: CH, page_number: PAGE_NUMBER,
    slug: NEW_SLUG, title: 'Chemical Bonding',
    subtitle: "Every atom in your body was forged in the heart of a dying star — and the chemical bond is what assembled that stardust into you.",
    page_type: 'chapter_opener',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'chapter-opener'],
    published: false,
    reading_time_min: bw.computeReadingTime(blocks),
    content_types: bw.computeContentTypes(blocks),
    created_at: now, updated_at: now,
    deleted_at: null, deleted_by: null, deletion_reason: null,
  };
  await pages.insertOne(doc);
  console.log(`✓ inserted opener "${doc.title}" — ch${CH} page ${PAGE_NUMBER} (chapter_opener), ${blocks.length} blocks, published:false`);

  // Prepend page_id to chapter 4 page_ids (opener sits first).
  const ch = book.chapters.find((c) => c.number === CH);
  if (!ch) throw new Error('chapter 4 not found in book.chapters');
  ch.page_ids = ch.page_ids || [];
  if (!ch.page_ids.includes(newId)) ch.page_ids.unshift(newId);
  await books.updateOne({ _id: book._id, 'chapters.number': CH }, { $set: { 'chapters.$.page_ids': ch.page_ids } });
  console.log(`✓ prepended opener page_id into chapter ${CH} page_ids (now ${ch.page_ids.length})`);

  await bw.snapshotVersion(db, doc, 'baseline — new chapter-4 stardust opener', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
