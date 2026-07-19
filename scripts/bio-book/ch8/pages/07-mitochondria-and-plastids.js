'use strict';
/**
 * Class 11 Biology — Chapter 8 (Cell: The Unit of Life)
 * Page 7 — "Mitochondria and Plastids"
 *
 * Faithful to the 2023-rationalised NCERT text (kebo108.pdf §8.5.4 "Mitochondria"
 * through §8.5.5 "Plastids", stopping before §8.5.6 "Ribosomes").
 * Rule 0: every fact traces to the supplied NCERT text — no outside additions.
 *
 * Exports a single page object. Does NOT touch the database — the orchestrator
 * validates and inserts.
 */
const { v4: uuid } = require('uuid');

const mitoHotspots = [
  {
    id: uuid(), x: 0.14, y: 0.30, label: 'Outer membrane', icon: 'circle',
    detail: 'The **continuous limiting boundary** of the mitochondrion. It forms the smooth outer edge of the organelle.',
  },
  {
    id: uuid(), x: 0.24, y: 0.40, label: 'Inner membrane', icon: 'circle',
    detail: 'Sits just inside the outer membrane, but folds inward repeatedly toward the matrix — those folds are the **cristae**.',
  },
  {
    id: uuid(), x: 0.19, y: 0.50, label: 'Inter-membrane space (outer compartment)', icon: 'circle',
    detail: 'The thin aqueous compartment between the outer and inner membrane — the **outer compartment** created when the two membranes divide the lumen in two.',
  },
  {
    id: uuid(), x: 0.52, y: 0.55, label: 'Matrix (inner compartment)', icon: 'circle',
    detail: 'The **dense, homogeneous substance** filling the inner compartment. Holds a single circular DNA molecule, a few RNA molecules, 70S ribosomes, and the components needed to make proteins.',
  },
  {
    id: uuid(), x: 0.66, y: 0.42, label: 'Crista', icon: 'circle',
    detail: 'An infolding of the inner membrane, projecting into the matrix. Cristae exist to **increase the surface area** available for the mitochondrion\'s work.',
  },
];

const chloroHotspots = [
  {
    id: uuid(), x: 0.12, y: 0.28, label: 'Outer membrane', icon: 'circle',
    detail: 'The outer of the two membranes wrapping the chloroplast — chloroplasts, like mitochondria, are **double membrane-bound**.',
  },
  {
    id: uuid(), x: 0.20, y: 0.36, label: 'Inner membrane', icon: 'circle',
    detail: 'The **relatively less permeable** of the two membranes. The space it encloses is the stroma.',
  },
  {
    id: uuid(), x: 0.48, y: 0.50, label: 'Stroma', icon: 'circle',
    detail: 'The space limited by the inner membrane. Contains enzymes for making carbohydrates and proteins, plus its own small circular DNA and ribosomes.',
  },
  {
    id: uuid(), x: 0.58, y: 0.62, label: 'Thylakoid', icon: 'circle',
    detail: 'An organised, flattened membranous sac sitting in the stroma. Its membrane encloses its own internal space, the **lumen** — and it\'s where **chlorophyll** actually sits.',
  },
  {
    id: uuid(), x: 0.68, y: 0.44, label: 'Granum (stack of thylakoids)', icon: 'circle',
    detail: 'A stack of thylakoids piled up like coins is a **granum** (plural: grana). Where thylakoids don\'t stack, they run as intergranal thylakoids instead.',
  },
  {
    id: uuid(), x: 0.78, y: 0.52, label: 'Stroma lamella', icon: 'circle',
    detail: 'A flat membranous tubule that connects the thylakoids of **different** grana to each other.',
  },
];

const blocks = [
  {
    id: uuid(), type: 'image', order: 0, src: '',
    alt: 'Two glowing organelle-shaped silhouettes at dusk, one warm amber like an engine, one deep green catching light',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). Two large softly glowing translucent organelle-shaped silhouettes floating side by side in dark space, oval and elongated, similar in scale. The one on the left glows with a warm amber-orange light from within, like a small engine or furnace, with faint internal folds suggested beneath its surface. The one on the right glows with a deep, rich green light from within, as if quietly catching and holding light, with faint internal stacked layers suggested beneath its surface. Both silhouettes are softly lit, no literal labelled detail, floating in a deep dusk void with a faint warm horizon glow far in the background tying the two together. No text, no labels, no diagram elements, no people. Painterly illustration style, dark background tones throughout (#0a0a0a base).",
  },
  {
    id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'An Organelle You Can Barely See — But Cannot Live Without',
    markdown: "Unless it's specifically stained, a mitochondrion is **barely visible** under a microscope. Yet every cell in your body is quietly running thousands of these near-invisible structures at once. NCERT calls them the **'power houses' of the cell** — because this is exactly where **aerobic respiration** happens and where your cells make their **ATP**.",
  },
  {
    id: uuid(), type: 'text', order: 2,
    markdown: "**Mitochondria** (singular: mitochondrion), unless specifically stained, are **not easily visible** under the microscope. How many a cell has, and what shape and size they take, both **vary with the physiological activity of the cell**. Typically a mitochondrion is **sausage-shaped or cylindrical**, with a diameter of **0.2–1.0 µm** (average 0.5 µm) and a length of **1.0–4.1 µm**.",
  },
  {
    id: uuid(), type: 'heading', order: 3, level: 2,
    text: 'The Powerhouse: Structure of the Mitochondrion',
    objective: "By the end of this you can label every part of a mitochondrion and explain exactly why it's called the cell's power house.",
  },
  {
    id: uuid(), type: 'text', order: 4,
    markdown: "Each mitochondrion is a **double membrane-bound** structure. The **outer membrane** and the **inner membrane** divide its lumen into two distinct aqueous compartments — an **outer compartment** and an **inner compartment**. The inner compartment is filled with a dense, homogeneous substance called the **matrix**.\n\nThe outer membrane simply forms the **continuous limiting boundary** of the organelle. The inner membrane is the interesting one — it folds inward repeatedly toward the matrix, forming a number of infoldings called the **cristae** (singular: crista). Those folds exist for one reason: they **increase the surface area** available for the mitochondrion's work. Both membranes carry their **own specific enzymes**, tied to what the mitochondrion does.\n\nAnd what it does is this: mitochondria are the **sites of aerobic respiration**. They produce the cell's usable energy in the form of **ATP** — exactly why they're called the **'power houses' of the cell**.",
  },
  {
    id: uuid(), type: 'interactive_image', order: 5, src: '',
    alt: 'Longitudinal section of a mitochondrion showing outer membrane, inner membrane, inter-membrane space, matrix, and cristae',
    caption: '📸 Tap each part of the mitochondrion to see what it does',
    generation_prompt: "Scientific textbook illustration of a mitochondrion in longitudinal section (Figure 8.7 style). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate sausage-shaped/cylindrical organelle shape, elongated with rounded ends. Show a smooth continuous outer membrane as the outermost boundary; just inside it a separate inner membrane that folds inward repeatedly to form several finger-like cristae projecting into the interior; a thin gap between the outer and inner membrane rendered as the inter-membrane space; the interior filled with a soft stippled texture in a warm orange-tan tint representing the matrix. No text or labels baked into the image itself, no photorealism, no cartoon, no mascots — matches standard biology textbook illustration conventions. Functional colours: warm orange/tan for the matrix, white outlines for both membranes.",
    hotspots: mitoHotspots,
  },
  {
    id: uuid(), type: 'text', order: 6,
    markdown: "The matrix isn't just an energy factory — it also holds its own genetic machinery. It contains a **single circular DNA molecule**, a few **RNA molecules**, **ribosomes (70S)**, and everything needed to **synthesise proteins**, right there inside the mitochondrion. And when a cell needs more mitochondria, it doesn't build them from scratch — existing mitochondria simply **divide by fission**.",
  },
  {
    id: uuid(), type: 'heading', order: 7, level: 2,
    text: 'Plastids: Chloroplasts, Chromoplasts and Leucoplasts',
    objective: "By the end of this you can tell apart the three types of plastid by their pigments — and open up a chloroplast to see exactly where photosynthesis happens.",
  },
  {
    id: uuid(), type: 'text', order: 8,
    markdown: "**Plastids** are found in **all plant cells** and in **euglenoids**. Unlike mitochondria, they're **large** and easy to spot under a microscope. Each plastid carries specific pigments, and those pigments are exactly what give a plant its colours. Based on which pigment they carry, plastids fall into three types: **chloroplasts**, **chromoplasts**, and **leucoplasts**.",
  },
  {
    id: uuid(), type: 'comparison_card', order: 9, title: 'Chloroplast vs Chromoplast vs Leucoplast',
    columns: [
      {
        heading: 'Chloroplast',
        points: [
          'Pigments: chlorophyll + carotenoid',
          'Colour: green',
          'Function: traps light energy essential for photosynthesis',
        ],
      },
      {
        heading: 'Chromoplast',
        points: [
          'Pigments: fat-soluble carotenoids — carotene, xanthophylls, and others',
          'Colour: yellow, orange, or red',
          'Function: gives that colour to the part of the plant it is found in',
        ],
      },
      {
        heading: 'Leucoplast',
        points: [
          'Pigments: none — colourless, of varied shapes and sizes',
          'Colour: colourless',
          'Function — stores nutrients: amyloplast = carbohydrates/starch (e.g. potato), elaioplast = oils and fats, aleuroplast = proteins',
        ],
      },
    ],
  },
  {
    id: uuid(), type: 'text', order: 10,
    markdown: "Most of a green plant's chloroplasts sit inside the **mesophyll cells of the leaves**. They come in a range of shapes — **lens-shaped, oval, spherical, discoid, or even ribbon-like** — with a length of **5–10 µm** and width of **2–4 µm**. How many a cell holds varies hugely too: just **1 per cell in _Chlamydomonas_**, a green alga, but **20–40 per cell** in a typical mesophyll cell.\n\nLike mitochondria, chloroplasts are also **double membrane-bound** — though here the **inner membrane is relatively less permeable** than the outer one. The space enclosed by that inner membrane is the **stroma**, and inside the stroma sit a number of organised, flattened membranous sacs called **thylakoids**. These thylakoids stack up like **piles of coins** — each stack is called a **granum** (plural: grana) — and where they don't stack, they run as **intergranal thylakoids** instead. Flat membranous tubules called **stroma lamellae** connect the thylakoids of different grana to each other. The membrane of each thylakoid encloses its own internal space, called the **lumen**.",
  },
  {
    id: uuid(), type: 'interactive_image', order: 11, src: '',
    alt: 'Sectional view of a chloroplast showing outer membrane, inner membrane, stroma, thylakoid, grana, and stroma lamellae',
    caption: '📸 Tap each part of the chloroplast to see what it does',
    generation_prompt: "Scientific textbook illustration of a chloroplast in sectional view (Figure 8.8 style). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate lens-shaped/oval organelle outline. Show a smooth outer membrane as the outer boundary; just inside it a separate inner membrane; the interior space (the stroma) filled with a soft stippled texture in a muted green tint; within the stroma, several stacks of flattened green disc-shaped thylakoids piled like coins (grana), with thin flat membranous tubules (stroma lamellae) visibly connecting the thylakoid stacks of different grana to each other. No text or labels baked into the image itself, no photorealism, no cartoon, no mascots — matches standard biology textbook illustration conventions. Functional colours: green for the thylakoids/grana and stroma, white outlines for both membranes.",
    hotspots: chloroHotspots,
  },
  {
    id: uuid(), type: 'text', order: 12,
    markdown: "The stroma itself is busy too — it holds the **enzymes needed to synthesise carbohydrates and proteins**, plus its own small **double-stranded circular DNA** and **ribosomes**. The green pigment that actually catches light, **chlorophyll**, sits in the **thylakoids** — not loose in the stroma. And those chloroplast ribosomes are **70S**, smaller than the **80S ribosomes** floating free in the rest of the cytoplasm.",
  },
  {
    id: uuid(), type: 'reasoning_prompt', order: 13, reasoning_type: 'logical',
    prompt: "A student claims mitochondria and chloroplasts are built on the exact same design. Based on everything you've just read about both organelles, which statement is actually true?",
    options: [
      "Both are double membrane-bound, and both carry their own single circular DNA and their own 70S ribosomes inside them",
      "Both trap light energy for photosynthesis, since both contain chlorophyll in their inner compartment",
      "Both have cristae as infoldings of their inner membrane to increase surface area",
      "Both use 80S ribosomes, the same type found free in the rest of the cytoplasm",
    ],
    correct_index: 0,
    reveal: "That's the real shared ground: both organelles are double membrane-bound, and both carry their own circular DNA plus their own 70S ribosomes, separate from the rest of the cell. Chlorophyll and light-trapping belong to the chloroplast only, not the mitochondrion. Cristae are specific to the mitochondrion's inner membrane — the chloroplast's inner membrane instead encloses the stroma with its thylakoids and grana. And neither organelle uses 80S ribosomes; that size is used by the ribosomes free in the cytoplasm, while both mitochondria and chloroplasts use the smaller 70S type.",
    difficulty_level: 2,
  },
  {
    id: uuid(), type: 'callout', order: 14, variant: 'remember', title: 'The Facts You Cannot Get Wrong',
    markdown: "- **Mitochondrion:** sausage-shaped, double membrane-bound. Outer membrane = boundary; inner membrane folds into **cristae** to increase surface area; **matrix** = the dense inner substance.\n- Mitochondria = site of **aerobic respiration**, produce **ATP** → the **'power houses'** of the cell.\n- The matrix holds its own **circular DNA, RNA, and 70S ribosomes**; mitochondria **divide by fission**.\n- **Plastids** are found in **all plant cells + euglenoids**; three types by pigment: **chloroplast** (chlorophyll + carotenoid → photosynthesis), **chromoplast** (carotenoids → yellow/orange/red), **leucoplast** (colourless, stores nutrients).\n- **Leucoplast subtypes:** amyloplast = starch (e.g. potato), elaioplast = oils/fats, aleuroplast = proteins.\n- **Chloroplast:** double membrane-bound, inner membrane less permeable; **stroma** holds **thylakoids** stacked into **grana**, connected by **stroma lamellae**; chlorophyll sits in the thylakoids, not the stroma.\n- Chloroplasts also carry their **own circular DNA + 70S ribosomes** (smaller than the 80S cytoplasmic ones).",
  },
  {
    id: uuid(), type: 'callout', order: 15, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
    markdown: "**Shared feature between the two:** mitochondria and chloroplasts are the two organelles that carry **their own circular DNA and their own 70S ribosomes**, distinct from the rest of the cell — a fact NEET tests directly.\n\n**Grana vs stroma lamellae — a clean structural pair:** **grana** are the stacks of thylakoids, piled like coins; **stroma lamellae** are the flat tubules connecting thylakoids across **different** grana. If a question describes 'connecting different grana', the answer is stroma lamellae, not grana itself.\n\n**Leucoplast subtypes by stored material:** amyloplast → starch, elaioplast → oils/fats, aleuroplast → proteins. NCERT's own example for amyloplast is the potato.\n\n**Classic NEET question:** \"Which two cell organelles possess their own DNA and 70S ribosomes, distinct from the rest of the cell?\" → Mitochondria and chloroplasts.",
  },
  {
    id: uuid(), type: 'text', order: 16,
    markdown: "You've now seen the cell's two energy-and-pigment organelles, both wrapped in a double membrane, both carrying their own DNA. Next up is a structure with no membrane at all — the ribosome, the machine that actually builds every protein a cell makes.",
  },
  {
    id: uuid(), type: 'inline_quiz', order: 17, pass_threshold: 0.67,
    questions: [
      {
        id: uuid(), question: "Why are mitochondria called the 'power houses' of the cell?",
        options: [
          'Because they store large amounts of starch to fuel every reaction in the cell',
          'Because they trap light energy using chlorophyll, exactly like a chloroplast does',
          "Because they are the sites of aerobic respiration and produce the cell's ATP",
          "Because they synthesise the entire cell's DNA within their own matrix",
        ],
        correct_index: 2,
        explanation: "Mitochondria are the sites of aerobic respiration and produce cellular energy as ATP — that's exactly why NCERT calls them 'power houses'. Storing starch is a leucoplast job (specifically an amyloplast), trapping light with chlorophyll is a chloroplast job, and the mitochondrial matrix carries its own small circular DNA for itself, not the whole cell's DNA.",
        difficulty_level: 1,
      },
      {
        id: uuid(), question: 'Which type of plastid would you expect to find storing starch, as in a potato?',
        options: ['Elaioplast', 'Amyloplast', 'Aleuroplast', 'Chromoplast'],
        correct_index: 1,
        explanation: "Amyloplasts are the leucoplasts that store carbohydrates as starch — NCERT gives the potato as the exact example. Elaioplasts store oils and fats instead, aleuroplasts store proteins, and chromoplasts aren't leucoplasts at all — they hold carotenoid pigments and give colour, not starch.",
        difficulty_level: 2,
      },
      {
        id: uuid(), question: 'In a chloroplast, what connects the thylakoids of two different grana to each other?',
        options: ['Cristae', 'Matrix', 'Nucleoid', 'Stroma lamellae'],
        correct_index: 3,
        explanation: "Stroma lamellae are the flat membranous tubules that connect thylakoids of different grana. Cristae belong to mitochondria, not chloroplasts; matrix is the mitochondrial inner substance (the chloroplast equivalent is the stroma); and 'nucleoid' isn't a term used for either organelle in this text.",
        difficulty_level: 2,
      },
      {
        id: uuid(), question: 'How do the ribosomes found inside a chloroplast compare with the ribosomes floating free in the surrounding cytoplasm?',
        options: [
          'Chloroplast ribosomes are 70S — smaller than the 80S ribosomes free in the cytoplasm',
          'Chloroplast ribosomes are 80S — identical in size to the ones in the cytoplasm',
          'Chloroplasts have no ribosomes of their own at all',
          'Chloroplast ribosomes are larger, at 80S, compared to 70S cytoplasmic ribosomes',
        ],
        correct_index: 0,
        explanation: "NCERT states chloroplast ribosomes are 70S, smaller than the 80S cytoplasmic ribosomes. Chloroplasts do carry their own ribosomes — they're just a different, smaller size than the ones working freely in the rest of the cell.",
        difficulty_level: 3,
      },
    ],
  },
];

module.exports = {
  slug: 'mitochondria-and-plastids',
  title: 'Mitochondria and Plastids',
  subtitle: "Two organelles carry their own DNA and their own tiny ribosomes — the mitochondrion that powers every cell, and the chloroplast that catches the light. Here's exactly how each one is built.",
  page_number: 7,
  page_type: 'lesson',
  tags: ['cell-the-unit-of-life', 'mitochondria', 'plastids', 'chloroplast'],
  glossary: [
    { term: 'mitochondrion', definition: "A double membrane-bound organelle that is the site of aerobic respiration; produces ATP and is called the cell's 'power house'." },
    { term: 'cristae', definition: 'Infoldings of the inner mitochondrial membrane, projecting into the matrix, that increase its surface area.' },
    { term: 'matrix (mitochondrial)', definition: 'The dense, homogeneous substance filling the inner compartment of a mitochondrion; contains its own circular DNA, RNA, and 70S ribosomes.' },
    { term: 'plastid', definition: 'An organelle found in all plant cells and euglenoids, classified by its pigments into chloroplasts, chromoplasts, and leucoplasts.' },
    { term: 'chloroplast', definition: 'A plastid containing chlorophyll and carotenoid pigments that traps light energy essential for photosynthesis.' },
    { term: 'chromoplast', definition: 'A plastid containing fat-soluble carotenoid pigments (carotene, xanthophylls) that give a plant part a yellow, orange, or red colour.' },
    { term: 'leucoplast', definition: 'A colourless plastid that stores nutrients: amyloplasts store starch, elaioplasts store oils and fats, aleuroplasts store proteins.' },
    { term: 'stroma', definition: 'The space enclosed by the inner membrane of a chloroplast; contains enzymes, its own circular DNA, ribosomes, and the thylakoids.' },
    { term: 'granum (plural: grana)', definition: 'A stack of thylakoids inside the chloroplast stroma, arranged like a pile of coins.' },
    { term: 'stroma lamellae', definition: 'Flat membranous tubules that connect the thylakoids of different grana to each other.' },
  ],
  blocks,
};
