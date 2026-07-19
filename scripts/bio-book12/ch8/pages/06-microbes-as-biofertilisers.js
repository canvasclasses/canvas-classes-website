'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'microbes-as-biofertilisers',
  title: 'Feeding the Soil — Microbes as Biofertilisers',
  subtitle: 'How living bacteria, fungi and blue-green algae quietly refill a field with nitrogen and phosphorus — the natural replacement for chemical fertilisers.',
  page_number: 6,
  page_type: 'lesson',
  tags: ['biofertilisers', 'nitrogen-fixation', 'mycorrhiza', 'cyanobacteria', 'microbes-in-human-welfare'],
  glossary: [
    { term: 'biofertiliser', definition: 'A living organism — bacterium, fungus or cyanobacterium — that enriches the nutrient quality of the soil, used in place of chemical fertilisers.' },
    { term: 'Rhizobium', definition: 'A bacterium that lives in a symbiotic association inside the root nodules of leguminous plants and fixes atmospheric nitrogen into forms the plant can use.' },
    { term: 'Azotobacter', definition: 'A free-living soil bacterium (along with Azospirillum) that fixes atmospheric nitrogen on its own, without living inside a plant, and so enriches the soil with nitrogen.' },
    { term: 'mycorrhiza', definition: 'A symbiotic association between a fungus and the roots of a plant; the fungus absorbs phosphorus from the soil and passes it to the plant. Many members of the genus Glomus form mycorrhiza.' },
    { term: 'cyanobacteria', definition: 'Autotrophic microbes (blue-green algae) such as Anabaena, Nostoc and Oscillatoria; many fix atmospheric nitrogen and act as an important biofertiliser in paddy fields.' },
    { term: 'nitrogen fixation', definition: 'The conversion of atmospheric nitrogen gas into organic forms that plants can absorb and use as a nutrient.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A flooded green paddy field at dusk, water surface faintly alive with blue-green algae, with a leguminous crop on the raised bund beside it',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A calm flooded rice paddy field at dusk stretching across the frame, the still water surface catching a warm fading horizon glow and faintly tinged blue-green in patches where algae float. Rows of young green rice shoots rise out of the water. Along the raised earthen bund in the near foreground grows a leafy leguminous crop, its roots hidden in dark soil. The whole scene feels quiet, fertile and natural — soil and water teeming with unseen life. Painterly atmospheric illustration style, deep dusk lighting, dark overall background tones (#0a0a0a base), no text, no labels, no diagram elements, no people.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Farm Hidden Inside a Root',
      markdown: "Pull up a bean or pea plant gently and look at its roots. You'll see tiny swollen bumps clinging to them — **root nodules**. Each nodule is a little chemical factory the plant built on purpose, and living inside it is a bacterium called **Rhizobium**. The plant gives the bacteria shelter and food; in return the bacteria pull **nitrogen straight out of the air** and hand it over as plant food. No factory, no chemical bag, no cost — just two living things helping each other. That partnership is the whole idea behind a biofertiliser.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Growing more and more food has pushed farmers to pour on **chemical fertilisers**, and overusing them has become a major cause of pollution. So there is a big push to switch to **organic farming** — and the key tool there is the **biofertiliser**.\n\nA **biofertiliser is an organism that enriches the nutrient quality of the soil**. Notice the word *organism* — a biofertiliser is alive, not a chemical. The **main sources are bacteria, fungi and cyanobacteria**. Each one refills the soil with a nutrient the plant needs, and it keeps doing it on its own, season after season.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Bacteria That Fix Nitrogen',
      objective: "By the end of this you can split the nitrogen-fixing bacteria into the symbiotic one and the free-living ones — and name each.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Plants can't use the nitrogen in the air directly. It has to be **fixed** — converted into organic forms the plant can absorb. Bacteria do this in two different lifestyles:\n\n- **Symbiotic — Rhizobium.** This is the nodule bacterium from the fun fact. It lives *inside* the root nodules of **leguminous plants** in a **symbiotic association**, fixing atmospheric nitrogen into organic forms that the plant uses as a nutrient. It cannot be separated from its plant partner — the partnership is the point.\n- **Free-living — Azospirillum and Azotobacter.** These bacteria fix atmospheric nitrogen too, but they do it **while free-living in the soil**, not inside any plant. On their own they enrich the nitrogen content of the soil.\n\nSo the split to hold in your head is simple: **Rhizobium works with a partner (symbiotic); Azospirillum and Azotobacter work alone (free-living).** All three deliver the same nutrient — **nitrogen**.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 5, reasoning_type: 'logical',
      prompt: "A farmer isolates a nitrogen-fixing bacterium from plain, open soil that has no legume crop anywhere near it, and the bacterium keeps fixing nitrogen happily in a dish by itself. Which organism is it most likely to be?",
      options: [
        "Rhizobium, because it is the main nitrogen-fixing bacterium",
        "Azotobacter, because it fixes atmospheric nitrogen while free-living in the soil",
        "Glomus, because it enriches soil with nitrogen from inside root nodules",
        "Anabaena, because only cyanobacteria can fix nitrogen without a host",
      ],
      reveal: "The clue is that the bacterium fixes nitrogen alone, away from any plant — that is the definition of a free-living fixer, and NCERT names Azospirillum and Azotobacter for exactly this. Rhizobium is the tempting trap: it is a famous nitrogen fixer, but it only works symbiotically *inside* legume root nodules, so it wouldn't be thriving alone in legume-free soil. Glomus is a fungus that supplies phosphorus, not a nitrogen-fixing nodule bacterium, and Anabaena is a cyanobacterium, not the answer here.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Fungi and Blue-Green Algae Join In',
      objective: "By the end of this you can say what mycorrhiza supplies and what cyanobacteria do — and where each matters most.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Bacteria aren't the only helpers. **Fungi form symbiotic associations with plant roots called mycorrhiza**, and many members of the genus **Glomus** form them. Here the job is different: the **fungal symbiont absorbs phosphorus from the soil and passes it to the plant**. So the one word to tie to mycorrhiza is **phosphorus** — not nitrogen. Plants with mycorrhiza get bonus benefits too: **resistance to root-borne pathogens, tolerance to salinity and drought, and an overall increase in growth**.\n\n**Cyanobacteria** — the blue-green algae — are **autotrophic microbes** found widely in water and on land, and **many can fix atmospheric nitrogen**. NCERT names **Anabaena, Nostoc and Oscillatoria**. In **paddy (rice) fields** cyanobacteria serve as an **important biofertiliser**, and blue-green algae also add organic matter to the soil to increase its fertility. This is why they matter so much in flooded rice cultivation.\n\nAll of these are sold commercially now, and farmers use them regularly to replenish soil nutrients and cut their dependence on chemical fertilisers.",
    },
    {
      id: uuid(), type: 'table', order: 8,
      caption: '📸 The four biofertilisers NCERT names — sorted by lifestyle and by the nutrient they supply',
      headers: ['Biofertiliser', 'Type', 'Nutrient / benefit supplied'],
      rows: [
        ['Rhizobium', 'Symbiotic (in legume root nodules)', 'Fixes atmospheric nitrogen → nitrogen'],
        ['Azospirillum & Azotobacter', 'Free-living soil bacteria', 'Fix atmospheric nitrogen → nitrogen'],
        ['Mycorrhiza (fungus, e.g. Glomus)', 'Symbiotic (with plant roots)', 'Absorbs phosphorus → phosphorus (also drought/pathogen tolerance)'],
        ['Cyanobacteria (Anabaena, Nostoc, Oscillatoria)', 'Free-living / autotrophic (esp. paddy fields)', 'Fix atmospheric nitrogen → nitrogen + organic matter'],
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A crop looks healthy and green but is clearly short of phosphorus. Which biofertiliser directly addresses that shortage?",
      options: [
        "Rhizobium, because it lives symbiotically in root nodules",
        "Azotobacter, because free-living bacteria enrich the soil",
        "Mycorrhiza (Glomus), because the fungal symbiont absorbs phosphorus and passes it to the plant",
        "Anabaena, because cyanobacteria are the richest source of every nutrient",
      ],
      reveal: "Mycorrhiza is the phosphorus supplier — the fungal partner (often Glomus) absorbs phosphorus from the soil and hands it to the plant, so it is the direct fix for a phosphorus shortage. The Rhizobium and Azotobacter options are traps built on lifestyle words (symbiotic, free-living) that are true statements but irrelevant here, because both supply nitrogen, not phosphorus. Anabaena fixes nitrogen and adds organic matter; NCERT never calls it a phosphorus source.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'Lock These Pairings',
      markdown: "- **Rhizobium → symbiotic → NITROGEN** (lives inside legume root nodules).\n- **Azospirillum & Azotobacter → free-living → NITROGEN** (fix nitrogen alone in the soil).\n- **Mycorrhiza (Glomus, a fungus) → symbiotic → PHOSPHORUS** (plus drought & pathogen tolerance).\n- **Cyanobacteria (Anabaena, Nostoc, Oscillatoria) → NITROGEN** — the key biofertiliser in **paddy fields**.\n- One-line memory hook: **Rhizobium = symbiotic Nitrogen; Mycorrhiza = Phosphorus.**",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The symbiotic-vs-free-living split:** NEET loves to relabel it. Rhizobium is **symbiotic** (needs the legume nodule); Azospirillum and Azotobacter are **free-living**. A wrong option calling Rhizobium free-living, or Azotobacter symbiotic, is the classic trap.\n\n**The nitrogen-vs-phosphorus swap:** every bacterium and cyanobacterium here supplies **nitrogen**; only **mycorrhiza supplies phosphorus**. Any option pairing mycorrhiza with nitrogen — or Rhizobium with phosphorus — is wrong.\n\n**Paddy field cue:** if the question says rice/paddy field, the answer is **cyanobacteria** (Anabaena, Nostoc, Oscillatoria).\n\n**Classic NEET question:** \"Which of the following is a symbiotic nitrogen-fixing biofertiliser?\" → **Rhizobium** (not Azotobacter — that one is free-living; not Glomus — that one supplies phosphorus).",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "And that closes the story of microbes in human welfare. From curd and bread, to antibiotics and fermented drinks, to sewage treatment, biogas and biocontrol, and finally to biofertilisers refilling the soil — the same tiny organisms most people fear as germs are quietly doing some of the most useful work on the planet. Not all microbes are pathogens; a great many are our partners. That is the whole chapter in one line.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which biofertiliser fixes atmospheric nitrogen while living symbiotically inside the root nodules of leguminous plants?',
          options: ['Azotobacter', 'Glomus', 'Oscillatoria', 'Rhizobium'],
          correct_index: 3,
          explanation: "Rhizobium lives in a symbiotic association inside legume root nodules and fixes atmospheric nitrogen for the plant. Azotobacter also fixes nitrogen but is free-living in the soil, not symbiotic; Glomus is a fungus that supplies phosphorus through mycorrhiza; and Oscillatoria is a nitrogen-fixing cyanobacterium, not a nodule bacterium.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'A fungus forms a symbiotic association with plant roots and passes a nutrient to the plant. Which nutrient, and what is the association called?',
          options: [
            'Nitrogen, through a nodule',
            'Phosphorus, through mycorrhiza',
            'Nitrogen, through mycorrhiza',
            'Phosphorus, through a root nodule',
          ],
          correct_index: 1,
          explanation: "A fungus (such as Glomus) partnering with plant roots forms a mycorrhiza, and the fungal symbiont absorbs phosphorus from the soil and passes it to the plant. The nitrogen options are the trap — every bacterial and cyanobacterial biofertiliser supplies nitrogen, but the fungal mycorrhiza is the one that supplies phosphorus. Root nodules are made by Rhizobium, not by fungi.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which of the following is a pair of FREE-LIVING nitrogen-fixing soil bacteria?',
          options: [
            'Rhizobium and Glomus',
            'Anabaena and Nostoc',
            'Azospirillum and Azotobacter',
            'Rhizobium and Azotobacter',
          ],
          correct_index: 2,
          explanation: "Azospirillum and Azotobacter both fix atmospheric nitrogen while free-living in the soil, without a plant host. Rhizobium is symbiotic, not free-living, so any pair containing it is wrong; Glomus is a phosphorus-supplying fungus; and Anabaena and Nostoc are cyanobacteria (blue-green algae), not the free-living bacteria NCERT names here.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'In paddy (rice) fields, which group of microbes serves as an important biofertiliser by fixing atmospheric nitrogen and adding organic matter to the soil?',
          options: [
            'Cyanobacteria such as Anabaena, Nostoc and Oscillatoria',
            'Mycorrhizal fungi such as Glomus',
            'Rhizobium in legume nodules',
            'Azotobacter isolated from dry soil',
          ],
          correct_index: 0,
          explanation: "In paddy fields the important biofertilisers are the cyanobacteria (blue-green algae) — Anabaena, Nostoc and Oscillatoria — which fix atmospheric nitrogen and add organic matter to the flooded soil. Glomus supplies phosphorus, not the paddy-field role; Rhizobium needs legume roots, which rice does not form; and while Azotobacter fixes nitrogen, NCERT specifically ties the paddy-field biofertiliser to cyanobacteria.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
