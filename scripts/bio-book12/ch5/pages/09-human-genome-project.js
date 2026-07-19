'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-human-genome-project',
  title: 'The Human Genome Project',
  subtitle: "In 1990 scientists set out to read every letter of human DNA — 3 billion of them. Thirteen years later they finished, and a few of the numbers they found still surprise students today.",
  page_number: 9,
  page_type: 'lesson',
  tags: ['human-genome-project', 'hgp', 'genome-sequencing', 'bioinformatics', 'molecular-basis-of-inheritance'],
  glossary: [
    { term: 'Human Genome Project (HGP)', definition: "A mega project, launched in 1990 and completed in 2003, that set out to read the complete DNA sequence of a human being — all roughly 3 billion base pairs." },
    { term: 'genome', definition: "The complete set of DNA — every base of every chromosome — carried by an organism." },
    { term: 'Expressed Sequence Tags (ESTs)', definition: "One HGP approach that focused only on the genes that are actually expressed as RNA, tagging the working parts of the genome rather than every base." },
    { term: 'Sequence Annotation', definition: "The other HGP approach — first sequence the whole genome (coding and non-coding alike), then go back and assign a function to each region." },
    { term: 'BAC and YAC', definition: "Specialised vectors used to clone DNA fragments during sequencing — BAC = Bacterial Artificial Chromosome (host: bacteria), YAC = Yeast Artificial Chromosome (host: yeast)." },
    { term: 'Bioinformatics', definition: "The new area of biology, developed alongside HGP, that uses high-speed computers to store, retrieve and analyse the enormous amount of sequence data." },
    { term: 'SNP (single nucleotide polymorphism)', definition: "A single spot in the DNA where one base differs between people; pronounced 'snip'. About 1.4 million such locations were identified in humans." },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A vast dark archive where a single glowing DNA double helix unspools into endless streaming ladders of coloured base letters',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A vast, cathedral-like dark archive at night, deep shadows, dark overall background (#0a0a0a base tones). At the centre a single luminous DNA double helix rises and slowly unspools into long ribbons of glowing base-pair rungs that stream outward into the darkness like pages of light, suggesting an unimaginable amount of data being read letter by letter. Faint rows of shelving and soft pools of blue-green light recede into the distance. Painterly, atmospheric, awe-inspiring, scholarly mood. No readable text, no letters, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Big Surprise',
      markdown: "Before the project finished, scientists guessed a human would need somewhere between **80,000 and 140,000 genes** to build something as complex as us. The real answer stunned everyone: only about **30,000 genes** — barely more than a tiny worm. And here's the second jolt — **less than 2% of your entire genome actually codes for proteins**. The other 98%-plus does other jobs, or jobs we still don't fully understand.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The genetic make-up of any person lies in their **DNA sequence** — the exact order of bases along the chromosomes. If two people differ in some way, their DNA must differ somewhere too. That simple idea led to a bold question: could we read out the **complete DNA sequence of a human being**?\n\nBy 1990 two things had come together — genetic engineering could now isolate and clone any piece of DNA, and fast techniques existed for reading DNA sequences. So a hugely ambitious project was launched: the **Human Genome Project (HGP)**, rightly called a **mega project**. Think about the scale. The human genome has about **3 × 10⁹ base pairs**, and at the starting cost of about **US $3 per base pair**, the bill came to roughly **9 billion US dollars**. If you typed the sequence from a single cell into books of 1000 pages each holding 1000 letters, you would fill about **3300 books**. Handling that much data needed high-speed computers — which is why HGP grew hand-in-hand with a brand-new field called **Bioinformatics**.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Goals, and How They Actually Did It',
      objective: "By the end of this you can state what HGP set out to do, and describe the two sequencing approaches plus the vectors and machines that made it possible.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **goals** of HGP were to identify all the genes in human DNA (then estimated at 20,000–25,000), work out the sequence of all **3 billion base pairs**, store it in databases, build better tools to analyse it, pass the technology on to other sectors, and address the **ethical, legal and social issues (ELSI)** the work would raise. It was a **13-year project**, coordinated by the U.S. Department of Energy and the National Institute of Health, with the Wellcome Trust (U.K.) as a major partner and help from Japan, France, Germany, China and others. It was **completed in 2003**.\n\nNow the method. There were **two major approaches**. One focused only on the parts of the genome that are actually **expressed as RNA** — these tags are called **Expressed Sequence Tags (ESTs)**. The other took a blind, thorough route: sequence the **whole genome**, coding and non-coding alike, and only afterwards assign a function to each region — this is **Sequence Annotation**.\n\nDNA is far too long to sequence in one go, so the total DNA from a cell was chopped into **small random fragments**. Each fragment was **cloned** inside a host to make many copies (this amplification is what made it readable), using special vectors called **BAC** (Bacterial Artificial Chromosomes, in bacteria) and **YAC** (Yeast Artificial Chromosomes, in yeast). The fragments were then read on **automated DNA sequencers** built on the principle of the method developed by **Frederick Sanger**. Finally the short reads were joined back together using their **overlapping regions** — a job impossible for humans by hand, so specialised computer programs stitched and annotated the sequence and assigned it to each chromosome.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'What They Found — The Salient Features',
      objective: "By the end of this you can recall the headline numbers of the human genome, which NEET lifts almost word-for-word from NCERT.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "When the sequence was finally read, a handful of **salient observations** stood out — and these are the exact facts NEET asks about. The genome turned out to hold **3164.7 million base pairs**. The **average gene** is about 3000 bases, but sizes vary wildly — the largest known human gene, **dystrophin**, runs to 2.4 million bases. Genes number roughly **30,000**, far fewer than the old guess of 80,000–140,000, and an amazing **99.9%** of bases are exactly the same in every human being. We still don't know what over **50%** of the discovered genes do, and **less than 2%** of the genome codes for proteins. A very large part is made of **repetitive sequences** — stretches repeated hundreds to thousands of times, with no direct coding job, but which reveal a lot about chromosome structure and evolution. **Chromosome 1** carries the **most** genes (2968) and the **Y** chromosome the **fewest** (231). And about **1.4 million** spots were found where a single base differs between people — the **SNPs**.",
    },
    {
      id: uuid(), type: 'table', order: 7,
      caption: 'Salient features of the human genome — the exact figures from HGP (NCERT §5.9.1)',
      headers: ['Finding', 'Number'],
      rows: [
        ['Total size of the human genome', '3164.7 million base pairs'],
        ['Average size of a gene', '3000 bases (largest = dystrophin, 2.4 million bases)'],
        ['Estimated total number of genes', 'About 30,000 (earlier guess: 80,000–140,000)'],
        ['Bases identical in all humans', '99.9%'],
        ['Genes whose function is still unknown', 'Over 50%'],
        ['Portion of the genome that codes for proteins', 'Less than 2%'],
        ['Chromosome with the most genes', 'Chromosome 1 (2968 genes)'],
        ['Chromosome with the fewest genes', 'Y chromosome (231 genes)'],
        ['Single-base difference sites (SNPs) identified', 'About 1.4 million'],
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "If 99.9% of the DNA bases are exactly the same in every human on Earth, why do scientists get so excited about the roughly 1.4 million SNPs — the tiny 0.1% where people differ by a single base?",
      options: [
        "Those 1.4 million sites are the only places where genes are found, so they hold all the useful information",
        "That small set of single-base differences is exactly what makes each person unique, and mapping it helps find the chromosomal locations of disease-linked sequences and trace human history",
        "SNPs are the repetitive sequences, which make up most of the genome and code for most proteins",
        "The 99.9% that is identical is junk DNA, so only the 0.1% is ever transcribed or copied",
      ],
      reveal: "Because everyone shares 99.9% of their sequence, the interesting biology of individual difference lives almost entirely in that 0.1% — the SNPs. NCERT says this information promises to revolutionise the finding of chromosomal locations for disease-associated sequences and the tracing of human history. Option 1 is wrong: genes are spread across the genome, not confined to SNP sites. Option 3 confuses two separate ideas — SNPs are single-base differences, not the repetitive sequences, and less than 2% of the genome codes for proteins. Option 4 invents a 'junk vs transcribed' split that NCERT never makes; the shared 99.9% is still normal, functioning DNA.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: "Lock In These Numbers",
      markdown: "- **Launched 1990, completed 2003** — a **13-year** mega project (US Dept. of Energy + NIH).\n- Genome size = **3164.7 million bp**; about **30,000 genes** (not the old 80,000–140,000).\n- **99.9%** of bases are the same in all humans; **less than 2%** codes for proteins.\n- **Over 50%** of discovered genes have unknown function.\n- **Chromosome 1 = most genes (2968)**; **Y = fewest (231)**.\n- About **1.4 million SNPs** (single-base differences) identified.\n- Two approaches: **ESTs** (only expressed genes) vs **Sequence Annotation** (whole genome, then assign function). Vectors: **BAC** (bacteria) and **YAC** (yeast). Sequencers built on **Sanger's** method. New field born: **Bioinformatics**.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**The numbers are the whole game here.** NEET rarely asks you to explain HGP — it asks you to pick the *right figure*. Memorise them exactly, because the distractors are always near-misses.\n\n**Genome size:** it is **3164.7 million bp**, not a round 3 billion — the decimal figure is the one they test.\n\n**Most vs fewest genes:** **Chromosome 1 has the most (2968)**, the **Y has the fewest (231)**. Swapping these, or naming chromosome 21/22, is the standard trap.\n\n**ESTs vs Sequence Annotation:** ESTs = only the **expressed (RNA-forming) genes**; Sequence Annotation = **whole genome first, function later**. Don't mix them up.\n\n**Classic NEET question:** \"What percentage of the human genome codes for proteins?\" → **less than 2%**. (The tempting wrong answer is 99.9%, which is the *identical-across-humans* figure, not the coding figure.)",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "So HGP handed us the full text of the human genome — and in doing so, it showed that the real treasure of individual difference sits in those 1.4 million single-base SNPs and the repetitive stretches scattered through the DNA. That very idea — that our repeated sequences vary from person to person — is the key that unlocks the next tool: **DNA fingerprinting**, where we head next.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: "What is the total size of the human genome as reported by the Human Genome Project?",
          options: [
            "About 30,000 million base pairs",
            "3164.7 million base pairs",
            "Exactly 9 billion base pairs",
            "1.4 million base pairs",
          ],
          correct_index: 1,
          explanation: "NCERT gives the figure precisely as 3164.7 million base pairs. Option 1 confuses the base-pair count with the roughly 30,000 gene count. The 9 billion figure is the estimated cost in US dollars, not a base-pair number, and 1.4 million is the number of SNP sites — both are classic swapped-number traps.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: "Which chromosome carries the most genes, and which carries the fewest?",
          options: [
            "Y chromosome has the most (2968); Chromosome 1 has the fewest (231)",
            "Chromosome 21 has the most; the X chromosome has the fewest",
            "Chromosome 1 has the most (2968); the Y chromosome has the fewest (231)",
            "The X chromosome has the most; Chromosome 1 has the fewest",
          ],
          correct_index: 2,
          explanation: "HGP found Chromosome 1 packed with the most genes (2968) and the Y chromosome with the fewest (231). Option 1 is the exact reversal — the number-swap NEET loves. Options 2 and 4 bring in the X and chromosome 21, which NCERT never names for this fact, so they are distractors built from plausible-sounding but wrong chromosomes.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "According to HGP, what fraction of the human genome actually codes for proteins?",
          options: [
            "Less than 2%",
            "About 99.9%",
            "Over 50%",
            "Roughly 30%",
          ],
          correct_index: 0,
          explanation: "Less than 2% of the genome codes for proteins — most of it is non-coding, including large amounts of repetitive DNA. The 99.9% figure is the tempting trap: that is the percentage of bases that are identical between all humans, not the coding fraction. 'Over 50%' is the fraction of genes with unknown function, again a different HGP statistic reused as a distractor.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "The two major methodological approaches used in HGP were:",
          options: [
            "Cloning in BAC vectors versus cloning in YAC vectors",
            "The Sanger method versus the bioinformatics method",
            "Identifying repetitive sequences versus identifying SNPs",
            "Expressed Sequence Tags (ESTs) versus Sequence Annotation",
          ],
          correct_index: 3,
          explanation: "The two approaches were ESTs — sequencing only the genes expressed as RNA — and Sequence Annotation — sequencing the whole genome and assigning functions afterwards. Option 1 names two vectors, which are tools used within sequencing, not the two overall approaches. Option 2 mixes a sequencing method (Sanger) with a data field (bioinformatics), and option 3 lists two types of findings, not methods.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
