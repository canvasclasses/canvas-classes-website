'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'enzymes-how-they-work',
  title: 'Enzymes I — How They Work',
  subtitle: "One enzyme turns a reaction that limps along at 200 molecules an hour into one that fires 600,000 a second. Here's what an enzyme actually is, and the exact four-step trick it uses to pull that off.",
  page_number: 9,
  page_type: 'lesson',
  tags: ['biomolecules', 'enzymes'],
  glossary: [
    { term: 'ribozyme', definition: 'A nucleic acid that behaves like an enzyme — that is, it can catalyse a reaction. Almost all enzymes are proteins, but ribozymes are the exception: they are made of nucleic acid, not protein.' },
    { term: 'active site', definition: "A crevice or pocket formed when an enzyme's chain folds and criss-crosses on itself in its tertiary structure. The substrate fits into this pocket, and this is where the enzyme catalyses the reaction." },
    { term: 'substrate', definition: 'The chemical that an enzyme converts into a product. It has to diffuse toward the active site and bind there for the reaction to happen.' },
    { term: 'ES complex', definition: 'The enzyme-substrate complex — the short-lived, highly reactive structure formed when the substrate binds the enzyme at its active site. Its formation is essential for catalysis.' },
    { term: 'transition state', definition: "A higher-energy, unstable structure of the substrate formed while it is bound to the enzyme's active site, on the pathway between the stable substrate and the stable product." },
    { term: 'activation energy', definition: "The difference in average energy content between the substrate (S) and the transition state. It is the energy barrier the substrate must climb to become product — the barrier enzymes bring down." },
    { term: 'metabolic pathway', definition: 'A multistep chemical reaction in which each step is catalysed by the same enzyme complex or by different enzymes — for example, glucose becoming pyruvic acid through ten enzyme-catalysed steps.' },
    { term: 'thermophilic organisms', definition: 'Organisms that normally live at extremely high temperatures, such as in hot vents and sulphur springs. Their enzymes stay stable and keep working up to 80°–90°C — a property called thermal stability.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A glowing protein molecule with a single pocket, holding a small shape snugly inside it, floating in darkness',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A large, softly glowing folded protein molecule floats in a dark, empty space, its chain criss-crossing over itself so that a single distinct pocket forms on its surface. A small separate molecule sits nudged into that pocket, fitting it closely, as if caught mid-embrace. Warm amber and pale-green light glows faintly from where the two meet, suggesting a reaction about to happen. Deep shadow fills the rest of the frame. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'A Reaction That Skips a Whole Hour of Waiting',
      markdown: "Inside your cells, carbon dioxide is constantly being combined with water — a reaction that, left alone, is painfully slow: only about **200 molecules** get made in a whole **hour**. Add one enzyme, **carbonic anhydrase**, and the same reaction now churns out about **600,000 molecules every second**. That is roughly **10 million times** faster. As NCERT puts it, the power of enzymes is incredible indeed.",
    },
    // ── 2 · Core concept — what an enzyme is ─────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "So what actually is an enzyme? **Almost all enzymes are proteins.** There's one exception worth remembering: a few **nucleic acids** also behave like enzymes — they can speed up reactions — and these are called **ribozymes**.\n\nBecause an enzyme is a protein, it has everything a protein has: a **primary structure** (its amino-acid sequence), a **secondary structure**, and a **tertiary structure** (the folded, three-dimensional shape). That folded shape is where the magic starts.",
    },
    // ── 3 · Heading — active site + thermophiles ─────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Active Site — a Pocket Shaped to Fit',
      objective: "By the end of this you can explain how the active site forms, what fits into it, and why enzymes fall apart in heat while inorganic catalysts thrive in it.",
    },
    // ── 4 · Text — active site formation ─────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "When you look at an enzyme's **tertiary structure**, the protein chain has folded back and **criss-crossed itself** many times. Wherever it doubles over, it leaves behind small **crevices or pockets** on the enzyme's surface. One of those pockets is special — it's the **active site**.\n\nThe **active site** is a crevice or pocket into which the **substrate** (the chemical the enzyme works on) fits. Through this one pocket, the enzyme grabs its substrate and **catalyses the reaction at a high rate**. Hold on to this picture — a folded protein with a shaped pocket, and a substrate that slots into it. Everything an enzyme does happens right there.",
    },
    // ── 5 · Text — thermophiles / temperature ────────────────────────────────
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "Enzymes differ from **inorganic catalysts** in many ways, but one difference matters most: temperature. Inorganic catalysts work efficiently at **high temperatures and high pressures**. Enzymes are the opposite — they get **damaged at high temperatures**, roughly **above 40°C**.\n\nThere's one striking exception. Enzymes taken from organisms that normally live in **extremely hot places** — like **hot vents and sulphur springs** — stay **stable and keep their catalytic power even up to 80°–90°C**. This **thermal stability** is a prized quality of enzymes isolated from these **thermophilic organisms**.",
    },
    // ── 6 · Comparison card — enzyme vs inorganic catalyst ────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 6,
      title: 'Enzyme (organic) catalyst vs Inorganic catalyst',
      columns: [
        {
          heading: 'Enzyme (organic catalyst)',
          points: [
            'Almost always a protein (a few are nucleic acids — ribozymes).',
            'Gets damaged at high temperatures — roughly above 40°C.',
            'Works under mild, life-friendly conditions.',
            'Exception: enzymes from thermophilic organisms stay active up to 80°–90°C.',
          ],
        },
        {
          heading: 'Inorganic catalyst',
          points: [
            'Not a protein.',
            'Works efficiently at high temperatures and high pressures.',
            'Needs harsh conditions to be efficient.',
          ],
        },
      ],
    },
    // ── 7 · Heading — chemical reactions and rate ────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'What Counts as a Chemical Reaction, and What "Rate" Means',
      objective: "By the end of this you can tell a physical change from a chemical reaction, define rate as δP/δt, and quote how much faster carbonic anhydrase makes its reaction.",
    },
    // ── 8 · Text — physical vs chemical change, rate ─────────────────────────
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Before we can appreciate what enzymes do, we need to be clear on what a reaction even is. Chemical compounds change in two kinds of ways.\n\nA **physical change** is just a change in **shape without any bonds breaking** — or a **change in state**, like ice melting into water, or water turning to vapour. No bonds break; nothing new is really made.\n\nA **chemical reaction** is different: **bonds are broken and new bonds are formed**. For example, the hydrolysis of starch into glucose is an organic chemical reaction.\n\nHow fast a reaction goes is its **rate** — the **amount of product formed per unit time**, written as **rate = δP/δt**. Rate depends on temperature, among other things: a rough rule is that rate **doubles, or halves, for every 10°C change** in either direction.",
    },
    // ── 9 · Worked example — carbonic anhydrase speed-up ─────────────────────
    {
      id: uuid(), type: 'worked_example', order: 9, label: 'Solved Example — the speed of an enzyme',
      variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      problem: "Carbonic anhydrase speeds up the reaction of carbon dioxide with water (CO₂ + H₂O ⇌ H₂CO₃). Without the enzyme, about 200 molecules of H₂CO₃ form per hour. With the enzyme, about 600,000 molecules form per second. Roughly how much faster is the catalysed reaction than the uncatalysed one?",
      solution: "Put both rates in the same unit — per second.\n\n**Uncatalysed:** 200 molecules per hour. One hour = 3,600 seconds, so that's 200 ÷ 3,600 ≈ **0.056 molecules per second**.\n\n**Catalysed:** about **600,000 molecules per second**.\n\n**Compare them:** 600,000 ÷ 0.056 ≈ **10,000,000** — about **10 million times faster**. This is exactly the figure NCERT gives: the enzyme has accelerated the reaction rate by about 10 million times. The lesson to carry: enzyme-catalysed reactions run at rates vastly higher than the same reaction without the enzyme.",
    },
    // ── 10 · Text — metabolic pathway ────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "There are **thousands of types of enzymes**, each catalysing its own reaction. Often, reactions come in a chain — a **multistep chemical reaction where each step is catalysed** (by the same enzyme complex or by different enzymes). That chain is called a **metabolic pathway**.\n\nThe classic example: **glucose → 2 pyruvic acid**, which happens through **ten different enzyme-catalysed steps**. And here's a neat twist — the same pathway, with one or two extra reactions, gives **different end products depending on conditions**. In your **skeletal muscle under anaerobic conditions**, you get **lactic acid**. Under **normal aerobic conditions**, you get **pyruvic acid**. In **yeast during fermentation**, the same pathway leads to **ethanol** (alcohol).",
    },
    // ── 11 · Heading — activation energy ─────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 11, level: 2,
      text: 'Activation Energy — the Hill Every Substrate Must Climb',
      objective: "By the end of this you can read Figure 9.4, define activation energy, and say in one line what an enzyme does to it.",
    },
    // ── 12 · Text — transition state + activation energy ─────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "How does an enzyme make a reaction so much faster? To see it, follow a single substrate turning into product. A substrate **'S'** becomes a product **'P'**, written simply as **S → P**.\n\nBut S can't slide straight into P. On the way, it must pass through a much **higher-energy, unstable structure** called the **transition state**. Every in-between structure between the stable S and the stable P is unstable — and stability is really about **energy**: unstable means high energy.\n\nDraw this as a graph (Figure 9.4) with **potential energy up the y-axis** and the **progress of the reaction along the x-axis**, and you get a hill. S sits on one side, P on the other, and the transition state is the **peak** in between. Two things stand out: if **P is at a lower level than S**, the reaction is **exothermic** (no heating needed to make the product). And the height from S up to that peak — the **difference in average energy content of S from the transition state** — is the **activation energy**.\n\nHere's the whole point: **enzymes bring down this energy barrier**, making the transition from S to P much easier.",
    },
    // ── 13 · Interactive image — Figure 9.4 activation energy graph ───────────
    {
      id: uuid(), type: 'interactive_image', order: 13, src: '',
      alt: 'Energy graph: potential energy on the y-axis, progress of reaction on the x-axis, with substrate S, a transition-state peak, product P, and the activation-energy barriers with and without enzyme',
      caption: '📸 Tap each dot to explore how an enzyme lowers the activation-energy barrier (NCERT Figure 9.4).',
      generation_prompt: "Scientific textbook illustration of an activation-energy reaction-progress graph (NCERT Figure 9.4). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines. The y-axis is labelled 'Potential Energy' (vertical), the x-axis is labelled 'Progress of reaction' (horizontal), both in white text with thin white leader lines. A curve starts at a labelled point 'Substrate (S)' on the upper-left plateau, rises to a rounded peak labelled 'Transition state', then descends to a lower labelled point 'Product (P)' on the lower-right, showing P below S. Draw TWO peaks of different heights sharing the same S and P: a taller peak drawn in a muted tone labelled 'Activation energy without enzyme', and a lower peak labelled 'Activation energy with enzyme', with small vertical double-headed arrows marking each barrier height from the S level up to each peak. Biologically neutral educational palette, no photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.09, y: 0.42, label: 'Substrate (S)', detail: "Where the reaction starts. S is the stable chemical the enzyme will convert into product. On the graph it sits at a set energy level on the left.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.10, label: 'Transition state', detail: "The peak of the hill — a high-energy, unstable structure S must pass through on its way to becoming P. Every in-between structure here is unstable.", icon: 'circle' },
        { id: uuid(), x: 0.90, y: 0.74, label: 'Product (P)', detail: "The end point. Here P sits **lower** than S, which makes the reaction **exothermic** — no heating is needed to form the product.", icon: 'circle' },
        { id: uuid(), x: 0.42, y: 0.30, label: 'Activation energy (without enzyme)', detail: "The full height from S up to the transition-state peak — the difference in average energy content between S and the transition state. This is the barrier the substrate must climb on its own.", icon: 'circle' },
        { id: uuid(), x: 0.58, y: 0.50, label: 'Activation energy (with enzyme)', detail: "A **lower** barrier. Enzymes bring down the activation energy, so S reaches P far more easily — this is exactly why enzyme-catalysed reactions are so fast.", icon: 'circle' },
        { id: uuid(), x: 0.04, y: 0.15, label: 'Y-axis: Potential Energy', detail: "The vertical axis shows the potential-energy content of the molecule. Higher up the graph = higher energy = less stable.", icon: 'circle' },
      ],
    },
    // ── 14 · Heading — ES complex + catalytic cycle ──────────────────────────
    {
      id: uuid(), type: 'heading', order: 14, level: 2,
      text: 'Nature of Enzyme Action — E + S → ES → EP → E + P',
      objective: "By the end of this you can write the ES-complex sequence and walk through the four steps of the catalytic cycle in order.",
    },
    // ── 15 · Text — ES complex + 4-step cycle ────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "Every enzyme (**E**) has a **substrate-binding site** — the active site — where a highly reactive **enzyme-substrate complex (ES)** forms. This ES complex is **short-lived**, and its formation is **essential for catalysis**. It then breaks down into the product(s) **P** and the unchanged enzyme, passing through an intermediate **enzyme-product complex (EP)** along the way:\n\n**E + S → ES → EP → E + P**\n\nThe **catalytic cycle** runs in four steps:\n\n1. First, the **substrate binds** to the active site of the enzyme, fitting into it.\n2. That binding **induces the enzyme to change shape**, so it fits more tightly around the substrate.\n3. The active site, now snug against the substrate, **breaks the substrate's chemical bonds**, and the new **enzyme-product complex** forms.\n4. The enzyme **releases the products**, and the free enzyme is ready to grab another substrate and run the cycle again.\n\nNotice the enzyme comes out **unchanged** at the end — free to do it all over, thousands of times.",
    },
    // ── 16 · Reasoning prompt — catalytic-cycle sequence check ────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 16, reasoning_type: 'logical',
      prompt: "A student is describing the four steps of the enzyme catalytic cycle but has shuffled them. Which sequence matches NCERT's order, from the moment the substrate arrives to the moment the enzyme is free again?",
      options: [
        "Enzyme changes shape to fit the substrate → substrate binds the active site → products are released → bonds of the substrate are broken.",
        "Substrate binds the active site → the binding induces the enzyme to change shape and fit tightly → the active site breaks the substrate's bonds, forming the enzyme-product complex → the enzyme releases the products and is free again.",
        "The active site breaks the substrate's bonds → substrate binds the active site → enzyme changes shape → products are released.",
        "Substrate binds the active site → the active site breaks the substrate's bonds → the enzyme changes shape → the enzyme-product complex is released last.",
      ],
      reveal: "Option 2 is NCERT's order. The substrate binds first (step 1); that binding is what induces the enzyme to change shape and grip the substrate tightly (step 2); only then does the close-fitting active site break the substrate's bonds and form the enzyme-product complex (step 3); finally the products are released and the enzyme is free (step 4). Option 4 is the tempting trap — it gets step 1 right but then breaks the bonds before the enzyme has changed shape, reversing steps 2 and 3. The shape change must come first, because it's what brings the active site close enough to break the bonds. Options 1 and 3 scramble the start of the cycle entirely.",
      difficulty_level: 2,
    },
    // ── 17 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 17, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Almost all enzymes are proteins.** The exception: some **nucleic acids** act like enzymes — these are **ribozymes**.\n- **Active site** = a crevice/pocket in the enzyme's folded tertiary structure into which the **substrate** fits; this is where catalysis happens.\n- **Enzymes lower the activation energy** — they bring down the energy barrier, making S → P easier. That's the one-line reason they're so fast.\n- **Reaction path:** **E + S → ES → EP → E + P**. The **ES complex is essential for catalysis** and is short-lived.\n- **Enzymes get damaged above ~40°C**, but enzymes from **thermophilic organisms** (hot vents, sulphur springs) stay active up to **80°–90°C**.\n- **Carbonic anhydrase** speeds CO₂ + H₂O ⇌ H₂CO₃ from ~200 molecules/hour to ~600,000/second — about **10 million times** faster.",
    },
    // ── 18 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 18, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Activation energy:** NEET loves the one-liner — enzymes speed up reactions by **lowering** the activation energy. Never say they add energy or raise the barrier; they bring it *down*.\n\n**Ribozymes:** the word 'almost' in \"almost all enzymes are proteins\" is doing real work — the exceptions are catalytic **nucleic acids** called **ribozymes**. This exact contrast is a favourite.\n\n**Numbers to keep exact:** enzymes damaged above ~40°C; thermophilic enzymes stable up to 80°–90°C; carbonic anhydrase ~10 million times faster.\n\n**Classic NEET question:** \"Enzymes speed up a reaction by ______ the activation energy.\" → **lowering**. And its cousin: \"Catalytic RNAs / nucleic acids that act like enzymes are called ______.\" → **ribozymes**.",
    },
    // ── 19 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 19,
      markdown: "You now know what an enzyme is, why its folded shape and active site matter, how it slashes the activation energy, and the exact four-step cycle it runs. Next, we'll look at how enzymes are **controlled** — how temperature, pH and other factors change their activity, and how the thousands of enzymes get **classified** into families.",
    },
    // ── 20 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 20, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "According to NCERT, which statement about the chemical nature of enzymes is correct?",
          options: [
            "All enzymes are proteins, with no exceptions of any kind",
            "Almost all enzymes are proteins, but some nucleic acids also act like enzymes and are called ribozymes",
            "Almost all enzymes are nucleic acids, while a few proteins act as ribozymes",
            "Enzymes are neither proteins nor nucleic acids; they are a separate class of biomolecule",
          ],
          correct_index: 1,
          explanation: "NCERT says 'almost all' enzymes are proteins — the word 'almost' matters, because a few nucleic acids also behave like enzymes, and those are the ribozymes. Option 1 drops the exception; option 3 flips proteins and nucleic acids; option 4 denies both, none of which NCERT supports.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "How does an enzyme actually make a reaction go faster?",
          options: [
            "By raising the activation energy so the substrate reacts more violently",
            "By supplying extra heat that pushes the substrate over the barrier",
            "By lowering the activation energy, bringing down the barrier the substrate must cross",
            "By changing the product P into a lower-energy form than the substrate S",
          ],
          correct_index: 2,
          explanation: "NCERT is explicit: enzymes bring down the energy barrier — they lower the activation energy — making the transition from S to P easier. Option 1 reverses this. Option 2 is wrong because enzymes don't supply heat; in fact they get damaged by it above ~40°C. Option 4 confuses activation energy with whether the reaction is exothermic (whether P is below S), which the enzyme doesn't decide.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which sequence correctly represents the nature of enzyme action as NCERT writes it?",
          options: [
            "E + S → EP → ES → E + P",
            "E + P → ES → EP → E + S",
            "E + S → ES → EP → E + P",
            "S + P → ES → E + EP",
          ],
          correct_index: 2,
          explanation: "The enzyme (E) and substrate (S) first form the short-lived, highly reactive ES complex, which then passes through the intermediate enzyme-product complex (EP) before releasing product (P) and the unchanged enzyme: E + S → ES → EP → E + P. Option 1 puts EP before ES; option 2 runs the whole thing backwards; option 4 scrambles the players entirely.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The reaction CO₂ + H₂O ⇌ H₂CO₃ makes about 200 molecules of H₂CO₃ per hour on its own, but about 600,000 per second with carbonic anhydrase. What does this illustrate?",
          options: [
            "That the enzyme accelerates the reaction rate by about 10 million times",
            "That the enzyme is destroyed after forming a few hundred molecules",
            "That inorganic catalysts always beat enzymes on speed",
            "That the reaction is a physical change, since no bonds are broken",
          ],
          correct_index: 0,
          explanation: "Comparing ~200 molecules per hour with ~600,000 per second works out to roughly a 10-million-fold speed-up — the exact figure NCERT quotes to show 'the power of enzymes.' Option 2 is wrong: the enzyme comes out unchanged and reused each cycle. Option 3 contradicts the whole example. Option 4 is wrong because forming H₂CO₃ involves making new bonds, so it is a chemical reaction, not a physical change.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
