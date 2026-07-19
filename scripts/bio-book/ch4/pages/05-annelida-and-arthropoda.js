'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'annelida-and-arthropoda',
  title: 'Annelida and Arthropoda',
  subtitle: "Segmented worms with blood confined to pipes, and the armoured, jointed-legged phylum that alone accounts for over two-thirds of every named species on Earth — the two true-coelomate body plans that come right after the flatworms.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['animal-kingdom', 'annelida', 'arthropoda'],
  glossary: [
    { term: 'metamere', definition: 'One of the repeating ring-like segments that mark out an annelid body — the feature the phylum is named after (Latin annulus = little ring). Also called metameric segmentation.' },
    { term: 'parapodia', definition: 'Paired, paddle-like lateral appendages found on each segment of aquatic annelids like Nereis, used for swimming.' },
    { term: 'nephridium', definition: "An annelid's tubular excretory and osmoregulatory organ — one pair sits in each segment. Plural: nephridia." },
    { term: 'dioecious', definition: 'Having separate male and female individuals, as in Nereis.' },
    { term: 'monoecious', definition: 'A single individual carrying both male and female reproductive organs, as in earthworms and leeches.' },
    { term: 'chitinous exoskeleton', definition: "An arthropod's hard, non-living external covering, built from chitin, that encloses the whole body." },
    { term: 'malpighian tubules', definition: "An arthropod's excretory organ — a completely different structure from an annelid's nephridium." },
    { term: 'statocyst', definition: 'A small balancing (equilibrium-sensing) organ found in some arthropods, alongside antennae and eyes.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk tide pool with a segmented worm in wet sand, blending into a grassy bank where insects and a scorpion move among the stalks',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk scene split across two zones without a hard border: on the left, a wet coastal tide pool at low tide with rippled sand, a segmented ragworm-like silhouette partly buried at the water's edge; on the right, the sand rises into a grassy bank at dusk, tall grass stalks silhouetted against fading amber light, with the faint shapes of insects in flight and a scorpion low among the stems. A single warm horizon glow ties both zones together. Deep, atmospheric, painterly illustration style, dark naturalistic background throughout (#0a0a0a base tones), no people, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Two Out of Every Three Named Species Is One of These',
      markdown: "Of every species biologists have ever formally named and described on this planet, **more than two-thirds are arthropods**. Insects, spiders, crabs, scorpions, centipedes — all of them belong to a single phylum, **Arthropoda**, which makes it the **largest phylum in the whole of Animalia**. Right before it in this chapter comes a very different but related success story — the **Annelida**, the segmented worms whose body plan quietly solved the plumbing and movement problems that made a phylum like Arthropoda possible in the first place.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "You'll find **Annelida** in the sea, in fresh water, and in the soil under your feet — some **free-living**, some **parasitic**. Like the phylum coming up next on this page, they've reached the **organ-system level of organisation**, and they are **triploblastic**, **bilaterally symmetrical**, and **coelomate**.\n\nThe name gives away their defining feature. **Annelida** comes from the Latin *annulus*, meaning \"little ring.\" Look closely at an earthworm and you'll see exactly why: its body surface is **distinctly marked out into segments, called metameres** — one ring after another down the length of the body. This is **metameric segmentation**, and it isn't just a pattern on the skin. **Longitudinal and circular muscles** run through the body wall, and because the body is divided into repeating rings, different stretches of it can shorten and lengthen independently — which is exactly how an earthworm crawls.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'How a Segmented Body Actually Works',
      objective: "By the end of this you'll know what parapodia do, why annelid blood never leaves its pipes, and why an earthworm doesn't need a partner to reproduce.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "An aquatic annelid like ***Nereis*** takes the segmented body one step further — each segment carries a pair of lateral, paddle-like outgrowths called **parapodia**, and it uses these to swim.\n\nTheir circulatory system is **closed** — blood stays confined inside a network of vessels of varying diameter, moving through defined pipes rather than pooling loosely around the organs. For excretion and osmoregulation, each segment carries its own pair of **nephridia** (singular: nephridium) — small tubular filters, one pair to a ring.\n\nThe nervous system matches the segmented plan too: **paired ganglia** sit through the body, connected by lateral nerves to a **double ventral nerve cord** running the whole length.\n\nReproduction is sexual, but arranged differently across the phylum. ***Nereis***, the aquatic form, is **dioecious** — separate male and female individuals. Earthworms and leeches, though, are **monoecious** — a single individual carries both male and female organs.\n\n**Examples:** *Nereis* (a marine ragworm), *Pheretima* (the common earthworm), and *Hirudinaria* (the blood-sucking leech).",
    },
    {
      id: uuid(), type: 'image', order: 5, src: '',
      alt: 'Nereis with paddle-like parapodia beside the segmented body of the earthworm Pheretima',
      caption: '📸 Two annelid body plans, both built from repeating rings — Nereis (with parapodia) and the earthworm Pheretima',
      width: 'full', aspect_ratio: '16:9',
      generation_prompt: "Scientific textbook illustration comparing two annelid body plans side by side. Flat 2D educational diagram on a dark background (#0a0a0a near-black). On the left, Nereis: an elongated segmented worm shown from above, each segment bearing a pair of small paddle-like lateral appendages (parapodia) sticking out from the sides, labelled with a thin white leader line reading 'parapodia'. On the right, Pheretima, the earthworm: a smooth cylindrical segmented body with visible ring-like grooves (metameres) along its length, a small cutaway inset near the middle showing a pair of small tubular nephridia inside one segment and a thin double nerve cord running along the ventral (lower) side, each labelled with a white leader line. Clean white outlines, biologically accurate proportions, pink/tan tones for the soft worm bodies, labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "Back on page 1 (§4.1.1, Basis of Classification) you learned that circulatory systems come in two types — open, where the heart pumps blood straight into body spaces that directly bathe the tissues, and closed, where blood is confined to a network of vessels. Annelids like the earthworm have a closed circulatory system. What does 'closed' actually mean for how their blood moves?",
      options: [
        "Blood in a closed system never moves through vessels at all — it pools in open spaces around every organ, exactly like an open system",
        "Blood in a closed system is confined the whole time to a graded network of vessels — arteries, veins and capillaries — and never directly bathes the tissues, unlike an open system",
        "Closed simply means the heart is enclosed inside a body cavity; it says nothing about how the blood itself travels",
        "Closed circulatory systems only occur in animals that have no heart at all, since the vessels alone push the blood along",
      ],
      reveal: "\"Closed\" means the blood stays confined inside vessels the whole time — it travels through a graded network (arteries → capillaries → veins) and never spills out to directly touch tissues. That's the exact §4.1.1 definition, and it's exactly what the earthworm has. An open system does the opposite: the heart pumps blood straight into open body spaces where it directly bathes the cells and tissues — that's what Arthropoda, coming up next on this page, actually run. The word \"closed\" isn't about whether a heart is present or where it sits; it's purely about whether blood stays inside vessels.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Arthropoda: The Biggest Success Story in the Animal Kingdom',
      objective: "By the end of this you'll know exactly what jointed appendages and an exoskeleton let this phylum do that no other phylum manages, and where their excretory organ differs from an annelid's.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Now for the giant. **Arthropoda is the largest phylum of Animalia** — it includes every insect you've ever seen, and **over two-thirds of all named species on Earth are arthropods**. Nothing else in the animal kingdom comes close.\n\nLike annelids, arthropods have reached the **organ-system level of organisation**, and they are **bilaterally symmetrical**, **triploblastic**, **segmented**, and **coelomate** — so far, a familiar list. What sets them apart is the covering and the limbs. The whole body is wrapped in a **chitinous exoskeleton** — a hard, external, non-living covering — and the body is divided into three regions: **head, thorax, and abdomen**. Every one of these regions carries **jointed appendages** — the phylum's own name spells this out (*arthros* = joint, *poda* = appendage).\n\nRespiration is handled differently depending on the animal: **gills, book gills, book lungs, or a tracheal system**. Unlike the annelid's closed pipework, the circulatory system here is **open** — blood is pumped out of the heart and directly bathes the cells and tissues, exactly the open type from §4.1.1. Sensory equipment is rich too: **antennae**, **eyes** (both compound and simple), and **statocysts** for balance. Excretion happens through **malpighian tubules** — a completely different organ from the annelid's nephridium.\n\nMost arthropods are **dioecious**, fertilisation is usually **internal**, most are **oviparous**, and development afterward may be **direct or indirect**.\n\nTheir economic footprint is enormous. Among the **economically important insects**: *Apis* (the honey bee), *Bombyx* (the silkworm), and *Laccifer* (the lac insect). Among the **vectors** that spread disease: *Anopheles*, *Culex*, and *Aedes* — all mosquitoes. *Locusta*, the locust, is the textbook **gregarious pest** — it swarms and devastates crops. And *Limulus*, the king crab, is a **living fossil**.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 9, src: '',
      alt: 'The three-part body of an arthropod — head, thorax and abdomen — enclosed in a jointed chitinous exoskeleton',
      caption: '📸 Tap each part of the arthropod body plan',
      generation_prompt: "Scientific textbook illustration of a generalised arthropod body plan (insect-like), shown from the side. Flat 2D educational diagram on a dark background (#0a0a0a near-black). The body is clearly divided into three regions: head (bearing a pair of antennae and a pair of large compound eyes), thorax (with three pairs of jointed, multi-segmented walking legs attached), and abdomen (a segmented posterior region without walking legs). The exoskeleton rendered with a hard, faceted outer texture in tan/brown to suggest chitin. A small cutaway inset near the thorax-abdomen boundary shows internal branching tracheal tubes leading to a small spiracle opening on the body surface. Clean white outlines, biologically accurate proportions, pink undertones for the soft internal tissue visible in the cutaway, thin white leader lines but NO baked-in text labels. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.14, y: 0.42, label: 'Head', icon: 'circle',
          detail: 'Carries the **antennae** and **eyes** — both compound and simple types occur across the phylum, alongside **statocysts** for balance.' },
        { id: uuid(), x: 0.40, y: 0.52, label: 'Thorax', icon: 'circle',
          detail: 'The middle body region. The **jointed appendages** used for walking or swimming attach here.' },
        { id: uuid(), x: 0.72, y: 0.50, label: 'Abdomen', icon: 'circle',
          detail: 'The posterior region of the body, still visibly **segmented**, usually without walking legs.' },
        { id: uuid(), x: 0.42, y: 0.80, label: 'Jointed appendage', icon: 'circle',
          detail: 'A limb that bends at multiple points — *arthros* (joint) + *poda* (appendage) is the origin of the phylum name **Arthropoda**.' },
        { id: uuid(), x: 0.55, y: 0.20, label: 'Chitinous exoskeleton', icon: 'circle',
          detail: 'A hard, external, **non-living covering** that encloses the whole body — the feature that gives the phylum its armour.' },
        { id: uuid(), x: 0.60, y: 0.66, label: 'Tracheal system', icon: 'circle',
          detail: 'One of several respiratory options in this phylum — others use **gills, book gills, or book lungs** — but many arthropods breathe through this branching network of air tubes opening to the surface.' },
      ],
    },
    {
      id: uuid(), type: 'comparison_card', order: 10, title: 'Annelida vs Arthropoda',
      columns: [
        { heading: 'Annelida', points: [
          'No hard exoskeleton — a soft body wall marked into repeating rings (metameres)',
          'Closed circulatory system — blood stays inside vessels (arteries, veins, capillaries)',
          'Excretion by nephridia, one pair per segment',
          'Examples: Nereis, Pheretima (earthworm), Hirudinaria (leech)',
        ] },
        { heading: 'Arthropoda', points: [
          'Hard chitinous exoskeleton covering head, thorax and abdomen',
          'Open circulatory system — blood pumped into body spaces, directly bathes tissues',
          'Excretion by malpighian tubules',
          'Examples: Apis (honey bee), Bombyx (silkworm), Anopheles (mosquito), Limulus (king crab)',
        ] },
      ],
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember', title: 'The Facts You Cannot Get Wrong',
      markdown: "- **Annelida = \"little ring\"** (Latin *annulus*) — the body is **metamerically segmented**.\n- Annelid circulatory system is **closed**; arthropod circulatory system is **open**.\n- Annelid excretory organ = **nephridia**; arthropod excretory organ = **malpighian tubules**.\n- *Nereis* is **dioecious**; earthworms and leeches are **monoecious**.\n- **Arthropoda is the largest phylum of Animalia** — over two-thirds of all named species on Earth.\n- Arthropod body = **head, thorax, abdomen**, all carrying **jointed appendages**.",
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Why Arthropoda is the biggest phylum:** the reasoning follows straight from the two features on this page — a **jointed exoskeleton** protects the body while still allowing free movement at every joint. That combination let arthropods exploit an enormous range of habitats and lifestyles — land, water, air, as parasites, as predators — that a soft-bodied animal can't manage. More adaptable body plan → more niches filled → more species. NCERT's own exercise questions ask this without giving you the answer verbatim, so keep the reasoning ready.\n\n**Nephridia vs malpighian tubules — the trap NEET repeats:** Annelida excretes through **nephridia**; Arthropoda excretes through **malpighian tubules**. Quick anchor: the phylum with the harder body (the exoskeleton) is also the one that needed a completely different excretory organ — malpighian tubules go with the exoskeleton, nephridia go with the soft segmented body.\n\n**Classic NEET question:** \"Which of the following has an open circulatory system?\" → any arthropod (*Apis*, *Bombyx*, *Locusta*...), never the earthworm — the earthworm's is closed.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'The name Annelida comes from the Latin word annulus, meaning:',
          options: ['Little ring', 'Jointed leg', 'Soft worm', 'Segmented shell'],
          correct_index: 0,
          explanation: "Annulus means \"little ring,\" describing the annelid body's distinct metameric segmentation. \"Jointed leg\" describes Arthropoda's own name origin (arthros-poda), not Annelida; \"soft worm\" and \"segmented shell\" aren't the actual Latin meaning.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Nereis uses paired lateral appendages on each segment to swim. What are these called?',
          options: ['Parapodia', 'Malpighian tubules', 'Statocysts', 'Nephridia'],
          correct_index: 0,
          explanation: "Parapodia are the paddle-like lateral appendages Nereis uses for swimming. Malpighian tubules and statocysts belong to Arthropoda, not Annelida; nephridia are Annelida's excretory organ, not a swimming structure.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "Which of these is Arthropoda's excretory organ — not to be confused with Annelida's or Platyhelminthes' equivalents?",
          options: ['Nephridia', 'Malpighian tubules', 'Flame cells', 'Book lungs'],
          correct_index: 1,
          explanation: "Malpighian tubules are Arthropoda's excretory organ. Nephridia belong to Annelida, flame cells belong to Platyhelminthes — both are excretory organs from other phyla in this chapter, which is exactly why they're tempting. Book lungs are a respiratory organ in some arthropods, not an excretory one.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Arthropoda holds over two-thirds of all named species on Earth. Which combination of features from this page best explains that success?',
          options: [
            'A jointed exoskeleton that protects the body while still allowing free movement at every joint, letting the phylum adapt to an enormous range of habitats and lifestyles',
            'An open circulatory system, which lets blood reach every part of the body faster than in any other phylum',
            'A completely soft, unjointed body that can squeeze into any space',
            'Monoecious reproduction, so every individual can reproduce without needing a partner',
          ],
          correct_index: 0,
          explanation: "The exoskeleton plus jointed appendages together give protection and free movement at once, which let arthropods colonise land, water and air in huge variety — that's the reasoning behind the species count. An open circulatory system and mostly-dioecious reproduction are real arthropod features, but neither explains species diversity; and a soft, unjointed body is the opposite of an arthropod's actual design (that describes older phyla, not Arthropoda).",
          difficulty_level: 3,
        },
      ],
    },
  ],
};

// Bridge to the next page: Annelida and Arthropoda both reached the organ-system level
// with a true coelom, but neither has a hard shell built from calcium. Mollusca, up next,
// takes a completely different route — a soft body wrapped in a calcareous shell, moved
// by a single muscular foot.
