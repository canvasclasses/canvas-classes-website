'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-mechanism-of-evolution',
  title: 'The Mechanism of Evolution — Variation, Selection & Drift',
  subtitle: "Where the raw material of evolution comes from, how nature sorts it three different ways, and how plain chance can steer a small population all by itself.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['mechanism-of-evolution', 'natural-selection', 'genetic-drift', 'evolution'],
  glossary: [
    { term: 'variation', definition: 'The differences in characteristics among members of a population. It arises from mutation and from recombination during gametogenesis, and is the raw material evolution works on.' },
    { term: 'natural selection', definition: 'The process in which heritable variations that enable better survival let those individuals reproduce and leave more progeny, so the population\'s characteristics change over generations.' },
    { term: 'stabilising selection', definition: 'Selection in which more individuals acquire the mean character value; the two extremes are removed and the population stays centred on its average.' },
    { term: 'directional selection', definition: 'Selection in which more individuals acquire a value other than the mean character value, so the whole distribution shifts towards one extreme.' },
    { term: 'disruptive selection', definition: 'Selection in which more individuals acquire the peripheral character values at both ends of the distribution curve, splitting the population away from the mean.' },
    { term: 'genetic drift', definition: 'A change in allele frequency in a population that happens purely by chance rather than by selection.' },
    { term: 'founder effect', definition: 'When a drifted small population has allele frequencies so different that it becomes a separate species; the original drifted individuals are the founders and the outcome is the founder effect.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A wide dusk landscape of a single grassland where a herd of animals shows a natural spread of body sizes, from very small to very large, grazing under a fading sky',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk grassland at golden hour fading into deep blue. Across the plain grazes one herd of the same kind of hoofed animal, but drawn so the eye reads a natural spread of body sizes — a few very small individuals on the left, most of them medium-sized and clustered in the centre, and a few unusually large ones on the right — quietly suggesting variation within one population without any chart or label. Soft mist near the ground, a single warm horizon glow tying the panorama together. Painterly, atmospheric illustration style, dark overall background (#0a0a0a base tones), no text, no labels, no diagram elements, no graphs.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Colony of Bacteria Can Evolve Before Lunch',
      markdown: "Grow a colony of bacteria on a dish, then change the food in the medium. Only the part of the population that can already cope with the new conditions survives and multiplies — and within **days** it has outgrown the rest and looks like a new form. The same change in a fish or a fowl would take **millions of years**, because their life spans run into years, not hours. Evolution isn't waiting for something new to be invented each time. The variation is already sitting there in the population — nature just has to pick.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Every population already carries **variation** — no two individuals are exactly alike, even when they look the same on the surface. That variation is the raw material of evolution, and it comes from two sources NCERT names again and again: **mutation** (random, directionless changes that can appear suddenly) and **recombination during gametogenesis** (the reshuffling of genes when gametes form). Gene flow and genetic drift can add to it too.\n\nNotice the order of events. **Variation comes first, then selection.** Mutations are random and directionless; Darwinian variations are small and directional. Nature does not create the useful trait on demand — it works on whatever spread of variation already exists in the population. That is the whole logic of the mechanism: build up variation, then sort it.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Selection Sorts the Variation — Three Ways',
      objective: "By the end of this you can look at a shifted bell curve and name which of the three types of selection produced it.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Once variation exists, **natural selection** does the sorting. NCERT defines it plainly: heritable variations that enable **better survival** let those individuals reproduce and leave a **greater number of progeny**, so the characteristics of the population change over generations. Fitness is simply the end result of the ability to adapt and get selected by nature — and it must be **inherited**, because only heritable traits can be passed on.\n\nThe key insight for NEET is that selection can act on a trait's distribution curve in **three different ways** (Figure 6.8). Picture the trait — say body size — plotted as a bell curve, with the average in the middle and the extremes at either end. Selection can favour the middle, one end, or both ends. Explore each below.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Three bell-curve diagrams showing natural selection acting on a trait distribution — stabilising favouring the mean, directional favouring one extreme, and disruptive favouring both extremes',
      caption: '📸 Tap each curve to see how that type of selection reshapes the population (Figure 6.8)',
      hotspots: [
        { id: uuid(), x: 0.17, y: 0.45, label: '(a) Stabilising selection', icon: 'circle',
          detail: 'The **mean** is favoured. More individuals acquire the **mean (average) character value**, while both extremes are removed. The curve grows taller and narrower and stays centred — the population does not change its average, it just gets more uniform around it.' },
        { id: uuid(), x: 0.50, y: 0.45, label: '(b) Directional selection', icon: 'circle',
          detail: 'One **extreme** is favoured. More individuals acquire a **value other than the mean** character value, so the whole curve **shifts towards one end**. The population moves in a single direction, away from its old average.' },
        { id: uuid(), x: 0.83, y: 0.45, label: '(c) Disruptive selection', icon: 'circle',
          detail: 'Both **extremes** are favoured. More individuals acquire the **peripheral character values at both ends** of the distribution curve. The single peak splits into two, thinning out the middle — this is the one type that can produce two groups from one.' },
      ],
      generation_prompt: "Scientific textbook illustration of natural selection acting on a trait distribution, matching NCERT Figure 6.8. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Three separate bell-curve panels arranged left to right, each with clean white axes and thin white outlines. Panel (a) Stabilising: an original wide bell curve shown faint, with a taller, narrower curve centred on the same mean drawn in soft blue, arrows from both sides pointing inward toward the centre. Panel (b) Directional: a bell curve with the whole shape shifted toward the right extreme in soft blue, a single arrow pointing right, the original centre marked faint. Panel (c) Disruptive: a bell curve splitting into two separate peaks at the left and right extremes in soft blue, the middle pushed down, two arrows pointing outward to both ends. No baked-in text labels beyond simple axis lines, evenly spaced panels. No photorealism, no cartoon, no mascots, standard biology textbook illustration conventions.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 6,
      title: 'Stabilising vs Directional vs Disruptive Selection',
      columns: [
        { heading: 'Stabilising', points: [
          'Favours the **mean** character value',
          'More individuals acquire the **average** trait',
          'Both extremes are removed',
          'Curve stays centred — taller and narrower',
          'Population becomes more **uniform**, mean unchanged',
        ] },
        { heading: 'Directional', points: [
          'Favours **one extreme**',
          'More individuals acquire a value **other than the mean**',
          'Whole curve **shifts** toward that one end',
          'Population moves in a single direction',
          'The old average is left behind',
        ] },
        { heading: 'Disruptive', points: [
          'Favours **both extremes**',
          'More individuals acquire **peripheral values at both ends**',
          'The middle (mean) is thinned out',
          'One peak **splits into two**',
          'Can push a population toward two groups',
        ] },
      ],
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'When Chance Does the Steering — Genetic Drift',
      objective: "By the end of this you can explain how a small population can change without any selection at all, and what the founder effect is.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Selection is not the only thing that changes allele frequencies. NCERT lists **five factors** that disturb the Hardy-Weinberg equilibrium: **gene migration (gene flow), genetic drift, mutation, genetic recombination, and natural selection**.\n\n**Genetic drift** is the odd one out because it has nothing to do with fitness. When a section of a population migrates and gene frequencies change, that is gene flow (repeated migration). But **if the same kind of change in allele frequency happens purely by chance, it is called genetic drift.** Drift matters most in **small populations**, where a lucky or unlucky accident can swing the allele frequencies dramatically — no trait is being 'selected', chance alone does the steering.\n\nSometimes the change in a small drifted sample is **so different** from the original population that the drifted group becomes a **different species**. When that happens, the original drifted individuals are called the **founders**, and the whole outcome is the **founder effect**. So drift is the chance mechanism; the founder effect is the extreme result of drift when a small founding group ends up genetically distinct enough to be its own species.\n\nPut it all together and the mechanism is complete: variation from mutation, recombination, gene flow or drift changes gene and allele frequencies; natural selection, coupled to reproductive success, then makes the population look different over generations. That reshuffling and sorting is what carries us into the Hardy-Weinberg principle next, where these same allele frequencies are pinned down with a simple equation.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "In a population of moths, the tree bark they rest on slowly darkens with soot over many generations. Over time the whole distribution of moth colour shifts from mostly pale toward mostly dark — the pale average is left behind. Which type of natural selection is this?",
      options: [
        "Stabilising selection, because more moths end up at the average colour",
        "Directional selection, because the whole curve shifts toward one extreme (dark) and away from the mean",
        "Disruptive selection, because both the palest and darkest moths are favoured",
        "Genetic drift, because the colour change happened purely by chance",
      ],
      reveal: "The whole distribution moves in one direction, toward the dark extreme, leaving the old pale mean behind — that is exactly directional selection, where more individuals acquire a value other than the mean. Stabilising is the tempting trap because dark eventually becomes the new common colour, but stabilising keeps the population centred on its *original* mean and removes the extremes; here the mean itself has moved, which is the signature of directional change. Disruptive would keep both extremes, not just one, and this is driven by the darkened bark favouring a trait, not by chance, so it is selection, not drift.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'Lock These Definitions Word-for-Word',
      markdown: "- **Variation arises from** mutation and recombination during gametogenesis (and gene flow / drift). **Variation first, then selection.**\n- **Stabilising** → more individuals acquire the **mean** character value.\n- **Directional** → more individuals acquire a value **other than the mean** (curve shifts one way).\n- **Disruptive** → more individuals acquire **peripheral values at both ends**.\n- **Genetic drift** → change in allele frequency **by chance**, strongest in **small populations**.\n- **Founder effect** → a drifted population becomes so different it is a new species; the original drifted members are the **founders**.\n- The **five factors** disturbing Hardy-Weinberg equilibrium: gene flow, genetic drift, mutation, recombination, natural selection.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The three selection curves are lifted straight from Figure 6.8.** NEET shows a bell curve and asks you to name the type. Anchor it: *mean = stabilising, one extreme = directional, both extremes = disruptive.* The classic trap is confusing stabilising (stays centred) with directional (shifts off-centre) — check whether the **mean has moved**.\n\n**Drift vs selection:** if the change is described as happening 'by chance' or in a 'small population', it's **genetic drift**, not selection. Selection always involves fitness and better survival.\n\n**Founder effect** is drift's extreme case — the drifted group becomes a new species.\n\n**Classic NEET question:** \"Operation of natural selection in which more individuals acquire peripheral character values at both ends of the distribution curve is ______.\" → **disruptive selection.**",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'In natural selection, where does the variation that selection acts upon originally come from?',
          options: [
            'It is created on demand by the environment when it is needed',
            'It arises from mutation and from recombination during gametogenesis',
            'It is produced only by natural selection itself',
            'It appears only through the use and disuse of organs',
          ],
          correct_index: 1,
          explanation: "NCERT states variation arises from mutation and from recombination during gametogenesis (with gene flow and drift adding more). The 'created on demand' option is the core misconception the chapter warns against — variation exists first, then selection sorts it; the environment does not manufacture the useful trait. Use and disuse is Lamarck's rejected idea, and selection sorts variation rather than producing it.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'A trait distribution is acted on so that more individuals end up with the mean character value while both extremes are removed. Which type of selection is this?',
          options: ['Directional selection', 'Disruptive selection', 'Stabilising selection', 'Genetic drift'],
          correct_index: 2,
          explanation: "Favouring the mean and removing both extremes is stabilising selection. Directional is the tempting wrong answer, but directional shifts the whole curve toward one extreme so the mean moves — here the mean is exactly what is kept. Disruptive favours both extremes instead of the mean, and drift is a chance change unrelated to which value is favoured.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'A change in allele frequency happens purely by chance, and it has the strongest effect in a small population. What is this called?',
          options: [
            'Directional selection',
            'Genetic drift',
            'Stabilising selection',
            'Gene flow through repeated migration',
          ],
          correct_index: 1,
          explanation: "A chance change in allele frequency is genetic drift, and it is most pronounced in small populations. Gene flow is the tempting distractor, but gene flow is change caused by migration between populations, not by chance; the two are listed as separate factors. Stabilising and directional selection both involve fitness and survival, whereas drift involves no selection at all.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'A small group drifts away from its original population and its allele frequencies become so different that it turns into a separate species. What is this outcome named?',
          options: [
            'Disruptive selection',
            'Stabilising selection',
            'The founder effect',
            'Gene migration',
          ],
          correct_index: 2,
          explanation: "When a drifted small population becomes so genetically different that it is a new species, the original drifted members are the founders and the result is the founder effect. Disruptive selection can split a population but works through fitness on both extremes, not by chance drift in a small group. Stabilising selection keeps a population centred, and gene migration is ongoing movement between populations rather than the isolation of a distinct founding group.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
