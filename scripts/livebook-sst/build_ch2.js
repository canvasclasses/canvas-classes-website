'use strict';
// Class 9 Social Science — Chapter 2 "Shaping of the Earth's Surface" — build all 12 pages.
// Source: ~/Downloads/Class 9 Social science/iest102.pdf (read in full before authoring).
// Plan approved in _agents/state/SOCIAL_SCIENCE_BOOK_BUILD.md.
// Locked settings: English-only (hinglish_blocks: []), images src:'' + generation_prompt,
// published: false. New pages only — brand-new inserts, not touching any existing content.
// Quiz option lengths + correct_index position (cycled 0,1,2,3 across all 36 questions)
// authored balanced FROM THE START this time — lesson learned from Ch1's post-build fix.

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.local') });
const { MongoClient } = require('mongodb');
const { v4: uuid } = require('uuid');
const bw = require('../lib/book-writer');

const BOOK_ID = 'a60d142c-c96b-48cc-ba72-e68d71d83802';
const CHAPTER_NUMBER = 2;

const HERO_STYLE =
  'Dark cinematic background, atmospheric Indian-illustration style, painterly, no text overlay.';

function hero(prompt) {
  return {
    id: uuid(), type: 'image', order: 0, src: '', alt: 'Hero banner', caption: '',
    width: 'full', aspect_ratio: '16:5',
    generation_prompt: `${prompt} ${HERO_STYLE}`,
  };
}
function text(markdown) { return { id: uuid(), type: 'text', order: 0, markdown }; }
function heading(txt, level = 2) { return { id: uuid(), type: 'heading', order: 0, text: txt, level }; }
function callout(variant, title, markdown) { return { id: uuid(), type: 'callout', order: 0, variant, title, markdown }; }
function image(alt, caption, generation_prompt, aspect_ratio = '3:2') {
  return {
    id: uuid(), type: 'image', order: 0, src: '', alt, caption, width: 'full', aspect_ratio,
    generation_prompt: `${generation_prompt} Dark background, orange accent labels, clean technical illustration style.`,
  };
}
function curiosityPrompt(prompt, hint, reveal) { return { id: uuid(), type: 'curiosity_prompt', order: 0, prompt, hint, reveal }; }
function reasoningPrompt(reasoning_type, prompt, options, reveal, difficulty_level) {
  return { id: uuid(), type: 'reasoning_prompt', order: 0, reasoning_type, prompt, options, reveal, difficulty_level };
}
function table(caption, headers, rows) { return { id: uuid(), type: 'table', order: 0, caption, headers, rows }; }
function quiz(questions) {
  return { id: uuid(), type: 'inline_quiz', order: 0, pass_threshold: 0.67, questions: questions.map((q) => ({ id: uuid(), ...q })) };
}
function withOrders(blocks) { return blocks.map((b, i) => ({ ...b, order: i })); }

// ─────────────────────────────────────────────────────────────────────────────
const p1 = {
  slug: 'plate-tectonics-earths-moving-crust',
  title: "Plate Tectonics — The Earth's Moving Crust",
  subtitle: "The ground under your feet is not still — it's one of several giant plates drifting a few centimetres a year.",
  blocks: withOrders([
    hero('Ultra-wide banner (16:5). A cutaway cross-section view of the Earth, glowing layered interior (crust, mantle, core) visible beneath a rocky mountainous surface at dusk, conveying immense slow movement beneath solid ground.'),
    curiosityPrompt(
      "Right now, the ground beneath your feet is moving — just a few centimetres a year, about as fast as your fingernails grow. Before reading on, what do you think could possibly move something as massive as solid rock, even that slowly?"
    ),
    text(
      "The Earth's surface is not fixed — it is constantly transformed by powerful forces acting from within and on the surface of the planet. One of the most important ideas explaining these changes is the theory of **plate tectonics**, given by W.J. Morgan, which describes how large pieces of the Earth's crust move slowly over the molten mantle beneath.\n\nAccording to this theory, the outermost layer of the Earth is not one single piece, but broken into several large and small pieces called **tectonic plates**. Understanding plate tectonics helps explain earthquakes, volcanic eruptions, and the formation of continents and oceans."
    ),
    heading('Three Layers Deep'),
    text(
      "The Earth is made up of three main layers: the **crust** (the outermost layer we live on), the **mantle** (very thick and hot, lying below the crust), and the **core** (the innermost layer, extremely hot and heavy).\n\nThe crust, together with the upper part of the mantle, forms the **lithosphere** — and this lithosphere is exactly what's broken into different tectonic plates. Beneath it lies the **asthenosphere**, a semi-molten layer that allows the plates to actually move."
    ),
    image(
      "Cutaway diagram of the Earth's interior layers",
      "📸 The Earth's interior — crust, mantle and core",
      "Cross-section diagram of the Earth's interior showing concentric layers: a thin crust, the lithosphere (crust plus upper mantle), the semi-molten asthenosphere, the thick mantle, the outer core and the inner core. Label: Crust, Lithosphere, Asthenosphere, Mantle, Outer core, Inner core."
    ),
    heading('Three Kinds of Plates'),
    text(
      "Tectonic plates are massive slabs of solid rock that move very slowly, usually a few centimetres per year. There are three main types: **continental plates** (which carry continents), **oceanic plates** (which carry ocean floors), and **mixed plates** (which carry both). Some of the major tectonic plates include the Pacific, Eurasian, African, North American, South American, Indo-Australian, and Antarctic plates."
    ),
    reasoningPrompt(
      'logical',
      "A geologist says the Indo-Australian plate is a 'mixed' plate. Based on what this page says about plate types, what must that mean?",
      [
        "It carries both continental landmass and ocean floor together as one connected plate",
        "It is made from a mixture of crust and mantle rock fused together into one layer",
        "It changes between being continental and oceanic depending on the season and temperature",
        "It is smaller than all the other plates and moves in a mixed, unpredictable direction",
      ],
      "Mixed plates carry continents and ocean floor together — the Indo-Australian plate carries India, Australia, and the ocean floor between and around them.",
      2
    ),
    heading('What Actually Makes Them Move'),
    text(
      "The movement of tectonic plates is caused by **convection currents** in the mantle. Heat from the Earth's core causes molten material to rise, while cooler material sinks. This continuous movement creates convection currents that push and pull the tectonic plates, causing them to move in different directions."
    ),
    callout(
      'threads_of_curiosity',
      'Threads of Curiosity',
      "A tectonic plate moves about as fast as your fingernails grow — a few centimetres a year. Over tens of millions of years, that same slow drift carried the Indian plate thousands of kilometres north before it collided with Asia and pushed up the Himalaya. What do you think a few centimetres a year adds up to, once you multiply it across a hundred million years?"
    ),
    quiz([
      {
        question: 'According to this page, what forms when the crust and the upper part of the mantle combine?',
        options: [
          "The lithosphere — the rigid outer layer that is broken into separate tectonic plates",
          "The asthenosphere — the semi-molten layer that allows plates to slide",
          "The core — the extremely hot and heavy innermost layer of the Earth",
          "The convection zone — a special layer that only exists beneath ocean plates",
        ],
        correct_index: 0,
        explanation: "The page defines the lithosphere as the crust plus the upper mantle — this rigid combined layer is what's broken into tectonic plates.",
        difficulty_level: 1,
      },
      {
        question: 'A tectonic plate is found to carry a large ocean floor on one side and a full continent on the other, joined as a single connected plate. Which type of plate is this?',
        options: [
          "An oceanic plate, since ocean floor is present somewhere on it",
          "A mixed plate, since it carries both continental landmass and ocean floor together",
          "A continental plate, since a continent is present somewhere on it",
          "None of these — a single plate can never carry both continent and ocean floor",
        ],
        correct_index: 1,
        explanation: "A mixed plate is defined exactly this way — carrying both continents and ocean floor as one connected piece, like the Indo-Australian plate.",
        difficulty_level: 2,
      },
      {
        question: "If convection currents inside the mantle suddenly stopped completely, what would this page suggest happens to the movement of tectonic plates?",
        options: [
          "Plates would move even faster, since they'd no longer be slowed down by mantle heat",
          "Nothing would change, since convection currents have no real connection to plate movement",
          "Plate movement would stop, since convection currents are described as the force that pushes and pulls the plates",
          "Plates would instantly reverse direction and move back to their original position",
        ],
        correct_index: 2,
        explanation: "The page states plate movement is caused by convection currents — remove the cause, and the page's own logic says the movement would stop.",
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
const p2 = {
  slug: 'plate-boundaries-earthquakes-and-volcanoes',
  title: 'Where Plates Meet — Earthquakes, Mountains and Volcanoes',
  subtitle: "Every mountain range, every earthquake, almost every volcano on Earth happens at the edge of a plate.",
  blocks: withOrders([
    hero('Ultra-wide banner (16:5). A dramatic mountain range meeting a coastline at dusk, with a faint volcanic glow on the horizon and subtle cracks in the landscape suggesting a tectonic boundary beneath the surface.'),
    curiosityPrompt(
      "Most of the world's earthquakes and volcanoes happen in a huge ring around the Pacific Ocean, nicknamed the 'Ring of Fire.' Before reading on, why do you think earthquakes and volcanoes would cluster in one specific ring shape, instead of being scattered randomly across the whole planet?"
    ),
    text(
      "The edges where tectonic plates meet are called **plate boundaries**, and there are three main types. At a **convergent boundary**, plates move toward each other — when continental plates collide, they form fold mountains like the Himalaya; when an oceanic plate collides with a continental plate, the oceanic plate sinks beneath it, causing volcanic activity and earthquakes.\n\nAt a **divergent boundary**, plates move apart, magma rises from below to form new crust, creating features like mid-ocean ridges (the Mid-Atlantic Ridge is a good example). At a **transform boundary**, plates slide past each other without creating or destroying crust — this mainly causes earthquakes, such as along the San Andreas Fault in the United States."
    ),
    image(
      'World map of tectonic plates with movement arrows',
      "📸 The major tectonic plates and their movement",
      "World map illustration showing tectonic plates as large jigsaw-piece regions separated by boundary lines, with arrows indicating direction of movement. Label: Pacific plate, Eurasian plate, African plate, North American plate, South American plate, Indo-Australian plate, Antarctic plate."
    ),
    heading('The Ring of Fire'),
    text(
      "Plate tectonics plays a major role in shaping the Earth's surface — plate movement leads to mountains, valleys, ocean basins, volcanoes and earthquakes, and explains the distribution of continents and oceans. Most earthquakes and volcanoes occur along plate boundaries, especially around the Pacific Ocean, an area known as the **Ring of Fire**."
    ),
    reasoningPrompt(
      'logical',
      "A city sits exactly where an oceanic plate is sinking beneath a continental plate. Based on this page, which of these should the city's planners prepare for?",
      [
        "Both volcanic activity and earthquakes, since this convergent boundary type causes both",
        "Only mid-ocean ridge formation, since new crust is created at every convergent boundary",
        "Only mild tremors, since oceanic-continental collisions are the gentlest type of plate boundary",
        "Neither — earthquakes and volcanoes only happen at transform boundaries like the San Andreas Fault",
      ],
      "The page is explicit: when an oceanic plate sinks beneath a continental one, it leads to both volcanic activity and earthquakes — this is exactly the boundary type a planner in such a city would need to prepare for.",
      2
    ),
    heading("India's Earthquake Risk"),
    text(
      "India has experienced some major earthquakes in the past, resulting in thousands of deaths — a large earthquake in a densely populated country like India can cause severe damage to life and environment, as seen in the major earthquake in Gujarat in 2001."
    ),
    image(
      'Structural damage to buildings after an earthquake',
      "📸 The damage a major earthquake can cause",
      "Respectful documentary-style illustration of earthquake damage to a small Indian town — cracked building facades, exposed support beams, rescue and repair work in progress. No depiction of injured people. Dusk lighting, sombre tone."
    ),
    callout(
      'india_science',
      "India's Ancient Study of Earthquakes",
      "Earthquakes were known in early India as **bhukampa**, meaning the shaking of the Earth. In the **Brihatsamhita**, Varahamihira dedicated a whole section to earthquakes, noting how changes in wind, rain, clouds, animal behaviour and planetary alignments could signal them — attributing quakes to four elemental forces (Vayu/wind, Agni/fire, Indra/thunder, Varuna/water), each linked to specific constellations and regions. It reflects an early attempt to blend careful observation with the reasoning tools available at the time."
    ),
    callout(
      'threads_of_curiosity',
      'Threads of Curiosity',
      "India's only mud volcano sits on Baratang Island in the Andaman and Nicobar Islands — mud bubbles out from underground gas and pressure, instead of fire and lava. It looks like a tiny volcano but works on a completely different, gentler principle. What do you think actually causes the difference between mud bubbling up and molten lava erupting?"
    ),
    quiz([
      {
        question: 'Which type of plate boundary is responsible for fold mountains like the Himalaya?',
        options: [
          "Divergent boundary, where plates move apart",
          "Transform boundary, where plates slide past each other",
          "A boundary with no plate movement at all",
          "Convergent boundary, where two continental plates collide",
        ],
        correct_index: 3,
        explanation: "The page states directly that colliding continental plates at a convergent boundary form fold mountains such as the Himalaya.",
        difficulty_level: 1,
      },
      {
        question: "A country lies directly along the San Andreas Fault, where two plates slide past each other without creating or destroying crust. Based on this page, what should this country mainly prepare for?",
        options: [
          "Earthquakes, since transform boundaries like this one mainly cause earthquakes rather than volcanic activity",
          "Volcanic eruptions, since all plate boundaries produce volcanoes eventually",
          "Mid-ocean ridge formation, since new crust always forms at transform boundaries",
          "No natural hazards at all, since transform boundaries are described as the safest boundary type",
        ],
        correct_index: 0,
        explanation: "The San Andreas Fault is named on this page as a transform boundary example, and transform boundaries are described as mainly causing earthquakes.",
        difficulty_level: 2,
      },
      {
        question: "Ancient Indian scholars like Varahamihira linked earthquakes to signs such as changes in wind, animal behaviour and planetary alignments, rather than to plate tectonics. What is the fairest way to describe this, based on the page?",
        options: [
          "It proves ancient Indian scholars had no real interest in understanding earthquakes at all",
          "It was an early, systematic attempt to observe and explain earthquakes using the concepts and reasoning tools available at the time, before plate tectonics was known",
          "It is scientifically identical to modern plate tectonics, just using different names for the same plates",
          "It has no connection whatsoever to how earthquakes are studied and explained today",
        ],
        correct_index: 1,
        explanation: "The page frames Varahamihira's work as blending careful observation with the cosmological reasoning available at the time — a genuine early attempt at systematic study, not identical to modern tectonics but not dismissible either.",
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
const p3 = {
  slug: 'weathering-breaking-rock-in-place',
  title: 'Weathering — When Rock Breaks Where It Stands',
  subtitle: "Before a river or wind can carve a landscape, something first has to crack the rock into pieces.",
  blocks: withOrders([
    hero('Ultra-wide banner (16:5). Close-up of a weathered, cracked rock face at dusk with visible fractures and crumbling edges, moss and a small root growing into one of the cracks.'),
    curiosityPrompt(
      "A single tree root, growing slowly inside a crack in solid rock, can eventually split a boulder in two — with no tools and no explosives, nothing but patient growth. Before reading on, what other slow, quiet forces do you think could break solid rock apart, without ever moving the broken pieces away?"
    ),
    text(
      "**Weathering** is the process through which rocks on the Earth's surface break down into smaller pieces. It does not involve movement of the broken material — only the breaking down.\n\nThere are three main types: **physical weathering**, where rocks break due to temperature changes, frost or wind; **chemical weathering**, where minerals in rocks react with water, air or acids to form new substances; and **biological weathering**, caused by plants, animals or micro-organisms — for example, when plant roots grow into cracks and split rocks apart."
    ),
    image(
      'Three types of weathering shown side by side',
      "📸 Physical, chemical and biological weathering",
      "Three-panel diagram showing weathering types side by side: physical (an ice-filled crack widening in a rock face under freezing temperatures), chemical (acidic rainwater dissolving a rock surface), and biological (a tree root splitting a rock crack apart)."
    ),
    reasoningPrompt(
      'logical',
      "A rock face in a cold mountain region cracks apart after repeated freezing and thawing of water inside its cracks, with no chemical change to the rock's minerals. Which type of weathering is this?",
      [
        "Physical weathering, since the rock breaks apart from temperature changes and ice, without any chemical reaction",
        "Chemical weathering, since water is involved and water always causes a chemical reaction with rock",
        "Biological weathering, since ice crystals are technically a natural, living-like process",
        "Erosion, since the cracked pieces are automatically carried away once they form",
      ],
      "Freezing and thawing water cracking a rock apart, with no chemical change, is exactly what this page describes as physical weathering.",
      2
    ),
    callout(
      'threads_of_curiosity',
      'Threads of Curiosity',
      "Weathering never moves rock anywhere — it only breaks it apart exactly where it stands. So what turns those broken pieces into a valley, a plain, or a cave? That is a different process — one the next page picks up."
    ),
    quiz([
      {
        question: 'Which type of weathering is caused specifically by plant roots growing into cracks and splitting rocks apart?',
        options: ['Physical weathering', 'Chemical weathering', 'Biological weathering', 'Erosion'],
        correct_index: 2,
        explanation: "The page names plant roots splitting rock as the specific example of biological weathering.",
        difficulty_level: 1,
      },
      {
        question: "A rock's minerals slowly react with acidic rainwater over many years, turning into completely new substances without any temperature change or living organism involved. Which type of weathering is this?",
        options: [
          "Physical weathering, since any natural process outdoors counts as physical",
          "Biological weathering, since rain falling from the sky is part of the water cycle that living things depend on",
          "Erosion, since the changed material has clearly been moved elsewhere",
          "Chemical weathering, since the rock's minerals react with water and acid to form new substances",
        ],
        correct_index: 3,
        explanation: "A mineral reacting with water and acid to form new substances, with no movement and no organism involved, matches chemical weathering exactly.",
        difficulty_level: 2,
      },
      {
        question: 'Weathering breaks rock apart but never moves the pieces away. Based on this page, what must still happen before a weathered rock face can turn into a valley or a plain?',
        options: [
          "A separate process — erosion — must move the broken material away, since weathering alone only breaks rock, it doesn't transport it",
          "Nothing else needs to happen, since weathering by itself directly creates valleys and plains",
          "The weathered rock must first turn into a moraine before anything else can happen to it",
          "Only wind can ever move weathered rock; water and ice have no role in this process",
        ],
        correct_index: 0,
        explanation: "The page explicitly distinguishes weathering (breaking down, no movement) from erosion (which involves movement) — erosion is the missing step.",
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
const p4 = {
  slug: 'erosion-and-indias-ancient-water-wisdom',
  title: "Erosion — and India's Ancient Answer to It",
  subtitle: "Erosion carries land away — and Indian civilisations were engineering ways to slow it down thousands of years before the word 'erosion' existed.",
  blocks: withOrders([
    hero('Ultra-wide banner (16:5). A farmer\'s terraced hillside at dusk with visible earthen bunds and contour trenches holding back soil, water flowing gently along a channel, an ancient irrigation feel to the scene.'),
    curiosityPrompt(
      "A farmer watches his family's best topsoil quietly wash away after every heavy monsoon rain, year after year. Before reading on, what do you think determines whether that lost soil is gone for good, or whether it has just been moved somewhere else nearby?"
    ),
    text(
      "**Erosion** is the process by which soil, rocks and other surface materials are worn away and carried from one place to another by natural agents like water, wind, ice or waves. Unlike weathering, erosion involves **movement** of the broken material.\n\nThere are several types: **water erosion** (rivers, rain, ocean waves), **wind erosion** (dry and sandy areas), **glacial erosion** (moving ice), and **coastal erosion** (sea waves along the shore). Erosion shapes landforms, and can both create and destroy features on the Earth's surface."
    ),
    image(
      'Water erosion and wind erosion side by side',
      "📸 Erosion caused by water and by wind",
      "Split illustration showing water erosion (a gully cut into a hillside by flowing rainwater) beside wind erosion (sand carved into a rippled dune surface by strong wind)."
    ),
    heading('What Erosion Costs People'),
    text(
      "Erosion affects many human occupations. For farmers, it removes the fertile topsoil needed for crop growth, leading to lower yields. For those living near rivers and coasts, it can wash away land, houses and roads. In construction and mining, erosion destabilises land, posing safety risks. Even tourism and fishing suffer, since beaches, rivers and fertile lands may be destroyed — erosion shapes the Earth's surface, but it also directly affects human labour and livelihoods."
    ),
    reasoningPrompt(
      'logical',
      "A fishing village notices its beach getting narrower every year, and a nearby cliff crumbling a little more after each monsoon. Based on what this page says about erosion's effects on livelihoods, which industries in that village are most directly at risk?",
      [
        "Tourism and fishing, since eroding beaches and unstable land directly threaten the places these industries depend on",
        "Only farming, since erosion is described as affecting crop fields and nothing else",
        "Only construction, since cliffs are the only erosion feature this page mentions as risky",
        "None of the local industries, since erosion mainly affects rocks and has no real economic impact",
      ],
      "The page names tourism and fishing directly — beaches and fertile lands being destroyed by erosion is exactly the risk this village is facing.",
      3
    ),
    heading("India's Ancient Engineering Against Erosion"),
    callout(
      'india_science',
      "Millennia of Water Conservation",
      "The Sindhu-Sarasvati civilisation used **contouring, bunding, terracing, dams and canals** for water management — practices documented across Sanskrit texts including the Vedas, Krishiparashara, and Kautilya's Arthashastra, which contains detailed guidelines on assessing land by fertility. In Nagaland, the **Zabo system** still uses earthen bunds on hillslopes for soil and water conservation today, alongside check dams that slow water flow and recharge groundwater."
    ),
    quiz([
      {
        question: 'According to this page, what is the key difference between weathering and erosion?',
        options: [
          "Weathering only happens in deserts, while erosion only happens near rivers",
          "Erosion involves the movement of broken material to a new place, while weathering only breaks rock down without moving it",
          "There is no real difference — the two words describe exactly the same process",
          "Weathering is caused only by water, while erosion is caused only by wind",
        ],
        correct_index: 1,
        explanation: "The page states erosion involves movement of material, unlike weathering, which only breaks rock down in place.",
        difficulty_level: 1,
      },
      {
        question: "A construction company is planning to build on a steep hillside that has recently experienced heavy erosion. Based on this page, what specific risk should they be most concerned about?",
        options: [
          "Rising sea levels flooding the construction site",
          "A sudden increase in the region's rainfall pattern",
          "Destabilised land from erosion, which this page names as a safety risk in construction and mining",
          "A shortage of building materials caused by erosion",
        ],
        correct_index: 2,
        explanation: "The page names destabilised land as a specific safety risk erosion creates in construction and mining.",
        difficulty_level: 2,
      },
      {
        question: 'The Sindhu-Sarasvati civilisation used contouring, bunding and terracing thousands of years ago, and the Zabo system in Nagaland still uses similar earthen bunds today. What does this tell you about erosion control?',
        options: [
          "That erosion control methods only work in Nagaland and nowhere else in India",
          "That erosion was not considered a problem until very recently in Indian history",
          "That contouring and bunding were abandoned entirely once modern engineering was invented",
          "That effective, low-technology methods for slowing erosion and conserving water have existed in India for millennia and are still in active use today",
        ],
        correct_index: 3,
        explanation: "The page traces the same basic methods from the Sindhu-Sarasvati civilisation all the way to the present-day Zabo system — a continuous, still-active tradition.",
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
const p5 = {
  slug: 'agents-of-gradation-and-landforms-in-history',
  title: 'Five Forces That Sculpt the Land — and How They Shaped History',
  subtitle: 'Running water, glaciers, wind, waves and groundwater are still carving the world today — and they already decided where empires could rise.',
  blocks: withOrders([
    hero('Ultra-wide banner (16:5). Five different landscapes blending into one connected frame at dusk: a river valley, a glacier, a desert dune, a coastline, and a cave mouth, joined by soft light.'),
    curiosityPrompt(
      "The Himalayas blocked foreign armies from invading India for centuries, yet still let traders and travellers cross through mountain passes. Before reading on, do you think a single landform can be both a wall and a doorway at the same time?"
    ),
    text(
      "**Agents of gradation** are natural forces that wear down, transport and deposit materials on the Earth's surface, helping to level or smooth it over time. The main agents are **running water, glaciers, wind, waves, and groundwater**. Running water erodes rocks and soils to form valleys and plains; glaciers scrape and carve U-shaped valleys; wind shapes deserts; sea waves erode coastlines to form cliffs, beaches and bays; groundwater dissolves rock like limestone, creating caves and sinkholes. Together, these agents continuously modify landforms — lowering high areas, filling up low areas."
    ),
    heading('How Landforms Decided Where History Happened'),
    text(
      "Rivers and fertile plains — like those of the Ganga, Nile, Brahmaputra and Indus — gave rise to agricultural societies and early cities. Mountains acted both as barriers and protectors: the Himalayas shielded India from invasions but also allowed cultural exchange through passes like the Khyber Pass. Deserts, such as the Thar, limited large settlements but encouraged trade routes like the Silk Route. Coasts and harbours supported trade, travel and cultural contact with distant lands, helping kingdoms in south India flourish. Wars, settlements, trade and cultural growth have all been deeply influenced by the land's physical features."
    ),
    reasoningPrompt(
      'analogical',
      'The Thar desert limited the growth of large settlements in that region, yet it also encouraged the rise of trade routes like the Silk Route. What does this tell you about how a single landform can affect human history?',
      [
        "The same landform can restrict one kind of human activity (large settlements) while enabling a completely different one (long-distance trade) at the same time",
        "Deserts always prevent both settlement and trade equally, so the Thar desert must be an unusual exception",
        "The Silk Route actually formed because of the Ganga river, not because of any desert landform",
        "Once a landform limits one kind of human activity, it limits every other kind of human activity as well",
      ],
      "The page shows the Thar desert doing both at once — limiting settlement while encouraging trade — proof that one landform can shape history in more than one direction simultaneously.",
      3
    ),
    callout(
      'bridging_science',
      'Bridging Geography and Real Life',
      "Coastal landforms directly built real economic power: kingdoms in south India used their natural harbours to trade with distant lands across the Indian Ocean, turning a physical coastline into centuries of maritime wealth and cultural exchange."
    ),
    quiz([
      {
        question: 'Which of these is named on this page as one of the five main agents of gradation?',
        options: ['Groundwater', 'Sunlight', 'Volcanic ash', 'Earthquakes'],
        correct_index: 0,
        explanation: "The five agents named on this page are running water, glaciers, wind, waves and groundwater.",
        difficulty_level: 1,
      },
      {
        question: 'A region has fertile river plains encouraging farming and dense population, alongside a mountain range that historically blocked invading armies but let traders through its passes. Based on this page, which historical pattern does this best match?',
        options: [
          "A desert limiting settlement while encouraging trade routes",
          "River plains supporting agricultural societies, with mountains acting as both barrier and protector — much like the Ganga plains and the Himalayas",
          "A coastline enabling maritime trade for a kingdom",
          "Glacial valleys supporting early human settlement",
        ],
        correct_index: 1,
        explanation: "This matches the page's Ganga-plains-and-Himalayas example exactly — fertile river plains plus a mountain range that both blocks and permits passage.",
        difficulty_level: 2,
      },
      {
        question: 'The Thar desert limited large settlements but also encouraged the Silk Route to develop through the region. What is the strongest reasoning-based lesson from this?',
        options: [
          "Deserts always help trade and never limit anything else about human activity",
          "A landform's effect on history is completely random and impossible to explain",
          "A single landform can restrict one kind of human activity while enabling a very different one at the same time",
          "The Silk Route actually had nothing to do with the desert's landform at all",
        ],
        correct_index: 2,
        explanation: "This is the page's core reasoning point about the Thar desert — restriction and enablement happening together, from the same landform.",
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
const p6 = {
  slug: 'rivers-waterfalls-meanders-and-deltas',
  title: "A River's Journey — Waterfalls, Meanders and Deltas",
  subtitle: 'The same river carves three completely different landforms, depending on where you catch it along its course.',
  blocks: withOrders([
    hero("Ultra-wide banner (16:5). A single river's journey shown in one continuous scene at dusk — a steep waterfall in distant mountains, winding curves through the middle ground, fanning into a delta meeting the sea in the foreground."),
    curiosityPrompt(
      "A river looks completely different near its mountain source than it does where it finally meets the sea. Before reading on, what do you think changes about a river's power and behaviour across that whole journey?"
    ),
    text(
      "Rivers shape the land through erosion, transportation and deposition, creating landforms along their course. In the **upper course**, steep gradients and strong erosive forces form V-shaped valleys, waterfalls and rapids. In the **middle course**, the river meanders, forming oxbow lakes and floodplains as it loses energy and begins depositing sediment. In the **lower course**, the river slows further and deposits large amounts of sediment, forming deltas, levees and alluvial fans."
    ),
    heading('Waterfalls'),
    text(
      "A waterfall is a landform where a river flows over a steep cliff or vertical drop. Waterfalls form in the upper course of rivers, where hard rock resists erosion while softer rock below is worn away, creating a sudden drop. Beyond being beautiful natural features, they attract tourists, are sometimes used for hydroelectric power, and offer recreation such as trekking and photography."
    ),
    image(
      'Cross-section diagram of a waterfall',
      "📸 How a waterfall forms",
      "Cross-section diagram of a waterfall showing a river flowing over a hard rock ledge, undercut soft rock creating a gap beneath it, and a plunge pool at the base. Label: River, Hard rock, Gap, Plunge pool."
    ),
    heading('Meanders'),
    text(
      "A meander is a winding curve or bend in the middle or lower course of a river, formed by lateral erosion of the outer bank and deposition on the inner bank, gradually creating large loops. Meanders are important for humans: fertile soil deposited along their banks supports agriculture, they influence settlement patterns, and they are used for navigation, irrigation and tourism. The Grand Anicut, also known as Kallanai in Tamil Nadu, is an example of rivers being used for irrigation."
    ),
    image(
      'Diagram of a river meander with an oxbow lake',
      "📸 A meander — the river's winding loop",
      "Diagram of a river meander showing a winding S-curve, an oxbow lake cut off to one side, a steep outer bank, and a river bar of deposited sediment on the inner bank. Label: Oxbow lake, Steep bank, River, Bar."
    ),
    heading('Deltas'),
    text(
      "A delta is a landform formed at the mouth of a river, where it flows into a sea, ocean or lake and deposits the sediment it has carried. Over time, these deposits accumulate into a fan-shaped or triangular area of land. Deltas are highly fertile, ideal for crops like rice and jute, and important for fishing, trade and transportation — though they can also be prone to flooding. The Sundarbans delta is a well-known example, popular with tourists for its uniqueness."
    ),
    reasoningPrompt(
      'logical',
      'A geography student is shown three photos: a steep drop with churning water in a mountain valley, a winding S-shaped curve in a slow river, and a fan-shaped stretch of land where a river meets the sea. Based on this page, in what order did the river most likely pass through these three stages?',
      [
        "Waterfall (upper course) then meander (middle course) then delta (lower course), matching the river's journey from steep source to flat mouth",
        "Delta then meander then waterfall, since rivers slow down first and speed up only near the very end",
        "Meander then waterfall then delta, since rivers always curve before they ever drop steeply",
        "All three landforms form in the exact same stage of a river's course, at the same time",
      ],
      "This matches the river's course exactly as described: waterfalls in the upper course, meanders in the middle, deltas in the lower course.",
      2
    ),
    quiz([
      {
        question: "In which part of a river's course do waterfalls typically form?",
        options: [
          "The lower course, where the river is widest",
          "The middle course, where the river meanders",
          "At the delta, where the river meets the sea",
          "The upper course, where hard rock resists erosion while softer rock below wears away",
        ],
        correct_index: 3,
        explanation: "The page places waterfalls specifically in the upper course, where hard rock resists erosion above softer rock below.",
        difficulty_level: 1,
      },
      {
        question: 'A geographer finds fertile soil and several villages built along the gentle slopes of a winding, looping river bend. Which landform is most likely responsible for this pattern?',
        options: [
          "A meander, since its fertile bank soil and gentle slopes are described as attracting agriculture and settlement",
          "A waterfall, since waterfalls are known to support nearby farming villages",
          "A delta, since deltas always form in the middle of a river's course",
          "An oxbow lake alone, without any connection to the river's meander",
        ],
        correct_index: 0,
        explanation: "The page describes meanders exactly this way — fertile bank soil and gentle slopes attracting agriculture and settlement.",
        difficulty_level: 2,
      },
      {
        question: 'The Sundarbans delta supports dense human settlement and fishing, but this page also says deltas can be prone to flooding. What is the strongest way to describe this trade-off?',
        options: [
          "Deltas are entirely safe places to live, and the flooding risk mentioned doesn't really apply to real deltas",
          "A delta's fertile soil and fishing grounds make it attractive to live in, even though the same low, flat land that makes it fertile also makes it vulnerable to flooding",
          "Flooding in deltas only ever affects fishing, never farming or settlements",
          "The fertility of a delta and its flood risk are completely unrelated to each other",
        ],
        correct_index: 1,
        explanation: "The page names both the fertility/settlement benefits and the flooding risk of deltas together — the same low, sediment-rich land creates both.",
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
const p7 = {
  slug: 'coastal-landforms-beaches-cliffs-and-stacks',
  title: 'Where Land Meets Sea — Beaches, Cliffs and Sea Stacks',
  subtitle: 'The same waves that build a beach in one place are tearing a cliff apart in another, just a little further down the coast.',
  blocks: withOrders([
    hero('Ultra-wide banner (16:5). A dramatic coastline at dusk showing a sandy beach transitioning into tall eroded sea cliffs with an arch and a lone sea stack further along, waves breaking against both.'),
    curiosityPrompt(
      'A beach is made of loose sand that waves can rearrange in a single storm, while a sea cliff is solid rock that takes centuries to wear away. Before reading on, do you think the same ocean waves are responsible for both building the beach AND destroying the cliff?'
    ),
    text(
      "Waves and currents constantly move over the ocean surface, reshaping the land along the coastal zone into landforms like beaches, sand bars, sea cliffs, sea caves, arches and stacks.\n\nA **beach** is a landform made of sand, pebbles or rocks along a shoreline, created by the deposition of sediments by waves. Beaches are popular tourist destinations, provide fishing areas, and act as natural barriers against strong waves and coastal erosion."
    ),
    image(
      'Aerial diagram of a beach and coastline',
      "📸 A beach along the coast",
      "Aerial-view diagram of a beach and bay coastline showing a headland, a sand bar, and a river mouth. Label: Beach, Bay, Headland, Sand bar."
    ),
    heading('When Waves Destroy Instead of Build'),
    text(
      "Coastal erosion occurs when waves, tides and currents wear away the land along the coast, creating landforms such as **cliffs** (steep rock faces formed as waves undercut the coast), **wave-cut platforms** (flat areas left behind as cliffs retreat), **caves** (formed where waves erode weak rock), **arches** (created when caves on opposite sides of a headland meet), and **stacks** (isolated pillars of rock left standing after an arch collapses)."
    ),
    image(
      'Diagram of a sea arch and sea stack',
      "📸 A sea arch and the sea stack it will eventually leave behind",
      "Diagram showing a rocky headland with a sea arch worn through it and an isolated sea stack standing separately nearby, waves breaking at the base of both, high-tide and low-tide lines marked."
    ),
    reasoningPrompt(
      'logical',
      'A tour guide points to an isolated pillar of rock standing alone in the sea, separate from the cliff, with no connection to the mainland anymore. Based on this page, what did this landform most likely used to be, just before it reached this stage?',
      [
        "A sea arch, which collapsed and left behind an isolated stack once its supporting rock gave way",
        "A beach, which hardened over time into solid standing rock",
        "A wave-cut platform, which slowly rose upward out of the sea to form a pillar",
        "It always existed exactly as it looks now, unconnected to any earlier stage",
      ],
      "The page's own sequence — cliff, cave, arch, stack — makes a stack the leftover pillar after an arch has collapsed.",
      3
    ),
    callout(
      'quest_continues',
      'The Quest Continues',
      "Coastlines are still changing right now — some beaches are growing as sediment piles up, while others are vanishing as sea levels rise and storms intensify. Coastal geographers are still working out exactly how fast different coastlines will retreat in the coming decades, because every coast erodes and rebuilds at its own pace."
    ),
    quiz([
      {
        question: 'What is a wave-cut platform?',
        options: [
          "A dune formed by wind blowing sand from a beach",
          "A moraine left behind by a retreating glacier",
          "A flat area left behind as a sea cliff retreats due to wave erosion",
          "A karst landform formed by underground water",
        ],
        correct_index: 2,
        explanation: "The page defines a wave-cut platform as a flat area left behind as cliffs retreat under wave erosion.",
        difficulty_level: 1,
      },
      {
        question: 'A stretch of coastline has a rocky headland with a hole worn all the way through it by waves, connecting two sides of the sea. Which coastal landform is this?',
        options: [
          "A wave-cut platform",
          "A sea stack",
          "A beach",
          "A sea arch, formed when caves erode from opposite sides of a headland until they meet",
        ],
        correct_index: 3,
        explanation: "The page defines a sea arch exactly this way — caves on opposite sides of a headland meeting to form a hole all the way through.",
        difficulty_level: 2,
      },
      {
        question: 'This page describes cliffs, wave-cut platforms, caves, arches and stacks as forming in that general order over time. Based on this, what does a sea stack tell you about a coastline\'s erosion history?',
        options: [
          "That an arch at that spot has already collapsed, since a stack is what remains after an arch gives way",
          "That the coastline has never experienced any wave erosion at all",
          "That a beach is about to form at that exact spot very soon",
          "That the rock at that location is completely resistant to any further erosion",
        ],
        correct_index: 0,
        explanation: "Following the page's own sequence, a stack is specifically what's left once an arch collapses — so its presence tells you an arch existed there before.",
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
const p8 = {
  slug: 'glacial-landforms-and-moraines',
  title: 'Ice That Carves Mountains — Glacial Landforms and Moraines',
  subtitle: "A glacier moves so slowly you'd never see it happen — yet it can carve a valley wide and deep enough to hold a lake.",
  blocks: withOrders([
    hero('Ultra-wide banner (16:5). A glacier at dusk carving through a mountain valley, sharp jagged ridges visible above, a wide U-shaped valley below it, cold blue-toned light.'),
    curiosityPrompt(
      "A river valley is shaped like a narrow V when you look at it in cross-section. A glacier-carved valley is shaped like a wide U. Before reading on, what do you think a glacier does differently from a river that would carve such a different shape?"
    ),
    text(
      "Glacial erosion occurs when glaciers slowly move over land, carving and shaping the landscape. Common landforms include **U-shaped valleys** (formed as glaciers widen and deepen river valleys), **cirques** (bowl-shaped depressions at the head of a glacier), **aretes** (sharp ridges between valleys), **hanging valleys** (which occur where smaller glaciers meet larger ones), and **fjords** (deep, narrow inlets created when the sea floods glacial valleys).\n\nThese landforms matter for humans in several ways: U-shaped valleys and cirques attract trekking, skiing and mountaineering tourism; fjords are used for harbours and fishing; and glaciers themselves are a crucial source of fresh water feeding rivers."
    ),
    image(
      'Diagram of a glaciated mountain landscape',
      "📸 A glacier-carved mountain landscape",
      "Diagram of a glaciated mountain landscape showing a sharp arete ridge, a bowl-shaped cirque at a glacier's head, a wide U-shaped valley carved below, and a smaller hanging valley joining from the side."
    ),
    heading('Moraines — What Glaciers Leave Behind'),
    text(
      "**Moraines** are landforms created by the deposition of rocks, soil and debris (called till) carried and left behind by glaciers, formed as a glacier melts and deposits the material it eroded. There are three types: **lateral moraines** (along the sides of glaciers), **terminal moraines** (at the end of a glacier, marking its furthest advance), and **medial moraines** (formed when two glaciers meet and their lateral moraines join in the middle). Moraines can create fertile agricultural soil, and can even form natural dams and lakes used for water supply, irrigation and hydroelectric power."
    ),
    reasoningPrompt(
      'logical',
      'A geologist finds a ridge of deposited rock and debris running right down the exact middle of a valley where two glaciers used to merge. Which type of moraine has she most likely found?',
      [
        "A medial moraine, since it forms in the middle where two glaciers' lateral moraines join after they meet",
        "A terminal moraine, since it marks wherever a glacier happened to melt fastest",
        "A lateral moraine, since all moraines by definition run along the side of a valley",
        "None of these — moraines only ever form at the very front edge of a single glacier",
      ],
      "A medial moraine is defined exactly this way — forming down the middle of a valley where two glaciers' lateral moraines join after merging.",
      2
    ),
    callout(
      'quest_continues',
      'The Quest Continues',
      "In February 2021, a sudden flood struck Chamoli district in Uttarakhand, damaging buildings, roads, bridges and hydel projects, and cutting off villages — with no unusual storm to blame. Investigators are still studying exactly how ice, rock and meltwater combined that day, the kind of glacier-linked disaster this page's moraines help explain, but that scientists are still working to predict early enough to save lives."
    ),
    quiz([
      {
        question: 'What shape is a valley typically carved by a glacier?',
        options: ['V-shaped', 'U-shaped', 'Triangular', 'Perfectly flat, with no distinct shape'],
        correct_index: 1,
        explanation: "The page describes glaciers widening and deepening valleys into a U shape, unlike a river's V-shaped valley.",
        difficulty_level: 1,
      },
      {
        question: 'A valley formed by a small tributary glacier joins a much larger glacial valley, but sits noticeably higher up, creating a small waterfall where the two meet. Which glacial landform does this describe?',
        options: [
          "A cirque",
          "An arete",
          "A hanging valley, formed where a smaller glacier's valley meets a larger one at a higher level",
          "A fjord",
        ],
        correct_index: 2,
        explanation: "The page defines a hanging valley exactly as occurring where a smaller glacier's valley meets a larger one, often at a higher level.",
        difficulty_level: 2,
      },
      {
        question: 'A ridge of deposited rock and soil is found running along the very edge of where a glacier once flowed, not in the middle and not at its furthest point. Which moraine type is this most likely to be, and why?',
        options: [
          "A terminal moraine, since all moraines mark the furthest point a glacier reached",
          "A medial moraine, since medial moraines can form anywhere along a glacier's length",
          "None of these — moraines never form along the sides of a glacier",
          "A lateral moraine, since this page describes lateral moraines specifically as forming along the sides of glaciers",
        ],
        correct_index: 3,
        explanation: "The page defines lateral moraines as forming specifically along the sides of glaciers, distinct from terminal (at the end) and medial (in the middle).",
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
const p9 = {
  slug: 'wind-landforms-deserts-dunes-and-oases',
  title: 'Wind at Work — Deserts, Dunes and Oases',
  subtitle: 'In a desert, wind does the same three jobs a river does elsewhere — breaking down, carrying, and depositing — just with sand instead of water.',
  blocks: withOrders([
    hero('Ultra-wide banner (16:5). A desert at dusk showing wind-sculpted sand dunes in the foreground and a distant rocky yardang ridge, warm orange light low on the horizon.'),
    curiosityPrompt(
      "A rock in the desert can end up looking smooth and polished, almost like it was sandblasted on purpose. Before reading on, what do you think is actually doing that polishing, out in the open desert with no machines around?"
    ),
    text(
      "Wind erosion occurs when strong winds pick up and carry away loose particles of sand and soil, creating distinctive landforms: **yardangs** (streamlined rock ridges carved by wind), **ventifacts** (rocks polished and shaped by sandblasting), **deflation hollows** or blowouts (shallow depressions formed where loose material is removed), and **desert pavements** (flat surfaces left behind after finer particles are blown away). These landforms influence settlement patterns and agriculture in arid regions, and attract tourists and geologists interested in unique desert landscapes."
    ),
    image(
      'Diagram of a yardang rock formation',
      "📸 A yardang carved by wind",
      "Diagram of a yardang landform showing a streamlined ridge of rock carved by wind, with softer rock eroded away beneath a harder resistant cap, wind arrows blowing across the surface. Label: Yardang, Wind, Hard rock, Soft rock."
    ),
    heading('Oases and Dunes'),
    text(
      "A deflation hollow that digs deep enough can reach the underground water table, creating an **oasis** — a patch of water and life in the middle of a desert.\n\n**Dunes** are hills or ridges of sand formed by wind. **Barchan dunes** are crescent-shaped, forming where sand is limited and wind blows from a single direction. **Longitudinal dunes** are long ridges parallel to the prevailing wind. **Star dunes** have multiple arms and form where winds come from different directions. **Parabolic dunes** are U-shaped, often stabilised by vegetation. Dunes act as natural barriers against desertification and wind erosion, and some protect coastal settlements from strong sea winds."
    ),
    image(
      'Three dune shapes compared side by side',
      "📸 Barchan, transverse and star dunes",
      "Diagram showing three dune shapes side by side under wind arrows: a crescent-shaped barchan dune, a long ridge transverse dune, and a multi-armed star dune."
    ),
    reasoningPrompt(
      'logical',
      'A desert region has strong wind blowing consistently from just one direction, and only a limited amount of loose sand available. Based on this page, which dune type would most likely form there?',
      [
        "A barchan dune, since it is crescent-shaped and forms specifically where sand is limited and the wind blows from a single direction",
        "A star dune, since star dunes form wherever wind is strong, regardless of direction",
        "A longitudinal dune, since these only need a single wind direction and no minimum sand limit at all",
        "A parabolic dune, since parabolic dunes form in any desert with strong steady wind",
      ],
      "This matches the definition of a barchan dune exactly — limited sand plus a single wind direction.",
      2
    ),
    callout(
      'threads_of_curiosity',
      'Threads of Curiosity',
      "A deflation hollow — a shallow dip scooped out by wind removing loose material — can sometimes dig deep enough to reach the water table underground. When that happens, the desert grows a genuine oasis right in the middle of dry sand. What do you think that first patch of green would mean for the animals and travellers passing through?"
    ),
    quiz([
      {
        question: 'What is a ventifact?',
        options: [
          "A rock polished and shaped by wind-driven sandblasting",
          "A ridge of sand deposited by wind in a desert",
          "A shallow depression formed by underground water dissolving rock",
          "A rock formation created entirely by glacial ice",
        ],
        correct_index: 0,
        explanation: "The page defines a ventifact as a rock polished and shaped by sandblasting.",
        difficulty_level: 1,
      },
      {
        question: 'A desert region experiences strong winds blowing from many different directions throughout the year. Based on this page, which dune type would most likely form there?',
        options: [
          "A barchan dune, since barchans form wherever wind blows from any direction",
          "A star dune, since star dunes form specifically where winds come from different directions",
          "A longitudinal dune, since longitudinal dunes require winds from many directions",
          "No dune could ever form under these wind conditions",
        ],
        correct_index: 1,
        explanation: "The page defines star dunes as forming specifically where winds come from different directions, matching this scenario.",
        difficulty_level: 2,
      },
      {
        question: 'A deflation hollow in the desert happens to dig down far enough to reach the underground water table. Based on this page, what is the most likely result?',
        options: [
          "The hollow immediately turns into a yardang instead",
          "Nothing changes, since deflation hollows have no connection to groundwater at all",
          "An oasis forms, since reaching the water table is exactly how this page describes an oasis appearing in the middle of a desert",
          "The hollow becomes a permanent sea, since desert groundwater is unlimited",
        ],
        correct_index: 2,
        explanation: "The page describes exactly this process — a deflation hollow reaching the water table is how an oasis forms.",
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
const p10 = {
  slug: 'underground-water-caves-and-karst-landscapes',
  title: 'The Landscape Hiding Underground — Caves and Karst',
  subtitle: "Some of the most dramatic landforms on Earth are never seen from above — they're carved entirely out of sight, underground.",
  blocks: withOrders([
    hero('Ultra-wide banner (16:5). The entrance to a limestone cave at dusk, stalactites hanging from a dimly lit ceiling just visible inside, a hint of an underground river glimmering deeper within.'),
    curiosityPrompt(
      "An icicle-shaped rock formation can take thousands of years to grow just a few centimetres, hanging from a cave ceiling with nothing supporting it from below. Before reading on, what do you think is slowly building that shape, drop by drop?"
    ),
    text(
      "Underground water, especially in areas of limestone or soluble rock, creates unique landforms called **Karst topography** through chemical weathering and erosion. Common landforms include **caves** (hollow spaces formed as acidic water dissolves rock), **stalactites** (icicle-shaped formations hanging from a cave ceiling), **stalagmites** (formations rising from the cave floor), **sinkholes or dolines** (depressions formed when the ground collapses into an underground cavity), and **underground rivers** (which flow through cave systems).\n\nThese landforms matter for humans — caves and underground rivers provide fresh water and tourism opportunities, and sometimes hold cultural or religious significance."
    ),
    image(
      'Cross-section diagram of a limestone cave',
      "📸 Inside a limestone cave",
      "Cross-section diagram of a limestone cave showing stalactites hanging from the ceiling, stalagmites rising from the floor where they meet as a pillar, and the cave mouth opening to the surface. Label: Stalactite, Pillar, Cave, Stalagmite, Cave mouth."
    ),
    reasoningPrompt(
      'logical',
      'A hiker in a limestone region suddenly sees the ground ahead collapse into a deep depression, revealing a hidden hollow space underneath. Based on this page, what has most likely just happened?',
      [
        "A sinkhole (doline) has formed, where the ground has collapsed into an underground cavity dissolved by acidic water over time",
        "A stalactite has fallen from a cave ceiling onto the surface above",
        "A moraine has suddenly shifted position underground",
        "A yardang has been carved out by wind directly beneath the surface",
      ],
      "This matches the page's definition of a sinkhole exactly — ground collapsing into an underground cavity dissolved by acidic water.",
      2
    ),
    callout(
      'bridging_science',
      'Bridging Geography and Real Life',
      "Underground rivers flowing through cave systems, and the caves themselves, are genuine sources of fresh water for communities living near karst landscapes — turning a hidden, invisible landform into a very real, everyday water supply."
    ),
    quiz([
      {
        question: 'What is the general name for the unique landscape created by underground water in limestone regions?',
        options: ['Gradation topography', 'Moraine topography', 'Deflation topography', 'Karst topography'],
        correct_index: 3,
        explanation: "The page names this landscape Karst topography.",
        difficulty_level: 1,
      },
      {
        question: 'A stalactite and a stalagmite in the same cave have grown toward each other for so long that they have finally joined together into one continuous column. Based on this page, what is this combined feature called?',
        options: [
          "A pillar, formed when a stalactite from the ceiling and a stalagmite from the floor meet",
          "A sinkhole, formed when the ground collapses into a cavity",
          "A moraine, formed by glacial deposition",
          "An underground river, formed by water flowing through a cave system",
        ],
        correct_index: 0,
        explanation: "A pillar is exactly this — a stalactite and stalagmite that have grown together into one column.",
        difficulty_level: 2,
      },
      {
        question: 'This page says caves and underground rivers form through chemical weathering and erosion caused by acidic water dissolving rock. What does this tell you about karst landscapes, compared to landforms shaped mainly by wind or ice?',
        options: [
          "That karst landforms form instantly, unlike wind or ice landforms which take thousands of years",
          "That karst landforms are shaped by a chemical process (rock dissolving) rather than the purely mechanical wearing-away that shapes many wind- or ice-carved landforms",
          "That karst landscapes have no connection to weathering or erosion at all",
          "That karst landscapes can only form in desert regions with no rainfall",
        ],
        correct_index: 1,
        explanation: "Karst landforms are distinguished by chemical dissolving of rock, unlike the mechanical carving typical of wind and ice landforms elsewhere in this chapter.",
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
const p11 = {
  slug: 'landforms-and-disasters',
  title: 'When Landforms Turn Dangerous — Four Disasters to Know',
  subtitle: "Landslides, avalanches, GLOFs and dust storms all trace back to the very landforms and forces you've just learned about.",
  blocks: withOrders([
    hero('Ultra-wide banner (16:5). A mountainous region at dusk suggesting unstable snow-capped slopes, a glacial lake, and a distant dust haze over dry plains — all four disaster settings connected in one landscape.'),
    curiosityPrompt(
      "A devastating flood struck Chamoli district in Uttarakhand in February 2021, killing many people and animals and severely damaging buildings, roads, bridges and hydel projects — even though there had been no unusual rainfall that day. Before reading on, what do you think could cause a sudden, destructive flood with no storm to blame?"
    ),
    heading('Landslides'),
    text(
      "Landslides are caused by natural and human factors making slopes unstable. Heavy, continuous rainfall lets water seep into soil and rock, increasing weight and reducing friction. Earthquakes and volcanic eruptions can trigger landslides by shaking the ground. Human activities — deforestation, mining, road construction, and unplanned construction on hillsides — disturb the natural balance of slopes, and poor drainage lets excess water accumulate, leading to sudden slope failure."
    ),
    heading('Avalanches'),
    text(
      "Avalanches are caused by the sudden instability of snow on steep mountain slopes. Heavy snowfall in a short period adds weight, especially on weak or loosely bonded snow layers. A sudden rise in temperature can cause partial melting, reducing friction. Strong winds may pile up snow unevenly, and natural disturbances or human activities like skiing or construction can trigger an avalanche by disturbing the balance."
    ),
    heading('Glacial Lake Outburst Floods (GLOFs)'),
    text(
      "GLOFs are caused by the sudden release of large volumes of water from glacial lakes. Rapid glacier melting increases the size and water level of these lakes, putting pressure on their natural dams of ice or moraine. Heavy rainfall can add excess water, and earthquakes, avalanches or landslides may strike the lake or weaken the dam, leading to its sudden collapse and a destructive flood downstream."
    ),
    heading('Dust Storms'),
    text(
      "Dust storms are caused by strong winds lifting large amounts of loose, dry soil and sand into the air. Prolonged drought and low rainfall dry out the soil, and sparse vegetation cover — often from deforestation, overgrazing, or poor farming practices — leaves land exposed. Climate change and extreme weather can further increase their frequency and intensity."
    ),
    table(
      'Four Landform-Linked Disasters at a Glance',
      ['Disaster', 'What Triggers It', 'Landform Connection'],
      [
        ['Landslides', 'Heavy rainfall, earthquakes, steep slopes, and human activity like deforestation and unplanned construction', 'Unstable slopes on hillsides and mountains'],
        ['Avalanches', 'Heavy snowfall, sudden warming, strong winds, and disturbances like skiing or construction', 'Steep, snow-covered mountain slopes'],
        ['GLOFs', 'Rapid glacier melting, heavy rainfall, and a weakened natural ice or moraine dam giving way', "Glacial lakes held back by moraines (this chapter's own glacial landforms)"],
        ['Dust storms', 'Strong winds, drought, and exposed soil from deforestation or overgrazing', 'Loose, dry soil in desert and semi-arid regions'],
      ]
    ),
    reasoningPrompt(
      'logical',
      'This page says GLOFs happen when a natural dam made of ice or moraine finally gives way. Based on everything you have read across this chapter, why would a moraine specifically be able to hold back a lake\'s worth of water in the first place?',
      [
        "Because a moraine is a landform made of rock, soil and debris deposited by a glacier — solid enough to act like a natural wall until pressure or a shock breaks it",
        "Because a moraine is actually made of solid ice all the way through, just like the glacier itself",
        "Because moraines are man-made structures built specifically to store glacial meltwater",
        "Moraines cannot hold back water at all, which is why GLOFs are considered completely unpredictable",
      ],
      "A moraine, as this chapter defines it, is a solid deposit of rock, soil and debris — solid enough to dam a lake until pressure or a shock finally breaks it.",
      3
    ),
    callout(
      'quest_continues',
      'The Quest Continues',
      "Scientists still can't reliably predict exactly when a GLOF, landslide or avalanche will strike — they can map which slopes and lakes are at risk, but the final trigger is often impossible to pin down in advance. This is an active area of disaster-science research, especially in the Himalayas."
    ),
    quiz([
      {
        question: 'According to this page, what is one major human cause of landslides, alongside natural causes like heavy rainfall?',
        options: [
          "Ocean tides rising and falling",
          "Increased biological weathering from plant roots",
          "Human activities such as deforestation, mining, and unplanned construction on hillsides",
          "The formation of new tectonic plates",
        ],
        correct_index: 2,
        explanation: "The page names deforestation, mining, and unplanned hillside construction directly as human causes of landslides.",
        difficulty_level: 1,
      },
      {
        question: 'A glacial lake, held back by a natural moraine dam, has been growing rapidly for years as nearby glaciers melt faster due to rising temperatures. Based on this page, what disaster is this lake most at risk of causing?',
        options: [
          "A dust storm, since dry conditions are the main trigger for that disaster",
          "A landslide, since only rainfall and unstable slopes cause landslides",
          "An avalanche, since only snow-covered slopes can produce avalanches",
          "A Glacial Lake Outburst Flood (GLOF), since a growing lake pressuring a weakening natural dam is exactly this page's description of what causes one",
        ],
        correct_index: 3,
        explanation: "This scenario matches the page's description of a GLOF precisely — a growing glacial lake pressuring its natural dam.",
        difficulty_level: 2,
      },
      {
        question: 'Dust storms are described as common in desert and semi-arid regions with sparse vegetation, often due to deforestation or overgrazing. Based on this, what would be a reasonable way to reduce the frequency of dust storms in a vulnerable region?',
        options: [
          "Protecting or restoring vegetation cover, since sparse vegetation from deforestation and overgrazing is named as a factor that leaves land exposed to wind",
          "Increasing overgrazing, since more livestock activity is shown to reduce wind speed",
          "Clearing more forest cover, since fewer trees are described as reducing dust storm risk",
          "Nothing can be done, since dust storms are caused only by wind and have no connection to land cover",
        ],
        correct_index: 0,
        explanation: "Since sparse vegetation from deforestation/overgrazing is named as a cause, protecting or restoring vegetation follows directly as a mitigation.",
        difficulty_level: 3,
      },
    ]),
  ]),
};

// ─────────────────────────────────────────────────────────────────────────────
const p12 = {
  slug: 'shaping-the-earths-surface-toolkit',
  title: "Shaping the Earth's Surface — Chapter Toolkit",
  subtitle: 'One planet, two kinds of forces — everything in this chapter comes down to that.',
  blocks: withOrders([
    hero('Ultra-wide banner (16:5). A full landscape panorama at dawn blending mountains, a river delta, a desert, a glacier and a coastline into one continuous view, symbolising the whole chapter coming together.'),
    curiosityPrompt(
      "Across this whole chapter, you've met landforms built by rivers, wind, ice, waves and groundwater — plus forces from deep inside the Earth. Before reading the close of this chapter, which single landform from everything you've read surprised you the most, and why?"
    ),
    text(
      "The Earth's surface is constantly changing due to forces working both inside and outside the planet. **Internal forces** — earthquakes, volcanic eruptions, folding and faulting — create mountains, valleys and ocean basins. **External forces** — weathering, erosion and deposition — slowly wear them down and reshape them. Together, these natural processes give rise to the diverse landforms we see today, from the highest peaks to the deepest ocean floors. Human life is deeply connected to these landforms, influencing our climate, resources, settlements and cultures."
    ),
    heading('Internal vs External — the Two Kinds of Forces'),
    text(
      "Internal forces **build up** the Earth's surface — plate tectonics, earthquakes, volcanoes, folding and faulting. External forces **wear down** what's been built — weathering, and erosion by water, wind, ice, waves and groundwater. Every landform you've studied in this chapter is the result of an ongoing tug-of-war between these two kinds of forces, still happening right now."
    ),
    reasoningPrompt(
      'logical',
      'A brand-new volcanic island rises out of the ocean overnight after an eruption. Based on everything in this chapter, what will most likely start happening to that island from the very next day onward?',
      [
        "External forces like weathering, wind and wave erosion will immediately begin wearing the new island down, even as internal forces may still be building it up",
        "Nothing will change on the island until the next major earthquake occurs somewhere else",
        "Only internal forces act on new volcanic islands — external forces only affect landforms that are already old",
        "The island will stay exactly the same shape forever, since it formed instantly and completely in one eruption",
      ],
      "This chapter's whole framework is that internal and external forces act continuously and together — a new island would immediately start being weathered and eroded, even while volcanic activity may still be shaping it.",
      3
    ),
    callout(
      'what_if',
      'What if…',
      "What if human activity — cutting down forests, building on unstable slopes, warming the climate enough to melt glaciers faster — starts speeding up landforms that would otherwise take thousands of years to change? What do you think that would mean for how ready communities need to be for disasters like the ones in this chapter?"
    ),
    text(
      "Understanding the shape of the Earth's surface helps you appreciate nature's power and prepare wisely for natural disasters, building a safer, more sustainable relationship with the planet. Every landform in this chapter — from a waterfall to a sand dune to a limestone cave — is really one chapter in the same ongoing story: the tug-of-war between forces building the Earth up, and forces wearing it back down."
    ),
    quiz([
      {
        question: "According to this chapter's closing recap, which of these is an example of an internal force shaping the Earth's surface?",
        options: [
          "Wind erosion carving a desert dune",
          "Volcanic eruptions and faulting, which build up mountains and valleys from within the Earth",
          "A river depositing sediment to form a delta",
          "Waves eroding a coastline into a sea cliff",
        ],
        correct_index: 1,
        explanation: "The recap names volcanic eruptions, folding and faulting as internal forces, distinct from external forces like erosion and deposition.",
        difficulty_level: 1,
      },
      {
        question: 'A newly formed volcanic island is being pushed upward by internal forces at the very same time that wind and waves are wearing away its edges. Based on this chapter, what does this describe?',
        options: [
          "A landform that is completely stable and unaffected by any natural forces",
          "A situation this chapter says is impossible, since internal and external forces cannot act at the same time",
          "The constant tug-of-war between internal forces building the Earth's surface up and external forces wearing it back down, described throughout this chapter",
          "A karst landform being shaped purely by underground water",
        ],
        correct_index: 2,
        explanation: "This is exactly the chapter's closing framework — internal and external forces acting together, continuously, on the same landform.",
        difficulty_level: 2,
      },
      {
        question: 'This chapter shows that human activities like deforestation and unplanned construction can speed up erosion, landslides and other natural hazards. Based on everything in this chapter, what is the strongest reasoning-based takeaway from this?',
        options: [
          "Human activity has no real effect on any landform process described in this chapter",
          "Only internal forces like earthquakes and volcanoes matter for disaster risk; human activity is irrelevant",
          "Landforms and disasters are completely separate from human decisions and cannot be influenced by them",
          "Human decisions can speed up or worsen natural processes that would otherwise unfold much more slowly, making understanding these landforms directly useful for reducing disaster risk",
        ],
        correct_index: 3,
        explanation: "Across erosion, landslides, dust storms and more, this chapter repeatedly shows human activity accelerating natural processes — understanding that link is exactly what makes this knowledge practically useful.",
        difficulty_level: 3,
      },
    ]),
  ]),
};

const PAGES = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12];

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db('crucible');
    const books = db.collection('books');
    const pagesCol = db.collection('book_pages');

    const book = await books.findOne({ _id: BOOK_ID });
    if (!book) throw new Error(`Book ${BOOK_ID} not found`);
    const chapter = (book.chapters || []).find((c) => c.number === CHAPTER_NUMBER);
    if (!chapter) throw new Error(`Chapter ${CHAPTER_NUMBER} not found on book ${BOOK_ID}`);

    const newPageIds = [];
    let skipped = 0;
    for (let i = 0; i < PAGES.length; i++) {
      const p = PAGES[i];
      const pageNumber = i + 1;
      const existing = await pagesCol.findOne({ book_id: BOOK_ID, slug: p.slug });
      if (existing) {
        console.log(`⏭  Page "${p.slug}" already exists — skipping (idempotent).`);
        skipped++;
        continue;
      }
      const _id = uuid();
      const doc = {
        _id, book_id: BOOK_ID, chapter_number: CHAPTER_NUMBER, page_number: pageNumber,
        slug: p.slug, title: p.title, subtitle: p.subtitle, blocks: p.blocks,
        hinglish_blocks: [], tags: [], published: false,
        reading_time_min: bw.computeReadingTime(p.blocks),
        content_types: bw.computeContentTypes(p.blocks),
        page_type: 'lesson', deleted_at: null, deleted_by: null, deletion_reason: null,
        created_at: new Date(), updated_at: new Date(),
      };
      await pagesCol.insertOne(doc);
      newPageIds.push(_id);
      console.log(`✓ Inserted page ${pageNumber}/12 "${p.slug}" (${p.blocks.length} blocks).`);
    }

    if (newPageIds.length) {
      await books.updateOne(
        { _id: BOOK_ID, 'chapters.number': CHAPTER_NUMBER },
        { $push: { 'chapters.$.page_ids': { $each: newPageIds } }, $set: { updated_at: new Date() } }
      );
      console.log(`✓ Wired ${newPageIds.length} new page_ids into chapter ${CHAPTER_NUMBER}.`);
    }
    console.log(`\n✅ Done. Inserted ${newPageIds.length}, skipped ${skipped} (already present).`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error('❌', err);
  process.exit(1);
});
