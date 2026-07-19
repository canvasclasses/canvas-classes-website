'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'restriction-enzymes-the-molecular-scissors',
  title: 'Molecular Scissors — Restriction Enzymes',
  subtitle: "How a bacterium's own defence enzyme became the tool that cuts DNA at an exact spot and leaves matching 'sticky ends' that any two pieces can be joined by.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['restriction-enzymes', 'recombinant-dna-technology', 'sticky-ends', 'biotechnology-tools'],
  glossary: [
    { term: 'restriction enzyme', definition: 'An enzyme that cuts DNA only at a specific recognition sequence. The full name is restriction endonuclease. It is one of the key tools of recombinant DNA technology.' },
    { term: 'nuclease', definition: 'The larger class of enzymes that cut DNA. Nucleases come in two kinds — exonucleases and endonucleases.' },
    { term: 'exonuclease', definition: 'A nuclease that removes nucleotides from the ends of a DNA molecule.' },
    { term: 'endonuclease', definition: 'A nuclease that makes cuts at specific positions within a DNA molecule, not at its ends. Restriction enzymes are endonucleases.' },
    { term: 'recognition sequence', definition: 'The specific short sequence of base pairs (usually six) that a restriction enzyme inspects the DNA for and binds to before cutting.' },
    { term: 'palindromic sequence', definition: 'A stretch of DNA whose base sequence reads the same on both strands when the direction of reading is kept the same (e.g. 5\'-GAATTC-3\'). Restriction enzymes recognise palindromic sequences.' },
    { term: 'sticky ends', definition: 'The short single-stranded overhangs left when a restriction enzyme cuts away from the centre of a palindrome. They pair with complementary overhangs, which lets DNA ligase join the pieces.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A DNA double helix being snipped by a pair of glowing molecular scissors, with the cut ends splaying open into single-stranded overhangs',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A long DNA double helix stretched horizontally across a dark scene, rendered in cool blues and violets, its two twisting strands clearly visible. At the centre, the helix is caught mid-cut — the two backbones sliced a little apart from each other so the strands splay open into short single-stranded overhangs on either side, hinting at 'sticky ends'. A subtle suggestion of a precise molecular tool at the cut point, like faint scissor-blade forms of light closing on the exact spot, never a literal cartoon pair of scissors. In the soft background, out of focus, a single rod-shaped bacterium glows faintly to hint that this enzyme came from bacteria. Painterly, atmospheric, deep dusk lighting, dark background overall (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: "The Enzyme Was a Bacterium's Own Weapon",
      markdown: "Restriction enzymes weren't invented in a lab — bacteria already had them. When a virus (a bacteriophage) tries to inject its DNA into *Escherichia coli*, the bacterium fights back by **cutting the invading DNA to pieces**. In 1963 the two enzymes behind this defence were isolated: one added methyl groups to protect the bacterium's own DNA, and the other did the cutting. That cutter was named the **restriction endonuclease** — it *restricts* the growth of the phage. We simply borrowed the bacterium's weapon and turned it into the scissors of genetic engineering.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "To build recombinant DNA you first need a way to cut DNA at an exact, predictable spot — not just anywhere. That job belongs to the **restriction enzymes**, the **'molecular scissors'** of the toolkit. The first one whose cutting depended on a specific DNA sequence, **Hind II**, was worked out five years after the enzymes were discovered. It was found to always cut a DNA molecule at a particular point, by recognising a specific sequence of **six base pairs**. That six-base stretch is its **recognition sequence**.\n\nHind II was just the beginning. Today we know of **more than 900 restriction enzymes**, isolated from over **230 strains of bacteria**, and each one recognises a *different* recognition sequence. So they are not one blunt tool — they are a whole set of scissors, each keyed to its own short address on the DNA.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Nucleases: Cutting From the Ends vs Cutting Within',
      objective: "By the end of this you can place a restriction enzyme correctly on the family tree of nucleases — and never confuse an exonuclease with an endonuclease.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Restriction enzymes belong to a larger family called **nucleases** — enzymes that cut DNA. Nucleases come in **two kinds**, and NEET tests the difference constantly:\n\n- **Exonucleases** remove nucleotides **from the ends** of a DNA molecule — they nibble inward from the tips.\n- **Endonucleases** make cuts **at specific positions within** the DNA — they cut in the middle, not the ends.\n\nA restriction enzyme is an **endonuclease** — hence its full name, **restriction endonuclease**. It doesn't chew from the ends. Instead it 'inspects' the length of a DNA molecule, and once it finds *its own* recognition sequence, it binds to the DNA and cuts **each of the two strands** of the double helix at a specific point in their **sugar-phosphate backbones**. Everything a restriction enzyme does hangs on this one behaviour: read the sequence, then cut inside it.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Palindromes, Sticky Ends, and How Enzymes Get Their Names',
      objective: "By the end of this you can explain what a DNA palindrome is, why the cut leaves single-stranded overhangs, and decode a name like EcoRI.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Every restriction endonuclease recognises a **palindromic** nucleotide sequence. In everyday language a palindrome is a word that reads the same forwards and backwards, like *MALAYALAM*. In DNA the idea is a little different: a palindrome is a sequence of base pairs that **reads the same on both strands when the direction of reading is kept the same**. Take EcoRI's site:\n\n```\n5' —— G A A T T C —— 3'\n3' —— C T T A A G —— 5'\n```\n\nRead the top strand 5'→3' and you get GAATTC. Read the bottom strand *its* 5'→3' way and you also get GAATTC. Same sequence on both strands — that is a DNA palindrome.\n\nNow the clever part. Restriction enzymes cut the strand **a little away from the centre** of the palindrome, but **between the same two bases on the opposite strands**. Because the two cuts are offset — not straight across from each other — each fragment is left with a short **single-stranded stretch hanging off its end**. These overhangs are the famous **sticky ends**. They are called 'sticky' because they can form **hydrogen bonds** with a complementary cut end, and that stickiness is exactly what lets **DNA ligase** paste two pieces together later.\n\nThe names look cryptic but follow a rule. The **first letter** comes from the **genus**, the **next two letters** from the **species** of the bacterium it was isolated from. So **EcoRI** comes from *Escherichia coli* strain **RY13** — 'E' for *Escherichia*, 'co' for *coli*, 'R' from the strain, and the **Roman numeral I** shows it was the **first** enzyme isolated from that strain.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'EcoRI cutting the palindromic sequence GAATTC / CTTAAG a little away from the centre, leaving AATT single-stranded sticky ends on both fragments',
      caption: '📸 Tap each dot to explore how EcoRI cuts the palindrome and leaves sticky ends (Figure 9.2)',
      hotspots: [
        { id: uuid(), x: 0.50, y: 0.30, label: 'Palindromic recognition sequence (GAATTC)', icon: 'circle',
          detail: 'The six base pairs **5\'-GAATTC-3\'** on top and **3\'-CTTAAG-5\'** below. It reads the same on both strands in the 5\'→3\' direction — a **DNA palindrome**. EcoRI binds here and nowhere else.' },
        { id: uuid(), x: 0.36, y: 0.50, label: 'Cut site — between G and A', icon: 'circle',
          detail: 'EcoRI cuts **a little away from the centre**, between **G and A**, on *each* strand. Because the two cuts are offset rather than straight across, the ends come apart unevenly.' },
        { id: uuid(), x: 0.66, y: 0.50, label: 'Sticky end (single-stranded overhang)', icon: 'circle',
          detail: 'The offset cut leaves a short **single-stranded overhang** — here the exposed bases **AATT** — hanging off each fragment. This is a **sticky end**, so named because it can form hydrogen bonds with a matching overhang.' },
        { id: uuid(), x: 0.50, y: 0.18, label: 'Top strand (5\'→3\')', icon: 'circle',
          detail: 'One of the **two strands** of the double helix. EcoRI cuts this strand at one point in its **sugar-phosphate backbone**; it cuts the other strand at the mirror point.' },
        { id: uuid(), x: 0.50, y: 0.82, label: 'Bottom strand (3\'→5\', complementary)', icon: 'circle',
          detail: 'The **complementary strand**, carrying CTTAAG. Cut between the same two bases (G and A) but on the opposite strand — the offset between the two cuts is what creates the overhangs.' },
      ],
      generation_prompt: "Scientific textbook illustration of EcoRI cutting a DNA palindrome. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Show a short horizontal DNA double helix drawn as two straight parallel strands (purple = nucleic acid) with the bases written between them. Top strand reads 5'-G A A T T C-3' left to right, bottom strand reads 3'-C T T A A G-5', shown as a ladder with rungs between complementary bases. Draw two staggered cut marks: on the top strand a clean break between the G and the first A on the left, and on the bottom strand a matching offset break between the G and the first A on the right, so the cuts are NOT straight across from each other. Below or beside it, show the result: the two DNA fragments pulled apart, each with a short overhanging single-stranded stretch of four bases (AATT / TTAA) sticking out — the sticky ends. Clean white outlines and thin white leader-line space (but NO baked-in text labels), biologically accurate ladder proportions. No photorealism, no cartoon, no mascots, standard biology textbook illustration conventions.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "You want to insert a human gene into a plasmid vector so the two join tightly. You cut the human DNA with EcoRI. To cut the plasmid, which enzyme should you use — and why?",
      options: [
        "EcoRI as well, because cutting both with the same enzyme gives both pieces the same complementary sticky ends",
        "Any restriction enzyme, since all restriction enzymes leave the same kind of sticky ends",
        "An exonuclease, because it will trim the ends of the plasmid so the gene fits",
        "A different restriction enzyme, so the plasmid gets its own unique sticky ends",
      ],
      reveal: "Cut both the human DNA and the plasmid with the **same** enzyme, EcoRI, so both carry the **same complementary sticky ends** (AATT overhangs). Only then can the overhangs pair by hydrogen bonding and let DNA ligase seal the joint. Option two is the classic trap: different restriction enzymes cut different palindromes and leave *different* overhangs, so their sticky ends would not match. A different enzyme (option four) would give mismatched ends that cannot pair, and an exonuclease would chew the ends away rather than create a matching overhang.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'Lock These Three In',
      markdown: "- **Palindrome in DNA** = reads the **same on both strands** in the 5'→3' direction (e.g. **GAATTC / CTTAAG**). Not the same as a word-palindrome.\n- **Sticky ends** = the **single-stranded overhangs** left because the enzyme cuts **away from the centre**, between the same two bases on opposite strands. They form **hydrogen bonds** with complementary ends, so **DNA ligase** can join the pieces.\n- **Naming:** first letter = **genus**, next two = **species**, then strain, then a **Roman numeral** for the order isolated. **EcoRI** = ***E**scherichia **co**li* strain **R**Y13, **I** = first isolated.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Exonuclease vs endonuclease:** exonuclease removes nucleotides **from the ends**; endonuclease cuts **within** the DNA. Restriction enzymes are **endonucleases** — a swapped definition here is the single most common trap.\n\n**Palindrome:** the enzyme recognises a **palindromic** sequence and cuts **a little away from the centre** (not exactly at it) to leave sticky ends. NEET likes the option that says it cuts 'exactly at the centre' — that's wrong.\n\n**Same enzyme, matching ends:** vector and foreign DNA must be cut by the **same** restriction enzyme to get **complementary** sticky ends that ligase can join.\n\n**Classic NEET question:** \"EcoRI is isolated from which organism, and the Roman numeral I stands for what?\" → ***Escherichia coli* RY13; I means it was the first restriction enzyme isolated from that strain.**",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "So the scissors are ready: a restriction enzyme reads its palindrome, cuts both strands off-centre, and leaves matching sticky ends on every fragment. But cut DNA on its own goes nowhere — it needs something to carry it into a host cell and multiply it. That carrier is the **cloning vector**, which we meet on the next page.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which statement correctly describes the two kinds of nucleases?',
          options: [
            'Exonucleases cut within the DNA; endonucleases remove nucleotides from the ends',
            'Both exonucleases and endonucleases only cut at the ends of the DNA',
            'Exonucleases remove nucleotides from the ends; endonucleases make cuts at specific positions within the DNA',
            'Endonucleases add nucleotides to the DNA; exonucleases cut within it',
          ],
          correct_index: 2,
          explanation: "Exonucleases work from the ends, removing nucleotides one from a tip; endonucleases cut at specific internal positions. The tempting distractor simply swaps the two definitions — a favourite NEET trick. Restriction enzymes are endonucleases, so they cut within the molecule, and no nuclease adds nucleotides.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "Why is 5'-GAATTC-3' called a palindromic sequence in DNA?",
          options: [
            'It reads the same on both strands when each is read in the 5\'→3\' direction',
            'It is made only of the bases A and T, which are symmetrical',
            'It reads the same forwards and backwards along a single strand',
            'It is exactly six base pairs long, and all six-base sequences are palindromes',
          ],
          correct_index: 0,
          explanation: "A DNA palindrome reads the same on the two strands when the reading direction is kept the same: GAATTC on the top strand equals GAATTC on the bottom strand read 5'→3'. Option three describes a word-palindrome (same along one strand), which NCERT explicitly contrasts with the DNA case. Base content and length alone do not make a sequence palindromic.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: 'Sticky ends are produced because a restriction enzyme cuts the DNA in what way?',
          options: [
            'Exactly at the centre of the palindrome, straight across both strands',
            'A little away from the centre of the palindrome, between the same two bases on opposite strands',
            'At the very ends of the DNA molecule, trimming both tips',
            'At random positions, wherever the two strands happen to separate',
          ],
          correct_index: 1,
          explanation: "The enzyme cuts a little away from the centre, between the same two bases on the opposite strands, so the two offset cuts leave single-stranded overhangs — the sticky ends. A cut exactly at the centre, straight across, would give blunt ends with no overhang. Trimming the tips is what an exonuclease does, and restriction enzymes are anything but random — they cut only at their recognition sequence.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'In the name EcoRI, what does the letter set and the Roman numeral tell you?',
          options: [
            "'Eco' names the strain and 'I' names the recognition sequence GAATTC",
            "'E' is the species and 'co' is the genus; 'I' means it cuts once",
            "'E' is the genus Escherichia, 'co' the species coli, and I means it was the first enzyme isolated from that strain",
            "'Eco' means it is eco-friendly and I means it works at pH 1",
          ],
          correct_index: 2,
          explanation: "The first letter is the genus (Escherichia), the next two are the species (coli), the R is from the strain RY13, and the Roman numeral I marks it as the first restriction enzyme isolated from that strain. The Roman numeral is about order of isolation, not the recognition sequence or the number of cuts, and the letters come from the organism's name, not any eco-friendly property.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
