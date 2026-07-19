'use strict';
// Fix (2026-07-10 audit): fill the genuine NCERT coverage gaps found in Ch3/Ch4.
// All additive — appends sentences to existing text/callouts, enriches one comparison_card,
// inserts one short text block. No block removed, no media touched.
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

// ── Text/callout appends: slug -> [{ match, append }] (append added to the block's markdown) ──
const APPENDS = {
  'air-pressure-and-winds': [
    { match: "It doesn't feel like it, but the air above you has",
      append: "\n\nThat force is surprisingly large — the whole atmosphere pressing down — yet you never feel crushed by it. Why not? Because the air pushes on your body **equally from every side**, and your body pushes back with its own **counter-pressure**, so the forces cancel out and you feel nothing at all." },
  ],
  'a-history-with-no-books': [
    { match: "one of India's greatest ancient civilisations is, in a sense, still trying to speak",
      append: " India's own *readable* writing came much later: the **Brahmi** script, used from around 400 BCE and famously carved into stone by Emperor **Ashoka** for his edicts — the point at which India's clearly readable historical record begins." },
  ],
  'the-human-family-tree': [
    { match: "the only human species left standing",
      append: " (The oldest inhabited lands — Africa, Asia and Europe — are together called the **Old World**, the cradle of these earliest human settlements.)" },
  ],
};

// ── comparison_card enrichment on cities-along-the-great-rivers ──
const NEW_COLUMNS = [
  { heading: 'Mesopotamia', color: '#818cf8', points: [
    'Rivers: the Euphrates and Tigris (West Asia — today mainly Iraq).',
    'A succession of city-states — the Sumerians, then the Akkadians, Assyrians and Babylonians — ruled from stepped temple-towers called ziggurats.',
    'Invented cuneiform (~3300 BCE), the world\'s first writing, and wrote the Epic of Gilgamesh — one of the oldest stories on Earth.',
    'Gave us the Code of Hammurabi (early written laws), the wheeled cart, and counting in 60s — our 60-minute hour and 360° circle.',
  ] },
  { heading: 'Egypt', color: '#fbbf24', points: [
    'River: the Nile, whose yearly flood left rich black soil (kemet).',
    'Ruled by pharaohs, who built pyramids as tombs and preserved bodies by mummification.',
    'Wrote in hieroglyphics — long unreadable, until the Rosetta Stone cracked the code in 1822.',
    'Kept records on papyrus, and worked out a 365-day calendar from the flooding of the Nile.',
  ] },
  { heading: 'China', color: '#34d399', points: [
    'Rivers: the Huang He (Yellow River) and the Yangtze.',
    'Ruled by dynasties — the Shang and Zhou (whose kings claimed a "mandate of heaven"), then the Qin, which gave "China" its name, and the Han.',
    'Its earliest records are "oracle bones" — animal bones and shells cracked by heat and read for the future.',
    'Famous for jade and bronze craft, the Great Wall, and silk — which later flowed west along the Silk Route.',
  ] },
];

// ── social-hierarchy text block inserted after the comparison_card on that page ──
const SOCIAL_BLOCK = {
  id: 'cities-along-the-great-rivers__cov_social',
  type: 'text',
  markdown:
    "**Who ruled, and who served?** Every one of these civilisations was sharply **layered into social classes**. In Egypt, society formed a pyramid: the **pharaoh** at the very top, then officials, nobles and priests, then free artisans and merchants, and at the base the labourers and enslaved people who did the heaviest work. Mesopotamia was much the same, with its priests and priestesses among the ruling class. Yet these societies could still surprise us — Egyptian women could own property and run businesses, and **Cleopatra**, trained to rule from childhood, became queen at just eighteen. The shape of society — who commands and who serves — is itself one of the things a civilisation invents.",
};

async function main() {
  await bw.withDb(async (db) => {
    // 1) text/callout appends
    for (const [slug, edits] of Object.entries(APPENDS)) {
      const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
      if (!page) throw new Error('page not found: ' + slug);
      let blocks = page.blocks;
      for (const e of edits) {
        const hits = blocks.filter((b) => (b.markdown || '').includes(e.match));
        if (hits.length !== 1) throw new Error(`[${slug}] match not unique (${hits.length}): "${e.match}"`);
        blocks = blocks.map((b) => (b === hits[0] ? { ...b, markdown: b.markdown + e.append } : b));
      }
      const res = await bw.savePage(db, { slug }, blocks, { author: 'agent', summary: 'Coverage gap fill (audit): appended missing NCERT detail.' });
      console.log(`✓ ${slug} — appended ${edits.length} coverage detail(s) (v${res.version || '?'})`);
    }

    // 2) enrich the comparison_card + insert the social-hierarchy block on the cities page
    {
      const slug = 'cities-along-the-great-rivers';
      const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
      const card = page.blocks.find((b) => b.type === 'comparison_card');
      if (!card) throw new Error('no comparison_card on ' + slug);
      const out = [];
      for (const b of page.blocks) {
        out.push(b === card ? { ...b, columns: NEW_COLUMNS } : b);
        if (b === card && !page.blocks.some((x) => x.id === SOCIAL_BLOCK.id)) out.push({ ...SOCIAL_BLOCK });
      }
      const reindexed = out.map((b, i) => ({ ...b, order: i }));
      const res = await bw.savePage(db, { slug }, reindexed, { author: 'agent', summary: 'Coverage gap fill (audit): named the 4 Mesopotamian civilisations + Gilgamesh + mandate of heaven in the comparison card, and added a social-hierarchy/Cleopatra block.' });
      console.log(`✓ ${slug} — comparison_card enriched + social-hierarchy block added (v${res.version || '?'}, ${reindexed.length} blocks)`);
    }
  });
}
main().catch((e) => { console.error(e); process.exit(1); });
