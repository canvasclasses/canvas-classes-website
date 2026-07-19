'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'glycolysis',
  title: 'Glycolysis — Splitting Sugar',
  subtitle: "One six-carbon sugar walks into the cytoplasm and walks out as two three-carbon pyruvate molecules — the one respiration step every living thing on Earth shares. Learn exactly where ATP is spent, where it's earned, and where the cell picks up its NADH.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['respiration-in-plants', 'glycolysis'],
  glossary: [
    { term: 'glycolysis', definition: 'The breakdown of glucose into two molecules of pyruvic acid in the cytoplasm. From the Greek glycos (sugar) and lysis (splitting).' },
    { term: 'EMP pathway', definition: 'Another name for glycolysis, after the three scientists who worked out the scheme — Gustav Embden, Otto Meyerhof, and J. Parnas.' },
    { term: 'partial oxidation', definition: 'The incomplete breakdown of glucose in glycolysis — the glucose is only partly oxidised, ending at pyruvic acid rather than being fully broken down to CO2 and water.' },
    { term: 'pyruvic acid', definition: 'The three-carbon end product of glycolysis. Two molecules are formed from each glucose; what happens to it next depends on the cell\'s need.' },
    { term: 'invertase', definition: 'The enzyme that splits sucrose into glucose and fructose so these two monosaccharides can enter the glycolytic pathway.' },
    { term: 'hexokinase', definition: 'The enzyme that phosphorylates glucose and fructose to give glucose-6-phosphate at the start of glycolysis.' },
    { term: 'PGAL', definition: '3-phosphoglyceraldehyde — a three-carbon triose phosphate. When it is converted to BPGA, NADH + H+ is formed.' },
    { term: 'NADH + H+', definition: 'The reduced electron-carrier formed in glycolysis when two hydrogen atoms are removed from PGAL and transferred to NAD+.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single glowing six-sided sugar crystal splitting into two smaller halves inside the soft interior of a plant cell',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). Inside the soft, translucent interior of a living plant cell, a single warm-glowing six-sided sugar crystal is caught in the moment of splitting cleanly into two smaller identical halves that drift gently apart. Faint suggestions of the watery cytoplasm surround it, with soft green and amber highlights catching the edges of the splitting crystal. No text, no labels, no diagram arrows, no molecular formulae. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), deep shadows, subtle warm rim-lighting, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The One Step Every Living Thing Has in Common',
      markdown: "Bacteria, yeast, a mango tree, the muscle in your own arm — every living organism on this planet, without a single exception, breaks its glucose in the exact same way at the very start. That shared first step is **glycolysis**. And for organisms that live without oxygen, it isn't just the first step of respiration — **it's the only one they have.** No mitochondria, no Krebs cycle, nothing else. Just this.",
    },
    // ── 2 · Core concept — what glycolysis is ────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The word **glycolysis** comes from two Greek words: **glycos**, meaning sugar, and **lysis**, meaning splitting. So the name itself tells you the job — splitting sugar. The scheme of how it happens was worked out by three scientists — **Gustav Embden**, **Otto Meyerhof**, and **J. Parnas** — which is why glycolysis is also called the **EMP pathway** (their three initials).\n\nTwo facts about where and in whom it happens are worth burning in right now. Glycolysis occurs in the **cytoplasm** of the cell — not inside any organelle. And it is present in **all living organisms**, from the simplest bacterium upward. In the process, one molecule of glucose undergoes **partial oxidation** — it's only partly broken down — to form **two molecules of pyruvic acid**.",
    },
    // ── 3 · Heading — the pathway ─────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Pathway — Following One Glucose Down Ten Steps',
      objective: "By the end of this you can trace glucose through the pathway to pyruvate, and point to the exact steps where ATP is spent and where NADH is picked up.",
    },
    // ── 4 · Text — where glucose comes from + the phosphorylation steps ────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "In a plant, where does the glucose for glycolysis come from? Mostly from **sucrose** — the end product of photosynthesis — or from **storage carbohydrates**. Sucrose is split by the enzyme **invertase** into **glucose** and **fructose**, and these two monosaccharides readily enter the pathway.\n\nThe first thing that happens to glucose and fructose is that they get **phosphorylated** — a phosphate group is attached — to give **glucose-6-phosphate**, using the enzyme **hexokinase**. This glucose-6-phosphate then **isomerises** (rearranges) into **fructose-6-phosphate**. From here on, the steps for glucose and fructose are exactly the same. In all, a chain of **ten reactions**, each controlled by a different enzyme, carries glucose all the way down to pyruvate.\n\nAs you follow the diagram, keep your eye on three kinds of moments: where the cell **spends** ATP, where it **makes** ATP, and the one place where it picks up **NADH + H+**.",
    },
    // ── 5 · Interactive image — the glycolysis pathway ────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 4 + 1, src: '',
      alt: 'A vertical flow diagram of glycolysis, from glucose at the top down to two molecules of pyruvic acid at the bottom, marking each ATP and NADH step',
      caption: '📸 Tap each dot to follow glucose down to pyruvate — and see exactly where ATP is spent, where NADH is picked up, and where ATP is made.',
      generation_prompt: "Scientific textbook illustration of the glycolysis pathway as a clean vertical flow chart (Figure 12.1 style). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, labels in white text with thin white leader lines. Top to bottom, each molecule in its own rounded box connected by a downward arrow: Glucose (6C) at top; arrow labelled 'ATP used' to Glucose-6-phosphate (6C); arrow to Fructose-6-phosphate (6C); arrow labelled 'ATP used' to Fructose-1,6-bisphosphate (6C); this box splits into two boxes side by side, 3-phosphoglyceraldehyde/PGAL (3C) and dihydroxyacetone phosphate (3C); arrow from PGAL labelled 'NADH + H+ formed' down to 1,3-bisphosphoglycerate/BPGA (3C); arrow labelled 'ATP made' to 3-phosphoglyceric acid (3C); continuing down through phosphoenolpyruvate (PEP); final arrow labelled 'ATP made' to two molecules of Pyruvic acid (3C) at the bottom. Use functional colours: sugars in warm amber, phosphate labels in pale blue, ATP labels in green. Biologically accurate carbon counts shown. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.06, label: 'Glucose (6C)', detail: "The six-carbon sugar that starts everything. In plants it comes from **sucrose** (split by invertase) or from storage carbohydrates.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.22, label: 'ATP spent — step 1', detail: "Glucose is phosphorylated to **glucose-6-phosphate** by the enzyme **hexokinase**. This is the **first** of the two steps where ATP is used up.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.40, label: 'ATP spent — step 2', detail: "Fructose-6-phosphate is converted to **fructose-1,6-bisphosphate**. This is the **second** step where ATP is invested.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.55, label: 'The split (6C → two 3C)', detail: "Fructose-1,6-bisphosphate is **split** into two three-carbon triose phosphates: **dihydroxyacetone phosphate** and **3-phosphoglyceraldehyde (PGAL)**.", icon: 'circle' },
        { id: uuid(), x: 0.4, y: 0.68, label: 'NADH + H+ formed', detail: "When **PGAL** is converted to **1,3-bisphosphoglycerate (BPGA)**, two hydrogen atoms are removed from PGAL and handed to **NAD+**, forming **NADH + H+**. This is the one and only NADH-forming step of glycolysis.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.80, label: 'ATP made — BPGA → PGA', detail: "The conversion of **BPGA to 3-phosphoglyceric acid (PGA)** is energy-yielding — that energy is trapped as **ATP**.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.95, label: 'Pyruvic acid (3C, ×2)', detail: "A final ATP is made as **PEP** is converted to pyruvic acid. The end product: **two molecules of pyruvic acid**, the key product of glycolysis.", icon: 'circle' },
      ],
    },
    // ── 6 · Heading — ATP & NADH bookkeeping ─────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'ATP & NADH Bookkeeping — What Goes In, What Comes Out',
      objective: "By the end of this you can list the two steps that spend ATP, the two that make ATP, the one that makes NADH, and state the net gain per glucose.",
    },
    // ── 7 · Text — the accounting ────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Glycolysis both **spends** and **earns** energy, so the honest way to score it is to track each step separately and then take the difference.\n\n**ATP is utilised (spent) at two steps.** First, when glucose is converted into glucose-6-phosphate. Second, when fructose-6-phosphate is converted to fructose-1,6-bisphosphate. That's the cell investing energy to get the reaction going.\n\n**ATP is synthesised (made) at two steps.** First, when BPGA is converted to 3-phosphoglyceric acid (PGA). Second, when PEP is converted to pyruvic acid.\n\n**NADH + H+ is formed at one step** — when PGAL is converted to BPGA, two hydrogen atoms are stripped from PGAL and transferred to NAD+.\n\nPut the numbers side by side and the net result falls out, per molecule of glucose.",
    },
    // ── 8 · Table — the bookkeeping ──────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 8,
      caption: 'The energy ledger of glycolysis, per molecule of glucose',
      headers: ['What happens', 'Where in the pathway', 'Count'],
      rows: [
        ['ATP spent', 'Glucose → glucose-6-phosphate; fructose-6-phosphate → fructose-1,6-bisphosphate', '2 used'],
        ['ATP made', 'BPGA → 3-PGA; PEP → pyruvic acid', '2 made'],
        ['NADH + H+ formed', 'PGAL → BPGA', '1 formed'],
        ['Net energy gain', '(ATP made − ATP spent), plus the reducing power picked up', 'Net 2 ATP + 2 NADH per glucose'],
      ],
    },
    // ── 9 · Heading — fate of pyruvate ───────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'The Fate of Pyruvate — Three Roads Out',
      objective: "By the end of this you can name the three things different cells do with pyruvic acid, and what decides which road is taken.",
    },
    // ── 10 · Text — the three fates ──────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "Pyruvic acid is the **key product of glycolysis** — but it is not the end of the story. What happens to it next depends entirely on the **cell's need** at that moment.\n\nThere are **three major ways** different cells handle the pyruvic acid produced by glycolysis:\n\n1. **Lactic acid fermentation**\n2. **Alcoholic fermentation**\n3. **Aerobic respiration**\n\nThe two fermentations take place under **anaerobic conditions** (no oxygen) — common in many prokaryotes and unicellular eukaryotes. Aerobic respiration is the other road: for the **complete oxidation** of glucose all the way to CO2 and water, organisms send pyruvate into **Krebs' cycle**, which requires a supply of **oxygen**.",
    },
    // ── 11 · Reasoning prompt — mid-page check ───────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 11, reasoning_type: 'logical',
      prompt: "A friend is revising glycolysis out loud and makes exactly one factual error. Which of these four statements is the wrong one?",
      options: [
        "Glycolysis occurs in the cytoplasm of the cell and is present in all living organisms.",
        "Glycolysis takes place inside the mitochondria, which is why organisms without mitochondria cannot perform it.",
        "In glycolysis, one glucose undergoes partial oxidation to form two molecules of pyruvic acid.",
        "The scheme of glycolysis was given by Embden, Meyerhof, and Parnas, so it is also called the EMP pathway.",
      ],
      reveal: "Statement 2 is the wrong one. Glycolysis happens in the **cytoplasm**, not the mitochondria — that's exactly why it can occur in every living organism, including anaerobic ones that have no mitochondria at all. In fact, for anaerobic organisms glycolysis is the *only* respiration process they have. The other three are straight from NCERT: it is in the cytoplasm and in all living organisms, glucose is partially oxidised to two pyruvic acid molecules, and the EMP name comes from Embden, Meyerhof, and Parnas.",
      difficulty_level: 2,
    },
    // ── 12 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Glycolysis** = glucose → **two molecules of pyruvic acid**, by **partial oxidation**, in the **cytoplasm**, in **all living organisms**.\n- Also called the **EMP pathway** — **E**mbden, **M**eyerhof, **P**arnas.\n- **ATP is invested at 2 steps:** glucose → glucose-6-phosphate, and fructose-6-phosphate → fructose-1,6-bisphosphate.\n- **NADH + H+ is formed at 1 step:** PGAL → BPGA (two hydrogens taken from PGAL, given to NAD+).\n- **ATP is made at 2 steps:** BPGA → 3-PGA, and PEP → pyruvic acid.\n- **Net gain per glucose = 2 ATP + 2 NADH.**\n- **Pyruvate's three fates:** lactic acid fermentation, alcoholic fermentation, aerobic respiration.",
    },
    // ── 13 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**The location trap:** NEET loves to check whether you know glycolysis happens in the **cytoplasm**, not the mitochondria — this is the single most common one-mark question on the whole topic. Krebs' cycle is the mitochondrial one; glycolysis is not.\n\n**The end product:** the end product of glycolysis is **pyruvic acid** (two molecules per glucose) — not lactic acid, not ethanol. Those come *after*, only in fermentation.\n\n**The enzyme names:** invertase splits sucrose; hexokinase phosphorylates glucose to glucose-6-phosphate. Swapping these two is a classic distractor.\n\n**Classic NEET question:** \"Glycolysis occurs in the ______ of the cell.\" → **cytoplasm.** And: \"The end product of glycolysis is ______.\" → **pyruvic acid.**",
    },
    // ── 14 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "So glycolysis hands the cell two pyruvic acid molecules and a choice of three roads. The next page follows the two anaerobic roads — **fermentation** — to see how yeast turns pyruvate into alcohol and how your own muscles turn it into lactic acid.",
    },
    // ── 15 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Where in the cell does glycolysis take place, and in which organisms does it occur?",
          options: [
            "In the mitochondria, and only in organisms that respire using oxygen",
            "In the cytoplasm, and in all living organisms",
            "In the chloroplast, and only in green photosynthetic plants",
            "On the cell membrane, and only in prokaryotes that lack a nucleus",
          ],
          correct_index: 1,
          explanation: "NCERT states plainly that glycolysis occurs in the cytoplasm of the cell and is present in all living organisms. That universality is exactly why anaerobic organisms — which have no mitochondria — can still run it; for them it's the only respiration process. Mitochondria (Krebs' cycle) and chloroplasts are the wrong compartments.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "What is the end product of glycolysis, and how many are formed from one molecule of glucose?",
          options: [
            "Lactic acid — one molecule per glucose",
            "Ethanol and carbon dioxide — one molecule each per glucose",
            "Pyruvic acid — two molecules per glucose",
            "Glucose-6-phosphate — two molecules per glucose",
          ],
          correct_index: 2,
          explanation: "Glucose undergoes partial oxidation to form two molecules of pyruvic acid — that is the key product of glycolysis. Lactic acid and ethanol appear only later, in fermentation, which is a fate of pyruvate rather than a product of glycolysis. Glucose-6-phosphate is an early intermediate, not the end product.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "At which two steps of glycolysis is ATP utilised (spent)?",
          options: [
            "When BPGA is converted to 3-PGA, and when PEP is converted to pyruvic acid",
            "When glucose becomes glucose-6-phosphate, and when fructose-6-phosphate becomes fructose-1,6-bisphosphate",
            "When PGAL is converted to BPGA, and when sucrose is split by invertase",
            "When glucose-6-phosphate isomerises to fructose-6-phosphate, and when pyruvate enters Krebs' cycle",
          ],
          correct_index: 1,
          explanation: "ATP is utilised at two steps: converting glucose to glucose-6-phosphate, and converting fructose-6-phosphate to fructose-1,6-bisphosphate. Option 1 names the two steps where ATP is instead made, not spent. PGAL → BPGA is where NADH is formed, and isomerisation to fructose-6-phosphate uses no ATP.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "At which step of glycolysis is NADH + H+ formed, and what happens chemically there?",
          options: [
            "When fructose-1,6-bisphosphate is split into two triose phosphates, releasing hydrogen to NAD+",
            "When PEP is converted to pyruvic acid, transferring two hydrogens to NAD+",
            "When 3-phosphoglyceraldehyde (PGAL) is converted to 1,3-bisphosphoglycerate (BPGA), as two hydrogen atoms are removed from PGAL and transferred to NAD+",
            "When glucose is phosphorylated to glucose-6-phosphate by hexokinase, releasing NADH",
          ],
          correct_index: 2,
          explanation: "There is exactly one NADH-forming step: PGAL → BPGA. Two redox equivalents — two hydrogen atoms — are removed from PGAL and handed to a molecule of NAD+, forming NADH + H+, while PGAL is oxidised. The splitting step and the phosphorylation steps involve no NADH, and PEP → pyruvate is an ATP-making step, not an NADH one.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
