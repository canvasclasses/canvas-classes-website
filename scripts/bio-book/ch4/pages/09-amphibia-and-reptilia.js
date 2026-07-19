'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'amphibia-and-reptilia',
  title: 'Amphibia and Reptilia',
  subtitle: "Frogs still need water to breed and breathe through their skin. Lizards and crocodiles have almost broken free of water completely — but check a crocodile's heart before you assume every reptile follows the reptile rule.",
  page_number: 9,
  page_type: 'lesson',
  tags: ['animal-kingdom', 'tetrapoda', 'vertebrata'],
  glossary: [
    { term: 'amphibia', definition: 'From Greek amphi (dual) + bios (life). The class of vertebrates able to live in both aquatic and terrestrial habitats — most have two pairs of limbs and moist, scale-less skin.' },
    { term: 'cloaca', definition: 'A single chamber into which the alimentary canal, urinary tract, and reproductive tract all open before reaching the exterior. Found in amphibians.' },
    { term: 'tympanum', definition: 'A membrane that represents the ear in amphibians and reptiles — in reptiles it sits beneath the surface since there is no external ear opening.' },
    { term: 'poikilotherm', definition: 'A cold-blooded animal — one that cannot regulate its own body temperature and instead takes on the temperature of its surroundings.' },
    { term: 'reptilia', definition: 'From Latin repere/reptum (to creep or crawl). The mostly-terrestrial class of vertebrates with dry, cornified skin covered in scales or scutes.' },
    { term: 'scutes', definition: 'Thick, horny epidermal plates that cover the skin of many reptiles, alongside or instead of ordinary scales.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk landscape split between a misty marshy pond edge and dry cracked rocky terrain',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk landscape split evenly between two halves: on the left, a still marshy pond edge, half-submerged in shallow water with reeds and soft mist rising off the surface; on the right, sun-baked dry terrain with cracked earth and scattered flat boulders under fading warm light. Faint silhouettes of small amphibious and reptilian creatures sit quietly near the transition point where the water meets the dry rock — barely visible shapes, not the focal subject. A single warm amber glow along the horizon ties both halves of the scene together. Painterly, atmospheric illustration style, dark naturalistic background throughout (#0a0a0a base tones). No text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Name That Means Exactly What It Says',
      markdown: "The word **Amphibia** comes straight from Greek — *amphi* means **dual**, and *bios* means **life**. That isn't poetic exaggeration, it's a literal job description. These are animals built to live **both in water and on land**, moving between the two through their lives. Frogs, toads, and salamanders all carry this dual-life plan in the very name of their class.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Every chordate class you've studied so far — Cyclostomata, Chondrichthyes, Osteichthyes — lives its **entire life in water**. Amphibia and Reptilia are where that starts to change. Amphibians still need water for part of their life, so they keep one foot in the pond even as adults. Reptiles have broken free of water almost completely, spending their lives on dry land.\n\nBut neither class has broken free of the *other* thing every fish class carried: both Amphibia and Reptilia are still **cold-blooded (poikilothermous)** — they cannot regulate their own body temperature, exactly like the fish before them. That single fact runs through every vertebrate class you meet until you reach Aves, a few pages ahead — the first class that finally breaks it."
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Class Amphibia — Built for Two Worlds',
      objective: "By the end of this you can list every feature that makes an amphibian an amphibian — and explain exactly what a cloaca does.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Most amphibians carry **two pairs of limbs**, and their body is divided into just a **head and a trunk** — a tail is present in some but not all. The skin is the giveaway: it's **moist, and has no scales at all**, which is exactly why an amphibian's skin can double as a breathing surface — respiration happens through **gills, lungs, and the skin itself**. The eyes have **eyelids**, and hearing works through a **tympanum**, a membrane that represents the ear.\n\nInside, amphibians have a structure most vertebrates don't advertise so directly: the **alimentary canal, urinary tract, and reproductive tract all open into one shared chamber called the cloaca**, which then opens to the outside. The heart is **three-chambered — two auricles and one ventricle** — a layout you'll see repeated in most reptiles too. Fertilisation is **external**, they are **oviparous** (egg-laying), and development is **indirect** — the young don't hatch looking like miniature adults.\n\nNCERT's named examples: **Bufo** (toad), **Rana** (frog), **Hyla** (tree frog), **Salamandra** (salamander), and **Ichthyophis** — a limbless amphibian that looks almost like a worm."
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A generic amphibian body plan showing moist skin, the tympanum, eyelids, two pairs of limbs, and the cloaca opening',
      caption: '📸 Tap each part of the amphibian body plan to see what it does',
      generation_prompt: "Scientific textbook illustration of a generic amphibian (frog-like) body plan, side view, standing at the edge of water. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, smooth moist-looking skin rendered in muted green with NO scale texture anywhere on the body. A visible eyelid fold above each eye. A small circular tympanum membrane marked just behind and below the eye. Two clearly distinct pairs of limbs — a smaller front pair and a larger, more muscular hind pair suited for jumping. A short tail-less trunk with a small opening indicated at the rear underside of the body representing the cloaca. No text or labels baked into the image itself — labels are added separately as interactive hotspots. No photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.20, y: 0.32, label: 'Eye with eyelid', icon: 'circle',
          detail: 'Amphibians have **eyelids** covering their eyes — a feature fish don\'t have. This is one of the first land-adapted features that shows up in the tetrapod body plan.' },
        { id: uuid(), x: 0.30, y: 0.42, label: 'Tympanum (ear)', icon: 'circle',
          detail: 'A **tympanum** — a membrane — represents the ear. There is no visible outer ear structure, just this flat disc of skin that picks up vibrations.' },
        { id: uuid(), x: 0.52, y: 0.55, label: 'Moist skin, no scales', icon: 'circle',
          detail: 'The amphibian skin is **moist and completely without scales**. Because it stays moist, it can act as an extra respiratory surface — amphibians breathe through **gills, lungs, and skin**.' },
        { id: uuid(), x: 0.75, y: 0.78, label: 'Two pairs of limbs', icon: 'circle',
          detail: 'Most amphibians have **two pairs of limbs** — a front pair and a hind pair — used to move on land as well as in water.' },
        { id: uuid(), x: 0.88, y: 0.62, label: 'Cloaca', icon: 'circle',
          detail: 'The **cloaca** is a single shared chamber where the alimentary canal, urinary tract, and reproductive tract all open, before opening to the exterior.' },
      ],
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Class Reptilia — Life on Dry Land, With Dry Skin',
      objective: "By the end of this you can name the one reptile that breaks the 'three-chambered heart' rule — and explain why NEET keeps asking about it.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "The name **Reptilia** comes from Latin *repere* or *reptum* — **to creep or crawl** — a direct reference to how these animals move. Reptiles are **mostly terrestrial**, and their skin reflects that: it's **dry and cornified**, covered in **epidermal scales or scutes** instead of the moist, bare skin of an amphibian. There's no external ear opening either — once again a **tympanum** represents the ear, just sitting beneath the surface instead of exposed. When limbs are present, reptiles carry the same **two pairs** amphibians do.\n\nThe heart is **usually three-chambered**, matching the amphibian pattern — but NCERT flags one deliberate exception: **crocodiles have a four-chambered heart**. Reptiles are **poikilotherms** (cold-blooded), and snakes and lizards **shed their scales as a skin cast** as they grow. Sexes are separate, fertilisation is **internal**, and — unlike amphibians — reptiles are **oviparous with direct development**: the young hatch already looking like small versions of the adult, with no in-between stage.\n\nExamples: **Chelone** (turtle), **Testudo** (tortoise), **Chameleon** (tree lizard), **Calotes** (garden lizard), **Crocodilus** (crocodile), **Alligator**, **Hemidactylus** (wall lizard). Among the poisonous snakes: **Naja** (cobra), **Bangarus** (krait), and **Vipera** (viper)."
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "Reptiles are generally described as having a three-chambered heart, the same layout as amphibians. A student assumes this means every single reptile shares the exact same heart structure as a frog. Which named reptile breaks this assumption, and how?",
      options: [
        "Crocodilus (the crocodile) has a four-chambered heart, unlike most other reptiles which remain three-chambered",
        "Chelone (the turtle) has a two-chambered heart like a bony fish, unlike other reptiles",
        "Calotes (the garden lizard) has a four-chambered heart simply because it lives entirely on land",
        "No reptile breaks the three-chambered rule — every reptile, including crocodiles, is three-chambered like amphibians",
      ],
      correct_index: 0,
      reveal: "NCERT names this exception directly: reptiles are **usually three-chambered**, but **crocodiles are four-chambered**. Chelone (turtle) follows the ordinary three-chambered reptile pattern, not a fish-like two-chambered one. Calotes is also an ordinary three-chambered lizard — living on land alone doesn't earn a fourth chamber, only crocodiles get one. And the last option directly contradicts the text, which calls this out as a named exception, not a non-existent one.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Amphibia vs Reptilia',
      columns: [
        {
          heading: 'Amphibia',
          points: [
            'Habitat: dual life — aquatic AND terrestrial',
            'Skin: moist, no scales — doubles as a breathing surface',
            'Cloaca: alimentary, urinary and reproductive tracts open into one shared chamber',
            'Heart: three-chambered (2 auricles + 1 ventricle)',
            'Fertilisation: external; development: indirect',
            'Examples: Bufo (toad), Rana (frog), Hyla (tree frog), Salamandra (salamander), Ichthyophis',
          ],
        },
        {
          heading: 'Reptilia',
          points: [
            'Habitat: mostly terrestrial',
            'Skin: dry, cornified — epidermal scales or scutes; no external ear opening',
            'Heart: usually three-chambered — but FOUR-chambered in crocodiles',
            'Fertilisation: internal; development: direct',
            'Snakes and lizards shed scales as a skin cast',
            'Examples: Chelone (turtle), Testudo (tortoise), Calotes (garden lizard), Crocodilus, Alligator, Hemidactylus; poisonous — Naja (cobra), Bangarus (krait), Vipera (viper)',
          ],
        },
      ],
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'Lock These In',
      markdown: "- **Amphibia = dual life** (Gr. *amphi* + *bios*) — live both in water and on land.\n- **Amphibian skin:** moist, no scales; doubles as a respiratory surface alongside gills and lungs.\n- **Cloaca:** the one shared opening for the alimentary, urinary, and reproductive tracts — an amphibian feature.\n- **Reptile skin:** dry, cornified, covered in scales or scutes — no external ear opening; tympanum represents the ear.\n- **Heart:** three-chambered in Amphibia and in *most* Reptilia — **except crocodiles, which are four-chambered.**\n- **Fertilisation:** external in Amphibia, internal in Reptilia. **Development:** indirect in Amphibia, direct in Reptilia.\n- Both classes are still **poikilothermous (cold-blooded)** — like every vertebrate class before them.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Crocodile heart:** the single most-tested line on this page — reptiles are *usually* three-chambered, but **crocodiles are four-chambered**. NEET loves naming Crocodilus specifically to check whether you know this exception, not just the general reptile rule.\n\n**Both still cold-blooded:** Amphibia and Reptilia are **both poikilothermous** — same as every fish class before them. Don't assume 'lives on land' means 'controls its own body temperature.' That switch doesn't happen until Aves, a few pages ahead.\n\n**Fertilisation split:** **external** in Amphibia, **internal** in Reptilia — a clean, frequently swapped pair in MCQs. Pair it with development: **indirect** in Amphibia, **direct** in Reptilia.\n\n**Classic NEET question:** \"Which of the following reptiles possesses a four-chambered heart?\" → **Crocodilus (crocodile).**",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "Both these classes are cold-blooded, and one of them still can't fully leave water behind. The next class breaks that pattern completely — Aves arrives with feathers, a fully four-chambered heart as the *standard* (not an exception), and true warm-blooded control over its own body temperature."
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: "A frog's heart has two auricles and one ventricle. How does a typical reptile's heart (any reptile other than a crocodile) compare?",
          options: [
            'It has two auricles and two ventricles, unlike the frog\'s heart',
            'It is also three-chambered, with two auricles and one ventricle, just like the frog',
            'It has a single auricle and a single ventricle, simpler than the frog\'s heart',
            'It has no distinct chambers at all — blood flows through one open cavity',
          ],
          correct_index: 1,
          explanation: "NCERT describes the reptile heart as usually three-chambered — the same two-auricle, one-ventricle layout as the amphibian heart. The four-chambered structure belongs only to crocodiles, not to reptiles generally, so applying it to 'a typical reptile' is the trap in the first option. A single-chambered or chamber-less heart doesn't match either class.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'In amphibians, the alimentary canal, urinary tract, and reproductive tract all open into a single chamber before reaching the exterior. What is this chamber called?',
          options: ['Operculum', 'Tympanum', 'Cloaca', 'Clasper'],
          correct_index: 2,
          explanation: "This shared chamber is the cloaca. The tympanum is the membrane that represents the ear, not a digestive/reproductive opening. The operculum is the flap covering a bony fish's gills, and claspers are the fin structures found in male cartilaginous fish — both belong to earlier fish classes, not to this shared amphibian chamber.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Which class has EXTERNAL fertilisation, and which has INTERNAL fertilisation?',
          options: [
            'Amphibia — external; Reptilia — internal',
            'Amphibia — internal; Reptilia — external',
            'Both Amphibia and Reptilia have external fertilisation',
            'Both Amphibia and Reptilia have internal fertilisation',
          ],
          correct_index: 0,
          explanation: "NCERT states amphibian fertilisation is external and reptile fertilisation is internal. Swapping the two, as in the second option, is the classic mix-up this question is designed to catch — and neither class shares the same fertilisation type as the other, so both 'same for both' options are wrong.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which reptile example does NCERT specifically note as having a four-chambered heart, unlike most other reptiles?',
          options: ['Chelone (turtle)', 'Calotes (garden lizard)', 'Crocodilus (crocodile)', 'Hemidactylus (wall lizard)'],
          correct_index: 2,
          explanation: "Crocodilus is the named exception — its heart is four-chambered while most reptiles, including Chelone, Calotes, and Hemidactylus, keep the usual three-chambered reptile heart.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
