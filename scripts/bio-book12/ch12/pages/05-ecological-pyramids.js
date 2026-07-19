'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'ecological-pyramids',
  title: 'Ecological Pyramids — and When They Turn Upside Down',
  subtitle: "Stack the trophic levels one above the other and you get a pyramid: producers at the broad base, top carnivores at the narrow apex. Number and biomass pyramids can flip over. The energy pyramid never can — and that single fact is worth a NEET mark almost every year.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['ecosystem', 'ecological-pyramids', 'pyramid-of-energy', 'inverted-pyramid', 'standing-crop'],
  glossary: [
    { term: 'ecological pyramid', definition: 'A pyramid-shaped picture of the food or energy relationship between organisms at different trophic levels. The base of each pyramid represents the producers (first trophic level) and the apex represents the tertiary or top level consumer.' },
    { term: 'pyramid of number', definition: 'An ecological pyramid in which each bar shows the number of organisms at that trophic level. In a grassland ecosystem nearly 6 million plants support only three top-carnivores.' },
    { term: 'pyramid of biomass', definition: 'An ecological pyramid in which each bar shows the biomass — the mass of living material — at that trophic level. It usually shows a sharp decrease in biomass at higher trophic levels.' },
    { term: 'pyramid of energy', definition: 'An ecological pyramid in which each bar indicates the amount of energy present at each trophic level in a given time or annually per unit area. It is always upright and can never be inverted.' },
    { term: 'inverted pyramid', definition: 'A pyramid with a base narrower than the levels above it. Pyramids of number and of biomass can be inverted; the pyramid of energy cannot.' },
    { term: 'standing crop', definition: 'The certain mass of living material present at each trophic level at a particular time. It is measured as biomass or as the number of organisms in a unit area.' },
    { term: 'trophic level', definition: 'A functional feeding level, not a species. A given species may occupy more than one trophic level in the same ecosystem at the same time — a sparrow is a primary consumer when it eats seeds and a secondary consumer when it eats insects.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single huge tree standing over open grassland at dusk, with a haze of small insects around its canopy and a lone hawk high above it',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). One enormous old tree standing alone in open Indian grassland at dusk, its broad canopy filling most of the frame and its base narrow and dark against the ground. A faint haze of countless tiny insects drifts around the canopy, catching the last light like dust. A few small birds sit among the branches, and a single larger bird of prey circles high above, alone against the sky. The composition quietly reads bottom-heavy at the trunk and crowded at the top, as if the usual order of things has been turned over. Painterly, atmospheric illustration, naturalistic, deep dark tones throughout (#0a0a0a base), muted earthy palette. No people, no text, no labels, no diagram elements, no arrows.",
    },
    // ── fun_fact ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'One tree that stands the pyramid on its head',
      markdown: "Try counting. Sit under one big tree and count the **insects feeding on it**. Thousands. Now count the **small birds** that live off those insects — fewer. Then the **larger birds** that eat the smaller ones — fewer still. Finally count the trees. **One.**\n\nDraw the shape you just got. The producer level, which is supposed to be the broad base, is a single individual. Everything above it is wider. The pyramid has flipped over and is standing on its point.\n\nThe sea does the same trick with mass instead of number. There, the **biomass of fishes far exceeds that of the phytoplankton** they ultimately depend on. A small standing crop of phytoplankton holds up a large standing crop of zooplankton and fish. It looks like a paradox — and NCERT asks you straight out to explain it.",
    },
    // ── what a pyramid shows ─────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "You already know the shape of a pyramid — **broad at the base, narrowing towards the apex**. You get a similar shape whenever you express the food or energy relationship between organisms at different trophic levels.\n\nThat relationship is expressed in terms of **number, biomass or energy**. Whichever of the three you pick, the rule for reading the picture stays the same:\n\n- The **base of each pyramid represents the producers**, or the **first trophic level**.\n- The **apex represents the tertiary or top level consumer**.\n\nEach bar is a whole trophic level, and that word matters. Any calculation of energy content, biomass or numbers **has to include all the organisms at that trophic level**. No generalisation we make will be true if we take only a few individuals at any trophic level into account.\n\nAnd remember what a trophic level actually is — **a functional level, not a species as such**. A given species may occupy **more than one trophic level in the same ecosystem at the same time**. A sparrow is a **primary consumer** when it eats seeds, fruits and peas, and a **secondary consumer** when it eats insects and worms. (Work out how many trophic levels human beings function at.)",
    },
    // ── heading: the three kinds ─────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Three Kinds of Pyramid',
      objective: "By the end of this you can say what each bar of a pyramid of number, biomass and energy actually measures — and which of the three usually stays upright.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The three types of ecological pyramids usually studied are **(a) pyramid of number**, **(b) pyramid of biomass** and **(c) pyramid of energy**.\n\n**Pyramid of number** — each bar is a head count of the organisms at that level. In a grassland ecosystem, production of **nearly 6 million plants** supports **only three top-carnivores**. Six million at the base, three at the apex. That is the classic upright pyramid of numbers.\n\n**Pyramid of biomass** — each bar is the **mass of living material** at that level, the **standing crop**. Biomass is expressed as fresh or dry weight; dry weight is the more accurate measure. A biomass pyramid normally shows a **sharp decrease in biomass at higher trophic levels**.\n\n**Pyramid of energy** — each bar **indicates the amount of energy present at each trophic level in a given time or annually per unit area**. This is the pyramid that tracks the actual flow. The primary producers at its base convert only about **1 per cent of the energy in the sunlight available to them into NPP**, and above that, the **10 per cent law** takes over — only 10 per cent of the energy is transferred to each trophic level from the level below.\n\nIn **most ecosystems, all three pyramids — of number, of biomass and of energy — are upright**. Producers are more in number and biomass than the herbivores; herbivores are more in number and biomass than the carnivores; and energy at a lower trophic level is always more than at a higher level.\n\nBut two of those three have exceptions.",
    },
    // ── interactive image ────────────────────────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Three ecological pyramids side by side: an upright pyramid of energy, an inverted pyramid of number for a single tree, and an inverted pyramid of biomass for the sea',
      caption: '📸 Tap each dot to see what the bar measures — and why two of these pyramids ended up upside down',
      generation_prompt: "Scientific textbook illustration comparing three ecological pyramids. Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines throughout, laid out as three clearly separated panels in a row, each panel a stack of four horizontal bars. LEFT PANEL — an upright pyramid of energy: a very wide bottom bar tinted green (producers), a distinctly narrower bar above it tinted pink (herbivores), a much narrower bar above that (primary carnivores), and a tiny bar at the top (top carnivore); each bar dramatically smaller than the one below, forming a clean broad-based triangle, with a thin white arrow along the side pointing upward and small stylised wavy heat-loss arrows escaping sideways at every step. CENTRE PANEL — an inverted pyramid of number: at the bottom a single very narrow bar containing one small brown tree silhouette, above it a very wide bar filled with many tiny insect silhouettes tinted pink, above that a narrower bar of small bird silhouettes, and at the top a still narrower bar with one larger bird; the base is the narrowest bar so the stack visibly stands on its point. RIGHT PANEL — an inverted pyramid of biomass in the sea: a narrow bottom bar tinted green showing a small standing crop of tiny round phytoplankton, and a much wider bar above it tinted pink showing a large standing crop of zooplankton and small fish, with faint blue water tone behind the panel. Biologically accurate relative bar widths, no baked-in text labels, no numbers, no photorealism, no cartoon, no mascots, standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.16, y: 0.82, label: 'Base = producers', icon: 'circle',
          detail: 'The **base of every ecological pyramid represents the producers** — the **first trophic level**. Here it is the widest bar because the producers hold the most energy of any level.' },
        { id: uuid(), x: 0.16, y: 0.18, label: 'Apex = top carnivore', icon: 'circle',
          detail: 'The **apex represents the tertiary or top level consumer**. In a grassland, production of nearly **6 million plants** supports only **three top-carnivores** — that is how steeply the pyramid narrows.' },
        { id: uuid(), x: 0.16, y: 0.5, label: 'Energy lost at every step', icon: 'circle',
          detail: 'Each bar shows the **energy present at that trophic level in a given time or annually per unit area**. Some energy is **always lost as heat at each step**, which is exactly why this pyramid can never turn over.' },
        { id: uuid(), x: 0.5, y: 0.88, label: 'One tree at the base', icon: 'circle',
          detail: 'A **single big tree** is the whole producer level here, so the base is the narrowest bar. This is the classic **inverted pyramid of number**.' },
        { id: uuid(), x: 0.5, y: 0.55, label: 'Insects outnumber the tree', icon: 'circle',
          detail: 'Count the **insects feeding on that one tree**, then the **small birds** eating the insects, then the **larger birds** eating the smaller ones. Every level above the base is wider than the base, so the pyramid stands on its point.' },
        { id: uuid(), x: 0.84, y: 0.75, label: 'Small crop of phytoplankton', icon: 'circle',
          detail: 'In the sea, a **small standing crop of phytoplankton** sits at the base. **Standing crop** is the mass of living material present at a trophic level at a particular time.' },
        { id: uuid(), x: 0.84, y: 0.3, label: 'Large crop of zooplankton and fish', icon: 'circle',
          detail: 'That small phytoplankton crop supports a **large standing crop of zooplankton** — and the **biomass of fishes far exceeds that of phytoplankton**. So the **pyramid of biomass in sea is generally inverted**.' },
      ],
    },
    // ── table ────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 6,
      caption: 'The three ecological pyramids — what each measures, and which one is allowed to flip',
      headers: ['Pyramid of', 'What each bar measures', 'Can it be inverted?', 'NCERT example'],
      rows: [
        [
          '**Number**',
          'The **number of organisms** at that trophic level (all of them, not a few individuals)',
          '**Yes** — it can be upright or inverted',
          'Upright: nearly **6 million plants** in a grassland support only **three top-carnivores**. Inverted: the **insects, small birds and larger birds** living on **one big tree**',
        ],
        [
          '**Biomass**',
          'The **standing crop** — the mass of living material (fresh or dry weight; dry weight is more accurate)',
          '**Yes** — it can be upright or inverted',
          'Upright: a **sharp decrease in biomass at higher trophic levels**. Inverted: **in the sea**, where the **biomass of fishes far exceeds that of phytoplankton**',
        ],
        [
          '**Energy**',
          'The **energy present at that trophic level in a given time or annually per unit area**',
          '**No — always upright, can never be inverted**',
          'An ideal energy pyramid: primary producers convert only **1 per cent** of the sunlight available to them into **NPP**, and only **10 per cent** passes to each level above',
        ],
      ],
    },
    // ── heading: limitations ─────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'What the Pyramids Leave Out',
      objective: "By the end of this you can state the three limitations of ecological pyramids in the exact terms NCERT uses — and explain why each one matters.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Ecological pyramids are a neat picture, and neat pictures always cost something. NCERT lists **three limitations**, and all three are about what the drawing quietly ignores.\n\n**It assumes a simple food chain — it does not accommodate a food web.** A pyramid needs each organism parked on exactly one rung. Real ecosystems are woven: grazing food chains and detritus food chains cross over, omnivores like cockroaches and crows eat from several rungs, and those natural interconnections make a **food web**. A simple food chain is *something that almost never exists in nature*, and the pyramid is built on it anyway.\n\n**Saprophytes are not given any place in ecological pyramids** — even though they **play a vital role in the ecosystem**. The decomposers are the ones breaking dead organic matter back into simple inorganic material that everything else depends on, and there is no bar for them anywhere in the diagram.\n\n**It does not take into account the same species belonging to two or more trophic levels.** The sparrow again — primary consumer on seeds, secondary consumer on insects, in the same ecosystem at the same time. The pyramid has to pick one rung for it and pretend the other doesn't happen.\n\nSo hold both ideas together: the pyramid is the clearest single picture of how a food chain narrows as you climb it, and it is a simplification you should be able to criticise on demand. That closes the chapter — you have now followed an ecosystem all the way from its productivity and decomposition, through the flow of energy along trophic levels, to the three pyramids that put that flow on paper.",
    },
    // ── reasoning check ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A student argues: \"Since a small standing crop of phytoplankton in the sea can support a huge biomass of fish, an aquatic ecosystem should also be able to show an inverted pyramid of energy.\" What is wrong with this reasoning?",
      options: [
        "Nothing is wrong — the pyramid of energy in the sea is inverted for exactly the same reason as the pyramid of biomass",
        "Energy is always lost as heat at each transfer, so a higher trophic level can never hold more energy than the one below it",
        "Energy pyramids are drawn only for terrestrial ecosystems, so the question of inversion does not arise in the sea",
        "Phytoplankton are not producers, so they do not form the base of the energy pyramid in an aquatic ecosystem",
      ],
      correct_index: 1,
      reveal: "The **pyramid of energy is always upright and can never be inverted**, because **when energy flows from a particular trophic level to the next, some energy is always lost as heat at each step**. Biomass is a snapshot of the mass standing there at one moment, so a small, fast-turning phytoplankton crop can be outweighed by the fish above it — but the *energy* that passed through the producers must still be more than what reached the fish. The first option is the tempting trap: it takes the real inverted-biomass fact and stretches it to energy, but mass standing at a moment and energy flowing over time are different accounts. Energy pyramids are drawn for aquatic ecosystems too, and phytoplankton are very much the producers there.",
      difficulty_level: 3,
    },
    // ── remember ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'The Facts You Cannot Swap Around',
      markdown: "- **Base = producers (first trophic level). Apex = tertiary or top level consumer.** Same for all three pyramids.\n- **Pyramid of energy is ALWAYS upright and can NEVER be inverted** — because **some energy is always lost as heat at each transfer**. Pyramids of **number** and **biomass** may be **upright or inverted**.\n- The **two classic inverted examples**, word for word:\n  - **Inverted pyramid of number** — the **insects (and the birds above them) feeding on one big tree**.\n  - **Inverted pyramid of biomass** — **in the sea**, where a **small standing crop of phytoplankton supports a large standing crop of zooplankton**, and the **biomass of fishes far exceeds that of phytoplankton**.\n- The **three limitations of ecological pyramids**:\n  1. They **assume a simple food chain** (which almost never exists in nature) and **do not accommodate a food web**.\n  2. **Saprophytes are given no place**, despite playing a vital role.\n  3. They **do not take into account the same species belonging to two or more trophic levels**.\n- **Standing crop** = the mass of living material at a trophic level at a particular time, measured as **biomass or number per unit area**. **Dry weight** is the more accurate measure of biomass.",
    },
    // ── exam_tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**\"Which pyramid is always upright?\"** — this is the single most repeated line from §12.5. Answer: the **pyramid of energy**, and the reason is the marks: **energy is always lost as heat at every transfer**. Never write \"pyramid of biomass\" here just because biomass usually decreases upward — *usually* is not *always*, and the sea is the counter-example.\n\n**The two inverted examples are a matched pair.** Inverted **number** → **one big tree** with its insects. Inverted **biomass** → **the sea**. Swap those two and the whole question is gone. NEET deliberately writes options that cross them over.\n\n**The limitations are a list question.** Learn all three; a common option gives only two and looks complete.\n\n**Trophic level = a functional level, not a species.** The **sparrow** — primary consumer on seeds, secondary consumer on insects — is NCERT's own example and turns up as an assertion-reason item.\n\n**The numbers NCERT prints under its figures are examinable:** nearly **6 million plants** support **three top-carnivores** in a grassland; producers convert only **1 per cent** of available sunlight into **NPP**; only **10 per cent** of energy passes to the next trophic level.\n\n**Classic NEET question:** \"The pyramid of energy in an ecosystem is always upright because —\" → **energy is lost as heat at each successive trophic level**, so a higher level can never contain more energy than the one below it.",
    },
    // ── inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'In an ecological pyramid, what do the base and the apex represent?',
          options: [
            'The base represents the decomposers and the apex represents the producers',
            'The base represents the producers and the apex represents the tertiary or top level consumer',
            'The base represents the primary consumers and the apex represents the producers',
            'The base represents the top level consumer and the apex represents the saprophytes',
          ],
          correct_index: 1,
          explanation: "NCERT states that the base of each pyramid represents the producers, or the first trophic level, while the apex represents the tertiary or top level consumer. The tempting option puts decomposers at the base — but saprophytes are given no place in ecological pyramids at all, which is one of the stated limitations of the pyramids.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Which ecological pyramid can never be inverted, and why?',
          options: [
            'The pyramid of biomass, because biomass always decreases sharply at higher trophic levels',
            'The pyramid of number, because producers are always more numerous than the consumers above them',
            'The pyramid of energy, because some energy is always lost as heat at each transfer to the next level',
            'The pyramid of energy, because the number of trophic levels in a grazing food chain is restricted',
          ],
          correct_index: 2,
          explanation: "The pyramid of energy is always upright because when energy flows to the next trophic level, some is always lost as heat at each step, so a higher level can never hold more energy than the one below. The biomass option is the trap — biomass usually decreases upward, but in the sea it is inverted, so \"never\" is false for it. The last option names a true NCERT fact (the 10 per cent law restricts the number of trophic levels) but that limits the pyramid's height, not its direction.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'A small standing crop of phytoplankton supports a much larger standing crop of zooplankton in the sea. This is an example of:',
          options: [
            'An inverted pyramid of biomass',
            'An inverted pyramid of number',
            'An upright pyramid of biomass',
            'An inverted pyramid of energy',
          ],
          correct_index: 0,
          explanation: "Standing crop is measured as biomass, and here the base holds less of it than the level above, so this is the inverted pyramid of biomass — NCERT's sea example, where the biomass of fishes far exceeds that of phytoplankton. The inverted pyramid of number is the other classic example, but that one is the insects and birds feeding on a single big tree, and an energy pyramid can never be inverted at all.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which of the following is NOT a limitation of ecological pyramids as stated by NCERT?',
          options: [
            'They assume a simple food chain and do not accommodate a food web',
            'Saprophytes are given no place, even though they play a vital role in the ecosystem',
            'They do not account for the same species belonging to two or more trophic levels',
            'They cannot show the energy present at a trophic level per unit area annually',
          ],
          correct_index: 3,
          explanation: "Showing energy per unit area annually is precisely what the pyramid of energy does — each bar indicates the amount of energy at that trophic level in a given time or annually per unit area — so it is a feature, not a limitation. The other three are exactly the limitations NCERT lists: the assumed simple food chain, no place for saprophytes, and no room for a species like the sparrow that occupies two trophic levels at once.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
