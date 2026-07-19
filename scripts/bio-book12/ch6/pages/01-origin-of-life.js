'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-origin-of-life',
  title: 'The Origin of Life',
  subtitle: "Before the first cell there was a hot, airless earth and a sky full of chemistry — here is how NCERT traces life back from the Big Bang to a jar of amino acids.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['evolution', 'origin-of-life', 'miller-urey', 'oparin-haldane', 'chemical-evolution'],
  glossary: [
    { term: 'panspermia', definition: 'The idea that life did not begin on earth at all — that units of life called spores drifted in from outer space and seeded different planets, including ours. Still a favourite idea for some astronomers.' },
    { term: 'spontaneous generation', definition: 'The old belief that living things arise on their own out of decaying, rotting matter such as straw or mud. Louis Pasteur disproved it.' },
    { term: 'abiogenesis', definition: 'Life coming from non-living things. This is what the spontaneous generation theory claimed, and it is exactly what Pasteur showed does not happen for ordinary organisms.' },
    { term: 'biogenesis', definition: 'Life coming only from pre-existing life. Pasteur\'s flask experiment established this: new organisms appeared only where living things could reach the flask, never out of the killed yeast alone.' },
    { term: 'chemical evolution', definition: 'The slow formation of diverse organic molecules (like amino acids, sugars, nucleic acids) from simple inorganic ingredients on the early earth — the step Oparin and Haldane said came before the first life.' },
    { term: 'reducing atmosphere', definition: 'An early-earth atmosphere with no free oxygen, rich instead in hydrogen-donating gases such as methane (CH4) and ammonia (NH3). These are the conditions chemical evolution needed.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A young, molten earth under a dark starry sky, lightning cracking through clouds of gas above a steaming primitive ocean',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A painterly, atmospheric view of the primitive earth roughly four billion years ago: a young planet with a partly molten, glowing-red surface and a hot steaming primeval ocean filling the depressions. Above it a dark, brooding sky with heavy clouds of gas, streaks of lightning cracking down toward the water, and a faint scatter of stars and distant galaxies far in the background suggesting a very old universe. Volcanic glow on the horizon. No life visible, no landmasses of plants. Deep, dark, naturalistic tones (#0a0a0a base), moody and vast. No text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'When You Look Up, You Look Back',
      markdown: "On a clear night, the light hitting your eye from a star left it millions of years ago, after travelling trillions of kilometres. So when you look at the stars, you are literally **peeping into the past**. That is the honest scale of this chapter. To ask where the first living thing came from, NCERT first zooms all the way out — to the birth of the universe, the making of the earth, and only then the appearance of life. The story of a single cell begins with the whole cosmos.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The origin of life is treated as a **unique event in the history of the universe**. And to place that event, you first need a rough timeline of everything that came before it. NCERT hands you a small set of numbers and names to hold on to — the age of the universe, the age of the earth, and the moment life shows up. Get those anchors firm, then the theories that follow all hang neatly off them.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'From the Big Bang to a Cooling Earth',
      objective: 'By the end of this you can put three numbers in the right order — the age of the universe, the age of the earth, and when life first appeared — and describe the airless early earth.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **Big Bang theory** explains the origin of the universe. It describes a single, huge explosion — unimaginable in physical terms. As the universe **expanded, its temperature came down**. **Hydrogen and Helium** formed sometime later, and these gases **condensed under gravitation** to form the galaxies of today. The universe itself is very old — almost **13.8 billion years old**.\n\nInside the Milky Way galaxy, the **earth is thought to have formed about 4.5 billion years ago**. There was **no atmosphere** on the early earth. Instead, **water vapour, methane, carbon dioxide and ammonia** released from the molten mass covered its surface. Then a chain of changes reshaped it:\n\n- **UV rays** from the sun broke up water into hydrogen and oxygen, and the **lighter hydrogen (H2) escaped** into space.\n- The freed **oxygen combined with ammonia and methane** to form water, CO2 and other compounds.\n- The **ozone layer** formed.\n- As the earth cooled, the **water vapour fell as rain**, filling the depressions to form the **oceans**.\n\nAgainst this backdrop, **life appeared about 500 million years after the earth formed — roughly four billion years ago.**",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Four Theories, One Question',
      objective: 'By the end of this you can say exactly who proposed each idea — panspermia, spontaneous generation, Pasteur\'s disproof, and the Oparin-Haldane hypothesis tested by Miller.',
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "**Did life come from outer space?** Some scientists think so. Early **Greek thinkers** believed units of life called **spores** were transferred to different planets, including earth. This idea — **panspermia** — is still a favourite for some astronomers. It is a real answer to 'where', but notice it dodges the real question: it never explains how the first life form actually *began*.\n\n**Did life arise from rotting matter?** For a long time people believed life came out of **decaying and rotting matter** — straw, mud, and the like. This was the theory of **spontaneous generation** (life from non-living things, i.e. abiogenesis).\n\n**Louis Pasteur** ended that debate by careful experiment. He showed that in **pre-sterilised flasks, no new life appeared** from killed yeast — while in **another flask left open to air, new living organisms did arise**. His conclusion, once and for all: **life comes only from pre-existing life** (biogenesis). Spontaneous generation was dismissed. But — and this is the catch NEET loves — Pasteur's experiment **did not explain how the very first life form appeared** on earth.\n\nThat gap is where **Oparin of Russia and Haldane of England** stepped in. They proposed that the first life could have come from **pre-existing non-living organic molecules** (like RNA and protein), and that the formation of life was **preceded by chemical evolution** — the building of diverse organic molecules from inorganic ingredients. The setting they described: **high temperature, volcanic storms, and a reducing atmosphere** rich in CH4 and NH3.\n\nIn **1953, S.L. Miller**, an American scientist, put that idea to the test — recreating the early-earth sky inside a sealed jar."
    },
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'Miller and Urey\'s sealed glass apparatus: a lower flask of boiling water, an upper chamber holding methane, ammonia and hydrogen with two electrodes sparking, a condenser, and a U-shaped trap collecting organic molecules',
      caption: '📸 Tap each dot to explore the Miller-Urey apparatus (NCERT Fig 6.1) — how a jar of gas and a spark produced amino acids.',
      generation_prompt: "Scientific textbook illustration of the Miller-Urey experiment apparatus (NCERT Class 12 Biology, Figure 6.1). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines of interconnected glass tubing forming a closed loop. Lower left: a round-bottom flask of boiling water with a small flame/heat source beneath it and rising vapour (blue tint for water). Tubing carries the vapour up and to the right into a larger upper glass sphere that holds a mixture of gases labelled CH4, NH3 and H2; inside this upper sphere are two electrodes facing each other with a bright electric spark arcing between them (spark in pale yellow-white). From the upper sphere the tubing descends on the right through a condenser (a jacketed cooling tube, blue tint) that cools the gases back to liquid. At the bottom the tubing forms a U-shaped trap where reddish-brown droplets of newly formed organic molecules (amino acids) collect. Labels in white text with thin white leader lines. Biologically and chemically accurate glassware proportions. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.24, y: 0.78, label: 'Boiling water flask', detail: 'A flask of water is heated so it boils and sends **water vapour** up into the apparatus. This vapour stands in for the steam of the hot early earth and keeps the whole closed loop circulating.', icon: 'circle' },
        { id: uuid(), x: 0.68, y: 0.20, label: 'Gas chamber: CH4 + NH3 + H2', detail: 'The upper chamber is filled with **methane (CH4), hydrogen (H2) and ammonia (NH3)** mixed with the water vapour — a **reducing atmosphere** with no free oxygen, exactly the mix Oparin and Haldane described.', icon: 'circle' },
        { id: uuid(), x: 0.70, y: 0.11, label: 'Electrodes & spark', detail: 'Two electrodes create a continuous **electric discharge (spark)** inside the gas mixture at about **800°C**. The spark stands in for lightning — the energy that drives the reactions.', icon: 'circle' },
        { id: uuid(), x: 0.86, y: 0.54, label: 'Condenser', detail: 'The gases pass through a **cooled condenser** that turns the products back into liquid, so they drain downward and collect instead of escaping. This keeps the experiment a sealed, repeating cycle.', icon: 'circle' },
        { id: uuid(), x: 0.55, y: 0.86, label: 'Collected organic molecules', detail: 'In the trap at the bottom, Miller found **amino acids** had formed. In similar experiments others obtained **sugars, nitrogen bases, pigments and fats** — the raw building blocks of life, made from simple gases.', icon: 'circle' },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "A student says Miller's 1953 experiment 'proved that life was created in the flask.' What did the experiment actually demonstrate, according to NCERT?",
      options: [
        "That a living cell can be assembled from gases given enough electricity",
        "That organic molecules like amino acids can form from simple inorganic gases under early-earth conditions",
        "That life on earth was seeded by spores arriving from outer space",
        "That life arises spontaneously from decaying, rotting matter",
      ],
      reveal: "Miller passed an electric spark through **CH4, H2, NH3 and water vapour at 800°C** and obtained **amino acids** — showing that **chemical evolution** (organic molecules from inorganic gases) is possible under early-earth conditions. That is a long way short of making a living cell; NCERT is careful to say we still have no idea how the first self-replicating capsule of life arose. Option C is panspermia, a different theory about *where* life came from. Option D is spontaneous generation — the very idea **Pasteur disproved** — so it is the opposite of what modern experiments support.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'The Names, Numbers and Gases to Lock In',
      markdown: "**The three timeline anchors, in order:**\n- Universe ≈ **13.8 billion years** old\n- Earth formed ≈ **4.5 billion years** ago\n- Life appeared ≈ **4 billion years** ago (about **500 million years** after the earth formed)\n\n**Who did what — never swap these:**\n- **Louis Pasteur** → disproved **spontaneous generation**; showed life comes only from pre-existing life (**biogenesis**).\n- **Oparin & Haldane** → first life from **pre-existing non-living organic molecules**; life preceded by **chemical evolution**.\n- **S.L. Miller (1953)** → **electric discharge** in **CH4 + H2 + NH3 + water vapour at 800°C** → **amino acids**.\n\n**Panspermia** = spores from outer space (early Greek thinkers).",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The gas mixture is a verbatim lift:** Miller's flask held **CH4, H2, NH3 and water vapour** — NEET plants a wrong gas (like O2 or CO2) as a distractor. Free oxygen is exactly what the **reducing atmosphere did not have**.\n\n**Pasteur vs Oparin-Haldane — keep them apart:** Pasteur **disproved spontaneous generation** (proved biogenesis) but did *not* explain the first life. Oparin & Haldane proposed the origin of the first life via **chemical evolution**. NEET swaps their contributions.\n\n**Classic NEET question:** \"The Miller-Urey experiment provided evidence for the abiotic synthesis of — ?\" → **amino acids** (organic molecules from inorganic gases), not the creation of a living cell.",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "So the chemical-evolution half of the story stands on solid ground: simple gases plus energy really can make the molecules of life, and the same compounds even turn up inside **meteorites**, hinting the process happens elsewhere in space too. What still has no answer is the leap from a soup of molecules to the **first self-replicating capsule of life** — the earliest non-cellular forms, giant molecules of RNA and protein, thought to have appeared about **3 billion years ago**. With life finally on the scene, the next question is how those first forms changed and diversified — which is where the theory of **evolution** begins.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'Which set of gases did S.L. Miller use in his 1953 experiment?',
          options: [
            'CH4, H2, NH3 and water vapour',
            'O2, CO2, N2 and water vapour',
            'CH4, O2, NH3 and CO2',
            'H2, O2, N2 and water vapour',
          ],
          correct_index: 0,
          explanation: 'Miller sealed CH4, H2, NH3 and water vapour in the flask and passed an electric discharge through them at 800°C. Every wrong option sneaks in free oxygen (O2) or CO2 — but the early atmosphere was a reducing one with no free oxygen, which is precisely why the others are traps.',
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'What did Louis Pasteur\'s flask experiment establish?',
          options: [
            'That the first life form on earth arose from non-living organic molecules',
            'That life comes only from pre-existing life, disproving spontaneous generation',
            'That amino acids can form from methane and ammonia',
            'That spores of life were carried to earth from outer space',
          ],
          correct_index: 1,
          explanation: 'In pre-sterilised flasks no life appeared, while a flask open to air grew new organisms — so life comes only from pre-existing life (biogenesis), and spontaneous generation was dismissed. Option A is the Oparin-Haldane hypothesis, option C is Miller\'s result, and option D is panspermia — none of them is what Pasteur\'s experiment showed.',
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'According to NCERT, roughly how old is the earth, and when did life first appear on it?',
          options: [
            'Earth ≈ 13.8 billion years old; life appeared ≈ 4.5 billion years ago',
            'Earth ≈ 500 million years old; life appeared almost immediately',
            'Earth ≈ 4.5 billion years old; life appeared ≈ 4 billion years ago',
            'Earth ≈ 4 billion years old; life appeared ≈ 13.8 billion years ago',
          ],
          correct_index: 2,
          explanation: 'The earth formed about 4.5 billion years ago, and life appeared roughly 500 million years later — about 4 billion years ago. The 13.8-billion-year figure is the age of the whole universe, not the earth, which is why the first option (which pins that number on the earth) is the tempting trap.',
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'The Oparin-Haldane hypothesis proposed that the first form of life arose by which process?',
          options: [
            'Sudden creation of a complete cell by an electric spark',
            'Arrival of living spores from other planets (panspermia)',
            'Spontaneous generation from decaying and rotting matter',
            'Chemical evolution — organic molecules forming from inorganic constituents',
          ],
          correct_index: 3,
          explanation: 'Oparin and Haldane held that the first life came from pre-existing non-living organic molecules, formed by chemical evolution from inorganic constituents in a reducing atmosphere. Panspermia (option B) is a different theory about where life came from, and spontaneous generation (option C) is the very idea Pasteur had already disproved.',
          difficulty_level: 3,
        },
      ],
    },
  ],
};
