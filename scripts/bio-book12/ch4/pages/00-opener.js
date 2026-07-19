'use strict';
/**
 * Class 12 Biology — Chapter 4 (Principles of Inheritance and Variation)
 * Page 0 — chapter opener.
 *
 * Faithful to NCERT Class 12 chapter text (lebo104.txt). Rule 0: every fact,
 * name and number below is traceable to that chapter — the elephant/mango/
 * siblings hook, the definitions of inheritance/heredity and variation, the
 * 8000–1000 B.C. selective-breeding history + Sahiwal cows, and the section
 * list (4.1–4.8). No inline_quiz on the opener by design.
 */

module.exports = {
  slug: 'chapter-4-overview',
  title: 'Principles of Inheritance and Variation',
  page_number: 0,
  page_type: 'chapter_opener',
  subtitle:
    "An elephant only ever gives birth to an elephant — yet no two calves are quite the same. This chapter is the science of both halves of that sentence: how characters are handed down unchanged, and how offspring still end up different.",
  tags: ['principles-of-inheritance-and-variation', 'genetics', 'heredity', 'variation'],
  glossary: [
    {
      term: 'heredity',
      definition:
        'The passing on of characters from parents to offspring. Inheritance — the process that transfers these characters from parent to progeny — is the basis of heredity.',
    },
    {
      term: 'variation',
      definition: 'The degree by which progeny differ from their parents.',
    },
    {
      term: 'allele',
      definition:
        'One of the slightly different forms of the same gene. Genes that code for a pair of contrasting traits (like tall and dwarf) are alleles of each other.',
    },
    {
      term: 'genotype',
      definition:
        "The genetic make-up of an organism — the actual pair of alleles it carries (such as TT, Tt or tt) — as opposed to the phenotype, which is the trait you can see.",
    },
  ],
  blocks: [
    {
      id: '7f3a1c92-4e8b-4d21-9a6f-1b2c3d4e5f60',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A dusk savanna where an adult elephant walks with two calves that resemble her yet differ subtly from each other',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        "Ultra-wide cinematic banner (16:5 ratio). A quiet dusk savanna scene: a single large adult elephant walking slowly across the frame with two young calves close beside her, all three seen mostly in soft silhouette against a warm amber horizon glow. The calves clearly share the parent's shape and form — unmistakably her offspring — yet are subtly different from each other in size and posture, one a little taller and one stockier, hinting at family resemblance alongside quiet variation. Faint silhouettes of a few other animals of the same herd rest in the far distance, not the focal subject. Deep dusk lighting throughout, a single warm light source low on the horizon tying the family group together. Painterly, atmospheric illustration style, dark background tones overall (#0a0a0a base), no text, no labels, no diagram elements.",
    },
    {
      id: '2b9e4f18-6c3a-4b7d-8e9f-0a1b2c3d4e5f',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'The Two Questions Behind This Whole Chapter',
      markdown:
        "Why does an elephant always give birth to a baby elephant and never some other animal? Why does a mango seed grow only into a mango plant, never anything else? Now look at the other side of it: siblings from the very same parents can look strikingly alike — and, just as often, strikingly different. Both of these everyday facts are true at the same time, and both need explaining. The branch of biology that tackles them is **Genetics**, and this chapter is where it begins.",
    },
    {
      id: 'c4d5e6f7-8a9b-4c1d-9e2f-3a4b5c6d7e8f',
      type: 'text',
      order: 2,
      markdown:
        "Genetics deals with two things at once: the **inheritance** of characters from parents to offspring, and the **variation** between them. These are not the same idea. **Inheritance** is the process by which characters are passed on from parent to progeny — it is the very basis of **heredity**, the reason offspring resemble their parents at all. **Variation** is the degree by which progeny differ from their parents. A calf resembling its mother is inheritance at work; that same calf being a little different from its sibling is variation. Every question in this chapter sits somewhere between these two forces.",
    },
    {
      id: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
      type: 'heading',
      order: 3,
      level: 2,
      text: 'People Used Heredity Long Before They Could Explain It',
      objective:
        'By the end of this you can say what farmers 10,000 years ago already knew — and the one thing they were still completely missing.',
    },
    {
      id: '9f8e7d6c-5b4a-4938-a827-16f5e4d3c2b1',
      type: 'text',
      order: 4,
      markdown:
        "Humans have known since as far back as **8000–1000 B.C.** that one cause of variation is hidden inside sexual reproduction. Even without any theory, farmers put this to use: they picked out the naturally varying plants and animals in wild populations and bred, again and again, only the ones with the characters they wanted. This is **artificial selection**, and it is how, over generations, wild cattle were domesticated into well-known Indian breeds such as the **Sahiwal cows of Punjab**.\n\nSo people were already using inheritance and variation thousands of years ago. What they did not have was the *why*. They could breed for a trait, but they had no scientific idea of how characters actually travel from one generation to the next. Filling in that missing explanation — turning a farmer's instinct into a set of rules — is exactly what the rest of this chapter does.",
    },
    {
      id: '3e4f5a6b-7c8d-49e0-8f1a-2b3c4d5e6f70',
      type: 'callout',
      order: 5,
      variant: 'remember',
      title: 'Your Map Through This Chapter',
      markdown:
        "Each section builds on the one before it — read them in order:\n\n1. **Mendel's Laws of Inheritance** — how a monk with pea plants first cracked the rules.\n2. **Inheritance of One Gene** — dominance, recessiveness, and the classic 3:1 ratio (plus incomplete dominance and co-dominance).\n3. **Inheritance of Two Genes** — tracking two characters at once, the 9:3:3:1 ratio, and the chromosomal theory of inheritance.\n4. **Linkage and Recombination** — what happens when two genes ride on the same chromosome.\n5. **Sex Determination** — how XX/XY, XO, ZW and even honey-bee chromosome sets decide sex.\n6. **Mutation** — how the genetic material itself changes.\n7. **Genetic Disorders** — pedigree analysis, plus Mendelian and chromosomal disorders in humans.",
    },
    {
      id: '6d5c4b3a-2918-4706-95e4-3d2c1b0a9f8e',
      type: 'text',
      order: 6,
      markdown:
        "It all starts in a monastery garden in the mid-1800s, with one man, seven pairs of contrasting pea traits, and seven patient years of counting. Turn the page and meet Gregor Mendel.",
    },
  ],
};
