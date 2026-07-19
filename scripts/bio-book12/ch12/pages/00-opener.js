'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-12-overview',
  title: 'Ecosystem',
  subtitle: 'A pond, a forest, a sea — and even a crop field — all run on the same four jobs. This chapter is how nature earns its energy, spends it, loses it, and gets its nutrients back.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['ecosystem', 'ecology'],
  glossary: [
    { term: 'ecosystem', definition: 'A functional unit of nature where living organisms interact among themselves and also with the surrounding physical environment. It varies greatly in size — from a small pond to a large forest or a sea.' },
    { term: 'stratification', definition: 'The vertical distribution of different species occupying different levels of an ecosystem. In a forest, trees occupy the top vertical strata, shrubs the second, and herbs and grasses the bottom layers.' },
    { term: 'productivity', definition: 'The rate of biomass production, expressed as g m⁻² yr⁻¹ or (kcal m⁻²) yr⁻¹ so that different ecosystems can be compared. Primary production itself is the amount of biomass or organic matter produced per unit area over a time period by plants during photosynthesis.' },
    { term: 'trophic level', definition: 'The specific place an organism occupies in a food chain, based on the source of its nutrition or food. Producers belong to the first trophic level, herbivores (primary consumers) to the second, and carnivores (secondary consumers) to the third.' },
  ],
  blocks: [
    {
      id: uuid(),
      type: 'image',
      order: 0,
      src: '',
      alt: 'A wide dawn view of a still village pond in the foreground opening out into grassland and a dense forest tract behind it, all under one continuous sky',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). One continuous early-morning Indian landscape read left to right with no hard borders: on the left a small, still village pond at first light, its surface faintly green with floating plants and a few marginal reeds at the near edge, dark rich silt visible in the shallows; in the centre the pond bank giving way to open grassland with a few grazing deer silhouettes at a distance; on the right a dense teak forest tract rising in clear vertical layers — tall trees above, a shrub layer beneath, low grasses at the floor — fading into soft mist. A single soft warm dawn glow sits low on the horizon and falls across water, grass and forest alike, tying the small pond and the large forest together as if the same quiet accounting runs through both. Painterly atmospheric illustration, naturalistic, deep dark tones throughout (#0a0a0a base), muted earthy palette. No people, no text, no labels, no diagram elements, no arrows.",
    },
    {
      id: uuid(),
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'A pond runs the whole biosphere in miniature',
      markdown: "Walk up to a shallow pond in your village or town. Nothing much seems to be happening. But that pond is doing, on a small scale, every single thing the entire biosphere does.\n\nThe **water** — with its dissolved inorganic and organic substances — and the **rich soil deposit at the bottom** are its abiotic component. Sunlight, the cycle of temperature, day-length and the other climatic conditions set the pace at which the whole pond works. The **autotrophs** are the phytoplankton, some algae, and the floating, submerged and marginal plants at the edges. The **consumers** are the zooplankton, the free-swimming forms and the bottom-dwelling forms. The **decomposers** — fungi, bacteria and flagellates — are especially abundant at the bottom.\n\nInorganic turned into organic by autotrophs using the sun's radiant energy; autotrophs eaten by heterotrophs; dead matter decomposed and mineralised so the autotrophs can use it again — over and over. That is a self-sustaining unit. That is an ecosystem.",
    },
    {
      id: uuid(),
      type: 'text',
      order: 2,
      markdown: "An **ecosystem** is a **functional unit of nature**, where living organisms interact among themselves and also with the surrounding physical environment. Hold on to the word *functional* — that is the whole point of this chapter. You are not being asked to list what lives in a forest. You are being asked how the forest *works*.\n\nEcosystems vary greatly in size — from a small pond to a large forest or a sea. Many ecologists regard the **entire biosphere as a global ecosystem**, a composite of all the local ecosystems on Earth. But that system is far too big and complex to study at one time, so it is convenient to divide it into two basic categories: **terrestrial** and **aquatic**. Forest, grassland and desert are terrestrial. Pond, lake, wetland, river and estuary are aquatic. And a crop field or an aquarium counts too — those are **man-made ecosystems**.",
    },
    {
      id: uuid(),
      type: 'text',
      order: 3,
      markdown: "The interaction of biotic and abiotic components produces a **physical structure** that is characteristic for each type of ecosystem. Two things describe that structure. Identifying and enumerating the plant and animal species of an ecosystem gives its **species composition** — what lives there. The vertical distribution of different species occupying different levels is called **stratification** — who sits at which height. In a forest, trees occupy the top vertical strata, shrubs the second, and herbs and grasses the bottom layers.\n\nStructure tells you what the ecosystem is made of. But the components function as a *unit* only when you look at four aspects: **productivity**, **decomposition**, **energy flow**, and **nutrient cycling**. Every one of those four is on show in that ordinary pond.",
    },
    {
      id: uuid(),
      type: 'text',
      order: 4,
      markdown: "So the chapter reads like a set of accounts. First the **input** — productivity, the energy and organic matter that the producers bring in. Then the **transfer** — energy moving through food chains and food webs, and nutrients cycling round. Then the **output** — degradation and energy loss, because no energy that enters an organism stays there forever.\n\nOne line to carry through every page that follows: the movement of energy towards the higher trophic levels is **unidirectional**, and along the way it is dissipated and lost as **heat** to the environment. Energy does not come back down the chain. Nutrients do; energy does not.\n\nWe begin where the ecosystem itself begins — with its structure, and the four functions that make it one working unit.",
    },
    {
      id: uuid(),
      type: 'callout',
      order: 5,
      variant: 'remember',
      title: 'What this chapter covers',
      markdown: "Fix the running order now. Class 12 is the most heavily examined half of NEET biology, and ecology questions are lifted almost verbatim from these NCERT lines:\n\n1. **12.1 Ecosystem — Structure and Function** — species composition, stratification, and the pond as a working model\n2. **12.2 Productivity** — primary production, GPP, NPP and the relation **GPP – R = NPP**; secondary productivity\n3. **12.3 Decomposition** — how detritus is broken down into inorganic substances, and what speeds it up or slows it down\n4. **12.4 Energy Flow** — PAR, producers and consumers, the grazing food chain and the detritus food chain, trophic levels, standing crop, and the **10 per cent law**\n5. **12.5 Ecological Pyramids** — pyramids of number, of biomass and of energy\n\nTwo definitions worth memorising word for word: an **ecosystem** is a functional unit of nature where organisms interact among themselves and with their physical environment; and the components function as a unit through **four** aspects — productivity, decomposition, energy flow and nutrient cycling. Do not shorten that list to three.",
    },
  ],
};
