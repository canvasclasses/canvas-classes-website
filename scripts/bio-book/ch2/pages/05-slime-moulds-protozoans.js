'use strict';
const { v4: uuid } = require('uuid');

const protozoaHotspots = [
  {
    id: uuid(), x: 0.16, y: 0.42, label: 'Amoeba (pseudopodia)', icon: 'circle',
    detail: "An **amoeboid protozoan**. It has no fixed shape — it pushes out blobs of its own body called **pseudopodia** ('false feet') to crawl forward and to wrap around and swallow its prey. Lives in fresh water, sea water, or moist soil.",
  },
  {
    id: uuid(), x: 0.5, y: 0.4, label: 'Paramoecium (cilia + gullet)', icon: 'circle',
    detail: "A **ciliated protozoan**, covered in thousands of tiny hairs called **cilia** that beat in coordinated rows to swim. The notch on its side is the **gullet** — a cavity opening to the surface into which the beating cilia steer water loaded with food.",
  },
  {
    id: uuid(), x: 0.82, y: 0.4, label: 'Flagellated protozoan (Trypanosoma)', icon: 'circle',
    detail: "A **flagellated protozoan**. Instead of many short cilia it moves with one or a few long whip-like **flagella**. The parasitic ones cause disease — *Trypanosoma* causes **sleeping sickness**.",
  },
  {
    id: uuid(), x: 0.5, y: 0.82, label: 'Slime-mould fruiting body', icon: 'circle',
    detail: "Not a protozoan — a **slime mould** in its reproductive stage. When conditions turn harsh, its crawling body forms upright **fruiting bodies** with **spores at their tips**. The spores have true walls, resist years of bad conditions, and blow away on air currents.",
  },
];

module.exports = {
  slug: 'slime-moulds-protozoans',
  title: 'Kingdom Protista II: Slime Moulds & Protozoans',
  subtitle: "A crawling body that turns into spore-tipped towers, and the four kinds of single-celled hunters — including the one that gives you malaria.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['protista', 'slime-moulds', 'protozoans', 'biological-classification'],
  glossary: [
    { term: 'plasmodium', definition: "The crawling, spreading mass a slime mould's body forms under suitable conditions — it can grow and spread over several feet while engulfing organic matter. (Not to be confused with Plasmodium, the malarial parasite.)" },
    { term: 'pseudopodia', definition: "'False feet' — temporary blob-like extensions of the body that amoeboid protozoans push out to move and to capture prey." },
    { term: 'gullet', definition: 'A cavity in ciliated protozoans that opens to the cell surface; beating cilia steer food-laden water into it.' },
    { term: 'sporozoan', definition: 'A protozoan group whose members have an infectious spore-like stage in their life cycle; includes Plasmodium, the malarial parasite.' },
    { term: 'saprophytic', definition: 'Feeding on dead and decaying organic matter rather than making food or hunting live prey.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dark forest floor at dusk with a slime mould creeping over a decaying log and single-celled protozoans suggested in a dewdrop',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A dark, damp forest floor at dusk: a decaying fallen log and a scatter of wet dead leaves in the foreground, with a faint pale-yellow slime mould creeping across the bark like a slow living film, sending up a few tiny stalked fruiting bodies catching a sliver of warm light. In a single dewdrop resting on a leaf, barely-visible silhouettes of single-celled organisms drift. Deep, moist, atmospheric lighting, one soft warm glow low on the horizon, dark naturalistic background throughout (#0a0a0a base tones). Painterly illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'One Cell, One Million Deaths',
      markdown: "The deadliest organism you will meet in this whole chapter is a single-celled protist you can't see. *Plasmodium* — the **malarial parasite** — is a sporozoan, and NCERT calls its effect on the human population **staggering**. No teeth, no claws, no brain: just one cell with an infectious spore-like stage in its life cycle, and it has shaped human history more than most predators ever have.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "**Slime moulds** are **saprophytic** protists — they live on dead and decaying matter rather than making their own food. Picture the slime-mould body as a slow-moving living film creeping along decaying twigs and fallen leaves, **engulfing organic material** as it goes. Under suitable conditions, that body gathers itself into a single mass called a **plasmodium**, which can grow and spread over **several feet** — a genuinely large thing made of what is basically one continuous blob.\n\nThen the weather turns against it, and the slime mould does something clever. During **unfavourable conditions**, the plasmodium stops crawling and **differentiates into fruiting bodies** — upright structures that carry **spores at their tips**. These spores are the survival trick: they have **true walls**, they are **extremely resistant**, and they can **survive for many years** even under harsh conditions, waiting. When they finally scatter, they are **dispersed by air currents** — which is how a slime mould that can't travel far on its own ends up colonising a new log across the forest.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Four Groups of Protozoans',
      objective: 'By the end of this you can match any protozoan to its group by how it moves — and name the example genus and disease NEET expects.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**All protozoans are heterotrophs** — they can't make their own food, so they live either as **predators** hunting other microbes or as **parasites** feeding off a host. They're believed to be **primitive relatives of animals**, which is a useful way to remember them: think of them as animal-like single cells. NCERT sorts them into **four groups**, and the cleanest way to tell the groups apart is to ask one question — *how does it move?*",
    },
    {
      id: uuid(), type: 'comparison_card', order: 5, title: 'The Four Protozoan Groups',
      columns: [
        {
          heading: 'Amoeboid',
          points: [
            'Moves & captures prey with **pseudopodia** (false feet)',
            'Lives in fresh water, sea water or moist soil',
            'Marine forms have **silica shells**',
            'Example: **Amoeba**',
            'Parasite example: **Entamoeba**',
          ],
        },
        {
          heading: 'Flagellated',
          points: [
            'Moves with **flagella** (long whip-like threads)',
            'Free-living **or** parasitic',
            'Example: **Trypanosoma**',
            'Disease: **sleeping sickness**',
          ],
        },
        {
          heading: 'Ciliated',
          points: [
            'Aquatic; swims with **thousands of cilia**',
            'Has a **gullet** (cavity) opening to the cell surface',
            'Coordinated cilia steer food-laden water into the gullet',
            'Example: **Paramoecium**',
          ],
        },
        {
          heading: 'Sporozoan',
          points: [
            'Has an **infectious spore-like stage** in its life cycle',
            'Diverse group',
            'Example: **Plasmodium** (malarial parasite)',
            'Disease: **malaria**',
          ],
        },
      ],
    },
    {
      id: uuid(), type: 'interactive_image', order: 6, src: '',
      alt: 'A gallery of protist forms — Amoeba, Paramoecium, a flagellated protozoan and a slime-mould fruiting body',
      caption: '📸 Tap each dot to explore how it moves and feeds',
      hotspots: protozoaHotspots,
      generation_prompt: "Scientific textbook illustration: a gallery of four protist forms arranged on a dark background (#0a0a0a near-black). Flat 2D educational diagram, clean white outlines, biologically accurate proportions, no baked-in text labels. TOP-LEFT: an amoeba, an irregular blob-shaped single cell with several rounded pseudopodia (false feet) bulging outward, a nucleus and food vacuoles inside, tinted faint pink. TOP-CENTRE: a paramoecium, a slipper-shaped single cell fully fringed with fine short cilia around its whole margin, with a clear oral groove / gullet notch on one side, tinted faint pink. TOP-RIGHT: a flagellated protozoan, an elongated tapering cell trailing one long whip-like flagellum, tinted faint pink. BOTTOM-CENTRE: a slime-mould fruiting body — a slender brown-tan stalk topped by a rounded spore-bearing capsule at its tip, on a small piece of decaying wood. Each organism clearly separated in its own quadrant of the frame. No photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "A biologist watches an unknown single-celled organism under a microscope. It is fringed all over with thousands of tiny beating hairs, and there is a distinct cavity on one side into which food-laden water is being swept. Which group does it belong to, and what is its likely example genus?",
      options: [
        'Amoeboid — it moves using pseudopodia, so the example is Amoeba',
        'Ciliated — the beating hairs are cilia and the cavity is the gullet, so the example is Paramoecium',
        'Flagellated — the hairs are short flagella, so the example is Trypanosoma',
        'Sporozoan — the cavity is where its infectious spores form, so the example is Plasmodium',
      ],
      correct_index: 1,
      reveal: "Thousands of short beating hairs = cilia, and a food-collecting cavity opening to the surface = the gullet — both are the signature of the ciliated protozoans, whose example is Paramoecium. Pseudopodia (amoeboid) are blobby false feet, not a fringe of hairs; flagella (flagellated) are one or a few long whips, not thousands of short hairs; and sporozoans are defined by an infectious spore-like stage in the life cycle, not by cilia or a gullet.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 8, variant: 'remember', title: 'The Five You Cannot Swap',
      markdown: "- **Amoeba** → moves with **pseudopodia** (amoeboid group).\n- **Entamoeba** → an amoeboid **parasite**.\n- **Trypanosoma** → flagellated → causes **sleeping sickness**.\n- **Paramoecium** → **cilia + gullet** (ciliated group).\n- **Plasmodium** → sporozoan → causes **malaria**.",
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Match the group → genus → disease.** This is a classic NEET match-the-column:\n**Amoeboid:** pseudopodia · *Amoeba* / *Entamoeba* (parasite) · no named disease in NCERT.\n**Flagellated:** flagella · *Trypanosoma* · **sleeping sickness**.\n**Ciliated:** cilia + gullet · *Paramoecium* · no named disease in NCERT.\n**Sporozoan:** infectious spore-like stage · *Plasmodium* · **malaria**.\n\n**Classic NEET question:** \"Sleeping sickness is caused by which protozoan?\" → *Trypanosoma* (a flagellated protozoan). Don't confuse it with *Plasmodium*, which causes malaria.\n\n**Watch the trap:** *plasmodium* (small p) is the crawling body of a **slime mould**; *Plasmodium* (capital P) is the **sporozoan** that causes malaria — two completely different things that examiners deliberately place near each other.",
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "That completes the protists — the mixed-bag kingdom of single-celled eukaryotes. Next we climb to **Kingdom Fungi**: the moulds, mushrooms and yeasts that, like slime moulds, live off decay, but do it with a body and a lifestyle all their own.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: "Which feature is used to distinguish slime moulds as a group of protists?",
          options: [
            'They are saprophytic, and under unfavourable conditions their plasmodium forms fruiting bodies bearing resistant spores',
            'They are autotrophic and photosynthesise using chlorophyll like green plants',
            'They are exclusively parasitic and cause sleeping sickness in humans',
            'They swim actively using thousands of coordinated cilia',
          ],
          correct_index: 0,
          explanation: "Slime moulds are saprophytic — they live on decaying matter — and their plasmodium differentiates into spore-bearing fruiting bodies when conditions turn harsh. They are not photosynthetic (that describes plants/some other protists), not the sleeping-sickness parasite (that's Trypanosoma), and cilia belong to ciliated protozoans, not slime moulds.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "Trypanosoma, the protozoan that causes sleeping sickness, belongs to which group and moves by which structure?",
          options: [
            'Ciliated protozoans; it moves using thousands of cilia',
            'Amoeboid protozoans; it moves using pseudopodia',
            'Flagellated protozoans; it moves using flagella',
            'Sporozoans; it moves using an infectious spore stage',
          ],
          correct_index: 2,
          explanation: "Trypanosoma is a flagellated protozoan that moves with flagella, and its parasitic form causes sleeping sickness. Cilia and the gullet belong to Paramoecium; pseudopodia belong to Amoeba; and the infectious spore-like stage defines sporozoans like Plasmodium, not Trypanosoma.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "Which pair correctly matches the amoeboid protozoans?",
          options: [
            'Move with flagella; Entamoeba is a free-living marine form',
            'Move and capture prey with pseudopodia; marine forms have silica shells and Entamoeba is a parasite',
            'Move with cilia into a gullet; Amoeba is the parasitic example',
            'Have an infectious spore-like stage; Plasmodium is the example',
          ],
          correct_index: 1,
          explanation: "Amoeboid protozoans move and capture prey with pseudopodia, their marine forms carry silica shells, and Entamoeba is a parasitic member. Flagella belong to the flagellated group; cilia + gullet belong to the ciliated group; and the infectious spore-like stage defines sporozoans — none of those describe the amoeboid group.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "In the slime-mould life cycle, what is the 'plasmodium' and why is it easily confused in exams?",
          options: [
            'It is the malarial parasite; it is confused with the slime mould because both live in water',
            'It is the crawling, spreading mass of the slime-mould body; it is confused with Plasmodium, the sporozoan that causes malaria',
            'It is the resistant spore of the slime mould; it is confused with the fruiting body it grows from',
            'It is the gullet of a ciliated protozoan; it is confused with the pseudopodium of an amoeba',
          ],
          correct_index: 1,
          explanation: "In slime moulds, the plasmodium is the aggregated crawling body that can spread over several feet. Written with a capital P, Plasmodium is instead the sporozoan malarial parasite — same-sounding name, entirely different organism, which is exactly the trap examiners set. It is not a spore, not a gullet, and not the malarial parasite itself.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
