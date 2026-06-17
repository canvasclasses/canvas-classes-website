'use strict';
/**
 * Restores the "Classification of Matter — Pure Substances & Mixtures" section that
 * was hard-deleted from Class 11 Chem Ch.1 page `introduction-chemistry-matter` on
 * 2026-06-10. Re-links the founder's ORIGINAL recording (still in R2, never deleted)
 * and adds stoichiometric vs non-stoichiometric compounds (founder request).
 *
 * Built reference-first (Mittal §1.7) + the founder's screenshot of the original.
 * Writes via the sanctioned gateway scripts/lib/book-writer.js (adds content only →
 * content-loss guard passes). Run: node scripts/restore_ch1_mixtures_section.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const SLUG = 'introduction-chemistry-matter';
const VIDEO_SRC =
  'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/books/be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e/ch1/20ad8d18-3e66-4ba4-ae53-a9f1462173d3_Classification_of_Matter.mp4';

function sectionBlocks() {
  return [
    { id: uuidv4(), type: 'heading', level: 2, text: 'Classification of Matter — Pure Substances and Mixtures',
      objective: 'Sort any sample into element, compound, homogeneous or heterogeneous mixture, and tell them apart with the sampling test.' },

    { id: uuidv4(), type: 'text', markdown:
      "Every sample of matter is either a **pure substance** or a **mixture**, and that one split is the map for the whole subject.\n\n" +
      "A **pure substance** has a fixed composition and fixed properties. It comes in two kinds. An **element** cannot be broken into anything simpler by a chemical reaction — copper ($\\ce{Cu}$), gold ($\\ce{Au}$), oxygen ($\\ce{O2}$). A **compound** has two or more elements chemically bonded in a fixed ratio — water ($\\ce{H2O}$), common salt ($\\ce{NaCl}$), glucose ($\\ce{C6H12O6}$). You met both in the last section.\n\n" +
      "A **mixture** is two or more substances physically together, each keeping its own identity, in **no fixed ratio** — so it can be pulled apart by physical means. Mixtures split again by whether their composition is uniform:\n\n" +
      "- **Homogeneous mixture** — the same throughout; you cannot pick out the parts. Air and a salt solution are homogeneous.\n" +
      "- **Heterogeneous mixture** — the composition changes from place to place and the parts are distinguishable. Sand stirred into salt, or gravel, is heterogeneous." },

    { id: uuidv4(), type: 'image', width: 'full', src: '',
      alt: 'Classification of matter tree: Matter splits into Mixtures (homogeneous, heterogeneous) and Pure Substances (elements, compounds), with examples',
      caption: '📸 The map of matter — every sample lands in one of these four boxes',
      generation_prompt:
        "Classification-of-matter tree diagram. A top rounded box 'Matter' branches into two boxes 'Mixtures' and 'Pure Substances'. 'Mixtures' branches into 'Homogeneous Mixtures' (examples: air, salt solution) and 'Heterogeneous Mixtures' (examples: sand + salt, gravel). 'Pure Substances' branches into 'Elements' (examples shown as periodic-table tiles: Cu Copper, Au Gold, O Oxygen) and 'Compounds' (examples shown as ball-and-stick molecules: H2O, NaCl, glucose). Clean flowchart, rounded orange header boxes, white connector lines, small beakers under the mixture branches. Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style." },

    { id: uuidv4(), type: 'video', src: VIDEO_SRC, provider: 'r2_direct',
      caption: 'Classification of Matter', duration_sec: 0 },

    { id: uuidv4(), type: 'text', markdown:
      "**How do you tell homogeneous from heterogeneous?** Take small samples from different points and compare them.\n\n" +
      "Dissolve salt in water and you get a **brine solution**: scoop a sample from the top, the middle, the bottom — every sample is equally salty. Same composition everywhere, so it is **homogeneous**.\n\n" +
      "Stir sand or dirt into water instead. The top sample is nearly clear while the lower ones carry more grit, and it settles on standing. The samples differ, so it is **heterogeneous**." },

    { id: uuidv4(), type: 'heading', level: 3, text: 'Stoichiometric vs Non-Stoichiometric Compounds' },

    { id: uuidv4(), type: 'text', markdown:
      "Most compounds obey the **law of definite proportions** — their elements sit in one fixed, whole-number ratio by mass. Water is always $\\ce{H2O}$, never $\\ce{H2O_{1.1}}$. A compound like this is **stoichiometric**.\n\n" +
      "A few solids quietly break the rule. In a **non-stoichiometric** compound the ratio drifts slightly from the ideal formula because of defects in the crystal — missing atoms or extra ones. Iron(II) oxide is the classic case: written $\\ce{FeO}$, real samples are closer to $\\ce{Fe_{0.95}O}$ because some $\\ce{Fe^{2+}}$ sites are vacant and a few $\\ce{Fe^{3+}}$ ions keep the charge balanced. Cuprous oxide ($\\ce{Cu2O}$) and many high-temperature superconductors behave the same way. Their composition is genuinely variable, so a single clean formula only approximates them." },
  ];
}

bw.withDb(async (db) => {
  const page = await db.collection('book_pages').findOne({ slug: SLUG });
  if (!page) throw new Error(`${SLUG} not found`);

  // Idempotency guard.
  if ((page.blocks || []).some((b) => b.type === 'heading' && /Classification of Matter/.test(b.text || ''))) {
    console.log('⚠  Classification-of-Matter section already present — skipping (idempotent).');
    return;
  }

  const sorted = (page.blocks || []).slice().sort((a, b) => a.order - b.order);
  // Insert after the "Atoms, Molecules and Compounds" image (the block right after that h2).
  const atomsHeadingIdx = sorted.findIndex((b) => b.type === 'heading' && /Atoms, Molecules and Compounds/.test(b.text || ''));
  if (atomsHeadingIdx === -1) throw new Error('Could not find the "Atoms, Molecules and Compounds" heading to anchor after.');
  // anchor after the heading AND its following image (if present)
  let insertAt = atomsHeadingIdx + 1;
  if (sorted[insertAt] && sorted[insertAt].type === 'image') insertAt += 1;

  const merged = [
    ...sorted.slice(0, insertAt),
    ...sectionBlocks(),
    ...sorted.slice(insertAt),
  ].map((b, i) => ({ ...b, order: i }));

  // Preview, then apply via the protection gateway.
  const preview = await bw.savePage(db, { slug: SLUG }, merged, { dryRun: true });
  console.log(`DRY-RUN: ${sorted.length} → ${merged.length} blocks · lossDetected=${preview.diff.lossDetected} · added=${preview.diff.addedBlockIds.length}`);

  const res = await bw.savePage(db, { slug: SLUG }, merged,
    { author: 'agent', summary: 'restore deleted Classification-of-Matter section + re-link original video + add stoichiometric/non-stoichiometric' });
  console.log(`✓ saved. version snapshot #${res.version}. Page now ${merged.length} blocks.`);
  console.log(`✓ original video re-linked: ${VIDEO_SRC.split('/').pop()}`);
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
