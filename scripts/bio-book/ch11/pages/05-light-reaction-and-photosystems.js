'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'light-reaction-and-photosystems',
  title: 'The Light Reaction & the Two Photosystems',
  subtitle: "This is the 'photochemical' half of photosynthesis — where light is caught, water is split, oxygen is let go, and the cell's two power intermediates (ATP and NADPH) are made. Get the two photosystems and their reaction centres — P700 and P680 — dead right.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['photosynthesis-in-higher-plants', 'light-reaction'],
  glossary: [
    { term: 'light reaction', definition: "The 'photochemical' phase of photosynthesis. It includes light absorption, the splitting of water, the release of oxygen, and the formation of the two high-energy chemical intermediates ATP and NADPH." },
    { term: 'light harvesting complex (LHC)', definition: 'One of the two discrete photochemical complexes into which the pigments are organised. Each LHC is made up of hundreds of pigment molecules bound to proteins, and one such complex sits within each photosystem.' },
    { term: 'photosystem', definition: 'A working unit of pigments and proteins involved in the light reaction. There are two — Photosystem I (PS I) and Photosystem II (PS II) — named in the sequence of their discovery, not the sequence in which they function.' },
    { term: 'antenna (light harvesting system)', definition: 'All the pigments in a photosystem except one molecule of chlorophyll a. They absorb different wavelengths of light and make photosynthesis more efficient by passing the captured energy inward.' },
    { term: 'reaction centre', definition: 'The single chlorophyll a molecule in a photosystem to which the antenna funnels energy. The reaction centre is different in the two photosystems.' },
    { term: 'P700', definition: 'The reaction-centre chlorophyll a of Photosystem I. It has an absorption peak at 700 nm, which is where the name comes from.' },
    { term: 'P680', definition: 'The reaction-centre chlorophyll a of Photosystem II. It has an absorption maximum at 680 nm, which is where the name comes from.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single beam of sunlight striking a green leaf in near-darkness, with a soft glow spreading inward as if energy is being gathered to one point',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single shaft of warm sunlight breaks through darkness and lands on one green leaf, its surface catching the light. Where the light touches, a soft cool glow gathers and appears to travel inward toward a single bright point on the leaf, suggesting energy being collected and funnelled without becoming a literal labelled diagram. Deep shadows fill the rest of the frame. Painterly, atmospheric, naturalistic illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Photosystem II Works First — Even Though It Was Named Second',
      markdown: "The two photosystems are called **Photosystem I** and **Photosystem II**, so you'd assume PS I runs first and PS II runs second. It doesn't work that way. They were **named in the order scientists discovered them**, not the order in which they actually function during the light reaction — and the one that acts first is the one that was found second. That single mismatch is one of the most quietly tested facts in this whole chapter.",
    },
    // ── 2 · Core concept — what the light reaction is ─────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Photosynthesis has two halves. The first half needs light, and that's the one on this page — the **light reaction**, also called the **'photochemical' phase**. This is the stage where the plant actually catches sunlight and turns it into usable chemical energy.\n\nFour things happen in this phase: **light absorption**, the **splitting of water**, the **release of oxygen**, and the **formation of the two high-energy chemical intermediates, ATP and NADPH**. None of this is done by a single molecule working alone — **several protein complexes** are involved, working together.",
    },
    // ── 3 · Heading — what the light reaction does ────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'What the Light Reaction Actually Does',
      objective: "By the end of this you can list the four events of the light reaction in one breath — light absorption, water splitting, oxygen release, and the making of ATP and NADPH.",
    },
    // ── 4 · Text — the four events ────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Hold the four events together as one chain. First, pigments **absorb light**. That captured energy is then used to **split water molecules** — and splitting water is exactly what **releases oxygen**, the O₂ that leaves the plant. The same run of events also builds the two **high-energy chemical intermediates**, **ATP and NADPH**, which the plant will spend later.\n\nSo the light reaction isn't just \"the plant absorbs sunlight.\" It is: light in → water split → oxygen out → **ATP and NADPH** made. Every one of those four belongs to this photochemical phase, and NEET expects you to name all four.",
    },
    // ── 5 · Heading — photosystems & reaction centre ──────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'The Two Photosystems and the Reaction Centre',
      objective: "By the end of this you can explain how a photosystem is built, what the antenna does, and why PS I is called P700 while PS II is called P680.",
    },
    // ── 6 · Text — LHC, antenna, reaction centre ──────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "The pigments doing the light-catching aren't scattered loose. They're organised into **two discrete photochemical light harvesting complexes (LHC)**, one inside **Photosystem I (PS I)** and one inside **Photosystem II (PS II)**. Remember the naming trap from the top of the page: **PS I and PS II are named in the sequence of their discovery, not the sequence in which they function** during the light reaction.\n\nEach LHC is made up of **hundreds of pigment molecules bound to proteins**. Here's the clever part. In each photosystem, **all** of those pigments — **except one single molecule of chlorophyll a** — form a **light harvesting system**, also called the **antennae**. These antenna pigments absorb **different wavelengths of light**, which is what makes photosynthesis more efficient: many pigments catching many colours, then handing that energy inward.\n\nWhere does the energy go? To the one pigment the antenna left out. That **single chlorophyll a molecule forms the reaction centre** — the point everything funnels to. And this reaction centre is **different in the two photosystems**: in **PS I** the reaction-centre chlorophyll a has an **absorption peak at 700 nm**, so it's called **P700**; in **PS II** it has an **absorption maximum at 680 nm**, so it's called **P680**.",
    },
    // ── 7 · Interactive image — light harvesting complex (Figure 11.4) ─────────
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'A light harvesting complex: a broad ring of many small pigment molecules surrounding a single central chlorophyll a reaction centre, with an incoming photon and arrows showing energy funnelling inward toward the centre',
      caption: '📸 Tap each dot to explore how a light harvesting complex catches light and funnels the energy to one central molecule.',
      generation_prompt: "Scientific textbook illustration of a photosynthetic light harvesting complex (LHC). Flat 2D educational diagram on a dark background (#0a0a0a near-black). A broad cluster of many small green pigment molecules is arranged around a single, slightly larger central green chlorophyll a molecule (the reaction centre). A yellow wavy arrow labelled 'photon' arrives from the upper left and strikes an outer pigment. Thin white curved arrows point inward from the surrounding pigments toward the central molecule, showing energy being funnelled to the centre. Above the reaction centre sits a small primary acceptor molecule with a short upward white arrow. Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines, green used for the living photosynthetic pigments. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.14, y: 0.22, label: 'Incoming photon', detail: "A packet of light energy arriving at the complex. Absorbing light is the first event of the light reaction — it's what the whole harvesting system is built to catch.", icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.55, label: 'Antenna pigments', detail: "Hundreds of pigment molecules bound to proteins. Every pigment here **except** the one reaction-centre chlorophyll a belongs to this **light harvesting system (antennae)**.", icon: 'circle' },
        { id: uuid(), x: 0.55, y: 0.35, label: 'Different wavelengths', detail: "The antenna pigments absorb **different wavelengths of light**. That variety is exactly what makes photosynthesis more efficient — many pigments catch many colours.", icon: 'circle' },
        { id: uuid(), x: 0.58, y: 0.62, label: 'Energy funnelling inward', detail: "The captured energy is passed from pigment to pigment, all of it heading toward one central point rather than staying spread out.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.55, label: 'Reaction centre (single chlorophyll a)', detail: "The **one** chlorophyll a molecule the antenna leaves out. This single molecule forms the **reaction centre** — and it is different in the two photosystems (**P700** in PS I, **P680** in PS II).", icon: 'circle' },
        { id: uuid(), x: 0.78, y: 0.28, label: 'Primary acceptor', detail: "The molecule that sits ready to receive from the reaction centre once it is energised — the next step onward from the light-harvesting event.", icon: 'circle' },
      ],
    },
    // ── 8 · Comparison card — PS I vs PS II ───────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 8,
      title: 'Photosystem I vs Photosystem II',
      columns: [
        {
          heading: 'Photosystem I (PS I)',
          points: [
            'Reaction centre: a single chlorophyll a molecule',
            'Absorption peak at 700 nm',
            'Reaction centre is therefore called P700',
          ],
        },
        {
          heading: 'Photosystem II (PS II)',
          points: [
            'Reaction centre: a single chlorophyll a molecule',
            'Absorption maximum at 680 nm',
            'Reaction centre is therefore called P680',
          ],
        },
        {
          heading: 'Watch out',
          points: [
            'Both are named by the ORDER OF DISCOVERY, not the order in which they function',
            'The Roman numeral does NOT tell you which one acts first',
            'Only the reaction-centre chlorophyll a differs between them (700 nm vs 680 nm)',
          ],
        },
      ],
    },
    // ── 9 · Reasoning prompt — P700 / P680 + antenna vs centre ────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "Four students describe the light harvesting complex. Exactly one of them has stated it correctly. Which student is right?",
      options: [
        "In PS I the reaction-centre chlorophyll a absorbs at 700 nm and is called P700; in PS II it absorbs at 680 nm and is called P680.",
        "In PS I the reaction-centre chlorophyll a absorbs at 680 nm and is called P680; in PS II it absorbs at 700 nm and is called P700.",
        "The hundreds of antenna pigments each act as a separate reaction centre, so a photosystem has hundreds of reaction centres.",
        "The photosystems are numbered in the exact order in which they function during the light reaction.",
      ],
      reveal: "The first statement is correct: PS I → 700 nm → P700, and PS II → 680 nm → P680. The second swaps the two numbers — a very tempting trap, because the values 700 and 680 are easy to attach to the wrong photosystem. The third is wrong because only ONE chlorophyll a molecule per photosystem forms the reaction centre; all the other hundreds of pigments make up the antenna, not more reaction centres. The fourth is wrong because the photosystems are named in the sequence of their discovery, not the sequence in which they function.",
      difficulty_level: 2,
    },
    // ── 10 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Light reaction (photochemical phase) = four events:** light absorption + water splitting + oxygen release + formation of ATP and NADPH.\n- **Several protein complexes** carry it out — not one molecule alone.\n- Pigments are organised into **two light harvesting complexes (LHC)**, one inside **PS I** and one inside **PS II**. Each LHC = **hundreds of pigment molecules bound to proteins**.\n- **All pigments EXCEPT one chlorophyll a** = the **antenna (light harvesting system)**; they absorb **different wavelengths** and funnel energy inward.\n- The **single chlorophyll a** left out = the **reaction centre**. **PS I → P700 (700 nm)**, **PS II → P680 (680 nm)**.\n- **PS I and PS II are named by the order of their discovery, NOT the order in which they function.**",
    },
    // ── 11 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Pin the numbers to the right photosystem:** **PS I = P700** (absorption peak at 700 nm), **PS II = P680** (absorption maximum at 680 nm). Swapping these two is the single most common way this fact is tested wrong.\n\n**The naming trap:** photosystems are named in the **sequence of their discovery**, not the sequence in which they function. The numeral tells you nothing about which acts first.\n\n**Antenna vs reaction centre:** in each photosystem, all the pigments **except one molecule of chlorophyll a** form the antenna; that one leftover chlorophyll a is the reaction centre.\n\n**Classic NEET question:** \"The reaction centre of PS I is ___\" → **P700**. And \"Photosystems are named according to their ___\" → **order (sequence) of discovery**.",
    },
    // ── 12 · Bridge text ──────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "You now know how light is caught and handed to a single reaction-centre chlorophyll a in each photosystem — P700 in PS I, P680 in PS II. Next, you'll follow what happens after that energy reaches the reaction centre: the electrons start moving between the two photosystems in the pathway drawn as the **Z-scheme**.",
    },
    // ── 13 · Inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Which set of events belongs to the light reaction (the 'photochemical' phase)?",
          options: [
            "Light absorption, water splitting, oxygen release, and the formation of ATP and NADPH",
            "Carbon dioxide fixation, glucose synthesis, and the release of water",
            "Light absorption, oxygen intake, and the breakdown of ATP and NADPH",
            "Water intake, nitrogen fixation, and the formation of chlorophyll",
          ],
          correct_index: 0,
          explanation: "NCERT lists exactly four events for the light reaction: light absorption, water splitting, oxygen release, and the formation of the high-energy intermediates ATP and NADPH. Option 3 is close but reverses two of them — oxygen is released, not taken in, and ATP and NADPH are formed, not broken down. The other options describe things this phase does not do.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "In a photosystem, which pigment forms the reaction centre?",
          options: [
            "All of the hundreds of pigment molecules together act as the reaction centre",
            "A single molecule of chlorophyll a forms the reaction centre; the rest form the antenna",
            "The protein, not any pigment, forms the reaction centre",
            "Every pigment except chlorophyll a forms the reaction centre",
          ],
          correct_index: 1,
          explanation: "NCERT is precise: the single chlorophyll a molecule forms the reaction centre, and all the other pigments (the hundreds bound to proteins) form the light harvesting system, or antenna. Option 4 gets it exactly backwards — the antenna is everything EXCEPT that one chlorophyll a, not chlorophyll a itself.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Why are Photosystem I and Photosystem II given those numbers?",
          options: [
            "Because PS I absorbs a shorter wavelength than PS II",
            "Because PS I always functions before PS II during the light reaction",
            "Because they are named in the sequence in which they were discovered, not the sequence in which they function",
            "Because PS I contains more pigment molecules than PS II",
          ],
          correct_index: 2,
          explanation: "The photosystems are named in the sequence of their discovery, not the sequence in which they function during the light reaction. Option 2 is the classic trap — the numbering feels like a running order, but it isn't. Option 1 is also wrong: PS I's reaction centre (P700) absorbs a LONGER wavelength than PS II's (P680).",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which pairing of photosystem to reaction centre is correct?",
          options: [
            "PS I → P680 (absorption at 680 nm); PS II → P700 (absorption at 700 nm)",
            "PS I → P700 (absorption peak at 700 nm); PS II → P680 (absorption maximum at 680 nm)",
            "PS I → P700 (absorption at 680 nm); PS II → P680 (absorption at 700 nm)",
            "Both PS I and PS II have the same reaction centre, P700, absorbing at 700 nm",
          ],
          correct_index: 1,
          explanation: "In PS I the reaction-centre chlorophyll a has an absorption peak at 700 nm and is called P700; in PS II it has an absorption maximum at 680 nm and is called P680. Option 1 swaps the two numbers, option 3 mismatches each name with the wrong wavelength, and option 4 wrongly makes the two reaction centres identical — but NCERT states the reaction centre is different in the two photosystems.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
