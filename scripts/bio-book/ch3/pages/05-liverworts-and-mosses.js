'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'liverworts-and-mosses',
  title: 'Liverworts & Mosses',
  subtitle: "The two bryophyte groups up close — a flat liverwort that clones itself from tiny cups, and a moss that grows in two stages and hoists a more elaborate spore capsule.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['bryophytes', 'liverworts', 'mosses', 'plant-kingdom'],
  glossary: [
    { term: 'thallus', definition: 'A flat, ribbon-like plant body that is not divided into a true root, stem or leaf. The liverwort Marchantia has a thalloid body.' },
    { term: 'gemma', definition: 'A green, multicellular asexual bud (plural: gemmae) that a liverwort produces; it detaches from the parent and grows into a new plant.' },
    { term: 'gemma cup', definition: 'A small cup-shaped receptacle on a liverwort thallus in which gemmae develop.' },
    { term: 'protonema', definition: 'The first stage of a moss gametophyte — a creeping, green, branched, often filamentous growth that develops directly from a spore.' },
    { term: 'seta', definition: 'The stalk of a bryophyte sporophyte, sitting between the foot below and the capsule above.' },
    { term: 'capsule', definition: 'The part of a bryophyte sporophyte in which spores are produced after meiosis.' },
    { term: 'dorsiventral', definition: 'Having a distinct upper and lower surface; the liverwort thallus is dorsiventral and lies flat, pressed against the substrate.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dark, damp streambank at dusk with flat green liverwort thalli pressed on wet rock and a cushion of upright mosses beside them',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet, shaded streambank at dusk, deep in wet woodland. On the left, flat ribbon-like green liverwort thalli lie pressed against a glistening wet rock beside slow-moving water; on the right, a soft dense cushion of small upright mossy plants rises from damp dark soil, their tiny leaves catching a faint amber light. Water trickles between them, moss-covered bark in the background. Everything looks moist, low-lit and still. Deep dusk lighting, one soft warm glow low on the horizon through the trees, dark naturalistic background (#0a0a0a base tones). Painterly, atmospheric, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Plant That Grows Copies of Itself in Tiny Cups',
      markdown: "Look closely at a flat liverwort like **Marchantia** and you'll spot little cup-shaped structures sitting on its surface. Each one is a nursery. Inside the cup grow small green buds called **gemmae** — and every gemma is a ready-made baby plant. When a gemma breaks off and lands on damp soil nearby, it simply grows into a whole new liverwort, identical to its parent. No sex, no seed, no spore. Just a plant quietly making copies of itself in tiny green cups.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "**Liverworts** grow in **moist, shady habitats** — the banks of streams, marshy ground, damp soil, the bark of trees, and deep inside the woods. The plant body of a liverwort is **thalloid**, meaning it's a flat, ribbon-like sheet rather than a plant with a real root, stem and leaf. The classic example is **Marchantia**. Its thallus is **dorsiventral** — it has a clear upper and lower side — and lies **closely appressed to the substrate**, pressed flat against whatever it's growing on. Some liverworts are leafy instead of flat: these **leafy members** carry tiny leaf-like appendages arranged in **two rows** on stem-like structures.\n\nLiverworts have two routes to make more of themselves. **Asexual reproduction** happens either by simple **fragmentation of the thalli** — a broken piece grows into a new plant — or by those specialised buds, the **gemmae** (singular: **gemma**). Gemmae are **green, multicellular, asexual buds** that develop inside small receptacles called **gemma cups** on the thalli; they detach from the parent and germinate to form new individuals. In **sexual reproduction**, the male and female sex organs are produced either on the **same thallus or on different thalli**. The resulting **sporophyte** is differentiated into three parts — a **foot, a seta and a capsule**. After **meiosis**, spores are produced inside the capsule, and these spores germinate to form new **free-living gametophytes**.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Mosses: A Two-Stage Gametophyte',
      objective: "By the end of this you can trace a moss from spore to protonema to leafy plant, and say exactly how its sporophyte outdoes a liverwort's.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "In a moss, the **gametophyte** is the dominant, longer-lasting stage of the life cycle — and it comes in **two stages**, one after the other.\n\nThe **first stage is the protonema**. It develops **directly from a spore** and grows as a **creeping, green, branched, and frequently filamentous** mat — think of a fine green thread-network spreading over damp soil. The **second stage is the leafy stage**, which grows from the secondary protonema as a **lateral bud**. These are the little upright moss plants you actually recognise: **upright, slender axes** bearing **spirally arranged leaves**, anchored to the soil by **multicellular, branched rhizoids**. This leafy stage is the one that **bears the sex organs**.\n\nMosses also reproduce vegetatively, by **fragmentation** and by **budding in the secondary protonema**. In **sexual reproduction**, the sex organs — **antheridia** (male) and **archegonia** (female) — are produced at the **apex of the leafy shoots**. After **fertilisation**, the zygote develops into a **sporophyte** made of a **foot, seta and capsule**. Here's the key difference: the **sporophyte in mosses is more elaborate than that in liverworts**. Its capsule holds the **spores**, formed after **meiosis**, and mosses have an **elaborate mechanism of spore dispersal**. Common examples are **Funaria, Polytrichum and Sphagnum**.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A Funaria moss plant showing the creeping protonema at the base, the upright leafy shoot, sex organs at its apex, and the sporophyte with a seta and capsule rising above',
      caption: '📸 Tap each dot to follow a moss from spore to spore capsule',
      generation_prompt: "Scientific textbook illustration of a Funaria moss plant (mirroring NCERT Figure 3.2). Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines, biologically accurate proportions, no labels baked in. At the BOTTOM-LEFT: a creeping, green, branched, thread-like filamentous protonema spreading over dark soil, with fine multicellular branched rhizoids. Rising from it, an upright slender green leafy shoot with small leaves arranged spirally around the stem-like axis (the leafy gametophyte). At the very TOP of the leafy shoot, a small cluster showing the sex organs (antheridia and archegonia) at the apex. Rising above the leafy shoot, a thin brown stalk (the seta) topped by an oval brown spore capsule at the very top. Green for the living photosynthetic gametophyte, brown/tan for the seta and capsule. No photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.20, y: 0.86, label: 'Protonema (from a spore)', icon: 'circle',
          detail: 'The **first gametophyte stage**, growing **directly from a spore**. It is **creeping, green, branched and frequently filamentous** — a fine thread-network over the soil. The leafy stage buds off from it.' },
        { id: uuid(), x: 0.33, y: 0.55, label: 'Leafy gametophyte', icon: 'circle',
          detail: 'The **second stage** — an **upright, slender axis** bearing **spirally arranged leaves**, attached to the soil by **multicellular, branched rhizoids**. This stage bears the sex organs.' },
        { id: uuid(), x: 0.38, y: 0.30, label: 'Antheridia & archegonia (apex)', icon: 'circle',
          detail: 'The sex organs — **antheridia** (male) and **archegonia** (female) — are produced at the **apex of the leafy shoots**. After fertilisation the zygote grows into the sporophyte.' },
        { id: uuid(), x: 0.63, y: 0.42, label: 'Seta', icon: 'circle',
          detail: 'The **stalk** of the sporophyte, between the foot below and the capsule above. The moss sporophyte (foot, seta, capsule) is **more elaborate than in liverworts**.' },
        { id: uuid(), x: 0.70, y: 0.14, label: 'Capsule (spores after meiosis)', icon: 'circle',
          detail: 'The **capsule contains the spores**, which are formed **after meiosis**. Mosses have an **elaborate mechanism of spore dispersal** to scatter them.' },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A moss spore lands on damp soil and germinates. According to NCERT, what grows first — before the upright, leafy little moss plant you recognise ever appears?",
      options: [
        'The leafy shoot with spirally arranged leaves appears straight away, directly from the spore',
        'A creeping, green, branched, often filamentous protonema, from which the leafy stage later buds off as a lateral bud',
        'A foot–seta–capsule sporophyte, which only later produces the gametophyte',
        'A flat, dorsiventral thallus pressed against the soil, exactly like a liverwort',
      ],
      reveal: "A moss spore first grows into the **protonema** — the creeping, green, branched, frequently filamentous first stage. Only afterwards does the familiar **leafy stage** develop from the secondary protonema as a **lateral bud**. The leafy shoot never springs straight from the spore. A foot–seta–capsule structure is the **sporophyte**, which forms only after fertilisation, not from a germinating spore. And a flat dorsiventral thallus is the **liverwort** body plan — that's a different bryophyte group, not a moss.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'comparison_card', order: 7, title: 'Liverworts vs Mosses',
      columns: [
        { heading: 'Liverworts', points: [
          'Plant body: thalloid (flat, dorsiventral, appressed to substrate), e.g. Marchantia; some leafy members with tiny appendages in two rows',
          'Special asexual structure: gemmae — green multicellular buds formed in gemma cups on the thalli',
          'Sporophyte: differentiated into foot, seta and capsule (simpler)',
          'Examples: Marchantia',
        ] },
        { heading: 'Mosses', points: [
          'Gametophyte in two stages: a creeping filamentous protonema, then an upright leafy shoot with spirally arranged leaves and rhizoids',
          'Special asexual/vegetative route: fragmentation and budding in the secondary protonema',
          'Sporophyte: foot, seta and capsule too, but MORE elaborate, with an elaborate spore-dispersal mechanism',
          'Examples: Funaria, Polytrichum, Sphagnum',
        ] },
      ],
    },
    {
      id: uuid(), type: 'callout', order: 8, variant: 'remember', title: 'Lock These Down',
      markdown: "- **Liverwort = thalloid + gemmae.** Flat, dorsiventral thallus (e.g. **Marchantia**), and its signature asexual buds are **gemmae**, made in **gemma cups**.\n- **Moss = protonema → leafy stage.** The gametophyte has **two stages**: the creeping **protonema** (straight from the spore), then the **leafy** shoot that carries the sex organs.\n- **Both** make a sporophyte of **foot + seta + capsule**, with spores formed **after meiosis** in the capsule — but the **moss sporophyte is more elaborate** than the liverwort's.\n- **Example organisms:** **Marchantia** is a liverwort; **Funaria, Polytrichum, Sphagnum** are mosses.",
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Gemma / gemma cup = liverwort:** if a question mentions **gemmae** or **gemma cups** as a means of asexual reproduction, the answer is **liverworts** — this is one of NCERT's favourite one-word give-aways.\n\n**Protonema = moss, first stage:** the **protonema** develops **directly from a spore** and belongs to **mosses**, not liverworts. The leafy stage comes second, as a lateral bud from the secondary protonema.\n\n**Sporophyte parts:** in **both** groups the sporophyte is **foot, seta and capsule**, with spores formed after **meiosis** in the capsule — but remember the moss sporophyte is **more elaborate**.\n\n**Match the example to the group:** **Marchantia → liverwort**; **Funaria / Polytrichum / Sphagnum → moss**. Mixing these up is a classic distractor.\n\n**Classic NEET question:** \"Gemma cups are found in ______.\" → *liverworts (e.g. Marchantia)*.",
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "Liverworts and mosses complete the bryophytes — the 'amphibians of the plant kingdom' that still need water to reproduce and never grow tall. Next we meet the **pteridophytes**, the first true land plants to evolve proper vascular tissue, which finally lets a plant stand upright and move water through its body.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'Gemmae, the green multicellular asexual buds that develop inside gemma cups, are a feature of which group?',
          options: ['Mosses', 'Liverworts', 'Pteridophytes', 'Gymnosperms'],
          correct_index: 1,
          explanation: "Gemmae formed in gemma cups on the thalli are the signature asexual structure of liverworts (such as Marchantia). Mosses instead reproduce vegetatively by fragmentation and budding in the secondary protonema; pteridophytes and gymnosperms are different, more advanced plant groups altogether.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'In the life cycle of a moss, which structure develops directly from a spore?',
          options: [
            'The leafy shoot with spirally arranged leaves',
            'The sporophyte, made of foot, seta and capsule',
            'The protonema — a creeping, green, branched, filamentous stage',
            'A flat, dorsiventral thallus',
          ],
          correct_index: 2,
          explanation: "A moss spore germinates first into the protonema, the creeping filamentous first stage of the gametophyte. The leafy shoot develops only afterwards, as a lateral bud from the secondary protonema. The sporophyte forms after fertilisation, not from a spore, and a dorsiventral thallus is the liverwort body plan.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Which statement correctly compares the sporophyte of a moss with that of a liverwort?',
          options: [
            "Both have only a capsule; neither has a foot or a seta",
            'Both are made of foot, seta and capsule, but the moss sporophyte is more elaborate',
            'The liverwort sporophyte is more elaborate than that of the moss',
            'The moss sporophyte lacks a capsule and so cannot form spores',
          ],
          correct_index: 1,
          explanation: "In both liverworts and mosses the sporophyte is differentiated into a foot, seta and capsule, with spores produced in the capsule after meiosis — but NCERT notes the moss sporophyte is more elaborate than the liverwort's. It is not the liverwort's that is more elaborate, and the moss capsule certainly still forms spores.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Funaria, Polytrichum and Sphagnum are common examples of which bryophyte group?',
          options: ['Liverworts', 'Mosses', 'Horsetails', 'Ferns'],
          correct_index: 1,
          explanation: "Funaria, Polytrichum and Sphagnum are all mosses. Marchantia is the liverwort example to pair against them. Horsetails and ferns are pteridophytes, a separate and more advanced group with true vascular tissue.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
