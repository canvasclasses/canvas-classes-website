'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'kingdom-fungi-features',
  title: 'Kingdom Fungi I: The Fungal Body & How It Reproduces',
  subtitle: "The mould on your bread, the mushroom on your plate, and the yeast in your dough are all one kingdom. Here's how a fungus is built, how it eats without a mouth, and the three-step trick behind how it breeds.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['kingdom-fungi', 'hyphae', 'mycelium', 'fungal-reproduction', 'biological-classification'],
  glossary: [
    { term: 'hypha', definition: 'A single long, slender, thread-like filament that makes up the body of most fungi. (Plural: hyphae.)' },
    { term: 'mycelium', definition: 'The whole network of hyphae that forms the body of a fungus.' },
    { term: 'coenocytic', definition: 'A hypha that is a continuous tube with no cross-walls, so its cytoplasm holds many nuclei together.' },
    { term: 'septate', definition: 'A hypha divided by cross-walls (septae) into separate compartments.' },
    { term: 'saprophyte', definition: 'An organism that feeds by absorbing soluble organic matter from dead and decaying substrates.' },
    { term: 'mycorrhiza', definition: 'A symbiotic association between a fungus and the roots of a higher plant.' },
    { term: 'plasmogamy', definition: 'The first step of the fungal sexual cycle — the fusion of the protoplasms of two gametes.' },
    { term: 'karyogamy', definition: 'The second step of the fungal sexual cycle — the fusion of the two nuclei brought together by plasmogamy.' },
    { term: 'dikaryon', definition: 'A cell carrying two separate nuclei (n + n) that have not yet fused; the intervening stage seen in ascomycetes and basidiomycetes.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark, damp forest floor at dusk with mushrooms, mould on a fallen log and faint threads spreading through the soil',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A damp, shadowy forest floor at dusk: a cluster of pale mushrooms and toadstools rising from dark leaf litter on the left, a fallen log furred with soft mould and bracket fungi in the centre, and a fine web of faint pale threads spreading through the dark soil beneath, barely visible, suggesting a hidden network. Warm, humid, misty atmosphere with a single soft amber glow low on the horizon. Painterly, atmospheric illustration style, dark naturalistic background throughout (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Why the Fridge Exists',
      markdown: "Leave a slice of bread out for a few days in a warm room and it turns fuzzy and green. Leave a fruit too long and a soft, cottony patch spreads across it. That fuzz is a **fungus** growing. Fungi are everywhere — in air, water, soil, and on the bodies of plants and animals — and they grow fastest in **warm, humid** places. That single fact is the reason we keep food in the refrigerator: the cold slows the fungal (and bacterial) growth that would otherwise spoil it.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The fungi make up a unique kingdom of **heterotrophic** organisms — they cannot make their own food. What holds this kingdom together is not one shape or one habitat, because fungi show enormous variety in both. You have already met them without thinking of them as one family: the **mould on moist bread and rotten fruit**, the **common mushroom** you eat and the **toadstools** beside it, the **white spots on mustard leaves** (caused by a parasitic fungus), the **yeast** used to make bread and beer, the wheat-rust-causing **Puccinia** that damages crops, and **Penicillium**, the source of an antibiotic.\n\nSo fungi can feed you, ferment your dough, ruin a harvest, or cure an infection — all within the same kingdom. They are **cosmopolitan**, meaning they occur just about everywhere on Earth. What ties them together is how their bodies are built, how they feed, and how they reproduce — the three things this page walks through.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Body: Hyphae & Mycelium',
      objective: "By the end of this you can tell a coenocytic hypha from a septate one at a glance, and name what a fungal wall is made of.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "With one exception, every fungus is built the same way. That exception is the **yeasts**, which are **unicellular** — single cells. Every other fungus is **filamentous**: its body is made of long, slender, thread-like structures called **hyphae** (singular: hypha). A single hypha on its own is just one thread; the whole tangled **network of hyphae** together is called the **mycelium** — that is the real body of the fungus.\n\nLook closely at a hypha and you find one of two designs. Some hyphae are **continuous tubes filled with multinucleated cytoplasm**, with no internal walls breaking them up — these are **coenocytic** hyphae. Others have **septae**, or **cross walls**, dividing the thread into compartments — these are **septate** hyphae. Whichever the design, the wall on the outside is the same: fungal cell walls are made of **chitin and polysaccharides** (chitin is the same tough material found in an insect's shell — not the cellulose of plant walls).",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A labelled diagram contrasting a coenocytic hypha and a septate hypha within a mycelium, with the chitin wall marked',
      caption: '📸 Tap each dot to explore how a fungal body is built',
      generation_prompt: "Scientific textbook illustration of fungal body structure. Flat 2D educational diagram on a dark background (#0a0a0a near-black). On the left, a dense branching network of fine pale thread-like filaments spreading outward — this is the mycelium. On the right, two individual thread magnified side by side for comparison: the upper thread is one continuous open tube with many small nuclei (small dots) scattered freely along it and NO internal cross-lines — a coenocytic hypha; the lower thread is divided into a row of separate boxes by evenly spaced vertical cross-lines, with one or two nuclei per box — a septate hypha. A short call-out on one thread points to its outer boundary layer to mark the chitin cell wall. Clean white outlines, thin white leader lines, brown/tan colouring for the fungal threads to signal non-photosynthetic tissue, nuclei as small pale dots. No text or labels baked into the image itself. No photorealism, no cartoon, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.62, y: 0.30, label: 'Hypha', icon: 'circle',
          detail: 'A single long, slender, thread-like filament. It is the basic building unit of the fungal body.' },
        { id: uuid(), x: 0.22, y: 0.50, label: 'Mycelium', icon: 'circle',
          detail: 'The whole network of hyphae woven together. This tangle *is* the body of a filamentous fungus.' },
        { id: uuid(), x: 0.68, y: 0.28, label: 'Coenocytic hypha', icon: 'circle',
          detail: 'A continuous tube with **no cross-walls**, so its cytoplasm is **multinucleate** — many nuclei sharing one open space.' },
        { id: uuid(), x: 0.68, y: 0.70, label: 'Septate hypha', icon: 'circle',
          detail: 'A hypha broken up by **septae (cross walls)** into separate compartments.' },
        { id: uuid(), x: 0.86, y: 0.70, label: 'Chitin cell wall', icon: 'circle',
          detail: 'The outer wall of every fungus is made of **chitin and polysaccharides** — not the cellulose of plants.' },
      ],
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'How Fungi Feed',
      objective: "By the end of this you can sort any fungus into saprophyte, parasite, or symbiont — and name the two famous partnerships.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "A fungus has no mouth and no gut. It feeds by **absorbing** soluble organic matter straight through its walls, and **most fungi are heterotrophic** — they must take their food ready-made from somewhere else. Where they take it from splits them into three lifestyles.\n\n- **Saprophytes** absorb their food from **dead** substrates — the mould breaking down old bread is doing exactly this.\n- **Parasites** take their food from **living** plants and animals, harming the host in the process — the fungus behind the white spots on a mustard leaf lives this way.\n- **Symbionts** live in a mutually helpful **association** with another organism. Two of these partnerships are named and worth memorising: a fungus paired with an **alga** forms a **lichen**, and a fungus paired with the **roots of a higher plant** forms a **mycorrhiza**.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "You examine a hypha under the microscope and see one long open tube with several nuclei floating in a single shared stretch of cytoplasm, and no walls dividing it up. How would you correctly describe this hypha?",
      options: [
        "Septate, because the many nuclei prove the thread must be divided into compartments",
        "Coenocytic, because it is a continuous tube with no cross-walls and multinucleate cytoplasm",
        "Unicellular, because a single continuous tube counts as just one cell like a yeast",
        "Parasitic, because only parasitic fungi have more than one nucleus in a hypha",
      ],
      correct_index: 1,
      reveal: "The two clues that matter are 'no cross-walls' and 'many nuclei in one shared space' — that is the exact definition of a **coenocytic** hypha. A septate hypha would show cross-walls (septae) chopping the thread into compartments, which is the opposite of what you see, so option one gets it backwards. The number of nuclei has nothing to do with how the fungus feeds, so 'parasitic' is a distractor, and a coenocytic tube is still part of a multicellular filamentous body — it isn't a single free cell like a yeast.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'How Fungi Reproduce',
      objective: "By the end of this you can list the three modes of reproduction and recite the three-step sexual cycle in the right order.",
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "Fungi reproduce in three ways. **Vegetative** reproduction happens by **fragmentation, fission, and budding** — a piece simply breaks off, splits, or buds and grows on its own. **Asexual** reproduction is by **spores** called **conidia, sporangiospores, or zoospores**. **Sexual** reproduction is by spores called **oospores, ascospores, and basidiospores**, which are produced inside distinct structures called **fruiting bodies**.\n\nThe sexual cycle always runs through the same **three steps**, in this order:\n\n1. **Plasmogamy** — the fusion of the **protoplasms** of two gametes.\n2. **Karyogamy** — the fusion of the two **nuclei** that plasmogamy brought together.\n3. **Meiosis** in the zygote — the reduction division that produces **haploid spores**.\n\nIn many fungi the two nuclei fuse right after plasmogamy and the cell becomes diploid (2n) at once. But in **ascomycetes and basidiomycetes**, plasmogamy and karyogamy don't happen together — there is a gap. During that gap the cell carries **two separate nuclei (n + n)**, a condition called a **dikaryon**, and the phase is the **dikaryophase**. Only later do those parental nuclei fuse to become diploid. The shape of the mycelium, the way spores form, and the fruiting bodies are exactly the features biologists use to split this kingdom into its four classes — which is where we go next.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember', title: 'Lock These In',
      markdown: "- **Coenocytic** = continuous tube, **no septae**, **multinucleate** cytoplasm. **Septate** = divided by cross-walls.\n- Fungal cell walls are made of **chitin** and polysaccharides — never cellulose.\n- The sexual cycle order never changes: **plasmogamy → karyogamy → meiosis** (protoplasms fuse → nuclei fuse → haploid spores).\n- A **dikaryon** is **n + n** (two nuclei, not yet fused) and occurs **only** in ascomycetes and basidiomycetes.\n- Symbiont partnerships: fungus + **alga = lichen**; fungus + **plant roots = mycorrhiza**.",
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Cell wall:** NEET repeatedly asks what the fungal cell wall is made of — the answer is **chitin and polysaccharides**. Any option saying cellulose is the plant trap.\n\n**Coenocytic vs septate:** Expect a line drawing or a description; 'no cross-walls + multinucleate' is coenocytic, 'cross-walls present' is septate.\n\n**The three sexual steps:** Learn them as an ordered sequence — **plasmogamy, karyogamy, meiosis**. Questions love scrambling the order or swapping the definitions of plasmogamy (protoplasms) and karyogamy (nuclei).\n\n**Dikaryon:** The (n + n) dikaryotic stage appears **only in ascomycetes and basidiomycetes** — not in every fungus.\n\n**Classic NEET question:** \"The association of a fungus with the roots of a higher plant is called ___\" → **mycorrhiza** (a fungus with an alga is a lichen).",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'The cell wall of a fungus is composed mainly of:',
          options: ['Cellulose and pectin', 'Chitin and polysaccharides', 'Peptidoglycan', 'Lignin and suberin'],
          correct_index: 1,
          explanation: "Fungal walls are made of chitin and polysaccharides. Cellulose and pectin build plant walls, peptidoglycan builds bacterial (Monera) walls, and lignin/suberin are woody plant materials — all classic swapped-wall distractors.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'A hypha that is a continuous tube with multinucleate cytoplasm and lacks cross-walls is described as:',
          options: ['Septate', 'Coenocytic', 'Unicellular', 'Dikaryotic'],
          correct_index: 1,
          explanation: "No cross-walls plus many nuclei in one shared cytoplasm defines a coenocytic hypha. A septate hypha would have cross-walls; 'unicellular' describes yeasts, not a hypha; and 'dikaryotic' refers to a cell with two unfused nuclei (n + n), which is a reproductive condition, not this body form.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which is the correct order of the three steps in the sexual cycle of a fungus?',
          options: [
            'Karyogamy → plasmogamy → meiosis',
            'Plasmogamy → meiosis → karyogamy',
            'Plasmogamy → karyogamy → meiosis',
            'Meiosis → plasmogamy → karyogamy',
          ],
          correct_index: 2,
          explanation: "First the protoplasms of two gametes fuse (plasmogamy), then the two nuclei fuse (karyogamy), and finally meiosis in the zygote gives haploid spores. Starting with karyogamy or meiosis reverses the biology — the nuclei cannot fuse before the protoplasms have even met.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'The intervening dikaryotic stage (n + n), where a cell carries two nuclei before they fuse, is a characteristic feature of:',
          options: [
            'All fungi without exception',
            'Ascomycetes and basidiomycetes',
            'Only the unicellular yeasts',
            'Fungi that live as saprophytes only',
          ],
          correct_index: 1,
          explanation: "NCERT states the dikaryophase occurs in ascomycetes and basidiomycetes, where plasmogamy and karyogamy are separated in time. In many other fungi the two haploid cells fuse to become diploid at once, so it is not a feature of all fungi; and the dikaryon is defined by reproduction, not by being unicellular or a saprophyte.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
