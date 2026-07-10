'use strict';
/**
 * Page 4 ("The Multitasking Myth") — replace the page-opener hero. The old hero
 * was a railway junction (a task-SWITCHING metaphor); the page is now about
 * channel COLLISION (music/lyrics vs word-work), so the opener must show the new
 * idea. Sets the hero block back to a placeholder (src '') with a new house-style
 * 16:5 generation_prompt + alt, ready for the founder to generate (Phase B).
 *
 * Unlinking the old hero src trips the content-loss guard → allowContentLoss with
 * a reason; the old R2 file is RETAINED per §0.6 and the block is snapshotted, so
 * this is reversible.
 *
 * Run: node scripts/lifeskills_focus_p4_hero_reprompt.js [--dry]
 */
require('dotenv').config({ path: '.env.local' });
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'life-skills-class-9';
const SLUG = 'the-multitasking-myth';
const DRY = process.argv.includes('--dry');
const HERO_ID = 'a084e97e';

const STYLE =
  'A hand-drawn coloured illustration, warm storybook-editorial style, on a deep charcoal (#121316) background. ' +
  'Muted earthy palette — dusty ochre, terracotta, sage, faded indigo, warm brown — with rich warm light and soft deep shadows. ' +
  'No neon, no glow, no 3D render, no photographic look. Ultra-wide 16:5 banner composition with generous negative space, desktop-friendly. No captions, no logos, minimal or no text.';

const HERO_PROMPT =
  STYLE + ' ' +
  'A teenage student sits at a study desk toward the left, an open textbook in hand, calm and absorbed. ' +
  'From the page of the book, a flowing ribbon made of small letters and words rises up toward the student\'s head. ' +
  'At the same time, from the earphones in their ears, a second ribbon — made of song lyrics and musical notes turning into words — flows up toward the same head. ' +
  'The two word-ribbons meet and tangle into a single knot at a bright point near the student\'s temple, showing two streams of words trying to squeeze through one channel. ' +
  'The tangle is gentle and illustrative, not chaotic. Warm hand-drawn line work, balanced composition.';

const HERO_ALT =
  'A student reading at a desk: a ribbon of words rises from the book toward their head while a second ribbon of song lyrics rises from their earphones — ' +
  'the two streams of words tangling into a single knot, showing they compete for the same mental channel.';

async function main() {
  await bw.withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book ${BOOK_SLUG} not found`);
    const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug: SLUG });
    if (!page) throw new Error(`page ${SLUG} not found`);

    let done = false;
    const out = page.blocks.map((b) => {
      if (b.type === 'image' && b.id.startsWith(HERO_ID)) {
        done = true;
        return { ...b, src: '', alt: HERO_ALT, caption: '', generation_prompt: HERO_PROMPT };
      }
      return b;
    });
    if (!done) throw new Error(`hero image ${HERO_ID} not found`);

    const res = await bw.savePage(db, { pageId: page._id }, out, {
      author: 'agent',
      summary: 'page 4: reprompt hero → channel-collision metaphor (music word-streams); clear src for regeneration',
      allowContentLoss: true,
      lossReason: 'Founder-approved: the old railway-junction hero was a task-switching metaphor that no longer fits the music/channel reframe. Old R2 image retained; block snapshotted.',
      dryRun: DRY,
    });
    console.log(DRY
      ? `[dry] ${SLUG}: wouldBlock=${res.wouldBlock} removedAssets=${res.diff.removedAssets.length}`
      : `✓ ${SLUG}: v${res.version} · hero reset to placeholder + new channel-collision prompt`);
  });
  console.log(DRY ? '\n[dry] no writes.' : '\n✅ Page-4 hero ready to regenerate.');
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
