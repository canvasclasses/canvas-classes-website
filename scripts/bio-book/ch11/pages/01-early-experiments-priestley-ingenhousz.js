'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'early-experiments-priestley-ingenhousz',
  title: 'What We Know & the First Experiments',
  subtitle: "Green plants are the only things on earth that make their own food — and in doing it, they hand out the oxygen you breathe. Two curious experimenters, a candle, a mouse, and a mint plant first proved it, one clue at a time.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['photosynthesis-in-higher-plants', 'history'],
  glossary: [
    { term: 'photosynthesis', definition: 'A physico-chemical process by which green plants use light energy to drive the synthesis of organic compounds (their food).' },
    { term: 'autotroph', definition: 'An organism that makes (synthesises) its own food. Green plants are autotrophs — autotrophic nutrition is found only in plants.' },
    { term: 'heterotroph', definition: 'An organism that cannot make its own food and depends on green plants for it. All organisms other than green plants are heterotrophs.' },
    { term: 'chlorophyll', definition: 'The green pigment of the leaf. Simple experiments show it is one of the three things required for photosynthesis, along with light and CO2.' },
    { term: 'variegated leaf', definition: 'A leaf with both green and non-green (white) patches. Used in the starch test to show photosynthesis happens only in the green parts, in the presence of light.' },
    { term: 'bell jar', definition: 'A sealed glass container used by Priestley to trap air with a candle, a mouse, or a mint plant inside and watch what happens to that trapped air.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A sunlit green leaf glowing against deep shadow, with faint streams of light passing through it',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single broad green leaf held in a shaft of warm sunlight, glowing translucent green from within as light passes through it, set against an otherwise deep, dark background. Soft suggestions of tiny rising bubbles and faint drifting light beams around the leaf hint at something invisible being made, without any labels or diagram elements. Painterly, atmospheric, naturalistic illustration style, deep shadows filling most of the frame (#0a0a0a base tones), warm highlights only on the sunlit leaf, no text, no labels, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'You Are Eating Sunlight Right Now',
      markdown: "Think about your last meal. Rice, dal, a vegetable, an egg, a piece of chicken — trace any of it backwards and it starts in a **green plant** that caught sunlight and turned it into food. Even the animal foods trace back to plants the animal ate. **Every bit of food on earth begins in a green plant.** And the same process that makes that food quietly releases the **oxygen** you just breathed in. Green plants feed you and let you breathe — with one process.",
    },
    // ── 2 · Core concept — autotrophs vs heterotrophs ────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "All animals — including human beings — depend on plants for their food. But where do plants get *their* food? They don't wait to be fed. **Green plants make, or rather synthesise, the food they need themselves**, through a process called **photosynthesis**. Because they build their own food, green plants are called **autotrophs** (auto = self, troph = feeding).\n\nEvery other organism that can't make its own food has to depend on green plants for it — these are the **heterotrophs**. In fact, **autotrophic nutrition is found only in plants**; everything else on earth is a heterotroph living, directly or indirectly, off what green plants make.\n\nSo what exactly is photosynthesis? It is a **physico-chemical process** by which green plants **use light energy to drive the synthesis of organic compounds**. Ultimately, all living forms on earth depend on sunlight for energy — and this use of sunlight by plants is the very basis of life on earth. Photosynthesis matters for **two reasons**: (i) it is the **primary source of all food on earth**, and (ii) it is responsible for the **release of oxygen into the atmosphere** by green plants.",
    },
    // ── 3 · Heading — what we already know ───────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'What We Already Know',
      objective: "By the end of this you can name the three things a plant needs to photosynthesise, and explain the two classroom experiments that prove green parts and CO2 are required.",
    },
    // ── 4 · Text — the three requirements + starch tests ─────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Some simple experiments from your earlier classes already showed the basics. They prove that three things are required for photosynthesis to occur: **chlorophyll** (the green pigment of the leaf), **light**, and **CO2**.\n\n**The starch test with a variegated leaf.** Take a **variegated leaf** — one with both green and white patches — or a leaf partly covered with **black paper**, and leave it in light. Then test the leaf for **starch** (starch is the food that gets made, so its presence means photosynthesis happened). The result is clear every time: **only the green parts, exposed to light, test positive for starch.** The white patches and the paper-covered parts make no starch. So photosynthesis needs **both** the green pigment **and** light.\n\n**The half-leaf-in-KOH test.** Now enclose one half of a leaf in a test tube containing cotton soaked in **KOH** — KOH **absorbs CO2**, so the air around that half has its CO2 removed. The other half of the same leaf stays out in ordinary air. Leave the setup in light for a while, then test both halves for starch. The **exposed half tests positive** for starch; the **enclosed half (no CO2) tests negative**. Same leaf, same light, same chlorophyll — the only difference was CO2. This showed that **CO2 is required for photosynthesis**.",
    },
    // ── 5 · Reasoning prompt — the half-leaf control logic ───────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 5, reasoning_type: 'logical',
      prompt: "In the half-leaf experiment, why is it so convincing that the *only* reason the KOH-enclosed half made no starch is the missing CO2 — and not something else?",
      options: [
        "Because both halves belong to the same leaf, so light, chlorophyll and everything else are identical for both — the one thing changed is that KOH removed the CO2 from one half.",
        "Because KOH is a green pigment, so the enclosed half lost its chlorophyll and could no longer photosynthesise.",
        "Because the enclosed half was kept in the dark inside the test tube while the exposed half sat in bright light.",
        "Because starch cannot form in glass test tubes, so any leaf sealed in a tube always tests negative.",
      ],
      reveal: "Option 1 is the point of the design. Using two halves of the *same* leaf keeps light, chlorophyll, temperature and leaf-type identical for both — a controlled comparison where only ONE thing differs: KOH stripped the CO2 from one half. When only that half fails to make starch, CO2 must be the required factor. Option 2 is wrong because KOH absorbs CO2 — it is not a pigment and does not remove chlorophyll. Option 3 misreads the setup: both halves are placed in light, not one in the dark. Option 4 invents a rule about glass that NCERT never states — the tube's job is only to hold the KOH near that half.",
      difficulty_level: 2,
    },
    // ── 6 · Heading — Priestley & Ingenhousz ─────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The First Experiments — Priestley & Ingenhousz',
      objective: "By the end of this you can describe Priestley's bell-jar experiment and his conclusion, and say exactly what Ingenhousz added on top of it.",
    },
    // ── 7 · Text — Priestley 1770 / 1774 ─────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "It is worth learning how our understanding of photosynthesis grew, one simple experiment at a time.\n\nIn **1770**, **Joseph Priestley (1733–1804)** ran a series of experiments that revealed the essential role of **air** in the life of green plants. He noticed two things about a **closed space** — a sealed **bell jar**. First, a **burning candle** inside it soon goes out. Second, a **mouse** placed inside it soon suffocates. From this he concluded that both a burning candle and a breathing animal somehow **damage the air**.\n\nThen came the key step. When Priestley placed a **mint plant** in the same bell jar, the mouse **stayed alive** and the candle **kept burning**. The plant had repaired the damaged air. Priestley put it as a hypothesis: **plants restore to the air whatever breathing animals and burning candles remove.** (Priestley, you may recall, went on to **discover oxygen in 1774** — though in this 1770 experiment he did not yet know it was oxygen the plant was restoring.)",
    },
    // ── 8 · Interactive image — Priestley's bell-jar experiment ──────────────
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: "Priestley's experiment: a sealed glass bell jar containing a burning candle, a small mouse, and a green mint plant, showing that the plant keeps the candle lit and the mouse alive",
      caption: '📸 Tap each dot to explore how Priestley proved a green plant repairs "damaged" air.',
      generation_prompt: "Scientific textbook illustration of Joseph Priestley's bell-jar experiment. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines. A large sealed glass bell jar sits on a flat base; inside it, together, are a small lit candle with a steady flame, a small live mouse sitting alertly, and an upright green potted mint plant. The mint plant is drawn green (living/photosynthetic); the mouse in soft pink (animal tissue); the candle flame in warm yellow. Biologically and physically accurate proportions, the jar clearly airtight and enclosing all three. Labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.08, label: 'Sealed bell jar', detail: "A closed glass container that traps a fixed pocket of air. Nothing goes in or out — so whatever changes the air inside must come from the candle, the mouse, or the plant.", icon: 'circle' },
        { id: uuid(), x: 0.3, y: 0.62, label: 'Burning candle', detail: "On its own inside the sealed jar, a candle flame soon goes **out**. Priestley took this as a sign that burning **damages the air**.", icon: 'circle' },
        { id: uuid(), x: 0.7, y: 0.66, label: 'Mouse', detail: "On its own inside the sealed jar, a mouse soon **suffocates**. So a breathing animal also **damages the air**, just like the candle does.", icon: 'circle' },
        { id: uuid(), x: 0.52, y: 0.42, label: 'Mint plant', detail: "Add a green **mint plant** to the same jar and everything changes — the candle keeps burning and the mouse stays alive. The plant **restored** the air.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.9, label: "Priestley's conclusion", detail: "**Plants restore to the air whatever breathing animals and burning candles remove.** This was Priestley's 1770 hypothesis. He later discovered oxygen in **1774**.", icon: 'circle' },
      ],
    },
    // ── 9 · Text — Ingenhousz ────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Priestley had shown *that* plants repair the air — but not *what conditions* they need to do it. **Jan Ingenhousz (1730–1799)** filled that gap. Using a setup similar to Priestley's, he ran it **twice**: once in the **dark** and once in **sunlight**. The plant only purified the fouled air in **sunlight** — in the dark it didn't. So Ingenhousz showed that **sunlight is essential** for the process that cleans the air.\n\nHe went further with an elegant experiment using an **aquatic plant**. In **bright sunlight**, small **bubbles** formed around the **green parts** of the plant; in the **dark**, no bubbles formed. He later identified those bubbles as **oxygen**. This told him two things at once: it takes **sunlight** for the plant to release these bubbles, and it is **only the green parts** of the plant that release the oxygen.",
    },
    // ── 10 · Comparison card — Priestley vs Ingenhousz ───────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 10,
      title: 'Priestley vs Ingenhousz',
      columns: [
        {
          heading: 'Joseph Priestley (1770)',
          points: [
            'Used a candle, a mouse and a mint plant in a sealed bell jar.',
            'Found that a burning candle and a breathing mouse both damage the air.',
            'Found that a mint plant restores the damaged air — candle keeps burning, mouse stays alive.',
            'Conclusion: plants restore to the air whatever breathing animals and burning candles remove.',
            'Discovered oxygen in 1774.',
          ],
        },
        {
          heading: 'Jan Ingenhousz',
          points: [
            'Ran a Priestley-like setup once in the dark, once in sunlight.',
            'Showed that SUNLIGHT is essential for the plant to purify the air.',
            'With an aquatic plant, saw bubbles form around green parts in bright sunlight, not in the dark.',
            'Identified those bubbles as oxygen.',
            'Showed that only the GREEN parts of a plant release oxygen.',
          ],
        },
      ],
    },
    // ── 11 · Reasoning prompt — what Ingenhousz added beyond Priestley ───────
    {
      id: uuid(), type: 'reasoning_prompt', order: 11, reasoning_type: 'logical',
      prompt: "Priestley had already shown that a mint plant repairs 'damaged' air. What NEW information did Jan Ingenhousz's experiments add on top of that?",
      options: [
        "That sunlight is essential for the purifying process, and that only the green parts of the plant release oxygen.",
        "That plants restore to the air whatever burning candles and breathing animals remove.",
        "That a burning candle and a breathing mouse both damage the air inside a sealed bell jar.",
        "That the gas plants remove from the air, rather than release, is carbon dioxide.",
      ],
      reveal: "Option 1 is exactly Ingenhousz's contribution: by running the setup in the dark versus sunlight he proved **sunlight is essential**, and with the aquatic plant he showed the bubbles (oxygen) form only around the **green parts**. Option 2 is Priestley's own hypothesis — the thing Ingenhousz built *upon*, not what he added. Option 3 is also Priestley's finding, from the candle-and-mouse observations. Option 4 describes a CO2 conclusion that these two air-restoration experiments did not establish — neither Priestley nor Ingenhousz framed it that way here.",
      difficulty_level: 2,
    },
    // ── 12 · Remember callout ───────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Autotroph** = makes its own food (green plants, by photosynthesis). **Heterotroph** = depends on green plants for food (everything else). Autotrophic nutrition is found **only in plants**.\n- **Photosynthesis** = a physico-chemical process using **light energy** to synthesise organic compounds. It matters for **two reasons**: (i) primary source of **all food** on earth, (ii) **releases oxygen** into the atmosphere.\n- **Three things required:** **chlorophyll** (green pigment) + **light** + **CO2**. Starch tests (variegated leaf / black paper) prove green + light; the KOH half-leaf test proves CO2.\n- **Priestley (1770)** → mint plant restores 'damaged' air (candle keeps burning, mouse lives): *plants restore to the air whatever breathing animals and burning candles remove.* Discovered **oxygen in 1774**.\n- **Ingenhousz** → **sunlight is essential** for the purifying process, and **only the green parts** release oxygen (bubbles around green parts in bright light, not in the dark).",
    },
    // ── 13 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Split the two scientists cleanly — NEET loves to swap them.** Priestley = plants *restore/purify* the air + *discovered oxygen (1774)*. Ingenhousz = *sunlight is essential* + *only green parts release oxygen*. If a question mentions sunlight or green parts, the answer is Ingenhousz, not Priestley.\n\n**Two reasons photosynthesis is important** — food source + oxygen release — is a favourite one-line fact. So is the year **1774** for the discovery of oxygen, and **1770** for Priestley's bell-jar experiment.\n\n**Classic NEET question:** \"Who showed that light is essential for the purifying action of green plants?\" → **Jan Ingenhousz** — Priestley showed *that* plants restore the air, but not that *sunlight* was needed for it.",
    },
    // ── 14 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "So far the story is about air: plants restore it, sunlight drives it, and only green parts do it. But no one yet knew *what* the plant actually makes, or the exact ingredients and products of the reaction. Next, you'll meet **Sachs, Engelmann and van Niel** — the experimenters who identified glucose and starch, pinned down which colours of light work best, and corrected the balanced equation of photosynthesis itself.",
    },
    // ── 15 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Why are green plants called autotrophs while all other organisms are heterotrophs?",
          options: [
            "Green plants synthesise their own food by photosynthesis, while all other organisms depend on green plants for their food",
            "Green plants breathe out oxygen while all other organisms breathe out carbon dioxide",
            "Green plants live on land while all other organisms live in water and must find food there",
            "Green plants reproduce without seeds while all other organisms need seeds to make food",
          ],
          correct_index: 0,
          explanation: "An autotroph makes (synthesises) its own food — green plants do this by photosynthesis, so they are autotrophs. A heterotroph cannot, and depends on green plants for food; that's every other organism. NCERT is explicit that autotrophic nutrition is found only in plants. The other options describe breathing, habitat or reproduction, none of which is the auto-/heterotroph distinction.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Photosynthesis is said to be important for two reasons. Which pair correctly states them?",
          options: [
            "It is the primary source of all food on earth, and it releases oxygen into the atmosphere",
            "It absorbs all the oxygen in the air, and it produces rainfall for plants",
            "It is the primary source of all water on earth, and it removes oxygen from the atmosphere",
            "It provides sunlight to animals, and it is the primary source of nitrogen on earth",
          ],
          correct_index: 0,
          explanation: "NCERT gives exactly two reasons: photosynthesis is the primary source of all food on earth, and it is responsible for the release of oxygen into the atmosphere. Option 2 and 3 reverse the oxygen role (photosynthesis releases oxygen, it doesn't absorb or remove it) and invent rainfall/water claims; option 4 swaps in sunlight and nitrogen, which NCERT never lists as the two reasons.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "In the experiment where one half of a leaf is enclosed with KOH-soaked cotton and the other half is left in air, then both are tested for starch, what is found and what does it prove?",
          options: [
            "Both halves test positive, proving that chlorophyll alone is enough for photosynthesis",
            "The exposed half tests positive and the KOH-enclosed half tests negative, proving that CO2 is required for photosynthesis",
            "The KOH-enclosed half tests positive and the exposed half tests negative, proving that darkness is required for photosynthesis",
            "Both halves test negative, proving that light is not required for photosynthesis",
          ],
          correct_index: 1,
          explanation: "KOH absorbs CO2, so the enclosed half is starved of CO2. That half tests negative for starch while the exposed half tests positive — the only difference between the two was CO2, so CO2 is required for photosynthesis. Option 3 reverses the result and misnames the factor; options 1 and 4 contradict the actual outcome, where the two halves differ.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which experimental result belongs to Jan Ingenhousz rather than Joseph Priestley?",
          options: [
            "A mint plant kept a candle burning and a mouse alive inside a sealed bell jar",
            "A burning candle and a breathing mouse both damaged the air in a closed space",
            "Bubbles of oxygen formed around the green parts of an aquatic plant only in bright sunlight, not in the dark",
            "Oxygen was discovered in 1774",
          ],
          correct_index: 2,
          explanation: "The aquatic-plant experiment — bubbles (later identified as oxygen) forming around only the green parts, and only in bright sunlight — is Ingenhousz's, and it's how he showed sunlight is essential and that only green parts release oxygen. Options 1 and 2 are Priestley's bell-jar observations, and the 1774 discovery of oxygen (option 4) is also Priestley's. Mixing up who did the aquatic-plant/sunlight work is the classic trap.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
