'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'energy-flow-and-food-chains',
  title: 'Energy Flow — Trophic Levels, Food Chains & the 10% Law',
  subtitle: "Sunlight enters an ecosystem once, moves in one direction only, and loses 90 per cent of itself at every handover — this page follows that one-way journey from the sun to the top carnivore.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['energy-flow', 'trophic-levels', 'food-chain', 'food-web', 'ten-per-cent-law', 'ecosystem'],
  glossary: [
    { term: 'photosynthetically active radiation (PAR)', definition: 'The part of the incident solar radiation that plants can actually use for photosynthesis. It is less than 50 per cent of the sunlight falling on the Earth.' },
    { term: 'trophic level', definition: 'The place an organism occupies in a food chain, decided by the source of its nutrition. Producers are the first trophic level, herbivores the second, carnivores the third.' },
    { term: 'grazing food chain (GFC)', definition: 'A food chain that starts from the green plants (producers) and passes to herbivores and then to carnivores. Grass → Goat → Man is the standard example.' },
    { term: 'detritus food chain (DFC)', definition: 'A food chain that begins with dead organic matter (detritus). It is made up of decomposers — mainly fungi and bacteria — that degrade the dead material for their energy and nutrients.' },
    { term: 'saprotrophs', definition: 'Another name for the decomposers of the detritus food chain (sapro: to decompose). They secrete digestive enzymes that break dead and waste material down into simple inorganic substances, which they then absorb.' },
    { term: 'food web', definition: 'The network formed when food chains interconnect naturally — some organisms of the detritus food chain are prey to grazing food chain animals, and some animals such as cockroaches and crows are omnivores.' },
    { term: 'standing crop', definition: 'The mass of living material present at a trophic level at a particular time. It is measured as biomass or as the number of organisms in a unit area.' },
    { term: '10 per cent law', definition: 'Only 10 per cent of the energy at one trophic level is transferred to the next trophic level above it. This is why the number of trophic levels in a grazing food chain is restricted.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'Low evening sunlight falling across a grassland where grass, a grazing herbivore and a distant predator stand at increasing distances, suggesting a one-way passage of energy',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet grassland at low evening sun on a near-black background (#0a0a0a base). A single shaft of warm light falls from the upper left across the scene and lands on a broad sweep of grass rendered in deep muted green. Further along the same shaft of light, a grazing herbivore stands in half-silhouette, and further still, much smaller and dimmer, a lone predator on a distant rise. The light visibly weakens as it travels from the grass to the herbivore to the predator, ending almost dark at the far right. In the shadowed foreground, a scatter of fallen leaves and dead stems on damp soil catches a faint cool glow. Atmospheric painterly illustration style, naturalistic, restrained warm-to-dark gradient across the frame. No text, no labels, no arrows, no diagram callouts.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Why No Food Chain Is Very Long',
      markdown: "Count the links in any food chain you know — grass, goat, man. It stops. It almost always stops by the fourth or fifth link, and there is a hard reason for that.\n\nEnergy transfer between trophic levels follows the **10 per cent law**: only **10 per cent** of the energy at one level reaches the level above it. Start with 1000 units in the grass. The herbivore that eats it gets about 100. The carnivore that eats the herbivore gets about 10. The next one gets about 1. Two or three more links and there is simply **not enough energy left to feed anybody**. Food chains are short because the fuel runs out — not because nature ran out of animals.",
    },
    {
      id: uuid(), type: 'heading', order: 2, level: 2,
      text: 'One Source, One Direction',
      objective: "By the end of this you can say where every ecosystem's energy comes from, how little of it plants actually capture, and why the flow can never run backwards.",
    },
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "Every ecosystem on Earth runs on **one source of energy — the sun**. There is exactly one exception NCERT allows: the **deep-sea hydro-thermal ecosystem**, which does not depend on sunlight at all.\n\nNow look at how little of that sunlight is usable. Of the **incident solar radiation, less than 50 per cent is photosynthetically active radiation (PAR)** — the fraction plants can work with. And out of that PAR, **plants capture only 2–10 per cent**. Hold those two numbers together for a second: less than half the sunlight is even the right kind, and only a small slice of that half gets fixed. **This tiny amount of energy sustains the entire living world.**\n\n**Plants and photosynthetic bacteria (autotrophs)** fix the sun's radiant energy and make food out of simple inorganic materials. Every other organism depends on these **producers** for food, either directly or indirectly. That single fact settles the direction of the flow: energy goes **sun → producers → consumers**, and it never goes back. This is the **unidirectional flow of energy**. Sunlight is not returned to the sun by the plant; the goat's energy is not handed back to the grass.\n\nEcosystems are also **not exempt from the Second Law of thermodynamics**. They need a **constant supply of energy** to build the molecules they need and to push back against the universal tendency towards increasing disorderliness. Cut the supply of sunlight and the ecosystem does not coast — it winds down.",
    },
    {
      id: uuid(), type: 'heading', order: 4, level: 2,
      text: 'Trophic Levels and the Two Food Chains',
      objective: "By the end of this you can place any organism at its correct trophic level and say which of the two food chains it belongs to.",
    },
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "Organisms occupy a place in a community according to their **feeding relationship** with other organisms. Based on the source of its nutrition, an organism occupies a specific place in the food chain — this is its **trophic level**.\n\n- **First trophic level — producers.** The green plants. In a **terrestrial** ecosystem the major producers are **herbaceous and woody plants**; in an **aquatic** ecosystem they are **phytoplankton, algae and higher plants**.\n- **Second trophic level — herbivores**, the **primary consumers**. Common herbivores are **insects, birds and mammals** on land and **molluscs** in water.\n- **Third trophic level — primary carnivores**, which are **secondary consumers**. They feed on the herbivores.\n- **Fourth level — secondary carnivores**, which are **tertiary consumers**, feeding on the primary carnivores.\n\nWatch the naming carefully, because this is where marks are lost. A **primary carnivore is a secondary consumer**. The word 'primary' is counting carnivores; the word 'secondary' is counting consumers. All animals depend on plants directly or indirectly, so all of them are **consumers**, also called **heterotrophs**.\n\nNo energy trapped in an organism stays there for ever. The energy trapped by a producer is either **passed on to a consumer, or the organism dies** — and **death is the beginning of the detritus food chain**.\n\nSo there are two chains running side by side. The **grazing food chain (GFC)** starts at the producers: **Grass (producer) → Goat (primary consumer) → Man (secondary consumer)**. The **detritus food chain (DFC)** begins with **dead organic matter**. It is made up of **decomposers** — heterotrophic organisms, **mainly fungi and bacteria**, also called **saprotrophs** — which meet their energy and nutrient needs by degrading detritus. They **secrete digestive enzymes** that break dead and waste material into simple inorganic materials, which they then **absorb**.\n\nWhich chain carries more energy depends on where you are standing. In an **aquatic ecosystem, the GFC is the major conduit** for energy flow. In a **terrestrial ecosystem, a much larger fraction of energy flows through the DFC** than through the GFC.\n\nThe two chains are not sealed off from each other. The DFC **may be connected with the GFC at some levels** — **some organisms of the DFC are prey to GFC animals** — and in a natural ecosystem some animals such as **cockroaches and crows are omnivores**. These natural interconnections of food chains make a **food web**.\n\nTwo more things to fix. First, **the amount of energy decreases at successive trophic levels**, because organisms at each level depend on the level below for their energy demands, and only the **10 per cent law**'s share gets through — which is exactly why the **number of trophic levels in the grazing food chain is restricted**. Second, each trophic level has a certain mass of living material at a particular time, called the **standing crop**. It is measured as the mass of living organisms (**biomass**) or the **number in a unit area**, and biomass is expressed as **fresh or dry weight** — **dry weight is the more accurate measurement**. Once you can measure the standing crop and the energy at each level, you can stack those levels into a shape — and that shape is the ecological pyramid we take up next.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 6, src: '',
      alt: 'Diagram of energy flow through trophic levels showing the sun and PAR entering producers, then herbivores, primary carnivores and secondary carnivores, with a parallel detritus food chain of dead matter and decomposers linking into the grazing food chain',
      caption: '📸 Tap each dot to follow the energy from the sun to the top carnivore — and down the detritus side',
      generation_prompt: "Scientific textbook illustration of energy flow through the trophic levels of an ecosystem, drawn as a food web with two connected food chains. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Top-left: a stylised sun with straight rays angling down to the right, with a narrowing band of rays reaching the plants to show that only part of the radiation is photosynthetically active. Lower-left: a broad group of green grasses and a woody plant labelled as producers, the first trophic level. A thick white arrow runs right from the plants to a grazing herbivore (a goat and an insect) labelled second trophic level. A thinner white arrow continues right to a primary carnivore labelled third trophic level, and a still thinner arrow to a secondary carnivore labelled fourth trophic level — each successive arrow visibly narrower than the last to show energy decreasing at each transfer. Along the bottom of the frame, a separate parallel chain in brown and tan: a pile of dead leaves, dead stems and animal remains labelled detritus, with an arrow to a cluster of fungi and bacteria drawn as decomposers. Thin downward white arrows drop from each of the grazing-chain organisms into the detritus pile. One white arrow rises from the decomposer cluster back up into the grazing chain to show that some detritus-chain organisms are prey to grazing-chain animals. Functional colours: green for the photosynthetic producers, pink and magenta for the animal consumers, brown and tan for the dead organic matter and decomposers. Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.10, y: 0.12, label: 'The sun and PAR', icon: 'circle',
          detail: 'Except for the **deep-sea hydro-thermal ecosystem**, the **sun is the only source of energy** for all ecosystems. Of the incident solar radiation, **less than 50 per cent is photosynthetically active radiation (PAR)** — the only part plants can use.' },
        { id: uuid(), x: 0.16, y: 0.60, label: 'Producers — first trophic level', icon: 'circle',
          detail: 'Green plants and photosynthetic bacteria (**autotrophs**) capture only **2–10 per cent of the PAR** and fix it into food from simple inorganic materials. This small amount sustains the entire living world. Major producers: **herbaceous and woody plants** on land, **phytoplankton, algae and higher plants** in water.' },
        { id: uuid(), x: 0.38, y: 0.52, label: 'Herbivores — second trophic level', icon: 'circle',
          detail: 'The **primary consumers**, feeding directly on producers. Common herbivores are **insects, birds and mammals** in terrestrial ecosystems and **molluscs** in aquatic ones. In the standard chain, this is the **goat** in Grass → Goat → Man.' },
        { id: uuid(), x: 0.60, y: 0.48, label: 'Primary carnivores — third trophic level', icon: 'circle',
          detail: 'Animals that feed on the herbivores. NCERT calls them **primary carnivores**, and they are the **secondary consumers**. Two different counts, one animal — this pair of names is the classic trap.' },
        { id: uuid(), x: 0.83, y: 0.44, label: 'Secondary carnivores — fourth trophic level', icon: 'circle',
          detail: 'Animals that depend on the primary carnivores for food — the **tertiary consumers**. A grazing food chain can run producer → herbivore → primary carnivore → secondary carnivore, and rarely further, because the energy left is too little.' },
        { id: uuid(), x: 0.30, y: 0.87, label: 'Detritus food chain (DFC)', icon: 'circle',
          detail: 'Begins with **dead organic matter**. Made up of **decomposers** — heterotrophs, **mainly fungi and bacteria**, also called **saprotrophs** — which secrete digestive enzymes to break detritus into simple inorganic materials and absorb them. In a **terrestrial** ecosystem a **much larger fraction of energy flows through the DFC** than through the GFC; in an **aquatic** ecosystem the **GFC is the major conduit**.' },
        { id: uuid(), x: 0.55, y: 0.78, label: 'The 10 per cent transfer', icon: 'circle',
          detail: 'Each narrowing arrow is the **10 per cent law**: only **10 per cent** of the energy is transferred from one trophic level to the next. The **amount of energy decreases at successive trophic levels**, which **restricts the number of trophic levels** in the grazing food chain.' },
      ],
    },
    {
      id: uuid(), type: 'comparison_card', order: 7, title: 'Grazing Food Chain vs Detritus Food Chain',
      columns: [
        { heading: 'Grazing Food Chain (GFC)',
          points: [
            'Starts from the **producers** — the green plants.',
            'Standard NCERT example: **Grass (producer) → Goat (primary consumer) → Man (secondary consumer)**.',
            'Energy enters it **directly from the sun**, fixed by photosynthesis.',
            'Members are producers, **herbivores** and **carnivores**.',
            'The **major conduit for energy flow in an aquatic ecosystem**.',
            'Its **number of trophic levels is restricted** by the 10 per cent law.',
          ] },
        { heading: 'Detritus Food Chain (DFC)',
          points: [
            'Begins with **dead organic matter** — detritus.',
            'Starts wherever an organism **dies**: death of an organism is the beginning of the DFC.',
            'Energy enters it **second-hand**, from the dead bodies and waste of the grazing chain.',
            'Made up of **decomposers** — heterotrophs, mainly **fungi and bacteria**, also called **saprotrophs**, which secrete digestive enzymes and absorb the simple inorganic products.',
            'In a **terrestrial ecosystem, a much larger fraction of energy flows through the DFC** than through the GFC.',
            'Connected to the GFC — **some DFC organisms are prey to GFC animals**, and omnivores like cockroaches and crows link both, making a **food web**.',
          ] },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "A grassland has 10,000 units of energy fixed by its grass. Insects eat the grass, small birds eat the insects, and hawks eat the small birds. A student proposes adding two more carnivore levels above the hawks. Using what NCERT says about energy transfer, why does nature not build that chain?",
      options: [
        "Because energy flow is unidirectional, so no energy can travel upward past the hawk",
        "Because the detritus food chain takes away all the energy before it can reach the higher carnivores",
        "Because only 10 per cent of the energy passes to each next level, so by the hawks only about 10 units remain and two more levels would leave almost nothing to live on",
        "Because the standing crop of the grass is measured as dry weight, which underestimates the energy available",
      ],
      reveal: "The transfer of energy follows the 10 per cent law: 10,000 units in the grass → about 1,000 in the insects → about 100 in the birds → about 10 in the hawks. Two more levels would leave roughly 1 unit and then 0.1 unit — nowhere near enough to sustain a population. That is precisely why NCERT says the number of trophic levels in the grazing food chain is restricted. The tempting wrong answer is the unidirectional one: energy flow being one-way is true, but it explains the *direction* of the flow (sun → producers → consumers, never back), not the *limit on how many levels* there can be. Unidirectional flow alone would happily allow twenty levels — it is the 10 per cent loss at every handover that stops the chain.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'The Numbers and Names to Lock In',
      markdown: "- **The sun is the only source of energy** for all ecosystems on Earth — **except the deep-sea hydro-thermal ecosystem**.\n- **Less than 50 per cent** of the incident solar radiation is **PAR**. Plants capture only **2–10 per cent of the PAR**. Do not merge these two numbers.\n- **Energy flow is unidirectional: sun → producers → consumers.** It never flows back.\n- **Trophic levels:** producers = 1st; **herbivores = primary consumers** = 2nd; **primary carnivores = secondary consumers** = 3rd; **secondary carnivores = tertiary consumers** = 4th.\n- **GFC starts at producers. DFC starts at dead organic matter.** Terrestrial → **more energy through the DFC**. Aquatic → **GFC is the major conduit**.\n- **Standing crop** = mass of living material at a trophic level at a particular time, measured as **biomass or number per unit area**. Biomass is expressed as fresh or **dry weight — dry weight is more accurate**.\n- **10 per cent law (Lindeman):** only **10 per cent** of the energy is transferred to the next trophic level — this **restricts the number of trophic levels**.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The two percentages:** NEET splits these deliberately. **PAR is less than 50 per cent of the incident solar radiation**, and plants capture **2–10 per cent of the PAR** — not 2–10 per cent of the total sunlight. Read the stem word by word.\n\n**The one exception:** the **deep-sea hydro-thermal ecosystem** is the only ecosystem NCERT exempts from sun-dependence. It is a one-line fact and it gets asked as one.\n\n**The naming trap:** a **primary carnivore is a secondary consumer** and sits at the **third trophic level**. A **secondary carnivore is a tertiary consumer** at the **fourth**. Whenever a question mixes 'carnivore' language with 'consumer' language, slow down and translate.\n\n**GFC vs DFC direction:** **terrestrial → DFC carries much more energy; aquatic → GFC is the major conduit.** Students swap these two almost every time. Anchor it on the forest floor — the leaf litter is enormous, and almost all of it goes to fungi and bacteria, not to grazers.\n\n**Standing crop:** the word is about **mass of living material at a given time**, measured as **biomass or number per unit area**, and **dry weight** is the more accurate expression of biomass.\n\n**Classic NEET question:** \"In a terrestrial ecosystem, which food chain carries the larger fraction of energy, and where does it begin?\" → the **detritus food chain**, and it begins with **dead organic matter**.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Of the solar radiation incident on the Earth, how much is photosynthetically active radiation (PAR), and how much of that PAR do plants actually capture?',
          options: [
            'Less than 50 per cent is PAR, and plants capture 2–10 per cent of that PAR',
            'Less than 50 per cent is PAR, and plants capture 50 per cent of that PAR',
            'About 2–10 per cent is PAR, and plants capture less than 50 per cent of that PAR',
            'About 10 per cent is PAR, and plants capture 10 per cent of that PAR',
          ],
          correct_index: 0,
          explanation: "NCERT states that less than 50 per cent of the incident solar radiation is PAR, and that plants capture only 2–10 per cent of that PAR. The most tempting distractor flips the two figures — making 2–10 per cent the PAR fraction — but 2–10 per cent is what plants capture out of the PAR, not the PAR share of sunlight itself. The 10-and-10 option borrows the 10 per cent law, which is about transfer between trophic levels, not about sunlight capture.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'A hawk feeds on a snake, which had fed on a frog, which had fed on a grasshopper that ate grass. Which trophic level does the snake occupy, and what is it called in consumer terms?',
          options: [
            'Second trophic level; primary consumer',
            'Fourth trophic level; tertiary consumer',
            'Third trophic level; secondary consumer',
            'Fourth trophic level; secondary consumer',
          ],
          correct_index: 1,
          explanation: "Grass is the producer (1st), the grasshopper is the herbivore/primary consumer (2nd), the frog is the primary carnivore/secondary consumer (3rd), and the snake — feeding on the primary carnivore — is the secondary carnivore/tertiary consumer at the 4th trophic level. The trap is the option pairing the fourth level with 'secondary consumer': 'secondary carnivore' and 'secondary consumer' are not the same animal, because the carnivore count and the consumer count start one level apart.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: 'Which statement about the grazing food chain (GFC) and the detritus food chain (DFC) is correct?',
          options: [
            'The GFC begins with dead organic matter, and the DFC begins with the producers',
            'In a terrestrial ecosystem the GFC carries much more energy than the DFC',
            'The two chains stay completely separate, since no DFC organism is ever eaten by a GFC animal',
            'In an aquatic ecosystem the GFC is the major conduit of energy flow, while in a terrestrial ecosystem much more energy flows through the DFC',
          ],
          correct_index: 3,
          explanation: "NCERT is explicit: in aquatic ecosystems the GFC is the major conduit for energy flow, whereas in terrestrial ecosystems a much larger fraction of energy flows through the detritus food chain. The most tempting distractor is the terrestrial-GFC claim, which reverses exactly this comparison. The first option swaps the starting points — the GFC starts at producers and the DFC at dead organic matter — and the chains are in fact connected, since some DFC organisms are prey to GFC animals, which is what makes a food web.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'What exactly is the standing crop of a trophic level, and how is it best expressed?',
          options: [
            'The rate at which energy is transferred to the next trophic level; expressed as a percentage',
            'The mass of living material present at that level at a particular time; biomass is more accurately expressed as dry weight',
            'The total dead organic matter accumulated at that level; expressed as fresh weight',
            'The number of trophic levels the chain can support; expressed as a whole number per unit area',
          ],
          correct_index: 1,
          explanation: "The standing crop is the mass of living material at a trophic level at a particular time, measured as biomass or as the number of organisms in a unit area, and NCERT notes that measuring biomass as dry weight is more accurate than fresh weight. The dead-organic-matter option is the tempting one, but detritus is the starting point of the DFC — standing crop counts living material only. The percentage-transfer option describes the 10 per cent law, which is a different idea altogether.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
