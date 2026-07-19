'use strict';
/**
 * Class 12 Biology — Chapter 1: Sexual Reproduction in Flowering Plants
 * Page 5 — The Embryo Sac (the Female Gametophyte).
 *
 * Source of truth: NCERT Class 12 Ch.1 (lebo101.txt), §1.2.2 — the female
 * gametophyte / embryo sac portion (lines ~377–411) plus the chapter summary
 * (lines ~1029–1040) and Figure 1.8(b,c). Rule 0: every fact, name, number
 * and sequence here traces to that text; nothing invented.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'the-embryo-sac-female-gametophyte',
  title: 'The Embryo Sac — the Female Gametophyte',
  subtitle: "One functional megaspore, three quiet nuclear divisions, and you get the strangest count in your whole syllabus: 8 nuclei living inside just 7 cells. Here's exactly how, and why it never comes out any other way.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['embryo-sac', 'female-gametophyte', 'megasporogenesis', 'sexual-reproduction-in-flowering-plants'],
  glossary: [
    { term: 'embryo sac', definition: 'The female gametophyte of a flowering plant — the small 7-celled, 8-nucleate body inside the ovule that holds the egg.' },
    { term: 'egg apparatus', definition: 'The group of three cells at the micropylar end of the embryo sac: one egg cell flanked by two synergids.' },
    { term: 'synergid', definition: 'One of the two cells sitting beside the egg cell. Its filiform apparatus guides the pollen tube in.' },
    { term: 'filiform apparatus', definition: 'Special cellular thickenings at the micropylar tip of the synergids that guide the pollen tube into the synergid.' },
    { term: 'antipodal cell', definition: 'One of the three cells grouped at the chalazal end of the embryo sac, opposite the egg apparatus.' },
    { term: 'central cell', definition: 'The single large cell filling the middle of the embryo sac, holding the two polar nuclei.' },
    { term: 'polar nuclei', definition: 'The two nuclei sitting together inside the central cell, below the egg apparatus — the reason the sac has 8 nuclei but only 7 cells.' },
  ],
  blocks: [
    {
      id: '845553de-8c7d-40d3-b239-c3075d0cea60',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A dusk close-up of a single ovule glowing softly, tiny cells suggested within, warm light low on the horizon',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). An extreme, dreamlike close-up of a single plant ovule resting at the centre of the frame at dusk, lit softly from one warm low light source on the right. The ovule is translucent, and inside it a faint cluster of rounded cell-shapes is barely suggested through the glow — not labelled, not diagrammatic, just hinted, like looking at something alive under gentle backlight. Soft out-of-focus plant tissue surrounds it, fading into deep shadow. Deep dusk lighting throughout, painterly and atmospheric, dark background tones overall (#0a0a0a base), naturalistic, no text, no labels, no diagram elements.",
    },
    {
      id: 'b471733a-45ef-410f-9088-65dbd8d64b1c',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: '8 Nuclei, 7 Cells — Both Numbers Are Right',
      markdown: "Count the cells inside a ripe embryo sac and you get **seven**. Count the nuclei inside those same cells and you get **eight**. Both counts are correct at the same time, and it isn't a trick or a typo. One cell in there — the big one in the middle — carries two nuclei instead of one. That single oddity is the most examined fact on this whole page, and once you see *why* it happens, you'll never write '8-celled' by mistake again.",
    },
    {
      id: '8ed7690b-774e-45fe-9e98-41e4baa71ffb',
      type: 'text',
      order: 2,
      markdown: "You've already met the ovule and watched meiosis of the megaspore mother cell make **four megaspores**. Here's what happens to them. In most flowering plants only **one megaspore stays alive** — it becomes the **functional megaspore** — and the other three simply degenerate. That one surviving megaspore is the seed of everything on this page: it develops into the **female gametophyte**, better known as the **embryo sac**.\n\nBecause the whole embryo sac grows from just this single megaspore, the process has a name worth memorising: **monosporic development** ('mono' = one spore). An ovule generally holds a single embryo sac, and that embryo sac is the female side of reproduction — it is where the egg lives.",
    },
    {
      id: 'b40c9154-fa53-47c5-8a83-801fdd817f37',
      type: 'heading',
      order: 3,
      level: 2,
      text: 'From One Nucleus to Eight — Three Quiet Divisions',
      objective: "By the end of this you can trace the megaspore's nucleus through 2 → 4 → 8, and say why no cell walls appear until the very end.",
    },
    {
      id: '60199074-b9e3-47e7-a5c7-af3128c3ca02',
      type: 'text',
      order: 4,
      markdown: "Watch the functional megaspore's single nucleus. It divides by **mitosis** into two nuclei, and those two move to opposite ends of the cell — that's the **2-nucleate** embryo sac. Two more mitotic divisions follow, one after another: 2 becomes 4, and 4 becomes 8. So it takes **three successive mitotic divisions** in total to go from one nucleus to eight — the **2-, 4- and 8-nucleate** stages.\n\nHere's the detail NCERT wants you to notice, and it's the key to the strange count. These divisions are **strictly free-nuclear** — the nucleus divides, but **no cell wall is laid down** between the new nuclei. For a while you have eight nuclei floating in one shared cytoplasm, no walls in sight. Only **after** the 8-nucleate stage do cell walls finally form, carving that shared space into the finished, organised embryo sac.",
    },
    {
      id: '1f248b61-c912-4d63-83fb-d9f17e923c46',
      type: 'heading',
      order: 5,
      level: 2,
      text: 'Where the Eight Nuclei Settle — and Why One Cell Keeps Two',
      objective: 'By the end of this you can place all three cell groups by name and location, and explain exactly where the 8th nucleus goes.',
    },
    {
      id: 'a15ac741-0dac-4ca6-9b63-417bd0c3ff7f',
      type: 'text',
      order: 6,
      markdown: "When the walls come down, the eight nuclei don't share out one-per-cell. **Six of the eight** get wrapped in cell walls and become proper, single-nucleus cells. The **remaining two** — called the **polar nuclei** — stay together, unwalled from each other, sitting below the egg apparatus inside one **large central cell**. That's the whole reason for the count: six walled cells, plus one central cell holding two nuclei, gives **7 cells but 8 nuclei**.\n\nNow the layout, because NCERT tests position as hard as it tests number. At the **micropylar end** — the end with the opening — three cells cluster together as the **egg apparatus**: one **egg cell** in the middle, flanked by **two synergids**. The synergids carry special thickenings at their micropylar tips called the **filiform apparatus**, whose job is to **guide the pollen tube into the synergid** later on. At the opposite **chalazal end** sit **three antipodal cells**. Filling the middle is the **central cell** with its **two polar nuclei**. Add them up: 1 egg + 2 synergids + 3 antipodals + 1 central cell = **7 cells**; and 1 + 2 + 3 + 2 nuclei in the central cell = **8 nuclei**.",
    },
    {
      id: '2cb7c67d-77fc-4a8a-8797-9de3bcaf743c',
      type: 'interactive_image',
      order: 7,
      src: '',
      alt: 'A mature 7-celled, 8-nucleate angiosperm embryo sac with the egg apparatus at the micropylar end and antipodals at the chalazal end',
      caption: '📸 Tap each dot to explore the mature embryo sac — count the cells, then count the nuclei',
      generation_prompt: "Scientific textbook illustration of a mature angiosperm embryo sac (female gametophyte), matching NCERT Figure 1.8(c). Flat 2D educational diagram on a dark background (#0a0a0a near-black). A single large oval sac stood upright, wider than it is at the ends, with clean white outlines. The MICROPYLAR END is at the BOTTOM of the oval, narrowing slightly to a small opening; the CHALAZAL END is at the TOP. At the bottom (micropylar) end sit three cells grouped together: one central pear-shaped egg cell flanked by two smaller synergid cells, the synergids showing fine comb-like thickenings (filiform apparatus) at their lowest tips pointing toward the micropylar opening. Filling the whole middle of the sac is one very large central cell containing two small rounded nuclei (the polar nuclei) drawn close together, positioned just above the egg apparatus. At the top (chalazal) end sit three small rounded antipodal cells in a cluster. Each nucleus rendered as a soft rounded dot; animal-soft-tissue pink/magenta fill tones for the cells, purple for the nuclei. No text or labels baked into the image itself, no leader lines, no photorealism, no cartoon. Matches standard biology textbook illustration conventions.",
      hotspots: [
        { id: '2ec9bb58-e41f-4b82-87b8-184b38876ca1', x: 0.5, y: 0.95, label: 'Micropylar end', icon: 'circle',
          detail: 'The end of the sac nearest the ovule opening (the micropyle). This is where the **egg apparatus** sits — and where the pollen tube will eventually arrive.' },
        { id: 'c5a3edf8-541b-4b3e-ad81-d7b39257fd9c', x: 0.5, y: 0.80, label: 'Egg cell', icon: 'circle',
          detail: 'The single female gamete, sitting in the middle of the egg apparatus at the micropylar end. This is the cell a male gamete will fuse with at fertilisation.' },
        { id: 'a0b532a3-285c-4d4e-9d01-ded9316c585b', x: 0.30, y: 0.83, label: 'Synergids (×2)', icon: 'circle',
          detail: 'Two cells flanking the egg cell. Together with the egg they make up the **egg apparatus** (3 cells total at the micropylar end).' },
        { id: 'e6f4a2e0-014a-4e93-a5be-cc8adecd5cb8', x: 0.5, y: 0.90, label: 'Filiform apparatus', icon: 'circle',
          detail: 'Special cellular thickenings at the micropylar tips of the synergids. Their job: **guide the pollen tube into the synergid** — the bridge to double fertilisation on the next page.' },
        { id: '6e788b0f-700e-4c50-ae6a-d3d298b21f17', x: 0.56, y: 0.52, label: 'Central cell', icon: 'circle',
          detail: 'One very large cell filling the middle of the sac. It is a single *cell*, but it carries **two** nuclei — which is exactly why the sac is 7-celled yet 8-nucleate.' },
        { id: 'd67f5e01-4c0f-4e39-b988-d0a53d6e334f', x: 0.5, y: 0.46, label: 'Polar nuclei (×2)', icon: 'circle',
          detail: 'The two nuclei that stayed together — unwalled from each other — inside the central cell, just below the egg apparatus. They are the 7th and 8th nuclei of the eight.' },
        { id: '155497e0-3863-4320-8e3a-d3b737ea9d32', x: 0.5, y: 0.16, label: 'Antipodal cells (×3)', icon: 'circle',
          detail: 'Three cells grouped at the chalazal end, opposite the egg apparatus. Three separate cells, three separate nuclei.' },
        { id: '819a326a-c4c0-4388-8204-150825ece162', x: 0.5, y: 0.06, label: 'Chalazal end', icon: 'circle',
          detail: 'The end opposite the micropyle, the basal part of the ovule. The **three antipodals** sit here.' },
      ],
    },
    {
      id: '43725cd2-9e60-4e96-9372-efdcbe859f76',
      type: 'reasoning_prompt',
      order: 8,
      reasoning_type: 'logical',
      prompt: "A student counts the nuclei inside a mature embryo sac and gets 8. A moment later she counts the cells and gets 7. She thinks she must have miscounted one of them. Has she? Which cell is responsible for the mismatch, and why is it not an error?",
      options: [
        'She miscounted — a normal embryo sac must be 8-celled and 8-nucleate, one nucleus per cell',
        'Both counts are correct: the central cell is a single cell but holds two polar nuclei, so 6 one-nucleus cells + 1 two-nucleus central cell = 7 cells and 8 nuclei',
        'Both counts are correct because one of the synergids has two nuclei while the egg cell has none',
        'She miscounted — the three antipodals are actually a single fused cell, making it 5 cells and 8 nuclei',
      ],
      reveal: "Both counts are right, and nothing was miscounted. Six of the eight nuclei get their own cell wall and become single-nucleus cells (1 egg + 2 synergids + 3 antipodals). The last two nuclei — the polar nuclei — stay together inside one large central cell. So the eighth nucleus doesn't add an eighth cell; it just doubles up inside the central cell. That's why the sac is 7-celled but 8-nucleate. The synergids and egg each have exactly one nucleus, and the antipodals are three genuinely separate cells — so the other options put the extra nucleus in the wrong place.",
      difficulty_level: 2,
    },
    {
      id: 'f7088c51-d208-4e38-97a3-cc2f50768500',
      type: 'callout',
      order: 9,
      variant: 'remember',
      title: 'The One Line to Never Get Wrong',
      markdown: "A typical angiosperm embryo sac, at maturity, is **7-celled and 8-nucleate**. Lock the breakdown:\n\n- **Micropylar end — egg apparatus (3 cells):** 1 egg cell + 2 synergids (synergids carry the **filiform apparatus**).\n- **Chalazal end — 3 antipodal cells.**\n- **Centre — 1 central cell** holding **2 polar nuclei**.\n- **Cells:** 1 + 2 + 3 + 1 = **7**. **Nuclei:** 1 + 2 + 3 + 2 = **8**.\n\nThe extra nucleus lives in the central cell. Never write '8-celled'.",
    },
    {
      id: '04be98ef-302a-458d-970d-481368adc5e6',
      type: 'callout',
      order: 10,
      variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**7-celled vs 8-nucleate:** NCERT states it in exactly these words, and NEET lifts it verbatim. The favourite trap is the option '8-celled, 8-nucleate' — instant wrong. Also watch for a swapped count like '7-celled, 7-nucleate' or a central cell with '1 polar nucleus'; the central cell always has **two**.\n\n**Monosporic development:** the embryo sac forms from a **single** functional megaspore (the other three megaspores degenerate). This exact term is a one-mark direct question.\n\n**Free-nuclear then walls:** the three mitotic divisions are **strictly free-nuclear** — walls appear only *after* the 8-nucleate stage. A question asking 'at which stage do cell walls form?' is answered by 'after the 8-nucleate stage', not during.\n\n**Position matters:** egg apparatus at the **micropylar** end, antipodals at the **chalazal** end. Swapping these two ends is a classic distractor.",
    },
    {
      id: '7ffc65eb-284f-4b88-8f93-4f84c953d4e4',
      type: 'text',
      order: 11,
      markdown: "One small structure on this page is quietly doing a big job. The **filiform apparatus** on the synergids isn't just decoration — it's the landing guide that will steer the pollen tube into the embryo sac. That handshake between the two gametophytes is the twist that makes flowering plants unique, and it's exactly where the next page begins: **double fertilisation**.",
    },
    {
      id: '3fceb753-d3a1-4b48-93cb-b517b142f7e7',
      type: 'inline_quiz',
      order: 12,
      pass_threshold: 0.67,
      questions: [
        {
          id: 'a2dc7a46-923b-4f16-b8c5-186c22767a12',
          question: 'A typical angiosperm embryo sac at maturity is best described as:',
          options: ['8-celled and 8-nucleate', '7-celled and 8-nucleate', '7-celled and 7-nucleate', '8-celled and 7-nucleate'],
          correct_index: 1,
          explanation: "The sac has 7 cells but 8 nuclei — the mismatch comes from the central cell carrying two polar nuclei while every other cell has one. '8-celled, 8-nucleate' is the classic trap: it wrongly gives the eighth nucleus its own cell. '7-celled, 7-nucleate' forgets the second polar nucleus.",
          difficulty_level: 1,
        },
        {
          id: 'a597ba34-4573-4f36-9de0-87936971d422',
          question: 'The two polar nuclei of a mature embryo sac are located in the:',
          options: ['Two synergids, one in each', 'Egg cell', 'Central cell', 'Three antipodal cells'],
          correct_index: 2,
          explanation: "Both polar nuclei sit together inside the single large central cell, just below the egg apparatus — that is why one cell ends up with two nuclei. The synergids and egg each hold exactly one nucleus, and the antipodals are three separate single-nucleus cells, so none of them is where the polar nuclei live.",
          difficulty_level: 2,
        },
        {
          id: '16285677-36cf-47d9-8328-176ebbbfb51d',
          question: 'How many mitotic divisions does the functional megaspore nucleus undergo to reach the 8-nucleate stage, and are cell walls laid down during them?',
          options: [
            'Two divisions, with a wall formed after each',
            'Three meiotic divisions, each immediately followed by a wall',
            'One division, followed immediately by wall formation',
            'Three successive free-nuclear divisions, with walls forming only after the 8-nucleate stage',
          ],
          correct_index: 3,
          explanation: "One nucleus goes 2 → 4 → 8 through three successive mitotic divisions, and these are strictly free-nuclear — no walls appear until after the 8-nucleate stage. The divisions are mitotic, not meiotic (meiosis already happened earlier, in the megaspore mother cell), and walls do not form after each division.",
          difficulty_level: 2,
        },
        {
          id: '390439c1-1fb1-44bb-92d8-fcf7f777b5ab',
          question: 'The egg apparatus of the embryo sac is located at the micropylar end and consists of:',
          options: [
            'One egg cell and two synergids',
            'Three antipodal cells',
            'One egg cell and two polar nuclei',
            'Two egg cells and one synergid',
          ],
          correct_index: 0,
          explanation: "The egg apparatus is three cells at the micropylar end: one egg cell flanked by two synergids (which bear the filiform apparatus). The three antipodals sit at the opposite, chalazal end. The polar nuclei belong to the central cell, not the egg apparatus, and there is only ever one egg cell.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
