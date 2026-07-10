'use strict';
/**
 * Life Skills — Class 9 · Focus module: convert concept text blocks to
 * image-paired 50-50 sections (text left, image right) per founder feedback
 * 2026-07-03 ("pages should be image heavy; text sections should have an
 * accompanying image on half — left text with right image").
 *
 * LOSSLESS: each targeted text block is moved verbatim (same block id) into
 * a new section's left column; a new placeholder image (src:'', styled
 * generation_prompt) becomes the right column. Nothing is removed, so the
 * book-writer content-loss guard passes without allowContentLoss.
 *
 * All writes go through scripts/lib/book-writer.js (versioned + audited).
 * Affected: 10 page docs (2 sections each → +20 image blocks, +20 sections).
 * Rollback: bw.restorePageVersion to the version printed per page.
 *
 * Run: node scripts/lifeskills_focus_split_layout.js [--dry]
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
// substring of their markdown), and the image that joins them.
const PLAN = {
  'your-attention-is-a-superpower': [
    { match: 'Marks, sports, music', image: img(
      'Many skill paths passing through a single gate of attention',
      'A young student stands before a single simple wooden gate; beyond it winding paths lead to a cricket bat, a guitar, an open maths book, a laptop and two waving friends — every path funnels back through that one gate.') },
    { match: 'Every real training programme', image: img(
      'A coach with a stopwatch timing a student at a starting line',
      'A sports coach kneels with a large stopwatch beside a chalk starting line as a young runner crouches ready; an empty track stretches ahead toward a small distant flag.') },
  ],
  'the-spotlight-in-your-head': [
    { match: 'not a bucket that holds everything', image: img(
      'One friend heard clearly inside a noisy mela crowd',
      'A crowded evening mela drawn as a sea of soft grey chattering silhouettes; in the middle one friend\'s face and speech bubble stand in warm full colour inside a gentle torch-beam cone.') },
    { match: 'Here is the encouraging part', image: img(
      'A hand steering a torch beam back onto an open book',
      'A hand calmly steers a torch beam back onto an open notebook; faint dotted arcs show where the beam had drifted — toward a window and a face-down phone — before returning.') },
  ],
  'why-reels-feel-impossible-to-stop': [
    { match: 'Nearly a century ago', image: img(
      'A pigeon pressing a lever for unpredictable food pellets',
      'A laboratory pigeon eagerly pecks a round button on a wooden box; three small panels above show the outcomes — nothing, nothing, a jackpot of pellets — with a small question mark over the chute.') },
    { match: 'Your feed is not a random collection', image: img(
      'A teenager in a tug of war against a team pulling their phone',
      'A tug-of-war: on the left one teenager grips a rope; on the right a long row of identical suited figures pulls the other end; the rope is tied around a giant smartphone standing in the middle.') },
  ],
  'the-multitasking-myth': [
    { match: 'For two *thinking* tasks', image: img(
      'A worker running between two desks, wearing a zig-zag trail into the floor',
      'One person mid-run between two desks — one with an open maths book, one with a chat screen — their zig-zag footprint trail worn deep into the floor, papers fluttering at every turn.') },
    { match: 'One quick reply = 5 seconds', image: img(
      'An evening timeline eaten away by small chat-bubble bites',
      'A long horizontal bar labelled with a sun at one end and a moon at the other; many small bites are missing along its length, each bite shaped like a tiny chat bubble, leaving less than half the bar.') },
  ],
  'dharana-the-original-attention-training': [
    { match: 'Around two thousand years ago', image: img(
      'An ancient palm-leaf manuscript beside a modern notebook with the same two lines',
      'An old palm-leaf manuscript bearing two short Sanskrit lines rests beside a modern spiral notebook where the same two lines are copied in pencil; a small earthen diya sits between them.') },
    { match: 'Think of a bicep curl', image: img(
      'A dumbbell curl compared with attention returning to a flame',
      'A split drawing: left, an arm mid-bicep-curl with a small dumbbell; right, a seated figure whose dotted attention-line loops away from a candle flame and returns; matching tally marks count the reps under both.') },
  ],
  'breath-the-remote-control': [
    { match: 'Your body has an automatic alarm system', image: img(
      'A panel of sealed dials with one reachable breath dial under a calm hand',
      'A wall control panel with sealed glass-covered dials labelled with a small heart, a sweat drop and a stomach; one large unsealed dial marked with a wave sits at hand height, a calm hand resting on it.') },
    { match: 'The practice below uses a simple rhythm', image: img(
      'The 4-4-6 breathing wave: rise four, hold four, fall six',
      'A single elegant breathing curve on soft graph paper: a gentle rising slope marked 4, a flat plateau marked 4, and a long slow descending slope marked 6, the pattern repeating faintly behind.') },
  ],
  'design-your-environment': [
    { match: 'Psychologists ran a now-famous experiment', image: img(
      'Attention threads leaking from a student toward every object on a desk',
      'A student reading at a desk; thin dotted threads leak from their head toward a face-down phone, a poster, a window and a snack packet — each thread thin but visibly tugging.') },
    { match: 'The tradition understood this', image: img(
      'One step to the book, five steps up to the phone',
      'Two staircases from a study chair: a single low step leads to an open textbook; a tall five-step staircase climbs to a phone resting on a high shelf. The student sits nearer the book.') },
  ],
  'the-25-minute-sprint': [
    { match: 'Attention is a sprinter', image: img(
      'A runner on a short track marked 25, a calm water break waiting past the end',
      'A short running track with a bold 25 marker at its end and a runner in easy full stride; just past the finish wait a bench, a water bottle and an open window — no crowd, no medals, calm.') },
    { match: 'Two enemies will attack mid-sprint', image: img(
      'Stray thoughts landing as paper birds on a parking list',
      'A calm desk mid-work; three small paper birds shaped like thought bubbles land on a scrap page pinned at the desk corner, each folding itself into a neat three-word line on the list.') },
  ],
  'sleep-the-night-shift-of-memory': [
    { match: 'During the day, everything you learn', image: img(
      'A rough day-notebook being filed into a permanent ledger at night',
      'Under moonlight, a scruffy rough-work notebook with loose pages sits beside a thick bound ledger; a tiny night-shift librarian on a ladder carries pages from the rough notebook into the ledger.') },
    { match: 'Now stack yesterday', image: img(
      'A phone-faced thief carrying away a pillow and a page of study notes',
      'A small cartoon thief whose head is a dark smartphone tiptoes off with two sacks — one shaped like a pillow, one stuffed with handwritten study pages — under a crescent moon.') },
  ],
  'your-7-day-focus-challenge': [
    { match: 'Nine pages ago, attention was something', image: img(
      'An open toolbox holding the eight focus tools from the chapter',
      'An open wooden toolbox on a desk; inside, small tools each in its slot: a torch, a snapped slot-machine lever, a railway signal, a diya flame, a breathing wave, a tiny staircase, a sand timer and a crescent moon.') },
    { match: 'One rep a day, seven days', image: img(
      'A seven-box tracker with ticks and a kind restart arrow over a missed day',
      'A hand-drawn strip of seven calendar boxes; the first boxes hold confident tick marks, one middle box sits empty with a small kind arrow looping from it into the next box, where the ticks calmly continue.') },
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
    return {
      id: uuidv4(), type: 'section', order: 0, layout: '50-50',
      columns: [[{ ...b, order: 0 }], [hit.image]],
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
        summary: 'image-heavy layout: wrapped 2 concept text blocks into 50-50 text|image sections (founder feedback 2026-07-03)',
        dryRun: DRY,
      });
      if (DRY) {
        console.log(`[dry] ${slug}: wouldBlock=${res.wouldBlock} added=${res.diff.addedBlockIds.length} removed=${res.diff.removedBlockIds.length} rt ${res.diff.rtOld}→${res.diff.rtNew}min`);
      } else {
        console.log(`✓ ${slug}: v${res.version} snapshotted · +${res.diff.addedBlockIds.length} blocks · removed=${res.diff.removedBlockIds.length}`);
      }
    }
  });
  console.log(DRY ? '\n[dry] no writes performed.' : '\n✅ All 10 pages converted to image-paired layout.');
}

main().catch((err) => { console.error('❌', err.message); process.exit(1); });
