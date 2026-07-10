'use strict';
// Ch2 concept-rewrite — BATCH 2: the 6 remaining pages (coastal, glacial, wind,
// karst, disasters, toolkit). Same discipline as batch 1: re-teach reworded-NCERT
// `text` blocks into mechanism-explaining teacher English, touch ONLY text blocks,
// preserve all media. The coastal rewrite also restores the cliff→platform→cave→
// arch→stack SEQUENCE in prose (backfilling the sea-stack timeline the founder had
// removed earlier). Targets each block by a unique substring of its current text.
const bw = require('../lib/book-writer');
const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';

const REWRITES = {
  'coastal-landforms-beaches-cliffs-and-stacks': [
    {
      match: 'Waves and currents constantly move over the ocean surface',
      markdown:
        "The same waves that lap gently at a beach on a calm day are, over the years, the sculptors " +
        "of the whole coastline. Rolling in again and again, waves and currents both **build** the " +
        "shore up and **wear** it down — and which one wins in a given spot depends simply on whether " +
        "the wave is dropping sand or dragging it away.\n\n" +
        "Where waves lose their energy and let go of what they're carrying, they build a **beach** — " +
        "that familiar strip of sand, pebbles or shingle along the shore. Beaches are more than " +
        "holiday spots: they're fishing grounds, and they work as a natural cushion, soaking up the " +
        "punch of storm waves before it reaches the land and homes behind them.",
    },
    {
      match: 'Coastal erosion occurs when waves, tides and currents wear away the land along the coast',
      markdown:
        "When waves attack instead of build, they carve a whole family of landforms — and the " +
        "elegant part is that these form in a *sequence*, one turning into the next. It begins with " +
        "a **cliff**: waves hammer the base of a rocky coast, undercutting it until the overhang " +
        "collapses, leaving a steep rock face. As that cliff slowly retreats inland, it leaves a " +
        "flat rocky bench at its foot — a **wave-cut platform**. Where the waves find a weak spot in " +
        "a headland, they hollow out a **sea cave**. If a cave gets punched clean through the " +
        "headland — or two caves on opposite sides meet — it opens into an **arch**. And when the " +
        "roof of that arch finally collapses, the pillar of rock left standing alone out in the sea " +
        "is a **stack**. Cliff → platform → cave → arch → stack: learn to read a coastline's stacks " +
        "and you're reading its whole erosion history.",
    },
  ],

  'glacial-landforms-and-moraines': [
    {
      match: 'A glacier is a giant river of ice',
      markdown:
        "A glacier is, quite literally, a **river made of ice**. In a place cold enough or high " +
        "enough — the Himalaya, say — more snow falls each year than melts away, so it piles up, " +
        "winter on winter, until its own weight crushes the buried layers into dense ice. Then, " +
        "still under that enormous weight, the whole mass begins to *flow* downhill — " +
        "unbelievably slowly, often just centimetres to a few metres a day. But ice is heavy and " +
        "studded with frozen-in rock, so a glacier doesn't trickle like water; it **grinds**, " +
        "scouring the land beneath it like a sheet of sandpaper the size of a valley.\n\n" +
        "That grinding carves a distinctive set of landforms. A glacier widens and deepens a valley " +
        "into a broad **U-shape** (a river cuts a narrow *V*; ice bulldozes a *U*). At its head it " +
        "scoops out a bowl-shaped hollow called a **cirque**. Where two glaciers grind along either " +
        "side of a ridge, they sharpen it into a knife-edge **arête**. A small side glacier can be " +
        "left perched high above the main valley — a **hanging valley**, often with a waterfall " +
        "spilling from its lip. And when the sea later floods a deep glacial valley, it becomes a " +
        "**fjord**, one of those dramatic steep-walled ocean inlets.\n\n" +
        "None of this is just scenery. U-shaped valleys and cirques draw trekkers, skiers and " +
        "mountaineers; fjords make superb natural harbours and fishing grounds; and the glaciers " +
        "themselves are frozen reservoirs, slowly feeding the rivers that millions of people " +
        "downstream depend on for water.",
    },
    {
      match: 'are landforms created by the deposition of rocks, soil and debris',
      markdown:
        "A glacier doesn't only carve — it also *carries*. Every scrap of rock and grit it scrapes " +
        "up rides along, frozen inside and beneath the ice, until the glacier melts and dumps it in " +
        "a heap. That dumped mix — geologists call it **till** — piles into ridges called " +
        "**moraines**, and *where* a moraine sits tells you exactly where the ice once was. A " +
        "**lateral moraine** runs along a glacier's *side*, built from rubble that tumbled onto its " +
        "edges. A **terminal moraine** sits at its *snout*, marking the furthest point the ice ever " +
        "reached before retreating. And a **medial moraine** runs down the *middle*, formed when two " +
        "glaciers merge and their inner side-ridges fuse into one. These ridges are far from useless " +
        "leftovers: moraine debris can weather into fertile soil, and a terminal moraine can even " +
        "dam a valley to hold back a lake — useful for water and power, but, as you'll see later in " +
        "this chapter, sometimes dangerous too.",
    },
  ],

  'wind-landforms-deserts-dunes-and-oases': [
    {
      match: 'Wind erosion occurs when strong winds pick up and carry away loose particles',
      markdown:
        "Out in a desert, wind does what water does elsewhere — it erodes — but with one twist: wind " +
        "can only lift the *loose and light* stuff, the sand and dust, leaving the heavier material " +
        "behind. Armed with those airborne grains, wind becomes a natural sandblaster, and it carves " +
        "a distinctive set of landforms. **Yardangs** are streamlined rock ridges, sanded down by " +
        "wind blowing steadily from one direction until they point like the hulls of ships. " +
        "**Ventifacts** are individual rocks polished and faceted smooth, as though worked on a " +
        "grinding wheel. A **deflation hollow** (or blowout) is a shallow scooped-out pit, left " +
        "where the wind has simply carried the loose material clean away. And a **desert pavement** " +
        "is the neat mosaic of pebbles left lying on the surface once all the finer dust between them " +
        "has been blown off. These shapes decide where people can settle and farm in dry lands — and " +
        "their strange beauty draws tourists and geologists alike.",
    },
    {
      match: 'A deflation hollow that digs deep enough can reach the underground water table',
      markdown:
        "Dig one of those deflation hollows deep enough and something wonderful can happen: it " +
        "reaches the **water table** hidden beneath the sand, and water wells up. That's an " +
        "**oasis** — a sudden island of green and life in a sea of dry desert, and for centuries a " +
        "lifeline for the travellers and trade caravans crossing it.\n\n" +
        "The sand the wind carries has to land somewhere, and where it heaps up it builds **dunes** " +
        "— hills and ridges of sand whose very *shape* records the wind that made them. **Barchan " +
        "dunes** are crescents with their horns pointing downwind, forming where sand is scarce and " +
        "the wind holds one steady direction. **Longitudinal dunes** are long ridges lying " +
        "*parallel* to a persistent wind. **Star dunes** have arms radiating several ways, betraying " +
        "winds that blow from many sides through the year. And **parabolic dunes** are U-shaped, " +
        "their tips often pinned in place by clumps of vegetation. Far from useless, dunes act as " +
        "natural walls against advancing desert and blowing sand, and along some coasts they shield " +
        "settlements from fierce sea winds.",
    },
  ],

  'underground-water-caves-and-karst-landscapes': [
    {
      match: 'Underground water, especially in areas of limestone or soluble rock',
      markdown:
        "Some rock, like limestone, has a secret weakness: it *dissolves*. Rainwater picks up a " +
        "little acidity from the air and soil, and as it trickles down through cracks in limestone " +
        "it slowly eats the rock away from the inside. A landscape shaped this way is called " +
        "**karst topography** — and it's riddled with hidden, hollowed-out wonders.\n\n" +
        "The most famous are **caves** — whole underground chambers dissolved out of solid rock. " +
        "Inside them, water dripping from the ceiling leaves behind specks of mineral that build, " +
        "drop by drop over thousands of years, into stone icicles: **stalactites** hang from the " +
        "roof (they cling *tight* to the ceiling), while **stalagmites** grow up from the floor to " +
        "meet them — and if the two finally join, they form a complete pillar. Where the roof of an " +
        "underground cavity gives way, the ground above suddenly caves in, forming a pit called a " +
        "**sinkhole** (or doline). And an **underground river** is exactly that — a river flowing " +
        "hidden through a cave system, out of sight beneath your feet. For the communities living " +
        "above karst country, these caves and rivers are real, everyday sources of fresh water — and " +
        "often places of deep cultural and religious meaning.",
    },
  ],

  'landforms-and-disasters': [
    {
      match: 'Landslides are caused by natural and human factors making slopes unstable',
      markdown:
        "A landslide is what happens when a slope loses its grip and a mass of rock, soil and debris " +
        "suddenly slides downhill. A slope stays put only as long as friction can resist gravity — a " +
        "landslide is the moment gravity finally wins. **Heavy, continuous rain** is the classic " +
        "trigger: water soaking into the ground adds weight *and* acts like a lubricant, cutting the " +
        "friction that holds everything together. **Earthquakes** can shake a slope loose in " +
        "seconds. And people tip the balance too — **clearing forests** (whose roots bind the soil), " +
        "**mining, road-cutting and building on steep hillsides**, and **blocked drainage** that " +
        "traps water — all quietly weaken a slope until, one rainy day, it lets go.",
    },
    {
      match: 'Avalanches are caused by the sudden instability of snow',
      markdown:
        "An avalanche is a landslide made of **snow** — a vast mass of it breaking free and roaring " +
        "down a steep mountainside. Snow piles up in layers over a winter, and the danger comes when " +
        "those layers don't bond well to one another. A **heavy fresh snowfall** loads extra weight " +
        "onto a weak buried layer; a **sudden warm spell** melts the snow just enough to slick the " +
        "surfaces and cut friction; **strong winds** heap snow unevenly, over-loading one slope. " +
        "After that, the smallest nudge — a skier, a loud crack, a falling cornice — can shatter the " +
        "balance and send the whole slab thundering down.",
    },
    {
      match: 'GLOFs are caused by the sudden release of large volumes of water',
      markdown:
        "A **Glacial Lake Outburst Flood** — a GLOF — is the disaster hiding behind those moraine " +
        "dams you met earlier in this chapter. As a glacier melts, meltwater pools behind the ridge " +
        "of debris (or ice) at its snout, forming a lake that grows bigger and heavier with every " +
        "warm year. But that natural dam was never *built* to hold water — it's just piled-up rubble " +
        "— so it's fragile. Add a burst of **heavy rain**, or a shock from an **earthquake, " +
        "avalanche or landslide** crashing into the lake, and the dam can give way all at once, " +
        "unleashing a wall of water and debris that tears downstream with terrifying speed. This is " +
        "exactly the kind of glacier-linked flood that struck Chamoli.",
    },
    {
      match: 'Dust storms are caused by strong winds lifting large amounts of loose, dry soil',
      markdown:
        "A dust storm is wind erosion happening all at once and in your face: a strong wind sweeps " +
        "up huge quantities of loose, dry soil and sand and drives them forward as a towering, " +
        "choking wall of dust. The ingredients are simply dryness and bare ground. **Long droughts** " +
        "and **low rainfall** parch the soil to powder; **sparse plant cover** — thinned by " +
        "deforestation, overgrazing or careless farming — leaves nothing to hold that soil down, so " +
        "the wind takes it. And a warming, more erratic climate is making these storms both more " +
        "frequent and more fierce.",
    },
  ],

  'shaping-the-earths-surface-toolkit': [
    {
      match: "The Earth's surface is constantly changing due to forces working both inside and outside",
      markdown:
        "Step back and this whole chapter turns out to be a single story — a **tug-of-war**. Two " +
        "sets of forces are fighting over the shape of the Earth's surface, and every landform you've " +
        "met is a snapshot of that struggle frozen at one moment. **Internal forces**, powered by " +
        "the planet's inner heat — plate movement, earthquakes, volcanoes, the folding and faulting " +
        "of rock — *build the surface up*, raising mountains and cracking open valleys and ocean " +
        "basins. **External forces** — weathering, erosion and deposition, driven by sun, water, ice " +
        "and wind — *wear it back down*, grinding those mountains away grain by grain and spreading " +
        "the debris into plains and deltas. Neither side ever wins for good, which is exactly why the " +
        "Earth's surface is never finished.",
    },
    {
      match: "Every landform you've studied in this chapter is the result of an ongoing tug-of-war",
      markdown:
        "Here's the cleanest way to hold the whole chapter in your head: two teams with opposite " +
        "jobs. **Internal forces build the land up** — plate movement, earthquakes, volcanoes, " +
        "folding and faulting. **External forces wear it back down** — weathering, and erosion by " +
        "water, wind, ice, waves and groundwater. Tap through the two below, then look back at any " +
        "landform in this chapter and ask yourself: which team shaped this — or was it both, at " +
        "once?",
    },
  ],
};

function replaceOnce(blocks, match, newMarkdown, slug) {
  const hits = blocks.filter((b) => b.type === 'text' && (b.markdown || '').includes(match));
  if (hits.length === 0) throw new Error(`[${slug}] no text block matched: "${match}"`);
  if (hits.length > 1) throw new Error(`[${slug}] ${hits.length} blocks matched (not unique): "${match}"`);
  return blocks.map((b) => (b === hits[0] ? { ...b, markdown: newMarkdown } : b));
}

async function main() {
  await bw.withDb(async (db) => {
    for (const [slug, edits] of Object.entries(REWRITES)) {
      const page = await db.collection('book_pages').findOne({ book_id: BOOK_ID, slug });
      if (!page) throw new Error('page not found: ' + slug);
      const mediaBefore = page.blocks.filter((b) => ['image', 'gallery', 'video'].includes(b.type)).length;
      let blocks = page.blocks;
      for (const e of edits) blocks = replaceOnce(blocks, e.match, e.markdown, slug);
      const mediaAfter = blocks.filter((b) => ['image', 'gallery', 'video'].includes(b.type)).length;
      if (mediaAfter !== mediaBefore) throw new Error(`[${slug}] media changed ${mediaBefore}->${mediaAfter}`);
      const res = await bw.savePage(db, { slug }, blocks, {
        author: 'agent',
        summary:
          'Ch2 concept-rewrite batch 2 (landform + disaster + toolkit pages): re-taught ' +
          'reworded-NCERT text into mechanism-explaining teacher English; coastal rewrite ' +
          'restores the cliff→stack sequence in prose. All media preserved.',
      });
      console.log(`✓ ${slug} — ${edits.length} block(s) rewritten (v${res.version || '?'}), media ${mediaAfter} preserved`);
    }
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
