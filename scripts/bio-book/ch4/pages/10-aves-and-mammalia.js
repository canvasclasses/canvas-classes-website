'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'aves-and-mammalia',
  title: 'Aves, Mammalia, and the Whole Animal Kingdom at a Glance',
  subtitle: "The last two classes in the chapter are also the only two warm-blooded ones — and once you've met them, every phylum you've studied folds back into one recall table.",
  page_number: 10,
  page_type: 'lesson',
  tags: ['animal-kingdom', 'aves', 'mammalia', 'vertebrata', 'chapter-synthesis'],
  glossary: [
    { term: 'pneumatic bone', definition: "A hollow bone containing air cavities. A bird's long bones are pneumatic, which is part of what keeps its skeleton light enough to fly." },
    { term: 'homoiothermous', definition: 'Warm-blooded — able to maintain a constant body temperature no matter what the surroundings are doing. In the whole animal kingdom, only Aves and Mammalia are homoiothermous.' },
    { term: 'poikilothermous', definition: "Cold-blooded — body temperature rises and falls with the surroundings. Fishes, amphibians, and reptiles are all poikilothermous." },
    { term: 'mammary gland', definition: "A milk-producing gland. NCERT calls this the most unique mammalian characteristic — it is how the young are nourished." },
    { term: 'pinna', definition: 'The external ear flap. Mammals have pinnae; this is one of the features that separates them from the other vertebrate classes.' },
    { term: 'crop and gizzard', definition: "Two extra chambers in a bird's digestive tract, beyond the stomach and intestine every vertebrate already has." },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk scene of a peacock in flight over open grassland with a tiger resting in the grass below, both lit by the same warm horizon light',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk grassland scene: on the left, a peacock (Pavo) mid-flight low over tall grass, wings spread wide, its long tail feathers trailing; on the right, a tiger (Panthera tigris) resting alert in the same grass, watching the horizon. Both animals lit by the same warm amber glow low on the horizon behind them, tying the scene together as two very different bodies solving the same problem of staying warm and active at dusk. Deep dusk lighting, painterly atmospheric illustration style, dark naturalistic background throughout (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Kingdom Finally Warms Up',
      markdown: "Walk back through every class in this chapter — fishes, amphibians, reptiles — and one thing has been true the whole way: their body temperature simply follows the weather. A fish in cold water is a cold fish. Then you reach the last two classes, and something changes for good. A peacock standing in the rain and a tiger resting in the snow both keep running at the **same internal temperature**, whatever is happening outside. **Aves and Mammalia are the only two homoiothermous — warm-blooded — classes in the entire animal kingdom**, and this page is where you meet both of them, then step back and see the whole chapter as one picture.",
    },
    // ── 2 · Core concept / bridge ─────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Aves and Mammalia are both chordates, both organ-system level, both coelomate, both fully endoskeletal — none of that is new. What sets them apart from every class you've met so far is **how they hold their own body temperature steady**, and each class does it with a completely different covering: one grows **feathers**, the other grows **hair**. Everything else in this page — the beak, the wings, the mammary glands, the pinnae — is really just the engineering built around that one shared trick of staying warm.",
    },
    // ── 3 · Heading — Aves ───────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Class Aves — Feathers, Flight, and a Lightened Skeleton',
      objective: 'By the end of this you can list what makes a bird a bird — feathers, beak, pneumatic bones, air sacs, crop and gizzard — and explain why each one exists.',
    },
    // ── 4 · Text — Aves body plan ─────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The single feature that marks out Aves is **feathers**. Because of them, **most birds can fly** — the exceptions are the **flightless birds**, such as the **Ostrich (Struthio)**. Every bird has a **beak**, and its **forelimbs are modified into wings**. The **hind limbs are generally scaled**, and they're built for whatever the bird actually needs to do on the ground or in water — **walking, swimming, or clasping a tree branch**.\n\nThe skin itself is **dry, with no glands** — the one exception is the **oil gland at the base of the tail**. Underneath, the **endoskeleton is fully ossified** (properly bony, not cartilaginous), and here's the trick that keeps a flying body light: the **long bones are hollow, with air cavities** — this is called being **pneumatic**.\n\nA bird's gut has two chambers no other vertebrate class has: the **crop and the gizzard**. And the **heart is completely four-chambered** — a fully separated pump, matching the **warm-blooded (homoiothermous)** body it serves, since keeping a constant body temperature takes a steady, undiluted supply of oxygenated blood. **Respiration is by lungs**, and **air sacs connected to the lungs supplement** that respiration, giving birds one of the most efficient breathing systems in the animal kingdom.\n\nSexes are **separate**, **fertilisation is internal**, birds are **oviparous**, and **development is direct** — a chick hatches looking like a small bird, not some other larval stage.\n\n**Examples:** *Corvus* (crow), *Columba* (pigeon), *Psittacula* (parrot), *Struthio* (ostrich), *Pavo* (peacock), *Aptenodytes* (penguin), *Neophron* (vulture).",
    },
    // ── 5 · Interactive image — bird body plan ─────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: "A generalised bird in side view, showing its beak, feather-covered body with the oil gland at the tail base, wing, hollow pneumatic long bones, and air sacs connected to the lungs",
      caption: '📸 Tap each part to see how it helps a bird fly and stay warm',
      generation_prompt: "Scientific textbook illustration of a generalised perching bird (crow/pigeon-style) in side profile, standing on a branch. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, no text or labels baked into the image. Show: a pointed beak at the front of the head; the whole body covered in a smooth pattern of feathers (light grey/white feather texture); one wing shown extended to reveal its structure, coloured pale pink/magenta (animal soft tissue) under the feather outline; a small oil gland marked as a rounded bump at the base of the tail; a cutaway view of one long wing bone rendered as hollow with visible internal air cavities (pneumatic bone), coloured pale tan/white; and a simplified internal cutaway silhouette in the chest/torso showing small balloon-like air sacs (pale blue, semi-transparent) connected by thin tubes to two lungs. Functional colours: white/grey for feathers and bone, pale pink/magenta for soft tissue, pale blue for air sacs (air/respiratory system). No photorealism, no cartoon, no mascots, no labels baked in — matches standard biology textbook illustration conventions.",
      hotspots: [
        {
          id: uuid(), x: 0.10, y: 0.32, label: 'Beak', icon: 'circle',
          detail: "Every bird has one. Along with the fact that the **forelimbs are modified into wings**, the beak is one of the two features NCERT opens the class description with.",
        },
        {
          id: uuid(), x: 0.42, y: 0.40, label: 'Wing (modified forelimb)', icon: 'circle',
          detail: "The forelimb, modified into a wing, is what lets **most birds fly**. The exceptions are **flightless birds**, such as the **Ostrich (Struthio)**.",
        },
        {
          id: uuid(), x: 0.55, y: 0.48, label: 'Hollow, pneumatic long bones', icon: 'circle',
          detail: "The **endoskeleton is fully ossified**, but the **long bones are hollow with air cavities** — this is called being **pneumatic**. A lighter skeleton is easier to lift off the ground.",
        },
        {
          id: uuid(), x: 0.50, y: 0.58, label: 'Air sacs connected to the lungs', icon: 'circle',
          detail: "**Respiration is by lungs**, and **air sacs connected to the lungs supplement respiration** — extra reserves of air that make a bird's breathing unusually efficient.",
        },
        {
          id: uuid(), x: 0.86, y: 0.42, label: 'Oil gland at the base of the tail', icon: 'circle',
          detail: "Skin is **dry, without glands**, with exactly **one exception** — the **oil gland at the base of the tail**. Everywhere else on a bird's body, the skin has no glands at all.",
        },
      ],
    },
    // ── 6 · Heading — Mammalia ────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Class Mammalia — Mammary Glands, Hair, and Almost Every Habitat on Earth',
      objective: 'By the end of this you can name the one feature that defines Mammalia, and explain why Ornithorhynchus still counts as a mammal even though it lays eggs.',
    },
    // ── 7 · Text — Mammalia body plan ─────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "No other class spreads this wide. Mammals are found in **polar ice caps, deserts, mountains, forests, grasslands, and dark caves** — and some of them have even adapted to **fly** or to **live in water**.\n\nWhat actually makes an animal a mammal is not where it lives. It is one feature: **milk-producing glands, the mammary glands**, which **nourish the young**. NCERT calls this **the most unique mammalian characteristic** — nothing else in the animal kingdom has it. Mammals carry **two pairs of limbs**, adapted for whatever job the species needs — **walking, running, climbing, burrowing, swimming, or flying**.\n\nThe skin is unique in one more way too: it's the only class with **hair**. **External ears, or pinnae,** are present, and the jaw carries **different types of teeth** rather than one uniform row. The **heart is four-chambered**, mammals are **homoiothermous**, and **respiration is by lungs**.\n\nSexes are **separate**, **fertilisation is internal**, and mammals are **mostly viviparous — with a few exceptions** — and **development is direct**.\n\n**Examples — Oviparous exception:** *Ornithorhynchus* (platypus). **Viviparous:** *Macropus* (kangaroo), *Pteropus* (flying fox), *Camelus* (camel), *Macaca* (monkey), *Rattus* (rat), *Canis* (dog), *Felis* (cat), *Elephas* (elephant), *Equus* (horse), *Delphinus* (common dolphin), *Balaenoptera* (blue whale), *Panthera tigris* (tiger), *Panthera leo* (lion).",
    },
    // ── 8 · Reasoning prompt — the platypus exception ─────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "Ornithorhynchus, the platypus, lays eggs — the one exception NCERT names to the rule that mammals are mostly viviparous. Yet it is still placed firmly inside Mammalia, not Aves or Reptilia. Which pair of features actually justifies keeping it there?",
      options: [
        "It has mammary glands and hair — the two features NCERT uses to define Mammalia, neither of which depends on how the young are born",
        "It develops indirectly through a larval stage, and indirect development is what NCERT uses to define Mammalia",
        "It is warm-blooded, and warm-bloodedness alone is what separates Mammalia from every other class",
        "It has an oviparous mode of reproduction, so NCERT actually places it in a separate egg-laying sub-class outside true Mammalia",
      ],
      correct_index: 0,
      reveal: "NCERT defines Mammalia by mammary glands (the most unique mammalian characteristic, nourishing the young) and hair on the skin — not by whether the young hatch from an egg or are born live. Ornithorhynchus still has both, so it stays a mammal despite laying eggs; NCERT lists it directly as the 'oviparous' example inside Mammalia, not in any separate group. Warm-bloodedness is shared with Aves, so it can't be the feature that separates the two classes — and NCERT never describes mammalian development as indirect; both Aves and Mammalia develop directly.",
      difficulty_level: 3,
    },
    // ── 9 · Comparison card — Aves vs Mammalia ─────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Aves vs Mammalia',
      columns: [
        {
          heading: 'Aves',
          points: [
            'Body covering: feathers. Skin dry, no glands except the oil gland at the base of the tail',
            'Defining adaptation: forelimbs modified into wings; endoskeleton fully ossified with hollow, pneumatic long bones',
            'Heart completely four-chambered',
            'Homoiothermous (warm-blooded)',
            'Oviparous, direct development',
            'Examples: Corvus (crow), Columba (pigeon), Psittacula (parrot), Struthio (ostrich), Pavo (peacock)',
          ],
        },
        {
          heading: 'Mammalia',
          points: [
            'Body covering: hair — unique to this class. External ears (pinnae) present',
            'Defining adaptation: mammary glands nourishing the young — "the most unique mammalian characteristic"',
            'Heart four-chambered',
            'Homoiothermous (warm-blooded)',
            'Mostly viviparous, with few exceptions (e.g. Ornithorhynchus); direct development',
            'Examples: Macropus (kangaroo), Canis (dog), Felis (cat), Panthera tigris (tiger), Balaenoptera (blue whale)',
          ],
        },
      ],
    },
    // ── 10 · Heading — chapter synthesis ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'Zooming Out — The Whole Kingdom in One Table',
      objective: 'By the end of this you can look at any of the eleven phyla and recall the one feature that makes it unmistakable.',
    },
    // ── 11 · Text — synthesis ──────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "Every phylum in this chapter was sorted using the same small toolkit: **level of organisation, symmetry, presence of a coelom, segmentation,** and, for the vertebrates, the **notochord**. A sponge stopped at the cellular level with no coelom at all. An earthworm added true segmentation. An arthropod locked its segments inside a jointed cuticle. And Chordata added the one structure none of the other ten phyla ever build — a **notochord**, running alongside a **dorsal, hollow nerve cord** and **paired pharyngeal gill slits**.\n\nInside Chordata, the split kept going: jawless **Agnatha** against jawed **Gnathostomata**; **Pisces** against **Tetrapoda**. Tetrapoda is where you met **Amphibia**, living a double life on land and in water; **Reptilia**, with dry, cornified skin and — in snakes — no limbs at all; and now **Aves and Mammalia**, the only two classes that broke free of the surrounding temperature altogether.\n\nThe table below is your fast-recall version of NCERT's own Table 4.2 — one line per phylum, Porifera to Chordata, in the exact order you met them.",
    },
    // ── 12 · Table — Table 4.2 recap ─────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 12,
      caption: 'Table 4.2 (condensed) — Distinctive Feature of Every Phylum in the Animal Kingdom',
      headers: ['Phylum', 'Distinctive Feature'],
      rows: [
        ['Porifera', 'Body with pores and canals in its walls'],
        ['Coelenterata (Cnidaria)', 'Cnidoblasts present'],
        ['Ctenophora', 'Comb plates for locomotion'],
        ['Platyhelminthes', 'Flat body, suckers'],
        ['Aschelminthes', 'Pseudocoelomate, often worm-shaped and elongated'],
        ['Annelida', 'Body segmentation like rings'],
        ['Arthropoda', 'Exoskeleton of cuticle, jointed appendages'],
        ['Mollusca', 'External skeleton of shell usually present'],
        ['Echinodermata', 'Water vascular system, radial symmetry (as an adult)'],
        ['Hemichordata', 'Worm-like body with proboscis, collar, and trunk'],
        ['Chordata', 'Notochord, dorsal hollow nerve cord, gill slits, with limbs or fins'],
      ],
      highlight_row: [10],
    },
    // ── 13 · Remember callout ──────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember',
      title: 'Lock These In Before the Chapter Closes',
      markdown: "- **Aves and Mammalia are the ONLY two homoiothermous (warm-blooded) classes** in the entire animal kingdom. Fishes, amphibians, and reptiles are all **poikilothermous**.\n- **Aves:** feathers, beak, wings, pneumatic hollow bones, air sacs, crop and gizzard, four-chambered heart, oviparous.\n- **Mammalia:** mammary glands (the defining trait), hair, pinnae, four-chambered heart, mostly viviparous — except **Ornithorhynchus (platypus)**, which is oviparous but still a mammal because of its mammary glands and hair.\n- **Phylum order mnemonic:** \"**P**oor **C**ats **C**hase **P**layful **A**nts **A**s **A**nts **M**arch **E**legantly **H**ome, **C**almly\" → Porifera, Coelenterata, Ctenophora, Platyhelminthes, Aschelminthes, Annelida, Arthropoda, Mollusca, Echinodermata, Hemichordata, Chordata.",
    },
    // ── 14 · Exam tip ───────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**The single biggest thermoregulation fact in the whole chapter:** only **Aves and Mammalia** are homoiothermous. Every option that adds Reptilia or Amphibia to that list, or removes one of the real two, is the trap.\n\n**The platypus exception:** *Ornithorhynchus* is oviparous, yet it's still a mammal — because Mammalia is defined by **mammary glands and hair**, not by how the young are born. This is a favourite \"which statement is FALSE\" setup.\n\n**Classic NEET question:** \"Which of the following is an oviparous mammal?\" → **Ornithorhynchus (Platypus).**\n\n**The closing habit to build:** you never needed to memorise eleven phyla as a flat list. Every one of them falls out of the same handful of yes/no questions from the start of the chapter — level of organisation, symmetry, coelom present or not, segmented or not, and for chordates, a notochord or none. Meet an unfamiliar animal in a NEET question, run it through those questions in order, and you can place it correctly without ever having seen it named before.",
    },
    // ── 15 · Closing text ────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "That's the whole animal kingdom, sorted the way biologists actually sort it — not eleven names to memorise, but one small set of questions you can ask of any animal you're ever handed.",
    },
    // ── 16 · Inline quiz ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which pair of classes are the ONLY homoiothermous (warm-blooded) classes in the entire animal kingdom?',
          options: ['Reptilia and Aves', 'Aves and Mammalia', 'Amphibia and Mammalia', 'Pisces and Reptilia'],
          correct_index: 1,
          explanation: "NCERT's own summary states that fishes, amphibians, and reptiles are all poikilothermous (cold-blooded), while Aves and Mammalia are warm-blooded. Any pairing that swaps in Reptilia, Amphibia, or Pisces in place of one of the real two classes is wrong.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "NCERT calls one feature 'the most unique mammalian characteristic.' What is it?",
          options: ['Hollow, pneumatic bones', 'Milk-producing mammary glands that nourish the young', 'External ears (pinnae) alone', 'A completely four-chambered heart'],
          correct_index: 1,
          explanation: "Mammary glands are named directly as the most unique mammalian characteristic, since they nourish the young. Pneumatic bones belong to Aves, not Mammalia; and a four-chambered heart is shared by both Aves and Mammalia, so it can't be what makes mammals unique.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "A bird's digestive tract has two extra chambers beyond the usual gut. What are they, and what supplements its breathing?",
          options: [
            'Crop and gizzard in the gut; air sacs connected to the lungs supplement respiration',
            'Crop and gizzard in the gut; air sacs connected to the heart supplement respiration',
            'Mantle cavity in the gut; gills supplement respiration',
            'Radula and beak in the gut; pinnae supplement respiration',
          ],
          correct_index: 0,
          explanation: "NCERT states the digestive tract of birds has additional chambers, the crop and gizzard, and that air sacs connected to the lungs supplement respiration. The mantle cavity and radula belong to Mollusca, not Aves, and pinnae are a mammalian ear structure, not a respiratory one.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Ornithorhynchus (the platypus) lays eggs, unlike almost every other mammal. Which features still correctly keep it inside Mammalia?',
          options: ['Feathers and a beak', 'An oil gland and hollow bones', 'Scales and external fertilisation', 'Mammary glands and hair'],
          correct_index: 3,
          explanation: "Mammalia is defined by mammary glands and hair, and Ornithorhynchus has both despite being oviparous — that's exactly why NCERT lists it as the oviparous exception inside Mammalia rather than moving it to another class. Feathers, a beak, an oil gland, and hollow bones are all Aves features, not mammalian ones.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
