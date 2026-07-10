'use strict';
/**
 * Class 9 Science · Chapter 12 — BATCH: pages 62, 63, 64
 *   62 major-divisions-of-plants  ← §12.6.4 detail + Table 12.3 (Thallophyta/Bryophyta/
 *                                    Pteridophyta/Gymnosperm/Angiosperm; water→land journey;
 *                                    Spirogyra, Marchantia/moss, fern, pine, gulmohar; Hortus
 *                                    Malabaricus Bridging/India).
 *   63 major-divisions-of-animals ← §12.6.5 detail (invertebrate phyla Porifera→Echinodermata;
 *                                    complexity ladder; protochordata Amphioxus; vertebrata 5
 *                                    groups; sponge 24,000 L Threads; forests-as-barrier Bridging).
 *   64 binomial-nomenclature      ← §12.7.1 (hierarchy Kingdom→Species; address analogy; tiger
 *                                    pyramid) + §12.8 (binomial system; Linnaeus; Panthera tigris/
 *                                    Panthera leo; Mangifera indica; rules for writing names).
 *
 * Grounded in iesc112.pdf. Template/quiz rules per §4B and §3.6.1.
 *   node scripts/science-ch12/build_p8_10.js [--dry]
 */
const { img, txt, h, cur, callout, table, reason, q, quiz, applyPages } = require('./_lib');

// ── PAGE 62 — Major Divisions of Plants ───────────────────────────────────────
const p62 = [
  cur(
    'The first plants could not leave the water. Lift them onto dry land and they would simply dry out and die. Yet today plants grow on freezing mountaintops, in baking deserts, and even on dry rooftops. Getting from the water onto the land was one of the hardest journeys in the history of life — and plants did not solve it in one jump. They cracked it one problem at a time: first plumbing to carry water, then drought-proof seeds, and finally flowers. What were those problems, and which group of plants solved each one?',
    'Each new group of plants fixed a problem that held the earlier group back.',
    'The five groups of the plant kingdom tell a single story — the slow move from water to land. Each group keeps the strengths of the one before and adds a new invention. This page follows that journey from simple algae to flowering plants.'
  ),
  img(
    'A sweeping scene moving from algae in water on the left to a flowering tree on dry land on the right',
    'Ultra-wide cinematic banner (16:5 ratio). A continuous landscape that flows from left to right: green algae floating in shallow water on the far left, then a cushion of moss on a damp rock, then a fern, then a pine tree with cones on a slope, and finally a large flowering tree on dry ground at the right. Conveys the gradual journey of plants from water onto land. Warm directional light against a deep dark atmospheric background, painterly cinematic Indian-illustration style. No text overlay.'
  ),
  callout('fun_fact', 'The Names Tell the Story',
`Each plant group is named for what makes it special. **Thallophyta** comes from *thallos* (an undifferentiated body) — these plants are just a simple body with no real parts. **Pteridophyta** comes from *pteron* (feather) — think of feathery fern leaves. **Gymnosperm** means "naked seed", and **Angiosperm** means "seed in a vessel". The names are tiny clues to how each group is built.`),
  h('Stuck Near the Water: Thallophyta and Bryophyta', 'Meet the simplest plants and the first ones to step onto land.'),
  txt(
`**Thallophyta** are the simplest plants — the **algae**. Their body is a plain **thallus**, with no true roots, stems, or leaves, so the whole body soaks up water and gases directly from its surroundings. This works only in water or very wet places. *Spirogyra*, a fine green thread found in ponds, is an example.

**Bryophyta** — the **mosses** and liverworts — were the first plants to begin living on land, often as green mats on damp walls and soil during the monsoon. They have a slightly more developed body, with root-like **rhizoids** and simple stem-like and leaf-like parts. But they are often called the **"amphibians" of the plant kingdom**, because they still need water to reproduce and can only survive in moist, shady places. *Marchantia* and the mosses are examples.`),
  reason('logical',
    'Mosses (bryophytes) were the first plants to grow on land, yet they can live only in damp, shady spots and dry up easily elsewhere. Which feature best explains why they stayed tied to moist places?',
    [
      'They lack proper water-carrying tissue and still need water for reproduction, so they cannot manage in dry areas',
      'They are green, and green plants can never survive away from water',
      'They are too small, and only large plants can live in dry places',
      'They have true roots that trap them in one spot near water',
    ],
    0,
    'Mosses have only simple root-like rhizoids and no real transport tissue, and their reproduction needs water — so they dry out away from damp places. "They have true roots" is wrong and is the trap: mosses do not have true roots; that is exactly what the next group, the ferns, added.',
    2),
  h('Conquering the Land: Ferns, Conifers, and Flowers', 'Follow the three groups that finally mastered dry land.'),
  txt(
`**Pteridophyta** — the **ferns** — were a big step forward. They have **true roots, stems, and leaves**, and **vascular tissue** (xylem and phloem) that carries water and food to every part of the plant. This let them grow larger and spread on land. But they still **do not make seeds**, and they **still need water to reproduce**.

**Gymnosperms**, such as **pines** and cycads, solved the water problem. They make **seeds** that protect the tiny embryo and store food, and they **do not need water for fertilisation**, so they survive in cold, dry regions. Their seeds are **naked** — not wrapped in a fruit — and sit exposed on **cones**.

**Angiosperms** — the **flowering plants** — went furthest of all. They produce **flowers** (which attract pollinators) and **fruits** (which carry the seeds to new places, and protect them). With these tools they reproduce efficiently and live almost everywhere, which makes them the **most diverse** group of plants on Earth.`),
  table('The journey from water to land', ['Plant group', 'Big new advance', 'Still limited by'], [
    ['Thallophyta (algae)', 'A simple body that soaks up water directly', 'Cannot live out of water'],
    ['Bryophyta (mosses)', 'First to colonise land; rhizoids', 'Always needs moisture'],
    ['Pteridophyta (ferns)', 'True roots, stems, leaves; transport tissue', 'Still needs water to reproduce'],
    ['Gymnosperms (pines)', 'Seeds; no water needed to fertilise', 'Seeds left naked, not covered'],
    ['Angiosperms (flowering plants)', 'Flowers and fruits; covered seeds', 'Depends on pollinators'],
  ]),
  callout('india_science', 'A 17th-Century Book of Indian Plants',
`One of the earliest scientific books on Indian plants, **Hortus Malabaricus**, was put together in the 17th century by Hendrik van Rheede with the help of an Indian herbalist and physician, **Itty Achudan**, and other local experts. It described hundreds of plant species and their medicinal uses — a clear example of traditional Indian knowledge and science working hand in hand.`),
  quiz([
    q('Which group of plants produces both flowers and fruits?',
      [
        'Angiosperms',
        'Gymnosperms',
        'Pteridophytes',
        'Bryophytes',
      ], 0,
      'Angiosperms are the flowering plants — they make flowers and fruits. Gymnosperms are the trap: they do make seeds, but those seeds are naked on cones, with no flowers or fruits.',
      1),
    q('Both ferns (pteridophytes) and mosses (bryophytes) lack flowers and seeds. What key feature places the fern in the more advanced group?',
      [
        'The fern has true roots, stems, leaves and vascular tissue, which the moss lacks',
        'The fern produces seeds, while the moss does not',
        'The fern makes its own food, while the moss cannot',
        'The fern lives entirely on dry land and never needs any water at any stage',
      ], 0,
      'Ferns have true roots, stems, leaves and water-carrying vascular tissue — features the simpler moss does not have. "The fern produces seeds" is the trap: ferns, like mosses, have no seeds, so that cannot be the difference.',
      2),
    q('Why can gymnosperms like pines survive in cold, dry places where mosses cannot?',
      [
        'Pines make seeds and do not need water for fertilisation, while mosses need water to reproduce',
        'Pines are simply much larger, and larger plants always survive cold and drought better',
        'Pines make their own food but mosses cannot make any',
        'Pines have no leaves to lose water, while mosses have many',
      ], 0,
      'Mosses depend on water to reproduce and dry out easily; pines reproduce with seeds and need no water for fertilisation, so they handle dry, cold places. "Mosses cannot make food" is false — mosses are green plants and photosynthesise too; the real difference is water-dependent reproduction.',
      3),
  ]),
];

// ── PAGE 63 — Major Divisions of Animals ──────────────────────────────────────
const p63 = [
  cur(
    'A sponge is an animal — but it has no brain, no heart, no mouth, no stomach, not even a single proper organ. It just sits fixed on the seabed and lets sea water flow right through its body, taking food and oxygen to its cells. From this almost plant-like beginning, the animal kingdom climbs, step by step, to creatures with muscles, nerves, hearts, and finally backbones. What exactly is added at each step up the ladder?',
    'At each step, a new body feature appears that the simpler animals did not have.',
    'Animals can be lined up like rungs on a ladder of body complexity — from the simple sponge to animals with a backbone. Each group keeps what came before and adds something new. This page climbs that ladder.'
  ),
  img(
    'A rising arrangement of animals from a simple sponge at the bottom to a backboned animal at the top',
    'Ultra-wide cinematic banner (16:5 ratio). A gently rising arrangement of animals from left to right suggesting increasing complexity: a sponge, then a jellyfish, a flatworm, a segmented earthworm, a beetle, a snail, a starfish, and finally a fish with a clear backbone. Conveys a ladder of growing body complexity across the animal kingdom. Cool rim lighting against a deep dark background, painterly cinematic style. No text overlay.'
  ),
  callout('fun_fact', 'A Living Water Filter',
`A sponge has no organs, yet it is astonishingly good at one job. Research shows that just **one kilogram of sponge can filter up to 24,000 litres of sea water in a single day** — pulling out tiny food particles as the water streams through its body. Not bad for an animal with no heart and no muscles.`),
  h('Climbing the Ladder: The Invertebrates', 'See how animal bodies grow more complex, one group at a time.'),
  txt(
`Animals without a backbone are the **invertebrates** (non-chordates). Lined up, they show a clear rise in body complexity:

- **Porifera** (sponges) are multicellular but have **no true tissues or organs**.
- **Cnidaria** (Hydra, jellyfish) have **true tissues** and tentacles to catch prey, but a single opening for food and waste.
- **Platyhelminthes** (flatworms) add **bilateral symmetry** — a distinct head and tail end.
- **Nematoda** (roundworms) have a gut with **two openings** (a mouth and an anus).
- **Annelida** (earthworms) have a **segmented body** and a body cavity.
- **Arthropoda** (insects, crabs, spiders) have **jointed legs** and a hard **exoskeleton**.
- **Mollusca** (snails, octopuses) have **soft bodies**, often with a protective shell.
- **Echinodermata** (starfish) have a hard **internal skeleton** of calcium carbonate.`),
  table('The invertebrate ladder', ['Group', 'Example', 'Step forward'], [
    ['Porifera', 'Sponge', 'First multicellular body — but no tissues or organs'],
    ['Cnidaria', 'Hydra, jellyfish', 'True tissues; tentacles to catch prey'],
    ['Platyhelminthes', 'Flatworm', 'Bilateral symmetry — a head and a tail end'],
    ['Nematoda', 'Roundworm', 'A gut with two openings (mouth and anus)'],
    ['Annelida', 'Earthworm', 'A segmented body and a body cavity'],
    ['Arthropoda', 'Insect, crab, spider', 'Jointed legs and a hard exoskeleton'],
    ['Mollusca', 'Snail, octopus', 'Soft body, often with a protective shell'],
    ['Echinodermata', 'Starfish', 'A hard internal skeleton (endoskeleton)'],
  ]),
  reason('logical',
    'A starfish has a hard skeleton, just as a fish does. Yet the starfish is grouped with the invertebrates and the fish with the vertebrates. What is the soundest reason for this difference?',
    [
      'A starfish has no notochord or backbone, while a fish has a backbone — the skeleton type is not what counts',
      'A starfish is much smaller, and only large animals can be vertebrates',
      'A starfish lives in the sea, and sea animals are always invertebrates',
      'A starfish cannot move, so it cannot be placed with the fish',
    ],
    0,
    'Animals are split first by the notochord/backbone, not by simply "having a skeleton". A starfish has an internal skeleton but no backbone, so it stays an invertebrate, while a fish has a true backbone. "Sea animals are always invertebrates" is the trap — fish live in the sea too, and they are vertebrates.',
    3),
  h('Crossing Over: Protochordates and Vertebrates', 'Discover the bridge from invertebrates to backboned animals.'),
  txt(
`Between the invertebrates and the familiar backboned animals sit the **protochordates**, like *Amphioxus*. They have a **notochord at least once** in their lives — a soft rod that hints at the backbone to come. They are simple chordates that help us see how backboned animals may have arisen from simpler forms.

The **vertebrates** are animals with a true **vertebral column** (backbone). This internal skeleton supports a larger body and protects the brain and spinal cord, allowing complex organ systems and sharp senses. Vertebrates are sorted into five groups — **fish, amphibians, reptiles, birds, and mammals** — based on their habitat, body covering, and how they reproduce.`),
  img(
    'The five vertebrate groups shown together — a fish, a frog, a lizard, a bird and a mammal',
    'Scientific textbook illustration of the five vertebrate groups side by side at a comparable scale. Flat 2D educational diagram on a dark background (#0a0a0a or near-black). Left to right: a fish, an amphibian (frog), a reptile (lizard), a bird, and a mammal (e.g. a deer), each clearly showing a backbone hinted along the body. Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. No photorealism, no stylised characters. Match standard biology textbook illustration conventions.',
    '16:9'),
  callout('bridging_science', 'How a Rich Forest Shields People',
`A forest full of varied life does more than look beautiful — it acts as a living shield. During the 1999 super cyclone that struck Odisha, villages with thick **mangrove** forests suffered far less destruction than those without. In the Western Ghats, diverse forests have acted as a barrier against **Kyasanur Forest Disease** ("Monkey Fever"), because many forest animals are hosts in which the virus cannot multiply. Protecting biodiversity, it turns out, also protects people.`),
  quiz([
    q('Animals that do not have a backbone, such as insects and worms, are together called —',
      [
        'invertebrates',
        'vertebrates',
        'protochordates',
        'chordates',
      ], 0,
      'Animals without a backbone are the invertebrates. "Vertebrates" is the opposite — those are the animals that do have a backbone, like fish and mammals.',
      1),
    q('A starfish has a hard internal skeleton, yet it is still classed as an invertebrate. Why?',
      [
        'It has no notochord or backbone, even though it has a skeleton',
        'Its skeleton is made of bone, which is not allowed in vertebrates',
        'It is too small to be counted as a vertebrate',
        'It lives in water, and all water animals are invertebrates',
      ], 0,
      'Being a vertebrate depends on having a backbone, not just any skeleton — the starfish has an internal skeleton but no backbone, so it is an invertebrate. "All water animals are invertebrates" is the trap: fish live in water and are vertebrates.',
      2),
    q('Sponges have no true tissues or organs, which makes them look very simple. Which feature still supports placing them firmly in the animal kingdom?',
      [
        'Their cells have only a cell membrane and no cell wall',
        'They are able to make their own food by photosynthesis',
        'Their cells are wrapped in a thick wall of cellulose',
        'They have no cells at all, only open spaces',
      ], 0,
      'Animal cells have a cell membrane but no cell wall — and sponge cells fit this, which keeps them in the animal kingdom despite lacking organs. "A thick wall of cellulose" is the trap, because that is a plant feature, the very opposite of an animal cell.',
      3),
  ]),
];

// ── PAGE 64 — Binomial Nomenclature (+ the classification hierarchy) ──────────
const p64 = [
  cur(
    'Call out the word "tiger" in a market in Tamil Nadu and people might look puzzled — there the animal is *puli*. In Hindi it is *bagh*, in French it is *tigre*, and that is just one word in each language. One animal, dozens of names. Now imagine scientists in five different countries trying to study and discuss the very same animal. How do they make absolutely sure they are all talking about exactly the same creature, with no room for confusion?',
    'Common names change from place to place; scientists needed one name that never changes.',
    'To avoid confusion, scientists give every living thing one universal two-part name — the same in every country. But before naming, they place each organism in a ladder of groups. This page covers both: the ladder, and the name.'
  ),
  img(
    'A grand tiger at the centre with faint nested rings around it suggesting levels of grouping',
    'Ultra-wide cinematic banner (16:5 ratio). A majestic tiger standing at the centre of the frame, surrounded by faint glowing nested arcs or rings that widen outward, suggesting how a single animal sits inside larger and larger groups. Conveys both identity (one exact animal) and classification (nested groups). Warm amber rim light against a deep dark background, painterly cinematic Indian-illustration style. No text overlay.'
  ),
  callout('fun_fact', 'A Name That Reveals Cousins',
`The scientific name of the tiger is *Panthera tigris*, and the lion is *Panthera leo*. Look closely: the first word is the same. That shared first name, **Panthera**, instantly tells you that tigers and lions are close relatives — both are roaring cats. A scientific name is not just a label; it quietly points to an organism's family.`),
  h('Every Living Thing Has an Address', 'Learn the ladder of groups used to place any organism.'),
  txt(
`Before naming an organism, scientists place it in a series of groups, from the very broad down to the very specific:

**Kingdom → Phylum → Class → Order → Family → Genus → Species**

Each step down is narrower than the one above, and the organisms inside share **more and more features**. Every lower group is part of the group above it.

It works just like a postal address. "India" is broad; "your house" is exact. In the same way, a tiger is in the Kingdom **Animalia** at the top, and narrows down step by step to its species, *Panthera tigris*, at the very bottom. This ladder lets scientists place, compare, and find any organism precisely.`),
  reason('logical',
    'In the classification ladder, compare a large group like a Class with a small group like a Genus. Which statement is correct?',
    [
      'A Genus has fewer members than a Class, but those members share more features with one another',
      'A Genus has more members than a Class, and they share fewer features',
      'A Class and a Genus always contain exactly the same number of members',
      'The lower the group, the less its members have in common',
    ],
    0,
    'As you move down the ladder, each group holds fewer organisms but they are more alike — a Genus (low) is smaller and tighter than a Class (high). "The lower the group, the less in common" is the trap: it is the reverse — lower groups share more, not less.',
    2),
  img(
    'A pyramid showing the classification levels of a tiger from Kingdom at the top to species at the base',
    'Scientific textbook illustration of a classification pyramid for the tiger. Flat 2D educational diagram on a dark background (#0a0a0a or near-black). A vertical stack of widening bands from a narrow base to a broad top, labelled from bottom to top: Species (Panthera tigris), Genus (Panthera), Family (Felidae), Order (Carnivora), Class (Mammalia), Phylum (Chordata), Kingdom (Animalia). Clean white outlines and white text labels. No photorealism, no stylised characters. Match standard biology textbook illustration conventions.',
    '4:3'),
  h('One Name the Whole World Agrees On', 'Learn how scientific names are built and written.'),
  txt(
`Because common names cause confusion, scientists use **binomial nomenclature** — a two-part naming system introduced by **Carolus Linnaeus** in the 18th century. Every organism gets a scientific name written in Latin, with two parts.

The first part is the **genus** and the second is the **species**. For the tiger it is *Panthera tigris*; for the mango it is *Mangifera indica*. The genus groups closely related species together — *Panthera* holds the roaring cats, so the tiger (*Panthera tigris*) and the lion (*Panthera leo*) sit side by side. Together, the genus and species form one unique name used worldwide.`),
  callout('remember', 'How to Write a Scientific Name',
`Three simple rules:

1. The name has **two parts** — the **genus** first, then the **species**.
2. The **genus** starts with a **capital letter**; the **species** is written in **small (lower-case) letters**. Example: *Panthera tigris*.
3. The name is written in **italics** when printed, and **underlined** when written by hand.`),
  callout('what_if', 'What If There Were No Universal Names?',
`Imagine every country and language kept using only its own local names for plants and animals — no shared scientific names at all. A medicine made from one plant in India, a researcher studying the same plant in Brazil, and a trader buying it in another country might never realise they are dealing with the very same species. How much confusion — in science, medicine, and trade — do you think this single problem would cause?`),
  quiz([
    q('A scientific name has two parts. The first part is the —',
      [
        'genus',
        'species',
        'family',
        'kingdom',
      ], 0,
      'In a two-part scientific name, the first word is the genus and the second is the species. "Species" is the trap: it is part of the name, but it comes second, not first.',
      1),
    q('Which of these gives the scientific name of the tiger written correctly?',
      [
        'Panthera tigris — the genus capitalised and first, the species in small letters',
        'panthera tigris — with the genus written in small letters, not capitalised',
        'Panthera Tigris — with the species name wrongly given a capital letter',
        'Tigris panthera — with the species written before the genus, in reversed order',
      ], 0,
      'The genus comes first with a capital letter, and the species follows in lower case — Panthera tigris. Giving the species a capital letter is the trap: the species name should always begin with a small letter, never a capital.',
      2),
    q('As you move down the classification ladder from Kingdom toward Species, what happens to the groups?',
      [
        'They contain fewer members, but those members share more features',
        'They contain more members, who share fewer features',
        'They always contain the same number of members at every level',
        'Their members become less and less related to each other',
      ], 0,
      'Lower groups are smaller and tighter — fewer organisms, but more shared features (a Species is the tightest of all). "More members, fewer features" is the reverse of what actually happens as you go down the ladder.',
      3),
  ]),
];

applyPages([
  { slug: 'major-divisions-of-plants',
    subtitle: 'From simple algae to flowering plants — the story of how plants slowly conquered dry land',
    blocks: p62 },
  { slug: 'major-divisions-of-animals',
    subtitle: 'A ladder of body complexity from the simple sponge to animals with a backbone',
    blocks: p63 },
  { slug: 'binomial-nomenclature',
    subtitle: 'How scientists place every organism in a ladder of groups and give it one universal two-part name',
    blocks: p64 },
]).catch((e) => { console.error(e); process.exit(1); });
