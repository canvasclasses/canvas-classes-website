'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'polygenic-inheritance-and-pleiotropy',
  title: 'Beyond Simple Genes — Polygenic Inheritance & Pleiotropy',
  subtitle: "Some traits need many genes to make one thing (skin colour, height); some genes single-handedly change many things at once (phenylketonuria). Two opposite ideas NEET loves to swap.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['principles-of-inheritance', 'polygenic-inheritance', 'pleiotropy', 'phenylketonuria', 'skin-colour'],
  glossary: [
    { term: 'polygenic inheritance', definition: 'A pattern where a single trait is controlled by three or more genes acting together, with each allele adding a small effect. Human skin colour and human height work this way.' },
    { term: 'continuous variation', definition: 'A trait that is not split into a few sharp alternatives but spreads across a smooth gradient — like the full range of human heights from very short to very tall, rather than just "tall" or "short".' },
    { term: 'additive effect', definition: 'When each dominant allele contributes its own small amount to the final phenotype, so the phenotype reflects the total number of such alleles rather than a simple present/absent switch.' },
    { term: 'pleiotropy', definition: 'The situation where one single gene produces several different phenotypic effects at once. Such a gene is called a pleiotropic gene.' },
    { term: 'phenylketonuria', definition: 'A human disease caused by mutation in the single gene coding for the enzyme phenylalanine hydroxylase; it shows up as mental retardation together with reduced hair and skin pigmentation — a classic pleiotropy example.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dusk composition where a smooth spectrum of human skin tones fades from very dark to very light across the frame, while on one side a single glowing seed splits into a round and a wrinkled form',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). One shared dark, naturalistic dusk background (#0a0a0a base tones). Across the left two-thirds, a smooth left-to-right gradient of human forearm silhouettes showing skin tone shading gently from very dark through medium to very light — a seamless spectrum, not separate boxes — suggesting a trait that spreads across a continuous range. On the right third, a single softly glowing pea seed appears to divide into two outcomes: one round and smooth, one shrivelled and wrinkled, hinting that one source can shape more than one feature. Painterly, atmospheric, warm low light. No text, no labels, no diagram elements, no arrows, no boxes.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Skin Colour Comes as a Spectrum, Not a Switch',
      markdown: "Look around a crowded room. You will not find just 'dark-skinned people' and 'light-skinned people' as two clean camps — you'll see a smooth range of tones sliding from one end to the other, with every shade in between. The same is true for height: not just tall and short, but a whole gradient of heights. That gentle spread is your clue that these traits are **not** run by a single on-or-off gene. Several genes are quietly adding up their effects, and each shade you see is a different total.",
    },
    {
      id: uuid(), type: 'heading', order: 2, level: 2,
      text: 'Polygenic Inheritance — Many Genes Building One Trait',
      objective: 'By the end of this you can explain why skin colour and height come as a gradient, and predict who is darkest, lightest, and in between from the count of dominant alleles.',
    },
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "Mendel studied traits with **distinct alternate forms** — a pea flower is either purple or white, nothing in between. But many real traits don't behave like that. In humans we don't come as just 'tall' or 'short'; there is a **whole range of possible heights spread across a gradient**. Traits like this are generally controlled by **three or more genes**, and so are called **polygenic traits**. On top of the multiple genes, polygenic inheritance also takes in the **influence of the environment** — the same genes can play out a little differently depending on surroundings. **Human skin colour** is another classic example.\n\nThe key idea is that the **effect of each allele is additive** — the final phenotype reflects the contribution of every allele added together. Take skin colour and assume three genes **A, B, C** control it, with the dominant forms **A, B, C** giving dark skin and the recessive forms **a, b, c** giving light skin. Then:\n\n- **AABBCC** (all six dominant alleles) → the **darkest** skin colour.\n- **aabbcc** (all six recessive alleles) → the **lightest** skin colour.\n- **Three dominant + three recessive alleles** → an **intermediate** skin colour.\n\nSo it is simply the **number of each type of allele** in the genotype that dials the darkness or lightness up and down. Because the total can land almost anywhere between the two extremes, the trait shows **continuous variation** — a smooth gradient instead of a few sharp categories.",
    },
    {
      id: uuid(), type: 'heading', order: 4, level: 2,
      text: 'Pleiotropy — One Gene Touching Many Traits',
      objective: 'By the end of this you can explain how a single gene changes several features at once, using phenylketonuria and the starch-synthesis pea seed as NCERT does.',
    },
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "Now flip the arrow the other way. So far a gene has affected a single trait. But sometimes a **single gene can show multiple phenotypic effects** — such a gene is called a **pleiotropic gene**, and the phenomenon is **pleiotropy**. The usual **mechanism** is that the gene acts on a **metabolic pathway**, and that one pathway feeds into several different phenotypes.\n\nThe textbook example is **phenylketonuria** in humans. It is caused by a **mutation in the single gene** that codes for the enzyme **phenylalanine hydroxylase** — one gene, one mutation. Yet it shows up as **two separate effects at once**: **mental retardation** *and* **a reduction in hair and skin pigmentation**. One broken gene, several changed features — that is pleiotropy.\n\nA second NCERT example ties pleiotropy to dominance. **Starch synthesis in pea seeds** is controlled by **one gene** with two alleles, **B** and **b**. **BB** homozygotes make starch efficiently and produce **large starch grains**; **bb** homozygotes are less efficient and make **smaller** grains. After the seeds mature, **BB seeds are round** and **bb seeds are wrinkled**. Heterozygotes **Bb** produce **round seeds**, so by seed *shape* **B looks dominant** (complete dominance). But the **starch grains in Bb are of intermediate size** — so if you judge the *starch-grain* phenotype, the same alleles show **incomplete dominance**. One gene, two phenotypes (seed shape and grain size), and even the label 'dominant' depends on which phenotype you choose to look at.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 6,
      title: 'Polygenic Inheritance vs Pleiotropy',
      columns: [
        {
          heading: 'Polygenic inheritance (many genes → one trait)',
          points: [
            'Direction: MANY genes act on ONE single trait.',
            'Each allele adds a small, additive effect; the phenotype = the sum.',
            'Produces continuous variation — a smooth gradient, not sharp categories.',
            'Environment also influences the outcome.',
            'NCERT examples: human skin colour, human height.',
          ],
        },
        {
          heading: 'Pleiotropy (one gene → many traits)',
          points: [
            'Direction: ONE single gene produces MANY phenotypic effects.',
            'Mechanism: the gene affects a metabolic pathway feeding several phenotypes.',
            'Effects appear together in the same individual.',
            'The gene is called a pleiotropic gene.',
            'NCERT examples: phenylketonuria; starch synthesis (shape + grain size) in pea seeds.',
          ],
        },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "A student reads two facts: (1) human skin colour ranges smoothly from very dark to very light, and (2) one mutated gene in phenylketonuria causes both mental retardation and reduced pigmentation. Which statement correctly labels each fact?",
      options: [
        "Both facts are examples of pleiotropy, because a gene is involved in each",
        "Fact 1 is polygenic inheritance (many genes → one trait); Fact 2 is pleiotropy (one gene → many traits)",
        "Fact 1 is pleiotropy (one gene → many shades); Fact 2 is polygenic inheritance (many genes → the disease)",
        "Both facts are examples of polygenic inheritance, because more than one thing changes",
      ],
      reveal: "The direction of the arrow is what separates them. Skin colour is **one trait built by three or more genes adding up** — that is **polygenic inheritance**, and its many small contributions are exactly why the colour comes as a gradient. Phenylketonuria is **one mutated gene producing several effects at once** (mental retardation plus reduced pigmentation) — that is **pleiotropy**. Option C is the classic swap: it reverses the two directions. The gradient of skin colour is not one gene making many shades — it is many genes together, so calling it pleiotropy is wrong.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 8, variant: 'remember', title: "Don't Mix Up the Two Arrows",
      markdown: "**Polygenic inheritance → many genes make ONE trait.** Three or more genes, each allele's effect **additive**, giving **continuous variation**. Also shaped by **environment**. Examples: **human skin colour, human height**.\n\n**Pleiotropy → ONE gene makes MANY traits.** A single **pleiotropic gene** shows **multiple phenotypic effects**, usually by acting on a **metabolic pathway**. Examples: **phenylketonuria** (mental retardation + reduced hair/skin pigmentation), and **starch synthesis in pea seeds** (seed shape + starch-grain size from one B/b gene).\n\n**Skin colour genotypes:** all dominant (**AABBCC**) = darkest; all recessive (**aabbcc**) = lightest; three dominant + three recessive = intermediate.",
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Polygenic inheritance:** controlled by **three or more genes**, allele effects are **additive**, and it accounts for the **influence of environment**. NCERT's two named examples are **human skin colour** and **human height** — memorise both.\n\n**Pleiotropy:** a **single gene** with **multiple phenotypic effects**; mechanism = the gene's effect on **metabolic pathways**. The named disease is **phenylketonuria**, caused by mutation in the gene for **phenylalanine hydroxylase**.\n\n**Classic NEET question:** \"Human skin colour is an example of ______.\" → **polygenic inheritance** (not pleiotropy). And the reverse trap: \"Phenylketonuria illustrates ______.\" → **pleiotropy** (not polygenic inheritance). Remember: skin colour = many genes → one trait; phenylketonuria = one gene → many traits.",
    },
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "So two opposite ideas sit side by side: several genes teaming up to paint one smooth spectrum, and a lone gene reaching out to change several features at once. Keep the direction of the arrow clear and these can't trip you. Next we turn to how a completely different question — whether an organism becomes male or female — is settled: **sex determination**.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'Which set of features correctly describes polygenic inheritance?',
          options: [
            'A single gene produces several phenotypic effects at once',
            'Two alleles of one gene blend to give an intermediate in the heterozygote',
            'A trait is controlled by three or more genes whose allele effects are additive and are also influenced by the environment',
            'A gene has more than two alleles present together in one individual',
          ],
          correct_index: 2,
          explanation: 'Polygenic inheritance means one trait is built by three or more genes, each allele adding its small effect, with the environment also playing a part — which is why the trait shows continuous variation. Option A describes pleiotropy (the opposite direction). Option B describes incomplete dominance, and option D describes multiple alleles — different concepts entirely.',
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'If three genes A, B, C control human skin colour (dominant alleles → dark, recessive → light), which genotype gives the darkest possible skin?',
          options: [
            'AABBCC',
            'AaBbCc',
            'aabbcc',
            'AABbcc',
          ],
          correct_index: 0,
          explanation: 'Because the allele effects are additive, the more dominant (dark) alleles present, the darker the skin. AABBCC carries all six dominant alleles, giving the darkest colour. aabbcc has all recessive alleles (lightest), AaBbCc has three dominant + three recessive (intermediate), and AABbcc sits in between — none is as dark as the all-dominant genotype.',
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Phenylketonuria — where one mutated gene causes both mental retardation and reduced hair and skin pigmentation — is a textbook example of which phenomenon?',
          options: [
            'Polygenic inheritance, because several features change',
            'Codominance, because two alleles are both expressed',
            'Multiple allelism, because the gene has many alleles',
            'Pleiotropy, because one gene produces multiple phenotypic effects',
          ],
          correct_index: 3,
          explanation: 'One gene (coding for phenylalanine hydroxylase) affecting a metabolic pathway and thereby causing several effects at once is pleiotropy. The trap is option A: even though "several features change," it is still ONE gene doing it, so it is pleiotropy, not polygenic inheritance (which needs many genes acting on one trait). Codominance and multiple allelism are unrelated to this single-gene, multiple-effect pattern.',
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'In pea seeds, one gene with alleles B and b controls starch synthesis. Bb seeds are round (like BB), yet their starch grains are of intermediate size. What does this show?',
          options: [
            'The gene is polygenic because it affects starch',
            'The same gene shows complete dominance for seed shape but incomplete dominance for starch-grain size — pleiotropy',
            'Seed shape and grain size are controlled by two different genes',
            'B and b are codominant for both seed shape and grain size',
          ],
          correct_index: 1,
          explanation: 'One gene affects two phenotypes (seed shape and starch-grain size), which is pleiotropy. Judged by shape, Bb is round like BB, so B is completely dominant; judged by grain size, Bb is intermediate, so the alleles show incomplete dominance — the label depends on which phenotype you examine. It is a single gene (not two, and not polygenic), and it is not codominance because the heterozygote is not showing both pure parental phenotypes together.',
          difficulty_level: 3,
        },
      ],
    },
  ],
};
