'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'isolating-cutting-and-amplifying-dna',
  title: 'Isolating, Cutting & Amplifying DNA (PCR)',
  subtitle: "Before you can engineer a gene you must first get clean DNA out of the cell, cut it at the right spot, and make a billion copies of it — this page walks through those first three steps.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['recombinant-dna-technology', 'pcr', 'dna-isolation', 'biotechnology-principles-and-processes'],
  glossary: [
    { term: 'lysozyme', definition: 'An enzyme used to break open bacterial cells so the DNA inside can be released. Cellulase does the same job for plant cells, and chitinase for fungal cells.' },
    { term: 'PCR', definition: 'Polymerase Chain Reaction — a lab method that synthesises many copies of a chosen gene or DNA segment in vitro (outside the cell), using primers and DNA polymerase.' },
    { term: 'denaturation', definition: 'The first step of a PCR cycle, where heat separates the double-stranded DNA into two single strands.' },
    { term: 'annealing', definition: 'The second step of a PCR cycle, where two primers bind (base-pair) to the single-stranded DNA at the regions flanking the target.' },
    { term: 'extension', definition: 'The third step of a PCR cycle, where DNA polymerase adds nucleotides onto each primer, using the template strand to build a new complementary strand.' },
    { term: 'primer', definition: 'A short, chemically synthesised oligonucleotide (a small stretch of DNA) that is complementary to a region of the target DNA and gives the polymerase a starting point.' },
    { term: 'Taq polymerase', definition: 'A thermostable (heat-resistant) DNA polymerase isolated from the bacterium Thermus aquaticus. It stays active through the high-temperature denaturation step, which is why it is used in PCR.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single glowing strand of DNA lifted on a fine glass rod out of a beaker, drawn upward into a bright thermal cycler where it multiplies into countless copies',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). On the left, a laboratory beaker holds a pale suspension from which delicate, thread-like strands of DNA are being lifted and spooled onto a thin glass rod, faintly luminous. As the eye travels right, that single strand flows toward a softly glowing chamber where it appears to multiply into a dense field of many identical faint strands, suggesting one molecule becoming a billion. Deep, dark background (#0a0a0a base tones) with cool purple-violet glows on the nucleic-acid strands and a warm amber glow where amplification happens. Atmospheric and painterly, no text, no labels, no diagram callouts.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'One Molecule Into a Billion',
      markdown: "Start with a single copy of a gene. Run one small reaction. A few hours later you can be holding roughly **one billion copies** of that exact stretch of DNA. That is what **PCR** does — it amplifies a chosen DNA segment to about a **billion times** its starting amount, all in a tiny tube, no living cell required. This one trick is why modern genetic engineering, disease testing and DNA fingerprinting are even possible. By the end of this page you'll know the three repeating steps that pull it off.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Recombinant DNA technology is not one single act — it is a fixed **sequence of steps**: isolate the DNA, cut it with restriction enzymes, pull out the gene you want, join it into a vector, push that into a host, and finally grow the host to harvest the product. This page covers the **first three steps** — getting the DNA out, cutting it, and copying it.\n\nThe genetic material of almost every organism is **DNA**, and it sits locked inside the cell, wrapped in membranes and tangled up with proteins called **histones**. To cut DNA with restriction enzymes, you first need it in **pure form**, free of every other large molecule. So step one is simply: **break the cell open and clean the DNA up.**",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Step 1 — Isolating the Genetic Material',
      objective: "By the end of this you can name the enzyme used to open each type of cell and explain how the purified DNA is finally made visible as fine threads.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The DNA is enclosed within membranes, so the cell must be **broken open** to release it — along with everything else inside: RNA, proteins, polysaccharides and lipids. Which enzyme you use to break the cell depends on the kind of cell:\n\n- **Lysozyme** — for **bacteria**\n- **Cellulase** — for **plant** cells\n- **Chitinase** — for **fungal** cells\n\nOnce the cell is open, the DNA is still mixed with all the other molecules, so those have to go. **RNA is removed by treating with ribonuclease (RNase)**, and **proteins are removed by treating with protease**. Other molecules are cleared by their own appropriate treatments.\n\nWhat's left is purified DNA — but it's still dissolved in the suspension. To bring it out, you add **chilled ethanol**. The DNA is not soluble in ethanol, so it **precipitates out**, and it becomes visible as a collection of **fine threads** in the suspension. Those threads can be spooled out onto a rod. That is your starting material.",
    },
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'Step 2 & 3 — Cutting the DNA, Then Copying It',
      objective: "By the end of this you can explain how a cut is checked on a gel, and list the three steps of one PCR cycle in order.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "**Cutting.** With pure DNA in hand, you **incubate it with a restriction enzyme** under the exact conditions (temperature, buffer) that enzyme likes. To check whether the cutting is actually working, you use **agarose gel electrophoresis**. DNA is a **negatively charged** molecule, so when a current is applied it moves toward the **positive electrode (anode)**, and the fragments separate out by size. The very same cutting is also done to the **vector DNA**, so both the gene of interest and the vector are cut by the same enzyme and can later be joined.\n\n**Copying (PCR).** Often you have only a tiny amount of your gene, so you make many copies of it first, using **PCR — Polymerase Chain Reaction**. Multiple copies of the target gene are synthesised **in vitro** (in a tube) using **two sets of primers** and the enzyme **DNA polymerase**. Each round of PCR is one **cycle**, and every cycle has the same **three steps, in this order**:\n\n1. **Denaturation** — the reaction is **heated**, and the heat pulls the two DNA strands apart into single strands.\n2. **Annealing** — the **two primers** bind (base-pair) to the single strands at the regions flanking the target gene.\n3. **Extension** — **DNA polymerase extends each primer**, adding nucleotides along the template strand, so each single strand is rebuilt into a full double strand — one becomes two.\n\nHere's the payoff: if you **repeat this cycle many times**, the DNA is copied again and again, and the segment is amplified to about a **billion copies**. The enzyme that makes this possible is a **thermostable DNA polymerase called Taq polymerase**, isolated from the bacterium *Thermus aquaticus*. It survives the high heat of the denaturation step, so it doesn't have to be replaced every cycle. Once amplified, the fragment can be ligated into a vector for further cloning.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'The three steps of one PCR cycle drawn as a loop: a double strand heated apart, two primers binding, Taq polymerase extending to make two full copies, then an arrow looping back to repeat',
      caption: '📸 Tap each dot to walk through one PCR cycle (Figure 9.6)',
      hotspots: [
        { id: uuid(), x: 0.15, y: 0.30, label: 'Denaturation (heat)', icon: 'circle',
          detail: 'The reaction is **heated**. The heat breaks the bonds holding the two DNA strands together, so the **double-stranded DNA separates into two single strands**. This is always the **first** step of a cycle.' },
        { id: uuid(), x: 0.15, y: 0.70, label: 'Primers anneal', icon: 'circle',
          detail: 'The **two primers** — short synthetic oligonucleotides complementary to the DNA — **base-pair (anneal)** onto the single strands at the regions flanking the target. They mark where copying will begin. This is the **second** step.' },
        { id: uuid(), x: 0.50, y: 0.50, label: 'Taq polymerase extends', icon: 'circle',
          detail: 'The enzyme **Taq polymerase** adds nucleotides onto each primer, reading the template strand, and **extends** it into a full new strand. This is the **third** step. Taq is **heat-stable**, so it survives the earlier denaturation heat.' },
        { id: uuid(), x: 0.82, y: 0.50, label: 'DNA doubled', icon: 'circle',
          detail: 'At the end of one cycle, each original double strand has become **two double strands** — the DNA has **doubled**. One template in, two copies out.' },
        { id: uuid(), x: 0.82, y: 0.85, label: 'Repeat the cycle', icon: 'circle',
          detail: 'The three steps are **repeated many times**. Because each cycle doubles the DNA, repeated cycles amplify the segment to roughly a **billion copies**.' },
      ],
      generation_prompt: "Scientific textbook illustration of the Polymerase Chain Reaction (PCR) cycle, drawn as a circular loop of three stages on a dark background (#0a0a0a near-black). Stage 1 (top): a double-stranded DNA molecule (two purple nucleic-acid ribbons) shown separating into two single strands with small heat/temperature lines to indicate denaturation. Stage 2 (lower left): the two single strands each with a short bright primer segment base-paired near one end (annealing). Stage 3 (centre-right): small rounded enzyme shapes (Taq polymerase) sitting on each template, building a new complementary strand alongside it (extension), ending in two complete identical double helices. A curved arrow loops from the finished copies back to the start to show the cycle repeats. Clean white outlines, thin white leader lines where labels would go but NO baked-in text, purple for DNA strands, a distinct bright colour for the short primers, soft neutral fill for the enzyme. Biologically accurate, no photorealism, no cartoon, no mascots.",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "Every PCR cycle begins by heating the DNA hot enough to pull its two strands apart. An ordinary DNA polymerase from human cells would be destroyed at that temperature. So why is Taq polymerase — and not an ordinary polymerase — used in PCR?",
      options: [
        "Because Taq polymerase can join DNA fragments together, which ordinary polymerases cannot do",
        "Because Taq polymerase is thermostable and stays active through the high-temperature denaturation step, so it need not be replaced each cycle",
        "Because Taq polymerase does not need primers to start copying DNA",
        "Because Taq polymerase copies DNA in both directions at once, doubling the speed",
      ],
      reveal: "PCR reheats the tube every single cycle to denature the DNA. An ordinary polymerase would be denatured by that heat and would have to be added fresh each time. **Taq polymerase, isolated from *Thermus aquaticus*, is thermostable** — it survives the heat and keeps working cycle after cycle. The tempting wrong answer is the 'no primers' one: PCR absolutely needs the two primers to give the polymerase a starting point — Taq does not skip them. Joining fragments is the job of ligase, not a polymerase, and no polymerase copies both directions of a strand at once.",
      difficulty_level: 3,
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'Lock These In',
      markdown: "- **Breaking the cell open** to release DNA — the enzyme depends on the cell type:\n  - **Lysozyme → bacteria**\n  - **Cellulase → plant cells**\n  - **Chitinase → fungal cells**\n- After breaking open: **RNase removes RNA, protease removes proteins**. Purified DNA is then precipitated by adding **chilled ethanol**, appearing as **fine threads**.\n- A restriction-enzyme cut is checked by **agarose gel electrophoresis**; DNA is **negatively charged**, so it runs toward the **anode (+)**.\n- **PCR = three steps per cycle, in order: Denaturation → Annealing → Extension.**\n  - Denaturation = **heat separates strands**; Annealing = **two primers bind**; Extension = **polymerase extends primers**.\n- The enzyme is **Taq polymerase** — a **thermostable** DNA polymerase from ***Thermus aquaticus***.\n- Repeated cycles amplify the DNA about a **billion times**.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Enzyme–cell pairing:** NEET loves swapping these. **Lysozyme = bacteria, cellulase = plant, chitinase = fungus.** A common trap gives 'cellulase for bacteria' — wrong.\n\n**PCR step order:** the order is fixed — **Denaturation → Annealing → Extension**. Questions scramble it (annealing first, or extension before annealing) — keep the sequence tight: heat apart, primers land, polymerase builds.\n\n**Why Taq:** the exact NCERT reason is that Taq is a **thermostable DNA polymerase from *Thermus aquaticus*** that stays active during the **high-temperature denaturation** — that phrase is lifted almost verbatim in questions.\n\n**Direction of DNA in a gel:** DNA is negatively charged → moves to the **positive electrode (anode)**. A frequent one-liner.\n\n**Classic NEET question:** \"In PCR, the enzyme used to extend the primers and withstand the denaturation temperature is ______.\" → **Taq polymerase (from *Thermus aquaticus*).**",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "So the first stretch of the recombinant journey is done: the DNA is out of the cell and pure, cut at the right place, and amplified into plenty of copies. The cut gene and the cut vector are now sitting ready to be joined. Next we'll see how they are stitched together and pushed into a host cell so the gene can actually be put to work.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 12, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'To isolate DNA, the cell must first be broken open. Which enzyme is correctly matched to the cell type it opens?',
          options: [
            'Chitinase for bacterial cells',
            'Lysozyme for bacterial cells',
            'Cellulase for fungal cells',
            'Lysozyme for plant cells',
          ],
          correct_index: 1,
          explanation: "Lysozyme breaks open bacterial cells; cellulase opens plant cells and chitinase opens fungal cells. Chitinase-for-bacteria and cellulase-for-fungi swap the pairings, and lysozyme is for bacteria, not plants — so every other option mismatches the enzyme with the wrong cell wall.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'After the cell is broken open and RNA and proteins are removed, how is the purified DNA finally made to separate out of the suspension?',
          options: [
            'By heating the suspension until the DNA denatures',
            'By adding a restriction enzyme to precipitate it',
            'By adding chilled ethanol, which precipitates the DNA as fine threads',
            'By spinning it toward the anode in a gel',
          ],
          correct_index: 2,
          explanation: "Purified DNA is precipitated by adding chilled ethanol, and it appears as fine threads that can be spooled out. Heating separates DNA strands but does not pull it out of solution; restriction enzymes cut DNA rather than precipitate it; and running toward the anode is what happens in gel electrophoresis, a way to check a cut — not a way to isolate DNA.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'What is the correct order of the three steps within a single cycle of PCR?',
          options: [
            'Annealing → Denaturation → Extension',
            'Extension → Denaturation → Annealing',
            'Denaturation → Extension → Annealing',
            'Denaturation → Annealing → Extension',
          ],
          correct_index: 3,
          explanation: "One PCR cycle runs denaturation (heat separates the strands), then annealing (the two primers bind), then extension (polymerase builds the new strands). The other sequences put annealing or extension before the strands have even been separated by heat, which is impossible — the primers have nothing to bind until denaturation has opened the double strand.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'PCR reheats the reaction to a high temperature every cycle. Which property of Taq polymerase makes it suitable for this, and where does it come from?',
          options: [
            'It is thermostable and is isolated from the bacterium Thermus aquaticus',
            'It is thermostable and is isolated from the bacterium Escherichia coli',
            'It resists cold and is isolated from a deep-sea fish',
            'It needs no primers and is isolated from a virus',
          ],
          correct_index: 0,
          explanation: "Taq polymerase is a thermostable DNA polymerase isolated from Thermus aquaticus, so it stays active through the high-temperature denaturation step. E. coli is the usual host cell in cloning but is not the source of Taq; the enzyme resists heat (not cold); and it still requires the two primers like any DNA polymerase — so the other options each get the source or the property wrong.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
