// Class 12 Biology — Chapter 13 (Biodiversity and Conservation)
// "Practice — NCERT Exercises" page. All 10 NCERT textbook exercises,
// regrouped into 4 revision themes with full worked solutions.
// Authored per scripts/bio-book12/_practice/CONTRACT.md. Do NOT insert here.

module.exports = {
  slug: 'ch13-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle:
    'All 10 NCERT textbook exercises for the chapter, grouped into 4 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    // ── block 0 — hero image (placeholder src + generation prompt) ──────────
    {
      id: 'fd276553-ff38-4c85-bf2e-85866bdc788e',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A richly layered tropical rainforest scene fading into a bare, eroded hillside, showing the contrast between thriving biodiversity and species loss.',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'Hand-drawn coloured illustration on a deep charcoal (near-black) dark background, muted earthy palette (mossy greens, ochre, warm browns, soft teal), NO glow, NO neon, NO orange accents, NO 3D render. A wide 16:5 landscape banner split gently across its width: on the left, a dense multi-layered tropical rainforest teeming with life — tall canopy trees, hanging vines, a hornbill, a frog, butterflies, a tiger half-hidden in undergrowth; the middle transitions through a small protected grove ringed by trees; on the right the land thins into a dry, eroded, deforested slope with cut stumps and a flooding river below. Small hand-labelled field-notebook style annotations in a light cream ink pointing to "genetic • species • ecosystem" on the forest side and "habitat loss" on the bare side. Textbook plate feel, calm and studious, no photographic realism.',
    },

    // ── block 1 — short intro text ─────────────────────────────────────────
    {
      id: 'dfc4d022-b107-4eee-90cf-1c7ba98263c5',
      type: 'text',
      order: 1,
      markdown:
        "You have read the chapter — now drill it. Below are **all 10 NCERT textbook exercises** for *Biodiversity and Conservation*, pulled out of the book's running order and regrouped into four revision themes: what biodiversity is and how we count it, why it is spread so unevenly, why it matters and why it is being lost, and how we protect it.\n\nEach question keeps its exact NCERT wording. Try it on your own first, then open the worked solution — the solution is the real lesson. If you get one wrong, read the full answer and the idea should click into place.",
    },

    // ── block 2 — the practice bank ────────────────────────────────────────
    {
      id: 'd5631b43-c693-411c-8784-2415a039ba2e',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 13.1–13.10',
      intro:
        'All ten end-of-chapter exercises, regrouped into four revision themes. Attempt first, then check the full worked solution.',
      sections: [
        // ─────────────────────────────────────────────────────────────────
        {
          id: '44f7fa7b-faca-4399-a61d-32bc04f47bb2',
          title: 'What biodiversity is, and how we count it',
          blurb: 'The three levels of diversity, estimating global species number, and reading the species–area curve.',
          items: [
            {
              kind: 'numerical',
              id: '7f0472a7-fefa-4026-91b8-5f4c77e91150',
              source: 'ncert_exercise',
              source_label: 'NCERT 13.1',
              prompt: 'Name the three important components of biodiversity.',
              answer: 'Genetic diversity, species diversity and ecological (ecosystem) diversity.',
              solution:
                "Biodiversity is diversity at **three levels**:\n\n1. **Genetic diversity** — the variation in genes *within* a single species. Example: the medicinal plant *Rananga* — sorry, the medicinal plant *Rauwolfia vomitoria* growing in different Himalayan ranges shows genetic variation in the potency and concentration of the chemical **reserpine** it produces. India has more than 50,000 genetically different strains of rice, and 1,000 varieties of mango.\n\n2. **Species diversity** — the variety of species *within a region*. Example: the Western Ghats have a greater amphibian species diversity than the Eastern Ghats.\n\n3. **Ecological (ecosystem) diversity** — diversity at the level of ecosystems. Example: India, with its deserts, rainforests, mangroves, coral reefs, wetlands, estuaries and alpine meadows, has a greater ecosystem diversity than a Scandinavian country like Norway.\n\nThe term *biodiversity* was popularised by the sociobiologist **Edward Wilson**.",
            },
            {
              kind: 'numerical',
              id: '3a41653d-619d-4516-bdb8-8fa3cc9125f7',
              source: 'ncert_exercise',
              source_label: 'NCERT 13.2',
              prompt: 'How do ecologists estimate the total number of species present in the world?',
              answer: 'By statistical extrapolation — scaling up the well-studied ratio of tropical to temperate species richness; Robert May put the global figure at about 7 million.',
              solution:
                "We cannot simply count every species — most have never even been described. So ecologists **estimate** using a statistical comparison.\n\n- So far a little more than **1.5 million** species have been recorded and named.\n- To guess the true total, they take groups that *are* well studied (for example insects, and especially in temperate regions where taxonomy is more complete) and work out the **ratio** between the number of species there and elsewhere.\n- This ratio is then applied to the poorly studied groups and regions (mostly the species-rich tropics) to scale the known number up to a probable total.\n\nUsing such extrapolations, **Robert May** placed the global species diversity at about **7 million**. So even though roughly 1.5 million are described, the real number is thought to be several times larger — most of the undescribed species being tropical insects and micro-organisms.",
            },
            {
              kind: 'numerical',
              id: '5bf3c4be-6807-4621-82b0-3235786f617f',
              source: 'ncert_exercise',
              source_label: 'NCERT 13.4',
              prompt: 'What is the significance of the slope of regression in a species – area relationship?',
              answer: 'The slope (Z) measures how fast species number rises with area — ~0.1–0.2 for small areas within a region, but a steep 0.6–1.2 across very large areas like whole continents.',
              solution:
                "Alexander von Humboldt noticed that within a region, species richness rises with the area explored — but only up to a limit. For many groups the relationship is a **rectangular hyperbola**:\n\n$ S = C\\,A^{Z} $\n\nwhere $ S $ is species richness, $ A $ is area, $ C $ is a constant (the y-intercept) and $ Z $ is the **slope of the regression line**, called the *Z value*.\n\nTaking the logarithm of both sides turns the curve into a **straight line**:\n\n$ \\log S = \\log C + Z\\,\\log A $\n\nSo on a log–log plot the data fall on a line whose slope is exactly $ Z $. That is what makes $ Z $ so useful — it tells you **how steeply species number climbs as area increases**.\n\n**Significance of the slope $ Z $:**\n- For smaller areas, and no matter which taxonomic group or region you pick, the slope is remarkably constant: $ Z $ lies between about **0.1 and 0.2**. A gentle slope — doubling the area adds only a modest number of new species.\n- But if you analyse the relationship across **very large areas** — say whole continents — the line becomes much steeper, with $ Z $ ranging from about **0.6 to 1.2**. For example, the slope for fruit-eating birds and mammals across tropical forests of different continents is around 1.15.\n\nSo the slope is a compact measure of the species–area relationship: a small $ Z $ means richness grows slowly with area; a large $ Z $ (across continents) means each extra unit of area brings a large jump in the number of species.",
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────────
        {
          id: 'ef9087b3-d19f-44ad-bb8b-9dc5317a02e6',
          title: 'Why diversity is spread so unevenly',
          blurb: 'The latitudinal gradient — why the tropics win — and why animals out-diversify plants.',
          items: [
            {
              kind: 'numerical',
              id: '38ac0f27-481d-4d10-9bed-397da6284145',
              source: 'ncert_exercise',
              source_label: 'NCERT 13.3',
              prompt: 'Give three hypotheses for explaining why tropics show greatest levels of species richness.',
              answer: 'Long undisturbed evolutionary time, a constant/less-seasonal environment favouring niche specialisation, and more available solar energy raising productivity.',
              solution:
                "Species richness is highest near the equator and falls as you move towards the poles — the **latitudinal gradient**. Tropical forests hold the greatest diversity. Ecologists offer three main hypotheses:\n\n1. **More evolutionary time.** Unlike the temperate regions, tropical latitudes have remained relatively **undisturbed for millions of years** — they escaped the repeated glaciations that wiped out temperate life. This long, uninterrupted stretch of time gave species a much longer period to diversify and specialise.\n\n2. **A constant, predictable environment.** Tropical environments are **less seasonal**, relatively more constant and predictable. Such stable conditions promote **niche specialisation** — species can settle into narrow, finely-tuned roles — which supports a greater number of coexisting species than a harsh, fluctuating temperate environment can.\n\n3. **More solar energy.** There is **more solar energy** available in the tropics. This raises the overall **productivity** of the ecosystem, and higher productivity is thought to allow greater diversity to build up.",
            },
            {
              kind: 'numerical',
              id: 'fd7c7cfe-b21f-498d-9dfd-394ed2430944',
              source: 'ncert_exercise',
              source_label: 'NCERT 13.9',
              prompt: 'The species diversity of plants (22 per cent) is much less than that of animals (72 per cent). What could be the explanations to how animals achieved greater diversification?',
              answer: 'Animals are mobile and have well-developed nervous and sensory systems, letting them specialise into far more narrow niches — so they split into many more species.',
              solution:
                "Of all the species on Earth, animals make up the large majority — insects alone account for a huge share — while plants are a much smaller slice. A few explanations for how animals reached this much greater diversification:\n\n- **Mobility.** Animals can move about — to find food, seek mates, escape enemies and colonise new habitats. This freedom lets populations spread, get isolated and split into many separate species.\n\n- **A nervous system and sense organs.** Animals have well-developed **nervous, sensory and neuro-motor systems**. They can sense and respond finely to their surroundings, which allows behavioural specialisation and a far wider range of ways of life.\n\n- **Narrow, specialised niches.** Because of the two abilities above, animals can carve the environment into many **narrow niches** — specialised feeding habits, prey, and behaviours. More niches means more coexisting species. Plants, being fixed and depending mainly on sunlight, water and minerals, have fewer distinct ways to specialise, so they diversified into fewer forms.\n\n(These are reasoned explanations consistent with the chapter — the exact figures simply reflect that animals, led by the insects, dominate the count of described species.)",
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────────
        {
          id: '1863327b-4273-420d-8432-a8392f27b383',
          title: 'Why biodiversity matters — and why it is being lost',
          blurb: 'The Evil Quartet, biodiversity and ecosystem stability, and the free services ecosystems provide.',
          items: [
            {
              kind: 'numerical',
              id: 'aff6e2de-6487-44db-99db-931daa34c16e',
              source: 'ncert_exercise',
              source_label: 'NCERT 13.5',
              prompt: 'What are the major causes of species losses in a geographical region?',
              answer: 'The Evil Quartet — habitat loss and fragmentation, over-exploitation, alien species invasions, and co-extinctions.',
              solution:
                "The major causes are grouped as **‘The Evil Quartet’** — the four biggest drivers of species loss:\n\n1. **Habitat loss and fragmentation.** The single most important cause. Clearing tropical rainforests, draining wetlands and degrading habitats destroys the homes of countless species. When a large habitat is broken into small fragments, animals that need large territories, and those that migrate, are badly hit — populations decline.\n\n2. **Over-exploitation.** When ‘need’ turns into ‘greed’. Over-harvesting has driven many species to extinction or near-extinction — the Steller's sea cow and the passenger pigeon were hunted out; many marine fish stocks are now over-exploited.\n\n3. **Alien species invasions.** When foreign species are introduced (deliberately or accidentally), some become invasive and cause the decline or extinction of native species. Examples: the Nile perch introduced into Lake Victoria wiped out over 200 native cichlid fish; invasive weeds like *Parthenium*, *Lantana* and water hyacinth (*Eichhornia*); the introduction of the African catfish *Clarias gariepinus* threatens native catfishes.\n\n4. **Co-extinctions.** When one species goes extinct, the plant and animal species associated with it in an obligatory way also become extinct. Example: a host fish going extinct takes its unique parasites with it; a plant and its obligate pollinator disappear together.",
            },
            {
              kind: 'numerical',
              id: 'aea2ab5a-43df-4045-a0db-a0cbdf25e2da',
              source: 'ncert_exercise',
              source_label: 'NCERT 13.6',
              prompt: 'How is biodiversity important for ecosystem functioning?',
              answer: 'More species make an ecosystem more productive, more stable year-to-year and more resistant to disturbance — as Tilman’s plots showed and Ehrlich’s rivet-popper hypothesis argues.',
              solution:
                "A community with **more species** tends to work better and hold together better. Two well-known ideas from the chapter show this:\n\n**David Tilman's field experiments (the plots).** Tilman ran long-term studies on **outdoor plots**. He found that:\n- plots with **more species** showed **less year-to-year variation** in total biomass — that is, higher diversity gives greater **stability**; and\n- **increased diversity also led to higher productivity**.\n\nSo a species-rich community is more productive and more stable. A stable community also does not show wild swings in population and is more **resistant** to disturbances and to invasions by alien species.\n\n**Paul Ehrlich's ‘rivet popper’ hypothesis.** Ehrlich used an aeroplane analogy. Picture an ecosystem as an aeroplane and each species as a **rivet** holding it together. A passenger (an economist) popping out a rivet to sell it seems harmless at first — the plane still flies. But if rivets keep being removed, the aircraft is dangerously weakened. And if the rivet popped happens to be on a **wing** (a key species, like a keystone species), the effect is far more serious than losing a few rivets on the seats. In the same way, losing species — especially important ones — steadily undermines how the whole ecosystem functions.\n\n**In short:** biodiversity gives an ecosystem its productivity, its stability, and its resistance to shocks and invasions.",
            },
            {
              kind: 'numerical',
              id: '6039a51e-f84f-4247-9e22-2baae5e2282c',
              source: 'ncert_exercise',
              source_label: 'NCERT 13.8',
              prompt: 'Among the ecosystem services are control of floods and soil erosion. How is this achieved by the biotic components of the ecosystem?',
              answer: 'Plant roots bind the soil against erosion, while the canopy, roots and leaf-litter slow rainfall, soak it up and let it percolate — reducing runoff and so preventing floods.',
              solution:
                "These are **ecosystem services** — free benefits a healthy natural ecosystem gives us. Both flood control and erosion control are done mainly by the **plants (the biotic component)** of the ecosystem, especially forests:\n\n**Controlling soil erosion.**\n- The **roots** of trees, shrubs and grasses grip and **bind the soil**, holding it in place so it is not washed or blown away.\n- The **canopy and the layer of leaf-litter** break the force of falling rain, so raindrops don't strike bare soil and dislodge it.\n\n**Controlling floods.**\n- The canopy, undergrowth and litter **slow down** the rainwater instead of letting it rush straight over the surface.\n- This lets water **soak into the ground and percolate** down, recharging the soil and groundwater rather than running off all at once.\n- By cutting **surface run-off** in this way, forests reduce the sudden surge of water into rivers that causes floods.\n\nSo where forests are cleared, both effects are lost together: soil erodes rapidly and rainwater runs straight off, making floods worse downstream.",
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────────
        {
          id: '101ef3c9-82f9-48cb-a577-e7279ecc333f',
          title: 'Protecting biodiversity (and one odd case)',
          blurb: 'Sacred groves as community conservation, and the rare situation where extinction is the goal.',
          items: [
            {
              kind: 'numerical',
              id: '04bbabc0-3c69-416b-b508-0139d9881792',
              source: 'ncert_exercise',
              source_label: 'NCERT 13.7',
              prompt: 'What are sacred groves? What is their role in conservation?',
              answer: 'Sacred groves are forest patches given total protection on religious/cultural grounds by tribal communities — untouched refuges where many rare and threatened species survive.',
              solution:
                "**What they are:** Sacred groves are **tracts of forest** that are set aside and given **total protection** by tribal and local communities on **religious and cultural grounds**. Every tree and all the wildlife within the grove are regarded as **sacred** and are left completely undisturbed — no cutting, no hunting.\n\n**Where they are found in India:** the **Khasi and Jaintia Hills** of Meghalaya, the **Aravalli Hills** of Rajasthan, the **Western Ghat** regions of Karnataka and Maharashtra, and the **Sarguja, Chanda and Bastar** areas of Madhya Pradesh.\n\n**Role in conservation:**\n- Because they are protected from human interference for generations, sacred groves act as **undisturbed refuges** for wildlife.\n- They are the **last refuge for a large number of rare, threatened and endemic species** of plants and animals — several species survive only in these groves.\n- The Meghalaya groves, for example, shelter many highly endangered plants. So this age-old community tradition is an effective, home-grown form of **in situ conservation**.",
            },
            {
              kind: 'numerical',
              id: 'bc33cf2d-5fd5-4226-b2d9-326150bd0486',
              source: 'ncert_exercise',
              source_label: 'NCERT 13.10',
              prompt: 'Can you think of a situation where we deliberately want to make a species extinct? How would you justify it?',
              answer: 'Yes — disease-causing organisms such as the smallpox virus; wiping them out to end human suffering and save lives is the justification, though it stays ethically debatable.',
              solution:
                "**Yes** — there are cases where deliberately wiping out a species is the goal. The clearest examples are **disease-causing organisms and dangerous pests**:\n\n- The **smallpox virus** (*Variola*) — humanity deliberately drove it to extinction in the wild through a worldwide vaccination campaign, and smallpox was declared eradicated in 1980. The polio virus and the guinea-worm parasite are targets of the same effort.\n- Serious pests and vectors — for instance the malaria-carrying mosquito, or crop pests that cause famine.\n\n**How to justify it:**\n- These species cause enormous **human suffering, disease and death**, or destroy the crops we depend on. Removing them saves millions of lives and prevents misery — the benefit to humanity is direct and huge.\n\n**The other side (why it stays debatable):**\n- On **ethical grounds**, every species is a product of millions of years of evolution and has a right to exist; deliberate extinction sits uneasily with the principle of conserving biodiversity.\n- Even a harmful species may have some hidden ecological role, and removing it can have knock-on effects. So the justification rests on the human benefit clearly and overwhelmingly outweighing these concerns.",
            },
          ],
        },
      ],
    },
  ],
};
