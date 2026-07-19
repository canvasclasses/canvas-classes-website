'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'pistil-ovule-and-megasporogenesis',
  title: 'The Pistil, the Ovule & Megasporogenesis',
  subtitle: "The female side of the flower: how the pistil is built, what sits inside a single ovule, and why meiosis here leaves just one surviving megaspore — not four.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['pistil', 'ovule', 'megasporogenesis', 'sexual-reproduction-flowering-plants'],
  glossary: [
    { term: 'funicle', definition: 'The stalk that attaches the ovule to the placenta inside the ovary.' },
    { term: 'hilum', definition: 'The junction where the body of the ovule fuses with the funicle.' },
    { term: 'micropyle', definition: 'A small opening at the tip of the ovule where the integuments do not cover the nucellus; the pollen tube later enters here.' },
    { term: 'chalaza', definition: 'The basal part of the ovule, lying opposite the micropylar end.' },
    { term: 'nucellus', definition: 'The mass of cells enclosed within the integuments, rich in reserve food; it houses the embryo sac.' },
    { term: 'integument', definition: 'A protective envelope (one or two) that encircles the nucellus, leaving only the micropyle open.' },
    { term: 'megasporogenesis', definition: 'The process of forming megaspores from the megaspore mother cell by meiosis.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dusk close-up of a Hibiscus flower with the long central pistil rising above the petals, a faint cutaway hint of ovules within the swollen ovary base',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single large Hibiscus flower at dusk, viewed slightly from the side, its long slender central pistil rising well above the ring of soft petals, the stigma catching a faint warm glow at the very tip. At the swollen base of the flower, a subtle, barely-there cutaway suggests tiny rounded ovules nestled inside the ovary — never a hard diagram, just a whispered hint of the hidden female structures within. Deep dusk lighting, a soft amber horizon glow behind the bloom, dew on the petals. Painterly, atmospheric illustration style, dark background tones throughout (#0a0a0a base), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'One Ovary, One Ovule — or Thousands',
      markdown: "How many future seeds does one flower carry? It depends entirely on how many **ovules** sit inside the ovary. In wheat, paddy, and mango there is just **one** ovule per ovary — one flower, one seed. But split open a papaya, a watermelon, or an orchid and the same little structure appears by the dozen, hundred, or even thousand. Every seed you have ever eaten started life as one of these tiny ovules tucked inside a flower's ovary.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The **gynoecium** is the female reproductive part of a flower. It is made of one or more units called **pistils**. A flower with a single pistil is **monocarpellary**; one with more than one pistil is **multicarpellary**. When there are several pistils, they may be fused into one structure — **syncarpous**, as in *Papaver* (poppy) — or stay free and separate — **apocarpous**, as in *Michelia*.\n\nEach pistil has three parts. At the top is the **stigma**, which acts as the landing platform for pollen grains. Below it runs the **style**, the elongated slender neck of the pistil. At the base sits the swollen **ovary**. Inside the ovary is a hollow space, the **ovarian cavity (locule)**, and along its wall is a cushion of tissue called the **placenta**. The ovules grow out from this placenta — so the placenta is the attachment point, and the ovules are what it holds.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Ovule — the Megasporangium, Part by Part',
      objective: 'By the end of this you can label every part of a typical anatropous ovule and say what each one does — the exact NCERT diagram question.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "An **ovule** is the female megasporangium — the small body arising from the placenta that will one day become a seed. Work through it from the outside in.\n\nThe ovule hangs from the placenta by a stalk called the **funicle**. Where the funicle meets the body of the ovule is the **hilum** — think of it as the ovule's navel, the junction between ovule and funicle. Wrapping the ovule are one or two protective coats, the **integuments**. They encircle the whole ovule except at one point, the tip, where they leave a tiny gap called the **micropyle**. Directly opposite the micropyle, at the base of the ovule, is the **chalaza**.\n\nInside the integuments is a mass of cells packed with reserve food — the **nucellus**. And buried within the nucellus is the prize: the **embryo sac**, also called the female gametophyte. An ovule usually holds just one embryo sac, and that embryo sac grows from a single **megaspore**. The type of ovule NCERT asks you to draw is the **anatropous** ovule — an inverted ovule, bent over so that the micropyle lies right next to the funicle. This is by far the most common ovule type in flowering plants.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A typical anatropous (inverted) angiosperm ovule showing funicle, hilum, micropyle, chalaza, integuments, nucellus, embryo sac and the megaspore mother cell region',
      caption: '📸 Tap each dot to explore the parts of a typical anatropous ovule (Figure 1.7d)',
      hotspots: [
        { id: uuid(), x: 0.30, y: 0.90, label: 'Funicle', icon: 'circle',
          detail: 'The **stalk** attaching the ovule to the placenta. Everything the ovule needs travels up this stalk.' },
        { id: uuid(), x: 0.38, y: 0.78, label: 'Hilum', icon: 'circle',
          detail: 'The **junction** where the body of the ovule fuses with the funicle — the ovule’s point of attachment.' },
        { id: uuid(), x: 0.46, y: 0.83, label: 'Micropyle', icon: 'circle',
          detail: 'A small **opening at the tip**, where the integuments leave a gap. In an anatropous ovule it sits close to the funicle. The pollen tube later enters the ovule through here.' },
        { id: uuid(), x: 0.52, y: 0.12, label: 'Chalaza', icon: 'circle',
          detail: 'The **basal part** of the ovule, lying **opposite** the micropylar end. Micropyle at one pole, chalaza at the other.' },
        { id: uuid(), x: 0.22, y: 0.42, label: 'Integuments', icon: 'circle',
          detail: 'One or two **protective envelopes** that encircle the nucellus, leaving only the micropyle uncovered. They later harden into the seed coat.' },
        { id: uuid(), x: 0.56, y: 0.44, label: 'Nucellus', icon: 'circle',
          detail: 'The **mass of cells** enclosed within the integuments, loaded with reserve food. The embryo sac develops inside it.' },
        { id: uuid(), x: 0.53, y: 0.55, label: 'Embryo sac', icon: 'circle',
          detail: 'The **female gametophyte**, formed from a single megaspore. An ovule generally has just one embryo sac.' },
        { id: uuid(), x: 0.53, y: 0.66, label: 'Megaspore mother cell (MMC)', icon: 'circle',
          detail: 'A single large cell in the **micropylar region** of the nucellus, with dense cytoplasm and a prominent nucleus. Its meiosis begins megasporogenesis.' },
      ],
      generation_prompt: "Scientific textbook illustration of a typical anatropous (inverted) angiosperm ovule in longitudinal section. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, no baked-in text labels. The ovule body is a large oval that is inverted/bent so that its tip curves back down toward its own stalk: a slender stalk (funicle) rises from the lower left and runs up alongside the ovule body, fusing with it at a junction (hilum) partway up. The pointed micropylar tip of the ovule bends downward to lie close to the funicle near the base. Two concentric outer envelope layers (integuments) wrap the ovule, drawn in pale brown/tan, leaving a small notch-like opening (micropyle) at the down-bent tip. The opposite pole of the ovule, at the top, is the broad chalaza. Inside the integuments is a large central mass of cells (nucellus) shaded soft green, and embedded within it toward the micropylar half is a prominent pear-shaped embryo sac drawn in pale purple, with a single large megaspore mother cell shown just below it near the micropylar region. Soft even lighting, no photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Megasporogenesis — Four Megaspores, One Survivor',
      objective: 'By the end of this you can trace the megaspore mother cell through meiosis and explain why only one of its four products lives on.',
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "**Megasporogenesis** is the making of megaspores from the megaspore mother cell. It starts with a single cell. Each ovule usually sets aside just one **megaspore mother cell (MMC)** in the micropylar region of the nucellus — a large cell with dense cytoplasm and a prominent nucleus.\n\nThis MMC undergoes **meiosis**. Meiosis matters here because it halves the chromosome number: the MMC is diploid (2n), so its products are haploid (n). Meiosis produces **four megaspores**. But now comes the twist that makes the female side different from the male side. In most flowering plants, **only one** of these four megaspores stays alive and functional — the **other three degenerate** and disappear. That single surviving functional megaspore then grows into the female gametophyte, the embryo sac. Because the embryo sac forms from just one megaspore, this pattern is called **monosporic development**.\n\nHold this next to microsporogenesis from the earlier page. There, a pollen mother cell also does meiosis to give four cells — but all **four microspores survive** and each becomes a pollen grain. Same meiosis, opposite outcome: four functional products on the male side, only one on the female side.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 8, title: 'Microsporogenesis vs Megasporogenesis',
      columns: [
        { heading: 'Microsporogenesis (male)', points: [
          'Starts from the **pollen (microspore) mother cell (PMC)**, 2n.',
          'Occurs inside the **microsporangium** of the anther.',
          'Meiosis gives a **microspore tetrad** — four haploid microspores.',
          '**All four** microspores survive and mature into pollen grains.',
          'End product: **pollen grains** (male gametophytes).',
        ] },
        { heading: 'Megasporogenesis (female)', points: [
          'Starts from the **megaspore mother cell (MMC)**, 2n.',
          'Occurs inside the **nucellus** of the ovule.',
          'Meiosis gives **four haploid megaspores** in a row.',
          '**Only one** stays functional; the **other three degenerate**.',
          'End product: a single **functional megaspore** → embryo sac.',
        ] },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "The megaspore mother cell divides by meiosis and produces four megaspores, yet a mature ovule almost always contains just one embryo sac. What accounts for the gap between four megaspores and one embryo sac?",
      options: [
        "The MMC divides by mitosis, not meiosis, so it only ever makes one megaspore in the first place",
        "All four megaspores survive, but three of them fuse together into the single embryo sac",
        "In most flowering plants three of the four megaspores degenerate, and only the one functional megaspore develops into the embryo sac (monosporic development)",
        "The four megaspores each form their own embryo sac, and the extra three are pushed out through the micropyle",
      ],
      reveal: "Meiosis genuinely produces four megaspores — that part is real. But in a majority of flowering plants three of them simply degenerate and only the single functional megaspore goes on to build the embryo sac. Because the embryo sac comes from just one megaspore, NCERT calls it monosporic development. The tempting trap is 'the three fuse in': they don't fuse, they die. And the MMC definitely divides by meiosis, not mitosis — that meiosis is what keeps the megaspores haploid.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'The Facts You Cannot Blur Together',
      markdown: "- **Micropyle and chalaza are opposite ends** of the ovule — micropyle at the tip, chalaza at the base. Never swap them.\n- **Funicle** = the stalk; **hilum** = where funicle meets the ovule body. Two different things.\n- The **embryo sac sits inside the nucellus**, and forms from **one megaspore**.\n- Megasporogenesis: MMC (2n) → meiosis → **4 megaspores (n)** → **3 degenerate, 1 functional**.\n- Embryo sac from a single megaspore = **monosporic development**.",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Ploidy chain:** the nucellus and the MMC are **diploid (2n)**; after meiosis the megaspores, the functional megaspore, and the female gametophyte are all **haploid (n)**. NCERT poses this exact question — know the 2n→2n→n→n sequence.\n\n**The male-vs-female outcome:** microsporogenesis → **4 functional** microspores; megasporogenesis → **1 functional** megaspore, 3 degenerate. This flipped outcome is a favourite one-mark trap.\n\n**Anatropous ovule:** it is the **inverted** ovule with the micropyle bent close to the funicle — the commonest type and the one to draw when a question just says 'a typical ovule.'\n\n**Classic NEET question:** \"The mature embryo sac develops from how many megaspores in monosporic development?\" → **one (a single functional megaspore).**",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "You now know the female side up to the functional megaspore. That single surviving cell is about to divide again — this time by mitosis — to build the seven-celled, eight-nucleate embryo sac, which is where the next page picks up.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which structure attaches the ovule to the placenta inside the ovary?',
          options: ['Funicle', 'Hilum', 'Chalaza', 'Micropyle'],
          correct_index: 0,
          explanation: "The funicle is the stalk that anchors the ovule to the placenta. The hilum is only the junction where that stalk meets the ovule body — not the stalk itself; the chalaza is the ovule's basal end; and the micropyle is the opening at the opposite tip. Students often pick hilum because it is 'the attachment region,' but the stalk doing the attaching is the funicle.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'A pollen tube later enters the ovule through a small opening left where the integuments fail to cover the nucellus. What is this opening called?',
          options: ['Chalaza', 'Hilum', 'Micropyle', 'Locule'],
          correct_index: 2,
          explanation: "That opening is the micropyle, at the tip of the ovule. The chalaza is the opposite (basal) end — the classic swap trap here; the hilum is the funicle junction; and the locule is the cavity of the ovary, not an opening in the ovule. Micropyle and chalaza mark the two opposite poles, so if you place the entry point at the chalaza you have it upside down.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'After the megaspore mother cell completes meiosis in a typical flowering plant, how many of its megaspores go on to form the embryo sac?',
          options: ['All four megaspores', 'One functional megaspore, the other three degenerate', 'Two megaspores fuse to form it', 'Three megaspores, one degenerates'],
          correct_index: 1,
          explanation: "In most flowering plants only one functional megaspore survives and the other three degenerate — this single-megaspore origin is monosporic development. The 'all four survive' option is really describing microsporogenesis on the male side, where all four microspores become pollen grains; the fusion and 'three survive' options are invented distractors with no basis in the NCERT text.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'What is the correct ploidy of the megaspore mother cell and of the megaspores it produces?',
          options: [
            'MMC is haploid (n); megaspores are diploid (2n)',
            'Both the MMC and the megaspores are diploid (2n)',
            'Both the MMC and the megaspores are haploid (n)',
            'MMC is diploid (2n); megaspores are haploid (n)',
          ],
          correct_index: 3,
          explanation: "The MMC is a diploid (2n) cell, and because it divides by meiosis — which halves the chromosome number — the megaspores it forms are haploid (n). The reversed option (n → 2n) contradicts what meiosis does; the two 'both same' options ignore that a reduction division must change the ploidy between the mother cell and its products.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
