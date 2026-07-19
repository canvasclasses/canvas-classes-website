'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'photophosphorylation-and-chemiosmosis',
  title: 'Photophosphorylation & Chemiosmosis',
  subtitle: "You already know the light reaction splits water and pushes electrons through two photosystems. Now see exactly how that electron flow gets turned into ATP — the two ways it happens, and the proton-gradient machine that actually builds the molecule.",
  page_number: 7,
  page_type: 'lesson',
  tags: ['photosynthesis-in-higher-plants', 'photophosphorylation', 'chemiosmosis'],
  glossary: [
    { term: 'phosphorylation', definition: 'The process through which ATP is synthesised by cells — happening in both mitochondria and chloroplasts.' },
    { term: 'photophosphorylation', definition: 'The synthesis of ATP from ADP and inorganic phosphate in the presence of light.' },
    { term: 'non-cyclic photophosphorylation', definition: 'The ATP-making process that occurs when the two photosystems work in a series — first PS II, then PS I, connected by an electron transport chain (the Z scheme). Both ATP and NADPH + H+ are synthesised.' },
    { term: 'cyclic photophosphorylation', definition: 'The ATP-making process that occurs when only PS I is functional; the electron is circulated within the photosystem instead of passing to NADP+, so only ATP is made — not NADPH + H+.' },
    { term: 'stroma lamellae', definition: 'The membranes that connect the grana; a possible location for cyclic photophosphorylation because they lack PS II as well as the NADP reductase enzyme.' },
    { term: 'chemiosmotic hypothesis', definition: 'The explanation for how ATP is synthesised in the chloroplast — ATP synthesis is linked to the development of a proton gradient across the thylakoid membrane.' },
    { term: 'thylakoid lumen', definition: 'The space inside the thylakoid membrane, where protons accumulate during the light reaction to build the proton gradient.' },
    { term: 'ATP synthase', definition: 'The enzyme that makes ATP, made of two parts — CF0 (a transmembrane channel embedded in the thylakoid membrane) and CF1 (which protrudes on the stroma side).' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A softly glowing green thylakoid membrane deep inside a chloroplast, with faint currents of light suggesting energy being packed into molecules',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single softly glowing green thylakoid membrane sits deep inside a chloroplast, suspended in darkness. Faint warm currents of light are suggested flowing along and through the membrane, hinting at energy being gathered and packed into something, without becoming a literal labelled diagram. Deep green and teal shadows fill the rest of the frame, with subtle luminous highlights where the light meets the membrane. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Cell Runs on the Same Currency as a Battery',
      markdown: "Every living thing has the same problem: it needs energy *later*, but it captures energy *now*. The solution is to store that energy in a chemical bond and carry it around like cash. That carrier is **ATP** — and the act of making it is called **phosphorylation**. Your muscle cells do it in their mitochondria. A leaf does it in its chloroplasts. When a leaf makes ATP using the energy of light, it's doing **photophosphorylation** — the exact thing this page is about.",
    },
    // ── 2 · Core concept — what photophosphorylation is ──────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "**Photophosphorylation** is the synthesis of **ATP from ADP and inorganic phosphate in the presence of light**. Hold onto those three ingredients — ADP, inorganic phosphate (Pi), and light. Put them together and you build one molecule of ATP.\n\nThere are **two ways** a chloroplast can run this process, and the only difference between them is *how the electrons flow*. In one route the electrons travel in a straight line through both photosystems and never come back; in the other, they loop around and return to where they started. That single difference — straight line versus loop — decides whether the plant makes just ATP, or ATP **and** NADPH. Let's take them one at a time.",
    },
    // ── 3 · Heading — cyclic vs non-cyclic ──────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Two Routes: Non-cyclic vs Cyclic',
      objective: "By the end of this you can say which photosystems each route uses, what each one produces, and why cyclic photophosphorylation makes no NADPH.",
    },
    // ── 4 · Text — the two routes ───────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Non-cyclic photophosphorylation** happens when the **two photosystems work in a series** — first **PS II** and then **PS I**. The two photosystems are connected through an electron transport chain, which you've already met as the **Z scheme**. Because the electron travels all the way through this chain and ends up reducing NADP+, this route synthesises **both ATP and NADPH + H+**.\n\n**Cyclic photophosphorylation** happens when **only PS I is functional**. Here the excited electron does **not** pass on to NADP+. Instead it is **circulated within the photosystem** — cycled back to the PS I complex through the electron transport chain. Because the electron loops back instead of moving on to make NADPH, this route results **only in the synthesis of ATP, but not of NADPH + H+**.\n\nWhere does cyclic photophosphorylation happen? A possible location is the **stroma lamellae** — the membranes connecting the grana. The reason is structural: while the grana membranes have **both PS I and PS II**, the **stroma lamellae membranes lack PS II as well as the NADP reductase enzyme**. No PS II and no NADP reductase means the electron simply has nowhere to go except back to PS I. Cyclic photophosphorylation also occurs when **only light of wavelengths beyond 680 nm** is available for excitation.",
    },
    // ── 5 · Comparison card — cyclic vs non-cyclic ──────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 5,
      title: 'Cyclic vs Non-cyclic Photophosphorylation',
      columns: [
        {
          heading: 'Non-cyclic',
          points: [
            'Both photosystems work in series: PS II first, then PS I',
            'The two are connected by the electron transport chain (the Z scheme)',
            'Water is split (associated with PS II)',
            'Makes BOTH ATP and NADPH + H+',
            'Electron travels straight through and reduces NADP+',
          ],
        },
        {
          heading: 'Cyclic',
          points: [
            'Only PS I is functional',
            'Electron is circulated within the photosystem, back to PS I',
            'Electron does NOT pass on to NADP+',
            'Makes ATP only — NO NADPH + H+',
            'A possible location is the stroma lamellae (which lack PS II and NADP reductase); also occurs when only light beyond 680 nm is available',
          ],
        },
      ],
    },
    // ── 6 · Reasoning prompt — cyclic output check ──────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A chloroplast is running cyclic photophosphorylation in its stroma lamellae. A student claims it will produce a steady supply of NADPH to feed the next stage of photosynthesis. Why is that claim wrong?",
      options: [
        "Because in the cyclic route the electron is cycled back to PS I and never passes on to NADP+, so only ATP is made — no NADPH is produced at all",
        "Because the stroma lamellae contain PS II but not PS I, so no electron ever gets excited",
        "Because cyclic photophosphorylation makes NADPH but no ATP, so the student named the wrong product",
        "Because NADPH can only be made in complete darkness, and the cyclic route needs light",
      ],
      reveal: "Option 1 is right. In cyclic photophosphorylation only PS I is functional, and the excited electron is circulated within the photosystem — cycled back to PS I through the electron transport chain instead of passing on to NADP+. With no electron reaching NADP+, no NADPH + H+ can be made; the cyclic route yields ATP only. Option 3 reverses the products (cyclic makes ATP, not NADPH). Option 2 is backwards — the stroma lamellae actually lack PS II, not PS I. Option 4 is invented; the whole process needs light, and darkness makes nothing here.",
      difficulty_level: 2,
    },
    // ── 7 · Heading — Chemiosmosis ──────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Chemiosmosis — How the ATP Actually Gets Built',
      objective: "By the end of this you can explain what builds the proton gradient across the thylakoid membrane, which side the protons pile up on, and how ATP synthase turns that gradient into ATP.",
    },
    // ── 8 · Text — the chemiosmotic hypothesis ──────────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Knowing that ATP gets made is not the same as knowing *how*. The **chemiosmotic hypothesis** explains the mechanism. The idea is that ATP synthesis is linked to the development of a **proton gradient across a membrane** — here, the membrane of the **thylakoid**.\n\nThere's one key difference from respiration worth flagging now, because NEET loves it: in photosynthesis, the **proton accumulation is towards the inside of the membrane — inside the lumen** of the thylakoid. In respiration, protons instead accumulate in the intermembrane space of the mitochondria. Same idea (build a proton gradient), opposite compartment.\n\nSo what actually piles the protons up inside the lumen? **Three** things happen during the light reaction, and all three push protons the same way:\n\n**(a)** The **splitting of the water molecule takes place on the inner side of the membrane.** So the protons (H+ ions) produced by splitting water accumulate directly **within the lumen** of the thylakoids.\n\n**(b)** As electrons move through the photosystems, the **primary acceptor of the electron sits on the outer side of the membrane** and passes its electron not to an ordinary electron carrier but to an **H carrier**. To carry that electron, the H carrier **removes a proton from the stroma**. When it hands the electron to the next carrier on the inner side, it **releases that proton into the lumen**.\n\n**(c)** The **NADP reductase enzyme is on the stroma side** of the membrane. To reduce NADP+ to NADPH + H+, it needs protons — and it takes those protons **from the stroma** too.\n\nAdd it all up: protons in the **stroma decrease**, protons in the **lumen accumulate**. That builds a **proton gradient across the thylakoid membrane**, plus a measurable **drop in pH inside the lumen**.",
    },
    // ── 9 · Interactive image — chemiosmosis at the thylakoid ────────────────
    {
      id: uuid(), type: 'interactive_image', order: 9, src: '',
      alt: 'Cross-section of a thylakoid membrane showing water splitting releasing protons into the lumen, protons accumulating in the lumen, and ATP synthase with its CF0 channel and CF1 head on the stroma side',
      caption: '📸 Tap each dot to explore how the proton gradient forms and gets turned into ATP at the thylakoid membrane.',
      generation_prompt: "Scientific textbook illustration of ATP synthesis by chemiosmosis at a thylakoid membrane (Figure 11.7 style). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Show a horizontal thylakoid membrane in cross-section as a clean white double line, with the STROMA labelled above it and the thylakoid LUMEN labelled below it. On the lower/inner side, show water splitting (H2O breaking into H+ ions) releasing protons into the lumen. Show many small H+ proton symbols crowded and accumulating in the lumen below the membrane to depict a high proton concentration. Show an H carrier moving an electron across the membrane and dropping a proton into the lumen. On the right, show ATP synthase as a channel (CF0) embedded through the membrane with a rounded head (CF1) protruding UP into the stroma; show protons flowing up through the CF0 channel from lumen to stroma, and ADP + Pi combining into ATP at the CF1 head. Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. Blue for water, small warm-coloured dots for protons/H+. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.20, y: 0.78, label: 'Water splitting (inner side)', detail: "Splitting of the water molecule takes place on the **inner side** of the membrane. The protons (H+) it produces are released directly **into the lumen** — cause (a) of the gradient.", icon: 'circle' },
        { id: uuid(), x: 0.42, y: 0.82, label: 'Protons pile up in the lumen', detail: "Protons **accumulate inside the thylakoid lumen** — the inner side of the membrane. This is the opposite of respiration, where protons gather in the mitochondrial intermembrane space.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.30, label: 'H carrier moves a proton in', detail: "The primary electron acceptor on the **outer side** hands its electron to an **H carrier**, which removes a proton from the **stroma** and releases it into the **lumen** — cause (b).", icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.18, label: 'NADP reductase (stroma side)', detail: "**NADP reductase** sits on the **stroma side**. It uses protons taken **from the stroma** to reduce NADP+ to NADPH + H+ — cause (c). So stroma protons fall while lumen protons rise.", icon: 'circle' },
        { id: uuid(), x: 0.78, y: 0.50, label: 'CF0 channel', detail: "**CF0** is embedded in the thylakoid membrane and forms a **transmembrane channel** that carries out **facilitated diffusion** of protons back across the membrane toward the stroma.", icon: 'circle' },
        { id: uuid(), x: 0.80, y: 0.20, label: 'CF1 head makes ATP', detail: "**CF1** protrudes on the **stroma side**. When protons rush back through CF0, the breakdown of the gradient causes a **conformational change in CF1**, and it synthesises ATP from ADP + Pi.", icon: 'circle' },
      ],
    },
    // ── 10 · Text — breakdown of gradient → ATP synthase ────────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "Now for the payoff. Why do we care so much about this proton gradient? Because it is the **breakdown of the gradient that leads to the synthesis of ATP**. The protons that piled up in the lumen want to flow back down to the stroma, and there is only one door they can use: the **ATP synthase** enzyme.\n\nATP synthase has **two parts**. **CF0** is **embedded in the thylakoid membrane** and forms the **transmembrane channel** — it carries out **facilitated diffusion** of protons across the membrane. **CF1** **protrudes on the stroma side** of the membrane. As protons rush back through the CF0 channel, the breakdown of the gradient releases enough energy to cause a **conformational change in the CF1 particle**, and that change makes the enzyme **synthesise several molecules of ATP**.\n\nStrip it down to the essentials and **chemiosmosis requires four things**: a **membrane**, a **proton pump**, a **proton gradient**, and **ATP synthase**. Energy pumps protons across the membrane to create a high concentration of them in the lumen; ATP synthase gives them a channel back across; and that return flow releases the energy that builds the ATP.\n\nSo the light reaction hands the plant two products — **ATP** (built here by chemiosmosis) and **NADPH** (from the electron flow). Both are about to be spent immediately in the next stage: the biosynthetic reactions in the stroma that fix CO2 and build sugars — the Calvin cycle, coming up next.",
    },
    // ── 11 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Photophosphorylation** = synthesis of **ATP from ADP + inorganic phosphate in the presence of light**.\n- **Non-cyclic** = **both photosystems** (PS II then PS I, joined by the ETS / Z scheme) → makes **ATP AND NADPH + H+**.\n- **Cyclic** = **PS I only**, electron cycled back → makes **ATP only, no NADPH**. Possible site: **stroma lamellae** (they lack **PS II** and **NADP reductase**); also runs on light **beyond 680 nm**.\n- In **photosynthesis, protons accumulate in the thylakoid LUMEN** (in respiration, they go to the mitochondrial intermembrane space).\n- **ATP synthase = CF0 + CF1.** **CF0** = channel embedded in the membrane (facilitated diffusion of protons). **CF1** = protrudes on the **stroma side**; its conformational change makes the ATP.\n- **Chemiosmosis needs four things:** a membrane, a proton pump, a proton gradient, and ATP synthase.",
    },
    // ── 12 · Exam tip ───────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Non-cyclic vs cyclic — the products are the whole game:** non-cyclic uses both photosystems and makes ATP *and* NADPH; cyclic uses only PS I and makes ATP *only*. If a question mentions only PS I, or the stroma lamellae, or 'no NADPH' — it's pointing at cyclic.\n\n**The compartment trap:** in photosynthesis protons accumulate in the **thylakoid lumen**; in respiration they accumulate in the **mitochondrial intermembrane space**. Examiners swap these two on purpose.\n\n**CF0 vs CF1:** CF0 is the **channel in the membrane**; CF1 is the head on the **stroma side** that actually makes the ATP. Don't flip them.\n\n**Classic NEET question:** \"Cyclic photophosphorylation produces only ___.\" → **ATP** (no NADPH). And: \"In photosynthesis, protons accumulate in the ___.\" → **thylakoid lumen**.",
    },
    // ── 13 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "What exactly is photophosphorylation, as NCERT defines it?",
          options: [
            "The synthesis of ATP from ADP and inorganic phosphate in the presence of light",
            "The splitting of a water molecule into oxygen, protons, and electrons using light energy",
            "The reduction of NADP+ to NADPH using electrons from PS I",
            "The fixation of carbon dioxide into sugar using the ATP made in the stroma",
          ],
          correct_index: 0,
          explanation: "NCERT defines photophosphorylation as the synthesis of ATP from ADP and inorganic phosphate in the presence of light. Option 2 describes the splitting of water, option 3 describes NADP+ reduction, and option 4 describes the biosynthetic (Calvin) phase — all real events, but none of them is what the word photophosphorylation names.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "How does cyclic photophosphorylation differ from non-cyclic in what it produces and which photosystems it uses?",
          options: [
            "Cyclic uses only PS II and makes NADPH; non-cyclic uses only PS I and makes ATP",
            "Cyclic uses only PS I and makes ATP only; non-cyclic uses both photosystems in series and makes both ATP and NADPH + H+",
            "Cyclic uses both photosystems and makes only NADPH; non-cyclic uses only PS I and makes only ATP",
            "Both routes use both photosystems, but cyclic makes twice as much NADPH as non-cyclic",
          ],
          correct_index: 1,
          explanation: "In cyclic photophosphorylation only PS I is functional and the electron is cycled back, so only ATP is made. Non-cyclic uses the two photosystems in series (PS II then PS I, via the ETS) and makes both ATP and NADPH + H+. Option 1 swaps the photosystems and products; option 3 reverses which route makes NADPH; option 4 invents an NADPH output for cyclic, which makes none.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "In the chloroplast during photosynthesis, where do protons accumulate to build the gradient — and why is this worth remembering?",
          options: [
            "In the stroma, the same compartment where protons accumulate during respiration",
            "In the mitochondrial matrix, because chloroplasts and mitochondria share a membrane",
            "Inside the thylakoid lumen — unlike respiration, where protons accumulate in the mitochondrial intermembrane space",
            "In the intermembrane space of the chloroplast, exactly as in respiration",
          ],
          correct_index: 2,
          explanation: "NCERT stresses that in photosynthesis proton accumulation is towards the inside of the membrane — inside the thylakoid lumen. In respiration, protons accumulate in the intermembrane space of the mitochondria instead. Options 1, 2, and 4 all place the protons in the wrong compartment; this compartment swap is a favourite trap.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "ATP synthase has two parts, CF0 and CF1. What does each part do?",
          options: [
            "CF0 protrudes into the stroma and makes ATP; CF1 is the channel embedded in the membrane",
            "CF0 splits water to release protons; CF1 pumps those protons into the lumen",
            "Both CF0 and CF1 sit in the lumen and jointly pump protons back into the stroma",
            "CF0 is the transmembrane channel that lets protons diffuse across the membrane; CF1 protrudes on the stroma side and undergoes a conformational change that synthesises ATP",
          ],
          correct_index: 3,
          explanation: "CF0 is embedded in the thylakoid membrane as a transmembrane channel doing facilitated diffusion of protons; CF1 protrudes on the stroma side, and the breakdown of the proton gradient causes a conformational change in CF1 that makes the ATP. Option 1 swaps the two parts; option 2 wrongly assigns water splitting to ATP synthase; option 3 misplaces both parts in the lumen.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
