'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'fermentation',
  title: 'Fermentation — Life Without Oxygen',
  subtitle: "When oxygen runs out, the cell doesn't stop — it takes a shortcut. That shortcut makes bread rise, wine ferment, and your legs ache after a sprint, but it squeezes out barely any energy. Here's exactly how it works and why it's so wasteful.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['respiration-in-plants', 'fermentation'],
  glossary: [
    { term: 'fermentation', definition: 'The incomplete oxidation of glucose under anaerobic (oxygen-free) conditions, in which pyruvic acid is converted to either ethanol and CO2, or to lactic acid.' },
    { term: 'anaerobic conditions', definition: 'Conditions where oxygen is absent or inadequate. Fermentation is the pathway cells use to keep going under these conditions.' },
    { term: 'alcoholic fermentation', definition: 'A form of fermentation (for example by yeast) in which pyruvic acid is converted to CO2 and ethanol, catalysed by pyruvic acid decarboxylase and alcohol dehydrogenase.' },
    { term: 'lactic acid fermentation', definition: 'A form of fermentation in which pyruvic acid is reduced to lactic acid by the enzyme lactate dehydrogenase — carried out by some bacteria, and by animal muscle when oxygen is inadequate during exercise.' },
    { term: 'pyruvic acid decarboxylase', definition: 'The enzyme that acts in alcoholic fermentation, removing CO2 from pyruvic acid on the way to producing ethanol.' },
    { term: 'lactate dehydrogenase', definition: 'The enzyme that reduces pyruvic acid to lactic acid in lactic acid fermentation.' },
    { term: 'NADH + H+', definition: 'The reducing agent in fermentation. It is reoxidised back to NAD+ during both alcoholic and lactic acid fermentation.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark rustic cellar with a covered vat of fermenting dough or must, faint bubbles of gas rising in the dim light',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A dim, rustic stone cellar at night, lit by one low warm lamp. In the centre sits an old wooden vat holding a rising, foaming mass — like fermenting dough or grape must — with faint gas bubbles suggested rising softly from its surface into the darkness. Deep shadows fill the rest of the frame, subtle warm highlights on the wet rim of the vat and the wooden staves. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Ache in Your Legs Is Chemistry',
      markdown: "Sprint as hard as you can for thirty seconds and your muscles start to burn. That burn is not damage — it's a chemical clue. When you push your muscles faster than your lungs can deliver oxygen, the cells switch to a backup route that dumps out **lactic acid**. The exact same backup route, run by a different set of organisms, is what turns sugar into the alcohol in every naturally fermented drink. One process, two products — and both are happening because oxygen has run short.",
    },
    // ── 2 · Core concept — what fermentation is ───────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "You already know that glycolysis breaks glucose down to **pyruvic acid**. The question is what happens to that pyruvic acid next. When there is **no oxygen** around — under **anaerobic conditions** — the cell can't fully break glucose down. Instead it runs a set of reactions called **fermentation**, in which glucose is only **incompletely oxidised**.\n\n\"Incomplete\" is the key word. In fermentation the pyruvic acid isn't broken all the way down to carbon dioxide and water. It is converted into one of two end products — **ethanol** (plus CO2) or **lactic acid** — and the cell has to settle for the small amount of energy it could grab before this point.",
    },
    // ── 3 · Heading — alcoholic fermentation ──────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Alcoholic Fermentation — The Yeast Route',
      objective: "By the end of this you can name the two products, the two enzymes, and the organism NCERT uses as the example for alcoholic fermentation.",
    },
    // ── 4 · Text — alcoholic fermentation ─────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The classic example NCERT gives is **yeast**. In yeast, pyruvic acid is converted into **CO2 and ethanol**. This takes two enzymes working in sequence:\n\n- **Pyruvic acid decarboxylase** removes the carbon dioxide from pyruvic acid.\n- **Alcohol dehydrogenase** then completes the job, producing ethanol.\n\nThis is the reaction happening inside every rising ball of bread dough (the CO2 makes it puff up) and inside every vat of fermenting fruit juice (the ethanol is the alcohol). Same two enzymes, same two products every time.",
    },
    // ── 5 · Heading — lactic acid fermentation ────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Lactic Acid Fermentation — The Bacteria and Muscle Route',
      objective: "By the end of this you can name the single enzyme and the single product of lactic acid fermentation, and the two settings NCERT says it happens in.",
    },
    // ── 6 · Text — lactic acid fermentation ───────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Other organisms take pyruvic acid down a different road. **Some bacteria** produce **lactic acid** from pyruvic acid instead of ethanol. This route needs only **one enzyme**: **lactate dehydrogenase**, which **reduces** pyruvic acid to lactic acid.\n\nThe important part for NEET: this isn't only a bacterial trick. It happens in **your own body too**. In **animal cells such as muscles during exercise**, when **oxygen is inadequate** for cellular respiration, pyruvic acid is reduced to lactic acid by the very same enzyme, lactate dehydrogenase. That is the burn you feel in a hard sprint.\n\nNotice what both routes share. In **both** alcoholic and lactic acid fermentation, the reducing agent **NADH + H+** is **reoxidised to NAD+**. That regeneration of NAD+ is the whole reason fermentation keeps running — it hands NAD+ back so glycolysis can carry on.",
    },
    // ── 7 · Interactive image — the two pathways (Figure 12.2) ─────────────
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'Branching diagram: glucose to pyruvic acid, then pyruvic acid splitting into two paths — one to CO2 and ethanol via two enzymes, one to lactic acid via one enzyme, with NADH being reoxidised to NAD+ on both branches',
      caption: '📸 Tap each dot to explore the two anaerobic pathways branching out from pyruvic acid.',
      generation_prompt: "Scientific textbook illustration of the two major pathways of anaerobic respiration (fermentation), in the style of NCERT Figure 12.2. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines and thin white leader lines, labels in white text. At the top, a molecule labelled GLUCOSE with a downward arrow labelled 'glycolysis' leading to a central molecule labelled PYRUVIC ACID. From pyruvic acid, two arrows branch outward. The LEFT branch (alcoholic fermentation) passes two enzyme labels 'pyruvic acid decarboxylase' then 'alcohol dehydrogenase' and ends at two products drawn separately: a small gas molecule labelled CO2 and a molecule labelled ETHANOL (colour these cool blue/green as chemical products). The RIGHT branch (lactic acid fermentation) passes one enzyme label 'lactate dehydrogenase' and ends at a molecule labelled LACTIC ACID (colour pink/magenta). Along both branches show a small curved recycling arrow marked 'NADH + H+ → NAD+' indicating the reducing agent being reoxidised. Biologically accurate, clean and uncluttered, no photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.1, label: 'Glucose', detail: "Where it all starts. Glycolysis breaks glucose down to pyruvic acid — that pyruvic acid is the fork in the road for everything below.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.34, label: 'Pyruvic acid', detail: "The branch point. Under anaerobic conditions the cell can't oxidise this fully, so it is diverted down one of the two fermentation routes.", icon: 'circle' },
        { id: uuid(), x: 0.24, y: 0.62, label: 'Pyruvic acid decarboxylase + alcohol dehydrogenase', detail: "The two enzymes of alcoholic fermentation, acting in sequence. Decarboxylase strips off the CO2; alcohol dehydrogenase finishes the job to make ethanol. This is the yeast route.", icon: 'circle' },
        { id: uuid(), x: 0.2, y: 0.86, label: 'CO2 + ethanol', detail: "The two products of alcoholic fermentation. The CO2 makes bread dough rise; the ethanol is the alcohol in naturally fermented drinks.", icon: 'circle' },
        { id: uuid(), x: 0.76, y: 0.62, label: 'Lactate dehydrogenase', detail: "The single enzyme of lactic acid fermentation. It reduces pyruvic acid straight to lactic acid — no CO2 is released on this branch.", icon: 'circle' },
        { id: uuid(), x: 0.8, y: 0.86, label: 'Lactic acid', detail: "The product made by some bacteria — and by your own muscles during hard exercise when oxygen is inadequate.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.55, label: 'NADH + H+ → NAD+', detail: "The shared step. In both routes the reducing agent NADH + H+ is reoxidised back to NAD+, which is what lets glycolysis keep running.", icon: 'circle' },
      ],
    },
    // ── 8 · Comparison card — alcoholic vs lactic acid ────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 8,
      title: 'Alcoholic vs Lactic Acid Fermentation',
      columns: [
        {
          heading: 'Alcoholic fermentation',
          points: [
            'Products: CO2 + ethanol',
            'Enzymes: pyruvic acid decarboxylase, then alcohol dehydrogenase (two enzymes)',
            'Where: yeast (NCERT’s example)',
            'NADH + H+ is reoxidised to NAD+',
          ],
        },
        {
          heading: 'Lactic acid fermentation',
          points: [
            'Product: lactic acid (no CO2)',
            'Enzyme: lactate dehydrogenase (one enzyme)',
            'Where: some bacteria, and animal muscle during exercise when oxygen is inadequate',
            'NADH + H+ is reoxidised to NAD+',
          ],
        },
      ],
    },
    // ── 9 · Heading — why so little energy ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Why Fermentation Yields So Little',
      objective: "By the end of this you can say how much of glucose's energy fermentation releases, the net ATP per glucose, and why yeast can't make drinks stronger than about 13% alcohol.",
    },
    // ── 10 · Text — energetics, net ATP, 13% limit ────────────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "Fermentation keeps the cell alive, but it is a poor deal energetically. In **both** lactic acid and alcohol fermentation, **not much energy is released** — **less than seven per cent of the energy in glucose** is released, and **not all of even that** is trapped as the high-energy bonds of ATP. On top of that, the process is **hazardous**: it leaves behind either **acid or alcohol**, both of which build up and can harm the cell.\n\nNCERT invites you to do the sum yourself: count the ATP made and subtract the ATP used up during glycolysis. Work it through and the **net yield is just 2 ATP** per molecule of glucose fermented — whether the end product is alcohol or lactic acid.\n\nThe hazard has a hard limit you can watch happen. **Yeast poison themselves to death when the alcohol concentration reaches about 13 per cent.** So a naturally fermented beverage can't climb past roughly **13% alcohol** — the yeast making it die before it can go higher. Any drink stronger than that has to be concentrated afterwards by **distillation**, not by fermentation alone.",
    },
    // ── 11 · Reasoning prompt — enzyme/product matching ───────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 11, reasoning_type: 'logical',
      prompt: "A student writes four statements about the two fermentation pathways. Exactly one of them is wrong. Which one?",
      options: [
        "Alcoholic fermentation converts pyruvic acid to CO2 and ethanol, using pyruvic acid decarboxylase and alcohol dehydrogenase.",
        "Lactic acid fermentation is carried out by some bacteria and by animal muscle when oxygen is inadequate, using lactate dehydrogenase.",
        "In both pathways the reducing agent NADH + H+ is reoxidised to NAD+.",
        "Lactic acid fermentation releases CO2 as a by-product, just as alcoholic fermentation does.",
      ],
      reveal: "Statement 4 is the wrong one. Only the alcoholic route releases CO2 — that's the step run by pyruvic acid decarboxylase. Lactic acid fermentation reduces pyruvic acid straight to lactic acid with lactate dehydrogenase and releases no CO2. The other three are exactly what NCERT states: alcoholic fermentation gives CO2 + ethanol via its two enzymes, lactic acid fermentation happens in some bacteria and in exercising muscle via lactate dehydrogenase, and in both routes NADH + H+ is reoxidised to NAD+.",
      difficulty_level: 2,
    },
    // ── 12 · Remember callout ─────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Fermentation** = incomplete oxidation of glucose under **anaerobic** conditions.\n- **Alcoholic** (e.g. yeast): pyruvic acid → **CO2 + ethanol**, via **pyruvic acid decarboxylase** + **alcohol dehydrogenase** (two enzymes).\n- **Lactic acid** (some bacteria; animal muscle during exercise when O2 is inadequate): pyruvic acid → **lactic acid**, via **lactate dehydrogenase** (one enzyme, no CO2).\n- In **both**, the reducing agent **NADH + H+** is **reoxidised to NAD+**.\n- Energy released is **less than 7% of the energy in glucose**, and not all of that is trapped as ATP. **Net ATP = 2** per glucose.\n- **Yeast die at about 13% alcohol** → naturally fermented drinks max out near 13%; anything stronger needs distillation.",
    },
    // ── 13 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Match every enzyme to its exact pathway — this is the most-tested part:** pyruvic acid decarboxylase + alcohol dehydrogenase → alcoholic fermentation (CO2 + ethanol); lactate dehydrogenase → lactic acid fermentation (lactic acid). Swapping these enzymes is the classic trap.\n\n**Remember the two numbers NCERT states:** fermentation releases *less than 7%* of glucose's energy, and the *net ATP is 2* per glucose. The *13%* alcohol figure (where yeast poison themselves) is a favourite factual pick too.\n\n**Classic NEET question:** \"In muscles during vigorous exercise, when oxygen is inadequate, pyruvic acid is converted to ___\" → **lactic acid**, by **lactate dehydrogenase** — not ethanol, because that's the yeast (alcoholic) route.",
    },
    // ── 14 · Bridge text ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "So fermentation is the cell's emergency setting: fast, oxygen-free, but leaving most of glucose's energy locked away untouched. To pull out the rest, a cell needs oxygen. Next, we follow pyruvic acid into the mitochondria for **aerobic respiration** — where the link reaction and the Krebs cycle finish the complete oxidation of glucose.",
    },
    // ── 15 · Inline quiz (LAST) ───────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "In alcoholic fermentation by yeast, pyruvic acid is converted to which products, and by which enzymes?",
          options: [
            "Lactic acid, by lactate dehydrogenase",
            "CO2 and ethanol, by pyruvic acid decarboxylase and alcohol dehydrogenase",
            "CO2 and water, by pyruvic acid decarboxylase alone",
            "Ethanol and lactic acid, by alcohol dehydrogenase and lactate dehydrogenase",
          ],
          correct_index: 1,
          explanation: "NCERT states that in yeast, pyruvic acid is converted to CO2 and ethanol, catalysed by pyruvic acid decarboxylase and alcohol dehydrogenase. Lactic acid and lactate dehydrogenase belong to the other pathway; fermentation is incomplete, so it never goes all the way to CO2 and water.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "During vigorous exercise, when oxygen is inadequate, pyruvic acid in your muscle cells is reduced to lactic acid. Which enzyme catalyses this?",
          options: [
            "Lactate dehydrogenase",
            "Pyruvic acid decarboxylase",
            "Alcohol dehydrogenase",
            "Both pyruvic acid decarboxylase and alcohol dehydrogenase",
          ],
          correct_index: 0,
          explanation: "NCERT says pyruvic acid is reduced to lactic acid by lactate dehydrogenase in animal muscle when oxygen is inadequate. Pyruvic acid decarboxylase and alcohol dehydrogenase are the alcoholic (yeast) enzymes — they make ethanol, not lactic acid.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "What role does the reducing agent NADH + H+ play in both alcoholic and lactic acid fermentation?",
          options: [
            "It is broken down to release the bulk of the ATP produced",
            "It is reoxidised to NAD+ in both processes",
            "It is converted permanently to lactic acid",
            "It is used only in lactic acid fermentation, not in alcoholic fermentation",
          ],
          correct_index: 1,
          explanation: "NCERT states plainly that NADH + H+ is reoxidised to NAD+ in both processes. It isn't the source of ATP, it isn't turned into lactic acid, and it acts in both pathways — not just the lactic acid one.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "According to NCERT, roughly how much of the energy in glucose is released by fermentation, and what is the net ATP yield per glucose?",
          options: [
            "Less than 7% of glucose's energy is released, with a net yield of 2 ATP",
            "About 40% of glucose's energy is released, with a net yield of 36 ATP",
            "Exactly 13% of glucose's energy is released, with a net yield of 4 ATP",
            "Nearly all of glucose's energy is released, but only 2 ATP is trapped",
          ],
          correct_index: 0,
          explanation: "NCERT states that less than seven per cent of the energy in glucose is released in fermentation, and not all of even that is trapped as ATP; the net yield works out to just 2 ATP per glucose. The 36-ATP figure belongs to complete aerobic oxidation, and 13% is the alcohol concentration at which yeast poison themselves — not an energy figure.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
