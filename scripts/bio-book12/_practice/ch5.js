'use strict';
/**
 * Class 12 Biology — Chapter 5 (Molecular Basis of Inheritance)
 * "Practice — NCERT Exercises" page. Authored against ./CONTRACT.md.
 * All 14 NCERT textbook exercises, regrouped into 5 revision themes,
 * each with a full worked, NCERT-faithful solution.
 */

module.exports = {
  slug: 'ch5-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle:
    'All 14 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: '764dcc7e-75e3-4789-a71a-c0e0b5d5d67a',
      type: 'image',
      order: 0,
      src: '',
      alt: 'The DNA double helix unwinding into two template strands with RNA and protein being built from them',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'Hand-drawn coloured illustration on a deep-charcoal dark background, muted earthy palette (dull teal, ochre, brick-red, sage), no glow, no neon, no 3D gloss. A wide horizontal composition showing the central dogma of molecular biology as one flowing scene: on the left a DNA double helix gently unwinding into two separated strands, its rungs drawn as paired bases; in the middle a strand of messenger RNA peeling off a template strand; on the right a ribosome reading the RNA with small transfer-RNA shapes bringing beads of amino acids that join into a short protein chain. Simple labelled hand-lettered tags: "DNA", "RNA", "protein". Textbook-diagram feel, clean line work, illustrative not photographic, calm and academic. 16:5 banner aspect ratio.',
    },
    {
      id: '7d8c843d-b4ab-428c-be18-8eb9703bb932',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are all **14 NCERT exercises** for *Molecular Basis of Inheritance*, pulled out of the textbook's running order and regrouped into five revision themes: the chemistry of DNA, the experiments that proved DNA is the genetic material, the central dogma (transcription and translation), gene regulation through the *lac* operon, and genomics with its applications. Every question carries a one-line answer for a quick self-check and a full worked solution underneath. Try each one on your own first, then read the solution to fix the whole idea — even the parts you got right.",
    },
    {
      id: 'f576aef0-ea00-4dfc-8588-b26ab90a3d7a',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 5.1–5.14',
      intro:
        'Fourteen exercises, five themes. Work top to bottom, or jump to the theme you find hardest.',
      sections: [
        {
          id: '76979a0a-ce43-4f57-9409-4275d99d81b6',
          title: 'DNA — bases, nucleosides and base pairing',
          blurb: 'The building blocks, Chargaff’s rule, and reading a complementary strand.',
          items: [
            {
              kind: 'numerical',
              id: '855d8255-7084-48f3-84fa-81145f04944c',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.1',
              prompt:
                'Group the following as nitrogenous bases and nucleosides:\nAdenine, Cytidine, Thymine, Guanosine, Uracil and Cytosine.',
              answer:
                'Nitrogenous bases: Adenine, Thymine, Uracil, Cytosine. Nucleosides: Cytidine, Guanosine.',
              solution:
                "The trick is the definition. A **nitrogenous base** is just the base on its own. A **nucleoside** is a base *plus* a sugar (base + ribose/deoxyribose), and its name gives it away — it ends in *-osine* or *-idine*.\n\n| Nitrogenous bases | Nucleosides (base + sugar) |\n|---|---|\n| Adenine | Cytidine (cytosine + sugar) |\n| Thymine | Guanosine (guanine + sugar) |\n| Uracil | |\n| Cytosine | |\n\nSo Adenine, Thymine, Uracil and Cytosine are bare bases, while **Cytidine** and **Guanosine** are nucleosides. (If a phosphate were added on top, it would become a *nucleotide* — e.g. cytidine monophosphate.)",
            },
            {
              kind: 'numerical',
              id: '04c64c2f-bf47-4b2e-9ae8-2eceee989455',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.2',
              prompt:
                'If a double stranded DNA has 20 per cent of cytosine, calculate the per cent of adenine in the DNA.',
              answer: 'Adenine = 30%.',
              solution:
                "Use **Chargaff’s rule**: in double-stranded DNA, A pairs with T and G pairs with C, so the amounts pair up too — A = T and G = C.\n\n**Step 1 — find G.** Cytosine = 20%, and since G = C, Guanine = 20%.\n\n**Step 2 — find how much is left for A and T.** All four bases add up to 100%:\n\nA + T + G + C = 100\n\nG + C = 20 + 20 = 40%, so A + T = 100 − 40 = **60%**.\n\n**Step 3 — split A and T.** Since A = T, each is half of 60%:\n\nA = 60 ÷ 2 = **30%**.\n\nSo adenine makes up **30%** of the DNA (and thymine also 30%).",
            },
            {
              kind: 'numerical',
              id: '0a734c0d-173a-46a1-8919-9415ce1c4435',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.3',
              prompt:
                "If the sequence of one strand of DNA is written as follows:\n5'-ATGCATGCATGCATGCATGCATGCATGC-3'\nWrite down the sequence of complementary strand in 5'→3' direction.",
              answer: "5'-GCATGCATGCATGCATGCATGCATGCAT-3'",
              solution:
                "Two rules control this: bases pair **A–T and G–C**, and the two strands run **antiparallel** (opposite directions).\n\n**Step 1 — pair each base.** Write the complement of the given strand base by base:\n\n```\nGiven strand : 5'-A T G C A T G C ... A T G C-3'\nComplement   : 3'-T A C G T A C G ... T A C G-5'\n```\n\n**Step 2 — flip it to read 5'→3'.** The complement above is written 3'→5'. To report it in the 5'→3' direction, reverse the whole string. Reversing (TACG)-repeats gives (GCAT)-repeats:\n\n**5'-GCATGCATGCATGCATGCATGCATGCAT-3'**\n\nQuick check: it is still 28 bases long, and if you line it back up antiparallel against the original, every A faces a T and every G faces a C.",
            },
          ],
        },
        {
          id: '7d17ebab-0a6e-412d-8e38-0afd9fe86922',
          title: 'Proving DNA is the genetic material',
          blurb: 'The reasoning behind semi-conservative replication and the Hershey–Chase experiment.',
          items: [
            {
              kind: 'numerical',
              id: 'e35d730d-0db6-4040-9294-fa69a90b025b',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.5',
              prompt:
                'Which property of DNA double helix led Watson and Crick to hypothesise semi-conservative mode of DNA replication? Explain.',
              answer:
                'The two strands are complementary — each can act as a template to build the other, so every daughter DNA keeps one old strand and one new one.',
              solution:
                "The property is the **complementary base pairing** of the two strands (A always with T, G always with C).\n\nBecause the strands are complementary, they carry the *same information twice*. If you separate them, each single strand already contains all the instructions needed to rebuild its missing partner — an A on the old strand demands a T on the new one, a G demands a C, and so on.\n\nWatson and Crick reasoned that during replication the double helix unwinds, the two strands separate, and **each old strand acts as a template** on which a new complementary strand is made. The result is two DNA molecules, and each one has **one parental (old) strand and one newly made strand**. Because half of each daughter molecule is conserved from the parent, they called it **semi-conservative** replication. (This was later confirmed experimentally by Meselson and Stahl.)",
            },
            {
              kind: 'numerical',
              id: 'dca9aecb-0939-4f9f-90fa-cfb2f57b0e9b',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.7',
              prompt:
                'How did Hershey and Chase differentiate between DNA and protein in their experiment while proving that DNA is the genetic material?',
              answer:
                'They used radioactive tags: ³²P labels DNA only (it has phosphorus, protein doesn’t) and ³⁵S labels protein only (it has sulphur, DNA doesn’t).',
              solution:
                "Hershey and Chase worked with **bacteriophages** (viruses that infect bacteria). A phage is basically DNA inside a protein coat, so the question was: which of the two actually enters the bacterium and directs the making of new phages?\n\nThey separated DNA from protein by exploiting a **chemical difference between the two molecules**:\n- **DNA contains phosphorus but no sulphur.**\n- **Protein contains sulphur (in some amino acids) but no phosphorus.**\n\nSo they grew phages in two separate batches:\n1. One batch on a medium with **radioactive phosphorus (³²P)** → only the phage **DNA** became radioactive.\n2. The other batch on a medium with **radioactive sulphur (³⁵S)** → only the phage **protein coat** became radioactive.\n\nThey let each batch of labelled phages infect *E. coli*, then **agitated the mixture in a blender** to shake the phage coats off the bacterial surface and **centrifuged** it to separate the heavier bacteria (pellet) from the lighter phage coats (supernatant).\n\n**Result:** bacteria infected by the ³²P phages were **radioactive** — DNA had entered the cells. Bacteria infected by the ³⁵S phages were **not radioactive** — the protein coat had stayed outside. This showed that **DNA, not protein, is the material that passes into the cell and carries the genetic information.**",
            },
          ],
        },
        {
          id: 'a1389b2a-34fe-4348-83f1-52e75f2b3199',
          title: 'The central dogma — transcription and translation',
          blurb: 'Reading mRNA off a coding strand, the polymerases, RNA types, strands, and the ribosome.',
          items: [
            {
              kind: 'numerical',
              id: '1addf8cc-b636-400c-89d5-18316d46d4f4',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.4',
              prompt:
                "If the sequence of the coding strand in a transcription unit is written as follows:\n5'-ATGCATGCATGCATGCATGCATGCATGC-3'\nWrite down the sequence of mRNA.",
              answer: "5'-AUGCAUGCAUGCAUGCAUGCAUGCAUGC-3'",
              solution:
                "This one is quicker than it looks. The **coding strand** is defined so that its base sequence is **the same as the mRNA**, with one change only — RNA uses **uracil (U) in place of thymine (T)**. (The mRNA is actually built off the *template* strand, but that makes it a copy of the coding strand.)\n\n**Step 1 — copy the coding strand exactly.**\n5'-ATGCATGCATGCATGCATGCATGCATGC-3'\n\n**Step 2 — replace every T with U.**\n\n**5'-AUGCAUGCAUGCAUGCAUGCAUGCAUGC-3'**\n\nThe direction (5'→3') and the length (28 bases) stay the same. Notice it begins with **AUG** — the start codon — which fits a proper transcription/translation unit.",
            },
            {
              kind: 'numerical',
              id: '8f8ff08b-fc9b-4ed6-b310-34f6149f1edc',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.6',
              prompt:
                'Depending upon the chemical nature of the template (DNA or RNA) and the nature of nucleic acids synthesised from it (DNA or RNA), list the types of nucleic acid polymerases.',
              answer:
                'Four types: DNA-dependent DNA polymerase, DNA-dependent RNA polymerase, RNA-dependent DNA polymerase (reverse transcriptase), and RNA-dependent RNA polymerase.',
              solution:
                "Name a polymerase by two things: **what it reads (the template)** and **what it makes (the product)**. Two choices each gives four combinations.\n\n| Template | Product | Polymerase | Where it acts |\n|---|---|---|---|\n| DNA | DNA | **DNA-dependent DNA polymerase** | DNA replication |\n| DNA | RNA | **DNA-dependent RNA polymerase** | Transcription |\n| RNA | DNA | **RNA-dependent DNA polymerase** (reverse transcriptase) | Retroviruses |\n| RNA | RNA | **RNA-dependent RNA polymerase** (RNA replicase) | RNA viruses |\n\nSo there are **four** types in all.",
            },
            {
              kind: 'numerical',
              id: '9bc45859-c8fc-4b19-8273-4a4a302212c8',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.8',
              prompt:
                'Differentiate between the followings:\n(a) Repetitive DNA and Satellite DNA\n(b) mRNA and tRNA\n(c) Template strand and Coding strand',
              answer:
                '(a) Satellite DNA is the highly-repetitive fraction that separates as satellite peaks; (b) mRNA carries the message, tRNA carries amino acids; (c) the template strand is transcribed, the coding strand is not.',
              solution:
                "**(a) Repetitive DNA vs Satellite DNA**\n\n| Repetitive DNA | Satellite DNA |\n|---|---|\n| Small stretches of DNA repeated many times over in the genome | A sub-type of repetitive DNA whose base composition differs enough to separate as small **satellite peaks** during density-gradient centrifugation |\n| Includes all kinds of repeated sequences | Usually does not code for any protein; classified (by repeat length) into micro- and mini-satellites |\n| Base composition similar to bulk DNA | Shows **high polymorphism** between individuals — the basis of DNA fingerprinting |\n\n**(b) mRNA vs tRNA**\n\n| mRNA (messenger) | tRNA (transfer) |\n|---|---|\n| Carries the genetic message copied from DNA | Acts as an **adapter** that brings amino acids to the ribosome |\n| Provides the **codons** to be read | Has an **anticodon** that reads the codon, and an amino-acid acceptor end |\n| Long, linear molecule | Short; folds into a clover-leaf secondary structure |\n\n**(c) Template strand vs Coding strand**\n\n| Template strand | Coding strand |\n|---|---|\n| Runs 3'→5'; **is actually transcribed** by RNA polymerase | Runs 5'→3'; is **not transcribed** |\n| RNA is made complementary to it | Its sequence is the **same as the mRNA** (with T in place of U) |\n| The working strand | Shown only by convention, for reference |",
            },
            {
              kind: 'numerical',
              id: 'cc8297f4-0abb-4690-8452-220028b39320',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.9',
              prompt: 'List two essential roles of ribosome during translation.',
              answer:
                'It is the site where mRNA and tRNAs meet and provides two slots for the amino acids to line up; and its rRNA acts as the enzyme (ribozyme) that joins amino acids by peptide bonds.',
              solution:
                "During translation the ribosome does two essential jobs:\n\n1. **It is the platform (the site) where translation happens.** The mRNA and the amino-acid-carrying tRNAs come together on the ribosome. The ribosome has **two sites** that hold two successive amino acids close enough for them to be joined, and it moves along the mRNA codon by codon.\n\n2. **It catalyses the peptide bond.** The ribosome itself acts as an enzyme — in bacteria the **23S rRNA** is the catalyst (a *ribozyme*) that forms the **peptide bond** between the amino acids. This links the amino acids into a growing polypeptide chain.",
            },
            {
              kind: 'numerical',
              id: '156d9e67-24e6-4101-a637-544772acc634',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.11',
              prompt:
                'Explain (in one or two lines) the function of the followings:\n(a) Promoter\n(b) tRNA\n(c) Exons',
              answer:
                '(a) Promoter — the RNA-polymerase binding site that marks where transcription starts; (b) tRNA — the adapter that brings amino acids and reads codons; (c) Exons — the coding sequences that stay in the mature mRNA.',
              solution:
                "**(a) Promoter** — a DNA sequence lying towards the 5' end (upstream) of the transcription unit. It provides the **binding site for RNA polymerase** and so decides where transcription begins and which strand is the template.\n\n**(b) tRNA** — the **adapter molecule**. It carries a specific amino acid to the ribosome and reads the codon on the mRNA through its **anticodon**, so the right amino acid is added during translation.\n\n**(c) Exons** — the **coding (expressed) sequences** of a gene. They are the parts kept in the **mature mRNA** after the introns are spliced out, and they appear in the final processed RNA.",
            },
          ],
        },
        {
          id: '6cc8063e-9c6a-4b9a-a3c9-7d215f90905c',
          title: 'Regulation of gene expression — the lac operon',
          blurb: 'Why an operon that lactose switches on gets switched off again.',
          items: [
            {
              kind: 'numerical',
              id: '84aea557-8a9a-40b3-8067-4d0e53281e7a',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.10',
              prompt:
                'In the medium where E. coli was growing, lactose was added, which induced the lac operon. Then, why does lac operon shut down some time after addition of lactose in the medium?',
              answer:
                'Because lactose is the inducer, and once the enzymes break lactose down and use it up, the inducer is gone — the repressor becomes active again, binds the operator, and switches the operon off.',
              solution:
                "The *lac* operon is controlled by an **inducer**, and here **lactose is that inducer**.\n\n**When lactose is added:** it binds to the repressor protein and inactivates it. With the repressor unable to sit on the operator, RNA polymerase transcribes the structural genes (*z, y, a*), producing **β-galactosidase, permease and transacetylase**. These enzymes start **breaking lactose down** and using it as food. This is the 'induced', switched-on state.\n\n**Why it shuts down later:** as the cell keeps metabolising lactose, the amount of lactose steadily **falls until it is used up**. Once the inducer (lactose) is depleted, there is nothing to keep the repressor inactive. The **repressor becomes free and active again, binds the operator**, and blocks RNA polymerase. Transcription stops, so the *lac* operon **switches off**. In short, the operon stays on only as long as its inducer is present.",
            },
          ],
        },
        {
          id: '879f68fe-6e12-4d9c-9963-f40d6ba96368',
          title: 'Genomics and its applications',
          blurb: 'The Human Genome Project, DNA fingerprinting, and the key terms of the field.',
          items: [
            {
              kind: 'numerical',
              id: 'ae9a2d5b-b985-48cb-97cb-6c4d5a462bd2',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.12',
              prompt: 'Why is the Human Genome project called a mega project?',
              answer:
                'Because of its huge scale — about 3 billion base pairs to sequence, an enormous cost, masses of data needing new computing (bioinformatics), and a 13-year international collaboration.',
              solution:
                "The Human Genome Project (HGP) is called a **mega project** because of its sheer size on every front:\n\n- **Enormous scale of the genome:** the human genome has about **3 × 10⁹ (3 billion) base pairs** to be sequenced — a staggering amount.\n- **Huge cost:** sequencing at even a small cost per base ran into billions of dollars (estimated around **US $9 billion**).\n- **A flood of data:** the sequences generated needed **high-speed computers** for storage, retrieval and analysis — this need actually gave rise to the new field of **bioinformatics**.\n- **A long, coordinated, international effort:** it ran for about **13 years (1990–2003)** and was carried out collaboratively by many countries and institutions.\n\nAll of this together — the scale, cost, data and worldwide coordination — is why it earned the name 'mega project'.",
            },
            {
              kind: 'numerical',
              id: '210b99e4-64f7-456b-9fc4-c98280ec76dc',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.13',
              prompt: 'What is DNA fingerprinting? Mention its application.',
              answer:
                'A technique that compares highly variable (polymorphic) repetitive/satellite regions of DNA to identify individuals; used in forensics and to settle parentage disputes.',
              solution:
                "**What it is:** DNA fingerprinting is a technique that looks at **very specific regions of the DNA sequence that vary a lot from person to person** — the repetitive/satellite DNA (VNTRs) that show a **high degree of polymorphism**. Since these variable regions differ between individuals (but are inherited from parents), comparing them gives an almost unique 'fingerprint' of a person's DNA.\n\n**Applications:**\n- **Forensic science** — identifying criminals or victims from biological samples (blood, hair, semen, etc.) at a crime scene.\n- **Settling parentage/paternity disputes** — confirming who the biological parents of a child are.\n- **Identification of individuals** and studies of **population and genetic diversity**.",
            },
            {
              kind: 'numerical',
              id: '1b053af7-6019-49f8-a62b-68f2303af514',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.14',
              prompt:
                'Briefly describe the following:\n(a) Transcription\n(b) Polymorphism\n(c) Translation\n(d) Bioinformatics',
              answer:
                '(a) Copying DNA information into RNA; (b) inherited variation in DNA sequence in a population; (c) joining amino acids into a protein using the mRNA sequence; (d) using computing to store and analyse biological data.',
              solution:
                "**(a) Transcription** — the process of **copying genetic information from one strand of the DNA into RNA**. It is done by DNA-dependent RNA polymerase; only the **template strand (3'→5')** is copied, and the RNA is built in the 5'→3' direction. It has three steps: initiation, elongation and termination.\n\n**(b) Polymorphism** — **variation at the genetic level** within a population. It arises from mutations; when an inheritable change in DNA sequence occurs in a population at high frequency (more than 0.01), it is called **DNA polymorphism**. It is the raw material for evolution and the basis of DNA fingerprinting.\n\n**(c) Translation** — the process of **joining amino acids in order to make a polypeptide (protein)**. The **sequence of codons (bases) in the mRNA** decides the order of amino acids. It happens on **ribosomes**, with tRNA bringing the amino acids.\n\n**(d) Bioinformatics** — the field that uses **computers and information technology to store, retrieve and analyse the huge amount of biological data** (such as genome sequences) generated by projects like the HGP.",
            },
          ],
        },
      ],
    },
  ],
};
