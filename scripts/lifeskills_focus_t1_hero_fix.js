'use strict';
/**
 * T1 hero fix (2026-07-23, founder): the chariot image was the Katha-verse
 * illustration, not the page's thesis. Page 1 is now "The Time Paradox", so its
 * HERO must match the title. Founder: "forget old images if they don't align."
 * Replace block-0 hero with a Time-Paradox-themed placeholder (src:'') in the
 * cold Act-I "Mirror" register, for the images pipeline to regenerate. The old
 * chariot R2 file is retained in the bucket (§0.6#4) and in version history.
 *
 * Run: node scripts/lifeskills_focus_t1_hero_fix.js
 */
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bw = require('./lib/book-writer');

const COLD =
  'Cinematic, editorial illustration on a deep desaturated charcoal background. ' +
  'Cold blue-grey palette with a single restrained cool light and a lonely, glassy ' +
  'screen-glow motif; a mood of quiet urgency and time slipping away. Sober, ' +
  'documentary-poster feeling — NOT warm, NOT storybook, no orange, no neon, no 3D ' +
  'render, no photographic realism. Ultra-wide cinematic banner in a 16:5 ratio, ' +
  'subject centred with generous empty space left and right.';

const NEW_PROMPT =
  'A lone student sits at a study desk beneath a large, slightly warped wall clock. ' +
  'Instead of ticking normally, fine streams of time pour off the clock like sand and ' +
  'scatter into small cold glowing phone-screen shards floating in the air, dissolving ' +
  'before they ever reach the half-finished work on the desk — hours visibly leaking ' +
  'away to distraction while the student waits, unaware. Empty, still, a little surreal. ' +
  COLD;

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const p = await db.collection('book_pages').findOne({ slug: 'the-time-paradox-and-your-flame' });
  if (!p) throw new Error('T1 not found');

  const blocks = (p.blocks || []).map((b) => {
    if (b.order !== 0) return b;
    if (b.type !== 'image') throw new Error(`block 0 is ${b.type}, expected image`);
    return {
      ...b,
      src: '',
      alt: 'Time pouring off a clock and scattering into cold phone-screen shards before reaching a studying student',
      generation_prompt: NEW_PROMPT,
    };
  });

  const r = await bw.savePage(db, { slug: 'the-time-paradox-and-your-flame' }, blocks, {
    author: 'agent:t1hero',
    summary: 'Replace chariot hero with Time-Paradox-themed placeholder (founder: hero must match title)',
    allowContentLoss: true,
    lossReason: 'Founder 2026-07-23: forget old images if not aligned; page-1 hero must match "The Time Paradox" title, not the Katha chariot verse. Old chariot R2 file retained + in version history.',
  });
  console.log('T1 hero replaced (src reset to placeholder for regeneration). v' + r.version);
  console.log('unlinked asset:', JSON.stringify(r.diff.removedAssets));
  await client.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
