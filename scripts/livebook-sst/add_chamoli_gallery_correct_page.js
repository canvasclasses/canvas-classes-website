'use strict';
// Founder correction (2026-07-08): "for chamoli disaster i had given u 3 images
// from my downloads folder, use those. chamoli 1,2, and 3"
//
// These are the SAME 3 founder-generated infographics ("2021 UTTARAKHAND
// FLOOD" overview, "DOWNSTREAM PATH" map, "DAMAGE & IMPACT" stats) already
// ingested earlier this session — but they were placed on the WRONG page
// (`glacial-landforms-and-moraines`, which only discusses Chamoli as a
// secondary hydropower-debate thread). The actual "Chamoli Disaster page" is
// `landforms-and-disasters`, whose real disaster case study centres on it.
// Reusing the SAME already-uploaded R2 URLs — no re-upload needed. Inserted
// right after the hero (before curiosity_prompt), mirroring the exact
// placement pattern already used (and accepted) on the other page. No
// aspect_ratio set — natural per-slide sizing (this session's renderer fix).
const bw = require('../lib/book-writer');
const { v4: uuid } = require('uuid');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

const OVERVIEW_URL = 'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/books/a60d142c-c96b-48cc-ba72-e68d71d83802/ch2/chamoli-overview-overview-468814bb-d7cf-4c34-bac9-9857fd04dda4.webp';
const PATH_URL = 'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/books/a60d142c-c96b-48cc-ba72-e68d71d83802/ch2/chamoli-overview-path-b27303bb-dcdb-403d-a846-83638d45ccba.webp';
const DAMAGE_URL = 'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/books/a60d142c-c96b-48cc-ba72-e68d71d83802/ch2/chamoli-overview-damage-a8700585-2f0f-45fb-9fcd-f7f8d7bc926f.webp';

async function main() {
  await bw.withDb(async (db) => {
    const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug: 'landforms-and-disasters' });
    const heroIdx = page.blocks.findIndex((b) => b.id === 'ff04e412-74b1-4853-88c9-30269ebd9397');
    if (heroIdx === -1) throw new Error('hero block not found');

    const galleryBlock = {
      id: uuid(),
      type: 'gallery',
      items: [
        {
          id: uuid(),
          src: OVERVIEW_URL,
          alt: '2021 Uttarakhand flood overview: 7 February 2021, Chamoli district, caused by a rock-ice avalanche from Ronti Peak',
          caption: 'The 2021 Chamoli disaster at a glance.',
        },
        {
          id: uuid(),
          src: PATH_URL,
          alt: "Map of the flood's downstream path from Ronti Peak through Rishiganga, Dhauliganga, Reni, Tapovan and Joshimath, via the Alaknanda river",
          caption: 'How the flood travelled downstream — avalanche to debris flood to flash flood.',
        },
        {
          id: uuid(),
          src: DAMAGE_URL,
          alt: "Damage and impact of the Chamoli disaster: over 200 killed or missing, the Tapovan Vishnugad hydropower project damaged, 13 villages' bridge access lost, ₹1,500 crore in losses",
          caption: 'The damage and impact.',
        },
      ],
    };

    const updated = [
      ...page.blocks.slice(0, heroIdx + 1),
      galleryBlock,
      ...page.blocks.slice(heroIdx + 1),
    ];

    const res = await bw.savePage(db, { slug: 'landforms-and-disasters' }, updated, {
      author: 'agent',
      summary: 'Added founder-provided 3-image Chamoli overview gallery (overview/downstream-path/damage-impact) right after the hero — corrects earlier misplacement on glacial-landforms-and-moraines; this is the actual "Chamoli Disaster page" the founder meant',
    });
    console.log(`✓ landforms-and-disasters — Chamoli overview gallery inserted (v${res.version}), page now ${updated.length} blocks`);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
