'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'a-brief-account-of-evolution',
  title: 'Life Through Deep Time — A Brief Account of Evolution',
  subtitle: "Run the tape of life forward from the first tiny cell in the sea to the mammals of today, in the exact order NCERT lays it out — and NEET loves to scramble that order.",
  page_number: 7,
  page_type: 'lesson',
  tags: ['evolution', 'a-brief-account-of-evolution', 'geological-timeline'],
  glossary: [
    { term: 'lobefins', definition: 'Fish with stout, strong fins that could crawl onto land and return to water. NCERT says these evolved into the first amphibians. The Coelacanth is a living example.' },
    { term: 'Coelacanth', definition: 'A lobefin fish thought to be long extinct, until one was caught off South Africa in 1938 — a living reminder of the fish that first ventured onto land.' },
    { term: 'mass extinction', definition: 'A time when a very large number of species die out together over a short span. The sudden disappearance of the dinosaurs about 65 million years ago is the most famous example.' },
    { term: 'viviparous', definition: 'Giving birth to live young rather than laying eggs. NCERT notes the first mammals were viviparous and protected their unborn young inside the mother’s body.' },
    { term: 'Archaeopteryx', definition: 'A fossil that links reptiles and birds, carrying features of both. It supports NCERT’s point that some reptiles gave rise to birds.' },
    { term: 'continental drift', definition: 'The slow movement of the continents over millions of years. It decided which mammals met and competed — and let Australia’s pouched mammals survive in isolation.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A sweeping deep-time panorama moving from a primeval sea on the left to a forested land with early animals on the right, under a dim ancient sky',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio) telling the story of life across deep time, read left to right. On the far left, a dark primeval ocean with faint single-celled specks and simple soft-bodied creatures drifting in the water. Moving right, the water gives way to a misty shoreline where a stout-finned fish hauls itself onto muddy ground, then to a swampy forest of giant ferns with the silhouette of a large reptile among them, and finally to open land with a small shrew-like early mammal in the foreground. Muted, naturalistic, painterly palette — deep teal water, brown earth, dark green ferns — under a dim ancient sky. Atmospheric illustration, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no modern humans.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'They Ruled the Earth — Then Vanished in a Blink',
      markdown: "For roughly **200 million years**, reptiles owned this planet. The biggest of them, **Tyrannosaurus rex**, stood about **20 feet** tall with huge, dagger-like teeth. Nothing looked like it could ever knock them off the top.\n\nThen, about **65 million years ago**, the dinosaurs **suddenly disappeared**. We still don't know the true reason — some say the climate changed and killed them, some say most of them turned into birds. The truth may lie somewhere in between. Whatever happened, their fall cleared the stage for a group of small, timid, warm-blooded creatures no bigger than a shrew: the mammals.",
    },
    // ── 2 · Core concept — the story begins ──────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Everything alive today traces back to one moment: about **2000 million years ago (mya)**, the **first cellular forms of life** appeared on Earth. Exactly how loose bundles of giant molecules became true cells with a membrane around them, we still don't know.\n\nWhat we do know is that some of these early cells could **release oxygen (O2)**. The reaction was probably like the **light reaction of photosynthesis** — water split apart using energy from sunlight, captured by light-harvesting pigments. Slowly, these **single-celled** organisms became **multi-cellular** life forms, and the long story of evolution was under way.",
    },
    // ── 3 · Heading — the ordered march ──────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The March Out of the Sea and Onto Land',
      objective: "By the end of this you can retell the order of life's big events — cells, invertebrates, fish, land plants, amphibians, reptiles, mammals — the way NCERT lists them.",
    },
    // ── 4 · Text — the sequence ──────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "After the first cells, life picked up pace. By about **500 mya**, the **invertebrates** were formed and active. **Jawless fish** probably evolved around **350 mya**. Around **320 mya**, sea weeds and a few plants already existed.\n\nHere is a fact NEET loves: **the first organisms to invade land were plants**, not animals. Plants were already widespread on land when animals finally crawled ashore. The animals that made that move were fish with **stout, strong fins** — the **lobefins** — that could push themselves onto land and slip back into water (about **350 mya**). One such fish, the **Coelacanth**, was thought to be extinct until one was caught off South Africa in **1938**.\n\nThese lobefins evolved into the **first amphibians**, at home on both land and water — the ancestors of today's **frogs and salamanders**. Amphibians then gave rise to **reptiles**, which laid **thick-shelled eggs** that don't dry up in the sun (unlike an amphibian's eggs). For the next **200 million years or so**, reptiles of every shape and size — the **dinosaurs** — dominated. Some even went back into the water to become fish-like reptiles such as **Ichthyosaurs** (about **200 mya**). Meanwhile, **giant ferns (pteridophytes)** grew tall, then fell and slowly turned into today's **coal deposits**.",
    },
    // ── 5 · Table — the timeline ─────────────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 5,
      caption: 'The story of life on a geological clock — read it top to bottom, oldest first (from NCERT §6.8)',
      headers: ['About when', 'What happened'],
      rows: [
        ['~2000 mya', 'First cellular life appears in water; some cells release O2. Single cells slowly become multi-cellular.'],
        ['~500 mya', 'Invertebrates are formed and active.'],
        ['~350 mya', 'Jawless fish evolve. Lobefins (stout-finned fish) begin moving between land and water.'],
        ['~320 mya', 'Sea weeds and a few plants exist. Plants — not animals — are the first to invade land.'],
        ['After the lobefins', 'First amphibians (live on land and water) → then reptiles with thick-shelled eggs.'],
        ['Age of reptiles (~200 million yrs)', 'Dinosaurs dominate the Earth. Giant ferns (pteridophytes) fall and form coal. Some reptiles return to water as Ichthyosaurs (~200 mya).'],
        ['~65 mya', 'Dinosaurs suddenly disappear — a mass extinction. Some say most evolved into birds.'],
        ['After the dinosaurs', 'Small shrew-like mammals — viviparous and more intelligent — take over the Earth. Flowering plants spread across the land.'],
      ],
    },
    // ── 6 · Heading — the vertebrate line ────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Vertebrate Line, Step by Step (NCERT Fig 6.10)',
      objective: "By the end of this you can trace the vertebrate ladder — jawless fish → lobefins → amphibians → reptiles → birds and mammals — and place each branch.",
    },
    // ── 7 · Interactive image — Fig 6.10 vertebrate evolution ────────────────
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'A branching evolutionary tree of vertebrates across geological periods, from jawless fish at the base rising through amphibians and reptiles to birds and mammals',
      caption: '📸 Tap each dot to walk up the vertebrate family tree, oldest at the bottom',
      generation_prompt: "Scientific textbook illustration of the evolutionary history of vertebrates through geological periods, drawn as a branching tree that rises from bottom (oldest) to top (most recent). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines; functional colours (blue-teal for water animals, brown-tan for land reptiles, muted grey for mammals). At the base, small jawless fish in water. Rising from them, a stout-finned lobefin fish crawling from water toward land. Above it, an early amphibian (frog/salamander form) straddling a shoreline. Higher, a reptile branch splitting into a large dinosaur silhouette, a fish-like Ichthyosaur returning to water, a bird, and a small shrew-like early mammal. Time periods marked as faint horizontal bands. No photorealism, no cartoon, no mascots, no modern humans.",
      hotspots: [
        { id: uuid(), x: 0.50, y: 0.86, label: 'Jawless fish (~350 mya)', detail: "The early vertebrates in water. NCERT dates jawless fish to around **350 mya**.", icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.66, label: 'Lobefins', detail: "Fish with **stout, strong fins** that could move onto land and back into water. The **Coelacanth** (caught 1938) is a living lobefin.", icon: 'circle' },
        { id: uuid(), x: 0.40, y: 0.50, label: 'First amphibians', detail: "Evolved from lobefins; lived on **both land and water**. Ancestors of today's **frogs and salamanders**.", icon: 'circle' },
        { id: uuid(), x: 0.55, y: 0.36, label: 'Reptiles', detail: "Evolved from amphibians. They laid **thick-shelled eggs** that don't dry up in the sun. Descendants: turtles, tortoises, crocodiles.", icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.30, label: 'Ichthyosaurs (~200 mya)', detail: "Land reptiles that went **back into water** to become fish-like reptiles.", icon: 'circle' },
        { id: uuid(), x: 0.68, y: 0.16, label: 'Birds', detail: "NCERT notes that some say most dinosaurs **evolved into birds**. The fossil **Archaeopteryx** links reptiles and birds.", icon: 'circle' },
        { id: uuid(), x: 0.30, y: 0.16, label: 'First mammals (shrew-like)', detail: "Small, **viviparous**, and more intelligent at sensing danger. They took over once the reptiles declined.", icon: 'circle' },
      ],
    },
    // ── 8 · Reasoning prompt — order trap ────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "NCERT says animals crawled onto dry land and became amphibians. But when those animals arrived, the land was already covered in something living. Which group set foot — or root — on land first?",
      options: [
        "Land plants",
        "Amphibians",
        "Reptiles",
        "Jawless fish",
      ],
      reveal: "The answer is **land plants**. NCERT states plainly that the **first organisms that invaded land were plants**, and that they were already **widespread on land when animals invaded land**. The tempting wrong pick is **amphibians** — they are the first land *animals*, so a student who reads 'first on land' as 'first animal on land' jumps to them. But the question is about who came first overall, and plants beat the animals to it. Reptiles and jawless fish came later still (reptiles evolved from amphibians; jawless fish never truly left the water).",
      difficulty_level: 2,
    },
    // ── 9 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember',
      title: 'Anchor Dates — Burn These In',
      markdown: "- **~2000 mya** — first **cellular** life appears.\n- **~500 mya** — **invertebrates** formed and active.\n- **~350 mya** — **jawless fish**; **lobefins** move between land and water.\n- **~320 mya** — sea weeds and few plants; **plants invade land first** (before animals).\n- **~200 mya** — some reptiles return to water as **Ichthyosaurs**; age of reptiles runs ~200 million years.\n- **~65 mya** — **dinosaurs suddenly disappear**; **mammals** then take over.\n- **Order to never scramble:** cells → invertebrates → fish → land plants → amphibians → reptiles → birds & mammals.",
    },
    // ── 10 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Plants invaded land before animals.** NCERT's exact line — \"the first organisms that invaded land were plants\" — is lifted straight into MCQs. If an option says animals came ashore first, it's a trap.\n\n**Lobefins → first amphibians.** The stout-finned fish became amphibians; the **Coelacanth (1938, South Africa)** is the living lobefin they love to name.\n\n**Reptile eggs are the giveaway.** Reptiles laid **thick-shelled eggs that don't dry up** — that single feature separates them from amphibians on the exam.\n\n**Dinosaurs vanished ~65 mya** — memorise this number and the fact that **mammals rose after** them.\n\n**Classic NEET question:** \"Which of the following invaded the land first?\" → **Plants.** A close cousin: \"The dinosaurs became extinct about ___ million years ago.\" → **65.**",
    },
    // ── 11 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "So the tape of life runs from a single cell in the sea, through fish that learned to walk, reptiles that ruled and fell, and finally the mammals that inherited the Earth. There is one more branch of that mammal story left to tell — the branch that leads to us. Next, you'll follow the **origin and evolution of man**.",
    },
    // ── 12 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "According to NCERT, the first cellular forms of life appeared on Earth about how many million years ago (mya)?",
          options: [
            "500 mya",
            "350 mya",
            "2000 mya",
            "65 mya",
          ],
          correct_index: 2,
          explanation: "NCERT dates the first cellular life to about 2000 mya. 500 mya is when invertebrates were formed; 350 mya is when jawless fish evolved; and 65 mya is when the dinosaurs disappeared — all later milestones that examiners slot in as decoys for the very first one.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which group of organisms was the first to invade the land?",
          options: [
            "Plants",
            "Amphibians",
            "Reptiles",
            "Jawless fish",
          ],
          correct_index: 0,
          explanation: "NCERT states the first organisms to invade land were plants, already widespread before animals arrived. Amphibians are the tempting choice because they were the first land animals — but plants beat every animal to the land. Reptiles evolved later from amphibians, and jawless fish stayed in the water.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "The dinosaurs suddenly disappeared from the Earth about how long ago?",
          options: [
            "2000 mya",
            "350 mya",
            "500 mya",
            "65 mya",
          ],
          correct_index: 3,
          explanation: "NCERT puts the dinosaurs' sudden disappearance at about 65 mya, after which mammals took over. 2000 mya is the origin of cellular life, 500 mya the appearance of invertebrates, and 350 mya the jawless fish — much older events used here as date traps.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which sequence shows the correct order in which these vertebrate groups appeared, oldest first?",
          options: [
            "Amphibians → jawless fish → reptiles → mammals",
            "Jawless fish → amphibians → reptiles → mammals",
            "Reptiles → amphibians → jawless fish → mammals",
            "Jawless fish → reptiles → amphibians → mammals",
          ],
          correct_index: 1,
          explanation: "The NCERT order is jawless fish → amphibians (from lobefins) → reptiles (from amphibians) → mammals (after the reptiles declined). The other options scramble that ladder — putting amphibians or reptiles before the fish, or swapping amphibians and reptiles — which is exactly the kind of sequence trap NEET sets.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
