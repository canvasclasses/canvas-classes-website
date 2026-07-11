'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'algae-features-reproduction',
  title: 'Algae I: What Algae Are & How They Reproduce',
  subtitle: "Simple green threads in a pond, glassy strands, and hundred-metre kelps are all algae — chlorophyll-bearing, mostly aquatic bodies that fix half the planet's carbon and reproduce in three tidy ways.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['plant-kingdom', 'algae', 'isogamous', 'anisogamous', 'oogamous', 'economic-importance'],
  glossary: [
    { term: 'thalloid', definition: 'Having a simple plant body (a thallus) that is not divided into true roots, stem and leaves. The body of an alga is thalloid.' },
    { term: 'zoospore', definition: 'The most common asexual spore of algae — a flagellated, motile spore that swims off and germinates into a new plant.' },
    { term: 'isogamous', definition: 'Sexual reproduction in which the two fusing gametes are similar in size. They may be flagellated (as in Ulothrix) or non-flagellated (as in Spirogyra).' },
    { term: 'anisogamous', definition: 'Sexual reproduction in which the two fusing gametes are dissimilar in size, as in species of Eudorina.' },
    { term: 'oogamous', definition: 'Sexual reproduction in which a large, non-motile (static) female gamete fuses with a smaller, motile male gamete, as in Volvox and Fucus.' },
    { term: 'hydrocolloid', definition: 'A water-holding substance obtained from certain marine algae and used commercially — for example algin from brown algae and carrageen from red algae.' },
    { term: 'agar', definition: 'A commercial product obtained from the red algae Gelidium and Gracilaria, used to grow microbes and in preparing ice-creams and jellies.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dusk underwater scene where fine green threads, a small round green colony, and a towering strand of seaweed share the same still water',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A calm underwater scene at dusk, looking through still greenish water toward a soft, warm light filtering down from the surface above. In the foreground, fine green filamentous threads drift and tangle gently; nearby a single small round green colony floats like a delicate sphere; and rising from the shadowy floor toward the far side, one tall ribbon-like strand of seaweed reaches upward almost out of frame, suggesting great size. None of them a labelled subject — just quiet plant-like life of very different shapes sharing one body of water. Deep dusk lighting, a single warm glow high in the water tying the scene together. Painterly, atmospheric illustration style, dark background tones throughout (#0a0a0a base), no text, no labels, no diagram elements.",
    },
    // ── fun_fact ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Green Speck an Astronaut Eats',
      markdown: "Somewhere on a spacecraft, a traveller may be eating an alga. **Chlorella** is a tiny single-celled alga that happens to be **rich in proteins**, so it is used as a **food supplement — even by space travellers**. And that's the small end of the story: taken together, algae quietly carry out **at least half of all the carbon dioxide fixation on Earth** through photosynthesis. A single green speck you'd need a microscope to see, and a green blanket over half the planet's carbon budget — same group of organisms.",
    },
    // ── what algae are ───────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Start with what an alga actually is. Algae are **chlorophyll-bearing** (so they're green and can photosynthesise), **simple**, **thalloid** (their body is a plain **thallus** — no true roots, stem or leaves), and **autotrophic** (they make their own food). Most of all they are **largely aquatic** — living in both **fresh water and the sea**.\n\nWater isn't their only home, though. They also turn up on **moist stones, soil and wood**, and some live locked in partnership with other organisms — with **fungi** they form **lichens**, and some even grow on **animals**, famously **on the fur of a sloth bear**.\n\nDon't let the word 'simple' fool you into picturing one shape. The **form and size of algae is highly variable**. Some are **colonial**, like the little rolling ball *Volvox*. Some are **filamentous**, fine threads like *Ulothrix* and *Spirogyra*. And a few marine forms — the **kelps** — grow into **massive plant bodies**. Pond scum and a giant seaweed are cousins.",
    },
    // ── heading: reproduction ────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Three Ways Algae Reproduce',
      objective: "By the end of this you can tell vegetative, asexual and sexual reproduction apart in algae — and split the sexual kind into isogamous, anisogamous and oogamous with the right example organism.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Algae reproduce by **three methods** — vegetative, asexual and sexual.\n\n**Vegetative reproduction** is the simplest: it happens by **fragmentation**. The body breaks into pieces, and **each fragment develops into a thallus** — a whole new alga. No spores, no gametes, just a broken-off bit growing up on its own.\n\n**Asexual reproduction** is by **spores**, and the **most common** kind is the **zoospore**. Zoospores are **flagellated (motile)** — they can swim — and **on germination they give rise to new plants**. Still just one parent, but now via a purpose-built swimming spore rather than a broken fragment.\n\n**Sexual reproduction** is the fusion of **two gametes**, and this is where algae get sorted into three named types based on how alike or unalike the two gametes are:\n\n- **Isogamous** — the two gametes are **similar in size**. They can be **flagellated and similar** (as in *Ulothrix*) or **non-flagellated (non-motile) but still similar in size** (as in *Spirogyra*).\n- **Anisogamous** — the two gametes are **dissimilar in size**, as in species of *Eudorina*.\n- **Oogamous** — fusion between **one large, non-motile (static) female gamete** and a **smaller, motile male gamete**, as in *Volvox* and *Fucus*.\n\nA quick way to hold it: *iso* = same, *aniso* = not the same size, *oogamous* = a big still egg meets a small swimming sperm.",
    },
    // ── interactive image: sexual reproduction types ─────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Four panels showing algal reproduction: isogamous, anisogamous and oogamous gamete fusion, plus a motile zoospore',
      caption: '📸 Tap each dot to compare the three kinds of gamete fusion — and the asexual zoospore',
      generation_prompt: "Scientific textbook illustration comparing types of reproduction in algae. Flat 2D educational diagram on a dark background (#0a0a0a near-black), laid out as four clean panels in a row, clean white outlines throughout. Panel 1 (isogamous): two identical small round gametes of exactly the same size, each with two thin flagella, drawn approaching each other to fuse — clearly equal. Panel 2 (anisogamous): two gametes of clearly different sizes, one distinctly larger than the other, both with flagella, approaching to fuse. Panel 3 (oogamous): one large round non-motile female gamete (an egg) shown static with no flagella, and one much smaller gamete with a single flagellum swimming toward it. Panel 4 (zoospore): a single pear-shaped motile spore with flagella at its narrow end, shown swimming away on its own (asexual, no fusion). Gametes and spores tinted soft green to read as algal cells. Biologically accurate relative sizes, no baked-in text labels, no photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.13, y: 0.5, label: 'Isogamous', icon: 'circle',
          detail: 'Two gametes **similar in size** fuse. They may be flagellated and similar (as in *Ulothrix*) or non-flagellated and non-motile but still similar in size (as in *Spirogyra*).' },
        { id: uuid(), x: 0.38, y: 0.5, label: 'Anisogamous', icon: 'circle',
          detail: 'Two gametes **dissimilar in size** fuse — one clearly larger than the other. Seen in species of *Eudorina*.' },
        { id: uuid(), x: 0.63, y: 0.5, label: 'Oogamous', icon: 'circle',
          detail: 'A **large, non-motile (static) female gamete** fuses with a **smaller, motile male gamete**. Seen in *Volvox* and *Fucus*.' },
        { id: uuid(), x: 0.88, y: 0.5, label: 'Zoospore', icon: 'circle',
          detail: 'The most common **asexual** spore — **flagellated and motile**. It swims off and, on germination, gives rise to a new plant. No gamete fusion is involved.' },
      ],
    },
    // ── mid-page reasoning check ─────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "In a certain alga, sexual reproduction happens when a big, motionless female cell stays put while a much smaller cell with a flagellum swims over and fuses with it. Which type of sexual reproduction is this, and which of these organisms is a genuine example of it?",
      options: [
        "Isogamous, as in Spirogyra — the gametes are non-motile so neither one moves",
        "Anisogamous, as in Eudorina — the two gametes are simply of different sizes",
        "Oogamous, as in Volvox — a large static female gamete fuses with a small motile male gamete",
        "Vegetative, as in kelps — the female body fragments and each piece grows into a new thallus",
      ],
      correct_index: 2,
      reveal: "A large, non-motile (static) female gamete plus a small, motile male gamete is the exact definition of **oogamous** reproduction, and NCERT's own examples of it are *Volvox* and *Fucus*. Anisogamous is the tempting trap — it's also about unequal gametes — but anisogamy only says the two gametes *differ in size* (as in *Eudorina*); it doesn't require one to be a large static egg and the other a small swimmer. Isogamy needs the gametes to be *similar* in size, and vegetative reproduction isn't about gametes at all — it's fragmentation.",
      difficulty_level: 3,
    },
    // ── heading: economic importance ─────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Why Algae Matter',
      objective: "By the end of this you can list what algae do for the planet and for us — from oxygen and food chains to agar, algin, carrageen and Chlorella.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Algae are useful to us in a surprising number of ways, and the planet-scale ones come first. **At least half of the total carbon dioxide fixation on Earth is carried out by algae** through photosynthesis. Because they photosynthesise, they also **raise the level of dissolved oxygen** in the water around them. And they are of **paramount importance as primary producers** of energy-rich compounds — they sit at the **base of the food cycles of all aquatic animals**. Take the algae out and the whole aquatic food web loses its foundation.\n\nNow the everyday uses. Around **70 species of marine algae are used as food**, including *Porphyra*, *Laminaria* and *Sargassum*. Certain marine **brown and red algae** make large amounts of **hydrocolloids** — water-holding substances used commercially: **algin comes from brown algae**, and **carrageen comes from red algae**. Another product, **agar**, is obtained from the red algae *Gelidium* and *Gracilaria*; it's used to **grow microbes** in the lab and to make **ice-creams and jellies**. And finally the astronaut's snack from the top of the page — **Chlorella**, a **unicellular, protein-rich** alga used as a **food supplement**.\n\nSo far we've treated algae as one big group. But NCERT splits them into **three main classes** — and the next page sorts them out by their pigments, stored food and cell walls.",
    },
    // ── remember ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'The Facts You Cannot Swap Around',
      markdown: "- **Isogamous = gametes similar in size** (*Ulothrix*, and *Spirogyra* where they're non-motile). **Anisogamous = dissimilar in size** (*Eudorina*). **Oogamous = large static female + small motile male** (*Volvox*, *Fucus*).\n- **Zoospore = the common asexual spore, flagellated and motile.** Vegetative reproduction = **fragmentation**.\n- **Algin → brown algae. Carrageen → red algae. Agar → *Gelidium* & *Gracilaria* (red algae).** Don't mix the source with the product.\n- **Chlorella** = unicellular, protein-rich, food supplement (space travellers). Food algae: *Porphyra*, *Laminaria*, *Sargassum*.",
    },
    // ── exam_tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Match the example to the fusion type:** NEET loves 'give an example of isogamous / anisogamous / oogamous reproduction.' Lock these: *Ulothrix* & *Spirogyra* → isogamous, *Eudorina* → anisogamous, *Volvox* & *Fucus* → oogamous.\n\n**Algin vs carrageen vs agar:** a near-guaranteed source-matching question. **Algin = brown algae, carrageen = red algae, agar = *Gelidium* and *Gracilaria*.**\n\n**Chlorella:** remember it as the protein-rich food supplement used by space travellers.\n\n**The planet fact, in NCERT's own words:** algae carry out **at least half of the total CO2 fixation on Earth**, and diatoms aside, they are paramount **primary producers**.\n\n**Classic NEET question:** \"Fusion of one large non-motile female gamete with a smaller motile male gamete is termed?\" → **Oogamous** (e.g. *Volvox*, *Fucus*). Don't answer anisogamous — that only means unequal-sized gametes.",
    },
    // ── inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which set of features correctly describes algae?',
          options: [
            'Chlorophyll-bearing, simple, thalloid, autotrophic and largely aquatic',
            'Non-green, with true roots, stems and leaves, and strictly terrestrial',
            'Heterotrophic, single-celled only, and found only in the deep sea',
            'Fungus-like, lacking chlorophyll, and dependent on a host for food',
          ],
          correct_index: 0,
          explanation: "NCERT defines algae as chlorophyll-bearing, simple, thalloid, autotrophic and largely aquatic. They have no true roots/stems/leaves (they're thalloid, not the second option's description), they make their own food (autotrophic, not heterotrophic), and their form ranges from colonial to filamentous to giant kelps — not single-celled only.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "The two gametes that fuse in Spirogyra are similar in size but non-flagellated and non-motile. This kind of sexual reproduction is called:",
          options: [
            'Anisogamous',
            'Oogamous',
            'Isogamous',
            'Vegetative',
          ],
          correct_index: 2,
          explanation: "Similar-sized gametes make it isogamous — whether they are flagellated (as in Ulothrix) or non-motile (as in Spirogyra). Anisogamous needs the gametes to differ in size (Eudorina); oogamous needs a large static female plus a small motile male (Volvox, Fucus); and vegetative reproduction is fragmentation, not gamete fusion at all.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which product is correctly matched to its source alga?',
          options: [
            'Algin — obtained from red algae',
            'Carrageen — obtained from brown algae',
            'Agar — obtained from the red algae Gelidium and Gracilaria',
            'Agar — obtained from Chlorella',
          ],
          correct_index: 2,
          explanation: "Agar comes from the red algae Gelidium and Gracilaria and is used to grow microbes and make ice-creams and jellies. The other options swap the sources: algin comes from brown algae (not red) and carrageen from red algae (not brown), while Chlorella is a protein-rich food supplement, not a source of agar.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which statement about the role of algae is supported by NCERT?',
          options: [
            'Algae carry out at least half of the total carbon dioxide fixation on Earth and act as primary producers in aquatic food cycles',
            'Algae mainly consume oxygen and lower the dissolved oxygen of their surroundings',
            'Algae are only decomposers and play no part in aquatic food chains',
            'All algae are microscopic and none is ever used as human food',
          ],
          correct_index: 0,
          explanation: "NCERT states that at least half of Earth's CO2 fixation is done by algae, that being photosynthetic they raise dissolved oxygen, and that they are paramount primary producers at the base of aquatic food cycles. So they add oxygen (not consume it), are producers (not decomposers), and about 70 marine species — Porphyra, Laminaria, Sargassum — are eaten by humans.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
