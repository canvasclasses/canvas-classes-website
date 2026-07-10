'use strict';
/**
 * Class 9 Science · Chapter 12 — BATCH: pages 59, 60, 61
 *   59 kingdom-fungi    ← §12.6.3 (mostly multicellular eukaryotes; chitin cell wall;
 *                          heterotrophic; mycelium; saprophytes/decomposers; mutualistic
 *                          & parasitic; yeast/mushrooms/Aspergillus/Penicillium; edible
 *                          mushrooms Bridging).
 *   60 kingdom-plantae  ← §12.6.4 intro (multicellular autotrophic eukaryotes; cellulose
 *                          cell wall; photosynthesis; base of food chains + oxygen; five
 *                          classes named — detail on p62).
 *   61 kingdom-animalia ← §12.6.5 intro (multicellular heterotrophic eukaryotes; no cell
 *                          wall; locomotion/response/coordination; notochord criterion →
 *                          non-chordata/chordata; chordata → protochordata/vertebrata —
 *                          phyla detail on p63).
 *
 * Grounded in iesc112.pdf. Template/quiz rules per §4B and §3.6.1 (see batch p2_4 header).
 *   node scripts/science-ch12/build_p5_7.js [--dry]
 */
const { img, txt, h, cur, callout, reason, q, quiz, applyPages } = require('./_lib');

// ── PAGE 59 — Kingdom Fungi ───────────────────────────────────────────────────
const p59 = [
  cur(
    'Walk through any old forest and notice what is *missing*. There are no thousand-year-old piles of dead leaves, no mountains of fallen branches, no heaps of dead animals. Something has been quietly eating all of it and turning it back into fresh soil. That something is not a plant and not an animal. It spreads underground as a hidden web of fine threads, and the mushroom you sometimes see popping up is only the tip of it. What is running this great clean-up?',
    'It cannot make its own food, so it feeds on what is already dead.',
    'These are the fungi — nature\'s recyclers. They break down dead plants and animals and return the nutrients to the soil. Without them, the forest floor would slowly bury itself. This page is about Kingdom Fungi.'
  ),
  img(
    'A cluster of mushrooms on a dark forest floor with a glowing web of fine threads spreading beneath the soil',
    'Ultra-wide cinematic banner (16:5 ratio). A small cluster of mushrooms rising from a dark forest floor, and beneath the surface a vast glowing web of fine thread-like filaments spreading through the soil, connecting fallen leaves and twigs. Conveys that the visible mushroom is just the tip of a hidden recycling network. Warm amber rim light against a deep dark background, painterly cinematic style. No text overlay.'
  ),
  callout('fun_fact', 'A Mould That Saves Lives',
`Some of the most important medicines ever discovered come from fungi. The mould **Penicillium** gives us **antibiotics** — medicines that fight bacterial infections and have saved countless lives. Another fungus, **Aspergillus**, is used to make useful enzymes. A humble mould, doing work no factory could match.`),
  h('Nature\'s Great Recyclers', 'Understand how fungi feed and why that makes them vital to the soil.'),
  txt(
`Fungi are mostly **multicellular eukaryotes**, and their cells have a wall made of **chitin**. Unlike plants, they **cannot make their own food** — they are heterotrophs.

Instead, a fungus feeds by spreading a network of fine threads, called a **mycelium**, through its food and **absorbing** nutrients from it. Most fungi feed on dead and decaying matter — fallen leaves, twigs, dead organisms — which makes them **saprophytes** and **decomposers**. As they feed, they break down complex dead matter into simple substances, returning minerals to the soil and keeping it fertile.`),
  reason('logical',
    'A mushroom has cells with walls and cannot move about, which makes it look plant-like. Yet it is placed far from the plant kingdom. What is the strongest reason for keeping it out of Plantae?',
    [
      'A mushroom cannot make its own food — it absorbs nutrients from dead matter instead of doing photosynthesis',
      'A mushroom is too small to ever count as a plant',
      'A mushroom has no cells, so it cannot be a plant',
      'A mushroom grows in the dark, and plants only grow in light',
    ],
    0,
    'Having a cell wall and staying still are not enough to make something a plant. The deciding difference is food: a plant makes its own by photosynthesis, while a fungus cannot and must absorb food from dead matter. "Too small to be a plant" is the trap — many fungi, like large mushrooms, are not small at all.',
    3),
  h('Not All Fungi Are the Same', 'Meet the surprising variety within the fungal kingdom.'),
  txt(
`Fungi live in more ways than just recycling. Some form **mutualistic** (helpful, shared) partnerships with other organisms, while others live as **parasites** that cause disease in plants and animals. They reproduce both sexually and asexually, often by tiny **spores**, and grow best in **warm, moist** conditions.

The kingdom holds great variety. **Yeast** is unusual — it is a single-celled fungus, but because its cell wall is made of chitin, it is grouped with the fungi. **Mushrooms** are large fungi that spread by spores. And moulds like *Aspergillus* and *Penicillium* are used to make enzymes and antibiotics.`),
  img(
    'Three kinds of fungi shown together — a cluster of mushrooms, single-celled yeast, and a dark Aspergillus mould',
    'Scientific textbook illustration of three kinds of fungi side by side. Flat 2D educational diagram on a dark background (#0a0a0a or near-black). Left: a cluster of mushrooms with caps and stalks, showing fine thread-like mycelium at the base. Middle: round single-celled yeast cells, some budding. Right: dark branching Aspergillus mould with spore heads. Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines, brown and tan tones for the fungal tissue. No photorealism, no stylised characters. Match standard biology textbook illustration conventions.',
    '4:3'),
  callout('bridging_science', 'Mushrooms as Food and Livelihood',
`Wild edible mushrooms are a valuable, nutritious food, and many Indian communities — including tribal communities — hold deep traditional knowledge about which wild mushrooms are safe to eat and which are poisonous, and which can be used as medicine. Today, **mushroom farming** is growing into a promising livelihood: it needs little space, low investment, and gives a harvest in just **30 to 45 days**.`),
  callout('what_if', 'What If Every Fungus Vanished?',
`Imagine all the fungi on Earth disappeared tomorrow. Dead leaves, fallen trees, and dead animals would stop breaking down and begin to pile up. The nutrients locked inside them would never return to the soil, so it would slowly lose its fertility. Think about what would happen to the plants — and then to everything that depends on plants. How long do you think such a world could keep going?`),
  quiz([
    q('The cell wall of a fungus is made mainly of —',
      [
        'chitin',
        'cellulose',
        'calcium carbonate',
        'it has no cell wall at all',
      ], 0,
      'Fungal cell walls are made of chitin. "Cellulose" is the trap because it is also a cell-wall material — but cellulose is found in plant cell walls, not fungal ones.',
      1),
    q('Unlike a green plant, how does a mushroom obtain its food?',
      [
        'It absorbs nutrients from dead or decaying matter, because it cannot make its own food',
        'It makes its own food from sunlight by photosynthesis, exactly like a green leaf does',
        'It hunts smaller creatures and swallows them whole',
        'It soaks up sunlight directly through its cap for energy',
      ], 0,
      'A fungus is a heterotroph: it cannot photosynthesise, so it absorbs nutrients from dead matter through its mycelium. "Makes its own food from sunlight" is the plant trap — that ability is exactly what fungi lack.',
      2),
    q('A new organism is many-celled, cannot make its own food, feeds by absorbing nutrients from dead matter, and has a cell wall. Why is it placed in Fungi and not in Animalia?',
      [
        'Animals have no cell wall and digest food inside the body, while this one has a wall and absorbs food',
        'Animals are never many-celled, so this many-celled organism simply cannot be an animal',
        'Animals always build their own food from sunlight, quite unlike this organism',
        'Only fungi have ever managed to live on land, whereas animals cannot survive there',
      ], 0,
      'Two features rule out Animalia: animals have no cell wall, and they take food in and digest it inside the body rather than absorbing it. The trap is "animals are never many-celled" — animals are in fact multicellular, so that cannot be the reason.',
      3),
  ]),
];

// ── PAGE 60 — Kingdom Plantae ─────────────────────────────────────────────────
const p60 = [
  cur(
    'Think about the very last thing you ate. Trace it back far enough and it began with a plant. Even if you ate an egg, the hen ate grain; even if you ate fish, the fish ate smaller creatures that fed on tiny green cells. And the oxygen in your next breath? A plant or a green cell made it. One kingdom quietly feeds and breathes life into almost everything else — and it does so while eating nothing at all. How does a living thing build its whole body out of just sunlight, air, and water?',
    'It does not take food from outside — it makes its own.',
    'Plants are the only large kingdom that makes its own food from sunlight, and in doing so they feed the rest of life and fill the air with oxygen. This page is about Kingdom Plantae — what makes a plant a plant.'
  ),
  img(
    'Sunlight streaming through a great green forest canopy, light beams reaching down to ferns and saplings below',
    'Ultra-wide cinematic banner (16:5 ratio). Shafts of warm light streaming down through a tall green forest canopy, reaching mosses, ferns and saplings on the floor below, dust and pollen glinting in the beams. Conveys plants capturing sunlight and turning it into the food and oxygen that all other life depends on. Golden rim light against a deep, dark, atmospheric background, painterly cinematic Indian-illustration style. No text overlay.'
  ),
  callout('fun_fact', 'Every Food Chain Begins Here',
`Almost every food chain on Earth starts with a plant. Whether an animal eats grass directly or eats another animal that ate grass, the energy in that food was first captured from sunlight by a plant. Plants stand at the **base** of nearly all the food we — and every other animal — depend on.`),
  h('The Kingdom That Feeds the Rest', 'See the three features that make a plant a plant.'),
  txt(
`Plants are **multicellular, autotrophic eukaryotes**. "Autotrophic" is the key word — it means they **make their own food** by **photosynthesis**, using sunlight, air, and water.

Their cells have a rigid **cell wall made of cellulose**, which gives a plant its support and protection — it is why a tree can stand tall against the wind. Because they make their own food, plants form the **base of most food chains**, and as they photosynthesise they **release oxygen**, without which most life on Earth could not survive.`),
  reason('logical',
    'A moss plant and a mushroom both have cells with walls, and neither can move from place to place. Yet the moss is placed in Plantae and the mushroom in Fungi. What is the best reason for the split?',
    [
      'The moss makes its own food by photosynthesis, while the mushroom cannot and must absorb its food',
      'The moss is green and the mushroom is not, and colour decides the kingdom',
      'The moss is bigger than the mushroom, so it counts as a plant',
      'The moss can move slowly while the mushroom cannot move at all',
    ],
    0,
    'A cell wall and staying still are features both share, so neither can separate them. The real divide is how they feed: the plant is an autotroph (makes its own food), the fungus a heterotroph (absorbs it). "Colour decides the kingdom" is the trap — colour is only a hint, not the rule; the way of feeding is what matters.',
    2),
  h('One Kingdom, Five Great Groups', 'Get a first look at how the plant kingdom is divided.'),
  txt(
`Not all plants are built the same way. Kingdom Plantae is divided into **five classes**, arranged roughly from the simplest to the most complex:

**Thallophyta** (simple algae), **Bryophyta** (mosses), **Pteridophyta** (ferns), **Gymnosperms** (cone-bearing plants like pines), and **Angiosperms** (flowering plants).

This sequence tells a story — of plants gradually moving from water onto land, and slowly developing roots, transport tissues, seeds, and finally flowers. We will follow that whole journey on the next page.`),
  img(
    'Five kinds of plants shown left to right — algae, moss, fern, a pine cone branch, and a flowering plant',
    'Scientific textbook illustration showing the range of the plant kingdom, five groups left to right at a comparable scale. Flat 2D educational diagram on a dark background (#0a0a0a or near-black). From left: green filamentous algae, a low cushion of moss, a fern frond, a pine branch with a cone, and a flowering plant with a bloom. Clean white outlines, biologically accurate proportions, green tones for living plant tissue, labels in white text with thin white leader lines. No photorealism, no stylised characters. Match standard biology textbook illustration conventions.',
    '16:9'),
  callout('threads_of_curiosity', 'The Quiet Engine of the Living World',
`Here is something worth sitting with. Plants have no brain, no muscles, and cannot take a single step. Yet this still, silent kingdom powers nearly all the others — it captures the sunlight that becomes food for animals, and it releases the oxygen they breathe. The most powerful kingdom on Earth may be the one that never moves. What does that tell you about what "success" in nature really means?`),
  quiz([
    q('The cell wall of a plant cell is made mainly of —',
      [
        'cellulose',
        'chitin',
        'calcium carbonate',
        'plant cells have no cell wall',
      ], 0,
      'Plant cell walls are made of cellulose, which gives the plant support. "Chitin" is the trap because it is also a cell-wall material — but chitin is found in fungi, not plants.',
      1),
    q('What single ability makes plants the base of nearly every food chain?',
      [
        'They make their own food from sunlight, so other organisms can feed on them',
        'They grow taller and bigger than almost every other kind of living organism',
        'They move around to gather food from many places',
        'They live longer than the animals that eat them',
      ], 0,
      'Because plants make their own food by photosynthesis, they store energy that animals can eat — so food chains begin with them. "They grow taller" is the trap: height has nothing to do with being a food source; making food does.',
      2),
    q('Both a moss plant and a mushroom have cell walls and stay in one place. Why is the moss placed in Plantae and the mushroom in Fungi?',
      [
        'The moss makes its own food by photosynthesis; the mushroom cannot and must absorb its food',
        'The moss has living cells inside it while the mushroom has none',
        'The moss can slowly move toward the light, while the mushroom cannot move at all',
        'The moss is always larger than any mushroom',
      ], 0,
      'The split comes down to how each one feeds: the moss is an autotroph (makes food), the mushroom a heterotroph (absorbs food). "The mushroom has no cells" is false — fungi are made of cells too; the difference is in feeding, not in having cells.',
      3),
  ]),
];

// ── PAGE 61 — Kingdom Animalia ────────────────────────────────────────────────
const p61 = [
  cur(
    'A tiger, a fish, a sparrow, a snake, and you — what do all five secretly share that a butterfly, a snail, and a starfish do not? Run your fingers down the middle of your back and you can feel it: a line of bones, your backbone. That one hidden feature splits the entire animal kingdom into two great halves. Most animals on Earth never had it at all. So why does a single rod down the back matter enough to divide a whole kingdom?',
    'The backbone develops from an even older, simpler structure — a soft rod called the notochord.',
    'Animals are first sorted by whether or not they have a notochord — a flexible rod down the back that, in animals like us, becomes the backbone. This page is about Kingdom Animalia and its great divide.'
  ),
  img(
    'A sweeping gathering of many different animals — fish, insects, a snake, a bird, a starfish, a deer — against darkness',
    'Ultra-wide cinematic banner (16:5 ratio). A sweeping gathering of wildly different animals arranged across the frame — a leaping fish, a beetle, a coiled snake, a perched bird, a starfish, and a deer in motion — all clearly in motion or alert, suggesting movement and quick response. Conveys an entire kingdom built to move and react. Warm rim lighting against a deep dark background, painterly cinematic Indian-illustration style. No text overlay.'
  ),
  callout('fun_fact', 'Not One of Them Makes Its Own Food',
`From a coral that never moves, to a cheetah at full sprint, every animal shares one strict rule: **not a single one can make its own food**. Every animal, without exception, must get its food from other living things. It is the one habit the whole kingdom has in common.`),
  h('Built to Move, Built to Respond', 'See the features shared by every member of the animal kingdom.'),
  txt(
`Animals are **multicellular, heterotrophic eukaryotes**. Heterotrophic means they cannot make their own food and must **depend on other organisms** for it. Unlike plant and fungal cells, animal cells have **no cell wall**.

Most animals can also do something plants cannot: they show **locomotion** (they move from place to place), **rapid response** to what happens around them, and **coordinated behaviour**. These abilities let an animal actively search for food, escape from predators, and react to its surroundings moment by moment.`),
  reason('logical',
    'A frog and a grass plant are both made of many cells. Give the single best reason the frog is an animal while the grass is not.',
    [
      'The frog cannot make its own food and its cells have no cell wall, while the grass makes its own food and has cell walls',
      'The frog is larger than the grass, and size decides the kingdom',
      'The frog lives near water while the grass lives on land',
      'The frog is green at some stage, while the grass is always green',
    ],
    0,
    'Being multicellular is something both share, so it cannot tell them apart. Two features make the frog an animal: it is a heterotroph (cannot make its own food) and its cells have no cell wall — both the opposite of the grass. "Size decides the kingdom" is the trap; kingdoms are not decided by how big an organism is.',
    2),
  h('The Great Divide: A Rod Down the Back', 'Learn the first big split inside the animal kingdom.'),
  txt(
`The first major step in sorting animals is to ask one question: does the animal have a **notochord** — a flexible, rod-shaped structure running down its body?

- Animals **without** a notochord are the **non-chordates**, also called **invertebrates** (animals without a backbone).
- Animals **with** a notochord are the **chordates**.

The chordates are split again. In some of them the notochord acts as the early form of a true backbone — the **vertebral column**. So chordates include the simpler **protochordates** and the more familiar **vertebrates** (animals with a backbone), like fish, frogs, snakes, birds, and humans.`),
  img(
    'A simple branching chart of the animal kingdom splitting into non-chordates and chordates',
    'Scientific textbook illustration: a simple branching classification chart of Kingdom Animalia. Flat 2D educational diagram on a dark background (#0a0a0a or near-black). At the top, "Animalia" branches into two: "Non-chordata (invertebrates)" with small icons of a beetle, a snail and a starfish, and "Chordata" which then branches into "Protochordata" (a small lancelet) and "Vertebrata" with icons of a fish, frog, snake, bird and mammal. Clean white outlines and white connector lines, labels in white text. No photorealism, no stylised characters. Match standard biology textbook illustration conventions.',
    '16:9'),
  callout('threads_of_curiosity', 'A Soft Rod With a Big Future',
`The notochord seems like a small thing — just a soft, flexible rod. Yet in one branch of animals it became the blueprint for the backbone, which made room for a larger body, a protected spinal cord, and a complex brain. A simple structure in early animals opened the door to some of the most complex creatures alive, including you. How might such a small feature have made such a large difference over time?`),
  quiz([
    q('Members of Kingdom Animalia are best described as —',
      [
        'multicellular organisms that cannot make their own food and have no cell wall',
        'multicellular organisms that make their own food directly by photosynthesis',
        'single-celled organisms that have a true nucleus',
        'multicellular organisms whose cells have a wall made of chitin',
      ], 0,
      'Animals are multicellular heterotrophs with no cell wall — they depend on others for food. "Make their own food by photosynthesis" is the plant trap; that is exactly what animals cannot do.',
      1),
    q('On which single feature is the animal kingdom first divided into two big groups?',
      [
        'Whether the animal has a notochord or not',
        'Whether the animal lives on land or in water',
        'Whether the animal can fly or not',
        'Whether the animal is large or small',
      ], 0,
      'The first split is based on the notochord: chordates have one, non-chordates (invertebrates) do not. "Lives on land or in water" is the trap — habitat varies within both groups, so it cannot be the dividing line.',
      2),
    q('You feel a backbone running down a fish, but find none in a butterfly. Both are animals. Based on the main criterion for sorting animals, how do they differ?',
      [
        'The fish is a chordate with a backbone; the butterfly is an invertebrate with no notochord',
        'The fish is an invertebrate; the butterfly is a chordate',
        'Both of them must be invertebrates, since neither truly has a backbone you can feel',
        'Neither can be classified, because both are able to move',
      ], 0,
      'A backbone means the fish is a vertebrate (a kind of chordate), while the butterfly, lacking a notochord, is an invertebrate. Calling the fish an invertebrate is the trap — the backbone you can feel is exactly what makes it a vertebrate.',
      3),
  ]),
];

applyPages([
  { slug: 'kingdom-fungi',
    subtitle: 'Nature\'s recyclers — heterotrophs that absorb their food and quietly turn the dead back into living soil',
    blocks: p59 },
  { slug: 'kingdom-plantae',
    subtitle: 'The only large kingdom that makes its own food — feeding and oxygenating almost all other life',
    blocks: p60 },
  { slug: 'kingdom-animalia',
    subtitle: 'Multicellular feeders built to move and respond — split in two by a single rod down the back',
    blocks: p61 },
]).catch((e) => { console.error(e); process.exit(1); });
