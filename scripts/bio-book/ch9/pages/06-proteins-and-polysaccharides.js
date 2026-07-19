'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'proteins-and-polysaccharides',
  title: 'Proteins & Polysaccharides',
  subtitle: "Two of the four big biomolecule families, side by side: proteins are chains of 20 different amino acids doing every job in your body, while polysaccharides are long threads of sugar built for structure and storage. Learn which is a homopolymer, which turns blue with iodine, and the two 'most abundant protein' facts NEET loves.",
  page_number: 6,
  page_type: 'lesson',
  tags: ['biomolecules', 'proteins', 'polysaccharides'],
  glossary: [
    { term: 'protein', definition: 'A polypeptide — a linear chain of amino acids joined by peptide bonds. Because it is built from up to 20 different amino acids, a protein is a heteropolymer.' },
    { term: 'amino acid', definition: 'The monomer (building block) of a protein. There are 20 types, such as alanine, cysteine, proline, tryptophan and lysine.' },
    { term: 'peptide bond', definition: 'The bond that links one amino acid to the next in a protein chain.' },
    { term: 'essential amino acid', definition: 'An amino acid the body cannot make on its own, so it must be supplied through diet/food. Dietary proteins are our source of these.' },
    { term: 'homopolymer', definition: 'A polymer built from only one type of monomer repeating n times. Cellulose (only glucose) is a homopolymer.' },
    { term: 'heteropolymer', definition: 'A polymer built from more than one type of monomer. A protein is a heteropolymer because it uses up to 20 different amino acids.' },
    { term: 'polysaccharide', definition: 'A long chain of sugars — a thread made of monosaccharide building blocks. Cellulose, starch, glycogen and inulin are examples.' },
    { term: 'reducing / non-reducing end', definition: 'The two ends of a polysaccharide chain (e.g. glycogen): the right end is the reducing end, the left end is the non-reducing end.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A softly glowing coiled protein chain on one side and a long branching thread of sugar rings on the other, meeting in the dark',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). On the left, a single softly glowing folded chain of small linked beads suggests a coiled protein made of many different amino acids, each bead a slightly different warm colour. On the right, a long branching thread of identical pale sugar rings suggests a polysaccharide, uniform and repeating. The two forms lean gently toward each other across a dark, misty space, without touching, hinting at two different kinds of biological chains. Painterly, atmospheric illustration style, deep dark background throughout (#0a0a0a base tones), soft rim light, no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'The Single Most Common Protein On Earth Is Inside A Leaf',
      markdown: "Ask most people to name a common protein and they'll say something from muscle or blood. But the **most abundant protein in the whole biosphere** isn't in any animal at all — it's **RuBisCO**, the enzyme every green leaf uses to trap carbon from the air. There is more of it, spread across all the plants on the planet, than of any other protein in existence. Keep that fact in your pocket — NEET asks it directly.",
    },
    // ── 2 · Core concept — where these two fit ────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Two of the big families of macromolecules in a living cell are **proteins** and **polysaccharides**. Both are **polymers** — long chains built by joining small units (monomers) over and over. The difference is in *which* monomers they use, and *what the chain is for*.\n\nA **protein** is a chain of **amino acids**, and it does the working jobs of the cell — enzymes, hormones, transport, defence. A **polysaccharide** is a chain of **sugars**, and it mostly handles **structure** (like a plant's cell wall) and **energy storage**. Getting these two straight — what each is made of, and whether it repeats one monomer or many — is what this page is about.",
    },
    // ── 3 · Heading — Proteins ────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Proteins — Chains of 20 Different Amino Acids',
      objective: "By the end of this you can explain why a protein is a heteropolymer, what essential vs non-essential amino acids means, and name the two 'most abundant protein' records.",
    },
    // ── 4 · Text — proteins are polypeptides, heteropolymer ───────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Proteins are **polypeptides** — **linear chains of amino acids linked by peptide bonds**. So each protein is a **polymer of amino acids**, where the amino acid is the repeating building block.\n\nHere's the key point NEET tests. There are **20 types of amino acids** (alanine, cysteine, proline, tryptophan, lysine, and so on). Because a protein is built from many *different* kinds of amino acid — not just one repeated — a protein is a **heteropolymer**, **not a homopolymer**. A **homopolymer** has only **one type of monomer** repeating 'n' number of times; a protein clearly does not, so it can't be one.",
    },
    // ── 5 · Text — essential vs non-essential, functions ──────────────────
    {
      id: uuid(), type: 'text', order: 5,
      markdown: "This is also why **diet matters**. Amino acids can be **essential** or **non-essential**. **Non-essential** ones are the amino acids **our body can make** for itself. **Essential** ones our body **cannot make** — so we have to get them from our **diet/food**, which is why **dietary proteins are the source of essential amino acids**.\n\nProteins carry out **many functions** in living organisms: some **transport nutrients** across the cell membrane, some **fight infectious organisms**, some are **hormones**, and some are **enzymes**. Table 9.5 lists a few, matched to the job each one does.",
    },
    // ── 6 · Table 9.5 — proteins and their functions ──────────────────────
    {
      id: uuid(), type: 'table', order: 6,
      caption: 'NCERT Table 9.5 — some proteins and the function each one performs',
      headers: ['Protein', 'Function'],
      rows: [
        ['Collagen', 'Intercellular ground substance'],
        ['Trypsin', 'Enzyme'],
        ['Insulin', 'Hormone'],
        ['Antibody', 'Fights infectious agents'],
        ['Receptor', 'Sensory reception (smell, taste, hormone, etc.)'],
        ['GLUT-4', 'Enables glucose transport into cells'],
      ],
    },
    // ── 7 · Text — the two "most abundant" records ────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Two protein records are worth memorising exactly, because they look similar and students swap them.\n\n- **Collagen** is the **most abundant protein in the animal world**.\n- **RuBisCO** — **Ribulose bisphosphate Carboxylase-Oxygenase** — is the **most abundant protein in the whole of the biosphere**.\n\nThe trap is the word. \"Animal world\" → **collagen**. \"Whole biosphere\" (everything, including all the plants) → **RuBisCO**.",
    },
    // ── 8 · Reasoning prompt — homopolymer vs heteropolymer ──────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "A protein is called a heteropolymer, but cellulose is called a homopolymer. Using NCERT's own definition of these words, which single fact is the real reason for the difference?",
      options: [
        "A protein is built from up to 20 different amino acids, while cellulose repeats only one monomer (glucose)",
        "A protein is much longer than cellulose, and longer chains are always heteropolymers",
        "A protein is found in animals and cellulose in plants, and animal polymers are heteropolymers by definition",
        "A protein is folded into a helix while cellulose stays straight, and only folded chains count as heteropolymers",
      ],
      reveal: "The first option is right, and it comes straight from NCERT's definitions. A homopolymer has only one type of monomer repeating n times — cellulose fits exactly, because it is only glucose. A protein is built from up to 20 different kinds of amino acid, so it is a heteropolymer. The tempting wrong answer is the length one: chain length has nothing to do with it — a short chain of different monomers is still a heteropolymer, and a very long chain of one monomer (like cellulose) is still a homopolymer. Location (animal vs plant) and folding (helix vs straight) are also irrelevant to the homo/hetero label; the only thing that matters is whether the monomers are all the same type or not.",
      difficulty_level: 2,
    },
    // ── 9 · Heading — Polysaccharides ─────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Polysaccharides — Long Threads of Sugar',
      objective: "By the end of this you can explain why cellulose is a homopolymer, why starch turns blue with iodine but cellulose doesn't, and place glycogen, inulin and chitin correctly.",
    },
    // ── 10 · Text — polysaccharides, cellulose, starch, glycogen, inulin ──
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "**Polysaccharides** are **long chains of sugars** — picture them literally as **threads** (like a cotton thread), made of **monosaccharide** building blocks strung together.\n\n- **Cellulose** is a polymer of **only one type of monosaccharide — glucose**. Because it repeats a single monomer, **cellulose is a homopolymer**. **Plant cell walls are made of cellulose**, and **paper** made from plant pulp and cotton fibre is cellulosic.\n- **Starch** is a variant of this, present as a **store house of energy in plant tissues**.\n- Animals have their own variant called **glycogen** — the animal energy store.\n- **Inulin** is a polymer of **fructose** (not glucose).\n\nIn a polysaccharide chain (say **glycogen**), the **right end** is the **reducing end** and the **left end** is the **non-reducing end**, and the chain has **branches**.",
    },
    // ── 11 · Text — the iodine test, helix, chitin ────────────────────────
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "Here's the famous experiment. **Starch forms helical secondary structures** — the chain coils up. That coil can **hold I2 (iodine) molecules inside the helical portion**, and **starch–I2 is blue in colour**. **Cellulose does not have these complex helices, so it cannot hold I2** — which is why cellulose gives no blue colour with iodine.\n\nThere are also **more complex polysaccharides** in nature. Instead of plain sugars, they use **amino-sugars and chemically modified sugars** (for example **glucosamine** and **N-acetyl galactosamine**). **Chitin**, the tough material in the **exoskeletons of arthropods** (insects, crabs and the like), is one of these. These complex polysaccharides are **mostly homopolymers**.",
    },
    // ── 12 · Figure — branched glycogen chain (interactive) ───────────────
    {
      id: uuid(), type: 'interactive_image', order: 12, src: '',
      alt: 'Diagrammatic cartoon of a portion of a glycogen molecule: a branching chain of linked sugar rings with a marked reducing end on the right and non-reducing end on the left',
      caption: '📸 Tap each dot to explore the parts of a glycogen chain — the two named ends and its branches.',
      generation_prompt: "Scientific textbook illustration of a portion of a glycogen molecule (NCERT Figure 9.2 style). Flat 2D educational diagram on a dark background (#0a0a0a near-black). Show a branching chain of small identical linked sugar-ring units drawn as simple hexagon/ring shapes joined by short bonds, forming a main horizontal thread with one or two side branches coming off it. Clean white outlines, uniform pale off-white sugar rings (this is a single-monomer polysaccharide), thin white leader lines. Mark the right-hand terminal ring and the left-hand terminal ring as the two ends of the chain, and show a clear branch point where one chain splits into two. No photorealism, no cartoon mascots, no colour beyond soft off-white rings on the dark background.",
      hotspots: [
        { id: uuid(), x: 0.9, y: 0.5, label: 'Reducing end', detail: 'In a polysaccharide chain such as glycogen, the **right end is called the reducing end**.', icon: 'circle' },
        { id: uuid(), x: 0.1, y: 0.5, label: 'Non-reducing end', detail: 'The **left end** of the chain is called the **non-reducing end**.', icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.3, label: 'Branch point', detail: 'A glycogen chain **has branches** — one thread splits off into another, as shown in the NCERT cartoon (Figure 9.2).', icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.65, label: 'Sugar building blocks', detail: 'Each ring is a **monosaccharide** building block. Glycogen strings many of these sugar units together into a long thread — the animal variant of the plant energy store.', icon: 'circle' },
      ],
    },
    // ── 13 · Comparison card — cellulose vs starch vs glycogen ────────────
    {
      id: uuid(), type: 'comparison_card', order: 13,
      title: 'Cellulose vs Starch vs Glycogen',
      columns: [
        { heading: 'Cellulose', points: ['Monomer: glucose (only one type)', 'A homopolymer', 'Role: structural — makes plant cell walls (paper is cellulosic)', 'No complex helices → cannot hold I2 → no blue colour'] },
        { heading: 'Starch', points: ['Building block: monosaccharide sugar', 'Role: store house of energy in plant tissues', 'Forms helical secondary structures', 'Holds I2 in the helix → starch–I2 is blue'] },
        { heading: 'Glycogen', points: ['Building block: monosaccharide sugar (a branched chain)', 'Role: the energy-store variant in animals', 'Right end = reducing end, left end = non-reducing end', 'Has branches (NCERT Figure 9.2)'] },
      ],
    },
    // ── 14 · Comparison card — homopolymer vs heteropolymer ───────────────
    {
      id: uuid(), type: 'comparison_card', order: 14,
      title: 'Homopolymer vs Heteropolymer',
      columns: [
        { heading: 'Homopolymer', points: ['Only ONE type of monomer, repeating n times', 'Example: cellulose (only glucose)', 'Complex polysaccharides like chitin are mostly homopolymers'] },
        { heading: 'Heteropolymer', points: ['MORE than one type of monomer', 'Example: a protein — built from up to 20 different amino acids', 'The variety of monomers is the whole point'] },
      ],
    },
    // ── 15 · Remember callout ─────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 15, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Protein** = polypeptide = chain of amino acids joined by **peptide bonds**; **20 amino acids** → it's a **heteropolymer** (a homopolymer has one monomer repeating).\n- **Essential** amino acids → body **cannot** make → come from **diet**. **Non-essential** → body **can** make.\n- **Collagen** = most abundant protein in the **animal world**. **RuBisCO** = most abundant protein in the **whole biosphere**.\n- **Cellulose** = only glucose → **homopolymer**; makes **plant cell walls**; **no helix → can't hold I2**.\n- **Starch** = plant energy store; **helical → holds I2 → blue**. **Glycogen** = **animal** energy store, branched. **Inulin** = polymer of **fructose**. **Chitin** = arthropod exoskeleton, uses amino-sugars.",
    },
    // ── 16 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 16, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Two 'most abundant' facts are almost guaranteed marks — keep them apart:** animal world → **collagen**; whole biosphere → **RuBisCO**.\n\n**The iodine test is a classic:** only **starch** has the helix that traps I2 and turns **blue**; **cellulose** has no such helix and stays colourless. If a question pairs a polysaccharide with the blue-iodine result, the answer is starch, never cellulose.\n\n**Don't misfile the storage molecules:** **starch** stores energy in **plants**, **glycogen** stores it in **animals**, and **inulin** is a **fructose** polymer.\n\n**Classic NEET question:** \"Which is the most abundant protein in the whole biosphere?\" → **RuBisCO** — not collagen, which holds that record only for the animal world.",
    },
    // ── 17 · Bridge text ──────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 17,
      markdown: "You now have two of the four big biomolecule families down: proteins as heteropolymers of amino acids, and polysaccharides as sugar threads for structure and storage. Next you'll meet the family that stores the cell's information itself — the **nucleic acids**, DNA and RNA.",
    },
    // ── 18 · Inline quiz (LAST) ───────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 18, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Why does NCERT call a protein a heteropolymer rather than a homopolymer?",
          options: [
            "Because it is built from up to 20 different types of amino acids, not one monomer repeated",
            "Because its amino acids are joined by peptide bonds instead of glycosidic bonds",
            "Because it is much longer than any polysaccharide chain",
            "Because it can act as an enzyme, a hormone and a transporter all at once",
          ],
          correct_index: 0,
          explanation: "A homopolymer has only one type of monomer repeating n times. A protein uses up to 20 different amino acids, so by definition it is a heteropolymer — that's the whole reason for the label. The peptide-bond option is true about proteins but isn't what makes a polymer 'hetero'; and length or number of jobs has nothing to do with the homo/hetero distinction.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which polysaccharide forms a helix that holds iodine (I2) and turns blue?",
          options: [
            "Cellulose, because its glucose chains coil tightly in the plant cell wall",
            "Starch, because it forms helical secondary structures that trap I2 in the helix",
            "Glycogen, because its branches wrap around the iodine molecules",
            "Inulin, because fructose polymers bind iodine strongly",
          ],
          correct_index: 1,
          explanation: "Starch forms helical secondary structures, and I2 sits inside that helix — starch–I2 is blue. Cellulose is the tempting trap, but NCERT states it does not contain complex helices and so cannot hold I2 (no blue colour). Glycogen and inulin aren't described as giving the blue iodine test either.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Match each 'most abundant' record to the right protein.",
          options: [
            "Collagen — most abundant in the biosphere; RuBisCO — most abundant in the animal world",
            "Collagen — most abundant in the animal world; RuBisCO — most abundant in the whole biosphere",
            "RuBisCO — most abundant in the animal world; Insulin — most abundant in the biosphere",
            "Collagen — most abundant in plants; RuBisCO — most abundant in animals",
          ],
          correct_index: 1,
          explanation: "NCERT states collagen is the most abundant protein in the animal world, and RuBisCO is the most abundant protein in the whole biosphere. Option 1 swaps the two — the single most common error on this fact. The other options bring in the wrong scope or the wrong protein entirely.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which statement about storage and structural polysaccharides is correct according to NCERT?",
          options: [
            "Glycogen stores energy in plants, while starch stores it in animals",
            "Cellulose is a heteropolymer of glucose and fructose that builds animal cell walls",
            "Starch stores energy in plant tissues, glycogen is the animal variant, and inulin is a polymer of fructose",
            "Inulin is a polymer of glucose that forms arthropod exoskeletons",
          ],
          correct_index: 2,
          explanation: "NCERT puts these clearly: starch is the plant energy store, glycogen is the animal variant, and inulin is a polymer of fructose. Option 1 reverses starch and glycogen. Cellulose is a homopolymer of only glucose that builds plant (not animal) cell walls. Inulin is fructose, not glucose, and it's chitin — not inulin — that forms arthropod exoskeletons.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
