'use strict';
// Build chapter_opener ("chapter intro") pages for the 4 built Social Science chapters —
// mirroring the Class 11 Chemistry mole book's `chapter-1-overview` (page_type:'chapter_opener').
// Structure (per ChapterOpener.tsx + BookReader): page_number 0; `subtitle` = the promise/intro
// shown on the cover; block[0] = full-bleed hero image (placeholder src, generation_prompt);
// block[1] = a text block whose markdown bullet list becomes the "by the end you'll…" outcomes.
// The lesson "journey" list + Start CTA are auto-computed by the reader. published:false (matches
// the rest of the unpublished SS book). Idempotent: skips a chapter that already has an opener.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
const { v4: uuid } = require('uuid');
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const HERO = 'Dark, atmospheric, painterly Indian-illustration style, no text overlay.';

function heroImg(alt, prompt) {
  return { id: uuid(), order: 0, type: 'image', src: '', alt, caption: '', width: 'full',
    generation_prompt: `Ultra-wide cinematic cover banner (21:9). ${prompt} ${HERO}` };
}
function outcomes(md) { return { id: uuid(), order: 1, type: 'text', markdown: md }; }

const OPENERS = [
  {
    chapter: 1, slug: 'understanding-social-science-opener',
    title: 'Understanding Social Science',
    subtitle: "Every road, every price, every rule around you was decided by someone, somewhere, for a reason. Social Science is how you learn to see those hidden decisions — and this chapter hands you the four lenses (geography, history, political science and economics) you'll use to read the world for the next two years.",
    hero: heroImg(
      'An everyday Indian street scene with luminous threads linking daily life to symbols of the four social science disciplines',
      'An ordinary Indian street at golden hour — a market, a road, a school, people going about their day — with faint luminous threads rising from the everyday objects into a constellation of symbols for geography, history, governance and trade, suggesting the hidden systems behind daily life.'
    ),
    outcomes: outcomes(
      "- See ordinary things — a road, a price, a custom — as the result of human **decisions**, not chance\n" +
      "- Tell apart the **four disciplines** of Social Science and know the question each one asks\n" +
      "- Trace how India's own thinkers studied society **thousands of years** before modern subjects existed\n" +
      "- Understand how historians **know the past** — from coins and inscriptions to manuscripts and ruins"
    ),
  },
  {
    chapter: 2, slug: 'shaping-the-earths-surface-opener',
    title: "Shaping of the Earth's Surface",
    subtitle: "The ground beneath your feet is moving right now — a few centimetres a year — and it has spent millions of years building mountains and grinding them back down. By the end of this chapter you'll read a river, a coastline or a cave like a story, and understand why the land itself shapes floods, harvests and even history.",
    hero: heroImg(
      'A sweeping Indian landscape cross-section showing the slow forces that build and wear down the Earth',
      'A sweeping Indian landscape at dusk — Himalayan peaks, a river carving a valley, a cliffed coastline — with layered rock strata glowing faintly beneath the surface, conveying the vast slow forces that build and grind down the Earth.'
    ),
    outcomes: outcomes(
      "- Explain how the Earth's **moving plates** raise mountains and set off earthquakes and volcanoes\n" +
      "- Tell the difference between **weathering and erosion**, and name the forces that reshape the land\n" +
      "- Read a **river, coast, glacier, desert or cave** and work out how each landform was made\n" +
      "- Understand how landforms drive real **disasters** — and how people can prepare for them"
    ),
  },
  {
    chapter: 3, slug: 'atmosphere-and-climate-opener',
    title: 'Atmosphere and Climate',
    subtitle: "A thin blanket of air is the only thing standing between us and a dead, frozen rock like the Moon. This chapter takes you from the edge of space down to a single monsoon raindrop — and by the end you'll understand the wind that feeds a billion people, and the change now threatening it.",
    hero: heroImg(
      'The curve of the Earth from space with its thin glowing atmosphere and monsoon clouds over India',
      'The curve of the Earth seen from the edge of space at dawn, its thin glowing blue band of atmosphere wrapping the planet, monsoon clouds gathering over the Indian subcontinent below.'
    ),
    outcomes: outcomes(
      "- Trace the **five layers** of the atmosphere, from the ground to the edge of space\n" +
      "- Tell weather and climate apart, and explain what drives **temperature, wind and rain**\n" +
      "- Understand how the **monsoon** works — and why India's harvests depend on it\n" +
      "- Explain **climate change** in plain terms, and reason through a real disaster it worsened"
    ),
  },
  {
    chapter: 4, slug: 'early-humans-and-civilisation-opener',
    title: 'Early Humans and Beginning of Civilisation',
    subtitle: "For over 99% of our story, no one could write a single word — yet we can still trace humanity from a chipped stone to a planned city of tens of thousands of people. This chapter is a three-million-year journey, and by the end you'll know how we uncover a past that left no books, and why four great civilisations rose, alone, on four rivers.",
    hero: heroImg(
      'A montage of the human journey from a stone tool and cave art to a Neolithic village and a Harappan city',
      "A montage blending across the banner — a hand chipping a stone tool, ochre cave paintings, a Neolithic farming village, and the planned brick streets of a Harappan city — the human journey from the Stone Age to civilisation at golden hour."
    ),
    outcomes: outcomes(
      "- Explain how we know about a past with **no writing** — through archaeology and fossils\n" +
      "- Trace human **evolution** and the spread of our ancestors out of Africa\n" +
      "- Understand the **Neolithic Revolution** — the shift to farming that changed everything\n" +
      "- Compare the world's first **river civilisations**, and weigh why the Harappan cities faded"
    ),
  },
];

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI, { ignoreUndefined: true });
  await client.connect();
  try {
    const db = client.db('crucible');
    const books = db.collection('books');
    const pagesCol = db.collection('book_pages');
    const book = await books.findOne({ _id: BOOK_ID });
    if (!book) throw new Error('book not found');
    let made = 0, skipped = 0;
    for (const o of OPENERS) {
      const existing = await pagesCol.findOne({ book_id: BOOK_ID, chapter_number: o.chapter, page_type: 'chapter_opener' });
      if (existing) { console.log(`⏭  Ch${o.chapter} already has an opener (${existing.slug}) — skipping.`); skipped++; continue; }
      const _id = uuid();
      const blocks = [o.hero, o.outcomes];
      await pagesCol.insertOne({
        _id, book_id: BOOK_ID, chapter_number: o.chapter, page_number: 0,
        slug: o.slug, title: o.title, subtitle: o.subtitle, page_type: 'chapter_opener',
        blocks, hinglish_blocks: [], tags: [], published: false,
        reading_time_min: bw.computeReadingTime(blocks), content_types: bw.computeContentTypes(blocks),
        video_title: null, deleted_at: null, deleted_by: null, deletion_reason: null,
        created_at: new Date(), updated_at: new Date(),
      });
      // link into the chapter (put opener first in page_ids)
      await books.updateOne({ _id: BOOK_ID, 'chapters.number': o.chapter },
        { $push: { 'chapters.$.page_ids': { $each: [_id], $position: 0 } }, $set: { updated_at: new Date() } });
      console.log(`✓ Ch${o.chapter} opener "${o.slug}" created + linked (page 0).`);
      made++;
    }
    console.log(`\n✅ Done. Created ${made}, skipped ${skipped}.`);
  } finally { await client.close(); }
}
main().catch((e) => { console.error('❌', e); process.exit(1); });
