'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-structure-of-dna',
  title: 'The Structure of DNA',
  subtitle: "Take the most famous molecule in biology apart and put it back together — a single nucleotide, a long backbone chain, and finally the two-stranded twisted ladder whose exact dimensions and base pairing NEET asks about every single year.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['dna-structure', 'double-helix', 'watson-crick', 'base-pairing', 'molecular-basis-of-inheritance'],
  glossary: [
    { term: 'nucleotide', definition: 'The building block (monomer) of DNA. It has three parts joined together: a nitrogenous base, a pentose sugar (deoxyribose in DNA), and a phosphate group.' },
    { term: 'nucleoside', definition: 'A nitrogenous base joined to the pentose sugar only (no phosphate yet). The base links to the OH of the 1′ carbon of the sugar through an N-glycosidic linkage. Adding a phosphate turns a nucleoside into a nucleotide.' },
    { term: 'purine', definition: 'A double-ring nitrogenous base. In DNA there are two purines: Adenine (A) and Guanine (G).' },
    { term: 'pyrimidine', definition: 'A single-ring nitrogenous base. In DNA the pyrimidines are Cytosine (C) and Thymine (T). Uracil (U) replaces Thymine in RNA.' },
    { term: 'phosphodiester linkage', definition: 'The 3′–5′ bond that joins one nucleotide to the next, building the sugar-phosphate backbone of the chain.' },
    { term: 'antiparallel', definition: 'The two strands of DNA run in opposite directions. If one strand goes 5′→3′, its partner goes 3′→5′.' },
    { term: "Chargaff's rule", definition: 'In any double-stranded DNA the amount of Adenine equals Thymine, and Guanine equals Cytosine (A = T, G = C). So the A:T ratio and the G:C ratio are each equal to one.' },
    { term: 'pitch', definition: 'The length of one complete turn of the double helix, equal to 3.4 nm. Each turn contains about 10 base pairs, so the rise between two adjacent base pairs is about 0.34 nm.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'An atmospheric ribbon of the DNA double helix twisting up through darkness, rungs of paired bases catching a faint cool light',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single elegant DNA double helix rising diagonally through the frame — two smooth twisting sugar-phosphate ribbons winding around each other in a right-handed spiral, with faint horizontal rungs (the paired bases) bridging them like ladder steps. Low-key dramatic side lighting rakes across the curves of the twist, catching soft highlights on the ribbon edges while the rest of the molecule falls into deep shadow. Painterly, atmospheric, molecular-illustration mood rather than clinical; cool blue-violet and pale silver tones suggesting nucleic acid, set against an overall very dark background (#0a0a0a base tones). No text, no labels, no leader lines, no measurement callouts, no diagram annotations.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'Two Metres of Thread in a Speck of a Nucleus',
      markdown: "Line up all the base pairs in a single human cell and multiply by the tiny **0.34 nm** gap between them, and the DNA double helix works out to roughly **2.2 metres long** — over two metres of thread. Yet it is folded into a nucleus only about **a millionth of a metre (10⁻⁶ m)** across. That is like stuffing a two-kilometre-long rope into a tennis ball. The molecule you are about to study is astonishingly thin, astonishingly long, and packed away with incredible precision.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "DNA is a **long polymer of deoxyribonucleotides**. To understand the whole molecule, start with one link of the chain — a single **nucleotide**. A nucleotide has **three components**: a **nitrogenous base**, a **pentose sugar** (this is **deoxyribose** in DNA), and a **phosphate group**.\n\nThe nitrogenous bases come in two families. The **purines** are **Adenine (A)** and **Guanine (G)**; the **pyrimidines** are **Cytosine (C)** and **Thymine (T)**. (In RNA, Uracil takes the place of Thymine.)\n\nNow assemble the pieces:\n- The base joins the **OH of the 1′ carbon** of the sugar through an **N-glycosidic linkage** — this gives a **nucleoside** (like adenosine, guanosine).\n- A **phosphate** then attaches to the **OH of the 5′ carbon** of the nucleoside through a **phosphoester linkage** — now it is a **nucleotide**.\n- Two nucleotides link through a **3′–5′ phosphodiester linkage**, and joining many of them this way builds a **polynucleotide chain**.\n\nThe **backbone** of this chain is made only of the **sugar and phosphate** units; the **nitrogenous bases project out from the backbone**. And the chain has direction: one end carries a **free phosphate on the 5′ carbon** (the **5′-end**), the other end a **free OH on the 3′ carbon** (the **3′-end**). Keep those two ends in mind — they are what make the two strands fit together the way they do.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 3, title: 'Purines vs Pyrimidines',
      columns: [
        { heading: 'Purines', points: [
          'Bases: **Adenine (A)** and **Guanine (G)**',
          'Double-ring structure (bigger base)',
          'A purine always pairs **opposite a pyrimidine**',
          'Adenine pairs with Thymine (a pyrimidine)',
        ] },
        { heading: 'Pyrimidines', points: [
          'Bases in DNA: **Cytosine (C)** and **Thymine (T)**',
          'Single-ring structure (smaller base)',
          'In RNA, **Uracil** replaces Thymine',
          'Cytosine pairs with Guanine (a purine)',
        ] },
      ],
    },
    {
      id: uuid(), type: 'heading', order: 4, level: 2,
      text: 'The Watson-Crick Double Helix',
      objective: "By the end of this you can list the five salient features of the double helix and recite its exact dimensions from memory — the numbers NEET lifts straight off the page.",
    },
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "DNA was first isolated from the nucleus by **Friedrich Meischer in 1869**, who called it **'Nuclein'**. But its shape stayed a mystery until **1953**, when **James Watson and Francis Crick** — using the **X-ray diffraction data of Maurice Wilkins and Rosalind Franklin** — proposed the famous **Double Helix** model. They leaned on one crucial clue from **Erwin Chargaff**: in double-stranded DNA the ratio of **Adenine to Thymine** and of **Guanine to Cytosine** is always constant and equal to one.\n\nHere are the **five salient features** of the double helix:\n\n1. It is made of **two polynucleotide chains**, with a **sugar-phosphate backbone** and the **bases projecting inside**.\n2. The two chains are **antiparallel** — if one runs 5′→3′, the other runs 3′→5′.\n3. The bases pair through **hydrogen bonds**: **Adenine forms two H-bonds with Thymine (A = T)**, and **Guanine forms three H-bonds with Cytosine (G ≡ C)**. Because a **purine always sits opposite a pyrimidine**, the distance between the two strands stays uniform.\n4. The two chains coil in a **right-handed** fashion. The **pitch** (one full turn) is **3.4 nm**, there are about **10 base pairs per turn**, so the **rise between adjacent base pairs is about 0.34 nm**. The helix is about **2 nm wide** (uniform diameter).\n5. The flat plane of one base pair **stacks over** the next — this stacking, on top of the H-bonds, is what gives the helix its stability.\n\nThat base pairing does something remarkable: it makes the two strands **complementary**. Know the sequence of one strand and you can predict the other exactly — the very property that lets DNA copy itself. Let us look at the whole molecule laid out.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 6, src: '',
      alt: 'Double-stranded DNA helix drawn as a twisted ladder, showing the two antiparallel sugar-phosphate backbones, A=T base pairs with two hydrogen bonds and G≡C base pairs with three hydrogen bonds, the labelled 5′ and 3′ ends, the 3.4 nm pitch of one turn, and the 2 nm width',
      caption: '📸 Tap each dot to explore the DNA double helix (Figure 5.2)',
      generation_prompt: "Scientific textbook illustration of the DNA double helix shown as a twisted ladder (based on NCERT Figure 5.2). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Draw two parallel sugar-phosphate backbones as smooth ribbons winding in a right-handed spiral down the frame, with horizontal rungs connecting them. Each rung is a base pair: draw some rungs as two thin parallel connecting lines (representing an Adenine–Thymine pair held by two hydrogen bonds) and others as three thin parallel connecting lines (a Guanine–Cytosine pair held by three hydrogen bonds), so the difference in bond number is visible. Label geometry with clean measurement brackets: mark one full turn of the helix as its pitch (a vertical span), and show the narrow uniform width across the helix. Mark the top of the left backbone as one polarity end and the bottom as the opposite. Clean white outlines, biologically accurate proportions, functional colours (purple/violet for the nucleic-acid bases, pale silver-blue for the sugar-phosphate backbone ribbons). No baked-in text labels, no numbers, no leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.24, y: 0.5, label: 'Sugar-phosphate backbone', icon: 'circle',
          detail: 'The **outer rails** of the ladder, built only from **deoxyribose sugar and phosphate** joined by **3′–5′ phosphodiester linkages**. The bases hang off this backbone and point **inward**.' },
        { id: uuid(), x: 0.5, y: 0.31, label: 'A = T pair (2 H-bonds)', icon: 'circle',
          detail: '**Adenine pairs with Thymine** across the two strands, held by **exactly two hydrogen bonds**. A is a purine, T is a pyrimidine — a big base opposite a small one.' },
        { id: uuid(), x: 0.5, y: 0.62, label: 'G ≡ C pair (3 H-bonds)', icon: 'circle',
          detail: '**Guanine pairs with Cytosine**, held by **three hydrogen bonds** — one more than A–T. That extra bond is why G–C-rich DNA is harder to pull apart.' },
        { id: uuid(), x: 0.2, y: 0.06, label: "5′ end", icon: 'circle',
          detail: 'The end with a **free phosphate group on the 5′ carbon** of the sugar. Because the strands are **antiparallel**, the 5′ end of one strand lies beside the 3′ end of the other.' },
        { id: uuid(), x: 0.2, y: 0.94, label: "3′ end", icon: 'circle',
          detail: 'The end with a **free OH group on the 3′ carbon** of the sugar. Its partner strand ends in a 5′ phosphate here — opposite polarity, side by side.' },
        { id: uuid(), x: 0.86, y: 0.5, label: 'Pitch = 3.4 nm (one turn)', icon: 'circle',
          detail: 'One complete right-handed **turn** of the helix spans **3.4 nm** and contains about **10 base pairs**. So the **rise between two adjacent base pairs is about 0.34 nm** (3.4 nm ÷ 10).' },
        { id: uuid(), x: 0.5, y: 0.5, label: 'Diameter ≈ 2 nm', icon: 'circle',
          detail: 'The helix is a **uniform ~2 nm wide** all along its length. Pairing a **purine opposite a pyrimidine** every time keeps the distance between the two backbones constant.' },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 7, reasoning_type: 'logical',
      prompt: "When DNA is slowly heated, its two strands separate. A stretch of DNA that is rich in Guanine and Cytosine needs a higher temperature to separate than a stretch rich in Adenine and Thymine. Why?",
      options: [
        "A G–C pair is held by three hydrogen bonds while an A–T pair has only two, so G–C-rich DNA is harder to pull apart",
        "An A–T pair is held by three hydrogen bonds while a G–C pair has only two",
        "Guanine and Cytosine are both purines, which makes the pair heavier and harder to separate",
        "G–C pairs are joined by phosphodiester bonds, which are stronger than the hydrogen bonds in A–T pairs",
      ],
      reveal: "**G–C pairs carry three hydrogen bonds, A–T pairs carry two.** More bonds per pair means more energy (heat) is needed to break them, so G–C-rich DNA is more stable to heating. The tempting trap is the last option — it confuses two different bonds: **phosphodiester bonds** hold nucleotides *along the backbone*, while it is the **hydrogen bonds** that hold the *two strands together across the rungs*. Option 3 is also wrong on the facts: Guanine is a purine but **Cytosine is a pyrimidine**, and a purine always pairs with a pyrimidine.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 8, variant: 'remember', title: 'The Numbers and Rules You Must Not Get Wrong',
      markdown: "- **Base pairing:** **A = T (two H-bonds)**, **G ≡ C (three H-bonds)**. Always a **purine opposite a pyrimidine**.\n- **Chargaff's rule:** in double-stranded DNA, **A = T** and **G = C**, so the A:T and G:C ratios each equal **one**.\n- **Pitch (one turn) = 3.4 nm**; **~10 base pairs per turn**; **rise between adjacent bp ≈ 0.34 nm**; **diameter ≈ 2 nm**.\n- **Right-handed** coil, **two antiparallel** strands (5′→3′ opposite 3′→5′).\n- **Backbone** = sugar + phosphate; **bases project inward**.\n- Stability comes from **hydrogen bonds + base stacking**.",
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**H-bond counts are the #1 trap:** NEET loves to flip them. Lock it in — **A–T = 2 bonds, G–C = 3 bonds.** An option saying 'A pairs with T by three H-bonds' is wrong.\n\n**The dimensions are lifted verbatim:** **3.4 nm pitch, 10 bp per turn, 0.34 nm rise, 2 nm diameter.** Watch the swap between **3.4 nm (a whole turn)** and **0.34 nm (one step)** — that single decimal place is a favourite distractor.\n\n**Chargaff sums:** if a question gives you 20% Cytosine, then G = 20%, so A + T = 60%, meaning **A = T = 30%**. Practise that arithmetic.\n\n**Credit lines get asked:** Watson & Crick (1953) built on **Wilkins and Franklin's X-ray data** and **Chargaff's** base ratios.\n\n**Classic NEET question:** \"Guanine pairs with Cytosine through how many hydrogen bonds?\" → **Three.** Next up we follow this same base pairing as DNA makes a copy of itself — replication.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 10, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'How many hydrogen bonds hold a Guanine–Cytosine base pair together in DNA?',
          options: [
            'One',
            'Two',
            'Three',
            'Four',
          ],
          correct_index: 2,
          explanation: "Guanine pairs with Cytosine through three hydrogen bonds (G ≡ C), one more than the two bonds of an Adenine–Thymine pair. The tempting wrong answer is 'Two' — that is the A–T count, and NEET routinely swaps the two pairs to see if you have them memorised.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'In the Watson-Crick double helix, the distance (rise) between two adjacent base pairs is approximately:',
          options: [
            '0.34 nm',
            '3.4 nm',
            '2 nm',
            '20 nm',
          ],
          correct_index: 0,
          explanation: "One full turn (the pitch) is 3.4 nm and contains about 10 base pairs, so each adjacent pair is spaced 3.4 ÷ 10 = 0.34 nm apart. The classic trap is '3.4 nm' — that is the length of a whole turn, not the gap between two bases. The single decimal place is the whole test here.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: "According to Chargaff's rule for a double-stranded DNA molecule, which relationship is always true?",
          options: [
            'A = G and T = C',
            'A + T = G + C in every DNA',
            'A + G = T + C only in RNA',
            'A = T and G = C',
          ],
          correct_index: 3,
          explanation: "Chargaff found that Adenine equals Thymine and Guanine equals Cytosine, because A always pairs with T and G always pairs with C. The trap 'A = G and T = C' pairs up the wrong bases (a purine with a purine); base pairing is always a purine with its complementary pyrimidine, not purine-with-purine.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which statement about the two strands of a DNA double helix is correct?',
          options: [
            'Both strands run in the same 5′→3′ direction (parallel)',
            'The strands are antiparallel — one runs 5′→3′ while the other runs 3′→5′',
            'The nitrogenous bases form the outer backbone of each strand',
            'The two strands are coiled in a left-handed fashion',
          ],
          correct_index: 1,
          explanation: "The two chains have antiparallel polarity: if one runs 5′→3′, its partner runs 3′→5′. The other options each break a salient feature — the backbone is made of sugar and phosphate (the bases project inward, not outward), and the helix is right-handed, not left-handed.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
