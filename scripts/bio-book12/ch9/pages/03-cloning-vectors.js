'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'cloning-vectors-and-their-features',
  title: 'Delivery Vehicles — Cloning Vectors',
  subtitle: "A cloning vector is a self-replicating piece of DNA that carries your gene of interest into a host cell and copies it — this page shows the exact features that make one work, using pBR322 as the model.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['cloning-vectors', 'pbr322', 'insertional-inactivation', 'biotechnology-principles'],
  glossary: [
    { term: 'cloning vector', definition: 'A self-replicating piece of DNA — usually a plasmid or a bacteriophage — into which a foreign gene is linked so that it gets carried into a host cell and multiplied along with the vector.' },
    { term: 'origin of replication (ori)', definition: 'The DNA sequence where replication starts. Any DNA linked to it can replicate inside the host cell, and this sequence also controls the copy number of the linked DNA.' },
    { term: 'selectable marker', definition: 'A gene (usually for antibiotic resistance) that lets us identify and eliminate non-transformants while allowing only transformed cells to grow.' },
    { term: 'insertional inactivation', definition: 'Loss of a gene’s function because foreign DNA has been inserted into the middle of its coding sequence — used to tell recombinant cells apart from non-recombinant ones.' },
    { term: 'pBR322', definition: 'A well-known E. coli cloning vector carrying two antibiotic-resistance genes (ampR and tetR), an ori, several restriction sites, and the rop gene.' },
    { term: 'Ti plasmid', definition: 'The tumour-inducing plasmid of Agrobacterium tumefaciens, now modified into a non-pathogenic cloning vector for delivering genes into plants.' },
    { term: 'transformant', definition: 'A host bacterium that has taken up a piece of foreign DNA (the vector) through the process of transformation.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single bacterial cell at dusk with a small glowing ring of plasmid DNA being ferried inside it, suggesting a delivery vehicle',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single large bacterial cell rendered in deep dusk tones on a near-black background (#0a0a0a base), its interior faintly translucent. Floating inside and just entering it, a small glowing circular loop of DNA — a plasmid — drawn as a smooth continuous purple ring, catching a soft warm rim-light as if being carried in like cargo. A faint trail of light suggests the plasmid ferrying a tiny highlighted segment of foreign DNA along with it. Atmospheric, painterly illustration style, quiet and scientific, a single warm horizon glow tying the scene together. No text, no labels, no diagram callouts.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Nature’s Own Gene Taxis',
      markdown: "Long before any scientist thought of moving genes around, bacteria were already doing it. **Plasmids** — small circular rings of DNA that sit inside bacterial cells and copy themselves on their own — drift between cells carrying useful genes, like antibiotic resistance. **Bacteriophages** (viruses that infect bacteria) inject their DNA and get it multiplied into hundreds of copies. Genetic engineers didn’t invent the delivery vehicle. They **borrowed these natural gene taxis and re-engineered them** to carry a gene of our choosing.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Both **plasmids and bacteriophages** share one power that makes them precious: they can **replicate within bacterial cells independent of the control of the chromosomal DNA**. They copy themselves whether or not the cell’s main chromosome is copying. Bacteriophages carry very **high copy numbers** of their genome per cell. Plasmids vary — some sit at just **one or two copies per cell**, others at **15–100 copies**, and some go even higher.\n\nHere is why that matters. If we **link an alien piece of DNA** to a plasmid or a phage, that foreign DNA now rides along and gets **multiplied to the same copy number** as its carrier. Link your gene to a high-copy plasmid and the host cell hands you back many copies of it. A **cloning vector** is exactly this: a carrier DNA, engineered so it links easily to foreign DNA and lets us pick out the cells that took it up.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Features That Make a Useful Vector',
      objective: "By the end of this you can list the three things NCERT says every cloning vector needs, and say what each one does.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "A random piece of DNA cannot serve as a vector. NCERT lists the features a vector needs to actually work:\n\n- **(i) Origin of replication (ori):** the sequence where replication starts. Any DNA linked to the ori can be **made to replicate inside the host**. This same sequence also **controls the copy number** — so if you want many copies of your target DNA, clone it into a vector whose ori supports a high copy number.\n- **(ii) Selectable marker:** on its own the ori is not enough. The vector also needs a marker that **identifies and eliminates non-transformants**, and lets only the transformants grow. The usual markers are genes for **resistance to antibiotics** — ampicillin, chloramphenicol, tetracycline, kanamycin. This works because normal *E. coli* cells carry **no resistance** to these antibiotics, so only cells that picked up the vector survive on the antibiotic.\n- **(iii) Cloning sites:** to link the alien DNA, the vector needs **recognition sites for restriction enzymes** — but preferably **very few, ideally a single site** for a given enzyme. If the same enzyme cut the vector in several places, you’d get many fragments and the cloning would become a mess.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Circular map of the E. coli cloning vector pBR322 showing ori, ampR and tetR resistance genes, restriction sites and the rop gene',
      caption: '📸 Tap each dot on the pBR322 map to see what that part of the vector does',
      hotspots: [
        { id: uuid(), x: 0.74, y: 0.48, label: 'ori (origin of replication)', icon: 'circle',
          detail: 'The sequence where replication of the plasmid **begins**. It lets pBR322 — and any DNA linked into it — copy itself inside the host, and it **sets the copy number** of the plasmid.' },
        { id: uuid(), x: 0.50, y: 0.84, label: 'ampR (ampicillin-resistance gene)', icon: 'circle',
          detail: 'A **selectable marker**. Cells carrying pBR322 survive on ampicillin; normal *E. coli* does not. In the standard pBR322 cloning scheme this gene stays **intact**, so it is used to select the transformants.' },
        { id: uuid(), x: 0.30, y: 0.26, label: 'tetR (tetracycline-resistance gene)', icon: 'circle',
          detail: 'The second **selectable marker**. Foreign DNA is often ligated *inside* this gene, which **inactivates it** — so recombinants lose tetracycline resistance while keeping ampicillin resistance.' },
        { id: uuid(), x: 0.42, y: 0.16, label: 'BamH I site', icon: 'circle',
          detail: 'A **restriction site that sits within the tetR gene**. Ligating foreign DNA here disrupts tetR, which is the basis of selecting recombinants by loss of tetracycline resistance.' },
        { id: uuid(), x: 0.63, y: 0.20, label: 'EcoR I site', icon: 'circle',
          detail: 'One of pBR322’s **cloning sites** — a single recognition site for the restriction enzyme EcoR I. pBR322 also carries sites for Hind III, Sal I, Pvu II, Pst I and Cla I.' },
        { id: uuid(), x: 0.22, y: 0.58, label: 'rop', icon: 'circle',
          detail: 'A gene that **codes for the proteins involved in the replication** of the plasmid. It helps govern how pBR322 copies itself.' },
      ],
      generation_prompt: "Scientific textbook illustration of the E. coli cloning vector pBR322 as a circular plasmid map. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A single clean purple circular ring representing the double-stranded plasmid DNA, drawn as a smooth continuous loop centred in the frame. Around the ring, curved coloured arc-segments mark labelled gene regions with clean white outlines: a labelled arc for 'ampR' (ampicillin resistance) on the lower part of the circle, a labelled arc for 'tetR' (tetracycline resistance) on the upper-left, a marked 'ori' region on the right, and a small 'rop' region on the left. Thin white tick marks with thin white leader lines point to several restriction sites positioned around the ring (Hind III, EcoR I, BamH I, Sal I, Pvu II, Pst I, Cla I), with BamH I clearly falling within the tetR arc. Biologically accurate circular-plasmid-map style, white leader lines, no photorealism, no cartoon, no mascots, matches standard biology textbook plasmid-map conventions.",
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Spotting the Recombinants — And Reaching Plants and Animals',
      objective: "By the end of this you can explain how insertional inactivation and blue-white selection pick out recombinant cells, and name the vectors used for plants and animals.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "A marker doesn’t just prove a cell took up the vector — a clever trick turns it into a way to spot the cells that took up the vector **with your gene inside it** (the recombinants). This is **insertional inactivation**.\n\nIn pBR322, foreign DNA is ligated at the **BamH I site, which lies inside the tetracycline-resistance gene (tetR)**. The insertion breaks that gene, so a recombinant plasmid **loses its tetracycline resistance** but still carries an intact **ampicillin-resistance** gene. Now you can sort the cells:\n\n- Grow the transformants on **ampicillin** medium — everything carrying the plasmid survives.\n- Transfer them onto **tetracycline** medium. **Recombinants grow on ampicillin but NOT on tetracycline** (their tetR is broken). **Non-recombinants grow on both.** One resistance gene selects the transformants; the other gets inactivated by the insert and reveals the recombinants.\n\nSelecting this way is **cumbersome** — it needs plating on two different antibiotic plates. So a better marker was developed based on **colour**. The foreign DNA is inserted inside the coding sequence of the enzyme **β-galactosidase**, which inactivates that gene — again, **insertional inactivation**. With a chromogenic substrate present, a plasmid with **no insert** makes active β-galactosidase and the colony turns **blue**. A plasmid **with an insert** has its β-galactosidase gene broken, makes no colour, and the colony stays **colourless (white)**. So **blue = no insert, white = recombinant** — read straight off the plate by eye.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Bacteria and viruses have known how to push genes into plants and animals for ages, and we simply learned the trick from them. **Agrobacterium tumefaciens**, a pathogen of several dicot plants, naturally delivers a piece of DNA called **T-DNA** that turns normal plant cells into a tumour. Its **tumour-inducing (Ti) plasmid** has been **modified into a cloning vector** that is **no longer pathogenic** but still delivers genes of our interest into plants. In the same way, **retroviruses** — which naturally turn normal animal cells cancerous — have been **disarmed** and are now used to deliver desirable genes into **animal cells**. Once a gene is ligated into a suitable vector, it can be handed off to a bacterial, plant, or animal host, where it multiplies.\n\nNext we look at how the host bacterium is made ‘competent’ so it will actually take the vector up.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "You transform E. coli with a plasmid and spread the cells on a plain nutrient plate with no antibiotic. Colonies grow everywhere — but you have no way of knowing which ones actually took up the plasmid. What single vector feature would have solved this, and why?",
      options: [
        "The origin of replication, because it controls the copy number of the plasmid",
        "A selectable marker such as an antibiotic-resistance gene, because plating on that antibiotic lets only the transformed cells grow, eliminating the non-transformants",
        "The rop gene, because it codes for proteins that carry out replication",
        "A single restriction site, because it makes the foreign DNA easier to ligate",
      ],
      reveal: "Without a way to kill off the cells that didn’t take up the plasmid, every cell grows and you can’t tell transformants from non-transformants. A selectable marker — an antibiotic-resistance gene — fixes this: normal E. coli has no resistance, so plating on that antibiotic wipes out the non-transformants and only plasmid-carrying cells survive. The ori and rop are about replication and copy number, not about identifying which cells took the plasmid up; a single restriction site helps you insert the gene cleanly but does nothing to select the cells afterwards.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember', title: 'Lock These Three In',
      markdown: "- **ori (origin of replication):** where replication starts; also **controls copy number**. No ori, no multiplication of your DNA.\n- **Selectable marker:** usually an **antibiotic-resistance gene**; it **identifies and eliminates non-transformants** so only transformed cells grow.\n- **Insertional inactivation:** inserting foreign DNA **inside a gene** breaks it — used two ways: loss of **tetracycline resistance** in pBR322, and loss of **β-galactosidase** activity (**blue → no insert, white → recombinant**).",
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**pBR322 parts:** carries **ampR** and **tetR** (both selectable markers), an **ori**, the **rop** gene (codes for proteins involved in replication), and restriction sites (Hind III, EcoR I, BamH I, Sal I, Pvu II, Pst I, Cla I). NEET loves to ask what **rop** does — replication proteins — and which gene the **BamH I** site sits in — **tetR**.\n\n**Blue-white colour code:** the gene involved is **β-galactosidase (lacZ)**. **Blue = NO insert (non-recombinant); white/colourless = insert present (recombinant).** Students routinely flip this — memorise it as ‘broken enzyme, no blue colour, so it must be recombinant’.\n\n**Vectors for eukaryotes:** **Ti plasmid** of *Agrobacterium tumefaciens* → **plants**; disarmed **retroviruses** → **animals**.\n\n**Classic NEET question:** \"In pBR322, foreign DNA is ligated at the BamH I site of the tetracycline-resistance gene. On which antibiotic will the recombinants FAIL to grow?\" → **tetracycline** (tetR is inactivated by the insert; ampR stays intact, so they still grow on ampicillin).",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which feature of a cloning vector both starts replication and controls how many copies of the linked DNA are made?',
          options: [
            'The origin of replication (ori)',
            'The selectable marker gene',
            'The BamH I restriction site',
            'The rop gene',
          ],
          correct_index: 0,
          explanation: "The origin of replication (ori) is the sequence where replication starts, and NCERT states it also controls the copy number of the linked DNA. The selectable marker is for identifying transformants, not for replication; a restriction site is just where the foreign DNA is inserted; and rop only codes for proteins involved in replication — it is not the sequence where replication begins.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'In pBR322, foreign DNA is inserted at the BamH I site within the tetracycline-resistance gene. How are the recombinant colonies then identified?',
          options: [
            'They grow on tetracycline but not on ampicillin',
            'They grow on both antibiotics, just like non-recombinants',
            'They fail to grow on either antibiotic',
            'They grow on ampicillin but not on tetracycline, because insertion inactivates tetR',
          ],
          correct_index: 3,
          explanation: "The insert disrupts (inactivates) the tetR gene, so recombinants lose tetracycline resistance while keeping intact ampicillin resistance — they grow on ampicillin but not on tetracycline. Non-recombinants keep both genes intact and grow on both antibiotics, which is exactly why growing-on-both is the wrong choice; and a working plasmid always keeps ampR, so 'fail to grow on either' can't be right.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'In blue-white selection, a bacterial colony appears blue on a plate containing the chromogenic substrate. What does this tell you?',
          options: [
            'The plasmid carries a foreign insert, so it is recombinant',
            'The plasmid has no insert; β-galactosidase is active, so it is non-recombinant',
            'The β-galactosidase gene has been inactivated by the insert',
            'The cell never took up any plasmid at all',
          ],
          correct_index: 1,
          explanation: "A blue colony means β-galactosidase is still active, which happens only when there is NO insert — so a blue colony is non-recombinant. A colony with an insert suffers insertional inactivation of β-galactosidase, makes no colour, and stays white/colourless. The trap is assuming 'colour = success': here it's the opposite — white is the recombinant you want.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: 'Which vector has been modified from a plant pathogen to deliver genes of interest into plant cells?',
          options: [
            'A disarmed retrovirus',
            'The bacteriophage lambda genome',
            'The tumour-inducing (Ti) plasmid of Agrobacterium tumefaciens',
            'The pBR322 plasmid of E. coli',
          ],
          correct_index: 2,
          explanation: "The Ti (tumour-inducing) plasmid of Agrobacterium tumefaciens is the plant pathogen's tool, now modified into a non-pathogenic cloning vector for plants. Disarmed retroviruses are used for animal cells, not plants; pBR322 is an E. coli cloning vector; and bacteriophage genomes are used for cloning in bacteria — none of those is the plant-delivery vehicle NCERT names.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
