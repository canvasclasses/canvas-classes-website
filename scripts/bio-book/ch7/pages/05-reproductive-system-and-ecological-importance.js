'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'reproductive-system-and-ecological-importance',
  title: "The Frog's Reproductive System and Its Ecological Importance",
  subtitle: "One organ system left to trace, one question of why frogs matter to a farmer, and then the whole chapter — cell to tissue to organ to organ system — comes together in a single animal.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['structural-organisation-in-animals', 'frog', 'reproductive-system', 'chapter-synthesis'],
  glossary: [
    { term: 'mesorchium', definition: "The double fold of peritoneum that adheres a frog's testes to the upper part of the kidneys." },
    { term: 'vasa efferentia', definition: "10-12 fine tubes that arise from the testes, enter the kidneys on their own side, and open into Bidder's canal." },
    { term: "Bidder's canal", definition: 'The canal inside the kidney that the vasa efferentia open into, before the sperm continue on into the urinogenital duct.' },
    { term: 'urinogenital duct', definition: "The duct that comes out of a male frog's kidney and opens into the cloaca, carrying both urine and sperm." },
    { term: 'cloaca', definition: 'A small, median chamber that is the common exit for faecal matter, urine, and (in males) sperm.' },
    { term: 'oviduct', definition: 'A pair of ducts arising from the ovaries that open into the cloaca separately, carrying ova to the outside.' },
    { term: 'tadpole', definition: "The larval stage a frog passes through after external fertilisation, before it metamorphoses into the adult body plan." },
    { term: 'metamorphosis', definition: 'The process by which a tadpole transforms into an adult frog.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A cluster of frog eggs in still water at dusk, with a single tadpole visible nearby, suggesting the start of the life cycle',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A close, low-angle view across the still surface of a shallow pond at dusk: a loose cluster of translucent frog eggs floats near submerged reeds on one side, and a single small tadpole is visible swimming nearby on the other side, its tail trailing through the water. Warm amber light from the horizon reflects across the water's surface, tying the two life stages together as one continuous story. Out-of-focus reeds and water droplets. Deep dusk lighting, dark naturalistic background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'A Frog Never Meets Its Own Egg',
      markdown: "By the time a frog's egg becomes a frog, it has already changed body plan once. There's no live birth here — a mother frog releases her ova into the water, a male fertilises them outside both their bodies, and what hatches out isn't a miniature frog at all. It's a **tadpole**, a completely different-looking swimming larva, which only later **metamorphoses** into the adult you'd recognise. This is the last organ system in the frog you'll trace — and it closes the loop on everything you've learnt about this one animal.",
    },
    // ── 2 · Core concept — the two systems ─────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Frogs have **well organised male and female reproductive systems**, and the two are built quite differently from each other. The male system routes sperm out through a duct it **shares with the kidney**. The female system does not share anything with the kidney at all — it has its own separate, dedicated route to the outside. That one difference is the detail this page will ask you to hold onto most carefully.",
    },
    // ── 3 · Heading — male reproductive system ─────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Male Reproductive System',
      objective: 'By the end of this you can trace the exact path sperm takes from the testes to the cloaca, naming every structure along the way.',
    },
    // ── 4 · Text — male system ─────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The male reproductive organs are a **pair of yellowish, ovoid testes**. They don't float freely — each testis is **adhered to the upper part of the kidney** by a double fold of peritoneum called the **mesorchium**.\n\nFrom the testes, **10-12 fine tubes called vasa efferentia** arise. They **enter the kidney on their own side** and open into a canal inside it called **Bidder's canal**. From Bidder's canal, the path **finally communicates with the urinogenital duct**, which comes out of the kidney and opens into the **cloaca** — the small, median chamber that is the common exit for **faecal matter, urine, and sperm**.\n\nNotice what that path means: in a male frog, sperm and urine travel out through the **same duct**. The kidney isn't just next to the reproductive system here — it's built into the route sperm has to take to leave the body.",
    },
    // ── 5 · Interactive image — male reproductive system ────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: "A frog's male reproductive system in dorsal view, showing the paired testes adhered to the kidneys by the mesorchium, the vasa efferentia entering the kidney, Bidder's canal, the urinogenital duct, and the cloaca",
      caption: "📸 Tap each part to trace the path sperm takes from the testes to the outside",
      generation_prompt: "Scientific textbook illustration of a frog's male urinogenital system in dorsal (from-above) view. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, no text or labels baked into the image. Show a pair of small yellowish-tan ovoid testes lying against the upper part of two elongated kidneys (kidneys coloured deep red-brown), connected to the kidneys by a thin double-fold membrane (mesorchium, rendered as a pale translucent white fold). From each testis, a fan of 10-12 very fine white thread-like tubes (vasa efferentia) runs sideways into the kidney tissue. Inside each kidney, a faint internal canal (Bidder's canal) is suggested with a thin dotted white line. From the base of each kidney, a duct (urinogenital duct, pale yellow-white tube) runs downward and both ducts converge into a single small median chamber (the cloaca, coloured soft pink/magenta) at the bottom of the frame, with a small opening (cloacal aperture) at its end. Functional colours: deep red-brown for kidney, pale tan/yellow for testes and ducts, soft pink/magenta for the cloaca (animal soft tissue). No photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
      hotspots: [
        {
          id: uuid(), x: 0.32, y: 0.22, label: 'Testes (pair)', icon: 'circle',
          detail: "A pair of **yellowish, ovoid testes** — the male reproductive organs. Each one is **adhered to the upper part of the kidney** by the mesorchium, not free-floating.",
        },
        {
          id: uuid(), x: 0.40, y: 0.18, label: 'Mesorchium', icon: 'circle',
          detail: "The **double fold of peritoneum** that adheres each testis to the kidney above it. This is the structure that physically anchors the testis in place.",
        },
        {
          id: uuid(), x: 0.50, y: 0.35, label: 'Vasa efferentia (10-12 tubes)', icon: 'circle',
          detail: "**10-12 fine tubes** that arise from the testes. They **enter the kidney on their own side** — this is the first step of sperm leaving the testis.",
        },
        {
          id: uuid(), x: 0.55, y: 0.48, label: "Bidder's canal", icon: 'circle',
          detail: "The canal **inside the kidney** that the vasa efferentia open into. Sperm collects here before continuing on toward the urinogenital duct.",
        },
        {
          id: uuid(), x: 0.48, y: 0.68, label: 'Urinogenital duct', icon: 'circle',
          detail: "Finally, the path **communicates with the urinogenital duct**, which comes **out of the kidney** and carries both urine and sperm onward to the cloaca.",
        },
        {
          id: uuid(), x: 0.50, y: 0.90, label: 'Cloaca', icon: 'circle',
          detail: "A small, **median chamber** used to pass **faecal matter, urine, and sperm** to the exterior — the single, shared exit point at the end of the male's reproductive path.",
        },
      ],
    },
    // ── 6 · Heading — female reproductive system ────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Female Reproductive System',
      objective: 'By the end of this you can state exactly what is different about the female route to the cloaca, and describe what happens to the ova after they leave the body.',
    },
    // ── 7 · Text — female system ────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "The female reproductive organs are a **pair of ovaries**, situated near the kidneys — but here's the difference that matters most: **there is no functional connection between the ovaries and the kidneys.** Unlike in the male, the kidney plays no part in getting ova out of the body.\n\nInstead, a **pair of oviducts** arises from the ovaries, and each one **opens into the cloaca separately** — its own independent route, not shared with the urinary system at all.\n\nA mature female can lay **2500 to 3000 ova at a time**. **Fertilisation is external**, taking place **in water**, after the ova and sperm have both already left the parents' bodies. Development then involves a **larval stage called the tadpole**, and the tadpole **undergoes metamorphosis** to become the adult frog.",
    },
    // ── 8 · Comparison card — male vs female ────────────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 8,
      title: 'Male vs Female Reproductive System',
      columns: [
        {
          heading: 'Male',
          points: [
            'Gonad: a pair of yellowish, ovoid testes',
            'Adhered to the upper part of the kidney by the mesorchium — a functional connection to the kidney exists',
            'Route out: testes → vasa efferentia (10-12) → Bidder\'s canal → urinogenital duct → cloaca',
            'The urinogenital duct carries both sperm and urine — one shared duct',
          ],
        },
        {
          heading: 'Female',
          points: [
            'Gonad: a pair of ovaries',
            'Situated near the kidneys, but NO functional connection with the kidneys',
            'Route out: ovaries → a pair of oviducts, opening into the cloaca separately',
            'A mature female lays 2500-3000 ova at a time; fertilisation is external, in water',
          ],
        },
      ],
    },
    // ── 9 · Reasoning prompt — kidney connection ────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A question describes a frog's reproductive organ as having a duct that runs through the kidney before reaching the cloaca, using structures like the vasa efferentia and Bidder's canal. Is this describing the male system, the female system, or both — and why?",
      options: [
        "The male system only — vasa efferentia carry sperm from the testes into the kidney and Bidder's canal, while the ovaries have no functional connection with the kidneys at all",
        "The female system only — the oviducts pass through Bidder's canal inside the kidney before reaching the cloaca",
        "Both systems — every frog's gonads are adhered to the kidney by the mesorchium, regardless of sex",
        "Neither system — vasa efferentia and Bidder's canal belong to the frog's digestive system, not its reproductive system",
      ],
      correct_index: 0,
      reveal: "This is the male system. The vasa efferentia arise from the testes and enter the kidney, opening into Bidder's canal — a route built through the kidney. NCERT is explicit that the female system is different: the ovaries are situated near the kidneys but have NO functional connection with them, and the oviducts go straight to the cloaca on their own, separately. The mesorchium is also a male-only structure — it's what adheres the testes (not the ovaries) to the kidney.",
      difficulty_level: 3,
    },
    // ── 10 · Heading — ecological importance ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'Why Frogs Matter Beyond the Lab',
      objective: 'By the end of this you can explain, in NCERT\'s own terms, why frogs are ecologically and economically important.',
    },
    // ── 11 · Text — ecological importance ───────────────────────────────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "Frogs aren't just a dissection specimen. NCERT is direct about why they matter outside the lab. **Frogs are beneficial for mankind because they eat insects and protect the crop** — a farmer's field with a healthy frog population has a natural check on the insects that would otherwise damage it.\n\nFrogs also **maintain ecological balance**, because they serve as an **important link of food chain and food web in the ecosystem** — they eat insects, and in turn are eaten by larger predators, holding a position that many other organisms in that food web depend on.\n\nAnd in some countries, frogs matter in one more direct way: the **muscular legs of frogs are used as food by man**.",
    },
    // ── 12 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Male:** testes → mesorchium (attaches testes to kidney) → vasa efferentia (10-12) → Bidder's canal → urinogenital duct → cloaca. The urinogenital duct carries both **sperm and urine**.\n- **Female:** ovaries (near kidney, **no functional connection** to it) → paired oviducts → cloaca (**separately**). No shared duct with the urinary system.\n- A mature female lays **2500-3000 ova** at a time.\n- **Fertilisation is external**, in water → hatches into a **tadpole** → **metamorphosis** → adult frog.\n- Frogs are ecologically important as they **eat insects, protect crops**, and form a key **link in the food chain and food web**.",
    },
    // ── 13 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**The trap NCERT is warning you about directly:** it explicitly states there is **no functional connection between the ovaries and the kidneys** — a line written specifically because students assume the female system mirrors the male one. It doesn't. Only the **male** system routes sperm through the kidney, via vasa efferentia and Bidder's canal; the female's oviducts go straight to the cloaca on their own.\n\n**The development sequence to have cold:** external fertilisation (in water) → **tadpole** (larval stage) → **metamorphosis** → adult. A question that skips the tadpole stage, or claims development is internal, is wrong on both counts.\n\n**Classic NEET question:** \"Which frog reproductive organ has NO functional connection with the kidney?\" → **the ovary** (the oviduct opens into the cloaca separately, not through any kidney structure).",
    },
    // ── 14 · Closing synthesis text ─────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "Step back now and look at everything you've just walked through in this one animal. It started with a definition that could easily have stayed abstract: a **tissue** is a group of cells and intercellular substances doing a job together, and epithelia — sheet-like tissues with one free surface, their cells locked together at junctions — line every surface, cavity, duct and tube in the body. That's the theory. The frog is where it stopped being theory.\n\nYou saw the skin, covered in mucous glands and richly vascularised, do double duty as a breathing surface in water and on land. You saw a bilobed tongue built for one job — catching prey — and an alimentary canal running from oesophagus to rectum, opening into the cloaca, backed by the liver and pancreas as digestive glands. You saw a heart that stays closed with a single circulation, pumping nucleated red blood cells, and a nervous system splitting its work between central, peripheral and autonomic divisions. You saw kidneys and urinogenital ducts sharing one exit in the male, and on this page, two reproductive systems that look similar on the outside but are built on completely different plumbing underneath.\n\nNone of that was eleven separate facts to memorise. It was **one animal**, and every organ system in it was cells organising into tissues, tissues organising into organs, and organs organising into organ systems — the exact division of labour this chapter opened with. That's *Structural Organisation in Animals*, seen end to end in a single frog.",
    },
    // ── 15 · Inline quiz ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: "In a male frog, sperm travels from the testes to Bidder's canal through which structures, in order?",
          options: [
            'Vasa efferentia, entering the kidney on their own side',
            'Oviducts, opening directly into the cloaca',
            'The mesorchium, carrying sperm across to the opposite kidney',
            'The urinogenital duct, arising directly from the testes',
          ],
          correct_index: 0,
          explanation: "The 10-12 vasa efferentia arise from the testes, enter the kidney on their own side, and open into Bidder's canal. The oviducts belong to the female system. The mesorchium is the fold of peritoneum that adheres the testis to the kidney — it does not carry sperm. The urinogenital duct comes after Bidder's canal, not directly from the testes.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "Which statement correctly describes the female frog's reproductive system?",
          options: [
            'The ovaries have a functional connection with the kidneys, just like the testes do',
            'The ovaries are situated near the kidneys but have no functional connection with them, and the oviducts open into the cloaca separately',
            'The oviducts pass through Bidder\'s canal before reaching the cloaca',
            'A mature female lays 10-12 ova at a time, matching the number of vasa efferentia in the male',
          ],
          correct_index: 1,
          explanation: "NCERT is explicit: the ovaries sit near the kidneys but have NO functional connection with them, and the paired oviducts open into the cloaca separately from any urinary structure. Bidder's canal is a male-only structure. A mature female lays 2500-3000 ova at a time — 10-12 is the number of vasa efferentia in the male, an unrelated figure.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'What is the correct sequence of events after a female frog releases her ova into water?',
          options: [
            'External fertilisation → tadpole (larval stage) → metamorphosis → adult frog',
            'Internal fertilisation → direct development into a small adult frog',
            'External fertilisation → the ova hatch directly as adult frogs, with no larval stage',
            'Fertilisation inside the cloaca → tadpole → the tadpole stays a tadpole permanently',
          ],
          correct_index: 0,
          explanation: "Fertilisation is external, taking place in water. Development involves a larval stage, the tadpole, which then undergoes metamorphosis to form the adult. There is no internal fertilisation, no direct development straight to an adult body plan, and the tadpole does not stay a tadpole — metamorphosis is what turns it into a frog.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Which of these is an ecological or economic benefit of frogs that NCERT names directly?',
          options: [
            'Frogs eat insects and protect crops, and serve as an important link in the food chain and food web',
            'Frogs purify pond water by filtering it through their skin',
            'Frog mucous glands are harvested for medicine in every country',
            'Frogs control weed growth by eating aquatic plants',
          ],
          correct_index: 0,
          explanation: "NCERT states frogs are beneficial because they eat insects and protect crops, and that they maintain ecological balance as an important link in the food chain and food web of the ecosystem. It also notes that in some countries frog legs are eaten as food — but water filtration, medicine harvesting, and weed control are not stated anywhere in the text.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
