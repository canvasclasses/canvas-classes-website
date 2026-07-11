'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'plantae-animalia-overview',
  title: 'Kingdoms Plantae & Animalia at a Glance',
  subtitle: "The last two kingdoms in one sitting — what makes something a plant, what makes something an animal, and the one shared idea (alternation of generations) that Chapter 3 builds on.",
  page_number: 8,
  page_type: 'lesson',
  tags: ['kingdom-plantae', 'kingdom-animalia', 'alternation-of-generations', 'biological-classification'],
  glossary: [
    { term: 'holozoic', definition: 'A mode of nutrition in which an organism takes in solid food by ingestion, then digests it inside its body. This is how animals feed.' },
    { term: 'sporophyte', definition: 'The diploid (2n) phase of a plant life cycle — the generation that produces spores.' },
    { term: 'gametophyte', definition: 'The haploid (n) phase of a plant life cycle — the generation that produces gametes.' },
    { term: 'alternation of generations', definition: 'The plant life-cycle pattern in which a diploid sporophyte phase and a haploid gametophyte phase follow one another, each giving rise to the other.' },
    { term: 'insectivorous plant', definition: 'A plant that traps and digests small animals such as insects to supplement its nutrition, e.g. Bladderwort and Venus fly trap.' },
    { term: 'parasite', definition: 'An organism that lives on or in another organism (its host) and draws nourishment from it, e.g. the plant Cuscuta.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk landscape split between a lush green forest of plants on one side and grazing and moving animals on the other, under one connected sky',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk landscape divided softly down the middle without a hard border: on the left half, a lush stillness of plant life — towering trees, ferns, mosses on rocks, tangled undergrowth, everything rooted and unmoving; on the right half, the same forest opening into a clearing alive with movement — faint silhouettes of a grazing deer, a bird lifting off, a fox mid-stride — animals that clearly feed on and move among the plants. One warm horizon glow ties the two halves together, suggesting the animals depend on the plants. Deep dusk lighting throughout, painterly illustration style, atmospheric, dark background overall (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Plant That Eats Animals',
      markdown: "You expect animals to eat plants. The **Venus fly trap** flips that around — it's a green, chlorophyll-containing plant that snaps shut on insects and digests them. **Bladderwort** does the same underwater. NCERT calls these **insectivorous plants**, and they exist because their usual soil is so poor in nutrients that catching a bug is worth the trouble. And **Cuscuta**, a leafless orange thread you may have seen twined over hedges, is a **parasite** — a plant that lives off another plant instead of feeding itself. Both are still plants; they've just gone **partially heterotrophic**.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "**Kingdom Plantae** includes all **eukaryotic, chlorophyll-containing organisms** we commonly call plants. That chlorophyll is the headline: it's how they make their own food. A **few** members are **partially heterotrophic** — the insectivorous plants (Bladderwort, Venus fly trap) and parasites (Cuscuta) from the box above — but these are the exceptions, not the rule.\n\nTwo features define a plant cell. It is **eukaryotic**, with **prominent chloroplasts** (the structures that hold chlorophyll), and it is wrapped in a **cell wall made mainly of cellulose**. Hold on to that word *cellulose* — it's the single feature that most cleanly separates a plant cell from an animal cell, which has no wall at all.\n\nPlantae is a big kingdom. It holds **algae, bryophytes, pteridophytes, gymnosperms, and angiosperms** — five groups you'll meet one by one in Chapter 3. NCERT keeps the plant story short here on purpose, because that whole chapter is coming. But there's one idea worth learning now, because every one of those five groups shares it.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Alternation of Generations — Two Phases That Take Turns',
      objective: 'By the end of this you can explain how a plant switches between a diploid and a haploid phase — and say which phase is which without hesitating.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "A plant's life cycle isn't one continuous body doing everything. It runs in **two distinct phases that alternate with each other**:\n\n- The **sporophyte** — the **diploid (2n)** phase. It carries two sets of chromosomes, and its job is to make **spores**.\n- The **gametophyte** — the **haploid (n)** phase. It carries one set of chromosomes, and its job is to make **gametes** (like eggs and sperm).\n\nOne gives rise to the other, back and forth, generation after generation. Here's the key detail NCERT flags: **how long each phase lasts, and whether it lives freely on its own or stays attached to and dependent on the other, varies from group to group.** In a moss the gametophyte is the big green plant you see; in a fern or a flowering plant, the sporophyte is the dominant body and the gametophyte shrinks to something tiny. This whole two-phase, take-turns pattern is called **alternation of generations**.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'The alternation of generations cycle — a diploid sporophyte and a haploid gametophyte alternating, linked by meiosis and fertilisation',
      caption: '📸 Tap each stage to follow the loop from sporophyte to gametophyte and back',
      hotspots: [
        { id: uuid(), x: 0.50, y: 0.14, label: 'Sporophyte (2n)', icon: 'circle',
          detail: 'The **diploid** phase — two sets of chromosomes. This is the spore-producing generation. In ferns and flowering plants it is the large, familiar plant body.' },
        { id: uuid(), x: 0.85, y: 0.50, label: 'Meiosis → spores', icon: 'circle',
          detail: 'The sporophyte produces **spores** by **meiosis**, which halves the chromosome number. So the spores are **haploid (n)** — that halving is what starts the next phase.' },
        { id: uuid(), x: 0.50, y: 0.86, label: 'Gametophyte (n)', icon: 'circle',
          detail: 'A spore grows into the **gametophyte** — the **haploid** phase. Its job is to make gametes. In a moss this is the green plant you actually see.' },
        { id: uuid(), x: 0.15, y: 0.50, label: 'Gametes (n)', icon: 'circle',
          detail: 'The gametophyte produces **gametes** — the male and female sex cells — which are also **haploid (n)**, since the gametophyte is already haploid.' },
        { id: uuid(), x: 0.30, y: 0.28, label: 'Fertilisation → zygote (2n)', icon: 'circle',
          detail: 'Two gametes fuse in **fertilisation**, combining their single sets into two. The resulting **zygote is diploid (2n)** and grows into the next sporophyte — closing the loop.' },
      ],
      generation_prompt: "Scientific textbook illustration of the alternation of generations life cycle in plants. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A large circular cycle arrow loop running clockwise, clean white outline. At the top of the loop, a simple leafy green plant form labelled area for the diploid sporophyte. Following the arrow clockwise down the right side, a small cluster of round green spores dropping away, marking the meiosis step. At the bottom of the loop, a small flat heart-shaped green gametophyte form. Up the left side, two tiny gamete cells (one larger round egg, one small tailed sperm) in pale green. Near the top-left of the loop where the arrow returns, a single round zygote cell in slightly darker green marking fertilisation. Green used throughout for the living plant tissue, thin white leader arrows showing the direction of the cycle, no baked-in text labels. Biologically simplified but accurate, no photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "In a plant's life cycle, one phase makes spores and the other makes gametes. If the gametophyte is the phase that produces gametes, what is its chromosome number, and why does that make sense?",
      options: [
        "Diploid (2n), because gametes need a full double set of chromosomes to work",
        "Haploid (n), because the gametophyte is the haploid phase and its gametes carry a single set, so fertilisation can restore the diploid number",
        "It has no fixed chromosome number — it changes depending on the season",
        "Diploid (2n), the same as the sporophyte, because both phases belong to the same plant",
      ],
      reveal: "The gametophyte is, by definition, the **haploid (n)** phase — that's what its name signals. Its gametes are haploid too, which is exactly the point: when two haploid gametes fuse at fertilisation, their single sets add up to a diploid (2n) zygote, which grows into the sporophyte. The tempting trap is 'diploid, like the sporophyte' — but if gametes were already diploid, fertilisation would double the chromosome number every generation, which never happens. Sporophyte = 2n, gametophyte = n. Keep those two locked.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Kingdom Animalia — Multicellular, Wall-less, and On the Move',
      objective: 'By the end of this you can list the defining features of an animal and contrast every one of them against a plant.',
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "**Kingdom Animalia** is the group of **heterotrophic, eukaryotic, multicellular** organisms — and their cells **lack a cell wall** entirely. That missing wall is the flip side of the cellulose wall you learned for plants; it's the cleanest single line between the two kingdoms.\n\nBecause they have no chlorophyll, animals can't make their own food, so they **depend on plants for food, either directly or indirectly** (a lion eats a deer, the deer ate grass — indirect, but it still traces back to a plant). They **digest their food in an internal cavity** and **store their food reserves as glycogen or fat** — not as the starch a plant would use. Their mode of nutrition is **holozoic** — feeding by the **ingestion** of solid food.\n\nAnimals also **follow a definite growth pattern**: they grow up to an **adult of a definite shape and size** and then stop, rather than growing indefinitely. **Higher forms show elaborate sensory and neuromotor mechanisms** — nerves and muscles that sense and respond — and **most animals are capable of locomotion**, actively moving from place to place. Finally, their **sexual reproduction is by copulation of a male and a female, followed by embryological development** — the fertilised egg develops through embryo stages into the new individual. Chapter 4 takes each animal phylum in turn; this is the shared portrait they all start from.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 9, title: 'Plantae vs Animalia',
      columns: [
        { heading: 'Kingdom Plantae', points: [
          'Cell wall present — made mainly of cellulose',
          'Autotrophic (chlorophyll-containing); a few partially heterotrophic — Bladderwort, Venus fly trap, Cuscuta',
          'Makes its own food using chlorophyll in chloroplasts',
          'Rooted and largely stationary; no locomotion',
          'Life cycle shows alternation of generations (sporophyte 2n ↔ gametophyte n)',
        ] },
        { heading: 'Kingdom Animalia', points: [
          'No cell wall at all',
          'Heterotrophic — depends on plants for food, directly or indirectly',
          'Holozoic nutrition (ingestion); digests food in an internal cavity',
          'Stores food reserves as glycogen or fat',
          'Most are capable of locomotion; higher forms have sensory & neuromotor systems',
        ] },
      ],
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'The Two Portraits, Side by Side',
      markdown: "- **Plantae** = **cellulose cell wall + chlorophyll** → makes its own food (autotroph); a few are partially heterotrophic exceptions.\n- **Animalia** = **no cell wall + holozoic** feeding → stores reserves as **glycogen or fat**, and most can **move**.\n- The single sharpest divider: **plant cells have a cellulose wall, animal cells have none.**\n- Every plant group shares **alternation of generations**: **sporophyte = diploid (2n)**, **gametophyte = haploid (n)**.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Partially heterotrophic plants:** NEET reliably asks for the examples. **Insectivorous → Bladderwort and Venus fly trap; parasite → Cuscuta.** Mixing these up (calling Cuscuta insectivorous, or Venus fly trap a parasite) is the classic trap.\n\n**Holozoic + storage:** the animal mode of nutrition is **holozoic** (ingestion), and reserves are stored as **glycogen or fat** — plants store starch. A question swapping 'glycogen' for 'starch' in the animal row is testing exactly this.\n\n**Alternation of generations:** remember **sporophyte = 2n (spores), gametophyte = n (gametes)**. This one line is the hook Chapter 3 hangs the entire plant kingdom on, so questions carry over.\n\n**Classic NEET question:** \"Which of the following is a parasitic plant — Bladderwort, Venus fly trap, or Cuscuta?\" → **Cuscuta.**",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "That completes all five kingdoms of Whittaker's system — Monera, Protista, Fungi, Plantae, and Animalia. But the scheme leaves a few things out: some organisms don't fit any kingdom at all. Next we meet the odd ones that Whittaker's five kingdoms never accounted for — **viruses, viroids, prions, and lichens.**",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which single feature most cleanly separates a plant cell from an animal cell?',
          options: [
            'Plant cells have a nucleus and animal cells do not',
            'Plant cells have a cell wall made mainly of cellulose; animal cells have no cell wall',
            'Animal cells contain chloroplasts and plant cells do not',
            'Plant cells are multicellular and animal cells are single-celled',
          ],
          correct_index: 1,
          explanation: "Plant cells are wrapped in a cellulose cell wall; animal cells have none — that's the sharpest divider NCERT gives. Both kingdoms are eukaryotic, so both have a nucleus; it's the plant (not the animal) that has chloroplasts; and both plants and animals in these kingdoms are multicellular, so those distractors reverse or muddle the real difference.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Bladderwort and Venus fly trap are grouped together in NCERT as examples of what kind of plant?',
          options: [
            'Parasitic plants that draw food from a host',
            'Insectivorous plants that trap and digest small animals',
            'Fully heterotrophic plants that have lost all chlorophyll',
            'Gymnosperms that bear naked seeds',
          ],
          correct_index: 1,
          explanation: "Bladderwort and Venus fly trap are insectivorous plants — they catch and digest insects, making them partially heterotrophic while still being green plants. Cuscuta is the parasite in this section, not these two; and they haven't lost their chlorophyll (they're only partially heterotrophic), so 'fully heterotrophic' overstates it.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'In the alternation of generations, which pairing of phase and chromosome number is correct?',
          options: [
            'Sporophyte is haploid (n); gametophyte is diploid (2n)',
            'Both the sporophyte and the gametophyte are diploid (2n)',
            'Sporophyte is diploid (2n); gametophyte is haploid (n)',
            'Both the sporophyte and the gametophyte are haploid (n)',
          ],
          correct_index: 2,
          explanation: "The sporophyte is the diploid (2n) spore-producing phase and the gametophyte is the haploid (n) gamete-producing phase — they alternate. Swapping the two (option A) is the most common mistake; and if both phases were the same ploidy, fertilisation and meiosis couldn't keep switching the chromosome number back and forth, which is the whole engine of the cycle.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: 'An animal digests food in an internal cavity, feeds by ingesting solid food, and stores its energy reserves. According to NCERT, its mode of nutrition and its storage form are:',
          options: [
            'Autotrophic nutrition; reserves stored as starch',
            'Holozoic nutrition; reserves stored as glycogen or fat',
            'Parasitic nutrition; reserves stored as cellulose',
            'Saprophytic nutrition; reserves stored as starch',
          ],
          correct_index: 1,
          explanation: "Animals feed holozoically — by ingestion — and store reserves as glycogen or fat. Starch and cellulose are plant materials, not animal stores, which rules out the options pairing animals with starch or cellulose; and animals are heterotrophs, so 'autotrophic' is wrong for the kingdom outright.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
