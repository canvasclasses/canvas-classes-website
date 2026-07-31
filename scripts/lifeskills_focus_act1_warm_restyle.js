'use strict';
/**
 * Founder decision (2026-07-23): drop the 3-register visual plan. Keep ONE
 * consistent warm hand-drawn style across the whole chapter — Act I's cold
 * "Mirror" placeholders (T1/T2/T3) get reframed into the SAME canonical warm
 * style already baked into every other image in the book (copied verbatim
 * from the-spotlight-and-the-lever's hero, the book's living style reference —
 * NOT the possibly-stale STYLE constant in the original setup script).
 *
 * Scene concepts are kept (clock leaking time / teen vs curated feed /
 * narrowing window) — only the mood language changes from cold-blue-isolation
 * to warm-light-and-shadow storybook, so the compositions still read as loss/
 * urgency through shadow and scale, not through color temperature.
 *
 * Run: node scripts/lifeskills_focus_act1_warm_restyle.js
 */
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bw = require('./lib/book-writer');

// Copied verbatim from the-spotlight-and-the-lever's hero — the book's one
// canonical style, so every image (old and new) matches exactly.
const WARM_STYLE =
  'Richly detailed hand-drawn coloured illustration, warm and full of life, in an expressive ' +
  'ink-and-gouache style with confident characterful linework and strong contrast between warm ' +
  'light and deep shadow. Deep charcoal dark background; a vivid yet earthy palette — sage green, ' +
  'clay red, ochre, mustard gold, dusty blue, warm cream — with luminous highlights and rich ' +
  'saturated fills, never flat, dull or washed-out. A clear warm focal light anchoring the scene. ' +
  'Editorial storybook atmosphere with real depth and texture. No neon, no digital sci-fi glow, ' +
  'no orange haze, no 3D render, no photographic realism.';
const BANNER =
  ' Ultra-wide cinematic banner composition in a 16:5 ratio (much wider than it is tall, like a ' +
  'wide film still), the key subject centred with generous empty space to the left and right so ' +
  'nothing important is cropped when shown as a wide banner.';

const FIXES = {
  'the-time-paradox-and-your-flame': {
    alt: 'A warped clock over a study desk, its hours pouring away as small glowing embers instead of reaching the open notebook below',
    prompt:
      'A student sits at a lamp-lit desk beneath a large, gently warped brass clock; instead of ' +
      'ticking normally, its hours spill off in a slow stream of small warm embers that drift and ' +
      'fade in the air, dissolving before they ever reach the half-finished notebook on the desk — ' +
      'time visibly leaking away to distraction while the student, lit by one warm desk lamp, ' +
      'waits unaware. ' + WARM_STYLE + BANNER,
  },
  'the-other-half-of-the-post': {
    alt: 'A teenager sits small and shadowed while bright framed portraits of other people’s best moments float around them like little illuminated windows',
    prompt:
      'A teenager sits cross-legged on the floor of a dim room, their own figure drawn small and in ' +
      'shadow; around them float half a dozen small glowing framed portraits — a topper’s trophy ' +
      'moment, a beach sunrise, a perfect smile — each lit like a tiny warm window, while the ' +
      'teenager in the centre stays dim and unlit by comparison. ' + WARM_STYLE + BANNER,
  },
  'fragmented-not-broken': {
    alt: 'A tall warm-lit window slowly narrowing to a thin sliver of light, a small figure straining to keep looking through it',
    prompt:
      'A single figure stands before a tall arched window whose warm evening light is slowly ' +
      'narrowing into a thin vertical sliver; the wide world beyond — trees, a road, a rooftop skyline ' +
      '— is only fully visible at the window’s wide historical edge, crowded to almost nothing at its ' +
      'narrow present edge, while the figure leans in, straining to keep watching. ' + WARM_STYLE + BANNER,
  },
};

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();

  for (const [slug, fix] of Object.entries(FIXES)) {
    const p = await db.collection('book_pages').findOne({ slug });
    if (!p) throw new Error(`page not found: ${slug}`);
    const blocks = p.blocks.map((b) =>
      b.order === 0 ? { ...b, alt: fix.alt, generation_prompt: fix.prompt } : b
    );
    const r = await bw.savePage(db, { slug }, blocks, {
      author: 'agent:warm-restyle',
      summary: 'Revert hero to the single canonical warm hand-drawn style (founder: drop 3-register plan)',
    });
    console.log(slug, '→ v' + r.version, '| content-loss:', r.diff.lossDetected);
  }

  await client.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
