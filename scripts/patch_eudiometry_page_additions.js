'use strict';
/**
 * Ch.1 Chemistry (ncert-simplified) — "Eudiometry — Volume-Volume Analysis"
 * page, founder-requested additions (2026-07-24):
 *
 *   1. A real-world hook opener (motorcycle-engine kick-start combustion) —
 *      a hero image + a short bridge paragraph into the existing formal
 *      "Volume–Volume Analysis" heading. Written fresh in the page's own
 *      plain voice — NOT a transcription of the reference mockup shown by
 *      the founder (which used a real copyrighted stock photo + slightly
 *      inaccurate framing; platform convention is AI-generated dark-bg
 *      images via generation_prompt, never third-party stock photography —
 *      see feedback_no_third_party_book_attribution / feedback_image_dark_bg).
 *   2. A new "combustion-stoichiometry-balancer" simulation block (built this
 *      session — CombustionStoichiometryBalancerSim.tsx), placed right after
 *      the existing general-combustion-equation text block, with a one-line
 *      bridge. Companion to eudiometer-lab: there you deduce x,y from given
 *      volumes; here you pick x,y and watch the volumes redraw.
 *   3. A `real_world` callout (biogas/gobar-gas KOH testing) placed right
 *      AFTER the Eudiometer Lab sim, since by then the student has just used
 *      KOH absorption hands-on — this is "here's where that exact idea runs
 *      for real," not an abstract preview.
 *
 * PURELY ADDITIVE: every existing block keeps its original `id` and content
 * untouched; only `order` values are renumbered to fit the 3 new blocks in.
 * Written via book-writer.savePage (versioned, content-loss-guard checked —
 * ran once already this session; lossDetected: false, now page version 10).
 * Idempotent guard: skips if the hero hook text is already present.
 * Run: node scripts/patch_eudiometry_page_additions.js */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const SLUG = 'eudiometry';

const heroImage = {
  id: uuidv4(),
  type: 'image',
  src: '',
  alt: 'A motorcycle engine cylinder at the instant of ignition, a bright spark and expanding flame pushing the piston down, stylised technical illustration on a dark background',
  caption: 'The same reaction you are about to measure in a lab tube is what fires inside an engine every time a bike kick-starts.',
  width: 'full',
  aspect_ratio: '16:5',
  generation_prompt:
    'Ultra-wide cinematic banner (16:5). A stylised cutaway of a single motorcycle engine cylinder at the exact instant ' +
    'of ignition — a bright orange-white spark and an expanding flame front inside the combustion chamber, the piston ' +
    'visibly pushed downward by the sudden gas expansion. Dark near-black background (#0a0a0a), warm amber and orange ' +
    'glow from the combustion, cool blue-grey metal for the cylinder walls and piston, clean modern technical-' +
    'illustration style, no readable text or labels.',
};

const heroText = {
  id: uuidv4(),
  type: 'text',
  markdown:
    'Every time a motorcycle kick-starts, a tiny squirt of petrol — a hydrocarbon, just like the gases in this chapter — ' +
    'burns inside the engine cylinder. That burning turns a small volume of fuel and air into a much bigger volume of ' +
    'hot $\\ce{CO2}$ and water vapour almost instantly, and it is this sudden expansion that shoves the piston down and ' +
    'gets the engine running.\n\n' +
    'That is the same reaction you are about to measure, on a much smaller and much calmer scale, inside a sealed glass ' +
    'tube: $\\ce{C_xH_y + O2 -> CO2 + H2O}$. Eudiometry is simply the classical technique for measuring the *volumes* in ' +
    'that reaction precisely enough that, given just a few readings, you can work backwards and figure out exactly which ' +
    'hydrocarbon was burned. Let\'s see how.',
};

const balancerBridge = {
  id: uuidv4(),
  type: 'text',
  markdown:
    '**Try it yourself.** Before running the full virtual experiment below, play with the balancer here — pick any ' +
    'carbon and hydrogen count and watch the equation balance itself and the volume bars redraw in real time.',
};

const balancerSim = {
  id: uuidv4(),
  type: 'simulation',
  simulation_id: 'combustion-stoichiometry-balancer',
  title: 'Combustion Stoichiometry Balancer',
};

const bioGasCallout = {
  id: uuidv4(),
  type: 'callout',
  variant: 'real_world',
  title: 'Testing Biogas the Eudiometry Way',
  markdown:
    'This exact trick — burn or bubble a gas mixture, then use KOH to remove just the $\\ce{CO2}$ — is not only a ' +
    'classroom exercise. It runs, for real, on household biogas (gobar gas) plants across rural India.\n\n' +
    'A biogas plant produces a mix of combustible methane ($\\ce{CH4}$) and useless carbon dioxide ($\\ce{CO2}$). To check ' +
    'how good a batch of gas is, you take 100 mL of the raw gas and bubble it through KOH solution. KOH absorbs only the ' +
    '$\\ce{CO2}$ — so whatever volume disappears IS the $\\ce{CO2}$ content. If the volume drops by 40 mL, the gas was ' +
    '40% useless $\\ce{CO2}$ and only 60% usable methane.\n\n' +
    'One idea — **a gas volume that vanishes tells you exactly how much of one substance was there** — runs both the ' +
    'eudiometer tube on your screen and a mud-brick gas plant in a village courtyard.',
  image_src: '',
  image_prompt:
    'Ultra-wide banner. A rural Indian household biogas (gobar gas) digester — a simple dome-shaped brick and mud ' +
    'structure with a gas outlet pipe, set in a village courtyard at dusk, a warm lantern-like glow suggesting captured ' +
    'gas inside, dark near-black sky and shadows, amber and warm earth-tone accents, clean illustrative style, no ' +
    'readable text.',
};

async function main() {
  await bw.withDb(async (db) => {
    const pages = db.collection('book_pages');
    const cur = await pages.findOne({ slug: SLUG });
    if (!cur) throw new Error(`page not found: ${SLUG}`);

    const already = cur.blocks.some((b) => b.type === 'text' && /kick-starts/.test(b.markdown || ''));
    if (already) { console.log('hero hook already present — skipping (idempotent).'); return; }

    const sorted = [...cur.blocks].sort((a, b) => a.order - b.order);

    // Existing anchors (found by content, not assumed index, so this stays
    // correct even if someone re-orders blocks before this script runs).
    const generalEqTextIdx = sorted.findIndex((b) => b.type === 'text' && /general hydrocarbon combustion equation/.test(b.markdown || ''));
    const eudSimIdx = sorted.findIndex((b) => b.type === 'simulation' && b.simulation_id === 'eudiometer-lab');
    if (generalEqTextIdx === -1) throw new Error('could not find the general-combustion-equation text block — aborting to avoid a blind insert');
    if (eudSimIdx === -1) throw new Error('could not find the eudiometer-lab simulation block — aborting to avoid a blind insert');

    const withNew = [
      heroImage,
      heroText,
      ...sorted.slice(0, generalEqTextIdx + 1),
      balancerBridge,
      balancerSim,
      ...sorted.slice(generalEqTextIdx + 1, eudSimIdx + 1),
      bioGasCallout,
      ...sorted.slice(eudSimIdx + 1),
    ];
    const newBlocks = withNew.map((b, i) => ({ ...b, order: i }));

    const res = await bw.savePage(db, { slug: SLUG }, newBlocks, {
      author: 'agent',
      summary: 'Added a real-world hook opener (engine combustion), a new Combustion Stoichiometry Balancer simulation ' +
        '+ bridge line, and a real_world callout on biogas/KOH testing — founder-requested additions, all purely ' +
        'additive (existing blocks unchanged, only reordered).',
    });
    console.log('SAVED', res.slug, 'version', res.version, '· blocks:', newBlocks.length, '· lossDetected:', res.diff.lossDetected);
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
