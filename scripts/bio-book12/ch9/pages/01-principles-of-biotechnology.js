'use strict';
/**
 * Class 12 Biology — Chapter 9: Biotechnology — Principles and Processes
 * Page 1 (lesson) — The Two Big Ideas Behind Biotechnology.
 *
 * Source of truth: NCERT Class 12 Ch.9 (lebo109.txt) §9.1 "Principles of
 * Biotechnology" + the chapter opening (definition of biotechnology, EFB
 * definition) and the Cohen–Boyer first-recombinant-DNA account. Rule 0:
 * every fact, name, number and sequence here traces to that text; nothing
 * invented, no coaching-book additions.
 *
 * Scope is deliberately narrow — just the two core techniques (genetic
 * engineering + bioprocess engineering) and the story of the first artificial
 * recombinant DNA. The tools (restriction enzymes, vectors, gel) and the full
 * rDNA process belong to later pages of this chapter.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'principles-of-biotechnology',
  title: 'The Two Big Ideas Behind Biotechnology',
  subtitle: "Biotechnology stands on two techniques — one that rewrites an organism's genes, and one that grows only the microbe you want, cleanly and in bulk. Here is how both were born.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['biotechnology-principles-and-processes', 'biotechnology', 'genetic-engineering', 'recombinant-dna'],
  glossary: [
    { term: 'biotechnology', definition: 'The set of techniques that use live organisms or enzymes from organisms to make products and processes useful to humans. In its modern, restricted sense it means using genetically modified organisms to do this on a large scale.' },
    { term: 'genetic engineering', definition: 'Techniques that alter the chemistry of the genetic material (DNA and RNA) and introduce it into a host organism to change the host’s phenotype.' },
    { term: 'recombinant DNA', definition: 'A new combination of DNA created in the lab (in vitro) by joining a piece of foreign DNA to a vector, forming a circular, self-replicating molecule.' },
    { term: 'plasmid', definition: 'A small, circular, extra-chromosomal piece of DNA in some bacteria that replicates on its own, independently of the main chromosome. Used as a vehicle (vector) to carry foreign DNA into a host.' },
    { term: 'bioprocess engineering', definition: 'Maintaining a sterile, contamination-free environment in chemical-engineering processes so that only the desired microbe or cell grows, in large quantities, to manufacture products like antibiotics, vaccines and enzymes.' },
    { term: 'restriction enzyme', definition: 'A ‘molecular scissors’ enzyme that cuts DNA at a specific location, letting scientists isolate a chosen piece of DNA.' },
    { term: 'DNA ligase', definition: 'The enzyme that acts on cut DNA molecules and joins their ends together, sealing a foreign gene into a vector.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single glowing bacterial cell at the centre of a dark laboratory scene, a faint circular ring of DNA visible inside it, warm light pooling around it',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single bacterial cell rendered as a soft translucent capsule sitting just right of centre in a dark laboratory setting, lit by low warm golden light. Inside the cell, a faint circular loop of DNA (a plasmid) glows gently as a thin luminous ring, hinting at genetic material without any labels. Around it the frame falls away into deep out-of-focus darkness with a few soft cool highlights suggesting glassware and culture flasks on the left. Painterly and atmospheric, deep dusk-lab lighting, dark background tones overall (#0a0a0a base), naturalistic, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Conversation In Hawaii That Started An Industry',
      markdown: "In **1972**, two scientists — **Stanley Cohen** and **Herbert Boyer** — did something that had never been done. They took a plasmid from the bacterium *Salmonella typhimurium*, cut out a gene that gives resistance to an antibiotic, stitched it into another plasmid, and slipped the result into the gut bacterium *E. coli*. That new, hand-built loop of DNA was the **first artificial recombinant DNA molecule** — and the discipline of biotechnology was founded on it. The whole idea grew out of an ordinary conversation between the two men at a meeting in Hawaii.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Strip away the jargon and **biotechnology** means one simple thing: using **live organisms, or enzymes taken from organisms, to make products and processes useful to us.** By that broad meaning, making curd, bread or wine — all done by microbes — would count as biotechnology too. But today the word is used in a tighter sense. It refers to processes that use **genetically modified organisms** to do the job on a much larger scale, plus a handful of newer techniques: making a ‘test-tube’ baby by in vitro fertilisation, synthesising a gene, building a DNA vaccine, or correcting a defective gene.\n\nSo the everyday products of biotechnology reach your health and your food. But how does the field actually work? The whole thing rests on just **two core techniques** — get these two ideas and the rest of the chapter clicks into place.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Two Techniques That Gave Birth To Biotechnology',
      objective: 'By the end of this you can state, in plain words, what genetic engineering does and what bioprocess engineering does — and why you need both.',
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**1. Genetic engineering.** These are the techniques that **alter the chemistry of the genetic material — DNA and RNA — and then introduce it into a host organism, changing the host’s phenotype.** Why bother? Think about ordinary breeding. Traditional hybridisation, the kind used in plant and animal breeding, very often drags **undesirable genes** along with the desirable ones — you get the trait you wanted plus baggage you didn't. Genetic engineering — by creating **recombinant DNA**, and using gene cloning and gene transfer — lets us pick out and introduce **only the one gene (or set of genes) we actually want**, and nothing else.\n\n**2. Bioprocess engineering.** Making a new gene is only half the battle. To turn it into real quantities of a product — an **antibiotic, a vaccine, an enzyme** — you have to grow the modified microbe or cell in huge amounts without anything else creeping in. Bioprocess engineering is the **maintenance of a sterile, contamination-free environment** in chemical-engineering processes, so that **only the desired microbe or eukaryotic cell grows, in large quantities.** One technique writes the recipe; the other cooks it at scale.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Building The First Recombinant DNA, Step By Step',
      objective: 'By the end of this you can retrace exactly how Cohen and Boyer cut, joined and copied a gene to make the first recombinant DNA.',
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "First, a puzzle NCERT poses: what happens to a piece of DNA dropped into an alien organism? On its own, **it cannot multiply** — the progeny cells simply won't copy it. It survives and multiplies only if it becomes part of a structure that already knows how to replicate. Every chromosome carries a special sequence called the **origin of replication**, the spot where copying begins. So the trick is to **link the alien DNA to an origin of replication** — then it can replicate and make many identical copies. That is exactly what **cloning** means: making multiple identical copies of a template DNA.\n\nNow the historic experiment. Cohen and Boyer wanted to join a gene for **antibiotic resistance** to a **native plasmid** — a small, circular, self-replicating piece of extra-chromosomal DNA — from *Salmonella typhimurium*. Here is what they did:\n\n- They **cut out** the antibiotic-resistance gene from a plasmid using **restriction enzymes**, the ‘molecular scissors’ that snip DNA at specific spots.\n- They **linked** that cut piece into the plasmid DNA. A plasmid works as a **vector** — a carrier — just as a mosquito is an insect vector that ferries the malarial parasite into humans; the plasmid ferries foreign DNA into a host.\n- The joining was sealed by the enzyme **DNA ligase**, which acts on cut DNA molecules and joins their ends. The result — a brand-new circular, self-replicating DNA made in vitro — is **recombinant DNA**.\n- Finally they transferred this into ***E. coli***, a bacterium closely related to *Salmonella*. There it replicated using the host’s own **DNA polymerase** and churned out **multiple copies** — the antibiotic-resistance gene had been **cloned in E. coli**.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'Diagram of making the first recombinant DNA: a foreign gene cut from a plasmid by a restriction enzyme, ligated into a vector plasmid, and transferred into an E. coli cell',
      caption: '📸 Tap each dot to walk through how the first recombinant DNA was built (NCERT Fig 9.1)',
      generation_prompt: "Scientific textbook illustration of the construction of the first recombinant DNA molecule. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Left side: a circular plasmid (a smooth closed purple ring representing DNA) with a short highlighted segment marked as a foreign gene in a contrasting colour (green), and a small pair of inward-pointing arrows on the ring indicating a restriction-enzyme cut site. A curved arrow leads rightward. Middle: the same ring now shown opened/linearised with the small green foreign-gene fragment separated out, and a second larger vector plasmid ring (purple) also shown opened at a cut site, the two brought together so their ends meet, with a small labelled point where the ends are being joined. Another curved arrow leads to a completed single recombinant plasmid — a closed purple ring now carrying the green foreign-gene segment inset into it. Final stage on the right: a rod-shaped bacterial cell (E. coli), drawn as a pale capsule outline, with the recombinant plasmid placed inside it. Clean white outlines throughout, purple for nucleic-acid rings, green for the foreign gene, biologically accurate proportions, no text or labels baked into the image itself, no photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.13, y: 0.40, label: 'Plasmid', icon: 'circle',
          detail: 'A small **circular, self-replicating piece of DNA** found free in the cytoplasm of some bacteria, separate from the main chromosome. Here a native plasmid supplies the antibiotic-resistance gene.' },
        { id: uuid(), x: 0.24, y: 0.68, label: 'Restriction site', icon: 'circle',
          detail: 'The specific spot where a **restriction enzyme** — the ‘molecular scissors’ — cuts the DNA. Cutting at a chosen location is what lets you release exactly the gene you want.' },
        { id: uuid(), x: 0.34, y: 0.30, label: 'Foreign gene', icon: 'circle',
          detail: 'The **antibiotic-resistance gene** cut out from the *Salmonella* plasmid. This is the piece of DNA that will be carried into a new host.' },
        { id: uuid(), x: 0.55, y: 0.52, label: 'Ligase joining', icon: 'circle',
          detail: 'The enzyme **DNA ligase** acts on the cut DNA molecules and **joins their ends**, sealing the foreign gene into the vector plasmid.' },
        { id: uuid(), x: 0.72, y: 0.35, label: 'Recombinant plasmid', icon: 'circle',
          detail: 'The finished **recombinant DNA** — a new circular, self-replicating molecule made in vitro, now carrying the foreign gene inside the vector.' },
        { id: uuid(), x: 0.88, y: 0.62, label: 'E. coli host', icon: 'circle',
          detail: '***Escherichia coli***, closely related to *Salmonella*. Inside it, the recombinant plasmid replicates using the host’s **DNA polymerase** and makes many copies — the gene has been **cloned**.' },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "A factory grows genetically modified E. coli in a huge tank to make an antibiotic. Midway, a stray mould gets in and starts growing alongside the bacteria. Using the definition of bioprocess engineering, why is this a disaster for the batch?",
      options: [
        'The mould speeds up the bacteria, so the antibiotic is made too fast to collect',
        'Bioprocess engineering needs a sterile, contamination-free environment so only the desired microbe grows; a contaminant means the tank is no longer producing only the wanted product in pure, large quantity',
        'The mould rewrites the recombinant DNA inside the bacteria and changes its phenotype',
        'Contamination is harmless at large scale because the desired microbe always outnumbers any intruder',
      ],
      correct_index: 1,
      reveal: "**Bioprocess engineering is defined as maintaining a sterile, contamination-free environment so that only the desired microbe or cell grows in large quantities.** A stray mould breaks exactly that condition — now the tank is growing something other than the intended organism, so the product is no longer pure or reliably in bulk, and the batch is ruined. The tempting wrong answer is the third one: it confuses the two techniques. Rewriting DNA to change phenotype is **genetic engineering**, not a thing a contaminant does — bioprocess engineering is only about keeping the growth clean and large-scale.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'The Two Pillars — Lock These In',
      markdown: "- **Biotechnology** = using **live organisms or their enzymes** to make useful products/processes; in the modern sense, using **genetically modified organisms** at large scale.\n- **Genetic engineering** = techniques that **alter the chemistry of DNA/RNA and introduce it into a host** to change the host’s **phenotype**. It lets you add *only the desired gene*, avoiding the undesirable genes that ordinary hybridisation drags along.\n- **Bioprocess engineering** = keeping a **sterile, contamination-free environment** so **only the desired microbe/cell grows in large quantities** (for antibiotics, vaccines, enzymes).\n- **First recombinant DNA:** **Cohen & Boyer, 1972** — antibiotic-resistance gene from a *Salmonella typhimurium* plasmid, cut with a **restriction enzyme**, joined by **DNA ligase** into a plasmid vector, then cloned in ***E. coli***.\n- Alien DNA multiplies in a host only if linked to an **origin of replication**.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Genetic vs bioprocess engineering:** NEET loves swapping these definitions. **Genetic engineering = altering DNA/RNA + introducing into a host to change phenotype. Bioprocess engineering = sterile ambience so only the desired microbe grows in bulk.** If a definition mentions ‘sterile’ or ‘contamination-free’, it is bioprocess engineering.\n\n**The 1972 facts are lifted verbatim:** the first rDNA used an **antibiotic-resistance gene**, a **plasmid of *Salmonella typhimurium***, **DNA ligase** to join, and ***E. coli*** as the host — memorise each name exactly.\n\n**Origin of replication** is the reason a foreign gene needs a vector at all — without it, the DNA can’t multiply in the host.\n\n**Classic NEET question:** “The two core techniques that enabled the birth of modern biotechnology are — ?” → **genetic engineering and bioprocess (chemical) engineering.**",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "So biotechnology rests on two legs: engineering the gene, and engineering the clean, large-scale growth that turns that gene into a product. To actually cut, join and move DNA the way Cohen and Boyer did, you need a specific toolkit — restriction enzymes, vectors, and a host. That toolkit is exactly what the next page opens up.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which pair correctly names the two core techniques at the heart of modern biotechnology?',
          options: [
            'Tissue culture and hybridisation',
            'Fermentation and pasteurisation',
            'Genetic engineering and bioprocess engineering',
            'Gene sequencing and vaccination',
          ],
          correct_index: 2,
          explanation: "NCERT names exactly two core techniques: **genetic engineering** (altering DNA/RNA and putting it into a host) and **bioprocess engineering** (sterile, large-scale growth). Fermentation and hybridisation are older, broader processes and are not the pair NCERT singles out — the classic trap is picking a familiar-sounding pair like fermentation/pasteurisation instead of the two the chapter actually defines.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'In building the first recombinant DNA, which enzyme joined the antibiotic-resistance gene to the plasmid vector?',
          options: [
            'DNA ligase',
            'A restriction enzyme',
            'DNA polymerase',
            'Exonuclease',
          ],
          correct_index: 0,
          explanation: "**DNA ligase** acts on cut DNA molecules and **joins their ends**, sealing the gene into the plasmid. The tempting distractor is the restriction enzyme — but that one does the opposite job: it **cuts** the DNA out. DNA polymerase copies the DNA once it is inside E. coli, and exonucleases chew nucleotides from DNA ends; neither joins the two pieces.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Why can a foreign piece of DNA multiply inside a host cell only after it is linked to an origin of replication?',
          options: [
            'The origin of replication supplies the energy the DNA needs to copy itself',
            'The origin of replication changes the phenotype of the host so it accepts the DNA',
            'Without it the DNA is destroyed instantly by the host’s enzymes',
            'The origin of replication is the specific sequence where copying begins, so only DNA carrying it gets replicated and passed to progeny cells',
          ],
          correct_index: 3,
          explanation: "The **origin of replication** is the specific sequence that **initiates replication**; DNA that lacks it simply isn’t copied and is lost from the progeny cells. That is why alien DNA must be linked to a structure carrying this sequence — for example a plasmid — before it can multiply. It is not about supplying energy or altering phenotype, and NCERT says the unintegrated DNA fails to multiply, not that it is destroyed instantly.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: 'Bioprocess engineering is best described as which of the following?',
          options: [
            'Altering the chemistry of DNA and RNA and introducing it into a host organism',
            'Maintaining a sterile, contamination-free environment so only the desired microbe or cell grows in large quantities',
            'Cutting DNA at specific sites using molecular scissors',
            'Joining two cut DNA fragments into a single recombinant molecule',
          ],
          correct_index: 1,
          explanation: "Bioprocess engineering is defined by the **sterile, contamination-free environment** that lets **only the desired microbe/cell grow in bulk** — the manufacturing side of biotechnology. Option 1 is the definition of **genetic engineering** (the classic swap NEET sets up), while cutting DNA (restriction enzymes) and joining DNA (ligase) are individual molecular steps, not the meaning of bioprocess engineering.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
