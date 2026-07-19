'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'spermatogenesis-and-the-sperm',
  title: 'Spermatogenesis & the Structure of a Sperm',
  subtitle: "How one diploid germ cell becomes four haploid sperms — the ploidy ladder, the two hormones that run it, and the finished sperm part by part.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['spermatogenesis', 'sperm-structure', 'gametogenesis', 'human-reproduction'],
  glossary: [
    { term: 'spermatogenesis', definition: 'The process by which immature male germ cells (spermatogonia) in the testis produce sperms. It begins at puberty.' },
    { term: 'spermatogonium', definition: 'A diploid (46-chromosome) immature male germ cell lining the inside wall of the seminiferous tubule. Plural: spermatogonia.' },
    { term: 'primary spermatocyte', definition: 'A spermatogonium that has grown and is about to divide by meiosis. It is still diploid (46 chromosomes).' },
    { term: 'secondary spermatocyte', definition: 'The haploid (23-chromosome) cell formed after a primary spermatocyte completes the first meiotic (reduction) division. Two are made from each primary spermatocyte.' },
    { term: 'spermiogenesis', definition: 'The transformation of a rounded spermatid into a streamlined spermatozoon (sperm). No cell division happens here — only reshaping.' },
    { term: 'spermiation', definition: 'The release of mature sperms from the Sertoli cells into the cavity of the seminiferous tubule.' },
    { term: 'acrosome', definition: 'A cap-like structure covering the front of the sperm head, filled with enzymes that help the sperm penetrate the ovum during fertilisation.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single sperm cell swimming through a vast dark field, its tail trailing behind, countless faint others receding into the depths',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single human sperm cell viewed almost side-on, sharply lit in the lower-left third, its oval head glowing faintly and its long whip-like tail curving out behind it. Stretching away into the dark distance across the rest of the frame, hundreds of other sperm cells fade into soft out-of-focus points of light, giving a sense of an enormous swimming multitude heading the same direction. Deep near-black background (#0a0a0a base tones) with cool blue-teal rim lighting on the foreground sperm, a quiet biological grandeur. Painterly, atmospheric illustration style, no text, no labels, no diagram lines.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Two to Three Hundred Million, Every Time',
      markdown: "In a single act of coitus the human male ejaculates about **200 to 300 million sperms**. And yet only one will ever fertilise the egg. NCERT even sets the quality bar: for normal fertility, **at least 60 per cent** of those sperms must have normal shape and size, and **at least 40 per cent** must show vigorous motility. It's a production line running on an almost unimaginable scale — and it all starts from a single layer of cells lining the walls of the testis.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The testis makes gametes by a process called **gametogenesis** — in the male, that specific process is **spermatogenesis**. It **begins at puberty**, not before.\n\nIt starts with the **spermatogonia** (singular: *spermatogonium*), the immature male germ cells sitting on the **inside wall of the seminiferous tubules**. These cells **multiply by mitotic division** and build up their numbers. Each spermatogonium is **diploid** — it carries **46 chromosomes**. Hold on to that number, because the whole story of spermatogenesis is really the story of how that 46 gets halved to 23, and how one cell becomes four.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Ploidy Ladder: 46 → 23, One Cell → Four',
      objective: "By the end of this you can name every stage in order and state whether it is diploid (2n) or haploid (n) without hesitating.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Follow the cells down the ladder, watching the chromosome number at each rung:\n\n- Some spermatogonia grow into **primary spermatocytes**. These are still **diploid — 46 chromosomes**. Nothing has been halved yet.\n- A primary spermatocyte completes the **first meiotic division (reduction division)**. This gives **two equal, haploid secondary spermatocytes**, each now with only **23 chromosomes**. *This* is the step where the number is cut in half.\n- The secondary spermatocytes undergo the **second meiotic division**, producing **four equal, haploid spermatids** in total. Still 23 chromosomes each — the second division splits cells, it doesn't halve the number again.\n- Finally the spermatids are transformed into **spermatozoa (sperms)** by a process called **spermiogenesis**. No division here — the round spermatid is just remodelled into the sleek, tailed sperm.\n\nAfter spermiogenesis, the sperm **heads become embedded in the Sertoli cells**, and are then released from the seminiferous tubules by the process called **spermiation**. So the ledger for one primary spermatocyte reads: **1 diploid cell in, 4 haploid sperms out.**",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 5, reasoning_type: 'logical',
      prompt: "A student traces a cell through spermatogenesis and notes it has just finished the FIRST meiotic division. Which statement about the cell she is now looking at is correct?",
      options: [
        "It is a primary spermatocyte and is diploid, with 46 chromosomes",
        "It is a secondary spermatocyte and is haploid, with 23 chromosomes",
        "It is a spermatid and is diploid, with 46 chromosomes",
        "It is a spermatogonium and is haploid, with 23 chromosomes",
      ],
      reveal: "The first meiotic division is the reduction division — it takes one diploid primary spermatocyte and produces two haploid secondary spermatocytes with 23 chromosomes each. So the cell 'just after' this division is a secondary spermatocyte, haploid. The tempting trap is the primary spermatocyte with 46: that is the cell *before* this division, not after. Spermatids come one division later, and they are haploid (not diploid), while spermatogonia are diploid — so both of those options carry the wrong ploidy.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Hormones That Run the Factory',
      objective: "By the end of this you can trace GnRH → LH & FSH and say exactly which cell each gonadotropin targets — the pairing NEET loves to swap.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Why does all this switch on only at puberty? Because that's when the hormone signal arrives. At puberty there is a marked rise in **gonadotropin releasing hormone (GnRH)** — a **hypothalamic hormone**. GnRH acts on the **anterior pituitary gland** and makes it secrete two gonadotropins: **luteinising hormone (LH)** and **follicle stimulating hormone (FSH)**.\n\nNow keep the two targets straight, because this is the single most-tested pairing here:\n\n- **LH acts on the Leydig cells** and stimulates them to synthesise and secrete **androgens**. The androgens, in turn, **stimulate spermatogenesis**.\n- **FSH acts on the Sertoli cells** and stimulates the secretion of some factors that help in the process of **spermiogenesis**.\n\nA clean way to lock it: **L**H → **L**eydig (both start with L). That leaves FSH for the Sertoli cells. Leydig cells make the androgens; Sertoli cells nurse the developing sperms.",
    },
    {
      id: uuid(), type: 'heading', order: 8, level: 2,
      text: 'The Finished Sperm, Part by Part',
      objective: "By the end of this you can point to any part of a sperm and state its job — especially why the acrosome and the middle piece matter.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 9, src: '',
      alt: 'Structure of a human sperm shown side-on: acrosome cap, head with nucleus, neck, mitochondria-filled middle piece, and long tail',
      caption: '📸 Tap each dot to explore the parts of a sperm and what each one does (Figure 2.6)',
      generation_prompt: "Scientific textbook illustration of the structure of a human sperm, shown side-on and horizontal. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions. From left to right: a pointed cap-like ACROSOME (drawn slightly translucent, pink-magenta tint) covering the anterior of an oval HEAD that contains a densely shaded purple elongated NUCLEUS; a short narrow NECK connecting to a cylindrical MIDDLE PIECE packed with small oval mitochondria (shown as a tight spiral/row of red-orange beads around the core); and a long thin tapering TAIL (flagellum) trailing to the right, drawn with a gentle wave. A thin plasma membrane envelops the whole body. No baked-in text labels, no leader lines with words. No photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.09, y: 0.45, label: 'Acrosome', icon: 'circle',
          detail: 'The **cap-like structure** covering the anterior (front) part of the head. It is **filled with enzymes that help the sperm fertilise the ovum** by penetrating its coverings.' },
        { id: uuid(), x: 0.22, y: 0.48, label: 'Head (nucleus)', icon: 'circle',
          detail: 'The head contains an **elongated haploid nucleus** — this is the sperm\'s genetic payload, the 23 chromosomes it will deliver to the egg.' },
        { id: uuid(), x: 0.33, y: 0.50, label: 'Neck', icon: 'circle',
          detail: 'The short region joining the head to the middle piece. A **plasma membrane envelops the whole body** of the sperm, neck included.' },
        { id: uuid(), x: 0.46, y: 0.52, label: 'Middle piece', icon: 'circle',
          detail: 'The middle piece possesses **numerous mitochondria**. These **produce the energy** needed for the movement of the tail — the power pack of the sperm.' },
        { id: uuid(), x: 0.78, y: 0.55, label: 'Tail', icon: 'circle',
          detail: 'The long whip-like tail. Its lashing movement gives the sperm its **motility**, which is essential for reaching and fertilising the ovum.' },
      ],
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'Lock These Before the Exam',
      markdown: "- **Order of stages:** spermatogonium (2n) → primary spermatocyte (2n) → *meiosis I* → secondary spermatocyte (**n**) → *meiosis II* → spermatid (n) → *spermiogenesis* → spermatozoon.\n- **Where 46 becomes 23:** at **meiosis I** (the reduction division), turning the primary spermatocyte into secondary spermatocytes.\n- **1 → 4:** one primary spermatocyte yields **four haploid spermatids**.\n- **Two 'sperm-' words:** **spermiogenesis** = spermatid *reshaped into* sperm; **spermiation** = mature sperm *released* from the tubule.\n- **Hormone targets:** **LH → Leydig cells → androgens**; **FSH → Sertoli cells → spermiogenesis factors**.\n- **Sperm parts:** acrosome (enzymes for fertilisation), head (haploid nucleus), middle piece (mitochondria for energy), tail (motility).",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The LH/FSH swap:** NEET's favourite trap on this topic is to state that *FSH acts on Leydig cells* or *LH acts on Sertoli cells*. Both are wrong. **LH → Leydig → androgens; FSH → Sertoli.**\n\n**Ploidy at each stage:** examiners ask the chromosome number of a named stage. Spermatogonium and primary spermatocyte = **46 (diploid)**; secondary spermatocyte, spermatid and sperm = **23 (haploid)**.\n\n**Spermiogenesis vs spermiation:** one is *transformation* (spermatid → sperm), the other is *release* (sperm out of the tubule). Getting these two swapped is a classic slip.\n\n**Classic NEET question:** \"LH acts on which cells of the testis and stimulates the secretion of what?\" → **Leydig (interstitial) cells; androgens.**",
    },
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "That is the male side of gametogenesis, start to finish — from a diploid spermatogonium to 200 million tailed, energy-packed sperms. The female process, oogenesis, runs on the same meiotic logic but reaches a strikingly different outcome. That's where we go next.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'How many chromosomes does a secondary spermatocyte contain in humans?',
          options: ['46', '23', '92', '44'],
          correct_index: 1,
          explanation: "A secondary spermatocyte is haploid, with 23 chromosomes — it is formed when a primary spermatocyte completes the first meiotic (reduction) division. The trap is 46: that is the count of the diploid primary spermatocyte and spermatogonium, before meiosis halves it.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'Luteinising hormone (LH) stimulates spermatogenesis by acting on which cells, and what do they secrete?',
          options: [
            'Sertoli cells, which secrete androgens',
            'Sertoli cells, which secrete factors for spermiogenesis',
            'Leydig cells, which secrete androgens',
            'Leydig cells, which secrete factors for spermiogenesis',
          ],
          correct_index: 2,
          explanation: "LH acts on the Leydig cells, stimulating them to synthesise and secrete androgens, which in turn drive spermatogenesis. The tempting distractors swap the pairing: it is FSH (not LH) that acts on Sertoli cells, and the Sertoli cells secrete spermiogenesis-helping factors — not androgens.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: 'The transformation of spermatids into mature spermatozoa is called:',
          options: ['Spermiation', 'Spermiogenesis', 'Spermatogenesis', 'Spermatocytogenesis'],
          correct_index: 1,
          explanation: "Spermatids are reshaped into spermatozoa by spermiogenesis — no cell division, just remodelling. Spermiation is the later release of those mature sperms from the seminiferous tubule, and spermatogenesis is the umbrella term for the whole process from spermatogonium to sperm, so neither of those names the transformation step.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'The middle piece of a sperm is packed with numerous mitochondria. What is their role?',
          options: [
            'They store enzymes that help the sperm penetrate the ovum',
            'They carry the haploid nucleus with the sperm\'s genes',
            'They produce the energy needed for the movement of the tail',
            'They form the plasma membrane that envelops the sperm',
          ],
          correct_index: 2,
          explanation: "The mitochondria of the middle piece produce the energy that powers the tail's movement, giving the sperm its motility. The enzyme store is the acrosome, not the mitochondria; the genes sit in the nucleus in the head; and the enveloping membrane is the plasma membrane — so each distractor belongs to a different part of the sperm.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
