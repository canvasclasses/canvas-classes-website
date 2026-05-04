// wire_motion_sims.js
// Insert simulation blocks into the existing motion-chapter pages.
//   Page 6 (position-time-graphs)        ← match-the-motion
//   Page 7 (velocity-time-graphs)        ← triple-graph-scrubber
//   Page 9 (stopping-distance-safe-driving) ← stopping-distance-lab
//   Page 10 (uniform-circular-motion)    ← marble-in-ring
//
// For each page: fetch current blocks, splice in a simulation block at a
// sensible position (after the relevant concept, before the inline_quiz),
// renumber `order`, and PUT back.

const crypto = require('crypto');
const uuid = () => crypto.randomUUID();

const BOOK = 'class9-science';
const API = 'http://localhost:3000/api/v2/books';

const PLAN = [
  {
    slug: 'position-time-graphs',
    sim: {
      simulation_id: 'match-the-motion',
      title: 'Match the Motion — drive a puck to reproduce a target p-t curve',
    },
    // place AFTER the slope worked_example, BEFORE the reasoning_prompt
    insertBeforeType: 'reasoning_prompt',
  },
  {
    slug: 'velocity-time-graphs',
    sim: {
      simulation_id: 'triple-graph-scrubber',
      title: 'Triple Graph Scrubber — one playhead drives position, velocity, and acceleration',
    },
    insertBeforeType: 'reasoning_prompt',
  },
  {
    slug: 'stopping-distance-safe-driving',
    sim: {
      simulation_id: 'stopping-distance-lab',
      title: 'Stopping Distance Lab — feel why doubling speed quadruples the gap',
    },
    insertBeforeType: 'reasoning_prompt',
  },
  {
    slug: 'uniform-circular-motion',
    sim: {
      simulation_id: 'marble-in-ring',
      title: 'Marble in a Ring — Activity 4.5 with a tap-to-release tangent escape',
    },
    insertBeforeType: 'reasoning_prompt',
  },
];

async function processPage(plan) {
  const url = `${API}/${BOOK}/pages/${plan.slug}`;
  console.log(`\n— ${plan.slug}`);

  const fetchRes = await fetch(url);
  const data = await fetchRes.json();
  if (!data.success) {
    console.error('  fetch FAIL:', data);
    return false;
  }

  const blocks = data.data.blocks.slice();
  // Skip if a simulation block with this ID already exists (idempotent).
  if (blocks.some(b => b.type === 'simulation' && b.simulation_id === plan.sim.simulation_id)) {
    console.log('  already wired — skipping');
    return true;
  }

  // Find insertion point: just before the first block of the target type.
  const insertIdx = blocks.findIndex(b => b.type === plan.insertBeforeType);
  if (insertIdx === -1) {
    console.error(`  no ${plan.insertBeforeType} block found`);
    return false;
  }

  const simBlock = {
    id: uuid(),
    type: 'simulation',
    order: insertIdx, // will be renumbered below
    simulation_id: plan.sim.simulation_id,
    title: plan.sim.title,
  };

  blocks.splice(insertIdx, 0, simBlock);
  // Renumber every block's `order` to be its new array index.
  for (let i = 0; i < blocks.length; i++) blocks[i].order = i;

  // PUT back. Preserve hinglish_blocks by sending them through unchanged.
  const body = {
    blocks,
    hinglish_blocks: data.data.hinglish_blocks || [],
  };
  const putRes = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const putData = await putRes.json();
  if (!putData.success) {
    console.error('  PUT FAIL:', JSON.stringify(putData, null, 2));
    return false;
  }
  console.log(`  inserted simulation '${plan.sim.simulation_id}' at order ${insertIdx} | ${putData.data.blocks.length} blocks total`);
  return true;
}

(async () => {
  let allOk = true;
  for (const p of PLAN) {
    const ok = await processPage(p);
    if (!ok) allOk = false;
  }
  console.log(allOk ? '\nALL OK' : '\nSOME PAGES FAILED');
  process.exit(allOk ? 0 : 1);
})();
