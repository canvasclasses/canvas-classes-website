'use strict';
/**
 * Life Skills — Class 9 · Stress module: convert the remaining 6 pages'
 * concept text blocks to image-paired 50-50 sections (text left, image right),
 * matching the standard already applied to pages 2/3/6 and locked platform-wide
 * in LIFE_SKILLS_WORKFLOW.md §4 (and applied to all 10 Focus pages).
 *
 * Found during self-review right after authoring: only 3 of 9 Stress pages got
 * the image-heavy treatment in the initial insert. This closes the gap so the
 * whole module is consistent before any image generation starts.
 *
 * Also fixes one wording bug on page 1 ("Nine pages of the last chapter" should
 * read "Ten pages" — the Focus module has 10 pages, not 9) as part of the same
 * lossless edit to the same block.
 *
 * LOSSLESS: each targeted text block is moved verbatim (same block id, wording
 * fix applied in-place where noted) into a new section's left column; a new
 * placeholder image (src:'', styled generation_prompt) becomes the right
 * column. Nothing is removed, so the content-loss guard passes without
 * allowContentLoss.
 *
 * Affected: 6 pages (1, 4, 5, 7, 8, 9) → +12 image blocks, +12 sections.
 * Rollback: bw.restorePageVersion to the version printed per page.
 *
 * Run: node scripts/lifeskills_stress_split_layout.js [--dry]
 */

require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'life-skills-class-9';
const DRY = process.argv.includes('--dry');

const STYLE =
  'Hand-drawn coloured illustration on a deep charcoal dark background, muted earthy palette ' +
  '(sage green, clay red, ochre, dusty blue), soft textured linework, no glow, no neon, ' +
  'no orange accents, no 3D render, generous negative space.';

const img = (alt, prompt) => ({
  id: uuidv4(), type: 'image', order: 0, src: '', alt, caption: '',
  width: 'full', aspect_ratio: '4:3', generation_prompt: `${prompt} ${STYLE}`,
});

// Per page: which text blocks get a side image (matched by a distinctive
// substring of their markdown), the image that joins them, and an optional
// wording fix applied to that block's markdown before wrapping.
const PLAN = {
  'what-is-stress-really': [
    { match: 'Nine pages of the last chapter trained your attention', fix: { from: 'Nine pages of the last chapter', to: 'Ten pages of the last chapter' }, image: img(
      'An old brass alarm bell and a modern exam clock wired to the same single trigger switch',
      'An old ornate brass alarm bell and a modern digital exam clock sit side by side on a wooden shelf, both wired by a single visible cable down to one shared trigger switch, showing they ring for the same one alarm.') },
    { match: 'Everything in this chapter is a tool for everyday pressure', image: img(
      'A single warm thread of light leading from a stressed student toward a calm listening adult nearby',
      'A student sits with shoulders slightly hunched; a single warm glowing thread of light extends from their chest across the room toward a calm, attentive adult figure sitting nearby, ready to listen.') },
  ],
  'when-the-alarm-wont-turn-off': [
    { match: 'Acute stress is a short burst with a clear end'.replace('Acute stress', '**Acute stress**'), image: img(
      'One weightlifter setting down a bar after a single clean lift, beside another straining to hold the same bar overhead for hours',
      'Two weightlifters side by side: the left one completes one clean overhead lift and calmly sets the bar down to rest; the right one strains, arms trembling, holding an identical bar aloft for what looks like hours, sweat visible.') },
    { match: 'Notice the verse doesn\'t offer a technique', image: img(
      'One well-tended potted plant beside a second wilting plant that gets no water or light',
      'Two small potted plants on a windowsill: the left one is upright and healthy with balanced sun and a full water dish; the right one droops, sitting in shadow with an empty, cracked water dish beside it.') },
  ],
  'breath-the-remote-control-part-2': [
    { match: 'The 4-4-6 Reset you built in the last chapter', image: img(
      'A single control dial with two marked settings, calm afternoon practice and sudden spike',
      'A single round control dial mounted on a simple panel, with two clearly marked positions on its face — one labelled with a gentle sun icon for calm practice, the other with a small lightning-bolt icon for a sudden spike — the pointer able to rest at either.') },
    { match: 'Use the full 4-4-6', image: img(
      'A small breathing reminder card being slipped into a school blazer pocket',
      'A hand tucks a small palm-sized card, printed with a simple breathing-wave icon, into the inner pocket of a folded school blazer resting on a chair, ready to be carried out the door.') },
  ],
  'sthitaprajna-the-steady-mind': [
    { match: 'Sthitaprajña means'.replace('Sthitaprajña means', '**Sthitaprajña** means'), image: img(
      'A rep counter ticking upward beside a small dumbbell, matched with the same steady boulder sitting unmoved as small waves pass',
      'A split drawing: left, a small tally counter clicking upward beside a single dumbbell mid-lift; right, a smooth boulder sitting unmoved in a gentle stream as small waves lap past it, with matching tally marks etched beneath both scenes.') },
    { match: 'Re-read the verse carefully', image: img(
      'The same boulder in a river under a rain cloud on one side and bright sun on the other',
      'The same smooth boulder sits in a calm river; above it, the sky is split — a dark rain cloud looms on the left, bright warm sunshine shines on the right — while the boulder itself stays exactly as still and steady under both.') },
  ],
  'design-your-calm-down-kit': [
    { match: 'Every tool in this chapter works better', image: img(
      'A fire extinguisher mounted calmly on the wall of an undamaged, cosy room',
      'A red fire extinguisher hangs mounted on a wall bracket in a warm, undamaged, cosy room, with a small calm signboard beside it — clearly prepared in advance, with no fire or danger anywhere in sight.') },
    { match: 'Notice the verse above isn\'t about a breathing technique', image: img(
      'A student and an older mentor sitting together on a bench in warm evening light',
      'A young student and a calm older mentor figure sit side by side on a park bench in warm golden evening light, the mentor gesturing gently mid-conversation while the student listens closely.') },
  ],
  'your-7-day-calm-challenge': [
    { match: 'Eight pages ago, stress was just something', image: img(
      'A small open toolbox holding a breathing-dial charm, a labelled thread spool, and a tiny boulder charm',
      'A small open wooden toolbox rests on a desk, holding three neat compartments: one with a tiny breathing-dial charm, one with a small labelled spool of thread, and one with a miniature smooth boulder charm — each a keepsake of one chapter tool.') },
    { match: 'One rep a day, seven days', image: img(
      'A hand gently replacing one toppled stone back onto a seven-stone calm cairn',
      'A seven-stone stacked cairn sits on a riverbank; one middle stone has gently toppled to the side, and a calm hand is placing it back onto the stack without fuss, the water flowing past undisturbed.') },
  ],
};

function transform(blocks, plan, slug) {
  let matched = 0;
  const used = new Set();
  const out = blocks.map((b) => {
    if (b.type !== 'text') return b;
    const hit = plan.find((p) => !used.has(p.match) && (b.markdown || '').includes(p.match));
    if (!hit) return b;
    used.add(hit.match);
    matched++;
    const fixedMarkdown = hit.fix ? b.markdown.replace(hit.fix.from, hit.fix.to) : b.markdown;
    return {
      id: uuidv4(), type: 'section', order: 0, layout: '50-50',
      columns: [[{ ...b, markdown: fixedMarkdown, order: 0 }], [hit.image]],
    };
  });
  if (matched !== plan.length) {
    const missing = plan.filter((p) => !used.has(p.match)).map((p) => p.match);
    throw new Error(`${slug}: matched ${matched}/${plan.length} — missing: ${missing.join(' | ')}`);
  }
  return out.map((b, i) => ({ ...b, order: i }));
}

async function main() {
  await bw.withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book ${BOOK_SLUG} not found`);
    for (const [slug, plan] of Object.entries(PLAN)) {
      const page = await db.collection('book_pages').findOne({ book_id: String(book._id), slug });
      if (!page) throw new Error(`page ${slug} not found in ${BOOK_SLUG}`);
      const newBlocks = transform(page.blocks, plan, slug);
      const res = await bw.savePage(db, { pageId: page._id }, newBlocks, {
        author: 'agent',
        summary: 'image-heavy layout: wrapped 2 concept text blocks into 50-50 text|image sections (closing gap found in self-review) + fixed "Nine pages"->"Ten pages" wording on page 1',
        dryRun: DRY,
      });
      if (DRY) {
        console.log(`[dry] ${slug}: wouldBlock=${res.wouldBlock} added=${res.diff.addedBlockIds.length} removed=${res.diff.removedBlockIds.length} rt ${res.diff.rtOld}→${res.diff.rtNew}min`);
      } else {
        console.log(`✓ ${slug}: v${res.version} snapshotted · +${res.diff.addedBlockIds.length} blocks · removed=${res.diff.removedBlockIds.length}`);
      }
    }
  });
  console.log(DRY ? '\n[dry] no writes performed.' : '\n✅ All 6 remaining pages converted to image-paired layout.');
}

main().catch((err) => { console.error('❌', err.message); process.exit(1); });
