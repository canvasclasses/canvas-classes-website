'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'platyhelminthes-and-aschelminthes',
  title: 'Platyhelminthes and Aschelminthes',
  subtitle: "Two worm phyla NEET loves to swap. One has no body cavity at all. The other has a real — if incomplete — one. Here's how to tell a flatworm from a roundworm without hesitating.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['animal-kingdom', 'platyhelminthes', 'aschelminthes'],
  glossary: [
    { term: 'endoparasite', definition: 'An organism that lives inside the body of its host. Most Platyhelminthes are endoparasites found in animals, including human beings.' },
    { term: 'acoelomate', definition: 'Having no body cavity at all between the gut and the body wall. Platyhelminthes (flatworms) are acoelomate, with only organ-level body organisation.' },
    { term: 'pseudocoelomate', definition: 'Having a false body cavity. Aschelminthes (roundworms) are pseudocoelomate, with organ-system level body organisation.' },
    { term: 'flame cells', definition: 'Specialised cells found in Platyhelminthes that help in osmoregulation and excretion.' },
    { term: 'dioecious', definition: 'Having separate sexes — males and females are distinct individuals. Aschelminthes (roundworms) are dioecious; Platyhelminthes are not.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark cross-section of a human intestine at dusk, showing the silhouette of a long flattened tapeworm coiled inside next to a slender cylindrical roundworm',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A dark, atmospheric interior cross-section view of a section of intestine at dusk-toned lighting, rendered as a soft illustrative silhouette rather than anything graphic or medical. On the left, a long, flat, ribbon-like tapeworm shape coils gently in the space. On the right, separated by soft shadow, a slender, smooth, cylindrical roundworm shape lies nearby. Both shown as quiet, non-grotesque silhouettes — the emphasis is on their two very different body shapes, flat ribbon versus round cylinder, not on gore or realism. Deep, muted lighting, dark naturalistic background throughout (#0a0a0a base tones), one soft warm glow source. Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Worms Built for a Life Inside You',
      markdown: "Most **Platyhelminthes** are **endoparasites found in animals, including human beings** — they spend their whole lives inside a host's body, not out in the open like a Ctenophore drifting in the sea. Some of them don't even bother with a gut of their own: they simply **absorb nutrients straight through their body surface**, taking whatever the host has already digested. Living inside another animal changes everything about a worm's body — and it's exactly why flatworms and roundworms look and work so differently from each other.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The next two phyla are both commonly called \"worms,\" and that single word is exactly what trips students up. **Platyhelminthes** (flatworms) and **Aschelminthes** (roundworms) share several features on paper — both are **bilaterally symmetrical** and **triploblastic** — but their body cavity, their level of organisation, and even their basic shape are built completely differently. Get these two straight and you've cleared one of NEET's most repeated mix-up questions.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Phylum Platyhelminthes — The Flatworms',
      objective: "By the end of this you can say why flatworms have no body cavity at all, and how a tapeworm survives without a gut.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Platyhelminthes get their common name directly from their shape: they have a **dorso-ventrally flattened body**, which is why they're called **flatworms**. Most of them are **endoparasites found in animals, including human beings** — living inside a host rather than free in the environment.\n\nIn terms of the six features you've been sorting animals by: flatworms are **bilaterally symmetrical**, **triploblastic**, and — this is the one students get wrong most often — **acoelomate**. That means they have **no body cavity at all** between the gut and the body wall. Their body organisation sits at the **organ level**.\n\nBecause many of them live as parasites, their bodies come equipped for it: **hooks and suckers are present in the parasitic forms**, letting them grip onto the host. Some flatworms take this a step further and **absorb nutrients from the host directly through their body surface** — skipping a digestive system altogether. To manage water balance and waste in a soft body like this, they rely on specialised cells called **flame cells**, which handle **osmoregulation and excretion**.\n\nOn reproduction: **sexes are not separate** in Platyhelminthes, **fertilisation is internal**, and **development passes through many larval stages** before the adult form appears. One flatworm is famous for a very different skill — **Planaria** has **high regeneration capacity**, able to regrow lost parts of its body. The two examples NEET expects you to know by name are **Taenia** (tapeworm) and **Fasciola** (liver fluke).",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A labelled tapeworm and liver fluke, showing their flattened bodies, anterior hooks and suckers',
      caption: '📸 Tap each dot to explore a Platyhelminthes body plan',
      generation_prompt: "Scientific textbook illustration of two Platyhelminthes examples side by side. Flat 2D educational diagram on a dark background (#0a0a0a near-black). On the left, a long ribbon-like tapeworm body, clearly dorso-ventrally flattened, with a small rounded head end bearing a ring of small hooks and a round sucker directly beneath it, the flat ribbon body extending downward. On the right, a separate, shorter leaf-shaped liver fluke body, also dorso-ventrally flattened, with a small sucker visible on its ventral surface. Both bodies coloured pink/magenta to signal animal soft tissue, with a few small pale star-shaped flame cells scattered faintly within the body outline of each worm. Clean white outlines, thin white leader lines, biologically accurate proportions, labels-free image (all labels added separately as hotspots). No photorealism, no cartoon, no gore, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.16, y: 0.10, label: 'Hooks', icon: 'circle',
          detail: 'Present at the head end in **parasitic forms**. They let the flatworm grip onto its host from the inside.' },
        { id: uuid(), x: 0.18, y: 0.24, label: 'Sucker', icon: 'circle',
          detail: 'A rounded attachment structure, present alongside hooks in parasitic Platyhelminthes, used to hold onto host tissue.' },
        { id: uuid(), x: 0.30, y: 0.60, label: 'Dorso-ventrally flattened body', icon: 'circle',
          detail: "The body is flattened top-to-bottom, giving Platyhelminthes their common name: **flatworms**." },
        { id: uuid(), x: 0.72, y: 0.45, label: 'Flame cells', icon: 'circle',
          detail: 'Specialised cells scattered through the body that handle **osmoregulation and excretion** — there is no separate excretory tube like in roundworms.' },
        { id: uuid(), x: 0.80, y: 0.65, label: 'Absorbs food through body surface', icon: 'circle',
          detail: 'Some Platyhelminthes have **no gut of their own** — they take nutrients from the host **directly through their body surface**.' },
      ],
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Phylum Aschelminthes — The Roundworms',
      objective: "By the end of this you can say why roundworms are pseudocoelomate, not acoelomate, and how their gut differs from a flatworm's.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Switch to Aschelminthes and the body shape changes immediately: the body is **circular in cross-section**, which is why the common name is **roundworms**. Unlike Platyhelminthes, which are mostly parasitic, Aschelminthes are a broader mix — they may be **free-living, aquatic, and terrestrial, or parasitic in plants and animals**.\n\nThis is the phylum where the coelom answer flips. Roundworms are **bilaterally symmetrical** and **triploblastic** just like flatworms, but they are **pseudocoelomate**, not acoelomate — they do have a body cavity, even if it isn't a true one. That extra cavity supports a step up in organisation: Aschelminthes have **organ-system level of body organisation**, one level above the flatworms' organ level.\n\nTheir digestive and excretory systems are built accordingly. The **alimentary canal is complete**, with a **well-developed muscular pharynx** — a real gut running through the body, not surface absorption. Waste leaves through a dedicated **excretory tube**, which removes it from the body cavity through an **excretory pore**.\n\nReproduction is the other place these two phyla split apart. In Aschelminthes, **sexes are separate** — they are **dioecious**, with males and females as distinct individuals, and **females are often longer than males**. **Fertilisation is internal**, and **development may be direct** (the young resemble the adult) **or indirect**. The three examples NEET expects by name are **Ascaris** (roundworm), **Wuchereria** (filaria worm), and **Ancylostoma** (hookworm).",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "Taenia (phylum Platyhelminthes) and Ascaris (phylum Aschelminthes) are both triploblastic and bilaterally symmetrical worms that live as parasites. A student concludes that since both are 'worms' with three germ layers, they must have the same type of body cavity. Is this correct?",
      options: [
        'Yes — being triploblastic automatically means an animal has a pseudocoelom, so both worms are pseudocoelomate',
        'No — Taenia is acoelomate with organ-level organisation, while Ascaris is pseudocoelomate with organ-system level organisation',
        'No — Taenia is coelomate while Ascaris is acoelomate, since flatworms are the more advanced phylum',
        'Yes — both are acoelomate, since neither phylum has evolved any kind of body cavity',
      ],
      correct_index: 1,
      reveal: "Being triploblastic says nothing about the coelom on its own — you have to check the phylum. Taenia belongs to Platyhelminthes, which are **acoelomate**: no body cavity at all, and only **organ-level** organisation. Ascaris belongs to Aschelminthes, which are **pseudocoelomate**, with a body cavity and **organ-system level** organisation. The third option swaps the two phyla's coelom types the wrong way round, and the fourth is wrong because Ascaris does have a pseudocoelom — it is not acoelomate.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'comparison_card', order: 9, title: 'Platyhelminthes vs Aschelminthes',
      columns: [
        {
          heading: 'Platyhelminthes (Flatworms)',
          points: [
            'Body shape: dorso-ventrally flattened, ribbon-like',
            'Coelom: acoelomate — no body cavity at all',
            'Organisation: organ level',
            'Digestion: some absorb food directly through the body surface; hooks and suckers in parasitic forms',
            'Sexes: not separate',
            'Examples: Taenia (tapeworm), Fasciola (liver fluke)',
          ],
        },
        {
          heading: 'Aschelminthes (Roundworms)',
          points: [
            'Body shape: circular in cross-section, cylindrical',
            'Coelom: pseudocoelomate — a false body cavity',
            'Organisation: organ-system level',
            'Digestion: complete alimentary canal with a muscular pharynx',
            'Sexes: separate (dioecious); females often longer than males',
            'Examples: Ascaris (roundworm), Wuchereria (filaria worm), Ancylostoma (hookworm)',
          ],
        },
      ],
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'Lock These In',
      markdown: "- **Platyhelminthes = acoelomate** (no body cavity), **organ level**. **Aschelminthes = pseudocoelomate**, **organ-system level**.\n- **Flatworm shape:** dorso-ventrally flattened. **Roundworm shape:** circular in cross-section.\n- **Flame cells** (Platyhelminthes) handle osmoregulation and excretion; Aschelminthes instead has an **excretory tube + excretory pore**.\n- **Sexes:** Platyhelminthes — not separate. Aschelminthes — separate (**dioecious**); females often longer.\n- **Examples:** Platyhelminthes → **Taenia, Fasciola**. Aschelminthes → **Ascaris, Wuchereria, Ancylostoma**.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The #1 trap — acoelomate vs pseudocoelomate:** Students often flip these. **Platyhelminthes (flatworms) are acoelomate** — no body cavity at all. **Aschelminthes (roundworms) are the ones that are truly pseudocoelomate.** If a question calls a flatworm 'pseudocoelomate,' that option is wrong every time.\n\n**Match the worm to its phylum:** NEET directly tests which named example belongs to which phylum.\n- Platyhelminthes: **Taenia** (tapeworm), **Fasciola** (liver fluke)\n- Aschelminthes: **Ascaris** (roundworm), **Wuchereria** (filaria worm), **Ancylostoma** (hookworm)\n\n**Classic NEET question:** \"Which of the following is a pseudocoelomate animal?\" → **Ascaris** (or any Aschelminthes example) — never Taenia or Fasciola, which are acoelomate.",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "You now have two phyla that look alike on the surface but split apart the moment you check the coelom. Next comes a phylum where the body cavity is a true coelom, and where segmentation shows up for the first time — Annelida.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Flatworms like Taenia and Fasciola belong to phylum Platyhelminthes because their bodies are:',
          options: ['Circular in cross-section', 'Dorso-ventrally flattened', 'Segmented into repeating rings', 'Radially symmetrical'],
          correct_index: 1,
          explanation: "Platyhelminthes get their common name 'flatworms' from being dorso-ventrally flattened. Circular in cross-section describes Aschelminthes (roundworms), segmented into rings describes Annelida, and radially symmetrical describes Ctenophora — none of those apply to flatworms.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'What is the level of body cavity organisation in Platyhelminthes?',
          options: ['Acoelomate', 'Pseudocoelomate', 'Coelomate', 'Diploblastic'],
          correct_index: 0,
          explanation: "Platyhelminthes have no body cavity at all — they are acoelomate, with organ-level organisation. Pseudocoelomate describes Aschelminthes, coelomate describes phyla with a true body cavity, and diploblastic describes the number of germ layers (Ctenophora), not the coelom.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which feature is true of Aschelminthes (roundworms) but NOT of Platyhelminthes (flatworms)?',
          options: ['Bilaterally symmetrical body', 'Triploblastic body plan', 'Sexes are separate (dioecious)', 'Organ level of body organisation'],
          correct_index: 2,
          explanation: "Aschelminthes are dioecious, with distinct males and females — Platyhelminthes are not. Both phyla are bilaterally symmetrical and triploblastic, so those don't distinguish them, and 'organ level of organisation' actually describes Platyhelminthes, not Aschelminthes, which is one level higher at organ-system level.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which organism and phylum pairing is correct for a hookworm?',
          options: ['Ancylostoma, phylum Aschelminthes', 'Taenia, phylum Platyhelminthes', 'Fasciola, phylum Platyhelminthes', 'Wuchereria, phylum Aschelminthes'],
          correct_index: 0,
          explanation: "The hookworm is Ancylostoma, in phylum Aschelminthes. Taenia is the tapeworm and Fasciola is the liver fluke — both correctly Platyhelminthes, but neither is the hookworm. Wuchereria is correctly in Aschelminthes too, but it is the filaria worm, not the hookworm.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
