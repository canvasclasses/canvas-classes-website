'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'gametophyte-vs-sporophyte',
  title: "Who's in Charge? Gametophyte vs Sporophyte Across the Plant Kingdom",
  subtitle: "Every plant lives two lives — one that makes gametes, one that makes spores. This page is the single thread that ties the whole chapter together: which of those two bodies runs the show, and how that answer shifts as plants march onto land.",
  page_number: 9,
  page_type: 'lesson',
  tags: ['alternation-of-generations', 'gametophyte', 'sporophyte', 'dominant-phase', 'plant-kingdom'],
  glossary: [
    { term: 'alternation of generations', definition: 'The plant life cycle pattern in which a diploid, spore-making body (the sporophyte) and a haploid, gamete-making body (the gametophyte) follow one after the other, turn by turn.' },
    { term: 'gametophyte', definition: 'The haploid (n) plant body that produces gametes (sex cells). How large it grows and whether it lives on its own varies from group to group.' },
    { term: 'sporophyte', definition: 'The diploid (2n) plant body that grows from the zygote and produces spores by meiosis.' },
    { term: 'dominant phase', definition: 'The body that forms the main, larger, longer-lasting plant you actually see in a given group — either the gametophyte or the sporophyte.' },
    { term: 'prothallus', definition: 'The small, free-living, mostly photosynthetic, thalloid gametophyte of a fern (a pteridophyte). It is haploid and bears the sex organs.' },
    { term: 'free-living', definition: 'Able to grow and feed on its own, independent of any other body. A free-living gametophyte does its own photosynthesis rather than depending on the sporophyte.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk climb from pond algae through a mossy rock and an unfurling fern to a cone-bearing conifer and a flowering tree, the plants growing taller left to right',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk landscape reading left to right as a climb from water onto dry land, with the plants growing steadily taller and more upright across the frame: on the far left, green filamentous algae drifting in shallow pond water at ground level; rising onto a damp mossy rock cushioned with low green moss; then a fern unfurling its frond on a shaded bank, waist-height; then a tall cone-bearing conifer; and on the far right a single flowering tree in soft bloom, the tallest of all. The ground gently rises from water on the left to firm dry earth on the right. Deep dusk light, one warm amber glow low on the horizon behind the flowering tree tying the whole scene together. Painterly, atmospheric illustration style, dark naturalistic background throughout (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Quiet Change of Power',
      markdown: "Every plant you have met in this chapter is really **two plants taking turns** — one body that makes gametes, and a different body that makes spores. Walk from a mossy rock to a fern to a pine tree to a mango tree and something quiet happens along the way: **the body that runs the plant's life changes hands.** In mosses, the little green gamete-making body is in charge. By the time you reach ferns, pines, and flowering trees, the *other* body — the tall, spore-making one — has taken over completely. This page is the story of that hand-over.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Here is the idea that sits under the whole plant kingdom. A plant's life cycle swings between two different bodies, turn by turn — this is called **alternation of generations**. One body is the **sporophyte**: it is **diploid (2n)** and its job is to make **spores** (by meiosis). The other is the **gametophyte**: it is **haploid (n)** and its job is to make **gametes** (the sex cells). Spores grow into the gametophyte; gametes fuse into a zygote that grows into the sporophyte; and round it goes.\n\nWhat actually *changes* from group to group is not this basic cycle — it's **how long each body lasts, how big it grows, and whether it can live on its own.** Read the chapter that way and two clean trends fall out.\n\n**Trend 1 — the crown moves from the gametophyte to the sporophyte.** In **bryophytes** the gametophyte is the main plant. From **pteridophytes** onward — through **gymnosperms** and **angiosperms** — the **sporophyte** is the main plant.\n\n**Trend 2 — the gametophyte shrinks and stops living on its own, and the plant stops needing water to reproduce.** In bryophytes and pteridophytes the gametophyte is still **free-living**. In gymnosperms it is tiny and **no longer free-living** — it stays tucked inside structures on the sporophyte. And the need for a film of **water to carry the sperm** — real in bryophytes and pteridophytes — is gone in the seed plants, replaced by a **pollen tube**.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Power Shift, Group by Group',
      objective: 'By the end of this you can name which body is dominant in each of the four groups, and whether its gametophyte lives on its own or leans on the sporophyte.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Bryophytes (mosses, liverworts).** The **main plant body is the haploid gametophyte** — the green moss cushion or flat liverwort you see. Because it makes the gametes, it is the gametophyte, and it is **dominant**. The sporophyte here is small and **not free-living** — it stays attached to the gametophyte and lives off it. And sexual reproduction **needs water**: the male gametes must swim across a film of it. That is why bryophytes are the *amphibians* of the plant kingdom. (The moss's early **protonema** stage and the liverwort's spores both belong to this **haploid gametophyte**.)\n\n**Pteridophytes (ferns, horsetails).** Now the crown changes hands. The **main plant body is the sporophyte** — differentiated into **true root, stem and leaves** with proper **vascular tissue** (xylem and phloem), and it is the **dominant phase**. The gametophyte hasn't vanished, but it has shrunk to a **small, free-living, photosynthetic thalloid gametophyte called a prothallus** — and it is still **haploid**. Fertilisation **still needs water** to carry the antherozoids to the archegonium.\n\n**Gymnosperms (pines, cycads, redwoods).** The sporophyte is now a full **tree** — firmly dominant. The big change is in the gametophyte: the **male and female gametophytes are highly reduced** (the male gametophyte is just the **pollen grain**) and, **unlike bryophytes and pteridophytes, they do NOT have an independent free-living existence** — they stay **retained within the sporangia on the sporophyte**. Sperm are no longer released into water; a **pollen tube** grows and delivers the male gametes right to the egg. **No swimming, no water film needed.**\n\n**Angiosperms (flowering plants).** The sporophyte stays dominant, and the plant takes the final step: **pollen grains and ovules form inside flowers**, and after fertilisation the **seeds are enclosed in fruits**. The gametophytes here are reduced even further — but exactly how is a story for later chapters. Angiosperms split into **dicots and monocots**.",
    },
    {
      id: uuid(), type: 'table', order: 5, caption: 'Dominant Phase Across the Four Groups',
      headers: ['Group', 'Dominant body', 'Gametophyte free-living?', 'Water needed for fertilisation?'],
      rows: [
        ['Bryophytes', 'Gametophyte (haploid)', 'Yes — free-living gametophyte', 'Yes'],
        ['Pteridophytes', 'Sporophyte', 'Yes — free-living prothallus', 'Yes'],
        ['Gymnosperms', 'Sporophyte (tree)', 'No — retained on the sporophyte', 'No — pollen tube delivers gametes'],
        ['Angiosperms', 'Sporophyte', 'Reduced (studied later)', 'No — pollen grains form in flowers (studied later)'],
      ],
      highlight_row: [0],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A botanist describes an unknown plant: it is a tall tree, and its tiny male and female gametophytes never grow on their own — they stay tucked inside structures on the parent tree, and the male gametes are carried to the egg by a growing tube, not by swimming. Using the two trends, which group is it, and what is its dominant body?",
      options: [
        "A bryophyte, with the gametophyte as its dominant body",
        "A pteridophyte, with a free-living prothallus as its dominant body",
        "A gymnosperm, with the sporophyte as its dominant body",
        "An alga, with no dominant body at all",
      ],
      correct_index: 2,
      reveal: "Two clues nail it down. First, the gametophytes are **not free-living** — they stay retained on the parent plant; NCERT says this is exactly what separates **gymnosperms** from bryophytes and pteridophytes. Second, the male gametes travel by a **pollen tube** instead of swimming through water, which again points to a seed plant. Since the visible plant is a tall tree that makes the spores, the **sporophyte is the dominant body**. A bryophyte would have a dominant *gametophyte*; a pteridophyte's gametophyte (the prothallus) is *free-living* and still needs water — so both of those contradict the description.",
      difficulty_level: 3,
    },
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'Four plants in a row — moss, fern, conifer, flowering tree — with the green gametophyte shrinking and the brown sporophyte growing taller across the row',
      caption: '📸 Tap each group to see who is dominant and whether its gametophyte lives on its own',
      generation_prompt: "Scientific textbook illustration comparing the gametophyte-vs-sporophyte balance across four plant groups. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Four plant figures stand in a single evenly spaced row, left to right, on a common baseline. FAR LEFT (Bryophyte): a small low green moss cushion labelled as mostly green — the green gametophyte tissue is large and dominant, with only a tiny brown stalk-and-capsule sporophyte poking up from it. SECOND (Pteridophyte): a medium fern whose large leafy frond is coloured green-to-brown as the dominant sporophyte, with a very small separate green heart-shaped prothallus (the free-living gametophyte) sitting on the ground beside its base. THIRD (Gymnosperm): a tall cone-bearing conifer, its whole trunk and branches coloured brown/tan as the dominant sporophyte, with a magnified tiny inset dot inside a cone showing the reduced gametophyte tucked inside — no free green gametophyte on the ground. FAR RIGHT (Angiosperm): the tallest plant, a flowering tree, coloured brown/tan trunk with small green foliage and a single flower, dominant sporophyte, with no visible independent gametophyte. Across the row the green (gametophyte) tissue clearly shrinks from left to right while the brown (sporophyte) body grows taller and larger. Clean white outlines, thin white leader lines, biologically accurate proportions, green = gametophyte/living photosynthetic tissue, brown/tan = sporophyte/woody dominant body. No text or labels baked into the image itself. No photorealism, no cartoon, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.12, y: 0.6, label: 'Bryophytes', icon: 'circle',
          detail: 'Dominant body = the **haploid gametophyte** (the green moss/liverwort). Its gametophyte is **free-living**, and the small sporophyte is dependent on it. **Water needed** for the sperm to swim.' },
        { id: uuid(), x: 0.38, y: 0.5, label: 'Pteridophytes', icon: 'circle',
          detail: 'Dominant body = the **sporophyte** (true root, stem, leaves, vascular tissue). The gametophyte is now just a small **free-living prothallus** — still **haploid**, still needs **water** for fertilisation.' },
        { id: uuid(), x: 0.63, y: 0.35, label: 'Gymnosperms', icon: 'circle',
          detail: 'Dominant body = the **sporophyte** (a tree). The male and female gametophytes are **highly reduced** and **NOT free-living** — retained on the sporophyte. A **pollen tube** delivers the gametes, so **no water** is needed.' },
        { id: uuid(), x: 0.87, y: 0.28, label: 'Angiosperms', icon: 'circle',
          detail: 'Dominant body = the **sporophyte**. Pollen grains and ovules form inside **flowers**, and seeds end up **enclosed in fruits**. The gametophyte is reduced even further (studied in later chapters).' },
      ],
    },
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'Why This Matters for the Move to Land',
      objective: 'By the end of this you can explain, in one line, how a smaller dependent gametophyte and no need for water made plants better suited to dry land.',
    },
    {
      id: uuid(), type: 'text', order: 9,
      markdown: "Line the two trends up and they point the same way — **toward dry land.** A gametophyte that is **free-living** has to survive out in the open on its own, and in bryophytes and pteridophytes it can only do that in **cool, damp, shaded** spots. Shrink that gametophyte and let it ride **inside the sporophyte**, as gymnosperms do, and the plant's most delicate stage is no longer exposed to drying out.\n\nThe second trend removes the other chain to water. As long as the male gametes have to **swim** — as in bryophytes and pteridophytes — the plant simply cannot reproduce without a film of water, which pins it near damp ground. Replace that swim with a **pollen tube** that grows straight to the egg, and reproduction no longer waits on rain. A dominant, sturdy sporophyte carrying a tiny protected gametophyte, and no need for external water — that combination is what lets the seed plants live and breed far from water. That is the thread running from pond algae all the way to a flowering tree.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'Lock These In',
      markdown: "- **Bryophytes → gametophyte is dominant** (and haploid). Everything from **pteridophytes onward → sporophyte is dominant.**\n- **Free-living gametophyte** in bryophytes and pteridophytes (the fern's **prothallus**). **Gymnosperm gametophyte is NOT free-living** — it stays retained on the sporophyte.\n- **Water needed for fertilisation up to and including pteridophytes.** In gymnosperms a **pollen tube** replaces the swim — no water needed.\n- Ploidy anchors: **gametophyte = n** (makes gametes); **sporophyte = 2n** (makes spores by meiosis). Moss **protonema** and fern **prothallus** are both **gametophyte → haploid (n)**.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Which is the dominant phase in X?** This is asked constantly. Bryophyte → **gametophyte**; pteridophyte, gymnosperm, angiosperm → **sporophyte**. Any option flipping these is the trap.\n\n**Ploidy of a named structure:** protonema (moss), prothallus (fern), gemma, ovum — the gametophyte and everything on it is **haploid (n)**; the sporophyte and its spore-mother cells are **diploid (2n)**. Spores themselves are made **by meiosis**, so they are haploid.\n\n**Free-living or not:** the prothallus **is** free-living; the gymnosperm gametophyte **is not** — it is retained on the sporophyte. NCERT states this contrast in one line, and NEET lifts it directly.\n\n**Match the group to the trait:** questions love a match-the-column format — group ↔ dominant phase, group ↔ needs water or not.\n\n**Classic NEET question:** \"In which group do the male and female gametophytes lack an independent free-living existence?\" → **Gymnosperms.**",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "From a strand of pond algae to a hundred-metre kelp, from a moss on wet rock to a fern, a pine, and finally a flowering tree — that is the whole climb of the plant kingdom, and you now hold the single thread that runs through all of it.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'In which group is the gametophyte the dominant (main) plant body?',
          options: ['Bryophytes', 'Pteridophytes', 'Gymnosperms', 'Angiosperms'],
          correct_index: 0,
          explanation: "Only in bryophytes is the haploid, gamete-making gametophyte the dominant plant body — the green moss or liverwort you see. From pteridophytes onward the sporophyte takes over as the main plant, so all three of the other groups have a dominant sporophyte, not gametophyte.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "The protonema of a moss and the prothallus of a fern are both stages of the gametophyte. What is their ploidy?",
          options: [
            'Both are haploid (n)',
            'Both are diploid (2n)',
            'The protonema is haploid but the prothallus is diploid',
            'The protonema is diploid but the prothallus is haploid',
          ],
          correct_index: 0,
          explanation: "The gametophyte is haploid, and both the moss protonema and the fern prothallus are gametophyte stages — so both are haploid (n). The diploid (2n) body in each life cycle is the spore-making sporophyte, which is a separate stage; neither the protonema nor the prothallus is part of it, so any option calling one of them diploid is wrong.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Moving up the plant kingdom, in which group does the gametophyte FIRST lose its free-living, independent existence and stay retained on the sporophyte?',
          options: ['Bryophytes', 'Pteridophytes', 'Gymnosperms', 'Angiosperms'],
          correct_index: 2,
          explanation: "NCERT states that unlike bryophytes and pteridophytes, in gymnosperms the male and female gametophytes do not have an independent free-living existence and remain within the sporangia on the sporophyte — so gymnosperms are the first group where this happens. In bryophytes the gametophyte is free-living and dominant, and in pteridophytes it is still a free-living prothallus, so neither is the first to lose independence.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Fertilisation still depends on a film of external water for the swimming male gametes in which pair of groups?',
          options: [
            'Bryophytes and pteridophytes',
            'Pteridophytes and gymnosperms',
            'Gymnosperms and angiosperms',
            'Bryophytes and gymnosperms',
          ],
          correct_index: 0,
          explanation: "In bryophytes the antherozoids swim through water to the archegonium, and in pteridophytes water is likewise required to carry the antherozoids — so this pair still depends on external water. Gymnosperms replace the swim with a pollen tube (no water needed), so any pair that includes gymnosperms is wrong.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
