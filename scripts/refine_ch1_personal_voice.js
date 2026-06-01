'use strict';
/**
 * Refines Chapter 4 ("Some Basic Concepts of Chemistry") with the teacher's
 * personal teaching style:
 *
 *  1. Shifts current p2–p9 → p3–p10.
 *  2. Inserts new p2 "Importance of Chemistry" (12 blocks, draft).
 *  3. Inserts an Iron Pillar of Delhi `fun_fact` callout into p1
 *     ("how-chemistry-began") between the Indian-chemistry text and the
 *     metallurgy image.
 *  4. Replaces the "Kilogram in Paris" fun_fact at block 0 of the SI/
 *     measurement page (was p3, becomes p4) with the Mars Climate Orbiter
 *     1999 disaster hook.
 *
 * Writes directly to MongoDB. Idempotency-guarded — re-runs are safe.
 * Run: node scripts/refine_ch1_personal_voice.js
 */
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CHAPTER = 4;
const NEW_SLUG = 'importance-of-chemistry';
const MEASUREMENT_SLUG = 'properties-measurement-si-units';
const HISTORY_SLUG = 'how-chemistry-began';

// p2..p9 today → p3..p10 after the shift
const EXISTING_P2_TO_P9 = [
  'introduction-chemistry-matter',
  'properties-measurement-si-units',
  'laws-chemical-combinations',
  'atomic-molecular-mass',
  'mole-concept',
  'percentage-composition-empirical-formula',
  'stoichiometry-limiting-reagent',
  'concentration-of-solutions',
];

// ─── Helpers (inline ports of @canvas/data/books/utils) ─────────────────────

function flattenBlocks(arr) {
  const out = [];
  for (const b of arr) {
    if (b.type === 'section' && Array.isArray(b.columns)) {
      for (const col of b.columns) out.push(...col);
    } else {
      out.push(b);
    }
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

// ─── New page: "Importance of Chemistry" ────────────────────────────────────

const importanceBlocks = [
  // 0 — hero banner
  {
    id: uuidv4(),
    type: 'image',
    order: 0,
    src: '',
    alt: 'A bedside table at dawn with a digital alarm clock, subtle molecular structures glowing faintly in the air around it',
    caption: '',
    width: 'full',
    aspect_ratio: '16:5',
    generation_prompt:
      "Ultra-wide cinematic banner (16:5 ratio). A bedside scene at sunrise — a digital alarm clock showing '6:00' in glowing amber numerals sits on a wooden bedside table. A hand reaches towards it from the warm covers. Subtle, faintly glowing molecular structures and atom symbols hover in the air around the clock and bedside lamp, barely visible — suggesting chemistry is everywhere even before you wake. Cinematic chiaroscuro, deep shadows, near-black background with warm amber rim light from the window and clock. Photorealistic editorial style. No text overlay.",
  },

  // 1 — alarm clock hook (the user's iconic opener)
  {
    id: uuidv4(),
    type: 'text',
    order: 1,
    markdown:
      "**Were you woken up today by your alarm clock?**\n\nThat sound — the one that pulled you out of sleep — was made when electrons flowed through a tiny crystal, and molecules aligned in the LCD to glow '6:00'. Before your feet even touched the floor, **chemistry had already happened**.\n\nThis is the secret nobody tells you when you open a chemistry textbook for the first time: **chemistry isn’t a subject. It’s a layer of reality that’s been around you your whole life — you just didn’t have the words for it.**",
  },

  // 2 — content image (alarm clock + LCD molecules)
  {
    id: uuidv4(),
    type: 'image',
    order: 2,
    src: '',
    alt: 'A digital alarm clock at 6:00 with a person reaching to turn it off, with subtle illustrated liquid-crystal molecules visible inside the LCD display',
    caption: '📸 Two acts of chemistry — the buzz and the glow — before you’re even out of bed',
    width: 'full',
    generation_prompt:
      "Photorealistic editorial close-up of a bedside scene at dawn. A digital alarm clock displays '6:00' in glowing amber-red LCD numerals. A hand reaches towards it from the warm covers of a bed. Inside the LCD display, an inset illustration shows liquid-crystal rod-shaped molecules aligning in geometric patterns under an electric field. Soft pre-dawn light from a window mixing with the clock's warm glow. Cinematic chiaroscuro, near-black background with warm amber accent lighting. No text overlay, no labels except the clock face '6:00'.",
  },

  // 3 — what chemistry actually is + central science framing
  {
    id: uuidv4(),
    type: 'text',
    order: 3,
    markdown:
      "**What chemistry actually is.**\n\nChemistry is the branch of science that studies the **composition**, **properties**, and **interaction** of matter. Three words. They cover everything that exists.\n\nIt is called the **central science** because it sits between two extremes: **physics** on one side (particles, forces, abstract laws) and **biology** on the other (life, cells, organisms). Chemistry is the bridge between them — the same atoms physics studies are folding into the proteins biology depends on. Without that bridge, neither side makes sense on its own.",
  },

  // 4 — heading
  {
    id: uuidv4(),
    type: 'heading',
    order: 4,
    text: 'We are chemical machines',
    level: 2,
  },

  // 5 — body chemistry (polymer skin, organic eyes, ceramic skeleton)
  {
    id: uuidv4(),
    type: 'text',
    order: 5,
    markdown:
      "Pinch the skin on your arm. That’s a **polymer** — long chains of organic molecules linked together. Same family of compound as the polythene bag from your morning grocery run.\n\nYour eyes? **Organic photodetectors.** Light hits specialised molecules in your retinas, those molecules change shape, and that change becomes the electrical signal your brain reads as “this page.”\n\nWhat holds you upright? A **ceramic skeleton.** Calcium phosphate crystals threaded through collagen fibres — the same composite engineering that modern aerospace materials are still trying to match.\n\nPolymers on the outside. Optical sensors in the middle. Ceramic underneath. **You are a chemical machine** — built, run, and maintained entirely by chemistry.",
  },

  // 6 — heading
  {
    id: uuidv4(),
    type: 'heading',
    order: 6,
    text: 'And everything you touch, too',
    level: 2,
  },

  // 7 — the big object list (everything around you is chemistry)
  {
    id: uuidv4(),
    type: 'text',
    order: 7,
    markdown:
      "Look at the next ten things you touch today. Every one of them is chemistry doing its work:\n\n- The **blanket** you pushed off this morning — a synthetic polymer engineered to trap pockets of warm air against your skin.\n- The **clothes** you put on — dyed polymeric fibres, with colour molecules locked into the fabric at the molecular level so they don’t wash out.\n- The **cereal** in your bowl — carbohydrates suspended in milk, itself a colloidal emulsion of fats, proteins, and monosaccharides.\n- The **toothpaste** you used — abrasives, surfactants, and fluoride compounds dispersed in a gel that hardens dental enamel by chemistry alone.\n- The **screen** you’re reading this on — ultra-thin semiconductor layers, microetched to atomic precision, powered by voltaic cells.\n- The **book** in your bag — processed cellulose, sized with chemicals so ink won’t bleed through the page.\n- The **vehicle** you took to school or college — running on controlled gaseous explosions inside a metal cylinder.\n\nNone of this is metaphor. Every object on that list — every object in this room — exists because someone, somewhere, did chemistry.",
  },

  // 8 — heading
  {
    id: uuidv4(),
    type: 'heading',
    order: 8,
    text: 'And things you can’t see at all',
    level: 2,
  },

  // 9 — emotions + life on other planets
  {
    id: uuidv4(),
    type: 'text',
    order: 9,
    markdown:
      "Beyond the things you can touch, chemistry quietly runs the things you can’t.\n\n**The feelings you have today** — love, hate, stress, anxiety, the small joy of solving a hard problem — every one of them traces back to specific molecules released in specific amounts by specific organs in your body. **Serotonin. Dopamine. Cortisol. Adrenaline.** Mood isn’t “just chemistry” in any dismissive sense — it *is* chemistry, fully and literally.\n\n**And it doesn’t stop at this planet.** Every time a future Mars or Moon mission has to build a life-support system, grow plants in low gravity, or pull water from rocks — that is a chemistry problem before it is anything else. The question *can humans live on another planet?* isn’t an engineering question first. It’s a chemistry question first.",
  },

  // 10 — closing punchline (user's signature line)
  {
    id: uuidv4(),
    type: 'text',
    order: 10,
    markdown:
      "**So no matter your reason for studying chemistry, you’re going to enjoy it.**\n\nIf you came for JEE, you’ll find the most elegantly logical puzzles you’ve ever solved. If you came for medicine, you’ll find the language your body actually speaks. If you came because it was the next box on the syllabus, you’ll find that the box, when opened, contained the whole world.\n\nWelcome to chemistry.",
  },

  // 11 — quiz
  {
    id: uuidv4(),
    type: 'inline_quiz',
    order: 11,
    pass_threshold: 0.67,
    questions: [
      {
        id: uuidv4(),
        question: 'Chemistry is the branch of science that studies which three aspects of matter?',
        options: [
          'Composition, motion, and energy',
          'Composition, properties, and interaction',
          'Origin, growth, and decay',
          'Structure, gravity, and density',
        ],
        correct_index: 1,
        explanation:
          'Chemistry studies the **composition** (what something is made of), **properties** (how it behaves), and **interaction** (how it changes when it meets other matter). Motion and gravity belong to physics; growth and decay are biology.',
      },
      {
        id: uuidv4(),
        question: 'Chemistry is called the "central science." What does this mean?',
        options: [
          'It is taught at the centre of every science curriculum',
          'It sits at the centre of the periodic table',
          'It bridges physics and biology — translating between the laws of particles and the behaviour of living systems',
          'It is the oldest of all the sciences',
        ],
        correct_index: 2,
        explanation:
          'The label means chemistry is the **conceptual bridge** between physics (particles, forces, abstract laws) and biology (cells, organisms, life). Without chemistry, the physics of atoms and the biology of organisms have no common language.',
      },
      {
        id: uuidv4(),
        question: 'Which of the following involves chemistry at work? Pick the best answer.',
        options: [
          'The buzz of your alarm clock — electrons flowing through a piezoelectric crystal',
          'The colour of the clothes you wear — dye molecules bonded into the fabric',
          'Your skin staying intact and waterproof — long polymer chains',
          'All of the above',
        ],
        correct_index: 3,
        explanation:
          'All three are chemistry. The point of this page: chemistry isn’t one of the things on the list — it’s the layer underneath every single thing you interact with, all day, every day.',
      },
    ],
  },
];

// ─── Iron Pillar callout (insert into p1 / how-chemistry-began) ──────────────

const ironPillarCallout = {
  id: uuidv4(),
  type: 'callout',
  order: 5, // will be set to slot between block 4 (text) and block 5 (image)
  variant: 'fun_fact',
  title: 'The Pillar That Refuses to Rust',
  markdown:
    "Walk into the **Qutub Minar complex in Delhi** today and you can stand in front of a piece of working chemistry from the year **402 CE**.\n\nThe **Iron Pillar of Delhi** is a **7.2-metre, 6-tonne wrought-iron column** raised during the Gupta dynasty. It carries an inscription honouring King **Chandragupta II (Vikramaditya)**. For 1,600+ years, exposed to Delhi’s monsoon humidity and summer sun, it has stood with **almost no rust**.\n\nHow? In 2002, **Prof. R. Balasubramaniam at IIT Kanpur** analysed the surface and found a thin, dense protective layer of **misawite** ($\\ce{FeOOH}$ — iron oxyhydroxide) only about **100 microns thick** (one-tenth of a millimetre).\n\nThe reason this layer forms: the pillar’s iron contains an unusually high **phosphorus content of about 1%**. Modern industrial steel has roughly **0.05%** — twenty times less. The phosphorus, combined with Delhi’s wet-dry seasonal cycle, slowly precipitates that protective film, which then **blocks any further oxidation underneath**.\n\nIn other words: **Indian metallurgists in 400 CE were doing alloy-engineered corrosion protection** that the rest of the world only fully understood in the 2000s.",
};

// ─── Mars Orbiter callout (replaces "Kilogram in Paris" fun_fact) ───────────

const marsOrbiterCallout = {
  // id will be set from the existing block we're replacing
  type: 'callout',
  order: 0,
  variant: 'fun_fact',
  title: 'A $327 Million Crash Caused by Mixing Units',
  markdown:
    "On **September 23, 1999**, NASA’s **Mars Climate Orbiter** — a $327 million spacecraft — slammed into the Martian atmosphere instead of slipping into orbit around the planet. The craft burned up. The mission was lost.\n\nThe post-mortem found one cause, almost embarrassing in its simplicity: **two engineering teams had been using different units**. Lockheed Martin’s team had calculated thruster forces in **pound-seconds** (US customary). NASA’s navigation software read those numbers as **newton-seconds** (SI). The mismatch was never caught.\n\nA factor-of-4.45 error in the most boring of details — a unit suffix — was enough to push a spacecraft into a planet.\n\n**Lesson for everything that follows in this chapter: a number without a unit is not a measurement. It’s just noise.**",
};

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const books = db.collection('books');
    const pages = db.collection('book_pages');

    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`Book "${BOOK_SLUG}" not found`);
    const bookId = String(book._id);
    console.log(`→ Book: ${book.title}  (_id=${bookId})`);

    // ──────────────── 1. Idempotency: new page already exists?
    const existing = await pages.findOne({ book_id: bookId, slug: NEW_SLUG });
    if (existing) {
      console.log(`⚠  Page "${NEW_SLUG}" already exists (p${existing.page_number}). Skipping page-insert + shift.`);
    } else {
      // ──────────────── 2. Verify p2..p9 layout
      const current = await pages
        .find({ book_id: bookId, chapter_number: CHAPTER })
        .sort({ page_number: 1 })
        .project({ slug: 1, page_number: 1 })
        .toArray();
      const fromP2 = current.filter((p) => p.page_number >= 2 && p.page_number <= 9);
      const actual = fromP2.map((p) => p.slug);
      const layoutOk =
        actual.length === EXISTING_P2_TO_P9.length &&
        EXISTING_P2_TO_P9.every((s, i) => s === actual[i]);
      if (!layoutOk) {
        throw new Error(
          `Expected p2..p9 layout mismatch.\n  expected: ${EXISTING_P2_TO_P9.join(', ')}\n  actual:   ${actual.join(', ')}`
        );
      }
      console.log('  ✓ verified p2..p9 layout');

      // ──────────────── 3. Shift p2..p9 → p3..p10 (highest first)
      console.log('\n→ Shifting p2..p9 → p3..p10');
      for (let i = EXISTING_P2_TO_P9.length - 1; i >= 0; i--) {
        const slug = EXISTING_P2_TO_P9[i];
        const newPageNum = i + 3;
        const r = await pages.updateOne(
          { book_id: bookId, slug },
          { $set: { page_number: newPageNum } }
        );
        console.log(`  ${slug}  → p${newPageNum}  (matched=${r.matchedCount}, modified=${r.modifiedCount})`);
        if (r.matchedCount === 0) throw new Error(`Failed to shift "${slug}"`);
      }

      // ──────────────── 4. Insert new "Importance of Chemistry" page
      const pageId = uuidv4();
      const now = new Date();
      const doc = {
        _id: pageId,
        book_id: bookId,
        chapter_number: CHAPTER,
        page_number: 2,
        slug: NEW_SLUG,
        title: 'Importance of Chemistry',
        subtitle: 'Why this subject is everywhere you look — and inside you, too.',
        blocks: importanceBlocks,
        hinglish_blocks: [],
        tags: [],
        published: false,
        reading_time_min: computeReadingTime(importanceBlocks),
        content_types: computeContentTypes(importanceBlocks),
        created_at: now,
        updated_at: now,
      };
      console.log(`\n→ Inserting "${NEW_SLUG}"  (reading_time=${doc.reading_time_min}min, content_types=[${doc.content_types.join(', ')}])`);
      await pages.insertOne(doc);

      const r = await books.updateOne(
        { _id: book._id, 'chapters.number': CHAPTER },
        { $push: { 'chapters.$.page_ids': pageId } }
      );
      console.log(`  ✓ book.chapters[number=${CHAPTER}].page_ids updated (matched=${r.matchedCount})`);
    }

    // ──────────────── 5. Insert Iron Pillar callout into p1
    const historyPage = await pages.findOne({ book_id: bookId, slug: HISTORY_SLUG });
    if (!historyPage) {
      console.log(`⚠  "${HISTORY_SLUG}" not found — skipping Iron Pillar insertion.`);
    } else {
      const alreadyHas = (historyPage.blocks || []).some(
        (b) => b.type === 'callout' && b.title === ironPillarCallout.title
      );
      if (alreadyHas) {
        console.log('\n⚠  Iron Pillar callout already present in p1. Skipping.');
      } else {
        // Insert at order=5 (right after the Indian-chemistry text block at order=4,
        // before the metallurgy image at order=5). All blocks with order >= 5 shift +1.
        const shifted = (historyPage.blocks || []).map((b) =>
          b.order >= 5 ? { ...b, order: b.order + 1 } : b
        );
        shifted.push({ ...ironPillarCallout, order: 5 });
        shifted.sort((a, b) => a.order - b.order);

        console.log(`\n→ Inserting Iron Pillar callout into "${HISTORY_SLUG}" at order=5`);
        await pages.updateOne(
          { _id: historyPage._id },
          {
            $set: {
              blocks: shifted,
              reading_time_min: computeReadingTime(shifted),
              content_types: computeContentTypes(shifted),
              updated_at: new Date(),
            },
          }
        );
        console.log('  ✓ Iron Pillar callout inserted');
      }
    }

    // ──────────────── 6. Replace Kilogram fun_fact with Mars Orbiter (p4 — measurement page)
    const measurementPage = await pages.findOne({ book_id: bookId, slug: MEASUREMENT_SLUG });
    if (!measurementPage) {
      console.log(`⚠  "${MEASUREMENT_SLUG}" not found — skipping Mars Orbiter replacement.`);
    } else {
      const block0 = (measurementPage.blocks || []).find((b) => b.order === 0);
      if (!block0) {
        console.log(`⚠  No block 0 found on "${MEASUREMENT_SLUG}". Skipping.`);
      } else if (block0.title === marsOrbiterCallout.title) {
        console.log('\n⚠  Mars Orbiter callout already at block 0. Skipping.');
      } else {
        console.log(`\n→ Replacing block 0 on "${MEASUREMENT_SLUG}":`);
        console.log(`   old: [${block0.variant}] "${block0.title}"`);
        console.log(`   new: [${marsOrbiterCallout.variant}] "${marsOrbiterCallout.title}"`);
        const updatedBlocks = (measurementPage.blocks || []).map((b) =>
          b.order === 0
            ? { ...marsOrbiterCallout, id: b.id } // preserve the existing block id
            : b
        );
        await pages.updateOne(
          { _id: measurementPage._id },
          {
            $set: {
              blocks: updatedBlocks,
              reading_time_min: computeReadingTime(updatedBlocks),
              content_types: computeContentTypes(updatedBlocks),
              updated_at: new Date(),
            },
          }
        );
        console.log('  ✓ Mars Orbiter is now block 0');
      }
    }

    // ──────────────── 7. Verify final layout
    console.log('\n→ Verifying final Ch4 layout');
    const finalCh = await pages
      .find({ book_id: bookId, chapter_number: CHAPTER })
      .sort({ page_number: 1 })
      .project({ slug: 1, page_number: 1, published: 1, title: 1 })
      .toArray();
    for (const p of finalCh) {
      const flag = p.published ? '🟢' : '⚪';
      console.log(`  ${flag} p${String(p.page_number).padEnd(3)} ${p.slug.padEnd(45)} — ${p.title}`);
    }

    console.log('\n✓ Done.');
    console.log('  • New page "Importance of Chemistry" is at p2 (draft).');
    console.log('  • Iron Pillar fun_fact added to p1 ("How Chemistry Began").');
    console.log('  • Mars Climate Orbiter now opens the measurement page (p4).');
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
