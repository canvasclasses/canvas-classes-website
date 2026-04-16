// Setup script: Class 9 Physics — Chapter 4: Work and Energy
// Adds Chapter 4 to the existing class9-physics book and creates 4 pages.

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
dotenv.config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG   = 'class9-physics';
const CHAPTER_NO  = 4;
const CHAPTER_TITLE = 'Work and Energy';

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
    slug: 'work-done',
    title: 'Work Done by a Force',
    page_number: 1,
    blocks: [
      headingBlock('Work Done by a Force', 2, 0),
      textBlock(
        'In science, **work is done** when a force causes displacement in the direction of the force.\n\n' +
        '$$W = F \\times d \\times \\cos \\theta$$\n\n' +
        'where $F$ is the applied force (N), $d$ is the displacement (m), and $\\theta$ is the angle between the force and displacement.\n\n' +
        '**Work is positive** when force and displacement are in the same direction ($\\theta < 90°$), ' +
        '**zero** when perpendicular ($\\theta = 90°$), and **negative** when opposing motion ($\\theta > 90°$).\n\n' +
        '**Unit:** 1 Joule (J) = 1 Newton × 1 metre. Named after James Prescott Joule.',
        1
      ),
      simBlock('work-done', 'Work Done Explorer', 2),
      textBlock(
        '**Important:** When you carry a bag horizontally, your upward force is perpendicular to horizontal displacement — so you do **zero** work on the bag (in the physics sense). ' +
        'The confusion arises because you feel tired — but that tiredness is due to internal muscular forces, not work on the bag.\n\n' +
        '**Negative work** example: A braking car. Friction acts backward while the car moves forward — friction does negative work, removing kinetic energy from the car.',
        3
      ),
    ],
  },
  {
    slug: 'kinetic-energy',
    title: 'Kinetic Energy',
    page_number: 2,
    blocks: [
      headingBlock('Kinetic Energy', 2, 0),
      textBlock(
        '**Kinetic energy** is the energy an object possesses due to its motion:\n\n' +
        '$$KE = \\frac{1}{2} m v^2$$\n\n' +
        'Key features:\n' +
        '- KE is always **positive** (speed is always positive)\n' +
        '- KE depends on $v^2$ — **doubling the speed quadruples KE**\n' +
        '- KE depends on $m$ linearly — doubling mass doubles KE\n\n' +
        '**Work-Energy Theorem:** The net work done on an object equals its change in kinetic energy: $W_{net} = \\Delta KE$',
        1
      ),
      simBlock('kinetic-energy', 'Kinetic Energy Simulator', 2),
      textBlock(
        '**Why is v² so important in road safety?**\n\n' +
        'A car at 60 km/h has **4×** the kinetic energy of one at 30 km/h (not just 2×). ' +
        'The stopping distance is proportional to KE (all of which must be dissipated by brakes). ' +
        'So doubling speed quadruples stopping distance — a critical reason for speed limits.',
        3
      ),
    ],
  },
  {
    slug: 'potential-energy-conservation',
    title: 'Potential Energy and Conservation of Energy',
    page_number: 3,
    blocks: [
      headingBlock('Potential Energy & Conservation of Mechanical Energy', 2, 0),
      textBlock(
        '**Gravitational Potential Energy** is the energy stored in an object due to its position above a reference point:\n\n' +
        '$$PE = m \\times g \\times h$$\n\n' +
        '**Law of Conservation of Energy:** Energy can neither be created nor destroyed — it can only be converted from one form to another.\n\n' +
        'For a freely swinging pendulum or a ball on a frictionless ramp:\n\n' +
        '$$PE + KE = \\text{constant} = \\text{Total Mechanical Energy}$$\n\n' +
        'At the **highest point**: all energy is PE, $KE = 0$, $v = 0$.\n' +
        'At the **lowest point**: all energy is KE, $PE = 0$, $v = v_{max} = \\sqrt{2gh}$.',
        1
      ),
      simBlock('energy-conservation', 'Energy Conservation — Pendulum', 2),
      textBlock(
        '**With friction or air resistance**, some mechanical energy converts to heat (thermal energy). ' +
        'The total energy (mechanical + thermal + ...) is still conserved — but the mechanical energy decreases.\n\n' +
        'This is why a real pendulum eventually stops: mechanical energy → heat → sound. ' +
        'But the universe\'s total energy never changes — it is the most fundamental conservation law in physics.',
        3
      ),
    ],
  },
  {
    slug: 'power',
    title: 'Power and Commercial Energy',
    page_number: 4,
    blocks: [
      headingBlock('Power', 2, 0),
      textBlock(
        '**Power** is the rate at which work is done (or energy is transferred):\n\n' +
        '$$P = \\frac{W}{t} = F \\times v$$\n\n' +
        '**Unit:** 1 Watt (W) = 1 Joule per second (J/s). Named after James Watt.\n\n' +
        'Another common unit: **1 horsepower (hp) = 746 W**.\n\n' +
        '**Commercial Unit of Energy — kilowatt-hour (kWh):**\n\n' +
        '$$1 \\text{ kWh} = 1000 \\text{ W} \\times 3600 \\text{ s} = 3.6 \\times 10^6 \\text{ J}$$\n\n' +
        'This is the unit on your electricity bill. 1 kWh = 1 "unit" of electricity.',
        1
      ),
      simBlock('power-and-work', 'Power & Energy Rate', 2),
      textBlock(
        '**Practical examples:**\n\n' +
        '| Device | Power | Energy in 1 hour |\n' +
        '|---|---|---|\n' +
        '| LED bulb | 10 W | 0.01 kWh |\n' +
        '| Ceiling fan | 75 W | 0.075 kWh |\n' +
        '| Air conditioner | 1500 W | 1.5 kWh |\n' +
        '| Electric kettle | 2000 W | 2 kWh |\n\n' +
        '**Efficiency** = (Useful power output / Total power input) × 100%. ' +
        'No machine is 100% efficient — some energy is always lost as heat or sound.',
        3
      ),
    ],
  },
];

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db    = client.db('crucible');
    const books = db.collection('books');
    const pages = db.collection('book_pages');

    // Find the class9-physics book
    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`Book "${BOOK_SLUG}" not found. Run setup_class9_physics_motion.js first.`);

    console.log(`✓ Found book: ${book.title} (${book._id})`);

    // Check if chapter 4 already exists
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

    // Upsert chapter 4 in the book document
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

    console.log('\n✅ Chapter 4: Work and Energy setup complete.');
    console.log('Pages created:');
    PAGES.forEach(p => console.log(`  → /class9-physics/${p.slug}`));
  } finally {
    await client.close();
  }
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
