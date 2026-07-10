'use strict';
/**
 * Class 11 Chemistry — Ch.5 Thermodynamics — CHAPTER OPENER (page_number 0).
 * "Thermodynamics" — engineering-led opener: heat is the hidden hero of every engine,
 * heat-sink and rocket. Mirrors the Ch.4 stardust opener (page_type:'chapter_opener',
 * 21:9 cover banner + hooky subtitle + "what you'll master"). Food-for-thought prompts
 * live on page 1 (the first teaching page), NOT here (§3.12 / §15.1).
 * Inserts at page_number 0 and prepends to ch5 page_ids.
 * published:false — founder reviews + generates the images, then publishes.
 * Voice: teacher-voice-profile.md + THERMO-exemplars.md. Reference-first: Mittal §23–25.
 * Run: node scripts/insert_thermo_p0_opener.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 5;
const PAGE_NUMBER = 0;
const NEW_SLUG = 'chapter-5-thermodynamics-opener';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — cinematic cover banner (21:9)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '21:9',
      alt: 'A superbike engine glowing with combustion, a laptop heat-sink wicking away heat, and a rocket lifting on its fiery exhaust — three machines built around the flow of heat',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic cover banner (21:9). A triptych of engineering where heat is the hidden hero, blended into one continuous dramatic scene: on the left, a powerful superbike engine cutaway glowing orange with internal combustion and visible heat shimmer; in the centre, a finned metal heat-sink on a glowing computer chip with cool blue air being drawn through it carrying heat away; on the right, a rocket lifting off on a brilliant column of fire and exhaust. A subtle flow of energy/heat threads through all three, tying them together. Deep near-black background (#0a0a0a), intense warm orange and amber combustion glow, cool cyan accents for the cooling airflow, volumetric haze, sparks and light scattering. Photorealistic industrial illustration blended with clean scientific style. No text, no labels.' },

    // 1 — story heading
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Science of Heat, Work and Why Things Happen' },

    // 2 — the story
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Look at any machine that matters. A superbike engine burns fuel and turns that heat into the push that moves you. The slim laptop on your desk is fighting the opposite battle — it makes heat it never wanted, and a tiny finned metal block works flat out to carry that heat away before the chip cooks. A rocket is, at heart, one careful calculation: how much energy is locked in each kilogram of fuel, and how much of it can be turned into lift.\n\n" +
      "Three very different machines. One science behind all of them. **Thermodynamics** is the rulebook of energy — where it goes, how much of it escapes as heat, how much real work you can squeeze out, and the deepest question of all: *will a change even happen on its own?*" },

    // 3 — second visual
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:9',
      alt: 'A single flame on the left turning into useful work (a turning wheel) on the right, with some energy always leaking away as waste heat',
      caption: '📸 Every engine is the same bargain — turn heat into work, and lose a little to waste heat you can never recover',
      generation_prompt: 'A clean conceptual diagram on a deep near-black background (#0a0a0a). On the left, a glowing flame representing released chemical energy. An arrow leads to the right where a turning wheel / piston represents useful work being done. A second, smaller stream of energy branches off and dissipates upward as faint orange "waste heat" that fades into the dark. The composition should feel like a bargain: most energy becomes work, some always leaks away. Warm orange and amber energy glow, soft cyan accents, clean scientific-illustration style. No text or labels beyond the flame, wheel and faint heat wisps.' },

    // 4 — what you'll master
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'What You Will Master in This Chapter' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "By the time you finish Thermodynamics, you will be able to:\n\n" +
      "- **Track energy** through any change using the First Law — the strictest accounting rule in all of science\n" +
      "- **Predict the work** a gas does as it expands, and see why doing it *slowly* and doing it *fast* give completely different answers\n" +
      "- **Calculate the heat** of a reaction you could never measure directly — using Hess's law as a shortcut\n" +
      "- **Read entropy** as the universe's built-in arrow of time — why your tea cools but never reheats itself\n" +
      "- **Decide with a single number** — the Gibbs free energy — whether *any* reaction will run on its own, or never at all\n\n" +
      "We begin with the very first move every thermodynamics problem demands: drawing a line around the bit of the universe you actually care about." },

    // 5 — wow-stat fun_fact
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'Why Your Engine Throws Most of the Fuel Away',
      markdown: "A modern petrol engine turns only about **25–30% of its fuel's energy into motion.** The rest — nearly three-quarters — leaves as **waste heat** through the exhaust and the radiator. This is not bad engineering. Thermodynamics proves that *no* heat engine can ever convert all of its heat into work. That hard limit is one of the laws you are about to meet." },
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
    slug: NEW_SLUG, title: 'Thermodynamics',
    subtitle: "Every engine, every heat-sink, every rocket is an argument about energy — where it goes, how much escapes as heat, and whether a reaction will happen at all. Thermodynamics is the rulebook all of them obey.",
    page_type: 'chapter_opener',
    blocks,
    hinglish_blocks: [], tags: ['thermodynamics', 'chapter-opener'],
    published: false,
    reading_time_min: bw.computeReadingTime(blocks),
    content_types: bw.computeContentTypes(blocks),
    created_at: now, updated_at: now,
    deleted_at: null, deleted_by: null, deletion_reason: null,
  };
  await pages.insertOne(doc);
  console.log(`✓ inserted opener "${doc.title}" — ch${CH} page ${PAGE_NUMBER} (chapter_opener), ${blocks.length} blocks, published:false`);

  const ch = book.chapters.find((c) => c.number === CH);
  if (!ch) throw new Error('chapter 5 not found in book.chapters');
  ch.page_ids = ch.page_ids || [];
  if (!ch.page_ids.includes(newId)) ch.page_ids.unshift(newId);
  await books.updateOne({ _id: book._id, 'chapters.number': CH }, { $set: { 'chapters.$.page_ids': ch.page_ids } });
  console.log(`✓ prepended opener page_id into chapter ${CH} page_ids (now ${ch.page_ids.length})`);

  await bw.snapshotVersion(db, doc, 'baseline — new chapter-5 thermodynamics opener', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
