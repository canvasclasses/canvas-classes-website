'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'photorespiration-and-c3-vs-c4',
  title: 'Photorespiration & C3 vs C4 Plants',
  subtitle: "The most abundant enzyme in the world has one flaw — it can grab oxygen by mistake. Understand that one flaw and you understand why C4 plants out-produce C3 plants and shrug off the heat.",
  page_number: 10,
  page_type: 'lesson',
  tags: ['photosynthesis-in-higher-plants', 'photorespiration'],
  glossary: [
    { term: 'RuBisCO', definition: 'The enzyme that catalyses the first CO2 fixation step of the Calvin cycle (RuBP + CO2 → 2 molecules of 3PGA). It is the most abundant enzyme in the world, and its active site can bind both CO2 and O2 — which is why its full name is ribulose bisphosphate carboxylase-oxygenase.' },
    { term: 'carboxylase-oxygenase', definition: 'The dual nature of RuBisCO: as a carboxylase it fixes CO2 onto RuBP; as an oxygenase it instead attaches O2 to RuBP. Whichever gas is more concentrated at the active site decides which reaction happens.' },
    { term: 'competitive binding', definition: 'CO2 and O2 compete for the same active site on RuBisCO. It is the relative concentration of the two gases that determines which one binds — not a separate site for each.' },
    { term: 'photorespiration', definition: 'The wasteful pathway in C3 plants where RuBP binds O2 instead of CO2, forming one molecule of phosphoglycerate and one of phosphoglycolate (2-carbon). It makes no sugar, no ATP and no NADPH, and it releases CO2 while using up ATP.' },
    { term: 'phosphoglycolate', definition: 'The 2-carbon product formed alongside phosphoglycerate when RuBP combines with O2 in photorespiration.' },
    { term: 'bundle sheath cell', definition: 'The cell type in a C4 leaf where the C4 acid arriving from the mesophyll is broken down to release CO2, raising the CO2 concentration around RuBisCO so it works as a carboxylase.' },
    { term: 'primary CO2 acceptor', definition: 'The molecule that first accepts CO2 in a plant. In C3 plants it is RuBP (5 carbons); in C4 plants it is PEP (3 carbons).' },
    { term: 'Kranz anatomy', definition: 'The special leaf structure of C4 plants, with two distinct CO2-fixing cell types — mesophyll and bundle sheath — that lets them concentrate CO2 and avoid photorespiration.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A sunlit field of tall maize and sugarcane under a hot midday sky, with a nearby patch of ordinary green leaves in cooler shade',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A sunlit agricultural field at high noon: on one side, tall vigorous maize and sugarcane plants standing proud under a blazing hot sky with heat shimmer in the air; on the other side, a cooler shaded patch of ordinary broad green leaves. The contrast between the thriving heat-loving crop and the shaded ordinary plants is the whole mood, without any text or labels. Painterly, atmospheric, naturalistic illustration style, warm golden light, deep shadows, dark tones dominating the frame (#0a0a0a base tones), no diagram elements, no people, no text.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Most Common Enzyme on Earth Makes a Costly Mistake',
      markdown: "The single enzyme that does the first, most important step of trapping carbon — **RuBisCO** — is the **most abundant enzyme in the world**. There is more of it on this planet than any other enzyme. And yet this superstar enzyme has a built-in slip-up: its active site can grab the *wrong* gas. That one mistake is the whole reason maize and sugarcane grow faster in the heat than an ordinary green leaf does. This page is the story of that mistake.",
    },
    // ── 2 · Core concept — RuBisCO's dual, competitive nature ────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Go back to the very first step of the Calvin cycle. That's the reaction where **RuBP combines with CO2 to form 2 molecules of 3PGA**, and the enzyme that runs it is **RuBisCO**.\n\nHere's the catch that gives RuBisCO its full name (ribulose bisphosphate **carboxylase-oxygenase**): its **active site can bind to both CO2 and O2**. The same site accepts either gas. So which one does it pick? **This binding is competitive** — it is the **relative concentration of O2 and CO2** that determines which of the two will bind to the enzyme. When there's plenty of CO2 around, RuBisCO happily fixes CO2 the way we want. When O2 starts winning that competition, RuBisCO grabs O2 instead — and that's where the trouble starts.",
    },
    // ── 3 · Heading — Photorespiration ───────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Photorespiration — When RuBisCO Grabs the Wrong Gas',
      objective: "By the end of this you can say exactly what RuBP forms when it binds O2 instead of CO2, and why that pathway is a dead loss — no sugar, no ATP, no NADPH.",
    },
    // ── 4 · Text — the photorespiration pathway + interactive image ──────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "In **C3 plants**, some O2 does bind to RuBisCO, and so **CO2 fixation is decreased**. Instead of RuBP being converted to 2 molecules of PGA, the RuBP **binds with O2** to form **one molecule of phosphoglycerate and one molecule of phosphoglycolate (a 2-carbon compound)**. This pathway is called **photorespiration**.\n\nNow look at what the plant gets out of it — nothing useful. In the photorespiratory pathway there is **neither synthesis of sugars, nor of ATP, nor of NADPH**. Worse, it actually **releases CO2 while using up ATP**. So the plant spends energy and loses fixed carbon, all for no product. And here's the honest part NCERT states plainly: the **biological function of photorespiration is not known yet**. It looks like a costly accident of RuBisCO's dual nature.",
    },
    // ── 5 · Interactive image — RuBisCO's fork in the road ───────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A branching diagram showing RuBP at a fork: one arrow to CO2 leading to two molecules of PGA (photosynthesis), the other to O2 leading to PGA plus phosphoglycolate (photorespiration), with a bundle sheath inset showing CO2 being concentrated',
      caption: '📸 Tap each dot to follow which gas RuBisCO grabs — and why C4 plants rig the contest in favour of CO2.',
      generation_prompt: "Scientific textbook illustration of RuBisCO's competitive fork between photosynthesis and photorespiration. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Centre: the enzyme RuBisCO with a single active site, drawn with clean white outlines, holding a molecule of RuBP. Two labelled branching arrows leave it. UPPER branch: RuBP + CO2 → 2 molecules of 3PGA, drawn in healthy green to signal productive photosynthesis. LOWER branch: RuBP + O2 → one phosphoglycerate + one phosphoglycolate (a small 2-carbon molecule), drawn in dull grey/brown to signal the wasteful photorespiration pathway, with a small crossed-out sugar/ATP symbol showing 'no sugar, no ATP, no NADPH'. To the right, an inset of a C4 leaf cross-section (Kranz anatomy): a mesophyll cell passing a C4 acid into a bundle sheath cell where it breaks down to release concentrated CO2 (shown as many green CO2 dots crowding around RuBisCO). Biologically accurate proportions, labels in white text with thin white leader lines. Green = productive/CO2, grey-brown = wasteful, blue accents for cell outlines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.30, y: 0.45, label: 'RuBisCO — one site, two gases', detail: "The most abundant enzyme in the world. Its single active site can bind **either CO2 or O2**. The gas present in higher relative concentration wins the spot — the binding is competitive.", icon: 'circle' },
        { id: uuid(), x: 0.58, y: 0.24, label: 'CO2 branch → photosynthesis', detail: "When CO2 binds, **RuBP + CO2 → 2 molecules of 3PGA**. This is the productive Calvin-cycle step that eventually builds sugar.", icon: 'circle' },
        { id: uuid(), x: 0.58, y: 0.68, label: 'O2 branch → photorespiration', detail: "When O2 binds instead, **RuBP + O2 → one phosphoglycerate + one phosphoglycolate (2-carbon)**. CO2 fixation drops.", icon: 'circle' },
        { id: uuid(), x: 0.78, y: 0.72, label: 'A dead loss', detail: "The photorespiratory branch makes **no sugar, no ATP and no NADPH**. It **releases CO2 and uses up ATP** — pure cost. Its biological function is not known yet.", icon: 'circle' },
        { id: uuid(), x: 0.85, y: 0.35, label: 'C4 bundle sheath — rigging the contest', detail: "In C4 plants the C4 acid from the mesophyll is broken down **in the bundle sheath cells to release CO2**, raising the CO2 around RuBisCO so it acts as a carboxylase and the O2 branch is minimised.", icon: 'circle' },
      ],
    },
    // ── 6 · Heading — Why C4 plants escape it ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Why C4 Plants Escape Photorespiration',
      objective: "By the end of this you can explain the single trick — concentrating CO2 at the enzyme site — and connect it to the better yields and heat tolerance of C4 plants.",
    },
    // ── 7 · Text — the CO2-concentrating mechanism ───────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "In **C4 plants, photorespiration does not occur.** The reason is beautifully simple: they have a **mechanism that increases the concentration of CO2 at the enzyme site**. When the **C4 acid** made in the mesophyll travels into the **bundle sheath cells**, it is **broken down there to release CO2** — and this **raises the intracellular concentration of CO2** right where RuBisCO is sitting.\n\nRemember the competition rule from earlier? Flood the active site with CO2 and CO2 wins every time. So in the bundle sheath, **RuBisCO functions as a carboxylase, minimising the oxygenase activity**. The O2 branch barely gets a look-in. Because C4 plants dodge that wasteful pathway, **their productivity and yields are better**, and as a bonus **they tolerate higher temperatures** — which is exactly why heat-loving crops like maize and sugarcane are C4.",
    },
    // ── 8 · Reasoning prompt — why C4 escapes photorespiration ───────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "A C4 plant and a C3 plant are growing side by side in bright, hot sunlight. The C4 plant shows almost no photorespiration. What is the actual reason, according to NCERT?",
      options: [
        "C4 plants don't have RuBisCO at all, so there is no enzyme left to bind O2 by mistake.",
        "C4 plants break down a C4 acid in their bundle sheath cells to release CO2, raising the CO2 concentration at the enzyme site so RuBisCO acts as a carboxylase.",
        "C4 plants keep their stomata permanently shut, so no O2 can ever enter the leaf to compete with CO2.",
        "C4 plants use PEP instead of RuBisCO for the entire Calvin cycle, so the O2-binding enzyme is never used.",
      ],
      reveal: "Option 2 is correct. C4 plants concentrate CO2 exactly where it matters: the C4 acid from the mesophyll is broken down in the bundle sheath cells to release CO2, pushing the intracellular CO2 up so RuBisCO works as a carboxylase and the oxygenase (photorespiration) activity is minimised. Option 1 is wrong because C4 plants absolutely do have RuBisCO — it's in the bundle sheath cells doing the Calvin cycle. Option 4 is the tempting trap: PEP is only the *primary* CO2 acceptor in the mesophyll, but the Calvin cycle itself still runs on RuBisCO in the bundle sheath. Option 3 invents a stomata story NCERT never makes.",
      difficulty_level: 2,
    },
    // ── 9 · Heading — C3 vs C4 ───────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'C3 vs C4 — The Table NEET Loves',
      objective: "By the end of this you can fill Table 11.1 from memory: cell type, primary acceptor, fixation product, carbon counts, RuBisCO location, photorespiration and temperature optimum.",
    },
    // ── 10 · Text — how to read the comparison ───────────────────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "Everything on this page collapses into one comparison. The single idea to hold onto: **both C3 and C4 plants run the Calvin cycle and both have RuBisCO** — the difference is *where* it happens and *how well the plant protects RuBisCO from oxygen*. Read the table below row by row; each row is a favourite one-mark question.",
    },
    // ── 11 · Comparison table — Table 11.1 values ────────────────────────────
    {
      id: uuid(), type: 'table', order: 11,
      caption: 'C3 vs C4 plants — the contrasts from NCERT Table 11.1',
      headers: ['Characteristic', 'C3 Plants', 'C4 Plants'],
      rows: [
        ['Cell type where the Calvin cycle takes place', 'Mesophyll', 'Bundle sheath'],
        ['Primary CO2 acceptor', 'RuBP', 'PEP'],
        ['Number of carbons in the primary CO2 acceptor', '5', '3'],
        ['Primary CO2 fixation product', 'PGA', 'OAA'],
        ['Number of carbons in the primary fixation product', '3', '4'],
        ['Does the plant have RuBisCO?', 'Yes', 'Yes'],
        ['Which cells contain RuBisCO', 'Mesophyll', 'Bundle sheath'],
        ['Photorespiration', 'Present', 'Negligible'],
        ['Temperature optimum', '20–25°C', '30–40°C'],
      ],
    },
    // ── 12 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **RuBisCO binds CO2 *and* O2 at the same active site — competitively.** The relative concentration of the two gases decides which one wins.\n- **Photorespiration (C3):** RuBP + O2 → phosphoglycerate + **phosphoglycolate (2-carbon)**. **No sugar, no ATP, no NADPH** — it releases CO2 and uses up ATP. Biological function: **not known yet**.\n- **C4 plants concentrate CO2** in the **bundle sheath** (C4 acid broken down → releases CO2), so RuBisCO acts as a **carboxylase** → **no photorespiration** → **better yields + higher-temperature tolerance**.\n- **C3 vs C4 quick contrasts:** Calvin cycle in mesophyll (C3) vs bundle sheath (C4); primary acceptor RuBP-5C (C3) vs PEP-3C (C4); first product PGA-3C (C3) vs OAA-4C (C4); both have RuBisCO; temperature optimum 20–25°C (C3) vs 30–40°C (C4).",
    },
    // ── 13 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**RuBisCO's dual nature is a guaranteed line:** its active site binds **both CO2 and O2**, the binding is **competitive**, and the winner is set by the **relative concentration** of the two gases. NEET lifts this almost word-for-word.\n\n**Don't fall for the \"C4 has no RuBisCO\" trap:** C4 plants absolutely have RuBisCO — it sits in the **bundle sheath**. What they lack is *photorespiration*, because they keep CO2 high around that RuBisCO.\n\n**Classic NEET question:** \"In photorespiration, RuBP combines with ___ to form phosphoglycerate and phosphoglycolate.\" → **O2** (oxygen). And its partner question: \"Photorespiration occurs in ___ plants.\" → **C3** (it is negligible in C4).",
    },
    // ── 14 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "So a C3 plant loses carbon to photorespiration and a C4 plant cleverly avoids it — but both are still at the mercy of the world around them. On the next page you'll see the outside forces that speed up or slow down photosynthesis itself: light, CO2, temperature and water.",
    },
    // ── 15 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Why is RuBisCO called a carboxylase-oxygenase?",
          options: [
            "It can catalyse the Calvin cycle only in the presence of both carbon and oxygen gas together",
            "Its active site can bind to both CO2 and O2, and the relative concentration of the two decides which binds",
            "It carries oxygen to the mitochondria and carbon dioxide to the chloroplast in the same reaction",
            "It fixes CO2 during the day and releases O2 at night using the very same active site",
          ],
          correct_index: 1,
          explanation: "The name comes straight from the enzyme's active site being able to bind both CO2 (carboxylase role) and O2 (oxygenase role), with competitive binding decided by the relative concentrations of the two gases. The other options invent reactions NCERT never describes — RuBisCO doesn't need both gases together, it doesn't shuttle gases between organelles, and it has no day/night switch on its active site.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "In the photorespiratory pathway of a C3 plant, RuBP combines with O2 to form which products?",
          options: [
            "Two molecules of 3PGA, exactly as in normal CO2 fixation",
            "One molecule of phosphoglycerate and one molecule of phosphoglycolate (2-carbon)",
            "One molecule of OAA (4-carbon) and one molecule of PEP",
            "Two molecules of phosphoglycolate and a molecule of sugar",
          ],
          correct_index: 1,
          explanation: "When O2 binds instead of CO2, RuBP forms one phosphoglycerate and one phosphoglycolate (a 2-carbon compound) — that's the definition of the photorespiratory step. Option 1 is what happens with CO2 (the productive path), not O2. OAA and PEP belong to the C4 pathway, not photorespiration. And photorespiration makes no sugar at all, so option 4 is out.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which statement about the photorespiratory pathway is correct?",
          options: [
            "It synthesises ATP and NADPH but no sugar",
            "It synthesises sugar but consumes ATP",
            "It makes no sugar, no ATP and no NADPH, and it releases CO2 while using up ATP",
            "It fixes extra CO2 and boosts the plant's overall yield",
          ],
          correct_index: 2,
          explanation: "NCERT is blunt about this: photorespiration produces no sugar, no ATP and no NADPH, and it actually releases CO2 while consuming ATP — a net loss. Options 1 and 2 wrongly credit it with making energy carriers or sugar, and option 4 gets it backwards: photorespiration lowers, not boosts, a C3 plant's productivity.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Reading Table 11.1, which row correctly contrasts C3 and C4 plants?",
          options: [
            "Primary CO2 acceptor: RuBP in C3, PEP in C4; primary fixation product: PGA (3C) in C3, OAA (4C) in C4",
            "Calvin cycle happens in the bundle sheath in C3 and in the mesophyll in C4",
            "C3 plants have RuBisCO but C4 plants do not have RuBisCO at all",
            "Temperature optimum is 30–40°C for C3 plants and 20–25°C for C4 plants",
          ],
          correct_index: 0,
          explanation: "Option 1 matches Table 11.1 exactly: RuBP (C3) vs PEP (C4) as primary acceptors, and PGA-3C (C3) vs OAA-4C (C4) as first products. Option 2 swaps the cell types — the Calvin cycle is in the mesophyll for C3 and the bundle sheath for C4. Option 3 is the classic error: C4 plants do have RuBisCO (in the bundle sheath). Option 4 reverses the temperature optima — C3 is 20–25°C and C4 is the higher 30–40°C.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
