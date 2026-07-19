'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'blood-plasma-and-formed-elements',
  title: 'Blood — Plasma & the Formed Elements',
  subtitle: "Blood looks like one red liquid, but spin it in a tube and it splits into two worlds — a straw-coloured fluid and a stack of living cells. Learn what floats in the fluid, and the exact numbers NEET makes you recite for each cell.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['body-fluids-and-circulation', 'blood'],
  glossary: [
    { term: 'connective tissue', definition: 'A tissue whose cells are spread out in a non-living matrix. Blood is a special connective tissue because its matrix — plasma — is a fluid instead of something solid.' },
    { term: 'plasma', definition: 'The straw-coloured, viscous fluid matrix of blood — about 55% of blood — made mostly of water with dissolved proteins, minerals, and nutrients.' },
    { term: 'serum', definition: 'Plasma with the clotting factors removed. Same fluid, minus the proteins that make blood clot.' },
    { term: 'formed elements', definition: 'The cells and cell fragments in blood — erythrocytes (RBCs), leucocytes (WBCs), and platelets — together making up about 45% of blood.' },
    { term: 'erythrocytes', definition: 'Red blood cells (RBCs): the most abundant blood cells, biconcave, without a nucleus in most mammals, and packed with haemoglobin.' },
    { term: 'haemoglobin', definition: 'A red, iron-containing protein inside RBCs that carries respiratory gases. A healthy person has 12–16 g of it in every 100 mL of blood.' },
    { term: 'leucocytes', definition: 'White blood cells (WBCs): colourless (no haemoglobin), nucleated, generally short-lived, split into granulocytes and agranulocytes.' },
    { term: 'platelets', definition: 'Also called thrombocytes — cell fragments pinched off from megakaryocytes that release the substances needed to clot blood.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A tall glass test tube of blood that has settled into two layers — a pale straw-coloured fluid resting above a deep red layer of packed cells — glowing softly against a dark laboratory background',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single tall glass test tube of blood stands upright in a dim laboratory, the blood having settled into two clearly separated layers: an upper layer of pale, translucent straw-yellow fluid, and a lower layer of deep, rich red packed cells, with a faint thin boundary between them. Soft warm light catches the curve of the glass; the rest of the frame falls into deep shadow. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Blood Is Not Actually One Liquid',
      markdown: "Draw blood into a tube and let it stand, and it quietly separates on its own. A pale, straw-coloured fluid rises to the top; a dense red layer of cells sinks to the bottom. That top fluid is **plasma** — about **55%** of your blood. The heavy red layer underneath is the **formed elements**, the living cells — about **45%**. The famous red colour you picture when you think of blood belongs to just that lower layer, not the whole thing.",
    },
    // ── 2 · Core concept — blood is a connective tissue ──────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Blood is a **special connective tissue**. That sounds strange at first — we picture connective tissue as something like a ligament or bone, something you can hold. But every connective tissue is really just **cells scattered in a matrix** (a background material the cells sit in). What makes blood special is that its matrix is a **fluid** instead of a solid. That fluid matrix is called **plasma**, and the cells suspended in it are called the **formed elements**.\n\nSo blood has two parts, and only two: the **fluid matrix (plasma)** and the **formed elements (the cells)**. Learn everything on this page as belonging to one of those two buckets and the whole topic falls into place.",
    },
    // ── 3 · Heading — Plasma ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Plasma — the Fluid That Carries Everything',
      objective: "By the end of this you can say what plasma is made of, name its three major proteins and each one's job, and state exactly what turns plasma into serum.",
    },
    // ── 4 · Text — plasma composition + proteins ─────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Plasma** is a **straw-coloured, viscous** (slightly thick) fluid, and it makes up nearly **55%** of blood. Break down what's in it: **90–92% is plain water**, and **proteins make up 6–8%**. Those proteins are the important part, and there are three major ones you must know by name and job:\n\n- **Fibrinogen** — needed for **clotting** (coagulation) of blood.\n- **Globulins** — mainly involved in the body's **defense** mechanisms.\n- **Albumins** — help maintain **osmotic balance** (holding water in the right places).\n\nPlasma also carries small amounts of **minerals** — Na⁺, Ca²⁺, Mg²⁺, HCO₃⁻, Cl⁻, and others. And it holds **glucose, amino acids, and lipids** — but these are just **in transit**, being ferried from one part of the body to another, not stored there.",
    },
    // ── 5 · Text — clotting factors and serum ────────────────────────────────
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "Plasma also contains the **factors that clot blood**, but they float around in an **inactive form** — switched off until an injury calls them into action. This detail leads straight to one of the most-tested one-liners in the whole chapter:\n\n**Plasma without the clotting factors is called serum.** Same straw-coloured fluid — just take the clotting factors out of plasma, and what remains is serum.",
    },
    // ── 6 · Heading — Formed elements ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Formed Elements — RBCs, WBCs & Platelets',
      objective: "By the end of this you can identify each formed element in a diagram and recite its NEET numbers — RBC and WBC counts, RBC lifespan, and where platelets come from.",
    },
    // ── 7 · Text — the three formed elements + RBC detail ────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "**Erythrocytes, leucocytes, and platelets** together are the **formed elements**, and they make up nearly **45%** of blood. Tap the dots on the diagram below to meet each one, then lock in the RBC facts here.\n\n**Erythrocytes**, or **red blood cells (RBC)**, are the **most abundant** of all the cells in blood. A healthy adult man has, on average, **5 million to 5.5 million RBCs per mm³** of blood. They are formed in the **red bone marrow** in adults. In **most mammals** they are **devoid of a nucleus** and are **biconcave** in shape (like a disc pressed in on both sides). Each RBC is packed with **haemoglobin** — a **red, iron-containing** protein — which is exactly why the cells are red and get their name; a healthy person has **12–16 g of haemoglobin in every 100 mL of blood**, and it does the real work of **transporting respiratory gases**. An RBC lives about **120 days**, after which it is destroyed in the **spleen — the graveyard of RBCs**.",
    },
    // ── 8 · Interactive diagram — formed elements gallery ────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'A gallery of the formed elements of blood drawn side by side: a biconcave red RBC, tiny platelets, and the white blood cells — neutrophil, eosinophil, basophil, monocyte, and B and T lymphocytes',
      caption: '📸 Tap each dot to explore the formed elements of blood (Figure 15.1).',
      generation_prompt: "Scientific textbook illustration of the formed elements of blood, arranged as a labelled gallery of separate cells on a dark background (#0a0a0a near-black). Flat 2D educational diagram, clean white outlines, biologically accurate proportions. Show, clearly separated: a red biconcave RBC (erythrocyte) shown as a dimpled disc; a small cluster of tiny irregular platelets; a neutrophil with a multi-lobed nucleus and fine pale granules; an eosinophil with a two-lobed nucleus and coarse granules; a basophil with dark granules; a large monocyte with a kidney-bean-shaped nucleus; and two lymphocytes (B and T) as round cells with a single large round nucleus. Red RBC in red, white blood cells in pale pink/magenta cytoplasm with purple-toned nuclei, platelets in a muted pink. Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.10, y: 0.40, label: 'RBC (Erythrocyte)', detail: 'The most abundant blood cell — **5–5.5 million/mm³**. **Biconcave**, **no nucleus** in most mammals, full of **haemoglobin**. Lives ~**120 days**, then destroyed in the spleen.', icon: 'circle' },
        { id: uuid(), x: 0.16, y: 0.78, label: 'Platelets (Thrombocytes)', detail: 'Cell **fragments** from **megakaryocytes**. Normal count **1,50,000–3,50,000/mm³**. They release the substances that **clot blood**.', icon: 'circle' },
        { id: uuid(), x: 0.42, y: 0.36, label: 'Neutrophil', detail: 'A **granulocyte** and the **most abundant WBC (60–65%)**. **Phagocytic** — it engulfs and destroys foreign organisms entering the body.', icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.40, label: 'Eosinophil', detail: 'A **granulocyte** (**2–3%**). Resists infections and is associated with **allergic reactions**.', icon: 'circle' },
        { id: uuid(), x: 0.44, y: 0.80, label: 'Basophil', detail: 'A **granulocyte** and the **least abundant WBC (0.5–1%)**. Secretes **histamine, serotonin, heparin** and drives **inflammatory reactions**.', icon: 'circle' },
        { id: uuid(), x: 0.66, y: 0.80, label: 'Monocyte', detail: 'An **agranulocyte** (**6–8%**). Like the neutrophil, it is **phagocytic** — it destroys foreign organisms.', icon: 'circle' },
        { id: uuid(), x: 0.80, y: 0.36, label: 'B & T Lymphocytes', detail: '**Agranulocytes** (**20–25%**), of two major types — **B** and **T**. Both are responsible for the body\'s **immune responses**.', icon: 'circle' },
      ],
    },
    // ── 9 · Text — leucocytes + platelets ────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "**Leucocytes**, or **white blood cells (WBC)**, are **colourless** — they lack haemoglobin, which is why they have no colour. Unlike RBCs, they **are nucleated**, they are fewer in number (**6000–8000 per mm³** on average), and they are **generally short-lived**. WBCs split into **two categories**:\n\n- **Granulocytes** — **neutrophils, eosinophils, basophils**.\n- **Agranulocytes** — **lymphocytes, monocytes**.\n\nAmong all WBCs, **neutrophils are the most abundant (60–65%)** and **basophils are the least (0.5–1%)**. **Neutrophils and monocytes (6–8%)** are **phagocytic** — they destroy foreign organisms that enter the body. **Basophils** secrete **histamine, serotonin, heparin** and drive **inflammatory reactions**. **Eosinophils (2–3%)** resist infections and are linked to **allergic reactions**. **Lymphocytes (20–25%)** come in two forms — **'B' and 'T'** — and both handle the body's **immune responses**.\n\n**Platelets**, also called **thrombocytes**, are **cell fragments** pinched off from **megakaryocytes** (special cells in the bone marrow). Blood normally holds **1,50,000–3,50,000 platelets per mm³**. They release the substances that **clot blood** — so if their number drops, you get **clotting disorders** and can lose too much blood.",
    },
    // ── 10 · Table — WBC types ───────────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 10,
      caption: 'The five white blood cell types — category, share of total WBCs, and job',
      headers: ['WBC type', 'Category', '% of WBCs', 'Main function'],
      rows: [
        ['Neutrophil', 'Granulocyte', '60–65% (most abundant)', 'Phagocytic — destroys foreign organisms'],
        ['Eosinophil', 'Granulocyte', '2–3%', 'Resists infections; linked to allergic reactions'],
        ['Basophil', 'Granulocyte', '0.5–1% (least abundant)', 'Secretes histamine, serotonin, heparin; inflammatory reactions'],
        ['Lymphocyte', 'Agranulocyte', '20–25%', "B and T types — responsible for immune responses"],
        ['Monocyte', 'Agranulocyte', '6–8%', 'Phagocytic — destroys foreign organisms'],
      ],
    },
    // ── 11 · Comparison card — RBC vs WBC vs Platelet ────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 11,
      title: 'RBC vs WBC vs Platelet',
      columns: [
        { heading: 'RBC (Erythrocyte)', points: ['Most abundant blood cell', '5–5.5 million/mm³', 'No nucleus (most mammals); biconcave', 'Has haemoglobin (12–16 g/100 mL)', 'Lifespan ~120 days; destroyed in spleen'] },
        { heading: 'WBC (Leucocyte)', points: ['6000–8000/mm³', 'Nucleated; colourless (no haemoglobin)', 'Generally short-lived', 'Granulocytes + agranulocytes', 'Defense — phagocytosis & immune responses'] },
        { heading: 'Platelet (Thrombocyte)', points: ['1,50,000–3,50,000/mm³', 'A cell fragment, not a whole cell', 'Made from megakaryocytes', 'Releases clotting substances', 'Low count → clotting disorders, blood loss'] },
      ],
    },
    // ── 12 · Reasoning prompt — most/least abundant WBC ──────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 12, reasoning_type: 'logical',
      prompt: "A lab report lists a patient's white blood cells from the single most abundant type down to the single least abundant type. Which pair correctly names the cell at the top of that list and the cell at the bottom?",
      options: [
        "Most abundant: Neutrophil · Least abundant: Basophil",
        "Most abundant: Lymphocyte · Least abundant: Eosinophil",
        "Most abundant: Basophil · Least abundant: Neutrophil",
        "Most abundant: Monocyte · Least abundant: Lymphocyte",
      ],
      reveal: "Neutrophils are the most abundant WBCs (60–65%) and basophils are the least (0.5–1%), so the first option is right. The tempting trap is the second option, because lymphocytes are genuinely the next-biggest share (20–25%) — but 'next-biggest' is not 'most abundant'; neutrophils still beat them by a wide margin. Option three simply flips the correct answer, and option four uses monocytes (6–8%), which are neither the highest nor the lowest.",
      difficulty_level: 2,
    },
    // ── 13 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Plasma = ~55% of blood** · **formed elements = ~45%**.\n- Plasma is **90–92% water**, **6–8% proteins**. Proteins: **Fibrinogen** (clotting), **Globulins** (defense), **Albumins** (osmotic balance).\n- **Serum = plasma minus the clotting factors.**\n- **RBC:** most abundant · **5–5.5 million/mm³** · **no nucleus** (most mammals) · **biconcave** · **haemoglobin 12–16 g/100 mL** · lifespan **~120 days** · destroyed in the **spleen (graveyard of RBCs)** · made in **red bone marrow**.\n- **WBC:** **6000–8000/mm³** · nucleated, colourless · two categories — **granulocytes** (neutrophil, eosinophil, basophil) and **agranulocytes** (lymphocyte, monocyte). **Neutrophil most (60–65%)**, **basophil least (0.5–1%)**.\n- **Platelets:** from **megakaryocytes** · **1,50,000–3,50,000/mm³** · release clotting substances.",
    },
    // ── 14 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Serum:** \"Plasma without the clotting factors\" — NEET lifts this line almost word-for-word. Do not confuse serum with plasma.\n\n**Neutrophil vs basophil:** neutrophil is the **most** abundant WBC (60–65%), basophil the **least** (0.5–1%). This most/least pair is a favourite.\n\n**Match the percentages:** Neutrophil 60–65 · Lymphocyte 20–25 · Monocyte 6–8 · Eosinophil 2–3 · Basophil 0.5–1. Memorise the order and the numbers — NEET tests both.\n\n**Classic NEET question:** \"Plasma without the clotting factors is called ___.\" → **serum.** And its twin: \"The most abundant WBC is ___.\" → **neutrophil.**",
    },
    // ── 15 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "You now know the two halves of blood — the plasma that carries everything, and the formed elements with their exact counts. On the next page, we look at the RBCs from a different angle: the surface markers they carry, which is what decides your **blood group** and who you can safely receive blood from.",
    },
    // ── 16 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Plasma without the clotting factors is called what?",
          options: [
            "Serum — the same fluid as plasma, but with the clotting factors removed",
            "Lymph — plasma that has drained out into the tissue spaces of the body",
            "Formed elements — the cellular fraction that settles below plasma in a tube",
            "Haemoglobin — the iron-containing protein released once plasma loses its cells",
          ],
          correct_index: 0,
          explanation: "By NCERT's definition, plasma with its clotting factors taken out is serum. Lymph is a separate body fluid, not 'plasma minus clotting factors'; the formed elements are the cells, not a fluid; and haemoglobin is an RBC protein, unrelated to what serum means.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which set of features correctly describes red blood cells in a healthy adult?",
          options: [
            "5–5.5 million/mm³, nucleated in all mammals, spherical, lifespan ~120 days",
            "6000–8000/mm³, no nucleus, biconcave, destroyed in the spleen",
            "5–5.5 million/mm³, no nucleus in most mammals, biconcave, lifespan ~120 days, destroyed in the spleen",
            "1,50,000–3,50,000/mm³, no nucleus, biconcave, destroyed in the red bone marrow",
          ],
          correct_index: 2,
          explanation: "The correct RBC profile is 5–5.5 million/mm³, no nucleus in most mammals, biconcave, ~120-day lifespan, destroyed in the spleen. Option 1 wrongly makes them nucleated and spherical; option 2 uses the WBC count (6000–8000); option 4 uses the platelet count (1,50,000–3,50,000) and wrongly says RBCs die in the bone marrow rather than the spleen.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which two white blood cells are the agranulocytes?",
          options: [
            "Neutrophils and eosinophils",
            "Lymphocytes and monocytes",
            "Basophils and neutrophils",
            "Eosinophils and basophils",
          ],
          correct_index: 1,
          explanation: "WBCs split into granulocytes (neutrophils, eosinophils, basophils) and agranulocytes (lymphocytes, monocytes). Only the second option lists the two agranulocytes; every other option is built entirely or partly from granulocytes.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Platelets are cell fragments produced from which cells, and what happens if their number falls too low?",
          options: [
            "Produced from megakaryocytes; a low count leads to clotting disorders and excessive blood loss",
            "Produced from red bone marrow stem cells directly as whole cells; a low count raises haemoglobin",
            "Produced from lymphocytes; a low count weakens the body's immune responses",
            "Produced from megakaryocytes; a low count causes the spleen to destroy RBCs faster",
          ],
          correct_index: 0,
          explanation: "Platelets (thrombocytes) are cell fragments from megakaryocytes, and they release the substances that clot blood — so a drop in their number causes clotting disorders and excessive blood loss. Option 2 wrongly calls them whole cells and links them to haemoglobin; option 3 confuses them with lymphocytes and immunity; option 4 gets the source right but invents an RBC-destruction effect NCERT never states.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
