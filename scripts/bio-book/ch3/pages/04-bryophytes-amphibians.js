'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'bryophytes-amphibians',
  title: 'Bryophytes: Amphibians of the Plant Kingdom',
  subtitle: "Mosses and liverworts crept onto land but never let go of water — they still need a film of it just to reproduce. Here's how a plant that lives on rock still behaves like an amphibian.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['bryophytes', 'gametophyte', 'sporophyte', 'plant-succession', 'plant-kingdom'],
  glossary: [
    { term: 'gametophyte', definition: 'The haploid main plant body of a bryophyte. It is photosynthetic and produces the gametes (sex cells).' },
    { term: 'sporophyte', definition: 'The multicellular body that grows from the zygote. In bryophytes it stays attached to the gametophyte and draws its food from it; some of its cells undergo meiosis to make spores.' },
    { term: 'antheridium', definition: 'The multicellular male sex organ of a bryophyte. It produces biflagellate (two-tailed) antherozoids.' },
    { term: 'archegonium', definition: 'The multicellular female sex organ of a bryophyte. It is flask-shaped and produces a single egg.' },
    { term: 'antherozoid', definition: 'The male gamete of a bryophyte — a swimming cell with two flagella that must reach the egg through water.' },
    { term: 'rhizoid', definition: 'A unicellular or multicellular root-like thread that anchors a bryophyte to the surface it grows on. It is not a true root.' },
    { term: 'peat', definition: 'A partly decomposed, water-holding mass of moss (mainly Sphagnum) that has long been used as fuel and as packing material.' },
    { term: 'plant succession', definition: 'The gradual, step-by-step process by which one set of organisms colonises a bare area and prepares it for the plants that come after them.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A shaded, dripping rock face in the hills at dusk, cushioned with soft green moss and flat green liverworts, water beading everywhere',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A damp, shaded rock face in misty hill country at dusk: the dark stone is cushioned with soft green moss and flat, ribbon-like green liverworts hugging every wet surface, tiny beads of water clinging to them and trickling down the rock. A thin film of moisture glistens across the whole scene, and a fine mist hangs in the shaded gully. A single soft amber glow low on the horizon behind the hills. Painterly, atmospheric illustration style, dark naturalistic background throughout (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Plant That Still Needs to Swim',
      markdown: "A frog can walk around on dry land, but it has to return to water to lay eggs and breed. Bryophytes — the **mosses and liverworts** you see furring wet rocks and shaded hillsides — live exactly the same double life. They can grow in soil on land, but their sperm can only reach the egg by **swimming through a film of water**. That is why they are nicknamed the **amphibians of the plant kingdom**: rooted on land, but tied to water the moment they reproduce.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "**Bryophytes** are the various **mosses and liverworts** that grow commonly in **moist, shaded** spots — damp, humid corners of the hills, the shaded side of a wall, the wet face of a rock. They earned the name **amphibians of the plant kingdom** for one reason: these plants **can live in soil, but depend on water for sexual reproduction**. On top of that, they matter ecologically — they play an important role in **plant succession on bare rocks and soil** (more on that at the end).\n\nLook at the plant body and you'll see it is a step up from the algae you just met. It is **more differentiated than algae**: **thallus-like**, lying flat (prostrate) or standing up (erect), and fixed to the surface it grows on by **rhizoids**, which can be **unicellular or multicellular**. But here is the catch students must not miss — bryophytes **lack true roots, stem, and leaves**. What they have instead are only **root-like, leaf-like, or stem-like structures** that look the part but aren't the real organs a higher plant has.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Gametophyte Runs the Show',
      objective: "By the end of this you can say which body is the main bryophyte plant, whether it is haploid or diploid, and why the sperm can't get to the egg without water.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The green bryophyte you actually see — the moss cushion, the flat liverwort — is the **main plant body**, and it is **haploid** (one set of chromosomes). Because this haploid body is the one that **produces the gametes**, it is called the **gametophyte**. Hold on to that link: *haploid body that makes gametes = gametophyte*. This is the body that dominates the bryophyte life.\n\nThe **sex organs** sit on this gametophyte, and unlike in algae they are **multicellular**. The **male sex organ is the antheridium**; it produces swimming male gametes called **biflagellate antherozoids** (two tails each). The **female sex organ is the archegonium** — **flask-shaped**, and it holds a **single egg**. Now the amphibian problem shows itself. The **antherozoids are released into water**, and only by swimming through that water do they reach the archegonium. One antherozoid **fuses with the egg to form the zygote**. No film of water, no journey, no fertilisation — which is the whole reason bryophytes stay chained to damp places.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A labelled moss gametophyte with antheridium, archegonium, rhizoids and a small attached sporophyte',
      caption: '📸 Tap each dot to explore the parts of a bryophyte',
      generation_prompt: "Scientific textbook illustration of a moss bryophyte plant. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A single erect leafy green gametophyte plant standing upright, its slender central axis clothed in small simple leaf-like structures, coloured green to signal living photosynthetic tissue. At the base, fine pale brown thread-like rhizoids spread sideways into the ground anchoring the plant. At the top of the gametophyte, two multicellular sex organs shown close together: a rounded club-shaped male organ (antheridium) and a slender flask-shaped female organ with a narrow neck (archegonium). Rising from the top of the same green plant, a separate thin brown stalk carrying a small capsule at its tip — a sporophyte — clearly growing OUT of and attached to the green gametophyte, coloured brown/tan to signal it is dependent, non-independent tissue. Clean white outlines, thin white leader lines, biologically accurate proportions, green for the gametophyte, brown/tan for the sporophyte and rhizoids. No text or labels baked into the image itself. No photorealism, no cartoon, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.42, y: 0.55, label: 'Gametophyte', icon: 'circle',
          detail: 'The **haploid**, green, **photosynthetic** main plant body. It makes the gametes, so it carries the sex organs — this is the body that dominates a bryophyte.' },
        { id: uuid(), x: 0.30, y: 0.20, label: 'Antheridium (male)', icon: 'circle',
          detail: 'The multicellular **male sex organ**. It produces **biflagellate antherozoids** — sperm cells with two tails that swim through water.' },
        { id: uuid(), x: 0.54, y: 0.18, label: 'Archegonium (female)', icon: 'circle',
          detail: 'The multicellular **female sex organ**, **flask-shaped**, holding a **single egg** waiting for an antherozoid to reach it.' },
        { id: uuid(), x: 0.44, y: 0.90, label: 'Rhizoids', icon: 'circle',
          detail: '**Unicellular or multicellular** root-like threads that anchor the plant. They are only root-*like* — bryophytes have **no true roots**.' },
        { id: uuid(), x: 0.66, y: 0.30, label: 'Sporophyte', icon: 'circle',
          detail: 'The body grown from the zygote. It is **not free-living** — it stays **attached to the gametophyte** and draws its nourishment from it; some of its cells later make spores.' },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A gardener keeps a patch of moss on a rock alive by watering it, but no matter how healthy it looks, it never manages to complete sexual reproduction during a long dry spell. The plant is clearly alive and green the whole time. What is the single most likely reason fertilisation keeps failing?",
      options: [
        "The gametophyte turns diploid when it dries out, so it can no longer make gametes",
        "Without a continuous film of water, the biflagellate antherozoids cannot swim across to reach the egg in the archegonium",
        "The archegonium needs strong sunlight, and the shade on the rock stops the egg from forming",
        "The moss has true roots that fail to absorb water, so the whole plant shuts down reproduction",
      ],
      correct_index: 1,
      reveal: "The male gametes of a bryophyte are **antherozoids that swim** — they are released into water and only reach the flask-shaped archegonium by moving through a film of it. In a dry spell that water bridge is missing, so the sperm never reaches the egg and no zygote forms. That is the exact meaning of 'amphibian of the plant kingdom.' The gametophyte does not switch to diploid (it stays haploid), the archegonium isn't waiting on sunlight, and bryophytes have no true roots at all — so those three options each contradict the basic biology.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'The Dependent Sporophyte',
      objective: "By the end of this you can trace zygote → sporophyte → spores, and explain why the sporophyte is called a freeloader on the gametophyte.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Once the antherozoid fuses with the egg, you have a **zygote**. Here bryophytes do something worth noticing: the **zygote does not undergo reduction division (meiosis) immediately**. Instead it grows into a **multicellular body called the sporophyte**.\n\nBut this sporophyte never stands on its own. It is **not free-living** — it stays **attached to the photosynthetic gametophyte and draws its nourishment from it**, like a lodger living off the green plant that made it. Only later do **some cells of the sporophyte undergo meiosis** (the reduction division that was postponed) to produce **haploid spores**. Those **spores germinate and grow into new gametophytes**, and the cycle comes back to where it started. So the green gametophyte is the independent, dominant body, and the sporophyte is the smaller, dependent stage riding on top of it.",
    },
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Why Bryophytes Matter',
      objective: "By the end of this you can name what Sphagnum gives us and why mosses are the first plants onto bare rock.",
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "In cash terms bryophytes are **of little economic importance**, but they are not useless. Some **mosses provide food** for herbaceous mammals, birds, and other animals. One moss in particular earns its keep: species of **Sphagnum** provide **peat**, which has long been used as **fuel**, and as **packing material for shipping living material** — it works because it can **hold water** and keep things moist in transit.\n\nTheir bigger role is ecological. **Mosses, along with lichens, are the first organisms to colonise bare rock** — which is why they are of great ecological importance. They **decompose the rock**, slowly making the surface fit for **higher plants** to grow later (this is the start of **plant succession**). And because mosses form **dense mats** over the soil, they **soften the impact of falling rain and prevent soil erosion**. This whole group is itself split into two: the **liverworts** and the **mosses** — which is exactly where we go next.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember', title: 'Lock These In',
      markdown: "- **Amphibians of the plant kingdom** = live on land but **need water for sexual reproduction**.\n- The main plant body is the **gametophyte** — it is **haploid** and **dominant**.\n- **Antheridium = male** (makes **biflagellate antherozoids**); **archegonium = female**, **flask-shaped**, holds **one egg**.\n- The **sporophyte is dependent** — attached to the gametophyte, draws food from it; some of its cells do meiosis to make **spores**.\n- **Sphagnum → peat** (fuel + water-holding packing material). Mosses + lichens = **first colonisers** of rock; dense mats **prevent soil erosion**.",
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Dominant, haploid body:** NEET repeatedly checks that the **gametophyte is the dominant plant body** and that it is **haploid**. Any option calling the sporophyte dominant, or the gametophyte diploid, is the trap.\n\n**Male vs female organ:** **Antheridium = male** (antherozoids), **archegonium = female** (single egg, flask-shaped). Questions love swapping these two definitions.\n\n**Semi-parasitic sporophyte:** Remember the sporophyte is **not free-living** — it is attached to and nourished by the gametophyte. This 'sporophyte depends on gametophyte' line is a favourite one-liner.\n\n**Economic / ecological:** **Sphagnum → peat**; mosses and lichens are the **first organisms to colonise rocks** and help **prevent soil erosion**.\n\n**Classic NEET question:** \"Bryophytes are called amphibians of the plant kingdom because ___\" → **they live on land but require water for sexual reproduction.**",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Bryophytes are called the amphibians of the plant kingdom because they:',
          options: [
            'Live only underwater like true aquatic plants',
            'Can live in soil but depend on water for sexual reproduction',
            'Switch between a land form and a fish-like swimming form',
            'Have true roots that must always stay submerged',
          ],
          correct_index: 1,
          explanation: "The nickname comes from their double life: they grow on land but their antherozoids must swim through water to reach the egg, so they depend on water for sexual reproduction. They are not fully aquatic, they don't have a swimming animal-like stage, and they have no true roots at all — so the other three options each misstate the reason.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'The main plant body of a bryophyte that you normally see is:',
          options: [
            'The sporophyte, which is diploid and free-living',
            'The gametophyte, which is haploid and produces gametes',
            'The zygote, which grows directly into the leafy plant',
            'The archegonium, which forms the entire green body',
          ],
          correct_index: 1,
          explanation: "The dominant, visible green body is the haploid gametophyte, and because it makes the gametes it carries that name. The sporophyte is diploid but small and dependent (not free-living), the zygote is a single fertilised cell rather than the plant body, and the archegonium is just the female sex organ sitting on the gametophyte, not the whole plant.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which statement about the bryophyte sporophyte is correct?',
          options: [
            'It is free-living and makes its own food by photosynthesis',
            'It is attached to the gametophyte and draws nourishment from it',
            'It undergoes meiosis in the zygote immediately after fertilisation',
            'It produces biflagellate antherozoids from its capsule',
          ],
          correct_index: 1,
          explanation: "The sporophyte is not free-living — it stays attached to the photosynthetic gametophyte and derives its nourishment from it. The zygote does NOT undergo meiosis immediately (it first grows into the sporophyte, and only later do some of its cells divide by meiosis), and antherozoids are made in the antheridium of the gametophyte, not by the sporophyte.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: 'Peat, long used as fuel and as water-holding packing material, is obtained from which bryophyte?',
          options: ['Marchantia', 'Sphagnum', 'Funaria', 'Lichens'],
          correct_index: 1,
          explanation: "NCERT names Sphagnum, a moss, as the source of peat, prized because it can hold water. Marchantia is a liverwort and Funaria is a different moss, so neither forms peat; lichens are the rock-colonising partners of mosses but are not the peat-forming plant — that specific role belongs only to Sphagnum.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
