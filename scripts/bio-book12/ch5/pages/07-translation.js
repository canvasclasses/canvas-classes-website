'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'translation',
  title: 'Translation — Building the Protein',
  subtitle: "The mRNA carries the order; now a machine reads that order and strings amino acids into a polypeptide — with tRNA as the go-between and the ribosome itself acting as the enzyme.",
  page_number: 7,
  page_type: 'lesson',
  tags: ['molecular-basis-of-inheritance', 'translation', 'tRNA', 'ribosome', 'ribozyme', 'central-dogma'],
  glossary: [
    { term: 'translation', definition: 'The process of polymerisation of amino acids to form a polypeptide. The order and sequence of the amino acids is defined by the sequence of bases in the mRNA.' },
    { term: 'tRNA', definition: 'Transfer RNA — the adapter molecule that reads the mRNA code with one end and carries the matching amino acid on the other end. There is a specific tRNA for each amino acid.' },
    { term: 'anticodon', definition: 'The loop of the tRNA whose three bases are complementary to a codon on the mRNA. It base-pairs with the codon so the right amino acid is placed at the right spot.' },
    { term: 'aminoacylation', definition: 'The activation of an amino acid using ATP and its attachment to its cognate tRNA. Also called charging of the tRNA — it happens before the amino acid can be used.' },
    { term: 'ribosome', definition: 'The cellular factory that synthesises proteins, made of structural RNAs and about 80 different proteins. In its inactive state it exists as a large and a small subunit.' },
    { term: 'release factor', definition: 'A protein that binds to the stop codon at the end of an mRNA, terminating translation and releasing the finished polypeptide from the ribosome.' },
    { term: 'UTR', definition: 'Untranslated region — a stretch of the mRNA that is not translated, present at both the 5′-end (before the start codon) and the 3′-end (after the stop codon). UTRs are needed for efficient translation.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A strand of messenger RNA threading through a two-part molecular machine while amino acids link into a lengthening chain',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). An atmospheric, painterly scene inside a living cell, dark background tones throughout (#0a0a0a base) with a soft warm glow at the centre. A long, gently curving ribbon-like strand of messenger RNA threads horizontally across the frame. Clamped over the middle of the strand sits a large rounded two-part molecular machine (suggesting a ribosome with a bigger upper mass and a smaller lower mass gripping the ribbon). Small L-shaped carrier molecules drift toward the machine from above, each holding a tiny bead. Emerging from the far side of the machine, a lengthening chain of linked beads curls outward like a growing thread being spun. No text, no labels, no diagram callouts. Purple-violet tones for the nucleic-acid strand, warm amber for the growing chain, moody and quiet. Painterly, atmospheric illustration style, not a labelled diagram.",
    },
    // ── fun_fact: ribosome is a ribozyme ─────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Machine Is Also the Chemist',
      markdown: "You'd expect a protein to be the enzyme that joins amino acids together — after all, most enzymes in the body are proteins. But at the heart of the ribosome, the job of forming each **peptide bond** is done by **RNA, not protein**. In bacteria it is the **23S rRNA** that acts as the enzyme. An RNA that behaves as an enzyme has a special name — a **ribozyme**. So the very machine that builds every protein in your body is itself run by a piece of RNA. The factory and the chemist inside it are the same molecule.",
    },
    // ── core concept ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "**Translation** is the process of **polymerisation of amino acids to form a polypeptide**. The **order and sequence of the amino acids** is not random — it is **defined by the sequence of bases in the mRNA**. Read the codons in order, and you read off the protein in order.\n\nThe amino acids in a chain are held together by a **peptide bond**, and **forming a peptide bond needs energy**. So the cell does not wait until the last moment. In the **very first phase**, each amino acid is **activated in the presence of ATP** and **linked to its cognate tRNA** — its own matching tRNA. This step has a name worth locking in: **charging of tRNA**, or more specifically **aminoacylation of tRNA**. Once two such **charged tRNAs** are brought close enough together, the peptide bond between their amino acids is **energetically favoured** — and a catalyst then speeds the reaction up.",
    },
    // ── heading: tRNA the adapter ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'tRNA — the Adapter That Reads and Carries',
      objective: "By the end of this you can explain why Crick predicted an 'adapter' molecule, and point to the two working ends of a tRNA — the anticodon loop and the amino acid acceptor end.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Here is the problem Francis Crick spotted early. The genetic code sits in the bases of the mRNA, but **amino acids have no way to read those bases** — an amino acid has no feature that lets it recognise a triplet of bases on its own. Something has to sit in between: read the code on one side, and hold the correct amino acid on the other. Crick called this the **adapter molecule**.\n\nThat adapter turned out to be **tRNA (transfer RNA)**. It works because it has **two business ends**:\n\n- an **anticodon loop**, whose bases are **complementary to the codon** on the mRNA — this is the end that *reads* the code;\n- an **amino acid acceptor end**, to which it **binds its amino acid** — this is the end that *carries*.\n\nThere is a **specific tRNA for each amino acid**. For starting a protein there is a special one — the **initiator tRNA**. And here is a fact NEET likes: there are **no tRNAs for the stop codons**. Drawn out flat, the tRNA looks like a **clover-leaf**; in its real folded shape it is a **compact, inverted-L molecule**.",
    },
    // ── heading: ribosome + steps ────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 5, level: 2,
      text: 'The Ribosome and the Three Steps',
      objective: "By the end of this you can describe the ribosome's two subunits and walk through initiation, elongation and termination in order — plus say what the UTRs are for.",
    },
    {
      id: uuid(), type: 'text', order: 6,
      markdown: "The cellular factory that actually synthesises proteins is the **ribosome**. It is built of **structural RNAs and about 80 different proteins**, and in its **inactive state it sits as two subunits — a large subunit and a small subunit**. When the **small subunit encounters an mRNA**, translation begins. The **large subunit has two sites** where incoming amino acids bind, holding them close enough for a peptide bond to form — and, as we saw, the ribosome's own rRNA acts as the **ribozyme** that makes that bond.\n\nBefore the steps, one detail about the mRNA itself. The **translational unit** is the stretch flanked by the **start codon (AUG)** and the **stop codon** — that part codes for the polypeptide. But the mRNA also carries **untranslated regions (UTRs)**, present at **both the 5′-end (before the start codon) and the 3′-end (after the stop codon)**. They are not translated, yet they are **required for efficient translation**.\n\nNow the three steps, in order:\n\n1. **Initiation** — the ribosome binds the mRNA at the **start codon (AUG)**, which is **recognised only by the initiator tRNA**.\n2. **Elongation** — complexes of an **amino acid linked to tRNA** bind, one after another, to the **appropriate codon** by **complementary base pairing between the codon and the tRNA anticodon**. The ribosome **moves from codon to codon** along the mRNA, adding amino acids **one by one**.\n3. **Termination** — at the end, a **release factor binds the stop codon**, terminating translation and **releasing the complete polypeptide** from the ribosome.\n\nThat finished polypeptide is the protein the gene coded for. With translation done, the next question is how the cell decides *when* a gene should be switched on at all — that's gene regulation.",
    },
    // ── interactive image: ribosome translating mRNA (Fig 5.11/5.13) ─────
    {
      id: uuid(), type: 'interactive_image', order: 7, src: '',
      alt: 'A ribosome clamped on an mRNA strand with a tRNA base-pairing to a codon, its amino acid joining a growing polypeptide chain',
      caption: '📸 Tap each dot to explore how the ribosome, mRNA and tRNA work together to build the chain',
      generation_prompt: "Scientific textbook illustration of translation in progress. Flat 2D educational diagram on a dark background (#0a0a0a near-black), clean white outlines throughout, labels omitted (this will get interactive dots instead). A long horizontal messenger-RNA strand runs across the lower-middle of the frame, drawn as a chain of small linked boxes grouped into visible triplets (codons), tinted purple to read as nucleic acid. A large rounded ribosome sits over the middle of the strand, clearly drawn in two parts: a smaller lower subunit gripping the mRNA and a larger upper subunit resting on top. Inside the ribosome, one L-shaped or clover-leaf tRNA molecule is shown with its lower three bases (the anticodon) pairing against a codon of the mRNA, and its upper end carrying a small round amino acid bead. Rising from the ribosome, a curling chain of linked amino-acid beads (the growing polypeptide) extends upward and to the side, amber-tinted. A second tRNA carrying its own amino acid bead drifts in from the upper right, about to enter. Biologically accurate relative proportions, no photorealism, no cartoon, no mascots, standard biology textbook illustration conventions.",
      hotspots: [
        { id: uuid(), x: 0.2, y: 0.78, label: 'mRNA', icon: 'circle',
          detail: 'The messenger RNA. Its **sequence of bases defines the order and sequence of amino acids** in the protein. The ribosome reads it from the start codon toward the stop codon.' },
        { id: uuid(), x: 0.42, y: 0.82, label: 'Codon', icon: 'circle',
          detail: 'A triplet of bases on the mRNA. Each codon specifies which amino acid comes next; the ribosome **moves from codon to codon** along the strand.' },
        { id: uuid(), x: 0.5, y: 0.55, label: 'tRNA anticodon', icon: 'circle',
          detail: 'The **anticodon loop** of the tRNA. Its bases are **complementary to the codon**, so it base-pairs with the mRNA and places the correct amino acid at the correct spot.' },
        { id: uuid(), x: 0.62, y: 0.32, label: 'Amino acid', icon: 'circle',
          detail: 'Carried at the tRNA’s **amino acid acceptor end**. It was activated with ATP and charged onto this tRNA earlier (**aminoacylation**), and is now added to the chain.' },
        { id: uuid(), x: 0.4, y: 0.42, label: 'Small subunit', icon: 'circle',
          detail: 'When the **small subunit encounters the mRNA**, translation begins. It grips the mRNA strand as the ribosome moves along it.' },
        { id: uuid(), x: 0.5, y: 0.22, label: 'Large subunit', icon: 'circle',
          detail: 'Holds **two sites** where incoming amino acids bind, keeping them close enough to react. Its **rRNA is the ribozyme** that forms each peptide bond.' },
        { id: uuid(), x: 0.78, y: 0.2, label: 'Growing polypeptide', icon: 'circle',
          detail: 'Amino acids are joined by **peptide bonds**, one by one, into the lengthening chain. When the stop codon is reached, a **release factor** frees the complete polypeptide.' },
      ],
    },
    // ── mid-page reasoning check ─────────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "Crick argued that an amino acid cannot read the mRNA code by itself, so a special molecule must sit between the code and the amino acid. That molecule is the tRNA, and this is exactly why it is called an 'adapter'. Which single feature best captures why 'adapter' is the right word for it?",
      options: [
        "Its anticodon reads the mRNA codon while its acceptor end carries the matching amino acid, linking the two together",
        "It copies the DNA sequence into a matching RNA sequence before protein synthesis begins",
        "It splits the ribosome into a large and a small subunit so translation can start",
        "It reads the stop codons and ends the chain by binding a release factor",
      ],
      correct_index: 0,
      reveal: "An adapter connects two things that can't otherwise fit together. The tRNA does exactly that: one end (the **anticodon loop**) reads the mRNA **codon**, and the other end (the **amino acid acceptor end**) holds the **correct amino acid** — so it bridges the code and the amino acid. The tempting wrong choice is copying DNA into RNA, but that is **transcription**, done by RNA polymerase, not tRNA. Splitting the ribosome and binding release factors are also not tRNA's job — and remember, there are **no tRNAs for stop codons**, so termination is handled by a release factor, not a tRNA.",
      difficulty_level: 2,
    },
    // ── remember ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember', title: 'The Facts You Cannot Swap Around',
      markdown: "- **Charging = aminoacylation.** Each amino acid is **activated with ATP** and linked to its **cognate tRNA** *before* it enters the ribosome. Peptide bond formation needs energy — that's why activation comes first.\n- **Start = AUG, recognised only by the initiator tRNA. Stop codons have NO tRNA** — a **release factor** binds the stop codon to terminate and release the polypeptide.\n- **The ribosome itself is the enzyme.** Peptide bonds are made by rRNA (**23S rRNA** in bacteria) acting as a **ribozyme** — an RNA enzyme, not a protein enzyme.\n- **UTRs are untranslated** but still needed for efficient translation. They sit at **both** the **5′-end (before AUG)** and the **3′-end (after the stop codon)**.\n- tRNA has **two ends**: the **anticodon loop** (reads the codon) and the **amino acid acceptor end** (carries the amino acid).",
    },
    // ── exam_tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Aminoacylation / charging:** NEET asks it as “the process of activating an amino acid and attaching it to its tRNA is called?” → **charging of tRNA / aminoacylation.** ATP is the energy source.\n\n**Ribozyme:** the fact that **23S rRNA of bacteria** catalyses peptide-bond formation is a favourite. If a question says “the peptidyl transferase / peptide-bond formation is catalysed by a protein,” it is **wrong** — it is catalysed by **rRNA (a ribozyme)**.\n\n**No tRNA for stop codons:** watch for “how many tRNAs read the stop codons?” → **none.** Termination uses a **release factor**.\n\n**AUG:** the start codon, recognised **only by the initiator tRNA**.\n\n**Classic NEET question:** “The ribosomal RNA that acts as a ribozyme during peptide bond formation in bacteria is?” → **23S rRNA.**",
    },
    // ── inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'Which end of the tRNA base-pairs with the mRNA, and what does the other end do?',
          options: [
            'The amino acid acceptor end pairs with the mRNA; the anticodon loop stores energy',
            'The anticodon loop pairs with the mRNA codon; the amino acid acceptor end carries the amino acid',
            'Both ends pair with the mRNA, one with the codon and one with the anticodon',
            'The anticodon loop carries the amino acid; the acceptor end reads the stop codon',
          ],
          correct_index: 1,
          explanation: "The tRNA reads with its **anticodon loop**, whose bases are complementary to the mRNA codon, and carries its amino acid at the **amino acid acceptor end** — the two ends that make it an adapter. The tempting trap swaps the two jobs; the acceptor end does not read the code and the anticodon does not hold the amino acid.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'During elongation, how does the correct amino acid get placed at the correct position on the growing chain?',
          options: [
            'The mRNA itself carries the amino acids and drops them in order',
            'The ribosome randomly adds amino acids and edits mistakes later',
            'The tRNA anticodon forms complementary base pairs with the mRNA codon, so the amino acid it carries matches that codon',
            'A release factor reads each codon and selects the amino acid',
          ],
          correct_index: 2,
          explanation: "Each charged tRNA binds the appropriate codon by **complementary base pairing between its anticodon and the mRNA codon**, so the amino acid it carries is the right one for that spot. The mRNA does not carry amino acids (tRNA does), addition is not random, and a release factor acts only at the stop codon during termination — not during elongation.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which statement about the ribosome and peptide bond formation is correct?',
          options: [
            'The peptide bond is formed by rRNA acting as a ribozyme; in bacteria this is the 23S rRNA',
            'The peptide bond is formed by a protein enzyme in the small subunit',
            'The peptide bond is formed by the initiator tRNA before elongation begins',
            'The peptide bond needs no energy, so no activation step is required',
          ],
          correct_index: 0,
          explanation: "The ribosome acts as its own catalyst: **rRNA is the ribozyme**, and in bacteria the **23S rRNA** forms the peptide bond. It is not a protein enzyme, and it is not the tRNA that catalyses the bond. Peptide bonds also **do require energy**, which is why amino acids are first activated with ATP during charging.",
          difficulty_level: 3,
        },
        {
          id: uuid(), question: 'Which of these correctly describes the untranslated regions (UTRs) of an mRNA?',
          options: [
            'They lie only at the 3′-end, after the stop codon, and code for the last amino acid',
            'They are present at both the 5′-end and the 3′-end, are not translated, and are required for efficient translation',
            'They are the start and stop codons themselves',
            'They are translated into a short signal peptide before the main protein',
          ],
          correct_index: 1,
          explanation: "UTRs sit at **both** the **5′-end (before the start codon) and the 3′-end (after the stop codon)**, are **not translated**, yet are **needed for efficient translation**. They are not only at the 3′-end, they are not the start/stop codons (those flank the translational unit), and being untranslated they code for no amino acids at all.",
          difficulty_level: 2,
        },
      ],
    },
  ],
};
