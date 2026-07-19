'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-calvin-cycle',
  title: 'The Biosynthetic Phase — the Calvin Cycle',
  subtitle: "The light reaction handed over ATP and NADPH. Now watch a plant spend them: six turns of one repeating cycle that grabs CO2 from thin air and builds a molecule of sugar — the exact ATP/NADPH budget NEET makes you count.",
  page_number: 8,
  page_type: 'lesson',
  tags: ['photosynthesis-in-higher-plants', 'calvin-cycle'],
  glossary: [
    { term: 'biosynthetic phase', definition: 'The phase of photosynthesis in which sugars are synthesised. It does not directly need light, but it needs the products of the light reaction (ATP and NADPH), along with CO2 and H2O.' },
    { term: '3-phosphoglyceric acid (PGA)', definition: 'A 3-carbon organic acid — the first product formed when CO2 is fixed in the Calvin cycle. Plants whose first fixation product is this C3 acid follow the C3 pathway.' },
    { term: 'oxaloacetic acid (OAA)', definition: 'A 4-carbon organic acid — the first stable product of CO2 fixation in a second group of plants, which therefore follow the C4 pathway.' },
    { term: 'ribulose bisphosphate (RuBP)', definition: 'A 5-carbon ketose sugar. It is the primary acceptor of CO2 in the Calvin cycle — the molecule onto which CO2 is fixed.' },
    { term: 'RuBisCO', definition: 'RuBP carboxylase-oxygenase — the enzyme that fixes CO2 onto RuBP. It is called carboxylase-oxygenase because it also has an oxygenation activity.' },
    { term: 'carboxylation', definition: 'The fixation of CO2 into a stable organic intermediate — CO2 is added to RuBP by RuBisCO, forming two molecules of 3-PGA. The most crucial step of the Calvin cycle.' },
    { term: 'reduction', definition: 'The series of Calvin-cycle reactions that lead to the formation of glucose, using 2 ATP for phosphorylation and 2 NADPH for reduction per CO2 molecule fixed.' },
    { term: 'regeneration', definition: 'The stage in which the CO2 acceptor RuBP is formed again so the cycle can continue, requiring 1 ATP for phosphorylation.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A leaf in soft dark light, with a faint circular loop of glowing green suggested inside it, hinting at a cycle turning over and over',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single green leaf rests in a dim, naturalistic setting, softly backlit so its veins glow faintly. Suggested within the leaf's interior is a very subtle circular loop of soft green light, like the trace of something turning around and around, without becoming a literal labelled diagram or any text. Deep shadows fill the rest of the frame, warm dark tones throughout (#0a0a0a base). Painterly, atmospheric illustration style, dark background, no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Cycle That Runs After the Lights Go Out',
      markdown: "Switch off the light on a photosynthesising plant and something strange happens: the sugar-building keeps going — for a little while — and *then* stops. Switch the light back on, and it starts again. That short window of \"still working in the dark\" is the clue that this phase doesn't need light itself. It needs the two things the light reaction just made: **ATP** and **NADPH**. It burns through the stock, runs dry, and waits for the light reaction to refill it.",
    },
    // ── 2 · Core concept — the biosynthetic phase and what fuels it ─────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The light reaction made three products: **ATP**, **NADPH**, and **O2**. The **O2 simply diffuses out** of the chloroplast — the plant is done with it. The other two, **ATP and NADPH, are put straight to work**: they drive the reactions that build food, more precisely **sugars**. This sugar-making stage is the **biosynthetic phase** of photosynthesis.\n\nHere's the part students get wrong. The biosynthetic phase **does not directly depend on light**. What it depends on are the **products of the light reaction — ATP and NADPH — plus CO2 and H2O**. That's why the old name \"dark reaction\" is a bit of a trap: it isn't happening *because* it's dark, and it isn't the light being switched off that runs it. It's simply the second half, spending what the first half earned.",
    },
    // ── 3 · Heading — Calvin, PGA, and the acceptor ─────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The First Product, and the Surprise Acceptor',
      objective: "By the end of this you can name the first product of CO2 fixation (a 3-carbon acid, PGA), say what separates C3 plants from C4 plants, and state the one molecule that actually grabs CO2 — the 5-carbon RuBP.",
    },
    // ── 4 · Text — Calvin, 14C, PGA, C3 vs C4 ───────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Just after World War II, scientists began putting radioisotopes to good use, and **Melvin Calvin's** work stands out. Using **radioactive 14C** in algal photosynthesis, he traced exactly where the carbon went after CO2 was fixed — and found that the **first product of CO2 fixation was a 3-carbon organic acid: 3-phosphoglyceric acid, or PGA**. Calvin also worked out the full pathway, which is why it carries his name — the **Calvin cycle**.\n\nScientists then checked whether *every* plant makes PGA first. It turned out a second group of plants makes a different first stable product — a **4-carbon acid, oxaloacetic acid (OAA)**. So CO2 fixation splits into two types: plants whose first product is the **C3 acid PGA** follow the **C3 pathway**; plants whose first product is the **C4 acid OAA** follow the **C4 pathway**.",
    },
    // ── 5 · Text — the primary acceptor of CO2 (11.7.1) ─────────────────────
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "Now a fair question: if fixing CO2 gives a 3-carbon PGA, how many carbons must the *acceptor* — the molecule that catches the CO2 — already have? The scientists themselves guessed wrong. They reasoned the first product had 3 carbons, so the acceptor should be a small **2-carbon** compound, and they spent **years** hunting for it.\n\nThe answer, unexpectedly, was much bigger: the acceptor is a **5-carbon ketose sugar — ribulose bisphosphate (RuBP)**. This is the **primary acceptor of CO2**. Don't try to make the arithmetic \"5 + 1 CO2 = 3\" work in your head — the fixation immediately splits the product into two molecules of the 3-carbon PGA, which is the next thing we'll see.",
    },
    // ── 6 · Heading — the three stages ──────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Calvin Cycle — Three Stages, One Loop',
      objective: "By the end of this you can walk the cycle in order — carboxylation, reduction, regeneration — say what each stage does, and say which stage spends ATP and which spends both ATP and NADPH.",
    },
    // ── 7 · Text — the cycle runs everywhere; the three stages ──────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "One thing to fix firmly: the **Calvin cycle occurs in all photosynthetic plants** — it makes no difference whether the plant is a C3 or a C4 plant. Both run it. It runs as a **loop** because the acceptor, RuBP, is used up and then made again, so the cycle can keep turning.\n\nIt is described in **three stages**:\n\n1. **Carboxylation** — the fixation of CO2 onto RuBP. This is the **most crucial step** of the cycle. The enzyme **RuBisCO (RuBP carboxylase-oxygenase)** attaches CO2 to the 5-carbon RuBP, and the result splits into **two molecules of 3-PGA**. (The enzyme is called carboxylase-*oxygenase* because it also has an oxygenation activity.)\n2. **Reduction** — a series of reactions that build **sugar (glucose)**. Per CO2 molecule fixed, this stage spends **2 ATP** (for phosphorylation) and **2 NADPH** (for reduction).\n3. **Regeneration** — the CO2 acceptor **RuBP is made again** so the loop doesn't break. This costs **1 ATP** (for phosphorylation).",
    },
    // ── 8 · Interactive image — the Calvin cycle (Figure 11.8 style) ────────
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'A circular diagram of the Calvin cycle: RuBP accepts CO2 at carboxylation, forming 3-PGA, which is reduced using ATP and NADPH into triose phosphate/sugar, and RuBP is then regenerated using ATP, closing the loop',
      caption: '📸 Tap each dot to walk one turn of the Calvin cycle — see where CO2 goes in, where ATP and NADPH are spent, and how RuBP is rebuilt.',
      generation_prompt: "Scientific textbook illustration of the Calvin cycle drawn as a clockwise circular loop. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, labels in white text with thin white leader lines. At the top, CO2 + H2O entering from the atmosphere joining a 5-carbon molecule labelled ribulose-1,5-bisphosphate (RuBP), coloured green, at a step labelled 'Carboxylation'. The loop then leads to a 3-carbon molecule labelled 3-phosphoglycerate (3-PGA). Next, a 'Reduction' step marked with ATP and NADPH being consumed (small arrows in), leading to triose phosphate, with sucrose/starch branching off as the sugar product. Then a 'Regeneration' arc consuming one ATP, returning to RuBP to close the cycle. Show ADP + Pi + NADP+ leaving as small out-arrows. Green for the sugar/carbon molecules, no photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.12, label: 'CO2 enters', detail: "CO2 (with H2O) comes in from the atmosphere and joins the cycle here. This single carbon atom is what the whole cycle is built to capture and turn into sugar.", icon: 'circle' },
        { id: uuid(), x: 0.28, y: 0.35, label: 'RuBP — the acceptor (5C)', detail: "**Ribulose bisphosphate (RuBP)**, a 5-carbon ketose sugar, is the **primary acceptor of CO2**. It's the molecule that catches the incoming CO2.", icon: 'circle' },
        { id: uuid(), x: 0.62, y: 0.34, label: '1 · Carboxylation (RuBisCO)', detail: "The **most crucial step**. The enzyme **RuBisCO** fixes CO2 onto RuBP. The product splits into **two molecules of 3-PGA**.", icon: 'circle' },
        { id: uuid(), x: 0.74, y: 0.55, label: '3-PGA — first product (3C)', detail: "**3-phosphoglyceric acid**, a 3-carbon acid — the **first product** of CO2 fixation. Plants whose first product is this C3 acid are called C3 plants.", icon: 'circle' },
        { id: uuid(), x: 0.6, y: 0.75, label: '2 · Reduction (ATP + NADPH)', detail: "A series of reactions that build sugar. Per CO2 fixed, this stage spends **2 ATP** for phosphorylation and **2 NADPH** for reduction.", icon: 'circle' },
        { id: uuid(), x: 0.4, y: 0.82, label: 'Triose phosphate → sugar', detail: "The reduction step forms triose phosphate, from which **glucose** (and sucrose/starch) is built — the food the plant was working toward.", icon: 'circle' },
        { id: uuid(), x: 0.2, y: 0.6, label: '3 · Regeneration (1 ATP)', detail: "The acceptor **RuBP is made again** using **1 ATP**, so the loop can keep turning uninterrupted.", icon: 'circle' },
      ],
    },
    // ── 9 · Table — the three stages ────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 9,
      caption: 'The three stages of the Calvin cycle, and what each one spends (per CO2 fixed)',
      headers: ['Stage', 'What happens', 'ATP / NADPH used'],
      rows: [
        ['1. Carboxylation', 'RuBisCO fixes CO2 onto the 5-carbon RuBP → two molecules of 3-PGA (most crucial step)', 'None used here'],
        ['2. Reduction', 'Series of reactions forming sugar (glucose) from 3-PGA', '2 ATP + 2 NADPH'],
        ['3. Regeneration', 'The CO2 acceptor RuBP is formed again so the cycle continues', '1 ATP'],
        ['Total per CO2', 'One CO2 fully processed through the loop', '3 ATP + 2 NADPH'],
      ],
    },
    // ── 10 · Worked example — the ATP/NADPH budget for one glucose ──────────
    {
      id: uuid(), type: 'worked_example', order: 10, variant: 'solved_example',
      label: 'Count the fuel: one full glucose',
      reveal_mode: 'tap_to_reveal',
      problem: "How many molecules of ATP and NADPH are needed to make **one molecule of glucose** through the Calvin cycle? (Use only the per-CO2 figures NCERT gives, and the fact that 6 CO2 must be fixed — 6 turns of the cycle — for one glucose.)",
      solution: "Work it out one CO2 at a time, then scale up.\n\n**Per CO2 molecule fixed:**\n- Reduction spends **2 ATP + 2 NADPH**\n- Regeneration spends **1 ATP**\n- So one CO2 costs **3 ATP + 2 NADPH**\n\n**For one glucose, 6 CO2 must be fixed (6 turns of the cycle):**\n- ATP: 3 × 6 = **18 ATP**\n- NADPH: 2 × 6 = **12 NADPH**\n\n**Answer: 18 ATP and 12 NADPH** are required to make one molecule of glucose.\n\nThis matches NCERT's IN/OUT box: **IN** = 6 CO2, 18 ATP, 12 NADPH; **OUT** = 1 glucose, 18 ADP, 12 NADP.",
    },
    // ── 11 · Reasoning prompt — the primary acceptor trap ───────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 11, reasoning_type: 'logical',
      prompt: "The scientists first assumed the CO2 acceptor must be small, because the first product (PGA) has only 3 carbons. But the real primary acceptor of CO2 in the Calvin cycle is which molecule?",
      options: [
        "A 2-carbon compound — because a small acceptor plus one CO2 would give the 3-carbon PGA",
        "3-phosphoglyceric acid (PGA), the 3-carbon acid",
        "Ribulose bisphosphate (RuBP), a 5-carbon ketose sugar",
        "Oxaloacetic acid (OAA), the 4-carbon acid",
      ],
      reveal: "The acceptor is **RuBP, a 5-carbon ketose sugar** (option 3). The 2-carbon guess (option 1) is exactly the wrong answer the scientists chased for years before discovering the 5-carbon RuBP — tempting because 2 + 1 CO2 = 3 seems to match PGA, but that's not how the fixation works (the product splits into two 3-carbon PGA molecules). PGA (option 2) is the first *product*, not the acceptor. OAA (option 4) is the first product of the C4 pathway, not the CO2 acceptor of the Calvin cycle.",
      difficulty_level: 2,
    },
    // ── 12 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Biosynthetic phase** builds sugars using **ATP + NADPH** (plus CO2 and H2O). It does **not** directly depend on light — only on the light reaction's products.\n- **First product** of CO2 fixation = **3-PGA**, a **3-carbon** acid → the **C3 pathway**. (In C4 plants the first product is the **4-carbon OAA**.)\n- **Primary acceptor** of CO2 = **RuBP**, a **5-carbon** ketose sugar.\n- Enzyme that fixes CO2 = **RuBisCO** (RuBP carboxylase-oxygenase).\n- **Three stages:** carboxylation → reduction → regeneration. Carboxylation is the **most crucial** step; it forms **two 3-PGA** molecules.\n- **Per CO2 fixed = 3 ATP + 2 NADPH.**\n- **Per glucose = 6 CO2, 6 turns, 18 ATP + 12 NADPH.**",
    },
    // ── 13 · Exam tip ───────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**The acceptor-vs-product swap is the #1 trap here.** The **primary acceptor of CO2** is **RuBP (5-carbon)**; the **first product** is **3-PGA (3-carbon)**. Examiners love mixing these up, and adding OAA (the C4 first product) as a fourth distractor.\n\n**Know the numbers cold:** per CO2 = **3 ATP + 2 NADPH**; per glucose (6 turns) = **18 ATP + 12 NADPH**. NEET has asked the per-glucose total directly.\n\n**Classic NEET question:** \"The primary acceptor of CO2 in the Calvin cycle is ___\" → **ribulose bisphosphate (RuBP)**, a 5-carbon ketose sugar — *not* PGA (that's the first product) and *not* OAA (that's the C4 first product).",
    },
    // ── 14 · Bridge text ────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "So far every plant we've discussed makes the 3-carbon PGA first — the C3 pathway. But we also met a second group whose first product is the 4-carbon OAA. Next you'll meet those **C4 plants** properly, and see the special leaf structure — **Kranz anatomy** — that lets them run photosynthesis a smarter way.",
    },
    // ── 15 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Why is it misleading to call the biosynthetic phase the 'dark reaction'?",
          options: [
            "Because it only happens at night, when the light reaction has stopped completely",
            "Because it does not directly depend on light — it depends on the light reaction's products (ATP and NADPH), plus CO2 and H2O",
            "Because it releases O2, which can only build up in darkness",
            "Because it needs light directly, just less of it than the light reaction does",
          ],
          correct_index: 1,
          explanation: "NCERT's point is that this phase doesn't run *because* it's dark — it runs on the **ATP and NADPH** made by the light reaction, plus CO2 and H2O. The proof: after light is removed the biosynthesis continues briefly (spending leftover ATP/NADPH) and then stops. It doesn't require night (option 1), O2 diffuses out rather than building up (option 3), and it does not directly need light at all (option 4).",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "In the Calvin cycle, what is the primary acceptor of CO2, and what is the first product of its fixation?",
          options: [
            "Acceptor: RuBP (5-carbon); first product: two molecules of 3-PGA (3-carbon)",
            "Acceptor: PGA (3-carbon); first product: RuBP (5-carbon)",
            "Acceptor: a 2-carbon compound; first product: PGA (3-carbon)",
            "Acceptor: OAA (4-carbon); first product: RuBP (5-carbon)",
          ],
          correct_index: 0,
          explanation: "The acceptor is the **5-carbon RuBP**, and CO2 fixation onto it gives **two molecules of the 3-carbon 3-PGA** — the first product. Option 2 swaps acceptor and product. Option 3 is the wrong 2-carbon guess scientists chased before finding RuBP. Option 4 uses OAA, which is the first product of the C4 pathway, not the Calvin-cycle acceptor.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which stage of the Calvin cycle is the fixation of CO2 onto RuBP by RuBisCO, and what does it directly produce?",
          options: [
            "Reduction — it produces triose phosphate using ATP and NADPH",
            "Regeneration — it rebuilds RuBP using one ATP",
            "Carboxylation — it produces two molecules of 3-PGA, and is the most crucial step",
            "Carboxylation — it produces one molecule of OAA, the C4 acid",
          ],
          correct_index: 2,
          explanation: "**Carboxylation** is the fixation of CO2 onto RuBP by RuBisCO, and it forms **two molecules of 3-PGA** — NCERT calls it the most crucial step. Reduction (option 1) and regeneration (option 2) are the later stages. Option 4 is wrong because carboxylation in the Calvin cycle makes 3-PGA, not OAA (OAA is the first product of the separate C4 pathway).",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "How many ATP and NADPH molecules are required to make one molecule of glucose through the Calvin cycle?",
          options: [
            "3 ATP and 2 NADPH",
            "6 ATP and 6 NADPH",
            "12 ATP and 18 NADPH",
            "18 ATP and 12 NADPH",
          ],
          correct_index: 3,
          explanation: "Per CO2 fixed, the cycle uses 3 ATP + 2 NADPH. One glucose needs 6 CO2 fixed (6 turns), so 3×6 = **18 ATP** and 2×6 = **12 NADPH** — matching NCERT's IN box. Option 1 is the per-CO2 figure, not per-glucose. Option 4's numbers are correct but option 3 flips them (a common careless swap of the two totals).",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
