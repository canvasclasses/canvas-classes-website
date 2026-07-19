'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'amino-acids-and-lipids',
  title: 'The Building Blocks I — Amino Acids & Lipids',
  subtitle: "Every protein in your body is stitched from just 20 amino acids, and every fat is built from a carboxyl acid and a three-armed alcohol. Learn the one carbon that decides which amino acid you get, and the carbon-count numbers NEET quotes straight from NCERT.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['biomolecules', 'amino-acids', 'lipids'],
  glossary: [
    { term: 'α-amino acid', definition: 'An organic compound with an amino group and an acidic (carboxyl) group attached to the same carbon — the α-carbon. All amino acids that occur in proteins are α-amino acids.' },
    { term: 'R group', definition: 'The variable fourth group on the α-carbon. The nature of the R group is what makes one amino acid different from another.' },
    { term: 'zwitterionic form', definition: 'The form of an amino acid that exists at a particular pH, arising because both the –NH2 and –COOH groups are ionizable and so the structure changes with the pH of the solution.' },
    { term: 'fatty acid', definition: 'A simple lipid made of a carboxyl group attached to an R group, where R is a methyl, an ethyl, or a chain of –CH2 groups (1 to 19 carbons).' },
    { term: 'glycerol', definition: 'A simple lipid; chemically it is trihydroxy propane. Fatty acids esterified with glycerol give mono-, di- and triglycerides.' },
    { term: 'phospholipid', definition: 'A lipid that contains phosphorus and a phosphorylated organic compound. Phospholipids are found in the cell membrane; lecithin is one example.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A single glowing central carbon atom holding four faint arms reaching into the darkness, with soft droplets of oil suspended nearby',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). At the centre, a single softly glowing sphere sits in deep darkness, with four faint translucent arms reaching outward from it into the shadows, suggesting a central atom holding four different groups without becoming a literal labelled diagram. Off to one side, a few soft golden droplets of oil hang suspended, catching a warm highlight. Deep shadows fill the rest of the frame. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'Only Twenty Bricks Build Every Protein You Own',
      markdown: "There are a huge number of possible amino acids — change one small part and you get a different one. But out of all of them, the ones that actually **occur in proteins are only of twenty types**. Every protein in every living thing — your muscle, your hair, the enzymes digesting your food right now — is spelt out using just those 20 building blocks.",
    },
    // ── 2 · Core concept — what an amino acid is ─────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "An **amino acid** is an organic compound carrying two groups: an **amino group** and an **acidic group** (the carboxyl group). The whole trick is *where* these two sit — they are both attached to the **same carbon**. That shared carbon has a name: the **α-carbon**. Because both groups hang off the α-carbon, these compounds are called **α-amino acids**.\n\nThink of each amino acid as a **substituted methane** — a single central carbon with four things attached to its four valency positions. Three of those four are always the same: a **hydrogen**, a **carboxyl group (–COOH)**, and an **amino group (–NH2)**. The fourth is a **variable group, designated the R group**. Swap the R group, and you get a different amino acid. That one changing piece is the entire source of variety.",
    },
    // ── 3 · Heading — the R group decides identity ───────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The α-Carbon and Its Four Groups',
      objective: "By the end of this you can name the four groups on the α-carbon, and say which amino acid you get for three different R groups.",
    },
    // ── 4 · Text — R group → named amino acids ───────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The R group is the only position that changes, so it alone decides which amino acid you are holding. NCERT gives three worked cases:\n\n- R = a **hydrogen** → the amino acid is **glycine**.\n- R = a **methyl group** → **alanine**.\n- R = **hydroxy methyl** → **serine**.\n\nSame skeleton every time — hydrogen, –COOH, –NH2 on the α-carbon — only the R group differs. Tap through the diagram below to see each of the four positions on the central α-carbon.",
    },
    // ── 5 · Interactive image — α-amino acid general structure ────────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'General structure of an α-amino acid: a central alpha-carbon bonded to a hydrogen, a carboxyl group, an amino group, and a variable R group',
      caption: '📸 Tap each dot to explore the four groups on the α-carbon of an amino acid.',
      generation_prompt: "Scientific textbook illustration of the general structure of an α-amino acid. Flat 2D educational diagram on a dark background (#0a0a0a near-black). A single central carbon atom labelled 'α-carbon' sits in the middle, with four clean white bonds radiating to its four groups: a hydrogen atom (H) at the top, a carboxyl group (–COOH) on the right, an amino group (–NH2) on the left, and a variable R group at the bottom. Clean white outlines, labels in white text with thin white leader lines. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.5, y: 0.5, label: 'α-carbon (central carbon)', detail: "The single central carbon that carries all four groups. Because the amino and acidic groups both attach here, the compound is an **α-amino acid**. The whole molecule is essentially a **substituted methane**.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.18, label: 'Hydrogen (H)', detail: "One of the four fixed valency positions on the α-carbon. It is the same in every amino acid.", icon: 'circle' },
        { id: uuid(), x: 0.82, y: 0.5, label: 'Carboxyl group (–COOH)', detail: "The **acidic group**. Together with the amino group it defines an amino acid. It is **ionizable**, which is why the molecule's structure changes with the pH of the solution.", icon: 'circle' },
        { id: uuid(), x: 0.18, y: 0.5, label: 'Amino group (–NH2)', detail: "The **amino group**. It is also **ionizable** — so at a particular pH the molecule takes on the **zwitterionic form**.", icon: 'circle' },
        { id: uuid(), x: 0.5, y: 0.84, label: 'R group (variable)', detail: "The one position that changes. **R = hydrogen → glycine; methyl → alanine; hydroxy methyl → serine.** Different R group means a different amino acid.", icon: 'circle' },
      ],
    },
    // ── 6 · Heading — classifying amino acids ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Sorting the Twenty — Acidic, Basic, Neutral & Aromatic',
      objective: "By the end of this you can classify an amino acid by its number of amino and carboxyl groups, and give NCERT's named example for each class.",
    },
    // ── 7 · Text — classification + zwitterion ───────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "The chemical and physical properties of an amino acid come from its three functional pieces — the **amino**, the **carboxyl**, and the **R group**. Counting the amino and carboxyl groups gives a clean way to sort them:\n\n- **Acidic** amino acid — example: **glutamic acid**.\n- **Basic** amino acid — example: **lysine**.\n- **Neutral** amino acid — example: **valine**.\n\nSeparately, there are **aromatic amino acids**: **tyrosine, phenylalanine, and tryptophan**.\n\nOne more property matters: both the **–NH2** and **–COOH** groups are **ionizable**. So in solutions of different **pH**, the structure of an amino acid changes — and at a particular pH it exists in its **zwitterionic form**.",
    },
    // ── 8 · Reasoning prompt — R-group → amino acid matching ──────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "Three amino acids share the exact same α-carbon skeleton — hydrogen, –COOH, –NH2 — and differ only in the R group. Using NCERT's three examples, which of these pairings is WRONG?",
      options: [
        "R = hydrogen → glycine",
        "R = methyl group → alanine",
        "R = hydroxy methyl → valine",
        "R = hydroxy methyl → serine",
      ],
      reveal: "The wrong pairing is 'R = hydroxy methyl → valine'. NCERT ties a hydroxy methyl R group to **serine**, not valine. (Valine is named elsewhere as the example of a *neutral* amino acid, but not by its R group here.) The correct three R-group cases are exactly: hydrogen → glycine, methyl → alanine, and hydroxy methyl → serine — which is why the glycine, alanine and serine pairings are all fine.",
      difficulty_level: 2,
    },
    // ── 9 · Heading — lipids ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 9, level: 2,
      text: 'Lipids — Fatty Acids, Glycerol & the Fats They Form',
      objective: "By the end of this you can describe a fatty acid, state the carbon counts for palmitic and arachidonic acid, and say what glycerol plus fatty acids build.",
    },
    // ── 10 · Text — fatty acids, carbon counts, saturation ───────────────────
    {
      id: uuid(), type: 'text', order: 10,
      markdown: "**Lipids are generally water insoluble.** The simplest ones are **fatty acids**. A fatty acid is just a **carboxyl group attached to an R group** — where that R group is a **methyl (–CH3)**, an **ethyl (–C2H5)**, or a longer chain of **–CH2 groups (anywhere from 1 to 19 carbons)**.\n\nTwo carbon counts NCERT states outright:\n- **Palmitic acid = 16 carbons**, including the carboxyl carbon.\n- **Arachidonic acid = 20 carbon atoms**, including the carboxyl carbon.\n\nA fatty acid is either **saturated** (no double bond) or **unsaturated** (one or more **C=C double bonds**). Hold on to that difference — it decides everything about how the fat behaves.",
    },
    // ── 11 · Comparison card — saturated vs unsaturated ──────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 11,
      title: 'Saturated vs Unsaturated Fatty Acids',
      columns: [
        {
          heading: 'Saturated fatty acid',
          points: [
            'Has NO double bond in its carbon chain.',
            'The carbon chain is "filled up" with hydrogens — no C=C.',
            'A fatty acid = a carboxyl group attached to an R group (methyl, ethyl, or a chain of –CH2 groups).',
          ],
        },
        {
          heading: 'Unsaturated fatty acid',
          points: [
            'Has one or more C=C double bonds in its carbon chain.',
            'Arachidonic acid (20 carbons) is a fatty acid NCERT names in this discussion.',
            'Same basic build — carboxyl group plus an R group — but with double bond(s) present.',
          ],
        },
      ],
    },
    // ── 12 · Text — glycerol, glycerides, fats vs oils, phospholipids ────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "Another simple lipid is **glycerol**, which chemically is **trihydroxy propane**. Many lipids carry both glycerol and fatty acids together — the **fatty acids are esterified with glycerol**. Depending on how many fatty acids attach, you get **monoglycerides, diglycerides, or triglycerides**. These are also called **fats and oils**, sorted by their melting point.\n\n**Oils have a lower melting point** — for example **gingelly oil**, which stays liquid (remains an oil) even in winter.\n\nSome lipids contain **phosphorus and a phosphorylated organic compound** — these are **phospholipids**, found in the **cell membrane**; **lecithin** is one example. And some tissues, especially **neural tissues**, have lipids with **more complex structures**.",
    },
    // ── 13 · Remember callout ────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **α-amino acid** = amino group + acidic (carboxyl) group on the **same carbon** (the α-carbon). Four groups on that carbon: **H, –COOH, –NH2, and a variable R group**.\n- **R group decides identity:** H → **glycine**, methyl → **alanine**, hydroxy methyl → **serine**. Only **20 types** occur in proteins.\n- **Classes:** acidic = **glutamic acid**, basic = **lysine**, neutral = **valine**; aromatic = **tyrosine, phenylalanine, tryptophan**.\n- **–NH2 and –COOH are ionizable** → structure changes with pH → **zwitterionic form** at a particular pH.\n- **Palmitic acid = 16 C, arachidonic acid = 20 C** (both counts include the carboxyl carbon).\n- **Glycerol = trihydroxy propane.** Fatty acids esterified with it → mono-/di-/triglycerides (fats and oils). **Oils = lower melting point** (gingelly oil).\n- **Phospholipids** = phosphorus + phosphorylated compound; in the **cell membrane**; example **lecithin**.",
    },
    // ── 14 · Exam tip ────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Memorise the carbon counts — NEET lifts them verbatim:** palmitic acid has **16 carbons** and arachidonic acid has **20 carbons**, both *including the carboxyl carbon*.\n\n**Keep the classification examples straight:** acidic → **glutamic acid**, basic → **lysine**, neutral → **valine**. Swapping these (calling lysine acidic, or valine basic) is the classic trap.\n\n**Don't confuse the two ways an amino acid gets named:** R = hydroxy methyl gives **serine**; valine is named as the **neutral** example, not by an R group. Mixing these up is exactly how the question is set to catch you.\n\n**Classic NEET question:** \"How many carbon atoms does palmitic acid have?\" → **16 carbons, including the carboxyl carbon** — not 20 (that's arachidonic acid).",
    },
    // ── 15 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 15,
      markdown: "You can now build an amino acid on its α-carbon, sort the twenty into acidic, basic and neutral, and describe the fatty acids and glycerol that make up lipids. Next, you'll meet the other two building blocks of life — the **sugars** (carbohydrates) and the **nucleotides** that make up nucleic acids.",
    },
    // ── 16 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 16, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Why are the amino acids that occur in proteins called α-amino acids?",
          options: [
            "Because their amino group and acidic group are attached to the same carbon, the α-carbon",
            "Because they were the very first, or 'alpha', biomolecules to be discovered",
            "Because their R group is always an alpha-shaped ring of carbon atoms",
            "Because they each contain exactly twenty carbon atoms in a chain",
          ],
          correct_index: 0,
          explanation: "NCERT's definition is precise: an amino group AND an acidic group sit on the same carbon, the α-carbon — that shared position is what earns the name α-amino acid. The other options invent reasons (discovery order, a ring-shaped R group, a fixed carbon count) that NCERT never states.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "An amino acid keeps the same H, –COOH and –NH2 on its α-carbon, and its R group is a methyl group. Which amino acid is it?",
          options: [
            "Glycine",
            "Alanine",
            "Serine",
            "Valine",
          ],
          correct_index: 1,
          explanation: "NCERT ties a methyl R group to alanine. Glycine has a hydrogen as its R group and serine has a hydroxy methyl group, so both are ruled out. Valine is named as the neutral-amino-acid example, not by an R group here — a tempting distractor if you mix up the two naming systems.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which pairing of an amino acid with its class is correct, according to NCERT?",
          options: [
            "Glutamic acid — basic amino acid",
            "Valine — acidic amino acid",
            "Lysine — basic amino acid",
            "Tyrosine — neutral amino acid",
          ],
          correct_index: 2,
          explanation: "NCERT lists lysine as the example of a basic amino acid. Glutamic acid is the acidic example (not basic), valine is the neutral example (not acidic), and tyrosine is an aromatic amino acid (not neutral). Each wrong option swaps a real NCERT organism into the wrong class.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which statement about lipids is correct as stated in NCERT?",
          options: [
            "Palmitic acid has 20 carbons and arachidonic acid has 16 carbons, both including the carboxyl carbon",
            "Glycerol is a trihydroxy propane and lipids are generally water soluble",
            "Oils have a higher melting point than fats, which is why gingelly oil stays liquid in winter",
            "Palmitic acid has 16 carbons and arachidonic acid has 20 carbons, both including the carboxyl carbon",
          ],
          correct_index: 3,
          explanation: "NCERT states palmitic acid has 16 carbons and arachidonic acid has 20, both counting the carboxyl carbon — so option 1 is right and option 2 swaps them. Option 3 is wrong because lipids are generally water INsoluble (though glycerol being trihydroxy propane is correct). Option 4 is wrong because oils have a LOWER melting point, which is exactly why gingelly oil stays liquid in winter.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
