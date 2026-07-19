'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'exchange-of-gases',
  title: 'Exchange of Gases at the Alveoli',
  subtitle: "No pump, no machinery — the O2 you just breathed in and the CO2 leaving your blood both cross into and out of your blood by nothing more than diffusion, pushed only by the difference in partial pressure. Learn the exact mm Hg numbers NEET lifts straight from Table 14.1.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['breathing-and-exchange-of-gases', 'gas-exchange'],
  glossary: [
    { term: 'alveoli', definition: 'The tiny air sacs of the lungs — the primary sites where gases are exchanged between the air and the blood.' },
    { term: 'diffusion', definition: 'The movement of a substance from a region of higher concentration (or pressure) to a region of lower concentration, without any energy or pump. This is how O2 and CO2 are exchanged.' },
    { term: 'partial pressure', definition: 'The pressure contributed by an individual gas in a mixture of gases. Written as pO2 for oxygen and pCO2 for carbon dioxide.' },
    { term: 'pO2', definition: 'The partial pressure of oxygen — how much of the total pressure in a mixture is contributed by oxygen alone.' },
    { term: 'pCO2', definition: 'The partial pressure of carbon dioxide — how much of the total pressure in a mixture is contributed by carbon dioxide alone.' },
    { term: 'diffusion membrane', definition: 'The barrier that gases cross at the alveolus, made of three major layers — the squamous epithelium of the alveoli, the endothelium of the alveolar capillaries, and the basement substance between them. Its total thickness is less than a millimetre.' },
    { term: 'solubility', definition: "How readily a gas dissolves. CO2 is 20–25 times more soluble than O2, so far more CO2 crosses the diffusion membrane per unit difference in partial pressure." },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A soft cluster of translucent alveolar air sacs wrapped in fine glowing capillaries, with faint drifting motes of gas crossing between them',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A soft cluster of translucent, grape-like alveolar air sacs floats in a dim, misty interior space, each sac wrapped in a fine net of softly glowing blood capillaries. Faint drifting motes of gas are suggested crossing the boundary between the air sacs and the capillary net — some warm reddish, some cool blue — without becoming a literal labelled diagram. Deep shadows fill the rest of the frame, with gentle warm and cool highlights on the moist membranes. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Your Lungs Have No Pump for Gases',
      markdown: "You'd expect something as important as loading oxygen into your blood to need a machine — a valve, a pump, some effort. It needs none. At the alveoli, oxygen simply **drifts** from where there's more of it (the air sac) to where there's less of it (your blood), and carbon dioxide drifts the other way. That's it. The entire exchange runs on **diffusion** — gases spreading down a difference in pressure, with no energy spent at all.",
    },
    // ── 2 · Core concept — alveoli as the exchange site, diffusion ───────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The **alveoli** — the tiny air sacs deep in your lungs — are the **primary sites of exchange of gases**. But they aren't the only place gases change hands: exchange **also occurs between blood and the tissues** of your body. At both places the same thing happens to **O2** and **CO2** — they are exchanged by **simple diffusion**.\n\nDiffusion just means a gas spreads from where there's more of it to where there's less of it, all on its own. So the whole exchange is driven **mainly by the pressure (concentration) gradient** — the difference in how much of each gas sits on either side of the barrier.",
    },
    // ── 3 · Text — the factors that affect the rate ─────────────────────────
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "The pressure gradient is the main driver, but it isn't the only thing that decides how fast a gas crosses. Two more factors matter:\n\n- **Solubility of the gas** — how readily it dissolves. A more soluble gas crosses faster.\n- **Thickness of the membrane** the gas has to diffuse through — a thinner barrier lets gases cross more easily.\n\nHold on to these three — **gradient, solubility, thickness** — because the rest of this page is really just those three factors playing out at the alveolus.",
    },
    // ── 4 · Heading — partial pressures & the gradients ─────────────────────
    {
      id: uuid(), type: 'heading', order: 4, level: 2,
      text: 'Partial Pressures and the Gradients They Create',
      objective: "By the end of this you can read Table 14.1, state the O2 and CO2 partial pressures at every site, and explain which way each gas is pushed.",
    },
    // ── 5 · Text — partial pressure defined ─────────────────────────────────
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "Air isn't one gas — it's a mixture. The **pressure contributed by one individual gas** inside that mixture is called its **partial pressure**. For oxygen we write it as **pO2**, and for carbon dioxide as **pCO2**.\n\nThe reason partial pressure matters is simple: a gas always diffuses from where its partial pressure is **high** to where it is **low**. So if you know the pO2 and pCO2 at each stop — the atmosphere, the alveoli, the blood, the tissues — you can read off exactly which way every gas moves. Here are those numbers (in mm Hg), straight from **Table 14.1**.",
    },
    // ── 6 · Table 14.1 ──────────────────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 6,
      caption: "📊 Table 14.1 — Partial pressures (in mm Hg) of O2 and CO2 at each site involved in diffusion, compared with the atmosphere.",
      headers: ['Respiratory Gas', 'Atmospheric Air', 'Alveoli', 'Deoxygenated Blood', 'Oxygenated Blood', 'Tissues'],
      rows: [
        ['O2 (pO2)', '159', '104', '40', '95', '40'],
        ['CO2 (pCO2)', '0.3', '40', '45', '40', '45'],
      ],
    },
    // ── 7 · Text — reading the gradients off the table ──────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Follow the **oxygen** row. In the alveoli pO2 is **104**; in deoxygenated blood it's only **40**. Oxygen moves from the higher to the lower value, so it flows **alveoli → blood**. That blood becomes oxygenated (pO2 **95**) and reaches the tissues, where pO2 is again just **40** — so oxygen flows once more, **blood → tissues**. The overall oxygen gradient runs **alveoli → blood → tissues**.\n\nNow the **carbon dioxide** row, which runs the opposite way. In the tissues pCO2 is **45**; in oxygenated blood it's **40** — so CO2 flows **tissues → blood**. That blood (now deoxygenated, pCO2 **45**) reaches the alveoli, where pCO2 is **40** — so CO2 flows **blood → alveoli**, ready to be breathed out. The overall CO2 gradient runs **tissues → blood → alveoli**.",
    },
    // ── 8 · Text — CO2 solubility ───────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Look back at the two rows and one thing seems odd. Oxygen's partial-pressure differences are large (104 vs 40), while carbon dioxide's are tiny (45 vs 40 — a gap of just 5 mm Hg). So how does the body get rid of enough CO2 across such a small gradient?\n\nThe answer is **solubility**. The solubility of **CO2 is 20–25 times higher** than that of O2. Because CO2 dissolves so much more readily, the **amount of CO2 that can diffuse through the membrane per unit difference in partial pressure is much higher** than for O2. A small pressure gap is enough for CO2 precisely because it is so soluble.",
    },
    // ── 9 · Comparison card — O2 vs CO2 diffusion ───────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'O2 vs CO2 Diffusion',
      columns: [
        {
          heading: 'Oxygen (O2)',
          points: [
            'Direction: alveoli → blood → tissues',
            'Driven by a large pressure gradient (alveoli 104 vs blood 40)',
            'Low solubility — needs the big gradient to move enough',
          ],
        },
        {
          heading: 'Carbon dioxide (CO2)',
          points: [
            'Direction: tissues → blood → alveoli (the opposite way)',
            'Only a small pressure gradient (tissues 45 vs blood 40)',
            'Solubility 20–25× that of O2 — so even a small gap moves plenty',
          ],
        },
      ],
    },
    // ── 10 · Heading — the diffusion membrane ───────────────────────────────
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'The Diffusion Membrane — Three Layers, Under a Millimetre',
      objective: "By the end of this you can name the three layers of the diffusion membrane in order and state its total thickness.",
    },
    // ── 11 · Text — three layers + interactive image ────────────────────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "The barrier a gas actually has to cross at the alveolus is called the **diffusion membrane**, and it is made of **three major layers**:\n\n1. The thin **squamous epithelium of the alveoli** — the wall of the air sac itself.\n2. The **endothelium of the alveolar capillaries** — the wall of the blood vessel.\n3. The **basement substance** in between the two — a thin basement membrane supporting the squamous epithelium plus the one surrounding the single-layer endothelial cells of the capillaries.\n\nHere's the point that makes it all work: the **total thickness of these three layers together is much less than a millimetre**. It's the \"thin membrane\" factor from earlier, made real — the barrier is so thin that all the factors in the body end up favouring the diffusion of O2 from alveoli to tissues, and of CO2 from tissues to alveoli.",
    },
    // ── 12 · Interactive image — the diffusion membrane ─────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 12, src: '',
      alt: 'Cross-section of the alveolus–capillary interface showing the three layers of the diffusion membrane, with oxygen diffusing into the blood and carbon dioxide diffusing out',
      caption: '📸 Tap each dot to explore the layers gases cross at the alveolus, and which way O2 and CO2 move.',
      generation_prompt: "Scientific textbook illustration of a cross-section through the diffusion membrane at the alveolus–capillary interface (Figure 14.4 style). Flat 2D educational diagram on a dark background (#0a0a0a near-black). On the left, the open air space inside an alveolus; on the right, the lumen of a blood capillary containing red blood cells (red). Between them, three clearly distinguishable thin layers drawn in sequence: (1) the thin squamous epithelium of the alveolus wall, (2) a middle basement substance layer, and (3) the endothelium of the capillary wall. Show a small oxygen molecule (labelled O2) with an arrow crossing from the alveolar air space into the capillary blood, and a carbon dioxide molecule (labelled CO2) with an arrow crossing the opposite way, from blood into the alveolar air. Clean white outlines, biologically accurate proportions with the whole membrane drawn as very thin, labels in white text with thin white leader lines. Functional colours: pink/magenta for the soft tissue membrane layers, red for blood and red blood cells, pale blue arrow for O2, faint grey arrow for CO2. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.30, y: 0.30, label: 'Squamous epithelium of alveoli', detail: "The thin wall of the air sac itself — layer 1 of the diffusion membrane. Being **squamous** (flat and thin) keeps the barrier as short as possible for gases to cross.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.30, label: 'Basement substance', detail: "Layer 2 — the material in between. It's a thin basement membrane supporting the alveolar squamous epithelium plus the one surrounding the capillary's endothelial cells.", icon: 'circle' },
        { id: uuid(), x: 0.70, y: 0.30, label: 'Endothelium of alveolar capillaries', detail: "Layer 3 — the wall of the blood capillary, a single layer of endothelial cells. Past this, the gas is in the blood.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.62, label: 'Total thickness < 1 mm', detail: "All three layers stacked together measure **much less than a millimetre**. This thinness is exactly why diffusion here is so easy.", icon: 'circle' },
        { id: uuid(), x: 0.20, y: 0.70, label: 'O2 in →', detail: "Oxygen diffuses **from the alveolus into the blood** (pO2 104 in the alveoli vs 40 in deoxygenated blood — high to low).", icon: 'circle' },
        { id: uuid(), x: 0.80, y: 0.70, label: 'CO2 out ←', detail: "Carbon dioxide diffuses **from the blood into the alveolus** (pCO2 45 in deoxygenated blood vs 40 in the alveoli — high to low), to be breathed out.", icon: 'circle' },
      ],
    },
    // ── 13 · Reasoning prompt — gradient / solubility check ─────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 13, reasoning_type: 'logical',
      prompt: "At the tissues, pCO2 is 45 mm Hg and in the oxygenated blood arriving there it is only 40 mm Hg — a gradient of just 5 mm Hg. Yet CO2 is unloaded from tissues into blood perfectly well across this tiny gap. Which reason best explains how such a small gradient still moves plenty of CO2?",
      options: [
        "CO2 is about 20–25 times more soluble than O2, so a lot of it diffuses per unit difference in partial pressure even when the gradient is small.",
        "The CO2 gradient actually runs from blood to tissues, so CO2 is pushed by a much larger pressure difference than it appears.",
        "An active pump in the tissue capillaries forces CO2 across the membrane, so the size of the gradient does not matter.",
        "The diffusion membrane at the tissues is thicker for O2 than for CO2, which speeds CO2 up regardless of the gradient.",
      ],
      reveal: "Option 1 is right. NCERT states the solubility of CO2 is 20–25 times higher than that of O2, so the amount of CO2 that diffuses per unit difference in partial pressure is much higher — a small 5 mm Hg gap is enough. Option 2 reverses the gradient: at the tissues CO2 runs tissues → blood (45 → 40), not the other way. Option 3 invents an active pump — the exchange is by simple diffusion, no energy or pump. Option 4 invents a gas-specific difference in membrane thickness; the membrane's thinness (< 1 mm) helps both gases, it isn't different for CO2.",
      difficulty_level: 2,
    },
    // ── 14 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Alveoli = the primary sites of gas exchange** (exchange also happens between blood and tissues). Everything moves by **simple diffusion**, driven mainly by the **pressure (concentration) gradient**.\n- **O2 gradient:** alveoli **104** → blood **40** → tissues **40**, so O2 flows **alveoli → blood → tissues**.\n- **CO2 gradient:** tissues **45** → blood **40** → alveoli **40**, so CO2 flows the opposite way, **tissues → blood → alveoli**.\n- **CO2 is 20–25 times more soluble than O2** — that's why its tiny 5 mm Hg gradient still moves plenty of gas.\n- **Diffusion membrane = 3 layers:** squamous epithelium of alveoli + basement substance + endothelium of alveolar capillaries. Total thickness **less than a millimetre**.",
    },
    // ── 15 · Exam tip ───────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 15, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Memorise the Table 14.1 numbers — NEET tests them directly.** Alveoli: pO2 **104**, pCO2 **40**. Deoxygenated blood: pO2 **40**, pCO2 **45**. Oxygenated blood: pO2 **95**, pCO2 **40**. Tissues: pO2 **40**, pCO2 **45**. Atmospheric air: pO2 **159**, pCO2 **0.3**.\n\n**Keep the two gradients straight:** O2 runs alveoli → tissues; CO2 runs tissues → alveoli. Reversing either direction is the classic trap.\n\n**Classic NEET question:** \"Exchange of gases at the alveoli occurs by ___\" → **simple diffusion**. And \"CO2 is ___ times more soluble than O2\" → **20–25**.",
    },
    // ── 16 · Bridge text ────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 16,
      markdown: "So the gases have crossed the membrane — O2 is now in the blood and CO2 is on its way out. But how does the blood actually carry all that oxygen to your tissues, and haul the carbon dioxide back? That's the next page: the transport of gases.",
    },
    // ── 17 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 17, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "By what process are O2 and CO2 exchanged at the alveoli, and what mainly drives it?",
          options: [
            "By active transport, driven mainly by energy from ATP in the alveolar cells",
            "By simple diffusion, driven mainly by the pressure (concentration) gradient of each gas",
            "By osmosis, driven mainly by the water potential difference across the membrane",
            "By facilitated transport through carrier proteins in the diffusion membrane",
          ],
          correct_index: 1,
          explanation: "NCERT is explicit: O2 and CO2 are exchanged by simple diffusion, based mainly on the pressure/concentration gradient — no energy or pump is used. Active transport (ATP) and facilitated transport (carrier proteins) both wrongly add machinery the alveoli don't use; osmosis is the movement of water, not these gases.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Using Table 14.1, which set of partial pressures (in mm Hg) is correct for the alveoli?",
          options: [
            "pO2 = 159 and pCO2 = 0.3",
            "pO2 = 95 and pCO2 = 40",
            "pO2 = 40 and pCO2 = 45",
            "pO2 = 104 and pCO2 = 40",
          ],
          correct_index: 3,
          explanation: "In the alveoli, pO2 is 104 and pCO2 is 40. pO2 159 / pCO2 0.3 is atmospheric air; pO2 95 / pCO2 40 is oxygenated blood; pO2 40 / pCO2 45 is deoxygenated blood (and the tissues). Mixing up which site a pair of numbers belongs to is the trap.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The partial-pressure gradient for CO2 between tissues and blood is only about 5 mm Hg, far smaller than the O2 gradient. Why is CO2 still exchanged in large amounts?",
          options: [
            "Because CO2 is 20–25 times more soluble than O2, so much more of it diffuses per unit difference in partial pressure",
            "Because the diffusion membrane is far thinner for CO2 than it is for O2",
            "Because CO2 molecules are smaller than O2 molecules and slip across the membrane faster",
            "Because CO2 is actively pumped across the membrane using energy, so the gradient is irrelevant",
          ],
          correct_index: 0,
          explanation: "NCERT states CO2 is 20–25 times more soluble than O2, so the amount of CO2 that diffuses per unit difference in partial pressure is much higher — a small gradient is enough. The membrane's thinness (< 1 mm) helps both gases equally, not CO2 alone; molecular size and an active pump are not part of NCERT's reasoning here (the exchange is by simple diffusion).",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which of these correctly lists the three major layers of the diffusion membrane and its total thickness?",
          options: [
            "Alveolar epithelium, a layer of surfactant, and a thick muscular wall — total thickness a few millimetres",
            "Squamous epithelium of alveoli, cartilage rings, and the endothelium of capillaries — total thickness less than a millimetre",
            "Squamous epithelium of alveoli, the basement substance, and the endothelium of alveolar capillaries — total thickness less than a millimetre",
            "Endothelium of capillaries, a layer of red blood cells, and the pleural membrane — total thickness about one centimetre",
          ],
          correct_index: 2,
          explanation: "The diffusion membrane has three major layers — the thin squamous epithelium of the alveoli, the endothelium of the alveolar capillaries, and the basement substance between them — with a total thickness much less than a millimetre. The other options swap in a muscular wall, red blood cells, the pleural membrane, or cartilage rings, none of which are layers of the diffusion membrane, and inflate the thickness.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
