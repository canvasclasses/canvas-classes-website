'use strict';
/**
 * Class 12 Biology — Chapter 8 (Microbes in Human Welfare)
 * Page 2 — "Microbes in Industry — Drinks, Drugs & Enzymes"
 *
 * Faithful to the 2026-27 reprint NCERT text (lebo108 §8.2 "Microbes in
 * Industrial Products": §8.2.1 Fermented Beverages, §8.2.2 Antibiotics,
 * §8.2.3 Chemicals, Enzymes and other Bioactive Molecules).
 * Rule 0: every fact, name and organism traces to the supplied NCERT text —
 * no outside additions.
 *
 * Exports a single page object. Does NOT touch the database — the orchestrator
 * validates and inserts.
 */
const { v4: uuid } = require('uuid');

const blocks = [
  {
    id: uuid(), type: 'image', order: 0, src: '',
    alt: 'A row of tall steel industrial fermentors glowing warm in a dim brewery hall, pipes and gauges catching low light',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A row of tall polished steel industrial fermentation tanks (fermentors) standing in a dim factory hall, connected by pipes, valves and pressure gauges. Warm amber light pools from below and catches the curved metal surfaces, faint steam drifting near the tops. A sense of quiet industrial scale — vessels far taller than a person. No text, no labels, no diagram elements, no people, no mascots. Painterly, atmospheric illustration style, deep dark background tones throughout (#0a0a0a base), naturalistic warm interior lighting.",
  },
  {
    id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: "An Unwashed Plate That Changed Medicine",
    markdown: "In 1928 **Alexander Fleming** was working on *Staphylococci* bacteria when he noticed a **mould growing in one of his unwashed culture plates** — and around that mould, the bacteria simply **would not grow**. A chemical the mould made was killing them. He named it **Penicillin**, after the mould **_Penicillium notatum_**. It was a complete accident. Its full power as a medicine came later, when **Ernest Chain** and **Howard Florey** developed it into an effective antibiotic — used to treat American soldiers wounded in **World War II**. Fleming, Chain and Florey shared the **Nobel Prize in 1945** for it.",
  },
  {
    id: uuid(), type: 'text', order: 2,
    markdown: "Microbes don't only work in our kitchens — they work in **industry** too, making a whole range of products we depend on. To grow them at this scale, factories culture them in very large vessels called **fermentors**. NCERT groups the industrial products into three baskets: **fermented beverages**, **antibiotics**, and a mixed basket of **chemicals, enzymes and other bioactive molecules**. Let's take them one at a time — and keep a close eye on **which microbe makes which product**, because that exact matching is where NEET lives.",
  },
  {
    id: uuid(), type: 'heading', order: 3, level: 2,
    text: 'Fermented Beverages — One Yeast, Many Drinks',
    objective: 'By the end of this you can name the single yeast behind wine, beer, whisky, brandy and rum — and say which of those drinks need distillation and which do not.',
  },
  {
    id: uuid(), type: 'text', order: 4,
    markdown: "Yeasts have been used **since time immemorial** to make drinks like **wine, beer, whisky, brandy and rum**. The remarkable part: it's the **same single yeast** doing all of it — **_Saccharomyces cerevisiae_**, the very yeast used for bread-making, commonly called **brewer's yeast**. It ferments **malted cereals and fruit juices** to produce **ethanol** (alcohol).\n\nSo if one yeast makes them all, what makes the drinks different? Two things — the **raw material** used, and **whether the fermented broth is distilled or not**:\n\n- **Without distillation → wine and beer.**\n- **With distillation → whisky, brandy and rum.**\n\nThat distillation line is the exact fact NEET likes to test. Wine and beer are the two that skip it; the stronger spirits are the ones that go through it.",
  },
  {
    id: uuid(), type: 'heading', order: 5, level: 2,
    text: 'Antibiotics — Chemicals That Are “Against Life”',
    objective: 'By the end of this you can explain what an antibiotic is, name the first one discovered and its source mould, and list the three scientists who won the 1945 Nobel Prize for it.',
  },
  {
    id: uuid(), type: 'text', order: 6,
    markdown: "The word **antibiotic** breaks into two Greek parts — **anti** = 'against' and **bio** = 'life'. Put together it means 'against life' — but that only means against the **disease-causing** microbes. To us humans they are **'pro life'**. NCERT's definition to hold onto: antibiotics are **chemical substances, produced by some microbes, that can kill or retard the growth of other (disease-causing) microbes.**\n\n**Penicillin** was the **first antibiotic ever discovered** — the chance discovery by Fleming you just read about, produced by the mould **_Penicillium notatum_**. After penicillin, many more antibiotics were purified from other microbes. Their arrival transformed medicine: diseases that once killed millions — **plague, whooping cough, diphtheria and leprosy** — became treatable. NCERT's line is worth remembering as it stands: today, we cannot imagine a world without antibiotics.",
  },
  {
    id: uuid(), type: 'heading', order: 7, level: 2,
    text: 'Chemicals, Enzymes & Bioactive Molecules — The Matching Basket',
    objective: 'By the end of this you can match each organic acid, each enzyme, and each bioactive molecule to the exact microbe that makes it and the job it does.',
  },
  {
    id: uuid(), type: 'text', order: 8,
    markdown: "This is the basket NEET loves for **match-the-following** questions, so read it as a set of pairs.\n\n**Organic acids (each with its own microbe):**\n- **_Aspergillus niger_** (a **fungus**) → **citric acid**\n- **_Acetobacter aceti_** (a **bacterium**) → **acetic acid**\n- **_Clostridium butylicum_** (a **bacterium**) → **butyric acid**\n- **_Lactobacillus_** (a **bacterium**) → **lactic acid**\n\n**Alcohol:** the yeast **_Saccharomyces cerevisiae_** → **ethanol** (its industrial job again).\n\n**Enzymes:**\n- **Lipases** → used in **detergent formulations**, to remove **oily stains** from laundry.\n- **Pectinases and proteases** → used to **clarify bottled fruit juices** (that's why shop juices look clearer than home-made ones).\n\n**Bioactive molecules (the drug trio — memorise these three cold):**\n- **Streptokinase**, from the bacterium **_Streptococcus_** (and modified by genetic engineering) → a **'clot buster'** that removes clots from blood vessels of patients after a **myocardial infarction** (heart attack).\n- **Cyclosporin A**, from the fungus **_Trichoderma polysporum_** → an **immunosuppressive agent** used in **organ-transplant** patients.\n- **Statins**, from the yeast **_Monascus purpureus_** → **blood-cholesterol lowering** agents; they act by **competitively inhibiting the enzyme** responsible for cholesterol synthesis.",
  },
  {
    id: uuid(), type: 'table', order: 9,
    caption: '📋 The NEET matching set — product, its microbe, and its use',
    headers: ['Product', 'Microbe (source)', 'Use'],
    rows: [
      ['Ethanol', 'Saccharomyces cerevisiae (yeast)', 'Industrial production of alcohol'],
      ['Citric acid', 'Aspergillus niger (fungus)', 'Organic acid'],
      ['Acetic acid', 'Acetobacter aceti (bacterium)', 'Organic acid'],
      ['Butyric acid', 'Clostridium butylicum (bacterium)', 'Organic acid'],
      ['Lactic acid', 'Lactobacillus (bacterium)', 'Organic acid'],
      ['Lipases', 'Microbial (source not named by NCERT)', 'In detergents — remove oily stains from laundry'],
      ['Pectinases & proteases', 'Microbial (source not named by NCERT)', 'Clarify bottled fruit juices'],
      ['Streptokinase', 'Streptococcus (bacterium)', "'Clot buster' — dissolves clots after a heart attack"],
      ['Cyclosporin A', 'Trichoderma polysporum (fungus)', 'Immunosuppressant in organ-transplant patients'],
      ['Statins', 'Monascus purpureus (yeast)', 'Lower blood cholesterol'],
    ],
  },
  {
    id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
    prompt: "A transplant surgeon needs a drug that stops the patient's immune system from rejecting a newly transplanted kidney. Which molecule — and its source microbe — fits the job?",
    options: [
      'Statins, produced by the yeast Monascus purpureus',
      'Cyclosporin A, produced by the fungus Trichoderma polysporum',
      'Streptokinase, produced by the bacterium Streptococcus',
      'Citric acid, produced by the fungus Aspergillus niger',
    ],
    correct_index: 1,
    reveal: "The immunosuppressive agent used in organ-transplant patients is **cyclosporin A**, made by the fungus **_Trichoderma polysporum_** — exactly what's needed to stop rejection. Statins are the tempting wrong pick because they're also a fungal/yeast drug, but their job is **lowering blood cholesterol**, not suppressing immunity. Streptokinase is a **clot buster** (heart-attack clots), and citric acid is just an **organic acid** — neither touches the immune system.",
    difficulty_level: 2,
  },
  {
    id: uuid(), type: 'callout', order: 11, variant: 'remember', title: 'The Pairs You Cannot Get Wrong',
    markdown: "- **_Saccharomyces cerevisiae_** (brewer's yeast) → **ethanol**; makes wine, beer, whisky, brandy, rum.\n- **Without distillation = wine & beer**; **with distillation = whisky, brandy, rum.**\n- **Penicillin** = **first antibiotic discovered**, by **Fleming**, from **_Penicillium notatum_**; developed by **Chain & Florey**; **Nobel Prize 1945** to all three.\n- **Acids:** _Aspergillus niger_ → **citric**; _Acetobacter aceti_ → **acetic**; _Clostridium butylicum_ → **butyric**; _Lactobacillus_ → **lactic**.\n- **Lipases** → detergents (oily stains); **pectinases & proteases** → clarify fruit juices.\n- **Streptokinase** (_Streptococcus_) → **clot buster**; **cyclosporin A** (_Trichoderma polysporum_) → **immunosuppressant**; **statins** (_Monascus purpureus_) → **lower cholesterol**.",
  },
  {
    id: uuid(), type: 'callout', order: 12, variant: 'exam_tip', title: 'NEET Exam Insight',
    markdown: "**Streptokinase vs cyclosporin A vs statin — the three most-swapped drugs:** clot buster / immunosuppressant / cholesterol-lowering, in that order. Lock the source too: _Streptococcus_ (bacterium) / _Trichoderma polysporum_ (fungus) / _Monascus purpureus_ (yeast).\n\n**Citric acid trap:** its microbe is a **fungus, _Aspergillus niger_** — not a bacterium. The other three acids (acetic, butyric, lactic) are the bacterial ones.\n\n**Distillation splitter:** wine and beer are the *only* two made **without** distillation.\n\n**Classic NEET question:** \"Cyclosporin A, used as an immunosuppressive agent, is obtained from — ?\" → the fungus **_Trichoderma polysporum_**.",
  },
  {
    id: uuid(), type: 'text', order: 13,
    markdown: "So microbes give us our drinks, our life-saving antibiotics, our acids, our detergent enzymes and three important drugs — all from vats in a factory. Next we follow microbes out of the factory and into the city's drains, to see how they clean up the enormous flow of **sewage** we produce every day.",
  },
  {
    id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
    questions: [
      {
        id: uuid(), question: 'Which microbe is used for the industrial production of citric acid?',
        options: [
          'Acetobacter aceti',
          'Aspergillus niger',
          'Clostridium butylicum',
          'Lactobacillus',
        ],
        correct_index: 1,
        explanation: "Citric acid is produced by the fungus *Aspergillus niger*. The tempting swap is *Acetobacter aceti*, but that bacterium makes **acetic** acid; *Clostridium butylicum* makes **butyric** acid and *Lactobacillus* makes **lactic** acid. Citric acid is also the one whose source is a fungus, not a bacterium.",
        difficulty_level: 1,
      },
      {
        id: uuid(), question: 'Statins, commercialised as blood-cholesterol lowering agents, are produced by:',
        options: [
          'the fungus Trichoderma polysporum',
          'the bacterium Streptococcus',
          'the yeast Monascus purpureus',
          'the mould Penicillium notatum',
        ],
        correct_index: 2,
        explanation: "Statins come from the yeast *Monascus purpureus* and lower cholesterol by competitively inhibiting the cholesterol-synthesising enzyme. *Trichoderma polysporum* is the source of **cyclosporin A** (an immunosuppressant), *Streptococcus* gives **streptokinase** (a clot buster), and *Penicillium notatum* gives **penicillin** (an antibiotic) — different drugs, different jobs.",
        difficulty_level: 2,
      },
      {
        id: uuid(), question: 'Streptokinase, produced by Streptococcus and modified by genetic engineering, is used as a:',
        options: [
          "'clot buster' to remove clots from blood vessels after a heart attack",
          'immunosuppressive agent in organ-transplant patients',
          'blood-cholesterol lowering agent',
          'clarifying enzyme for bottled fruit juices',
        ],
        correct_index: 0,
        explanation: "Streptokinase is the 'clot buster' — it dissolves clots in the blood vessels of patients who have had a myocardial infarction (heart attack). The immunosuppressant is **cyclosporin A**, the cholesterol-lowering drug is a **statin**, and fruit juices are clarified by **pectinases and proteases** — none of which is streptokinase.",
        difficulty_level: 2,
      },
      {
        id: uuid(), question: 'Which set of alcoholic drinks is produced WITHOUT distillation of the fermented broth?',
        options: [
          'Whisky and rum',
          'Brandy and whisky',
          'Rum and brandy',
          'Wine and beer',
        ],
        correct_index: 3,
        explanation: "Wine and beer are produced **without** distillation. Whisky, brandy and rum are all obtained **by** distillation of the fermented broth — so any option pairing those spirits is the distilled group, the opposite of what's asked. All of them, distilled or not, start from the same yeast *Saccharomyces cerevisiae*.",
        difficulty_level: 3,
      },
    ],
  },
];

module.exports = {
  slug: 'microbes-in-industrial-products',
  title: 'Microbes in Industry — Drinks, Drugs & Enzymes',
  subtitle: 'One yeast makes every alcoholic drink, one accidental mould gave us the first antibiotic, and a handful of microbes quietly make our acids, detergent enzymes and life-saving drugs. Here is exactly which microbe makes what.',
  page_number: 2,
  page_type: 'lesson',
  tags: ['microbes-in-human-welfare', 'industrial-products', 'antibiotics', 'fermented-beverages', 'bioactive-molecules'],
  glossary: [
    { term: 'Saccharomyces cerevisiae', definition: "Brewer's yeast — the single yeast used to ferment cereals and fruit juices into ethanol, making wine, beer, whisky, brandy and rum. It is also used for bread-making." },
    { term: 'fermentor', definition: 'A very large vessel in which microbes are grown on an industrial scale to make products like beverages and antibiotics.' },
    { term: 'antibiotic', definition: "A chemical substance produced by some microbes that can kill or retard the growth of other, disease-causing microbes. The name means 'against life'." },
    { term: 'penicillin', definition: 'The first antibiotic to be discovered — a chance discovery by Alexander Fleming — produced by the mould Penicillium notatum.' },
    { term: 'Aspergillus niger', definition: 'A fungus used for the industrial production of citric acid.' },
    { term: 'streptokinase', definition: "A bioactive molecule produced by the bacterium Streptococcus (and modified by genetic engineering), used as a 'clot buster' to remove clots from the blood vessels of heart-attack patients." },
    { term: 'cyclosporin A', definition: 'An immunosuppressive agent used in organ-transplant patients, produced by the fungus Trichoderma polysporum.' },
    { term: 'statin', definition: 'A blood-cholesterol lowering agent produced by the yeast Monascus purpureus; it acts by competitively inhibiting the enzyme responsible for cholesterol synthesis.' },
  ],
  blocks,
};
