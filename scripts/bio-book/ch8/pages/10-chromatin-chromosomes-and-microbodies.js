'use strict';
const { v4: uuid } = require('uuid');

const chromosomeTypeHotspots = [
  {
    id: uuid(), x: 0.15, y: 0.50, label: 'Metacentric', icon: 'circle',
    detail: "Centromere sits **right in the middle** → **two equal arms**. The most symmetrical of the four types.",
  },
  {
    id: uuid(), x: 0.38, y: 0.50, label: 'Sub-metacentric', icon: 'circle',
    detail: "Centromere sits **slightly away from the middle** → **one shorter arm and one longer arm**.",
  },
  {
    id: uuid(), x: 0.62, y: 0.50, label: 'Acrocentric', icon: 'circle',
    detail: "Centromere sits **close to one end** → **one extremely short arm and one very long arm**.",
  },
  {
    id: uuid(), x: 0.85, y: 0.50, label: 'Telocentric', icon: 'circle',
    detail: "Centromere sits **at the very end** — a **terminal** position → essentially **one visible arm**.",
  },
];

module.exports = {
  slug: 'chromatin-chromosomes-and-microbodies',
  title: 'Chromatin, Chromosomes, and Microbodies',
  subtitle: "The same DNA in your nucleus wears two completely different shapes, depending on whether the cell is resting or dividing — and this page is where the whole chapter's organelles finally add up to one working cell.",
  page_number: 10,
  page_type: 'lesson',
  tags: ['cell-the-unit-of-life', 'chromatin', 'chromosomes', 'chapter-synthesis'],
  glossary: [
    { term: 'chromatin', definition: 'The loose, indistinct network of nucleoprotein fibres present in an interphase (resting) nucleus — made of DNA, basic proteins called histones, some non-histone proteins, and RNA.' },
    { term: 'chromosome', definition: 'The structured form the same chromatin material condenses into during different stages of cell division. Visible only in a dividing cell, never in a resting one.' },
    { term: 'centromere', definition: "A chromosome's primary constriction. Holds the two chromatids of a chromosome together." },
    { term: 'kinetochore', definition: 'A disc-shaped structure present on the sides of the centromere.' },
    { term: 'chromatid', definition: 'One of the two strands of a fully replicated chromosome, held together by the centromere.' },
    { term: 'metacentric', definition: 'A chromosome type with the centromere in the middle, giving two equal arms.' },
    { term: 'sub-metacentric', definition: 'A chromosome type with the centromere slightly away from the middle, giving one shorter and one longer arm.' },
    { term: 'acrocentric', definition: 'A chromosome type with the centromere close to one end, giving one extremely short arm and one very long arm.' },
    { term: 'telocentric', definition: 'A chromosome type with a terminal centromere, sitting right at the end.' },
    { term: 'satellite', definition: 'The small-fragment appearance created by a non-staining secondary constriction present at a constant location on some chromosomes.' },
    { term: 'microbody', definition: 'A membrane-bound, minute vesicle containing various enzymes, present in both plant and animal cells.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark nucleus where loose tangled threads of chromatin condense and tighten into distinct, structured chromosome shapes',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dark scene showing one transformation in progress: on the left, loose, glowing, tangled threads drift freely in soft focus, like a fine indistinct network of fibres; moving toward the right, those same threads gradually tighten, thicken, and resolve into a row of distinct, compact, rod-like chromosome shapes standing upright, each with a visible pinch near its middle. A single warm light source ties the whole transformation together, growing slightly brighter toward the compact shapes on the right. Deep, atmospheric lighting, painterly illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Two Metres of Thread, Folded Into Something You Cannot See',
      markdown: "Stretch out all the DNA sitting inside just **one** of your cells, and it runs to roughly **two metres**. That entire thread is folded into a nucleus you need a microscope to find at all, and it isn't stored as one long strand — it's divided among **forty-six chromosomes (twenty-three pairs)**. This page is about exactly how that folding works, and what the DNA looks like in the two very different states it can be found in.",
    },
    // ── 2 · Core concept — chromatin vs chromosome ────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Every nucleus you've studied so far on this chapter's pages has been sitting quietly — what biologists call **interphase**, a resting nucleus that isn't in the middle of dividing. In that resting state, the DNA inside doesn't look like anything neat or countable. It sits as a **loose and indistinct network of nucleoprotein fibres**, and biologists call that whole tangled network **chromatin**. Chromatin isn't DNA alone — it's DNA wrapped together with basic proteins called **histones**, plus a smaller amount of **non-histone proteins**, plus **RNA**.\n\nThe moment a cell enters different stages of **cell division**, that exact same material changes its packaging completely. The loose chromatin network condenses down into distinct, structured **chromosomes** — visible only in a dividing cell, never in a resting one. Nothing new is built and nothing is thrown away; the identical DNA, histones, and other proteins that were spread thin as chromatin simply fold up tighter, into a shape you can actually see and count under a microscope.",
    },
    // ── 3 · Heading — centromere / kinetochore / chromatid ────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Centromere, Kinetochore, Chromatid — The Three Landmarks of Every Chromosome',
      objective: "By the end of this you can point to a chromosome diagram and correctly name its centromere, its kinetochores, and its two chromatids, without mixing the three up.",
    },
    // ── 4 · Text — centromere/kinetochore/chromatid ────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Every chromosome — remember, visible only in a dividing cell — has one landmark you can always find: a **primary constriction**, better known as the **centromere**. On either side of that centromere sit disc-shaped structures called **kinetochores** (Figure 8.12).\n\nThe centromere does one more job besides marking that pinch point: it **holds together the two chromatids of a chromosome**. Those two chromatids are the two strands that make up a fully replicated chromosome, joined at exactly the point where the centromere sits. So when you look at an X-shaped chromosome, you're really looking at one centromere in the middle, a kinetochore sitting on each of its two sides, and two chromatids held together by that same centromere.",
    },
    // ── 5 · Comparison card — the three landmarks ──────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 5,
      title: 'Centromere vs Kinetochore vs Chromatid',
      columns: [
        {
          heading: 'Centromere',
          points: [
            "The chromosome's primary constriction",
            'Holds the two chromatids of a chromosome together',
            'Its exact position along the chromosome decides which of the four chromosome types you are looking at',
          ],
        },
        {
          heading: 'Kinetochore',
          points: [
            'A disc-shaped structure (Figure 8.12)',
            'Present on the sides of the centromere — not the centromere itself',
            'One sits on each side of the centromere',
          ],
        },
        {
          heading: 'Chromatid',
          points: [
            'One of the two strands making up a replicated chromosome',
            'A chromosome normally shows two chromatids',
            'Joined to its partner strand at the centromere',
          ],
        },
      ],
    },
    // ── 6 · Heading — four chromosome types ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Four Chromosome Types — Classified by Where the Centromere Sits',
      objective: "By the end of this you can look at a chromosome's arm lengths and name its type on sight: metacentric, sub-metacentric, acrocentric, or telocentric.",
    },
    // ── 7 · Text — four chromosome types ────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Based on the position of the centromere, every chromosome falls into one of **four types** (Figure 8.13).\n\nA **metacentric** chromosome has its centromere sitting right in the **middle**, which gives it **two equal arms**.\n\nA **sub-metacentric** chromosome has its centromere sitting **slightly away from the middle** — close enough that you still see two arms, but now **one arm is shorter and the other is longer**.\n\nAn **acrocentric** chromosome pushes that same idea much further: the centromere sits **close to one end**, so one arm becomes **extremely short** and the other becomes **very long**.\n\nAnd a **telocentric** chromosome takes it to the limit — the centromere sits **at a terminal position**, right at the end, so there's really only one arm left to see.\n\nTap through Figure 8.13 below to see all four side by side.",
    },
    // ── 8 · Interactive image — Figure 8.13 ─────────────────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'Figure 8.13 — four chromosomes shown side by side, illustrating the four types of chromosomes based on the position of the centromere: metacentric, sub-metacentric, acrocentric, and telocentric',
      caption: '📸 Tap each chromosome to see how its arms change with the centromere position',
      generation_prompt: "Scientific textbook illustration matching NCERT Figure 8.13: four chromosomes shown side by side, each in its classic duplicated form, illustrating the four types of chromosomes by centromere position. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, no text or labels baked into the image. From left to right: (1) a chromosome with its centromere pinched exactly in the middle, producing two equal-length arms above and below; (2) a chromosome with its centromere pinched slightly off from the middle, producing one visibly shorter arm and one visibly longer arm; (3) a chromosome with its centromere pinched close to one end, producing one extremely short stub of an arm and one very long arm; (4) a chromosome with its centromere pinched right at the very tip, a terminal position, showing essentially a single long arm with almost no second arm visible. Each chromosome rendered in pale tan/white with a visible thin waist at the centromere position. No photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
      hotspots: chromosomeTypeHotspots,
    },
    // ── 9 · Reasoning prompt — recognise the type from arm description ─────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A chromosome under the microscope clearly shows two arms — one extremely short, one very long. Which of the four chromosome types, classified by centromere position, does this describe?",
      options: [
        'Metacentric — the centromere sits in the middle, giving two arms of equal length',
        'Sub-metacentric — the centromere sits slightly off-middle, giving one shorter arm and one longer arm',
        'Acrocentric — the centromere sits close to one end, giving one extremely short arm and one very long arm',
        'Telocentric — the centromere sits at the very end, a terminal position, leaving essentially no second arm to measure',
      ],
      correct_index: 2,
      reveal: "This is acrocentric — NCERT's own words for it are 'one extremely short and one very long arm,' created by a centromere sitting close to one end. Metacentric describes a middle centromere with two equal arms, the opposite of what's described here. Sub-metacentric is a milder, less extreme version — one shorter and one longer arm, but not 'extremely' short — so it's a real but weaker match, not the best fit. Telocentric goes even further than acrocentric: its centromere sits right at the end, terminal, leaving essentially no second arm at all, not merely a very short one — but the question describes two visible arms, so it can't be telocentric either.",
      difficulty_level: 2,
    },
    // ── 10 · Heading — satellites and microbodies ──────────────────────────
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'Satellites and Microbodies — Two Last Structures to Know',
      objective: "By the end of this you can describe what a satellite chromosome looks like and name what a microbody actually contains.",
    },
    // ── 11 · Text — satellite + microbodies ─────────────────────────────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "A few chromosomes carry one more feature worth knowing: a **non-staining secondary constriction**, sitting at a constant location on that chromosome. Because it doesn't take up stain the way the rest of the chromosome does, it gives the appearance of a **small fragment** hanging off the end — and that fragment is called the **satellite**.\n\nOutside the nucleus entirely, every cell — plant or animal — also carries **microbodies**: many small, **membrane-bound vesicles**, each one packed with **various enzymes**. NCERT places them in **both plant and animal cells**, closing out the chapter's tour of everything sitting inside a cell's boundary.",
    },
    // ── 12 · Remember callout ────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember',
      title: 'Lock These In Before the Chapter Closes',
      markdown: "- **Chromatin** = the loose network in interphase; DNA + histones + non-histone proteins + RNA. **Chromosome** = the exact same material, condensed and visible, only during cell division.\n- A single human cell carries roughly **two metres** of DNA across **46 (23 pairs) chromosomes**.\n- **Centromere** = primary constriction, holds the two chromatids together. **Kinetochore** = disc-shaped structure on each side of the centromere. **Chromatid** = one of the two strands joined at the centromere.\n- **Four chromosome types by centromere position:** metacentric (middle, equal arms) → sub-metacentric (off-middle, one shorter + one longer) → acrocentric (near one end, one extremely short + one very long) → telocentric (terminal, essentially one arm).\n- **Satellite** = the small-fragment appearance created by a non-staining secondary constriction.\n- **Microbodies** = membrane-bound vesicles carrying various enzymes, present in both plant and animal cells.",
    },
    // ── 13 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Chromatin vs chromosome — the exact distinction NEET tests:** chromatin is the loose, indistinct nucleoprotein network you see in an interphase (resting) nucleus; a chromosome is the structured form of that identical material, visible only when the cell is actually dividing. Same DNA, same histones, different packaging state, different name. Carry this exact distinction into the next chapter, **Cell Cycle and Cell Division** — recognising whether a nucleus is resting or dividing from what it looks like is the very first skill that chapter builds on.\n\n**The four chromosome types by arm ratio — be able to draw this from memory:** metacentric (middle, equal arms) → sub-metacentric (off-middle, one shorter + one longer) → acrocentric (near one end, one extremely short + one very long) → telocentric (terminal, one arm). NCERT's own exercises ask you to describe this with a diagram — practise sketching all four, centromere position first, arm lengths second.\n\n**Classic NEET question:** \"A chromosome with a centromere situated close to its end, giving one extremely short arm and one very long arm, is called ___\" → **acrocentric**.",
    },
    // ── 14 · Closing synthesis ────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 14,
      markdown: "That's every structure this chapter set out to open up. Ten pages ago, a cell was just a word — the smallest thing you'd been told could count as alive. Now you can actually walk through one: a membrane, and in plants a wall, holding the boundary; an endomembrane system of ER, Golgi, lysosomes, and vacuoles moving material from one compartment to the next; ribosomes building protein wherever it's needed; mitochondria burning that supply into ATP behind their own double membrane; plastids, in plant cells only, trapping sunlight in their grana and turning it into sugar in their stroma; and, at the centre of it all, a nucleus whose chromatin holds the instructions for every one of those jobs — instructions that only unpack themselves into visible chromosomes when it's time for the cell itself to divide.\n\nNone of these parts works alone. A ribosome with nowhere to send what it builds is useless; a mitochondrion with no instructions from the nucleus has no plan to run. Every organelle on every page of this chapter is one part of a single coordinated system, folded into a space smaller than the dot at the end of this sentence. That is exactly what makes the cell the structural and functional unit of life — not a phrase to memorise, but the literal, physical truth of the smallest thing that fully counts as alive.",
    },
    // ── 15 · Inline quiz ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'What is chromatin, and when does that same material become visible as a structured chromosome instead?',
          options: [
            'Chromatin is the loose, indistinct nucleoprotein network in an interphase nucleus; it condenses into a structured chromosome only during cell division',
            'Chromatin is a separate molecule from DNA that appears only in dividing cells, replacing the chromosomes entirely',
            'Chromatin and chromosome are two different names for the exact same structure, which never changes shape',
            'Chromatin is the compact structure seen during division, while chromosomes are the loose network seen during interphase',
          ],
          correct_index: 0,
          explanation: "NCERT is explicit: the interphase nucleus has a loose, indistinct network of nucleoprotein fibres called chromatin, and this same material shows up as a structured chromosome only during cell division. Option D swaps the two states entirely — the classic trap. It isn't two unrelated structures, and it isn't a separate molecule replacing DNA — it's the same DNA-protein material in two different packaging states.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'Besides DNA, what does chromatin contain?',
          options: [
            'Basic proteins called histones, some non-histone proteins, and RNA',
            'Only histones — chromatin contains no other protein or RNA at all',
            'Cellulose, hemicellulose, and pectins',
            'Ribosomes, mitochondria, and fragments of the Golgi complex',
          ],
          correct_index: 0,
          explanation: "Chromatin is DNA plus basic proteins called histones, plus some non-histone proteins, plus RNA — all named directly in the text. Cellulose, hemicellulose, and pectins build the plant cell wall, not chromatin, and ribosomes, mitochondria, and Golgi fragments are whole organelles, not chromatin components.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'A chromosome shows a centromere close to one end, producing one extremely short arm and one very long arm. Which type is this, and how does it differ from a telocentric chromosome?',
          options: [
            'Acrocentric — this chromosome still shows two arms (one very short, one very long); a telocentric chromosome has a terminal centromere, leaving essentially one arm',
            'Metacentric — the centromere is in the middle, giving two equal arms, exactly the same setup as an acrocentric chromosome',
            'Sub-metacentric — sub-metacentric always means the shorter arm has vanished completely, identical to acrocentric',
            'Telocentric — any chromosome with two unequal arms is automatically classified as telocentric',
          ],
          correct_index: 0,
          explanation: "The description matches acrocentric exactly — centromere close to one end, one extremely short arm and one very long arm. Metacentric means equal arms from a middle centromere, the opposite of what's described. Sub-metacentric is a milder version — off-middle centromere, one shorter and one longer arm, but not this extreme — so it isn't identical to acrocentric. Telocentric is reserved for a terminal centromere, where there's really only one arm left, not two arms of very different lengths.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Where in the cell are microbodies found, and what do they contain?',
          options: [
            'Membrane-bound minute vesicles containing various enzymes, present in both plant and animal cells',
            'Non-membrane-bound clusters of DNA, present only in plant cells',
            'Membrane-bound vesicles containing chlorophyll, present only in cells that carry out photosynthesis',
            'Disc-shaped structures on the sides of the centromere, present only in dividing cells',
          ],
          correct_index: 0,
          explanation: "Microbodies are membrane-bound minute vesicles carrying various enzymes, and NCERT places them in both plant and animal cells — not restricted to one or the other. The chlorophyll-containing option is actually describing a chloroplast, not a microbody, and the disc-shaped option is describing a kinetochore, a completely different structure tied to chromosomes.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
