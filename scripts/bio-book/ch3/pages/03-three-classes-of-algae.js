'use strict';
const { v4: uuid } = require('uuid');

const figureHotspots = [
  {
    id: uuid(), x: 0.12, y: 0.30, label: 'Volvox (green alga)', icon: 'circle',
    detail: "A **Chlorophyceae** member — a hollow, rolling colony of many cells. Grass-green from **chlorophyll a and b** held in definite chloroplasts. Food is stored as starch (with protein-rich **pyrenoids**).",
  },
  {
    id: uuid(), x: 0.24, y: 0.66, label: 'Ulothrix (green alga)', icon: 'circle',
    detail: "Another green alga — a simple unbranched filament. Its rigid wall is an **inner layer of cellulose** and an **outer layer of pectose**. Asexual reproduction is by flagellated zoospores.",
  },
  {
    id: uuid(), x: 0.50, y: 0.22, label: 'Frond (Laminaria)', icon: 'circle',
    detail: "The flat, leaf-like photosynthetic organ of a brown alga. **Phaeophyceae** bodies are divided into three parts — holdfast, stipe and frond.",
  },
  {
    id: uuid(), x: 0.50, y: 0.55, label: 'Stipe', icon: 'circle',
    detail: "The stalk of the brown alga, connecting the frond above to the holdfast below. Brown colour comes from the xanthophyll pigment **fucoxanthin**.",
  },
  {
    id: uuid(), x: 0.50, y: 0.86, label: 'Holdfast', icon: 'circle',
    detail: "The root-like base that anchors the brown alga to the rock or sea floor. Food here is stored as **laminarin or mannitol**, and the wall carries a gelatinous **algin** coating.",
  },
  {
    id: uuid(), x: 0.84, y: 0.42, label: 'Porphyra (red alga)', icon: 'circle',
    detail: "A **Rhodophyceae** member — red because of the pigment **r-phycoerythrin**. Multicellular, mostly marine, and stores food as **floridean starch**. Its spores and gametes are non-motile (no flagella).",
  },
];

module.exports = {
  slug: 'three-classes-of-algae',
  title: 'Algae II: Green, Brown & Red',
  subtitle: "Three classes of algae, sorted by one idea — colour. Learn which pigment, stored food and cell wall belongs to each, and Table 3.1 stops being a maze.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['algae', 'chlorophyceae', 'phaeophyceae', 'rhodophyceae', 'plant-kingdom'],
  glossary: [
    { term: 'pyrenoid', definition: 'A storage body inside the chloroplast of green algae that holds protein along with starch.' },
    { term: 'fucoxanthin', definition: 'The brown xanthophyll pigment in brown algae; the more of it present, the browner the alga looks.' },
    { term: 'phycoerythrin', definition: 'The red pigment (r-phycoerythrin) whose dominance gives red algae their colour.' },
    { term: 'floridean starch', definition: 'The stored food of red algae, similar in structure to amylopectin and glycogen.' },
    { term: 'holdfast', definition: 'The root-like base that attaches a brown alga to the surface it grows on.' },
    { term: 'stipe', definition: 'The stalk of a brown alga, between the holdfast and the frond.' },
    { term: 'frond', definition: 'The leaf-like, photosynthetic organ of a brown alga.' },
    { term: 'laminarin', definition: 'A complex carbohydrate stored as food by brown algae (along with mannitol).' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dusk underwater scene showing green algae in the shallows, brown kelp in the mid-water, and red algae in the dark depths',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous underwater cross-section at dusk, read from left to right and top to bottom as increasing depth: bright shallow water on the upper-left with grass-green filamentous algae and a small round green colony drifting near the surface; sinking into cooler mid-water dominated by tall olive-brown kelp fronds swaying on long stalks anchored to rock; and finally the deep, dim right side where faint red-tinged algae cling to rock in near-darkness, only a little light filtering down from far above. A single soft warm shaft of light falls from the top of the frame through the water. Deep, moody, painterly illustration style, dark naturalistic background throughout (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Algae That Live Where Sunlight Barely Reaches',
      markdown: "Most photosynthetic life crowds near the surface, where the light is. Red algae break that rule. They grow both in the bright water near the top **and at great depths in the ocean where relatively little light penetrates** — deeper than almost any other alga can manage. Their red pigment, r-phycoerythrin, is the trick: it grabs the faint blue-green light that survives all the way down there, so the plant can keep making food in what looks, to us, like near-darkness.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Algae get split into three classes, and the sorting idea is refreshingly simple — **colour**. Green algae (**Chlorophyceae**), brown algae (**Phaeophyceae**), and red algae (**Rhodophyceae**). But the colour is only the label on the outside. Underneath it, each class has its own signature set of three things: which **pigments** it carries, what **stored food** it makes, and what its **cell wall** is built from. Get those three straight for each class and you've got the whole topic — because that is exactly the grid NCERT lays out in Table 3.1, and exactly what NEET lifts questions from.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Chlorophyceae — The Green Algae',
      objective: "By the end you'll know the green-algae signature: chlorophyll a + b, pyrenoids, and a two-layer wall.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Members of Chlorophyceae are the **green algae**. The body may be unicellular, colonial, or filamentous, and they look **grass-green** because two pigments dominate — **chlorophyll a and chlorophyll b** — both held inside definite chloroplasts (the chloroplast shape varies by species: discoid, plate-like, cup-shaped, spiral, ribbon-shaped and more).\n\nInside those chloroplasts, most green algae carry one or more storage bodies called **pyrenoids**. A pyrenoid holds **protein along with starch** — so the classic green-algae stored food is **starch**. Some green algae also stash food as oil droplets. The cell wall is rigid and built in two layers: an **inner layer of cellulose** and an **outer layer of pectose**.\n\nReproduction runs three ways. **Vegetative** reproduction is usually by fragmentation. **Asexual** reproduction is by **flagellated zoospores** produced in zoosporangia. **Sexual** reproduction varies — it may be **isogamous, anisogamous, or oogamous**. Common green algae to remember: **Chlamydomonas, Volvox, Ulothrix, Spirogyra, and Chara**.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Phaeophyceae — The Brown Algae',
      objective: "By the end you'll know the brown-algae signature: fucoxanthin, laminarin/mannitol, algin, and the holdfast–stipe–frond body.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Members of Phaeophyceae are the **brown algae**, found **mainly in marine (salt-water) habitats**. They range from simple branched filaments (**Ectocarpus**) all the way to the giant **kelps**, which can reach a height of **100 metres**. Their pigments are **chlorophyll a, chlorophyll c, carotenoids, and xanthophylls** — and their colour, from olive-green to deep brown, depends on how much of one xanthophyll, **fucoxanthin**, is present. More fucoxanthin, browner alga.\n\nFood is stored as complex carbohydrates — **laminarin or mannitol**. The wall is **cellulose** on the inside, usually covered on the outside by a gelatinous coating of **algin**. The plant body is the most organised of the three classes: it is attached to the surface by a **holdfast**, rises into a stalk called the **stipe**, and bears a leaf-like photosynthetic organ, the **frond**.\n\nVegetative reproduction is by fragmentation. **Asexual** reproduction, in most brown algae, is by **biflagellate zoospores** that are **pear-shaped and carry two unequal flagella attached laterally** (on the side). **Sexual** reproduction may again be **isogamous, anisogamous, or oogamous**. Common brown algae: **Ectocarpus, Dictyota, Laminaria, Sargassum, and Fucus**.",
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Rhodophyceae — The Red Algae',
      objective: "By the end you'll know the red-algae signature: r-phycoerythrin, floridean starch, and non-motile spores/gametes.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Members of Rhodophyceae are the **red algae**, red because of the dominance of the pigment **r-phycoerythrin**. The majority are **marine**, with the greatest numbers in **warmer areas**, and they occur both near the well-lit surface and at **great depths where little light reaches**. Most red algae are **multicellular**, and some have a genuinely complex body.\n\nFood is stored as **floridean starch**, a carbohydrate very similar in structure to amylopectin and glycogen. Reproduction: **vegetatively** by fragmentation; **asexually** by **non-motile spores**; and **sexually** by **non-motile gametes**. Sexual reproduction is **oogamous** and is followed by complex post-fertilisation developments. Notice the running theme — nothing here has flagella; red algae are the class where motile stages are simply **absent**. Common red algae: **Polysiphonia, Porphyra, Gracilaria, and Gelidium**.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "You're handed an unknown alga. Its body is clearly divided into a holdfast at the base, a stalk, and a broad leaf-like blade. It's olive-brown, and lab tests show it stores food as laminarin. Which class is it, and why?",
      options: [
        "Chlorophyceae — fucoxanthin is a green-algal pigment, and the leaf-like blade is a green-algae feature",
        "Phaeophyceae — the holdfast–stipe–frond body, the brown tint from fucoxanthin, and laminarin as stored food all point to brown algae",
        "Rhodophyceae — the brown colour actually comes from r-phycoerythrin, which fades to brown at depth",
        "Chlorophyceae — laminarin is simply another name for the starch that green algae store in pyrenoids",
      ],
      reveal: "Three clues stack up and all say brown algae (Phaeophyceae): the holdfast–stipe–frond body is the signature Phaeophyceae plan, the olive-brown colour comes from fucoxanthin, and laminarin (with mannitol) is the brown-algae stored food. The green-algae options fail because green algae store **starch** in pyrenoids — not laminarin — and don't have that three-part body. The red-algae option fails because red algae are coloured by r-phycoerythrin and store **floridean starch**, not laminarin.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'table', order: 10,
      caption: 'Table 3.1 — Divisions of Algae and Their Main Characteristics',
      headers: ['Class', 'Common Name', 'Major Pigments', 'Stored Food', 'Cell Wall', 'Flagella (number & position)', 'Habitat'],
      rows: [
        ['Chlorophyceae', 'Green algae', 'Chlorophyll a, b', 'Starch', 'Cellulose', '2–8, equal, apical', 'Fresh water, brackish water, salt water'],
        ['Phaeophyceae', 'Brown algae', 'Chlorophyll a, c, fucoxanthin', 'Mannitol, laminarin', 'Cellulose and algin', '2, unequal, lateral', 'Fresh water (rare), brackish water, salt water'],
        ['Rhodophyceae', 'Red algae', 'Chlorophyll a, d, phycoerythrin', 'Floridean starch', 'Cellulose, pectin and poly sulphate esters', 'Absent', 'Fresh water (some), brackish water, salt water (most)'],
      ],
    },
    {
      id: uuid(), type: 'interactive_image', order: 11, src: '',
      alt: 'A gallery of three algae side by side — a green alga, a brown kelp, and a red alga',
      caption: '📸 Tap each dot to explore Figure 3.1 — a green, a brown, and a red alga side by side',
      hotspots: figureHotspots,
      generation_prompt: "Scientific textbook illustration of three representative algae shown side by side as a labelled gallery (Figure 3.1 a, b, c). Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines, biologically accurate proportions. On the LEFT (a), two green algae rendered in grass-green: a small hollow spherical colony (Volvox) drifting above, and a simple unbranched green filament (Ulothrix) below. In the CENTRE (b), a single large brown alga (Laminaria kelp) in olive-brown tones, clearly showing three parts stacked vertically — a broad flat leaf-like blade (frond) at the top, a narrower stalk (stipe) in the middle, and a small branching root-like anchor (holdfast) gripping a rock at the base. On the RIGHT (c), a delicate, finely branched red alga (Porphyra) in deep red-magenta tones. Each specimen separated by clear dark space. No text or labels baked into the image itself. No photorealism, no cartoon, no mascots; matches standard biology textbook illustration conventions.",
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember', title: 'One Line Per Class — Memorise These',
      markdown: "- **Green (Chlorophyceae):** chlorophyll **a + b** → stores **starch** in **pyrenoids** → wall = **cellulose + pectose**.\n- **Brown (Phaeophyceae):** brown from **fucoxanthin** → stores **laminarin / mannitol** → wall = **cellulose + algin** → body = **holdfast + stipe + frond**.\n- **Red (Rhodophyceae):** red from **r-phycoerythrin** → stores **floridean starch** → spores & gametes **non-motile (no flagella)**, sexual reproduction **oogamous**.",
    },
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Fucoxanthin:** brown algae (Phaeophyceae). **Phycoerythrin:** red algae (Rhodophyceae). **Floridean starch:** red algae. Fix these three anchors and half the match-the-column questions solve themselves.\n\n**Table 3.1 is a match-column goldmine.** NEET repeatedly pairs pigment↔class, stored food↔class, and example genus↔class. Learn the row, not just the colour: *Laminaria/Fucus* = brown, *Porphyra/Polysiphonia/Gelidium/Gracilaria* = red, *Volvox/Ulothrix/Spirogyra/Chara* = green.\n\n**Classic NEET question:** \"Floridean starch is the stored food of which algal class?\" → **Rhodophyceae (red algae).** Don't confuse it with green algae's starch — the word *floridean* is the giveaway for red.",
    },
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "That's algae fully sorted — three classes, three signatures. But algae still live in or beside water; none of them have truly moved onto dry land. Next you'll meet the first plants that did make that leap — the **bryophytes**, the mosses and liverworts of moist, shaded hillsides.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'The brown colour of Phaeophyceae, ranging from olive-green to deep brown, is due to which pigment?',
          options: ['Fucoxanthin', 'r-Phycoerythrin', 'Chlorophyll b', 'Floridean starch'],
          correct_index: 0,
          explanation: "The xanthophyll fucoxanthin gives brown algae their colour — the more of it present, the browner the alga. r-Phycoerythrin is the red pigment of red algae; chlorophyll b is a green-algae pigment; and floridean starch isn't a pigment at all — it's the stored food of red algae.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'A red alga such as Porphyra reproduces sexually in which way?',
          options: [
            'By non-motile gametes, and the process is oogamous',
            'By biflagellate, pear-shaped zoospores',
            'By flagellated gametes in an isogamous fusion',
            'Only by fragmentation of the thallus',
          ],
          correct_index: 0,
          explanation: "Red algae reproduce sexually by non-motile gametes and the process is oogamous (followed by complex post-fertilisation development). Biflagellate pear-shaped zoospores describe the asexual stage of brown algae; flagellated/isogamous fusion belongs to green and brown algae; and fragmentation is vegetative, not sexual. Red algae have no flagellated stages at all.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'A plant body clearly differentiated into a holdfast, a stipe, and a frond is characteristic of which class?',
          options: ['Phaeophyceae (brown algae)', 'Rhodophyceae (red algae)', 'Chlorophyceae (green algae)', 'All three classes equally'],
          correct_index: 0,
          explanation: "The holdfast–stipe–frond body plan is the hallmark of brown algae (Phaeophyceae), seen in kelps like Laminaria. Red and green algae are not organised this way, so it isn't shared across all three classes — this three-part body is a Phaeophyceae signature NEET loves to test.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: 'Pyrenoids, storage bodies that contain protein besides starch, are located in the chloroplasts of which algae?',
          options: [
            'Chlorophyceae (green algae)',
            'Phaeophyceae (brown algae)',
            'Rhodophyceae (red algae)',
            'Red algae, inside their floridean starch grains',
          ],
          correct_index: 0,
          explanation: "Pyrenoids sit in the definite chloroplasts of green algae and hold protein along with starch. Brown algae store laminarin/mannitol and red algae store floridean starch — neither uses pyrenoids, so the option tying pyrenoids to red algae's floridean starch is the trap.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
