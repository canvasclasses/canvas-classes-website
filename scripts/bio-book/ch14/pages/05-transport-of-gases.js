'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'transport-of-gases',
  title: 'Transport of Gases — Oxygen & Carbon Dioxide',
  subtitle: "Once oxygen crosses into the blood and carbon dioxide crosses out, something has to carry each of them across the body. Learn who does the carrying, in what form, and the exact percentages NEET asks you to quote.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['breathing-and-exchange-of-gases', 'gas-transport'],
  glossary: [
    { term: 'haemoglobin', definition: 'A red-coloured, iron-containing pigment present inside RBCs. Oxygen binds to it reversibly, and each haemoglobin molecule can carry a maximum of four O2 molecules.' },
    { term: 'oxyhaemoglobin', definition: 'The compound formed when oxygen binds reversibly to haemoglobin. It forms in the alveoli and breaks apart at the tissues.' },
    { term: 'partial pressure of O2 (pO2)', definition: 'The pressure contributed by oxygen alone in a gas mixture. It is the main factor that decides how much oxygen binds to haemoglobin.' },
    { term: 'oxygen dissociation curve', definition: 'The sigmoid (S-shaped) curve obtained when the percentage saturation of haemoglobin with O2 is plotted against pO2. Used to study how factors like pCO2, H+ and temperature affect O2 binding.' },
    { term: 'carbamino-haemoglobin', definition: 'The form in which about 20–25% of carbon dioxide is carried — CO2 bound directly to haemoglobin. Binding depends on pCO2 and is affected by pO2.' },
    { term: 'carbonic anhydrase', definition: 'An enzyme present in very high concentration inside RBCs (and in tiny amounts in plasma) that speeds up the reaction CO2 + H2O ⇌ H2CO3 ⇌ HCO3– + H+ in both directions.' },
    { term: 'bicarbonate (HCO3–)', definition: 'The ion in which about 70% of carbon dioxide is transported in the blood. It forms at the tissues and is converted back to CO2 at the alveoli.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A stream of deep-red blood cells flowing through a vessel, some glowing faintly as if carrying a bright load, against a dark background',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single-file stream of rounded, deep-red blood cells flows through a softly lit blood vessel that curves gently across the frame, from the darkness on the left toward a faintly brighter opening on the right. A few of the cells carry a soft, warm inner glow, as if quietly holding a bright cargo, without becoming a literal labelled diagram. Deep shadows fill the surrounding space, with subtle red and warm highlights along the vessel wall. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Your Blood Barely Dissolves Any Oxygen At All',
      markdown: "You might picture oxygen simply dissolving into your blood like sugar into water. It barely does. Only about **3 per cent** of the oxygen your blood carries travels dissolved in the plasma. The other **97 per cent** hitches a ride on **haemoglobin** inside your red blood cells — because plain plasma is nowhere near enough to keep you alive.",
    },
    // ── 2 · Core concept — overview + the fractions ──────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Once oxygen has crossed into the blood at the lungs and carbon dioxide has crossed out at the tissues, the blood becomes the **medium of transport** for both gases. But neither gas simply floats along dissolved in the watery part of the blood — most of each one is carried in a special packaged form.\n\nFor **oxygen (O2):** about **97 per cent** is transported by **RBCs** (bound to haemoglobin), and only the remaining **3 per cent** rides dissolved in the plasma.\n\nFor **carbon dioxide (CO2):** about **20–25 per cent** is transported by **RBCs** (as carbamino-haemoglobin), about **70 per cent** is carried as **bicarbonate**, and roughly **7 per cent** is carried dissolved in the plasma. Keep these two sets of numbers separate in your head — they are the most-tested facts on this page.",
    },
    // ── 3 · Heading — Oxygen transport ───────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'How Oxygen Is Carried',
      objective: "By the end of this you can explain why oxygen loads onto haemoglobin in the lungs and unloads at the tissues, and read the sigmoid oxygen dissociation curve.",
    },
    // ── 4 · Text — oxygen transport mechanism ────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Haemoglobin** is a red-coloured, iron-containing pigment sitting inside your RBCs. Oxygen binds to it in a **reversible** way — it can attach and then let go — forming **oxyhaemoglobin**. Each haemoglobin molecule can hold a **maximum of four O2 molecules**, no more.\n\nWhat decides how much oxygen actually binds? The main factor is the **partial pressure of O2 (pO2)** — simply how much oxygen is around. Three other factors nudge the binding as well: the **partial pressure of CO2 (pCO2)**, the **hydrogen ion (H+) concentration**, and the **temperature**.\n\nIf you plot the **percentage saturation of haemoglobin with O2** against **pO2**, you don't get a straight line — you get a smooth **S-shaped (sigmoid)** curve. This is the **oxygen dissociation curve**, and it's the tool biologists use to see how pCO2, H+ and temperature shift oxygen binding.\n\nHere's the payoff. In the **alveoli** there is high pO2, low pCO2, less H+, and lower temperature — every one of these favours the **formation of oxyhaemoglobin**, so oxygen loads on. In the **tissues** the opposite holds: low pO2, high pCO2, high H+, and higher temperature — all of which favour **dissociation**, so oxygen lets go right where the body needs it. Oxygen gets bound at the lung surface and released at the tissues. Every 100 mL of oxygenated blood delivers about **5 mL of O2** to the tissues under normal conditions.",
    },
    // ── 5 · Interactive image — oxygen dissociation curve ─────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'An oxygen dissociation curve: a sigmoid S-shaped line rising from the origin, with percentage saturation of haemoglobin on the vertical axis and partial pressure of oxygen on the horizontal axis',
      caption: '📸 Tap each dot to explore how the oxygen dissociation curve tells the loading-and-unloading story.',
      generation_prompt: "Scientific textbook illustration of the oxygen dissociation curve (Figure 14.5). Flat 2D educational diagram on a dark background (#0a0a0a near-black). A single smooth S-shaped (sigmoid) curve drawn as a clean white line, rising steeply in the middle and flattening into a plateau at the top right. Vertical y-axis labelled 'Percentage saturation of haemoglobin with oxygen' running 0 to 100; horizontal x-axis labelled 'Partial pressure of oxygen (mm Hg)' running 0 to 100, with thin white tick marks and gridlines. The steep lower-middle stretch of the curve tinted subtle red (tissue unloading region); the upper-right plateau tinted subtle blue (alveolar loading region). Clean white outlines and axis labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.06, y: 0.42, label: 'Y-axis — % saturation of haemoglobin', detail: "The vertical axis shows the **percentage of haemoglobin that is saturated with O2** — how full the haemoglobin is with oxygen, from 0 to 100.", icon: 'circle' },
        { id: uuid(), x: 0.55, y: 0.95, label: 'X-axis — partial pressure of O2', detail: "The horizontal axis shows the **partial pressure of O2 (pO2)** in mm Hg. pO2 is the main factor deciding how much O2 binds to haemoglobin.", icon: 'circle' },
        { id: uuid(), x: 0.42, y: 0.52, label: 'The sigmoid shape', detail: "The curve is **S-shaped (sigmoid)**, not a straight line. This shape is what makes it so useful for studying how pCO2, H+ concentration and temperature affect O2 binding.", icon: 'circle' },
        { id: uuid(), x: 0.82, y: 0.22, label: 'Alveoli — loading zone', detail: "The high-pO2 plateau at the top right matches the **alveoli**: high pO2, low pCO2, less H+, lower temperature. All of these favour **formation of oxyhaemoglobin**, so O2 loads on.", icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.68, label: 'Tissues — unloading zone', detail: "The steep low-pO2 stretch matches the **tissues**: low pO2, high pCO2, high H+, higher temperature. These favour **dissociation** of O2 from oxyhaemoglobin, so O2 is released to the cells.", icon: 'circle' },
        { id: uuid(), x: 0.88, y: 0.12, label: '≈ 5 mL O2 delivered', detail: "Because O2 binds at the lung surface and lets go at the tissues, every **100 mL of oxygenated blood delivers about 5 mL of O2** to the tissues under normal conditions.", icon: 'circle' },
      ],
    },
    // ── 6 · Heading — Carbon dioxide transport ───────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'How Carbon Dioxide Is Carried',
      objective: "By the end of this you can name the three forms CO2 travels in, and explain how carbonic anhydrase runs the same reaction one way at the tissues and the reverse way at the alveoli.",
    },
    // ── 7 · Text — CO2 transport mechanism ───────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Carbon dioxide is carried in three ways. First, about **20–25 per cent** rides on haemoglobin as **carbamino-haemoglobin**. This binding depends on the **partial pressure of CO2 (pCO2)**, and **pO2** is a major factor that affects it too: where **pCO2 is high and pO2 is low, as in the tissues**, more CO2 binds; where **pCO2 is low and pO2 is high, as in the alveoli**, the CO2 dissociates and is delivered out.\n\nSecond — and this is the biggest share — most CO2 travels as **bicarbonate**. RBCs contain a **very high concentration of the enzyme carbonic anhydrase** (with tiny amounts also in the plasma). This enzyme speeds up the following reaction, and it works in **both directions**:\n\n**CO2 + H2O ⇌ H2CO3 ⇌ HCO3– + H+**\n\nAt the **tissue site**, pCO2 is high because of catabolism, so CO2 diffuses into the blood (RBCs and plasma) and the reaction runs forward to form **HCO3– and H+**. At the **alveolar site**, pCO2 is low, so the reaction runs the **opposite way**, releasing **CO2 and H2O** again. In other words, CO2 is trapped as bicarbonate at the tissues, carried to the alveoli, and let out there as CO2. Every 100 mL of deoxygenated blood delivers about **4 mL of CO2** to the alveoli.",
    },
    // ── 8 · Comparison card — the transport fractions ────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 8,
      title: 'How O2 and CO2 Split Across Their Carriers',
      columns: [
        { heading: 'Oxygen (O2)', points: [
          '≈ 97% — carried by RBCs, bound to haemoglobin as oxyhaemoglobin',
          '≈ 3% — dissolved in the plasma',
        ] },
        { heading: 'Carbon dioxide (CO2)', points: [
          '≈ 70% — carried as bicarbonate (HCO3–)',
          '≈ 20–25% — carried by RBCs as carbamino-haemoglobin',
          '≈ 7% — dissolved in the plasma',
        ] },
      ],
    },
    // ── 9 · Reasoning prompt — CO2 transport form check ───────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A student says: 'Since carbon dioxide is carried by haemoglobin the same way oxygen is, most CO2 must travel bound to haemoglobin.' Which single fact best shows this reasoning is wrong?",
      options: [
        "Most CO2 — about 70 per cent — is carried as bicarbonate, not on haemoglobin; only about 20–25 per cent rides on haemoglobin as carbamino-haemoglobin.",
        "All of the CO2 is dissolved in the plasma, and none of it binds to haemoglobin at all.",
        "CO2 binds to the same iron site on haemoglobin that oxygen uses, so the two always travel in equal amounts.",
        "About 97 per cent of CO2 is carried on haemoglobin, exactly matching how oxygen is transported.",
      ],
      reveal: "The first option is correct. The largest share of CO2 — around 70 per cent — travels as **bicarbonate (HCO3–)**, formed by carbonic anhydrase, while only about 20–25 per cent is carried on haemoglobin as carbamino-haemoglobin (and about 7 per cent dissolved in plasma). The tempting wrong answer is the last one — it borrows oxygen's 97 per cent figure, but that 97 per cent belongs to O2 on haemoglobin, not CO2. Only about 3 per cent of O2 is dissolved, whereas CO2 is spread across three forms with bicarbonate dominating.",
      difficulty_level: 2,
    },
    // ── 10 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "**Oxygen (O2):**\n- **≈ 97%** carried by RBCs on **haemoglobin** as **oxyhaemoglobin**; **≈ 3%** dissolved in plasma.\n- Each haemoglobin carries a **maximum of 4 O2 molecules**. Binding depends mainly on **pO2** (also pCO2, H+, temperature).\n- Plotting % saturation vs pO2 gives the **sigmoid oxygen dissociation curve**.\n- **Loads at the alveoli** (high pO2, low pCO2, low H+, low temp → oxyhaemoglobin forms); **unloads at the tissues** (low pO2, high pCO2, high H+, high temp → dissociation). Delivers **≈ 5 mL O2 per 100 mL** oxygenated blood.\n\n**Carbon dioxide (CO2):**\n- **≈ 70%** as **bicarbonate**, **≈ 20–25%** as **carbamino-haemoglobin**, **≈ 7%** dissolved in plasma.\n- **Carbonic anhydrase** (very high in RBCs) catalyses, both directions: **CO2 + H2O ⇌ H2CO3 ⇌ HCO3– + H+**.\n- Forward at the **tissues** (high pCO2), reverse at the **alveoli** (low pCO2). Delivers **≈ 4 mL CO2 per 100 mL** deoxygenated blood.",
    },
    // ── 11 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**The percentages are pure memory marks — write them down until they're automatic.** O2: 97% on haemoglobin, 3% dissolved. CO2: 70% bicarbonate, 20–25% carbamino-haemoglobin, 7% dissolved.\n\n**Don't mix up the two 97s and 70s.** The 97% figure is for O2 on haemoglobin; the 70% figure is for CO2 as bicarbonate. Questions love to swap these.\n\n**Classic NEET question:** \"Most of the carbon dioxide in blood is transported as ___\" → **bicarbonate (about 70%)**. And its partner: \"Each haemoglobin molecule can carry a maximum of ___ O2 molecules\" → **four**.",
    },
    // ── 12 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "You now know exactly how oxygen and carbon dioxide are packaged and ferried around the body, and the percentages NEET expects you to quote. Next, you'll see how the body **regulates** all this breathing — the respiratory centre that controls the rhythm — and what goes wrong in common respiratory disorders.",
    },
    // ── 13 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "How is the roughly 97 per cent of oxygen carried in the blood transported?",
          options: [
            "Dissolved in the plasma, since haemoglobin carries only a small fraction",
            "By RBCs, bound reversibly to haemoglobin as oxyhaemoglobin",
            "As bicarbonate ions formed by carbonic anhydrase inside the RBCs",
            "Bound to the plasma protein carbamino-haemoglobin outside the RBCs",
          ],
          correct_index: 1,
          explanation: "About 97 per cent of O2 is carried by RBCs, bound to haemoglobin as oxyhaemoglobin, and only about 3 per cent travels dissolved in plasma. Bicarbonate and carbamino-haemoglobin are the forms in which carbon dioxide — not oxygen — is transported, so those options belong to the CO2 story.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Where do conditions favour oxygen binding to haemoglobin (loading), and where do they favour its release (unloading)?",
          options: [
            "Loading in the tissues (high pO2) and unloading in the alveoli (low pO2)",
            "Loading and unloading both occur in the alveoli, since that is where haemoglobin meets oxygen",
            "Loading in the alveoli (high pO2, low pCO2, low H+, low temperature) and unloading in the tissues (low pO2, high pCO2, high H+, high temperature)",
            "Loading in the plasma and unloading inside the RBCs, driven only by temperature",
          ],
          correct_index: 2,
          explanation: "In the alveoli the conditions — high pO2, low pCO2, less H+, lower temperature — all favour the formation of oxyhaemoglobin, so O2 loads on. In the tissues the reverse conditions favour dissociation, so O2 is released. Option 1 flips the two sites; the alveoli have high pO2, not the tissues.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In which single form is the largest share of carbon dioxide transported in the blood?",
          options: [
            "As carbamino-haemoglobin, which carries about 70 per cent of the CO2",
            "As bicarbonate (HCO3–), which carries about 70 per cent of the CO2",
            "Dissolved in the plasma, which carries about 70 per cent of the CO2",
            "As oxyhaemoglobin, which carries about 70 per cent of the CO2",
          ],
          correct_index: 1,
          explanation: "About 70 per cent of CO2 is carried as bicarbonate, making it the dominant form. Carbamino-haemoglobin accounts for only about 20–25 per cent and dissolved CO2 for about 7 per cent. Oxyhaemoglobin is an oxygen-carrying form, not a CO2-carrying one, so it can't be the answer at all.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The enzyme carbonic anhydrase catalyses CO2 + H2O ⇌ H2CO3 ⇌ HCO3– + H+. Why does the same enzyme help both trap CO2 at the tissues and release it at the alveoli?",
          options: [
            "Because it catalyses the reaction in both directions: the high pCO2 at the tissues drives it forward to form HCO3–, while the low pCO2 at the alveoli drives it in reverse to release CO2",
            "Because a different enzyme runs the reverse reaction at the alveoli, while carbonic anhydrase only works at the tissues",
            "Because carbonic anhydrase permanently converts all CO2 into bicarbonate, which is then breathed out unchanged",
            "Because the enzyme works only when pO2 is high, so it is active in both the tissues and the alveoli equally",
          ],
          correct_index: 0,
          explanation: "Carbonic anhydrase catalyses the reaction in both directions. At the tissues the high pCO2 pushes it forward, forming HCO3– and H+; at the alveoli the low pCO2 pushes it the opposite way, regenerating CO2 and H2O to be breathed out. There is no separate enzyme for the reverse step, bicarbonate is not breathed out unchanged, and it is pCO2 — not pO2 — that sets the direction here.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
