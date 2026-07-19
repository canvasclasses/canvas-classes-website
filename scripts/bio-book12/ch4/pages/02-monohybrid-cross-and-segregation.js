'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-monohybrid-cross-and-law-of-segregation',
  title: 'One Gene at a Time — Monohybrid Cross & Segregation',
  subtitle: "Follow a single gene from a tall × dwarf pea cross to the famous 3:1 — and see why the recessive trait vanishes in F1 only to walk back in at F2.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['monohybrid-cross', 'law-of-segregation', 'law-of-dominance', 'punnett-square', 'inheritance'],
  glossary: [
    { term: 'dominance', definition: 'When two members of an allele pair are dissimilar, one member masks the other and is seen in the plant. That expressed member is the dominant factor.' },
    { term: 'segregation', definition: 'The separation of the two alleles of a pair during gamete formation, so that each gamete carries only one allele of the pair.' },
    { term: 'homozygous', definition: 'Having two identical alleles for a character, such as TT or tt. A homozygous parent forms only one kind of gamete.' },
    { term: 'heterozygous', definition: 'Having two dissimilar alleles for a character, such as Tt. A heterozygous plant forms two kinds of gametes in equal proportion.' },
    { term: 'Punnett square', definition: 'A graphical grid, developed by Reginald C. Punnett, used to calculate the probability of all possible genotypes of the offspring in a cross by pairing the gametes written along its top and side.' },
    { term: 'test cross', definition: 'A cross in which an organism showing a dominant phenotype (whose genotype is unknown) is crossed with the recessive parent, so the offspring reveal whether the tested organism is homozygous or heterozygous.' },
    { term: 'back cross', definition: 'A cross of a hybrid with one of its parental types. A test cross is the special back cross made with the recessive parent to expose an unknown genotype.' },
    { term: 'allele', definition: 'One of the slightly different forms of the same gene that code for a pair of contrasting traits, for example T (tall) and t (dwarf).' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A tall pea plant and a short dwarf pea plant standing side by side in a quiet monastery garden at dusk',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet monastery kitchen garden at dusk, softly lit. In the middle foreground two pea plants stand side by side against neat wooden stakes: one clearly tall and leggy, the other clearly short and dwarf, both bearing pale pods and a few white flowers. The pairing of tall and short is the visual anchor without any words. Rows of vegetables recede into a soft blurred background, a low stone wall behind, a warm horizon glow fading into deep dusk. Painterly, atmospheric, naturalistic illustration style on an overall dark background (#0a0a0a base tones). No text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Trait That Disappeared and Came Back',
      markdown: "Mendel crossed a **tall** pea plant with a **dwarf** one, and every single plant in the next generation came out **tall**. The dwarf character simply vanished — as if it had been wiped out. But when he let those tall plants self-pollinate, dwarf plants **reappeared** in the very next generation, in a steady one-in-four. Nothing had blended. The dwarf trait had been hiding all along, carried quietly and passed on unchanged. That one observation is the seed of all of genetics.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Let's take the simplest cross Mendel ran: **tall × dwarf pea plants**, following just **one gene** — height. He collected the seeds from this cross and grew them. This first hybrid generation is called the **Filial₁ progeny**, or the **F₁**.\n\nEvery F₁ plant was **tall**, exactly like one parent — **none were dwarf**. Then Mendel let the tall F₁ plants **self-pollinate** and grew the next generation, the **F₂** (Filial₂). Now the dwarf character that had disappeared came back: about **3/4th of the F₂ plants were tall and 1/4th were dwarf** — a clean **3:1 ratio**. Crucially, there was **no blending**. Every plant was either fully tall or fully dwarf, never in between. This is what tells us the 'factors' are passed on stably, unchanged, from parent to offspring through the gametes. Mendel called them factors; today we call them **genes** — the units of inheritance.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Reading the Symbols: Genotype vs Phenotype',
      objective: "By the end of this you can tell TT, Tt and tt apart, say which are homozygous and which is heterozygous, and explain why Tt still looks tall.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Genes that code for a pair of contrasting traits are called **alleles** — slightly different forms of the same gene. We write the **capital letter for the trait seen in F₁** and the small letter for the other. So **T = tall** and **t = dwarf**, and the possible pairs are **TT, Tt or tt**.\n\nA true-breeding tall plant is **TT** and a true-breeding dwarf is **tt** — both **homozygous** (two identical alleles). TT and tt are the **genotype** (the genetic make-up); *tall* and *dwarf* are the **phenotype** (the visible appearance). Now the key question: what does a **Tt** plant look like? Mendel found the F₁ **Tt** heterozygote looked **exactly like the TT parent** — fully tall. So in a dissimilar pair, one factor **dominates** the other: **T is dominant, t is recessive**. Because Tt carries two alleles for contrasting traits, it is **heterozygous**, and the cross TT × tt (which produces this heterozygote) is a **monohybrid cross**.\n\nWhy does dwarf come back at all? Because when gametes form by **meiosis**, the two alleles of a pair **separate — they segregate** — and each gamete gets only **one** allele. It's random, a 50-50 chance for either allele. A TT plant makes only **T** gametes; a tt plant makes only **t** gametes. At fertilisation, T meets t and the hybrid is **Tt**.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A Punnett square for the F2 of a monohybrid cross, with T and t gametes on top and side and TT, Tt, Tt, tt in the four boxes',
      caption: '📸 Tap each dot to walk through how the F₂ Punnett square is filled (Figure 4.4)',
      hotspots: [
        { id: uuid(), x: 0.56, y: 0.16, label: 'Pollen gamete T', icon: 'circle',
          detail: 'The self-pollinating **Tt** plant makes pollen of two kinds in equal number. This one carries the **T** allele. It sits above the left column.' },
        { id: uuid(), x: 0.80, y: 0.16, label: 'Pollen gamete t', icon: 'circle',
          detail: 'The other pollen type carries the **t** allele — because segregation puts only one allele in each gamete. It sits above the right column.' },
        { id: uuid(), x: 0.30, y: 0.44, label: 'Egg gamete T', icon: 'circle',
          detail: 'The same Tt plant makes eggs too, half carrying **T** and half carrying **t**. This row is the **T** egg. The symbols ♀ (eggs) and ♂ (pollen) mark the two sides.' },
        { id: uuid(), x: 0.30, y: 0.72, label: 'Egg gamete t', icon: 'circle',
          detail: 'This row is the **t** egg. Every box is one pollen randomly meeting one egg — that is what "random fertilisation" means.' },
        { id: uuid(), x: 0.56, y: 0.44, label: 'TT (top-left box)', icon: 'circle',
          detail: 'T pollen fertilises a T egg → **TT**, a homozygous **tall** plant. This is 1/4th of the offspring.' },
        { id: uuid(), x: 0.80, y: 0.44, label: 'Tt boxes', icon: 'circle',
          detail: 'T meeting t (and t meeting T) gives **Tt** — heterozygous, still **tall**. Two of the four boxes are Tt, so 1/2 of the offspring.' },
        { id: uuid(), x: 0.80, y: 0.72, label: 'tt (bottom-right box)', icon: 'circle',
          detail: 't pollen fertilises a t egg → **tt**, a homozygous **dwarf** plant. This is the 1/4th where the hidden recessive trait finally shows.' },
      ],
      generation_prompt: "Scientific textbook illustration of a Punnett square for a monohybrid cross. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A clean 2x2 grid drawn with thin white outlines. Along the top, above the two columns, the gamete symbols T and t (representing pollen, marked with a small male ♂ sign). Down the left side, beside the two rows, the gamete symbols T and t (representing eggs, marked with a small female ♀ sign), all in white text. Inside the four cells, the resulting genotypes in white: top-left TT, top-right Tt, bottom-left Tt, bottom-right tt. Soft green tint on the tall genotypes (TT, Tt) and a muted brown tint on the dwarf tt cell to hint at phenotype. Biologically standard, evenly spaced, no extra decorative labels, no photorealism, no cartoon, no mascots.",
    },
    {
      id: uuid(), type: 'worked_example', order: 6, label: 'Working a Monohybrid Cross', variant: 'solved_example',
      reveal_mode: 'tap_to_reveal',
      problem: "A true-breeding **tall** pea plant (TT) is crossed with a true-breeding **dwarf** pea plant (tt). The F₁ plants are then self-pollinated to give the F₂. Work out the F₂ using a Punnett square, and state both the **phenotypic ratio** and the **genotypic ratio**.",
      solution: "**Step 1 — the parents and their gametes.** TT can only give **T** gametes; tt can only give **t** gametes (segregation puts one allele in each gamete).\n\n**Step 2 — the F₁.** Every T meets a t, so all F₁ are **Tt**. Since T is dominant, all F₁ are **tall** — the dwarf trait disappears here.\n\n**Step 3 — self-pollinate the F₁ (Tt × Tt).** Each Tt parent gives **T** and **t** gametes in equal proportion. Fill the Punnett square:\n\n| | T | t |\n|---|---|---|\n| **T** | TT | Tt |\n| **t** | Tt | tt |\n\n**Step 4 — count the boxes.** Genotypes: **1 TT : 2 Tt : 1 tt** → **genotypic ratio 1:2:1**.\n\n**Step 5 — read the phenotypes.** TT is tall, both Tt are tall (T is dominant), tt is dwarf. So **3 tall : 1 dwarf** → **phenotypic ratio 3:1**.\n\nThe same 1/4 : 1/2 : 1/4 also drops out of the algebra: (½T + ½t)² = ¼ TT + ½ Tt + ¼ tt. Notice the two ratios are different numbers for the *same* cross — that difference is exactly what the next section, and the test cross, is about.",
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: "Mendel's Two Rules for One Gene",
      objective: "By the end of this you can state the Law of Dominance in its three points and the Law of Segregation in one line, and say which law explains the 3:1.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "From these monohybrid crosses Mendel drew two rules, now called the **Laws of Inheritance**.\n\n**First Law — the Law of Dominance:**\n1. Characters are controlled by discrete units called **factors**.\n2. Factors occur **in pairs**.\n3. In a dissimilar pair of factors, **one member dominates** (dominant) the other (recessive).\n\nThis law explains why only **one** parental character shows in F₁, why **both** show in F₂, and the **3:1** proportion at F₂.\n\n**Second Law — the Law of Segregation:** the alleles do **not blend**, and both characters are recovered in F₂ even though one was hidden in F₁. Though a parent carries two alleles, during gamete formation the two alleles of a pair **segregate**, so a gamete receives **only one** of them. A **homozygous** parent makes all similar gametes; a **heterozygous** parent makes **two kinds** of gametes, each with one allele, in equal proportion.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "In the F₂ of a tall × dwarf monohybrid cross, a student says 'the ratio is 1:2:1.' Another says 'no, it's 3:1.' Both are looking at the same F₂ plants. How can both be right?",
      options: [
        "They can't both be right; only 3:1 is correct because Mendel measured plants, not genes",
        "1:2:1 is the genotypic ratio (TT : Tt : tt) and 3:1 is the phenotypic ratio (tall : dwarf); the two Tt and the TT all look tall, so they merge into the '3'",
        "1:2:1 is the F₁ ratio and 3:1 is the F₂ ratio, so they describe different generations",
        "3:1 counts the gametes and 1:2:1 counts the zygotes, so they measure different things",
      ],
      correct_index: 1,
      reveal: "Both are right because they count different things about the *same* F₂. By **genotype** the offspring are 1 TT : 2 Tt : 1 tt (that's 1:2:1). But TT, Tt and Tt all *look* tall because T is dominant, so by **phenotype** they collapse to 3 tall : 1 dwarf (3:1). The tempting trap is the 'F₁ vs F₂' option — but the F₁ of TT × tt is all Tt (a single type, not a ratio), so 1:2:1 cannot be an F₁ ratio. Gametes and zygotes have nothing to do with this split either.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'Finding a Hidden Genotype: The Test Cross',
      objective: "By the end of this you can explain why a tall plant's genotype can't be read from its looks, and how a test cross settles it.",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "Here's the practical problem Mendel hit. A **tall** F₂ plant might be **TT** or **Tt** — and you **cannot tell them apart just by looking**, because both are simply 'tall'. The phenotype hides the genotype.\n\nSo how do you find out? Mendel crossed the tall plant with a **dwarf (tt) plant**. He called this a **test cross**: an organism showing the **dominant phenotype** (genotype unknown) is crossed with the **recessive parent** instead of being self-crossed. The offspring give the answer straight away:\n\n- If the tall plant is **TT** (TT × tt) → **all offspring are tall**.\n- If the tall plant is **Tt** (Tt × tt) → offspring are **1 tall : 1 dwarf**, a **1:1 ratio**.\n\nSo the moment any dwarf offspring appear, the tested plant must have been **heterozygous (Tt)**. The recessive dwarf parent acts like a blank sheet that lets the tested plant's hidden allele show through. Mendel also confirmed the reverse: dwarf F₂ plants (tt) self-pollinated only ever gave dwarfs in F₃ and F₄ — proof they were homozygous. Next we'll see what happens when neither allele is fully dominant, and the F₁ shows a brand-new blended appearance.",
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'remember', title: 'Lock These In',
      markdown: "- **Law of Segregation:** the two alleles of a pair **separate during gamete formation**, so each gamete carries **only one** allele. (Homozygous → one kind of gamete; heterozygous → two kinds, equal proportion.)\n- **Monohybrid F₂ has two ratios:** **phenotypic 3:1** (tall : dwarf) and **genotypic 1:2:1** (TT : Tt : tt). Don't mix them up.\n- **You cannot read a genotype off a dominant phenotype** — a tall plant may be TT or Tt.\n- **Test cross** = cross with the **recessive parent**. All tall offspring → the plant was **TT**; a **1:1** tall : dwarf split → it was **Tt**.",
    },
    {
      id: uuid(), type: 'callout', order: 13, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**3:1 vs 1:2:1:** NEET's favourite monohybrid trap. If the question says *phenotypic*, the answer is **3:1**; if it says *genotypic*, it's **1:2:1**. Read the word before you pick.\n\n**Test cross ratio:** a test cross of a heterozygote (Tt × tt) gives a **1:1** ratio — for both genotype and phenotype. All-tall offspring instead means the tested plant was homozygous **TT**.\n\n**Which law explains the 3:1?** The **Law of Dominance** accounts for one trait in F₁, both in F₂, and the **3:1** proportion. The **Law of Segregation** explains *why the recessive returns* (no blending; alleles separate into gametes).\n\n**Classic NEET question:** \"To determine whether a tall pea plant is TT or Tt, it should be crossed with?\" → a **dwarf (tt) plant — a test cross**; not another tall plant, and not self-pollination.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'In the F₂ of a monohybrid tall × dwarf cross, what is the phenotypic ratio?',
          options: ['1 : 2 : 1', '1 : 1', '3 : 1', '9 : 3 : 3 : 1'],
          correct_index: 2,
          explanation: "The phenotypic ratio is 3 tall : 1 dwarf, because TT, Tt and Tt all appear tall while only tt is dwarf. 1:2:1 is the genotypic ratio of the same F₂ (TT : Tt : tt), so it's the trap for anyone who confuses looks with genes; 1:1 is a test-cross ratio and 9:3:3:1 belongs to a dihybrid cross, not a monohybrid one.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'A tall pea plant is crossed with a dwarf (tt) plant and the offspring come out as 1 tall : 1 dwarf. What was the genotype of the tall parent?',
          options: [
            'TT, because a test cross of a homozygote gives a 1:1 ratio',
            'tt, because only dwarf plants can produce dwarf offspring',
            'It cannot be decided from a test cross',
            'Tt, because a heterozygote crossed with tt gives a 1:1 tall : dwarf ratio',
          ],
          correct_index: 3,
          explanation: "A 1:1 split means the tall parent must have been heterozygous Tt (Tt × tt → half Tt tall, half tt dwarf). The TT option is the tempting one, but TT × tt gives all-tall offspring with no dwarfs at all, so a homozygote could never produce that 1:1. A tall plant obviously isn't tt, and the whole point of a test cross is that it *can* decide the genotype.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "Which law states that the two alleles of a pair separate during gamete formation so that each gamete receives only one allele?",
          options: [
            'The Law of Segregation',
            'The Law of Dominance',
            'The Law of Independent Assortment',
            'The Law of Incomplete Dominance',
          ],
          correct_index: 0,
          explanation: "This is the Law of Segregation — alleles don't blend, they separate into gametes, one per gamete. The Law of Dominance is the tempting neighbour, but it's about which factor is expressed in a dissimilar pair, not about how alleles split into gametes. Independent assortment concerns two genes together (a dihybrid idea), and 'incomplete dominance' is a pattern of expression, not one of Mendel's two laws of the single gene.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Why can a test cross reveal an unknown genotype while self-pollination cannot?',
          options: [
            'Because self-pollination always produces sterile offspring that cannot be counted',
            'Because the recessive parent contributes only recessive alleles, letting the tested plant’s hidden allele show up directly in the offspring',
            'Because a test cross doubles the number of genes in each gamete',
            'Because crossing with a dominant parent masks all recessive traits in the offspring',
          ],
          correct_index: 1,
          explanation: "The recessive (tt) parent can only pass on t, so it never adds anything that could hide the tested plant's allele — any T or t the tall plant carries shows straight through in the offspring ratio (all-tall vs 1:1). Self-pollination of a tall plant can still give a 3:1 that doesn't cleanly separate TT from Tt at a glance. The other options invent effects — sterility, gene-doubling, masking by a dominant parent — that Mendel never described.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
