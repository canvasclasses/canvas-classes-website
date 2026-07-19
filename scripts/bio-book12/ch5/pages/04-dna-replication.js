'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'dna-replication',
  title: 'DNA Replication — Semiconservative Copying',
  subtitle: "Every time a cell divides it must hand each daughter a full, correct copy of its DNA — and the way it copies keeps one old strand in every new molecule.",
  page_number: 4,
  page_type: 'lesson',
  tags: ['dna-replication', 'semiconservative', 'meselson-stahl', 'molecular-basis-of-inheritance'],
  glossary: [
    { term: 'semiconservative', definition: 'The mode of DNA replication in which each new double helix keeps one parental (old) strand and one newly made strand.' },
    { term: 'replication fork', definition: 'The small Y-shaped opening in the DNA helix where the two strands are separated and new strands are being built. The strands are not unwound over the whole length at once — only within this opening.' },
    { term: 'leading strand', definition: 'The new strand made continuously, because it is built along the template whose polarity runs 3′→5′, matching the polymerase’s only working direction.' },
    { term: 'lagging strand', definition: 'The new strand made discontinuously in short fragments, because its template runs 5′→3′; the fragments are later joined together.' },
    { term: 'DNA polymerase', definition: 'The DNA-dependent DNA polymerase — the main enzyme of replication. It uses a DNA template to join deoxynucleotides, working fast and with high accuracy, only in the 5′→3′ direction.' },
    { term: 'DNA ligase', definition: 'The enzyme that joins the discontinuously synthesised fragments of the lagging strand into one continuous strand.' },
    { term: 'origin of replication', definition: 'The definite region of the DNA where replication begins. Replication does not start randomly anywhere on the molecule.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A DNA double helix splitting apart down the middle, each half glowing as it becomes a template for a new strand',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A long DNA double helix stretched horizontally across the frame, caught mid-way through unzipping: on the left it is still tightly wound as an intact double helix, and as the eye travels right the two strands peel apart into a Y-shaped opening, each separated strand faintly luminous as a fresh partner strand begins to form alongside it. The sense is of one molecule quietly becoming two. Deep, dark background (#0a0a0a base tones) with a single cool blue-violet glow along the nucleic-acid strands, atmospheric and painterly, no text, no labels, no diagram callouts.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: '“The Most Beautiful Experiment in Biology”',
      markdown: "In 1958 two scientists, **Matthew Meselson** and **Franklin Stahl**, settled how DNA copies itself with one clean, elegant experiment on *E. coli*. It was so simple and so decisive that it earned a nickname among biologists — *the most beautiful experiment in biology*. No fancy machines, no guesswork: just heavy nitrogen, light nitrogen, and a spinning tube. By the end of this page you'll see exactly how they proved that every new DNA molecule carries **one old strand and one brand-new one**.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The moment Watson and Crick worked out the double-helix structure, they saw something else in it. In their own 1953 words, the base pairing they proposed “immediately suggests a possible copying mechanism for the genetic material.” Here's the idea. Because A always pairs with T, and G always with C, **each strand already carries the full information needed to rebuild its partner**.\n\nSo to copy the DNA, the two strands simply **separate** and each one acts as a **template** — a mould — for building a new complementary strand. When copying is finished, every DNA molecule ends up with **one parental (old) strand and one newly made strand**. Because each new molecule *conserves* one of the two original strands, this scheme is called **semiconservative** replication. Hold that word: *semi* = half, so half of every new molecule is old.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Proof: Meselson and Stahl',
      objective: "By the end of this you can retell how heavy and light nitrogen were used to show DNA replicates semiconservatively — and what the hybrid band means.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Saying DNA *should* copy semiconservatively is not the same as proving it does. Meselson and Stahl gave the proof.\n\n- **Step 1 — grow bacteria heavy.** They grew *E. coli* for many generations in a medium where the only nitrogen source was **¹⁵NH₄Cl**. ¹⁵N is a **heavy isotope of nitrogen** (not radioactive), so it got built into all the new DNA, making that DNA **heavy**. This heavy DNA can be told apart from normal DNA by spinning it in a **cesium chloride (CsCl) density gradient** — denser DNA settles lower in the tube.\n- **Step 2 — switch them to light.** They then moved the cells into medium with ordinary **¹⁴NH₄Cl** (light nitrogen) and pulled out DNA samples at fixed time intervals as the cells divided.\n- **Step 3 — read the bands.** *E. coli* divides about every 20 minutes. After **one generation (20 min)**, all the DNA had a single **hybrid (intermediate) density** — halfway between heavy and light. That is exactly what you expect if each molecule is one old (heavy) strand plus one new (light) strand. After **two generations (40 min)**, the sample was **equal amounts of hybrid DNA and light DNA**.\n\nThat result can only happen if DNA replicates semiconservatively. A similar experiment on *Vicia faba* (faba bean) chromosomes by Taylor and colleagues in the same year showed chromosomes replicate semiconservatively too. In eukaryotes, this copying happens during the **S phase of the cell cycle**, tightly coordinated with cell division.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'The Machinery at the Fork',
      objective: "By the end of this you can name the key enzymes, say what the fork is, and explain why one new strand is continuous and the other is not.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "Copying that much DNA that fast needs a set of enzymes. The main one is the **DNA-dependent DNA polymerase** — “DNA-dependent” because it reads a DNA template to join up deoxynucleotides. It has to be both blazingly fast and extremely accurate: in *E. coli* the average rate is about **2000 base pairs per second**, and any mistake becomes a mutation.\n\nWhere does the energy come from? From the building blocks themselves. The substrates are **deoxyribonucleoside triphosphates**, and they do **two jobs at once** — they are the raw material *and* the fuel. Their two terminal phosphates are high-energy bonds (just like in ATP), and breaking them powers the polymerisation.\n\nA long DNA molecule cannot be unwound along its whole length at once — that would cost too much energy. So the strands are opened only within a small Y-shaped region called the **replication fork**, and copying happens there. Now the catch: DNA polymerase can build a new strand in **one direction only, 5′→3′**. Because the two template strands run in opposite directions (they are antiparallel), the enzyme handles them differently:\n\n- On the template running **3′→5′**, the new strand is built **continuously** — this is the **leading strand**.\n- On the template running **5′→3′**, the new strand is built **discontinuously**, in short pieces — this is the **lagging strand**. Those pieces are then stitched together by the enzyme **DNA ligase**.\n\nOne more rule: replication does not start just anywhere. It begins at a definite region called the **origin of replication**. (This is exactly why, in genetic engineering, a piece of DNA needs a *vector* to be copied — the vector supplies an origin of replication.)",
    },
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'A replication fork: a double helix opening into a Y, with a continuous leading strand and a fragmented lagging strand being built, and enzymes at work',
      caption: '📸 Tap each dot to explore the replicating fork (Figure 5.8)',
      hotspots: [
        { id: uuid(), x: 0.12, y: 0.50, label: 'Parental strands', icon: 'circle',
          detail: 'The **original double helix** — the two old strands still wound together, waiting their turn to be opened. Each one will serve as a **template** for a new strand.' },
        { id: uuid(), x: 0.30, y: 0.50, label: 'Origin of replication', icon: 'circle',
          detail: 'The **definite region where replication begins**. Copying does not start randomly — it starts here. In recombinant DNA work, a vector must supply this origin for a fragment to be propagated.' },
        { id: uuid(), x: 0.48, y: 0.50, label: 'Replication fork', icon: 'circle',
          detail: 'The small **Y-shaped opening** where the two strands are pulled apart and new strands are built. Only this stretch is unwound at a time — not the whole molecule — because full unwinding would cost too much energy.' },
        { id: uuid(), x: 0.60, y: 0.35, label: 'DNA polymerase', icon: 'circle',
          detail: 'The **DNA-dependent DNA polymerase** joining deoxynucleotides onto the growing strand. It works **only in the 5′→3′ direction**, fast (~2000 bp/sec in *E. coli*) and with high accuracy.' },
        { id: uuid(), x: 0.80, y: 0.30, label: 'Leading strand', icon: 'circle',
          detail: 'Built on the template with **3′→5′ polarity**, so the polymerase can run smoothly toward the fork. This new strand is made in **one continuous piece**.' },
        { id: uuid(), x: 0.80, y: 0.70, label: 'Lagging strand', icon: 'circle',
          detail: 'Built on the template with **5′→3′ polarity**. Because the enzyme can only go 5′→3′, this strand is made **discontinuously, in short fragments** pointing away from the fork.' },
        { id: uuid(), x: 0.92, y: 0.72, label: 'DNA ligase', icon: 'circle',
          detail: 'The **joining enzyme**. It seals the short discontinuous fragments of the lagging strand into **one continuous strand**.' },
      ],
      generation_prompt: "Scientific textbook illustration of a DNA replication fork. Flat 2D educational diagram on a dark background (#0a0a0a near-black). On the left, an intact parental DNA double helix (two intertwined strands drawn as purple nucleic-acid ribbons) opens toward the right into a clear Y-shaped fork. From the fork, two template strands separate: the upper template has a new strand being synthesised as one long continuous line (the leading strand); the lower template has a new strand being synthesised as several short separate segments with small gaps between them (the lagging strand fragments). Small rounded enzyme shapes sit at the fork on each template to represent DNA polymerase, and one enzyme shape sits on the lagging strand joining two fragments to represent DNA ligase. Clean white outlines, thin white leader lines for where labels would go but NO baked-in text, biologically accurate antiparallel arrangement with tiny 5-prime and 3-prime end markers as small ticks. Purple for the DNA strands, soft neutral fill for enzymes. No photorealism, no cartoon, no mascots.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "DNA polymerase can add nucleotides in only one direction, 5′→3′. The two template strands run antiparallel (opposite directions). Given just these two facts, why must one of the two new strands be built in short, discontinuous pieces?",
      options: [
        "Because the cell runs out of deoxyribonucleoside triphosphates halfway along that strand, forcing it to pause",
        "Because that template strand runs 5′→3′, so the polymerase—which can only work 5′→3′—cannot run smoothly toward the fork and must build the new strand in short pieces away from it",
        "Because DNA ligase actively cuts the new strand into fragments so it can proofread each one",
        "Because that strand uses uracil instead of thymine, and uracil forces breaks in the chain",
      ],
      reveal: "The polymerase is one-directional (5′→3′) but the two templates point opposite ways. On the template that runs 3′→5′ the enzyme can follow the fork continuously (leading strand); on the template that runs 5′→3′ it cannot follow the fork, so it lays down short fragments pointing away from it (lagging strand) — that’s the discontinuity. The tempting wrong answer is the ligase one: ligase does the opposite of cutting — it *joins* the fragments. Running out of substrate is not why (the dNTPs are supplied throughout), and uracil belongs to RNA/transcription, not DNA replication.",
      difficulty_level: 3,
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'Lock These In',
      markdown: "- Replication is **semiconservative**: every new DNA molecule = **one old (parental) strand + one new strand**.\n- **Meselson & Stahl** proved it — ¹⁵N → ¹⁴N in *E. coli*, read on a **CsCl density gradient**. One generation → all **hybrid** density; two generations → **half hybrid, half light**.\n- DNA polymerase works **5′→3′ only**. So:\n  - **Leading strand** = template is 3′→5′ → built **continuously**.\n  - **Lagging strand** = template is 5′→3′ → built **discontinuously**, fragments joined by **DNA ligase**.\n- **Deoxyribonucleoside triphosphates** = substrate **and** energy source.\n- Replication starts at the **origin of replication**; in eukaryotes it happens in **S phase**.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Semiconservative vs conservative:** NEET loves the trap that replication is “conservative” (old molecule stays whole, brand-new molecule made separately). It is **semiconservative** — one old strand is kept in *each* new molecule. The single hybrid band after one generation is the killer evidence.\n\n**Leading vs lagging swap:** the most common wrong option flips them. Fix it by the template's polarity, not the new strand — **leading = 3′→5′ template = continuous; lagging = 5′→3′ template = discontinuous.**\n\n**dNTPs do double duty:** deoxyribonucleoside triphosphates are **both substrate and energy source** — a frequent one-liner MCQ.\n\n**Classic NEET question:** “In Meselson and Stahl’s experiment, DNA extracted one generation after transfer from ¹⁵N to ¹⁴N medium showed which density?” → **hybrid / intermediate density.**",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "So the cell copies its entire DNA once, semiconservatively, at a definite start point, using a fast and accurate polymerase and a ligase to tidy up the lagging strand. Copying the whole molecule is one thing — next we'll see how the cell reads out just a *segment* of one strand into RNA, in the process called **transcription**.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'After Meselson and Stahl transferred ¹⁵N-labelled E. coli to ¹⁴N medium and let them divide once, what density did the extracted DNA show?',
          options: [
            'All heavy (¹⁵N) density, because old strands stay together',
            'All light (¹⁴N) density, because both strands are newly made',
            'A single hybrid (intermediate) density',
            'Equal amounts of heavy and light density',
          ],
          correct_index: 2,
          explanation: "After one generation every molecule is one old heavy strand plus one new light strand, giving a single hybrid band — the signature of semiconservative copying. “All heavy” would mean no copying happened; “all light” would mean the old strands were discarded; and the heavy/light mix only appears after two generations, not one.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which statement correctly describes semiconservative replication?',
          options: [
            'Each new DNA molecule has one parental strand and one newly synthesised strand',
            'The whole parental molecule is conserved intact, and a completely new molecule is made alongside it',
            'Both strands of every new molecule are freshly synthesised',
            'The DNA is broken into pieces and reassembled at random',
          ],
          correct_index: 0,
          explanation: "Semiconservative means each daughter molecule keeps one old strand and gains one new one. Option A is the conservative model — the classic NEET trap — which Meselson and Stahl disproved. “Both strands new” is the dispersive/de-novo idea, and “broken and reassembled at random” describes nothing that actually happens.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'On the replication fork, the new strand built continuously is the leading strand. Which template does it use, and why continuous?',
          options: [
            'The 5′→3′ template, so the polymerase runs away from the fork in fragments',
            'Either template, because DNA polymerase works in both directions',
            'The lagging template, later sealed by DNA ligase',
            'The 3′→5′ template, so the polymerase (working 5′→3′) can follow the fork without breaks',
          ],
          correct_index: 3,
          explanation: "The leading strand is made on the 3′→5′ template, letting the 5′→3′-only polymerase track the fork smoothly and continuously. Option A describes the lagging strand (5′→3′ template, discontinuous) — the exact swap NEET tests. DNA polymerase is not bidirectional, and ligase joins fragments on the lagging strand, not the leading one.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: 'In DNA replication, what is the dual role of deoxyribonucleoside triphosphates?',
          options: [
            'They act as the template and also as the origin of replication',
            'They serve as substrates and also provide the energy for polymerisation',
            'They cut the lagging strand and then rejoin it',
            'They unwind the double helix and mark the S phase',
          ],
          correct_index: 1,
          explanation: "Deoxyribonucleoside triphosphates are both the raw material (substrate) and the fuel — their two terminal high-energy phosphates, like ATP’s, power the joining reaction. They are not templates or origins (those are features of the DNA itself), ligase does the joining, and unwinding is a separate step — so every other option misassigns the role.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
