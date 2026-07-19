'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'electron-transport-and-oxidative-phosphorylation',
  title: 'The Electron Transport System & Oxidative Phosphorylation',
  subtitle: "Glycolysis and the citric acid cycle didn't make much ATP — they made loaded electron carriers instead. Here is where those carriers finally get cashed in for ATP, on a chain of five complexes built into the inner mitochondrial membrane, with oxygen waiting at the very end.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['respiration-in-plants', 'electron-transport-system'],
  glossary: [
    { term: 'electron transport system (ETS)', definition: 'The metabolic pathway on the inner mitochondrial membrane through which electrons pass from one carrier to the next, from NADH/FADH2 down to oxygen — releasing the energy that drives ATP synthesis.' },
    { term: 'NADH dehydrogenase (complex I)', definition: 'The complex that oxidises NADH (produced in the matrix during the citric acid cycle) and passes its electrons on to ubiquinone.' },
    { term: 'ubiquinone', definition: 'A carrier located within the inner membrane that receives electrons from complex I and also from FADH2 via complex II. Its reduced form is called ubiquinol.' },
    { term: 'complex II', definition: 'The complex through which FADH2, generated during oxidation of succinate in the citric acid cycle, feeds its electrons into ubiquinone.' },
    { term: 'cytochrome bc1 complex (complex III)', definition: 'The complex that oxidises reduced ubiquinone (ubiquinol) and transfers its electrons onward to cytochrome c.' },
    { term: 'cytochrome c', definition: 'A small protein attached to the outer surface of the inner membrane that acts as a mobile carrier, ferrying electrons between complex III and complex IV.' },
    { term: 'cytochrome c oxidase (complex IV)', definition: 'The complex containing cytochromes a and a3 and two copper centres; it passes electrons to oxygen, the final acceptor.' },
    { term: 'ATP synthase (complex V)', definition: 'The complex that makes ATP from ADP and inorganic phosphate. It has an F1 headpiece (the catalytic site) and an F0 channel through which protons cross the inner membrane.' },
    { term: 'oxidative phosphorylation', definition: 'The making of ATP using the energy of oxidation-reduction (not light) to build the proton gradient across the inner mitochondrial membrane.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A glowing folded membrane deep inside a mitochondrion, with faint points of light moving along it like a relay in the dark',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). The deep interior of a mitochondrion: a long, softly glowing folded inner membrane winds across the frame in warm amber and teal light, with tiny points of light suggested moving along it in sequence, like a hidden relay passing something from one station to the next in the dark. A faint impression of a final droplet of water forming at the far end. Deep shadows fill the rest of the frame. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no literal diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'This Is the Reason You Breathe',
      markdown: "Every breath you take exists to serve the last step on this page. The oxygen you pull into your lungs isn't burned like fuel in a fire — it sits at the very **end** of a chain of carriers, quietly accepting the electrons that have been handed down the line. Its whole job is to grab hydrogen and clear the way. Take the oxygen away, and this chain backs up and stops — which is exactly why you can't survive without it.",
    },
    // ── 2 · Core concept — what the ETS is for ────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "By now, the earlier steps of respiration haven't actually made much ATP directly. What they made instead is a stack of **loaded electron carriers** — **NADH+H⁺** and **FADH2**. These carriers are holding energy, and this step is where that energy finally gets **released and used**.\n\nThe way to release it is to **oxidise** NADH+H⁺ and FADH2 — strip the electrons off them — and pass those electrons, carrier by carrier, until they reach **oxygen (O₂)**, which joins with them to form **water (H₂O)**. The pathway the electrons travel through, moving from one carrier to the next, is the **electron transport system (ETS)**. It sits in the **inner mitochondrial membrane** — remember that location, it matters.",
    },
    // ── 3 · Heading — the chain ───────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Electron Transport Chain — Following One Electron Down the Line',
      objective: "By the end of this you can trace an electron from NADH all the way to oxygen, naming every complex and carrier it passes through, in the correct order.",
    },
    // ── 4 · Text — the full path ──────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Follow a single electron. It starts on **NADH** — the NADH that was **produced in the mitochondrial matrix during the citric acid cycle**. That NADH is oxidised by **NADH dehydrogenase (complex I)**, and the electrons are handed to **ubiquinone**, a carrier sitting **within the inner membrane**.\n\nUbiquinone is a meeting point. It **also** receives electrons from a second source — **FADH2 (complex II)**, the FADH2 generated during the **oxidation of succinate** in the citric acid cycle. So both the NADH line and the FADH2 line feed into ubiquinone.\n\nNow the reduced ubiquinone — called **ubiquinol** — is oxidised in turn, passing its electrons to **cytochrome c** by way of the **cytochrome bc1 complex (complex III)**. **Cytochrome c** is a small protein on the **outer surface of the inner membrane**; it's a **mobile carrier**, shuttling electrons between complex III and complex IV. Finally the electrons reach **complex IV — cytochrome c oxidase** — which contains **cytochromes a and a3 and two copper centres**, and hands the electrons to oxygen.",
    },
    // ── 5 · Interactive image — ETS on the inner membrane ─────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'The electron transport system embedded in the inner mitochondrial membrane, showing complexes I to V, ubiquinone and cytochrome c, with electrons flowing to oxygen and water',
      caption: '📸 Tap each dot to follow the electrons from NADH all the way down to oxygen and ATP.',
      generation_prompt: "Scientific textbook illustration of the electron transport system embedded in the inner mitochondrial membrane. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A horizontal lipid-bilayer membrane runs across the frame with the intermembrane space above and the matrix below. Five protein complexes are embedded in the membrane, left to right: Complex I (NADH dehydrogenase), Complex II (feeding in FADH2 from succinate), a small mobile ubiquinone carrier within the membrane between I/II and III, Complex III (cytochrome bc1), a small cytochrome c protein on the outer surface of the membrane between III and IV, Complex IV (cytochrome c oxidase) where O2 combines with electrons and protons to form H2O, and Complex V (ATP synthase) drawn as a lollipop-shaped structure with an F0 base in the membrane and a round F1 headpiece in the matrix making ATP from ADP + Pi. Thin white arrows show the electron path from NADH into Complex I and along the chain to O2, and protons (H+) crossing through F0. Clean white outlines, labels in white text with thin white leader lines, biologically accurate proportions. Functional colours: pink/magenta protein complexes, blue for water, teal electron-flow arrows. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.10, y: 0.45, label: 'Complex I — NADH dehydrogenase', detail: 'Oxidises **NADH** (made in the matrix during the citric acid cycle) and transfers its electrons to ubiquinone.', icon: 'circle' },
        { id: uuid(), x: 0.26, y: 0.45, label: 'Complex II — FADH2 entry', detail: '**FADH2**, generated during oxidation of succinate in the citric acid cycle, feeds its electrons in here — they also flow into ubiquinone.', icon: 'circle' },
        { id: uuid(), x: 0.38, y: 0.50, label: 'Ubiquinone', detail: 'A carrier located **within the inner membrane**. It receives electrons from both complex I and complex II. Its reduced form is **ubiquinol**.', icon: 'circle' },
        { id: uuid(), x: 0.52, y: 0.45, label: 'Complex III — cytochrome bc1', detail: 'Oxidises reduced ubiquinone (ubiquinol) and transfers the electrons onward to **cytochrome c**.', icon: 'circle' },
        { id: uuid(), x: 0.63, y: 0.28, label: 'Cytochrome c', detail: 'A small protein on the **outer surface of the inner membrane**. It is a **mobile carrier**, ferrying electrons between complex III and complex IV.', icon: 'circle' },
        { id: uuid(), x: 0.74, y: 0.45, label: 'Complex IV — cytochrome c oxidase', detail: 'Contains **cytochromes a and a3 and two copper centres**. It passes the electrons to **O₂**, which becomes **H₂O**. Oxygen is the final acceptor.', icon: 'circle' },
        { id: uuid(), x: 0.90, y: 0.55, label: 'Complex V — ATP synthase', detail: 'The electrons passing complex I→IV are **coupled** to this complex, which makes **ATP** from ADP and inorganic phosphate.', icon: 'circle' },
      ],
    },
    // ── 6 · Table — the five complexes ────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 6,
      caption: 'The five complexes of the electron transport chain, in order',
      headers: ['Complex', 'Name', 'What it does'],
      rows: [
        ['Complex I', 'NADH dehydrogenase', 'Oxidises NADH (from the matrix, made in the citric acid cycle); passes electrons to ubiquinone'],
        ['Complex II', '(FADH2 entry point)', 'Feeds in electrons from FADH2 (from oxidation of succinate); these also go to ubiquinone'],
        ['Complex III', 'Cytochrome bc1 complex', 'Oxidises reduced ubiquinone (ubiquinol); transfers electrons to cytochrome c'],
        ['Complex IV', 'Cytochrome c oxidase', 'Contains cytochromes a, a3 and two copper centres; passes electrons to O₂ → H₂O'],
        ['Complex V', 'ATP synthase', 'Coupled to the electron flow through I–IV; makes ATP from ADP + inorganic phosphate'],
      ],
    },
    // ── 7 · Heading — oxidative phosphorylation & ATP synthase ────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Oxidative Phosphorylation & the ATP-Making Machine',
      objective: "By the end of this you can say why this process is called oxidative phosphorylation, and split ATP synthase into its two parts — F1 and F0 — knowing exactly what each does.",
    },
    // ── 8 · Text — yields, oxygen's role, why "oxidative", F1/F0 ───────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "As the electrons pass **from carrier to carrier via complex I to IV**, that flow is **coupled to ATP synthase (complex V)**, which builds **ATP from ADP and inorganic phosphate**. How much ATP you get depends on **which carrier the electrons came from**: oxidation of **one NADH gives 3 ATP**, while oxidation of **one FADH2 gives 2 ATP**. (FADH2 gives less because it enters lower down the chain, at complex II.)\n\nWhere does oxygen fit? Aerobic respiration needs oxygen, but the role of oxygen is **limited to the terminal stage** — the very end. There, **oxygen acts as the final hydrogen acceptor**. That single job is vital: by **removing hydrogen** from the system, oxygen keeps the whole chain moving. Take it away and everything upstream jams.\n\nAnd why the name? In photophosphorylation, **light energy** builds the proton gradient. Here in respiration, it's the **energy of oxidation-reduction** that builds it. That is why this process is called **oxidative phosphorylation**.\n\nThe machine that actually makes the ATP is **ATP synthase (complex V)**, and it has **two parts**. The **F1 headpiece** is a peripheral membrane protein that carries the **site for synthesis of ATP** from ADP and inorganic phosphate. **F0** is an integral membrane protein that forms the **channel through which protons cross the inner membrane**. For **each ATP produced, 4 H⁺ pass through F0** from the intermembrane space into the matrix, down the electrochemical proton gradient.",
    },
    // ── 9 · Comparison card — F1 vs F0 ────────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'F1 vs F0 — the two parts of ATP synthase',
      columns: [
        { heading: 'F1 (headpiece)', points: [
          'Peripheral membrane protein complex',
          'Sticks out into the matrix (the headpiece)',
          'Holds the site for synthesis of ATP from ADP + inorganic phosphate',
          'This is where ATP is actually MADE',
        ] },
        { heading: 'F0 (channel)', points: [
          'Integral membrane protein complex',
          'Sits inside the inner membrane',
          'Forms the channel through which protons cross the inner membrane',
          '4 H⁺ pass through it for each ATP produced',
        ] },
      ],
    },
    // ── 10 · Reasoning prompt — ATP yield / oxygen's role ─────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A student says: \"NADH and FADH2 both dump their electrons into the same chain, so oxidising either one must release the same amount of ATP.\" According to NCERT, what is the correct picture?",
      options: [
        "Oxidation of one NADH gives 3 ATP, while oxidation of one FADH2 gives 2 ATP — the yield depends on which carrier donates the electrons",
        "Both give 3 ATP each, because they end at the same oxygen molecule",
        "Both give 2 ATP each, because ATP synthase treats every electron identically",
        "NADH gives 2 ATP and FADH2 gives 3 ATP, since FADH2 carries more energy",
      ],
      reveal: "The first option is right. NCERT states plainly that the number of ATP synthesised depends on the nature of the electron donor: one NADH yields 3 ATP and one FADH2 yields 2 ATP. The tempting trap is \"both give 3\" — it feels fair because both chains do end at oxygen, but the yield is set by where the electrons ENTER the chain, not where they end. FADH2 enters lower down (at complex II), so it produces less ATP. The 2-and-2 and the reversed 2-vs-3 options simply contradict the NCERT numbers.",
      difficulty_level: 2,
    },
    // ── 11 · Remember callout ─────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember',
      title: 'Lock These In',
      markdown: "- The **ETS is on the inner mitochondrial membrane** — memorise the location.\n- **Order of carriers:** Complex I (NADH dehydrogenase) → **ubiquinone** → also fed by Complex II (FADH2) → Complex III (cytochrome bc1) → **cytochrome c** → Complex IV (cytochrome c oxidase) → O₂.\n- **Cytochrome c** = a small **mobile carrier** on the **outer surface** of the inner membrane, between complexes III and IV.\n- **Complex IV** = cytochrome c oxidase = cytochromes **a, a3 + two copper centres**.\n- **Yields:** one **NADH → 3 ATP**; one **FADH2 → 2 ATP**.\n- **O₂ is the final hydrogen (electron) acceptor**; its role is limited to the **terminal stage**, but it drives everything by removing hydrogen. Forms **H₂O**.\n- Called **oxidative phosphorylation** because the proton gradient is built by **oxidation-reduction energy**, not light.\n- **ATP synthase (complex V) = F1 + F0.** **F1** = headpiece, **makes ATP**. **F0** = **proton channel**. **4 H⁺ per ATP** pass through F0 from the intermembrane space into the matrix.",
    },
    // ── 12 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Final acceptor:** NEET loves this line — **oxygen is the final hydrogen (electron) acceptor**, and its role is limited to the **terminal stage**. Don't say oxygen is used throughout the chain — it only acts at the very end.\n\n**The ATP numbers are pure marks:** **NADH → 3 ATP, FADH2 → 2 ATP.** Memorise both and never swap them.\n\n**F1 vs F0 is a classic trap:** **F1 makes ATP** (catalytic headpiece), **F0 is the proton channel**. Options that flip these two are the standard bait. And remember: **4 H⁺ per ATP**.\n\n**Classic NEET question:** \"The final electron/hydrogen acceptor in the electron transport system is ___.\" → **Oxygen (O₂)**. A close cousin: \"Oxidation of one molecule of FADH2 yields ___ ATP.\" → **2 ATP**.",
    },
    // ── 13 · Bridge text ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "You've now seen where the ATP is actually made, and how much each carrier is worth — NADH for 3, FADH2 for 2. Next comes the accounting: adding up every NADH, FADH2 and ATP from glycolysis, the citric acid cycle and this chain into one grand total — the **respiratory balance sheet**.",
    },
    // ── 14 · Inline quiz (LAST) ───────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Where is the electron transport system (ETS) located, and what happens to the electrons at the end of it?",
          options: [
            "On the inner mitochondrial membrane; the electrons are finally passed to O₂, forming H₂O",
            "In the mitochondrial matrix; the electrons are finally passed to O₂, forming CO₂",
            "On the outer mitochondrial membrane; the electrons are finally passed to NAD⁺, forming NADH",
            "In the cytoplasm; the electrons are finally passed to FAD, forming FADH2",
          ],
          correct_index: 0,
          explanation: "The ETS is present in the inner mitochondrial membrane, and the electrons are ultimately passed to oxygen, which forms water. The matrix is where the citric acid cycle and glycolysis-derived NADH come from, not where the ETS sits; and oxygen forms H₂O here, not CO₂ (CO₂ is released earlier, in decarboxylation steps).",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "How many ATP molecules are produced from the oxidation of one NADH and one FADH2 respectively?",
          options: [
            "NADH → 3 ATP; FADH2 → 2 ATP",
            "NADH → 2 ATP; FADH2 → 3 ATP",
            "NADH → 3 ATP; FADH2 → 3 ATP",
            "NADH → 2 ATP; FADH2 → 2 ATP",
          ],
          correct_index: 0,
          explanation: "NCERT states the number of ATP depends on the electron donor: one NADH gives 3 ATP and one FADH2 gives 2 ATP. The reversed pairing and the two matched-number options all contradict these figures — FADH2 gives fewer because it enters the chain lower down, at complex II.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which statement correctly describes the two components of ATP synthase (complex V)?",
          options: [
            "F0 is the peripheral headpiece that synthesises ATP, while F1 is the integral proton channel",
            "F1 is the peripheral headpiece that holds the ATP-synthesis site, while F0 is the integral channel through which protons cross the inner membrane",
            "Both F1 and F0 are integral membrane proteins, and both synthesise ATP independently",
            "F1 forms the proton channel and F0 pumps electrons directly onto oxygen",
          ],
          correct_index: 1,
          explanation: "F1 is the peripheral headpiece carrying the site for ATP synthesis from ADP + inorganic phosphate; F0 is the integral protein forming the proton channel across the inner membrane. Option 1 is the classic trap — it swaps the two roles. Complex V does not pump electrons onto oxygen; that is complex IV's job.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Why is the ATP-generating process in respiration called oxidative phosphorylation, and what exactly is oxygen's role in it?",
          options: [
            "Because light energy builds the proton gradient, and oxygen provides that light indirectly through the chain",
            "Because oxygen is consumed at every step of the chain, and it donates electrons into complex I",
            "Because the energy of oxidation-reduction (not light) builds the proton gradient, and oxygen acts only at the terminal stage as the final hydrogen acceptor",
            "Because oxygen phosphorylates ADP directly at complex IV without any proton gradient",
          ],
          correct_index: 2,
          explanation: "Unlike photophosphorylation, which uses light energy to build the proton gradient, respiration uses the energy of oxidation-reduction — hence 'oxidative' phosphorylation. Oxygen's role is limited to the terminal stage, where it acts as the final hydrogen acceptor, driving the whole process by removing hydrogen. It is not consumed at every step, does not donate electrons into complex I, and does not phosphorylate ADP directly.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
