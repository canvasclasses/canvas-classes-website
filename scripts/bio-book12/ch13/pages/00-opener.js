'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-13-overview',
  title: 'Biodiversity and Conservation',
  subtitle: 'Millions of years of evolution built the variety of life around us — and we could lose most of it in under two centuries. This chapter is what that variety is, why it is not spread evenly, why it matters, and how we hold on to it.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['biodiversity', 'conservation', 'ecology'],
  glossary: [
    { term: 'biodiversity', definition: 'The combined diversity at all the levels of biological organisation — from macromolecules within cells right up to biomes. The term was popularised by the sociobiologist Edward Wilson. The three most important levels are genetic, species and ecological diversity.' },
    { term: 'conservation', definition: 'Protecting biodiversity at the genetic, species and ecosystem levels. It is done in situ (on site — the species is protected in its natural habitat, so the whole ecosystem is saved) or ex situ (off site — a threatened species is taken out of its habitat and given special care).' },
    { term: 'endemic', definition: 'A species confined to one region and found nowhere else. A high degree of endemism, along with very high species richness, is what marks out a region as a biodiversity hotspot.' },
    { term: 'species richness', definition: 'The number of species in a given area. It is not uniform across the world — it generally decreases as you move away from the equator towards the poles, and it increases with the area explored, but only up to a limit.' },
  ],
  blocks: [
    {
      id: uuid(),
      type: 'image',
      order: 0,
      src: '',
      alt: 'A wide dusk view of a tropical rainforest valley alive with countless faint animal and plant forms, opening on the right into a thinning, sparser temperate slope',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). One continuous dusk landscape read left to right with no hard borders: on the left and centre a dense tropical rainforest valley seen from a high vantage, layer upon layer of canopy receding into warm mist, the whole frame quietly crowded with life — faint silhouettes of birds crossing the canopy, a large cat shape low among the trunks, clouds of insects catching the last light, orchids and epiphytes on the branches, a river glinting through the floor of the valley; toward the right the forest thins and cools into a sparser high-latitude slope with a few scattered conifers and bare rock, noticeably emptier, only one or two distant bird silhouettes against the sky. A single low warm horizon glow runs across the whole frame, tying the crowded valley and the empty slope together as one continuous world. Painterly atmospheric illustration, naturalistic, deep dark tones throughout (#0a0a0a base), muted earthy palette. No people, no text, no labels, no diagram elements, no arrows.",
    },
    {
      id: uuid(),
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'Seven out of every ten animals on Earth is an insect',
      markdown: "If an alien from a distant galaxy landed here, the first thing that would baffle him would probably not be us. It would be the sheer number of different living things sharing this one planet.\n\nThere are more than **20,000 species of ants**. **3,00,000 species of beetles**. **28,000 species of fishes**. Nearly **20,000 species of orchids**. Of every 10 animals on this planet, **7 are insects**. The group **Fungi** alone has more species than the fishes, amphibians, reptiles and mammals put together.\n\nEcologists and evolutionary biologists have been circling the same questions for a long time. Why are there so many species? Did such great diversity exist right through Earth's history? How did this diversification come about? How and why does it matter to the biosphere — would the biosphere run any differently if there were far fewer species? And what do we, sitting inside it, get out of the diversity of life?",
    },
    {
      id: uuid(),
      type: 'text',
      order: 2,
      markdown: "**Biodiversity** is the term popularised by the sociobiologist **Edward Wilson** for the combined diversity at **all** the levels of biological organisation. Read that carefully, because students routinely shrink it down to \"the number of species\" and lose marks for it. The heterogeneity in our biosphere runs from **macromolecules inside cells all the way up to biomes** — species is only one rung on that ladder.\n\nThree levels matter most. **Genetic diversity** is the variation a single species shows across its range — the medicinal plant *Rauwolfia vomitoria* growing in different Himalayan ranges differs in the potency and concentration of the active chemical **reserpine** it produces; India has more than **50,000 genetically different strains of rice** and **1,000 varieties of mango**. **Species diversity** is diversity at the species level — the Western Ghats have a greater amphibian species diversity than the Eastern Ghats. **Ecological diversity** is diversity at the ecosystem level — India, with its deserts, rain forests, mangroves, coral reefs, wetlands, estuaries and alpine meadows, has a greater ecosystem diversity than a Scandinavian country like Norway.",
    },
    {
      id: uuid(),
      type: 'text',
      order: 3,
      markdown: "It has taken **millions of years of evolution** to accumulate this wealth. At the present rates of species loss, we could lose all of it **in less than two centuries**. That single sentence is why biodiversity and its conservation are now vital environmental issues of international concern — enough people have realised that this variety is not decoration, it is tied to our own survival and well-being.\n\nAnd the losses are already on record. The **IUCN Red List (2004)** documents the extinction of **784 species** in the last 500 years — the dodo of Mauritius, the quagga of Africa, the thylacine of Australia, Steller's Sea Cow of Russia, and three subspecies of tiger (Bali, Javan, Caspian). More than **15,500 species** worldwide currently face the threat of extinction. There have been five episodes of mass extinction before humans ever appeared, so extinction itself is not new. What is new is the **rate**: the current rates are **100 to 1,000 times faster** than in pre-human times, and our activities are the reason. This is the **Sixth Extinction**, and we are inside it.",
    },
    {
      id: uuid(),
      type: 'text',
      order: 4,
      markdown: "So the chapter asks five questions in order, and each one sets up the next. First, **what is biodiversity and how much of it is there** — how many species on Earth, how many in India, and how do you even count something you haven't discovered yet. Then, **how is it arranged** — because diversity is not spread evenly; it thins out as you move from the equator to the poles, and it grows with area, but only up to a point.\n\nThen the hard question: **does the number of species actually matter** to how an ecosystem works? Paul Ehrlich's aeroplane full of rivets is waiting for you there. Then **what we are losing and why** — the four causes ecologists nickname the **Evil Quartet**. And finally, **why conserve, and how** — the narrowly utilitarian, broadly utilitarian and ethical arguments, and then *in situ* and *ex situ* conservation on the ground.\n\nThis is the last chapter of the book, and it is the one that closes the loop. Everything you have studied — genes, cells, organisms, populations, ecosystems — is a level at which diversity exists, and a level at which it can be lost. Nature's biological library is burning before we have even catalogued the titles of all the books stocked in it. This chapter is about reading the catalogue, and about putting out the fire.",
    },
    {
      id: uuid(),
      type: 'callout',
      order: 5,
      variant: 'remember',
      title: 'What this chapter covers',
      markdown: "Fix the running order now. Class 12 is the most heavily examined half of NEET biology, and this chapter's facts and figures are lifted almost verbatim from the NCERT lines:\n\n1. **13.1 Biodiversity** — the definition (all levels of biological organisation), and the three important levels: **genetic**, **species**, **ecological**\n2. **13.1.1 How many species are there on Earth and how many in India?** — the IUCN figure of slightly more than **1.5 million** described so far; **Robert May's** conservative estimate of about **7 million** globally; >70% of recorded species are animals, of which insects are >70%; plants no more than 22%; India has **2.4%** of the world's land area but **8.1%** of global species diversity, making it one of the **12 mega diversity countries**\n3. **13.1.2 Patterns of biodiversity** — the **latitudinal gradient** (tropics, 23.5°N to 23.5°S, harbour more species) with its three hypotheses; the **species–area relationship**, log S = log C + Z log A, and what the value of Z means\n4. **13.1.3 The importance of species diversity to the ecosystem** — what stability means, **David Tilman's** long-term plot experiments, and the **rivet popper hypothesis**\n5. **13.1.4 Loss of biodiversity** — the Sixth Extinction, the numbers, and the **Evil Quartet**: habitat loss and fragmentation, over-exploitation, alien species invasions, co-extinctions\n6. **13.2.1 Why should we conserve biodiversity?** — **narrowly utilitarian**, **broadly utilitarian**, **ethical**\n7. **13.2.2 How do we conserve biodiversity?** — ***in situ*** (biodiversity hotspots — **34** in all, three covering India; biosphere reserves, national parks, sanctuaries, sacred groves) and ***ex situ*** (zoological parks, botanical gardens, cryopreservation, in vitro fertilisation, tissue culture, seed banks), plus the **Earth Summit (Rio, 1992)** and the **World Summit on Sustainable Development (Johannesburg, 2002)**\n\nTwo things worth memorising word for word: biodiversity is the diversity at **all levels of biological organisation**, not just species; and the four causes of loss are the **Evil Quartet** — four, not three, and habitat loss and fragmentation is the **most important** one.",
    },
  ],
};
