module.exports = {
  slug: 'ch11-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle: 'All 10 NCERT textbook exercises for the chapter, grouped into 4 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: 'bece288f-0d48-4326-8b6f-a80960bc4024',
      type: 'image',
      order: 0,
      src: '',
      alt: 'Organisms and populations — a savanna scene showing a herd, a lone predator, an orchid on a tree branch, and a small population-growth curve sketched in the corner.',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'Hand-drawn coloured illustration on a deep charcoal (near-black) dark background, muted earthy palette (ochre, sage green, dull terracotta, soft slate blue), no glow, no neon, no 3D, no orange tech look. A wide landscape banner for a biology chapter titled "Organisms and Populations". Left third: a small herd of deer grazing on dry grassland (a population). Middle: a lone leopard resting on a rock (predation), and a cactus with thorns plus an orchid clinging to a mango-tree branch (interactions). Right third: a simple sketched S-shaped logistic growth curve on faint graph lines, axes labelled population and time, with a dashed carrying-capacity line K. Soft hand-inked linework, textbook-illustration feel, calm and academic. No text other than the tiny axis labels.',
    },
    {
      id: 'c73e424a-dfdc-4176-b07b-5cf8fd8d9cd3',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are all **10 NCERT exercises** for *Organisms and Populations*, regrouped out of the textbook's running order into four revision themes: what a population actually is, how populations grow, how species live together, and how plants defend themselves. Try each question with the book closed, then check your reasoning against the full worked solution. Getting one wrong is fine — the point is that the solution teaches you the whole idea.",
    },
    {
      id: '709f593b-0b15-4c23-9648-8dd72b53c482',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 11.1–11.10',
      intro: 'Every end-of-chapter NCERT question, with a complete worked solution for each. Work through a whole theme in one sitting.',
      sections: [
        {
          id: '1ccad915-6a80-445d-b4ab-57fcca610edd',
          title: 'What a population is',
          blurb: 'The idea of a population and a community, and the group-level attributes an individual can never have.',
          items: [
            {
              kind: 'numerical',
              id: 'f260c286-8ec3-4361-91d9-7155e01bbdb6',
              source: 'ncert_exercise',
              source_label: 'NCERT 11.1',
              prompt: 'List the attributes that populations possess but not individuals.',
              answer: 'Birth rate, death rate, sex ratio, age distribution (age pyramid), population density and growth rate — all are group-level measures.',
              solution:
                "An individual is born, grows old and dies — but it cannot *have* a birth rate or a death rate. Those are ratios that only mean something for a group. So the attributes below belong to a **population**, never to a single organism:\n\n- **Birth rate (natality)** — number of births per capita per unit time (e.g. births per 1000 individuals per year).\n- **Death rate (mortality)** — number of deaths per capita per unit time.\n- **Sex ratio** — the proportion of males to females; an individual is simply male or female, but a *ratio* needs many individuals.\n- **Age distribution / age pyramid** — the fraction of the population in pre-reproductive, reproductive and post-reproductive age groups.\n- **Population density** — the number of individuals per unit area or volume.\n- **Growth rate** — how fast the population is increasing or decreasing.\n\nThe common thread: each attribute is a property of the *whole group*, computed across many individuals.",
            },
            {
              kind: 'numerical',
              id: '2e945f05-79dc-462c-94fc-e99efcf07e52',
              source: 'ncert_exercise',
              source_label: 'NCERT 11.6',
              prompt: 'Define population and community.',
              answer: 'Population = individuals of one species in a given area at a given time; community = all the different populations living together and interacting in an area.',
              solution:
                "**Population.** A group of individuals of the **same species** that live in a **given geographical area**, share or compete for the same resources, can potentially interbreed, and are counted at a **particular time**. Example: all the lotus plants in a pond, or all the rats in a field.\n\n**Community (biotic community).** An **assemblage of all the populations of different species** that live in a given area and **interact** with one another. So a community is made of many populations. Example: the pond community is the lotus, the fish, the frogs, the insects, the algae and the microbes all living and interacting together.\n\nThe simple ladder to remember: individual → population (one species) → community (many species interacting).",
            },
            {
              kind: 'numerical',
              id: 'b9bef2a8-aea3-4462-a5e2-ef0ad527f0f6',
              source: 'ncert_exercise',
              source_label: 'NCERT 11.10',
              prompt: 'List any three important characteristics of a population and explain.',
              answer: 'Population density, birth rate (natality) and death rate (mortality) — plus age distribution and sex ratio.',
              solution:
                "A population is described by group-level characteristics. Any three, explained:\n\n1. **Population density.** The number of individuals present per unit area or volume at a given time. It tells us how crowded the population is. Density need not always be counted as absolute numbers — sometimes it is measured indirectly (e.g. percent cover for plants, or the number of pug marks / faecal pellets for animals).\n2. **Birth rate (natality).** The number of new individuals added to the population per capita over a unit time. A high birth rate pushes the population up.\n3. **Death rate (mortality).** The number of individuals lost per capita over a unit time. A high death rate pulls the population down.\n\n(Other valid characteristics you could explain instead: **age distribution** — the proportion of individuals in pre-reproductive, reproductive and post-reproductive ages, often drawn as an age pyramid; and **sex ratio** — the ratio of males to females.)\n\nTogether, birth rate and immigration add to a population, while death rate and emigration remove from it.",
            },
          ],
        },
        {
          id: 'acc5ab9d-31e1-4896-ad12-497475d33ef7',
          title: 'How populations grow',
          blurb: 'The exponential rate of increase, and the S-shaped logistic curve that limited resources force.',
          items: [
            {
              kind: 'numerical',
              id: 'b71c3506-41fa-41c3-a45e-19cfea805cc0',
              source: 'ncert_exercise',
              source_label: 'NCERT 11.2',
              prompt: 'If a population growing exponentially double in size in 3 years, what is the intrinsic rate of increase (r) of the population?',
              answer: 'r ≈ 0.231 per individual per year.',
              solution:
                "Exponential growth follows $ N_t = N_0 \\, e^{rt} $, where $ N_0 $ is the starting number, $ N_t $ the number after time $ t $, and $ r $ the intrinsic rate of natural increase.\n\n**Step 1 — write what 'doubling' means.** After $ t = 3 $ years the population is twice the start, so $ N_t = 2 N_0 $.\n\n**Step 2 — put that into the equation.**\n\n$ 2 N_0 = N_0 \\, e^{r \\times 3} $\n\nDivide both sides by $ N_0 $:\n\n$ 2 = e^{3r} $\n\n**Step 3 — take natural logs of both sides.**\n\n$ \\ln 2 = 3r $\n\n**Step 4 — solve for r.** Using $ \\ln 2 = 0.693 $:\n\n$ r = \\frac{0.693}{3} = 0.231 $\n\nSo the intrinsic rate of increase is $ r \\approx 0.231 $ per individual per year. (Notice $ r $ does not depend on the actual population size — only on how quickly it doubles.)",
            },
            {
              kind: 'numerical',
              id: 'ee1139e2-df03-4bc7-8f80-f22ffbe728db',
              source: 'ncert_exercise',
              source_label: 'NCERT 11.8',
              prompt: 'With the help of suitable diagram describe the logistic population growth curve.',
              answer: 'A sigmoid (S-shaped) curve given by dN/dt = rN(K−N)/K, levelling off at the carrying capacity K because resources are limited.',
              solution:
                "No real habitat has unlimited food and space, so populations cannot grow exponentially forever. Once resources become limiting, a given habitat can support only a maximum number of individuals — its **carrying capacity, K**. Growth that respects this limit is described by the **logistic (Verhulst–Pearl) model**:\n\n$ \\frac{dN}{dt} = rN \\left( \\frac{K - N}{K} \\right) $\n\nwhere $ N $ = population density at time $ t $, $ r $ = intrinsic rate of increase, and $ K $ = carrying capacity.\n\n**Reading the term $ (K - N)/K $:** when $ N $ is small it is close to 1, so growth is fast; as $ N $ approaches $ K $ it shrinks towards 0, so growth slows and finally stops (when $ N = K $, the bracket is 0 and $ dN/dt = 0 $).\n\n**The diagram** — plot population density $ N $ on the y-axis against time $ t $ on the x-axis. The logistic curve is **S-shaped (sigmoid)** with three visible parts:\n\n1. a slow **lag phase** at the start (few individuals),\n2. a steep **acceleration / exponential phase** in the middle,\n3. a **deceleration phase** that flattens into a horizontal **plateau (asymptote) at $ N = K $**.\n\nDraw a dashed horizontal line at K to mark the carrying capacity the curve settles onto. Because most natural populations face limited resources, the logistic model is considered a **more realistic** description of growth than the exponential J-shaped curve.",
            },
          ],
        },
        {
          id: '51680116-0133-47dc-b423-77aafa15f337',
          title: 'Living together — species interactions',
          blurb: 'Commensalism, parasitism, mutualism, competition, camouflage — the sign-pairs and their textbook examples.',
          items: [
            {
              kind: 'numerical',
              id: '46eda80c-86fc-40e1-a5a6-8c92b876c305',
              source: 'ncert_exercise',
              source_label: 'NCERT 11.4',
              prompt: 'An orchid plant is growing on the branch of mango tree. How do you describe this interaction between the orchid and the mango tree?',
              answer: 'Commensalism (+ / 0) — the epiphytic orchid benefits, the mango tree is unaffected.',
              solution:
                "This is **commensalism**. The orchid is an **epiphyte** — it grows *on* the mango branch only to get space, support and better access to light, not to steal food from it. So:\n\n- The **orchid benefits** (it gets a place to live and reach sunlight). — a **plus**.\n- The **mango tree is neither harmed nor benefited**. — a **zero**.\n\nAn interaction where one species gains and the other is unaffected is commensalism, written as **( + , 0 )**. It is *not* parasitism, because the orchid does not draw nutrients from the mango or damage it.",
            },
            {
              kind: 'numerical',
              id: '9d306806-5520-496b-9ec2-38be79b49eb1',
              source: 'ncert_exercise',
              source_label: 'NCERT 11.7',
              prompt: 'Define the following terms and give one example for each:\n(a) Commensalism\n(b) Parasitism\n(c) Camouflage\n(d) Mutualism\n(e) Interspecific competition',
              answer: 'Commensalism (+,0) orchid on mango; Parasitism (+,−) Cuscuta on host; Camouflage — leaf/stick insect; Mutualism (+,+) lichen; Interspecific competition (−,−) Galapagos goats vs Abingdon tortoise.',
              solution:
                "**(a) Commensalism ( + , 0 ).** One species benefits and the other is neither harmed nor benefited.\n*Example:* an orchid (epiphyte) growing on a mango branch; or barnacles attached to a whale; or the cattle egret feeding on insects flushed out by grazing cattle.\n\n**(b) Parasitism ( + , − ).** The **parasite** benefits by living on or in the **host**, drawing nourishment from it, while the host is harmed. Parasites are often host-specific.\n*Example:* *Cuscuta* (a leafless stem parasite) on a host plant; or the human liver fluke; or ticks and lice on animals.\n\n**(c) Camouflage.** A **cryptic coloration or shape** that lets a prey (or predator) blend so well with its surroundings that it is not easily detected.\n*Example:* a stick insect or a green leaf-like insect that is hard to spot against the plant; or frogs whose colour matches the background.\n\n**(d) Mutualism ( + , + ).** Both interacting species **benefit** from the relationship.\n*Example:* **lichens** — a mutualism between a fungus and photosynthetic algae/cyanobacteria; or **mycorrhizae** — fungi living with the roots of higher plants; or the fig–fig wasp partnership.\n\n**(e) Interspecific competition ( − , − ).** Two **different species** compete for the same limiting resource, and both are harmed.\n*Example:* the Abingdon tortoise of the Galapagos becoming extinct after **goats** were introduced, because the goats out-competed them for food; or Connell's barnacles (*Balanus* crowding out *Chthamalus*).",
            },
            {
              kind: 'mcq',
              id: '24153ff9-f891-4cae-885d-33a17a3e25b0',
              source: 'ncert_exercise',
              source_label: 'NCERT 11.9',
              prompt: 'Select the statement which explains best parasitism.',
              options: [
                'One organism is benefited.',
                'Both the organisms are benefited.',
                'One organism is benefited, other is not affected.',
                'One organism is benefited, other is affected.',
              ],
              correct_index: 3,
              explanation:
                "Parasitism is a **( + , − )** interaction: the **parasite is benefited** while the **host is harmed (affected)**. So option (d) is correct.\n\nWhy the others are wrong: (a) 'one organism is benefited' is incomplete — it doesn't say what happens to the other. (b) 'both benefited' describes **mutualism**. (c) 'one benefited, other not affected' describes **commensalism**. Only (d) captures the harm done to the host, which is the defining feature of parasitism.",
            },
          ],
        },
        {
          id: 'd08315df-9cb7-4d29-ac6f-e1482fa7d89e',
          title: 'Defence and biological control',
          blurb: 'How plants fight back against grazers, and the predator–prey principle behind biological pest control.',
          items: [
            {
              kind: 'numerical',
              id: '15a5ed2a-6d47-4ffd-bc80-c6db2371c0ab',
              source: 'ncert_exercise',
              source_label: 'NCERT 11.3',
              prompt: 'Name important defence mechanisms in plants against herbivory.',
              answer: 'Morphological defences (thorns, spines) and chemical defences (toxic or distasteful chemicals like cardiac glycosides, nicotine, quinine, strychnine).',
              solution:
                "Plants cannot run away, so they defend against grazers and browsers in two main ways:\n\n**1. Morphological (physical) defences.**\n- **Thorns** — as in *Acacia*.\n- **Spines** — as in *cactus (Opuntia)*.\nThese sharp structures physically discourage animals from eating the plant.\n\n**2. Chemical defences.** Many plants make chemicals that make the herbivore **sick, deter feeding, disrupt digestion, or even kill** it.\n- *Calotropis* produces highly poisonous **cardiac glycosides**, which is why cattle and goats avoid browsing on it.\n- A wide range of chemicals — **nicotine, caffeine, quinine, strychnine, opium** and others we now use as drugs, stimulants or insecticides — were actually produced by plants as defences against grazers and browsers.\n\nSo the answer: **thorns and spines (morphological)** plus **toxic/distasteful secondary chemicals (chemical)**.",
            },
            {
              kind: 'numerical',
              id: '781545df-da3f-421a-8ad7-dfe0d2154333',
              source: 'ncert_exercise',
              source_label: 'NCERT 11.5',
              prompt: 'What is the ecological principle behind the biological control method of managing with pest insects?',
              answer: 'Predation — a natural predator (or parasitoid) keeps the prey/pest population in check.',
              solution:
                "The ecological principle is **predation** — the ability of a **predator (or parasitoid)** to **regulate the population of its prey**.\n\nIn nature, predators keep prey populations under control; when a predator is removed, the prey can explode in numbers. Biological pest control puts this to work: instead of spraying chemical pesticides, we introduce or encourage the pest's **natural enemy** (a predator or parasitoid), which feeds on the pest and holds its population down.\n\nSo the same predator–prey relationship that stabilises populations in the wild is the ecological basis of biological control.",
            },
          ],
        },
      ],
    },
  ],
};
