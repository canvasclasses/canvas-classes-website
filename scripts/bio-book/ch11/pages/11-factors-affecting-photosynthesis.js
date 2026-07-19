'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'factors-affecting-photosynthesis',
  title: 'Factors Affecting Photosynthesis',
  subtitle: "A plant can have perfect leaves, full sunlight and plenty of water, and still barely photosynthesise — because the one factor running short quietly sets the ceiling for everything else. Meet Blackman's law and the four factors NEET tests every year.",
  page_number: 11,
  page_type: 'lesson',
  tags: ['photosynthesis-in-higher-plants', 'limiting-factors'],
  glossary: [
    { term: 'internal (plant) factors', definition: 'Features of the plant itself that affect how fast it photosynthesises — the number, size, age and orientation of leaves, the mesophyll cells and chloroplasts, the internal CO2 concentration, and the amount of chlorophyll.' },
    { term: 'external factors', definition: 'Conditions in the environment that affect photosynthesis — the availability of sunlight, temperature, CO2 concentration and water.' },
    { term: 'limiting factor', definition: 'When several factors act at once, the one that is nearest its minimal (sub-optimal) value — it caps the overall rate, and changing its quantity directly changes the rate.' },
    { term: "Blackman's Law of Limiting Factors", definition: 'Stated in 1905: if a process is affected by more than one factor, its rate is determined by the factor nearest to its minimal value — the factor that directly changes the rate when its quantity is changed.' },
    { term: 'light saturation', definition: 'The point where increasing light intensity no longer increases the rate of photosynthesis, because some other factor has become limiting. It occurs at about 10 per cent of full sunlight.' },
    { term: 'C3 plants', definition: 'Plants whose photosynthesis keeps increasing as CO2 rises and saturates only beyond 450 µL/L, and which have a much lower temperature optimum than C4 plants.' },
    { term: 'C4 plants', definition: 'Plants whose photosynthesis saturates at about 360 µL/L of CO2 and which respond to higher temperatures with higher rates of photosynthesis.' },
    { term: 'water stress', definition: "A shortage of water in the plant. Its effect on photosynthesis is mostly indirect — it closes the stomata (cutting off CO2) and wilts the leaves (cutting down surface area and metabolic activity)." },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single sunlit leaf in a dim forest, one shaft of light falling on it while the rest stays in deep shadow',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single green leaf catches one narrow shaft of warm sunlight breaking through a dark, dense forest canopy, while everything around it stays in deep shadow. Fine droplets of water sit on the leaf's surface, catching faint highlights. The mood suggests that light, warmth, air and water all have to line up for the leaf to work. Painterly, atmospheric illustration style, naturalistic, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Why Greenhouse Tomatoes Get Fed Extra Air',
      markdown: "In some commercial greenhouses, growers deliberately pump **extra carbon dioxide** into the air around their **tomato and bell pepper** plants. It sounds strange — you'd think normal air is enough. But these are **C3 plants**, and normal air holds so little CO2 that it is quietly holding their photosynthesis back. Give them a CO2-enriched atmosphere and their rate of photosynthesis climbs, and so does the yield. One invisible factor was capping everything — lift it, and the whole plant speeds up.",
    },
    // ── 2 · Core concept — internal vs external factors ──────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "How fast a plant photosynthesises decides how much it yields — which is why crop scientists care about it so much. The rate is pushed and pulled by **several factors at once**, and NCERT sorts them into two groups.\n\n**Internal (plant) factors** are features of the plant itself: the **number, size, age and orientation of its leaves**, its **mesophyll cells and chloroplasts**, its **internal CO2 concentration**, and the **amount of chlorophyll** it has. These depend on the plant's genes and how it has grown.\n\n**External factors** come from the environment: the availability of **sunlight**, **temperature**, **CO2 concentration**, and **water**.\n\nWhen a plant is photosynthesising, all of these act on it **simultaneously**. But here's the key idea — even though many factors interact at the same time, usually **just one factor is the real bottleneck**: the one that happens to be at a **sub-optimal level**. At any given moment, that under-supplied factor is what sets the rate.",
    },
    // ── 3 · Text — Blackman's Law of Limiting Factors ───────────────────────
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "This idea has a name. **Blackman's Law of Limiting Factors (1905)** states it exactly:\n\n> If a process is affected by more than one factor, its rate is determined by the factor which is **nearest to its minimal value** — the factor which directly affects the process if its quantity is changed.\n\nPicture it like this. Take a healthy **green leaf**, give it **optimal light** and **optimal CO2** — everything looks perfect. Yet the plant still **may not photosynthesise** if the **temperature is very low**. All the light in the world can't fix a rate that low temperature is holding down. Give that same leaf the **right temperature**, and it starts photosynthesising at once. Temperature was the factor nearest its minimum, so temperature was in charge — that is the limiting factor doing its job.",
    },
    // ── 4 · Heading — Light ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 4, level: 2,
      text: 'Light — And Why More Isn\'t Always Better',
      objective: "By the end of this you can explain why the light-vs-rate graph rises in a straight line, then flattens, and why light is rarely the factor holding photosynthesis back in nature.",
    },
    // ── 5 · Text — Light ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "With light, three separate things matter: its **quality** (colour/wavelength), its **intensity** (brightness), and the **duration** of exposure. Focus on intensity for the graph in Figure 11.10.\n\nAt **low light intensities**, there is a **linear relationship** between incident light and the rate of CO2 fixation — more light, proportionally more photosynthesis. But at **higher intensities**, the rise gradually stops: the curve **flattens out** because now **other factors have become limiting**. This flattening is called **light saturation**, and here's the striking part — it happens at only about **10 per cent of full sunlight**. So except for plants living in **shade or dense forests**, light is **rarely a limiting factor** in nature; there's almost always more than enough.\n\nAnd more light past a point actually hurts: incident light **beyond a certain point breaks down chlorophyll** and *decreases* photosynthesis.",
    },
    // ── 6 · Interactive image — Figure 11.10 light graph ─────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 6, src: '',
      alt: 'Line graph of the rate of photosynthesis (y-axis) against light intensity (x-axis): a straight-line rise at low intensity that bends and flattens into a plateau at higher intensity',
      caption: '📸 Tap each dot to explore how the rate of photosynthesis changes as light intensity rises — and where light stops being the factor in charge.',
      generation_prompt: "Scientific textbook illustration of a line graph showing the effect of light intensity on the rate of photosynthesis (based on NCERT Figure 11.10). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines. The y-axis is labelled 'Rate of photosynthesis' and the x-axis is labelled 'Light intensity', both in white text. A single smooth curve rises steeply and linearly from the origin at low light intensity, then gradually bends and flattens into a horizontal plateau at higher light intensity. Use a green curve line to signal photosynthesis. Mark the low-intensity portion as a straight diagonal line and the high-intensity portion as a level plateau. Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.06, y: 0.42, label: 'Rate of photosynthesis (y-axis)', detail: 'How fast the leaf is fixing CO2 into sugar. This is the output we are watching climb — or stop climbing — as we change the light.', icon: 'circle' },
        { id: uuid(), x: 0.55, y: 0.94, label: 'Light intensity (x-axis)', detail: 'How bright the incoming light is. We move rightward from dim to bright and watch what the rate does.', icon: 'circle' },
        { id: uuid(), x: 0.24, y: 0.66, label: 'Linear region (low light)', detail: 'At low light intensities the relationship is **linear** — every bit of extra light gives a proportional bump in CO2 fixation. Here light truly is the limiting factor, so adding it directly raises the rate.', icon: 'circle' },
        { id: uuid(), x: 0.46, y: 0.36, label: 'Light saturation (~10% of full sunlight)', detail: 'The curve bends here. **Light saturation occurs at about 10 per cent of full sunlight** — beyond this brightness, extra light no longer helps.', icon: 'circle' },
        { id: uuid(), x: 0.82, y: 0.24, label: 'Plateau (other factors now limit)', detail: 'At higher intensities the rate stops increasing and levels off, because **other factors have become limiting** (like CO2 or temperature). This is why, except in shade or dense forest, light is rarely what holds photosynthesis back.', icon: 'circle' },
        { id: uuid(), x: 0.9, y: 0.5, label: 'Too much light', detail: 'Push incident light **beyond a point** and it starts to **break down chlorophyll**, so photosynthesis actually *decreases*. More is not always better.', icon: 'circle' },
      ],
    },
    // ── 7 · Heading — Carbon dioxide ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Carbon Dioxide — The Major Limiting Factor',
      objective: "By the end of this you can say why CO2 is the biggest bottleneck for photosynthesis, and how C3 and C4 plants differ in the CO2 level at which they saturate.",
    },
    // ── 8 · Text — CO2 ───────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Of all four external factors, **carbon dioxide is the major limiting factor** for photosynthesis. The reason is simple: there is very little of it in the air — only between **0.03 and 0.04 per cent**. Raising the concentration up to about **0.05 per cent** increases CO2 fixation; push it higher than that and, over longer periods, the levels start to become **damaging**.\n\n**C3 and C4 plants respond differently.** Under low light, neither group responds to high CO2. But under **high light intensity**, both speed up — and they saturate at different points. **C4 plants** reach saturation at about **360 µL/L** of CO2. **C3 plants** keep responding to more CO2 and saturate only **beyond 450 µL/L**. Since the air's current CO2 is well below that, **current CO2 levels are limiting for C3 plants** — which is exactly why greenhouse crops like **tomato and bell pepper** are grown in CO2-enriched air for higher yields.",
    },
    // ── 9 · Heading — Temperature ────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Temperature — It Runs the Dark Reactions',
      objective: "By the end of this you can explain why temperature affects the dark reactions more than the light reactions, and how C3 and C4 plants differ in their temperature optimum.",
    },
    // ── 10 · Text — Temperature ──────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "The **dark reactions are enzymatic**, and enzymes are sensitive to temperature — so the dark reactions are **temperature controlled**. The **light reactions** are temperature sensitive too, but affected **much less**.\n\nHere the two plant types split again: **C4 plants respond to higher temperatures** and show a higher rate of photosynthesis, while **C3 plants have a much lower temperature optimum**. And the optimum also depends on where a plant lives — **tropical plants** have a **higher temperature optimum** than plants adapted to **temperate climates**.",
    },
    // ── 11 · Heading — Water ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 11, level: 2,
      text: 'Water — Its Effect Is Mostly Indirect',
      objective: "By the end of this you can explain why water limits photosynthesis mainly through the stomata and leaf area, not by running out as a raw material.",
    },
    // ── 12 · Text — Water ────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "Water is one of the **reactants** of the light reaction — but that is *not* mainly how it limits photosynthesis. Its effect works **through the plant** rather than directly on the reaction.\n\nWhen a plant is under **water stress**, two things happen. First, the **stomata close** — and closed stomata mean less CO2 can get in, so the plant is starved of its major raw material. Second, water stress makes the **leaves wilt**, which **reduces their surface area** and their **metabolic activity**. So a thirsty plant slows down for reasons that have almost nothing to do with water being used up inside the chloroplast.",
    },
    // ── 13 · Table — the four external factors ───────────────────────────────
    {
      id: uuid(), type: 'table', order: 13,
      caption: 'The four external factors, and the one NCERT fact NEET pulls from each',
      headers: ['Factor', 'Key NCERT fact'],
      rows: [
        ['Light', 'Linear rise at low intensity, then plateau; light saturation at ~10% of full sunlight, so rarely limiting except in shade/dense forest; excess light breaks down chlorophyll'],
        ['CO2', 'The MAJOR limiting factor; air holds only 0.03–0.04%; up to 0.05% raises fixation; C4 saturates ~360 µL/L, C3 only beyond 450 µL/L → current CO2 limits C3 plants'],
        ['Temperature', 'Controls the enzymatic dark reactions (light reactions much less sensitive); C4 respond to higher temperatures, C3 have a lower temperature optimum'],
        ['Water', 'Effect is mostly indirect — water stress closes stomata (less CO2) and wilts leaves (less surface area and metabolic activity)'],
      ],
    },
    // ── 14 · Reasoning prompt — apply Blackman's law ─────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 14, reasoning_type: 'logical',
      prompt: "A C3 plant sits in bright midday sun (well above light saturation), at its optimum temperature, with plenty of water — but in ordinary open air where CO2 is about 0.04%. According to Blackman's Law of Limiting Factors, which factor is setting the rate of its photosynthesis right now?",
      options: [
        "Light — it is the most abundant factor, so it drives the rate",
        "CO2 — it is the factor nearest its minimal value, and C3 plants keep responding to CO2 above ordinary air levels",
        "Temperature — because the dark reactions are enzymatic and enzymes always control the rate",
        "Water — because water is a reactant of the light reaction and is always the deciding factor",
      ],
      reveal: "The answer is CO2. Blackman's law says the rate is set by the factor **nearest its minimal value**, not the most abundant one. Here light is well past saturation, temperature is optimal and water is plentiful — none of those is short. But ordinary air holds only ~0.04% CO2, and a C3 plant does not saturate until beyond 450 µL/L, so it is still 'hungry' for more CO2. That makes CO2 the under-supplied, rate-setting factor. Light is a trap because 'most abundant' is the opposite of what limits a rate. Temperature and water sound plausible in general but here neither is at a sub-optimal level.",
      difficulty_level: 3,
    },
    // ── 15 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 15, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Blackman's Law of Limiting Factors (1905):** when a process is affected by more than one factor, the rate is set by the factor **nearest its minimal value** — the one that directly changes the rate when its quantity changes.\n- **CO2 is the MAJOR limiting factor.** Air holds only **0.03–0.04%**; up to **0.05%** raises fixation, beyond that it turns damaging over time.\n- **C4 saturates at ~360 µL/L CO2; C3 saturates only beyond 450 µL/L** → current air CO2 is limiting for **C3 plants**.\n- **Light saturation occurs at ~10% of full sunlight** → light is rarely limiting except in shade/dense forest. Excess light **breaks down chlorophyll**.\n- **Temperature** controls the **enzymatic dark reactions**; light reactions are far less sensitive. **C4 → higher temperature optimum; C3 → lower.**\n- **Water's effect is indirect:** water stress **closes stomata** (less CO2) and **wilts leaves** (less surface area).",
    },
    // ── 16 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 16, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**The single most-tested line:** the **major limiting factor** for photosynthesis is **CO2**. If a question asks which one factor limits photosynthesis most, the answer is carbon dioxide — not light.\n\n**Blackman's law, stated exactly:** the rate is decided by the factor **nearest its minimal value**, not the most plentiful one. NEET loves to hand you a scenario where light is abundant and tempt you into picking it.\n\n**Numbers to keep straight:** C4 saturates at **~360 µL/L** CO2, C3 only **beyond 450 µL/L**; light saturates at **~10% of full sunlight**; atmospheric CO2 is **0.03–0.04%**.\n\n**Classic NEET question:** \"The major limiting factor for photosynthesis is ______.\" → **CO2 (carbon dioxide)**.",
    },
    // ── 17 · Closing synthesis of the whole chapter ──────────────────────────
    {
      id: uuid(), type: 'text', order: 17,
      markdown: "Step back and look at the whole chapter as one connected machine. **Pigments in the chloroplast catch sunlight** — chlorophyll a at the centre, with accessory pigments widening the net. That captured light drives the **light reaction**, splitting water, releasing O2, and banking energy as **ATP and NADPH**. Those two products then power the **Calvin cycle (dark reaction)**, where CO2 is fixed and built, step by step, into **sugar**. Along the way you met the smart variations — **C4 plants** that concentrate CO2 to beat the wasteful **photorespiration** that dogs C3 plants in hot, bright conditions. And now this final piece: none of that machinery runs at full speed on its own. **Light, CO2, temperature and water** each set a ceiling, and at any moment the one running shortest — the limiting factor — quietly decides how fast the whole beautiful process is allowed to go. That is photosynthesis, from the first photon caught to the last factor that limits it.",
    },
    // ── 18 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 18, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "According to NCERT, which single factor is described as the major limiting factor for photosynthesis?",
          options: [
            "Light intensity, because photosynthesis begins with light",
            "Carbon dioxide, because its concentration in air is very low (0.03–0.04%)",
            "Temperature, because the dark reactions are enzymatic",
            "Water, because it is split during the light reaction",
          ],
          correct_index: 1,
          explanation: "NCERT names CO2 as the major limiting factor, and the reason is its scarcity — air holds only 0.03–0.04%. Light is a tempting pick because photosynthesis starts with it, but light saturates at just ~10% of full sunlight and is rarely limiting. Temperature and water do affect the rate, but neither is called the *major* limiting factor.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Blackman's Law of Limiting Factors states that when several factors affect a process, its rate is determined by which factor?",
          options: [
            "The factor present in the greatest amount",
            "The factor nearest to its minimal value",
            "The factor that changes most slowly over the day",
            "The factor that acts last in the reaction sequence",
          ],
          correct_index: 1,
          explanation: "Blackman's law is precise: the rate is set by the factor nearest its minimal (sub-optimal) value — the one that directly changes the rate when its quantity changes. 'Greatest amount' is the classic reversal trap; an abundant factor is exactly the one *not* limiting. The other two options describe timing, which the law says nothing about.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "How do C3 and C4 plants differ in the CO2 concentration at which their photosynthesis saturates?",
          options: [
            "C3 plants saturate at about 360 µL/L; C4 plants saturate only beyond 450 µL/L",
            "Both saturate at about 360 µL/L, so current air CO2 is enough for both",
            "C4 plants saturate at about 360 µL/L; C3 plants saturate only beyond 450 µL/L, so current air CO2 limits C3 plants",
            "Neither responds to CO2 at high light, so saturation never occurs",
          ],
          correct_index: 2,
          explanation: "NCERT gives the numbers directly: C4 plants saturate at ~360 µL/L, while C3 plants keep responding and saturate only beyond 450 µL/L — which is why present CO2 levels are limiting for C3 plants. Option 1 swaps the two groups. Option 2 ignores the C3–C4 difference, and option 4 contradicts the fact that both respond to CO2 under high light.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Water is a reactant in the light reaction, yet NCERT says its effect as a factor is mainly indirect. Why?",
          options: [
            "Because water stress closes the stomata (reducing CO2 intake) and wilts the leaves (reducing surface area and metabolic activity)",
            "Because water is broken down only in the dark reaction, not the light reaction",
            "Because water raises the temperature optimum of C3 plants to match C4 plants",
            "Because a shortage of water directly halts the splitting of water in photosystem II first",
          ],
          correct_index: 0,
          explanation: "NCERT is explicit that water's effect works through the plant, not directly on the reaction: water stress closes the stomata (so less CO2 gets in) and wilts the leaves (so surface area and metabolic activity drop). Option 4 describes a direct effect, which is exactly what NCERT says is *not* the main route. Options 2 and 3 state things NCERT never claims.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
