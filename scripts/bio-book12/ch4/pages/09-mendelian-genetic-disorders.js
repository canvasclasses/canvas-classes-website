'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'pedigree-analysis-and-mendelian-disorders',
  title: 'Reading Family Trees — Mendelian Genetic Disorders',
  subtitle: "You can't cross-breed humans in a lab, so geneticists read the family tree instead — and use it to track five single-gene disorders NEET asks about every year.",
  page_number: 9,
  page_type: 'lesson',
  tags: ['pedigree-analysis', 'mendelian-disorders', 'sex-linked-inheritance', 'sickle-cell-anaemia', 'principles-of-inheritance'],
  glossary: [
    { term: 'pedigree analysis', definition: 'The study of how a trait is inherited by tracing it through several generations of a family, drawn out as a family tree.' },
    { term: 'Mendelian disorder', definition: 'A disorder caused by alteration or mutation in a single gene, inherited in the same patterns Mendel described.' },
    { term: 'carrier', definition: 'A person who carries one copy of a recessive disease gene but does not show the disease, because their matching normal gene masks it. They can still pass the gene on.' },
    { term: 'sex-linked (X-linked) recessive', definition: 'An inheritance pattern where the faulty recessive gene sits on the X chromosome — so it shows up far more often in males, who have only one X.' },
    { term: 'autosomal recessive', definition: 'An inheritance pattern where the faulty recessive gene sits on a normal (non-sex) chromosome, so both parents must pass on a copy for the disease to appear.' },
    { term: 'globin chain', definition: 'One of the protein chains (α or β) that make up the haemoglobin molecule in red blood cells.' },
    { term: 'HbS', definition: 'The mutant allele of haemoglobin behind sickle-cell anaemia; a person who is HbS HbS shows the disease.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dim study desk with an old hand-drawn family tree of squares and circles connected by lines, some symbols shaded solid',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A dimly lit antique study desk seen from above at dusk, an old sheet of parchment spread across it bearing a hand-inked human family tree — rows of small squares and circles joined by fine horizontal and vertical lines, a few of the squares and circles filled solid black to mark affected members. A brass magnifying glass and an old fountain pen rest beside it, warm lamplight pooling on the paper. Painterly, atmospheric, scholarly mood, deep shadows, dark overall background (#0a0a0a base tones). No readable text, no labels, no modern diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Royal Disease',
      markdown: "**Queen Victoria** of England carried the gene for **haemophilia** without ever being ill herself — she was a carrier. Through her daughters, who married into the royal houses of Europe, she passed the faulty gene into the royal families of Spain, Germany and Russia. So many of her male descendants bled uncontrollably that haemophilia earned the nickname *the royal disease*. Her family pedigree became one of the most famous family trees in all of genetics.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "With pea plants, Mendel could set up any cross he liked and count the offspring. You **cannot do that with people** — you can't order two humans to marry so you can study their children. So human geneticists use the next best thing: they look **backward** at a family that already exists.\n\nThey trace a particular trait — an abnormality or a disease — through **several generations of a family** and draw it out as a family tree. This is called **pedigree analysis**. It's a genuinely powerful tool: from the pattern alone you can work out whether a trait is **dominant or recessive**, and whether it's **linked to a sex chromosome** or sits on an ordinary one. Every feature in an organism is controlled by a gene on the DNA, and DNA is normally passed on unchanged from one generation to the next. But occasionally the genetic material **changes — a mutation** — and many human disorders trace back to inheriting such an altered gene.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Symbols of a Pedigree',
      objective: "By the end of this you can read any pedigree chart on sight — telling an affected male from a carrier female, and a mating line from a line of offspring.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 4, src: '',
      alt: 'A key of standard human pedigree symbols — squares for males, circles for females, filled shapes for affected individuals, and connecting lines for matings and offspring',
      caption: '📸 Tap each symbol to learn what it means in a family tree (Figure 4.13)',
      hotspots: [
        { id: uuid(), x: 0.18, y: 0.28, label: 'Unaffected male', icon: 'circle',
          detail: 'An **empty square** always means a **male**. Empty (unshaded) means he does **not** show the trait being studied.' },
        { id: uuid(), x: 0.18, y: 0.66, label: 'Unaffected female', icon: 'circle',
          detail: 'An **empty circle** always means a **female**. Empty means she does not show the trait. Sex is fixed by the shape — square is male, circle is female — throughout every pedigree.' },
        { id: uuid(), x: 0.45, y: 0.28, label: 'Affected male', icon: 'circle',
          detail: 'A **filled (shaded) square** — a male who **shows the disorder**. Shading is the key signal: any solid symbol is an affected individual.' },
        { id: uuid(), x: 0.45, y: 0.66, label: 'Affected female', icon: 'circle',
          detail: 'A **filled (shaded) circle** — a female who **shows the disorder**.' },
        { id: uuid(), x: 0.68, y: 0.66, label: 'Carrier female', icon: 'circle',
          detail: 'A **half-shaded circle** marks a **carrier** — she holds one copy of a recessive disease gene but stays healthy, because her matching normal gene masks it. She can still pass the gene to her children. Carriers are how a recessive disorder travels silently through a family.' },
        { id: uuid(), x: 0.72, y: 0.30, label: 'Mating line', icon: 'circle',
          detail: 'A **horizontal line joining a square and a circle** shows a **mating** — the two parents. The children of this couple hang below it.' },
        { id: uuid(), x: 0.86, y: 0.62, label: 'Line of offspring', icon: 'circle',
          detail: 'A **vertical line dropping from the mating line to a horizontal sibship line** connects the couple to their **offspring**. Reading these lines down the page is how you follow a trait from parents to children across generations.' },
      ],
      generation_prompt: "Scientific textbook illustration of a human pedigree symbol key. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines. Show, arranged clearly across the frame: an empty white square (unaffected male, upper left); an empty white circle (unaffected female, lower left); a solid-filled square (affected male, upper middle); a solid-filled circle (affected female, lower middle); a circle with only its lower half shaded (carrier female, lower right); a short horizontal white line joining a square to a circle representing a mating (upper right); and a vertical line dropping from that mating line to a horizontal sibship line with two small symbols hanging below it representing offspring (right). Thin white leader spaces left blank near each symbol, no baked-in text labels. Biologically standard genetics conventions, no photorealism, no cartoon, no mascots.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Five Single-Gene Disorders',
      objective: "By the end of this you can sort each of the five NCERT disorders into sex-linked or autosomal recessive, and state the exact defect behind each one.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "**Mendelian disorders** are caused by a change in a **single gene**, and they pass down the same way any Mendelian trait does. NCERT wants you solid on five of them — and the first thing to fix is *where the faulty gene sits*, because that decides who gets the disease.\n\nTwo of them are **sex-linked recessive** — the gene is on the **X chromosome**. Because a male has only one X, a single faulty copy is enough to make him ill; a female, with two X chromosomes, would need the fault on both. That's why these two — **haemophilia** and **colour blindness** — strike **males far more often** and typically travel from an unaffected **carrier mother** to her sons.\n\nThe other three are **autosomal recessive** — the gene sits on an ordinary chromosome, so it has nothing to do with sex. For these — **sickle-cell anaemia, thalassemia and phenylketonuria** — a child only gets the disease when **both parents are carriers** and each passes on the faulty copy.",
    },
    {
      id: uuid(), type: 'table', order: 7,
      caption: 'The five Mendelian disorders — inheritance pattern and the exact defect (NCERT §4.8.2)',
      headers: ['Disorder', 'Inheritance pattern', 'The defect'],
      rows: [
        ['Haemophilia', 'Sex-linked (X-linked) recessive', 'One protein in the blood-clotting cascade is affected, so a simple cut bleeds non-stop. Passes from carrier mother to some sons.'],
        ['Colour blindness', 'Sex-linked (X-linked) recessive', 'A faulty gene on the X affects the red or green cone of the eye — red and green can\'t be told apart. Seen in ~8% of males but only ~0.4% of females.'],
        ['Sickle-cell anaemia', 'Autosomal recessive (HbS)', 'Glutamic acid (Glu) is replaced by Valine (Val) at the 6th position of the β-globin chain — from a single base change GAG→GUG. Only HbS HbS individuals are diseased; RBCs sickle under low oxygen.'],
        ['Thalassemia', 'Autosomal recessive', 'Mutation or deletion reduces the rate of synthesis of a globin chain — α or β. Too few globin molecules are made, causing anaemia. A quantitative problem.'],
        ['Phenylketonuria', 'Autosomal recessive', 'The enzyme that converts phenylalanine into tyrosine is missing. Phenylalanine piles up, is turned into phenylpyruvic acid, and its build-up in the brain causes mental retardation.'],
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "Colour blindness shows up in about 8% of males but only about 0.4% of females. Why is it so much more common in men?",
      options: [
        "The colour-blindness gene is on the Y chromosome, which only males carry",
        "The recessive gene is on the X chromosome; a male has just one X, so a single faulty copy already shows the trait, while a female would need the fault on both of her X chromosomes",
        "Male cone cells are naturally weaker than female cone cells for hormonal reasons",
        "Females never carry the gene, so the disorder can only ever appear in males",
      ],
      reveal: "The gene is on the X chromosome and is recessive. A male has only one X, so one faulty copy is enough — there's no second X with a normal gene to mask it. A female has two X chromosomes, so she'd need the faulty gene on both to be colour-blind, which is far rarer. Option 1 is the classic trap: sex-linked here means X-linked, not Y-linked. And option 4 is wrong because females very much do carry the gene silently — a carrier mother is exactly how it reaches her sons.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: "Lock These In",
      markdown: "- **Sex-linked (X-linked) recessive:** **haemophilia** and **colour blindness** → hit **males** far more; travel from **carrier mother → sons**.\n- **Autosomal recessive:** **sickle-cell anaemia, thalassemia, phenylketonuria** → need **both parents to be carriers**.\n- **Sickle-cell** = **Glu → Val at the 6th position of the β-globin chain** (base change **GAG → GUG**); only **HbS HbS** is diseased, HbA HbS is a healthy carrier.\n- **Thalassemia vs sickle-cell:** thalassemia = **too few** globin molecules (*quantitative*); sickle-cell = an **incorrectly functioning** globin (*qualitative*).\n- **Phenylketonuria:** missing enzyme, **phenylalanine → tyrosine** step fails.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The pattern is the trap.** NEET loves to swap inheritance patterns: \"sickle-cell anaemia is sex-linked\" or \"haemophilia is autosomal\" are the usual wrong options. Keep the split clean — only **haemophilia and colour blindness** are X-linked; the rest are autosomal recessive.\n\n**Sickle-cell numbers must be exact:** **Glu → Val**, **6th position**, **β-globin**, **GAG → GUG**. Reversing it to \"Val → Glu\" or shifting it to the α-chain is the standard distractor.\n\n**Thalassemia ≠ sickle-cell:** quantitative (too few globins) vs qualitative (wrong globin). This one-line difference is a repeat NEET favourite.\n\n**Classic NEET question:** \"Which of these is an autosomal recessive disorder — haemophilia, colour blindness, or phenylketonuria?\" → **phenylketonuria** (the other two are X-linked recessive).",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "That's the single-gene story — five disorders, each traced through a family tree and pinned to one faulty gene. But not every genetic disorder comes from a single gene. Some come from whole chromosomes going missing or turning up in extra copies, and those **chromosomal disorders** are where we head next.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which pair of disorders is inherited as sex-linked (X-linked) recessive traits?',
          options: [
            'Haemophilia and colour blindness',
            'Sickle-cell anaemia and thalassemia',
            'Phenylketonuria and haemophilia',
            'Colour blindness and sickle-cell anaemia',
          ],
          correct_index: 0,
          explanation: "Only haemophilia and colour blindness sit on the X chromosome, which is why both strike males far more often. Sickle-cell anaemia, thalassemia and phenylketonuria are all autosomal recessive, so any option pairing one of them with an X-linked disorder is mixing the two categories — exactly the swap the question is testing.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'What is the precise molecular defect in sickle-cell anaemia?',
          options: [
            'Valine is replaced by glutamic acid at the 6th position of the α-globin chain',
            'Glutamic acid is replaced by valine at the 6th position of the β-globin chain',
            'The enzyme that converts phenylalanine to tyrosine is missing',
            'The rate of synthesis of the β-globin chain is sharply reduced',
          ],
          correct_index: 1,
          explanation: "Sickle-cell anaemia comes from Glu → Val at the 6th position of the β-globin chain (base change GAG → GUG). Option 1 reverses the substitution and puts it on the wrong chain. Option 3 describes phenylketonuria, and option 4 describes thalassemia — both are the tempting near-misses, because all three are autosomal recessive blood/metabolic disorders.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'How does thalassemia differ from sickle-cell anaemia?',
          options: [
            'Thalassemia is a qualitative problem, sickle-cell is a quantitative one',
            'Both are sex-linked recessive disorders carried on the X chromosome',
            'Thalassemia makes too few globin molecules (quantitative), while sickle-cell makes an incorrectly functioning globin (qualitative)',
            'Thalassemia is dominant while sickle-cell is recessive',
          ],
          correct_index: 2,
          explanation: "NCERT draws the line exactly here: thalassemia is quantitative — too few globin chains are made — while sickle-cell is qualitative, making a wrongly-built globin. Option 1 flips the two labels, option 2 is false because both are autosomal recessive (not X-linked), and option 4 invents a dominance difference that doesn't exist — both are recessive.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: 'A child is born unable to convert phenylalanine into tyrosine, so phenylalanine builds up and damages the brain. Which disorder is this, and how is it inherited?',
          options: [
            'Phenylketonuria — an autosomal recessive disorder',
            'Colour blindness — a sex-linked recessive disorder',
            'Haemophilia — a sex-linked recessive disorder',
            'Sickle-cell anaemia — an autosomal recessive disorder',
          ],
          correct_index: 0,
          explanation: "The missing enzyme for the phenylalanine-to-tyrosine step is the signature of phenylketonuria, an inborn error of metabolism inherited as autosomal recessive. Sickle-cell anaemia is also autosomal recessive but its defect is a globin substitution, not a missing enzyme; colour blindness and haemophilia are X-linked, so their inheritance pattern is wrong for this case.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
