'use strict';
/**
 * Round-3 refinements to Chapter 4 based on the teacher's notes (batches 2+3):
 *
 *  1. p4 — Restore Mars Climate Orbiter as the block-0 fun_fact, and remove
 *     the duplicated Mars Orbiter image block that sits inside the SI section.
 *  2. p6 — Insert "Dalton's Atomic Theory" section at the top (before
 *     "Atomic Mass") with the six postulates + Dalton quote + note about
 *     postulates that are now known to be incorrect.
 *  3. p6 — Add a "brief history of the standard" paragraph between the
 *     Atomic Mass heading and the current C-12 text (H = 1 → O = 16 → C-12).
 *  4. p6 — Add a NaCl crystal-lattice placeholder image after the Formula
 *     Mass discussion. No generation_prompt — user will upload their own.
 *  5. p7 — Insert "Why we measure some things by mass, and others by
 *     counting" — the apples/bananas/grains/potatoes analogy — as a new
 *     text block between the current fun_fact and the mole definition.
 *  6. p7 — Add a "How big is Avogadro's number, really?" `note` callout
 *     after the mole definition with the oceans/age-of-Earth/population
 *     scale visualizations.
 *
 * Writes directly to MongoDB. All tasks idempotency-guarded.
 * Run: node scripts/refine_ch1_dalton_and_mole.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// ─── Helpers ────────────────────────────────────────────────────────────────

function flattenBlocks(arr) {
  const out = [];
  for (const b of arr) {
    if (b.type === 'section' && Array.isArray(b.columns)) {
      for (const col of b.columns) out.push(...col);
    } else out.push(b);
  }
  return out;
}
function computeReadingTime(arr) {
  const flat = flattenBlocks(arr);
  let w = 0, v = 0, a = 0;
  for (const b of flat) {
    if (b.type === 'text') w += (b.markdown || '').split(/\s+/).length;
    else if (b.type === 'heading') w += (b.text || '').split(/\s+/).length;
    else if (b.type === 'callout') w += (b.markdown || '').split(/\s+/).length;
    else if (b.type === 'video') v++;
    else if (b.type === 'audio_note') a++;
  }
  return Math.max(1, Math.ceil(w / 200) + v * 2 + a);
}
const INTERACTIVE = new Set([
  'inline_quiz', 'simulation', 'video', 'molecule_3d', 'interactive_image',
  'classify_exercise', 'reasoning_prompt', 'worked_example', 'practice_link',
]);
function computeContentTypes(arr) {
  const flat = flattenBlocks(arr);
  const found = new Set();
  for (const b of flat) if (INTERACTIVE.has(b.type)) found.add(b.type);
  return [...found].sort();
}
function renumber(blocks) {
  return blocks.slice().sort((a, b) => a.order - b.order).map((b, i) => ({ ...b, order: i }));
}
async function savePage(pages, page, newBlocks) {
  await pages.updateOne(
    { _id: page._id },
    {
      $set: {
        blocks: newBlocks,
        reading_time_min: computeReadingTime(newBlocks),
        content_types: computeContentTypes(newBlocks),
        updated_at: new Date(),
      },
    }
  );
}

// ─── Block content (factories so we don't reuse uuids across tasks) ─────────

function marsOrbiterCallout(existingId) {
  return {
    id: existingId || uuidv4(),
    type: 'callout',
    order: 0,
    variant: 'fun_fact',
    title: 'A $327 Million Crash Caused by Mixing Units',
    markdown:
      "On **September 23, 1999**, NASA’s **Mars Climate Orbiter** — a $327 million spacecraft — slammed into the Martian atmosphere instead of slipping into orbit around the planet. The craft burned up. The mission was lost.\n\nThe post-mortem found one cause, almost embarrassing in its simplicity: **two engineering teams had been using different units**. Lockheed Martin’s team had calculated thruster forces in **pound-seconds** (US customary). NASA’s navigation software read those numbers as **newton-seconds** (SI). The mismatch was never caught.\n\nA factor-of-4.45 error in the most boring of details — a unit suffix — was enough to push a spacecraft into a planet.\n\n**Lesson for everything that follows in this chapter: a number without a unit is not a measurement. It’s just noise.**",
  };
}

const daltonSection = () => [
  {
    id: uuidv4(),
    type: 'heading',
    text: 'Dalton’s Atomic Theory',
    level: 2,
  },
  {
    id: uuidv4(),
    type: 'text',
    markdown:
      "Before Dalton, the **laws of chemical combination** had been worked out by carefully weighing reactants and products. But no one had explained *why* matter behaved this way. In **1808**, **John Dalton** put forward a theory that did. He proposed that everything around us is built from tiny, indivisible particles he called **atoms** — and that the laws of chemical combination follow as direct consequences.\n\nHis theory had six core postulates:\n\n1. **All matter is made up of small indivisible particles called atoms.**\n2. **Atoms of a given element are identical** in size, mass, and other properties.\n3. **Atoms of different elements have different properties.**\n4. **Atoms cannot be created, divided, or destroyed** in chemical reactions.\n5. **Atoms combine in whole-number ratios** to form chemical compounds.\n6. In chemical reactions, **atoms are simply rearranged** to form new compounds.\n\nIn Dalton’s own words:\n\n> *“Matter, though divisible in an extreme degree, is nevertheless not infinitely divisible. That is, there must be some point beyond which we cannot go in the division of matter. I have chosen the word ‘atom’ to signify these ultimate particles.”*\n>\n> — John Dalton\n\n**Important — some of these postulates are now known to be incorrect.** Atoms *can* be divided (into protons, neutrons, and electrons), and atoms of the same element can have *different* masses (isotopes — like $\\ce{^{12}C}$ and $\\ce{^{14}C}$). But Dalton’s overall framework — matter is particulate, chemical reactions are just rearrangements of these particles, and they combine in fixed ratios — remains the foundation of modern chemistry.",
  },
];

const atomicMassHistoryBlock = () => ({
  id: uuidv4(),
  type: 'text',
  markdown:
    "**A brief history of the standard.** Atoms are far too small to weigh directly — a single carbon atom has a mass of about $1.99 \\times 10^{-23}$ g. So in the 19th century, scientists measured atomic masses *relative to a fixed reference element*.\n\n- **Dalton** chose **hydrogen ($\\ce{H} = 1$)** as the original standard — the lightest element.\n- Later, **oxygen ($\\ce{O} = 16$)** replaced hydrogen as the reference, because oxygen forms compounds with almost every other element and was easier to measure against.\n- **Since 1961**, the international standard has been **carbon-12 ($\\ce{^{12}C} = 12$ exactly)**, chosen because it works cleanly with the mass spectrometer.\n\nToday we use mass spectrometry to measure atomic masses directly, but the *relative* scale built on $\\ce{^{12}C}$ is still the one in every periodic table.",
});

const naClLatticeImage = () => ({
  id: uuidv4(),
  type: 'image',
  src: '', // user will upload — no AI generation_prompt per their request
  alt: 'Cubic crystal lattice of sodium chloride showing Na+ cations and Cl- anions arranged in a 3D pattern',
  caption: '📸 NaCl crystal lattice — sodium and chloride ions arranged in a repeating 3D pattern, not as discrete molecules',
  width: 'full',
});

const massNumberAnalogyBlock = () => ({
  id: uuidv4(),
  type: 'text',
  markdown:
    "**Why we measure some things by mass, and others by counting.**\n\nStop and notice how we measure quantities in everyday life. Some things we *weigh*. Some things we *count*. The choice isn’t random — it depends on the object.\n\n- **Apples** vary in size and weight, so we measure them by **mass**: *one kilo of apples*, not “ten apples.”\n- **Bananas** also vary in size, but they’re easy to grab and count. So we measure them by **number**: *a dozen bananas*.\n- **Grains of rice or wheat** are nearly identical in size — but there are *thousands* in a single fistful. Counting is hopeless. So we measure them by **mass**: *one kilo of rice*.\n- **Potatoes** — count, like apples. *Five potatoes*.\n\nThe pattern: if there are too many to count, *or* sizes vary, we weigh. If we can grab and count, we count.\n\n**In a chemistry lab, you face the same dilemma — but at an extreme.** When two substances react, they react one atom at a time. So you want to know **how many** atoms or molecules of each substance you have. But there are billions of trillions of atoms in even a single grain of salt. Counting them is impossible.\n\nThe **mole** is the unit chemists invented to solve exactly this problem. It lets you **count by weighing** — you measure mass on a scale, and instantly know how many particles you’re holding.",
});

const avogadroScaleCallout = () => ({
  id: uuidv4(),
  type: 'callout',
  variant: 'note',
  title: 'How big is Avogadro’s number, really?',
  markdown:
    "602,200,000,000,000,000,000,000. Twenty-three zeros. It’s hard to grasp how big that is — so here are three known-large quantities for scale:\n\n- The **age of Earth in seconds** ($\\approx 4.5 \\times 10^9$ years $\\times\\, 3.15 \\times 10^7$ s/year) is about $1.4 \\times 10^{17}$. **Avogadro’s number is still about 4 million times larger.**\n- The **total amount of water in all the world’s oceans (in litres)** is roughly $1.3 \\times 10^{21}$. **Avogadro’s number is around 500 times larger than that.**\n- The **population of Earth** ($\\approx 8 \\times 10^9$) doesn’t even come close — $N_A$ is over $10^{13}$ times larger.\n\nThat’s how many atoms sit in a 12-gram lump of carbon. **Every gram of every solid object you’ve ever touched contains a number on this scale.**",
});

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const pages = db.collection('book_pages');

    // ━━━ TASK 1 — p4: Mars Orbiter to block 0, delete duplicate image
    console.log('━━━ Task 1: Mars Orbiter to p4 block 0; delete duplicate image ━━━');
    {
      const slug = 'properties-measurement-si-units';
      const page = await pages.findOne({ slug });
      if (!page) {
        console.log(`⚠  "${slug}" not found. Skipping.`);
      } else {
        const block0 = page.blocks.find((b) => b.order === 0);
        const block0HasMars =
          block0 && block0.type === 'callout' &&
          ((block0.title || '').toLowerCase().includes('mars') ||
           (block0.markdown || '').toLowerCase().includes('mars climate orbiter'));

        // Find any Mars-Orbiter-themed image blocks elsewhere on the page
        const marsImageBlocks = page.blocks.filter((b) =>
          b.type === 'image' &&
          (((b.alt || '').toLowerCase().includes('mars orbiter')) ||
           ((b.alt || '').toLowerCase().includes('nasa mars')) ||
           ((b.caption || '').toLowerCase().includes('mars climate')))
        );

        if (block0HasMars && marsImageBlocks.length === 0) {
          console.log('⚠  Mars Orbiter already at block 0 and no duplicate image. Skipping.');
        } else {
          // Build new block list:
          //   - block 0 gets replaced with the Mars Orbiter callout (preserving the
          //     existing block id so any external refs still resolve)
          //   - any Mars-themed image blocks are removed
          const replaced = page.blocks
            .filter((b) => !marsImageBlocks.includes(b))
            .map((b) => b.order === 0 ? marsOrbiterCallout(b.id) : b);

          const final = renumber(replaced);

          console.log(`  Block 0 (old): [${block0?.variant}] "${block0?.title || ''}"`);
          console.log(`  Block 0 (new): [fun_fact] "A $327 Million Crash Caused by Mixing Units"`);
          if (marsImageBlocks.length > 0) {
            for (const b of marsImageBlocks) {
              console.log(`  Removed duplicate image at order ${b.order}: alt="${(b.alt || '').slice(0, 60)}"`);
            }
          }
          console.log(`  ${page.blocks.length} blocks → ${final.length} blocks`);
          await savePage(pages, page, final);
          console.log('  ✓ done');
        }
      }
    }

    // ━━━ TASK 2 — p6: Dalton's Atomic Theory section + Atomic Mass history
    console.log('\n━━━ Task 2: Dalton’s Atomic Theory + atomic-mass history on p6 ━━━');
    {
      const slug = 'atomic-molecular-mass';
      const page = await pages.findOne({ slug });
      if (!page) {
        console.log(`⚠  "${slug}" not found. Skipping.`);
      } else {
        const alreadyHasDalton = page.blocks.some(
          (b) => b.type === 'heading' && b.text === 'Dalton’s Atomic Theory'
        );
        const alreadyHasHistory = page.blocks.some(
          (b) => b.type === 'text' && (b.markdown || '').includes('A brief history of the standard.')
        );

        if (alreadyHasDalton && alreadyHasHistory) {
          console.log('⚠  Dalton section + history paragraph already present. Skipping.');
        } else {
          // Find current "Atomic Mass" heading — this is where we'll insert
          const atomicMassIdx = page.blocks.findIndex(
            (b) => b.type === 'heading' && b.text === 'Atomic Mass'
          );
          if (atomicMassIdx === -1) {
            throw new Error('Could not locate "Atomic Mass" heading on p6');
          }

          // Build new blocks:
          //   - Everything up to and including the existing fun_fact (block 0)
          //   - NEW Dalton section (heading + text)  [if not present]
          //   - The existing "Atomic Mass" heading
          //   - NEW history paragraph [if not present]
          //   - Everything after that
          const beforeAtomicMass = page.blocks.slice(0, atomicMassIdx);
          const atomicMassHeading = page.blocks[atomicMassIdx];
          const afterAtomicMass = page.blocks.slice(atomicMassIdx + 1);

          const merged = [
            ...beforeAtomicMass,
            ...(alreadyHasDalton ? [] : daltonSection()),
            atomicMassHeading,
            ...(alreadyHasHistory ? [] : [atomicMassHistoryBlock()]),
            ...afterAtomicMass,
          ].map((b, i) => ({ ...b, order: i }));

          // Also add NaCl crystal lattice placeholder after the Formula Mass text
          const fmTextIdx = merged.findIndex(
            (b) => b.type === 'text' && (b.markdown || '').includes('Formula mass') &&
                   (b.markdown || '').includes('NaCl')
          );
          const alreadyHasNaCl = merged.some(
            (b) => b.type === 'image' && (b.alt || '').toLowerCase().includes('sodium chloride')
          );

          let withNaCl = merged;
          if (fmTextIdx !== -1 && !alreadyHasNaCl) {
            const before = merged.slice(0, fmTextIdx + 1);
            const after = merged.slice(fmTextIdx + 1);
            withNaCl = [...before, naClLatticeImage(), ...after].map((b, i) => ({ ...b, order: i }));
            console.log(`  + Inserted NaCl crystal-lattice placeholder after Formula Mass text (order ${fmTextIdx + 1})`);
          } else if (alreadyHasNaCl) {
            console.log('  • NaCl image already present — skipping that insertion');
          } else {
            console.log('  ⚠  Couldn’t locate Formula Mass text block — skipping NaCl image');
          }

          if (!alreadyHasDalton) {
            console.log('  + Inserted Dalton’s Atomic Theory section (heading + text)');
          }
          if (!alreadyHasHistory) {
            console.log('  + Inserted "A brief history of the standard" paragraph');
          }
          console.log(`  ${page.blocks.length} blocks → ${withNaCl.length} blocks`);
          await savePage(pages, page, withNaCl);
          console.log('  ✓ done');
        }
      }
    }

    // ━━━ TASK 3 — p7: Mass/Number analogy + Avogadro scale callout
    console.log('\n━━━ Task 3: Mass/Number analogy + Avogadro’s number scale on p7 ━━━');
    {
      const slug = 'mole-concept';
      const page = await pages.findOne({ slug });
      if (!page) {
        console.log(`⚠  "${slug}" not found. Skipping.`);
      } else {
        const alreadyHasAnalogy = page.blocks.some(
          (b) => b.type === 'text' && (b.markdown || '').includes('Why we measure some things by mass')
        );
        const alreadyHasScale = page.blocks.some(
          (b) => b.type === 'callout' && (b.title || '').includes('How big is Avogadro')
        );

        if (alreadyHasAnalogy && alreadyHasScale) {
          console.log('⚠  Mass/Number analogy + Avogadro scale callout already present. Skipping.');
        } else {
          // Find the existing fun_fact (block 0) — analogy goes right after it
          const funFactIdx = page.blocks.findIndex((b) => b.type === 'callout' && b.order === 0);
          if (funFactIdx === -1) {
            throw new Error('Could not locate block-0 fun_fact on p7');
          }

          // Find the mole definition text block — Avogadro scale callout goes after it
          const moleDefTextIdx = page.blocks.findIndex(
            (b) => b.type === 'text' &&
                   (b.markdown || '').includes('Avogadro') &&
                   (b.markdown || '').includes('6.022')
          );
          if (moleDefTextIdx === -1) {
            throw new Error('Could not locate mole-definition text on p7');
          }

          // Build the new block list by walking through and inserting
          const out = [];
          for (let i = 0; i < page.blocks.length; i++) {
            out.push(page.blocks[i]);
            if (i === funFactIdx && !alreadyHasAnalogy) {
              out.push(massNumberAnalogyBlock());
              console.log('  + Inserted Mass/Number analogy after block-0 fun_fact');
            }
            if (i === moleDefTextIdx && !alreadyHasScale) {
              out.push(avogadroScaleCallout());
              console.log('  + Inserted "How big is Avogadro’s number, really?" callout after the definition');
            }
          }

          const final = renumber(out);
          console.log(`  ${page.blocks.length} blocks → ${final.length} blocks`);
          await savePage(pages, page, final);
          console.log('  ✓ done');
        }
      }
    }

    // ━━━ Final layout
    console.log('\n━━━ Final layouts ━━━');
    for (const slug of [
      'properties-measurement-si-units',
      'atomic-molecular-mass',
      'mole-concept',
    ]) {
      const p = await pages.findOne({ slug });
      if (!p) continue;
      console.log(`\n[${slug}]  "${p.title}"  ·  ${p.blocks?.length} blocks  ·  ${p.reading_time_min}min`);
      for (const b of (p.blocks || []).sort((a, c) => a.order - c.order)) {
        let s = '';
        if (b.type === 'heading') s = `(h${b.level}) ${b.text}`;
        else if (b.type === 'callout') s = `[${b.variant}] ${b.title || ''}`;
        else if (b.type === 'text') s = `"${(b.markdown || '').slice(0, 60).replace(/\n/g, ' ')}…"`;
        else if (b.type === 'image') s = `alt="${(b.alt || '').slice(0, 55)}…"`;
        else if (b.type === 'comparison_card') s = `"${b.title || ''}"`;
        else if (b.type === 'table') s = `"${b.caption || ''}"`;
        else if (b.type === 'latex_block') s = `${b.label || ''}`;
        else if (b.type === 'worked_example') s = `"${b.label || ''}"`;
        else if (b.type === 'inline_quiz') s = `${b.questions?.length || 0} Qs`;
        console.log(`  ${String(b.order).padEnd(3)} ${b.type.padEnd(18)} ${s}`);
      }
    }
    console.log('\n✓ Done.');
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
