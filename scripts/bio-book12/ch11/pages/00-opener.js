'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-11-overview',
  title: 'Organisms and Populations',
  subtitle: "Biology gets split into botany, zoology, molecular, classical — and then ecology walks in and ties the whole thing back together. This chapter starts that thread, at the level where nature actually keeps its accounts: the population.",
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['organisms-and-populations', 'ecology'],
  glossary: [
    { term: 'ecology', definition: 'The study of the interactions among organisms, and between an organism and its physical (abiotic) environment. It is basically concerned with four levels of biological organisation — organisms, populations, communities and biomes.' },
    { term: 'population', definition: 'A group of individuals of the same species living in a well defined geographical area, sharing or competing for similar resources and potentially interbreeding. Groups formed even by asexual reproduction are also treated as populations for ecological studies.' },
    { term: 'community', definition: 'Animals, plants and microbes living together and interacting in various ways in a habitat. No species lives in isolation, so even a minimal community carries many interactive linkages.' },
    { term: 'biosphere', definition: 'The largest of the organised wholes — all of life on earth together with its physical surroundings, above population, community and ecosystem.' },
  ],
  blocks: [
    {
      id: uuid(),
      type: 'image',
      order: 0,
      src: '',
      alt: 'A wide dawn wetland where a flock of cormorants rests on the water, a forest tract rises behind it and a garden edge sits in the foreground, all under one continuous sky',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). One continuous early-morning Indian landscape read left to right with no hard borders: on the left a still wetland at first light with a loose flock of dark cormorants resting on the water and a few lotus plants at the near edge; in the centre the wetland giving way to open grassland; on the right a dense teak forest tract fading into soft mist, with a single small bird perched on a low branch in the foreground catching the first warm light. A single soft dawn glow ties water, grass and forest together as one connected living whole, as if the same quiet rules run through all of it. Painterly atmospheric illustration, naturalistic, deep dark tones throughout (#0a0a0a base), muted earthy palette. No people, no text, no labels, no diagram elements, no arrows.",
    },
    {
      id: uuid(),
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'Two questions about one bulbul',
      markdown: "Early morning, a bulbul is singing in the garden. You can ask two completely different questions about that one bird.\n\n**‘How does the bird sing?’** — the answer is the voice box and the vibrating bone inside it. That is a *how-type* question: it asks for the **mechanism**.\n\n**‘Why does the bird sing?’** — the answer may be that it needs to communicate with its mate during the breeding season. That is a *why-type* question: it asks for the **significance**.\n\nBoth are good biology. Once you notice the difference, nature starts handing you questions non-stop — why are night-blooming flowers generally white? How does the bee know which flower has nectar? Why does cactus have so many thorns? How does the chick recognise her own mother? Ecology is where the why-type questions finally get real answers.",
    },
    {
      id: uuid(),
      type: 'text',
      order: 2,
      markdown: "Open any biology syllabus and it arrives already chopped up — botany, zoology and microbiology on one side; classical and modern (which is a polite way of saying molecular) on the other. Diversity is not just a property of living organisms; it is a property of biology textbooks too.\n\nLuckily there are a few threads that weave those separate areas into one unifying principle, and **ecology** is one of them. It gives you a holistic view of the subject. The essence of biological understanding is this: an organism stays an individual, and yet it interacts with other organisms and with its physical habitat as a group — and the group behaves like an **organised whole**. A population. A community. An ecosystem. Even the whole **biosphere**. Ecology is what explains all of that.\n\nYou already know the definition from earlier classes: ecology studies the interactions among organisms, and between an organism and its physical (**abiotic**) environment.",
    },
    {
      id: uuid(),
      type: 'text',
      order: 3,
      markdown: "Our living world is fascinatingly diverse and amazingly complex, so we handle that complexity the way biologists always have — by picking a **level of biological organisation** and asking our questions there. The ladder runs: **macromolecules → cells → tissues → organs → individual organisms → populations → communities → ecosystems → biomes**.\n\nThe level you pick decides what you are even allowed to measure. An individual has births and deaths; a **population** has *birth rates* and *death rates*. An individual is male or female; a population has a *sex ratio*. Step up a rung and new properties appear that simply do not exist a rung below — that is the whole reason population ecology is its own subject, and it is the idea this chapter is built on.\n\nOf the ladder, ecology is basically concerned with four levels — **organisms, populations, communities and biomes**. In this chapter we explore ecology at the **population** level.",
    },
    {
      id: uuid(),
      type: 'text',
      order: 4,
      markdown: "The chapter moves through populations in four steps, in this order:\n\n- **11.1.1 Population Attributes** — what a group has that a single organism cannot: birth rate and death rate per capita, **sex ratio**, **age pyramids** that tell you whether a population is growing, stable or declining, and **population density (N)** — which is not always a head count. Sometimes per cent cover or biomass says more (200 carrot grass plants versus one huge banyan), and sometimes you estimate indirectly, the way a tiger census reads pug marks and fecal pellets.\n- **11.1.2 Population Growth** — density is never static. It is pushed up by **natality** and **immigration**, pulled down by **mortality** and **emigration**, giving Nt+1 = Nt + [(B + I) – (D + E)] — and from there, the **J-shaped** exponential curve and the more realistic **logistic** curve with its carrying capacity.\n- **11.1.3 Life History Variation** — populations evolve to maximise reproductive fitness (**Darwinian fitness**). Pacific salmon and bamboo breed once in a lifetime; most birds and mammals breed many times. Oysters make a huge number of tiny offspring; birds and mammals make a few large ones. Which strategy wins depends on the habitat.\n- **11.1.4 Population Interactions** — no habitat on earth holds just one species; the idea is not even conceivable. Even a plant that makes its own food needs soil microbes to return inorganic nutrients, and an animal agent for pollination. So populations of different species interact, and each interaction is beneficial (+), detrimental (–) or neutral (0) to each partner.\n\nStart with what a population *is* and what you can measure about it — that is the next page.",
    },
    {
      id: uuid(),
      type: 'callout',
      order: 5,
      variant: 'remember',
      title: 'What this chapter covers',
      markdown: "Fix the running order now — Class 12 is the most heavily examined half of NEET biology, and ecology questions are lifted almost verbatim from these lines:\n\n1. **Population Attributes** — birth/death rates, sex ratio, age pyramids, population density (N)\n2. **Population Growth** — natality, mortality, immigration, emigration; exponential (J-shaped) and logistic growth\n3. **Life History Variation** — breed-once versus breed-many, many-small versus few-large offspring, Darwinian fitness\n4. **Population Interactions** — the +, – and 0 outcomes between two species\n\nTwo definitions NEET keeps coming back to: **ecology** is the study of interactions among organisms and between an organism and its physical (abiotic) environment; and ecology is concerned with **four levels** — organisms, populations, communities and biomes. Do not swap that four-level list for the longer macromolecules-to-biomes ladder — they are different lines in NCERT and the exam knows it.",
    },
  ],
};
