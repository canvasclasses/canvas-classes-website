'use strict';
/**
 * Class 9 Science · Chapter 12 — BATCH: pages 56, 57, 58
 *   56 five-kingdoms     ← §12.5 (classification systems over time) + §12.6 (five-kingdom
 *                           criteria + concept map Fig 12.5). India: Rigveda & Brihat Samhita.
 *   57 kingdom-monera    ← §12.6.1 (unicellular prokaryotes; bacteria & cyanobacteria;
 *                           Lactobacillus, Rhizobium; pollutant breakdown; stromatolites
 *                           Threads; Ram Bux Singh biogas Bridging).
 *   58 kingdom-protista  ← §12.6.2 (unicellular eukaryotes; Amoeba/Paramecium/Euglena;
 *                           diverse nutrition; aquatic food chains; hay infusion).
 *
 * Every claim grounded in iesc112.pdf. Class 9 "Exploration" template (§4B):
 * curiosity_prompt hook, hero image, mid-page reasoning_prompt, inline_quiz last
 * (L1→L2→L3), ≥1 special callout, a fun_fact near the top. §3.6.1 quiz rules.
 * Positions spread later by quiz_balance. Plain classroom voice, no AI-tells.
 *
 *   node scripts/science-ch12/build_p2_4.js [--dry]
 */
const { img, txt, h, cur, callout, table, timeline, reason, q, quiz, applyPages } = require('./_lib');

// ── PAGE 56 — The Five Kingdoms ───────────────────────────────────────────────
const p56 = [
  cur(
    'For almost two thousand years, every living thing on Earth was filed into one of just two drawers: "plant" or "animal". The system seemed complete. Then scientists looked closely at *Euglena*. In sunlight, it sits still and makes its own food — green and quiet, just like a plant. Switch off the light, and the very same creature starts swimming about and hunting for food — just like an animal. So which drawer does *Euglena* go in? Tiny creatures like this did not just bend the rules. They forced scientists to throw out the whole filing cabinet and build a new one.',
    'If two drawers are not enough, how many would you need so that every kind of life has a proper home?',
    'No matter how hard scientists tried, two groups could never hold all of life — single-celled creatures, bacteria, and fungi kept refusing to fit. So over about two hundred years the "map of life" was redrawn again and again, until it grew to five kingdoms. That redrawing is the story of this page.'
  ),
  img(
    'A grand tree of life splitting into five glowing branches, each branch holding a different kind of organism',
    'Ultra-wide cinematic banner (16:5 ratio). A majestic tree of life rising from the centre, its trunk dividing into five distinct glowing branches that fan across the frame — each branch carrying a different kind of life: clustered bacteria, a single drifting microbe, a mushroom, a leafy plant, and an animal. Conveys all of life organised into five great groups. Warm rim light against a deep dark background, painterly cinematic Indian-illustration style. No text overlay.'
  ),
  callout('fun_fact', 'Five Times in Two Hundred Years',
`The way scientists sort living things is not fixed in stone — it has been rebuilt again and again. In barely two hundred years the "map of life" went from **two** groups to **three**, then **four**, then **five**. Each time, a better tool — a sharper microscope, a new way of looking inside cells — revealed life that the old map simply could not hold.`),
  h('A Map of Life That Kept Being Redrawn', 'Trace how scientists went from two groups to five as their tools improved.'),
  txt(
`The earliest attempts were rough. Around the 4th century BCE, the Greek thinker **Aristotle** grouped animals by where they lived — on land, in water, or in the air. It was a start, but it leaned only on what the eye could see.

Much later, scientists split all life into **two kingdoms** — Plantae (things that make their own food and stay put) and Animalia (things that move and feed on others). But this created confusion. Where do you put *Amoeba* or bacteria? They are single-celled, yet plants and animals are made of many cells. And as microscopes improved, scientists spotted a deep difference: an *Amoeba* has a **true nucleus** tucked inside a membrane, while bacteria do not. One by one, new groups were added to hold these misfits — until five kingdoms were needed.`),
  timeline('How the map of life grew', 'vertical', [
    { label: 'Aristotle — grouped animals by habitat (land, water, air). ~4th century BCE' },
    { label: 'Two Kingdoms (Carolus Linnaeus, 1758) — all life split into Plantae and Animalia' },
    { label: 'Three Kingdoms (Ernst Haeckel, 1866) — added Protista for tiny single-celled life' },
    { label: 'Four Kingdoms (Herbert Copeland, 1938) — added Monera for bacteria (no true nucleus)' },
    { label: 'Five Kingdoms (Robert Whittaker, 1969) — Monera, Protista, Fungi, Plantae, Animalia' },
  ]),
  reason('logical',
    'Bacteria and Amoeba are both single-celled. Yet bacteria were finally pulled out into a kingdom of their own (Monera), while Amoeba was not. What is the soundest reason for treating them so differently?',
    [
      'A bacterium has no true (membrane-bound) nucleus, while an Amoeba does — a deep difference inside the cell',
      'Bacteria are smaller than Amoeba, and size is what decides a kingdom',
      'Bacteria can cause disease, and only harmful things get their own kingdom',
      'Amoeba can move while bacteria cannot, so only Amoeba counts as living',
    ],
    0,
    'Being single-celled is something they share, so it cannot separate them. The real divide is inside the cell: bacteria are prokaryotes (no true nucleus), while Amoeba is a eukaryote (true nucleus). The tempting wrong answer is "size" — but a kingdom is decided by how the cell is built, not by how big the organism is.',
    2),
  h('The Four Questions That Sort All Life', 'Learn the four features the five-kingdom system uses to place any organism.'),
  txt(
`The five-kingdom system does not sort life by looks. It asks four clear questions about every organism:

1. **What kind of cell?** Is the nucleus a true, membrane-bound one (eukaryote) or not (prokaryote)?
2. **One cell or many?** Is the organism single-celled or made of many cells?
3. **How does it get food?** Does it make its own food (autotroph) or depend on others (heterotroph)?
4. **Is there a cell wall?** Does the cell have an outer wall, and what is it made of?

Answer these four, and any living thing finds its place in one of the five kingdoms: **Monera, Protista, Fungi, Plantae,** and **Animalia**.`),
  table('The five kingdoms at a glance', ['Kingdom', 'Cells', 'Nucleus', 'Body'], [
    ['Monera', 'Single-celled', 'No true nucleus', 'Bacteria, cyanobacteria'],
    ['Protista', 'Single-celled', 'True nucleus', 'Amoeba, Paramecium, Euglena'],
    ['Fungi', 'Mostly many-celled', 'True nucleus', 'Mushrooms, moulds, yeast'],
    ['Plantae', 'Many-celled', 'True nucleus', 'Mosses, ferns, trees'],
    ['Animalia', 'Many-celled', 'True nucleus', 'Insects, fish, birds, humans'],
  ]),
  callout('india_science', 'Sorting Animals in Ancient India',
`The idea of grouping living things is far older than the modern kingdoms. Ancient Indian texts such as the **Rigveda** and the **Brihat Samhita** already sorted animals by their habitat — those of the land, those of the water, and those of the air — along with their behaviour and their role in nature. It was an early, thoughtful attempt to bring order to the living world.`),
  callout('threads_of_curiosity', 'Why the Map Keeps Changing',
`Notice that the classification did not stop at five. Each new tool let scientists see life more clearly, and each time, the map was redrawn to match. That tells you something about science itself: it is not a finished book of final answers, but an ongoing process that updates itself whenever better evidence arrives. So here is a thought — if our tools keep improving, is today's map of life really the last word?`),
  quiz([
    q('The five kingdom classification used today was given by —',
      [
        'Robert Whittaker',
        'Carolus Linnaeus',
        'Ernst Haeckel',
        'Aristotle',
      ], 0,
      'Whittaker proposed the five-kingdom system in 1969. Linnaeus is a common wrong pick because he is famous in classification, but his system had only two kingdoms; Haeckel added a third (Protista), not the fifth.',
      1),
    q('Why did the old two-kingdom system (only Plantae and Animalia) keep running into trouble?',
      [
        'Single-celled organisms like Amoeba and bacteria did not fit neatly as either plant or animal',
        'There were simply too many plants and animals to fit into only two long lists',
        'Plants and animals were later discovered to be exactly the same kind of living thing',
        'Scientists could not agree on what to call the two kingdoms',
      ], 0,
      'The two-kingdom system assumed every organism was a multicellular plant or animal, but single-celled life like Amoeba and bacteria fit neither. The trap answer is "too many to fit" — the problem was never the number of organisms, it was that some did not belong in either group.',
      2),
    q('In the five-kingdom concept map, which feature is used at the very first split, before any other?',
      [
        'Whether the cell has a true, membrane-bound nucleus or not',
        'Whether the organism makes its own food or eats others',
        'Whether the cell has a cell wall',
        'Whether the body is made of one cell or many',
      ], 0,
      'The concept map first divides all life by cell type — prokaryote (no true nucleus) versus eukaryote (true nucleus) — and only then asks about number of cells, food, and cell walls. The other three are all real criteria, but they are applied later, after the cell-type split.',
      3),
  ]),
];

// ── PAGE 57 — Kingdom Monera ──────────────────────────────────────────────────
const p57 = [
  cur(
    'Take a slow, deep breath. The oxygen now filling your lungs was first released into Earth\'s air not by trees, not by forests, not by any plant — but by living things far too small to see, billions of years before the first tree ever grew. And they never left. Right now they are in the soil under your feet, in the water you drink, in steaming hot springs, even inside your own stomach. Who are these invisible record-breakers that quietly changed the whole planet?',
    'They are single-celled, and they are the only living things whose cell has no true nucleus.',
    'These are the members of Kingdom Monera — bacteria and cyanobacteria. They are the smallest and simplest living things, yet ancient cyanobacteria filled the early air with oxygen and made the rest of life possible. This page is about them.'
  ),
  img(
    'A microscopic world of countless tiny rod, spiral and ball-shaped bacteria glowing against darkness',
    'Ultra-wide cinematic banner (16:5 ratio). A vast microscopic landscape filled with countless tiny single-celled organisms in many shapes — rods, spirals, spheres and clusters — drifting and glowing softly against a deep dark background, hinting at unimaginable numbers and ancient age. Conveys that the smallest, simplest life is also the most widespread and the oldest. Cool blue-green rim lighting, painterly cinematic style. No text overlay.'
  ),
  callout('fun_fact', 'India\'s Oldest Fossils Are Bacteria',
`Some of the earliest evidence of life on Earth comes from **stromatolites** — rocky, layered structures built up by ancient cyanobacteria. Fossil stromatolites have been found in **Rajasthan** and **Madhya Pradesh**. They are a record, written in stone, of microscopic life that was thriving here long before any plant or animal existed.`),
  h('The Smallest, Simplest, Oldest', 'Meet the only living things whose cell has no true nucleus.'),
  txt(
`Kingdom **Monera** holds the **bacteria** and the **cyanobacteria**. Every member is **single-celled** and **prokaryotic** — which means its cell has **no true nucleus** wrapped in a membrane. This one feature sets Monera apart from every other kingdom.

What they lack in size, they make up for in numbers and reach. Bacteria live almost everywhere — in soil, water, and air, in hot springs where almost nothing else survives, and even inside the bodies of living things. In the gut of cattle and other animals, bacteria help break down food and produce **biogas**.`),
  reason('analogical',
    'A bacterium and an Amoeba are both a single cell. But a bacterium\'s genetic material floats freely in the cell, while an Amoeba keeps its genetic material sealed inside a true nucleus, like documents locked in a cabinet. Which conclusion follows best?',
    [
      'The bacterium is a prokaryote and the Amoeba is a eukaryote, so they belong to different kingdoms',
      'They belong to the same kingdom, because both are made of just one cell',
      'The Amoeba must be larger, since only large cells can have a nucleus',
      'The bacterium is not really alive, because living cells must have a true nucleus',
    ],
    0,
    'A sealed nucleus (eukaryote) versus free-floating genetic material (prokaryote) is exactly the line between Monera and Protista. The trap is "same kingdom because both are single-celled" — being one cell is not enough; how the cell is built is what decides the kingdom.',
    3),
  h('Tiny Helpers, Tiny Troublemakers', 'See why most bacteria are useful, not harmful.'),
  txt(
`It is easy to think of bacteria only as germs, but most of them are quietly useful. A few are **pathogens** that cause disease — but many more help us every day.

- *Lactobacillus* turns milk into curd, and *Rhizobium* helps plants get the nitrogen they need.
- **Cyanobacteria** make their own food (they are autotrophs) and also act as decomposers.
- Some bacteria even break down **pollutants** like spilt oil, pesticides, and sewage, helping clean the environment.

Without these tiny workers recycling nutrients and clearing waste, the natural world would quickly grind to a halt.`),
  img(
    'Different shapes of bacteria and cyanobacteria seen under a microscope',
    'Scientific textbook illustration of the members of Kingdom Monera. Flat 2D educational diagram on a dark background (#0a0a0a or near-black). Show several distinct bacterial shapes side by side — rod-shaped (bacillus), spherical clusters (cocci), spiral (spirillum), and a chain of blue-green cyanobacteria cells. Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. Soft natural colours, no photorealism, no stylised characters. Match standard biology textbook illustration conventions.',
    '4:3'),
  callout('bridging_science', 'India\'s "Father of Modern Biogas"',
`Some bacteria release **biogas** as they break down waste — a clean fuel that can cook food and light homes. The Indian scientist **Ram Bux Singh** saw the promise in this. In 1957 he set up India's first scientifically designed biogas plant at **Ramnagar, Sitapur, in Uttar Pradesh**, and spent his life developing low-cost biogas plants for rural areas. His work, built on the quiet activity of bacteria, helped bring renewable energy and better waste management to villages.`),
  quiz([
    q('Organisms placed in Kingdom Monera are best described as —',
      [
        'single-celled organisms with no true nucleus',
        'single-celled organisms with a true nucleus',
        'many-celled organisms with a cell wall',
        'many-celled organisms without a cell wall',
      ], 0,
      'Monera are single-celled prokaryotes — their cells have no true, membrane-bound nucleus. Single-celled organisms *with* a true nucleus is the tempting wrong choice, but those belong to Protista, not Monera.',
      1),
    q('Bacteria are often thought of only as germs. Which real role of bacteria best shows they can also be helpful?',
      [
        'Some break down pollutants such as spilt oil and sewage',
        'They make every kind of food we eat slowly turn poisonous',
        'They give green plants their green colour',
        'They form the hard protective skeletons of large animals',
      ], 0,
      'Several bacteria clean up the environment by breaking down pollutants like oil, pesticides, and sewage. The "all food turns poisonous" option is the germs-only misconception — most bacteria are harmless or useful, and some, like Lactobacillus, even help make food such as curd.',
      2),
    q('A microbe is found in a scalding hot spring. It is single-celled, and its genetic material has no true nucleus around it. To which kingdom does it belong, and what decides it?',
      [
        'Monera, because it has no true nucleus',
        'Protista, because it is single-celled',
        'Fungi, because it survives in a harsh place',
        'Animalia, because it lives and grows',
      ], 0,
      'The deciding feature is the missing true nucleus — that makes it a prokaryote, so it belongs to Monera. "Protista because it is single-celled" is the trap: Protista are also single-celled, but they have a true nucleus, which this microbe lacks.',
      3),
  ]),
];

// ── PAGE 58 — Kingdom Protista ────────────────────────────────────────────────
const p58 = [
  cur(
    'Your body is built from billions of cells, and they share the work like a huge team — some cells handle seeing, some handle digesting, some handle moving, some carry oxygen. No single cell has to do everything. Now meet *Amoeba*. It is just **one cell**, all alone, and it must do every single one of those jobs by itself — find food, eat, move, breathe, sense danger, throw out waste, and even reproduce. How does one tiny blob manage what your body needs billions of cells to do?',
    'Being a single cell does not mean being simple — it means that one cell is fully self-sufficient.',
    'Creatures like Amoeba belong to Kingdom Protista: single-celled, but with a true nucleus, and each one a complete, self-running living thing. This page is about these remarkable one-celled organisms.'
  ),
  img(
    'A drop of pond water teeming with tiny single-celled creatures of many shapes',
    'Ultra-wide cinematic banner (16:5 ratio). A single glistening drop of pond water suspended against darkness, and inside it a busy hidden world of tiny single-celled creatures of varied shapes — a blob-like one, a slipper-shaped one, a spindle-shaped one with a tiny tail — drifting and glowing. Conveys a whole living world inside one drop of water. Soft watery rim light against a deep dark background, painterly cinematic style. No text overlay.'
  ),
  callout('fun_fact', 'Grow Your Own Invisible Zoo',
`You can actually see these creatures yourself. Soak some grass or straw in pond water, cover it, and leave it for about a week. This "hay infusion" becomes crowded with single-celled life. Put one drop under a microscope and a whole invisible zoo appears — proof that even a still jar of water is teeming with hidden living things.`),
  h('Life in a Single Cell', 'See what makes Protista the "in-between" kingdom of life.'),
  txt(
`Kingdom **Protista** is home to single-celled organisms that have a **true nucleus** — they are **eukaryotes**. This is the feature that separates them from the bacteria of Monera, which have no true nucleus.

Protists sit "in between" the other kingdoms. They are far more complex inside than bacteria, yet they are not built from many cells the way plants, animals, and most fungi are. Each protist is a single cell that runs its whole life on its own. They are microscopic and astonishingly varied, found in water and in moist places everywhere.`),
  reason('logical',
    'Two single-celled organisms are placed under a microscope. One has its genetic material loose inside the cell; the other keeps it inside a true nucleus. Why are these two placed in different kingdoms even though both are single-celled?',
    [
      'A true nucleus makes one a eukaryote (Protista); its absence makes the other a prokaryote (Monera)',
      'One must be a plant and the other an animal, since all single cells are one or the other',
      'Being single-celled always means both belong to exactly the same kingdom',
      'The larger of the two is automatically the more advanced kingdom',
    ],
    0,
    'Both being single-celled is exactly what they share, so it cannot separate them. The dividing line is the nucleus: a true nucleus means Protista (eukaryote); no true nucleus means Monera (prokaryote). "Single-celled means same kingdom" is the trap — the inside of the cell is what decides.',
    2),
  h('Jacks of All Trades', 'Discover the surprising variety of how protists live and feed.'),
  txt(
`For such tiny creatures, protists live in remarkably different ways. Some, like *Amoeba* and *Paramecium*, hunt and take in food (they are heterotrophs). Others make their own food by photosynthesis (they are autotrophs). And *Euglena* does both — it makes its own food in sunlight, then switches to feeding on others in the dark.

This variety makes protists vital to life in water. They are an important link in **aquatic food chains** — some release oxygen, many serve as food for small water animals, and some act as decomposers that recycle nutrients.`),
  img(
    'Three common protists — Amoeba, Paramecium and Euglena — shown side by side',
    'Scientific textbook illustration of three common protists side by side at the same scale. Flat 2D educational diagram on a dark background (#0a0a0a or near-black). Left: Amoeba, an irregular blob with pseudopodia and a visible nucleus. Middle: Paramecium, a slipper-shaped cell covered in tiny cilia, with a visible nucleus and contractile vacuole. Right: Euglena, a spindle-shaped cell with a single flagellum and green chloroplasts. Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. No photorealism, no stylised characters. Match standard biology textbook illustration conventions.',
    '4:3'),
  callout('bridging_science', 'The Hidden Base of Water Life',
`These specks are easy to overlook, but a great deal of water life rests on them. Many protists release oxygen into the water, and countless small animals feed on them directly. They form the broad base of aquatic food chains — so if the protists in a pond or sea were to vanish, the fish and other animals that depend on them would soon run out of food. Tiny does not mean unimportant.`),
  quiz([
    q('Kingdom Protista is made up of —',
      [
        'single-celled organisms that have a true nucleus',
        'single-celled organisms that have no true nucleus',
        'many-celled organisms that have a cell wall of chitin',
        'many-celled organisms that move and feed on others',
      ], 0,
      'Protists are single-celled eukaryotes — single cells with a true nucleus. "Single-celled with no true nucleus" is the trap, but those are bacteria (Monera); the true nucleus is what makes a protist a protist.',
      1),
    q('Euglena makes its own food in sunlight, then feeds on other organisms in the dark. What does this best show about protists?',
      [
        'Protists show a wide variety of ways to get food, even within a single organism',
        'All protists make their own food, just like green plants do',
        'Euglena belongs partly to the plant kingdom and partly to the animal kingdom',
        'A protist can only ever feed in one fixed way throughout its life',
      ], 0,
      'Euglena shows that protists are very diverse in how they feed — some make food, some take it in, and Euglena does both. The trap is "only one fixed way": Euglena itself proves the opposite, switching between making and taking food depending on light.',
      2),
    q('Under a microscope you see a single-celled organism with a true nucleus and tiny hair-like cilia all over its body. To which kingdom does it most likely belong?',
      [
        'Protista',
        'Monera',
        'Fungi',
        'Animalia',
      ], 0,
      'A single cell with a true nucleus points to Protista (Paramecium, for example, is covered in cilia). Monera is the tempting wrong answer because it too is single-celled, but Monera cells have no true nucleus, which this organism clearly does.',
      3),
  ]),
];

applyPages([
  { slug: 'five-kingdoms',
    subtitle: 'How the map of life was redrawn from two groups to five — and the four questions that sort every living thing',
    blocks: p56 },
  { slug: 'kingdom-monera',
    subtitle: 'The smallest, simplest and oldest living things — single cells with no true nucleus that quietly run the planet',
    blocks: p57 },
  { slug: 'kingdom-protista',
    subtitle: 'Single cells with a true nucleus, each one a complete, self-running life — the "in-between" kingdom',
    blocks: p58 },
]).catch((e) => { console.error(e); process.exit(1); });
