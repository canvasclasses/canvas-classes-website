'use strict';
// Ch2 enrichment pass (founder request, 2026-07-05): same treatment as enrich_ch1.js —
// image-rich + step-by-step interactive reveals via `guided_reveal` / `timeline`.
const { v4: uuid } = require('uuid');
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

function guidedReveal(title, intro, steps, outro) {
  return {
    id: uuid(), type: 'guided_reveal', order: 0, title, intro,
    steps: steps.map((s) => ({ id: uuid(), kind: 'point', ...s })),
    outro,
  };
}
function timeline(title, orientation, events) {
  return { id: uuid(), type: 'timeline', order: 0, title, orientation, events: events.map((e) => ({ id: uuid(), ...e })) };
}
function image(alt, caption, generation_prompt, aspect_ratio = '3:2') {
  return {
    id: uuid(), type: 'image', order: 0, src: '', alt, caption, width: 'full', aspect_ratio,
    generation_prompt: `${generation_prompt} Dark background, orange accent labels, clean technical illustration style.`,
  };
}

async function insertAfter(db, slug, predicate, newBlocks, summary) {
  const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
  if (!page) throw new Error(`page not found: ${slug}`);
  const idx = page.blocks.findIndex(predicate);
  if (idx === -1) throw new Error(`insertion anchor not found on ${slug}`);
  const updated = [...page.blocks.slice(0, idx + 1), ...newBlocks, ...page.blocks.slice(idx + 1)]
    .map((b, i) => ({ ...b, order: i }));
  const res = await bw.savePage(db, { slug }, updated, { author: 'agent', summary: summary || 'Enrichment: added image/interactive-reveal block(s)' });
  console.log(`✓ ${slug} — inserted (v${res.version})`);
}

async function replaceBlock(db, slug, predicate, replacement, summary) {
  const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
  const idx = page.blocks.findIndex(predicate);
  if (idx === -1) throw new Error(`replace anchor not found on ${slug}`);
  const updated = page.blocks.map((b, i) => (i === idx ? replacement : b)).map((b, i) => ({ ...b, order: i }));
  const res = await bw.savePage(db, { slug }, updated, {
    author: 'agent', summary, allowContentLoss: true,
    lossReason: 'Founder-directed enrichment pass: replacing a static table with a richer step-by-step guided_reveal covering the exact same content (2026-07-05).',
  });
  console.log(`✓ ${slug} — replaced (v${res.version})`);
}

async function main() {
  await bw.withDb(async (db) => {
    // P1 — guided_reveal: three kinds of tectonic plates.
    await insertAfter(db, 'plate-tectonics-earths-moving-crust',
      (b) => b.type === 'text' && /massive slabs of solid rock/.test(b.markdown || ''),
      [guidedReveal(
        'Three Kinds of Tectonic Plates',
        'Tap through each type of plate.',
        [
          { headline: 'Continental plates', body: 'Carry continents — the landmasses you live on.' },
          { headline: 'Oceanic plates', body: 'Carry ocean floors — thinner and denser than continental plates.' },
          { headline: 'Mixed plates', body: 'Carry both continents and ocean floor together, like the Indo-Australian plate.' },
        ],
        'Whichever type a plate is, it moves the same way — pushed and pulled by convection currents deep below.'
      )],
      'Enrichment: added guided_reveal for the 3 plate types'
    );

    // P2 — guided_reveal: three types of plate boundaries.
    await insertAfter(db, 'plate-boundaries-earthquakes-and-volcanoes',
      (b) => b.type === 'text' && /convergent boundary/.test(b.markdown || ''),
      [guidedReveal(
        'Three Types of Plate Boundaries',
        'Tap through each boundary type to see what it creates.',
        [
          { headline: 'Convergent — plates collide', body: 'Continental-continental collision forms fold mountains like the Himalaya. Oceanic-continental collision causes volcanic activity and earthquakes.' },
          { headline: 'Divergent — plates pull apart', body: 'Magma rises to form new crust, creating features like the Mid-Atlantic Ridge.' },
          { headline: 'Transform — plates slide past each other', body: 'No crust is created or destroyed — mainly causes earthquakes, like along the San Andreas Fault.' },
        ],
        'Most of the world\'s earthquakes and volcanoes cluster along these boundaries — especially around the Pacific "Ring of Fire".'
      )],
      'Enrichment: added guided_reveal for the 3 boundary types'
    );

    // P3 — guided_reveal: three types of weathering (already has one image; adding the reveal too).
    await insertAfter(db, 'weathering-breaking-rock-in-place',
      (b) => b.type === 'image' && /Physical, chemical and biological weathering/.test(b.caption || ''),
      [guidedReveal(
        'Three Types of Weathering',
        'Tap through each way rock breaks down where it stands.',
        [
          { headline: 'Physical weathering', body: 'Rocks break due to temperature changes, frost, or wind — no chemical change involved.' },
          { headline: 'Chemical weathering', body: "Minerals in rock react with water, air or acids, forming entirely new substances." },
          { headline: 'Biological weathering', body: 'Caused by plants, animals or micro-organisms — like a root growing into a crack and splitting the rock apart.' },
        ],
        "All three only break rock apart — none of them move it. That's the next page's job: erosion."
      )],
      'Enrichment: added guided_reveal for the 3 weathering types'
    );

    // P4 — guided_reveal: four types of erosion, plus a supporting image on ancient water conservation.
    await insertAfter(db, 'erosion-and-indias-ancient-water-wisdom',
      (b) => b.type === 'image' && /Erosion caused by water and by wind/.test(b.caption || ''),
      [guidedReveal(
        'Four Types of Erosion',
        'Tap through each agent that carries broken material away.',
        [
          { headline: 'Water erosion', body: 'Caused by rivers, rainfall, or ocean waves — the most widespread type.' },
          { headline: 'Wind erosion', body: 'Common in dry, sandy areas where loose particles are picked up and carried.' },
          { headline: 'Glacial erosion', body: 'Moving ice scrapes and carries huge amounts of rock and soil.' },
          { headline: 'Coastal erosion', body: 'Sea waves wear away land along the shore, reshaping the coastline.' },
        ],
        'Unlike weathering, every one of these actually moves material somewhere else — which is exactly what shapes new landforms.'
      )],
      'Enrichment: added guided_reveal for the 4 erosion types'
    );
    await insertAfter(db, 'erosion-and-indias-ancient-water-wisdom',
      (b) => b.type === 'callout' && /Sindhu-Sarasvati/.test(b.markdown || ''),
      [image(
        'Ancient Indian water conservation structures',
        '📸 Contouring, bunding and terracing — ancient answers to erosion',
        'Illustration of an ancient Indian hillside farm showing contour trenches, earthen bunds along slope lines, and terraced fields, with a small check dam holding back a stream, warm dusk lighting, historically grounded style.'
      )]
    );

    // P5 — guided_reveal: five agents of gradation.
    await insertAfter(db, 'agents-of-gradation-and-landforms-in-history',
      (b) => b.type === 'text' && /Agents of gradation/.test(b.markdown || ''),
      [guidedReveal(
        'Five Agents of Gradation',
        'Tap through each force that is sculpting the land right now.',
        [
          { headline: 'Running water', body: 'Erodes rocks and soil to form valleys and plains.' },
          { headline: 'Glaciers', body: 'Scrape and carve U-shaped valleys as they move.' },
          { headline: 'Wind', body: 'Shapes deserts by eroding and depositing sand.' },
          { headline: 'Waves', body: 'Erode coastlines to form cliffs, beaches and bays.' },
          { headline: 'Groundwater', body: 'Dissolves rock like limestone, creating caves and sinkholes.' },
        ],
        'Together, these five agents are continuously modifying every landform you will meet in the rest of this chapter.'
      )],
      'Enrichment: added guided_reveal for the 5 gradation agents'
    );

    // P6 — timeline: a river's journey.
    await insertAfter(db, 'rivers-waterfalls-meanders-and-deltas',
      (b) => b.type === 'text' && /erosion, transportation and deposition/.test(b.markdown || ''),
      [timeline("A River's Journey", 'horizontal', [
        { label: 'Upper course', detail: 'Steep gradients and strong erosive force form V-shaped valleys, waterfalls and rapids.', icon: 'mountain' },
        { label: 'Middle course', detail: 'The river meanders, losing energy and forming oxbow lakes and floodplains.', icon: 'waves' },
        { label: 'Lower course', detail: 'The river slows and deposits sediment, forming deltas, levees and alluvial fans.', icon: 'droplet' },
      ])],
      "Enrichment: added timeline for a river's journey"
    );

    // P7 — timeline: how a headland becomes a sea stack.
    await insertAfter(db, 'coastal-landforms-beaches-cliffs-and-stacks',
      (b) => b.type === 'text' && /wave-cut platforms/.test(b.markdown || ''),
      [timeline('How a Headland Becomes a Sea Stack', 'horizontal', [
        { label: 'Cliff forms', detail: 'Waves undercut the base of the coast, forming a steep rock face.', icon: 'triangle' },
        { label: 'Cave erodes in', detail: 'Waves erode a weak part of the rock, hollowing out a sea cave.', icon: 'circle' },
        { label: 'Arch appears', detail: 'Caves erode from opposite sides of a headland until they meet, forming an arch.', icon: 'arch' },
        { label: 'Stack remains', detail: 'The arch eventually collapses, leaving an isolated pillar of rock standing alone.', icon: 'square' },
      ])],
      'Enrichment: added timeline for the cliff-to-stack sequence'
    );

    // P8 — guided_reveal: three types of moraines.
    await insertAfter(db, 'glacial-landforms-and-moraines',
      (b) => b.type === 'text' && /lateral moraines/.test(b.markdown || ''),
      [guidedReveal(
        'Three Types of Moraines',
        'Tap through what a glacier leaves behind.',
        [
          { headline: 'Lateral moraines', body: 'Form along the sides of a glacier as it moves.' },
          { headline: 'Terminal moraines', body: "Found at the end of a glacier, marking its furthest advance." },
          { headline: 'Medial moraines', body: 'Form when two glaciers meet and their lateral moraines join in the middle.' },
        ],
        'These deposits can create fertile soil — and sometimes the very dams that hold back a glacial lake.'
      )],
      'Enrichment: added guided_reveal for the 3 moraine types'
    );

    // P9 — guided_reveal: four types of sand dunes.
    await insertAfter(db, 'wind-landforms-deserts-dunes-and-oases',
      (b) => b.type === 'text' && /barchan/i.test(b.markdown || ''),
      [guidedReveal(
        'Four Types of Sand Dunes',
        'Tap through each dune shape wind creates.',
        [
          { headline: 'Barchan dunes', body: 'Crescent-shaped — form where sand is limited and wind blows from one direction.' },
          { headline: 'Longitudinal dunes', body: 'Long ridges formed parallel to the prevailing wind.' },
          { headline: 'Star dunes', body: 'Multiple arms — form where winds come from different directions.' },
          { headline: 'Parabolic dunes', body: 'U-shaped, often stabilised by vegetation.' },
        ],
        'Whichever shape they take, dunes act as natural barriers against desertification and wind erosion.'
      )],
      'Enrichment: added guided_reveal for the 4 dune types'
    );

    // P10 — guided_reveal: five karst landforms.
    await insertAfter(db, 'underground-water-caves-and-karst-landscapes',
      (b) => b.type === 'text' && /Karst topography/.test(b.markdown || ''),
      [guidedReveal(
        'Five Karst Landforms',
        'Tap through what underground water carves out of limestone.',
        [
          { headline: 'Caves', body: 'Hollow spaces formed as acidic water dissolves rock.' },
          { headline: 'Stalactites', body: 'Icicle-shaped formations hanging from a cave ceiling.' },
          { headline: 'Stalagmites', body: 'Formations rising from the cave floor — meeting a stalactite eventually forms a pillar.' },
          { headline: 'Sinkholes (dolines)', body: 'Depressions formed when the ground collapses into an underground cavity.' },
          { headline: 'Underground rivers', body: 'Rivers that flow entirely through cave systems, out of sight.' },
        ],
        'None of this is visible from above — karst landscapes are carved entirely out of sight.'
      )],
      'Enrichment: added guided_reveal for the 5 karst landforms'
    );

    // P11 — replace the disasters table with a guided_reveal.
    await replaceBlock(db, 'landforms-and-disasters',
      (b) => b.type === 'table',
      guidedReveal(
        'Four Landform-Linked Disasters',
        'Tap through each disaster to see what triggers it.',
        [
          { headline: 'Landslides', body: 'Triggered by heavy rainfall, earthquakes, steep slopes, and human activity like deforestation and unplanned construction. Landform connection: unstable slopes on hillsides and mountains.' },
          { headline: 'Avalanches', body: 'Triggered by heavy snowfall, sudden warming, strong winds, and disturbances like skiing or construction. Landform connection: steep, snow-covered mountain slopes.' },
          { headline: 'GLOFs', body: 'Triggered by rapid glacier melting, heavy rainfall, and a weakened natural ice or moraine dam giving way. Landform connection: glacial lakes held back by this chapter\'s own moraines.' },
          { headline: 'Dust storms', body: 'Triggered by strong winds, drought, and exposed soil from deforestation or overgrazing. Landform connection: loose, dry soil in desert and semi-arid regions.' },
        ],
        'All four trace back to the very landforms and forces you have just spent this chapter learning about.'
      ),
      'Enrichment: replaced static table with guided_reveal for the 4 disasters'
    );

    // P12 — guided_reveal: internal vs external forces (2-step capstone).
    await insertAfter(db, 'shaping-the-earths-surface-toolkit',
      (b) => b.type === 'text' && /build up/.test(b.markdown || ''),
      [guidedReveal(
        'Two Kinds of Forces',
        'Tap through the tug-of-war that shapes every landform in this chapter.',
        [
          { headline: 'Internal forces — build up', body: 'Plate tectonics, earthquakes, volcanoes, folding and faulting — these create mountains, valleys and ocean basins.' },
          { headline: 'External forces — wear down', body: 'Weathering, and erosion by water, wind, ice, waves and groundwater — these slowly wear the surface back down.' },
        ],
        "Every landform in this chapter is the result of this tug-of-war — happening right now, everywhere on Earth."
      )],
      'Enrichment: added guided_reveal for internal vs external forces'
    );
  });
}
main().catch((e) => { console.error('❌', e); process.exit(1); });
