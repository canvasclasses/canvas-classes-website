'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'protista-photosynthetic',
  title: 'Kingdom Protista I: Diatoms, Dinoflagellates & Euglenoids',
  subtitle: "Meet the first three protist groups — glass-walled diatoms that feed the oceans, the dinoflagellates behind red tides, and Euglena, a cell that photosynthesises by day and hunts by night.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['kingdom-protista', 'chrysophytes', 'dinoflagellates', 'euglenoids', 'biological-classification'],
  glossary: [
    { term: 'pellicle', definition: 'A protein-rich layer just under the surface of a euglenoid, in place of a rigid cell wall. It is firm enough to hold the cell together but flexible enough to let the body bend and change shape.' },
    { term: 'plankton', definition: 'Tiny organisms that cannot swim against a current and simply drift wherever the water carries them. Diatoms and many other chrysophytes live this way.' },
    { term: 'diatomaceous earth', definition: 'The gritty soil formed over billions of years from the indestructible silica cell walls of dead diatoms piling up. It is used in polishing and in filtering oils and syrups.' },
    { term: 'mixotrophic', definition: 'Able to feed in two ways — making food by photosynthesis when light is available, and eating other organisms when it is not. Euglenoids behave this way.' },
    { term: 'red tide', definition: 'A patch of sea turned red by a population explosion of red dinoflagellates. Toxins released by their huge numbers can kill fish and other marine animals.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dusk seascape where the shallow water glows faintly red near the shore, with tiny drifting shapes suspended in the sunlit upper layer',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A calm ocean seen at dusk from just above the waterline, the surface stretching to a warm horizon. In the shallow water toward one side the sea glows a soft, eerie red, as if stained from within. Suspended in the sunlit upper layer of the water, barely visible, are countless minute drifting shapes — faint suggestions of single-celled life floating passively rather than swimming — never the focal subject, just a quiet sense that the water itself is crowded with living things. Deep dusk lighting, a single warm glow low on the horizon tying the scene together. Painterly, atmospheric illustration style, dark background tones throughout (#0a0a0a base), no text, no labels, no diagram elements.",
    },
    // ── fun_fact ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Soil Made Entirely of Glass Skeletons',
      markdown: "Some soils are made of crushed rock. One is made almost entirely of dead cells. Diatoms build their walls out of **silica** — the same stuff glass is made of — and that wall simply does not rot away when the organism dies. Over **billions of years** these glassy walls have piled up into thick deposits called **‘diatomaceous earth’**. It's so fine and gritty that we dig it up and use it for polishing, and for filtering oils and syrups. Every scoop of it is a graveyard of microscopic glass boxes.",
    },
    // ── Protista intro ───────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Kingdom **Protista** holds all the **single-celled eukaryotes** — but its edges are genuinely blurry. NCERT puts it bluntly: what is *‘a photosynthetic protistan’* to one biologist may be *‘a plant’* to another. The boundaries of this kingdom are simply not well defined. In this book, Protista includes five groups: **Chrysophytes, Dinoflagellates, Euglenoids, Slime moulds and Protozoans**. Almost all of them are **aquatic** — they live in water.\n\nThink of Protista as the middle landing on a staircase: it forms a **link** between the other kingdoms dealing with plants, animals and fungi. Because its members are eukaryotes, each protist cell carries a **well-defined nucleus** and other **membrane-bound organelles** — the same internal machinery you'd find in a plant or animal cell. Some move using **flagella** or **cilia**. They **reproduce both asexually and sexually**, and the sexual route involves two cells fusing to form a zygote.\n\nThis page covers the first three groups — the photosynthetic ones.",
    },
    // ── Chrysophytes ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Chrysophytes — the Glass-Walled Diatoms',
      objective: "By the end of this you'll know why a diatom's wall lasts forever, and why NEET calls diatoms the ocean's chief producers.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Chrysophytes** are a group that includes the **diatoms** and the **golden algae (desmids)**. They turn up in both **fresh water and the sea**. Every one of them is **microscopic**, and instead of swimming they **float passively** in the water currents — which makes them **plankton**. **Most are photosynthetic**, quietly making their own food from sunlight as they drift.\n\nThe diatom's signature is its wall. It's built from **two thin overlapping shells that fit together like a soap box** — one half sits inside the other, exactly like a box and its lid. Those walls are **embedded with silica**, and silica doesn't break down, so the walls are effectively **indestructible**. When the organism dies, the wall stays behind. Over billions of years these leftover walls pile up into the **‘diatomaceous earth’** from the fun fact above.\n\nOne line here is worth underlining: **diatoms are the chief ‘producers’ in the oceans**. A producer is an organism that makes food that everything else ultimately feeds on — so these drifting specks quietly sit at the base of the entire ocean food chain.",
    },
    {
      id: uuid(), type: 'image', order: 5, src: '', alt: 'A diatom cell wall shown as two silica shells fitting together like a soap box',
      caption: '📸 A diatom wall — two overlapping silica shells that fit like a box and its lid', width: 'full', aspect_ratio: '16:9',
      generation_prompt: "Scientific textbook illustration of a single diatom cell wall. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Show the wall as two thin shells — a larger bottom half and a slightly smaller top half — drawn slightly separated and offset so the viewer clearly sees they overlap and fit together like a soap box with its lid. Clean white outlines, fine geometric surface texture etched into each shell to suggest silica (rows of tiny pores in a symmetrical pattern). A subtle cool glassy sheen on the shells to read as silica/glass. Labels in white text with thin white leader lines: 'upper shell', 'lower shell', 'silica wall'. Biologically accurate radial symmetry, no photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
    },
    // ── Dinoflagellates ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Dinoflagellates — the Cells Behind Red Tides',
      objective: "By the end of this you'll be able to describe a dinoflagellate's armour and its two flagella, and explain how it turns the sea red.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "**Dinoflagellates** are **mostly marine and photosynthetic**. Their colour is a giveaway: they appear **yellow, green, brown, blue or red**, depending on which **pigments** dominate inside the cell. On the outside they wear armour — the cell wall carries **stiff cellulose plates** locked over the surface.\n\nMovement comes from **two flagella**. One lies **longitudinally** (running along the body) and the other **transversely**, sitting in a **furrow** (a groove) between the wall plates. Together they spin the cell as it moves — a detail NEET likes to test.\n\nNow the dramatic part. Sometimes the **red dinoflagellates** — the classic example is **Gonyaulax** — multiply so fast that their sheer numbers turn the sea red. This is a **red tide**. It isn't harmless: the **toxins** released by such enormous populations can **kill other marine animals, such as fish**.",
    },
    // ── mid-page reasoning check ─────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "A geologist drills into an ancient seabed and pulls up a thick layer of fine, gritty, glass-like powder — no soft tissue, no bones, just this silica-rich grit stretching down for metres. Which protist group most likely left this deposit behind, and why did only their remains survive?",
      options: [
        "Dinoflagellates — their stiff cellulose plates pile up and harden into rock over time",
        "Diatoms — their cell walls are embedded with silica, so the walls are indestructible and accumulate as diatomaceous earth long after the cell dies",
        "Euglenoids — their protein-rich pellicle hardens into a permanent grit once the organism dries out",
        "Slime moulds — their spores fossilise into a fine silica powder",
      ],
      reveal: "It's diatoms. Their walls are embedded with silica, which does not break down, so the walls survive intact for billions of years and build up as ‘diatomaceous earth’ — a fine, gritty, glassy soil. Dinoflagellates are the tempting wrong pick because they also have a tough wall, but theirs is made of cellulose plates, not silica, and cellulose rots away. A euglenoid's pellicle is protein, not mineral, so it decays too. Only a mineral wall like silica leaves a lasting deposit.",
      difficulty_level: 2,
    },
    // ── Euglenoids ───────────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Euglenoids — Plant by Day, Predator by Night',
      objective: "By the end of this you'll understand why Euglena has no cell wall, and how one cell can be both a plant and a hunter.",
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "**Euglenoids** are **mostly fresh-water** organisms, and you find them in **stagnant water** — still ponds and puddles. Here's their odd feature: they have **no cell wall at all**. In its place sits a **protein-rich layer called the pellicle**, and because it's protein rather than rigid mineral, it **makes the body flexible** — the cell can bend and change shape as it moves. They carry **two flagella, a short one and a long one**.\n\nThe famous trick is how they feed. In **sunlight they are photosynthetic**, making their own food like a plant. But when they are **deprived of sunlight, they behave like heterotrophs** — they turn **predator** and eat other, smaller organisms. One cell, two completely different ways of living, switched by whether the light is on. And here's the tidy detail NCERT points out: the **pigments of euglenoids are identical to those found in higher plants**. The textbook example of a euglenoid is **Euglena**.\n\nNext we meet the two protist groups that don't photosynthesise at all — the **slime moulds** and the **protozoans**.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 11, src: '',
      alt: 'A labelled Euglena cell showing the pellicle, its long and short flagella, eyespot, chloroplasts and nucleus',
      caption: '📸 Tap each dot to explore the parts of a Euglena cell',
      generation_prompt: "Scientific textbook illustration of a single Euglena cell. Flat 2D educational diagram on a dark background (#0a0a0a near-black). An elongated, spindle-shaped cell with one rounded end and one tapered end, drawn with clean white outlines. At the rounded front end, a small pocket (reservoir) from which two flagella emerge — one clearly long trailing forward, one very short. Near the base of the long flagellum, a small red-orange eyespot (stigma). The outer boundary drawn as a firm but slightly wavy flexible surface layer (the pellicle) with faint fine striations running lengthwise to suggest flexibility. Several oval green chloroplasts distributed through the body (green = photosynthetic). A single well-defined nucleus toward the rear, drawn as a pale circle with a smaller dot inside. Biologically accurate proportions, no baked-in text labels, no photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.5, label: 'Pellicle', icon: 'circle',
          detail: 'The protein-rich layer just under the surface, in place of a cell wall. Because it is flexible, the whole body can bend and change shape as the cell moves.' },
        { id: uuid(), x: 0.18, y: 0.2, label: 'Long flagellum', icon: 'circle',
          detail: 'One of two flagella. The long one drives the cell through the water; there is also a much shorter second flagellum at the same front pocket.' },
        { id: uuid(), x: 0.3, y: 0.34, label: 'Eyespot (stigma)', icon: 'circle',
          detail: 'A small red-orange spot near the base of the long flagellum. It detects light, which matters for an organism that photosynthesises when sunlight is available.' },
        { id: uuid(), x: 0.55, y: 0.62, label: 'Chloroplast', icon: 'circle',
          detail: 'The green photosynthetic organelle. Its pigments are identical to those found in higher plants — this is what lets Euglena make its own food in sunlight.' },
        { id: uuid(), x: 0.74, y: 0.6, label: 'Nucleus', icon: 'circle',
          detail: 'The well-defined nucleus. Being a eukaryote, Euglena keeps its genetic material inside a proper membrane-bound nucleus, unlike the bacteria of Kingdom Monera.' },
      ],
    },
    // ── remember ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember', title: "Three Facts You Cannot Swap Around",
      markdown: "- **Diatom walls are made of silica → indestructible → they pile up as diatomaceous earth.** (Not cellulose — that's the dinoflagellates.)\n- **Euglena is a mixotroph with a pellicle, not a cell wall.** Photosynthetic in light, predatory (heterotroph) in the dark. Its pigments match those of higher plants.\n- **Gonyaulax is the red dinoflagellate that causes red tides**, and the toxins from its huge numbers can kill fish.",
    },
    // ── exam_tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Diatomaceous earth:** the fact that silica walls are indestructible and accumulate into diatomaceous earth (used in polishing and filtering oils/syrups) is a near-guaranteed lift.\n\n**Diatoms = chief producers of the oceans:** NCERT states this in exactly those words — memorise it.\n\n**Euglenoid = pellicle + mixotrophy:** two traps in one. The covering is a protein-rich **pellicle**, NOT a cell wall; and Euglena is **both** photosynthetic and heterotrophic depending on light.\n\n**Dinoflagellate = cellulose plates + two flagella:** stiff **cellulose** plates on the surface (not silica), and **two flagella** — one longitudinal, one transverse in a furrow.\n\n**Classic NEET question:** \"Which protist group has cell walls made of silica?\" → Diatoms (chrysophytes). Don't confuse this with the dinoflagellates' cellulose plates.",
    },
    // ── inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: "The cell wall of a diatom is best described as:",
          options: [
            'Stiff cellulose plates locked over the surface',
            'Two thin overlapping shells embedded with silica, fitting like a soap box',
            'A protein-rich pellicle that makes the body flexible',
            'A single thick layer of peptidoglycan',
          ],
          correct_index: 1,
          explanation: "A diatom's wall is two overlapping silica shells that fit together like a soap box — which is why it's indestructible and forms diatomaceous earth. Stiff cellulose plates belong to dinoflagellates; the flexible protein pellicle belongs to euglenoids; peptidoglycan is a bacterial (Monera) wall, not a protist one.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "A single-celled organism in a pond makes its own food while the sun is up, but starts eating smaller organisms once it's moved into the dark. It has no cell wall. Which group does it belong to?",
          options: [
            'Chrysophytes',
            'Dinoflagellates',
            'Euglenoids',
            'Slime moulds',
          ],
          correct_index: 2,
          explanation: "Switching between photosynthesis in light and predation in the dark (mixotrophy), plus having a pellicle instead of a cell wall, is the euglenoid signature — e.g. Euglena. Chrysophytes and dinoflagellates are photosynthetic but do have walls and aren't described as switching to predation; slime moulds aren't photosynthetic at all.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "Which statement about dinoflagellates is correct?",
          options: [
            'They are mostly fresh-water and lack any cell wall',
            'They are mostly marine, have stiff cellulose plates, and Gonyaulax can cause red tides',
            'Their silica walls accumulate as diatomaceous earth',
            'They are the chief producers of the oceans',
          ],
          correct_index: 1,
          explanation: "Dinoflagellates are mostly marine, carry stiff cellulose plates, and the red dinoflagellate Gonyaulax multiplies to cause toxic red tides. Being fresh-water with no wall describes euglenoids; silica walls and diatomaceous earth describe diatoms; and it's the diatoms — not dinoflagellates — that NCERT calls the chief producers of the oceans.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "NCERT calls diatoms the chief ‘producers’ in the oceans. What does calling them 'producers' mean?",
          options: [
            "They reproduce faster than any other marine organism",
            'They make food by photosynthesis that other marine life ultimately depends on',
            'They produce the silica that forms the ocean floor',
            'They produce the toxins responsible for red tides',
          ],
          correct_index: 1,
          explanation: "A 'producer' makes food (here, by photosynthesis) that sits at the base of the food chain for everything else. Diatoms drift as plankton making their own food, feeding the ocean's food web. Fast reproduction, silica deposits, and red-tide toxins are all real facts about protists, but none of them is what 'producer' means.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
