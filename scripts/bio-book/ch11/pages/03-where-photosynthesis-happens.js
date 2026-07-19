'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'where-photosynthesis-happens',
  title: 'Where Photosynthesis Happens — Inside the Chloroplast',
  subtitle: "Photosynthesis isn't one reaction in one place — it's split across two rooms of the chloroplast. Once you see which room traps the light and which room builds the sugar, the whole 'light reaction vs dark reaction' story clicks into place.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['photosynthesis-in-higher-plants', 'chloroplast'],
  glossary: [
    { term: 'mesophyll cell', definition: 'The main photosynthetic cells inside a leaf. They carry a large number of chloroplasts, so most of a leaf\'s photosynthesis happens here.' },
    { term: 'chloroplast', definition: 'The green organelle inside mesophyll cells where photosynthesis takes place. It holds a membrane system (grana + stroma lamellae) sitting in a fluid matrix (the stroma).' },
    { term: 'grana', definition: 'Stacks of flattened membranes (thylakoids) inside the chloroplast. This membrane system traps light energy and makes ATP and NADPH.' },
    { term: 'stroma lamellae', definition: 'Flat membrane sheets that connect one granum to another inside the chloroplast, part of the same membrane system as the grana.' },
    { term: 'stroma', definition: 'The fluid matrix filling the chloroplast around the grana. This is where enzymatic reactions build sugar (which then forms starch).' },
    { term: 'light reaction', definition: 'The reactions that are directly driven by light. They happen on the membrane system (grana) and produce ATP and NADPH. Also called photochemical reactions.' },
    { term: 'dark reaction', definition: 'The reactions that build sugar in the stroma. They are not directly driven by light but depend on the ATP and NADPH from the light reaction. Also called carbon reactions — the name "dark" does NOT mean they happen in darkness.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single green leaf backlit by soft light, with a faint suggestion of tiny green chloroplasts glowing within its cells',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single fresh green leaf held up against soft, warm backlight in an otherwise dim setting, its fine veins glowing translucent. Faint, softly glowing green points are suggested inside the leaf's surface, hinting at countless tiny chloroplasts packed within the living cells, without becoming a literal labelled diagram. Deep shadows fill the rest of the frame with subtle green and gold highlights along the leaf edge. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Chloroplasts Turn to Face the Light',
      markdown: "The chloroplasts inside a leaf are not scattered randomly. They line up along the walls of the cell and quietly rotate to catch the **optimum quantity of the incident light** — flat side toward a gentle glow, edge-on to a harsh midday sun so they don't get scorched. A single mesophyll cell is doing this with **a large number of chloroplasts** at once, all tilting to feed on light like a room full of tiny solar panels.",
    },
    // ── 2 · Core concept — where photosynthesis happens ──────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Ask anyone where photosynthesis happens and the quick answer is **the green leaf**. That's correct — but not the whole story. Photosynthesis takes place in the green leaves of plants, and it **also happens in other green parts of the plant**. Anything green has the machinery to do it; green stems and green parts of a plant can photosynthesise too.\n\nInside a leaf, the real work is done by the **mesophyll cells**. Each of these cells carries **a large number of chloroplasts**, and the chloroplasts arrange themselves along the walls of the cell so they get the **optimum quantity of the incident light**. This is why the leaf is the main site — it is packed with these light-catching cells.",
    },
    // ── 3 · Heading — the chloroplast ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Inside One Chloroplast',
      objective: "By the end of this you can name the three parts of the chloroplast's inner set-up — grana, stroma lamellae, and the matrix stroma — and point to where each one sits.",
    },
    // ── 4 · Text — membrane system + stroma ──────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Zoom into a single chloroplast and you find a **membranous system** floating in a fluid. That membrane system has two parts: the **grana** — stacks of flattened membrane discs — and the **stroma lamellae**, flat membrane sheets that connect one granum to the next. All of this membrane sits inside the **matrix stroma**, the thick fluid that fills the rest of the chloroplast.\n\nHold that picture: **membranes stacked into grana (with connecting lamellae), surrounded by the fluid stroma.** Those are the two neighbourhoods where the two halves of photosynthesis happen — and they don't do the same job.",
    },
    // ── 5 · Interactive image — chloroplast anatomy ──────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Cross-section diagram of a chloroplast showing outer and inner membranes, stacked grana, connecting stroma lamellae, the fluid stroma, and a starch granule',
      caption: '📸 Tap each dot to explore the parts of a chloroplast — and see which region runs the light reaction and which runs the dark reaction.',
      generation_prompt: "Scientific textbook illustration of a chloroplast in cross-section (electron-micrograph style, like NCERT Figure 11.2). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions. Show a lens/oval-shaped chloroplast with a smooth double boundary (outer membrane and inner membrane), several stacks of flattened green discs (grana) inside, thin flat green membrane sheets connecting the stacks (stroma lamellae), the surrounding fluid matrix (stroma) rendered as a pale translucent green fill, and one rounded pale starch granule within the stroma. Green for the photosynthetic membranes and grana, pale green for the stroma fluid, tan/off-white for the starch granule. Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.08, label: 'Outer membrane', detail: "The **outer boundary** of the chloroplast. It wraps the whole organelle and separates it from the rest of the mesophyll cell’s cytoplasm.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.18, label: 'Inner membrane', detail: "The **second boundary**, just inside the outer one. Together the two membranes form the chloroplast’s double envelope, enclosing everything within.", icon: 'circle' },
        { id: uuid(), x: 0.3, y: 0.55, label: 'Grana (thylakoid stacks)', detail: "Stacks of flattened membrane discs — the **membrane system**. **This is where the light reaction happens:** the grana trap light energy and make **ATP and NADPH**.", icon: 'circle' },
        { id: uuid(), x: 0.62, y: 0.42, label: 'Stroma lamellae', detail: "Flat membrane sheets that **connect one granum to another**. They are part of the same membrane system as the grana.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.72, label: 'Stroma (matrix)', detail: "The **fluid matrix** filling the chloroplast around the membranes. **This is where the dark reaction happens:** enzymes here use the ATP and NADPH to build **sugar**, which then forms **starch**.", icon: 'circle' },
        { id: uuid(), x: 0.4, y: 0.8, label: 'Starch granule', detail: "A store of **starch** sitting in the stroma — sugar made by the enzymatic (dark) reactions gets packed away here.", icon: 'circle' },
      ],
    },
    // ── 6 · Heading — division of labour ─────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Division of Labour — Two Rooms, Two Jobs',
      objective: "By the end of this you can say which reactions happen on the membranes and which happen in the stroma, and why the 'dark reaction' name is misleading.",
    },
    // ── 7 · Text — the split ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "There is a **clear division of labour** inside the chloroplast — the two neighbourhoods handle different steps.\n\nThe **membrane system (the grana / thylakoids)** does the first job: it **traps light energy** and uses it to make **ATP and NADPH**. Because these reactions are **directly driven by light**, they are called the **light reactions** — also written as **photochemical reactions**.\n\nThe **stroma** does the second job. Here, **enzymatic reactions synthesise sugar**, and that sugar in turn **forms starch**. These reactions are **not directly driven by light**. Instead, they run on the **products of the light reaction** — the **ATP and NADPH** made next door. To tell them apart from the light reactions, they are called, **by convention**, the **dark reactions** (or **carbon reactions**).",
    },
    // ── 8 · Text — the "dark" warning ────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Here is the trap in the name. **“Dark reaction” does not mean the reaction happens in darkness, and it does not mean the reaction is unaffected by light.** NCERT says this outright: this should not be taken to mean they occur in darkness or that they are not light-dependent. The name only signals **“not *directly* driven by light”** — the stroma reactions still depend completely on the ATP and NADPH that light produced. Cut off the light for long enough and the dark reaction runs out of fuel and stops too.",
    },
    // ── 9 · Comparison card — light vs dark ──────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Light Reaction vs Dark Reaction (location & what they do)',
      columns: [
        {
          heading: 'Light reaction (photochemical)',
          points: [
            'Location: on the thylakoid / grana membranes (the membrane system)',
            'Directly driven by light — yes',
            'Job: traps light energy',
            'Makes: ATP + NADPH (and releases O₂)',
          ],
        },
        {
          heading: 'Dark reaction (carbon reaction)',
          points: [
            'Location: in the stroma (the fluid matrix)',
            'Directly driven by light — no',
            'Job: uses ATP + NADPH to build sugar → starch',
            'Runs on the products of the light reaction — NOT in darkness',
          ],
        },
      ],
    },
    // ── 10 · Reasoning prompt — the misleading "dark" name ────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A student reads that the stroma reactions are called “dark reactions,” and concludes: “So these reactions must run at night, in the dark, without needing light at all.” According to NCERT, why is this conclusion wrong?",
      options: [
        "The dark reactions are not directly driven by light, but they depend on the ATP and NADPH made by the light reaction — so without light they run out of fuel; “dark” does not mean they happen in darkness.",
        "The dark reactions actually happen on the grana membranes, so they need the light that hits the grana directly.",
        "The dark reactions release oxygen, and oxygen can only be released while light is falling on the leaf.",
        "The dark reactions make ATP and NADPH themselves, so they are just a slower copy of the light reaction that works better at night.",
      ],
      reveal: "Option 1 is right. NCERT names the stroma reactions “dark reactions” only to distinguish them from the light reactions — they are not *directly* light-driven. But they are still light-dependent, because they run on the ATP and NADPH the light reaction supplies. The most tempting wrong answer is option 4: it sounds sophisticated, but it swaps the jobs — it is the light reaction (on the grana) that makes ATP and NADPH, while the dark reaction *uses* them to build sugar. Options 2 and 3 also misplace the reaction or the oxygen: the dark reaction happens in the stroma, and O₂ release belongs to the light reaction.",
      difficulty_level: 2,
    },
    // ── 11 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "- Photosynthesis happens in the **green leaves** and in **other green parts** of the plant. **Mesophyll cells** hold a large number of **chloroplasts** that line up along the cell walls for optimum light.\n- Inside a chloroplast: a **membrane system** made of **grana + stroma lamellae**, sitting in the **matrix stroma** (fluid).\n- **Light reaction** → on the **membranes (grana / thylakoids)** → traps light → makes **ATP + NADPH**. Directly light-driven.\n- **Dark reaction** → in the **stroma** → enzymes build **sugar → starch** → runs on the ATP + NADPH from the light reaction. NOT directly light-driven.\n- **“Dark” ≠ in darkness.** The name only means “not directly driven by light” — the stroma reactions are still light-dependent.",
    },
    // ── 12 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Location is a favourite one-mark trap.** Light reaction → **grana / thylakoid membranes**. Dark reaction → **stroma**. Swapping these two is the single most common mistake.\n\n**The “dark reaction” name is a deliberate NEET trick.** NCERT states plainly that “dark” does not mean the reaction occurs in darkness or is light-independent — examiners bait you with exactly that wrong idea.\n\n**Classic NEET question:** “The dark reactions of photosynthesis occur in the ______ .” → **stroma** (the matrix of the chloroplast) — not the grana, which run the directly-light-driven light reaction that makes ATP and NADPH.",
    },
    // ── 13 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "You now know the two rooms of the chloroplast and which half of photosynthesis runs in each. The membranes trap light — but what actually catches that light? Next, you'll meet the **pigments of photosynthesis**, the coloured molecules that absorb light and give the leaf its many shades of green.",
    },
    // ── 14 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "According to NCERT, where in the plant does photosynthesis take place?",
          options: [
            "Only in the green leaves, and nowhere else on the plant",
            "In the green leaves and also in other green parts of the plant",
            "Only in the roots, where water and minerals are taken up",
            "In every cell of the plant, green or not, since all cells respire",
          ],
          correct_index: 1,
          explanation: "NCERT says photosynthesis takes place in the green leaves but also in other green parts of the plant. Option 1 is too narrow — it forgets the other green parts. Roots (option 3) are not green and are not photosynthetic, and respiration (option 4) is a separate process from photosynthesis, which needs the green, chloroplast-bearing tissue.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Inside a mesophyll cell, why do the chloroplasts line up along the cell walls?",
          options: [
            "To stay as far as possible from the incident light and avoid damage",
            "To get the optimum quantity of the incident light",
            "To make room in the centre of the cell for the starch granules",
            "To connect directly to the plant's water-conducting tissue",
          ],
          correct_index: 1,
          explanation: "NCERT states the chloroplasts align along the walls of the mesophyll cells so they get the optimum quantity of the incident light. Option 1 reverses this — they position for good light, not away from it. Options 3 and 4 invent reasons NCERT never gives; starch is stored inside the chloroplast's stroma, and chloroplasts are not the tissue that conducts water.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which set of reactions happens on the membrane system (grana), and what does it produce?",
          options: [
            "The dark reactions, which produce sugar and then starch",
            "The light reactions, which trap light energy and produce ATP and NADPH",
            "The light reactions, which produce sugar directly from carbon dioxide",
            "The dark reactions, which trap light energy and produce ATP and NADPH",
          ],
          correct_index: 1,
          explanation: "The membrane system (grana) runs the light reactions — they trap light energy and make ATP and NADPH. Option 1 places the sugar-building dark reactions on the membranes, but those happen in the stroma. Option 3 keeps the right name but the wrong product (sugar is built by the dark reaction, not directly here). Option 4 attaches the dark-reaction name to the light reaction's job.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The reactions in the stroma are called “dark reactions.” What does this name actually mean?",
          options: [
            "They occur only at night, when there is no light falling on the leaf",
            "They are completely independent of light and never need it",
            "They are not directly driven by light, but they depend on the ATP and NADPH made by the light reaction",
            "They happen in a dark, pigment-free part of the chloroplast that light cannot reach",
          ],
          correct_index: 2,
          explanation: "NCERT is explicit: the dark reactions are called that only because they are not directly light-driven — but they depend on the products of the light reaction (ATP and NADPH), so they are still light-dependent. Options 1 and 2 fall for the exact wrong idea NCERT warns against (“this should not be construed to mean they occur in darkness or that they are not light-dependent”). Option 4 invents a light-proof compartment that doesn't exist.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
