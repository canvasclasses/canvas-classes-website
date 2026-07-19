'use strict';
/**
 * Class 12 Biology — Chapter 8: Microbes in Human Welfare
 * Page 4 — Gas from Dung: Microbes & Biogas.
 *
 * Source of truth: NCERT Class 12 Ch.8 (lebo108.txt), §8.4 "MICROBES IN
 * PRODUCTION OF BIOGAS" (lines 314–369) + Figure 8.8 "A typical biogas plant".
 * Rule 0: every fact, name and number here traces to that text — biogas is a
 * mixture of gases (predominantly methane) produced by microbial activity and
 * usable as fuel; methanogens (e.g. Methanobacterium) grow anaerobically on
 * cellulosic material to give methane + CO2 + H2; they live in anaerobic sewage
 * sludge and in the rumen of cattle (where they help digest cellulose), so cattle
 * dung (gobar) is rich in them; the biogas plant = a concrete tank (10–15 feet
 * deep) fed with dung slurry, a floating cover that rises with the gas, a gas
 * outlet piped to homes, and a spent-slurry outlet used as fertiliser; the
 * technology was developed in India by IARI and KVIC. Nothing invented.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'microbes-in-biogas-production',
  title: 'Gas from Dung — Microbes & Biogas',
  subtitle: "Cattle dung isn't waste — it's packed with a special group of bacteria that turn plant fibre into a gas you can cook on. Here's who those bacteria are, why the process must happen with the air shut out, and how a village biogas plant is built to catch the gas.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['biogas', 'methanogen', 'methanobacterium', 'gobar-gas', 'microbes-in-human-welfare'],
  glossary: [
    { term: 'biogas', definition: 'A mixture of gases — containing predominantly methane — produced by the activity of microbes on organic matter. It is inflammable, so it can be used as fuel for cooking and lighting.' },
    { term: 'methanogen', definition: 'Any of a group of bacteria that grow anaerobically (without oxygen) on cellulosic material and produce large amounts of methane along with CO2 and H2. They are named for the methane they make.' },
    { term: 'Methanobacterium', definition: 'A common example of a methanogen. It is found in anaerobic sewage sludge, in the rumen of cattle, and in cattle dung.' },
    { term: 'rumen', definition: 'A part of the stomach of cattle. It holds a lot of cellulosic food and is home to methanogens, which help break down that cellulose and so aid the nutrition of the cattle.' },
    { term: 'gobar gas', definition: 'The common name for biogas generated from cattle dung (gobar), which is rich in methanogens.' },
  ],
  blocks: [
    {
      id: 'a1c3e5f7-1b2d-4e6f-8a09-1c2d3e4f5a60',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A village dawn scene with a domed biogas plant beside a cattle shed, a thin blue cooking flame glowing in a nearby hut',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A rural Indian village at soft dawn — in the foreground a low domed biogas plant of brick and concrete sits beside a cattle shed where a couple of cattle rest, a mound of dung nearby. A thin pipe runs from the plant toward a small hut where a clean blue cooking flame glows in the doorway. Warm low dawn light, mist over the fields behind, painterly and atmospheric, overall dark background tones (#0a0a0a base) with the blue flame as the one cool highlight. Naturalistic, shallow depth of field, no text, no labels, no diagram elements.",
    },
    {
      id: 'b2d4f6a8-2c3e-4f70-9b1a-2d3e4f5a6b71',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'A Cow Is a Walking Biogas Plant',
      markdown: "A cow chews grass all day — grass that is mostly **cellulose**, a fibre no cow can actually digest on its own. So how does it live on grass? Inside one part of the cow's stomach, the **rumen**, lives a crowd of tiny bacteria that break that cellulose down for it. Those very same bacteria are the ones that make **methane**. That's why cattle dung (**gobar**) is such good fuel — it comes out already loaded with the microbes we need. The village biogas plant just gives them a tank to keep working in.",
    },
    {
      id: 'c3e5a7b9-3d4f-4a81-8c2b-3e4f5a6b7c82',
      type: 'text',
      order: 2,
      markdown: "**Biogas** is a mixture of gases — containing **predominantly methane** — produced by the activity of microbes, and it can be used as **fuel** because it burns. You already know that microbes give off different gases as they grow and feed. When dough is fermented, when cheese is made, when beverages are brewed, the main gas coming off is **CO2**. Biogas is different: its star gas is **methane (CH4)**.\n\nWhat gas you get depends on **which microbe** is at work and **what organic material** it is feeding on. To make methane, you need a very particular kind of bacterium feeding on plant fibre with the air shut out.",
    },
    {
      id: 'd4f6b8c0-4e5a-4b92-9d3c-4f5a6b7c8d93',
      type: 'heading',
      order: 3,
      level: 2,
      text: 'The Methane-Makers — Methanogens',
      objective: "By the end of this you can say what a methanogen is, name one, and list the three gases it produces from cellulose.",
    },
    {
      id: 'e5a7c9d1-5f6b-4c03-8e4d-5a6b7c8d9e04',
      type: 'text',
      order: 4,
      markdown: "Certain bacteria grow **anaerobically** — that means without oxygen — on **cellulosic material**, and as they do, they produce a large amount of **methane** along with **CO2** and **H2**. Because they make methane, these bacteria are collectively called **methanogens**, and one common example is **Methanobacterium**.\n\nWhere do you find them? Three places worth remembering. First, in the **anaerobic sludge** during sewage treatment. Second — and this is the surprising one — in the **rumen** (a part of the stomach) of cattle. The rumen is full of cellulosic food, and there these bacteria break the cellulose down and play an important part in the **nutrition of the cattle** (a job our own stomachs can't do — we can't digest the cellulose in our food). Third, because the rumen is packed with them, the cattle's **dung (gobar)** is rich in these bacteria too. That dung can be used to generate biogas, which is commonly called **gobar gas**.",
    },
    {
      id: 'f6b8d0e2-6a7c-4d14-9f5e-6b7c8d9e0f15',
      type: 'heading',
      order: 5,
      level: 2,
      text: 'The Biogas Plant — a Tank That Catches Gas',
      objective: "By the end of this you can trace dung slurry through the plant and name every part it passes: inlet, tank, floating cover, gas outlet, spent-slurry outlet.",
    },
    {
      id: 'a7c9e1f3-7b8d-4e25-8a6f-7c8d9e0f1a26',
      type: 'text',
      order: 6,
      markdown: "The plant is built around a **concrete tank, 10–15 feet deep**, where the bio-wastes are collected. A **slurry of dung** is fed into it through an inlet. Over the slurry sits a **floating cover** — and here's the clever bit: as the microbes work inside and gas builds up, that cover **keeps rising**, trapping the gas beneath it instead of letting it escape.\n\nThe plant has an **outlet** near the top, connected to a **pipe** that carries the biogas to nearby houses, where it is used for **cooking** and **lighting**. Meanwhile the leftover, used-up slurry — the **spent slurry** — is removed through **another outlet** and can be used as **fertiliser**. So nothing is wasted: the dung gives up its gas and what's left still feeds the fields.\n\nCattle dung is available in large amounts in rural areas, which is why biogas plants are **more often built in villages**. The technology of biogas production was developed in India mainly through the efforts of the **Indian Agricultural Research Institute (IARI)** and the **Khadi and Village Industries Commission (KVIC)**.",
    },
    {
      id: 'b8d0f2a4-8c9e-4f36-9b7a-8d9e0f1a2b37',
      type: 'interactive_image',
      order: 7,
      src: '',
      alt: 'Cutaway diagram of a typical biogas plant showing the dung-slurry inlet, deep concrete digester tank, rising floating cover, gas outlet pipe to houses, and spent-slurry outlet',
      caption: '📸 Tap each dot to follow the dung slurry through the plant and see where the gas comes out',
      generation_prompt: "Scientific textbook illustration of a typical biogas plant in cutaway cross-section (matching NCERT Fig 8.8 'A typical biogas plant'). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically and structurally accurate. Show, from left to right: a sloping INLET channel on the left where brown dung slurry is being poured in; a deep cylindrical CONCRETE DIGESTER TANK (labelled proportions of roughly 10–15 feet deep) sunk into the ground, its lower part filled with brown dung slurry, with small rising gas bubbles drawn in the slurry to indicate microbial activity; a dome-shaped FLOATING COVER / gas holder sitting on top of the slurry with an upward arrow showing it rises as gas collects, and a shaded gas space beneath it; a GAS OUTLET PIPE leaving the top of the floating cover and running to the right toward a small house outline with a blue cooking flame; and on the right side of the tank a separate SPENT-SLURRY OUTLET channel through which greyish used slurry flows out to a small field/compost heap. Functional colours: brown/tan for the dung slurry and spent slurry, blue for the cooking flame, grey for the concrete tank walls, a faint yellow shaded pocket for the collected gas. Ground/soil shown as a simple horizon line with a subtle earth tone. No text or labels baked into the image, no photorealism, no cartoon, standard biology/technology textbook illustration conventions.",
      hotspots: [
        { id: 'c9e1f3a5-9d0f-4a47-8c8b-9e0f1a2b3c48', x: 0.12, y: 0.55, label: 'Dung-slurry inlet', detail: 'The channel where a **slurry of cattle dung (gobar)** is fed into the plant. This slurry carries the **methanogens** that will do all the work.', icon: 'circle' },
        { id: 'd0f2a4b6-0e1a-4b58-9d9c-0f1a2b3c4d59', x: 0.42, y: 0.7, label: 'Concrete digester tank', detail: 'A **concrete tank, 10–15 feet deep**, where the bio-wastes collect. Inside, **methanogens** break down the cellulose **anaerobically** and give off biogas.', icon: 'circle' },
        { id: 'e1a3b5c7-1f2b-4c69-8e0d-1a2b3c4d5e60', x: 0.44, y: 0.32, label: 'Floating cover (gas holder)', detail: 'A cover that floats on the slurry and **keeps rising as gas is produced** beneath it. It traps the biogas instead of letting it escape.', icon: 'circle' },
        { id: 'f2b4c6d8-2a3c-4d70-9f1e-2b3c4d5e6f71', x: 0.72, y: 0.22, label: 'Gas outlet pipe', detail: 'An **outlet connected to a pipe** that carries the biogas to nearby houses, where it is used for **cooking and lighting**.', icon: 'circle' },
        { id: 'a3c5d7e9-3b4d-4e81-8a2f-3c4d5e6f7a82', x: 0.78, y: 0.72, label: 'Spent-slurry outlet', detail: 'A **second outlet** that removes the used-up (spent) slurry. It is not wasted — it can be used as **fertiliser** on the fields.', icon: 'circle' },
      ],
    },
    {
      id: 'b4d6e8f0-4c5e-4f92-9b3a-4d5e6f7a8b93',
      type: 'reasoning_prompt',
      order: 8,
      reasoning_type: 'logical',
      prompt: "Methanogens make methane only when they grow anaerobically on cellulosic material. Suppose a villager built an open, uncovered pit and just let the dung sit in it, exposed to the air. Why would this pit make very little biogas?",
      options: [
        "Open air lets sunlight in, and methanogens are killed by light",
        "Methanogens need oxygen from the air to make methane, so an open pit actually helps them",
        "Methanogens work only without oxygen; an open pit lets air (oxygen) in, so the methane-making bacteria can't do their job",
        "The dung would dry out and the cellulose would turn into CO2 instead of methane in sunlight",
      ],
      reveal: "The key word in the definition is **anaerobically** — methanogens produce methane only when oxygen is shut out. An open pit lets air, and therefore oxygen, reach the dung, and that stops the methanogens from making methane. This is exactly why a real biogas plant is a closed tank sealed under a floating cover: the cover keeps the air out (and traps the gas). The 'needs oxygen' option is the opposite of the truth — 'anaerobic' means without oxygen. Sunlight and drying aren't the reason NCERT gives; the single controlling factor is that the process must be air-free.",
      difficulty_level: 2,
    },
    {
      id: 'c5e7f9a1-5d6f-4a03-8c4b-5e6f7a8b9c04',
      type: 'callout',
      order: 9,
      variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Methanogens** = bacteria that grow **anaerobically** on cellulosic material and make **methane** (+ CO2 + H2). Example: **Methanobacterium**.\n- Biogas is a mixture of gases, **predominantly methane (CH4)** — that's what makes it burn as fuel.\n- Methanogens live in **anaerobic sewage sludge**, in the **rumen of cattle** (helping digest cellulose), and therefore in **cattle dung (gobar)**.\n- Biogas from dung = **gobar gas**.\n- Biogas plant parts: **concrete tank (10–15 ft)** → **floating cover** (rises with the gas) → **gas outlet pipe** to houses → **spent-slurry outlet** (used as fertiliser).\n- Technology developed in India by **IARI** and **KVIC**.",
    },
    {
      id: 'd6f8a0b2-6e7a-4b14-9d5c-6f7a8b9c0d15',
      type: 'callout',
      order: 10,
      variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Methanogen:** the exact NCERT line NEET lifts is that methanogens grow *anaerobically on cellulosic material* and produce methane along with CO2 and H2. If an option says they need oxygen, it's wrong.\n\n**Methanobacterium** is the named example — expect it as the correct choice when the question asks 'which of these is a methanogen'. Distractors will drop in fermentation organisms like *Saccharomyces* or LAB (*Lactobacillus*) — those give CO2/lactic acid, not methane.\n\n**Rumen link:** remember that methanogens sit in the rumen of cattle and help digest cellulose. NEET often ties the same organism to *both* the cow's gut *and* biogas.\n\n**Classic NEET question:** \"The gas predominant in biogas is __.\" → **methane (CH4)**, not CO2. (CO2 is the main gas in dough/cheese/beverage fermentation — don't mix them up.)",
    },
    {
      id: 'e7a9b1c3-7f8b-4c25-8e6d-7a8b9c0d1e26',
      type: 'text',
      order: 11,
      markdown: "So the whole chain is simple to hold in your head: cellulose-rich dung → methanogens working with no air → methane-rich biogas caught under a rising cover → clean fuel in the kitchen, and spent slurry back to the field. These same helpful microbes have another job on the farm, though — not making fuel, but fighting pests. That's where we go next.",
    },
    {
      id: 'f8b0c2d4-8a9c-4d36-9f7e-8b9c0d1e2f37',
      type: 'inline_quiz',
      order: 12,
      pass_threshold: 0.67,
      questions: [
        {
          id: 'a9c1d3e5-9b0d-4e47-8a8f-9c0d1e2f3a48',
          question: 'Which gas is present predominantly in biogas?',
          options: ['Carbon dioxide (CO2)', 'Methane (CH4)', 'Hydrogen (H2)', 'Oxygen (O2)'],
          correct_index: 1,
          explanation: "NCERT defines biogas as a mixture of gases containing predominantly methane, which is why it burns and can be used as fuel. CO2 and H2 are also produced by methanogens but only in smaller amounts — CO2 is the main gas in dough, cheese and beverage fermentation, not biogas. Oxygen is not a product at all; the process is anaerobic.",
          difficulty_level: 1,
        },
        {
          id: 'b0d2e4f6-0c1e-4f58-9b9a-0d1e2f3a4b59',
          question: 'Bacteria that produce methane from cellulosic material are collectively called methanogens. Which of the following is a methanogen named in NCERT?',
          options: ['Lactobacillus', 'Saccharomyces cerevisiae', 'Methanobacterium', 'Aspergillus niger'],
          correct_index: 2,
          explanation: "Methanobacterium is the common example NCERT gives for a methanogen. Lactobacillus (a lactic acid bacterium) sours milk into curd, Saccharomyces cerevisiae (baker's/brewer's yeast) drives dough and alcohol fermentation giving mainly CO2, and Aspergillus niger is a fungus used for citric acid — none of these make methane.",
          difficulty_level: 2,
        },
        {
          id: 'c1e3f5a7-1d2f-4a69-8c0b-1e2f3a4b5c60',
          question: 'A biogas plant works only if the digester tank is kept sealed under its floating cover rather than left open to the air. What is the reason?',
          options: [
            'The methanogens need plenty of oxygen, and the sealed tank concentrates it',
            'The methanogens are anaerobic — they make methane only when oxygen is kept out',
            'Sunlight would speed up the bacteria, so the cover blocks the light',
            'The cover is only there to stop the smell; it has no effect on gas production',
          ],
          correct_index: 1,
          explanation: "Methanogens grow anaerobically, meaning they produce methane only in the absence of oxygen; a sealed tank keeps air out so the reaction can proceed (and the rising cover also traps the gas). The 'need oxygen' option is the exact opposite of anaerobic. The cover's job is to exclude air and collect gas, not to block light or merely trap odour.",
          difficulty_level: 3,
        },
        {
          id: 'd2f4a6b8-2e3a-4b70-9d1c-2f3a4b5c6d71',
          question: 'Methanogens are found in the rumen of cattle, where they perform which role?',
          options: [
            'They break down cellulose and help in the nutrition of the cattle',
            'They digest proteins into amino acids for the cattle',
            'They protect the cattle against gut infections',
            'They fix atmospheric nitrogen for the cattle',
          ],
          correct_index: 0,
          explanation: "In the rumen the methanogens break down the cellulosic material in the cattle's food and so play an important part in the nutrition of the cattle — an ability the animal lacks on its own. NCERT does not credit them with protein digestion, protection against infection, or nitrogen fixation; their rumen role is specifically cellulose breakdown (and they release methane while doing it).",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
