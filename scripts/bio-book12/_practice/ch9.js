// Class 12 Biology — Chapter 9 (Biotechnology: Principles and Processes)
// "Practice — NCERT Exercises" page. All 12 NCERT textbook exercises, regrouped
// into 4 revision themes with full worked solutions. Authored per
// scripts/bio-book12/_practice/CONTRACT.md. Do NOT insert to any DB from here.

module.exports = {
  slug: 'ch9-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle:
    'All 12 NCERT textbook exercises for the chapter, grouped into 4 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: 'b962f2f6-7b5f-4a6c-8be3-8a7142aed7ab',
      type: 'image',
      order: 0,
      src: '',
      alt: 'The rDNA toolkit — a restriction enzyme cutting a DNA double helix into sticky-ended fragments, a plasmid vector, and a stirred-tank bioreactor.',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'A hand-drawn coloured illustration on a deep-charcoal near-black background, muted earthy palette (dusty teal, ochre, brick-red, sage), no glow, no neon, no 3D, no orange. A wide horizontal panel showing the toolkit of recombinant DNA technology laid out left to right like a laboratory bench diagram: (1) a DNA double helix being cut by a restriction enzyme at a palindromic site, leaving staggered sticky ends with short single-stranded overhangs; (2) a small circular plasmid vector labelled with an origin of replication and a selectable marker gene; (3) DNA fragments migrating as bands through a gel-electrophoresis lane toward a plus/anode symbol; (4) a stirred-tank bioreactor vessel with an impeller, sparger bubbles and control dials. Clean hand-inked labels, textbook-illustration feel, calm and academic, landscape/desktop friendly.',
    },
    {
      id: 'ff405c0a-0747-47de-9e1e-681fbe7ade35',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are **all 12 NCERT exercises** for *Biotechnology: Principles and Processes*, pulled out of the textbook's running order and regrouped into four revision themes: the molecular scissors (restriction enzymes and palindromes), sizes and timing, the recombinant products and how we spot the right cells, and finally the big \"describe / explain / distinguish\" round-up. Try each one on your own first. Then open the worked solution — every answer is written to teach the whole idea, not just tick the box.",
    },
    {
      id: 'f2e43912-732c-475f-a597-1582529e8f01',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 9.1–9.12',
      intro:
        'Twelve questions, four themes. Work top to bottom for a full revision of the chapter, or jump to the theme you want to shore up.',
      sections: [
        {
          id: '08875979-adef-4465-a869-fb86b86c96ca',
          title: 'Restriction enzymes & palindromes — the molecular scissors',
          blurb:
            'How DNA is recognised and cut: the palindrome, the sticky end, and why only bacteria carry these enzymes.',
          items: [
            {
              kind: 'numerical',
              id: '266fa420-9838-4faf-be57-18fcf9dbdd3b',
              source: 'ncert_exercise',
              source_label: 'NCERT 9.2',
              prompt:
                'Make a chart (with diagrammatic representation) showing a restriction enzyme, the substrate DNA on which it acts, the site at which it cuts DNA and the product it produces.',
              answer:
                'EcoRI cuts 5′-GAATTC-3′ between G and A on each strand, leaving two fragments with single-stranded 5′-AATT sticky ends.',
              solution:
                'Take **EcoRI** (from *Escherichia coli* RY13) as the example, and fill the chart in four columns.\n\n| Restriction enzyme | Substrate DNA (recognition site) | Site of cut | Product |\n|---|---|---|---|\n| **EcoRI** | double-stranded DNA carrying the palindrome 5′-…GAATTC…-3′ / 3′-…CTTAAG…-5′ | between **G** and **A** on *each* strand — staggered, not straight across | two fragments, each with a single-stranded **5′-AATT** overhang (a *sticky end*) |\n\nDiagram in words. The enzyme reads the six-base **palindrome** and makes two cuts:\n\n```\n5′ --- G     A A T T C --- 3′\n            ↓ cut here (both strands, staggered)\n3′ --- C T T A A     G --- 5′\n```\n\nAfter cutting you get two pieces with short overhanging single strands:\n\n```\n5′ ---G          AATTC--- 3′\n3′ ---CTTAA          G--- 5′\n```\n\nThose overhangs are **sticky (cohesive) ends** — they are single-stranded and complementary, so any two fragments cut by the *same* enzyme can pair up and be sealed by **DNA ligase**. That is exactly why the *same* restriction enzyme is used to cut both the source DNA and the vector: their sticky ends match and join.',
            },
            {
              kind: 'numerical',
              id: '0983233e-4fdf-4b0a-a83d-831092fe00cc',
              source: 'ncert_exercise',
              source_label: 'NCERT 9.5',
              prompt:
                'Do eukaryotic cells have restriction endonucleases? Justify your answer.',
              answer:
                'No — restriction endonucleases are a bacterial (prokaryotic) defence system; eukaryotic cells do not have them.',
              solution:
                "**No, eukaryotic cells do not have restriction endonucleases.**\n\nThese enzymes are part of a defence system found in **bacteria (prokaryotes)**. In bacteria they act as a *restriction–modification* system: when a bacteriophage (virus) injects its DNA, the restriction endonuclease chops that foreign DNA into pieces (it \"restricts\" the phage from multiplying). The bacterium protects its *own* DNA from being cut by adding methyl groups (methylation) at the recognition sites.\n\nEukaryotic cells are not attacked by bacteriophages in this way and do not need this system, so they do not carry restriction endonucleases. This is also why molecular biologists get their restriction enzymes from bacteria in the first place.",
            },
            {
              kind: 'numerical',
              id: 'fdf3c49c-318a-478b-9f21-88e9edac7471',
              source: 'ncert_exercise',
              source_label: 'NCERT 9.7',
              prompt:
                'Collect 5 examples of palindromic DNA sequences by consulting your teacher. Better try to create a palindromic sequence by following base-pair rules.',
              answer:
                'A DNA palindrome reads the same 5′→3′ on both strands, e.g. GAATTC, GGATCC, AAGCTT, GGTACC, GAGCTC.',
              solution:
                "A DNA **palindrome** is a stretch of double-stranded DNA that reads the *same* in the 5′→3′ direction on **both** strands. (Like MADAM read backwards, but obeying base-pairing.) Restriction enzymes recognise exactly these.\n\n**Five examples** (top strand written 5′→3′; its complement reads the same 5′→3′):\n\n| Sequence (5′→3′) | Recognised by |\n|---|---|\n| **GAATTC** | EcoRI |\n| **GGATCC** | BamHI |\n| **AAGCTT** | HindIII |\n| **GGTACC** | KpnI |\n| **GAGCTC** | SacI |\n\n**How to build your own** — three steps:\n1. Write any short even-length strand, say 5′-**GGATCC**-3′.\n2. Write its complementary strand underneath: 3′-CCTAGG-5′.\n3. Read that complement in the 5′→3′ direction: **GGATCC** — same as the original. So it is a palindrome.\n\n```\n5′ - G G A T C C - 3′\n3′ - C C T A G G - 5′   (read 5′→3′ = G G A T C C)\n```\n\nAnother you can make: 5′-**AGATCT**-3′ (its complement read 5′→3′ is also AGATCT — this is the BglII site). The trick is symmetry: pick bases so the second half is the reverse-complement of the first half.",
            },
          ],
        },
        {
          id: '9dcb4e69-9466-4b89-9be9-70d2dcb9fdc4',
          title: 'Sizes, amounts & when recombination happens',
          blurb:
            'How big DNA is next to the enzymes that cut it, how much DNA sits in a human cell, and where nature makes recombinant DNA.',
          items: [
            {
              kind: 'numerical',
              id: 'fd15a089-8d39-43d6-ac11-15f911e00cc0',
              source: 'ncert_exercise',
              source_label: 'NCERT 9.3',
              prompt:
                'From what you have learnt, can you tell whether enzymes are bigger or DNA is bigger in molecular size? How did you know?',
              answer:
                'DNA is much bigger. It carries thousands of genes, while an enzyme is a single protein made from just one of them.',
              solution:
                "**DNA is far bigger than an enzyme.**\n\nReason it out from what the two things *do*. An enzyme is a **protein** — the product of a *single* gene, usually a few hundred amino acids long. **DNA** is the molecule that stores the instructions for *all* the proteins of the cell, so it must be enormously longer. For example, the DNA of the bacterium *E. coli* is about **4.6 × 10⁶ base pairs** in one continuous molecule, and a single human chromosome runs to tens of millions of base pairs.\n\nHow do we *know* this?\n- A restriction enzyme binds to DNA and cuts it into many fragments — the thing being cut (DNA) is the long template; the scissors (enzyme) are tiny by comparison.\n- In **gel electrophoresis** we routinely separate DNA molecules that are thousands of base pairs long — far larger in molecular mass than any single protein.\n\nSo the general rule: the template that *encodes* the proteins (DNA) is much larger than any one protein it encodes.",
            },
            {
              kind: 'numerical',
              id: '9e2bda42-dd8c-46fa-ac27-91a54608378f',
              source: 'ncert_exercise',
              source_label: 'NCERT 9.4',
              prompt:
                'What would be the molar concentration of human DNA in a human cell? Consult your teacher.',
              answer:
                'A diploid cell holds 46 DNA molecules ⇒ about 46 ÷ (6.022 × 10²³) ≈ 7.6 × 10⁻²³ moles of DNA per cell.',
              solution:
                "Work from the **number of DNA molecules** in one cell.\n\nA human **diploid** somatic cell has **46 chromosomes**, and each chromosome is a *single* DNA molecule. So one cell contains **46 DNA molecules**.\n\nConvert that count to moles using Avogadro's number ($6.022 \\times 10^{23}$ molecules per mole):\n\n$$\\text{moles of DNA} = \\frac{46}{6.022 \\times 10^{23}} \\approx 7.6 \\times 10^{-23}\\ \\text{mol per cell}$$\n\nTo turn moles into a **molar concentration** (moles per litre) you divide by the cell's volume:\n\n$$\\text{concentration} = \\frac{7.6 \\times 10^{-23}\\ \\text{mol}}{\\text{volume of the cell (in litres)}}$$\n\nSince a cell's volume is only a few picolitres, the actual number of DNA molecules is vanishingly small in molar terms — which is exactly why we must **amplify** DNA (by PCR or by cloning) before we can work with it. The headline figure to remember is **≈ 7.6 × 10⁻²³ moles of DNA in a diploid human cell**.",
            },
            {
              kind: 'numerical',
              id: '8728d7a3-075c-4309-a4b7-966bf09ce831',
              source: 'ncert_exercise',
              source_label: 'NCERT 9.8',
              prompt:
                'Can you recall meiosis and indicate at what stage a recombinant DNA is made?',
              answer:
                'During the pachytene stage of Prophase I of meiosis, when crossing over exchanges segments between homologous chromosomes.',
              solution:
                "In **meiosis I**, homologous chromosomes pair up and then exchange pieces. Recombinant DNA is made naturally at the **pachytene stage of Prophase I**.\n\nThe sequence within Prophase I is: leptotene → zygotene → **pachytene** → diplotene → diakinesis.\n- At **zygotene** the homologous chromosomes pair (synapsis) to form bivalents.\n- At **pachytene**, **crossing over** takes place: non-sister chromatids of the homologous pair exchange corresponding segments. This exchange is carried out with the help of the enzyme **recombinase**.\n\nBecause segments are swapped between the maternal and paternal chromatids, the chromatids now carry **new combinations of genes** — that is, **recombinant DNA**. So nature's own recombinant DNA is generated at **pachytene of Prophase I of meiosis**. (This is the natural recombination; it is the same principle that lab recombinant-DNA technology imitates in a test tube.)",
            },
          ],
        },
        {
          id: '9635139c-4443-4427-af76-eefc7e0e51ba',
          title: 'Recombinant products, selection & reporter markers',
          blurb:
            'What rDNA technology gives medicine, and how we pick out the cells that actually took up our gene.',
          items: [
            {
              kind: 'numerical',
              id: '158a42c7-2065-42f3-9e4e-53e112b0d113',
              source: 'ncert_exercise',
              source_label: 'NCERT 9.1',
              prompt:
                'Can you list 10 recombinant proteins which are used in medical practice? Find out where they are used as therapeutics (use the internet).',
              answer:
                'e.g. insulin, human growth hormone, factor VIII, factor IX, tPA, erythropoietin, interferon, hepatitis-B vaccine antigen, DNase I, interleukin.',
              solution:
                "Ten recombinant (genetically-engineered) proteins used as medicines, and what they treat:\n\n| Recombinant protein | Used as a therapeutic for |\n|---|---|\n| **Human insulin** (e.g. Humulin) | Diabetes mellitus |\n| **Human growth hormone** (somatotropin) | Dwarfism / growth-hormone deficiency |\n| **Blood clotting factor VIII** | Haemophilia A |\n| **Blood clotting factor IX** | Haemophilia B (Christmas disease) |\n| **Tissue plasminogen activator (tPA)** | Dissolving clots in heart attack and stroke |\n| **Erythropoietin (EPO)** | Anaemia, especially in kidney failure |\n| **Interferon** | Antiviral use and certain cancers |\n| **Hepatitis-B vaccine (surface antigen)** | Prevention of hepatitis B |\n| **DNase I (dornase alfa)** | Cystic fibrosis (thins the thick mucus) |\n| **Interleukin** | Immune modulation / cancer therapy |\n\nThe common thread: the human gene is cloned into a microbe (or cultured cell), which then manufactures the human protein in bulk — safer and more plentiful than extracting it from animal or human tissue.",
            },
            {
              kind: 'numerical',
              id: '26f07d37-3a4c-48c5-92ea-dbb9fc13c86c',
              source: 'ncert_exercise',
              source_label: 'NCERT 9.9',
              prompt:
                'Can you think and answer how a reporter enzyme can be used to monitor transformation of host cells by foreign DNA in addition to a selectable marker?',
              answer:
                'By insertional inactivation of an enzyme like β-galactosidase — recombinant colonies stay colourless (white) while non-recombinants turn blue.',
              solution:
                "A **selectable marker** (say, an antibiotic-resistance gene) only tells you that a cell took up the *plasmid*. It cannot tell you whether that plasmid actually carries your *inserted* foreign DNA. Sorting recombinants from non-recombinants by using a **second** antibiotic marker means killing cells by replica plating — slow and cumbersome.\n\nA **reporter enzyme** solves this by the trick of **insertional inactivation**. Put the cloning site *inside* the coding sequence of an enzyme such as **β-galactosidase** (the *lacZ* gene):\n- If **no foreign DNA** is inserted, the gene stays intact → the enzyme is made → on a chromogenic substrate the colony turns **blue**.\n- If **foreign DNA is inserted** into the gene, the enzyme's sequence is broken → no active enzyme → the colony stays **white / colourless**.\n\nSo you simply *look* at colour: **white colonies are the recombinants**, blue colonies are not. The enzyme \"reports\" whether the insert went in, letting you monitor transformation directly — without a second round of antibiotic selection. This is the well-known **blue–white selection**.",
            },
          ],
        },
        {
          id: '49e3d6af-6045-4a89-bfb4-ffca247cd78f',
          title: 'Bioreactors, downstream processing & the big round-up',
          blurb:
            'Scaling up the culture, purifying the product, and the "describe / explain / distinguish" omnibus questions.',
          items: [
            {
              kind: 'numerical',
              id: '66d4a12b-c9a8-4ef7-be27-a6ce9406c2b9',
              source: 'ncert_exercise',
              source_label: 'NCERT 9.6',
              prompt:
                'Besides better aeration and mixing properties, what other advantages do stirred tank bioreactors have over shake flasks?',
              answer:
                'They allow large-scale culture with built-in control of temperature, pH, foam and oxygen, plus a sampling port — none of which a shake flask offers.',
              solution:
                "A shake flask holds only a few hundred millilitres — fine for research, useless for making a product by the tonne. A **stirred-tank bioreactor** (typically 100–1000 litres) beats it on far more than mixing and aeration:\n\n- **Large volumes can be processed** — true industrial-scale culture.\n- A **temperature control system** (a jacket around the vessel) holds the culture at the ideal temperature.\n- A **pH control system** keeps the medium at the right acidity.\n- A **foam control system** manages the froth that microbial growth produces.\n- An **oxygen delivery system** (aeration + the agitator) supplies oxygen evenly.\n- A **sampling port** lets small volumes of culture be withdrawn periodically **without contaminating** the batch.\n\nIn short, the bioreactor provides the **optimum, closely monitored and controlled growth conditions** needed to obtain the desired product in large amounts — something a shake flask simply cannot do.",
            },
            {
              kind: 'numerical',
              id: 'a53f6dab-6efb-4330-bed7-e926575da5c5',
              source: 'ncert_exercise',
              source_label: 'NCERT 9.10',
              prompt:
                'Describe briefly the following:\n(a) Origin of replication\n(b) Bioreactors\n(c) Downstream processing',
              answer:
                '(a) sequence where replication starts and that controls copy number; (b) vessels for large-scale culture under controlled conditions; (c) the separation, purification and formulation after the product is made.',
              solution:
                "**(a) Origin of replication (ori).** This is a specific DNA sequence at which replication *starts*. Any piece of DNA that is linked to this sequence can be made to replicate inside a host cell. The *ori* also **controls the copy number** of the linked DNA — so if you want many copies of your cloned gene, you choose a vector whose origin supports a high copy number.\n\n**(b) Bioreactors.** These are large vessels (commonly **100–1000 litres**) in which raw materials are converted into specific products — enzymes, proteins, etc. — using microbial, plant, animal or human **cells**. A bioreactor supplies the **optimum conditions** for growth: correct temperature, pH, substrate, salts, vitamins and oxygen. The most common design is the **stirred-tank** reactor (usually cylindrical), fitted with an agitator, an oxygen-delivery system, a foam-control system, temperature- and pH-control systems, and a sampling port. Another design is the **sparged (bubble-column)** type.\n\n**(c) Downstream processing.** After the product has been made in the bioreactor (the biosynthetic stage), it is put through a series of processes **before it is ready to be marketed**. Together these are called downstream processing. They include **separation and purification** of the product, adding suitable **preservatives / formulation**, its **clinical trials** (for a drug), and rigorous **quality control** testing. Downstream processing and the quality-control steps differ from product to product.",
            },
            {
              kind: 'numerical',
              id: '421f8819-d102-4283-9a2d-f910ef842a44',
              source: 'ncert_exercise',
              source_label: 'NCERT 9.11',
              prompt:
                'Explain briefly\n(a) PCR\n(b) Restriction enzymes and DNA\n(c) Chitinase',
              answer:
                '(a) in-vitro DNA amplification by repeated denaturation–annealing–extension; (b) enzymes that recognise palindromes and cut DNA at specific sites; (c) enzyme that digests fungal cell walls to release DNA.',
              solution:
                "**(a) PCR (Polymerase Chain Reaction).** A method to **amplify** a gene or DNA segment *in vitro* — making millions to billions of copies. It uses two small chemically-synthesised **primers** that flank the target region, and a **thermostable DNA polymerase (Taq polymerase**, from the bacterium *Thermus aquaticus*). Each cycle has three steps: **Denaturation** (~94 °C — the two strands separate), **Annealing** (the primers bind to their complementary flanking sequences), and **Extension** (Taq polymerase extends the primers, copying the target). Repeating the cycle many times amplifies the DNA about a billion-fold. PCR is used in diagnostics and to make enough copies of a gene for cloning.\n\n**(b) Restriction enzymes and DNA.** Restriction enzymes (restriction **endonucleases**) recognise a specific **palindromic** sequence in the DNA and cut *both* strands at defined points. Each enzyme has its own recognition sequence. It cuts a little away from the centre of the palindrome, between the *same* two bases on both strands, leaving single-stranded **sticky ends**. Because the same enzyme gives matching sticky ends on both the source DNA and the vector, the two can be joined by **DNA ligase** — which is how a recombinant DNA molecule is built. The enzymes are named after the organism they come from (e.g. **EcoRI** from *Escherichia coli*).\n\n**(c) Chitinase.** An enzyme used to **break down the cell wall of fungi**, which is made of **chitin**. Digesting the wall releases the DNA and other macromolecules held inside — so chitinase is used in the **isolation of genetic material** from fungal cells. (For comparison: bacterial walls are opened with **lysozyme**, and plant cell walls with **cellulase**.)",
            },
            {
              kind: 'numerical',
              id: '7908b227-4e4d-4aa3-bc9d-7e44a5b50450',
              source: 'ncert_exercise',
              source_label: 'NCERT 9.12',
              prompt:
                'Discuss with your teacher and find out how to distinguish between\n(a) Plasmid DNA and Chromosomal DNA\n(b) RNA and DNA\n(c) Exonuclease and Endonuclease',
              answer:
                '(a) plasmid = small, circular, extra-chromosomal, non-essential genes; (b) RNA = ribose + uracil, usually single-stranded; (c) exonuclease cuts from the ends, endonuclease cuts within.',
              solution:
                "**(a) Plasmid DNA vs Chromosomal DNA**\n\n| Plasmid DNA | Chromosomal DNA |\n|---|---|\n| Small, circular, **extra-chromosomal** DNA in some bacteria | Large main DNA (genophore) of the cell |\n| Replicates **autonomously** (own origin) | Replicates as part of the cell's genome |\n| Carries a few **non-essential** genes (e.g. antibiotic resistance) | Carries the **essential** genes for the cell |\n| Often present in **multiple copies** | Usually a **single** copy |\n\n**(b) RNA vs DNA**\n\n| RNA | DNA |\n|---|---|\n| Sugar is **ribose** | Sugar is **deoxyribose** |\n| Has **uracil** (no thymine) | Has **thymine** (no uracil) |\n| Usually **single-stranded** | Usually **double-stranded** |\n| Chemically **less stable** | Chemically **more stable** |\n| Mainly acts in **protein synthesis**; genetic material in some viruses | The **store of genetic information** |\n\n**(c) Exonuclease vs Endonuclease**\n\n| Exonuclease | Endonuclease |\n|---|---|\n| Removes nucleotides from the **ends** (the 5′ or 3′ termini) of the DNA | Makes cuts at specific positions **within** the DNA (internally) |\n| Chews the molecule inward from a free end | **Restriction enzymes** are of this type — they cut inside the sequence |",
            },
          ],
        },
      ],
    },
  ],
};
