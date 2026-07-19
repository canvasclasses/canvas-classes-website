'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'mendel-and-his-pea-experiments',
  title: 'Mendel & His Pea Experiments',
  subtitle: 'Why one monk with a garden full of pea plants — and a habit of counting everything — became the person who cracked how traits pass from parent to child.',
  page_number: 1,
  page_type: 'lesson',
  tags: ['principles-of-inheritance', 'mendel', 'garden-pea', 'true-breeding', 'genetics-terminology'],
  glossary: [
    { term: 'true-breeding line', definition: "A line of plants that, after continuous self-pollination for several generations, keeps showing the same stable trait every time. A true-breeding tall line gives only tall offspring." },
    { term: 'allele', definition: "One of the slightly different forms of the same gene. The gene for pea height has two alleles — one for 'tall' and one for 'dwarf'." },
    { term: 'dominant', definition: "The allele whose trait shows up in the F1 hybrid when two different alleles are paired. Written with a capital letter, e.g. T for tall." },
    { term: 'recessive', definition: "The allele whose trait is hidden in the F1 hybrid and only reappears later. Written with a small letter, e.g. t for dwarf." },
    { term: 'homozygous', definition: "Having two identical alleles for a character, e.g. TT (pure tall) or tt (pure dwarf). True-breeding plants are homozygous." },
    { term: 'heterozygous', definition: "Having two different alleles for a character, e.g. Tt. A heterozygote carries the recessive allele hidden but shows the dominant trait." },
    { term: 'genotype', definition: "The actual allele make-up of a plant — the letters, like TT, Tt or tt. It is what the plant carries, not necessarily what you can see." },
    { term: 'phenotype', definition: "The visible, describable trait of a plant — like 'tall' or 'dwarf'. Two different genotypes (TT and Tt) can share one phenotype (tall)." },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A quiet monastery garden at dusk, rows of climbing pea plants heavy with pods, a wooden notebook and quill resting on a low stone wall',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A peaceful nineteenth-century monastery kitchen garden at dusk: neat rows of climbing garden pea plants on wooden supports, heavy with green pods and small violet and white flowers, each row lit by its own soft pool of warm evening light against one shared naturalistic dark background (#0a0a0a base tones). In the near foreground, resting on a low weathered stone wall, an open leather-bound notebook with faint rows of tally marks and a quill pen — hinting at careful counting, never spelled out. Painterly, atmospheric, contemplative mood, no text, no labels, no diagram elements, no people.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Man Who Counted His Way to a Law',
      markdown: "For seven straight years (**1856–1863**) Gregor Mendel crossed pea plants in a monastery garden and did something almost nobody in biology did back then — he **counted**. Not a handful of plants, but huge numbers of them, generation after generation. That habit of using **statistics and mathematical logic** on a living problem is exactly why his results held up. A big sample size gave his numbers weight, and checking the same pattern across successive generations proved he'd found **general rules of inheritance**, not lucky one-off observations. He was so far ahead of his time that the world ignored his work for about 35 years.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "People had always noticed that children resemble their parents, but until the mid-nineteenth century nobody had a clean scientific handle on *how* that resemblance is passed down. **Gregor Mendel** changed that. He ran **hybridisation experiments** on the garden pea and, from the patterns he saw, proposed the **laws of inheritance in living organisms**.\n\nHis key move was to study characters that came in two clearly opposing versions — **tall or dwarf** plants, **yellow or green** seeds — with nothing in between to blur the picture. Working with sharp either/or traits let him build a simple framework of rules that later scientists expanded to explain the messier, more varied inheritance seen in nature.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Why the Garden Pea Was a Smart Choice',
      objective: 'By the end of this you can explain what a true-breeding line is and why the pea plant made Mendel\'s counting experiments possible in the first place.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Mendel didn't pick *Pisum sativum*, the garden pea, by accident. He needed plants he could trust to behave the same way every time, and pea gave him that.\n\nHe started from **true-breeding lines**. A **true-breeding line** is one that, after **continuous self-pollination**, shows **stable trait inheritance** for several generations — a true-breeding tall line throws only tall offspring, a true-breeding dwarf line only dwarf ones. Mendel selected **14 true-breeding pea varieties**, arranged as **pairs that were alike in every way except for one character** with two contrasting traits.\n\nThe pea also let him control the mating. Pea flowers normally **self-pollinate**, which is what kept his lines pure. But to deliberately cross two different lines, Mendel performed **artificial pollination (cross-pollination)** — moving pollen from one plant onto another by hand, so he decided exactly which plant fathered which. Clear-cut traits, pure parent lines, and full control over crossing — that combination is what made counting the offspring meaningful.\n\nAcross his true-breeding lines Mendel studied **seven pairs of contrasting traits**, listed below.",
    },
    {
      id: uuid(), type: 'table', order: 5,
      caption: '📸 Table 4.1 — The seven pairs of contrasting traits Mendel studied in pea. The "dominant" trait is the one that shows up in the F1 hybrid. NCERT confirms this directly for stem height (tall), flower colour (violet), seed shape (round) and seed colour (yellow); for the other three it is the trait listed first in NCERT\'s own trait pair.',
      headers: ['Character', 'Contrasting traits', 'Dominant trait (seen in F1)'],
      rows: [
        ['Stem height', 'Tall / dwarf', 'Tall'],
        ['Flower colour', 'Violet / white', 'Violet'],
        ['Flower position', 'Axial / terminal', 'Axial'],
        ['Pod shape', 'Inflated / constricted', 'Inflated'],
        ['Pod colour', 'Green / yellow', 'Green'],
        ['Seed shape', 'Round / wrinkled', 'Round'],
        ['Seed colour', 'Yellow / green', 'Yellow'],
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "Mendel deliberately began every experiment with true-breeding lines rather than just grabbing any tall pea plant from the garden. What did starting with true-breeding parents guarantee him that a random tall plant could not?",
      options: [
        "That the parent plants would be heterozygous, giving a mix of gametes",
        "That each parent carried a known, pure, stable version of the trait, so any change in the offspring came from the cross itself, not from a hidden mixed parent",
        "That the plants would blend their traits smoothly in the next generation",
        "That the flowers would cross-pollinate on their own without his help",
      ],
      reveal: "A **true-breeding** line has bred true through continuous self-pollination, so its trait is **stable and pure** — the parent is homozygous and its offspring always match it. That gave Mendel a fixed, trustworthy starting point: whatever new pattern appeared after a cross had to come from combining the two lines, not from a parent that was secretly carrying a hidden allele. Option A is the opposite — true-breeding means homozygous, not heterozygous. And Mendel's whole point was that the traits did **not** blend (ruling out option C), while pea flowers self-pollinate rather than cross-pollinate on their own, which is why he had to hand-pollinate (ruling out option D).",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'The Words Geneticists Live By',
      objective: 'By the end of this you can correctly use factor, allele, dominant, recessive, homozygous, heterozygous, genotype and phenotype — the vocabulary every genetics question is built on.',
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "From his results Mendel reasoned that something was being passed down **unchanged**, from parent to offspring through the gametes, over many generations. He called these things **'factors'** — today we call them **genes**, the **units of inheritance** that carry the information to express a trait.\n\nGenes that code for a **pair of contrasting traits** are called **alleles** — slightly different forms of the same gene. Mendel's lettering rule is the one you'll use for the rest of this chapter: the **capital letter** stands for the trait that shows up in the F1 (for height, **T** for Tall), and the **small letter** for the other trait (**t** for dwarf). So the height alleles pair up as **TT, Tt or tt**.\n\nNow the four terms NEET tests constantly:\n\n- When the two alleles are **identical** — **TT** or **tt** — the plant is **homozygous**. A true-breeding tall or dwarf plant is homozygous.\n- When the two alleles are **different** — **Tt** — the plant is **heterozygous**.\n- The **genotype** is the allele make-up itself — TT, Tt or tt — what the plant actually *carries*.\n- The **phenotype** is the **visible, descriptive trait** — 'tall' or 'dwarf' — what you can actually *see*.\n\nHere's the twist that makes the whole thing interesting: Mendel found the **Tt** plant looked **exactly like the TT** plant — both are tall. So in a mismatched pair of factors, **one dominates the other**. The one that shows is the **dominant** factor (T, tall); the one that hides is the **recessive** factor (t, dwarf). That's why a plant's phenotype can't always tell you its genotype — a tall plant might be **TT or Tt**, and you can't tell just by looking.",
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'Nail the Vocabulary Now',
      markdown: "These words come back on every single genetics page — lock them in:\n\n- **Genotype = the letters you carry** (TT, Tt, tt). **Phenotype = the look you show** (tall, dwarf).\n- **Homozygous = same pair** (TT or tt). **Heterozygous = different pair** (Tt).\n- **Dominant = the trait seen in F1**, written **CAPITAL** (T). **Recessive = the trait hidden in F1**, written **small** (t).\n- **Alleles** are the two forms of one gene; **true-breeding** plants are always **homozygous**.\n- **Warning:** always use the **same letter** in two cases (T and t) for one character. Never write 'T for tall, d for dwarf' — you'll lose track of which letters are alleles of the same gene.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The seven-year window:** Mendel worked on garden pea from **1856 to 1863** and proposed his laws — the years and the plant (*Pisum sativum*) are direct one-mark lifts.\n\n**Why pea:** true-breeding lines + clear contrasting traits + control by artificial cross-pollination. NEET loves 'which feature made pea suitable for Mendel's work?' with a tempting wrong option like 'blending inheritance'.\n\n**14 and 7:** Mendel selected **14 true-breeding varieties** (7 contrasting pairs). Don't swap these numbers.\n\n**Genotype vs phenotype trap:** a tall plant can be **TT or Tt** — phenotype does not reveal genotype. This single idea powers the test cross later in the chapter.\n\n**Classic NEET question:** \"A true-breeding plant is one that — \" → *has undergone continuous self-pollination and shows stable trait inheritance over several generations (i.e. is homozygous).*",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "So Mendel gave us both a method — pure lines, clear traits, careful counting — and a vocabulary — factor, allele, dominant, recessive, homozygous, heterozygous, genotype, phenotype. With those words in hand, the next question is the obvious one: what actually happens when you cross a true-breeding tall plant with a true-breeding dwarf? That single cross — the inheritance of one gene — is where we go next.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'Which set of features best explains why the garden pea was well suited to Mendel\'s hybridisation experiments?',
          options: [
            'It offered true-breeding lines with clear-cut contrasting traits and could be artificially cross-pollinated',
            'It blended parental traits smoothly, making ratios easy to read',
            'Its flowers naturally cross-pollinated, so no pure lines were ever needed',
            'It produced only a few offspring per plant, keeping the counting simple',
          ],
          correct_index: 0,
          explanation: 'Pea gave Mendel pure true-breeding lines, traits that came in sharp either/or forms, and flowers he could hand-pollinate to control the cross. It did NOT blend traits (that is the very idea his results overturned), its flowers self-pollinate rather than cross-pollinate on their own, and large — not small — sample sizes were what gave his data its strength.',
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'A true-breeding pea line is best described as one that —',
          options: [
            'is heterozygous and produces two kinds of offspring',
            'always results from crossing two different varieties',
            'has undergone continuous self-pollination and shows stable trait inheritance over several generations',
            'changes its trait every generation to adapt',
          ],
          correct_index: 2,
          explanation: 'NCERT defines a true-breeding line as one that, after continuous self-pollination, shows stable trait inheritance and expression for several generations — meaning it is homozygous. It is therefore NOT heterozygous, is not the product of crossing two varieties (it is kept pure by selfing), and its trait stays stable rather than changing each generation.',
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'A tall pea plant with the genotype Tt is best described using which pair of terms?',
          options: [
            'Homozygous genotype, dwarf phenotype',
            'Homozygous genotype, tall phenotype',
            'Heterozygous genotype, dwarf phenotype',
            'Heterozygous genotype, tall phenotype',
          ],
          correct_index: 3,
          explanation: 'Tt carries two different alleles, so the genotype is heterozygous; because T (tall) is dominant over t (dwarf), the visible phenotype is tall. It is not homozygous (that needs an identical pair like TT or tt), and it cannot look dwarf, since the recessive dwarf trait stays hidden whenever the dominant T is present.',
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'How many true-breeding pea varieties did Mendel select, and how did they relate to the seven contrasting characters?',
          options: [
            'Seven varieties, one for each character',
            'Fourteen varieties, arranged as seven pairs each differing in a single character',
            'Seven varieties, each true-breeding for all seven traits together',
            'Fourteen varieties, each differing in all seven characters at once',
          ],
          correct_index: 1,
          explanation: 'Mendel selected 14 true-breeding varieties set up as pairs that were alike except for one character with contrasting traits — 7 pairs, one pair per character. Seven varieties would give only half of each pair, and a single variety differing in all seven characters at once would defeat the whole point of isolating one character at a time.',
          difficulty_level: 3,
        },
      ],
    },
  ],
};
