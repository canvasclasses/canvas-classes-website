'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'decomposition',
  title: 'Decomposition — How the Dead Feed the Living',
  subtitle: 'Every fallen leaf, every dead body, every bit of dung is taken apart by earthworms, bacteria and fungi and handed back to the soil as carbon dioxide, water and nutrients — through five steps you must know in order.',
  page_number: 3,
  page_type: 'lesson',
  tags: ['ecosystem', 'decomposition', 'detritus', 'humus', 'nutrient-cycling'],
  glossary: [
    { term: 'decomposition', definition: 'The process in which decomposers break down complex organic matter into inorganic substances like carbon dioxide, water and nutrients.' },
    { term: 'detritus', definition: 'The raw material for decomposition — dead plant remains such as leaves, bark and flowers, plus dead remains of animals including fecal matter.' },
    { term: 'detritivore', definition: 'An organism, such as the earthworm, that breaks detritus down into smaller particles.' },
    { term: 'fragmentation', definition: 'The step in which detritivores break detritus into smaller particles.' },
    { term: 'leaching', definition: 'The step in which water-soluble inorganic nutrients go down into the soil horizon and get precipitated as unavailable salts.' },
    { term: 'catabolism', definition: 'The step in which bacterial and fungal enzymes degrade detritus into simpler inorganic substances.' },
    { term: 'humification', definition: 'The step that leads to the accumulation of humus — a dark coloured amorphous substance highly resistant to microbial action.' },
    { term: 'humus', definition: 'A dark coloured amorphous substance formed by humification. It is highly resistant to microbial action, decomposes extremely slowly, and being colloidal it serves as a reservoir of nutrients.' },
    { term: 'mineralisation', definition: 'The process in which humus is further degraded by some microbes and inorganic nutrients are released.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A damp forest floor at dawn where fallen leaves and bark are slowly sinking into dark soil, an earthworm half-visible among them',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A damp forest floor just before dawn, seen close and low to the ground. A thick litter of fallen leaves, curls of bark and a few spent flowers lies half-buried in dark, moist earth; the leaves at the bottom of the pile are ragged and skeletal, dissolving into the soil, while those on top are still whole. An earthworm is partly visible sliding between two leaves, and faint pale threads of fungus lace through the litter. Soft, low, warm light from one side catching the mist rising off the wet ground. Quiet, unhurried mood — nothing dramatic, just the ground eating what fell on it. Painterly, atmospheric illustration style, dark background tones throughout (#0a0a0a base), muted browns and deep greens, no text, no labels, no diagram elements.",
    },
    // ── fun_fact ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: "Why the Farmer Calls the Earthworm a Friend",
      markdown: "You may have heard the earthworm called the **farmer's 'friend'**. It has earned the title twice over. It **helps in the breakdown of complex organic matter**, and it **loosens the soil** while doing it. Think about what that means on the ground: the worm doesn't digest a dead leaf back into the field by itself — it chews the leaf into small pieces, and by doing so hands billions of bacteria and fungi far more surface to work on. One slow, blind animal, and the whole recycling line behind it speeds up.",
    },
    // ── core concept: what decomposition is, and detritus ────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "**Decomposers break down complex organic matter into inorganic substances like carbon dioxide, water and nutrients** — and that process is called **decomposition**. Read that line slowly, because it fixes the direction: complex → simple, organic → inorganic. Producers build organic matter out of simple inorganic stuff; decomposers take it apart again and put those simple materials back where the producers can reach them.\n\nWhat exactly are they taking apart? **Dead plant remains such as leaves, bark and flowers, and dead remains of animals, including fecal matter, constitute detritus** — and **detritus is the raw material for decomposition**. Notice that dung counts. Anything that was once living tissue and has stopped being alive joins the pile.",
    },
    // ── heading: the five steps ──────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Five Steps That Take Detritus Apart',
      objective: 'By the end of this you can name fragmentation, leaching, catabolism, humification and mineralisation in order, say who or what carries out each one, and say what each step leaves behind.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**The important steps in the process of decomposition are fragmentation, leaching, catabolism, humification and mineralisation.** Take them one at a time.\n\n**Fragmentation.** **Detritivores (e.g., earthworm) break down detritus into smaller particles.** That's all fragmentation is — the pile gets chopped smaller. No chemistry yet, just physical breaking.\n\n**Leaching.** By the process of leaching, **water-soluble inorganic nutrients go down into the soil horizon and get precipitated as unavailable salts**. Water seeps through the litter, dissolves nutrients, carries them down — and they settle as salts the plants can no longer take up. Leaching is the step where nutrients get *lost from circulation*, not released.\n\n**Catabolism.** **Bacterial and fungal enzymes degrade detritus into simpler inorganic substances.** This is the real chemical dismantling, and it is microbes — not the earthworm — doing it.\n\n**Humification.** Humification leads to **accumulation of a dark coloured amorphous substance called humus**. Humus is **highly resistant to microbial action and undergoes decomposition at an extremely slow rate**. Being **colloidal in nature it serves as a reservoir of nutrients** — a slow-release nutrient bank sitting in the soil.\n\n**Mineralisation.** **The humus is further degraded by some microbes and release of inorganic nutrients occurs by the process known as mineralisation.** This is the step that finally hands the nutrients back.\n\nOne warning that NEET leans on: **all the above steps in decomposition operate simultaneously on the detritus.** The list is an order you memorise, not a queue the detritus stands in. On any handful of forest floor, worms are fragmenting, water is leaching, enzymes are catabolising and humus is being built and mineralised all at once. **Humification and mineralisation occur during decomposition in the soil.**",
    },
    // ── interactive image: the decomposition cycle ───────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Diagram of the decomposition cycle in a terrestrial ecosystem showing detritus, fragmentation by an earthworm, leaching down the soil horizon, catabolism by bacteria and fungi, humus accumulation and mineralisation',
      caption: '📸 Tap each dot to follow detritus through all five steps — and see which one loses nutrients instead of releasing them',
      generation_prompt: "Scientific textbook illustration of the decomposition cycle in a terrestrial ecosystem. Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines, thin white leader lines, labels in white text. Layout: a vertical soil profile seen in cut-away section, with the litter layer on top and the soil horizon below, arranged so the five steps read left-to-right and top-to-bottom. TOP-LEFT: a heap of detritus on the soil surface — recognisable fallen leaves, a curl of bark, a flower and a small pellet of animal fecal matter, drawn in brown and tan to read as dead plant and animal remains. TOP-CENTRE: an earthworm drawn among the litter with the litter beside it shown broken into many small brown particles, indicating fragmentation. LEFT SIDE, going downward: thin blue arrows of water carrying small dissolved nutrient dots down through the cut-away soil horizon, ending in small pale precipitated salt crystals deep in the soil (leaching). CENTRE: rod-shaped bacteria and branching fungal hyphae drawn on the small brown particles, with arrows leading to simple inorganic molecules, indicating catabolism. BOTTOM-CENTRE: a broad dark, structureless amorphous layer of humus accumulated in the soil, drawn in very dark brown-black with no defined shape, clearly different in texture from the recognisable litter above. BOTTOM-RIGHT: microbes on the humus layer with arrows releasing small nutrient dots upward back into the soil toward plant roots (mineralisation). Functional colours: brown/tan = dead and woody material, blue = water, green = living plant roots at the right edge, dark brown-black = humus. Biologically accurate proportions, no photorealism, no cartoon, no mascots, standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.11, y: 0.18, label: 'Detritus', icon: 'circle',
          detail: 'The **raw material for decomposition** — dead plant remains such as **leaves, bark and flowers**, plus dead remains of animals **including fecal matter**.' },
        { id: uuid(), x: 0.36, y: 0.16, label: 'Fragmentation', icon: 'circle',
          detail: '**Detritivores (e.g., earthworm) break down detritus into smaller particles.** A purely physical breaking-up — the chemistry comes later.' },
        { id: uuid(), x: 0.10, y: 0.62, label: 'Leaching', icon: 'circle',
          detail: '**Water-soluble inorganic nutrients go down into the soil horizon and get precipitated as unavailable salts.** This step moves nutrients *out of reach*, so do not describe it as a release of nutrients.' },
        { id: uuid(), x: 0.50, y: 0.45, label: 'Catabolism', icon: 'circle',
          detail: '**Bacterial and fungal enzymes degrade detritus into simpler inorganic substances.** The enzymes belong to the microbes, not to the earthworm.' },
        { id: uuid(), x: 0.44, y: 0.82, label: 'Humification', icon: 'circle',
          detail: 'Leads to accumulation of **humus** — a **dark coloured amorphous substance**, **highly resistant to microbial action**, decomposing at an **extremely slow rate**. Being **colloidal**, it is a **reservoir of nutrients**.' },
        { id: uuid(), x: 0.80, y: 0.78, label: 'Mineralisation', icon: 'circle',
          detail: 'The **humus is further degraded by some microbes** and **inorganic nutrients are released**. Both humification and mineralisation occur **in the soil**.' },
      ],
    },
    // ── heading: what controls the rate ──────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'What Speeds Decomposition Up, and What Stalls It',
      objective: 'By the end of this you can predict whether a given litter will rot fast or slowly from two things — what the detritus is made of, and what the climate is doing.',
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "First, the one condition the whole process runs on: **decomposition is largely an oxygen-requiring process.** Those bacterial and fungal enzymes need oxygen to do their work. Take the oxygen away and the line stops.\n\nAfter that, **the rate of decomposition is controlled by chemical composition of detritus and climatic factors** — two levers, and NEET tests both.\n\n**Lever 1 — what the detritus is made of.** In a particular climatic condition, decomposition is **slower if detritus is rich in lignin and chitin**, and **quicker if detritus is rich in nitrogen and water-soluble substances like sugars**. So a pile of woody bark and insect exoskeletons sits around; a pile of soft, sugary, nitrogen-rich leaves disappears fast.\n\n**Lever 2 — climate.** **Temperature and soil moisture are the most important climatic factors that regulate decomposition**, and they work **through their effects on the activities of soil microbes** — that's the mechanism, the weather doesn't rot the leaf itself, it decides how hard the microbes can work. **Warm and moist environment favour decomposition, whereas low temperature and anaerobiosis inhibit decomposition, resulting in build up of organic materials.** That last phrase explains a lot of the world: cold bogs and waterlogged ground pile up undecomposed organic matter precisely because the microbes there are cold and starved of oxygen.\n\nSo detritus is broken down and its nutrients are handed back. The energy those dead leaves once held, though, is a separate story — and the next page follows that energy from the sun onward.",
    },
    // ── reasoning check ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "Two piles of litter are left on the same forest floor, in the same warm, moist weather. Pile A is dry bark and shed insect exoskeletons. Pile B is soft young leaves rich in nitrogen and sugars. Pile A is still recognisable months later while Pile B has vanished. What explains this?",
      options: [
        'Pile A is exposed to a lower temperature and soil moisture than Pile B, so its microbes are less active',
        'Pile A is rich in lignin and chitin, which makes decomposition slower, while Pile B is rich in nitrogen and water-soluble sugars, which makes it quicker',
        'Pile A has already completed humification, so no further breakdown of it is possible',
        'Pile A is detritus while Pile B is not, so only Pile B can be acted on by decomposers',
      ],
      correct_index: 1,
      reveal: "The rate of decomposition is controlled by **two** things — the chemical composition of the detritus and climatic factors. Here the climate is held identical for both piles, so the difference must come from the chemistry: detritus **rich in lignin and chitin decomposes slower**, and detritus **rich in nitrogen and water-soluble substances like sugars decomposes quicker**. Bark supplies the lignin and insect exoskeletons the chitin. The first option is the tempting one because temperature and soil moisture *are* the most important climatic regulators — but the question fixes the weather as the same for both piles, so climate cannot be the variable. And Pile A is certainly detritus: dead plant remains such as bark, and dead animal remains, are exactly what detritus means.",
      difficulty_level: 3,
    },
    // ── remember ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'The Order, and the Two Words Students Swap',
      markdown: "- **The five steps in order: Fragmentation → Leaching → Catabolism → Humification → Mineralisation.** A line to hold it: **F**armer's **L**eaf **C**annot **H**old **M**inerals.\n- But remember the catch: **all the steps operate simultaneously on the detritus.** The order is for your memory, not for the soil.\n- **Fragmentation = detritivores (earthworm), physical.** **Catabolism = bacterial and fungal enzymes, chemical.** Don't credit the worm with the enzymes.\n- **Leaching loses nutrients** — water-soluble inorganic nutrients go down the soil horizon and are **precipitated as unavailable salts**. **Mineralisation releases nutrients** from humus. These two run in opposite directions.\n- **Humification makes humus. Mineralisation destroys humus.** Humus is **dark coloured, amorphous, highly resistant to microbial action, decomposes extremely slowly, colloidal, a reservoir of nutrients**.\n- **Decomposition is largely an oxygen-requiring process.** **Warm + moist → favours it. Low temperature + anaerobiosis → inhibits it → build up of organic materials.**\n- **Rich in lignin and chitin → slower. Rich in nitrogen and water-soluble sugars → quicker.**",
    },
    // ── exam_tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Humification vs mineralisation:** the single most examined pair on this page. **Humification = accumulation of humus. Mineralisation = humus is further degraded by some microbes, releasing inorganic nutrients.** If a question says 'release of inorganic nutrients from humus', the answer is mineralisation, never humification.\n\n**The humus description is lifted verbatim:** dark coloured, **amorphous**, **highly resistant to microbial action**, decomposes at an **extremely slow rate**, **colloidal**, **reservoir of nutrients**. Every one of those words has been an option somewhere.\n\n**Leaching's precipitate:** NCERT says the nutrients get precipitated as **unavailable salts**. The word *unavailable* is the whole point — leaching is a loss, not a supply.\n\n**Detritivore:** the standard example is the **earthworm**, and its step is **fragmentation**.\n\n**Oxygen:** 'Decomposition is largely an **oxygen-requiring** process' is a direct one-liner. Pair it with **anaerobiosis inhibits decomposition**.\n\n**Classic NEET question:** \"The process by which humus is further degraded by some microbes with release of inorganic nutrients is called?\" → **Mineralisation** (not humification — humification is the step that *built* the humus).",
    },
    // ── inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which sequence correctly lists the important steps in the process of decomposition?',
          options: [
            'Leaching → fragmentation → humification → catabolism → mineralisation',
            'Fragmentation → catabolism → leaching → mineralisation → humification',
            'Fragmentation → leaching → catabolism → humification → mineralisation',
            'Catabolism → fragmentation → leaching → mineralisation → humification',
          ],
          correct_index: 2,
          explanation: 'NCERT gives the steps as fragmentation, leaching, catabolism, humification and mineralisation. The commonest trap is placing mineralisation before humification — humus must first be accumulated by humification before microbes can degrade it in mineralisation, so mineralisation is always last.',
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Water-soluble inorganic nutrients go down into the soil horizon and get precipitated as unavailable salts. This step is called:',
          options: [
            'Mineralisation',
            'Catabolism',
            'Humification',
            'Leaching',
          ],
          correct_index: 3,
          explanation: 'That is the definition of leaching, and the word "unavailable" marks it as a loss of nutrients from circulation. Mineralisation is the tempting pick because it also involves inorganic nutrients moving in soil — but mineralisation releases them from humus, while leaching takes them out of reach.',
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which statement about humus is correct?',
          options: [
            'It is a crystalline substance that is readily attacked by microbes and decomposes within a few days of forming',
            'It is a dark coloured amorphous substance that is highly resistant to microbial action and serves as a reservoir of nutrients',
            'It is formed by mineralisation and is destroyed by humification, which breaks it down into simpler inorganic substances',
            'It is a water-soluble salt formed by leaching deep in the soil horizon and is taken up readily by plant roots',
          ],
          correct_index: 1,
          explanation: 'NCERT describes humus as dark coloured, amorphous, highly resistant to microbial action, decomposing at an extremely slow rate, and colloidal, so it acts as a reservoir of nutrients. The third option reverses the two processes — humification forms humus and mineralisation degrades it — and humus is amorphous and colloidal, not crystalline or a leached salt.',
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'A cold, waterlogged bog shows a thick build up of undecomposed organic material. Which explanation matches NCERT?',
          options: [
            'The detritus there is rich in nitrogen and water-soluble sugars, which slows decomposition down',
            'Detritivores such as earthworms carry out catabolism only in warm soils, and catabolism is the only step that matters',
            'Low temperature and anaerobiosis inhibit decomposition, since decomposition is largely an oxygen-requiring process',
            'Leaching has removed the humus from the bog, leaving the detritus with nothing to decompose it',
          ],
          correct_index: 2,
          explanation: 'Warm and moist conditions favour decomposition, while low temperature and anaerobiosis inhibit it and result in a build up of organic materials — and decomposition is largely an oxygen-requiring process, which is why waterlogging matters. The first option inverts the chemistry rule: nitrogen and water-soluble sugars make decomposition quicker, while lignin and chitin make it slower. Also note catabolism is carried out by bacterial and fungal enzymes, not by earthworms.',
          difficulty_level: 3,
        },
      ],
    },
  ],
};
