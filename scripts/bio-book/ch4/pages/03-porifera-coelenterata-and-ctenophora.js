'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'porifera-coelenterata-and-ctenophora',
  title: 'Porifera, Coelenterata, and Ctenophora',
  subtitle: "Three of the simplest body plans in the animal kingdom, all built around water — a sponge that pumps it, a jellyfish that stings with it, and a comb jelly that glides through it on rows of beating cilia.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['animal-kingdom', 'porifera', 'coelenterata', 'ctenophora'],
  glossary: [
    { term: 'ostia', definition: "Minute pores in a sponge's body wall through which water enters the body." },
    { term: 'spongocoel', definition: "The central cavity of a sponge that water reaches after passing in through the ostia, on its way out through the osculum." },
    { term: 'osculum', definition: "The single opening through which water finally leaves a sponge, after entering through many ostia and passing through the spongocoel." },
    { term: 'choanocytes', definition: "Collar cells that line the spongocoel and the canals of a sponge, keeping the water current moving through the body." },
    { term: 'cnidoblast (cnidocyte)', definition: "A stinging cell present on the tentacles and body of a cnidarian, containing a capsule called a nematocyst. Used for anchorage, defence, and capturing prey." },
    { term: 'gastrovascular cavity', definition: "The single central body cavity of a cnidarian, opening to the outside only through the mouth on the hypostome. Digestion happens here." },
    { term: 'polyp', definition: "The sessile, cylindrical body form of a cnidarian — for example, Hydra and Adamsia." },
    { term: 'medusa', definition: "The free-swimming, umbrella-shaped body form of a cnidarian — for example, Aurelia (jellyfish)." },
    { term: 'metagenesis', definition: "Alternation of generations, seen in cnidarians that show both body forms: polyps produce medusae asexually, and medusae form polyps sexually, e.g. Obelia." },
    { term: 'comb plates', definition: "Eight external rows of ciliated plates on a ctenophore's body, used for locomotion." },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark undersea scene with a vase-shaped sponge on a rock, a translucent jellyfish drifting above it, and a glowing comb jelly nearby',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A calm undersea scene at dusk, viewed close to the seafloor: a vase-shaped sponge attached to a rock in the foreground, a translucent umbrella-shaped jellyfish drifting a short distance above it with trailing tentacles, and off to one side a small oval comb jelly with faint bioluminescent shimmer running along its body in thin glowing lines. Soft shafts of dim light filter down from the surface far above. Painterly, atmospheric illustration style, dark naturalistic background throughout (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Cousins That Are Not Actually Cousins',
      markdown: "Look at a jellyfish and a comb jelly side by side and they seem like near-twins — both are jelly-soft, both drift through open water, both are see-through. Yet they belong to **two completely different phyla**. One stings you the instant it brushes your skin; the other has no stinging cells at all and moves using rows of beating hair-like plates instead. NEET loves this exact mix-up, so by the end of this page you'll be able to tell them apart in one glance.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The chapter opener promised you a handful of yes/no questions that sort every animal — **level of organisation, symmetry, germ layers**, and more. **Porifera, Coelenterata, and Ctenophora** are the three simplest answers you'll meet to those questions. All three are **aquatic and mostly marine**, and none of them has built an internal body cavity or true organs yet — that upgrade comes later in the chapter. What separates these three from each other is exactly how their body is put together, and that's what this page walks through, phylum by phylum.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Phylum Porifera — Living Water Pumps',
      objective: "By the end of this you can trace a drop of water through a sponge's canal system and name every structure it passes on the way.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Porifera** are commonly known as **sponges**. They are **generally marine** and **mostly asymmetrical** — unlike almost everything else you'll meet in this chapter, a sponge has no real body symmetry at all. They are **primitive multicellular animals** with only a **cellular level of organisation** — their cells work more or less independently rather than being organised into true tissues.\n\nWhat defines a sponge is its **water transport or canal system**. Water enters through **minute pores called ostia** in the body wall, into a **central cavity called the spongocoel**, and then goes back out through the **osculum**. This one pathway does three jobs at once: **food gathering, respiratory exchange, and removal of waste**. **Choanocytes (collar cells) line the spongocoel and the canals** and keep that current moving. **Digestion is intracellular**, and the body is held up by a skeleton made of **spicules or spongin fibres**.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: "Cross-section of a sponge showing ostia, spongocoel, osculum, choanocytes lining the canals, and the spicule skeleton",
      caption: '📸 Tap each dot to follow a drop of water through the sponge',
      generation_prompt: "Scientific textbook illustration of a sponge (Porifera) cross-section. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A tan/pink vase-shaped sponge body cut away to reveal its interior structure: many small pores (ostia) dotted across the outer body wall, thin canals leading inward from each pore, all converging into one large central cavity (spongocoel) running up the middle of the body, and a single wide opening at the very top (osculum) where the canal system exits. Small dot-like collar cells (choanocytes) shown lining the inner wall of the spongocoel and canals. Fine needle-like spicules embedded through the body wall as pale supporting structures. Small upward-pointing arrows inside the canals and spongocoel indicating the direction of water flow from ostia toward the osculum. Clean white outlines, thin white leader lines, biologically accurate proportions, pink/magenta for the soft animal tissue. No text or labels baked into the image itself. No photorealism, no cartoon, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.20, y: 0.55, label: 'Ostia', icon: 'circle',
          detail: "The **minute pores** in the sponge's body wall. Water enters the whole canal system here — this is the very first stop." },
        { id: uuid(), x: 0.50, y: 0.55, label: 'Spongocoel', icon: 'circle',
          detail: "The **central cavity** water reaches after entering through the ostia. It sits between the ostia and the osculum on the water's path out." },
        { id: uuid(), x: 0.50, y: 0.12, label: 'Osculum', icon: 'circle',
          detail: "The **single large opening** at the top of the sponge through which water finally leaves, after entering through many ostia." },
        { id: uuid(), x: 0.42, y: 0.62, label: 'Choanocytes', icon: 'circle',
          detail: "**Collar cells** that **line the spongocoel and the canals**, keeping the water current flowing through the body." },
        { id: uuid(), x: 0.72, y: 0.70, label: 'Spicules', icon: 'circle',
          detail: "Needle-like skeletal pieces (or, in some sponges, **spongin fibres**) embedded in the body wall that **support** the sponge." },
      ],
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Sexes are **not separate** in sponges — they are **hermaphrodite**, meaning **eggs and sperm are produced by the same individual**. Sponges reproduce **asexually by fragmentation** and **sexually by formation of gametes**. **Fertilisation is internal**, and **development is indirect**, passing through a **larval stage that is morphologically distinct from the adult** — the young sponge does not simply look like a miniature version of the grown one.\n\n**Examples:** *Sycon* (*Scypha*), *Spongilla* (the fresh water sponge — a rare exception to 'mostly marine'), and *Euspongia* (the bath sponge).",
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Phylum Coelenterata (Cnidaria) — the Stinging-Cell Kingdom',
      objective: "By the end of this you can explain what a cnidoblast does, and tell a polyp from a medusa on sight.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "**Coelenterates** are **aquatic, mostly marine**, either **sessile or free-swimming**, and **radially symmetrical**. The name **cnidaria** itself comes from the **cnidoblasts (cnidocytes)** — cells carrying stinging capsules called **nematocysts** — present on the **tentacles and the body**. Cnidoblasts are used for **anchorage, defence, and capturing prey**.\n\nUnlike sponges, cnidarians have moved up to a **tissue level of organisation** and are **diploblastic** (two germ layers). Instead of a canal system, they have a single **central gastrovascular cavity with one opening** — the **mouth**, sitting on a raised **hypostome**. **Digestion is both extracellular and intracellular**. A few cnidarians, such as **corals**, even build a **skeleton made of calcium carbonate**.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 9, title: 'Polyp vs Medusa — The Two Cnidarian Body Forms',
      columns: [
        { heading: 'Polyp', points: ['Sessile — fixed in one place', 'Cylindrical body shape', 'Examples: Hydra, Adamsia (sea anemone)', 'In species with metagenesis, produces medusae asexually'] },
        { heading: 'Medusa', points: ['Free-swimming', 'Umbrella-shaped body', 'Examples: Aurelia, jellyfish in general', 'In species with metagenesis, forms polyps sexually'] },
      ],
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "Some cnidarians exist in **both** body forms across their life — these show **alternation of generations, called metagenesis**: the **polyp produces medusae asexually**, and the **medusa forms polyps sexually**, as in ***Obelia***.\n\n**Examples:** *Physalia* (Portuguese man-of-war), *Adamsia* (sea anemone), *Pennatula* (sea-pen), *Gorgonia* (sea-fan), and *Meandrina* (brain coral).",
    },
    {
      id: uuid(), type: 'heading', order: 11, level: 2,
      text: 'Phylum Ctenophora — the Comb Jellies',
      objective: "By the end of this you can list the one structure that proves an animal is a ctenophore and not a coelenterate.",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "**Ctenophores**, commonly known as **sea walnuts or comb jellies**, are **exclusively marine**, **radially symmetrical**, **diploblastic** organisms with a **tissue level of organisation** — on paper, that sounds identical to Coelenterata so far. The difference is on the body itself: a ctenophore's body carries **eight external rows of ciliated comb plates**, which is what actually **helps it move**. There are no cnidoblasts, no nematocysts, no stinging cells anywhere on a ctenophore.\n\n**Digestion is both extracellular and intracellular**, just like in coelenterates. What ctenophores are best known for is **bioluminescence** — **the property of a living organism to emit light** — which is **well-marked** in this group. **Sexes are not separate**, and **reproduction takes place only by sexual means**, with **external fertilisation and indirect development**.\n\n**Examples:** *Pleurobrachia* and *Ctenoplana*.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 13, reasoning_type: 'logical',
      prompt: "A marine field guide describes an animal pulled up from the open ocean: transparent body, radially symmetrical, no tentacles with stinging cells anywhere, moves by beating eight rows of comb-like ciliated plates, and gives off a faint glow at night. Which phylum does this animal belong to, and what single feature rules out the phylum it's most often confused with?",
      options: [
        "Ctenophora — the eight rows of comb plates for locomotion and the total absence of cnidoblasts rule out Coelenterata, even though both phyla are radially symmetrical and diploblastic",
        "Coelenterata — radial symmetry and a diploblastic body are enough on their own to confirm cnidaria, regardless of the comb plates",
        "Porifera — an asymmetrical animal that filters water through ostia is always the safest match for any simple marine organism",
        "Coelenterata — bioluminescence is a defining cnidarian trait, so any marine animal that glows must belong to Coelenterata",
      ],
      correct_index: 0,
      reveal: "Porifera, Coelenterata, and Ctenophora all overlap on paper — coelenterates and ctenophores are BOTH radially symmetrical, diploblastic, and tissue-level, which is exactly why they get confused. The tie-breaker is structural, not the body plan: **cnidoblasts with nematocysts belong only to Coelenterata**, and **eight rows of ciliated comb plates belong only to Ctenophora**. This animal has comb plates and no stinging cells at all, so it is a ctenophore. Radial symmetry and diploblasty (option B) fit both phyla, so neither confirms Coelenterata alone. The animal is described as radially symmetrical, not asymmetrical, so it isn't a sponge (option C) — and Porifera has no ostia-and-water-filtering resemblance to this description anyway. Bioluminescence (option D) is well-marked in ctenophores specifically, not a defining cnidarian trait, so it doesn't point to Coelenterata either.",
      difficulty_level: 3,
    },
    {
      id: uuid(), type: 'callout', order: 14, variant: 'remember', title: 'Lock These In',
      markdown: "- **Porifera:** asymmetrical, cellular level, water canal system **ostia → spongocoel → osculum**, choanocytes line the spongocoel/canals, digestion intracellular, skeleton of spicules/spongin, hermaphrodite.\n- **Coelenterata:** radially symmetrical, tissue level, diploblastic, **cnidoblasts/nematocysts** for sting/defence/prey capture, single-opening **gastrovascular cavity**, digestion extracellular + intracellular.\n- **Polyp** = sessile, cylindrical (Hydra, Adamsia). **Medusa** = free-swimming, umbrella-shaped (Aurelia).\n- **Metagenesis** = polyp → medusa asexually, medusa → polyp sexually, e.g. *Obelia*.\n- **Ctenophora:** exclusively marine, radially symmetrical, diploblastic, tissue level — but moves via **8 rows of comb plates**, has **no cnidoblasts**, and shows well-marked **bioluminescence**.",
    },
    {
      id: uuid(), type: 'callout', order: 15, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The coelenterate-vs-ctenophore trap:** both phyla are radially symmetrical, diploblastic, and tissue-level — NEET exploits exactly that overlap. The only reliable tie-breaker: **cnidoblasts/nematocysts = Coelenterata only**; **eight rows of ciliated comb plates = Ctenophora only**. If a question mentions stinging cells, it's a coelenterate. If it mentions comb plates, it's a ctenophore.\n\n**Porifera's canal-system vocabulary:** NEET asks the water pathway directly and in order — **ostia (in) → spongocoel (central cavity) → osculum (out)**. Choanocytes line the spongocoel and canals, not the ostia or osculum themselves.\n\n**Classic NEET question:** \"Which cnidarian exhibits metagenesis (alternation of generations)?\" → ***Obelia*** — polyp produces medusa asexually, medusa forms polyp sexually.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: "In a sponge's water canal system, what is the correct order in which water passes through the body?",
          options: [
            'Ostia → spongocoel → osculum',
            'Osculum → spongocoel → ostia',
            'Ostia → osculum → spongocoel',
            'Spongocoel → ostia → osculum',
          ],
          correct_index: 0,
          explanation: "Water enters through the many small ostia, collects in the central spongocoel, and exits through the single osculum. Any order that puts the osculum before the spongocoel, or skips the spongocoel entirely, reverses or breaks the actual pathway NCERT describes.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Which of these correctly describes the medusa body form in Coelenterata?',
          options: [
            'Sessile and cylindrical, like Hydra or Adamsia',
            'Umbrella-shaped and free-swimming, like Aurelia',
            'Asymmetrical with a cellular level of organisation, like a sponge',
            'Moves using eight rows of ciliated comb plates, like a ctenophore',
          ],
          correct_index: 1,
          explanation: "Medusa is the free-swimming, umbrella-shaped cnidarian form, seen in Aurelia and jellyfish generally. Sessile-and-cylindrical describes the polyp form instead; asymmetrical-cellular is Porifera, not Coelenterata at all; and comb plates belong only to Ctenophora, a different phylum entirely.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'In a cnidarian such as Obelia that shows metagenesis (alternation of generations), what actually happens?',
          options: [
            'Polyps produce medusae asexually, and medusae form polyps sexually',
            'Medusae produce polyps asexually, and polyps form medusae sexually',
            'The same individual reshapes itself from polyp to medusa depending on the season',
            'Only the medusa stage reproduces; the polyp stage never reproduces at all',
          ],
          correct_index: 0,
          explanation: "NCERT's definition of metagenesis runs one specific direction: the polyp produces medusae asexually, and the medusa produces polyps sexually. Swapping which stage does which, claiming one animal physically morphs between forms, or saying the polyp stage never reproduces all contradict that stated cycle.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'How do ctenophores reproduce?',
          options: [
            'By fragmentation only, since they have no sex organs',
            'Only by sexual means, with external fertilisation and indirect development',
            'Only by sexual means, but with internal fertilisation and direct development',
            'By both asexual budding and sexual means, exactly like most coelenterates',
          ],
          correct_index: 1,
          explanation: "NCERT states ctenophore sexes are not separate, reproduction is only sexual, and fertilisation is external with indirect development. Fragmentation is a Porifera trait, not a ctenophore one; internal fertilisation with direct development misstates both facts; and ctenophores don't reproduce asexually at all, so they don't match 'many coelenterates' with budding.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
