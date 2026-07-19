'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'nitrogenous-wastes-and-excretory-organs',
  title: 'Nitrogenous Wastes & Excretory Organs',
  subtitle: "Your body's metabolism keeps making poisons it has to throw out — and the single most important rule of this whole chapter is that the more toxic the waste, the more water it costs to get rid of. That one rule explains why a fish, a frog, and a bird each dump their nitrogen in a completely different form.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['excretory-products-and-their-elimination', 'nitrogenous-wastes'],
  glossary: [
    { term: 'nitrogenous waste', definition: 'A nitrogen-containing waste product of metabolism. Ammonia, urea and uric acid are the three major forms excreted by animals.' },
    { term: 'ammonotelism', definition: 'The process of excreting waste nitrogen as ammonia. Seen in many bony fishes, aquatic amphibians and aquatic insects.' },
    { term: 'ureotelism', definition: 'The process of excreting waste nitrogen as urea. Seen in mammals, many terrestrial amphibians and marine fishes; the ammonia is turned into urea in the liver first.' },
    { term: 'uricotelism', definition: 'The process of excreting waste nitrogen as uric acid, passed out as a pellet or paste with very little water. Seen in reptiles, birds, land snails and insects.' },
    { term: 'protonephridia', definition: 'Excretory structures — also called flame cells — of Platyhelminthes (flatworms like Planaria), rotifers, some annelids and the cephalochordate Amphioxus. Mainly handle osmoregulation.' },
    { term: 'nephridia', definition: 'The tubular excretory structures of earthworms and other annelids; they remove nitrogenous wastes and keep the fluid and ionic balance right.' },
    { term: 'malpighian tubules', definition: 'The excretory structures of most insects, including the cockroach; they remove nitrogenous wastes and carry out osmoregulation.' },
    { term: 'osmoregulation', definition: "The control of an animal's water content and ion (salt) levels — its ionic and fluid volume balance." },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark naturalistic scene showing a fish in water, a frog at the water\'s edge, and a bird in flight, each in its own pool of dim light',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single quiet naturalistic scene at dusk arranged left to right: a fish suspended in dark rippling water on the left, a frog resting at the muddy water's edge in the centre, and a bird in mid-flight against a dim sky on the right — three animals sharing one continuous atmospheric landscape. Soft moonlight catches the water's surface and the edges of each animal, deep shadows fill the rest. Painterly, atmospheric illustration, dark background throughout (#0a0a0a base tones), naturalistic and calm, no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'A Fish Can Afford to Be Wasteful. A Bird Cannot.',
      markdown: "A bony fish sits inside an endless supply of water, so it can throw its waste nitrogen out in the cheapest, most toxic form there is — **ammonia** — and just let the surrounding water wash it away. A bird flying through the air has no such luxury. Every gram of water it carries is weight it has to lift, so a bird squeezes its nitrogen out as a nearly dry paste — **uric acid** — losing almost no water at all. Same problem, opposite solutions, decided entirely by how much water each animal can spare.",
    },
    // ── 2 · Core concept — what accumulates, and the three wastes ─────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Living costs an animal something: its own metabolism keeps producing substances it cannot keep inside itself. Animals accumulate **ammonia, urea, uric acid, carbon dioxide, water,** and **ions** like Na⁺, K⁺, Cl⁻, phosphate and sulphate — some from metabolic activity, some just from taking in more than the body needs. All of it has to be removed, fully or partly.\n\nAmong these, the ones that matter most in this chapter are the **nitrogenous wastes** — the nitrogen-carrying leftovers. There are **three major forms: ammonia, urea, and uric acid.** They are not equally dangerous, and this is the single fact the whole chapter hangs on:\n\n- **Ammonia** is the **most toxic**, and getting rid of it needs a **large amount of water**.\n- **Uric acid** is the **least toxic**, and it can be removed with a **minimum loss of water**.\n- **Urea** sits **in between** the two — moderately toxic, moderate water.\n\nRead that as one sliding scale: the more toxic the waste, the more water it takes to flush it out safely. An animal's choice of which waste to make is really a choice about how much water it can afford to lose.",
    },
    // ── 3 · Heading — the three strategies ───────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Ammonotelism, Ureotelism, Uricotelism — Three Ways to Dump Nitrogen',
      objective: "By the end of this you can name each strategy's waste product, its toxicity and water cost, and the exact group of animals NCERT lists for it — and explain why moving onto land pushed animals toward the less toxic wastes.",
    },
    // ── 4 · Text — the three strategies explained ────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Biologists name each strategy after the waste the animal excretes.\n\n**Ammonotelism** is excreting **ammonia**. **Many bony fishes, aquatic amphibians,** and **aquatic insects** are ammonotelic. It works because ammonia is **readily soluble** in water — so these animals simply let it leave by **diffusion across the body surface**, or (in fish) **across the gill surfaces**, as **ammonium ions**. Notice what's missing: the **kidneys play no significant role** in getting rid of ammonia. The surrounding water does the work.\n\nMoving onto land changed everything. Out of water, an animal cannot afford to spend litres flushing out toxic ammonia. **Terrestrial adaptation** therefore forced the shift to **less toxic nitrogenous wastes — urea and uric acid — to conserve water.**\n\n**Ureotelism** is excreting **urea**. **Mammals, many terrestrial amphibians,** and **marine fishes** are ureotelic. Here the ammonia made by metabolism is first converted into **urea in the liver**, then **released into the blood**, which the **kidneys filter** to excrete the urea out. (In some of these animals a little urea is even held back in the kidney to help maintain the right osmolarity.)\n\n**Uricotelism** is excreting **uric acid**. **Reptiles, birds, land snails,** and **insects** are uricotelic. They pass their nitrogen out as **uric acid in the form of a pellet or paste**, with a **minimum loss of water** — the driest option, and the best for an animal that has to guard every drop.",
    },
    // ── 5 · Table — the three strategies ─────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 5,
      caption: 'The three nitrogen-excreting strategies, side by side — waste, toxicity and water cost, and the animals that use each',
      headers: ['Strategy', 'Waste excreted', 'Toxicity & water need', 'Example animals'],
      rows: [
        ['Ammonotelism', 'Ammonia', 'Most toxic; needs the most water', 'Many bony fishes, aquatic amphibians, aquatic insects'],
        ['Ureotelism', 'Urea', 'Intermediate toxicity; moderate water (made in liver, excreted by kidneys)', 'Mammals, many terrestrial amphibians, marine fishes'],
        ['Uricotelism', 'Uric acid', 'Least toxic; needs the least water (pellet/paste)', 'Reptiles, birds, land snails, insects'],
      ],
    },
    // ── 6 · Heading — excretory structures across animals ────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Machinery: Excretory Structures Across the Animal Kingdom',
      objective: "By the end of this you can match each excretory structure — flame cells, nephridia, malpighian tubules, green glands, kidneys — to the animal group that has it, and say what job each one mainly does.",
    },
    // ── 7 · Text — the structures ────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "A survey of the animal kingdom shows a whole range of excretory structures. In **most invertebrates** they are simple **tubular forms**; **vertebrates** have complex tubular organs called **kidneys**. The ones NCERT names:\n\n- **Protonephridia**, also called **flame cells**, are the excretory structures of **Platyhelminthes** (flatworms, e.g. **Planaria**), **rotifers**, some **annelids**, and the cephalochordate **Amphioxus**. Their main job is **osmoregulation** — controlling the animal's ionic and fluid volume balance.\n- **Nephridia** are the tubular excretory structures of **earthworms** and other **annelids**. They both remove **nitrogenous wastes** and keep the **fluid and ionic balance** right.\n- **Malpighian tubules** are the excretory structures of **most insects**, including the **cockroach**. They handle **nitrogenous waste removal** and **osmoregulation**.\n- **Antennal glands**, also called **green glands**, do the excretory job in **crustaceans** like the **prawn**.\n\nTap through the diagram below to see each structure and the animal it belongs to.",
    },
    // ── 8 · Interactive image — excretory structures gallery ─────────────────
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'A four-panel scientific diagram of invertebrate excretory structures: a flame cell, an earthworm nephridium, insect malpighian tubules, and a crustacean green gland',
      caption: '📸 Tap each dot to explore the excretory structure and the animal group it belongs to.',
      generation_prompt: "Scientific textbook illustration: a clean four-panel gallery of invertebrate excretory structures, laid out in a 2x2 grid on a dark background (#0a0a0a near-black). Flat 2D educational diagram style, clean white outlines, biologically accurate proportions, no labels or text in the image itself. Top-left panel: a single protonephridium / flame cell — a bulb-shaped cell with an internal tuft of beating cilia (the 'flame') draining into a fine tubule. Top-right panel: a segment of an earthworm showing a coiled tubular nephridium with its ciliated funnel opening and external pore. Bottom-left panel: a cluster of thin thread-like malpighian tubules branching off an insect's gut. Bottom-right panel: a compact crustacean antennal (green) gland shown at the base of the antenna as a small saccular structure with a coiled tubule. Muted functional colours (pink/magenta for animal soft tissue, thin blue for tubule lumen/fluid), no photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.27, y: 0.28, label: 'Protonephridia (flame cells)', detail: 'Excretory structures of **Platyhelminthes** (flatworms, e.g. **Planaria**), **rotifers**, some annelids, and the cephalochordate **Amphioxus**. Mainly concerned with **osmoregulation** — ionic and fluid volume regulation.', icon: 'circle' },
        { id: uuid(), x: 0.74, y: 0.28, label: 'Nephridia', detail: 'The tubular excretory structures of **earthworms** and other **annelids**. They **remove nitrogenous wastes** and maintain the **fluid and ionic balance**.', icon: 'circle' },
        { id: uuid(), x: 0.27, y: 0.72, label: 'Malpighian tubules', detail: 'The excretory structures of **most insects**, including the **cockroach**. They help in the **removal of nitrogenous wastes** and in **osmoregulation**.', icon: 'circle' },
        { id: uuid(), x: 0.74, y: 0.72, label: 'Antennal (green) glands', detail: 'Perform the excretory function in **crustaceans** like the **prawn**. (Vertebrates, by contrast, have complex tubular organs called **kidneys**.)', icon: 'circle' },
      ],
    },
    // ── 9 · Table — structures to animal group ───────────────────────────────
    {
      id: uuid(), type: 'table', order: 9,
      caption: 'Every excretory structure NCERT names, matched to the animal group that has it',
      headers: ['Excretory structure', 'Animal group'],
      rows: [
        ['Protonephridia / flame cells', 'Platyhelminthes (e.g. Planaria), rotifers, some annelids, Amphioxus'],
        ['Nephridia', 'Earthworms and other annelids'],
        ['Malpighian tubules', 'Most insects (e.g. cockroach)'],
        ['Antennal glands / green glands', 'Crustaceans (e.g. prawn)'],
        ['Kidneys', 'Vertebrates'],
      ],
    },
    // ── 10 · Reasoning prompt — match animal to strategy ─────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A student is told that one animal excretes its nitrogen as a dry pellet/paste, losing almost no water, while another lets its nitrogen diffuse straight out into the surrounding water. Which pairing correctly names the two strategies AND gives a valid example animal for each?",
      options: [
        "Dry pellet = uricotelism, e.g. a bird; diffuses into water = ammonotelism, e.g. a bony fish",
        "Dry pellet = ureotelism, e.g. a mammal; diffuses into water = ammonotelism, e.g. a bony fish",
        "Dry pellet = ammonotelism, e.g. a reptile; diffuses into water = uricotelism, e.g. an aquatic insect",
        "Dry pellet = uricotelism, e.g. a marine fish; diffuses into water = ureotelism, e.g. a frog on land",
      ],
      reveal: "The first option is right. Passing nitrogen out as a dry **pellet or paste** with minimum water loss is **uricotelism**, and NCERT lists **birds** (along with reptiles, land snails and insects) as uricotelic. Letting nitrogen leave by **diffusion into the surrounding water** — because ammonia is readily soluble — is **ammonotelism**, and a **bony fish** is exactly the example given. The tempting wrong choice is the second: it correctly calls the diffusing animal ammonotelic, but a dry-pellet excreter is **not** ureotelic — ureotelism produces **urea** (made in the liver, filtered by the kidneys), a form that still needs a moderate amount of water, not a near-dry paste.",
      difficulty_level: 2,
    },
    // ── 11 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Toxicity ladder (memorise the extremes):** **ammonia = most toxic, needs the MOST water**; **uric acid = least toxic, needs the LEAST water**; **urea = in between**.\n- **Ammonotelic** → ammonia → **many bony fishes, aquatic amphibians, aquatic insects**. Left out by **diffusion / gills**; **kidneys play no role**.\n- **Ureotelic** → urea → **mammals, many terrestrial amphibians, marine fishes**. Ammonia → urea in the **liver** → filtered by **kidneys**.\n- **Uricotelic** → uric acid (pellet/paste) → **reptiles, birds, land snails, insects**.\n- **Terrestrial life** pushed animals toward urea and uric acid to **conserve water**.\n- **Structures:** **flame cells / protonephridia** = flatworms (Planaria), rotifers, Amphioxus; **nephridia** = earthworms/annelids; **malpighian tubules** = insects (cockroach); **green glands** = crustaceans (prawn); **kidneys** = vertebrates.",
    },
    // ── 12 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**The most-tested single fact:** ammonia is the **most toxic** nitrogenous waste and needs the **most water**; uric acid is the **least toxic** and needs the **least**. NEET loves to flip these two on you.\n\n**Memorise each group's example animals as a list — that's how they're asked:** ammonotelic = bony fishes / aquatic amphibians / aquatic insects; ureotelic = mammals / many terrestrial amphibians / marine fishes; uricotelic = reptiles / birds / land snails / insects. Watch the traps: **marine fishes are ureotelic** (not ammonotelic like most bony fishes), and **insects appear in two lists** — aquatic insects are ammonotelic while most insects on land are uricotelic.\n\n**Classic NEET question:** \"Birds and reptiles excrete nitrogen as ___ and are therefore called ___.\" → **uric acid**, **uricotelic**. And its twin: \"The most toxic nitrogenous waste is ___.\" → **ammonia**.",
    },
    // ── 13 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "So the animal kingdom solves one problem — getting rid of toxic nitrogen — in three different ways, using everything from a single flame cell to a full pair of kidneys. Next, you'll step inside the vertebrate solution and open up the **human excretory system**, tracing it down to its working unit: the **nephron**.",
    },
    // ── 14 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which of the three major nitrogenous wastes is the most toxic and needs the largest amount of water to be eliminated?",
          options: [
            "Uric acid, because it is passed out as a dry pellet",
            "Urea, because it is made in the liver before being excreted",
            "Ammonia, because it is the most toxic form and requires a large amount of water for its elimination",
            "Carbon dioxide, because it dissolves easily in the blood",
          ],
          correct_index: 2,
          explanation: "NCERT states plainly that ammonia is the most toxic form and requires a large amount of water for elimination, while uric acid — the least toxic — needs the minimum water. Urea sits in between, not at the toxic extreme. Carbon dioxide is a metabolic waste but is not one of the three major nitrogenous wastes.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "In ammonotelic animals such as many bony fishes, how is ammonia mainly removed from the body?",
          options: [
            "It is converted to urea in the liver and then filtered out by the kidneys",
            "It diffuses out across body or gill surfaces as ammonium ions, with the kidneys playing no significant role",
            "It is stored as a dry uric-acid paste and released with minimal water loss",
            "It is actively pumped out only by malpighian tubules",
          ],
          correct_index: 1,
          explanation: "Because ammonia is readily soluble, ammonotelic animals let it leave by diffusion across body surfaces or gill surfaces as ammonium ions, and the kidneys do not play a significant role. Converting to urea in the liver is ureotelism; a dry uric-acid paste is uricotelism; malpighian tubules are insect structures, not the route for a fish.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which set correctly matches an excretory structure to the animal group that has it?",
          options: [
            "Nephridia — insects like the cockroach",
            "Malpighian tubules — earthworms and other annelids",
            "Protonephridia (flame cells) — Platyhelminthes such as Planaria",
            "Antennal (green) glands — flatworms and rotifers",
          ],
          correct_index: 2,
          explanation: "Protonephridia, or flame cells, are the excretory structures of Platyhelminthes such as Planaria (along with rotifers, some annelids and Amphioxus). The other options swap the pairs: nephridia belong to earthworms/annelids, malpighian tubules to insects like the cockroach, and green glands to crustaceans like the prawn.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Why did terrestrial (land) adaptation push many animals away from excreting ammonia and toward urea or uric acid?",
          options: [
            "Urea and uric acid are more toxic, which better protects a land animal's tissues",
            "Ammonia cannot be produced at all once an animal leaves the water",
            "Producing the less toxic wastes urea and uric acid lets land animals conserve water, which ammonia excretion wastes",
            "Land animals lack kidneys, so they must switch to uric acid instead",
          ],
          correct_index: 2,
          explanation: "NCERT ties the shift directly to water: terrestrial adaptation necessitated producing the lesser toxic wastes urea and uric acid for conservation of water, since ammonia excretion demands a large amount of water a land animal cannot spare. Urea and uric acid are less toxic, not more; ammonia is still produced by metabolism (ureotelic animals convert it in the liver); and land vertebrates like mammals do have kidneys.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
