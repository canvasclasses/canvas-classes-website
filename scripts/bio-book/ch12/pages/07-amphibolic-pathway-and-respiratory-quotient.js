'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'amphibolic-pathway-and-respiratory-quotient',
  title: 'The Amphibolic Pathway & Respiratory Quotient',
  subtitle: "Respiration doesn't only tear molecules apart for energy — the very same pathway hands out building blocks to make fats and proteins. And by measuring two gases, you can tell which fuel a cell is burning.",
  page_number: 7,
  page_type: 'lesson',
  tags: ['respiration-in-plants', 'respiratory-quotient'],
  glossary: [
    { term: 'amphibolic pathway', definition: 'A pathway that works in both directions — it breaks molecules down (catabolism) and also supplies intermediates that are built up into new molecules (anabolism). The respiratory pathway is amphibolic, not merely catabolic.' },
    { term: 'catabolism', definition: 'The breaking-down side of metabolism — large molecules like glucose and fats are broken into smaller ones, releasing energy.' },
    { term: 'anabolism', definition: 'The building-up side of metabolism — small molecules (respiratory intermediates like acetyl CoA) are joined together to synthesise larger molecules like fatty acids and proteins.' },
    { term: 'deamination', definition: 'The removal of the amino group from an amino acid, so that the remaining carbon skeleton can enter the respiratory pathway.' },
    { term: 'acetyl CoA', definition: 'A central respiratory intermediate. Fatty acids are degraded to it before entering the pathway; when the cell needs to build fatty acids, acetyl CoA is withdrawn from the pathway for that.' },
    { term: 'PGAL', definition: 'Phosphoglyceraldehyde — a glycolysis intermediate. Glycerol from fats enters the respiratory pathway after being converted to PGAL.' },
    { term: 'respiratory quotient (RQ)', definition: 'The ratio of the volume of CO2 evolved to the volume of O2 consumed in respiration. RQ = CO2 evolved / O2 consumed. Its value depends on the respiratory substrate.' },
    { term: 'respiratory substrate', definition: 'The molecule that is oxidised in respiration to release energy — carbohydrates, fats or proteins. In living organisms the substrate is usually a mixture, never a pure fat or pure protein.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark junction of glowing pathways where streams flow in from different directions, meet at a central hub, and also branch back out again',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A dark, atmospheric metabolic crossroads: several softly glowing streams of light flow inward from different directions toward a single bright central hub, while other streams branch back outward from the same hub — suggesting a junction where things both arrive to be broken down and depart to be built up. Warm amber and cool teal light trails on a deep near-black background (#0a0a0a base tones). Painterly, abstract and atmospheric, evoking a two-way chemical highway without any text, labels, molecules, or diagram elements. No people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Same Road Runs Both Ways',
      markdown: "For years, textbooks called respiration a pure demolition job — it exists to smash fuel and release energy, nothing more. But look closer and you'll notice something strange: the exact same molecules the cell pulls apart for energy are the ones it grabs when it needs to *build* fat or protein. The respiratory pathway isn't a dead-end shredder. It's a busy crossroads where breaking-down traffic and building-up traffic use the very same road.",
    },
    // ── 2 · Core concept — glucose favoured, other substrates enter elsewhere ─
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "**Glucose is the favoured substrate for respiration.** So much so that **all carbohydrates are usually first converted into glucose** before they're respired. That's the clean, standard route — the one you already know: glucose in at the top, then glycolysis, and onward.\n\nBut carbohydrates aren't the only fuel a cell can burn. **Fats and proteins can also be respired** — the catch is that they **do not enter the respiratory pathway at the first step**. Each one has to be pre-processed into a molecule the pathway already handles, and then it slips in at whatever point that molecule belongs to. So instead of one entrance at the top, picture several side-doors opening into the pathway at different levels.",
    },
    // ── 3 · Heading — the amphibolic pathway ─────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Why Respiration Is Called an Amphibolic Pathway',
      objective: "By the end of this you can name where fats and proteins enter the respiratory pathway, and explain — with an example — why the pathway builds molecules as well as breaks them.",
    },
    // ── 4 · Text — the side-doors: fats and proteins entering ────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Here's exactly where each non-carbohydrate fuel gets in:\n\n- **Fats** are first broken down into **glycerol and fatty acids**.\n  - The **fatty acids** are degraded to **acetyl CoA**, and enter the pathway there.\n  - The **glycerol** enters after being converted to **PGAL** (a glycolysis intermediate).\n- **Proteins** are broken down by **proteases** into individual amino acids. Each amino acid is first stripped of its amino group — a step called **deamination** — and then, **depending on its structure**, the leftover carbon skeleton enters the pathway **at some stage within the Krebs' cycle, or as pyruvate, or as acetyl CoA.**\n\nSo far this all looks like breaking-down — **catabolism**. And traditionally, that's exactly how respiration was viewed: a catabolic process, and the pathway a catabolic pathway.",
    },
    // ── 5 · Text — the two-way insight + interactive diagram ─────────────────
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "But that view misses half the story. Those very same compounds — acetyl CoA, pyruvate, the Krebs' intermediates — are also **withdrawn** from the respiratory pathway whenever the cell needs to **synthesise** something.\n\nTake fatty acids. When a fatty acid is *used as fuel*, it's broken down to **acetyl CoA** before entering the pathway. But when the organism needs to *make* a fatty acid, **acetyl CoA is withdrawn from the pathway** to build it. Same molecule, same pathway — used in both the breakdown and the synthesis of fats. The same link-up happens for proteins.\n\nBreaking-down inside a living organism is **catabolism**; synthesis is **anabolism**. Because the respiratory pathway does **both**, it's better to call it an **amphibolic pathway** rather than a purely catabolic one. Tap the diagram below to trace both directions of traffic.",
    },
    // ── 6 · Interactive image — Figure 12.6 amphibolic pathway ───────────────
    {
      id: uuid(), type: 'interactive_image', order: 6, src: '',
      alt: 'The central respiratory pathway (glucose to glycolysis to pyruvate to acetyl CoA to Krebs cycle) with fats and proteins feeding in at different points, and arrows showing intermediates being withdrawn for biosynthesis',
      caption: '📸 Tap each dot to see where every fuel enters the respiratory pathway — and where the pathway hands molecules back out to be built into fats and proteins.',
      generation_prompt: "Scientific textbook illustration of the amphibolic (metabolic interrelationship) pathway, NCERT Figure 12.6 style. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, labels in white text with thin white leader lines. A vertical central respiratory pathway running top to bottom: 'Glucose' at the top, an arrow down through 'Glycolysis' to 'Pyruvate', then down to 'Acetyl CoA', which feeds into a circular 'Krebs cycle' loop at the bottom. On the left, a 'Fats' box with arrows splitting into 'Glycerol' (arrow joining the glycolysis level as PGAL) and 'Fatty acids' (arrow joining at acetyl CoA). On the right, a 'Proteins' box arrow to 'Amino acids' (labelled 'deamination') with arrows joining at pyruvate, acetyl CoA, and into the Krebs cycle. Double-headed / paired arrows along the central pathway drawn to show intermediates both entering (breakdown) and being withdrawn (synthesis) — a two-way flow. Use functional colours: green tones for carbohydrate/glucose, warm amber/tan for fats, magenta/pink for proteins. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.09, label: 'Glucose — the favoured substrate', detail: "**Glucose enters at the very top, the first step.** All carbohydrates are converted to glucose first, then fed in here. This is the standard entry every other fuel has to work around.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.34, label: 'Glycolysis → Pyruvate', detail: "Glucose is broken through glycolysis down to **pyruvate**. Glycerol (from fats) joins this stretch after conversion to **PGAL**; some amino acids enter here as pyruvate.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.6, label: 'Acetyl CoA — the busy junction', detail: "**Fatty acids** are degraded to acetyl CoA and enter here. When the cell instead needs to *build* fatty acids, acetyl CoA is **withdrawn** from this exact point — the clearest example of the pathway working both ways.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.85, label: "Krebs' cycle", detail: "The final loop. Depending on their structure, deaminated amino acids enter **at some stage within the Krebs' cycle**. Intermediates are also pulled out of the cycle for biosynthesis.", icon: 'circle' },
        { id: uuid(), x: 0.16, y: 0.5, label: 'Fats enter here', detail: "Fats are first split into **glycerol + fatty acids**. Glycerol → PGAL (glycolysis level); fatty acids → acetyl CoA. Two different side-doors from one fat molecule.", icon: 'circle' },
        { id: uuid(), x: 0.84, y: 0.5, label: 'Proteins enter here', detail: "Proteases break proteins into amino acids; each is **deaminated**, then enters as pyruvate, acetyl CoA, or within the Krebs' cycle — depending on its structure.", icon: 'circle' },
      ],
    },
    // ── 7 · Heading — Respiratory Quotient ───────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Respiratory Quotient — Reading the Fuel From Two Gases',
      objective: "By the end of this you can define RQ, write its formula, and state the RQ of carbohydrates, fats and proteins with the reason for each value.",
    },
    // ── 8 · Text — RQ definition + formula ───────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "During aerobic respiration a cell **consumes O2** and **releases CO2**. If you measure the volumes of both gases, their ratio tells you something useful. The **ratio of the volume of CO2 evolved to the volume of O2 consumed** in respiration is called the **respiratory quotient (RQ)**, or respiratory ratio:\n\n$$ RQ = \\dfrac{\\text{volume of } CO_2 \\text{ evolved}}{\\text{volume of } O_2 \\text{ consumed}} $$\n\nThe key idea: **RQ depends on the type of respiratory substrate being used.** Different fuels need different amounts of oxygen to burn, so each one gives a characteristic ratio. That's why the RQ value is a clue to which fuel the cell is respiring.",
    },
    // ── 9 · Text — the three substrate cases ─────────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "**Carbohydrates → RQ = 1.** When a carbohydrate is completely oxidised, **equal amounts of CO2 and O2 are evolved and consumed**, so the ratio is exactly 1:\n\n$$ C_6H_{12}O_6 + 6O_2 \\rightarrow 6CO_2 + 6H_2O + \\text{Energy} \\qquad RQ = \\dfrac{6CO_2}{6O_2} = 1.0 $$\n\n**Fats → RQ less than 1.** Fats are hydrogen-rich and oxygen-poor, so burning them needs a lot of extra O2 — more O2 consumed than CO2 released. Taking the fatty acid **tripalmitin** as the substrate:\n\n$$ 2(C_{51}H_{98}O_6) + 145O_2 \\rightarrow 102CO_2 + 98H_2O + \\text{energy} \\qquad RQ = \\dfrac{102CO_2}{145O_2} = 0.7 $$\n\n**Proteins → RQ about 0.9.** When proteins are the respiratory substrate, the ratio comes out to roughly 0.9.",
    },
    // ── 10 · Table — RQ of the three substrates ──────────────────────────────
    {
      id: uuid(), type: 'table', order: 10,
      caption: 'Respiratory Quotient of the three respiratory substrates, and why each value comes out where it does',
      headers: ['Substrate', 'RQ', 'Why'],
      rows: [
        ['Carbohydrate', '1.0', 'Completely oxidised — equal volumes of CO2 evolved and O2 consumed (C6H12O6 + 6O2 → 6CO2 + 6H2O)'],
        ['Fat', '0.7', 'Hydrogen-rich, oxygen-poor fuel needs extra O2, so more O2 is consumed than CO2 released (tripalmitin: 102CO2 / 145O2 = 0.7)'],
        ['Protein', '≈ 0.9', 'Ratio works out to about 0.9 when proteins are the respiratory substrate'],
      ],
    },
    // ── 11 · Reasoning prompt — RQ of fats vs carbohydrates ──────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 11, reasoning_type: 'logical',
      prompt: "A germinating fatty seed (rich in stored oil) is respiring, and its measured RQ is well below 1 — close to 0.7. Why does burning fat give an RQ less than 1, while burning carbohydrate gives exactly 1?",
      options: [
        "Fat releases far more CO2 than carbohydrate does, so the CO2 on top of the ratio is much larger",
        "Fat is a hydrogen-rich, oxygen-poor fuel, so oxidising it consumes more O2 than the CO2 it releases — a larger bottom of the ratio pulls RQ below 1",
        "Fat is respired without using any oxygen at all, so the O2 consumed is nearly zero and RQ drops",
        "Carbohydrate is only partly oxidised, which is what forces its RQ up to exactly 1",
      ],
      reveal: "The second option is right. A fat molecule like tripalmitin carries lots of hydrogen and very little oxygen of its own, so oxidising it completely takes a large amount of O2 — in the tripalmitin equation, 145 O2 consumed against only 102 CO2 released, giving 102/145 = 0.7. Because O2 consumed (the denominator) is larger than CO2 evolved (the numerator), the ratio falls below 1. Option 1 is backwards — it's not extra CO2 but extra O2 consumption that lowers RQ. Option 3 is wrong: this is aerobic respiration and O2 is very much consumed. Option 4 is wrong: carbohydrate's RQ is 1 precisely because it is *completely* oxidised, giving equal CO2 and O2.",
      difficulty_level: 2,
    },
    // ── 12 · Text — the mixed-substrate caveat ───────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "One honest caution before you memorise these clean numbers: in **living organisms, the respiratory substrate is usually more than one at a time.** **Pure proteins or pure fats are never used alone** as respiratory substrates. So a real RQ measured from a living tissue is a blend — the tidy values of 1, 0.7 and 0.9 are the ideal single-fuel cases, not what you'd read off one lonely cell.",
    },
    // ── 13 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Amphibolic = catabolism + anabolism.** The respiratory pathway both breaks molecules down *and* supplies intermediates to build them up, so it's amphibolic, not merely catabolic.\n- **Where each fuel enters:** carbohydrates → converted to glucose → top of the pathway. Fats → glycerol (→ **PGAL**) + fatty acids (→ **acetyl CoA**). Proteins → proteases → amino acids → **deamination** → pyruvate / acetyl CoA / within Krebs' cycle.\n- **Key example of 'both ways':** fatty acids are broken to **acetyl CoA** to burn them; acetyl CoA is **withdrawn** from the pathway to build them.\n- **RQ = volume of CO2 evolved / volume of O2 consumed.**\n- **RQ values:** carbohydrates = **1.0** (equal CO2 & O2), fats = **0.7** (e.g. tripalmitin, extra O2 needed), proteins ≈ **0.9**.\n- In real organisms substrates are mixed — **pure fats or pure proteins are never respired alone.**",
    },
    // ── 14 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**RQ of fats is less than 1 (~0.7), carbohydrates exactly 1, proteins about 0.9.** The 0.7 for fats is the single most-tested value — remember *fats need more oxygen, so more O2 is consumed than CO2 released, pushing the ratio below 1.*\n\n**The respiratory pathway is best described as amphibolic, not catabolic** — because respiratory intermediates are both broken down (catabolism) and withdrawn for synthesis (anabolism). NEET loves the acetyl CoA example: broken down *from* fatty acids to respire them, withdrawn *to* synthesise them.\n\n**Classic NEET question:** \"The RQ for fats is ___\" → **less than 1 (about 0.7)**. And: \"The respiratory pathway is best described as ___\" → **amphibolic**.",
    },
    // ── 15 · Closing synthesis of the whole chapter ──────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "Step back and look at the whole chapter as one connected story. Every fuel starts by becoming **glucose**, which **glycolysis** splits in the cytoplasm into two **pyruvate**, banking a small amount of ATP. There the road forks by oxygen: with none, **fermentation** turns pyruvate into lactic acid or ethanol for a meagre payoff; with oxygen, pyruvate is fed into the mitochondrion, converted to **acetyl CoA**, and driven around the **Krebs' cycle**, which strips out CO2 and loads up the electron carriers NADH and FADH2. Those carriers hand their electrons to the **electron transport system**, where oxygen — the final electron acceptor — pulls the whole chain along and the ATP synthase mints the big harvest, so that complete aerobic respiration of one glucose yields about **38 ATP**. And on this same pathway, fats and proteins tap in at their own side-doors while intermediates are drawn back out to *build* those molecules — which is why respiration is not a one-way shredder but an **amphibolic** pathway, and why the **respiratory quotient** you measure from the CO2 and O2 gases quietly tells you which fuel is on the fire.",
    },
    // ── 16 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Why is the respiratory pathway better described as amphibolic rather than catabolic?",
          options: [
            "Because it releases both CO2 and O2 during the breakdown of glucose",
            "Because respiratory intermediates are both broken down for energy and withdrawn to synthesise fats and proteins — the pathway does catabolism and anabolism",
            "Because it can operate both with oxygen (aerobic) and without oxygen (anaerobic)",
            "Because it uses both the cytoplasm and the mitochondria to complete respiration",
          ],
          correct_index: 1,
          explanation: "'Amphibolic' means the pathway runs in both metabolic directions — breaking molecules down (catabolism) and supplying intermediates that are built up into new molecules (anabolism). Acetyl CoA is the textbook case: broken down from fatty acids to respire them, and withdrawn to synthesise them. Option 3 confuses amphibolic with the aerobic/anaerobic split (that's about oxygen, not build-up vs break-down), and option 4 confuses it with where respiration happens.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "A fat molecule is going to be respired. How do its two parts enter the respiratory pathway?",
          options: [
            "Glycerol enters as acetyl CoA; fatty acids enter after conversion to PGAL",
            "Both glycerol and fatty acids enter directly as glucose at the first step",
            "Glycerol enters after conversion to PGAL; fatty acids are degraded to acetyl CoA and enter there",
            "Fats enter only after being converted by proteases into amino acids",
          ],
          correct_index: 2,
          explanation: "A fat is first split into glycerol and fatty acids. The glycerol is converted to PGAL (a glycolysis intermediate) and joins there; the fatty acids are degraded to acetyl CoA and enter at that point. Option 1 swaps the two entry molecules. Option 2 is wrong because fats don't become glucose or enter at the first step. Option 4 describes proteins, not fats — proteases act on proteins.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The respiratory quotient (RQ) is defined as:",
          options: [
            "The ratio of the volume of O2 consumed to the volume of CO2 evolved",
            "The ratio of the volume of CO2 evolved to the volume of O2 consumed",
            "The ratio of energy released to oxygen consumed during respiration",
            "The ratio of ATP produced to glucose oxidised in respiration",
          ],
          correct_index: 1,
          explanation: "RQ = volume of CO2 evolved ÷ volume of O2 consumed. Option 1 is the formula flipped upside down — a common trap; keep CO2 on top, O2 on the bottom. Options 3 and 4 describe other ratios entirely (energy or ATP yield), not the respiratory quotient.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "A cell is respiring a fatty acid such as tripalmitin. What RQ do you expect, and why?",
          options: [
            "RQ = 1, because equal amounts of CO2 and O2 are exchanged",
            "RQ greater than 1, because fats release far more CO2 than the O2 they consume",
            "RQ about 0.9, the same value obtained for proteins",
            "RQ about 0.7, because oxidising a hydrogen-rich fat consumes more O2 than the CO2 it releases",
          ],
          correct_index: 3,
          explanation: "Fats give an RQ below 1 — for tripalmitin it works out to 102 CO2 / 145 O2 = 0.7. Fat is hydrogen-rich and oxygen-poor, so completely oxidising it needs a lot of extra O2, making O2 consumed (denominator) exceed CO2 evolved (numerator). Option 1 (RQ = 1) is the carbohydrate case. Option 2 has it backwards — fats consume more O2, they don't over-release CO2. Option 3 gives the protein value (~0.9), not the fat value.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
