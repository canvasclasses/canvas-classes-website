'use strict';
/**
 * Class 12 Biology — Chapter 2: Human Reproduction
 * Page 7 — Fertilisation & Implantation.
 *
 * Source of truth: NCERT Class 12 Ch.2 (lebo102.txt) §2.5 "Fertilisation and
 * Implantation" (lines 397–493), with the ampulla/oviduct anatomy from §2.1
 * (line 169) and the secondary-oocyte/zona-pellucida detail from §2.4 (lines
 * 306–323). Rule 0: every fact, name, sequence and structure here traces to that
 * text; nothing invented. NCERT Figures 2.9, 2.10 and 2.11.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'fertilisation-and-implantation',
  title: 'Fertilisation & Implantation',
  subtitle: "Follow one sperm to the ampulla, watch the egg slam its door shut behind it, then trace the tiny ball of cells all the way down to the moment it burrows into the uterine wall.",
  page_number: 7,
  page_type: 'lesson',
  tags: ['fertilisation', 'implantation', 'human-reproduction'],
  glossary: [
    { term: 'fertilisation', definition: 'The fusion of a sperm with an ovum. In humans it happens in the ampullary region of the fallopian tube and produces the diploid zygote.' },
    { term: 'zona reaction', definition: 'The change induced in the ovum’s membrane the instant the first sperm makes contact, which blocks all other sperms from entering. It ensures that only one sperm can fertilise the ovum.' },
    { term: 'cleavage', definition: 'The series of rapid mitotic divisions the zygote undergoes as it moves down the oviduct towards the uterus, splitting into 2, 4, 8 and 16 cells called blastomeres.' },
    { term: 'morula', definition: 'The solid ball of 8 to 16 blastomeres formed by cleavage. It keeps dividing as it travels into the uterus.' },
    { term: 'blastocyst', definition: 'The stage the morula transforms into as it moves further into the uterus — its cells rearrange into an outer trophoblast and an inner cell mass.' },
    { term: 'trophoblast', definition: 'The outer layer of cells of the blastocyst. It is the part that attaches to the endometrium of the uterus.' },
    { term: 'implantation', definition: 'The embedding of the blastocyst into the endometrium of the uterus. It is what leads to pregnancy.' },
  ],
  blocks: [
    {
      id: 'ea049735-7656-4b99-9431-ac549b2973ca',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A single glowing cell deep inside a warm, tunnel-like fallopian tube, tiny sparks of light drifting towards it',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). An extreme close-up looking down the soft, curving tunnel of a human fallopian tube, its folded inner walls glowing warm amber and rose in the depths. At the far end of the tunnel, a single luminous rounded cell rests in a widened chamber (the ampulla), lit softly from within as if a spark of life has just been struck inside it. A few faint points of light drift through the tunnel towards it. Everything else falls away into deep shadow; only that one point of warm light and the glowing tube walls draw the eye. Painterly and atmospheric, dark background tones throughout (#0a0a0a base), naturalistic, no text, no labels, no diagram elements.",
    },
    {
      id: 'fc856859-ef1c-47b9-b94f-ecffac4bad93',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'The Father Decides — Not the Mother',
      markdown: "Here is a fact that has been used to blame the wrong parent for centuries. The mother's eggs **all** carry the same sex chromosome: **X**. Always. She has no other kind to give. It's the sperm that comes in two flavours — half of them carry an **X**, the other half carry a **Y**. If an X-sperm wins the race, the zygote is **XX** and a girl develops. If a Y-sperm wins, the zygote is **XY** and a boy develops. So the sex of the baby is decided the very instant of fertilisation, and it is decided **entirely by which sperm the father sends in** — the mother's contribution is fixed. Scientifically, the father determines the sex of the child.",
    },
    {
      id: 'aa004de0-dea9-4c86-a900-cfe1acedf3fc',
      type: 'text',
      order: 2,
      markdown: "After copulation, millions of **sperms** are deposited in the vagina. They swim rapidly, pass through the **cervix**, cross the **uterus**, and finally reach the **ampullary region** of the fallopian tube. Meanwhile, the ovum released by the ovary is also carried to this same ampulla. This is the meeting point — **fertilisation happens in the ampulla, nowhere else in the tract.** And there is a catch NCERT is careful to state: the ovum and the sperms must reach the ampulla **at the same time**. If they don't arrive together, there is no fertilisation. That is why not every act of copulation leads to pregnancy.\n\nWhen a sperm finally reaches the egg, it first touches the **zona pellucida**, the thick coat around the ovum. Two things now happen almost together. First, that contact triggers a change in the ovum's membrane that **blocks every other sperm from entering** — this is the **zona reaction**, and it guarantees that only **one** sperm fertilises the egg (the fault of letting many sperms in is called **polyspermy**, and this block prevents it). Second, enzymes from the sperm's **acrosome** — the cap on its head — dissolve a path so the sperm can push through the zona pellucida and the plasma membrane into the ovum's cytoplasm.\n\nThe entry of the sperm jolts the egg into finishing a job it had left half-done. The secondary oocyte completes its **second meiotic division**, throwing out a tiny **second polar body** and leaving behind a mature **haploid ovum**. Now the haploid nucleus of the sperm and the haploid nucleus of the ovum fuse — **syngamy** — forming a single **diploid zygote**. One new cell, with a full set of chromosomes, and its sex already fixed.",
    },
    {
      id: '6272959a-3f7a-4ff9-800e-145342157a35',
      type: 'heading',
      order: 3,
      level: 2,
      text: 'From Zygote to Blastocyst — The Journey Down the Tube',
      objective: "You'll be able to name every stage the embryo passes through on its way to the uterus, in order, and say exactly which cells attach to the wall and which become the baby.",
    },
    {
      id: 'b5e5cb04-5c08-4831-b471-ffec86fc7b8a',
      type: 'text',
      order: 4,
      markdown: "The zygote does not wait around. As it slides down the **isthmus** of the oviduct towards the uterus, it begins dividing by mitosis — a special set of divisions called **cleavage**. One cell becomes **2**, then **4**, then **8**, then **16**. These daughter cells are called **blastomeres**. Notice the ball is not getting bigger, only more crowded — the same amount of stuff is being cut into more and more pieces.\n\nWhen the embryo reaches **8 to 16 blastomeres**, this solid ball of cells is called a **morula** (think of a mulberry — that's what the name means). The morula keeps dividing as it drifts further into the uterus, and then it transforms into a **blastocyst**. This is the turning point: the cells stop being a plain ball and **rearrange themselves**. An **outer layer of cells** forms, called the **trophoblast**, and a small **inner group of cells** attaches to the inside of the trophoblast — the **inner cell mass**. Keep these two straight: the **trophoblast** is the outer wall, the **inner cell mass** is the huddle of cells inside.\n\nEach has a destiny. The **trophoblast** layer attaches to the **endometrium**, the soft inner lining of the uterus. The **inner cell mass** differentiates into the **embryo** itself — it is the part that becomes the baby. Once the trophoblast makes contact, the uterine cells divide rapidly and grow over the blastocyst until it is buried in the endometrium. This embedding of the blastocyst into the uterine wall is called **implantation**, and implantation is what leads to **pregnancy**.",
    },
    {
      id: '34ff185f-2240-40f7-86ba-fc8e4a21344c',
      type: 'interactive_image',
      order: 5,
      src: '',
      alt: 'The path of the growing embryo from the ampulla down the fallopian tube to implantation in the uterine wall: zygote, morula, blastocyst with trophoblast and inner cell mass, embedding in the endometrium',
      caption: '📸 Tap each dot to follow the embryo from the moment of fertilisation to the moment it burrows into the uterine wall',
      generation_prompt: "Scientific textbook illustration of human fertilisation and the passage of the growing embryo through the fallopian tube to implantation (NCERT Fig 2.11). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines throughout, biologically accurate proportions. Layout: on the upper right, an ovary (pink/magenta soft-tissue tones) releasing an ovum into the funnel-shaped opening of a fallopian tube. The tube curves across to the upper-left where it meets a large pear-shaped uterus, whose thick inner lining (endometrium) is drawn in a deeper rose tone with a soft velvety texture. Along the tube, a left-to-right sequence of developmental stages drawn as small rounded cell clusters: (1) a single round zygote just after fertilisation near the ampulla (widened region of the tube near the ovary), purple/violet nucleic-acid tone for the nucleus; (2) a 2-cell then 4-cell then 8-cell stage; (3) a solid mulberry-like ball of ~16 cells (morula) mid-tube; (4) a hollow blastocyst near the uterus, drawn as a sphere with a distinct thin outer ring of cells (trophoblast) and a small dense clump of cells attached to the inside at one pole (inner cell mass); (5) the blastocyst embedding into the thick endometrial wall of the uterus. Thin white arrows show the direction of travel from ovary through tube into uterus. Blood-rich lining in red/rose. No text or numeric labels baked into the image itself. No photorealism, no cartoon, no mascots; standard biology textbook illustration conventions.",
      hotspots: [
        {
          id: '227d49c0-6cb4-40c4-ab7c-3b95bebe5e6a',
          x: 0.72,
          y: 0.30,
          label: 'Ampulla (fertilisation site)',
          detail: 'The widened region of the fallopian tube where sperm and ovum meet. **Fertilisation happens here** — the sperm and egg must arrive in the ampulla at the same time for it to occur.',
          icon: 'circle',
        },
        {
          id: 'f45fe962-0eb4-4f72-82b7-c58eaa239d26',
          x: 0.60,
          y: 0.42,
          label: 'Zygote',
          detail: 'The single **diploid** cell formed the moment the sperm and ovum nuclei fuse (syngamy). Its sex is already fixed. From here it begins moving down the isthmus, dividing as it goes.',
          icon: 'circle',
        },
        {
          id: '9f6b3be8-c99c-4fbb-b363-8dcc52c57454',
          x: 0.47,
          y: 0.50,
          label: 'Morula',
          detail: 'A **solid ball of 8 to 16 blastomeres** produced by cleavage. It looks like a tiny mulberry and keeps dividing as it drifts into the uterus. Still solid — no cavity, no layers yet.',
          icon: 'circle',
        },
        {
          id: 'fa683361-a7da-4960-8175-9fef33b016b1',
          x: 0.34,
          y: 0.55,
          label: 'Blastocyst',
          detail: 'The morula transforms into the **blastocyst** as it moves further into the uterus. Now its cells rearrange into two distinct groups — an outer layer and an inner group.',
          icon: 'circle',
        },
        {
          id: '27f42e01-3031-489c-bb40-4f6d0bdd38c5',
          x: 0.30,
          y: 0.46,
          label: 'Trophoblast',
          detail: 'The **outer layer** of the blastocyst. This is the part that **attaches to the endometrium** — it is the blastocyst’s anchor to the uterine wall.',
          icon: 'circle',
        },
        {
          id: '92e26e4e-2e51-4f7a-b41c-b4557781b166',
          x: 0.27,
          y: 0.60,
          label: 'Inner cell mass',
          detail: 'The small group of cells attached to the inside of the trophoblast. It **differentiates into the embryo** — this is the part that becomes the baby.',
          icon: 'circle',
        },
        {
          id: '3c693652-1ddb-4559-aed7-9da6be6bdac5',
          x: 0.18,
          y: 0.66,
          label: 'Endometrium (implantation)',
          detail: 'The soft, blood-rich inner lining of the uterus. The trophoblast attaches here and the uterine cells grow over the blastocyst until it is buried inside — this embedding is **implantation**, and it leads to pregnancy.',
          icon: 'circle',
        },
      ],
    },
    {
      id: 'd35355d6-d0d3-420e-89a0-f9bc4ef5d128',
      type: 'reasoning_prompt',
      order: 6,
      reasoning_type: 'logical',
      prompt: 'A woman ovulates, and sperms are present in her reproductive tract, yet fertilisation does not occur. A doctor explains the timing was off. Based on where and how fertilisation works, what is the most likely reason?',
      options: [
        'The sperm and the ovum did not reach the ampullary region of the fallopian tube at the same time',
        'The sperm entered the ovum but the zona reaction failed, so fertilisation was blocked',
        'The ovum was fertilised in the uterus instead of the ovary',
        'Too many sperms reached the egg at once, causing polyspermy',
      ],
      reveal: "NCERT is explicit that fertilisation can happen only if the ovum and the sperms are transported to the ampullary region **simultaneously** — that is exactly why not every copulation leads to pregnancy. If the egg has already passed the ampulla, or the sperms arrive too late, they simply never meet. The zona reaction doesn't block fertilisation — it blocks *extra* sperms *after* one has entered. Fertilisation normally occurs in the ampulla of the tube, never in the ovary or uterus. And polyspermy is precisely what the egg prevents, so it wouldn't be the cause here.",
      difficulty_level: 2,
    },
    {
      id: '93bd9ef6-c9e0-441e-89ce-bcb3e28d2ab5',
      type: 'callout',
      order: 7,
      variant: 'remember',
      title: 'Two Pairs You Must Never Swap',
      markdown: "- **Morula vs blastocyst:** the **morula** is a **solid** ball of 8–16 blastomeres, no layers, no cavity. The **blastocyst** comes *after* — its cells have rearranged into an outer layer and an inner group. Morula first, blastocyst second.\n- **Trophoblast vs inner cell mass:** the **trophoblast** is the **outer** layer, and it is the part that **attaches to the endometrium**. The **inner cell mass** is the inner group of cells, and it **becomes the embryo** (the baby). Outer = attaches; inner = becomes the baby.\n- **Fertilisation site:** always the **ampulla** of the fallopian tube — not the ovary, not the uterus.\n- **Implantation site:** the blastocyst embeds in the **endometrium** of the uterus, and that is what leads to pregnancy.",
    },
    {
      id: 'e2dd1c17-c5ad-4c17-940e-9b9b33941578',
      type: 'callout',
      order: 8,
      variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Fertilisation occurs in the ampulla:** NCERT states it plainly — the ampullary region of the fallopian tube. This exact location is a repeat NEET one-liner. Not the ovary, not the uterus.\n\n**Sex is determined by the sperm:** the ovum always carries X; the sperm carries X or Y. So the father determines the sex of the child — lifted almost verbatim into NEET.\n\n**Morula = 8 to 16 blastomeres, and it is solid:** the trap is to call the morula a hollow or layered structure. Layers appear only at the blastocyst stage (trophoblast + inner cell mass).\n\n**Trophoblast attaches, inner cell mass becomes the embryo:** the classic swap NEET plants. The outer trophoblast anchors to the endometrium; the inner cell mass differentiates into the embryo.\n\n**Classic NEET question:** \"In humans, fertilisation of the ovum by a sperm occurs in the — ?\" → the **ampulla (ampullary region) of the fallopian tube.**",
    },
    {
      id: '055be63c-6051-40ad-956b-8e20ea27d21b',
      type: 'text',
      order: 9,
      markdown: "So the blastocyst is now buried safely in the uterine wall, its trophoblast anchored to the endometrium and its inner cell mass ready to become the embryo. The moment of implantation is also the start of pregnancy. What the trophoblast does next — sending out finger-like projections and building the connection between mother and embryo — is the story of the next page.",
    },
    {
      id: '946c3cc2-e0a2-4c5c-9ca1-a8f456c4bf15',
      type: 'inline_quiz',
      order: 10,
      pass_threshold: 0.67,
      questions: [
        {
          id: 'eab6658f-43c6-4f58-83ac-4c54151407b1',
          question: 'In humans, at which site does fertilisation of the ovum by a sperm normally take place?',
          options: [
            'The uterus, just before implantation',
            'The cervix, as the sperm enters',
            'The ampullary region of the fallopian tube',
            'The ovary, where the ovum is released',
          ],
          correct_index: 2,
          explanation: "Fertilisation happens in the ampullary region of the fallopian tube, where the ovum and the sperms are transported simultaneously. The uterus is where the blastocyst later implants, not where fertilisation occurs. The cervix is only a passageway the sperm crosses, and the ovary merely releases the ovum — the egg has already left it before fertilisation.",
          difficulty_level: 1,
        },
        {
          id: 'cbd67a7b-45f9-4197-a904-44208676f531',
          question: 'The moment the first sperm contacts the ovum, a change occurs that stops any other sperm from entering. What is the purpose of this block?',
          options: [
            'To ensure that only one sperm fertilises the ovum, preventing polyspermy',
            'To trigger the release of the ovum from the ovary',
            'To help the sperm dissolve the zona pellucida using acrosomal enzymes',
            'To split the zygote into two blastomeres immediately',
          ],
          correct_index: 0,
          explanation: "The change induced in the ovum's membrane (the zona reaction) blocks additional sperms so that exactly one sperm fertilises the egg — preventing polyspermy. Ovulation is a separate earlier event, not caused by sperm contact. Dissolving the zona is the job of the acrosomal enzymes, which act *before* entry — that is the opposite of a block. And cleavage into blastomeres begins only after the zygote forms, further down the tube.",
          difficulty_level: 2,
        },
        {
          id: '0945675e-1eb1-4064-9ebf-c77e02b3ae66',
          question: 'A solid ball of 8 to 16 blastomeres is moving through the fallopian tube. What is this stage called, and what comes immediately after it?',
          options: [
            'It is the blastocyst; it next becomes the morula',
            'It is the zygote; it next becomes the morula',
            'It is the inner cell mass; it next becomes the trophoblast',
            'It is the morula; it next transforms into the blastocyst',
          ],
          correct_index: 3,
          explanation: "A solid ball of 8–16 blastomeres is the morula, and it transforms into the blastocyst as it moves further into the uterus. The order is fixed: zygote → morula → blastocyst. The blastocyst comes after the morula, not before, and the zygote is the single cell that exists before any cleavage. Inner cell mass and trophoblast are parts of the blastocyst, not whole stages.",
          difficulty_level: 2,
        },
        {
          id: '5bbb2043-5d3d-4b4f-95d4-7cdd03e22244',
          question: 'In the blastocyst, which group of cells attaches to the endometrium, and which differentiates into the embryo?',
          options: [
            'The inner cell mass attaches to the endometrium; the trophoblast becomes the embryo',
            'The trophoblast attaches to the endometrium; the inner cell mass becomes the embryo',
            'The trophoblast becomes the embryo; the inner cell mass forms the placenta',
            'Both the trophoblast and the inner cell mass attach to the endometrium equally',
          ],
          correct_index: 1,
          explanation: "The outer trophoblast layer attaches to the endometrium, while the inner cell mass differentiates into the embryo. The tempting swap — inner cell mass attaching and trophoblast becoming the embryo — reverses both roles. NCERT is explicit that the trophoblast anchors and the inner cell mass becomes the embryo, so the outer layer never becomes the baby and it is not both layers that attach.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
