// Practice — NCERT Exercises · Class 12 Biology · Chapter 4
// Principles of Inheritance and Variation
// All 16 NCERT textbook exercises, regrouped into 5 revision themes.

module.exports = {
  slug: 'ch4-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle:
    'All 16 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    // ── block 0 — hero image ──────────────────────────────────────────────
    {
      id: '622649c1-f56d-43d2-9b54-06ddd1c98e53',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A garden-pea plant with a Punnett square and inheritance charts laid out around it',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'Hand-drawn coloured illustration on a deep charcoal dark background, muted earthy palette (dusty green, ochre, faded terracotta, soft cream), no glow, no neon, no orange, no 3D. A wide classroom-style genetics study spread: a garden-pea plant with tall and dwarf forms and yellow and green seeds on the left; in the centre a clean 2x2 Punnett square with letter alleles (T, t) sketched by hand; on the right a small human family pedigree chart with circles and squares connected by lines, and a tiny pair of X and Y chromosomes. Everything drawn as if by a patient teacher on dark paper with coloured pencils, calm and textbook-like, landscape orientation, plenty of breathing space.',
    },

    // ── block 1 — intro text ──────────────────────────────────────────────
    {
      id: 'ae344c34-a0a4-462c-87a6-1c92802a7c1a',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are **all 16 NCERT exercises** for *Principles of Inheritance and Variation*, regrouped out of the textbook's running order into five revision themes so related ideas sit together.\n\nThis chapter is where Biology asks you to *calculate*, not just recall. Several questions are genuine crosses — gamete counts, Punnett squares, blood-group genetics, phenotype proportions. For every one of those the solution shows the **full working**: the gametes, the cross, the ratio, and the final answer. Read the reasoning even when you got the answer right — that is where the marks live.",
    },

    // ── block 2 — practice_bank ───────────────────────────────────────────
    {
      id: '33f64a11-22ee-4247-beba-5efa38f1e295',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 4.1–4.16',
      intro:
        'Every textbook exercise, once each, with a full worked solution. Try each on paper first, then check the working.',
      sections: [
        // ─────────────────────────────────────────────────────────────────
        {
          id: 'e112d227-0608-4f09-95e1-17452ddd5958',
          title: "Mendel's foundations & terminology",
          blurb:
            'Why peas, the words you must define, and the law of dominance shown through a monohybrid cross.',
          items: [
            {
              kind: 'numerical',
              id: '84384f29-cd92-4eb9-9847-046dc5396a67',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.1',
              prompt:
                'Mention the advantages of selecting pea plant for experiment by Mendel.',
              answer:
                'Clear contrasting traits, self-pollinating yet easy to cross, short life cycle, many seeds.',
              solution:
                "Mendel picked *Pisum sativum* (garden pea) because it made clean, repeatable results possible:\n\n- **Clear contrasting characters.** The pea shows several characters, each in two sharply different forms (tall vs dwarf, round vs wrinkled seed, yellow vs green seed, and so on). There is no in-between form to confuse the counting.\n- **Normally self-pollinating.** The flowers are bisexual and fertilise themselves, so a plant stays **pure-breeding** (true-breeding) generation after generation. Mendel could start from pure lines.\n- **Easy to cross artificially.** When he wanted a cross, he could remove the anthers (emasculation) and dust pollen from another plant by hand. So he had full control over which plant was the parent.\n- **Short life cycle.** Peas are annuals, so many generations could be raised in a short time.\n- **Many offspring.** Each cross gives a large number of seeds, and large numbers make the ratios (like 3:1) show up reliably.\n- **Fertile hybrids.** The hybrids were fully fertile, so the F1 could be selfed to raise the F2.",
            },
            {
              kind: 'numerical',
              id: '6b1bfb93-4d76-4f4c-b651-a57c91eccea9',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.2',
              prompt:
                'Differentiate between the following –\n(a) Dominance and Recessive\n(b) Homozygous and Heterozygous\n(c) Monohybrid and Dihybrid.',
              answer:
                'Dominant expresses over recessive; homozygous has identical alleles, heterozygous two different; monohybrid tracks one trait pair, dihybrid two.',
              solution:
                '**(a) Dominance vs Recessive**\n\n| Dominant | Recessive |\n|---|---|\n| Allele that shows its effect even when only one copy is present | Allele whose effect is hidden when a dominant allele is present |\n| Expressed in the heterozygote (e.g. `Tt` is tall) | Expressed only in the homozygote (e.g. `tt` is dwarf) |\n| Usually makes a functional product (enzyme) | Often makes a non-functional or no product |\n\n**(b) Homozygous vs Heterozygous**\n\n| Homozygous | Heterozygous |\n|---|---|\n| Both alleles of a gene are identical (`TT` or `tt`) | The two alleles are different (`Tt`) |\n| Breeds true — offspring like the parent | Does not breed true — offspring segregate |\n| Produces only one kind of gamete for that gene | Produces two kinds of gamete for that gene |\n\n**(c) Monohybrid vs Dihybrid**\n\n| Monohybrid cross | Dihybrid cross |\n|---|---|\n| Follows **one** pair of contrasting characters | Follows **two** pairs of characters together |\n| Parents differ in a single gene (e.g. `TT` × `tt`) | Parents differ in two genes (e.g. `RRYY` × `rryy`) |\n| F2 phenotypic ratio **3 : 1** | F2 phenotypic ratio **9 : 3 : 3 : 1** |',
            },
            {
              kind: 'numerical',
              id: 'f671ede8-b7ec-41e1-8df1-499cbb94ae89',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.4',
              prompt: 'Explain the Law of Dominance using a monohybrid cross.',
              answer:
                'In `Tt`, T masks t, so F1 is all tall; F2 gives 3 tall : 1 dwarf and the recessive reappears.',
              solution:
                'Take one pair of contrasting characters — a pure tall pea `TT` crossed with a pure dwarf pea `tt`.\n\n**Parents:** `TT` (tall) × `tt` (dwarf)\n**Gametes:** `T` and `t`\n**F1:** all `Tt` — and every F1 plant is **tall**, none is dwarf or medium.\n\nNow self the F1: `Tt` × `Tt`.\n\n|  | **T** | **t** |\n|---|---|---|\n| **T** | TT | Tt |\n| **t** | Tt | tt |\n\n**F2 genotype:** 1 `TT` : 2 `Tt` : 1 `tt`\n**F2 phenotype:** **3 tall : 1 dwarf**\n\nThe **Law of Dominance** reads this off the result:\n\n1. Characters are controlled by discrete units called factors (alleles), which occur in pairs.\n2. When the pair is dissimilar (`Tt`), one factor (the **dominant**, T) expresses itself and the other (the **recessive**, t) stays hidden.\n3. That is why the F1 is uniformly tall, and why the dwarf trait — not lost, only masked — reappears in the F2.',
            },
            {
              kind: 'numerical',
              id: '33b82c87-a705-4d19-87eb-378bc564ebbd',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.5',
              prompt: 'Define and design a test-cross.',
              answer:
                'Cross the dominant-looking organism with a homozygous recessive: all dominant offspring means it was homozygous; a 1:1 ratio means heterozygous.',
              solution:
                "**Definition.** A **test cross** is a cross of an individual showing the dominant trait (whose genotype is unknown — it could be `TT` or `Tt`) with a **homozygous recessive** individual (`tt`). It tells you the unknown genotype by looking at the offspring.\n\n**Design and how to read it.** Let the unknown tall plant be `T?` and cross it with `tt`.\n\n*Case 1 — the tall plant is homozygous `TT`:*\n\n`TT` × `tt` → all `Tt` → **all offspring tall**.\n\n*Case 2 — the tall plant is heterozygous `Tt`:*\n\n`Tt` × `tt` →\n\n|  | **t** | **t** |\n|---|---|---|\n| **T** | Tt | Tt |\n| **t** | tt | tt |\n\n→ `Tt` : `tt` = **1 tall : 1 dwarf**.\n\n**Conclusion:** if the offspring are *all* tall, the unknown parent was `TT`; if they come out in a **1 : 1** tall-to-dwarf ratio, it was `Tt`. The homozygous recessive parent contributes only `t`, so the offspring reveal exactly which gametes the unknown parent made.",
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────────
        {
          id: '92294529-6425-44d0-9611-25abc536becf',
          title: 'Gametes, Punnett squares & phenotype ratios',
          blurb:
            'The number crunching — counting gamete types and predicting offspring proportions.',
          items: [
            {
              kind: 'numerical',
              id: 'ccebff70-e3ee-48d1-99d6-4ced36296a62',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.3',
              prompt:
                'A diploid organism is heterozygous for 4 loci, how many types of gametes can be produced?',
              answer: '16 gamete types.',
              solution:
                'Each **heterozygous** locus (say `Aa`) can send either allele — `A` or `a` — into a gamete. So one heterozygous locus gives **2** kinds of gamete.\n\nThe loci assort independently, so multiply the choices:\n\nNumber of gamete types = **2ⁿ**, where *n* = number of heterozygous loci.\n\nHere *n* = 4, so:\n\n2⁴ = 2 × 2 × 2 × 2 = **16 types of gametes**.\n\n(As a check: `AaBbCcDd` produces combinations like `ABCD`, `ABCd`, `ABcD`, … all the way to `abcd` — sixteen in all.)',
            },
            {
              kind: 'numerical',
              id: 'fc9ced40-ed0c-42e5-ad76-fafc06df549e',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.6',
              prompt:
                'Using a Punnett Square, workout the distribution of phenotypic features in the first filial generation after a cross between a homozygous female and a heterozygous male for a single locus.',
              answer:
                'All F1 show the dominant trait (genotype 1 `TT` : 1 `Tt`) when the homozygous parent is dominant.',
              solution:
                "Take the single locus for height. The homozygous female is **`TT`** (tall) and the heterozygous male is **`Tt`** (tall).\n\n**Gametes:** female → `T`, `T`; male → `T`, `t`.\n\n|  | **T** (♀) | **T** (♀) |\n|---|---|---|\n| **T** (♂) | TT | TT |\n| **t** (♂) | Tt | Tt |\n\n**F1 genotype:** 2 `TT` : 2 `Tt` = **1 `TT` : 1 `Tt`**\n**F1 phenotype:** **all tall** (100% show the dominant trait).\n\nBecause one parent contributes only `T`, no offspring can be `tt`, so the recessive trait cannot appear in this generation.\n\n*Note:* if instead the homozygous parent were homozygous **recessive** (`tt`) × `Tt`, the cross would give `Tt` : `tt` = **1 tall : 1 dwarf**. The standard reading of this question takes the homozygous parent as dominant, giving the all-dominant result above.",
            },
            {
              kind: 'numerical',
              id: 'f3c816de-6ea0-428e-b863-be4a32e9d3c3',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.7',
              prompt:
                'When a cross in made between tall plant with yellow seeds (TtYy) and tall plant with green seed (Ttyy), what proportions of phenotype in the offspring could be expected to be\n(a) tall and green.\n(b) dwarf and green.',
              answer: '(a) tall and green = 3/8 · (b) dwarf and green = 1/8.',
              solution:
                'Handle the two genes **separately**, then multiply — the genes assort independently.\n\n**Height gene (`Tt` × `Tt`):**\n\n|  | **T** | **t** |\n|---|---|---|\n| **T** | TT | Tt |\n| **t** | Tt | tt |\n\n→ **3/4 tall, 1/4 dwarf**.\n\n**Seed-colour gene (`Yy` × `yy`):**\n\n|  | **Y** | **y** |\n|---|---|---|\n| **y** | Yy | yy |\n| **y** | Yy | yy |\n\n→ **1/2 yellow, 1/2 green**.\n\nNow combine by multiplying the two probabilities:\n\n**(a) Tall and green** = P(tall) × P(green) = 3/4 × 1/2 = **3/8**.\n\n**(b) Dwarf and green** = P(dwarf) × P(green) = 1/4 × 1/2 = **1/8**.',
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────────
        {
          id: '68b2abd2-f360-438d-b45e-acee501eb4de',
          title: 'Beyond simple dominance — and mutation',
          blurb:
            'Where one allele does not fully mask the other, and where a single DNA letter changes everything.',
          items: [
            {
              kind: 'numerical',
              id: 'a08243cf-bcf7-4e0b-83a0-4b5d44c1019a',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.13',
              prompt:
                'Explain the following terms with example\n(a) Co-dominance\n(b) Incomplete dominance',
              answer:
                '(a) Both alleles express fully — AB blood group. (b) Heterozygote is intermediate — pink snapdragon.',
              solution:
                "**(a) Co-dominance.** Both alleles of a gene express themselves **fully and independently** in the heterozygote — neither hides the other, and you can see *both* effects together.\n\n*Example:* the **ABO blood group**. The alleles `Iᴬ` and `Iᴮ` are co-dominant. A person with genotype `IᴬIᴮ` has **AB blood group** — the red cells carry *both* the A antigen and the B antigen, not a blend.\n\n**(b) Incomplete dominance.** Neither allele is fully dominant, so the heterozygote shows an **intermediate** phenotype — a blend that is between the two homozygotes.\n\n*Example:* flower colour in the **snapdragon / dog flower (*Antirrhinum*)**. A cross of red (`RR`) × white (`rr`) gives an F1 that is **pink (`Rr`)** — a colour halfway between the two parents. Selfing the pink F1 gives F2 in the ratio **1 red : 2 pink : 1 white**, where the phenotypic ratio equals the genotypic ratio.",
            },
            {
              kind: 'numerical',
              id: '0377bca2-5c96-4931-b55c-8aa174a1b2c4',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.14',
              prompt: 'What is point mutation? Give one example.',
              answer:
                'A change in a single base pair of DNA; example — sickle-cell anaemia (GAG→GTG).',
              solution:
                'A **point mutation** is a change (substitution) in a **single base pair** of the DNA. Just one nucleotide is altered, yet it can change the codon and therefore the amino acid put into the protein.\n\n*Example — sickle-cell anaemia.* In the gene for the β-globin chain of haemoglobin, the codon **GAG changes to GTG**. This puts the amino acid **valine in place of glutamic acid** at the 6th position of the β-chain. That single-base change produces the abnormal haemoglobin (HbS), which makes red blood cells collapse into a sickle shape under low oxygen.',
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────────
        {
          id: '044baf0e-706e-4690-8be3-7a9b281f1b61',
          title: 'Chromosomes, linkage & sex determination',
          blurb:
            'Genes ride on chromosomes — the theory that says so, the man who proved linkage, and how sex is set.',
          items: [
            {
              kind: 'numerical',
              id: '1ec209bb-49ce-4984-abe4-7c76bd4bbea0',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.8',
              prompt:
                'Two heterozygous parents are crossed. If the two loci are linked what would be the distribution of phenotypic features in F1 generation for a dihybrid cross?',
              answer:
                'The 9:3:3:1 ratio breaks down — parental-type combinations dominate and recombinants are few.',
              solution:
                "For a normal dihybrid cross (genes on **different** chromosomes, assorting independently) two heterozygotes give the familiar **9 : 3 : 3 : 1** phenotypic ratio.\n\nBut here the two loci are **linked** — they sit on the **same chromosome**, so they tend to be inherited **together** as one unit rather than assorting freely.\n\nBecause of that:\n\n- The **parental (original) combinations** of characters appear in **large numbers**.\n- The **recombinant (new) combinations** appear in **very small numbers**, or are almost absent if the linkage is tight (complete linkage).\n- So the offspring do **not** show the 9 : 3 : 3 : 1 ratio. The distribution is skewed heavily towards the parental types.\n\nThe closer the two genes lie on the chromosome, the stronger the linkage and the fewer the recombinants. This is exactly what **Morgan** found in *Drosophila*, and the frequency of recombinants is used to measure the distance between the genes.",
            },
            {
              kind: 'numerical',
              id: '7dbee21c-2bfd-403a-9949-ff334008f72c',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.9',
              prompt:
                'Briefly mention the contribution of T.H. Morgan in genetics.',
              answer:
                'Working on Drosophila, Morgan discovered linkage, recombination, and sex-linked inheritance, and helped map genes.',
              solution:
                'Thomas Hunt **Morgan** worked with the **fruit fly *Drosophila melanogaster*** and gave experimental proof that genes sit on chromosomes. His main contributions:\n\n- **Linkage.** He showed that genes located on the **same chromosome** are inherited together and called this **linkage**. Such genes do not follow independent assortment.\n- **Recombination.** He found that linked genes can still be separated by **crossing over**, producing recombinant offspring in small numbers.\n- **Strength of linkage.** He distinguished **tightly linked** genes (very few recombinants) from **loosely linked** genes (more recombinants), depending on how far apart they lie.\n- **Gene mapping.** Using recombination frequency as a measure of distance, he and his student Sturtevant prepared the first **genetic maps** of chromosomes.\n- **Sex-linked inheritance.** His study of eye colour in *Drosophila* explained how genes on the X chromosome are inherited.\n\nTogether this work confirmed the **chromosomal theory of inheritance**.',
            },
            {
              kind: 'numerical',
              id: '9eb53bdd-f399-4248-8534-535f420adb6e',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.11',
              prompt: 'How is sex determined in human beings?',
              answer:
                'By the XX–XY system; the father’s sperm (X or Y) decides — XX is female, XY is male.',
              solution:
                "Humans have 23 pairs of chromosomes: **22 pairs of autosomes** plus **1 pair of sex chromosomes**.\n\n- **Female** = 22 pairs of autosomes + **XX**\n- **Male** = 22 pairs of autosomes + **XY**\n\nThis is the **XX–XY** type of sex determination.\n\n- The **female** is **homogametic** — all her eggs carry `22 + X`. She makes only one kind of egg.\n- The **male** is **heterogametic** — his sperm are of **two kinds**: half carry `22 + X` and half carry `22 + Y`.\n\nAt fertilisation:\n\n- Egg (`X`) + **X-sperm** → `XX` → **girl**\n- Egg (`X`) + **Y-sperm** → `XY` → **boy**\n\nSo the sex of the child is decided by which sperm — X-bearing or Y-bearing — fertilises the egg. It depends on the **father**, and there is a **50 % chance** of each sex at every conception.",
            },
            {
              kind: 'numerical',
              id: 'cff920f7-a470-4f8a-86e2-a0671ec2dee9',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.15',
              prompt:
                'Who had proposed the chromosomal theory of the inheritance?',
              answer: 'Walter Sutton and Theodore Boveri (1902).',
              solution:
                'The **chromosomal theory of inheritance** was proposed by **Walter Sutton** and **Theodore Boveri** (around 1902).\n\nThey independently noticed that the behaviour of **chromosomes** during meiosis and fertilisation runs exactly parallel to the behaviour of **Mendel’s factors (genes)** — both occur in pairs, both separate during gamete formation, and both are restored to pairs at fertilisation. From this they concluded that the **hereditary factors are located on the chromosomes**. This theory was later given firm experimental proof by **T. H. Morgan** through his work on *Drosophila*.',
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────────
        {
          id: '8e613670-a6f2-4ae6-af71-21ea56f8c947',
          title: 'Human genetics — pedigrees, blood groups & disorders',
          blurb:
            'Tracking traits through families, solving a blood-group cross, and the autosomal disorders you must know.',
          items: [
            {
              kind: 'numerical',
              id: 'd5862758-2598-4c42-ac46-dcb8f513627d',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.10',
              prompt:
                'What is pedigree analysis? Suggest how such an analysis, can be useful.',
              answer:
                'A study of a trait’s inheritance across generations of a family using a standard chart; used to find the inheritance pattern and counsel families.',
              solution:
                "**What it is.** **Pedigree analysis** is the study of the inheritance of a particular trait across **several generations of a family**, drawn as a chart using standard symbols — a **square** for a male, a **circle** for a female, a horizontal line joining a mating pair, and vertical lines dropping down to their children. Affected individuals are shaded.\n\n**How it is useful:**\n\n- It reveals the **pattern of inheritance** of a trait — whether it is **dominant or recessive**, and whether it is **autosomal or sex-linked**.\n- It helps **trace how a trait has passed** down the generations of a family.\n- It lets us **predict the probability** that a future child will inherit a disorder.\n- It is a key tool in **genetic counselling**, helping families understand the risk of heritable diseases.\n- Since direct controlled crosses are not possible in humans, pedigree analysis is the main way to **study human inheritance**.",
            },
            {
              kind: 'numerical',
              id: '1897fa88-b274-49aa-ad76-5261540a9602',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.12',
              prompt:
                'A child has blood group O. If the father has blood group A and mother blood group B, work out the genotypes of the parents and the possible genotypes of the other offsprings.',
              answer:
                'Father `IᴬI` , mother `IᴮI` ; offspring can be AB, A, B or O in a 1:1:1:1 ratio.',
              solution:
                "Start from the child. Blood group **O** has genotype **`ii`** — it needs **one `i` from each parent**. So each parent must carry a recessive `i`.\n\n- Father is group **A**, but must carry `i` → father = **`Iᴬi`**.\n- Mother is group **B**, but must carry `i` → mother = **`Iᴮi`**.\n\nNow cross **`Iᴬi` × `Iᴮi`**:\n\n|  | **Iᴬ** | **i** |\n|---|---|---|\n| **Iᴮ** | IᴬIᴮ | Iᴮi |\n| **i** | Iᴬi | ii |\n\n**Possible offspring genotypes (and blood groups):**\n\n| Genotype | Blood group |\n|---|---|\n| `IᴬIᴮ` | AB |\n| `Iᴬi` | A |\n| `Iᴮi` | B |\n| `ii` | O |\n\nSo the possible offspring are **AB : A : B : O in a 1 : 1 : 1 : 1 ratio** — all four blood groups can appear among the children.",
            },
            {
              kind: 'numerical',
              id: '5e3efc41-811f-4b31-b51f-c8574db27dcd',
              source: 'ncert_exercise',
              source_label: 'NCERT 4.16',
              prompt:
                'Mention any two autosomal genetic disorders with their symptoms.',
              answer:
                'Sickle-cell anaemia (anaemia, sickled RBCs) and thalassemia (anaemia from faulty globin synthesis).',
              solution:
                "Two **autosomal** genetic disorders (the gene lies on an autosome, not a sex chromosome) — both are **autosomal recessive**:\n\n**1. Sickle-cell anaemia.** Caused by an abnormal haemoglobin (HbS) from a single point mutation (glutamic acid → valine at position 6 of the β-globin chain). The homozygous person (`HbˢHbˢ`) is affected.\n*Symptoms:* red blood cells collapse into a **sickle (crescent) shape** under low oxygen, causing **anaemia**, breakdown of RBCs, and blockage of small blood vessels.\n\n**2. Thalassemia.** Caused by a defect that reduces or stops the synthesis of the globin chains (α or β) of haemoglobin, so too little normal haemoglobin is made.\n*Symptoms:* severe **anaemia**, tiredness/weakness, and a need for repeated blood transfusions in serious cases.\n\n*(Phenylketonuria — a build-up of phenylalanine causing mental retardation — is another acceptable autosomal example.)*",
            },
          ],
        },
      ],
    },
  ],
};
