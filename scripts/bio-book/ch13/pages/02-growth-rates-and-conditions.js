'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'growth-rates-and-conditions',
  title: 'Growth Rates & Conditions for Growth',
  subtitle: "A root that gets longer at a steady pace and a plant that starts slow then races ahead are following two different rules of growth. Learn to tell them apart by their curves and their formulas — and what water, oxygen and food have to do with any of it.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['plant-growth-and-development', 'growth-rate'],
  glossary: [
    { term: 'growth rate', definition: 'The increased growth per unit time. It can follow one of two patterns — arithmetic or geometric.' },
    { term: 'arithmetic growth', definition: 'A pattern where, after a cell divides, only one daughter cell keeps dividing while the other matures — so growth increases at a constant rate and plots as a straight (linear) line. Expressed as Lt = L0 + rt.' },
    { term: 'geometric growth', definition: 'A pattern where both daughter cells keep dividing, so growth starts slow, then speeds up exponentially, then slows again — plotting as an S-shaped (sigmoid) curve.' },
    { term: 'lag phase', definition: 'The early stage of geometric growth when growth is slow.' },
    { term: 'log (exponential) phase', definition: 'The stage of geometric growth when growth becomes rapid, increasing at an exponential rate.' },
    { term: 'stationary phase', definition: 'The final stage of geometric growth, when a limited nutrient supply makes growth slow down and level off.' },
    { term: 'sigmoid curve', definition: 'The S-shaped curve you get when you plot geometric growth against time. It is the characteristic curve of a living organism growing in a natural environment.' },
    { term: 'relative growth rate', definition: 'The growth of a system per unit time expressed on a common basis, e.g. per unit of its initial size. The r in W1 = W0 e^rt, it also measures a plant’s efficiency index — its ability to produce new plant material.' },
    { term: 'absolute growth rate', definition: 'The measurement and comparison of total growth per unit time, without dividing by initial size.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A young plant seedling and a long straight root shown against a dark background, with two faint glowing curves — one straight, one S-shaped — suggested behind them',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single young green seedling with a long pale root rises from dark soil on the left, softly side-lit. Behind it, faint and out of focus in the darkness, two glowing translucent line shapes are suggested — one a straight rising line, the other a gentle S-shaped rising curve — like the ghost of a graph, without any axes, numbers or text. Deep shadows fill the rest of the frame, warm subtle highlights on the leaf and root. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Two Plants, Two Completely Different Growth Stories',
      markdown: "Watch a root push down into the soil and it lengthens at a steady, unhurried pace — the same amount added, day after day. Now watch a whole plant colony: it barely moves at first, then suddenly shoots up fast, then eases off again. Same word, “growth,” but two totally different shapes. NCERT gives each one its own name, its own graph, and its own formula — and NEET loves to check whether you can tell which is which.",
    },
    // ── 2 · Core concept — what growth rate means ───────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Start with the plain definition. **Growth rate** is the **increased growth per unit time** — how much extra growth you get for each slice of time that passes. Because it is a “per unit time” quantity, it can be written down as a mathematical expression.\n\nAn organism, or a part of one, can add new cells in more than one way — so the growth rate can climb in two different patterns. NCERT calls them **arithmetic** and **geometrical** growth. The difference between them comes down to one thing: after a cell divides, do **both** new daughter cells keep dividing, or does only **one** of them carry on?",
    },
    // ── 3 · Heading — arithmetic & geometric ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Arithmetic & Geometric Growth',
      objective: "By the end of this you can decide, for any growing part, whether it is following arithmetic or geometric growth — from how its cells divide, the shape of its curve, and its formula.",
    },
    // ── 4 · Text — arithmetic then geometric ────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "In **arithmetic growth**, after a cell finishes **mitotic cell division**, **only one** of the two daughter cells continues to divide. The **other** daughter cell stops dividing — it **differentiates and matures**. The simplest real example is a **root elongating at a constant rate**. If you plot the **length of the organ against time**, you get a straight line — a **linear curve**. In symbols:\n\n**Lt = L0 + rt**\n\nwhere **Lt** = length at time ‘t’, **L0** = length at time ‘zero’, and **r** = the growth rate, i.e. the elongation per unit time.\n\nNow look at **geometrical growth**. Here, after mitotic cell division, **both** progeny cells **keep the ability to divide** and go on doing so. So the growth starts **slow** — this early stretch is the **lag phase**. Then it speeds up sharply, increasing at an **exponential rate** — the **log (or exponential) phase**. But nutrients are not unlimited: with a **limited nutrient supply**, the growth eventually **slows down**, giving a **stationary phase**. Plot this against time and you get a **sigmoid**, or **S-shaped**, curve. That sigmoid curve is the characteristic curve of a **living organism growing in a natural environment** — typical for all the cells, tissues and organs of a plant.\n\nThe exponential (geometric) growth is written as:\n\n**W1 = W0 e^{rt}**\n\nwhere **W1** = final size (weight, height, number, etc.), **W0** = initial size at the start of the period, **r** = growth rate, **t** = time of growth, and **e** = the base of natural logarithms. Here **r** is the **relative growth rate** — it also measures the plant’s ability to produce new plant material, which is why it’s called the **efficiency index**. So the final size **W1** depends on the initial size **W0**.",
    },
    // ── 5 · Comparison card — arithmetic vs geometric ───────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 5,
      title: 'Arithmetic vs Geometric Growth',
      columns: [
        {
          heading: 'Arithmetic growth',
          points: [
            'After mitosis, only ONE daughter cell keeps dividing; the other differentiates and matures.',
            'Growth increases at a constant rate.',
            'Plotting length against time gives a straight, linear curve.',
            'Formula: Lt = L0 + rt (Lt = length at time t, L0 = length at time 0, r = growth rate).',
            'Example: a root elongating at a constant rate.',
          ],
        },
        {
          heading: 'Geometric growth',
          points: [
            'After mitosis, BOTH progeny cells keep the ability to divide and continue dividing.',
            'Slow at first (lag phase), then rapid/exponential (log phase), then slows with limited nutrients (stationary phase).',
            'Plotting growth against time gives a sigmoid (S-shaped) curve.',
            'Formula: W1 = W0 e^{rt} (W1 = final size, W0 = initial size, r = growth rate, t = time, e = base of natural logs).',
            'The sigmoid curve is characteristic of living organisms growing in a natural environment.',
          ],
        },
      ],
    },
    // ── 6 · Interactive image — sigmoid growth curve ────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 6, src: '',
      alt: 'An idealised sigmoid (S-shaped) growth curve plotting size or weight of an organ against time, marked with lag phase, exponential phase and stationary phase, with a straight linear arithmetic curve shown faintly for contrast',
      caption: '📸 Tap each dot to explore the stages of the sigmoid growth curve — and how it differs from the straight arithmetic line.',
      generation_prompt: "Scientific textbook illustration of an idealised sigmoid (S-shaped) growth curve, in the style of NCERT Figure 13.6. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A single graph: vertical axis labelled 'Size / weight of the organ', horizontal axis labelled 'Time', both as thin white lines with small white arrowheads. The main plotted line is a smooth S-shaped (sigmoid) curve in green: a shallow slow-rising start at the lower left, a steep rapidly-rising middle section, then flattening off along the top right. A second, fainter, straight diagonal white line rises from the origin for contrast (the arithmetic/linear curve). Clean white outlines, labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.18, y: 0.82, label: 'Lag phase', detail: 'The early part of the S-curve, at the lower left. Growth here is **slow** — the plant is only just getting going.', icon: 'circle' },
        { id: uuid(), x: 0.48, y: 0.5, label: 'Log (exponential) phase', detail: 'The steep middle of the curve. Growth becomes **rapid**, increasing at an **exponential rate**, because **both** daughter cells from each division keep dividing.', icon: 'circle' },
        { id: uuid(), x: 0.82, y: 0.2, label: 'Stationary phase', detail: 'The flattened top-right of the curve. With a **limited nutrient supply**, growth **slows down** and levels off.', icon: 'circle' },
        { id: uuid(), x: 0.62, y: 0.28, label: 'The sigmoid (S) shape', detail: 'The full S-shaped curve. It is the **characteristic** curve of a **living organism growing in a natural environment**, and is typical of all cells, tissues and organs of a plant. Its formula is **W1 = W0 e^{rt}**.', icon: 'circle' },
        { id: uuid(), x: 0.7, y: 0.62, label: 'The arithmetic line (for contrast)', detail: 'The faint straight diagonal line. This is **arithmetic growth** — a **linear curve** from plotting length against time, following **Lt = L0 + rt** (e.g. a root elongating at a constant rate).', icon: 'circle' },
        { id: uuid(), x: 0.06, y: 0.4, label: 'The axes', detail: 'The vertical axis is the **size or weight** of the organ; the horizontal axis is **time**. Every growth curve here is size/weight plotted against time.', icon: 'circle' },
      ],
    },
    // ── 7 · Heading — absolute vs relative ──────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Absolute vs Relative Growth Rate',
      objective: "By the end of this you can explain why two leaves that add the exact same area can still have very different growth rates — and which measure captures that difference.",
    },
    // ── 8 · Text — absolute vs relative ─────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "There are two fair ways to compare how fast living systems grow.\n\nThe first is the **absolute growth rate**: you simply **measure and compare the total growth per unit time**. How much was added, full stop.\n\nThe second is the **relative growth rate**: you take the growth of the system per unit time and express it **on a common basis** — for example, **per unit of initial size** (its starting parameter).\n\nWhy have two? Picture NCERT’s two leaves, **A** and **B**, that start at **different sizes**. In a given time, **both add the same area** — say both grow by the same 5 cm² to become leaves **A1** and **B1**. Measured absolutely, they grew equally. But relative to how big each one started, **one of them shows a much higher relative growth rate** — the smaller leaf, because that same 5 cm² is a bigger jump compared to the little it started with. So absolute growth can look identical while relative growth is very different.",
    },
    // ── 9 · Comparison card — absolute vs relative ──────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Absolute vs Relative Growth Rate',
      columns: [
        {
          heading: 'Absolute growth rate',
          points: [
            'Measurement and comparison of TOTAL growth per unit time.',
            'Not divided by the starting size.',
            'Two leaves that both add 5 cm² have the same absolute growth rate.',
          ],
        },
        {
          heading: 'Relative growth rate',
          points: [
            'Growth per unit time expressed on a COMMON basis, e.g. per unit initial size.',
            'Takes the starting size into account.',
            'Of two leaves that both add 5 cm², the one that started smaller shows a much higher relative growth rate.',
          ],
        },
      ],
    },
    // ── 10 · Heading — conditions for growth ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'Conditions for Growth',
      objective: "By the end of this you can list what a plant must have to grow, and say what each one actually does for the growing cell.",
    },
    // ── 11 · Text — conditions ──────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "What does a plant actually need before it can grow? NCERT lists **water, oxygen and nutrients** as the very essential elements, and each has a specific job.\n\n- **Water.** Plant cells grow in size by **cell enlargement**, and cell enlargement **requires water**. The **turgidity** of cells helps in **extension growth**, so growth and development are tightly linked to the plant’s **water status**. Water also provides the **medium for the enzyme activities** that growth needs.\n- **Oxygen.** Oxygen helps in **releasing the metabolic energy** essential for growth activities.\n- **Nutrients.** The **macro and micro essential elements** are needed to build **protoplasm** and to act as a **source of energy**.\n\nBeyond these three, every plant has an **optimum temperature range** best suited for its growth — stray outside it and growth suffers, which can be detrimental to survival. And environmental signals such as **light** and **gravity** also affect certain phases and stages of growth.",
    },
    // ── 12 · Reasoning prompt — mid-page check ──────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 12, reasoning_type: 'logical',
      prompt: "A biologist watches a growing part and notes: “After each division, both daughter cells keep dividing; growth is slow at first, then rapid, then slows as nutrients run low.” Which single statement correctly names this growth and its curve?",
      options: [
        "This is geometric growth, and plotting it against time gives a sigmoid (S-shaped) curve.",
        "This is arithmetic growth, and plotting it against time gives a linear (straight-line) curve.",
        "This is geometric growth, but plotting it against time gives a linear (straight-line) curve.",
        "This is arithmetic growth, and it follows the formula Lt = L0 + rt.",
      ],
      reveal: "Option 1 is right. The tell-tale sign is that BOTH daughter cells keep dividing, together with the slow → rapid → slowing pattern (lag, log, stationary phases) — that is exactly NCERT’s geometric growth, and geometric growth plots as a sigmoid, S-shaped curve. Option 2 and Option 4 name arithmetic growth, but in arithmetic growth only ONE daughter cell keeps dividing (the other matures) and the curve is a straight line, Lt = L0 + rt — that doesn’t match what was observed. Option 3 keeps the correct name (geometric) but pairs it with the wrong curve: geometric growth is sigmoid, not linear.",
      difficulty_level: 2,
    },
    // ── 13 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Growth rate** = increased growth per unit time.\n- **Arithmetic growth:** only ONE daughter cell keeps dividing → **linear** curve → **Lt = L0 + rt**. Example: a root elongating at a constant rate.\n- **Geometric growth:** BOTH daughter cells keep dividing → **sigmoid / S-curve** → **W1 = W0 e^{rt}**. Here **r** = relative growth rate = efficiency index.\n- The three phases of geometric growth, in order: **lag → log (exponential) → stationary** (stationary comes from limited nutrients).\n- The **sigmoid curve** is characteristic of a living organism growing in a **natural environment**.\n- **Absolute growth rate** = total growth per unit time. **Relative growth rate** = growth per unit time on a common basis (e.g. per unit initial size) — smaller starting size can mean higher relative growth for the same absolute gain.\n- **Conditions for growth:** water, oxygen, nutrients — plus an optimum temperature range and signals like light and gravity.",
    },
    // ── 14 · Exam tip ───────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Match the growth type to its curve and formula — the single most-tested pairing:** arithmetic → linear curve → Lt = L0 + rt; geometric → sigmoid (S) curve → W1 = W0 e^{rt}. Swapping either the curve or the formula is the classic trap.\n\n**One-daughter vs both-daughters is the giveaway:** arithmetic = only one daughter cell keeps dividing; geometric = both do. Learn it by the cells, not just the picture.\n\n**Know your r:** in W1 = W0 e^{rt}, r is the **relative growth rate**, also called the **efficiency index**.\n\n**Classic NEET question:** “The growth curve typical of a living organism growing in a natural environment is ____.” → the **sigmoid (S-shaped)** curve.",
    },
    // ── 15 · Bridge text ────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "You can now tell arithmetic from geometric growth by their cells, curves and formulas, separate absolute from relative growth rate, and list what a plant needs to grow at all. Next, you’ll follow what happens to a cell once it stops just multiplying and starts becoming something specific — differentiation, dedifferentiation, redifferentiation, and how they add up to development.",
    },
    // ── 16 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "In arithmetic growth, what happens to the two daughter cells after a mitotic division?",
          options: [
            "Only one daughter cell continues to divide, while the other differentiates and matures",
            "Both daughter cells continue to divide and retain the ability to do so",
            "Both daughter cells stop dividing and differentiate immediately",
            "One daughter cell dies and the other divides at an exponential rate",
          ],
          correct_index: 0,
          explanation: "In arithmetic growth only ONE daughter cell keeps dividing; the other one differentiates and matures — that is why growth stays at a constant rate and plots as a straight line. Both daughters continuing to divide (option 2) is geometric growth, not arithmetic. Options 3 and 4 describe patterns NCERT never states for arithmetic growth.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which curve is obtained when geometric (exponential) growth is plotted against time, and why is it important?",
          options: [
            "A linear curve, because growth is added at a constant rate",
            "A sigmoid (S-shaped) curve, which is characteristic of a living organism growing in a natural environment",
            "A sigmoid (S-shaped) curve, which is characteristic only of dead or dividing cells in a laboratory",
            "A straight vertical line, because growth increases at an exponential rate throughout",
          ],
          correct_index: 1,
          explanation: "Geometric growth passes through a slow lag phase, a rapid log phase, and a levelling stationary phase, so plotted against time it gives a sigmoid (S-shaped) curve — and NCERT stresses this curve is characteristic of a living organism growing in a natural environment. A linear curve (option 1) belongs to arithmetic growth. Option 3 misstates who shows it, and option 4 ignores the lag and stationary phases that give the curve its S shape.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In the exponential growth equation W1 = W0 e^{rt}, what does r represent?",
          options: [
            "The initial size of the organ at the start of the period",
            "The base of natural logarithms",
            "The relative growth rate, also called the efficiency index",
            "The total time of growth",
          ],
          correct_index: 2,
          explanation: "In W1 = W0 e^{rt}, r is the relative growth rate, which NCERT also calls the efficiency index — the measure of the plant's ability to produce new plant material. W0 is the initial size (option 1), e is the base of natural logarithms (option 2), and t is the time of growth (option 4).",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Two leaves, A and B, start at different sizes but both increase their area by exactly 5 cm² in the same time. What can you correctly say about their growth rates?",
          options: [
            "They have the same absolute growth rate, but the smaller leaf has the higher relative growth rate",
            "They have the same relative growth rate, because both added 5 cm²",
            "The larger leaf has the higher relative growth rate, because it holds more total area",
            "Absolute and relative growth rate are the same thing, so both leaves grew identically in every sense",
          ],
          correct_index: 0,
          explanation: "Both leaves added the same total area (5 cm²) in the same time, so their absolute growth rates are equal. But relative growth rate is measured on a common basis such as per unit initial size, so the leaf that started smaller shows the higher relative growth rate — the same 5 cm² is a bigger jump relative to its starting size. That is exactly why NCERT distinguishes the two measures, ruling out options 2, 3 and 4.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
