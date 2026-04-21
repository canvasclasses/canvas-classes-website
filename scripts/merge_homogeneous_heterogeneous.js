/**
 * merge_homogeneous_heterogeneous.js
 *
 * Merges pages 69 (Homogeneous Mixtures) and 70 (Heterogeneous Mixtures) into
 * a single high-quality page at position 69.
 *
 * Actions:
 *  1. Replace page 69 content with the merged page
 *  2. Delete page 70
 *  3. Remove page 70's _id from the book chapter's page_ids array
 *  4. Shift all pages with page_number >= 70 down by 1
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const PAGE_69_ID = '1b253452-8651-40e3-a901-dc6d3a481770';
const PAGE_70_ID = '7c94c471-cd6a-4cf9-8a30-92c9f71346e7';
const BOOK_ID    = '69fbc73e-8f2c-4cf2-a678-c9fd41a1e706';

const mergedBlocks = [
  // ── Block 0: Curiosity Prompt ──────────────────────────────────────────────
  {
    id: uuidv4(),
    type: 'curiosity_prompt',
    order: 0,
    prompt: 'When you stir sugar into tea, it completely disappears — every sip is equally sweet. But stir sand into water and the sand is still visible, and settles to the bottom if you wait. What do you think is the fundamental difference between these two mixtures?',
    reveal: 'The sugar has dissolved at the molecular level — it is spread perfectly evenly. The sand has not dissolved at all — it is simply floating among water molecules and gravity pulls it down. This is the core of what homogeneous and heterogeneous mean.',
  },

  // ── Block 1: Fun Fact ──────────────────────────────────────────────────────
  {
    id: uuidv4(),
    type: 'callout',
    order: 1,
    variant: 'fun_fact',
    title: 'Gold That Isn\'t Pure Gold',
    markdown: '24-carat gold is pure gold — but pure gold is so soft it bends under finger pressure. **22-carat gold** (91.7% gold + 8.3% silver or copper) is harder, more durable, and far more practical. The gold jewellery most Indians wear daily is a **homogeneous mixture** — a solid solution — where you cannot tell the metals apart even under a microscope. The entire history of metallurgy is the art of making homogeneous mixtures.',
  },

  // ── Block 2: Core Text — Composition + Both Definitions ───────────────────
  {
    id: uuidv4(),
    type: 'text',
    order: 2,
    markdown: `Mixtures are normally classified into two types — **homogeneous** and **heterogeneous**. To understand what these terms mean, we first need to understand what **composition** means for a mixture.

**Composition** is simply the answer to two questions: *what is a mixture made of*, and *how much of each component is present*? Think of a glass of fresh orange juice — its composition includes water, natural sugars, vitamin C, and fruit acids, each in some proportion. Squeeze more orange into one glass, and its composition changes, even though both glasses look like juice.

Now comes the crucial question: is that composition the **same at every point**, or does it **vary from place to place**?

**A homogeneous mixture** has the same composition throughout — uniform, identical at every point. Take a sample from the top, middle, or bottom of a saltwater glass: every drop is equally salty. Every cubic metre of air — near the ceiling or the floor — has the same 78% nitrogen, 21% oxygen, 0.9% argon. **Brass** (the alloy in door handles and musical instruments) looks and behaves identically everywhere — you cannot see the copper and zinc as separate regions even under a microscope. *If you cannot identify different parts, it is homogeneous.*

**A heterogeneous mixture** has a composition that changes from part to part. In a handful of **granite**, you can see white quartz, pink feldspar, and black mica as visibly separate specks. In a glass of **salad dressing** left to stand, oil floats above vinegar in two distinct layers. In **muddy river water**, the mud concentrates at the bottom while the water above runs clearer. *If you can identify different regions — by eye, by touch, or by chemical test — it is heterogeneous.*`,
  },

  // ── Block 3: Image — Uniform vs Non-Uniform Composition ───────────────────
  {
    id: 'df81ca1b-2ad2-4a3f-86e6-62a0782fba89',
    type: 'image',
    order: 3,
    src: '',
    alt: 'Uniform vs non-uniform composition: copper wire vs granite cross-section',
    caption: '📸 Uniform composition (copper, left) — identical at every point. Non-uniform composition (granite, right) — visibly different minerals in different regions.',
    width: 'full',
    generation_prompt: 'Split-panel composition diagram. Left panel labelled "Uniform Composition — Homogeneous": cross-section of a copper wire showing a regular grid of identical orange copper atoms evenly packed throughout, with annotation "same everywhere." Right panel labelled "Non-uniform Composition — Heterogeneous": cross-section of a granite rock showing irregular patches of white quartz crystals, pink feldspar grains, and black mica flakes distributed unevenly, with annotation "different parts differ." Each panel has a small magnified inset circle showing the microscopic view. Label: Copper (uniform), Granite (non-uniform), quartz, feldspar, mica. Dark background, orange accent labels, clean technical illustration style.',
  },

  // ── Block 4: Heading ───────────────────────────────────────────────────────
  {
    id: uuidv4(),
    type: 'heading',
    order: 4,
    text: 'Solutions, Colloids, and Suspensions',
    level: 2,
  },

  // ── Block 5: Text — Three Types ────────────────────────────────────────────
  {
    id: uuidv4(),
    type: 'text',
    order: 5,
    markdown: `Not all heterogeneous mixtures look messy. **Milk** looks perfectly uniform to the naked eye — yet it is classified as heterogeneous. This is because the classification goes deeper than appearance: it depends on **particle size**.

Chemists divide all mixtures into three classes based on the size of the dispersed particles:

**True Solution** — homogeneous mixture; particles are individual molecules or ions, less than 1 nm. They are invisible, cannot be filtered out, and never settle. Salt water, sugar water, vinegar, and air are all true solutions.

**Colloid** (or colloidal dispersion) — heterogeneous at the microscopic level; particles are 1–1000 nm, too large to dissolve, too small to see individually. They **scatter a beam of light** (the Tyndall Effect) and they **never settle**. Milk, butter, fog, smoke, ink, blood plasma, and gelatin are colloids.

**Suspension** — most obviously heterogeneous; particles are above 1000 nm, visible or nearly visible. They are **unstable** — they settle on standing — and **can be filtered** through ordinary filter paper. Muddy water, chalk-in-water, and fine sand in water are suspensions.

The difference matters practically. Shake muddy water and wait five minutes — the water clears from the top down as mud settles. Shake milk and wait five years — it stays cloudy forever. The fat droplets are colloidal and gravity cannot pull them down.`,
  },

  // ── Block 6: Table ─────────────────────────────────────────────────────────
  {
    id: '8ce35562-03d5-4881-abf4-4db72015ce4e',
    type: 'table',
    order: 6,
    caption: 'Comparison: Solution vs. Colloid vs. Suspension',
    headers: ['Property', 'Solution', 'Colloid', 'Suspension'],
    rows: [
      ['Particle size',    '< 1 nm',              '1–1000 nm',               '> 1000 nm'],
      ['Appearance',       'Transparent',          'Translucent / cloudy',    'Opaque / cloudy'],
      ['Stability',        'Stable — never settles','Stable — never settles', 'Unstable — settles on standing'],
      ['Filterable?',      'No',                   'No (ordinary filter)',    'Yes'],
      ['Tyndall Effect?',  'No',                   'Yes',                     'Yes (less distinct)'],
      ['Examples',         'Salt water, vinegar',  'Milk, fog, smoke, ink',   'Muddy water, chalk in water'],
    ],
  },

  // ── Block 7: Image — Three containers ─────────────────────────────────────
  {
    id: '07ec97b0-bc07-4d90-aa44-b765d4a9b701',
    type: 'image',
    order: 7,
    src: '',
    alt: 'Three containers illustrating suspension, colloid, and immiscible liquids',
    caption: '📸 Suspension (muddy water, left) — settles. Colloid (milk, centre) — never settles. Immiscible liquids (oil and vinegar, right) — two permanent phases.',
    width: 'full',
    generation_prompt: 'Three containers on a dark polished surface. Left: a tall glass of murky brown river water with visible sediment layered at the bottom and clearer water above, label "Suspension — particles settle on standing." Centre: a glass of fresh whole milk (white, uniformly cloudy throughout), label "Colloid — particles never settle." Right: a small glass bottle of salad dressing showing two clear layers — pale yellow oil on top, dark vinegar below, label "Immiscible Liquids — two separate phases." Each label in orange text above the container. Dark background, photorealistic, educational style.',
  },

  // ── Block 8: Colloid Types Reference ──────────────────────────────────────
  {
    id: uuidv4(),
    type: 'callout',
    order: 8,
    variant: 'note',
    title: 'Types of Colloids — Know the Names',
    markdown: `**Sol** — solid dispersed in liquid (paint, ink, blood)\n**Emulsion** — liquid dispersed in liquid (milk, mayonnaise, salad dressing with emulsifier)\n**Foam** — gas dispersed in liquid (shaving cream, whipped cream)\n**Aerosol** — liquid or solid dispersed in gas (fog and clouds = liquid aerosol; smoke = solid aerosol)\n**Gel** — liquid dispersed in solid (jelly, butter, agar)\n\nThe *dispersed phase* is the substance spread out; the *dispersion medium* is what it's spread through.`,
  },

  // ── Block 9: Reasoning Prompt ─────────────────────────────────────────────
  {
    id: uuidv4(),
    type: 'reasoning_prompt',
    order: 9,
    reasoning_type: 'logical',
    prompt: 'Milk looks white and uniform to the naked eye, yet it is classified as a heterogeneous mixture (colloid). A student argues: "If I can\'t see any separation, it must be homogeneous." What is wrong with this reasoning?',
    options: [
      'Nothing — milk is homogeneous by NCERT definition since it appears uniform',
      'Milk is heterogeneous only because it contains bacteria',
      'Uniformity to the naked eye is not the criterion. Milk shows the Tyndall Effect — fat droplets (0.1–1 µm) scatter a beam of light, proving they are dispersed but not dissolved. A true solution (like salt water) shows no such scattering.',
      'The student is correct — since milk does not settle, it should be a solution',
    ],
    reveal: 'A colloid appears uniform to the naked eye but is heterogeneous at the microscopic level. The Tyndall test reveals this: shine a beam of light through milk and you see a bright glowing path (fat droplets scattering the beam). Pass the same beam through salt water — nothing visible, because dissolved ions are too small to scatter light. "Looks uniform" is never sufficient to call something homogeneous. You need to confirm uniformity at the molecular level.',
    difficulty_level: 3,
  },

  // ── Block 10: Real-World Impact ────────────────────────────────────────────
  {
    id: uuidv4(),
    type: 'callout',
    order: 10,
    variant: 'remember',
    title: '🩸 Real-World Impact',
    markdown: `**Blood** is simultaneously three things: a *true solution* (salts and glucose dissolved in plasma), a *colloid* (plasma proteins dispersed in water), and a *suspension* (red and white blood cells floating in plasma). Doctors order a CBC (Complete Blood Count) by centrifuging blood — separating it into its components by density. The ratio of red cells to total volume (the haematocrit) diagnoses anaemia, dehydration, and more.

**Aviation fuel (ATF)** is a tightly controlled *homogeneous mixture*. If its composition varies — even slightly — engine thrust becomes unpredictable. Fuel quality testing before every commercial flight uses the same separation techniques you are now learning.`,
  },

  // ── Block 11: Quiz ─────────────────────────────────────────────────────────
  {
    id: uuidv4(),
    type: 'inline_quiz',
    order: 11,
    pass_threshold: 0.6,
    questions: [
      {
        id: uuidv4(),
        question: 'Which of the following is a heterogeneous mixture?',
        options: ['Sugar solution', 'Salt water', 'Muddy water', 'Vinegar'],
        correct_index: 2,
        explanation: 'Muddy water is heterogeneous — the mud particles are large, visible, and settle on standing. Sugar solution, salt water, and vinegar are all homogeneous solutions where the solute is uniformly dissolved at the molecular level.',
        reasoning_level: 1,
      },
      {
        id: uuidv4(),
        question: 'Brass is an alloy of copper and zinc. Even under a powerful microscope, you cannot distinguish individual copper or zinc regions — the metals are blended at the atomic level. How should brass be classified?',
        options: [
          'Heterogeneous — because it contains two different metals',
          'Homogeneous — because its composition is uniform throughout; no separate regions can be identified',
          'A suspension — because the zinc particles are dispersed in copper',
          'Neither — alloys are pure substances, not mixtures',
        ],
        correct_index: 1,
        explanation: 'Brass has the same composition at every point — you cannot identify copper-rich or zinc-rich regions at any scale. Uniform composition throughout = homogeneous mixture. It is also a true solution in the solid state (a solid solution / alloy).',
        reasoning_level: 2,
      },
      {
        id: uuidv4(),
        question: 'A student dissolves copper sulphate in water and filters the bright blue solution through filter paper. What happens, and what does it tell us?',
        options: [
          'Blue crystals collect on the filter paper — the solution was incomplete',
          'Nothing is retained; the entire blue solution passes through, confirming the copper sulphate is dissolved at the ionic level — particle size < 1 nm',
          'The filter paper turns blue but the filtrate is colourless',
          'Nothing passes — filter paper blocks all coloured substances',
        ],
        correct_index: 1,
        explanation: 'In a true solution, solute particles are ionic or molecular in size (< 1 nm) — far too small to be trapped by filter paper. The entire blue solution passes through. This is the key test distinguishing solutions from suspensions, which do leave a residue on filter paper.',
        reasoning_level: 2,
      },
      {
        id: uuidv4(),
        question: 'A student shakes oil and water vigorously. After two minutes, two distinct layers form again. What type of mixture is this, and why do the layers re-form?',
        options: [
          'Solution; the different densities cause separation',
          'Heterogeneous mixture; oil is non-polar and water is polar — "like dissolves like" — so they are immiscible and always separate',
          'Colloid; re-separation is due to the Tyndall effect stopping',
          'Suspension; the oil particles are too heavy to stay dissolved',
        ],
        correct_index: 1,
        explanation: 'Oil (non-polar) and water (highly polar) do not dissolve in each other — "like dissolves like." The two immiscible layers represent two distinct liquid phases. Less-dense oil floats on denser water. This is a classic heterogeneous mixture that no amount of shaking can permanently mix without an emulsifier.',
        reasoning_level: 2,
      },
      {
        id: uuidv4(),
        question: 'You have three colourless liquids: vinegar, salt water, and pure water. A classmate says she can identify the pure water by filtering all three. Is she correct?',
        options: [
          'Yes — pure water passes through filter paper; the others leave residue',
          'No — all three are homogeneous and none leaves any residue on filter paper; filtration cannot distinguish them',
          'Yes — salt water leaves salt crystals on the filter paper',
          'No — she needs to boil all three; pure water leaves no residue while the others do',
        ],
        correct_index: 1,
        explanation: 'Filtration separates only particles large enough to be trapped. All three liquids are homogeneous — no particles large enough to filter. The correct approach is evaporation: salt water leaves a white salt residue, vinegar leaves a faint acidity, pure water leaves nothing. "No visible particles" does not mean "can be identified by filtration."',
        reasoning_level: 3,
      },
    ],
  },
];

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not found');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('crucible');
  const pages = db.collection('book_pages');
  const books = db.collection('books');

  // 1. Rewrite page 69 with merged content
  await pages.updateOne(
    { _id: PAGE_69_ID },
    {
      $set: {
        title: 'Homogeneous and Heterogeneous Mixtures',
        subtitle: 'Two types, one idea — composition',
        slug: 'homogeneous-and-heterogeneous-mixtures',
        blocks: mergedBlocks,
        updated_at: new Date(),
      },
    }
  );
  console.log('✓ Page 69 rewritten');

  // 2. Delete page 70
  await pages.deleteOne({ _id: PAGE_70_ID });
  console.log('✓ Page 70 deleted');

  // 3. Remove page 70 from book chapter page_ids
  await books.updateOne(
    { _id: BOOK_ID },
    { $pull: { 'chapters.$[].page_ids': PAGE_70_ID } }
  );
  console.log('✓ Page 70 removed from book chapter');

  // 4. Shift all pages with page_number >= 70 down by 1
  const result = await pages.updateMany(
    { book_id: BOOK_ID, page_number: { $gte: 70 } },
    { $inc: { page_number: -1 } }
  );
  console.log(`✓ Shifted ${result.modifiedCount} subsequent pages down by 1`);

  await client.close();
  console.log('\nDone.');
}

run().catch(err => { console.error(err); process.exit(1); });
