'use strict';
/**
 * Class 12 Biology — Chapter 6: Evolution
 * Page 4 — Adaptive Radiation.
 *
 * Source of truth: NCERT Class 12 Ch.6 (lebo106.txt), §6.4 "WHAT IS
 * ADAPTIVE RADIATION?" and Figs 6.5 / 6.6 / 6.7. Rule 0: every fact,
 * name and example here traces to that text — Darwin at the Galapagos,
 * the finches evolving from a seed-eating ancestor into insectivorous and
 * vegetarian forms, the definition of adaptive radiation, the Australian
 * marsupials radiating from one ancestral stock, and NCERT's own framing
 * of convergent evolution (more than one adaptive radiation in an isolated
 * area, e.g. placental wolf vs Tasmanian wolf-marsupial). Nothing invented.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'adaptive-radiation',
  title: 'Adaptive Radiation',
  subtitle: "One plain seed-eating finch, dropped on a chain of islands, became a whole fan of different birds — and the same thing happened to Australia's marsupials. Here's the process that does it, and the surprising twist when it happens twice in one place.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['adaptive-radiation', 'darwins-finches', 'marsupials', 'convergent-evolution', 'galapagos', 'evolution'],
  glossary: [
    { term: 'adaptive radiation', definition: 'The process in which different species evolve in a given geographical area, all starting from one point (one ancestral type) and literally spreading out, or radiating, into other habitats. Darwin\'s finches are one of the best examples.' },
    { term: "Darwin's finches", definition: 'The many varieties of small black finches Darwin found on the Galapagos Islands. They all evolved on the islands themselves from an original seed-eating form, developing altered beaks that let them become insectivorous and vegetarian.' },
    { term: 'Galapagos Islands', definition: 'The chain of islands Darwin visited during his journey, where he saw an amazing diversity of creatures — including the finches that led him to the idea of adaptive radiation.' },
    { term: 'marsupials', definition: 'A group of Australian mammals. A number of different marsupials, each unlike the others, evolved from a single ancestral stock, all within the Australian island continent — a second classic example of adaptive radiation.' },
    { term: 'ancestral stock', definition: 'The single original type of organism from which a radiating group of species descends. The Australian marsupials all trace back to one ancestral stock.' },
    { term: 'convergent evolution', definition: 'When more than one adaptive radiation happens in the same isolated geographical area, producing forms that end up looking similar — for example the placental wolf and the Tasmanian wolf-marsupial.' },
  ],
  blocks: [
    {
      id: '3f9a1c72-8b04-4e61-9d2a-5c7e0b1f8a34',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A cluster of small dark finches perched on branches across rocky volcanic islands at dawn',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A chain of rugged volcanic islands rising from a calm ocean at first light, low warm sun grazing the dark lava rock and dry scrub. Scattered across the foreground branches and cactus, several small dark finches perch at different heights, each bird's head turned so its beak is visible in silhouette — the beaks subtly differing in size and shape from bird to bird. Painterly and atmospheric, naturalistic Galapagos mood, deep dark background tones overall (#0a0a0a base), shallow depth of field, soft dawn haze. No text, no labels, no diagram elements, no arrows.",
    },
    {
      id: '4a0b2d83-9c15-4f72-8e3b-6d8f1c209b45',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'One Bird Became Thirteen',
      markdown: "When Darwin landed on the Galapagos, the little black finches hopping around all looked like the same kind of bird at first glance. They aren't. Naturalists later counted about **thirteen different species** of these finches — and every one of them traces back to a **single seed-eating ancestor** that reached the islands and then split into forms with completely different beaks. One bird, thirteen ways of making a living. That splitting-apart is the whole idea of this page.",
    },
    {
      id: '5b1c3e94-0d26-4a83-9f4c-7e9a2d310c56',
      type: 'text',
      order: 2,
      markdown: "During his journey, Darwin went to the **Galapagos Islands** and saw an amazing diversity of creatures. The ones that caught his attention were small black birds — later called **Darwin's Finches**. What amazed him was that there were **many varieties of finches on the same island**. He worked out that all these varieties had **evolved on the island itself**, starting from one kind of bird.\n\nThat single observation is the seed of a big idea: give one ancestral type an open, isolated place with lots of empty ways to live, and over time it can branch out into many species, each suited to a different habitat. Biologists call that process **adaptive radiation**, and the finches are the textbook picture of it.",
    },
    {
      id: '6c2d4fa5-1e37-4b94-8a5d-8f0b3e421d67',
      type: 'heading',
      order: 3,
      level: 2,
      text: "Darwin's Finches — One Seed-Eater, Many Beaks",
      objective: "By the end of this you can say exactly what adaptive radiation means and use the finches to explain it.",
    },
    {
      id: '7d3e50b6-2f48-4ca5-9b6e-9a1c4f532e78',
      type: 'text',
      order: 4,
      markdown: "Here is the finch story in order. The **original** finches had **seed-eating features** — a beak built for cracking seeds. From that starting point, **many other forms with altered beaks arose**. Some ended up with beaks suited to catching insects and became **insectivorous** finches; others developed beaks suited to plant food and became **vegetarian** finches. The birds spread out across the islands' different habitats, each new beak matching a new way of feeding.\n\nNow put a name to it. **Adaptive radiation** is the evolution of different species in a given geographical area, **starting from a point** (one ancestral type) and literally **radiating out to other areas of geography** — that is, other habitats. Darwin's finches are one of the **best examples** of this phenomenon. Read the definition again with the birds in mind: one starting point (the seed-eater), one geographical area (the islands), many species radiating into many habitats. That is adaptive radiation.",
    },
    {
      id: '8e4f61c7-3059-4db6-8c7f-0b2d5a643f89',
      type: 'interactive_image',
      order: 5,
      src: '',
      alt: "A spread of Darwin's finches showing several head profiles with differently shaped beaks radiating from a common seed-eating ancestor",
      caption: '📸 Tap each dot to see how one seed-eating beak radiated into different feeding forms',
      generation_prompt: "Scientific textbook illustration matching NCERT Fig 6.5, 'Variety of beaks of finches that Darwin found in Galapagos Island'. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Show four to five finch head-and-shoulder profiles arranged in a gentle fan or radiating arc, each drawn in clean white outline, biologically accurate finch proportions. The differences must be in the BEAK: one central/lower profile has a large, heavy, deep cone-shaped beak (the ancestral seed-eating / seed-crushing form); another has a thinner, more pointed slender beak (insect-catching form); another has a stout curved parrot-like beak suited to plant material (vegetarian form); one or two show intermediate beak shapes. Thin faint white leader lines or a subtle branching line can suggest they all radiate from a single common origin point at the base of the fan. Soft functional colour: muted brown-grey plumage tint on the birds, no bright colours. No text or labels baked into the image, no photorealism, no cartoon, no mascots — standard biology textbook illustration conventions.",
      hotspots: [
        { id: '9a01c2d3-4160-4ec7-9d80-1c3e6b754a01', x: 0.5, y: 0.85, label: 'The common origin', detail: "All the varieties trace back to **one ancestral seed-eating finch**. Darwin worked out they **evolved on the island itself** — they did not arrive already different.", icon: 'circle' },
        { id: '9a02c2d3-4260-4ec7-9d80-1c3e6b754a02', x: 0.5, y: 0.55, label: 'Seed-eating beak (the original)', detail: "The **original seed-eating features** — a heavy beak for cracking seeds. This is the **starting point** from which all the altered beaks arose.", icon: 'circle' },
        { id: '9a03c2d3-4360-4ec7-9d80-1c3e6b754a03', x: 0.22, y: 0.32, label: 'Insectivorous form', detail: "A slimmer, more pointed beak that suits catching **insects**. NCERT lists this as one of the forms that arose from the seed-eating ancestor.", icon: 'circle' },
        { id: '9a04c2d3-4460-4ec7-9d80-1c3e6b754a04', x: 0.78, y: 0.32, label: 'Vegetarian form', detail: "A beak suited to eating **plant matter**. The **vegetarian** finches are the other feeding type NCERT names arising from the same ancestor.", icon: 'circle' },
        { id: '9a05c2d3-4560-4ec7-9d80-1c3e6b754a05', x: 0.5, y: 0.1, label: 'Radiating into habitats', detail: "As the beaks changed, the finches spread into the islands' **different habitats** — that spreading-out from one point is exactly what makes this **adaptive radiation**.", icon: 'circle' },
      ],
    },
    {
      id: 'af5a72d8-416a-4fc7-8d81-2c4e7b865b9a',
      type: 'heading',
      order: 6,
      level: 2,
      text: 'Australian Marsupials — and When Radiation Happens Twice',
      objective: "By the end of this you can give a second example of adaptive radiation and explain NCERT's meaning of convergent evolution.",
    },
    {
      id: 'b06b83e9-527b-4ad8-9e92-3d5f8c976cab',
      type: 'text',
      order: 7,
      markdown: "The finches are not the only case. **Australian marsupials** are another example. A number of marsupials, **each different from the other**, evolved from a single **ancestral stock** — and all of it happened **within the Australian island continent**. Same recipe as the finches: one starting stock, one isolated area, many species radiating into many habitats.\n\nHere comes the twist. In Australia, the **placental mammals** also went through their own adaptive radiation, evolving into varieties of placental mammals — and, strikingly, each one turned out to look **'similar' to a corresponding marsupial**. NCERT's own example is the **placental wolf and the Tasmanian wolf-marsupial**: two animals from two completely separate radiations that ended up resembling each other. When **more than one adaptive radiation** appears to have happened in the same **isolated geographical area** (with its different habitats), NCERT calls this **convergent evolution**. So the marsupial radiation and the placental radiation, running side by side in Australia and producing look-alikes, is the picture to hold for convergent evolution.\n\nNext we turn from these examples to how biological evolution actually works.",
    },
    {
      id: 'c17c94fa-638c-4be9-8fa3-4e6a9da87bbc',
      type: 'reasoning_prompt',
      order: 8,
      reasoning_type: 'logical',
      prompt: "In Australia the marsupials radiated from one ancestral stock, and separately the placental mammals radiated too — and a placental wolf ended up looking like a Tasmanian wolf-marsupial. Using NCERT's framing, how do adaptive radiation and convergent evolution relate here?",
      options: [
        "Convergent evolution is just another name for a single adaptive radiation — the two words mean the same thing",
        "Convergent evolution happens when more than one adaptive radiation occurs in the same isolated area, and the separate radiations produce forms that look similar",
        "The placental wolf and the marsupial wolf are the same species that split during one radiation",
        "Convergent evolution happens first, and adaptive radiation is what later makes the look-alikes different again",
      ],
      reveal: "NCERT defines convergent evolution here as more than one adaptive radiation occurring in one isolated geographical area — the marsupial radiation and the placental radiation both playing out in Australia, ending in look-alikes like the placental wolf and the Tasmanian wolf-marsupial. So convergent evolution is built out of two adaptive radiations, not the same thing as one radiation. The look-alikes are not one species that split — they come from two entirely separate stocks. And the order in the last option is backwards: the two radiations happen, and their converging on similar forms is what we call convergent evolution.",
      difficulty_level: 2,
    },
    {
      id: 'd28da50b-749d-4cfa-9004-5f7b0eb98ccd',
      type: 'callout',
      order: 9,
      variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Adaptive radiation:** different species evolving in a given geographical area, **starting from one point** and **radiating** out into other habitats.\n- **Darwin's finches:** the best example. Many varieties on the Galapagos, **all evolved on the island itself** from an **original seed-eating** form → **insectivorous** and **vegetarian** finches with altered beaks.\n- **Australian marsupials:** the second example. Many different marsupials from **one ancestral stock**, all **within Australia**.\n- **Convergent evolution (NCERT's sense):** **more than one adaptive radiation** in the **same isolated area**, giving look-alikes — e.g. **placental wolf** vs **Tasmanian wolf-marsupial**.",
    },
    {
      id: 'e39eb61c-85ae-4d0b-8115-6a8c1fca9dde',
      type: 'callout',
      order: 10,
      variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Definition lifted verbatim:** NEET loves the exact NCERT line — adaptive radiation is *evolution of different species in a given geographical area starting from a point and radiating to other habitats*. Memorise \"starting from a point → radiating.\"\n\n**The two go-to examples:** Darwin's finches (Galapagos) and Australian marsupials. If a question asks for an example of adaptive radiation, one of these two is the answer.\n\n**The finch trap:** the **original** feeding form is **seed-eating**; the insectivorous and vegetarian forms came *later* from altered beaks. Options that make an insect-eating or vegetarian finch the ancestor are wrong.\n\n**Convergent evolution wording:** NCERT ties it to **more than one adaptive radiation in one isolated area** producing similar forms. **Classic NEET question:** \"The placental wolf and the Tasmanian wolf-marsupial resemble each other. This illustrates —\" → **convergent evolution**.",
    },
    {
      id: 'f40fc72d-96bf-4e1c-9226-7b9d20db0eef',
      type: 'inline_quiz',
      order: 11,
      pass_threshold: 0.67,
      questions: [
        {
          id: '0a51d83e-a7c0-4f2d-8337-8cae31ec1ff0',
          question: 'Which statement best describes adaptive radiation?',
          options: [
            'Two unrelated species slowly coming to look alike because they live in different areas',
            'Different species evolving in a given geographical area from one starting point and radiating into other habitats',
            'A single species being wiped out and replaced by an unrelated group',
            'One species changing gradually into a different single species over time',
          ],
          correct_index: 1,
          explanation: "Adaptive radiation is different species evolving in a given geographical area, all from one point, and radiating out into other habitats — exactly what Darwin's finches did. The first option describes converging look-alikes (part of convergent evolution), not a radiation. Replacement of one group by another, and one species simply turning into another single species, are not what 'radiation' means — the key word is many forms fanning out from one origin.",
          difficulty_level: 1,
        },
        {
          id: '1b62e94f-b8d1-4a3e-9448-9dbf42fd2001',
          question: "In Darwin's finches, which feeding form was the ORIGINAL one, from which the others arose?",
          options: [
            'Insectivorous, with a slender pointed beak',
            'Vegetarian, with a stout plant-eating beak',
            'A mixed nectar-feeding form unique to one island',
            'Seed-eating, with a beak built for cracking seeds',
          ],
          correct_index: 3,
          explanation: "NCERT is explicit that the finches started from original seed-eating features, and from that base many forms with altered beaks arose to become insectivorous and vegetarian finches. So the insectivorous and vegetarian beaks are the derived, later forms — not the ancestor. A nectar-feeding form is not mentioned in NCERT at all, making it a distractor.",
          difficulty_level: 2,
        },
        {
          id: '2c73fa50-c9e2-4b4f-8559-0ec053fe3112',
          question: 'The placental wolf and the Tasmanian wolf-marsupial look strikingly similar even though they come from separate radiations in Australia. NCERT uses this to illustrate:',
          options: [
            'Convergent evolution',
            'Adaptive radiation of the finches',
            'Natural selection acting against a single population',
            'Genetic drift in an island population',
          ],
          correct_index: 0,
          explanation: "NCERT frames this pair as convergent evolution — the result of more than one adaptive radiation (marsupial and placental) occurring in the same isolated area and producing look-alike forms. It is not the finch radiation (wrong example and wrong continent), and the resemblance of two separately evolved animals is not what natural selection on one population or genetic drift describes.",
          difficulty_level: 3,
        },
        {
          id: '3d840b61-daf3-4c50-9660-1fd164094223',
          question: 'Which of these is a correct example of adaptive radiation as given in NCERT?',
          options: [
            'The melanised and light-coloured forms of a single moth species in England',
            'Bacteria becoming resistant to an antibiotic over a few generations',
            'A number of different marsupials evolving from one ancestral stock within Australia',
            'The similar body shape of a shark, a dolphin and an extinct marine reptile',
          ],
          correct_index: 2,
          explanation: "The Australian marsupials — many different forms radiating from one ancestral stock within one isolated continent — is exactly NCERT's second example of adaptive radiation, alongside Darwin's finches. The moth example is industrial melanism (natural selection within one species), antibiotic resistance is another natural-selection case, and shark/dolphin body shape is about analogous look-alikes, not one stock radiating into many species.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
