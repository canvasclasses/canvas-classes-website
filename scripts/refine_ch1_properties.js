'use strict';
/**
 * Two refinements to Chapter 4:
 *
 *  1. Remove the duplicate Kanada `fun_fact` at the top of p3
 *     ("introduction-chemistry-matter" / "Nature of Matter & Classification").
 *     Now redundant with p1.
 *
 *  2. Expand the Physical/Chemical/Intensive Properties section in p4
 *     ("properties-measurement-si-units"). Currently only a heading + a
 *     2-column comparison card. Replaces that with:
 *        - h3 Physical Properties + full prose + ice-cube image
 *        - h3 Chemical Properties + full prose + rusting-iron image
 *        - the existing comparison_card (kept as a summary recap)
 *        - h2 Intensive vs Extensive Properties + full prose with the
 *          gold-vs-pyrite example (NEW — currently missing entirely)
 *
 * Writes directly to MongoDB. Idempotency-guarded — re-runs are safe.
 * Run: node scripts/refine_ch1_properties.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const NOM_SLUG = 'introduction-chemistry-matter';
const MEASUREMENT_SLUG = 'properties-measurement-si-units';

// ─── Helpers (inline ports of @canvas/data/books/utils) ─────────────────────

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
// Re-number every block's `order` field starting at 0 (used after splice
// operations to keep ordering contiguous).
function renumber(blocks) {
  return blocks
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((b, i) => ({ ...b, order: i }));
}

// ─── New blocks for the Properties expansion ────────────────────────────────

function makePropertiesBlocks(existingComparisonCard) {
  return [
    // h3 — Physical Properties
    { id: uuidv4(), type: 'heading', text: 'Physical Properties', level: 3 },

    // text — Physical Properties full explanation (user's voice)
    {
      id: uuidv4(),
      type: 'text',
      markdown:
        "A **physical property** is something you can observe about a substance **without changing what it is chemically.** Colour, melting point, boiling point, density, solubility, pressure, volume — these are all physical properties.\n\nWhen you observe these, the substance doesn’t become something else. Hold a copper wire under different lights and you see the same orange-brown gleam each time. Heat water in a kettle until it boils, then cool it all the way back to ice — at every point along the journey, it is still $\\ce{H2O}$. The **physical state** changes from solid to liquid to gas, but the **chemical identity** stays put.\n\n**Melting an ice cube is the classic example.** The cube goes from a rigid crystal lattice (solid) to a flowing mass of molecules (liquid), but every single molecule in the puddle on your table is the same $\\ce{H2O}$ it was inside the freezer. The change is physical — the chemistry is unchanged.",
    },

    // image — ice cube + molecular arrangement
    {
      id: uuidv4(),
      type: 'image',
      src: '',
      alt: 'An ice cube partially melted with two inset diagrams showing the rigid hexagonal lattice of water molecules in ice and the loosely-packed disordered molecules in liquid water',
      caption: '📸 Same molecule, different arrangement — melting is a physical change',
      width: 'full',
      generation_prompt:
        'Clean technical illustration of an ice cube partially melted on a flat surface, with a puddle of water around its base. Two callout insets connected by leader lines show the molecular structure: one inset (labelled "Solid: rigid lattice") shows H2O molecules arranged in a tightly-ordered hexagonal crystal lattice; the other inset (labelled "Liquid: disordered") shows the same H2O molecules loosely arranged with random positions. H2O molecules drawn with a single red oxygen atom and two smaller white hydrogen atoms in the bent shape. Dark background, orange accent labels and leader lines, clean technical illustration style.',
    },

    // h3 — Chemical Properties
    { id: uuidv4(), type: 'heading', text: 'Chemical Properties', level: 3 },

    // text — Chemical Properties full explanation
    {
      id: uuidv4(),
      type: 'text',
      markdown:
        "A **chemical property** describes a chemical change — a reaction — that a substance can undergo. The instant you observe a chemical property, the substance has *become something different*.\n\nTake acidity. To check whether a substance is acidic, you have to see whether it reacts with a base, releases $\\ce{H+}$ ions in water, or accepts a pair of electrons. Each of those tests **changes the chemical composition** of the substance. The act of observation *is* the act of transformation.\n\nOther chemical properties include **basicity, flammability, toxicity, heat of combustion, pH value, rate of radioactive decay,** and **chemical stability**. Every one of them tells you what a substance turns *into* under specific conditions.\n\n**Rusting of iron is the textbook example.** When iron is left exposed to moist air, it reacts with oxygen and water to form a hydrated iron oxide — what we call rust ($\\ce{Fe2O3 \\cdot nH2O}$). The substance you started with (shiny, malleable iron) is now genuinely a different substance (brittle, orange-brown oxide). That’s chemistry, not physics.",
    },

    // image — rusting iron
    {
      id: uuidv4(),
      type: 'image',
      src: '',
      alt: 'Close-up photograph of a rusted iron bolt with corrosion visible across the threads',
      caption: '📸 The orange-brown crust is no longer iron — it’s a new compound, iron oxide',
      width: 'full',
      generation_prompt:
        'Photorealistic editorial close-up of a heavily rusted iron bolt and nut against a near-black background. Orange-brown rust covers the threads with patches of underlying metallic iron showing through. Dramatic side lighting with warm amber rim light and deep shadows. Shallow depth of field, crisp focus on the corroded surface texture. Editorial photography style. No labels, no text overlay.',
    },

    // existing comparison_card (kept as a quick-summary recap)
    existingComparisonCard,

    // h2 — Intensive vs Extensive (NEW SECTION — currently missing from p4)
    { id: uuidv4(), type: 'heading', text: 'Intensive vs Extensive Properties', level: 2 },

    // text — intensive vs extensive + gold-vs-pyrite (user's iconic example)
    {
      id: uuidv4(),
      type: 'text',
      markdown:
        "There’s another way to slice up properties — and this one matters every time you do a calculation in a lab.\n\nA property is either **intensive** or **extensive**, depending on whether it changes when you change the *amount* of substance.\n\n**Intensive properties don’t depend on how much you have.** Take a 1-gram gold ring and a 100-gram gold biscuit. They have wildly different masses and volumes, but both gleam the same characteristic yellow, both melt at exactly $1064\\,°\\text{C}$, and both boil at exactly $2856\\,°\\text{C}$. **Colour, melting point, boiling point, density, refractive index, viscosity, pressure, temperature** — all intensive. Sample size doesn’t move them.\n\n**Extensive properties scale with the amount.** Double the sample, double the value. **Mass, volume, energy, total moles, heat capacity, length** — all extensive.\n\n**Why this matters: identification.** Because intensive properties stay fixed no matter the sample size, they are exactly what we use to *identify* a substance. Gold miners used this principle to separate real gold from **fool’s gold** — the mineral **pyrite** ($\\ce{FeS2}$).\n\nThe two look almost identical: same yellow metallic shine, similar density to the eye. But hold either one in a flame, and the truth comes out immediately. Gold sits there, unchanged. **Pyrite sputters, smokes, and releases foul-smelling sulphur dioxide** ($\\ce{SO2}$) as the iron sulphide reacts with atmospheric oxygen. The chemical property — reactivity with $\\ce{O2}$ at flame temperature — is intensive. It doesn’t matter whether you tested a gram or a kilogram; the answer is the same.\n\nThat’s the deeper lesson: **intensive properties are nature’s fingerprints. Extensive properties are just bookkeeping.**",
    },
  ];
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const pages = db.collection('book_pages');

    // ───────────────────────────────────────────────────────────────
    // TASK 1 — Remove duplicate Kanada fun_fact from p3 (Nature of Matter)
    // ───────────────────────────────────────────────────────────────
    console.log('━━━ Task 1: Remove duplicate Kanada fun_fact from p3 ━━━');
    const nomPage = await pages.findOne({ slug: NOM_SLUG });
    if (!nomPage) {
      console.log(`⚠  "${NOM_SLUG}" not found — skipping.`);
    } else {
      const block0 = (nomPage.blocks || []).find((b) => b.order === 0);
      const isKanada =
        block0 &&
        block0.type === 'callout' &&
        typeof block0.title === 'string' &&
        block0.title.toLowerCase().includes('kanda');

      if (!block0) {
        console.log('⚠  No block 0 found. Skipping.');
      } else if (!isKanada) {
        console.log(`⚠  Block 0 isn’t the Kanada fun_fact (title="${block0.title}"). Skipping to be safe.`);
      } else {
        const remaining = (nomPage.blocks || [])
          .filter((b) => b.order !== 0)
          .map((b) => ({ ...b, order: b.order - 1 }));
        const renumbered = renumber(remaining);

        console.log(`→ Removing block 0: [${block0.variant}] "${block0.title}"`);
        console.log(`  ${nomPage.blocks.length} blocks → ${renumbered.length} blocks (shifted)`);

        await pages.updateOne(
          { _id: nomPage._id },
          {
            $set: {
              blocks: renumbered,
              reading_time_min: computeReadingTime(renumbered),
              content_types: computeContentTypes(renumbered),
              updated_at: new Date(),
            },
          }
        );
        console.log('  ✓ removed');
      }
    }

    // ───────────────────────────────────────────────────────────────
    // TASK 2 — Expand Properties section on p4
    // ───────────────────────────────────────────────────────────────
    console.log('\n━━━ Task 2: Expand Properties section on p4 ━━━');
    const measPage = await pages.findOne({ slug: MEASUREMENT_SLUG });
    if (!measPage) {
      console.log(`⚠  "${MEASUREMENT_SLUG}" not found — skipping.`);
    } else {
      // Idempotency guard — look for the new "Intensive vs Extensive" heading
      const alreadyExpanded = (measPage.blocks || []).some(
        (b) => b.type === 'heading' && b.text === 'Intensive vs Extensive Properties'
      );
      if (alreadyExpanded) {
        console.log('⚠  "Intensive vs Extensive Properties" heading already present — skipping (idempotent).');
      } else {
        // Locate the parent "Physical vs Chemical Properties" heading + the
        // existing comparison_card immediately after it.
        const parentHeadingIdx = (measPage.blocks || []).findIndex(
          (b) => b.type === 'heading' && b.text === 'Physical vs Chemical Properties'
        );
        if (parentHeadingIdx === -1) {
          throw new Error('Could not find existing "Physical vs Chemical Properties" heading on p4.');
        }
        const parentHeading = measPage.blocks[parentHeadingIdx];

        // The comparison_card sits at the next index — we'll preserve it and
        // re-insert it inside the new expanded layout.
        const compCard = measPage.blocks[parentHeadingIdx + 1];
        if (!compCard || compCard.type !== 'comparison_card') {
          throw new Error('Expected a comparison_card immediately after the parent heading on p4.');
        }

        // Build the new sub-block list — the parent h2 stays, then all the
        // expanded content (which itself folds in the existing comparison_card).
        const newSubBlocks = makePropertiesBlocks(compCard);

        // Splice them in. Order numbers will be assigned by `renumber`.
        const before = measPage.blocks.slice(0, parentHeadingIdx + 1);  // up to & including the h2
        const after = measPage.blocks.slice(parentHeadingIdx + 2);      // after the old comparison_card

        const merged = [...before, ...newSubBlocks, ...after]
          .map((b, i) => ({ ...b, order: i }));

        console.log(`→ Parent heading "Physical vs Chemical Properties" found at index ${parentHeadingIdx}`);
        console.log(`  Inserting ${newSubBlocks.length} new/repositioned blocks (incl. preserved comparison_card)`);
        console.log(`  ${measPage.blocks.length} blocks → ${merged.length} blocks`);

        await pages.updateOne(
          { _id: measPage._id },
          {
            $set: {
              blocks: merged,
              reading_time_min: computeReadingTime(merged),
              content_types: computeContentTypes(merged),
              updated_at: new Date(),
            },
          }
        );
        console.log('  ✓ expanded');
      }
    }

    // ───────────────────────────────────────────────────────────────
    // Final summary
    // ───────────────────────────────────────────────────────────────
    console.log('\n━━━ Final summary ━━━');
    for (const slug of [NOM_SLUG, MEASUREMENT_SLUG]) {
      const p = await pages.findOne({ slug });
      if (!p) continue;
      console.log(`\n[${slug}]  "${p.title}"  ·  ${p.blocks?.length} blocks  ·  ${p.reading_time_min}min read`);
      for (const b of (p.blocks || []).sort((a, c) => a.order - c.order)) {
        let s = '';
        if (b.type === 'heading') s = `(h${b.level}) ${b.text}`;
        else if (b.type === 'callout') s = `[${b.variant}] ${b.title || ''}`;
        else if (b.type === 'image') s = `alt="${(b.alt || '').slice(0, 50)}…"`;
        else if (b.type === 'text') s = `"${(b.markdown || '').slice(0, 60).replace(/\n/g, ' ')}…"`;
        else if (b.type === 'comparison_card') s = `"${b.title || ''}" (${b.columns?.length}c)`;
        else if (b.type === 'table') s = `"${b.caption || ''}"`;
        else if (b.type === 'inline_quiz') s = `${b.questions?.length || 0} Qs`;
        else s = '';
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
