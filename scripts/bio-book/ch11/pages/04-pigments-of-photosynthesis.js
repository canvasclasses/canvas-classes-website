'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'pigments-of-photosynthesis',
  title: 'The Pigments of Photosynthesis',
  subtitle: "A green leaf is not one green — it is four pigments hiding on top of each other. Learn to name all four, tell the absorption spectrum apart from the action spectrum, and say exactly what the three helper pigments do.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['photosynthesis-in-higher-plants', 'pigments'],
  glossary: [
    { term: 'paper chromatography', definition: 'A separation technique that spreads a mixture out along a strip of paper. Used on a leaf extract, it splits the single green colour into its four separate pigment bands.' },
    { term: 'chlorophyll a', definition: 'The chief pigment associated with photosynthesis. It appears bright or blue-green in the chromatogram and is the one all the other pigments hand their absorbed energy to.' },
    { term: 'carotenoids', definition: 'One of the four leaf pigments, yellow to yellow-orange in the chromatogram. An accessory pigment that also absorbs light and passes the energy to chlorophyll a.' },
    { term: 'absorption spectrum', definition: 'A graph of how much light a pigment absorbs at each wavelength. For chlorophyll a, absorption is maximum in the blue and the red regions.' },
    { term: 'action spectrum', definition: 'A graph of the rate of photosynthesis at each wavelength of light. It also peaks in the blue and red regions.' },
    { term: 'accessory pigments', definition: 'The thylakoid pigments other than chlorophyll a — chlorophyll b, xanthophylls and carotenoids. They absorb light and transfer the energy to chlorophyll a.' },
    { term: 'photo-oxidation', definition: 'Damage to a molecule caused by light. Accessory pigments protect chlorophyll a from photo-oxidation.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'Sunlight filtering through a canopy of leaves showing many different shades of green, on a dark atmospheric background',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). Soft shafts of sunlight filter down through a dense forest canopy of overlapping leaves, and the leaves show many different shades of green — deep blue-greens, soft yellow-greens, warm golden-greens — as if each leaf were quietly made of more than one colour. The rest of the frame falls away into deep shadow. Painterly, atmospheric illustration style, dark naturalistic background throughout (#0a0a0a base tones), gentle warm light rays, no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'One Leaf, Four Hidden Colours',
      markdown: "Have you noticed how a single plant can show so many shades of green, even across leaves growing side by side? Here is the reason: the green you see is **not one pigment at all**. If you grind up a leaf and let its extract creep up a strip of paper — a trick called **paper chromatography** — that one green colour splits apart into **four different coloured pigments**, each stopping at its own spot on the paper.",
    },
    // ── 2 · Core concept — the four pigments, revealed by chromatography ───────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The colour we see in a leaf is due to **four pigments**, not one. Paper chromatography pulls them apart so you can see each one on its own:\n\n- **Chlorophyll a** — bright or blue-green in the chromatogram\n- **Chlorophyll b** — yellow-green\n- **Xanthophylls** — yellow\n- **Carotenoids** — yellow to yellow-orange\n\nAll four are **pigments**, and a pigment is simply a substance that can **absorb light at specific wavelengths**. That last part matters: each pigment grabs its own particular colours of light, and that is the whole reason the plant bothers to keep four of them instead of just one.",
    },
    // ── 3 · Heading — the four pigments ───────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Four Pigments Hiding in Every Green Leaf',
      objective: "By the end of this you can name all four leaf pigments and match each one to the colour it shows in a paper chromatogram.",
    },
    // ── 4 · Text — walk through the chromatogram ──────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Picture the finished chromatogram strip. The single dark-green drop you loaded at the bottom has separated into **four coloured bands**, each a different pigment. From the same leaf extract you now get a bright-to-blue-green band (**chlorophyll a**), a yellow-green band (**chlorophyll b**), a yellow band (**xanthophylls**), and a yellow-to-yellow-orange band (**carotenoids**). Tap each band below to see which pigment it is.",
    },
    // ── 5 · Interactive image — the chromatogram strip ────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A paper chromatography strip showing four separated leaf-pigment bands in different colours',
      caption: '📸 Tap each band to see which of the four leaf pigments it is, and the colour it shows in the chromatogram.',
      generation_prompt: "Scientific textbook illustration of a paper chromatography strip separating leaf pigments. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A single vertical rectangular strip of chromatography paper stands upright in the centre of the frame, with clean white outlines. Near the bottom of the strip a thin white horizontal pencil line marks the origin where the leaf extract was loaded. Above it, four distinct horizontal coloured bands are spread out along the strip, stacked from bottom to top: a yellow-green band, a bright blue-green band, a yellow band, and a yellow-to-yellow-orange band. Bands are soft-edged smudges of pure colour, biologically plausible, not glowing or neon. Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.86, label: 'Origin (loading line)', detail: "The pencil line near the bottom where the drop of leaf extract was first placed. From this single dark-green spot, the four pigments separate and travel up the paper.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.68, label: 'Chlorophyll b', detail: "Shows up **yellow-green** in the chromatogram. One of the two chlorophylls, and an accessory pigment.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.52, label: 'Chlorophyll a', detail: "Shows up **bright or blue-green** in the chromatogram. This is the **chief pigment** associated with photosynthesis.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.34, label: 'Xanthophylls', detail: "Show up **yellow** in the chromatogram. An accessory pigment.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.18, label: 'Carotenoids', detail: "Show up **yellow to yellow-orange** in the chromatogram. An accessory pigment.", icon: 'circle' },
      ],
    },
    // ── 6 · Table — the four pigments ─────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 6,
      caption: 'The four leaf pigments, the colour each shows in the chromatogram, and its role',
      headers: ['Pigment', 'Colour in chromatogram', 'Role'],
      rows: [
        ['Chlorophyll a', 'Bright or blue-green', 'Chief pigment of photosynthesis — the one all others transfer energy to'],
        ['Chlorophyll b', 'Yellow-green', 'Accessory pigment — absorbs light, transfers energy to chlorophyll a'],
        ['Xanthophylls', 'Yellow', 'Accessory pigment — absorbs light, transfers energy to chlorophyll a'],
        ['Carotenoids', 'Yellow to yellow-orange', 'Accessory pigment — absorbs light, transfers energy to chlorophyll a'],
      ],
    },
    // ── 7 · Heading — absorption vs action spectrum ───────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Absorption Spectrum vs Action Spectrum — and Why We Need Helper Pigments',
      objective: "By the end of this you can tell the absorption spectrum apart from the action spectrum, explain why chlorophyll a is the chief pigment, and state the two jobs of the accessory pigments.",
    },
    // ── 8 · Text — the two spectra + accessory pigments ───────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "There are two different graphs you must not mix up.\n\nThe first is the **absorption spectrum** — it shows how much a pigment absorbs at each wavelength of light. For **chlorophyll a**, absorption is **maximum in the blue and the red** regions of light.\n\nThe second is the **action spectrum** — it shows the **rate of photosynthesis** at each wavelength. When you look at it, photosynthesis is also **highest in the blue and red** regions — exactly where chlorophyll a absorbs the most. Because these two peaks line up, we conclude that **chlorophyll a is the chief pigment associated with photosynthesis**.\n\nBut the match is not perfect. There is **no complete one-to-one overlap** between chlorophyll a's absorption spectrum and the action spectrum — some photosynthesis still happens at wavelengths where chlorophyll a is weak. Why? Because chlorophyll a is not working alone. The other thylakoid pigments — **chlorophyll b, xanthophylls and carotenoids** — are called **accessory pigments**. They also **absorb light and transfer the energy to chlorophyll a**. In doing so they (1) let a **wider range of wavelengths** be used for photosynthesis, and (2) **protect chlorophyll a from photo-oxidation**.",
    },
    // ── 9 · Comparison card — absorption vs action spectrum ───────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Absorption spectrum vs Action spectrum',
      columns: [
        { heading: 'Absorption spectrum', points: [
          'Plots how much a pigment absorbs at each wavelength',
          'It is about the pigment (e.g. chlorophyll a)',
          'Chlorophyll a absorbs maximum in the blue and red regions',
        ] },
        { heading: 'Action spectrum', points: [
          'Plots the rate of photosynthesis at each wavelength',
          'It is about the process (photosynthesis itself)',
          'Photosynthesis is highest in the blue and red regions too',
        ] },
      ],
    },
    // ── 10 · Reasoning prompt — accessory pigment role ────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "The action spectrum of photosynthesis does not overlap perfectly with chlorophyll a's absorption spectrum — some photosynthesis happens at wavelengths where chlorophyll a barely absorbs. What best explains this?",
      options: [
        "Accessory pigments (chlorophyll b, xanthophylls, carotenoids) absorb light at those wavelengths and transfer the energy to chlorophyll a",
        "Chlorophyll a changes its colour to absorb the extra wavelengths whenever light is dim",
        "The extra photosynthesis is done directly by the cell wall, which absorbs light chlorophyll a misses",
        "Xanthophylls carry out their own separate photosynthesis and make their own glucose",
      ],
      reveal: "The first option is right. Chlorophyll a is the chief pigment, but chlorophyll b, xanthophylls and carotenoids — the accessory pigments — also absorb light and hand the energy over to chlorophyll a. That is exactly why a wider range of wavelengths can drive photosynthesis, which stretches the action spectrum beyond where chlorophyll a alone absorbs. The tempting wrong answer is the xanthophyll option: accessory pigments do NOT run their own photosynthesis — they only absorb and transfer energy to chlorophyll a. Chlorophyll a does not swap colours, and the cell wall plays no part in absorbing light.",
      difficulty_level: 2,
    },
    // ── 11 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Four leaf pigments** (separated by paper chromatography), with their chromatogram colours:\n  - **Chlorophyll a** → bright or blue-green\n  - **Chlorophyll b** → yellow-green\n  - **Xanthophylls** → yellow\n  - **Carotenoids** → yellow to yellow-orange\n- **Chlorophyll a is the chief pigment** associated with photosynthesis.\n- **Absorption spectrum** = how much a pigment absorbs at each wavelength (chlorophyll a: max in **blue and red**). **Action spectrum** = rate of photosynthesis at each wavelength (also peaks in **blue and red**). There is **no complete one-to-one overlap** between them.\n- **Accessory pigments** = chlorophyll b, xanthophylls, carotenoids. They absorb light and transfer energy to chlorophyll a. Their two jobs: (1) let a **wider range of wavelengths** be used, and (2) **protect chlorophyll a from photo-oxidation**.",
    },
    // ── 12 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Chief pigment:** the chief pigment of photosynthesis is **chlorophyll a** — proven by the fact that its absorption peaks (blue and red) line up with the action-spectrum peaks. Chlorophyll b, xanthophylls and carotenoids are only **accessory** pigments.\n\n**Absorption vs action:** don't swap them. Absorption spectrum = a **pigment** absorbing light; action spectrum = the **rate of photosynthesis**. NEET loves a graph question that hinges on which is which.\n\n**Two jobs of accessory pigments:** (1) widen the range of wavelengths used, (2) protect chlorophyll a from photo-oxidation.\n\n**Classic NEET question:** \"Accessory pigments protect chlorophyll a from ___.\" → **photo-oxidation.** And: \"The chief pigment associated with photosynthesis is ___.\" → **chlorophyll a.**",
    },
    // ── 13 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "So the leaf traps light with four pigments, and chlorophyll a is the one that finally collects all that energy. Next you'll follow what chlorophyll a does with it — inside the thylakoid, where the **light reaction** and the **photosystems** turn absorbed light into usable chemical energy.",
    },
    // ── 14 · Inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "The colour of a green leaf is due to how many pigments, and how are they separated?",
          options: [
            "One pigment (chlorophyll), separated by simple filtration of the leaf extract",
            "Four pigments, separated by paper chromatography of the leaf extract",
            "Two pigments (chlorophyll a and b only), separated by boiling the leaf in water",
            "Three pigments (the chlorophylls and carotenoids), separated by centrifugation",
          ],
          correct_index: 1,
          explanation: "Paper chromatography of the leaf extract shows the green is due to four pigments — chlorophyll a, chlorophyll b, xanthophylls and carotenoids. It is not a single pigment, and there are four, not two or three; the other options also name separation methods NCERT never uses here.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "In the chromatogram, which pigment appears bright or blue-green, and what is its status in photosynthesis?",
          options: [
            "Chlorophyll b, which is the chief pigment of photosynthesis",
            "Carotenoids, which are the chief pigment of photosynthesis",
            "Chlorophyll a, which is the chief pigment of photosynthesis",
            "Xanthophylls, which are the chief pigment of photosynthesis",
          ],
          correct_index: 2,
          explanation: "Chlorophyll a is bright or blue-green in the chromatogram and is the chief pigment associated with photosynthesis. Chlorophyll b is yellow-green, xanthophylls are yellow, and carotenoids are yellow to yellow-orange — and all three of those are accessory pigments, not the chief one.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "What is the difference between the absorption spectrum and the action spectrum?",
          options: [
            "The absorption spectrum shows the rate of photosynthesis; the action spectrum shows how much a pigment absorbs at each wavelength",
            "The absorption spectrum shows how much a pigment absorbs at each wavelength; the action spectrum shows the rate of photosynthesis at each wavelength",
            "Both graphs show the rate of photosynthesis, but measured with different pigments",
            "Both graphs show pigment absorption, but one uses chlorophyll a and the other uses carotenoids",
          ],
          correct_index: 1,
          explanation: "The absorption spectrum is about the pigment — how much it absorbs at each wavelength. The action spectrum is about the process — the rate of photosynthesis at each wavelength. Option 1 has the two definitions swapped, which is the exact trap; the other two options wrongly claim both graphs measure the same thing.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Besides letting a wider range of wavelengths be used, what is the other role of the accessory pigments?",
          options: [
            "They protect chlorophyll a from photo-oxidation",
            "They build the thylakoid membrane so chlorophyll a has a place to sit",
            "They replace chlorophyll a as the chief pigment when light is very bright",
            "They store the glucose that chlorophyll a produces during the day",
          ],
          correct_index: 0,
          explanation: "Accessory pigments have two jobs: they enable a wider range of wavelengths to be used, and they protect chlorophyll a from photo-oxidation. They do not build membranes, replace chlorophyll a as the chief pigment, or store glucose — those are inventions the question is testing you not to fall for.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
