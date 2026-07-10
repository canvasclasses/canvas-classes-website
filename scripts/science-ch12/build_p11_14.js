'use strict';
/**
 * Class 9 Science · Chapter 12 — BATCH: pages 65, 66, 67, 68
 *   65 viruses                     ← exercises Q8/Q9/Q10 + case-study organism T (acellular;
 *                                     genetic material; inactive outside a host; fits no kingdom;
 *                                     reveals limits of classification + evolving science).
 *   66 lichens                     ← §12.6.4 Thallophyta "Bridging" box (alga + fungus symbiosis;
 *                                     bioindicators of air pollution; patthar ke phool — spice/
 *                                     medicine/dye; some poisonous → identify properly).
 *   67 three-domains-of-life       ← "Ready to Go Beyond" (DNA comparison; Carl Woese 1977;
 *                                     Bacteria/Archaea/Eukarya; microscopic life more diverse) +
 *                                     Threads (classification keeps changing).
 *   68 biodiversity-in-your-backyard ← §12.1 (India hotspot; endemic species; hotspots), §12.2/12.9
 *                                     (diversity evolved; fossils; Birbal Sahni), §12.10 (threats),
 *                                     Threads (purple frog), Bridging (Sangai/phumdis), Journey Beyond.
 *
 * Grounded in iesc112.pdf. Template/quiz rules per §4B and §3.6.1.
 *   node scripts/science-ch12/build_p11_14.js [--dry]
 */
const { img, txt, h, cur, callout, reason, q, quiz, applyPages } = require('./_lib');

// meet_a_scientist factory (not in _lib; matches schemas.ts MeetAScientistBlockSchema)
const scientist = (o) => ({ type: 'meet_a_scientist', portrait_src: '', ...o });

// ── PAGE 65 — Viruses: Are They Even Alive? ───────────────────────────────────
const p65 = [
  cur(
    'Here is a riddle that has puzzled scientists for a hundred years. There is a thing so small it makes a bacterium look like a giant. Leave it sitting on a table and it does absolutely nothing — it does not eat, breathe, grow, or move. It is as lifeless as a speck of dust. But slip that same speck inside a living cell, and it suddenly springs into action and makes thousands of copies of itself. So tell me — is it alive, or is it not?',
    'It has the instruction book of life (genetic material) but none of the machinery of a living cell.',
    'This strange thing is a virus. It sits right on the border between living and non-living — and because it has no cell at all, it does not fit into any of the five kingdoms. This page is about why such a tiny thing breaks the whole system.'
  ),
  img(
    'A single virus particle glowing against darkness, far smaller than the bacteria drifting near it',
    'Ultra-wide cinematic banner (16:5 ratio). A single, intricate virus particle glowing at the centre of the frame, with a few much larger bacterial cells drifting in the background to show its astonishingly tiny scale. Conveys something mysterious that sits on the edge of life. Cold blue-violet rim lighting against a deep dark background, painterly cinematic style. No text overlay.'
  ),
  callout('fun_fact', 'Built On Cells — and Viruses Have None',
`Every one of the five kingdoms is built around the **cell** — the system sorts life by cell type, by the number of cells, and by the cell wall. A virus has **no cell at all**. So when you try to file it into the five kingdoms, it fits into none of them. It sits completely outside the system.`),
  h('Half-Alive, Half-Not', 'See why a virus is so hard to call living or non-living.'),
  txt(
`A virus is **acellular** — it is not made of any cell. It is little more than some **genetic material** wrapped in a coat. This is what makes it so puzzling.

Outside a living host, a virus is **completely inactive**. It does none of the things living things do — no eating, no breathing, no growing. It is as inert as a grain of sand. But the moment it gets **inside a living cell** (its host), it uses that cell to make thousands of copies of itself. So it behaves like a non-living thing on its own, and like a living thing inside a host. That is exactly why scientists struggle to put it on either side of the line.`),
  reason('logical',
    'The five-kingdom system sorts organisms by features of their cells — the cell type, the number of cells, and the cell wall. A virus has no cell at all. What follows most directly?',
    [
      'None of the five kingdoms\' tests can be applied to a virus, so it cannot be placed in any of them',
      'A virus must belong to Monera, since that kingdom holds the simplest life',
      'A virus is automatically an animal, because it can multiply',
      'A virus belongs to whichever kingdom its host belongs to',
    ],
    0,
    'Every test the five-kingdom system uses is about the cell — and a virus has no cell, so none of the tests even apply. "It must belong to Monera" is the trap: Monera members are still cells (prokaryotic cells), while a virus is not a cell at all.',
    3),
  h('When the System Hits Its Limit', 'Understand what viruses reveal about classification itself.'),
  txt(
`Viruses teach us something important: **no classification system is perfect.** The five kingdoms work beautifully for life built from cells — but a virus is not built from a cell, so the system simply has nowhere to put it.

This does not mean the system is useless. It means classification is a tool made by people, and like any tool, it has limits. When something does not fit, scientists do not ignore it — they ask whether the system needs to grow or change. That is how science keeps improving: not by pretending the awkward cases away, but by letting them push our ideas forward.`),
  img(
    'A simple labelled diagram of a virus particle showing its outer coat and the genetic material inside',
    'Scientific textbook illustration of a single virus particle. Flat 2D educational diagram on a dark background (#0a0a0a or near-black). Show the outer protein coat and, inside it, the coiled genetic material; keep it simple and clear. Clean white outlines, labels in white text with thin white leader lines pointing to "protein coat" and "genetic material". No photorealism, no stylised characters. Match standard biology textbook illustration conventions.',
    '4:3'),
  callout('quest_continues', 'Still on the Border',
`Even today, scientists do not fully agree on whether viruses should count as living things, or where exactly they belong. As we learn more about them, the answer may shift again. Viruses are a live reminder that the story of classifying life is not finished — it is still being written, and questions like this one are exactly where science is working right now.`),
  callout('what_if', 'What Would You Do With Viruses?',
`Put yourself in a scientist\'s shoes. You are redrawing the map of life, and you reach the viruses. Do you create a brand-new group just for them, or do you leave them outside the system altogether? There is no settled answer — both choices have good reasons behind them. Which would you choose, and what does your choice say about how a classification system should handle the things that do not fit?`),
  quiz([
    q('Why are viruses not placed in any of the five kingdoms?',
      [
        'They are acellular — they have no cell, and the five-kingdom system is based on cells',
        'They are simply far too small for scientists to see them clearly under a microscope',
        'They are always harmful, and harmful things are left out',
        'They can live only inside water, unlike the five kingdoms',
      ], 0,
      'The five-kingdom system sorts life by cell features, and a virus has no cell at all, so it fits nowhere. "Too small to see" is the trap — bacteria are tiny too, yet they have a kingdom; the real issue is having no cell, not size.',
      1),
    q('Why do scientists find it so hard to decide whether a virus is living or non-living?',
      [
        'Outside a host it is completely inactive, but inside a host it reproduces like a living thing',
        'It is alive during the day but non-living at night',
        'It is clearly alive in every way, and only its extremely small size causes confusion',
        'It is clearly non-living, and nothing about it seems alive at all',
      ], 0,
      'A virus does nothing on its own (non-living behaviour) yet multiplies once inside a host (living behaviour) — so it sits on the border. "Clearly alive, just small" misses the point: its inactivity outside a host is exactly what makes the case unclear.',
      2),
    q('A virus carries genetic material like living things but has no cells at all, so it fits none of the five kingdoms. What does this best tell us?',
      [
        'No classification system is perfect; some cases reveal its limits and may force it to change',
        'Viruses are unimportant and not worth studying at all',
        'The whole five-kingdom system must therefore be completely wrong and should be abandoned',
        'Viruses are already officially counted as a sixth kingdom',
      ], 0,
      'Viruses show that even a good system has limits, and such cases push science to refine its ideas. "The whole system must be wrong" is an overreaction — the five kingdoms work well for cell-based life; viruses simply fall outside it.',
      3),
  ]),
];

// ── PAGE 66 — Lichens: A Surprising Partnership ───────────────────────────────
const p66 = [
  cur(
    'Look closely at the grey-green crusty patches on an old tree trunk, a damp wall, or a stone. They look like one simple plant. But here is the twist: each patch is not one living thing at all — it is **two**, from two completely different kingdoms, living so tightly woven together that they look like a single creature. And strangest of all, these humble patches can tell you whether the air around you is clean or dirty. What exactly are they?',
    'One partner makes food; the other provides shelter and water.',
    'These patches are lichens — a partnership between an alga and a fungus, two organisms living as one. They are also living air-quality meters. This page is about this surprising team-up.'
  ),
  img(
    'A close, detailed view of grey-green lichen spreading across the bark of an old tree',
    'Ultra-wide cinematic banner (16:5 ratio). A close, detailed view of grey-green and pale lichen spreading in crusty, branching patterns across the rough bark of an old tree trunk, catching soft low light. Conveys a quiet, overlooked partnership of life. Warm rim light against a deep dark, atmospheric background, painterly cinematic style. No text overlay.'
  ),
  callout('fun_fact', 'Patthar Ke Phool',
`Some lichens, known in India as **patthar ke phool** ("flower of the stone"), have been used for centuries. They flavour food as a **spice**, are used in **medicines**, and have long been used to make **dyes** — giving maroon, violet, and burgundy colours to woollen and silk fabrics. A reminder that even the smallest, plainest life can be deeply useful.`),
  h('Two Lives, One Body', 'See how two different organisms join to live as one.'),
  txt(
`A lichen is not a single organism. It is a **symbiotic** partnership — a close, mutually helpful association — between **two** organisms from two different kingdoms:

- An **alga** (from the plant-like, autotrophic side of life), which **makes food** by photosynthesis.
- A **fungus** (heterotrophic), which **provides protection** and a moist, sheltered home.

Each partner gives what the other lacks. The alga feeds the team; the fungus shelters it and helps hold water. Together they can live on bare rock and dry bark where neither could survive alone.`),
  reason('analogical',
    'In a lichen, the alga can make food but is easily dried out, while the fungus cannot make food but can shelter and hold water. They live better together than either does alone. Which everyday partnership is this most like?',
    [
      'A cook and a shopkeeper who team up — one prepares food, the other provides the shop and storage, and both gain',
      'Two cooks who both make the same dish and compete for customers',
      'A landlord who collects rent from a tenant but gives nothing back',
      'A single shopkeeper who does every job entirely alone',
    ],
    0,
    'A lichen is mutualism — both partners give something the other needs and both benefit, like a cook (makes food, as the alga does) paired with a shopkeeper (provides shelter and storage, as the fungus does). The "landlord who gives nothing back" describes a one-sided relationship, which is the opposite of the give-and-take in a lichen.',
    3),
  h('Living Air-Quality Meters', 'Discover how lichens reveal whether the air is clean.'),
  txt(
`Lichens are remarkably sensitive to **air pollution**. In clean air they grow well; in polluted air they struggle, fade, or fail to grow at all, and they even **change colour** depending on the pollutants present.

This makes them natural **bioindicators** — living signs of air quality. Researchers can judge how polluted the air is from the kinds of lichens present and their colour. Villagers have long recognised thick lichen growth as a sign of a clean, pollution-free environment. (A word of care, though — some lichens are poisonous, so they must be correctly identified before being used.)`),
  img(
    'Different kinds of lichen growing on bark, from healthy leafy growth to faint crusty patches',
    'Scientific textbook illustration of lichens on tree bark. Flat 2D educational diagram on a dark background (#0a0a0a or near-black). Show two or three lichen types side by side — a leafy form, a branching form, and a flat crusty form — with a small inset close-up suggesting the alga and fungus layers woven together. Clean white outlines, labels in white text with thin white leader lines, soft grey-green tones. No photorealism, no stylised characters. Match standard biology textbook illustration conventions.',
    '4:3'),
  callout('bridging_science', 'Reading the Air Without a Machine',
`You do not always need an expensive instrument to check air quality — sometimes nature has already done it. Because lichens are so sensitive to pollution, scientists use them to map how clean or dirty the air is across a region: lots of healthy lichen points to clean air, while bare bark can be a warning sign. A patch of lichen on a wall is quietly monitoring the air you breathe.`),
  callout('threads_of_curiosity', 'One Creature, or Two?',
`A lichen raises a genuinely tricky question. If it is two organisms living as one, where do we file it — under the algae, or under the fungi? It does not sit neatly in either box. Partnerships like this remind us that life does not always come in tidy, separate packages, and that our neat groups sometimes have blurry edges. How would you classify something that is really two things at once?`),
  quiz([
    q('A lichen is a partnership between —',
      [
        'an alga and a fungus',
        'two different fungi',
        'a plant and an animal',
        'two kinds of bacteria',
      ], 0,
      'A lichen is a symbiosis of an alga and a fungus living together. "Two different fungi" is the trap — there are two partners, but only one is a fungus; the other is a food-making alga.',
      1),
    q('In a lichen, what does each partner mainly contribute?',
      [
        'The alga makes food by photosynthesis; the fungus provides protection and holds water',
        'The fungus makes the food, while the alga provides protection and stores the water',
        'Both partners make their own food, and neither shelters the other',
        'Both partners only provide shelter, and neither one makes any food',
      ], 0,
      'The alga is the food-maker (autotroph) and the fungus is the shelter-provider — each supplies what the other lacks. The reversed option is the trap: the fungus cannot photosynthesise, so it cannot be the food-maker.',
      2),
    q('Lichens grow thickly on trees in a village but are almost absent from trees in a nearby city. What is the most reasonable conclusion?',
      [
        'The city air is more polluted, since lichens are sensitive to air pollution',
        'The city trees are simply the wrong kind for lichens',
        'Lichens are somehow only allowed to grow in villages and never inside any city',
        'The city must be much colder than the village',
      ], 0,
      'Lichens fade in polluted air, so their absence in the city points to dirtier air there. "The wrong kind of trees" is the trap — lichens grow on many kinds of bark; their absence tracks pollution, not tree type.',
      3),
  ]),
];

// ── PAGE 67 — Three Domains of Life ───────────────────────────────────────────
const p67 = [
  cur(
    'Under a microscope, two tiny cells can look like identical twins — same size, same simple shape, no nucleus, just plain little blobs. For years, scientists filed them together in the same group. Then they read the cells\' **DNA** — the secret instruction book carried inside every living thing. The "twins" turned out to be as different from each other, deep down, as you are from a mushroom. How can two cells look exactly the same and yet be so completely different on the inside?',
    'Looks can fool you; the instructions written in DNA cannot.',
    'When scientists compared organisms by their DNA, the old groups were not enough. The simple "bacteria" split into two utterly different groups. This led to a new top-level system: the three domains of life. This page is about that discovery.'
  ),
  img(
    'A glowing tree of life splitting into three great branches, with a faint strand of DNA woven through it',
    'Ultra-wide cinematic banner (16:5 ratio). A luminous tree of life rising from the centre and dividing into three great glowing branches, with a faint double-helix strand of DNA woven subtly through the trunk. Conveys the idea that reading DNA revealed three deep branches of life. Cool blue and teal rim lighting against a deep dark background, painterly cinematic style. No text overlay.'
  ),
  callout('fun_fact', 'DNA Redrew the Map of Life',
`Reading DNA changed everything. It revealed that the simple cells once all lumped together as "bacteria" were really **two** separate groups, deep down — true **Bacteria** and **Archaea** — as different from each other as either is from a plant or an animal. No microscope could ever have seen this difference. Only their genetic instructions told the true story.`),
  h('Reading the Secret Instruction Book', 'See how DNA gave scientists a deeper way to compare life.'),
  txt(
`The five-kingdom system was a big step forward, but it still could not fully explain the diversity of life — especially among the tiniest organisms. Then better microscopes and **genetic studies** opened a new window.

Every living cell carries **DNA** — the genetic material that holds the instructions for how it grows and works. By comparing the DNA of different organisms, scientists could finally measure how closely related they truly are. Organisms with similar DNA are taken to share a common ancestor. This was a far deeper test than judging by appearance alone.`),
  reason('logical',
    'Two microbes look identical under a microscope, but their DNA is found to be very different. Why do scientists now place them in separate groups rather than together?',
    [
      'DNA reveals how organisms are truly related, while outward appearance can hide deep differences',
      'The microbe with more DNA is automatically the more advanced one',
      'Two things that look alike must always be placed in the same group',
      'Appearance under a microscope is the only reliable basis for grouping',
    ],
    0,
    'DNA records the deep, inherited differences between organisms, even when they look the same on the outside — so it is a more reliable basis than appearance. "Things that look alike must be grouped together" is exactly the trap this discovery overturned: the look-alike microbes turned out to be deeply different inside.',
    3),
  h('Three Great Domains', 'Meet the three top-level branches of all life.'),
  txt(
`Based on this genetic evidence, **Carl Woese** proposed the **three domain system** in 1977. It sorts all life into three great branches:

- **Bacteria** — the familiar true bacteria.
- **Archaea** — simple cells that look bacteria-like but are deeply different in their DNA.
- **Eukarya** — all organisms whose cells have a true nucleus, which folds in the protists, fungi, plants, and animals together.

This system showed that **microscopic life is far more diverse** than anyone had believed. The branches at the very base of the tree of life are mostly invisible to the naked eye.`),
  img(
    'A simple tree-of-life diagram with three main branches labelled Bacteria, Archaea and Eukarya',
    'Scientific textbook illustration of the three domains of life as a simple branching tree. Flat 2D educational diagram on a dark background (#0a0a0a or near-black). A single trunk near the base splits into three labelled branches: "Bacteria", "Archaea", and "Eukarya" (with small icons of a plant, an animal and a mushroom hanging off the Eukarya branch). Clean white outlines and white connector lines, labels in white text. No photorealism, no stylised characters. Match standard biology textbook illustration conventions.',
    '16:9'),
  callout('quest_continues', 'The Map Is Never Quite Finished',
`Notice the pattern across this whole chapter: two kingdoms, then three, four, five — and now three domains. Each time our tools improved, the map of life was redrawn to match the new evidence. So the obvious question is the one science is still chasing: what will the next great tool reveal, and how will it change the map again? The tree of life is still being drawn, branch by branch.`),
  quiz([
    q('The three domains of life are —',
      [
        'Bacteria, Archaea, and Eukarya',
        'Monera, Protista, and Fungi',
        'Plantae, Animalia, and Fungi',
        'Bacteria, Fungi, and Animalia',
      ], 0,
      'Carl Woese\'s three domains are Bacteria, Archaea, and Eukarya. "Monera, Protista, Fungi" is the trap — those are kingdoms from the five-kingdom system, not domains.',
      1),
    q('What new kind of evidence allowed scientists to build the three-domain system?',
      [
        'Comparing the DNA (genetic material) of different organisms',
        'Looking at organisms under stronger microscopes alone',
        'Measuring how large or small each organism is',
        'Counting how many of each organism could be found',
      ], 0,
      'The three domains came from comparing organisms\' DNA, which shows deep relationships. "Stronger microscopes alone" is the trap — better microscopes helped, but it was the DNA evidence that revealed the hidden split between Bacteria and Archaea.',
      2),
    q('The three-domain system split the single old group of "bacteria" into two domains — Bacteria and Archaea. What does this best show?',
      [
        'Tiny microscopic life is far more varied than once believed, and classification keeps changing',
        'Bacteria are not genuinely living organisms after all, despite carrying genetic material',
        'The five-kingdom system turned out to be completely useless and should be discarded',
        'Appearance under the microscope is still the most reliable single basis for classifying life',
      ], 0,
      'Finding two deeply different groups hidden inside "bacteria" shows how diverse tiny life is, and how classification updates with new evidence. "Appearance is the most reliable basis" is the trap — this discovery proved the opposite, since the two groups look alike but differ in DNA.',
      3),
  ]),
];

// ── PAGE 68 — Biodiversity in Your Backyard ───────────────────────────────────
const p68 = [
  cur(
    'You do not need to fly to a rainforest to find astonishing life. Stand still in any backyard, park, or pond in India for ten minutes and you are surrounded by every kingdom at once — bacteria in the soil, a mushroom on a fallen log, moss on a damp wall, ants marching past, a bird overhead, and tiny green specks drifting in a puddle. And some of the creatures living in this country are found nowhere else on the entire planet. Just how rich is the life right around you — and what happens if we let it slip away?',
    'The variety of life is called biodiversity — and India holds an extraordinary share of it.',
    'Everything you have learned about kingdoms and classification is not just for textbooks — it is a tool for knowing, valuing, and protecting the life around you. This closing page brings the whole chapter home.'
  ),
  img(
    'A lush Indian landscape teeming with varied life — hills, forest, a pond, birds, insects and small mammals',
    'Ultra-wide cinematic banner (16:5 ratio). A rich Indian landscape brimming with life — forested Western Ghats hills rolling into the distance, a pond in the foreground, birds in flight, a deer at the water\'s edge, butterflies and small creatures among the plants. Conveys the abundance and value of biodiversity close to home. Warm golden rim light against a deep dark, atmospheric background, painterly cinematic Indian-illustration style. No text overlay.'
  ),
  callout('fun_fact', 'Found Only in India',
`Some living things grow naturally nowhere else on Earth except India — the **Nilgiri tahr**, the **lion-tailed macaque**, and the **Neelakurinji** flower among them. Species found only in one region like this are called **endemic species**, and India, with its mountains, deserts, rainforests, and long coastlines, is full of them.`),
  h('Every Kingdom, Right Outside Your Door', 'See how rich and varied the life around you really is.'),
  txt(
`India is one of the most life-rich countries on Earth. Its varied landscapes — snow-clad Himalayas, dry western deserts, southern rainforests, and long coastlines — each support their own plants and animals. Regions packed with species, like the **Western Ghats**, the **Himalayas**, **North East India**, and the islands of the **Nicobar** group, are so rich that they are called **biodiversity hotspots**.

This staggering variety of life is what we call **biodiversity**. And it is not only in faraway forests — every backyard, field, and pond holds members of several kingdoms, living and interacting together.`),
  reason('logical',
    'In a pond, tiny green protists make food and release oxygen, small animals eat the protists, and bigger animals eat them in turn. Suppose pollution wipes out the protists. What is the most likely result?',
    [
      'Many other organisms that depend on the protists for food or oxygen will also decline',
      'Nothing else changes, because each organism lives completely on its own',
      'The bigger animals will simply start making their own food instead',
      'The pond will instantly gain new species to replace the lost ones',
    ],
    0,
    'Living things are linked in food webs, so removing one can starve or harm many others that depend on it. "Each organism lives on its own" is the trap — it ignores these links, which are exactly why the loss of one species can ripple outward through an ecosystem.',
    3),
  h('A Richness That Took Ages to Build', 'Understand how this diversity arose, and why it is now at risk.'),
  txt(
`Today's biodiversity did not appear all at once. It built up over an immense span of time, as small differences among living things added up across countless generations. **Fossils** — the preserved remains of ancient plants and animals — are the records that let us read this long history.

But this richness is now under threat. **Pollution, deforestation, overuse of resources, and climate change** are all reducing biodiversity. And because living things are connected, when one species disappears, others that depend on it may decline too. This is exactly where classification earns its keep: by helping us identify which species exist and which are in danger, so we can protect them.`),
  scientist({
    name: 'Birbal Sahni',
    years: '1891–1949',
    nationality: 'Indian',
    portrait_prompt: 'Portrait illustration of Birbal Sahni, Indian palaeobotanist. Formal mid-20th-century attire, thoughtful expression, neutral dark background. Clean editorial illustration style with subtle warm accent. No text.',
    contribution: 'Birbal Sahni was an eminent scientist who **studied fossil plants**. He founded the **Birbal Sahni Institute of Palaeosciences (BSIP)** in Lucknow, which still continues his work today.',
    connection: 'This page is about how today\'s biodiversity built up over a vast span of time — and Sahni\'s fossil studies are exactly how we read that history, linking present-day plants to their ancient ancestors.',
    fun_detail: 'His work showed that life on Earth has a long, connected history, and it continues to inspire young scientists to explore how fossils reveal the story of our planet.',
    learn_more: 'Birbal Sahni Institute of Palaeosciences, Lucknow.',
  }),
  callout('india_science', 'Saving the Dancing Deer of Manipur',
`In Manipur lies a one-of-a-kind habitat — the floating grassy islands called **phumdis** on **Loktak Lake**, in Keibul Lamjao National Park. They are the only home of the **Sangai**, the endangered "dancing deer" found nowhere else. The Sangai was once even declared extinct, then rediscovered in 1953. Today, efforts to conserve the phumdis and the Sangai go hand in hand — protect the habitat, and you protect the species that depends on it.`),
  callout('threads_of_curiosity', 'A Frog Lost in Time',
`Here is a discovery to wonder at. In 2003, scientists in Kerala identified the **Purple Frog** (*Nasikabatrachus sahyadrensis*), a strange creature that lives underground for most of the year and surfaces only during the monsoon. It belongs to an ancient family of frogs, and its discovery helped scientists understand very old amphibian groups — and showed how much may still be hidden in the Western Ghats. If a frog this unusual went unnoticed until 2003, what else might still be waiting to be found?`),
  txt(
`So here is your invitation. The next time you pass a park, a pond, or even a patch of wall with moss on it, stop and really look. Try to spot living things from as many kingdoms as you can — and try to name the group each one belongs to. The science of classification is not locked inside this book. It is a way of seeing the living world, and it begins the moment you start paying attention to the life right around you.`),
  quiz([
    q('Species that are found naturally in only one region and nowhere else on Earth are called —',
      [
        'endemic species',
        'extinct species',
        'endangered species',
        'imported species',
      ], 0,
      'Species found only in one region, like the Nilgiri tahr in India, are endemic species. "Endangered species" is the trap — that means a species at risk of dying out, which is about numbers, not about being unique to one place (though a species can be both).',
      1),
    q('Why can the loss of a single species harm many other organisms in an ecosystem?',
      [
        'Other organisms that depend on it for food or other needs may also decline',
        'Every species lives entirely on its own, so this never actually happens',
        'The remaining species automatically grow larger to make up for it',
        'New species instantly appear to take the lost one\'s place',
      ], 0,
      'Living things are linked in food webs, so removing one can leave others without food or other needs and cause them to decline. "Every species lives on its own" is the trap — it is exactly this dependence between species that makes a single loss spread.',
      2),
    q('How does classifying organisms help in protecting biodiversity?',
      [
        'It helps identify which species exist and which are under threat, so they can be protected',
        'It somehow increases the total number of different species living on the whole Earth',
        'It makes species permanently safe from ever dying out',
        'It removes the need to protect forests and habitats',
      ], 0,
      'Classification lets us know what species exist and flag the ones in danger, which is the first step to protecting them. "It makes species permanently safe" is the trap — naming and sorting a species does not by itself save it; it only guides the conservation work that follows.',
      3),
  ]),
];

applyPages([
  { slug: 'viruses',
    subtitle: 'A speck that is lifeless on a table yet springs to life inside a cell — and fits into none of the five kingdoms',
    blocks: p65 },
  { slug: 'lichens',
    subtitle: 'Two organisms from two kingdoms living as one — and quietly measuring the cleanliness of the air',
    blocks: p66 },
  { slug: 'three-domains-of-life',
    subtitle: 'How reading DNA split the simple "bacteria" in two and redrew the tree of life into three great branches',
    blocks: p67 },
  { slug: 'biodiversity-in-your-backyard',
    subtitle: 'Bringing classification home — the richness of Indian life, why it is at risk, and how to start noticing it',
    blocks: p68 },
]).catch((e) => { console.error(e); process.exit(1); });
