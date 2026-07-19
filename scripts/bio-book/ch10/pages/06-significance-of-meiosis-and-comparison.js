'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'significance-of-meiosis-and-comparison',
  title: 'Why Meiosis Matters — and Mitosis vs Meiosis',
  subtitle: "Meiosis cuts the chromosome number in half — and that halving is exactly what keeps a species' chromosome number steady, generation after generation, while quietly stirring in the variation that evolution runs on. Then we lay mitosis and meiosis side by side, one clean contrast at a time.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['cell-cycle-and-cell-division', 'meiosis', 'mitosis'],
  glossary: [
    { term: 'equational division', definition: 'Another name for mitosis — the chromosome number of the parent cell is conserved unchanged in each daughter cell (2n → 2n).' },
    { term: 'reduction division', definition: 'Another name for meiosis — it reduces the chromosome number by half while making the gametes (2n → n).' },
    { term: 'gamete', definition: 'A reproductive cell (egg or sperm) carrying a complete haploid set of chromosomes; gametes are formed from specialised diploid cells by meiosis.' },
    { term: 'fertilisation', definition: 'The fusion of two gametes; because each gamete is haploid, their fusion restores the diploid chromosome number in the offspring — the value found in the parent.' },
    { term: 'crossing over', definition: 'The exchange of segments between paired homologous chromosomes during prophase of meiosis I; it is a source of the genetic variability meiosis introduces.' },
    { term: 'genetic variability', definition: 'Differences in the genetic make-up among individuals of a population; meiosis increases it from one generation to the next, and variations are important for evolution.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'Two glowing lineages of cells stretching into the distance across a dark field — one line where cells stay whole, another where each cell splits into a fan of four smaller cells',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). On a deep near-black background (#0a0a0a base tones), two softly glowing lineages of translucent cells recede into the distance like two paths. One path keeps its cells whole and identical as it moves forward; the other path shows each cell gently splitting and fanning out into four smaller, paler cells, suggesting halving and variety. Warm, faint bioluminescent light, painterly and atmospheric, a quiet sense of generations passing. No text, no labels, no diagram arrows, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'You Are 46. Your Parents Were 46. So Were Theirs.',
      markdown: "Every ordinary cell in a human body carries the same fixed chromosome count, and that count did not drift up or down across the thousands of generations behind you. Here's the strange part: the one cell division responsible for keeping that number steady is the same division that **cuts the number in half**. Meiosis halves — and yet, across generations, nothing is lost. This page is about how a halving keeps things constant.",
    },
    // ── 2 · Core concept — the paradox stated plainly ────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Sexual reproduction begins when **two gametes fuse**. Each gamete — an egg or a sperm — carries a complete **haploid** set of chromosomes: exactly half the number found in an ordinary body cell. Those gametes are made from specialised **diploid** cells by **meiosis**, the division that **reduces the chromosome number by half**.\n\nNow follow the arithmetic. If gametes were made without halving, two full diploid cells fusing would double the chromosome number every single generation — and it would keep doubling forever. Meiosis prevents that. It halves the number **before** fusion, so that when two haploid gametes fuse at **fertilisation**, the diploid number is simply **restored** to the value the parent had. Halve, then fuse — and you land back exactly where you started.",
    },
    // ── 3 · Heading — Significance of meiosis ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Significance of Meiosis',
      objective: "By the end of this you can state, in NCERT's own terms, the two things meiosis achieves for a species — conserving its chromosome number across generations, and increasing genetic variability for evolution.",
    },
    // ── 4 · Text — the two jobs of meiosis ───────────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "NCERT gives meiosis two jobs, and both matter for NEET.\n\n**First — it conserves the species' chromosome number across generations.** Meiosis is the mechanism by which the specific chromosome number of each species is kept constant from one generation to the next in sexually reproducing organisms — **even though the process itself, paradoxically, reduces the chromosome number by half.** The halving is not a loss; it is the exact step that makes the fusion at fertilisation come out right.\n\n**Second — it increases genetic variability.** Meiosis increases the genetic variability in a population of organisms from one generation to the next. This is why offspring are not identical copies of their parents. And **variations are very important for the process of evolution** — without new variation to work on, evolution has nothing to select from.",
    },
    // ── 5 · Heading — Mitosis vs Meiosis ─────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Mitosis vs Meiosis — The Whole Chapter in One Contrast',
      objective: "By the end of this you can lay mitosis and meiosis side by side and, feature by feature, say how they differ — division type, chromosome outcome, number of divisions, where each occurs, how many cells result, and what each is for.",
    },
    // ── 6 · Text — set up the contrast ───────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "You've now met both divisions. **Mitosis** is the **equational division**: the chromosome number of the parent is conserved unchanged in the daughter cells, and it drives **growth and repair**. **Meiosis** is the **reduction division**: it happens in diploid cells destined to form gametes, cuts the chromosome number in half, and makes the **gametes** that carry variation forward. The table below sets every contrast NCERT draws between them in one place — this is the comparison exams reach for again and again.",
    },
    // ── 7 · Table — Mitosis vs Meiosis ───────────────────────────────────────
    {
      id: uuid(), type: 'table', order: 7,
      caption: '📸 Mitosis vs Meiosis — the full NCERT contrast, feature by feature',
      headers: ['Feature', 'Mitosis', 'Meiosis'],
      rows: [
        ['Type of division', 'Equational division', 'Reduction division'],
        ['Chromosome number outcome', 'Conserved — same as parent (2n → 2n)', 'Halved — one-half of parent (2n → n)'],
        ['Number of divisions', 'One', 'Two (meiosis I and meiosis II)'],
        ['Rounds of DNA replication', 'One', 'One (before meiosis I only)'],
        ['Where it occurs', 'Somatic/diploid cells (and some haploid cells in lower plants and social insects)', 'Diploid cells destined to form gametes'],
        ['Daughter cells produced', 'Two', 'Four'],
        ['Pairing of homologues & crossing over', 'Absent', 'Present — in prophase of meiosis I'],
        ['Purpose', 'Growth and repair', 'Gamete formation and variation'],
      ],
    },
    // ── 8 · Interactive image — 2 vs 4, diploid vs haploid ───────────────────
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'One diploid parent cell dividing by mitosis into two diploid cells on the left, and an identical diploid parent cell dividing by meiosis into four haploid cells on the right',
      caption: '📸 Tap each dot to explore how one starting cell ends up as 2 identical cells by mitosis but 4 half-sized cells by meiosis.',
      generation_prompt: "Scientific textbook illustration comparing mitosis and meiosis outcomes. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. LEFT side: one round diploid parent cell (drawn with two pairs of coloured chromosomes inside, magenta) with a downward arrow to TWO daughter cells of the same size, each containing the same full chromosome set — labelled 'Mitosis: 2 diploid cells'. RIGHT side: an identical round diploid parent cell with a downward arrow branching to FOUR smaller daughter cells, each containing only half the chromosome set — labelled 'Meiosis: 4 haploid cells'. A faint vertical divider separates the two halves. Green=living, magenta=chromosomes/soft tissue. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.22, y: 0.28, label: 'Diploid parent cell', detail: 'Both sides start from the same thing: a single **diploid** cell carrying the full chromosome set. In the body this is a somatic cell (mitosis) or a specialised cell destined to form gametes (meiosis).', icon: 'circle' },
        { id: uuid(), x: 0.22, y: 0.74, label: '2 diploid daughter cells', detail: '**Mitosis** ends here — one division gives **two** cells, each with the parent\'s full chromosome number conserved. Identical genetic complement, ready for **growth and repair**.', icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.55, label: '4 haploid daughter cells', detail: '**Meiosis** ends here — two divisions give **four** cells, each with **half** the parent\'s chromosome number. These become the **gametes**.', icon: 'circle' },
        { id: uuid(), x: 0.72, y: 0.32, label: 'Two divisions, one replication', detail: 'The DNA is copied only **once**, but the cell then divides **twice** (meiosis I and meiosis II). That is why four cells end up with half the chromosomes rather than the full set.', icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.5, label: '2 vs 4, whole vs half', detail: 'Same starting cell, two very different endings: mitosis keeps the number whole in 2 cells; meiosis halves it across 4 cells. That single difference is the heart of this chapter.', icon: 'circle' },
      ],
    },
    // ── 9 · Reasoning prompt — the halving paradox ───────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "Meiosis cuts a cell's chromosome number in half — yet NCERT calls it the mechanism that keeps each species' chromosome number constant across generations. How can halving the number actually keep it constant?",
      options: [
        "Because meiosis is immediately followed by a mitosis that doubles the number back up inside the same organism",
        "Because each gamete carries a halved (haploid) set, so when two gametes fuse at fertilisation the full diploid number is restored in the offspring",
        "Because the crossing over during meiosis I adds back the chromosomes that were removed by the reduction division",
        "Because meiosis only halves the chromosome number in plants; in animals it copies the number across unchanged",
      ],
      reveal: "Option 2 is right. The halving is the whole point. Each gamete carries half the chromosome set, so the fusion of two gametes at fertilisation adds the two halves back to the parent's diploid value — and the species number is conserved generation after generation. Option 1 is wrong: no doubling mitosis rescues the gamete; the number is restored by the fusion of two cells, not by one cell dividing. Option 3 is wrong: crossing over exchanges segments between homologous chromosomes to create variation — it does not add chromosomes back. Option 4 is wrong: meiosis reduces the chromosome number by half in every sexually reproducing organism, not only in plants.",
      difficulty_level: 3,
    },
    // ── 10 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Significance of meiosis (two jobs):** (i) it conserves the specific chromosome number of each species across generations — even though the process itself halves the number — because fertilisation later restores the diploid value; (ii) it increases genetic variability from one generation to the next, and variations are important for **evolution**.\n- **Mitosis = equational** → number conserved (2n → 2n), **one** division, **two** daughter cells, no pairing/crossing over, in somatic/diploid cells, for **growth and repair**.\n- **Meiosis = reduction** → number halved (2n → n), **two** divisions but **one** DNA replication, **four** haploid daughter cells, **pairing of homologues + crossing over** in prophase I, in diploid cells destined to form gametes, for **gamete formation and variation**.\n- The single sentence that ties it together: **halve at meiosis, restore at fertilisation** — that is how a halving keeps a species' chromosome number constant.",
    },
    // ── 11 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**The two words examiners test:** mitosis is the **equational** division (number conserved); meiosis is the **reduction** division (number halved). Mixing these up is the most common single mistake on this topic.\n\n**Crossing over belongs to meiosis, never mitosis** — it happens in the prophase of **meiosis I**, where homologous chromosomes pair. If a question ties crossing over or pairing of homologues to mitosis, it is wrong.\n\n**Count carefully:** meiosis = **two** divisions but only **one** round of DNA replication → **four** haploid cells. Mitosis = one division → two diploid cells.\n\n**Classic NEET question:** \"Meiosis produces ______ daughter cells, each of which is ______.\" → **four, haploid.**",
    },
    // ── 12 · Closing synthesis text ──────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "Step back and look at the whole chapter at once. A cell does not divide randomly — it moves through the ordered **cell cycle**, growing and copying its DNA in interphase before it ever splits. When it splits by **mitosis**, the chromosome number is conserved, so the body can **grow and repair itself** with faithful copies. When a cell destined to make gametes splits by **meiosis** instead, the number is halved and reshuffled, producing **four haploid cells** carrying fresh variation — the cells that, fused at fertilisation, restore the species' number and hand new variation to the next generation for evolution to work on. One cycle, two kinds of division, and between them they build a body, mend it, and keep life going across generations. That's the engine at the base of every living thing — and you now understand how it turns.",
    },
    // ── 13 · Inline quiz (LAST) ──────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "According to NCERT, what are the two significances of meiosis?",
          options: [
            "It conserves the species' chromosome number across generations, and it increases genetic variability for evolution",
            "It repairs damaged tissue, and it restores the nucleo-cytoplasmic ratio of the cell",
            "It doubles the chromosome number, and it produces two genetically identical daughter cells",
            "It drives the continuous growth of plants, and it replaces worn-out blood and gut-lining cells",
          ],
          correct_index: 0,
          explanation: "NCERT names exactly two significances of meiosis: conserving the specific chromosome number of a species across generations (despite halving it), and increasing genetic variability, which matters for evolution. Options 2 and 4 describe the significance of mitosis (repair, nucleo-cytoplasmic ratio, plant growth, replacing epidermal/gut/blood cells). Option 3 is simply false — meiosis halves the number and gives four non-identical cells.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "How does a division that halves the chromosome number end up keeping a species' chromosome number constant across generations?",
          options: [
            "A second mitosis after meiosis doubles the halved number back to normal",
            "Each gamete is haploid, so the fusion of two gametes at fertilisation restores the diploid number of the parent",
            "Crossing over in meiosis I replaces the chromosomes lost during the reduction division",
            "The chromosome number only appears halved; meiosis actually copies the full set into each gamete",
          ],
          correct_index: 1,
          explanation: "Meiosis halves the number so each gamete is haploid; when two haploid gametes fuse at fertilisation, the two halves add back to the parent's diploid value, keeping the species number constant. There is no rescuing mitosis (option 1). Crossing over creates variation, it does not restore lost chromosomes (option 3). And meiosis genuinely halves the number — the gamete is truly haploid (option 4).",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which single feature correctly separates mitosis from meiosis?",
          options: [
            "Mitosis involves pairing of homologous chromosomes and crossing over; meiosis does not",
            "Mitosis occurs in diploid cells destined to form gametes; meiosis occurs in ordinary somatic cells",
            "Mitosis is the equational division that conserves the chromosome number; meiosis is the reduction division that halves it",
            "Mitosis produces four haploid daughter cells; meiosis produces two diploid daughter cells",
          ],
          correct_index: 2,
          explanation: "The defining contrast is equational versus reduction: mitosis conserves the parent's chromosome number (2n → 2n), meiosis halves it (2n → n). Option 1 reverses reality — pairing and crossing over belong to meiosis, not mitosis. Option 2 swaps where each occurs. Option 4 swaps the cell counts and ploidy — mitosis gives two diploid cells, meiosis gives four haploid cells.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "During meiosis, the DNA is replicated once but the cell divides twice. What is the direct consequence of this?",
          options: [
            "Two daughter cells form, each with the full diploid chromosome set of the parent",
            "Four daughter cells form, each with half the chromosome number of the parent",
            "Four daughter cells form, each with the full diploid chromosome set of the parent",
            "Two daughter cells form, each with a doubled chromosome number",
          ],
          correct_index: 1,
          explanation: "One round of DNA replication followed by two divisions (meiosis I and meiosis II) spreads the chromosomes across four cells, each ending up with half the parent's number — four haploid cells. If DNA were copied before each division, the number would stay full; because it is copied only once, the two divisions produce the reduction. Options 1 and 4 describe two cells (that's mitosis' arithmetic), and option 3 keeps the set diploid, which would require an extra replication that meiosis does not perform.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
