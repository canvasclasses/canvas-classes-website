'use strict';
// Ch2 post-build quality fix: (1) lengthen 22 flagged distractors so no option is
// uniquely-longest by >1.3x (position spread was already perfect 25/25/25/25 —
// keep correct_index unchanged, only rewrite text); (2) rivers-waterfalls-meanders-
// and-deltas was missing a required-minimum callout — add one.
const { v4: uuid } = require('uuid');
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

// slug -> { qIndex -> { optIndex -> newText } }
const OPTION_FIXES = {
  'plate-boundaries-earthquakes-and-volcanoes': {
    2: {
      0: "It proves that ancient Indian scholars had no genuine interest at all in trying to observe, understand, or predict earthquakes in any systematic way",
      2: "It is scientifically identical to modern plate tectonics theory, simply using different traditional names for the very same tectonic plates",
      3: "It has no connection whatsoever to how earthquakes are studied, monitored, predicted, or explained by scientists anywhere in the world today",
    },
  },
  'weathering-breaking-rock-in-place': {
    2: {
      1: "Nothing else needs to happen at all, since weathering by itself is already enough to directly create valleys and plains",
      2: "The weathered rock must first turn into a moraine before erosion or any other process can happen to it",
      3: "Only wind can ever move weathered rock material; water and ice play no real role in this process at all",
    },
  },
  'erosion-and-indias-ancient-water-wisdom': {
    0: {
      0: "Weathering only ever happens in dry desert regions, while erosion only ever happens close to rivers and streams",
      2: "There is, in the end, no real difference at all — the two words simply describe exactly the same natural process",
      3: "Weathering is caused only by water acting on rock, while erosion is caused only by wind blowing over land",
    },
    1: {
      0: "Rising sea levels gradually flooding the entire construction site over the coming several decades",
      1: "A sudden, unexpected increase in the region's overall rainfall pattern this particular year",
      3: "A shortage of good building materials caused indirectly by nearby erosion in the area",
    },
    2: {
      0: "That erosion-control methods like these have only ever worked successfully in Nagaland, and nowhere else across India",
      1: "That erosion was not seriously considered a real problem in India until quite recently in its long history",
      2: "That contouring and bunding were entirely abandoned across India once modern engineering methods were eventually invented",
    },
  },
  'agents-of-gradation-and-landforms-in-history': {
    1: {
      0: "A desert limiting the growth of large settlements while at the same time encouraging long-distance trade routes to develop",
      2: "A coastline enabling maritime trade and cultural exchange that helped a flourishing south Indian kingdom grow wealthy",
      3: "Glacial valleys with fertile soil supporting early human agricultural settlement across a cold mountain region for centuries",
    },
    2: {
      0: "Deserts always help trade flourish and never limit any other kind of human activity around them",
      1: "A landform's real effect on human history is completely random and impossible to explain in any way",
      3: "The Silk Route's development actually had nothing at all to do with the Thar desert's landform",
    },
  },
  'rivers-waterfalls-meanders-and-deltas': {
    0: {
      0: "The lower course, where the river is at its widest and calmest point",
      1: "The middle course, where the river slows down and begins to meander",
      2: "At the delta, right where the river finally meets the sea and fans out",
    },
    1: {
      1: "A waterfall, since waterfalls are described on this page as supporting nearby farming villages directly",
      2: "A delta, since deltas are described as always forming in the exact middle of a river's course",
      3: "An oxbow lake entirely on its own, with no real connection at all to the river's wider meander",
    },
    2: {
      0: "Deltas are entirely safe places to live in every case, and the flooding risk this page mentions doesn't really apply to real deltas at all",
      2: "Flooding in a delta only ever affects the local fishing industry, and never touches nearby farming or human settlements at all",
      3: "The fertility of a delta's soil and its risk of flooding are two completely unrelated, entirely coincidental facts about the land",
    },
  },
  'coastal-landforms-beaches-cliffs-and-stacks': {
    0: {
      0: "A dune formed by wind blowing loose sand from a nearby beach",
      1: "A moraine left behind by a slowly retreating mountain glacier",
      3: "A karst landform formed by underground water dissolving rock",
    },
    1: {
      0: "A wave-cut platform, the flat area left behind as a cliff slowly retreats",
      1: "A sea stack, an isolated pillar of rock left standing alone in the sea",
      2: "A beach, made of sand and pebbles deposited along the shoreline",
    },
    2: {
      1: "That the coastline at this exact spot has never experienced any real wave erosion whatsoever",
      2: "That a brand new sandy beach is about to form at that exact spot within the next few years",
      3: "That the rock at that particular location is completely resistant to any further wave erosion",
    },
  },
  'glacial-landforms-and-moraines': {
    1: {
      0: "A cirque, the bowl-shaped depression found at the very head of a glacier",
      1: "An arete, a sharp narrow ridge formed between two neighbouring glacial valleys",
      3: "A fjord, a deep narrow inlet created when the sea floods an old glacial valley",
    },
    2: {
      0: "A terminal moraine, since every moraine by definition marks the furthest point a glacier ever reached",
      1: "A medial moraine, since medial moraines can reportedly form anywhere at all along a glacier's length",
      2: "None of these landforms — moraines are understood to never form along the sides of any glacier",
    },
  },
  'underground-water-caves-and-karst-landscapes': {
    2: {
      0: "That karst landforms always form almost instantly, unlike wind- or ice-carved landforms which take thousands of years to develop",
      2: "That karst landscapes have no real connection at all to the general processes of weathering or erosion described in this chapter",
      3: "That karst landscapes can only ever form in dry desert regions that receive little to no rainfall at any time of year",
    },
  },
  'landforms-and-disasters': {
    0: {
      0: "Ocean tides rising and falling along a coastline far from the disaster site",
      1: "Increased biological weathering caused by plant roots growing into rock crevices",
      3: "The sudden formation of an entirely new tectonic plate boundary nearby",
    },
    1: {
      0: "A dust storm, since prolonged drought and dry conditions are named as the main trigger for that particular disaster",
      1: "A landslide, since this page states that only heavy rainfall and unstable slopes are ever able to cause a landslide",
      2: "An avalanche, since this page states that only snow-covered mountain slopes are ever able to produce an avalanche",
    },
    2: {
      1: "Increasing overgrazing in the region, since this page shows more livestock activity actually reduces overall wind speed",
      2: "Clearing even more forest cover nearby, since this page describes fewer trees as directly reducing dust storm risk",
      3: "Concluding that nothing can realistically be done, since dust storms are caused only by wind with no connection to land cover at all",
    },
  },
  'shaping-the-earths-surface-toolkit': {
    0: {
      0: "Wind erosion slowly carving and reshaping the surface of a desert sand dune",
      2: "A river slowly depositing fresh sediment at its mouth to form a growing delta",
      3: "Ocean waves steadily eroding a rocky coastline into a tall standing sea cliff",
    },
    1: {
      0: "A landform that is completely stable, permanent and entirely unaffected by any natural forces at all, ever",
      1: "A situation this chapter explicitly says is impossible, since internal and external forces can never act on the same landform at the same time",
      3: "A karst landform being shaped purely and only by the slow, ongoing action of underground water dissolving rock",
    },
    2: {
      0: "Human activity is described as having no real, meaningful effect on any of the landform processes covered anywhere in this chapter",
      1: "Only internal forces like earthquakes and volcanoes are described as mattering for disaster risk, making human activity essentially irrelevant",
      2: "Landforms and the disasters linked to them are described as entirely separate from human decisions, and cannot be influenced by them in any way",
    },
  },
};

const CALLOUT_ADD = {
  slug: 'rivers-waterfalls-meanders-and-deltas',
  insertAfterBlockType: 'text', // insert right before the reasoning_prompt
  block: () => ({
    id: uuid(),
    type: 'callout',
    order: 0,
    variant: 'bridging_science',
    title: 'Bridging Geography and Real Life',
    markdown:
      "The Grand Anicut (Kallanai) in Tamil Nadu is one of the oldest water-diversion structures still in use anywhere in the world — built across the Kaveri river centuries ago to redirect water for irrigation. It turned a simple river meander into a lasting solution for farming communities downstream, and it still functions today.",
  }),
};

async function main() {
  await bw.withDb(async (db) => {
    for (const [slug, qFixes] of Object.entries(OPTION_FIXES)) {
      const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
      if (!page) throw new Error(`page not found: ${slug}`);
      const quizIdx = page.blocks.findIndex((b) => b.type === 'inline_quiz');
      const quiz = page.blocks[quizIdx];
      for (const [qIndexStr, optFixes] of Object.entries(qFixes)) {
        const qIndex = Number(qIndexStr);
        for (const [optIndexStr, newText] of Object.entries(optFixes)) {
          quiz.questions[qIndex].options[Number(optIndexStr)] = newText;
        }
      }
      let newBlocks = page.blocks.map((b, i) => (i === quizIdx ? quiz : b));

      // Insert the missing callout on the rivers page, right before its reasoning_prompt.
      if (slug === CALLOUT_ADD.slug) {
        const rpIdx = newBlocks.findIndex((b) => b.type === 'reasoning_prompt');
        newBlocks = [...newBlocks.slice(0, rpIdx), CALLOUT_ADD.block(), ...newBlocks.slice(rpIdx)];
      }

      const res = await bw.savePage(db, { slug }, newBlocks, {
        author: 'agent',
        summary: 'Ch2 quality pass: lengthened length-tell distractors to real comparable-length traps' + (slug === CALLOUT_ADD.slug ? '; added missing required-minimum callout' : ''),
      });
      console.log(`✓ ${slug} — fixed (v${res.version})`);
    }
  });
}
main().catch((e) => { console.error('❌', e); process.exit(1); });
