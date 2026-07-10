'use strict';
/**
 * Upgrade all Life Skills Focus image prompts from the "muted/soft/negative-space"
 * style (which produced dull, flat renders) to a richer style: strong warm-light /
 * deep-shadow contrast, vivid-but-earthy saturated fills, luminous highlights,
 * "never flat or washed-out", editorial storybook depth. House rules preserved
 * (deep charcoal bg, earthy palette, no neon/glow/orange/3D/photo). Founder
 * approved on the image-2 proof, 2026-07-04.
 *
 * Splits each prompt on the old style marker → keeps the unique SCENE, replaces
 * the STYLE, and re-appends the correct composition tail by aspect_ratio
 * (16:5 banner for heroes, 4:3 for side images). Prompt-text-only edit → no blocks
 * or assets removed → content-loss guard passes. Versioned + audited via book-writer.
 *
 * Run: node scripts/lifeskills_focus_richstyle.js [--dry]
 */
require('dotenv').config({ path: '.env.local' });
const bw = require('./lib/book-writer');

const BOOK_SLUG = 'life-skills-class-9';
const DRY = process.argv.includes('--dry');
const MARKER = 'Hand-drawn coloured illustration'; // start of the old style block

const NEW_STYLE =
  'Richly detailed hand-drawn coloured illustration, warm and full of life, in an ' +
  'expressive ink-and-gouache style with confident characterful linework and strong ' +
  'contrast between warm light and deep shadow. Deep charcoal dark background; a vivid ' +
  'yet earthy palette — sage green, clay red, ochre, mustard gold, dusty blue, warm ' +
  'cream — with luminous highlights and rich saturated fills, never flat, dull or ' +
  'washed-out. A clear warm focal light anchoring the scene. Editorial storybook ' +
  'atmosphere with real depth and texture. No neon, no digital sci-fi glow, no orange ' +
  'haze, no 3D render, no photographic realism.';

const TAIL_16_5 =
  ' Ultra-wide cinematic banner composition in a 16:5 ratio (much wider than it is tall, ' +
  'like a wide film still), the key subject centred with generous empty space to the left ' +
  'and right so nothing important is cropped when shown as a wide banner.';
const TAIL_4_3 = ' 4:3 composition, the subject clearly framed.';

function upgrade(prompt, ratio) {
  const i = prompt.indexOf(MARKER);
  if (i === -1) return null; // already upgraded or unexpected shape
  const scene = prompt.slice(0, i).trim();
  return `${scene} ${NEW_STYLE}${ratio === '16:5' ? TAIL_16_5 : TAIL_4_3}`;
}

async function main() {
  await bw.withDb(async (db) => {
    const book = await db.collection('books').findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book ${BOOK_SLUG} not found`);
    const pages = await db.collection('book_pages')
      .find({ book_id: String(book._id) }).sort({ page_number: 1 }).toArray();

    let total = 0;
    for (const page of pages) {
      let changed = 0;
      const mapImg = (b) => {
        if (b.type !== 'image' || typeof b.generation_prompt !== 'string') return b;
        const ratio = b.aspect_ratio === '16:5' ? '16:5' : '4:3';
        const np = upgrade(b.generation_prompt, ratio);
        if (!np) return b;
        changed++;
        return { ...b, generation_prompt: np };
      };
      const newBlocks = page.blocks.map((b) => {
        if (b.type === 'image') return mapImg(b);
        if (b.type === 'section' && Array.isArray(b.columns)) {
          return { ...b, columns: b.columns.map((col) => col.map(mapImg)) };
        }
        return b;
      });
      if (!changed) { console.log(`  – p${page.page_number} ${page.slug}: nothing to upgrade`); continue; }
      total += changed;
      const res = await bw.savePage(db, { pageId: page._id }, newBlocks, {
        author: 'agent',
        summary: `rich image style on ${changed} image prompt(s) (founder-approved)`,
        dryRun: DRY,
      });
      console.log(DRY
        ? `[dry] p${page.page_number} ${page.slug}: ${changed} prompt(s), wouldBlock=${res.wouldBlock} removed=${res.diff.removedBlockIds.length}`
        : `✓ p${page.page_number} ${page.slug}: v${res.version} · ${changed} prompt(s) upgraded`);
    }
    console.log(DRY ? `\n[dry] would upgrade ${total} prompts.` : `\n✅ Upgraded ${total} image prompts to the rich style.`);
  });
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
