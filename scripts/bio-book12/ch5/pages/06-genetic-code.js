'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-genetic-code',
  title: 'The Genetic Code',
  subtitle: "A four-letter language that spells out every protein — read three letters at a time, with a fixed dictionary of 64 words that is almost the same in every living thing.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['genetic-code', 'codon', 'molecular-basis-of-inheritance', 'translation'],
  glossary: [
    { term: 'codon', definition: 'A group of three bases in mRNA that stands for one amino acid (or a start/stop signal). It is the "word" of the genetic code.' },
    { term: 'triplet code', definition: 'The rule that three bases are read together to specify one amino acid. Three bases from a four-letter alphabet give 4 × 4 × 4 = 64 possible codons.' },
    { term: 'degenerate code', definition: 'The feature that one amino acid can be coded by more than one codon. The code is redundant, but this does not cause confusion.' },
    { term: 'unambiguous', definition: 'The feature that one codon codes for one — and only one — amino acid. A codon never has two meanings.' },
    { term: 'universal', definition: 'The feature that a given codon means the same amino acid in nearly every organism, from bacteria to humans. A few exceptions occur in mitochondria and some protozoans.' },
    { term: 'start codon', definition: 'AUG, the codon that signals the beginning of translation. It also codes for the amino acid methionine, so it has a dual role.' },
    { term: 'stop codon', definition: 'One of the three codons — UAA, UAG, UGA — that codes for no amino acid and signals the end of translation. Also called a terminator codon.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A long luminous strand of mRNA stretching across a dark scene, its coloured bases grouped into glowing three-letter clusters being read one triplet at a time',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single long ribbon of single-stranded messenger RNA sweeps horizontally across a deep near-black scene (#0a0a0a base tones), drawn as a smooth strand of coloured beads representing the four bases (soft purple, teal, amber, rose). Along the strand the beads are visibly clustered into evenly spaced groups of three, each triplet glowing a little brighter than the gaps between them, so the eye reads the strand as a chain of three-letter words. Toward one end a soft focus of light suggests a molecular machine beginning to move along the strand, reading it left to right. Painterly, atmospheric, quietly scientific illustration style, warm rim-light tying the composition together, no text, no letters, no labels, no diagram callouts.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Only Four Letters, and Every Word Is Three Long',
      markdown: "The whole of life is written in an alphabet of just **four letters** — the bases A, U, G and C in mRNA. Yet from those four letters the cell has to spell out **20 different amino acids** to build every protein you are made of. How do you say twenty things with four letters? You read them in **three-letter words**. Group the bases in threes and four letters suddenly give you **4 × 4 × 4 = 64** possible words — far more than enough. That three-letter word is a **codon**, and the full set of rules linking codons to amino acids is the **genetic code**.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Replication and transcription are easy to picture, because in both a nucleic acid is copied into another nucleic acid using **base complementarity** — A pairs with T, G with C. Translation is different, and this is the puzzle. In translation the cell reads a chain of **nucleotides** and builds a chain of **amino acids**. But there is **no complementarity between a nucleotide and an amino acid** — you cannot pair them the way you pair two bases. So how does the base sequence decide the amino acid sequence?\n\nThe answer had to be a **code**: a set of rules that says which run of bases stands for which amino acid. It was **George Gamow**, a physicist, who reasoned it out on paper first. With only 4 bases to code for 20 amino acids, a **single** base per amino acid gives just 4 choices, and **two** bases give only 16 — still short of 20. So the code, he argued, must use **three bases** per amino acid. It was a bold guess: three bases give 64 codons, many more than the 20 needed. That surplus turned out to be real, and it explains several features of the code you are about to meet.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'How the Code Was Cracked',
      objective: "By the end of this you can name the three scientists who deciphered the code and say exactly what each one contributed.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Guessing that the code was a triplet was one thing; **proving** it and reading off which codon meant which amino acid was far harder. It took scientists from several fields, and three names carry the credit in NCERT:\n\n- **Har Gobind Khorana** developed the **chemical method** to build RNA molecules with **defined, known combinations of bases** — repeating homopolymers and copolymers. If you know exactly which bases are in your RNA, you can see which amino acid it produces.\n- **Marshall Nirenberg** built a **cell-free system for protein synthesis** — protein-making machinery in a test tube. Feeding Khorana's defined RNAs into it finally let the code be read, codon by codon.\n- **Severo Ochoa's enzyme**, **polynucleotide phosphorylase**, was also helpful: it could **polymerise RNA with defined sequences** in a template-independent way, giving another supply of known RNAs to test.\n\nPut together, this work filled in a **checkerboard** (a table) that assigns each of the 64 codons to its amino acid or to a stop signal."
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'The Salient Features of the Code',
      objective: "By the end of this you can list the defining features of the genetic code and give a one-line example of each — the exact set NEET tests.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Once the checkerboard was complete, the code showed a small set of clear properties. These are the lines NEET lifts almost word for word, so read each one for its **meaning**, not just its name. Notice how two of them — degenerate and unambiguous — sound like opposites but are not: one codon still means exactly one amino acid, even though one amino acid may be reachable by several codons.",
    },
    {
      id: uuid(), type: 'table', order: 7,
      caption: '📸 The salient features of the genetic code — feature, what it means, and a worked example',
      headers: ['Feature', 'What it means', 'Example'],
      rows: [
        ['Triplet', 'Three bases are read together to code one amino acid. This gives 4 × 4 × 4 = 64 codons; 61 code for amino acids and 3 do not.', 'The 64 codons cover all 20 amino acids with plenty to spare.'],
        ['Degenerate (redundant)', 'One amino acid can be coded by more than one codon — a direct result of having 64 codons for only 20 amino acids.', 'Both UUU and UUC code for phenylalanine.'],
        ['Unambiguous & specific', 'One codon codes for one — and only one — amino acid. A codon never has two meanings.', 'AUG always means methionine, never anything else.'],
        ['Commaless (contiguous)', 'The codons are read continuously in mRNA, with no punctuation or gaps between them.', '–AUG UUU UUC– is read straight through, three bases at a time.'],
        ['Nearly universal', 'A codon means the same amino acid in almost every organism. A few exceptions exist in mitochondrial codons and in some protozoans.', 'UUU codes for phenylalanine in bacteria and in humans alike.'],
        ['Start codon (dual role)', 'AUG signals the start of translation and also codes for an amino acid.', 'AUG = initiator codon and also codes for methionine (Met).'],
        ['Stop codons', 'Three codons code for no amino acid; they terminate translation.', 'UAA, UAG and UGA are the three stop (terminator) codons.'],
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "Before any experiment was done, Gamow argued on pure counting that the code could not be shorter than a certain length. With 4 bases coding for 20 amino acids, what is the shortest code that can possibly work, and why?",
      options: [
        "A singlet code — one base per amino acid, giving 4 possibilities",
        "A doublet code — two bases per amino acid, giving 16 possibilities",
        "A triplet code — three bases per amino acid, giving 64 possibilities, the smallest that can cover all 20 amino acids",
        "A quadruplet code — four bases per amino acid, giving 256 possibilities, the smallest that can cover 20 amino acids",
      ],
      reveal: "You need at least 20 different words. A singlet gives only 4 words and a doublet gives 4 × 4 = 16 — still short of 20, so both fail. A triplet gives 4 × 4 × 4 = 64, which comfortably covers 20, and it is the *shortest* length that reaches at least 20 — that is why the code is a triplet. The doublet is the tempting trap: 16 feels close to 20, but close is not enough, and the code cannot use a fraction of a base. A quadruplet would work too, but it is not the shortest, so it is wasteful and wrong here.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: "Lock These In",
      markdown: "- **Start codon: AUG.** It has a **dual role** — it begins translation *and* codes for **methionine (Met)**.\n- **Stop codons: UAA, UAG, UGA.** Three of them, and they code for **no** amino acid. (A memory hook: **U** Are **A**way, **U** Are **G**one, **U** **G**o **A**way.)\n- **Degenerate ≠ ambiguous.** Degenerate means *one amino acid → several codons*. Unambiguous means *one codon → exactly one amino acid*. Both are true at the same time — that is the whole trick.\n- **64 codons total:** **61** code for amino acids, **3** are stop codons.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Degenerate vs unambiguous:** NEET's favourite trap is to define one and label it the other. *Degenerate* = one amino acid coded by more than one codon. *Unambiguous* = one codon codes one amino acid only. If an option says \"one codon can code for several amino acids,\" that is false — that would be an *ambiguous* code, which the genetic code is not.\n\n**AUG's dual role:** remember it is both the **start** codon **and** the codon for **methionine**. Options that call AUG a stop codon are wrong.\n\n**The three stop codons** (UAA, UAG, UGA) are pure memory marks. Watch for options that sneak AUG into the stop set.\n\n**Classic NEET question:** \"The genetic code is degenerate because — \" → **some amino acids are coded by more than one codon.**",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "So the code is a triplet, degenerate, unambiguous, commaless, nearly universal, and marked off by AUG at the start and UAA/UAG/UGA at the end. There is one more question worth asking: if the code is read in fixed three-letter words, what happens when a single base is added or lost? That is where **mutations** rewrite the message — and how the cell physically reads a codon and hands over the right amino acid, using **tRNA as an adapter**, is the story of the next page.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'The genetic code is described as degenerate. What does this mean?',
          options: [
            'One codon can code for more than one amino acid, depending on the cell',
            'More than one codon can code for the same amino acid',
            'Each codon codes for exactly one amino acid and no codon is shared',
            'The codons are read with gaps and punctuation between them',
          ],
          correct_index: 1,
          explanation: "Degenerate means the code is redundant: an amino acid may be specified by several different codons (for example UUU and UUC both give phenylalanine). Option 1 describes an *ambiguous* code — one codon with several meanings — which the genetic code is not. Option 3 describes unambiguity, a different feature, and option 4 describes the commaless property.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Which single codon signals the start of translation and also codes for the amino acid methionine?',
          options: ['AUG', 'UAA', 'UGA', 'UAG'],
          correct_index: 0,
          explanation: "AUG has a dual role — it is the initiator (start) codon and it codes for methionine. The other three (UAA, UGA, UAG) are the stop codons, which code for no amino acid, so none of them can be a start signal.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'Which group lists the three stop (terminator) codons correctly?',
          options: [
            'AUG, UAA, UAG',
            'UUU, UUC, UUA',
            'UAA, UAG, UGA',
            'UGA, UAG, AUG',
          ],
          correct_index: 2,
          explanation: "The three stop codons are UAA, UAG and UGA, and none of them codes for an amino acid. The other options each smuggle in a coding codon — AUG (start / methionine) appears in two of them, and UUU/UUC/UUA code for amino acids, so those sets are wrong.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'The genetic code is said to be unambiguous. Which statement captures exactly what that guarantees?',
          options: [
            'Each amino acid is always coded by only a single codon',
            'The codons can be read in overlapping reading frames',
            'The code differs from one organism to another',
            'One codon codes for one — and only one — amino acid',
          ],
          correct_index: 3,
          explanation: "Unambiguous means a codon has a single fixed meaning: it codes for one and only one amino acid. Option 1 is false and actually contradicts degeneracy (an amino acid may have several codons). Option 2 is wrong because the code is read continuously, not in overlapping frames, and option 3 describes the opposite of universality.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
