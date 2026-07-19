'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'microsporogenesis-and-the-pollen-grain',
  title: 'Making Pollen — Microsporogenesis & the Pollen Grain',
  subtitle: "How a diploid mother cell inside the anther becomes thousands of dust-like pollen grains — and why the pollen wall is nearly indestructible.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['microsporogenesis', 'pollen-grain', 'sporopollenin', 'sexual-reproduction-in-flowering-plants'],
  glossary: [
    { term: 'microsporogenesis', definition: 'The process of forming microspores from a pollen mother cell (PMC) through meiosis.' },
    { term: 'sporopollenin', definition: 'The tough organic material that makes up the outer pollen wall (exine); one of the most resistant organic materials known — no enzyme degrades it.' },
    { term: 'exine', definition: 'The hard outer layer of the pollen wall, made of sporopollenin, carrying germ pores where the material is absent.' },
    { term: 'intine', definition: 'The thin, continuous inner layer of the pollen wall, made of cellulose and pectin.' },
    { term: 'germ pore', definition: 'An aperture in the exine where sporopollenin is absent; the pollen tube emerges through it.' },
    { term: 'generative cell', definition: 'The small, spindle-shaped cell inside a pollen grain that divides to form the two male gametes.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk close-up of a flower shedding a cloud of golden pollen dust drifting on the air',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). An extreme close-up of an open flower anther at dusk, releasing a soft drifting cloud of fine golden pollen dust into still evening air. The powdery grains catch a single warm shaft of low light, glowing faintly against a deep dark background as they float. The flower itself is only partly in frame on the left, out of focus, letting the suspended pollen be the quiet subject. Deep dusk lighting, painterly atmospheric illustration style, dark background tones throughout (#0a0a0a base), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Grain That Outlives Everything',
      markdown: "The outer coat of a pollen grain is built from **sporopollenin** — one of the most resistant organic materials known to science. It shrugs off high temperatures, strong acids, and strong alkalis, and **no enzyme has been found that can break it down**. That's why pollen grains survive as **fossils** for millions of years, long after the plant that made them has rotted away. Geologists literally read ancient climates from the pollen locked in old rock and mud.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Inside a young anther, the centre of each microsporangium is packed with a group of compact, look-alike cells called the **sporogenous tissue**. Every one of these cells is a potential **pollen mother cell** — also called the **microspore mother cell (PMC)**. This is the starting material. Everything that becomes pollen traces back to these cells sitting quietly in the middle of the pollen sac.\n\nHere is the key point to hold in your head: the PMC is **diploid (2n)**. It carries the full double set of chromosomes, just like the rest of the plant's body cells. To make pollen — which will eventually carry male gametes — that chromosome number has to be halved. And the tool for halving chromosomes is always **meiosis**.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Microsporogenesis — One Meiosis, Four Microspores',
      objective: "By the end of this you can put the whole sequence — sporogenous tissue to pollen grain — in the right order, and state the ploidy at each step.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "As the anther develops, each pollen mother cell undergoes **meiosis**. Because meiosis splits one diploid cell into four cells with half the chromosome number, a single PMC gives rise to **four microspores** — and, freshly formed, these four stay stuck together in a little cluster called a **microspore tetrad**. The whole process of making microspores from a PMC through meiosis has one name: **microsporogenesis**.\n\nThe four cells of the tetrad are **haploid (n)** — that's the direct consequence of meiosis halving the 2n mother cell. Then, as the anther matures and dries out, the microspores **dissociate** from one another and each one develops into a **pollen grain**. Inside a single microsporangium, this happens thousands of times over, so several thousand pollen grains are packed in and finally released when the anther splits open (dehisces).\n\nSo the developmental line reads: **sporogenous tissue → pollen mother cell (2n) → meiosis → microspore tetrad (n) → microspores → pollen grains.**",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 5, reasoning_type: 'logical',
      prompt: "A pollen mother cell is diploid (2n). It undergoes one round of meiosis to produce a microspore tetrad. What is the ploidy of each of the four cells in that tetrad, and why?",
      options: [
        "Diploid (2n) — the cells simply copied the mother cell exactly, keeping its full chromosome set",
        "Haploid (n) — meiosis halves the chromosome number, so each of the four tetrad cells carries a single set",
        "Triploid (3n) — three sets combine during tetrad formation, the same way endosperm becomes triploid",
        "Tetraploid (4n) — because four cells are formed, the chromosome number is doubled",
      ],
      reveal: "Haploid. Meiosis is a reduction division: it takes one 2n cell and produces four cells each with half the chromosomes, so every microspore in the tetrad is n. The '4' in tetrad refers to the number of cells, not the chromosome count — a classic trap. Triploidy (3n) appears later in the chapter, but that's the endosperm after triple fusion, nothing to do with the tetrad here.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Pollen Grain — A Two-Layered, Two-Celled Package',
      objective: "By the end of this you can label every part of a mature pollen grain and explain what each layer and cell does.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "A pollen grain is the **male gametophyte** of a flowering plant — the tiny yellowish powder you find on your fingers after touching an open Hibiscus flower. Most are **spherical**, measuring about **25–50 micrometres** across, and each has a prominent **two-layered wall**.\n\nThe **outer layer is the exine**, made of the tough sporopollenin from the fun fact above. It isn't a smooth shell — it carries distinct apertures called **germ pores**, spots where sporopollenin is simply absent. The **inner layer is the intine**, a thin, continuous layer of **cellulose and pectin**, wrapping a plasma membrane around the cytoplasm.\n\nWhen the grain is mature it holds **two cells**. The **vegetative cell** is the bigger one, with plenty of stored food and a **large, irregularly shaped nucleus**. Floating inside its cytoplasm is the small, spindle-shaped **generative cell**, with dense cytoplasm and its own nucleus — the cell destined to make the two male gametes.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'A mature two-celled pollen grain in section, showing exine, germ pore, intine, vegetative cell and generative cell',
      caption: '📸 Tap each dot to explore the parts of a mature pollen grain (Figure 1.5b)',
      hotspots: [
        { id: uuid(), x: 0.50, y: 0.08, label: 'Exine (sporopollenin)', icon: 'circle',
          detail: 'The **hard outer wall**, built from **sporopollenin** — resistant to high heat, strong acid and alkali, and undigested by any known enzyme. This is why pollen survives as fossils.' },
        { id: uuid(), x: 0.88, y: 0.42, label: 'Germ pore', icon: 'circle',
          detail: 'An **aperture in the exine where sporopollenin is absent**. Later, the pollen tube grows out through one of these germ pores.' },
        { id: uuid(), x: 0.16, y: 0.60, label: 'Intine', icon: 'circle',
          detail: 'The **thin, continuous inner wall** made of **cellulose and pectin**, lying just inside the exine and surrounding the plasma membrane.' },
        { id: uuid(), x: 0.44, y: 0.66, label: 'Vegetative cell (large nucleus)', icon: 'circle',
          detail: 'The **bigger** of the two cells — rich in **food reserves**, with a **large, irregularly shaped nucleus**. It fuels the growth of the pollen tube.' },
        { id: uuid(), x: 0.62, y: 0.44, label: 'Generative cell', icon: 'circle',
          detail: 'The **small, spindle-shaped cell** floating in the vegetative cell’s cytoplasm. It divides mitotically to form the **two male gametes**.' },
      ],
      generation_prompt: "Scientific textbook illustration of a mature two-celled pollen grain in section. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A single large spherical pollen grain drawn in cross-section, clean white outlines. The outermost wall is a thick, slightly sculptured layer (the exine) shown in warm tan/brown, interrupted at a few points by small gaps (germ pores). Just inside it, a thin continuous pale layer (the intine) drawn in light purple. The interior cytoplasm holds two cells: one large cell filling most of the grain with a big, irregular white-outlined nucleus (the vegetative cell), and one small spindle-shaped cell with dense purple fill and its own nucleus floating within the larger cell's cytoplasm (the generative cell). Biologically accurate proportions, no baked-in text labels, no leader lines, no photorealism, no cartoon, matches standard biology textbook illustration conventions.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: '2-Celled vs 3-Celled Pollen at Shedding',
      columns: [
        { heading: '2-Celled Stage (over 60% of angiosperms)', points: [
          'Shed while still holding a vegetative cell + a generative cell',
          'The generative cell has NOT yet divided',
          'Male gametes are formed later — the generative cell divides during pollen tube growth',
          'This is the more common condition',
        ] },
        { heading: '3-Celled Stage (the remaining species)', points: [
          'Generative cell divides mitotically BEFORE the pollen is shed',
          'Shed with a vegetative cell + two male gametes already present',
          'Male gametes are carried by the pollen tube from the very start',
          'Less common than the 2-celled condition',
        ] },
      ],
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'The Facts You Cannot Blur',
      markdown: "- **PMC is 2n; the microspore tetrad is n** — meiosis halves the number.\n- **Exine = sporopollenin (outer, hard); Intine = cellulose + pectin (inner, thin).**\n- **Germ pores are gaps in the exine** where sporopollenin is missing — the pollen tube exits here.\n- **Vegetative cell = bigger, food-rich, large irregular nucleus. Generative cell = smaller, spindle-shaped, makes the male gametes.**\n- **Over 60% of angiosperms shed pollen at the 2-celled stage.**",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Sporopollenin:** the single most-tested fact on this page. NEET wants you to know it is the most resistant organic material, resists high temperature + strong acid + strong alkali, is **not** degraded by any enzyme, and preserves pollen as fossils. It makes up the **exine**, never the intine.\n\n**Intine composition:** cellulose and pectin — do not swap it with the exine's sporopollenin.\n\n**Pollen allergy:** *Parthenium* (carrot grass), which entered India as a contaminant with imported wheat, causes pollen allergy, asthma and bronchitis — a favourite one-liner.\n\n**Classic NEET question:** \"The pollen grains of over 60% of angiosperms are shed at which stage?\" → the **2-celled stage** (a vegetative cell and a generative cell).",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "Once shed, a pollen grain is racing a clock — it must reach a stigma before it loses viability (30 minutes in rice and wheat; months in some others), and viable pollen can even be banked for years in liquid nitrogen at −196 °C. But the grain doesn't move on its own. Next, we follow the female side of the flower — the pistil, the ovule, and the embryo sac.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which layer of the pollen grain wall is made up of sporopollenin?',
          options: ['Intine', 'Exine', 'Tapetum', 'Plasma membrane'],
          correct_index: 1,
          explanation: "The exine is the hard outer wall built from sporopollenin. The intine is the thin inner wall of cellulose and pectin; the tapetum is a wall layer of the microsporangium that nourishes developing pollen (not part of the grain's own wall); and the plasma membrane simply encloses the cytoplasm inside the intine.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Arrange these in the correct developmental sequence: microspore tetrad, pollen mother cell, sporogenous tissue, pollen grain.',
          options: [
            'Pollen mother cell → sporogenous tissue → microspore tetrad → pollen grain',
            'Sporogenous tissue → microspore tetrad → pollen mother cell → pollen grain',
            'Sporogenous tissue → pollen mother cell → microspore tetrad → pollen grain',
            'Microspore tetrad → pollen mother cell → sporogenous tissue → pollen grain',
          ],
          correct_index: 2,
          explanation: "Sporogenous tissue sits in the microsporangium centre; each of its cells acts as a pollen mother cell, which undergoes meiosis to give a microspore tetrad, and the microspores then mature into pollen grains. The tempting wrong order puts the tetrad before the pollen mother cell, but meiosis of the PMC is what creates the tetrad in the first place.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'In a pollen grain shed at the 3-celled stage, which cell has already divided, and what has it produced?',
          options: [
            'The vegetative cell has divided to produce two vegetative cells',
            'The vegetative cell has divided to produce the generative cell and a tube cell',
            'The generative cell has divided to produce two vegetative cells',
            'The generative cell has divided mitotically to produce two male gametes',
          ],
          correct_index: 3,
          explanation: "At the 3-celled stage the generative cell divides mitotically before shedding, giving a vegetative cell plus two male gametes. The vegetative cell does not divide to make gametes — it is the generative cell that does, and its products are male gametes, not more vegetative cells.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Why are pollen grains so well preserved as fossils for millions of years?',
          options: [
            'The exine is made of sporopollenin, which resists high temperature, acids and alkalis and is degraded by no known enzyme',
            'The intine of cellulose and pectin hardens into stone over time',
            'The germ pores seal shut completely, locking out all decay',
            'The vegetative cell’s food reserves keep the grain alive indefinitely',
          ],
          correct_index: 0,
          explanation: "Sporopollenin in the exine is one of the most resistant organic materials known and no enzyme degrades it, so the wall survives long after everything else decays. The intine is thin and made of ordinary cellulose and pectin (not stone), germ pores are gaps rather than seals, and food reserves cannot keep a shed grain alive for millions of years.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
