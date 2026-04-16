// Setup script: Class 9 Physics — Chapter 3: Gravitation
// Adds Chapter 3 to the existing class9-physics book and creates 4 pages.

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG  = 'class9-physics';
const CHAPTER_NO = 3;
const CHAPTER_TITLE = 'Gravitation';

function simBlock(id, title, order) {
  return { id: uuidv4(), type: 'simulation', order, simulation_id: id, title };
}
function textBlock(markdown, order) {
  return { id: uuidv4(), type: 'text', order, markdown };
}
function headingBlock(text, level, order) {
  return { id: uuidv4(), type: 'heading', order, text, level };
}

const PAGES = [
  {
    slug: 'universal-gravitation',
    title: 'Universal Law of Gravitation',
    page_number: 1,
    blocks: [
      headingBlock('Newton\'s Universal Law of Gravitation', 2, 0),
      textBlock(
        'Every object in the universe attracts every other object with a force that is:\n' +
        '- **Directly proportional** to the product of their masses\n' +
        '- **Inversely proportional** to the square of the distance between them\n\n' +
        '$$F = G \\frac{m_1 m_2}{r^2}$$\n\n' +
        'where $G = 6.674 \\times 10^{-11}$ N·m²/kg² is the Universal Gravitational Constant.',
        1
      ),
      simBlock('gravitational-force', 'Gravitational Force Explorer', 2),
      textBlock(
        '**Key insight — Inverse-square law:** Doubling the distance reduces the force to ¼ of its value. ' +
        'This explains why the Moon stays in orbit: gravity weakens enough at that distance to balance the orbital speed.\n\n' +
        'Note that G is an extremely small number — which is why gravity between everyday objects (e.g. two people) is unmeasurably tiny, ' +
        'yet Earth\'s enormous mass makes it dominate our daily experience.',
        3
      ),
    ],
  },
  {
    slug: 'free-fall-and-g',
    title: 'Free Fall and Acceleration due to Gravity',
    page_number: 2,
    blocks: [
      headingBlock('Free Fall', 2, 0),
      textBlock(
        'When an object falls under gravity alone (no air resistance), it is said to be in **free fall**. ' +
        'All objects — regardless of mass — accelerate at the same rate:\n\n' +
        '$$g = 9.8 \\text{ m/s}^2$$\n\n' +
        'This was first demonstrated by Galileo, who showed that a heavy and light ball dropped simultaneously from the Leaning Tower of Pisa land at the same time.',
        1
      ),
      simBlock('free-fall-gravity', 'Free Fall Simulator', 2),
      textBlock(
        '**Equations of motion under free fall** (taking downward as positive, initial velocity = 0):\n\n' +
        '| Equation | Meaning |\n' +
        '|---|---|\n' +
        '| $v = g t$ | Velocity grows linearly with time |\n' +
        '| $s = \\frac{1}{2} g t^2$ | Distance grows as the square of time |\n' +
        '| $v^2 = 2gs$ | Velocity-displacement relation |\n\n' +
        'Toggle **air resistance** in the simulation to see why a feather and hammer fall together on the Moon (no air) but differently on Earth.',
        3
      ),
    ],
  },
  {
    slug: 'weight-and-mass',
    title: 'Mass and Weight',
    page_number: 3,
    blocks: [
      headingBlock('Mass vs Weight', 2, 0),
      textBlock(
        '**Mass** is the amount of matter in an object — it is the same everywhere in the universe. ' +
        '**Weight** is the gravitational force acting on that mass:\n\n' +
        '$$W = m \\times g$$\n\n' +
        'Since $g$ varies from planet to planet, weight changes even though mass does not. ' +
        'Weight is measured in **Newtons (N)**, mass in **kilograms (kg)**.',
        1
      ),
      simBlock('weight-on-planets', 'Weight on Different Worlds', 2),
      textBlock(
        '**Moon vs Earth:** The Moon\'s gravitational field is about 1/6th of Earth\'s ($g_{moon} \\approx 1.62$ m/s²). ' +
        'A 60 kg person weighs 588 N on Earth but only 97 N on the Moon — that\'s why astronauts can jump so high!\n\n' +
        '**Weightlessness** occurs during free fall — astronauts in the ISS are constantly falling toward Earth ' +
        '(in a circular orbit) and so feel no contact force from their surroundings.',
        3
      ),
    ],
  },
  {
    slug: 'archimedes-principle-page',
    title: 'Thrust, Pressure and Archimedes\' Principle',
    page_number: 4,
    blocks: [
      headingBlock('Archimedes\' Principle', 2, 0),
      textBlock(
        'When an object is immersed in a fluid (liquid or gas), it experiences an upward force called **upthrust** or **buoyancy force**.\n\n' +
        '**Archimedes\' Principle:** The upthrust on a submerged object equals the weight of the fluid it displaces.\n\n' +
        '$$U = \\rho_{fluid} \\times V_{submerged} \\times g$$\n\n' +
        'An object **floats** when $\\rho_{object} < \\rho_{fluid}$ (upthrust ≥ weight). It **sinks** when $\\rho_{object} > \\rho_{fluid}$.',
        1
      ),
      simBlock('archimedes-principle', 'Archimedes\' Principle Simulator', 2),
      textBlock(
        '**Why do ships float?** A steel ship is much denser than water, but its hollow structure displaces a large volume of water, ' +
        'generating enough upthrust to support the ship\'s weight. The key is the average density of the ship (steel + enclosed air) being less than water.\n\n' +
        '**Relative density** (specific gravity) = $\\frac{\\rho_{substance}}{\\rho_{water}}$. ' +
        'A relative density < 1 means the substance floats; > 1 means it sinks.',
        3
      ),
    ],
  },
];

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('crucible');
    const books = db.collection('books');
    const pages = db.collection('book_pages');

    // Find the class9-physics book
    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`Book "${BOOK_SLUG}" not found. Run setup_class9_physics_motion.js first.`);

    console.log(`✓ Found book: ${book.title} (${book._id})`);

    // Check if chapter 3 already exists
    const existingCh = book.chapters.find(c => c.number === CHAPTER_NO);
    if (existingCh) {
      console.log(`ℹ Chapter ${CHAPTER_NO} already exists — will add/update pages only.`);
    }

    const pageIds = [];
    for (const p of PAGES) {
      const existing = await pages.findOne({ book_id: String(book._id), slug: p.slug });
      if (existing) {
        console.log(`  ⤷ Page "${p.slug}" already exists — skipping.`);
        pageIds.push(String(existing._id));
        continue;
      }
      const pageId = uuidv4();
      await pages.insertOne({
        _id: pageId,
        book_id: String(book._id),
        chapter_number: CHAPTER_NO,
        page_number: p.page_number,
        slug: p.slug,
        title: p.title,
        blocks: p.blocks,
        tags: [],
        published: false,
        reading_time_min: 4,
      });
      pageIds.push(pageId);
      console.log(`  ✓ Created page: ${p.slug}`);
    }

    // Upsert chapter 3 in the book document
    if (!existingCh) {
      await books.updateOne(
        { _id: book._id },
        {
          $push: {
            chapters: {
              number: CHAPTER_NO,
              title: CHAPTER_TITLE,
              is_published: false,
              page_ids: pageIds,
            },
          },
        }
      );
      console.log(`✓ Added Chapter ${CHAPTER_NO}: ${CHAPTER_TITLE} to book`);
    } else {
      // Merge new page IDs
      const toAdd = pageIds.filter(id => !existingCh.page_ids.includes(id));
      if (toAdd.length) {
        await books.updateOne(
          { _id: book._id, 'chapters.number': CHAPTER_NO },
          { $push: { 'chapters.$.page_ids': { $each: toAdd } } }
        );
        console.log(`✓ Added ${toAdd.length} new page(s) to existing Chapter ${CHAPTER_NO}`);
      }
    }

    console.log('\n✅ Chapter 3: Gravitation setup complete.');
    console.log('Pages created:');
    PAGES.forEach(p => console.log(`  → /class9-physics/${p.slug}`));
  } finally {
    await client.close();
  }
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
