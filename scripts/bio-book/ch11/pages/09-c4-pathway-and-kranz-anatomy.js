'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'c4-pathway-and-kranz-anatomy',
  title: 'The C4 Pathway & Kranz Anatomy',
  subtitle: "Some plants split the job of catching CO2 across two different cells in the same leaf. Once you see which enzyme sits in which cell, every C4 question NEET can throw becomes a single trace of the loop.",
  page_number: 9,
  page_type: 'lesson',
  tags: ['photosynthesis-in-higher-plants', 'c4-pathway'],
  glossary: [
    { term: 'C4 pathway', definition: 'The photosynthetic pathway of plants adapted to dry tropical regions, whose first CO2-fixation product is a 4-carbon acid (oxaloacetic acid); also called the Hatch and Slack Pathway.' },
    { term: 'oxaloacetic acid (OAA)', definition: 'The 4-carbon acid formed in the mesophyll cells of a C4 plant — its first product of CO2 fixation.' },
    { term: 'Kranz anatomy', definition: "The special leaf anatomy of C4 plants in which large bundle sheath cells form a wreath around the vascular bundles. 'Kranz' means 'wreath'." },
    { term: 'bundle sheath cells', definition: 'The particularly large cells arranged around the vascular bundles of a C4 leaf; they have many chloroplasts, thick walls impervious to gaseous exchange, and no intercellular spaces.' },
    { term: 'mesophyll cells', definition: 'The photosynthetic cells of the leaf where, in a C4 plant, PEP fixes CO2 into OAA. In C4 plants the mesophyll cells lack RuBisCO.' },
    { term: 'phosphoenolpyruvate (PEP)', definition: 'The 3-carbon molecule that acts as the primary CO2 acceptor in the mesophyll cells of a C4 plant.' },
    { term: 'PEP carboxylase (PEPcase)', definition: 'The enzyme in the mesophyll cells that fixes CO2 onto PEP to form OAA. Bundle sheath cells lack this enzyme.' },
    { term: 'RuBisCO', definition: 'Ribulose bisphosphate carboxylase-oxygenase — the Calvin-cycle enzyme. In C4 plants it is present in the bundle sheath cells but absent from the mesophyll cells.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A sunlit field of tall maize plants under a hot, hazy tropical sky, with dry cracked earth at their roots',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A dense field of tall maize (corn) plants standing in intense midday tropical sunlight, their broad green leaves catching hard light, with dry, sun-baked cracked earth visible at their base. A hot hazy sky glows behind them. The mood is of heat and harsh light that ordinary plants would struggle in, yet these thrive. Painterly, atmospheric illustration style, warm dark tones grounding the frame (#0a0a0a base shadows in the soil and between the stems), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Plants That Love the Heat',
      markdown: "Maize and sorghum grow in exactly the conditions that make most plants suffer — dry, hot, blazing-sun tropical land. Where an ordinary plant would slow down, these speed up: they **tolerate higher temperatures**, respond to **high light intensities**, and pile on **more biomass**. The trick behind it is hidden inside the leaf — they run a second CO2-catching stage before the usual one, in a completely different set of cells.",
    },
    // ── 2 · Core concept — what C4 plants are and why special ────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Plants adapted to **dry tropical regions** run the **C4 pathway**. The name comes from their very first product of CO2 fixation: the **4-carbon** acid **oxaloacetic acid (OAA)** — a C4 compound. But here is the part students miss: catching CO2 into OAA is only the *first* step. For actually building sugars, C4 plants still use the **C3 pathway (the Calvin cycle)** as their **main biosynthetic pathway**, just like every other plant.\n\nSo if the sugar-making machinery is the same, what makes C4 plants different? Five things, straight from NCERT: they have a **special type of leaf anatomy**, they **tolerate higher temperatures**, they **respond to high light intensities**, they **lack photorespiration**, and they have **greater productivity of biomass**.",
    },
    // ── 3 · Heading — Kranz anatomy ──────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: "Kranz Anatomy — the 'Wreath' Around the Veins",
      objective: "By the end of this you can point to the bundle sheath cells in a C4 leaf and list the three things that make them different from ordinary cells.",
    },
    // ── 4 · Text — Kranz anatomy / bundle sheath cells ───────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Cut a vertical section of a C4 leaf — maize or sorghum — and look at the vascular bundles (the veins). Wrapped around each one you'll find **particularly large cells** called **bundle sheath cells**. A leaf built this way is said to have **Kranz anatomy**. *'Kranz'* means **'wreath'** — the ring of cells sits around the vein like a wreath, which is exactly what the name is describing.\n\nThese bundle sheath cells may form **several layers** around each vascular bundle, and three features set them apart:\n\n- a **large number of chloroplasts**,\n- **thick walls that are impervious to gaseous exchange** (gases can't leak in or out through them), and\n- **no intercellular spaces** between them.\n\nThat sealed, chloroplast-packed ring is not decoration — it's a chamber built to trap CO2. Spotting the bundle sheath around the vascular bundles is how you identify a C4 plant under the microscope.",
    },
    // ── 5 · Heading — Hatch and Slack Pathway ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'The Hatch and Slack Pathway — a Loop Between Two Cells',
      objective: "By the end of this you can trace the C4 cycle step by step and say which enzyme works in which cell, and where the Calvin cycle actually runs.",
    },
    // ── 6 · Text — the cyclic pathway, step by step ──────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "The C4 pathway is also called the **Hatch and Slack Pathway**, and it is a **cyclic** process — a loop that hands CO2 from one type of cell to another. Follow it one step at a time.\n\n**In the mesophyll cells** — the primary CO2 acceptor is a **3-carbon molecule, phosphoenolpyruvate (PEP)**. The enzyme that fixes CO2 onto it is **PEP carboxylase (PEPcase)**. This makes the **C4 acid OAA**, right there in the mesophyll. One fact to register firmly: **the mesophyll cells lack RuBisCO** — the Calvin-cycle enzyme is simply not present here.\n\n**The hand-off** — OAA is converted into other 4-carbon compounds (**malic acid** or **aspartic acid**), still inside the mesophyll, and these are **transported to the bundle sheath cells**.\n\n**In the bundle sheath cells** — the C4 acids are **broken down** to release **CO2** plus a **3-carbon molecule**. That released CO2 now enters the **C3 / Calvin pathway** — the same sugar-making pathway common to all plants. Bundle sheath cells are **rich in RuBisCO** for exactly this reason, **but they lack PEPcase**.\n\n**Closing the loop** — the 3-carbon molecule is **transported back to the mesophyll**, where it is turned into **PEP** again, ready to catch the next CO2. The cycle is complete.\n\nSo the two cells split the work cleanly: the mesophyll grabs CO2 with PEPcase (no RuBisCO), and the bundle sheath runs the Calvin cycle with RuBisCO (no PEPcase). In a C3 plant the Calvin cycle happens in **all the mesophyll cells**; in a C4 plant it does **not** happen in the mesophyll at all — it runs **only in the bundle sheath cells**.",
    },
    // ── 7 · Interactive image — Kranz anatomy + Hatch-Slack pathway ──────────
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'Diagram of a C4 leaf cross-section showing a mesophyll cell and a thick-walled bundle sheath cell, with arrows tracing the Hatch and Slack cycle between them',
      caption: '📸 Tap each dot to follow one loop of the Hatch and Slack Pathway between the two cells.',
      generation_prompt: "Scientific textbook illustration of the C4 (Hatch and Slack) pathway and Kranz anatomy. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Left side: a green mesophyll cell containing chloroplasts, labelled with PEP (3C) + CO2 combining via PEPcase to form OAA (4C); a note that the mesophyll cell lacks RuBisCO. A curved arrow shows the 4-carbon acid (malic/aspartic acid) being transported rightward. Right side: a larger green bundle sheath cell drawn with a distinctly thick outer wall and a dense ring of chloroplasts around it, wrapped like a wreath around a central vascular bundle (the vein). Inside it, the C4 acid breaks down to release CO2, which feeds a small labelled Calvin cycle (RuBisCO); note that the bundle sheath cell lacks PEPcase. A return arrow carries a 3-carbon molecule back leftward to the mesophyll to regenerate PEP, closing the cycle. Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines, green for the living photosynthetic cells, brown/tan for the thick bundle sheath wall, blue accents for CO2. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.16, y: 0.42, label: 'Mesophyll cell — CO2 is caught here', detail: "The primary CO2 acceptor is **PEP (3-carbon)**, and the enzyme **PEPcase** fixes CO2 onto it. Register this firmly: **the mesophyll cell has no RuBisCO**.", icon: 'circle' },
        { id: uuid(), x: 0.24, y: 0.66, label: 'OAA (4C) — the first product', detail: "PEP + CO2 gives **oxaloacetic acid (OAA)**, a **4-carbon** acid. This is the C4 plant's very first product of CO2 fixation.", icon: 'circle' },
        { id: uuid(), x: 0.44, y: 0.34, label: 'C4 acid ships across', detail: "OAA becomes another 4-carbon acid — **malic acid** or **aspartic acid** — still inside the mesophyll, and is **transported to the bundle sheath cell**.", icon: 'circle' },
        { id: uuid(), x: 0.70, y: 0.30, label: 'Bundle sheath cell — thick, sealed wall', detail: "A **large** cell with **many chloroplasts**, **thick walls impervious to gaseous exchange**, and **no intercellular spaces**. This wreath of cells around the vein is **Kranz anatomy**.", icon: 'circle' },
        { id: uuid(), x: 0.74, y: 0.55, label: 'CO2 released → Calvin cycle', detail: "Here the C4 acid is broken down to release **CO2 + a 3-carbon molecule**. The CO2 enters the **C3 / Calvin pathway**. Bundle sheath cells are **rich in RuBisCO** but **lack PEPcase**.", icon: 'circle' },
        { id: uuid(), x: 0.86, y: 0.42, label: 'Calvin cycle runs ONLY here', detail: "In a C4 plant the Calvin cycle does **not** run in the mesophyll — it runs **only in the bundle sheath cells**. (In a C3 plant it runs in all the mesophyll cells.)", icon: 'circle' },
        { id: uuid(), x: 0.46, y: 0.72, label: '3C molecule returns → closes the loop', detail: "The **3-carbon molecule** travels **back to the mesophyll**, where it is converted into **PEP** again — ready to catch the next CO2. The cyclic Hatch and Slack Pathway is complete.", icon: 'circle' },
      ],
    },
    // ── 8 · Comparison card — mesophyll vs bundle sheath ─────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 8,
      title: 'Mesophyll cell vs Bundle sheath cell (in a C4 plant)',
      columns: [
        {
          heading: 'Mesophyll cell',
          points: [
            'Has **PEP carboxylase (PEPcase)**',
            'CO2 acceptor is **PEP (3-carbon)**',
            'Makes the C4 acid **OAA** (first product)',
            '**No RuBisCO** — Calvin cycle does NOT run here',
          ],
        },
        {
          heading: 'Bundle sheath cell',
          points: [
            'Has **RuBisCO** — the **Calvin cycle runs here**',
            '**No PEPcase**',
            '**Thick walls** impervious to gaseous exchange',
            '**No intercellular spaces**; many chloroplasts (Kranz anatomy)',
          ],
        },
      ],
    },
    // ── 9 · Reasoning prompt — which cell / enzyme check ─────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A student is tracing the Hatch and Slack Pathway in a C4 leaf. Exactly one of the four statements below places an enzyme or a step in the wrong cell. Which statement is wrong?",
      options: [
        "PEPcase fixes CO2 onto PEP in the mesophyll cells to form OAA.",
        "The mesophyll cells contain RuBisCO, which is why the Calvin cycle begins there.",
        "The bundle sheath cells are rich in RuBisCO and run the Calvin cycle.",
        "The 3-carbon molecule returns to the mesophyll and is converted back into PEP.",
      ],
      reveal: "Statement 2 is the wrong one. The mesophyll cells **lack RuBisCO** — that is the whole point of the C4 design, and it is why the Calvin cycle does NOT run in the mesophyll of a C4 plant. RuBisCO sits in the **bundle sheath cells**, and that is the only place the Calvin cycle happens. The other three are correct: PEPcase does work in the mesophyll to make OAA, the bundle sheath cells are RuBisCO-rich and run the Calvin cycle, and the returning 3-carbon molecule does regenerate PEP in the mesophyll to close the loop.",
      difficulty_level: 2,
    },
    // ── 10 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **C4 plants** = adapted to **dry tropical regions** (e.g. maize, sorghum). They tolerate high temperature, respond to high light, lack photorespiration, and make more biomass.\n- **Kranz anatomy** = the large **bundle sheath cells** wreathing the vascular bundles ('Kranz' = 'wreath'). Bundle sheath cells: many chloroplasts, **thick walls impervious to gas exchange**, **no intercellular spaces**.\n- **Primary CO2 acceptor = PEP (3-carbon)**; enzyme = **PEPcase**, in the **mesophyll**. The **mesophyll lacks RuBisCO**.\n- **First product = OAA (4-carbon)**, formed in the mesophyll.\n- **Bundle sheath cells have RuBisCO** (run the Calvin cycle) but **lack PEPcase**.\n- In C4 plants the **Calvin cycle runs only in the bundle sheath cells** — never in the mesophyll (opposite of C3 plants).",
    },
    // ── 11 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**The favourite trap is swapping the two enzymes between the two cells.** Fix it once: **mesophyll → PEPcase (no RuBisCO)**, **bundle sheath → RuBisCO (no PEPcase)**. If you get those two lines right, most C4 questions collapse to one answer.\n\n**Carbon-counting check:** primary **acceptor PEP = 3 carbons**, first **product OAA = 4 carbons**. Don't let the '4' in 'C4' trick you into calling the acceptor a 4-carbon molecule — the acceptor is the 3-carbon PEP.\n\n**Classic NEET question:** \"The primary CO2 acceptor in C4 plants is ___\" → **phosphoenolpyruvate (PEP)**, a 3-carbon molecule — not RuBP, and not the 4-carbon OAA (that's the first *product*).\n\n**Also classic:** \"Kranz anatomy is characteristic of ___ plants\" → **C4** plants, marked by the large bundle sheath cells around the vascular bundles.",
    },
    // ── 12 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "You've now seen the one big advantage on the C4 list that we skipped over — they **lack photorespiration**. On the next page you'll find out what photorespiration actually is, why it wastes a C3 plant's effort, and how the C4 design quietly avoids it altogether.",
    },
    // ── 13 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "What is the primary CO2 acceptor in the C4 pathway, and how many carbons does it have?",
          options: [
            "Oxaloacetic acid, a 4-carbon molecule",
            "Phosphoenolpyruvate (PEP), a 3-carbon molecule",
            "Ribulose bisphosphate (RuBP), a 5-carbon molecule",
            "Malic acid, a 4-carbon molecule",
          ],
          correct_index: 1,
          explanation: "The primary CO2 acceptor is PEP, a 3-carbon molecule, in the mesophyll cells. OAA (option 1) is the 4-carbon first *product*, not the acceptor. RuBP is the acceptor in the Calvin cycle, not the C4 fixation step. Malic acid is one of the 4-carbon acids shipped to the bundle sheath, not the acceptor.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "In a C4 leaf, which enzyme is found in the mesophyll cells and which is found in the bundle sheath cells?",
          options: [
            "RuBisCO in the mesophyll; PEPcase in the bundle sheath",
            "PEPcase in both; RuBisCO in neither",
            "PEPcase in the mesophyll; RuBisCO in the bundle sheath",
            "RuBisCO in both; PEPcase only in the bundle sheath",
          ],
          correct_index: 2,
          explanation: "The mesophyll cells have PEPcase and lack RuBisCO; the bundle sheath cells are rich in RuBisCO and lack PEPcase. Option 1 reverses the two enzymes — the exact trap NEET sets. Options 2 and 4 misplace the enzymes as well; each enzyme sits in one cell type only.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which set of features correctly describes the bundle sheath cells of a C4 plant?",
          options: [
            "Few chloroplasts, thin walls, large intercellular spaces",
            "Many chloroplasts, thick walls impervious to gaseous exchange, no intercellular spaces",
            "No chloroplasts, thick walls, and rich in PEPcase",
            "Many chloroplasts, thin permeable walls, and lacking RuBisCO",
          ],
          correct_index: 1,
          explanation: "NCERT lists them exactly as option 2: a large number of chloroplasts, thick walls impervious to gaseous exchange, and no intercellular spaces. Option 3 wrongly gives them no chloroplasts and PEPcase (they have neither trait — PEPcase is in the mesophyll). Options 1 and 4 give thin walls, contradicting the thick sealed walls that let them trap CO2.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In which cells does the Calvin (C3) cycle actually operate in a C4 plant, and how does this differ from a C3 plant?",
          options: [
            "In the mesophyll cells of the C4 plant — the same as in a C3 plant",
            "In both mesophyll and bundle sheath cells of the C4 plant, unlike the C3 plant",
            "Only in the bundle sheath cells of the C4 plant, whereas in a C3 plant it runs in all the mesophyll cells",
            "Only in the mesophyll cells of the C4 plant, whereas in a C3 plant it runs only in the bundle sheath",
          ],
          correct_index: 2,
          explanation: "In a C4 plant the Calvin cycle does not take place in the mesophyll at all — it runs only in the bundle sheath cells (where RuBisCO lives). In a C3 plant, by contrast, the Calvin cycle runs in all the mesophyll cells. Options 1 and 4 wrongly place the C4 Calvin cycle in the mesophyll; option 2 wrongly adds the mesophyll on top of the bundle sheath.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
