// Class 12 Biology — Chapter 12 (Ecosystem)
// Practice — NCERT Exercises page. Authored per scripts/bio-book12/_practice/CONTRACT.md.
// 11 NCERT exercises, verbatim prompts, grouped into 5 revision themes with full worked solutions.

module.exports = {
  slug: 'ch12-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle:
    'All 11 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: '683972f5-0bd8-4029-88b0-9e2f16c87be4',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A pond ecosystem drawn as a food chain rising from phytoplankton to fish, with a faint energy pyramid behind it',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'Hand-drawn coloured illustration on a deep charcoal dark background, muted earthy palette (olive green, ochre, dusty teal, warm brown), no glow, no neon, no 3D, no orange. A calm pond-and-forest ecosystem shown as a food chain reading left to right: sun, then green producers (grass and a tree, and phytoplankton in water), then a grasshopper and a small fish (primary consumers), then a frog and a bird (secondary consumers), then a hawk at the top. Behind the chain, a faint translucent energy pyramid narrowing upward with "10%" hand-lettered at each step. In one corner an earthworm working through fallen leaf litter to suggest decomposition. Loose sketch-book line work, soft coloured-pencil shading, generous negative space, textbook-diagram feel. Landscape, desktop-friendly, wide 16:5 composition.',
    },
    {
      id: '4e407ac5-40b0-439e-8d92-0540a156b887',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are **all 11 NCERT exercises** for *Ecosystem*, regrouped out of the textbook's running order into **5 revision themes**: quick recall, ecosystem structure, productivity and energy flow, ecological pyramids and decomposition, and the compare-and-contrast set.\n\nEach question shows the exact NCERT wording. Try it first, then open the worked solution — the solution is the point. If you get one wrong, read the full answer and you'll pick up the whole idea, not just the missing word.",
    },
    {
      id: '869e6a94-103f-43ba-b10b-bbd7b2509316',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 12.1–12.11',
      intro:
        'Every end-of-chapter NCERT exercise for Ecosystem, with a one-line answer for a fast self-check and a full worked solution underneath.',
      sections: [
        {
          id: 'ee73d368-7c82-4bae-b0f9-745b7698ced1',
          title: 'Rapid recall — fill-ups & MCQs',
          blurb: 'The one-liners: fill in the blanks and the four objective questions.',
          items: [
            {
              kind: 'numerical',
              id: '7a423992-69c4-4438-832d-ceed9bc17659',
              source: 'ncert_exercise',
              source_label: 'NCERT 12.1',
              prompt:
                'Fill in the blanks.\n(a) Plants are called as _________ because they fix carbon dioxide.\n(b) In an ecosystem dominated by trees, the pyramid (of numbers) is _________ type.\n(c) In aquatic ecosystems, the limiting factor for the productivity is _________.\n(d) Common detritivores in our ecosystem are _________.\n(e) The major reservoir of carbon on earth is _________.',
              answer:
                '(a) producers (autotrophs) (b) inverted (c) light (d) earthworms (e) oceans',
              solution:
                '**(a) producers (autotrophs).** Green plants fix carbon dioxide during photosynthesis and build their own food — and, through that, the food of every other organism. Because they *produce* the energy-rich organic matter that enters the ecosystem, they are the producers, or autotrophs.\n\n**(b) inverted.** In a big-tree ecosystem a single tree (one producer) supports a large number of herbivorous birds and insects, which in turn support even more parasites. Because the base (producers) has *fewer* individuals than the levels above it, the pyramid of numbers is inverted.\n\n**(c) light.** In water, light gets absorbed and scattered as it goes deeper, so producers below the surface run short of it. Light is therefore the main factor limiting primary productivity in aquatic ecosystems (nutrients can limit it too).\n\n**(d) earthworms.** Detritivores feed on dead organic matter (detritus). Earthworms are the common example — they fragment the litter and speed up decomposition.\n\n**(e) oceans.** About 71% of the earth’s carbon is dissolved in the oceans, held as carbonates and bicarbonates. The oceans are the largest store, so they are the major reservoir of carbon.',
            },
            {
              kind: 'mcq',
              id: 'a8fbdb05-6e87-45c4-93fe-bf9b945ec8c5',
              source: 'ncert_exercise',
              source_label: 'NCERT 12.2',
              prompt:
                'Which one of the following has the largest population in a food chain?\n(a) Producers\n(b) Primary consumers\n(c) Secondary consumers\n(d) Decomposers',
              options: ['Producers', 'Primary consumers', 'Secondary consumers', 'Decomposers'],
              correct_index: 0,
              explanation:
                'Energy is greatest at the producer level and falls at every step up (only about 10% carries over). Because they sit at the base and pass energy on to everyone else, producers are usually the most numerous group in a food chain. Note: this is the general food-chain case — a single big tree is the classic exception where the pyramid of numbers inverts.',
            },
            {
              kind: 'mcq',
              id: 'db8dfe51-7c92-4b7d-a42b-5b7733a7398d',
              source: 'ncert_exercise',
              source_label: 'NCERT 12.3',
              prompt:
                'The second trophic level in a lake is\n(a) Phytoplankton\n(b) Zooplankton\n(c) Benthos\n(d) Fishes',
              options: ['Phytoplankton', 'Zooplankton', 'Benthos', 'Fishes'],
              correct_index: 1,
              explanation:
                'The first trophic level is the producers — the phytoplankton. The second trophic level is the primary consumers that graze on them, which in a lake are the zooplankton.',
            },
            {
              kind: 'mcq',
              id: '0dba1c12-c1a0-4eec-b6e3-a3a8f6ded519',
              source: 'ncert_exercise',
              source_label: 'NCERT 12.4',
              prompt:
                'Secondary producers are\n(a) Herbivores\n(b) Producers\n(c) Carnivores\n(d) None of the above',
              options: ['Herbivores', 'Producers', 'Carnivores', 'None of the above'],
              correct_index: 3,
              explanation:
                'In the NCERT scheme there is no such thing as a "secondary producer". Green plants are the producers; herbivores and carnivores are consumers. So none of the first three fit — the answer is (d).',
            },
            {
              kind: 'mcq',
              id: 'b3b109f8-7537-45c7-a6f6-2bf4c0184935',
              source: 'ncert_exercise',
              source_label: 'NCERT 12.5',
              prompt:
                'What is the percentage of photosynthetically active radiation (PAR) in the incident solar radiation?\n(a) 100%\n(b) 50 %\n(c) 1-5%\n(d) 2-10%',
              options: ['100%', '50 %', '1-5%', '2-10%'],
              correct_index: 1,
              explanation:
                'Of the sunlight that reaches plants, *less than 50%* is photosynthetically active radiation (PAR) — so the closest option is (b) 50%. Watch the trap: 2-10% (option d) is the fraction of that PAR which plants actually *capture* in photosynthesis, not the share of sunlight that is PAR.',
            },
          ],
        },
        {
          id: '2fae2cf7-7968-4701-bda0-808009eec16c',
          title: 'Ecosystem structure & components',
          blurb: 'What an ecosystem is built from.',
          items: [
            {
              kind: 'numerical',
              id: '9fe8cf77-d524-4da0-bcf1-72b9ce1c45e3',
              source: 'ncert_exercise',
              source_label: 'NCERT 12.7',
              prompt: 'Describe the components of an ecosystem.',
              answer:
                'Abiotic (climate, soil, inorganic and organic substances) + biotic (producers, consumers, decomposers), working through productivity, decomposition, energy flow and nutrient cycling.',
              solution:
                'An ecosystem has two kinds of components — **abiotic** (non-living) and **biotic** (living) — and they interact through a set of functions.\n\n**Abiotic components** — the physical and chemical surroundings: climate (light, temperature, water, rainfall), soil, and the inorganic and organic substances present (carbon, nitrogen, minerals, etc.). These set the stage and supply the raw materials.\n\n**Biotic components:**\n\n- **Producers (autotrophs)** — green plants (and, in water, phytoplankton) that make organic food from CO2 and sunlight.\n- **Consumers (heterotrophs)** — animals that eat other organisms. Primary consumers are herbivores; secondary and tertiary consumers are carnivores that eat other consumers.\n- **Decomposers (saprotrophs)** — fungi and bacteria that break down dead bodies and waste, releasing nutrients back to the abiotic pool.\n\n**How the components work together** — four functional aspects tie them into a living system: **productivity** (producers fixing energy), **decomposition** (nutrients returned to the soil), **energy flow** (one-way, sun → producers → consumers), and **nutrient cycling** (elements like carbon and nitrogen moving round and round).',
            },
          ],
        },
        {
          id: '1ef435e7-931a-450c-bc83-f87bd6117640',
          title: 'Productivity, energy flow & the 10% law',
          blurb: 'How energy enters the ecosystem and how little of it moves up.',
          items: [
            {
              kind: 'numerical',
              id: 'b2a92aba-4188-4465-8ea4-d7e30b35f090',
              source: 'ncert_exercise',
              source_label: 'NCERT 12.9',
              prompt:
                'What is primary productivity? Give brief description of factors that affect primary productivity.',
              answer:
                'The rate at which producers fix energy/biomass (GPP), with $NPP = GPP - R$ left for consumers. It depends on the plant species, and on sunlight, temperature, water and nutrient availability.',
              solution:
                '**Primary productivity** is the amount of biomass (or energy) that producers build up per unit area over a given time through photosynthesis. It is written as weight (g m⁻²) or as energy (kcal m⁻²), and it has two parts:\n\n- **Gross primary productivity (GPP)** — the *total* rate at which producers fix organic matter.\n- **Net primary productivity (NPP)** — what is *left over* for the consumers after the plants have used some for their own respiration:\n\n$NPP = GPP - R$\n\nwhere $R$ is the energy lost in respiration. NPP is the biomass actually available to herbivores and decomposers.\n\n**Factors that affect primary productivity:**\n\n- **The plant species** — the kind of vegetation present sets the ceiling on how much can be fixed.\n- **Environmental factors** — sunlight, temperature and water (and, in water bodies, how deep light can reach).\n- **Availability of nutrients** — nitrogen, phosphorus and other minerals in the soil or water.\n- **The photosynthetic capacity of the plants** themselves.\n\nBecause these differ from place to place, productivity varies widely between ecosystems.',
            },
            {
              kind: 'numerical',
              id: 'a385c81d-04dd-40dd-8c23-4e605f9ea7c7',
              source: 'ncert_exercise',
              source_label: 'NCERT 12.11',
              prompt: 'Give an account of energy flow in an ecosystem.',
              answer:
                'Sun → producers → herbivores → carnivores, one-way only; about 10% of energy passes to each next level (Lindeman’s 10% law), so chains stop at 4–5 links.',
              solution:
                'The **sun** is the source of energy for almost every ecosystem.\n\n**Getting energy in.** Of the sunlight reaching plants, less than 50% is photosynthetically active radiation (PAR), and plants capture only about **2–10% of that PAR**, fixing it as chemical energy — this is the GPP. From here the energy moves through the living world.\n\n**Direction of flow.** Energy flows **one way only**: sun → producers → herbivores → carnivores. It never flows back, and it obeys the laws of thermodynamics. Two routes carry it: the **grazing food chain (GFC)**, which starts with living green plants, and the **detritus food chain (DFC)**, which starts with dead organic matter.\n\n**The 10% law.** At each transfer to the next trophic level, only about **10%** of the energy is passed on (Lindeman’s 10% law); the rest is lost as heat through respiration. So if the producers trap **1000 J**:\n\n- herbivores get ≈ **100 J**,\n- primary carnivores get ≈ **10 J**,\n- top carnivores get ≈ **1 J**.\n\n**Why chains are short.** Because so much energy is lost at every step, there is too little left to support many levels — most food chains stop at just **4 or 5 trophic levels**.',
            },
          ],
        },
        {
          id: '095b4e8c-713a-4572-aea3-caf70054e19e',
          title: 'Ecological pyramids & decomposition',
          blurb: 'The three pyramids (with the two inverted cases) and how detritus is broken down.',
          items: [
            {
              kind: 'numerical',
              id: 'c5c03219-85e3-4c0b-954b-c122588c5f43',
              source: 'ncert_exercise',
              source_label: 'NCERT 12.8',
              prompt:
                'Define ecological pyramids and describe with examples, pyramids of number and biomass.',
              answer:
                'A pyramid is a graph of number/biomass/energy per trophic level (producers at base). Pyramid of numbers: usually upright, inverted in a big tree. Pyramid of biomass: usually upright, inverted in the sea.',
              solution:
                'An **ecological pyramid** is a graphic picture of the relationship between the trophic levels of an ecosystem, drawn in terms of **number**, **biomass**, or **energy**. The **producers** form the base and the **top carnivores** sit at the apex.\n\n**Pyramid of numbers** — counts the *individuals* at each level.\n\n- *Upright example:* a grassland — many grass plants support fewer grasshoppers, which support still fewer birds and hawks.\n- *Inverted example:* a **big tree** — one tree (one producer at the base) feeds a large number of herbivorous birds and insects, which feed even more parasites. Fewer at the bottom than the top, so the pyramid turns upside down.\n\n**Pyramid of biomass** — measures the *dry weight* of living matter at each level.\n\n- *Upright example:* a forest — the huge mass of trees at the base is far greater than the mass of the animals above.\n- *Inverted example:* the **sea (a pond or ocean)** — at any single moment the standing biomass of the tiny phytoplankton is *less* than that of the zooplankton and fish feeding on them, because the phytoplankton are eaten and replaced very quickly. So the biomass pyramid is inverted.\n\n(By contrast, the pyramid of **energy** is always upright — energy is lost at every step, so a level can never hold more energy than the one below it.)',
            },
            {
              kind: 'numerical',
              id: 'ab25979f-d1b7-4ace-a6ba-f6dfaa79f88d',
              source: 'ncert_exercise',
              source_label: 'NCERT 12.10',
              prompt:
                'Define decomposition and describe the processes and products of decomposition.',
              answer:
                'Decomposition = decomposers breaking dead organic matter into inorganic substances. Steps: fragmentation, leaching, catabolism, humification, mineralisation. Products: humus + inorganic nutrients (CO2, water, minerals).',
              solution:
                '**Decomposition** is the process by which decomposers break down complex dead organic matter (detritus) into simple **inorganic substances** such as carbon dioxide, water and mineral nutrients. Detritus is the raw material: dead leaves, bark, flowers, dead animal remains and faecal matter.\n\n**The processes (steps):**\n\n- **Fragmentation** — detritivores (like earthworms) break the detritus into smaller pieces, increasing its surface area.\n- **Leaching** — water-soluble inorganic nutrients seep down into the soil and settle as unavailable salts.\n- **Catabolism** — bacterial and fungal enzymes chemically break the detritus into simpler inorganic compounds.\n- **Humification** — a dark-coloured, amorphous substance called **humus** accumulates. Humus is highly resistant to microbial action and breaks down very slowly.\n- **Mineralisation** — the humus is further degraded by microbes, releasing inorganic nutrients into the soil.\n\n**Products:** **humus** and **inorganic nutrients** (CO2, water and mineral salts) that are returned to the soil and the air.\n\n**Rate:** decomposition is largely **oxygen-requiring (aerobic)**. It is faster when it is **warm and moist**, and when the detritus is rich in nitrogen and water-soluble sugars; it is slower in cold or waterlogged (anaerobic) conditions and when the detritus is rich in lignin and chitin.',
            },
          ],
        },
        {
          id: 'a6594056-8d40-4792-82a3-a4a1ff9108f7',
          title: 'Distinguish between',
          blurb: 'The compare-and-contrast set — all six pairs.',
          items: [
            {
              kind: 'numerical',
              id: '46408150-9a03-4c40-aefd-04f344099440',
              source: 'ncert_exercise',
              source_label: 'NCERT 12.6',
              prompt:
                'Distinguish between\n(a) Grazing food chain and detritus food chain\n(b) Production and decomposition\n(c) Upright and inverted pyramid\n(d) Food chain and Food web\n(e) Litter and detritus\n(f) Primary and secondary productivity',
              answer:
                'Six contrasts — GFC starts with living plants vs DFC with dead matter; production builds organic matter vs decomposition breaks it down; upright pyramid narrows upward vs inverted widens; a food chain is one line vs a food web is a network; litter is surface plant remains vs detritus is all dead matter; primary productivity is by producers vs secondary by consumers.',
              solution:
                '**(a) Grazing food chain (GFC) vs Detritus food chain (DFC)**\n\n| Grazing food chain (GFC) | Detritus food chain (DFC) |\n|---|---|\n| Starts with living green plants (producers) | Starts with dead organic matter (detritus) |\n| Energy comes straight from the sun via photosynthesis | Energy comes from the detritus / organic remains |\n| Producers → herbivores → carnivores | Detritus → detritivores → their predators |\n| Major energy route in many aquatic ecosystems | Major energy route in most terrestrial ecosystems |\n\n**(b) Production vs Decomposition**\n\n| Production | Decomposition |\n|---|---|\n| Producers *build* organic matter (biomass) by photosynthesis | Decomposers *break down* dead organic matter into inorganic substances |\n| Energy is stored / fixed | Energy is released; nutrients returned to the soil |\n\n**(c) Upright vs Inverted pyramid**\n\n| Upright pyramid | Inverted pyramid |\n|---|---|\n| Broad base, narrows towards the apex | Narrow base, widens towards the apex |\n| Producers most numerous / most biomass (e.g. grassland numbers, forest biomass) | Base has fewer/less than the levels above (e.g. numbers in a big tree; biomass in the sea) |\n\n**(d) Food chain vs Food web**\n\n| Food chain | Food web |\n|---|---|\n| A single, straight line of who-eats-whom | Many interconnected food chains linked together |\n| Each organism has one food source and one consumer | An organism can eat, and be eaten by, several others |\n\n**(e) Litter vs Detritus**\n\n| Litter | Detritus |\n|---|---|\n| The surface layer of freshly fallen dead plant parts (leaves, twigs) | *All* dead organic matter — dead leaves, bark, flowers, dead animal remains and faecal matter |\n| A component of detritus | The whole raw material that decomposers act upon |\n\n**(f) Primary vs Secondary productivity**\n\n| Primary productivity | Secondary productivity |\n|---|---|\n| Rate at which *producers* fix energy/biomass by photosynthesis | Rate at which *consumers* (heterotrophs) build new organic matter |\n| Measured as GPP and NPP | The energy consumers assimilate and turn into their own biomass |',
            },
          ],
        },
      ],
    },
  ],
};
