'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-leaf-venation-and-phyllotaxy',
  title: 'The Leaf, Venation, and Phyllotaxy',
  subtitle: "Every leaf marks a spot where the plant could grow a whole new branch — and one small test involving that hidden bud is how you tell a genuine compound leaf from a twig carrying several separate simple ones.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['morphology-of-flowering-plants', 'leaf'],
  glossary: [
    { term: 'axillary bud', definition: 'The bud present in the axil of a leaf — the angle between the leaf and the stem. It later develops into a branch.' },
    { term: 'stipule', definition: 'One of two small, lateral, leaf-like structures borne at the leaf base where the leaf attaches to the stem.' },
    { term: 'pulvinus', definition: 'A swollen leaf base, seen in some leguminous plants.' },
    { term: 'venation', definition: 'The arrangement of veins and veinlets within the lamina of a leaf — either reticulate (a network, generally dicots) or parallel (running parallel, most monocots).' },
    { term: 'rachis', definition: 'The common axis on which leaflets are borne in a pinnately compound leaf, such as neem; it represents the midrib of the leaf.' },
    { term: 'phyllotaxy', definition: 'The pattern of arrangement of leaves on a stem or branch — alternate, opposite, or whorled.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'Different leafy branches fluttering in a dusk breeze — single alternating leaves, a compound leaf, and a pair of opposite leaves',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A dusk garden scene viewed close to the ground, several different kinds of leafy branches gently fluttering in a light breeze: on the left a slender stem with single leaves alternating up its length, in the centre a branch bearing one large compound leaf with many small leaflets on a common stalk, and on the right a plant with broad leaves growing in pairs directly opposite each other. Soft warm dusk light glows through the translucent leaf blades, showing faint vein patterns without any labels or diagram elements. Painterly, atmospheric illustration style, dark naturalistic background throughout (#0a0a0a base tones), no text, no labels.",
    },
    // ── fun_fact ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Leaf That Cools Itself By Shaking',
      markdown: "A leaf's petiole isn't just a handle holding the blade up — when it's **long, thin and flexible**, it lets the whole blade **flutter in the wind**. That flutter does real work: it **cools the leaf** and **brings fresh air to the leaf surface**, without the plant spending a single unit of energy to move it. Next time you see a leaf shivering in a breeze, that isn't the wind pushing it around for no reason — it's the plant's own built-in cooling system.",
    },
    // ── what is a leaf ───────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "A leaf is a **lateral, generally flattened structure** — it grows out sideways from the stem, and it is usually flat rather than round. It develops at the **node**, the exact point on the stem where a leaf attaches, and every leaf **bears a bud in its axil** — the small angle between the leaf and the stem above it. That bud is the **axillary bud**, and it later **develops into a branch**. So every leaf you see marks a spot where the plant could grow a whole new branch.\n\nLeaves originate from the **shoot apical meristem**, the growing tip of the stem, and they appear in **acropetal order** — the oldest leaves nearest the base of the shoot, the youngest nearest the growing tip. Leaves are the **most important vegetative organs for photosynthesis**: this is the organ built specifically to catch light and make food for the rest of the plant.",
    },
    // ── heading: parts of a leaf ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Parts of a Leaf',
      objective: "By the end of this you can name and place all three parts of a leaf — leaf base, petiole and lamina — and explain what a stipule, a sheath and a pulvinus each are.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "A typical leaf has three main parts: the **leaf base**, the **petiole**, and the **lamina**.\n\nThe **leaf base** is where the leaf attaches to the stem, and it may bear **two lateral, small leaf-like structures called stipules**. In **monocotyledons**, the leaf base does something different — it **expands into a sheath that covers the stem**, partially or wholly. And in **some leguminous plants**, the leaf base becomes **swollen**; that swelling is called the **pulvinus**.\n\nThe **petiole** is the stalk, and its job is to **hold the blade up to the light**. When the petiole is **long, thin and flexible**, it lets the leaf blade flutter in the wind, which cools the leaf and brings fresh air to its surface.\n\nThe **lamina**, or leaf blade, is the **green, expanded part of the leaf**, carrying the **veins and veinlets**. There is usually one prominent central vein — the **midrib**. The veins **give the lamina rigidity** and act as **channels that transport water, minerals and food materials**. The shape, margin, apex, surface and how deeply the lamina is incised all vary from leaf to leaf.",
    },
    // ── interactive image: parts of a leaf ───────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A labelled dicot leaf attached to a stem, showing the leaf base, stipules, axillary bud, petiole, lamina and midrib',
      caption: '📸 Tap each dot to explore the parts of a leaf (Figure 5.4a)',
      generation_prompt: "Scientific textbook illustration of the parts of a leaf. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A single dicot leaf shown attached to a short piece of stem: the stem running vertically on the right side, with a leaf base at the point of attachment, two small lateral stipules flanking the leaf base, a small axillary bud tucked into the angle between the leaf base and the stem above it, a petiole extending up and to the left from the leaf base, and a broad green lamina (leaf blade) at the far end of the petiole with a single prominent midrib running through its centre and finer veins branching off it. Clean white outlines, biologically accurate proportions, no baked-in text labels (labels are added as interactive hotspots), functional colours: green for the lamina and midrib, pale tan for the stem and petiole. No photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.15, y: 0.18, label: 'Lamina', icon: 'circle',
          detail: 'The green, expanded part of the leaf, carrying the veins and veinlets — this is where the leaf photosynthesises.' },
        { id: uuid(), x: 0.25, y: 0.3, label: 'Midrib', icon: 'circle',
          detail: 'The single prominent vein running down the middle of the lamina. Veins, including the midrib, give the leaf blade rigidity and act as channels transporting water, minerals and food materials.' },
        { id: uuid(), x: 0.42, y: 0.5, label: 'Petiole', icon: 'circle',
          detail: 'The stalk that holds the lamina up to the light. A long, thin, flexible petiole lets the blade flutter in the wind, cooling the leaf and bringing fresh air to its surface.' },
        { id: uuid(), x: 0.58, y: 0.66, label: 'Stipule', icon: 'circle',
          detail: 'One of two small, lateral, leaf-like structures borne at the leaf base where the leaf attaches to the stem.' },
        { id: uuid(), x: 0.63, y: 0.76, label: 'Leaf base', icon: 'circle',
          detail: 'Attaches the leaf to the stem. In monocots it expands into a sheath covering the stem partially or wholly; in some leguminous plants it becomes swollen — the pulvinus.' },
        { id: uuid(), x: 0.74, y: 0.66, label: 'Axillary bud', icon: 'circle',
          detail: 'Sits in the axil of the leaf, the angle between the leaf and the stem. This bud later develops into a branch.' },
      ],
    },
    // ── heading: venation ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Venation',
      objective: "By the end of this you can tell reticulate venation from parallel venation on sight, and say which group of plants each one generally belongs to.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "The way the veins and veinlets are arranged inside the lamina is called **venation**. There are two patterns.\n\nWhen the veinlets **form a network**, the pattern is called **reticulate venation** — this is generally what you see in **dicotyledonous** plants. When the veins instead **run parallel to each other** within the lamina, the pattern is called **parallel venation** — the characteristic of **most monocotyledons**.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 8, title: 'Reticulate vs Parallel Venation',
      columns: [
        { heading: 'Reticulate Venation', points: [
          'Veinlets form a network within the lamina',
          'Generally seen in dicotyledonous plants',
          'Figure 5.4(b) in NCERT',
        ] },
        { heading: 'Parallel Venation', points: [
          'Veins run parallel to each other within the lamina',
          'Characteristic of most monocotyledons',
          'Figure 5.4(c) in NCERT',
        ] },
      ],
    },
    // ── heading: simple vs compound leaves ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Simple vs Compound Leaves',
      objective: "By the end of this you can tell a simple leaf from a compound leaf using the one test NCERT gives you, and separate pinnately compound from palmately compound leaves by their examples.",
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "A leaf is called **simple** when its lamina is either **entire** (unbroken) or, if it does have incisions, those incisions **don't reach the midrib**. A leaf is called **compound** when the incisions **do reach the midrib**, cutting the lamina into a number of separate **leaflets**.\n\nHere is the exact test NCERT gives you to tell them apart: a **bud is present in the axil of the petiole in both simple and compound leaves** — but it is **never present in the axil of a leaflet of a compound leaf**. Find a bud only where the whole leaf structure meets the stem, and nowhere at the base of the individual blades, and you know you're looking at one compound leaf, not several separate simple leaves.\n\nCompound leaves come in **two types**. In a **pinnately compound** leaf, a number of leaflets sit on a **common axis called the rachis**, which represents the midrib of the leaf — **neem** is the example. In a **palmately compound** leaf, the leaflets are instead attached **at a common point**, at the **tip of the petiole** — **silk cotton** is the example.",
    },
    // ── mid-page reasoning check ─────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 11, reasoning_type: 'logical',
      prompt: "A branch has several small blade-like structures attached along a central stalk, and each individual blade looks like it could be its own leaf. NCERT gives one definitive test to decide whether this is a single pinnately compound leaf or a twig bearing several separate simple leaves. What is that test?",
      options: [
        "Check whether the venation in each blade is reticulate or parallel — reticulate blades belong to one compound leaf",
        "Look for an axillary bud: it should be present only where the whole structure meets the main stem, and absent at the base of each individual blade",
        "Count how many blades are present — five or more blades on one axis always means a compound leaf",
        "Check whether the central stalk is woody or green — a woody axis always means separate simple leaves",
      ],
      correct_index: 1,
      reveal: "NCERT is explicit: a bud is present in the axil of the petiole in both simple and compound leaves, but never in the axil of a leaflet of a compound leaf. So if you find a bud only where the whole leaf-like structure meets the main stem — and no bud tucked at the base of each individual blade — you are looking at one pinnately compound leaf, with the blades being its leaflets on a rachis, not several separate simple leaves. Venation only tells you dicot vs monocot, not simple vs compound, and NCERT gives no rule based on counting blades or the woodiness of the axis — those are invented shortcuts, not the real test.",
      difficulty_level: 3,
    },
    // ── heading: phyllotaxy ────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 12, level: 2,
      text: 'Phyllotaxy',
      objective: "By the end of this you can name the three patterns a leaf can take on a stem, and match each to the exact plant NCERT uses as its example.",
    },
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "**Phyllotaxy** is the pattern in which leaves are arranged on a stem or branch. NCERT gives three types.\n\nIn **alternate** phyllotaxy, a **single leaf arises at each node**, alternating from side to side — seen in **china rose, mustard and sunflower**. In **opposite** phyllotaxy, a **pair of leaves arises at each node**, lying **opposite each other** — seen in **Calotropis and guava**. And in **whorled** phyllotaxy, **more than two leaves arise at a node** and form a **whorl** — seen in **Alstonia**.\n\nLeaves tell you how a plant arranges its light-catching surface. The next page moves up the plant to where it arranges its flowers instead — the inflorescence.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 14, title: 'Three Types of Phyllotaxy',
      columns: [
        { heading: 'Alternate', points: [
          'A single leaf arises at each node, alternating from side to side',
          'Example: china rose, mustard, sunflower',
        ] },
        { heading: 'Opposite', points: [
          'A pair of leaves arises at each node, lying opposite each other',
          'Example: Calotropis, guava',
        ] },
        { heading: 'Whorled', points: [
          'More than two leaves arise at a node and form a whorl',
          'Example: Alstonia',
        ] },
      ],
    },
    // ── remember ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 15, variant: 'remember', title: 'The Facts You Cannot Swap Around',
      markdown: "- **Leaf parts:** leaf base, petiole, lamina. Stipules sit at the leaf base; a monocot leaf base becomes a **sheath**; a swollen legume leaf base is the **pulvinus**.\n- **The bud rule:** a bud sits in the axil of the petiole in *both* simple and compound leaves — **never in the axil of a leaflet**.\n- **Venation:** reticulate (network) → dicots. Parallel (parallel veins) → most monocots.\n- **Compound leaf types:** pinnately compound = leaflets on a **rachis** (*neem*). Palmately compound = leaflets meet at **one point at the petiole tip** (*silk cotton*).\n- **Phyllotaxy:** alternate (china rose, mustard, sunflower), opposite (Calotropis, guava), whorled (Alstonia).",
    },
    // ── exam_tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 16, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**The axillary-bud test:** a bud sits in the axil of the petiole in both simple and compound leaves — but never in the axil of a leaflet. This is the single most useful diagnostic fact on this page: it is how you tell a genuine compound leaf from a twig carrying several separate simple leaves.\n\n**Reticulate = dicot, parallel = monocot — read it as a pattern, not a rule:** NCERT itself says dicots *generally* have reticulate venation and parallel venation is the characteristic of *most* monocotyledons. Use it as your first guess on a diagram question, not an absolute law — the wording leaves room for exceptions.\n\n**Pinnately vs palmately, locked to their examples:** neem = pinnately compound (leaflets on a rachis); silk cotton = palmately compound (leaflets meet at one point at the petiole tip). NEET loves swapping these two examples as a trap.\n\n**Classic NEET question:** \"Is a bud present in the axil of each leaflet of a compound leaf?\" → No — the axillary bud is only at the petiole's axil, never at a leaflet's axil; that absence is exactly what proves the structure is one compound leaf, not several simple ones.",
    },
    // ── inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 17, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which statement correctly describes a leaf according to NCERT?',
          options: [
            'A leaf is a lateral, generally flattened structure that develops at a node, bears a bud in its axil, and originates from the shoot apical meristem',
            'A leaf is a lateral structure that develops only at the root tip and never bears any bud',
            'A leaf develops directly from the root apical meristem and is arranged in a basipetal order',
            "A leaf's axillary bud always develops into a new root, not a branch",
          ],
          correct_index: 0,
          explanation: "NCERT describes a leaf as lateral, generally flattened, developing at a node, bearing a bud (the axillary bud) in its axil, and originating from the shoot apical meristem in acropetal order. Leaves don't develop at the root tip or from the root apical meristem, and the axillary bud develops into a branch — not a root.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'In some leguminous plants, the leaf base becomes swollen. What is this swollen leaf base called, and what happens to the leaf base in monocotyledons?',
          options: [
            'It is called the rachis; in monocots the leaf base becomes the midrib',
            'It is called the pulvinus; in monocots the leaf base expands into a sheath that covers the stem',
            'It is called the stipule; in monocots the leaf base becomes the lamina',
            'It is called the petiole; in monocots the leaf base disappears entirely',
          ],
          correct_index: 1,
          explanation: "NCERT names the swollen leaf base of some leguminous plants the pulvinus, and states that in monocotyledons the leaf base expands into a sheath covering the stem partially or wholly. The rachis is the axis of a pinnately compound leaf, stipules are the small lateral structures at the leaf base, and the petiole is the stalk holding the lamina — none of these is the swollen-leaf-base term.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'In a pinnately compound leaf such as neem, how are the leaflets arranged?',
          options: [
            'At a common point at the tip of the petiole, as in silk cotton',
            'Alternately at each node along the main stem',
            'On a common axis, the rachis, which represents the midrib of the leaf',
            'Only in the axil of the petiole, never on an axis',
          ],
          correct_index: 2,
          explanation: "In a pinnately compound leaf, the leaflets sit on a common axis called the rachis, which represents the midrib of the leaf — neem is NCERT's example. Leaflets attached at a common point at the petiole's tip describes a palmately compound leaf (silk cotton), not a pinnately compound one; phyllotaxy is about how whole leaves are arranged on a stem, not how leaflets sit within one compound leaf; and the axil of the petiole is where the axillary bud sits, not where leaflets are attached.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'China rose, mustard and sunflower all show a single leaf arising at each node in an alternating pattern. Which of these correctly names this type of phyllotaxy AND correctly matches another type to its example?',
          options: [
            'Alternate phyllotaxy; and in Calotropis and guava a pair of leaves arise at each node, opposite each other (opposite phyllotaxy)',
            'Whorled phyllotaxy; and in Alstonia a single leaf arises at each node',
            'Opposite phyllotaxy; and in china rose more than two leaves arise at a node, forming a whorl',
            'Alternate phyllotaxy; and in Alstonia a pair of leaves arise at each node, opposite each other',
          ],
          correct_index: 0,
          explanation: "China rose, mustard and sunflower are NCERT's own examples of alternate phyllotaxy — one leaf per node, alternating sides. Calotropis and guava are the correctly matched example for opposite phyllotaxy, where a pair of leaves arise at each node and lie opposite each other. The other options misassign the labels: Alstonia is NCERT's example of whorled phyllotaxy (more than two leaves per node), not alternate or opposite — swapping which pattern gets which example is the exact trap NEET tests for.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
